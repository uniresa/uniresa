import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface AuthState {
//   isLoggedIn: boolean;
// }

const initialState = {
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    logedIn: (state) => {
      state.isLoggedIn = true;
    },
    logedOut: (state) => {
      state.isLoggedIn = false;
    },
  },
});

export const { logedIn, logedOut } = authSlice.actions;
export default authSlice.reducer;
