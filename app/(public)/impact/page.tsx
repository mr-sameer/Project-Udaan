import type { Metadata } from "next";
import { Nav } from "@/components/udaan/Nav";
import { Footer } from "@/components/udaan/StaticSections";
import { ImpactSection } from "@/components/udaan/ImpactSection";

export const metadata: Metadata = {
  title: "Impact",
  description: "Only admin-verified numbers appear here. Nothing is estimated.",
};

export default function ImpactPage() {
  return (
    <div className="bg-parchment min-h-screen">
      <Nav />
      <ImpactSection />
      <Footer />
    </div>
  );
}
