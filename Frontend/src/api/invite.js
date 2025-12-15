import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || "https://realtime-draw-koya.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const sendInviteAPI = async (toUserId, roomId) => {
  const res = await API.post("/invite/send", { toUserId, roomId });
  return res.data;
};

export const acceptInviteAPI = async (notificationId) => {
  const res = await API.post("/invite/accept", { notificationId });
  return res.data;
};

export const rejectInviteAPI = async (notificationId) => {
  const res = await API.post("/invite/reject", { notificationId });
  return res.data;
};

export const getMyNotificationsAPI = async () => {
  const res = await API.get("/invite/mine");
  return res.data.notifications || [];
};

export const deleteNotificationAPI = async (notificationId) => {
  const res = await API.delete(`/invite/${notificationId}`);
  return res.data;
};

export const cancelInviteAPI = async ({ notificationId, recipientId }) => {
  const res = await API.post("/invite/cancel", { notificationId, recipientId });
  return res.data;
};
