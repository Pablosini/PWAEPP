const CACHE_NAME = 'epp-pwa-cache-v4';
const ASSETS_TO_CACHE = [
    './',
    'index.html',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght=400;600;700;900&display=swap'
];

// Generowanie listy wszystkich obrazów do pobrania offline
for (let d = 1; d <= 15; d++) {
    ASSETS_TO_CACHE.push(`img/dzien${d}_1.jpg`);
    ASSETS_TO_CACHE.push(`img/dzien${d}_2.jpg`);
}
const prefixGroups = ['augustow', 'galindia', 'jacwiez', 'sambia', 'suwalki'];
prefixGroups.forEach(group => {
    const days = group === 'jacwiez' ? 5 : (group === 'galindia' ? 1 : 2);
    for (let d = 1; d <= days; d++) {
        ASSETS_TO_CACHE.push(`img/${group}_dojscie${d}_1.jpg`);
        ASSETS_TO_CACHE.push(`img/${group}_dojscie${d}_2.jpg`);
    }
});

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
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

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                fetch(event.request).then((networkResponse) => {
                    if (networkResponse.status === 200) {
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
                    return caches.match('index.html');
                }
            });
        })
    );
});