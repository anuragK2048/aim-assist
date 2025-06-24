import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Goal, Target, Node, Task } from "@types";
import { supabase } from "@lib/supabase";
import { client_id } from "@/lib/client";

type AppData = {
  goals: Goal[];
  targets: Target[];
  nodes: Node[];
  tasks: Task[];
};

type AppState = AppData & {
  history: AppData[];
  future: AppData[];

  // Core
  setAll: (data: AppData) => void;
  undo: () => void;
  redo: () => void;

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
        history: [...s.history, snapshot(s)],
        future: [],
      })),

    undo: () => {
      const { history, future } = get();
      if (history.length === 0) return;
      const prev = history[history.length - 1];
      set((s) => ({
        ...prev,
        history: history.slice(0, -1),
        future: [snapshot(s), ...future],
      }));
    },

    redo: () => {
      const { history, future } = get();
      if (future.length === 0) return;
      const next = future[0];
      set((s) => ({
        ...next,
        history: [...history, snapshot(s)],
        future: future.slice(1),
      }));
    },

    // Goals
    addGoal: async (goal) => {
      const fullGoal = { ...goal, client_id };
      const { error } = await supabase.from("goals").insert(fullGoal);
      if (error) throw error;
      set((s) => ({
        goals: [...s.goals, goal],
        history: [...s.history, snapshot(s)],
        future: [],
      }));
    },
    updateGoal: async (goal) => {
      const fullGoal = { ...goal, client_id };
      const { error } = await supabase
        .from("goals")
        .update(fullGoal)
        .eq("id", goal.id);
      if (error) throw error;
      set((s) => ({
        goals: s.goals.map((g) => (g.id === goal.id ? goal : g)),
        history: [...s.history, snapshot(s)],
        future: [],
      }));
    },
    removeGoal: async (id) => {
      // Fetch goal for undo or client_id check
      const { data: goal, error: fetchError } = await supabase
        .from("goals")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;
      if (!goal) throw new Error("Goal not found");

      // Attach client_id before deletion using update
      const { error: updateError } = await supabase
        .from("goals")
        .update({ client_id }) // <-- mark as self-change
        .eq("id", id);

      if (updateError) throw updateError;

      // Now delete
      const { error: deleteError } = await supabase
        .from("goals")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      set((s) => ({
        goals: s.goals.filter((g) => g.id !== id),
        history: [...s.history, snapshot(s)],
        future: [],
      }));
    },

    // Targets
    addTarget: async (target) => {
      const fullTarget = { ...target, client_id };
      const { error } = await supabase.from("targets").insert(fullTarget);
      if (error) throw error;
      set((s) => ({
        targets: [...s.targets, target],
        history: [...s.history, snapshot(s)],
        future: [],
      }));
    },
    updateTarget: async (target) => {
      const fullTarget = { ...target, client_id };
      const { error } = await supabase
        .from("targets")
        .update(fullTarget)
        .eq("id", target.id);
      if (error) throw error;
      set((s) => ({
        targets: s.targets.map((t) => (t.id === target.id ? target : t)),
        history: [...s.history, snapshot(s)],
        future: [],
      }));
    },
    removeTarget: async (id) => {
      const { data: target, error: fetchError } = await supabase
        .from("targets")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;
      if (!target) throw new Error("target not found");

      // Attach client_id before deletion using update
      const { error: updateError } = await supabase
        .from("targets")
        .update({ client_id }) // <-- mark as self-change
        .eq("id", id);

      if (updateError) throw updateError;

      // Now delete
      const { error: deleteError } = await supabase
        .from("targets")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      set((s) => ({
        targets: s.targets.filter((t) => t.id !== id),
        history: [...s.history, snapshot(s)],
        future: [],
      }));
    },

    // Nodes
    addNode: async (node) => {
      const fullNode = { ...node, client_id };
      const { error } = await supabase.from("nodes").insert(fullNode);
      if (error) throw error;
      set((s) => ({
        nodes: [...s.nodes, node],
        history: [...s.history, snapshot(s)],
        future: [],
      }));
    },
    updateNode: async (node) => {
      const fullNode = { ...node, client_id };
      const { error } = await supabase
        .from("nodes")
        .update(fullNode)
        .eq("id", node.id);
      if (error) throw error;
      set((s) => ({
        nodes: s.nodes.map((n) => (n.id === node.id ? node : n)),
        history: [...s.history, snapshot(s)],
        future: [],
      }));
    },
    removeNode: async (id) => {
      const { data: node, error: fetchError } = await supabase
        .from("nodes")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;
      if (!node) throw new Error("node not found");

      // Attach client_id before deletion using update
      const { error: updateError } = await supabase
        .from("nodes")
        .update({ client_id }) // <-- mark as self-change
        .eq("id", id);

      if (updateError) throw updateError;

      // Now delete
      const { error: deleteError } = await supabase
        .from("nodes")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      set((s) => ({
        nodes: s.nodes.filter((n) => n.id !== id),
        history: [...s.history, snapshot(s)],
        future: [],
      }));
    },

    // Tasks
    addTask: async (task) => {
      const fullTask = { ...task, client_id };
      const { error } = await supabase.from("tasks").insert(fullTask);
      if (error) throw error;
      set((s) => ({
        tasks: [...s.tasks, task],
        history: [...s.history, snapshot(s)],
        future: [],
      }));
    },
    updateTask: async (task) => {
      const fullTask = { ...task, client_id };
      const { error } = await supabase
        .from("tasks")
        .update(fullTask)
        .eq("id", task.id);
      if (error) throw error;
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === task.id ? task : t)),
        history: [...s.history, snapshot(s)],
        future: [],
      }));
    },
    removeTask: async (id) => {
      const { data: task, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;
      if (!task) throw new Error("task not found");

      // Attach client_id before deletion using update
      const { error: updateError } = await supabase
        .from("tasks")
        .update({ client_id }) // <-- mark as self-change
        .eq("id", id);

      if (updateError) throw updateError;

      // Now delete
      const { error: deleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      set((s) => ({
        tasks: s.tasks.filter((t) => t.id !== id),
        history: [...s.history, snapshot(s)],
        future: [],
      }));
    },
  }))
);

// ✅ Deep copy of app state before every change
function snapshot(state: AppState): AppData {
  return {
    goals: structuredClone(state.goals),
    targets: structuredClone(state.targets),
    nodes: structuredClone(state.nodes),
    tasks: structuredClone(state.tasks),
  };
}
