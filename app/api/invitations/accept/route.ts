import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";
import {
  GetInvitationByTicketDocument,
  type GetInvitationByTicketQuery,
  GetInvitationByClerkIdDocument,
  type GetInvitationByClerkIdQuery,
  AcceptInvitationEnhancedDocument,
  type AcceptInvitationEnhancedMutation,
} from "@/domains/auth/graphql/generated/graphql";
import {
  CreateUserByEmailDocument,
  type CreateUserByEmailMutation,
  GetUserByClerkIdDocument,
  type GetUserByClerkIdQuery,
  GetUserByEmailDocument,
  type GetUserByEmailQuery,
} from "@/domains/users/graphql/generated/graphql";
import { executeTypedMutation, executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

interface AcceptInvitationRequest {
  clerkTicket: string;
  clerkUserId: string;
  userEmail: string;
  userName: string;
}

interface AcceptInvitationResponse {
  success: boolean;
  user?: any;
  invitation?: any;
  message?: string;
  error?: string;
}

export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    const body: AcceptInvitationRequest = await req.json();
    const { clerkTicket, clerkUserId, userEmail, userName } = body;

    // Validate required fields
    if (!clerkTicket || !clerkUserId || !userEmail || !userName) {
      console.error("❌ Missing required fields:", { clerkTicket: !!clerkTicket, clerkUserId: !!clerkUserId, userEmail: !!userEmail, userName: !!userName });
      return NextResponse.json<AcceptInvitationResponse>(
        {
          success: false,
          error: "Missing required fields: clerkTicket, clerkUserId, userEmail, userName",
        },
        { status: 400 }
      );
    }

    console.log("🔍 Looking up invitation with ticket:", clerkTicket.substring(0, 20) + "...");
    console.log("🔍 Full request details:", { clerkUserId, userEmail, userName });

    // Decode the JWT ticket to extract invitation details
    let clerkInvitationId = null;
    try {
      const base64Payload = clerkTicket.split(".")[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
      console.log("🔍 Decoded JWT payload:", decodedPayload);
      clerkInvitationId = decodedPayload.sid; // Clerk uses 'sid' (session ID) for invitation ID
    } catch (decodeError) {
      console.error("❌ Failed to decode JWT ticket:", decodeError);
      return NextResponse.json<AcceptInvitationResponse>(
        {
          success: false,
          error: "Invalid invitation ticket format",
        },
        { status: 400 }
      );
    }

    if (!clerkInvitationId) {
      console.error("❌ No invitation ID found in JWT ticket");
      return NextResponse.json<AcceptInvitationResponse>(
        {
          success: false,
          error: "Invalid invitation ticket - no invitation ID",
        },
        { status: 400 }
      );
    }

    console.log("🔍 Extracted Clerk invitation ID:", clerkInvitationId);

    // Get invitation by Clerk invitation ID instead of ticket
    const invitationData = await executeTypedQuery<GetInvitationByClerkIdQuery>(
      GetInvitationByClerkIdDocument,
      { clerkInvitationId } // Use the extracted ID
    );

    console.log("📊 Query result:", { 
      found: invitationData.userInvitations?.length || 0, 
      invitations: invitationData.userInvitations?.map(inv => ({ 
        id: inv.id, 
        email: inv.email, 
        status: inv.invitationStatus,
        expiresAt: inv.expiresAt,
        isExpired: new Date(inv.expiresAt) < new Date(),
        clerkInvitationId: inv.clerkInvitationId,
        ticket: inv.clerkTicket?.substring(0, 20) + "..." 
      }))
    });

    if (!invitationData.userInvitations || invitationData.userInvitations.length === 0) {
      console.error("❌ No invitation found for Clerk invitation ID:", clerkInvitationId);
      return NextResponse.json<AcceptInvitationResponse>(
        {
          success: false,
          error: "Invitation not found or invalid ticket",
        },
        { status: 404 }
      );
    }

    const invitation = invitationData.userInvitations[0];
    const now = new Date();
    const expiresAt = new Date(invitation.expiresAt);
    const isExpired = expiresAt < now;

    console.log("⏰ Invitation timing details:", {
      id: invitation.id,
      email: invitation.email,
      status: invitation.invitationStatus,
      expiresAt: invitation.expiresAt,
      currentTime: now.toISOString(),
      isExpired,
      timeUntilExpiry: isExpired ? 'EXPIRED' : `${Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60))} hours`,
    });

    // Check Clerk invitation status directly
    let clerkInvitationStatus = null;
    if (invitation.clerkInvitationId) {
      try {
        console.log("🔍 Checking Clerk invitation status:", invitation.clerkInvitationId);
        // List invitations and find the one with matching ID
        const invitations = await clerkClient.invitations.getInvitationList();
        const clerkInvitation = invitations.data.find(inv => inv.id === invitation.clerkInvitationId);
        
        if (clerkInvitation) {
          clerkInvitationStatus = {
            id: clerkInvitation.id,
            status: clerkInvitation.status,
            emailAddress: clerkInvitation.emailAddress,
            createdAt: clerkInvitation.createdAt,
            updatedAt: clerkInvitation.updatedAt,
          };
          console.log("🔍 Clerk invitation details:", clerkInvitationStatus);
          
          // Compare expiry times
          console.log("⏰ Expiry comparison:", {
            databaseExpiry: invitation.expiresAt,
            clerkCreated: clerkInvitation.createdAt,
            clerkUpdated: clerkInvitation.updatedAt,
            clerkStatus: clerkInvitation.status,
            note: "Clerk invitations typically expire after 30 days, database might have shorter expiry"
          });
        } else {
          console.warn("⚠️ Clerk invitation not found in invitation list");
          clerkInvitationStatus = { error: "Invitation not found in Clerk" };
        }
      } catch (clerkError) {
        console.warn("⚠️ Could not fetch Clerk invitation:", clerkError.message);
        clerkInvitationStatus = { error: clerkError.message };
      }
    } else {
      console.log("⚠️ No Clerk invitation ID in database record");
    }

    // Check if invitation is still pending and not expired
    if (invitation.invitationStatus !== "pending") {
      console.error("❌ Invitation status not pending:", invitation.invitationStatus);
      return NextResponse.json<AcceptInvitationResponse>(
        {
          success: false,
          error: `Invitation cannot be accepted. Current status: ${invitation.invitationStatus}`,
        },
        { status: 400 }
      );
    }

    if (isExpired) {
      console.error("❌ Invitation has expired:", {
        expiresAt: invitation.expiresAt,
        currentTime: now.toISOString(),
        expiredBy: `${Math.ceil((now.getTime() - expiresAt.getTime()) / (1000 * 60 * 60))} hours`
      });
      return NextResponse.json<AcceptInvitationResponse>(
        {
          success: false,
          error: "Invitation has expired",
        },
        { status: 400 }
      );
    }

    // Check if user already exists by Clerk ID
    let existingUser = null;
    try {
      console.log("🔍 Checking if user already exists with Clerk ID:", clerkUserId);
      const existingUserData = await executeTypedQuery<GetUserByClerkIdQuery>(
        GetUserByClerkIdDocument,
        { clerkUserId }
      );
      existingUser = existingUserData.users?.[0] || null;
      
      if (existingUser) {
        console.log("👤 User already exists:", {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
          isActive: existingUser.isActive
        });
      }
    } catch (userCheckError) {
      console.warn("⚠️ Could not check for existing user:", userCheckError);
    }

    // If user doesn't exist by Clerk ID, check by email as backup
    if (!existingUser) {
      try {
        console.log("🔍 Checking if user exists with email:", userEmail);
        const existingUserByEmailData = await executeTypedQuery<GetUserByEmailQuery>(
          GetUserByEmailDocument,
          { email: userEmail }
        );
        const userByEmail = existingUserByEmailData.users?.[0] || null;
        
        if (userByEmail) {
          console.log("📧 User exists with same email but different Clerk ID:", {
            id: userByEmail.id,
            email: userByEmail.email,
            existingClerkId: userByEmail.clerkUserId,
            newClerkId: clerkUserId
          });
          // Could be a user who had a previous Clerk account
          existingUser = userByEmail;
        }
      } catch (emailCheckError) {
        console.warn("⚠️ Could not check for existing user by email:", emailCheckError);
      }
    }

    let newUser;
    if (existingUser) {
      // User already exists, just use the existing user
      console.log("✅ Using existing user for invitation acceptance");
      newUser = existingUser;
      
      // Optionally update the Clerk ID if it's different
      if (existingUser.clerkUserId !== clerkUserId) {
        console.log("🔄 Updating Clerk ID for existing user");
        // We might want to add a mutation to update the Clerk ID, but for now just proceed
      }
    } else {
      // Create user record in database
      console.log("🔨 Creating new user record in database");
      const userData = await executeTypedMutation<CreateUserByEmailMutation>(
        CreateUserByEmailDocument,
        {
          name: userName,
          email: userEmail,
          role: invitation.invitedRole,
          managerId: invitation.managerId,
          isStaff: true, // Users from invitations are staff by default
          clerkUserId: clerkUserId,
        }
      );

      newUser = userData.insertUser;

      if (!newUser) {
        return NextResponse.json<AcceptInvitationResponse>(
          {
            success: false,
            error: "Failed to create user record",
          },
          { status: 500 }
        );
      }
      
      console.log("✅ New user created:", {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      });
    }

    // Accept the invitation
    const acceptedInvitation = await executeTypedMutation<AcceptInvitationEnhancedMutation>(
      AcceptInvitationEnhancedDocument,
      {
        invitationId: invitation.id,
        acceptedBy: newUser.id,
      }
    );

    console.log(`✅ Invitation accepted successfully: ${invitation.id}`);
    console.log(`✅ User created: ${newUser.id} (${newUser.email})`);

    return NextResponse.json<AcceptInvitationResponse>({
      success: true,
      user: newUser,
      invitation: acceptedInvitation.updateUserInvitationById,
      message: `Welcome ${userName}! Your account has been created successfully.`,
    });
  } catch (error: any) {
    console.error("Invitation acceptance error:", error);

    return NextResponse.json<AcceptInvitationResponse>(
      {
        success: false,
        error: "Failed to accept invitation",
      },
      { status: 500 }
    );
  }
});