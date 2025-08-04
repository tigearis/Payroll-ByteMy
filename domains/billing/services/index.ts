// Billing Services - Export Index
// Centralized access to all billing-related services

// Export pricing engine
export * from './pricing-engine';

// Service configuration
export const BillingServicesConfig = {
  name: 'billing-services',
  version: '1.0.0',
  description: 'Billing domain services and utilities',
  
  services: {
    pricingEngine: 'Advanced pricing calculations and rules engine',
  }
} as const;

export default BillingServicesConfig;