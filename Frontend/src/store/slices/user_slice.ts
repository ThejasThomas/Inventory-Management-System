import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { logout, refreshSession } from "../../service/userservice";

interface User {
  userId?: string;
  email: string;
  fullName: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

export const refreshSessionThunk = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("/refresh-sessoin", async (_, { rejectWithValue }) => {
  try {
    const res = await refreshSession();
    return res.user;
  } catch {
    return rejectWithValue("Session expired");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(refreshSessionThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(refreshSessionThunk.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    });
  },
});
export const logoutThunk = createAsyncThunk(
  "/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      return true;
    } catch {
      return rejectWithValue("Logout failed");
    }
  }
);

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
