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

export interface AreaListItem {
  id: string;
  title: string;
  summary?: string;
}

/** Conteúdo extra renderizado dentro do painel de uma área, abaixo do texto
 * de abertura. */
export type AreaDetail =
  | { layout: "timeline"; items: TimelineEntry[] }
  | { layout: "list"; meta?: string; summary?: string; items: AreaListItem[] }
  | { layout: "dense"; summary?: string; countLabel: string; items: AreaListItem[] };

export interface AreaOfPractice {
  id: "formacao" | "assessoria" | "oficinas" | "palestras" | "dialogos";
  label: string;
  title: string;
  description?: string;
  detail: AreaDetail;
}

/** `label` é o que o visitante escolhe; `phrase` é como aquilo aparece dentro
 * da mensagem de contato ("conversar sobre uma oficina", não "sobre oficina"). */
export interface ContactInterest {
  label: string;
  phrase: string;
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
    /** Título da aba e do resultado de busca. Ver o comentário no valor. */
    seoTitle: string;
    tagline: string;
    description: string;
  };
  nav: { label: string; href: string }[];
  hero: {
    kicker: string;
    /** O h1 da página. Ver o comentário no valor. */
    headline: string;
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
  };
  trajetoria: TimelineEntry[];
  areasDeAtuacao: AreaOfPractice[];
  contato: {
    eyebrow: string;
    heading: string;
    intro: string;
    whatsappMessageTemplate: string;
    channels: ContactChannel[];
    interests: ContactInterest[];
  };
}

const WHATSAPP_PHONE = "5577981166690";
const WHATSAPP_DISPLAY = "(77) 98116-6690";
const EMAIL = "telmapereira030@gmail.com";

export const siteData: SiteData = {
  meta: {
    name: "Telma Santos",
    role: "Formadora Educacional",
    // O título anterior era "Telma Santos — Formadora Educacional": só o nome
    // dela e o cargo, então a página só aparecia para quem já a conhecia. O
    // título é o texto de maior peso da página inteira; dizer o serviço e a
    // região é o que permite alguém chegar sem saber o nome.
    //
    // O recorte na Bahia é verdadeiro — a trajetória inteira é em municípios
    // baianos — e é o que torna a disputa vencível: "formação de professores"
    // sozinho compete com institutos nacionais e universidades.
    //
    // Mantido em 47 caracteres de propósito: acima de ~60 o Google corta o
    // final na exibição, e o final é justamente o diferencial. "Assessoria
    // pedagógica" não cabe aqui e por isso vive no h1, o segundo elemento de
    // maior peso.
    seoTitle: "Telma Santos — Formação de Professores na Bahia",
    tagline: "Educação, formação e práticas pedagógicas que transformam.",
    description:
      "Telma Santos é formadora educacional com mais de duas décadas de atuação na Bahia, em formação de professores, assessoria pedagógica a redes municipais, oficinas, palestras e desenvolvimento educacional.",
  },

  nav: [
    { label: "Sobre", href: "/#sobre" },
    { label: "Trajetória", href: "/#trajetoria" },
    { label: "Atuação", href: "/#atuacao" },
    { label: "Contato", href: "/#contato" },
  ],

  hero: {
    kicker: "Formadora Educacional • Consultora • Palestrante",
    // O h1 da página. Antes, o h1 eram as frases rotativas ("Presença que deixa
    // marcas."): bonitas, mas sem uma única palavra que alguém digitaria numa
    // busca. As frases continuam iguais na tela, agora como h2, e o h1 passa a
    // dizer o que ela faz.
    //
    // O texto é visível, não escondido. Texto oculto para buscador é punido, e
    // com razão — além de deixar o leitor de tela anunciando algo que não está
    // na tela.
    headline: "Formação de professores e assessoria pedagógica a redes municipais",
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
        "Atuação na implementação e acompanhamento das soluções educacionais do Instituto Ayrton Senna em municípios baianos, com formação, suporte técnico e pedagógico, análise de dados e orientação de intervenções, visando ao fortalecimento da gestão e à melhoria da aprendizagem dos estudantes.",
    },
    {
      id: "coordenacao-ef",
      title: "Coordenadora do Ensino Fundamental",
      description:
        "Coordenação pedagógica da etapa do Ensino Fundamental, com acompanhamento das práticas de ensino e das equipes escolares.",
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
      label: "Formação Educacional",
      title: "Formação continuada de professores",
      description:
        "Do PNAIC ao Pacto Estadual pela Alfabetização e às soluções educacionais do Instituto Ayrton Senna.",
      detail: {
        layout: "timeline",
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
    },
    {
      id: "assessoria",
      label: "Assessoria Pedagógica",
      title: "Assessoria pedagógica a redes municipais",
      description:
        "Organização curricular, análise de indicadores e intervenções estratégicas.",
      detail: {
        layout: "list",
        meta: "2021 — 2024",
        summary:
          "Planejamento e execução de assessorias pedagógicas a redes municipais, com acompanhamento próximo das equipes escolares.",
        items: [
          { id: "organizacao-curricular", title: "Organização curricular" },
          { id: "analise-indicadores", title: "Análise de indicadores educacionais" },
          { id: "apoio-tecnico", title: "Apoio técnico às equipes escolares" },
          { id: "praticas-de-ensino", title: "Fortalecimento das práticas de ensino" },
          { id: "intervencoes", title: "Intervenções pedagógicas" },
          { id: "melhoria-aprendizagem", title: "Melhoria da aprendizagem" },
        ],
      },
    },
    {
      id: "oficinas",
      label: "Oficinas Pedagógicas",
      title: "Conhecimento em movimento. Experiências para transformar a prática.",
      detail: {
        layout: "list",
        items: [
          {
            id: "alfabetizacao-intervencao",
            title: "Alfabetização: dos Níveis de Aprendizagem à Intervenção",
          },
          { id: "multiplas-linguagens-acao", title: "Múltiplas Linguagens em Ação" },
          { id: "metodologias-ativas", title: "Metodologias Ativas na Prática" },
          { id: "tecnologia-aplicada", title: "Tecnologia Aplicada à Educação" },
          {
            id: "socioemocionais-movimento",
            title: "Competências Socioemocionais em Movimento",
          },
          {
            id: "do-dado-a-acao",
            title: "Do Dado à Ação: Indicadores Educacionais",
          },
          {
            id: "planejamento-intencionalidade",
            title: "Planejamento com Intencionalidade",
          },
        ],
      },
    },
    {
      id: "palestras",
      label: "Palestras Educacionais",
      title: "Ideias que provocam. Diálogos que mobilizam. Educação que transforma.",
      detail: {
        layout: "list",
        items: [
          { id: "educacao-que-transforma", title: "Educação que Transforma" },
          { id: "lideranca", title: "Liderança que Faz Acontecer" },
          {
            id: "tecnologia",
            title: "Tecnologia e os Novos Caminhos da Educação",
          },
          {
            id: "indicadores",
            title: "Indicadores Educacionais: Dados que Orientam Decisões",
          },
          {
            id: "socioemocionais",
            title: "Competências Socioemocionais: Educar para a Vida",
          },
          {
            id: "multiplas-linguagens",
            title: "Múltiplas Linguagens: Novas Formas de Ensinar e Aprender",
          },
          {
            id: "escola-familia-pertencimento",
            title: "Escola, Família e Pertencimento",
          },
        ],
      },
    },
    {
      id: "dialogos",
      label: "Diálogos Formativos",
      title: "Encontros formativos de escuta e reflexão coletiva",
      description: "Sobre o planejamento, a avaliação e o cotidiano escolar.",
      detail: {
        layout: "dense",
        summary:
          "Momentos de estudo, escuta e reflexão coletiva — espaços de construção de sentidos, protagonismo docente e planejamento consciente.",
        countLabel: "Temas formativos",
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
    },
  ],

  contato: {
    eyebrow: "Contato",
    heading: "Vamos construir novos caminhos para a Educação.",
    intro:
      "Formação, assessoria, palestras e oficinas — entre em contato para conversar sobre o próximo projeto.",
    whatsappMessageTemplate:
      "Olá, Telma. Conheci seu trabalho através do seu portfólio e gostaria de conversar sobre {interesse}.",
    interests: [
      { label: "Formação", phrase: "formação de professores" },
      { label: "Assessoria Pedagógica", phrase: "assessoria pedagógica" },
      { label: "Oficina", phrase: "uma oficina" },
      { label: "Palestra", phrase: "uma palestra" },
      { label: "Diálogo Formativo", phrase: "um diálogo formativo" },
      { label: "Outro", phrase: "um projeto educacional" },
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
        value: "@telma_formadora",
        href: "https://www.instagram.com/telma_formadora",
      },
      {
        type: "linkedin",
        label: "LinkedIn",
        value: "linkedin.com/in/telma03",
        href: "https://www.linkedin.com/in/telma03",
      },
    ],
  },

};

export const whatsappPhone = WHATSAPP_PHONE;
export const contactEmail = EMAIL;
