import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Sobre } from "@/components/sections/Sobre";
import { Trajetoria } from "@/components/sections/Trajetoria";
import { AreasDeAtuacao } from "@/components/sections/AreasDeAtuacao";
import { FormacaoContinuada } from "@/components/sections/FormacaoContinuada";
import { AssessoriaPedagogica } from "@/components/sections/AssessoriaPedagogica";
import { Oficinas } from "@/components/sections/Oficinas";
import { Palestras } from "@/components/sections/Palestras";
import { DialogosFormativos } from "@/components/sections/DialogosFormativos";
import { FormacaoAcademica } from "@/components/sections/FormacaoAcademica";
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
      <FormacaoContinuada />
      <Marquee words={siteData.hero.keywords} />
      <AssessoriaPedagogica />
      <Oficinas />
      <Palestras />
      <DialogosFormativos />
      <FormacaoAcademica />
      <Contato />
    </>
  );
}
