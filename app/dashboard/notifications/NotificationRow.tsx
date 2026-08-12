"use client";

import Link from "next/link";
import { useTransition } from "react";
import { markNotificationRead } from "@/lib/queries/notifications";
import type { NotificationRow as NotificationRowType } from "@/types/database";

export function NotificationRow({ notification }: { notification: NotificationRowType }) {
  const [, startTransition] = useTransition();

  const content = (
    <div
      onClick={() => !notification.read && startTransition(() => markNotificationRead(notification.id))}
      className={
        "rounded-xl border border-sandstone p-4 cursor-pointer " +
        (notification.read ? "bg-white" : "bg-kesari/5 border-kesari/40")
      }
    >
      <div className="font-body text-ink text-sm font-semibold">{notification.title}</div>
      {notification.body && <div className="font-body text-ink-soft text-xs mt-1">{notification.body}</div>}
      <div className="font-body text-ink-soft text-[10px] mt-2">
        {new Date(notification.created_at).toLocaleString("en-IN")}
      </div>
    </div>
  );

  return notification.link ? <Link href={notification.link}>{content}</Link> : content;
}
