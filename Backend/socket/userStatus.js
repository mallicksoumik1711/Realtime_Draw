const User = require("../models/User");

// Track online users in-memory for quick broadcasts
const onlineUsers = new Set();

module.exports = (io) => {
  io.on("connection", async (socket) => {
    const userId = socket.handshake.query?.userId || socket.handshake.auth?.userId;

    if (!userId) return;

    try {
      await User.findByIdAndUpdate(userId, { status: "active" }).exec();
      onlineUsers.add(String(userId));
      io.emit("user_online", String(userId));
      io.emit("online_users", Array.from(onlineUsers));
      console.log("User active:", userId);
    } catch (e) {
      console.error("Failed to mark active:", userId, e.message);
    }

    socket.on("disconnect", async () => {
      try {
        await User.findByIdAndUpdate(userId, { status: "inactive" }).exec();
        onlineUsers.delete(String(userId));
        io.emit("user_offline", String(userId));
        io.emit("online_users", Array.from(onlineUsers));
        console.log("User inactive:", userId);
      } catch (e) {
        console.error("Failed to mark inactive:", userId, e.message);
      }
    });
  });
};
