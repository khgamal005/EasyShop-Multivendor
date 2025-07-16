// src/redux/slices/brandSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";

// brandSlice.js or brandActions.js
export const createBrand = createAsyncThunk(
  "brand/createBrand",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${server}/brand/create-brand`, formData, {
        withCredentials: true,
      });
      
      return  data.data
    } catch (error) {
      // Handle validation errors from express-validator
      if (error.response && error.response.data.errors) {
    console.log(error.response.data.errors)
        return rejectWithValue(error.response.data.errors[0].msg);
      }

      // Handle other server errors
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);


// Async Thunks
// Get single brand

const initialState = {
  isLoading: false,
  brands: [],
  brand: null,
  success: false,
  error: null,
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.brands.push(action.payload);
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearErrors, clearSuccess } = brandSlice.actions;
export default brandSlice.reducer;
