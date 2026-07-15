# Fut Carrara

Sorteio de times de futebol equilibrados por nível de habilidade.

## Problema

O grupo do WhatsApp tem ~80 pessoas, mas o fut junta 20 e poucos. Todo dia de jogo se perde tempo montando time no olho, e sempre dá discussão de time desequilibrado.

Este app resolve **só o sorteio inicial**. O que acontece depois (quem entra, quem sai, rodízio) continua sendo resolvido na quadra.

## O que o app faz

1. Conhece o elenco fixo do grupo — nome + skill de 0 a 5. A lista mora no
   código (`src/lib/roster.ts`) e só o dono edita; a tela de elenco é só leitura.
2. No dia do jogo, o admin marca quem confirmou.
3. O app sugere os formatos possíveis (ex.: 20 selecionados → `4×5` ou `3×6`).
4. Sorteia os times o mais equilibrados possível.
5. Se forem 3+ times, sorteia também quais dois começam e quem entra depois.
6. Botão pra copiar o resultado formatado e colar no grupo do WhatsApp.

## O que o app NÃO faz

Deliberadamente fora de escopo:

- Confirmação de presença pelos jogadores (só o admin opera o app)
- Data, horário, local, check-in, geolocalização
- Ordem de chegada persistida (o admin sabe quem chegou primeiro; o app só precisa da lista final)
- Placar, rodadas, fila de espera, quem entra depois
- Login, contas, multi-usuário, backend

Se algum desses virar necessidade real, aí sim se discute backend. Não antes.

## Stack

| Camada | Tecnologia | Motivo |
|---|---|---|
| Framework | Next.js 15 (App Router) | Static export, deploy trivial |
| Linguagem | TypeScript (strict) | |
| UI | React 19 + Tailwind CSS v4 | |
| Componentes | shadcn/ui | Base acessível, sem lock-in |
| Persistência | nenhuma (elenco no código) | App single-user, offline-first |
| Testes | Vitest | Foco no algoritmo de balanceamento |
| Deploy | Vercel | `output: 'export'`, sem servidor |

**Sem backend, sem banco, sem auth — e sem estado do usuário.** O elenco é uma lista estática no código, versionada no git: mudar nível de alguém é editar `src/lib/roster.ts` e fazer deploy. O app não grava nada no aparelho além do resultado do sorteio atual, que vive no `sessionStorage` e some ao fechar. Logo: não tem o que perder, não tem o que sincronizar e não tem backup pra fazer.

## Regras de negócio

- Skill é um inteiro de **0 a 5**. Só o admin edita.
- Jogadores por time: **5, 6 ou 7**.
- Número de times: **2, 3 ou 4**.
- O sorteio exige `selecionados === numTimes × porTime`. Sobras ficam de fora do sorteio.
- Todo sorteio guarda a `seed` que o gerou — mesma seed, mesmo resultado.
- A ordem dos jogadores dentro de um time é embaralhada na exibição, pra não revelar o ranking de skill.

## Algoritmo de balanceamento

1. **Snake draft** — ordena por skill (desc) e distribui em serpentina (1-2-3-3-2-1). Já chega perto do ótimo.
2. **Local search** — ~2000 iterações trocando dois jogadores de times diferentes; aceita a troca se reduzir o custo.
3. **Função de custo** — prioriza minimizar `max(soma) - min(soma)` entre os times. Desempata pelo menor desvio-padrão *dentro* de cada time, o que evita o cenário "3 craques + 3 pernas de pau" empatando com "6 medianos".

Roda em milissegundos no browser. É uma função pura em `src/lib/balance.ts` — sem I/O, sem estado, totalmente testável.

## Estrutura

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Home → atalhos p/ elenco e sorteio
│   ├── elenco/page.tsx       # Elenco (só leitura): busca, filtros, níveis
│   ├── sorteio/page.tsx      # Seleção dos confirmados + visitantes + formato
│   └── resultado/page.tsx    # Times sorteados, quem começa, copiar pro zap
├── components/
│   ├── ui/                   # SearchField, ConfirmDialog, MobileNav, ...
│   ├── elenco/               # PlayerRow, Filters
│   ├── sorteio/              # PlayerTile, GuestAdder, GuestCard, SortearFooter
│   └── resultado/            # TeamCard, StartersBanner, teamColors
├── lib/
│   ├── balance.ts            # ⭐ algoritmo (puro, não importa nada)
│   ├── roster.ts             # ⭐ o elenco — edite aqui pra mudar jogador/nível
│   ├── levels.ts             # nome dos níveis, meio ponto
│   ├── storage.ts            # sessionStorage do resultado atual (só isso)
│   ├── whatsapp.ts           # formata o resultado como texto
│   ├── utils.ts              # cn(), uid()
│   └── __tests__/            # balance, roster, levels, whatsapp
└── types/
    └── index.ts              # Skill, Player, Team, DrawResult, Format
```

**Não há `hooks/`, nem estado global, nem CRUD.** O elenco é constante do bundle;
as telas leem `ROSTER` direto.

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # vitest
npm run build      # gera ./out (static)
```

## Roadmap

- [x] Tipos + algoritmo + testes
- [x] Elenco estático no código
- [x] Tela de elenco (leitura, busca, filtros)
- [x] Tela de sorteio (grid + formatos + visitantes)
- [x] Tela de resultado + copiar pro WhatsApp
- [x] PWA (instalável no celular)
- [x] Deploy na Vercel

**MVP fechado.** Fora de escopo por decisão: edição de elenco pelo app,
export/import de JSON e histórico de sorteios. Os três já existiram no código e
foram removidos. O elenco é do dono e mora no git; um sorteio passado não serve
pra nada depois que o jogo acabou. Menos código, menos estado, menos manutenção.

## Como editar o elenco

Abra `src/lib/roster.ts`, mexa na lista, commite e faça deploy. Os testes de
`roster.test.ts` seguram os erros bobos (id repetido, skill fora do domínio).
