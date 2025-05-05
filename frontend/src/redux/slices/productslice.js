// src/redux/slices/productSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";

// Async actions (thunks)

// Create product
export const createPro = createAsyncThunk(
  "product/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${server}/product/create-product`,
        formData,
         { withCredentials: true},

      );
      return data.data;
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


// Get all products of a shop
export const getAllProductsShop = createAsyncThunk(
  "product/getAllProductsShop",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${server}/product/get-all-products-shop/${id}`
      );
      return data.data;
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

// Delete product
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${server}/product/${id}`,
        {
          withCredentials: true,
        }
      );
      return data.data;
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
// productSlice.js

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${server}/product/${id}`, formData, 
          { withCredentials: true},);
      return data.data ;
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


// Get all products
export const getAllProducts = createAsyncThunk(
  "product/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/product/get-all-products`);
      return data.products;
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

export const getProduct = createAsyncThunk(
  "product/getproduct",
  async (id,{ rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/product/${id}`,{
         withCredentials: true
      });
      // console.log(data)
      return data.data;
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


// Initial state
const initialState = {
  isLoading: false,
  product: null,
  products: [],
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
      .addCase(createPro.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPro.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.push(action.payload);
        state.success = true;
      })
      .addCase(createPro.rejected, (state, action) => {
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
        state.product = action.payload;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // update Product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get Product
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // // Get All Products
      // .addCase(getAllProducts.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(getAllProducts.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.allProducts = action.payload;
      // })
      // .addCase(getAllProducts.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.payload;
      // });
  },
});

export const { clearErrors, clearSuccess } = productSlice.actions;

export default productSlice.reducer;
