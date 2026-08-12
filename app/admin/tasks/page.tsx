import { createClient } from "@/lib/supabase/server";
import { createTask } from "@/lib/queries/tasks";

export default async function AdminTasksPage() {
  const supabase = createClient();
  const [{ data: tasks }, { data: projects }] = await Promise.all([
    supabase.from("tasks").select("*, projects(name), assignee:profiles!tasks_assigned_to_fkey(full_name)").order("created_at", { ascending: false }),
    supabase.from("projects").select("id, name"),
  ]);

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Tasks</h1>
      <p className="font-body text-ink-soft text-sm mb-8">
        Volunteers can move their own tasks between To Do / In Progress / Completed, but only staff can create,
        reassign, or delete a task.
      </p>

      <details className="mb-8 rounded-2xl border border-sandstone bg-white p-6">
        <summary className="font-display text-indigo text-lg cursor-pointer">+ New Task</summary>
        <form action={createTask} className="grid sm:grid-cols-2 gap-4 mt-5">
          <select name="projectId" required className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2">
            <option value="">Select project…</option>
            {(projects ?? []).map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input name="title" placeholder="Task title" required className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2" />
          <textarea name="description" placeholder="Description" rows={2} className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2" />
          <input name="assignedTo" placeholder="Assignee user UUID" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <select name="priority" defaultValue="medium" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm">
            {["low", "medium", "high", "urgent"].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <input name="dueDate" type="date" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <button type="submit" className="sm:col-span-2 rounded-full bg-kesari text-parchment font-bold text-sm py-3">
            Create Task
          </button>
        </form>
        <p className="font-body text-ink-soft text-xs mt-3">
          UUID-entry is a placeholder for a proper volunteer picker — swap in a searchable select against
          <code> profiles</code> once you're building this out further.
        </p>
      </details>

      <div className="flex flex-col gap-3">
        {(tasks ?? []).map((t: any) => (
          <div key={t.id} className="rounded-2xl border border-sandstone bg-white p-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-display text-indigo text-base">{t.title}</div>
              <div className="font-body text-ink-soft text-xs mt-0.5">
                {t.projects?.name} · {t.assignee?.full_name ?? "Unassigned"} · {t.priority}
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-brass/15 text-brass">
              {t.status.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
