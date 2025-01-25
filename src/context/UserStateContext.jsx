import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

function UserStateProvider({ children }) {
  const [userData, setUserData] = useState({});
  const value = {
    setUserData,
    userData,
  };
  useEffect(() => {
    window.userData = userData; // Make userData accessible globally
  }, [userData]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUserState() {
  const userState = useContext(UserContext);
  if (userState === undefined)
    throw new Error("Context used beyond its scopes");
  return userState;
}

export { UserStateProvider, useUserState };
