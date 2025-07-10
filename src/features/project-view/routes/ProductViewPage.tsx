import BreadcrumbWithDropdown from "@/features/project-view/components/Navigation";
import TitleSection from "@features/project-view/components/TitleSection";
import SectionOptions from "@/features/project-view/components/SectionOptions";
import TaskList from "@/features/project-view/components/TaskList";
import NodeList from "@/features/project-view/components/NodeList";
import { useParams } from "react-router";

function ProjectViewPage() {
  // const params = useParams();
  // return <TestGoal />;
  return (
    <div className="flex justify-center items-start w-full h-full p-6">
      <div className="flex flex-col gap-6 w-1/2">
        <BreadcrumbWithDropdown />
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
