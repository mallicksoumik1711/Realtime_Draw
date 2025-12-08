const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    const users = await User.find({ _id: { $ne: loggedInUserId } })
      .select("-password");

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { name, avatar, accessControl, inviteFriends } = req.body;
    const updateData = {};

    if (name) {
      updateData.name = name;
    }
    if (avatar) {
      updateData.avatar = avatar;
    }
    if (accessControl) {
      updateData.accessControl = accessControl;
    }

    if (Array.isArray(inviteFriends)) {
      updateData.inviteFriends = inviteFriends;
    }

    const updateUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updateUser,
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await User.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const q = req.query.q;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }
    const users = await User.find({
      name: { $regex: q, $options: "i" },
    }).select("name email avatar");

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

module.exports = { getAllUsers, getUser, updateUser, deleteUser, searchUsers };
