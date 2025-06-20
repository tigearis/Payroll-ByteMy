/**
 * Work Schedule Domain Types
 */

export interface WorkSchedule {
  id: string;
  user_id: string;
  work_day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  work_hours: number;
  user?: any; // Using any to avoid circular dependency
  work_schedule_user?: any;
  created_at: string;
  updated_at: string;
}