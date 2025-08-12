import BreadcrumbWithDropdown from "@/features/project-view/components/Navigation";
import TitleSection from "@features/project-view/components/TitleSection";
import SectionOptions from "@/features/project-view/components/SectionOptions";
import TaskList from "@/features/project-view/components/TaskList";
import NodeList from "@/features/project-view/components/NodeList";
import { useCurrentBlockStore } from "../store/useCurrentBlock";
import TargetList from "../components/TargetList";
import { Button } from "@/components/ui/button";
import { Delete, Plus, Trash } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useProjectViewStore } from "../store/useProjectViewStore";
import { useParams } from "react-router";

function ProjectViewPage() {
  const params = useParams();
  const { currentBlock, currentBlockType, selectedTaskId, setSelectedTaskId } =
    useCurrentBlockStore();
  const { addBlock, setLastAddedTaskId, removeBlock } = useAppStore();
  function addNewTask() {
    if (currentBlockType === "targets") {
      addBlock("user", "tasks", {
        title: "",
        target_id: currentBlock.id,
        node_id: null,
      });
    } else if (currentBlockType === "nodes") {
      addBlock("user", "tasks", {
        title: "",
        node_id: currentBlock.id,
        target_id: params.targetId,
      });
    }
  }
  function addNewNode() {
    setLastAddedTaskId(null);
    if (currentBlockType === "targets") {
      addBlock("user", "nodes", {
        title: "",
        target_id: currentBlock.id,
        parent_node_id: null,
      });
    } else if (currentBlockType === "nodes") {
      addBlock("user", "nodes", {
        title: "",
        parent_node_id: currentBlock.id,
        target_id: params.targetId,
      });
    }
  }
  function deleteTask(id) {
    removeBlock("user", "tasks", id);
    setSelectedTaskId(null);
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
      <div className="mt-auto pb-4">
        {currentBlockType !== "goals" &&
          (selectedTaskId ? (
            <Button
              variant="outline"
              onClickCapture={(e) => {
                e.stopPropagation();
                deleteTask(selectedTaskId);
              }}
            >
              Delete Selected Task <Trash />
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button variant="outline" onClick={addNewTask}>
                Add Task <Plus />
              </Button>
              <Button variant="outline" onClick={addNewNode}>
                Add Node <Plus />
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ProjectViewPage;
