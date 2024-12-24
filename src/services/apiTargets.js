import supabase from "./supabase";

export async function getTargets() {
  let { data: targets, error } = await supabase.from("targets").select("*");
  if (error) {
    console.error(error);
    throw new Error("targets cant be loaded");
  }
  return targets;
}

export async function updateTarget(id, updatedTarget) {
  const { data, error } = await supabase
    .from("targets")
    .update({ ...updatedTarget })
    .eq("id", id)
    .select();
  if (error) {
    console.error(error);
  }
  return data;
}

// updateTarget(false, 3);
