"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface LogoutErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface LogoutErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * Error boundary specifically for handling logout and authentication errors
 * Provides graceful fallback when logout process encounters issues
 */
export class LogoutErrorBoundary extends React.Component<
  LogoutErrorBoundaryProps,
  LogoutErrorBoundaryState
> {
  constructor(props: LogoutErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): LogoutErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error but don't block the logout process
    console.warn('⚠️ Logout error boundary caught error:', error, errorInfo);
    
    // If this is a logout-related error, try to force redirect to home
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      console.log('🔄 Forcing redirect to home due to network error during logout');
      window.location.href = '/';
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI for logout errors - minimal and safe
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Signing out...
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              If this takes too long, please close your browser or{' '}
              <a href="/" className="text-blue-600 hover:text-blue-500 underline">
                click here
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook version for functional components
 */
export function useLogoutErrorHandler() {
  const router = useRouter();

  const handleLogoutError = React.useCallback((error: Error) => {
    console.warn('⚠️ Logout error handled:', error);
    
    // For any logout error, try to navigate to home
    try {
      router.push('/');
    } catch (routerError) {
      // If router fails, force page navigation
      console.warn('⚠️ Router failed during logout, forcing page navigation');
      window.location.href = '/';
    }
  }, [router]);

  return { handleLogoutError };
}