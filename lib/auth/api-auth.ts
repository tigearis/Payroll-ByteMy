/**
 * Clean API Authentication
 *
 * Simple authentication wrapper - only checks if user is logged in.
 */

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export interface AuthSession {
  userId: string; // Clerk user ID
  databaseId?: string | undefined; // Database user ID from JWT claims
  email?: string;
  clerkId?: string | undefined; // Clerk ID from JWT claims
  managerId?: string | undefined; // Manager ID from JWT claims
  isStaff?: boolean | undefined; // Staff status from JWT claims
  organizationId?: string | undefined; // Organization ID from JWT claims
  permissions?: string[] | undefined; // User permissions from JWT claims
  role?: string | undefined; // User role from JWT claims  
  defaultRole?: string | undefined; // Default role from JWT claims (fallback)
  allowedRoles?: string[] | undefined; // Allowed roles from JWT claims
  permissionHash?: string | undefined; // Permission hash from JWT claims
  permissionVersion?: string | undefined; // Permission version from JWT claims
}

export interface AuthResult {
  success: boolean;
  session?: AuthSession;
  error?: string;
}

/**
 * Simple API authentication wrapper
 */
export function withAuth(
  handler: (
    request: NextRequest,
    session: AuthSession
  ) => Promise<NextResponse<any>>
) {
  return async (request: NextRequest): Promise<NextResponse<any>> => {
    try {
      const { userId, sessionClaims } = await auth();

      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Extract Hasura claims using Clerk's built-in sessionClaims (no manual JWT parsing)
      let databaseId: string | undefined;
      let clerkId: string | undefined;
      let managerId: string | undefined;
      let isStaff: boolean | undefined;
      let organizationId: string | undefined;
      let permissions: string[] | undefined;
      let role: string | undefined;
      let defaultRole: string | undefined;
      let allowedRoles: string[] | undefined;
      let permissionHash: string | undefined;
      let permissionVersion: string | undefined;
      
      try {
        // Use Clerk's pre-parsed sessionClaims instead of manual JWT decoding
        const hasuraClaims = sessionClaims?.['https://hasura.io/jwt/claims'] as any;
        
        if (hasuraClaims) {
          // Extract all claims as per JWT template
          databaseId = hasuraClaims?.["x-hasura-user-id"];
          clerkId = hasuraClaims?.["x-hasura-clerk-id"];
          managerId = hasuraClaims?.["x-hasura-manager-id"];
          isStaff = hasuraClaims?.["x-hasura-is-staff"] === "true" || hasuraClaims?.["x-hasura-is-staff"] === true;
          organizationId = hasuraClaims?.["x-hasura-org-id"];
          permissions = hasuraClaims?.["x-hasura-permissions"];
          role = hasuraClaims?.["x-hasura-role"];
          defaultRole = hasuraClaims?.["x-hasura-default-role"];
          allowedRoles = hasuraClaims?.["x-hasura-allowed-roles"];
          permissionHash = hasuraClaims?.["x-hasura-permission-hash"];
          permissionVersion = hasuraClaims?.["x-hasura-permission-version"];

          // Debug logging
          console.log("Hasura claims from sessionClaims:", hasuraClaims);
          console.log("Extracted session data:", {
            databaseId,
            clerkId,
            managerId,
            isStaff,
            organizationId,
            role,
            defaultRole,
            allowedRoles,
            permissionsCount: permissions?.length || 0,
            permissionHash,
            permissionVersion
          });
        } else {
          console.warn("No Hasura claims found in sessionClaims");
        }
      } catch (claimsError) {
        console.warn(
          "Could not extract Hasura claims from sessionClaims:",
          claimsError
        );
      }

      const session: AuthSession = {
        userId,
        databaseId,
        email: sessionClaims?.email as string,
        clerkId,
        managerId,
        isStaff,
        organizationId,
        permissions,
        role,
        defaultRole,
        allowedRoles,
        permissionHash,
        permissionVersion,
      };

      return await handler(request, session);
    } catch (error) {
      console.error("Auth error:", error);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }
  };
}

/**
 * API auth with params (for dynamic routes)
 */
export function withAuthParams(
  handler: (
    request: NextRequest,
    context: { params: Promise<any> },
    session: AuthSession
  ) => Promise<NextResponse<any>>
) {
  return async (
    request: NextRequest,
    context: { params: Promise<any> }
  ): Promise<NextResponse<any>> => {
    try {
      const { userId, sessionClaims } = await auth();

      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Extract Hasura claims using Clerk's built-in sessionClaims (no manual JWT parsing)
      let databaseId: string | undefined;
      let clerkId: string | undefined;
      let managerId: string | undefined;
      let isStaff: boolean | undefined;
      let organizationId: string | undefined;
      let permissions: string[] | undefined;
      let role: string | undefined;
      let defaultRole: string | undefined;
      let allowedRoles: string[] | undefined;
      let permissionHash: string | undefined;
      let permissionVersion: string | undefined;
      
      try {
        // Use Clerk's pre-parsed sessionClaims instead of manual JWT decoding
        const hasuraClaims = sessionClaims?.['https://hasura.io/jwt/claims'] as any;
        
        if (hasuraClaims) {
          // Extract all claims as per JWT template
          databaseId = hasuraClaims?.["x-hasura-user-id"];
          clerkId = hasuraClaims?.["x-hasura-clerk-id"];
          managerId = hasuraClaims?.["x-hasura-manager-id"];
          isStaff = hasuraClaims?.["x-hasura-is-staff"] === "true" || hasuraClaims?.["x-hasura-is-staff"] === true;
          organizationId = hasuraClaims?.["x-hasura-org-id"];
          permissions = hasuraClaims?.["x-hasura-permissions"];
          role = hasuraClaims?.["x-hasura-role"];
          defaultRole = hasuraClaims?.["x-hasura-default-role"];
          allowedRoles = hasuraClaims?.["x-hasura-allowed-roles"];
          permissionHash = hasuraClaims?.["x-hasura-permission-hash"];
          permissionVersion = hasuraClaims?.["x-hasura-permission-version"];
        } else {
          console.warn("No Hasura claims found in sessionClaims");
        }
      } catch (claimsError) {
        console.warn("Could not extract Hasura claims from sessionClaims:", claimsError);
      }

      const session: AuthSession = {
        userId,
        databaseId,
        email: sessionClaims?.email as string,
        clerkId,
        managerId,
        isStaff,
        organizationId,
        permissions,
        role,
        defaultRole,
        allowedRoles,
        permissionHash,
        permissionVersion,
      };

      return await handler(request, context, session);
    } catch (error) {
      console.error("Auth error:", error);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }
  };
}

/**
 * Simple authentication check function
 */
export async function authenticateApiRequest(request: NextRequest): Promise<AuthResult> {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized"
      };
    }

    // Extract Hasura claims using Clerk's built-in sessionClaims (no manual JWT parsing)
    let databaseId: string | undefined;
    let clerkId: string | undefined;
    let managerId: string | undefined;
    let isStaff: boolean | undefined;
    let organizationId: string | undefined;
    let permissions: string[] | undefined;
    let role: string | undefined;
    let defaultRole: string | undefined;
    let allowedRoles: string[] | undefined;
    let permissionHash: string | undefined;
    let permissionVersion: string | undefined;
    
    try {
      // Use Clerk's pre-parsed sessionClaims instead of manual JWT decoding
      const hasuraClaims = sessionClaims?.['https://hasura.io/jwt/claims'] as any;
      
      if (hasuraClaims) {
        // Extract all claims as per JWT template
        databaseId = hasuraClaims?.["x-hasura-user-id"];
        clerkId = hasuraClaims?.["x-hasura-clerk-id"];
        managerId = hasuraClaims?.["x-hasura-manager-id"];
        isStaff = hasuraClaims?.["x-hasura-is-staff"] === "true" || hasuraClaims?.["x-hasura-is-staff"] === true;
        organizationId = hasuraClaims?.["x-hasura-org-id"];
        permissions = hasuraClaims?.["x-hasura-permissions"];
        role = hasuraClaims?.["x-hasura-role"];
        defaultRole = hasuraClaims?.["x-hasura-default-role"];
        allowedRoles = hasuraClaims?.["x-hasura-allowed-roles"];
        permissionHash = hasuraClaims?.["x-hasura-permission-hash"];
        permissionVersion = hasuraClaims?.["x-hasura-permission-version"];
      } else {
        console.warn("No Hasura claims found in sessionClaims");
      }
    } catch (claimsError) {
      console.warn("Could not extract Hasura claims from sessionClaims:", claimsError);
    }

    const session: AuthSession = {
      userId,
      databaseId,
      email: sessionClaims?.email as string,
      clerkId,
      managerId,
      isStaff,
      organizationId,
      permissions,
      role,
      defaultRole,
      allowedRoles,
      permissionHash,
      permissionVersion,
    };

    return {
      success: true,
      session
    };
  } catch (error) {
    console.error("Auth error:", error);
    return {
      success: false,
      error: "Authentication failed"
    };
  }
}

// Simple rate limiting for backward compatibility
export function checkRateLimit(_userId: string, _options: any): boolean {
  return true; // Allow all requests in simplified system
}

// Backward compatibility aliases
export { withAuth as withAdminAuth };
export { withAuth as withManagerAuth };
export { withAuth as withDeveloperAuth };
export { withAuth as withBasicAuth };
export { withAuth as authenticateApiRoute };
export type { AuthSession as AuthenticatedUser };
export type { AuthSession as SimpleSession };
