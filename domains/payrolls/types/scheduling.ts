// Payroll Scheduling Types
// Types for payroll scheduling and calendar functionality

export interface PayrollEvent {
  id: string;
  payrollId: string;
  date: Date;
  client: {
    id: string;
    name: string;
  };
  type: "processing" | "eft" | "review" | "submission";
  consultant: {
    id: string;
    name: string;
  };
  status: "pending" | "processing" | "completed" | "overdue";
  hours?: number;
  processingDate?: Date;
  eftDate?: Date;
}

export interface Holiday {
  id: string;
  date: Date;
  name: string;
  type: "federal" | "state" | "local";
  description?: string;
}

export interface StaffLeave {
  id: string;
  userId: string;
  userName: string;
  date: Date;
  type: "annual" | "sick" | "personal" | "emergency" | "bereavement";
  status: "pending" | "approved" | "rejected";
  hours?: number;
}

export interface ScheduleClient {
  id: string;
  name: string;
  active: boolean;
}

export interface ScheduleConsultant {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export type CalendarView = "month" | "week";
export type WeekOrientation = "days-as-rows" | "days-as-columns";
export type EventFilter =
  | "all"
  | "processing"
  | "eft"
  | "review"
  | "submission";
export type StatusFilter =
  | "all"
  | "pending"
  | "processing"
  | "completed"
  | "overdue";