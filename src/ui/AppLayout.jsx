import { Outlet } from "react-router";
import style from "./AppLayout.module.css";
import Sidebar from "./Sidebar";

function AppLayout() {
  return (
    <div className={style.container}>
      <div className={style.sidebar}>
        <Sidebar />
      </div>
      <div className={style.display}>
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
