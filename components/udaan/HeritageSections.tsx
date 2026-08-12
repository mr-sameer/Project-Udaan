import Link from "next/link";
import { ArrowRight, Heart, HandHeart, Users, Building2 } from "lucide-react";

export function GenerationsChain() {
  const steps = [
    { role: "The Teacher", desc: "Passes knowledge to one student." },
    { role: "The Apprentice", desc: "A craftsperson teaches a skill." },
    { role: "The Student", desc: "Receives access to education." },
    { role: "The Mentor", desc: "Helps someone navigate a career." },
    { role: "The Opportunity", desc: "That person helps someone else." },
  ];
  const beats = [
    "I don't understand.",
    "Let me learn.",
    "Can someone show me?",
    "I can build this.",
    "I can do more.",
    "I got my opportunity.",
  ];

  return (
    <section className="py-12 md:py-16 bg-indigo-deep">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold mb-4 text-brass">
          <span className="w-[22px] h-[1.5px] bg-brass inline-block" />
          From One Generation to the Next
        </div>
        <h2 className="font-display text-parchment text-3xl md:text-4xl mb-3 max-w-xl">
          Every generation leaves something behind.
        </h2>
        <p className="font-body text-sandstone text-base leading-relaxed max-w-xl mb-9">
          India has always carried knowledge forward — and for each person who receives it, the same journey repeats.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-6">
          {steps.map((s, i) => (
            <div key={s.role} className="flex flex-col items-start gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold font-display bg-kesari/20 text-kesari">
                {i + 1}
              </div>
              <div>
                <h4 className="font-display text-parchment text-base mb-1">{s.role}</h4>
                <p className="font-body text-sandstone text-xs leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="my-9 flex justify-center">
          <span className="w-px h-10 bg-brass/40 inline-block" />
        </div>

        <div className="pt-9 border-t border-white/10">
          <p className="font-body text-brass text-[10px] font-bold uppercase tracking-widest mb-5">
            And for one learner, it looks like this
          </p>
          <div className="flex flex-col md:flex-row items-stretch flex-wrap md:flex-nowrap gap-y-5">
            {beats.map((b, i) => (
              <div key={b} className="flex-1 min-w-[110px]">
                <p
                  className={
                    "font-display text-base md:text-lg leading-snug " +
                    (i === beats.length - 1 ? "text-kesari" : "text-parchment")
                  }
                >
                  "{b}"
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="font-display text-kesari text-xl md:text-2xl mt-9">This is how knowledge travels.</p>
      </div>
    </section>
  );
}

export function KnowledgeTradition() {
  const chain = ["Teacher", "Student", "Apprentice", "Book", "Classroom", "Computer", "Internet", "AI"];
  return (
    <section className="py-10 md:py-14 bg-parchment">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold mb-4 text-brass">
          <span className="w-[22px] h-[1.5px] bg-brass inline-block" />
          A Tradition of Learning
        </div>
        <h2 className="font-display text-indigo text-3xl md:text-4xl max-w-2xl">
          India has always carried knowledge forward.
        </h2>
        <p className="font-body text-ink-soft mt-4 text-base leading-relaxed max-w-xl">
          Teacher to student. Master to apprentice. One generation to the next — Udaan carries that same idea into a new set of tools.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          {chain.map((c, i) => (
            <div key={c} className="flex items-center gap-3">
              <span className="px-4 py-2.5 rounded-xl text-sm font-semibold font-body bg-white text-indigo border border-sandstone">
                {c}
              </span>
              {i < chain.length - 1 && <ArrowRight size={14} className="text-brass" />}
            </div>
          ))}
        </div>

        <p className="font-display text-kesari mt-8 text-xl md:text-2xl">
          The tools changed. The need to learn never did.
        </p>
      </div>
    </section>
  );
}

export function WisdomThatStillSpeaks() {
  const cards = [
    { tradition: "Gita", word: "ASK", desc: "The Bhagavad Gita opens with Arjuna asking Krishna a direct question about how to act — reflection begins with an honest question." },
    { tradition: "Qur'an", word: "KNOW", desc: "Iqra — 'read' or 'recite' — is the first word revealed, placing the pursuit of knowledge at the very foundation." },
    { tradition: "Ramayana", word: "BECOME", desc: "Rama's journey is one of growth through discipline and service — becoming, through action, who one is meant to be." },
  ];

  return (
    <section className="py-10 md:py-14 bg-indigo">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold mb-4 text-brass">
          <span className="w-[22px] h-[1.5px] bg-brass inline-block" />
          Wisdom
        </div>
        <h2 className="font-display text-parchment text-3xl md:text-4xl max-w-2xl mb-4">
          Different traditions. A shared belief in learning.
        </h2>
        <p className="font-body text-sandstone text-base leading-relaxed max-w-2xl mb-10">
          India's intellectual, spiritual and cultural traditions have long treated learning as a path to understanding. Udaan carries that spirit into digital education, skills and opportunity.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((c) => (
            <div key={c.tradition} className="p-6 rounded-2xl bg-indigo-deep border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brass">{c.tradition}</span>
              <h3 className="font-display text-kesari text-2xl mt-2 mb-3">{c.word}</h3>
              <p className="font-body text-sandstone text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        <p className="font-body text-sandstone text-xs leading-relaxed max-w-2xl mx-auto mt-10 text-center opacity-75">
          We are not borrowing religion to market a charity. We are drawing from India's diverse intellectual heritage to express a simple human idea: people grow when they have the freedom to ask, the opportunity to learn, and the support to build.
        </p>
      </div>
    </section>
  );
}

export function UdaanPromise() {
  const items = ["One learner.", "One question.", "One skill.", "One mentor.", "One opportunity."];
  return (
    <section className="py-14 md:py-20 text-center bg-forest">
      <div className="max-w-2xl mx-auto px-5">
        <h2 className="font-display text-parchment text-3xl md:text-5xl leading-tight">
          We don't promise to change the world overnight.
        </h2>
        <p className="font-body text-sandstone mt-6 text-base md:text-lg">We promise to start with —</p>
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-3 mt-6">
          {items.map((it, i) => (
            <span key={it} className="flex items-center gap-2">
              <span className="font-display text-parchment text-xl md:text-2xl">{it}</span>
              {i < items.length - 1 && <span className="text-brass text-xl md:text-2xl">·</span>}
            </span>
          ))}
        </div>
        <p className="font-body text-sandstone mt-6 text-base leading-relaxed max-w-lg mx-auto">
          And then help that opportunity travel further.
        </p>
        <p className="font-display text-kesari mt-8 text-2xl md:text-3xl">Because every beginning matters.</p>
      </div>
    </section>
  );
}

export function PassItForward() {
  const options = [
    { label: "Volunteer", desc: "Give Your Time", icon: HandHeart, href: "/volunteer/apply" },
    { label: "Mentor", desc: "Share what you know", icon: Users, href: "/volunteer/apply" },
    { label: "Donate", desc: "Support an Opportunity", icon: Heart, href: "/donate" },
    { label: "Partner", desc: "Build with us", icon: Building2, href: "/contact" },
  ];
  return (
    <section className="py-12 md:py-16 bg-indigo">
      <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
        <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold mb-4 text-brass justify-center">
          <span className="w-[22px] h-[1.5px] bg-brass inline-block" />
          Pass It Forward
        </div>
        <h2 className="font-display text-parchment text-3xl md:text-5xl leading-tight">
          Someone taught you something once.
        </h2>
        <div className="font-body text-sandstone mt-6 text-base leading-relaxed max-w-lg mx-auto space-y-1">
          <p>Maybe it was a teacher. A parent. A friend. A mentor.</p>
          <p>Someone who gave you their time.</p>
          <p>Someone who answered your question.</p>
          <p>Someone who believed you could do more.</p>
        </div>
        <p className="font-display text-kesari mt-6 text-xl md:text-2xl max-w-lg mx-auto">
          Udaan is about becoming that person for someone else.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-9">
          {options.map((o) => (
            <Link
              key={o.label}
              href={o.href}
              className="p-5 rounded-2xl text-left transition-transform hover:scale-[1.02] bg-indigo-deep border border-white/10"
            >
              <o.icon size={18} className="text-kesari" />
              <div className="font-display text-parchment text-base mt-3">{o.label}</div>
              <div className="font-body text-sandstone text-xs mt-1">{o.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
