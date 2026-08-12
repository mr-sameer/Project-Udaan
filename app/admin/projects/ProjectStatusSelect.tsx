"use client";

import { useTransition } from "react";
import { updateProjectStatus } from "@/lib/queries/admin";
import type { ProjectStatus } from "@/types/database";

const STATUSES: ProjectStatus[] = ["planning", "preparing", "active", "completed", "paused", "cancelled"];

export function ProjectStatusSelect({ projectId, currentStatus }: { projectId: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentStatus}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateProjectStatus(projectId, e.target.value as ProjectStatus))}
      className="text-xs rounded-lg border border-sandstone px-2 py-1.5"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
