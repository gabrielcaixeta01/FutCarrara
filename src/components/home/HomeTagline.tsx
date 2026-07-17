'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Frases da abertura — uma sai sorteada a cada visita. Lista estática no
 * espírito do roster: pra mudar a resenha, edite aqui e faça deploy.
 */
const PHRASES = [
  'O algoritmo não tem amigo.',
  'Fim da panelinha do Carrara.',
  'Quem chega por último vai pro gol.',
  'Time que não corre, roda.',
  'Reclamação, só depois do segundo gol.',
  'A resenha começa no sorteio.',
  'Sem choro: o sorteio decidiu.',
  'Todo mundo é craque até a bola rolar.',
] as const;

export function HomeTagline() {
  // Sorteio no client, depois do mount: no servidor não existe aleatoriedade
  // sem quebrar a hidratação. Date.now() como semente, como no resto do app.
  // O fade-in cobre a troca — e a splash ainda está na frente nesse momento.
  const [phrase, setPhrase] = useState<string | null>(null);

  useEffect(() => {
    setPhrase(PHRASES[Date.now() % PHRASES.length]!);
  }, []);

  return (
    <p
      className={cn(
        'min-h-5 max-w-xs text-sm text-ink-soft transition-opacity duration-500',
        phrase ? 'opacity-100' : 'opacity-0',
      )}
    >
      {phrase ? `— ${phrase}` : ' '}
    </p>
  );
}
