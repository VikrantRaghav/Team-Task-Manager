import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <Link to="/dashboard" className="font-bold text-lg text-slate-800">
          Team Task Manager
        </Link>
        {user && (
          <div className="flex items-center gap-4 text-sm">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/tasks">Tasks</NavLink>
            {user.role === "admin" && <NavLink to="/projects/create">New Project</NavLink>}
            {user.role === "admin" && <NavLink to="/tasks/create">New Task</NavLink>}
            <span className="text-slate-500">{user.name}</span>
            <button onClick={logout} className="px-3 py-1 rounded bg-slate-800 text-white">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
