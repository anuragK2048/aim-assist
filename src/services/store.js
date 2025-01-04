import { createStore } from "redux";

import { configureStore } from "@reduxjs/toolkit";
import targetsReducer from "../features/target/targetSlice";
import tasksReducer from "../features/task/taskSlice";
import scheduleDayReducer from "../features/scheduleDay/scheduleDaySlice";
// import { logger } from "./logger";
import { supabaseMiddleware } from "./supabaseMiddleware";

const store = configureStore({
  reducer: {
    targets: targetsReducer,
    tasks: tasksReducer,
    scheduleDay: scheduleDayReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(supabaseMiddleware),
});

// store.dispatch(fetched([1, 2, 3]));
// console.log(store.getState());

export default store;
