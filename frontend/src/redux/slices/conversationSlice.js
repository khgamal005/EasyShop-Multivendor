import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create new conversation
export const createConversation = createAsyncThunk(
  "conversation/create",
  async ({ groupTitle, userId, sellerId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `/api/conversation/create-new-conversation`,
        { groupTitle, userId, sellerId },
        { withCredentials: true }
      );
      return data.conversation;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Get all conversations (user or seller)
export const getConversations = createAsyncThunk(
  "conversation/getAll",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const endpoint =
        role === "seller"
          ? `/api/conversation/get-all-conversation-seller/${id}`
          : `/api/conversation/get-all-conversation-user/${id}`;

      const { data } = await axios.get(endpoint, {
        withCredentials: true,
      });
      return data.conversations;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Update last message
export const updateLastMessage = createAsyncThunk(
  "conversation/updateLastMessage",
  async ({ id, lastMessage, lastMessageId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/api/conversation/update-last-message/${id}`,
        { lastMessage, lastMessageId },
        { withCredentials: true }
      );
      return data.conversation;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversations: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearConversations: (state) => {
      state.conversations = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading = false;
        const existing = state.conversations.find(
          (c) => c._id === action.payload._id
        );
        if (!existing) {
          state.conversations.unshift(action.payload);
        }
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateLastMessage.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.conversations.findIndex((c) => c._id === updated._id);
        if (index !== -1) {
          state.conversations[index] = updated;
        }
      });
  },
});

export const { clearConversations } = conversationSlice.actions;
export default conversationSlice.reducer;
