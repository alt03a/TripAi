import { useState, useEffect } from 'react';
import {
  isServiceWorkerActive,
  requestNotificationPermission,
  subscribeToPushNotifications,
  queueTripForSync,
  queueDocumentForSync,
  getPendingSyncItems,
  clearCaches,
} from '@/lib/serviceWorker';
import { useOnlineStatus } from './useOnlineStatus';

export interface PWACapabilities {
  isInstalled: boolean;
  canInstall: boolean;
  isOfflineReady: boolean;
  notificationPermission: NotificationPermission;
  hasPendingSync: boolean;
}

export const usePWA = () => {
  const isOnline = useOnlineStatus();
  const [capabilities, setCapabilities] = useState<PWACapabilities>({
    isInstalled: false,
    canInstall: false,
    isOfflineReady: false,
    notificationPermission: 'default',
    hasPendingSync: false,
  });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const checkCapabilities = async () => {
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
      const isOfflineReady = isServiceWorkerActive();
      const notificationPermission = 'Notification' in window ? Notification.permission : 'denied';
      
      // Check for pending sync items
      const pendingTrips = await getPendingSyncItems('pending-trips');
      const pendingDocs = await getPendingSyncItems('pending-documents');
      const hasPendingSync = pendingTrips.length > 0 || pendingDocs.length > 0;

      setCapabilities({
        isInstalled,
        canInstall: !!deferredPrompt,
        isOfflineReady,
        notificationPermission,
        hasPendingSync,
      });
    };

    checkCapabilities();

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCapabilities((prev) => ({ ...prev, canInstall: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [deferredPrompt]);

  const installApp = async () => {
    if (!deferredPrompt) {
      return false;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setCapabilities((prev) => ({ ...prev, canInstall: false, isInstalled: true }));
      return true;
    }

    return false;
  };

  const enableNotifications = async () => {
    const permission = await requestNotificationPermission();
    
    if (permission === 'granted') {
      await subscribeToPushNotifications();
      setCapabilities((prev) => ({ ...prev, notificationPermission: 'granted' }));
      return true;
    }

    return false;
  };

  const saveOffline = async (type: 'trip' | 'document', data: any) => {
    if (!isOnline) {
      if (type === 'trip') {
        await queueTripForSync(data);
      } else if (type === 'document') {
        await queueDocumentForSync(data.file, data.metadata);
      }
      
      setCapabilities((prev) => ({ ...prev, hasPendingSync: true }));
      return true;
    }
    return false;
  };

  const clearAppCache = async () => {
    clearCaches();
    window.location.reload();
  };

  return {
    capabilities,
    isOnline,
    installApp,
    enableNotifications,
    saveOffline,
    clearAppCache,
  };
};
