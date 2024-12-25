import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTaskGlobal(state, action) {
      state.tasks.push(action.payload);
    },
  },
});

export const { addTaskGlobal } = taskSlice.actions;
export default taskSlice.reducer;
