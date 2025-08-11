"use client";

import { AlertTriangle, CheckCircle, Clock, Info, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SystemAlert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'pending';
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  dismissible?: boolean;
}

interface StatusBarProps {
  systemHealth: 'operational' | 'degraded' | 'outage';
  alerts: SystemAlert[];
  pendingTasks?: number;
  lastUpdate?: Date;
}

const statusIcons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
  pending: Clock,
};

const statusColors = {
  success: "text-green-600 bg-green-100 border-green-200",
  warning: "text-warning-600 bg-warning-100 border-warning-200", 
  error: "text-error-600 bg-error-100 border-error-200",
  info: "text-primary bg-primary/5 border-primary/20",
  pending: "text-muted-foreground bg-muted border-border",
};

const healthStatusConfig = {
  operational: {
    color: "text-green-600",
    bgColor: "bg-green-100",
    label: "All systems operational",
    icon: CheckCircle,
  },
  degraded: {
    color: "text-warning-600", 
    bgColor: "bg-warning-100",
    label: "Performance degraded",
    icon: AlertTriangle,
  },
  outage: {
    color: "text-error-600",
    bgColor: "bg-error-100", 
    label: "Service outage",
    icon: XCircle,
  },
};

/**
 * StatusBar Component
 * 
 * Displays system health, critical alerts, and notifications
 * at the top of the dashboard for immediate visibility
 */
export function StatusBar({
  systemHealth,
  alerts,
  pendingTasks = 0,
  lastUpdate
}: StatusBarProps) {
  const healthConfig = healthStatusConfig[systemHealth];
  const HealthIcon = healthConfig.icon;

  // Only show high priority alerts in status bar
  const priorityAlerts = alerts.filter(alert => 
    alert.type === 'error' || alert.type === 'warning'
  );

  return (
    <div className="space-y-3">
      {/* System Health Indicator */}
      <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-full", healthConfig.bgColor)}>
            <HealthIcon className={cn("h-4 w-4", healthConfig.color)} />
          </div>
          <div>
            <h3 className="font-medium text-card-foreground">
              System Status
            </h3>
            <p className="text-sm text-muted-foreground">
              {healthConfig.label}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Pending Tasks Badge */}
          {pendingTasks > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-medium">
                {pendingTasks} pending tasks
              </Badge>
            </div>
          )}
          
          {/* Last Update */}
          {lastUpdate && (
            <div className="text-xs text-muted-foreground">
              Updated {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Priority Alerts */}
      {priorityAlerts.length > 0 && (
        <div className="space-y-2">
          {priorityAlerts.map((alert) => {
            const Icon = statusIcons[alert.type];
            return (
              <Alert 
                key={alert.id} 
                className={cn("border-l-4", statusColors[alert.type])}
              >
                <Icon className="h-4 w-4" />
                <div className="flex-1">
                  <AlertDescription className="font-medium">
                    {alert.title}
                  </AlertDescription>
                  <AlertDescription className="text-sm mt-1">
                    {alert.message}
                  </AlertDescription>
                </div>
                
                {alert.actionLabel && (
                  <Button variant="outline" size="sm" className="ml-auto">
                    {alert.actionLabel}
                  </Button>
                )}
              </Alert>
            );
          })}
        </div>
      )}
    </div>
  );
}