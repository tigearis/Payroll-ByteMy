import { handleApiError, createSuccessResponse } from "@/lib/shared/error-handling";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { MetadataManager } from "@/lib/auth/metadata-manager.server";

export async function GET(request: NextRequest) {
  try {
    // Use native Clerk auth protection
    const { userId, sessionClaims, getToken } = await auth.protect();

    // Extract role using the centralized MetadataManager
    const userRole = MetadataManager.extractUserRole({
      publicMetadata: sessionClaims?.metadata,
    });

    // Get Hasura token using native template
    const token = await getToken({ template: "hasura" });

    return NextResponse.json({
      success: true,
      userId,
      role: userRole,
      hasToken: !!token,
      debug: {
        metadataRole: sessionClaims?.metadata?.role,
        sessionId: sessionClaims?.sid,
      },
    });
  } catch (error) {
    return handleApiError(error, "check-role");
  },
      { status: 500 }
    );
  }
}
