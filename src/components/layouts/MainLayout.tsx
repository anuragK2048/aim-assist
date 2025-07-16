import { AppSidebar } from "@/components/layouts/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAppStore } from "@/store/useAppStore";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { fetchUserData } from "@/lib/fetchUserData";
import { initRealtime } from "@/lib/sync";
import { useUndoRedoHotkeys } from "@/hooks/useUndoRedoHotKeys";

export default function MainLayout() {
  const [loading, setLoading] = useState(true);
  const { setAuthUser } = useAppStore();

  useUndoRedoHotkeys();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Already signed in
        const { data } = await supabase.auth.getUser();
        if (data?.user?.id) {
          await fetchUserData(data.user.id);
          setAuthUser({ id: data.user.id });
          // initRealtime(data.user.id);
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
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
