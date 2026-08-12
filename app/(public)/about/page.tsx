import type { Metadata } from "next";
import { Nav } from "@/components/udaan/Nav";
import { Footer } from "@/components/udaan/StaticSections";
import { getOrganizationSettings } from "@/lib/queries/public";

export const metadata: Metadata = {
  title: "About",
  description: "Why Project Udaan exists, and where it stands today.",
};

export default async function AboutPage() {
  const settings = await getOrganizationSettings();

  return (
    <div className="bg-parchment min-h-screen">
      <Nav />
      <section className="py-14 md:py-20">
        <div className="max-w-2xl mx-auto px-5 md:px-8">
          <h1 className="font-display text-indigo text-3xl md:text-4xl mb-6">
            {settings?.org_name ?? "Project Udaan"}
          </h1>

          {settings?.mission && (
            <>
              <h2 className="font-display text-indigo text-lg mb-2">Mission</h2>
              <p className="font-body text-ink-soft leading-relaxed mb-8">{settings.mission}</p>
            </>
          )}

          {settings?.about_text ? (
            <p className="font-body text-ink-soft leading-relaxed whitespace-pre-line">{settings.about_text}</p>
          ) : (
            <p className="font-body text-ink-soft leading-relaxed">
              Project Udaan is an India-focused initiative helping close the gap between talent and opportunity
              through education, digital skills, mentorship and access to opportunity. We're early — this page
              will grow as we do.
            </p>
          )}

          <div className="mt-10 rounded-2xl border border-sandstone bg-white p-6 grid sm:grid-cols-2 gap-4 text-sm font-body text-ink-soft">
            <div>
              <span className="text-[10px] font-bold uppercase text-brass block mb-1">Registration</span>
              {settings?.registration_number || "Pending"}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-brass block mb-1">PAN</span>
              {settings?.pan || "Pending"}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-brass block mb-1">80G status</span>
              {settings?.status_80g ?? "Pending"}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-brass block mb-1">FCRA status</span>
              {settings?.status_fcra ?? "Pending"}
            </div>
            {settings?.contact_email && (
              <div>
                <span className="text-[10px] font-bold uppercase text-brass block mb-1">Contact</span>
                {settings.contact_email}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
