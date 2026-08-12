import { createClient } from "@/lib/supabase/server";

export default async function AdminContactPage() {
  const supabase = createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Contact Messages</h1>
      <p className="font-body text-ink-soft text-sm mb-8">Only staff can read these — the form itself never returns a message list to the public.</p>

      <div className="flex flex-col gap-3">
        {(messages ?? []).length === 0 && <p className="font-body text-ink-soft text-sm">No messages yet.</p>}
        {(messages ?? []).map((m) => (
          <div key={m.id} className="rounded-2xl border border-sandstone bg-white p-5">
            <div className="font-display text-indigo text-base">{m.name} — {m.subject || "No subject"}</div>
            <div className="font-body text-ink-soft text-xs mt-0.5">{m.email} · {new Date(m.created_at).toLocaleString("en-IN")}</div>
            <p className="font-body text-ink-soft text-sm mt-2">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
