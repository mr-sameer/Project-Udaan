import { requireUser } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";

export default async function MyProjectsPage() {
  const user = await requireUser();
  const supabase = createClient();

  const { data: memberships } = await supabase
    .from("project_members")
    .select("role, projects(id, name, status, start_date, short_description)")
    .eq("user_id", user.id);

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">My Projects</h1>
      <p className="font-body text-ink-soft text-sm mb-8">Only projects you've been assigned to appear here.</p>

      {(memberships ?? []).length === 0 ? (
        <p className="font-body text-ink-soft text-sm">
          You haven't been assigned to a project yet. Once a coordinator assigns you, it'll show up here.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {(memberships ?? []).map((m: any, i) => (
            <div key={i} className="rounded-2xl border border-sandstone bg-white p-6">
              <span className="text-[10px] font-bold uppercase text-kesari">{m.role}</span>
              <h3 className="font-display text-indigo text-lg mt-1">{m.projects?.name}</h3>
              <p className="font-body text-ink-soft text-sm mt-1">{m.projects?.short_description}</p>
              <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-brass/15 text-brass mt-3 inline-block">
                {m.projects?.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
