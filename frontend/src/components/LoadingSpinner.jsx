const LoadingSpinner = ({ label = "Loading..." }) => (
  <div className="flex items-center justify-center gap-3 py-8 text-slate-600">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
    <span>{label}</span>
  </div>
);

export default LoadingSpinner;
