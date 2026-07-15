/**
 * Único módulo que toca storage do navegador — hoje só o sessionStorage, para
 * dois dados transitórios: o resultado do sorteio (de /sorteio até /resultado)
 * e a seleção em andamento (sobrevive a um reload acidental no meio dos toques).
 * Os dois morrem quando o app fecha.
 *
 * O elenco NÃO passa por aqui: é lista estática em `lib/roster.ts`, editada no
 * código. O app não persiste nada do usuário além da sessão.
 *
 * Regras (CLAUDE.md):
 * - Nenhum acesso no top-level (quebraria o SSR do Next); só em useEffect/handler.
 * - Toda leitura passa por guard: try/catch no parse + validação de shape.
 *   Dado corrompido ou de versão antiga nunca derruba o app.
 */
import type { Player, Skill, Team, DrawResult } from '@/types';

const RESULT_KEY = 'futcarrara:lastResult';
const SELECTION_KEY = 'futcarrara:selection';

/** sessionStorage para o resultado do sorteio (transitório, some ao fechar). */
function ss(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
}

// --- Guards de shape --------------------------------------------------------

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function isSkill(v: unknown): v is Skill {
  // Número entre 0 e 5, em passos de 0.5. Rejeita 3.7, 6, NaN, string.
  return (
    typeof v === 'number' &&
    Number.isFinite(v) &&
    v >= 0 &&
    v <= 5 &&
    v * 2 === Math.trunc(v * 2)
  );
}

function isPlayer(v: unknown): v is Player {
  return (
    isRecord(v) &&
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    isSkill(v.skill) &&
    typeof v.active === 'boolean'
  );
}


function isStarters(v: unknown): v is [number, number] {
  return (
    Array.isArray(v) &&
    v.length === 2 &&
    typeof v[0] === 'number' &&
    typeof v[1] === 'number'
  );
}

function isTeam(v: unknown): v is Team {
  return (
    isRecord(v) &&
    Array.isArray(v.players) &&
    v.players.every(isPlayer) &&
    typeof v.total === 'number' &&
    typeof v.avg === 'number'
  );
}

function isDrawResult(v: unknown): v is DrawResult {
  return (
    isRecord(v) &&
    Array.isArray(v.teams) &&
    v.teams.every(isTeam) &&
    typeof v.seed === 'number' &&
    typeof v.spread === 'number' &&
    (v.starters === undefined || isStarters(v.starters)) &&
    (v.next === undefined || typeof v.next === 'number') &&
    (v.starterSeed === undefined || typeof v.starterSeed === 'number')
  );
}

// --- Último resultado (transitório) -----------------------------------------
// Snapshot completo do sorteio recém-feito, incluindo visitantes (que não
// existem no elenco). É como a tela de resultado recebe os times.

export function saveLastResult(result: DrawResult): void {
  const store = ss();
  if (!store) return;
  try {
    store.setItem(RESULT_KEY, JSON.stringify(result));
  } catch {
    // best-effort.
  }
}

export function loadLastResult(): DrawResult | null {
  const store = ss();
  if (!store) return null;
  try {
    const raw = store.getItem(RESULT_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return isDrawResult(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearLastResult(): void {
  const store = ss();
  if (!store) return;
  try {
    store.removeItem(RESULT_KEY);
  } catch {
    // best-effort.
  }
}

// --- Seleção em andamento (transitória) --------------------------------------
// Ids do elenco marcados + visitantes da tela de sorteio. Um reload no meio da
// seleção (troca de app no celular recarrega a página) não apaga 20 toques.

export interface DrawSelection {
  selectedIds: string[];
  guests: Player[];
}

function isDrawSelection(v: unknown): v is DrawSelection {
  return (
    isRecord(v) &&
    Array.isArray(v.selectedIds) &&
    v.selectedIds.every((id) => typeof id === 'string') &&
    Array.isArray(v.guests) &&
    v.guests.every(isPlayer)
  );
}

export function saveSelection(selection: DrawSelection): void {
  const store = ss();
  if (!store) return;
  try {
    store.setItem(SELECTION_KEY, JSON.stringify(selection));
  } catch {
    // best-effort.
  }
}

export function loadSelection(): DrawSelection | null {
  const store = ss();
  if (!store) return null;
  try {
    const raw = store.getItem(SELECTION_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return isDrawSelection(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearSelection(): void {
  const store = ss();
  if (!store) return;
  try {
    store.removeItem(SELECTION_KEY);
  } catch {
    // best-effort.
  }
}
