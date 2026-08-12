import type { Metadata } from "next";
import { Nav } from "@/components/udaan/Nav";
import { WhyWeExist } from "@/components/udaan/StaticSections";
import { Footer } from "@/components/udaan/StaticSections";

export const metadata: Metadata = {
  title: "Why Udaan Exists",
  description: "A talented mind should not have to wait for opportunity.",
};

export default function WhyUdaanPage() {
  return (
    <div className="bg-parchment min-h-screen">
      <Nav />
      <WhyWeExist />
      <Footer />
    </div>
  );
}
