import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function uid(): string {
  return crypto.randomUUID();
}

/**
 * Normaliza texto pra busca e slug: sem acento, minúsculo, sem espaço nas
 * pontas. "José" casa com "jose".
 *
 * A regex usa \u0300-\u036f (marcas combinantes do Unicode) por escape, nunca
 * os caracteres literais: cru, é byte invisível que um editor ou merge pode
 * comer sem erro — e a busca pararia de casar acento silenciosamente.
 */
export function normalizeText(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
