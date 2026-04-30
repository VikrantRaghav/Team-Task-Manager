import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import UserSearchSelect from "../components/UserSearchSelect";
import { useAuth } from "../context/AuthContext";

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProject = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  useEffect(() => {
    if (user?.role !== "admin") return;
    const loadUsers = async () => {
      try {
        const { data } = await api.get("/auth/users");
        setUsers(data.filter((u) => u.role === "member"));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch users");
      }
    };
    loadUsers();
  }, [user?.role]);

  const addMember = async () => {
    if (!memberId) return;
    try {
      setSaving(true);
      await api.patch(`/projects/${id}/add-member`, { memberId });
      setMemberId("");
      toast.success("Member added");
      loadProject();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member");
    } finally {
      setSaving(false);
    }
  };

  const removeMember = async (selectedMemberId) => {
    if (!window.confirm("Remove this member from project?")) return;
    try {
      setSaving(true);
      await api.patch(`/projects/${id}/remove-member`, { memberId: selectedMemberId });
      toast.success("Member removed");
      loadProject();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove member");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading project..." />;
  if (!project) return <EmptyState title="Project not found" description="This project may have been removed." />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <p className="text-slate-600">{project.description || "No description"}</p>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-2">Members</h2>
        <ul className="text-sm space-y-2">
          {project.members.map((m) => (
            <li key={m._id} className="flex items-center justify-between">
              <span>
                {m.name} ({m.email})
              </span>
              {user.role === "admin" && (
                <button
                  onClick={() => removeMember(m._id)}
                  className="rounded border border-red-300 px-2 py-1 text-xs text-red-600"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      {user.role === "admin" && (
        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <h3 className="font-semibold">Add Member</h3>
          <UserSearchSelect
            users={users}
            selectedId={memberId}
            onSelect={setMemberId}
            searchValue={search}
            onSearchChange={setSearch}
          />
          <button disabled={saving} className="bg-slate-800 text-white px-4 py-2 rounded disabled:opacity-70" onClick={addMember}>
            {saving ? "Saving..." : "Add Member"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
