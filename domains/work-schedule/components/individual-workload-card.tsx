"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkloadState } from "../hooks";
import { 
  SingleMemberVisualization,
  type SingleMemberVisualizationProps 
} from "./payroll-workload-dashboard";
import { SimpleTimeNavigation } from "./simple-time-navigation";

// Import the single member visualization from the dashboard

interface WorkloadDay {
  date: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  assignments: Array<{
    id: string;
    name: string;
    processingTime: number;
    processingDaysBeforeEft: number;
    eftDate: string;
    status: string;
    priority: string;
  }>;
}

interface IndividualWorkloadCardProps {
  userId: string;
  userName: string;
  userRole: string;
  workSchedule: WorkloadDay[];
  onAssignmentClick?: (assignment: any) => void;
}

export const IndividualWorkloadCard: React.FC<IndividualWorkloadCardProps> = ({
  userId,
  userName,
  userRole,
  workSchedule,
  onAssignmentClick
}) => {
  // Local state for this individual card - fixed to chart view only
  const { state, actions } = useWorkloadState({
    initialState: {
      selectedView: "chart",
      viewPeriod: "week",
      currentDate: new Date(),
    },
  });

  const member = {
    userId,
    userName,
    userRole,
    email: undefined,
    avatarUrl: undefined,
    isActive: true,
    workSchedule,
    skills: undefined,
    managerId: undefined,
  };

  return (
    <div className="space-y-4">
      {/* Individual Time Navigation for this card */}
      <Card className="bg-gray-50/30 border-gray-200">
        <CardContent className="p-3">
          <div className="text-center mb-3">
            <h3 className="font-semibold text-lg text-gray-900">{userName}</h3>
            <p className="text-sm text-gray-600 capitalize">{userRole}</p>
          </div>
          
          <SimpleTimeNavigation
            viewPeriod={state.viewPeriod}
            currentDate={state.currentDate}
            onPeriodChange={actions.setViewPeriod}
            onDateChange={actions.setCurrentDate}
            onNavigate={actions.navigatePeriod}
            className="space-y-2"
          />
        </CardContent>
      </Card>

      {/* Member visualization content */}
      <div className="min-h-[500px]">
        <SingleMemberVisualization
          member={member}
          viewPeriod={state.viewPeriod}
          currentDate={state.currentDate}
          selectedView="chart"
          onAssignmentClick={onAssignmentClick}
        />
      </div>
    </div>
  );
};

export default IndividualWorkloadCard;