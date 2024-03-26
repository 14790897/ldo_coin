import React, { useState } from "react";

function AddTask({ contract }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    // 调用智能合约的addTask方法
    try {
      const tx = await contract.addTask(title, description);
      await tx.wait(); // 等待交易被挖掘
      alert("Task added successfully!");
      // 可能需要刷新任务列表等
    } catch (error) {
      console.error("Failed to add task:", error);
      alert("Failed to add task.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
}

export default AddTask;
