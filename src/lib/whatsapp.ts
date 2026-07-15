import type { DrawResult } from '@/types';

/** Quadradinho colorido por time. Casa com as cores da tela de resultado. */
const TEAM_EMOJI = ['🟦', '🟥', '🟨', '🟪'] as const;

/**
 * Código curto e legível da seed (base36). O sorteio é determinístico dada a
 * seed, então publicar o código torna o resultado auditável: mesma seed,
 * mesmos times — ninguém pode acusar o admin de roubar.
 */
export function drawCode(seed: number): string {
  return seed.toString(36).toUpperCase();
}

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
 * ⏭️ Próximo: Time 2
 *
 * 🎲 Sorteio #ABC123
 *
 * NÃO inclui skill, soma nem média. Isso é informação interna do admin.
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
    if (result.next !== undefined) {
      lines.push(`⏭️ Próximo: Time ${result.next + 1}`);
    }
  }

  lines.push('', `🎲 Sorteio #${drawCode(result.seed)}`);

  return lines.join('\n');
}
