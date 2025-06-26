const CACHE_NAME = "offline-cache-v1";
const OFFLINE_FILES = [
    "/push-back-web-calculator/",
    "/push-back-web-calculator/index.html",
    "/push-back-web-calculator/style.css",
    "/push-back-web-calculator/script.js",
    "/push-back-web-calculator/manifest.json",
    "/push-back-web-calculator/service-worker.js",
    "/push-back-web-calculator/images/"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_FILES))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
        return response || fetch(event.request);
        })
    );
});
