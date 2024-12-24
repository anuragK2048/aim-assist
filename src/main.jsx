import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AppStateProvider } from "./context/AppStateContext.jsx";
import store from "./services/store.js";
import { Provider } from "react-redux";
import Task from "./features/task/Task.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </Provider>
  </StrictMode>
);
