const CACHE_NAME = 'triptuner-v1';
const RUNTIME_CACHE = 'triptuner-runtime-v1';
const IMAGE_CACHE = 'triptuner-images-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/placeholder.svg',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== RUNTIME_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API requests - Network First strategy
  if (url.pathname.startsWith('/api/') || 
      url.pathname.includes('supabase') ||
      url.pathname.includes('/rest/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Images - Cache First strategy
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // Static assets - Cache First strategy
  if (request.destination === 'style' || 
      request.destination === 'script' ||
      request.destination === 'font') {
    event.respondWith(cacheFirst(request, CACHE_NAME));
    return;
  }

  // HTML pages - Network First strategy
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Default - Cache First
  event.respondWith(cacheFirst(request, RUNTIME_CACHE));
});

// Cache First strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[ServiceWorker] Fetch failed:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineCache = await caches.open(CACHE_NAME);
      return offlineCache.match('/index.html');
    }
    
    throw error;
  }
}

// Network First strategy
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[ServiceWorker] Network failed, trying cache:', error);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    throw error;
  }
}

// Background Sync - sync pending requests when online
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag);
  
  if (event.tag === 'sync-trips') {
    event.waitUntil(syncPendingTrips());
  }
  
  if (event.tag === 'sync-documents') {
    event.waitUntil(syncPendingDocuments());
  }
});

async function syncPendingTrips() {
  try {
    const db = await openDB();
    const trips = await db.getAll('pending-trips');
    
    for (const trip of trips) {
      try {
        const response = await fetch('/api/trips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trip.data),
        });
        
        if (response.ok) {
          await db.delete('pending-trips', trip.id);
          console.log('[ServiceWorker] Synced trip:', trip.id);
        }
      } catch (error) {
        console.error('[ServiceWorker] Failed to sync trip:', error);
      }
    }
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
  }
}

async function syncPendingDocuments() {
  try {
    const db = await openDB();
    const documents = await db.getAll('pending-documents');
    
    for (const doc of documents) {
      try {
        const formData = new FormData();
        formData.append('file', doc.file);
        formData.append('metadata', JSON.stringify(doc.metadata));
        
        const response = await fetch('/api/documents', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          await db.delete('pending-documents', doc.id);
          console.log('[ServiceWorker] Synced document:', doc.id);
        }
      } catch (error) {
        console.error('[ServiceWorker] Failed to sync document:', error);
      }
    }
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
  }
}

// IndexedDB helper for background sync queue
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('triptuner-sync', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('pending-trips')) {
        db.createObjectStore('pending-trips', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('pending-documents')) {
        db.createObjectStore('pending-documents', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received:', event);
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'TripTuner';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/placeholder.svg',
    badge: '/placeholder.svg',
    data: data.url || '/',
    actions: data.actions || [],
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked:', event);
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});

// Message handler for manual cache updates
self.addEventListener('message', (event) => {
  console.log('[ServiceWorker] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});
