"use client";

import { usePathname } from "next/navigation";
import { type ResourceName, RESOURCES } from "@/components/auth/resource-context";

/**
 * Path to Resource Mapping Configuration
 * 
 * Maps URL paths to resource names for automatic resource context detection.
 * Supports exact matches, prefix matches, and pattern matches.
 */
interface PathMapping {
  path: string;
  resource: ResourceName;
  exact?: boolean; // If true, must match exactly, otherwise prefix match
  priority?: number; // Higher priority matches first (for overlapping paths)
}

/**
 * Default path-to-resource mappings
 * Ordered by priority (higher priority first)
 */
const DEFAULT_PATH_MAPPINGS: PathMapping[] = [
  // Specific billing sub-resources (higher priority)
  { path: "/billing/items", resource: "billing_items", priority: 100 },
  { path: "/billing/invoices", resource: "billing", priority: 90 },
  { path: "/billing/quotes", resource: "billing", priority: 90 },
  { path: "/billing/services", resource: "billing", priority: 90 },
  { path: "/billing/time-tracking", resource: "billing", priority: 90 },
  { path: "/billing/profitability", resource: "billing", priority: 90 },
  
  // General billing (lower priority, catches /billing/*)
  { path: "/billing", resource: "billing", priority: 50 },
  
  // Staff management
  { path: "/staff", resource: "staff", priority: 50 },
  
  // Payroll management
  { path: "/payrolls", resource: "payrolls", priority: 50 },
  { path: "/payroll-schedule", resource: "schedule", priority: 50 },
  
  // Client management
  { path: "/clients", resource: "clients", priority: 50 },
  
  // Reports and analytics
  { path: "/reports", resource: "reports", priority: 50 },
  
  // Settings and configuration
  { path: "/settings", resource: "settings", priority: 50 },
  
  // Leave management
  { path: "/leave", resource: "leave", priority: 50 },
  
  // Work schedule
  { path: "/work-schedule", resource: "workschedule", priority: 50 },
  
  // AI features  
  { path: "/ai-assistant", resource: "ai", priority: 50 },
  { path: "/ai", resource: "ai", priority: 50 },
  
  // Calendar
  { path: "/calendar", resource: "calendar", priority: 50 },
  
  // Email management
  { path: "/email", resource: "email", priority: 50 },
  
  // Invitations
  { path: "/invitations", resource: "invitations", priority: 50 },
  
  // Tax calculator
  { path: "/tax-calculator", resource: "tax", priority: 50 },
  
  // User profile
  { path: "/profile", resource: "profile", priority: 50 },
  
  // Onboarding
  { path: "/onboarding", resource: "onboarding", priority: 50 },
  
  // Admin and developer (use system resource)
  { path: "/admin", resource: "system", priority: 50 },
  { path: "/developer", resource: "system", priority: 50 },
  
  // Bulk upload
  { path: "/bulk-upload", resource: "bulkupload", priority: 50 },
  
  // Security
  { path: "/security", resource: "security", priority: 50 },
  
  // Dashboard (lowest priority)
  { path: "/dashboard", resource: "dashboard", priority: 10 },
  { path: "/", resource: "dashboard", exact: true, priority: 10 },
];

/**
 * Custom path mappings that can be added by the application
 */
let customPathMappings: PathMapping[] = [];

/**
 * Add custom path mapping
 * 
 * @param mapping - Custom path mapping to add
 */
export function addPathMapping(mapping: PathMapping) {
  customPathMappings.push(mapping);
  // Sort by priority (highest first)
  customPathMappings.sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

/**
 * Remove custom path mapping
 * 
 * @param path - Path to remove mapping for
 */
export function removePathMapping(path: string) {
  customPathMappings = customPathMappings.filter(m => m.path !== path);
}

/**
 * Get all path mappings (custom + default) sorted by priority
 */
function getAllPathMappings(): PathMapping[] {
  const allMappings = [...customPathMappings, ...DEFAULT_PATH_MAPPINGS];
  return allMappings.sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

/**
 * Detect resource from pathname using configured mappings
 * 
 * @param pathname - The pathname to analyze
 * @returns The detected resource name or null if no match
 */
export function detectResourceFromPath(pathname: string): ResourceName | null {
  if (!pathname) return null;
  
  // Normalize pathname (remove trailing slash, convert to lowercase)
  const normalizedPath = pathname.toLowerCase().replace(/\/$/, '') || '/';
  
  const mappings = getAllPathMappings();
  
  for (const mapping of mappings) {
    const mappingPath = mapping.path.toLowerCase();
    
    if (mapping.exact) {
      // Exact match required
      if (normalizedPath === mappingPath) {
        return mapping.resource;
      }
    } else {
      // Prefix match (default behavior)
      if (normalizedPath.startsWith(mappingPath)) {
        // Ensure we're matching at word boundaries
        const nextChar = normalizedPath[mappingPath.length];
        if (!nextChar || nextChar === '/' || nextChar === '?') {
          return mapping.resource;
        }
      }
    }
  }
  
  return null;
}

/**
 * Hook to automatically detect resource from current pathname
 * 
 * @param fallback - Fallback resource if detection fails
 * @returns The detected resource name or fallback
 */
export function usePathResource(fallback?: ResourceName): ResourceName | null {
  const pathname = usePathname();
  
  const detectedResource = detectResourceFromPath(pathname);
  
  return detectedResource || fallback || null;
}

/**
 * Hook to get detailed path resource information
 * 
 * @returns Object with resource, pathname, and matching details
 */
export function usePathResourceInfo() {
  const pathname = usePathname();
  const resource = detectResourceFromPath(pathname);
  
  // Find the matching mapping for debugging
  const mappings = getAllPathMappings();
  const normalizedPath = pathname.toLowerCase().replace(/\/$/, '') || '/';
  
  let matchedMapping: PathMapping | null = null;
  
  for (const mapping of mappings) {
    const mappingPath = mapping.path.toLowerCase();
    
    if (mapping.exact) {
      if (normalizedPath === mappingPath) {
        matchedMapping = mapping;
        break;
      }
    } else {
      if (normalizedPath.startsWith(mappingPath)) {
        const nextChar = normalizedPath[mappingPath.length];
        if (!nextChar || nextChar === '/' || nextChar === '?') {
          matchedMapping = mapping;
          break;
        }
      }
    }
  }
  
  return {
    pathname,
    resource,
    matchedMapping,
    availableMappings: mappings.length,
  };
}

/**
 * Debug function to test path detection
 * Only available in development mode
 * 
 * @param testPaths - Array of paths to test
 * @returns Array of test results
 */
export function debugPathDetection(testPaths: string[]) {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('debugPathDetection is only available in development mode');
    return [];
  }
  
  return testPaths.map(path => ({
    path,
    resource: detectResourceFromPath(path),
    normalized: path.toLowerCase().replace(/\/$/, '') || '/',
  }));
}

/**
 * Get all available resources for debugging
 */
export function getAvailableResources(): ResourceName[] {
  return Object.values(RESOURCES);
}

/**
 * Validate that a resource name is valid
 */
export function isValidResource(resource: string): resource is ResourceName {
  return Object.values(RESOURCES).includes(resource as ResourceName);
}