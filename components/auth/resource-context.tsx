"use client";

import { createContext, useContext, ReactNode } from "react";

/**
 * Resource Context for Permission Guards
 * 
 * Provides a page-level resource context that permission guards can inherit,
 * reducing repetition and improving maintainability.
 * 
 * Usage:
 * ```tsx
 * export const RESOURCE = "billing" as const;
 * 
 * <ResourceProvider resource={RESOURCE}>
 *   <PermissionGuard action="create">
 *     <CreateButton />
 *   </PermissionGuard>
 * </ResourceProvider>
 * ```
 */

// Valid resource names in the system
export type ResourceName = 
  | "billing"
  | "billing_items"
  | "staff"
  | "payrolls"
  | "clients"
  | "reports"
  | "settings"
  | "system"
  | "dashboard"
  | "leave"
  | "schedule"
  | "workschedule"
  | "ai"
  | "bulkupload"
  | "email"
  | "invitations"
  | "security"
  | "calendar"
  | "onboarding"
  | "tax"
  | "profile";

// Valid actions for permissions
export type PermissionAction = 
  | "read"
  | "create"
  | "update"
  | "delete"
  | "list"
  | "manage"
  | "approve"
  | "export"
  | "admin"
  | "assign"
  | "invite";

// Resource context type
interface ResourceContextType {
  resource: ResourceName | null;
}

// Create the context
const ResourceContext = createContext<ResourceContextType>({ resource: null });

// Provider component props
interface ResourceProviderProps {
  resource: ResourceName | null;
  children: ReactNode;
}

/**
 * ResourceProvider - Provides resource context to child permission guards
 * 
 * Can be used at app-level (resource from page props) or page-level (fixed resource)
 * 
 * @param resource - The resource name for this page/section, or null for app-level usage
 * @param children - Child components that may use permission guards
 */
export function ResourceProvider({ resource, children }: ResourceProviderProps) {
  return (
    <ResourceContext.Provider value={{ resource }}>
      {children}
    </ResourceContext.Provider>
  );
}

/**
 * Hook to access the current resource context
 * 
 * @returns The current resource name or null if no context
 */
export function useResourceContext(): ResourceName | null {
  const context = useContext(ResourceContext);
  return context.resource;
}

/**
 * Hook to build a permission string from resource and action
 * 
 * @param action - The permission action
 * @param resourceOverride - Optional resource override
 * @returns The formatted permission string (resource.action)
 */
export function usePermissionString(
  action: PermissionAction,
  resourceOverride?: ResourceName
): string {
  const contextResource = useResourceContext();
  const resource = resourceOverride || contextResource;
  
  if (!resource) {
    throw new Error(
      `Permission action "${action}" requires a resource context. ` +
      `Either wrap in <ResourceProvider> or provide resourceOverride.`
    );
  }
  
  return `${resource}.${action}`;
}

/**
 * Utility to validate resource/action combinations
 * Can be extended to enforce business rules about valid combinations
 */
export function isValidResourceAction(
  resource: ResourceName,
  action: PermissionAction
): boolean {
  // For now, all combinations are valid
  // This can be extended to enforce specific business rules
  return true;
}

/**
 * Type-safe resource constants for pages to export
 */
export const RESOURCES = {
  BILLING: "billing" as const,
  BILLING_ITEMS: "billing_items" as const,
  STAFF: "staff" as const,
  PAYROLLS: "payrolls" as const,
  CLIENTS: "clients" as const,
  REPORTS: "reports" as const,
  SETTINGS: "settings" as const,
  SYSTEM: "system" as const,
  DASHBOARD: "dashboard" as const,
  LEAVE: "leave" as const,
  SCHEDULE: "schedule" as const,
  WORKSCHEDULE: "workschedule" as const,
  AI: "ai" as const,
  BULKUPLOAD: "bulkupload" as const,
  EMAIL: "email" as const,
  INVITATIONS: "invitations" as const,
  SECURITY: "security" as const,
  CALENDAR: "calendar" as const,
  ONBOARDING: "onboarding" as const,
  TAX: "tax" as const,
  PROFILE: "profile" as const,
} as const;

/**
 * Common permission actions constants
 */
export const ACTIONS = {
  READ: "read" as const,
  CREATE: "create" as const,
  UPDATE: "update" as const,
  DELETE: "delete" as const,
  LIST: "list" as const,
  MANAGE: "manage" as const,
  APPROVE: "approve" as const,
  EXPORT: "export" as const,
  ADMIN: "admin" as const,
  ASSIGN: "assign" as const,
  INVITE: "invite" as const,
} as const;