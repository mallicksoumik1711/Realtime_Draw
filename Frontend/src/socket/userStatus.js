import { io } from "socket.io-client";
import { setOnlineUser, setOfflineUser, setAllOnlineUsers } from "../store/onlineUsersSlice";
import store from "../store/index";

let socket;

export const connectUserSocket = (userId) => {
  socket = io("http://localhost:5000", { auth: { userId } });

  socket.on("user_online", (id) => {
    store.dispatch(setOnlineUser(id));
  });

  socket.on("user_offline", (id) => {
    store.dispatch(setOfflineUser(id));
  });

  socket.on("online_users", (users) => {
    store.dispatch(setAllOnlineUsers(users));
  });
};

export const disconnectUserSocket = () => {
  if (socket) socket.disconnect();
};
