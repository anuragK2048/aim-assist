import { AppState, AppData } from "@/store/useAppStore";

// ✅ Deep copy of app state before every change
export function snapshot(state: AppState): AppData {
  return {
    goals: structuredClone(state.goals),
    targets: structuredClone(state.targets),
    nodes: structuredClone(state.nodes),
    tasks: structuredClone(state.tasks),
  };
}
