import type { DrawResult } from '@/types';

/** Quadradinho colorido por time. Casa com as cores da tela de resultado. */
const TEAM_EMOJI = ['🟦', '🟥', '🟨', '🟪'] as const;

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
 * NÃO inclui skill nem soma. Isso é informação interna do admin.
 */
export function formatForWhatsApp(result: DrawResult, groupName: string): string {
  const lines: string[] = [`⚽ ${groupName.toUpperCase()}`];

  result.teams.forEach((team, i) => {
    const emoji = TEAM_EMOJI[i] ?? '⬜';
    const names = team.players
      .map((p) => (p.guest ? `${p.name} (visitante)` : p.name))
      .join(', ');
    lines.push('', `${emoji} TIME ${i + 1}`, names);
  });

  if (result.starters) {
    const [a, b] = result.starters;
    lines.push('', `▶️ Começam: Time ${a + 1} x Time ${b + 1}`);
  }

  return lines.join('\n');
}
