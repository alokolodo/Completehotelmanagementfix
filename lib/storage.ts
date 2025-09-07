import AsyncStorage from '@react-native-async-storage/async-storage';

// Enhanced storage with better error handling and performance
export class CacheManager {
  private static instance: CacheManager;
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private memoryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private maxMemoryItems = 100;

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  private cleanupMemoryCache(): void {
    if (this.memoryCache.size > this.maxMemoryItems) {
      const entries = Array.from(this.memoryCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      // Remove oldest 20% of entries
      const toRemove = Math.floor(this.maxMemoryItems * 0.2);
      for (let i = 0; i < toRemove; i++) {
        this.memoryCache.delete(entries[i][0]);
      }
    }
  }

  set(key: string, data: any, ttl?: number): void {
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.cacheTimeout,
    };

    // Store in memory cache for fast access
    this.memoryCache.set(key, cacheData);
    this.cleanupMemoryCache();

    // Store in persistent storage
    try {
      AsyncStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to store in persistent cache:', error);
    }
  }

  get<T>(key: string): T | null {
    // Check memory cache first
    const memoryData = this.memoryCache.get(key);
    if (memoryData) {
      if (Date.now() - memoryData.timestamp <= memoryData.ttl) {
        return memoryData.data as T;
      } else {
        this.memoryCache.delete(key);
      }
    }

    // Fallback to persistent storage (async, but we'll make it sync for this use case)
    try {
      // Note: In a real app, you'd want to make this async
      // For now, we'll rely primarily on memory cache
      return null;
    } catch {
      return null;
    }
  }

  async getAsync<T>(key: string): Promise<T | null> {
    // Check memory cache first
    const memoryData = this.memoryCache.get(key);
    if (memoryData) {
      if (Date.now() - memoryData.timestamp <= memoryData.ttl) {
        return memoryData.data as T;
      } else {
        this.memoryCache.delete(key);
      }
    }

    // Check persistent storage
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp, ttl } = JSON.parse(cached);
      
      if (Date.now() - timestamp > ttl) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      // Update memory cache
      this.memoryCache.set(key, { data, timestamp, ttl });
      return data as T;
    } catch {
      return null;
    }
  }

  invalidate(key: string): void {
    this.memoryCache.delete(key);
    AsyncStorage.removeItem(key).catch(() => {});
  }

  getAllKeys(): string[] {
    return Array.from(this.memoryCache.keys());
  }

  clear(): void {
    this.memoryCache.clear();
    AsyncStorage.clear().catch(() => {});
  }

  // Batch operations for better performance
  async setBatch(items: Array<{ key: string; data: any; ttl?: number }>): Promise<void> {
    const asyncStorageItems: Array<[string, string]> = [];
    
    items.forEach(({ key, data, ttl }) => {
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.cacheTimeout,
      };
      
      this.memoryCache.set(key, cacheData);
      asyncStorageItems.push([key, JSON.stringify(cacheData)]);
    });

    this.cleanupMemoryCache();

    try {
      await AsyncStorage.multiSet(asyncStorageItems);
    } catch (error) {
      console.warn('Failed to batch store in persistent cache:', error);
    }
  }
}

// Storage keys with better organization
export const STORAGE_KEYS = {
  USER_SESSION: 'user_session',
  OFFLINE_DATA: 'offline_data',
  SETTINGS: 'app_settings',
  CACHE_TIMESTAMP: 'cache_timestamp',
  SYNC_QUEUE: 'sync_queue',
  DASHBOARD_CACHE: 'dashboard_cache',
  ROOMS_CACHE: 'rooms_cache',
  BOOKINGS_CACHE: 'bookings_cache',
} as const;

// Offline queue manager for robust offline support
export class OfflineQueueManager {
  private static instance: OfflineQueueManager;
  private queue: Array<{ id: string; operation: any; timestamp: number }> = [];
  private isProcessing = false;

  static getInstance(): OfflineQueueManager {
    if (!OfflineQueueManager.instance) {
      OfflineQueueManager.instance = new OfflineQueueManager();
    }
    return OfflineQueueManager.instance;
  }

  async addToQueue(operation: any): Promise<void> {
    const queueItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      operation,
      timestamp: Date.now(),
    };

    this.queue.push(queueItem);
    await this.saveQueue();
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    try {
      const processedIds: string[] = [];

      for (const item of this.queue) {
        try {
          // Process the queued operation
          await this.executeOperation(item.operation);
          processedIds.push(item.id);
        } catch (error) {
          console.warn('Failed to process queued operation:', error);
          // Keep failed operations in queue for retry
        }
      }

      // Remove successfully processed items
      this.queue = this.queue.filter(item => !processedIds.includes(item.id));
      await this.saveQueue();

    } finally {
      this.isProcessing = false;
    }
  }

  private async executeOperation(operation: any): Promise<void> {
    // Implementation would depend on the specific operation type
    // This is a placeholder for the actual operation execution
    console.log('Executing queued operation:', operation);
  }

  private async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(this.queue));
    } catch (error) {
      console.warn('Failed to save offline queue:', error);
    }
  }

  async loadQueue(): Promise<void> {
    try {
      const queueData = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      if (queueData) {
        this.queue = JSON.parse(queueData);
      }
    } catch (error) {
      console.warn('Failed to load offline queue:', error);
    }
  }
}