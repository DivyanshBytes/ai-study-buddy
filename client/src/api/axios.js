import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD
    ? "https://ai-study-buddy-8qm6.onrender.com/api"
    : "http://localhost:5000/api"
);

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;