import { useNavigate } from "react-router";
import style from "./Sidebar.module.css";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";

//style for list of menu items
const MenuItem = ({ children, onClick }) => (
  <div
    className="cursor-pointer rounded border-slate-100 bg-[#6f736d]/100 p-1 text-center text-xl text-gray-300 hover:text-blue-300 sm:text-3xl"
    style={{ border: "2px solid rgb(111 115 109)" }}
    onClick={onClick}
  >
    {children}
  </div>
);

function Sidebar({ setShowSidebar }) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark");
  useEffect(
    function () {
      document.documentElement.className = "";
      document.documentElement.classList.add(theme);
    },
    [theme],
  );
  return (
    <div className={style.container}>
      <div className="flex flex-col items-center justify-center gap-2 md:flex-col">
        <div className="flex w-full flex-col items-center justify-evenly 2xl:flex-row 2xl:gap-10">
          <div className="mt-6 flex flex-col items-center justify-center">
            <CgProfile className="h-12 w-auto" onClick={() => navigate("/")} />
            <h2 className="text-xl">User</h2>
          </div>
          <div className="">
            <div className="text-2xl text-yellow-500/60 md:text-3xl">
              AimAssist
            </div>
          </div>
        </div>
        {theme === "light" ? (
          <MdDarkMode
            className="mt-5 h-9 w-auto md:h-12"
            onClick={() => setTheme("dark")}
          />
        ) : (
          <MdOutlineLightMode
            className="mt-5 h-9 w-auto md:h-12"
            onClick={() => setTheme("light")}
          />
        )}
      </div>
      <div className="md:3 mx-2 flex flex-col items-center justify-center gap-3">
        <MenuItem onClick={() => navigate("target") && setShowSidebar(false)}>
          Target
        </MenuItem>
        <MenuItem
          onClick={() => navigate("task/all_tasks") && setShowSidebar(false)}
        >
          Task
        </MenuItem>
        <MenuItem
          onClick={() => navigate("scheduleDay") && setShowSidebar(false)}
        >
          Schedule Day
        </MenuItem>
        <MenuItem
          onClick={() => navigate("daySchedule") && setShowSidebar(false)}
        >
          Day Schedule
        </MenuItem>
        <MenuItem onClick={() => navigate("journal") && setShowSidebar(false)}>
          Journal
        </MenuItem>
      </div>
    </div>
  );
}

export default Sidebar;
