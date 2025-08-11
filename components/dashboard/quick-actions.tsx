"use client";

import { 
  Plus, 
  Upload, 
  Calendar, 
  Calculator, 
  Users, 
  DollarSign,
  FileText,
  Clock,
  BarChart3,
  Settings
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePermissions } from "@/hooks/use-permissions";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  href?: string;
  onClick?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  primary?: boolean;
  badge?: string | number;
  resource?: string;
  action?: string;
  disabled?: boolean;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  onActionClick?: (actionId: string) => void;
}

// Default quick actions based on common user workflows
const defaultActions: QuickAction[] = [
  {
    id: "new-payroll",
    label: "New Payroll",
    description: "Create a new payroll for a client",
    href: "/payrolls/new",
    icon: Calculator,
    primary: true,
    resource: "payrolls",
    action: "create",
  },
  {
    id: "add-client", 
    label: "Add Client",
    description: "Register a new client",
    href: "/clients/new",
    icon: Users,
    resource: "clients",
    action: "create",
  },
  {
    id: "import-data",
    label: "Import Data",
    description: "Bulk upload client or payroll data",
    href: "/bulk-upload",
    icon: Upload,
    resource: "bulkupload",
    action: "read",
  },
  {
    id: "schedule",
    label: "Schedule",
    description: "Manage payroll schedules",
    href: "/payroll-schedule", 
    icon: Calendar,
    resource: "schedule",
    action: "read",
  },
  {
    id: "billing",
    label: "Generate Invoice",
    description: "Create invoices from billing items",
    href: "/billing",
    icon: DollarSign,
    resource: "billing",
    action: "create",
  },
  {
    id: "reports",
    label: "Reports",
    description: "View analytics and reports",
    href: "/reports",
    icon: BarChart3,
    resource: "reports",
    action: "read",
  },
  {
    id: "time-entry",
    label: "Log Time",
    description: "Record billable time",
    icon: Clock,
    resource: "billing",
    action: "create",
    onClick: () => {
      // This would open a time entry modal
      console.log("Open time entry modal");
    },
  },
  {
    id: "staff-management",
    label: "Manage Staff", 
    description: "Add or update staff members",
    href: "/staff",
    icon: Settings,
    resource: "staff", 
    action: "read",
  },
];

interface ActionCardProps {
  action: QuickAction;
  onClick?: (actionId: string) => void;
}

function ActionCard({ action, onClick }: ActionCardProps) {
  const Icon = action.icon;
  
  const handleClick = () => {
    if (action.onClick) {
      action.onClick();
    } else if (onClick) {
      onClick(action.id);
    }
  };

  const content = (
    <Card className={`group hover:shadow-md transition-all duration-200 cursor-pointer ${
      action.primary ? "ring-2 ring-primary/20 bg-primary/5" : ""
    } ${action.disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            action.primary 
              ? "bg-primary/10 text-primary" 
              : "bg-muted text-muted-foreground"
          } group-hover:scale-110 transition-transform duration-200`}>
            <Icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                {action.label}
              </h3>
              {action.badge && (
                <Badge variant="secondary" className="text-xs">
                  {action.badge}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {action.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (action.href && !action.disabled) {
    return <Link href={action.href}>{content}</Link>;
  }

  return (
    <div onClick={!action.disabled ? handleClick : undefined}>
      {content}
    </div>
  );
}

/**
 * QuickActions Component
 * 
 * Displays the most common user tasks as actionable cards
 * for rapid access to key workflows
 */
export function QuickActions({ 
  actions = defaultActions, 
  onActionClick 
}: QuickActionsProps) {
  const { can } = usePermissions();

  // Filter actions based on permissions
  const accessibleActions = actions.filter(action => {
    if (action.resource && action.action) {
      return can(action.resource, action.action);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Quick Actions
        </h2>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/customize">
            Customize
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {accessibleActions.map((action) => (
          <ActionCard
            key={action.id}
            action={action}
            onClick={onActionClick}
          />
        ))}
      </div>
      
      {accessibleActions.length === 0 && (
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            No actions available based on your permissions
          </div>
        </div>
      )}
    </div>
  );
}