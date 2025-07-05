import { ChevronRight, Flag } from "lucide-react";
import Circle from "./Circle";

function NodeListItem() {
  return (
    <div className="flex items-center gap-2 px-2 py-2 border-b border-muted-foreground/10 hover:bg-muted">
      {/* Circle Icon */}
      <Circle />

      {/* Node Title */}
      <span className="text-blue-400 font-medium text-sm">This is a node</span>

      {/* Chevron */}
      <ChevronRight className="w-4 h-4 text-blue-400" />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Flag and days left */}
      <Flag className="w-4 h-4 text-muted-foreground mr-1" />
      <span className="text-xs text-muted-foreground">9 days left</span>
    </div>
  );
}

function NodeList() {
  return (
    <div>
      <NodeListItem />
      <NodeListItem />
      <NodeListItem />
      <NodeListItem />
      <NodeListItem />
      <NodeListItem />
    </div>
  );
}

export default NodeList;
