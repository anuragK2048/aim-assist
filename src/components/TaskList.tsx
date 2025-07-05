import { CheckSquare, Calendar, FileText, List, Flag, Tag } from "lucide-react";

function TaskListItem() {
  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted">
      {/* Checkbox */}
      <CheckSquare className="w-5 h-5 text-muted-foreground mr-2" />

      {/* Date/Time */}
      <div className="flex items-center bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground mr-2">
        <Calendar className="w-3 h-3 mr-1" />
        16 June 02:00 PM
      </div>

      {/* Task Title */}
      <span className="font-medium mr-2 text-sm">This is a task</span>

      {/* Icons */}
      <FileText className="w-4 h-4 text-muted-foreground mr-1" />
      <List className="w-4 h-4 text-muted-foreground mr-2" />

      {/* Tag */}
      <span className="border border-muted-foreground rounded-full px-2 py-0.5 text-xs text-muted-foreground mr-2">
        Errand
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Flag (deadline) */}
      <Flag className="w-4 h-4 text-muted-foreground mr-1" />
      <span className="text-xs text-muted-foreground">9 days left</span>
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
