import type { Metadata } from "next";
import { Nav } from "@/components/udaan/Nav";
import { Footer } from "@/components/udaan/StaticSections";
import { VerifyLookupForm } from "./VerifyLookupForm";

export const metadata: Metadata = { title: "Verify a Certificate" };

export default function VerifyLookupPage() {
  return (
    <div className="bg-parchment min-h-screen">
      <Nav />
      <section className="py-14 md:py-20">
        <div className="max-w-md mx-auto px-5 md:px-8 text-center">
          <h1 className="font-display text-indigo text-2xl md:text-3xl mb-2">Verify a Certificate</h1>
          <p className="font-body text-ink-soft mb-8">Enter the certificate code shown on the certificate.</p>
          <VerifyLookupForm />
        </div>
      </section>
      <Footer />
    </div>
  );
}
