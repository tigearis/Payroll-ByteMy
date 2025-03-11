"use client"

import { useState } from "react"
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
  differenceInHours,
} from "date-fns"
import { ChevronLeft, ChevronRight, CalendarIcon, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample staff data
const staffMembers = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Carol Williams" },
  { id: 4, name: "David Brown" },
  { id: 5, name: "Bobby Jones" },
  { id: 6, name: "Keith Richards" },
  { id: 7, name: "Jason Bourne" },
  { id: 8, name: "Mark Bowen" },
  { id: 9, name: "Milly Silver" },
]

// Sample client data
const clients = [
  { id: 1, name: "Acme Inc." },
  { id: 2, name: "TechCorp" },
  { id: 3, name: "Global Foods" },
  { id: 4, name: "City Services" },
]

// Sample payroll data
const payrolls = [
  { id: 1, name: "Payroll 1", clientId: 1 },
  { id: 2, name: "Payroll 2", clientId: 2 },
  { id: 3, name: "Payroll Staff", clientId: 3 },
  { id: 4, name: "Payroll", clientId: 4 },
  { id: 5, name: "Payroll Team", clientId: 1 },
  { id: 6, name: "Payroll 4", clientId: 1 },
  { id: 7, name: "Payroll", clientId: 2 },
  { id: 8, name: "Payroll Weekly Staff", clientId: 3 },
  { id: 9, name: "Administrative", clientId: 4 },
  { id: 8, name: "Payroll Team", clientId: 1 },
]

// Sample payroll assignments with duration
const payrollAssignments = [
  { staffId: 1, payrollId: 1, startDate: new Date(2025, 2, 15), duration: 16 }, // 2 days
  { staffId: 1, payrollId: 2, startDate: new Date(2025, 2, 18), duration: 24 }, // 3 days
  { staffId: 2, payrollId: 3, startDate: new Date(2025, 2, 20), duration: 8 }, // 1 day
  { staffId: 3, payrollId: 4, startDate: new Date(2025, 2, 22), duration: 16 }, // 2 days
  { staffId: 4, payrollId: 5, startDate: new Date(2025, 2, 25), duration: 24 }, // 3 days
  { staffId: 5, payrollId: 6, startDate: new Date(2025, 2, 30), duration: 16 }, // 2 days
  { staffId: 6, payrollId: 7, startDate: new Date(2025, 3, 1), duration: 24 }, // 3 days
  { staffId: 7, payrollId: 8, startDate: new Date(2025, 3, 5), duration: 8 }, // 1 day
  { staffId: 8, payrollId: 9, startDate: new Date(2025, 3, 5), duration: 8 }, // 1 day
]

// Sample holidays
const holidays = [
  { date: new Date(2025, 2, 17), name: "St. Patrick's Day" },
  { date: new Date(2025, 3, 18), name: "Good Friday" },
  { date: new Date(2025, 3, 20), name: "Easter Monday" },
]

export default function PayrollSchedulePage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2025, 2, 1)) // March 2025
  const [selectedClient, setSelectedClient] = useState<string>("all")
  const [selectedPayroll, setSelectedPayroll] = useState<string>("all")
  const [selectedStaff, setSelectedStaff] = useState<string>("all")
  const [view, setView] = useState<"month" | "week">("month")

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

  // Filter staff members
  const filteredStaff =
    selectedStaff === "all" ? staffMembers : staffMembers.filter((staff) => staff.id.toString() === selectedStaff)

  // Filter payroll assignments
  const filteredAssignments = payrollAssignments.filter((assignment) => {
    const payroll = payrolls.find((p) => p.id === assignment.payrollId)
    const isClientMatch = selectedClient === "all" || payroll?.clientId.toString() === selectedClient
    const isPayrollMatch = selectedPayroll === "all" || assignment.payrollId.toString() === selectedPayroll
    const isStaffMatch = selectedStaff === "all" || assignment.staffId.toString() === selectedStaff
    return isClientMatch && isPayrollMatch && isStaffMatch
  })

  const renderMonthView = () => (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border bg-muted p-2 text-left font-medium sticky left-0 z-10">Date</th>
          {filteredStaff.map((staff) => (
            <th key={staff.id} className="border p-2 text-center font-medium min-w-[150px]">
              {staff.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {daysInPeriod.map((day) => {
          const holiday = holidays.find((h) => isSameDay(h.date, day))
          const isWeekendDay = isWeekend(day)
          return (
            <tr
              key={day.toString()}
              className={cn("hover:bg-muted/50", isWeekendDay && "bg-sky-100", holiday && "bg-green-100")}
            >
              <td
                className={cn(
                  "border p-2 sticky left-0 z-10",
                  isWeekendDay ? "bg-sky-100" : "bg-background",
                  holiday && "bg-green-100",
                )}
              >
                <div className="font-medium">{format(day, "d")}</div>
                <div className="text-xs text-muted-foreground">{format(day, "EEE")}</div>
                {holiday && (
                  <Badge variant="outline" className="mt-1 bg-gray-100 text-red-800 border-red-200">
                    {holiday.name}
                  </Badge>
                )}
              </td>
              {filteredStaff.map((staff) => {
                const assignments = filteredAssignments.filter(
                  (a) => a.staffId === staff.id && isSameDay(a.startDate, day),
                )
                return (
                  <td key={`${staff.id}-${day.toString()}`} className="border p-2 text-center">
                    {assignments.map((assignment) => {
                      const payroll = payrolls.find((p) => p.id === assignment.payrollId)
                      const client = clients.find((c) => c.id === payroll?.clientId)
                      return (
                        <div key={assignment.payrollId} className="mb-1">
                          <Badge className="mb-1">{payroll?.name}</Badge>
                          <div className="text-xs text-muted-foreground">{client?.name}</div>
                        </div>
                      )
                    })}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )

  const renderWeekView = () => (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border bg-muted p-2 text-left font-medium sticky left-0 z-10">Staff</th>
          {daysInPeriod.map((day) => (
            <th key={day.toString()} className="border p-2 text-center font-medium min-w-[150px]">
              <div>{format(day, "EEE")}</div>
              <div className="text-xs">{format(day, "MMM d")}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredStaff.map((staff) => (
          <tr key={staff.id}>
            <td className="border p-2 sticky left-0 z-10 bg-background font-medium">{staff.name}</td>
            {daysInPeriod.map((day) => {
              const holiday = holidays.find((h) => isSameDay(h.date, day))
              const isWeekendDay = isWeekend(day)
              const assignments = filteredAssignments.filter((a) => {
                const startDate = a.startDate
                const endDate = addDays(startDate, Math.ceil(a.duration / 8) - 1)
                return a.staffId === staff.id && day >= startDate && day <= endDate
              })

              return (
                <td
                  key={day.toString()}
                  className={cn("border p-2 relative", isWeekendDay && "bg-sky-100", holiday && "bg-green-100")}
                >
                  {holiday && (
                    <Badge variant="outline" className="absolute top-0 right-0 m-1 text-xs">
                      {holiday.name}
                    </Badge>
                  )}
                  {assignments.map((assignment) => {
                    const payroll = payrolls.find((p) => p.id === assignment.payrollId)
                    const client = clients.find((c) => c.id === payroll?.clientId)
                    const startDate = assignment.startDate
                    const daysFromStart = differenceInHours(day, startDate) / 24
                    const hoursToday = Math.min(8, assignment.duration - daysFromStart * 8)

                    if (hoursToday <= 0) return null

                    return (
                      <div
                        key={assignment.payrollId}
                        className="bg-blue-200 p-1 text-xs rounded mb-1"
                        style={{ height: `${(hoursToday / 8) * 100}%` }}
                      >
                        <div className="font-medium truncate">{payroll?.name}</div>
                        <div className="truncate">{client?.name}</div>
                        <div>{hoursToday}h</div>
                      </div>
                    )
                  })}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payroll Schedule</h2>
          <p className="text-muted-foreground">View of all payroll assignments</p>
        </div>
        <div className="flex items-center gap-2">
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
                <SelectItem key={client.id} value={client.id.toString()}>
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
              {payrolls.map((payroll) => (
                <SelectItem key={payroll.id} value={payroll.id.toString()}>
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
              {staffMembers.map((staff) => (
                <SelectItem key={staff.id} value={staff.id.toString()}>
                  {staff.name}
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
          <div className="overflow-x-auto">{view === "month" ? renderMonthView() : renderWeekView()}</div>
        </CardContent>
      </Card>
    </div>
  )
}

