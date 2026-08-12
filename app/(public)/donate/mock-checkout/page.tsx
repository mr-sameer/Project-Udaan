import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/permissions";
import { simulateMockPayment } from "@/lib/payments/mock-actions";

export default async function MockCheckoutPage({
  searchParams,
}: {
  searchParams: { donationId?: string; success?: string; already?: string };
}) {
  if (process.env.PAYMENTS_MODE !== "mock") redirect("/donate");
  if (!searchParams.donationId) redirect("/donate");

  const user = await requireUser();
  const supabase = createClient();
  const { data: donation } = await supabase
    .from("donations")
    .select("*")
    .eq("id", searchParams.donationId)
    .eq("donor_user_id", user.id)
    .single();

  if (!donation) redirect("/donate");

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment px-5">
      <div className="max-w-md w-full bg-white rounded-2xl border border-sandstone p-8 text-center">
        <div className="text-xs font-bold uppercase px-3 py-1.5 rounded-full bg-kesari/15 text-kesari inline-block mb-4">
          Development payment mode
        </div>
        <h1 className="font-display text-indigo text-2xl mb-2">₹{Number(donation.amount).toLocaleString("en-IN")}</h1>
        <p className="font-body text-ink-soft text-sm mb-6">
          This simulates a payment gateway. No real money moves. In production, replace this page with the real
          Razorpay/Cashfree checkout — the donation record and webhook verification logic don't need to change.
        </p>

        {searchParams.success ? (
          <div>
            <p className="font-display text-forest text-lg mb-4">Payment successful.</p>
            <Link href="/dashboard/donor/receipts" className="text-sm font-bold text-kesari">
              View your receipt →
            </Link>
          </div>
        ) : searchParams.already ? (
          <p className="font-body text-ink-soft text-sm">This donation was already processed.</p>
        ) : (
          <form action={simulateMockPayment.bind(null, donation.id)}>
            <button type="submit" className="w-full rounded-full bg-kesari text-parchment font-bold text-sm py-3">
              Simulate Successful Payment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
