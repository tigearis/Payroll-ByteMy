# Additional Enums for Hasura Metadata

Based on the TypeScript type consolidation analysis, the following enums should be added to `/hasura/metadata/custom_types.yaml`:

## 1. EntityType
Used for categorizing notes and other polymorphic relationships.

```yaml
- name: EntityType
  description: "Entity types for polymorphic relationships"
  values:
    - value: "payroll"
      description: "Payroll entity"
    - value: "client"
      description: "Client entity"
```

## 2. EventType
Used for calendar events and scheduling.

```yaml
- name: EventType
  description: "Calendar event types"
  values:
    - value: "payroll"
      description: "Payroll event"
    - value: "holiday"
      description: "Holiday event"
    - value: "leave"
      description: "Leave event"
```

## 3. AssignmentType
Used for consultant assignments.

```yaml
- name: AssignmentType
  description: "Types of consultant assignments"
  values:
    - value: "primary"
      description: "Primary consultant"
    - value: "backup"
      description: "Backup consultant"
    - value: "temporary"
      description: "Temporary coverage"
```

## 4. InvoiceStatus
Used for billing invoices.

```yaml
- name: InvoiceStatus
  description: "Billing invoice status"
  values:
    - value: "draft"
      description: "Invoice is in draft status"
    - value: "sent"
      description: "Invoice has been sent"
    - value: "paid"
      description: "Invoice has been paid"
    - value: "overdue"
      description: "Invoice is overdue"
    - value: "cancelled"
      description: "Invoice has been cancelled"
```

## 5. NotificationType
Used for in-app and push notifications.

```yaml
- name: NotificationType
  description: "Types of notifications"
  values:
    - value: "payroll_due"
      description: "Payroll is due for processing"
    - value: "leave_request"
      description: "Leave request notification"
    - value: "assignment_change"
      description: "Consultant assignment change"
    - value: "system"
      description: "System notification"
```

## 6. ExportFormat
Used for data export functionality.

```yaml
- name: ExportFormat
  description: "Supported export formats"
  values:
    - value: "csv"
      description: "CSV format"
    - value: "xlsx"
      description: "Excel format"
    - value: "pdf"
      description: "PDF format"
```

## 7. ScheduleType
Used for work schedules.

```yaml
- name: ScheduleType
  description: "Work schedule types"
  values:
    - value: "standard"
      description: "Standard work schedule"
    - value: "custom"
      description: "Custom work schedule"
```

## Notes

- The `LeaveType` enum is already defined in Hasura metadata
- The existing enums cover most use cases, but these additions would provide better type safety
- Some string literals in the current code (like "active"/"inactive" for clients) use boolean fields instead of enums, which is appropriate
- The `WebhookEventType` could be added if webhook functionality is implemented