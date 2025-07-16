import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";

// Create new conversation
export const createConversation = createAsyncThunk(
  "conversation/create",
  async ({ groupTitle, userId, sellerId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${server}/conversation/create-new-conversation`,
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
          ? `${server}/conversation/get-all-conversation-seller/${id}`
          : `${server}/conversation/get-all-conversation-user/${id}`;

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
        `${server}/conversation/update-last-message/${id}`,
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
    conversations: [], // ✅ must be an array
    loading: false,
    error: null,
  },
  reducers: {
    clearConversations: (state) => {
      state.conversations = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createConversation.pending, (state) => {
        state.loading = false;
        state.error = null;
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
        state.loading = true;
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
      .addCase(updateLastMessage.pending, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(updateLastMessage.fulfilled, (state, action) => {
        const updated = action.payload;
        state.conversations = state.conversations.map((c) =>
          c._id === updated._id ? updated : c
        );
      })

      .addCase(updateLastMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearConversations } = conversationSlice.actions;
export default conversationSlice.reducer;
