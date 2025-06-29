import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";
import { GetCurrentUserDocument, type GetCurrentUserQuery } from "@/domains/users/graphql/generated/graphql";
import { sanitizeUserRole, hasRoleLevel, ROLE_HIERARCHY, Role } from "@/lib/auth/simple-permissions";
import { getJWTClaimsWithFallback } from "@/lib/auth/token-utils";

/**
 * Comprehensive debug endpoint for role assignment troubleshooting
 * This endpoint provides detailed information about user authentication,
 * JWT claims, database user data, and role mismatches.
 */
export const GET = withAuth(async (request: NextRequest) => {
  try {
    console.log("🔍 Role Assignment Debug endpoint called");

    // Step 1: Get Clerk authentication data
    const authResult = await auth();
    const clerkUser = await currentUser();

    if (!authResult.userId) {
      return NextResponse.json({
        error: "Not authenticated",
        step: "clerk_auth",
        timestamp: new Date().toISOString(),
      }, { status: 401 });
    }

    // Step 2: Use centralized token utilities for comprehensive debugging  
    const claimsResult = await getJWTClaimsWithFallback();
    
    // Legacy session claims for comparison
    const { sessionClaims, userId: clerkUserId } = authResult;

    // Step 3: Role extraction from all sources
    const roleExtraction = {
      tokenUtilityRole: claimsResult.role,
      tokenUtilityComplete: claimsResult.hasCompleteData,
      tokenUtilityError: claimsResult.error,
      tokenUtilityUserId: claimsResult.userId,
      hasuraJwtDefaultRole: sessionClaims?.["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"],
      publicMetadataRole: (sessionClaims?.publicMetadata as any)?.role,
      clerkUserPublicMetadataRole: clerkUser?.publicMetadata?.role,
      hasuraAllowedRoles: claimsResult.claims?.["x-hasura-allowed-roles"],
    };

    // Step 4: Calculate final role (using centralized utility)
    const finalRole = claimsResult.role || "viewer";

    // Step 5: Database user lookup
    let databaseUser = null;
    let databaseError = null;
    const databaseUserId = clerkUser?.publicMetadata?.databaseId as string ||
                          claimsResult.claims?.["x-hasura-user-id"];

    try {
      if (databaseUserId) {
        const userData = await executeTypedQuery<GetCurrentUserQuery>(
          GetCurrentUserDocument,
          { userId: databaseUserId }
        );
        databaseUser = userData?.user || null;
      }
    } catch (error) {
      databaseError = error instanceof Error ? error.message : "Database lookup failed";
    }

    // Step 6: JWT validation (using token utility results)
    const jwtValidation = {
      isValid: claimsResult.hasCompleteData && !claimsResult.error,
      errors: claimsResult.error ? [claimsResult.error] : [],
      warnings: [],
      claims: claimsResult.claims
    };

    // Step 7: Role consistency analysis
    const roleConsistency = {
      jwtRole: finalRole,
      databaseRole: databaseUser?.role || null,
      isConsistent: finalRole === databaseUser?.role,
      
      // Role hierarchy validation
      roleLevel: ROLE_HIERARCHY[finalRole as keyof typeof ROLE_HIERARCHY] || 0,
      isValidRole: Object.keys(ROLE_HIERARCHY).includes(finalRole),
      sanitizedRole: sanitizeUserRole(finalRole),
      
      // Permission check
      canAccessConsultantRoutes: hasRoleLevel(finalRole as Role, "consultant"),
      canAccessManagerRoutes: hasRoleLevel(finalRole as Role, "manager"),
      canAccessAdminRoutes: hasRoleLevel(finalRole as Role, "org_admin"),
    };

    // Step 8: Middleware simulation
    const middlewareSimulation = {
      wouldRedirect: !hasRoleLevel(finalRole as Role, "consultant"),
      redirectUrl: `/unauthorized?reason=role_required&current=${finalRole}&required=consultant`,
      middlewareLogic: {
        step1_hasuraClaims: !!claimsResult.claims,
        step2_defaultRole: claimsResult.claims?.["x-hasura-default-role"],
        step3_publicMetadata: (sessionClaims?.publicMetadata as any)?.role,
        step4_fallback: "viewer",
        step5_finalRole: finalRole,
      }
    };

    // Step 9: Diagnostic recommendations
    const diagnostics = {
      issues: [] as string[],
      recommendations: [] as string[],
      nextSteps: [] as string[],
    };

    // Analyze issues

    if (!claimsResult.claims) {
      diagnostics.issues.push("No Hasura claims in session - JWT template issue");
      diagnostics.recommendations.push("Update JWT template to include Hasura claims");
    }

    if (finalRole === "viewer" && databaseUser?.role && databaseUser.role !== "viewer") {
      diagnostics.issues.push("User defaulting to viewer role despite having higher database role");
      diagnostics.recommendations.push("Sync user metadata from database to Clerk");
    }

    if (!roleConsistency.isConsistent) {
      diagnostics.issues.push("Role mismatch between JWT and database");
      diagnostics.recommendations.push("Run user sync to update Clerk metadata");
    }

    if (!databaseUser && databaseUserId) {
      diagnostics.issues.push("User not found in database despite having database ID");
      diagnostics.recommendations.push("Check database connection and user existence");
    }

    // Next steps
    if (diagnostics.issues.length > 0) {
      diagnostics.nextSteps.push("1. Check JWT template configuration in Clerk dashboard");
      diagnostics.nextSteps.push("2. Call /api/fix-user-sync to sync user data");
      diagnostics.nextSteps.push("3. Verify user exists in database");
      diagnostics.nextSteps.push("4. Check environment variable configuration");
    }

    // Step 10: Compile comprehensive response
    const debugResponse = {
      timestamp: new Date().toISOString(),
      success: true,
      
      // Authentication state
      authentication: {
        isAuthenticated: !!clerkUserId,
        clerkUserId: clerkUserId?.substring(0, 8) + "...",
        sessionId: authResult.sessionId?.substring(0, 8) + "...",
        userEmail: clerkUser?.emailAddresses?.[0]?.emailAddress,
      },

      // JWT analysis
      jwtAnalysis: {
        hasSessionClaims: !!sessionClaims,
        hasHasuraClaims: !!claimsResult.claims,
        validation: jwtValidation,
        claimsStructure: {
          hasuraJwtClaimsKey: "https://hasura.io/jwt/claims",
          hasClaimsAtKey: !!sessionClaims?.["https://hasura.io/jwt/claims"],
          claimsKeys: sessionClaims ? Object.keys(sessionClaims) : [],
          hasuraClaimsKeys: claimsResult.claims ? Object.keys(claimsResult.claims) : [],
        }
      },

      // Role analysis
      roleAnalysis: {
        extraction: roleExtraction,
        finalRole,
        consistency: roleConsistency,
        middlewareSimulation,
      },

      // Database analysis
      databaseAnalysis: {
        hasUser: !!databaseUser,
        databaseUserId,
        user: databaseUser,
        error: databaseError,
      },

      // User metadata analysis
      metadataAnalysis: {
        clerk: {
          publicMetadata: clerkUser?.publicMetadata,
          privateMetadata: clerkUser?.privateMetadata ? "Present (hidden)" : null,
        },
        session: {
          publicMetadata: sessionClaims?.publicMetadata,
          metadata: sessionClaims?.metadata,
        }
      },

      // Diagnostics and recommendations
      diagnostics,

      // Raw data for advanced debugging
      rawData: {
        sessionClaims: sessionClaims ? {
          ...sessionClaims,
          // Sanitize sensitive data
          sub: (sessionClaims as any).sub?.substring(0, 8) + "...",
        } : null,
        hasuraClaims: claimsResult.claims,
      }
    };

    console.log("🔍 Role assignment debug completed:", {
      finalRole,
      hasIssues: diagnostics.issues.length > 0,
      issueCount: diagnostics.issues.length,
    });

    return NextResponse.json(debugResponse);

  } catch (error) {
    console.error("🚨 Role assignment debug error:", error);
    
    return NextResponse.json({
      error: "Debug endpoint failed",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}, { allowedRoles: ["developer"] });

/**
 * POST endpoint to trigger user sync and re-run diagnostics
 */
export const POST = withAuth(async (request: NextRequest) => {
  try {
    // Trigger user sync
    const syncResponse = await fetch(new URL("/api/fix-user-sync", request.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const syncResult = await syncResponse.json();

    // Wait a moment for sync to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Re-run diagnostics
    const diagnosticsResponse = await fetch(new URL("/api/debug/role-assignment", request.url), {
      method: "GET",
    });

    const diagnosticsResult = await diagnosticsResponse.json();

    return NextResponse.json({
      syncResult,
      updatedDiagnostics: diagnosticsResult,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("🚨 Role assignment sync error:", error);
    
    return NextResponse.json({
      error: "Sync and diagnostics failed",
      message: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}, { allowedRoles: ["developer"] });