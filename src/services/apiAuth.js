import supabase from "./supabase";

export async function signUp(user_id, password) {
  let { data, error } = await supabase.auth.signUp({
    email: user_id,
    password: password,
  });
  if (error) {
    console.error(error);
    return error;
  }
  return data;
}

export async function login(id, password) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email: id,
    password: password,
  });
  if (error) console.log(error);
  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
