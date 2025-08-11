"use client";

import { InsightsGrid } from "./insights-grid";
import { QuickActions } from "./quick-actions";
import { StatusBar } from "./status-bar";
import { WorkflowSuggestions } from "./workflow-suggestions";

interface ModernDashboardProps {
  systemHealth: 'operational' | 'degraded' | 'outage';
  alerts: any[];
  insights: any[];
  suggestions: any[];
  pendingTasks?: number;
  lastUpdate?: Date;
  loading?: boolean;
  onActionClick?: (actionId: string) => void;
  onSuggestionDismiss?: (suggestionId: string) => void;
  onSuggestionAction?: (suggestionId: string, actionLabel: string) => void;
}

/**
 * Modern Dashboard Component
 * 
 * Combines all dashboard elements into an intelligent,
 * actionable interface that surfaces the most important
 * information and next actions for users
 */
export function ModernDashboard({
  systemHealth = 'operational',
  alerts = [],
  insights = [],
  suggestions = [],
  pendingTasks = 0,
  lastUpdate,
  loading = false,
  onActionClick,
  onSuggestionDismiss,
  onSuggestionAction,
}: ModernDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <QuickActions onActionClick={onActionClick} />

      {/* Business Insights */}
      <InsightsGrid insights={insights} loading={loading} />
    </div>
  );
}