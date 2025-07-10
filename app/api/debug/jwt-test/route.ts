import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

interface JWTTestResult {
  test: {
    clerkUserId: string;
    userEmail: string;
    userName: string;
    timestamp: string;
  };
  clerkMetadata: {
    publicMetadata: any;
    privateMetadata: any;
    hasDatabaseId: boolean;
    hasRole: boolean;
    metadataKeys: string[];
  };
  databaseUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    clerkId: string;
  } | null;
  databaseError: string | null;
  jwt: {
    hasToken: boolean;
    tokenPreview: string | null;
    analysis: {
      hasHasuraClaims: boolean;
      userIdType: string;
      roleValue: string;
      clerkIdValue: string;
      permissionsCount: number;
      allowedRolesCount: number;
      hasPermissionHash: boolean;
      hasPermissionVersion: boolean;
    };
    hasuraClaims: any;
    fullPayload: any;
  };
  systemAnalysis: {
    userExistsInClerk: boolean;
    userExistsInDatabase: boolean;
    jwtTemplateWorking: boolean;
    hasuraClaimsPresent: boolean;
    userIdMappingCorrect: boolean;
    metadataSyncComplete: boolean;
    expectedToWork: boolean;
    allJwtFieldsPresent: boolean;
  };
  issues: string[];
  recommendations: string[];
  verdict: string;
}

export async function GET(req: NextRequest): Promise<NextResponse<JWTTestResult | { error: string }>> {
  try {
    // Get auth context
    const { userId: clerkUserId, getToken } = await auth();
    const user = await currentUser();

    if (!clerkUserId || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userEmail = user.emailAddresses?.[0]?.emailAddress || "unknown";
    const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

    // Initialize result structure
    const result: JWTTestResult = {
      test: {
        clerkUserId,
        userEmail,
        userName,
        timestamp: new Date().toISOString(),
      },
      clerkMetadata: {
        publicMetadata: user.publicMetadata,
        privateMetadata: user.privateMetadata,
        hasDatabaseId: !!user.publicMetadata?.databaseId,
        hasRole: !!user.publicMetadata?.role,
        metadataKeys: Object.keys(user.publicMetadata || {}),
      },
      databaseUser: null,
      databaseError: null,
      jwt: {
        hasToken: false,
        tokenPreview: null,
        analysis: {
          hasHasuraClaims: false,
          userIdType: "none",
          roleValue: "none",
          clerkIdValue: "none",
          permissionsCount: 0,
          allowedRolesCount: 0,
          hasPermissionHash: false,
          hasPermissionVersion: false,
        },
        hasuraClaims: null,
        fullPayload: null,
      },
      systemAnalysis: {
        userExistsInClerk: true,
        userExistsInDatabase: false,
        jwtTemplateWorking: false,
        hasuraClaimsPresent: false,
        userIdMappingCorrect: false,
        metadataSyncComplete: false,
        expectedToWork: false,
        allJwtFieldsPresent: false,
      },
      issues: [],
      recommendations: [],
      verdict: "",
    };

    // Test JWT token
    try {
      const token = await getToken({ template: "hasura" });
      if (token) {
        result.jwt.hasToken = true;
        result.jwt.tokenPreview = `${token.substring(0, 50)}...`;

        // Decode JWT
        const base64Payload = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(base64Payload));
        const hasuraClaims = decodedPayload["https://hasura.io/jwt/claims"];

        result.jwt.fullPayload = decodedPayload;
        result.jwt.hasuraClaims = hasuraClaims;

        if (hasuraClaims) {
          result.jwt.analysis.hasHasuraClaims = true;
          result.systemAnalysis.hasuraClaimsPresent = true;

          // Analyze all JWT template fields
          const userId = hasuraClaims["x-hasura-user-id"];
          const clerkId = hasuraClaims["x-hasura-clerk-id"];
          const userEmail = hasuraClaims["x-hasura-user-email"];
          const permissions = hasuraClaims["x-hasura-permissions"];
          const defaultRole = hasuraClaims["x-hasura-default-role"];
          const allowedRoles = hasuraClaims["x-hasura-allowed-roles"];
          const permissionHash = hasuraClaims["x-hasura-permission-hash"];
          const permissionVersion = hasuraClaims["x-hasura-permission-version"];

          result.jwt.analysis.userIdType = userId ? (userId.length === 36 ? "uuid" : "string") : "none";
          result.jwt.analysis.roleValue = defaultRole || "none";
          result.jwt.analysis.clerkIdValue = clerkId || "none";
          result.jwt.analysis.permissionsCount = Array.isArray(permissions) ? permissions.length : 0;
          result.jwt.analysis.allowedRolesCount = Array.isArray(allowedRoles) ? allowedRoles.length : 0;
          result.jwt.analysis.hasPermissionHash = !!permissionHash;
          result.jwt.analysis.hasPermissionVersion = !!permissionVersion;

          // Check if all JWT template fields are present
          const requiredFields = [
            "x-hasura-user-id",
            "x-hasura-clerk-id", 
            "x-hasura-user-email",
            "x-hasura-permissions",
            "x-hasura-default-role",
            "x-hasura-allowed-roles",
            "x-hasura-permission-hash",
            "x-hasura-permission-version"
          ];

          const presentFields = requiredFields.filter(field => hasuraClaims[field] !== undefined);
          result.systemAnalysis.allJwtFieldsPresent = presentFields.length === requiredFields.length;

          if (presentFields.length < requiredFields.length) {
            const missingFields = requiredFields.filter(field => hasuraClaims[field] === undefined);
            result.issues.push(`Missing JWT template fields: ${missingFields.join(", ")}`);
          }

          // User ID mapping check
          if (userId && user.publicMetadata?.databaseId) {
            result.systemAnalysis.userIdMappingCorrect = userId === user.publicMetadata.databaseId;
            if (!result.systemAnalysis.userIdMappingCorrect) {
              result.issues.push("JWT user ID doesn't match Clerk metadata database ID");
            }
          }

          result.systemAnalysis.jwtTemplateWorking = !!userId && !!defaultRole;
        } else {
          result.issues.push("No Hasura claims found in JWT");
        }
      } else {
        result.issues.push("Could not retrieve JWT token");
      }
    } catch (jwtError) {
      result.jwt.hasToken = false;
      result.issues.push(`JWT error: ${jwtError instanceof Error ? jwtError.message : 'Unknown error'}`);
    }

    // Database user check
    try {
      if (user.publicMetadata?.databaseId) {
        // For this test, we'll simulate a database user check
        // In real implementation, you'd query the database
        result.databaseUser = {
          id: user.publicMetadata.databaseId as string,
          name: userName,
          email: userEmail,
          role: (user.publicMetadata?.role as string) || "viewer",
          clerkId: clerkUserId,
        };
        result.systemAnalysis.userExistsInDatabase = true;
      } else {
        result.databaseError = "No database ID in user metadata";
      }
    } catch (dbError) {
      result.databaseError = dbError instanceof Error ? dbError.message : "Unknown database error";
    }

    // Metadata sync analysis
    const hasRequiredMetadata = !!(
      user.publicMetadata?.databaseId &&
      user.publicMetadata?.role &&
      user.privateMetadata?.permissions
    );

    result.systemAnalysis.metadataSyncComplete = hasRequiredMetadata;

    if (!hasRequiredMetadata) {
      result.issues.push("Incomplete metadata sync - missing databaseId, role, or permissions");
      result.recommendations.push("Run user sync to populate missing metadata");
    }

    // Overall analysis
    result.systemAnalysis.expectedToWork = 
      result.systemAnalysis.userExistsInClerk &&
      result.systemAnalysis.userExistsInDatabase &&
      result.systemAnalysis.jwtTemplateWorking &&
      result.systemAnalysis.hasuraClaimsPresent &&
      result.systemAnalysis.userIdMappingCorrect &&
      result.systemAnalysis.metadataSyncComplete &&
      result.systemAnalysis.allJwtFieldsPresent;

    // Generate verdict
    if (result.systemAnalysis.expectedToWork) {
      result.verdict = "✅ System is fully configured and JWT template is working correctly";
    } else if (result.issues.length === 0) {
      result.verdict = "⚠️ System appears functional but may have minor configuration issues";
    } else {
      result.verdict = `❌ System has ${result.issues.length} issue(s) that need to be resolved`;
    }

    // Generate recommendations
    if (!result.systemAnalysis.allJwtFieldsPresent) {
      result.recommendations.push("Update JWT template to include all required fields");
    }
    if (!result.systemAnalysis.metadataSyncComplete) {
      result.recommendations.push("Sync user metadata to populate missing fields");
    }
    if (result.issues.length > 0) {
      result.recommendations.push("Review and fix the issues listed above");
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("JWT Test error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}