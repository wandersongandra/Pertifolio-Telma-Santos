import { siteData, type AreaOfPractice } from "@/content/site-data";

export type ServicePage = {
  slug: string;
  areaId: AreaOfPractice["id"];
  seoTitle: string;
  seoDescription: string;
  headline: string;
  intro: string;
};

export const servicePages: ServicePage[] = [
  {
    slug: "formacao-de-professores",
    areaId: "formacao",
    seoTitle: "Formação de Professores na Bahia | Telma Santos",
    seoDescription:
      "Formação continuada de professores na Bahia com experiência em alfabetização, práticas pedagógicas e soluções educacionais.",
    headline: "Formação continuada de professores com prática, contexto e acompanhamento.",
    intro:
      "A formação de professores faz parte da trajetória de Telma Santos em diferentes programas e redes de ensino. O trabalho reúne estudo, reflexão sobre a prática e construção de caminhos pedagógicos a partir das necessidades de cada contexto educacional.",
  },
  {
    slug: "assessoria-pedagogica",
    areaId: "assessoria",
    seoTitle: "Assessoria Pedagógica para Redes Municipais | Telma Santos",
    seoDescription:
      "Assessoria pedagógica a redes municipais na Bahia, com organização curricular, indicadores, apoio às equipes e intervenções pedagógicas.",
    headline: "Assessoria pedagógica para redes municipais e equipes educacionais.",
    intro:
      "A assessoria pedagógica conecta planejamento, acompanhamento e leitura de indicadores ao cotidiano das equipes escolares. A atuação apresentada neste portfólio inclui organização curricular, apoio técnico, fortalecimento das práticas de ensino e planejamento de intervenções.",
  },
  {
    slug: "oficinas-pedagogicas",
    areaId: "oficinas",
    seoTitle: "Oficinas Pedagógicas para Educadores | Telma Santos",
    seoDescription:
      "Oficinas pedagógicas sobre alfabetização, metodologias ativas, tecnologia, indicadores, competências socioemocionais e planejamento.",
    headline: "Oficinas pedagógicas para transformar estudo em prática.",
    intro:
      "As oficinas pedagógicas são organizadas como experiências formativas concentradas em temas do cotidiano educacional. O repertório inclui alfabetização, metodologias ativas, tecnologia aplicada à Educação, indicadores, competências socioemocionais e planejamento.",
  },
  {
    slug: "palestras-educacionais",
    areaId: "palestras",
    seoTitle: "Palestras Educacionais | Telma Santos",
    seoDescription:
      "Palestras educacionais sobre liderança, tecnologia, indicadores, competências socioemocionais, linguagens e transformação da Educação.",
    headline: "Palestras educacionais para mobilizar reflexão e novas conversas.",
    intro:
      "As palestras apresentadas no portfólio abordam temas ligados à transformação da Educação, liderança, tecnologia, indicadores educacionais, competências socioemocionais, múltiplas linguagens e relação entre escola, família e pertencimento.",
  },
  {
    slug: "dialogos-formativos",
    areaId: "dialogos",
    seoTitle: "Diálogos Formativos para Educadores | Telma Santos",
    seoDescription:
      "Diálogos formativos sobre planejamento, avaliação, currículo, inclusão, alfabetização, Educação Integral, EJA e cotidiano escolar.",
    headline: "Diálogos formativos para estudo, escuta e reflexão coletiva.",
    intro:
      "Os diálogos formativos reúnem temas para estudo e reflexão coletiva sobre planejamento, avaliação, currículo e cotidiano escolar. São encontros pensados para ampliar repertório, organizar perguntas e apoiar decisões pedagógicas.",
  },
];

export function getServicePage(slug: string): ServicePage | undefined {
  return servicePages.find((item) => item.slug === slug);
}

export function getServicePageByAreaId(areaId: AreaOfPractice["id"]): ServicePage | undefined {
  return servicePages.find((item) => item.areaId === areaId);
}

export function getAreaForService(service: ServicePage): AreaOfPractice {
  const area = siteData.areasDeAtuacao.find((item) => item.id === service.areaId);
  if (!area) throw new Error(`Área de atuação ausente para ${service.slug}`);
  return area;
}
