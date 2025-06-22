# Complete API Documentation - Payroll Matrix

## Overview

The Payroll Matrix API provides a comprehensive RESTful interface for payroll management operations. All API endpoints are secured with Clerk authentication and implement role-based access control (RBAC) with comprehensive audit logging for SOC2 compliance.

## Base URL

```
Production: https://payroll-matrix.vercel.app/api
Development: http://localhost:3000/api
```

## Authentication

All API endpoints (except public routes) require authentication via Clerk JWT tokens.

### Authentication Headers

```http
Authorization: Bearer <clerk_jwt_token>
Content-Type: application/json
```

### Getting Authentication Token

```javascript
// Client-side with Clerk
const token = await window.Clerk.session.getToken({ template: "hasura" });

// Server-side with Clerk
import { auth } from "@clerk/nextjs/server";
const { getToken } = auth();
const token = await getToken({ template: "hasura" });
```

## Error Handling

All API endpoints return standardized error responses:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": "Valid JWT token must be provided",
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### Error Codes

- `UNAUTHORIZED` - Authentication required or invalid token
- `FORBIDDEN` - Insufficient permissions for operation
- `NOT_FOUND` - Requested resource not found
- `VALIDATION_ERROR` - Invalid input data
- `RATE_LIMITED` - Too many requests
- `INTERNAL_ERROR` - Server error

## Rate Limiting

| Endpoint Category  | Limit       | Window    |
| ------------------ | ----------- | --------- |
| Authentication     | 10 requests | 1 minute  |
| User Management    | 50 requests | 1 minute  |
| Staff Operations   | 5 requests  | 5 minutes |
| Payroll Operations | 20 requests | 1 minute  |
| Compliance Reports | 3 requests  | 5 minutes |

## Authentication & Authorization Endpoints

### Get Hasura JWT Token

Get a JWT token for Hasura GraphQL operations.

```http
GET /api/auth/token
```

**Response:**

```json
{
  "token": "eyJhbGciOiJSUzI1NiIs...",
  "expires": "2024-01-15T11:30:00Z",
  "userId": "user_abc123",
  "role": "manager"
}
```

**Rate Limit:** 10 requests/minute

---

### Debug JWT Token

Debug and validate JWT token claims (Developer only).

```http
GET /api/auth/debug-token
```

**Response:**

```json
{
  "valid": true,
  "claims": {
    "sub": "user_abc123",
    "role": "manager",
    "https://hasura.io/jwt/claims": {
      "x-hasura-user-id": "uuid-here",
      "x-hasura-default-role": "manager",
      "x-hasura-allowed-roles": ["manager", "viewer"]
    }
  },
  "expires": "2024-01-15T11:30:00Z"
}
```

**Access:** Developer role only

---

### Get Hasura Claims

Extract Hasura claims from current session.

```http
GET /api/auth/hasura-claims
```

**Response:**

```json
{
  "userId": "uuid-here",
  "role": "manager",
  "allowedRoles": ["manager", "viewer"],
  "claims": {
    "x-hasura-user-id": "uuid-here",
    "x-hasura-default-role": "manager",
    "x-hasura-allowed-roles": ["manager", "viewer"]
  }
}
```

---

### Check User Role

Verify current user's role and permissions.

```http
GET /api/check-role
```

**Response:**

```json
{
  "userId": "user_abc123",
  "role": "manager",
  "permissions": [
    "payroll:read",
    "payroll:write",
    "staff:read",
    "client:read",
    "client:write"
  ],
  "isStaff": true,
  "managerId": "user_def456"
}
```

## User & Staff Management Endpoints

### List Users

Get paginated list of users with filtering.

```http
GET /api/users?page=1&limit=50&role=manager&isActive=true
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)
- `role` (optional): Filter by role
- `isActive` (optional): Filter by active status
- `search` (optional): Search by name or email

**Response:**

```json
{
  "users": [
    {
      "id": "uuid-here",
      "name": "John Smith",
      "email": "john@company.com",
      "role": "manager",
      "isStaff": true,
      "isActive": true,
      "managerId": "uuid-manager",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLoginAt": "2024-01-15T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 125,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Access:** Admin, Manager roles

---

### Create User Invitation

Create a new user invitation with role assignment.

```http
POST /api/users
```

**Request Body:**

```json
{
  "email": "newuser@company.com",
  "name": "New User",
  "role": "consultant",
  "managerId": "uuid-manager",
  "sendInvitation": true,
  "customMessage": "Welcome to Payroll Matrix!"
}
```

**Response:**

```json
{
  "success": true,
  "invitation": {
    "id": "inv_abc123",
    "email": "newuser@company.com",
    "role": "consultant",
    "status": "pending",
    "expiresAt": "2024-01-22T00:00:00Z",
    "invitationUrl": "https://app.com/accept-invitation?token=abc123"
  },
  "auditId": "audit_xyz789"
}
```

**Access:** Admin, Manager roles
**Rate Limit:** 5 requests/5 minutes

---

### Get User Details

Get detailed information about a specific user.

```http
GET /api/users/[id]
```

**Response:**

```json
{
  "user": {
    "id": "uuid-here",
    "name": "John Smith",
    "email": "john@company.com",
    "role": "manager",
    "isStaff": true,
    "isActive": true,
    "managerId": "uuid-manager",
    "manager": {
      "id": "uuid-manager",
      "name": "Manager Name",
      "email": "manager@company.com"
    },
    "directReports": [
      {
        "id": "uuid-report",
        "name": "Report Name",
        "role": "consultant"
      }
    ],
    "workSchedule": [
      {
        "day": "Monday",
        "hours": 8.0
      }
    ],
    "assignedPayrolls": [
      {
        "id": "uuid-payroll",
        "name": "Client A Weekly",
        "role": "primary_consultant"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLoginAt": "2024-01-15T09:00:00Z"
  }
}
```

**Access:** Admin, Manager, or Self

---

### Update User Profile

Update user profile information.

```http
POST /api/users/update-profile
```

**Request Body:**

```json
{
  "name": "Updated Name",
  "phone": "+61400000000",
  "preferences": {
    "timezone": "Australia/Sydney",
    "dateFormat": "DD/MM/YYYY",
    "notifications": {
      "email": true,
      "browser": false
    }
  }
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "name": "Updated Name",
    "phone": "+61400000000",
    "preferences": {
      "timezone": "Australia/Sydney",
      "dateFormat": "DD/MM/YYYY",
      "notifications": {
        "email": true,
        "browser": false
      }
    },
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "auditId": "audit_xyz789"
}
```

**Access:** Self only

---

### Create Staff Member

Create a new staff member with full profile.

```http
POST /api/staff/create
```

**Request Body:**

```json
{
  "email": "staff@company.com",
  "name": "New Staff Member",
  "role": "consultant",
  "managerId": "uuid-manager",
  "workSchedule": [
    {
      "day": "Monday",
      "hours": 8.0
    },
    {
      "day": "Tuesday",
      "hours": 8.0
    }
  ],
  "startDate": "2024-01-16",
  "sendInvitation": true
}
```

**Response:**

```json
{
  "success": true,
  "staff": {
    "id": "uuid-new-staff",
    "email": "staff@company.com",
    "name": "New Staff Member",
    "role": "consultant",
    "managerId": "uuid-manager",
    "isActive": true,
    "startDate": "2024-01-16",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "invitation": {
    "id": "inv_abc123",
    "status": "pending",
    "expiresAt": "2024-01-22T00:00:00Z"
  },
  "auditId": "audit_xyz789"
}
```

**Access:** Admin only
**Rate Limit:** 5 requests/5 minutes

---

### Update Staff Role

Update a staff member's role.

```http
POST /api/staff/update-role
```

**Request Body:**

```json
{
  "staffId": "uuid-staff",
  "newRole": "manager",
  "reason": "Promotion to team lead"
}
```

**Response:**

```json
{
  "success": true,
  "staff": {
    "id": "uuid-staff",
    "name": "Staff Name",
    "previousRole": "consultant",
    "newRole": "manager",
    "updatedAt": "2024-01-15T10:30:00Z",
    "updatedBy": "uuid-admin"
  },
  "auditId": "audit_xyz789"
}
```

**Access:** Admin only

---

### Deactivate Staff

Deactivate a staff member (soft delete).

```http
POST /api/staff/delete
```

**Request Body:**

```json
{
  "staffId": "uuid-staff",
  "reason": "End of employment",
  "lastWorkingDay": "2024-01-31",
  "reassignPayrolls": true,
  "newAssigneeId": "uuid-replacement"
}
```

**Response:**

```json
{
  "success": true,
  "staff": {
    "id": "uuid-staff",
    "name": "Staff Name",
    "isActive": false,
    "deactivatedAt": "2024-01-15T10:30:00Z",
    "lastWorkingDay": "2024-01-31",
    "deactivatedBy": "uuid-admin"
  },
  "reassignments": [
    {
      "payrollId": "uuid-payroll",
      "payrollName": "Client A Weekly",
      "newAssigneeId": "uuid-replacement",
      "newAssigneeName": "Replacement Name"
    }
  ],
  "auditId": "audit_xyz789"
}
```

**Access:** Admin only

---

### Check Invitation Status

Check the status of a user invitation.

```http
GET /api/staff/invitation-status?email=user@company.com
```

**Response:**

```json
{
  "email": "user@company.com",
  "hasInvitation": true,
  "invitation": {
    "id": "inv_abc123",
    "status": "pending",
    "sentAt": "2024-01-15T10:00:00Z",
    "expiresAt": "2024-01-22T10:00:00Z",
    "role": "consultant"
  }
}
```

**Access:** Admin only

## Payroll Management Endpoints

### List Payrolls

Get paginated list of payrolls with filtering.

```http
GET /api/payrolls?page=1&limit=50&status=Active&clientId=uuid-client
```

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status (Active, Implementation, Inactive)
- `clientId` (optional): Filter by client
- `consultantId` (optional): Filter by assigned consultant
- `search` (optional): Search by name

**Response:**

```json
{
  "payrolls": [
    {
      "id": "uuid-payroll",
      "name": "Client A Weekly Payroll",
      "client": {
        "id": "uuid-client",
        "name": "Client A Pty Ltd"
      },
      "cycle": "weekly",
      "status": "Active",
      "primaryConsultant": {
        "id": "uuid-consultant",
        "name": "John Smith"
      },
      "manager": {
        "id": "uuid-manager",
        "name": "Jane Doe"
      },
      "employeeCount": 25,
      "nextEftDate": "2024-01-18",
      "processingDate": "2024-01-15",
      "goLiveDate": "2024-01-01",
      "version": 2,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 75,
    "totalPages": 2,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Access:** Viewer+ (filtered by permissions)

---

### Create Payroll

Create a new payroll configuration.

```http
POST /api/payrolls
```

**Request Body:**

```json
{
  "name": "New Client Weekly Payroll",
  "clientId": "uuid-client",
  "cycle": "weekly",
  "dateType": "fixed_day",
  "dateValue": 5,
  "primaryConsultantId": "uuid-consultant",
  "backupConsultantId": "uuid-backup",
  "managerId": "uuid-manager",
  "processingDaysBeforeEft": 2,
  "payrollSystem": "MYOB",
  "processingTime": 1,
  "employeeCount": 30,
  "goLiveDate": "2024-02-01",
  "notes": "New client onboarding"
}
```

**Response:**

```json
{
  "success": true,
  "payroll": {
    "id": "uuid-new-payroll",
    "name": "New Client Weekly Payroll",
    "clientId": "uuid-client",
    "cycle": "weekly",
    "dateType": "fixed_day",
    "dateValue": 5,
    "status": "Implementation",
    "version": 1,
    "goLiveDate": "2024-02-01",
    "createdAt": "2024-01-15T10:30:00Z",
    "createdBy": "uuid-admin"
  },
  "generatedDates": {
    "count": 52,
    "nextEftDate": "2024-02-02",
    "lastEftDate": "2024-12-27"
  },
  "auditId": "audit_xyz789"
}
```

**Access:** Admin, Manager roles
**Rate Limit:** 20 requests/minute

---

### Get Payroll Details

Get detailed information about a specific payroll.

```http
GET /api/payrolls/[id]
```

**Response:**

```json
{
  "payroll": {
    "id": "uuid-payroll",
    "name": "Client A Weekly Payroll",
    "client": {
      "id": "uuid-client",
      "name": "Client A Pty Ltd",
      "contactPerson": "Contact Name",
      "contactEmail": "contact@clienta.com"
    },
    "cycle": "weekly",
    "dateType": "fixed_day",
    "dateValue": 5,
    "status": "Active",
    "primaryConsultant": {
      "id": "uuid-consultant",
      "name": "John Smith",
      "email": "john@company.com"
    },
    "backupConsultant": {
      "id": "uuid-backup",
      "name": "Jane Backup",
      "email": "jane@company.com"
    },
    "manager": {
      "id": "uuid-manager",
      "name": "Manager Name",
      "email": "manager@company.com"
    },
    "processingDaysBeforeEft": 2,
    "payrollSystem": "MYOB",
    "processingTime": 1,
    "employeeCount": 25,
    "goLiveDate": "2024-01-01",
    "version": 2,
    "parentPayrollId": "uuid-parent",
    "versionReason": "Consultant change",
    "upcomingDates": [
      {
        "id": "uuid-date",
        "originalEftDate": "2024-01-19",
        "adjustedEftDate": "2024-01-19",
        "processingDate": "2024-01-17",
        "assignment": {
          "consultantId": "uuid-consultant",
          "consultantName": "John Smith"
        }
      }
    ],
    "notes": [
      {
        "id": "uuid-note",
        "content": "Client prefers morning processing",
        "important": true,
        "createdBy": "uuid-user",
        "createdAt": "2024-01-10T00:00:00Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "createdBy": "uuid-admin"
  }
}
```

**Access:** Based on role and payroll assignment

---

### Update Payroll

Update payroll configuration (creates new version).

```http
PUT /api/payrolls/[id]
```

**Request Body:**

```json
{
  "primaryConsultantId": "uuid-new-consultant",
  "processingDaysBeforeEft": 3,
  "employeeCount": 28,
  "versionReason": "Consultant change and processing adjustment",
  "effectiveDate": "2024-01-20"
}
```

**Response:**

```json
{
  "success": true,
  "payroll": {
    "id": "uuid-new-version",
    "name": "Client A Weekly Payroll",
    "version": 3,
    "parentPayrollId": "uuid-payroll",
    "versionReason": "Consultant change and processing adjustment",
    "effectiveDate": "2024-01-20",
    "primaryConsultantId": "uuid-new-consultant",
    "processingDaysBeforeEft": 3,
    "employeeCount": 28,
    "createdAt": "2024-01-15T10:30:00Z",
    "createdBy": "uuid-admin"
  },
  "supersededPayroll": {
    "id": "uuid-payroll",
    "supersededDate": "2024-01-20",
    "version": 2
  },
  "regeneratedDates": {
    "count": 45,
    "fromDate": "2024-01-20"
  },
  "auditId": "audit_xyz789"
}
```

**Access:** Admin, Manager roles

---

### Get Payroll Schedule

Get payroll processing schedule overview.

```http
GET /api/payrolls/schedule?startDate=2024-01-15&endDate=2024-01-31
```

**Query Parameters:**

- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date
- `consultantId` (optional): Filter by consultant

**Response:**

```json
{
  "schedule": [
    {
      "date": "2024-01-17",
      "payrolls": [
        {
          "id": "uuid-payroll",
          "name": "Client A Weekly",
          "client": "Client A Pty Ltd",
          "eftDate": "2024-01-19",
          "consultant": {
            "id": "uuid-consultant",
            "name": "John Smith"
          },
          "status": "pending",
          "processingTime": 1
        }
      ],
      "totalPayrolls": 1,
      "totalProcessingTime": 1
    }
  ],
  "summary": {
    "totalPayrolls": 15,
    "totalProcessingTime": 22,
    "consultantWorkload": [
      {
        "consultantId": "uuid-consultant",
        "name": "John Smith",
        "payrollCount": 8,
        "processingTime": 12
      }
    ]
  }
}
```

**Access:** Viewer+ access

---

### Get Payroll Dates

Get payroll dates for a specific payroll.

```http
GET /api/payroll-dates/[payrollId]?limit=50&offset=0&future=true
```

**Query Parameters:**

- `limit` (optional): Number of dates to return
- `offset` (optional): Pagination offset
- `future` (optional): Only future dates
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

**Response:**

```json
{
  "payrollDates": [
    {
      "id": "uuid-date",
      "payrollId": "uuid-payroll",
      "originalEftDate": "2024-01-19",
      "adjustedEftDate": "2024-01-19",
      "processingDate": "2024-01-17",
      "assignment": {
        "id": "uuid-assignment",
        "consultantId": "uuid-consultant",
        "consultantName": "John Smith",
        "isBackup": false,
        "originalConsultantId": null,
        "assignedDate": "2024-01-01T00:00:00Z"
      },
      "notes": "Standard processing",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 52,
    "hasMore": true
  }
}
```

**Access:** Based on payroll assignment

---

### Get Generated Dates

Get system-generated payroll dates across all payrolls.

```http
GET /api/payroll-dates/generated?startDate=2024-01-15&endDate=2024-01-31&consultantId=uuid-consultant
```

**Response:**

```json
{
  "generatedDates": [
    {
      "date": "2024-01-17",
      "payrolls": [
        {
          "id": "uuid-payroll",
          "name": "Client A Weekly",
          "client": "Client A Pty Ltd",
          "eftDate": "2024-01-19",
          "consultant": "John Smith",
          "processingTime": 1
        }
      ]
    }
  ],
  "summary": {
    "totalDates": 10,
    "totalPayrolls": 25,
    "consultantWorkload": {
      "uuid-consultant": {
        "name": "John Smith",
        "dates": 5,
        "payrolls": 12
      }
    }
  }
}
```

**Access:** Viewer+ access

---

### Commit Payroll Assignments

Commit consultant assignments for payroll dates.

```http
POST /api/commit-payroll-assignments
```

**Request Body:**

```json
{
  "assignments": [
    {
      "payrollDateId": "uuid-date",
      "consultantId": "uuid-consultant",
      "isBackup": false,
      "notes": "Regular assignment"
    },
    {
      "payrollDateId": "uuid-date-2",
      "consultantId": "uuid-backup",
      "isBackup": true,
      "originalConsultantId": "uuid-consultant",
      "notes": "Consultant on leave"
    }
  ],
  "reason": "Monthly assignment review",
  "effectiveDate": "2024-01-15"
}
```

**Response:**

```json
{
  "success": true,
  "committed": {
    "count": 2,
    "assignments": [
      {
        "id": "uuid-assignment",
        "payrollDateId": "uuid-date",
        "consultantId": "uuid-consultant",
        "consultantName": "John Smith",
        "isBackup": false,
        "assignedDate": "2024-01-15T10:30:00Z"
      }
    ]
  },
  "auditId": "audit_xyz789"
}
```

**Access:** Admin, Manager roles

## CRON & Background Job Endpoints

### Generate Batch Payroll Dates

Generate payroll dates for multiple payrolls.

```http
POST /api/cron/generate-batch
```

**Request Body:**

```json
{
  "payrollIds": ["uuid-payroll-1", "uuid-payroll-2"],
  "fromDate": "2024-01-15",
  "toDate": "2024-12-31",
  "regenerate": false
}
```

**Response:**

```json
{
  "success": true,
  "results": [
    {
      "payrollId": "uuid-payroll-1",
      "payrollName": "Client A Weekly",
      "generated": 45,
      "skipped": 2,
      "errors": 0
    }
  ],
  "summary": {
    "totalPayrolls": 2,
    "totalGenerated": 90,
    "totalSkipped": 4,
    "totalErrors": 0,
    "duration": "2.3s"
  },
  "auditId": "audit_xyz789"
}
```

**Access:** Admin only

---

### Cleanup Old Dates

Remove old payroll dates beyond retention period.

```http
POST /api/cron/cleanup-old-dates
```

**Request Body:**

```json
{
  "cutoffDate": "2023-01-01",
  "dryRun": false
}
```

**Response:**

```json
{
  "success": true,
  "cleaned": {
    "payrollDates": 156,
    "assignments": 156,
    "oldestRemoved": "2022-12-31",
    "newestRemoved": "2023-01-01"
  },
  "retained": {
    "payrollDates": 2840,
    "assignments": 2840
  },
  "auditId": "audit_xyz789"
}
```

**Access:** Admin only

---

### Sync Holiday Data

Synchronize holiday data from external sources.

```http
POST /api/cron/sync-holidays
```

**Request Body:**

```json
{
  "year": 2024,
  "regions": ["AU", "AU-NSW", "AU-VIC"],
  "force": false
}
```

**Response:**

```json
{
  "success": true,
  "synced": {
    "holidays": 45,
    "new": 12,
    "updated": 3,
    "regions": ["AU", "AU-NSW", "AU-VIC"]
  },
  "nextSync": "2024-02-01T00:00:00Z",
  "auditId": "audit_xyz789"
}
```

**Access:** System/Admin

## Audit & Compliance Endpoints

### Create Audit Log

Manually create audit log entry.

```http
POST /api/audit/log
```

**Request Body:**

```json
{
  "action": "payroll_created",
  "resourceType": "payroll",
  "resourceId": "uuid-payroll",
  "oldValues": null,
  "newValues": {
    "name": "New Payroll",
    "status": "Implementation"
  },
  "metadata": {
    "source": "api",
    "userAgent": "Mozilla/5.0...",
    "ipAddress": "192.168.1.1"
  }
}
```

**Response:**

```json
{
  "success": true,
  "auditLog": {
    "id": "audit_xyz789",
    "eventTime": "2024-01-15T10:30:00Z",
    "userId": "uuid-user",
    "userEmail": "user@company.com",
    "userRole": "admin",
    "action": "payroll_created",
    "resourceType": "payroll",
    "resourceId": "uuid-payroll",
    "success": true
  }
}
```

**Access:** Admin only

---

### Generate Compliance Report

Generate SOC2 compliance reports.

```http
GET /api/audit/compliance-report?startDate=2024-01-01&endDate=2024-01-31&type=access_review
```

**Query Parameters:**

- `startDate`: Report start date
- `endDate`: Report end date
- `type`: Report type (access_review, data_access, permission_changes, security_events)
- `format`: Response format (json, csv)

**Response:**

```json
{
  "report": {
    "id": "report_abc123",
    "type": "access_review",
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    },
    "summary": {
      "totalUsers": 25,
      "activeUsers": 23,
      "newUsers": 3,
      "deactivatedUsers": 1,
      "roleChanges": 2,
      "permissionChanges": 5
    },
    "details": [
      {
        "userId": "uuid-user",
        "userName": "John Smith",
        "role": "manager",
        "lastLogin": "2024-01-30T09:00:00Z",
        "accessCount": 156,
        "riskScore": "low"
      }
    ],
    "generatedAt": "2024-01-31T23:59:59Z",
    "generatedBy": "uuid-admin"
  }
}
```

**Access:** Admin only
**Rate Limit:** 3 requests/5 minutes

## Developer Tools Endpoints

### Developer Dashboard

Get developer system overview.

```http
GET /api/developer
```

**Response:**

```json
{
  "system": {
    "version": "1.2.3",
    "environment": "development",
    "database": {
      "status": "connected",
      "version": "PostgreSQL 15.4",
      "poolSize": 10
    },
    "hasura": {
      "status": "connected",
      "version": "v2.35.0"
    },
    "clerk": {
      "status": "connected",
      "environment": "development"
    }
  },
  "statistics": {
    "totalUsers": 25,
    "totalPayrolls": 75,
    "totalDates": 3840,
    "auditLogs": 15620
  },
  "recentErrors": [
    {
      "timestamp": "2024-01-15T10:25:00Z",
      "error": "GraphQL validation error",
      "endpoint": "/api/payrolls",
      "userId": "uuid-user"
    }
  ]
}
```

**Access:** Developer only

---

### Clean All Dates

Remove all generated payroll dates (development only).

```http
POST /api/developer/clean-all-dates
```

**Response:**

```json
{
  "success": true,
  "cleaned": {
    "payrollDates": 3840,
    "assignments": 3840
  },
  "warning": "All payroll dates have been removed"
}
```

**Access:** Developer only (development environment)

---

### Regenerate All Dates

Regenerate all payroll dates for all active payrolls.

```http
POST /api/developer/regenerate-all-dates
```

**Response:**

```json
{
  "success": true,
  "regenerated": {
    "payrolls": 75,
    "dates": 3900,
    "assignments": 3900
  },
  "duration": "45.2s"
}
```

**Access:** Developer only

## External Integration Endpoints

### Clerk Webhook Handler

Handle Clerk authentication webhooks.

```http
POST /api/webhooks/clerk
```

**Headers:**

```http
svix-id: msg_abc123
svix-timestamp: 1642637737
svix-signature: v1,signature_here
```

**Request Body (example - user.created):**

```json
{
  "type": "user.created",
  "data": {
    "id": "user_abc123",
    "email_addresses": [
      {
        "email_address": "user@company.com",
        "verification": {
          "status": "verified"
        }
      }
    ],
    "first_name": "John",
    "last_name": "Smith",
    "public_metadata": {
      "role": "consultant",
      "databaseId": "uuid-database-id"
    }
  }
}
```

**Response:**

```json
{
  "received": true,
  "processed": true,
  "userId": "uuid-database-id",
  "action": "user_created"
}
```

**Access:** Webhook signature validation

## Response Schemas

### User Object

```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "developer|org_admin|manager|consultant|viewer",
  "isStaff": "boolean",
  "isActive": "boolean",
  "managerId": "uuid|null",
  "clerkUserId": "string|null",
  "createdAt": "ISO 8601 datetime",
  "updatedAt": "ISO 8601 datetime",
  "lastLoginAt": "ISO 8601 datetime|null"
}
```

### Payroll Object

```json
{
  "id": "uuid",
  "name": "string",
  "clientId": "uuid",
  "cycle": "weekly|fortnightly|bi_monthly|monthly|quarterly",
  "dateType": "fixed_day|eom|som|week_a|week_b",
  "dateValue": "integer|null",
  "status": "Active|Implementation|Inactive",
  "primaryConsultantId": "uuid|null",
  "backupConsultantId": "uuid|null",
  "managerId": "uuid|null",
  "processingDaysBeforeEft": "integer",
  "payrollSystem": "string|null",
  "processingTime": "integer",
  "employeeCount": "integer|null",
  "version": "integer",
  "parentPayrollId": "uuid|null",
  "goLiveDate": "ISO 8601 date|null",
  "supersededDate": "ISO 8601 date|null",
  "versionReason": "string|null",
  "createdAt": "ISO 8601 datetime",
  "updatedAt": "ISO 8601 datetime",
  "createdBy": "uuid"
}
```

### Audit Log Object

```json
{
  "id": "uuid",
  "eventTime": "ISO 8601 datetime",
  "userId": "uuid|null",
  "userEmail": "string|null",
  "userRole": "string|null",
  "action": "string",
  "resourceType": "string",
  "resourceId": "string|null",
  "oldValues": "object|null",
  "newValues": "object|null",
  "ipAddress": "string|null",
  "userAgent": "string|null",
  "sessionId": "string|null",
  "requestId": "string|null",
  "success": "boolean",
  "errorMessage": "string|null",
  "metadata": "object|null"
}
```

## SDKs and Code Examples

### JavaScript/TypeScript Client

```typescript
class PayrollMatrixAPI {
  private baseUrl: string;
  private getAuthToken: () => Promise<string>;

  constructor(baseUrl: string, getAuthToken: () => Promise<string>) {
    this.baseUrl = baseUrl;
    this.getAuthToken = getAuthToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // User methods
  async getUsers(params?: GetUsersParams) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<GetUsersResponse>(`/users?${query}`);
  }

  async createUser(userData: CreateUserRequest) {
    return this.request<CreateUserResponse>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Payroll methods
  async getPayrolls(params?: GetPayrollsParams) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<GetPayrollsResponse>(`/payrolls?${query}`);
  }

  async createPayroll(payrollData: CreatePayrollRequest) {
    return this.request<CreatePayrollResponse>("/payrolls", {
      method: "POST",
      body: JSON.stringify(payrollData),
    });
  }
}

// Usage with Clerk
const api = new PayrollMatrixAPI(
  "https://payroll-matrix.vercel.app/api",
  async () => {
    const token = await window.Clerk.session?.getToken({ template: "hasura" });
    if (!token) throw new Error("No authentication token");
    return token;
  }
);
```

### React Hook

```typescript
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export function usePayrollMatrixAPI() {
  const { getToken } = useAuth();

  const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const token = await getToken({ template: "hasura" });

    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }

    return response.json();
  };

  return { apiRequest };
}

// Usage in component
function PayrollList() {
  const { apiRequest } = usePayrollMatrixAPI();
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const data = await apiRequest<GetPayrollsResponse>("/payrolls");
        setPayrolls(data.payrolls);
      } catch (error) {
        console.error("Failed to fetch payrolls:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrolls();
  }, [apiRequest]);

  // Component JSX...
}
```

This comprehensive API documentation covers all endpoints in the Payroll Matrix system with detailed request/response schemas, authentication requirements, access controls, and practical code examples for integration.
