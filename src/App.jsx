import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import HomePage from "./ui/HomePage";
import AppLayout from "./ui/AppLayout";
import Target from "./features/target/Target";
import Task from "./features/task/Task";
import DailyTask from "./features/dailyTask/DailyTask";
import ScheduleDay from "./features/scheduleDay/ScheduleDay";
import DaySchedule from "./features/daySchedule/DaySchedule";
import Journal from "./features/journal/Journal";
import Display from "./ui/Display";
import { useEffect } from "react";
import {
  addTarget,
  deleteTarget,
  getTargets,
  updateTarget,
} from "./services/apiTargets";
import { add, fetched, remove, update } from "./features/target/targetSlice";
import { useDispatch, useSelector } from "react-redux";
import { clearTaskQueue, getTaskQueue } from "./utility/reconnectionUpdates";
import TaskList from "./features/task/TaskList";
import AddTaskForm from "./features/task/AddTaskForm";
import {
  addTaskRemote,
  getTaskRemote,
  updateTaskRemote,
  deleteTaskRemote,
} from "./services/apiTasks";
import {
  addTaskGlobal,
  deleteTaskGlobal,
  fetchedTaskGlobal,
  updateTaskGlobal,
} from "./features/task/taskSlice";
import supabase from "./services/supabase";

function App() {
  const dispatch = useDispatch();
  const { targets } = useSelector((store) => store.targets);
  const { tasks } = useSelector((store) => store.tasks);
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
        // console.log("target update received", payload);
        // console.log(payload);
        if (payload.eventType === "INSERT") {
          const exists = targets.some(
            (target) => target.global_id === payload.new.global_id
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
          const updatedTargets = targets.map((target) =>
            target.global_id == payload.new.global_id ? payload.new : target
          );
          dispatch(update(updatedTargets));
        }
      }
    )
    .subscribe();

  const tasksTableUpdates = supabase
    .channel("custom-all-channel2")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tasks" },
      (payload) => {
        // console.log("task update received");
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

  const availableTasks = [
    updateTarget,
    addTarget,
    deleteTarget,
    updateTaskRemote,
    addTaskRemote,
    deleteTaskRemote,
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
            task.values[1]
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

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/app",
      element: <AppLayout />,
      children: [
        {
          path: "",
          element: <Display />,
        },
        {
          path: "target",
          element: <Target />,
        },
        {
          path: "task",
          element: <Task />,
          children: [
            {
              path: ":taskType",
              element: <TaskList />,
            },
            {
              path: "addTask",
              element: <AddTaskForm />,
            },
          ],
        },
        {
          path: "dailyTask",
          element: <DailyTask />,
        },
        {
          path: "scheduleDay",
          element: <ScheduleDay />,
        },
        {
          path: "daySchedule",
          element: <DaySchedule />,
        },
        {
          path: "journal",
          element: <Journal />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}
export default App;
