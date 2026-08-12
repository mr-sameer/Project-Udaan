"use client";

import { Suspense } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field, TextInput, SubmitButton, FormMessage } from "@/components/forms/FormField";
import { loginAction, type ActionState } from "@/lib/auth/actions";

function LoginButton() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending}>Log In</SubmitButton>;
}

function LoginFormContent() {
  const [state, formAction] = useFormState<ActionState, FormData>(loginAction, null);
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const justReset = params.get("reset") === "success";

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your Udaan account."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-bold text-kesari">
            Create an account
          </Link>
        </>
      }
    >
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />
        {justReset && (
          <FormMessage success="Your password has been updated. Log in with your new password." />
        )}
        <Field label="Email" htmlFor="email">
          <TextInput id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Password" htmlFor="password">
          <TextInput id="password" name="password" type="password" autoComplete="current-password" required />
        </Field>
        <div className="flex justify-end -mt-2">
          <Link href="/forgot-password" className="text-xs font-bold text-kesari">
            Forgot password?
          </Link>
        </div>
        <FormMessage error={state?.error} success={state?.success} />
        <LoginButton />
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginFormContent />
    </Suspense>
  );
}
