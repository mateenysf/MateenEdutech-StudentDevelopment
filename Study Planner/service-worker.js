// StudyPlanner PWA - Service Worker
// Handles offline caching for full offline functionality

const CACHE_NAME = 'studyplanner-v1.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './concept.html',
  './manual.html',
  './manifest.json',
  './author.jpg'
];

// Install event - cache all assets
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // Return cached version
      }
      // Not in cache - fetch from network
      return fetch(event.request).then(networkResponse => {
        // Cache the new response for future offline use
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Network failed - return offline fallback
        return caches.match('./index.html');
      });
    })
  );
});
