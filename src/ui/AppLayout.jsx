import { Outlet } from "react-router";
import style from "./AppLayout.module.css";
import Sidebar from "./Sidebar";

function AppLayout() {
  return (
    <div className={style.container}>
      <div className={style.sidebar}>
        <Sidebar />
      </div>
      <div className="bg-blite/90 relative flex w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
