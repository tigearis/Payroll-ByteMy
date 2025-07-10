import { NextRequest, NextResponse } from 'next/server';
import { FeatureFlagKey } from './types';

interface FeatureFlagResponse {
  enabled: boolean;
  feature: string;
}

// Server-side feature flag check for API routes
export async function checkFeatureFlag(
  feature: FeatureFlagKey,
  req: NextRequest
): Promise<FeatureFlagResponse> {
  // Check environment variables first for simple flags
  const envVarName = `FEATURE_${feature.toUpperCase()}`;
  const envFlag = process.env[envVarName];
  
  if (envFlag !== undefined) {
    return {
      enabled: envFlag === 'true',
      feature,
    };
  }

  // For now, use default values - in production, this would query the database
  // TODO: Implement database check for feature flags
  const defaultFlags: Record<FeatureFlagKey, boolean> = {
    aiAssistant: process.env.NODE_ENV === 'development',
    aiDataAssistant: process.env.NODE_ENV === 'development',
    aiFloat: process.env.NODE_ENV === 'development',
    aiDebug: process.env.NODE_ENV === 'development',
    ollamaIntegration: process.env.NODE_ENV === 'development',
    
    mfaEnabled: true,
    stepUpAuth: true,
    enhancedPermissions: true,
    permissionDebug: process.env.NODE_ENV === 'development',
    auditLogging: true,
    sessionMonitoring: true,
    securityReporting: true,
    
    devTools: process.env.NODE_ENV === 'development',
    debugPanels: process.env.NODE_ENV === 'development',
    authDebug: process.env.NODE_ENV === 'development',
    
    billingAccess: true,
    financialReporting: true,
    
    taxCalculator: process.env.NODE_ENV === 'development',
    taxCalculatorProd: false,
    
    bulkOperations: true,
    dataExport: true,
    userManagement: true,
  };

  return {
    enabled: defaultFlags[feature] ?? false,
    feature,
  };
}

// Middleware for API routes to check feature flags
export function withFeatureFlag(feature: FeatureFlagKey) {
  return async function(
    req: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse>
  ) {
    const featureCheck = await checkFeatureFlag(feature, req);
    
    if (!featureCheck.enabled) {
      return NextResponse.json(
        { 
          error: 'Feature Disabled',
          message: `The ${feature} feature is currently disabled.`,
          feature: feature,
        },
        { status: 503 }
      );
    }
    
    return handler(req);
  };
}