"use client";

import { ReactNode } from "react";
import { ResourceProvider, useResourceContext, type ResourceName } from "@/components/auth/resource-context";

interface ResourceLayoutProps {
  resource: ResourceName;
  children: ReactNode;
}

/**
 * Resource Layout - Wraps page content with resource context
 * 
 * Use this in your app layout or root layout to provide resource context
 * to all child components. Pages just need to pass their resource.
 * 
 * Usage in layout:
 * ```tsx
 * <ResourceLayout resource={pageResource}>
 *   <PageContent />
 * </ResourceLayout>
 * ```
 */
export function ResourceLayout({ resource, children }: ResourceLayoutProps) {
  return (
    <ResourceProvider resource={resource}>
      {children}
    </ResourceProvider>
  );
}

/**
 * Hook to get the current page resource from layout
 * Useful for debugging or conditional logic based on current resource
 */
export function useCurrentPageResource(): ResourceName | null {
  const resource = useResourceContext();
  return resource;
}

// Re-export for convenience
export { useResourceContext } from "@/components/auth/resource-context";