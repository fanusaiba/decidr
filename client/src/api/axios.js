import axios from "axios";

const api = axios.create({
  baseURL: "https://decidr-uy0t.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // optional but safe
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("decidr_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
