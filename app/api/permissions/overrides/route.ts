import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/api-auth";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";
import { 
  createPermissionOverrideWithSync,
  deletePermissionOverrideWithSync,
  type UserRole 
} from "@/lib/permissions/hierarchical-permissions";

interface CreateOverrideRequest {
  userId: string;
  clerkUserId: string;
  userRole: UserRole;
  resource: string;
  operation: string;
  granted: boolean;
  reason: string;
}

interface DeleteOverrideRequest {
  overrideId: string;
  userId: string;
  clerkUserId: string;
  userRole: UserRole;
}

export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    // Debug environment variable availability
    console.log('🔍 Environment check in API route:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- CLERK_SECRET_KEY present:', !!process.env.CLERK_SECRET_KEY);
    console.log('- CLERK_SECRET_KEY length:', process.env.CLERK_SECRET_KEY?.length || 0);

    // Check if user has permission to manage permissions
    const userRole = session.role || session.defaultRole || 'viewer';
    if (!userRole || !['developer', 'org_admin'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions to manage permission overrides' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, ...data } = body;

    if (action === 'create') {
      const { userId, clerkUserId, userRole, resource, operation, granted, reason } = data as CreateOverrideRequest;
      
      if (!userId || !clerkUserId || !userRole || !resource || !operation || typeof granted !== 'boolean') {
        return NextResponse.json(
          { success: false, error: 'Missing required fields for creating permission override' },
          { status: 400 }
        );
      }

      console.log(`🔄 Creating permission override for ${resource}.${operation} = ${granted} for user ${userId}`);
      
      await createPermissionOverrideWithSync(
        userId,
        clerkUserId,
        userRole,
        resource,
        operation,
        granted,
        reason || 'Updated via permissions UI'
      );

      return NextResponse.json({
        success: true,
        message: `Successfully ${granted ? 'granted' : 'revoked'} ${resource}.${operation}`
      });

    } else if (action === 'delete') {
      const { overrideId, userId, clerkUserId, userRole } = data as DeleteOverrideRequest;
      
      if (!overrideId || !userId || !clerkUserId || !userRole) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields for deleting permission override' },
          { status: 400 }
        );
      }

      console.log(`🔄 Deleting permission override ${overrideId} for user ${userId}`);
      
      await deletePermissionOverrideWithSync(
        overrideId,
        userId,
        clerkUserId,
        userRole
      );

      return NextResponse.json({
        success: true,
        message: 'Successfully removed permission override'
      });

    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be "create" or "delete"' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('❌ Permission override API error:', error);
    
    // Extract meaningful error message
    let errorMessage = 'Unknown error occurred';
    if (error.message) {
      if (error.message.includes('CLERK_SECRET_KEY')) {
        errorMessage = 'Clerk configuration error - please check server environment variables';
      } else if (error.message.includes('Failed to sync permissions to Clerk')) {
        errorMessage = 'Failed to sync permissions with authentication provider';
      } else if (error.message.includes('Failed to create permission override')) {
        errorMessage = error.message;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
});