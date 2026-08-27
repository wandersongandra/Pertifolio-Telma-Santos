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
| Cookies / analytics | Nenhum. Por isso também não há banner de consentimento. |
| Dependências em runtime | `clsx`, `lenis`, `motion`, `next`, `react`, `react-dom`. |
| Recursos de terceiros | **Nenhum.** Nenhum script, CSS, fonte ou imagem é carregado de outra origem. |

O que resta como risco relevante: **conteúdo estático servido ao navegador** e
**links de saída**. É o que os controles abaixo endereçam.

---

## Controles aplicados

Todos vivem em [`public/_headers`](public/_headers), lido pelo Cloudflare Pages.

### Content-Security-Policy

```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none';
base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
```

Tudo travado em `'self'`. Duas observações honestas:

- **`'unsafe-inline'` em `script-src` é obrigatório aqui.** Um export estático
  não tem servidor para emitir *nonce* por requisição, e o build embute o
  payload de hidratação do React inline (`self.__next_f.push(...)`). Remover
  `'unsafe-inline'` quebra a hidratação e todas as animações. É uma limitação
  do modelo estático, não um descuido — e o impacto é mitigado pelo fato de que
  não há entrada de usuário refletida em HTML: todo o conteúdo vem de
  `content/site-data.ts`, escrito no repositório.
- **`font-src 'self'` é suficiente** porque `next/font` baixa Fraunces e Manrope
  em tempo de build e as auto-hospeda. O site não fala com `fonts.gstatic.com`.

### Demais headers

| Header | Valor | Por quê |
|---|---|---|
| `X-Frame-Options` | `DENY` | Impede *clickjacking*. Redundante com `frame-ancestors 'none'`, mantido para navegadores antigos. |
| `X-Content-Type-Options` | `nosniff` | Impede o navegador de reinterpretar o tipo de um arquivo. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | O caminho da página não vaza para WhatsApp, Instagram ou LinkedIn ao clicar num link de saída. |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isola o contexto de navegação de janelas de outras origens. |
| `Permissions-Policy` | câmera, microfone, geolocalização, pagamento e USB desligados | O site não usa nenhuma dessas APIs; desligar remove o risco de um recurso futuro (ou um script injetado) usá-las. |
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

O esperado são apenas: a própria URL do site, `w3.org` (namespaces de SVG),
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
- **`'unsafe-inline'` em `script-src`.** Ver a explicação acima. Só sairia com
  um servidor emitindo nonce, ou seja, abandonando o export estático.
- **Perfis externos não validados.** Os links de Instagram
  (`@telmasantosformadora`) e LinkedIn (`linkedin.com/in/prof-telma`) não foram
  verificados automaticamente. Confirme manualmente que os perfis existem.

---

## Reportar um problema

Envie para o e-mail de contato publicado no site. Não abra issue pública para
falhas de segurança.
