// Billing Components - Unified Export Index
// This file provides centralized access to all billing-related components

// Analytics Components
export * from './analytics';

// Client Billing Components
export * from './client-billing';

// Dashboard Components
export * from './dashboard';

// Invoicing Components
export * from './invoicing';

// Billing Items Components
export { BillingItemDetails } from './items/billing-item-details';
export { BillingItemForm } from './items/billing-item-form';
export { BillingItemsTable } from './items/billing-items-table';

// Onboarding Components
export * from './onboarding';

// Payroll Billing Components
export * from './payroll-billing';

// Payroll Integration Components
export * from './payroll-integration';

// Profitability Components
export { ProfitabilityDashboard } from './profitability/profitability-dashboard';

// Quoting Components
export { QuoteBuilder } from './quoting/quote-builder';
export { QuoteManagementDashboard } from './quoting/quote-management-dashboard';

// Reporting Components
export * from './reporting';

// Service Catalog Components
export * from './service-catalog';

// Services Components
export { EnhancedServiceCatalog } from './services/enhanced-service-catalog';

// Template Components
export * from './templates';

// Time Tracking Components
export { BillingGenerationModal } from './time-tracking/billing-generation-modal';
export { EnhancedTimeEntry } from './time-tracking/enhanced-time-entry';
export { TimeEntryModal } from './time-tracking/time-entry-modal';

// Component Categories for Easy Navigation
export const BillingComponentCategories = {
  analytics: [
    'ServicePerformanceChart',
    'RevenueMetrics', 
    'CostRevenueAnalyticsDashboard'
  ],
  
  clientManagement: [
    'ClientBillingInterface',
    'EnhancedClientServiceManager',
    'ClientServiceAgreements'
  ],
  
  onboarding: [
    'ClientOnboardingWizard'
  ],
  
  payrollIntegration: [
    'PayrollBillingInterface',
    'PayrollServiceOverrides',
    'PayrollCompletionTracker'
  ],
  
  templates: [
    'ServiceTemplateManager',
    'TemplateBundleManager'
  ],
  
  invoicing: [
    'InvoiceGenerator',
    'InvoiceManagementDashboard',
    'InvoiceConsolidationManager'
  ],
  
  reporting: [
    'BusinessIntelligenceDashboard',
    'ClientProfitabilityAnalyzer',
    'FinancialPerformanceDashboard'
  ],
  
  billingItems: [
    'BillingItemsTable',
    'BillingItemForm',
    'BillingItemDetails'
  ],
  
  timeTracking: [
    'EnhancedTimeEntry',
    'TimeEntryModal',
    'BillingGenerationModal'
  ]
} as const;

// Usage Examples for Common Workflows
export const BillingWorkflows = {
  // Complete client setup workflow
  clientSetup: [
    'ClientOnboardingWizard',        // Step 1: Client onboarding
    'ServiceTemplateManager',        // Step 2: Setup service templates
    'EnhancedClientServiceManager'   // Step 3: Manage service agreements
  ],
  
  // Billing generation workflow
  billingGeneration: [
    'PayrollCompletionTracker',      // Step 1: Track payroll completion
    'PayrollServiceOverrides',       // Step 2: Configure overrides
    'BillingGenerationModal',        // Step 3: Generate billing items
    'BillingItemsTable'              // Step 4: Review generated items
  ],
  
  // Invoice management workflow
  invoiceManagement: [
    'BillingItemsTable',             // Step 1: Select billing items
    'InvoiceGenerator',              // Step 2: Generate invoice
    'InvoiceManagementDashboard'     // Step 3: Manage invoices
  ],
  
  // Analytics and reporting workflow
  analytics: [
    'CostRevenueAnalyticsDashboard', // Step 1: Cost vs revenue analysis
    'ClientProfitabilityAnalyzer',   // Step 2: Client profitability
    'BusinessIntelligenceDashboard'  // Step 3: Business intelligence
  ]
} as const;

// Component Dependencies for Proper Import Management
export const ComponentDependencies = {
  // UI Components (assumed to be available globally)
  ui: ['Card', 'Button', 'Input', 'Select', 'Badge', 'Dialog', 'Tabs'],
  
  // External Libraries
  external: ['@apollo/client', 'recharts', 'lucide-react'],
  
  // Internal Hooks
  hooks: ['use-toast', 'use-current-user'],
  
  // GraphQL Operations
  graphql: ['3tier-billing-operations.graphql', 'billing-items-operations.graphql'],
  
  // API Routes
  api: [
    '/api/billing/tier1/generate',
    '/api/billing/tier2/generate', 
    '/api/billing/tier3/generate',
    '/api/billing/process-automatic'
  ]
} as const;