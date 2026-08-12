"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/permissions";

export async function markNotificationRead(notificationId: string) {
  const user = await requireUser();
  const supabase = createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id);
  if (error) throw error;
  revalidatePath("/dashboard/notifications");
}

export async function markAllNotificationsRead() {
  const user = await requireUser();
  const supabase = createClient();
  const { error } = await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
  if (error) throw error;
  revalidatePath("/dashboard/notifications");
}
