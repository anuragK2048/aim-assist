import { Link } from "react-router";
import Authentication from "../features/authentication/Authentication";

function HomePage() {
  return (
    <div
      className="flex h-[100vh] flex-col items-center justify-center gap-5"
      style={{ border: "2px solid black" }}
    >
      <div className="flex flex-col gap-3 rounded-md border-2 border-[var(--theme-yellow)] p-3">
        <h1 className="text-4xl text-[var(--theme-yellow)]">AimAssist</h1>
        <Authentication />
        <button className="rounded-xl border-2 border-[var(--theme-yellow)] bg-yellow-200 px-2 py-1 text-2xl text-sky-800">
          <Link to={"/app"}>Login</Link>
        </button>
      </div>
    </div>
  );
}

export default HomePage;
