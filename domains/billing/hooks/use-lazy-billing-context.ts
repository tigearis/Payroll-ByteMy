// domains/billing/hooks/use-lazy-billing-context.ts
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import React from "react";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

// ====================================================================
// LAZY-LOADED BILLING CONTEXT HOOKS
// These queries load on-demand for dropdowns, filters, and secondary features
// Performance strategy: Only load when actually needed by user interaction
// ====================================================================

// Client context for billing operations
const GET_CLIENTS_BILLING_CONTEXT = gql`
  query GetClientsBillingContext(
    $activeOnly: Boolean = true
    $limit: Int = 50
  ) {
    clients(
      limit: $limit
      where: { active: { _eq: $activeOnly } }
      orderBy: { name: ASC }
    ) {
      id
      name
      contactEmail
      active
      monthlyBillingCount: billingItems_aggregate(
        where: {
          createdAt: {
            _gte: "date_trunc('month', now())"
          }
        }
      ) {
        aggregate {
          count
          sum { amount }
        }
      }
    }
  }
`;

// Services context for recurring billing
const GET_SERVICES_DASHBOARD_CONTEXT = gql`
  query GetServicesDashboardContext(
    $includeRecurring: Boolean = true
  ) {
    services(
      where: {
        _and: [
          { isActive: { _eq: true } }
          { 
            _if: $includeRecurring,
            _then: { chargeBasis: { _in: ["per_client_monthly", "per_payroll_monthly"] } }
            _else: {}
          }
        ]
      }
      orderBy: [{ category: ASC }, { name: ASC }]
    ) {
      id
      name
      baseRate
      category
      chargeBasis
      serviceType
      usageThisMonth: billingItems_aggregate(
        where: {
          createdAt: {
            _gte: "date_trunc('month', now())"
          }
        }
      ) {
        aggregate {
          count
          sum { amount }
        }
      }
    }
  }
`;

// Payroll integration status
const GET_PAYROLL_BILLING_STATUS = gql`
  query GetPayrollBillingStatus(
    $recentDays: Int = 7
    $limit: Int = 10
  ) {
    payrollDatesReadyForBilling: payrollDates(
      where: {
        _and: [
          { status: { _eq: "completed" } }
          { adjustedEftDate: { _gte: "date_trunc('day', now() - interval '$recentDays days')" } }
          { 
            _not: { 
              billingItems: { 
                status: { _in: ["confirmed", "approved"] } 
              } 
            } 
          }
        ]
      }
      limit: $limit
      orderBy: { completedAt: DESC }
    ) {
      id
      payrollId
      adjustedEftDate
      completedAt
      payroll {
        id
        name
        client {
          id
          name
        }
        primaryConsultant {
          id
          computedName
        }
      }
    }
    
    completionStats: payrollDatesAggregate(
      where: { 
        adjustedEftDate: { _gte: "date_trunc('day', now() - interval '30 days')" }
        status: { _eq: "completed" }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

// Time tracking overview
const GET_TIME_TRACKING_DASHBOARD = gql`
  query GetTimeTrackingDashboard(
    $recentDays: Int = 7
    $limit: Int = 15
  ) {
    recentTimeEntries: timeEntries(
      where: {
        workDate: {
          _gte: "date_trunc('day', now() - interval '$recentDays days')"
        }
      }
      limit: $limit
      orderBy: { workDate: DESC }
    ) {
      id
      hoursSpent
      workDate
      description
      client {
        id
        name
      }
      staffUser {
        id
        computedName
      }
    }
    
    timeTrackingSummary: timeEntriesAggregate(
      where: {
        workDate: {
          _gte: "date_trunc('day', now() - interval '$recentDays days')"
        }
      }
    ) {
      aggregate {
        count
        sum { hoursSpent }
      }
    }
  }
`;

// Staff billing context
const GET_STAFF_BILLING_CONTEXT = gql`
  query GetStaffBillingContext(
    $activeOnly: Boolean = true
    $roles: [String!] = ["consultant", "manager", "org_admin"]
  ) {
    staffUsers: users(
      where: { 
        isActive: { _eq: $activeOnly }
        role: { _in: $roles }
      }
      orderBy: [{ firstName: ASC }, { lastName: ASC }]
    ) {
      id
      firstName
      lastName
      computedName
      email
      role
      monthlyContribution: billingItems_aggregate(
        where: {
          createdAt: {
            _gte: "date_trunc('month', now())"
          }
        }
      ) {
        aggregate {
          count
          sum { amount }
        }
      }
    }
  }
`;

// ====================================================================
// LAZY-LOADED HOOKS
// ====================================================================

export interface LazyLoadOptions {
  enabled?: boolean;
  skip?: boolean;
}

/**
 * Lazy-loaded client context for billing operations
 * Only loads when dropdowns or filters are opened
 */
export const useClientsBillingContext = (options: LazyLoadOptions & {
  activeOnly?: boolean;
  limit?: number;
} = {}) => {
  const { enabled = false, skip = false, activeOnly = true, limit = 50 } = options;
  
  const startTime = performance.now();
  
  const result = useQuery(GET_CLIENTS_BILLING_CONTEXT, {
    variables: { activeOnly, limit },
    skip: !enabled || skip,
    fetchPolicy: "cache-first",
    errorPolicy: "all",
    onCompleted: (data) => {
      const duration = performance.now() - startTime;
      logger.info('Clients billing context loaded', {
        namespace: 'billing_dashboard',
        operation: 'fetch_clients_context',
        classification: DataClassification.INTERNAL,
        metadata: {
          clientCount: data?.clients?.length || 0,
          activeOnly,
          durationMs: Math.round(duration),
          timestamp: new Date().toISOString()
        }
      });
    },
    onError: (error) => {
      const duration = performance.now() - startTime;
      logger.error('Clients billing context failed', {
        namespace: 'billing_dashboard',
        operation: 'fetch_clients_context',
        classification: DataClassification.INTERNAL,
        error: error.message,
        metadata: {
          durationMs: Math.round(duration),
          errorName: error.name,
          timestamp: new Date().toISOString()
        }
      });
    }
  });

  return {
    ...result,
    clients: result.data?.clients || []
  };
};

/**
 * Lazy-loaded services context for recurring billing
 */
export const useServicesDashboardContext = (options: LazyLoadOptions & {
  includeRecurring?: boolean;
} = {}) => {
  const { enabled = false, skip = false, includeRecurring = true } = options;
  
  const startTime = performance.now();
  
  const result = useQuery(GET_SERVICES_DASHBOARD_CONTEXT, {
    variables: { includeRecurring },
    skip: !enabled || skip,
    fetchPolicy: "cache-first",
    errorPolicy: "all",
    onCompleted: (data) => {
      const duration = performance.now() - startTime;
      logger.info('Services dashboard context loaded', {
        namespace: 'billing_dashboard',
        operation: 'fetch_services_context',
        classification: DataClassification.INTERNAL,
        metadata: {
          serviceCount: data?.services?.length || 0,
          includeRecurring,
          durationMs: Math.round(duration),
          timestamp: new Date().toISOString()
        }
      });
    },
    onError: (error) => {
      const duration = performance.now() - startTime;
      logger.error('Services dashboard context failed', {
        namespace: 'billing_dashboard',
        operation: 'fetch_services_context',
        classification: DataClassification.INTERNAL,
        error: error.message,
        metadata: {
          durationMs: Math.round(duration),
          errorName: error.name,
          timestamp: new Date().toISOString()
        }
      });
    }
  });

  return {
    ...result,
    services: result.data?.services || []
  };
};

/**
 * Lazy-loaded payroll billing status
 */
export const usePayrollBillingStatus = (options: LazyLoadOptions & {
  recentDays?: number;
  limit?: number;
} = {}) => {
  const { enabled = false, skip = false, recentDays = 7, limit = 10 } = options;
  
  const startTime = performance.now();
  
  const result = useQuery(GET_PAYROLL_BILLING_STATUS, {
    variables: { recentDays, limit },
    skip: !enabled || skip,
    fetchPolicy: "cache-first",
    errorPolicy: "all",
    onCompleted: (data) => {
      const duration = performance.now() - startTime;
      logger.info('Payroll billing status loaded', {
        namespace: 'billing_dashboard',
        operation: 'fetch_payroll_status',
        classification: DataClassification.INTERNAL,
        metadata: {
          readyForBillingCount: data?.payrollDatesReadyForBilling?.length || 0,
          completedCount: data?.completionStats?.aggregate?.count || 0,
          durationMs: Math.round(duration),
          timestamp: new Date().toISOString()
        }
      });
    },
    onError: (error) => {
      const duration = performance.now() - startTime;
      logger.error('Payroll billing status failed', {
        namespace: 'billing_dashboard',
        operation: 'fetch_payroll_status',
        classification: DataClassification.INTERNAL,
        error: error.message,
        metadata: {
          durationMs: Math.round(duration),
          errorName: error.name,
          timestamp: new Date().toISOString()
        }
      });
    }
  });

  return {
    ...result,
    payrollDatesReady: result.data?.payrollDatesReadyForBilling || [],
    completionStats: result.data?.completionStats?.aggregate || { count: 0 }
  };
};

/**
 * Lazy-loaded time tracking dashboard
 */
export const useTimeTrackingDashboard = (options: LazyLoadOptions & {
  recentDays?: number;
  limit?: number;
} = {}) => {
  const { enabled = false, skip = false, recentDays = 7, limit = 15 } = options;
  
  const startTime = performance.now();
  
  const result = useQuery(GET_TIME_TRACKING_DASHBOARD, {
    variables: { recentDays, limit },
    skip: !enabled || skip,
    fetchPolicy: "cache-first",
    errorPolicy: "all",
    onCompleted: (data) => {
      const duration = performance.now() - startTime;
      logger.info('Time tracking dashboard loaded', {
        namespace: 'billing_dashboard',
        operation: 'fetch_time_tracking',
        classification: DataClassification.INTERNAL,
        metadata: {
          entriesCount: data?.recentTimeEntries?.length || 0,
          totalHours: data?.timeTrackingSummary?.aggregate?.sum?.hoursSpent || 0,
          durationMs: Math.round(duration),
          timestamp: new Date().toISOString()
        }
      });
    },
    onError: (error) => {
      const duration = performance.now() - startTime;
      logger.error('Time tracking dashboard failed', {
        namespace: 'billing_dashboard',
        operation: 'fetch_time_tracking',
        classification: DataClassification.INTERNAL,
        error: error.message,
        metadata: {
          durationMs: Math.round(duration),
          errorName: error.name,
          timestamp: new Date().toISOString()
        }
      });
    }
  });

  return {
    ...result,
    recentTimeEntries: result.data?.recentTimeEntries || [],
    timeTrackingSummary: {
      count: result.data?.timeTrackingSummary?.aggregate?.count || 0,
      totalHours: result.data?.timeTrackingSummary?.aggregate?.sum?.hoursSpent || 0
    }
  };
};

/**
 * Lazy-loaded staff billing context
 */
export const useStaffBillingContext = (options: LazyLoadOptions & {
  activeOnly?: boolean;
  roles?: string[];
} = {}) => {
  const { 
    enabled = false, 
    skip = false, 
    activeOnly = true, 
    roles = ["consultant", "manager", "org_admin"] 
  } = options;
  
  const startTime = performance.now();
  
  const result = useQuery(GET_STAFF_BILLING_CONTEXT, {
    variables: { activeOnly, roles },
    skip: !enabled || skip,
    fetchPolicy: "cache-first",
    errorPolicy: "all",
    onCompleted: (data) => {
      const duration = performance.now() - startTime;
      logger.info('Staff billing context loaded', {
        namespace: 'billing_dashboard',
        operation: 'fetch_staff_context',
        classification: DataClassification.INTERNAL,
        metadata: {
          staffCount: data?.staffUsers?.length || 0,
          roles,
          durationMs: Math.round(duration),
          timestamp: new Date().toISOString()
        }
      });
    },
    onError: (error) => {
      const duration = performance.now() - startTime;
      logger.error('Staff billing context failed', {
        namespace: 'billing_dashboard',
        operation: 'fetch_staff_context',
        classification: DataClassification.INTERNAL,
        error: error.message,
        metadata: {
          durationMs: Math.round(duration),
          errorName: error.name,
          timestamp: new Date().toISOString()
        }
      });
    }
  });

  return {
    ...result,
    staffUsers: result.data?.staffUsers || []
  };
};

/**
 * Comprehensive lazy context manager
 * Provides control over when secondary data is loaded
 */
export const useLazyBillingContextManager = () => {
  const [enabledContexts, setEnabledContexts] = React.useState<{
    clients: boolean;
    services: boolean;
    payrollStatus: boolean;
    timeTracking: boolean;
    staffContext: boolean;
  }>({
    clients: false,
    services: false,
    payrollStatus: false,
    timeTracking: false,
    staffContext: false
  });

  const enableContext = React.useCallback((context: keyof typeof enabledContexts) => {
    setEnabledContexts(prev => ({ ...prev, [context]: true }));
    logger.info('Lazy billing context enabled', {
      namespace: 'billing_dashboard',
      operation: 'enable_lazy_context',
      classification: DataClassification.INTERNAL,
      metadata: {
        context,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  const disableContext = React.useCallback((context: keyof typeof enabledContexts) => {
    setEnabledContexts(prev => ({ ...prev, [context]: false }));
    logger.info('Lazy billing context disabled', {
      namespace: 'billing_dashboard',
      operation: 'disable_lazy_context',
      classification: DataClassification.INTERNAL,
      metadata: {
        context,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  // Load contexts based on enabled state
  const clientsContext = useClientsBillingContext({ enabled: enabledContexts.clients });
  const servicesContext = useServicesDashboardContext({ enabled: enabledContexts.services });
  const payrollStatusContext = usePayrollBillingStatus({ enabled: enabledContexts.payrollStatus });
  const timeTrackingContext = useTimeTrackingDashboard({ enabled: enabledContexts.timeTracking });
  const staffContext = useStaffBillingContext({ enabled: enabledContexts.staffContext });

  return {
    contexts: {
      clients: clientsContext,
      services: servicesContext,
      payrollStatus: payrollStatusContext,
      timeTracking: timeTrackingContext,
      staff: staffContext
    },
    enabled: enabledContexts,
    enableContext,
    disableContext,
    enableAll: () => {
      setEnabledContexts({
        clients: true,
        services: true,
        payrollStatus: true,
        timeTracking: true,
        staffContext: true
      });
    },
    disableAll: () => {
      setEnabledContexts({
        clients: false,
        services: false,
        payrollStatus: false,
        timeTracking: false,
        staffContext: false
      });
    }
  };
};