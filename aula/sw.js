/* Service worker de Aula DAW 1: guarda la aplicación para usarla sin conexión.
   Sube el número de VERSION cuando cambies cualquier archivo del Aula. */
var VERSION = 'aula-daw1-v10';
var ARCHIVOS = ['./', './index.html', './style.css', './data.js', './retos.js', './juego.js', './app.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(ARCHIVOS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('aula-daw1-') === 0 && k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) {
    /* Fuentes de Google y librería de la cuenta: se guardan al usarlas por primera vez */
    if (/(fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr)\.(com|net)$/.test(url.hostname)) {
      e.respondWith(caches.open(VERSION).then(function (c) {
        return c.match(req).then(function (r) {
          return r || fetch(req).then(function (n) { c.put(req, n.clone()); return n; }).catch(function () { return r; });
        });
      }));
    }
    return;
  }
  /* Primero la red (para ver cambios nuevos); si no hay conexión, lo guardado */
  e.respondWith(fetch(req).then(function (n) {
    var copia = n.clone();
    caches.open(VERSION).then(function (c) { c.put(req, copia); });
    return n;
  }).catch(function () { return caches.match(req).then(function (r) { return r || caches.match('./index.html'); }); }));
});
