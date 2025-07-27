import Circle from "@/components/common/Circle";
import { ChevronRight, Flag } from "lucide-react";
import { useCurrentBlockStore } from "../store/useCurrentBlock";
import { useAppStore } from "@/store/useAppStore";
import { Node } from "@/types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

function NodeListItem({ node, ...props }) {
  return (
    <div
      className="flex items-center gap-1 px-2 py-1.5 border-b border-muted-foreground/10 hover:bg-muted/40 cursor-pointer"
      {...props}
    >
      {/* Circle Icon */}
      <Circle className="w-4 h-4" />

      {/* Node Title */}
      <span
        className={`${
          node.title ? "text-accent-foreground" : "text-muted-foreground"
        }  font-medium text-sm ml-2`}
      >
        {node.title || "New Node"}
      </span>

      {/* Chevron */}
      <ChevronRight className="w-4 h-4 text-accent-foreground" />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Flag and days left */}
      <Flag className="w-4 h-4 text-muted-foreground mr-1" />
      <span className="text-xs text-muted-foreground">{node.deadline}</span>
    </div>
  );
}

function NodeList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentBlock, currentBlockType } = useCurrentBlockStore();
  const nodes = useAppStore((s) => s.nodes);
  const [nodeList, setNodeList] = useState<Node[] | []>([]);

  useEffect(() => {
    if (currentBlockType === "targets") {
      // filter all nodes whose parent is target
      const filteredNodes = nodes.filter(
        (node) =>
          node.target_id === currentBlock.id && node.parent_node_id === null
      );
      setNodeList(filteredNodes);
    } else if (currentBlockType === "nodes") {
      // filter all nodes whose parent is node
      const filteredNodes = nodes.filter(
        (node) => node.parent_node_id === currentBlock.id
      );
      setNodeList(filteredNodes);
    }
  }, [currentBlock, currentBlockType, nodes]);
  return (
    <div>
      {nodeList.map((node) => (
        <NodeListItem
          key={node.id}
          node={node}
          onClick={() => navigate(`${location.pathname}/nodes/${node.id}`)}
        />
      ))}
    </div>
  );
}

export default NodeList;
