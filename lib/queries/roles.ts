"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, isAdmin } from "@/lib/permissions";
import type { AppRole } from "@/lib/permissions/roles";

const ASSIGNABLE_BY_ADMIN: AppRole[] = ["volunteer", "donor", "mentor", "coordinator", "admin"];

export async function assignRole(userId: string, role: AppRole) {
  const admin = await requireAdmin();
  const supabase = createClient();

  // Extra guard beyond RLS: only an existing super_admin may ever
  // grant super_admin, and nobody may grant it to themselves through
  // this form (super_admin is set up manually via the Supabase
  // dashboard / SQL, not through the app UI at all).
  if (role === "super_admin") {
    throw new Error("super_admin cannot be granted through the app UI.");
  }
  if (!ASSIGNABLE_BY_ADMIN.includes(role)) {
    throw new Error("Not a valid role.");
  }

  const { error } = await supabase
    .from("user_roles")
    .insert({ user_id: userId, role })
    .select()
    .single();

  // Ignore unique-violation (role already assigned) but surface
  // anything else.
  if (error && error.code !== "23505") throw error;

  await supabase.rpc("log_audit_event", {
    p_action: "role_assigned",
    p_entity_type: "user_roles",
    p_entity_id: userId,
    p_new_data: { role, assigned_by: admin.id },
  });

  revalidatePath("/admin/volunteers");
}

export async function removeRole(userId: string, role: AppRole) {
  await requireAdmin();
  const supabase = createClient();

  const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
  if (error) throw error;

  revalidatePath("/admin/volunteers");
}
