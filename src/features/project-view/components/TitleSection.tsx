import Circle from "@/components/common/Circle";
import { Ellipsis } from "lucide-react";
import { useCurrentBlockStore } from "../store/useCurrentBlock";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

function TitleSection() {
  const updateBlock = useAppStore.getState().updateBlock;
  const { currentBlock, currentBlockType } = useCurrentBlockStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const descMirrorRef = useRef<HTMLSpanElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (descMirrorRef.current && descInputRef.current) {
      descInputRef.current.style.width = `${descMirrorRef.current.offsetWidth}px`;
    }
  }, [description]);

  useEffect(() => {
    if (mirrorRef.current && inputRef.current) {
      inputRef.current.style.width = `${mirrorRef.current.offsetWidth}px`;
    }
  }, [title]);

  useEffect(() => {
    console.log(currentBlock);
    setTitle(currentBlock?.title || "");
    setDescription(currentBlock?.description || "");
  }, [currentBlock]);

  function saveChanges() {
    updateBlock(currentBlockType, { id: currentBlock.id, title, description });
  }

  // if (currentBlockType === "goals") return <div>Goals</div>;

  return (
    <div className="flex flex-col gap-2">
      {/* title */}
      <div className="flex gap-3 items-center">
        {currentBlockType === "goals" ? null : <Circle />}

        {/* Mirror span */}
        <span
          ref={mirrorRef}
          className="invisible whitespace-pre pointer-events-none absolute bg-amber-200 text-2xl"
          aria-hidden
        >
          {title || "New Target"}
        </span>

        {/* Auto-width input */}
        <input
          placeholder="New Target"
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-none outline-none text-2xl"
          onBlur={saveChanges}
        />

        <div>
          <Ellipsis className="text-primary" />
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
      {/* </div> */}
    </div>
  );
}

export default TitleSection;
