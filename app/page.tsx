import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Sobre } from "@/components/sections/Sobre";
import { Trajetoria } from "@/components/sections/Trajetoria";
import { AreasDeAtuacao } from "@/components/sections/AreasDeAtuacao";
import { Contato } from "@/components/sections/Contato";
import { Marquee } from "@/components/motion/Marquee";
import { siteData } from "@/content/site-data";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Sobre />
      <Trajetoria />
      <AreasDeAtuacao />
      <Marquee words={siteData.hero.keywords} />
      <Contato />
    </>
  );
}
