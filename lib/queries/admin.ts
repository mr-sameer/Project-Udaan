"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, requireAdmin } from "@/lib/permissions";
import { projectSchema, campaignSchema, storySchema, impactMetricSchema } from "@/lib/validations";
import type { ProjectStatus, ProjectMemberRole } from "@/types/database";

export async function createProject(formData: FormData) {
  const staff = await requireStaff();
  const parsed = projectSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    focusArea: formData.get("focusArea"),
    status: formData.get("status"),
    visibility: formData.get("visibility"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    location: formData.get("location"),
    targetBeneficiaries: formData.get("targetBeneficiaries") || undefined,
    fundingGoal: formData.get("fundingGoal") || undefined,
  });

  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      name: parsed.name,
      slug: parsed.slug,
      short_description: parsed.shortDescription || null,
      description: parsed.description || null,
      focus_area: parsed.focusArea || null,
      status: parsed.status,
      visibility: parsed.visibility,
      start_date: parsed.startDate || null,
      end_date: parsed.endDate || null,
      location: parsed.location || null,
      target_beneficiaries: parsed.targetBeneficiaries ?? null,
      funding_goal: parsed.fundingGoal ?? null,
      created_by: staff.id,
    })
    .select()
    .single();

  if (error) throw error;

  await supabase.rpc("log_audit_event", {
    p_action: "project_created",
    p_entity_type: "projects",
    p_entity_id: data.id,
    p_new_data: { name: parsed.name, status: parsed.status },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProjectStatus(projectId: string, status: ProjectStatus) {
  await requireStaff();
  const supabase = createClient();
  const { error } = await supabase.from("projects").update({ status }).eq("id", projectId);
  if (error) throw error;

  await supabase.rpc("log_audit_event", {
    p_action: "project_updated",
    p_entity_type: "projects",
    p_entity_id: projectId,
    p_new_data: { status },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function assignProjectMember(projectId: string, userId: string, role: ProjectMemberRole) {
  const staff = await requireStaff();
  const supabase = createClient();
  const { error } = await supabase
    .from("project_members")
    .insert({ project_id: projectId, user_id: userId, role, assigned_by: staff.id });
  if (error && error.code !== "23505") throw error;

  await supabase.from("notifications").insert({
    user_id: userId,
    type: "project_assigned",
    title: "You've been assigned to a project",
    link: "/dashboard/volunteer/projects",
  });

  revalidatePath("/admin/projects");
}

export async function createCampaign(formData: FormData) {
  const staff = await requireStaff();
  const parsed = campaignSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    projectId: (formData.get("projectId") as string) || undefined,
    goalAmount: formData.get("goalAmount"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    status: formData.get("status"),
  });

  const supabase = createClient();
  const { error } = await supabase.from("campaigns").insert({
    name: parsed.name,
    slug: parsed.slug,
    description: parsed.description || null,
    project_id: parsed.projectId || null,
    goal_amount: parsed.goalAmount,
    start_date: parsed.startDate || null,
    end_date: parsed.endDate || null,
    status: parsed.status,
    created_by: staff.id,
  });

  if (error) throw error;
  revalidatePath("/admin/campaigns");
  revalidatePath("/");
  redirect("/admin/campaigns");
}

export async function createStory(formData: FormData) {
  const staff = await requireStaff();
  const parsed = storySchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    projectId: (formData.get("projectId") as string) || undefined,
    status: formData.get("status"),
  });

  const supabase = createClient();
  const { error } = await supabase.from("stories").insert({
    title: parsed.title,
    slug: parsed.slug,
    excerpt: parsed.excerpt || null,
    content: parsed.content || null,
    project_id: parsed.projectId || null,
    status: parsed.status,
    author_id: staff.id,
    published_at: parsed.status === "published" ? new Date().toISOString() : null,
  });

  if (error) throw error;
  revalidatePath("/admin/stories");
  revalidatePath("/");
  redirect("/admin/stories");
}

export async function upsertImpactMetric(formData: FormData) {
  const staff = await requireStaff();
  const parsed = impactMetricSchema.parse({
    projectId: formData.get("projectId"),
    metricKey: formData.get("metricKey"),
    label: formData.get("label"),
    target: formData.get("target") || undefined,
    actual: formData.get("actual") || undefined,
    unit: formData.get("unit") || "count",
    period: formData.get("period"),
  });

  const supabase = createClient();
  const { error } = await supabase.from("impact_metrics").insert({
    project_id: parsed.projectId,
    metric_key: parsed.metricKey,
    label: parsed.label,
    target: parsed.target ?? null,
    actual: parsed.actual ?? null,
    unit: parsed.unit,
    period: parsed.period || null,
    created_by: staff.id,
    verified: false,
  });

  if (error) throw error;
  revalidatePath("/admin/impact");
}

export async function verifyImpactMetric(metricId: string, evidenceUrl?: string) {
  // requireAdmin, not requireStaff: only admin/super_admin can
  // publish a verified number, matching protect_impact_verification()
  // in the RLS migration.
  const admin = await requireAdmin();
  const supabase = createClient();

  const { error } = await supabase
    .from("impact_metrics")
    .update({
      verified: true,
      verified_by: admin.id,
      verified_at: new Date().toISOString(),
      evidence_url: evidenceUrl ?? null,
    })
    .eq("id", metricId);

  if (error) throw error;

  await supabase.rpc("log_audit_event", {
    p_action: "impact_verified",
    p_entity_type: "impact_metrics",
    p_entity_id: metricId,
  });

  revalidatePath("/admin/impact");
  revalidatePath("/");
}
