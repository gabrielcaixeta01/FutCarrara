/**
 * Smoke test do fluxo principal, contra o build estático em ./out:
 *
 *   seleciona 10 → recarrega (seleção sobrevive) → sorteia 2×5 →
 *   resultado com seed → destaques renderizam.
 *
 * Uso:  npm run build && npm run test:e2e
 * Requer o Chromium do Playwright (uma vez): npx playwright install chromium
 */
import { chromium } from 'playwright';
import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'out');
const PORT = 4620;
// A splash de abertura cobre a tela por ~2.8s; qualquer interação antes disso
// não vale. Cada navegação paga esse pedágio.
const SPLASH_MS = 3200;

if (!existsSync(path.join(OUT, 'index.html'))) {
  console.error('out/ não existe — rode `npm run build` antes.');
  process.exit(1);
}

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let p = path.join(OUT, decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!existsSync(p)) p = p + '.html';
  if (!existsSync(p)) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, {
    'content-type': MIME[path.extname(p)] ?? 'application/octet-stream',
  });
  createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));

let failures = 0;
function check(cond, label) {
  if (cond) {
    console.log('  ok –', label);
  } else {
    console.error('  FALHOU –', label);
    failures++;
  }
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

try {
  // --- Sorteio: seleção + persistência --------------------------------------
  console.log('sorteio');
  await page.goto(`http://localhost:${PORT}/sorteio`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(SPLASH_MS);
  const tiles = page.locator('button[aria-pressed="false"]');
  for (let i = 0; i < 10; i++) await tiles.first().click();
  check(
    (await page.locator('button[aria-pressed="true"]').count()) === 10,
    'seleciona 10 jogadores',
  );

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(SPLASH_MS);
  check(
    (await page.locator('button[aria-pressed="true"]').count()) === 10,
    'seleção sobrevive ao reload',
  );

  // --- Sorteia 2×5 -----------------------------------------------------------
  await page.locator('button', { hasText: /Sortear 2×5/ }).click();
  await page.waitForURL('**/resultado', { timeout: 5000 });
  await page.waitForTimeout(SPLASH_MS);

  console.log('resultado');
  const teamCard = (n) =>
    page.locator('section', { has: page.locator(`h2:text-is("Time ${n}")`) });
  check((await teamCard(1).count()) === 1, 'Time 1 renderiza');
  check((await teamCard(2).count()) === 1, 'Time 2 renderiza');
  check(
    (await page.locator('section li').count()) === 10,
    '10 jogadores nos times',
  );
  check(
    (await page.getByText(/Sorteio #/).count()) === 1,
    'seed do sorteio visível',
  );

  // --- Destaques -------------------------------------------------------------
  console.log('destaques');
  await page.goto(`http://localhost:${PORT}/destaques`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(SPLASH_MS);
  check(
    (await page.locator('article.highlight-card').count()) === 7,
    '7 cartas renderizam',
  );
  check((await page.getByText('Caixeta').count()) >= 1, 'carta do Caixeta presente');
} catch (err) {
  console.error('FALHOU – erro inesperado:', err.message);
  failures++;
} finally {
  await browser.close();
  server.close();
}

if (failures > 0) {
  console.error(`\n${failures} verificação(ões) falharam.`);
  process.exit(1);
}
console.log('\nSmoke test completo: tudo passou.');
