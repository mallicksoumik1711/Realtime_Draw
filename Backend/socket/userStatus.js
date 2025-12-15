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
      // console.log("User active:", userId);
    } catch (e) {
      console.error("Failed to mark active:", userId, e.message);
    }

    socket.on("join_room", (roomId) => {
      socket.join(`room:${roomId}`);
      // console.log("joined draw room:", roomId);
    });

    socket.on("leave_room", (roomId) => {
      socket.leave(`room:${roomId}`);
      // console.log("left draw room:", roomId);
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
        // console.log("User inactive:", userId);
      } catch (e) {
        console.error("Failed to mark inactive:", userId, e.message);
      }
    });

    // --- Draw Room realtime events ---
    socket.on("join_room", (roomId) => {
      if (!roomId) return;
      socket.join(String(roomId));
      // console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on("leave_room", (roomId) => {
      if (!roomId) return;
      socket.leave(String(roomId));
      // console.log(`Socket ${socket.id} left room ${roomId}`);
    });

    socket.on("draw", ({ roomId, data }) => {
      if (!roomId || !data) return;
      // Broadcast the draw action to everyone else in the room
      socket.to(String(roomId)).emit("draw", data);
    });

    // --- Chat realtime events with persistence ---
    const Conversation = require("../models/Conversation");
    const Message = require("../models/Message");

    socket.on("chat:conversation:join", ({ conversationId }) => {
      if (!conversationId) return;
      socket.join(String(conversationId));
      // console.log(`Chat: ${socket.id} joined conversation ${conversationId}`);
    });

    socket.on("chat:conversation:leave", ({ conversationId }) => {
      if (!conversationId) return;
      socket.leave(String(conversationId));
      // console.log(`Chat: ${socket.id} left conversation ${conversationId}`);
    });

    socket.on(
      "chat:message:send",
      async ({ conversationId, text, attachments = [], tempId }, ack) => {
        try {
          if (!conversationId || !text) {
            if (typeof ack === "function") ack(null);
            return;
          }

          // Ensure conversation exists and current user is a participant
          const convo = await Conversation.findById(conversationId).exec();
          if (!convo || !convo.participants.map(String).includes(String(userId))) {
            if (typeof ack === "function") ack(null);
            return;
          }

          // Persist message
          const saved = await Message.create({
            conversationId,
            sender: userId,
            receiver:
              convo.participants.map(String).find((id) => id !== String(userId)),
            text,
            attachments,
          });

          // Update conversation lastMessage
          await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: saved._id,
          }).exec();

          const payload = {
            _id: String(saved._id),
            conversationId: String(conversationId),
            senderId: String(saved.sender),
            text: saved.text,
            attachments: saved.attachments || [],
            createdAt: saved.createdAt,
          };

          // Broadcast to conversation room (per-conversation room)
          socket.to(String(conversationId)).emit("chat:message:new", payload);
          if (typeof ack === "function") ack(payload);
        } catch (err) {
          console.error("chat:message:send failed", err);
          if (typeof ack === "function") ack(null);
        }
      }
    );
  });
};
