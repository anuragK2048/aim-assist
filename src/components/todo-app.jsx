"use client"

import { useState, useEffect } from "react"
import { Clock, Plus, Trash2, Search, X, Edit } from "lucide-react"
import { cn } from "@/lib/utils"
import Sidebar from "@/components/sidebar"
import TaskList from "@/components/task-list"
import TaskForm from "@/components/task-form"
import TargetForm from "@/components/target-form"
import Dashboard from "@/components/dashboard"
import Toast from "@/components/toast"
import { generateId } from "@/lib/utils"

export default function TodoApp() {
  // State for targets and tasks
  const [targets, setTargets] = useState([])
  const [tasks, setTasks] = useState([])

  // UI state
  const [selectedTarget, setSelectedTarget] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [showAddTaskForm, setShowAddTaskForm] = useState(false)
  const [showAddTargetForm, setShowAddTargetForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [editingTarget, setEditingTarget] = useState(null)
  const [showDashboard, setShowDashboard] = useState(true)
  const [toast, setToast] = useState({ show: false, message: "", type: "" })
  const [searchQuery, setSearchQuery] = useState("")
  const [reminders, setReminders] = useState([])

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedTargets = localStorage.getItem("targets")
    const savedTasks = localStorage.getItem("tasks")
    const savedReminders = localStorage.getItem("reminders")

    if (savedTargets) setTargets(JSON.parse(savedTargets))
    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedReminders) setReminders(JSON.parse(savedReminders))
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (targets.length > 0) localStorage.setItem("targets", JSON.stringify(targets))
    if (tasks.length > 0) localStorage.setItem("tasks", JSON.stringify(tasks))
    if (reminders.length > 0) localStorage.setItem("reminders", JSON.stringify(reminders))
  }, [targets, tasks, reminders])

  // Check for due reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const dueReminders = reminders.filter((reminder) => {
        const reminderTime = new Date(reminder.time)
        return reminderTime <= now && !reminder.notified
      })

      if (dueReminders.length > 0) {
        dueReminders.forEach((reminder) => {
          // Show notification
          if (Notification.permission === "granted") {
            new Notification("Task Reminder", {
              body: `Reminder: ${reminder.taskName}`,
              icon: "/favicon.ico",
            })
          }

          // Mark as notified
          setReminders(
            (prev) => prev.map((r) => (r.id === reminder.id ? { ...r, notified: true } : r))
          )

          // Show toast
          showToast(`Reminder: ${reminder.taskName}`, "info")
        })
      }
    }

    // Request notification permission
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission()
    }

    // Check reminders every minute
    const interval = setInterval(checkReminders, 60000)
    checkReminders() // Check immediately on load

    return () => clearInterval(interval);
  }, [reminders])

  // Add a new target
  const addTarget = (targetData) => {
    const newTarget = {
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      global_id: generateId(),
      user_id: "user_" + generateId(),
      completed: false,
      progress: 0,
      syncStatus: "unsynced",
      deviceId: "device_" + generateId(),
      version: 1,
      userId: 1,
      ...targetData,
    }

    setTargets((prev) => [...prev, newTarget])
    setSelectedTarget(newTarget)
    setShowDashboard(false)
    showToast("Target created successfully", "success")
  }

  // Update an existing target
  const updateTarget = (targetData) => {
    setTargets((prev) =>
      prev.map((target) =>
        target.global_id === targetData.global_id
          ? { ...target, ...targetData, updated_at: new Date().toISOString() }
          : target))

    setSelectedTarget((prev) =>
      prev?.global_id === targetData.global_id
        ? { ...prev, ...targetData, updated_at: new Date().toISOString() }
        : prev)

    setEditingTarget(null)
    showToast("Target updated successfully", "success")
  }

  // Delete a target
  const deleteTarget = (targetId) => {
    // Delete all tasks associated with this target
    setTasks((prev) => prev.filter((task) => task.target_global_id !== targetId))

    // Delete all reminders associated with tasks of this target
    const targetTaskIds = tasks.filter((task) => task.target_global_id === targetId).map((task) => task.global_id)

    setReminders(
      (prev) => prev.filter((reminder) => !targetTaskIds.includes(reminder.taskId))
    )

    // Delete the target
    setTargets((prev) => prev.filter((target) => target.global_id !== targetId))

    // If the deleted target was selected, go back to dashboard
    if (selectedTarget?.global_id === targetId) {
      setSelectedTarget(null)
      setShowDashboard(true)
    }

    showToast("Target deleted successfully", "success")
  }

  // Add a new task
  const addTask = (taskData) => {
    const newTask = {
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      global_id: generateId(),
      user_id: "user_" + generateId(),
      completed: false,
      type: "Target Task",
      progress: 0,
      sync_status: null,
      version: null,
      device_identifier: null,
      conflict_resolution_metadata: null,
      date_time: "",
      recurrence: "",
      target_name: selectedTarget?.name || null,
      ...taskData,
    }

    setTasks((prev) => [...prev, newTask])
    setShowAddTaskForm(false)

    // If a reminder was set, add it
    if (taskData.reminder) {
      addReminder(newTask.global_id, newTask.name, taskData.reminder)
    }

    showToast("Task added successfully", "success")
  }

  // Update an existing task
  const updateTask = (taskData) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.global_id === taskData.global_id ? { ...task, ...taskData, updated_at: new Date().toISOString() } : task))

    setEditingTask(null)

    // Update or add reminder if needed
    if (taskData.reminder) {
      // Check if a reminder already exists
      const existingReminder = reminders.find((r) => r.taskId === taskData.global_id)

      if (existingReminder) {
        // Update existing reminder
        setReminders((prev) =>
          prev.map(
            (r) => (r.taskId === taskData.global_id ? { ...r, time: taskData.reminder, notified: false } : r)
          ))
      } else {
        // Add new reminder
        addReminder(taskData.global_id, taskData.name, taskData.reminder)
      }
    }

    showToast("Task updated successfully", "success")
  }

  // Delete a task
  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.global_id !== taskId))

    // Delete any reminders for this task
    setReminders((prev) => prev.filter((reminder) => reminder.taskId !== taskId))

    showToast("Task deleted successfully", "success")
  }

  // Toggle task completion
  const toggleTaskCompletion = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.global_id === taskId
          ? { ...task, completed: !task.completed, updated_at: new Date().toISOString() }
          : task))

    // Update target progress
    if (selectedTarget) {
      const targetTasks = tasks.filter((task) => task.target_global_id === selectedTarget.global_id)
      const completedTasks = targetTasks.filter((task) => task.completed).length + 1 // +1 for the task we just toggled
      const progress = targetTasks.length > 0 ? Math.round((completedTasks / targetTasks.length) * 100) : 0

      setTargets((prev) =>
        prev.map((target) =>
          target.global_id === selectedTarget.global_id
            ? { ...target, progress, updated_at: new Date().toISOString() }
            : target))

      setSelectedTarget((prev) => ({ ...prev, progress }))
    }
  }

  // Add a reminder
  const addReminder = (taskId, taskName, reminderTime) => {
    const newReminder = {
      id: generateId(),
      taskId,
      taskName,
      time: reminderTime,
      notified: false,
      created_at: new Date().toISOString(),
    }

    setReminders((prev) => [...prev, newReminder])
  }

  // Delete a reminder
  const deleteReminder = (reminderId) => {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== reminderId))
  }

  // Show toast message
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
  }

  // Get filtered tasks based on selected target and filter
  const getFilteredTasks = () => {
    let filteredTasks = []

    if (selectedTarget) {
      filteredTasks = tasks.filter((task) => task.target_global_id === selectedTarget.global_id)

      // Apply search filter if any
      if (searchQuery) {
        filteredTasks = filteredTasks.filter((task) =>
          task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.note && task.note.toLowerCase().includes(searchQuery.toLowerCase())))
      }

      // Apply selected filter
      if (selectedFilter === "Important") {
        filteredTasks = filteredTasks.filter((task) => task.priority === "High")
      } else if (selectedFilter !== "All") {
        // Custom filters can be added here
      }
    }

    return filteredTasks
  }

  // Get upcoming tasks for dashboard
  const getUpcomingTasks = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    return {
      today: tasks.filter((task) => {
        if (!task.deadline) return false
        const taskDate = new Date(task.deadline)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate.getTime() === today.getTime() && !task.completed;
      }),
      tomorrow: tasks.filter((task) => {
        if (!task.deadline) return false
        const taskDate = new Date(task.deadline)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate.getTime() === tomorrow.getTime() && !task.completed;
      }),
      upcoming: tasks.filter((task) => {
        if (!task.deadline) return false
        const taskDate = new Date(task.deadline)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate > tomorrow && taskDate <= nextWeek && !task.completed
      }),
      overdue: tasks.filter((task) => {
        if (!task.deadline) return false
        const taskDate = new Date(task.deadline)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate < today && !task.completed
      }),
    };
  }

  return (
    <div className="flex h-screen bg-white text-gray-800">
      {/* Left sidebar with targets */}
      <Sidebar
        targets={targets}
        selectedTarget={selectedTarget}
        setSelectedTarget={setSelectedTarget}
        setShowDashboard={setShowDashboard}
        setShowAddTargetForm={setShowAddTargetForm}
        tasks={tasks} />
      {/* Right content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {showDashboard ? (
          <Dashboard
            upcomingTasks={getUpcomingTasks()}
            targets={targets}
            tasks={tasks}
            reminders={reminders}
            onSelectTarget={(targetId) => {
              const target = targets.find((t) => t.global_id === targetId)
              if (target) {
                setSelectedTarget(target)
                setShowDashboard(false)
              }
            }}
            onToggleTaskCompletion={toggleTaskCompletion}
            onEditTask={(task) => {
              setEditingTask(task)
              setShowDashboard(false)
            }} />
        ) : selectedTarget ? (
          <>
            {/* Target header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  {getCategoryIcon(selectedTarget.category)}
                </div>
                <h1 className="text-2xl font-bold flex-1">{selectedTarget.name}</h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingTarget(selectedTarget)}
                    className="p-2 text-gray-500 hover:text-blue-500 hover:bg-gray-100 rounded-full transition-colors"
                    title="Edit Target">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete this target? All associated tasks will be deleted."
                        )
                      ) {
                        deleteTarget(selectedTarget.global_id)
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
                    title="Delete Target">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
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

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{selectedTarget.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${selectedTarget.progress}%` }}></div>
                </div>
              </div>

              {/* Search and filters */}
              <div className="mt-6 flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  {["All", "Important", "Today"].map((filter) => (
                    <button
                      key={filter}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-sm transition-colors",
                        selectedFilter === filter
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      )}
                      onClick={() => setSelectedFilter(filter)}>
                      {filter}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowAddTaskForm(true)}
                  className="ml-auto px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm flex items-center hover:bg-blue-600 transition-colors">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Task
                </button>
              </div>
            </div>

            {/* Task list */}
            <TaskList
              tasks={getFilteredTasks()}
              onToggleCompletion={toggleTaskCompletion}
              onEditTask={setEditingTask}
              onDeleteTask={(taskId) => {
                if (confirm("Are you sure you want to delete this task?")) {
                  deleteTask(taskId)
                }
              }} />
          </>
        ) : (
          <div
            className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-xl">Select a target or create a new one</p>
            <button
              onClick={() => setShowAddTargetForm(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center hover:bg-blue-600 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Create Target
            </button>
          </div>
        )}
      </div>
      {/* Add Task Modal */}
      {showAddTaskForm && (
        <TaskForm
          onSubmit={addTask}
          onCancel={() => setShowAddTaskForm(false)}
          targetId={selectedTarget?.global_id} />
      )}
      {/* Edit Task Modal */}
      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={updateTask}
          onCancel={() => setEditingTask(null)}
          targetId={editingTask.target_global_id} />
      )}
      {/* Add Target Modal */}
      {showAddTargetForm && <TargetForm onSubmit={addTarget} onCancel={() => setShowAddTargetForm(false)} />}
      {/* Edit Target Modal */}
      {editingTarget && (
        <TargetForm
          target={editingTarget}
          onSubmit={updateTarget}
          onCancel={() => setEditingTarget(null)} />
      )}
      {/* Toast Notifications */}
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

// Helper function to get category icon
function getCategoryIcon(category) {
  if (!category) return <Clock className="w-5 h-5 text-blue-600" />;

  switch (category.toLowerCase()) {
    case "exam":
      return <span className="text-lg">📝</span>;
    case "work":
      return <span className="text-lg">💼</span>;
    case "personal":
      return <span className="text-lg">👤</span>;
    case "health":
      return <span className="text-lg">🏥</span>;
    case "education":
      return <span className="text-lg">🎓</span>;
    default:
      return <Clock className="w-5 h-5 text-blue-600" />;
  }
}

// Helper function to format date
function formatDate(dateString) {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch (e) {
    return dateString
  }
}
