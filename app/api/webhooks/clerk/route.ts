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
  console.log("🚀 WEBHOOK STARTED - Processing Clerk webhook request");
  
  // Define the service operation for logging
  const operation: ServiceOperation = {
    type: 'webhook',
    name: 'clerk-webhook',
    metadata: {
      endpoint: '/api/webhooks/clerk',
    },
  };

  try {
    console.log("🔧 SERVICE AUTH CHECK - Starting service authentication");
    // Service authentication check (for audit logging)
    const authResult = { isValid: authenticateServiceRequest() };

    if (!authResult.isValid) {
      console.warn(`🔒 Service auth warning: ${authResult.reason}`);
      // Continue processing as webhook signature validation is the primary security
    }
    console.log("✅ SERVICE AUTH - Service auth check completed");
  } catch (authError) {
    console.warn('🔒 Service auth check failed:', authError);
    // Continue processing as webhook signature is primary security
  }

  console.log("🔐 WEBHOOK SECRET CHECK - Verifying webhook secret exists");
  if (!webhookSecret) {
    console.error("❌ WEBHOOK SECRET MISSING - CLERK_WEBHOOK_SECRET not found");
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }
  console.log("✅ WEBHOOK SECRET - Secret found, proceeding with verification");

  console.log("📥 HEADERS - Getting webhook headers");
  // Get headers once and reuse
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  console.log("📋 HEADERS EXTRACTED:", {
    svixId: svixId?.substring(0, 20) + "...",
    svixTimestamp,
    svixSignature: svixSignature?.substring(0, 20) + "...",
    hasAllHeaders: !!(svixId && svixTimestamp && svixSignature)
  });

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("❌ MISSING SVIX HEADERS - Headers incomplete");
    return new Response("Error occurred -- no svix headers", { status: 400 });
  }

  console.log("📄 PAYLOAD - Reading request body");
  const payload = await req.text();
  const body = JSON.parse(payload);
  console.log("✅ PAYLOAD - Body parsed successfully");

  console.log("🔐 SIGNATURE VERIFICATION - Creating webhook verifier");
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  try {
    console.log("🔍 VERIFYING - Checking webhook signature");
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
    console.log("✅ VERIFICATION SUCCESS - Webhook signature verified");
  } catch (err) {
    console.error("❌ VERIFICATION FAILED - Error verifying webhook:", err);
    return new Response("Error occurred", { status: 400 });
  }

  console.log("🎯 EVENT PROCESSING - Extracting event data");
  const {
    id,
    email_addresses,
    first_name,
    last_name,
    external_accounts,
    image_url,
  } = evt.data;
  const eventType = evt.type;

  console.log(`🔔 WEBHOOK EVENT: ${eventType} for user ${id}`);
  console.log("📊 EVENT DATA:", {
    userId: id,
    eventType,
    firstName: first_name,
    lastName: last_name,
    emailCount: email_addresses?.length || 0,
    hasImageUrl: !!image_url
  });
  console.log("📋 FULL WEBHOOK BODY:", body);

  try {
    console.log("🔄 PROCESSING - Starting event processing");
    // Update operation metadata with event details
    operation.userId = id;
    operation.metadata = {
      ...operation.metadata,
      eventType,
      clerkUserId: id,
    };

    console.log(`🎭 EVENT TYPE - Processing ${eventType}`);
    switch (eventType) {
      case "user.created":
        console.log("👤 USER CREATION - Processing new user created event:", id);

        // Validate user exists in Clerk before syncing
        try {
          console.log("🔍 CLERK VALIDATION - Fetching user from Clerk API");
          const clerkUser = await clerkClient.users.getUser(id);
          console.log(`✅ CLERK VALIDATION SUCCESS - User exists in Clerk:`, {
            id: clerkUser.id,
            email: clerkUser.emailAddresses?.[0]?.emailAddress,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName
          });
          
          // Use validated data from Clerk
          const userEmail = clerkUser.emailAddresses.find(email => email.id === clerkUser.primaryEmailAddressId)?.emailAddress || '';
          const userName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "New User";
          
          console.log("📧 EMAIL EXTRACTION:", {
            userEmail,
            userName,
            primaryEmailId: clerkUser.primaryEmailAddressId,
            totalEmails: clerkUser.emailAddresses.length
          });
          
          // ENHANCED: Check for pending invitations for this email
          let roleFromInvitation: UserRole | null = null;
          let managerIdFromInvitation: string | undefined = undefined;
          
          if (userEmail) {
            try {
              console.log(`🔍 INVITATION CHECK - Looking for pending invitations for email: ${userEmail}`);
              
              const invitationCheck = await adminApolloClient.query({
                query: gql`
                  query GetPendingInvitationForWebhook($email: String!) {
                    userInvitations(
                      where: {
                        email: { _eq: $email }
                        invitationStatus: { _eq: "pending" }
                        expiresAt: { _gt: "now()" }
                      }
                      orderBy: { createdAt: DESC }
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
              
              console.log("💾 INVITATION QUERY RESULT:", {
                found: invitationCheck.data?.userInvitations?.length || 0,
                invitations: invitationCheck.data?.userInvitations
              });
              
              const pendingInvitation = invitationCheck.data?.userInvitations?.[0];
              if (pendingInvitation) {
                roleFromInvitation = pendingInvitation.invitedRole as UserRole;
                managerIdFromInvitation = pendingInvitation.managerId;
                console.log(`✅ INVITATION FOUND - Using invitation data:`, {
                  role: roleFromInvitation,
                  managerId: managerIdFromInvitation || 'none',
                  invitationId: pendingInvitation.id,
                  status: pendingInvitation.invitationStatus
                });
              } else {
                console.log("ℹ️ NO INVITATION - No pending invitations found for this email");
              }
            } catch (invitationError) {
              console.error("❌ INVITATION ERROR - Could not check for pending invitations:", invitationError);
            }
          } else {
            console.warn("⚠️ NO EMAIL - Cannot check for invitations without user email");
          }
          
          // SECURITY FIX: Prioritize invitation role > metadata role > viewer (least privilege)
          const invitationRole = clerkUser.publicMetadata?.role as string;
          const finalRole = roleFromInvitation || (invitationRole as UserRole) || "viewer";
          const finalManagerId = managerIdFromInvitation;

          console.log(`📋 ROLE ASSIGNMENT - Priority logic:`, {
            invitationRole: roleFromInvitation || 'none',
            metadataRole: invitationRole || 'none',
            defaultRole: 'viewer',
            finalRole: finalRole,
            finalManagerId: finalManagerId || 'none'
          });

          console.log("🔄 USER SYNC - Starting database synchronization");
          const syncedUser = await syncUserWithDatabase(
            id,
            userName,
            userEmail,
            finalRole,
            finalManagerId,
            clerkUser.imageUrl
          );

          console.log(`✅ USER SYNC SUCCESS - User synced with database:`, {
            id: syncedUser?.id,
            email: syncedUser?.email,
            role: syncedUser?.role,
            computedName: syncedUser?.computedName
          });

          console.log(`✅ User synced with role: ${finalRole}${finalManagerId ? `, manager: ${finalManagerId}` : ''}`);
          
          // If user was created from an invitation, automatically accept the invitation
          if (roleFromInvitation && syncedUser) {
            try {
              console.log(`🎫 INVITATION ACCEPTANCE - Auto-accepting invitation for webhook-created user`);
              
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
              
              console.log("💾 INVITATION MUTATION RESULT:", {
                variables: { email: userEmail, acceptedBy: syncedUser.id },
                result: acceptInvitationResult.data
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
    console.error("❌ WEBHOOK ERROR - Critical failure in webhook processing:");
    console.error("🔍 ERROR DETAILS:", {
      message: error.message,
      name: error.name,
      stack: error.stack?.split('\n').slice(0, 5).join('\n'), // First 5 lines of stack
      cause: error.cause,
      webhookEventType: eventType,
      clerkUserId: id
    });
    
    // GraphQL specific errors
    if (error.graphQLErrors) {
      console.error("🔍 GRAPHQL ERRORS:", error.graphQLErrors);
    }
    
    if (error.networkError) {
      console.error("🔍 NETWORK ERROR:", error.networkError);
    }
    
    // Apollo Client errors
    if (error.extraInfo) {
      console.error("🔍 APOLLO EXTRA INFO:", error.extraInfo);
    }
    
    console.error("❌ WEBHOOK FAILED - Returning 500 to Clerk");
    return new Response("Error processing webhook", { status: 500 });
  }

  console.log("✅ WEBHOOK SUCCESS - Processing completed successfully");
  return new Response("", { status: 200 });
}
