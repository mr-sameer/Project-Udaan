import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/udaan/Nav";
import { Footer } from "@/components/udaan/StaticSections";
import { getProjectBySlug, getProjectUpdates } from "@/lib/queries/public";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.name,
    description: project.short_description ?? undefined,
    openGraph: { title: project.name, description: project.short_description ?? undefined },
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const updates = await getProjectUpdates(project.id);

  return (
    <div className="bg-parchment min-h-screen">
      <Nav />
      <section className="py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <span className="text-xs font-bold uppercase text-kesari">{project.focus_area}</span>
          <h1 className="font-display text-indigo text-3xl md:text-4xl mt-2 mb-4">{project.name}</h1>
          {project.description && (
            <p className="font-body text-ink-soft text-base leading-relaxed">{project.description}</p>
          )}

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {project.target_beneficiaries != null && (
              <div className="rounded-xl border border-sandstone bg-white p-4">
                <div className="font-display text-indigo text-xl">{project.target_beneficiaries}</div>
                <div className="font-body text-ink-soft text-xs mt-1">Target beneficiaries</div>
              </div>
            )}
            {project.funding_goal != null && (
              <div className="rounded-xl border border-sandstone bg-white p-4">
                <div className="font-display text-indigo text-xl">₹{Number(project.funding_goal).toLocaleString("en-IN")}</div>
                <div className="font-body text-ink-soft text-xs mt-1">Funding goal</div>
              </div>
            )}
          </div>

          <h2 className="font-display text-indigo text-xl mt-12 mb-4">Updates</h2>
          {updates.length === 0 ? (
            <p className="font-body text-ink-soft text-sm">No updates published yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {updates.map((u) => (
                <div key={u.id} className="rounded-xl border border-sandstone bg-white p-5">
                  <h3 className="font-display text-indigo text-base">{u.title}</h3>
                  {u.body && <p className="font-body text-ink-soft text-sm mt-1">{u.body}</p>}
                  <p className="font-body text-ink-soft text-[10px] mt-2">{new Date(u.created_at).toLocaleDateString("en-IN")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
