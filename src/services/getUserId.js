export default function getUserId() {
  const user_id = JSON.parse(
    localStorage.getItem("sb-guhajgofwwntarznvykd-auth-token"),
  ).user.id; //getting user_id from local storage
  return user_id;
}
