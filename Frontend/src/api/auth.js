import axios from "axios";

const API = axios.create({
  baseURL: "https://realtime-draw-koya.onrender.com/api",   // vercel backend url TODO
});

// -------------------- AUTH APIs --------------------

export const registerUser = async (formData) => {
  return API.post("/auth/register", formData);
};

export const loginUser = async (formData) => {
  return API.post("/auth/login", formData);
};