import { getFullDate } from "../utility/utilFunctions";
import supabase from "./supabase";

export async function getRemoteSchedule() {
  const user_id = JSON.parse(
    localStorage.getItem("sb-guhajgofwwntarznvykd-auth-token"),
  ).user.id; //getting user_id from local storage
  let { data: daySchedule, error } = await supabase
    .from("day_schedule")
    .select("*")
    .eq("user_id", user_id);
  if (error) console.error(error);
  const [currentDaySchedule] = daySchedule.filter(
    (schedule) => schedule.global_id_date === getFullDate(new Date()),
  );
  return currentDaySchedule;
}

export async function addRemoteSchedule(newSchedule) {
  const user_id = JSON.parse(
    localStorage.getItem("sb-guhajgofwwntarznvykd-auth-token"),
  ).user.id;
  const { data, error } = await supabase
    .from("day_schedule")
    .insert([{ ...newSchedule, user_id: user_id }])
    .select();
  if (error) console.error(error);
}

export async function updateRemoteSchedule(updatedSchedule) {
  const user_id = JSON.parse(
    localStorage.getItem("sb-guhajgofwwntarznvykd-auth-token"),
  ).user.id;
  const { data, error } = await supabase
    .from("day_schedule")
    .update(updatedSchedule)
    .eq("global_id_date", `${updatedSchedule.global_id_date}`)
    .eq("user_id", user_id)
    .select();
  if (error) console.error(error);
}
