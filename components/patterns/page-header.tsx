"use client";

import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Breadcrumb = {
  label: string;
  href?: string;
};

export type HeaderAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
};

export type StatusIndicator = {
  type: "success" | "warning" | "error" | "info" | "pending";
  message?: string;
};

export type HeaderMetadataItem = {
  label: string;
  value: ReactNode;
};

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: HeaderAction[];
  overflowActions?: HeaderAction[];
  status?: StatusIndicator;
  metadata?: HeaderMetadataItem[];
}

function getStatusClasses(type: StatusIndicator["type"]) {
  switch (type) {
    case "success":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300";
    case "warning":
      return "bg-amber-100 text-amber-900 dark:bg-amber-900/20 dark:text-amber-300";
    case "error":
      return "bg-red-100 text-red-900 dark:bg-red-900/20 dark:text-red-300";
    case "pending":
      return "bg-slate-100 text-slate-900 dark:bg-slate-900/20 dark:text-slate-300";
    default:
      return "bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-300";
  }
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  overflowActions,
  status,
  metadata,
}: PageHeaderProps) {
  return (
    <motion.div
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <motion.nav
          className="text-sm text-foreground"
          aria-label="Breadcrumb"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <ol className="flex items-center gap-2">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li
                  key={`${crumb.label}-${index}`}
                  className="flex items-center gap-2"
                >
                  {crumb.href && !isLast ? (
                    <Link href={crumb.href} className="hover:underline">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current={isLast ? "page" : undefined}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <span className="text-foreground opacity-50">/</span>}
                </li>
              );
            })}
          </ol>
        </motion.nav>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <motion.div className="space-y-1" layout>
          <div className="flex items-center gap-3">
            <motion.h1
              layout
              className="text-2xl font-semibold tracking-tight md:text-3xl"
            >
              {title}
            </motion.h1>
            {status && (
              <Badge
                className={getStatusClasses(status.type)}
                variant="secondary"
              >
                {status.message ?? status.type}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-foreground opacity-75 max-w-2xl">{description}</p>
          )}
        </motion.div>
        {(actions?.length || overflowActions?.length) && (
          <motion.div className="flex items-center gap-2" layout>
            {actions?.map(action => {
              const Icon = action.icon;
              const content = (
                <>
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{action.label}</span>
                </>
              );

              if (action.href) {
                return (
                  <Button
                    key={action.label}
                    variant={action.primary ? "default" : "outline"}
                    asChild
                  >
                    <Link href={action.href}>{content}</Link>
                  </Button>
                );
              }

              return (
                <Button
                  key={action.label}
                  variant={action.primary ? "default" : "outline"}
                  onClick={action.onClick}
                >
                  {content}
                </Button>
              );
            })}

            {overflowActions && overflowActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 w-9 p-0">
                    <span className="sr-only">Open more actions</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {overflowActions.map(action => {
                    const Icon = action.icon;
                    const label = (
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{action.label}</span>
                      </div>
                    );
                    if (action.href) {
                      return (
                        <DropdownMenuItem key={action.label} asChild>
                          <Link href={action.href}>{label}</Link>
                        </DropdownMenuItem>
                      );
                    }
                    return (
                      <DropdownMenuItem
                        key={action.label}
                        onClick={action.onClick}
                      >
                        {label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </motion.div>
        )}
      </div>

      {metadata && metadata.length > 0 && (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {metadata.map(item => (
            <div key={item.label} className="rounded-md border bg-card p-3">
              <div className="text-xs text-muted-foreground">{item.label}</div>
              <div className="text-sm font-medium">{item.value}</div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
