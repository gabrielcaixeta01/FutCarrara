# CLAUDE.md

Contexto do projeto para o Claude Code. Leia antes de qualquer alteração.

## O que é

App de sorteio de times de futebol. Single-user (só o admin opera), offline-first, sem backend. Ver `README.md` para o escopo completo.

## Comandos

```bash
npm run dev      # dev server
npm test         # vitest (roda em watch)
npm run test:run # vitest single run
npm run lint
npm run build    # static export → ./out
```

## Arquitetura

Três camadas, sem vazamento entre elas:

1. **`src/lib/balance.ts`** — lógica de sorteio. Funções **puras**. Sem React, sem `localStorage`, sem `Date.now()` implícito, sem `Math.random()` direto. A seed entra como parâmetro. É o coração do app e é o único lugar com cobertura de teste obrigatória.
2. **`src/lib/storage.ts` + `src/hooks/`** — persistência e estado. Único lugar que toca `localStorage`.
3. **`src/app/` + `src/components/`** — UI. Não implementa regra de negócio; só chama `lib` e `hooks`.

## Regras invioláveis

- **`balance.ts` não importa nada.** Nenhum módulo do projeto, nenhuma lib externa. Se precisar de aleatoriedade, use o `mulberry32` local com a seed recebida. Isso garante que o sorteio seja reproduzível a partir da seed.
- **Aleatoriedade sempre seedada.** Nunca `Math.random()` dentro de `lib/`. Componentes podem gerar a seed inicial (`Date.now()`), mas passam pra baixo.
- **Skill é `0 | 1 | 2 | 3 | 4 | 5`**, inteiro. Não vira float, não vira decimal, não vira "média de votos".
- **`selecionados === numTeams * perTeam`.** Sempre. O sorteio lança erro se não bater. A UI impede o clique antes disso.
- **Sem `any`.** TypeScript em strict mode.
- **Não adicione dependência sem necessidade.** Especialmente: nada de state manager (Redux/Zustand/Jotai), nada de fetch lib, nada de date lib. O app não tem servidor nem datas.

## Convenções

- Componentes: `PascalCase.tsx`. Um componente por arquivo, export nomeado.
- Hooks: `useAlgumaCoisa.ts`.
- Utilitários: `camelCase.ts`, funções puras exportadas nomeadamente.
- Texto de UI em **português brasileiro**. Nomes de código em inglês.
- Tailwind: use `cn()` de `lib/utils.ts` para merge de classes. Sem CSS-in-JS, sem arquivos `.css` novos além do global.

## Estado de desenvolvimento

O projeto é construído nesta ordem. Não pule etapas:

1. `types/index.ts` → `lib/balance.ts` → `lib/__tests__/balance.test.ts` ✅ **começar aqui**
2. `lib/storage.ts` + `hooks/useGroup.ts`
3. Tela `/elenco`
4. Tela `/sorteio`
5. Resultado + `lib/whatsapp.ts`
6. Export/import JSON
7. PWA

## Domínio (glossário)

| Termo | Significado |
|---|---|
| **Elenco** | Os ~80 jogadores cadastrados no grupo. Persistente. |
| **Skill** | Nível do jogador, 0–5. Definido pelo admin. |
| **Confirmados** | Subconjunto do elenco selecionado para o sorteio de hoje. |
| **Formato** | `numTeams × perTeam`. Ex.: `4×5`, `3×6`, `2×6`. |
| **Sobras** | Confirmados que excedem `numTeams × perTeam`. Ficam de fora do sorteio. |
| **Spread** | `max(soma de skill) - min(soma de skill)` entre times. Quanto menor, melhor. |
| **Starters** | Os 2 times que começam jogando, quando há 3+. Sorteados. |

## Armadilhas conhecidas

- **Não persista ordem de chegada.** O admin sabe quem chegou primeiro; ele só marca as pessoas na tela. O app não modela isso.
- **A ordem dos jogadores dentro do time exibido deve ser embaralhada.** Se sair ordenada por skill, o pessoal vai ler o ranking e reclamar.
- **Balancear por soma só funciona com times do mesmo tamanho.** Como `perTeam` é fixo dentro de um sorteio, soma serve. Se algum dia os times puderem ter tamanhos diferentes, o custo precisa virar média — mas isso está fora do escopo hoje.
- **`localStorage` é síncrono e só existe no client.** Todo acesso passa por `storage.ts` e roda dentro de `useEffect`, nunca no render. Componentes que dependem dele são `'use client'`.
