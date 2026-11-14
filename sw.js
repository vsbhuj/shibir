/* મહામંત્ર શિબિર – ઓફલાઇન માટે: પહેલાં નેટ, ન મળે તો સાચવેલું */
const CACHE = 'shibir-v3';
const CORE = ['./', './index.html', './yadi.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const same = req.url.startsWith(self.location.origin);
  e.respondWith(fetch(same ? new Request(req, {cache: 'no-cache'}) : req).then(res => {
    if (res && res.ok && (req.url.startsWith(self.location.origin) || req.url.includes('fonts.g'))) {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy));
    }
    return res;
  }).catch(() => caches.match(req).then(r => r || (req.mode === 'navigate' ? caches.match('./index.html', './yadi.html') : undefined))));
});
