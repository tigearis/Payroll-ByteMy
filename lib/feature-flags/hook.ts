"use client";

import { useQuery } from '@apollo/client';
import { useUser } from '@clerk/nextjs';
import { useMemo } from 'react';
import { GET_FEATURE_FLAGS } from './queries';
import { 
  FeatureFlagConfig, 
  FeatureFlagKey, 
  FEATURE_FLAG_NAMES, 
  DEFAULT_FEATURE_FLAGS,
  type FeatureFlag
} from './types';
// Logout state management removed - using Clerk's UserButton instead

interface UseFeatureFlagsResult {
  flags: FeatureFlagConfig;
  isLoading: boolean;
  error: any;
  isFeatureEnabled: (feature: FeatureFlagKey) => boolean;
  refetch: () => void;
}

export function useFeatureFlags(): UseFeatureFlagsResult {
  const { user, isSignedIn } = useUser();
  const userRole = user?.publicMetadata?.role as string;
  
  const { data, loading, error, refetch } = useQuery(GET_FEATURE_FLAGS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    skip: !isSignedIn, // Skip query when user is not signed in
  });

  const flags = useMemo(() => {
    if (!data?.featureFlags) {
      return DEFAULT_FEATURE_FLAGS;
    }

    const flagsFromDB = data.featureFlags as FeatureFlag[];
    const result: FeatureFlagConfig = { ...DEFAULT_FEATURE_FLAGS };

    // Process each feature flag from the database
    flagsFromDB.forEach((flag) => {
      const flagKey = Object.keys(FEATURE_FLAG_NAMES).find(
        key => FEATURE_FLAG_NAMES[key as FeatureFlagKey] === flag.featureName
      ) as FeatureFlagKey;

      if (flagKey) {
        // Check if feature is enabled and if user has required role
        const isEnabled = flag.isEnabled;
        const allowedRoles = flag.allowedRoles || [];
        const hasRequiredRole = allowedRoles.length === 0 || allowedRoles.includes(userRole);
        
        result[flagKey] = isEnabled && hasRequiredRole;
      }
    });

    return result;
  }, [data, userRole]);

  const isFeatureEnabled = (feature: FeatureFlagKey): boolean => {
    return flags[feature] ?? DEFAULT_FEATURE_FLAGS[feature];
  };

  return {
    flags,
    isLoading: loading,
    error,
    isFeatureEnabled,
    refetch,
  };
}

export function useFeatureFlag(feature: FeatureFlagKey): boolean {
  const { isFeatureEnabled } = useFeatureFlags();
  return isFeatureEnabled(feature);
}