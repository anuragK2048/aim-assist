import { getFullDate } from "../utility/utilFunctions";
import supabase from "./supabase";

export async function getRemoteSchedule() {
  let { data: daySchedule, error } = await supabase
    .from("day schedule")
    .select("*");
  if (error) console.error(error);
  const [currentDaySchedule] = daySchedule.filter(
    (schedule) => schedule.global_id_date === getFullDate(new Date())
  );
  return currentDaySchedule;
}

export async function addRemoteSchedule(newSchedule) {
  const { data, error } = await supabase
    .from("day schedule")
    .insert([newSchedule])
    .select();
  if (error) console.error(error);
}

export async function updateRemoteSchedule(updatedSchedule) {
  const { data, error } = await supabase
    .from("day schedule")
    .update(updatedSchedule)
    .eq("global_id_date", `${updatedSchedule.global_id_date}`)
    .select();
  if (error) console.error(error);
}
