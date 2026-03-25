const SW_VERSION = 'opennas-v2';
const APP_SHELL_CACHE = `${SW_VERSION}-app-shell`;
const RUNTIME_CACHE = `${SW_VERSION}-runtime`;

const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![APP_SHELL_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const hasAuthHeader = event.request.headers.has('authorization');
  const hasTokenQuery = requestUrl.searchParams.has('token');
  const isSensitivePath =
    requestUrl.pathname.startsWith('/api') ||
    requestUrl.pathname.startsWith('/stream') ||
    requestUrl.pathname.startsWith('/music');

  // Never cache auth-bearing or tokenized requests.
  if (hasAuthHeader || hasTokenQuery || isSensitivePath) {
    event.respondWith(
      fetch(event.request)
    );
    return;
  }

  // For same-origin navigation and static assets, try cache then network.
  if (requestUrl.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, responseClone));
          return networkResponse;
        });
      })
    );
  }
});
