"use client";

import { useState, useTransition } from "react";
import { searchProfiles, assignMember } from "@/lib/queries/project-members";
import type { ProjectMemberRole } from "@/types/database";

const ROLES: ProjectMemberRole[] = ["lead", "volunteer", "mentor", "trainer", "coordinator", "researcher", "content_creator"];

export function AssignMemberForm({ projectId }: { projectId: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ user_id: string; full_name: string; email: string }[]>([]);
  const [selected, setSelected] = useState<{ user_id: string; full_name: string } | null>(null);
  const [role, setRole] = useState<ProjectMemberRole>("volunteer");
  const [isPending, startTransition] = useTransition();
  const [searching, setSearching] = useState(false);

  async function handleSearch(value: string) {
    setQuery(value);
    setSelected(null);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const matches = await searchProfiles(value);
    setResults(matches);
    setSearching(false);
  }

  return (
    <div className="rounded-2xl border border-sandstone bg-white p-6 max-w-lg">
      {!selected ? (
        <>
          <input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-xl border border-sandstone px-4 py-2.5 text-sm"
          />
          {searching && <p className="font-body text-ink-soft text-xs mt-2">Searching…</p>}
          {results.length > 0 && (
            <div className="mt-3 flex flex-col gap-1">
              {results.map((r) => (
                <button
                  key={r.user_id}
                  onClick={() => {
                    setSelected(r);
                    setResults([]);
                  }}
                  className="text-left px-3 py-2 rounded-lg hover:bg-parchment-soft text-sm font-body"
                >
                  <span className="font-semibold text-ink">{r.full_name}</span>{" "}
                  <span className="text-ink-soft text-xs">{r.email}</span>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="font-body text-ink text-sm font-semibold">{selected.full_name}</div>
            <button onClick={() => setSelected(null)} className="text-xs text-kesari font-bold">
              Change
            </button>
          </div>
          <div className="flex items-center gap-2">
            <select value={role} onChange={(e) => setRole(e.target.value as ProjectMemberRole)} className="text-xs rounded-lg border border-sandstone px-2 py-1.5">
              {ROLES.map((r) => (
                <option key={r} value={r}>{r.replace("_", " ")}</option>
              ))}
            </select>
            <button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await assignMember(projectId, selected.user_id, role);
                  setSelected(null);
                  setQuery("");
                })
              }
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-indigo text-parchment"
            >
              Assign
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
