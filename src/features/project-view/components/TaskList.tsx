import { da } from "date-fns/locale";
import {
  CheckSquare,
  FileText,
  List,
  Flag,
  Tag,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as React from "react";
import { Calendar } from "@components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";

function TaskListItem() {
  const [isSelected, setIsSelected] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(
    new Date()
  );
  const [whenDate, setWhenDate] = useState<Date | undefined>(new Date());
  const [isWhenPopoverOpen, setIsWhenPopoverOpen] = useState(false);
  const [isDeadlinePopoverOpen, setIsDeadlinePopoverOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        console.log("ran");
        setIsClicked(false);
        setIsSelected(false);
      }
    }
    if (isSelected || isClicked) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSelected, isClicked]);

  return (
    <div
      ref={boxRef}
      className={`${isSelected ? "my-3 bg-muted py-4" : "py-1 select-none"} ${
        isClicked ? "bg-blue-800" : ""
      } flex flex-col justify-center px-2  rounded gap-2 transition-all duration-200`}
      onDoubleClick={() => setIsSelected(true)}
      onClick={() => setIsClicked(true)}
    >
      <div className="flex items-center gap-2">
        {/* Checkbox */}
        <CheckSquare className="w-5 h-5 text-muted-foreground mr-2" />

        {/* Date/Time */}
        {!isSelected && (
          <div className="flex items-center bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground mr-2">
            <CalendarIcon className="w-3 h-3 mr-1" />
            16 June 02:00 PM
          </div>
        )}

        {/* Task Title */}
        {isSelected ? (
          <input
            type="text"
            className="font-medium mr-2 text-sm outline-none"
            value={"This is a task"}
            // onChange={e => setTitle(e.target.value)}
          />
        ) : (
          <span className="font-medium mr-2 text-sm select-none">
            This is a task
          </span>
        )}

        {!isSelected && (
          <>
            {/* Icons */}
            <FileText className="w-4 h-4 text-muted-foreground mr-1" />
            <List className="w-4 h-4 text-muted-foreground mr-2" />
          </>
        )}

        {/* Tag */}
        {!isSelected && (
          <span className="border border-muted-foreground rounded-full px-2 py-0.5 text-xs text-muted-foreground mr-2">
            Errand
          </span>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Flag (deadline) */}
        {!isSelected && (
          <>
            <Flag className="w-4 h-4 text-muted-foreground mr-1" />
            <span className="text-xs text-muted-foreground">9 days left</span>
          </>
        )}
      </div>
      {isSelected && (
        <div className="flex flex-col gap-2 ml-9">
          <textarea
            placeholder="Notes"
            rows={2}
            className="outline-none text-sm"
          />
          <div className="flex items-center">
            <div className="flex flex-col gap-4">
              {/* Tag */}
              <span className="border border-muted-foreground rounded-full px-2 py-0.5 text-xs text-muted-foreground mr-2 w-min">
                Errand
              </span>
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="w-4 h-4 mr-1" />
                16 June 02:00 PM
              </div>
              <div className="flex items-center">
                <Flag className="w-4 h-4 text-muted-foreground mr-1" />
                <span className="text-xs text-muted-foreground">
                  9 days left
                </span>
              </div>
            </div>
            <div className="flex gap-2 ml-auto mt-auto">
              <Tag className="w-4 h-4" />
              {/* Calendar icon and popup */}
              <Popover
                open={isWhenPopoverOpen}
                onOpenChange={setIsWhenPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <CalendarIcon className="w-4 h-4 cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent
                  className=""
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Calendar
                    mode="single"
                    selected={whenDate}
                    onSelect={(selectedDate) => {
                      setWhenDate(selectedDate);
                      setIsWhenPopoverOpen(false); // close popover when date is selected
                    }}
                    className="rounded-md border shadow-sm bg-background"
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <Popover
                open={isDeadlinePopoverOpen}
                onOpenChange={setIsDeadlinePopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Flag className="w-4 h-4 cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent
                  className=""
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Calendar
                    mode="single"
                    selected={deadlineDate}
                    onSelect={(selectedDate) => {
                      setDeadlineDate(selectedDate);
                      setIsDeadlinePopoverOpen(false); // close popover when date is selected
                    }}
                    className="rounded-md border shadow-sm bg-background"
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskList() {
  return (
    <div>
      <TaskListItem />
      <TaskListItem />
      <TaskListItem />
      <TaskListItem />
    </div>
  );
}

export default TaskList;
