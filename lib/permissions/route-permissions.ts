/**
 * Route-level permission mapping for middleware enforcement
 * Maps routes to required permissions and minimum role levels
 */

// Define UserRole type directly to avoid Edge Runtime import issues
export type UserRole =
  | "developer"
  | "org_admin"
  | "manager"
  | "consultant"
  | "viewer";

// Route configuration interface
export interface RoutePermissionConfig {
  // Page route pattern
  route: string;
  // Minimum role required (uses hierarchy)
  minRole: UserRole;
  // Required permissions (specific permission check)
  requiredPermissions?: string[];
  // Optional: Resource-level permission check
  resource?: string;
  action?: string;
}

// Route permission mappings
export const ROUTE_PERMISSIONS: RoutePermissionConfig[] = [
  // Public routes (handled separately)
  
  // Dashboard - accessible to all authenticated users
  {
    route: '/dashboard',
    minRole: 'viewer',
    requiredPermissions: ['dashboard.read'],
  },

  // Staff management - manager and above
  {
    route: '/staff',
    minRole: 'manager',
    requiredPermissions: ['staff.read', 'staff.list'],
    resource: 'staff',
    action: 'read',
  },

  // Payroll operations - consultant and above
  {
    route: '/payrolls',
    minRole: 'consultant',
    requiredPermissions: ['payrolls.read'],
    resource: 'payrolls', 
    action: 'read',
  },

  // Client management - consultant and above (read), manager and above (full)
  {
    route: '/clients',
    minRole: 'consultant',
    requiredPermissions: ['clients.read'],
    resource: 'clients',
    action: 'read',
  },

  // Billing & Finance - manager and above
  {
    route: '/billing',
    minRole: 'manager',
    requiredPermissions: ['billing.read'],
    resource: 'billing',
    action: 'read',
  },

  // Work scheduling - consultant and above
  {
    route: '/work-schedule',
    minRole: 'consultant',
    requiredPermissions: ['workschedule.read'],
    resource: 'workschedule',
    action: 'read',
  },

  // Email management - consultant and above
  {
    route: '/email',
    minRole: 'consultant',
    requiredPermissions: ['email.read'],
    resource: 'email',
    action: 'read',
  },

  // Leave management - consultant and above
  {
    route: '/leave',
    minRole: 'consultant',
    requiredPermissions: ['leave.read'],
    resource: 'leave',
    action: 'read',
  },

  // Reports - manager and above
  {
    route: '/reports',
    minRole: 'manager',
    requiredPermissions: ['reports.read'],
    resource: 'reports',
    action: 'read',
  },

  // Settings - org_admin and above
  {
    route: '/settings',
    minRole: 'org_admin',
    requiredPermissions: ['settings.read'],
    resource: 'settings',
    action: 'read',
  },

  // Security settings - org_admin and above
  {
    route: '/security',
    minRole: 'org_admin',
    requiredPermissions: ['security.read'],
    resource: 'security',
    action: 'read',
  },

  // User invitations - manager and above
  {
    route: '/invitations',
    minRole: 'manager',
    requiredPermissions: ['invitations.read'],
    resource: 'invitations',
    action: 'read',
  },

  // Developer tools - developer only
  {
    route: '/developer',
    minRole: 'developer',
    requiredPermissions: ['*'], // Requires all permissions
    resource: 'developer',
    action: 'read',
  },

  // AI Assistant - consultant and above
  {
    route: '/ai-assistant',
    minRole: 'consultant',
    requiredPermissions: ['ai.read'],
    resource: 'ai',
    action: 'read',
  },
];

// Role hierarchy for comparison
export const ROLE_HIERARCHY_LEVELS: Record<UserRole, number> = {
  developer: 5,
  org_admin: 4,
  manager: 3,
  consultant: 2,
  viewer: 1,
};

/**
 * Check if user role meets minimum requirement for route
 */
export function roleHasMinimumLevel(userRole: UserRole, requiredRole: UserRole): boolean {
  const userLevel = ROLE_HIERARCHY_LEVELS[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY_LEVELS[requiredRole] || 0;
  const result = userLevel >= requiredLevel;
  console.log(`🔍 Role hierarchy check: ${userRole}(${userLevel}) >= ${requiredRole}(${requiredLevel}) = ${result}`);
  return result;
}

/**
 * Get route permission configuration for a given path
 */
export function getRoutePermissionConfig(pathname: string): RoutePermissionConfig | null {
  // Find exact match first
  let config = ROUTE_PERMISSIONS.find(config => config.route === pathname);
  
  if (config) {
    return config;
  }

  // Find wildcard/prefix matches
  config = ROUTE_PERMISSIONS.find(config => {
    if (config.route.endsWith('/*')) {
      const baseRoute = config.route.replace('/*', '');
      return pathname.startsWith(baseRoute);
    }
    return false;
  });

  return config || null;
}

/**
 * Check if route is allowed for user role
 */
export function isRouteAllowedForRole(pathname: string, userRole: UserRole): boolean {
  const config = getRoutePermissionConfig(pathname);
  
  console.log(`🔍 Route permission check: pathname=${pathname}, userRole=${userRole}, config=${JSON.stringify(config)}`);
  
  if (!config) {
    // If no specific config, allow dashboard-level access
    console.log(`🔍 No config found for ${pathname}, allowing for ${userRole} (viewer+ access)`);
    return roleHasMinimumLevel(userRole, 'viewer');
  }

  const allowed = roleHasMinimumLevel(userRole, config.minRole);
  console.log(`🔍 Permission result: ${userRole} accessing ${pathname} (requires ${config.minRole}) = ${allowed}`);
  
  return allowed;
}

/**
 * Get appropriate redirect path for unauthorized access
 */
export function getUnauthorizedRedirectPath(userRole: UserRole): string {
  // Redirect based on role level
  switch (userRole) {
    case 'developer':
    case 'org_admin':
    case 'manager':
    case 'consultant':
      return '/dashboard';
    case 'viewer':
      return '/dashboard';
    default:
      return '/dashboard';
  }
}

/**
 * Check if API route is allowed for user role
 */
export function isApiRouteAllowed(pathname: string, userRole: UserRole): boolean {
  // Map API routes to their page equivalents
  const apiToPageMapping: Record<string, string> = {
    '/api/staff': '/staff',
    '/api/payrolls': '/payrolls', 
    '/api/clients': '/clients',
    '/api/billing': '/billing',
    '/api/reports': '/reports',
    '/api/settings': '/settings',
    '/api/security': '/security',
    '/api/invitations': '/invitations',
    '/api/developer': '/developer',
    '/api/ai-assistant': '/ai-assistant',
  };

  // Handle GraphQL API routes
  if (pathname === '/api/graphql' || pathname.includes('/v1/graphql')) {
    // Allow GraphQL for all authenticated users - permissions enforced by Hasura
    return roleHasMinimumLevel(userRole, 'viewer');
  }

  // Handle system API routes
  const systemRoutes = ['/api/webhooks', '/api/cron', '/api/sync-current-user'];
  if (systemRoutes.some(route => pathname.startsWith(route))) {
    return true; // System routes handle their own auth
  }

  // Check mapped page route
  const mappedPage = apiToPageMapping[pathname];
  if (mappedPage) {
    return isRouteAllowedForRole(mappedPage, userRole);
  }

  // Default: allow API access for authenticated users
  return roleHasMinimumLevel(userRole, 'viewer');
}

/**
 * Get role from JWT claims
 */
export function getRoleFromClaims(hasuraClaims: any): UserRole {
  const defaultRole = hasuraClaims?.['x-hasura-default-role'];
  const allowedRoles = hasuraClaims?.['x-hasura-allowed-roles'] || [];
  
  // Priority order for role selection
  const rolePriority: UserRole[] = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'];
  
  // Find the highest priority role the user has
  for (const role of rolePriority) {
    if (allowedRoles.includes(role)) {
      return role as UserRole;
    }
  }

  // Fallback to default role or viewer
  return (defaultRole as UserRole) || 'viewer';
}