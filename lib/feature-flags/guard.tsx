"use client";

import React from 'react';
import { useFeatureFlag } from './hook';
import { FeatureFlagKey } from './types';

interface FeatureFlagGuardProps {
  feature: FeatureFlagKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureFlagGuard({ 
  feature, 
  children, 
  fallback = null 
}: FeatureFlagGuardProps) {
  const isEnabled = useFeatureFlag(feature);
  
  if (!isEnabled) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// Higher-order component version
export function withFeatureFlag<P extends object>(
  Component: React.ComponentType<P>,
  feature: FeatureFlagKey,
  fallback?: React.ReactNode
) {
  return function FeatureFlaggedComponent(props: P) {
    return (
      <FeatureFlagGuard feature={feature} fallback={fallback}>
        <Component {...props} />
      </FeatureFlagGuard>
    );
  };
}