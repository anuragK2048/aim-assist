import { AppSidebar } from "@/components/app-sidebar";
import TestGoal from "@/components/testGoal";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAppStore } from "@/store/useAppStore";
import { shallow } from "zustand/shallow";
import TargetScreen from "../screens/TargetScreen";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { fetchUserData } from "@/lib/fetchUserData";
import { initRealtime } from "@/lib/sync";

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
        const { data } = await supabase.auth.getUser();
        if (data?.user?.id) {
          await fetchUserData(data.user.id);
          initRealtime(data.user.id);
        }
      } else {
        const id = "1cb1c31b-7e8e-448c-b766-662ac7dfdb16";
        await fetchUserData(id);
        initRealtime(id);
        // navigate("/register");
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
