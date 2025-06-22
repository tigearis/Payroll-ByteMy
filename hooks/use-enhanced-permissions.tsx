// hooks/useEnhancedPermissions.tsx - Legacy wrapper for backward compatibility
import { useCachedPermissions } from "./use-cached-permissions";

// Legacy wrapper to maintain backward compatibility
export function useEnhancedPermissions() {
  return useCachedPermissions();
}

// Re-export the provider and other hooks for backward compatibility
export { 
  PermissionCacheProvider as EnhancedPermissionProvider,
  useCachedPermissions as usePermission,
  useCachedPermissions as useMinimumRole,
  useCachedPermissions as useResourceAccess
} from "./use-cached-permissions";