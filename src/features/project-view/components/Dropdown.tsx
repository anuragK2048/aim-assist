import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash } from "lucide-react";

export function DropdownMenuDemo({ children, onDeleteSelect }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem onSelect={onDeleteSelect}>
          Delete{" "}
          <DropdownMenuShortcut>
            <Trash />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
