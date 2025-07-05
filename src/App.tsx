import { BrowserRouter, Routes, Route, useNavigate } from "react-router";
import Home from "@/pages/Home";
import { ThemeProvider } from "./components/ThemeProvider";
import AuthLayout from "./pages/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Landing from "./pages/Landing";
import AppLayout from "./pages/AppLayout";
import AppScreen from "./pages/AppScreen";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route index element={<Landing />} />
            <Route path="home" element={<AppScreen />} />

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
