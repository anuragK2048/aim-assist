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
import MirrorInput from "@/components/common/MirrorInput";

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
  const tasks = useAppStore((store) => store.tasks);
  const updateBlock = useAppStore((store) => store.updateBlock);
  const [isOpen, setIsOpen] = useState(true);
  const [editableTargetId, setEditableTargetId] = useState(null);
  function onTargetTitleChange(id, changedTitle: string) {
    setEditableTargetId(null);
    updateBlock("user", "targets", {
      id: id,
      title: changedTitle,
    });
  }
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

                  <span
                    className={`${
                      goal.title ? "" : "text-muted-foreground"
                    } font-semibold`}
                  >
                    {goal.title || "New Goal"}
                  </span>
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
              {targets.map((item) => {
                const totalFilteredTasks = tasks?.filter(
                  (task) => task.target_id === item.id
                ).length;
                return (
                  <SidebarMenuItem
                    key={item.id}
                    onDoubleClick={() => {
                      setEditableTargetId(item.id);
                    }}
                  >
                    <SidebarMenuButton asChild>
                      <Link to={`/goals/${goal.id}/targets/${item.id}`}>
                        <Circle className="h-3.5 w-3.5" />
                        <div className="max-w-5">
                          <MirrorInput
                            className={`${
                              item.title ? "" : "text-muted-foreground"
                            } font-semibold`}
                            isDisabled={editableTargetId !== item.id}
                            text={item.title}
                            placeholder={"New Target"}
                            onSave={(title) =>
                              onTargetTitleChange(item.id, title)
                            }
                          />
                        </div>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{totalFilteredTasks}</SidebarMenuBadge>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
