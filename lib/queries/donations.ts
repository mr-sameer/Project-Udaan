"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/permissions";
import { donationSchema } from "@/lib/validations";
import { getPaymentProvider } from "@/lib/payments/provider";
import type { ActionState } from "@/lib/auth/actions";

export async function startDonation(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser().catch(() => null);
  if (!user) return { error: "Please log in to donate — this keeps a verifiable record tied to your receipt." };

  const parsed = donationSchema.safeParse({
    campaignId: (formData.get("campaignId") as string) || undefined,
    projectId: (formData.get("projectId") as string) || undefined,
    amount: formData.get("amount"),
    showNamePublicly: formData.get("showNamePublicly") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid amount." };
  }

  const supabase = createClient();
  const provider = getPaymentProvider();

  // Insert as pending FIRST — this row is the receipt reference the
  // order is tied to. Nothing here ever sets payment_status directly
  // to 'successful'; only the verified webhook does that (see
  // app/api/webhooks/payments/route.ts), using the service-role key.
  const { data: donation, error } = await supabase
    .from("donations")
    .insert({
      donor_user_id: user.id,
      campaign_id: parsed.data.campaignId || null,
      project_id: parsed.data.projectId || null,
      amount: parsed.data.amount,
      currency: "INR",
      payment_provider: provider.name,
      payment_status: "pending",
      show_name_publicly: parsed.data.showNamePublicly,
    })
    .select()
    .single();

  if (error || !donation) {
    return { error: "Couldn't start the donation. Please try again." };
  }

  const order = await provider.createOrder({
    amount: parsed.data.amount,
    currency: "INR",
    receiptRef: donation.id,
  });

  await supabase.from("donations").update({ provider_order_id: order.providerOrderId }).eq("id", donation.id);

  if (provider.name === "mock") {
    // Development shortcut: send the donor straight to the mock
    // checkout confirmation page instead of a real payment sheet.
    redirect(`/donate/mock-checkout?donationId=${donation.id}`);
  }

  // Real providers would redirect into their hosted checkout here,
  // passing order.checkoutPayload to the client SDK.
  redirect(`/donate/checkout?donationId=${donation.id}`);
}
