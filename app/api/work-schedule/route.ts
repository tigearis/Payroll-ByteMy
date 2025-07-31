import { NextRequest, NextResponse } from "next/server";
import {
  GetUserWorkSchedulesDocument,
  CreateWorkScheduleDocument,
  UpdateWorkScheduleDocument,
  DeleteWorkScheduleDocument,
  type GetUserWorkSchedulesQuery,
  type CreateWorkScheduleMutation,
  type UpdateWorkScheduleMutation,
  type DeleteWorkScheduleMutation,
} from "@/domains/work-schedule/graphql/generated/graphql";
import { executeTypedQuery, executeTypedMutation } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";

// Work Schedule CRUD API Route
// Handles work schedule creation, retrieval, updates for authenticated users

export const GET = withAuth(async (req, session) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || session.userId || '';

    const data = await executeTypedQuery<GetUserWorkSchedulesQuery>(
      GetUserWorkSchedulesDocument,
      { userId }
    );

    return NextResponse.json({
      schedules: data.workSchedule || [],
      count: data.workSchedule?.length || 0
    });

  } catch (error) {
    console.error('Error fetching work schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work schedules' },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (req, session) => {
  try {
    const body = await req.json();
    const { userId = session.userId || '', workDay, workHours, adminTimeHours, payrollCapacityHours, usesDefaultAdminTime } = body;

    // Validate required fields
    if (!workDay || workHours === undefined) {
      return NextResponse.json(
        { error: 'workDay and workHours are required' },
        { status: 400 }
      );
    }

    // Validate workHours range
    if (workHours < 0 || workHours > 24) {
      return NextResponse.json(
        { error: 'workHours must be between 0 and 24' },
        { status: 400 }
      );
    }

    const data = await executeTypedMutation<CreateWorkScheduleMutation>(
      CreateWorkScheduleDocument,
      {
        object: {
          userId,
          workDay,
          workHours,
          adminTimeHours: adminTimeHours || 0,
          payrollCapacityHours: payrollCapacityHours || workHours,
          usesDefaultAdminTime: usesDefaultAdminTime ?? true,
        }
      }
    );

    return NextResponse.json({
      schedule: data.insertWorkScheduleOne,
      message: 'Work schedule created successfully'
    });

  } catch (error) {
    console.error('Error creating work schedule:', error);
    return NextResponse.json(
      { error: 'Failed to create work schedule' },
      { status: 500 }
    );
  }
});

export const PUT = withAuth(async (req, session) => {
  try {
    const body = await req.json();
    const { id, workHours, workDay, adminTimeHours, payrollCapacityHours, usesDefaultAdminTime } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Schedule ID is required' },
        { status: 400 }
      );
    }

    // Validate workHours if provided
    if (workHours !== undefined && (workHours < 0 || workHours > 24)) {
      return NextResponse.json(
        { error: 'workHours must be between 0 and 24' },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (workHours !== undefined) updateData.workHours = workHours;
    if (workDay) updateData.workDay = workDay;
    if (adminTimeHours !== undefined) updateData.adminTimeHours = adminTimeHours;
    if (payrollCapacityHours !== undefined) updateData.payrollCapacityHours = payrollCapacityHours;
    if (usesDefaultAdminTime !== undefined) updateData.usesDefaultAdminTime = usesDefaultAdminTime;

    const data = await executeTypedMutation<UpdateWorkScheduleMutation>(
      UpdateWorkScheduleDocument,
      {
        id,
        set: updateData
      }
    );

    return NextResponse.json({
      schedule: data.updateWorkScheduleByPk,
      message: 'Work schedule updated successfully'
    });

  } catch (error) {
    console.error('Error updating work schedule:', error);
    return NextResponse.json(
      { error: 'Failed to update work schedule' },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (req, session) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Schedule ID is required' },
        { status: 400 }
      );
    }

    const data = await executeTypedMutation<DeleteWorkScheduleMutation>(
      DeleteWorkScheduleDocument,
      { id }
    );

    return NextResponse.json({
      deleted: data.deleteWorkScheduleByPk,
      message: 'Work schedule deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting work schedule:', error);
    return NextResponse.json(
      { error: 'Failed to delete work schedule' },
      { status: 500 }
    );
  }
});