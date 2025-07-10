// app/(dashboard)/calendar/page.tsx
"use client";

import { PayrollSchedule } from "@/domains/payrolls/components";

export default function CalendarPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PayrollSchedule />
    </div>
  );
}
