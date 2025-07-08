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

export const getAllCouponessShop = createAsyncThunk(
  "coupon/getAllcouponShop",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/coupon/seller/${id}`);
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

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    coupons: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCoupon.pending, (state) => {
        (state.error = null), (state.loading = true);
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
      ////////////////////////////////////////////////////////
      // Delete Event
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = state.coupons.filter(
          (coupon) => coupon._id !== action.payload
        );
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All coupones of a Shop
      .addCase(getAllCouponessShop.pending, (state) => {
        state.loading = true;
             state.error = false;
      })
      .addCase(getAllCouponessShop.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(getAllCouponessShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default couponSlice.reducer;
