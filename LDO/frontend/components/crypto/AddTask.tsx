import React, { useState } from "react";
import { addTaskToSupabase } from "@/utils/supabase/supabaseutils";
function AddTask({ contract, userAddress }) {
  const [title, setTitle] = useState("");
  const [reward, setReward] = useState(10);
  const [description, setDescription] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      //如果description不符合链接格式，返回错误
      if (!description.match(/https?:\/\/.*\..*/)) {
        alert("Description must be a URL.");
        return;
      }
      const tx = await contract.addTask(title, description, reward);
      await tx.wait(); // 等待交易被挖掘
      const taskId = await contract.taskIdCounter();
      await addTaskToSupabase(
        userAddress,
        taskId.toString(),
        title,
        description,
        reward,
        new Date()
      ); // 添加任务到Supabase
      alert("Task added successfully!");
    } catch (error) {
      console.error("Failed to add task:", error);
      alert(
        "Failed to add task. error: " +
          (error.message || error.reason || error.toString())
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-4 space-y-4 bg-white shadow-md rounded-lg"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Reward:
          <input
            type="text"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Task
      </button>
    </form>
  );
}

export default AddTask;
