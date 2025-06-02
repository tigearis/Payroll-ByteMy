import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { adminApolloClient } from "@/lib/server-apollo-client";
import { gql } from "@apollo/client";

// Query to get all user IDs and check their format
const GET_ALL_USER_IDS = gql`
  query GetAllUserIds {
    users {
      id
      name
      email
      clerk_user_id
      created_at
    }
  }
`;

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("🔍 Checking all user IDs for validity...");

    const { data } = await adminApolloClient.query({
      query: GET_ALL_USER_IDS,
      fetchPolicy: "no-cache",
    });

    const users = data?.users || [];
    const invalidUsers: any[] = [];
    const validUsers: any[] = [];

    // UUID validation regex
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    users.forEach((user: any) => {
      const isValidUUID = uuidRegex.test(user.id);
      if (isValidUUID) {
        validUsers.push({
          id: user.id,
          name: user.name,
          email: user.email,
          clerk_user_id: user.clerk_user_id,
        });
      } else {
        invalidUsers.push({
          id: user.id,
          name: user.name,
          email: user.email,
          clerk_user_id: user.clerk_user_id,
          idLength: user.id?.length,
          idStartsWith: user.id?.substring(0, 10),
        });
        console.error("❌ Invalid UUID found:", user.id);
      }
    });

    const summary = {
      totalUsers: users.length,
      validUsers: validUsers.length,
      invalidUsers: invalidUsers.length,
      details: {
        invalidUsersList: invalidUsers,
        sampleValidUsers: validUsers.slice(0, 3), // Just show first 3 valid ones
      },
    };

    console.log("📊 User ID validation summary:", summary);

    return NextResponse.json(summary);
  } catch (error) {
    console.error("❌ Error checking user IDs:", error);
    return NextResponse.json(
      {
        error: "Failed to check user IDs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
