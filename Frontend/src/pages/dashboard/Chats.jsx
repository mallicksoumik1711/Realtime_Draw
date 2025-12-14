import { useState, useEffect } from "react";
import { MoreVertical, Send, Users, ArrowLeft } from "lucide-react";
import { getAllUsers } from "../../api/user";
import { useSelector } from "react-redux";

function Chats() {
  const [selectedChat, setSelectedChat] = useState(null);

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const onlineUsers = useSelector((state) => state.onlineUsers);

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
      setFilteredUsers(data);
    });
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const q = e.detail.toLowerCase();

      if (!q.trim()) {
        setFilteredUsers(users);
        return;
      }

      const result = users.filter((u) => u.name.toLowerCase().includes(q));

      setFilteredUsers(result);
    };

    window.addEventListener("chat-search", handler);
    return () => window.removeEventListener("chat-search", handler);
  }, [users]);

  const selectedChatData = users.find((user) => user._id === selectedChat);

  //   const chatList = [
  //     {
  //       id: 1,
  //       name: "Richard Ray",
  //       avatar: "RR",
  //       online: true,
  //       lastMessage: "Hey, are we still on for the meeting tomorrow?",
  //       time: "07:35 PM",
  //       unread: 0,
  //     },
  //     {
  //       id: 2,
  //       name: "Sarah Beth",
  //       avatar: "SB",
  //       online: true,
  //       lastMessage: "Video",
  //       time: "05:56 PM",
  //       unread: 1,
  //       hasMedia: true,
  //     },
  //     {
  //       id: 3,
  //       name: "Epic Game",
  //       avatar: null,
  //       group: true,
  //       lastMessage: "John Paul: @Robert Just finished the first lev...",
  //       time: "4:30 PM",
  //       unread: 24,
  //     },
  //   ];

  const messages = [
  
  ];

  //   const selectedChatData = chatList.find((chat) => chat.id === selectedChat);

  return (
    <div className="h-full flex flex-col lg:flex-row bg-transparent">
      {/* ==================== CHAT LIST ==================== */}
      <div
        className={`
          ${selectedChat ? "hidden" : "flex"} 
          lg:flex lg:w-96 
          flex-col h-full
          bg-white/80 backdrop-blur-xl
          rounded-3xl shadow-lg border border-gray-200/50 
          overflow-hidden
        `}
      >
        {/* Header */}
        <div className="px-2 py-4 border-b border-gray-200/50">
          <h1 className="text-lg font-bold text-gray-900">Chats</h1>
        </div>

        {/* Chat Items */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500 mt-6">No user found</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedChat(user._id)}
                className="p-4 mx-3 my-2 rounded-2xl cursor-pointer transition-all
                 border border-gray-100 shadow-sm bg-white hover:bg-teal-50"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}

                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-full bg-teal-700 text-white
    flex items-center justify-center font-bold text-lg"
                    >
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    {/* STATUS DOT */}
                    <span
                      className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                        onlineUsers[user._id] ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-400">
                      {/* empty space for now */}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ==================== CHAT VIEW ==================== */}
      <div
        className={`
          ${selectedChat ? "flex" : "hidden lg:flex"} 
          flex-1 flex-col h-full
          bg-white/80 backdrop-blur-xl 
          rounded-3xl shadow-lg border border-gray-200/50 
          overflow-hidden
        `}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-2 md:p-6 border-b border-gray-200/50 flex items-center gap-4">
              {/* Back Button - Mobile Only */}
              <button
                onClick={() => setSelectedChat(null)}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 text-gray-700" />
              </button>

              {/* Avatar + Name */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold">
                  {selectedChatData?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
              </div>

              <div className="flex-1">
                <h2 className="font-bold text-gray-900 text-lg">
                  {selectedChatData?.name}
                </h2>
                <p
                  className={`text-sm ${
                    onlineUsers[selectedChat]
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {onlineUsers[selectedChat] ? "Active" : "Inactive"}
                </p>
              </div>

              <MoreVertical className="w-6 h-6 text-gray-600 cursor-pointer" />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.sent ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                      px-6 py-2 rounded-xl max-w-xs md:max-w-md shadow-md
                      ${
                        m.sent
                          ? "bg-teal-700 text-white"
                          : "bg-gray-200 text-gray-800"
                      }
                    `}
                  >
                    <p className="text-sm md:text-base">{m.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        m.sent ? "text-teal-200" : "text-gray-500"
                      }`}
                    >
                      {m.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar - ONLY SEND ICON */}
            <div className="px-2 py-4 md:p-5 border-t border-gray-200/50">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-5 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 transition"
                />
                <button className="p-3 bg-teal-700 text-white rounded-full shadow hover:bg-teal-800 transition">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 items-center justify-center hidden lg:flex">
            <p className="text-gray-500 text-lg">
              Select a chat to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chats;
