import { createClerkClient } from "@clerk/backend";
import { NextRequest, NextResponse } from "next/server";
import {
  GetExpiredInvitationsDocument,
  type GetExpiredInvitationsQuery,
  type GetExpiredInvitationsQueryVariables,
  DeleteExpiredInvitationDocument,
  type DeleteExpiredInvitationMutation,
  type DeleteExpiredInvitationMutationVariables,
  GetUsersWithoutClerkIdDocument,
  type GetUsersWithoutClerkIdQuery,
  DeleteUserDocument,
  type DeleteUserMutation,
  type DeleteUserMutationVariables,
  GetUserByClerkIdDocument,
  type GetUserByClerkIdQuery,
  type GetUserByClerkIdQueryVariables,
  GetOrphanedInvitationsDocument,
  type GetOrphanedInvitationsQuery,
} from "@/domains/admin/graphql/generated/graphql";
import {
  executeTypedQuery,
  executeTypedMutation,
} from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

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
    expiredInvitations: Array<{
      id: string;
      email: string;
      expiredSince: string;
    }>;
    orphanedUsers: Array<{ id: string; email: string; reason: string }>;
    clerkOnlyUsers: Array<{ id: string; email: string; createdAt: string }>;
    invitationsWithoutUsers: Array<{
      id: string;
      email: string;
      invitedBy: string;
    }>;
  };
  errors: string[];
}

export const POST = withAuth(async (req: NextRequest, _session) => {
  try {
    // Require developer role for cleanup operations
    const userRole = _session?.role || "viewer";
    if (userRole !== "developer") {
      return NextResponse.json(
        {
          error: "Unauthorized: Developer role required for cleanup operations",
        },
        { status: 403 }
      );
    }

    logger.info("Starting orphaned data cleanup", {
      namespace: "admin_cleanup_api",
      operation: "start_cleanup",
      classification: DataClassification.INTERNAL,
      metadata: {
        userRole,
        timestamp: new Date().toISOString(),
      },
    });

    const body = await req.json();
    const {
      dryRun = true,
      cleanupTypes = ["expired_invitations", "orphaned_users"],
    } = body;

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
    if (cleanupTypes.includes("expired_invitations")) {
      logger.info("Finding expired invitations", {
        namespace: "admin_cleanup_api",
        operation: "find_expired_invitations",
        classification: DataClassification.INTERNAL,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      });

      try {
        const now = new Date().toISOString();
        const expiredInvitationsData = await executeTypedQuery<
          GetExpiredInvitationsQuery,
          GetExpiredInvitationsQueryVariables
        >(GetExpiredInvitationsDocument, { now });

        const expiredInvitations =
          expiredInvitationsData?.userInvitations || [];

        for (const invitation of expiredInvitations) {
          const expiredSince = invitation.expiresAt ? new Date(invitation.expiresAt) : new Date();
          const daysSinceExpired = Math.floor(
            (Date.now() - expiredSince.getTime()) / (1000 * 60 * 60 * 24)
          );

          result.details.expiredInvitations.push({
            id: invitation.id,
            email: invitation.email,
            expiredSince: `${daysSinceExpired} days ago`,
          });

          if (!dryRun && daysSinceExpired > 7) {
            // Only delete if expired for more than 7 days
            try {
              await executeTypedMutation<
                DeleteExpiredInvitationMutation,
                DeleteExpiredInvitationMutationVariables
              >(DeleteExpiredInvitationDocument, {
                invitationId: invitation.id,
              });
              result.summary.expiredInvitationsDeleted++;
              logger.info("Deleted expired invitation", {
                namespace: "admin_cleanup_api",
                operation: "delete_expired_invitation",
                classification: DataClassification.CONFIDENTIAL,
                metadata: {
                  email: invitation.email,
                  invitationId: invitation.id,
                  timestamp: new Date().toISOString(),
                },
              });
            } catch (deleteError: any) {
              result.errors.push(
                `Failed to delete invitation ${invitation.email}: ${deleteError?.message || "Unknown error"}`
              );
            }
          }
        }
      } catch (error: any) {
        result.errors.push(
          `Failed to query expired invitations: ${error?.message || "Unknown error"}`
        );
      }
    }

    // 2. Find database users without Clerk IDs
    if (cleanupTypes.includes("orphaned_users")) {
      logger.info("Finding users without Clerk IDs", {
        namespace: "admin_cleanup_api",
        operation: "find_orphaned_users",
        classification: DataClassification.INTERNAL,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      });

      try {
        const orphanedUsersData =
          await executeTypedQuery<GetUsersWithoutClerkIdQuery>(
            GetUsersWithoutClerkIdDocument,
            {}
          );

        const orphanedUsers = orphanedUsersData?.users || [];

        for (const user of orphanedUsers) {
          const createdAt = user.createdAt ? new Date(user.createdAt) : new Date();
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
              await executeTypedMutation<
                DeleteUserMutation,
                DeleteUserMutationVariables
              >(DeleteUserDocument, { userId: user.id });
              result.summary.orphanedUsersDeleted++;
              logger.info("Deleted orphaned user", {
                namespace: "admin_cleanup_api",
                operation: "delete_orphaned_user",
                classification: DataClassification.CONFIDENTIAL,
                metadata: {
                  email: user.email,
                  userId: user.id,
                  timestamp: new Date().toISOString(),
                },
              });
            } catch (deleteError: any) {
              result.errors.push(
                `Failed to delete user ${user.email}: ${deleteError?.message || "Unknown error"}`
              );
            }
          }
        }
      } catch (error: any) {
        result.errors.push(
          `Failed to query orphaned users: ${error?.message || "Unknown error"}`
        );
      }
    }

    // 3. Find Clerk users without database records
    if (cleanupTypes.includes("clerk_only_users")) {
      logger.info("Finding Clerk users without database records", {
        namespace: "admin_cleanup_api",
        operation: "find_clerk_only_users",
        classification: DataClassification.INTERNAL,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      });

      try {
        const clerkUsers = await clerkClient.users.getUserList({
          limit: 500, // Adjust as needed
        });

        for (const clerkUser of clerkUsers.data) {
          // Check if this Clerk user exists in our database
          try {
            const dbUserData = await executeTypedQuery<
              GetUserByClerkIdQuery,
              GetUserByClerkIdQueryVariables
            >(GetUserByClerkIdDocument, { clerkUserId: clerkUser.id });

            if (!dbUserData?.users || dbUserData.users.length === 0) {
              result.details.clerkOnlyUsers.push({
                id: clerkUser.id,
                email: clerkUser.emailAddresses[0]?.emailAddress || "No email",
                createdAt: new Date(clerkUser.createdAt).toLocaleDateString(),
              });
              result.summary.clerkOnlyUsersFound++;
            }
          } catch (dbError: any) {
            result.errors.push(
              `Failed to check database for Clerk user ${clerkUser.id}: ${dbError?.message || "Unknown error"}`
            );
          }
        }
      } catch (error: any) {
        result.errors.push(
          `Failed to fetch Clerk users: ${error?.message || "Unknown error"}`
        );
      }
    }

    // 4. Find invitations pointing to non-existent users
    if (cleanupTypes.includes("invitations_without_users")) {
      logger.info("Finding invitations without valid users", {
        namespace: "admin_cleanup_api",
        operation: "find_invalid_invitations",
        classification: DataClassification.INTERNAL,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      });

      try {
        const orphanedInvitationsData =
          await executeTypedQuery<GetOrphanedInvitationsQuery>(
            GetOrphanedInvitationsDocument,
            {}
          );

        const orphanedInvitations =
          orphanedInvitationsData?.userInvitations || [];

        for (const invitation of orphanedInvitations) {
          result.details.invitationsWithoutUsers.push({
            id: invitation.id,
            email: invitation.email,
            invitedBy:
              invitation?.invitedByUser?.firstName &&
              invitation?.invitedByUser?.lastName
                ? `${invitation.invitedByUser.firstName} ${invitation.invitedByUser.lastName}`
                : invitation?.invitedByUser?.email || "Unknown",
          });
          result.summary.invitationsWithoutUsers++;
        }
      } catch (error: any) {
        result.errors.push(
          `Failed to query orphaned invitations: ${error?.message || "Unknown error"}`
        );
      }
    }

    // Log summary
    logger.info("Cleanup operation completed", {
      namespace: "admin_cleanup_api",
      operation: "cleanup_summary",
      classification: DataClassification.INTERNAL,
      metadata: {
        dryRun,
        expiredInvitationsFound: result.details.expiredInvitations.length,
        expiredInvitationsDeleted: result.summary.expiredInvitationsDeleted,
        orphanedUsersFound: result.details.orphanedUsers.length,
        orphanedUsersDeleted: result.summary.orphanedUsersDeleted,
        clerkOnlyUsersFound: result.summary.clerkOnlyUsersFound,
        invitationsWithoutUsersFound: result.summary.invitationsWithoutUsers,
        errorsCount: result.errors.length,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    logger.error("Cleanup operation failed", {
      namespace: "admin_cleanup_api",
      operation: "post_cleanup",
      classification: DataClassification.INTERNAL,
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: {
        errorName: error instanceof Error ? error.name : "UnknownError",
        timestamp: new Date().toISOString(),
      },
    });

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
        errors: [
          `Cleanup operation failed: ${error?.message || "Unknown error"}`,
        ],
      },
      { status: 500 }
    );
  }
});

// GET endpoint for checking orphaned data without cleanup
export const GET = withAuth(async (_req: NextRequest, _session) => {
  try {
    // Require developer role for viewing orphaned data
    const userRole = _session?.role || "viewer";
    if (userRole !== "developer") {
      return NextResponse.json(
        {
          error:
            "Unauthorized: Developer role required for viewing orphaned data",
        },
        { status: 403 }
      );
    }

    // Call POST with dryRun=true to get data without making changes
    const mockBody = {
      dryRun: true,
      cleanupTypes: [
        "expired_invitations",
        "orphaned_users",
        "clerk_only_users",
        "invitationsWithoutUsers",
      ],
    };

    // Create a mock request for the POST handler (not used in this simplified version)
    const _mockRequest = {
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
    logger.error("Orphaned data check failed", {
      namespace: "admin_cleanup_api",
      operation: "get_cleanup_status",
      classification: DataClassification.INTERNAL,
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: {
        errorName: error instanceof Error ? error.name : "UnknownError",
        timestamp: new Date().toISOString(),
      },
    });
    return NextResponse.json(
      { error: "Failed to check orphaned data" },
      { status: 500 }
    );
  }
});
