import { useState } from "react";
import { motion } from "framer-motion"; //eslint-disable-line no-unused-vars

export default function RoomModel({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [accessControl, setAccessControl] = useState("public");
  const [sessionPurpose, setSessionPurpose] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) return alert("Room name is required");

    const roomId = await onCreate({
      name,
      accessControl,
      sessionPurpose,
    });

    if (!roomId) return; // prevent redirect to undefined

    setName("");
    setSessionPurpose("");
    onClose();

    // Redirect to drawing room
    window.location.href = `/draw/${roomId}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-2xl shadow-xl w-[90%] sm:w-[400px]"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Create New Room
        </h2>

        <label className="text-sm font-medium">Room Name</label>
        <input
          type="text"
          className="w-full border p-2 rounded-lg mt-1 mb-3"
          placeholder="My Awesome Room"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="text-sm font-medium">Access Control</label>
        <select
          className="w-full border p-2 rounded-lg mt-1 mb-3"
          value={accessControl}
          onChange={(e) => setAccessControl(e.target.value)}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <label className="text-sm font-medium">Session Purpose</label>
        <input
          type="text"
          className="w-full border p-2 rounded-lg mt-1 mb-3"
          placeholder="Optional"
          value={sessionPurpose}
          onChange={(e) => setSessionPurpose(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Create
          </button>
        </div>
      </motion.div>
    </div>
  );
}
