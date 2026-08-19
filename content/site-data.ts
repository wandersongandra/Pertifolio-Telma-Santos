export type PhotoId =
  | "hero-vignette"
  | "arms-crossed"
  | "seated-laptop"
  | "book-pen"
  | "blue-blazer-macbook";

export interface TimelineEntry {
  id: string;
  period?: string;
  title: string;
  organization?: string;
  location?: string;
  meta?: string;
  description: string;
}

export interface Workshop {
  id: string;
  title: string;
  summary: string;
}

export interface Talk {
  id: string;
  title: string;
  summary?: string;
}

export interface DialogueTheme {
  id: string;
  title: string;
}

export interface AreaOfPractice {
  id: "formacao" | "assessoria" | "oficinas" | "palestras" | "dialogos";
  label: string;
  title: string;
  description: string;
}

export interface AcademicCredential {
  id: string;
  category: "graduacao" | "pos-graduacao";
  title: string;
}

export interface ContactChannel {
  type: "whatsapp" | "email" | "instagram" | "linkedin";
  label: string;
  value: string;
  href: string;
}

export interface SiteData {
  meta: {
    name: string;
    role: string;
    tagline: string;
    description: string;
  };
  nav: { label: string; href: string }[];
  hero: {
    kicker: string;
    rotatingHeadlines: string[];
    paragraph: string;
    ctaLabel: string;
    ctaHref: string;
    keywords: string[];
  };
  manifesto: {
    eyebrow: string;
    paragraphs: string[];
    highlights: string[][];
  };
  sobre: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    quickFacts: { title: string; value: string }[];
  };
  trajetoria: TimelineEntry[];
  areasDeAtuacao: AreaOfPractice[];
  formacaoContinuada: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: TimelineEntry[];
  };
  assessoriaPedagogica: {
    eyebrow: string;
    heading: string;
    period: string;
    summary: string;
    capabilities: string[];
  };
  oficinas: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: Workshop[];
  };
  palestras: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: Talk[];
  };
  dialogosFormativos: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: DialogueTheme[];
  };
  formacaoAcademica: {
    eyebrow: string;
    heading: string;
    items: AcademicCredential[];
  };
  contato: {
    eyebrow: string;
    heading: string;
    intro: string;
    whatsappMessageTemplate: string;
    channels: ContactChannel[];
    interests: string[];
  };
  footer: {
    copyrightName: string;
    role: string;
  };
}

const WHATSAPP_PHONE = "5577981166690";
const WHATSAPP_DISPLAY = "(77) 98116-6690";
const EMAIL = "telmapereira030@gmail.com";

export const siteData: SiteData = {
  meta: {
    name: "Telma Santos",
    role: "Formadora Educacional",
    tagline: "Educação, formação e práticas pedagógicas que transformam.",
    description:
      "Portfólio profissional de Telma Santos, educadora e formadora com atuação em formação de professores, assessoria pedagógica, oficinas, palestras e desenvolvimento educacional.",
  },

  nav: [
    { label: "Sobre", href: "#sobre" },
    { label: "Trajetória", href: "#trajetoria" },
    { label: "Atuação", href: "#atuacao" },
    { label: "Oficinas", href: "#oficinas" },
    { label: "Palestras", href: "#palestras" },
    { label: "Contato", href: "#contato" },
  ],

  hero: {
    kicker: "Formadora Educacional • Consultora • Palestrante",
    rotatingHeadlines: [
      "Presença que deixa marcas.",
      "Educação que inspira.",
      "Conhecimento que transforma.",
      "Experiências que despertam.",
    ],
    paragraph:
      "Telma Santos transforma conhecimento em experiências que despertam pessoas, fortalecem educadores e deixam marcas que vão além da sala de aula.",
    ctaLabel: "Conheça minha trajetória",
    ctaHref: "#trajetoria",
    keywords: [
      "PROFESSORA",
      "FORMADORA",
      "COORDENADORA",
      "ASSESSORA",
      "PALESTRANTE",
      "EDUCAÇÃO",
      "TRANSFORMAÇÃO",
    ],
  },

  manifesto: {
    eyebrow: "Posicionamento",
    paragraphs: [
      "A escola é um espaço de transformação — e a prática pedagógica, quando conduzida com intencionalidade e sensibilidade, é o que sustenta essa transformação no dia a dia da sala de aula.",
      "Há mais de duas décadas, Telma Santos atua na Educação com um percurso construído entre a sala de aula, a formação de professores e a gestão pedagógica — sempre a serviço da aprendizagem e do sucesso escolar de todos.",
    ],
    highlights: [
      ["espaço de transformação", "intencionalidade e sensibilidade"],
      ["mais de duas décadas", "sucesso escolar de todos"],
    ],
  },

  sobre: {
    eyebrow: "Sobre",
    heading: "Mais de duas décadas dedicadas à Educação.",
    paragraphs: [
      "Telma Santos atua profissionalmente na Educação desde 2001, construindo uma trajetória que passa pela sala de aula, pela formação continuada de professores, pela coordenação pedagógica e pela assessoria a redes municipais de ensino.",
      "Sua atuação é pautada pelo fortalecimento das práticas docentes, pelo acompanhamento pedagógico próximo das equipes escolares e pela defesa de uma educação inclusiva, íntegra e comprometida com a aprendizagem de todos.",
    ],
    quickFacts: [
      { title: "2001", value: "Início da trajetória profissional" },
      { title: "Formação", value: "Letras + Pedagogia" },
      { title: "Atuação", value: "Formação de professores, assessoria, gestão e palestras" },
    ],
  },

  trajetoria: [
    {
      id: "inicio",
      period: "Desde 2001",
      title: "Início da atuação profissional na Educação",
      description:
        "Trajetória construída como professora, formadora e coordenadora pedagógica, com foco no fortalecimento das práticas docentes e na aprendizagem significativa.",
    },
    {
      id: "instituto-ayrton-senna",
      title: "Agente Técnica — Instituto Ayrton Senna",
      organization: "Instituto Ayrton Senna",
      location: "Municípios baianos",
      description:
        "Atuação em formação de professores e assessoria pedagógica a municípios, no âmbito das soluções educacionais do Instituto Ayrton Senna.",
    },
    {
      id: "coordenacao-ef",
      title: "Coordenadora do Ensino Fundamental",
      description:
        "Coordenação pedagógica da etapa do Ensino Fundamental, com acompanhamento das práticas de ensino e das equipes escolares.",
    },
    {
      id: "coordenacao-eja",
      title: "Coordenadora da EJA",
      description:
        "Coordenação pedagógica da modalidade Educação de Jovens e Adultos (EJA).",
    },
    {
      id: "referenciais-curriculares",
      title: "Articuladora — [RE]Elaboração dos Referenciais Curriculares Municipais",
      location: "Caraíbas/BA",
      description:
        "Atuação como articuladora no processo de [re]elaboração dos Referenciais Curriculares Municipais do município de Caraíbas/BA.",
    },
    {
      id: "ppp-tremedal-caraibas",
      title: "Formadora — [RE]Elaboração dos Projetos Político-Pedagógicos (PPP)",
      location: "Tremedal e Caraíbas",
      description:
        "Formação no processo de [re]elaboração dos Projetos Político-Pedagógicos (PPP) das redes municipais de Tremedal e Caraíbas.",
    },
    {
      id: "orientacao-tecnica",
      title: "Orientação técnica para documentos educacionais",
      description:
        "Orientação técnica para elaboração e revisão de Diretrizes Educacionais, Projetos Político-Pedagógicos (PPP) e Regimentos Escolares — documentos norteadores da prática pedagógica.",
    },
    {
      id: "diagnosticos-indicadores",
      title: "Diagnósticos, indicadores e intervenções pedagógicas",
      description:
        "Condução de diagnósticos e análise de indicadores educacionais, com planejamento de intervenções pedagógicas e estratégicas a partir dos resultados.",
    },
    {
      id: "projetos-educacionais",
      title: "Mobilização e acompanhamento de projetos educacionais",
      description:
        "Mobilização e acompanhamento de projetos educacionais, incluindo programas de adesão estadual e federal junto a redes municipais.",
    },
  ],

  areasDeAtuacao: [
    {
      id: "formacao",
      label: "Formação",
      title: "Formação continuada de professores",
      description:
        "Do PNAIC ao Pacto Estadual pela Alfabetização e às soluções educacionais do Instituto Ayrton Senna.",
    },
    {
      id: "assessoria",
      label: "Assessoria",
      title: "Assessoria pedagógica a redes municipais",
      description:
        "Organização curricular, análise de indicadores e intervenções estratégicas.",
    },
    {
      id: "oficinas",
      label: "Oficinas",
      title: "Espaços de construção e reconstrução do fazer pedagógico",
      description: "Unindo teoria, prática e experimentação.",
    },
    {
      id: "palestras",
      label: "Palestras",
      title: "Temas que aprofundam, atualizam e mobilizam",
      description:
        "Profissionais da Educação em torno das políticas e práticas pedagógicas.",
    },
    {
      id: "dialogos",
      label: "Diálogos",
      title: "Encontros formativos de escuta e reflexão coletiva",
      description: "Sobre o planejamento, a avaliação e o cotidiano escolar.",
    },
  ],

  formacaoContinuada: {
    eyebrow: "Formação Continuada",
    heading: "Formação continuada de professores",
    intro:
      "Atuação como formadora em programas estruturantes de alfabetização e nas soluções educacionais do Instituto Ayrton Senna.",
    items: [
      {
        id: "pnaic",
        title: "PNAIC",
        meta: "Formadora • Caraíbas/BA",
        description:
          "Formadora do Pacto Nacional pela Alfabetização na Idade Certa (PNAIC) no município de Caraíbas/BA.",
      },
      {
        id: "pacto-estadual",
        title: "Pacto Estadual pela Alfabetização",
        meta: "Formadora",
        description:
          "Atuação como formadora no Pacto Estadual pela Alfabetização.",
      },
      {
        id: "solucoes-ayrton-senna",
        title: "Instituto Ayrton Senna",
        meta: "Formação de professores",
        description:
          "Formação de professores no âmbito das soluções educacionais do Instituto Ayrton Senna.",
      },
    ],
  },

  assessoriaPedagogica: {
    eyebrow: "Assessoria Pedagógica",
    heading: "Assessoria pedagógica a redes municipais",
    period: "2021 — 2024",
    summary:
      "Planejamento e execução de assessorias pedagógicas a redes municipais, com acompanhamento próximo das equipes escolares.",
    capabilities: [
      "Organização curricular",
      "Análise de indicadores educacionais",
      "Apoio técnico às equipes escolares",
      "Fortalecimento das práticas de ensino",
      "Intervenções pedagógicas",
      "Melhoria da aprendizagem",
    ],
  },

  oficinas: {
    eyebrow: "Oficinas",
    heading: "Oficinas",
    intro:
      "As oficinas são espaços de construção e reconstrução do fazer pedagógico — ação, experimentação, diálogo e ampliação de repertórios entre teoria e prática.",
    items: [
      {
        id: "bncc-na-pratica",
        title: "BNCC na prática",
        summary:
          "Ludicidade e Campos de Aprendizagem na Educação Infantil.",
      },
      {
        id: "familia-e-escola",
        title: "Família e escola",
        summary: "Uma parceria indissolúvel.",
      },
      {
        id: "sequencia-didatica",
        title: "Sequência didática",
        summary: "Na modalidade EJA.",
      },
      {
        id: "jogos",
        title: "Jogos",
        summary: "Jogos no Ensino da Matemática.",
      },
    ],
  },

  palestras: {
    eyebrow: "Palestras",
    heading: "Palestras",
    intro:
      "Experiências voltadas para a atualização, o aprofundamento de temas e a mobilização dos profissionais da Educação.",
    items: [
      {
        id: "educacao-integral-desafios",
        title: "Educação Integral e os novos desafios da contemporaneidade",
      },
      {
        id: "eja",
        title: "Educação de Jovens e Adultos",
        summary: "Desafios, metodologias e práticas formativas.",
      },
      {
        id: "ppp",
        title: "Projeto Político-Pedagógico",
        summary: "Construção coletiva e intencionalidade educativa.",
      },
      {
        id: "educacao-infantil-ludicidade",
        title: "Educação Infantil e ludicidade",
        summary: "Experiências, direitos e campos de aprendizagem.",
      },
      {
        id: "anos-iniciais",
        title: "Anos Iniciais",
        summary: "Práticas pedagógicas, alfabetização e letramento.",
      },
      {
        id: "alfabetizacao-linguagens",
        title: "Alfabetização e as múltiplas linguagens",
      },
      {
        id: "educacao-integral-dimensoes",
        title: "Educação Integral",
        summary:
          "Desenvolvimento do estudante nas dimensões cognitivas e socioemocionais.",
      },
    ],
  },

  dialogosFormativos: {
    eyebrow: "Diálogos Formativos",
    heading: "Diálogos Formativos",
    intro:
      "Momentos de estudo, escuta e reflexão coletiva — espaços de construção de sentidos, protagonismo docente e planejamento consciente.",
    items: [
      { id: "plano-de-formacao", title: "Plano de formação / Jornada Pedagógica" },
      { id: "planejamento-sequencia-didatica", title: "Planejamento: sequência didática" },
      { id: "gestao-escolar", title: "Gestão escolar e dimensão pedagógica" },
      { id: "implementacao-politicas", title: "Implementação das políticas educacionais" },
      { id: "trabalho-por-projeto", title: "Trabalho Pedagógico Organizado por Projeto" },
      { id: "ppp-planejamento-participativo", title: "PPP no contexto do planejamento participativo" },
      { id: "direito-a-educacao", title: "Direito à Educação e reinvenção do fazer docente" },
      { id: "avaliacao-diagnostica", title: "Avaliação diagnóstica e formativa: impactos no planejamento" },
      { id: "educacao-infantil-cotidiano", title: "Educação Infantil, cotidiano e experiências em movimento" },
      {
        id: "alfabetizacao-letramento-eixos",
        title:
          "Organização do trabalho pedagógico: alfabetização e letramento como eixos orientadores",
      },
      {
        id: "planejamento-avaliacao-desafios",
        title:
          "Organização do trabalho pedagógico: possibilidades e desafios no planejamento e avaliação",
      },
      {
        id: "estrategias-pedagogicas",
        title: "Estratégias pedagógicas e os novos rumos da educação",
      },
      { id: "fazeres-pedagogicos", title: "Fazeres pedagógicos" },
      { id: "bncc-avancos", title: "BNCC" },
      { id: "novos-olhares", title: "Novos olhares para novos saberes" },
      { id: "rcm-bncc-computacao", title: "RCM e BNCC Computação" },
      { id: "inclusao", title: "Inclusão" },
      { id: "crianca-alfabetizada", title: "Criança alfabetizada" },
      { id: "educacao-integral-dialogos", title: "Educação Integral" },
      { id: "eja-direito", title: "EJA" },
    ],
  },

  formacaoAcademica: {
    eyebrow: "Formação Acadêmica",
    heading: "Formação Acadêmica",
    items: [
      { id: "letras", category: "graduacao", title: "Letras" },
      { id: "pedagogia", category: "graduacao", title: "Pedagogia" },
      { id: "pos-literatura", category: "pos-graduacao", title: "Literatura" },
      { id: "pos-lingua-portuguesa", category: "pos-graduacao", title: "Língua Portuguesa" },
      { id: "pos-psicopedagogia", category: "pos-graduacao", title: "Psicopedagogia" },
    ],
  },

  contato: {
    eyebrow: "Contato",
    heading: "Vamos construir novos caminhos para a Educação.",
    intro:
      "Formação, assessoria, palestras e oficinas — entre em contato para conversar sobre o próximo projeto.",
    whatsappMessageTemplate:
      "Olá, Telma. Conheci seu trabalho através do seu portfólio e gostaria de conversar sobre {interesse}.",
    interests: [
      "Formação",
      "Assessoria Pedagógica",
      "Oficina",
      "Palestra",
      "Diálogo Formativo",
      "Outro",
    ],
    channels: [
      {
        type: "whatsapp",
        label: "WhatsApp",
        value: WHATSAPP_DISPLAY,
        href: `https://wa.me/${WHATSAPP_PHONE}`,
      },
      {
        type: "email",
        label: "E-mail",
        value: EMAIL,
        href: `mailto:${EMAIL}`,
      },
      {
        type: "instagram",
        label: "Instagram",
        value: "@telmasantosformadora",
        href: "https://instagram.com/telmasantosformadora",
      },
      {
        type: "linkedin",
        label: "LinkedIn",
        value: "linkedin.com/in/prof-telma",
        href: "https://linkedin.com/in/prof-telma",
      },
    ],
  },

  footer: {
    copyrightName: "Telma Santos",
    role: "Formadora Educacional",
  },
};

export const whatsappPhone = WHATSAPP_PHONE;
export const contactEmail = EMAIL;
