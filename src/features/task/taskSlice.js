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
    updateTaskGlobal: {
      prepare(global_id, updatedTask) {
        return {
          payload: { global_id, updatedTask },
        };
      },
      reducer(state, action) {
        const updatedTargets = state.tasks.map((task) =>
          task.global_id == action.payload.global_id
            ? { ...task, ...action.payload.updatedTask }
            : task
        );
        state.tasks = updatedTargets;
      },
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
