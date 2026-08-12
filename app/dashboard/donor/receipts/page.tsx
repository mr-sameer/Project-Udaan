import { requireUser } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";

export default async function DonorReceiptsPage() {
  const user = await requireUser();
  const supabase = createClient();
  const { data: donations } = await supabase
    .from("donations")
    .select("id, amount, receipt_number, created_at, campaigns(name)")
    .eq("donor_user_id", user.id)
    .eq("payment_status", "successful")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Receipts</h1>
      <p className="font-body text-ink-soft text-sm mb-8">
        A receipt number is only generated once a payment has actually cleared.
      </p>
      <div className="flex flex-col gap-3">
        {(donations ?? []).length === 0 && <p className="font-body text-ink-soft text-sm">No receipts yet.</p>}
        {(donations ?? []).map((d: any) => (
          <div key={d.id} className="rounded-xl border border-sandstone bg-white p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-body text-ink text-sm font-semibold">{d.receipt_number}</div>
              <div className="font-body text-ink-soft text-xs mt-1">
                ₹{Number(d.amount).toLocaleString("en-IN")} · {d.campaigns?.name ?? "General fund"} · {new Date(d.created_at).toLocaleDateString("en-IN")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
