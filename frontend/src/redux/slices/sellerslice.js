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

export const updateShopInfo = createAsyncThunk(
  "shop/updateShopInfo",
  async ( formData , { rejectWithValue }) => {

    try {
      const { data } = await axios.put(`${server}/shop/update-seller`, formData, {
        withCredentials: true,
      });
     
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
export const getSellerById = createAsyncThunk(
  "seller/getSellerById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${server}/shop/get-Specific-seller`, { id });
      return response.data.seller;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch seller"
      );
    }
  }
);
// Update seller's payment (withdraw) method
export const updateWithdrawMethod = createAsyncThunk(
  "shop/updateWithdrawMethod",
  async (withdrawMethod, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${server}/shop/update-payment-methods`,
        { withdrawMethod },
        { withCredentials: true }
      );
      return data.seller;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Delete seller's withdraw method
export const deleteWithdrawMethod = createAsyncThunk(
  "shop/deleteWithdrawMethod",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${server}/shop/delete-withdraw-method`,
        { withCredentials: true }
      );
      return data.seller;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);


export const updateSellerAvatar = createAsyncThunk(
  'shop/updateSellerAvatar',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${server}/shop/update-avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            withCredentials: true,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update avatar'
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "shop/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${server}/shop/forgotPassword`,
        { email },
        { withCredentials: true }
      );
      return data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send reset code");
    }
  }
);


export const verifyResetCode = createAsyncThunk(
  "shop/verifyResetCode",
  async (resetCode, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${server}/shop/verifyResetCode`,
        { resetCode },
        { withCredentials: true }
      );
      return data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Invalid or expired code");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "shop/resetPassword",
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${server}/shop/resetPassword`,
        { email, newPassword },
        { withCredentials: true }
      );
      return data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Password reset failed");
    }
  }
);
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
    logoutSeller: (state) => {
      state.isSeller = false;
      state.seller = null;
    },
        clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;    },
  },
  extraReducers: (builder) => {
    // Load seller
    builder
      .addCase(loadSeller.pending, (state) => {
        state.isLoading = true;
         state.error = null;
      })
      .addCase(loadSeller.fulfilled, (state, action) => {
        state.isLoading = false;
         state.error = null;
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
          // update all sellers
        builder
      .addCase(updateShopInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateShopInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.seller = action.payload;
      })
      .addCase(updateShopInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle updateWithdrawMethod
      .addCase(updateWithdrawMethod.pending, (state) => {
        state.isLoading = true;
           state.error = null;

      })
      .addCase(updateWithdrawMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.seller = action.payload;
        state.success = true;
      })
      .addCase(updateWithdrawMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

         .addCase(deleteWithdrawMethod.pending, (state) => {
        state.isLoading = true;
           state.error = null;
      })
      .addCase(deleteWithdrawMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.seller = action.payload;
        state.success = true;
      })
      .addCase(deleteWithdrawMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })


       .addCase(updateSellerAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSellerAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.seller = action.payload;
      })
      .addCase(updateSellerAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
         // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
              state.isLoading = true;
              state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
              state.isLoading = false;
              state.successMessage = action.payload;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
              state.isLoading = false;
              state.error = action.payload;
            })
      
            // Verify Code
            .addCase(verifyResetCode.pending, (state) => {
              state.isLoading = true;
              state.error = null;
            })
            .addCase(verifyResetCode.fulfilled, (state, action) => {
              state.isLoading = false;
              state.successMessage = action.payload;
            })
            .addCase(verifyResetCode.rejected, (state, action) => {
              state.isLoading = false;
              state.error = action.payload;
            })
      
            // Reset Password
            .addCase(resetPassword.pending, (state) => {
              state.isLoading = true;
              state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
              state.isLoading = false;
              state.successMessage = action.payload;
            })
            .addCase(resetPassword.rejected, (state, action) => {
              state.isLoading = false;
              state.error = action.payload;
            })
  },
});

export const { clearErrors,logoutSeller ,clearMessages} = sellerSlice.actions;

export default sellerSlice.reducer;
