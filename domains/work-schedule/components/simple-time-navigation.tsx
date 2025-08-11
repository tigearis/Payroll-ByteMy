"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { safeFormatDate } from "@/lib/utils/date-utils";

type ViewPeriod = "day" | "week" | "month";

interface SimpleTimeNavigationProps {
  viewPeriod: ViewPeriod;
  currentDate: Date;
  onPeriodChange: (period: ViewPeriod) => void;
  onDateChange: (date: Date) => void;
  onNavigate: (direction: "prev" | "next") => void;
  className?: string;
}

export const SimpleTimeNavigation: React.FC<SimpleTimeNavigationProps> = ({
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
    <div className={cn("space-y-3", className)}>
      {/* Period Selection */}
      <div className="flex justify-center">
        <Tabs
          value={viewPeriod}
          onValueChange={value => onPeriodChange(value as ViewPeriod)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="day" className="text-xs">
              Day
            </TabsTrigger>
            <TabsTrigger value="week" className="text-xs">
              Week
            </TabsTrigger>
            <TabsTrigger value="month" className="text-xs">
              Month
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("prev")}
          aria-label={getNavigationLabel("prev")}
          className="flex items-center gap-1 flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Prev</span>
        </Button>

        <div className="flex-1 text-center min-w-0 px-2">
          <div className="text-sm font-semibold">
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

      {/* Today Button */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDateChange(new Date())}
          className="text-xs"
        >
          Today
        </Button>
      </div>
    </div>
  );
};

export default SimpleTimeNavigation;
