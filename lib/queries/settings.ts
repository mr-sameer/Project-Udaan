"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/permissions";

export async function updateOrganizationSettings(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = createClient();

  const { data: existing } = await supabase.from("organization_settings").select("id").maybeSingle();
  if (!existing) throw new Error("Organization settings row missing — check migration 0001 ran.");

  const { error } = await supabase
    .from("organization_settings")
    .update({
      org_name: formData.get("orgName") as string,
      legal_name: (formData.get("legalName") as string) || null,
      contact_email: (formData.get("contactEmail") as string) || null,
      phone: (formData.get("phone") as string) || null,
      website: (formData.get("website") as string) || null,
      registration_number: (formData.get("registrationNumber") as string) || null,
      pan: (formData.get("pan") as string) || null,
      status_80g: (formData.get("status80g") as string) || "Pending",
      status_fcra: (formData.get("statusFcra") as string) || "Pending",
      mission: (formData.get("mission") as string) || null,
      about_text: (formData.get("aboutText") as string) || null,
      updated_by: admin.id,
    })
    .eq("id", existing.id);

  if (error) throw error;
  revalidatePath("/admin/settings");
  revalidatePath("/about");
}
