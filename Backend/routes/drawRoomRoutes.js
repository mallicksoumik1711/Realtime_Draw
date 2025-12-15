const express = require("express");

const {
  createRoom,
  getMyRooms,
  getRoomById,
  deleteRoom
} = require("../controllers/drawRoomController.js");
const authMiddleware = require("../middlewares/auth.js");

const router = express.Router();

router.post("/create", authMiddleware, createRoom);
router.get("/myrooms", authMiddleware, getMyRooms);
router.get("/:id", authMiddleware, getRoomById);
router.delete("/:id", authMiddleware, deleteRoom);

module.exports = router;