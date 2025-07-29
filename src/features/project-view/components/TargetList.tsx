import { useAppStore } from "@/store/useAppStore";
import { useCurrentBlockStore } from "../store/useCurrentBlock";
import { useEffect, useState } from "react";
import { Target } from "@/types";
import { useNavigate } from "react-router";

function TargetListItem({ target, ...props }) {
  return (
    <div {...props} className="cursor-pointer">
      {target.title}
    </div>
  );
}

function TargetList() {
  const navigate = useNavigate();
  const { currentBlock, currentBlockType } = useCurrentBlockStore(); // current block type would always be "targets"
  const targets = useAppStore((s) => s.targets);
  const [targetList, setTargetList] = useState<Target[] | []>([]);
  useEffect(() => {
    // filter all tasks whose parent is target
    const filteredTargets = targets.filter(
      (target) => target.goal_id === currentBlock.id
    );
    setTargetList(filteredTargets);
  }, [currentBlock]);
  return (
    <div className="flex flex-col gap-1">
      {targetList.map((target) => (
        <TargetListItem
          key={target.id}
          target={target}
          onClick={() => navigate(`targets/${target.id}`)}
        />
      ))}
    </div>
  );
}

export default TargetList;
