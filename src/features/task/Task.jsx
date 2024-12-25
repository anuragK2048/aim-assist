import { useSelector } from "react-redux";
import style from "./Task.module.css";
import { Outlet, useNavigate } from "react-router";
import { useState } from "react";
import AddTaskForm from "./AddTaskForm";

function Task() {
  const navigate = useNavigate();
  const { targets } = useSelector((store) => store.targets);
  return (
    <div className={style.mainContainer}>
      <div className={style.headerContainer}>
        <button onClick={() => navigate("all_tasks")}>All Tasks</button>
        {targets.map((target, index) => {
          return (
            <button
              onClick={() => navigate(`${target.name}`)}
              key={target.global_id}
              style={{ backgroundColor: "#e1dad3" }}
            >
              {target.name}
            </button>
          );
        })}
        <button onClick={() => navigate("daily_tasks")}>Daily Tasks</button>
        <button onClick={() => navigate("scheduled_tasks")}>
          Scheduled Tasks
        </button>
        <button
          onClick={() => navigate("addTask")}
          style={{ backgroundColor: "#f9f7f5" }}
        >
          + Add Tasks
        </button>
      </div>
      <div className={style.taskContainer}>
        <Outlet />
      </div>
    </div>
  );
}

export default Task;
