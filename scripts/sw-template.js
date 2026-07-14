/* Service worker do Fut Carrara. Gerado por scripts/generate-sw.mjs — não editar out/sw.js à mão. */
const VERSION = '__VERSION__';
const CACHE_NAME = `futcarrara-${VERSION}`;
const PRECACHE = __PRECACHE__;

self.addEventListener('install', (event) => {
  // Sem skipWaiting: a versão nova só assume quando o app fechar (atualização passiva).
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('futcarrara-') && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  // Cache-first: o conteúdo é imutável dentro de uma versão.
  // ignoreSearch cobre os payloads RSC (/rota.txt?_rsc=...).
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(request).catch(() => {
        if (request.mode === 'navigate') {
          return caches.match('/').then((home) => home ?? Response.error());
        }
        return Response.error();
      });
    }),
  );
});
