// Cache-first service worker for AI Zero → Hero
// Single-file site, so we just cache the shell + assets and serve offline.
const VERSION = 'aizh-v7';
// Critical = shell that MUST cache atomically, or install fails and old SW keeps serving.
const CRITICAL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
];
// Optional = nice-to-have, allowed to fail individually.
const OPTIONAL = [
  './ai_master_course.html',
  './AI_REFERENCE.md',
  './AI_ZERO_TO_HERO.md',
  './icon-192.png',
  './icon-512.png',
  './favicon-32.png',
  './404.html',
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    // Fail loud on critical: any failure aborts install, prior cache stays live.
    await cache.addAll(CRITICAL);
    // Optional: cache best-effort, one at a time, never block activation.
    await Promise.all(OPTIONAL.map(u =>
      cache.add(u).catch(err => console.warn('[sw] optional precache miss:', u, err))
    ));
  })());
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Never intercept API calls (LLM tutor) or non-GET
  if (url.origin !== self.location.origin || e.request.method !== 'GET') return;
  // Network-first for HTML so updates land fast; cache-first for everything else
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/AI_training/')) {
    e.respondWith(
      fetch(e.request).then(resp => {
        const copy = resp.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(resp => {
      const copy = resp.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy)).catch(() => {});
      return resp;
    }).catch(() => hit))
  );
});
