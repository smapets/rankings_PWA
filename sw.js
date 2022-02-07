const dataToCache = [
  "./index.html",
  "./landing.html",
  "./index.css",
  "./uomTrack.js",
  "./index.js",
  "./landing.js",
  "./medals-unsplash.jpg",
  "./track-unsplash.jpg"
];
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("static").then(cache => {
      return cache.addAll(dataToCache);
    })
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
