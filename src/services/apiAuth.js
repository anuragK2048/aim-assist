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

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  console.log(session);
  if (!session.session) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  return user;
}
