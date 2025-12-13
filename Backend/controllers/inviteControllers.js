const User = require("../models/User");
const Room = require("../models/Room");
const { getIO } = require("../socket/io");

const sendInvite = async (req, res) => {
  try {
    const { toUserId, roomId } = req.body;
    const fromUserId = req.user.id;

    // make sure room exists
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ msg: "Room not found" });

    // push notification to recipient and get the created subdoc id
    const recipient = await User.findById(toUserId);
    if (!recipient) return res.status(404).json({ msg: "Recipient not found" });

    recipient.notifications.push({
      from: fromUserId,
      room: roomId,
      status: "pending",
    });
    const created = recipient.notifications[recipient.notifications.length - 1];
    await recipient.save();

    // populate minimal fields for frontend
    const fromUser = await User.findById(fromUserId).select("name");
    const io = getIO();
    if (io) {
      io.to(String(toUserId)).emit("new_notification", {
        _id: created._id,
        from: String(fromUserId),
        fromName: fromUser?.name || "",
        room: String(roomId),
        status: created.status,
        createdAt: created.createdAt,
      });
    }

    res.json({ msg: "Invite sent!", notificationId: created._id });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// const acceptInvite = async (req, res) => {
//   try {
//     const { notificationId } = req.body;
//     const userId = req.user.id;

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ msg: "User not found" });

//     const notif = user.notifications.id(notificationId);
//     if (!notif) return res.status(404).json({ msg: "Notification not found" });
//     if (notif.status !== "pending") {
//       return res.status(400).json({ msg: "Invite is not pending" });
//     }

//     notif.status = "accepted";
//     await user.save();

//     const io = getIO();
//     if (io) {
//       // notify recipient (current user) UI update
//       io.to(String(userId)).emit("update_notification_status", {
//         notificationId: String(notif._id),
//         status: "accepted",
//       });
//       // also notify inviter their invite was accepted, include name
//       const byUser = await User.findById(userId).select("name");
//       io.to(String(notif.from)).emit("invite_response", {
//         notificationId: String(notif._id),
//         status: "accepted",
//         by: String(userId),
//         byName: byUser?.name || "",
//       });
//     }

//     res.json({ msg: "Invite accepted" });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

const acceptInvite = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const notif = user.notifications.id(notificationId);
    if (!notif || notif.status !== "pending") {
      return res.status(400).json({ msg: "Invalid invite" });
    }

    notif.status = "accepted";
    await user.save();

    // ✅ ADD RECEIVER TO ROOM
    await Room.updateOne(
      { _id: notif.room },
      { $addToSet: { participants: userId } }
    );

    const io = getIO();
    if (io) {
      // update receiver notification
      io.to(String(userId)).emit("update_notification_status", {
        notificationId: String(notif._id),
        status: "accepted",
      });

      // notify sender
      const byUser = await User.findById(userId).select("name");
      io.to(String(notif.from)).emit("invite_response", {
        notificationId: String(notif._id),
        status: "accepted",
        by: String(userId),
        byName: byUser?.name || "",
        roomId: String(notif.room), // 🔥 IMPORTANT
      });

      // 🔥 TELL RECEIVER TO JOIN ROOM
      io.to(String(userId)).emit("join_room_after_accept", {
        roomId: String(notif.room),
      });
    }

    res.json({ msg: "Invite accepted", roomId: notif.room });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const rejectInvite = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const notif = user.notifications.id(notificationId);
    if (!notif) return res.status(404).json({ msg: "Notification not found" });
    if (notif.status !== "pending") {
      return res.status(400).json({ msg: "Invite is not pending" });
    }

    notif.status = "declined";
    await user.save();

    const io = getIO();
    if (io) {
      io.to(String(userId)).emit("update_notification_status", {
        notificationId: String(notif._id),
        status: "declined",
      });
      const byUser = await User.findById(userId).select("name");
      io.to(String(notif.from)).emit("invite_response", {
        notificationId: String(notif._id),
        status: "declined",
        by: String(userId),
        byName: byUser?.name || "",
      });
    }

    res.json({ msg: "Invite declined" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate({ path: "notifications.from", select: "name" })
      .select("notifications");
    if (!user) return res.status(404).json({ msg: "User not found" });

    const notifications = user.notifications.map((n) => ({
      _id: n._id,
      from: String(n.from?._id || n.from),
      fromName: n.from?.name || "",
      room: String(n.room),
      status: n.status,
      createdAt: n.createdAt,
    }));

    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Delete a single notification from the logged-in user's list
const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // notification id

    const user = await User.findById(userId).select("_id notifications._id");
    if (!user) return res.status(404).json({ msg: "User not found" });

    const exists = user.notifications.some((n) => String(n._id) === String(id));
    if (!exists) return res.status(404).json({ msg: "Notification not found" });

    await User.updateOne(
      { _id: userId },
      { $pull: { notifications: { _id: id } } }
    );

    const io = getIO();
    if (io) {
      io.to(String(userId)).emit("remove_notification", String(id));
    }

    res.json({ msg: "Notification removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Sender cancels a previously sent pending invite
const cancelInvite = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { notificationId, recipientId } = req.body;

    // Ensure recipient exists and that the notification belongs to sender and is pending
    const recipient = await User.findById(recipientId).select(
      "_id notifications"
    );
    if (!recipient) return res.status(404).json({ msg: "Recipient not found" });

    const target = recipient.notifications.find(
      (n) =>
        String(n._id) === String(notificationId) &&
        String(n.from) === String(senderId) &&
        n.status === "pending"
    );
    if (!target)
      return res.status(404).json({ msg: "Pending invite not found" });

    // Mark as cancelled instead of removing; receiver can dismiss manually
    await User.updateOne(
      { _id: recipientId, "notifications._id": notificationId },
      { $set: { "notifications.$.status": "cancelled" } }
    );

    const io = getIO();
    if (io) {
      // Update recipient UI to show cancelled state
      io.to(String(recipientId)).emit("update_notification_status", {
        notificationId: String(notificationId),
        status: "cancelled",
      });
      // Inform sender UI
      io.to(String(senderId)).emit("invite_response", {
        notificationId: String(notificationId),
        status: "cancelled",
        by: String(senderId),
        byName: (await User.findById(senderId).select("name"))?.name || "",
      });
    }

    res.json({ msg: "Invite cancelled" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = {
  sendInvite,
  acceptInvite,
  rejectInvite,
  getMyNotifications,
  deleteNotification,
  cancelInvite,
};
