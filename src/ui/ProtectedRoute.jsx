import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/apiAuth";

function ProtectedRoute({ children }) {
  const [authorize, setAuthorize] = useState(false);
  useEffect(function () {
    async function checkAuth() {
      const curSession = await getCurrentUser();
      if (curSession) {
        setAuthorize(true);
      }
    }
    checkAuth();
  }, []);
  return <div>{authorize ? children : "Not authorized"}</div>;
}

export default ProtectedRoute;
