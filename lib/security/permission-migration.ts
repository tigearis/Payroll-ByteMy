/**
 * Permission Pattern Migration Utility
 * Helps convert existing inconsistent permission patterns to the new standardized system
 */

export interface MigrationResult {
  component: string;
  oldPattern: string;
  newPattern: string;
  migrated: boolean;
  issues: string[];
}

export interface PermissionMigration {
  // Pattern 1: Direct role checking
  fromDirectRole: (role: string) => string;

  // Pattern 2: Multiple permission checks
  fromMultipleChecks: (permissions: string[]) => Array<[string, string]>;

  // Pattern 3: Custom permission logic
  fromCustomLogic: (description: string) => {
    resource: string;
    action: string;
    fallback?: string;
  };
}

/**
 * Migration patterns for common permission scenarios
 */
export const migrationPatterns: PermissionMigration = {
  fromDirectRole: (role: string) => {
    const rolePermissions: Record<string, string> = {
      developer: "system:admin",
      org_admin: "users:manage",
      manager: "payrolls:write",
      consultant: "payrolls:read",
      viewer: "dashboard:read",
    };

    return rolePermissions[role] || "dashboard:read";
  },

  fromMultipleChecks: (permissions: string[]) => {
    return permissions.map(permission => {
      // Convert "custom:resource:action" to [resource, action]
      const parts = permission.replace("custom:", "").split(":");
      return [parts[0] || "dashboard", parts[1] || "read"] as [string, string];
    });
  },

  fromCustomLogic: (description: string) => {
    // Common custom logic patterns
    const patterns = [
      {
        match: /admin|administrator/i,
        resource: "system",
        action: "admin",
      },
      {
        match: /manage|management/i,
        resource: "users",
        action: "manage",
      },
      {
        match: /payroll.*write|create.*payroll/i,
        resource: "payrolls",
        action: "write",
      },
      {
        match: /payroll.*read|view.*payroll/i,
        resource: "payrolls",
        action: "read",
      },
      {
        match: /client.*write|create.*client/i,
        resource: "clients",
        action: "write",
      },
      {
        match: /client.*read|view.*client/i,
        resource: "clients",
        action: "read",
      },
    ];

    for (const pattern of patterns) {
      if (pattern.match.test(description)) {
        return {
          resource: pattern.resource,
          action: pattern.action,
        };
      }
    }

    return {
      resource: "dashboard",
      action: "read",
      fallback:
        "Could not determine specific permission - defaulting to dashboard:read",
    };
  },
};

/**
 * Component migration templates
 */
export const componentMigrationTemplates = {
  // Replace direct role checks
  directRoleCheck: {
    before: `if (userRole === 'manager') { /* component logic */ }`,
    after: `<PermissionGuard resource="payrolls" action="write">
  {/* component logic */}
</PermissionGuard>`,
  },

  // Replace multiple permission checks
  multiplePermissionCheck: {
    before: `const canAccess = hasPermission('custom:payroll:read') && hasPermission('custom:client:read');`,
    after: `<PermissionGuard 
  permissions={[['payrolls', 'read'], ['clients', 'read']]}
  requireAll={true}
>
  {/* component logic */}
</PermissionGuard>`,
  },

  // Replace custom logic
  customLogic: {
    before: `const isManagerOrAbove = userRole === 'manager' || userRole === 'org_admin' || userRole === 'developer';`,
    after: `<ManagerOrAbove>
  {/* component logic */}
</ManagerOrAbove>`,
  },
};

/**
 * Automated migration suggestions
 */
export function generateMigrationSuggestions(
  componentCode: string,
  componentPath: string
): MigrationResult[] {
  const suggestions: MigrationResult[] = [];

  // Pattern 1: Direct role checking
  const roleCheckPattern = /userRole\s*===\s*['"`](\w+)['"`]/g;
  let match;

  while ((match = roleCheckPattern.exec(componentCode)) !== null) {
    const role = match[1];
    const permission = migrationPatterns.fromDirectRole(role);
    const [resource, action] = permission.split(":");

    suggestions.push({
      component: componentPath,
      oldPattern: `userRole === '${role}'`,
      newPattern: `<PermissionGuard resource="${resource}" action="${action}">`,
      migrated: false,
      issues: [],
    });
  }

  // Pattern 2: Multiple hasPermission calls
  const multiplePermissionPattern = /hasPermission\(['"`]([^'"`]+)['"`]\)/g;
  const permissions: string[] = [];

  while ((match = multiplePermissionPattern.exec(componentCode)) !== null) {
    permissions.push(match[1]);
  }

  if (permissions.length > 1) {
    const convertedPermissions =
      migrationPatterns.fromMultipleChecks(permissions);
    suggestions.push({
      component: componentPath,
      oldPattern: `Multiple hasPermission calls: ${permissions.join(", ")}`,
      newPattern: `<PermissionGuard permissions={${JSON.stringify(convertedPermissions)}}>`,
      migrated: false,
      issues: [],
    });
  }

  // Pattern 3: Complex role logic
  const complexRolePattern = /(?:userRole\s*===.*?\|\||&&.*?userRole)/g;
  while ((match = complexRolePattern.exec(componentCode)) !== null) {
    suggestions.push({
      component: componentPath,
      oldPattern: match[0],
      newPattern: "Consider using ManagerOrAbove or custom PermissionGuard",
      migrated: false,
      issues: ["Complex role logic detected - manual review required"],
    });
  }

  return suggestions;
}

/**
 * Validation helpers for migration
 */
export function validateMigration(
  oldPattern: string,
  newPattern: string
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check for common migration issues
  if (newPattern.includes("undefined") || newPattern.includes("null")) {
    issues.push("Migration contains undefined/null values");
  }

  if (
    !newPattern.includes("PermissionGuard") &&
    !newPattern.includes("OrAbove")
  ) {
    issues.push("Migration does not use standardized permission components");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Generate migration report
 */
export function generateMigrationReport(results: MigrationResult[]): {
  total: number;
  migrated: number;
  pending: number;
  issues: number;
  summary: string;
} {
  const total = results.length;
  const migrated = results.filter(r => r.migrated).length;
  const pending = total - migrated;
  const issues = results.reduce((sum, r) => sum + r.issues.length, 0);

  const summary = `
Permission Pattern Migration Report
==================================
Total patterns found: ${total}
Successfully migrated: ${migrated}
Pending migration: ${pending}
Issues requiring attention: ${issues}

Migration Progress: ${total > 0 ? Math.round((migrated / total) * 100) : 0}%
  `;

  return { total, migrated, pending, issues, summary };
}
