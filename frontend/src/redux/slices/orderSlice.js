import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Base
const API = "https://your-backend-domain.com/api/v1/order";

// --- Async Thunks ---

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API}/create-order`, orderData, { withCredentials: true });
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
      const { data } = await axios.get(`${API}/get-all-orders/${userId}`, { withCredentials: true });
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
      const { data } = await axios.get(`${API}/get-seller-all-orders/${shopId}`, { withCredentials: true });
      return data.orders;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API}/update-order-status/${orderId}`, {
        params: { status },
        withCredentials: true,
      });
      return data.order;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const requestRefund = createAsyncThunk(
  "order/requestRefund",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API}/order-refund/${orderId}`, {
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
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API}/order-refund-success/${orderId}`, {
        params: { status },
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getAllOrdersForAdmin = createAsyncThunk(
  "order/getAllOrdersForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API}/admin-all-orders`, { withCredentials: true });
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
