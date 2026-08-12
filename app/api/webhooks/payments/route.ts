import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPaymentProvider } from "@/lib/payments/provider";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-webhook-signature");

  const provider = getPaymentProvider();

  // Mock provider webhooks are only ever accepted when PAYMENTS_MODE
  // is explicitly 'mock' — this route refuses to process a mock
  // webhook against what could be a production database.
  if (provider.name === "mock" && process.env.PAYMENTS_MODE !== "mock") {
    return NextResponse.json({ error: "Mock payments are disabled." }, { status: 403 });
  }

  if (!provider.verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as {
    donationId: string;
    providerPaymentId: string;
    status: "successful" | "failed";
  };

  const admin = createAdminClient();

  const { data: donation, error: fetchError } = await admin
    .from("donations")
    .select("*")
    .eq("id", payload.donationId)
    .single();

  if (fetchError || !donation) {
    return NextResponse.json({ error: "Donation not found." }, { status: 404 });
  }

  // Idempotency: never re-process an already-settled donation, even
  // if the provider retries the webhook.
  if (donation.payment_status !== "pending") {
    return NextResponse.json({ ok: true, note: "Already processed." });
  }

  const receiptNumber = `UDN-${new Date().getFullYear()}-${donation.id.slice(0, 8).toUpperCase()}`;

  const { error: updateError } = await admin
    .from("donations")
    .update({
      payment_status: payload.status,
      provider_payment_id: payload.providerPaymentId,
      receipt_number: payload.status === "successful" ? receiptNumber : null,
    })
    .eq("id", donation.id);

  if (updateError) {
    return NextResponse.json({ error: "Failed to update donation." }, { status: 500 });
  }

  await admin.rpc("log_audit_event", {
    p_action: `donation_${payload.status}`,
    p_entity_type: "donations",
    p_entity_id: donation.id,
    p_new_data: { status: payload.status, provider_payment_id: payload.providerPaymentId },
  });

  if (payload.status === "successful" && donation.donor_user_id) {
    await admin.from("notifications").insert({
      user_id: donation.donor_user_id,
      type: "donation_successful",
      title: "Thank you — your donation was successful",
      body: `Receipt ${receiptNumber} is ready.`,
      link: "/dashboard/donor/receipts",
    });
  }

  return NextResponse.json({ ok: true });
}
