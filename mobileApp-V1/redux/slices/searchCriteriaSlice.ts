import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  destination: "",
  dates: { checkInDate: "", checkOutDate: "" },
  guests: { adults: 1, children: 0 },
  rooms: 1,
};

const searchCriteriaSlice = createSlice({
  name: "searchCriteria",
  initialState,
  reducers: {
    setSearchCriteria: (state, action) => {
      return { ...state, ...action.payload };
    },

    updateDestination: (state, action) => {
      state.destination = action.payload;
    },
    updateDates: (state, action) => {
      const { checkInDate, checkOutDate } = action.payload;
      state.dates.checkInDate = checkInDate;
      state.dates.checkOutDate = checkOutDate;
    },
    updateGuests: (state, action) => {
      state.guests = action.payload.guests;
    },
    updateRooms: (state, action) => {
      state.rooms = action.payload.rooms;
    },
  },
});
export const {
  setSearchCriteria,
  updateDestination,
  updateDates,
  updateGuests,
  updateRooms,
} = searchCriteriaSlice.actions;
export const selectSearchCriteria = (state: {
  searchCriteria: typeof initialState;
}) => {
  return state.searchCriteria || initialState;
};

export default searchCriteriaSlice.reducer;
