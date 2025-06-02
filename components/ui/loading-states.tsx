import { Loader2, RefreshCcw, AlertTriangle, Users } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageLoading({
  title = "Loading...",
  description = "Please wait while we fetch your data",
  size = "default",
}: {
  title?: string;
  description?: string;
  size?: "sm" | "default" | "lg";
}) {
  const iconSizes = {
    sm: "h-8 w-8",
    default: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="text-center">
        <Loader2
          className={cn(
            "animate-spin text-primary mx-auto mb-4",
            iconSizes[size]
          )}
        />
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function UsersLoading() {
  return (
    <PageLoading
      title="Loading Users..."
      description="Fetching user data and permissions"
    />
  );
}

export function StaffLoading() {
  return (
    <PageLoading
      title="Loading Staff..."
      description="Retrieving staff information and roles"
    />
  );
}

export function PayrollsLoading() {
  return (
    <PageLoading
      title="Loading Payrolls..."
      description="Getting payroll data and schedules"
    />
  );
}

export function ClientsLoading() {
  return (
    <PageLoading
      title="Loading Clients..."
      description="Fetching client information and settings"
    />
  );
}

export function TableLoading({
  columns = 5,
  rows = 5,
  showSearch = true,
  showActions = true,
}: {
  columns?: number;
  rows?: number;
  showSearch?: boolean;
  showActions?: boolean;
}) {
  return (
    <div className="w-full space-y-4">
      {(showSearch || showActions) && (
        <div className="flex items-center justify-between">
          {showSearch && <Skeleton className="h-10 w-80" />}
          {showActions && (
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          )}
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <div className="h-12 px-4 border-b bg-gray-50/50 flex items-center">
          {Array(columns)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex-1 px-2">
                <Skeleton className="h-4 w-full max-w-[120px]" />
              </div>
            ))}
        </div>

        <div className="divide-y">
          {Array(rows)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-16 px-4 flex items-center hover:bg-gray-50/50"
              >
                {Array(columns)
                  .fill(0)
                  .map((_, j) => (
                    <div key={j} className="flex-1 px-2">
                      <Skeleton className="h-4 w-full max-w-[140px]" />
                    </div>
                  ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export function CardLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
}

export function CardsLoading({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <CardLoading key={i} />
        ))}
    </div>
  );
}

export function InlineLoading({
  text = "Loading...",
  size = "sm",
}: {
  text?: string;
  size?: "xs" | "sm" | "md";
}) {
  const iconSizes = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
  };

  return (
    <div className="flex items-center space-x-2">
      <Loader2 className={cn("animate-spin", iconSizes[size])} />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

export function LoadingWithRetry({
  title = "Loading failed",
  description = "Something went wrong while loading data",
  onRetry,
  loading = false,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="text-center">
        {loading ? (
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        ) : (
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        )}
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            disabled={loading}
            variant="outline"
            className="mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export function LoadingOverlay({
  message = "Processing...",
  className = "",
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center",
        className
      )}
    >
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
}

export function StatsLoading({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-4 rounded" />
              </div>
              <Skeleton className="h-8 w-3/4 mt-2" />
              <Skeleton className="h-3 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

export function ListLoading({
  items = 5,
  showIcon = false,
}: {
  items?: number;
  showIcon?: boolean;
}) {
  return (
    <div className="space-y-2">
      {Array(items)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-2">
            {showIcon && <Skeleton className="h-5 w-5 rounded" />}
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
    </div>
  );
}

export function FormLoading({ fields = 6 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array(fields)
        .fill(0)
        .map((_, i) => (
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

export function PermissionCheckLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
      <div className="text-center">
        <div className="relative">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <Loader2 className="h-6 w-6 animate-spin text-primary absolute -top-1 -right-1" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">
          Checking Permissions
        </h3>
        <p className="text-sm text-muted-foreground">
          Verifying your access level...
        </p>
      </div>
    </div>
  );
}

export function ErrorDisplay({
  title = "Error Loading Data",
  error,
  onRetry,
  showRetry = true,
}: {
  title?: string;
  error: string | Error;
  onRetry?: () => void;
  showRetry?: boolean;
}) {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4 max-w-md">{errorMessage}</p>
        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

export function FullPageError({
  error,
  onRetry,
}: {
  error: string | Error;
  onRetry?: () => void;
}) {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Error Loading Data
        </h2>
        <p className="text-gray-600 mb-4">{errorMessage}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

export function PermissionDenied({
  title = "Access Denied",
  message = "You don't have permission to access this resource",
  requiredRole,
  currentRole,
  showReturnHome = true,
}: {
  title?: string;
  message?: string;
  requiredRole?: string;
  currentRole?: string;
  showReturnHome?: boolean;
}) {
  return (
    <Card className="max-w-lg mx-auto">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-2">{message}</p>
          </div>
          {(requiredRole || currentRole) && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              {requiredRole && (
                <div className="flex justify-between">
                  <span className="font-medium">Required:</span>
                  <span>{requiredRole}</span>
                </div>
              )}
              {currentRole && (
                <div className="flex justify-between">
                  <span className="font-medium">Your Role:</span>
                  <span>{currentRole}</span>
                </div>
              )}
            </div>
          )}
          {showReturnHome && (
            <Button variant="outline" asChild>
              <a href="/dashboard">Return to Dashboard</a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCardLoading() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

export function LazyComponentFallback() {
  return (
    <div className="w-full space-y-4">
      <Skeleton className="h-8 w-full max-w-md" />
      <Skeleton className="h-32 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
