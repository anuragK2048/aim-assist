import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scheduleDetails: [],
};

const scheduleDaySlice = createSlice({
  name: "scheduleDay",
  initialState,
  reducers: {
    fetchedScheduleDetails(state, action) {
      if (Object.keys(action.payload).length > 0) {
        state.scheduleDetails = action.payload;
      }
    },
    addScheduleDetails(state, action) {
      state.scheduleDetails.push(action.payload);
    },
    updateScheduleDetails(state, action) {
      state.scheduleDetails = state.scheduleDetails.map((schedule) =>
        schedule.global_id_date === action.payload.global_id_date
          ? action.payload
          : schedule
      );
    },
  },
});

export const {
  fetchedScheduleDetails,
  addScheduleDetails,
  updateScheduleDetails,
} = scheduleDaySlice.actions;

export default scheduleDaySlice.reducer;
