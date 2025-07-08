import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Goal, Target, Node, Task } from "@types";
import { supabase } from "@lib/supabase";
import { client_id } from "@/lib/client";
import { snapshot } from "@/lib/snapshot";

export type AppData = {
  goals: Goal[];
  targets: Target[];
  nodes: Node[];
  tasks: Task[];
};

export type AppState = AppData & {
  history: HistoryEntry[];
  future: HistoryEntry[];

  // Core
  setAll: (data: AppData) => void;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  commit: (entry: HistoryEntry) => void;

  // Goals
  addGoal: (goal: Goal) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;

  // Targets
  addTarget: (target: Target) => Promise<void>;
  updateTarget: (target: Target) => Promise<void>;
  removeTarget: (id: string) => Promise<void>;

  // Nodes
  addNode: (node: Node) => Promise<void>;
  updateNode: (node: Node) => Promise<void>;
  removeNode: (id: string) => Promise<void>;

  // Tasks
  addTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
};

type Change<T> = {
  table: "goals" | "targets" | "nodes" | "tasks";
  type: "INSERT" | "UPDATE" | "DELETE";
  row: T;
  prevRow?: T; // for update and delete
};

type HistoryEntry = {
  changes: Change<any>[];
};

export const useAppStore = create<AppState>()(
  devtools((set, get) => ({
    // Initial State
    goals: [],
    targets: [],
    nodes: [],
    tasks: [],
    history: [],
    future: [],

    // Core
    setAll: (data) =>
      set((s) => ({
        ...data,
        history: [...s.history, { changes: [] }],
        future: [],
      })),

    commit: (entry) => {
      set((s) => ({
        history: [...s.history, entry],
        future: [],
      }));
    },

    undo: async () => {
      const { history, future } = get();
      if (history.length === 0) return;

      const entry = history[history.length - 1];

      // Revert each change in reverse order
      for (const change of [...entry.changes].reverse()) {
        await revertChange(change);
        set((s) => {
          const table = change.table;
          if (change.type === "INSERT") {
            return {
              [table]: s[table].filter((item) => item.id !== change.row.id),
            };
          } else if (change.type === "UPDATE") {
            return {
              [table]: s[table].map((item) =>
                item.id === change.row.id ? change.prevRow : item
              ),
            };
          } else if (change.type === "DELETE") {
            return { [table]: [...s[table], change.row] };
          }
          return {};
        });
      }

      set((s) => ({
        history: history.slice(0, -1),
        future: [entry, ...future],
      }));
    },

    redo: async () => {
      const { history, future } = get();
      if (future.length === 0) return;

      const entry = future[0];

      for (const change of entry.changes) {
        await applyChange(change);
        set((s) => {
          const table = change.table;
          if (change.type === "INSERT") {
            return { [table]: [...s[table], change.row] };
          } else if (change.type === "UPDATE") {
            return {
              [table]: s[table].map((item) =>
                item.id === change.row.id ? change.row : item
              ),
            };
          } else if (change.type === "DELETE") {
            return {
              [table]: s[table].filter((item) => item.id !== change.row.id),
            };
          }
          return {};
        });
      }

      set((s) => ({
        history: [...history, entry],
        future: future.slice(1),
      }));
    },

    addBlock: async <T extends Goal | Target | Node | Task>(
      blockType: keyof AppData,
      blockContent: T
    ) => {
      const fullContent = { ...blockContent, client_id };

      const { error } = await supabase.from(blockType).insert(fullContent);
      if (error) throw error;

      set((s) => {
        const newChange = {
          table: blockType,
          type: "INSERT",
          row: fullContent,
        };

        return {
          ...s,
          [blockType]: [...s[blockType], fullContent],
          history: [...s.history, { changes: [newChange] }],
          future: [],
        };
      });
    },

    updateBlock: async <T extends Goal | Target | Node | Task>(
      blockType: keyof AppData,
      updatedBlock: T
    ) => {
      const prev = get()[blockType].find((b) => b.id === updatedBlock.id) as T;
      if (!prev) return;

      const fullBlock = { ...updatedBlock, client_id };

      const { error } = await supabase
        .from(blockType)
        .update(fullBlock)
        .eq("id", updatedBlock.id);

      if (error) throw error;

      set((s) => {
        const updatedList = s[blockType].map((b) =>
          b.id === updatedBlock.id ? updatedBlock : b
        );

        const newChange = {
          table: blockType,
          type: "UPDATE",
          row: updatedBlock,
          prevRow: prev,
        };

        return {
          [blockType]: updatedList,
          history: [...s.history, { changes: [newChange] }],
          future: [],
        };
      });
    },

    removeBlock: async <T extends Goal | Target | Node | Task>(
      blockType: keyof AppData,
      id: string
    ) => {
      const prev = get()[blockType].find((b) => b.id === id) as T;
      if (!prev) return;

      const { error: updateError } = await supabase
        .from(blockType)
        .update({ client_id })
        .eq("id", id);

      if (updateError) throw updateError;

      const { error: deleteError } = await supabase
        .from(blockType)
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      set((s) => {
        const newChange = {
          table: blockType,
          type: "DELETE",
          row: prev,
        };

        return {
          [blockType]: s[blockType].filter((b) => b.id !== id),
          history: [...s.history, { changes: [newChange] }],
          future: [],
        };
      });
    },

    // // Targets
    // addTarget: async (target) => {
    //   const fullTarget = { ...target, client_id };
    //   const { error } = await supabase.from("targets").insert(fullTarget);
    //   if (error) throw error;
    //   set((s) => ({
    //     targets: [...s.targets, target],
    //     history: [...s.history, snapshot(s)],
    //     future: [],
    //   }));
    // },
    // updateTarget: async (target) => {
    //   const fullTarget = { ...target, client_id };
    //   const { error } = await supabase
    //     .from("targets")
    //     .update(fullTarget)
    //     .eq("id", target.id);
    //   if (error) throw error;
    //   set((s) => ({
    //     targets: s.targets.map((t) => (t.id === target.id ? target : t)),
    //     history: [...s.history, snapshot(s)],
    //     future: [],
    //   }));
    // },
    // removeTarget: async (id) => {
    //   const { data: target, error: fetchError } = await supabase
    //     .from("targets")
    //     .select("*")
    //     .eq("id", id)
    //     .single();

    //   if (fetchError) throw fetchError;
    //   if (!target) throw new Error("target not found");

    //   // Attach client_id before deletion using update
    //   const { error: updateError } = await supabase
    //     .from("targets")
    //     .update({ client_id }) // <-- mark as self-change
    //     .eq("id", id);

    //   if (updateError) throw updateError;

    //   // Now delete
    //   const { error: deleteError } = await supabase
    //     .from("targets")
    //     .delete()
    //     .eq("id", id);

    //   if (deleteError) throw deleteError;
    //   set((s) => ({
    //     targets: s.targets.filter((t) => t.id !== id),
    //     history: [...s.history, snapshot(s)],
    //     future: [],
    //   }));
    // },

    // // Nodes
    // addNode: async (node) => {
    //   const fullNode = { ...node, client_id };
    //   const { error } = await supabase.from("nodes").insert(fullNode);
    //   if (error) throw error;
    //   set((s) => ({
    //     nodes: [...s.nodes, node],
    //     history: [...s.history, snapshot(s)],
    //     future: [],
    //   }));
    // },
    // updateNode: async (node) => {
    //   const fullNode = { ...node, client_id };
    //   const { error } = await supabase
    //     .from("nodes")
    //     .update(fullNode)
    //     .eq("id", node.id);
    //   if (error) throw error;
    //   set((s) => ({
    //     nodes: s.nodes.map((n) => (n.id === node.id ? node : n)),
    //     history: [...s.history, snapshot(s)],
    //     future: [],
    //   }));
    // },
    // removeNode: async (id) => {
    //   const { data: node, error: fetchError } = await supabase
    //     .from("nodes")
    //     .select("*")
    //     .eq("id", id)
    //     .single();

    //   if (fetchError) throw fetchError;
    //   if (!node) throw new Error("node not found");

    //   // Attach client_id before deletion using update
    //   const { error: updateError } = await supabase
    //     .from("nodes")
    //     .update({ client_id }) // <-- mark as self-change
    //     .eq("id", id);

    //   if (updateError) throw updateError;

    //   // Now delete
    //   const { error: deleteError } = await supabase
    //     .from("nodes")
    //     .delete()
    //     .eq("id", id);

    //   if (deleteError) throw deleteError;
    //   set((s) => ({
    //     nodes: s.nodes.filter((n) => n.id !== id),
    //     history: [...s.history, snapshot(s)],
    //     future: [],
    //   }));
    // },

    // // Tasks
    // addTask: async (task) => {
    //   const fullTask = { ...task, client_id };
    //   const { error } = await supabase.from("tasks").insert(fullTask);
    //   if (error) throw error;
    //   set((s) => ({
    //     tasks: [...s.tasks, task],
    //     history: [...s.history, snapshot(s)],
    //     future: [],
    //   }));
    // },
    // updateTask: async (task) => {
    //   const fullTask = { ...task, client_id };
    //   const { error } = await supabase
    //     .from("tasks")
    //     .update(fullTask)
    //     .eq("id", task.id);
    //   if (error) throw error;
    //   set((s) => ({
    //     tasks: s.tasks.map((t) => (t.id === task.id ? task : t)),
    //     history: [...s.history, snapshot(s)],
    //     future: [],
    //   }));
    // },
    // removeTask: async (id) => {
    //   const { data: task, error: fetchError } = await supabase
    //     .from("tasks")
    //     .select("*")
    //     .eq("id", id)
    //     .single();

    //   if (fetchError) throw fetchError;
    //   if (!task) throw new Error("task not found");

    //   // Attach client_id before deletion using update
    //   const { error: updateError } = await supabase
    //     .from("tasks")
    //     .update({ client_id }) // <-- mark as self-change
    //     .eq("id", id);

    //   if (updateError) throw updateError;

    //   // Now delete
    //   const { error: deleteError } = await supabase
    //     .from("tasks")
    //     .delete()
    //     .eq("id", id);

    //   if (deleteError) throw deleteError;
    //   set((s) => ({
    //     tasks: s.tasks.filter((t) => t.id !== id),
    //     history: [...s.history, snapshot(s)],
    //     future: [],
    //   }));
    // },
  }))
);

async function applyChange<T>(change: Change<T>) {
  const { type, table, row } = change;
  if (type === "INSERT") {
    await supabase.from(table).insert(row);
  } else if (type === "UPDATE") {
    await supabase.from(table).update(row).eq("id", row.id);
  } else if (type === "DELETE") {
    await supabase.from(table).delete().eq("id", row.id);
  }
}

async function revertChange<T>(change: Change<T>) {
  const { type, table, row, prevRow } = change;
  if (type === "INSERT") {
    console.log("hiasox");
    await supabase.from(table).delete().eq("id", row.id);
  } else if (type === "UPDATE") {
    await supabase.from(table).update(prevRow).eq("id", row.id);
  } else if (type === "DELETE") {
    await supabase.from(table).insert(row);
  }
}
