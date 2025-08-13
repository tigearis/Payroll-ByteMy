import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import {
  GetUserByEmailDocument,
  GetUserByClerkIdDocument,
  type GetUserByEmailQuery,
  type GetUserByEmailQueryVariables,
  type GetUserByClerkIdQuery,
  type GetUserByClerkIdQueryVariables,
} from "@/domains/users/graphql/generated/graphql";

export async function GET(request: NextRequest) {
  try {
    const authResult = await auth();
    const userId = authResult.userId;
    
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found in Clerk" }, { status: 404 });
    }

    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    
    console.log(`🔍 Debug lookup for Clerk ID: ${userId}, Email: ${userEmail}`);

    // Try both lookups
    const [clerkIdResult, emailResult] = await Promise.allSettled([
      executeTypedQuery<GetUserByClerkIdQuery, GetUserByClerkIdQueryVariables>(
        GetUserByClerkIdDocument, 
        { clerkUserId: userId }
      ),
      executeTypedQuery<GetUserByEmailQuery, GetUserByEmailQueryVariables>(
        GetUserByEmailDocument, 
        { email: userEmail }
      )
    ]);

    return NextResponse.json({
      clerkUserId: userId,
      userEmail,
      lookups: {
        byClerkId: {
          status: clerkIdResult.status,
          result: clerkIdResult.status === 'fulfilled' ? clerkIdResult.value : clerkIdResult.reason?.message,
        },
        byEmail: {
          status: emailResult.status,
          result: emailResult.status === 'fulfilled' ? emailResult.value : emailResult.reason?.message,
        }
      },
      clerkMetadata: {
        publicMetadata: user.publicMetadata,
        privateMetadata: user.privateMetadata
      }
    });
  } catch (error) {
    console.error("❌ Debug lookup error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}