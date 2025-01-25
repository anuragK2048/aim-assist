import { useNavigate } from "react-router";
import { useUserState } from "../../context/UserStateContext";
import { getCurrentUser, login, signUp } from "../../services/apiAuth";

function Signup() {
  const { setUserData } = useUserState();
  const navigate = useNavigate();
  async function handleSignup(e) {
    e.preventDefault();
    const id = e.target[0].value;
    const password = e.target[1].value;
    if (!id || !password) return;
    const signUpData = await signUp(id, password);
    console.log(signUpData);
    if (!signUpData.user) {
      alert(signUpData);
      return;
    } else {
      setUserData(signUpData); //updating userStateContext
      navigate("/app");
      // const loginData = await login(id, password);
      // if (!loginData.user) {
      //   alert("invalid login credentials");
      //   return;
      // } else {
      //   setUserData(loginData); //updating userStateContext
      //   navigate("/app");
      // }
    }
    // const sessionData = await getCurrentUser();
  }
  return (
    <div>
      <form onSubmit={handleSignup} className="flex flex-col gap-3">
        <div>
          <div>User ID</div>
          <input type="text" defaultValue={"hello@gmail.com"} />
        </div>
        <div>
          <div>Password</div>
          <input type="password" defaultValue={"qwerty"} />
        </div>
        <button
          type="submit"
          className="w-fit cursor-pointer rounded bg-slate-400 p-1"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
export default Signup;
