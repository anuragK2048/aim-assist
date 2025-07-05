import UpperNav from "@/components/UpperNav";
import AppLayout from "./AppLayout";
import TitleSection from "@/components/TitleSection";
import SectionOptions from "@/components/SectionOptions";
import TaskList from "@/components/TaskList";
import NodeList from "@/components/NodeList";

function AppScreen() {
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
