import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/udaan/Nav";
import { Footer } from "@/components/udaan/StaticSections";
import { getCampaignBySlug } from "@/lib/queries/public";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const campaign = await getCampaignBySlug(params.slug);
  if (!campaign) return { title: "Campaign not found" };
  return { title: campaign.name, description: campaign.description ?? undefined };
}

export default async function CampaignDetailPage({ params }: { params: { slug: string } }) {
  const campaign = await getCampaignBySlug(params.slug);
  if (!campaign) notFound();

  const raised = Number(campaign.totals?.amount_raised ?? 0);
  const goal = Number(campaign.goal_amount);
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

  return (
    <div className="bg-parchment min-h-screen">
      <Nav />
      <section className="py-14 md:py-20">
        <div className="max-w-2xl mx-auto px-5 md:px-8">
          <h1 className="font-display text-indigo text-3xl md:text-4xl mb-4">{campaign.name}</h1>
          {campaign.description && <p className="font-body text-ink-soft text-base leading-relaxed mb-8">{campaign.description}</p>}

          <div className="p-7 rounded-2xl bg-white border border-sandstone">
            <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
              <span className="font-display text-indigo text-2xl">₹{raised.toLocaleString("en-IN")} raised</span>
              <span className="font-body text-ink-soft text-sm">
                of ₹{goal.toLocaleString("en-IN")} target · {campaign.totals?.supporter_count ?? 0} supporters
              </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden mb-6 bg-sandstone">
              <div className="h-full rounded-full bg-kesari" style={{ width: `${pct}%` }} />
            </div>
            <Link href="/donate" className="inline-block px-6 py-3.5 rounded-full text-sm font-bold bg-kesari text-parchment">
              Support This Project
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
