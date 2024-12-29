import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sleepSchedule: [],
  scheduledTargetTasks: [],
  scheduledRoutineTasks: [],
  scheduledScheduleTasks: [],
  scheduledAdditionalTasks: [],
};

const scheduleDaySlice = createSlice({
  name: "scheduleDay",
  initialState,
  reducers: {
    updateSleepSchedule(state, action) {
      state.sleepSchedule = action.payload;
    },
    updateScheduledTargetTasks(state, action) {
      state.scheduledTargetTasks = action.payload;
    },
    updateScheduledRoutineTasks(state, action) {
      state.scheduledRoutineTasks = action.payload;
    },
    updateScheduledScheduleTasks(state, action) {
      state.scheduledScheduleTasks = action.payload;
    },
    updateScheduledAdditionalTasks(state, action) {
      state.scheduledAdditionalTasks = action.payload;
    },
  },
});

export const {
  updateSleepSchedule,
  updateScheduledTargetTasks,
  updateScheduledRoutineTasks,
  updateScheduledScheduleTasks,
  updateScheduledAdditionalTasks,
} = scheduleDaySlice.actions;

export default scheduleDaySlice.reducer;
