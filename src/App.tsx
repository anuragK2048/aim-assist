import { BrowserRouter, Routes, Route, useNavigate } from "react-router";
import HomeScreen from "@/pages/screens/HomeScreen";
import { ThemeProvider } from "./components/ThemeProvider";
import AuthLayout from "./pages/layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MainLayout from "./pages/layouts/MainLayout";
import TargetScreen from "./pages/screens/TargetScreen";
import TodayScreen from "./pages/screens/TodayScreen";
import ScheduleDayScreen from "./pages/screens/ScheduleDayScreen";
import JournalScreen from "./pages/screens/JournalScreen";
import CalendarScreen from "./pages/screens/CalendarScreen";
import VisualiseScreen from "./pages/screens/VisualiseScreen";

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
              <Route path="visualize" element={<VisualiseScreen />} />
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
