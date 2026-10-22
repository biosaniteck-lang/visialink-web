// VisiaLink - service worker minimale.
// Obiettivo: rendere il sito installabile e mostrare una pagina di cortesia offline.
// NON mette in cache le chiamate al backend (dati di prenotazione e pannello admin).
const VERSION = 'v1';
const CACHE = 'visialink-' + VERSION;
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll([OFFLINE_URL, '/icons/icon-192.png']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Solo risorse dello stesso sito: il backend (altro dominio) non viene mai toccato
  if (url.origin !== self.location.origin) return;

  // Pagine: sempre dalla rete; se offline, pagina di cortesia
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  // File statici con hash (JS/CSS/font/icone): cache dopo il primo utilizzo
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/fonts/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
