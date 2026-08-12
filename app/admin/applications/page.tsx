import { createClient } from "@/lib/supabase/server";
import { ApplicationActions } from "./ApplicationActions";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-brass/15 text-brass",
  under_review: "bg-indigo/10 text-indigo",
  approved: "bg-forest/15 text-forest",
  rejected: "bg-red-100 text-red-700",
  waitlisted: "bg-kesari/15 text-kesari",
};

export default async function AdminApplicationsPage() {
  const supabase = createClient();
  const { data: applications } = await supabase
    .from("volunteer_applications")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Volunteer Applications</h1>
      <p className="font-body text-ink-soft text-sm mb-8">
        Approving here is the only thing that changes an application's status — the applicant's own dashboard
        cannot self-approve.
      </p>

      <div className="flex flex-col gap-3">
        {(applications ?? []).length === 0 && (
          <p className="font-body text-ink-soft text-sm">No applications yet.</p>
        )}
        {(applications ?? []).map((app) => (
          <div key={app.id} className="rounded-2xl border border-sandstone bg-white p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="font-display text-indigo text-lg">{app.full_name}</div>
                <div className="font-body text-ink-soft text-xs mt-0.5">
                  {app.email} · {app.phone} · {app.city ?? "—"}, {app.state ?? "—"}
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${STATUS_STYLE[app.status]}`}>
                {app.status.replace("_", " ")}
              </span>
            </div>
            {app.motivation && (
              <p className="font-body text-ink-soft text-sm mt-3 italic">"{app.motivation}"</p>
            )}
            {(app.skills?.length ?? 0) > 0 && (
              <p className="font-body text-ink-soft text-xs mt-2">Skills: {app.skills!.join(", ")}</p>
            )}
            {app.status === "pending" || app.status === "under_review" ? (
              <ApplicationActions applicationId={app.id} />
            ) : (
              app.reviewer_notes && (
                <p className="font-body text-ink-soft text-xs mt-3">Note: {app.reviewer_notes}</p>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
