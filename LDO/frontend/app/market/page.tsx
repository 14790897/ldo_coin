"use client";
// TaskList.tsx
import React, { useEffect, useState } from "react";
import { getTasksFromSupabase } from "@/utils/supabase/supabaseutils";
import { Task } from "@/types/all"; // 更新这个路径以指向你的Task接口

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { success, data, error } = await getTasksFromSupabase();
      if (success) {
        setTasks(data);
      } else {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-8">Task List</h1>
      {tasks.map((task) => (
        <div
          key={task.task_id}
          className="bg-gray-100 rounded-lg p-4 mb-4 shadow"
        >
          <h2 className="text-xl font-semibold">{task.title}</h2>
          <p className="text-gray-700">Description: {task.description}</p>
          <p className="text-gray-600">Reward: {task.reward}</p>
          <p className="text-gray-500">
            Completed: {task.completed ? "Yes" : "No"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
