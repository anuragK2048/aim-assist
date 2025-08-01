import { ThemeProvider } from "@/providers/ThemeProvider";
import AppRoutes from "./routes";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppRoutes />
      </ThemeProvider>
    </>
  );
}

export default App;
