import { useNavigate } from "react-router";
import style from "./Sidebar.module.css";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  useEffect(
    function () {
      document.documentElement.className = "";
      document.documentElement.classList.add(theme);
    },
    [theme],
  );
  return (
    <div className={style.container}>
      <div className={style.topPart}>
        <div className={style.left}>
          <CgProfile
            className={style.profileLogo}
            onClick={() => navigate("/")}
          />
          <h2>User</h2>
        </div>
        <div
          className="absolute bottom-5 left-5 cursor-pointer"
          onClick={() => setTheme("dark")}
        >
          Dark
        </div>
        <div
          className="absolute bottom-10 left-5 cursor-pointer"
          onClick={() => setTheme("light")}
        >
          Light
        </div>
        <div className={style.right}>
          <h2>AimAssist</h2>
        </div>
      </div>
      <div className={style.list}>
        <h2 onClick={() => navigate("target")}>Target</h2>
        <h2 onClick={() => navigate("task/all_tasks")}>Task</h2>
        <h2 onClick={() => navigate("scheduleDay")}>Schedule Day</h2>
        <h2 onClick={() => navigate("daySchedule")}>Day Schedule</h2>
        <h2 onClick={() => navigate("journal")}>Journal</h2>
      </div>
    </div>
  );
}

export default Sidebar;
