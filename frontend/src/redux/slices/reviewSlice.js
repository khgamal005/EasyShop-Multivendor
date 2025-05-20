// src/redux/slices/reviewSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";

const API_BASE = "reviews";

// Thunks
export const fetchReviews = createAsyncThunk("review/fetchAll", async (productId, thunkAPI) => {
  try {
    const res = await axios.get(
      productId ? `${server}/reviews?product=${productId}` : `${server}/reviews`
    );
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchReview = createAsyncThunk("review/fetchOne", async (id, thunkAPI) => {
  try {
    const res = await axios.get(`${API_BASE}/${id}`);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const createReview = createAsyncThunk("review/create", async (reviewData, thunkAPI) => {
  try {
    const res = await axios.post(API_BASE, reviewData, {
      withCredentials: true,
    });
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const updateReview = createAsyncThunk("review/update", async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API_BASE}/${id}`, data, {
      withCredentials: true,
    });
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const deleteReview = createAsyncThunk("review/delete", async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_BASE}/${id}`, {
      withCredentials: true,
    });
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

// Slice
const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
    review: null,
  },
  reducers: {
    clearReview: (state) => {
      state.review = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch One
      .addCase(fetchReview.fulfilled, (state, action) => {
        state.review = action.payload;
      })

      // Create
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
      })

      // Update
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
      });
  },
});

export const { clearReview } = reviewSlice.actions;
export default reviewSlice.reducer;
