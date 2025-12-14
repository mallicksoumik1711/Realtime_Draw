import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    byConversation: {}, // { [conversationId]: Message[] }
    activeConversationId: null,
  },

  reducers: {
    setActiveConversation(state, action) {
      state.activeConversationId = action.payload;
    },

    setMessages(state, action) {
      const { conversationId, messages } = action.payload;
      state.byConversation[conversationId] = messages;
    },

    addMessage(state, action) {
      const message = action.payload;
      const conversationId = message.conversationId;

      if (!state.byConversation[conversationId]) {
        state.byConversation[conversationId] = [];
      }
      const exists = state.byConversation[conversationId].some(
        (m) => m._id === message._id
      );
      if (!exists) {
        state.byConversation[conversationId].push(message);
      }
    },

    addOptimisticMessage(state, action) {
      const { conversationId, text, tempId, senderId, attachments } =
        action.payload;
      if (!state.byConversation[conversationId]) {
        state.byConversation[conversationId] = [];
      }
      state.byConversation[conversationId].push({
        _id: tempId,
        conversationId,
        text,
        senderId,
        attachments: attachments || [],
        createdAt: new Date().toISOString(),
        optimistic: true,
      });
    },

    replaceOptimisticMessage(state, action) {
      const { conversationId, tempId, realMessage } = action.payload;
      const list = state.byConversation[conversationId] || [];
      const idx = list.findIndex((m) => m._id === tempId);
      if (idx !== -1) {
        list[idx] = realMessage;
        // Remove any accidental duplicates by real id
        state.byConversation[conversationId] = list.filter(
          (m, i) => m._id !== realMessage._id || i === idx
        );
      }
    },

    deleteMessage(state, action) {
      const { conversationId, messageId } = action.payload;

      state.byConversation[conversationId] =
        state.byConversation[conversationId]?.filter(
          (m) => m._id !== messageId
        ) || [];
    },

    markConversationRead(state, action) {
      const conversationId = action.payload;

      state.byConversation[conversationId]?.forEach((m) => {
        m.read = true;
      });
    },

    clearConversation(state, action) {
      const conversationId = action.payload;
      state.byConversation[conversationId] = [];
    },
  },
});

export const {
  setActiveConversation,
  setMessages,
  addMessage,
  addOptimisticMessage,
  replaceOptimisticMessage,
  deleteMessage,
  markConversationRead,
  clearConversation,
} = messagesSlice.actions;

export default messagesSlice.reducer;
