import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Calendar,
  CalendarCheck,
  ChevronDown,
  Home,
  Inbox,
  Layers,
  Layers2,
  Notebook,
  NotebookPen,
  NotebookText,
  Plus,
  PlusIcon,
  Search,
  Settings,
  Settings2,
  View,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import Circle from "@/components/common/Circle";
import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";

function ProjectList() {
  const goals = useAppStore((s) => s.goals);
  const targets = useAppStore((s) => s.targets);

  // Efficiently group targets by goal_id
  const targetsByGoal = useMemo(() => {
    const map = new Map<string, typeof targets>();
    for (const target of targets) {
      if (!map.has(target.goal_id)) map.set(target.goal_id, []);
      map.get(target.goal_id)!.push(target);
    }
    return map;
  }, [targets]);

  return (
    <div>
      {goals.map((goal) => (
        <ProjectListItem
          goal={goal}
          targets={targetsByGoal.get(goal.id) || []}
          key={goal.id}
        />
      ))}
    </div>
  );
}

export default ProjectList;

function ProjectListItem({ goal, targets }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Collapsible
      key={goal.id}
      className="group/collapsible"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <Link
              to={`/goals/${goal.id}`}
              onClick={() => console.log("link clicked")}
            > */}
            <SidebarMenuButton asChild className="gap-0 p-0">
              <div className="flex items-center">
                <Link
                  to={`/goals/${goal.id}`}
                  onClick={() => console.log("link clicked")}
                  className="flex items-center flex-1 gap-2 p-2"
                >
                  {isOpen ? <Layers2 size={16} /> : <Layers size={16} />}

                  <span className="font-semibold">{goal.title}</span>
                </Link>
                <CollapsibleTrigger className="ml-auto cursor-pointer" asChild>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="hover:bg-sidebar-border rounded-full p-0.5"
                  >
                    <ChevronDown
                      size={20}
                      className="ml-auto transition-transform group-data-[state=closed]/collapsible:-rotate-90"
                    />
                  </div>
                </CollapsibleTrigger>
              </div>
            </SidebarMenuButton>
            {/* </Link> */}
          </SidebarMenuItem>
        </SidebarMenu>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {targets.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <Link to={`/goals/${goal.id}/targets/${item.id}`}>
                      <Circle className="h-3.5 w-3.5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>12/02/26</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
