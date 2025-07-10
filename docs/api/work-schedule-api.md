# Work Schedule System - API Documentation

## Overview

The Work Schedule API provides comprehensive capacity planning and workload management capabilities through GraphQL operations. This document details all available queries, mutations, and data structures for the work schedule system.

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Data Models](#data-models)
3. [GraphQL Schema](#graphql-schema)
4. [Queries](#queries)
5. [Mutations](#mutations)
6. [Subscriptions](#subscriptions)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)
9. [SDK Usage Examples](#sdk-usage-examples)

---

## Authentication & Authorization

### 🔐 **Authentication Requirements**

All work schedule API calls require valid JWT authentication via Clerk:

```typescript
// Required headers
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

### 🛡️ **Permission Matrix**

| Operation | Developer | Org Admin | Manager | Consultant | Viewer |
|-----------|-----------|-----------|---------|------------|--------|
| `GetTeamCapacityDashboard` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `GetConsultantPayrollWorkload` | ✅ | ✅ | ✅ | ✅ | ✅* |
| `UpsertWorkSchedule` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `UpdateUserDefaultAdminTime` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `GetPayrollsForBulkAssignment` | ✅ | ✅ | ✅ | ❌ | ❌ |

*Viewers can only access their own data

---

## Data Models

### 📋 **Core Types**

#### **WorkSchedule**
```typescript
interface WorkSchedule {
  id: string;                    // UUID
  userId: string;                // UUID - User reference
  workDay: string;               // Day name: 'Monday', 'Tuesday', etc.
  workHours: number;             // Total work hours (0.00-24.00)
  adminTimeHours: number;        // Admin/non-payroll hours (0.00-workHours)
  payrollCapacityHours: number;  // Available payroll processing hours
  usesDefaultAdminTime: boolean; // Whether using position-based defaults
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
}
```

#### **User (Extended)**
```typescript
interface User {
  id: string;                         // UUID
  name: string;                       // Full name
  email: string;                      // Email address
  role: string;                       // System role
  position?: UserPosition;            // Work position
  defaultAdminTimePercentage: number; // Default admin time (0.00-100.00)
  isStaff: boolean;                   // Staff member flag
  isActive: boolean;                  // Active status
  managerId?: string;                 // UUID - Manager reference
  
  // Relationships
  workSchedules: WorkSchedule[];
  primaryConsultantPayrolls: Payroll[];
  backupConsultantPayrolls: Payroll[];
  managedUsers: User[];
}
```

#### **Payroll (Work Schedule Context)**
```typescript
interface Payroll {
  id: string;                      // UUID
  name: string;                    // Payroll name
  clientId: string;                // UUID - Client reference
  primaryConsultantUserId?: string; // UUID - Primary consultant
  backupConsultantUserId?: string;  // UUID - Backup consultant
  processingTime: number;          // Required processing hours
  processingDaysBeforeEft: number; // Processing window in days
  status: PayrollStatus;           // 'active' | 'pending' | 'completed'
  
  // Relationships
  client: Client;
  payrollDates: PayrollDate[];
}
```

#### **PayrollDate**
```typescript
interface PayrollDate {
  id: string;           // UUID
  payrollId: string;    // UUID - Payroll reference
  originalEftDate: string;   // ISO 8601 date - Original EFT date
  processingDate: string;    // ISO 8601 date - When processing must start
  createdAt: string;    // ISO 8601 timestamp
  updatedAt: string;    // ISO 8601 timestamp
}
```

### 📊 **Computed Types**

#### **ConsultantCapacity**
```typescript
interface ConsultantCapacity {
  consultantId: string;
  totalWorkHours: number;           // Weekly total work hours
  totalAdminHours: number;          // Weekly admin time hours
  totalPayrollCapacity: number;     // Weekly payroll processing capacity
  currentlyAssignedHours: number;   // Currently assigned payroll hours
  availableCapacityHours: number;   // Remaining available hours
  utilizationPercentage: number;    // Utilization percentage (0-100+)
  adminTimePercentage: number;      // Admin time as % of total work
  processingWindowDays: number;     // Available processing days per week
}
```

#### **AssignmentRecommendation**
```typescript
interface AssignmentRecommendation {
  consultantId: string;
  consultant: AvailableConsultant;
  score: number;                    // Recommendation score (0-100)
  confidence: 'low' | 'medium' | 'high';
  reasoning: string[];              // Human-readable reasons
  warnings: string[];               // Potential issues
  alternativeTimeline?: {
    suggestedStartDate: string;     // ISO 8601 date
    reason: string;
  };
}
```

---

## GraphQL Schema

### 🔗 **Endpoint**
```
POST https://your-hasura-endpoint.com/v1/graphql
```

### 📝 **Schema Definition**

```graphql
# Work Schedule Core Types
type workSchedule {
  id: uuid!
  userId: uuid!
  workDay: String!
  workHours: numeric!
  adminTimeHours: numeric!
  payrollCapacityHours: numeric!
  usesDefaultAdminTime: Boolean!
  createdAt: timestamp
  updatedAt: timestamp
  
  # Relationships
  user: users!
}

# User Extensions
type users {
  id: uuid!
  name: String!
  email: String!
  role: String!
  position: user_position
  defaultAdminTimePercentage: numeric
  isStaff: Boolean!
  isActive: Boolean!
  managerId: uuid
  
  # Work Schedule Relationships
  workSchedules: [workSchedule!]!
  primaryConsultantPayrolls: [payrolls!]!
  backupConsultantPayrolls: [payrolls!]!
  managedUsers: [users!]!
  managerUser: users
}

# Payroll Types
type payrolls {
  id: uuid!
  name: String!
  clientId: uuid!
  primaryConsultantUserId: uuid
  backupConsultantUserId: uuid
  processingTime: Int
  processingDaysBeforeEft: Int
  status: payroll_status!
  
  # Relationships
  client: clients!
  primaryConsultant: users
  backupConsultant: users
  payrollDates: [payrollDates!]!
}

# Enums
enum user_position {
  consultant
  senior_consultant
  manager
  senior_manager
}

enum payroll_status {
  active
  pending
  completed
  cancelled
}
```

---

## Queries

### 📖 **Team Management Queries**

#### **GetTeamCapacityDashboard**
Retrieve comprehensive team capacity data for managers.

**Query:**
```graphql
query GetTeamCapacityDashboard($managerId: uuid!) {
  users(
    where: {
      managerId: { _eq: $managerId }
      isStaff: { _eq: true }
      isActive: { _eq: true }
    }
    orderBy: { name: ASC }
  ) {
    id
    name
    email
    role
    position
    defaultAdminTimePercentage
    
    workSchedules(orderBy: { workDay: ASC }) {
      id
      workDay
      workHours
      adminTimeHours
      payrollCapacityHours
      usesDefaultAdminTime
    }
    
    primaryConsultantPayrolls(
      where: { status: { _in: ["active", "pending"] } }
    ) {
      id
      name
      processingTime
      processingDaysBeforeEft
      status
      client {
        id
        name
      }
      payrollDates(
        orderBy: { originalEftDate: ASC }
        limit: 5
      ) {
        id
        originalEftDate
        processingDate
      }
    }
    
    backupConsultantPayrolls(
      where: { status: { _in: ["active", "pending"] } }
    ) {
      id
      name
      processingTime
      processingDaysBeforeEft
      status
      client {
        id
        name
      }
    }
  }
}
```

**Variables:**
```json
{
  "managerId": "uuid-string"
}
```

**Response:**
```json
{
  "data": {
    "users": [
      {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "consultant",
        "position": "consultant",
        "defaultAdminTimePercentage": 12.5,
        "workSchedules": [
          {
            "id": "schedule-uuid",
            "workDay": "Monday",
            "workHours": 8.0,
            "adminTimeHours": 1.0,
            "payrollCapacityHours": 7.0,
            "usesDefaultAdminTime": true
          }
        ],
        "primaryConsultantPayrolls": [...],
        "backupConsultantPayrolls": [...]
      }
    ]
  }
}
```

#### **GetConsultantPayrollWorkload**
Retrieve personal workload data for consultants.

**Query:**
```graphql
query GetConsultantPayrollWorkload($userId: uuid!, $startDate: date!, $endDate: date!) {
  userById(id: $userId) {
    id
    name
    email
    role
    defaultAdminTimePercentage
  }
  
  workSchedule(
    where: { userId: { _eq: $userId } }
    orderBy: { workDay: ASC }
  ) {
    id
    workDay
    workHours
    adminTimeHours
    payrollCapacityHours
    usesDefaultAdminTime
  }
  
  primaryPayrolls: payrolls(
    where: {
      primaryConsultantUserId: { _eq: $userId }
      status: { _in: ["active", "pending"] }
    }
  ) {
    id
    name
    processingTime
    processingDaysBeforeEft
    status
    client {
      id
      name
    }
    payrollDates(
      where: {
        originalEftDate: { _gte: $startDate, _lte: $endDate }
      }
      orderBy: { originalEftDate: ASC }
    ) {
      id
      originalEftDate
      processingDate
    }
  }
  
  backupPayrolls: payrolls(
    where: {
      backupConsultantUserId: { _eq: $userId }
      status: { _in: ["active", "pending"] }
    }
  ) {
    id
    name
    processingTime
    processingDaysBeforeEft
    status
    client {
      id
      name
    }
    payrollDates(
      where: {
        originalEftDate: { _gte: $startDate, _lte: $endDate }
      }
      orderBy: { originalEftDate: ASC }
    ) {
      id
      originalEftDate
      processingDate
    }
  }
}
```

**Variables:**
```json
{
  "userId": "uuid-string",
  "startDate": "2025-01-01",
  "endDate": "2025-01-31"
}
```

#### **GetPayrollWorkloadStats**
Retrieve aggregated statistics for workload analysis.

**Query:**
```graphql
query GetPayrollWorkloadStats($userId: uuid!, $startDate: date!, $endDate: date!) {
  workScheduleStats: workScheduleAggregate(
    where: { userId: { _eq: $userId } }
  ) {
    aggregate {
      sum {
        workHours
        adminTimeHours
        payrollCapacityHours
      }
      avg {
        workHours
        payrollCapacityHours
      }
      count
    }
  }
  
  primaryPayrollCount: payrollsAggregate(
    where: {
      primaryConsultantUserId: { _eq: $userId }
      status: { _in: ["active", "pending"] }
    }
  ) {
    aggregate {
      count
      sum {
        processingTime
      }
    }
  }
  
  backupPayrollCount: payrollsAggregate(
    where: {
      backupConsultantUserId: { _eq: $userId }
      status: { _in: ["active", "pending"] }
    }
  ) {
    aggregate {
      count
      sum {
        processingTime
      }
    }
  }
  
  upcomingPayrollDates: payrollDatesAggregate(
    where: {
      _or: [
        { relatedPayroll: { primaryConsultantUserId: { _eq: $userId } } }
        { relatedPayroll: { backupConsultantUserId: { _eq: $userId } } }
      ]
      originalEftDate: { _gte: $startDate, _lte: $endDate }
    }
  ) {
    aggregate {
      count
    }
  }
}
```

### 🔍 **Assignment Queries**

#### **GetAvailableConsultants**
Retrieve consultants available for payroll assignment.

**Query:**
```graphql
query GetAvailableConsultants {
  users(
    where: {
      isStaff: { _eq: true }
      isActive: { _eq: true }
      role: { _in: ["consultant", "senior_consultant", "manager"] }
    }
    orderBy: { name: ASC }
  ) {
    id
    name
    email
    role
    position
    defaultAdminTimePercentage
    
    workSchedules {
      id
      workDay
      workHours
      adminTimeHours
      payrollCapacityHours
      usesDefaultAdminTime
    }
    
    primaryConsultantPayrolls(
      where: { status: { _in: ["active", "pending"] } }
    ) {
      id
      name
      processingTime
      processingDaysBeforeEft
      status
    }
    
    backupConsultantPayrolls(
      where: { status: { _in: ["active", "pending"] } }
    ) {
      id
      name
      processingTime
      processingDaysBeforeEft
      status
    }
  }
}
```

#### **GetPayrollsForBulkAssignment**
Retrieve unassigned payrolls for bulk assignment operations.

**Query:**
```graphql
query GetPayrollsForBulkAssignment {
  payrolls(
    where: {
      _and: [
        { status: { _eq: "active" } }
        { 
          _or: [
            { primaryConsultantUserId: { _is_null: true } }
            { backupConsultantUserId: { _is_null: true } }
          ]
        }
      ]
    }
    orderBy: { name: ASC }
  ) {
    id
    name
    processingTime
    processingDaysBeforeEft
    status
    client {
      id
      name
    }
    payrollDates(
      where: {
        originalEftDate: { _gte: "now" }
      }
      orderBy: { originalEftDate: ASC }
      limit: 3
    ) {
      id
      originalEftDate
      processingDate
    }
  }
}
```

---

## Mutations

### ✏️ **Work Schedule Management**

#### **UpsertWorkSchedule**
Create or update a work schedule entry with conflict resolution.

**Mutation:**
```graphql
mutation UpsertWorkSchedule(
  $userId: uuid!
  $workDay: String!
  $workHours: numeric!
  $adminTimeHours: numeric!
  $payrollCapacityHours: numeric!
  $usesDefaultAdminTime: Boolean!
) {
  insertWorkSchedule(
    object: {
      userId: $userId
      workDay: $workDay
      workHours: $workHours
      adminTimeHours: $adminTimeHours
      payrollCapacityHours: $payrollCapacityHours
      usesDefaultAdminTime: $usesDefaultAdminTime
    }
    onConflict: {
      constraint: unique_user_work_day
      updateColumns: [workHours, adminTimeHours, payrollCapacityHours, usesDefaultAdminTime]
    }
  ) {
    id
    userId
    workDay
    workHours
    adminTimeHours
    payrollCapacityHours
    usesDefaultAdminTime
    updatedAt
  }
}
```

**Variables:**
```json
{
  "userId": "uuid-string",
  "workDay": "Monday",
  "workHours": 8.0,
  "adminTimeHours": 1.0,
  "payrollCapacityHours": 7.0,
  "usesDefaultAdminTime": true
}
```

**Response:**
```json
{
  "data": {
    "insertWorkSchedule": {
      "id": "schedule-uuid",
      "userId": "user-uuid",
      "workDay": "Monday",
      "workHours": 8.0,
      "adminTimeHours": 1.0,
      "payrollCapacityHours": 7.0,
      "usesDefaultAdminTime": true,
      "updatedAt": "2025-01-01T12:00:00Z"
    }
  }
}
```

#### **UpdateUserDefaultAdminTime**
Update the default admin time percentage for a user.

**Mutation:**
```graphql
mutation UpdateUserDefaultAdminTime($userId: uuid!, $percentage: numeric!) {
  updateUserById(
    pkColumns: { id: $userId }
    _set: { defaultAdminTimePercentage: $percentage }
  ) {
    id
    defaultAdminTimePercentage
    updatedAt
  }
}
```

**Variables:**
```json
{
  "userId": "uuid-string",
  "percentage": 15.0
}
```

#### **BulkUpdateWorkSchedules**
Update multiple work schedule entries in a single operation.

**Mutation:**
```graphql
mutation BulkUpdateWorkSchedules($schedules: [workScheduleInsertInput!]!) {
  insertWorkSchedule(
    objects: $schedules
    onConflict: {
      constraint: unique_user_work_day
      updateColumns: [workHours, adminTimeHours, payrollCapacityHours, usesDefaultAdminTime]
    }
  ) {
    returning {
      id
      userId
      workDay
      workHours
      adminTimeHours
      payrollCapacityHours
      usesDefaultAdminTime
    }
  }
}
```

**Variables:**
```json
{
  "schedules": [
    {
      "userId": "uuid-string",
      "workDay": "Monday",
      "workHours": 8.0,
      "adminTimeHours": 1.0,
      "payrollCapacityHours": 7.0,
      "usesDefaultAdminTime": true
    },
    {
      "userId": "uuid-string",
      "workDay": "Tuesday",
      "workHours": 8.0,
      "adminTimeHours": 1.0,
      "payrollCapacityHours": 7.0,
      "usesDefaultAdminTime": true
    }
  ]
}
```

### 🎯 **Payroll Assignment**

#### **AssignPayrollToConsultant**
Assign a payroll to a primary or backup consultant.

**Mutation:**
```graphql
mutation AssignPayrollToConsultant(
  $payrollId: uuid!
  $consultantId: uuid!
  $role: String! # "primary" or "backup"
) {
  updatePayrollById(
    pkColumns: { id: $payrollId }
    _set: {
      primaryConsultantUserId: $role == "primary" ? $consultantId : null
      backupConsultantUserId: $role == "backup" ? $consultantId : null
    }
  ) {
    id
    name
    primaryConsultantUserId
    backupConsultantUserId
    primaryConsultant {
      id
      name
      email
    }
    backupConsultant {
      id
      name
      email
    }
  }
}
```

#### **BulkAssignPayrolls**
Assign multiple payrolls in a single operation.

**Mutation:**
```graphql
mutation BulkAssignPayrolls($assignments: [payrollUpdates!]!) {
  updatePayrollsMany(updates: $assignments) {
    returning {
      id
      name
      primaryConsultantUserId
      backupConsultantUserId
    }
  }
}
```

---

## Subscriptions

### 🔄 **Real-time Updates**

#### **WorkScheduleUpdates**
Subscribe to real-time work schedule changes.

**Subscription:**
```graphql
subscription WorkScheduleUpdates($userId: uuid!) {
  workSchedule(
    where: { userId: { _eq: $userId } }
  ) {
    id
    workDay
    workHours
    adminTimeHours
    payrollCapacityHours
    usesDefaultAdminTime
    updatedAt
  }
}
```

#### **TeamCapacityUpdates**
Subscribe to team capacity changes for managers.

**Subscription:**
```graphql
subscription TeamCapacityUpdates($managerId: uuid!) {
  users(
    where: {
      managerId: { _eq: $managerId }
      isStaff: { _eq: true }
    }
  ) {
    id
    name
    workSchedules {
      id
      workDay
      workHours
      payrollCapacityHours
      updatedAt
    }
    primaryConsultantPayrolls(where: { status: { _eq: "active" } }) {
      id
      name
      processingTime
    }
  }
}
```

---

## Error Handling

### ❌ **Error Types**

#### **Validation Errors**
```json
{
  "errors": [
    {
      "message": "Work hours cannot exceed 24 hours per day",
      "extensions": {
        "code": "VALIDATION_ERROR",
        "field": "workHours",
        "value": 25.0
      }
    }
  ]
}
```

#### **Permission Errors**
```json
{
  "errors": [
    {
      "message": "Insufficient permissions to access team data",
      "extensions": {
        "code": "PERMISSION_DENIED",
        "required_role": "manager",
        "user_role": "consultant"
      }
    }
  ]
}
```

#### **Constraint Violations**
```json
{
  "errors": [
    {
      "message": "Cannot assign consultant to overlapping payroll processing windows",
      "extensions": {
        "code": "BUSINESS_RULE_VIOLATION",
        "constraint": "processing_window_conflict",
        "details": {
          "conflicting_payrolls": ["payroll-1", "payroll-2"],
          "processing_dates": ["2025-01-15", "2025-01-16"]
        }
      }
    }
  ]
}
```

### 🛠️ **Error Handling Best Practices**

```typescript
// Client-side error handling
const { data, error } = useQuery(GET_TEAM_CAPACITY, {
  errorPolicy: 'all', // Include partial data
  onError: (error) => {
    error.graphQLErrors.forEach(({ message, extensions }) => {
      if (extensions?.code === 'PERMISSION_DENIED') {
        // Handle permission error
        redirectToUnauthorized();
      } else if (extensions?.code === 'VALIDATION_ERROR') {
        // Handle validation error
        showValidationMessage(message, extensions.field);
      }
    });
  },
});
```

---

## Rate Limiting

### ⏱️ **Rate Limits**

| Operation Type | Limit | Window | Scope |
|---------------|-------|--------|-------|
| Queries | 100 requests | 1 minute | Per user |
| Mutations | 20 requests | 1 minute | Per user |
| Subscriptions | 5 connections | Concurrent | Per user |
| Bulk Operations | 5 requests | 5 minutes | Per user |

### 📊 **Rate Limit Headers**

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
X-RateLimit-Window: 60
```

### 🚫 **Rate Limit Exceeded**

```json
{
  "errors": [
    {
      "message": "Rate limit exceeded",
      "extensions": {
        "code": "RATE_LIMIT_EXCEEDED",
        "limit": 100,
        "window": 60,
        "reset_at": "2025-01-01T12:01:00Z"
      }
    }
  ]
}
```

---

## SDK Usage Examples

### 🔧 **Apollo Client (React)**

#### **Setup**
```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth } from '@clerk/nextjs';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
});

const authLink = setContext(async (_, { headers }) => {
  const { getToken } = useAuth();
  const token = await getToken({ template: 'hasura' });
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

#### **Query Usage**
```typescript
import { useQuery } from '@apollo/client';
import { GetTeamCapacityDashboardDocument } from './generated/graphql';

function CapacityDashboard({ managerId }: { managerId: string }) {
  const { data, loading, error, refetch } = useQuery(
    GetTeamCapacityDashboardDocument,
    {
      variables: { managerId },
      errorPolicy: 'all',
      pollInterval: 30000, // Poll every 30 seconds
    }
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div>
      {data?.users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

#### **Mutation Usage**
```typescript
import { useMutation } from '@apollo/client';
import { UpsertWorkScheduleDocument } from './generated/graphql';

function WorkScheduleEditor() {
  const [upsertWorkSchedule, { loading, error }] = useMutation(
    UpsertWorkScheduleDocument,
    {
      onCompleted: () => {
        toast.success('Work schedule updated successfully');
      },
      onError: (error) => {
        toast.error(`Failed to update: ${error.message}`);
      },
      // Optimistic update
      optimisticResponse: {
        insertWorkSchedule: {
          __typename: 'workSchedule',
          id: 'temp-id',
          // ... other fields
        },
      },
      // Update cache
      update: (cache, { data }) => {
        if (data?.insertWorkSchedule) {
          cache.modify({
            id: cache.identify({ __typename: 'users', id: userId }),
            fields: {
              workSchedules: (existing = []) => {
                return [...existing, data.insertWorkSchedule];
              },
            },
          });
        }
      },
    }
  );

  const handleSave = async (scheduleData: WorkScheduleInput) => {
    try {
      await upsertWorkSchedule({
        variables: scheduleData,
      });
    } catch (error) {
      console.error('Mutation failed:', error);
    }
  };

  return (
    <form onSubmit={handleSave}>
      {/* Form implementation */}
    </form>
  );
}
```

### 🔄 **Custom Hooks**

```typescript
// Custom hook for work schedule management
export function useWorkScheduleManagement(userId: string) {
  const [upsertWorkSchedule] = useMutation(UpsertWorkScheduleDocument);
  const [updateAdminTime] = useMutation(UpdateUserDefaultAdminTimeDocument);
  
  const { data, loading, error, refetch } = useQuery(
    GetConsultantPayrollWorkloadDocument,
    {
      variables: { 
        userId,
        startDate: format(startOfWeek(new Date()), 'yyyy-MM-dd'),
        endDate: format(addWeeks(new Date(), 4), 'yyyy-MM-dd'),
      },
      skip: !userId,
    }
  );

  const updateWorkSchedule = useCallback(async (
    workDay: string,
    updates: Partial<WorkScheduleInput>
  ) => {
    return upsertWorkSchedule({
      variables: {
        userId,
        workDay,
        ...updates,
      },
    });
  }, [userId, upsertWorkSchedule]);

  const updateDefaultAdminTime = useCallback(async (percentage: number) => {
    return updateAdminTime({
      variables: { userId, percentage },
    });
  }, [userId, updateAdminTime]);

  return {
    workScheduleData: data,
    loading,
    error,
    refetch,
    updateWorkSchedule,
    updateDefaultAdminTime,
  };
}
```

### 📊 **Error Handling Utilities**

```typescript
// Error handling utilities
export function isPermissionError(error: ApolloError): boolean {
  return error.graphQLErrors.some(
    err => err.extensions?.code === 'PERMISSION_DENIED'
  );
}

export function isValidationError(error: ApolloError): boolean {
  return error.graphQLErrors.some(
    err => err.extensions?.code === 'VALIDATION_ERROR'
  );
}

export function getValidationFields(error: ApolloError): string[] {
  return error.graphQLErrors
    .filter(err => err.extensions?.code === 'VALIDATION_ERROR')
    .map(err => err.extensions?.field)
    .filter(Boolean);
}

// Usage in components
const handleError = (error: ApolloError) => {
  if (isPermissionError(error)) {
    router.push('/unauthorized');
  } else if (isValidationError(error)) {
    const fields = getValidationFields(error);
    setFieldErrors(fields);
  } else {
    toast.error('An unexpected error occurred');
  }
};
```

---

*This API documentation provides comprehensive coverage of the Work Schedule System's GraphQL interface. For implementation examples and additional details, refer to the developer documentation and SDK usage guides.*

**Last Updated**: January 2025 | **Version**: 2.0 | **System**: Payroll Matrix Work Schedule API