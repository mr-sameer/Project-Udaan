"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function VerifyLookupForm() {
  const [code, setCode] = useState("");
  const router = useRouter();

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (code.trim()) router.push(`/verify/${encodeURIComponent(code.trim())}`);
      }}
    >
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="e.g. UDN-A1B2C3D4E5"
        className="flex-1 rounded-xl border border-sandstone px-4 py-2.5 text-sm"
      />
      <button type="submit" className="px-5 py-2.5 rounded-xl bg-kesari text-parchment text-sm font-bold">
        Verify
      </button>
    </form>
  );
}
