export interface CreateOrderInput {
  amount: number;
  currency: string;
  receiptRef: string;
}

export interface CreateOrderResult {
  providerOrderId: string;
  checkoutPayload: Record<string, unknown>;
}

export interface PaymentProviderAdapter {
  name: "razorpay" | "cashfree" | "mock";
  createOrder(input: CreateOrderInput): Promise<CreateOrderResult>;
  verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean;
}

/**
 * Mock provider — development only. It never touches a real payment
 * network. A donation created through this provider can only ever
 * reach payment_status='successful' via the matching mock webhook
 * route, which is gated by PAYMENTS_MODE=mock so it can never run
 * against a production database by accident.
 */
export const mockProvider: PaymentProviderAdapter = {
  name: "mock",
  async createOrder({ amount, currency, receiptRef }) {
    return {
      providerOrderId: `mock_order_${receiptRef}`,
      checkoutPayload: { amount, currency, mode: "development" },
    };
  },
  verifyWebhookSignature() {
    // The mock webhook route checks PAYMENTS_MODE itself before ever
    // calling this — signature verification is meaningless for mock
    // orders, so this always returns true in that narrow context.
    return true;
  },
};

/**
 * Real Razorpay adapter shape (not wired to the live API in this
 * scaffold — install `razorpay` and fill this in once you have
 * production credentials). Kept here so callers never need to know
 * which provider is active.
 */
export const razorpayProvider: PaymentProviderAdapter = {
  name: "razorpay",
  async createOrder() {
    throw new Error(
      "Razorpay adapter not yet implemented — add RAZORPAY_KEY_ID/SECRET and implement createOrder() using the Razorpay SDK."
    );
  },
  verifyWebhookSignature(rawBody, signatureHeader) {
    if (!signatureHeader || !process.env.RAZORPAY_WEBHOOK_SECRET) return false;
    // Real implementation: HMAC-SHA256 the rawBody with
    // RAZORPAY_WEBHOOK_SECRET and timing-safe compare against
    // signatureHeader. Left as a stub since it needs the real
    // secret to be meaningful.
    return false;
  },
};

export function getPaymentProvider(): PaymentProviderAdapter {
  const mode = process.env.PAYMENTS_MODE ?? "mock";
  if (mode === "mock") return mockProvider;
  if (mode === "razorpay") return razorpayProvider;
  throw new Error(`Unknown PAYMENTS_MODE: ${mode}`);
}
