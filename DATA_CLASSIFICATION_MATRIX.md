# Data Classification Matrix - Payroll ByteMy

## Overview
This document classifies all data fields in the Payroll ByteMy system according to SOC 2 compliance requirements and sensitivity levels.

## Classification Levels

### 🔴 CRITICAL (Level 4)
**Definition**: Data that if exposed could cause severe financial, legal, or reputational damage.
**Handling**: Requires encryption at rest and in transit, strict access controls, and full audit logging.

### 🟠 HIGH (Level 3)
**Definition**: Personally Identifiable Information (PII) and sensitive business data.
**Handling**: Requires encryption, role-based access, and audit logging for modifications.

### 🟡 MEDIUM (Level 2)
**Definition**: Internal business data and non-sensitive personal information.
**Handling**: Requires role-based access and basic audit logging.

### 🟢 LOW (Level 1)
**Definition**: Public or non-sensitive configuration data.
**Handling**: Standard access controls, no special encryption requirements.

## Table Classifications

### `users` Table
| Field | Classification | Justification | Access Control |
|-------|---------------|---------------|----------------|
| id | MEDIUM | Internal identifier | All authenticated users |
| name | HIGH | PII - Full name | Role-based |
| email | HIGH | PII - Contact information | Role-based |
| role | MEDIUM | Access control data | Managers and above |
| clerk_user_id | HIGH | Authentication identifier | Admin only |
| image | LOW | Profile picture URL | All authenticated users |
| is_staff | MEDIUM | Employment status | Managers and above |
| manager_id | MEDIUM | Organizational structure | Team members and above |

### `payrolls` Table
| Field | Classification | Justification | Access Control |
|-------|---------------|---------------|----------------|
| id | MEDIUM | Internal identifier | Assigned users |
| name | MEDIUM | Payroll identifier | Assigned users |
| client_id | MEDIUM | Business relationship | Assigned users |
| cycle_id | MEDIUM | Processing configuration | Assigned users |
| date_type_id | MEDIUM | Processing configuration | Assigned users |
| date_value | MEDIUM | Processing configuration | Assigned users |
| primary_consultant_user_id | MEDIUM | Assignment data | Team members |
| backup_consultant_user_id | MEDIUM | Assignment data | Team members |
| manager_user_id | MEDIUM | Management structure | Team members |
| processing_days_before_eft | MEDIUM | Processing timeline | Assigned users |
| status | MEDIUM | Operational status | Assigned users |
| payroll_system | MEDIUM | System configuration | Assigned users |
| processing_time | MEDIUM | Operational metric | Assigned users |
| employee_count | HIGH | Sensitive business metric | Managers and above |

### `payroll_dates` Table
| Field | Classification | Justification | Access Control |
|-------|---------------|---------------|----------------|
| id | LOW | Internal identifier | Assigned users |
| payroll_id | MEDIUM | Relationship data | Assigned users |
| original_eft_date | HIGH | Financial transaction date | Assigned users only |
| adjusted_eft_date | HIGH | Financial transaction date | Assigned users only |
| processing_date | HIGH | Financial processing date | Assigned users only |
| notes | MEDIUM | Operational notes | Assigned users |

### `clients` Table
| Field | Classification | Justification | Access Control |
|-------|---------------|---------------|----------------|
| id | LOW | Internal identifier | All authenticated users |
| name | MEDIUM | Business name | All authenticated users |
| contact_person | HIGH | PII - Contact name | Assigned users only |
| contact_email | HIGH | PII - Contact email | Assigned users only |
| contact_phone | HIGH | PII - Contact phone | Assigned users only |
| active | LOW | Status flag | All authenticated users |

### `holidays` Table
| Field | Classification | Justification | Access Control |
|-------|---------------|---------------|----------------|
| All fields | LOW | Public holiday data | All users |

### `leave` Table
| Field | Classification | Justification | Access Control |
|-------|---------------|---------------|----------------|
| id | LOW | Internal identifier | User and managers |
| user_id | MEDIUM | Employee identifier | User and managers |
| start_date | MEDIUM | Leave period | User and managers |
| end_date | MEDIUM | Leave period | User and managers |
| leave_type | MEDIUM | Leave category | User and managers |
| status | MEDIUM | Approval status | User and managers |
| reason | HIGH | PII - Medical/personal info | User and managers only |

### `work_schedule` Table
| Field | Classification | Justification | Access Control |
|-------|---------------|---------------|----------------|
| id | LOW | Internal identifier | User and managers |
| user_id | MEDIUM | Employee identifier | User and managers |
| work_day | LOW | Day of week | User and managers |
| work_hours | MEDIUM | Hours worked | User and managers |

### `notes` Table
| Field | Classification | Justification | Access Control |
|-------|---------------|---------------|----------------|
| id | LOW | Internal identifier | Note creator and entity owners |
| entity_type | LOW | Note category | Note creator and entity owners |
| entity_id | MEDIUM | Related entity | Note creator and entity owners |
| user_id | MEDIUM | Note author | Note creator and entity owners |
| content | HIGH | Potentially sensitive content | Note creator and entity owners |
| is_important | LOW | Flag | Note creator and entity owners |

## Future Tables (Planned)

### `payroll_assignments` Table (CRITICAL)
| Field | Classification | Justification | Access Control |
|-------|---------------|---------------|----------------|
| employee_id | CRITICAL | Employee identifier | Admin only |
| ssn_encrypted | CRITICAL | Social Security Number | Admin only (encrypted) |
| bank_account_encrypted | CRITICAL | Banking information | Admin only (encrypted) |
| salary_amount | CRITICAL | Compensation data | Admin only |
| tax_withholdings | CRITICAL | Tax information | Admin only |

## Security Implementation Requirements

### For CRITICAL Data:
1. AES-256 encryption at rest
2. TLS 1.3 in transit
3. Field-level encryption in database
4. Audit every access attempt
5. Require MFA for access
6. Data retention: 7 years
7. Automated PII detection and masking

### For HIGH Data:
1. Database-level encryption
2. TLS 1.2+ in transit
3. Audit all modifications
4. Role-based access control
5. Data retention: 5 years
6. Regular access reviews

### For MEDIUM Data:
1. Standard database security
2. HTTPS transport
3. Basic audit logging
4. Team-based access control
5. Data retention: 3 years

### For LOW Data:
1. Standard security controls
2. HTTPS transport
3. Basic access logging
4. Data retention: 1 year

## Compliance Notes

1. All CRITICAL and HIGH classified data must be included in data processing agreements
2. Access to CRITICAL data requires documented business justification
3. Quarterly access reviews required for all HIGH and CRITICAL data access
4. Annual security training required for all users with access to HIGH or CRITICAL data
5. Incident response plan must prioritize CRITICAL and HIGH data breaches