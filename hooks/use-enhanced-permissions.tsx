// hooks/useEnhancedPermissions.tsx - Legacy wrapper for backward compatibility
import { useAuthContext } from "@/lib/auth/auth-context";

// Legacy wrapper to maintain backward compatibility
export function useEnhancedPermissions() {
  const authContext = useAuthContext();
  
  return {
    // Core auth context properties
    ...authContext,
    
    // Legacy compatibility properties  
    isLoaded: !authContext.isLoading,
    canAccessDashboard: true, // Dashboard is always accessible to authenticated users
    navigation: {
      canAccess: {
        dashboard: true,
        staff: authContext.hasPermission("custom:staff:read"),
        payrolls: authContext.hasPermission("custom:payroll:read"),
        clients: authContext.hasPermission("custom:client:read"),
        settings: authContext.hasPermission("custom:settings:write"),
      }
    },
  };
}