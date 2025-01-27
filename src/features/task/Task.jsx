import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import AddTaskForm from "./AddTaskForm";
import { addTaskGlobal, deleteTaskGlobal, updateTaskGlobal } from "./taskSlice";
import supabase from "../../services/supabase";
import Blur from "../../utility/Blur";

function Task() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { targets } = useSelector((store) => store.targets);
  const [showAddTask, setShowAddTask] = useState(false);
  // console.log("targets change received", targets);
  useEffect(() => {
    // console.log("Targets changed: ", targets);
  }, [targets]);
  const { tasks } = useSelector((store) => store.tasks);
  // const tasksTableUpdates = supabase
  //   .channel("custom-all-channel")
  //   .on(
  //     "postgres_changes",
  //     { event: "*", schema: "public", table: "tasks" },
  //     (payload) => {
  //       console.log("task update received");
  //       // console.log(payload);
  //       if (payload.eventType === "INSERT") {
  //         const exists = tasks.some(
  //           (tasks) => tasks.global_id === payload.new.global_id
  //         );
  //         if (!exists) {
  //           dispatch(addTaskGlobal(payload.new));
  //         }
  //       } else if (payload.eventType === "DELETE") {
  //         tasks.forEach((task) => {
  //           if (task.id === payload.old.id) {
  //             dispatch(deleteTaskGlobal(task.global_id));
  //           }
  //           return;
  //         });
  //       } else if (payload.eventType === "UPDATE") {
  //         const updatedTasks = tasks.map((task) =>
  //           task.global_id == payload.new.global_id ? payload.new : task
  //         );
  //         dispatch(updateTaskGlobal(updatedTasks));
  //       }
  //     }
  //   )
  //   .subscribe();

  //reusable tailwind for button
  const TabButton = ({ title, bgColor = "#e68568", ...otherProps }) => (
    <button
      style={{ backgroundColor: bgColor }}
      {...otherProps}
      className={`m-1 cursor-pointer rounded-xl p-1 text-base text-[#364172]`}
    >
      {title}
    </button>
  );

  return (
    <>
      <div className="m-5 flex w-full flex-col gap-5">
        <div className="flex flex-wrap">
          <TabButton onClick={() => navigate("all_tasks")} title="All Tasks" />
          {targets.map((target, index) => {
            return (
              <TabButton
                onClick={() => navigate(`${target.name}`)}
                key={target.global_id}
                bgColor="#e1dad3"
                title={target.name}
              />
            );
          })}
          <TabButton
            onClick={() => navigate("routine_tasks")}
            title="Routine Tasks"
          />
          <TabButton
            onClick={() => navigate("scheduled_tasks")}
            title="Scheduled Tasks"
          />
          <TabButton
            onClick={() => setShowAddTask(true)}
            // onClick={() => navigate("addTask")}
            bgColor="#f9f7f5"
            title="+ Add Tasks"
          />
        </div>
        <div className="">
          <Outlet />
        </div>
      </div>
      {showAddTask && (
        <>
          <Blur />
          <div className="absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center self-center text-center">
            <AddTaskForm setShowPopup={setShowAddTask} />
          </div>
        </>
      )}
    </>
  );
}

export default Task;
