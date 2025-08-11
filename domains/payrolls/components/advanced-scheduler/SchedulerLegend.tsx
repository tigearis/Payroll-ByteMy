"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useScheduler } from "./SchedulerProvider";
import type { SchedulerLegendProps } from "./types";

export function SchedulerLegend({ compact = false }: SchedulerLegendProps) {
  const { state } = useScheduler();

  const legendItems = [
    {
      lightColor: "hsl(212, 96%, 78%)",
      darkColor: "hsl(212, 70%, 55%)",
      label: "Staff with Current Assignments",
      category: "staff",
    },
    {
      lightColor: "hsl(32, 98%, 83%)",
      darkColor: "hsl(0, 30%, 30%)",
      label: "Available Staff (No Current Assignments)",
      category: "staff",
    },
    {
      lightColor: "hsl(142, 77%, 73%)",
      darkColor: "hsl(142, 65%, 55%)",
      label: "Staff on Leave",
      category: "staff",
    },
  ];

  const assignmentLegendItems = [
    {
      color: "hsla(221, 83%, 53%, 0.4)",
      label: "Original Assignment",
      category: "assignment",
    },
    {
      color: "hsla(25, 95%, 53%, 0.4)",
      label: "Moved Assignment",
      category: "assignment",
    },
    {
      color: "hsla(0, 84%, 60%, 0.4)",
      label: "Backup Consultant",
      category: "assignment",
    },
  ];

  const ghostLegendItem = {
    className:
      "w-3 h-3 rounded border-dashed border-2 border-muted-foreground bg-muted/30",
    label: "Original Position (Ghost)",
    category: "assignment",
  };

  const holidayLegendItems = [
    {
      color: "rgb(16, 185, 129)",
      label: "NSW/National Holiday",
      category: "holiday",
    },
    {
      color: "rgb(245, 158, 11)",
      label: "Other State Holiday",
      category: "holiday",
    },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-xs text-foreground flex-wrap">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded relative">
              <div
                className="w-3 h-3 rounded absolute dark:opacity-0"
                style={{ backgroundColor: item.lightColor }}
              />
              <div
                className="w-3 h-3 rounded absolute opacity-0 dark:opacity-100"
                style={{ backgroundColor: item.darkColor }}
              />
            </div>
            <span className="whitespace-nowrap">{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Staff Legend */}
          <div>
            <h4 className="font-medium text-foreground mb-2 text-sm">
              Staff Status
            </h4>
            <div className="flex items-center gap-4 text-xs text-foreground flex-wrap">
              {legendItems.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded relative">
                    <div
                      className="w-3 h-3 rounded absolute dark:opacity-0"
                      style={{ backgroundColor: item.lightColor }}
                    />
                    <div
                      className="w-3 h-3 rounded absolute opacity-0 dark:opacity-100"
                      style={{ backgroundColor: item.darkColor }}
                    />
                  </div>
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment Legend - Only in preview mode */}
          {state.isPreviewMode && (
            <div>
              <h4 className="font-medium text-foreground mb-2 text-sm">
                Assignment Status
              </h4>
              <div className="flex items-center gap-4 text-xs text-foreground flex-wrap">
                {assignmentLegendItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                ))}

                {state.viewConfig.showGhosts && (
                  <div className="flex items-center gap-1">
                    <div className={ghostLegendItem.className} />
                    <span className="whitespace-nowrap">
                      {ghostLegendItem.label}
                    </span>
                  </div>
                )}

                {!state.viewConfig.showGhosts &&
                  state.pendingChanges.length > 0 && (
                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                      <span className="text-xs italic">
                        Original positions hidden - toggle to show
                      </span>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Holiday Legend */}
          <div>
            <h4 className="font-medium text-foreground mb-2 text-sm">
              Holidays
            </h4>
            <div className="flex items-center gap-4 text-xs text-foreground flex-wrap">
              {holidayLegendItems.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="pt-2 border-t">
            <p className="text-xs text-foreground">
              <strong className="text-foreground">
                Usage:
              </strong>
              {state.isPreviewMode
                ? " Drag assignments between consultants to reschedule. Save changes when ready."
                : " Click 'Edit Schedule' to enable drag-and-drop assignment management."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
