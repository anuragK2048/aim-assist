import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useProjectViewStore = create(
  devtools((set, get) => ({
    // Initial state
    currentPath: [],

    addToPath: (routeInfo) =>
      set(
        produce((draft) => {
          draft.currentPath.push(routeInfo);
        })
      ),

    removeFromPath: () => ({}),
  }))
);
