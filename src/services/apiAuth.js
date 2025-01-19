import supabase from "./supabase";

export async function login(id, password) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email: id,
    password: password,
  });
  if (error) {
    console.error(error);
  }
  return data;
}
