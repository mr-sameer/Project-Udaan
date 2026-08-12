import { createClient } from "@/lib/supabase/server";
import { ContributionVerifyActions } from "./ContributionVerifyActions";

export default async function AdminContributionsPage() {
  const supabase = createClient();
  const { data: contributions } = await supabase
    .from("volunteer_contributions")
    .select("*, profiles!volunteer_contributions_user_id_fkey(full_name), projects(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Contribution Verification</h1>
      <p className="font-body text-ink-soft text-sm mb-8">
        Only verified rows here count toward a volunteer's public totals or a certificate.
      </p>

      <div className="flex flex-col gap-3">
        {(contributions ?? []).length === 0 && (
          <p className="font-body text-ink-soft text-sm">No contributions submitted yet.</p>
        )}
        {(contributions ?? []).map((c: any) => (
          <div key={c.id} className="rounded-2xl border border-sandstone bg-white p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="font-display text-indigo text-base">
                  {c.profiles?.full_name ?? "Unknown"} · {c.contribution_type.replace("_", " ")}
                </div>
                <div className="font-body text-ink-soft text-xs mt-0.5">
                  {c.projects?.name ?? "No project"} · {c.contribution_date} · {c.hours ?? "—"} hrs
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-brass/15 text-brass">
                {c.status}
              </span>
            </div>
            {c.description && <p className="font-body text-ink-soft text-sm mt-2">{c.description}</p>}
            {c.evidence_url && (
              <p className="font-body text-ink-soft text-xs mt-2">
                Evidence on file: <code>{c.evidence_url}</code> (fetch a signed URL from the
                contribution-evidence bucket to preview)
              </p>
            )}
            {c.status === "pending" && <ContributionVerifyActions contributionId={c.id} />}
          </div>
        ))}
      </div>
    </div>
  );
}
