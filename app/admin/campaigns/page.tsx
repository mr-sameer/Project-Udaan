import { createClient } from "@/lib/supabase/server";
import { createCampaign } from "@/lib/queries/admin";

export default async function AdminCampaignsPage() {
  const supabase = createClient();
  const [{ data: campaigns }, { data: projects }] = await Promise.all([
    supabase.from("campaigns").select("*").order("created_at", { ascending: false }),
    supabase.from("projects").select("id, name"),
  ]);

  // campaign_totals is a VIEW (aggregated from donations), so it has
  // no foreign key for PostgREST to embed through — fetch it
  // separately and join by campaign_id in application code, same
  // fix as lib/queries/public.ts's getActiveCampaigns().
  const campaignIds = (campaigns ?? []).map((c) => c.id);
  const { data: totals } =
    campaignIds.length > 0
      ? await supabase.from("campaign_totals").select("campaign_id, amount_raised, supporter_count").in("campaign_id", campaignIds)
      : { data: [] as { campaign_id: string; amount_raised: number; supporter_count: number }[] };

  const totalsByCampaignId = new Map((totals ?? []).map((t) => [t.campaign_id, t]));

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Campaigns</h1>
      <p className="font-body text-ink-soft text-sm mb-8">
        "Amount raised" is always computed from successful donations — there's no field to type it in directly.
      </p>

      <details className="mb-8 rounded-2xl border border-sandstone bg-white p-6">
        <summary className="font-display text-indigo text-lg cursor-pointer">+ New Campaign</summary>
        <form action={createCampaign} className="grid sm:grid-cols-2 gap-4 mt-5">
          <input name="name" placeholder="Campaign name" required className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2" />
          <input name="slug" placeholder="url-slug" required pattern="[a-z0-9\-]+" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <input name="goalAmount" type="number" placeholder="Goal amount (₹)" required className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <select name="projectId" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2">
            <option value="">— No linked project —</option>
            {(projects ?? []).map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <textarea name="description" placeholder="Description" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2" rows={3} />
          <select name="status" defaultValue="draft" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm">
            {["draft", "active", "completed", "cancelled"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input name="startDate" type="date" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <button type="submit" className="sm:col-span-2 rounded-full bg-kesari text-parchment font-bold text-sm py-3">
            Create Campaign
          </button>
        </form>
      </details>

      <div className="flex flex-col gap-3">
        {(campaigns ?? []).map((c) => {
          const t = totalsByCampaignId.get(c.id);
          return (
            <div key={c.id} className="rounded-2xl border border-sandstone bg-white p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="font-display text-indigo text-base">{c.name}</div>
                <div className="font-body text-ink-soft text-xs mt-0.5">
                  ₹{Number(t?.amount_raised ?? 0).toLocaleString("en-IN")} raised of ₹{Number(c.goal_amount).toLocaleString("en-IN")} · {c.status}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
