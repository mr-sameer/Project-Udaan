import type { Metadata } from "next";
import { Nav } from "@/components/udaan/Nav";
import { Footer } from "@/components/udaan/StaticSections";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Verify a Certificate" };

export default async function VerifyCertificatePage({ params }: { params: { certificateId: string } }) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("verify_certificate", { p_code: params.certificateId });
  const result = data?.[0];

  return (
    <div className="bg-parchment min-h-screen">
      <Nav />
      <section className="py-14 md:py-20">
        <div className="max-w-md mx-auto px-5 md:px-8 text-center">
          <h1 className="font-display text-indigo text-2xl md:text-3xl mb-6">Certificate Verification</h1>

          {error || !result ? (
            <div className="rounded-2xl border border-dashed border-sandstone bg-white p-8">
              <p className="font-display text-kesari text-lg">No certificate found for this code.</p>
              <p className="font-body text-ink-soft text-sm mt-2">Double-check the code and try again.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-sandstone bg-white p-8 text-left">
              <div className="text-[10px] font-bold uppercase text-brass">Certificate Code</div>
              <div className="font-display text-indigo text-lg mb-4">{result.certificate_code}</div>

              <div className="text-[10px] font-bold uppercase text-brass">Issued To</div>
              <div className="font-body text-ink text-sm mb-4">{result.volunteer_name}</div>

              {result.project_name && (
                <>
                  <div className="text-[10px] font-bold uppercase text-brass">Project</div>
                  <div className="font-body text-ink text-sm mb-4">{result.project_name}</div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-bold uppercase text-brass">Hours</div>
                  <div className="font-body text-ink text-sm">{result.hours ?? "—"}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-brass">Issue Date</div>
                  <div className="font-body text-ink text-sm">{result.issue_date}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
