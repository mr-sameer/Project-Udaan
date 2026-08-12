import { requireUser } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { TaskStatusButtons } from "./TaskStatusButtons";

export default async function MyTasksPage() {
  const user = await requireUser();
  const supabase = createClient();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*, projects(name)")
    .eq("assigned_to", user.id)
    .order("due_date", { ascending: true, nullsFirst: false });

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">My Tasks</h1>
      <p className="font-body text-ink-soft text-sm mb-8">You can move your own tasks between To Do, In Progress and Completed.</p>

      {(tasks ?? []).length === 0 ? (
        <p className="font-body text-ink-soft text-sm">No tasks assigned yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {(tasks ?? []).map((t: any) => (
            <div key={t.id} className="rounded-xl border border-sandstone bg-white p-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="font-body text-ink text-sm font-semibold">{t.title}</div>
                <div className="font-body text-ink-soft text-xs mt-1">
                  {t.projects?.name} · {t.priority} priority{t.due_date ? ` · due ${t.due_date}` : ""}
                </div>
              </div>
              <TaskStatusButtons taskId={t.id} currentStatus={t.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
