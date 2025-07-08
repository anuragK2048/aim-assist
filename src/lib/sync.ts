import { supabase } from "./supabase";
import { useAppStore } from "@store/useAppStore";
import { Goal, Target, Node, Task } from "@types";
import { snapshot } from "./snapshot";
import { client_id } from "./client";

const tables = ["goals", "targets", "nodes", "tasks"] as const;

const channelMap: Record<string, ReturnType<typeof supabase.channel>> = {};

export function initRealtime(userId: string) {
  for (const table of tables) {
    const channelName = `${table}-changes`;
    if (!channelMap[channelName]) {
      const channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table,
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log(payload);
            const { eventType, new: newRow, old } = payload;
            if (newRow?.client_id == client_id) return;
            if (old?.client_id == client_id) return;
            switch (table) {
              case "goals":
                applyChange("goals", eventType, newRow, old);
                break;
              case "targets":
                applyChange("targets", eventType, newRow, old);
                break;
              case "nodes":
                applyChange("nodes", eventType, newRow, old);
                break;
              case "tasks":
                applyChange("tasks", eventType, newRow, old);
                break;
            }
          }
        )
        .subscribe();
      console.log("subscribed");
      channelMap[channelName] = channel;
    }
  }
}

function applyChange<T extends Goal | Target | Node | Task>(
  key: "goals" | "targets" | "nodes" | "tasks",
  type: string,
  newRow?: T,
  oldRow?: T
) {
  useAppStore.setState((state) => {
    const updatedArray = (() => {
      if (type === "INSERT" && newRow) {
        return [...state[key], newRow];
      } else if (type === "UPDATE" && newRow) {
        return state[key].map((item) =>
          item.id === newRow.id ? newRow : item
        );
      } else if (type === "DELETE" && oldRow) {
        return state[key].filter((item) => item.id !== oldRow.id);
      }
      return state[key];
    })();

    return {
      [key]: updatedArray,
      history: [...state.history, snapshot(state)],
      future: [],
    };
  });
}
