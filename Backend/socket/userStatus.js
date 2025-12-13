const User = require("../models/User");

// Track online users in-memory for quick broadcasts
const onlineUsers = new Set();

module.exports = (io) => {
  io.on("connection", async (socket) => {
    const userId =
      socket.handshake.query?.userId || socket.handshake.auth?.userId;

    if (!userId) return;

    try {
      await User.findByIdAndUpdate(userId, { status: "active" }).exec();
      onlineUsers.add(String(userId));
      // join a room named by userId for targeted emits
      socket.join(String(userId));
      io.emit("user_online", String(userId));
      io.emit("online_users", Array.from(onlineUsers));
      console.log("User active:", userId);
    } catch (e) {
      console.error("Failed to mark active:", userId, e.message);
    }

    socket.on("join_room", (roomId) => {
      socket.join(`room:${roomId}`);
      console.log("joined draw room:", roomId);
    });

    socket.on("leave_room", (roomId) => {
      socket.leave(`room:${roomId}`);
      console.log("left draw room:", roomId);
    });

    socket.on("draw", ({ roomId, data }) => {
      socket.to(`room:${roomId}`).emit("draw", data);
    });

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

    // --- Draw Room realtime events ---
    socket.on("join_room", (roomId) => {
      if (!roomId) return;
      socket.join(String(roomId));
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on("leave_room", (roomId) => {
      if (!roomId) return;
      socket.leave(String(roomId));
      console.log(`Socket ${socket.id} left room ${roomId}`);
    });

    socket.on("draw", ({ roomId, data }) => {
      if (!roomId || !data) return;
      // Broadcast the draw action to everyone else in the room
      socket.to(String(roomId)).emit("draw", data);
    });
  });
};
