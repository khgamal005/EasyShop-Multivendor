import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// CREATE a new message
export const createMessage = createAsyncThunk(
  "message/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "/api/message/create-new-message",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      return data.message;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// GET all messages by conversation ID
export const getMessages = createAsyncThunk(
  "message/getAll",
  async (conversationId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/message/get-all-messages/${conversationId}`,
        { withCredentials: true }
      );
      return data.messages;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addSocketMessage: (state, action) => {
      state.messages.push(action.payload); // for incoming socket message
    },
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addSocketMessage, clearMessages } = messageSlice.actions;

export default messageSlice.reducer;
