import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate, status } = req.body;
    if (!title || !project || !assignedTo) {
      return res.status(400).json({ message: "Title, project and assignee are required" });
    }
    if (dueDate && new Date(dueDate) < new Date(new Date().toDateString())) {
      return res.status(400).json({ message: "Due date cannot be in the past" });
    }

    const projectDoc = await Project.findById(project);
    if (!projectDoc) return res.status(404).json({ message: "Project not found" });
    if (projectDoc.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only project admin can create tasks" });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      dueDate,
      status,
      createdBy: req.user._id
    });
    const populated = await task.populate(["project", "assignedTo"]);
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { status, project, assignedTo } = req.query;
    const filter = {};

    if (req.user.role === "member") filter.assignedTo = req.user._id;
    if (status) filter.status = status;
    if (project) filter.project = project;
    if (assignedTo && req.user.role === "admin") filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate("project", "name")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    if (req.user.role === "admin") return res.json(tasks);

    const visible = tasks.filter((t) => t.assignedTo && t.assignedTo._id.toString() === req.user._id.toString());
    return res.json(visible);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role === "member") {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You can only update your own tasks" });
      }
      task.status = req.body.status || task.status;
      await task.save();
      const populated = await task.populate(["project", "assignedTo"]);
      return res.json(populated);
    }

    if (task.project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only project admin can update task details" });
    }

    const { title, description, assignedTo, status, dueDate } = req.body;
    if (dueDate && new Date(dueDate) < new Date(new Date().toDateString())) {
      return res.status(400).json({ message: "Due date cannot be in the past" });
    }
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;
    await task.save();
    const populated = await task.populate(["project", "assignedTo"]);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const task = await Task.findById(req.params.id).populate("project");
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only project admin can delete task" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
