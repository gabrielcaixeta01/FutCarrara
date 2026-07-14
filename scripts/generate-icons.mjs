// Gera os ícones do PWA em public/ a partir de um SVG desenhado aqui.
// Uso: node scripts/generate-icons.mjs
// Requer rsvg-convert ou sips (macOS) no PATH — nada de dependência npm.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BG = '#0b1a12';
const LINE = '#1e4030';
const FG = '#eaf6ec';

// scale < 1 encolhe o conteúdo para a safe zone de ícones maskable.
function iconSvg(scale) {
  const r = Math.round(148 * scale);
  const fontSize = Math.round(190 * scale);
  const baseline = Math.round(256 + 66 * scale);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG}"/>
  <line x1="0" y1="256" x2="512" y2="256" stroke="${LINE}" stroke-width="14"/>
  <circle cx="256" cy="256" r="${r}" fill="${BG}" stroke="${LINE}" stroke-width="14"/>
  <text x="256" y="${baseline}" text-anchor="middle"
    font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
    font-weight="900" font-size="${fontSize}" fill="${FG}">FC</text>
</svg>
`;
}

function hasCommand(cmd) {
  try {
    execFileSync(cmd, ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function rasterize(svgPath, pngPath, size) {
  if (hasCommand('rsvg-convert')) {
    execFileSync('rsvg-convert', ['-w', String(size), '-h', String(size), svgPath, '-o', pngPath]);
  } else {
    execFileSync('sips', ['-s', 'format', 'png', '-z', String(size), String(size), svgPath, '--out', pngPath], { stdio: 'ignore' });
  }
}

const targets = [
  { file: 'icon-192.png', size: 192, scale: 1 },
  { file: 'icon-512.png', size: 512, scale: 1 },
  { file: 'icon-maskable-512.png', size: 512, scale: 0.75 },
  { file: 'apple-touch-icon.png', size: 180, scale: 1 },
];

const tmp = mkdtempSync(join(tmpdir(), 'futcarrara-icons-'));
try {
  for (const { file, size, scale } of targets) {
    const svgPath = join(tmp, `${file}.svg`);
    writeFileSync(svgPath, iconSvg(scale));
    rasterize(svgPath, join('public', file), size);
    console.log(`public/${file} (${size}x${size})`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
