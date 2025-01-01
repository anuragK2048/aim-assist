import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scheduleDetails: {},
};

const scheduleDaySlice = createSlice({
  name: "scheduleDay",
  initialState,
  reducers: {
    updateScheduleDetails(state, action) {
      state.scheduleDetails = action.payload;
    },
  },
});

export const { updateScheduleDetails } = scheduleDaySlice.actions;

export default scheduleDaySlice.reducer;
