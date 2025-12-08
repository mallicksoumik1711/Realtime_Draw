import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token automatically for every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllUsers = async () => {
  const res = await API.get("/users");
  return res.data.users;
};

export const getUserById = async (id) => {
  const res = await API.get(`/users/${id}`);
  return res.data.user;
};
