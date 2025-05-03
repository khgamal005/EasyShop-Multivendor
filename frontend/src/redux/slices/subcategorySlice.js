// src/redux/slices/subCategorySlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";

// Async Thunks

// Get all subcategories
export const getSubCategories = createAsyncThunk(
  "subCategory/getAll",
  async (categoryId, { rejectWithValue }) => {
    try {
      let url = `${server}/subcategory/`;
      if (categoryId) {
        url = `${server}/category/${categoryId}/subcategories`; // nested route
      }
      const { data } = await axios.get(url);
      return data.data; // assuming { subCategories: [...] }
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Get single subcategory
export const getSubCategory = createAsyncThunk(
  "subCategory/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/subcategory/${id}`);
      return data.subCategory; // assuming { subCategory: {...} }
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Create subcategory
export const createSubCategory = createAsyncThunk(
  "subCategory/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${server}/subcategory/create-subCategory`,
        formData,
        { withCredentials: true }
      );
      return data.data;
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Get the first validation error message
        {  console.log(error.response.data.errors)}
        return rejectWithValue(error.response.data.errors[0].msg);
      }

      // Handle other server errors
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Update subcategory
export const updateSubCategory = createAsyncThunk(
  "subCategory/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${server}/subcategory/${id}`,
        formData,
        { withCredentials: true }
      );
      return data.subCategory;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Delete subcategory
export const deleteSubCategory = createAsyncThunk(
  "subCategory/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${server}/subcategory/${id}`,
        { withCredentials: true }
      );
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Initial State
const initialState = {
  isLoading: false,
  subCategories: [],
  subCategory: null,
  success: false,
  message: null,
  error: null,
};

// SubCategory Slice
const subCategorySlice = createSlice({
  name: "subCategory",
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
      // Get all subcategories
      .addCase(getSubCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSubCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subCategories = action.payload;
      })
      .addCase(getSubCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get single subcategory
      .addCase(getSubCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSubCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subCategory = action.payload;
      })
      .addCase(getSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create subcategory
      .addCase(createSubCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subCategories.push(action.payload);
        state.success = true;
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update subcategory
      .addCase(updateSubCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.subCategories.findIndex(
          (s) => s._id === action.payload._id
        );
        if (index !== -1) {
          state.subCategories[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete subcategory
      .addCase(deleteSubCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.success = true;
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Exports
export const { clearErrors, clearSuccess } = subCategorySlice.actions;
export default subCategorySlice.reducer;
