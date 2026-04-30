import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import TaskCard from "../components/TaskCard";
import UserSearchSelect from "../components/UserSearchSelect";
import { useAuth } from "../context/AuthContext";

const Tasks = () => {
  const { user } = useAuth();
  const userId = user?.id || user?._id;
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ status: "", project: "", assignedTo: "" });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.project) params.project = filters.project;
      if (filters.assignedTo) params.assignedTo = filters.assignedTo;
      const { data } = await api.get("/tasks", { params });
      setTasks(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters.status, filters.project, filters.assignedTo]);

  useEffect(() => {
    const preloadFilters = async () => {
      try {
        const { data } = await api.get("/projects");
        setProjects(data);
        if (user?.role === "admin") {
          const usersResponse = await api.get("/auth/users");
          setUsers(usersResponse.data.filter((u) => u.role === "member"));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load filters");
      }
    };
    preloadFilters();
  }, [user?.role]);

  const updateStatus = async (id, status) => {
    try {
      setSaving(true);
      await api.put(`/tasks/${id}`, { status });
      toast.success("Task status updated");
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  const deleteTask = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    try {
      setSaving(true);
      await api.delete(`/tasks/${task._id}`);
      toast.success("Task deleted");
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    } finally {
      setSaving(false);
    }
  };

  const saveTaskEdit = async () => {
    if (!editingTask.title.trim() || !editingTask.project || !editingTask.assignedTo) {
      toast.error("Title, project and assignee are required");
      return;
    }
    if (editingTask.dueDate) {
      const selected = new Date(editingTask.dueDate);
      const today = new Date(new Date().toDateString());
      if (selected < today) {
        toast.error("Due date cannot be in the past");
        return;
      }
    }

    try {
      setSaving(true);
      await api.put(`/tasks/${editingTask._id}`, editingTask);
      toast.success("Task updated");
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Tasks</h1>
        {saving && <span className="text-sm text-slate-500">Saving changes...</span>}
      </div>
      <div className="grid sm:grid-cols-3 gap-2">
        <select className="border rounded p-2" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <select className="border rounded p-2" value={filters.project} onChange={(e) => setFilters({ ...filters, project: e.target.value })}>
          <option value="">All Projects</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
        {user.role === "admin" ? (
          <UserSearchSelect
            users={users}
            selectedId={filters.assignedTo}
            onSelect={(value) => setFilters({ ...filters, assignedTo: value })}
            searchValue={assigneeSearch}
            onSearchChange={setAssigneeSearch}
            placeholder="Search assignee"
          />
        ) : (
          <div />
        )}
      </div>
      {loading ? (
        <LoadingSpinner label="Loading tasks..." />
      ) : tasks.length === 0 ? (
        <EmptyState title="No tasks found" description="Try changing filters or create a new task." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              canEditStatus={task.assignedTo?._id === userId || user.role === "admin"}
              onStatusChange={updateStatus}
              isAdmin={user.role === "admin"}
              onEditTask={(selected) =>
                setEditingTask({
                  _id: selected._id,
                  title: selected.title,
                  description: selected.description || "",
                  project: selected.project?._id || "",
                  assignedTo: selected.assignedTo?._id || "",
                  dueDate: selected.dueDate ? selected.dueDate.slice(0, 10) : "",
                  status: selected.status
                })
              }
              onDeleteTask={deleteTask}
            />
          ))}
        </div>
      )}

      {editingTask && (
        <div className="bg-white rounded-lg shadow p-5 space-y-3">
          <h2 className="text-lg font-semibold">Edit Task</h2>
          <input
            className="w-full border rounded p-2"
            value={editingTask.title}
            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
            placeholder="Title"
          />
          <textarea
            className="w-full border rounded p-2"
            value={editingTask.description}
            onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
            placeholder="Description"
          />
          <select
            className="w-full border rounded p-2"
            value={editingTask.project}
            onChange={(e) => setEditingTask({ ...editingTask, project: e.target.value })}
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          <UserSearchSelect
            users={users}
            selectedId={editingTask.assignedTo}
            onSelect={(value) => setEditingTask({ ...editingTask, assignedTo: value })}
            searchValue={assigneeSearch}
            onSearchChange={setAssigneeSearch}
          />
          <input
            className="w-full border rounded p-2"
            type="date"
            value={editingTask.dueDate}
            onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
          />
          <select
            className="w-full border rounded p-2"
            value={editingTask.status}
            onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <div className="flex gap-2">
            <button className="bg-slate-800 text-white rounded px-4 py-2" onClick={saveTaskEdit}>
              Save
            </button>
            <button className="rounded border px-4 py-2" onClick={() => setEditingTask(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
