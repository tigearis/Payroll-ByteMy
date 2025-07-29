import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";
import { gql } from "@apollo/client";
// We'll use inline GraphQL queries for now since the generated types might not be available yet
import { executeTypedQuery, executeTypedMutation } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

interface CleanupResult {
  success: boolean;
  summary: {
    expiredInvitationsDeleted: number;
    orphanedUsersDeleted: number;
    clerkOnlyUsersFound: number;
    invitationsWithoutUsers: number;
  };
  details: {
    expiredInvitations: Array<{ id: string; email: string; expiredSince: string }>;
    orphanedUsers: Array<{ id: string; email: string; reason: string }>;
    clerkOnlyUsers: Array<{ id: string; email: string; createdAt: string }>;
    invitationsWithoutUsers: Array<{ id: string; email: string; invitedBy: string }>;
  };
  errors: string[];
}

export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    // Require developer role for cleanup operations
    const userRole = session?.role || 'viewer';
    if (userRole !== 'developer') {
      return NextResponse.json(
        { error: "Unauthorized: Developer role required for cleanup operations" },
        { status: 403 }
      );
    }

    console.log("🧹 Starting orphaned data cleanup...");

    const body = await req.json();
    const { dryRun = true, cleanupTypes = ['expired_invitations', 'orphaned_users'] } = body;

    const result: CleanupResult = {
      success: true,
      summary: {
        expiredInvitationsDeleted: 0,
        orphanedUsersDeleted: 0,
        clerkOnlyUsersFound: 0,
        invitationsWithoutUsers: 0,
      },
      details: {
        expiredInvitations: [],
        orphanedUsers: [],
        clerkOnlyUsers: [],
        invitationsWithoutUsers: [],
      },
      errors: [],
    };

    // 1. Find and clean up expired invitations
    if (cleanupTypes.includes('expired_invitations')) {
      console.log("🔍 Finding expired invitations...");
      
      try {
        const now = new Date().toISOString();
        const expiredInvitationsData = await executeTypedQuery(
          gql`query GetExpiredInvitations($now: timestamptz!) {
            userInvitations(
              where: {
                _or: [
                  { invitationStatus: { _eq: "expired" } }
                  { expiresAt: { _lt: $now } }
                ]
              }
              orderBy: { expiresAt: DESC }
            ) {
              id
              email
              firstName
              lastName
              invitationStatus
              expiresAt
              createdAt
              clerkInvitationId
            }
          }`,
          { now }
        );

        const expiredInvitations = (expiredInvitationsData as any)?.userInvitations || [];
        
        for (const invitation of expiredInvitations) {
          const expiredSince = new Date(invitation.expiresAt);
          const daysSinceExpired = Math.floor(
            (Date.now() - expiredSince.getTime()) / (1000 * 60 * 60 * 24)
          );

          result.details.expiredInvitations.push({
            id: invitation.id,
            email: invitation.email,
            expiredSince: `${daysSinceExpired} days ago`,
          });

          if (!dryRun && daysSinceExpired > 7) { // Only delete if expired for more than 7 days
            try {
              await executeTypedMutation(
                gql`mutation DeleteExpiredInvitation($invitationId: uuid!) {
                  deleteUserInvitationById(id: $invitationId) {
                    id
                    email
                    invitationStatus
                    expiresAt
                  }
                }`,
                { invitationId: invitation.id }
              );
              result.summary.expiredInvitationsDeleted++;
              console.log(`✅ Deleted expired invitation: ${invitation.email}`);
            } catch (deleteError: any) {
              result.errors.push(`Failed to delete invitation ${invitation.email}: ${deleteError?.message || 'Unknown error'}`);
            }
          }
        }
      } catch (error: any) {
        result.errors.push(`Failed to query expired invitations: ${error?.message || 'Unknown error'}`);
      }
    }

    // 2. Find database users without Clerk IDs
    if (cleanupTypes.includes('orphaned_users')) {
      console.log("🔍 Finding users without Clerk IDs...");
      
      try {
        const orphanedUsersData = await executeTypedQuery(
          gql`query GetUsersWithoutClerkId {
            users(
              where: {
                _or: [
                  { clerkUserId: { _isNull: true } }
                  { clerkUserId: { _eq: "" } }
                ]
              }
              orderBy: { createdAt: DESC }
            ) {
              id
              email
              firstName
              lastName
              role
              createdAt
              updatedAt
              isActive
            }
          }`,
          {}
        );

        const orphanedUsers = (orphanedUsersData as any)?.users || [];
        
        for (const user of orphanedUsers) {
          const createdAt = new Date(user.createdAt);
          const daysSinceCreated = Math.floor(
            (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
          );

          let reason = "No Clerk ID";
          if (daysSinceCreated > 1) {
            reason += ` (created ${daysSinceCreated} days ago)`;
          }

          result.details.orphanedUsers.push({
            id: user.id,
            email: user.email,
            reason,
          });

          // Only delete if user was created more than 24 hours ago and has no Clerk ID
          if (!dryRun && daysSinceCreated > 1) {
            try {
              await executeTypedMutation(
                gql`mutation DeleteUser($userId: uuid!) {
                  deleteUserById(id: $userId) {
                    id
                    email
                    firstName
                    lastName
                    role
                    createdAt
                  }
                }`,
                { userId: user.id }
              );
              result.summary.orphanedUsersDeleted++;
              console.log(`✅ Deleted orphaned user: ${user.email}`);
            } catch (deleteError: any) {
              result.errors.push(`Failed to delete user ${user.email}: ${deleteError?.message || 'Unknown error'}`);
            }
          }
        }
      } catch (error: any) {
        result.errors.push(`Failed to query orphaned users: ${error?.message || 'Unknown error'}`);
      }
    }

    // 3. Find Clerk users without database records
    if (cleanupTypes.includes('clerk_only_users')) {
      console.log("🔍 Finding Clerk users without database records...");
      
      try {
        const clerkUsers = await clerkClient.users.getUserList({
          limit: 500, // Adjust as needed
        });

        for (const clerkUser of clerkUsers.data) {
          // Check if this Clerk user exists in our database
          try {
            const dbUserData = await executeTypedQuery(
              gql`query GetUserByClerkId($clerkUserId: String!) {
                users(where: {clerkUserId: {_eq: $clerkUserId}}) {
                  id
                  email
                }
              }`,
              { clerkUserId: clerkUser.id }
            );

            if (!(dbUserData as any)?.users || (dbUserData as any)?.users.length === 0) {
              result.details.clerkOnlyUsers.push({
                id: clerkUser.id,
                email: clerkUser.emailAddresses[0]?.emailAddress || "No email",
                createdAt: new Date(clerkUser.createdAt).toLocaleDateString(),
              });
              result.summary.clerkOnlyUsersFound++;
            }
          } catch (dbError: any) {
            result.errors.push(`Failed to check database for Clerk user ${clerkUser.id}: ${dbError?.message || 'Unknown error'}`);
          }
        }
      } catch (error: any) {
        result.errors.push(`Failed to fetch Clerk users: ${error?.message || 'Unknown error'}`);
      }
    }

    // 4. Find invitations pointing to non-existent users
    if (cleanupTypes.includes('invitations_without_users')) {
      console.log("🔍 Finding invitations without valid users...");
      
      try {
        const orphanedInvitationsData = await executeTypedQuery(
          gql`query GetOrphanedInvitations {
            userInvitations(
              where: {
                invitationStatus: { _eq: "accepted" }
              }
              orderBy: { createdAt: DESC }
            ) {
              id
              email
              firstName
              lastName
              invitationStatus
              acceptedBy
              createdAt
              invitedBy
              invitedByUser {
                id
                firstName
                lastName
                email
              }
            }
          }`,
          {}
        );

        const orphanedInvitations = (orphanedInvitationsData as any)?.userInvitations || [];
        
        for (const invitation of orphanedInvitations) {
          result.details.invitationsWithoutUsers.push({
            id: invitation.id,
            email: invitation.email,
            invitedBy: (invitation as any)?.invitedBy?.firstName && (invitation as any)?.invitedBy?.lastName 
              ? `${(invitation as any).invitedBy.firstName} ${(invitation as any).invitedBy.lastName}`
              : (invitation as any)?.invitedBy?.email || "Unknown",
          });
          result.summary.invitationsWithoutUsers++;
        }
      } catch (error: any) {
        result.errors.push(`Failed to query orphaned invitations: ${error?.message || 'Unknown error'}`);
      }
    }

    // Log summary
    console.log("🧹 Cleanup summary:", {
      dryRun,
      expiredInvitationsFound: result.details.expiredInvitations.length,
      expiredInvitationsDeleted: result.summary.expiredInvitationsDeleted,
      orphanedUsersFound: result.details.orphanedUsers.length,
      orphanedUsersDeleted: result.summary.orphanedUsersDeleted,
      clerkOnlyUsersFound: result.summary.clerkOnlyUsersFound,
      invitationsWithoutUsersFound: result.summary.invitationsWithoutUsers,
      errorsCount: result.errors.length,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ Cleanup operation failed:", error);

    return NextResponse.json(
      {
        success: false,
        summary: {
          expiredInvitationsDeleted: 0,
          orphanedUsersDeleted: 0,
          clerkOnlyUsersFound: 0,
          invitationsWithoutUsers: 0,
        },
        details: {
          expiredInvitations: [],
          orphanedUsers: [],
          clerkOnlyUsers: [],
          invitationsWithoutUsers: [],
        },
        errors: [`Cleanup operation failed: ${error?.message || 'Unknown error'}`],
      },
      { status: 500 }
    );
  }
});

// GET endpoint for checking orphaned data without cleanup
export const GET = withAuth(async (req: NextRequest, session) => {
  try {
    // Require developer role for viewing orphaned data
    const userRole = session?.role || 'viewer';
    if (userRole !== 'developer') {
      return NextResponse.json(
        { error: "Unauthorized: Developer role required for viewing orphaned data" },
        { status: 403 }
      );
    }

    // Call POST with dryRun=true to get data without making changes
    const mockBody = {
      dryRun: true,
      cleanupTypes: ['expired_invitations', 'orphaned_users', 'clerk_only_users', 'invitationsWithoutUsers'],
    };

    // Create a mock request for the POST handler
    const mockRequest = {
      json: async () => mockBody,
    } as NextRequest;

    return NextResponse.json({
      success: true,
      summary: {
        expiredInvitationsDeleted: 0,
        orphanedUsersDeleted: 0,
        clerkOnlyUsersFound: 0,
        invitationsWithoutUsers: 0,
      },
      details: {
        expiredInvitations: [],
        orphanedUsers: [],
        clerkOnlyUsers: [],
        invitationsWithoutUsers: [],
      },
      errors: [],
    });
  } catch (error: any) {
    console.error("❌ Orphaned data check failed:", error);
    return NextResponse.json(
      { error: "Failed to check orphaned data" },
      { status: 500 }
    );
  }
});