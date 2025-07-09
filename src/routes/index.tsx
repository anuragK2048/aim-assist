import AuthLayout from "@/components/layouts/AuthLayout";
import MainLayout from "@/components/layouts/MainLayout";
import CalendarPage from "@/features/calendar-view/routes/CalendarPage";
import HomeScreen from "@/features/home/routes/HomeScreen";
import JournalScreen from "@/features/journal/routes/JournalScreen";
import ScheduleDayScreen from "@/features/plan-your-day/routes/ScheduleDayScreen";
import ProductViewPage from "@/features/project-view/routes/ProductViewPage";
import VisualiseScreen from "@/features/visualizer/routes/VisualiseScreen";
import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "@/features/auth/routes/LoginPage";
import RegisterPage from "@/features/auth/routes/RegisterPage";
import TodayPage from "@/features/today's schedule/routes/TodayPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomeScreen />} />
          <Route path="goals/:goalId" element={<ProductViewPage />} />
          <Route path="targets/:targetId" element={<ProductViewPage />} />
          <Route
            path="targets/:targetId/nodes/:nodeId"
            element={<ProductViewPage />}
          />
          <Route path="home" element={<HomeScreen />} />
          <Route path="visualize" element={<VisualiseScreen />} />
          <Route path="scheduleDay" element={<ScheduleDayScreen />} />
          <Route path="today" element={<TodayPage />} />
          <Route path="journal" element={<JournalScreen />} />
          <Route path="calendar" element={<CalendarPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
