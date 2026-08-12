import { createClient } from "@/lib/supabase/server";

export default async function AdminAuditPage() {
  const supabase = createClient();
  const { data: logs } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Audit Logs</h1>
      <p className="font-body text-ink-soft text-sm mb-8">
        Append-only — there is no update or delete policy on this table, for any role, including super_admin.
      </p>

      <div className="rounded-2xl border border-sandstone bg-white divide-y divide-sandstone/60 overflow-x-auto">
        {(logs ?? []).length === 0 && <p className="font-body text-ink-soft text-sm p-5">No audit events yet.</p>}
        {(logs ?? []).map((l) => (
          <div key={l.id} className="p-4 text-sm font-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <span className="font-semibold text-ink">{l.action.replace(/_/g, " ")}</span>{" "}
              <span className="text-ink-soft">on {l.entity_type}{l.entity_id ? ` (${l.entity_id.slice(0, 8)}…)` : ""}</span>
            </div>
            <span className="text-xs text-ink-soft shrink-0">{new Date(l.created_at).toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
