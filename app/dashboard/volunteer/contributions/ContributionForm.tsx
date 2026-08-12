"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Field, TextInput, TextArea, SubmitButton, FormMessage } from "@/components/forms/FormField";
import { recordContribution } from "@/lib/queries/contributions";

const TYPES = [
  "teaching", "mentoring", "fundraising", "technology", "content",
  "research", "community_outreach", "event", "equipment", "administration", "other",
];

function RecordButton() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending}>Record Contribution</SubmitButton>;
}

export function ContributionForm({ projects }: { projects: { id: string; name: string }[] }) {
  const [state, formAction] = useFormState(recordContribution, null);

  return (
    <form action={formAction} className="flex flex-col gap-5 bg-white p-6 md:p-7 rounded-2xl border border-sandstone">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Project" htmlFor="projectId">
          <select id="projectId" name="projectId" className="w-full rounded-xl border px-4 py-2.5 text-sm border-sandstone bg-white">
            <option value="">— Not tied to a project —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Contribution type" htmlFor="contributionType">
          <select id="contributionType" name="contributionType" required className="w-full rounded-xl border px-4 py-2.5 text-sm border-sandstone bg-white">
            {TYPES.map((t) => (
              <option key={t} value={t}>{t.replace("_", " ")}</option>
            ))}
          </select>
        </Field>
        <Field label="Date" htmlFor="contributionDate">
          <TextInput id="contributionDate" name="contributionDate" type="date" required />
        </Field>
        <Field label="Hours" htmlFor="hours">
          <TextInput id="hours" name="hours" type="number" min={0.5} step={0.5} max={24} />
        </Field>
        <Field label="People supported" htmlFor="peopleSupported">
          <TextInput id="peopleSupported" name="peopleSupported" type="number" min={0} />
        </Field>
        <Field label="Evidence (image or PDF, optional)" htmlFor="evidence">
          <input id="evidence" name="evidence" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" className="text-sm" />
        </Field>
      </div>
      <Field label="Description" htmlFor="description">
        <TextArea id="description" name="description" rows={3} />
      </Field>
      <FormMessage error={state?.error} success={state?.success} />
      <RecordButton />
    </form>
  );
}
