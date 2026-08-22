/**
 * ChequeEasy 支票易 - Service Worker (Offline Cache Engine)
 */

const CACHE_NAME = 'cheque-easy-v2.0.0';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './ChequeEasyicon-192.png',
    './ChequeEasyicon-512.png',
    './PRIVACY.md'
];

// 安裝並預先快取核心靜態資源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// 清除舊版本快取
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 攔截請求：快取優先策略 (Cache-First with Network Fallback)
self.addEventListener('fetch', (event) => {
    // 忽略外部 API 請求 (交由 JS 的 localStorage 機制處理)
    if (event.request.url.includes('api.hkma.gov.hk')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request).then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        }).catch(() => {
            return caches.match('./index.html');
        })
    );
});
