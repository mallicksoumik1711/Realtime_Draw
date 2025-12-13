import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: [], // array of notification objects
  reducers: {
    // setNotifications: (state, action) => action.payload,
    setNotifications: (state, action) =>    
      action.payload.map((n) => ({ ...n, _id: String(n._id) })),

    // addNotification: (state, action) => {
    //   state.push(action.payload);
    // },
    addNotification: (state, action) => {
      const incoming = { ...action.payload, _id: String(action.payload._id) };
      const idx = state.findIndex((n) => n._id === incoming._id);
      if (idx !== -1) {
        state[idx] = { ...state[idx], ...incoming };
      } else {
        state.unshift(incoming);
      }
    },

    updateNotificationStatus: (state, action) => {
      const { id, status } = action.payload;
      const notif = state.find((n) => n._id === String(id));
      if (notif) notif.status = status;
    },
    removeNotification: (state, action) =>
      state.filter((n) => n._id !== action.payload),
  },
});

export const {
  setNotifications,
  addNotification,
  updateNotificationStatus,
  removeNotification,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
