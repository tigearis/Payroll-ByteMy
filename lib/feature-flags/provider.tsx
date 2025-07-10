"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useFeatureFlags } from './hook';
import { FeatureFlagConfig, FeatureFlagKey } from './types';

interface FeatureFlagContextValue {
  flags: FeatureFlagConfig;
  isLoading: boolean;
  error: any;
  isFeatureEnabled: (feature: FeatureFlagKey) => boolean;
  refetch: () => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | undefined>(undefined);

interface FeatureFlagProviderProps {
  children: ReactNode;
}

export function FeatureFlagProvider({ children }: FeatureFlagProviderProps) {
  const featureFlags = useFeatureFlags();
  
  return (
    <FeatureFlagContext.Provider value={featureFlags}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlagContext() {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlagContext must be used within a FeatureFlagProvider');
  }
  return context;
}