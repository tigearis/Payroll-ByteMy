// lib/hooks/use-dynamic-loading.ts
"use client";

import { useRouter, usePathname } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import { 
  getRouteLoadingMessage, 
  getQueryLoadingMessage, 
  getComponentLoadingMessage, 
  getActionLoadingMessage,
  type LoadingMessage,
  type LoadingContext,
  type LoadingVariant 
} from '@/lib/config/loading-messages';

export interface UseDynamicLoadingOptions {
  // Manual overrides
  title?: string;
  description?: string;
  
  // Context hints for better detection
  queryName?: string | undefined;
  componentName?: string;
  actionType?: string;
  
  // Visual options
  variant?: LoadingVariant;
  size?: 'sm' | 'default' | 'lg';
  
  // Behavior options
  context?: LoadingContext;
  autoDetect?: boolean;
}

export interface DynamicLoadingReturn {
  // Primary loading component
  Loading: React.ComponentType<{
    className?: string;
    variant?: LoadingVariant;
  }>;
  
  // Quick access to loading messages
  message: LoadingMessage;
  title: string;
  description: string;
  
  // Update loading state dynamically
  setLoadingMessage: (message: Partial<LoadingMessage>) => void;
  
  // Context detection results
  detectedContext: LoadingContext;
  detectedRoute: string;
}

export function useDynamicLoading(options: UseDynamicLoadingOptions = {}): DynamicLoadingReturn {
  const pathname = usePathname();
  const router = useRouter();
  
  const {
    title: manualTitle,
    description: manualDescription,
    queryName,
    componentName,
    actionType,
    variant = 'page',
    size = 'default',
    context: manualContext,
    autoDetect = true
  } = options;

  // Smart context detection
  const detectedContext: LoadingContext = useMemo(() => {
    if (manualContext) return manualContext;
    if (!autoDetect) return 'route';
    
    if (actionType) return 'action';
    if (queryName) return 'query';
    if (componentName) return 'component';
    return 'route';
  }, [manualContext, autoDetect, actionType, queryName, componentName]);

  // Get the appropriate loading message based on context
  const message: LoadingMessage = useMemo(() => {
    // Manual override takes highest priority
    if (manualTitle && manualDescription) {
      return { title: manualTitle, description: manualDescription };
    }

    let baseMessage: LoadingMessage;

    switch (detectedContext) {
      case 'action':
        baseMessage = actionType ? 
          getActionLoadingMessage(actionType) : 
          { title: 'Processing...', description: 'Completing your request' };
        break;
        
      case 'query':
        baseMessage = queryName ? 
          getQueryLoadingMessage(queryName) : 
          { title: 'Loading Data...', description: 'Fetching information' };
        break;
        
      case 'component':
        baseMessage = componentName ? 
          getComponentLoadingMessage(componentName) : 
          { title: 'Loading Component...', description: 'Preparing interface' };
        break;
        
      case 'route':
      default:
        baseMessage = getRouteLoadingMessage(pathname);
        break;
    }

    // Apply manual overrides to detected message
    return {
      title: manualTitle || baseMessage.title,
      description: manualDescription || baseMessage.description
    };
  }, [detectedContext, pathname, actionType, queryName, componentName, manualTitle, manualDescription]);

  // Create the Loading component
  const Loading = React.useMemo(() => {
    const LoadingComponent: React.FC<{
      className?: string;
      variant?: LoadingVariant;
    }> = ({ className, variant: propVariant }) => {
      const SmartLoading = require('@/components/ui/smart-loading').SmartLoading;
      
      return React.createElement(SmartLoading, {
        title: message.title,
        description: message.description,
        variant: propVariant || variant,
        size: size,
        className: className
      });
    };
    
    return LoadingComponent;
  }, [message, variant, size]);

  // Function to update loading message dynamically
  const setLoadingMessage = useCallback((newMessage: Partial<LoadingMessage>) => {
    // This would be handled by the loading provider in a real implementation
    // For now, we'll just console.log for debugging
    console.log('Loading message update requested:', newMessage);
  }, []);

  return {
    Loading,
    message,
    title: message.title,
    description: message.description,
    setLoadingMessage,
    detectedContext,
    detectedRoute: pathname
  };
}

// Specialized hooks for common use cases
export function useRouteLoading(routeOverride?: string) {
  const pathname = usePathname();
  const route = routeOverride || pathname;
  
  return useDynamicLoading({
    context: 'route',
    autoDetect: false
  });
}

export function useQueryLoading(queryName: string, options: Omit<UseDynamicLoadingOptions, 'queryName' | 'context'> = {}) {
  return useDynamicLoading({
    ...options,
    queryName,
    context: 'query',
    autoDetect: false
  });
}

export function useComponentLoading(componentName: string, options: Omit<UseDynamicLoadingOptions, 'componentName' | 'context'> = {}) {
  return useDynamicLoading({
    ...options,
    componentName,
    context: 'component',
    autoDetect: false
  });
}

export function useActionLoading(actionType: string, options: Omit<UseDynamicLoadingOptions, 'actionType' | 'context'> = {}) {
  return useDynamicLoading({
    ...options,
    actionType,
    context: 'action',
    autoDetect: false
  });
}

// Apollo Client integration hook
export function useApolloLoading(queryResult: { 
  loading?: boolean; 
  error?: any; 
  data?: any;
  operation?: { operationName?: string };
}, options: UseDynamicLoadingOptions = {}) {
  const operationName = queryResult.operation?.operationName;
  
  const dynamicLoading = useDynamicLoading({
    ...options,
    queryName: operationName ?? undefined,
    context: 'query'
  });

  // Return loading component only if Apollo is actually loading
  const shouldShowLoading = queryResult.loading && !queryResult.error && !queryResult.data;

  return {
    ...dynamicLoading,
    isLoading: shouldShowLoading,
    LoadingComponent: shouldShowLoading ? dynamicLoading.Loading : null
  };
}

// Utility hook for inline loading states
export function useInlineLoading(text?: string) {
  return useDynamicLoading({
    title: text || 'Loading...',
    description: '',
    variant: 'inline',
    size: 'sm'
  });
}

// Utility hook for overlay loading states  
export function useOverlayLoading(message?: string) {
  return useDynamicLoading({
    title: message || 'Processing...',
    description: '',
    variant: 'overlay'
  });
}