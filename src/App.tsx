import { BrowserRouter, Routes, Route, useNavigate } from "react-router";
import HomeScreen from "@/pages/HomeScreen";
import { ThemeProvider } from "./components/ThemeProvider";
import AuthLayout from "./pages/layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MainLayout from "./pages/layouts/MainLayout";
import TargetScreen from "./pages/TargetScreen";
import TodayScreen from "./pages/TodayScreen";
import ScheduleDayScreen from "./pages/ScheduleDayScreen";
import JournalScreen from "./pages/JournalScreen";
import CalendarScreen from "./pages/CalendarScreen";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<HomeScreen />} />
              <Route path="targets/:targetId" element={<TargetScreen />} />
              <Route
                path="targets/:targetId/nodes/:nodeId"
                element={<TargetScreen />}
              />
              <Route path="home" element={<HomeScreen />} />
              <Route path="today" element={<TodayScreen />} />
              <Route path="scheduleDay" element={<ScheduleDayScreen />} />
              <Route path="journal" element={<JournalScreen />} />
              <Route path="calendar" element={<CalendarScreen />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
