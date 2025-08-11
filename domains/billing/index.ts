/**
 * Optimized Barrel Export for Billing Domain
 * 
 * PERFORMANCE OPTIMIZATION:
 * - Lazy exports to enable tree-shaking
 * - Grouped by functionality to reduce import overhead
 * - Dynamic imports for heavy components
 */

// Types (always imported - lightweight)
export type * from './graphql/generated/graphql';

// Core Components (lazy-loaded)
export const BillingItemsManager = () => import('./components/BillingItemsManager');
export const PayrollIntegrationHub = () => import('./components/PayrollIntegrationHub');
export const RecurringServicesPanel = () => import('./components/RecurringServicesPanel');

// Dashboard Components (lazy-loaded)
export const BusinessIntelligenceDashboard = () => import('./components/reporting/business-intelligence-dashboard');
export const ModernBillingItemsManager = () => import('./components/ModernBillingItemsManager');
export const OptimizedBillingDashboard = () => import('./components/OptimizedBillingDashboard');

// Management Components (lazy-loaded)
export const InvoiceManagementDashboard = () => import('./components/invoicing/invoice-management-dashboard');
export const QuoteManagementDashboard = () => import('./components/quoting/quote-management-dashboard');
export const ServiceCatalogManager = () => import('./components/service-catalog/service-catalog-manager');

// Table Components (lazy-loaded)
export const BillingItemsTable = () => import('./components/items/billing-items-table');

// Tracking Components (lazy-loaded)
export const PayrollCompletionTracker = () => import('./components/payroll-integration/payroll-completion-tracker');

// Hooks (immediately available - lightweight)
export { useLazyBillingContext } from './hooks/use-lazy-billing-context';
export { useOptimizedAnalytics } from './hooks/use-optimized-analytics';
export { useOptimizedBillingDashboard } from './hooks/use-optimized-billing-dashboard';

// Services (lazy-loaded)
export const billingServices = () => import('./services');

// GraphQL Operations (lazy-loaded)
export const billingOperations = () => import('./graphql/generated/graphql');

// Export shared types if any
// export * from './shared/types';

// Domain Configuration
export const BillingDomainConfig = {
  name: 'billing',
  version: '1.0.0',
  description: '3-Tier Billing System with Service Templates and Analytics',
  
  features: {
    // Core billing features
    tierSystem: {
      tier1: 'Payroll Date Level Billing',
      tier2: 'Payroll Level Billing', 
      tier3: 'Client Monthly Level Billing'
    },
    
    // Service management
    serviceManagement: {
      templates: 'Reusable service templates',
      bundles: 'Pre-configured service bundles',
      agreements: 'Client-specific service agreements',
      overrides: 'Payroll-specific service overrides'
    },
    
    // Analytics and reporting
    analytics: {
      costRevenue: 'Cost vs revenue analysis',
      clientProfitability: 'Client profitability metrics',
      userProductivity: 'Consultant performance analysis',
      monthlyDashboard: 'Monthly billing completion tracking'
    },
    
    // Automation
    automation: {
      automaticBilling: 'Automated 3-tier billing generation',
      monthlyAggregation: 'Monthly billing completion tracking',
      billingTriggers: 'Event-driven billing generation'
    },
    
    // Integration
    integration: {
      payrollSystem: 'Deep integration with payroll processing',
      timeTracking: 'Time entry to billing conversion',
      invoicing: 'Billing items to invoice generation'
    }
  },
  
  // API endpoints
  apiRoutes: {
    tier1: '/api/billing/tier1/generate',
    tier2: '/api/billing/tier2/generate',
    tier3: '/api/billing/tier3/generate',
    automatic: '/api/billing/process-automatic',
    analytics: '/api/billing/analytics'
  },
  
  // Database tables managed by this domain
  tables: {
    core: [
      'billing_items',
      'services',
      'client_service_agreements',
      'payroll_service_agreements'
    ],
    templates: [
      'service_templates',
      'service_template_categories',
      'client_template_bundles',
      'bundle_template_assignments'
    ],
    onboarding: [
      'client_onboarding_sessions',
      'onboarding_service_selections'
    ],
    analytics: [
      'monthly_billing_completion',
      'payroll_cost_analysis',
      'user_productivity_analysis',
      'template_usage_analytics'
    ],
    tracking: [
      'monthly_billing_dashboard',
      'user_rate_history',
      'billing_event_log'
    ]
  },
  
  // GraphQL operations
  graphqlOperations: {
    fragments: [
      'MonthlyBillingCompletionFragment',
      'PayrollServiceAgreementFragment',
      'ServiceWithTierFragment',
      'UserRateHistoryFragment'
    ],
    queries: [
      'GetMonthlyBillingDashboard',
      'GetPayrollServiceAgreements',
      'GetServicesByTier',
      'GetUserRateHistory',
      'GetPayrollCostAnalysis'
    ],
    mutations: [
      'CreatePayrollServiceAgreement',
      'UpdateMonthlyBillingCompletion',
      'CreateUserRateHistory',
      'UpdateServiceBillingTier'
    ],
    subscriptions: [
      'MonthlyBillingDashboardSubscription',
      'PayrollServiceAgreementsSubscription'
    ]
  }
} as const;

// Export configuration for other domains to reference
export default BillingDomainConfig;
