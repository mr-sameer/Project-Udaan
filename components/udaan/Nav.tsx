import { createClient } from "@/lib/supabase/server";
import { ADMIN_ROLES, type AppRole } from "@/lib/permissions/roles";
import { NavClient } from "./NavClient";

export async function Nav() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let roles: AppRole[] = [];
  let unreadCount = 0;

  if (user) {
    const [{ data: roleRows }, { count }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", user.id),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false),
    ]);
    roles = (roleRows ?? []).map((r) => r.role as AppRole);
    unreadCount = count ?? 0;
  }

  const isAdmin = roles.some((r) => ADMIN_ROLES.includes(r)) || roles.includes("coordinator");

  return (
    <NavClient
      isAuthenticated={!!user}
      isAdmin={isAdmin}
      unreadCount={unreadCount}
      fullName={user?.user_metadata?.full_name as string | undefined}
    />
  );
}
