/**
 * Example: Optimized Detail Page Implementation
 * 
 * Demonstrates how to eliminate query waterfalls in detail pages
 * using the QueryOptimizer utility
 */

'use client';

import { useApolloClient } from '@apollo/client';
import React from 'react';
import { QueryOptimizer, useOptimizedQueries } from '../query-optimization';

// Example GraphQL documents (these would be imported from generated files)
const GET_PAYROLL_DETAILS = `
  query GetPayrollDetails($id: uuid!) {
    payrollById(id: $id) {
      id
      name
      status
      client {
        id
        name
      }
    }
  }
`;

const GET_PAYROLL_DATES = `
  query GetPayrollDates($payrollId: uuid!) {
    payrollDates(where: { payrollId: { _eq: $payrollId } }) {
      id
      type
      originalDate
      adjustedDate
    }
  }
`;

const GET_STAFF_ASSIGNMENTS = `
  query GetStaffAssignments($payrollId: uuid!) {
    payrollAssignments(where: { payrollId: { _eq: $payrollId } }) {
      id
      staffUser {
        id
        name
        email
      }
      role
    }
  }
`;

interface OptimizedPayrollDetailPageProps {
  payrollId: string;
}

export function OptimizedPayrollDetailPage({ payrollId }: OptimizedPayrollDetailPageProps) {
  const apolloClient = useApolloClient();

  // Traditional approach (creates waterfall):
  // const { data: payroll } = useQuery(GET_PAYROLL_DETAILS, { variables: { id: payrollId } });
  // const { data: dates } = useQuery(GET_PAYROLL_DATES, { variables: { payrollId } });
  // const { data: staff } = useQuery(GET_STAFF_ASSIGNMENTS, { variables: { payrollId } });

  // Optimized approach (parallel execution):
  const queryConfig = QueryOptimizer.createDetailPageQueries(
    {
      payrollDetails: GET_PAYROLL_DETAILS,
      payrollDates: GET_PAYROLL_DATES,
      staffAssignments: GET_STAFF_ASSIGNMENTS,
    },
    {
      payrollDetails: { id: payrollId },
      payrollDates: { payrollId },
      staffAssignments: { payrollId },
    },
    {
      prioritizeMain: 'payrollDetails',
      maxConcurrent: 3,
      timeoutMs: 8000,
    }
  );

  const { loading, data, errors } = useOptimizedQueries(
    apolloClient,
    queryConfig,
    [payrollId]
  );

  if (loading) {
    return <DetailPageSkeleton />;
  }

  if (errors.length > 0) {
    return <ErrorBoundary errors={errors} />;
  }

  const [payrollResult, datesResult, staffResult] = data || [];

  return (
    <div className="space-y-6">
      <PayrollHeader payroll={payrollResult?.data?.payrollById} />
      <PayrollDatesSection dates={datesResult?.data?.payrollDates} />
      <StaffAssignmentsSection assignments={staffResult?.data?.payrollAssignments} />
    </div>
  );
}

// Alternative: Manual optimization for complex scenarios
export function ManuallyOptimizedPayrollPage({ payrollId }: OptimizedPayrollDetailPageProps) {
  const apolloClient = useApolloClient();
  const [state, setState] = React.useState({
    loading: true,
    payroll: null,
    dates: null,
    staff: null,
    errors: [],
  });

  React.useEffect(() => {
    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true }));

      try {
        // Execute all queries in parallel
        const [payrollResult, datesResult, staffResult] = await Promise.allSettled([
          apolloClient.query({
            query: GET_PAYROLL_DETAILS,
            variables: { id: payrollId },
            fetchPolicy: 'cache-first',
          }),
          apolloClient.query({
            query: GET_PAYROLL_DATES,
            variables: { payrollId },
            fetchPolicy: 'cache-first',
          }),
          apolloClient.query({
            query: GET_STAFF_ASSIGNMENTS,
            variables: { payrollId },
            fetchPolicy: 'cache-first',
          }),
        ]);

        const errors: any[] = [];
        const payroll = payrollResult.status === 'fulfilled' ? payrollResult.value.data : null;
        const dates = datesResult.status === 'fulfilled' ? datesResult.value.data : null;
        const staff = staffResult.status === 'fulfilled' ? staffResult.value.data : null;

        if (payrollResult.status === 'rejected') errors.push(payrollResult.reason);
        if (datesResult.status === 'rejected') errors.push(datesResult.reason);
        if (staffResult.status === 'rejected') errors.push(staffResult.reason);

        setState({
          loading: false,
          payroll,
          dates,
          staff,
          errors,
        });
      } catch (error) {
        setState({
          loading: false,
          payroll: null,
          dates: null,
          staff: null,
          errors: [error],
        });
      }
    };

    loadData();
  }, [payrollId, apolloClient]);

  if (state.loading) {
    return <DetailPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PayrollHeader payroll={state.payroll?.payrollById} />
      <PayrollDatesSection dates={state.dates?.payrollDates} />
      <StaffAssignmentsSection assignments={state.staff?.payrollAssignments} />
      {state.errors.length > 0 && <ErrorSection errors={state.errors} />}
    </div>
  );
}

// Performance monitoring example
export function useQueryPerformanceMonitoring() {
  const monitor = React.useMemo(() => QueryOptimizer.monitorQueryPerformance(), []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const stats = monitor.getStats();
      const slowQueries = monitor.getSlowQueries();

      if (slowQueries.length > 0) {
        console.warn('Performance Report:', {
          averageQueryTime: stats.averageQueryTime,
          totalQueries: stats.totalQueries,
          failedQueries: stats.failedQueries,
          recentSlowQueries: slowQueries.slice(-5),
        });
      }
    }, 30000); // Report every 30 seconds

    return () => clearInterval(interval);
  }, [monitor]);

  return monitor;
}

// Component skeletons and helpers
function DetailPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-md w-1/3"></div>
      <div className="h-64 bg-gray-200 rounded-lg"></div>
      <div className="h-32 bg-gray-200 rounded-lg"></div>
    </div>
  );
}

function ErrorBoundary({ errors }: { errors: any[] }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 className="text-red-800 font-medium">Error Loading Data</h3>
      <ul className="mt-2 text-sm text-red-700">
        {errors.map((error, index) => (
          <li key={index}>{error.message || 'Unknown error'}</li>
        ))}
      </ul>
    </div>
  );
}

function ErrorSection({ errors }: { errors: any[] }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h4 className="text-yellow-800 font-medium">Partial Data Loaded</h4>
      <p className="text-sm text-yellow-700">
        Some sections failed to load but the page remains functional.
      </p>
    </div>
  );
}

// Placeholder components
function PayrollHeader({ payroll }: { payroll: any }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold">{payroll?.name || 'Loading...'}</h1>
      <p className="text-gray-600">Client: {payroll?.client?.name || 'Loading...'}</p>
    </div>
  );
}

function PayrollDatesSection({ dates }: { dates: any[] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Important Dates</h2>
      {dates?.length > 0 ? (
        <div className="space-y-2">
          {dates.map((date: any) => (
            <div key={date.id} className="flex justify-between">
              <span>{date.type}</span>
              <span>{date.adjustedDate || date.originalDate}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No dates available</p>
      )}
    </div>
  );
}

function StaffAssignmentsSection({ assignments }: { assignments: any[] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Staff Assignments</h2>
      {assignments?.length > 0 ? (
        <div className="space-y-2">
          {assignments.map((assignment: any) => (
            <div key={assignment.id} className="flex justify-between">
              <span>{assignment.staffUser?.name}</span>
              <span className="text-sm text-gray-600">{assignment.role}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No staff assigned</p>
      )}
    </div>
  );
}