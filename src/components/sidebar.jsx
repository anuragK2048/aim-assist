import { useState, useMemo } from "react"
import { Clock, FileBox, Plus, Star, Trash2, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Sidebar({
  targets,
  selectedTarget,
  setSelectedTarget,
  setShowDashboard,
  setShowAddTargetForm,
  tasks,
  showDashboard, // Declared showDashboard here
}) {
  const [expanded, setExpanded] = useState({})

  // Organize targets by category
  const categorizedTargets = useMemo(() => {
    const categories = new Map()

    // Add default categories
    categories.set("main", {
      id: "main",
      title: "Main",
      targets: [
        {
          id: 0,
          name: "Dashboard",
          icon: "dashboard",
          global_id: "dashboard",
        },
        {
          id: 0,
          name: "Inbox",
          icon: "inbox",
          global_id: "inbox",
          count: tasks.filter((t) => !t.target_global_id || t.target_global_id === "inbox").length,
        },
        {
          id: 0,
          name: "Today",
          icon: "today",
          global_id: "today",
          count: getTodayTasksCount(),
          highlighted: getTodayTasksCount() > 0,
        },
        {
          id: 0,
          name: "Upcoming",
          icon: "upcoming",
          global_id: "upcoming",
        },
        {
          id: 0,
          name: "Anytime",
          icon: "anytime",
          global_id: "anytime",
        },
        {
          id: 0,
          name: "Someday",
          icon: "someday",
          global_id: "someday",
        },
        {
          id: 0,
          name: "Logbook",
          icon: "logbook",
          global_id: "logbook",
        },
        {
          id: 0,
          name: "Trash",
          icon: "trash",
          global_id: "trash",
        },
      ],
    })

    // Group targets by category
    targets.forEach((target) => {
      const category = target.category || "Uncategorized"

      if (!categories.has(category)) {
        categories.set(category, {
          id: category.toLowerCase(),
          title: category,
          targets: [],
        })
      }

      categories.get(category).targets.push({
        ...target,
        icon: "target",
        count: tasks.filter((t) => t.target_global_id === target.global_id && !t.completed).length,
      })
    })

    // Convert to array
    return Array.from(categories.values());
  }, [targets, tasks])

  // Get count of tasks due today
  function getTodayTasksCount() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return tasks.filter((task) => {
      if (!task.deadline || task.completed) return false
      const taskDate = new Date(task.deadline)
      taskDate.setHours(0, 0, 0, 0)
      return taskDate.getTime() === today.getTime();
    }).length;
  }

  // Toggle category expansion
  const toggleExpanded = (categoryId) => {
    setExpanded((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  // Handle target selection
  const handleTargetClick = (target) => {
    if (target.global_id === "dashboard") {
      setSelectedTarget(null)
      setShowDashboard(true)
    } else {
      setSelectedTarget(target)
      setShowDashboard(false)
    }
  }

  // Render icon based on icon name
  const renderIcon = (iconName) => {
    switch (iconName) {
      case "dashboard":
        return <Home className="w-5 h-5 text-gray-600" />;
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

  // Get category icon
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

  return (
    <div
      className="w-full max-w-xs bg-gray-100 border-r border-gray-200 flex flex-col">
      {/* Targets list */}
      <div className="flex-1 overflow-y-auto py-4">
        {categorizedTargets.map((category) => (
          <div key={category.id} className="mb-4">
            {category.id !== "main" && (
              <button
                className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-200 transition-colors"
                onClick={() => toggleExpanded(category.id)}>
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-gray-600 text-lg">{getCategoryIcon(category.title)}</span>
                </div>
                <span className="ml-2 text-gray-700 font-medium">{category.title}</span>
                <span className="ml-auto text-gray-400">{expanded[category.id] ? "−" : "+"}</span>
              </button>
            )}

            <div
              className={cn("space-y-1", category.id !== "main" && !expanded[category.id] && "hidden")}>
              {category.targets.map((target) => (
                <button
                  key={target.global_id}
                  className={cn(
                    "w-full flex items-center px-4 py-2 text-left transition-colors",
                    selectedTarget?.global_id === target.global_id ||
                      (!selectedTarget && target.global_id === "dashboard" && showDashboard)
                      ? "bg-white text-blue-600 font-medium"
                      : "hover:bg-gray-200 text-gray-700"
                  )}
                  onClick={() => handleTargetClick(target)}>
                  {renderIcon(target.icon)}
                  <span className="ml-2 flex-1">{target.name}</span>
                  {target.highlighted && (
                    <span
                      className="flex items-center justify-center w-5 h-5 bg-rose-500 text-white text-xs rounded-full">
                      {target.count}
                    </span>
                  )}
                  {target.count > 0 && !target.highlighted && (
                    <span className="text-gray-500 text-sm">{target.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* New list button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setShowAddTargetForm(true)}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          <span>New Target</span>
        </button>
      </div>
    </div>
  );
}
