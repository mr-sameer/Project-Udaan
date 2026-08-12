import { createClient } from "@/lib/supabase/server";
import type { PaymentStatus } from "@/types/database";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-brass/15 text-brass",
  successful: "bg-forest/15 text-forest",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-indigo/10 text-indigo",
  cancelled: "bg-sandstone/40 text-ink-soft",
};

const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "successful", "failed", "refunded", "cancelled"];

function parsePaymentStatus(value: string | undefined): PaymentStatus | null {
  return value && PAYMENT_STATUSES.includes(value as PaymentStatus) ? (value as PaymentStatus) : null;
}

export default async function AdminDonationsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const supabase = createClient();
  let query = supabase
    .from("donations")
    .select("*, campaigns(name), profiles!donations_donor_user_id_fkey(full_name)")
    .order("created_at", { ascending: false });

  const statusFilter = parsePaymentStatus(searchParams.status);
  if (statusFilter) query = query.eq("payment_status", statusFilter);

  const { data: donations } = await query;

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Donations</h1>
      <p className="font-body text-ink-soft text-sm mb-8">
        Read-only by design — payment_status is only ever changed by the verified webhook (service role) or an
        explicit refund action, both of which write an audit log entry. There is no field here to edit an amount.
      </p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "pending", "successful", "failed", "refunded", "cancelled"].map((s) => (
          <a
            key={s}
            href={s ? `?status=${s}` : "."}
            className={`text-xs font-bold px-3 py-1.5 rounded-full ${
              (searchParams.status ?? "") === s ? "bg-indigo text-parchment" : "bg-white border border-sandstone text-ink-soft"
            }`}
          >
            {s || "All"}
          </a>
        ))}
      </div>

      <div className="rounded-2xl border border-sandstone bg-white divide-y divide-sandstone/60">
        {(donations ?? []).length === 0 && <p className="font-body text-ink-soft text-sm p-5">No donations yet.</p>}
        {(donations ?? []).map((d: any) => (
          <div key={d.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-body text-ink text-sm font-semibold">
                ₹{Number(d.amount).toLocaleString("en-IN")} · {d.campaigns?.name ?? "General fund"}
              </div>
              <div className="font-body text-ink-soft text-xs mt-0.5">
                {d.profiles?.full_name ?? "Anonymous"} · {d.payment_provider} · {new Date(d.created_at).toLocaleDateString("en-IN")}
              </div>
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
