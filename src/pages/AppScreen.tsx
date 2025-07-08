import UpperNav from "@/components/UpperNav";
import AppLayout from "./AppLayout";
import TitleSection from "@/components/TitleSection";
import SectionOptions from "@/components/SectionOptions";
import TaskList from "@/components/TaskList";
import NodeList from "@/components/NodeList";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { initRealtime } from "@/lib/sync";
import { useAppStore } from "@/store/useAppStore";
import { fetchUserData } from "@/lib/fetchuserData";
import { shallow } from "zustand/shallow";

function AppScreen() {
  const goals = useAppStore((s) => s.goals);
  const tasks = useAppStore((s) => s.tasks);
  console.log(tasks);
  useEffect(() => {
    const setup = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) {
        await fetchUserData(data.user.id);
        initRealtime(data.user.id);
      }
    };
    setup();
  }, []);
  return (
    <AppLayout>
      <div className="flex justify-center items-start w-full h-full p-6">
        <div className="flex flex-col gap-6 w-1/2">
          <UpperNav />
          <TitleSection />
          <SectionOptions />
          <div className="flex flex-col gap-2">
            <TaskList />
            <NodeList />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default AppScreen;
