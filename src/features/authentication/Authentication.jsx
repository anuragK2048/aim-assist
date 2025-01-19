import { useState } from "react";
import ConditionallyRender from "../../utility/ConditionallyRender";
import Login from "./Login";
import Signup from "./Signup";

function Authentication() {
  const [displayLogin, setDisplayLogin] = useState(true);
  return (
    <div className="flex main relative">
      <ConditionallyRender show={displayLogin}>
        <Login />
        <Signup />
      </ConditionallyRender>
      <ConditionallyRender show={displayLogin}>
        <div
          className="absolute right-0 bottom-0 cursor-pointer"
          style={{ borderBottom: "2px solid blue" }}
          onClick={() => setDisplayLogin(false)}
        >
          Sign Up
        </div>
        <div
          onClick={() => setDisplayLogin(true)}
          className="absolute right-0 bottom-0 cursor-pointer"
          style={{ borderBottom: "2px solid blue" }}
        >
          Login
        </div>
      </ConditionallyRender>
    </div>
  );
}

export default Authentication;
