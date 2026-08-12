"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/permissions";
import { profileSchema } from "@/lib/validations";
import type { ActionState } from "@/lib/auth/actions";

export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();

  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    state: formData.get("state"),
    bio: formData.get("bio"),
    education: formData.get("education"),
    occupation: formData.get("occupation"),
    linkedinUrl: formData.get("linkedinUrl"),
    websiteUrl: formData.get("websiteUrl"),
    preferredLanguage: formData.get("preferredLanguage") || "en",
    skills: (formData.get("skills") as string)?.split(",").map((s) => s.trim()).filter(Boolean),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
      city: parsed.data.city || null,
      state: parsed.data.state || null,
      bio: parsed.data.bio || null,
      education: parsed.data.education || null,
      occupation: parsed.data.occupation || null,
      skills: parsed.data.skills ?? [],
      linkedin_url: parsed.data.linkedinUrl || null,
      website_url: parsed.data.websiteUrl || null,
      preferred_language: parsed.data.preferredLanguage,
    })
    .eq("user_id", user.id);

  if (error) return { error: "Couldn't save your profile. Please try again." };

  revalidatePath("/dashboard/profile");
  return { success: "Profile updated." };
}
