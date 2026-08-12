import type { Metadata } from "next";
import { Nav } from "@/components/udaan/Nav";
import { Footer } from "@/components/udaan/StaticSections";
import { CurrentProjectsSection } from "@/components/udaan/CurrentProjectsSection";

export const metadata: Metadata = {
  title: "Our Work",
  description: "The projects Project Udaan is building right now — presented plainly, only with what's actually true today.",
};

export default function ProjectsPage() {
  return (
    <div className="bg-parchment min-h-screen">
      <Nav />
      <CurrentProjectsSection />
      <Footer />
    </div>
  );
}
