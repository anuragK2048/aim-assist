// store/useCurrentBlockStore.ts
import { Goal, Target, Task } from "@/types";
import { create } from "zustand";

// type BlockType = "goals" | "targets" | "nodes" | "tasks" | "";
// type Block = Goal | Target | Node | Task | null;

// interface CurrentBlockState {
//   currentBlock: Block;
//   currentBlockType: BlockType;
//   currentBlockId: string | null;
//   setBlock: (block: Block, type: BlockType, blockId: string) => void;
//   clearBlock: () => void;
// }

export const useCurrentBlockStore = create<CurrentBlockState>((set) => ({
  currentBlock: null,
  currentBlockType: "",
  currentBlockId: null,
  selectedTaskId: null,
  setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),
  setBlock: (block, type, blockId) =>
    set({
      currentBlock: block,
      currentBlockType: type,
      currentBlockId: blockId,
    }),
  clearBlock: () => set({ currentBlock: null, currentBlockType: "" }),
}));
