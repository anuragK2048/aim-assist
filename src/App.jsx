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

function App() {
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
