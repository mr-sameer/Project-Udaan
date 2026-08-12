"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Field, TextInput, TextArea, SubmitButton, FormMessage } from "@/components/forms/FormField";
import { updateProfile } from "@/lib/queries/profile";
import type { Profile } from "@/types/database";

function SaveButton() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending}>Save Profile</SubmitButton>;
}

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, formAction] = useFormState(updateProfile, null);

  return (
    <form action={formAction} className="flex flex-col gap-5 bg-white p-6 md:p-7 rounded-2xl border border-sandstone max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name" htmlFor="fullName">
          <TextInput id="fullName" name="fullName" defaultValue={profile?.full_name ?? ""} required />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <TextInput id="phone" name="phone" defaultValue={profile?.phone ?? ""} />
        </Field>
        <Field label="City" htmlFor="city">
          <TextInput id="city" name="city" defaultValue={profile?.city ?? ""} />
        </Field>
        <Field label="State" htmlFor="state">
          <TextInput id="state" name="state" defaultValue={profile?.state ?? ""} />
        </Field>
        <Field label="Education" htmlFor="education">
          <TextInput id="education" name="education" defaultValue={profile?.education ?? ""} />
        </Field>
        <Field label="Occupation" htmlFor="occupation">
          <TextInput id="occupation" name="occupation" defaultValue={profile?.occupation ?? ""} />
        </Field>
        <Field label="LinkedIn URL" htmlFor="linkedinUrl">
          <TextInput id="linkedinUrl" name="linkedinUrl" defaultValue={profile?.linkedin_url ?? ""} />
        </Field>
        <Field label="Website URL" htmlFor="websiteUrl">
          <TextInput id="websiteUrl" name="websiteUrl" defaultValue={profile?.website_url ?? ""} />
        </Field>
      </div>
      <Field label="Skills (comma separated)" htmlFor="skills">
        <TextInput id="skills" name="skills" defaultValue={(profile?.skills ?? []).join(", ")} />
      </Field>
      <Field label="Bio" htmlFor="bio">
        <TextArea id="bio" name="bio" rows={4} defaultValue={profile?.bio ?? ""} />
      </Field>
      <FormMessage error={state?.error} success={state?.success} />
      <SaveButton />
    </form>
  );
}
