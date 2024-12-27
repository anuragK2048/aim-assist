const initialState = {
  targets: [],
  test: "",
};

export default function targetsReducer(state = initialState, action) {
  switch (action.type) {
    case "targets/fetched":
      return { ...state, targets: action.payload };
    case "targets/update":
      return { ...state, targets: action.payload };
    case "targets/add":
      // console.log("Adding target:", action.payload);
      // console.log("Previous targets:", state.targets);
      return { ...state, targets: [...state.targets, action.payload] };
    case "targets/delete":
      const newTarget = state.targets.filter(
        (target) => target.global_id != action.payload
      );
      return { ...state, targets: newTarget };
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

export function add(newTarget) {
  return { type: "targets/add", payload: newTarget };
}

export function remove(global_id) {
  return { type: "targets/delete", payload: global_id };
}
