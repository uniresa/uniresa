import { LocationDetails } from "@/typesDeclaration/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  destination: <LocationDetails>{
    street: "",
    city: "",
    district: "",
    region: "",
    postalCode: "",
    country: "",
    latitude: 0,
    longitude: 0,
  },
  dates: { checkInDate: "", checkOutDate: "" },
  minGuests: 2,
  minRooms: 1,
};

const searchCriteriaSlice = createSlice({
  name: "searchCriteria",
  initialState,
  reducers: {
    setSearchCriteria: (state, action) => {
      return { ...state, ...action.payload };
    },

    updateDestination: (state, action) => {
      state.destination = action.payload.destination;
    },
    updateDates: (state, action) => {
      const { checkInDate, checkOutDate } = action.payload;
      state.dates.checkInDate = checkInDate;
      state.dates.checkOutDate = checkOutDate;
    },
    updateMinGuests: (state, action) => {
      state.minGuests = action.payload.minGuests;
    },
    updateMinRooms: (state, action) => {
      state.minRooms = action.payload.minRooms;
    },
  },
});
export const {
  setSearchCriteria,
  updateDestination,
  updateDates,
  updateMinGuests,
  updateMinRooms,
} = searchCriteriaSlice.actions;
export const selectSearchCriteria = (state: {
  searchCriteria: typeof initialState;
}) => {
  return state.searchCriteria || initialState;
};

export default searchCriteriaSlice.reducer;
