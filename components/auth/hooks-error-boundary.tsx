"use client";

import React from 'react';

interface HooksErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface HooksErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * Error boundary specifically for React hooks errors during auth transitions
 * Catches "Rendered more hooks than during the previous render" errors
 */
export class HooksErrorBoundary extends React.Component<
  HooksErrorBoundaryProps,
  HooksErrorBoundaryState
> {
  constructor(props: HooksErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): HooksErrorBoundaryState {
    // Check if this is a hooks rendering error or App Router error
    const isHooksError = error.message?.includes('hooks') || 
                        error.message?.includes('previous render') ||
                        error.stack?.includes('updateWorkInProgressHook') ||
                        error.stack?.includes('updateMemo') ||
                        error.stack?.includes('Router') ||
                        error.stack?.includes('AppRouter') ||
                        error.stack?.includes('ServerRoot');
    
    if (isHooksError) {
      console.warn('🔄 Hooks/Router error caught during auth transition:', error.message);
      console.warn('🔄 Error stack includes App Router components:', error.stack);
      return { hasError: true, error };
    }
    
    // Re-throw non-hooks errors
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('🔄 Hooks error boundary caught error during auth transition:', error, errorInfo);
    
    // For App Router errors during sign-out, try immediate recovery
    const isAppRouterError = error.stack?.includes('Router') || 
                            error.stack?.includes('AppRouter') ||
                            error.stack?.includes('ServerRoot');
    
    if (isAppRouterError) {
      console.log('🔄 App Router error detected, attempting immediate recovery...');
      // Immediate recovery for router errors
      setTimeout(() => {
        this.setState({ hasError: false });
      }, 10);
    } else {
      // Standard hooks errors - slightly longer delay
      setTimeout(() => {
        this.setState({ hasError: false });
      }, 100);
    }
  }

  render() {
    if (this.state.hasError) {
      // Show minimal loading state during hooks error recovery
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Loading...</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}