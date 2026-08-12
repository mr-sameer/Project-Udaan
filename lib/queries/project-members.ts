"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/permissions";
import { assignProjectMember } from "@/lib/queries/admin";
import type { ProjectMemberRole } from "@/types/database";

export async function searchProfiles(query: string) {
  await requireStaff();
  if (!query || query.trim().length < 2) return [];

  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("user_id, full_name, email")
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(8);

  return data ?? [];
}

export async function assignMember(projectId: string, userId: string, role: ProjectMemberRole) {
  await assignProjectMember(projectId, userId, role);
  revalidatePath(`/admin/projects/${projectId}`);
}
