import { Clock, CheckCircle, AlertTriangle, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Dashboard({
  upcomingTasks,
  targets,
  tasks,
  reminders,
  onSelectTarget,
  onToggleTaskCompletion,
  onEditTask,
}) {
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

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return dateString
    }
  }

  // Get target name by ID
  const getTargetName = (targetId) => {
    const target = targets.find((t) => t.global_id === targetId)
    return target ? target.name : "Unknown Target"
  }

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.completed).length
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  }

  // Get targets with highest priority
  const getHighPriorityTargets = () => {
    return targets
      .filter((target) => target.priority === "High" && !target.completed)
      .sort((a, b) => {
        if (a.deadline && b.deadline) {
          return new Date(a.deadline) - new Date(b.deadline);
        }
        return a.deadline ? -1 : b.deadline ? 1 : 0
      })
      .slice(0, 3);
  }

  // Get upcoming reminders
  const getUpcomingReminders = () => {
    const now = new Date()
    return reminders
      .filter((reminder) => {
        const reminderTime = new Date(reminder.time)
        return reminderTime > now && !reminder.notified
      })
      .sort((a, b) => new Date(a.time) - new Date(b.time))
      .slice(0, 3);
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your todo dashboard</p>
      </div>
      {/* Dashboard content */}
      <div className="p-6">
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Overall Progress</h3>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-blue-600">{calculateOverallProgress()}%</div>
              <div className="ml-auto">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(#3b82f6 ${calculateOverallProgress() * 3.6}deg, #e5e7eb 0deg)`,
                  }}>
                  <div
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">{calculateOverallProgress()}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Tasks</h3>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-blue-600">{tasks.length}</div>
              <div className="ml-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-green-600">{tasks.filter((t) => t.completed).length}</span>{" "}
                  completed
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-amber-600">{tasks.filter((t) => !t.completed).length}</span>{" "}
                  remaining
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Targets</h3>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-blue-600">{targets.length}</div>
              <div className="ml-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-green-600">{targets.filter((t) => t.completed).length}</span>{" "}
                  completed
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-amber-600">{targets.filter((t) => !t.completed).length}</span> in
                  progress
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks due today */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Tasks</h2>
          {upcomingTasks.today.length > 0 ? (
            <div
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {upcomingTasks.today.map((task) => (
                <div
                  key={task.global_id}
                  className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleTaskCompletion(task.global_id)}
                      className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer" />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <span
                          className={cn(
                            "font-medium",
                            task.completed ? "line-through text-gray-400" : "text-gray-800"
                          )}>
                          {task.name}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{getTargetName(task.target_global_id)}</div>
                    </div>

                    <button
                      onClick={() => onEditTask(task)}
                      className="ml-2 p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Edit Task">
                      <Clock className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">No tasks due today. Great job!</p>
            </div>
          )}
        </div>

        {/* Overdue tasks */}
        {upcomingTasks.overdue.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Overdue Tasks</h2>
            <div
              className="bg-white rounded-lg border border-red-200 shadow-sm overflow-hidden">
              {upcomingTasks.overdue.map((task) => (
                <div
                  key={task.global_id}
                  className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleTaskCompletion(task.global_id)}
                      className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer" />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                        <span className="font-medium text-gray-800">{task.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="text-red-500 font-medium mr-2">Due {formatDate(task.deadline)}</span>
                        <span>{getTargetName(task.target_global_id)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onEditTask(task)}
                      className="ml-2 p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Edit Task">
                      <Clock className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* High priority targets */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Priority Targets</h2>
          {getHighPriorityTargets().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getHighPriorityTargets().map((target) => (
                <div
                  key={target.global_id}
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onSelectTarget(target.global_id)}>
                  <h3 className="font-medium text-gray-800 mb-2">{target.name}</h3>
                  {target.deadline && (
                    <div className="text-sm text-amber-600 mb-2">Due {formatDate(target.deadline)}</div>
                  )}
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{target.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${target.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
              <p className="text-gray-600">No high priority targets at the moment.</p>
            </div>
          )}
        </div>

        {/* Upcoming reminders */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Reminders</h2>
          {getUpcomingReminders().length > 0 ? (
            <div
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {getUpcomingReminders().map((reminder) => (
                <div
                  key={reminder.id}
                  className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{reminder.taskName}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(reminder.time)} at {formatTime(reminder.time)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
              <p className="text-gray-600">No upcoming reminders.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
