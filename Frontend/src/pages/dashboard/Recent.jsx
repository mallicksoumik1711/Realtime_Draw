import { useEffect, useState } from "react";
import { getMyRooms } from "../../api/room";
import { useNavigate } from "react-router-dom";
import RoomCard from "../../components/RoomCard";

export default function Recent() {
  const [rooms, setRooms] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const handleRoomDeleted = (roomId) => {
    setRooms((prev) => prev.filter((r) => r._id !== roomId));
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    getMyRooms(token)
      .then((res) => setRooms(res.rooms || []))
      .catch(console.error);
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {rooms.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 inline-block px-12 py-10">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-9 h-9 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">No drawings yet</p>
              </div>
            </div>
          ) : (
            rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                isMenuOpen={openMenu === room._id}
                onMenuToggle={(id) => setOpenMenu(openMenu === id ? null : id)}
                onRoomDeleted={handleRoomDeleted} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
