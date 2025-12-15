import { io } from "socket.io-client";
import {
  setOnlineUser,
  setOfflineUser,
  setAllOnlineUsers,
} from "../store/onlineUsersSlice";
import store from "../store/index";
import {addNotification, updateNotificationStatus, removeNotification} from "../store/notificationsSlice";

let socket;
const joinedRooms = new Set();

export const connectUserSocket = (userId) => {
  // Disconnect any existing socket before reconnecting
  if (socket && socket.connected) {
    return socket;
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
    // console.log("socket connected", socket.id, "for user", uid);
    // Rejoin any rooms tracked locally (e.g., draw rooms)
    joinedRooms.forEach((roomId) => {
      try { socket.emit("join_room", String(roomId)); } catch {
        console.log("Failed to re-join room on reconnect:", roomId);
      }
    });
  });
  socket.on("connect_error", (err) => {
    // eslint-disable-next-line no-console
    console.warn("socket connect_error", err?.message);
  });

  socket.off("user_online");
  socket.on("user_online", (id) => {
    store.dispatch(setOnlineUser(id));
  });

  socket.off("user_offline");
  socket.on("user_offline", (id) => {
    store.dispatch(setOfflineUser(id));
  });

  socket.off("online_users");
  socket.on("online_users", (users) => {
    store.dispatch(setAllOnlineUsers(users));
  });

  socket.off("new_notification");
  socket.on("new_notification", (notification) => {
    store.dispatch(addNotification(notification));
  });

  socket.off("update_notification_status");
  socket.on("update_notification_status", ({ notificationId, status }) => {
    store.dispatch(updateNotificationStatus({ id: notificationId, status }));
  });

  // inviter gets a response when recipient accepts/declines
  socket.off("invite_response");
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
  socket.off("remove_notification");
  socket.on("remove_notification", (notificationId) => {
    store.dispatch(removeNotification(notificationId));
  });
};

export const disconnectUserSocket = () => {
  if (socket) socket.disconnect();
};

export const getSocket = () => socket;

export const joinRoom = (roomId) => {
  const s = getSocket();
  const rid = String(roomId || "");
  if (!rid) return;
  joinedRooms.add(rid);
  if (s && s.connected) {
    try { s.emit("join_room", rid); } catch {
      console.log("Failed to join room:", rid);
    }
  } else if (s) {
    s.once("connect", () => {
      try { s.emit("join_room", rid); } catch {
        console.log("Failed to join room on connect:", rid);
      }
    });
  }
};

export const leaveRoom = (roomId) => {
  const s = getSocket();
  const rid = String(roomId || "");
  if (!rid) return;
  joinedRooms.delete(rid);
  if (s && s.connected) {
    try { s.emit("leave_room", rid); } catch {
      console.log("Failed to leave room:", rid);
    }
  }
};
