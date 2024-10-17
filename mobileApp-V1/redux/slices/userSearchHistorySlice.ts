import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchCriteria, UserSearchHistory } from "@/typesDeclaration/types";

interface UserSearchHistoryState {
  [userId: string]: UserSearchHistory;
}

const MAX_HISTORY_LENGTH = 5; // Limit history to 5 entries

const initialState: UserSearchHistoryState = {};

const userSearchHistorySlice = createSlice({
  name: "userSearchHistory",
  initialState,
  reducers: {
    addSearchHistory: (
      state,
      action: PayloadAction<{ userId: string; search: SearchCriteria }>
    ) => {
      const { userId, search } = action.payload;

      if (!state[userId]) {

        state[userId] = {
          recentSearch: search,
          history: [search],
        };
      } else {
        // Add new search to the history and update the recent search
        state[userId].recentSearch = search;
        state[userId].history.unshift(search); // Add to the beginning of the array

        // Limit history to MAX_HISTORY_LENGTH
        if (state[userId].history.length > MAX_HISTORY_LENGTH) {
          state[userId].history.pop();
        }
      }
    },
    clearUserSearchHistory: (state, action: PayloadAction<{ userId: string }>) => {
      const { userId } = action.payload;
      if (state[userId]) {
        state[userId].recentSearch = null;
        state[userId].history = [];
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

export const {
  addSearchHistory,
  clearUserSearchHistory,
  removeRecentSearch,
} = userSearchHistorySlice.actions;

// Selectors
export const selectUserSearchHistory = (state: UserSearchHistoryState, userId: string) =>
  state[userId] ? state[userId].history : [];

export const selectRecentSearch = (state: UserSearchHistoryState, userId: string) =>
  state[userId] ? state[userId].recentSearch : null;

export default userSearchHistorySlice.reducer;
