import UpperNav from "@/features/project-view/components/UpperNav";
import TitleSection from "@features/project-view/components/TitleSection";
import SectionOptions from "@/features/project-view/components/SectionOptions";
import TaskList from "@/features/project-view/components/TaskList";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { initRealtime } from "@/lib/sync";
import { useAppStore } from "@/store/useAppStore";
import { fetchUserData } from "@/lib/fetchUserData";
import TestGoal from "@/test/testGoal";
import NodeList from "@/features/project-view/components/NodeList";

function ProjectViewPage() {
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

export default ProjectViewPage;
