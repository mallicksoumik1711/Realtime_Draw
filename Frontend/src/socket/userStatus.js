import { io } from "socket.io-client";
import {
  setOnlineUser,
  setOfflineUser,
  setAllOnlineUsers,
} from "../store/onlineUsersSlice";
import store from "../store/index";
import {addNotification, updateNotificationStatus, removeNotification} from "../store/notificationsSlice";

let socket;

export const connectUserSocket = (userId) => {
  // Disconnect any existing socket before reconnecting
  if (socket) {
    try { socket.disconnect(); } 
    catch (err) {
      console.log("Error disconnecting existing socket:", err);
    }
  }
  const uid = String(userId || "");
  socket = io("http://localhost:5000", {
    auth: { userId: uid },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    // eslint-disable-next-line no-console
    console.log("socket connected", socket.id, "for user", uid);
  });
  socket.on("connect_error", (err) => {
    // eslint-disable-next-line no-console
    console.warn("socket connect_error", err?.message);
  });

  socket.on("user_online", (id) => {
    store.dispatch(setOnlineUser(id));
  });

  socket.on("user_offline", (id) => {
    store.dispatch(setOfflineUser(id));
  });

  socket.on("online_users", (users) => {
    store.dispatch(setAllOnlineUsers(users));
  });

  socket.on("new_notification", (notification) => {
    store.dispatch(addNotification(notification));
  });

  socket.on("update_notification_status", ({ notificationId, status }) => {
    store.dispatch(updateNotificationStatus({ id: notificationId, status }));
  });

  // inviter gets a response when recipient accepts/declines
  socket.on("invite_response", ({ notificationId, status, by, byName }) => {
    // For inviter, create a lightweight notification entry
    store.dispatch(addNotification({
      _id: notificationId,
      from: by,
      fromName: byName || "",
      status,
      role: "inviter",
      createdAt: new Date().toISOString(),
    }));
  });

  // optional: allow server to instruct removal
  socket.on("remove_notification", (notificationId) => {
    store.dispatch(removeNotification(notificationId));
  });
};

export const disconnectUserSocket = () => {
  if (socket) socket.disconnect();
};
