import { Nav } from "@/components/udaan/Nav";
import { Footer } from "@/components/udaan/StaticSections";
import { ContactForm } from "./ContactForm";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="bg-parchment min-h-screen">
      <Nav />
      <section className="py-14 md:py-20">
        <div className="max-w-lg mx-auto px-5 md:px-8">
          <h1 className="font-display text-indigo text-3xl md:text-4xl mb-2">Get in touch</h1>
          <p className="font-body text-ink-soft mb-8">Questions, partnership ideas, or just want to say hello.</p>
          <ContactForm />
        </div>
      </section>
      <Footer />
    </div>
  );
}
