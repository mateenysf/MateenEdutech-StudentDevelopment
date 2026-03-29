// ReadFlow Service Worker — Offline Caching
// Developed for: Mateen Yousuf, Teacher, School Education Department J&K
// NEP 2020 & NCF 2023 Aligned

var CACHE_NAME = "readflow-v1";
var ASSETS = ["./index.html", "./manifest.json", "./conceptual-background.html", "./user-manual.html"];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      return cached || fetch(event.request).catch(function() { return caches.match("./index.html"); });
    })
  );
});
