import { Nav } from "@/components/udaan/Nav";
import { Hero, WhyWeExist, DayZero, Closing, Footer, MobileBar } from "@/components/udaan/StaticSections";
import {
  GenerationsChain,
  KnowledgeTradition,
  WisdomThatStillSpeaks,
  UdaanPromise,
  PassItForward,
} from "@/components/udaan/HeritageSections";
import { CurrentProjectsSection } from "@/components/udaan/CurrentProjectsSection";
import { ImpactSection } from "@/components/udaan/ImpactSection";
import { StoriesSection } from "@/components/udaan/StoriesSection";
import { FundraisingSection } from "@/components/udaan/FundraisingSection";

export default function HomePage() {
  return (
    <div className="bg-parchment">
      <Nav />
      <Hero />
      <WhyWeExist />
      <GenerationsChain />
      <KnowledgeTradition />
      <WisdomThatStillSpeaks />
      <CurrentProjectsSection />
      <ImpactSection />
      <StoriesSection />
      <UdaanPromise />
      <PassItForward />
      <FundraisingSection />
      <DayZero />
      <Closing />
      <Footer />
      <MobileBar />
    </div>
  );
}
