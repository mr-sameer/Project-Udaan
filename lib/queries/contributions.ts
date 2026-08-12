"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser, requireStaff } from "@/lib/permissions";
import { contributionSchema } from "@/lib/validations";
import type { ActionState } from "@/lib/auth/actions";

export async function recordContribution(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();

  const parsed = contributionSchema.safeParse({
    projectId: (formData.get("projectId") as string) || undefined,
    contributionType: formData.get("contributionType"),
    contributionDate: formData.get("contributionDate"),
    hours: formData.get("hours") || undefined,
    peopleSupported: formData.get("peopleSupported") || undefined,
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = createClient();

  // Optional evidence upload — stored under a per-user folder so
  // storage policies (see 0004_storage.sql) restrict it to the
  // owner and staff only.
  let evidenceUrl: string | null = null;
  const evidenceFile = formData.get("evidence") as File | null;
  if (evidenceFile && evidenceFile.size > 0) {
    if (evidenceFile.size > 10 * 1024 * 1024) {
      return { error: "Evidence file must be under 10MB." };
    }
    const allowed = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
    if (!allowed.includes(evidenceFile.type)) {
      return { error: "Evidence must be an image or PDF." };
    }
    const path = `${user.id}/${Date.now()}-${evidenceFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("contribution-evidence")
      .upload(path, evidenceFile);
    if (uploadError) {
      return { error: "Couldn't upload evidence. Please try again." };
    }
    evidenceUrl = path;
  }

  const { error } = await supabase.from("volunteer_contributions").insert({
    user_id: user.id,
    project_id: parsed.data.projectId || null,
    contribution_type: parsed.data.contributionType,
    contribution_date: parsed.data.contributionDate,
    hours: parsed.data.hours ?? null,
    people_supported: parsed.data.peopleSupported ?? null,
    description: parsed.data.description || null,
    evidence_url: evidenceUrl,
    status: "pending",
  });

  if (error) {
    return { error: "Couldn't record your contribution. Please try again." };
  }

  revalidatePath("/dashboard/volunteer/contributions");
  return { success: "Contribution recorded. A coordinator will review it before it's verified." };
}

export async function verifyContribution(
  contributionId: string,
  decision: "verified" | "rejected",
  notes?: string
) {
  const staffUser = await requireStaff();
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("volunteer_contributions")
    .select("*")
    .eq("id", contributionId)
    .single();

  const { error } = await supabase
    .from("volunteer_contributions")
    .update({
      status: decision,
      verified_by: staffUser.id,
      verified_at: new Date().toISOString(),
      verification_notes: notes ?? null,
    })
    .eq("id", contributionId);

  if (error) throw error;

  await supabase.rpc("log_audit_event", {
    p_action: `contribution_${decision}`,
    p_entity_type: "volunteer_contributions",
    p_entity_id: contributionId,
    p_old_data: existing ? { status: existing.status } : null,
    p_new_data: { status: decision },
  });

  if (existing) {
    await supabase.from("notifications").insert({
      user_id: existing.user_id,
      type: `contribution_${decision}`,
      title: decision === "verified" ? "Your contribution was verified" : "A contribution needs another look",
      body: notes ?? null,
      link: "/dashboard/volunteer/contributions",
    });
  }

  revalidatePath("/admin/contributions");
}
