"use client"

import { useState } from "react"
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay, addDays } from "date-fns"
import { ChevronLeft, ChevronRight, CalendarIcon, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Sample payroll data
const payrollEvents = [
  { id: 1, client: "Acme Inc.", payrollName: "Main Office", date: new Date(2025, 2, 15), type: "Processing" },
  { id: 2, client: "TechCorp", payrollName: "Engineering", date: new Date(2025, 2, 18), type: "EFT" },
  { id: 3, client: "Global Foods", payrollName: "Retail Staff", date: new Date(2025, 2, 20), type: "Processing" },
  { id: 4, client: "Acme Inc.", payrollName: "Sales Team", date: new Date(2025, 2, 22), type: "Processing" },
  { id: 5, client: "City Services", payrollName: "Administrative", date: new Date(2025, 2, 25), type: "EFT" },
]

// Sample holidays
const holidays = [
  { date: new Date(2025, 2, 17), name: "St. Patrick's Day" },
  { date: new Date(2025, 3, 18), name: "Good Friday" },
  { date: new Date(2025, 3, 21), name: "Easter Monday" },
]

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 2, 1)) // March 2025
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedEventType, setSelectedEventType] = useState<string>("All")

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  // Generate days of the month
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDayOfMonth = startOfMonth(currentMonth)
  const firstDayOfWeek = getDay(firstDayOfMonth) // 0 = Sunday, 1 = Monday, etc.

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const date = addDays(firstDayOfMonth, i)
    return {
      date,
      dayOfWeek: format(date, "EEE"), // Mon, Tue, etc.
      dayOfMonth: format(date, "d"), // 1, 2, etc.
    }
  })

  const filteredEvents =
    selectedEventType === "All" ? payrollEvents : payrollEvents.filter((event) => event.type === selectedEventType)

  const eventsForSelectedDate = selectedDate
    ? filteredEvents.filter((event) => event.date.toDateString() === selectedDate.toDateString())
    : []

  const holidayForSelectedDate = selectedDate
    ? holidays.find((holiday) => holiday.date.toDateString() === selectedDate.toDateString())
    : undefined

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payroll Calendar</h2>
        <p className="text-muted-foreground">View and manage your payroll schedule.</p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Payroll Calendar</CardTitle>
              <CardDescription>{format(currentMonth, "MMMM yyyy")}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous month</span>
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{format(currentMonth, "MMMM yyyy")}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={currentMonth}
                    onSelect={(date) => date && setCurrentMonth(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next month</span>
              </Button>
              <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Events</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="EFT">EFT</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              {daysArray.map((day, index) => {
                const dayEvents = filteredEvents.filter(
                  (event) => event.date.toDateString() === day.date.toDateString(),
                )
                const isHoliday = holidays.some((holiday) => holiday.date.toDateString() === day.date.toDateString())

                return (
                  <Button
                    key={day.date.toString()}
                    variant="ghost"
                    className={`h-12 w-full rounded-md p-0 font-normal relative ${
                      isHoliday ? "bg-red-100 dark:bg-red-900" : ""
                    }`}
                    onClick={() => setSelectedDate(day.date)}
                  >
                    <time dateTime={format(day.date, "yyyy-MM-dd")}>{day.dayOfMonth}</time>
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="flex gap-0.5">
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className={`h-1 w-1 rounded-full ${
                                event.type === "Processing" ? "bg-blue-500" : "bg-green-500"
                              }`}
                              title={`${event.client} - ${event.payrollName}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="md:w-1/3">
          <CardHeader>
            <CardTitle>{selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}</CardTitle>
            <CardDescription>
              {eventsForSelectedDate.length
                ? `${eventsForSelectedDate.length} event(s) scheduled`
                : "No events scheduled for this date"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {eventsForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {eventsForSelectedDate.map((event) => (
                  <div key={event.id} className="rounded-lg border p-3">
                    <div className="font-medium">
                      {event.client} - {event.payrollName}
                    </div>
                    <div className="text-sm text-muted-foreground">Type: {event.type}</div>
                  </div>
                ))}
              </div>
            ) : holidayForSelectedDate ? (
              <div className="flex h-[200px] items-center justify-center">
                <Badge variant="outline" className="text-red-500">
                  Holiday: {holidayForSelectedDate.name}
                </Badge>
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                No events scheduled for this date
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

