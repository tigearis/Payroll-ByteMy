// components/refresh-button.tsx
"use client";

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCacheInvalidation } from '@/hooks/useCacheInvalidation';

interface RefreshButtonProps {
  /**
   * Type of refresh action to perform
   */
  type: 'query' | 'entity' | 'payrolls' | 'all';
  
  /**
   * For 'query' type: names of queries to refresh
   * For 'payrolls' type: array of payroll IDs to refresh
   * For 'entity' type: entity data (typename and id)
   */
  data?: string[] | { typename: string; id: string | number } | any;
  
  /**
   * Whether to show toast notifications
   */
  showToast?: boolean;
  
  /**
   * Custom text to display on the button
   */
  text?: string;
  
  /**
   * Whether to show the refresh icon
   */
  showIcon?: boolean;
  
  /**
   * Button variant
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  
  /**
   * Additional class names
   */
  className?: string;
  
  /**
   * Callback when refresh is complete
   */
  onRefreshComplete?: (success: boolean) => void;
}

/**
 * A button that refreshes data from the server
 */
export function RefreshButton({
  type,
  data,
  showToast = true,
  text = 'Refresh',
  showIcon = true,
  variant = 'outline',
  className,
  onRefreshComplete
}: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { 
    refetchQueries, 
    invalidateEntity, 
    refreshPayrolls, 
    resetCache 
  } = useCacheInvalidation();
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    let success = false;
    
    try {
      switch (type) {
        case 'query':
          if (Array.isArray(data)) {
            success = await refetchQueries(data, showToast);
          } else {
            console.error('Data must be an array of query names for type "query"');
          }
          break;
          
        case 'entity':
          if (data && typeof data === 'object' && 'typename' in data && 'id' in data) {
            success = await invalidateEntity(data);
            // Also refetch relevant queries to update UI
            await refetchQueries(['GET_PAYROLLS', 'GET_PAYROLLS_BY_MONTH'], false);
          } else {
            console.error('Data must be an object with typename and id for type "entity"');
          }
          break;
          
        case 'payrolls':
          if (Array.isArray(data)) {
            success = await refreshPayrolls(data, showToast);
          } else {
            console.error('Data must be an array of payroll IDs for type "payrolls"');
          }
          break;
          
        case 'all':
          success = await resetCache(showToast);
          break;
          
        default:
          console.error('Unknown refresh type:', type);
      }
    } finally {
      setIsRefreshing(false);
      
      if (onRefreshComplete) {
        onRefreshComplete(success);
      }
    }
  };
  
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={cn(
        "gap-1.5",
        className
      )}
    >
      {showIcon && (
        <RefreshCw
          className={cn(
            "h-3.5 w-3.5",
            isRefreshing && "animate-spin"
          )}
        />
      )}
      {isRefreshing ? 'Refreshing...' : text}
    </Button>
  );
}