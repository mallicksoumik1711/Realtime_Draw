const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const sendMessage = async (req, res) => {
  try {
    const { conversationId, receiverId, text } = req.body;
    const senderId = req.user.id;

    if (!conversationId || !receiverId || !text) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const message = await Message.create({
      conversationId,
      sender: senderId,
      receiver: receiverId,
      text,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Send message error:", error.message);
    res.status(500).json({ message: "Failed to send message" });
  }
};

const getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get messages error:", error.message);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // only sender can delete
    if (String(message.sender) !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await message.deleteOne();

    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    console.error("Delete message error:", error.message);
    res.status(500).json({ message: "Failed to delete message" });
  }
};

const markMessagesRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    await Message.updateMany(
      { conversationId, receiver: userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Mark read error:", error.message);
    res.status(500).json({ message: "Failed to mark messages read" });
  }
};

const deleteConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const Conversation = require("../models/Conversation");
    const convo = await Conversation.findById(conversationId).exec();
    if (!convo || !convo.participants.map(String).includes(String(userId))) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Message.deleteMany({ conversationId });
    res.status(200).json({ message: "Conversation messages deleted" });
  } catch (error) {
    console.error("Delete conversation messages error:", error.message);
    res.status(500).json({ message: "Failed to delete conversation messages" });
  }
};

module.exports = {
  sendMessage,
  getMessagesByConversation,
  deleteMessage,
  markMessagesRead,
  deleteConversationMessages,
};
