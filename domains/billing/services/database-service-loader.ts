/**
 * Database-driven Service Configuration Loader
 * Replaces hardcoded service configurations with database queries
 */

import { serverApolloClient } from '@/lib/apollo/unified-client';
import { gql } from '@apollo/client';

const GET_SERVICE_CONFIGURATIONS = gql`
  query GetServiceConfigurations {
    services(where: { is_active: { _eq: true } }) {
      id
      name
      service_code
      description
      base_rate
      category
      approval_level
      billing_unit
      charge_basis
      seniority_multipliers
    }
  }
`;

// Cache for service configurations to avoid repeated database queries
let serviceConfigCache: Record<string, any> = {};
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface ServiceConfiguration {
  code: string;
  name: string;
  defaultRate: number;
  unit: string;
  category: string;
  approvalLevel: string;
  description: string;
  chargeBasis: string;
  seniorityMultipliers?: Record<string, number>;
}

/**
 * Get service configuration from database with caching
 */
export async function getServiceConfiguration(serviceCode: string): Promise<ServiceConfiguration | null> {
  // Check if cache is valid
  const now = Date.now();
  if (now - cacheTimestamp > CACHE_DURATION || !serviceConfigCache[serviceCode]) {
    await refreshServiceConfigCache();
  }
  
  return serviceConfigCache[serviceCode] || null;
}

/**
 * Get all service configurations from database with caching
 */
export async function getAllServiceConfigurations(): Promise<Record<string, ServiceConfiguration>> {
  const now = Date.now();
  if (now - cacheTimestamp > CACHE_DURATION || Object.keys(serviceConfigCache).length === 0) {
    await refreshServiceConfigCache();
  }
  
  return serviceConfigCache;
}

/**
 * Refresh service configuration cache from database
 */
async function refreshServiceConfigCache(): Promise<void> {
  try {
    const { data } = await serverApolloClient.query({
      query: GET_SERVICE_CONFIGURATIONS,
      fetchPolicy: 'network-only'
    });
    
    serviceConfigCache = {};
    data.services.forEach((service: any) => {
      serviceConfigCache[service.service_code] = {
        code: service.service_code,
        name: service.name,
        defaultRate: service.base_rate || 0,
        unit: service.billing_unit || 'per_unit',
        category: service.category || 'standard',
        approvalLevel: service.approval_level || 'review',
        description: service.description || '',
        chargeBasis: service.charge_basis || 'per_payroll_processed',
        seniorityMultipliers: service.seniority_multipliers ? 
          JSON.parse(service.seniority_multipliers) : undefined
      };
    });
    cacheTimestamp = Date.now();
  } catch (error) {
    console.error('Failed to load service configurations from database:', error);
    throw error;
  }
}

/**
 * Legacy compatibility wrapper - maintains old SERVICE_CONFIGURATIONS interface
 */
export async function getLegacyServiceConfiguration(serviceCode: string): Promise<any> {
  const config = await getServiceConfiguration(serviceCode);
  if (!config) {
    throw new Error(`Service configuration not found for: ${serviceCode}`);
  }
  
  // Return in legacy format for backward compatibility
  return {
    code: config.code,
    name: config.name,
    defaultRate: config.defaultRate,
    unit: config.unit,
    category: config.category,
    approvalLevel: config.approvalLevel,
    description: config.description
  };
}

/**
 * Clear service configuration cache (useful for testing or forced refresh)
 */
export function clearServiceConfigCache(): void {
  serviceConfigCache = {};
  cacheTimestamp = 0;
}