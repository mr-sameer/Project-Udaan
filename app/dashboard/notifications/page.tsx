import Link from "next/link";
import { requireUser } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { NotificationRow } from "./NotificationRow";

export default async function NotificationsPage() {
  const user = await requireUser();
  const supabase = createClient();
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-8">Notifications</h1>
      <div className="flex flex-col gap-2">
        {(notifications ?? []).length === 0 && <p className="font-body text-ink-soft text-sm">Nothing yet.</p>}
        {(notifications ?? []).map((n) => (
          <NotificationRow key={n.id} notification={n} />
        ))}
      </div>
    </div>
  );
}
