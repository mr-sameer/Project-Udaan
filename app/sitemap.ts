import type { MetadataRoute } from "next";
import { getPublicProjects, getActiveCampaigns, getPublishedStories } from "@/lib/queries/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const staticRoutes = [
    "", "/why-udaan", "/projects", "/impact", "/stories", "/about",
    "/campaigns", "/donate", "/volunteer/apply", "/contact", "/verify",
  ].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));

  const [projects, campaigns, stories] = await Promise.all([
    getPublicProjects().catch(() => []),
    getActiveCampaigns().catch(() => []),
    getPublishedStories().catch(() => []),
  ]);

  const dynamicRoutes = [
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: new Date(p.updated_at) })),
    ...campaigns.map((c: any) => ({ url: `${base}/campaigns/${c.slug}`, lastModified: new Date(c.updated_at) })),
    ...stories.map((s) => ({ url: `${base}/stories/${s.slug}`, lastModified: new Date(s.updated_at) })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
