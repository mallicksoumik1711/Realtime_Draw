const express = require("express");

const {
  createRoom,
  getMyRooms,
} = require("../controllers/drawRoomController.js");
const authMiddleware = require("../middlewares/auth.js");

const router = express.Router();

router.post("/create", authMiddleware, createRoom);
router.get("/myrooms", authMiddleware, getMyRooms);

module.exports = router;