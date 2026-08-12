"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser, requireStaff } from "@/lib/permissions";
import { volunteerApplicationSchema } from "@/lib/validations";
import type { ActionState } from "@/lib/auth/actions";

export async function submitVolunteerApplication(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser().catch(() => null);
  if (!user) {
    return { error: "Please log in first, then submit your application." };
  }

  const parsed = volunteerApplicationSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    state: formData.get("state"),
    education: formData.get("education"),
    experience: formData.get("experience"),
    availability: formData.get("availability"),
    motivation: formData.get("motivation"),
    skills: (formData.get("skills") as string)?.split(",").map((s) => s.trim()).filter(Boolean),
    preferredAreas: formData.getAll("preferredAreas") as string[],
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = createClient();
  const { error } = await supabase.from("volunteer_applications").insert({
    user_id: user.id,
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    city: parsed.data.city || null,
    state: parsed.data.state || null,
    education: parsed.data.education || null,
    skills: parsed.data.skills ?? [],
    experience: parsed.data.experience || null,
    availability: parsed.data.availability || null,
    preferred_areas: parsed.data.preferredAreas ?? [],
    motivation: parsed.data.motivation,
    status: "pending",
  });

  if (error) {
    return { error: "We couldn't submit your application. Please try again." };
  }

  return {
    success:
      "Your application has been received. We'll review it and contact you through the information you provided.",
  };
}

export async function reviewApplication(
  applicationId: string,
  decision: "approved" | "rejected" | "waitlisted" | "under_review",
  notes?: string
) {
  const staffUser = await requireStaff();
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("volunteer_applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  const { error } = await supabase
    .from("volunteer_applications")
    .update({
      status: decision,
      reviewer_notes: notes ?? null,
      reviewed_by: staffUser.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  if (error) throw error;

  await supabase.rpc("log_audit_event", {
    p_action: `application_${decision}`,
    p_entity_type: "volunteer_applications",
    p_entity_id: applicationId,
    p_old_data: existing ? { status: existing.status } : null,
    p_new_data: { status: decision },
  });

  if (decision === "approved" && existing) {
    await supabase.from("notifications").insert({
      user_id: existing.user_id,
      type: "application_approved",
      title: "Your volunteer application was approved",
      body: "Welcome to Project Udaan. Your dashboard is ready.",
      link: "/dashboard/volunteer",
    });
  }

  revalidatePath("/admin/applications");
}
