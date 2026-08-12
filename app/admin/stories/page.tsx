import { createClient } from "@/lib/supabase/server";
import { createStory } from "@/lib/queries/admin";

export default async function AdminStoriesPage() {
  const supabase = createClient();
  const [{ data: stories }, { data: projects }] = await Promise.all([
    supabase.from("stories").select("*").order("created_at", { ascending: false }),
    supabase.from("projects").select("id, name"),
  ]);

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Stories</h1>
      <p className="font-body text-ink-soft text-sm mb-8">
        Only <code>published</code> stories ever reach the public site. Nothing here should be written until a
        real, consented story exists.
      </p>

      <details className="mb-8 rounded-2xl border border-sandstone bg-white p-6">
        <summary className="font-display text-indigo text-lg cursor-pointer">+ New Story</summary>
        <form action={createStory} className="grid gap-4 mt-5">
          <input name="title" placeholder="Title" required className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <input name="slug" placeholder="url-slug" required pattern="[a-z0-9\-]+" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <input name="excerpt" placeholder="Short excerpt" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <textarea name="content" placeholder="Full story" rows={6} className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <select name="projectId" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm">
            <option value="">— No linked project —</option>
            {(projects ?? []).map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select name="status" defaultValue="draft" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm">
            {["draft", "review", "published", "archived"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button type="submit" className="rounded-full bg-kesari text-parchment font-bold text-sm py-3">
            Save Story
          </button>
        </form>
      </details>

      <div className="flex flex-col gap-3">
        {(stories ?? []).map((s) => (
          <div key={s.id} className="rounded-2xl border border-sandstone bg-white p-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="font-display text-indigo text-base">{s.title}</div>
            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-brass/15 text-brass">{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
