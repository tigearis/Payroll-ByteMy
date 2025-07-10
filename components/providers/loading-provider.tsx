// components/providers/loading-provider.tsx
"use client";

import { useRouter, usePathname } from 'next/navigation';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { type LoadingMessage } from '@/lib/config/loading-messages';

export interface LoadingState {
  id: string;
  message: LoadingMessage;
  priority: number;
  timestamp: number;
  context: 'route' | 'query' | 'component' | 'action';
  variant?: 'page' | 'inline' | 'overlay' | 'minimal';
}

export interface LoadingContextValue {
  // Current loading state
  isLoading: boolean;
  currentLoading: LoadingState | null;
  allLoadingStates: LoadingState[];
  
  // Loading management
  startLoading: (
    id: string, 
    message: LoadingMessage, 
    options?: {
      priority?: number;
      context?: LoadingState['context'];
      variant?: LoadingState['variant'];
    }
  ) => void;
  
  stopLoading: (id: string) => void;
  updateLoading: (id: string, message: Partial<LoadingMessage>) => void;
  clearAllLoading: () => void;
  
  // Route transition loading
  isRouteTransitioning: boolean;
  setRouteTransitioning: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function useLoadingContext(): LoadingContextValue {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoadingContext must be used within a LoadingProvider');
  }
  return context;
}

export interface LoadingProviderProps {
  children: React.ReactNode;
  enableRouteTransitions?: boolean;
  defaultPriority?: number;
  maxConcurrentLoading?: number;
}

export function LoadingProvider({ 
  children, 
  enableRouteTransitions = true,
  defaultPriority = 1,
  maxConcurrentLoading = 5
}: LoadingProviderProps) {
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>([]);
  const [isRouteTransitioning, setIsRouteTransitioning] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Priority-based loading state selection
  const currentLoading = React.useMemo(() => {
    if (loadingStates.length === 0) return null;
    
    // Sort by priority (higher priority first), then by timestamp (newer first)
    const sortedStates = [...loadingStates].sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return b.timestamp - a.timestamp;
    });
    
    return sortedStates[0];
  }, [loadingStates]);

  const isLoading = loadingStates.length > 0 || isRouteTransitioning;

  // Start loading with smart deduplication
  const startLoading = useCallback((
    id: string, 
    message: LoadingMessage, 
    options: {
      priority?: number;
      context?: LoadingState['context'];
      variant?: LoadingState['variant'];
    } = {}
  ) => {
    const { 
      priority = defaultPriority, 
      context = 'component',
      variant = 'page'
    } = options;

    setLoadingStates(prev => {
      // Remove existing loading state with same ID
      const filtered = prev.filter(state => state.id !== id);
      
      // Enforce max concurrent loading limit
      if (filtered.length >= maxConcurrentLoading) {
        // Remove oldest, lowest priority loading state
        const sorted = filtered.sort((a, b) => {
          if (a.priority !== b.priority) return a.priority - b.priority;
          return a.timestamp - b.timestamp;
        });
        sorted.pop(); // Remove last (oldest, lowest priority)
      }

      // Add new loading state
      const newState: LoadingState = {
        id,
        message,
        priority,
        timestamp: Date.now(),
        context,
        variant
      };

      return [...filtered, newState];
    });
  }, [defaultPriority, maxConcurrentLoading]);

  // Stop loading
  const stopLoading = useCallback((id: string) => {
    setLoadingStates(prev => prev.filter(state => state.id !== id));
  }, []);

  // Update existing loading message
  const updateLoading = useCallback((id: string, messageUpdate: Partial<LoadingMessage>) => {
    setLoadingStates(prev => prev.map(state => 
      state.id === id 
        ? { 
            ...state, 
            message: { ...state.message, ...messageUpdate },
            timestamp: Date.now() // Update timestamp on change
          }
        : state
    ));
  }, []);

  // Clear all loading states
  const clearAllLoading = useCallback(() => {
    setLoadingStates([]);
    setIsRouteTransitioning(false);
  }, []);

  // Handle route transitions
  useEffect(() => {
    if (!enableRouteTransitions) return;

    const handleRouteChangeStart = () => {
      setIsRouteTransitioning(true);
    };

    const handleRouteChangeComplete = () => {
      setIsRouteTransitioning(false);
      // Clear route-specific loading states on route change
      setLoadingStates(prev => prev.filter(state => state.context !== 'route'));
    };

    // Note: Next.js App Router doesn't have these events by default
    // We'll implement this through pathname changes instead
    let timeoutId: NodeJS.Timeout;

    const handlePathnameChange = () => {
      setIsRouteTransitioning(true);
      
      // Clear the route transitioning state after a short delay
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsRouteTransitioning(false);
      }, 300); // Adjust timing as needed
    };

    handlePathnameChange();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [pathname, enableRouteTransitions]);

  // Auto-cleanup old loading states (prevent memory leaks)
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      const maxAge = 30000; // 30 seconds
      
      setLoadingStates(prev => 
        prev.filter(state => now - state.timestamp < maxAge)
      );
    };

    const interval = setInterval(cleanup, 10000); // Cleanup every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Debug logging in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('LoadingProvider state:', {
        isLoading,
        currentLoading: currentLoading?.message.title,
        totalStates: loadingStates.length,
        isRouteTransitioning
      });
    }
  }, [isLoading, currentLoading, loadingStates.length, isRouteTransitioning]);

  const contextValue: LoadingContextValue = {
    isLoading,
    currentLoading,
    allLoadingStates: loadingStates,
    startLoading,
    stopLoading,
    updateLoading,
    clearAllLoading,
    isRouteTransitioning,
    setRouteTransitioning: setIsRouteTransitioning
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
}

// Convenience hooks for common loading patterns
export function useGlobalLoading() {
  const { 
    startLoading, 
    stopLoading, 
    updateLoading,
    isLoading,
    currentLoading 
  } = useLoadingContext();

  const showLoading = useCallback((
    message: LoadingMessage, 
    options?: { priority?: number; variant?: LoadingState['variant'] }
  ) => {
    const id = `global-${Date.now()}`;
    startLoading(id, message, { ...options, context: 'action' });
    return () => stopLoading(id);
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    currentMessage: currentLoading?.message,
    showLoading,
    updateLoading
  };
}

export function useComponentLoading(componentName: string) {
  const { startLoading, stopLoading, updateLoading } = useLoadingContext();

  const show = useCallback((message: LoadingMessage, priority = 1) => {
    startLoading(componentName, message, { priority, context: 'component' });
  }, [startLoading, componentName]);

  const hide = useCallback(() => {
    stopLoading(componentName);
  }, [stopLoading, componentName]);

  const update = useCallback((message: Partial<LoadingMessage>) => {
    updateLoading(componentName, message);
  }, [updateLoading, componentName]);

  return { show, hide, update };
}

export function useQueryLoading(queryName: string) {
  const { startLoading, stopLoading, updateLoading } = useLoadingContext();

  const show = useCallback((message: LoadingMessage, priority = 2) => {
    startLoading(`query-${queryName}`, message, { priority, context: 'query' });
  }, [startLoading, queryName]);

  const hide = useCallback(() => {
    stopLoading(`query-${queryName}`);
  }, [stopLoading, queryName]);

  const update = useCallback((message: Partial<LoadingMessage>) => {
    updateLoading(`query-${queryName}`, message);
  }, [updateLoading, queryName]);

  return { show, hide, update };
}