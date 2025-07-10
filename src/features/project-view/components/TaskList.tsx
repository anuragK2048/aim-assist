import {
  CheckSquare,
  FileText,
  List,
  Flag,
  Tag,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Calendar } from "@components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { useCurrentBlockStore } from "../hooks/useCurrentBlock";
import { useAppStore } from "@/store/useAppStore";
import { Task } from "@/types";

function TaskListItem({ task }) {
  const updateBlock = useAppStore.getState().updateBlock;
  const [isSelected, setIsSelected] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Task Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(
    new Date()
  );
  const [whenDate, setWhenDate] = useState<Date | undefined>(new Date());

  const [isWhenPopoverOpen, setIsWhenPopoverOpen] = useState(false);
  const [isDeadlinePopoverOpen, setIsDeadlinePopoverOpen] = useState(false);
  const boxRef = useRef(null);

  function saveChanges() {
    console.log(title);
    updateBlock("tasks", { id: task.id, title, description });
  }

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        console.log(title);
        updateBlock("tasks", { id: task.id, title, description });
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
  }, [isSelected, isClicked, title, description]);

  return (
    <div
      ref={boxRef}
      className={`${isSelected ? "bg-muted my-3 py-4" : "py-1 select-none"} ${
        isClicked ? "bg-accent/80" : ""
      } flex flex-col justify-center px-2 rounded gap-2 transition-all duration-200`}
      onDoubleClick={() => setIsSelected(true)}
      onClick={() => setIsClicked(true)}
    >
      <div className="flex items-center gap-1">
        {/* Checkbox */}
        <CheckSquare className="w-5 h-5 text-accent-foreground mr-2" />

        {/* Date/Time */}
        {!isSelected && (
          <div className="bg-muted text-muted-foreground flex items-center px-2 py-0.5 rounded text-xs mr-2">
            <CalendarIcon className="w-3 h-3 mr-1" />
            16 June 02:00 PM
          </div>
        )}

        {/* Task Title */}
        {isSelected ? (
          <input
            type="text"
            className="font-medium mr-2 outline-none w-full"
            value={title}
            placeholder="New Task"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveChanges}
          />
        ) : (
          <span
            className={`mr-2 text-sm select-none ${
              !title ? "text-foreground/50" : ""
            }`}
          >
            {title ? title : "New Task"}
          </span>
        )}

        {!isSelected && (
          <>
            {/* Icons */}
            <FileText className="text-muted-foreground w-4 h-4 mr-1" />
            <List className="text-muted-foreground w-4 h-4 mr-2" />
          </>
        )}

        {/* Tag */}
        {!isSelected && (
          <span className="border border-muted-foreground rounded-full px-1.5 py-0.25 text-xs text-muted-foreground mr-2">
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
        <div className="flex flex-col gap-2 ml-8 mr-2">
          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={saveChanges}
            placeholder="Notes"
            rows={2}
            className="text-foreground/85 outline-none text-sm"
          />
          <div className="flex items-center">
            <div className="flex flex-col gap-4">
              {/* Tag */}
              <span className="border border-muted-foreground rounded-full px-2 py-0.5 text-xs text-muted-foreground mr-2 w-min">
                Errand
              </span>
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="w-4 h-4 mr-1 text-chart-3" />
                16 June 02:00 PM
              </div>
              <div className="flex items-center">
                <Flag className="w-4 h-4 text-chart-5 mr-1" />
                <span className="text-xs text-muted-foreground">
                  9 days left
                </span>
              </div>
            </div>
            <div className="flex gap-3 ml-auto mt-auto items-center">
              <Tag className="w-5 h-5" />
              {/* Calendar icon and popup */}
              <Popover
                open={isWhenPopoverOpen}
                onOpenChange={setIsWhenPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <CalendarIcon className="text-chart-3 w-5 h-5 cursor-pointer" />
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
                  <Flag className="text-chart-5 w-5 h-5 cursor-pointer" />
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
  const { currentBlock, currentBlockType } = useCurrentBlockStore();
  const tasks = useAppStore((s) => s.tasks);
  const [taskList, setTaskList] = useState<Task[] | []>([]);

  useEffect(() => {
    if (currentBlockType === "targets") {
      // filter all tasks whose parent is target
      const filteredTasks = tasks.filter(
        (task) => task.target_id === currentBlock.id && task.node_id === null
      );
      setTaskList(filteredTasks);
    } else if (currentBlockType === "nodes") {
      // filter all tasks whose parent is target
      const filteredTasks = tasks.filter(
        (task) => task.node_id === currentBlock.id
      );
      setTaskList(filteredTasks);
    }
  }, [currentBlock, currentBlockType]);

  return (
    <div className="flex flex-col gap-1">
      {taskList.map((task) => (
        <TaskListItem key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;
