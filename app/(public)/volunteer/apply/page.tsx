import { Nav } from "@/components/udaan/Nav";
import { Footer } from "@/components/udaan/StaticSections";
import { VolunteerApplyForm } from "./VolunteerApplyForm";

export const metadata = { title: "Give Your Time" };

export default function VolunteerApplyPage() {
  return (
    <div className="bg-parchment min-h-screen">
      <Nav />
      <section className="py-14 md:py-20">
        <div className="max-w-2xl mx-auto px-5 md:px-8">
          <h1 className="font-display text-indigo text-3xl md:text-4xl mb-2">Give Your Time</h1>
          <VolunteerApplyForm />
        </div>
      </section>
      <Footer />
    </div>
  );
}
