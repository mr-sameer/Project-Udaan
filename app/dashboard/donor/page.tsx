import Link from "next/link";
import { requireUser } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/udaan/Nav";

const LINKS = [
  { label: "Overview", href: "/dashboard/donor" },
  { label: "Donations", href: "/dashboard/donor/donations" },
  { label: "Receipts", href: "/dashboard/donor/receipts" },
  { label: "Profile", href: "/dashboard/profile" },
];

export default async function DonorDashboardPage() {
  const user = await requireUser();
  const supabase = createClient();

  const { data: donations } = await supabase
    .from("donations")
    .select("*, campaigns(name), projects(name)")
    .eq("donor_user_id", user.id)
    .eq("payment_status", "successful");

  const total = (donations ?? []).reduce((sum, d) => sum + Number(d.amount), 0);
  const projectsSupported = new Set((donations ?? []).map((d) => d.project_id).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-parchment">
      <Nav />
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-10 grid md:grid-cols-[200px_1fr] gap-8">
        <aside className="hidden md:block">
          <nav className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-semibold text-ink-soft hover:text-indigo px-3 py-2 rounded-lg hover:bg-white">
                {l.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main>
          <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Your Support</h1>
          <p className="font-body text-ink-soft text-sm mb-8">Totals here only count successful, verified payments.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-sandstone bg-white p-6">
              <div className="font-display text-indigo text-3xl">₹{total.toLocaleString("en-IN")}</div>
              <div className="font-body text-ink-soft text-sm mt-1">Total donated</div>
            </div>
            <div className="rounded-2xl border border-sandstone bg-white p-6">
              <div className="font-display text-indigo text-3xl">{donations?.length ?? 0}</div>
              <div className="font-body text-ink-soft text-sm mt-1">Donations</div>
            </div>
            <div className="rounded-2xl border border-sandstone bg-white p-6">
              <div className="font-display text-indigo text-3xl">{projectsSupported}</div>
              <div className="font-body text-ink-soft text-sm mt-1">Projects supported</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
