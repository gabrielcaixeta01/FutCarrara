# PWA — Fut Carrara

**Data:** 2026-07-14
**Etapa do roadmap:** 7 (última)
**Status:** aprovado

## Objetivo

Tornar o app instalável como PWA e 100% funcional offline. O app já é
offline-first por natureza (localStorage, sem backend); falta o shell
estático ficar disponível sem rede e o app ser instalável na tela inicial.

## Decisões

| Decisão | Escolha |
|---|---|
| Hospedagem | Vercel/Netlify, raiz do domínio (paths absolutos `/...`) |
| Atualização | Automática no próximo uso (sem `skipWaiting`, sem UI de update) |
| Ícone | Gerado (fundo `#0b1a12`, identidade "FC" na estética atual) |
| Service worker | Manual + script postbuild — **zero dependências novas** |

## Componentes

### 1. Manifest — `public/manifest.json`

Estático, escrito à mão:

- `name`/`short_name`: "Fut Carrara"
- `description`: mesma do `metadata` atual
- `display: "standalone"`, `start_url: "/"`, `scope: "/"`
- `background_color` e `theme_color`: `#0b1a12`
- `lang: "pt-BR"`
- Ícones: `icon-192.png`, `icon-512.png` (purpose `any`),
  `icon-maskable-512.png` (purpose `maskable`)

Linkado no `layout.tsx` via `metadata.manifest`. Também no `metadata`:
`appleWebApp` (`capable`, `statusBarStyle`, `title`) e apple-touch-icon,
para instalação correta no iOS.

### 2. Ícones — `scripts/generate-icons.mjs`

Script Node sem dependências de package.json: desenha o ícone em SVG
(fundo verde-campo `#0b1a12`, monograma "FC") e rasteriza usando
utilitário já presente na máquina (`rsvg-convert` ou `sips`, detectado
em runtime). Gera em `public/`:

- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`
  (maskable com safe zone de 20%)
- `apple-touch-icon.png` (180×180)

Os PNGs ficam **commitados**. O script só roda manualmente para regenerar.

### 3. Service worker — `scripts/sw-template.js`

(Fica em `scripts/`, não em `public/`: tudo em `public/` é copiado
literalmente para `out/`, e o template não deve ir para produção.)

Escrito à mão (~80 linhas), template com placeholders `__PRECACHE__` e
`__VERSION__` preenchidos pelo postbuild:

- **install:** abre cache `futcarrara-<version>` e precacheia a lista
  inteira. Sem `skipWaiting` — a versão nova espera o app fechar.
- **activate:** apaga todo cache `futcarrara-*` que não seja a versão
  atual; `clients.claim()`.
- **fetch:** só GET same-origin. Cache-first (o conteúdo é imutável
  dentro de uma versão). Navegações (`request.mode === 'navigate'`) com
  fallback para `/` quando offline e a rota não está no cache.

### 4. Postbuild — `scripts/generate-sw.mjs`

Script Node puro (fs, path, crypto):

1. Varre `./out` recursivamente e monta a lista de precache: `.html`
   (mapeado para a URL da rota), `_next/static/**` (js, css, fontes,
   media), ícones e `manifest.json`.
2. `__VERSION__` = hash SHA-256 do conteúdo concatenado dos arquivos
   (build muda → versão muda → cache antigo é descartado no activate).
3. Grava `out/sw.js` a partir do template.

A lógica de montar lista + hash fica em funções puras exportadas no
próprio script. Entra no `package.json` como `"postbuild"` — o Next
roda automaticamente após `npm run build`.

### 5. Registro — `src/components/ServiceWorkerRegister.tsx`

`'use client'`, export nomeado, sem UI. `useEffect` que registra
`/sw.js` apenas quando `process.env.NODE_ENV === 'production'` e
`'serviceWorker' in navigator`. Montado no `layout.tsx`.

## Fora do escopo

Push notifications, background sync, prompt customizado de instalação,
UI de "nova versão disponível", suporte a subpath (GitHub Pages).

## Verificação

1. `npm run build` gera `out/sw.js` com precache completo.
2. Servir `./out` (ex.: `npx serve out`), abrir no Chrome:
   - DevTools → Application → Manifest sem erros, instalável.
   - Service worker ativo; com "Offline" marcado, todas as rotas
     (`/`, `/elenco`, `/sorteio`, `/resultado`) carregam.
3. `npm run test:run` e `npm run lint` seguem verdes.
