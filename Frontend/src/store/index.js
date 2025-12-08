// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import onlineUsersReducer from "./onlineUsersSlice";

export const store = configureStore({
  reducer: {
    onlineUsers: onlineUsersReducer,
  },
});

export default store;
