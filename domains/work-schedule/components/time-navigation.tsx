"use client";

import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { safeFormatDate } from "@/lib/utils/date-utils";
import { TimeNavigationProps, ViewPeriod, ViewType } from "../types/workload";

const TimeNavigation: React.FC<TimeNavigationProps> = ({
  viewPeriod,
  currentDate,
  onPeriodChange,
  onDateChange,
  onNavigate,
  className,
}) => {
  const getPeriodLabel = (period: ViewPeriod, date: Date) => {
    switch (period) {
      case "day":
        return safeFormatDate(date, "dd MMM yyyy");
      case "week":
        return `Week of ${safeFormatDate(date, "dd MMM yyyy")}`;
      case "month":
        return format(date, "MMM yyyy");
      default:
        return safeFormatDate(date, "dd MMM yyyy");
    }
  };

  const getPeriodLabelMobile = (period: ViewPeriod, date: Date) => {
    switch (period) {
      case "day":
        return format(date, "MMM d");
      case "week":
        return `Week ${format(date, "MMM d")}`;
      case "month":
        return format(date, "MMM yyyy");
      default:
        return format(date, "MMM d");
    }
  };

  const getNavigationLabel = (direction: "prev" | "next") => {
    const action = direction === "prev" ? "Previous" : "Next";
    return `${action} ${viewPeriod}`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Period Selection */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Tabs
          value={viewPeriod}
          onValueChange={value => onPeriodChange(value as ViewPeriod)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="day" className="text-sm">
              Day
            </TabsTrigger>
            <TabsTrigger value="week" className="text-sm">
              Week
            </TabsTrigger>
            <TabsTrigger value="month" className="text-sm">
              Month
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("prev")}
          aria-label={getNavigationLabel("prev")}
          className="flex items-center gap-1 flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Previous</span>
        </Button>

        <div className="flex-1 text-center min-w-0 px-2">
          <div className="text-base sm:text-lg font-semibold">
            <span className="hidden sm:inline">
              {getPeriodLabel(viewPeriod, currentDate)}
            </span>
            <span className="sm:hidden">
              {getPeriodLabelMobile(viewPeriod, currentDate)}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("next")}
          aria-label={getNavigationLabel("next")}
          className="flex items-center gap-1 flex-shrink-0"
        >
          <span className="hidden sm:inline text-xs">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Navigation */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDateChange(new Date())}
          className="text-xs"
        >
          Today
        </Button>

        {/* Add more quick navigation options as needed */}
        {viewPeriod === "month" && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const date = new Date();
                date.setMonth(date.getMonth() - 1);
                onDateChange(date);
              }}
              className="text-xs"
            >
              Last Month
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const date = new Date();
                date.setMonth(date.getMonth() + 1);
                onDateChange(date);
              }}
              className="text-xs"
            >
              Next Month
            </Button>
          </>
        )}
      </div>

      {/* Period Description */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {viewPeriod === "day" && "Daily view showing today's workload"}
          {viewPeriod === "week" &&
            "Weekly view showing this week's daily breakdown"}
          {viewPeriod === "month" &&
            "Monthly view showing weekly breakdown of current month"}
        </p>
      </div>
    </div>
  );
};

// Enhanced version with view type toggle
interface EnhancedTimeNavigationProps extends TimeNavigationProps {
  selectedView?: ViewType;
  onViewChange?: (view: ViewType) => void;
  showViewToggle?: boolean;
}

export const EnhancedTimeNavigation: React.FC<EnhancedTimeNavigationProps> = ({
  selectedView = "chart",
  onViewChange,
  showViewToggle = true,
  ...props
}) => {
  return (
    <div className={cn("space-y-4", props.className)}>
      {/* View Type Toggle */}
      {showViewToggle && onViewChange && (
        <div className="flex items-center justify-center">
          <Tabs
            value={selectedView}
            onValueChange={value => onViewChange(value as ViewType)}
          >
            <TabsList>
              <TabsTrigger value="chart" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Chart
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Calendar
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Standard Time Navigation */}
      <TimeNavigation {...props} />
    </div>
  );
};

export default React.memo(TimeNavigation);
