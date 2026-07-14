// Gera out/sw.js após o build: varre out/, monta o precache e injeta no template.
// Roda via "postbuild". Funções puras exportadas para teste.
import { sep } from 'node:path';

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
