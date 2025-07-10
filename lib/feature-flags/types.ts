/**
 * Feature flag types and definitions
 */

export interface FeatureFlag {
  id: string;
  featureName: string;
  isEnabled: boolean;
  allowedRoles: string[];
  updatedAt: string;
}

export interface FeatureFlagConfig {
  // AI Assistant Features
  aiAssistant: boolean;
  aiDataAssistant: boolean;
  aiFloat: boolean;
  aiDebug: boolean;
  ollamaIntegration: boolean;
  
  // Security Features
  mfaEnabled: boolean;
  stepUpAuth: boolean;
  enhancedPermissions: boolean;
  permissionDebug: boolean;
  auditLogging: boolean;
  sessionMonitoring: boolean;
  securityReporting: boolean;
  
  // Developer Tools
  devTools: boolean;
  debugPanels: boolean;
  authDebug: boolean;
  
  // Financial & Billing
  billingAccess: boolean;
  financialReporting: boolean;
  
  // Tax Calculator
  taxCalculator: boolean;
  taxCalculatorProd: boolean;
  
  // Advanced Features
  bulkOperations: boolean;
  dataExport: boolean;
  userManagement: boolean;
}

export type FeatureFlagKey = keyof FeatureFlagConfig;

export const FEATURE_FLAG_NAMES: Record<FeatureFlagKey, string> = {
  // AI Assistant Features
  aiAssistant: 'ai_assistant',
  aiDataAssistant: 'aidata_assistant',
  aiFloat: 'ai_float',
  aiDebug: 'ai_debug',
  ollamaIntegration: 'ollama_integration',
  
  // Security Features
  mfaEnabled: 'mfa_enabled',
  stepUpAuth: 'step_up_auth',
  enhancedPermissions: 'enhanced_permissions',
  permissionDebug: 'permission_debug',
  auditLogging: 'audit_logging',
  sessionMonitoring: 'session_monitoring',
  securityReporting: 'security_reporting',
  
  // Developer Tools
  devTools: 'dev_tools',
  debugPanels: 'debug_panels',
  authDebug: 'auth_debug',
  
  // Financial & Billing
  billingAccess: 'billing_access',
  financialReporting: 'financial_reporting',
  
  // Tax Calculator
  taxCalculator: 'tax_calculator',
  taxCalculatorProd: 'tax_calculator_prod',
  
  // Advanced Features
  bulkOperations: 'bulk_operations',
  dataExport: 'data_export',
  userManagement: 'user_management',
};

export const DEFAULT_FEATURE_FLAGS: FeatureFlagConfig = {
  // AI Assistant Features (disabled by default)
  aiAssistant: false,
  aiDataAssistant: false,
  aiFloat: false,
  aiDebug: false,
  ollamaIntegration: false,
  
  // Security Features (enabled by default for security)
  mfaEnabled: true,
  stepUpAuth: true,
  enhancedPermissions: true,
  permissionDebug: false,
  auditLogging: true,
  sessionMonitoring: true,
  securityReporting: true,
  
  // Developer Tools (disabled by default)
  devTools: false,
  debugPanels: false,
  authDebug: false,
  
  // Financial & Billing (enabled by default)
  billingAccess: true,
  financialReporting: true,
  
  // Tax Calculator (disabled by default)
  taxCalculator: false,
  taxCalculatorProd: false,
  
  // Advanced Features (enabled by default)
  bulkOperations: true,
  dataExport: true,
  userManagement: true,
};