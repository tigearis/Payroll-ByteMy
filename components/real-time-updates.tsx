// components/real-time-updates.tsx
import { gql, DocumentNode } from '@apollo/client';
import { ReactNode } from 'react';

import { useRealTimeSubscription } from '@/hooks/use-subscription';

interface RealTimeUpdatesProps {
  subscription: DocumentNode;
  refetchQueries: string[];
  variables?: Record<string, any>;
  showToasts?: boolean;
  onUpdate?: (data: any) => void;
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
  children
}: RealTimeUpdatesProps) {
  // Use our custom subscription hook
  const { isConnected } = useRealTimeSubscription({
    document: subscription,
    variables,
    refetchQueries,
    shouldToast: showToasts,
    onData: onUpdate
  });

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
  refetchQueries = ['GET_PAYROLLS'],
  showToasts = false,
  onUpdate
}: {
  refetchQueries?: string[];
  showToasts?: boolean;
  onUpdate?: (data: any) => void;
}) {
  // Import extracted GraphQL operations
  const PAYROLLS_SUBSCRIPTION = gql`
    subscription payrollSubscription {
      payrolls {
        id
        name
        status
        updated_at
      }
    }
  `;
  
  return (
    <RealTimeUpdates
      subscription={PAYROLLS_SUBSCRIPTION}
      refetchQueries={refetchQueries}
      showToasts={showToasts}
      onUpdate={onUpdate}
    />
  );
}