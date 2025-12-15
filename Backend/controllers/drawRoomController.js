const Room = require("../models/Room");

const createRoom = async (req, res) => {
  try {
    const { name, accessControl, inviteUsers, sessionPurpose } = req.body;

    const room = await Room.create({
      name,
      owner: req.user.id,
      accessControl,
      inviteUsers: inviteUsers || [],
      sessionPurpose: sessionPurpose || "",
    });

    return res.status(201).json({
      success: true,
      room,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ owner: req.user.id }).populate(
      "inviteUsers"
    );

    return res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Only owner can delete
    if (String(room.owner) !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await room.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createRoom, getMyRooms, getRoomById, deleteRoom };