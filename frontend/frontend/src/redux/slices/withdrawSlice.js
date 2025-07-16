import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";

// Create Withdraw Request - for seller
export const createWithdraw = createAsyncThunk(
  "withdraw/createWithdraw",
  async (amount, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${server}/withdraw/create-withdraw-request`,
        { amount },
        { withCredentials: true }
      );
      return data.withdraw;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// Get All Withdraw Requests - for admin
export const getAllWithdraws = createAsyncThunk(
  "withdraw/getAllWithdraws",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${server}/withdraw/get-all-withdraw-request`,
        { withCredentials: true }
      );
      return data.withdraws;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// Update Withdraw Request - for admin
export const updateWithdraw = createAsyncThunk(
  "withdraw/updateWithdraw",
  async ({ id, sellerId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${server}/withdraw/update-withdraw-request/${id}`,
        { sellerId },
        { withCredentials: true }
      );
      return data.withdraw;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const withdrawSlice = createSlice({
  name: "withdraw",
  initialState: {
    withdraws: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearWithdrawError: (state) => {
      state.error = null;
    },
    clearWithdrawSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createWithdraw.pending, (state) => {
        state.loading = true;
      })
      .addCase(createWithdraw.fulfilled, (state, action) => {
        state.loading = false;
        state.withdraws.push(action.payload);
        state.success = true;
      })
      .addCase(createWithdraw.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All
      .addCase(getAllWithdraws.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllWithdraws.fulfilled, (state, action) => {
        state.loading = false;
        state.withdraws = action.payload;
      })
      .addCase(getAllWithdraws.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateWithdraw.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateWithdraw.fulfilled, (state, action) => {
        state.loading = false;
        state.withdraws = state.withdraws.map((w) =>
          w._id === action.payload._id ? action.payload : w
        );
        state.success = true;
      })
      .addCase(updateWithdraw.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWithdrawError, clearWithdrawSuccess } = withdrawSlice.actions;

export default withdrawSlice.reducer;
