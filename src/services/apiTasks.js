import supabase from "./supabase";

export async function getTaskRemote() {
  let { data: tasks, error } = await supabase.from("tasks").select("*");
  if (error) console.log(error);
  return tasks;
}

export async function addTaskRemote(newTask) {
  if (Array.isArray(newTask)) {
    const { data, error } = await supabase
      .from("tasks")
      .insert(newTask)
      .select();
    if (error) {
      console.error(error);
    }
    return data;
  } else {
    const { data, error } = await supabase
      .from("tasks")
      .insert([newTask])
      .select();
    if (error) {
      console.error(error);
    }
    return data;
  }
}

export async function updateTaskRemote(global_id, updatedTask) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ ...updatedTask })
    .eq("global_id", global_id)
    .select();
  if (error) console.error(error);
  return data;
}

export async function deleteTaskRemote(global_id) {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("global_id", global_id);
  if (error) console.error(error);
}
