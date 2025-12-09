import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visible: false,
  message: "",
  type: "info", // info | success | error | warning
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action) => {
      const { message, type = "info" } = action.payload || {};
      state.visible = true;
      state.message = message || "";
      state.type = type;
    },
    hideToast: (state) => {
      state.visible = false;
      state.message = "";
      state.type = "info";
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
