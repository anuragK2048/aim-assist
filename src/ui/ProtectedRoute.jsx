import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/apiAuth";

function ProtectedRoute({ children }) {
  const [authorize, setAuthorize] = useState(false);
  useEffect(function () {
    async function checkAuth() {
      const curSession = await getCurrentUser();
      console.log(curSession);
      if (curSession) {
        setAuthorize(true);
      }
    }
    checkAuth();
  }, []);
  return (
    <div className="h-full w-full">
      {authorize ? children : "Not authorized"}
    </div>
  );
}

export default ProtectedRoute;
