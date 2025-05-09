import { useState, useEffect } from "react"
import { Clock, FileBox, MoreHorizontal, Plus, Star, StarIcon, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TodoApp({ targets, tasks }) {
  const [selectedTarget, setSelectedTarget] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [categorizedTargets, setCategorizedTargets] = useState([])
  const [targetTasks, setTargetTasks] = useState([])

  // Organize targets by category
  useEffect(() => {
    const categories = new Map()

    // Add default categories
    categories.set("main", [])

    // Group targets by category
    targets.forEach((target) => {
      if (!categories.has(target.category)) {
        categories.set(target.category, [])
      }
      categories.get(target.category)?.push(target)
    })

    // Convert to array format for rendering
    const categoriesArray = []

    // Add main category first with special targets
    categoriesArray.push({
      id: "main",
      title: "Main",
      targets: [
        {
          id: 0,
          created_at: "",
          name: "Inbox",
          description: null,
          priority: "",
          category: "main",
          deadline: "",
          progress: 0,
          status: "",
          reward: "",
          completed: false,
          syncStatus: "",
          deviceId: "",
          version: 0,
          userId: 0,
          updated_at: "",
          global_id: "inbox",
          user_id: "",
          icon: "inbox",
          count: 2,
        },
        {
          id: 0,
          created_at: "",
          name: "Today",
          description: null,
          priority: "",
          category: "main",
          deadline: "",
          progress: 0,
          status: "",
          reward: "",
          completed: false,
          syncStatus: "",
          deviceId: "",
          version: 0,
          userId: 0,
          updated_at: "",
          global_id: "today",
          user_id: "",
          icon: "today",
          count: 8,
          highlighted: true,
        },
        {
          id: 0,
          created_at: "",
          name: "Upcoming",
          description: null,
          priority: "",
          category: "main",
          deadline: "",
          progress: 0,
          status: "",
          reward: "",
          completed: false,
          syncStatus: "",
          deviceId: "",
          version: 0,
          userId: 0,
          updated_at: "",
          global_id: "upcoming",
          user_id: "",
          icon: "upcoming",
        },
        {
          id: 0,
          created_at: "",
          name: "Anytime",
          description: null,
          priority: "",
          category: "main",
          deadline: "",
          progress: 0,
          status: "",
          reward: "",
          completed: false,
          syncStatus: "",
          deviceId: "",
          version: 0,
          userId: 0,
          updated_at: "",
          global_id: "anytime",
          user_id: "",
          icon: "anytime",
        },
        {
          id: 0,
          created_at: "",
          name: "Someday",
          description: null,
          priority: "",
          category: "main",
          deadline: "",
          progress: 0,
          status: "",
          reward: "",
          completed: false,
          syncStatus: "",
          deviceId: "",
          version: 0,
          userId: 0,
          updated_at: "",
          global_id: "someday",
          user_id: "",
          icon: "someday",
        },
        {
          id: 0,
          created_at: "",
          name: "Logbook",
          description: null,
          priority: "",
          category: "main",
          deadline: "",
          progress: 0,
          status: "",
          reward: "",
          completed: false,
          syncStatus: "",
          deviceId: "",
          version: 0,
          userId: 0,
          updated_at: "",
          global_id: "logbook",
          user_id: "",
          icon: "logbook",
        },
        {
          id: 0,
          created_at: "",
          name: "Trash",
          description: null,
          priority: "",
          category: "main",
          deadline: "",
          progress: 0,
          status: "",
          reward: "",
          completed: false,
          syncStatus: "",
          deviceId: "",
          version: 0,
          userId: 0,
          updated_at: "",
          global_id: "trash",
          user_id: "",
          icon: "trash",
        },
      ],
    })

    // Add other categories
    categories.forEach((targets, categoryName) => {
      if (categoryName !== "main") {
        categoriesArray.push({
          id: categoryName.toLowerCase(),
          title: categoryName,
          targets: targets.map((target) => ({
            ...target,
            icon: "target",
          })),
        })
      }
    })

    setCategorizedTargets(categoriesArray)

    // Set initial selected target
    if (!selectedTarget && targets.length > 0) {
      setSelectedTarget(targets[0])
    }
  }, [targets, selectedTarget])

  // Filter tasks for the selected target
  useEffect(() => {
    if (selectedTarget) {
      const filteredTasks = tasks.filter((task) => task.target_global_id === selectedTarget.global_id)

      // Group tasks by priority for demonstration
      const highPriorityTasks = filteredTasks.filter((task) => task.priority === "High")
      const mediumPriorityTasks = filteredTasks.filter((task) => task.priority === "Medium")
      const lowPriorityTasks = filteredTasks.filter((task) => task.priority === "Low" || task.priority === "No priority")

      const sections = []

      if (highPriorityTasks.length > 0) {
        sections.push({
          id: "high-priority",
          title: "High Priority",
          tasks: highPriorityTasks,
        })
      }

      if (mediumPriorityTasks.length > 0) {
        sections.push({
          id: "medium-priority",
          title: "Medium Priority",
          tasks: mediumPriorityTasks,
        })
      }

      if (lowPriorityTasks.length > 0) {
        sections.push({
          id: "low-priority",
          title: "Other Tasks",
          tasks: lowPriorityTasks,
        })
      }

      // If no tasks or no grouping, show all tasks in one section
      if (sections.length === 0 && filteredTasks.length > 0) {
        sections.push({
          id: "all-tasks",
          title: "Tasks",
          tasks: filteredTasks,
        })
      }

      setTargetTasks(sections)
    }
  }, [selectedTarget, tasks])

  // Render the icon based on the icon string
  const renderIcon = (iconName) => {
    switch (iconName) {
      case "inbox":
        return <FileBox className="w-5 h-5 text-blue-500" />;
      case "today":
        return <Star className="w-5 h-5 text-yellow-400" />;
      case "upcoming":
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="text-rose-500 text-lg">📅</span>
          </div>
        );
      case "anytime":
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="text-teal-500 text-lg">📚</span>
          </div>
        );
      case "someday":
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="text-amber-500 text-lg">📦</span>
          </div>
        );
      case "logbook":
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="text-green-500 text-lg">✓</span>
          </div>
        );
      case "trash":
        return <Trash2 className="w-5 h-5 text-gray-400" />;
      case "target":
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  }

  // Get category icon based on category name
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "exam":
        return "📝"
      case "work":
        return "💼"
      case "personal":
        return "👤"
      case "health":
        return "🏥"
      case "education":
        return "🎓"
      default:
        return "📁"
    }
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

  return (
    <div className="flex h-screen bg-white text-gray-800">
      {/* Left sidebar with targets */}
      <div
        className="w-full max-w-xs bg-gray-100 border-r border-gray-200 flex flex-col">
        {/* Fake window controls */}
        <div className="flex items-center gap-2 p-3 border-b border-gray-200">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        </div>

        {/* Targets list */}
        <div className="flex-1 overflow-y-auto">
          {categorizedTargets.map((category) => (
            <div key={category.id} className="mb-6">
              {category.id !== "main" && (
                <div className="flex items-center px-4 py-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-gray-400 text-lg">{getCategoryIcon(category.title)}</span>
                  </div>
                  <span className="ml-2 text-gray-600 font-medium">{category.title}</span>
                </div>
              )}

              <div className="space-y-1">
                {category.targets.map((target) => (
                  <button
                    key={target.global_id}
                    className={cn(
                      "w-full flex items-center px-4 py-2 text-left",
                      selectedTarget?.global_id === target.global_id ? "bg-white" : "hover:bg-gray-200"
                    )}
                    onClick={() => setSelectedTarget(target)}>
                    {renderIcon(target.icon || "target")}
                    <span className="ml-2 flex-1">{target.name}</span>
                    {target.highlighted && (
                      <span
                        className="flex items-center justify-center w-5 h-5 bg-rose-500 text-white text-xs rounded-full">
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
              strokeWidth="2">
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
              <div
                className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                {selectedTarget.category ? (
                  <span className="text-lg">{getCategoryIcon(selectedTarget.category)}</span>
                ) : (
                  <Clock className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <h1 className="text-2xl font-bold flex-1">{selectedTarget.name}</h1>
              <button className="text-gray-500">
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>

            {/* Description */}
            {selectedTarget.description && <p className="mt-4 text-gray-700 text-lg">{selectedTarget.description}</p>}

            {/* Target details */}
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedTarget.priority && (
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  Priority: {selectedTarget.priority}
                </span>
              )}
              {selectedTarget.deadline && (
                <span className="text-sm bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                  Deadline: {formatDate(selectedTarget.deadline)}
                </span>
              )}
              {selectedTarget.status && (
                <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  Status: {selectedTarget.status}
                </span>
              )}
            </div>

            {/* Filters */}
            <div className="mt-6 flex gap-2">
              {["All", "Important", "Diane"].map((filter) => (
                <button
                  key={filter}
                  className={cn("px-4 py-1 rounded-full text-sm", selectedFilter === filter
                    ? "bg-gray-300 text-gray-800"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-250")}
                  onClick={() => setSelectedFilter(filter)}>
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Task sections */}
          <div className="flex-1 overflow-y-auto p-6">
            {targetTasks.length > 0 ? (
              targetTasks.map((section) => (
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
                          className="mt-1 h-5 w-5 rounded border-gray-300" />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center">
                            {task.priority === "High" && <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />}
                            <span
                              className={cn(task.completed ? "line-through text-gray-400" : "text-gray-800")}>
                              {task.name}
                            </span>
                            {task.note && <span className="ml-2 text-gray-400">📎</span>}
                          </div>

                          {(task.deadline || task.priority !== "No priority") && (
                            <div className="flex mt-1 flex-wrap gap-1">
                              {task.deadline && (
                                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">
                                  {formatDate(task.deadline)}
                                </span>
                              )}
                              {task.priority !== "No priority" && (
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                  {task.priority}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div
                className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>No tasks for this target yet.</p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
