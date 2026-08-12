"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Field, TextInput, SubmitButton, FormMessage } from "@/components/forms/FormField";
import { startDonation } from "@/lib/queries/donations";

const AMOUNTS = [500, 1000, 2500, 5000];

function DonateButton() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending}>Continue to Payment</SubmitButton>;
}

export function DonateForm({ campaigns }: { campaigns: { id: string; name: string }[] }) {
  const [state, formAction] = useFormState(startDonation, null);

  return (
    <form action={formAction} className="flex flex-col gap-5 bg-white p-7 rounded-2xl border border-sandstone">
      <Field label="Campaign" htmlFor="campaignId">
        <select id="campaignId" name="campaignId" className="w-full rounded-xl border px-4 py-2.5 text-sm border-sandstone bg-white">
          <option value="">General fund</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </Field>

      <Field label="Amount (₹)" htmlFor="amount">
        <div className="grid grid-cols-4 gap-2 mb-2">
          {AMOUNTS.map((a) => (
            <label key={a} className="text-center text-xs font-bold py-2 rounded-lg border border-sandstone cursor-pointer has-[:checked]:bg-kesari has-[:checked]:text-parchment has-[:checked]:border-kesari">
              <input type="radio" name="amountPreset" value={a} className="sr-only" onChange={(e) => {
                const input = document.getElementById("amount") as HTMLInputElement;
                if (input) input.value = e.target.value;
              }} />
              ₹{a}
            </label>
          ))}
        </div>
        <TextInput id="amount" name="amount" type="number" min={1} required placeholder="Or enter a custom amount" />
      </Field>

      <label className="flex items-center gap-2 text-sm font-body text-ink-soft">
        <input type="checkbox" name="showNamePublicly" className="accent-kesari" />
        Show my name publicly as a supporter
      </label>

      <FormMessage error={state?.error} success={state?.success} />
      <DonateButton />
    </form>
  );
}
