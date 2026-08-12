import type { Metadata } from "next";
import { Nav } from "@/components/udaan/Nav";
import { Footer } from "@/components/udaan/StaticSections";
import { StoriesSection } from "@/components/udaan/StoriesSection";

export const metadata: Metadata = {
  title: "Stories",
  description: "Real, consented stories from Project Udaan — published only once they exist.",
};

export default function StoriesPage() {
  return (
    <div className="bg-parchment min-h-screen">
      <Nav />
      <StoriesSection />
      <Footer />
    </div>
  );
}
