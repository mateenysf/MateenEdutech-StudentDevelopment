// =====================================================
// FlashMind Service Worker
// Developed under direction of: Mateen Yousuf
// Teacher – School Education Department, J&K
// Aligned with NEP 2020 & NCF 2023
// =====================================================

const CACHE_NAME = "flashmind-v1.0";
const ASSETS = [
  "./index.html",
  "./manifest.json"
];

// Install: cache all core assets
self.addEventListener("install", event => {
  console.log("[FlashMind SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[FlashMind SW] Caching app shell");
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener("activate", event => {
  console.log("[FlashMind SW] Activating...");
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: serve from cache, fallback to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then(response => {
        // Cache successful GET responses
        if (!response || response.status !== 200 || event.request.method !== "GET") {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
        return response;
      }).catch(() => {
        // If offline and not in cache, return offline page
        return caches.match("./index.html");
      });
    })
  );
});
