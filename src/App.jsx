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
import { fetched } from "./features/target/targetSlice";
import { useDispatch, useSelector } from "react-redux";
import { clearTaskQueue, getTaskQueue } from "./utility/reconnectionUpdates";

function App() {
  const { targets } = useSelector((store) => store.targets);

  const dispatch = useDispatch();
  useEffect(function () {
    async function foo() {
      const targetsData = await getTargets();
      dispatch(fetched(targetsData));
    }
    foo();
  }, []);

  const availableTasks = [updateTarget, addTarget, deleteTarget];

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
          // action: addTargetAction,
        },
        {
          path: "task",
          element: <Task />,
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
