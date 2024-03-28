import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

interface AddTaskParams {
  userAddress: string;
  taskId: number;
  title: string;
  description: string;
  reward: number;
}

export async function addTaskToSupabase(
  userAddress: string,
  taskId: number,
  title: string,
  description: string,
  reward: number,
  time
) {
  try {
    console.log(
      `Task added by ${userAddress}, taskId: ${taskId}, title: ${title}, description: ${description}, reward: ${reward}`
    );
    if (!userAddress || !taskId || !title || !description || !reward) {
      return { success: false, error: "Invalid parameters" };
    }
    const { data, error } = await supabase.from("tasks").insert([
      {
        user_address: userAddress,
        task_id: taskId,
        title: title,
        description: description,
        reward: reward,
        completed: false,
      },
    ]);

    if (error) {
      console.error("Error adding task to Supabase:", error);
      return { success: false, error };
    } else {
      console.log(
        `Task added by ${userAddress} with taskId ${taskId.toString()} and title "${title}"`
      );
      console.log("Task successfully added to Supabase:", data);
      return { success: true, data };
    }
  } catch (err) {
    console.error("Unexpected error adding task to Supabase:", err);
    return { success: false, error: err };
  }
}

export async function getTasksFromSupabase() {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("task_id", { ascending: true });

    if (error) {
      console.error("Error fetching tasks from Supabase:", error);
      return { success: false, error };
    } else {
      console.log("Tasks successfully fetched from Supabase:", data);
      return { success: true, data };
    }
  } catch (err) {
    console.error("Unexpected error fetching tasks from Supabase:", err);
    return { success: false, error: err };
  }
}

// this._token.on("TaskCompleted", async (userAddress, taskId) => {
//   console.log(
//     `Task completed by ${userAddress} with taskId ${taskId.toString()}`
//   );

//   // 在Supabase中将任务标记为已完成
//   const { data, error } = await supabase
//     .from("tasks")
//     .update({ completed: true })
//     .match({ userAddress: userAddress, taskId: taskId });

//   if (error) {
//     console.error("Error marking task as completed in Supabase:", error);
//   } else {
//     console.log(
//       `Task completed by ${userAddress} with taskId ${taskId.toString()}`
//     );

//     console.log("Task successfully marked as completed in Supabase:", data);
//   }
// });
