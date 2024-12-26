import { useDispatch, useSelector } from "react-redux";
import style from "./Task.module.css";
import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import AddTaskForm from "./AddTaskForm";
import { addTaskGlobal, deleteTaskGlobal, updateTaskGlobal } from "./taskSlice";
import supabase from "../../services/supabase";

function Task() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { targets } = useSelector((store) => store.targets);
  console.log("targets change received", targets);
  useEffect(() => {
    console.log("Targets changed: ", targets);
  }, [targets]);
  const { tasks } = useSelector((store) => store.tasks);
  const tasksTableUpdates = supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tasks" },
      (payload) => {
        console.log("task update received");
        // console.log(payload);
        if (payload.eventType === "INSERT") {
          const exists = tasks.some(
            (tasks) => tasks.global_id === payload.new.global_id
          );
          if (!exists) {
            dispatch(addTaskGlobal(payload.new));
          }
        } else if (payload.eventType === "DELETE") {
          tasks.forEach((task) => {
            if (task.id === payload.old.id) {
              dispatch(deleteTaskGlobal(task.global_id));
            }
            return;
          });
        } else if (payload.eventType === "UPDATE") {
          const updatedTasks = tasks.map((task) =>
            task.global_id == payload.new.global_id ? payload.new : task
          );
          dispatch(updateTaskGlobal(updatedTasks));
        }
      }
    )
    .subscribe();

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
        <button onClick={() => navigate("routine_tasks")}>Routine Tasks</button>
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
