import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",   // vercel backend url TODO
});

// -------------------- AUTH APIs --------------------

export const registerUser = async (formData) => {
  return API.post("/auth/register", formData);
};

export const loginUser = async (formData) => {
  return API.post("/auth/login", formData);
};