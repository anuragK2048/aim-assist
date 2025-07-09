import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
