// StudyFlow Service Worker
// NEP 2020 · NCF 2023 · PARAKH – Offline Study Planner & Habit Builder
// Author: Mateen Yousuf, Teacher, School Education Department J&K

const CACHE_NAME = 'studyflow-v1.0.0';
const CACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './author.jpg'
];

// ── INSTALL: Cache all core app assets ──
self.addEventListener('install', event => {
  console.log('[StudyFlow SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_URLS).catch(err => {
        console.warn('[StudyFlow SW] Cache partial failure:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: Remove outdated caches ──
self.addEventListener('activate', event => {
  console.log('[StudyFlow SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: Serve from cache, fallback to network ──
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('StudyFlow is running offline.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' }
        });
      });
    })
  );
});

// ── PUSH: Study reminder notifications ──
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Time to study! Your streak is waiting. 🔥',
    icon: './icon-192.png',
    badge: './icon-192.png',
    data: { url: './' }
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'StudyFlow Reminder', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || './'));
});
