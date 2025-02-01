import getUserId from "./getUserId";
import supabase from "./supabase";

export async function getTaskRemote() {
  const user_id = getUserId();
  let { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user_id);
  if (error) console.log(error);
  return tasks;
}

export async function addTaskRemote(newTask) {
  const user_id = getUserId();
  if (Array.isArray(newTask)) {
    const updatedNewTask = newTask.map((task) => {
      return { ...task, user_id: user_id };
    });
    const { data, error } = await supabase
      .from("tasks")
      .insert(updatedNewTask)
      .select();
    if (error) {
      console.error(error);
    }
    return data;
  } else {
    const { data, error } = await supabase
      .from("tasks")
      .insert([{ ...newTask, user_id: user_id }])
      .select();
    if (error) {
      console.error(error);
    }
    return data;
  }
}

export async function updateTaskRemote(global_id, updatedTask) {
  const user_id = getUserId();
  const { data, error } = await supabase
    .from("tasks")
    .update({ ...updatedTask })
    .eq("global_id", global_id)
    .eq("user_id", user_id)
    .select();
  if (error) console.error(error);
  return data;
}

export async function deleteTaskRemote(global_id) {
  const user_id = getUserId();
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("global_id", global_id)
    .eq("user_id", user_id);
  if (error) console.error(error);
}
