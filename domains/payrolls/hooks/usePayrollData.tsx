"use client";

import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  GetPayrollDetailRedesignedDocument,
  type GetPayrollDetailRedesignedQuery,
} from "@/domains/payrolls/graphql/generated/graphql";

export interface UsePayrollDataOptions {
  redirectToLatest?: boolean;
  showErrorToast?: boolean;
  onError?: (error: Error) => void;
  onRedirect?: (latestId: string) => void;
}

export interface PayrollData {
  // Core payroll information
  payroll: NonNullable<GetPayrollDetailRedesignedQuery["payrollsByPk"]>;
  
  // Version information
  payrollFamily: GetPayrollDetailRedesignedQuery["payrollFamily"];
  latestVersion: GetPayrollDetailRedesignedQuery["latestVersion"];
  
  // Reference data for forms
  users: GetPayrollDetailRedesignedQuery["users"];
  payrollCycles: GetPayrollDetailRedesignedQuery["payrollCycles"];
  payrollDateTypes: GetPayrollDetailRedesignedQuery["payrollDateTypes"];
  
  // Computed properties
  isLatestVersion: boolean;
  needsRedirect: boolean;
  hasVersions: boolean;
  fileCount: number;
  dateCount: number;
}

export interface UsePayrollDataReturn {
  data: PayrollData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
  
  // Status flags
  isLatestVersion: boolean;
  needsRedirect: boolean;
  hasData: boolean;
  
  // Helper functions
  getLatestVersionId: () => string | null;
  getVersionNumber: () => number | null;
  isSuperseded: () => boolean;
}

/**
 * Comprehensive hook for fetching payroll detail data
 * 
 * Features:
 * - Single GraphQL query for all payroll detail data
 * - Automatic version checking and redirect logic
 * - Error handling with optional toast notifications
 * - Loading state management
 * - Computed properties for common use cases
 * 
 * @param id - Payroll ID to fetch
 * @param options - Configuration options
 */
export function usePayrollData(
  id: string,
  options: UsePayrollDataOptions = {}
): UsePayrollDataReturn {
  const {
    redirectToLatest = true,
    showErrorToast = true,
    onError,
    onRedirect,
  } = options;

  const router = useRouter();

  // Main data query - replaces multiple separate queries
  const { 
    data: queryData, 
    loading, 
    error: queryError, 
    refetch 
  } = useQuery(GetPayrollDetailRedesignedDocument, {
    variables: { id },
    skip: !id,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  // Process and validate the data
  const data = useMemo((): PayrollData | null => {
    if (!queryData || !queryData.payrollsByPk) {
      return null;
    }

    const payroll = queryData.payrollsByPk;
    const latestVersion = queryData.latestVersion?.[0];
    const payrollFamily = queryData.payrollFamily || [];

    // Determine if this is the latest version
    const isLatestVersion = !latestVersion || latestVersion.id === id;
    const needsRedirect = redirectToLatest && latestVersion && latestVersion.id !== id;
    
    // Calculate counts
    const fileCount = payroll.filesAggregate?.aggregate?.count || 0;
    const dateCount = payroll.detailPayrollDates?.length || 0;

    return {
      payroll,
      payrollFamily,
      latestVersion: queryData.latestVersion || [],
      users: queryData.users || [],
      payrollCycles: queryData.payrollCycles || [],
      payrollDateTypes: queryData.payrollDateTypes || [],
      isLatestVersion,
      needsRedirect,
      hasVersions: payrollFamily.length > 1,
      fileCount,
      dateCount,
    };
  }, [queryData, id, redirectToLatest]);

  // Handle redirect to latest version
  useEffect(() => {
    if (data?.needsRedirect && data?.latestVersion[0]) {
      const latestId = data.latestVersion[0].id;
      console.log(`🔄 Redirecting from ${id} to latest version: ${latestId}`);
      
      if (onRedirect) {
        onRedirect(latestId);
      } else {
        router.push(`/payrolls/${latestId}`);
      }
    }
  }, [data?.needsRedirect, data?.latestVersion, id, router, onRedirect]);

  // Handle errors
  const error = useMemo(() => {
    if (queryError) {
      if (queryError instanceof Error) {
        return queryError;
      }
      // Handle Apollo Error which has a message property
      if (typeof queryError === 'object' && queryError !== null && 'message' in queryError) {
        return new Error((queryError as any).message);
      }
      return new Error("An unknown error occurred");
    }
    return null;
  }, [queryError]);

  useEffect(() => {
    if (error) {
      console.error("❌ Payroll data fetch error:", error);
      
      if (onError) {
        onError(error);
      }
      
      if (showErrorToast) {
        const isNetworkError = error.message.includes('network') || error.message.includes('fetch');
        
        if (isNetworkError) {
          toast.error("Network error occurred", {
            description: "Please check your connection and try again.",
            duration: 8000,
          });
        } else {
          toast.error("Failed to load payroll data", {
            description: error.message,
            duration: 8000,
          });
        }
      }
    }
  }, [error, onError, showErrorToast]);

  // Helper functions
  const getLatestVersionId = () => data?.latestVersion?.[0]?.id || null;
  const getVersionNumber = () => data?.payroll?.versionNumber || null;
  const isSuperseded = () => !!data?.payroll?.supersededDate;

  return {
    data,
    loading,
    error,
    refetch,
    
    // Status flags
    isLatestVersion: data?.isLatestVersion || false,
    needsRedirect: data?.needsRedirect || false,
    hasData: !!data,
    
    // Helper functions
    getLatestVersionId,
    getVersionNumber,
    isSuperseded,
  };
}

export default usePayrollData;