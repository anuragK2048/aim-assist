// store/useCurrentBlockStore.ts
import { Goal, Target, Task } from "@/types";
import { create } from "zustand";

type BlockType = "goals" | "targets" | "nodes" | "tasks" | "";
type Block = Goal | Target | Node | Task | null;

interface CurrentBlockState {
  currentBlock: Block;
  currentBlockType: BlockType;
  setBlock: (block: Block, type: BlockType) => void;
  clearBlock: () => void;
}

export const useCurrentBlockStore = create<CurrentBlockState>((set) => ({
  currentBlock: null,
  currentBlockType: "",
  setBlock: (block, type) =>
    set({ currentBlock: block, currentBlockType: type }),
  setBlockContent: (block) =>
    set({ currentBlock: block, currentBlockType: type }),
  clearBlock: () => set({ currentBlock: null, currentBlockType: "" }),
}));
