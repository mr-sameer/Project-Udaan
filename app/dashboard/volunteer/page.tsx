import { requireUser } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-sandstone bg-white p-6">
      <div className="font-display text-indigo text-3xl">{value}</div>
      <div className="font-body text-ink-soft text-sm mt-1">{label}</div>
    </div>
  );
}

export default async function VolunteerOverviewPage() {
  const user = await requireUser();
  const supabase = createClient();

  // Every figure below is computed from verified rows only —
  // pending/rejected contributions never count toward these totals.
  const [{ data: contributions }, { count: projectCount }, { count: certCount }] = await Promise.all([
    supabase
      .from("volunteer_contributions")
      .select("hours, people_supported")
      .eq("user_id", user.id)
      .eq("status", "verified"),
    supabase
      .from("project_members")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("certificates")
      .select("id", { count: "exact", head: true })
      .eq("volunteer_id", user.id),
  ]);

  const totalHours = (contributions ?? []).reduce((sum, c) => sum + Number(c.hours ?? 0), 0);
  const totalPeople = (contributions ?? []).reduce((sum, c) => sum + Number(c.people_supported ?? 0), 0);
  const verifiedCount = contributions?.length ?? 0;

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Your Udaan so far</h1>
      <p className="font-body text-ink-soft text-sm mb-8">
        Every number here comes from your verified contribution records — nothing is estimated.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Verified hours" value={totalHours} />
        <StatCard label="People supported" value={totalPeople} />
        <StatCard label="Projects" value={projectCount ?? 0} />
        <StatCard label="Certificates" value={certCount ?? 0} />
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-sandstone bg-parchment-soft p-6">
        <p className="font-body text-ink-soft text-sm">
          {verifiedCount === 0
            ? "You don't have any verified contributions yet. Once you record one and a coordinator verifies it, it'll show up here."
            : `You have ${verifiedCount} verified contribution${verifiedCount === 1 ? "" : "s"}.`}
        </p>
      </div>
    </div>
  );
}
