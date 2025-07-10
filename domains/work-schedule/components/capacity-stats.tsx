"use client";

import { Clock, Briefcase, TrendingUp, AlertTriangle, TrendingDown, Minus } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { CapacityStatsProps, UtilizationTrend } from "../types/workload";

const CapacityStats: React.FC<CapacityStatsProps> = ({
  summary,
  compact = false,
  showTrend = true,
  className,
}) => {
  const {
    totalCapacity,
    totalAssigned,
    avgUtilization,
    overallocatedPeriods,
    utilizationTrend,
    underutilizedPeriods,
  } = summary;

  const getTrendIcon = (trend: UtilizationTrend) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="w-3 h-3" />;
      case "decreasing":
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const getTrendColor = (trend: UtilizationTrend) => {
    switch (trend) {
      case "increasing":
        return "text-green-600";
      case "decreasing":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 70) return "text-gray-600";
    if (utilization <= 85) return "text-green-600";
    if (utilization <= 100) return "text-yellow-600";
    return "text-red-600";
  };

  const getUtilizationBgColor = (utilization: number) => {
    if (utilization < 70) return "bg-gray-50 border-gray-100";
    if (utilization <= 85) return "bg-green-50 border-green-100";
    if (utilization <= 100) return "bg-yellow-50 border-yellow-100";
    return "bg-red-50 border-red-100";
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-4 text-sm", className)}>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{totalCapacity.toFixed(2)}h</span>
          <span className="text-muted-foreground">capacity</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Briefcase className="w-4 h-4 text-green-600" />
          <span className="font-medium">{totalAssigned.toFixed(1)}h</span>
          <span className="text-muted-foreground">assigned</span>
        </div>
        
        <div className="flex items-center gap-1">
          <div className={cn("flex items-center gap-1", getUtilizationColor(avgUtilization))}>
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">{avgUtilization}%</span>
          </div>
          {showTrend && (
            <div className={cn("flex items-center", getTrendColor(utilizationTrend))}>
              {getTrendIcon(utilizationTrend)}
            </div>
          )}
        </div>

        {overallocatedPeriods > 0 && (
          <div className="flex items-center gap-1 text-red-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">{overallocatedPeriods}</span>
            <span className="text-sm">overallocated</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {/* Capacity */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-xl font-bold text-blue-600 truncate">
              {totalCapacity.toFixed(2)}h
            </div>
            <div className="text-xs text-muted-foreground">
              Total Capacity
            </div>
          </div>
        </div>
      </div>

      {/* Assigned */}
      <div className="bg-green-50 border border-green-100 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-green-600 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-xl font-bold text-green-600 truncate">
              {totalAssigned.toFixed(1)}h
            </div>
            <div className="text-xs text-muted-foreground">
              Assigned
            </div>
          </div>
        </div>
      </div>

      {/* Utilization */}
      <div className={cn("border rounded-lg p-3", getUtilizationBgColor(avgUtilization))}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 flex-shrink-0">
            <TrendingUp className={cn("w-4 h-4", getUtilizationColor(avgUtilization))} />
            {showTrend && (
              <div className={getTrendColor(utilizationTrend)}>
                {getTrendIcon(utilizationTrend)}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className={cn("text-xl font-bold truncate", getUtilizationColor(avgUtilization))}>
              {avgUtilization}%
            </div>
            <div className="text-xs text-muted-foreground">
              Avg Utilization
            </div>
          </div>
        </div>
      </div>

      {/* Overallocated Periods */}
      <div
        className={cn(
          "border rounded-lg p-3",
          overallocatedPeriods > 0 
            ? "bg-red-50 border-red-100" 
            : "bg-gray-50 border-gray-100"
        )}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle
            className={cn(
              "w-4 h-4 flex-shrink-0",
              overallocatedPeriods > 0 ? "text-red-600" : "text-muted-foreground"
            )}
          />
          <div className="min-w-0">
            <div
              className={cn(
                "text-xl font-bold truncate",
                overallocatedPeriods > 0 ? "text-red-600" : "text-muted-foreground"
              )}
            >
              {overallocatedPeriods}
            </div>
            <div className="text-xs text-muted-foreground">
              Overallocated
            </div>
          </div>
        </div>
      </div>

      {/* Additional metrics in non-compact mode */}
      {underutilizedPeriods !== undefined && (
        <div className="col-span-2 bg-muted/30 border border-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Underutilized periods:</span>
              <span className="font-medium">{underutilizedPeriods}</span>
            </div>
            {showTrend && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Trend:</span>
                <div className={cn("flex items-center gap-1", getTrendColor(utilizationTrend))}>
                  {getTrendIcon(utilizationTrend)}
                  <span className="capitalize">{utilizationTrend}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CapacityStats);