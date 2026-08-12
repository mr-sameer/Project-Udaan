"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function simulateMockPayment(donationId: string) {
  if (process.env.PAYMENTS_MODE !== "mock") {
    throw new Error("Mock payments are disabled outside development.");
  }

  const admin = createAdminClient();
  const { data: donation } = await admin.from("donations").select("*").eq("id", donationId).single();

  if (!donation || donation.payment_status !== "pending") {
    redirect(`/donate/mock-checkout?donationId=${donationId}&already=1`);
  }

  const receiptNumber = `UDN-${new Date().getFullYear()}-${donationId.slice(0, 8).toUpperCase()}`;

  await admin
    .from("donations")
    .update({
      payment_status: "successful",
      provider_payment_id: `mock_payment_${donationId}`,
      receipt_number: receiptNumber,
    })
    .eq("id", donationId);

  await admin.rpc("log_audit_event", {
    p_action: "donation_successful",
    p_entity_type: "donations",
    p_entity_id: donationId,
    p_new_data: { status: "successful", mode: "mock" },
  });

  if (donation.donor_user_id) {
    await admin.from("notifications").insert({
      user_id: donation.donor_user_id,
      type: "donation_successful",
      title: "Thank you — your donation was successful",
      body: `Receipt ${receiptNumber} is ready. (Development mock payment)`,
      link: "/dashboard/donor/receipts",
    });
  }

  redirect(`/donate/mock-checkout?donationId=${donationId}&success=1`);
}
