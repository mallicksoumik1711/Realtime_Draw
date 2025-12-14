const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessagesByConversation,
  deleteMessage,
  markMessagesRead,
  deleteConversationMessages,
} = require("../controllers/messageController");

const authMiddleware = require("../middlewares/auth");
router.post("/", authMiddleware, sendMessage);
router.get("/:conversationId", authMiddleware, getMessagesByConversation);
router.patch("/read/:conversationId", authMiddleware, markMessagesRead);
router.delete("/:messageId", authMiddleware, deleteMessage);

// Delete all messages in a conversation
router.delete("/conversation/:conversationId", authMiddleware, deleteConversationMessages);

module.exports = router;
