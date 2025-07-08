import { AppSidebar } from "@/components/app-sidebar";
import TestGoal from "@/components/testGoal";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAppStore } from "@/store/useAppStore";
import { shallow } from "zustand/shallow";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const undo = useAppStore((s) => s.undo);
  const redo = useAppStore((s) => s.redo);
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        {/* <SidebarTrigger /> */}
        {/* <button onClick={undo}>undo</button>
        <button onClick={redo}>redo</button>
        <TestGoal /> */}
        {children}
      </main>
    </SidebarProvider>
  );
}
