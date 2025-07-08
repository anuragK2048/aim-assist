import { client_id } from "@/lib/client";
import { useAppStore } from "@/store/useAppStore";
import React, { useState } from "react";

import { v4 as uuid } from "uuid";

const TestGoal = () => {
  const [title, setTitle] = useState("");
  const goals = useAppStore((s) => s.goals);
  const addBlock = useAppStore((s) => s.addBlock);

  const handleAddGoal = async () => {
    if (!title.trim()) return;

    const newGoal = {
      id: uuid(),
      title,
      created_at: new Date().toISOString(),
      user_id: "1cb1c31b-7e8e-448c-b766-662ac7dfdb16",
    };

    try {
      await addBlock("goals", newGoal);
      setTitle("");
    } catch (err) {
      console.error("Failed to add goal:", err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Test Add Goal</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter goal title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleAddGoal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Goal
        </button>
      </div>
      <ul className="space-y-1">
        {goals.map((goal) => (
          <li key={goal.id} className="border-b py-1">
            {goal.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestGoal;
