import { statusColor } from "../utils/helpers";

const TaskCard = ({ task, onStatusChange, canEditStatus, isAdmin, onEditTask, onDeleteTask }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded ${statusColor(task.status)}`}>{task.status}</span>
      </div>
      <p className="text-sm text-slate-600">{task.description || "No description"}</p>
      <p className="text-xs text-slate-500">Project: {task.project?.name}</p>
      <p className="text-xs text-slate-500">Assigned: {task.assignedTo?.name}</p>
      {canEditStatus && (
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="w-full border rounded p-2 text-sm"
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      )}
      {isAdmin && (
        <div className="flex gap-2 pt-2">
          <button onClick={() => onEditTask(task)} className="text-sm rounded border px-2 py-1">
            Edit
          </button>
          <button
            onClick={() => onDeleteTask(task)}
            className="text-sm rounded border border-red-300 text-red-600 px-2 py-1"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
