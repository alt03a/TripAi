/**
 * Service Worker Registration and Management
 */

export interface SyncQueueItem {
  id?: number;
  data: any;
  timestamp: number;
}

/**
 * Register the service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[SW] Registration successful:', registration.scope);

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('[SW] Update found, installing new version');

      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker available
          console.log('[SW] New version available, reload to update');
          showUpdateNotification();
        }
      });
    });

    return registration;
  } catch (error) {
    console.error('[SW] Registration failed:', error);
    return null;
  }
}

/**
 * Unregister service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) {
    return registration.unregister();
  }
  return false;
}

/**
 * Check if service worker is active
 */
export function isServiceWorkerActive(): boolean {
  return !!(navigator.serviceWorker && navigator.serviceWorker.controller);
}

/**
 * Send message to service worker
 */
export function sendMessageToSW(message: any): void {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  }
}

/**
 * Skip waiting and activate new service worker
 */
export function skipWaiting(): void {
  sendMessageToSW({ type: 'SKIP_WAITING' });
}

/**
 * Clear all caches
 */
export function clearCaches(): void {
  sendMessageToSW({ type: 'CLEAR_CACHE' });
}

/**
 * Manually cache specific URLs
 */
export function cacheUrls(urls: string[]): void {
  sendMessageToSW({ type: 'CACHE_URLS', urls });
}

/**
 * Background Sync - Queue trip for sync when online
 */
export async function queueTripForSync(tripData: any): Promise<void> {
  try {
    const db = await openSyncDB();
    const tx = db.transaction(['pending-trips'], 'readwrite');
    const store = tx.objectStore('pending-trips');
    
    await new Promise<void>((resolve, reject) => {
      const request = store.add({
        data: tripData,
        timestamp: Date.now(),
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Try background sync if available
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register('sync-trips');
    }
    
    console.log('[SW] Trip queued for background sync');
  } catch (error) {
    console.error('[SW] Failed to queue trip:', error);
  }
}

/**
 * Background Sync - Queue document for sync when online
 */
export async function queueDocumentForSync(file: File, metadata: any): Promise<void> {
  try {
    const db = await openSyncDB();
    const tx = db.transaction(['pending-documents'], 'readwrite');
    const store = tx.objectStore('pending-documents');
    
    await new Promise<void>((resolve, reject) => {
      const request = store.add({
        file,
        metadata,
        timestamp: Date.now(),
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Try background sync if available
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register('sync-documents');
    }
    
    console.log('[SW] Document queued for background sync');
  } catch (error) {
    console.error('[SW] Failed to queue document:', error);
  }
}

/**
 * Get pending sync items
 */
export async function getPendingSyncItems(storeName: 'pending-trips' | 'pending-documents'): Promise<SyncQueueItem[]> {
  try {
    const db = await openSyncDB();
    const tx = db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    
    return new Promise<SyncQueueItem[]>((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[SW] Failed to get pending items:', error);
    return [];
  }
}

/**
 * Clear pending sync items
 */
export async function clearPendingSyncItems(storeName: 'pending-trips' | 'pending-documents'): Promise<void> {
  try {
    const db = await openSyncDB();
    const tx = db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    
    await new Promise<void>((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[SW] Failed to clear pending items:', error);
  }
}

/**
 * Open IndexedDB for sync queue
 */
function openSyncDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('triptuner-sync', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('pending-trips')) {
        db.createObjectStore('pending-trips', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('pending-documents')) {
        db.createObjectStore('pending-documents', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

/**
 * Show update notification to user
 */
function showUpdateNotification(): void {
  // You can integrate with your toast/notification system
  const shouldUpdate = confirm('A new version is available. Reload to update?');
  if (shouldUpdate) {
    skipWaiting();
    window.location.reload();
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      console.warn('[SW] VAPID public key not configured');
      return null;
    }
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
    });

    console.log('[SW] Push subscription successful');
    return subscription;
  } catch (error) {
    console.error('[SW] Push subscription failed:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      console.log('[SW] Push unsubscription successful');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[SW] Push unsubscription failed:', error);
    return false;
  }
}

/**
 * Helper to convert VAPID key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}
