// redux/slices/couponSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";

// CREATE coupon
export const createCoupon = createAsyncThunk(
  "coupon/create",
  async (couponData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${server}/coupon/create-coupon`,
        couponData,
        { withCredentials: true }
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

// GET all coupons
export const getAllCoupons = createAsyncThunk(
  "coupon/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/coupon`);
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
// GET  coupon
export const getCoupon = createAsyncThunk(
  "coupon/getCoupon",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/coupon/get-coupon/${id}`);
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

export const deleteCoupon = createAsyncThunk(
  "coupon/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${server}/coupon/${id}`, { withCredentials: true });

      return id;
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

export const applyCoupon = createAsyncThunk(
  "coupon/applyCoupon",
  async (couponName, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${server}/coupon/apply`, {
        name: couponName,
      });
      return data.coupon;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to apply coupon"
      );
    }
  }
);

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    coupons: [],
    coupon: {},
    appliedCoupon: null,
    loading: false,
    error: null,
  },
  reducers: {
   
    clearCoupon(state) {
      state.appliedCoupon = null;
      state.error = null;
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons.push(action.payload);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //////////////////////////////////

      .addCase(getAllCoupons.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //////////////////////////////////

      .addCase(getCoupon.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload;
      })
      .addCase(getCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      ////////////////////////////////////////////////////////
      // Delete Event
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.coupons.filter(
          (coupon) => coupon._id !== action.payload
        );
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = action.payload;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearCoupon } = couponSlice.actions;

export default couponSlice.reducer;
