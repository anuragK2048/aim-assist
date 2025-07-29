import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore"; // Adjust path if needed
import { Task } from "@/types"; // Adjust path if needed
import { formatDueDate, formatForDB, parseDate } from "@/lib/date-helpers"; // Adjust path
import { cn } from "@/lib/utils"; // Your shadcn className helper

// Import UI components from shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, Flag, X, GripVertical } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { TaskListItem } from "@/features/project-view/components/TaskList";

// Main Page Component
export default function TodayPage() {
  const { tasks, addBlock } = useAppStore(
    useShallow((state) => ({
      tasks: state.tasks,
      addBlock: state.addBlock,
    }))
  );

  // Filter tasks to show only those due today
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

  const handleAddNewTask = () => {
    const tempId = crypto.randomUUID();
    addBlock("user", "tasks", {
      id: tempId,
      title: "",
      status: "incomplete",
      due_date: formatForDB(new Date()),
    });
  };

  return (
    <div className="h-full bg-background text-foreground px-80">
      <div className="h-full">
        {/* --- MAIN TASK LIST (LEFT COLUMN) --- */}
        <div className="lg:col-span-2 h-full flex flex-col border-r border-border border-l">
          <header className="p-4 sm:p-6 border-b border-border">
            <h1 className="text-2xl font-bold tracking-tight">Today</h1>
            <p className="text-muted-foreground text-sm">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
            {false ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-5/6" />
              </div>
            ) : (
              todayTasks.map((task) => (
                <TaskListItem key={task.id} task={task} />
              ))
            )}
            {todayTasks.length === 0 && !true && (
              <div className="text-center text-muted-foreground pt-16">
                <p className="font-medium">All Clear!</p>
                <p className="text-sm">
                  You have no tasks scheduled for today.
                </p>
              </div>
            )}
          </main>

          <footer className="p-4 sm:p-6 border-t border-border flex justify-center items-center">
            <Button onClick={handleAddNewTask} className="w-1/2">
              Add New Task For Today
            </Button>
          </footer>
        </div>
      </div>
    </div>
  );
}
