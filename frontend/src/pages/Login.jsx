import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setError("Enter a valid email address");
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", form);
      login(data);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form className="bg-white shadow rounded-lg p-6 w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <h1 className="text-xl font-bold">Login</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input className="w-full border rounded p-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading} className="w-full bg-slate-800 text-white rounded p-2 disabled:opacity-70">
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm">No account? <Link className="text-blue-600" to="/register">Register</Link></p>
      </form>
    </div>
  );
};

export default Login;
