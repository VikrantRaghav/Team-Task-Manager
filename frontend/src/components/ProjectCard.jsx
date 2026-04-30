import { Link } from "react-router-dom";

const ProjectCard = ({ project, isAdmin, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <h3 className="font-semibold text-lg">{project.name}</h3>
      <p className="text-sm text-slate-600 mt-1">{project.description || "No description"}</p>
      <p className="text-xs text-slate-500 mt-2">Members: {project.members?.length || 0}</p>
      <div className="flex flex-wrap gap-2">
        <Link to={`/projects/${project._id}`} className="inline-block text-blue-600 text-sm">
          View details
        </Link>
        {isAdmin && (
          <>
            <button onClick={() => onEdit(project)} className="text-sm rounded border px-2 py-1">
              Edit
            </button>
            <button
              onClick={() => onDelete(project)}
              className="text-sm rounded border border-red-300 text-red-600 px-2 py-1"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
