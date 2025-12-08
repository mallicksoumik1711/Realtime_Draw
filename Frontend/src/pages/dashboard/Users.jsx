import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useEffect } from "react";
import { getAllUsers } from "../../api/user";
import { useSelector } from "react-redux";

export default function Users() {
  const onlineUsers = useSelector((state) => state.onlineUsers);

  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getAllUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error loading users:", err));
  }, []);

  const filteredUsers =
    filter === "active" ? users.filter((u) => onlineUsers[u._id]) : users;

  return (
    <div className="min-h-screen bg-[url('https://svgshare.com/i/vHf.svg')] bg-repeat">
      {/* Main Container - Full width on mobile, max-width on larger screens */}
      <div className="mx-auto w-full">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-2 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-xl font-bold text-gray-900">
                Users ({filteredUsers.length})
              </h1>
              <select
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
              </select>
            </div>
          </div>

          {/* Desktop Table - Hidden on mobile */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user, idx) => (
                  <tr
                    key={user._id || idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-teal-50/50"}
                  >
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img
                        src={user.avatar || "/default-avatar.png"}
                        alt={user.name || "User"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-900">
                        {user.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          onlineUsers[user._id]
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {onlineUsers[user._id] ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <MoreHorizontal className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer inline-block" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List - Visible on small screens */}
          <div className="lg:hidden">
            {filteredUsers.map((user, idx) => (
              <div
                key={user._id || idx}
                className={`px-1 py-4 border-b border-gray-200 ${
                  idx % 2 === 0 ? "bg-white" : "bg-teal-50/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      alt={user.name || "User"}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-900 truncate">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {/* Status Dot (Mobile) */}
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        onlineUsers[user._id] ? "bg-green-500" : "bg-red-500"
                      }`}
                    />

                    <MoreHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
