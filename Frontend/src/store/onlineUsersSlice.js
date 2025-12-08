import { createSlice } from "@reduxjs/toolkit";

const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState: {}, // { userId: true/false }
  reducers: {
    setOnlineUser: (state, action) => {
      state[action.payload] = true;
    },
    setOfflineUser: (state, action) => {
      state[action.payload] = false;
    },
    setAllOnlineUsers: (state, action) => {
      // action.payload = array of online userIds
      const obj = {};
      action.payload.forEach((id) => (obj[id] = true));
      return obj;
    },
  },
});

export const { setOnlineUser, setOfflineUser, setAllOnlineUsers } =
  onlineUsersSlice.actions;

export default onlineUsersSlice.reducer;
