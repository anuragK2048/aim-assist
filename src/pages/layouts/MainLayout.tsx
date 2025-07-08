import { AppSidebar } from "@/components/app-sidebar";
import TestGoal from "@/components/testGoal";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAppStore } from "@/store/useAppStore";
import { shallow } from "zustand/shallow";
import TargetScreen from "../TargetScreen";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

export default function MainLayout() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const undo = useAppStore((s) => s.undo);
  const redo = useAppStore((s) => s.redo);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Already signed in
      } else {
        navigate("/register");
      }
      setLoading(false);
    };

    checkSession();
  }, []);
  if (loading) return <div className="text-red-600">Loading...</div>;
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        {/* <SidebarTrigger /> */}
        {/* <button onClick={undo}>undo</button>
        <button onClick={redo}>redo</button>
        <TestGoal /> */}
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
