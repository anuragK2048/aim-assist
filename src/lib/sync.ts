import { supabase } from "./supabase"; // Adjust path to your supabase client
import { useAppStore } from "@store/useAppStore"; // Adjust path to your store
import { produce } from "immer";
import { AppData, Target, Node, Task, Goal } from "@/types"; // Adjust path to your types
import { client_id } from "./client"; // Adjust path to your client_id generator

type AllBlockTypes = Goal | Target | Node | Task;

// Use a Map for easier management of channels
const channelMap = new Map<string, ReturnType<typeof supabase.channel>>();
const tables: (keyof AppData)[] = ["goals", "targets", "nodes", "tasks"];

/**
 * Initializes real-time listeners for all productivity tables for a given user.
 * This should be called once after a user logs in.
 * @param userId - The ID of the authenticated user.
 */
export function initRealtime(userId: string) {
  // If we already have channels, it means init was called before without cleanup.
  // It's safer to clean up first before creating new subscriptions.
  if (channelMap.size > 0) {
    console.warn(
      "Real-time channels were already initialized. Cleaning up old channels before starting new ones."
    );
    cleanupRealtime();
  }

  console.log(`🚀 Initializing real-time subscriptions for user: ${userId}`);

  for (const table of tables) {
    const channelName = `${table}-changes-for-${userId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for INSERT, UPDATE, DELETE
          schema: "public",
          table,
          filter: `user_id=eq.${userId}`, // Important: Only listen for changes relevant to the current user
        },
        (payload) => {
          console.log("realtime update");
          const { eventType, new: newRow, old: oldRow } = payload;

          // --- ✅ ROBUST ECHO PREVENTION with REPLICA IDENTITY FULL ---

          // For INSERT/UPDATE, check the `new` row's client_id
          if (
            (eventType === "INSERT" || eventType === "UPDATE") &&
            newRow?.client_id === client_id
          ) {
            return;
          }

          // For DELETE, now that REPLICA IDENTITY is FULL, the `old` row's client_id is reliable.
          // We can safely ignore echoes for deletions as well.
          if (eventType === "DELETE" && oldRow?.client_id === client_id) {
            return;
          }

          // If we reach here, it's a genuine remote change.
          console.log(
            `⬇️ Real-time event received for table '${table}':`,
            payload
          );
          applyRemoteChange(table, eventType, newRow, oldRow);
        }
      )
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED") {
          console.log(
            `✅ Successfully subscribed to real-time changes on '${table}'`
          );
        }
        if (status === "CHANNEL_ERROR") {
          console.error(`❌ Failed to subscribe to '${table}'. Error:`, err);
        }
      });

    channelMap.set(channelName, channel);
  }
}

/**
 * Unsubscribes from all active real-time channels.
 * This is CRITICAL and should be called when the user logs out or the app unmounts.
 */
export async function cleanupRealtime() {
  console.log(`🧹 Cleaning up ${channelMap.size} real-time channels...`);
  // Use Promise.all to unsubscribe from all channels concurrently
  await Promise.all(
    Array.from(channelMap.values()).map((channel) =>
      supabase.removeChannel(channel)
    )
  );
  channelMap.clear();
  console.log("✅ All real-time channels removed.");
}

/**
 * Applies a change received from a remote client to the local Zustand store.
 * @param key - The table name (e.g., 'goals', 'tasks').
 * @param type - The event type ('INSERT', 'UPDATE', 'DELETE').
 * @param newRow - The new record data (for INSERT/UPDATE).
 * @param oldRow - The old record data (for DELETE).
 */
function applyRemoteChange(
  key: keyof AppData,
  type: "INSERT" | "UPDATE" | "DELETE" | string, // Supabase eventType is a string
  newRow?: Record<string, any>,
  oldRow?: Record<string, any>
) {
  useAppStore.setState(
    produce((draft: AppData) => {
      // Use Immer for safe and consistent state updates
      const table = draft[key] as AllBlockTypes[];

      switch (type) {
        case "INSERT":
          if (newRow) {
            // Avoid adding duplicates if the record somehow already exists
            if (!table.some((item) => item.id === newRow.id)) {
              table.push(newRow as AllBlockTypes);
            }
          }
          break;

        case "UPDATE":
          if (newRow) {
            const index = table.findIndex((item) => item.id === newRow.id);
            if (index !== -1) {
              // Merge the new data with existing data to preserve any fields not sent in the payload
              table[index] = { ...table[index], ...newRow };
            }
          }
          break;

        case "DELETE":
          // For DELETE, the ID is in the `old` payload
          const idToDelete = oldRow?.id;
          if (idToDelete) {
            const indexToDelete = table.findIndex(
              (item) => item.id === idToDelete
            );
            if (indexToDelete !== -1) {
              table.splice(indexToDelete, 1);
            }
          }
          break;
      }
    }),
    false, // `false` prevents `setState` from being named in devtools, keeping the log clean
    `realtime/${type.toLowerCase()}_${key}` // Custom action name for Zustand devtools
  );
}
