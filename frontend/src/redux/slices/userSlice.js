import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "../../server";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  user: null,
  error: null,
  loading: false,
  addressloading: false,
  successMessage: null,
  usersLoading: false,
  users: [],
};

// Async thunk for loading user data
export const loadUser = createAsyncThunk(
  "user/loadUser",
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

export const registerUser = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${server}1/user/create-user`,
        formData
      );
      return data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const activateUser = createAsyncThunk(
  "user/activate",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${server}/user/activation`, { token });
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${server}/user/login`, {
        email,
        password,
      });
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/user/logout`);
      return data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${server}/user/update-user-info`,
        formData,
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
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "user/changePassword",
  async (
    { oldPassword, newPassword, confirmPassword },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.put(
        `${server}/user/change-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );
      return data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }
);


export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${server}/user/forgotPassword`,
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
  "user/verifyResetCode",
  async (resetCode, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${server}/user/verifyResetCode`,
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
  "user/resetPassword",
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${server}/user/resetPassword`,
        { email, newPassword },
        { withCredentials: true }
      );
      return data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Password reset failed");
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Additional reducers can go here
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
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
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Activate
      .addCase(activateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(activateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(activateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(changeUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify Code
      .addCase(verifyResetCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyResetCode.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(verifyResetCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, clearMessages, logoutSuccess } = userSlice.actions;

export default userSlice.reducer;
