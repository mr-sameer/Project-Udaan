"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/permissions";

export async function issueCertificate(formData: FormData) {
  const staff = await requireStaff();
  const supabase = createClient();

  const volunteerId = formData.get("volunteerId") as string;
  const projectId = (formData.get("projectId") as string) || null;
  const hours = formData.get("hours") ? Number(formData.get("hours")) : null;

  const { data, error } = await supabase
    .from("certificates")
    .insert({ volunteer_id: volunteerId, project_id: projectId, hours, issued_by: staff.id })
    .select()
    .single();

  if (error) throw error;

  await supabase.from("notifications").insert({
    user_id: volunteerId,
    type: "certificate_issued",
    title: "A certificate has been issued to you",
    link: "/dashboard/volunteer/certificates",
  });

  await supabase.rpc("log_audit_event", {
    p_action: "certificate_issued",
    p_entity_type: "certificates",
    p_entity_id: data.id,
  });

  revalidatePath("/admin/certificates");
}
