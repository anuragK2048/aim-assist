import { createStore } from "redux";

import { configureStore } from "@reduxjs/toolkit";
import targetsReducer from "../features/target/targetSlice";

const store = configureStore({
  reducer: {
    targets: targetsReducer,
  },
});

// store.dispatch(fetched([1, 2, 3]));
// console.log(store.getState());

export default store;
