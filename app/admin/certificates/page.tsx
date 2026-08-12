import { createClient } from "@/lib/supabase/server";
import { issueCertificate } from "@/lib/queries/certificates";

export default async function AdminCertificatesPage() {
  const supabase = createClient();
  const [{ data: certificates }, { data: projects }] = await Promise.all([
    supabase.from("certificates").select("*, profiles!certificates_volunteer_id_fkey(full_name)").order("created_at", { ascending: false }),
    supabase.from("projects").select("id, name"),
  ]);

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Certificates</h1>
      <p className="font-body text-ink-soft text-sm mb-8">
        Certificates are immutable once issued — there's no edit action, only issuance, matching the "no
        update policy" rule in RLS.
      </p>

      <details className="mb-8 rounded-2xl border border-sandstone bg-white p-6">
        <summary className="font-display text-indigo text-lg cursor-pointer">+ Issue Certificate</summary>
        <form action={issueCertificate} className="grid sm:grid-cols-2 gap-4 mt-5">
          <input name="volunteerId" placeholder="Volunteer user UUID" required className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2" />
          <select name="projectId" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm">
            <option value="">— No linked project —</option>
            {(projects ?? []).map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input name="hours" type="number" placeholder="Hours" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
          <button type="submit" className="sm:col-span-2 rounded-full bg-kesari text-parchment font-bold text-sm py-3">
            Issue Certificate
          </button>
        </form>
      </details>

      <div className="flex flex-col gap-3">
        {(certificates ?? []).map((c: any) => (
          <div key={c.id} className="rounded-2xl border border-sandstone bg-white p-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-display text-indigo text-base">{c.profiles?.full_name}</div>
              <div className="font-body text-ink-soft text-xs mt-0.5">{c.certificate_code} · {c.hours ?? "—"} hrs · {c.issue_date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
