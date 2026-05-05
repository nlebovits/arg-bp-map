// Service Worker for PMTiles tile caching
// Caches individual range requests, not the full 4GB file

const CACHE_NAME = "pmtiles-v1";
const TILE_ORIGINS = [
  "https://data.source.coop",
  "https://carbonplan-maps.s3.us-west-2.amazonaws.com",
];

// Install: skip waiting to activate immediately
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Activate: claim all clients and clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("pmtiles-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      ),
    ])
  );
});

// Fetch: cache PMTiles range requests
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only handle PMTiles origins
  if (!TILE_ORIGINS.some((origin) => url.origin === origin)) {
    return;
  }

  // Only cache GET requests with Range header (tile fetches)
  if (event.request.method !== "GET") {
    return;
  }

  const rangeHeader = event.request.headers.get("Range");
  if (!rangeHeader) {
    return;
  }

  // Create cache key from URL + Range header
  const cacheKey = `${event.request.url}|${rangeHeader}`;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // Check cache first
      const cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }

      // Fetch from network
      try {
        const response = await fetch(event.request);

        // Cache successful responses (206 Partial Content)
        if (response.status === 206) {
          // Clone before caching since response body can only be read once
          const responseToCache = response.clone();
          cache.put(cacheKey, responseToCache);
        }

        return response;
      } catch (error) {
        // Network error - return cached if available (shouldn't happen for PMTiles)
        throw error;
      }
    })()
  );
});
