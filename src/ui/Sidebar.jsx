import { useNavigate } from "react-router";
import style from "./Sidebar.module.css";
import { CgProfile } from "react-icons/cg";

function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className={style.container}>
      <div className={style.topPart}>
        <div className={style.left}>
          <CgProfile className={style.profileLogo} />
          <h2>User</h2>
        </div>
        <div className={style.right}>
          <h2>AimAssist</h2>
        </div>
      </div>
      <div className={style.list}>
        <h2 onClick={() => navigate("target")}>Target</h2>
        <h2 onClick={() => navigate("task/all_tasks")}>Task</h2>
        <h2 onClick={() => navigate("dailyTask")}>.</h2>
        <h2 onClick={() => navigate("scheduleDay")}>Schedule Day</h2>
        <h2 onClick={() => navigate("daySchedule")}>Day Schedule</h2>
        <h2 onClick={() => navigate("journal")}>Journal</h2>
      </div>
    </div>
  );
}

export default Sidebar;
