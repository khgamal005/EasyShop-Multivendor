import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";



// --- Async Thunks ---

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${server}/order/create-order`, orderData, { withCredentials: true });
      return data.orders;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getAllOrdersOfUser = createAsyncThunk(
  "order/getAllOrdersOfUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/order/get-all-orders/${userId}`, { withCredentials: true });
      return data.orders;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getAllOrdersOfSeller = createAsyncThunk(
  "order/getAllOrdersOfSeller",
  async (shopId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/order/get-seller-all-orders/${shopId}`, { withCredentials: true });
      return data.orders;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${server}/order/update-order-status/${id}`,
        { status },  // <- this must match backend expectations
        { withCredentials: true }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const requestRefund = createAsyncThunk(
  "order/requestRefund",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${server}/order/order-refund/${id}`, {
        params: { status },
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const confirmRefund = createAsyncThunk(
  "order/confirmRefund",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${server}/order/order-refund-success/${id}`,
        { status }, // sent in request body
        { withCredentials: true }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Refund confirmation failed");
    }
  }
);


export const getAllOrdersForAdmin = createAsyncThunk(
  "order/getAllOrdersForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/order/admin-all-orders`, { withCredentials: true });
      return data.orders;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// --- Slice ---
const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.successMessage = "Order placed successfully.";
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // get user orders
      .addCase(getAllOrdersOfUser.fulfilled, (state, action) => {
        state.orders = action.payload;
      })

      // get seller orders
      .addCase(getAllOrdersOfSeller.fulfilled, (state, action) => {
        state.orders = action.payload;
      })

      // update status
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.successMessage = "Order status updated.";
      })

      // refund
      .addCase(requestRefund.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
      })

      // refund success
      .addCase(confirmRefund.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
      })

      // admin orders
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.orders = action.payload;
      })

      // handle rejections
      .addMatcher(
        (action) => action.type.endsWith("rejected"),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearMessages } = orderSlice.actions;
export default orderSlice.reducer;
