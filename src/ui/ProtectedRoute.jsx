import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/apiAuth";

function ProtectedRoute({ children }) {
  const [authorize, setAuthorize] = useState(true);
  useEffect(function () {
    async function checkAuth() {
      const curSession = await getCurrentUser();
      console.log(curSession);
      if (curSession) {
        setAuthorize(true);
      }
    }
    // checkAuth();
  }, []);
  return <div>{authorize ? children : "Not authorized"}</div>;
}

export default ProtectedRoute;
