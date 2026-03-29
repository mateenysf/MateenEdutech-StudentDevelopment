// LearnSpark Service Worker
// Enables full offline functionality for the PWA

const CACHE_NAME = 'learnspark-v1';

// Files to cache for offline use
const CACHE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './author.jpg',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap'
];

// Install: cache all core files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(CACHE_FILES).catch(err => {
        console.log('[SW] Some cache items failed (may be offline):', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) return cachedResponse;
      
      // Otherwise fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Cache the new response for next time
        if (networkResponse.ok) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback — return the main app
        return caches.match('./index.html');
      });
    })
  );
});
