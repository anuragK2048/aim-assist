import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { produce } from "immer";
import { Goal, Target, Node, Task, AppData } from "../types"; // Adjust path to your types
import { supabase } from "../lib/supabase"; // Adjust path to your supabase client
import { client_id } from "@/lib/client";

// --- TYPE DEFINITIONS ---

type AllBlockTypes = Goal | Target | Node | Task;

type Change<T> = {
  table: keyof AppData;
  type: "INSERT" | "UPDATE" | "DELETE";
  row: T;
  prevRow?: T;
};

type HistoryEntry = {
  changes: Change<any>[];
  description?: string;
};

// This is the single source of truth for your store's state and actions
export type AppState = AppData & {
  // We'll add a mock auth object for the example to work
  auth: {
    user: {
      id: string;
    } | null;
  };
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];
  setInitialData: (data: AppData) => void;
  setAuthUser: (user: { id: string }) => void;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  // Corrected and type-safe action signatures
  addBlock: <T extends AllBlockTypes>(
    blockType: keyof AppData,
    block: Omit<T, "id" | "created_at" | "updated_at" | "client_id" | "user_id">
  ) => Promise<void>;
  updateBlock: <T extends AllBlockTypes>(
    blockType: keyof AppData,
    updatedBlock: Partial<T> & { id: string }
  ) => Promise<void>;
  removeBlock: (blockType: keyof AppData, id: string) => Promise<void>;
};

// --- DB HELPER FUNCTIONS ---
// These helpers perform the actual database operations for undo/redo
async function applyChange<T extends { id: string }>(change: Change<T>) {
  const { type, table, row } = change;
  if (type === "INSERT") {
    await supabase.from(table).insert(row);
  } else if (type === "UPDATE") {
    // Only update the fields that are in the row object, not the whole thing
    await supabase.from(table).update(row).eq("id", row.id);
  } else if (type === "DELETE") {
    await supabase.from(table).delete().eq("id", row.id);
  }
}

async function revertChange<T extends { id: string }>(change: Change<T>) {
  const { type, table, row, prevRow } = change;
  if (type === "INSERT") {
    await supabase.from(table).delete().eq("id", row.id);
  } else if (type === "UPDATE") {
    // We need prevRow to revert an update
    if (prevRow) {
      await supabase.from(table).update(prevRow).eq("id", row.id);
    }
  } else if (type === "DELETE") {
    await supabase.from(table).insert(row);
  }
}

// --- OPTIMISTIC UPDATE HELPER ---
// This generic function orchestrates the optimistic update, DB call, and rollback logic.
const performOptimisticUpdate = async (
  get: () => AppState,
  set: (fn: (state: AppState) => void) => void,
  {
    dbAction,
    localUpdate,
  }: {
    dbAction: () => Promise<any>;
    localUpdate: (draft: AppState) => void;
  }
) => {
  const previousState = get();

  // 1. Optimistically update the UI using Immer for safe mutations
  set((draft) => {
    localUpdate(draft);
  });

  // 2. Perform the database action
  try {
    const { error } = await dbAction();
    if (error) throw error; // Throw to trigger the catch block
  } catch (error) {
    console.error("❌ Optimistic update failed. Rolling back UI.", error);
    // 3. On failure, revert the store to its previous state
    set(() => previousState);
    // You would show an error toast to the user here
  }
};

// --- ZUSTAND STORE CREATION ---
export const useAppStore = create<AppState>()(
  devtools(
    // We pass `(set, get)` to `produce` to use Immer directly
    (set, get) => ({
      // Initial State
      goals: [],
      targets: [],
      nodes: [],
      tasks: [],
      undoStack: [],
      redoStack: [],
      auth: { user: null }, // Start with no user

      // --- CORE ACTIONS ---
      setInitialData: (data) => set({ ...data, undoStack: [], redoStack: [] }),
      setAuthUser: (user) =>
        set(
          produce((draft) => {
            draft.auth.user = user;
          })
        ),

      // --- GENERIC BLOCK ACTIONS ---
      addBlock: async <T extends AllBlockTypes>(
        blockType: keyof AppData,
        blockContent: Omit<
          T,
          "id" | "created_at" | "updated_at" | "client_id" | "user_id"
        >
      ) => {
        if (!get().auth.user) {
          console.error("Cannot add block: no user authenticated.");
          return;
        }
        const tempId = crypto.randomUUID();
        const newBlock = {
          ...blockContent,
          id: tempId,
          client_id,
          user_id: get().auth.user!.id, // We know user is not null here
        } as T;

        await performOptimisticUpdate(get, (fn) => set(produce(fn)), {
          localUpdate: (draft) => {
            (draft[blockType] as T[]).push(newBlock);
            draft.undoStack.push({
              changes: [{ type: "INSERT", table: blockType, row: newBlock }],
            });
            draft.redoStack = [];
          },
          dbAction: async () => {
            // Insert and select back to get the real ID generated by the DB
            const { data, error } = await supabase
              .from(blockType)
              .insert(newBlock)
              .select()
              .single();
            if (data) {
              // Update the store with the permanent ID from the DB
              set(
                produce((draft) => {
                  const item = (draft[blockType] as T[]).find(
                    (b) => b.id === tempId
                  );
                  if (item) item.id = data.id;
                })
              );
            }
            return { error };
          },
        });
      },

      updateBlock: async <T extends AllBlockTypes>(
        blockType: keyof AppData,
        updatedBlock: Partial<T> & { id: string }
      ) => {
        const originalBlock = get()[blockType].find(
          (b) => b.id === updatedBlock.id
        );
        if (!originalBlock) return;

        const newBlock = { ...originalBlock, ...updatedBlock } as T;

        await performOptimisticUpdate(get, (fn) => set(produce(fn)), {
          localUpdate: (draft) => {
            const table = draft[blockType] as T[];
            const index = table.findIndex((b) => b.id === updatedBlock.id);
            if (index !== -1) table[index] = newBlock;
            draft.undoStack.push({
              changes: [
                {
                  type: "UPDATE",
                  table: blockType,
                  row: newBlock,
                  prevRow: originalBlock,
                },
              ],
            });
            draft.redoStack = [];
          },
          dbAction: () =>
            supabase
              .from(blockType)
              .update({ ...updatedBlock, client_id })
              .eq("id", updatedBlock.id),
        });
      },

      removeBlock: async (blockType: keyof AppData, id: string) => {
        const blockToRemove = get()[blockType].find((b) => b.id === id);
        if (!blockToRemove) return;

        await performOptimisticUpdate(get, (fn) => set(produce(fn)), {
          localUpdate: (draft) => {
            (draft[blockType] as AllBlockTypes[]) = draft[blockType].filter(
              (b) => b.id !== id
            );
            draft.undoStack.push({
              changes: [
                { type: "DELETE", table: blockType, row: blockToRemove },
              ],
            });
            draft.redoStack = [];
          },
          dbAction: () => supabase.from(blockType).delete().eq("id", id),
        });
      },

      // --- UNDO/REDO ACTIONS ---
      undo: async () => {
        const { undoStack } = get();
        if (undoStack.length === 0) return;
        const entryToUndo = undoStack[undoStack.length - 1];

        await performOptimisticUpdate(get, (fn) => set(produce(fn)), {
          localUpdate: (draft) => {
            for (const change of [...entryToUndo.changes].reverse()) {
              if (change.type === "INSERT")
                (draft[change.table] as AllBlockTypes[]) = draft[
                  change.table
                ].filter((item) => item.id !== change.row.id);
              else if (change.type === "UPDATE") {
                const table = draft[change.table] as AllBlockTypes[];
                const index = table.findIndex(
                  (item) => item.id === change.row.id
                );
                if (index !== -1) table[index] = change.prevRow;
              } else if (change.type === "DELETE")
                (draft[change.table] as AllBlockTypes[]).push(change.row);
            }
            draft.redoStack.unshift(draft.undoStack.pop()!);
          },
          dbAction: async () => {
            for (const change of [...entryToUndo.changes].reverse()) {
              await revertChange(change);
            }
            return { error: null };
          },
        });
      },

      redo: async () => {
        const { redoStack } = get();
        if (redoStack.length === 0) return;
        const entryToRedo = redoStack[0];

        await performOptimisticUpdate(get, (fn) => set(produce(fn)), {
          localUpdate: (draft) => {
            for (const change of entryToRedo.changes) {
              if (change.type === "INSERT")
                (draft[change.table] as AllBlockTypes[]).push(change.row);
              else if (change.type === "UPDATE") {
                const table = draft[change.table] as AllBlockTypes[];
                const index = table.findIndex(
                  (item) => item.id === change.row.id
                );
                if (index !== -1) table[index] = change.row;
              } else if (change.type === "DELETE")
                (draft[change.table] as AllBlockTypes[]) = draft[
                  change.table
                ].filter((item) => item.id !== change.row.id);
            }
            draft.undoStack.push(draft.redoStack.shift()!);
          },
          dbAction: async () => {
            for (const change of entryToRedo.changes) {
              await applyChange(change);
            }
            return { error: null };
          },
        });
      },
    })
  )
);
