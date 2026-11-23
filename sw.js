/*
 * Minimal service worker: makes the site installable and keeps the landing
 * page available offline. Pages are network-first (so deploys show up right
 * away); same-origin static assets are stale-while-revalidate.
 * Bump VERSION to drop old caches.
 */
var VERSION = 'v2';
var CACHE = 'radio-' + VERSION;
var PRECACHE = [
  '/',
  '/pwa.js',
  '/manifest.webmanifest',
  '/assets/logo.svg',
  '/assets/logo.png',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function (cache) { return cache.addAll(PRECACHE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== CACHE; })
          .map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  // Leave YouTube embeds, fonts, and other cross-origin requests to the network.
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(function (res) {
          if (res.ok && url.pathname === '/') {
            var copy = res.clone();
            caches.open(CACHE).then(function (cache) { cache.put('/', copy); });
          }
          return res;
        })
        .catch(function () { return caches.match('/'); })
    );
    return;
  }

  // Stale-while-revalidate: serve from cache, refresh in the background.
  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(req).then(function (hit) {
        var update = fetch(req).then(function (res) {
          if (res.ok) cache.put(req, res.clone());
          return res;
        });
        if (hit) {
          event.waitUntil(update.catch(function () {}));
          return hit;
        }
        return update;
      });
    })
  );
});
