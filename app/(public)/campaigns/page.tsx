import type { Metadata } from "next";
import { Nav } from "@/components/udaan/Nav";
import { Footer } from "@/components/udaan/StaticSections";
import { FundraisingSection } from "@/components/udaan/FundraisingSection";

export const metadata: Metadata = { title: "Campaigns" };

export default function CampaignsPage() {
  return (
    <div className="bg-parchment min-h-screen">
      <Nav />
      <FundraisingSection />
      <Footer />
    </div>
  );
}
