import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore"; // adjust to your path

export function useUndoRedoHotkeys() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          useAppStore.getState().redo(); // Call your redo function
        } else {
          e.preventDefault();
          useAppStore.getState().undo(); // Call your undo function
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
