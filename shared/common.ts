/**
 * Shared Common Types
 * 
 * Cross-domain types and interfaces used throughout the application
 */

// API Response standardization
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Authentication-related common types
export type Account = {
  id: string;
  provider: string;
  type: string;
  refreshToken?: string;
  accessToken?: string;
  expiresAt?: number;
  idToken?: string;
  scope?: string;
  sessionState?: string;
  tokenType?: string;
};

export type Session = {
  id: string;
  expires: string;
};

export type VerificationToken = {
  identifier: string;
  token: string;
  expires: string;
};

// Calendar and scheduling common types
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: "payroll" | "holiday" | "leave";
  color: string;
}

export interface Weekday {
  value: string; // "1" to "5" representing Monday to Friday
  label: string; // "Monday", "Tuesday", etc.
}

export type BusinessWeekday = 0 | 1 | 2 | 3 | 4 | 5; // 0 = non-business day, 1-5 = Monday-Friday

export interface CalendarDayInfo {
  date: Date;
  day: number; // Day of month (1-31)
  businessWeekday: BusinessWeekday; // Business weekday number (0-5)
  isCurrentMonth: boolean;
  isToday: boolean;
  weekType?: "A" | "B"; // For fortnightly payrolls
}

// System configuration types  
export interface FeatureFlag {
  id: string;
  feature_name: string;
  is_enabled: boolean;
  allowed_roles: string[]; // Using string[] to avoid circular dependency
  updated_at: string;
}

// External system integration
export type ExternalSystem = {
  id: string;
  name: string;
  url?: string;
  description?: string;
  icon?: string;
};

// Notes system
export interface Note {
  id: string;
  entity_id: string;
  entity_type: "payroll" | "client";
  user_id?: string;
  content: string;
  is_important: boolean;
  user?: any; // Using any to avoid circular dependency
  created_at: string;
  updated_at: string;
}