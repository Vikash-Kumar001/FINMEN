// Service Worker for Wise Student PWA
// Version: 1.0.0
const CACHE_NAME = 'wise-student-v1.0.0';
const RUNTIME_CACHE = 'wise-student-runtime-v1.0.0';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon-180x180.png'
];

// Function to check if a request is an API call
// All API calls start with /api/ and should not be cached
function isApiRequest(url) {
  try {
    // Handle relative URLs
    if (url.startsWith('/')) {
      return url.startsWith('/api/');
    }
    // Handle absolute URLs
    const urlObj = new URL(url);
    return urlObj.pathname.startsWith('/api/');
  } catch (e) {
    // If URL parsing fails, check if URL string contains /api/
    return url.includes('/api/');
  }
}


// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS.map(asset => {
          try {
            return new Request(asset, { cache: 'reload' });
          } catch (e) {
            console.warn('[Service Worker] Failed to cache:', asset, e);
            return null;
          }
        }).filter(Boolean));
      })
      .then(() => {
        console.log('[Service Worker] Assets precached');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches that don't match current version
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activated');
        return self.clients.claim(); // Take control of all pages immediately
      })
      .catch((error) => {
        console.error('[Service Worker] Activation failed:', error);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip API requests - always fetch from network (never cache API calls)
  if (isApiRequest(url.href)) {
    console.log('[Service Worker] API request - fetching from network (no cache):', url.href);
    event.respondWith(
      fetch(request)
        .catch((error) => {
          console.error('[Service Worker] API request failed (offline):', error);
          // Return offline response for API calls
          return new Response(
            JSON.stringify({ 
              error: 'Offline', 
              message: 'You are currently offline. Please check your connection.' 
            }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  // Handle navigation requests (HTML pages) - SPA routing
  if (request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline - serve cached index.html for SPA routes
          return caches.match('/index.html')
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Fallback if index.html not in cache
              return new Response('Offline', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'text/plain' }
              });
            });
        })
    );
    return;
  }

  // Handle static assets (CSS, JS, images, fonts, etc.)
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('[Service Worker] Serving from cache:', url.href);
          return cachedResponse;
        }

        // Fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cache the response for future use
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch failed:', error);
            
            // Return offline placeholder for images
            if (request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#e5e7eb"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="sans-serif" font-size="14">Offline</text></svg>',
                {
                  headers: { 'Content-Type': 'image/svg+xml' }
                }
              );
            }

            // Return error response for other assets
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Handle background sync (if needed in future)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Add background sync logic here if needed
      Promise.resolve()
    );
  }
});

// Handle push notifications (if needed in future)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200],
    tag: 'notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('Wise Student', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('[Service Worker] Script loaded');

