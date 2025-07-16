import BreadcrumbWithDropdown from "@/features/project-view/components/Navigation";
import TitleSection from "@features/project-view/components/TitleSection";
import SectionOptions from "@/features/project-view/components/SectionOptions";
import TaskList from "@/features/project-view/components/TaskList";
import NodeList from "@/features/project-view/components/NodeList";
import { useCurrentBlockStore } from "../store/useCurrentBlock";
import TargetList from "../components/TargetList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useProjectViewStore } from "../store/useProjectViewStore";
import { useParams } from "react-router";

function ProjectViewPage() {
  const params = useParams();
  console.log(params);
  const { currentBlock, currentBlockType } = useCurrentBlockStore();
  const { addBlock } = useAppStore();
  function addNewTask() {
    if (currentBlockType === "targets") {
      addBlock("tasks", {
        title: "",
        target_id: currentBlock.id,
        node_id: null,
      });
    } else if (currentBlockType === "nodes") {
      addBlock("tasks", {
        title: "",
        node_id: currentBlock.id,
        target_id: params.targetId,
      });
    }
  }
  return (
    <div className="flex flex-col justify-start items-center w-full h-full p-6">
      <div className="flex flex-col gap-6 w-1/2">
        <BreadcrumbWithDropdown />
        <TitleSection />
        {/* <SectionOptions /> */}
        <div className="flex flex-col gap-2">
          {currentBlockType !== "goals" && <TaskList />}
          {currentBlockType !== "goals" && <NodeList />}
          {currentBlockType === "goals" && <TargetList />}
        </div>
      </div>
      {currentBlockType !== "goals" && (
        <div className="mt-auto pb-4">
          <Button variant="outline" onClick={addNewTask}>
            Add Task <Plus />
          </Button>
          <Button variant="outline">
            Add Node <Plus />
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProjectViewPage;
