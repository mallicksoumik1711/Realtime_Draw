import { useNavigate } from "react-router-dom";

export default function RoomCard({ room, isMenuOpen, onMenuToggle }) {
  const navigate = useNavigate();

  return (
    <div
      key={room._id}
      className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="h-40 sm:h-48 overflow-hidden rounded-t-3xl">
        <img
          src={`https://picsum.photos/seed/${room._id}/600/400`}
          alt={room.name}
          className="w-full h-full object-cover"
          onClick={() => navigate(`/draw/${room._id}`)}
        />
      </div>

      {/* Content */}
      <div className="p-6 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="font-semibold text-gray-900 text-base sm:text-lg truncate cursor-pointer"
            onClick={() => navigate(`/draw/${room._id}`)}
          >
            {room.name || "Untitled Drawing"}
          </h3>

          {/* Three Dots Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuToggle(room._id);
            }}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <svg
              className="w-4 h-4 text-gray-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            {new Date(room.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>

          {room.accessControl === "public" && (
            <button
              // onClick={() => navigate("/users")}
              onClick={() => navigate(`/users?roomId=${room._id}`)}
              className="text-xs text-teal-600 font-medium mt-2 hover:text-teal-700 cursor-pointer"
            >
              Invite friends
            </button>
          )}
        </div>
      </div>

      {/* Dropdown*/}
      {isMenuOpen && (
        <div
          className="absolute top-2 right-2 w-40 bg-white rounded-2xl shadow-2xl border border-gray-200 ring-4 ring-white z-[9999]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 rounded-b-2xl"
            onClick={() => {
              if (confirm("Delete this drawing?"))
                console.log("Deleted", room._id);
              onMenuToggle(null);
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
