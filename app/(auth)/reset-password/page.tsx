"use client";

import { useFormState, useFormStatus } from "react-dom";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field, TextInput, SubmitButton, FormMessage } from "@/components/forms/FormField";
import { resetPasswordAction, type ActionState } from "@/lib/auth/actions";

function UpdateButton() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending}>Update Password</SubmitButton>;
}

export default function ResetPasswordPage() {
  const [state, formAction] = useFormState<ActionState, FormData>(resetPasswordAction, null);

  return (
    <AuthShell title="Set a new password" subtitle="Choose a new password for your account.">
      <form action={formAction} className="flex flex-col gap-4">
        <Field label="New password" htmlFor="password">
          <TextInput id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
        </Field>
        <Field label="Confirm new password" htmlFor="confirmPassword">
          <TextInput id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required />
        </Field>
        <FormMessage error={state?.error} success={state?.success} />
        <UpdateButton />
      </form>
    </AuthShell>
  );
}
