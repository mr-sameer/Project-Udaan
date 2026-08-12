import Link from "next/link";
import { getActiveCampaigns } from "@/lib/queries/public";

export async function FundraisingSection() {
  const campaigns = await getActiveCampaigns();

  return (
    <section className="py-12 md:py-16 bg-parchment">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold mb-4 text-brass">
          <span className="w-[22px] h-[1.5px] bg-brass inline-block" />
          Become Part of the Beginning
        </div>
        <h2 className="font-display text-indigo text-3xl md:text-[2.4rem] max-w-2xl leading-tight">
          Help someone take their next step.
        </h2>
        <p className="font-body text-ink-soft mt-4 text-base leading-relaxed max-w-xl">
          Your contribution can help create access to learning, mentorship, tools and opportunity. Every figure below is pulled live from successful payments — nothing here is typed in by hand.
        </p>

        {campaigns.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-sandstone bg-parchment-soft py-10 px-8 text-center">
            <p className="font-display text-kesari text-xl">No active campaign yet.</p>
            <p className="font-body text-ink-soft text-sm mt-2">
              A campaign will appear here as soon as the first project is ready to fund.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6">
            {campaigns.map((c: any) => {
              const raised = Number(c.campaign_totals?.[0]?.amount_raised ?? 0);
              const goal = Number(c.goal_amount);
              const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
              const supporters = c.campaign_totals?.[0]?.supporter_count ?? 0;

              return (
                <div key={c.id} className="p-7 md:p-9 rounded-2xl bg-white border border-sandstone">
                  <h3 className="font-display text-indigo text-xl mb-4">{c.name}</h3>
                  <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
                    <span className="font-display text-indigo text-2xl">
                      ₹{raised.toLocaleString("en-IN")} raised
                    </span>
                    <span className="font-body text-ink-soft text-sm">
                      of ₹{goal.toLocaleString("en-IN")} target · {supporters} supporter{supporters === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden mb-6 bg-sandstone">
                    <div className="h-full rounded-full bg-kesari" style={{ width: `${pct}%` }} />
                  </div>
                  <Link
                    href={`/campaigns/${c.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold bg-kesari text-parchment"
                  >
                    Support This Project
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
