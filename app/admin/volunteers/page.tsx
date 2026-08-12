import { createClient } from "@/lib/supabase/server";
import { AssignRoleForm } from "./AssignRoleForm";

export default async function AdminVolunteersPage() {
  const supabase = createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, full_name, email, city, state, status")
    .order("created_at", { ascending: false });

  const { data: allRoles } = await supabase.from("user_roles").select("user_id, role");

  const rolesByUser = new Map<string, string[]>();
  (allRoles ?? []).forEach((r) => {
    rolesByUser.set(r.user_id, [...(rolesByUser.get(r.user_id) ?? []), r.role]);
  });

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Volunteers</h1>
      <p className="font-body text-ink-soft text-sm mb-8">
        Role changes here write directly to <code>user_roles</code>, which is the only table that controls
        access — never a flag on the profile itself.
      </p>

      <div className="flex flex-col gap-3">
        {(profiles ?? []).map((p) => (
          <div key={p.user_id} className="rounded-2xl border border-sandstone bg-white p-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-display text-indigo text-base">{p.full_name}</div>
              <div className="font-body text-ink-soft text-xs mt-0.5">
                {p.email} · {p.city ?? "—"}, {p.state ?? "—"} · {p.status}
              </div>
              <div className="font-body text-ink-soft text-xs mt-1">
                Roles: {(rolesByUser.get(p.user_id) ?? ["volunteer"]).join(", ")}
              </div>
            </div>
            <AssignRoleForm userId={p.user_id} />
          </div>
        ))}
      </div>
    </div>
  );
}
