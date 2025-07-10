// app/api/work-schedule/test/route.ts
import { NextRequest, NextResponse } from "next/server";
import { 
  GetAllStaffWorkloadDocument,
  type GetAllStaffWorkloadQuery 
} from "@/domains/work-schedule/graphql/generated/graphql";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";

export const GET = withAuth(
  async (req: NextRequest) => {
    try {
      console.log('Testing work schedule API endpoint...');

      // Test GraphQL query for work schedule data
      const { data, error } = await executeTypedQuery<GetAllStaffWorkloadQuery>(
        GetAllStaffWorkloadDocument,
        {}
      );

      if (error) {
        console.error('GraphQL error:', error);
        return NextResponse.json(
          { 
            error: "Failed to fetch work schedule data",
            details: error.message 
          },
          { status: 500 }
        );
      }

      const users = data?.users || [];
      console.log(`Found ${users.length} users with work schedule data`);

      // Transform data for testing
      const summary = users.map(user => ({
        id: user.id,
        name: user.name,
        role: user.role,
        workScheduleCount: user.userWorkSchedules?.length || 0,
        primaryPayrollsCount: user.primaryConsultantPayrolls?.length || 0,
        backupPayrollsCount: user.backupConsultantPayrolls?.length || 0,
        totalCapacity: user.userWorkSchedules?.reduce((sum, schedule) => 
          sum + (schedule.payrollCapacityHours || 0), 0) || 0,
      }));

      return NextResponse.json({
        success: true,
        message: "Work schedule system is working",
        data: {
          totalUsers: users.length,
          usersWithSchedules: users.filter(u => (u.userWorkSchedules?.length || 0) > 0).length,
          usersWithPayrolls: users.filter(u => 
            (u.primaryConsultantPayrolls?.length || 0) > 0 || 
            (u.backupConsultantPayrolls?.length || 0) > 0
          ).length,
          summary
        }
      });

    } catch (error) {
      console.error("Work schedule test error:", error);
      return NextResponse.json(
        { 
          error: "Failed to test work schedule system",
          details: error instanceof Error ? error.message : "Unknown error"
        },
        { status: 500 }
      );
    }
  }
);