import type { DrawResult } from '@/types';
import { teamSelecoes } from './teams';

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
 * 🇧🇷 BRASIL
 * Fulano, Ciclano, ...
 *
 * 🇦🇷 ARGENTINA
 * ...
 *
 * ▶️ Começam: Brasil x Espanha
 * ⏭️ Próximo: Argentina
 *
 * 🎲 Sorteio #ABC123
 *
 * NÃO inclui skill, soma nem média. Isso é informação interna do admin.
 */
export function formatForWhatsApp(result: DrawResult, groupName: string): string {
  const lines: string[] = [`⚽ ${groupName.toUpperCase()}`];

  const selecoes = teamSelecoes(result.seed, result.teams.length);

  result.teams.forEach((team, i) => {
    const s = selecoes[i]!;
    const names = team.players
      .map((p) => (p.guest ? `${p.name} (visitante)` : p.name))
      .join(', ');
    lines.push('', `${s.flag} ${s.name.toUpperCase()}`, names);
  });

  if (result.starters) {
    const [a, b] = result.starters;
    lines.push('', `▶️ Começam: ${selecoes[a]!.name} x ${selecoes[b]!.name}`);
    if (result.next !== undefined) {
      lines.push(`⏭️ Próximo: ${selecoes[result.next]!.name}`);
    }
  }

  lines.push('', `🎲 Sorteio #${drawCode(result.seed)}`);

  return lines.join('\n');
}
