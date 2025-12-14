const express = require('express');
const router = express.Router();
const {resolveConversation, getMyConversations} = require('../controllers/conversationController');

const authMiddleware = require("../middlewares/auth");

router.post("/resolve", authMiddleware, resolveConversation);
router.get("/", authMiddleware, getMyConversations);

module.exports = router;