import supabase from "./supabase";

export async function getTargets() {
  let { data: targets, error } = await supabase.from("targets").select("*");
  if (error) {
    console.error(error);
    throw new Error("targets cant be loaded");
  }
  return targets;
}

export async function updateTarget(global_id, updatedTarget) {
  const { data, error } = await supabase
    .from("targets")
    .update({ ...updatedTarget })
    .eq("global_id", global_id)
    .select();
  if (error) {
    console.error(error);
  }
  return data;
}

export async function addTarget(newTarget) {
  const { data, error } = await supabase
    .from("targets")
    .insert([newTarget])
    .select();
  if (error) console.log(error);
  return data;
}

export async function deleteTarget(global_id) {
  const { error } = await supabase
    .from("targets")
    .delete()
    .eq("global_id", global_id);
}
// updateTarget(false, 3);
