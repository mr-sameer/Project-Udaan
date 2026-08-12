import { createClient } from "@/lib/supabase/server";

function Card({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-sandstone bg-white p-6">
      <div className="font-display text-indigo text-3xl">{value}</div>
      <div className="font-body text-ink-soft text-sm mt-1">{label}</div>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const supabase = createClient();

  const [
    { count: activeProjects },
    { count: activeVolunteers },
    { count: pendingApplications },
    { count: pendingContributions },
    { count: successfulDonations },
    { count: activeCampaigns },
    { count: verifiedImpact },
    { data: recentActivity },
  ] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "volunteer"),
    supabase.from("volunteer_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("volunteer_contributions").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("donations").select("id", { count: "exact", head: true }).eq("payment_status", "successful"),
    supabase.from("campaigns").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("impact_metrics").select("id", { count: "exact", head: true }).eq("verified", true),
    supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(10),
  ]);

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Admin Overview</h1>
      <p className="font-body text-ink-soft text-sm mb-8">Every figure below is a live database count.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Active Projects" value={activeProjects ?? 0} />
        <Card label="Volunteers" value={activeVolunteers ?? 0} />
        <Card label="Pending Applications" value={pendingApplications ?? 0} />
        <Card label="Pending Contributions" value={pendingContributions ?? 0} />
        <Card label="Successful Donations" value={successfulDonations ?? 0} />
        <Card label="Active Campaigns" value={activeCampaigns ?? 0} />
        <Card label="Verified Impact Metrics" value={verifiedImpact ?? 0} />
      </div>

      <h2 className="font-display text-indigo text-xl mt-10 mb-4">Recent Activity</h2>
      <div className="rounded-2xl border border-sandstone bg-white divide-y divide-sandstone/60">
        {(recentActivity ?? []).length === 0 && (
          <p className="font-body text-ink-soft text-sm p-5">No activity recorded yet.</p>
        )}
        {(recentActivity ?? []).map((a) => (
          <div key={a.id} className="p-4 text-sm font-body text-ink-soft flex justify-between gap-4">
            <span>
              <span className="font-semibold text-ink">{a.action.replace(/_/g, " ")}</span> · {a.entity_type}
            </span>
            <span className="text-xs shrink-0">{new Date(a.created_at).toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
