// components/real-time-updates.tsx
import { DocumentNode } from "@apollo/client";
import { ReactNode, useMemo } from "react";
import { 
  PayrollSubscriptionDocument,
  GetPayrollsDocument,
  GetPayrollsPaginatedDocument
} from "@/domains/payrolls/graphql/generated/graphql";
import { useRealTimeSubscription } from "@/hooks/use-subscription";

interface RealTimeUpdatesProps {
  subscription: DocumentNode;
  refetchQueries: DocumentNode[];
  variables?: Record<string, unknown>;
  showToasts?: boolean;
  onUpdate?: (data: unknown) => void;
  children?: ReactNode;
}

/**
 * Component that handles real-time updates via GraphQL subscriptions
 * Can be used either standalone or as a wrapper that renders children
 */
export function RealTimeUpdates({
  subscription,
  refetchQueries,
  variables,
  showToasts = false,
  onUpdate,
  children,
}: RealTimeUpdatesProps) {
  // Memoize subscription options to prevent infinite re-renders
  const subscriptionOptions = useMemo(() => ({
    document: subscription,
    variables: variables || {},
    refetchQueries,
    shouldToast: showToasts,
    ...(onUpdate && { onData: onUpdate }),
  }), [subscription, variables, refetchQueries, showToasts, onUpdate]);

  const { isConnected, error } = useRealTimeSubscription(subscriptionOptions);

  // If subscriptions are not supported, just render children without real-time updates
  if (error && error.message?.includes('not supported')) {
    return children || null;
  }

  // Either render children (if provided) or nothing
  return children ? (
    <>
      {children}
      {/* Optionally could render some indicator of connection status */}
      {!isConnected && showToasts && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 rounded shadow-md text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span>Reconnecting...</span>
          </div>
        </div>
      )}
    </>
  ) : null;
}

/**
 * Specialized component for payroll updates
 */
export function PayrollUpdatesListener({
  refetchQueries = [GetPayrollsPaginatedDocument],
  showToasts = false,
  onUpdate,
}: {
  refetchQueries?: DocumentNode[];
  showToasts?: boolean;
  onUpdate?: (data: unknown) => void;
}) {
  // Memoize real-time props to prevent re-creating object on every render
  const realTimeProps = useMemo(() => ({
    subscription: PayrollSubscriptionDocument,
    refetchQueries,
    showToasts,
    ...(onUpdate && { onUpdate }),
  }), [refetchQueries, showToasts, onUpdate]);

  return <RealTimeUpdates {...realTimeProps} />;
}
