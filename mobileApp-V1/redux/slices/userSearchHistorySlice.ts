import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchCriteria, UserSearchHistory } from "@/typesDeclaration/types";

interface UserSearchHistoryState {
  [userId: string]: UserSearchHistory;
}
const initialState: UserSearchHistoryState = {

};

const userSearchHistorySlice = createSlice({
  name: "userSearchHistory",
  initialState,
  reducers: {
    addSearchHistory: (
      state,
      action: PayloadAction<{ userId: string; search: SearchCriteria }>
    ) => {
      const { userId, search } = action.payload;

      // If the user doesn't exist in the state, initialize their history
      if (!state[userId]) {
        state[userId] = {
          recentSearch: search,
          history: [search],
        };
      } else {
        // If the user exists, update their recent search and push to history
        state[userId].recentSearch = search;
        state[userId].history.push(search);
      }
    },
    clearUserSearchHistory: (
      state,
      action: PayloadAction<{ userId: string }>
    ) => {
      const { userId } = action.payload;
      if (state[userId]) {
        state[userId] = {
          recentSearch: null,
          history: [],
        };
      }
    },
    removeRecentSearch: (state, action: PayloadAction<{ userId: string }>) => {
      const { userId } = action.payload;
      if (state[userId]) {
        state[userId].recentSearch = null;
      }
    },
  },
});

export const { addSearchHistory, clearUserSearchHistory, removeRecentSearch } =
  userSearchHistorySlice.actions;

export const getUserSearchHistory = (state: typeof initialState) =>
  state.userSearchHistory;

export default userSearchHistorySlice.reducer;
