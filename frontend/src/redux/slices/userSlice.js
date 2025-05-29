import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { server } from '../../server';
import axios from 'axios';

const initialState = {
  isAuthenticated: false,
  user: null,
  error: null,
  loading: false,
  addressloading: false,
  successMessage: null,
  usersLoading: false,
  users: []
};

// Async thunk for loading user data
export const loadUser = createAsyncThunk(
  'user/loadUser', 
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/user/getuser`, {
        withCredentials: true,
      });
      return data.user; 
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Additional reducers can go here
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.successMessage = null;
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, clearMessages ,logoutSuccess } = userSlice.actions;

export default userSlice.reducer;
