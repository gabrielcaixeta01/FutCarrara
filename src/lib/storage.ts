/**
 * Único módulo que toca localStorage.
 * Todo acesso é client-side; chame apenas de dentro de useEffect/handlers.
 */
import type { Group, Draw } from '@/types';

const GROUP_KEY = 'futcarrara:group';
const DRAWS_KEY = 'futcarrara:draws';

export function loadGroup(): Group | null {
  // TODO
  throw new Error('not implemented');
}

export function saveGroup(group: Group): void {
  // TODO
  throw new Error('not implemented');
}

export function loadDraws(): Draw[] {
  // TODO
  throw new Error('not implemented');
}

export function saveDraw(draw: Draw): void {
  // TODO
  throw new Error('not implemented');
}

/** Serializa tudo pra download. Backup contra perda de cache. */
export function exportJSON(): string {
  // TODO
  throw new Error('not implemented');
}

/** Restaura de um backup. Deve validar o shape antes de sobrescrever. */
export function importJSON(raw: string): void {
  // TODO
  throw new Error('not implemented');
}
