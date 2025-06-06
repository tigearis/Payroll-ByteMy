// app/api/clerk-webhooks/route.ts
import { NextRequest } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { syncUserWithDatabase } from "@/lib/user-sync";
import { adminApolloClient } from "@/lib/server-apollo-client";
import { gql } from "@apollo/client";

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

// GraphQL mutation to update user role when syncing from Clerk
const UPDATE_USER_ROLE_FROM_CLERK = gql`
  mutation UpdateUserRoleFromClerk($clerkId: String!, $role: user_role!) {
    update_users(
      where: { clerk_user_id: { _eq: $clerkId } }
      _set: { role: $role, updated_at: "now()" }
    ) {
      affected_rows
      returning {
        id
        name
        email
        role
        clerk_user_id
      }
    }
  }
`;

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

        // For OAuth users, assign Developer role automatically
        const hasOAuthProvider =
          external_accounts && external_accounts.length > 0;
        const defaultRole = hasOAuthProvider ? "org_admin" : "viewer"; // OAuth users get org_admin (Developer)

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
              mutation: UPDATE_USER_ROLE_FROM_CLERK,
              variables: {
                clerkId: id,
                role: updatedRole,
              },
            });

            if (updateResult?.update_users?.affected_rows > 0) {
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
  } catch (error) {
    console.error("❌ Error handling webhook:", error);
    return new Response("Error processing webhook", { status: 500 });
  }

  return new Response("", { status: 200 });
}
