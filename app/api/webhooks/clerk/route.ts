// app/api/clerk-webhooks/route.ts
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { Webhook } from "svix";

import { UpdateUserRoleFromClerkDocument } from "@/domains/users/graphql/generated/graphql";
import { syncUserWithDatabase } from "@/domains/users/services/user-sync";
import { adminApolloClient } from "@/lib/apollo/unified-client";

// Verify webhook signature for security
async function verifyWebhook(
  request: NextRequest
): Promise<WebhookEvent | null> {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return null;
  }

  const headersList = await headers();
  const svixId = headersList.get("svix-id");
  const svixTimestamp = headersList.get("svix-timestamp");
  const svixSignature = headersList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("Missing svix headers");
    return null;
  }

  const payload = await request.text();
  const body = payload;

  const wh = new Webhook(WEBHOOK_SECRET);

  try {
    const evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;

    return evt;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return null;
  }
}

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

type WebhookEvent = {
  data: any;
  object: "event";
  type: string;
};

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

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
    switch (eventType) {
      case "user.created":
        console.log("👤 New user created:", id);

        // For OAuth users, assign Admin role automatically
        const hasOAuthProvider =
          external_accounts && external_accounts.length > 0;

        // Check if role is in invitation metadata first, then default
        const invitationRole = evt.data.public_metadata?.role;
        const defaultRole =
          invitationRole || (hasOAuthProvider ? "org_admin" : "viewer");

        await syncUserWithDatabase(
          id,
          `${first_name || ""} ${last_name || ""}`.trim() || "New User",
          email_addresses[0]?.email_address || "",
          defaultRole,
          undefined,
          image_url
        );

        console.log(`✅ User synced with role: ${defaultRole}`);
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
                clerkId: id,
                role: updatedRole,
              },
            });

            if (
              updateResult?.updateUsers?.affected_rows &&
              updateResult.updateUsers.affected_rows > 0
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
