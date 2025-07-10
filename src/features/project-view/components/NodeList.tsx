import Circle from "@/components/common/Circle";
import { ChevronRight, Flag } from "lucide-react";

function NodeListItem() {
  return (
    <div className="flex items-center gap-1 px-2 py-2 border-b border-muted-foreground/10 hover:bg-muted/40 cursor-pointer">
      {/* Circle Icon */}
      <Circle className="w-4 h-4" />

      {/* Node Title */}
      <span className="text-accent-foreground font-medium text-sm ml-2">
        This is a node
      </span>

      {/* Chevron */}
      <ChevronRight className="w-4 h-4 text-accent-foreground" />

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
