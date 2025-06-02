import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { adminApolloClient } from "@/lib/server-apollo-client";
import { gql } from "@apollo/client";

// Same queries as used in the staff page
const GET_STAFF_LIST = gql`
  query GetStaffList {
    users(where: { is_staff: { _eq: true } }) {
      id
      name
      email
      role
      username
      image
      is_staff
      manager_id
      clerk_user_id
      created_at
      updated_at
      manager {
        id
        name
        email
        role
      }
    }
  }
`;

const GET_ALL_USERS_LIST = gql`
  query GetAllUsersList {
    users {
      id
      name
      email
      role
      username
      image
      is_staff
      manager_id
      clerk_user_id
      created_at
      updated_at
      manager {
        id
        name
        email
        role
      }
    }
  }
`;

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("🧪 Testing staff queries...");

    // Test staff query
    console.log("📝 Testing GET_STAFF_LIST...");
    const { data: staffData } = await adminApolloClient.query({
      query: GET_STAFF_LIST,
      fetchPolicy: "no-cache",
    });

    console.log("📝 Testing GET_ALL_USERS_LIST...");
    const { data: allUsersData } = await adminApolloClient.query({
      query: GET_ALL_USERS_LIST,
      fetchPolicy: "no-cache",
    });

    // Validate IDs
    const validateUsers = (users: any[], queryName: string) => {
      const invalidUsers: any[] = [];
      const validUsers: any[] = [];
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      users.forEach((user: any) => {
        const isValidUUID = uuidRegex.test(user.id);
        if (isValidUUID) {
          validUsers.push({
            id: user.id,
            name: user.name,
            clerk_user_id: user.clerk_user_id,
          });
        } else {
          invalidUsers.push({
            id: user.id,
            name: user.name,
            clerk_user_id: user.clerk_user_id,
            error: "Invalid UUID format",
          });
          console.error(`❌ Invalid UUID in ${queryName}:`, user.id);
        }
      });

      return { validUsers, invalidUsers };
    };

    const staffValidation = validateUsers(
      staffData?.users || [],
      "GET_STAFF_LIST"
    );
    const allUsersValidation = validateUsers(
      allUsersData?.users || [],
      "GET_ALL_USERS_LIST"
    );

    const response = {
      success: true,
      queries: {
        staff: {
          totalUsers: staffData?.users?.length || 0,
          validUsers: staffValidation.validUsers.length,
          invalidUsers: staffValidation.invalidUsers.length,
          invalidDetails: staffValidation.invalidUsers,
          sampleUsers: staffValidation.validUsers.slice(0, 3),
        },
        allUsers: {
          totalUsers: allUsersData?.users?.length || 0,
          validUsers: allUsersValidation.validUsers.length,
          invalidUsers: allUsersValidation.invalidUsers.length,
          invalidDetails: allUsersValidation.invalidUsers,
          sampleUsers: allUsersValidation.validUsers.slice(0, 3),
        },
      },
      timestamp: new Date().toISOString(),
    };

    console.log("📊 Query test results:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Error testing staff queries:", error);
    return NextResponse.json(
      {
        error: "Failed to test staff queries",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
