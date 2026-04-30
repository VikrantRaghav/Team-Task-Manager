import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import ProjectCard from "../components/ProjectCard";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete project "${project.name}" and all related tasks?`)) return;
    try {
      setSaving(true);
      await api.delete(`/projects/${project._id}`);
      toast.success("Project deleted");
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    } finally {
      setSaving(false);
    }
  };

  const saveProjectEdit = async () => {
    if (!editingProject.name.trim()) {
      toast.error("Project name is required");
      return;
    }
    try {
      setSaving(true);
      await api.put(`/projects/${editingProject._id}`, {
        name: editingProject.name,
        description: editingProject.description
      });
      setEditingProject(null);
      toast.success("Project updated");
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Projects</h1>
        {saving && <span className="text-sm text-slate-500">Saving changes...</span>}
      </div>
      {loading ? (
        <LoadingSpinner label="Loading projects..." />
      ) : projects.length === 0 ? (
        <EmptyState title="No projects found" description="Create a new project to get started." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              isAdmin={user?.role === "admin"}
              onEdit={(selected) => setEditingProject({ ...selected })}
              onDelete={deleteProject}
            />
          ))}
        </div>
      )}
      {editingProject && (
        <div className="bg-white rounded-lg shadow p-5 space-y-3">
          <h2 className="text-lg font-semibold">Edit Project</h2>
          <input
            className="w-full border rounded p-2"
            value={editingProject.name}
            onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
            placeholder="Project name"
          />
          <textarea
            className="w-full border rounded p-2"
            value={editingProject.description || ""}
            onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
            placeholder="Description"
          />
          <div className="flex gap-2">
            <button className="bg-slate-800 text-white rounded px-4 py-2" onClick={saveProjectEdit}>
              Save
            </button>
            <button className="rounded border px-4 py-2" onClick={() => setEditingProject(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
