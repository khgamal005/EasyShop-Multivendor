// src/redux/slices/sellerSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";

// --- Thunks ---

// Load logged-in seller
export const loadSeller = createAsyncThunk("seller/loadSeller", async (_, thunkAPI) => {
  try {
    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,

    });

    return data.seller;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Load seller failed");
  }
});

// Get all sellers (admin)
export const getAllSellers = createAsyncThunk("seller/getAllSellers", async (_, thunkAPI) => {
  try {
    const { data } = await axios.get(`${server}/shop/admin-all-sellers`, {
      withCredentials: true,
    });
    return data.sellers;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Get all sellers failed");
  }
});

// --- Slice ---
const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    isLoading: false,
    isSeller: false,
    seller: null,
    sellers: [],
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Load seller
    builder
      .addCase(loadSeller.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadSeller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSeller = true;
        state.seller = action.payload;
      })
      .addCase(loadSeller.rejected, (state, action) => {
        state.isLoading = false;
        state.isSeller = false;
        state.error = action.payload;
      });

    // Get all sellers
    builder
      .addCase(getAllSellers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSellers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sellers = action.payload;
      })
      .addCase(getAllSellers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors } = sellerSlice.actions;

export default sellerSlice.reducer;
