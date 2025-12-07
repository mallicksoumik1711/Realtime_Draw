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

module.exports = { createRoom, getMyRooms };




