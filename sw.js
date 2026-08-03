const CACHE_NAME = 'cheque-easy-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js'
];

// 安裝並快取資源
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// 離線時直接從快取讀取資源
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
