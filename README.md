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

### Áreas de Atuação

Núcleo interativo da página e onde vive a maior parte do conteúdo profissional.
Uma lista vertical de abas controla um painel único, no padrão ARIA
`tablist` / `tab` / `tabpanel` (navegável por setas, Home e End):

| # | Aba | Conteúdo do painel |
|---|---|---|
| 01 | Formação Educacional | Linha do tempo: PNAIC, Pacto Estadual pela Alfabetização, Instituto Ayrton Senna |
| 02 | Assessoria Pedagógica | Período 2021—2024, resumo e 6 frentes de trabalho |
| 03 | Oficinas Pedagógicas | 7 oficinas |
| 04 | Palestras Educacionais | 7 palestras |
| 05 | Diálogos Formativos | Contador e índice denso com 20 temas formativos |

Cada aba renderiza um dos três layouts de painel definidos em
`components/sections/AreaDetailPanel.tsx` (`timeline`, `list` e `dense`),
escolhidos pelo campo `detail.layout` de cada área em `content/site-data.ts`.

**Links diretos para uma aba.** Antes essas cinco eram seções soltas, com
âncoras próprias. Os hashes antigos continuam válidos: `#formacao`,
`#assessoria`, `#oficinas`, `#palestras` e `#dialogos` rolam até a seção e
abrem a aba correspondente.

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

##  Estrutura do projeto

```text
app/
├── layout.tsx           # <html>, metadata, fontes, Header/Footer, SmoothScroll
├── page.tsx             # ordem das seções da home
├── not-found.tsx        # 404 em português
├── privacidade/         # Política de Privacidade
├── termos/              # Termos de Uso
├── manifest.ts          # PWA manifest
├── robots.ts            # robots.txt (bloqueia deploys de preview)
├── sitemap.ts           # sitemap.xml
└── globals.css          # tokens de design e utilitários

components/
├── sections/            # uma seção da página por arquivo
│   ├── Hero · Manifesto · Sobre · Trajetoria
│   ├── AreasDeAtuacao   # as abas
│   ├── AreaDetailPanel  # layouts de painel: timeline | list | dense
│   └── Contato
├── layout/              # Header, Footer, SiteMenu, LegalPage
├── hero/ · media/ · motion/ · ui/

content/
└── site-data.ts         # TODO o conteúdo textual do site

lib/
├── site-url.ts          # resolve a URL pública do site
├── photos.ts · whatsapp.ts · utils.ts · useReducedMotion.ts

public/
├── _headers             # headers de segurança e cache (Cloudflare Pages)
└── telma/               # retratos, logo e ícones

scripts/
└── serve-with-headers.mjs   # serve out/ aplicando public/_headers
```

### Onde editar o conteúdo

**Todo texto do site vive em `content/site-data.ts`.** Componentes não têm
texto fixo: alterar uma frase, uma palestra ou um item da trajetória é editar
esse arquivo, e os tipos no topo dele descrevem o formato de cada bloco. As
duas exceções são as páginas legais (`app/privacidade` e `app/termos`), cujo
texto corrido está no próprio arquivo da página.

---

##  Desenvolvimento local

Requer **Node.js 20+** (o Next 16 não roda em versões anteriores).

```bash
npm install
npm run dev          # http://localhost:3000
```

### Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com hot reload. |
| `npm run build` | Build de produção. Gera o export estático em `out/`. |
| `npm run preview:headers` | Serve `out/` **aplicando `public/_headers`**. Use para testar o CSP. |
| `npm run lint` | ESLint. |
| `npx tsc --noEmit` | Checagem de tipos. |

> `npm run start` existe por padrão do Next, mas **não serve para este projeto**:
> com `output: "export"` não há servidor Next em produção. Para ver o build
> real, use `npm run preview:headers`.

---

##  Variáveis de ambiente

Nenhuma é obrigatória para desenvolver. Em produção existe uma:

| Variável | Onde | Para quê |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Painel do Cloudflare Pages → Settings → Environment variables | URL pública do site. Alimenta `sitemap.xml`, `robots.txt`, as URLs canônicas e as imagens de OpenGraph. |
| `CF_PAGES_URL` | Injetada automaticamente pelo Cloudflare Pages | Usada como fallback quando a de cima não existe. |
| `CF_PAGES_BRANCH` | Injetada automaticamente pelo Cloudflare Pages | Identifica deploys de preview, que o `robots.ts` marca como não indexáveis. |

A resolução está em [`lib/site-url.ts`](lib/site-url.ts), nesta ordem:

```
NEXT_PUBLIC_SITE_URL  →  CF_PAGES_URL  →  http://localhost:3000
```

> **Enquanto não houver domínio próprio**, `NEXT_PUBLIC_SITE_URL` fica sem
> definir e o site se publica com o endereço `.pages.dev` do deployment. Isso é
> intencional: um sitemap apontando para um domínio que não resolve é pior do
> que um apontando para o endereço real. **Ao registrar o domínio definitivo,
> defina `NEXT_PUBLIC_SITE_URL` no painel** — não é preciso mexer no código.

---

##  Validação

Antes de publicar:

```bash
npx tsc --noEmit                    # tipos
npm run lint                        # lint
npm run build                       # o build precisa passar
npm run preview:headers             # e o CSP precisa não quebrar a página
npm audit --omit=dev                # dependências que chegam ao navegador
```

Com o `preview:headers` rodando, abra `http://localhost:4321` e confira no
console do navegador: **nenhum erro "Refused to ..."** e a página hidratada (as
abas de Áreas de Atuação respondem ao clique). Vale repetir em `/privacidade`,
`/termos` e numa URL inexistente.

O procedimento completo, com o que já foi verificado e quando, está em
[SECURITY.md](SECURITY.md).

---

##  Deploy

**Cloudflare Pages, conectado ao repositório no GitHub.**

| | |
|---|---|
| Repositório | `wandersongandra/Pertifolio-Telma-Santos` |
| Branch de produção | `master` |
| Comando de build | `npm run build` |
| Diretório de saída | `out` |

Publicar é **fazer merge em `master` e dar push** — o Cloudflare detecta o push
e roda o build sozinho. Não há workflow do GitHub Actions nem `wrangler.toml`
neste repositório; toda a configuração vive no painel do Cloudflare.

Qualquer outra branch enviada ao GitHub gera um **deploy de preview** com URL
própria. Esses previews servem um `robots.txt` com `Disallow: /`, para não
concorrerem com a produção nos buscadores (ver `app/robots.ts`).

### O que vai junto no deploy

`public/_headers` é copiado para `out/_headers` pelo build e é lido pelo
Cloudflare Pages — é ele que aplica CSP, HSTS e as regras de cache. **Ele não
tem efeito em `next dev`**, por isso o `npm run preview:headers`.

### Checklist de publicação

1. Rodar a seção **Validação** acima.
2. Merge em `master` e push.
3. Acompanhar o build no painel do Cloudflare Pages.
4. Conferir no site publicado: menu a partir de `/privacidade`, uma URL
   inexistente (404 em português) e `/sitemap.xml` com o domínio correto.

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

##  Segurança

O site é um export estático: **não há backend, banco de dados, autenticação,
formulário com POST, cookie ou analytics**, e nenhum recurso de terceiros é
carregado — nem fontes, que o `next/font` auto-hospeda no build.

O que protege o que resta são os headers em
[`public/_headers`](public/_headers), aplicados pelo Cloudflare Pages: CSP
travado em `'self'`, HSTS, `frame-ancestors 'none'`, `nosniff`,
`Referrer-Policy`, `Cross-Origin-Opener-Policy` e `Permissions-Policy`
desligando câmera, microfone, geolocalização, pagamento e USB.

**[SECURITY.md](SECURITY.md)** detalha cada controle, explica as duas
limitações conhecidas (`'unsafe-inline'` em `script-src`, obrigatório num export
estático, e o `preload` do HSTS) e traz os comandos para reverificar tudo — CSP
contra o build real, `npm audit`, varredura de origens externas no bundle e
checagem de segredos versionados.

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
