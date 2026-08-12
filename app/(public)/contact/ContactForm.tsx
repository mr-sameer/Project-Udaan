"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Field, TextInput, TextArea, SubmitButton, FormMessage } from "@/components/forms/FormField";
import { submitContactMessage } from "@/lib/queries/contact";

function SendButton() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending}>Send Message</SubmitButton>;
}

export function ContactForm() {
  const [state, formAction] = useFormState(submitContactMessage, null);

  return (
    <form action={formAction} className="flex flex-col gap-5 bg-white p-7 rounded-2xl border border-sandstone">
      <Field label="Name" htmlFor="name">
        <TextInput id="name" name="name" required />
      </Field>
      <Field label="Email" htmlFor="email">
        <TextInput id="email" name="email" type="email" required />
      </Field>
      <Field label="Subject" htmlFor="subject">
        <TextInput id="subject" name="subject" />
      </Field>
      <Field label="Message" htmlFor="message">
        <TextArea id="message" name="message" rows={5} required minLength={10} />
      </Field>
      <FormMessage error={state?.error} success={state?.success} />
      <SendButton />
    </form>
  );
}
