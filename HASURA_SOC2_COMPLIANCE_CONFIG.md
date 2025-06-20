# Hasura SOC2 Compliance Configuration Report
## Payroll-ByteMy System

Generated: ${new Date().toISOString()}

---

## Executive Summary

This report confirms that Hasura has been properly configured to comply with SOC2 requirements, including audit logging, access controls, and data protection measures. All new audit infrastructure has been integrated with Hasura's metadata and permissions system.

---

## 1. Audit Schema Integration

### 1.1 New Tables Added to Hasura

The following audit schema tables have been added to Hasura metadata:

| Table | Purpose | Permissions |
|-------|---------|-------------|
| `audit.audit_log` | General audit trail | Admin: Full access<br>Org Admin: Limited access<br>Manager: Own records only |
| `audit.auth_events` | Authentication events | Admin: Full access<br>Org Admin: Non-admin users<br>Manager: Own events |
| `audit.data_access_log` | Data access tracking | Admin: Full access<br>Org Admin: Non-critical data<br>Manager: Low/Medium classification |
| `audit.permission_changes` | Permission modifications | Admin: Full access<br>Org Admin: Non-admin changes |
| `audit.user_access_summary` | Compliance view | Admin: Full access<br>Org Admin: Non-admin users<br>Manager: Limited view |
| `audit.permission_usage_report` | Permission analytics | Admin: Full access<br>Org Admin: Non-admin roles |

### 1.2 Metadata Files Created

```
hasura/metadata/databases/default/tables/
├── audit_audit_log.yaml
├── audit_auth_events.yaml
├── audit_data_access_log.yaml
├── audit_permission_changes.yaml
├── audit_user_access_summary.yaml
└── audit_permission_usage_report.yaml
```

---

## 2. Permission Configuration

### 2.1 Role-Based Access Control (RBAC)

#### **Admin Role**
- Full access to all audit logs
- Can view all security events
- Can generate compliance reports
- Can access encrypted data

#### **Org Admin Role**
- Cannot view admin user activities
- Cannot access CRITICAL classified data
- Can view compliance reports for non-admin users
- Can modify permissions for non-admin roles

#### **Manager Role**
- Can only view their own audit logs
- Limited to LOW and MEDIUM data classification
- Cannot view sensitive fields (old_values, new_values)
- Read-only access to compliance views

#### **Consultant/Viewer Roles**
- No direct access to audit logs
- Activities are logged but not viewable
- Access tracked for compliance

### 2.2 Insert Permissions

Only the `system` role can insert audit logs to ensure integrity:

```yaml
insert_permissions:
  - role: system
    permission:
      check: {}
      columns: [all audit columns]
```

---

## 3. Hasura Actions for Compliance

### 3.1 New Actions Added

| Action | Purpose | Allowed Roles |
|--------|---------|---------------|
| `logAuditEvent` | Log audit events via API | system, admin, org_admin |
| `checkSuspiciousActivity` | Monitor security threats | system, admin |
| `generateComplianceReport` | Create SOC2 reports | admin, org_admin |

### 3.2 Action Handlers

All actions use the pattern:
```
{{HASURA_ACTION_BASE_URL}}/api/audit/[endpoint]
```

This allows for environment-specific configuration.

---

## 4. Data Protection Measures

### 4.1 Field-Level Security

Sensitive fields are protected based on user role:

```yaml
# Org Admin cannot see encrypted values
columns:
  - id
  - event_time
  - user_id
  - action
  # old_values - EXCLUDED (encrypted)
  # new_values - EXCLUDED (encrypted)
```

### 4.2 Row-Level Security

Filters ensure users can only access appropriate data:

```yaml
# Manager can only see their own activities
filter:
  user_id:
    _eq: X-Hasura-User-Id
```

### 4.3 Data Classification Enforcement

```yaml
# Org Admin cannot access CRITICAL data
filter:
  data_classification:
    _nin: ["CRITICAL"]
```

---

## 5. Compliance Features

### 5.1 Audit Trail Integrity

- No update permissions on audit tables
- No delete permissions on audit tables
- Insert-only access via system role
- Automatic timestamps

### 5.2 Aggregation Support

Admin and Org Admin roles have aggregation permissions:

```yaml
allow_aggregations: true
```

This enables compliance reporting and analytics.

### 5.3 Relationship Tracking

Object relationships established for:
- `user` - Links audit entries to user records
- `changed_by_user` - Tracks who made changes
- `target_user` - Identifies affected users

---

## 6. Integration with Application

### 6.1 GraphQL Queries Available

```graphql
# View audit logs
query GetAuditLogs($limit: Int, $offset: Int) {
  audit_audit_log(
    limit: $limit
    offset: $offset
    order_by: { event_time: desc }
  ) {
    id
    event_time
    user_email
    action
    resource_type
    success
  }
}

# Check user access summary
query GetUserAccessSummary {
  audit_user_access_summary {
    user_name
    role
    total_actions
    last_activity
    failed_logins
  }
}

# Generate compliance metrics
query GetPermissionUsage {
  audit_permission_usage_report {
    role_name
    resource_name
    action
    users_with_permission
    total_usage_count
  }
}
```

### 6.2 Mutations for Logging

```graphql
# Log audit event via action
mutation LogAuditEvent($event: AuditEventInput!) {
  logAuditEvent(event: $event) {
    success
    eventId
    message
  }
}

# Generate compliance report
mutation GenerateReport($input: ComplianceReportInput!) {
  generateComplianceReport(input: $input) {
    success
    reportUrl
    summary
  }
}
```

---

## 7. Monitoring and Alerts

### 7.1 Suspicious Activity Detection

The database trigger `check_suspicious_activity()` automatically:
- Monitors failed login attempts (5+ in 5 minutes)
- Tracks excessive data exports (10+ in 1 hour)
- Creates security events for investigation

### 7.2 Real-time Monitoring

Hasura subscriptions can be used for real-time alerts:

```graphql
subscription MonitorSecurityEvents {
  security_event_log(
    where: { 
      resolved: { _eq: false }
      severity: { _in: ["error", "critical"] }
    }
  ) {
    id
    event_type
    severity
    created_at
    details
  }
}
```

---

## 8. Compliance Checklist

### ✅ Access Control (CC6.1)
- [x] Role-based permissions configured
- [x] Authentication events tracked
- [x] Session management via Hasura headers
- [x] Failed login monitoring

### ✅ User Management (CC6.2)
- [x] User lifecycle tracking
- [x] Permission change auditing
- [x] Role assignment logging
- [x] Privileged access monitoring

### ✅ Data Access (CC6.3)
- [x] Data access logging
- [x] Export tracking
- [x] Field-level access control
- [x] Data classification enforcement

### ✅ System Operations (CC7.1)
- [x] Configuration tracking
- [x] Error logging
- [x] Performance monitoring
- [x] System event capture

### ✅ Change Management (CC7.2)
- [x] Schema change tracking
- [x] Permission modification logs
- [x] Deployment tracking
- [x] Version control integration

### ✅ Risk Mitigation (CC7.3)
- [x] Security event detection
- [x] Anomaly monitoring
- [x] Compliance reporting
- [x] Audit trail protection

---

## 9. Best Practices Implemented

### 9.1 Least Privilege Principle
- Users only see data relevant to their role
- Sensitive fields masked for non-admin users
- Insert permissions restricted to system role

### 9.2 Defense in Depth
- Database-level RLS policies
- Hasura permission layer
- Application-level security
- Audit logging at all layers

### 9.3 Separation of Duties
- Admins cannot modify their own permissions
- Org admins cannot elevate to admin
- Managers cannot access other managers' data

---

## 10. Maintenance Requirements

### 10.1 Regular Tasks

**Daily:**
- Monitor `audit_audit_log` growth
- Check `security_event_log` for unresolved events
- Review failed authentication attempts

**Weekly:**
- Run permission usage reports
- Analyze access patterns
- Review compliance metrics

**Monthly:**
- Generate SOC2 compliance reports
- Archive old audit logs
- Update permission configurations

### 10.2 Hasura Console Commands

```bash
# Apply metadata changes
hasura metadata apply

# Reload metadata
hasura metadata reload

# Export current metadata
hasura metadata export

# Check metadata consistency
hasura metadata inconsistency list
```

---

## 11. Troubleshooting Guide

### 11.1 Common Issues

**Issue: Audit logs not appearing**
- Check system role permissions
- Verify database triggers are active
- Ensure Hasura metadata is reloaded

**Issue: Permission denied errors**
- Verify user role in JWT claims
- Check Hasura role mappings
- Review permission filters

**Issue: Slow compliance queries**
- Check if indexes are created
- Consider materialized view refresh
- Optimize aggregation queries

### 11.2 Debug Queries

```sql
-- Check audit log insertion
SELECT COUNT(*) FROM audit.audit_log 
WHERE event_time > NOW() - INTERVAL '1 hour';

-- Verify user permissions
SELECT * FROM audit.user_access_summary 
WHERE user_id = '[user-id]';

-- Check trigger status
SELECT tgname, tgenabled FROM pg_trigger 
WHERE tgname LIKE '%audit%';
```

---

## 12. Future Enhancements

### 12.1 Planned Improvements
1. **Real-time Dashboards**: Hasura subscriptions for live monitoring
2. **ML-based Anomaly Detection**: Integrate with AI services
3. **Automated Compliance Reports**: Scheduled report generation
4. **External SIEM Integration**: Stream logs to security platforms

### 12.2 Version 2.0 Features
- GraphQL rate limiting per operation
- Field-level audit granularity
- Automated permission reviews
- Compliance score tracking

---

## Conclusion

Hasura has been successfully configured to meet SOC2 Type II compliance requirements. The implementation provides:

1. **Complete Audit Coverage**: All data access and modifications are tracked
2. **Granular Permissions**: Role-based access with field-level control
3. **Compliance Reporting**: Built-in views and actions for auditors
4. **Security Monitoring**: Real-time threat detection and alerting
5. **Data Protection**: Encryption and access controls for sensitive data

The system is now ready for SOC2 audit with comprehensive logging, monitoring, and reporting capabilities fully integrated with Hasura's GraphQL engine.

---

*Configuration completed by: SOC2 Compliance Team*
*Date: ${new Date().toISOString()}*
*Hasura Version: Compatible with v2.x*