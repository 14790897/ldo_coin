"use client";
// Market.tsx
import React, { useEffect, useState } from "react";
import { getTasksFromSupabase } from "@/utils/supabase/supabaseutils";
import { Task } from "@/types/all"; // 更新这个路径以指向你的Task接口

const Market: React.FC = ({ contract }) => {
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

  const checkAndCompleteTask = async (task: Task) => {
    const response = await fetch(`./topic?rss=${task.description}.rss`); // 获取帖子详情
    const postDetails = await response.json();

    if (postDetails) {
      const taskCreatedAt = new Date(task.created_at);
      const postPublishedAt = new Date(postDetails[0].pubDate);
      const postLastPublished = postDetails[0];

      // console.log("postdetails", postDetails);
      console.log("taskCreatedAt", taskCreatedAt);
      console.log("postPublishedAt", postLastPublished, postPublishedAt);
      if (postPublishedAt > taskCreatedAt) {
        console.log(
          `Task ${task.task_id} completed because the post is newer than the task creation.`
        );
        // 这里更新任务状态为完成
        contract.completeTask(task.task_id);
      } else {
        console.log(
          `Task ${task.task_id} not completed because the post is older than the task creation.`
        );
      }
    } else {
      console.error(`Error fetching post details for task ${task.task_id}.`);
    }
  };

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
          <p className="text-gray-600">Deadline: {task.created_at}</p>
          <p className="text-gray-500">
            Completed: {task.completed ? "Yes" : "No"}
          </p>
          <button
            onClick={() => checkAndCompleteTask(task)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Mark as Completed
          </button>
        </div>
      ))}
    </div>
  );
};

export default Market;