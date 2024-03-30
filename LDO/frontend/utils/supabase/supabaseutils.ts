import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export async function addTaskToSupabase(
  userAddress: string,
  taskId: number,
  title: string,
  description: string,
  reward: number,
  currentTime: Date,
  quantity: number
) {
  try {
    console.log(
      `Task added by ${userAddress}, taskId: ${taskId}, title: ${title}, description: ${description}, reward: ${reward},quantity: ${quantity}`
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
        created_at: currentTime.toISOString(), // 使用ISO字符串格式的当前时间
        quantity: quantity,
      },
    ]);

    if (error) {
      console.error("Error adding task to Supabase:", error);
      return { success: false, error };
    } else {
      console.log(
        `Task added by ${userAddress} with taskId ${taskId.toString()} and title "${title}" and timestamp "${currentTime.toISOString()}"`
      );
      console.log("Task successfully added to Supabase:", data);
      return { success: true, data };
    }
  } catch (err) {
    console.error("Unexpected error adding task to Supabase:", err);
    return { success: false, error: err };
  }
}

export async function getTasksFromSupabase(
  page = 1,
  limit = 10,
  includeCompleted = false
) {
  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from("tasks")
      .select("*")
      .range(offset, offset + limit - 1)
      .order("task_id", { ascending: true });

    if (!includeCompleted) {
      query = query.eq("completed", false);
    }

    const { data, error } = await query;

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

export async function completeTaskInSupabase(
  userAddress: string,
  taskId: number
) {
  console.log(
    `Task completed by ${userAddress} with taskId ${taskId.toString()}`
  );

  // 在Supabase中将任务标记为已完成
  const { data, error } = await supabase
    .from("tasks")
    .update({ completed: true })
    .match({ user_address: userAddress, task_id: taskId });

  if (error) {
    console.error("Error marking task as completed in Supabase:", error);
  } else {
    console.log(
      `Task completed by ${userAddress} with taskId ${taskId.toString()}`
    );

    console.log("Task successfully marked as completed in Supabase:", data);
  }
}
