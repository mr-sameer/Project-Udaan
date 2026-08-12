"use client";

import { useTransition } from "react";
import { updateOwnTaskStatus } from "@/lib/queries/tasks";
import type { TaskStatus } from "@/types/database";

const STATUSES: TaskStatus[] = ["todo", "in_progress", "completed"];

export function TaskStatusButtons({ taskId, currentStatus }: { taskId: string; currentStatus: TaskStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-1.5">
      {STATUSES.map((s) => (
        <button
          key={s}
          disabled={isPending || s === currentStatus}
          onClick={() => startTransition(() => updateOwnTaskStatus(taskId, s))}
          className={
            "text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-full transition-colors " +
            (s === currentStatus
              ? "bg-kesari text-parchment"
              : "bg-parchment-soft text-ink-soft hover:bg-sandstone")
          }
        >
          {s.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}
