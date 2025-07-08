import UpperNav from "@/components/UpperNav";
import TitleSection from "@/components/TitleSection";
import SectionOptions from "@/components/SectionOptions";
import TaskList from "@/components/TaskList";
import NodeList from "@/components/NodeList";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { initRealtime } from "@/lib/sync";
import { useAppStore } from "@/store/useAppStore";
import { fetchUserData } from "@/lib/fetchUserData";
import TestGoal from "@/components/testGoal";

function TargetScreen() {
  // return <TestGoal />;
  return (
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
  );
}

export default TargetScreen;
