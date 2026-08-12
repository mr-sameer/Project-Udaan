import Link from "next/link";
import { requireUser } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";

export default async function CertificatesPage() {
  const user = await requireUser();
  const supabase = createClient();

  const { data: certificates } = await supabase
    .from("certificates")
    .select("*, projects(name)")
    .eq("volunteer_id", user.id)
    .order("issue_date", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Certificates</h1>
      <p className="font-body text-ink-soft text-sm mb-8">
        Issued by staff once your verified hours on a project reach the certificate threshold.
      </p>

      {(certificates ?? []).length === 0 ? (
        <p className="font-body text-ink-soft text-sm">No certificates issued yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {(certificates ?? []).map((c: any) => (
            <div key={c.id} className="rounded-2xl border border-sandstone bg-white p-6">
              <div className="font-display text-indigo text-lg">{c.projects?.name ?? "Project Udaan"}</div>
              <div className="font-body text-ink-soft text-sm mt-1">{c.hours} hours · issued {c.issue_date}</div>
              <Link
                href={`/verify/${c.certificate_code}`}
                className="inline-block mt-3 text-xs font-bold text-kesari"
              >
                {c.certificate_code} — view public verification →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
