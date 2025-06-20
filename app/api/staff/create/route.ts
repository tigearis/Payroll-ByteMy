import { handleApiError, createSuccessResponse } from "@/lib/shared/error-handling";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { withEnhancedAuth } from "@/lib/auth/enhanced-api-auth";
import { z } from "zod";

// Input validation schema
const CreateStaffSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["developer", "org_admin", "manager", "consultant", "viewer"]).default("viewer"),
  is_staff: z.boolean().default(true),
  managerId: z.string().uuid().optional().nullable(),
  inviteToClerk: z.boolean().default(true)
});

type CreateStaffInput = z.infer<typeof CreateStaffSchema>;

// Enhanced auth staff creation using enhanced permissions
export const POST = withEnhancedAuth(
  async (request: NextRequest, context) => {
    try {

    // Validate input
    const body = await request.json();
    const validationResult = CreateStaffSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return NextResponse.json({
        error: "Validation failed",
        details: errors
      }, { status: 400 });
    }
    
    const staffInput = validationResult.data;
    
    // Send Clerk invitation if requested
    let invitationId = null;
    
    if (staffInput.inviteToClerk) {
      try {
        const client = await clerkClient();
        const invitation = await client.invitations.createInvitation({
          emailAddress: staffInput.email,
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation`,
          publicMetadata: {
            role: staffInput.role,
            isStaff: staffInput.is_staff,
            managerId: staffInput.managerId,
            invitedBy: context.userId,
            name: staffInput.name
          },
          notify: true
        });
        
        invitationId = invitation.id;
        console.log(`✅ Sent Clerk invitation: ${invitationId}`);
        
      } catch (error) {
        console.error("Clerk invitation error:", error);
        // Continue without Clerk invitation but log the error
        console.log("⚠️ Continuing with database creation without Clerk invitation");
      }
    }
    
    // Return success response with invitation details
    return NextResponse.json({
      success: true,
      message: "Staff member creation initiated",
      data: {
        invitationId: invitationId,
        email: staffInput.email,
        role: staffInput.role,
        inviteToClerk: staffInput.inviteToClerk
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error("Staff creation error:", error);
    return handleApiError(error, "staff");
  }
},
{
  permission: "custom:staff:write"
}
);