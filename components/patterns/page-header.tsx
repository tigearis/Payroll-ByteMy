"use client";

import { ArrowLeft, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface Action {
  label: string;
  icon?: React.ElementType;
  onClick?: () => void;
  href?: string;
  primary?: boolean;
  disabled?: boolean;
}

interface Status {
  type: "success" | "warning" | "error" | "info";
  message: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: Action[];
  overflowActions?: Action[];
  status?: Status;
  backHref?: string;
  metadata?: Array<{ label: string; value: any }>;
  children?: React.ReactNode;
}

const getStatusVariant = (type: Status['type']) => {
  switch (type) {
    case 'success':
      return 'default';
    case 'warning':
      return 'secondary';
    case 'error':
      return 'destructive';
    case 'info':
      return 'outline';
    default:
      return 'outline';
  }
};

export function PageHeader({
  title,
  subtitle,
  description,
  breadcrumbs,
  actions = [],
  overflowActions = [],
  status,
  backHref,
  metadata,
  children,
}: PageHeaderProps) {
  return (
    <div className="border-b bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-foreground transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="mx-2">/</span>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Main header content */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {backHref && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={backHref}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            )}
            
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                {status && (
                  <Badge variant={getStatusVariant(status.type)}>
                    {status.message}
                  </Badge>
                )}
              </div>
              {(subtitle || description) && (
                <p className="text-muted-foreground mt-1">{subtitle || description}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          {(actions.length > 0 || overflowActions.length > 0) && (
            <div className="flex items-center gap-2">
              {actions.map((action, index) => {
                const IconComponent = action.icon;
                const ButtonComponent = (
                  <Button
                    key={index}
                    variant={action.primary ? "default" : "outline"}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    asChild={!!action.href}
                  >
                    {action.href ? (
                      <Link href={action.href}>
                        {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                        {action.label}
                      </Link>
                    ) : (
                      <>
                        {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                        {action.label}
                      </>
                    )}
                  </Button>
                );
                return ButtonComponent;
              })}

              {overflowActions.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {overflowActions.map((action, index) => {
                      const IconComponent = action.icon;
                      return (
                        <DropdownMenuItem
                          key={index}
                          onClick={action.onClick}
                          disabled={action.disabled}
                        >
                          {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                          {action.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </div>

        {/* Additional content */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}