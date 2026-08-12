import { createClient } from "@/lib/supabase/server";
import { upsertImpactMetric } from "@/lib/queries/admin";
import { VerifyImpactButton } from "./VerifyImpactButton";

export default async function AdminImpactPage() {
  const supabase = createClient();
  const [{ data: metrics }, { data: projects }] = await Promise.all([
    supabase.from("impact_metrics").select("*, projects(name)").order("created_at", { ascending: false }),
    supabase.from("projects").select("id, name"),
  ]);

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Impact</h1>
      <p className="font-body text-ink-soft text-sm mb-8">
        A metric is invisible on the public site until an admin explicitly verifies it — coordinators can record
        targets/actuals, but only admin/super_admin can flip <code>verified</code> to true.
      </p>

      <details className="mb-8 rounded-2xl border border-sandstone bg-white p-6">
        <summary className="font-display text-indigo text-lg cursor-pointer">+ New Metric</summary>
        <form action={upsertImpactMetric} className="grid sm:grid-cols-2 gap-4 mt-5">
          <select name="projectId" required className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2">
            <option value="">Select project…</option>
            {(projects ?? []).map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input name="metricKey" placeholder="metric_key (e.g. students_reached)" required className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <input name="label" placeholder="Label (e.g. Students reached)" required className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <input name="target" type="number" placeholder="Target" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <input name="actual" type="number" placeholder="Actual" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <input name="unit" placeholder="Unit (e.g. count, hours)" defaultValue="count" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <input name="period" placeholder="Period (e.g. Q1 2027)" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <button type="submit" className="sm:col-span-2 rounded-full bg-kesari text-parchment font-bold text-sm py-3">
            Save Metric
          </button>
        </form>
      </details>

      <div className="flex flex-col gap-3">
        {(metrics ?? []).map((m: any) => (
          <div key={m.id} className="rounded-2xl border border-sandstone bg-white p-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-display text-indigo text-base">{m.label} — {m.projects?.name}</div>
              <div className="font-body text-ink-soft text-xs mt-0.5">
                Target: {m.target ?? "—"} · Actual: {m.actual ?? "—"} {m.unit} · {m.period ?? "no period set"}
              </div>
            </div>
            {m.verified ? (
              <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-forest/15 text-forest">
                Verified
              </span>
            ) : (
              <VerifyImpactButton metricId={m.id} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
