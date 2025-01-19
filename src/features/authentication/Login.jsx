import { useNavigate } from "react-router";
import { login } from "../../services/apiAuth";

function Login() {
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
    }
    console.log(loginData);
    navigate("/app");
  }
  return (
    <div>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <div>
          <div>User ID</div>
          <input type="text" defaultValue={"u@u.com"} autoComplete="username" />
        </div>
        <div>
          <div>Password</div>
          <input type="password" defaultValue={"1"} />
        </div>
        <button
          type="submit"
          className="bg-slate-400 w-fit p-1 rounded cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
