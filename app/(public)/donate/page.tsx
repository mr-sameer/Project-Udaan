import { Nav } from "@/components/udaan/Nav";
import { Footer } from "@/components/udaan/StaticSections";
import { createClient } from "@/lib/supabase/server";
import { DonateForm } from "./DonateForm";

export const metadata = { title: "Donate" };

export default async function DonatePage() {
  const supabase = createClient();
  const { data: campaigns } = await supabase.from("campaigns").select("id, name").eq("status", "active");

  return (
    <div className="bg-parchment min-h-screen">
      <Nav />
      <section className="py-14 md:py-20">
        <div className="max-w-lg mx-auto px-5 md:px-8">
          <h1 className="font-display text-indigo text-3xl md:text-4xl mb-2">Support an Opportunity</h1>
          <p className="font-body text-ink-soft mb-8">
            Your contribution can help create access to learning, mentorship, tools and opportunity.
          </p>
          {process.env.PAYMENTS_MODE !== "razorpay" && (
            <div className="mb-6 text-xs font-bold uppercase px-3 py-2 rounded-lg bg-kesari/15 text-kesari inline-block">
              Development payment mode — no real money moves
            </div>
          )}
          <DonateForm campaigns={campaigns ?? []} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
