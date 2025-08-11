import { NextResponse } from "next/server";
import {
  BulkCreateWorkScheduleDocument,
  BulkUpdateWorkScheduleCapacityDocument,
  DeleteWorkScheduleDocument,
  type BulkCreateWorkScheduleMutation,
  type BulkUpdateWorkScheduleCapacityMutation,
  type DeleteWorkScheduleMutation,
} from "@/domains/work-schedule/graphql/generated/graphql";
import { executeTypedMutation } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";
// import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

// Bulk Work Schedule Operations API Route
// Handles batch creation, updates, and deletion of work schedules

export const POST = withAuth(async (req, session) => {
  try {
    const body = await req.json();
    const {
      action,
      schedules,
      userIds,
      workDay,
      workHours,
      adminTimeHours,
      payrollCapacityHours,
      scheduleIds,
    } = body;

    switch (action) {
      case "bulk_create":
        return await handleBulkCreate(schedules, session.userId);

      case "bulk_update":
        return await handleBulkUpdate(
          userIds,
          workDay,
          workHours,
          adminTimeHours,
          payrollCapacityHours
        );

      case "bulk_delete":
        return await handleBulkDelete(scheduleIds);

      default:
        return NextResponse.json(
          {
            error:
              "Invalid action. Use: bulk_create, bulk_update, or bulk_delete",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in bulk work schedule operation:", error);
    return NextResponse.json(
      { error: "Failed to perform bulk operation" },
      { status: 500 }
    );
  }
});

async function handleBulkCreate(schedules: any[], defaultUserId: string) {
  if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
    return NextResponse.json(
      { error: "schedules array is required" },
      { status: 400 }
    );
  }

  // Validate and prepare schedules
  const validatedSchedules = schedules.map(schedule => {
    const {
      userId = defaultUserId,
      workDay,
      workHours,
      adminTimeHours,
      payrollCapacityHours,
      usesDefaultAdminTime,
    } = schedule;

    if (!workDay || workHours === undefined) {
      throw new Error("Each schedule must have workDay and workHours");
    }

    if (workHours < 0 || workHours > 24) {
      throw new Error("workHours must be between 0 and 24");
    }

    return {
      userId,
      workDay,
      workHours,
      adminTimeHours: adminTimeHours || 0,
      payrollCapacityHours: payrollCapacityHours || workHours,
      usesDefaultAdminTime: usesDefaultAdminTime ?? true,
    };
  });

  const data = await executeTypedMutation<BulkCreateWorkScheduleMutation>(
    BulkCreateWorkScheduleDocument,
    { schedules: validatedSchedules }
  );

  return NextResponse.json({
    schedules: data.insertWorkSchedule?.returning || [],
    created: data.insertWorkSchedule?.affectedRows || 0,
    message: `Created ${data.insertWorkSchedule?.affectedRows || 0} work schedules`,
  });
}

async function handleBulkUpdate(
  userIds: string[],
  workDay: string,
  workHours: number,
  adminTimeHours?: number,
  payrollCapacityHours?: number
) {
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return NextResponse.json(
      { error: "userIds array is required" },
      { status: 400 }
    );
  }

  if (!workDay || workHours === undefined) {
    return NextResponse.json(
      { error: "workDay and workHours are required" },
      { status: 400 }
    );
  }

  if (workHours < 0 || workHours > 24) {
    return NextResponse.json(
      { error: "workHours must be between 0 and 24" },
      { status: 400 }
    );
  }

  const data =
    await executeTypedMutation<BulkUpdateWorkScheduleCapacityMutation>(
      BulkUpdateWorkScheduleCapacityDocument,
      {
        userIds,
        workDay,
        workHours,
        adminTimeHours: adminTimeHours || 0,
        payrollCapacityHours: payrollCapacityHours || workHours,
      }
    );

  return NextResponse.json({
    schedules: data.updateWorkSchedule?.returning || [],
    updated: data.updateWorkSchedule?.affectedRows || 0,
    message: `Updated ${data.updateWorkSchedule?.affectedRows || 0} work schedules`,
  });
}

async function handleBulkDelete(scheduleIds: string[]) {
  if (!scheduleIds || !Array.isArray(scheduleIds) || scheduleIds.length === 0) {
    return NextResponse.json(
      { error: "scheduleIds array is required" },
      { status: 400 }
    );
  }

  // For bulk delete, we'll execute multiple individual delete operations
  const deletedIds: string[] = [];

  for (const id of scheduleIds) {
    try {
      const data = await executeTypedMutation<DeleteWorkScheduleMutation>(
        DeleteWorkScheduleDocument,
        { id }
      );

      if (data.deleteWorkScheduleByPk) {
        deletedIds.push(data.deleteWorkScheduleByPk.id);
      }
    } catch (error) {
      console.error(`Failed to delete schedule ${id}:`, error);
      // Continue with other deletes
    }
  }

  return NextResponse.json({
    deleted: deletedIds.length,
    deletedIds,
    message: `Deleted ${deletedIds.length} work schedules`,
  });
}
