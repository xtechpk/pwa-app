// public/sw.js
const CACHE_NAME = "pwa-cache-v2";
const PRECACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/badge.png" // Add if you have a badge icon
];
const HOSTNAME_WHITELIST = [
  self.location.hostname,
  "fonts.gstatic.com",
  "fonts.googleapis.com",
  "cdn.jsdelivr.net",
  "jsonplaceholder.typicode.com" // For mock API
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

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (!HOSTNAME_WHITELIST.includes(url.hostname)) return;

  if (url.pathname.startsWith('/api/')) {
    // Network-first for APIs
    event.respondWith(
      fetch(event.request)
        .then((resp) => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
          return resp;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Stale-while-revalidate for others
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
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge.png',
      data: { url: data.url }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientsArr) => {
      const hadWindowToFocus = clientsArr.some((windowClient) => windowClient.url === event.notification.data.url ? (windowClient.focus(), true) : false);
      if (!hadWindowToFocus) clients.openWindow(event.notification.data.url);
    })
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-notes') {
    event.waitUntil(syncNotes());
  }
});

// Example sync function (implement with IndexedDB reads)
async function syncNotes() {
  // Fetch pending notes from IndexedDB, post to API, clear if successful
  // This is called from SW, so need to use self.indexedDB or postMessage to client
  // For simplicity, assume clients handle sync on online, but for true bg sync:
  console.log('Syncing notes in background...');
  // To make it work, you may need to open IndexedDB here:
  const { openDB } = await import('https://cdn.jsdelivr.net/npm/idb@8/+esm'); // Import idb in SW if needed
  const db = await openDB('pwa-db', 1);
  const unsynced = await db.getAllFromIndex('notes', 'synced', false);
  for (const note of unsynced) {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({ title: 'Note', body: note.content }),
      headers: { 'Content-Type': 'application/json' },
    });
    await db.put('notes', { ...note, synced: true });
  }
}

// Periodic sync (if permission granted)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'periodic-update') {
    event.waitUntil(updateData()); // e.g., fetch latest data
  }
});

async function updateData() {
  console.log('Periodic update...');
  // Add logic to fetch new data and cache
}