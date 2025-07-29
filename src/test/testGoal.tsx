import { useAppStore } from "../store/useAppStore"; // Adjust path
import React, { useState, useEffect } from "react";

const ProductivityTestbench = () => {
  const [title, setTitle] = useState("");

  // ✅ SOLUTION: Select each piece of state individually.
  // This is the "atomic selector" pattern.
  // The component will now only re-render if `goals`, `undoStack`, or `redoStack` actually change.
  const goals = useAppStore((s) => s.goals);
  const undoStack = useAppStore((s) => s.undoStack);
  const redoStack = useAppStore((s) => s.redoStack);

  // This pattern is PERFECTLY FINE because getState() is not a hook and actions are static.
  const { addBlock, updateBlock, removeBlock, undo, redo, setAuthUser } =
    useAppStore.getState();

  // Set a mock user on component mount to enable add actions
  useEffect(() => {
    // We only want this to run once
    setAuthUser({ id: "1cb1c31b-7e8e-448c-b766-662ac7dfdb16" });
  }, [setAuthUser]);

  const handleAddGoal = async () => {
    if (!title.trim()) return;
    await addBlock("goals", { title });
    setTitle("");
  };

  const handleUpdateGoal = async (id: string, currentTitle: string) => {
    const newTitle = prompt("Enter new title:", currentTitle);
    if (newTitle && newTitle.trim()) {
      await updateBlock("goals", { id, title: newTitle });
    }
  };

  const handleRemoveGoal = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this goal?")) {
      await removeBlock("goals", id);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto font-sans bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Productivity App Testbench
      </h1>

      {/* --- Action Controls --- */}
      <div className="flex items-center space-x-2 mb-4 bg-slate-500">
        <input
          type="text"
          placeholder="Enter a new goal title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={handleAddGoal}
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Add Goal
        </button>
      </div>

      {/* --- Undo/Redo Controls --- */}
      <div className="flex items-center space-x-2 mb-6">
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Undo ({undoStack.length})
        </button>
        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Redo ({redoStack.length})
        </button>
      </div>

      {/* --- Goal List --- */}
      <h2 className="text-xl font-semibold mb-2 text-gray-700">Goals</h2>
      <ul className="space-y-2">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <li
              key={goal.id}
              className="flex items-center justify-between bg-white p-3 rounded-md border"
            >
              <span className="text-gray-900">{goal.title}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdateGoal(goal.id, goal.title)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemoveGoal(goal.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 italic">No goals yet. Add one!</p>
        )}
      </ul>
    </div>
  );
};

export default ProductivityTestbench;
