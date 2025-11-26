import { motion } from "framer-motion"; //eslint-disable-line no-unused-vars
import { Palette, Activity, TrendingUp, Users, Plus } from "lucide-react";

// creating room modal
import { useState } from "react";
import RoomModel from "../../components/RoomModel";
import { createRoom } from "../../api/room";

function Dashboard() {
  const [openRoomModal, setOpenRoomModal] = useState(false);
  const handleCreateRoom = async (roomData) => {
    try {
      const token = localStorage.getItem("token");

      const userId = JSON.parse(localStorage.getItem("user"))._id;

      const payload = {
        ...roomData,
        owner: userId,
      };

      const res = await createRoom(payload, token);
      console.log("Room created:", res);
    } catch (error) {
      console.error(error);
      alert("Failed to create room");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* room model */}
      <RoomModel
        isOpen={openRoomModal}
        onClose={() => setOpenRoomModal(false)}
        onCreate={handleCreateRoom}
      />

      {/* Welcome card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-200/50">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-700 mt-1">
            Ready to draw something amazing today?
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpenRoomModal(true)}
          className="flex items-center gap-3 px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-xl"
        >
          <Plus className="w-6 h-6" /> New Drawing
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Active", value: "6", change: "+2 today", icon: Activity },
          {
            label: "Drawings",
            value: "248",
            change: "+12 week",
            icon: Palette,
          },
          { label: "Online", value: "89", change: "42 now", icon: Users },
          {
            label: "Streak",
            value: "12d",
            change: "Keep going!",
            icon: TrendingUp,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-md border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-7 h-7 text-teal-700" />
              <span className="text-xs text-teal-600 font-medium">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 p-10 text-center">
        <Palette className="w-16 h-16 sm:w-20 sm:h-20 text-teal-600 mx-auto mb-4 opacity-40" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          Your canvas is ready
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mt-2">
          Start drawing or join a live session
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
