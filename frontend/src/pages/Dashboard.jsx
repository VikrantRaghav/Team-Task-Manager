import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import DashboardCard from "../components/DashboardCard";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    recentTasks: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/dashboard");
        setStats(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="Total Projects" value={stats.totalProjects} icon="📁" />
        <DashboardCard title="Total Tasks" value={stats.totalTasks} icon="📝" />
        <DashboardCard title="Pending Tasks" value={stats.pendingTasks} icon="⏳" />
        <DashboardCard title="In Progress Tasks" value={stats.inProgressTasks} icon="🚧" />
        <DashboardCard title="Completed Tasks" value={stats.completedTasks} icon="✅" />
        <DashboardCard title="Overdue Tasks" value={stats.overdueTasks} icon="⚠️" highlight />
      </div>
      <div className="bg-white rounded-lg shadow p-5 space-y-3">
        <h2 className="text-lg font-semibold">Recent Tasks</h2>
        {stats.recentTasks?.length ? (
          <div className="space-y-2">
            {stats.recentTasks.map((task) => (
              <div key={task._id} className="rounded border p-3 text-sm">
                <p className="font-medium">{task.title}</p>
                <p className="text-slate-500">
                  {task.project?.name} - {task.assignedTo?.name}
                </p>
                <p className="text-slate-600 mt-1">Status: {task.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No recent tasks" description="Tasks will appear here after they are created." />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
