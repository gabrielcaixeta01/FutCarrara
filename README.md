# Fut Carrara

Sorteio de times de futebol equilibrados por nível de habilidade.

## Problema

O grupo do WhatsApp tem ~80 pessoas, mas o fut junta 20 e poucos. Todo dia de jogo se perde tempo montando time no olho, e sempre dá discussão de time desequilibrado.

Este app resolve **só o sorteio inicial**. O que acontece depois (quem entra, quem sai, rodízio) continua sendo resolvido na quadra.

## O que o app faz

1. Guarda o elenco fixo do grupo — nome + skill de 0 a 5. Cadastra uma vez, usa sempre.
2. No dia do jogo, o admin marca quem confirmou.
3. O app sugere os formatos possíveis (ex.: 20 selecionados → `4×5` ou `3×6`).
4. Sorteia os times o mais equilibrados possível.
5. Se forem 3+ times, sorteia também quais dois começam jogando.
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
| Persistência | localStorage | App single-user, offline-first |
| Testes | Vitest | Foco no algoritmo de balanceamento |
| Deploy | Vercel | `output: 'export'`, sem servidor |

**Sem backend, sem banco, sem auth.** Todo o estado vive no `localStorage` do dispositivo do admin — e só lá. Não há backup: se o admin limpar os dados do site, o elenco se perde e é recadastrado na mão. É uma troca consciente (ver Roadmap). Instalar o app na tela inicial protege contra o despejo automático de storage que o iOS faz em sites não instalados.

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
│   ├── elenco/page.tsx       # CRUD do elenco
│   └── sorteio/page.tsx      # Seleção + sorteio + resultado
├── components/
│   ├── ui/                   # shadcn (button, input, dialog, ...)
│   ├── elenco/               # PlayerList, PlayerForm, SkillPicker
│   ├── sorteio/              # PlayerGrid, FormatPicker, SelectionCounter
│   └── resultado/           # TeamCard, StartersBadge, CopyToWhatsApp
├── lib/
│   ├── balance.ts            # ⭐ algoritmo (função pura)
│   ├── storage.ts            # wrapper do localStorage
│   ├── whatsapp.ts           # formata o resultado como texto
│   ├── utils.ts              # cn(), helpers
│   └── __tests__/
│       └── balance.test.ts
├── hooks/
│   ├── useGroup.ts           # elenco (CRUD + persistência)
│   └── useDraw.ts            # estado do sorteio em andamento
└── types/
    └── index.ts              # Player, Group, Draw, Team
```

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # vitest
npm run build      # gera ./out (static)
```

## Roadmap

- [x] Tipos + algoritmo + testes
- [x] localStorage + hooks
- [x] Tela de elenco (CRUD)
- [x] Tela de sorteio (grid + formatos)
- [x] Tela de resultado + copiar pro WhatsApp
- [x] PWA (instalável no celular)
- [x] Deploy na Vercel

Fora de escopo, por decisão: **export/import de JSON** e **histórico de sorteios**.
Os dois já existiram no código e foram removidos — o app é de uso pontual, o
elenco é fácil de recadastrar, e um sorteio passado não serve pra nada depois
que o jogo acabou. Menos código, menos estado, menos manutenção.
