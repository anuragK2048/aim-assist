import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/useAppStore";
import { v4 } from "uuid";
import { formatForDB } from "@/lib/date-helpers";

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
  task,
}) {
  const updateBlock = useAppStore.getState().updateBlock;
  const addBlock = useAppStore.getState().addBlock;
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const now = new Date();
  const defaultTime = now.toTimeString().slice(0, 5); // HH:MM
  const [time, setTime] = useState(defaultTime);
  const [intervalValue, setIntervalValue] = useState("daily");

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

  function handleAddRepeat() {
    console.log(intervalValue);
    console.log(time);
    const repeatId = v4();
    const repeatStart = new Date();
    updateBlock("user", "tasks", {
      id: task.id,
      is_recurring: true,
      is_repeat_origin: true,
      when: formatForDB(repeatStart),
      repeat_interval: intervalValue,
      repeat_at: time,
      repeat_id: repeatId,
    });

    // add new repeat tasks
    for (let i = 0; i < 7; i++) {
      // ADJUST NUMBER OF TASKS TO ADD
      switch (intervalValue) {
        case "daily":
          repeatStart.setDate(repeatStart.getDate() + 1);
          break;

        case "weekly":
          repeatStart.setDate(repeatStart.getDate() + 7);
          break;

        case "monthly":
          repeatStart.setMonth(repeatStart.getMonth() + 1);
          break;

        case "yearly":
          repeatStart.setFullYear(repeatStart.getFullYear() + 1);
          break;

        default:
          break;
      }
      addBlock("user", "tasks", {
        ...task,
        completed: false,
        is_recurring: true,
        is_repeat_origin: false,
        when: formatForDB(repeatStart),
        repeat_interval: intervalValue,
        repeat_at: time,
        repeat_id: repeatId,
      });
    }
  }

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
            <DialogContent className="w-auto">
              <div>Repeating task configuration</div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-4 items-center">
                  <label
                    htmlFor="interval-select"
                    className="text-md whitespace-nowrap"
                  >
                    Repeat Interval:
                  </label>
                  <Select
                    value={intervalValue}
                    onValueChange={setIntervalValue}
                  >
                    <SelectTrigger id="interval-select" className="w-[120px]">
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-4 items-center justify-between">
                  <Label htmlFor="time-picker" className="whitespace-nowrap">
                    Repeat At:
                  </Label>
                  <Input
                    type="time"
                    id="time-picker"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-[120px] bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </div>
              </div>
              <Button onClick={handleAddRepeat}>Add Repeating Task</Button>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
