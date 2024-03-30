"use client";
// Market.tsx
import React, { useEffect, useState } from "react";
import {
  getTasksFromSupabase,
  completeTaskInSupabase,
} from "@/utils/supabase/supabaseutils";
import { Task } from "@/types/all"; // 更新这个路径以指向你的Task接口
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

const Market: React.FC = ({ contract, userAddress }) => {
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

  useEffect(() => {
    // 订阅tasks表的变化
    supabase
      .channel("tasks")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tasks" },
        (payload) => {
          console.log("Change received!", payload);
          // 调用一个函数来处理这些变化
          handleDataChange(payload);
        }
      )
      .subscribe();
  }, []);

  const handleDataChange = (payload: any) => {
    // 根据payload的类型（INSERT, UPDATE, DELETE）来决定如何更新状态
    if (payload.eventType === "INSERT") {
      setTasks((prevTasks) => [...prevTasks, payload.new]);
    } else if (payload.eventType === "UPDATE") {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === payload.new.id ? payload.new : task
        )
      );
    } else if (payload.eventType === "DELETE") {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== payload.old.id)
      );
    }
  };
  const checkAndCompleteTask = async (task: Task) => {
    try {
      const response = await fetch(
        `./topic?rss=${task.description}.rss&quantity=${task.quantity}`
      ); // 获取帖子详情
      const postDetails = await response.json();

      if (postDetails) {
        const index = postDetails.length - 1;
        const taskCreatedAt = new Date(task.created_at);
        const postPublishedAt = new Date(postDetails[index].pubDate);
        const postLastPublished = postDetails[index];

        console.log("taskCreatedAt", taskCreatedAt);
        console.log("postPublishedAt", postLastPublished, postPublishedAt);
        if (postPublishedAt > taskCreatedAt) {
          console.log(
            `Task ${task.task_id} completed because the post is newer than the task creation.`
          );
          // 这里更新任务状态为完成,todo 为什么要减一才行
          const tx = await contract.completeTask(task.task_id - 1);
          await tx.wait(); // 等待交易被挖掘
          await completeTaskInSupabase(userAddress, task.task_id); // 更新任务状态为完成
        } else {
          console.log(
            `Task ${task.task_id} not completed because the post is older than the task creation.`
          );
        }
      } else {
        console.error(`Error fetching post details for task ${task.task_id}.`);
      }
    } catch (error) {
      console.error("Error checking and completing task:", error);
      alert("An error occurred while checking and completing the task.");
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
          <p className="text-gray-600">Quantity: {task.quantity}</p>
          <p className="text-gray-600">CreateTime: {task.created_at}</p>
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
