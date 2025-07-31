// components/ui/smart-loading.tsx
"use client";

import React from 'react';
import { ByteMyLoadingIcon, ByteMySpinner } from '@/components/ui/bytemy-loading-icon';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { type LoadingVariant } from '@/lib/config/loading-messages';
import { cn } from '@/lib/utils';

export interface SmartLoadingProps {
  title?: string | undefined;
  description?: string | undefined;
  variant?: LoadingVariant | undefined;
  size?: 'sm' | 'default' | 'lg' | undefined;
  className?: string | undefined;
  showProgress?: boolean | undefined;
  progress?: number | undefined;
  showSkeleton?: boolean | undefined;
  skeletonType?: 'card' | 'table' | 'list' | 'form' | undefined;
  children?: React.ReactNode | undefined;
}

export function SmartLoading({
  title = 'Loading...',
  description = 'Please wait while we fetch your data',
  variant = 'page',
  size = 'default',
  className,
  showProgress = false,
  progress = 0,
  showSkeleton = false,
  skeletonType = 'card',
  children
}: SmartLoadingProps) {
  // Render different variants
  switch (variant) {
    case 'inline':
      return <InlineLoading title={title} size={size} className={className || ""} />;
      
    case 'overlay':
      return <OverlayLoading title={title} description={description} className={className || ""} />;
      
    case 'minimal':
      return <MinimalLoading size={size} className={className || ""} />;
      
    case 'page':
    default:
      return (
        <PageLoading
          title={title}
          description={description}
          size={size}
          className={className || undefined}
          showProgress={showProgress}
          progress={progress}
          showSkeleton={showSkeleton}
          skeletonType={skeletonType || undefined}
        >
          {children}
        </PageLoading>
      );
  }
}

// Page-level loading component
function PageLoading({
  title,
  description,
  size,
  className,
  showProgress,
  progress,
  showSkeleton,
  skeletonType,
  children
}: SmartLoadingProps) {
  if (showSkeleton) {
    return (
      <div className={cn("w-full space-y-6", className)}>
        <SkeletonLoader type={skeletonType || undefined} />
        {children}
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-[400px] flex items-center justify-center",
      className
    )}>
      <div className="text-center space-y-4">
        <ByteMyLoadingIcon
          title={title || undefined}
          description={description || undefined}
          size={size || undefined}
        />
        
        {showProgress && (
          <div className="w-64 mx-auto">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{Math.round(progress || 0)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress || 0))}%` }}
              />
            </div>
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
}

// Inline loading component
function InlineLoading({
  title,
  size,
  className
}: Pick<SmartLoadingProps, 'title' | 'size' | 'className'>) {
  const iconSizes = {
    sm: 'sm' as const,
    default: 'sm' as const,
    lg: 'default' as const
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <ByteMySpinner size={iconSizes[size || 'default']} />
      <span className="text-sm text-muted-foreground">{title}</span>
    </div>
  );
}

// Overlay loading component
function OverlayLoading({
  title,
  description,
  className
}: Pick<SmartLoadingProps, 'title' | 'description' | 'className'>) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center",
        className
      )}
    >
      <div className="text-center bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
        <ByteMySpinner size="default" className="mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
    </div>
  );
}

// Minimal loading component
function MinimalLoading({
  size,
  className
}: Pick<SmartLoadingProps, 'size' | 'className'>) {
  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <ByteMySpinner size={size || undefined} />
    </div>
  );
}

// Skeleton loader component
function SkeletonLoader({ type }: { type?: 'card' | 'table' | 'list' | 'form' | undefined }) {
  switch (type) {
    case 'table':
      return <TableSkeleton />;
    case 'list':
      return <ListSkeleton />;
    case 'form':
      return <FormSkeleton />;
    case 'card':
    default:
      return <CardSkeleton />;
  }
}

function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-80" />
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="h-12 px-4 border-b bg-gray-50/50 flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-1 px-2">
              <Skeleton className="h-4 w-full max-w-30" />
            </div>
          ))}
        </div>

        <div className="divide-y">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-16 px-4 flex items-center hover:bg-gray-50/50"
            >
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex-1 px-2">
                  <Skeleton className="h-4 w-full max-w-36" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full max-w-48" />
            <Skeleton className="h-3 w-full max-w-40" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-6 max-w-md">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex space-x-2 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}

// Specialized loading components for common use cases
export function PayrollsLoading() {
  return (
    <SmartLoading
      title="Loading Payrolls..."
      description="Getting payroll data and schedules"
      variant="page"
      size="default"
    />
  );
}

export function ClientsLoading() {
  return (
    <SmartLoading
      title="Loading Clients..."
      description="Fetching client information and settings"
      variant="page"
      size="default"
    />
  );
}

export function StaffLoading() {
  return (
    <SmartLoading
      title="Loading Staff..."
      description="Retrieving staff information and roles"
      variant="page"
      size="default"
    />
  );
}

export function PayrollDetailsLoading() {
  return (
    <SmartLoading
      title="Loading Payroll Details..."
      description="Getting comprehensive payroll information"
      variant="page"
      size="default"
    />
  );
}

export function ClientDetailsLoading() {
  return (
    <SmartLoading
      title="Loading Client Details..."
      description="Getting comprehensive client information"
      variant="page"
      size="default"
    />
  );
}

// Button loading state component
export function ButtonLoading({
  children,
  isLoading,
  loadingText = "Loading...",
  className,
  ...props
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
  [key: string]: any;
}) {
  const Button = require('@/components/ui/button').Button;
  
  return (
    <Button
      {...props}
      className={className}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <ByteMySpinner size="sm" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}

// Progress loading component
export function ProgressLoading({
  title,
  description,
  progress,
  className
}: {
  title?: string;
  description?: string;
  progress: number;
  className?: string;
}) {
  return (
    <SmartLoading
      title={title || undefined}
      description={description || undefined}
      variant="page"
      showProgress={true}
      progress={progress}
      className={className || undefined}
    />
  );
}

// Quick access loading components
export const QuickLoading = {
  Page: (props: Pick<SmartLoadingProps, 'title' | 'description'>) => (
    <SmartLoading variant="page" {...props} />
  ),
  Inline: (props: Pick<SmartLoadingProps, 'title'>) => (
    <SmartLoading variant="inline" {...props} />
  ),
  Overlay: (props: Pick<SmartLoadingProps, 'title' | 'description'>) => (
    <SmartLoading variant="overlay" {...props} />
  ),
  Minimal: () => (
    <SmartLoading variant="minimal" />
  )
};