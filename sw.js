const CACHE_NAME = 'epp-pwa-cache-v1.0.0';

// Ścieżka bazowa na stałe powiązana z Twoim adresem repozytorium na GitHub Pages
const scopePath = '/PWAEPP/';

// Pełna lista zasobów do zapisania w trwałej pamięci podręcznej telefonu
const ASSETS_TO_CACHE = [
    scopePath,
    scopePath + 'index.html',
    scopePath + 'manifest.json',
    scopePath + 'icon-192.png',
    scopePath + 'icon-512.png',
    scopePath + 'logo.png',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght=400;600;700;900&display=swap'
];

// Trasa wspólna (Dni 1 do 15)
for (let d = 1; d <= 15; d++) {
    ASSETS_TO_CACHE.push(`${scopePath}img/dzien${d}_1.jpg`);
    ASSETS_TO_CACHE.push(`${scopePath}img/dzien${d}_2.jpg`);
}

// Trasy dojściowe grup
const prefixGroups = ['augustow', 'galindia', 'jacwiez', 'sambia', 'suwalki'];
prefixGroups.forEach(group => {
    const days = group === 'jacwiez' ? 5 : (group === 'galindia' ? 1 : 2);
    for (let d = 1; d <= days; d++) {
        ASSETS_TO_CACHE.push(`${scopePath}img/${group}_dojscie${d}_1.jpg`);
        ASSETS_TO_CACHE.push(`${scopePath}img/${group}_dojscie${d}_2.jpg`);
    }
});

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Używamy bezpiecznej metody settled, aby brak grafik nie przerwał instalacji na iPhone
            return Promise.allSettled(
                ASSETS_TO_CACHE.map(url => {
                    return cache.add(url).catch(err => {
                        console.warn(`Pominięto opcjonalną grafikę mapy przy instalacji: ${url}`, err);
                    });
                })
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
                    return caches.match(scopePath + 'index.html');
                }
            });
        })
    );
});
