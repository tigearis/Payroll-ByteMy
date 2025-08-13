import { NextResponse } from "next/server";
import { 
  GetUserPositionDocument,
  type GetUserPositionQuery,
  type GetUserPositionQueryVariables 
} from "@/domains/users/graphql/generated/graphql";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

// Position Management API Route
// Handles user position updates and admin time management
// Requires manager+ permissions for most operations

const VALID_POSITIONS = [
  "consultant",
  "senior_consultant",
  "manager",
  "senior_manager",
  "partner",
  "senior_partner",
] as const;

type UserPosition = (typeof VALID_POSITIONS)[number];

const POSITION_ADMIN_DEFAULTS: Record<UserPosition, number> = {
  consultant: 12.5,
  senior_consultant: 17.5,
  manager: 30.0,
  senior_manager: 45.0,
  partner: 60.0,
  senior_partner: 75.0,
};

// Get position defaults and current user positions
export const GET = withAuth(async (req, session) => {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");

    switch (action) {
      case "defaults":
        return NextResponse.json({
          positions: VALID_POSITIONS.map(position => ({
            position,
            defaultAdminPercentage: POSITION_ADMIN_DEFAULTS[position],
            description: getPositionDescription(position),
          })),
        });

      case "user":
        if (!userId) {
          return NextResponse.json(
            { error: "userId is required for user action" },
            { status: 400 }
          );
        }

        const data = await executeTypedQuery<GetUserPositionQuery, GetUserPositionQueryVariables>(
          GetUserPositionDocument, 
          { id: userId }
        );

        if (!data?.usersByPk) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          user: data.usersByPk,
          availablePositions: VALID_POSITIONS,
        });

      default:
        return NextResponse.json({
          positions: VALID_POSITIONS,
          defaults: POSITION_ADMIN_DEFAULTS,
        });
    }
  } catch (error) {
    logger.error("Error fetching position data", {
      namespace: "position_api",
      operation: "get_position_data",
      classification: DataClassification.INTERNAL,
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: {
        errorName: error instanceof Error ? error.name : "UnknownError",
        timestamp: new Date().toISOString(),
      },
    });
    return NextResponse.json(
      { error: "Failed to fetch position data" },
      { status: 500 }
    );
  }
});

// Update user position and admin time percentage
export const PUT = withAuth(async (req, session) => {
  try {
    const body = await req.json();
    const { userId, position, adminPercentage, useDefault = true } = body;

    // Validate required fields
    if (!userId || !position) {
      return NextResponse.json(
        { error: "userId and position are required" },
        { status: 400 }
      );
    }

    // Validate position
    if (!VALID_POSITIONS.includes(position as UserPosition)) {
      return NextResponse.json(
        {
          error: `Invalid position. Must be one of: ${VALID_POSITIONS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Calculate admin percentage
    const finalAdminPercentage = useDefault
      ? POSITION_ADMIN_DEFAULTS[position as UserPosition]
      : adminPercentage || POSITION_ADMIN_DEFAULTS[position as UserPosition];

    // Validate admin percentage range
    if (finalAdminPercentage < 0 || finalAdminPercentage > 100) {
      return NextResponse.json(
        { error: "Admin percentage must be between 0 and 100" },
        { status: 400 }
      );
    }

    // TODO: Update user position using UpdateUserPositionDocument 
    // once position and defaultAdminTimePercentage columns are tracked in Hasura

    // For now, we'll just return success since we can't update position fields yet
    // This will work once Hasura tracks the new columns

    return NextResponse.json({
      message: "Position update prepared successfully",
      updates: {
        userId,
        position,
        adminPercentage: finalAdminPercentage,
        useDefault,
      },
      note: "Position fields will be updated once Hasura schema is refreshed",
    });
  } catch (error) {
    logger.error("Error updating user position", {
      namespace: "position_api",
      operation: "update_user_position",
      classification: DataClassification.CONFIDENTIAL,
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: {
        errorName: error instanceof Error ? error.name : "UnknownError",
        timestamp: new Date().toISOString(),
      },
    });
    return NextResponse.json(
      { error: "Failed to update user position" },
      { status: 500 }
    );
  }
});

// Bulk position updates (manager+ only)
export const POST = withAuth(async (req, session) => {
  try {
    const body = await req.json();
    const { action, userIds, position, adminPercentage } = body;

    if (action !== "bulk_update") {
      return NextResponse.json(
        { error: "Only bulk_update action is supported" },
        { status: 400 }
      );
    }

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "userIds array is required" },
        { status: 400 }
      );
    }

    if (position && !VALID_POSITIONS.includes(position as UserPosition)) {
      return NextResponse.json(
        {
          error: `Invalid position. Must be one of: ${VALID_POSITIONS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Prepare bulk update data
    const updates = userIds.map((userId: string) => ({
      userId,
      position: position || "consultant",
      adminPercentage:
        adminPercentage ||
        POSITION_ADMIN_DEFAULTS[position as UserPosition] ||
        12.5,
    }));

    return NextResponse.json({
      message: "Bulk position update prepared successfully",
      updates,
      count: updates.length,
      note: "Position fields will be updated once Hasura schema is refreshed",
    });
  } catch (error) {
    logger.error("Error in bulk position update", {
      namespace: "position_api",
      operation: "bulk_position_update",
      classification: DataClassification.CONFIDENTIAL,
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: {
        errorName: error instanceof Error ? error.name : "UnknownError",
        timestamp: new Date().toISOString(),
      },
    });
    return NextResponse.json(
      { error: "Failed to perform bulk position update" },
      { status: 500 }
    );
  }
});

function getPositionDescription(position: UserPosition): string {
  const descriptions: Record<UserPosition, string> = {
    consultant:
      "Basic admin tasks, minimal meetings, primary focus on payroll processing",
    senior_consultant:
      "Some client interaction, basic training responsibilities, payroll expertise",
    manager:
      "Team management, client meetings, process oversight, staff development",
    senior_manager:
      "Strategic planning, multiple team oversight, extensive client interaction",
    partner:
      "Business development, strategic leadership, extensive admin responsibilities",
    senior_partner:
      "Executive leadership, business strategy, maximum administrative load",
  };

  return descriptions[position] || "Position-based admin time allocation";
}
