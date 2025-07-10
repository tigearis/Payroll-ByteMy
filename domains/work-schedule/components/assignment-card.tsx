"use client";

import { Clock, Building2, AlertCircle, Circle, CheckCircle2 } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AssignmentCardProps, PayrollAssignment, AssignmentStatus, AssignmentPriority } from "../types/workload";

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  showClient = true,
  showTime = true,
  showStatus = true,
  onClick,
  className,
  variant = "default",
}) => {
  const {
    id,
    name,
    clientName,
    processingTime,
    status,
    priority,
    eftDate,
  } = assignment;

  const getStatusColor = (status: AssignmentStatus) => {
    switch (status) {
      case "active":
        return "#22c55e"; // green-500
      case "pending":
        return "#f59e0b"; // amber-500
      case "completed":
        return "#6b7280"; // gray-500
      default:
        return "#8b5cf6"; // violet-500
    }
  };

  const getStatusIcon = (status: AssignmentStatus) => {
    switch (status) {
      case "active":
        return <Circle className="w-3 h-3 fill-current" />;
      case "pending":
        return <AlertCircle className="w-3 h-3" />;
      case "completed":
        return <CheckCircle2 className="w-3 h-3" />;
      default:
        return <Circle className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: AssignmentPriority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatTime = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    return `${hours.toFixed(1)}h`;
  };

  const isClickable = !!onClick;

  const handleClick = () => {
    if (isClickable) {
      onClick?.(assignment);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isClickable && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onClick?.(assignment);
    }
  };

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 p-2 rounded text-xs border-l-3 transition-all",
          isClickable && "cursor-pointer hover:bg-muted/50 hover:shadow-sm",
          className
        )}
        style={{
          backgroundColor: getStatusColor(status) + "20",
          borderLeftColor: getStatusColor(status),
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={isClickable ? 0 : undefined}
        role={isClickable ? "button" : undefined}
        aria-label={isClickable ? `View ${name} details` : undefined}
      >
        {showStatus && (
          <div className="flex-shrink-0" style={{ color: getStatusColor(status) }}>
            {getStatusIcon(status)}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate text-blue-700">
            {name}
          </div>
          {showTime && (
            <div className="text-muted-foreground">
              {formatTime(processingTime)}
            </div>
          )}
        </div>

        <Badge variant="outline" className={cn("text-xs", getPriorityColor(priority))}>
          {priority}
        </Badge>
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <Card className={cn("w-full", isClickable && "cursor-pointer hover:shadow-md transition-shadow", className)}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base leading-tight truncate text-blue-700">
                  {name}
                </h3>
                {showClient && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <Building2 className="w-3 h-3" />
                    <span className="truncate">{clientName}</span>
                  </div>
                )}
              </div>
              
              {showStatus && (
                <div className="flex items-center gap-1 flex-shrink-0" style={{ color: getStatusColor(status) }}>
                  {getStatusIcon(status)}
                  <span className="text-xs font-medium capitalize">{status}</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex items-center justify-between text-sm">
              {showTime && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>~{formatTime(processingTime)}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getPriorityColor(priority)}>
                  {priority} priority
                </Badge>
                
                {eftDate && (
                  <div className="text-xs text-muted-foreground">
                    Due: {new Date(eftDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            {isClickable && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={handleClick}
              >
                View Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        "p-3 rounded-lg border-l-4 transition-all",
        isClickable && "cursor-pointer hover:opacity-80 hover:shadow-sm",
        className
      )}
      style={{
        backgroundColor: getStatusColor(status) + "20",
        borderLeftColor: getStatusColor(status),
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? "button" : undefined}
      aria-label={isClickable ? `View ${name} details` : undefined}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate text-blue-700">
              {name}
            </div>
          </div>
          
          {showStatus && (
            <div className="flex items-center gap-1 flex-shrink-0" style={{ color: getStatusColor(status) }}>
              {getStatusIcon(status)}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            {showTime && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>~{formatTime(processingTime)}</span>
              </div>
            )}
            
            {showClient && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Building2 className="w-3 h-3" />
                <span className="truncate">{clientName}</span>
              </div>
            )}
          </div>

          <Badge variant="outline" className={cn("text-xs", getPriorityColor(priority))}>
            {priority}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AssignmentCard);