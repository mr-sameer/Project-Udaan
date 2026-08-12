"use client";

import { useTransition } from "react";
import { assignRole } from "@/lib/queries/roles";
import type { AppRole } from "@/lib/permissions/roles";

const ROLES: AppRole[] = ["volunteer", "donor", "mentor", "coordinator", "admin"];

export function AssignRoleForm({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const role = new FormData(e.currentTarget).get("role") as AppRole;
        startTransition(() => assignRole(userId, role));
      }}
    >
      <select name="role" className="text-xs rounded-lg border border-sandstone px-2 py-1.5">
        {ROLES.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <button
        disabled={isPending}
        type="submit"
        className="text-xs font-bold px-3 py-1.5 rounded-full bg-indigo text-parchment"
      >
        Assign
      </button>
    </form>
  );
}
