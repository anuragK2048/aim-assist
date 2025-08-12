import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Repeat, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function DropdownMenuTitle({ children, onDeleteSelect }) {
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

export function DropdownMenuTask({
  children,
  setIsDropdownOpen,
  isDropdownOpen,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    if (!open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setIsDropdownOpen]);
  return (
    <DropdownMenu open={isDropdownOpen}>
      <DropdownMenuTrigger asChild onClick={() => setIsDropdownOpen(true)}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" ref={dropdownRef}>
        <DropdownMenuItem>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              className="w-full text-start flex"
              // onClick={() => setIsDropdownOpen(true)}
            >
              Repeating task
              <DropdownMenuShortcut>
                <Repeat />
              </DropdownMenuShortcut>
            </DialogTrigger>
            <DialogContent className="md:w-80 w-70">
              <div>Select Goal for Target</div>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
