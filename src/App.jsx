import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import HomePage from "./ui/HomePage";
import AppLayout from "./ui/AppLayout";
import Target from "./features/target/Target";
import Task from "./features/task/Task";
import ScheduleDay from "./features/scheduleDay/ScheduleDay";
import DaySchedule from "./features/daySchedule/DaySchedule";
import Journal from "./features/journal/Journal";
import Display from "./ui/Display";
import TaskList from "./features/task/TaskList";
import AddTaskForm from "./features/task/AddTaskForm";
import Error from "./ui/Error";
import ProtectedRoute from "./ui/ProtectedRoute";
import Test_UI from "./components/ui/Test_UI";

function App() {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        errorElement: <Error />,
        element: <HomePage />,
      },
      {
        path: "/app",
        element: (
          <ProtectedRoute>
            <AppLayout />
            {/* <Test_UI /> */}
          </ProtectedRoute>
        ),
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
    ],
    {
      basename: "/",
    },
  );

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}
export default App;
