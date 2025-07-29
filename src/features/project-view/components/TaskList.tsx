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
import { useCurrentBlockStore } from "../store/useCurrentBlock";
import { useAppStore } from "@/store/useAppStore";
import { Task } from "@/types";
import { useShallow } from "zustand/react/shallow";
import AnimatedCheckbox from "@/components/common/Checkbox";
import {
  formatForDB,
  formatToUserFriendlyDate,
  parseDate,
} from "@/lib/date-helpers";

export function TaskListItem({ task }) {
  const updateBlock = useAppStore.getState().updateBlock;
  const setSelectedTaskId = useCurrentBlockStore().setSelectedTaskId;
  const [isSelected, setIsSelected] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const { lastAddedTaskId } = useAppStore(
    useShallow((s) => ({
      lastAddedTaskId: s.lastAddedTaskId,
      // clearLastAddedTaskId: s.clearLastAddedTaskId,
    }))
  );

  useEffect(() => {
    if (lastAddedTaskId && lastAddedTaskId === task.id) {
      setIsSelected(true);
    }
  }, []);

  // Task Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDateDate] = useState<Date | undefined>(
    task.due_date ? parseDate(task.due_date) : new Date()
  );
  const [whenDate, setWhenDate] = useState<Date | undefined>(new Date());

  const [isWhenPopoverOpen, setIsWhenPopoverOpen] = useState(false);
  const [isDueDatePopoverOpen, setIsDueDatePopoverOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
  }, [task]);

  // set selectedTaskId
  useEffect(() => {
    if (isClicked || isSelected) {
      setSelectedTaskId(task.id);
    }
  }, [isClicked, setSelectedTaskId, isSelected, task]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        updateBlock("user", "tasks", { id: task.id, title, description });
        setIsClicked(false);
        setIsSelected(false);
        setTimeout(() => {
          setSelectedTaskId(null);
        }, 100);
      }
    }

    if (isSelected || isClicked) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSelected, isClicked, title, description]);

  // Handle task details mutations
  function saveChanges() {
    updateBlock("user", "tasks", { id: task.id, title, description });
  }

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
        <AnimatedCheckbox
          className="mr-1"
          color="accent"
          defaultChecked={task.completed}
          onChange={(isChecked) => {
            console.log("hjksam", isChecked);
            updateBlock("user", "tasks", { id: task.id, completed: isChecked });
          }}
        />

        {/* Date/Time */}
        {!isSelected && task.when && (
          <div className="bg-muted text-muted-foreground flex items-center px-2 py-0.5 rounded text-xs mr-2">
            <CalendarIcon className="w-3 h-3 mr-1" />
            {formatToUserFriendlyDate(task.when)}
          </div>
        )}

        {/* Task Title */}
        {isSelected ? (
          <input
            type="text"
            className="font-medium mr-2 outline-none w-full"
            value={title}
            placeholder="New Task"
            autoFocus
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

        {/* {!isSelected && (
          <>
            <FileText className="text-muted-foreground w-4 h-4 mr-1" />
            <List className="text-muted-foreground w-4 h-4 mr-2" />
          </>
        )} */}

        {/* Tag */}
        {!isSelected &&
          task.tags?.length > 0 &&
          task.tags.map((tag, i) => (
            <span
              key={i}
              className="border border-muted-foreground rounded-full px-1.5 py-0.25 text-xs text-muted-foreground mr-2"
            >
              {tag}
            </span>
          ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Flag (dueDate) */}
        {!isSelected && task.due_date && (
          <>
            <Flag className="w-4 h-4 text-muted-foreground mr-1" />
            <span className="text-xs text-muted-foreground">
              {formatToUserFriendlyDate(task.due_date)}
            </span>
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
            className="text-foreground/85 outline-none text-sm -ml-1"
          />
          <div className="flex items-center">
            <div className="flex flex-col gap-4">
              {/* Tag */}
              {task.tags?.length > 0 &&
                task.tags.map((tag) => (
                  <span className="border border-muted-foreground rounded-full px-1.5 py-0.25 text-xs text-muted-foreground mr-2">
                    {tag}
                  </span>
                ))}
              {task.when && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarIcon className="w-4 h-4 mr-1 text-chart-3" />
                  {formatToUserFriendlyDate(task.when)}
                </div>
              )}
              {task.due_date && (
                <div className="flex items-center">
                  <Flag className="w-4 h-4 text-chart-5 mr-1" />
                  <span className="text-xs text-muted-foreground">
                    {formatToUserFriendlyDate(task.due_date)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3 ml-auto mt-auto items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Tag className="w-5 h-5 cursor-pointer text-muted-foreground" />
                </PopoverTrigger>
                <PopoverContent
                  className="p-2 w-56"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    placeholder="Add a tag"
                    className="w-full px-2 py-1 text-sm border border-muted-foreground rounded mb-2 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const value = (
                          e.target as HTMLInputElement
                        ).value.trim();
                        if (value) {
                          updateBlock("user", "tasks", {
                            id: task.id,
                            tags: [...(task.tags || []), value],
                          });
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-1">
                    {(task.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {/* Calendar icon and popup */}
              <Popover
                open={isWhenPopoverOpen}
                onOpenChange={setIsWhenPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <CalendarIcon className="text-when w-5 h-5 cursor-pointer" />
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
                      const parsedDate = formatForDB(selectedDate);
                      updateBlock("user", "tasks", {
                        id: task.id,
                        when: parsedDate,
                      });
                      setIsWhenPopoverOpen(false); // close popover when date is selected
                    }}
                    className="rounded-md border shadow-sm bg-background"
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <Popover
                open={isDueDatePopoverOpen}
                onOpenChange={setIsDueDatePopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Flag className="text-deadline w-5 h-5 cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent
                  className=""
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(selectedDate) => {
                      setDueDateDate(selectedDate);
                      const parsedDate = formatForDB(selectedDate);
                      updateBlock("user", "tasks", {
                        id: task.id,
                        due_date: parsedDate,
                      });
                      setIsDueDatePopoverOpen(false); // close popover when date is selected
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
  }, [currentBlock, currentBlockType, tasks]);

  return (
    <div className="flex flex-col gap-1">
      {taskList.map((task) => (
        <TaskListItem key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;
