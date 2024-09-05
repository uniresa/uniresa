import { createSlice } from "@reduxjs/toolkit";
import { UserProfile } from "@/typesDeclaration/types";

interface UserState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}
const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.user = action.payload;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});
export const { loginStart, loginSuccess, loginFailure, logout } =
  userSlice.actions;

export const logedInUser = (state: typeof initialState) => state.user;
export default userSlice.reducer;
