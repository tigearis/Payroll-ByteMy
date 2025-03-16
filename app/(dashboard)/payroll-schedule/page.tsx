// app/(dashboard)/payroll-schedule/page.tsx
"use client"

import { useState, useEffect } from "react"
import {
  format,
  addMonths,
  subMonths,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isWeekend,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  addDays,
  parseISO,
  isWithinInterval
} from "date-fns"
import { ChevronLeft, ChevronRight, CalendarIcon, Download } from "lucide-react"
import { useQuery } from "@apollo/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { GET_PAYROLLS_BY_MONTH } from "@/graphql/queries/payrolls/getPayrollsByMonth"
import { GET_HOLIDAYS } from "@/graphql/queries/holidays/getHolidays"
import { useSmartPolling } from "@/hooks/usePolling"

// Types for our data
interface Leave {
  start_date: string;
  end_date: string;
  reason: string;
  leave_type: string;
  status: string;
}

interface User {
  name: string;
  leaves?: Leave[];
}

interface PayrollDate {
  processing_date: string;
  adjusted_eft_date: string;
}

interface Payroll {
  id: string;
  name: string;
  client: { name: string };
  payroll_system: string;
  status: string;
  payroll_dates: PayrollDate[];
  payroll_cycle: { name: string };
  payroll_date_type: { name: string };
  processing_time: number;
  userByPrimaryConsultantUserId: User;
  userByBackupConsultantUserId: User;
  userByManagerUserId: User;
}

interface Holiday {
  country_code: string;
  date: string;
  local_name: string;
  types: string[];
  region: string;
}

export default function PayrollSchedulePage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedClient, setSelectedClient] = useState<string>("all")
  const [selectedPayroll, setSelectedPayroll] = useState<string>("all")
  const [selectedStaff, setSelectedStaff] = useState<string>("all")
  const [view, setView] = useState<"month" | "week">("month")
  const [weekViewOrientation, setWeekViewOrientation] = useState<"daysAsRows" | "consultantsAsRows">("daysAsRows")

  // Calculate date range for query based on current view
  const startDate = view === "month" 
    ? format(startOfMonth(currentDate), "yyyy-MM-dd")
    : format(startOfWeek(currentDate), "yyyy-MM-dd")
  
  const endDate = view === "month"
    ? format(endOfMonth(currentDate), "yyyy-MM-dd") 
    : format(endOfWeek(currentDate), "yyyy-MM-dd")

  // Fetch payroll data with date range and polling
  const { 
    loading: payrollsLoading, 
    error: payrollsError, 
    data: payrollsData,
    refetch: refetchPayrolls,
    startPolling,
    stopPolling
  } = useQuery(GET_PAYROLLS_BY_MONTH, {
    variables: { 
      start_date: startDate,
      end_date: endDate
    },
    fetchPolicy: "cache-and-network", // Show cached data while fetching fresh data
    nextFetchPolicy: "cache-first",   // Use cache for repeated renders
    pollInterval: 30000               // Poll every 30 seconds
  })
// Add this after your useQuery call
useSmartPolling(
  { startPolling, stopPolling, refetch: refetchPayrolls },
  {
    defaultInterval: 30000,  // Poll every 30 seconds
    pauseOnHidden: true,     // Save resources when tab not visible
    refetchOnVisible: true   // Get fresh data when returning to tab
  }
);
  // Fetch holidays
  const {
    loading: holidaysLoading,
    error: holidaysError,
    data: holidaysData
  } = useQuery(GET_HOLIDAYS)

  // Refetch when date range changes
  useEffect(() => {
    refetchPayrolls({ 
      start_date: startDate,
      end_date: endDate
    })
  }, [startDate, endDate, refetchPayrolls])

  const loading = payrollsLoading || holidaysLoading
  const error = payrollsError || holidaysError

  if (loading) return <div>Loading payroll schedule...</div>
  if (error) return <div className="text-red-500">Error: {error.message}</div>

  const payrolls: Payroll[] = payrollsData?.payrolls || []
  const holidays: Holiday[] = holidaysData?.holidays || []

  const previousPeriod = () => {
    setCurrentDate(view === "month" ? subMonths(currentDate, 1) : subWeeks(currentDate, 1))
  }

  const nextPeriod = () => {
    setCurrentDate(view === "month" ? addMonths(currentDate, 1) : addWeeks(currentDate, 1))
  }

  // Generate days of the month or week
  const daysInPeriod = eachDayOfInterval({
    start: view === "month" ? startOfMonth(currentDate) : startOfWeek(currentDate),
    end: view === "month" ? endOfMonth(currentDate) : endOfWeek(currentDate),
  })

  // Extract unique clients from payrolls
  const clients = Array.from(
    new Map(
      payrolls
        .filter(p => p.client)
        .map(p => [p.client?.name, { id: p.client?.name, name: p.client?.name }])
    ).values()
  )

  // Function to format name (removes underscores, capitalizes, and keeps DOW/EOM/SOM uppercase)
  const formatName = (name?: string) => {
    if (!name) return "N/A"

    return name
      .replace(/_/g, " ") // Remove underscores
      .split(" ")
      .map((word) => {
        const specialCases = ["DOW", "EOM", "SOM"]
        return specialCases.includes(word.toUpperCase())
          ? word.toUpperCase() // Keep these fully capitalized
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize first letter
      })
      .join(" ")
  }

  // Get all primary consultants
  const primaryConsultants = payrolls
    .filter(p => p.userByPrimaryConsultantUserId)
    .map(p => ({
      name: p.userByPrimaryConsultantUserId.name,
      leaves: p.userByPrimaryConsultantUserId.leaves || []
    }))

  // Get all backup consultants
  const backupConsultants = payrolls
    .filter(p => p.userByBackupConsultantUserId)
    .map(p => ({
      name: p.userByBackupConsultantUserId.name,
      leaves: []  // Assuming backup consultants don't have leaves in the data
    }))

  // Combine and remove duplicates
  const allConsultants = Array.from(
    new Map(
      [...primaryConsultants, ...backupConsultants]
        .map(c => [c.name, c])
    ).values()
  )

  // Filter consultants based on selection
  const filteredConsultants = selectedStaff === "all" 
    ? allConsultants 
    : allConsultants.filter(c => c.name === selectedStaff)

  // Filter payrolls based on selections
  const filteredPayrolls = payrolls.filter(payroll => {
    const isClientMatch = selectedClient === "all" || payroll.client?.name === selectedClient
    const isPayrollMatch = selectedPayroll === "all" || payroll.id === selectedPayroll
    const isStaffMatch = selectedStaff === "all" || 
      payroll.userByPrimaryConsultantUserId?.name === selectedStaff ||
      payroll.userByBackupConsultantUserId?.name === selectedStaff
    
    return isClientMatch && isPayrollMatch && isStaffMatch
  })

  // Check if a consultant is on leave for a specific day
  const isOnLeave = (consultant: User, day: Date) => {
    if (!consultant.leaves || consultant.leaves.length === 0) return false
    
    return consultant.leaves.some(leave => {
      const leaveStart = parseISO(leave.start_date)
      const leaveEnd = parseISO(leave.end_date)
      
      return leave.status === "Approved" && 
        isWithinInterval(day, { start: leaveStart, end: leaveEnd })
    })
  }

  // Get leave details for a specific day if any
  const getLeaveDetails = (consultant: User, day: Date) => {
    if (!consultant.leaves || consultant.leaves.length === 0) return null
    
    const leave = consultant.leaves.find(leave => {
      const leaveStart = parseISO(leave.start_date)
      const leaveEnd = parseISO(leave.end_date)
      
      return leave.status === "Approved" && 
        isWithinInterval(day, { start: leaveStart, end: leaveEnd })
    })
    
    return leave || null
  }

  const renderMonthView = () => (
    <div className="relative overflow-auto max-h-[70vh]">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 z-20 bg-background">
          <tr>
            <th className="border bg-muted p-2 text-left font-medium sticky left-0 z-30">Date</th>
            {filteredConsultants.map((consultant) => (
              <th key={consultant.name} className="border p-2 text-center font-medium min-w-[180px] bg-muted">
                {consultant.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {daysInPeriod.map((day) => {
            const holiday = holidays.find((h) => isSameDay(parseISO(h.date), day) && h.country_code === "AU")
            // Highlight if it's a NSW holiday or a National holiday
            const isHighlightedHoliday = holiday && (
              (Array.isArray(holiday.region) && (holiday.region.includes("NSW") || holiday.region.includes("National"))) || 
              holiday.region === "NSW" ||
              holiday.region === "National"
            )
            const isWeekendDay = isWeekend(day)
            return (
              <tr
                key={day.toString()}
                className={cn("hover:bg-muted/50", isWeekendDay && "bg-sky-100", isHighlightedHoliday && "bg-green-100")}
              >
                <td
                  className={cn(
                    "border p-2 sticky left-0 z-10",
                    isWeekendDay ? "bg-sky-100" : "bg-background",
                    isHighlightedHoliday && "bg-green-100",
                  )}
                >
                  <div className="font-medium">{format(day, "d")}</div>
                  <div className="text-xs text-muted-foreground">{format(day, "EEE")}</div>
                  {holiday && (
                    <Badge variant="outline" className="mt-1 bg-gray-100 text-red-800 border-red-200">
                      {holiday.local_name}
                    </Badge>
                  )}
                </td>
                {filteredConsultants.map((consultant) => {
                  // Check if consultant is on leave this day
                  const consultantLeave = getLeaveDetails(consultant, day)
                  const consultantOnLeave = !!consultantLeave
                  
                  // Find payrolls where this person is the primary consultant
                  const primaryPayrolls = filteredPayrolls.filter(payroll => {
                    if (!payroll.payroll_dates || payroll.payroll_dates.length === 0) return false
                    
                    return payroll.userByPrimaryConsultantUserId?.name === consultant.name && 
                      isSameDay(parseISO(payroll.payroll_dates[0].processing_date), day)
                  })
                  
                  // Find payrolls where this person is the backup consultant and primary is on leave
                  const backupPayrolls = filteredPayrolls.filter(payroll => {
                    if (!payroll.payroll_dates || payroll.payroll_dates.length === 0) return false
                    if (!payroll.userByBackupConsultantUserId) return false
                    if (payroll.userByBackupConsultantUserId.name !== consultant.name) return false
                    
                    const primaryConsultant = payroll.userByPrimaryConsultantUserId
                    const primaryOnLeave = isOnLeave(primaryConsultant, day)
                    
                    return primaryOnLeave && 
                      isSameDay(parseISO(payroll.payroll_dates[0].processing_date), day)
                  })
                  
                  return (
                    <td 
                      key={`${consultant.name}-${day.toString()}`} 
                      className={cn(
                        "border p-2 text-center",
                        consultantOnLeave && "bg-red-100"
                      )}
                    >
                      {consultantOnLeave && (
                        <Badge variant="outline" className="w-full mb-2 bg-red-50 text-red-800 border-red-200">
                          {consultantLeave.leave_type}: {consultantLeave.reason}
                        </Badge>
                      )}
                      
                      {primaryPayrolls.map((payroll) => (
                        <div key={payroll.id} className="mb-2">
                          <Badge className="mb-1 bg-blue-100 text-blue-800 border-blue-200">
                            {payroll.name}
                          </Badge>
                          <div className="text-xs text-muted-foreground">{payroll.client?.name}</div>
                          <div className="text-xs font-medium">
                            EFT: {format(parseISO(payroll.payroll_dates[0].adjusted_eft_date), "MMM d")}
                          </div>
                        </div>
                      ))}
                      
                      {backupPayrolls.map((payroll) => (
                        <div key={payroll.id} className="mb-2">
                          <Badge className="mb-1 bg-amber-100 text-amber-800 border-amber-200">
                            {payroll.name} (Backup)
                          </Badge>
                          <div className="text-xs text-muted-foreground">{payroll.client?.name}</div>
                          <div className="text-xs font-medium">
                            EFT: {format(parseISO(payroll.payroll_dates[0].adjusted_eft_date), "MMM d")}
                          </div>
                        </div>
                      ))}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  // Week view with days as rows (consultants as columns)
  const renderWeekViewDaysAsRows = () => (
    <div className="relative overflow-auto max-h-[70vh]">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 z-20 bg-background">
          <tr>
            <th className="border bg-muted p-2 text-left font-medium sticky left-0 z-30">Day</th>
            {filteredConsultants.map((consultant) => (
              <th key={consultant.name} className="border p-2 text-center font-medium min-w-[180px] bg-muted">
                {consultant.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {daysInPeriod.map((day) => {
            const holiday = holidays.find((h) => isSameDay(parseISO(h.date), day) && h.country_code === "AU")
            // Highlight if it's a NSW holiday or a National holiday
            const isHighlightedHoliday = holiday && (
              (Array.isArray(holiday.region) && (holiday.region.includes("NSW") || holiday.region.includes("National"))) || 
              holiday.region === "NSW" ||
              holiday.region === "National"
            )
            const isWeekendDay = isWeekend(day)
            
            return (
              <tr key={day.toString()}>
                <td className={cn(
                  "border p-2 sticky left-0 z-10",
                  isWeekendDay ? "bg-sky-100" : "bg-background",
                  isHighlightedHoliday && "bg-green-100",
                )}>
                  <div className="font-medium">{format(day, "EEE")}</div>
                  <div className="text-xs">{format(day, "MMM d")}</div>
                  {holiday && (
                    <Badge variant="outline" className="mt-1 bg-gray-100 text-red-800 border-red-200 w-full">
                      {holiday.local_name}
                    </Badge>
                  )}
                </td>
                
                {filteredConsultants.map((consultant) => {
                  // Check if consultant is on leave this day
                  const consultantLeave = getLeaveDetails(consultant, day)
                  const consultantOnLeave = !!consultantLeave
                  
                  // Find payrolls where this person is the primary consultant
                  const primaryPayrolls = filteredPayrolls.filter(payroll => {
                    if (!payroll.payroll_dates || payroll.payroll_dates.length === 0) return false
                    
                    return payroll.userByPrimaryConsultantUserId?.name === consultant.name && 
                      isSameDay(parseISO(payroll.payroll_dates[0].processing_date), day)
                  })
                  
                  // Find payrolls where this person is the backup consultant and primary is on leave
                  const backupPayrolls = filteredPayrolls.filter(payroll => {
                    if (!payroll.payroll_dates || payroll.payroll_dates.length === 0) return false
                    if (!payroll.userByBackupConsultantUserId) return false
                    if (payroll.userByBackupConsultantUserId.name !== consultant.name) return false
                    
                    const primaryConsultant = payroll.userByPrimaryConsultantUserId
                    const primaryOnLeave = isOnLeave(primaryConsultant, day)
                    
                    return primaryOnLeave && 
                      isSameDay(parseISO(payroll.payroll_dates[0].processing_date), day)
                  })
                  
                  return (
                    <td
                      key={`${consultant.name}-${day.toString()}`}
                      className={cn(
                        "border p-2",
                        isWeekendDay && "bg-sky-100",
                        isHighlightedHoliday && "bg-green-100",
                        consultantOnLeave && "bg-red-100"
                      )}
                    >
                      {consultantOnLeave && (
                        <Badge variant="outline" className="w-full mb-2 bg-red-50 text-red-800 border-red-200">
                          {consultantLeave.leave_type}
                        </Badge>
                      )}
                      
                      {primaryPayrolls.map((payroll) => (
                        <div
                          key={payroll.id}
                          className="bg-blue-100 p-1 text-xs rounded mb-1 border border-blue-200"
                        >
                          <div className="font-medium truncate">{payroll.name}</div>
                          <div className="truncate">{payroll.client?.name}</div>
                          <div className="font-medium">
                            EFT: {format(parseISO(payroll.payroll_dates[0].adjusted_eft_date), "MMM d")}
                          </div>
                        </div>
                      ))}
                      
                      {backupPayrolls.map((payroll) => (
                        <div
                          key={payroll.id}
                          className="bg-amber-100 p-1 text-xs rounded mb-1 border border-amber-200"
                        >
                          <div className="font-medium truncate">{payroll.name} (Backup)</div>
                          <div className="truncate">{payroll.client?.name}</div>
                          <div className="font-medium">
                            EFT: {format(parseISO(payroll.payroll_dates[0].adjusted_eft_date), "MMM d")}
                          </div>
                        </div>
                      ))}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  // Week view with consultants as rows (days as columns)
  const renderWeekViewConsultantsAsRows = () => (
    <div className="relative overflow-auto max-h-[70vh]">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 z-20 bg-background">
          <tr>
            <th className="border bg-muted p-2 text-left font-medium sticky left-0 z-30">Staff</th>
            {daysInPeriod.map((day) => {
              const holiday = holidays.find((h) => isSameDay(parseISO(h.date), day) && h.country_code === "AU")
              const isHighlightedHoliday = holiday && (
                (Array.isArray(holiday.region) && (holiday.region.includes("NSW") || holiday.region.includes("National"))) || 
                holiday.region === "NSW" ||
                holiday.region === "National"
              )
              
              return (
                <th 
                  key={day.toString()} 
                  className={cn(
                    "border p-2 text-center font-medium min-w-[150px] bg-muted",
                    isWeekend(day) && "bg-sky-100",
                    isHighlightedHoliday && "bg-green-100"
                  )}
                >
                  <div>{format(day, "EEE")}</div>
                  <div className="text-xs">{format(day, "MMM d")}</div>
                  {holiday && (
                    <Badge variant="outline" className="text-xs mt-1 bg-gray-100 text-red-800 border-red-200">
                      {holiday.local_name}
                    </Badge>
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {filteredConsultants.map((consultant) => (
            <tr key={consultant.name}>
              <td className="border p-2 sticky left-0 z-10 bg-background font-medium">
                {consultant.name}
              </td>
              {daysInPeriod.map((day) => {
                const holiday = holidays.find((h) => isSameDay(parseISO(h.date), day) && h.country_code === "AU")
                // Highlight if it's a NSW holiday or a National holiday
                const isHighlightedHoliday = holiday && (
                  (Array.isArray(holiday.region) && (holiday.region.includes("NSW") || holiday.region.includes("National"))) || 
                  holiday.region === "NSW" ||
                  holiday.region === "National"
                )
                const isWeekendDay = isWeekend(day)
                
                // Check if consultant is on leave this day
                const consultantLeave = getLeaveDetails(consultant, day)
                const consultantOnLeave = !!consultantLeave
                
                // Find payrolls where this person is the primary consultant
                const primaryPayrolls = filteredPayrolls.filter(payroll => {
                  if (!payroll.payroll_dates || payroll.payroll_dates.length === 0) return false
                  
                  return payroll.userByPrimaryConsultantUserId?.name === consultant.name && 
                    isSameDay(parseISO(payroll.payroll_dates[0].processing_date), day)
                })
                
                // Find payrolls where this person is the backup consultant and primary is on leave
                const backupPayrolls = filteredPayrolls.filter(payroll => {
                  if (!payroll.payroll_dates || payroll.payroll_dates.length === 0) return false
                  if (!payroll.userByBackupConsultantUserId) return false
                  if (payroll.userByBackupConsultantUserId.name !== consultant.name) return false
                  
                  const primaryConsultant = payroll.userByPrimaryConsultantUserId
                  const primaryOnLeave = isOnLeave(primaryConsultant, day)
                  
                  return primaryOnLeave && 
                    isSameDay(parseISO(payroll.payroll_dates[0].processing_date), day)
                })

                return (
                  <td
                    key={day.toString()}
                    className={cn(
                      "border p-2 relative",
                      isWeekendDay && "bg-sky-100",
                      isHighlightedHoliday && "bg-green-100",
                      consultantOnLeave && "bg-red-100"
                    )}
                  >
                    {consultantOnLeave && (
                      <Badge variant="outline" className="w-full mb-2 bg-red-50 text-red-800 border-red-200">
                        {consultantLeave.leave_type}
                      </Badge>
                    )}
                    
                    {primaryPayrolls.map((payroll) => (
                      <div
                        key={payroll.id}
                        className="bg-blue-100 p-1 text-xs rounded mb-1 border border-blue-200"
                      >
                        <div className="font-medium truncate">{payroll.name}</div>
                        <div className="truncate">{payroll.client?.name}</div>
                        <div className="font-medium">
                          EFT: {format(parseISO(payroll.payroll_dates[0].adjusted_eft_date), "MMM d")}
                        </div>
                      </div>
                    ))}
                    
                    {backupPayrolls.map((payroll) => (
                      <div
                        key={payroll.id}
                        className="bg-amber-100 p-1 text-xs rounded mb-1 border border-amber-200"
                      >
                        <div className="font-medium truncate">{payroll.name} (Backup)</div>
                        <div className="truncate">{payroll.client?.name}</div>
                        <div className="font-medium">
                          EFT: {format(parseISO(payroll.payroll_dates[0].adjusted_eft_date), "MMM d")}
                        </div>
                      </div>
                    ))}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payroll Schedule</h2>
          <p className="text-muted-foreground">View of all payroll assignments</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousPeriod}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous {view}</span>
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[160px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {view === "month"
                  ? format(currentDate, "MMMM yyyy")
                  : `${format(startOfWeek(currentDate), "MMM d")} - ${format(endOfWeek(currentDate), "MMM d, yyyy")}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(date) => date && setCurrentDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" onClick={nextPeriod}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next {view}</span>
          </Button>
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.name}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPayroll} onValueChange={setSelectedPayroll}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Payroll" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payrolls</SelectItem>
              {filteredPayrolls.map((payroll) => (
                <SelectItem key={payroll.id} value={payroll.id}>
                  {payroll.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              {allConsultants.map((consultant) => (
                <SelectItem key={consultant.name} value={consultant.name}>
                  {consultant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Schedule</CardTitle>
          <CardDescription>View all scheduled payrolls for each staff member</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week")} className="mb-4">
            <TabsList>
              <TabsTrigger value="month">Month View</TabsTrigger>
              <TabsTrigger value="week">Week View</TabsTrigger>
            </TabsList>
          </Tabs>

          {view === "week" && (
            <div className="flex items-center mb-4 space-x-2">
              <Switch
                id="week-view-orientation"
                checked={weekViewOrientation === "consultantsAsRows"}
                onCheckedChange={(checked) => 
                  setWeekViewOrientation(checked ? "consultantsAsRows" : "daysAsRows")
                }
              />
              <Label htmlFor="week-view-orientation">
                {weekViewOrientation === "consultantsAsRows" 
                  ? "Consultants as Rows" 
                  : "Days as Rows"}
              </Label>
            </div>
          )}

          {filteredConsultants.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              No staff members found with the current filters.
            </div>
          ) : view === "month" ? (
            renderMonthView()
          ) : weekViewOrientation === "daysAsRows" ? (
            renderWeekViewDaysAsRows()
          ) : (
            renderWeekViewConsultantsAsRows()
          )}
        </CardContent>
      </Card>
    </div>
  )
}