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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Separator } from "../ui/separator";

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
  {
    title: "Visualize",
    url: "/visualize",
    icon: View,
  },
  {
    title: "Plan Your Day",
    url: "/scheduleDay",
    icon: NotebookPen,
  },
  {
    title: "Today's Schedule",
    url: "/today",
    icon: NotebookText,
  },
  {
    title: "Journal",
    url: "/journal",
    icon: Notebook,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: CalendarCheck,
  },
];

export function AppSidebar() {
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
              <SidebarMenuBadge>24</SidebarMenuBadge>
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">
                <PlusIcon /> New List
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-1 w-min">
              <div className="flex flex-col gap-1">
                <Button variant="ghost">Add New Goal</Button>
                <Separator />
                <Button variant="ghost">Add New Target</Button>
              </div>
            </PopoverContent>
          </Popover>
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
