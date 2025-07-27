import {
  Calendar,
  CalendarCheck,
  ChevronDown,
  Home,
  Inbox,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible";
import { Link } from "react-router";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "../common/ModeToggle";
import ProjectList from "@/features/project-list/components/ProjectList";
import { useAppStore } from "@/store/useAppStore";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Popover } from "@radix-ui/react-popover";
import { useState } from "react";

export const CustomSidebarGroupLabel = () => (
  <>
    <Home />
    Help
    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
  </>
);

// Menu items.
const headerItems = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  // {
  //   title: "Visualize",
  //   url: "/visualize",
  //   icon: View,
  // },
  // {
  //   title: "Plan Your Day",
  //   url: "/scheduleDay",
  //   icon: NotebookPen,
  // },
  // {
  //   title: "Today's Schedule",
  //   url: "/today",
  //   icon: NotebookText,
  // },
  // {
  //   title: "Journal",
  //   url: "/journal",
  //   icon: Notebook,
  // },
  // {
  //   title: "Calendar",
  //   url: "/calendar",
  //   icon: CalendarCheck,
  // },
];

export function AppSidebar() {
  const { addBlock, tasks } = useAppStore();
  const todayTasks = tasks.filter((task) => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    const today = new Date();
    return (
      dueDate.getFullYear() === today.getFullYear() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getDate() === today.getDate()
    );
  });
  function handleAddNewGoal() {
    addBlock("user", "goals", { title: "" });
  }
  function handleAddNewTarget(parentGoalId) {
    addBlock("user", "targets", { title: "", goal_id: parentGoalId });
  }
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          {headerItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuBadge>{todayTasks.length}</SidebarMenuBadge>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <ProjectList />
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between">
          <NewListDropdown
            trigger={
              <Button variant="ghost">
                <PlusIcon /> New List
              </Button>
            }
            onAddNewGoal={handleAddNewGoal}
            onAddNewTarget={handleAddNewTarget}
          />
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button variant="ghost">
                  <Settings2 />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <ModeToggle />
              </DialogContent>
            </form>
          </Dialog>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function NewListDropdown({ trigger, onAddNewGoal, onAddNewTarget }) {
  const goals = useAppStore().goals;
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem onClick={onAddNewGoal}>Add New Goal</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="w-full text-start">
              Add New Target
            </DialogTrigger>
            <DialogContent className="md:w-80 w-70">
              <div>Select Goal for Target</div>
              {goals.map((goal) => (
                <Button
                  onClick={() => {
                    onAddNewTarget(goal.id);
                    setOpen(false); // Close the dialog
                  }}
                >
                  {goal.title}
                </Button>
              ))}
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
