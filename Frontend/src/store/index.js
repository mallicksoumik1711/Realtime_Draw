
import { configureStore } from "@reduxjs/toolkit";
import onlineUsersReducer from "./onlineUsersSlice";
import notificationsReducer from "./notificationsSlice";
import toastReducer from "./toastSlice";

export const store = configureStore({
  reducer: {
    onlineUsers: onlineUsersReducer,
    notifications: notificationsReducer,
    toast: toastReducer,
  },
});

export default store;
