"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser, requireStaff } from "@/lib/permissions";
import type { TaskStatus, TaskPriority } from "@/types/database";

const TASK_PRIORITIES: TaskPriority[] = ["low", "medium", "high", "urgent"];

function parseTaskPriority(value: FormDataEntryValue | null): TaskPriority {
  return TASK_PRIORITIES.includes(value as TaskPriority) ? (value as TaskPriority) : "medium";
}

export async function updateOwnTaskStatus(taskId: string, status: TaskStatus) {
  const user = await requireUser();
  const supabase = createClient();

  // RLS (tasks_update_assignee_status_only) is the real gate here —
  // this will simply fail if this user isn't the assignee or if the
  // requested status isn't in the allowed set.
  const { error } = await supabase
    .from("tasks")
    .update({
      status,
      completed_at: status === "completed" ? new Date().toISOString() : null,
    })
    .eq("id", taskId)
    .eq("assigned_to", user.id);

  if (error) throw error;
  revalidatePath("/dashboard/volunteer/tasks");
}

export async function createTask(formData: FormData) {
  await requireStaff();
  const supabase = createClient();

  const { error } = await supabase.from("tasks").insert({
    project_id: formData.get("projectId") as string,
    assigned_to: (formData.get("assignedTo") as string) || null,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    priority: parseTaskPriority(formData.get("priority")),
    due_date: (formData.get("dueDate") as string) || null,
  });

  if (error) throw error;
  revalidatePath("/admin/tasks");
}
