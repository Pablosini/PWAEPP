const CACHE_NAME = 'epp-pwa-cache-v1.0.60';

// Ścieżka bazowa wynika z rejestracji SW, dzięki czemu działa na GitHub Pages i lokalnie.
const scopePath = new URL(self.registration.scope).pathname;

const ROUTE_IMAGE_ASSETS = Array.from({ length: 15 }, (_, index) => {
    const day = String(index + 1).padStart(2, '0');
    return scopePath + `trasa/dzien-${day}.png`;
});

const CORE_ASSETS_TO_CACHE = [
    scopePath,
    scopePath + 'index.html',
    scopePath + '404.html',
    scopePath + 'manifest.json',
    scopePath + 'splash-screen.png',
    scopePath + 'icon-192.png',
    scopePath + 'icon-512.png',
    scopePath + 'data/songs.js',
    scopePath + 'data/prayers.js',
    scopePath + 'data/liturgy.js',
    ...ROUTE_IMAGE_ASSETS
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.allSettled(
                CORE_ASSETS_TO_CACHE.map(url => cache.add(url))
            );
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Strategia Stale-While-Revalidate dla stabilnego działania i aktualizacji offline w locie
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Gdy urządzenie połączy się z siecią, pobieramy najnowszy plik w tle
                fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkResponse);
                        });
                    }
                }).catch(() => {});

                return cachedResponse;
            }

            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200) {
                    return networkResponse;
                }
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return networkResponse;
            }).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match(event.request)
                        .then((matchedPage) => matchedPage || caches.match(scopePath))
                        .then((matchedPage) => matchedPage || caches.match(scopePath + 'index.html'));
                }
                return caches.match(event.request)
                    .then((matchedAsset) => matchedAsset || new Response('Zasób niedostępny offline.', {
                        status: 503,
                        statusText: 'Offline'
                    }));
            });
        })
    );
});
