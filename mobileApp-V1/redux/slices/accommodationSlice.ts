import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccommodationProperty } from "@/typesDeclaration/types";

interface AccommodationsState {
  properties: AccommodationProperty[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AccommodationsState = {
  properties: [],
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
    fetchAccommodationsSuccess: (
      state,
      action: PayloadAction<AccommodationProperty[]>
    ) => {
      state.loading = false;
      state.error = null;
      state.properties = action.payload;
    },
    fetchAccommodationsError: (state, action: PayloadAction<string>) => {
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

// Corrected selector function
export const selectAccommodationsList = (state: {
  accommodationsList: AccommodationsState;
}) => state.accommodationsList;

export default accommodationsSlice.reducer;
