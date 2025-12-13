const express = require("express");

const {
  createRoom,
  getMyRooms,
  getRoomById,
} = require("../controllers/drawRoomController.js");
const authMiddleware = require("../middlewares/auth.js");

const router = express.Router();

router.post("/create", authMiddleware, createRoom);
router.get("/myrooms", authMiddleware, getMyRooms);
router.get("/:id", authMiddleware, getRoomById);

module.exports = router;