"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const contentSectionVariants = cva(
  "rounded-lg border",
  {
    variants: {
      variant: {
        primary: [
          "bg-white dark:bg-neutral-950",
          "border-neutral-200 dark:border-neutral-800", 
          "shadow-sm"
        ],
        secondary: [
          "bg-neutral-50 dark:bg-neutral-900",
          "border-neutral-200 dark:border-neutral-700"
        ],
        accent: [
          "bg-primary-50 dark:bg-primary-950/20",
          "border-primary-200 dark:border-primary-800",
          "shadow-sm"
        ],
        muted: [
          "bg-neutral-100/50 dark:bg-neutral-900/50", 
          "border-neutral-200/60 dark:border-neutral-700/60"
        ],
        ghost: [
          "bg-transparent",
          "border-transparent"
        ]
      },
      padding: {
        none: "",
        sm: "p-3",
        md: "p-4", 
        lg: "p-6",
        xl: "p-8"
      },
      spacing: {
        none: "space-y-0",
        sm: "space-y-2",
        md: "space-y-4",
        lg: "space-y-6",
        xl: "space-y-8"
      }
    },
    defaultVariants: {
      variant: "primary",
      padding: "md",
      spacing: "md"
    }
  }
);

export interface ContentSectionProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof contentSectionVariants> {
  children: ReactNode;
  header?: ReactNode;
  headerActions?: ReactNode;
  footer?: ReactNode;
}

/**
 * ContentSection Component
 * 
 * Provides consistent section styling with different visual emphasis levels.
 * Useful for organizing content into logical groups with proper visual hierarchy.
 */
export function ContentSection({
  children,
  className,
  variant = "primary",
  padding = "md", 
  spacing = "md",
  header,
  headerActions,
  footer,
  ...props
}: ContentSectionProps) {
  return (
    <div
      className={cn(contentSectionVariants({ variant, padding, spacing }), className)}
      {...props}
    >
      {(header || headerActions) && (
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700">
          {header && (
            <div className="font-medium text-neutral-900 dark:text-neutral-100">
              {header}
            </div>
          )}
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      
      <div className={spacing !== "none" ? `space-y-${spacing === "sm" ? "2" : spacing === "lg" ? "6" : spacing === "xl" ? "8" : "4"}` : ""}>
        {children}
      </div>
      
      {footer && (
        <div className="mt-4 pt-2 border-t border-neutral-200 dark:border-neutral-700">
          {footer}
        </div>
      )}
    </div>
  );
}

// Specialized section components for common use cases

interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function SectionHeader({ 
  title, 
  description, 
  actions, 
  className 
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between", className)}>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// Hero Section - For primary featured content
export function HeroSection({ 
  children, 
  className, 
  ...props 
}: Omit<ContentSectionProps, 'variant'>) {
  return (
    <ContentSection
      variant="accent"
      padding="xl"
      spacing="lg"
      className={cn("text-center", className)}
      {...props}
    >
      {children}
    </ContentSection>
  );
}

// Card Section - For grouped content
export function CardSection({ 
  children, 
  className, 
  ...props 
}: Omit<ContentSectionProps, 'variant'>) {
  return (
    <ContentSection
      variant="primary"
      padding="lg"
      className={className}
      {...props}
    >
      {children}
    </ContentSection>
  );
}

// Info Section - For supplementary information
export function InfoSection({ 
  children, 
  className, 
  ...props 
}: Omit<ContentSectionProps, 'variant'>) {
  return (
    <ContentSection
      variant="secondary"
      padding="md"
      className={className}
      {...props}
    >
      {children}
    </ContentSection>
  );
}

// Sidebar Section - For secondary content
export function SidebarSection({ 
  children, 
  className, 
  ...props 
}: Omit<ContentSectionProps, 'variant'>) {
  return (
    <ContentSection
      variant="muted"
      padding="md"
      spacing="sm"
      className={className}
      {...props}
    >
      {children}
    </ContentSection>
  );
}

// Grid Container for organizing multiple sections
interface ContentGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ContentGrid({ 
  children, 
  columns = 2, 
  gap = 'md',
  className 
}: ContentGridProps) {
  return (
    <div className={cn(
      "grid",
      columns === 1 && "grid-cols-1",
      columns === 2 && "grid-cols-1 md:grid-cols-2", 
      columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      gap === 'sm' && "gap-4",
      gap === 'md' && "gap-6",
      gap === 'lg' && "gap-8",
      className
    )}>
      {children}
    </div>
  );
}

// Stack Container for vertical content organization
interface ContentStackProps {
  children: ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function ContentStack({ 
  children, 
  spacing = 'md',
  className 
}: ContentStackProps) {
  return (
    <div className={cn(
      spacing === 'sm' && "space-y-4",
      spacing === 'md' && "space-y-6", 
      spacing === 'lg' && "space-y-8",
      spacing === 'xl' && "space-y-12",
      className
    )}>
      {children}
    </div>
  );
}

// Feature Section - For highlighting key features or content
interface FeatureSectionProps extends Omit<ContentSectionProps, 'variant'> {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}

export function FeatureSection({
  icon: Icon,
  title,
  description,
  children,
  className,
  ...props
}: FeatureSectionProps) {
  return (
    <ContentSection
      variant="primary"
      className={className}
      header={
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="p-2 rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
      }
      {...props}
    >
      {children}
    </ContentSection>
  );
}

// Alert Section - For important messages
interface AlertSectionProps extends Omit<ContentSectionProps, 'variant'> {
  type: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const alertVariants = {
  info: "bg-info-50 dark:bg-info-950/20 border-info-200 dark:border-info-800",
  warning: "bg-warning-50 dark:bg-warning-950/20 border-warning-200 dark:border-warning-800", 
  error: "bg-error-50 dark:bg-error-950/20 border-error-200 dark:border-error-800",
  success: "bg-success-50 dark:bg-success-950/20 border-success-200 dark:border-success-800",
};

export function AlertSection({
  type,
  title,
  dismissible,
  onDismiss,
  children,
  className,
  ...props
}: AlertSectionProps) {
  return (
    <ContentSection
      variant="ghost"
      className={cn(alertVariants[type], className)}
      header={title && (
        <div className="flex items-center justify-between">
          <span className="font-medium">{title}</span>
          {dismissible && (
            <button 
              onClick={onDismiss}
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
            >
              ×
            </button>
          )}
        </div>
      )}
      {...props}
    >
      {children}
    </ContentSection>
  );
}