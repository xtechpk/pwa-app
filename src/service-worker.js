// public/sw.js
const CACHE_NAME = "pwa-cache-v1";
const PRECACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];
const HOSTNAME_WHITELIST = [
  self.location.hostname,
  "fonts.gstatic.com",
  "fonts.googleapis.com",
  "cdn.jsdelivr.net"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : undefined)))
    )
  );
  self.clients.claim();
});

// Stale-while-revalidate for whitelisted hosts
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (!HOSTNAME_WHITELIST.includes(url.hostname)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((resp) => {
          if (resp && resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
          }
          return resp;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
