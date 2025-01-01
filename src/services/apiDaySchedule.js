import supabase from "./supabase";

export async function addSchedule(newSchedule) {
  const { data, error } = await supabase
    .from("day schedule")
    .insert([newSchedule])
    .select();
  if (error) console.error(error);
}
