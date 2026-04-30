import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const createProject = async (req, res) => {
  try {
    const { name, description, members = [] } = req.body;
    if (!name) return res.status(400).json({ message: "Project name is required" });
    const project = await Project.create({
      name,
      description,
      admin: req.user._id,
      members
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin"
        ? { admin: req.user._id }
        : { members: { $in: [req.user._id] } };
    const projects = await Project.find(filter).populate("members", "name email role");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("members", "name email role");
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isAdminOwner = project.admin.toString() === req.user._id.toString();
    const isMember = project.members.some((m) => m._id.toString() === req.user._id.toString());
    if (!isAdminOwner && !isMember) return res.status(403).json({ message: "Forbidden" });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, admin: req.user._id });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { name, description } = req.body;
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, admin: req.user._id });
    if (!project) return res.status(404).json({ message: "Project not found" });
    await Task.deleteMany({ project: project._id });
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    const project = await Project.findOne({ _id: req.params.id, admin: req.user._id });
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.members.includes(memberId)) project.members.push(memberId);
    await project.save();
    const populated = await project.populate("members", "name email role");
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    const project = await Project.findOne({ _id: req.params.id, admin: req.user._id });
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.members = project.members.filter((m) => m.toString() !== memberId);
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
