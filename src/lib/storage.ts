/**
 * Único módulo que toca localStorage.
 * Todo acesso é client-side; chame apenas de dentro de useEffect/handlers.
 *
 * Regras (CLAUDE.md):
 * - Nenhum acesso a localStorage no top-level (quebraria o SSR do Next).
 * - Toda leitura passa por guard: try/catch no parse + validação de shape.
 *   Dado corrompido ou de versão antiga nunca derruba o app.
 */
import type {
  Group,
  Draw,
  DrawPlayer,
  Player,
  Skill,
  Team,
  DrawResult,
} from '@/types';

const GROUP_KEY = 'futcarrara:group';
const DRAWS_KEY = 'futcarrara:draws';
const RESULT_KEY = 'futcarrara:lastResult';
const SCHEMA_VERSION = 1;

/** Acesso a localStorage tolerante a SSR e a modos onde ele lança/está off. */
function ls(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

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
  return typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 5;
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

function isGroup(v: unknown): v is Group {
  return (
    isRecord(v) &&
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    Array.isArray(v.players) &&
    v.players.every(isPlayer)
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

function isDrawPlayer(v: unknown): v is DrawPlayer {
  return (
    isRecord(v) &&
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    isSkill(v.skill) &&
    (v.guest === undefined || v.guest === true)
  );
}

function isDrawTeams(v: unknown): v is DrawPlayer[][] {
  return (
    Array.isArray(v) &&
    v.every((t) => Array.isArray(t) && t.every(isDrawPlayer))
  );
}

function isDraw(v: unknown): v is Draw {
  return (
    isRecord(v) &&
    typeof v.id === 'string' &&
    typeof v.groupId === 'string' &&
    typeof v.createdAt === 'number' &&
    typeof v.seed === 'number' &&
    typeof v.numTeams === 'number' &&
    typeof v.perTeam === 'number' &&
    isDrawTeams(v.teams) &&
    (v.starters === undefined || isStarters(v.starters)) &&
    (v.starterSeed === undefined || typeof v.starterSeed === 'number')
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
    (v.starterSeed === undefined || typeof v.starterSeed === 'number')
  );
}

// --- Group ------------------------------------------------------------------

export function loadGroup(): Group | null {
  const store = ls();
  if (!store) return null;
  try {
    const raw = store.getItem(GROUP_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return isGroup(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveGroup(group: Group): void {
  const store = ls();
  if (!store) return;
  try {
    store.setItem(GROUP_KEY, JSON.stringify(group));
  } catch {
    // best-effort: quota cheia ou modo privado não deve derrubar o app.
  }
}

// --- Draws ------------------------------------------------------------------

export function loadDraws(): Draw[] {
  const store = ls();
  if (!store) return [];
  try {
    const raw = store.getItem(DRAWS_KEY);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Descarta silenciosamente entradas corrompidas, mantém o resto.
    return parsed.filter(isDraw);
  } catch {
    return [];
  }
}

function writeDraws(draws: Draw[]): void {
  const store = ls();
  if (!store) return;
  try {
    store.setItem(DRAWS_KEY, JSON.stringify(draws));
  } catch {
    // best-effort.
  }
}

export function saveDraw(draw: Draw): void {
  const draws = loadDraws().filter((d) => d.id !== draw.id);
  draws.push(draw);
  writeDraws(draws);
}

/**
 * Aplica um patch a um Draw já salvo (ex.: re-sorteio dos starters).
 * Corrige o registro do que aconteceu — não cria sorteio novo.
 */
export function updateDraw(id: string, patch: Partial<Omit<Draw, 'id'>>): void {
  const draws = loadDraws();
  const idx = draws.findIndex((d) => d.id === id);
  const existing = draws[idx];
  if (!existing) return;
  draws[idx] = { ...existing, ...patch };
  writeDraws(draws);
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

// --- Backup -----------------------------------------------------------------

/** Serializa tudo pra download. Backup contra perda de cache. */
export function exportJSON(): string {
  const payload = {
    version: SCHEMA_VERSION,
    group: loadGroup(),
    draws: loadDraws(),
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Restaura de um backup. Valida o shape ANTES de sobrescrever qualquer coisa.
 * Se o payload for inválido, lança erro e não toca no que já está salvo.
 */
export function importJSON(raw: string): void {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Backup inválido: não é um JSON válido.');
  }

  if (!isRecord(parsed)) {
    throw new Error('Backup inválido: estrutura inesperada.');
  }
  if (parsed.version !== SCHEMA_VERSION) {
    throw new Error(
      `Backup inválido: versão ${String(parsed.version)} não suportada (esperado ${SCHEMA_VERSION}).`,
    );
  }

  const group = parsed.group;
  if (group !== null && !isGroup(group)) {
    throw new Error('Backup inválido: grupo com formato incorreto.');
  }

  const draws = parsed.draws;
  if (!Array.isArray(draws) || !draws.every(isDraw)) {
    throw new Error(
      'Backup inválido: histórico de sorteios com formato incorreto.',
    );
  }

  // Tudo validado — só agora grava.
  if (group !== null) saveGroup(group);
  writeDraws(draws);
}
