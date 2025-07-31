import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";
import { gql } from "@apollo/client";
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
import { 
  extractClerkTicketData, 
  getReliableNameFromTicket, 
  getReliableEmailFromTicket,
  logTicketData 
} from "@/lib/clerk-ticket-utils";

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

    // ENHANCED: Extract invitation details and user data using ticket-first strategy
    console.log("🎫 Extracting data from Clerk invitation ticket...");
    const ticketValidation = extractClerkTicketData(clerkTicket);
    
    if (!ticketValidation.isValid) {
      console.error("❌ Invalid Clerk ticket:", ticketValidation.error);
      return NextResponse.json<AcceptInvitationResponse>(
        {
          success: false,
          error: `Invalid invitation ticket: ${ticketValidation.error}`,
        },
        { status: 400 }
      );
    }
    
    const clerkInvitationId = ticketValidation.invitationId!;
    const ticketUserData = ticketValidation.userData!;
    
    // Log extracted ticket data for debugging
    logTicketData("invitation-acceptance", ticketUserData, {
      clerkUserId,
      requestUserEmail: userEmail,
      requestUserName: userName
    });

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
      } catch (clerkError: any) {
        console.warn("⚠️ Could not fetch Clerk invitation:", clerkError?.message || 'Unknown error');
        clerkInvitationStatus = { error: clerkError?.message || 'Unknown error' };
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

    // ENHANCED: Ticket-first email validation using utility functions
    const emailValidation = getReliableEmailFromTicket(ticketUserData, invitation.email);
    const authorizedEmail = emailValidation.email;
    const emailsMatch = authorizedEmail.toLowerCase() === userEmail.toLowerCase();
    
    console.log("📧 Email validation (ticket-first):", {
      authorizedEmail,
      userEmail,
      source: emailValidation.source,
      match: emailsMatch,
      invitationEmail: invitation.email,
      ticketEmail: ticketUserData.email || 'Not available'
    });
    
    if (!emailsMatch) {
      console.error("❌ EMAIL MISMATCH DETECTED:");
      console.error("   - Authorized email:", authorizedEmail);
      console.error("   - Source:", emailValidation.source);
      console.error("   - Clerk user email:", userEmail);
      
      return NextResponse.json<AcceptInvitationResponse>(
        {
          success: false,
          error: `Email mismatch: you are authorized for ${authorizedEmail} but your account uses ${userEmail}. Please contact support.`,
        },
        { status: 400 }
      );
    }
    
    console.log("✅ Email validation passed using", emailValidation.source, "source");

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
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          computedName: existingUser.computedName,
          role: existingUser.role,
          isActive: existingUser.isActive
        });
        
        // CRITICAL: Verify the existing user's email matches the invitation email
        if (existingUser.email.toLowerCase() !== invitation.email.toLowerCase()) {
          console.error("❌ EXISTING USER EMAIL MISMATCH:");
          console.error("   - Invitation email:", invitation.email);
          console.error("   - Existing user email:", existingUser.email);
          console.error("   - This should not happen with proper email validation");
          
          return NextResponse.json<AcceptInvitationResponse>(
            {
              success: false,
              error: "User account email does not match invitation. Please contact support.",
            },
            { status: 400 }
          );
        }
      }
    } catch (userCheckError) {
      console.warn("⚠️ Could not check for existing user:", userCheckError);
    }

    // REMOVED: Email-based fallback lookup to prevent incorrect matching
    // The old code here would find users by normalized email, causing the bug
    // Now we only allow exact Clerk ID matches or create new users

    let newUser;
    if (existingUser) {
      // User already exists with matching Clerk ID and verified email
      console.log("✅ Using existing user for invitation acceptance");
      console.log("   - Email match confirmed:", existingUser.email, "===", invitation.email);
      newUser = existingUser;
      
      // Check if user role needs to be updated to match invitation
      if (existingUser.role !== invitation.invitedRole) {
        console.log(`🔄 Updating user role from ${existingUser.role} to ${invitation.invitedRole} to match invitation`);
        
        try {
          const updateUserRoleData = await executeTypedMutation(
            gql`
              mutation UpdateUserRoleForInvitation($userId: uuid!, $role: user_role!, $managerId: uuid) {
                updateUsersByPk(
                  pkColumns: { id: $userId }
                  _set: { 
                    role: $role
                    managerId: $managerId
                    updatedAt: "now()" 
                  }
                ) {
                  id
                  firstName
                  lastName
                  computedName
                  email
                  role
                  clerkUserId
                  isStaff
                  managerId
                  isActive
                }
              }
            `,
            {
              userId: existingUser.id,
              role: invitation.invitedRole,
              managerId: invitation.managerId,
            }
          );
          
          newUser = (updateUserRoleData as any)?.updateUsersByPk;
          console.log("✅ Updated existing user role to match invitation:", newUser.role);
        } catch (roleUpdateError) {
          console.error("❌ Failed to update user role:", roleUpdateError);
          // Continue with existing user - don't fail the invitation acceptance
        }
      }
      
      // Sanity check: Clerk ID should match since we found by Clerk ID
      if (existingUser.clerkUserId !== clerkUserId) {
        console.warn("⚠️ Clerk ID mismatch detected - this should not happen");
        console.warn("   - Expected:", clerkUserId);
        console.warn("   - Found:", existingUser.clerkUserId);
      }
    } else {
      // Create user record in database with validated email
      console.log("🔨 Creating new user record in database");
      console.log("   - User will be created with invitation email:", invitation.email);
      console.log("   - Clerk user email:", userEmail);
      console.log("   - Using invitation email for consistency");
      
      // ENHANCED: Ticket-first name parsing using utility function
      const nameValidation = getReliableNameFromTicket(ticketUserData, userName);
      const firstName = nameValidation.firstName;
      const lastName = nameValidation.lastName;
      
      console.log("👤 Name validation (ticket-first):", { 
        firstName, 
        lastName, 
        source: nameValidation.source,
        ticketFirstName: ticketUserData.firstName,
        ticketLastName: ticketUserData.lastName,
        ticketFullName: ticketUserData.fullName,
        requestUserName: userName
      });
      
      // CRITICAL: Use the invitation email, not the Clerk email, to ensure exact match
      try {
        const userData = await executeTypedMutation<CreateUserByEmailMutation>(
          CreateUserByEmailDocument,
          {
            firstName: firstName,
            lastName: lastName,
            email: invitation.email, // Use invitation email for exact match
            role: invitation.invitedRole,
            managerId: invitation.managerId,
            isStaff: true, // Users from invitations are staff by default
            clerkUserId: clerkUserId,
          }
        );

        newUser = userData.insertUsers;
      } catch (createUserError: any) {
        console.error("❌ Failed to create user:", createUserError);
        
        // Check if the error is due to user already existing (constraint violation)
        if (createUserError.message?.includes('duplicate') || 
            createUserError.message?.includes('constraint') ||
            createUserError.message?.includes('unique')) {
          console.log("🔍 User creation failed due to duplicate - checking if webhook created user");
          
          // Try to find user by email (webhook might have created with different Clerk ID sync timing)
          try {
            const existingByEmailData = await executeTypedQuery<GetUserByEmailQuery>(
              GetUserByEmailDocument,
              { email: invitation.email }
            );
            
            if (existingByEmailData.users?.[0]) {
              console.log("✅ Found user created by webhook, using existing user");
              newUser = existingByEmailData.users[0];
              
              // Update the user with correct Clerk ID if missing
              if (!newUser.clerkUserId || newUser.clerkUserId !== clerkUserId) {
                console.log("🔄 Updating user with correct Clerk ID");
                const updateClerkIdData = await executeTypedMutation(
                  gql`
                    mutation UpdateUserClerkId($userId: uuid!, $clerkUserId: String!) {
                      updateUsersByPk(
                        pkColumns: { id: $userId }
                        _set: { clerkUserId: $clerkUserId, updatedAt: "now()" }
                      ) {
                        id
                        firstName
                        lastName
                        computedName
                        email
                        role
                        clerkUserId
                        isStaff
                        managerId
                        isActive
                      }
                    }
                  `,
                  {
                    userId: newUser.id,
                    clerkUserId: clerkUserId,
                  }
                );
                newUser = (updateClerkIdData as any)?.updateUsersByPk;
              }
            } else {
              throw createUserError; // Re-throw original error if no existing user found
            }
          } catch (findUserError) {
            console.error("❌ Could not find existing user either:", findUserError);
            throw createUserError; // Re-throw original creation error
          }
        } else {
          throw createUserError; // Re-throw for other types of errors
        }
      }

      if (!newUser) {
        return NextResponse.json<AcceptInvitationResponse>(
          {
            success: false,
            error: "Failed to create user record",
          },
          { status: 500 }
        );
      }
      
      console.log("✅ User ready for invitation acceptance:", {
        id: newUser.id,
        email: newUser.email,
        computedName: newUser.computedName,
        role: newUser.role
      });
      
      // Verify the user has the correct email
      if (newUser.email.toLowerCase() !== invitation.email.toLowerCase()) {
        console.error("❌ CRITICAL: User has wrong email!");
        console.error("   - Expected:", invitation.email);
        console.error("   - Got:", newUser.email);
        
        return NextResponse.json<AcceptInvitationResponse>(
          {
            success: false,
            error: "User created with incorrect email. Please contact support.",
          },
          { status: 500 }
        );
      }
    }

    // Final validation before accepting invitation
    console.log("🔍 Final validation before accepting invitation:");
    console.log("   - Invitation ID:", invitation.id);
    console.log("   - Invitation Email:", invitation.email);
    console.log("   - User ID:", newUser.id);
    console.log("   - User Email:", newUser.email);
    console.log("   - User Clerk ID:", newUser.clerkUserId || 'None');
    console.log("   - Request Clerk ID:", clerkUserId);

    // Accept the invitation
    const acceptedInvitation = await executeTypedMutation<AcceptInvitationEnhancedMutation>(
      AcceptInvitationEnhancedDocument,
      {
        invitationId: invitation.id,
        acceptedBy: newUser.id,
      }
    );

    if (!acceptedInvitation.updateUserInvitationsByPk) {
      console.error("❌ Failed to update invitation status in database");
      return NextResponse.json<AcceptInvitationResponse>(
        {
          success: false,
          error: "Failed to complete invitation acceptance",
        },
        { status: 500 }
      );
    }

    console.log(`✅ Invitation accepted successfully: ${invitation.id}`);
    console.log(`✅ User linked: ${newUser.id} (${newUser.email})`);
    console.log(`✅ Email match verified: ${invitation.email} === ${newUser.email}`);

    return NextResponse.json<AcceptInvitationResponse>({
      success: true,
      user: newUser,
      invitation: acceptedInvitation.updateUserInvitationsByPk,
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