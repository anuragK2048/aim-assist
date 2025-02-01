const initialState = {
  targets: [],
  test: "",
};

export default function targetsReducer(state = initialState, action) {
  switch (action.type) {
    case "targets/fetched":
      return { ...state, targets: action.payload };
    case "targets/update":
      const updatedTargets = state.targets.map((target) =>
        target.global_id == action.payload.global_id
          ? { ...target, ...action.payload.updatedTarget }
          : target,
      );
      return { ...state, targets: updatedTargets };
    case "targets/add":
      // console.log("Adding target:", action.payload);
      // console.log("Previous targets:", state.targets);
      const res = { ...state, targets: [...state.targets, action.payload] };
      return res;
    case "targets/delete":
      const newTarget = state.targets.filter(
        (target) => target.global_id != action.payload,
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

export function update(global_id, updatedTarget) {
  return { type: "targets/update", payload: { global_id, updatedTarget } };
}

export function add(newTarget) {
  return { type: "targets/add", payload: newTarget };
}

export function remove(global_id) {
  return { type: "targets/delete", payload: global_id };
}
