import { createSlice } from "@reduxjs/toolkit";
import { AccommodationProperty } from "@/typesDeclaration/types";

const initialState = {
  accommodations: [] as AccommodationProperty[],
  loading: false,
  error: null as string | null, // Ensure error is a serializable string
};

const searchResultsSlice = createSlice({
  name: "searchResults",
  initialState,
  reducers: {
    fetchSearchResultsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSearchResultsSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.accommodations = action.payload;
    },
    fetchSearchResultsError: (state, action) => {
      state.loading = false;
      state.error = action.payload.message || "An error occurred";
    },
  },
});

export const {
  fetchSearchResultsStart,
  fetchSearchResultsSuccess,
  fetchSearchResultsError,
} = searchResultsSlice.actions;

export const searchResults = (state: { searchResults: typeof initialState }) =>
  state.searchResults;

export default searchResultsSlice.reducer;
