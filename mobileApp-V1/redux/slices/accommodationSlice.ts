import { createSlice } from "@reduxjs/toolkit";
import { AccommodationProperty } from "@/typesDeclaration/types";

const initialState = {
  accommodationsList: [] as AccommodationProperty[],
  loading: false,
  error: null,
};

const accommodationsSlice = createSlice({
  name: "accommodationsList",
  initialState,
  reducers: {
    fetchAccommodationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAccommodationsSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.accommodationsList = action.payload;
    },
    fetchAccommodationsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAccommodationsStart,
  fetchAccommodationsSuccess,
  fetchAccommodationsError,
} = accommodationsSlice.actions;

export const accommodationsList = (state: typeof initialState) =>
  state.accommodationsList;

export default accommodationsSlice.reducer;
