import Link from "next/link";
import { getPublicProjects } from "@/lib/queries/public";

const STATUS_LABEL: Record<string, string> = {
  planning: "Planning",
  preparing: "Preparing",
  active: "Active",
  completed: "Completed",
  paused: "Paused",
  cancelled: "Cancelled",
};

export async function CurrentProjectsSection() {
  const projects = await getPublicProjects();

  return (
    <section className="py-12 md:py-16 bg-parchment">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold mb-4 text-brass">
          <span className="w-[22px] h-[1.5px] bg-brass inline-block" />
          Our Work Today
        </div>
        <h2 className="font-display text-indigo text-3xl md:text-4xl mb-4 max-w-2xl">Current Projects</h2>
        <p className="font-body text-ink-soft text-base leading-relaxed max-w-2xl mb-10">
          Presented as we'd present a fieldwork report — plainly, and only with what's actually true today. This list is read directly from our database, not typed in by hand.
        </p>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sandstone bg-parchment-soft py-12 px-8 text-center">
            <p className="font-display text-kesari text-xl md:text-2xl">
              No public projects yet — the first one is being prepared.
            </p>
            <p className="font-body text-ink-soft text-sm mt-2">
              As soon as an admin publishes a project, it will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="rounded-2xl border border-sandstone bg-white p-7 hover:border-kesari transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wide text-kesari">
                      {p.focus_area ?? "Project"}
                    </span>
                    <h3 className="font-display text-indigo text-xl mt-1">{p.name}</h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-brass/10 text-brass shrink-0">
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                </div>
                {p.short_description && (
                  <p className="text-sm text-ink-soft leading-relaxed">{p.short_description}</p>
                )}
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs text-ink-soft">
                  {p.target_beneficiaries != null && <span>{p.target_beneficiaries} beneficiaries (target)</span>}
                  {p.funding_goal != null && <span>₹{Number(p.funding_goal).toLocaleString("en-IN")} funding goal</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
