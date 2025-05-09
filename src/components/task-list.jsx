"use client"

import { useState } from "react"
import { Edit, Trash2, Star, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TaskList({ tasks, onToggleCompletion, onEditTask, onDeleteTask }) {
  const [expandedTasks, setExpandedTasks] = useState({})

  // Group tasks by priority
  const groupedTasks = {
    high: tasks.filter((task) => task.priority === "High"),
    medium: tasks.filter((task) => task.priority === "Medium"),
    low: tasks.filter((task) => task.priority === "Low" || task.priority === "No priority"),
  }

  // Toggle task expansion
  const toggleTaskExpanded = (taskId) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }))
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch (e) {
      return dateString
    }
  }

  // Render task section
  const renderTaskSection = (title, tasks, priority) => {
    if (tasks.length === 0) return null

    return (
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-medium text-blue-600">{title}</h2>
          <span className="ml-2 text-sm text-gray-500">({tasks.length})</span>
        </div>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.global_id}
              className={cn(
                "border border-gray-200 rounded-lg overflow-hidden transition-all duration-200",
                expandedTasks[task.global_id] ? "shadow-md" : "hover:shadow-sm"
              )}>
              <div className="flex items-start p-3 bg-white">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleCompletion(task.global_id)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer" />

                <div className="ml-3 flex-1">
                  <div className="flex items-center">
                    {task.priority === "High" && <Star className="w-4 h-4 text-yellow-400 mr-1" />}
                    <span
                      className={cn(
                        "font-medium",
                        task.completed ? "line-through text-gray-400" : "text-gray-800"
                      )}>
                      {task.name}
                    </span>
                    {task.note && (
                      <button
                        onClick={() => toggleTaskExpanded(task.global_id)}
                        className="ml-2 text-gray-400 hover:text-gray-600">
                        {expandedTasks[task.global_id] ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  <div className="flex mt-1 flex-wrap gap-1">
                    {task.deadline && (
                      <span
                        className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600 flex items-center">
                        📅 {formatDate(task.deadline)}
                      </span>
                    )}
                    {task.priority !== "No priority" && (
                      <span
                        className={cn("text-xs px-2 py-0.5 rounded flex items-center", task.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600")}>
                        {task.priority}
                      </span>
                    )}
                    {task.duration && (
                      <span
                        className="text-xs bg-blue-100 px-2 py-0.5 rounded text-blue-700 flex items-center">
                        ⏱️ {task.duration}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex">
                  <button
                    onClick={() => onEditTask(task)}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                    title="Edit Task">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.global_id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete Task">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {task.note && expandedTasks[task.global_id] && (
                <div className="px-11 py-2 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-gray-600 whitespace-pre-line">{task.note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {tasks.length > 0 ? (
        <>
          {renderTaskSection("High Priority", groupedTasks.high)}
          {renderTaskSection("Medium Priority", groupedTasks.medium)}
          {renderTaskSection("Other Tasks", groupedTasks.low)}
        </>
      ) : (
        <div
          className="flex flex-col items-center justify-center h-full text-gray-500">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-xl mb-2">No tasks found</p>
          <p className="text-sm text-gray-400 mb-6">Add a new task to get started</p>
        </div>
      )}
    </div>
  );
}
