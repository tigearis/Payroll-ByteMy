"use client";

import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { GetBillingDashboardCompleteDocument } from "../graphql/generated/graphql";
import type { 
  GetBillingDashboardCompleteQuery, 
  BillingItemsBoolExp,
  BillingItemsOrderBy
} from "../graphql/generated/graphql";

interface UseBillingDataOptions {
  limit?: number;
  offset?: number;
  orderBy?: BillingItemsOrderBy[];
  timeRangeFilter?: BillingItemsBoolExp;
  statsFilter?: BillingItemsBoolExp;
  pollInterval?: number;
}

interface UseBillingDataReturn {
  // Core data
  billingItems: NonNullable<GetBillingDashboardCompleteQuery['billingItems']>;
  recentBillingItems: NonNullable<GetBillingDashboardCompleteQuery['recentBillingItems']>;
  activeClients: NonNullable<GetBillingDashboardCompleteQuery['activeClients']>;
  recurringServices: NonNullable<GetBillingDashboardCompleteQuery['recurringServices']>;
  staffUsers: NonNullable<GetBillingDashboardCompleteQuery['staffUsers']>;
  
  // Analytics data
  recentTimeEntries: NonNullable<GetBillingDashboardCompleteQuery['recentTimeEntries']>;
  payrollDatesReadyForBilling: NonNullable<GetBillingDashboardCompleteQuery['payrollDatesReadyForBilling']>;
  
  // Computed metrics
  metrics: {
    totalRevenue: number;
    pendingRevenue: number;
    approvedRevenue: number;
    draftRevenue: number;
    totalItems: number;
    pendingCount: number;
    approvedCount: number;
    draftCount: number;
    activeClientsCount: number;
    completionRate: number;
    averageItemValue: number;
    payrollCompletionRate: number;
  };
  
  // Loading and error states
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useBillingData(options: UseBillingDataOptions = {}): UseBillingDataReturn {
  const router = useRouter();
  
  const {
    limit = 50,
    offset = 0,
    orderBy = [{ createdAt: "DESC" }],
    timeRangeFilter = {},
    statsFilter = {},
    pollInterval
  } = options;

  // Calculate required date variables
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);

  const { data, loading, error, refetch } = useQuery(GetBillingDashboardCompleteDocument, {
    variables: {
      limit,
      offset,
      orderBy,
      timeRangeFilter,
      statsFilter,
      sevenDaysAgo: sevenDaysAgo.toISOString(),
      currentMonthStart: currentMonthStart.toISOString(),
      sevenDaysAgoDate: sevenDaysAgo.toISOString().split('T')[0],
      thirtyDaysAgoDate: thirtyDaysAgo.toISOString().split('T')[0]
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: false,
    errorPolicy: "all",
    ...(pollInterval && { pollInterval })
  });

  // Memoized computed metrics to prevent unnecessary recalculations
  const metrics = useMemo(() => {
    const billingStats = data?.billingStats?.aggregate;
    const pendingStats = data?.pendingStats?.aggregate;
    const approvedStats = data?.approvedStats?.aggregate;
    const draftStats = data?.draftStats?.aggregate;
    const payrollStats = data?.payrollCompletionStats?.aggregate;
    const completedPayrollStats = data?.completedPayrollDates?.aggregate;

    const totalRevenue = billingStats?.sum?.amount || 0;
    const pendingRevenue = pendingStats?.sum?.amount || 0;
    const approvedRevenue = approvedStats?.sum?.amount || 0;
    const draftRevenue = draftStats?.sum?.amount || 0;
    
    const totalItems = billingStats?.count || 0;
    const pendingCount = pendingStats?.count || 0;
    const approvedCount = approvedStats?.count || 0;
    const draftCount = draftStats?.count || 0;
    
    const activeClientsCount = data?.activeClients?.length || 0;
    const completionRate = totalItems > 0 ? (approvedCount / totalItems) * 100 : 0;
    const averageItemValue = totalItems > 0 ? totalRevenue / totalItems : 0;
    
    const totalPayrollDates = payrollStats?.count || 0;
    const completedPayrollDates = completedPayrollStats?.count || 0;
    const payrollCompletionRate = totalPayrollDates > 0 ? (completedPayrollDates / totalPayrollDates) * 100 : 0;

    return {
      totalRevenue,
      pendingRevenue,
      approvedRevenue,
      draftRevenue,
      totalItems,
      pendingCount,
      approvedCount,
      draftCount,
      activeClientsCount,
      completionRate,
      averageItemValue,
      payrollCompletionRate
    };
  }, [data]);

  // Convert Apollo errors to regular Error objects
  const processedError = useMemo(() => {
    if (!error) return null;
    
    // Handle GraphQL errors
    if (error.graphQLErrors?.length > 0) {
      return new Error(error.graphQLErrors[0].message);
    }
    
    // Handle network errors
    if (error.networkError) {
      return new Error(`Network error: ${error.networkError.message}`);
    }
    
    return new Error(error.message || 'An unknown error occurred');
  }, [error]);

  return {
    // Core data with fallbacks
    billingItems: data?.billingItems || [],
    recentBillingItems: data?.recentBillingItems || [],
    activeClients: data?.activeClients || [],
    recurringServices: data?.recurringServices || [],
    staffUsers: data?.staffUsers || [],
    
    // Analytics data
    recentTimeEntries: data?.recentTimeEntries || [],
    payrollDatesReadyForBilling: data?.payrollDatesReadyForBilling || [],
    
    // Computed metrics
    metrics,
    
    // Loading and error states
    loading,
    error: processedError,
    refetch
  };
}

// Helper hook for filtering billing data by time range
export function useBillingDataWithTimeRange(days: number = 30) {
  // Calculate the date in JavaScript instead of using raw SQL
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0); // Set to start of day
  
  const timeRangeFilter: BillingItemsBoolExp = {
    createdAt: {
      _gte: startDate.toISOString()
    }
  };

  return useBillingData({
    timeRangeFilter,
    statsFilter: timeRangeFilter
  });
}

// Helper hook for client-specific billing data
export function useBillingDataForClient(clientId: string, options: UseBillingDataOptions = {}) {
  const clientFilter: BillingItemsBoolExp = {
    clientId: { _eq: clientId }
  };

  const combinedFilter: BillingItemsBoolExp = options.timeRangeFilter
    ? { _and: [clientFilter, options.timeRangeFilter] }
    : clientFilter;

  return useBillingData({
    ...options,
    timeRangeFilter: combinedFilter,
    statsFilter: combinedFilter
  });
}

// Helper hook for staff-specific billing data
export function useBillingDataForStaff(staffUserId: string, options: UseBillingDataOptions = {}) {
  const staffFilter: BillingItemsBoolExp = {
    staffUserId: { _eq: staffUserId }
  };

  const combinedFilter: BillingItemsBoolExp = options.timeRangeFilter
    ? { _and: [staffFilter, options.timeRangeFilter] }
    : staffFilter;

  return useBillingData({
    ...options,
    timeRangeFilter: combinedFilter,
    statsFilter: combinedFilter
  });
}