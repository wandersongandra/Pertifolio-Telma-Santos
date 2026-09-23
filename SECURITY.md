# Segurança

Este documento descreve a superfície de ataque real do site, os controles
aplicados, e **como reverificar cada um deles** — para que nenhuma afirmação
aqui dependa de confiança.

---

## Superfície de ataque

O site é um **export estático** (`output: "export"` no `next.config.ts`). Isso
elimina categorias inteiras de risco por construção:

| Categoria | Situação |
|---|---|
| Backend / API | Não existe. Não há servidor de aplicação, rota dinâmica ou função. |
| Banco de dados | Não existe. Nenhum dado é persistido. |
| Autenticação | Não existe. Não há login, sessão, cookie de sessão ou token. |
| Upload de arquivos | Não existe. |
| Formulário com POST | Não existe. O bloco de contato monta um link `wa.me` / `mailto:` no navegador; nada é enviado a um servidor deste site. |
| Cookies / analytics | Não há cookies próprios. O Cloudflare Web Analytics é o único analytics e não depende de cookie próprio do site. |
| Dependências em runtime | `clsx`, `lenis`, `motion`, `next`, `react`, `react-dom`. |
| Recursos de terceiros | **Um.** O beacon do Cloudflare Web Analytics (`static.cloudflareinsights.com`), injetado pelo Pages e liberado na CSP. Nenhum CSS, fonte ou imagem vem de outra origem. |

O que resta como risco relevante: **conteúdo estático servido ao navegador** e
**links de saída**. É o que os controles abaixo endereçam.

---

## Controles aplicados

Os headers-base vivem em [`public/_headers`](public/_headers). O build endurece a CSP no artefato final por meio de `scripts/generate-csp.mjs`, e `scripts/validate-build-security.mjs` verifica o resultado antes do deploy.

### Content-Security-Policy

A política fonte em `public/_headers` é deliberadamente *fail closed*: não
libera scripts inline. Depois do export, `scripts/generate-csp.mjs` calcula um
hash SHA-256 para cada script inline realmente emitido pelo Next.js e reescreve
a CSP em `out/_headers`.

O artefato publicado fica no formato:

```
default-src 'self'; script-src 'self' 'sha256-…' https://static.cloudflareinsights.com;
script-src-attr 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;
font-src 'self'; connect-src 'self' https://cloudflareinsights.com; media-src 'none';
object-src 'none'; frame-src 'none'; worker-src 'none'; manifest-src 'self';
base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests
```

Assim, a hidratação do React continua funcionando sem `'unsafe-inline'` em
`script-src`. `style-src` ainda precisa de `'unsafe-inline'` por causa de
estilos inline gerados por React/Motion; isso não autoriza execução de
JavaScript. `script-src-attr 'none'` bloqueia handlers HTML inline.

`font-src 'self'` é suficiente porque `next/font` baixa Fraunces e Manrope
em tempo de build e as auto-hospeda.

### Demais headers

| Header | Valor | Por quê |
|---|---|---|
| `X-Frame-Options` | `DENY` | Impede *clickjacking*. Redundante com `frame-ancestors 'none'`, mantido para navegadores antigos. |
| `X-Content-Type-Options` | `nosniff` | Impede o navegador de reinterpretar o tipo de um arquivo. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | O caminho da página não vaza para WhatsApp, Instagram ou LinkedIn ao clicar num link de saída. |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isola o contexto de navegação de janelas de outras origens. |
| `Cross-Origin-Resource-Policy` | `same-origin` | Impede incorporação cross-origin dos assets no navegador. |
| `Cross-Origin-Embedder-Policy` | `require-corp` | Exige política explícita para recursos cross-origin. |
| `Access-Control-Allow-Origin` | domínio canônico | Sobrescreve o CORS curinga do Pages e evita leitura cross-origin arbitrária. |
| `Origin-Agent-Cluster` | `?1` | Solicita isolamento por origem no processo do navegador. |
| `X-Permitted-Cross-Domain-Policies` | `none` | Recusa políticas legadas de cross-domain. |
| `X-DNS-Prefetch-Control` | `off` | Desliga prefetch DNS não necessário. |
| `Permissions-Policy` | APIs de câmera, microfone, localização, sensores, pagamento, USB, serial, HID, Bluetooth, autoplay e fullscreen desligadas | O site não usa essas capacidades; bloqueá-las reduz superfície futura. |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Força HTTPS. Veja a ressalva sobre `preload` abaixo. |

### Links de saída

Todo `target="_blank"` do projeto carrega `rel="noopener noreferrer"`, o que
impede a página de destino de manipular a janela de origem via `window.opener`.

---

## Como reverificar

### 1. CSP e headers, contra o build real

O `_headers` **não é aplicado** por `next dev` nem por `next start` — só pelo
Cloudflare. Sem isso, um erro de CSP só apareceria em produção, como página em
branco. Por isso existe um servidor local que aplica exatamente os mesmos
headers:

```bash
npm run build
npm run preview:headers      # http://localhost:4321
```

Abra o console do navegador. **Um CSP correto não produz nenhum erro
"Refused to ..."**, e a página hidrata (as abas de Áreas de Atuação respondem ao
clique). Vale testar `/`, `/privacidade`, `/termos` e uma URL inexistente.

> Verificado em 27/08/2026 nas quatro páginas: zero violações de CSP, zero erros
> de console, hidratação e abas funcionando.

### 1b. Headers no site publicado

Depois de publicar, confirme que os headers realmente saíram — se o
`public/_headers` não tiver ido junto, o site fica sem nenhum deles e nada
falha visivelmente:

```bash
curl -sI https://www.telmaformadoraeducacional.com.br/ | grep -iE "content-security|strict-transport|x-frame|cross-origin"
```

> Verificado em 28/08/2026 no deployment de produção `51ffac8e`, nos dois
> endereços do domínio próprio (`telmaformadoraeducacional.com.br` e
> `www.telmaformadoraeducacional.com.br`): CSP,
> HSTS, `X-Frame-Options: DENY`, `Cross-Origin-Opener-Policy: same-origin`,
> `nosniff`, `Referrer-Policy`, `Permissions-Policy` e
> `Cross-Origin-Resource-Policy` todos presentes. O
> `Cache-Control` de `/telma/*` respondeu `public, must-revalidate,
> max-age=86400`, como esperado para arquivos sem hash no nome.

### 2. Vulnerabilidades em dependências

```bash
npm audit                    # inclui devDependencies
npm audit --omit=dev         # só o que vai ao navegador
```

> Verificado em 27/08/2026: `found 0 vulnerabilities` nos dois modos.

### 3. Recursos de terceiros no build

O CSP só é tão forte quanto a promessa de que nada externo é carregado. Para
conferir que nenhuma origem de terceiros entrou no bundle:

```bash
npm run build
grep -rhoE 'https?://[a-zA-Z0-9._/-]+' out --include=*.html --include=*.js --include=*.css \
  | sed 's#\(https\?://[^/]*\).*#\1#' | sort | uniq -c | sort -rn
```

O esperado são apenas: a própria URL do site, `cloudflareinsights.com` (o
beacon de analytics, injetado pelo Pages em tempo de resposta e não presente em
`out/`), `w3.org` (namespaces de SVG),
`wa.me` / `instagram.com` / `linkedin.com` (links de contato) e
`nextjs.org` / `react.dev` / `github.com` (mensagens de erro dentro do bundle do
framework). **Qualquer outra origem indica um recurso externo novo, que o CSP
vai bloquear em produção.**

### 4. Segredos

```bash
git ls-files | grep -iE "\.env|\.pem|credential|secret"
```

Deve retornar vazio. O `.gitignore` cobre `.env*` e `*.pem`.

> Verificado em 27/08/2026: nenhum segredo versionado. O e-mail e o telefone em
> `content/site-data.ts` são dados de contato públicos e intencionais.

---

## Pontos em aberto

Coisas conhecidas, deliberadamente não alteradas:

- **`preload` no HSTS.** A diretiva é inerte até que o domínio seja submetido em
  [hstspreload.org](https://hstspreload.org). **Não submeta antes do domínio
  definitivo estar no ar**: a remoção da lista de preload leva meses e vale para
  todos os subdomínios.
- **E-mail em texto puro.** `mailto:` exposto no HTML pode ser coletado por
  robôs de spam. É o custo de ter um canal de contato direto e clicável; a
  alternativa (ofuscar via JavaScript) piora a acessibilidade.
- **O domínio não envia nem recebe e-mail, por decisão.** Verificado em
  28/08/2026: `MX .` (null MX, RFC 7505), `SPF v=spf1 -all` e
  `DMARC v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s`. Os três declaram que
  nenhuma mensagem legítima parte deste domínio, o que impede o uso do nome da
  Telma em falsificação de remetente. O contato do site é o `mailto:` de um
  endereço externo, então isso não afeta ninguém que queira falar com ela.
  Único reforço possível: um DKIM nulo (`*._domainkey` com `v=DKIM1; p=`).
- **Estilos inline.** `style-src 'unsafe-inline'` permanece necessário para
  estilos emitidos por React/Motion. Scripts inline, por outro lado, são
  autorizados individualmente por SHA-256 no artefato final.
- **Dois endereços servem o site, sem redirect entre eles.** Tanto
  `telmaformadoraeducacional.com.br` quanto `www.telmaformadoraeducacional.com.br`
  respondem 200 com o mesmo conteúdo. Isso não gera conteúdo duplicado para
  buscadores porque ambos declaram o mesmo `canonical` e o mesmo `sitemap.xml`
  (o endereço com `www`, definido em `lib/site-url.ts`). Um redirect 301 do apex
  para o `www` seria o refinamento, não uma correção.
- **Perfis externos não validados automaticamente.** Os links de Instagram
  (`@telma_formadora`) e LinkedIn (`linkedin.com/in/telma03`) foram informados
  pela própria Telma e apontam para os perfis reais. Ambas as plataformas
  bloqueiam requisições automatizadas, então a verificação continua sendo
  manual: ao trocar um handle, abra o link no navegador antes de publicar.

---

## Reportar um problema

Envie para o e-mail de contato publicado no site. Não abra issue pública para
falhas de segurança.

---

## Auditoria de segurança desta revisão

Data: 27/08/2026. Escopo: código-fonte, build estático, servidor local de
pré-visualização, dependências e projeto Cloudflare Pages `telma-santos`.

### SEC-001 — servidor de pré-visualização permitia escape de caminho

- **Severidade:** média, limitada ao ambiente local de desenvolvimento.
- **Localização:** `scripts/serve-with-headers.mjs`, função `resolveFile`.
- **Evidência:** a implementação anterior validava o destino apenas com
  `startsWith(path.resolve(OUT))`. Um caminho resolvido para uma pasta irmã cujo
  nome começasse por `out` poderia passar nessa comparação.
- **Impacto:** um processo de pré-visualização exposto à rede local poderia
  tentar servir arquivos fora de `out`, inclusive arquivos do repositório.
- **Correção:** a validação agora usa `path.relative` e rejeita destinos fora
  da raiz, trata percent-encoding inválido com HTTP 400 e aceita somente GET e
  HEAD.
- **Verificação:** `/` respondeu 200; tentativa de `..` respondeu 404;
  percent-encoding inválido respondeu 400; POST respondeu 405; HEAD não
  transferiu o corpo.

### SEC-002 — CSP de scripts migrada para hashes

- **Situação original:** o export estático dependia de `'unsafe-inline'` em
  `script-src` para o payload de hidratação do Next.
- **Correção atual:** `scripts/generate-csp.mjs` percorre os HTMLs exportados,
  calcula SHA-256 dos scripts inline e reescreve `out/_headers`.
- **Resultado:** `script-src` não contém `'unsafe-inline'` nem
  `'unsafe-eval'`; handlers inline são bloqueados por
  `script-src-attr 'none'`.
- **Fail closed:** `public/_headers` também não libera scripts inline. Se a
  geração de hashes não acontecer, a aplicação não deve ser publicada; o
  pipeline de deploy executa a geração e a validação antes do upload.

### SEC-003 — CORS curinga do Pages sobrescrito

- **Situação original (27/08/2026):** o Pages respondeu
  `Access-Control-Allow-Origin: *`.
- **Correção atual:** `public/_headers` define explicitamente
  `Access-Control-Allow-Origin: https://www.telmaformadoraeducacional.com.br`.
- **Gate:** a validação do artefato rejeita CORS curinga, e o healthcheck de
  produção também falha se `*` voltar a aparecer.
- **Observação:** o site continua público e estático; a restrição é hardening
  preventivo e evita que uma futura mudança de escopo herde CORS aberto.

### Resultado dos controles

- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilidades.
- `npm audit --audit-level=high`: 0 vulnerabilidades.
- O build passa e o export contém apenas as rotas e arquivos esperados; não há
  `.env`, chave privada, token, endpoint de API, upload, cookie de sessão,
  armazenamento web ou HTML inserido por string.
- Os links externos usam `noopener noreferrer` quando abrem nova aba.
- O projeto Pages existente está autenticado, usa o projeto
  `telma-santos`, publica na branch `main` e entrega CSP, HSTS, proteção contra
  framing, `nosniff`, política de referenciador, COOP e Permissions-Policy.

## Auditoria de 28/08/2026

Segunda passagem, sobre o código inteiro (~4.000 linhas), o build, os headers e
os scripts locais. As quatro correções abaixo foram implementadas, buildadas e
publicadas no deployment `51ffac8e`.

### SEC-004 — servidor de pré-visualização ouvia em todas as interfaces

- **Severidade:** baixa, limitada ao ambiente local.
- **Localização:** `scripts/serve-with-headers.mjs`.
- **Evidência:** `.listen(PORT, ...)` sem endereço vincula a `0.0.0.0`, ou seja,
  a todas as interfaces de rede da máquina.
- **Impacto:** durante uma sessão de `npm run preview:headers`, qualquer
  dispositivo na mesma rede (Wi-Fi de coworking, rede de hotel) alcançava o
  conteúdo de `out/`. É o resíduo apontado como TM-003 no threat model.
- **Correção:** vinculado a `127.0.0.1`.

### SEC-005 — `mailto:` codificava espaço como `+`

- **Severidade:** baixa; defeito funcional com origem em codificação.
- **Localização:** `lib/whatsapp.ts`, `buildMailtoLink`.
- **Evidência:** a implementação usava `URLSearchParams`, que segue as regras de
  formulário HTML e converte espaço em `+`. Numa query de formulário o servidor
  desfaz isso; numa URI `mailto:` não existe essa etapa.
- **Impacto:** o cliente de e-mail abria com o assunto literal
  `Contato+via+portfólio+—+Formação`. A primeira impressão de quem escolhe o
  canal de e-mail era uma linha de assunto quebrada.
- **Correção:** codificação com `encodeURIComponent`, que produz `%20`.
  Verificado no HTML publicado: `subject=Contato%20via%20portf%C3%B3lio`.
- **Nota de segurança:** as duas codificações neutralizam injeção de cabeçalho
  (`&cc=`, quebra de linha) no nome digitado. Não havia vulnerabilidade; havia
  um erro de apresentação.

### SEC-006 — campo de nome sem limite de tamanho

- **Severidade:** baixa.
- **Localização:** `components/sections/Contato.tsx`.
- **Evidência:** o `input` do nome não tinha `maxLength`, e seu conteúdo é
  interpolado na URL do WhatsApp e do `mailto:`.
- **Impacto:** um texto longo colado por engano gera uma URL que o WhatsApp e
  alguns clientes de e-mail truncam ou recusam sem mensagem de erro — o botão
  simplesmente não funcionaria.
- **Correção:** `maxLength={80}`.

### SEC-007 — recursos podiam ser embutidos por outras origens

- **Severidade:** baixa, hardening.
- **Localização:** `public/_headers`.
- **Evidência:** havia `Cross-Origin-Opener-Policy`, mas não
  `Cross-Origin-Resource-Policy`.
- **Impacto:** outro site podia carregar as fotos da Telma direto deste domínio
  (hotlink), consumindo a banda e exibindo a imagem fora de contexto.
- **Correção:** `Cross-Origin-Resource-Policy: same-origin`. Não afeta o
  compartilhamento em redes sociais, porque os raspadores de link buscam a
  imagem de OpenGraph pelo servidor deles, e o CORP só vale para o carregamento
  feito pelo navegador. Acrescentado também `browsing-topics=()` à
  `Permissions-Policy`, recusando a API de Topics do Chrome.

### SEC-008 — analytics do Cloudflare bloqueado pela própria CSP

- **Severidade:** informativa; nenhum risco, mas invalidava um controle que se
  supunha ativo.
- **Localização:** `public/_headers`, diretiva `script-src`.
- **Evidência:** o console do navegador registrava, em toda visita:
  `Loading the script 'https://static.cloudflareinsights.com/beacon.min.js'
  violates the following Content Security Policy directive`.
- **Impacto:** o Cloudflare injeta o beacon do Web Analytics nas respostas do
  Pages, mas a CSP o bloqueava. O painel de analytics existia e não recebia
  dado nenhum — a pior forma de falha, porque parece funcionar.
- **Correção:** `https://static.cloudflareinsights.com` em `script-src` e
  `https://cloudflareinsights.com` em `connect-src`. Nada além disso foi
  afrouxado.
- **Por que a exceção é aceitável:** o Web Analytics não usa cookie, não cria
  identificador e não acompanha o visitante entre sites, então não conflita com
  a Política de Privacidade publicada. Se o analytics for desligado no painel,
  as duas entradas devem sair: exceção de CSP sem uso é só superfície.

### Verificado e sem achado

- **Injeção de HTML:** nenhum `innerHTML`, `eval`, `new Function` ou
  `document.write` em todo o projeto. Existe um único
  `dangerouslySetInnerHTML`, em `components/seo/StructuredData.tsx`: é a forma
  documentada de emitir JSON-LD, porque o React escaparia as aspas como
  entidades HTML e entidade não é decodificada dentro de `<script>`. O conteúdo
  vem de `content/site-data.ts`, nunca do visitante, e passa por uma função que
  escapa `<` como `<` — fechando a saída por `</script>`.
- **Armazenamento no navegador:** nenhum uso de `localStorage`,
  `sessionStorage`, cookie ou `postMessage`.
- **Tipagem:** nenhum `any`, `as any`, `@ts-ignore` ou `@ts-expect-error`.
- **Vazamento de recursos:** todo `setInterval`, `setTimeout`,
  `addEventListener`, `IntersectionObserver` e `ResizeObserver` tem cleanup no
  retorno do `useEffect` correspondente.
- **Roteamento por hash:** `AreasDeAtuacao` compara o hash contra a lista
  conhecida de áreas e ignora o que não casar; não há caminho de injeção.
- **Foco e teclado:** o menu tem `role="dialog"`, `aria-modal`, `inert` quando
  fechado, armadilha de foco em Tab/Shift+Tab, fechamento por Escape, trava de
  rolagem e devolução do foco ao gatilho.
- **Links externos:** os quatro `target="_blank"` do projeto carregam
  `rel="noopener noreferrer"`.
- **Segredos:** nenhum arquivo `.env` ou `.pem` versionado; nenhuma chave,
  token ou senha no histórico rastreado.
- **404:** rota inexistente responde 404 de verdade, com `noindex`.

### Limites da auditoria

O código não contém configuração de DNS, WAF, regras de firewall, alertas,
domínio personalizado ou permissões administrativas do painel Cloudflare.
Esses controles permanecem dependentes da conta e foram verificados somente
pelos comandos e respostas HTTP disponíveis neste ambiente. O token local do
Wrangler não foi impresso nem alterado.


## Auditoria de 23/09/2026

Nova passagem de hardening sem alteração da arquitetura visual ou do modelo
estático do site.

### SEC-009 — Next.js desatualizado com advisories críticos

- **Severidade:** alta na cadeia de dependências.
- **Evidência:** a aplicação estava fixada em `next@16.3.1`.
- **Correção:** atualização para `next@16.3.6`, incluindo `@next/env`,
  binários SWC e `sharp@0.35.4` coerentes no lockfile.
- **Tooling:** `eslint-config-next` e `@next/eslint-plugin-next` também foram
  alinhados em `16.3.6`.

### SEC-010 — CSP podia restringir melhor capacidades não utilizadas

- **Severidade:** baixa, hardening preventivo.
- **Correção:** acrescentados `script-src-attr 'none'`, `media-src 'none'`,
  `frame-src 'none'`, `worker-src 'none'` e `manifest-src 'self'`;
  `base-uri` passou a `'none'` e `form-action` a `'none'`.
- **Headers complementares:** `X-Permitted-Cross-Domain-Policies: none` e
  `X-DNS-Prefetch-Control: off`.
- **Permissions-Policy:** bloqueio explícito também de acelerômetro, giroscópio,
  magnetômetro, serial, HID, Bluetooth, autoplay e fullscreen.

### SEC-011 — canal padronizado para reporte de vulnerabilidade

- **Correção:** publicado `/.well-known/security.txt` conforme o formato
  padronizado, reutilizando o endereço de contato que já é público no site.

### Qualidade e acessibilidade desta revisão

- relações ARIA do painel de Áreas de Atuação foram estabilizadas;
- `aria-current` do menu passou a representar localização dentro da página;
- o Manifesto não duplica texto para tecnologia assistiva durante a medição;
- reveals, cortina e títulos respeitam `prefers-reduced-motion` também no
  comportamento controlado por JavaScript;
- o crédito de desenvolvimento aponta para a Gandra Tech usando
  `noopener noreferrer`.

### Gates esperados antes de publicação

A revisão só deve ser publicada após:

```bash
npm ci
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev --audit-level=high
npm audit --audit-level=high
```

O workflow de CI executa esses gates com `npm ci --ignore-scripts` e mantém uma varredura completa de segredos com Gitleaks. O comando oficial de deploy também executa `npm run check:production` depois do upload; sem esse healthcheck verde, a publicação não deve ser tratada como validada.
