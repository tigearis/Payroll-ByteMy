import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { gql } from "@apollo/client";
import { withAuth } from "@/lib/auth/api-auth";

// Admin endpoint to verify JWT template implementation
// Requires both admin secret AND admin role

const GET_ALL_USERS = gql`
  query GetAllUsersForJWTVerification {
    users(limit: 100) {
      id
      clerkUserId
      name
      email
      role
      isStaff
      managerId
      createdAt
    }
  }
`;

export const GET = withAuth(async (request: NextRequest, session) => {
  try {
    // Check 1: Admin secret
    const adminSecret = request.headers.get('x-admin-secret');
    if (adminSecret !== process.env.HASURA_ADMIN_SECRET) {
      return NextResponse.json({ error: "Invalid admin secret" }, { status: 401 });
    }

    // Check 2: Admin role
    const { defaultRole, permissions } = session;
    if (defaultRole !== "developer" && defaultRole !== "org_admin") {
      return NextResponse.json({ error: "Admin role required" }, { status: 403 });
    }

    console.log('🔍 JWT Template Verification - Admin Check');

    // Step 1: Get users from Hasura
    const { data: hasuraData, errors } = await adminApolloClient.query({
      query: GET_ALL_USERS,
      fetchPolicy: 'network-only'
    });

    if (errors) {
      return NextResponse.json({ 
        error: "Hasura query failed", 
        details: errors 
      }, { status: 500 });
    }

    const databaseUsers = hasuraData?.users || [];

    // Step 2: Get users from Clerk
    const client = await clerkClient();
    const clerkResponse = await client.users.getUserList({
      limit: 100,
      orderBy: 'created_at'
    });
    const clerkUsers = clerkResponse.data;

    // Step 3: Analyze JWT template compliance
    const requiredFields = [
      'databaseId', 'role', 'allowedRoles', 'permissions', 
      'permissionHash', 'permissionVersion'
    ];

    const results = {
      totalClerkUsers: clerkUsers.length,
      totalDatabaseUsers: databaseUsers.length,
      usersWithCompleteJWT: 0,
      usersWithIncompleteJWT: 0,
      usersNotInDatabase: 0,
      fieldCoverage: {},
      sampleUser: null,
      issues: []
    };

    // Initialize field coverage
    requiredFields.forEach(field => {
      results.fieldCoverage[field] = { present: 0, missing: 0 };
    });

    // Check each Clerk user
    for (const clerkUser of clerkUsers) {
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      const metadata = clerkUser.publicMetadata || {};
      
      // Find corresponding database user
      const dbUser = databaseUsers.find(u => u.clerkUserId === clerkUser.id);
      
      if (!dbUser) {
        results.usersNotInDatabase++;
        results.issues.push({
          type: 'not_indatabase',
          email,
          clerkId: clerkUser.id
        });
        continue;
      }

      // Check required JWT fields
      const missingFields = [];
      let hasAllFields = true;

      for (const field of requiredFields) {
        if (metadata[field] !== undefined && metadata[field] !== null) {
          results.fieldCoverage[field].present++;
        } else {
          results.fieldCoverage[field].missing++;
          missingFields.push(field);
          hasAllFields = false;
        }
      }

      // Check consistency
      const inconsistencies = [];
      
      if (metadata.databaseId !== dbUser.id) {
        inconsistencies.push('databaseId_mismatch');
      }
      
      if (metadata.role !== dbUser.role) {
        inconsistencies.push('role_mismatch');
      }

      if (hasAllFields && inconsistencies.length === 0) {
        results.usersWithCompleteJWT++;
        
        // Store a sample user for JWT structure demo
        if (!results.sampleUser && metadata.permissions?.length > 0) {
          results.sampleUser = {
            email,
            jwtClaims: {
              "x-hasura-user-id": metadata.databaseId,
              "x-hasura-default-role": metadata.role,
              "x-hasura-allowed-roles": metadata.allowedRoles,
              "x-hasura-clerk-id": clerkUser.id,
              "x-hasura-manager-id": metadata.managerId || null,
              "x-hasura-is-staff": metadata.isStaff || false,
              "x-hasura-permissions": `Array(${metadata.permissions?.length || 0})`,
              "x-hasura-permission-hash": metadata.permissionHash?.substring(0, 16) + '...',
              "x-hasura-permission-version": metadata.permissionVersion,
              "x-hasura-org-id": metadata.organizationId || null
            }
          };
        }
      } else {
        results.usersWithIncompleteJWT++;
        results.issues.push({
          type: 'incomplete_jwt',
          email,
          clerkId: clerkUser.id,
          missingFields,
          inconsistencies
        });
      }
    }

    // Step 4: Calculate summary statistics
    const completionRate = results.totalClerkUsers > 0 
      ? Math.round((results.usersWithCompleteJWT / results.totalClerkUsers) * 100) 
      : 0;

    const summary = {
      status: completionRate === 100 ? 'complete' : 'partial',
      completionRate,
      summary: `${results.usersWithCompleteJWT}/${results.totalClerkUsers} users have complete JWT template data`,
      ...results
    };

    return NextResponse.json(summary);

  } catch (error) {
    console.error('JWT Template verification error:', error);
    return NextResponse.json({
      error: "Verification failed",
      details: error.message
    }, { status: 500 });
  }
});