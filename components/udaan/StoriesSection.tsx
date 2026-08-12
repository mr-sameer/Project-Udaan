import Link from "next/link";
import { getPublishedStories } from "@/lib/queries/public";

export async function StoriesSection() {
  const stories = await getPublishedStories();

  return (
    <section className="py-12 md:py-14 bg-parchment">
      <div className="max-w-2xl mx-auto px-5 md:px-8 text-center">
        <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold mb-4 text-brass justify-center">
          <span className="w-[22px] h-[1.5px] bg-brass inline-block" />
          Beyond the Numbers
        </div>
        <h2 className="font-display text-indigo text-3xl md:text-4xl">Behind every number is a person.</h2>

        {stories.length === 0 ? (
          <div className="mt-8 py-10 px-8 rounded-2xl bg-parchment-soft border border-dashed border-sandstone">
            <p className="font-display text-kesari text-xl md:text-2xl">Our first stories are still being written.</p>
            <p className="font-body text-ink-soft mt-3 text-sm max-w-sm mx-auto leading-relaxed">
              The first story will appear here — with consent — after the first real field project.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 text-left">
            {stories.map((s) => (
              <Link
                key={s.id}
                href={`/stories/${s.slug}`}
                className="p-5 rounded-2xl bg-white border border-sandstone hover:border-kesari transition-colors"
              >
                <h3 className="font-display text-indigo text-lg">{s.title}</h3>
                {s.excerpt && <p className="font-body text-ink-soft text-sm mt-1">{s.excerpt}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
