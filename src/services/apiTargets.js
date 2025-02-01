import getUserId from "./getUserId";
import supabase from "./supabase";

export async function getTargets() {
  const user_id = getUserId();
  let { data: targets, error } = await supabase
    .from("targets")
    .select("*")
    .eq("user_id", user_id);
  if (error) {
    console.error(error);
    throw new Error("targets cant be loaded");
  }
  return targets;
}

export async function updateTarget(global_id, updatedTarget) {
  const user_id = getUserId();
  const { data, error } = await supabase
    .from("targets")
    .update({ ...updatedTarget })
    .eq("global_id", global_id)
    .eq("user_id", user_id)
    .select();
  if (error) {
    console.error(error);
  }
  return data;
}

export async function addTarget(newTarget) {
  const user_id = getUserId();
  const { data, error } = await supabase
    .from("targets")
    .insert([{ ...newTarget, user_id: user_id }])
    .select();
  if (error) console.log(error);
  return data;
}

export async function deleteTargetRemote(global_id) {
  const user_id = getUserId();
  const { error } = await supabase
    .from("targets")
    .delete()
    .eq("global_id", global_id);
  // .eq("user_id", user_id);
  if (error) console.error(error);
}
// updateTarget(false, 3);
