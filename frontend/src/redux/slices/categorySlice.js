// src/redux/slices/categorySlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";

// Async Thunks

// Get all categories
export const getCategories = createAsyncThunk(
  "category/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/category/`);
      return data.data; // assuming { categories: [...] }
    } catch (error) {
    if (error.response && error.response.data.errors) {
        // Get the first validation error message
        return rejectWithValue(error.response.data.errors[0].msg);
      }

      // Handle other server errors
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Get single category
export const getCategory = createAsyncThunk(
  "category/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/category/${id}`);
      return data.data; // assuming { category: {...} }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Get the first validation error message
        return rejectWithValue(error.response.data.errors[0].msg);
      }

      // Handle other server errors
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Create category
export const createCategory = createAsyncThunk(
  "category/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${server}/category/create-category`,
        formData,
        {
          withCredentials: true,
        }
      );
      return {
        category: data.data,
      };
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Get the first validation error message
        return rejectWithValue(error.response.data.errors[0].msg);
      }

      // Handle other server errors
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${server}/category/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      return data.category;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${server}/category/${id}`, { withCredentials: true });
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Initial State
const initialState = {
  isLoading: false,
  categories: [],
  category: null,
  success: false,
  message: null,
  error: null,
};

// Category Slice
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all categories
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get single category
      .addCase(getCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.category = action.payload;
      })
      .addCase(getCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories.push(action.payload);
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.categories.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.success = true;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Exports
export const { clearErrors, clearSuccess } = categorySlice.actions;
export default categorySlice.reducer;
