"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field, TextInput, SubmitButton, FormMessage } from "@/components/forms/FormField";
import { forgotPasswordAction, type ActionState } from "@/lib/auth/actions";

function ResetButton() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending}>Send Reset Link</SubmitButton>;
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState<ActionState, FormData>(forgotPasswordAction, null);

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email on your account and we'll send a reset link."
      footer={
        <Link href="/login" className="font-bold text-kesari">
          Back to login
        </Link>
      }
    >
      <form action={formAction} className="flex flex-col gap-4">
        <Field label="Email" htmlFor="email">
          <TextInput id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <FormMessage error={state?.error} success={state?.success} />
        <ResetButton />
      </form>
    </AuthShell>
  );
}
