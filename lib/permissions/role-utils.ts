// Role hierarchy from lowest to highest
const ROLE_HIERARCHY = [
  "viewer",
  "consultant",
  "manager",
  "org_admin",
  "developer",
];

/**
 * Check if a user has at least the specified minimum role
 * @param userRole The user's role
 * @param minimumRole The minimum required role
 * @returns boolean indicating if the user has sufficient permissions
 */
export function hasMinimumRole(
  userRole: string | undefined | null,
  minimumRole: string
): boolean {
  if (!userRole) return false;

  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const minimumRoleIndex = ROLE_HIERARCHY.indexOf(minimumRole);

  if (userRoleIndex === -1 || minimumRoleIndex === -1) {
    console.warn(`Invalid role comparison: ${userRole} vs ${minimumRole}`);
    return false;
  }

  return userRoleIndex >= minimumRoleIndex;
}

/**
 * Get the role level as a number (higher number = higher privileges)
 * @param role The role to get the level for
 * @returns number representing the role level, -1 if invalid
 */
export function getRoleLevel(role: string | undefined | null): number {
  if (!role) return -1;
  return ROLE_HIERARCHY.indexOf(role);
}

/**
 * Compare two roles and determine which is higher in the hierarchy
 * @param roleA First role to compare
 * @param roleB Second role to compare
 * @returns 1 if roleA is higher, -1 if roleB is higher, 0 if equal, null if invalid
 */
export function compareRoles(
  roleA: string | undefined | null,
  roleB: string | undefined | null
): number | null {
  const levelA = getRoleLevel(roleA);
  const levelB = getRoleLevel(roleB);

  if (levelA === -1 || levelB === -1) return null;

  if (levelA > levelB) return 1;
  if (levelA < levelB) return -1;
  return 0;
}

/**
 * Get all roles at or above the specified minimum role
 * @param minimumRole The minimum role level
 * @returns Array of roles at or above the minimum
 */
export function getRolesAtOrAbove(minimumRole: string): string[] {
  const minimumRoleIndex = ROLE_HIERARCHY.indexOf(minimumRole);
  if (minimumRoleIndex === -1) return [];
  return ROLE_HIERARCHY.slice(minimumRoleIndex);
}

/**
 * Get all roles at or below the specified maximum role
 * @param maximumRole The maximum role level
 * @returns Array of roles at or below the maximum
 */
export function getRolesAtOrBelow(maximumRole: string): string[] {
  const maximumRoleIndex = ROLE_HIERARCHY.indexOf(maximumRole);
  if (maximumRoleIndex === -1) return [];
  return ROLE_HIERARCHY.slice(0, maximumRoleIndex + 1);
}
