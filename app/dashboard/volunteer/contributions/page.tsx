import { requireUser } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { ContributionForm } from "./ContributionForm";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-brass/15 text-brass",
  verified: "bg-forest/15 text-forest",
  rejected: "bg-red-100 text-red-700",
};

export default async function ContributionsPage() {
  const user = await requireUser();
  const supabase = createClient();

  const [{ data: contributions }, { data: projects }] = await Promise.all([
    supabase
      .from("volunteer_contributions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("projects")
      .select("id, name")
      .eq("visibility", "public"),
  ]);

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Record Contribution</h1>
      <p className="font-body text-ink-soft text-sm mb-8">
        Every submission starts as <em>pending</em> — only a coordinator's verification moves it to
        <em> verified</em>, and only verified contributions count toward your impact totals or a certificate.
      </p>

      <ContributionForm projects={projects ?? []} />

      <h2 className="font-display text-indigo text-xl mt-12 mb-4">Your History</h2>
      <div className="flex flex-col gap-3">
        {(contributions ?? []).length === 0 && (
          <p className="font-body text-ink-soft text-sm">No contributions recorded yet.</p>
        )}
        {(contributions ?? []).map((c) => (
          <div key={c.id} className="rounded-xl border border-sandstone bg-white p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-body text-ink text-sm font-semibold capitalize">
                {c.contribution_type.replace("_", " ")} · {c.contribution_date}
              </div>
              {c.description && <div className="font-body text-ink-soft text-xs mt-1">{c.description}</div>}
              {c.hours != null && (
                <div className="font-body text-ink-soft text-xs mt-1">{c.hours} hours logged</div>
              )}
            </div>
            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${STATUS_STYLE[c.status]}`}>
              {c.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
