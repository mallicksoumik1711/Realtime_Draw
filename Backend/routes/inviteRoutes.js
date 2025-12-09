const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.js");
const { sendInvite, acceptInvite, rejectInvite, getMyNotifications, deleteNotification, cancelInvite } = require("../controllers/inviteControllers.js");

router.post("/send", authMiddleware, sendInvite);
router.post("/accept", authMiddleware, acceptInvite);
router.post("/reject", authMiddleware, rejectInvite);
router.post("/cancel", authMiddleware, cancelInvite);
router.get("/mine", authMiddleware, getMyNotifications);
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;
