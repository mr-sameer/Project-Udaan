"use client";

import { useTransition } from "react";
import { reviewApplication } from "@/lib/queries/applications";

export function ApplicationActions({ applicationId }: { applicationId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <button
        disabled={isPending}
        onClick={() => startTransition(() => reviewApplication(applicationId, "approved"))}
        className="text-xs font-bold px-3 py-1.5 rounded-full bg-forest text-parchment"
      >
        Approve
      </button>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => reviewApplication(applicationId, "waitlisted"))}
        className="text-xs font-bold px-3 py-1.5 rounded-full bg-kesari text-parchment"
      >
        Waitlist
      </button>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => reviewApplication(applicationId, "under_review"))}
        className="text-xs font-bold px-3 py-1.5 rounded-full bg-indigo text-parchment"
      >
        Mark Under Review
      </button>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => reviewApplication(applicationId, "rejected"))}
        className="text-xs font-bold px-3 py-1.5 rounded-full border border-sandstone text-ink-soft"
      >
        Reject
      </button>
    </div>
  );
}
