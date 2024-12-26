import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    fetchedTaskGlobal(state, action) {
      state.tasks = action.payload;
    },
    addTaskGlobal(state, action) {
      state.tasks.push(action.payload);
    },
    updateTaskGlobal(state, action) {
      state.tasks = action.payload;
    },
    deleteTaskGlobal(state, action) {
      state.tasks = state.tasks.filter(
        (task) => task.global_id !== action.payload
      );
    },
  },
});

export const {
  addTaskGlobal,
  fetchedTaskGlobal,
  updateTaskGlobal,
  deleteTaskGlobal,
} = taskSlice.actions;
export default taskSlice.reducer;
