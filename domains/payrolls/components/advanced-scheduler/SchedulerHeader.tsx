"use client";

import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Save, 
  RefreshCw, 
  Maximize2, 
  Minimize2,
  Calendar,
  Users,
  Eye,
  EyeOff,
  Edit,
} from "lucide-react";
import React from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScheduler } from "./SchedulerProvider";
import type { ViewPeriod, TableOrientation, SchedulerHeaderProps } from "./types";

export function SchedulerHeader({ onToggleExpanded, onRefresh }: SchedulerHeaderProps) {
  const { state, actions, dispatch } = useScheduler();

  const handlePeriodChange = (value: string) => {
    actions.setViewPeriod(value as ViewPeriod);
  };

  const handleOrientationChange = (value: string) => {
    actions.setOrientation(value as TableOrientation);
  };

  return (
    <div className="space-y-4">

      {/* Controls Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Period Selection */}
            <div className="flex items-center space-x-2">
              <Label htmlFor="period-tabs" className="text-sm font-medium">
                View:
              </Label>
              <Tabs value={state.viewConfig.period} onValueChange={handlePeriodChange}>
                <TabsList>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="fortnight">Fortnight</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Orientation Selection */}
            <div className="flex items-center space-x-2">
              <Label htmlFor="orientation-tabs" className="text-sm font-medium">
                Layout:
              </Label>
              <Tabs value={state.viewConfig.orientation} onValueChange={handleOrientationChange}>
                <TabsList>
                  <TabsTrigger value="consultants-as-columns">
                    <Users className="w-4 h-4 mr-1" />
                    Consultants as Columns
                  </TabsTrigger>
                  <TabsTrigger value="consultants-as-rows">
                    <Calendar className="w-4 h-4 mr-1" />
                    Consultants as Rows
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Show Ghosts Toggle - Only in preview mode */}
            {state.isPreviewMode && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-ghosts"
                  checked={state.viewConfig.showGhosts}
                  onCheckedChange={actions.toggleShowGhosts}
                />
                <Label htmlFor="show-ghosts" className="text-sm text-foreground">
                  {state.viewConfig.showGhosts ? (
                    <>
                      <Eye className="w-4 h-4 mr-1 inline" />
                      Show Original Positions
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 mr-1 inline" />
                      Hide Original Positions
                    </>
                  )}
                </Label>
              </div>
            )}

            {/* Action Buttons */}
            {!state.isPreviewMode ? (
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => actions.setCurrentDate(new Date())}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Today
                </Button>
                <PermissionGuard action="update">
                  <Button
                    size="sm"
                    onClick={() => dispatch({ type: 'SET_PREVIEW_MODE', payload: true })}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Schedule
                  </Button>
                </PermissionGuard>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-auto">
                <Badge variant="outline">
                  {state.pendingChanges.length} pending change
                  {state.pendingChanges.length !== 1 ? "s" : ""}
                </Badge>
                {state.isUpdating && <Badge variant="outline">Saving...</Badge>}
                {state.error && (
                  <Badge variant="destructive" className="text-xs">
                    Save failed
                  </Badge>
                )}
                <PermissionGuard action="update">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={actions.revertChanges}
                    disabled={state.isUpdating}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={actions.commitChanges}
                    disabled={state.isUpdating || state.pendingChanges.length === 0}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {state.isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </PermissionGuard>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={actions.navigatePrevious}
          disabled={state.isLoading || state.isUpdating}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <h3 className="text-xl font-semibold">
          {actions.formatPeriodDisplay()}
        </h3>

        <Button
          variant="outline"
          onClick={actions.navigateNext}
          disabled={state.isLoading || state.isUpdating}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Preview Mode Banner */}
      {state.isPreviewMode && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">
                Preview Mode
              </Badge>
              <span className="text-sm text-orange-800 dark:text-orange-200">
                Drag payrolls to reassign them. Changes won't be saved until you click "Save Changes".
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}