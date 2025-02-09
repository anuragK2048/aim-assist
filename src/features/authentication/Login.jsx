import { useNavigate } from "react-router";
import { getCurrentUser, login } from "../../services/apiAuth";
import { useUserState } from "../../context/UserStateContext";

function Login() {
  const { setUserData } = useUserState();
  const navigate = useNavigate();
  async function handleLogin(e) {
    e.preventDefault();
    const id = e.target[0].value;
    const password = e.target[1].value;
    if (!id || !password) return;
    const loginData = await login(id, password);
    if (!loginData.user) {
      alert("invalid login credentials");
      return;
    } else {
      setUserData(loginData); //updating userStateContext
      navigate("/app");
    }
    // const sessionData = await getCurrentUser();
  }
  return (
    <div>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <div>
          <div>User ID</div>
          <input
            type="text"
            defaultValue={"u@u.com"}
            autoComplete="username"
            className="border-2 border-[var(--theme-yellow)]"
          />
        </div>
        <div>
          <div>Password</div>
          <input
            type="password"
            defaultValue={"12"}
            className="border-2 border-[var(--theme-yellow)]"
          />
        </div>
        <button
          type="submit"
          className="w-fit cursor-pointer rounded bg-slate-400 p-1"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
