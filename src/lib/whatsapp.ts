import type { DrawResult } from '@/types';

/**
 * Formata o resultado como texto pronto pra colar no grupo.
 *
 * ⚽ FUTEBOL CARRARA
 *
 * 🟦 TIME 1
 * Fulano, Ciclano, ...
 *
 * 🟥 TIME 2
 * ...
 *
 * ▶️ Começam: Time 1 x Time 3
 *
 * NÃO inclua skill nem soma no texto. Isso é informação interna do admin.
 */
export function formatForWhatsApp(result: DrawResult, groupName: string): string {
  // TODO
  throw new Error('not implemented');
}
