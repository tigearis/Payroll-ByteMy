"use client";

import React, { useMemo, useCallback, useState, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkloadChartProps, WorkloadPeriodData, PayrollAssignment, COLOR_THEME } from "../types/workload";

const WorkloadChart: React.FC<WorkloadChartProps> = ({
  data,
  viewPeriod,
  height = 300,
  showLegend = true,
  onBarClick,
  onAssignmentClick,
  className,
}) => {
  const [clickedPeriod, setClickedPeriod] = useState<WorkloadPeriodData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside tooltip to dismiss it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setClickedPeriod(null);
      }
    };

    if (clickedPeriod) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [clickedPeriod]);

  // Interactive tooltip component that shows on click
  const InteractiveTooltip = useCallback(() => {
    if (!clickedPeriod) return null;

    const assignments = clickedPeriod.assignments || [];

    return (
      <div
        ref={tooltipRef}
        className="absolute bg-white border border-gray-200 rounded-lg shadow-xl min-w-80 max-w-96 z-50"
        style={{
          left: tooltipPosition.x,
          top: tooltipPosition.y,
          transform: 'translate(-50%, -100%)',
        }}
      >
        <div className="p-4">
          <div className="space-y-3">
            {/* Header with close button */}
            <div className="flex items-center justify-between border-b pb-2">
              <div className="font-medium text-base">
                {clickedPeriod.period}
              </div>
              <button
                onClick={() => setClickedPeriod(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close tooltip"
              >
                ✕
              </button>
            </div>

            {/* Capacity Info */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Capacity:</span>
                <span className="font-medium">{clickedPeriod.payrollCapacityHours}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Assigned:</span>
                <span className="font-medium">{clickedPeriod.assignedHours.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Utilization:</span>
                <span
                  className={cn(
                    "font-medium",
                    clickedPeriod.utilization > 100 ? "text-red-600" : 
                    clickedPeriod.utilization > 85 ? "text-yellow-600" : 
                    "text-green-600"
                  )}
                >
                  {clickedPeriod.utilization}%
                </span>
              </div>
            </div>

            {/* Assignments */}
            {assignments.length > 0 && (
              <div className="border-t pt-3">
                <div className="font-medium text-sm mb-2">
                  Assignments ({assignments.length}):
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
                  {assignments.map((assignment: PayrollAssignment, idx: number) => (
                    <div
                      key={`tooltip-${assignment.id}-${idx}`}
                      className={cn(
                        "flex justify-between items-center text-xs p-2 rounded transition-colors border border-gray-100",
                        onAssignmentClick && "cursor-pointer hover:bg-blue-50 hover:border-blue-200"
                      )}
                      onClick={(e) => {
                        if (onAssignmentClick) {
                          e.stopPropagation();
                          onAssignmentClick(assignment);
                          setClickedPeriod(null); // Close tooltip after clicking assignment
                        }
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-blue-600">
                          {assignment.name}
                        </div>
                        <div className="text-muted-foreground truncate">
                          {assignment.clientName}
                        </div>
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <div className="font-medium">
                          {assignment.processingTime.toFixed(1)}h
                        </div>
                        <div className="text-muted-foreground text-xs capitalize">
                          {assignment.priority}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action hint */}
            <div className="text-xs text-muted-foreground border-t pt-2">
              {onAssignmentClick && assignments.length > 0 && "Click assignments to view details • "}
              Click outside to close
            </div>
          </div>
        </div>
      </div>
    );
  }, [clickedPeriod, tooltipPosition, onAssignmentClick]);

  // Legend data
  const legendData = useMemo(() => [
    { value: "Available Capacity", type: "square", color: COLOR_THEME.capacity },
    { value: "Optimal (< 85%)", type: "square", color: COLOR_THEME.optimal },
    { value: "High (85-100%)", type: "square", color: COLOR_THEME.high },
    { value: "Overallocated (> 100%)", type: "square", color: COLOR_THEME.overallocated },
    { value: "Overflow", type: "square", color: COLOR_THEME.overflow },
  ], []);

  // Chart margin based on view period - optimized for more space
  const chartMargin = useMemo(() => ({
    top: 5,
    right: 10,
    left: 15,
    bottom: viewPeriod === "day" ? 30 : viewPeriod === "week" ? 45 : 35,
  }), [viewPeriod]);

  // Handle bar click to show interactive tooltip
  const handleBarClick = useCallback((data: any, event?: any) => {
    if (data?.payload) {
      // Call the original onBarClick callback if provided
      if (onBarClick) {
        onBarClick(data.payload);
      }
      
      // Show our interactive tooltip
      const periodData = data.payload as WorkloadPeriodData;
      setClickedPeriod(periodData);
      
      // Position tooltip based on click position or center of container
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = event?.clientX || rect.left + rect.width / 2;
        const y = event?.clientY || rect.top + 50;
        setTooltipPosition({
          x: x - rect.left,
          y: y - rect.top - 10
        });
      }
    }
  }, [onBarClick]);

  if (!data || data.length === 0) {
    return (
      <div className={cn("flex items-center justify-center bg-muted/20 rounded-lg", className)}>
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-2">No data available</div>
          <div className="text-muted-foreground text-sm">
            No workload data found for the selected period
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full relative", className)} ref={containerRef}>
      <div className="w-full h-full bg-muted/20 rounded-lg p-3">
        <ResponsiveContainer width="100%" height={height - 24}> {/* Account for padding */}
          <BarChart
            data={data}
            margin={chartMargin}
            onClick={handleBarClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            
            {/* X-Axis */}
            <XAxis
              dataKey="period"
              fontSize={10}
              angle={viewPeriod === "day" ? 0 : viewPeriod === "week" ? -35 : 0}
              textAnchor={viewPeriod === "day" ? "middle" : viewPeriod === "week" ? "end" : "middle"}
              height={viewPeriod === "day" ? 30 : viewPeriod === "week" ? 50 : 35}
              interval={0}
              tick={{ fontSize: 10, fill: "#666" }}
              tickLine={{ stroke: "#e0e0e0" }}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            
            {/* Y-Axis */}
            <YAxis
              fontSize={9}
              tick={{ fontSize: 9, fill: "#666" }}
              axisLine={{ stroke: "#e0e0e0" }}
              tickLine={{ stroke: "#e0e0e0" }}
              tickFormatter={(value) => `${value}h`}
              domain={[0, "dataMax"]}
              width={30}
            />
            
            {/* Legend */}
            {showLegend && (
              <Legend
                payload={legendData}
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="square"
              />
            )}

            {/* Bars */}
            {/* Capacity background bar */}
            <Bar
              dataKey="payrollCapacityHours"
              fill={COLOR_THEME.capacity}
              name="Total Capacity"
              radius={[2, 2, 0, 0]}
              stackId="capacity"
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            />
            
            {/* Utilization foreground bar */}
            <Bar
              dataKey="utilizationHours"
              name="Utilized Hours"
              radius={[2, 2, 0, 0]}
              stackId="capacity"
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.utilization > 100
                      ? COLOR_THEME.overallocated
                      : entry.utilization > 85
                        ? COLOR_THEME.high
                        : COLOR_THEME.optimal
                  }
                />
              ))}
            </Bar>
            
            {/* Overflow bar for overallocation */}
            <Bar
              dataKey="overflowHours"
              name="Overallocated Hours"
              radius={[2, 2, 0, 0]}
              stackId="capacity"
              fill={COLOR_THEME.overflow}
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive tooltip */}
      <InteractiveTooltip />

      {/* Accessibility info */}
      <div className="sr-only">
        Chart showing workload utilization over {data.length} {viewPeriod}s.
        {data.filter(d => d.isOverallocated).length > 0 && 
          ` ${data.filter(d => d.isOverallocated).length} periods are overallocated.`
        }
        Click on bars to view detailed assignment information.
      </div>
    </div>
  );
};

export default React.memo(WorkloadChart);