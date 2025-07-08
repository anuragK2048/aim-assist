import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/store/useAppStore";

export async function fetchUserData(user_id: string) {
  const [goalsRes, targetsRes, nodesRes, tasksRes] = await Promise.all([
    supabase.from("goals").select("*").eq("user_id", user_id),
    supabase.from("targets").select("*").eq("user_id", user_id),
    supabase.from("nodes").select("*").eq("user_id", user_id),
    supabase.from("tasks").select("*").eq("user_id", user_id),
  ]);

  const error =
    goalsRes.error || targetsRes.error || nodesRes.error || tasksRes.error;
  if (error) throw error;

  useAppStore.getState().setInitialData({
    goals: goalsRes.data ?? [],
    targets: targetsRes.data ?? [],
    nodes: nodesRes.data ?? [],
    tasks: tasksRes.data ?? [],
  });
}
