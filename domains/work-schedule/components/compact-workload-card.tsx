"use client";

import { format, startOfWeek, addDays, parseISO, isSameDay } from "date-fns";
import { Calendar, Clock, TrendingUp, Briefcase, AlertTriangle } from "lucide-react";
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Types
interface WorkloadDay {
  date: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  assignments: Array<{
    id: string;
    name: string;
    processingTime: number;
    clientName: string;
    status: string;
    priority: string;
  }>;
}

interface CompactWorkloadCardProps {
  member: {
    id: string;
    name: string;
    position: string;
    capacity?: {
      utilizationPercentage: number;
      totalPayrollCapacity: number;
      currentlyAssignedHours: number;
      availableCapacityHours: number;
    };
  };
  workSchedule: WorkloadDay[];
  viewMode?: "week" | "month";
  loading?: boolean;
  error?: string;
  onAssignmentClick?: (assignment: any) => void;
}

// Chart colors
const CHART_COLORS = {
  available: "#e5e7eb",
  optimal: "#10b981",
  high: "#f59e0b", 
  overallocated: "#ef4444",
  overflow: "#dc2626"
};

// Custom tooltip component
const CompactTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  const assignments = data.assignments || [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-48">
      <div className="font-medium text-sm mb-2">{label}</div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Capacity:</span>
          <span className="font-medium">{data.capacity}h</span>
        </div>
        <div className="flex justify-between">
          <span>Assigned:</span>
          <span className="font-medium">{data.assigned.toFixed(1)}h</span>
        </div>
        <div className="flex justify-between">
          <span>Utilization:</span>
          <span className={cn(
            "font-medium",
            data.utilization > 100 ? "text-red-600" : 
            data.utilization > 85 ? "text-yellow-600" : "text-green-600"
          )}>
            {data.utilization}%
          </span>
        </div>
        {assignments.length > 0 && (
          <div className="border-t pt-2 mt-2">
            <div className="font-medium mb-1">{assignments.length} assignments</div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CompactWorkloadCard: React.FC<CompactWorkloadCardProps> = ({
  member,
  workSchedule = [],
  viewMode = "week",
  loading = false,
  error = null,
  onAssignmentClick
}) => {
  // Process workload data for chart
  const chartData = useMemo(() => {
    if (!workSchedule.length) return [];

    const currentDate = new Date();
    const startWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

    // Generate 7 days for week view
    const weekData = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(startWeek, i);
      const dayData = workSchedule.find(ws => 
        isSameDay(parseISO(ws.date), date)
      );

      const totalAssigned = dayData?.assignments?.reduce(
        (sum, assignment) => sum + assignment.processingTime, 0
      ) || 0;
      
      const capacity = dayData?.payrollCapacityHours || 0;
      const utilization = capacity ? Math.round((totalAssigned / capacity) * 100) : 0;

      weekData.push({
        period: format(date, "EEE"),
        capacity,
        assigned: totalAssigned,
        utilization,
        utilizationHours: Math.min(totalAssigned, capacity),
        overflowHours: Math.max(0, totalAssigned - capacity),
        assignments: dayData?.assignments || []
      });
    }

    return weekData;
  }, [workSchedule]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalCapacity = chartData.reduce((sum, day) => sum + day.capacity, 0);
    const totalAssigned = chartData.reduce((sum, day) => sum + day.assigned, 0);
    const avgUtilization = chartData.length > 0 
      ? Math.round(chartData.reduce((sum, day) => sum + day.utilization, 0) / chartData.length)
      : 0;
    const overallocatedDays = chartData.filter(day => day.utilization > 100).length;

    return {
      totalCapacity: Math.round(totalCapacity),
      totalAssigned: Math.round(totalAssigned * 10) / 10,
      avgUtilization,
      overallocatedDays,
      underutilizedDays: chartData.filter(day => day.utilization < 70).length
    };
  }, [chartData]);

  if (loading) {
    return (
      <Card className="h-[400px] flex flex-col">
        <CardContent className="p-4 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-[400px] flex flex-col">
        <CardContent className="p-4 flex-1 flex items-center justify-center">
          <div className="text-center text-red-600">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Failed to load data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[400px] flex flex-col border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-3 border-b bg-gray-50/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-base text-gray-900">{member.name}</h3>
            <p className="text-xs text-gray-600 capitalize">{member.position}</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            Chart View
          </Badge>
        </div>
      </div>

      <CardContent className="p-3 flex-1 flex flex-col space-y-3">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-4 gap-2 flex-shrink-0">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-blue-600" />
              <span className="font-semibold text-sm text-blue-600">{stats.totalCapacity}h</span>
            </div>
            <p className="text-xs text-gray-500">Capacity</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Briefcase className="w-3 h-3 text-green-600" />
              <span className="font-semibold text-sm text-green-600">{stats.totalAssigned}h</span>
            </div>
            <p className="text-xs text-gray-500">Assigned</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-purple-600" />
              <span className="font-semibold text-sm text-purple-600">{stats.avgUtilization}%</span>
            </div>
            <p className="text-xs text-gray-500">Utilization</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <AlertTriangle className={cn(
                "w-3 h-3",
                stats.overallocatedDays > 0 ? "text-red-600" : "text-gray-400"
              )} />
              <span className={cn(
                "font-semibold text-sm",
                stats.overallocatedDays > 0 ? "text-red-600" : "text-gray-400"
              )}>
                {stats.overallocatedDays}
              </span>
            </div>
            <p className="text-xs text-gray-500">Over</p>
          </div>
        </div>

        {/* Chart Area */}
        <div className="flex-1 min-h-[200px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
              >
                <XAxis
                  dataKey="period"
                  fontSize={10}
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  fontSize={9}
                  tick={{ fontSize: 9, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={{ stroke: "#e5e7eb" }}
                  tickFormatter={(value) => `${value}h`}
                  width={25}
                />
                <Tooltip content={<CompactTooltip />} />
                
                {/* Capacity background bars */}
                <Bar
                  dataKey="capacity"
                  fill={CHART_COLORS.available}
                  radius={[2, 2, 0, 0]}
                  stackId="capacity"
                />
                
                {/* Utilization bars with color coding */}
                <Bar
                  dataKey="utilizationHours"
                  radius={[2, 2, 0, 0]}
                  stackId="capacity"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.utilization > 100 ? CHART_COLORS.overallocated :
                        entry.utilization > 85 ? CHART_COLORS.high :
                        CHART_COLORS.optimal
                      }
                    />
                  ))}
                </Bar>
                
                {/* Overflow bars */}
                <Bar
                  dataKey="overflowHours"
                  fill={CHART_COLORS.overflow}
                  radius={[2, 2, 0, 0]}
                  stackId="capacity"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No workload data</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Status */}
        <div className="flex-shrink-0 text-center">
          <p className="text-xs text-gray-600">
            Underutilized periods: <span className="font-medium">{stats.underutilizedDays}</span>
            <span className="mx-2">•</span>
            Trend: <span className="font-medium">→ Stable</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactWorkloadCard;