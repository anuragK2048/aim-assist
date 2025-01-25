import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import store from "./services/store.js";
import { Provider } from "react-redux";
import { UserStateProvider } from "./context/UserStateContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <UserStateProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </UserStateProvider>,
  // </StrictMode>
);
