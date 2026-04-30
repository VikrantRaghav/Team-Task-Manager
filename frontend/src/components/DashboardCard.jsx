const DashboardCard = ({ title, value, icon, highlight = false }) => (
  <div
    className={`rounded-xl border p-5 shadow-sm ${
      highlight ? "bg-red-50 border-red-200" : "bg-white border-slate-200"
    }`}
  >
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-500">{title}</p>
      <span className="text-lg">{icon}</span>
    </div>
    <p className={`text-2xl font-bold mt-2 ${highlight ? "text-red-700" : "text-slate-900"}`}>
      {value}
    </p>
  </div>
);

export default DashboardCard;
