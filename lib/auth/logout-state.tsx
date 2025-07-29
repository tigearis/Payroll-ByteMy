"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

// Simplified logout state - stable during auth transitions
interface LogoutState {
  isLoggingOut: boolean;
  setLoggingOut: (value: boolean) => void;
}

const LogoutStateContext = createContext<LogoutState | null>(null);

export function LogoutStateProvider({ children }: { children: React.ReactNode }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Memoize the setter to prevent unnecessary re-renders
  const setLoggingOut = useCallback((value: boolean) => {
    console.log(`🔄 Logout state changing: ${isLoggingOut} → ${value}`);
    setIsLoggingOut(value);
    
    // Store in sessionStorage for stability across component unmounts
    if (typeof window !== 'undefined') {
      if (value) {
        sessionStorage.setItem('logout-in-progress', 'true');
        sessionStorage.setItem('logout-started-at', Date.now().toString());
        
        // Auto-clear logout state after 10 seconds to prevent permanent stuck state
        setTimeout(() => {
          const startTime = sessionStorage.getItem('logout-started-at');
          if (startTime && Date.now() - parseInt(startTime) >= 10000) {
            console.warn('⚠️ Auto-clearing stuck logout state after 10 seconds');
            setIsLoggingOut(false);
            sessionStorage.removeItem('logout-in-progress');
            sessionStorage.removeItem('logout-started-at');
          }
        }, 10000);
      } else {
        sessionStorage.removeItem('logout-in-progress');
        sessionStorage.removeItem('logout-started-at');
      }
    }
  }, [isLoggingOut]);

  // Initialize from sessionStorage on mount for stability
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLogoutState = sessionStorage.getItem('logout-in-progress') === 'true';
      if (storedLogoutState && !isLoggingOut) {
        console.log('🔄 Restoring logout state from sessionStorage');
        setIsLoggingOut(true);
      }
    }
  }, [isLoggingOut]);

  // Memoize the context value to prevent provider re-renders
  const contextValue = useMemo(() => ({
    isLoggingOut,
    setLoggingOut
  }), [isLoggingOut, setLoggingOut]);

  return (
    <LogoutStateContext.Provider value={contextValue}>
      {children}
    </LogoutStateContext.Provider>
  );
}

export function useLogoutState(): LogoutState {
  const context = useContext(LogoutStateContext);
  
  // Always return a stable object to prevent hooks count mismatches
  return useMemo(() => {
    if (context === null) {
      // Return safe defaults with no-op setter during logout transitions
      return { 
        isLoggingOut: false, 
        setLoggingOut: () => {} 
      };
    }
    return context;
  }, [context]);
}

export function useNavigationGuard() {
  const { isLoggingOut } = useLogoutState();
  
  const canNavigate = useCallback((href: string) => {
    if (isLoggingOut) {
      // Allow navigation to sign-in and root during logout
      const allowedDuringLogout = ['/sign-in', '/', '/sign-out'];
      return allowedDuringLogout.some(path => href.startsWith(path));
    }
    return true;
  }, [isLoggingOut]);

  return { canNavigate };
}