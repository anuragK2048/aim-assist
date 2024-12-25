import supabase from "./supabase";

export async function addTaskRemote(newTask) {
  const { data, error } = await supabase
    .from("tasks")
    .insert([newTask])
    .select();
  if (error) {
    console.error(error);
  }
  return data;
}

export async function getTaskRemote() {
  let { data: tasks, error } = await supabase.from("tasks").select("*");
  if (error) console.log(error);
  return tasks;
}
