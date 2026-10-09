// CARTHAGO service worker : reseau d'abord pour l'app (chaque deploy est visible tout de suite),
// cache en secours sans signal (sous-sol de la salle). Modules Firebase et polices : cache stable, mis a jour en fond.
const CACHE = 'carthago-v9.0-2a7c829';
const EXT = 'carthago-ext';
const EXT_HOSTS = [
  { host: 'www.gstatic.com', prefix: '/firebasejs/' },
  { host: 'fonts.googleapis.com', prefix: '/' },
  { host: 'fonts.gstatic.com', prefix: '/' }
];
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/', '/manifest.json', '/icon-192.png', '/icon-512.png', '/favicon.svg', '/apple-touch-icon.png'])).catch(() => {}));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== EXT).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
const cacheable = res => res && (res.ok || res.type === 'opaque');
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== self.location.origin) {
    // Jamais Firestore, Auth, YouTube : uniquement les modules Firebase versionnes et les polices
    if (!EXT_HOSTS.some(h => u.host === h.host && u.pathname.indexOf(h.prefix) === 0)) return;
    e.respondWith(caches.open(EXT).then(c => c.match(r).then(hit => {
      const net = fetch(r).then(res => { if (cacheable(res)) c.put(r, res.clone()); return res; });
      if (hit) { net.catch(() => {}); return hit; }
      return net;
    })));
    return;
  }
  e.respondWith(
    fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })
      .catch(() => caches.match(r).then(m => m || (r.mode === 'navigate' ? caches.match('/') : Response.error())))
  );
});
