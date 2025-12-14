const Conversation = require("../models/Conversation");

const resolveConversation = async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;

    if (!fromUserId || !toUserId) {
      return res.status(400).json({ message: "User IDs required" });
    }

    const participants = [fromUserId, toUserId];
    // Try to find existing 1:1 conversation regardless of order
    let convo = await Conversation.findOne({
      participants: { $all: participants },
      isGroup: false,
    }).exec();

    if (!convo) {
      convo = await Conversation.create({ participants, isGroup: false });
    }

    res.status(200).json({ _id: convo._id });
  } catch (error) {
    console.error("Resolve conversation error:", error.message);
    res.status(500).json({ message: "Failed to resolve conversation" });
  }
};

const getMyConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name avatar status")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Get conversations error:", error.message);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

module.exports = { resolveConversation, getMyConversations };
