// Gera out/sw.js após o build: varre out/, monta o precache e injeta no template.
// Roda via "postbuild". Funções puras exportadas para teste.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export function routeForFile(relPath) {
  const posix = relPath.split(sep).join('/');
  if (!posix.endsWith('.html')) return `/${posix}`;
  if (posix === 'index.html') return '/';
  return `/${posix.slice(0, -'.html'.length)}`;
}

export function shouldPrecache(relPath) {
  const posix = relPath.split(sep).join('/');
  if (posix === '404.html' || posix === 'sw.js') return false;
  return posix.split('/').every((segment) => !segment.startsWith('.'));
}

export function buildPrecacheList(relPaths) {
  const routes = relPaths.filter(shouldPrecache).map(routeForFile);
  return [...new Set(routes)].sort();
}

export function collectFiles(dir, base = dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return collectFiles(full, base);
    return [full.slice(base.length + 1)];
  });
}

function hashFiles(outDir, relPaths) {
  const hash = createHash('sha256');
  for (const relPath of [...relPaths].sort()) {
    hash.update(relPath);
    hash.update(readFileSync(join(outDir, relPath)));
  }
  return hash.digest('hex').slice(0, 16);
}

function main() {
  const outDir = 'out';
  const files = collectFiles(outDir).filter(shouldPrecache);
  const precache = buildPrecacheList(files);
  const version = hashFiles(outDir, files);
  const template = readFileSync('scripts/sw-template.js', 'utf8');
  const sw = template
    .replace('__VERSION__', version)
    .replace('__PRECACHE__', JSON.stringify(precache, null, 2));
  writeFileSync(join(outDir, 'sw.js'), sw);
  console.log(`out/sw.js: versão ${version}, ${precache.length} URLs no precache`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
