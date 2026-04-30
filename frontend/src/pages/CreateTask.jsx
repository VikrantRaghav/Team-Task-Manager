import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import UserSearchSelect from "../components/UserSearchSelect";

const CreateTask = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    dueDate: "",
    status: "Pending"
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [projectsRes, usersRes] = await Promise.all([api.get("/projects"), api.get("/auth/users")]);
        setProjects(projectsRes.data);
        setUsers(usersRes.data.filter((u) => u.role === "member"));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load form data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.project || !form.assignedTo) {
      setError("Title, project and assignee are required");
      return;
    }
    if (form.dueDate) {
      const selected = new Date(form.dueDate);
      const today = new Date(new Date().toDateString());
      if (selected < today) {
        setError("Due date cannot be in the past");
        return;
      }
    }
    try {
      setSaving(true);
      await api.post("/tasks", form);
      toast.success("Task created");
      navigate("/tasks");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading task form..." />;

  return (
    <form className="bg-white rounded-lg shadow p-6 space-y-4 max-w-xl" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold">Create Task</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input className="w-full border rounded p-2" placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea className="w-full border rounded p-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <select className="w-full border rounded p-2" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}>
        <option value="">Select project</option>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>
            {project.name}
          </option>
        ))}
      </select>
      <UserSearchSelect
        users={users}
        selectedId={form.assignedTo}
        onSelect={(value) => setForm({ ...form, assignedTo: value })}
        searchValue={search}
        onSearchChange={setSearch}
      />
      <input className="w-full border rounded p-2" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
      <button disabled={saving} className="bg-slate-800 text-white rounded px-4 py-2 disabled:opacity-70">
        {saving ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
};

export default CreateTask;
