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
import TaskList from "./features/task/TaskList";
import AddTaskForm from "./features/task/AddTaskForm";
import {
  addTaskRemote,
  getTaskRemote,
  updateTaskRemote,
  deleteTaskRemote,
} from "./services/apiTasks";
import { fetchedTaskGlobal } from "./features/task/taskSlice";

function App() {
  const dispatch = useDispatch();
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
          // action: addTargetAction,
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
