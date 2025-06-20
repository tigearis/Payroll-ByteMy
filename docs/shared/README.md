# Shared Documentation

## Overview

The `/shared` directory contains cross-domain utilities, type definitions, and shared infrastructure components that are used throughout the application. This includes common GraphQL operations, shared type definitions, validation schemas, and utility functions that don't belong to a specific domain.

## Architecture Patterns

- **Cross-Domain Utilities**: Shared functionality used across multiple domains
- **Type Safety**: Comprehensive TypeScript definitions for shared concepts
- **GraphQL Operations**: Common queries and mutations used application-wide
- **Validation Schemas**: Shared validation logic and schemas
- **Configuration Management**: Centralized configuration and constants

## Directory Structure

```
/shared
├── /graphql                    # Shared GraphQL operations
│   ├── queries.graphql        # Cross-domain query operations
│   ├── mutations.graphql      # Common mutation operations
│   ├── subscriptions.graphql  # Real-time operations
│   └── security-types.graphql # Security-related type definitions
├── /types                     # Shared TypeScript definitions
│   ├── /generated            # Auto-generated types from GraphQL
│   ├── index.ts              # Main type exports
│   └── scalars.ts            # Custom scalar type definitions
├── /validation               # Shared validation schemas
│   ├── common.ts             # Common validation patterns
│   └── business-rules.ts     # Business rule validations
├── /utils                    # Cross-domain utility functions
│   ├── date-helpers.ts       # Date manipulation utilities
│   ├── formatting.ts         # Data formatting utilities
│   └── constants.ts          # Application-wide constants
└── index.ts                  # Main exports for shared module
```

## Shared GraphQL Operations

### Common Queries (`/shared/graphql/queries.graphql`)

#### System Health and Configuration
```graphql
# System status and health monitoring
query GetSystemStatus {
  system_status {
    database_connected
    auth_service_status
    external_services {
      service_name
      status
      last_check
    }
    version_info {
      application_version
      hasura_version
      database_version
    }
  }
}

# Application configuration retrieval
query GetAppConfiguration {
  app_config {
    feature_flags {
      mfa_enabled
      advanced_audit_logging
      real_time_notifications
    }
    business_settings {
      payroll_frequency_options
      supported_timezones
      holiday_calendars
    }
    security_policies {
      password_requirements
      session_timeout
      max_failed_attempts
    }
  }
}
```

#### Cross-Domain Data Operations
```graphql
# Universal search across domains
query UniversalSearch($query: String!, $filters: SearchFilters) {
  search_results(query: $query, filters: $filters) {
    total_count
    results {
      entity_type
      entity_id
      title
      description
      relevance_score
      highlights
      permissions_required
    }
    facets {
      domain
      entity_type
      access_level
    }
  }
}

# Global notification retrieval
query GetUserNotifications($user_id: uuid!, $limit: Int = 20) {
  notifications(
    where: { user_id: { _eq: $user_id }, is_read: { _eq: false } }
    order_by: { created_at: desc }
    limit: $limit
  ) {
    id
    type
    title
    message
    priority
    action_url
    created_at
    expires_at
  }
}
```

### Common Mutations (`/shared/graphql/mutations.graphql`)

#### Audit and Logging Operations
```graphql
# Universal audit logging
mutation LogAuditEvent($event: AuditEventInput!) {
  log_audit_event(event: $event) {
    event_id
    timestamp
    success
    retention_until
  }
}

# Bulk operation logging
mutation LogBulkOperation($operation: BulkOperationInput!) {
  log_bulk_operation(operation: $operation) {
    operation_id
    total_items
    successful_items
    failed_items
    errors {
      item_id
      error_message
      error_code
    }
  }
}
```

#### User Preference and Configuration
```graphql
# User preference management
mutation UpdateUserPreferences($user_id: uuid!, $preferences: jsonb!) {
  update_user_preferences(
    where: { user_id: { _eq: $user_id } }
    _set: { preferences: $preferences }
  ) {
    affected_rows
    returning {
      user_id
      preferences
      updated_at
    }
  }
}

# Notification settings management
mutation UpdateNotificationSettings($user_id: uuid!, $settings: NotificationSettingsInput!) {
  update_notification_settings(user_id: $user_id, settings: $settings) {
    user_id
    email_notifications
    push_notifications
    notification_frequency
  }
}
```

### Real-time Subscriptions (`/shared/graphql/subscriptions.graphql`)

#### System-wide Real-time Updates
```graphql
# Global notification subscription
subscription NotificationUpdates($user_id: uuid!) {
  notifications(
    where: { user_id: { _eq: $user_id } }
  ) {
    id
    type
    title
    message
    priority
    created_at
    is_read
  }
}

# System status monitoring
subscription SystemStatusUpdates {
  system_events(
    where: { 
      severity: { _in: ["warning", "error", "critical"] }
      resolved: { _eq: false }
    }
  ) {
    id
    event_type
    severity
    message
    affected_services
    timestamp
  }
}
```

## Shared Type Definitions

### Core Types (`/shared/types/index.ts`)

#### Base Entity Types
```typescript
// Universal entity identification
export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
}

// Auditable entity pattern
export interface AuditableEntity extends BaseEntity {
  version: number;
  audit_trail: AuditRecord[];
  data_classification: DataClassification;
}

// Soft-deletable entity pattern
export interface SoftDeletableEntity extends BaseEntity {
  deleted_at?: Date;
  deleted_by?: string;
  is_active: boolean;
}
```

#### Security and Permission Types
```typescript
// User role definitions
export enum UserRole {
  DEVELOPER = 'developer',
  ORG_ADMIN = 'org_admin',
  MANAGER = 'manager',
  CONSULTANT = 'consultant',
  VIEWER = 'viewer'
}

// Permission definitions
export interface Permission {
  id: string;
  name: string;
  category: PermissionCategory;
  description: string;
  required_role_level: number;
}

// Data classification levels
export enum DataClassification {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  PUBLIC = 'PUBLIC'
}
```

#### Business Domain Types
```typescript
// Common business entity patterns
export interface ContactInformation {
  email: string;
  phone?: string;
  address?: Address;
  preferred_contact_method: ContactMethod;
}

export interface Address {
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

// Financial data types
export interface Money {
  amount: number;
  currency: string;
  formatted: string;
}

export interface DateRange {
  start_date: Date;
  end_date: Date;
  timezone?: string;
}
```

### Custom Scalar Types (`/shared/types/scalars.ts`)

#### GraphQL Scalar Definitions
```typescript
// Custom scalar type definitions for GraphQL
export const scalars = {
  // Date and time handling
  DateTime: {
    serialize: (value: Date) => value.toISOString(),
    parseValue: (value: string) => new Date(value),
    parseLiteral: (ast: ValueNode) => new Date(ast.value)
  },

  // Money/currency handling
  Money: {
    serialize: (value: Money) => `${value.amount}|${value.currency}`,
    parseValue: (value: string) => {
      const [amount, currency] = value.split('|');
      return { amount: parseFloat(amount), currency };
    }
  },

  // JSON data handling
  JSON: {
    serialize: (value: any) => JSON.stringify(value),
    parseValue: (value: string) => JSON.parse(value),
    parseLiteral: (ast: ValueNode) => JSON.parse(ast.value)
  },

  // UUID validation
  UUID: {
    serialize: (value: string) => value,
    parseValue: (value: string) => {
      if (!isValidUUID(value)) {
        throw new Error('Invalid UUID format');
      }
      return value;
    }
  }
};
```

## Shared Validation Schemas

### Common Validation (`/shared/validation/common.ts`)

#### Base Validation Patterns
```typescript
import { z } from 'zod';

// Universal ID validation
export const uuidSchema = z.string().uuid('Invalid UUID format');

// Email validation with business rules
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(5, 'Email too short')
  .max(254, 'Email too long')
  .refine(
    (email) => !email.includes('+'), 
    'Plus addressing not allowed'
  );

// Phone number validation
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional();

// Password strength validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain special character');

// Date range validation
export const dateRangeSchema = z.object({
  start_date: z.date(),
  end_date: z.date(),
  timezone: z.string().optional()
}).refine(
  (data) => data.end_date > data.start_date,
  'End date must be after start date'
);
```

### Business Rule Validation (`/shared/validation/business-rules.ts`)

#### Business Logic Validation
```typescript
// User role hierarchy validation
export const roleAssignmentSchema = z.object({
  user_id: uuidSchema,
  current_role: z.nativeEnum(UserRole),
  new_role: z.nativeEnum(UserRole),
  assigned_by: uuidSchema
}).refine(
  (data) => validateRoleTransition(data.current_role, data.new_role),
  'Invalid role transition'
);

// Financial amount validation
export const moneySchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3-letter code'),
  context: z.enum(['salary', 'tax', 'deduction', 'bonus'])
}).refine(
  (data) => validateAmountLimits(data.amount, data.context),
  'Amount exceeds allowed limits for context'
);

// Payroll date validation
export const payrollDateSchema = z.object({
  pay_period_start: z.date(),
  pay_period_end: z.date(),
  pay_date: z.date(),
  payroll_frequency: z.enum(['weekly', 'biweekly', 'monthly', 'semimonthly'])
}).refine(
  (data) => validatePayrollDates(data),
  'Invalid payroll date configuration'
);
```

## Shared Utilities

### Date Helpers (`/shared/utils/date-helpers.ts`)

#### Business Date Calculations
```typescript
// Business day calculations
export function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    if (!isWeekend(result) && !isHoliday(result)) {
      addedDays++;
    }
  }
  
  return result;
}

// Payroll period calculations
export function calculatePayrollPeriod(
  startDate: Date, 
  frequency: PayrollFrequency
): DateRange {
  switch (frequency) {
    case 'weekly':
      return {
        start_date: startDate,
        end_date: addDays(startDate, 6)
      };
    case 'biweekly':
      return {
        start_date: startDate,
        end_date: addDays(startDate, 13)
      };
    case 'monthly':
      return {
        start_date: startOfMonth(startDate),
        end_date: endOfMonth(startDate)
      };
    default:
      throw new Error(`Unsupported frequency: ${frequency}`);
  }
}

// Holiday calendar integration
export function isBusinessDay(date: Date, countryCode = 'AU'): boolean {
  return !isWeekend(date) && !isPublicHoliday(date, countryCode);
}
```

### Formatting Utilities (`/shared/utils/formatting.ts`)

#### Data Formatting Functions
```typescript
// Currency formatting with internationalization
export function formatMoney(
  amount: number, 
  currency = 'AUD', 
  locale = 'en-AU'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
}

// Date formatting for user display
export function formatDate(
  date: Date, 
  format: DateFormat = 'short',
  timezone?: string
): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    ...getDateFormatOptions(format)
  };
  
  return new Intl.DateTimeFormat('en-AU', options).format(date);
}

// User name formatting with privacy
export function formatUserName(
  user: { first_name: string; last_name: string },
  format: NameFormat = 'full',
  maskForPrivacy = false
): string {
  if (maskForPrivacy) {
    return `${user.first_name} ${user.last_name.charAt(0)}.`;
  }
  
  switch (format) {
    case 'full':
      return `${user.first_name} ${user.last_name}`;
    case 'last_first':
      return `${user.last_name}, ${user.first_name}`;
    case 'initials':
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
    default:
      return user.first_name;
  }
}
```

### Constants (`/shared/utils/constants.ts`)

#### Application-wide Constants
```typescript
// Security configuration
export const SECURITY_CONSTANTS = {
  JWT_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes in milliseconds
  MAX_LOGIN_ATTEMPTS: 5,
  ACCOUNT_LOCKOUT_DURATION: 30 * 60 * 1000, // 30 minutes
  SESSION_WARNING_TIME: 10 * 60 * 1000, // 10 minutes before expiry
  MFA_CODE_LENGTH: 6,
  PASSWORD_RESET_EXPIRY: 24 * 60 * 60 * 1000 // 24 hours
} as const;

// Business configuration
export const BUSINESS_CONSTANTS = {
  PAYROLL_FREQUENCIES: ['weekly', 'biweekly', 'monthly', 'semimonthly'] as const,
  SUPPORTED_CURRENCIES: ['AUD', 'USD', 'GBP', 'EUR'] as const,
  TAX_YEAR_START: { month: 7, day: 1 }, // July 1st for Australia
  MAX_OVERTIME_HOURS_PER_WEEK: 60,
  MIN_WAGE_AUD: 23.23, // As of 2024
  SUPERANNUATION_RATE: 0.115 // 11.5%
} as const;

// Data retention policies
export const RETENTION_POLICIES = {
  AUDIT_LOGS: 7 * 365 * 24 * 60 * 60 * 1000, // 7 years
  USER_DATA: 2 * 365 * 24 * 60 * 60 * 1000, // 2 years after departure
  PAYROLL_DATA: 7 * 365 * 24 * 60 * 60 * 1000, // 7 years
  COMMUNICATION_LOGS: 3 * 365 * 24 * 60 * 60 * 1000, // 3 years
  SYSTEM_LOGS: 1 * 365 * 24 * 60 * 60 * 1000 // 1 year
} as const;
```

## Configuration Management

### Feature Flags
```typescript
// Feature flag configuration
export interface FeatureFlags {
  mfa_enabled: boolean;
  advanced_audit_logging: boolean;
  real_time_notifications: boolean;
  bulk_operations: boolean;
  data_export: boolean;
  developer_tools: boolean;
}

// Environment-specific feature flags
export const getFeatureFlags = (): FeatureFlags => {
  return {
    mfa_enabled: process.env.FEATURE_MFA_ENABLED === 'true',
    advanced_audit_logging: process.env.NODE_ENV === 'production',
    real_time_notifications: true,
    bulk_operations: process.env.FEATURE_BULK_OPS === 'true',
    data_export: process.env.FEATURE_DATA_EXPORT === 'true',
    developer_tools: process.env.NODE_ENV === 'development'
  };
};
```

### Environment Configuration
```typescript
// Environment validation and configuration
export const environmentConfig = {
  // Required environment variables
  required: [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_HASURA_GRAPHQL_URL',
    'HASURA_SERVICE_ACCOUNT_TOKEN'
  ],
  
  // Optional with defaults
  optional: {
    NODE_ENV: 'development',
    LOG_LEVEL: 'info',
    SESSION_TIMEOUT: '8h',
    RATE_LIMIT_REQUESTS: '100',
    AUDIT_LOG_RETENTION: '7y'
  },
  
  // Validation function
  validate: () => {
    const missing = environmentConfig.required.filter(
      key => !process.env[key]
    );
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
};
```

## Testing Utilities

### Shared Test Helpers
```typescript
// Common test data generators
export const testDataGenerators = {
  user: (overrides?: Partial<User>): User => ({
    id: uuid(),
    email: `test.${Date.now()}@example.com`,
    first_name: 'Test',
    last_name: 'User',
    role: UserRole.VIEWER,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides
  }),
  
  money: (amount = 1000, currency = 'AUD'): Money => ({
    amount,
    currency,
    formatted: formatMoney(amount, currency)
  }),
  
  dateRange: (daysFromNow = 0, duration = 7): DateRange => {
    const start = addDays(new Date(), daysFromNow);
    return {
      start_date: start,
      end_date: addDays(start, duration)
    };
  }
};

// Mock data providers
export const mockProviders = {
  auth: {
    currentUser: testDataGenerators.user({ role: UserRole.MANAGER }),
    permissions: ['users:read', 'payrolls:create'],
    isAuthenticated: true
  },
  
  apollo: {
    client: createMockApolloClient(),
    cache: new InMemoryCache()
  }
};
```

## Performance Considerations

### Optimization Strategies
- **Tree Shaking**: Only import needed utilities to minimize bundle size
- **Lazy Loading**: Large utilities loaded only when needed
- **Memoization**: Expensive calculations cached appropriately
- **Type Safety**: Compile-time type checking prevents runtime errors

### Monitoring
- **Bundle Analysis**: Shared utilities impact on bundle size
- **Usage Tracking**: Which shared utilities are most frequently used
- **Performance Metrics**: Execution time for shared functions
- **Memory Usage**: Memory footprint of shared state and caches

## Related Documentation
- [Domains Documentation](../domains/README.md) - Domain-specific implementations using shared utilities
- [Components Documentation](../components/README.md) - Component usage of shared types and utilities
- [Hooks Documentation](../hooks/README.md) - Custom hooks using shared functionality
- [Security Report](../SECURITY_IMPROVEMENT_REPORT.md) - Security considerations for shared utilities