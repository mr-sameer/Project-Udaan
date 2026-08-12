"use client";

import { useTransition } from "react";
import { verifyImpactMetric } from "@/lib/queries/admin";

export function VerifyImpactButton({ metricId }: { metricId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => verifyImpactMetric(metricId))}
      className="text-xs font-bold px-3 py-1.5 rounded-full bg-forest text-parchment"
    >
      Verify &amp; Publish
    </button>
  );
}
