// src/redux/slices/productSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";

// Async actions (thunks)

// Create product
export const createProduct = createAsyncThunk(
  "product/create",
  async (
    {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      shopId,
      images,
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post(`${server}/product/create-product`, {
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        stock,
        shopId,
        images,
      });
      return data.product;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Get all products of a shop
export const getAllProductsShop = createAsyncThunk(
  "product/getAllProductsShop",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${server}/product/get-all-products-shop/${id}`
      );
      return data.products;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${server}/product/delete-shop-product/${id}`,
        {
          withCredentials: true,
        }
      );
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Get all products
export const getAllProducts = createAsyncThunk(
  "product/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/product/get-all-products`);
      return data.products;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Initial state
const initialState = {
  isLoading: false,
  product: null,
  products: [],
  allProducts: [],
  message: null,
  error: null,
  success: false,
};

// Slice
const productSlice = createSlice({
  name: "product",
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
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get All Products of a Shop
      .addCase(getAllProductsShop.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProductsShop.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(getAllProductsShop.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get All Products
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allProducts = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, clearSuccess } = productSlice.actions;

export default productSlice.reducer;
