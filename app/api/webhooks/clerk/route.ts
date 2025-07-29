// app/api/webhooks/clerk/route.ts
import { createClerkClient } from "@clerk/backend";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { gql } from "@apollo/client";
import { UpdateUserRoleFromClerkDocument } from "@/domains/users/graphql/generated/graphql";
import { syncUserWithDatabase } from "@/domains/users/services/user-sync";
import type { UserRole } from "@/domains/users/services/user-sync";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { 
  authenticateServiceRequest, 
  ServiceOperation,
  logServiceAuth 
} from "@/lib/auth/service-auth";

// Initialize Clerk client for backend operations
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});


const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

type WebhookEvent = {
  data: any;
  object: "event";
  type: string;
};

export async function POST(req: NextRequest) {
  // Define the service operation for logging
  const operation: ServiceOperation = {
    type: 'webhook',
    name: 'clerk-webhook',
    metadata: {
      endpoint: '/api/webhooks/clerk',
    },
  };

  try {
    // Service authentication check (for audit logging)
    const authResult = { isValid: authenticateServiceRequest() };

    if (!authResult.isValid) {
      console.warn(`🔒 Service auth warning: ${authResult.reason}`);
      // Continue processing as webhook signature validation is the primary security
    }
  } catch (authError) {
    console.warn('🔒 Service auth check failed:', authError);
    // Continue processing as webhook signature is primary security
  }

  if (!webhookSecret) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

  // Get headers once and reuse
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error occurred -- no svix headers", { status: 400 });
  }

  const payload = await req.text();
  const body = JSON.parse(payload);

  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", { status: 400 });
  }

  const {
    id,
    email_addresses,
    first_name,
    last_name,
    external_accounts,
    image_url,
  } = evt.data;
  const eventType = evt.type;

  console.log(`🔔 Clerk Webhook: ${eventType} for user ${id}`);
  console.log("Webhook body:", body);

  try {
    // Update operation metadata with event details
    operation.userId = id;
    operation.metadata = {
      ...operation.metadata,
      eventType,
      clerkUserId: id,
    };

    switch (eventType) {
      case "user.created":
        console.log("👤 New user created:", id);

        // Validate user exists in Clerk before syncing
        try {
          const clerkUser = await clerkClient.users.getUser(id);
          console.log(`✅ Validated user exists in Clerk: ${clerkUser.id}`);
          
          // Use validated data from Clerk
          const userEmail = clerkUser.emailAddresses.find(email => email.id === clerkUser.primaryEmailAddressId)?.emailAddress || '';
          const userName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "New User";
          
          // ENHANCED: Check for pending invitations for this email
          let roleFromInvitation: UserRole | null = null;
          let managerIdFromInvitation: string | undefined = undefined;
          
          if (userEmail) {
            try {
              console.log(`🔍 Checking for pending invitations for email: ${userEmail}`);
              
              const invitationCheck = await adminApolloClient.query({
                query: gql`
                  query GetPendingInvitationForWebhook($email: String!) {
                    userInvitations(
                      where: {
                        email: { _eq: $email }
                        invitationStatus: { _eq: "pending" }
                        expiresAt: { _gt: "now()" }
                      }
                      orderBy: { createdAt: desc }
                      limit: 1
                    ) {
                      id
                      email
                      invitedRole
                      managerId
                      invitationStatus
                      expiresAt
                      createdAt
                    }
                  }
                `,
                variables: { email: userEmail },
                fetchPolicy: 'network-only'
              });
              
              const pendingInvitation = invitationCheck.data?.userInvitations?.[0];
              if (pendingInvitation) {
                roleFromInvitation = pendingInvitation.invitedRole as UserRole;
                managerIdFromInvitation = pendingInvitation.managerId;
                console.log(`✅ Found pending invitation - using role: ${roleFromInvitation}, manager: ${managerIdFromInvitation || 'none'}`);
              } else {
                console.log("ℹ️ No pending invitations found for this email");
              }
            } catch (invitationError) {
              console.warn("⚠️ Could not check for pending invitations:", invitationError);
            }
          }
          
          // SECURITY FIX: Prioritize invitation role > metadata role > viewer (least privilege)
          const invitationRole = clerkUser.publicMetadata?.role as string;
          const finalRole = roleFromInvitation || (invitationRole as UserRole) || "viewer";
          const finalManagerId = managerIdFromInvitation;

          console.log(`📋 Role assignment priority: invitation(${roleFromInvitation}) > metadata(${invitationRole}) > default(viewer) = ${finalRole}`);

          const syncedUser = await syncUserWithDatabase(
            id,
            userName,
            userEmail,
            finalRole,
            finalManagerId,
            clerkUser.imageUrl
          );

          console.log(`✅ User synced with role: ${finalRole}${finalManagerId ? `, manager: ${finalManagerId}` : ''}`);
          
          // If user was created from an invitation, automatically accept the invitation
          if (roleFromInvitation && syncedUser) {
            try {
              console.log(`🎫 Auto-accepting invitation for webhook-created user`);
              
              const acceptInvitationResult = await adminApolloClient.mutate({
                mutation: gql`
                  mutation WebhookAcceptInvitation($email: String!, $acceptedBy: uuid!) {
                    bulkUpdateUserInvitations(
                      where: {
                        email: { _eq: $email }
                        invitationStatus: { _eq: "pending" }
                        expiresAt: { _gt: "now()" }
                      }
                      _set: {
                        invitationStatus: "accepted"
                        acceptedAt: "now()"
                        acceptedBy: $acceptedBy
                        updatedAt: "now()"
                      }
                    ) {
                      affectedRows
                      returning {
                        id
                        email
                        invitationStatus
                        acceptedAt
                      }
                    }
                  }
                `,
                variables: {
                  email: userEmail,
                  acceptedBy: syncedUser.id
                }
              });
              
              const acceptedInvitations = acceptInvitationResult.data?.bulkUpdateUserInvitations?.affectedRows || 0;
              if (acceptedInvitations > 0) {
                console.log(`✅ Auto-accepted ${acceptedInvitations} invitation(s) for webhook-created user`);
              } else {
                console.log(`⚠️ No invitations were auto-accepted (they may have expired or been accepted already)`);
              }
            } catch (invitationAcceptError) {
              console.error("❌ Failed to auto-accept invitation:", invitationAcceptError);
              // Don't fail the webhook - user creation was successful
            }
          }
        } catch (clerkError) {
          console.error("❌ Failed to validate user in Clerk:", clerkError);
          // Fallback to webhook data
          const defaultRole = (evt.data.public_metadata?.role as UserRole) || "viewer";
          await syncUserWithDatabase(
            id,
            `${first_name || ""} ${last_name || ""}`.trim() || "New User",
            email_addresses[0]?.email_address || "",
            defaultRole,
            undefined,
            image_url
          );
        }
        break;

      case "user.updated":
        console.log("🔄 User updated:", id);

        // Check if the role was updated in Clerk's public metadata
        const updatedRole = evt.data.public_metadata?.role;

        if (updatedRole) {
          console.log(`🔄 Role change detected in Clerk: ${updatedRole}`);

          try {
            // Update the database to match Clerk's role
            const { data: updateResult } = await adminApolloClient.mutate({
              mutation: UpdateUserRoleFromClerkDocument,
              variables: {
                clerkUserId: id,
                role: updatedRole,
              },
            });

            if (
              updateResult?.bulkUpdateUsers?.affectedRows &&
              updateResult.bulkUpdateUsers.affectedRows > 0
            ) {
              console.log(`✅ Database role synced from Clerk: ${updatedRole}`);
            } else {
              console.log(`ℹ️ No database user found for Clerk ID: ${id}`);
            }
          } catch (dbError) {
            console.error(
              "❌ Failed to sync role from Clerk to database:",
              dbError
            );
          }
        } else {
          // Regular user update without role change
          await syncUserWithDatabase(
            id,
            `${first_name || ""} ${last_name || ""}`.trim() || "Updated User",
            email_addresses[0]?.email_address || "",
            undefined, // Don't change role if not specified
            undefined,
            image_url
          );
        }
        break;

      case "user.deleted":
        console.log("👤 User deleted:", id);
        // Optionally handle user deletion
        break;

      default:
        console.log(`Unhandled webhook type: ${eventType}`);
    }
  } catch (error: any) {
    console.error("❌ Error handling webhook - DETAILED:", {
      error,
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError,
      extraInfo: error.extraInfo,
      errorCode: error.code,
      status: error.status,
      statusText: error.statusText,
      webhookEventType: eventType,
      clerkUserId: id,
    });
    return new Response("Error processing webhook", { status: 500 });
  }

  return new Response("", { status: 200 });
}
