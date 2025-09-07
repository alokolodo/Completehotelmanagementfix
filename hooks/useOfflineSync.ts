import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { OfflineQueueManager, CacheManager } from '@/lib/storage';
import { apiClient } from '@/lib/api';

// Web-compatible network detection
const getNetworkState = () => {
  if (Platform.OS === 'web') {
    return {
      isConnected: navigator.onLine,
      isInternetReachable: navigator.onLine,
    };
  }
  // For native platforms, we'll use a simple online assumption
  // In a real app, you'd use @react-native-community/netinfo here
  return {
    isConnected: true,
    isInternetReachable: true,
  };
};

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  const queueManager = OfflineQueueManager.getInstance();
  const cache = CacheManager.getInstance();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    if (Platform.OS === 'web') {
      const handleOnline = () => {
        const state = getNetworkState();
        const online = state.isConnected && state.isInternetReachable;
        setIsOnline(online);
        if (online && !isSyncing) {
          syncOfflineData();
        }
      };
      
      const handleOffline = () => {
        setIsOnline(false);
      };
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      // Set initial state
      const initialState = getNetworkState();
      setIsOnline(initialState.isConnected && initialState.isInternetReachable);
      
      unsubscribe = () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    } else {
      // For native platforms, assume online for now
      // In production, you'd use NetInfo here
      const state = getNetworkState();
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(online ?? false);
      
      if (online && !isSyncing) {
        syncOfflineData();
      }
    }

    // Load offline queue on mount
    queueManager.loadQueue();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isSyncing]);

  const syncOfflineData = useCallback(async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    
    try {
      await queueManager.processQueue();
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, queueManager]);

  const addOfflineOperation = useCallback(async (operation: any) => {
    await queueManager.addToQueue(operation);
  }, [queueManager]);

  const forcSync = useCallback(async () => {
    if (isOnline) {
      await syncOfflineData();
    }
  }, [isOnline, syncOfflineData]);

  return {
    isOnline,
    isSyncing,
    lastSyncTime,
    syncOfflineData,
    addOfflineOperation,
    forcSync,
  };
}