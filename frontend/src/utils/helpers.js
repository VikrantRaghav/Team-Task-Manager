export const statusColor = (status) => {
  if (status === "Completed") return "bg-green-100 text-green-700";
  if (status === "In Progress") return "bg-yellow-100 text-yellow-700";
  return "bg-slate-100 text-slate-700";
};
