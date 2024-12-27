import { add, remove, update } from "../features/target/targetSlice";
import supabase from "./supabase";

let supabaseSubscription;

export function supabaseMiddleware(store) {
  return function (next) {
    return function (action) {
      if (action.type === "SUPABASE_INIT") {
        const { dispatch, getState } = store;
        // setInterval(() => {
        //   console.log("target subscription active");
        // }, 1000);
        // Setup Supabase subscription
        supabaseSubscription = supabase
          .channel("custom-all-channel")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "targets" },
            (payload) => {
              console.log("Target update received:");

              const { targets } = getState().targets;

              if (payload.eventType === "INSERT") {
                const exists = targets.some(
                  (target) => target.global_id === payload.new.global_id
                );
                if (!exists) {
                  dispatch(add(payload.new));
                }
              } else if (payload.eventType === "DELETE") {
                targets.forEach((target) => {
                  if (target.id === payload.old.id) {
                    dispatch(remove(target.global_id));
                  }
                  return;
                });
              } else if (payload.eventType === "UPDATE") {
                const updatedTargets = targets.map((target) =>
                  target.global_id == payload.new.global_id
                    ? payload.new
                    : target
                );
                dispatch(update(updatedTargets));
              }
            }
          )
          .subscribe();
      }

      // Handle cleanup action
      if (action.type === "SUPABASE_CLEANUP") {
        if (supabaseSubscription) {
          //   supabaseSubscription.unsubscribe();
          //   console.log("Supabase subscription cleaned up.");
        }
      }

      return next(action);
    };
  };
}
