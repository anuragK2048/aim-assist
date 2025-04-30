"use client"

import { useState } from "react"
import { Clock, FileBox, MoreHorizontal, Plus, Star, StarIcon, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Define types for our data structure
interface Task {
  id: string
  title: string
  completed: boolean
  starred?: boolean
  date?: string
  important?: boolean
  hasAttachment?: boolean
}

interface TaskSection {
  id: string
  title: string
  tasks: Task[]
}

interface Target {
  id: string
  title: string
  icon: string
  count?: number
  highlighted?: boolean
  description?: string
  sections: TaskSection[]
}

interface Category {
  id: string
  title: string
  targets: Target[]
}

// Sample data structure that would be passed as props
interface TodoAppProps {
  targetDetails: Category[]
  taskDetails?: {
    sections: TaskSection[]
    description?: string
  }
}

export default function TodoApp({ targetDetails, taskDetails }: TodoAppProps) {
  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null)
  const [selectedFilter, setSelectedFilter] = useState("All")

  // Set initial selected target if none is selected
  if (!selectedTarget && targetDetails.length > 0 && targetDetails[0].targets.length > 0) {
    // Find the "Work" category and "Prepare Presentation" target to match the screenshot
    const workCategory = targetDetails.find((cat) => cat.id === "work")
    if (workCategory) {
      const presentationTarget = workCategory.targets.find((target) => target.id === "prepare-presentation")
      if (presentationTarget) {
        setSelectedTarget(presentationTarget)
      } else {
        setSelectedTarget(workCategory.targets[0])
      }
    } else if (targetDetails[0].targets.length > 0) {
      setSelectedTarget(targetDetails[0].targets[0])
    }
  }

  // Render the icon based on the icon string
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "inbox":
        return <FileBox className="w-5 h-5 text-blue-500" />
      case "today":
        return <Star className="w-5 h-5 text-yellow-400" />
      case "upcoming":
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="text-rose-500 text-lg">📅</span>
          </div>
        )
      case "anytime":
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="text-teal-500 text-lg">📚</span>
          </div>
        )
      case "someday":
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="text-amber-500 text-lg">📦</span>
          </div>
        )
      case "logbook":
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="text-green-500 text-lg">✓</span>
          </div>
        )
      case "trash":
        return <Trash2 className="w-5 h-5 text-gray-400" />
      case "category":
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="text-gray-400 text-lg">📁</span>
          </div>
        )
      case "target":
        return <Clock className="w-5 h-5 text-gray-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="flex h-screen bg-white text-gray-800">
      {/* Left sidebar with targets */}
      <div className="w-full max-w-xs bg-gray-100 border-r border-gray-200 flex flex-col">
        {/* Fake window controls */}
        <div className="flex items-center gap-2 p-3 border-b border-gray-200">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        </div>

        {/* Targets list */}
        <div className="flex-1 overflow-y-auto">
          {targetDetails.map((category) => (
            <div key={category.id} className="mb-6">
              {category.id !== "main" && (
                <div className="flex items-center px-4 py-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-gray-400 text-lg">📁</span>
                  </div>
                  <span className="ml-2 text-gray-600 font-medium">{category.title}</span>
                </div>
              )}

              <div className="space-y-1">
                {category.targets.map((target) => (
                  <button
                    key={target.id}
                    className={cn(
                      "w-full flex items-center px-4 py-2 text-left",
                      selectedTarget?.id === target.id ? "bg-white" : "hover:bg-gray-200",
                    )}
                    onClick={() => setSelectedTarget(target)}
                  >
                    {renderIcon(target.icon)}
                    <span className="ml-2 flex-1">{target.title}</span>
                    {target.highlighted && (
                      <span className="flex items-center justify-center w-5 h-5 bg-rose-500 text-white text-xs rounded-full">
                        1
                      </span>
                    )}
                    {target.count && !target.highlighted && (
                      <span className="text-gray-500 text-sm">{target.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* New list button */}
        <div className="p-4 border-t border-gray-200 flex items-center">
          <button className="flex items-center text-gray-600">
            <Plus className="w-5 h-5 mr-2" />
            <span>New List</span>
          </button>
          <button className="ml-auto">
            <svg
              className="w-5 h-5 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Right content area */}
      {selectedTarget && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Target header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold flex-1">{selectedTarget.title}</h1>
              <button className="text-gray-500">
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>

            {/* Description */}
            {(selectedTarget.description || taskDetails?.description) && (
              <p className="mt-4 text-gray-700 text-lg">{selectedTarget.description || taskDetails?.description}</p>
            )}

            {/* Filters */}
            <div className="mt-6 flex gap-2">
              {["All", "Important", "Diane"].map((filter) => (
                <button
                  key={filter}
                  className={cn(
                    "px-4 py-1 rounded-full text-sm",
                    selectedFilter === filter
                      ? "bg-gray-300 text-gray-800"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-250",
                  )}
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Task sections */}
          <div className="flex-1 overflow-y-auto p-6">
            {(selectedTarget.sections || taskDetails?.sections || []).map((section) => (
              <div key={section.id} className="mb-8">
                <div className="flex items-center mb-4">
                  <h2 className="text-lg font-medium text-blue-600">{section.title}</h2>
                  <button className="ml-auto text-gray-500">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {section.tasks.map((task) => (
                    <div key={task.id} className="flex items-start group">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}}
                        className="mt-1 h-5 w-5 rounded border-gray-300"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center">
                          {task.starred && <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />}
                          <span className={cn(task.completed ? "line-through text-gray-400" : "text-gray-800")}>
                            {task.title}
                          </span>
                          {task.hasAttachment && <span className="ml-2 text-gray-400">📎</span>}
                        </div>

                        {task.date && (
                          <div className="flex mt-1">
                            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">{task.date}</span>
                            {task.important && (
                              <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                Important
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
