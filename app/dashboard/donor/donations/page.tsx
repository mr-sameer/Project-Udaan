import { requireUser } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-brass/15 text-brass",
  successful: "bg-forest/15 text-forest",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-indigo/10 text-indigo",
  cancelled: "bg-sandstone/40 text-ink-soft",
};

export default async function DonorDonationsPage() {
  const user = await requireUser();
  const supabase = createClient();
  const { data: donations } = await supabase
    .from("donations")
    .select("*, campaigns(name)")
    .eq("donor_user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Donation History</h1>
      <div className="mt-6 flex flex-col gap-3">
        {(donations ?? []).length === 0 && <p className="font-body text-ink-soft text-sm">No donations yet.</p>}
        {(donations ?? []).map((d) => (
          <div key={d.id} className="rounded-xl border border-sandstone bg-white p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-body text-ink text-sm font-semibold">₹{Number(d.amount).toLocaleString("en-IN")} · {d.campaigns?.name ?? "General fund"}</div>
              <div className="font-body text-ink-soft text-xs mt-1">{new Date(d.created_at).toLocaleDateString("en-IN")}</div>
            </div>
            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${STATUS_STYLE[d.payment_status]}`}>
              {d.payment_status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
