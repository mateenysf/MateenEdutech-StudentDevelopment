// Student Motivation Studio - Service Worker
// Developed by Mateen Yousuf | School Education Department Kashmir
// Offline-first caching strategy

const CACHE_NAME = 'motivation-studio-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './author.jpg'
];

// ===== INSTALL: Pre-cache all static assets =====
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })))
        .catch(err => console.log('[SW] Some assets failed to cache:', err));
    })
  );
  self.skipWaiting();
});

// ===== ACTIVATE: Clean old caches =====
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// ===== FETCH: Cache-first for static, network-first for Google Fonts =====
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Cache-first strategy for same-origin assets
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          }
          return response;
        }).catch(() => {
          // Return cached index.html for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for Google Fonts
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cached => {
          const fetchPromise = fetch(request).then(response => {
            cache.put(request, response.clone());
            return response;
          }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
  }
});

// ===== BACKGROUND SYNC: Save pending data =====
self.addEventListener('sync', event => {
  if (event.tag === 'sync-motivation-data') {
    console.log('[SW] Background sync triggered');
  }
});

// ===== PUSH NOTIFICATIONS: Motivation reminders =====
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || '📚 Time to check your Motivation!';
  const options = {
    body: data.body || 'Open your Motivation Studio and log today\'s entry.',
    icon: './author.jpg',
    badge: './author.jpg',
    vibrate: [200, 100, 200],
    data: { url: './index.html' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || './index.html'));
});

console.log('[SW] Student Motivation Studio Service Worker loaded. Developed by Mateen Yousuf, School Education Department Kashmir.');
