import { createContext, useContext, useState } from "react";

const AppStateContext = createContext();

let contextValue = null;

function AppStateProvider({ children }) {
  const [targets, setTarget] = useState([
    {
      name: "test",
      description: "testing",
      time: "1sec",
      priority: true,
    },
  ]); // name, description, time, priority
  async function updateTargets(newTarget) {
    setTarget((cur) => [...cur, newTarget]);
    // console.log(newTarget);
  }
  async function revertTargets(Target) {
    setTarget(Target);
    // console.log(newTarget);
  }

  const value = {
    targets,
    updateTargets,
    revertTargets,
  };
  contextValue = value;

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

function useAppState() {
  const AppState = useContext(AppStateContext);
  if (AppState === undefined) throw new Error("Context used beyond its scopes");
  return AppState;
}

export { AppStateProvider, useAppState };

export const getAppStateContext = () => contextValue;
