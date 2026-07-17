# CLAUDE.md

Contexto do projeto para o Claude Code. Leia antes de qualquer alteração.

## O que é

App de sorteio de times de futebol. Single-user (só o admin opera), offline-first, sem backend. Ver `README.md` para o escopo completo.

## Comandos

```bash
npm run dev      # dev server
npm test         # vitest (roda em watch)
npm run test:run # vitest single run
npm run test:e2e # smoke do fluxo no navegador (rode npm run build antes)
npm run lint
npm run build    # static export → ./out
```

## Arquitetura

Camadas, sem vazamento entre elas:

1. **`src/lib/balance.ts`** — lógica de sorteio. Funções **puras**. Sem React, sem `localStorage`, sem `Date.now()` implícito, sem `Math.random()` direto. A seed entra como parâmetro. É o coração do app e é o único lugar com cobertura de teste obrigatória.
2. **`src/lib/roster.ts`** — o elenco. Lista **estática**, editada à mão no código. Não vem de storage, não é editável pelo app. É a fonte única de verdade dos jogadores.
3. **`src/lib/highlights.ts`** — as cartas de `/destaques`. Lista **estática** editada à mão, no mesmo espírito do `roster.ts` (a figurinha vai em `/public`, em webp). É uma lista à parte: carta não é jogador do elenco e não entra no sorteio. O rating não é declarado — `ratingOf()` tira a média dos seis atributos, então mexer num stat move o overall sozinho.
4. **`src/lib/storage.ts`** — único lugar que toca storage do navegador. Hoje só `sessionStorage`, para dois dados transitórios: o resultado de `/sorteio` até `/resultado` e a seleção em andamento (sobrevive a reload, morre ao fechar o app). **Nada do usuário é persistido além da sessão.**
5. **`src/app/` + `src/components/`** — UI. Não implementa regra de negócio; só chama `lib`.

## Regras invioláveis

- **`balance.ts` não importa nada.** Nenhum módulo do projeto, nenhuma lib externa. Se precisar de aleatoriedade, use o `mulberry32` local com a seed recebida. Isso garante que o sorteio seja reproduzível a partir da seed.
- **Aleatoriedade sempre seedada.** Nunca `Math.random()` dentro de `lib/`. Componentes podem gerar a seed inicial (`Date.now()`), mas passam pra baixo.
- **Skill é `0` a `5` em passos de `0.5`** (11 valores). Não vira contínuo, não vira "média de votos". O meio ponto é um modificador visual (▲) dentro do nível, não um nível novo: o **nível base** (`Level`, 0–5 inteiro) é que nomeia e agrupa. Ver `lib/levels.ts`.
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

**MVP pronto e no ar (Vercel).** Elenco, sorteio, resultado com WhatsApp e PWA
instalável estão completos. Daqui pra frente é manutenção e ajuste fino.

Antes de commitar: `npm run typecheck`, `npm run lint` e `npm run test:run`.

## Fora de escopo (não reintroduzir sem pedir)

Estas features **existiram e foram removidas por decisão do dono**. Se parecerem
uma boa ideia, elas já foram consideradas — pergunte antes de trazer de volta:

- **Edição de elenco pelo app.** O elenco é uma lista estática em `lib/roster.ts`,
  editada no código pelo dono. A tela `/elenco` é **só leitura**: lista, busca,
  filtros e agrupamento — nunca botão de adicionar, remover ou mudar nível.
  Não existe hook de elenco nem persistência de jogador.
- **Export/import de JSON.** Sem backup, e sem nada pra fazer backup: o elenco
  mora no git, não no aparelho.
- **Histórico de sorteios.** Sorteio passado não serve pra nada depois do jogo.
  Não existe o tipo `Draw`, nem persistência de sorteios: o resultado atual mora
  no `sessionStorage` e acabou.

## Domínio (glossário)

| Termo | Significado |
|---|---|
| **Elenco** | Os jogadores do grupo. Lista estática em `lib/roster.ts`, editada no código. |
| **Carta / Destaque** | Cartinha estilo FIFA da tela `/destaques`. Lista estática em `lib/highlights.ts`, separada do elenco. Tem seis atributos próprios (0–99), que **não** têm relação com o `skill` do sorteio. |
| **Rating / Overall** | Média dos seis atributos de uma carta (`ratingOf`). Derivado, nunca declarado à mão. |
| **Tier** | Moldura da carta. Sai da régua de rating (bronze/prata/ouro), salvo quando declarado à mão (`icon`, `totw`, `goat`). |
| **Skill** | Nível do jogador, 0–5 em passos de 0.5. Definido pelo dono, no código. |
| **Nível (Level)** | Nível base: `Math.floor(skill)`, 0–5 inteiro. É o que tem nome ("Craque") e agrupa a UI. |
| **Aposentado** | `active: false`. Fica no elenco, some do sorteio. |
| **Confirmados** | Subconjunto do elenco selecionado para o sorteio de hoje. |
| **Visitante** | Jogador avulso, só do sorteio de hoje. Nível inteiro apenas; não entra no elenco. |
| **Formato** | `numTeams × perTeam`. Ex.: `4×5`, `3×6`, `2×6`. |
| **Sobras** | Confirmados que excedem `numTeams × perTeam`. Hoje a UI **não permite**: só formatos exatos aparecem. |
| **Spread** | `max(soma de skill) - min(soma de skill)` entre times. Quanto menor, melhor. |
| **Starters** | Os 2 times que começam jogando, quando há 3+. Sorteados. |
| **Próximo** | O 3º da ordem sorteada: entra quando o primeiro jogo acabar. |

## Armadilhas conhecidas

- **Não persista ordem de chegada.** O admin sabe quem chegou primeiro; ele só marca as pessoas na tela. O app não modela isso.
- **A ordem dos jogadores dentro do time exibido deve ser embaralhada.** Se sair ordenada por skill, o pessoal vai ler o ranking e reclamar.
- **Balancear por soma só funciona com times do mesmo tamanho.** Como `perTeam` é fixo dentro de um sorteio, soma serve. Se algum dia os times puderem ter tamanhos diferentes, o custo precisa virar média — mas isso está fora do escopo hoje.
- **`sessionStorage` é síncrono e só existe no client.** Todo acesso passa por `storage.ts` e roda dentro de `useEffect`, nunca no render. Componentes que dependem dele são `'use client'`. O elenco não tem esse problema: vem de `roster.ts`, é constante do bundle e pode ser lido no render.
- **Não duplique regra de negócio na UI.** A tabela `EXACT` do `SortearFooter` é derivada de `validFormats()` no load do módulo (UI chamando lib é permitido). Se mexer nos formatos do `balance.ts`, ela acompanha sozinha — não a reescreva à mão.
- **A régua de tier das cartas mora no `HighlightCard`, não na lib.** `ratingOf()` está em `lib/highlights.ts`, mas o corte bronze/prata/ouro está no componente. É a única regra de destaques fora da lib — se for mexer nos cortes, é lá. Considere mover pra lib se ela crescer.
