"use client";

/**
 * Simplified Authentication Guard Component
 * 
 * Replaces the complex PermissionGuard with simple role-based checking.
 * Supports basic admin/manager/authenticated access control.
 */

import { type ReactNode } from "react";
import { useSimpleAuth } from "@/lib/auth/simple-auth-context";
import { SimpleRole, hasRoleLevel } from "@/lib/auth/simple-permissions";

interface SimpleAuthGuardProps {
  children: ReactNode;
  
  // Access level requirements (choose one)
  requireAdmin?: boolean;          // org_admin or developer
  requireManager?: boolean;        // manager or higher  
  requireDeveloper?: boolean;      // developer only
  requireRole?: SimpleRole;        // specific role or higher
  requireAuth?: boolean;          // just authenticated (default: true)
  
  // UI customization
  fallback?: ReactNode;           // Custom unauthorized component
  showError?: boolean;            // Show error message (default: true)
  redirectTo?: string;           // Redirect URL for unauthorized access
  
  // Audit settings
  auditAccess?: boolean;         // Log access attempts (default: false)
  auditResource?: string;        // Resource being accessed (for audit)
}

interface UnauthorizedMessageProps {
  requiredAccess: string;
  userRole: SimpleRole;
  canRetry?: boolean;
  onRetry?: () => void;
}

function UnauthorizedMessage({ 
  requiredAccess, 
  userRole, 
  canRetry = true,
  onRetry 
}: UnauthorizedMessageProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px] p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔒</span>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Access Denied
        </h2>
        
        <p className="text-gray-600 mb-4">
          You need <strong>{requiredAccess}</strong> access to view this content.
        </p>
        
        <p className="text-sm text-gray-500 mb-4">
          Your current role: <span className="font-medium">{userRole}</span>
        </p>
        
        {canRetry && (
          <button
            onClick={onRetry || (() => window.location.reload())}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Access
          </button>
        )}
      </div>
    </div>
  );
}

export function SimpleAuthGuard({
  children,
  requireAdmin = false,
  requireManager = false,
  requireDeveloper = false,
  requireRole,
  requireAuth = true,
  fallback,
  showError = true,
  redirectTo,
  auditAccess = false,
  auditResource,
}: SimpleAuthGuardProps) {
  const {
    isAuthenticated,
    isLoading,
    userRole,
    isAdmin,
    isManager,
    isDeveloper,
    logAuditEvent,
  } = useSimpleAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-2"></div>
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    if (auditAccess) {
      logAuditEvent("access_denied", { 
        reason: "not_authenticated",
        resource: auditResource 
      });
    }
    
    if (redirectTo) {
      window.location.href = redirectTo;
      return null;
    }
    
    if (fallback) {
      return <>{fallback}</>;
    }
    
    if (showError) {
      return (
        <UnauthorizedMessage 
          requiredAccess="Authentication"
          userRole={userRole}
          onRetry={() => window.location.href = "/sign-in"}
        />
      );
    }
    
    return null;
  }

  // Determine access requirement and check
  let hasAccess = true;
  let requiredAccessDescription = "Authentication";

  if (requireDeveloper) {
    hasAccess = isDeveloper;
    requiredAccessDescription = "Developer";
  } else if (requireAdmin) {
    hasAccess = isAdmin;
    requiredAccessDescription = "Administrator";
  } else if (requireManager) {
    hasAccess = isManager;
    requiredAccessDescription = "Manager";
  } else if (requireRole) {
    hasAccess = hasRoleLevel(userRole, requireRole);
    requiredAccessDescription = `${requireRole} or higher`;
  }

  // Log access attempt if auditing enabled
  if (auditAccess) {
    logAuditEvent(hasAccess ? "auth_login" : "access_denied", {
      resource: auditResource,
      requiredAccess: requiredAccessDescription,
      userRole,
      granted: hasAccess,
    });
  }

  // Handle access denied
  if (!hasAccess) {
    if (redirectTo) {
      window.location.href = redirectTo;
      return null;
    }
    
    if (fallback) {
      return <>{fallback}</>;
    }
    
    if (showError) {
      return (
        <UnauthorizedMessage 
          requiredAccess={requiredAccessDescription}
          userRole={userRole}
        />
      );
    }
    
    return null;
  }

  // Access granted - render children
  return <>{children}</>;
}

// Convenience components for common access patterns
export function AdminOnly({ children, ...props }: Omit<SimpleAuthGuardProps, 'requireAdmin'>) {
  return (
    <SimpleAuthGuard requireAdmin {...props}>
      {children}
    </SimpleAuthGuard>
  );
}

export function ManagerOnly({ children, ...props }: Omit<SimpleAuthGuardProps, 'requireManager'>) {
  return (
    <SimpleAuthGuard requireManager {...props}>
      {children}
    </SimpleAuthGuard>
  );
}

export function DeveloperOnly({ children, ...props }: Omit<SimpleAuthGuardProps, 'requireDeveloper'>) {
  return (
    <SimpleAuthGuard requireDeveloper {...props}>
      {children}
    </SimpleAuthGuard>
  );
}

export function AuthenticatedOnly({ children, ...props }: Omit<SimpleAuthGuardProps, 'requireAuth'>) {
  return (
    <SimpleAuthGuard requireAuth {...props}>
      {children}
    </SimpleAuthGuard>
  );
}

// Default export
export default SimpleAuthGuard;