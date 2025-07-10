"use client";

import { useMemo } from "react";

interface EnhancedCalendarProps {
  mode: "fortnightly" | "fixed";
  selectedWeek?: string; // 'A' | 'B' (for fortnightly)
  selectedDay?: string; // '1'...'31' (fixed) or '1'...'5' (fortnightly)
  onWeekSelect?: (week: string) => void; // for fortnightly
  onDaySelect: (day: string) => void;
}

export const PAYROLL_CYCLES = [
  { id: "weekly", name: "Weekly" },
  { id: "fortnightly", name: "Fortnightly" },
  { id: "bi_monthly", name: "Bi-Monthly" },
  { id: "monthly", name: "Monthly" },
  { id: "quarterly", name: "Quarterly" },
];

export const PAYROLL_DATE_TYPES = {
  weekly: [],
  fortnightly: [],
  bi_monthly: [
    { id: "SOM", name: "Start of Month" },
    { id: "EOM", name: "End of Month" },
  ],
  monthly: [
    { id: "SOM", name: "Start of Month" },
    { id: "EOM", name: "End of Month" },
    { id: "fixed", name: "Fixed Date" },
  ],
  quarterly: [
    { id: "SOM", name: "Start of Month" },
    { id: "EOM", name: "End of Month" },
    { id: "fixed", name: "Fixed Date" },
  ],
};

export const WEEKDAYS = [
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
];

// --- Helper functions ---
export function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

export function getBusinessWeekday(jsDay: number): number {
  // JS: 0=Sunday, 1=Monday, ... 6=Saturday
  if (jsDay === 0 || jsDay === 6) return 0; // Non-business days
  return jsDay; // Monday=1 ... Friday=5
}

export function getWeekType(date: Date): "A" | "B" {
  const currentYear = date.getFullYear();
  const firstDayOfYear = new Date(currentYear, 0, 1);

  // Find the first Sunday of the year
  const firstSunday = new Date(firstDayOfYear);
  const dayOfWeek = firstDayOfYear.getDay();
  const daysToAdd = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  firstSunday.setDate(firstDayOfYear.getDate() + daysToAdd);

  // Calculate week number since first Sunday
  const timeDiff = date.getTime() - firstSunday.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(daysDiff / 7);

  return weekNumber % 2 === 0 ? "A" : "B";
}

export function calculateFortnightlyWeeks() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const firstDayOfYear = new Date(currentYear, 0, 1);
  const firstSunday = new Date(firstDayOfYear);
  const dayOfWeek = firstDayOfYear.getDay();
  const daysToAdd = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  firstSunday.setDate(firstDayOfYear.getDate() + daysToAdd);

  const timeDiff = now.getTime() - firstSunday.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(daysDiff / 7);

  const isCurrentWeekA = weekNumber % 2 === 0;

  const thisSunday = new Date(now);
  const currentDay = now.getDay();
  thisSunday.setDate(now.getDate() - currentDay);

  const thisSaturday = new Date(thisSunday);
  thisSaturday.setDate(thisSunday.getDate() + 6);

  const nextSunday = new Date(thisSunday);
  nextSunday.setDate(thisSunday.getDate() + 7);

  const nextSaturday = new Date(nextSunday);
  nextSaturday.setDate(nextSunday.getDate() + 6);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-AU", { day: "numeric", month: "short" });

  const currentWeekLabel = `${formatDate(thisSunday)} - ${formatDate(thisSaturday)}`;
  const nextWeekLabel = `${formatDate(nextSunday)} - ${formatDate(nextSaturday)}`;

  if (isCurrentWeekA) {
    return [
      {
        value: "A",
        label: `Week A (Current: ${currentWeekLabel})`,
        description: "This week",
      },
      {
        value: "B",
        label: `Week B (Next: ${nextWeekLabel})`,
        description: "Next week",
      },
    ];
  } else {
    return [
      {
        value: "A",
        label: `Week A (Next: ${nextWeekLabel})`,
        description: "Next week",
      },
      {
        value: "B",
        label: `Week B (Current: ${currentWeekLabel})`,
        description: "This week",
      },
    ];
  }
}
// --- End helpers ---

export const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function EnhancedCalendar({
  mode,
  selectedWeek,
  selectedDay,
  onWeekSelect,
  onDaySelect,
}: EnhancedCalendarProps) {
  const now = useMemo(() => new Date(), []);
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const firstDayWeekday = firstDayOfMonth.getDay();

  // Calculate the date of the grid's first displayed cell (the Sunday before or on the 1st)
  const calendarStart = new Date(firstDayOfMonth);
  calendarStart.setDate(firstDayOfMonth.getDate() - firstDayWeekday);

  // Build weeks (6 weeks grid, Sun-Sat)
  const weeks = [];
  const currentDate = new Date(calendarStart);

  for (let week = 0; week < 6; week++) {
    const days = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(currentDate);
      const isCurrentMonth = date.getMonth() === currentMonth;
      const isToday = date.toDateString() === now.toDateString();
      const weekType = mode === "fortnightly" ? getWeekType(date) : null;
      const businessWeekday = getBusinessWeekday(date.getDay());

      days.push({
        date: new Date(date),
        day: date.getDate(),
        businessWeekday,
        isCurrentMonth,
        isToday,
        weekType,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(days);
    // Stop if next week is outside the current month
    if (days.some(d => d.date.getMonth() > currentMonth)) break;
  }

  const monthName = now.toLocaleDateString("en-AU", {
    month: "long",
    year: "numeric",
  });

  const handleDayClick = (dayInfo: any) => {
    if (mode === "fortnightly") {
      const isWeekday =
        dayInfo.businessWeekday >= 1 && dayInfo.businessWeekday <= 5;
      if (!isWeekday) return;
      onWeekSelect?.(dayInfo.weekType);
      onDaySelect(dayInfo.businessWeekday.toString());
    } else {
      onDaySelect(dayInfo.day.toString());
    }
  };

  return (
    <div className="mt-2 p-4 border rounded-lg bg-gray-50">
      <div className="text-center mb-4">
        <h4 className="font-medium text-gray-900">{monthName}</h4>
        <p className="text-sm text-gray-600">
          {mode === "fortnightly"
            ? "Select Week Type & Day of Week"
            : "Select Day of Month"}
        </p>
      </div>
      {mode === "fortnightly" && (
        <div className="space-y-3">
          <div className="flex justify-center gap-4 mb-3 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span>Week A</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Week B</span>
            </div>
          </div>
          <div className="text-center text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded p-2">
            <span className="font-medium">Weekdays Only:</span> Payroll
            processing is restricted to Monday - Friday
          </div>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {WEEKDAYNAMES.map(dayName => (
          <div key={dayName} className="p-2 font-medium text-gray-500">
            {dayName}
          </div>
        ))}
        {weeks.map((week, weekIndex) =>
          week.map((dayInfo, dayIndex) => {
            let isSelected = false;
            let isDisabled = false;
            let buttonClass = "p-2 text-sm rounded transition-all ";

            if (mode === "fortnightly") {
              const isWeekA = dayInfo.weekType === "A";
              const isSelectedWeek = selectedWeek === dayInfo.weekType;
              const isSelectedDay =
                selectedDay === dayInfo.businessWeekday.toString();
              const isWeekday =
                dayInfo.businessWeekday >= 1 && dayInfo.businessWeekday <= 5;

              isSelected = isSelectedWeek && isSelectedDay;
              isDisabled = !isWeekday;

              if (isDisabled) {
                buttonClass +=
                  "text-gray-400 bg-gray-100 cursor-not-allowed opacity-50 ";
              } else {
                buttonClass += `cursor-pointer ${!dayInfo.isCurrentMonth ? "text-gray-300" : "text-gray-900"} `;
                buttonClass += `${dayInfo.isToday ? "font-bold ring-2 ring-orange-400" : ""} `;
                buttonClass += isWeekA
                  ? isSelected
                    ? "bg-blue-300 border-blue-500 border-2 ring-2 ring-blue-200"
                    : "bg-blue-100 border border-blue-300 hover:bg-blue-150"
                  : isSelected
                    ? "bg-green-300 border-green-500 border-2 ring-2 ring-green-200"
                    : "bg-green-100 border border-green-300 hover:bg-green-150";
              }
            } else {
              // Fixed date mode
              isSelected = selectedDay === dayInfo.day.toString();
              isDisabled = !dayInfo.isCurrentMonth;

              buttonClass += `cursor-pointer `;
              buttonClass += `${!dayInfo.isCurrentMonth ? "text-gray-300 bg-gray-50" : "text-gray-900 bg-white border hover:bg-gray-50"} `;
              buttonClass += `${dayInfo.isToday ? "font-bold ring-2 ring-orange-400" : ""} `;
              buttonClass += `${isSelected ? "bg-blue-200 border-blue-400 border-2 ring-2 ring-blue-200" : ""} `;
            }

            return (
              <button
                key={`${weekIndex}-${dayIndex}`}
                type="button"
                onClick={() => handleDayClick(dayInfo)}
                className={buttonClass}
                disabled={isDisabled}
                title={
                  mode === "fortnightly" && !isDisabled
                    ? `Week ${dayInfo.weekType} - ${WEEKDAY_NAMES[dayInfo.businessWeekday - 1]}`
                    : mode === "fortnightly" && isDisabled
                      ? "Weekends not allowed for payroll"
                      : undefined
                }
              >
                {dayInfo.day}
              </button>
            );
          })
        )}
      </div>
      {/* Selection info */}
      <div className="mt-3 p-2 bg-white rounded border text-center text-sm">
        {mode === "fortnightly" ? (
          <>
            {selectedWeek && selectedDay ? (
              <div className="space-y-1">
                <div>
                  <span className="font-medium">Week {selectedWeek}</span>
                  {calculateFortnightlyWeeks()
                    .find(w => w.value === selectedWeek)
                    ?.label.includes("Current") && (
                    <span className="ml-2 text-green-600">(This week)</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-600">
                    {WEEKDAY_NAMES[parseInt(selectedDay ?? "1")]}
                  </span>
                  <span className="ml-2 text-green-600 text-xs">✓ Weekday</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-gray-500">
                  Click a weekday to select week type and day
                </span>
                <div className="text-xs text-amber-600">
                  Note: Weekends are disabled for payroll processing
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {selectedDay ? (
              <span className="font-medium">
                Selected: {selectedDay}
                {getOrdinalSuffix(parseInt(selectedDay))} of month
              </span>
            ) : (
              <span className="text-gray-500">Click a day to select date</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
