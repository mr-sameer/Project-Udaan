import { getVerifiedImpact } from "@/lib/queries/public";

export async function ImpactSection() {
  const metrics = await getVerifiedImpact();

  return (
    <section className="py-12 md:py-16 bg-parchment-soft">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold mb-4 text-brass">
          <span className="w-[22px] h-[1.5px] bg-brass inline-block" />
          Verified Impact
        </div>
        <h2 className="font-display text-indigo text-3xl md:text-4xl mb-4 max-w-xl">What's actually changed.</h2>

        {metrics.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sandstone bg-white py-10 px-8 text-center max-w-2xl">
            <p className="font-display text-kesari text-xl md:text-2xl">
              No impact numbers yet — we are building the first project.
            </p>
            <p className="font-body text-ink-soft text-sm mt-2">
              A number appears here only after an admin verifies it against evidence. Nothing is estimated.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((m) => (
              <div key={m.id}>
                <div className="font-display text-indigo text-2xl md:text-3xl">
                  {Number(m.actual).toLocaleString("en-IN")}
                  <span className="text-sm ml-1 font-body text-ink-soft">{m.unit}</span>
                </div>
                <div className="font-body text-ink-soft mt-1.5 text-xs leading-snug">
                  {m.label} · {m.project_name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
