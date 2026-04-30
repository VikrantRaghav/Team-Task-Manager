import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const getDashboardStats = async (req, res) => {
  try {
    let projectFilter = {};
    let taskFilter = {};

    if (req.user.role === "admin") {
      projectFilter = { admin: req.user._id };
      const projectIds = (await Project.find(projectFilter).select("_id")).map((p) => p._id);
      taskFilter = { project: { $in: projectIds } };
    } else {
      projectFilter = { members: { $in: [req.user._id] } };
      taskFilter = { assignedTo: req.user._id };
    }

    const [totalProjects, totalTasks, pendingTasks, inProgressTasks, completedTasks, overdueTasks, recentTasks] =
      await Promise.all([
        Project.countDocuments(projectFilter),
        Task.countDocuments(taskFilter),
        Task.countDocuments({ ...taskFilter, status: "Pending" }),
        Task.countDocuments({ ...taskFilter, status: "In Progress" }),
        Task.countDocuments({ ...taskFilter, status: "Completed" }),
        Task.countDocuments({
          ...taskFilter,
          status: { $ne: "Completed" },
          dueDate: { $lt: new Date() }
        }),
        Task.find(taskFilter)
          .populate("project", "name")
          .populate("assignedTo", "name email")
          .sort({ createdAt: -1 })
          .limit(5)
      ]);

    res.json({
      totalProjects,
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
      recentTasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
