import Circle from "@/components/common/Circle";
import { Ellipsis } from "lucide-react";
import { useCurrentBlockStore } from "../store/useCurrentBlock";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { DropdownMenuDemo } from "./Dropdown";
import { useLocation, useNavigate } from "react-router";
import MirrorInput from "@/components/common/MirrorInput";

function TitleSection() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { updateBlock, removeBlock, setLastAddedTaskId } = useAppStore();
  const { currentBlock, currentBlockType } = useCurrentBlockStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setTitle(currentBlock?.title || "");
    setDescription(currentBlock?.description || "");
  }, [currentBlock]);

  function saveChanges(changedTitle: string) {
    updateBlock("user", currentBlockType, {
      id: currentBlock.id,
      title: changedTitle,
      description,
    });
  }

  async function handleDelete() {
    setLastAddedTaskId(null);
    console.log(pathname.split("/"));
    const pathArr = pathname.split("/");
    if (currentBlockType === "targets" || currentBlockType === "goals") {
      console.log("hi");
      pathArr.pop();
      pathArr.pop();
    } else {
      pathArr.pop();
      if (pathArr.at(-1) === "nodes") pathArr.pop();
    }

    const finalPath = pathArr.join("/");
    console.log(finalPath);
    navigate(`${finalPath || "/"}`);
    setTimeout(() => {
      removeBlock("user", currentBlockType, currentBlock?.id);
    }, 500);
  }

  return (
    <div className="flex flex-col gap-2">
      {/* title */}
      <div className="flex gap-3 items-center">
        {currentBlockType === "goals" ? null : <Circle />}

        <MirrorInput
          classname={"text-2xl"}
          text={title}
          onSave={saveChanges}
          placeholder={
            currentBlockType === "targets"
              ? "New Target"
              : currentBlockType === "nodes"
              ? "New Node"
              : currentBlockType === "goals"
              ? "New Goal"
              : "New Item"
          }
        />

        <div>
          <DropdownMenuDemo onDeleteSelect={handleDelete}>
            <Ellipsis className="text-primary" />
          </DropdownMenuDemo>
        </div>
      </div>

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border-none outline-none resize-none text-foreground/85 text-sm"
        rows={2}
        onBlur={saveChanges}
      />
    </div>
  );
}

export default TitleSection;
