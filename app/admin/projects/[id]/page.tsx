import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AssignMemberForm } from "./AssignMemberForm";

export default async function AdminProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: project }, { data: members }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", params.id).maybeSingle(),
    supabase
      .from("project_members")
      .select("id, role, user_id, profiles!project_members_user_id_fkey(full_name, email)")
      .eq("project_id", params.id),
  ]);

  if (!project) notFound();

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">{project.name}</h1>
      <p className="font-body text-ink-soft text-sm mb-8">/{project.slug} · {project.status} · {project.visibility}</p>

      <h2 className="font-display text-indigo text-lg mb-4">Team</h2>
      <div className="flex flex-col gap-2 mb-8">
        {(members ?? []).length === 0 && <p className="font-body text-ink-soft text-sm">No members assigned yet.</p>}
        {(members ?? []).map((m: any) => (
          <div key={m.id} className="rounded-xl border border-sandstone bg-white p-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-body text-ink text-sm font-semibold">{m.profiles?.full_name}</div>
              <div className="font-body text-ink-soft text-xs">{m.profiles?.email}</div>
            </div>
            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-brass/15 text-brass">
              {m.role.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>

      <h2 className="font-display text-indigo text-lg mb-4">Assign a Member</h2>
      <AssignMemberForm projectId={project.id} />
    </div>
  );
}
