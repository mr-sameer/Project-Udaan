"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field, TextInput, SubmitButton, FormMessage } from "@/components/forms/FormField";
import { registerAction, type ActionState } from "@/lib/auth/actions";

function RegisterButton() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending}>Create Account</SubmitButton>;
}

export default function RegisterPage() {
  const [state, formAction] = useFormState<ActionState, FormData>(registerAction, null);

  return (
    <AuthShell
      title="Join Udaan"
      subtitle="Every account starts as a volunteer account. You can apply for a specific role — mentor, coordinator, and so on — from your dashboard afterward."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-kesari">
            Log in
          </Link>
        </>
      }
    >
      <form action={formAction} className="flex flex-col gap-4">
        <Field label="Full name" htmlFor="fullName">
          <TextInput id="fullName" name="fullName" autoComplete="name" required />
        </Field>
        <Field label="Email" htmlFor="email">
          <TextInput id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Password" htmlFor="password">
          <TextInput
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </Field>
        <Field label="Confirm password" htmlFor="confirmPassword">
          <TextInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </Field>
        <FormMessage error={state?.error} success={state?.success} />
        <RegisterButton />
      </form>
    </AuthShell>
  );
}
