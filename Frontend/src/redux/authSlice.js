import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../services/api";

const initialState = {
  user: null,
  isAuthenticated: false,
  // "loading" on startup so ProtectedRoute waits for the first server check
  status: "loading",
};

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await authApi.me();
    return data.user ? data.user : data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Not authenticated");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = "succeeded";
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "failed";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        // Only treat as authenticated if we got a real user object back
        if (action.payload && action.payload._id) {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.status = "succeeded";
        } else {
          state.user = null;
          state.isAuthenticated = false;
          state.status = "failed";
        }
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "failed";
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
