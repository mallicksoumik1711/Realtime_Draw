import { io } from "socket.io-client";
import { store } from "../store/index";
import { addMessage } from "../store/messagesSlice";

let chatSocket;
const boundHandlers = new Map();
const joinedConversations = new Set();
// let currentUserId;

// Event names 
const EVENTS = {
  CONNECT: "chat:connect",
  DISCONNECT: "chat:disconnect",
  CONVERSATION_JOIN: "chat:conversation:join",
  CONVERSATION_LEAVE: "chat:conversation:leave",
  MESSAGE_SEND: "chat:message:send",
  MESSAGE_NEW: "chat:message:new",
  MESSAGE_READ: "chat:message:read",
};

export const initChatSocket = (userId, token) => {
  if (chatSocket?.connected) return chatSocket;

  // const baseUrl = import.meta.env.VITE_SOCKET_URL;
  const baseUrl = `https://realtime-draw-koya.onrender.com`
  if (!baseUrl) {
    console.warn("VITE_SOCKET_URL is not set. Skipping chat socket init.");
    return undefined;
  }

  chatSocket = io(baseUrl, {
    auth: { token },
    query: { userId },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

//   currentUserId = String(userId);

  chatSocket.on("connect", () => {
    // Rejoin previously joined conversations after reconnect
    for (const id of joinedConversations) {
      chatSocket.emit(EVENTS.CONVERSATION_JOIN, { conversationId: id });
    }
  });

  chatSocket.on("disconnect", () => {
    // No-op; reconnection is handled by Socket.IO
  });

  // Inbound message handler
  bindHandler(EVENTS.MESSAGE_NEW, "MESSAGE_NEW", (message) => {
    // For per-conversation rooms, use server-provided conversationId directly
    store.dispatch(addMessage(message));
  });

  return chatSocket;
};

export const getChatSocket = () => chatSocket;

export const joinConversation = (conversationId) => {
  if (!chatSocket) return;
  joinedConversations.add(conversationId);
  chatSocket.emit(EVENTS.CONVERSATION_JOIN, { conversationId });
};

export const leaveConversation = (conversationId) => {
  if (!chatSocket) return;
  joinedConversations.delete(conversationId);
  chatSocket.emit(EVENTS.CONVERSATION_LEAVE, { conversationId });
};

export const sendMessage = (
  { conversationId, text, attachments, tempId },
  ackCb
) => {
  if (!chatSocket) return;
  chatSocket.emit(
    EVENTS.MESSAGE_SEND,
    { conversationId, text, attachments, tempId },
    (serverMessage) => {
      // Acknowledgement from server with the persisted message
      if (typeof ackCb === "function") ackCb(serverMessage);
    }
  );
};

export const markConversationRead = (conversationId) => {
  if (!chatSocket) return;
  chatSocket.emit(EVENTS.MESSAGE_READ, { conversationId });
};

export const disconnectChatSocket = () => {
  if (!chatSocket) return;
  // Cleanup handlers before disconnect
  for (const [event, handler] of boundHandlers.entries()) {
    chatSocket.off(event, handler);
  }
  boundHandlers.clear();
  chatSocket.disconnect();
  chatSocket = undefined;
  joinedConversations.clear();
};

// Internal: ensure one handler per event
function bindHandler(event, key, fn) {
  const existing = boundHandlers.get(event);
  if (existing) chatSocket.off(event, existing);
  chatSocket.on(event, fn);
  boundHandlers.set(event, fn);
}
