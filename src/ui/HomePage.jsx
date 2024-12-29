import { Link } from "react-router";
import style from "./HomePage.module.css";

function HomePage() {
  return (
    <div className={style.container}>
      <h1 className={style.title}>AimAssist</h1>
      <button className={style.button}>
        <Link to={"/app"}>Login</Link>
      </button>
    </div>
  );
}

export default HomePage;
