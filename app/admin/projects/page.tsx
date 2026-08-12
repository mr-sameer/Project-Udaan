import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createProject } from "@/lib/queries/admin";
import { ProjectStatusSelect } from "./ProjectStatusSelect";

export default async function AdminProjectsPage() {
  const supabase = createClient();
  const { data: projects } = await supabase.from("projects").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Projects</h1>
      <p className="font-body text-ink-soft text-sm mb-8">
        Publishing a project here (status active/preparing + visibility public) is the only thing that makes it
        appear on the homepage and <code>/projects</code>. Nothing is duplicated by hand.
      </p>

      <details className="mb-8 rounded-2xl border border-sandstone bg-white p-6">
        <summary className="font-display text-indigo text-lg cursor-pointer">+ New Project</summary>
        <form action={createProject} className="grid sm:grid-cols-2 gap-4 mt-5">
          <input name="name" placeholder="Project name" required className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2" />
          <input name="slug" placeholder="url-slug" required pattern="[a-z0-9\-]+" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <input name="focusArea" placeholder="Focus area" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <textarea name="shortDescription" placeholder="Short description" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2" rows={2} />
          <textarea name="description" placeholder="Full description" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2" rows={4} />
          <select name="status" defaultValue="planning" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm">
            {["planning", "preparing", "active", "completed", "paused", "cancelled"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select name="visibility" defaultValue="private" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm">
            {["private", "unlisted", "public"].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <input name="location" placeholder="Location" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <input name="targetBeneficiaries" type="number" placeholder="Target beneficiaries" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <input name="fundingGoal" type="number" placeholder="Funding goal (₹)" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <input name="startDate" type="date" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <button type="submit" className="sm:col-span-2 rounded-full bg-kesari text-parchment font-bold text-sm py-3">
            Create Project
          </button>
        </form>
      </details>

      <div className="flex flex-col gap-3">
        {(projects ?? []).map((p) => (
          <div key={p.id} className="rounded-2xl border border-sandstone bg-white p-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <Link href={`/admin/projects/${p.id}`} className="font-display text-indigo text-base hover:text-kesari">
                {p.name}
              </Link>
              <div className="font-body text-ink-soft text-xs mt-0.5">/{p.slug} · {p.visibility}</div>
            </div>
            <ProjectStatusSelect projectId={p.id} currentStatus={p.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
