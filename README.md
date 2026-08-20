# Telma Santos — Portfólio Profissional

> **Educação que inspira. Conhecimento que transforma. Presença que deixa marcas.**

Portfólio digital de **Telma Santos**, Formadora Educacional, Consultora e Palestrante, desenvolvido como uma experiência editorial contemporânea para apresentar sua trajetória, formação, atuação profissional e projetos na área da Educação.

O projeto combina **design editorial, tipografia expressiva, movimento sutil e uma experiência responsiva premium**, priorizando clareza, autoridade profissional e proximidade.

---

##  Sobre o projeto

Este portfólio foi desenvolvido para transformar uma trajetória de mais de duas décadas na Educação em uma experiência digital elegante, objetiva e imersiva.

A proposta visual abandona a estrutura tradicional de currículo ou site institucional e utiliza uma linguagem inspirada em:

* portfolios editoriais;
* experiências digitais premium;
* sites contemporâneos de profissionais criativos;
* layouts tipográficos de alto impacto;
* interfaces minimalistas orientadas por conteúdo.

O resultado é uma experiência construída principalmente através de:

**tipografia + fotografia + espaço negativo + movimento + narrativa.**

---

##  Identidade visual

A direção de arte foi construída em torno de uma estética sofisticada e atemporal.

### Paleta

* **Off Black / Charcoal** — fundo principal
* **Warm Ivory** — textos e títulos
* **Champagne Gold** — detalhes e elementos de destaque
* **Warm Gray** — textos secundários e hairlines

O dourado é utilizado de forma controlada, funcionando como elemento de assinatura visual e não como cor dominante.

### Tipografia

O projeto utiliza uma combinação editorial entre:

* **Fraunces** — títulos, headlines e elementos de destaque;
* **Manrope** — textos, labels, navegação e informações complementares.

---

##  Principais seções

### Hero

Apresentação principal de Telma Santos com fotografia editorial, tipografia monumental e frases de posicionamento.

Entre as mensagens apresentadas:

* Presença que deixa marcas.
* Educação que inspira.
* Conhecimento que transforma.
* Experiências que despertam.

---

### Sobre

Apresentação da trajetória de Telma na Educação e dos principais pilares que construíram sua atuação profissional.

---

### Trajetória Profissional

Linha do tempo editorial apresentando diferentes etapas da carreira, incluindo atuação em:

* gestão educacional;
* coordenação pedagógica;
* Educação de Jovens e Adultos;
* referenciais curriculares;
* projetos político-pedagógicos;
* formação docente;
* diagnósticos educacionais;
* acompanhamento pedagógico.

---

### Formação Continuada

Apresentação de experiências relacionadas à formação de professores e programas educacionais.

Entre elas:

* PNAIC;
* Pacto Estadual pela Alfabetização;
* Instituto Ayrton Senna.

---

### Áreas de Atuação

Experiência interativa dedicada aos principais campos de atuação profissional:

1. Formação
2. Assessoria
3. Oficinas
4. Palestras
5. Diálogos

A seção utiliza navegação editorial vertical e transições de conteúdo controladas.

---

### Assessoria Pedagógica

Apresentação da atuação junto às redes municipais de Educação, incluindo:

* organização curricular;
* análise de indicadores;
* apoio técnico;
* fortalecimento das práticas de ensino;
* intervenções pedagógicas;
* melhoria da aprendizagem.

---

### Oficinas

Coleção editorial de oficinas e experiências formativas, incluindo temas relacionados à:

* BNCC;
* ludicidade;
* família e escola;
* Educação de Jovens e Adultos;
* sequência didática;
* jogos no ensino da Matemática.

---

### Palestras

Catálogo editorial com temas de palestras direcionadas à formação e mobilização de profissionais da Educação.

---

### Diálogos Formativos

Índice editorial com **20 temas formativos**, estruturado para facilitar a leitura de um grande repertório de assuntos sem transformar a experiência em uma interface tradicional de cards.

A seção trabalha conceitos como:

* planejamento;
* gestão escolar;
* políticas educacionais;
* alfabetização;
* avaliação;
* BNCC;
* inclusão;
* Educação Integral;
* EJA;
* organização do trabalho pedagógico.

---

### Formação Acadêmica

Apresentação das formações acadêmicas da Telma.

#### Graduação

* Letras
* Pedagogia

#### Pós-graduação

* Literatura
* Língua Portuguesa
* Psicopedagogia

---

### Contato

O contato foi projetado como uma extensão da experiência editorial do site.

Em vez de um formulário tradicional, a interface apresenta uma conversa estruturada em duas etapas:

**01 — Como posso chamar você?**

**02 — Sobre o que vamos conversar?**

O visitante pode escolher entre:

* Formação;
* Assessoria Pedagógica;
* Oficina;
* Palestra;
* Diálogo Formativo;
* Outro.

A partir dessas informações, o site prepara o contato através de **WhatsApp ou e-mail**.

---

##  Experiência e UX

O projeto foi construído com foco em uma experiência sofisticada, mas sem comprometer usabilidade.

Entre os cuidados implementados estão:

* navegação responsiva;
* hierarquia tipográfica consistente;
* áreas de toque adequadas;
* estados de foco;
* navegação por teclado;
* semântica HTML;
* contraste adequado;
* suporte a diferentes resoluções;
* movimentos controlados;
* respeito a `prefers-reduced-motion`.

---

##  Responsividade

A interface foi projetada e validada para múltiplas resoluções.

Entre os principais breakpoints avaliados:

```text
1920px
1440px
1366px
1024px
768px
430px
390px
375px
```

A arquitetura responsiva não se limita à redução de elementos.

Cada seção reorganiza sua composição conforme o espaço disponível, mantendo:

* leitura;
* hierarquia;
* ritmo;
* legibilidade;
* espaço negativo;
* intenção editorial.

---

##  Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Motion & interação

O projeto utiliza a infraestrutura de animação existente para transições e microinterações cuidadosamente controladas.

### Tipografia

* Fraunces
* Manrope
* `next/font`

### Arquitetura

* Next.js App Router
* componentes reutilizáveis;
* conteúdo estruturado;
* design system baseado em tokens;
* organização modular por seções.

---

##  Estrutura conceitual

```text
app/
├── page.tsx
├── layout.tsx
└── ...

components/
├── sections/
│   ├── Hero
│   ├── Sobre
│   ├── Trajetoria
│   ├── FormacaoContinuada
│   ├── AreasDeAtuacao
│   ├── Assessoria
│   ├── Oficinas
│   ├── Palestras
│   ├── DialogosFormativos
│   ├── FormacaoAcademica
│   └── Contato
│
├── media/
├── ui/
└── ...

content/
└── site-data

public/
└── telma/
    └── portraits/
```

> A estrutura acima representa a organização conceitual do projeto. Consulte o código-fonte para verificar a estrutura atual completa.

---

##  Desenvolvimento local

Clone o projeto e instale as dependências:

```bash
npm install
```

Execute o ambiente de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível normalmente em:

```text
http://localhost:3000
```

---

##  Validação

Antes de uma entrega ou publicação, o projeto pode ser validado utilizando:

```bash
npm run lint
```

```bash
npx tsc --noEmit
```

```bash
npm run build
```

Essas verificações ajudam a garantir:

* qualidade estática;
* consistência de tipos;
* integridade do build;
* ausência de regressões críticas.

---

##  Deploy

O projeto é compatível com ambientes capazes de executar aplicações Next.js.

Para produção, deve-se garantir:

* build de produção aprovado;
* variáveis de ambiente corretamente configuradas, quando aplicável;
* HTTPS;
* otimização dos assets;
* validação dos links externos;
* revisão responsiva final.

---

##  Princípios de design

Durante o desenvolvimento, algumas regras foram adotadas como base da experiência:

**Menos interface, mais narrativa.**

**Menos elementos decorativos, mais intenção.**

**Dourado como assinatura, não como decoração excessiva.**

**Movimento como suporte à narrativa, nunca como distração.**

**Tipografia e espaço negativo como elementos principais da composição.**

---

##  Acessibilidade

O projeto busca manter boas práticas como:

* HTML semântico;
* labels associados corretamente;
* navegação por teclado;
* estados `focus-visible`;
* contraste;
* controles semanticamente apropriados;
* áreas clicáveis adequadas;
* suporte a redução de movimento.

---

##  Direitos autorais

© 2026 **Telma Santos**. Todos os direitos reservados.

Textos, fotografias, identidade e demais conteúdos apresentados no portfólio estão sujeitos aos direitos de seus respectivos titulares.

Este projeto não declara uma licença open source para reprodução ou redistribuição integral do conteúdo.

---

##  Design & Development

**Design e desenvolvimento — Wanderson Gandra**

Concepção da experiência digital, arquitetura visual, desenvolvimento frontend, responsividade, interações e refinamento técnico do portfólio.

---

<p align="center">
  <strong>Telma Santos</strong><br />
  Formadora Educacional • Consultora • Palestrante
</p>
