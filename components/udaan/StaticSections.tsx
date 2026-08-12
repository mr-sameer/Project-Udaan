import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-end overflow-hidden bg-indigo-deep">
      <img
        src="https://images.unsplash.com/photo-1743834147172-37c12011b321?fm=jpg&q=70&w=1800&auto=format&fit=crop"
        alt="Student learning in a computer classroom"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,39,51,0.55) 0%, rgba(15,39,51,0.35) 40%, rgba(15,39,51,0.94) 100%)",
        }}
      />
      <div className="max-w-6xl mx-auto px-5 md:px-8 pb-14 md:pb-20 pt-32 relative w-full">
        <span className="text-xs font-bold uppercase text-sandstone tracking-[0.22em]">Project Udaan</span>
        <h1 className="font-display text-parchment leading-[1.08] text-4xl md:text-6xl mt-3 max-w-3xl">
          What one generation learns, the next can build upon.
        </h1>
        <p className="font-display text-kesari mt-4 text-lg md:text-xl">From Knowledge to Opportunity.</p>
        <p className="font-body text-sandstone mt-5 text-base md:text-lg max-w-xl leading-relaxed">
          India has never been short of talent. But talent needs access, guidance and opportunity to become a future.
        </p>
        <p className="font-body text-sandstone mt-2 text-base md:text-lg max-w-xl leading-relaxed font-semibold">
          We help turn curiosity into skills, skills into confidence, and learning into opportunity.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
          <Link
            href="/projects"
            className="px-6 py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 bg-kesari text-parchment transition-transform hover:scale-[1.03]"
          >
            See What We're Building <ArrowRight size={16} />
          </Link>
          <Link
            href="/volunteer/apply"
            className="px-6 py-3.5 rounded-full text-sm font-bold border border-sandstone text-parchment text-center"
          >
            Build With Us
          </Link>
        </div>
      </div>
    </section>
  );
}

export function WhyWeExist() {
  return (
    <section className="py-12 md:py-16 bg-parchment">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold mb-4 text-brass">
          <span className="w-[22px] h-[1.5px] bg-brass inline-block" />
          Why We Exist
        </div>
        <h2 className="font-display text-indigo leading-[1.15] text-3xl md:text-[2.6rem] max-w-2xl">
          A talented mind should not have to wait for opportunity.
        </h2>
        <div className="font-body text-ink-soft mt-8 text-base md:text-lg leading-relaxed max-w-2xl space-y-3">
          <p>Somewhere, a student is asking a question.</p>
          <p>Somewhere, a young person is trying to learn a skill without knowing where to begin.</p>
          <p>
            Somewhere, a capable person has the ability to go further — but lacks a mentor, a resource, a
            connection, or simply someone who says:
          </p>
          <p className="font-display text-kesari text-xl md:text-2xl pt-1">"Keep going."</p>
          <p>Udaan exists to help close that distance.</p>
        </div>
        <p className="font-display text-indigo leading-[1.25] mt-9 text-2xl md:text-4xl max-w-2xl">
          Talent is everywhere. Opportunity isn't.
        </p>
      </div>
    </section>
  );
}

export function DayZero() {
  return (
    <section className="py-16 md:py-20 bg-indigo-deep">
      <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
        <h2 className="font-display text-parchment leading-[1.2] text-3xl md:text-5xl mt-6">
          Every institution begins before anyone believes in it.
        </h2>
        <p className="font-display text-kesari text-2xl md:text-3xl mt-6">We are at Day 0.</p>
        <p className="font-body text-sandstone mt-6 text-base leading-relaxed max-w-lg mx-auto">
          No inflated numbers. No invented impact. No claims of changing millions of lives. Just a mission, a
          plan, and the willingness to begin.
        </p>
      </div>
    </section>
  );
}

export function Closing() {
  return (
    <section className="relative py-14 md:py-20 text-center overflow-hidden bg-indigo-deep">
      <div className="max-w-2xl mx-auto px-5 relative">
        <h2 className="font-display text-parchment leading-[1.2] text-3xl md:text-5xl">
          One learner can change a family.
        </h2>
        <div className="font-body text-sandstone mt-4 text-base md:text-lg leading-relaxed space-y-1">
          <p>One opportunity can change a life.</p>
          <p>One person can create that opportunity.</p>
          <p className="font-display text-kesari text-xl md:text-2xl pt-2">Maybe that person is you.</p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 mt-8">
          <Link href="/volunteer/apply" className="px-6 py-3.5 rounded-full text-sm font-bold bg-kesari text-parchment">
            Start Your Udaan
          </Link>
          <Link href="/donate" className="px-6 py-3.5 rounded-full text-sm font-bold border border-sandstone text-parchment">
            Support Someone's Udaan
          </Link>
          <Link href="/about" className="px-6 py-3.5 rounded-full text-sm font-bold border border-sandstone text-parchment">
            Build With Us
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const cols = [
    { h: "Explore", items: [{ l: "Projects", href: "/projects" }, { l: "Impact", href: "/impact" }, { l: "Stories", href: "/stories" }] },
    { h: "Get Involved", items: [{ l: "Donate", href: "/donate" }, { l: "Volunteer", href: "/volunteer/apply" }, { l: "Contact", href: "/contact" }] },
    { h: "Organization", items: [{ l: "Why Udaan Exists", href: "/why-udaan" }, { l: "About", href: "/about" }] },
    { h: "Legal", items: [{ l: "Verify a Certificate", href: "/verify" }] },
  ];
  return (
    <footer className="pt-12 pb-8 bg-indigo-deep">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <p className="font-display text-parchment text-xl md:text-2xl max-w-lg mb-10">
          Knowledge travels further when we carry it forward.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-10 pb-10 border-b border-white/10">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-kesari">
                <span className="font-display text-parchment text-[15px]">उ</span>
              </div>
              <span className="font-display text-parchment text-lg">Project Udaan</span>
            </div>
            <p className="font-body text-sandstone text-sm leading-relaxed max-w-xs">
              From knowledge to opportunity — an India-focused initiative, built in public.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <div className="font-body text-parchment text-xs font-bold uppercase tracking-wide mb-3">{c.h}</div>
              <div className="space-y-2">
                {c.items.map((i) => (
                  <Link key={i.href} href={i.href} className="font-body text-sandstone block text-sm hover:opacity-80">
                    {i.l}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="font-body text-sandstone text-xs pt-6 flex flex-col sm:flex-row sm:justify-between gap-2">
          <span>© {new Date().getFullYear()} Project Udaan. [Legal entity name — to be added upon registration]</span>
          <span>[PAN] · [80G — pending] · [FCRA — not applicable / pending]</span>
        </div>
      </div>
    </footer>
  );
}

export function MobileBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden z-40 flex bg-indigo-deep border-t border-white/10">
      <Link href="/donate" className="flex-1 flex flex-col items-center gap-1 py-2.5">
        <span className="text-[11px] font-semibold text-parchment">Support</span>
      </Link>
      <Link href="/volunteer/apply" className="flex-1 flex flex-col items-center gap-1 py-2.5">
        <span className="text-[11px] font-semibold text-parchment">Give Time</span>
      </Link>
      <Link href="/projects" className="flex-1 flex flex-col items-center gap-1 py-2.5">
        <span className="text-[11px] font-semibold text-parchment">Explore</span>
      </Link>
    </div>
  );
}
