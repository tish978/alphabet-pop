const CACHE_NAME = 'alphabet-pop-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap'
  // Audio files will be cached dynamically when played
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache.map(url => new Request(url, {cache: 'reload'})));
      })
      .catch((err) => {
        console.log('Cache install failed:', err);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then((fetchResponse) => {
          // Only cache if response is successful and complete (not partial 206)
          // Cache all resources from our origin (including audio files)
          if ((event.request.url.startsWith(self.location.origin) || 
              urlsToCache.some(url => event.request.url.includes(url))) &&
              fetchResponse.status === 200 && fetchResponse.statusText === 'OK') {
            // Clone response only if it's a full response (not 206 Partial Content)
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((err) => {
                // Ignore caching errors (like for 206 partial responses)
                console.log('Cache put failed (may be partial response):', err);
              });
          }
          return fetchResponse;
        }).catch(() => {
          // If fetch fails and it's a navigation request, return cached index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

