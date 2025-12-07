import { Check, X } from "lucide-react";

export default function Notification() {
  const notifications = [
    {
      id: 1,
      name: "John Doe",
      message: "sent you a message",
      time: "Just now",
    },
    {
      id: 2,
      name: "Sarah Miller",
      message: "sent you a message",
      time: "10 min ago",
    },
    {
      id: 3,
      name: "Alex Carter",
      message: "sent you a message",
      time: "Yesterday",
    },
  ];

  const total = notifications.length;

  return (
    <div className="mx-auto mt-6 bg-white/80 backdrop-blur-xl rounded-3xl px-2 sm:px-10 py-6 shadow-lg">
      <h1 className="text-lg font-semibold text-gray-900 mb-6">
        {total} Notifications
      </h1>

      <div className="space-y-3">
        {notifications.map((n, index) => (
          <div
            key={index}
            className="
              bg-white/70 backdrop-blur-xl border border-gray-200 rounded-xl
              px-2 py-4 shadow-sm hover:shadow-md transition gap-5

              flex items-center justify-between sm:flex-row sm:items-center sm:justify-between
            "
          >
            {/* LEFT SECTION */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                {n.name.charAt(0)}
              </div>

              <div>
                <p className="text-gray-800 font-medium">{n.name}</p>
                <p className="text-gray-600 text-sm">{n.message}</p>

                {/* Time (visible on mobile) */}
                <p className="text-gray-500 text-xs mt-1 sm:hidden">{n.time}</p>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-2 sm:mt-0">
              {/* Time (desktop only — unchanged) */}
              <span className="text-gray-500 text-sm hidden sm:block">
                {n.time}
              </span>

              <button className="p-2 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition">
                <Check className="w-4 h-4" />
              </button>

              <button className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
