"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Field, TextInput, TextArea, SubmitButton, FormMessage } from "@/components/forms/FormField";
import { submitVolunteerApplication } from "@/lib/queries/applications";

const AREAS = ["Teaching", "Mentoring", "Technology", "Content", "Fundraising", "Community Outreach"];

function ApplyButton() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending}>Submit Application</SubmitButton>;
}

export function VolunteerApplyForm() {
  const [state, formAction] = useFormState(submitVolunteerApplication, null);

  return (
    <>
      <p className="font-body text-ink-soft mb-8">
        Tell us a bit about yourself. If you're not logged in yet,{" "}
        <Link href="/register" className="font-bold text-kesari">
          create an account
        </Link>{" "}
        first — every application is tied to an account so you can track its status.
      </p>

      <form action={formAction} className="flex flex-col gap-5 bg-white p-7 md:p-9 rounded-2xl border border-sandstone">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Full name" htmlFor="fullName">
            <TextInput id="fullName" name="fullName" required />
          </Field>
          <Field label="Email" htmlFor="email">
            <TextInput id="email" name="email" type="email" required />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <TextInput id="phone" name="phone" required />
          </Field>
          <Field label="City" htmlFor="city">
            <TextInput id="city" name="city" />
          </Field>
          <Field label="State" htmlFor="state">
            <TextInput id="state" name="state" />
          </Field>
          <Field label="Education" htmlFor="education">
            <TextInput id="education" name="education" />
          </Field>
        </div>

        <Field label="Skills (comma separated)" htmlFor="skills">
          <TextInput id="skills" name="skills" placeholder="e.g. Python, Teaching, Graphic Design" />
        </Field>

        <Field label="Preferred contribution areas" htmlFor="preferredAreas">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {AREAS.map((a) => (
              <label key={a} className="flex items-center gap-2 text-sm font-body text-ink-soft">
                <input type="checkbox" name="preferredAreas" value={a} className="accent-kesari" />
                {a}
              </label>
            ))}
          </div>
        </Field>

        <Field label="Relevant experience" htmlFor="experience">
          <TextArea id="experience" name="experience" rows={3} />
        </Field>

        <Field label="Availability" htmlFor="availability">
          <TextInput id="availability" name="availability" placeholder="e.g. Weekends, 3-4 hours/week" />
        </Field>

        <Field label="Why would you like to join Udaan?" htmlFor="motivation">
          <TextArea id="motivation" name="motivation" rows={4} required minLength={20} />
        </Field>

        <FormMessage error={state?.error} success={state?.success} />
        <ApplyButton />
      </form>
    </>
  );
}
