
import { configureStore } from "@reduxjs/toolkit";
import onlineUsersReducer from "./onlineUsersSlice";
import notificationsReducer from "./notificationsSlice";
import messagesReducer from "./messagesSlice";
import toastReducer from "./toastSlice";

export const store = configureStore({
  reducer: {
    onlineUsers: onlineUsersReducer,
    notifications: notificationsReducer,
    messages: messagesReducer,
    toast: toastReducer,
  },
});

export default store;
