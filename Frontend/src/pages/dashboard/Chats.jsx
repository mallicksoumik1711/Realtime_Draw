import { useState, useEffect, useMemo, useRef } from "react";
import { MoreVertical, Send, ArrowLeft, Trash2 } from "lucide-react";
import { getAllUsers } from "../../api/user";
import { useDispatch, useSelector } from "react-redux";
import {
  initChatSocket,
  joinConversation,
  leaveConversation,
  sendMessage as sendChatMessage,
} from "../../socket/chat";
import {
  setActiveConversation,
  addOptimisticMessage,
  replaceOptimisticMessage,
} from "../../store/messagesSlice";
import { getLoggedInUserId } from "../../utils/loggedInUser";
import axios from "axios";
import { setMessages, clearConversation, markConversationRead } from "../../store/messagesSlice";

function Chats() {
  const dispatch = useDispatch();
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputText, setInputText] = useState("");
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const onlineUsers = useSelector((state) => state.onlineUsers);
  const messagesByConv = useSelector((state) => state.messages.byConversation);
  const [userConversationMap, setUserConversationMap] = useState({}); // { userId: conversationId }

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
      setFilteredUsers(data);
    });
  }, []);

  // Load existing conversations to build user->conversation map
  useEffect(() => {
    const token = localStorage.getItem("token");
    const base = import.meta.env.VITE_API_URL || "https://realtime-draw-koya.onrender.com/api";
    if (!token) return;
    axios
      .get(`${base}/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const map = {};
        const myId = getLoggedInUserId();
        res.data.forEach((c) => {
          if (c.isGroup) return;
          const other = (c.participants || []).map((p) => String(p._id || p)).find((id) => id !== String(myId));
          if (other) map[other] = String(c._id);
        });
        setUserConversationMap(map);
      })
      .catch(() => {});
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

  // Init chat socket once
  useEffect(() => {
    const userId = getLoggedInUserId();
    const token = localStorage.getItem("token");
    if (userId && token) {
      initChatSocket(userId, token);
    }
  }, []);

  // Join/leave conversation when selection changes
  useEffect(() => {
    if (!selectedChat) return;
    dispatch(setActiveConversation(selectedChat));
    // Load history for this 1:1 conversation if Conversation model exists
    // Assume a conversation endpoint to ensure a conversation between two users
    const token = localStorage.getItem("token");
    const base = import.meta.env.VITE_API_URL || "https://realtime-draw-koya.onrender.com/api";
    // Find or create conversation for the pair
    const myId = getLoggedInUserId();
    axios
      .post(`${base}/conversations/resolve`, { fromUserId: myId, toUserId: selectedChat }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const conversationId = res.data.conversationId || res.data._id;
        setActiveConversationId(conversationId);
        // Join per-conversation room on socket
        joinConversation(conversationId);
        return axios.get(`${base}/messages/${conversationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((msgRes) => {
          dispatch(setMessages({
            conversationId,
            messages: msgRes.data.map((m) => ({
              _id: String(m._id),
              conversationId,
              senderId: String(m.sender),
              text: m.text,
              attachments: m.attachments || [],
              createdAt: m.createdAt,
              read: !!m.read,
            })),
          }));
          // Mark as read on open
          axios.patch(`${base}/messages/read/${conversationId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(()=>{});
          dispatch(markConversationRead(conversationId));
        });
      })
      .catch(() => {})
    ;
    return () => {
      if (activeConversationId) leaveConversation(activeConversationId);
      setActiveConversationId(null);
    };
  }, [selectedChat, dispatch]);

  const selectedChatData = users.find((user) => user._id === selectedChat);

  const messagesFromStore = useSelector(
    (state) => state.messages.byConversation[activeConversationId]
  );
  const messages = messagesFromStore || [];

  // Auto-scroll to bottom when messages update
  const scrollRef = useRef(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length, selectedChat]);

  const myUserId = useMemo(() => getLoggedInUserId(), []);

  const canSend = useMemo(() => inputText.trim().length > 0 && !!selectedChat, [inputText, selectedChat]);

  const handleSend = () => {
    if (!canSend) return;
    const tempId = `temp_${Date.now()}`;
    dispatch(addOptimisticMessage({
      conversationId: activeConversationId,
      text: inputText,
      tempId,
      senderId: myUserId,
    }));
    sendChatMessage(
      { conversationId: activeConversationId, text: inputText, tempId },
      (serverMessage) => {
        if (serverMessage && serverMessage._id) {
          dispatch(
            replaceOptimisticMessage({
              conversationId: activeConversationId,
              tempId,
              realMessage: serverMessage,
            })
          );
        }
      }
    );
    setInputText("");
  };

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
                    {/* UNREAD BADGE */}
                    {(() => {
                      const convId = userConversationMap[user._id];
                      const list = convId ? (messagesByConv[convId] || []) : [];
                      const unread = list.filter((m) => !m.read && m.senderId !== getLoggedInUserId()).length;
                      return unread > 0 ? (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                          {unread}
                        </span>
                      ) : null;
                    })()}
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

              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-2 rounded-md hover:bg-gray-100"
                  aria-label="Chat menu"
                >
                  <MoreVertical className="w-5 h-5 text-gray-700" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600"
                      onClick={async () => {
                        if (!activeConversationId) return;
                        try {
                          const base = import.meta.env.VITE_API_URL || "https://realtime-draw-koya.onrender.com/api";
                          const token = localStorage.getItem("token");
                          await axios.delete(`${base}/messages/conversation/${activeConversationId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          dispatch(clearConversation(activeConversationId));
                          setMenuOpen(false);
                        } catch (e) {
                          console.error("Delete chat failed", e);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" /> Delete chat
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500">No messages yet</p>
              ) : (
                messages.map((m) => {
                  const isMine = m.senderId === myUserId;
                  return (
                    <div
                      key={m._id}
                      className={`flex ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-6 py-2 rounded-xl max-w-xs md:max-w-md shadow-md ${
                          isMine
                            ? "bg-teal-700 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p className="text-sm md:text-base">{m.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isMine ? "text-teal-200" : "text-gray-500"
                          }`}
                        >
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {m.optimistic ? " • sending..." : ""}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Bar - ONLY SEND ICON */}
            <div className="px-2 py-4 md:p-5 border-t border-gray-200/50">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-5 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 transition"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                />
                <button
                  className="p-3 bg-teal-700 text-white rounded-full shadow hover:bg-teal-800 transition disabled:opacity-50"
                  onClick={handleSend}
                  disabled={!canSend}
                >
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
