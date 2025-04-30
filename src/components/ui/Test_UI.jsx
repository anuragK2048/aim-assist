import React, { useState } from "react";

export default function TodoApp({
  targetDetails = [
    {
      id: "1",
      name: "Prepare Presentation",
      description:
        "Keep the talk and slides simple: what are the three things about this that everyone should remember?",
    },
    {
      id: "2",
      name: "Onboard James",
      description: "Tasks to onboard the new team member James.",
    },
    {
      id: "3",
      name: "Attend Conference",
      description: "Prepare and attend the upcoming tech conference.",
    },
  ],
  taskDetails = [
    // For Prepare Presentation
    {
      id: "t1",
      targetId: "1",
      section: "Slides and notes",
      title: "Revise introduction",
      notes: "",
      important: false,
    },
    {
      id: "t2",
      targetId: "1",
      section: "Slides and notes",
      title: "Simplify slide layouts",
      notes: "",
      important: false,
    },
    {
      id: "t3",
      targetId: "1",
      section: "Slides and notes",
      title: "Review quarterly data with Olivia",
      notes: "",
      important: true,
    },
    {
      id: "t4",
      targetId: "1",
      section: "Slides and notes",
      title: "Print handouts for attendees",
      dueDate: "May 25",
      notes: "",
      important: false,
    },
    {
      id: "t5",
      targetId: "1",
      section: "Preparation",
      title: "Email John for presentation tips",
      notes: "",
      important: false,
    },
    {
      id: "t6",
      targetId: "1",
      section: "Preparation",
      title: "Check out book recommendations",
      notes: "",
      important: false,
    },
    {
      id: "t7",
      targetId: "1",
      section: "Preparation",
      title: "Time a full rehearsal",
      notes: "",
      important: true,
    },
    {
      id: "t8",
      targetId: "1",
      section: "Preparation",
      title: "Do a practice run with Eric",
      notes: "",
      important: false,
    },
    {
      id: "t9",
      targetId: "1",
      section: "Preparation",
      title: "Confirm presentation time",
      notes: "",
      important: true,
    },
  ],
}) {
  const [selectedTarget, setSelectedTarget] = useState(
    targetDetails[0]?.id || null,
  );

  const filteredTasks = taskDetails.filter(
    (task) => task.targetId === selectedTarget,
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 overflow-y-auto border-r bg-gray-100">
        <div className="p-4 text-lg font-semibold">Targets</div>
        <ul>
          {targetDetails.map((target) => (
            <li
              key={target.id}
              className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${selectedTarget === target.id ? "bg-gray-300 font-bold" : ""}`}
              onClick={() => setSelectedTarget(target.id)}
            >
              {target.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="mb-2 text-2xl font-bold">
          {targetDetails.find((t) => t.id === selectedTarget)?.name ||
            "Select a Target"}
        </h2>
        <p className="mb-4 text-gray-600">
          {targetDetails.find((t) => t.id === selectedTarget)?.description ||
            ""}
        </p>

        <div className="space-y-6">
          {["Slides and notes", "Preparation"].map((section) => (
            <div key={section}>
              <h3 className="mb-2 text-lg font-semibold text-blue-700">
                {section}
              </h3>
              <ul className="space-y-2">
                {filteredTasks
                  .filter((task) => task.section === section)
                  .map((task) => (
                    <li
                      key={task.id}
                      className="flex items-start space-x-2 rounded border bg-white p-3 shadow-sm"
                    >
                      <input type="checkbox" className="mt-1" />
                      <div>
                        <div className="font-medium">
                          {task.title}
                          {task.important && (
                            <span className="ml-2 text-xs font-semibold text-red-500">
                              Important
                            </span>
                          )}
                          {task.dueDate && (
                            <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-500">
                              {task.dueDate}
                            </span>
                          )}
                        </div>
                        {task.notes && (
                          <p className="text-sm text-gray-600">{task.notes}</p>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
