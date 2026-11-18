/* LinguaClass — сервис-воркер: офлайн-работа приложения */
const VERSION = "linguaclass-v1.2.0";
const SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./content.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/favicon.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(SHELL).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

async function offlineFallback(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  if (req.mode === "navigate") {
    const shell = await caches.match("./index.html");
    if (shell) return shell;
  }
  return new Response("Офлайн: файл не найден в кэше", {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // network-first: свежие файлы при наличии сети, кэш — офлайн.
  // Любой не-200 ответ (в т.ч. 5xx от прокси) считаем сбоем сети.
  event.respondWith(
    (async () => {
      try {
        const res = await fetch(req);
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        }
        return await offlineFallback(req);
      } catch (e) {
        return offlineFallback(req);
      }
    })()
  );
});
