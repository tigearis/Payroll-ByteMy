"use client";

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useLogoutState, useNavigationGuard } from '@/lib/auth/logout-state';

/**
 * Safe wrapper around Next.js router that respects logout state
 * Prevents navigation to protected routes during logout
 */
export function useSafeRouter() {
  const router = useRouter();
  const { isLoggingOut } = useLogoutState();
  const { canNavigate } = useNavigationGuard();

  const safePush = useCallback((href: string, options?: any) => {
    if (!canNavigate(href)) {
      console.warn(`🚫 SafeRouter: Navigation to ${href} blocked during logout`);
      return;
    }

    try {
      router.push(href, options);
    } catch (error) {
      console.error('🚫 SafeRouter: Navigation error:', error);
      // If navigation fails during logout, don't throw - just log
      if (isLoggingOut) {
        console.warn('🔄 Navigation failed during logout, this is expected');
      } else {
        throw error;
      }
    }
  }, [router, canNavigate, isLoggingOut]);

  const safeReplace = useCallback((href: string, options?: any) => {
    if (!canNavigate(href)) {
      console.warn(`🚫 SafeRouter: Replace navigation to ${href} blocked during logout`);
      return;
    }

    try {
      router.replace(href, options);
    } catch (error) {
      console.error('🚫 SafeRouter: Replace navigation error:', error);
      if (isLoggingOut) {
        console.warn('🔄 Replace navigation failed during logout, this is expected');
      } else {
        throw error;
      }
    }
  }, [router, canNavigate, isLoggingOut]);

  const safeBack = useCallback(() => {
    if (isLoggingOut) {
      console.warn('🚫 SafeRouter: Back navigation blocked during logout');
      return;
    }

    try {
      router.back();
    } catch (error) {
      console.error('🚫 SafeRouter: Back navigation error:', error);
    }
  }, [router, isLoggingOut]);

  const safeForward = useCallback(() => {
    if (isLoggingOut) {
      console.warn('🚫 SafeRouter: Forward navigation blocked during logout');
      return;
    }

    try {
      router.forward();
    } catch (error) {
      console.error('🚫 SafeRouter: Forward navigation error:', error);
    }
  }, [router, isLoggingOut]);

  const safeRefresh = useCallback(() => {
    if (isLoggingOut) {
      console.warn('🚫 SafeRouter: Refresh blocked during logout');
      return;
    }

    try {
      router.refresh();
    } catch (error) {
      console.error('🚫 SafeRouter: Refresh error:', error);
    }
  }, [router, isLoggingOut]);

  // Return the safe router interface
  return {
    push: safePush,
    replace: safeReplace,
    back: safeBack,
    forward: safeForward,
    refresh: safeRefresh,
    prefetch: router.prefetch, // Prefetch is generally safe
    canNavigate,
    isLoggingOut,
  };
}