import { act } from "react";

const initialStates = {
  targets: [],
  test: "",
};

export default function targetsReducer(state = initialStates, action) {
  switch (action.type) {
    case "targets/fetched":
      return { ...state, targets: action.payload };
    case "targets/update":
      return { ...state, targets: action.payload };
    default:
      //   console.error("undefined action type in target reducer");
      return state;
  }
}

export function fetched(targetsData) {
  return { type: "targets/fetched", payload: targetsData };
}

export function update(updatedTargets) {
  return { type: "targets/update", payload: updatedTargets };
}
