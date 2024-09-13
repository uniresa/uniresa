import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";
import authReducer from "./slices/authSlice";
import accommodationsReducer from "./slices/accommodationSlice";
import UserSearchHistoryReducer from "./slices/userSearchHistorySlice";

export const store = configureStore({
  reducer: {
    userProfile: userReducer,
    userAuth: authReducer,
    accommodationsList: accommodationsReducer,
    userSearchHistory: UserSearchHistoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
