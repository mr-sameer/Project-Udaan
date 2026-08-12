import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/udaan/Nav";
import { Footer } from "@/components/udaan/StaticSections";
import { getStoryBySlug } from "@/lib/queries/public";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const story = await getStoryBySlug(params.slug);
  if (!story) return { title: "Story not found" };
  return { title: story.title, description: story.excerpt ?? undefined };
}

export default async function StoryDetailPage({ params }: { params: { slug: string } }) {
  const story = await getStoryBySlug(params.slug);
  if (!story) notFound();

  return (
    <div className="bg-parchment min-h-screen">
      <Nav />
      <article className="py-14 md:py-20">
        <div className="max-w-2xl mx-auto px-5 md:px-8">
          <h1 className="font-display text-indigo text-3xl md:text-4xl mb-4">{story.title}</h1>
          {story.excerpt && <p className="font-body text-ink-soft text-lg mb-6">{story.excerpt}</p>}
          {story.content && (
            <div className="font-body text-ink-soft text-base leading-relaxed whitespace-pre-line">
              {story.content}
            </div>
          )}
        </div>
      </article>
      <Footer />
    </div>
  );
}
