"use client";

import { useTransition } from "react";
import { verifyContribution } from "@/lib/queries/contributions";

export function ContributionVerifyActions({ contributionId }: { contributionId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2 mt-4">
      <button
        disabled={isPending}
        onClick={() => startTransition(() => verifyContribution(contributionId, "verified"))}
        className="text-xs font-bold px-3 py-1.5 rounded-full bg-forest text-parchment"
      >
        Verify
      </button>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => verifyContribution(contributionId, "rejected"))}
        className="text-xs font-bold px-3 py-1.5 rounded-full border border-sandstone text-ink-soft"
      >
        Reject
      </button>
    </div>
  );
}
