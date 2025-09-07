import { useEffect, useState, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api';
import { Database } from '@/types/database';

type Tables = Database['public']['Tables'];

export function useRealtimeData<T extends keyof Tables>(
  table: T,
  options: {
    filters?: Record<string, any>;
    select?: string;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    realtime?: boolean;
  } = {}
) {
  const [data, setData] = useState<Tables[T]['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const mountedRef = useRef(true);
  const subscriptionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (subscriptionRef.current) {
        subscriptionRef.current();
      }
    };
  }, []);

  const loadData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading && mountedRef.current) {
        setLoading(true);
        setError(null);
      }

      const result = await apiClient.query(table, options);
      
      if (mountedRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err: any) {
      console.error(`Error loading ${table} data:`, err);
      if (mountedRef.current) {
        setError(err.message || 'Failed to load data');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [table, options]);

  const refresh = useCallback(async () => {
    if (mountedRef.current) {
      setRefreshing(true);
    }
    await loadData(false);
  }, [loadData]);

  const optimisticUpdate = useCallback((
    updateFn: (currentData: Tables[T]['Row'][]) => Tables[T]['Row'][]
  ) => {
    if (mountedRef.current) {
      setData(currentData => updateFn(currentData));
    }
  }, []);

  useEffect(() => {
    loadData();

    // Set up real-time subscription if enabled
    if (options.realtime !== false) {
      subscriptionRef.current = apiClient.subscribe(
        table,
        (payload) => {
          if (!mountedRef.current) return;

          const { eventType, new: newRecord, old: oldRecord } = payload;
          
          setData(currentData => {
            switch (eventType) {
              case 'INSERT':
                return [...currentData, newRecord];
              case 'UPDATE':
                return currentData.map(item => 
                  item.id === newRecord.id ? newRecord : item
                );
              case 'DELETE':
                return currentData.filter(item => item.id !== oldRecord.id);
              default:
                return currentData;
            }
          });
        },
        options.filters
      );
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current();
      }
    };
  }, [table, options, loadData]);

  return {
    data,
    loading,
    error,
    refreshing,
    refresh,
    optimisticUpdate,
  };
}