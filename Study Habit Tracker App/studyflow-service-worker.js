/**
 * StudyFlow – Service Worker
 * Offline caching for PWA functionality
 * Author: Mateen Yousuf, Teacher – School Education Department, J&K
 * Aligned with NEP 2020 & NCF 2023
 */

const CACHE_NAME = 'studyflow-v1.0.0';

const CACHE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './author.jpg',
  './conceptual-background.html',
  './user-manual.html',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_FILES))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request)
        .then(res => {
          if (res && res.status === 200 && res.type === 'basic') {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return res;
        })
        .catch(() => caches.match('./index.html'))
      )
  );
});
