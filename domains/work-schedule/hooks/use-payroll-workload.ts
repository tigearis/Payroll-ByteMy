"use client";

import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { addDays, format, subDays, isWeekend } from "date-fns";
import React from "react";
import {
  GetConsultantPayrollWorkloadDocument,
  GetPayrollWorkloadStatsDocument,
  type GetConsultantPayrollWorkloadQuery,
  type GetPayrollWorkloadStatsQuery,
} from "../graphql/generated/graphql";

// GraphQL query for holidays  
const GET_HOLIDAYS_QUERY = gql`
  query GetHolidays($startDate: date!, $endDate: date!, $countryCode: bpchar!) {
    holidays(
      where: {
        date: { _gte: $startDate, _lte: $endDate }
        countryCode: { _eq: $countryCode }
      }
    ) {
      id
      date
      name
      localName
      isFixed
      countryCode
    }
  }
`;

interface UsePayrollWorkloadOptions {
  userId: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  enabled?: boolean;
}

interface WorkScheduleDay {
  date: string;
  workHours: number;
  adminTimeHours: number;
  payrollCapacityHours: number;
  assignments: Array<{
    id: string;
    name: string;
    clientName: string;
    processingTime: number;
    processingDaysBeforeEft: number;
    eftDate: string;
    status: "active" | "pending" | "completed";
    priority: "high" | "medium" | "low";
  }>;
}

// Helper function to check if a date is a business day (not weekend and not holiday)
function isBusinessDay(date: Date, holidays: any[]): boolean {
  if (isWeekend(date)) {
    return false;
  }
  
  const dateStr = format(date, 'yyyy-MM-dd');
  const isHoliday = holidays.some(holiday => holiday.date === dateStr);
  
  return !isHoliday;
}

// Map database payroll status to simplified status for visualization
function mapPayrollStatus(status: string): "active" | "pending" | "completed" {
  switch (status) {
    case "Active":
    case "approved":
      return "active";
    case "Implementation":
    case "draft":
    case "pending_approval":
    case "processing":
      return "pending";
    case "completed":
    case "failed":
    case "Inactive":
      return "completed";
    default:
      return "pending";
  }
}

export function usePayrollWorkload({
  userId,
  dateRange,
  enabled = true,
}: UsePayrollWorkloadOptions) {
  // Default to current week if no range provided
  const defaultStartDate = subDays(new Date(), 7);
  const defaultEndDate = addDays(new Date(), 30);
  
  const startDate = dateRange?.startDate || defaultStartDate;
  const endDate = dateRange?.endDate || defaultEndDate;
  
  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('usePayrollWorkload - inputs:', {
      userId,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      enabled
    });
  }

  // Main workload query
  const {
    data: workloadData,
    loading: workloadLoading,
    error: workloadError,
    refetch: refetchWorkload,
  } = useQuery<GetConsultantPayrollWorkloadQuery>(
    GetConsultantPayrollWorkloadDocument,
    {
      variables: {
        userId,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      },
      skip: !enabled || !userId,
      errorPolicy: "all",
    }
  );

  // Holidays query for business day calculations
  const {
    data: holidaysData,
    loading: holidaysLoading,
    error: holidaysError,
  } = useQuery(GET_HOLIDAYS_QUERY, {
    variables: {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      countryCode: 'AU', // Australian holidays
    },
    skip: !enabled,
    errorPolicy: "all",
  });

  // Stats query
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
  } = useQuery<GetPayrollWorkloadStatsQuery>(
    GetPayrollWorkloadStatsDocument,
    {
      variables: {
        userId,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      },
      skip: !enabled || !userId,
      errorPolicy: "all",
    }
  );

  // Debug errors
  if (workloadError && typeof window !== 'undefined') {
    console.error('usePayrollWorkload - workload query error:', workloadError);
  }
  if (statsError && typeof window !== 'undefined') {
    console.error('usePayrollWorkload - stats query error:', statsError);
  }

  // Transform the data into the format expected by the visualization component
  const workSchedule: WorkScheduleDay[] = React.useMemo(() => {
    if (!workloadData) return [];

    // Safely destructure with defaults
    const schedules = workloadData.workSchedule || [];
    const primaryPayrolls = workloadData.primaryPayrolls || [];
    const backupPayrolls = workloadData.backupPayrolls || [];
    const allPayrolls = [...(primaryPayrolls || []), ...(backupPayrolls || [])];
    const holidays = holidaysData?.holidays || [];

    // Create a map of dates to assignments
    const assignmentsByDate = new Map<string, Array<{
      id: string;
      name: string;
      clientName: string;
      processingTime: number;
      processingDaysBeforeEft: number;
      eftDate: string;
      status: "active" | "pending" | "completed";
      priority: "high" | "medium" | "low";
    }>>();

    // Process payroll dates and distribute processing time across working days
    allPayrolls.forEach((payroll) => {
      payroll.payrollDates?.forEach((dateEntry) => {
        if (dateEntry.originalEftDate) {
          const eftDate = new Date(dateEntry.originalEftDate);
          const processingDaysBeforeEft = payroll.processingDaysBeforeEft || 1;
          const totalProcessingTime = payroll.processingTime || 0;
          
          // Calculate the date range for processing (working backwards from EFT date)
          const processingEndDate = new Date(eftDate);
          processingEndDate.setDate(processingEndDate.getDate() - 1); // Day before EFT
          const processingStartDate = new Date(processingEndDate);
          processingStartDate.setDate(processingStartDate.getDate() - (processingDaysBeforeEft - 1));
          
          // Find all working days in the processing period for this consultant
          const workingDaysInPeriod: Array<{date: Date, dayName: string, capacity: number}> = [];
          const currentProcessingDate = new Date(processingStartDate);
          
          while (currentProcessingDate <= processingEndDate) {
            const dayName = format(currentProcessingDate, "EEEE");
            const schedule = schedules?.find((s: any) => s.workDay === dayName);
            
            // Only include days that are business days (not weekends/holidays) and have capacity
            if (schedule && 
                (schedule.payrollCapacityHours || 0) > 0 && 
                isBusinessDay(currentProcessingDate, holidays)) {
              workingDaysInPeriod.push({
                date: new Date(currentProcessingDate),
                dayName,
                capacity: schedule.payrollCapacityHours || 0
              });
            }
            
            currentProcessingDate.setDate(currentProcessingDate.getDate() + 1);
          }
          
          // Calculate total capacity for proportional distribution
          const totalCapacity = workingDaysInPeriod.reduce((sum, day) => sum + day.capacity, 0);
          
          // Distribute processing time proportionally across working days
          if (totalCapacity > 0) {
            workingDaysInPeriod.forEach(workDay => {
              const dateStr = format(workDay.date, "yyyy-MM-dd");
              const proportionalTime = (workDay.capacity / totalCapacity) * totalProcessingTime;
              
              if (!assignmentsByDate.has(dateStr)) {
                assignmentsByDate.set(dateStr, []);
              }
              
              assignmentsByDate.get(dateStr)!.push({
                id: payroll.id,
                name: payroll.name,
                clientName: payroll.client.name,
                processingTime: proportionalTime,
                processingDaysBeforeEft: payroll.processingDaysBeforeEft || 0,
                eftDate: dateEntry.originalEftDate,
                status: mapPayrollStatus(payroll.status),
                priority: "medium", // Default priority since it's not in schema
              });
            });
          } else if (dateEntry.processingDate) {
            // Fallback: If no working days found, use the single processing date
            const processingDateStr = format(new Date(dateEntry.processingDate), "yyyy-MM-dd");
            
            if (!assignmentsByDate.has(processingDateStr)) {
              assignmentsByDate.set(processingDateStr, []);
            }
            
            assignmentsByDate.get(processingDateStr)!.push({
              id: payroll.id,
              name: payroll.name,
              clientName: payroll.client.name,
              processingTime: totalProcessingTime,
              processingDaysBeforeEft: payroll.processingDaysBeforeEft || 0,
              eftDate: dateEntry.originalEftDate,
              status: mapPayrollStatus(payroll.status),
              priority: "medium",
            });
          }
        }
      });
    });

    // Generate work schedule days for the date range
    const result: WorkScheduleDay[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      const dayName = format(currentDate, "EEEE");
      
      // Find matching work schedule for this day of week
      const schedule = schedules?.find((s: any) => s.workDay === dayName);
      
      result.push({
        date: dateStr,
        workHours: schedule?.workHours || 0,
        adminTimeHours: schedule?.adminTimeHours || 0,
        payrollCapacityHours: schedule?.payrollCapacityHours || 0,
        assignments: assignmentsByDate.get(dateStr) || [],
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }, [workloadData, holidaysData, startDate, endDate]);

  const user = workloadData?.usersByPk;
  const workScheduleStats = statsData?.workScheduleStats?.aggregate;
  const primaryPayrollStats = statsData?.primaryPayrollCount?.aggregate;
  const backupPayrollStats = statsData?.backupPayrollCount?.aggregate;
  const upcomingDatesCount = statsData?.upcomingPayrollDates?.aggregate?.count;

  return {
    // Data
    user,
    workSchedule,
    workScheduleStats,
    primaryPayrollStats,
    backupPayrollStats,
    upcomingDatesCount,
    
    // Loading states
    loading: workloadLoading || statsLoading || holidaysLoading,
    error: workloadError || statsError || holidaysError,
    
    // Actions
    refetch: refetchWorkload,
  };
}

// React import for useMemo
