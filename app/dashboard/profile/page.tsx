import { requireUser } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const user = await requireUser();
  const supabase = createClient();
  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Your Profile</h1>
      <p className="font-body text-ink-soft text-sm mb-8">
        Only what's useful for volunteering and mentorship — we don't collect anything beyond this.
      </p>
      <ProfileForm profile={profile} />
    </div>
  );
}
