import { createStore } from "redux";

import { configureStore } from "@reduxjs/toolkit";
import targetsReducer from "../features/target/targetSlice";
import tasksReducer from "../features/task/taskSlice";

const store = configureStore({
  reducer: {
    targets: targetsReducer,
    tasks: tasksReducer,
  },
});

// store.dispatch(fetched([1, 2, 3]));
// console.log(store.getState());

export default store;
