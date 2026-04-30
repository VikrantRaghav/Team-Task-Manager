import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_URL?.trim();
const normalizedBaseUrl = rawBaseUrl
  ? rawBaseUrl.replace(/\/+$/, "").endsWith("/api")
    ? rawBaseUrl.replace(/\/+$/, "")
    : `${rawBaseUrl.replace(/\/+$/, "")}/api`
  : "http://localhost:5000/api";

const api = axios.create({
  baseURL: normalizedBaseUrl
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
