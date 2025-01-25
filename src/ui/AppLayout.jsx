import { Outlet } from "react-router";
import style from "./AppLayout.module.css";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import {
  addTarget,
  deleteTarget,
  getTargets,
  updateTarget,
} from "../services/apiTargets";
import { add, fetched, remove, update } from "../features/target/targetSlice";
import { useDispatch, useSelector } from "react-redux";
import { clearTaskQueue, getTaskQueue } from "../utility/reconnectionUpdates";
import {
  addTaskRemote,
  getTaskRemote,
  updateTaskRemote,
  deleteTaskRemote,
} from "../services/apiTasks";
import {
  addTaskGlobal,
  deleteTaskGlobal,
  fetchedTaskGlobal,
  updateTaskGlobal,
} from "../features/task/taskSlice";
import supabase from "../services/supabase";
import {
  addRemoteSchedule,
  getRemoteSchedule,
  updateRemoteSchedule,
} from "../services/apiDaySchedule";
import {
  addScheduleDetails,
  fetchedScheduleDetails,
  updateScheduleDetails,
} from "../features/scheduleDay/scheduleDaySlice";

function AppLayout() {
  const dispatch = useDispatch();
  const { targets } = useSelector((store) => store.targets);
  const { tasks } = useSelector((store) => store.tasks);
  const { scheduleDetails } = useSelector((store) => store.scheduleDay);
  useEffect(function () {
    async function foo() {
      const targetsData = await getTargets();
      dispatch(fetched(targetsData));
    }
    foo();
  }, []);
  useEffect(function () {
    async function foo() {
      const tasksData = await getTaskRemote();
      dispatch(fetchedTaskGlobal(tasksData));
    }
    foo();
  }, []);
  useEffect(function () {
    async function foo() {
      const todaySchedule = await getRemoteSchedule();
      dispatch(fetchedScheduleDetails([{ ...todaySchedule }]));
    }
    foo();
  }, []);
  // useEffect(() => {
  //   dispatch({ type: "SUPABASE_INIT" });
  //   return () => {
  //     dispatch({ type: "SUPABASE_CLEANUP" });
  //   };
  // }, [dispatch]);

  const targetsTableUpdates = supabase
    .channel("custom-all-channel1")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "targets" },
      (payload) => {
        console.log("target update received", payload);
        // console.log(payload);
        if (payload.eventType === "INSERT") {
          const exists = targets.some(
            (target) => target.global_id === payload.new.global_id,
          );
          if (!exists) {
            dispatch(add(payload.new));
          }
        } else if (payload.eventType === "DELETE") {
          targets.forEach((target) => {
            if (target.global_id === payload.old.global_id) {
              dispatch(remove(target.global_id));
            }
            return;
          });
        } else if (payload.eventType === "UPDATE") {
          // const updatedTargets = targets.map((target) =>
          //   target.global_id == payload.new.global_id ? payload.new : target
          // );
          dispatch(update(payload.new.global_id, payload.new));
        }
      },
    )
    .subscribe();

  const tasksTableUpdates = supabase
    .channel("custom-all-channel2")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tasks" },
      (payload) => {
        console.log("task update received");
        // console.log(payload);
        if (payload.eventType === "INSERT") {
          const exists = tasks.some(
            (tasks) => tasks.global_id === payload.new.global_id,
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
          dispatch(updateTaskGlobal(payload.new.global_id, payload.new));
        }
      },
    )
    .subscribe();

  const dayScheduleTableUpdates = supabase
    .channel("custom-all-channel3")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "day_schedule" },
      (payload) => {
        console.log("schedule update received");
        // console.log(payload);
        if (payload.eventType === "INSERT") {
          const exists = scheduleDetails.some(
            (schedule) =>
              schedule.global_id_date === payload.new.global_id_date,
          );
          if (!exists) {
            dispatch(addScheduleDetails(payload.new));
          }
        } else if (payload.eventType === "UPDATE") {
          dispatch(updateScheduleDetails(payload.new));
        }
      },
    )
    .subscribe();

  const availableTasks = [
    updateTarget,
    addTarget,
    deleteTarget,
    updateTaskRemote,
    addTaskRemote,
    deleteTaskRemote,
    updateRemoteSchedule,
    addRemoteSchedule,
    null,
  ];

  useEffect(() => {
    async function handleOnline() {
      console.log("online, executing task queue");
      const taskQueue = getTaskQueue();
      console.log(taskQueue);
      for (const task of taskQueue) {
        try {
          await availableTasks[task.functionNumber](
            task.values[0],
            task.values[1],
          );
          console.log(`Task executed successfully:`, task);
        } catch (error) {
          console.error(`Task execution failed:`, task, error);
        }
      }
      //add sync global state to remote state if required
      const targetsData = await getTargets();
      dispatch(fetched(targetsData));

      const tasksData = await getTaskRemote();
      dispatch(fetchedTaskGlobal(tasksData));

      // Clear the queue after execution
      clearTaskQueue();
    }

    function handleOffline() {
      console.log("offline");
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      // Cleanup: Remove event listeners when the component unmounts
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return (
    <div className={style.container}>
      <div className={style.sidebar}>
        <Sidebar />
      </div>
      <div className="relative flex w-full bg-blite/90">
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
