import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const CreateProject = () => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Project name is required");
      return;
    }
    try {
      setLoading(true);
      await api.post("/projects", form);
      toast.success("Project created");
      navigate("/projects");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-white rounded-lg shadow p-6 space-y-4 max-w-xl" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold">Create Project</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input className="w-full border rounded p-2" placeholder="Project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <textarea className="w-full border rounded p-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <button disabled={loading} className="bg-slate-800 text-white rounded px-4 py-2 disabled:opacity-70">
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
};

export default CreateProject;
