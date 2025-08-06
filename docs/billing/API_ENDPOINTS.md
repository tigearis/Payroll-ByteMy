# Billing System API Endpoints

This document provides comprehensive information about all API endpoints in the billing system redesign.

## Core Billing Generation

### Tier 1 Billing Generation
**Endpoint**: `POST /api/billing/tier1/generate`
**Purpose**: Generate billing items based on payroll completion metrics
**Status**: ✅ Operational

#### Request Body
```json
{
  "payrollDateId": "uuid",
  "completionMetrics": {
    "payslipsProcessed": 150,
    "employeesProcessed": 150,
    "newStarters": 5,
    "terminations": 2,
    "leaveCalculations": 12,
    "bonusPayments": 8,
    "taxAdjustments": 3,
    "superContributions": 147,
    "workersCompClaims": 1,
    "complexityFactors": {
      "multiplePayCycles": true,
      "unionCompliance": false,
      "internationalPayroll": false
    }
  }
}
```

#### Response
```json
{
  "success": true,
  "itemsGenerated": 5,
  "totalAmount": 2850.00,
  "items": [
    {
      "serviceCode": "PAYROLL_BASE",
      "amount": 1200.00,
      "quantity": 1,
      "description": "Base payroll processing"
    }
  ]
}
```

### Recurring Services Billing
**Endpoint**: `POST /api/billing/recurring/generate`
**Purpose**: Generate recurring monthly service billing
**Status**: ✅ Operational

#### Request Body
```json
{
  "clientIds": ["uuid1", "uuid2"],
  "billingMonth": "2025-08-01",
  "dryRun": false
}
```

#### Response
```json
{
  "success": true,
  "itemsCreated": 8,
  "totalAmount": 4200.00,
  "clientsProcessed": 2,
  "items": [
    {
      "clientId": "uuid",
      "clientName": "Client Name",
      "serviceCode": "MONTHLY_COMPLIANCE",
      "serviceName": "Monthly Compliance Review", 
      "amount": 350.00,
      "prorated": false
    }
  ]
}
```

### Invoice Generation
**Endpoint**: `POST /api/billing/invoices/generate`
**Purpose**: Generate invoices from approved billing items
**Status**: ✅ Operational

#### Request Body
```json
{
  "billingItemIds": ["uuid1", "uuid2", "uuid3"],
  "invoiceData": {
    "clientId": "uuid",
    "billingPeriodStart": "2025-08-01",
    "billingPeriodEnd": "2025-08-31",
    "dueDate": "2025-09-15",
    "taxRate": 10.0,
    "notes": "Monthly services invoice"
  }
}
```

#### Response
```json
{
  "success": true,
  "invoice": {
    "id": "uuid",
    "invoiceNumber": "INV-2025-08-001",
    "subtotal": 2400.00,
    "taxAmount": 240.00,
    "totalAmount": 2640.00,
    "status": "draft"
  }
}
```

## Completion Metrics

### Payroll Completion Metrics
**Endpoint**: `POST /api/billing/tier1/completion-metrics`
**Purpose**: Record payroll completion metrics for billing generation
**Status**: ✅ Operational

#### Request Body
```json
{
  "payrollDateId": "uuid",
  "metrics": {
    "payslipsProcessed": 150,
    "employeesProcessed": 150,
    "processingTimeHours": 4.5,
    "complexityScore": 7.2,
    "generationNotes": "Standard processing, no issues"
  }
}
```

## Time-Based Billing

### Generate Billing from Time Entries
**Endpoint**: `POST /api/billing/generate-from-time`
**Purpose**: Generate billing items from recorded time entries
**Status**: ✅ Operational

#### Request Body
```json
{
  "timeEntryIds": ["uuid1", "uuid2"],
  "billingDate": "2025-08-06",
  "approvedBy": "user-uuid"
}
```

#### Response
```json
{
  "success": true,
  "itemsGenerated": 2,
  "totalAmount": 450.00,
  "items": [
    {
      "timeEntryId": "uuid",
      "hoursSpent": 3.0,
      "hourlyRate": 150.00,
      "amount": 450.00,
      "serviceAssigned": "CONSULTATION"
    }
  ]
}
```

## Billing Item Management

### Batch Operations
**Endpoint**: `POST /api/billing/items/batch`
**Purpose**: Perform batch operations on billing items
**Status**: ✅ Operational

#### Request Body
```json
{
  "operation": "approve|reject|delete",
  "billingItemIds": ["uuid1", "uuid2", "uuid3"],
  "approvedBy": "user-uuid",
  "notes": "Batch approval for monthly items"
}
```

### Individual Item Approval
**Endpoint**: `POST /api/billing/items/[id]/approve`
**Purpose**: Approve individual billing item
**Status**: ✅ Operational

### Individual Item Status Update
**Endpoint**: `PATCH /api/billing/items/[id]/status`
**Purpose**: Update billing item status
**Status**: ✅ Operational

#### Request Body
```json
{
  "status": "approved|rejected|pending",
  "notes": "Approval notes",
  "approvedBy": "user-uuid"
}
```

## Automatic Processing

### Process Automatic Billing
**Endpoint**: `POST /api/billing/process-automatic`
**Purpose**: Process automatic billing rules and recurring items
**Status**: ✅ Operational

#### Request Body
```json
{
  "billingDate": "2025-08-01",
  "clientIds": ["uuid1", "uuid2"], // Optional: specific clients
  "dryRun": false
}
```

## Reports and Analytics

### Billing Analytics
**Endpoint**: `GET /api/billing/reports/analytics`
**Purpose**: Get billing analytics and metrics
**Status**: ✅ Operational

#### Query Parameters
- `startDate`: Start date for report (YYYY-MM-DD)
- `endDate`: End date for report (YYYY-MM-DD)
- `clientId`: Optional client filter
- `serviceCategory`: Optional service category filter

#### Response
```json
{
  "totalRevenue": 125000.00,
  "totalItems": 342,
  "averageItemValue": 365.50,
  "topServices": [
    {
      "serviceCode": "PAYROLL_BASE",
      "revenue": 45000.00,
      "items": 150
    }
  ],
  "clientBreakdown": [
    {
      "clientId": "uuid",
      "clientName": "Client Name",
      "revenue": 12500.00,
      "items": 25
    }
  ]
}
```

## Tier-Specific Endpoints

### Tier 2 Generation
**Endpoint**: `POST /api/billing/tier2/generate`
**Purpose**: Generate Tier 2 (mid-complexity) billing items
**Status**: ✅ Operational

### Tier 3 Generation  
**Endpoint**: `POST /api/billing/tier3/generate`
**Purpose**: Generate Tier 3 (high-complexity) billing items
**Status**: ✅ Operational

## Authentication & Authorization

All endpoints require:
- Valid JWT token in Authorization header
- Appropriate role permissions (consultant, manager, org_admin)
- Hasura permission validation

### Required Headers
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Role Requirements

| Endpoint | Consultant | Manager | Org Admin |
|----------|------------|---------|-----------|
| `/tier1/generate` | ❌ | ✅ | ✅ |
| `/recurring/generate` | ❌ | ✅ | ✅ |
| `/invoices/generate` | ❌ | ✅ | ✅ |
| `/items/approve` | ❌ | ✅ | ✅ |
| `/items/batch` | ❌ | ✅ | ✅ |
| `/generate-from-time` | ✅* | ✅ | ✅ |
| `/reports/analytics` | ✅* | ✅ | ✅ |

*\*Consultant access limited to assigned payrolls/clients*

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error"
  }
}
```

### Common Error Codes
- `UNAUTHORIZED`: Invalid or missing authentication
- `FORBIDDEN`: Insufficient permissions
- `VALIDATION_ERROR`: Invalid request data
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Business rule violation
- `INTERNAL_ERROR`: Server error

## Rate Limiting

All endpoints are subject to rate limiting:
- **Standard endpoints**: 100 requests/minute per user
- **Bulk operations**: 20 requests/minute per user
- **Report endpoints**: 50 requests/minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1693123200
```