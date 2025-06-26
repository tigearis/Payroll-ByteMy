/**
 * THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY
 * 
 * SOC2 Compliant GraphQL Operations
 * Security Classifications Applied:
 * - CRITICAL: Auth, user roles, financial data - Requires admin access + MFA
 * - HIGH: PII, client data, employee info - Requires role-based access
 * - MEDIUM: Internal business data - Requires authentication
 * - LOW: Public/aggregate data - Basic access control
 * 
 * Compliance Features:
 * ✓ Role-based access control (RBAC)
 * ✓ Audit logging integration
 * ✓ Data classification enforcement
 * ✓ Permission boundary validation
 * ✓ Automatic domain isolation and exports
 * 
 * Generated: 2025-06-26T08:26:40.458Z
 * Schema Version: Latest from Hasura
 * CodeGen Version: Unified v3.0
 */

/* DOMAIN: AUDIT | SECURITY: CRITICAL | ACCESS: Admin + MFA + Full Audit */

import type { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Scalar _Any */
  _Any: { input: any; output: any; }
  bigint: { input: number; output: number; }
  bpchar: { input: string; output: string; }
  date: { input: string; output: string; }
  inet: { input: string; output: string; }
  interval: { input: string; output: string; }
  json: { input: any; output: any; }
  jsonb: { input: any; output: any; }
  leave_status_enum: { input: string; output: string; }
  name: { input: string; output: string; }
  numeric: { input: number; output: number; }
  payroll_cycle_type: { input: string; output: string; }
  payroll_date_type: { input: string; output: string; }
  payroll_status: { input: string; output: string; }
  permission_action: { input: string; output: string; }
  timestamp: { input: string; output: string; }
  timestamptz: { input: string; output: string; }
  user_role: { input: string; output: string; }
  uuid: { input: string; output: string; }
};

export type AffectedAssignment = {
  __typename?: 'AffectedAssignment';
  adjustedEftDate: Scalars['String']['output'];
  id: Scalars['String']['output'];
  newConsultantId: Scalars['String']['output'];
  originalConsultantId: Scalars['String']['output'];
  payrollDateId: Scalars['String']['output'];
};

export type AuditEventInput = {
  action: Scalars['String']['input'];
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['json']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  resourceType: Scalars['String']['input'];
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};

export type AuditEventResponse = {
  __typename?: 'AuditEventResponse';
  eventId?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type BigintComparisonExp = {
  _eq?: InputMaybe<Scalars['bigint']['input']>;
  _gt?: InputMaybe<Scalars['bigint']['input']>;
  _gte?: InputMaybe<Scalars['bigint']['input']>;
  _in?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['bigint']['input']>;
  _lte?: InputMaybe<Scalars['bigint']['input']>;
  _neq?: InputMaybe<Scalars['bigint']['input']>;
  _nin?: InputMaybe<Array<Scalars['bigint']['input']>>;
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type BooleanComparisonExp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression to compare columns of type "bpchar". All fields are combined with logical 'AND'. */
export type BpcharComparisonExp = {
  _eq?: InputMaybe<Scalars['bpchar']['input']>;
  _gt?: InputMaybe<Scalars['bpchar']['input']>;
  _gte?: InputMaybe<Scalars['bpchar']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['bpchar']['input']>;
  _in?: InputMaybe<Array<Scalars['bpchar']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['bpchar']['input']>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['bpchar']['input']>;
  _lt?: InputMaybe<Scalars['bpchar']['input']>;
  _lte?: InputMaybe<Scalars['bpchar']['input']>;
  _neq?: InputMaybe<Scalars['bpchar']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['bpchar']['input']>;
  _nin?: InputMaybe<Array<Scalars['bpchar']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['bpchar']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['bpchar']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['bpchar']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['bpchar']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['bpchar']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['bpchar']['input']>;
};

export type CommitPayrollAssignmentsOutput = {
  __typename?: 'CommitPayrollAssignmentsOutput';
  affectedAssignments?: Maybe<Array<AffectedAssignment>>;
  errors?: Maybe<Array<Scalars['String']['output']>>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ComplianceReportInput = {
  endDate: Scalars['String']['input'];
  includeDetails?: InputMaybe<Scalars['Boolean']['input']>;
  reportType: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export type ComplianceReportResponse = {
  __typename?: 'ComplianceReportResponse';
  generatedAt: Scalars['String']['output'];
  reportUrl?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  summary?: Maybe<Scalars['json']['output']>;
};

/** ordering argument of a cursor */
export enum CursorOrdering {
  /** ascending ordering of the cursor */
  ASC = 'ASC',
  /** descending ordering of the cursor */
  DESC = 'DESC'
}

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type DateComparisonExp = {
  _eq?: InputMaybe<Scalars['date']['input']>;
  _gt?: InputMaybe<Scalars['date']['input']>;
  _gte?: InputMaybe<Scalars['date']['input']>;
  _in?: InputMaybe<Array<Scalars['date']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['date']['input']>;
  _lte?: InputMaybe<Scalars['date']['input']>;
  _neq?: InputMaybe<Scalars['date']['input']>;
  _nin?: InputMaybe<Array<Scalars['date']['input']>>;
};

/** Boolean expression to compare columns of type "inet". All fields are combined with logical 'AND'. */
export type InetComparisonExp = {
  _eq?: InputMaybe<Scalars['inet']['input']>;
  _gt?: InputMaybe<Scalars['inet']['input']>;
  _gte?: InputMaybe<Scalars['inet']['input']>;
  _in?: InputMaybe<Array<Scalars['inet']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['inet']['input']>;
  _lte?: InputMaybe<Scalars['inet']['input']>;
  _neq?: InputMaybe<Scalars['inet']['input']>;
  _nin?: InputMaybe<Array<Scalars['inet']['input']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type IntComparisonExp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "interval". All fields are combined with logical 'AND'. */
export type IntervalComparisonExp = {
  _eq?: InputMaybe<Scalars['interval']['input']>;
  _gt?: InputMaybe<Scalars['interval']['input']>;
  _gte?: InputMaybe<Scalars['interval']['input']>;
  _in?: InputMaybe<Array<Scalars['interval']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['interval']['input']>;
  _lte?: InputMaybe<Scalars['interval']['input']>;
  _neq?: InputMaybe<Scalars['interval']['input']>;
  _nin?: InputMaybe<Array<Scalars['interval']['input']>>;
};

export type JsonbCastExp = {
  String?: InputMaybe<StringComparisonExp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type JsonbComparisonExp = {
  _cast?: InputMaybe<JsonbCastExp>;
  /** is the column contained in the given json value */
  _containedIn?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _hasKey?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _hasKeysAll?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _hasKeysAny?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** Boolean expression to compare columns of type "leave_status_enum". All fields are combined with logical 'AND'. */
export type LeaveStatusEnumComparisonExp = {
  _eq?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _gt?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _gte?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _in?: InputMaybe<Array<Scalars['leave_status_enum']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _lte?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _neq?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _nin?: InputMaybe<Array<Scalars['leave_status_enum']['input']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  checkSuspiciousActivity?: Maybe<SuspiciousActivityResponse>;
  commitPayrollAssignments?: Maybe<CommitPayrollAssignmentsOutput>;
  generateComplianceReport?: Maybe<ComplianceReportResponse>;
  logAuditEvent?: Maybe<AuditEventResponse>;
};


export type MutationCheckSuspiciousActivityArgs = {
  timeWindow?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCommitPayrollAssignmentsArgs = {
  changes: Array<PayrollAssignmentInput>;
};


export type MutationGenerateComplianceReportArgs = {
  input: ComplianceReportInput;
};


export type MutationLogAuditEventArgs = {
  event: AuditEventInput;
};

/** Boolean expression to compare columns of type "name". All fields are combined with logical 'AND'. */
export type NameComparisonExp = {
  _eq?: InputMaybe<Scalars['name']['input']>;
  _gt?: InputMaybe<Scalars['name']['input']>;
  _gte?: InputMaybe<Scalars['name']['input']>;
  _in?: InputMaybe<Array<Scalars['name']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['name']['input']>;
  _lte?: InputMaybe<Scalars['name']['input']>;
  _neq?: InputMaybe<Scalars['name']['input']>;
  _nin?: InputMaybe<Array<Scalars['name']['input']>>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type NumericComparisonExp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>;
  _gt?: InputMaybe<Scalars['numeric']['input']>;
  _gte?: InputMaybe<Scalars['numeric']['input']>;
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
};

/** column ordering options */
export enum OrderBy {
  /** in ascending order, nulls last */
  ASC = 'ASC',
  /** in ascending order, nulls first */
  ASC_NULLS_FIRST = 'ASC_NULLS_FIRST',
  /** in ascending order, nulls last */
  ASC_NULLS_LAST = 'ASC_NULLS_LAST',
  /** in descending order, nulls first */
  DESC = 'DESC',
  /** in descending order, nulls first */
  DESC_NULLS_FIRST = 'DESC_NULLS_FIRST',
  /** in descending order, nulls last */
  DESC_NULLS_LAST = 'DESC_NULLS_LAST'
}

export type PayrollAssignmentInput = {
  date: Scalars['String']['input'];
  fromConsultantId: Scalars['String']['input'];
  payrollId: Scalars['String']['input'];
  toConsultantId: Scalars['String']['input'];
};

/** Boolean expression to compare columns of type "payroll_cycle_type". All fields are combined with logical 'AND'. */
export type PayrollCycleTypeComparisonExp = {
  _eq?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _gt?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _gte?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _in?: InputMaybe<Array<Scalars['payroll_cycle_type']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _lte?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _neq?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _nin?: InputMaybe<Array<Scalars['payroll_cycle_type']['input']>>;
};

/** Boolean expression to compare columns of type "payroll_date_type". All fields are combined with logical 'AND'. */
export type PayrollDateTypeComparisonExp = {
  _eq?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _gt?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _gte?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _in?: InputMaybe<Array<Scalars['payroll_date_type']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _lte?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _neq?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _nin?: InputMaybe<Array<Scalars['payroll_date_type']['input']>>;
};

/** Boolean expression to compare columns of type "payroll_status". All fields are combined with logical 'AND'. */
export type PayrollStatusComparisonExp = {
  _eq?: InputMaybe<Scalars['payroll_status']['input']>;
  _gt?: InputMaybe<Scalars['payroll_status']['input']>;
  _gte?: InputMaybe<Scalars['payroll_status']['input']>;
  _in?: InputMaybe<Array<Scalars['payroll_status']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['payroll_status']['input']>;
  _lte?: InputMaybe<Scalars['payroll_status']['input']>;
  _neq?: InputMaybe<Scalars['payroll_status']['input']>;
  _nin?: InputMaybe<Array<Scalars['payroll_status']['input']>>;
};

/** Boolean expression to compare columns of type "permission_action". All fields are combined with logical 'AND'. */
export type PermissionActionComparisonExp = {
  _eq?: InputMaybe<Scalars['permission_action']['input']>;
  _gt?: InputMaybe<Scalars['permission_action']['input']>;
  _gte?: InputMaybe<Scalars['permission_action']['input']>;
  _in?: InputMaybe<Array<Scalars['permission_action']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['permission_action']['input']>;
  _lte?: InputMaybe<Scalars['permission_action']['input']>;
  _neq?: InputMaybe<Scalars['permission_action']['input']>;
  _nin?: InputMaybe<Array<Scalars['permission_action']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type StringArrayComparisonExp = {
  /** is the array contained in the given array value */
  _containedIn?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the array contain the given value */
  _contains?: InputMaybe<Array<Scalars['String']['input']>>;
  _eq?: InputMaybe<Array<Scalars['String']['input']>>;
  _gt?: InputMaybe<Array<Scalars['String']['input']>>;
  _gte?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Array<Scalars['String']['input']>>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Array<Scalars['String']['input']>>;
  _lte?: InputMaybe<Array<Scalars['String']['input']>>;
  _neq?: InputMaybe<Array<Scalars['String']['input']>>;
  _nin?: InputMaybe<Array<Array<Scalars['String']['input']>>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type StringComparisonExp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

export type SuspiciousActivityResponse = {
  __typename?: 'SuspiciousActivityResponse';
  events?: Maybe<Array<SuspiciousEvent>>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  suspicious: Scalars['Boolean']['output'];
};

export type SuspiciousEvent = {
  __typename?: 'SuspiciousEvent';
  count: Scalars['Int']['output'];
  eventType: Scalars['String']['output'];
  severity: Scalars['String']['output'];
  timeframe: Scalars['String']['output'];
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type TimestampComparisonExp = {
  _eq?: InputMaybe<Scalars['timestamp']['input']>;
  _gt?: InputMaybe<Scalars['timestamp']['input']>;
  _gte?: InputMaybe<Scalars['timestamp']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamp']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamp']['input']>;
  _lte?: InputMaybe<Scalars['timestamp']['input']>;
  _neq?: InputMaybe<Scalars['timestamp']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']['input']>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type TimestamptzComparisonExp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

/** Boolean expression to compare columns of type "user_role". All fields are combined with logical 'AND'. */
export type UserRoleComparisonExp = {
  _eq?: InputMaybe<Scalars['user_role']['input']>;
  _gt?: InputMaybe<Scalars['user_role']['input']>;
  _gte?: InputMaybe<Scalars['user_role']['input']>;
  _in?: InputMaybe<Array<Scalars['user_role']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['user_role']['input']>;
  _lte?: InputMaybe<Scalars['user_role']['input']>;
  _neq?: InputMaybe<Scalars['user_role']['input']>;
  _nin?: InputMaybe<Array<Scalars['user_role']['input']>>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type UuidComparisonExp = {
  _eq?: InputMaybe<Scalars['uuid']['input']>;
  _gt?: InputMaybe<Scalars['uuid']['input']>;
  _gte?: InputMaybe<Scalars['uuid']['input']>;
  _in?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['uuid']['input']>;
  _lte?: InputMaybe<Scalars['uuid']['input']>;
  _neq?: InputMaybe<Scalars['uuid']['input']>;
  _nin?: InputMaybe<Array<Scalars['uuid']['input']>>;
};

/** A union of all types that use the @key directive */
export type Entity = AdjustmentRules | AppSettings | AuditLogs | AuthEvents | BillingEventLogs | BillingInvoice | BillingItems | BillingPlans | ClientBillingAssignments | ClientExternalSystems | Clients | DataAccessLogs | ExternalSystems | FeatureFlags | Holidays | LatestPayrollVersionResults | Leave | Notes | PayrollActivationResults | PayrollAssignmentAudits | PayrollAssignments | PayrollCycles | PayrollDateTypes | PayrollDates | PayrollVersionHistoryResults | PayrollVersionResults | Payrolls | PermissionAuditLogs | PermissionChanges | PermissionOverrides | Permissions | Resources | RolePermissions | Roles | SlowQueries | UserInvitations | UserRoles | Users | WorkSchedules;

export type Service = {
  __typename?: '_Service';
  /** SDL representation of schema */
  sdl: Scalars['String']['output'];
};

/** columns and relationships of "adjustment_rules" */
export type AdjustmentRules = {
  __typename?: 'adjustmentRules';
  /** Timestamp when the rule was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Reference to the payroll cycle this rule applies to */
  cycleId: Scalars['uuid']['output'];
  /** Reference to the payroll date type this rule affects */
  dateTypeId: Scalars['uuid']['output'];
  /** Unique identifier for the adjustment rule */
  id: Scalars['uuid']['output'];
  /** An object relationship */
  relatedPayrollCycle: PayrollCycles;
  /** An object relationship */
  relatedPayrollDateType: PayrollDateTypes;
  /** Code/formula used to calculate date adjustments */
  ruleCode: Scalars['String']['output'];
  /** Human-readable description of the adjustment rule */
  ruleDescription: Scalars['String']['output'];
  /** Timestamp when the rule was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "adjustment_rules" */
export type AdjustmentRulesAggregate = {
  __typename?: 'adjustmentRulesAggregate';
  aggregate?: Maybe<AdjustmentRulesAggregateFields>;
  nodes: Array<AdjustmentRules>;
};

export type AdjustmentRulesAggregateBoolExp = {
  count?: InputMaybe<AdjustmentRulesAggregateBoolExpCount>;
};

export type AdjustmentRulesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<AdjustmentRulesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "adjustment_rules" */
export type AdjustmentRulesAggregateFields = {
  __typename?: 'adjustmentRulesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<AdjustmentRulesMaxFields>;
  min?: Maybe<AdjustmentRulesMinFields>;
};


/** aggregate fields of "adjustment_rules" */
export type AdjustmentRulesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "adjustment_rules" */
export type AdjustmentRulesAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<AdjustmentRulesMaxOrderBy>;
  min?: InputMaybe<AdjustmentRulesMinOrderBy>;
};

/** input type for inserting array relation for remote table "adjustment_rules" */
export type AdjustmentRulesArrRelInsertInput = {
  data: Array<AdjustmentRulesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<AdjustmentRulesOnConflict>;
};

/** Boolean expression to filter rows from the table "adjustment_rules". All fields are combined with a logical 'AND'. */
export type AdjustmentRulesBoolExp = {
  _and?: InputMaybe<Array<AdjustmentRulesBoolExp>>;
  _not?: InputMaybe<AdjustmentRulesBoolExp>;
  _or?: InputMaybe<Array<AdjustmentRulesBoolExp>>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  cycleId?: InputMaybe<UuidComparisonExp>;
  dateTypeId?: InputMaybe<UuidComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  relatedPayrollCycle?: InputMaybe<PayrollCyclesBoolExp>;
  relatedPayrollDateType?: InputMaybe<PayrollDateTypesBoolExp>;
  ruleCode?: InputMaybe<StringComparisonExp>;
  ruleDescription?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "adjustment_rules" */
export enum AdjustmentRulesConstraint {
  /** unique or primary key constraint on columns "date_type_id", "cycle_id" */
  adjustment_rules_cycle_id_date_type_id_key = 'adjustment_rules_cycle_id_date_type_id_key',
  /** unique or primary key constraint on columns "id" */
  adjustment_rules_pkey = 'adjustment_rules_pkey'
}

/** input type for inserting data into table "adjustment_rules" */
export type AdjustmentRulesInsertInput = {
  /** Timestamp when the rule was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Reference to the payroll cycle this rule applies to */
  cycleId?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll date type this rule affects */
  dateTypeId?: InputMaybe<Scalars['uuid']['input']>;
  /** Unique identifier for the adjustment rule */
  id?: InputMaybe<Scalars['uuid']['input']>;
  relatedPayrollCycle?: InputMaybe<PayrollCyclesObjRelInsertInput>;
  relatedPayrollDateType?: InputMaybe<PayrollDateTypesObjRelInsertInput>;
  /** Code/formula used to calculate date adjustments */
  ruleCode?: InputMaybe<Scalars['String']['input']>;
  /** Human-readable description of the adjustment rule */
  ruleDescription?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the rule was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type AdjustmentRulesMaxFields = {
  __typename?: 'adjustmentRulesMaxFields';
  /** Timestamp when the rule was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Reference to the payroll cycle this rule applies to */
  cycleId?: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll date type this rule affects */
  dateTypeId?: Maybe<Scalars['uuid']['output']>;
  /** Unique identifier for the adjustment rule */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Code/formula used to calculate date adjustments */
  ruleCode?: Maybe<Scalars['String']['output']>;
  /** Human-readable description of the adjustment rule */
  ruleDescription?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the rule was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "adjustment_rules" */
export type AdjustmentRulesMaxOrderBy = {
  /** Timestamp when the rule was created */
  createdAt?: InputMaybe<OrderBy>;
  /** Reference to the payroll cycle this rule applies to */
  cycleId?: InputMaybe<OrderBy>;
  /** Reference to the payroll date type this rule affects */
  dateTypeId?: InputMaybe<OrderBy>;
  /** Unique identifier for the adjustment rule */
  id?: InputMaybe<OrderBy>;
  /** Code/formula used to calculate date adjustments */
  ruleCode?: InputMaybe<OrderBy>;
  /** Human-readable description of the adjustment rule */
  ruleDescription?: InputMaybe<OrderBy>;
  /** Timestamp when the rule was last updated */
  updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type AdjustmentRulesMinFields = {
  __typename?: 'adjustmentRulesMinFields';
  /** Timestamp when the rule was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Reference to the payroll cycle this rule applies to */
  cycleId?: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll date type this rule affects */
  dateTypeId?: Maybe<Scalars['uuid']['output']>;
  /** Unique identifier for the adjustment rule */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Code/formula used to calculate date adjustments */
  ruleCode?: Maybe<Scalars['String']['output']>;
  /** Human-readable description of the adjustment rule */
  ruleDescription?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the rule was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "adjustment_rules" */
export type AdjustmentRulesMinOrderBy = {
  /** Timestamp when the rule was created */
  createdAt?: InputMaybe<OrderBy>;
  /** Reference to the payroll cycle this rule applies to */
  cycleId?: InputMaybe<OrderBy>;
  /** Reference to the payroll date type this rule affects */
  dateTypeId?: InputMaybe<OrderBy>;
  /** Unique identifier for the adjustment rule */
  id?: InputMaybe<OrderBy>;
  /** Code/formula used to calculate date adjustments */
  ruleCode?: InputMaybe<OrderBy>;
  /** Human-readable description of the adjustment rule */
  ruleDescription?: InputMaybe<OrderBy>;
  /** Timestamp when the rule was last updated */
  updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "adjustment_rules" */
export type AdjustmentRulesMutationResponse = {
  __typename?: 'adjustmentRulesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AdjustmentRules>;
};

/** on_conflict condition type for table "adjustment_rules" */
export type AdjustmentRulesOnConflict = {
  constraint: AdjustmentRulesConstraint;
  updateColumns?: Array<AdjustmentRulesUpdateColumn>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};

/** Ordering options when selecting data from "adjustment_rules". */
export type AdjustmentRulesOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  cycleId?: InputMaybe<OrderBy>;
  dateTypeId?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  relatedPayrollCycle?: InputMaybe<PayrollCyclesOrderBy>;
  relatedPayrollDateType?: InputMaybe<PayrollDateTypesOrderBy>;
  ruleCode?: InputMaybe<OrderBy>;
  ruleDescription?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: adjustment_rules */
export type AdjustmentRulesPkColumnsInput = {
  /** Unique identifier for the adjustment rule */
  id: Scalars['uuid']['input'];
};

/** select columns of table "adjustment_rules" */
export enum AdjustmentRulesSelectColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  cycleId = 'cycleId',
  /** column name */
  dateTypeId = 'dateTypeId',
  /** column name */
  id = 'id',
  /** column name */
  ruleCode = 'ruleCode',
  /** column name */
  ruleDescription = 'ruleDescription',
  /** column name */
  updatedAt = 'updatedAt'
}

/** input type for updating data in table "adjustment_rules" */
export type AdjustmentRulesSetInput = {
  /** Timestamp when the rule was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Reference to the payroll cycle this rule applies to */
  cycleId?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll date type this rule affects */
  dateTypeId?: InputMaybe<Scalars['uuid']['input']>;
  /** Unique identifier for the adjustment rule */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Code/formula used to calculate date adjustments */
  ruleCode?: InputMaybe<Scalars['String']['input']>;
  /** Human-readable description of the adjustment rule */
  ruleDescription?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the rule was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "adjustmentRules" */
export type AdjustmentRulesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: AdjustmentRulesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AdjustmentRulesStreamCursorValueInput = {
  /** Timestamp when the rule was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Reference to the payroll cycle this rule applies to */
  cycleId?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll date type this rule affects */
  dateTypeId?: InputMaybe<Scalars['uuid']['input']>;
  /** Unique identifier for the adjustment rule */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Code/formula used to calculate date adjustments */
  ruleCode?: InputMaybe<Scalars['String']['input']>;
  /** Human-readable description of the adjustment rule */
  ruleDescription?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the rule was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "adjustment_rules" */
export enum AdjustmentRulesUpdateColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  cycleId = 'cycleId',
  /** column name */
  dateTypeId = 'dateTypeId',
  /** column name */
  id = 'id',
  /** column name */
  ruleCode = 'ruleCode',
  /** column name */
  ruleDescription = 'ruleDescription',
  /** column name */
  updatedAt = 'updatedAt'
}

export type AdjustmentRulesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AdjustmentRulesSetInput>;
  /** filter the rows which have to be updated */
  where: AdjustmentRulesBoolExp;
};

/** columns and relationships of "app_settings" */
export type AppSettings = {
  __typename?: 'appSettings';
  /** Unique identifier for application setting */
  id: Scalars['String']['output'];
  /** JSON structure containing application permission configurations */
  permissions?: Maybe<Scalars['jsonb']['output']>;
};


/** columns and relationships of "app_settings" */
export type AppSettingsPermissionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "app_settings" */
export type AppSettingsAggregate = {
  __typename?: 'appSettingsAggregate';
  aggregate?: Maybe<AppSettingsAggregateFields>;
  nodes: Array<AppSettings>;
};

/** aggregate fields of "app_settings" */
export type AppSettingsAggregateFields = {
  __typename?: 'appSettingsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<AppSettingsMaxFields>;
  min?: Maybe<AppSettingsMinFields>;
};


/** aggregate fields of "app_settings" */
export type AppSettingsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AppSettingsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AppSettingsAppendInput = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "app_settings". All fields are combined with a logical 'AND'. */
export type AppSettingsBoolExp = {
  _and?: InputMaybe<Array<AppSettingsBoolExp>>;
  _not?: InputMaybe<AppSettingsBoolExp>;
  _or?: InputMaybe<Array<AppSettingsBoolExp>>;
  id?: InputMaybe<StringComparisonExp>;
  permissions?: InputMaybe<JsonbComparisonExp>;
};

/** unique or primary key constraints on table "app_settings" */
export enum AppSettingsConstraint {
  /** unique or primary key constraint on columns "id" */
  app_settings_pkey = 'app_settings_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AppSettingsDeleteAtPathInput = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AppSettingsDeleteElemInput = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AppSettingsDeleteKeyInput = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "app_settings" */
export type AppSettingsInsertInput = {
  /** Unique identifier for application setting */
  id?: InputMaybe<Scalars['String']['input']>;
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate max on columns */
export type AppSettingsMaxFields = {
  __typename?: 'appSettingsMaxFields';
  /** Unique identifier for application setting */
  id?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type AppSettingsMinFields = {
  __typename?: 'appSettingsMinFields';
  /** Unique identifier for application setting */
  id?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "app_settings" */
export type AppSettingsMutationResponse = {
  __typename?: 'appSettingsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AppSettings>;
};

/** on_conflict condition type for table "app_settings" */
export type AppSettingsOnConflict = {
  constraint: AppSettingsConstraint;
  updateColumns?: Array<AppSettingsUpdateColumn>;
  where?: InputMaybe<AppSettingsBoolExp>;
};

/** Ordering options when selecting data from "app_settings". */
export type AppSettingsOrderBy = {
  id?: InputMaybe<OrderBy>;
  permissions?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: app_settings */
export type AppSettingsPkColumnsInput = {
  /** Unique identifier for application setting */
  id: Scalars['String']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AppSettingsPrependInput = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "app_settings" */
export enum AppSettingsSelectColumn {
  /** column name */
  id = 'id',
  /** column name */
  permissions = 'permissions'
}

/** input type for updating data in table "app_settings" */
export type AppSettingsSetInput = {
  /** Unique identifier for application setting */
  id?: InputMaybe<Scalars['String']['input']>;
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Streaming cursor of the table "appSettings" */
export type AppSettingsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: AppSettingsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AppSettingsStreamCursorValueInput = {
  /** Unique identifier for application setting */
  id?: InputMaybe<Scalars['String']['input']>;
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** update columns of table "app_settings" */
export enum AppSettingsUpdateColumn {
  /** column name */
  id = 'id',
  /** column name */
  permissions = 'permissions'
}

export type AppSettingsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<AppSettingsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<AppSettingsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<AppSettingsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<AppSettingsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<AppSettingsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AppSettingsSetInput>;
  /** filter the rows which have to be updated */
  where: AppSettingsBoolExp;
};

/** columns and relationships of "audit.audit_log" */
export type AuditLogs = {
  __typename?: 'auditLogs';
  action: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  eventTime: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  ipAddress?: Maybe<Scalars['inet']['output']>;
  metadata?: Maybe<Scalars['jsonb']['output']>;
  newValues?: Maybe<Scalars['jsonb']['output']>;
  oldValues?: Maybe<Scalars['jsonb']['output']>;
  requestId?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['String']['output']>;
  resourceType: Scalars['String']['output'];
  sessionId?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  userAgent?: Maybe<Scalars['String']['output']>;
  userEmail?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
  userRole?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "audit.audit_log" */
export type AuditLogsMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit.audit_log" */
export type AuditLogsNewValuesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit.audit_log" */
export type AuditLogsOldValuesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit.audit_log" */
export type AuditLogsAggregate = {
  __typename?: 'auditLogsAggregate';
  aggregate?: Maybe<AuditLogsAggregateFields>;
  nodes: Array<AuditLogs>;
};

/** aggregate fields of "audit.audit_log" */
export type AuditLogsAggregateFields = {
  __typename?: 'auditLogsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<AuditLogsMaxFields>;
  min?: Maybe<AuditLogsMinFields>;
};


/** aggregate fields of "audit.audit_log" */
export type AuditLogsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AuditLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuditLogsAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newValues?: InputMaybe<Scalars['jsonb']['input']>;
  oldValues?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "audit.audit_log". All fields are combined with a logical 'AND'. */
export type AuditLogsBoolExp = {
  _and?: InputMaybe<Array<AuditLogsBoolExp>>;
  _not?: InputMaybe<AuditLogsBoolExp>;
  _or?: InputMaybe<Array<AuditLogsBoolExp>>;
  action?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  errorMessage?: InputMaybe<StringComparisonExp>;
  eventTime?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  ipAddress?: InputMaybe<InetComparisonExp>;
  metadata?: InputMaybe<JsonbComparisonExp>;
  newValues?: InputMaybe<JsonbComparisonExp>;
  oldValues?: InputMaybe<JsonbComparisonExp>;
  requestId?: InputMaybe<StringComparisonExp>;
  resourceId?: InputMaybe<StringComparisonExp>;
  resourceType?: InputMaybe<StringComparisonExp>;
  sessionId?: InputMaybe<StringComparisonExp>;
  success?: InputMaybe<BooleanComparisonExp>;
  userAgent?: InputMaybe<StringComparisonExp>;
  userEmail?: InputMaybe<StringComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
  userRole?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "audit.audit_log" */
export enum AuditLogsConstraint {
  /** unique or primary key constraint on columns "id" */
  audit_log_pkey = 'audit_log_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AuditLogsDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
  newValues?: InputMaybe<Array<Scalars['String']['input']>>;
  oldValues?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AuditLogsDeleteElemInput = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
  newValues?: InputMaybe<Scalars['Int']['input']>;
  oldValues?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AuditLogsDeleteKeyInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
  newValues?: InputMaybe<Scalars['String']['input']>;
  oldValues?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "audit.audit_log" */
export type AuditLogsInsertInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  errorMessage?: InputMaybe<Scalars['String']['input']>;
  eventTime?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newValues?: InputMaybe<Scalars['jsonb']['input']>;
  oldValues?: InputMaybe<Scalars['jsonb']['input']>;
  requestId?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  resourceType?: InputMaybe<Scalars['String']['input']>;
  sessionId?: InputMaybe<Scalars['String']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userEmail?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
  userRole?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type AuditLogsMaxFields = {
  __typename?: 'auditLogsMaxFields';
  action?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  eventTime?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  requestId?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['String']['output']>;
  resourceType?: Maybe<Scalars['String']['output']>;
  sessionId?: Maybe<Scalars['String']['output']>;
  userAgent?: Maybe<Scalars['String']['output']>;
  userEmail?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
  userRole?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type AuditLogsMinFields = {
  __typename?: 'auditLogsMinFields';
  action?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  eventTime?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  requestId?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['String']['output']>;
  resourceType?: Maybe<Scalars['String']['output']>;
  sessionId?: Maybe<Scalars['String']['output']>;
  userAgent?: Maybe<Scalars['String']['output']>;
  userEmail?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
  userRole?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "audit.audit_log" */
export type AuditLogsMutationResponse = {
  __typename?: 'auditLogsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuditLogs>;
};

/** on_conflict condition type for table "audit.audit_log" */
export type AuditLogsOnConflict = {
  constraint: AuditLogsConstraint;
  updateColumns?: Array<AuditLogsUpdateColumn>;
  where?: InputMaybe<AuditLogsBoolExp>;
};

/** Ordering options when selecting data from "audit.audit_log". */
export type AuditLogsOrderBy = {
  action?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  errorMessage?: InputMaybe<OrderBy>;
  eventTime?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  ipAddress?: InputMaybe<OrderBy>;
  metadata?: InputMaybe<OrderBy>;
  newValues?: InputMaybe<OrderBy>;
  oldValues?: InputMaybe<OrderBy>;
  requestId?: InputMaybe<OrderBy>;
  resourceId?: InputMaybe<OrderBy>;
  resourceType?: InputMaybe<OrderBy>;
  sessionId?: InputMaybe<OrderBy>;
  success?: InputMaybe<OrderBy>;
  userAgent?: InputMaybe<OrderBy>;
  userEmail?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  userRole?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: audit.audit_log */
export type AuditLogsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuditLogsPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newValues?: InputMaybe<Scalars['jsonb']['input']>;
  oldValues?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit.audit_log" */
export enum AuditLogsSelectColumn {
  /** column name */
  action = 'action',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  errorMessage = 'errorMessage',
  /** column name */
  eventTime = 'eventTime',
  /** column name */
  id = 'id',
  /** column name */
  ipAddress = 'ipAddress',
  /** column name */
  metadata = 'metadata',
  /** column name */
  newValues = 'newValues',
  /** column name */
  oldValues = 'oldValues',
  /** column name */
  requestId = 'requestId',
  /** column name */
  resourceId = 'resourceId',
  /** column name */
  resourceType = 'resourceType',
  /** column name */
  sessionId = 'sessionId',
  /** column name */
  success = 'success',
  /** column name */
  userAgent = 'userAgent',
  /** column name */
  userEmail = 'userEmail',
  /** column name */
  userId = 'userId',
  /** column name */
  userRole = 'userRole'
}

/** input type for updating data in table "audit.audit_log" */
export type AuditLogsSetInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  errorMessage?: InputMaybe<Scalars['String']['input']>;
  eventTime?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newValues?: InputMaybe<Scalars['jsonb']['input']>;
  oldValues?: InputMaybe<Scalars['jsonb']['input']>;
  requestId?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  resourceType?: InputMaybe<Scalars['String']['input']>;
  sessionId?: InputMaybe<Scalars['String']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userEmail?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
  userRole?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "auditLogs" */
export type AuditLogsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: AuditLogsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AuditLogsStreamCursorValueInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  errorMessage?: InputMaybe<Scalars['String']['input']>;
  eventTime?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newValues?: InputMaybe<Scalars['jsonb']['input']>;
  oldValues?: InputMaybe<Scalars['jsonb']['input']>;
  requestId?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  resourceType?: InputMaybe<Scalars['String']['input']>;
  sessionId?: InputMaybe<Scalars['String']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userEmail?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
  userRole?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "audit.audit_log" */
export enum AuditLogsUpdateColumn {
  /** column name */
  action = 'action',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  errorMessage = 'errorMessage',
  /** column name */
  eventTime = 'eventTime',
  /** column name */
  id = 'id',
  /** column name */
  ipAddress = 'ipAddress',
  /** column name */
  metadata = 'metadata',
  /** column name */
  newValues = 'newValues',
  /** column name */
  oldValues = 'oldValues',
  /** column name */
  requestId = 'requestId',
  /** column name */
  resourceId = 'resourceId',
  /** column name */
  resourceType = 'resourceType',
  /** column name */
  sessionId = 'sessionId',
  /** column name */
  success = 'success',
  /** column name */
  userAgent = 'userAgent',
  /** column name */
  userEmail = 'userEmail',
  /** column name */
  userId = 'userId',
  /** column name */
  userRole = 'userRole'
}

export type AuditLogsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<AuditLogsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<AuditLogsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<AuditLogsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<AuditLogsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<AuditLogsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuditLogsSetInput>;
  /** filter the rows which have to be updated */
  where: AuditLogsBoolExp;
};

/** columns and relationships of "audit.auth_events" */
export type AuthEvents = {
  __typename?: 'authEvents';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  eventTime: Scalars['timestamptz']['output'];
  eventType: Scalars['String']['output'];
  failureReason?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  ipAddress?: Maybe<Scalars['inet']['output']>;
  metadata?: Maybe<Scalars['jsonb']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  userAgent?: Maybe<Scalars['String']['output']>;
  userEmail?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};


/** columns and relationships of "audit.auth_events" */
export type AuthEventsMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit.auth_events" */
export type AuthEventsAggregate = {
  __typename?: 'authEventsAggregate';
  aggregate?: Maybe<AuthEventsAggregateFields>;
  nodes: Array<AuthEvents>;
};

/** aggregate fields of "audit.auth_events" */
export type AuthEventsAggregateFields = {
  __typename?: 'authEventsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<AuthEventsMaxFields>;
  min?: Maybe<AuthEventsMinFields>;
};


/** aggregate fields of "audit.auth_events" */
export type AuthEventsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AuthEventsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuthEventsAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "audit.auth_events". All fields are combined with a logical 'AND'. */
export type AuthEventsBoolExp = {
  _and?: InputMaybe<Array<AuthEventsBoolExp>>;
  _not?: InputMaybe<AuthEventsBoolExp>;
  _or?: InputMaybe<Array<AuthEventsBoolExp>>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  eventTime?: InputMaybe<TimestamptzComparisonExp>;
  eventType?: InputMaybe<StringComparisonExp>;
  failureReason?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  ipAddress?: InputMaybe<InetComparisonExp>;
  metadata?: InputMaybe<JsonbComparisonExp>;
  success?: InputMaybe<BooleanComparisonExp>;
  userAgent?: InputMaybe<StringComparisonExp>;
  userEmail?: InputMaybe<StringComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "audit.auth_events" */
export enum AuthEventsConstraint {
  /** unique or primary key constraint on columns "id" */
  auth_events_pkey = 'auth_events_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AuthEventsDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AuthEventsDeleteElemInput = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AuthEventsDeleteKeyInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "audit.auth_events" */
export type AuthEventsInsertInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  eventTime?: InputMaybe<Scalars['timestamptz']['input']>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  failureReason?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userEmail?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type AuthEventsMaxFields = {
  __typename?: 'authEventsMaxFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  eventTime?: Maybe<Scalars['timestamptz']['output']>;
  eventType?: Maybe<Scalars['String']['output']>;
  failureReason?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  userAgent?: Maybe<Scalars['String']['output']>;
  userEmail?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type AuthEventsMinFields = {
  __typename?: 'authEventsMinFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  eventTime?: Maybe<Scalars['timestamptz']['output']>;
  eventType?: Maybe<Scalars['String']['output']>;
  failureReason?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  userAgent?: Maybe<Scalars['String']['output']>;
  userEmail?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "audit.auth_events" */
export type AuthEventsMutationResponse = {
  __typename?: 'authEventsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthEvents>;
};

/** on_conflict condition type for table "audit.auth_events" */
export type AuthEventsOnConflict = {
  constraint: AuthEventsConstraint;
  updateColumns?: Array<AuthEventsUpdateColumn>;
  where?: InputMaybe<AuthEventsBoolExp>;
};

/** Ordering options when selecting data from "audit.auth_events". */
export type AuthEventsOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  eventTime?: InputMaybe<OrderBy>;
  eventType?: InputMaybe<OrderBy>;
  failureReason?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  ipAddress?: InputMaybe<OrderBy>;
  metadata?: InputMaybe<OrderBy>;
  success?: InputMaybe<OrderBy>;
  userAgent?: InputMaybe<OrderBy>;
  userEmail?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: audit.auth_events */
export type AuthEventsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuthEventsPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit.auth_events" */
export enum AuthEventsSelectColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  eventTime = 'eventTime',
  /** column name */
  eventType = 'eventType',
  /** column name */
  failureReason = 'failureReason',
  /** column name */
  id = 'id',
  /** column name */
  ipAddress = 'ipAddress',
  /** column name */
  metadata = 'metadata',
  /** column name */
  success = 'success',
  /** column name */
  userAgent = 'userAgent',
  /** column name */
  userEmail = 'userEmail',
  /** column name */
  userId = 'userId'
}

/** input type for updating data in table "audit.auth_events" */
export type AuthEventsSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  eventTime?: InputMaybe<Scalars['timestamptz']['input']>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  failureReason?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userEmail?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "authEvents" */
export type AuthEventsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: AuthEventsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AuthEventsStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  eventTime?: InputMaybe<Scalars['timestamptz']['input']>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  failureReason?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userEmail?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "audit.auth_events" */
export enum AuthEventsUpdateColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  eventTime = 'eventTime',
  /** column name */
  eventType = 'eventType',
  /** column name */
  failureReason = 'failureReason',
  /** column name */
  id = 'id',
  /** column name */
  ipAddress = 'ipAddress',
  /** column name */
  metadata = 'metadata',
  /** column name */
  success = 'success',
  /** column name */
  userAgent = 'userAgent',
  /** column name */
  userEmail = 'userEmail',
  /** column name */
  userId = 'userId'
}

export type AuthEventsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<AuthEventsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<AuthEventsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<AuthEventsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<AuthEventsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<AuthEventsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuthEventsSetInput>;
  /** filter the rows which have to be updated */
  where: AuthEventsBoolExp;
};

/** columns and relationships of "neon_auth.users_sync" */
export type AuthUsersSync = {
  __typename?: 'authUsersSync';
  /** Timestamp when the user was created in the auth system */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Timestamp when the user was deleted in the auth system */
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** User's email address from authentication provider */
  email?: Maybe<Scalars['String']['output']>;
  /** Unique identifier from the authentication provider */
  id: Scalars['String']['output'];
  /** User's full name from authentication provider */
  name?: Maybe<Scalars['String']['output']>;
  /** Complete JSON data from the authentication provider */
  rawJson: Scalars['jsonb']['output'];
  /** Timestamp when the user was last updated in the auth system */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "neon_auth.users_sync" */
export type AuthUsersSyncRawJsonArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "neon_auth.users_sync" */
export type AuthUsersSyncAggregate = {
  __typename?: 'authUsersSyncAggregate';
  aggregate?: Maybe<AuthUsersSyncAggregateFields>;
  nodes: Array<AuthUsersSync>;
};

/** aggregate fields of "neon_auth.users_sync" */
export type AuthUsersSyncAggregateFields = {
  __typename?: 'authUsersSyncAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<AuthUsersSyncMaxFields>;
  min?: Maybe<AuthUsersSyncMinFields>;
};


/** aggregate fields of "neon_auth.users_sync" */
export type AuthUsersSyncAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AuthUsersSyncSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuthUsersSyncAppendInput = {
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "neon_auth.users_sync". All fields are combined with a logical 'AND'. */
export type AuthUsersSyncBoolExp = {
  _and?: InputMaybe<Array<AuthUsersSyncBoolExp>>;
  _not?: InputMaybe<AuthUsersSyncBoolExp>;
  _or?: InputMaybe<Array<AuthUsersSyncBoolExp>>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  deletedAt?: InputMaybe<TimestamptzComparisonExp>;
  email?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<StringComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  rawJson?: InputMaybe<JsonbComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "neon_auth.users_sync" */
export enum AuthUsersSyncConstraint {
  /** unique or primary key constraint on columns "id" */
  users_sync_pkey = 'users_sync_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AuthUsersSyncDeleteAtPathInput = {
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AuthUsersSyncDeleteElemInput = {
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AuthUsersSyncDeleteKeyInput = {
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "neon_auth.users_sync" */
export type AuthUsersSyncInsertInput = {
  /** Timestamp when the user was deleted in the auth system */
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['jsonb']['input']>;
  /** Timestamp when the user was last updated in the auth system */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type AuthUsersSyncMaxFields = {
  __typename?: 'authUsersSyncMaxFields';
  /** Timestamp when the user was created in the auth system */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Timestamp when the user was deleted in the auth system */
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** User's email address from authentication provider */
  email?: Maybe<Scalars['String']['output']>;
  /** Unique identifier from the authentication provider */
  id?: Maybe<Scalars['String']['output']>;
  /** User's full name from authentication provider */
  name?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the user was last updated in the auth system */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type AuthUsersSyncMinFields = {
  __typename?: 'authUsersSyncMinFields';
  /** Timestamp when the user was created in the auth system */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Timestamp when the user was deleted in the auth system */
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** User's email address from authentication provider */
  email?: Maybe<Scalars['String']['output']>;
  /** Unique identifier from the authentication provider */
  id?: Maybe<Scalars['String']['output']>;
  /** User's full name from authentication provider */
  name?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the user was last updated in the auth system */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "neon_auth.users_sync" */
export type AuthUsersSyncMutationResponse = {
  __typename?: 'authUsersSyncMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthUsersSync>;
};

/** on_conflict condition type for table "neon_auth.users_sync" */
export type AuthUsersSyncOnConflict = {
  constraint: AuthUsersSyncConstraint;
  updateColumns?: Array<AuthUsersSyncUpdateColumn>;
  where?: InputMaybe<AuthUsersSyncBoolExp>;
};

/** Ordering options when selecting data from "neon_auth.users_sync". */
export type AuthUsersSyncOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  rawJson?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: neon_auth.users_sync */
export type AuthUsersSyncPkColumnsInput = {
  /** Unique identifier from the authentication provider */
  id: Scalars['String']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuthUsersSyncPrependInput = {
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "neon_auth.users_sync" */
export enum AuthUsersSyncSelectColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  deletedAt = 'deletedAt',
  /** column name */
  email = 'email',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  rawJson = 'rawJson',
  /** column name */
  updatedAt = 'updatedAt'
}

/** input type for updating data in table "neon_auth.users_sync" */
export type AuthUsersSyncSetInput = {
  /** Timestamp when the user was deleted in the auth system */
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['jsonb']['input']>;
  /** Timestamp when the user was last updated in the auth system */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "authUsersSync" */
export type AuthUsersSyncStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: AuthUsersSyncStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AuthUsersSyncStreamCursorValueInput = {
  /** Timestamp when the user was created in the auth system */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Timestamp when the user was deleted in the auth system */
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** User's email address from authentication provider */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier from the authentication provider */
  id?: InputMaybe<Scalars['String']['input']>;
  /** User's full name from authentication provider */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['jsonb']['input']>;
  /** Timestamp when the user was last updated in the auth system */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "neon_auth.users_sync" */
export enum AuthUsersSyncUpdateColumn {
  /** column name */
  deletedAt = 'deletedAt',
  /** column name */
  rawJson = 'rawJson',
  /** column name */
  updatedAt = 'updatedAt'
}

export type AuthUsersSyncUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<AuthUsersSyncAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<AuthUsersSyncDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<AuthUsersSyncDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<AuthUsersSyncDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<AuthUsersSyncPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuthUsersSyncSetInput>;
  /** filter the rows which have to be updated */
  where: AuthUsersSyncBoolExp;
};

/** columns and relationships of "billing_event_log" */
export type BillingEventLogs = {
  __typename?: 'billingEventLogs';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  createdBy?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  createdByUser?: Maybe<Users>;
  eventType: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  invoiceId?: Maybe<Scalars['uuid']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "billing_event_log" */
export type BillingEventLogsAggregate = {
  __typename?: 'billingEventLogsAggregate';
  aggregate?: Maybe<BillingEventLogsAggregateFields>;
  nodes: Array<BillingEventLogs>;
};

export type BillingEventLogsAggregateBoolExp = {
  count?: InputMaybe<BillingEventLogsAggregateBoolExpCount>;
};

export type BillingEventLogsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingEventLogsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "billing_event_log" */
export type BillingEventLogsAggregateFields = {
  __typename?: 'billingEventLogsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<BillingEventLogsMaxFields>;
  min?: Maybe<BillingEventLogsMinFields>;
};


/** aggregate fields of "billing_event_log" */
export type BillingEventLogsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "billing_event_log" */
export type BillingEventLogsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BillingEventLogsMaxOrderBy>;
  min?: InputMaybe<BillingEventLogsMinOrderBy>;
};

/** input type for inserting array relation for remote table "billing_event_log" */
export type BillingEventLogsArrRelInsertInput = {
  data: Array<BillingEventLogsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<BillingEventLogsOnConflict>;
};

/** Boolean expression to filter rows from the table "billing_event_log". All fields are combined with a logical 'AND'. */
export type BillingEventLogsBoolExp = {
  _and?: InputMaybe<Array<BillingEventLogsBoolExp>>;
  _not?: InputMaybe<BillingEventLogsBoolExp>;
  _or?: InputMaybe<Array<BillingEventLogsBoolExp>>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdBy?: InputMaybe<UuidComparisonExp>;
  createdByUser?: InputMaybe<UsersBoolExp>;
  eventType?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  invoiceId?: InputMaybe<UuidComparisonExp>;
  message?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "billing_event_log" */
export enum BillingEventLogsConstraint {
  /** unique or primary key constraint on columns "id" */
  billing_event_log_pkey = 'billing_event_log_pkey'
}

/** input type for inserting data into table "billing_event_log" */
export type BillingEventLogsInsertInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  createdByUser?: InputMaybe<UsersObjRelInsertInput>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type BillingEventLogsMaxFields = {
  __typename?: 'billingEventLogsMaxFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  createdBy?: Maybe<Scalars['uuid']['output']>;
  eventType?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  invoiceId?: Maybe<Scalars['uuid']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "billing_event_log" */
export type BillingEventLogsMaxOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  eventType?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BillingEventLogsMinFields = {
  __typename?: 'billingEventLogsMinFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  createdBy?: Maybe<Scalars['uuid']['output']>;
  eventType?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  invoiceId?: Maybe<Scalars['uuid']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "billing_event_log" */
export type BillingEventLogsMinOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  eventType?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "billing_event_log" */
export type BillingEventLogsMutationResponse = {
  __typename?: 'billingEventLogsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BillingEventLogs>;
};

/** on_conflict condition type for table "billing_event_log" */
export type BillingEventLogsOnConflict = {
  constraint: BillingEventLogsConstraint;
  updateColumns?: Array<BillingEventLogsUpdateColumn>;
  where?: InputMaybe<BillingEventLogsBoolExp>;
};

/** Ordering options when selecting data from "billing_event_log". */
export type BillingEventLogsOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  createdByUser?: InputMaybe<UsersOrderBy>;
  eventType?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_event_log */
export type BillingEventLogsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_event_log" */
export enum BillingEventLogsSelectColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  createdBy = 'createdBy',
  /** column name */
  eventType = 'eventType',
  /** column name */
  id = 'id',
  /** column name */
  invoiceId = 'invoiceId',
  /** column name */
  message = 'message'
}

/** input type for updating data in table "billing_event_log" */
export type BillingEventLogsSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "billingEventLogs" */
export type BillingEventLogsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: BillingEventLogsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BillingEventLogsStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "billing_event_log" */
export enum BillingEventLogsUpdateColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  createdBy = 'createdBy',
  /** column name */
  eventType = 'eventType',
  /** column name */
  id = 'id',
  /** column name */
  invoiceId = 'invoiceId',
  /** column name */
  message = 'message'
}

export type BillingEventLogsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingEventLogsSetInput>;
  /** filter the rows which have to be updated */
  where: BillingEventLogsBoolExp;
};

/** columns and relationships of "billing_invoice" */
export type BillingInvoice = {
  __typename?: 'billingInvoice';
  /** An array relationship */
  billingEventLogs: Array<BillingEventLogs>;
  /** An aggregate relationship */
  billingEventLogsAggregate: BillingEventLogsAggregate;
  billingPeriodEnd: Scalars['date']['output'];
  billingPeriodStart: Scalars['date']['output'];
  /** An object relationship */
  client: Clients;
  clientId: Scalars['uuid']['output'];
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['date']['output']>;
  id: Scalars['uuid']['output'];
  issuedDate?: Maybe<Scalars['date']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalAmount: Scalars['numeric']['output'];
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "billing_invoice" */
export type BillingInvoiceBillingEventLogsArgs = {
  distinctOn?: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where?: InputMaybe<BillingEventLogsBoolExp>;
};


/** columns and relationships of "billing_invoice" */
export type BillingInvoiceBillingEventLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where?: InputMaybe<BillingEventLogsBoolExp>;
};

/** aggregated selection of "billing_invoice" */
export type BillingInvoiceAggregate = {
  __typename?: 'billingInvoiceAggregate';
  aggregate?: Maybe<BillingInvoiceAggregateFields>;
  nodes: Array<BillingInvoice>;
};

export type BillingInvoiceAggregateBoolExp = {
  count?: InputMaybe<BillingInvoiceAggregateBoolExpCount>;
};

export type BillingInvoiceAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingInvoiceBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "billing_invoice" */
export type BillingInvoiceAggregateFields = {
  __typename?: 'billingInvoiceAggregateFields';
  avg?: Maybe<BillingInvoiceAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<BillingInvoiceMaxFields>;
  min?: Maybe<BillingInvoiceMinFields>;
  stddev?: Maybe<BillingInvoiceStddevFields>;
  stddevPop?: Maybe<BillingInvoiceStddevPopFields>;
  stddevSamp?: Maybe<BillingInvoiceStddevSampFields>;
  sum?: Maybe<BillingInvoiceSumFields>;
  varPop?: Maybe<BillingInvoiceVarPopFields>;
  varSamp?: Maybe<BillingInvoiceVarSampFields>;
  variance?: Maybe<BillingInvoiceVarianceFields>;
};


/** aggregate fields of "billing_invoice" */
export type BillingInvoiceAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "billing_invoice" */
export type BillingInvoiceAggregateOrderBy = {
  avg?: InputMaybe<BillingInvoiceAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BillingInvoiceMaxOrderBy>;
  min?: InputMaybe<BillingInvoiceMinOrderBy>;
  stddev?: InputMaybe<BillingInvoiceStddevOrderBy>;
  stddevPop?: InputMaybe<BillingInvoiceStddevPopOrderBy>;
  stddevSamp?: InputMaybe<BillingInvoiceStddevSampOrderBy>;
  sum?: InputMaybe<BillingInvoiceSumOrderBy>;
  varPop?: InputMaybe<BillingInvoiceVarPopOrderBy>;
  varSamp?: InputMaybe<BillingInvoiceVarSampOrderBy>;
  variance?: InputMaybe<BillingInvoiceVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "billing_invoice" */
export type BillingInvoiceArrRelInsertInput = {
  data: Array<BillingInvoiceInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<BillingInvoiceOnConflict>;
};

/** aggregate avg on columns */
export type BillingInvoiceAvgFields = {
  __typename?: 'billingInvoiceAvgFields';
  totalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "billing_invoice" */
export type BillingInvoiceAvgOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "billing_invoice". All fields are combined with a logical 'AND'. */
export type BillingInvoiceBoolExp = {
  _and?: InputMaybe<Array<BillingInvoiceBoolExp>>;
  _not?: InputMaybe<BillingInvoiceBoolExp>;
  _or?: InputMaybe<Array<BillingInvoiceBoolExp>>;
  billingEventLogs?: InputMaybe<BillingEventLogsBoolExp>;
  billingEventLogsAggregate?: InputMaybe<BillingEventLogsAggregateBoolExp>;
  billingPeriodEnd?: InputMaybe<DateComparisonExp>;
  billingPeriodStart?: InputMaybe<DateComparisonExp>;
  client?: InputMaybe<ClientsBoolExp>;
  clientId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  currency?: InputMaybe<StringComparisonExp>;
  dueDate?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  issuedDate?: InputMaybe<DateComparisonExp>;
  notes?: InputMaybe<StringComparisonExp>;
  status?: InputMaybe<StringComparisonExp>;
  totalAmount?: InputMaybe<NumericComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "billing_invoice" */
export enum BillingInvoiceConstraint {
  /** unique or primary key constraint on columns "id" */
  billing_invoice_pkey = 'billing_invoice_pkey'
}

/** input type for incrementing numeric columns in table "billing_invoice" */
export type BillingInvoiceIncInput = {
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_invoice" */
export type BillingInvoiceInsertInput = {
  billingEventLogs?: InputMaybe<BillingEventLogsArrRelInsertInput>;
  billingPeriodEnd?: InputMaybe<Scalars['date']['input']>;
  billingPeriodStart?: InputMaybe<Scalars['date']['input']>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  issuedDate?: InputMaybe<Scalars['date']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type BillingInvoiceMaxFields = {
  __typename?: 'billingInvoiceMaxFields';
  billingPeriodEnd?: Maybe<Scalars['date']['output']>;
  billingPeriodStart?: Maybe<Scalars['date']['output']>;
  clientId?: Maybe<Scalars['uuid']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  issuedDate?: Maybe<Scalars['date']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  totalAmount?: Maybe<Scalars['numeric']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "billing_invoice" */
export type BillingInvoiceMaxOrderBy = {
  billingPeriodEnd?: InputMaybe<OrderBy>;
  billingPeriodStart?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  dueDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  issuedDate?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BillingInvoiceMinFields = {
  __typename?: 'billingInvoiceMinFields';
  billingPeriodEnd?: Maybe<Scalars['date']['output']>;
  billingPeriodStart?: Maybe<Scalars['date']['output']>;
  clientId?: Maybe<Scalars['uuid']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  issuedDate?: Maybe<Scalars['date']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  totalAmount?: Maybe<Scalars['numeric']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "billing_invoice" */
export type BillingInvoiceMinOrderBy = {
  billingPeriodEnd?: InputMaybe<OrderBy>;
  billingPeriodStart?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  dueDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  issuedDate?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "billing_invoice" */
export type BillingInvoiceMutationResponse = {
  __typename?: 'billingInvoiceMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BillingInvoice>;
};

/** on_conflict condition type for table "billing_invoice" */
export type BillingInvoiceOnConflict = {
  constraint: BillingInvoiceConstraint;
  updateColumns?: Array<BillingInvoiceUpdateColumn>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};

/** Ordering options when selecting data from "billing_invoice". */
export type BillingInvoiceOrderBy = {
  billingEventLogsAggregate?: InputMaybe<BillingEventLogsAggregateOrderBy>;
  billingPeriodEnd?: InputMaybe<OrderBy>;
  billingPeriodStart?: InputMaybe<OrderBy>;
  client?: InputMaybe<ClientsOrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  dueDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  issuedDate?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_invoice */
export type BillingInvoicePkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_invoice" */
export enum BillingInvoiceSelectColumn {
  /** column name */
  billingPeriodEnd = 'billingPeriodEnd',
  /** column name */
  billingPeriodStart = 'billingPeriodStart',
  /** column name */
  clientId = 'clientId',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  currency = 'currency',
  /** column name */
  dueDate = 'dueDate',
  /** column name */
  id = 'id',
  /** column name */
  issuedDate = 'issuedDate',
  /** column name */
  notes = 'notes',
  /** column name */
  status = 'status',
  /** column name */
  totalAmount = 'totalAmount',
  /** column name */
  updatedAt = 'updatedAt'
}

/** input type for updating data in table "billing_invoice" */
export type BillingInvoiceSetInput = {
  billingPeriodEnd?: InputMaybe<Scalars['date']['input']>;
  billingPeriodStart?: InputMaybe<Scalars['date']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  issuedDate?: InputMaybe<Scalars['date']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type BillingInvoiceStddevFields = {
  __typename?: 'billingInvoiceStddevFields';
  totalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "billing_invoice" */
export type BillingInvoiceStddevOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** aggregate stddevPop on columns */
export type BillingInvoiceStddevPopFields = {
  __typename?: 'billingInvoiceStddevPopFields';
  totalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevPop() on columns of table "billing_invoice" */
export type BillingInvoiceStddevPopOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** aggregate stddevSamp on columns */
export type BillingInvoiceStddevSampFields = {
  __typename?: 'billingInvoiceStddevSampFields';
  totalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevSamp() on columns of table "billing_invoice" */
export type BillingInvoiceStddevSampOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "billingInvoice" */
export type BillingInvoiceStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: BillingInvoiceStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BillingInvoiceStreamCursorValueInput = {
  billingPeriodEnd?: InputMaybe<Scalars['date']['input']>;
  billingPeriodStart?: InputMaybe<Scalars['date']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  issuedDate?: InputMaybe<Scalars['date']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type BillingInvoiceSumFields = {
  __typename?: 'billingInvoiceSumFields';
  totalAmount?: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "billing_invoice" */
export type BillingInvoiceSumOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** update columns of table "billing_invoice" */
export enum BillingInvoiceUpdateColumn {
  /** column name */
  billingPeriodEnd = 'billingPeriodEnd',
  /** column name */
  billingPeriodStart = 'billingPeriodStart',
  /** column name */
  clientId = 'clientId',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  currency = 'currency',
  /** column name */
  dueDate = 'dueDate',
  /** column name */
  id = 'id',
  /** column name */
  issuedDate = 'issuedDate',
  /** column name */
  notes = 'notes',
  /** column name */
  status = 'status',
  /** column name */
  totalAmount = 'totalAmount',
  /** column name */
  updatedAt = 'updatedAt'
}

export type BillingInvoiceUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BillingInvoiceIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingInvoiceSetInput>;
  /** filter the rows which have to be updated */
  where: BillingInvoiceBoolExp;
};

/** aggregate varPop on columns */
export type BillingInvoiceVarPopFields = {
  __typename?: 'billingInvoiceVarPopFields';
  totalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by varPop() on columns of table "billing_invoice" */
export type BillingInvoiceVarPopOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** aggregate varSamp on columns */
export type BillingInvoiceVarSampFields = {
  __typename?: 'billingInvoiceVarSampFields';
  totalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by varSamp() on columns of table "billing_invoice" */
export type BillingInvoiceVarSampOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type BillingInvoiceVarianceFields = {
  __typename?: 'billingInvoiceVarianceFields';
  totalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "billing_invoice" */
export type BillingInvoiceVarianceOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** columns and relationships of "billing_items" */
export type BillingItems = {
  __typename?: 'billingItems';
  amount?: Maybe<Scalars['numeric']['output']>;
  createdAt?: Maybe<Scalars['timestamp']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  invoiceId?: Maybe<Scalars['uuid']['output']>;
  payrollId?: Maybe<Scalars['uuid']['output']>;
  quantity: Scalars['Int']['output'];
  /** An object relationship */
  relatedPayroll?: Maybe<Payrolls>;
  unitPrice: Scalars['numeric']['output'];
};

/** aggregated selection of "billing_items" */
export type BillingItemsAggregate = {
  __typename?: 'billingItemsAggregate';
  aggregate?: Maybe<BillingItemsAggregateFields>;
  nodes: Array<BillingItems>;
};

export type BillingItemsAggregateBoolExp = {
  count?: InputMaybe<BillingItemsAggregateBoolExpCount>;
};

export type BillingItemsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingItemsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingItemsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "billing_items" */
export type BillingItemsAggregateFields = {
  __typename?: 'billingItemsAggregateFields';
  avg?: Maybe<BillingItemsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<BillingItemsMaxFields>;
  min?: Maybe<BillingItemsMinFields>;
  stddev?: Maybe<BillingItemsStddevFields>;
  stddevPop?: Maybe<BillingItemsStddevPopFields>;
  stddevSamp?: Maybe<BillingItemsStddevSampFields>;
  sum?: Maybe<BillingItemsSumFields>;
  varPop?: Maybe<BillingItemsVarPopFields>;
  varSamp?: Maybe<BillingItemsVarSampFields>;
  variance?: Maybe<BillingItemsVarianceFields>;
};


/** aggregate fields of "billing_items" */
export type BillingItemsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<BillingItemsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "billing_items" */
export type BillingItemsAggregateOrderBy = {
  avg?: InputMaybe<BillingItemsAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BillingItemsMaxOrderBy>;
  min?: InputMaybe<BillingItemsMinOrderBy>;
  stddev?: InputMaybe<BillingItemsStddevOrderBy>;
  stddevPop?: InputMaybe<BillingItemsStddevPopOrderBy>;
  stddevSamp?: InputMaybe<BillingItemsStddevSampOrderBy>;
  sum?: InputMaybe<BillingItemsSumOrderBy>;
  varPop?: InputMaybe<BillingItemsVarPopOrderBy>;
  varSamp?: InputMaybe<BillingItemsVarSampOrderBy>;
  variance?: InputMaybe<BillingItemsVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "billing_items" */
export type BillingItemsArrRelInsertInput = {
  data: Array<BillingItemsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<BillingItemsOnConflict>;
};

/** aggregate avg on columns */
export type BillingItemsAvgFields = {
  __typename?: 'billingItemsAvgFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "billing_items" */
export type BillingItemsAvgOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "billing_items". All fields are combined with a logical 'AND'. */
export type BillingItemsBoolExp = {
  _and?: InputMaybe<Array<BillingItemsBoolExp>>;
  _not?: InputMaybe<BillingItemsBoolExp>;
  _or?: InputMaybe<Array<BillingItemsBoolExp>>;
  amount?: InputMaybe<NumericComparisonExp>;
  createdAt?: InputMaybe<TimestampComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  invoiceId?: InputMaybe<UuidComparisonExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  quantity?: InputMaybe<IntComparisonExp>;
  relatedPayroll?: InputMaybe<PayrollsBoolExp>;
  unitPrice?: InputMaybe<NumericComparisonExp>;
};

/** unique or primary key constraints on table "billing_items" */
export enum BillingItemsConstraint {
  /** unique or primary key constraint on columns "id" */
  billing_items_pkey = 'billing_items_pkey'
}

/** input type for incrementing numeric columns in table "billing_items" */
export type BillingItemsIncInput = {
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_items" */
export type BillingItemsInsertInput = {
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  relatedPayroll?: InputMaybe<PayrollsObjRelInsertInput>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate max on columns */
export type BillingItemsMaxFields = {
  __typename?: 'billingItemsMaxFields';
  amount?: Maybe<Scalars['numeric']['output']>;
  createdAt?: Maybe<Scalars['timestamp']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  invoiceId?: Maybe<Scalars['uuid']['output']>;
  payrollId?: Maybe<Scalars['uuid']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  unitPrice?: Maybe<Scalars['numeric']['output']>;
};

/** order by max() on columns of table "billing_items" */
export type BillingItemsMaxOrderBy = {
  amount?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BillingItemsMinFields = {
  __typename?: 'billingItemsMinFields';
  amount?: Maybe<Scalars['numeric']['output']>;
  createdAt?: Maybe<Scalars['timestamp']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  invoiceId?: Maybe<Scalars['uuid']['output']>;
  payrollId?: Maybe<Scalars['uuid']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  unitPrice?: Maybe<Scalars['numeric']['output']>;
};

/** order by min() on columns of table "billing_items" */
export type BillingItemsMinOrderBy = {
  amount?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "billing_items" */
export type BillingItemsMutationResponse = {
  __typename?: 'billingItemsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BillingItems>;
};

/** on_conflict condition type for table "billing_items" */
export type BillingItemsOnConflict = {
  constraint: BillingItemsConstraint;
  updateColumns?: Array<BillingItemsUpdateColumn>;
  where?: InputMaybe<BillingItemsBoolExp>;
};

/** Ordering options when selecting data from "billing_items". */
export type BillingItemsOrderBy = {
  amount?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  relatedPayroll?: InputMaybe<PayrollsOrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_items */
export type BillingItemsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_items" */
export enum BillingItemsSelectColumn {
  /** column name */
  amount = 'amount',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  invoiceId = 'invoiceId',
  /** column name */
  payrollId = 'payrollId',
  /** column name */
  quantity = 'quantity',
  /** column name */
  unitPrice = 'unitPrice'
}

/** input type for updating data in table "billing_items" */
export type BillingItemsSetInput = {
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate stddev on columns */
export type BillingItemsStddevFields = {
  __typename?: 'billingItemsStddevFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "billing_items" */
export type BillingItemsStddevOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** aggregate stddevPop on columns */
export type BillingItemsStddevPopFields = {
  __typename?: 'billingItemsStddevPopFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevPop() on columns of table "billing_items" */
export type BillingItemsStddevPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** aggregate stddevSamp on columns */
export type BillingItemsStddevSampFields = {
  __typename?: 'billingItemsStddevSampFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevSamp() on columns of table "billing_items" */
export type BillingItemsStddevSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "billingItems" */
export type BillingItemsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: BillingItemsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BillingItemsStreamCursorValueInput = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate sum on columns */
export type BillingItemsSumFields = {
  __typename?: 'billingItemsSumFields';
  amount?: Maybe<Scalars['numeric']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  unitPrice?: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "billing_items" */
export type BillingItemsSumOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** update columns of table "billing_items" */
export enum BillingItemsUpdateColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  invoiceId = 'invoiceId',
  /** column name */
  payrollId = 'payrollId',
  /** column name */
  quantity = 'quantity',
  /** column name */
  unitPrice = 'unitPrice'
}

export type BillingItemsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BillingItemsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingItemsSetInput>;
  /** filter the rows which have to be updated */
  where: BillingItemsBoolExp;
};

/** aggregate varPop on columns */
export type BillingItemsVarPopFields = {
  __typename?: 'billingItemsVarPopFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by varPop() on columns of table "billing_items" */
export type BillingItemsVarPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** aggregate varSamp on columns */
export type BillingItemsVarSampFields = {
  __typename?: 'billingItemsVarSampFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by varSamp() on columns of table "billing_items" */
export type BillingItemsVarSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type BillingItemsVarianceFields = {
  __typename?: 'billingItemsVarianceFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "billing_items" */
export type BillingItemsVarianceOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** columns and relationships of "billing_plan" */
export type BillingPlans = {
  __typename?: 'billingPlans';
  /** An array relationship */
  clientBillingAssignments: Array<ClientBillingAssignments>;
  /** An aggregate relationship */
  clientBillingAssignmentsAggregate: ClientBillingAssignmentsAggregate;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  currency: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  ratePerPayroll: Scalars['numeric']['output'];
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "billing_plan" */
export type BillingPlansClientBillingAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


/** columns and relationships of "billing_plan" */
export type BillingPlansClientBillingAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentsBoolExp>;
};

/** aggregated selection of "billing_plan" */
export type BillingPlansAggregate = {
  __typename?: 'billingPlansAggregate';
  aggregate?: Maybe<BillingPlansAggregateFields>;
  nodes: Array<BillingPlans>;
};

/** aggregate fields of "billing_plan" */
export type BillingPlansAggregateFields = {
  __typename?: 'billingPlansAggregateFields';
  avg?: Maybe<BillingPlansAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<BillingPlansMaxFields>;
  min?: Maybe<BillingPlansMinFields>;
  stddev?: Maybe<BillingPlansStddevFields>;
  stddevPop?: Maybe<BillingPlansStddevPopFields>;
  stddevSamp?: Maybe<BillingPlansStddevSampFields>;
  sum?: Maybe<BillingPlansSumFields>;
  varPop?: Maybe<BillingPlansVarPopFields>;
  varSamp?: Maybe<BillingPlansVarSampFields>;
  variance?: Maybe<BillingPlansVarianceFields>;
};


/** aggregate fields of "billing_plan" */
export type BillingPlansAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<BillingPlansSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type BillingPlansAvgFields = {
  __typename?: 'billingPlansAvgFields';
  ratePerPayroll?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "billing_plan". All fields are combined with a logical 'AND'. */
export type BillingPlansBoolExp = {
  _and?: InputMaybe<Array<BillingPlansBoolExp>>;
  _not?: InputMaybe<BillingPlansBoolExp>;
  _or?: InputMaybe<Array<BillingPlansBoolExp>>;
  clientBillingAssignments?: InputMaybe<ClientBillingAssignmentsBoolExp>;
  clientBillingAssignmentsAggregate?: InputMaybe<ClientBillingAssignmentsAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  currency?: InputMaybe<StringComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  ratePerPayroll?: InputMaybe<NumericComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "billing_plan" */
export enum BillingPlansConstraint {
  /** unique or primary key constraint on columns "id" */
  billing_plan_pkey = 'billing_plan_pkey'
}

/** input type for incrementing numeric columns in table "billing_plan" */
export type BillingPlansIncInput = {
  ratePerPayroll?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_plan" */
export type BillingPlansInsertInput = {
  clientBillingAssignments?: InputMaybe<ClientBillingAssignmentsArrRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  ratePerPayroll?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type BillingPlansMaxFields = {
  __typename?: 'billingPlansMaxFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  ratePerPayroll?: Maybe<Scalars['numeric']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type BillingPlansMinFields = {
  __typename?: 'billingPlansMinFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  ratePerPayroll?: Maybe<Scalars['numeric']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "billing_plan" */
export type BillingPlansMutationResponse = {
  __typename?: 'billingPlansMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BillingPlans>;
};

/** input type for inserting object relation for remote table "billing_plan" */
export type BillingPlansObjRelInsertInput = {
  data: BillingPlansInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<BillingPlansOnConflict>;
};

/** on_conflict condition type for table "billing_plan" */
export type BillingPlansOnConflict = {
  constraint: BillingPlansConstraint;
  updateColumns?: Array<BillingPlansUpdateColumn>;
  where?: InputMaybe<BillingPlansBoolExp>;
};

/** Ordering options when selecting data from "billing_plan". */
export type BillingPlansOrderBy = {
  clientBillingAssignmentsAggregate?: InputMaybe<ClientBillingAssignmentsAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  ratePerPayroll?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_plan */
export type BillingPlansPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_plan" */
export enum BillingPlansSelectColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  currency = 'currency',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  ratePerPayroll = 'ratePerPayroll',
  /** column name */
  updatedAt = 'updatedAt'
}

/** input type for updating data in table "billing_plan" */
export type BillingPlansSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  ratePerPayroll?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type BillingPlansStddevFields = {
  __typename?: 'billingPlansStddevFields';
  ratePerPayroll?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type BillingPlansStddevPopFields = {
  __typename?: 'billingPlansStddevPopFields';
  ratePerPayroll?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type BillingPlansStddevSampFields = {
  __typename?: 'billingPlansStddevSampFields';
  ratePerPayroll?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "billingPlans" */
export type BillingPlansStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: BillingPlansStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BillingPlansStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  ratePerPayroll?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type BillingPlansSumFields = {
  __typename?: 'billingPlansSumFields';
  ratePerPayroll?: Maybe<Scalars['numeric']['output']>;
};

/** update columns of table "billing_plan" */
export enum BillingPlansUpdateColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  currency = 'currency',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  ratePerPayroll = 'ratePerPayroll',
  /** column name */
  updatedAt = 'updatedAt'
}

export type BillingPlansUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BillingPlansIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingPlansSetInput>;
  /** filter the rows which have to be updated */
  where: BillingPlansBoolExp;
};

/** aggregate varPop on columns */
export type BillingPlansVarPopFields = {
  __typename?: 'billingPlansVarPopFields';
  ratePerPayroll?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type BillingPlansVarSampFields = {
  __typename?: 'billingPlansVarSampFields';
  ratePerPayroll?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type BillingPlansVarianceFields = {
  __typename?: 'billingPlansVarianceFields';
  ratePerPayroll?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "client_billing_assignment" */
export type ClientBillingAssignments = {
  __typename?: 'clientBillingAssignments';
  /** An object relationship */
  assignedBillingPlan: BillingPlans;
  /** An object relationship */
  assignedClient: Clients;
  billingPlanId: Scalars['uuid']['output'];
  clientId: Scalars['uuid']['output'];
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  endDate?: Maybe<Scalars['date']['output']>;
  id: Scalars['uuid']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  startDate: Scalars['date']['output'];
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "client_billing_assignment" */
export type ClientBillingAssignmentsAggregate = {
  __typename?: 'clientBillingAssignmentsAggregate';
  aggregate?: Maybe<ClientBillingAssignmentsAggregateFields>;
  nodes: Array<ClientBillingAssignments>;
};

export type ClientBillingAssignmentsAggregateBoolExp = {
  bool_and?: InputMaybe<ClientBillingAssignmentsAggregateBoolExpBoolAnd>;
  bool_or?: InputMaybe<ClientBillingAssignmentsAggregateBoolExpBoolOr>;
  count?: InputMaybe<ClientBillingAssignmentsAggregateBoolExpCount>;
};

export type ClientBillingAssignmentsAggregateBoolExpBoolAnd = {
  arguments: ClientBillingAssignmentsSelectColumnClientBillingAssignmentsAggregateBoolExpBoolAndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientBillingAssignmentsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ClientBillingAssignmentsAggregateBoolExpBoolOr = {
  arguments: ClientBillingAssignmentsSelectColumnClientBillingAssignmentsAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientBillingAssignmentsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ClientBillingAssignmentsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientBillingAssignmentsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "client_billing_assignment" */
export type ClientBillingAssignmentsAggregateFields = {
  __typename?: 'clientBillingAssignmentsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<ClientBillingAssignmentsMaxFields>;
  min?: Maybe<ClientBillingAssignmentsMinFields>;
};


/** aggregate fields of "client_billing_assignment" */
export type ClientBillingAssignmentsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "client_billing_assignment" */
export type ClientBillingAssignmentsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ClientBillingAssignmentsMaxOrderBy>;
  min?: InputMaybe<ClientBillingAssignmentsMinOrderBy>;
};

/** input type for inserting array relation for remote table "client_billing_assignment" */
export type ClientBillingAssignmentsArrRelInsertInput = {
  data: Array<ClientBillingAssignmentsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<ClientBillingAssignmentsOnConflict>;
};

/** Boolean expression to filter rows from the table "client_billing_assignment". All fields are combined with a logical 'AND'. */
export type ClientBillingAssignmentsBoolExp = {
  _and?: InputMaybe<Array<ClientBillingAssignmentsBoolExp>>;
  _not?: InputMaybe<ClientBillingAssignmentsBoolExp>;
  _or?: InputMaybe<Array<ClientBillingAssignmentsBoolExp>>;
  assignedBillingPlan?: InputMaybe<BillingPlansBoolExp>;
  assignedClient?: InputMaybe<ClientsBoolExp>;
  billingPlanId?: InputMaybe<UuidComparisonExp>;
  clientId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  endDate?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isActive?: InputMaybe<BooleanComparisonExp>;
  startDate?: InputMaybe<DateComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "client_billing_assignment" */
export enum ClientBillingAssignmentsConstraint {
  /** unique or primary key constraint on columns "id" */
  client_billing_assignment_pkey = 'client_billing_assignment_pkey'
}

/** input type for inserting data into table "client_billing_assignment" */
export type ClientBillingAssignmentsInsertInput = {
  assignedBillingPlan?: InputMaybe<BillingPlansObjRelInsertInput>;
  assignedClient?: InputMaybe<ClientsObjRelInsertInput>;
  billingPlanId?: InputMaybe<Scalars['uuid']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  endDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['date']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type ClientBillingAssignmentsMaxFields = {
  __typename?: 'clientBillingAssignmentsMaxFields';
  billingPlanId?: Maybe<Scalars['uuid']['output']>;
  clientId?: Maybe<Scalars['uuid']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  endDate?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  startDate?: Maybe<Scalars['date']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "client_billing_assignment" */
export type ClientBillingAssignmentsMaxOrderBy = {
  billingPlanId?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  endDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  startDate?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type ClientBillingAssignmentsMinFields = {
  __typename?: 'clientBillingAssignmentsMinFields';
  billingPlanId?: Maybe<Scalars['uuid']['output']>;
  clientId?: Maybe<Scalars['uuid']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  endDate?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  startDate?: Maybe<Scalars['date']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "client_billing_assignment" */
export type ClientBillingAssignmentsMinOrderBy = {
  billingPlanId?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  endDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  startDate?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "client_billing_assignment" */
export type ClientBillingAssignmentsMutationResponse = {
  __typename?: 'clientBillingAssignmentsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<ClientBillingAssignments>;
};

/** on_conflict condition type for table "client_billing_assignment" */
export type ClientBillingAssignmentsOnConflict = {
  constraint: ClientBillingAssignmentsConstraint;
  updateColumns?: Array<ClientBillingAssignmentsUpdateColumn>;
  where?: InputMaybe<ClientBillingAssignmentsBoolExp>;
};

/** Ordering options when selecting data from "client_billing_assignment". */
export type ClientBillingAssignmentsOrderBy = {
  assignedBillingPlan?: InputMaybe<BillingPlansOrderBy>;
  assignedClient?: InputMaybe<ClientsOrderBy>;
  billingPlanId?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  endDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  startDate?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: client_billing_assignment */
export type ClientBillingAssignmentsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "client_billing_assignment" */
export enum ClientBillingAssignmentsSelectColumn {
  /** column name */
  billingPlanId = 'billingPlanId',
  /** column name */
  clientId = 'clientId',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  endDate = 'endDate',
  /** column name */
  id = 'id',
  /** column name */
  isActive = 'isActive',
  /** column name */
  startDate = 'startDate',
  /** column name */
  updatedAt = 'updatedAt'
}

/** select "clientBillingAssignmentsAggregateBoolExpBool_andArgumentsColumns" columns of table "client_billing_assignment" */
export enum ClientBillingAssignmentsSelectColumnClientBillingAssignmentsAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  isActive = 'isActive'
}

/** select "clientBillingAssignmentsAggregateBoolExpBool_orArgumentsColumns" columns of table "client_billing_assignment" */
export enum ClientBillingAssignmentsSelectColumnClientBillingAssignmentsAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  isActive = 'isActive'
}

/** input type for updating data in table "client_billing_assignment" */
export type ClientBillingAssignmentsSetInput = {
  billingPlanId?: InputMaybe<Scalars['uuid']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  endDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['date']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "clientBillingAssignments" */
export type ClientBillingAssignmentsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: ClientBillingAssignmentsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ClientBillingAssignmentsStreamCursorValueInput = {
  billingPlanId?: InputMaybe<Scalars['uuid']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  endDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['date']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "client_billing_assignment" */
export enum ClientBillingAssignmentsUpdateColumn {
  /** column name */
  billingPlanId = 'billingPlanId',
  /** column name */
  clientId = 'clientId',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  endDate = 'endDate',
  /** column name */
  id = 'id',
  /** column name */
  isActive = 'isActive',
  /** column name */
  startDate = 'startDate',
  /** column name */
  updatedAt = 'updatedAt'
}

export type ClientBillingAssignmentsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ClientBillingAssignmentsSetInput>;
  /** filter the rows which have to be updated */
  where: ClientBillingAssignmentsBoolExp;
};

/** columns and relationships of "client_external_systems" */
export type ClientExternalSystems = {
  __typename?: 'clientExternalSystems';
  /** Reference to the client */
  clientId: Scalars['uuid']['output'];
  /** Timestamp when the mapping was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Reference to the external system */
  externalSystemId: Scalars['uuid']['output'];
  /** Unique identifier for the client-system mapping */
  id: Scalars['uuid']['output'];
  /** An object relationship */
  linkedClient: Clients;
  /** An object relationship */
  linkedExternalSystem: ExternalSystems;
  /** Client identifier in the external system */
  systemClientId?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the mapping was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "client_external_systems" */
export type ClientExternalSystemsAggregate = {
  __typename?: 'clientExternalSystemsAggregate';
  aggregate?: Maybe<ClientExternalSystemsAggregateFields>;
  nodes: Array<ClientExternalSystems>;
};

export type ClientExternalSystemsAggregateBoolExp = {
  count?: InputMaybe<ClientExternalSystemsAggregateBoolExpCount>;
};

export type ClientExternalSystemsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientExternalSystemsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "client_external_systems" */
export type ClientExternalSystemsAggregateFields = {
  __typename?: 'clientExternalSystemsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<ClientExternalSystemsMaxFields>;
  min?: Maybe<ClientExternalSystemsMinFields>;
};


/** aggregate fields of "client_external_systems" */
export type ClientExternalSystemsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "client_external_systems" */
export type ClientExternalSystemsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ClientExternalSystemsMaxOrderBy>;
  min?: InputMaybe<ClientExternalSystemsMinOrderBy>;
};

/** input type for inserting array relation for remote table "client_external_systems" */
export type ClientExternalSystemsArrRelInsertInput = {
  data: Array<ClientExternalSystemsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<ClientExternalSystemsOnConflict>;
};

/** Boolean expression to filter rows from the table "client_external_systems". All fields are combined with a logical 'AND'. */
export type ClientExternalSystemsBoolExp = {
  _and?: InputMaybe<Array<ClientExternalSystemsBoolExp>>;
  _not?: InputMaybe<ClientExternalSystemsBoolExp>;
  _or?: InputMaybe<Array<ClientExternalSystemsBoolExp>>;
  clientId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  externalSystemId?: InputMaybe<UuidComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  linkedClient?: InputMaybe<ClientsBoolExp>;
  linkedExternalSystem?: InputMaybe<ExternalSystemsBoolExp>;
  systemClientId?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "client_external_systems" */
export enum ClientExternalSystemsConstraint {
  /** unique or primary key constraint on columns "client_id", "system_id" */
  client_external_systems_client_id_system_id_key = 'client_external_systems_client_id_system_id_key',
  /** unique or primary key constraint on columns "id" */
  client_external_systems_pkey = 'client_external_systems_pkey'
}

/** input type for inserting data into table "client_external_systems" */
export type ClientExternalSystemsInsertInput = {
  /** Reference to the client */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the mapping was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Reference to the external system */
  externalSystemId?: InputMaybe<Scalars['uuid']['input']>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<Scalars['uuid']['input']>;
  linkedClient?: InputMaybe<ClientsObjRelInsertInput>;
  linkedExternalSystem?: InputMaybe<ExternalSystemsObjRelInsertInput>;
  /** Client identifier in the external system */
  systemClientId?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the mapping was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type ClientExternalSystemsMaxFields = {
  __typename?: 'clientExternalSystemsMaxFields';
  /** Reference to the client */
  clientId?: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the mapping was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Reference to the external system */
  externalSystemId?: Maybe<Scalars['uuid']['output']>;
  /** Unique identifier for the client-system mapping */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Client identifier in the external system */
  systemClientId?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the mapping was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "client_external_systems" */
export type ClientExternalSystemsMaxOrderBy = {
  /** Reference to the client */
  clientId?: InputMaybe<OrderBy>;
  /** Timestamp when the mapping was created */
  createdAt?: InputMaybe<OrderBy>;
  /** Reference to the external system */
  externalSystemId?: InputMaybe<OrderBy>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<OrderBy>;
  /** Client identifier in the external system */
  systemClientId?: InputMaybe<OrderBy>;
  /** Timestamp when the mapping was last updated */
  updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type ClientExternalSystemsMinFields = {
  __typename?: 'clientExternalSystemsMinFields';
  /** Reference to the client */
  clientId?: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the mapping was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Reference to the external system */
  externalSystemId?: Maybe<Scalars['uuid']['output']>;
  /** Unique identifier for the client-system mapping */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Client identifier in the external system */
  systemClientId?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the mapping was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "client_external_systems" */
export type ClientExternalSystemsMinOrderBy = {
  /** Reference to the client */
  clientId?: InputMaybe<OrderBy>;
  /** Timestamp when the mapping was created */
  createdAt?: InputMaybe<OrderBy>;
  /** Reference to the external system */
  externalSystemId?: InputMaybe<OrderBy>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<OrderBy>;
  /** Client identifier in the external system */
  systemClientId?: InputMaybe<OrderBy>;
  /** Timestamp when the mapping was last updated */
  updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "client_external_systems" */
export type ClientExternalSystemsMutationResponse = {
  __typename?: 'clientExternalSystemsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<ClientExternalSystems>;
};

/** on_conflict condition type for table "client_external_systems" */
export type ClientExternalSystemsOnConflict = {
  constraint: ClientExternalSystemsConstraint;
  updateColumns?: Array<ClientExternalSystemsUpdateColumn>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};

/** Ordering options when selecting data from "client_external_systems". */
export type ClientExternalSystemsOrderBy = {
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  externalSystemId?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  linkedClient?: InputMaybe<ClientsOrderBy>;
  linkedExternalSystem?: InputMaybe<ExternalSystemsOrderBy>;
  systemClientId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: client_external_systems */
export type ClientExternalSystemsPkColumnsInput = {
  /** Unique identifier for the client-system mapping */
  id: Scalars['uuid']['input'];
};

/** select columns of table "client_external_systems" */
export enum ClientExternalSystemsSelectColumn {
  /** column name */
  clientId = 'clientId',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  externalSystemId = 'externalSystemId',
  /** column name */
  id = 'id',
  /** column name */
  systemClientId = 'systemClientId',
  /** column name */
  updatedAt = 'updatedAt'
}

/** input type for updating data in table "client_external_systems" */
export type ClientExternalSystemsSetInput = {
  /** Reference to the client */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the mapping was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Reference to the external system */
  externalSystemId?: InputMaybe<Scalars['uuid']['input']>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Client identifier in the external system */
  systemClientId?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the mapping was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "clientExternalSystems" */
export type ClientExternalSystemsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: ClientExternalSystemsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ClientExternalSystemsStreamCursorValueInput = {
  /** Reference to the client */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the mapping was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Reference to the external system */
  externalSystemId?: InputMaybe<Scalars['uuid']['input']>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Client identifier in the external system */
  systemClientId?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the mapping was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "client_external_systems" */
export enum ClientExternalSystemsUpdateColumn {
  /** column name */
  clientId = 'clientId',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  externalSystemId = 'externalSystemId',
  /** column name */
  id = 'id',
  /** column name */
  systemClientId = 'systemClientId',
  /** column name */
  updatedAt = 'updatedAt'
}

export type ClientExternalSystemsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ClientExternalSystemsSetInput>;
  /** filter the rows which have to be updated */
  where: ClientExternalSystemsBoolExp;
};

/** columns and relationships of "clients" */
export type Clients = {
  __typename?: 'clients';
  /** Whether the client is currently active */
  active?: Maybe<Scalars['Boolean']['output']>;
  /** An array relationship */
  billingAssignments: Array<ClientBillingAssignments>;
  /** An aggregate relationship */
  billingAssignmentsAggregate: ClientBillingAssignmentsAggregate;
  /** An aggregate relationship */
  billingInvoicesAggregate: BillingInvoiceAggregate;
  /** An array relationship */
  billing_invoices: Array<BillingInvoice>;
  /** Email address for the client contact */
  contactEmail?: Maybe<Scalars['String']['output']>;
  /** Primary contact person at the client */
  contactPerson?: Maybe<Scalars['String']['output']>;
  /** Phone number for the client contact */
  contactPhone?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the client was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** An array relationship */
  externalSystems: Array<ClientExternalSystems>;
  /** An aggregate relationship */
  externalSystemsAggregate: ClientExternalSystemsAggregate;
  /** Unique identifier for the client */
  id: Scalars['uuid']['output'];
  /** Client company name */
  name: Scalars['String']['output'];
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrollsAggregate: PayrollsAggregate;
  /** Timestamp when the client was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "clients" */
export type ClientsBillingAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsBillingAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsBillingInvoicesAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsBillingInvoicesArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsExternalSystemsArgs = {
  distinctOn?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsExternalSystemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsPayrollsArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** aggregated selection of "clients" */
export type ClientsAggregate = {
  __typename?: 'clientsAggregate';
  aggregate?: Maybe<ClientsAggregateFields>;
  nodes: Array<Clients>;
};

export type ClientsAggregateBoolExp = {
  bool_and?: InputMaybe<ClientsAggregateBoolExpBoolAnd>;
  bool_or?: InputMaybe<ClientsAggregateBoolExpBoolOr>;
  count?: InputMaybe<ClientsAggregateBoolExpCount>;
};

export type ClientsAggregateBoolExpBoolAnd = {
  arguments: ClientsSelectColumnClientsAggregateBoolExpBoolAndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ClientsAggregateBoolExpBoolOr = {
  arguments: ClientsSelectColumnClientsAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ClientsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<ClientsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "clients" */
export type ClientsAggregateFields = {
  __typename?: 'clientsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<ClientsMaxFields>;
  min?: Maybe<ClientsMinFields>;
};


/** aggregate fields of "clients" */
export type ClientsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ClientsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "clients" */
export type ClientsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ClientsMaxOrderBy>;
  min?: InputMaybe<ClientsMinOrderBy>;
};

/** input type for inserting array relation for remote table "clients" */
export type ClientsArrRelInsertInput = {
  data: Array<ClientsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<ClientsOnConflict>;
};

/** Boolean expression to filter rows from the table "clients". All fields are combined with a logical 'AND'. */
export type ClientsBoolExp = {
  _and?: InputMaybe<Array<ClientsBoolExp>>;
  _not?: InputMaybe<ClientsBoolExp>;
  _or?: InputMaybe<Array<ClientsBoolExp>>;
  active?: InputMaybe<BooleanComparisonExp>;
  billingAssignments?: InputMaybe<ClientBillingAssignmentsBoolExp>;
  billingAssignmentsAggregate?: InputMaybe<ClientBillingAssignmentsAggregateBoolExp>;
  billing_invoices?: InputMaybe<BillingInvoiceBoolExp>;
  billing_invoicesAggregate?: InputMaybe<BillingInvoiceAggregateBoolExp>;
  contactEmail?: InputMaybe<StringComparisonExp>;
  contactPerson?: InputMaybe<StringComparisonExp>;
  contactPhone?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  externalSystems?: InputMaybe<ClientExternalSystemsBoolExp>;
  externalSystemsAggregate?: InputMaybe<ClientExternalSystemsAggregateBoolExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  payrolls?: InputMaybe<PayrollsBoolExp>;
  payrollsAggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "clients" */
export enum ClientsConstraint {
  /** unique or primary key constraint on columns "id" */
  clients_pkey = 'clients_pkey'
}

/** input type for inserting data into table "clients" */
export type ClientsInsertInput = {
  /** Whether the client is currently active */
  active?: InputMaybe<Scalars['Boolean']['input']>;
  billingAssignments?: InputMaybe<ClientBillingAssignmentsArrRelInsertInput>;
  billing_invoices?: InputMaybe<BillingInvoiceArrRelInsertInput>;
  /** Email address for the client contact */
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  /** Primary contact person at the client */
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  /** Phone number for the client contact */
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the client was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  externalSystems?: InputMaybe<ClientExternalSystemsArrRelInsertInput>;
  /** Unique identifier for the client */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Client company name */
  name?: InputMaybe<Scalars['String']['input']>;
  payrolls?: InputMaybe<PayrollsArrRelInsertInput>;
  /** Timestamp when the client was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type ClientsMaxFields = {
  __typename?: 'clientsMaxFields';
  /** Email address for the client contact */
  contactEmail?: Maybe<Scalars['String']['output']>;
  /** Primary contact person at the client */
  contactPerson?: Maybe<Scalars['String']['output']>;
  /** Phone number for the client contact */
  contactPhone?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the client was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the client */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Client company name */
  name?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the client was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "clients" */
export type ClientsMaxOrderBy = {
  /** Email address for the client contact */
  contactEmail?: InputMaybe<OrderBy>;
  /** Primary contact person at the client */
  contactPerson?: InputMaybe<OrderBy>;
  /** Phone number for the client contact */
  contactPhone?: InputMaybe<OrderBy>;
  /** Timestamp when the client was created */
  createdAt?: InputMaybe<OrderBy>;
  /** Unique identifier for the client */
  id?: InputMaybe<OrderBy>;
  /** Client company name */
  name?: InputMaybe<OrderBy>;
  /** Timestamp when the client was last updated */
  updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type ClientsMinFields = {
  __typename?: 'clientsMinFields';
  /** Email address for the client contact */
  contactEmail?: Maybe<Scalars['String']['output']>;
  /** Primary contact person at the client */
  contactPerson?: Maybe<Scalars['String']['output']>;
  /** Phone number for the client contact */
  contactPhone?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the client was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the client */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Client company name */
  name?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the client was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "clients" */
export type ClientsMinOrderBy = {
  /** Email address for the client contact */
  contactEmail?: InputMaybe<OrderBy>;
  /** Primary contact person at the client */
  contactPerson?: InputMaybe<OrderBy>;
  /** Phone number for the client contact */
  contactPhone?: InputMaybe<OrderBy>;
  /** Timestamp when the client was created */
  createdAt?: InputMaybe<OrderBy>;
  /** Unique identifier for the client */
  id?: InputMaybe<OrderBy>;
  /** Client company name */
  name?: InputMaybe<OrderBy>;
  /** Timestamp when the client was last updated */
  updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "clients" */
export type ClientsMutationResponse = {
  __typename?: 'clientsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Clients>;
};

/** input type for inserting object relation for remote table "clients" */
export type ClientsObjRelInsertInput = {
  data: ClientsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<ClientsOnConflict>;
};

/** on_conflict condition type for table "clients" */
export type ClientsOnConflict = {
  constraint: ClientsConstraint;
  updateColumns?: Array<ClientsUpdateColumn>;
  where?: InputMaybe<ClientsBoolExp>;
};

/** Ordering options when selecting data from "clients". */
export type ClientsOrderBy = {
  active?: InputMaybe<OrderBy>;
  billingAssignmentsAggregate?: InputMaybe<ClientBillingAssignmentsAggregateOrderBy>;
  billing_invoicesAggregate?: InputMaybe<BillingInvoiceAggregateOrderBy>;
  contactEmail?: InputMaybe<OrderBy>;
  contactPerson?: InputMaybe<OrderBy>;
  contactPhone?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  externalSystemsAggregate?: InputMaybe<ClientExternalSystemsAggregateOrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrollsAggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: clients */
export type ClientsPkColumnsInput = {
  /** Unique identifier for the client */
  id: Scalars['uuid']['input'];
};

/** select columns of table "clients" */
export enum ClientsSelectColumn {
  /** column name */
  active = 'active',
  /** column name */
  contactEmail = 'contactEmail',
  /** column name */
  contactPerson = 'contactPerson',
  /** column name */
  contactPhone = 'contactPhone',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updatedAt = 'updatedAt'
}

/** select "clientsAggregateBoolExpBool_andArgumentsColumns" columns of table "clients" */
export enum ClientsSelectColumnClientsAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  active = 'active'
}

/** select "clientsAggregateBoolExpBool_orArgumentsColumns" columns of table "clients" */
export enum ClientsSelectColumnClientsAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  active = 'active'
}

/** input type for updating data in table "clients" */
export type ClientsSetInput = {
  /** Whether the client is currently active */
  active?: InputMaybe<Scalars['Boolean']['input']>;
  /** Email address for the client contact */
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  /** Primary contact person at the client */
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  /** Phone number for the client contact */
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the client was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Unique identifier for the client */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Client company name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the client was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "clients" */
export type ClientsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: ClientsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ClientsStreamCursorValueInput = {
  /** Whether the client is currently active */
  active?: InputMaybe<Scalars['Boolean']['input']>;
  /** Email address for the client contact */
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  /** Primary contact person at the client */
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  /** Phone number for the client contact */
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the client was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Unique identifier for the client */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Client company name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the client was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "clients" */
export enum ClientsUpdateColumn {
  /** column name */
  active = 'active',
  /** column name */
  contactEmail = 'contactEmail',
  /** column name */
  contactPerson = 'contactPerson',
  /** column name */
  contactPhone = 'contactPhone',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updatedAt = 'updatedAt'
}

export type ClientsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ClientsSetInput>;
  /** filter the rows which have to be updated */
  where: ClientsBoolExp;
};

export type CreatePayrollVersionArgs = {
  p_created_by_user_id?: InputMaybe<Scalars['uuid']['input']>;
  p_go_live_date?: InputMaybe<Scalars['date']['input']>;
  p_new_backup_consultant_user_id?: InputMaybe<Scalars['uuid']['input']>;
  p_new_client_id?: InputMaybe<Scalars['uuid']['input']>;
  p_new_cycle_id?: InputMaybe<Scalars['uuid']['input']>;
  p_new_date_type_id?: InputMaybe<Scalars['uuid']['input']>;
  p_new_date_value?: InputMaybe<Scalars['Int']['input']>;
  p_new_manager_user_id?: InputMaybe<Scalars['uuid']['input']>;
  p_new_name?: InputMaybe<Scalars['String']['input']>;
  p_new_primary_consultant_user_id?: InputMaybe<Scalars['uuid']['input']>;
  p_original_payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  p_version_reason?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePayrollVersionSimpleArgs = {
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  version_reason?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "current_payrolls" */
export type CurrentPayrolls = {
  __typename?: 'currentPayrolls';
  backupConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  clientId?: Maybe<Scalars['uuid']['output']>;
  clientName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  cycleId?: Maybe<Scalars['uuid']['output']>;
  dateTypeId?: Maybe<Scalars['uuid']['output']>;
  dateValue?: Maybe<Scalars['Int']['output']>;
  goLiveDate?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  managerUserId?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parentPayrollId?: Maybe<Scalars['uuid']['output']>;
  payrollCycleName?: Maybe<Scalars['payroll_cycle_type']['output']>;
  payrollDateTypeName?: Maybe<Scalars['payroll_date_type']['output']>;
  primaryConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  supersededDate?: Maybe<Scalars['date']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
  versionReason?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "current_payrolls" */
export type CurrentPayrollsAggregate = {
  __typename?: 'currentPayrollsAggregate';
  aggregate?: Maybe<CurrentPayrollsAggregateFields>;
  nodes: Array<CurrentPayrolls>;
};

/** aggregate fields of "current_payrolls" */
export type CurrentPayrollsAggregateFields = {
  __typename?: 'currentPayrollsAggregateFields';
  avg?: Maybe<CurrentPayrollsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<CurrentPayrollsMaxFields>;
  min?: Maybe<CurrentPayrollsMinFields>;
  stddev?: Maybe<CurrentPayrollsStddevFields>;
  stddevPop?: Maybe<CurrentPayrollsStddevPopFields>;
  stddevSamp?: Maybe<CurrentPayrollsStddevSampFields>;
  sum?: Maybe<CurrentPayrollsSumFields>;
  varPop?: Maybe<CurrentPayrollsVarPopFields>;
  varSamp?: Maybe<CurrentPayrollsVarSampFields>;
  variance?: Maybe<CurrentPayrollsVarianceFields>;
};


/** aggregate fields of "current_payrolls" */
export type CurrentPayrollsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type CurrentPayrollsAvgFields = {
  __typename?: 'currentPayrollsAvgFields';
  dateValue?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "current_payrolls". All fields are combined with a logical 'AND'. */
export type CurrentPayrollsBoolExp = {
  _and?: InputMaybe<Array<CurrentPayrollsBoolExp>>;
  _not?: InputMaybe<CurrentPayrollsBoolExp>;
  _or?: InputMaybe<Array<CurrentPayrollsBoolExp>>;
  backupConsultantUserId?: InputMaybe<UuidComparisonExp>;
  clientId?: InputMaybe<UuidComparisonExp>;
  clientName?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  cycleId?: InputMaybe<UuidComparisonExp>;
  dateTypeId?: InputMaybe<UuidComparisonExp>;
  dateValue?: InputMaybe<IntComparisonExp>;
  goLiveDate?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  managerUserId?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  parentPayrollId?: InputMaybe<UuidComparisonExp>;
  payrollCycleName?: InputMaybe<PayrollCycleTypeComparisonExp>;
  payrollDateTypeName?: InputMaybe<PayrollDateTypeComparisonExp>;
  primaryConsultantUserId?: InputMaybe<UuidComparisonExp>;
  supersededDate?: InputMaybe<DateComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  versionNumber?: InputMaybe<IntComparisonExp>;
  versionReason?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type CurrentPayrollsMaxFields = {
  __typename?: 'currentPayrollsMaxFields';
  backupConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  clientId?: Maybe<Scalars['uuid']['output']>;
  clientName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  cycleId?: Maybe<Scalars['uuid']['output']>;
  dateTypeId?: Maybe<Scalars['uuid']['output']>;
  dateValue?: Maybe<Scalars['Int']['output']>;
  goLiveDate?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  managerUserId?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parentPayrollId?: Maybe<Scalars['uuid']['output']>;
  payrollCycleName?: Maybe<Scalars['payroll_cycle_type']['output']>;
  payrollDateTypeName?: Maybe<Scalars['payroll_date_type']['output']>;
  primaryConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  supersededDate?: Maybe<Scalars['date']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
  versionReason?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type CurrentPayrollsMinFields = {
  __typename?: 'currentPayrollsMinFields';
  backupConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  clientId?: Maybe<Scalars['uuid']['output']>;
  clientName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  cycleId?: Maybe<Scalars['uuid']['output']>;
  dateTypeId?: Maybe<Scalars['uuid']['output']>;
  dateValue?: Maybe<Scalars['Int']['output']>;
  goLiveDate?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  managerUserId?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parentPayrollId?: Maybe<Scalars['uuid']['output']>;
  payrollCycleName?: Maybe<Scalars['payroll_cycle_type']['output']>;
  payrollDateTypeName?: Maybe<Scalars['payroll_date_type']['output']>;
  primaryConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  supersededDate?: Maybe<Scalars['date']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
  versionReason?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "current_payrolls". */
export type CurrentPayrollsOrderBy = {
  backupConsultantUserId?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  clientName?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  cycleId?: InputMaybe<OrderBy>;
  dateTypeId?: InputMaybe<OrderBy>;
  dateValue?: InputMaybe<OrderBy>;
  goLiveDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  managerUserId?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  parentPayrollId?: InputMaybe<OrderBy>;
  payrollCycleName?: InputMaybe<OrderBy>;
  payrollDateTypeName?: InputMaybe<OrderBy>;
  primaryConsultantUserId?: InputMaybe<OrderBy>;
  supersededDate?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
  versionReason?: InputMaybe<OrderBy>;
};

/** select columns of table "current_payrolls" */
export enum CurrentPayrollsSelectColumn {
  /** column name */
  backupConsultantUserId = 'backupConsultantUserId',
  /** column name */
  clientId = 'clientId',
  /** column name */
  clientName = 'clientName',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  cycleId = 'cycleId',
  /** column name */
  dateTypeId = 'dateTypeId',
  /** column name */
  dateValue = 'dateValue',
  /** column name */
  goLiveDate = 'goLiveDate',
  /** column name */
  id = 'id',
  /** column name */
  managerUserId = 'managerUserId',
  /** column name */
  name = 'name',
  /** column name */
  parentPayrollId = 'parentPayrollId',
  /** column name */
  payrollCycleName = 'payrollCycleName',
  /** column name */
  payrollDateTypeName = 'payrollDateTypeName',
  /** column name */
  primaryConsultantUserId = 'primaryConsultantUserId',
  /** column name */
  supersededDate = 'supersededDate',
  /** column name */
  updatedAt = 'updatedAt',
  /** column name */
  versionNumber = 'versionNumber',
  /** column name */
  versionReason = 'versionReason'
}

/** aggregate stddev on columns */
export type CurrentPayrollsStddevFields = {
  __typename?: 'currentPayrollsStddevFields';
  dateValue?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type CurrentPayrollsStddevPopFields = {
  __typename?: 'currentPayrollsStddevPopFields';
  dateValue?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type CurrentPayrollsStddevSampFields = {
  __typename?: 'currentPayrollsStddevSampFields';
  dateValue?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "currentPayrolls" */
export type CurrentPayrollsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: CurrentPayrollsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentPayrollsStreamCursorValueInput = {
  backupConsultantUserId?: InputMaybe<Scalars['uuid']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  clientName?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  cycleId?: InputMaybe<Scalars['uuid']['input']>;
  dateTypeId?: InputMaybe<Scalars['uuid']['input']>;
  dateValue?: InputMaybe<Scalars['Int']['input']>;
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  managerUserId?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentPayrollId?: InputMaybe<Scalars['uuid']['input']>;
  payrollCycleName?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  payrollDateTypeName?: InputMaybe<Scalars['payroll_date_type']['input']>;
  primaryConsultantUserId?: InputMaybe<Scalars['uuid']['input']>;
  supersededDate?: InputMaybe<Scalars['date']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
  versionReason?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type CurrentPayrollsSumFields = {
  __typename?: 'currentPayrollsSumFields';
  dateValue?: Maybe<Scalars['Int']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
};

/** aggregate varPop on columns */
export type CurrentPayrollsVarPopFields = {
  __typename?: 'currentPayrollsVarPopFields';
  dateValue?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type CurrentPayrollsVarSampFields = {
  __typename?: 'currentPayrollsVarSampFields';
  dateValue?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type CurrentPayrollsVarianceFields = {
  __typename?: 'currentPayrollsVarianceFields';
  dateValue?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "audit.data_access_log" */
export type DataAccessLogs = {
  __typename?: 'dataAccessLogs';
  accessType: Scalars['String']['output'];
  accessedAt: Scalars['timestamptz']['output'];
  dataClassification?: Maybe<Scalars['String']['output']>;
  fieldsAccessed?: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['uuid']['output'];
  ipAddress?: Maybe<Scalars['inet']['output']>;
  metadata?: Maybe<Scalars['jsonb']['output']>;
  queryExecuted?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['String']['output']>;
  resourceType: Scalars['String']['output'];
  rowCount?: Maybe<Scalars['Int']['output']>;
  sessionId?: Maybe<Scalars['String']['output']>;
  userId: Scalars['uuid']['output'];
};


/** columns and relationships of "audit.data_access_log" */
export type DataAccessLogsMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit.data_access_log" */
export type DataAccessLogsAggregate = {
  __typename?: 'dataAccessLogsAggregate';
  aggregate?: Maybe<DataAccessLogsAggregateFields>;
  nodes: Array<DataAccessLogs>;
};

/** aggregate fields of "audit.data_access_log" */
export type DataAccessLogsAggregateFields = {
  __typename?: 'dataAccessLogsAggregateFields';
  avg?: Maybe<DataAccessLogsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<DataAccessLogsMaxFields>;
  min?: Maybe<DataAccessLogsMinFields>;
  stddev?: Maybe<DataAccessLogsStddevFields>;
  stddevPop?: Maybe<DataAccessLogsStddevPopFields>;
  stddevSamp?: Maybe<DataAccessLogsStddevSampFields>;
  sum?: Maybe<DataAccessLogsSumFields>;
  varPop?: Maybe<DataAccessLogsVarPopFields>;
  varSamp?: Maybe<DataAccessLogsVarSampFields>;
  variance?: Maybe<DataAccessLogsVarianceFields>;
};


/** aggregate fields of "audit.data_access_log" */
export type DataAccessLogsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<DataAccessLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type DataAccessLogsAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type DataAccessLogsAvgFields = {
  __typename?: 'dataAccessLogsAvgFields';
  rowCount?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "audit.data_access_log". All fields are combined with a logical 'AND'. */
export type DataAccessLogsBoolExp = {
  _and?: InputMaybe<Array<DataAccessLogsBoolExp>>;
  _not?: InputMaybe<DataAccessLogsBoolExp>;
  _or?: InputMaybe<Array<DataAccessLogsBoolExp>>;
  accessType?: InputMaybe<StringComparisonExp>;
  accessedAt?: InputMaybe<TimestamptzComparisonExp>;
  dataClassification?: InputMaybe<StringComparisonExp>;
  fieldsAccessed?: InputMaybe<StringArrayComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  ipAddress?: InputMaybe<InetComparisonExp>;
  metadata?: InputMaybe<JsonbComparisonExp>;
  queryExecuted?: InputMaybe<StringComparisonExp>;
  resourceId?: InputMaybe<StringComparisonExp>;
  resourceType?: InputMaybe<StringComparisonExp>;
  rowCount?: InputMaybe<IntComparisonExp>;
  sessionId?: InputMaybe<StringComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "audit.data_access_log" */
export enum DataAccessLogsConstraint {
  /** unique or primary key constraint on columns "id" */
  data_access_log_pkey = 'data_access_log_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type DataAccessLogsDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type DataAccessLogsDeleteElemInput = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type DataAccessLogsDeleteKeyInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "audit.data_access_log" */
export type DataAccessLogsIncInput = {
  rowCount?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "audit.data_access_log" */
export type DataAccessLogsInsertInput = {
  accessType?: InputMaybe<Scalars['String']['input']>;
  accessedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  dataClassification?: InputMaybe<Scalars['String']['input']>;
  fieldsAccessed?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  queryExecuted?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  resourceType?: InputMaybe<Scalars['String']['input']>;
  rowCount?: InputMaybe<Scalars['Int']['input']>;
  sessionId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type DataAccessLogsMaxFields = {
  __typename?: 'dataAccessLogsMaxFields';
  accessType?: Maybe<Scalars['String']['output']>;
  accessedAt?: Maybe<Scalars['timestamptz']['output']>;
  dataClassification?: Maybe<Scalars['String']['output']>;
  fieldsAccessed?: Maybe<Array<Scalars['String']['output']>>;
  id?: Maybe<Scalars['uuid']['output']>;
  queryExecuted?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['String']['output']>;
  resourceType?: Maybe<Scalars['String']['output']>;
  rowCount?: Maybe<Scalars['Int']['output']>;
  sessionId?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type DataAccessLogsMinFields = {
  __typename?: 'dataAccessLogsMinFields';
  accessType?: Maybe<Scalars['String']['output']>;
  accessedAt?: Maybe<Scalars['timestamptz']['output']>;
  dataClassification?: Maybe<Scalars['String']['output']>;
  fieldsAccessed?: Maybe<Array<Scalars['String']['output']>>;
  id?: Maybe<Scalars['uuid']['output']>;
  queryExecuted?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['String']['output']>;
  resourceType?: Maybe<Scalars['String']['output']>;
  rowCount?: Maybe<Scalars['Int']['output']>;
  sessionId?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "audit.data_access_log" */
export type DataAccessLogsMutationResponse = {
  __typename?: 'dataAccessLogsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<DataAccessLogs>;
};

/** on_conflict condition type for table "audit.data_access_log" */
export type DataAccessLogsOnConflict = {
  constraint: DataAccessLogsConstraint;
  updateColumns?: Array<DataAccessLogsUpdateColumn>;
  where?: InputMaybe<DataAccessLogsBoolExp>;
};

/** Ordering options when selecting data from "audit.data_access_log". */
export type DataAccessLogsOrderBy = {
  accessType?: InputMaybe<OrderBy>;
  accessedAt?: InputMaybe<OrderBy>;
  dataClassification?: InputMaybe<OrderBy>;
  fieldsAccessed?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  ipAddress?: InputMaybe<OrderBy>;
  metadata?: InputMaybe<OrderBy>;
  queryExecuted?: InputMaybe<OrderBy>;
  resourceId?: InputMaybe<OrderBy>;
  resourceType?: InputMaybe<OrderBy>;
  rowCount?: InputMaybe<OrderBy>;
  sessionId?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: audit.data_access_log */
export type DataAccessLogsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type DataAccessLogsPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit.data_access_log" */
export enum DataAccessLogsSelectColumn {
  /** column name */
  accessType = 'accessType',
  /** column name */
  accessedAt = 'accessedAt',
  /** column name */
  dataClassification = 'dataClassification',
  /** column name */
  fieldsAccessed = 'fieldsAccessed',
  /** column name */
  id = 'id',
  /** column name */
  ipAddress = 'ipAddress',
  /** column name */
  metadata = 'metadata',
  /** column name */
  queryExecuted = 'queryExecuted',
  /** column name */
  resourceId = 'resourceId',
  /** column name */
  resourceType = 'resourceType',
  /** column name */
  rowCount = 'rowCount',
  /** column name */
  sessionId = 'sessionId',
  /** column name */
  userId = 'userId'
}

/** input type for updating data in table "audit.data_access_log" */
export type DataAccessLogsSetInput = {
  accessType?: InputMaybe<Scalars['String']['input']>;
  accessedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  dataClassification?: InputMaybe<Scalars['String']['input']>;
  fieldsAccessed?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  queryExecuted?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  resourceType?: InputMaybe<Scalars['String']['input']>;
  rowCount?: InputMaybe<Scalars['Int']['input']>;
  sessionId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type DataAccessLogsStddevFields = {
  __typename?: 'dataAccessLogsStddevFields';
  rowCount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type DataAccessLogsStddevPopFields = {
  __typename?: 'dataAccessLogsStddevPopFields';
  rowCount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type DataAccessLogsStddevSampFields = {
  __typename?: 'dataAccessLogsStddevSampFields';
  rowCount?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "dataAccessLogs" */
export type DataAccessLogsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: DataAccessLogsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type DataAccessLogsStreamCursorValueInput = {
  accessType?: InputMaybe<Scalars['String']['input']>;
  accessedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  dataClassification?: InputMaybe<Scalars['String']['input']>;
  fieldsAccessed?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  queryExecuted?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  resourceType?: InputMaybe<Scalars['String']['input']>;
  rowCount?: InputMaybe<Scalars['Int']['input']>;
  sessionId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type DataAccessLogsSumFields = {
  __typename?: 'dataAccessLogsSumFields';
  rowCount?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "audit.data_access_log" */
export enum DataAccessLogsUpdateColumn {
  /** column name */
  accessType = 'accessType',
  /** column name */
  accessedAt = 'accessedAt',
  /** column name */
  dataClassification = 'dataClassification',
  /** column name */
  fieldsAccessed = 'fieldsAccessed',
  /** column name */
  id = 'id',
  /** column name */
  ipAddress = 'ipAddress',
  /** column name */
  metadata = 'metadata',
  /** column name */
  queryExecuted = 'queryExecuted',
  /** column name */
  resourceId = 'resourceId',
  /** column name */
  resourceType = 'resourceType',
  /** column name */
  rowCount = 'rowCount',
  /** column name */
  sessionId = 'sessionId',
  /** column name */
  userId = 'userId'
}

export type DataAccessLogsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<DataAccessLogsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<DataAccessLogsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<DataAccessLogsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<DataAccessLogsDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<DataAccessLogsIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<DataAccessLogsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<DataAccessLogsSetInput>;
  /** filter the rows which have to be updated */
  where: DataAccessLogsBoolExp;
};

/** aggregate varPop on columns */
export type DataAccessLogsVarPopFields = {
  __typename?: 'dataAccessLogsVarPopFields';
  rowCount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type DataAccessLogsVarSampFields = {
  __typename?: 'dataAccessLogsVarSampFields';
  rowCount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type DataAccessLogsVarianceFields = {
  __typename?: 'dataAccessLogsVarianceFields';
  rowCount?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "external_systems" */
export type ExternalSystems = {
  __typename?: 'externalSystems';
  /** An array relationship */
  clientExternalSystems: Array<ClientExternalSystems>;
  /** An aggregate relationship */
  clientExternalSystemsAggregate: ClientExternalSystemsAggregate;
  /** Timestamp when the system was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Description of the external system and its purpose */
  description?: Maybe<Scalars['String']['output']>;
  /** Path or reference to the system icon */
  icon?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the external system */
  id: Scalars['uuid']['output'];
  /** Name of the external system */
  name: Scalars['String']['output'];
  /** Timestamp when the system was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** URL endpoint for the external system */
  url: Scalars['String']['output'];
};


/** columns and relationships of "external_systems" */
export type ExternalSystemsClientExternalSystemsArgs = {
  distinctOn?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


/** columns and relationships of "external_systems" */
export type ExternalSystemsClientExternalSystemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};

/** aggregated selection of "external_systems" */
export type ExternalSystemsAggregate = {
  __typename?: 'externalSystemsAggregate';
  aggregate?: Maybe<ExternalSystemsAggregateFields>;
  nodes: Array<ExternalSystems>;
};

/** aggregate fields of "external_systems" */
export type ExternalSystemsAggregateFields = {
  __typename?: 'externalSystemsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<ExternalSystemsMaxFields>;
  min?: Maybe<ExternalSystemsMinFields>;
};


/** aggregate fields of "external_systems" */
export type ExternalSystemsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "external_systems". All fields are combined with a logical 'AND'. */
export type ExternalSystemsBoolExp = {
  _and?: InputMaybe<Array<ExternalSystemsBoolExp>>;
  _not?: InputMaybe<ExternalSystemsBoolExp>;
  _or?: InputMaybe<Array<ExternalSystemsBoolExp>>;
  clientExternalSystems?: InputMaybe<ClientExternalSystemsBoolExp>;
  clientExternalSystemsAggregate?: InputMaybe<ClientExternalSystemsAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  icon?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  url?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "external_systems" */
export enum ExternalSystemsConstraint {
  /** unique or primary key constraint on columns "id" */
  external_systems_pkey = 'external_systems_pkey'
}

/** input type for inserting data into table "external_systems" */
export type ExternalSystemsInsertInput = {
  clientExternalSystems?: InputMaybe<ClientExternalSystemsArrRelInsertInput>;
  /** Timestamp when the system was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Description of the external system and its purpose */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Path or reference to the system icon */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the external system */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the external system */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the system was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** URL endpoint for the external system */
  url?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type ExternalSystemsMaxFields = {
  __typename?: 'externalSystemsMaxFields';
  /** Timestamp when the system was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Description of the external system and its purpose */
  description?: Maybe<Scalars['String']['output']>;
  /** Path or reference to the system icon */
  icon?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the external system */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Name of the external system */
  name?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the system was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** URL endpoint for the external system */
  url?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type ExternalSystemsMinFields = {
  __typename?: 'externalSystemsMinFields';
  /** Timestamp when the system was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Description of the external system and its purpose */
  description?: Maybe<Scalars['String']['output']>;
  /** Path or reference to the system icon */
  icon?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the external system */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Name of the external system */
  name?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the system was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** URL endpoint for the external system */
  url?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "external_systems" */
export type ExternalSystemsMutationResponse = {
  __typename?: 'externalSystemsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<ExternalSystems>;
};

/** input type for inserting object relation for remote table "external_systems" */
export type ExternalSystemsObjRelInsertInput = {
  data: ExternalSystemsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<ExternalSystemsOnConflict>;
};

/** on_conflict condition type for table "external_systems" */
export type ExternalSystemsOnConflict = {
  constraint: ExternalSystemsConstraint;
  updateColumns?: Array<ExternalSystemsUpdateColumn>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};

/** Ordering options when selecting data from "external_systems". */
export type ExternalSystemsOrderBy = {
  clientExternalSystemsAggregate?: InputMaybe<ClientExternalSystemsAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  icon?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  url?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: external_systems */
export type ExternalSystemsPkColumnsInput = {
  /** Unique identifier for the external system */
  id: Scalars['uuid']['input'];
};

/** select columns of table "external_systems" */
export enum ExternalSystemsSelectColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  description = 'description',
  /** column name */
  icon = 'icon',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updatedAt = 'updatedAt',
  /** column name */
  url = 'url'
}

/** input type for updating data in table "external_systems" */
export type ExternalSystemsSetInput = {
  /** Timestamp when the system was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Description of the external system and its purpose */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Path or reference to the system icon */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the external system */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the external system */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the system was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** URL endpoint for the external system */
  url?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "externalSystems" */
export type ExternalSystemsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: ExternalSystemsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ExternalSystemsStreamCursorValueInput = {
  /** Timestamp when the system was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Description of the external system and its purpose */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Path or reference to the system icon */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the external system */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the external system */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the system was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** URL endpoint for the external system */
  url?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "external_systems" */
export enum ExternalSystemsUpdateColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  description = 'description',
  /** column name */
  icon = 'icon',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updatedAt = 'updatedAt',
  /** column name */
  url = 'url'
}

export type ExternalSystemsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ExternalSystemsSetInput>;
  /** filter the rows which have to be updated */
  where: ExternalSystemsBoolExp;
};

/** columns and relationships of "feature_flags" */
export type FeatureFlags = {
  __typename?: 'featureFlags';
  /** JSON array of roles that can access this feature */
  allowedRoles: Scalars['jsonb']['output'];
  /** Name of the feature controlled by this flag */
  featureName: Scalars['String']['output'];
  /** Unique identifier for the feature flag */
  id: Scalars['uuid']['output'];
  /** Whether the feature is currently enabled */
  isEnabled?: Maybe<Scalars['Boolean']['output']>;
  /** Timestamp when the feature flag was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "feature_flags" */
export type FeatureFlagsAllowedRolesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "feature_flags" */
export type FeatureFlagsAggregate = {
  __typename?: 'featureFlagsAggregate';
  aggregate?: Maybe<FeatureFlagsAggregateFields>;
  nodes: Array<FeatureFlags>;
};

/** aggregate fields of "feature_flags" */
export type FeatureFlagsAggregateFields = {
  __typename?: 'featureFlagsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<FeatureFlagsMaxFields>;
  min?: Maybe<FeatureFlagsMinFields>;
};


/** aggregate fields of "feature_flags" */
export type FeatureFlagsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type FeatureFlagsAppendInput = {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "feature_flags". All fields are combined with a logical 'AND'. */
export type FeatureFlagsBoolExp = {
  _and?: InputMaybe<Array<FeatureFlagsBoolExp>>;
  _not?: InputMaybe<FeatureFlagsBoolExp>;
  _or?: InputMaybe<Array<FeatureFlagsBoolExp>>;
  allowedRoles?: InputMaybe<JsonbComparisonExp>;
  featureName?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isEnabled?: InputMaybe<BooleanComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "feature_flags" */
export enum FeatureFlagsConstraint {
  /** unique or primary key constraint on columns "feature_name" */
  feature_flags_feature_name_key = 'feature_flags_feature_name_key',
  /** unique or primary key constraint on columns "id" */
  feature_flags_pkey = 'feature_flags_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type FeatureFlagsDeleteAtPathInput = {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type FeatureFlagsDeleteElemInput = {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type FeatureFlagsDeleteKeyInput = {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "feature_flags" */
export type FeatureFlagsInsertInput = {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Scalars['jsonb']['input']>;
  /** Name of the feature controlled by this flag */
  featureName?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the feature flag */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the feature is currently enabled */
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Timestamp when the feature flag was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type FeatureFlagsMaxFields = {
  __typename?: 'featureFlagsMaxFields';
  /** Name of the feature controlled by this flag */
  featureName?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the feature flag */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the feature flag was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type FeatureFlagsMinFields = {
  __typename?: 'featureFlagsMinFields';
  /** Name of the feature controlled by this flag */
  featureName?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the feature flag */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the feature flag was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "feature_flags" */
export type FeatureFlagsMutationResponse = {
  __typename?: 'featureFlagsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<FeatureFlags>;
};

/** on_conflict condition type for table "feature_flags" */
export type FeatureFlagsOnConflict = {
  constraint: FeatureFlagsConstraint;
  updateColumns?: Array<FeatureFlagsUpdateColumn>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};

/** Ordering options when selecting data from "feature_flags". */
export type FeatureFlagsOrderBy = {
  allowedRoles?: InputMaybe<OrderBy>;
  featureName?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isEnabled?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: feature_flags */
export type FeatureFlagsPkColumnsInput = {
  /** Unique identifier for the feature flag */
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type FeatureFlagsPrependInput = {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "feature_flags" */
export enum FeatureFlagsSelectColumn {
  /** column name */
  allowedRoles = 'allowedRoles',
  /** column name */
  featureName = 'featureName',
  /** column name */
  id = 'id',
  /** column name */
  isEnabled = 'isEnabled',
  /** column name */
  updatedAt = 'updatedAt'
}

/** input type for updating data in table "feature_flags" */
export type FeatureFlagsSetInput = {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Scalars['jsonb']['input']>;
  /** Name of the feature controlled by this flag */
  featureName?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the feature flag */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the feature is currently enabled */
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Timestamp when the feature flag was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "featureFlags" */
export type FeatureFlagsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: FeatureFlagsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type FeatureFlagsStreamCursorValueInput = {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Scalars['jsonb']['input']>;
  /** Name of the feature controlled by this flag */
  featureName?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the feature flag */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the feature is currently enabled */
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Timestamp when the feature flag was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "feature_flags" */
export enum FeatureFlagsUpdateColumn {
  /** column name */
  allowedRoles = 'allowedRoles',
  /** column name */
  featureName = 'featureName',
  /** column name */
  id = 'id',
  /** column name */
  isEnabled = 'isEnabled',
  /** column name */
  updatedAt = 'updatedAt'
}

export type FeatureFlagsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<FeatureFlagsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<FeatureFlagsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<FeatureFlagsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<FeatureFlagsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<FeatureFlagsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<FeatureFlagsSetInput>;
  /** filter the rows which have to be updated */
  where: FeatureFlagsBoolExp;
};

export type GeneratePayrollDatesArgs = {
  p_end_date?: InputMaybe<Scalars['date']['input']>;
  p_max_dates?: InputMaybe<Scalars['Int']['input']>;
  p_payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  p_start_date?: InputMaybe<Scalars['date']['input']>;
};

export type GetLatestPayrollVersionArgs = {
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
};

export type GetPayrollVersionHistoryArgs = {
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** columns and relationships of "holidays" */
export type Holidays = {
  __typename?: 'holidays';
  /** ISO country code where the holiday is observed */
  countryCode: Scalars['bpchar']['output'];
  /** Timestamp when the holiday record was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Date of the holiday */
  date: Scalars['date']['output'];
  /** Unique identifier for the holiday */
  id: Scalars['uuid']['output'];
  /** Whether the holiday occurs on the same date each year */
  isFixed?: Maybe<Scalars['Boolean']['output']>;
  /** Whether the holiday is observed globally */
  isGlobal?: Maybe<Scalars['Boolean']['output']>;
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Int']['output']>;
  /** Name of the holiday in local language */
  localName: Scalars['String']['output'];
  /** Name of the holiday in English */
  name: Scalars['String']['output'];
  /** Array of regions within the country where the holiday applies */
  region?: Maybe<Array<Scalars['String']['output']>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types: Array<Scalars['String']['output']>;
  /** Timestamp when the holiday record was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "holidays" */
export type HolidaysAggregate = {
  __typename?: 'holidaysAggregate';
  aggregate?: Maybe<HolidaysAggregateFields>;
  nodes: Array<Holidays>;
};

/** aggregate fields of "holidays" */
export type HolidaysAggregateFields = {
  __typename?: 'holidaysAggregateFields';
  avg?: Maybe<HolidaysAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<HolidaysMaxFields>;
  min?: Maybe<HolidaysMinFields>;
  stddev?: Maybe<HolidaysStddevFields>;
  stddevPop?: Maybe<HolidaysStddevPopFields>;
  stddevSamp?: Maybe<HolidaysStddevSampFields>;
  sum?: Maybe<HolidaysSumFields>;
  varPop?: Maybe<HolidaysVarPopFields>;
  varSamp?: Maybe<HolidaysVarSampFields>;
  variance?: Maybe<HolidaysVarianceFields>;
};


/** aggregate fields of "holidays" */
export type HolidaysAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<HolidaysSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type HolidaysAvgFields = {
  __typename?: 'holidaysAvgFields';
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "holidays". All fields are combined with a logical 'AND'. */
export type HolidaysBoolExp = {
  _and?: InputMaybe<Array<HolidaysBoolExp>>;
  _not?: InputMaybe<HolidaysBoolExp>;
  _or?: InputMaybe<Array<HolidaysBoolExp>>;
  countryCode?: InputMaybe<BpcharComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  date?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isFixed?: InputMaybe<BooleanComparisonExp>;
  isGlobal?: InputMaybe<BooleanComparisonExp>;
  launchYear?: InputMaybe<IntComparisonExp>;
  localName?: InputMaybe<StringComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  region?: InputMaybe<StringArrayComparisonExp>;
  types?: InputMaybe<StringArrayComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "holidays" */
export enum HolidaysConstraint {
  /** unique or primary key constraint on columns "id" */
  holidays_pkey = 'holidays_pkey'
}

/** input type for incrementing numeric columns in table "holidays" */
export type HolidaysIncInput = {
  /** First year when the holiday was observed */
  launchYear?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "holidays" */
export type HolidaysInsertInput = {
  /** ISO country code where the holiday is observed */
  countryCode?: InputMaybe<Scalars['bpchar']['input']>;
  /** Timestamp when the holiday record was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Date of the holiday */
  date?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the holiday */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the holiday occurs on the same date each year */
  isFixed?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether the holiday is observed globally */
  isGlobal?: InputMaybe<Scalars['Boolean']['input']>;
  /** First year when the holiday was observed */
  launchYear?: InputMaybe<Scalars['Int']['input']>;
  /** Name of the holiday in local language */
  localName?: InputMaybe<Scalars['String']['input']>;
  /** Name of the holiday in English */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Array of regions within the country where the holiday applies */
  region?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Timestamp when the holiday record was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type HolidaysMaxFields = {
  __typename?: 'holidaysMaxFields';
  /** ISO country code where the holiday is observed */
  countryCode?: Maybe<Scalars['bpchar']['output']>;
  /** Timestamp when the holiday record was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Date of the holiday */
  date?: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the holiday */
  id?: Maybe<Scalars['uuid']['output']>;
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Int']['output']>;
  /** Name of the holiday in local language */
  localName?: Maybe<Scalars['String']['output']>;
  /** Name of the holiday in English */
  name?: Maybe<Scalars['String']['output']>;
  /** Array of regions within the country where the holiday applies */
  region?: Maybe<Array<Scalars['String']['output']>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types?: Maybe<Array<Scalars['String']['output']>>;
  /** Timestamp when the holiday record was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type HolidaysMinFields = {
  __typename?: 'holidaysMinFields';
  /** ISO country code where the holiday is observed */
  countryCode?: Maybe<Scalars['bpchar']['output']>;
  /** Timestamp when the holiday record was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Date of the holiday */
  date?: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the holiday */
  id?: Maybe<Scalars['uuid']['output']>;
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Int']['output']>;
  /** Name of the holiday in local language */
  localName?: Maybe<Scalars['String']['output']>;
  /** Name of the holiday in English */
  name?: Maybe<Scalars['String']['output']>;
  /** Array of regions within the country where the holiday applies */
  region?: Maybe<Array<Scalars['String']['output']>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types?: Maybe<Array<Scalars['String']['output']>>;
  /** Timestamp when the holiday record was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "holidays" */
export type HolidaysMutationResponse = {
  __typename?: 'holidaysMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Holidays>;
};

/** on_conflict condition type for table "holidays" */
export type HolidaysOnConflict = {
  constraint: HolidaysConstraint;
  updateColumns?: Array<HolidaysUpdateColumn>;
  where?: InputMaybe<HolidaysBoolExp>;
};

/** Ordering options when selecting data from "holidays". */
export type HolidaysOrderBy = {
  countryCode?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  date?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isFixed?: InputMaybe<OrderBy>;
  isGlobal?: InputMaybe<OrderBy>;
  launchYear?: InputMaybe<OrderBy>;
  localName?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  region?: InputMaybe<OrderBy>;
  types?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: holidays */
export type HolidaysPkColumnsInput = {
  /** Unique identifier for the holiday */
  id: Scalars['uuid']['input'];
};

/** select columns of table "holidays" */
export enum HolidaysSelectColumn {
  /** column name */
  countryCode = 'countryCode',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  date = 'date',
  /** column name */
  id = 'id',
  /** column name */
  isFixed = 'isFixed',
  /** column name */
  isGlobal = 'isGlobal',
  /** column name */
  launchYear = 'launchYear',
  /** column name */
  localName = 'localName',
  /** column name */
  name = 'name',
  /** column name */
  region = 'region',
  /** column name */
  types = 'types',
  /** column name */
  updatedAt = 'updatedAt'
}

/** input type for updating data in table "holidays" */
export type HolidaysSetInput = {
  /** ISO country code where the holiday is observed */
  countryCode?: InputMaybe<Scalars['bpchar']['input']>;
  /** Timestamp when the holiday record was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Date of the holiday */
  date?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the holiday */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the holiday occurs on the same date each year */
  isFixed?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether the holiday is observed globally */
  isGlobal?: InputMaybe<Scalars['Boolean']['input']>;
  /** First year when the holiday was observed */
  launchYear?: InputMaybe<Scalars['Int']['input']>;
  /** Name of the holiday in local language */
  localName?: InputMaybe<Scalars['String']['input']>;
  /** Name of the holiday in English */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Array of regions within the country where the holiday applies */
  region?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Timestamp when the holiday record was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type HolidaysStddevFields = {
  __typename?: 'holidaysStddevFields';
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type HolidaysStddevPopFields = {
  __typename?: 'holidaysStddevPopFields';
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type HolidaysStddevSampFields = {
  __typename?: 'holidaysStddevSampFields';
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "holidays" */
export type HolidaysStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: HolidaysStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type HolidaysStreamCursorValueInput = {
  /** ISO country code where the holiday is observed */
  countryCode?: InputMaybe<Scalars['bpchar']['input']>;
  /** Timestamp when the holiday record was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Date of the holiday */
  date?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the holiday */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the holiday occurs on the same date each year */
  isFixed?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether the holiday is observed globally */
  isGlobal?: InputMaybe<Scalars['Boolean']['input']>;
  /** First year when the holiday was observed */
  launchYear?: InputMaybe<Scalars['Int']['input']>;
  /** Name of the holiday in local language */
  localName?: InputMaybe<Scalars['String']['input']>;
  /** Name of the holiday in English */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Array of regions within the country where the holiday applies */
  region?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Timestamp when the holiday record was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type HolidaysSumFields = {
  __typename?: 'holidaysSumFields';
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "holidays" */
export enum HolidaysUpdateColumn {
  /** column name */
  countryCode = 'countryCode',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  date = 'date',
  /** column name */
  id = 'id',
  /** column name */
  isFixed = 'isFixed',
  /** column name */
  isGlobal = 'isGlobal',
  /** column name */
  launchYear = 'launchYear',
  /** column name */
  localName = 'localName',
  /** column name */
  name = 'name',
  /** column name */
  region = 'region',
  /** column name */
  types = 'types',
  /** column name */
  updatedAt = 'updatedAt'
}

export type HolidaysUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<HolidaysIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<HolidaysSetInput>;
  /** filter the rows which have to be updated */
  where: HolidaysBoolExp;
};

/** aggregate varPop on columns */
export type HolidaysVarPopFields = {
  __typename?: 'holidaysVarPopFields';
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type HolidaysVarSampFields = {
  __typename?: 'holidaysVarSampFields';
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type HolidaysVarianceFields = {
  __typename?: 'holidaysVarianceFields';
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "latest_payroll_version_results" */
export type LatestPayrollVersionResults = {
  __typename?: 'latestPayrollVersionResults';
  active: Scalars['Boolean']['output'];
  goLiveDate?: Maybe<Scalars['date']['output']>;
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  payrollId: Scalars['uuid']['output'];
  queriedAt?: Maybe<Scalars['timestamptz']['output']>;
  versionNumber: Scalars['Int']['output'];
};

export type LatestPayrollVersionResultsAggregate = {
  __typename?: 'latestPayrollVersionResultsAggregate';
  aggregate?: Maybe<LatestPayrollVersionResultsAggregateFields>;
  nodes: Array<LatestPayrollVersionResults>;
};

/** aggregate fields of "latest_payroll_version_results" */
export type LatestPayrollVersionResultsAggregateFields = {
  __typename?: 'latestPayrollVersionResultsAggregateFields';
  avg?: Maybe<LatestPayrollVersionResultsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<LatestPayrollVersionResultsMaxFields>;
  min?: Maybe<LatestPayrollVersionResultsMinFields>;
  stddev?: Maybe<LatestPayrollVersionResultsStddevFields>;
  stddevPop?: Maybe<LatestPayrollVersionResultsStddevPopFields>;
  stddevSamp?: Maybe<LatestPayrollVersionResultsStddevSampFields>;
  sum?: Maybe<LatestPayrollVersionResultsSumFields>;
  varPop?: Maybe<LatestPayrollVersionResultsVarPopFields>;
  varSamp?: Maybe<LatestPayrollVersionResultsVarSampFields>;
  variance?: Maybe<LatestPayrollVersionResultsVarianceFields>;
};


/** aggregate fields of "latest_payroll_version_results" */
export type LatestPayrollVersionResultsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type LatestPayrollVersionResultsAvgFields = {
  __typename?: 'latestPayrollVersionResultsAvgFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "latest_payroll_version_results". All fields are combined with a logical 'AND'. */
export type LatestPayrollVersionResultsBoolExp = {
  _and?: InputMaybe<Array<LatestPayrollVersionResultsBoolExp>>;
  _not?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
  _or?: InputMaybe<Array<LatestPayrollVersionResultsBoolExp>>;
  active?: InputMaybe<BooleanComparisonExp>;
  goLiveDate?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  queriedAt?: InputMaybe<TimestamptzComparisonExp>;
  versionNumber?: InputMaybe<IntComparisonExp>;
};

/** unique or primary key constraints on table "latest_payroll_version_results" */
export enum LatestPayrollVersionResultsConstraint {
  /** unique or primary key constraint on columns "id" */
  latest_payroll_version_results_pkey = 'latest_payroll_version_results_pkey'
}

/** input type for incrementing numeric columns in table "latest_payroll_version_results" */
export type LatestPayrollVersionResultsIncInput = {
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "latest_payroll_version_results" */
export type LatestPayrollVersionResultsInsertInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  queriedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type LatestPayrollVersionResultsMaxFields = {
  __typename?: 'latestPayrollVersionResultsMaxFields';
  goLiveDate?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  payrollId?: Maybe<Scalars['uuid']['output']>;
  queriedAt?: Maybe<Scalars['timestamptz']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type LatestPayrollVersionResultsMinFields = {
  __typename?: 'latestPayrollVersionResultsMinFields';
  goLiveDate?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  payrollId?: Maybe<Scalars['uuid']['output']>;
  queriedAt?: Maybe<Scalars['timestamptz']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "latest_payroll_version_results" */
export type LatestPayrollVersionResultsMutationResponse = {
  __typename?: 'latestPayrollVersionResultsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<LatestPayrollVersionResults>;
};

/** on_conflict condition type for table "latest_payroll_version_results" */
export type LatestPayrollVersionResultsOnConflict = {
  constraint: LatestPayrollVersionResultsConstraint;
  updateColumns?: Array<LatestPayrollVersionResultsUpdateColumn>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};

/** Ordering options when selecting data from "latest_payroll_version_results". */
export type LatestPayrollVersionResultsOrderBy = {
  active?: InputMaybe<OrderBy>;
  goLiveDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  queriedAt?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: latest_payroll_version_results */
export type LatestPayrollVersionResultsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "latest_payroll_version_results" */
export enum LatestPayrollVersionResultsSelectColumn {
  /** column name */
  active = 'active',
  /** column name */
  goLiveDate = 'goLiveDate',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  payrollId = 'payrollId',
  /** column name */
  queriedAt = 'queriedAt',
  /** column name */
  versionNumber = 'versionNumber'
}

/** input type for updating data in table "latest_payroll_version_results" */
export type LatestPayrollVersionResultsSetInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  queriedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type LatestPayrollVersionResultsStddevFields = {
  __typename?: 'latestPayrollVersionResultsStddevFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type LatestPayrollVersionResultsStddevPopFields = {
  __typename?: 'latestPayrollVersionResultsStddevPopFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type LatestPayrollVersionResultsStddevSampFields = {
  __typename?: 'latestPayrollVersionResultsStddevSampFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "latestPayrollVersionResults" */
export type LatestPayrollVersionResultsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: LatestPayrollVersionResultsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type LatestPayrollVersionResultsStreamCursorValueInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  queriedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type LatestPayrollVersionResultsSumFields = {
  __typename?: 'latestPayrollVersionResultsSumFields';
  versionNumber?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "latest_payroll_version_results" */
export enum LatestPayrollVersionResultsUpdateColumn {
  /** column name */
  active = 'active',
  /** column name */
  goLiveDate = 'goLiveDate',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  payrollId = 'payrollId',
  /** column name */
  queriedAt = 'queriedAt',
  /** column name */
  versionNumber = 'versionNumber'
}

export type LatestPayrollVersionResultsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<LatestPayrollVersionResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<LatestPayrollVersionResultsSetInput>;
  /** filter the rows which have to be updated */
  where: LatestPayrollVersionResultsBoolExp;
};

/** aggregate varPop on columns */
export type LatestPayrollVersionResultsVarPopFields = {
  __typename?: 'latestPayrollVersionResultsVarPopFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type LatestPayrollVersionResultsVarSampFields = {
  __typename?: 'latestPayrollVersionResultsVarSampFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type LatestPayrollVersionResultsVarianceFields = {
  __typename?: 'latestPayrollVersionResultsVarianceFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "leave" */
export type Leave = {
  __typename?: 'leave';
  /** Last day of the leave period */
  endDate: Scalars['date']['output'];
  /** Unique identifier for the leave record */
  id: Scalars['uuid']['output'];
  /** An object relationship */
  leaveRequester: Users;
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType: Scalars['String']['output'];
  /** An object relationship */
  leaveUser: Users;
  /** Reason provided for the leave request */
  reason?: Maybe<Scalars['String']['output']>;
  /** First day of the leave period */
  startDate: Scalars['date']['output'];
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: Maybe<Scalars['leave_status_enum']['output']>;
  /** Reference to the user taking leave */
  userId: Scalars['uuid']['output'];
};

/** aggregated selection of "leave" */
export type LeaveAggregate = {
  __typename?: 'leaveAggregate';
  aggregate?: Maybe<LeaveAggregateFields>;
  nodes: Array<Leave>;
};

export type LeaveAggregateBoolExp = {
  count?: InputMaybe<LeaveAggregateBoolExpCount>;
};

export type LeaveAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<LeaveSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<LeaveBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "leave" */
export type LeaveAggregateFields = {
  __typename?: 'leaveAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<LeaveMaxFields>;
  min?: Maybe<LeaveMinFields>;
};


/** aggregate fields of "leave" */
export type LeaveAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<LeaveSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "leave" */
export type LeaveAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<LeaveMaxOrderBy>;
  min?: InputMaybe<LeaveMinOrderBy>;
};

/** input type for inserting array relation for remote table "leave" */
export type LeaveArrRelInsertInput = {
  data: Array<LeaveInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<LeaveOnConflict>;
};

/** Boolean expression to filter rows from the table "leave". All fields are combined with a logical 'AND'. */
export type LeaveBoolExp = {
  _and?: InputMaybe<Array<LeaveBoolExp>>;
  _not?: InputMaybe<LeaveBoolExp>;
  _or?: InputMaybe<Array<LeaveBoolExp>>;
  endDate?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  leaveRequester?: InputMaybe<UsersBoolExp>;
  leaveType?: InputMaybe<StringComparisonExp>;
  leaveUser?: InputMaybe<UsersBoolExp>;
  reason?: InputMaybe<StringComparisonExp>;
  startDate?: InputMaybe<DateComparisonExp>;
  status?: InputMaybe<LeaveStatusEnumComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "leave" */
export enum LeaveConstraint {
  /** unique or primary key constraint on columns "id" */
  leave_pkey = 'leave_pkey'
}

/** input type for inserting data into table "leave" */
export type LeaveInsertInput = {
  /** Last day of the leave period */
  endDate?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<Scalars['uuid']['input']>;
  leaveRequester?: InputMaybe<UsersObjRelInsertInput>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType?: InputMaybe<Scalars['String']['input']>;
  leaveUser?: InputMaybe<UsersObjRelInsertInput>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<Scalars['String']['input']>;
  /** First day of the leave period */
  startDate?: InputMaybe<Scalars['date']['input']>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<Scalars['leave_status_enum']['input']>;
  /** Reference to the user taking leave */
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type LeaveMaxFields = {
  __typename?: 'leaveMaxFields';
  /** Last day of the leave period */
  endDate?: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the leave record */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType?: Maybe<Scalars['String']['output']>;
  /** Reason provided for the leave request */
  reason?: Maybe<Scalars['String']['output']>;
  /** First day of the leave period */
  startDate?: Maybe<Scalars['date']['output']>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: Maybe<Scalars['leave_status_enum']['output']>;
  /** Reference to the user taking leave */
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "leave" */
export type LeaveMaxOrderBy = {
  /** Last day of the leave period */
  endDate?: InputMaybe<OrderBy>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<OrderBy>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType?: InputMaybe<OrderBy>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<OrderBy>;
  /** First day of the leave period */
  startDate?: InputMaybe<OrderBy>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<OrderBy>;
  /** Reference to the user taking leave */
  userId?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type LeaveMinFields = {
  __typename?: 'leaveMinFields';
  /** Last day of the leave period */
  endDate?: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the leave record */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType?: Maybe<Scalars['String']['output']>;
  /** Reason provided for the leave request */
  reason?: Maybe<Scalars['String']['output']>;
  /** First day of the leave period */
  startDate?: Maybe<Scalars['date']['output']>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: Maybe<Scalars['leave_status_enum']['output']>;
  /** Reference to the user taking leave */
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "leave" */
export type LeaveMinOrderBy = {
  /** Last day of the leave period */
  endDate?: InputMaybe<OrderBy>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<OrderBy>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType?: InputMaybe<OrderBy>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<OrderBy>;
  /** First day of the leave period */
  startDate?: InputMaybe<OrderBy>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<OrderBy>;
  /** Reference to the user taking leave */
  userId?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "leave" */
export type LeaveMutationResponse = {
  __typename?: 'leaveMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Leave>;
};

/** on_conflict condition type for table "leave" */
export type LeaveOnConflict = {
  constraint: LeaveConstraint;
  updateColumns?: Array<LeaveUpdateColumn>;
  where?: InputMaybe<LeaveBoolExp>;
};

/** Ordering options when selecting data from "leave". */
export type LeaveOrderBy = {
  endDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  leaveRequester?: InputMaybe<UsersOrderBy>;
  leaveType?: InputMaybe<OrderBy>;
  leaveUser?: InputMaybe<UsersOrderBy>;
  reason?: InputMaybe<OrderBy>;
  startDate?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: leave */
export type LeavePkColumnsInput = {
  /** Unique identifier for the leave record */
  id: Scalars['uuid']['input'];
};

/** select columns of table "leave" */
export enum LeaveSelectColumn {
  /** column name */
  endDate = 'endDate',
  /** column name */
  id = 'id',
  /** column name */
  leaveType = 'leaveType',
  /** column name */
  reason = 'reason',
  /** column name */
  startDate = 'startDate',
  /** column name */
  status = 'status',
  /** column name */
  userId = 'userId'
}

/** input type for updating data in table "leave" */
export type LeaveSetInput = {
  /** Last day of the leave period */
  endDate?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType?: InputMaybe<Scalars['String']['input']>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<Scalars['String']['input']>;
  /** First day of the leave period */
  startDate?: InputMaybe<Scalars['date']['input']>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<Scalars['leave_status_enum']['input']>;
  /** Reference to the user taking leave */
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "leave" */
export type LeaveStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: LeaveStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type LeaveStreamCursorValueInput = {
  /** Last day of the leave period */
  endDate?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType?: InputMaybe<Scalars['String']['input']>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<Scalars['String']['input']>;
  /** First day of the leave period */
  startDate?: InputMaybe<Scalars['date']['input']>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<Scalars['leave_status_enum']['input']>;
  /** Reference to the user taking leave */
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "leave" */
export enum LeaveUpdateColumn {
  /** column name */
  endDate = 'endDate',
  /** column name */
  id = 'id',
  /** column name */
  leaveType = 'leaveType',
  /** column name */
  reason = 'reason',
  /** column name */
  startDate = 'startDate',
  /** column name */
  status = 'status',
  /** column name */
  userId = 'userId'
}

export type LeaveUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<LeaveSetInput>;
  /** filter the rows which have to be updated */
  where: LeaveBoolExp;
};

/** mutation root */
export type MutationRoot = {
  __typename?: 'mutation_root';
  /** delete data from the table: "adjustment_rules" */
  bulkDeleteAdjustmentRules?: Maybe<AdjustmentRulesMutationResponse>;
  /** delete data from the table: "app_settings" */
  bulkDeleteAppSettings?: Maybe<AppSettingsMutationResponse>;
  /** delete data from the table: "audit.audit_log" */
  bulkDeleteAuditLogs?: Maybe<AuditLogsMutationResponse>;
  /** delete data from the table: "audit.auth_events" */
  bulkDeleteAuthEvents?: Maybe<AuthEventsMutationResponse>;
  /** delete data from the table: "billing_event_log" */
  bulkDeleteBillingEventLogs?: Maybe<BillingEventLogsMutationResponse>;
  /** delete data from the table: "billing_invoice" */
  bulkDeleteBillingInvoice?: Maybe<BillingInvoiceMutationResponse>;
  /** delete data from the table: "billing_items" */
  bulkDeleteBillingItems?: Maybe<BillingItemsMutationResponse>;
  /** delete data from the table: "billing_plan" */
  bulkDeleteBillingPlans?: Maybe<BillingPlansMutationResponse>;
  /** delete data from the table: "client_billing_assignment" */
  bulkDeleteClientBillingAssignments?: Maybe<ClientBillingAssignmentsMutationResponse>;
  /** delete data from the table: "client_external_systems" */
  bulkDeleteClientExternalSystems?: Maybe<ClientExternalSystemsMutationResponse>;
  /** delete data from the table: "clients" */
  bulkDeleteClients?: Maybe<ClientsMutationResponse>;
  /** delete data from the table: "audit.data_access_log" */
  bulkDeleteDataAccessLogs?: Maybe<DataAccessLogsMutationResponse>;
  /** delete data from the table: "external_systems" */
  bulkDeleteExternalSystems?: Maybe<ExternalSystemsMutationResponse>;
  /** delete data from the table: "feature_flags" */
  bulkDeleteFeatureFlags?: Maybe<FeatureFlagsMutationResponse>;
  /** delete data from the table: "holidays" */
  bulkDeleteHolidays?: Maybe<HolidaysMutationResponse>;
  /** delete data from the table: "latest_payroll_version_results" */
  bulkDeleteLatestPayrollVersionResults?: Maybe<LatestPayrollVersionResultsMutationResponse>;
  /** delete data from the table: "leave" */
  bulkDeleteLeave?: Maybe<LeaveMutationResponse>;
  /** delete data from the table: "notes" */
  bulkDeleteNotes?: Maybe<NotesMutationResponse>;
  /** delete data from the table: "payroll_activation_results" */
  bulkDeletePayrollActivationResults?: Maybe<PayrollActivationResultsMutationResponse>;
  /** delete data from the table: "payroll_assignment_audit" */
  bulkDeletePayrollAssignmentAudits?: Maybe<PayrollAssignmentAuditsMutationResponse>;
  /** delete data from the table: "payroll_assignments" */
  bulkDeletePayrollAssignments?: Maybe<PayrollAssignmentsMutationResponse>;
  /** delete data from the table: "payroll_cycles" */
  bulkDeletePayrollCycles?: Maybe<PayrollCyclesMutationResponse>;
  /** delete data from the table: "payroll_date_types" */
  bulkDeletePayrollDateTypes?: Maybe<PayrollDateTypesMutationResponse>;
  /** delete data from the table: "payroll_dates" */
  bulkDeletePayrollDates?: Maybe<PayrollDatesMutationResponse>;
  /** delete data from the table: "payroll_version_history_results" */
  bulkDeletePayrollVersionHistoryResults?: Maybe<PayrollVersionHistoryResultsMutationResponse>;
  /** delete data from the table: "payroll_version_results" */
  bulkDeletePayrollVersionResults?: Maybe<PayrollVersionResultsMutationResponse>;
  /** delete data from the table: "payrolls" */
  bulkDeletePayrolls?: Maybe<PayrollsMutationResponse>;
  /** delete data from the table: "permission_audit_log" */
  bulkDeletePermissionAuditLogs?: Maybe<PermissionAuditLogsMutationResponse>;
  /** delete data from the table: "audit.permission_changes" */
  bulkDeletePermissionChanges?: Maybe<PermissionChangesMutationResponse>;
  /** delete data from the table: "permission_overrides" */
  bulkDeletePermissionOverrides?: Maybe<PermissionOverridesMutationResponse>;
  /** delete data from the table: "permissions" */
  bulkDeletePermissions?: Maybe<PermissionsMutationResponse>;
  /** delete data from the table: "resources" */
  bulkDeleteResources?: Maybe<ResourcesMutationResponse>;
  /** delete data from the table: "role_permissions" */
  bulkDeleteRolePermissions?: Maybe<RolePermissionsMutationResponse>;
  /** delete data from the table: "roles" */
  bulkDeleteRoles?: Maybe<RolesMutationResponse>;
  /** delete data from the table: "audit.slow_queries" */
  bulkDeleteSlowQueries?: Maybe<SlowQueriesMutationResponse>;
  /** delete data from the table: "audit.user_access_summary" */
  bulkDeleteUserAccessSummaries?: Maybe<UserAccessSummariesMutationResponse>;
  /** delete data from the table: "user_invitations" */
  bulkDeleteUserInvitations?: Maybe<UserInvitationsMutationResponse>;
  /** delete data from the table: "user_roles" */
  bulkDeleteUserRoles?: Maybe<UserRolesMutationResponse>;
  /** delete data from the table: "users" */
  bulkDeleteUsers?: Maybe<UsersMutationResponse>;
  /** delete data from the table: "users_role_backup" */
  bulkDeleteUsersRoleBackups?: Maybe<UsersRoleBackupMutationResponse>;
  /** delete data from the table: "neon_auth.users_sync" */
  bulkDeleteUsersSync?: Maybe<AuthUsersSyncMutationResponse>;
  /** delete data from the table: "work_schedule" */
  bulkDeleteWorkSchedules?: Maybe<WorkSchedulesMutationResponse>;
  /** insert data into the table: "adjustment_rules" */
  bulkInsertAdjustmentRules?: Maybe<AdjustmentRulesMutationResponse>;
  /** insert data into the table: "app_settings" */
  bulkInsertAppSettings?: Maybe<AppSettingsMutationResponse>;
  /** insert data into the table: "audit.audit_log" */
  bulkInsertAuditLogs?: Maybe<AuditLogsMutationResponse>;
  /** insert data into the table: "audit.auth_events" */
  bulkInsertAuthEvents?: Maybe<AuthEventsMutationResponse>;
  /** insert data into the table: "billing_event_log" */
  bulkInsertBillingEventLogs?: Maybe<BillingEventLogsMutationResponse>;
  /** insert data into the table: "billing_invoice" */
  bulkInsertBillingInvoice?: Maybe<BillingInvoiceMutationResponse>;
  /** insert data into the table: "billing_items" */
  bulkInsertBillingItems?: Maybe<BillingItemsMutationResponse>;
  /** insert data into the table: "billing_plan" */
  bulkInsertBillingPlans?: Maybe<BillingPlansMutationResponse>;
  /** insert data into the table: "client_billing_assignment" */
  bulkInsertClientBillingAssignments?: Maybe<ClientBillingAssignmentsMutationResponse>;
  /** insert data into the table: "client_external_systems" */
  bulkInsertClientExternalSystems?: Maybe<ClientExternalSystemsMutationResponse>;
  /** insert data into the table: "clients" */
  bulkInsertClients?: Maybe<ClientsMutationResponse>;
  /** insert data into the table: "audit.data_access_log" */
  bulkInsertDataAccessLogs?: Maybe<DataAccessLogsMutationResponse>;
  /** insert data into the table: "external_systems" */
  bulkInsertExternalSystems?: Maybe<ExternalSystemsMutationResponse>;
  /** insert data into the table: "feature_flags" */
  bulkInsertFeatureFlags?: Maybe<FeatureFlagsMutationResponse>;
  /** insert data into the table: "holidays" */
  bulkInsertHolidays?: Maybe<HolidaysMutationResponse>;
  /** insert data into the table: "latest_payroll_version_results" */
  bulkInsertLatestPayrollVersionResults?: Maybe<LatestPayrollVersionResultsMutationResponse>;
  /** insert data into the table: "leave" */
  bulkInsertLeave?: Maybe<LeaveMutationResponse>;
  /** insert data into the table: "notes" */
  bulkInsertNotes?: Maybe<NotesMutationResponse>;
  /** insert data into the table: "payroll_activation_results" */
  bulkInsertPayrollActivationResults?: Maybe<PayrollActivationResultsMutationResponse>;
  /** insert data into the table: "payroll_assignment_audit" */
  bulkInsertPayrollAssignmentAudits?: Maybe<PayrollAssignmentAuditsMutationResponse>;
  /** insert data into the table: "payroll_assignments" */
  bulkInsertPayrollAssignments?: Maybe<PayrollAssignmentsMutationResponse>;
  /** insert data into the table: "payroll_cycles" */
  bulkInsertPayrollCycles?: Maybe<PayrollCyclesMutationResponse>;
  /** insert data into the table: "payroll_date_types" */
  bulkInsertPayrollDateTypes?: Maybe<PayrollDateTypesMutationResponse>;
  /** insert data into the table: "payroll_dates" */
  bulkInsertPayrollDates?: Maybe<PayrollDatesMutationResponse>;
  /** insert data into the table: "payroll_version_history_results" */
  bulkInsertPayrollVersionHistoryResults?: Maybe<PayrollVersionHistoryResultsMutationResponse>;
  /** insert data into the table: "payroll_version_results" */
  bulkInsertPayrollVersionResults?: Maybe<PayrollVersionResultsMutationResponse>;
  /** insert data into the table: "payrolls" */
  bulkInsertPayrolls?: Maybe<PayrollsMutationResponse>;
  /** insert data into the table: "permission_audit_log" */
  bulkInsertPermissionAuditLogs?: Maybe<PermissionAuditLogsMutationResponse>;
  /** insert data into the table: "audit.permission_changes" */
  bulkInsertPermissionChanges?: Maybe<PermissionChangesMutationResponse>;
  /** insert data into the table: "permission_overrides" */
  bulkInsertPermissionOverrides?: Maybe<PermissionOverridesMutationResponse>;
  /** insert data into the table: "permissions" */
  bulkInsertPermissions?: Maybe<PermissionsMutationResponse>;
  /** insert data into the table: "resources" */
  bulkInsertResources?: Maybe<ResourcesMutationResponse>;
  /** insert data into the table: "role_permissions" */
  bulkInsertRolePermissions?: Maybe<RolePermissionsMutationResponse>;
  /** insert data into the table: "roles" */
  bulkInsertRoles?: Maybe<RolesMutationResponse>;
  /** insert data into the table: "audit.slow_queries" */
  bulkInsertSlowQueries?: Maybe<SlowQueriesMutationResponse>;
  /** insert data into the table: "audit.user_access_summary" */
  bulkInsertUserAccessSummaries?: Maybe<UserAccessSummariesMutationResponse>;
  /** insert data into the table: "user_invitations" */
  bulkInsertUserInvitations?: Maybe<UserInvitationsMutationResponse>;
  /** insert data into the table: "user_roles" */
  bulkInsertUserRoles?: Maybe<UserRolesMutationResponse>;
  /** insert data into the table: "users" */
  bulkInsertUsers?: Maybe<UsersMutationResponse>;
  /** insert data into the table: "users_role_backup" */
  bulkInsertUsersRoleBackups?: Maybe<UsersRoleBackupMutationResponse>;
  /** insert data into the table: "neon_auth.users_sync" */
  bulkInsertUsersSync?: Maybe<AuthUsersSyncMutationResponse>;
  /** insert data into the table: "work_schedule" */
  bulkInsertWorkSchedules?: Maybe<WorkSchedulesMutationResponse>;
  /** update data of the table: "adjustment_rules" */
  bulkUpdateAdjustmentRules?: Maybe<AdjustmentRulesMutationResponse>;
  /** update data of the table: "app_settings" */
  bulkUpdateAppSettings?: Maybe<AppSettingsMutationResponse>;
  /** update data of the table: "audit.audit_log" */
  bulkUpdateAuditLogs?: Maybe<AuditLogsMutationResponse>;
  /** update data of the table: "audit.auth_events" */
  bulkUpdateAuthEvents?: Maybe<AuthEventsMutationResponse>;
  /** update data of the table: "billing_event_log" */
  bulkUpdateBillingEventLogs?: Maybe<BillingEventLogsMutationResponse>;
  /** update data of the table: "billing_invoice" */
  bulkUpdateBillingInvoice?: Maybe<BillingInvoiceMutationResponse>;
  /** update data of the table: "billing_items" */
  bulkUpdateBillingItems?: Maybe<BillingItemsMutationResponse>;
  /** update data of the table: "billing_plan" */
  bulkUpdateBillingPlans?: Maybe<BillingPlansMutationResponse>;
  /** update data of the table: "client_billing_assignment" */
  bulkUpdateClientBillingAssignments?: Maybe<ClientBillingAssignmentsMutationResponse>;
  /** update data of the table: "client_external_systems" */
  bulkUpdateClientExternalSystems?: Maybe<ClientExternalSystemsMutationResponse>;
  /** update data of the table: "clients" */
  bulkUpdateClients?: Maybe<ClientsMutationResponse>;
  /** update data of the table: "audit.data_access_log" */
  bulkUpdateDataAccessLogs?: Maybe<DataAccessLogsMutationResponse>;
  /** update data of the table: "external_systems" */
  bulkUpdateExternalSystems?: Maybe<ExternalSystemsMutationResponse>;
  /** update data of the table: "feature_flags" */
  bulkUpdateFeatureFlags?: Maybe<FeatureFlagsMutationResponse>;
  /** update data of the table: "holidays" */
  bulkUpdateHolidays?: Maybe<HolidaysMutationResponse>;
  /** update data of the table: "latest_payroll_version_results" */
  bulkUpdateLatestPayrollVersionResults?: Maybe<LatestPayrollVersionResultsMutationResponse>;
  /** update data of the table: "leave" */
  bulkUpdateLeave?: Maybe<LeaveMutationResponse>;
  /** update data of the table: "notes" */
  bulkUpdateNotes?: Maybe<NotesMutationResponse>;
  /** update data of the table: "payroll_activation_results" */
  bulkUpdatePayrollActivationResults?: Maybe<PayrollActivationResultsMutationResponse>;
  /** update data of the table: "payroll_assignment_audit" */
  bulkUpdatePayrollAssignmentAudits?: Maybe<PayrollAssignmentAuditsMutationResponse>;
  /** update data of the table: "payroll_assignments" */
  bulkUpdatePayrollAssignments?: Maybe<PayrollAssignmentsMutationResponse>;
  /** update data of the table: "payroll_cycles" */
  bulkUpdatePayrollCycles?: Maybe<PayrollCyclesMutationResponse>;
  /** update data of the table: "payroll_date_types" */
  bulkUpdatePayrollDateTypes?: Maybe<PayrollDateTypesMutationResponse>;
  /** update data of the table: "payroll_dates" */
  bulkUpdatePayrollDates?: Maybe<PayrollDatesMutationResponse>;
  /** update data of the table: "payroll_version_history_results" */
  bulkUpdatePayrollVersionHistoryResults?: Maybe<PayrollVersionHistoryResultsMutationResponse>;
  /** update data of the table: "payroll_version_results" */
  bulkUpdatePayrollVersionResults?: Maybe<PayrollVersionResultsMutationResponse>;
  /** update data of the table: "payrolls" */
  bulkUpdatePayrolls?: Maybe<PayrollsMutationResponse>;
  /** update data of the table: "permission_audit_log" */
  bulkUpdatePermissionAuditLogs?: Maybe<PermissionAuditLogsMutationResponse>;
  /** update data of the table: "audit.permission_changes" */
  bulkUpdatePermissionChanges?: Maybe<PermissionChangesMutationResponse>;
  /** update data of the table: "permission_overrides" */
  bulkUpdatePermissionOverrides?: Maybe<PermissionOverridesMutationResponse>;
  /** update data of the table: "permissions" */
  bulkUpdatePermissions?: Maybe<PermissionsMutationResponse>;
  /** update data of the table: "resources" */
  bulkUpdateResources?: Maybe<ResourcesMutationResponse>;
  /** update data of the table: "role_permissions" */
  bulkUpdateRolePermissions?: Maybe<RolePermissionsMutationResponse>;
  /** update data of the table: "roles" */
  bulkUpdateRoles?: Maybe<RolesMutationResponse>;
  /** update data of the table: "audit.slow_queries" */
  bulkUpdateSlowQueries?: Maybe<SlowQueriesMutationResponse>;
  /** update data of the table: "audit.user_access_summary" */
  bulkUpdateUserAccessSummaries?: Maybe<UserAccessSummariesMutationResponse>;
  /** update data of the table: "user_invitations" */
  bulkUpdateUserInvitations?: Maybe<UserInvitationsMutationResponse>;
  /** update data of the table: "user_roles" */
  bulkUpdateUserRoles?: Maybe<UserRolesMutationResponse>;
  /** update data of the table: "users" */
  bulkUpdateUsers?: Maybe<UsersMutationResponse>;
  /** update data of the table: "users_role_backup" */
  bulkUpdateUsersRoleBackups?: Maybe<UsersRoleBackupMutationResponse>;
  /** update data of the table: "neon_auth.users_sync" */
  bulkUpdateUsersSync?: Maybe<AuthUsersSyncMutationResponse>;
  /** update data of the table: "work_schedule" */
  bulkUpdateWorkSchedules?: Maybe<WorkSchedulesMutationResponse>;
  /** Check for suspicious activity patterns */
  checkSuspiciousActivity?: Maybe<SuspiciousActivityResponse>;
  commitPayrollAssignments?: Maybe<CommitPayrollAssignmentsOutput>;
  /** delete single row from the table: "adjustment_rules" */
  deleteAdjustmentRuleById?: Maybe<AdjustmentRules>;
  /** delete single row from the table: "app_settings" */
  deleteAppSettingById?: Maybe<AppSettings>;
  /** delete single row from the table: "audit.audit_log" */
  deleteAuditLogById?: Maybe<AuditLogs>;
  /** delete single row from the table: "audit.auth_events" */
  deleteAuthEventById?: Maybe<AuthEvents>;
  /** delete single row from the table: "billing_event_log" */
  deleteBillingEventLogById?: Maybe<BillingEventLogs>;
  /** delete single row from the table: "billing_invoice" */
  deleteBillingInvoiceById?: Maybe<BillingInvoice>;
  /** delete single row from the table: "billing_items" */
  deleteBillingItemById?: Maybe<BillingItems>;
  /** delete single row from the table: "billing_plan" */
  deleteBillingPlanById?: Maybe<BillingPlans>;
  /** delete single row from the table: "client_billing_assignment" */
  deleteClientBillingAssignmentById?: Maybe<ClientBillingAssignments>;
  /** delete single row from the table: "clients" */
  deleteClientById?: Maybe<Clients>;
  /** delete single row from the table: "client_external_systems" */
  deleteClientExternalSystemById?: Maybe<ClientExternalSystems>;
  /** delete single row from the table: "audit.data_access_log" */
  deleteDataAccessLogById?: Maybe<DataAccessLogs>;
  /** delete single row from the table: "external_systems" */
  deleteExternalSystemById?: Maybe<ExternalSystems>;
  /** delete single row from the table: "feature_flags" */
  deleteFeatureFlagById?: Maybe<FeatureFlags>;
  /** delete single row from the table: "holidays" */
  deleteHolidayById?: Maybe<Holidays>;
  /** delete single row from the table: "latest_payroll_version_results" */
  deleteLatestPayrollVersionResultById?: Maybe<LatestPayrollVersionResults>;
  /** delete single row from the table: "leave" */
  deleteLeaveById?: Maybe<Leave>;
  /** delete single row from the table: "notes" */
  deleteNoteById?: Maybe<Notes>;
  /** delete single row from the table: "payroll_activation_results" */
  deletePayrollActivationResultById?: Maybe<PayrollActivationResults>;
  /** delete single row from the table: "payroll_assignment_audit" */
  deletePayrollAssignmentAuditById?: Maybe<PayrollAssignmentAudits>;
  /** delete single row from the table: "payroll_assignments" */
  deletePayrollAssignmentById?: Maybe<PayrollAssignments>;
  /** delete single row from the table: "payrolls" */
  deletePayrollById?: Maybe<Payrolls>;
  /** delete single row from the table: "payroll_cycles" */
  deletePayrollCycleById?: Maybe<PayrollCycles>;
  /** delete single row from the table: "payroll_dates" */
  deletePayrollDateById?: Maybe<PayrollDates>;
  /** delete single row from the table: "payroll_date_types" */
  deletePayrollDateTypeById?: Maybe<PayrollDateTypes>;
  /** delete single row from the table: "payroll_version_history_results" */
  deletePayrollVersionHistoryResultById?: Maybe<PayrollVersionHistoryResults>;
  /** delete single row from the table: "payroll_version_results" */
  deletePayrollVersionResultById?: Maybe<PayrollVersionResults>;
  /** delete single row from the table: "permission_audit_log" */
  deletePermissionAuditLogById?: Maybe<PermissionAuditLogs>;
  /** delete single row from the table: "permissions" */
  deletePermissionById?: Maybe<Permissions>;
  /** delete single row from the table: "audit.permission_changes" */
  deletePermissionChangeById?: Maybe<PermissionChanges>;
  /** delete single row from the table: "permission_overrides" */
  deletePermissionOverrideById?: Maybe<PermissionOverrides>;
  /** delete single row from the table: "resources" */
  deleteResourceById?: Maybe<Resources>;
  /** delete single row from the table: "roles" */
  deleteRoleById?: Maybe<Roles>;
  /** delete single row from the table: "role_permissions" */
  deleteRolePermissionById?: Maybe<RolePermissions>;
  /** delete single row from the table: "audit.slow_queries" */
  deleteSlowQueryById?: Maybe<SlowQueries>;
  /** delete single row from the table: "users" */
  deleteUserById?: Maybe<Users>;
  /** delete single row from the table: "user_invitations" */
  deleteUserInvitationById?: Maybe<UserInvitations>;
  /** delete single row from the table: "user_roles" */
  deleteUserRoleById?: Maybe<UserRoles>;
  /** delete single row from the table: "neon_auth.users_sync" */
  deleteUserSyncById?: Maybe<AuthUsersSync>;
  /** delete single row from the table: "work_schedule" */
  deleteWorkScheduleById?: Maybe<WorkSchedules>;
  /** Generate SOC2 compliance reports */
  generateComplianceReport?: Maybe<ComplianceReportResponse>;
  /** insert a single row into the table: "adjustment_rules" */
  insertAdjustmentRule?: Maybe<AdjustmentRules>;
  /** insert a single row into the table: "app_settings" */
  insertAppSetting?: Maybe<AppSettings>;
  /** insert a single row into the table: "audit.audit_log" */
  insertAuditLog?: Maybe<AuditLogs>;
  /** insert a single row into the table: "audit.auth_events" */
  insertAuthEvent?: Maybe<AuthEvents>;
  /** insert a single row into the table: "billing_event_log" */
  insertBillingEventLog?: Maybe<BillingEventLogs>;
  /** insert a single row into the table: "billing_invoice" */
  insertBillingInvoice?: Maybe<BillingInvoice>;
  /** insert a single row into the table: "billing_items" */
  insertBillingItem?: Maybe<BillingItems>;
  /** insert a single row into the table: "billing_plan" */
  insertBillingPlan?: Maybe<BillingPlans>;
  /** insert a single row into the table: "clients" */
  insertClient?: Maybe<Clients>;
  /** insert a single row into the table: "client_billing_assignment" */
  insertClientBillingAssignment?: Maybe<ClientBillingAssignments>;
  /** insert a single row into the table: "client_external_systems" */
  insertClientExternalSystem?: Maybe<ClientExternalSystems>;
  /** insert a single row into the table: "audit.data_access_log" */
  insertDataAccessLog?: Maybe<DataAccessLogs>;
  /** insert a single row into the table: "external_systems" */
  insertExternalSystem?: Maybe<ExternalSystems>;
  /** insert a single row into the table: "feature_flags" */
  insertFeatureFlag?: Maybe<FeatureFlags>;
  /** insert a single row into the table: "holidays" */
  insertHoliday?: Maybe<Holidays>;
  /** insert a single row into the table: "latest_payroll_version_results" */
  insertLatestPayrollVersionResult?: Maybe<LatestPayrollVersionResults>;
  /** insert a single row into the table: "leave" */
  insertLeave?: Maybe<Leave>;
  /** insert a single row into the table: "notes" */
  insertNote?: Maybe<Notes>;
  /** insert a single row into the table: "payrolls" */
  insertPayroll?: Maybe<Payrolls>;
  /** insert a single row into the table: "payroll_activation_results" */
  insertPayrollActivationResult?: Maybe<PayrollActivationResults>;
  /** insert a single row into the table: "payroll_assignments" */
  insertPayrollAssignment?: Maybe<PayrollAssignments>;
  /** insert a single row into the table: "payroll_assignment_audit" */
  insertPayrollAssignmentAudit?: Maybe<PayrollAssignmentAudits>;
  /** insert a single row into the table: "payroll_cycles" */
  insertPayrollCycle?: Maybe<PayrollCycles>;
  /** insert a single row into the table: "payroll_dates" */
  insertPayrollDate?: Maybe<PayrollDates>;
  /** insert a single row into the table: "payroll_date_types" */
  insertPayrollDateType?: Maybe<PayrollDateTypes>;
  /** insert a single row into the table: "payroll_version_history_results" */
  insertPayrollVersionHistoryResult?: Maybe<PayrollVersionHistoryResults>;
  /** insert a single row into the table: "payroll_version_results" */
  insertPayrollVersionResult?: Maybe<PayrollVersionResults>;
  /** insert a single row into the table: "permissions" */
  insertPermission?: Maybe<Permissions>;
  /** insert a single row into the table: "permission_audit_log" */
  insertPermissionAuditLog?: Maybe<PermissionAuditLogs>;
  /** insert a single row into the table: "audit.permission_changes" */
  insertPermissionChange?: Maybe<PermissionChanges>;
  /** insert a single row into the table: "permission_overrides" */
  insertPermissionOverride?: Maybe<PermissionOverrides>;
  /** insert a single row into the table: "resources" */
  insertResource?: Maybe<Resources>;
  /** insert a single row into the table: "roles" */
  insertRole?: Maybe<Roles>;
  /** insert a single row into the table: "role_permissions" */
  insertRolePermission?: Maybe<RolePermissions>;
  /** insert a single row into the table: "audit.slow_queries" */
  insertSlowQuery?: Maybe<SlowQueries>;
  /** insert a single row into the table: "users" */
  insertUser?: Maybe<Users>;
  /** insert a single row into the table: "audit.user_access_summary" */
  insertUserAccessSummary?: Maybe<UserAccessSummaries>;
  /** insert a single row into the table: "user_invitations" */
  insertUserInvitation?: Maybe<UserInvitations>;
  /** insert a single row into the table: "user_roles" */
  insertUserRole?: Maybe<UserRoles>;
  /** insert a single row into the table: "neon_auth.users_sync" */
  insertUserSync?: Maybe<AuthUsersSync>;
  /** insert a single row into the table: "users_role_backup" */
  insertUsersRoleBackup?: Maybe<UsersRoleBackup>;
  /** insert a single row into the table: "work_schedule" */
  insertWorkSchedule?: Maybe<WorkSchedules>;
  /** Log audit events for SOC2 compliance */
  logAuditEvent?: Maybe<AuditEventResponse>;
  /** update single row of the table: "adjustment_rules" */
  updateAdjustmentRuleById?: Maybe<AdjustmentRules>;
  /** update multiples rows of table: "adjustment_rules" */
  updateAdjustmentRulesMany?: Maybe<Array<Maybe<AdjustmentRulesMutationResponse>>>;
  /** update single row of the table: "app_settings" */
  updateAppSettingById?: Maybe<AppSettings>;
  /** update multiples rows of table: "app_settings" */
  updateAppSettingsMany?: Maybe<Array<Maybe<AppSettingsMutationResponse>>>;
  /** update single row of the table: "audit.audit_log" */
  updateAuditLogById?: Maybe<AuditLogs>;
  /** update multiples rows of table: "audit.audit_log" */
  updateAuditLogsMany?: Maybe<Array<Maybe<AuditLogsMutationResponse>>>;
  /** update single row of the table: "audit.auth_events" */
  updateAuthEventById?: Maybe<AuthEvents>;
  /** update multiples rows of table: "audit.auth_events" */
  updateAuthEventsMany?: Maybe<Array<Maybe<AuthEventsMutationResponse>>>;
  /** update multiples rows of table: "neon_auth.users_sync" */
  updateAuthUsersSyncMany?: Maybe<Array<Maybe<AuthUsersSyncMutationResponse>>>;
  /** update single row of the table: "billing_event_log" */
  updateBillingEventLogById?: Maybe<BillingEventLogs>;
  /** update multiples rows of table: "billing_event_log" */
  updateBillingEventLogsMany?: Maybe<Array<Maybe<BillingEventLogsMutationResponse>>>;
  /** update single row of the table: "billing_invoice" */
  updateBillingInvoiceById?: Maybe<BillingInvoice>;
  /** update multiples rows of table: "billing_invoice" */
  updateBillingInvoiceMany?: Maybe<Array<Maybe<BillingInvoiceMutationResponse>>>;
  /** update single row of the table: "billing_items" */
  updateBillingItemById?: Maybe<BillingItems>;
  /** update multiples rows of table: "billing_items" */
  updateBillingItemsMany?: Maybe<Array<Maybe<BillingItemsMutationResponse>>>;
  /** update single row of the table: "billing_plan" */
  updateBillingPlanById?: Maybe<BillingPlans>;
  /** update multiples rows of table: "billing_plan" */
  updateBillingPlansMany?: Maybe<Array<Maybe<BillingPlansMutationResponse>>>;
  /** update single row of the table: "client_billing_assignment" */
  updateClientBillingAssignmentById?: Maybe<ClientBillingAssignments>;
  /** update multiples rows of table: "client_billing_assignment" */
  updateClientBillingAssignmentsMany?: Maybe<Array<Maybe<ClientBillingAssignmentsMutationResponse>>>;
  /** update single row of the table: "clients" */
  updateClientById?: Maybe<Clients>;
  /** update single row of the table: "client_external_systems" */
  updateClientExternalSystemById?: Maybe<ClientExternalSystems>;
  /** update multiples rows of table: "client_external_systems" */
  updateClientExternalSystemsMany?: Maybe<Array<Maybe<ClientExternalSystemsMutationResponse>>>;
  /** update multiples rows of table: "clients" */
  updateClientsMany?: Maybe<Array<Maybe<ClientsMutationResponse>>>;
  /** update single row of the table: "audit.data_access_log" */
  updateDataAccessLogById?: Maybe<DataAccessLogs>;
  /** update multiples rows of table: "audit.data_access_log" */
  updateDataAccessLogsMany?: Maybe<Array<Maybe<DataAccessLogsMutationResponse>>>;
  /** update single row of the table: "external_systems" */
  updateExternalSystemById?: Maybe<ExternalSystems>;
  /** update multiples rows of table: "external_systems" */
  updateExternalSystemsMany?: Maybe<Array<Maybe<ExternalSystemsMutationResponse>>>;
  /** update single row of the table: "feature_flags" */
  updateFeatureFlagById?: Maybe<FeatureFlags>;
  /** update multiples rows of table: "feature_flags" */
  updateFeatureFlagsMany?: Maybe<Array<Maybe<FeatureFlagsMutationResponse>>>;
  /** update single row of the table: "holidays" */
  updateHolidayById?: Maybe<Holidays>;
  /** update multiples rows of table: "holidays" */
  updateHolidaysMany?: Maybe<Array<Maybe<HolidaysMutationResponse>>>;
  /** update single row of the table: "latest_payroll_version_results" */
  updateLatestPayrollVersionResultById?: Maybe<LatestPayrollVersionResults>;
  /** update multiples rows of table: "latest_payroll_version_results" */
  updateLatestPayrollVersionResultsMany?: Maybe<Array<Maybe<LatestPayrollVersionResultsMutationResponse>>>;
  /** update single row of the table: "leave" */
  updateLeaveById?: Maybe<Leave>;
  /** update multiples rows of table: "leave" */
  updateLeaveMany?: Maybe<Array<Maybe<LeaveMutationResponse>>>;
  /** update single row of the table: "notes" */
  updateNoteById?: Maybe<Notes>;
  /** update multiples rows of table: "notes" */
  updateNotesMany?: Maybe<Array<Maybe<NotesMutationResponse>>>;
  /** update single row of the table: "payroll_activation_results" */
  updatePayrollActivationResultById?: Maybe<PayrollActivationResults>;
  /** update multiples rows of table: "payroll_activation_results" */
  updatePayrollActivationResultsMany?: Maybe<Array<Maybe<PayrollActivationResultsMutationResponse>>>;
  /** update single row of the table: "payroll_assignment_audit" */
  updatePayrollAssignmentAuditById?: Maybe<PayrollAssignmentAudits>;
  /** update multiples rows of table: "payroll_assignment_audit" */
  updatePayrollAssignmentAuditsMany?: Maybe<Array<Maybe<PayrollAssignmentAuditsMutationResponse>>>;
  /** update single row of the table: "payroll_assignments" */
  updatePayrollAssignmentById?: Maybe<PayrollAssignments>;
  /** update multiples rows of table: "payroll_assignments" */
  updatePayrollAssignmentsMany?: Maybe<Array<Maybe<PayrollAssignmentsMutationResponse>>>;
  /** update single row of the table: "payrolls" */
  updatePayrollById?: Maybe<Payrolls>;
  /** update single row of the table: "payroll_cycles" */
  updatePayrollCycleById?: Maybe<PayrollCycles>;
  /** update multiples rows of table: "payroll_cycles" */
  updatePayrollCyclesMany?: Maybe<Array<Maybe<PayrollCyclesMutationResponse>>>;
  /** update single row of the table: "payroll_dates" */
  updatePayrollDateById?: Maybe<PayrollDates>;
  /** update single row of the table: "payroll_date_types" */
  updatePayrollDateTypeById?: Maybe<PayrollDateTypes>;
  /** update multiples rows of table: "payroll_date_types" */
  updatePayrollDateTypesMany?: Maybe<Array<Maybe<PayrollDateTypesMutationResponse>>>;
  /** update multiples rows of table: "payroll_dates" */
  updatePayrollDatesMany?: Maybe<Array<Maybe<PayrollDatesMutationResponse>>>;
  /** update single row of the table: "payroll_version_history_results" */
  updatePayrollVersionHistoryResultById?: Maybe<PayrollVersionHistoryResults>;
  /** update multiples rows of table: "payroll_version_history_results" */
  updatePayrollVersionHistoryResultsMany?: Maybe<Array<Maybe<PayrollVersionHistoryResultsMutationResponse>>>;
  /** update single row of the table: "payroll_version_results" */
  updatePayrollVersionResultById?: Maybe<PayrollVersionResults>;
  /** update multiples rows of table: "payroll_version_results" */
  updatePayrollVersionResultsMany?: Maybe<Array<Maybe<PayrollVersionResultsMutationResponse>>>;
  /** update multiples rows of table: "payrolls" */
  updatePayrollsMany?: Maybe<Array<Maybe<PayrollsMutationResponse>>>;
  /** update single row of the table: "permission_audit_log" */
  updatePermissionAuditLogById?: Maybe<PermissionAuditLogs>;
  /** update multiples rows of table: "permission_audit_log" */
  updatePermissionAuditLogsMany?: Maybe<Array<Maybe<PermissionAuditLogsMutationResponse>>>;
  /** update single row of the table: "permissions" */
  updatePermissionById?: Maybe<Permissions>;
  /** update single row of the table: "audit.permission_changes" */
  updatePermissionChangeById?: Maybe<PermissionChanges>;
  /** update multiples rows of table: "audit.permission_changes" */
  updatePermissionChangesMany?: Maybe<Array<Maybe<PermissionChangesMutationResponse>>>;
  /** update single row of the table: "permission_overrides" */
  updatePermissionOverrideById?: Maybe<PermissionOverrides>;
  /** update multiples rows of table: "permission_overrides" */
  updatePermissionOverridesMany?: Maybe<Array<Maybe<PermissionOverridesMutationResponse>>>;
  /** update multiples rows of table: "permissions" */
  updatePermissionsMany?: Maybe<Array<Maybe<PermissionsMutationResponse>>>;
  /** update single row of the table: "resources" */
  updateResourceById?: Maybe<Resources>;
  /** update multiples rows of table: "resources" */
  updateResourcesMany?: Maybe<Array<Maybe<ResourcesMutationResponse>>>;
  /** update single row of the table: "roles" */
  updateRoleById?: Maybe<Roles>;
  /** update single row of the table: "role_permissions" */
  updateRolePermissionById?: Maybe<RolePermissions>;
  /** update multiples rows of table: "role_permissions" */
  updateRolePermissionsMany?: Maybe<Array<Maybe<RolePermissionsMutationResponse>>>;
  /** update multiples rows of table: "roles" */
  updateRolesMany?: Maybe<Array<Maybe<RolesMutationResponse>>>;
  /** update multiples rows of table: "audit.slow_queries" */
  updateSlowQueriesMany?: Maybe<Array<Maybe<SlowQueriesMutationResponse>>>;
  /** update single row of the table: "audit.slow_queries" */
  updateSlowQueryById?: Maybe<SlowQueries>;
  /** update multiples rows of table: "audit.user_access_summary" */
  updateUserAccessSummariesMany?: Maybe<Array<Maybe<UserAccessSummariesMutationResponse>>>;
  /** update single row of the table: "users" */
  updateUserById?: Maybe<Users>;
  /** update single row of the table: "user_invitations" */
  updateUserInvitationById?: Maybe<UserInvitations>;
  /** update multiples rows of table: "user_invitations" */
  updateUserInvitationsMany?: Maybe<Array<Maybe<UserInvitationsMutationResponse>>>;
  /** update single row of the table: "user_roles" */
  updateUserRoleById?: Maybe<UserRoles>;
  /** update multiples rows of table: "user_roles" */
  updateUserRolesMany?: Maybe<Array<Maybe<UserRolesMutationResponse>>>;
  /** update single row of the table: "neon_auth.users_sync" */
  updateUserSyncById?: Maybe<AuthUsersSync>;
  /** update multiples rows of table: "users" */
  updateUsersMany?: Maybe<Array<Maybe<UsersMutationResponse>>>;
  /** update multiples rows of table: "users_role_backup" */
  updateUsersRoleBackupMany?: Maybe<Array<Maybe<UsersRoleBackupMutationResponse>>>;
  /** update single row of the table: "work_schedule" */
  updateWorkScheduleById?: Maybe<WorkSchedules>;
  /** update multiples rows of table: "work_schedule" */
  updateWorkSchedulesMany?: Maybe<Array<Maybe<WorkSchedulesMutationResponse>>>;
};


/** mutation root */
export type MutationRootBulkDeleteAdjustmentRulesArgs = {
  where: AdjustmentRulesBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteAppSettingsArgs = {
  where: AppSettingsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteAuditLogsArgs = {
  where: AuditLogsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteAuthEventsArgs = {
  where: AuthEventsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteBillingEventLogsArgs = {
  where: BillingEventLogsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteBillingInvoiceArgs = {
  where: BillingInvoiceBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteBillingItemsArgs = {
  where: BillingItemsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteBillingPlansArgs = {
  where: BillingPlansBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteClientBillingAssignmentsArgs = {
  where: ClientBillingAssignmentsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteClientExternalSystemsArgs = {
  where: ClientExternalSystemsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteClientsArgs = {
  where: ClientsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteDataAccessLogsArgs = {
  where: DataAccessLogsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteExternalSystemsArgs = {
  where: ExternalSystemsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteFeatureFlagsArgs = {
  where: FeatureFlagsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteHolidaysArgs = {
  where: HolidaysBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteLatestPayrollVersionResultsArgs = {
  where: LatestPayrollVersionResultsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteLeaveArgs = {
  where: LeaveBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteNotesArgs = {
  where: NotesBoolExp;
};


/** mutation root */
export type MutationRootBulkDeletePayrollActivationResultsArgs = {
  where: PayrollActivationResultsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeletePayrollAssignmentAuditsArgs = {
  where: PayrollAssignmentAuditsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeletePayrollAssignmentsArgs = {
  where: PayrollAssignmentsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeletePayrollCyclesArgs = {
  where: PayrollCyclesBoolExp;
};


/** mutation root */
export type MutationRootBulkDeletePayrollDateTypesArgs = {
  where: PayrollDateTypesBoolExp;
};


/** mutation root */
export type MutationRootBulkDeletePayrollDatesArgs = {
  where: PayrollDatesBoolExp;
};


/** mutation root */
export type MutationRootBulkDeletePayrollVersionHistoryResultsArgs = {
  where: PayrollVersionHistoryResultsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeletePayrollVersionResultsArgs = {
  where: PayrollVersionResultsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeletePayrollsArgs = {
  where: PayrollsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeletePermissionAuditLogsArgs = {
  where: PermissionAuditLogsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeletePermissionChangesArgs = {
  where: PermissionChangesBoolExp;
};


/** mutation root */
export type MutationRootBulkDeletePermissionOverridesArgs = {
  where: PermissionOverridesBoolExp;
};


/** mutation root */
export type MutationRootBulkDeletePermissionsArgs = {
  where: PermissionsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteResourcesArgs = {
  where: ResourcesBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteRolePermissionsArgs = {
  where: RolePermissionsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteRolesArgs = {
  where: RolesBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteSlowQueriesArgs = {
  where: SlowQueriesBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteUserAccessSummariesArgs = {
  where: UserAccessSummariesBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteUserInvitationsArgs = {
  where: UserInvitationsBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteUserRolesArgs = {
  where: UserRolesBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteUsersArgs = {
  where: UsersBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteUsersRoleBackupsArgs = {
  where: UsersRoleBackupBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteUsersSyncArgs = {
  where: AuthUsersSyncBoolExp;
};


/** mutation root */
export type MutationRootBulkDeleteWorkSchedulesArgs = {
  where: WorkSchedulesBoolExp;
};


/** mutation root */
export type MutationRootBulkInsertAdjustmentRulesArgs = {
  objects: Array<AdjustmentRulesInsertInput>;
  onConflict?: InputMaybe<AdjustmentRulesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertAppSettingsArgs = {
  objects: Array<AppSettingsInsertInput>;
  onConflict?: InputMaybe<AppSettingsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertAuditLogsArgs = {
  objects: Array<AuditLogsInsertInput>;
  onConflict?: InputMaybe<AuditLogsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertAuthEventsArgs = {
  objects: Array<AuthEventsInsertInput>;
  onConflict?: InputMaybe<AuthEventsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertBillingEventLogsArgs = {
  objects: Array<BillingEventLogsInsertInput>;
  onConflict?: InputMaybe<BillingEventLogsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertBillingInvoiceArgs = {
  objects: Array<BillingInvoiceInsertInput>;
  onConflict?: InputMaybe<BillingInvoiceOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertBillingItemsArgs = {
  objects: Array<BillingItemsInsertInput>;
  onConflict?: InputMaybe<BillingItemsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertBillingPlansArgs = {
  objects: Array<BillingPlansInsertInput>;
  onConflict?: InputMaybe<BillingPlansOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertClientBillingAssignmentsArgs = {
  objects: Array<ClientBillingAssignmentsInsertInput>;
  onConflict?: InputMaybe<ClientBillingAssignmentsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertClientExternalSystemsArgs = {
  objects: Array<ClientExternalSystemsInsertInput>;
  onConflict?: InputMaybe<ClientExternalSystemsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertClientsArgs = {
  objects: Array<ClientsInsertInput>;
  onConflict?: InputMaybe<ClientsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertDataAccessLogsArgs = {
  objects: Array<DataAccessLogsInsertInput>;
  onConflict?: InputMaybe<DataAccessLogsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertExternalSystemsArgs = {
  objects: Array<ExternalSystemsInsertInput>;
  onConflict?: InputMaybe<ExternalSystemsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertFeatureFlagsArgs = {
  objects: Array<FeatureFlagsInsertInput>;
  onConflict?: InputMaybe<FeatureFlagsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertHolidaysArgs = {
  objects: Array<HolidaysInsertInput>;
  onConflict?: InputMaybe<HolidaysOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertLatestPayrollVersionResultsArgs = {
  objects: Array<LatestPayrollVersionResultsInsertInput>;
  onConflict?: InputMaybe<LatestPayrollVersionResultsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertLeaveArgs = {
  objects: Array<LeaveInsertInput>;
  onConflict?: InputMaybe<LeaveOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertNotesArgs = {
  objects: Array<NotesInsertInput>;
  onConflict?: InputMaybe<NotesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollActivationResultsArgs = {
  objects: Array<PayrollActivationResultsInsertInput>;
  onConflict?: InputMaybe<PayrollActivationResultsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollAssignmentAuditsArgs = {
  objects: Array<PayrollAssignmentAuditsInsertInput>;
  onConflict?: InputMaybe<PayrollAssignmentAuditsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollAssignmentsArgs = {
  objects: Array<PayrollAssignmentsInsertInput>;
  onConflict?: InputMaybe<PayrollAssignmentsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollCyclesArgs = {
  objects: Array<PayrollCyclesInsertInput>;
  onConflict?: InputMaybe<PayrollCyclesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollDateTypesArgs = {
  objects: Array<PayrollDateTypesInsertInput>;
  onConflict?: InputMaybe<PayrollDateTypesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollDatesArgs = {
  objects: Array<PayrollDatesInsertInput>;
  onConflict?: InputMaybe<PayrollDatesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollVersionHistoryResultsArgs = {
  objects: Array<PayrollVersionHistoryResultsInsertInput>;
  onConflict?: InputMaybe<PayrollVersionHistoryResultsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollVersionResultsArgs = {
  objects: Array<PayrollVersionResultsInsertInput>;
  onConflict?: InputMaybe<PayrollVersionResultsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollsArgs = {
  objects: Array<PayrollsInsertInput>;
  onConflict?: InputMaybe<PayrollsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPermissionAuditLogsArgs = {
  objects: Array<PermissionAuditLogsInsertInput>;
  onConflict?: InputMaybe<PermissionAuditLogsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPermissionChangesArgs = {
  objects: Array<PermissionChangesInsertInput>;
  onConflict?: InputMaybe<PermissionChangesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPermissionOverridesArgs = {
  objects: Array<PermissionOverridesInsertInput>;
  onConflict?: InputMaybe<PermissionOverridesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPermissionsArgs = {
  objects: Array<PermissionsInsertInput>;
  onConflict?: InputMaybe<PermissionsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertResourcesArgs = {
  objects: Array<ResourcesInsertInput>;
  onConflict?: InputMaybe<ResourcesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertRolePermissionsArgs = {
  objects: Array<RolePermissionsInsertInput>;
  onConflict?: InputMaybe<RolePermissionsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertRolesArgs = {
  objects: Array<RolesInsertInput>;
  onConflict?: InputMaybe<RolesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertSlowQueriesArgs = {
  objects: Array<SlowQueriesInsertInput>;
  onConflict?: InputMaybe<SlowQueriesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertUserAccessSummariesArgs = {
  objects: Array<UserAccessSummariesInsertInput>;
};


/** mutation root */
export type MutationRootBulkInsertUserInvitationsArgs = {
  objects: Array<UserInvitationsInsertInput>;
  onConflict?: InputMaybe<UserInvitationsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertUserRolesArgs = {
  objects: Array<UserRolesInsertInput>;
  onConflict?: InputMaybe<UserRolesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertUsersArgs = {
  objects: Array<UsersInsertInput>;
  onConflict?: InputMaybe<UsersOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertUsersRoleBackupsArgs = {
  objects: Array<UsersRoleBackupInsertInput>;
};


/** mutation root */
export type MutationRootBulkInsertUsersSyncArgs = {
  objects: Array<AuthUsersSyncInsertInput>;
  onConflict?: InputMaybe<AuthUsersSyncOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertWorkSchedulesArgs = {
  objects: Array<WorkSchedulesInsertInput>;
  onConflict?: InputMaybe<WorkSchedulesOnConflict>;
};


/** mutation root */
export type MutationRootBulkUpdateAdjustmentRulesArgs = {
  _set?: InputMaybe<AdjustmentRulesSetInput>;
  where: AdjustmentRulesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateAppSettingsArgs = {
  _append?: InputMaybe<AppSettingsAppendInput>;
  _deleteAtPath?: InputMaybe<AppSettingsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<AppSettingsDeleteElemInput>;
  _deleteKey?: InputMaybe<AppSettingsDeleteKeyInput>;
  _prepend?: InputMaybe<AppSettingsPrependInput>;
  _set?: InputMaybe<AppSettingsSetInput>;
  where: AppSettingsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateAuditLogsArgs = {
  _append?: InputMaybe<AuditLogsAppendInput>;
  _deleteAtPath?: InputMaybe<AuditLogsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<AuditLogsDeleteElemInput>;
  _deleteKey?: InputMaybe<AuditLogsDeleteKeyInput>;
  _prepend?: InputMaybe<AuditLogsPrependInput>;
  _set?: InputMaybe<AuditLogsSetInput>;
  where: AuditLogsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateAuthEventsArgs = {
  _append?: InputMaybe<AuthEventsAppendInput>;
  _deleteAtPath?: InputMaybe<AuthEventsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<AuthEventsDeleteElemInput>;
  _deleteKey?: InputMaybe<AuthEventsDeleteKeyInput>;
  _prepend?: InputMaybe<AuthEventsPrependInput>;
  _set?: InputMaybe<AuthEventsSetInput>;
  where: AuthEventsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateBillingEventLogsArgs = {
  _set?: InputMaybe<BillingEventLogsSetInput>;
  where: BillingEventLogsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateBillingInvoiceArgs = {
  _inc?: InputMaybe<BillingInvoiceIncInput>;
  _set?: InputMaybe<BillingInvoiceSetInput>;
  where: BillingInvoiceBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateBillingItemsArgs = {
  _inc?: InputMaybe<BillingItemsIncInput>;
  _set?: InputMaybe<BillingItemsSetInput>;
  where: BillingItemsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateBillingPlansArgs = {
  _inc?: InputMaybe<BillingPlansIncInput>;
  _set?: InputMaybe<BillingPlansSetInput>;
  where: BillingPlansBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateClientBillingAssignmentsArgs = {
  _set?: InputMaybe<ClientBillingAssignmentsSetInput>;
  where: ClientBillingAssignmentsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateClientExternalSystemsArgs = {
  _set?: InputMaybe<ClientExternalSystemsSetInput>;
  where: ClientExternalSystemsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateClientsArgs = {
  _set?: InputMaybe<ClientsSetInput>;
  where: ClientsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateDataAccessLogsArgs = {
  _append?: InputMaybe<DataAccessLogsAppendInput>;
  _deleteAtPath?: InputMaybe<DataAccessLogsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<DataAccessLogsDeleteElemInput>;
  _deleteKey?: InputMaybe<DataAccessLogsDeleteKeyInput>;
  _inc?: InputMaybe<DataAccessLogsIncInput>;
  _prepend?: InputMaybe<DataAccessLogsPrependInput>;
  _set?: InputMaybe<DataAccessLogsSetInput>;
  where: DataAccessLogsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateExternalSystemsArgs = {
  _set?: InputMaybe<ExternalSystemsSetInput>;
  where: ExternalSystemsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateFeatureFlagsArgs = {
  _append?: InputMaybe<FeatureFlagsAppendInput>;
  _deleteAtPath?: InputMaybe<FeatureFlagsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<FeatureFlagsDeleteElemInput>;
  _deleteKey?: InputMaybe<FeatureFlagsDeleteKeyInput>;
  _prepend?: InputMaybe<FeatureFlagsPrependInput>;
  _set?: InputMaybe<FeatureFlagsSetInput>;
  where: FeatureFlagsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateHolidaysArgs = {
  _inc?: InputMaybe<HolidaysIncInput>;
  _set?: InputMaybe<HolidaysSetInput>;
  where: HolidaysBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateLatestPayrollVersionResultsArgs = {
  _inc?: InputMaybe<LatestPayrollVersionResultsIncInput>;
  _set?: InputMaybe<LatestPayrollVersionResultsSetInput>;
  where: LatestPayrollVersionResultsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateLeaveArgs = {
  _set?: InputMaybe<LeaveSetInput>;
  where: LeaveBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateNotesArgs = {
  _set?: InputMaybe<NotesSetInput>;
  where: NotesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollActivationResultsArgs = {
  _inc?: InputMaybe<PayrollActivationResultsIncInput>;
  _set?: InputMaybe<PayrollActivationResultsSetInput>;
  where: PayrollActivationResultsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollAssignmentAuditsArgs = {
  _set?: InputMaybe<PayrollAssignmentAuditsSetInput>;
  where: PayrollAssignmentAuditsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollAssignmentsArgs = {
  _set?: InputMaybe<PayrollAssignmentsSetInput>;
  where: PayrollAssignmentsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollCyclesArgs = {
  _set?: InputMaybe<PayrollCyclesSetInput>;
  where: PayrollCyclesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollDateTypesArgs = {
  _set?: InputMaybe<PayrollDateTypesSetInput>;
  where: PayrollDateTypesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollDatesArgs = {
  _set?: InputMaybe<PayrollDatesSetInput>;
  where: PayrollDatesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollVersionHistoryResultsArgs = {
  _inc?: InputMaybe<PayrollVersionHistoryResultsIncInput>;
  _set?: InputMaybe<PayrollVersionHistoryResultsSetInput>;
  where: PayrollVersionHistoryResultsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollVersionResultsArgs = {
  _inc?: InputMaybe<PayrollVersionResultsIncInput>;
  _set?: InputMaybe<PayrollVersionResultsSetInput>;
  where: PayrollVersionResultsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollsArgs = {
  _inc?: InputMaybe<PayrollsIncInput>;
  _set?: InputMaybe<PayrollsSetInput>;
  where: PayrollsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePermissionAuditLogsArgs = {
  _append?: InputMaybe<PermissionAuditLogsAppendInput>;
  _deleteAtPath?: InputMaybe<PermissionAuditLogsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<PermissionAuditLogsDeleteElemInput>;
  _deleteKey?: InputMaybe<PermissionAuditLogsDeleteKeyInput>;
  _prepend?: InputMaybe<PermissionAuditLogsPrependInput>;
  _set?: InputMaybe<PermissionAuditLogsSetInput>;
  where: PermissionAuditLogsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePermissionChangesArgs = {
  _append?: InputMaybe<PermissionChangesAppendInput>;
  _deleteAtPath?: InputMaybe<PermissionChangesDeleteAtPathInput>;
  _deleteElem?: InputMaybe<PermissionChangesDeleteElemInput>;
  _deleteKey?: InputMaybe<PermissionChangesDeleteKeyInput>;
  _prepend?: InputMaybe<PermissionChangesPrependInput>;
  _set?: InputMaybe<PermissionChangesSetInput>;
  where: PermissionChangesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePermissionOverridesArgs = {
  _append?: InputMaybe<PermissionOverridesAppendInput>;
  _deleteAtPath?: InputMaybe<PermissionOverridesDeleteAtPathInput>;
  _deleteElem?: InputMaybe<PermissionOverridesDeleteElemInput>;
  _deleteKey?: InputMaybe<PermissionOverridesDeleteKeyInput>;
  _prepend?: InputMaybe<PermissionOverridesPrependInput>;
  _set?: InputMaybe<PermissionOverridesSetInput>;
  where: PermissionOverridesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePermissionsArgs = {
  _set?: InputMaybe<PermissionsSetInput>;
  where: PermissionsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateResourcesArgs = {
  _set?: InputMaybe<ResourcesSetInput>;
  where: ResourcesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateRolePermissionsArgs = {
  _append?: InputMaybe<RolePermissionsAppendInput>;
  _deleteAtPath?: InputMaybe<RolePermissionsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<RolePermissionsDeleteElemInput>;
  _deleteKey?: InputMaybe<RolePermissionsDeleteKeyInput>;
  _prepend?: InputMaybe<RolePermissionsPrependInput>;
  _set?: InputMaybe<RolePermissionsSetInput>;
  where: RolePermissionsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateRolesArgs = {
  _inc?: InputMaybe<RolesIncInput>;
  _set?: InputMaybe<RolesSetInput>;
  where: RolesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateSlowQueriesArgs = {
  _set?: InputMaybe<SlowQueriesSetInput>;
  where: SlowQueriesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateUserAccessSummariesArgs = {
  _set?: InputMaybe<UserAccessSummariesSetInput>;
  where: UserAccessSummariesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateUserInvitationsArgs = {
  _append?: InputMaybe<UserInvitationsAppendInput>;
  _deleteAtPath?: InputMaybe<UserInvitationsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<UserInvitationsDeleteElemInput>;
  _deleteKey?: InputMaybe<UserInvitationsDeleteKeyInput>;
  _prepend?: InputMaybe<UserInvitationsPrependInput>;
  _set?: InputMaybe<UserInvitationsSetInput>;
  where: UserInvitationsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateUserRolesArgs = {
  _set?: InputMaybe<UserRolesSetInput>;
  where: UserRolesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateUsersArgs = {
  _set?: InputMaybe<UsersSetInput>;
  where: UsersBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateUsersRoleBackupsArgs = {
  _set?: InputMaybe<UsersRoleBackupSetInput>;
  where: UsersRoleBackupBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateUsersSyncArgs = {
  _append?: InputMaybe<AuthUsersSyncAppendInput>;
  _deleteAtPath?: InputMaybe<AuthUsersSyncDeleteAtPathInput>;
  _deleteElem?: InputMaybe<AuthUsersSyncDeleteElemInput>;
  _deleteKey?: InputMaybe<AuthUsersSyncDeleteKeyInput>;
  _prepend?: InputMaybe<AuthUsersSyncPrependInput>;
  _set?: InputMaybe<AuthUsersSyncSetInput>;
  where: AuthUsersSyncBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateWorkSchedulesArgs = {
  _inc?: InputMaybe<WorkSchedulesIncInput>;
  _set?: InputMaybe<WorkSchedulesSetInput>;
  where: WorkSchedulesBoolExp;
};


/** mutation root */
export type MutationRootCheckSuspiciousActivityArgs = {
  timeWindow?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};


/** mutation root */
export type MutationRootCommitPayrollAssignmentsArgs = {
  changes: Array<PayrollAssignmentInput>;
};


/** mutation root */
export type MutationRootDeleteAdjustmentRuleByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteAppSettingByIdArgs = {
  id: Scalars['String']['input'];
};


/** mutation root */
export type MutationRootDeleteAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteAuthEventByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteBillingEventLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteBillingInvoiceByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteBillingItemByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteBillingPlanByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteClientBillingAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteClientByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteClientExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteDataAccessLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteFeatureFlagByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteHolidayByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteLatestPayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteLeaveByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteNoteByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollActivationResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollAssignmentAuditByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollCycleByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollDateByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollDateTypeByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollVersionHistoryResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePermissionAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePermissionChangeByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePermissionOverrideByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteResourceByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteRolePermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteSlowQueryByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteUserByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteUserInvitationByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteUserRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteUserSyncByIdArgs = {
  id: Scalars['String']['input'];
};


/** mutation root */
export type MutationRootDeleteWorkScheduleByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootGenerateComplianceReportArgs = {
  input: ComplianceReportInput;
};


/** mutation root */
export type MutationRootInsertAdjustmentRuleArgs = {
  object: AdjustmentRulesInsertInput;
  onConflict?: InputMaybe<AdjustmentRulesOnConflict>;
};


/** mutation root */
export type MutationRootInsertAppSettingArgs = {
  object: AppSettingsInsertInput;
  onConflict?: InputMaybe<AppSettingsOnConflict>;
};


/** mutation root */
export type MutationRootInsertAuditLogArgs = {
  object: AuditLogsInsertInput;
  onConflict?: InputMaybe<AuditLogsOnConflict>;
};


/** mutation root */
export type MutationRootInsertAuthEventArgs = {
  object: AuthEventsInsertInput;
  onConflict?: InputMaybe<AuthEventsOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingEventLogArgs = {
  object: BillingEventLogsInsertInput;
  onConflict?: InputMaybe<BillingEventLogsOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingInvoiceArgs = {
  object: BillingInvoiceInsertInput;
  onConflict?: InputMaybe<BillingInvoiceOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingItemArgs = {
  object: BillingItemsInsertInput;
  onConflict?: InputMaybe<BillingItemsOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingPlanArgs = {
  object: BillingPlansInsertInput;
  onConflict?: InputMaybe<BillingPlansOnConflict>;
};


/** mutation root */
export type MutationRootInsertClientArgs = {
  object: ClientsInsertInput;
  onConflict?: InputMaybe<ClientsOnConflict>;
};


/** mutation root */
export type MutationRootInsertClientBillingAssignmentArgs = {
  object: ClientBillingAssignmentsInsertInput;
  onConflict?: InputMaybe<ClientBillingAssignmentsOnConflict>;
};


/** mutation root */
export type MutationRootInsertClientExternalSystemArgs = {
  object: ClientExternalSystemsInsertInput;
  onConflict?: InputMaybe<ClientExternalSystemsOnConflict>;
};


/** mutation root */
export type MutationRootInsertDataAccessLogArgs = {
  object: DataAccessLogsInsertInput;
  onConflict?: InputMaybe<DataAccessLogsOnConflict>;
};


/** mutation root */
export type MutationRootInsertExternalSystemArgs = {
  object: ExternalSystemsInsertInput;
  onConflict?: InputMaybe<ExternalSystemsOnConflict>;
};


/** mutation root */
export type MutationRootInsertFeatureFlagArgs = {
  object: FeatureFlagsInsertInput;
  onConflict?: InputMaybe<FeatureFlagsOnConflict>;
};


/** mutation root */
export type MutationRootInsertHolidayArgs = {
  object: HolidaysInsertInput;
  onConflict?: InputMaybe<HolidaysOnConflict>;
};


/** mutation root */
export type MutationRootInsertLatestPayrollVersionResultArgs = {
  object: LatestPayrollVersionResultsInsertInput;
  onConflict?: InputMaybe<LatestPayrollVersionResultsOnConflict>;
};


/** mutation root */
export type MutationRootInsertLeaveArgs = {
  object: LeaveInsertInput;
  onConflict?: InputMaybe<LeaveOnConflict>;
};


/** mutation root */
export type MutationRootInsertNoteArgs = {
  object: NotesInsertInput;
  onConflict?: InputMaybe<NotesOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollArgs = {
  object: PayrollsInsertInput;
  onConflict?: InputMaybe<PayrollsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollActivationResultArgs = {
  object: PayrollActivationResultsInsertInput;
  onConflict?: InputMaybe<PayrollActivationResultsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollAssignmentArgs = {
  object: PayrollAssignmentsInsertInput;
  onConflict?: InputMaybe<PayrollAssignmentsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollAssignmentAuditArgs = {
  object: PayrollAssignmentAuditsInsertInput;
  onConflict?: InputMaybe<PayrollAssignmentAuditsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollCycleArgs = {
  object: PayrollCyclesInsertInput;
  onConflict?: InputMaybe<PayrollCyclesOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollDateArgs = {
  object: PayrollDatesInsertInput;
  onConflict?: InputMaybe<PayrollDatesOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollDateTypeArgs = {
  object: PayrollDateTypesInsertInput;
  onConflict?: InputMaybe<PayrollDateTypesOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollVersionHistoryResultArgs = {
  object: PayrollVersionHistoryResultsInsertInput;
  onConflict?: InputMaybe<PayrollVersionHistoryResultsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollVersionResultArgs = {
  object: PayrollVersionResultsInsertInput;
  onConflict?: InputMaybe<PayrollVersionResultsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPermissionArgs = {
  object: PermissionsInsertInput;
  onConflict?: InputMaybe<PermissionsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPermissionAuditLogArgs = {
  object: PermissionAuditLogsInsertInput;
  onConflict?: InputMaybe<PermissionAuditLogsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPermissionChangeArgs = {
  object: PermissionChangesInsertInput;
  onConflict?: InputMaybe<PermissionChangesOnConflict>;
};


/** mutation root */
export type MutationRootInsertPermissionOverrideArgs = {
  object: PermissionOverridesInsertInput;
  onConflict?: InputMaybe<PermissionOverridesOnConflict>;
};


/** mutation root */
export type MutationRootInsertResourceArgs = {
  object: ResourcesInsertInput;
  onConflict?: InputMaybe<ResourcesOnConflict>;
};


/** mutation root */
export type MutationRootInsertRoleArgs = {
  object: RolesInsertInput;
  onConflict?: InputMaybe<RolesOnConflict>;
};


/** mutation root */
export type MutationRootInsertRolePermissionArgs = {
  object: RolePermissionsInsertInput;
  onConflict?: InputMaybe<RolePermissionsOnConflict>;
};


/** mutation root */
export type MutationRootInsertSlowQueryArgs = {
  object: SlowQueriesInsertInput;
  onConflict?: InputMaybe<SlowQueriesOnConflict>;
};


/** mutation root */
export type MutationRootInsertUserArgs = {
  object: UsersInsertInput;
  onConflict?: InputMaybe<UsersOnConflict>;
};


/** mutation root */
export type MutationRootInsertUserAccessSummaryArgs = {
  object: UserAccessSummariesInsertInput;
};


/** mutation root */
export type MutationRootInsertUserInvitationArgs = {
  object: UserInvitationsInsertInput;
  onConflict?: InputMaybe<UserInvitationsOnConflict>;
};


/** mutation root */
export type MutationRootInsertUserRoleArgs = {
  object: UserRolesInsertInput;
  onConflict?: InputMaybe<UserRolesOnConflict>;
};


/** mutation root */
export type MutationRootInsertUserSyncArgs = {
  object: AuthUsersSyncInsertInput;
  onConflict?: InputMaybe<AuthUsersSyncOnConflict>;
};


/** mutation root */
export type MutationRootInsertUsersRoleBackupArgs = {
  object: UsersRoleBackupInsertInput;
};


/** mutation root */
export type MutationRootInsertWorkScheduleArgs = {
  object: WorkSchedulesInsertInput;
  onConflict?: InputMaybe<WorkSchedulesOnConflict>;
};


/** mutation root */
export type MutationRootLogAuditEventArgs = {
  event: AuditEventInput;
};


/** mutation root */
export type MutationRootUpdateAdjustmentRuleByIdArgs = {
  _set?: InputMaybe<AdjustmentRulesSetInput>;
  pkColumns: AdjustmentRulesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateAdjustmentRulesManyArgs = {
  updates: Array<AdjustmentRulesUpdates>;
};


/** mutation root */
export type MutationRootUpdateAppSettingByIdArgs = {
  _append?: InputMaybe<AppSettingsAppendInput>;
  _deleteAtPath?: InputMaybe<AppSettingsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<AppSettingsDeleteElemInput>;
  _deleteKey?: InputMaybe<AppSettingsDeleteKeyInput>;
  _prepend?: InputMaybe<AppSettingsPrependInput>;
  _set?: InputMaybe<AppSettingsSetInput>;
  pkColumns: AppSettingsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateAppSettingsManyArgs = {
  updates: Array<AppSettingsUpdates>;
};


/** mutation root */
export type MutationRootUpdateAuditLogByIdArgs = {
  _append?: InputMaybe<AuditLogsAppendInput>;
  _deleteAtPath?: InputMaybe<AuditLogsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<AuditLogsDeleteElemInput>;
  _deleteKey?: InputMaybe<AuditLogsDeleteKeyInput>;
  _prepend?: InputMaybe<AuditLogsPrependInput>;
  _set?: InputMaybe<AuditLogsSetInput>;
  pkColumns: AuditLogsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateAuditLogsManyArgs = {
  updates: Array<AuditLogsUpdates>;
};


/** mutation root */
export type MutationRootUpdateAuthEventByIdArgs = {
  _append?: InputMaybe<AuthEventsAppendInput>;
  _deleteAtPath?: InputMaybe<AuthEventsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<AuthEventsDeleteElemInput>;
  _deleteKey?: InputMaybe<AuthEventsDeleteKeyInput>;
  _prepend?: InputMaybe<AuthEventsPrependInput>;
  _set?: InputMaybe<AuthEventsSetInput>;
  pkColumns: AuthEventsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateAuthEventsManyArgs = {
  updates: Array<AuthEventsUpdates>;
};


/** mutation root */
export type MutationRootUpdateAuthUsersSyncManyArgs = {
  updates: Array<AuthUsersSyncUpdates>;
};


/** mutation root */
export type MutationRootUpdateBillingEventLogByIdArgs = {
  _set?: InputMaybe<BillingEventLogsSetInput>;
  pkColumns: BillingEventLogsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBillingEventLogsManyArgs = {
  updates: Array<BillingEventLogsUpdates>;
};


/** mutation root */
export type MutationRootUpdateBillingInvoiceByIdArgs = {
  _inc?: InputMaybe<BillingInvoiceIncInput>;
  _set?: InputMaybe<BillingInvoiceSetInput>;
  pkColumns: BillingInvoicePkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBillingInvoiceManyArgs = {
  updates: Array<BillingInvoiceUpdates>;
};


/** mutation root */
export type MutationRootUpdateBillingItemByIdArgs = {
  _inc?: InputMaybe<BillingItemsIncInput>;
  _set?: InputMaybe<BillingItemsSetInput>;
  pkColumns: BillingItemsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBillingItemsManyArgs = {
  updates: Array<BillingItemsUpdates>;
};


/** mutation root */
export type MutationRootUpdateBillingPlanByIdArgs = {
  _inc?: InputMaybe<BillingPlansIncInput>;
  _set?: InputMaybe<BillingPlansSetInput>;
  pkColumns: BillingPlansPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBillingPlansManyArgs = {
  updates: Array<BillingPlansUpdates>;
};


/** mutation root */
export type MutationRootUpdateClientBillingAssignmentByIdArgs = {
  _set?: InputMaybe<ClientBillingAssignmentsSetInput>;
  pkColumns: ClientBillingAssignmentsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateClientBillingAssignmentsManyArgs = {
  updates: Array<ClientBillingAssignmentsUpdates>;
};


/** mutation root */
export type MutationRootUpdateClientByIdArgs = {
  _set?: InputMaybe<ClientsSetInput>;
  pkColumns: ClientsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateClientExternalSystemByIdArgs = {
  _set?: InputMaybe<ClientExternalSystemsSetInput>;
  pkColumns: ClientExternalSystemsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateClientExternalSystemsManyArgs = {
  updates: Array<ClientExternalSystemsUpdates>;
};


/** mutation root */
export type MutationRootUpdateClientsManyArgs = {
  updates: Array<ClientsUpdates>;
};


/** mutation root */
export type MutationRootUpdateDataAccessLogByIdArgs = {
  _append?: InputMaybe<DataAccessLogsAppendInput>;
  _deleteAtPath?: InputMaybe<DataAccessLogsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<DataAccessLogsDeleteElemInput>;
  _deleteKey?: InputMaybe<DataAccessLogsDeleteKeyInput>;
  _inc?: InputMaybe<DataAccessLogsIncInput>;
  _prepend?: InputMaybe<DataAccessLogsPrependInput>;
  _set?: InputMaybe<DataAccessLogsSetInput>;
  pkColumns: DataAccessLogsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateDataAccessLogsManyArgs = {
  updates: Array<DataAccessLogsUpdates>;
};


/** mutation root */
export type MutationRootUpdateExternalSystemByIdArgs = {
  _set?: InputMaybe<ExternalSystemsSetInput>;
  pkColumns: ExternalSystemsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateExternalSystemsManyArgs = {
  updates: Array<ExternalSystemsUpdates>;
};


/** mutation root */
export type MutationRootUpdateFeatureFlagByIdArgs = {
  _append?: InputMaybe<FeatureFlagsAppendInput>;
  _deleteAtPath?: InputMaybe<FeatureFlagsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<FeatureFlagsDeleteElemInput>;
  _deleteKey?: InputMaybe<FeatureFlagsDeleteKeyInput>;
  _prepend?: InputMaybe<FeatureFlagsPrependInput>;
  _set?: InputMaybe<FeatureFlagsSetInput>;
  pkColumns: FeatureFlagsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateFeatureFlagsManyArgs = {
  updates: Array<FeatureFlagsUpdates>;
};


/** mutation root */
export type MutationRootUpdateHolidayByIdArgs = {
  _inc?: InputMaybe<HolidaysIncInput>;
  _set?: InputMaybe<HolidaysSetInput>;
  pkColumns: HolidaysPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateHolidaysManyArgs = {
  updates: Array<HolidaysUpdates>;
};


/** mutation root */
export type MutationRootUpdateLatestPayrollVersionResultByIdArgs = {
  _inc?: InputMaybe<LatestPayrollVersionResultsIncInput>;
  _set?: InputMaybe<LatestPayrollVersionResultsSetInput>;
  pkColumns: LatestPayrollVersionResultsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateLatestPayrollVersionResultsManyArgs = {
  updates: Array<LatestPayrollVersionResultsUpdates>;
};


/** mutation root */
export type MutationRootUpdateLeaveByIdArgs = {
  _set?: InputMaybe<LeaveSetInput>;
  pkColumns: LeavePkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateLeaveManyArgs = {
  updates: Array<LeaveUpdates>;
};


/** mutation root */
export type MutationRootUpdateNoteByIdArgs = {
  _set?: InputMaybe<NotesSetInput>;
  pkColumns: NotesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateNotesManyArgs = {
  updates: Array<NotesUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollActivationResultByIdArgs = {
  _inc?: InputMaybe<PayrollActivationResultsIncInput>;
  _set?: InputMaybe<PayrollActivationResultsSetInput>;
  pkColumns: PayrollActivationResultsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollActivationResultsManyArgs = {
  updates: Array<PayrollActivationResultsUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollAssignmentAuditByIdArgs = {
  _set?: InputMaybe<PayrollAssignmentAuditsSetInput>;
  pkColumns: PayrollAssignmentAuditsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollAssignmentAuditsManyArgs = {
  updates: Array<PayrollAssignmentAuditsUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollAssignmentByIdArgs = {
  _set?: InputMaybe<PayrollAssignmentsSetInput>;
  pkColumns: PayrollAssignmentsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollAssignmentsManyArgs = {
  updates: Array<PayrollAssignmentsUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollByIdArgs = {
  _inc?: InputMaybe<PayrollsIncInput>;
  _set?: InputMaybe<PayrollsSetInput>;
  pkColumns: PayrollsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollCycleByIdArgs = {
  _set?: InputMaybe<PayrollCyclesSetInput>;
  pkColumns: PayrollCyclesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollCyclesManyArgs = {
  updates: Array<PayrollCyclesUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollDateByIdArgs = {
  _set?: InputMaybe<PayrollDatesSetInput>;
  pkColumns: PayrollDatesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollDateTypeByIdArgs = {
  _set?: InputMaybe<PayrollDateTypesSetInput>;
  pkColumns: PayrollDateTypesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollDateTypesManyArgs = {
  updates: Array<PayrollDateTypesUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollDatesManyArgs = {
  updates: Array<PayrollDatesUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollVersionHistoryResultByIdArgs = {
  _inc?: InputMaybe<PayrollVersionHistoryResultsIncInput>;
  _set?: InputMaybe<PayrollVersionHistoryResultsSetInput>;
  pkColumns: PayrollVersionHistoryResultsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollVersionHistoryResultsManyArgs = {
  updates: Array<PayrollVersionHistoryResultsUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollVersionResultByIdArgs = {
  _inc?: InputMaybe<PayrollVersionResultsIncInput>;
  _set?: InputMaybe<PayrollVersionResultsSetInput>;
  pkColumns: PayrollVersionResultsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollVersionResultsManyArgs = {
  updates: Array<PayrollVersionResultsUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollsManyArgs = {
  updates: Array<PayrollsUpdates>;
};


/** mutation root */
export type MutationRootUpdatePermissionAuditLogByIdArgs = {
  _append?: InputMaybe<PermissionAuditLogsAppendInput>;
  _deleteAtPath?: InputMaybe<PermissionAuditLogsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<PermissionAuditLogsDeleteElemInput>;
  _deleteKey?: InputMaybe<PermissionAuditLogsDeleteKeyInput>;
  _prepend?: InputMaybe<PermissionAuditLogsPrependInput>;
  _set?: InputMaybe<PermissionAuditLogsSetInput>;
  pkColumns: PermissionAuditLogsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePermissionAuditLogsManyArgs = {
  updates: Array<PermissionAuditLogsUpdates>;
};


/** mutation root */
export type MutationRootUpdatePermissionByIdArgs = {
  _set?: InputMaybe<PermissionsSetInput>;
  pkColumns: PermissionsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePermissionChangeByIdArgs = {
  _append?: InputMaybe<PermissionChangesAppendInput>;
  _deleteAtPath?: InputMaybe<PermissionChangesDeleteAtPathInput>;
  _deleteElem?: InputMaybe<PermissionChangesDeleteElemInput>;
  _deleteKey?: InputMaybe<PermissionChangesDeleteKeyInput>;
  _prepend?: InputMaybe<PermissionChangesPrependInput>;
  _set?: InputMaybe<PermissionChangesSetInput>;
  pkColumns: PermissionChangesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePermissionChangesManyArgs = {
  updates: Array<PermissionChangesUpdates>;
};


/** mutation root */
export type MutationRootUpdatePermissionOverrideByIdArgs = {
  _append?: InputMaybe<PermissionOverridesAppendInput>;
  _deleteAtPath?: InputMaybe<PermissionOverridesDeleteAtPathInput>;
  _deleteElem?: InputMaybe<PermissionOverridesDeleteElemInput>;
  _deleteKey?: InputMaybe<PermissionOverridesDeleteKeyInput>;
  _prepend?: InputMaybe<PermissionOverridesPrependInput>;
  _set?: InputMaybe<PermissionOverridesSetInput>;
  pkColumns: PermissionOverridesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePermissionOverridesManyArgs = {
  updates: Array<PermissionOverridesUpdates>;
};


/** mutation root */
export type MutationRootUpdatePermissionsManyArgs = {
  updates: Array<PermissionsUpdates>;
};


/** mutation root */
export type MutationRootUpdateResourceByIdArgs = {
  _set?: InputMaybe<ResourcesSetInput>;
  pkColumns: ResourcesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateResourcesManyArgs = {
  updates: Array<ResourcesUpdates>;
};


/** mutation root */
export type MutationRootUpdateRoleByIdArgs = {
  _inc?: InputMaybe<RolesIncInput>;
  _set?: InputMaybe<RolesSetInput>;
  pkColumns: RolesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateRolePermissionByIdArgs = {
  _append?: InputMaybe<RolePermissionsAppendInput>;
  _deleteAtPath?: InputMaybe<RolePermissionsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<RolePermissionsDeleteElemInput>;
  _deleteKey?: InputMaybe<RolePermissionsDeleteKeyInput>;
  _prepend?: InputMaybe<RolePermissionsPrependInput>;
  _set?: InputMaybe<RolePermissionsSetInput>;
  pkColumns: RolePermissionsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateRolePermissionsManyArgs = {
  updates: Array<RolePermissionsUpdates>;
};


/** mutation root */
export type MutationRootUpdateRolesManyArgs = {
  updates: Array<RolesUpdates>;
};


/** mutation root */
export type MutationRootUpdateSlowQueriesManyArgs = {
  updates: Array<SlowQueriesUpdates>;
};


/** mutation root */
export type MutationRootUpdateSlowQueryByIdArgs = {
  _set?: InputMaybe<SlowQueriesSetInput>;
  pkColumns: SlowQueriesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateUserAccessSummariesManyArgs = {
  updates: Array<UserAccessSummariesUpdates>;
};


/** mutation root */
export type MutationRootUpdateUserByIdArgs = {
  _set?: InputMaybe<UsersSetInput>;
  pkColumns: UsersPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateUserInvitationByIdArgs = {
  _append?: InputMaybe<UserInvitationsAppendInput>;
  _deleteAtPath?: InputMaybe<UserInvitationsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<UserInvitationsDeleteElemInput>;
  _deleteKey?: InputMaybe<UserInvitationsDeleteKeyInput>;
  _prepend?: InputMaybe<UserInvitationsPrependInput>;
  _set?: InputMaybe<UserInvitationsSetInput>;
  pkColumns: UserInvitationsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateUserInvitationsManyArgs = {
  updates: Array<UserInvitationsUpdates>;
};


/** mutation root */
export type MutationRootUpdateUserRoleByIdArgs = {
  _set?: InputMaybe<UserRolesSetInput>;
  pkColumns: UserRolesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateUserRolesManyArgs = {
  updates: Array<UserRolesUpdates>;
};


/** mutation root */
export type MutationRootUpdateUserSyncByIdArgs = {
  _append?: InputMaybe<AuthUsersSyncAppendInput>;
  _deleteAtPath?: InputMaybe<AuthUsersSyncDeleteAtPathInput>;
  _deleteElem?: InputMaybe<AuthUsersSyncDeleteElemInput>;
  _deleteKey?: InputMaybe<AuthUsersSyncDeleteKeyInput>;
  _prepend?: InputMaybe<AuthUsersSyncPrependInput>;
  _set?: InputMaybe<AuthUsersSyncSetInput>;
  pkColumns: AuthUsersSyncPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateUsersManyArgs = {
  updates: Array<UsersUpdates>;
};


/** mutation root */
export type MutationRootUpdateUsersRoleBackupManyArgs = {
  updates: Array<UsersRoleBackupUpdates>;
};


/** mutation root */
export type MutationRootUpdateWorkScheduleByIdArgs = {
  _inc?: InputMaybe<WorkSchedulesIncInput>;
  _set?: InputMaybe<WorkSchedulesSetInput>;
  pkColumns: WorkSchedulesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateWorkSchedulesManyArgs = {
  updates: Array<WorkSchedulesUpdates>;
};

/** columns and relationships of "notes" */
export type Notes = {
  __typename?: 'notes';
  /** An object relationship */
  authorUser?: Maybe<Users>;
  /** Content of the note */
  content: Scalars['String']['output'];
  /** Timestamp when the note was created */
  createdAt?: Maybe<Scalars['timestamp']['output']>;
  /** Identifier of the entity this note is attached to */
  entityId: Scalars['uuid']['output'];
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entityType: Scalars['String']['output'];
  /** Unique identifier for the note */
  id: Scalars['uuid']['output'];
  /** Whether the note is flagged as important */
  isImportant?: Maybe<Scalars['Boolean']['output']>;
  /** An array relationship */
  notesByClient: Array<Clients>;
  /** An aggregate relationship */
  notesByClientAggregate: ClientsAggregate;
  /** An array relationship */
  notesByPayroll: Array<Payrolls>;
  /** An aggregate relationship */
  notesByPayrollAggregate: PayrollsAggregate;
  /** Timestamp when the note was last updated */
  updatedAt?: Maybe<Scalars['timestamp']['output']>;
  /** User who created the note */
  userId?: Maybe<Scalars['uuid']['output']>;
};


/** columns and relationships of "notes" */
export type NotesNotesByClientArgs = {
  distinctOn?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};


/** columns and relationships of "notes" */
export type NotesNotesByClientAggregateArgs = {
  distinctOn?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};


/** columns and relationships of "notes" */
export type NotesNotesByPayrollArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "notes" */
export type NotesNotesByPayrollAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** aggregated selection of "notes" */
export type NotesAggregate = {
  __typename?: 'notesAggregate';
  aggregate?: Maybe<NotesAggregateFields>;
  nodes: Array<Notes>;
};

export type NotesAggregateBoolExp = {
  bool_and?: InputMaybe<NotesAggregateBoolExpBoolAnd>;
  bool_or?: InputMaybe<NotesAggregateBoolExpBoolOr>;
  count?: InputMaybe<NotesAggregateBoolExpCount>;
};

export type NotesAggregateBoolExpBoolAnd = {
  arguments: NotesSelectColumnNotesAggregateBoolExpBoolAndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<NotesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type NotesAggregateBoolExpBoolOr = {
  arguments: NotesSelectColumnNotesAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<NotesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type NotesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<NotesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<NotesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "notes" */
export type NotesAggregateFields = {
  __typename?: 'notesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<NotesMaxFields>;
  min?: Maybe<NotesMinFields>;
};


/** aggregate fields of "notes" */
export type NotesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<NotesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "notes" */
export type NotesAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<NotesMaxOrderBy>;
  min?: InputMaybe<NotesMinOrderBy>;
};

/** input type for inserting array relation for remote table "notes" */
export type NotesArrRelInsertInput = {
  data: Array<NotesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<NotesOnConflict>;
};

/** Boolean expression to filter rows from the table "notes". All fields are combined with a logical 'AND'. */
export type NotesBoolExp = {
  _and?: InputMaybe<Array<NotesBoolExp>>;
  _not?: InputMaybe<NotesBoolExp>;
  _or?: InputMaybe<Array<NotesBoolExp>>;
  authorUser?: InputMaybe<UsersBoolExp>;
  content?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestampComparisonExp>;
  entityId?: InputMaybe<UuidComparisonExp>;
  entityType?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isImportant?: InputMaybe<BooleanComparisonExp>;
  notesByClient?: InputMaybe<ClientsBoolExp>;
  notesByClientAggregate?: InputMaybe<ClientsAggregateBoolExp>;
  notesByPayroll?: InputMaybe<PayrollsBoolExp>;
  notesByPayrollAggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestampComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "notes" */
export enum NotesConstraint {
  /** unique or primary key constraint on columns "id" */
  notes_pkey = 'notes_pkey'
}

/** input type for inserting data into table "notes" */
export type NotesInsertInput = {
  authorUser?: InputMaybe<UsersObjRelInsertInput>;
  /** Content of the note */
  content?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the note was created */
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** Identifier of the entity this note is attached to */
  entityId?: InputMaybe<Scalars['uuid']['input']>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entityType?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the note */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the note is flagged as important */
  isImportant?: InputMaybe<Scalars['Boolean']['input']>;
  notesByClient?: InputMaybe<ClientsArrRelInsertInput>;
  notesByPayroll?: InputMaybe<PayrollsArrRelInsertInput>;
  /** Timestamp when the note was last updated */
  updatedAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** User who created the note */
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type NotesMaxFields = {
  __typename?: 'notesMaxFields';
  /** Content of the note */
  content?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the note was created */
  createdAt?: Maybe<Scalars['timestamp']['output']>;
  /** Identifier of the entity this note is attached to */
  entityId?: Maybe<Scalars['uuid']['output']>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entityType?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the note */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the note was last updated */
  updatedAt?: Maybe<Scalars['timestamp']['output']>;
  /** User who created the note */
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "notes" */
export type NotesMaxOrderBy = {
  /** Content of the note */
  content?: InputMaybe<OrderBy>;
  /** Timestamp when the note was created */
  createdAt?: InputMaybe<OrderBy>;
  /** Identifier of the entity this note is attached to */
  entityId?: InputMaybe<OrderBy>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entityType?: InputMaybe<OrderBy>;
  /** Unique identifier for the note */
  id?: InputMaybe<OrderBy>;
  /** Timestamp when the note was last updated */
  updatedAt?: InputMaybe<OrderBy>;
  /** User who created the note */
  userId?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type NotesMinFields = {
  __typename?: 'notesMinFields';
  /** Content of the note */
  content?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the note was created */
  createdAt?: Maybe<Scalars['timestamp']['output']>;
  /** Identifier of the entity this note is attached to */
  entityId?: Maybe<Scalars['uuid']['output']>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entityType?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the note */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the note was last updated */
  updatedAt?: Maybe<Scalars['timestamp']['output']>;
  /** User who created the note */
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "notes" */
export type NotesMinOrderBy = {
  /** Content of the note */
  content?: InputMaybe<OrderBy>;
  /** Timestamp when the note was created */
  createdAt?: InputMaybe<OrderBy>;
  /** Identifier of the entity this note is attached to */
  entityId?: InputMaybe<OrderBy>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entityType?: InputMaybe<OrderBy>;
  /** Unique identifier for the note */
  id?: InputMaybe<OrderBy>;
  /** Timestamp when the note was last updated */
  updatedAt?: InputMaybe<OrderBy>;
  /** User who created the note */
  userId?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "notes" */
export type NotesMutationResponse = {
  __typename?: 'notesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Notes>;
};

/** on_conflict condition type for table "notes" */
export type NotesOnConflict = {
  constraint: NotesConstraint;
  updateColumns?: Array<NotesUpdateColumn>;
  where?: InputMaybe<NotesBoolExp>;
};

/** Ordering options when selecting data from "notes". */
export type NotesOrderBy = {
  authorUser?: InputMaybe<UsersOrderBy>;
  content?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  entityId?: InputMaybe<OrderBy>;
  entityType?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isImportant?: InputMaybe<OrderBy>;
  notesByClientAggregate?: InputMaybe<ClientsAggregateOrderBy>;
  notesByPayrollAggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: notes */
export type NotesPkColumnsInput = {
  /** Unique identifier for the note */
  id: Scalars['uuid']['input'];
};

/** select columns of table "notes" */
export enum NotesSelectColumn {
  /** column name */
  content = 'content',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  entityId = 'entityId',
  /** column name */
  entityType = 'entityType',
  /** column name */
  id = 'id',
  /** column name */
  isImportant = 'isImportant',
  /** column name */
  updatedAt = 'updatedAt',
  /** column name */
  userId = 'userId'
}

/** select "notesAggregateBoolExpBool_andArgumentsColumns" columns of table "notes" */
export enum NotesSelectColumnNotesAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  isImportant = 'isImportant'
}

/** select "notesAggregateBoolExpBool_orArgumentsColumns" columns of table "notes" */
export enum NotesSelectColumnNotesAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  isImportant = 'isImportant'
}

/** input type for updating data in table "notes" */
export type NotesSetInput = {
  /** Content of the note */
  content?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the note was created */
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** Identifier of the entity this note is attached to */
  entityId?: InputMaybe<Scalars['uuid']['input']>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entityType?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the note */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the note is flagged as important */
  isImportant?: InputMaybe<Scalars['Boolean']['input']>;
  /** Timestamp when the note was last updated */
  updatedAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** User who created the note */
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "notes" */
export type NotesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: NotesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type NotesStreamCursorValueInput = {
  /** Content of the note */
  content?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the note was created */
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** Identifier of the entity this note is attached to */
  entityId?: InputMaybe<Scalars['uuid']['input']>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entityType?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the note */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the note is flagged as important */
  isImportant?: InputMaybe<Scalars['Boolean']['input']>;
  /** Timestamp when the note was last updated */
  updatedAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** User who created the note */
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "notes" */
export enum NotesUpdateColumn {
  /** column name */
  content = 'content',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  entityId = 'entityId',
  /** column name */
  entityType = 'entityType',
  /** column name */
  id = 'id',
  /** column name */
  isImportant = 'isImportant',
  /** column name */
  updatedAt = 'updatedAt',
  /** column name */
  userId = 'userId'
}

export type NotesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<NotesSetInput>;
  /** filter the rows which have to be updated */
  where: NotesBoolExp;
};

/** columns and relationships of "payroll_activation_results" */
export type PayrollActivationResults = {
  __typename?: 'payrollActivationResults';
  actionTaken: Scalars['String']['output'];
  executedAt?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  payrollId: Scalars['uuid']['output'];
  versionNumber: Scalars['Int']['output'];
};

export type PayrollActivationResultsAggregate = {
  __typename?: 'payrollActivationResultsAggregate';
  aggregate?: Maybe<PayrollActivationResultsAggregateFields>;
  nodes: Array<PayrollActivationResults>;
};

/** aggregate fields of "payroll_activation_results" */
export type PayrollActivationResultsAggregateFields = {
  __typename?: 'payrollActivationResultsAggregateFields';
  avg?: Maybe<PayrollActivationResultsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<PayrollActivationResultsMaxFields>;
  min?: Maybe<PayrollActivationResultsMinFields>;
  stddev?: Maybe<PayrollActivationResultsStddevFields>;
  stddevPop?: Maybe<PayrollActivationResultsStddevPopFields>;
  stddevSamp?: Maybe<PayrollActivationResultsStddevSampFields>;
  sum?: Maybe<PayrollActivationResultsSumFields>;
  varPop?: Maybe<PayrollActivationResultsVarPopFields>;
  varSamp?: Maybe<PayrollActivationResultsVarSampFields>;
  variance?: Maybe<PayrollActivationResultsVarianceFields>;
};


/** aggregate fields of "payroll_activation_results" */
export type PayrollActivationResultsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type PayrollActivationResultsAvgFields = {
  __typename?: 'payrollActivationResultsAvgFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "payroll_activation_results". All fields are combined with a logical 'AND'. */
export type PayrollActivationResultsBoolExp = {
  _and?: InputMaybe<Array<PayrollActivationResultsBoolExp>>;
  _not?: InputMaybe<PayrollActivationResultsBoolExp>;
  _or?: InputMaybe<Array<PayrollActivationResultsBoolExp>>;
  actionTaken?: InputMaybe<StringComparisonExp>;
  executedAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  versionNumber?: InputMaybe<IntComparisonExp>;
};

/** unique or primary key constraints on table "payroll_activation_results" */
export enum PayrollActivationResultsConstraint {
  /** unique or primary key constraint on columns "id" */
  payroll_activation_results_pkey = 'payroll_activation_results_pkey'
}

/** input type for incrementing numeric columns in table "payroll_activation_results" */
export type PayrollActivationResultsIncInput = {
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "payroll_activation_results" */
export type PayrollActivationResultsInsertInput = {
  actionTaken?: InputMaybe<Scalars['String']['input']>;
  executedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type PayrollActivationResultsMaxFields = {
  __typename?: 'payrollActivationResultsMaxFields';
  actionTaken?: Maybe<Scalars['String']['output']>;
  executedAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  payrollId?: Maybe<Scalars['uuid']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type PayrollActivationResultsMinFields = {
  __typename?: 'payrollActivationResultsMinFields';
  actionTaken?: Maybe<Scalars['String']['output']>;
  executedAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  payrollId?: Maybe<Scalars['uuid']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "payroll_activation_results" */
export type PayrollActivationResultsMutationResponse = {
  __typename?: 'payrollActivationResultsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollActivationResults>;
};

/** on_conflict condition type for table "payroll_activation_results" */
export type PayrollActivationResultsOnConflict = {
  constraint: PayrollActivationResultsConstraint;
  updateColumns?: Array<PayrollActivationResultsUpdateColumn>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};

/** Ordering options when selecting data from "payroll_activation_results". */
export type PayrollActivationResultsOrderBy = {
  actionTaken?: InputMaybe<OrderBy>;
  executedAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_activation_results */
export type PayrollActivationResultsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_activation_results" */
export enum PayrollActivationResultsSelectColumn {
  /** column name */
  actionTaken = 'actionTaken',
  /** column name */
  executedAt = 'executedAt',
  /** column name */
  id = 'id',
  /** column name */
  payrollId = 'payrollId',
  /** column name */
  versionNumber = 'versionNumber'
}

/** input type for updating data in table "payroll_activation_results" */
export type PayrollActivationResultsSetInput = {
  actionTaken?: InputMaybe<Scalars['String']['input']>;
  executedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type PayrollActivationResultsStddevFields = {
  __typename?: 'payrollActivationResultsStddevFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type PayrollActivationResultsStddevPopFields = {
  __typename?: 'payrollActivationResultsStddevPopFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type PayrollActivationResultsStddevSampFields = {
  __typename?: 'payrollActivationResultsStddevSampFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "payrollActivationResults" */
export type PayrollActivationResultsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PayrollActivationResultsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollActivationResultsStreamCursorValueInput = {
  actionTaken?: InputMaybe<Scalars['String']['input']>;
  executedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type PayrollActivationResultsSumFields = {
  __typename?: 'payrollActivationResultsSumFields';
  versionNumber?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "payroll_activation_results" */
export enum PayrollActivationResultsUpdateColumn {
  /** column name */
  actionTaken = 'actionTaken',
  /** column name */
  executedAt = 'executedAt',
  /** column name */
  id = 'id',
  /** column name */
  payrollId = 'payrollId',
  /** column name */
  versionNumber = 'versionNumber'
}

export type PayrollActivationResultsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<PayrollActivationResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollActivationResultsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollActivationResultsBoolExp;
};

/** aggregate varPop on columns */
export type PayrollActivationResultsVarPopFields = {
  __typename?: 'payrollActivationResultsVarPopFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type PayrollActivationResultsVarSampFields = {
  __typename?: 'payrollActivationResultsVarSampFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type PayrollActivationResultsVarianceFields = {
  __typename?: 'payrollActivationResultsVarianceFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "payroll_assignment_audit" */
export type PayrollAssignmentAudits = {
  __typename?: 'payrollAssignmentAudits';
  assignmentId?: Maybe<Scalars['uuid']['output']>;
  changeReason?: Maybe<Scalars['String']['output']>;
  changedBy?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  changedByUser?: Maybe<Users>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  fromConsultant?: Maybe<Users>;
  fromConsultantId?: Maybe<Scalars['uuid']['output']>;
  id: Scalars['uuid']['output'];
  /** An object relationship */
  payrollAssignment?: Maybe<PayrollAssignments>;
  /** An object relationship */
  payrollDate: PayrollDates;
  payrollDateId: Scalars['uuid']['output'];
  /** An object relationship */
  toConsultant: Users;
  toConsultantId: Scalars['uuid']['output'];
};

/** aggregated selection of "payroll_assignment_audit" */
export type PayrollAssignmentAuditsAggregate = {
  __typename?: 'payrollAssignmentAuditsAggregate';
  aggregate?: Maybe<PayrollAssignmentAuditsAggregateFields>;
  nodes: Array<PayrollAssignmentAudits>;
};

export type PayrollAssignmentAuditsAggregateBoolExp = {
  count?: InputMaybe<PayrollAssignmentAuditsAggregateBoolExpCount>;
};

export type PayrollAssignmentAuditsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "payroll_assignment_audit" */
export type PayrollAssignmentAuditsAggregateFields = {
  __typename?: 'payrollAssignmentAuditsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<PayrollAssignmentAuditsMaxFields>;
  min?: Maybe<PayrollAssignmentAuditsMinFields>;
};


/** aggregate fields of "payroll_assignment_audit" */
export type PayrollAssignmentAuditsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "payroll_assignment_audit" */
export type PayrollAssignmentAuditsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<PayrollAssignmentAuditsMaxOrderBy>;
  min?: InputMaybe<PayrollAssignmentAuditsMinOrderBy>;
};

/** input type for inserting array relation for remote table "payroll_assignment_audit" */
export type PayrollAssignmentAuditsArrRelInsertInput = {
  data: Array<PayrollAssignmentAuditsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollAssignmentAuditsOnConflict>;
};

/** Boolean expression to filter rows from the table "payroll_assignment_audit". All fields are combined with a logical 'AND'. */
export type PayrollAssignmentAuditsBoolExp = {
  _and?: InputMaybe<Array<PayrollAssignmentAuditsBoolExp>>;
  _not?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
  _or?: InputMaybe<Array<PayrollAssignmentAuditsBoolExp>>;
  assignmentId?: InputMaybe<UuidComparisonExp>;
  changeReason?: InputMaybe<StringComparisonExp>;
  changedBy?: InputMaybe<UuidComparisonExp>;
  changedByUser?: InputMaybe<UsersBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  fromConsultant?: InputMaybe<UsersBoolExp>;
  fromConsultantId?: InputMaybe<UuidComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  payrollAssignment?: InputMaybe<PayrollAssignmentsBoolExp>;
  payrollDate?: InputMaybe<PayrollDatesBoolExp>;
  payrollDateId?: InputMaybe<UuidComparisonExp>;
  toConsultant?: InputMaybe<UsersBoolExp>;
  toConsultantId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "payroll_assignment_audit" */
export enum PayrollAssignmentAuditsConstraint {
  /** unique or primary key constraint on columns "id" */
  payroll_assignment_audit_pkey = 'payroll_assignment_audit_pkey'
}

/** input type for inserting data into table "payroll_assignment_audit" */
export type PayrollAssignmentAuditsInsertInput = {
  assignmentId?: InputMaybe<Scalars['uuid']['input']>;
  changeReason?: InputMaybe<Scalars['String']['input']>;
  changedBy?: InputMaybe<Scalars['uuid']['input']>;
  changedByUser?: InputMaybe<UsersObjRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  fromConsultant?: InputMaybe<UsersObjRelInsertInput>;
  fromConsultantId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payrollAssignment?: InputMaybe<PayrollAssignmentsObjRelInsertInput>;
  payrollDate?: InputMaybe<PayrollDatesObjRelInsertInput>;
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  toConsultant?: InputMaybe<UsersObjRelInsertInput>;
  toConsultantId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type PayrollAssignmentAuditsMaxFields = {
  __typename?: 'payrollAssignmentAuditsMaxFields';
  assignmentId?: Maybe<Scalars['uuid']['output']>;
  changeReason?: Maybe<Scalars['String']['output']>;
  changedBy?: Maybe<Scalars['uuid']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  fromConsultantId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  payrollDateId?: Maybe<Scalars['uuid']['output']>;
  toConsultantId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "payroll_assignment_audit" */
export type PayrollAssignmentAuditsMaxOrderBy = {
  assignmentId?: InputMaybe<OrderBy>;
  changeReason?: InputMaybe<OrderBy>;
  changedBy?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  fromConsultantId?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  toConsultantId?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type PayrollAssignmentAuditsMinFields = {
  __typename?: 'payrollAssignmentAuditsMinFields';
  assignmentId?: Maybe<Scalars['uuid']['output']>;
  changeReason?: Maybe<Scalars['String']['output']>;
  changedBy?: Maybe<Scalars['uuid']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  fromConsultantId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  payrollDateId?: Maybe<Scalars['uuid']['output']>;
  toConsultantId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "payroll_assignment_audit" */
export type PayrollAssignmentAuditsMinOrderBy = {
  assignmentId?: InputMaybe<OrderBy>;
  changeReason?: InputMaybe<OrderBy>;
  changedBy?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  fromConsultantId?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  toConsultantId?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "payroll_assignment_audit" */
export type PayrollAssignmentAuditsMutationResponse = {
  __typename?: 'payrollAssignmentAuditsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollAssignmentAudits>;
};

/** on_conflict condition type for table "payroll_assignment_audit" */
export type PayrollAssignmentAuditsOnConflict = {
  constraint: PayrollAssignmentAuditsConstraint;
  updateColumns?: Array<PayrollAssignmentAuditsUpdateColumn>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};

/** Ordering options when selecting data from "payroll_assignment_audit". */
export type PayrollAssignmentAuditsOrderBy = {
  assignmentId?: InputMaybe<OrderBy>;
  changeReason?: InputMaybe<OrderBy>;
  changedBy?: InputMaybe<OrderBy>;
  changedByUser?: InputMaybe<UsersOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  fromConsultant?: InputMaybe<UsersOrderBy>;
  fromConsultantId?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payrollAssignment?: InputMaybe<PayrollAssignmentsOrderBy>;
  payrollDate?: InputMaybe<PayrollDatesOrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  toConsultant?: InputMaybe<UsersOrderBy>;
  toConsultantId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_assignment_audit */
export type PayrollAssignmentAuditsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_assignment_audit" */
export enum PayrollAssignmentAuditsSelectColumn {
  /** column name */
  assignmentId = 'assignmentId',
  /** column name */
  changeReason = 'changeReason',
  /** column name */
  changedBy = 'changedBy',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  fromConsultantId = 'fromConsultantId',
  /** column name */
  id = 'id',
  /** column name */
  payrollDateId = 'payrollDateId',
  /** column name */
  toConsultantId = 'toConsultantId'
}

/** input type for updating data in table "payroll_assignment_audit" */
export type PayrollAssignmentAuditsSetInput = {
  assignmentId?: InputMaybe<Scalars['uuid']['input']>;
  changeReason?: InputMaybe<Scalars['String']['input']>;
  changedBy?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  fromConsultantId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  toConsultantId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "payrollAssignmentAudits" */
export type PayrollAssignmentAuditsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PayrollAssignmentAuditsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollAssignmentAuditsStreamCursorValueInput = {
  assignmentId?: InputMaybe<Scalars['uuid']['input']>;
  changeReason?: InputMaybe<Scalars['String']['input']>;
  changedBy?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  fromConsultantId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  toConsultantId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "payroll_assignment_audit" */
export enum PayrollAssignmentAuditsUpdateColumn {
  /** column name */
  assignmentId = 'assignmentId',
  /** column name */
  changeReason = 'changeReason',
  /** column name */
  changedBy = 'changedBy',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  fromConsultantId = 'fromConsultantId',
  /** column name */
  id = 'id',
  /** column name */
  payrollDateId = 'payrollDateId',
  /** column name */
  toConsultantId = 'toConsultantId'
}

export type PayrollAssignmentAuditsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollAssignmentAuditsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollAssignmentAuditsBoolExp;
};

/** columns and relationships of "payroll_assignments" */
export type PayrollAssignments = {
  __typename?: 'payrollAssignments';
  assignedBy?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  assignedByUser?: Maybe<Users>;
  /** An object relationship */
  assignedConsultant: Users;
  assignedDate?: Maybe<Scalars['timestamptz']['output']>;
  consultantId: Scalars['uuid']['output'];
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  isBackup?: Maybe<Scalars['Boolean']['output']>;
  /** An object relationship */
  originalConsultant?: Maybe<Users>;
  originalConsultantId?: Maybe<Scalars['uuid']['output']>;
  /** An array relationship */
  payrollAssignmentAudits: Array<PayrollAssignmentAudits>;
  /** An aggregate relationship */
  payrollAssignmentAuditsAggregate: PayrollAssignmentAuditsAggregate;
  /** An object relationship */
  payrollDate: PayrollDates;
  payrollDateId: Scalars['uuid']['output'];
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "payroll_assignments" */
export type PayrollAssignmentsPayrollAssignmentAuditsArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "payroll_assignments" */
export type PayrollAssignmentsPayrollAssignmentAuditsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};

/** aggregated selection of "payroll_assignments" */
export type PayrollAssignmentsAggregate = {
  __typename?: 'payrollAssignmentsAggregate';
  aggregate?: Maybe<PayrollAssignmentsAggregateFields>;
  nodes: Array<PayrollAssignments>;
};

export type PayrollAssignmentsAggregateBoolExp = {
  bool_and?: InputMaybe<PayrollAssignmentsAggregateBoolExpBoolAnd>;
  bool_or?: InputMaybe<PayrollAssignmentsAggregateBoolExpBoolOr>;
  count?: InputMaybe<PayrollAssignmentsAggregateBoolExpCount>;
};

export type PayrollAssignmentsAggregateBoolExpBoolAnd = {
  arguments: PayrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBoolAndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollAssignmentsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type PayrollAssignmentsAggregateBoolExpBoolOr = {
  arguments: PayrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollAssignmentsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type PayrollAssignmentsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollAssignmentsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "payroll_assignments" */
export type PayrollAssignmentsAggregateFields = {
  __typename?: 'payrollAssignmentsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<PayrollAssignmentsMaxFields>;
  min?: Maybe<PayrollAssignmentsMinFields>;
};


/** aggregate fields of "payroll_assignments" */
export type PayrollAssignmentsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "payroll_assignments" */
export type PayrollAssignmentsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<PayrollAssignmentsMaxOrderBy>;
  min?: InputMaybe<PayrollAssignmentsMinOrderBy>;
};

/** input type for inserting array relation for remote table "payroll_assignments" */
export type PayrollAssignmentsArrRelInsertInput = {
  data: Array<PayrollAssignmentsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollAssignmentsOnConflict>;
};

/** Boolean expression to filter rows from the table "payroll_assignments". All fields are combined with a logical 'AND'. */
export type PayrollAssignmentsBoolExp = {
  _and?: InputMaybe<Array<PayrollAssignmentsBoolExp>>;
  _not?: InputMaybe<PayrollAssignmentsBoolExp>;
  _or?: InputMaybe<Array<PayrollAssignmentsBoolExp>>;
  assignedBy?: InputMaybe<UuidComparisonExp>;
  assignedByUser?: InputMaybe<UsersBoolExp>;
  assignedConsultant?: InputMaybe<UsersBoolExp>;
  assignedDate?: InputMaybe<TimestamptzComparisonExp>;
  consultantId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isBackup?: InputMaybe<BooleanComparisonExp>;
  originalConsultant?: InputMaybe<UsersBoolExp>;
  originalConsultantId?: InputMaybe<UuidComparisonExp>;
  payrollAssignmentAudits?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
  payrollAssignmentAuditsAggregate?: InputMaybe<PayrollAssignmentAuditsAggregateBoolExp>;
  payrollDate?: InputMaybe<PayrollDatesBoolExp>;
  payrollDateId?: InputMaybe<UuidComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "payroll_assignments" */
export enum PayrollAssignmentsConstraint {
  /** unique or primary key constraint on columns "id" */
  payroll_assignments_pkey = 'payroll_assignments_pkey',
  /** unique or primary key constraint on columns "payroll_date_id" */
  uq_payroll_assignment_payroll_date = 'uq_payroll_assignment_payroll_date'
}

/** input type for inserting data into table "payroll_assignments" */
export type PayrollAssignmentsInsertInput = {
  assignedBy?: InputMaybe<Scalars['uuid']['input']>;
  assignedByUser?: InputMaybe<UsersObjRelInsertInput>;
  assignedConsultant?: InputMaybe<UsersObjRelInsertInput>;
  assignedDate?: InputMaybe<Scalars['timestamptz']['input']>;
  consultantId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isBackup?: InputMaybe<Scalars['Boolean']['input']>;
  originalConsultant?: InputMaybe<UsersObjRelInsertInput>;
  originalConsultantId?: InputMaybe<Scalars['uuid']['input']>;
  payrollAssignmentAudits?: InputMaybe<PayrollAssignmentAuditsArrRelInsertInput>;
  payrollDate?: InputMaybe<PayrollDatesObjRelInsertInput>;
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type PayrollAssignmentsMaxFields = {
  __typename?: 'payrollAssignmentsMaxFields';
  assignedBy?: Maybe<Scalars['uuid']['output']>;
  assignedDate?: Maybe<Scalars['timestamptz']['output']>;
  consultantId?: Maybe<Scalars['uuid']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  originalConsultantId?: Maybe<Scalars['uuid']['output']>;
  payrollDateId?: Maybe<Scalars['uuid']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "payroll_assignments" */
export type PayrollAssignmentsMaxOrderBy = {
  assignedBy?: InputMaybe<OrderBy>;
  assignedDate?: InputMaybe<OrderBy>;
  consultantId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  originalConsultantId?: InputMaybe<OrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type PayrollAssignmentsMinFields = {
  __typename?: 'payrollAssignmentsMinFields';
  assignedBy?: Maybe<Scalars['uuid']['output']>;
  assignedDate?: Maybe<Scalars['timestamptz']['output']>;
  consultantId?: Maybe<Scalars['uuid']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  originalConsultantId?: Maybe<Scalars['uuid']['output']>;
  payrollDateId?: Maybe<Scalars['uuid']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "payroll_assignments" */
export type PayrollAssignmentsMinOrderBy = {
  assignedBy?: InputMaybe<OrderBy>;
  assignedDate?: InputMaybe<OrderBy>;
  consultantId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  originalConsultantId?: InputMaybe<OrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "payroll_assignments" */
export type PayrollAssignmentsMutationResponse = {
  __typename?: 'payrollAssignmentsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollAssignments>;
};

/** input type for inserting object relation for remote table "payroll_assignments" */
export type PayrollAssignmentsObjRelInsertInput = {
  data: PayrollAssignmentsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollAssignmentsOnConflict>;
};

/** on_conflict condition type for table "payroll_assignments" */
export type PayrollAssignmentsOnConflict = {
  constraint: PayrollAssignmentsConstraint;
  updateColumns?: Array<PayrollAssignmentsUpdateColumn>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};

/** Ordering options when selecting data from "payroll_assignments". */
export type PayrollAssignmentsOrderBy = {
  assignedBy?: InputMaybe<OrderBy>;
  assignedByUser?: InputMaybe<UsersOrderBy>;
  assignedConsultant?: InputMaybe<UsersOrderBy>;
  assignedDate?: InputMaybe<OrderBy>;
  consultantId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isBackup?: InputMaybe<OrderBy>;
  originalConsultant?: InputMaybe<UsersOrderBy>;
  originalConsultantId?: InputMaybe<OrderBy>;
  payrollAssignmentAuditsAggregate?: InputMaybe<PayrollAssignmentAuditsAggregateOrderBy>;
  payrollDate?: InputMaybe<PayrollDatesOrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_assignments */
export type PayrollAssignmentsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_assignments" */
export enum PayrollAssignmentsSelectColumn {
  /** column name */
  assignedBy = 'assignedBy',
  /** column name */
  assignedDate = 'assignedDate',
  /** column name */
  consultantId = 'consultantId',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  isBackup = 'isBackup',
  /** column name */
  originalConsultantId = 'originalConsultantId',
  /** column name */
  payrollDateId = 'payrollDateId',
  /** column name */
  updatedAt = 'updatedAt'
}

/** select "payrollAssignmentsAggregateBoolExpBool_andArgumentsColumns" columns of table "payroll_assignments" */
export enum PayrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  isBackup = 'isBackup'
}

/** select "payrollAssignmentsAggregateBoolExpBool_orArgumentsColumns" columns of table "payroll_assignments" */
export enum PayrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  isBackup = 'isBackup'
}

/** input type for updating data in table "payroll_assignments" */
export type PayrollAssignmentsSetInput = {
  assignedBy?: InputMaybe<Scalars['uuid']['input']>;
  assignedDate?: InputMaybe<Scalars['timestamptz']['input']>;
  consultantId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isBackup?: InputMaybe<Scalars['Boolean']['input']>;
  originalConsultantId?: InputMaybe<Scalars['uuid']['input']>;
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "payrollAssignments" */
export type PayrollAssignmentsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PayrollAssignmentsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollAssignmentsStreamCursorValueInput = {
  assignedBy?: InputMaybe<Scalars['uuid']['input']>;
  assignedDate?: InputMaybe<Scalars['timestamptz']['input']>;
  consultantId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isBackup?: InputMaybe<Scalars['Boolean']['input']>;
  originalConsultantId?: InputMaybe<Scalars['uuid']['input']>;
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "payroll_assignments" */
export enum PayrollAssignmentsUpdateColumn {
  /** column name */
  assignedBy = 'assignedBy',
  /** column name */
  assignedDate = 'assignedDate',
  /** column name */
  consultantId = 'consultantId',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  isBackup = 'isBackup',
  /** column name */
  originalConsultantId = 'originalConsultantId',
  /** column name */
  payrollDateId = 'payrollDateId',
  /** column name */
  updatedAt = 'updatedAt'
}

export type PayrollAssignmentsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollAssignmentsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollAssignmentsBoolExp;
};

/** columns and relationships of "payroll_cycles" */
export type PayrollCycles = {
  __typename?: 'payrollCycles';
  /** An array relationship */
  adjustmentRules: Array<AdjustmentRules>;
  /** An aggregate relationship */
  adjustmentRulesAggregate: AdjustmentRulesAggregate;
  /** Timestamp when the cycle was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of the payroll cycle */
  description?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll cycle */
  id: Scalars['uuid']['output'];
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name: Scalars['payroll_cycle_type']['output'];
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrollsAggregate: PayrollsAggregate;
  /** Timestamp when the cycle was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "payroll_cycles" */
export type PayrollCyclesAdjustmentRulesArgs = {
  distinctOn?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


/** columns and relationships of "payroll_cycles" */
export type PayrollCyclesAdjustmentRulesAggregateArgs = {
  distinctOn?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


/** columns and relationships of "payroll_cycles" */
export type PayrollCyclesPayrollsArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "payroll_cycles" */
export type PayrollCyclesPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** aggregated selection of "payroll_cycles" */
export type PayrollCyclesAggregate = {
  __typename?: 'payrollCyclesAggregate';
  aggregate?: Maybe<PayrollCyclesAggregateFields>;
  nodes: Array<PayrollCycles>;
};

/** aggregate fields of "payroll_cycles" */
export type PayrollCyclesAggregateFields = {
  __typename?: 'payrollCyclesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<PayrollCyclesMaxFields>;
  min?: Maybe<PayrollCyclesMinFields>;
};


/** aggregate fields of "payroll_cycles" */
export type PayrollCyclesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "payroll_cycles". All fields are combined with a logical 'AND'. */
export type PayrollCyclesBoolExp = {
  _and?: InputMaybe<Array<PayrollCyclesBoolExp>>;
  _not?: InputMaybe<PayrollCyclesBoolExp>;
  _or?: InputMaybe<Array<PayrollCyclesBoolExp>>;
  adjustmentRules?: InputMaybe<AdjustmentRulesBoolExp>;
  adjustmentRulesAggregate?: InputMaybe<AdjustmentRulesAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<PayrollCycleTypeComparisonExp>;
  payrolls?: InputMaybe<PayrollsBoolExp>;
  payrollsAggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "payroll_cycles" */
export enum PayrollCyclesConstraint {
  /** unique or primary key constraint on columns "name" */
  payroll_cycles_name_key = 'payroll_cycles_name_key',
  /** unique or primary key constraint on columns "id" */
  payroll_cycles_pkey = 'payroll_cycles_pkey'
}

/** input type for inserting data into table "payroll_cycles" */
export type PayrollCyclesInsertInput = {
  adjustmentRules?: InputMaybe<AdjustmentRulesArrRelInsertInput>;
  /** Timestamp when the cycle was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Detailed description of the payroll cycle */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the payroll cycle */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  payrolls?: InputMaybe<PayrollsArrRelInsertInput>;
  /** Timestamp when the cycle was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type PayrollCyclesMaxFields = {
  __typename?: 'payrollCyclesMaxFields';
  /** Timestamp when the cycle was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of the payroll cycle */
  description?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll cycle */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name?: Maybe<Scalars['payroll_cycle_type']['output']>;
  /** Timestamp when the cycle was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type PayrollCyclesMinFields = {
  __typename?: 'payrollCyclesMinFields';
  /** Timestamp when the cycle was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of the payroll cycle */
  description?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll cycle */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name?: Maybe<Scalars['payroll_cycle_type']['output']>;
  /** Timestamp when the cycle was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "payroll_cycles" */
export type PayrollCyclesMutationResponse = {
  __typename?: 'payrollCyclesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollCycles>;
};

/** input type for inserting object relation for remote table "payroll_cycles" */
export type PayrollCyclesObjRelInsertInput = {
  data: PayrollCyclesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollCyclesOnConflict>;
};

/** on_conflict condition type for table "payroll_cycles" */
export type PayrollCyclesOnConflict = {
  constraint: PayrollCyclesConstraint;
  updateColumns?: Array<PayrollCyclesUpdateColumn>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};

/** Ordering options when selecting data from "payroll_cycles". */
export type PayrollCyclesOrderBy = {
  adjustmentRulesAggregate?: InputMaybe<AdjustmentRulesAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrollsAggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_cycles */
export type PayrollCyclesPkColumnsInput = {
  /** Unique identifier for the payroll cycle */
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_cycles" */
export enum PayrollCyclesSelectColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updatedAt = 'updatedAt'
}

/** input type for updating data in table "payroll_cycles" */
export type PayrollCyclesSetInput = {
  /** Timestamp when the cycle was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Detailed description of the payroll cycle */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the payroll cycle */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  /** Timestamp when the cycle was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "payrollCycles" */
export type PayrollCyclesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PayrollCyclesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollCyclesStreamCursorValueInput = {
  /** Timestamp when the cycle was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Detailed description of the payroll cycle */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the payroll cycle */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  /** Timestamp when the cycle was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "payroll_cycles" */
export enum PayrollCyclesUpdateColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updatedAt = 'updatedAt'
}

export type PayrollCyclesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollCyclesSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollCyclesBoolExp;
};

/** columns and relationships of "payroll_dashboard_stats" */
export type PayrollDashboardStats = {
  __typename?: 'payrollDashboardStats';
  backupConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  clientName?: Maybe<Scalars['String']['output']>;
  cycleName?: Maybe<Scalars['payroll_cycle_type']['output']>;
  futureDates?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  managerUserId?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  nextEftDate?: Maybe<Scalars['date']['output']>;
  pastDates?: Maybe<Scalars['bigint']['output']>;
  primaryConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['payroll_status']['output']>;
  totalDates?: Maybe<Scalars['bigint']['output']>;
};

/** aggregated selection of "payroll_dashboard_stats" */
export type PayrollDashboardStatsAggregate = {
  __typename?: 'payrollDashboardStatsAggregate';
  aggregate?: Maybe<PayrollDashboardStatsAggregateFields>;
  nodes: Array<PayrollDashboardStats>;
};

/** aggregate fields of "payroll_dashboard_stats" */
export type PayrollDashboardStatsAggregateFields = {
  __typename?: 'payrollDashboardStatsAggregateFields';
  avg?: Maybe<PayrollDashboardStatsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<PayrollDashboardStatsMaxFields>;
  min?: Maybe<PayrollDashboardStatsMinFields>;
  stddev?: Maybe<PayrollDashboardStatsStddevFields>;
  stddevPop?: Maybe<PayrollDashboardStatsStddevPopFields>;
  stddevSamp?: Maybe<PayrollDashboardStatsStddevSampFields>;
  sum?: Maybe<PayrollDashboardStatsSumFields>;
  varPop?: Maybe<PayrollDashboardStatsVarPopFields>;
  varSamp?: Maybe<PayrollDashboardStatsVarSampFields>;
  variance?: Maybe<PayrollDashboardStatsVarianceFields>;
};


/** aggregate fields of "payroll_dashboard_stats" */
export type PayrollDashboardStatsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type PayrollDashboardStatsAvgFields = {
  __typename?: 'payrollDashboardStatsAvgFields';
  futureDates?: Maybe<Scalars['Float']['output']>;
  pastDates?: Maybe<Scalars['Float']['output']>;
  totalDates?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "payroll_dashboard_stats". All fields are combined with a logical 'AND'. */
export type PayrollDashboardStatsBoolExp = {
  _and?: InputMaybe<Array<PayrollDashboardStatsBoolExp>>;
  _not?: InputMaybe<PayrollDashboardStatsBoolExp>;
  _or?: InputMaybe<Array<PayrollDashboardStatsBoolExp>>;
  backupConsultantUserId?: InputMaybe<UuidComparisonExp>;
  clientName?: InputMaybe<StringComparisonExp>;
  cycleName?: InputMaybe<PayrollCycleTypeComparisonExp>;
  futureDates?: InputMaybe<BigintComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  managerUserId?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  nextEftDate?: InputMaybe<DateComparisonExp>;
  pastDates?: InputMaybe<BigintComparisonExp>;
  primaryConsultantUserId?: InputMaybe<UuidComparisonExp>;
  status?: InputMaybe<PayrollStatusComparisonExp>;
  totalDates?: InputMaybe<BigintComparisonExp>;
};

/** aggregate max on columns */
export type PayrollDashboardStatsMaxFields = {
  __typename?: 'payrollDashboardStatsMaxFields';
  backupConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  clientName?: Maybe<Scalars['String']['output']>;
  cycleName?: Maybe<Scalars['payroll_cycle_type']['output']>;
  futureDates?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  managerUserId?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  nextEftDate?: Maybe<Scalars['date']['output']>;
  pastDates?: Maybe<Scalars['bigint']['output']>;
  primaryConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['payroll_status']['output']>;
  totalDates?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type PayrollDashboardStatsMinFields = {
  __typename?: 'payrollDashboardStatsMinFields';
  backupConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  clientName?: Maybe<Scalars['String']['output']>;
  cycleName?: Maybe<Scalars['payroll_cycle_type']['output']>;
  futureDates?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  managerUserId?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  nextEftDate?: Maybe<Scalars['date']['output']>;
  pastDates?: Maybe<Scalars['bigint']['output']>;
  primaryConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['payroll_status']['output']>;
  totalDates?: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "payroll_dashboard_stats". */
export type PayrollDashboardStatsOrderBy = {
  backupConsultantUserId?: InputMaybe<OrderBy>;
  clientName?: InputMaybe<OrderBy>;
  cycleName?: InputMaybe<OrderBy>;
  futureDates?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  managerUserId?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  nextEftDate?: InputMaybe<OrderBy>;
  pastDates?: InputMaybe<OrderBy>;
  primaryConsultantUserId?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  totalDates?: InputMaybe<OrderBy>;
};

/** select columns of table "payroll_dashboard_stats" */
export enum PayrollDashboardStatsSelectColumn {
  /** column name */
  backupConsultantUserId = 'backupConsultantUserId',
  /** column name */
  clientName = 'clientName',
  /** column name */
  cycleName = 'cycleName',
  /** column name */
  futureDates = 'futureDates',
  /** column name */
  id = 'id',
  /** column name */
  managerUserId = 'managerUserId',
  /** column name */
  name = 'name',
  /** column name */
  nextEftDate = 'nextEftDate',
  /** column name */
  pastDates = 'pastDates',
  /** column name */
  primaryConsultantUserId = 'primaryConsultantUserId',
  /** column name */
  status = 'status',
  /** column name */
  totalDates = 'totalDates'
}

/** aggregate stddev on columns */
export type PayrollDashboardStatsStddevFields = {
  __typename?: 'payrollDashboardStatsStddevFields';
  futureDates?: Maybe<Scalars['Float']['output']>;
  pastDates?: Maybe<Scalars['Float']['output']>;
  totalDates?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type PayrollDashboardStatsStddevPopFields = {
  __typename?: 'payrollDashboardStatsStddevPopFields';
  futureDates?: Maybe<Scalars['Float']['output']>;
  pastDates?: Maybe<Scalars['Float']['output']>;
  totalDates?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type PayrollDashboardStatsStddevSampFields = {
  __typename?: 'payrollDashboardStatsStddevSampFields';
  futureDates?: Maybe<Scalars['Float']['output']>;
  pastDates?: Maybe<Scalars['Float']['output']>;
  totalDates?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "payrollDashboardStats" */
export type PayrollDashboardStatsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PayrollDashboardStatsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollDashboardStatsStreamCursorValueInput = {
  backupConsultantUserId?: InputMaybe<Scalars['uuid']['input']>;
  clientName?: InputMaybe<Scalars['String']['input']>;
  cycleName?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  futureDates?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  managerUserId?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  nextEftDate?: InputMaybe<Scalars['date']['input']>;
  pastDates?: InputMaybe<Scalars['bigint']['input']>;
  primaryConsultantUserId?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['payroll_status']['input']>;
  totalDates?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type PayrollDashboardStatsSumFields = {
  __typename?: 'payrollDashboardStatsSumFields';
  futureDates?: Maybe<Scalars['bigint']['output']>;
  pastDates?: Maybe<Scalars['bigint']['output']>;
  totalDates?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate varPop on columns */
export type PayrollDashboardStatsVarPopFields = {
  __typename?: 'payrollDashboardStatsVarPopFields';
  futureDates?: Maybe<Scalars['Float']['output']>;
  pastDates?: Maybe<Scalars['Float']['output']>;
  totalDates?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type PayrollDashboardStatsVarSampFields = {
  __typename?: 'payrollDashboardStatsVarSampFields';
  futureDates?: Maybe<Scalars['Float']['output']>;
  pastDates?: Maybe<Scalars['Float']['output']>;
  totalDates?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type PayrollDashboardStatsVarianceFields = {
  __typename?: 'payrollDashboardStatsVarianceFields';
  futureDates?: Maybe<Scalars['Float']['output']>;
  pastDates?: Maybe<Scalars['Float']['output']>;
  totalDates?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypes = {
  __typename?: 'payrollDateTypes';
  /** An array relationship */
  adjustmentRules: Array<AdjustmentRules>;
  /** An aggregate relationship */
  adjustmentRulesAggregate: AdjustmentRulesAggregate;
  /** Timestamp when the date type was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of how this date type works */
  description?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll date type */
  id: Scalars['uuid']['output'];
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name: Scalars['payroll_date_type']['output'];
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrollsAggregate: PayrollsAggregate;
  /** Timestamp when the date type was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypesAdjustmentRulesArgs = {
  distinctOn?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypesAdjustmentRulesAggregateArgs = {
  distinctOn?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypesPayrollsArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypesPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** aggregated selection of "payroll_date_types" */
export type PayrollDateTypesAggregate = {
  __typename?: 'payrollDateTypesAggregate';
  aggregate?: Maybe<PayrollDateTypesAggregateFields>;
  nodes: Array<PayrollDateTypes>;
};

/** aggregate fields of "payroll_date_types" */
export type PayrollDateTypesAggregateFields = {
  __typename?: 'payrollDateTypesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<PayrollDateTypesMaxFields>;
  min?: Maybe<PayrollDateTypesMinFields>;
};


/** aggregate fields of "payroll_date_types" */
export type PayrollDateTypesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "payroll_date_types". All fields are combined with a logical 'AND'. */
export type PayrollDateTypesBoolExp = {
  _and?: InputMaybe<Array<PayrollDateTypesBoolExp>>;
  _not?: InputMaybe<PayrollDateTypesBoolExp>;
  _or?: InputMaybe<Array<PayrollDateTypesBoolExp>>;
  adjustmentRules?: InputMaybe<AdjustmentRulesBoolExp>;
  adjustmentRulesAggregate?: InputMaybe<AdjustmentRulesAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<PayrollDateTypeComparisonExp>;
  payrolls?: InputMaybe<PayrollsBoolExp>;
  payrollsAggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "payroll_date_types" */
export enum PayrollDateTypesConstraint {
  /** unique or primary key constraint on columns "name" */
  payroll_date_types_name_key = 'payroll_date_types_name_key',
  /** unique or primary key constraint on columns "id" */
  payroll_date_types_pkey = 'payroll_date_types_pkey'
}

/** input type for inserting data into table "payroll_date_types" */
export type PayrollDateTypesInsertInput = {
  adjustmentRules?: InputMaybe<AdjustmentRulesArrRelInsertInput>;
  /** Timestamp when the date type was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Detailed description of how this date type works */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the payroll date type */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name?: InputMaybe<Scalars['payroll_date_type']['input']>;
  payrolls?: InputMaybe<PayrollsArrRelInsertInput>;
  /** Timestamp when the date type was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type PayrollDateTypesMaxFields = {
  __typename?: 'payrollDateTypesMaxFields';
  /** Timestamp when the date type was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of how this date type works */
  description?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll date type */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name?: Maybe<Scalars['payroll_date_type']['output']>;
  /** Timestamp when the date type was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type PayrollDateTypesMinFields = {
  __typename?: 'payrollDateTypesMinFields';
  /** Timestamp when the date type was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of how this date type works */
  description?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll date type */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name?: Maybe<Scalars['payroll_date_type']['output']>;
  /** Timestamp when the date type was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "payroll_date_types" */
export type PayrollDateTypesMutationResponse = {
  __typename?: 'payrollDateTypesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollDateTypes>;
};

/** input type for inserting object relation for remote table "payroll_date_types" */
export type PayrollDateTypesObjRelInsertInput = {
  data: PayrollDateTypesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollDateTypesOnConflict>;
};

/** on_conflict condition type for table "payroll_date_types" */
export type PayrollDateTypesOnConflict = {
  constraint: PayrollDateTypesConstraint;
  updateColumns?: Array<PayrollDateTypesUpdateColumn>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};

/** Ordering options when selecting data from "payroll_date_types". */
export type PayrollDateTypesOrderBy = {
  adjustmentRulesAggregate?: InputMaybe<AdjustmentRulesAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrollsAggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_date_types */
export type PayrollDateTypesPkColumnsInput = {
  /** Unique identifier for the payroll date type */
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_date_types" */
export enum PayrollDateTypesSelectColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updatedAt = 'updatedAt'
}

/** input type for updating data in table "payroll_date_types" */
export type PayrollDateTypesSetInput = {
  /** Timestamp when the date type was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Detailed description of how this date type works */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the payroll date type */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name?: InputMaybe<Scalars['payroll_date_type']['input']>;
  /** Timestamp when the date type was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "payrollDateTypes" */
export type PayrollDateTypesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PayrollDateTypesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollDateTypesStreamCursorValueInput = {
  /** Timestamp when the date type was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Detailed description of how this date type works */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the payroll date type */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name?: InputMaybe<Scalars['payroll_date_type']['input']>;
  /** Timestamp when the date type was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "payroll_date_types" */
export enum PayrollDateTypesUpdateColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updatedAt = 'updatedAt'
}

export type PayrollDateTypesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollDateTypesSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollDateTypesBoolExp;
};

/** columns and relationships of "payroll_dates" */
export type PayrollDates = {
  __typename?: 'payrollDates';
  /** Final EFT date after holiday and weekend adjustments */
  adjustedEftDate: Scalars['date']['output'];
  /** Timestamp when the date record was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the payroll date */
  id: Scalars['uuid']['output'];
  /** Additional notes about this payroll date */
  notes?: Maybe<Scalars['String']['output']>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate: Scalars['date']['output'];
  /** An object relationship */
  payrollAssignment?: Maybe<PayrollAssignments>;
  /** An array relationship */
  payrollAssignmentAudits: Array<PayrollAssignmentAudits>;
  /** An aggregate relationship */
  payrollAssignmentAuditsAggregate: PayrollAssignmentAuditsAggregate;
  /** Reference to the payroll this date belongs to */
  payrollId: Scalars['uuid']['output'];
  /** Date when payroll processing must be completed */
  processingDate: Scalars['date']['output'];
  /** An object relationship */
  relatedPayroll: Payrolls;
  /** Timestamp when the date record was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "payroll_dates" */
export type PayrollDatesPayrollAssignmentAuditsArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "payroll_dates" */
export type PayrollDatesPayrollAssignmentAuditsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};

/** aggregated selection of "payroll_dates" */
export type PayrollDatesAggregate = {
  __typename?: 'payrollDatesAggregate';
  aggregate?: Maybe<PayrollDatesAggregateFields>;
  nodes: Array<PayrollDates>;
};

export type PayrollDatesAggregateBoolExp = {
  count?: InputMaybe<PayrollDatesAggregateBoolExpCount>;
};

export type PayrollDatesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollDatesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "payroll_dates" */
export type PayrollDatesAggregateFields = {
  __typename?: 'payrollDatesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<PayrollDatesMaxFields>;
  min?: Maybe<PayrollDatesMinFields>;
};


/** aggregate fields of "payroll_dates" */
export type PayrollDatesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "payroll_dates" */
export type PayrollDatesAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<PayrollDatesMaxOrderBy>;
  min?: InputMaybe<PayrollDatesMinOrderBy>;
};

/** input type for inserting array relation for remote table "payroll_dates" */
export type PayrollDatesArrRelInsertInput = {
  data: Array<PayrollDatesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollDatesOnConflict>;
};

/** Boolean expression to filter rows from the table "payroll_dates". All fields are combined with a logical 'AND'. */
export type PayrollDatesBoolExp = {
  _and?: InputMaybe<Array<PayrollDatesBoolExp>>;
  _not?: InputMaybe<PayrollDatesBoolExp>;
  _or?: InputMaybe<Array<PayrollDatesBoolExp>>;
  adjustedEftDate?: InputMaybe<DateComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  notes?: InputMaybe<StringComparisonExp>;
  originalEftDate?: InputMaybe<DateComparisonExp>;
  payrollAssignment?: InputMaybe<PayrollAssignmentsBoolExp>;
  payrollAssignmentAudits?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
  payrollAssignmentAuditsAggregate?: InputMaybe<PayrollAssignmentAuditsAggregateBoolExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  processingDate?: InputMaybe<DateComparisonExp>;
  relatedPayroll?: InputMaybe<PayrollsBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "payroll_dates" */
export enum PayrollDatesConstraint {
  /** unique or primary key constraint on columns "original_eft_date", "payroll_id" */
  idx_unique_payroll_date = 'idx_unique_payroll_date',
  /** unique or primary key constraint on columns "id" */
  payroll_dates_pkey = 'payroll_dates_pkey'
}

/** input type for inserting data into table "payroll_dates" */
export type PayrollDatesInsertInput = {
  /** Final EFT date after holiday and weekend adjustments */
  adjustedEftDate?: InputMaybe<Scalars['date']['input']>;
  /** Timestamp when the date record was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate?: InputMaybe<Scalars['date']['input']>;
  payrollAssignment?: InputMaybe<PayrollAssignmentsObjRelInsertInput>;
  payrollAssignmentAudits?: InputMaybe<PayrollAssignmentAuditsArrRelInsertInput>;
  /** Reference to the payroll this date belongs to */
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  /** Date when payroll processing must be completed */
  processingDate?: InputMaybe<Scalars['date']['input']>;
  relatedPayroll?: InputMaybe<PayrollsObjRelInsertInput>;
  /** Timestamp when the date record was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type PayrollDatesMaxFields = {
  __typename?: 'payrollDatesMaxFields';
  /** Final EFT date after holiday and weekend adjustments */
  adjustedEftDate?: Maybe<Scalars['date']['output']>;
  /** Timestamp when the date record was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the payroll date */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Additional notes about this payroll date */
  notes?: Maybe<Scalars['String']['output']>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate?: Maybe<Scalars['date']['output']>;
  /** Reference to the payroll this date belongs to */
  payrollId?: Maybe<Scalars['uuid']['output']>;
  /** Date when payroll processing must be completed */
  processingDate?: Maybe<Scalars['date']['output']>;
  /** Timestamp when the date record was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "payroll_dates" */
export type PayrollDatesMaxOrderBy = {
  /** Final EFT date after holiday and weekend adjustments */
  adjustedEftDate?: InputMaybe<OrderBy>;
  /** Timestamp when the date record was created */
  createdAt?: InputMaybe<OrderBy>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<OrderBy>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<OrderBy>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate?: InputMaybe<OrderBy>;
  /** Reference to the payroll this date belongs to */
  payrollId?: InputMaybe<OrderBy>;
  /** Date when payroll processing must be completed */
  processingDate?: InputMaybe<OrderBy>;
  /** Timestamp when the date record was last updated */
  updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type PayrollDatesMinFields = {
  __typename?: 'payrollDatesMinFields';
  /** Final EFT date after holiday and weekend adjustments */
  adjustedEftDate?: Maybe<Scalars['date']['output']>;
  /** Timestamp when the date record was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the payroll date */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Additional notes about this payroll date */
  notes?: Maybe<Scalars['String']['output']>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate?: Maybe<Scalars['date']['output']>;
  /** Reference to the payroll this date belongs to */
  payrollId?: Maybe<Scalars['uuid']['output']>;
  /** Date when payroll processing must be completed */
  processingDate?: Maybe<Scalars['date']['output']>;
  /** Timestamp when the date record was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "payroll_dates" */
export type PayrollDatesMinOrderBy = {
  /** Final EFT date after holiday and weekend adjustments */
  adjustedEftDate?: InputMaybe<OrderBy>;
  /** Timestamp when the date record was created */
  createdAt?: InputMaybe<OrderBy>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<OrderBy>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<OrderBy>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate?: InputMaybe<OrderBy>;
  /** Reference to the payroll this date belongs to */
  payrollId?: InputMaybe<OrderBy>;
  /** Date when payroll processing must be completed */
  processingDate?: InputMaybe<OrderBy>;
  /** Timestamp when the date record was last updated */
  updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "payroll_dates" */
export type PayrollDatesMutationResponse = {
  __typename?: 'payrollDatesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollDates>;
};

/** input type for inserting object relation for remote table "payroll_dates" */
export type PayrollDatesObjRelInsertInput = {
  data: PayrollDatesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollDatesOnConflict>;
};

/** on_conflict condition type for table "payroll_dates" */
export type PayrollDatesOnConflict = {
  constraint: PayrollDatesConstraint;
  updateColumns?: Array<PayrollDatesUpdateColumn>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};

/** Ordering options when selecting data from "payroll_dates". */
export type PayrollDatesOrderBy = {
  adjustedEftDate?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  originalEftDate?: InputMaybe<OrderBy>;
  payrollAssignment?: InputMaybe<PayrollAssignmentsOrderBy>;
  payrollAssignmentAuditsAggregate?: InputMaybe<PayrollAssignmentAuditsAggregateOrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  processingDate?: InputMaybe<OrderBy>;
  relatedPayroll?: InputMaybe<PayrollsOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_dates */
export type PayrollDatesPkColumnsInput = {
  /** Unique identifier for the payroll date */
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_dates" */
export enum PayrollDatesSelectColumn {
  /** column name */
  adjustedEftDate = 'adjustedEftDate',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  notes = 'notes',
  /** column name */
  originalEftDate = 'originalEftDate',
  /** column name */
  payrollId = 'payrollId',
  /** column name */
  processingDate = 'processingDate',
  /** column name */
  updatedAt = 'updatedAt'
}

/** input type for updating data in table "payroll_dates" */
export type PayrollDatesSetInput = {
  /** Final EFT date after holiday and weekend adjustments */
  adjustedEftDate?: InputMaybe<Scalars['date']['input']>;
  /** Timestamp when the date record was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate?: InputMaybe<Scalars['date']['input']>;
  /** Reference to the payroll this date belongs to */
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  /** Date when payroll processing must be completed */
  processingDate?: InputMaybe<Scalars['date']['input']>;
  /** Timestamp when the date record was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "payrollDates" */
export type PayrollDatesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PayrollDatesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollDatesStreamCursorValueInput = {
  /** Final EFT date after holiday and weekend adjustments */
  adjustedEftDate?: InputMaybe<Scalars['date']['input']>;
  /** Timestamp when the date record was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate?: InputMaybe<Scalars['date']['input']>;
  /** Reference to the payroll this date belongs to */
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  /** Date when payroll processing must be completed */
  processingDate?: InputMaybe<Scalars['date']['input']>;
  /** Timestamp when the date record was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "payroll_dates" */
export enum PayrollDatesUpdateColumn {
  /** column name */
  adjustedEftDate = 'adjustedEftDate',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  notes = 'notes',
  /** column name */
  originalEftDate = 'originalEftDate',
  /** column name */
  payrollId = 'payrollId',
  /** column name */
  processingDate = 'processingDate',
  /** column name */
  updatedAt = 'updatedAt'
}

export type PayrollDatesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollDatesSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollDatesBoolExp;
};

/** columns and relationships of "payroll_triggers_status" */
export type PayrollTriggersStatus = {
  __typename?: 'payrollTriggersStatus';
  actionStatement?: Maybe<Scalars['String']['output']>;
  actionTiming?: Maybe<Scalars['String']['output']>;
  eventManipulation?: Maybe<Scalars['String']['output']>;
  eventObjectTable?: Maybe<Scalars['name']['output']>;
  triggerName?: Maybe<Scalars['name']['output']>;
};

/** aggregated selection of "payroll_triggers_status" */
export type PayrollTriggersStatusAggregate = {
  __typename?: 'payrollTriggersStatusAggregate';
  aggregate?: Maybe<PayrollTriggersStatusAggregateFields>;
  nodes: Array<PayrollTriggersStatus>;
};

/** aggregate fields of "payroll_triggers_status" */
export type PayrollTriggersStatusAggregateFields = {
  __typename?: 'payrollTriggersStatusAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<PayrollTriggersStatusMaxFields>;
  min?: Maybe<PayrollTriggersStatusMinFields>;
};


/** aggregate fields of "payroll_triggers_status" */
export type PayrollTriggersStatusAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "payroll_triggers_status". All fields are combined with a logical 'AND'. */
export type PayrollTriggersStatusBoolExp = {
  _and?: InputMaybe<Array<PayrollTriggersStatusBoolExp>>;
  _not?: InputMaybe<PayrollTriggersStatusBoolExp>;
  _or?: InputMaybe<Array<PayrollTriggersStatusBoolExp>>;
  actionStatement?: InputMaybe<StringComparisonExp>;
  actionTiming?: InputMaybe<StringComparisonExp>;
  eventManipulation?: InputMaybe<StringComparisonExp>;
  eventObjectTable?: InputMaybe<NameComparisonExp>;
  triggerName?: InputMaybe<NameComparisonExp>;
};

/** aggregate max on columns */
export type PayrollTriggersStatusMaxFields = {
  __typename?: 'payrollTriggersStatusMaxFields';
  actionStatement?: Maybe<Scalars['String']['output']>;
  actionTiming?: Maybe<Scalars['String']['output']>;
  eventManipulation?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type PayrollTriggersStatusMinFields = {
  __typename?: 'payrollTriggersStatusMinFields';
  actionStatement?: Maybe<Scalars['String']['output']>;
  actionTiming?: Maybe<Scalars['String']['output']>;
  eventManipulation?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "payroll_triggers_status". */
export type PayrollTriggersStatusOrderBy = {
  actionStatement?: InputMaybe<OrderBy>;
  actionTiming?: InputMaybe<OrderBy>;
  eventManipulation?: InputMaybe<OrderBy>;
  eventObjectTable?: InputMaybe<OrderBy>;
  triggerName?: InputMaybe<OrderBy>;
};

/** select columns of table "payroll_triggers_status" */
export enum PayrollTriggersStatusSelectColumn {
  /** column name */
  actionStatement = 'actionStatement',
  /** column name */
  actionTiming = 'actionTiming',
  /** column name */
  eventManipulation = 'eventManipulation',
  /** column name */
  eventObjectTable = 'eventObjectTable',
  /** column name */
  triggerName = 'triggerName'
}

/** Streaming cursor of the table "payrollTriggersStatus" */
export type PayrollTriggersStatusStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PayrollTriggersStatusStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollTriggersStatusStreamCursorValueInput = {
  actionStatement?: InputMaybe<Scalars['String']['input']>;
  actionTiming?: InputMaybe<Scalars['String']['input']>;
  eventManipulation?: InputMaybe<Scalars['String']['input']>;
  eventObjectTable?: InputMaybe<Scalars['name']['input']>;
  triggerName?: InputMaybe<Scalars['name']['input']>;
};

/** columns and relationships of "payroll_version_history_results" */
export type PayrollVersionHistoryResults = {
  __typename?: 'payrollVersionHistoryResults';
  active: Scalars['Boolean']['output'];
  goLiveDate?: Maybe<Scalars['date']['output']>;
  id: Scalars['uuid']['output'];
  isCurrent: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  payrollId: Scalars['uuid']['output'];
  queriedAt?: Maybe<Scalars['timestamptz']['output']>;
  supersededDate?: Maybe<Scalars['date']['output']>;
  versionNumber: Scalars['Int']['output'];
  versionReason?: Maybe<Scalars['String']['output']>;
};

export type PayrollVersionHistoryResultsAggregate = {
  __typename?: 'payrollVersionHistoryResultsAggregate';
  aggregate?: Maybe<PayrollVersionHistoryResultsAggregateFields>;
  nodes: Array<PayrollVersionHistoryResults>;
};

/** aggregate fields of "payroll_version_history_results" */
export type PayrollVersionHistoryResultsAggregateFields = {
  __typename?: 'payrollVersionHistoryResultsAggregateFields';
  avg?: Maybe<PayrollVersionHistoryResultsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<PayrollVersionHistoryResultsMaxFields>;
  min?: Maybe<PayrollVersionHistoryResultsMinFields>;
  stddev?: Maybe<PayrollVersionHistoryResultsStddevFields>;
  stddevPop?: Maybe<PayrollVersionHistoryResultsStddevPopFields>;
  stddevSamp?: Maybe<PayrollVersionHistoryResultsStddevSampFields>;
  sum?: Maybe<PayrollVersionHistoryResultsSumFields>;
  varPop?: Maybe<PayrollVersionHistoryResultsVarPopFields>;
  varSamp?: Maybe<PayrollVersionHistoryResultsVarSampFields>;
  variance?: Maybe<PayrollVersionHistoryResultsVarianceFields>;
};


/** aggregate fields of "payroll_version_history_results" */
export type PayrollVersionHistoryResultsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type PayrollVersionHistoryResultsAvgFields = {
  __typename?: 'payrollVersionHistoryResultsAvgFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "payroll_version_history_results". All fields are combined with a logical 'AND'. */
export type PayrollVersionHistoryResultsBoolExp = {
  _and?: InputMaybe<Array<PayrollVersionHistoryResultsBoolExp>>;
  _not?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
  _or?: InputMaybe<Array<PayrollVersionHistoryResultsBoolExp>>;
  active?: InputMaybe<BooleanComparisonExp>;
  goLiveDate?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isCurrent?: InputMaybe<BooleanComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  queriedAt?: InputMaybe<TimestamptzComparisonExp>;
  supersededDate?: InputMaybe<DateComparisonExp>;
  versionNumber?: InputMaybe<IntComparisonExp>;
  versionReason?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "payroll_version_history_results" */
export enum PayrollVersionHistoryResultsConstraint {
  /** unique or primary key constraint on columns "id" */
  payroll_version_history_results_pkey = 'payroll_version_history_results_pkey'
}

/** input type for incrementing numeric columns in table "payroll_version_history_results" */
export type PayrollVersionHistoryResultsIncInput = {
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "payroll_version_history_results" */
export type PayrollVersionHistoryResultsInsertInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isCurrent?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  queriedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  supersededDate?: InputMaybe<Scalars['date']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
  versionReason?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type PayrollVersionHistoryResultsMaxFields = {
  __typename?: 'payrollVersionHistoryResultsMaxFields';
  goLiveDate?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  payrollId?: Maybe<Scalars['uuid']['output']>;
  queriedAt?: Maybe<Scalars['timestamptz']['output']>;
  supersededDate?: Maybe<Scalars['date']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
  versionReason?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type PayrollVersionHistoryResultsMinFields = {
  __typename?: 'payrollVersionHistoryResultsMinFields';
  goLiveDate?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  payrollId?: Maybe<Scalars['uuid']['output']>;
  queriedAt?: Maybe<Scalars['timestamptz']['output']>;
  supersededDate?: Maybe<Scalars['date']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
  versionReason?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "payroll_version_history_results" */
export type PayrollVersionHistoryResultsMutationResponse = {
  __typename?: 'payrollVersionHistoryResultsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollVersionHistoryResults>;
};

/** on_conflict condition type for table "payroll_version_history_results" */
export type PayrollVersionHistoryResultsOnConflict = {
  constraint: PayrollVersionHistoryResultsConstraint;
  updateColumns?: Array<PayrollVersionHistoryResultsUpdateColumn>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};

/** Ordering options when selecting data from "payroll_version_history_results". */
export type PayrollVersionHistoryResultsOrderBy = {
  active?: InputMaybe<OrderBy>;
  goLiveDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isCurrent?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  queriedAt?: InputMaybe<OrderBy>;
  supersededDate?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
  versionReason?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_version_history_results */
export type PayrollVersionHistoryResultsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_version_history_results" */
export enum PayrollVersionHistoryResultsSelectColumn {
  /** column name */
  active = 'active',
  /** column name */
  goLiveDate = 'goLiveDate',
  /** column name */
  id = 'id',
  /** column name */
  isCurrent = 'isCurrent',
  /** column name */
  name = 'name',
  /** column name */
  payrollId = 'payrollId',
  /** column name */
  queriedAt = 'queriedAt',
  /** column name */
  supersededDate = 'supersededDate',
  /** column name */
  versionNumber = 'versionNumber',
  /** column name */
  versionReason = 'versionReason'
}

/** input type for updating data in table "payroll_version_history_results" */
export type PayrollVersionHistoryResultsSetInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isCurrent?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  queriedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  supersededDate?: InputMaybe<Scalars['date']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
  versionReason?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type PayrollVersionHistoryResultsStddevFields = {
  __typename?: 'payrollVersionHistoryResultsStddevFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type PayrollVersionHistoryResultsStddevPopFields = {
  __typename?: 'payrollVersionHistoryResultsStddevPopFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type PayrollVersionHistoryResultsStddevSampFields = {
  __typename?: 'payrollVersionHistoryResultsStddevSampFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "payrollVersionHistoryResults" */
export type PayrollVersionHistoryResultsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PayrollVersionHistoryResultsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollVersionHistoryResultsStreamCursorValueInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isCurrent?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  queriedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  supersededDate?: InputMaybe<Scalars['date']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
  versionReason?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type PayrollVersionHistoryResultsSumFields = {
  __typename?: 'payrollVersionHistoryResultsSumFields';
  versionNumber?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "payroll_version_history_results" */
export enum PayrollVersionHistoryResultsUpdateColumn {
  /** column name */
  active = 'active',
  /** column name */
  goLiveDate = 'goLiveDate',
  /** column name */
  id = 'id',
  /** column name */
  isCurrent = 'isCurrent',
  /** column name */
  name = 'name',
  /** column name */
  payrollId = 'payrollId',
  /** column name */
  queriedAt = 'queriedAt',
  /** column name */
  supersededDate = 'supersededDate',
  /** column name */
  versionNumber = 'versionNumber',
  /** column name */
  versionReason = 'versionReason'
}

export type PayrollVersionHistoryResultsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<PayrollVersionHistoryResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollVersionHistoryResultsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollVersionHistoryResultsBoolExp;
};

/** aggregate varPop on columns */
export type PayrollVersionHistoryResultsVarPopFields = {
  __typename?: 'payrollVersionHistoryResultsVarPopFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type PayrollVersionHistoryResultsVarSampFields = {
  __typename?: 'payrollVersionHistoryResultsVarSampFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type PayrollVersionHistoryResultsVarianceFields = {
  __typename?: 'payrollVersionHistoryResultsVarianceFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "payroll_version_results" */
export type PayrollVersionResults = {
  __typename?: 'payrollVersionResults';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  createdByUserId?: Maybe<Scalars['uuid']['output']>;
  datesDeleted: Scalars['Int']['output'];
  id: Scalars['uuid']['output'];
  message: Scalars['String']['output'];
  newPayrollId: Scalars['uuid']['output'];
  newVersionNumber: Scalars['Int']['output'];
  oldPayrollId: Scalars['uuid']['output'];
};

export type PayrollVersionResultsAggregate = {
  __typename?: 'payrollVersionResultsAggregate';
  aggregate?: Maybe<PayrollVersionResultsAggregateFields>;
  nodes: Array<PayrollVersionResults>;
};

/** aggregate fields of "payroll_version_results" */
export type PayrollVersionResultsAggregateFields = {
  __typename?: 'payrollVersionResultsAggregateFields';
  avg?: Maybe<PayrollVersionResultsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<PayrollVersionResultsMaxFields>;
  min?: Maybe<PayrollVersionResultsMinFields>;
  stddev?: Maybe<PayrollVersionResultsStddevFields>;
  stddevPop?: Maybe<PayrollVersionResultsStddevPopFields>;
  stddevSamp?: Maybe<PayrollVersionResultsStddevSampFields>;
  sum?: Maybe<PayrollVersionResultsSumFields>;
  varPop?: Maybe<PayrollVersionResultsVarPopFields>;
  varSamp?: Maybe<PayrollVersionResultsVarSampFields>;
  variance?: Maybe<PayrollVersionResultsVarianceFields>;
};


/** aggregate fields of "payroll_version_results" */
export type PayrollVersionResultsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type PayrollVersionResultsAvgFields = {
  __typename?: 'payrollVersionResultsAvgFields';
  datesDeleted?: Maybe<Scalars['Float']['output']>;
  newVersionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "payroll_version_results". All fields are combined with a logical 'AND'. */
export type PayrollVersionResultsBoolExp = {
  _and?: InputMaybe<Array<PayrollVersionResultsBoolExp>>;
  _not?: InputMaybe<PayrollVersionResultsBoolExp>;
  _or?: InputMaybe<Array<PayrollVersionResultsBoolExp>>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdByUserId?: InputMaybe<UuidComparisonExp>;
  datesDeleted?: InputMaybe<IntComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  message?: InputMaybe<StringComparisonExp>;
  newPayrollId?: InputMaybe<UuidComparisonExp>;
  newVersionNumber?: InputMaybe<IntComparisonExp>;
  oldPayrollId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "payroll_version_results" */
export enum PayrollVersionResultsConstraint {
  /** unique or primary key constraint on columns "id" */
  payroll_version_results_pkey = 'payroll_version_results_pkey'
}

/** input type for incrementing numeric columns in table "payroll_version_results" */
export type PayrollVersionResultsIncInput = {
  datesDeleted?: InputMaybe<Scalars['Int']['input']>;
  newVersionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "payroll_version_results" */
export type PayrollVersionResultsInsertInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  datesDeleted?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  newPayrollId?: InputMaybe<Scalars['uuid']['input']>;
  newVersionNumber?: InputMaybe<Scalars['Int']['input']>;
  oldPayrollId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type PayrollVersionResultsMaxFields = {
  __typename?: 'payrollVersionResultsMaxFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  createdByUserId?: Maybe<Scalars['uuid']['output']>;
  datesDeleted?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  newPayrollId?: Maybe<Scalars['uuid']['output']>;
  newVersionNumber?: Maybe<Scalars['Int']['output']>;
  oldPayrollId?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type PayrollVersionResultsMinFields = {
  __typename?: 'payrollVersionResultsMinFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  createdByUserId?: Maybe<Scalars['uuid']['output']>;
  datesDeleted?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  newPayrollId?: Maybe<Scalars['uuid']['output']>;
  newVersionNumber?: Maybe<Scalars['Int']['output']>;
  oldPayrollId?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "payroll_version_results" */
export type PayrollVersionResultsMutationResponse = {
  __typename?: 'payrollVersionResultsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollVersionResults>;
};

/** on_conflict condition type for table "payroll_version_results" */
export type PayrollVersionResultsOnConflict = {
  constraint: PayrollVersionResultsConstraint;
  updateColumns?: Array<PayrollVersionResultsUpdateColumn>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};

/** Ordering options when selecting data from "payroll_version_results". */
export type PayrollVersionResultsOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  createdByUserId?: InputMaybe<OrderBy>;
  datesDeleted?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
  newPayrollId?: InputMaybe<OrderBy>;
  newVersionNumber?: InputMaybe<OrderBy>;
  oldPayrollId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_version_results */
export type PayrollVersionResultsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_version_results" */
export enum PayrollVersionResultsSelectColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  createdByUserId = 'createdByUserId',
  /** column name */
  datesDeleted = 'datesDeleted',
  /** column name */
  id = 'id',
  /** column name */
  message = 'message',
  /** column name */
  newPayrollId = 'newPayrollId',
  /** column name */
  newVersionNumber = 'newVersionNumber',
  /** column name */
  oldPayrollId = 'oldPayrollId'
}

/** input type for updating data in table "payroll_version_results" */
export type PayrollVersionResultsSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  datesDeleted?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  newPayrollId?: InputMaybe<Scalars['uuid']['input']>;
  newVersionNumber?: InputMaybe<Scalars['Int']['input']>;
  oldPayrollId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type PayrollVersionResultsStddevFields = {
  __typename?: 'payrollVersionResultsStddevFields';
  datesDeleted?: Maybe<Scalars['Float']['output']>;
  newVersionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type PayrollVersionResultsStddevPopFields = {
  __typename?: 'payrollVersionResultsStddevPopFields';
  datesDeleted?: Maybe<Scalars['Float']['output']>;
  newVersionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type PayrollVersionResultsStddevSampFields = {
  __typename?: 'payrollVersionResultsStddevSampFields';
  datesDeleted?: Maybe<Scalars['Float']['output']>;
  newVersionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "payrollVersionResults" */
export type PayrollVersionResultsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PayrollVersionResultsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollVersionResultsStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  datesDeleted?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  newPayrollId?: InputMaybe<Scalars['uuid']['input']>;
  newVersionNumber?: InputMaybe<Scalars['Int']['input']>;
  oldPayrollId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type PayrollVersionResultsSumFields = {
  __typename?: 'payrollVersionResultsSumFields';
  datesDeleted?: Maybe<Scalars['Int']['output']>;
  newVersionNumber?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "payroll_version_results" */
export enum PayrollVersionResultsUpdateColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  createdByUserId = 'createdByUserId',
  /** column name */
  datesDeleted = 'datesDeleted',
  /** column name */
  id = 'id',
  /** column name */
  message = 'message',
  /** column name */
  newPayrollId = 'newPayrollId',
  /** column name */
  newVersionNumber = 'newVersionNumber',
  /** column name */
  oldPayrollId = 'oldPayrollId'
}

export type PayrollVersionResultsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<PayrollVersionResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollVersionResultsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollVersionResultsBoolExp;
};

/** aggregate varPop on columns */
export type PayrollVersionResultsVarPopFields = {
  __typename?: 'payrollVersionResultsVarPopFields';
  datesDeleted?: Maybe<Scalars['Float']['output']>;
  newVersionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type PayrollVersionResultsVarSampFields = {
  __typename?: 'payrollVersionResultsVarSampFields';
  datesDeleted?: Maybe<Scalars['Float']['output']>;
  newVersionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type PayrollVersionResultsVarianceFields = {
  __typename?: 'payrollVersionResultsVarianceFields';
  datesDeleted?: Maybe<Scalars['Float']['output']>;
  newVersionNumber?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "payrolls" */
export type Payrolls = {
  __typename?: 'payrolls';
  /** An object relationship */
  backupConsultant?: Maybe<Users>;
  /** Backup consultant for this payroll */
  backupConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  /** An array relationship */
  billingItems: Array<BillingItems>;
  /** An aggregate relationship */
  billingItemsAggregate: BillingItemsAggregate;
  /** An array relationship */
  childPayrolls: Array<Payrolls>;
  /** An aggregate relationship */
  childPayrollsAggregate: PayrollsAggregate;
  /** An object relationship */
  client: Clients;
  /** Reference to the client this payroll belongs to */
  clientId: Scalars['uuid']['output'];
  /** Timestamp when the payroll was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  createdByUserId?: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll cycle */
  cycleId: Scalars['uuid']['output'];
  /** Reference to the payroll date type */
  dateTypeId: Scalars['uuid']['output'];
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: Maybe<Scalars['Int']['output']>;
  /** Number of employees in this payroll */
  employeeCount?: Maybe<Scalars['Int']['output']>;
  /** The date when the payroll went live in the system */
  goLiveDate?: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the payroll */
  id: Scalars['uuid']['output'];
  /** An object relationship */
  manager?: Maybe<Users>;
  /** Manager overseeing this payroll */
  managerUserId?: Maybe<Scalars['uuid']['output']>;
  /** Name of the payroll */
  name: Scalars['String']['output'];
  /** An object relationship */
  parentPayroll?: Maybe<Payrolls>;
  parentPayrollId?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  payrollCycle: PayrollCycles;
  /** An object relationship */
  payrollDateType: PayrollDateTypes;
  /** An array relationship */
  payrollDates: Array<PayrollDates>;
  /** An aggregate relationship */
  payrollDatesAggregate: PayrollDatesAggregate;
  /** External payroll system used for this client */
  payrollSystem?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  primaryConsultant?: Maybe<Users>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Scalars['Int']['output'];
  /** Number of hours required to process this payroll */
  processingTime: Scalars['Int']['output'];
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status: Scalars['payroll_status']['output'];
  supersededDate?: Maybe<Scalars['date']['output']>;
  /** Timestamp when the payroll was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
  versionReason?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "payrolls" */
export type PayrollsBillingItemsArgs = {
  distinctOn?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


/** columns and relationships of "payrolls" */
export type PayrollsBillingItemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


/** columns and relationships of "payrolls" */
export type PayrollsChildPayrollsArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "payrolls" */
export type PayrollsChildPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "payrolls" */
export type PayrollsPayrollDatesArgs = {
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


/** columns and relationships of "payrolls" */
export type PayrollsPayrollDatesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};

/** aggregated selection of "payrolls" */
export type PayrollsAggregate = {
  __typename?: 'payrollsAggregate';
  aggregate?: Maybe<PayrollsAggregateFields>;
  nodes: Array<Payrolls>;
};

export type PayrollsAggregateBoolExp = {
  count?: InputMaybe<PayrollsAggregateBoolExpCount>;
};

export type PayrollsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PayrollsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "payrolls" */
export type PayrollsAggregateFields = {
  __typename?: 'payrollsAggregateFields';
  avg?: Maybe<PayrollsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<PayrollsMaxFields>;
  min?: Maybe<PayrollsMinFields>;
  stddev?: Maybe<PayrollsStddevFields>;
  stddevPop?: Maybe<PayrollsStddevPopFields>;
  stddevSamp?: Maybe<PayrollsStddevSampFields>;
  sum?: Maybe<PayrollsSumFields>;
  varPop?: Maybe<PayrollsVarPopFields>;
  varSamp?: Maybe<PayrollsVarSampFields>;
  variance?: Maybe<PayrollsVarianceFields>;
};


/** aggregate fields of "payrolls" */
export type PayrollsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "payrolls" */
export type PayrollsAggregateOrderBy = {
  avg?: InputMaybe<PayrollsAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<PayrollsMaxOrderBy>;
  min?: InputMaybe<PayrollsMinOrderBy>;
  stddev?: InputMaybe<PayrollsStddevOrderBy>;
  stddevPop?: InputMaybe<PayrollsStddevPopOrderBy>;
  stddevSamp?: InputMaybe<PayrollsStddevSampOrderBy>;
  sum?: InputMaybe<PayrollsSumOrderBy>;
  varPop?: InputMaybe<PayrollsVarPopOrderBy>;
  varSamp?: InputMaybe<PayrollsVarSampOrderBy>;
  variance?: InputMaybe<PayrollsVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "payrolls" */
export type PayrollsArrRelInsertInput = {
  data: Array<PayrollsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollsOnConflict>;
};

/** aggregate avg on columns */
export type PayrollsAvgFields = {
  __typename?: 'payrollsAvgFields';
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employeeCount?: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processingTime?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "payrolls" */
export type PayrollsAvgOrderBy = {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "payrolls". All fields are combined with a logical 'AND'. */
export type PayrollsBoolExp = {
  _and?: InputMaybe<Array<PayrollsBoolExp>>;
  _not?: InputMaybe<PayrollsBoolExp>;
  _or?: InputMaybe<Array<PayrollsBoolExp>>;
  backupConsultant?: InputMaybe<UsersBoolExp>;
  backupConsultantUserId?: InputMaybe<UuidComparisonExp>;
  billingItems?: InputMaybe<BillingItemsBoolExp>;
  billingItemsAggregate?: InputMaybe<BillingItemsAggregateBoolExp>;
  childPayrolls?: InputMaybe<PayrollsBoolExp>;
  childPayrollsAggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  client?: InputMaybe<ClientsBoolExp>;
  clientId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdByUserId?: InputMaybe<UuidComparisonExp>;
  cycleId?: InputMaybe<UuidComparisonExp>;
  dateTypeId?: InputMaybe<UuidComparisonExp>;
  dateValue?: InputMaybe<IntComparisonExp>;
  employeeCount?: InputMaybe<IntComparisonExp>;
  goLiveDate?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  manager?: InputMaybe<UsersBoolExp>;
  managerUserId?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  parentPayroll?: InputMaybe<PayrollsBoolExp>;
  parentPayrollId?: InputMaybe<UuidComparisonExp>;
  payrollCycle?: InputMaybe<PayrollCyclesBoolExp>;
  payrollDateType?: InputMaybe<PayrollDateTypesBoolExp>;
  payrollDates?: InputMaybe<PayrollDatesBoolExp>;
  payrollDatesAggregate?: InputMaybe<PayrollDatesAggregateBoolExp>;
  payrollSystem?: InputMaybe<StringComparisonExp>;
  primaryConsultant?: InputMaybe<UsersBoolExp>;
  primaryConsultantUserId?: InputMaybe<UuidComparisonExp>;
  processingDaysBeforeEft?: InputMaybe<IntComparisonExp>;
  processingTime?: InputMaybe<IntComparisonExp>;
  status?: InputMaybe<PayrollStatusComparisonExp>;
  supersededDate?: InputMaybe<DateComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  versionNumber?: InputMaybe<IntComparisonExp>;
  versionReason?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "payrolls" */
export enum PayrollsConstraint {
  /** unique or primary key constraint on columns  */
  only_one_current_version_per_family = 'only_one_current_version_per_family',
  /** unique or primary key constraint on columns "id" */
  payrolls_pkey = 'payrolls_pkey'
}

/** input type for incrementing numeric columns in table "payrolls" */
export type PayrollsIncInput = {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<Scalars['Int']['input']>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<Scalars['Int']['input']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<Scalars['Int']['input']>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<Scalars['Int']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "payrolls" */
export type PayrollsInsertInput = {
  backupConsultant?: InputMaybe<UsersObjRelInsertInput>;
  /** Backup consultant for this payroll */
  backupConsultantUserId?: InputMaybe<Scalars['uuid']['input']>;
  billingItems?: InputMaybe<BillingItemsArrRelInsertInput>;
  childPayrolls?: InputMaybe<PayrollsArrRelInsertInput>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  /** Reference to the client this payroll belongs to */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the payroll was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll cycle */
  cycleId?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll date type */
  dateTypeId?: InputMaybe<Scalars['uuid']['input']>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<Scalars['Int']['input']>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<Scalars['Int']['input']>;
  /** The date when the payroll went live in the system */
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<Scalars['uuid']['input']>;
  manager?: InputMaybe<UsersObjRelInsertInput>;
  /** Manager overseeing this payroll */
  managerUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the payroll */
  name?: InputMaybe<Scalars['String']['input']>;
  parentPayroll?: InputMaybe<PayrollsObjRelInsertInput>;
  parentPayrollId?: InputMaybe<Scalars['uuid']['input']>;
  payrollCycle?: InputMaybe<PayrollCyclesObjRelInsertInput>;
  payrollDateType?: InputMaybe<PayrollDateTypesObjRelInsertInput>;
  payrollDates?: InputMaybe<PayrollDatesArrRelInsertInput>;
  /** External payroll system used for this client */
  payrollSystem?: InputMaybe<Scalars['String']['input']>;
  primaryConsultant?: InputMaybe<UsersObjRelInsertInput>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<Scalars['Int']['input']>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<Scalars['Int']['input']>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<Scalars['payroll_status']['input']>;
  supersededDate?: InputMaybe<Scalars['date']['input']>;
  /** Timestamp when the payroll was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
  versionReason?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type PayrollsMaxFields = {
  __typename?: 'payrollsMaxFields';
  /** Backup consultant for this payroll */
  backupConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  /** Reference to the client this payroll belongs to */
  clientId?: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the payroll was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  createdByUserId?: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll cycle */
  cycleId?: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll date type */
  dateTypeId?: Maybe<Scalars['uuid']['output']>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: Maybe<Scalars['Int']['output']>;
  /** Number of employees in this payroll */
  employeeCount?: Maybe<Scalars['Int']['output']>;
  /** The date when the payroll went live in the system */
  goLiveDate?: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the payroll */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Manager overseeing this payroll */
  managerUserId?: Maybe<Scalars['uuid']['output']>;
  /** Name of the payroll */
  name?: Maybe<Scalars['String']['output']>;
  parentPayrollId?: Maybe<Scalars['uuid']['output']>;
  /** External payroll system used for this client */
  payrollSystem?: Maybe<Scalars['String']['output']>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: Maybe<Scalars['Int']['output']>;
  /** Number of hours required to process this payroll */
  processingTime?: Maybe<Scalars['Int']['output']>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: Maybe<Scalars['payroll_status']['output']>;
  supersededDate?: Maybe<Scalars['date']['output']>;
  /** Timestamp when the payroll was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
  versionReason?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "payrolls" */
export type PayrollsMaxOrderBy = {
  /** Backup consultant for this payroll */
  backupConsultantUserId?: InputMaybe<OrderBy>;
  /** Reference to the client this payroll belongs to */
  clientId?: InputMaybe<OrderBy>;
  /** Timestamp when the payroll was created */
  createdAt?: InputMaybe<OrderBy>;
  createdByUserId?: InputMaybe<OrderBy>;
  /** Reference to the payroll cycle */
  cycleId?: InputMaybe<OrderBy>;
  /** Reference to the payroll date type */
  dateTypeId?: InputMaybe<OrderBy>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** The date when the payroll went live in the system */
  goLiveDate?: InputMaybe<OrderBy>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<OrderBy>;
  /** Manager overseeing this payroll */
  managerUserId?: InputMaybe<OrderBy>;
  /** Name of the payroll */
  name?: InputMaybe<OrderBy>;
  parentPayrollId?: InputMaybe<OrderBy>;
  /** External payroll system used for this client */
  payrollSystem?: InputMaybe<OrderBy>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<OrderBy>;
  supersededDate?: InputMaybe<OrderBy>;
  /** Timestamp when the payroll was last updated */
  updatedAt?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
  versionReason?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type PayrollsMinFields = {
  __typename?: 'payrollsMinFields';
  /** Backup consultant for this payroll */
  backupConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  /** Reference to the client this payroll belongs to */
  clientId?: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the payroll was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  createdByUserId?: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll cycle */
  cycleId?: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll date type */
  dateTypeId?: Maybe<Scalars['uuid']['output']>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: Maybe<Scalars['Int']['output']>;
  /** Number of employees in this payroll */
  employeeCount?: Maybe<Scalars['Int']['output']>;
  /** The date when the payroll went live in the system */
  goLiveDate?: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the payroll */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Manager overseeing this payroll */
  managerUserId?: Maybe<Scalars['uuid']['output']>;
  /** Name of the payroll */
  name?: Maybe<Scalars['String']['output']>;
  parentPayrollId?: Maybe<Scalars['uuid']['output']>;
  /** External payroll system used for this client */
  payrollSystem?: Maybe<Scalars['String']['output']>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: Maybe<Scalars['Int']['output']>;
  /** Number of hours required to process this payroll */
  processingTime?: Maybe<Scalars['Int']['output']>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: Maybe<Scalars['payroll_status']['output']>;
  supersededDate?: Maybe<Scalars['date']['output']>;
  /** Timestamp when the payroll was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
  versionReason?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "payrolls" */
export type PayrollsMinOrderBy = {
  /** Backup consultant for this payroll */
  backupConsultantUserId?: InputMaybe<OrderBy>;
  /** Reference to the client this payroll belongs to */
  clientId?: InputMaybe<OrderBy>;
  /** Timestamp when the payroll was created */
  createdAt?: InputMaybe<OrderBy>;
  createdByUserId?: InputMaybe<OrderBy>;
  /** Reference to the payroll cycle */
  cycleId?: InputMaybe<OrderBy>;
  /** Reference to the payroll date type */
  dateTypeId?: InputMaybe<OrderBy>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** The date when the payroll went live in the system */
  goLiveDate?: InputMaybe<OrderBy>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<OrderBy>;
  /** Manager overseeing this payroll */
  managerUserId?: InputMaybe<OrderBy>;
  /** Name of the payroll */
  name?: InputMaybe<OrderBy>;
  parentPayrollId?: InputMaybe<OrderBy>;
  /** External payroll system used for this client */
  payrollSystem?: InputMaybe<OrderBy>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<OrderBy>;
  supersededDate?: InputMaybe<OrderBy>;
  /** Timestamp when the payroll was last updated */
  updatedAt?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
  versionReason?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "payrolls" */
export type PayrollsMutationResponse = {
  __typename?: 'payrollsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Payrolls>;
};

/** input type for inserting object relation for remote table "payrolls" */
export type PayrollsObjRelInsertInput = {
  data: PayrollsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollsOnConflict>;
};

/** on_conflict condition type for table "payrolls" */
export type PayrollsOnConflict = {
  constraint: PayrollsConstraint;
  updateColumns?: Array<PayrollsUpdateColumn>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** Ordering options when selecting data from "payrolls". */
export type PayrollsOrderBy = {
  backupConsultant?: InputMaybe<UsersOrderBy>;
  backupConsultantUserId?: InputMaybe<OrderBy>;
  billingItemsAggregate?: InputMaybe<BillingItemsAggregateOrderBy>;
  childPayrollsAggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  client?: InputMaybe<ClientsOrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdByUserId?: InputMaybe<OrderBy>;
  cycleId?: InputMaybe<OrderBy>;
  dateTypeId?: InputMaybe<OrderBy>;
  dateValue?: InputMaybe<OrderBy>;
  employeeCount?: InputMaybe<OrderBy>;
  goLiveDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  manager?: InputMaybe<UsersOrderBy>;
  managerUserId?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  parentPayroll?: InputMaybe<PayrollsOrderBy>;
  parentPayrollId?: InputMaybe<OrderBy>;
  payrollCycle?: InputMaybe<PayrollCyclesOrderBy>;
  payrollDateType?: InputMaybe<PayrollDateTypesOrderBy>;
  payrollDatesAggregate?: InputMaybe<PayrollDatesAggregateOrderBy>;
  payrollSystem?: InputMaybe<OrderBy>;
  primaryConsultant?: InputMaybe<UsersOrderBy>;
  primaryConsultantUserId?: InputMaybe<OrderBy>;
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  processingTime?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  supersededDate?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
  versionReason?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payrolls */
export type PayrollsPkColumnsInput = {
  /** Unique identifier for the payroll */
  id: Scalars['uuid']['input'];
};

/** select columns of table "payrolls" */
export enum PayrollsSelectColumn {
  /** column name */
  backupConsultantUserId = 'backupConsultantUserId',
  /** column name */
  clientId = 'clientId',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  createdByUserId = 'createdByUserId',
  /** column name */
  cycleId = 'cycleId',
  /** column name */
  dateTypeId = 'dateTypeId',
  /** column name */
  dateValue = 'dateValue',
  /** column name */
  employeeCount = 'employeeCount',
  /** column name */
  goLiveDate = 'goLiveDate',
  /** column name */
  id = 'id',
  /** column name */
  managerUserId = 'managerUserId',
  /** column name */
  name = 'name',
  /** column name */
  parentPayrollId = 'parentPayrollId',
  /** column name */
  payrollSystem = 'payrollSystem',
  /** column name */
  primaryConsultantUserId = 'primaryConsultantUserId',
  /** column name */
  processingDaysBeforeEft = 'processingDaysBeforeEft',
  /** column name */
  processingTime = 'processingTime',
  /** column name */
  status = 'status',
  /** column name */
  supersededDate = 'supersededDate',
  /** column name */
  updatedAt = 'updatedAt',
  /** column name */
  versionNumber = 'versionNumber',
  /** column name */
  versionReason = 'versionReason'
}

/** input type for updating data in table "payrolls" */
export type PayrollsSetInput = {
  /** Backup consultant for this payroll */
  backupConsultantUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the client this payroll belongs to */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the payroll was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll cycle */
  cycleId?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll date type */
  dateTypeId?: InputMaybe<Scalars['uuid']['input']>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<Scalars['Int']['input']>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<Scalars['Int']['input']>;
  /** The date when the payroll went live in the system */
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Manager overseeing this payroll */
  managerUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the payroll */
  name?: InputMaybe<Scalars['String']['input']>;
  parentPayrollId?: InputMaybe<Scalars['uuid']['input']>;
  /** External payroll system used for this client */
  payrollSystem?: InputMaybe<Scalars['String']['input']>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<Scalars['Int']['input']>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<Scalars['Int']['input']>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<Scalars['payroll_status']['input']>;
  supersededDate?: InputMaybe<Scalars['date']['input']>;
  /** Timestamp when the payroll was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
  versionReason?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type PayrollsStddevFields = {
  __typename?: 'payrollsStddevFields';
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employeeCount?: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processingTime?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "payrolls" */
export type PayrollsStddevOrderBy = {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** aggregate stddevPop on columns */
export type PayrollsStddevPopFields = {
  __typename?: 'payrollsStddevPopFields';
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employeeCount?: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processingTime?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevPop() on columns of table "payrolls" */
export type PayrollsStddevPopOrderBy = {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** aggregate stddevSamp on columns */
export type PayrollsStddevSampFields = {
  __typename?: 'payrollsStddevSampFields';
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employeeCount?: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processingTime?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevSamp() on columns of table "payrolls" */
export type PayrollsStddevSampOrderBy = {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "payrolls" */
export type PayrollsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PayrollsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollsStreamCursorValueInput = {
  /** Backup consultant for this payroll */
  backupConsultantUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the client this payroll belongs to */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the payroll was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll cycle */
  cycleId?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll date type */
  dateTypeId?: InputMaybe<Scalars['uuid']['input']>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<Scalars['Int']['input']>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<Scalars['Int']['input']>;
  /** The date when the payroll went live in the system */
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Manager overseeing this payroll */
  managerUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the payroll */
  name?: InputMaybe<Scalars['String']['input']>;
  parentPayrollId?: InputMaybe<Scalars['uuid']['input']>;
  /** External payroll system used for this client */
  payrollSystem?: InputMaybe<Scalars['String']['input']>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<Scalars['Int']['input']>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<Scalars['Int']['input']>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<Scalars['payroll_status']['input']>;
  supersededDate?: InputMaybe<Scalars['date']['input']>;
  /** Timestamp when the payroll was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
  versionReason?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type PayrollsSumFields = {
  __typename?: 'payrollsSumFields';
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: Maybe<Scalars['Int']['output']>;
  /** Number of employees in this payroll */
  employeeCount?: Maybe<Scalars['Int']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: Maybe<Scalars['Int']['output']>;
  /** Number of hours required to process this payroll */
  processingTime?: Maybe<Scalars['Int']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "payrolls" */
export type PayrollsSumOrderBy = {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** update columns of table "payrolls" */
export enum PayrollsUpdateColumn {
  /** column name */
  backupConsultantUserId = 'backupConsultantUserId',
  /** column name */
  clientId = 'clientId',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  createdByUserId = 'createdByUserId',
  /** column name */
  cycleId = 'cycleId',
  /** column name */
  dateTypeId = 'dateTypeId',
  /** column name */
  dateValue = 'dateValue',
  /** column name */
  employeeCount = 'employeeCount',
  /** column name */
  goLiveDate = 'goLiveDate',
  /** column name */
  id = 'id',
  /** column name */
  managerUserId = 'managerUserId',
  /** column name */
  name = 'name',
  /** column name */
  parentPayrollId = 'parentPayrollId',
  /** column name */
  payrollSystem = 'payrollSystem',
  /** column name */
  primaryConsultantUserId = 'primaryConsultantUserId',
  /** column name */
  processingDaysBeforeEft = 'processingDaysBeforeEft',
  /** column name */
  processingTime = 'processingTime',
  /** column name */
  status = 'status',
  /** column name */
  supersededDate = 'supersededDate',
  /** column name */
  updatedAt = 'updatedAt',
  /** column name */
  versionNumber = 'versionNumber',
  /** column name */
  versionReason = 'versionReason'
}

export type PayrollsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<PayrollsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollsBoolExp;
};

/** aggregate varPop on columns */
export type PayrollsVarPopFields = {
  __typename?: 'payrollsVarPopFields';
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employeeCount?: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processingTime?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** order by varPop() on columns of table "payrolls" */
export type PayrollsVarPopOrderBy = {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** aggregate varSamp on columns */
export type PayrollsVarSampFields = {
  __typename?: 'payrollsVarSampFields';
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employeeCount?: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processingTime?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** order by varSamp() on columns of table "payrolls" */
export type PayrollsVarSampOrderBy = {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type PayrollsVarianceFields = {
  __typename?: 'payrollsVarianceFields';
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employeeCount?: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processingTime?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "payrolls" */
export type PayrollsVarianceOrderBy = {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** Audit log for permission changes and access attempts */
export type PermissionAuditLogs = {
  __typename?: 'permissionAuditLogs';
  action: Scalars['String']['output'];
  createdAt: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  newValue?: Maybe<Scalars['jsonb']['output']>;
  operation: Scalars['String']['output'];
  /** An object relationship */
  performedByUser?: Maybe<Users>;
  previousValue?: Maybe<Scalars['jsonb']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  resource: Scalars['String']['output'];
  targetRole?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  targetUser?: Maybe<Users>;
  targetUserId?: Maybe<Scalars['uuid']['output']>;
  timestamp: Scalars['timestamptz']['output'];
  userId?: Maybe<Scalars['uuid']['output']>;
};


/** Audit log for permission changes and access attempts */
export type PermissionAuditLogsNewValueArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** Audit log for permission changes and access attempts */
export type PermissionAuditLogsPreviousValueArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "permission_audit_log" */
export type PermissionAuditLogsAggregate = {
  __typename?: 'permissionAuditLogsAggregate';
  aggregate?: Maybe<PermissionAuditLogsAggregateFields>;
  nodes: Array<PermissionAuditLogs>;
};

export type PermissionAuditLogsAggregateBoolExp = {
  count?: InputMaybe<PermissionAuditLogsAggregateBoolExpCount>;
};

export type PermissionAuditLogsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PermissionAuditLogsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "permission_audit_log" */
export type PermissionAuditLogsAggregateFields = {
  __typename?: 'permissionAuditLogsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<PermissionAuditLogsMaxFields>;
  min?: Maybe<PermissionAuditLogsMinFields>;
};


/** aggregate fields of "permission_audit_log" */
export type PermissionAuditLogsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "permission_audit_log" */
export type PermissionAuditLogsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<PermissionAuditLogsMaxOrderBy>;
  min?: InputMaybe<PermissionAuditLogsMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type PermissionAuditLogsAppendInput = {
  newValue?: InputMaybe<Scalars['jsonb']['input']>;
  previousValue?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "permission_audit_log" */
export type PermissionAuditLogsArrRelInsertInput = {
  data: Array<PermissionAuditLogsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<PermissionAuditLogsOnConflict>;
};

/** Boolean expression to filter rows from the table "permission_audit_log". All fields are combined with a logical 'AND'. */
export type PermissionAuditLogsBoolExp = {
  _and?: InputMaybe<Array<PermissionAuditLogsBoolExp>>;
  _not?: InputMaybe<PermissionAuditLogsBoolExp>;
  _or?: InputMaybe<Array<PermissionAuditLogsBoolExp>>;
  action?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  newValue?: InputMaybe<JsonbComparisonExp>;
  operation?: InputMaybe<StringComparisonExp>;
  performedByUser?: InputMaybe<UsersBoolExp>;
  previousValue?: InputMaybe<JsonbComparisonExp>;
  reason?: InputMaybe<StringComparisonExp>;
  resource?: InputMaybe<StringComparisonExp>;
  targetRole?: InputMaybe<StringComparisonExp>;
  targetUser?: InputMaybe<UsersBoolExp>;
  targetUserId?: InputMaybe<UuidComparisonExp>;
  timestamp?: InputMaybe<TimestamptzComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "permission_audit_log" */
export enum PermissionAuditLogsConstraint {
  /** unique or primary key constraint on columns "id" */
  permission_audit_log_pkey = 'permission_audit_log_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type PermissionAuditLogsDeleteAtPathInput = {
  newValue?: InputMaybe<Array<Scalars['String']['input']>>;
  previousValue?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type PermissionAuditLogsDeleteElemInput = {
  newValue?: InputMaybe<Scalars['Int']['input']>;
  previousValue?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type PermissionAuditLogsDeleteKeyInput = {
  newValue?: InputMaybe<Scalars['String']['input']>;
  previousValue?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "permission_audit_log" */
export type PermissionAuditLogsInsertInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  newValue?: InputMaybe<Scalars['jsonb']['input']>;
  operation?: InputMaybe<Scalars['String']['input']>;
  performedByUser?: InputMaybe<UsersObjRelInsertInput>;
  previousValue?: InputMaybe<Scalars['jsonb']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  resource?: InputMaybe<Scalars['String']['input']>;
  targetRole?: InputMaybe<Scalars['String']['input']>;
  targetUser?: InputMaybe<UsersObjRelInsertInput>;
  targetUserId?: InputMaybe<Scalars['uuid']['input']>;
  timestamp?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type PermissionAuditLogsMaxFields = {
  __typename?: 'permissionAuditLogsMaxFields';
  action?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  operation?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  resource?: Maybe<Scalars['String']['output']>;
  targetRole?: Maybe<Scalars['String']['output']>;
  targetUserId?: Maybe<Scalars['uuid']['output']>;
  timestamp?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "permission_audit_log" */
export type PermissionAuditLogsMaxOrderBy = {
  action?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  operation?: InputMaybe<OrderBy>;
  reason?: InputMaybe<OrderBy>;
  resource?: InputMaybe<OrderBy>;
  targetRole?: InputMaybe<OrderBy>;
  targetUserId?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type PermissionAuditLogsMinFields = {
  __typename?: 'permissionAuditLogsMinFields';
  action?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  operation?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  resource?: Maybe<Scalars['String']['output']>;
  targetRole?: Maybe<Scalars['String']['output']>;
  targetUserId?: Maybe<Scalars['uuid']['output']>;
  timestamp?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "permission_audit_log" */
export type PermissionAuditLogsMinOrderBy = {
  action?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  operation?: InputMaybe<OrderBy>;
  reason?: InputMaybe<OrderBy>;
  resource?: InputMaybe<OrderBy>;
  targetRole?: InputMaybe<OrderBy>;
  targetUserId?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "permission_audit_log" */
export type PermissionAuditLogsMutationResponse = {
  __typename?: 'permissionAuditLogsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PermissionAuditLogs>;
};

/** on_conflict condition type for table "permission_audit_log" */
export type PermissionAuditLogsOnConflict = {
  constraint: PermissionAuditLogsConstraint;
  updateColumns?: Array<PermissionAuditLogsUpdateColumn>;
  where?: InputMaybe<PermissionAuditLogsBoolExp>;
};

/** Ordering options when selecting data from "permission_audit_log". */
export type PermissionAuditLogsOrderBy = {
  action?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  newValue?: InputMaybe<OrderBy>;
  operation?: InputMaybe<OrderBy>;
  performedByUser?: InputMaybe<UsersOrderBy>;
  previousValue?: InputMaybe<OrderBy>;
  reason?: InputMaybe<OrderBy>;
  resource?: InputMaybe<OrderBy>;
  targetRole?: InputMaybe<OrderBy>;
  targetUser?: InputMaybe<UsersOrderBy>;
  targetUserId?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: permission_audit_log */
export type PermissionAuditLogsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type PermissionAuditLogsPrependInput = {
  newValue?: InputMaybe<Scalars['jsonb']['input']>;
  previousValue?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "permission_audit_log" */
export enum PermissionAuditLogsSelectColumn {
  /** column name */
  action = 'action',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  newValue = 'newValue',
  /** column name */
  operation = 'operation',
  /** column name */
  previousValue = 'previousValue',
  /** column name */
  reason = 'reason',
  /** column name */
  resource = 'resource',
  /** column name */
  targetRole = 'targetRole',
  /** column name */
  targetUserId = 'targetUserId',
  /** column name */
  timestamp = 'timestamp',
  /** column name */
  userId = 'userId'
}

/** input type for updating data in table "permission_audit_log" */
export type PermissionAuditLogsSetInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  newValue?: InputMaybe<Scalars['jsonb']['input']>;
  operation?: InputMaybe<Scalars['String']['input']>;
  previousValue?: InputMaybe<Scalars['jsonb']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  resource?: InputMaybe<Scalars['String']['input']>;
  targetRole?: InputMaybe<Scalars['String']['input']>;
  targetUserId?: InputMaybe<Scalars['uuid']['input']>;
  timestamp?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "permissionAuditLogs" */
export type PermissionAuditLogsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PermissionAuditLogsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PermissionAuditLogsStreamCursorValueInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  newValue?: InputMaybe<Scalars['jsonb']['input']>;
  operation?: InputMaybe<Scalars['String']['input']>;
  previousValue?: InputMaybe<Scalars['jsonb']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  resource?: InputMaybe<Scalars['String']['input']>;
  targetRole?: InputMaybe<Scalars['String']['input']>;
  targetUserId?: InputMaybe<Scalars['uuid']['input']>;
  timestamp?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "permission_audit_log" */
export enum PermissionAuditLogsUpdateColumn {
  /** column name */
  action = 'action',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  newValue = 'newValue',
  /** column name */
  operation = 'operation',
  /** column name */
  previousValue = 'previousValue',
  /** column name */
  reason = 'reason',
  /** column name */
  resource = 'resource',
  /** column name */
  targetRole = 'targetRole',
  /** column name */
  targetUserId = 'targetUserId',
  /** column name */
  timestamp = 'timestamp',
  /** column name */
  userId = 'userId'
}

export type PermissionAuditLogsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<PermissionAuditLogsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<PermissionAuditLogsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<PermissionAuditLogsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<PermissionAuditLogsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<PermissionAuditLogsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PermissionAuditLogsSetInput>;
  /** filter the rows which have to be updated */
  where: PermissionAuditLogsBoolExp;
};

/** columns and relationships of "audit.permission_changes" */
export type PermissionChanges = {
  __typename?: 'permissionChanges';
  approvedByUserId?: Maybe<Scalars['uuid']['output']>;
  changeType: Scalars['String']['output'];
  changedAt: Scalars['timestamptz']['output'];
  changedByUserId: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  metadata?: Maybe<Scalars['jsonb']['output']>;
  newPermissions?: Maybe<Scalars['jsonb']['output']>;
  oldPermissions?: Maybe<Scalars['jsonb']['output']>;
  permissionType?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  targetRoleId?: Maybe<Scalars['uuid']['output']>;
  targetUserId?: Maybe<Scalars['uuid']['output']>;
};


/** columns and relationships of "audit.permission_changes" */
export type PermissionChangesMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit.permission_changes" */
export type PermissionChangesNewPermissionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit.permission_changes" */
export type PermissionChangesOldPermissionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit.permission_changes" */
export type PermissionChangesAggregate = {
  __typename?: 'permissionChangesAggregate';
  aggregate?: Maybe<PermissionChangesAggregateFields>;
  nodes: Array<PermissionChanges>;
};

/** aggregate fields of "audit.permission_changes" */
export type PermissionChangesAggregateFields = {
  __typename?: 'permissionChangesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<PermissionChangesMaxFields>;
  min?: Maybe<PermissionChangesMinFields>;
};


/** aggregate fields of "audit.permission_changes" */
export type PermissionChangesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PermissionChangesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type PermissionChangesAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newPermissions?: InputMaybe<Scalars['jsonb']['input']>;
  oldPermissions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "audit.permission_changes". All fields are combined with a logical 'AND'. */
export type PermissionChangesBoolExp = {
  _and?: InputMaybe<Array<PermissionChangesBoolExp>>;
  _not?: InputMaybe<PermissionChangesBoolExp>;
  _or?: InputMaybe<Array<PermissionChangesBoolExp>>;
  approvedByUserId?: InputMaybe<UuidComparisonExp>;
  changeType?: InputMaybe<StringComparisonExp>;
  changedAt?: InputMaybe<TimestamptzComparisonExp>;
  changedByUserId?: InputMaybe<UuidComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  metadata?: InputMaybe<JsonbComparisonExp>;
  newPermissions?: InputMaybe<JsonbComparisonExp>;
  oldPermissions?: InputMaybe<JsonbComparisonExp>;
  permissionType?: InputMaybe<StringComparisonExp>;
  reason?: InputMaybe<StringComparisonExp>;
  targetRoleId?: InputMaybe<UuidComparisonExp>;
  targetUserId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "audit.permission_changes" */
export enum PermissionChangesConstraint {
  /** unique or primary key constraint on columns "id" */
  permission_changes_pkey = 'permission_changes_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type PermissionChangesDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
  newPermissions?: InputMaybe<Array<Scalars['String']['input']>>;
  oldPermissions?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type PermissionChangesDeleteElemInput = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
  newPermissions?: InputMaybe<Scalars['Int']['input']>;
  oldPermissions?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type PermissionChangesDeleteKeyInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
  newPermissions?: InputMaybe<Scalars['String']['input']>;
  oldPermissions?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "audit.permission_changes" */
export type PermissionChangesInsertInput = {
  approvedByUserId?: InputMaybe<Scalars['uuid']['input']>;
  changeType?: InputMaybe<Scalars['String']['input']>;
  changedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  changedByUserId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newPermissions?: InputMaybe<Scalars['jsonb']['input']>;
  oldPermissions?: InputMaybe<Scalars['jsonb']['input']>;
  permissionType?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  targetRoleId?: InputMaybe<Scalars['uuid']['input']>;
  targetUserId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type PermissionChangesMaxFields = {
  __typename?: 'permissionChangesMaxFields';
  approvedByUserId?: Maybe<Scalars['uuid']['output']>;
  changeType?: Maybe<Scalars['String']['output']>;
  changedAt?: Maybe<Scalars['timestamptz']['output']>;
  changedByUserId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  permissionType?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  targetRoleId?: Maybe<Scalars['uuid']['output']>;
  targetUserId?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type PermissionChangesMinFields = {
  __typename?: 'permissionChangesMinFields';
  approvedByUserId?: Maybe<Scalars['uuid']['output']>;
  changeType?: Maybe<Scalars['String']['output']>;
  changedAt?: Maybe<Scalars['timestamptz']['output']>;
  changedByUserId?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  permissionType?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  targetRoleId?: Maybe<Scalars['uuid']['output']>;
  targetUserId?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "audit.permission_changes" */
export type PermissionChangesMutationResponse = {
  __typename?: 'permissionChangesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PermissionChanges>;
};

/** on_conflict condition type for table "audit.permission_changes" */
export type PermissionChangesOnConflict = {
  constraint: PermissionChangesConstraint;
  updateColumns?: Array<PermissionChangesUpdateColumn>;
  where?: InputMaybe<PermissionChangesBoolExp>;
};

/** Ordering options when selecting data from "audit.permission_changes". */
export type PermissionChangesOrderBy = {
  approvedByUserId?: InputMaybe<OrderBy>;
  changeType?: InputMaybe<OrderBy>;
  changedAt?: InputMaybe<OrderBy>;
  changedByUserId?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  metadata?: InputMaybe<OrderBy>;
  newPermissions?: InputMaybe<OrderBy>;
  oldPermissions?: InputMaybe<OrderBy>;
  permissionType?: InputMaybe<OrderBy>;
  reason?: InputMaybe<OrderBy>;
  targetRoleId?: InputMaybe<OrderBy>;
  targetUserId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: audit.permission_changes */
export type PermissionChangesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type PermissionChangesPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newPermissions?: InputMaybe<Scalars['jsonb']['input']>;
  oldPermissions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit.permission_changes" */
export enum PermissionChangesSelectColumn {
  /** column name */
  approvedByUserId = 'approvedByUserId',
  /** column name */
  changeType = 'changeType',
  /** column name */
  changedAt = 'changedAt',
  /** column name */
  changedByUserId = 'changedByUserId',
  /** column name */
  id = 'id',
  /** column name */
  metadata = 'metadata',
  /** column name */
  newPermissions = 'newPermissions',
  /** column name */
  oldPermissions = 'oldPermissions',
  /** column name */
  permissionType = 'permissionType',
  /** column name */
  reason = 'reason',
  /** column name */
  targetRoleId = 'targetRoleId',
  /** column name */
  targetUserId = 'targetUserId'
}

/** input type for updating data in table "audit.permission_changes" */
export type PermissionChangesSetInput = {
  approvedByUserId?: InputMaybe<Scalars['uuid']['input']>;
  changeType?: InputMaybe<Scalars['String']['input']>;
  changedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  changedByUserId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newPermissions?: InputMaybe<Scalars['jsonb']['input']>;
  oldPermissions?: InputMaybe<Scalars['jsonb']['input']>;
  permissionType?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  targetRoleId?: InputMaybe<Scalars['uuid']['input']>;
  targetUserId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "permissionChanges" */
export type PermissionChangesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PermissionChangesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PermissionChangesStreamCursorValueInput = {
  approvedByUserId?: InputMaybe<Scalars['uuid']['input']>;
  changeType?: InputMaybe<Scalars['String']['input']>;
  changedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  changedByUserId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newPermissions?: InputMaybe<Scalars['jsonb']['input']>;
  oldPermissions?: InputMaybe<Scalars['jsonb']['input']>;
  permissionType?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  targetRoleId?: InputMaybe<Scalars['uuid']['input']>;
  targetUserId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "audit.permission_changes" */
export enum PermissionChangesUpdateColumn {
  /** column name */
  approvedByUserId = 'approvedByUserId',
  /** column name */
  changeType = 'changeType',
  /** column name */
  changedAt = 'changedAt',
  /** column name */
  changedByUserId = 'changedByUserId',
  /** column name */
  id = 'id',
  /** column name */
  metadata = 'metadata',
  /** column name */
  newPermissions = 'newPermissions',
  /** column name */
  oldPermissions = 'oldPermissions',
  /** column name */
  permissionType = 'permissionType',
  /** column name */
  reason = 'reason',
  /** column name */
  targetRoleId = 'targetRoleId',
  /** column name */
  targetUserId = 'targetUserId'
}

export type PermissionChangesUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<PermissionChangesAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<PermissionChangesDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<PermissionChangesDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<PermissionChangesDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<PermissionChangesPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PermissionChangesSetInput>;
  /** filter the rows which have to be updated */
  where: PermissionChangesBoolExp;
};

/** User-specific and role-specific permission overrides */
export type PermissionOverrides = {
  __typename?: 'permissionOverrides';
  /** JSON conditions for conditional permissions */
  conditions?: Maybe<Scalars['jsonb']['output']>;
  createdAt: Scalars['timestamptz']['output'];
  createdBy?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  createdByUser?: Maybe<Users>;
  /** When this override expires (NULL for permanent) */
  expiresAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Whether the permission is granted (true) or denied (false) */
  granted: Scalars['Boolean']['output'];
  id: Scalars['uuid']['output'];
  operation: Scalars['String']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  resource: Scalars['String']['output'];
  /** Role name for role-based overrides (mutually exclusive with user_id) */
  role?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  targetUser?: Maybe<Users>;
  updatedAt: Scalars['timestamptz']['output'];
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId?: Maybe<Scalars['uuid']['output']>;
};


/** User-specific and role-specific permission overrides */
export type PermissionOverridesConditionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "permission_overrides" */
export type PermissionOverridesAggregate = {
  __typename?: 'permissionOverridesAggregate';
  aggregate?: Maybe<PermissionOverridesAggregateFields>;
  nodes: Array<PermissionOverrides>;
};

export type PermissionOverridesAggregateBoolExp = {
  bool_and?: InputMaybe<PermissionOverridesAggregateBoolExpBoolAnd>;
  bool_or?: InputMaybe<PermissionOverridesAggregateBoolExpBoolOr>;
  count?: InputMaybe<PermissionOverridesAggregateBoolExpCount>;
};

export type PermissionOverridesAggregateBoolExpBoolAnd = {
  arguments: PermissionOverridesSelectColumnPermissionOverridesAggregateBoolExpBoolAndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PermissionOverridesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type PermissionOverridesAggregateBoolExpBoolOr = {
  arguments: PermissionOverridesSelectColumnPermissionOverridesAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PermissionOverridesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type PermissionOverridesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PermissionOverridesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "permission_overrides" */
export type PermissionOverridesAggregateFields = {
  __typename?: 'permissionOverridesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<PermissionOverridesMaxFields>;
  min?: Maybe<PermissionOverridesMinFields>;
};


/** aggregate fields of "permission_overrides" */
export type PermissionOverridesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "permission_overrides" */
export type PermissionOverridesAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<PermissionOverridesMaxOrderBy>;
  min?: InputMaybe<PermissionOverridesMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type PermissionOverridesAppendInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "permission_overrides" */
export type PermissionOverridesArrRelInsertInput = {
  data: Array<PermissionOverridesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<PermissionOverridesOnConflict>;
};

/** Boolean expression to filter rows from the table "permission_overrides". All fields are combined with a logical 'AND'. */
export type PermissionOverridesBoolExp = {
  _and?: InputMaybe<Array<PermissionOverridesBoolExp>>;
  _not?: InputMaybe<PermissionOverridesBoolExp>;
  _or?: InputMaybe<Array<PermissionOverridesBoolExp>>;
  conditions?: InputMaybe<JsonbComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdBy?: InputMaybe<UuidComparisonExp>;
  createdByUser?: InputMaybe<UsersBoolExp>;
  expiresAt?: InputMaybe<TimestamptzComparisonExp>;
  granted?: InputMaybe<BooleanComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  operation?: InputMaybe<StringComparisonExp>;
  reason?: InputMaybe<StringComparisonExp>;
  resource?: InputMaybe<StringComparisonExp>;
  role?: InputMaybe<StringComparisonExp>;
  targetUser?: InputMaybe<UsersBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "permission_overrides" */
export enum PermissionOverridesConstraint {
  /** unique or primary key constraint on columns "id" */
  permission_overrides_pkey = 'permission_overrides_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type PermissionOverridesDeleteAtPathInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type PermissionOverridesDeleteElemInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type PermissionOverridesDeleteKeyInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "permission_overrides" */
export type PermissionOverridesInsertInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  createdByUser?: InputMaybe<UsersObjRelInsertInput>;
  /** When this override expires (NULL for permanent) */
  expiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Whether the permission is granted (true) or denied (false) */
  granted?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  operation?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  resource?: InputMaybe<Scalars['String']['input']>;
  /** Role name for role-based overrides (mutually exclusive with user_id) */
  role?: InputMaybe<Scalars['String']['input']>;
  targetUser?: InputMaybe<UsersObjRelInsertInput>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type PermissionOverridesMaxFields = {
  __typename?: 'permissionOverridesMaxFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  createdBy?: Maybe<Scalars['uuid']['output']>;
  /** When this override expires (NULL for permanent) */
  expiresAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  operation?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  resource?: Maybe<Scalars['String']['output']>;
  /** Role name for role-based overrides (mutually exclusive with user_id) */
  role?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "permission_overrides" */
export type PermissionOverridesMaxOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  /** When this override expires (NULL for permanent) */
  expiresAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  operation?: InputMaybe<OrderBy>;
  reason?: InputMaybe<OrderBy>;
  resource?: InputMaybe<OrderBy>;
  /** Role name for role-based overrides (mutually exclusive with user_id) */
  role?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type PermissionOverridesMinFields = {
  __typename?: 'permissionOverridesMinFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  createdBy?: Maybe<Scalars['uuid']['output']>;
  /** When this override expires (NULL for permanent) */
  expiresAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  operation?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  resource?: Maybe<Scalars['String']['output']>;
  /** Role name for role-based overrides (mutually exclusive with user_id) */
  role?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "permission_overrides" */
export type PermissionOverridesMinOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  /** When this override expires (NULL for permanent) */
  expiresAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  operation?: InputMaybe<OrderBy>;
  reason?: InputMaybe<OrderBy>;
  resource?: InputMaybe<OrderBy>;
  /** Role name for role-based overrides (mutually exclusive with user_id) */
  role?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "permission_overrides" */
export type PermissionOverridesMutationResponse = {
  __typename?: 'permissionOverridesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PermissionOverrides>;
};

/** on_conflict condition type for table "permission_overrides" */
export type PermissionOverridesOnConflict = {
  constraint: PermissionOverridesConstraint;
  updateColumns?: Array<PermissionOverridesUpdateColumn>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};

/** Ordering options when selecting data from "permission_overrides". */
export type PermissionOverridesOrderBy = {
  conditions?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  createdByUser?: InputMaybe<UsersOrderBy>;
  expiresAt?: InputMaybe<OrderBy>;
  granted?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  operation?: InputMaybe<OrderBy>;
  reason?: InputMaybe<OrderBy>;
  resource?: InputMaybe<OrderBy>;
  role?: InputMaybe<OrderBy>;
  targetUser?: InputMaybe<UsersOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: permission_overrides */
export type PermissionOverridesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type PermissionOverridesPrependInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "permission_overrides" */
export enum PermissionOverridesSelectColumn {
  /** column name */
  conditions = 'conditions',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  createdBy = 'createdBy',
  /** column name */
  expiresAt = 'expiresAt',
  /** column name */
  granted = 'granted',
  /** column name */
  id = 'id',
  /** column name */
  operation = 'operation',
  /** column name */
  reason = 'reason',
  /** column name */
  resource = 'resource',
  /** column name */
  role = 'role',
  /** column name */
  updatedAt = 'updatedAt',
  /** column name */
  userId = 'userId'
}

/** select "permissionOverridesAggregateBoolExpBool_andArgumentsColumns" columns of table "permission_overrides" */
export enum PermissionOverridesSelectColumnPermissionOverridesAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  granted = 'granted'
}

/** select "permissionOverridesAggregateBoolExpBool_orArgumentsColumns" columns of table "permission_overrides" */
export enum PermissionOverridesSelectColumnPermissionOverridesAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  granted = 'granted'
}

/** input type for updating data in table "permission_overrides" */
export type PermissionOverridesSetInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  /** When this override expires (NULL for permanent) */
  expiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Whether the permission is granted (true) or denied (false) */
  granted?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  operation?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  resource?: InputMaybe<Scalars['String']['input']>;
  /** Role name for role-based overrides (mutually exclusive with user_id) */
  role?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "permissionOverrides" */
export type PermissionOverridesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PermissionOverridesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PermissionOverridesStreamCursorValueInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  /** When this override expires (NULL for permanent) */
  expiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Whether the permission is granted (true) or denied (false) */
  granted?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  operation?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  resource?: InputMaybe<Scalars['String']['input']>;
  /** Role name for role-based overrides (mutually exclusive with user_id) */
  role?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "permission_overrides" */
export enum PermissionOverridesUpdateColumn {
  /** column name */
  conditions = 'conditions',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  createdBy = 'createdBy',
  /** column name */
  expiresAt = 'expiresAt',
  /** column name */
  granted = 'granted',
  /** column name */
  id = 'id',
  /** column name */
  operation = 'operation',
  /** column name */
  reason = 'reason',
  /** column name */
  resource = 'resource',
  /** column name */
  role = 'role',
  /** column name */
  updatedAt = 'updatedAt',
  /** column name */
  userId = 'userId'
}

export type PermissionOverridesUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<PermissionOverridesAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<PermissionOverridesDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<PermissionOverridesDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<PermissionOverridesDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<PermissionOverridesPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PermissionOverridesSetInput>;
  /** filter the rows which have to be updated */
  where: PermissionOverridesBoolExp;
};

/** columns and relationships of "audit.permission_usage_report" */
export type PermissionUsageReports = {
  __typename?: 'permissionUsageReports';
  action?: Maybe<Scalars['permission_action']['output']>;
  lastUsed?: Maybe<Scalars['timestamptz']['output']>;
  resourceName?: Maybe<Scalars['String']['output']>;
  roleName?: Maybe<Scalars['String']['output']>;
  totalUsageCount?: Maybe<Scalars['bigint']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['bigint']['output']>;
  usersWithPermission?: Maybe<Scalars['bigint']['output']>;
};

/** aggregated selection of "audit.permission_usage_report" */
export type PermissionUsageReportsAggregate = {
  __typename?: 'permissionUsageReportsAggregate';
  aggregate?: Maybe<PermissionUsageReportsAggregateFields>;
  nodes: Array<PermissionUsageReports>;
};

/** aggregate fields of "audit.permission_usage_report" */
export type PermissionUsageReportsAggregateFields = {
  __typename?: 'permissionUsageReportsAggregateFields';
  avg?: Maybe<PermissionUsageReportsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<PermissionUsageReportsMaxFields>;
  min?: Maybe<PermissionUsageReportsMinFields>;
  stddev?: Maybe<PermissionUsageReportsStddevFields>;
  stddevPop?: Maybe<PermissionUsageReportsStddevPopFields>;
  stddevSamp?: Maybe<PermissionUsageReportsStddevSampFields>;
  sum?: Maybe<PermissionUsageReportsSumFields>;
  varPop?: Maybe<PermissionUsageReportsVarPopFields>;
  varSamp?: Maybe<PermissionUsageReportsVarSampFields>;
  variance?: Maybe<PermissionUsageReportsVarianceFields>;
};


/** aggregate fields of "audit.permission_usage_report" */
export type PermissionUsageReportsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PermissionUsageReportsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type PermissionUsageReportsAvgFields = {
  __typename?: 'permissionUsageReportsAvgFields';
  totalUsageCount?: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['Float']['output']>;
  usersWithPermission?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "audit.permission_usage_report". All fields are combined with a logical 'AND'. */
export type PermissionUsageReportsBoolExp = {
  _and?: InputMaybe<Array<PermissionUsageReportsBoolExp>>;
  _not?: InputMaybe<PermissionUsageReportsBoolExp>;
  _or?: InputMaybe<Array<PermissionUsageReportsBoolExp>>;
  action?: InputMaybe<PermissionActionComparisonExp>;
  lastUsed?: InputMaybe<TimestamptzComparisonExp>;
  resourceName?: InputMaybe<StringComparisonExp>;
  roleName?: InputMaybe<StringComparisonExp>;
  totalUsageCount?: InputMaybe<BigintComparisonExp>;
  usersWhoUsedPermission?: InputMaybe<BigintComparisonExp>;
  usersWithPermission?: InputMaybe<BigintComparisonExp>;
};

/** aggregate max on columns */
export type PermissionUsageReportsMaxFields = {
  __typename?: 'permissionUsageReportsMaxFields';
  action?: Maybe<Scalars['permission_action']['output']>;
  lastUsed?: Maybe<Scalars['timestamptz']['output']>;
  resourceName?: Maybe<Scalars['String']['output']>;
  roleName?: Maybe<Scalars['String']['output']>;
  totalUsageCount?: Maybe<Scalars['bigint']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['bigint']['output']>;
  usersWithPermission?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type PermissionUsageReportsMinFields = {
  __typename?: 'permissionUsageReportsMinFields';
  action?: Maybe<Scalars['permission_action']['output']>;
  lastUsed?: Maybe<Scalars['timestamptz']['output']>;
  resourceName?: Maybe<Scalars['String']['output']>;
  roleName?: Maybe<Scalars['String']['output']>;
  totalUsageCount?: Maybe<Scalars['bigint']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['bigint']['output']>;
  usersWithPermission?: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "audit.permission_usage_report". */
export type PermissionUsageReportsOrderBy = {
  action?: InputMaybe<OrderBy>;
  lastUsed?: InputMaybe<OrderBy>;
  resourceName?: InputMaybe<OrderBy>;
  roleName?: InputMaybe<OrderBy>;
  totalUsageCount?: InputMaybe<OrderBy>;
  usersWhoUsedPermission?: InputMaybe<OrderBy>;
  usersWithPermission?: InputMaybe<OrderBy>;
};

/** select columns of table "audit.permission_usage_report" */
export enum PermissionUsageReportsSelectColumn {
  /** column name */
  action = 'action',
  /** column name */
  lastUsed = 'lastUsed',
  /** column name */
  resourceName = 'resourceName',
  /** column name */
  roleName = 'roleName',
  /** column name */
  totalUsageCount = 'totalUsageCount',
  /** column name */
  usersWhoUsedPermission = 'usersWhoUsedPermission',
  /** column name */
  usersWithPermission = 'usersWithPermission'
}

/** aggregate stddev on columns */
export type PermissionUsageReportsStddevFields = {
  __typename?: 'permissionUsageReportsStddevFields';
  totalUsageCount?: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['Float']['output']>;
  usersWithPermission?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type PermissionUsageReportsStddevPopFields = {
  __typename?: 'permissionUsageReportsStddevPopFields';
  totalUsageCount?: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['Float']['output']>;
  usersWithPermission?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type PermissionUsageReportsStddevSampFields = {
  __typename?: 'permissionUsageReportsStddevSampFields';
  totalUsageCount?: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['Float']['output']>;
  usersWithPermission?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "permissionUsageReports" */
export type PermissionUsageReportsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PermissionUsageReportsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PermissionUsageReportsStreamCursorValueInput = {
  action?: InputMaybe<Scalars['permission_action']['input']>;
  lastUsed?: InputMaybe<Scalars['timestamptz']['input']>;
  resourceName?: InputMaybe<Scalars['String']['input']>;
  roleName?: InputMaybe<Scalars['String']['input']>;
  totalUsageCount?: InputMaybe<Scalars['bigint']['input']>;
  usersWhoUsedPermission?: InputMaybe<Scalars['bigint']['input']>;
  usersWithPermission?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type PermissionUsageReportsSumFields = {
  __typename?: 'permissionUsageReportsSumFields';
  totalUsageCount?: Maybe<Scalars['bigint']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['bigint']['output']>;
  usersWithPermission?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate varPop on columns */
export type PermissionUsageReportsVarPopFields = {
  __typename?: 'permissionUsageReportsVarPopFields';
  totalUsageCount?: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['Float']['output']>;
  usersWithPermission?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type PermissionUsageReportsVarSampFields = {
  __typename?: 'permissionUsageReportsVarSampFields';
  totalUsageCount?: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['Float']['output']>;
  usersWithPermission?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type PermissionUsageReportsVarianceFields = {
  __typename?: 'permissionUsageReportsVarianceFields';
  totalUsageCount?: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['Float']['output']>;
  usersWithPermission?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "permissions" */
export type Permissions = {
  __typename?: 'permissions';
  action: Scalars['permission_action']['output'];
  /** An array relationship */
  assignedToRoles: Array<RolePermissions>;
  /** An aggregate relationship */
  assignedToRolesAggregate: RolePermissionsAggregate;
  createdAt: Scalars['timestamptz']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  legacyPermissionName?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  relatedResource: Resources;
  resourceId: Scalars['uuid']['output'];
  updatedAt: Scalars['timestamptz']['output'];
};


/** columns and relationships of "permissions" */
export type PermissionsAssignedToRolesArgs = {
  distinctOn?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


/** columns and relationships of "permissions" */
export type PermissionsAssignedToRolesAggregateArgs = {
  distinctOn?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};

/** aggregated selection of "permissions" */
export type PermissionsAggregate = {
  __typename?: 'permissionsAggregate';
  aggregate?: Maybe<PermissionsAggregateFields>;
  nodes: Array<Permissions>;
};

export type PermissionsAggregateBoolExp = {
  count?: InputMaybe<PermissionsAggregateBoolExpCount>;
};

export type PermissionsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PermissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PermissionsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "permissions" */
export type PermissionsAggregateFields = {
  __typename?: 'permissionsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<PermissionsMaxFields>;
  min?: Maybe<PermissionsMinFields>;
};


/** aggregate fields of "permissions" */
export type PermissionsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PermissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "permissions" */
export type PermissionsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<PermissionsMaxOrderBy>;
  min?: InputMaybe<PermissionsMinOrderBy>;
};

/** input type for inserting array relation for remote table "permissions" */
export type PermissionsArrRelInsertInput = {
  data: Array<PermissionsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<PermissionsOnConflict>;
};

/** Boolean expression to filter rows from the table "permissions". All fields are combined with a logical 'AND'. */
export type PermissionsBoolExp = {
  _and?: InputMaybe<Array<PermissionsBoolExp>>;
  _not?: InputMaybe<PermissionsBoolExp>;
  _or?: InputMaybe<Array<PermissionsBoolExp>>;
  action?: InputMaybe<PermissionActionComparisonExp>;
  assignedToRoles?: InputMaybe<RolePermissionsBoolExp>;
  assignedToRolesAggregate?: InputMaybe<RolePermissionsAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  legacyPermissionName?: InputMaybe<StringComparisonExp>;
  relatedResource?: InputMaybe<ResourcesBoolExp>;
  resourceId?: InputMaybe<UuidComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "permissions" */
export enum PermissionsConstraint {
  /** unique or primary key constraint on columns "id" */
  permissions_pkey = 'permissions_pkey',
  /** unique or primary key constraint on columns "action", "resource_id" */
  permissions_resource_id_action_key = 'permissions_resource_id_action_key'
}

/** input type for inserting data into table "permissions" */
export type PermissionsInsertInput = {
  action?: InputMaybe<Scalars['permission_action']['input']>;
  assignedToRoles?: InputMaybe<RolePermissionsArrRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  legacyPermissionName?: InputMaybe<Scalars['String']['input']>;
  relatedResource?: InputMaybe<ResourcesObjRelInsertInput>;
  resourceId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type PermissionsMaxFields = {
  __typename?: 'permissionsMaxFields';
  action?: Maybe<Scalars['permission_action']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  legacyPermissionName?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['uuid']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "permissions" */
export type PermissionsMaxOrderBy = {
  action?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  legacyPermissionName?: InputMaybe<OrderBy>;
  resourceId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type PermissionsMinFields = {
  __typename?: 'permissionsMinFields';
  action?: Maybe<Scalars['permission_action']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  legacyPermissionName?: Maybe<Scalars['String']['output']>;
  resourceId?: Maybe<Scalars['uuid']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "permissions" */
export type PermissionsMinOrderBy = {
  action?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  legacyPermissionName?: InputMaybe<OrderBy>;
  resourceId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "permissions" */
export type PermissionsMutationResponse = {
  __typename?: 'permissionsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Permissions>;
};

/** input type for inserting object relation for remote table "permissions" */
export type PermissionsObjRelInsertInput = {
  data: PermissionsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<PermissionsOnConflict>;
};

/** on_conflict condition type for table "permissions" */
export type PermissionsOnConflict = {
  constraint: PermissionsConstraint;
  updateColumns?: Array<PermissionsUpdateColumn>;
  where?: InputMaybe<PermissionsBoolExp>;
};

/** Ordering options when selecting data from "permissions". */
export type PermissionsOrderBy = {
  action?: InputMaybe<OrderBy>;
  assignedToRolesAggregate?: InputMaybe<RolePermissionsAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  legacyPermissionName?: InputMaybe<OrderBy>;
  relatedResource?: InputMaybe<ResourcesOrderBy>;
  resourceId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: permissions */
export type PermissionsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "permissions" */
export enum PermissionsSelectColumn {
  /** column name */
  action = 'action',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  legacyPermissionName = 'legacyPermissionName',
  /** column name */
  resourceId = 'resourceId',
  /** column name */
  updatedAt = 'updatedAt'
}

/** input type for updating data in table "permissions" */
export type PermissionsSetInput = {
  action?: InputMaybe<Scalars['permission_action']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  legacyPermissionName?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "permissions" */
export type PermissionsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PermissionsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PermissionsStreamCursorValueInput = {
  action?: InputMaybe<Scalars['permission_action']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  legacyPermissionName?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "permissions" */
export enum PermissionsUpdateColumn {
  /** column name */
  action = 'action',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  legacyPermissionName = 'legacyPermissionName',
  /** column name */
  resourceId = 'resourceId',
  /** column name */
  updatedAt = 'updatedAt'
}

export type PermissionsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PermissionsSetInput>;
  /** filter the rows which have to be updated */
  where: PermissionsBoolExp;
};

export type QueryRoot = {
  __typename?: 'query_root';
  /** query _Entity union */
  _entities?: Maybe<Entity>;
  _service: Service;
  /** execute function "activate_payroll_versions" which returns "payroll_activation_results" */
  activatePayrollVersions: Array<PayrollActivationResults>;
  /** execute function "activate_payroll_versions" and query aggregates on result of table type "payroll_activation_results" */
  activatePayrollVersionsAggregate: PayrollActivationResultsAggregate;
  /** fetch data from the table: "adjustment_rules" using primary key columns */
  adjustmentRuleById?: Maybe<AdjustmentRules>;
  /** An array relationship */
  adjustmentRules: Array<AdjustmentRules>;
  /** An aggregate relationship */
  adjustmentRulesAggregate: AdjustmentRulesAggregate;
  /** fetch data from the table: "app_settings" using primary key columns */
  appSettingById?: Maybe<AppSettings>;
  /** fetch data from the table: "app_settings" */
  appSettings: Array<AppSettings>;
  /** fetch aggregated fields from the table: "app_settings" */
  appSettingsAggregate: AppSettingsAggregate;
  /** fetch data from the table: "audit.audit_log" using primary key columns */
  auditLogById?: Maybe<AuditLogs>;
  /** fetch data from the table: "audit.audit_log" */
  auditLogs: Array<AuditLogs>;
  /** fetch aggregated fields from the table: "audit.audit_log" */
  auditLogsAggregate: AuditLogsAggregate;
  /** fetch data from the table: "audit.auth_events" using primary key columns */
  authEventById?: Maybe<AuthEvents>;
  /** fetch data from the table: "audit.auth_events" */
  authEvents: Array<AuthEvents>;
  /** fetch aggregated fields from the table: "audit.auth_events" */
  authEventsAggregate: AuthEventsAggregate;
  /** fetch data from the table: "billing_event_log" using primary key columns */
  billingEventLogById?: Maybe<BillingEventLogs>;
  /** An array relationship */
  billingEventLogs: Array<BillingEventLogs>;
  /** An aggregate relationship */
  billingEventLogsAggregate: BillingEventLogsAggregate;
  /** fetch data from the table: "billing_invoice" */
  billingInvoice: Array<BillingInvoice>;
  /** fetch aggregated fields from the table: "billing_invoice" */
  billingInvoiceAggregate: BillingInvoiceAggregate;
  /** fetch data from the table: "billing_invoice" using primary key columns */
  billingInvoiceById?: Maybe<BillingInvoice>;
  /** fetch data from the table: "billing_items" using primary key columns */
  billingItemById?: Maybe<BillingItems>;
  /** An array relationship */
  billingItems: Array<BillingItems>;
  /** An aggregate relationship */
  billingItemsAggregate: BillingItemsAggregate;
  /** fetch data from the table: "billing_plan" using primary key columns */
  billingPlanById?: Maybe<BillingPlans>;
  /** fetch data from the table: "billing_plan" */
  billingPlans: Array<BillingPlans>;
  /** fetch aggregated fields from the table: "billing_plan" */
  billingPlansAggregate: BillingPlansAggregate;
  /** fetch data from the table: "client_billing_assignment" using primary key columns */
  clientBillingAssignmentById?: Maybe<ClientBillingAssignments>;
  /** An array relationship */
  clientBillingAssignments: Array<ClientBillingAssignments>;
  /** An aggregate relationship */
  clientBillingAssignmentsAggregate: ClientBillingAssignmentsAggregate;
  /** fetch data from the table: "clients" using primary key columns */
  clientById?: Maybe<Clients>;
  /** fetch data from the table: "client_external_systems" using primary key columns */
  clientExternalSystemById?: Maybe<ClientExternalSystems>;
  /** An array relationship */
  clientExternalSystems: Array<ClientExternalSystems>;
  /** An aggregate relationship */
  clientExternalSystemsAggregate: ClientExternalSystemsAggregate;
  /** fetch data from the table: "clients" */
  clients: Array<Clients>;
  /** fetch aggregated fields from the table: "clients" */
  clientsAggregate: ClientsAggregate;
  /** execute function "create_payroll_version" which returns "payroll_version_results" */
  createPayrollVersion: Array<PayrollVersionResults>;
  /** execute function "create_payroll_version" and query aggregates on result of table type "payroll_version_results" */
  createPayrollVersionAggregate: PayrollVersionResultsAggregate;
  /** execute function "create_payroll_version_simple" which returns "payroll_version_results" */
  createPayrollVersionSimple: Array<PayrollVersionResults>;
  /** execute function "create_payroll_version_simple" and query aggregates on result of table type "payroll_version_results" */
  createPayrollVersionSimpleAggregate: PayrollVersionResultsAggregate;
  /** fetch data from the table: "current_payrolls" */
  currentPayrolls: Array<CurrentPayrolls>;
  /** fetch aggregated fields from the table: "current_payrolls" */
  currentPayrollsAggregate: CurrentPayrollsAggregate;
  /** fetch data from the table: "audit.data_access_log" using primary key columns */
  dataAccessLogById?: Maybe<DataAccessLogs>;
  /** fetch data from the table: "audit.data_access_log" */
  dataAccessLogs: Array<DataAccessLogs>;
  /** fetch aggregated fields from the table: "audit.data_access_log" */
  dataAccessLogsAggregate: DataAccessLogsAggregate;
  /** fetch data from the table: "external_systems" using primary key columns */
  externalSystemById?: Maybe<ExternalSystems>;
  /** fetch data from the table: "external_systems" */
  externalSystems: Array<ExternalSystems>;
  /** fetch aggregated fields from the table: "external_systems" */
  externalSystemsAggregate: ExternalSystemsAggregate;
  /** fetch data from the table: "feature_flags" using primary key columns */
  featureFlagById?: Maybe<FeatureFlags>;
  /** fetch data from the table: "feature_flags" */
  featureFlags: Array<FeatureFlags>;
  /** fetch aggregated fields from the table: "feature_flags" */
  featureFlagsAggregate: FeatureFlagsAggregate;
  /** execute function "generate_payroll_dates" which returns "payroll_dates" */
  generatePayrollDates: Array<PayrollDates>;
  /** execute function "generate_payroll_dates" and query aggregates on result of table type "payroll_dates" */
  generatePayrollDatesAggregate: PayrollDatesAggregate;
  /** execute function "get_latest_payroll_version" which returns "latest_payroll_version_results" */
  getLatestPayrollVersion: Array<LatestPayrollVersionResults>;
  /** execute function "get_latest_payroll_version" and query aggregates on result of table type "latest_payroll_version_results" */
  getLatestPayrollVersionAggregate: LatestPayrollVersionResultsAggregate;
  /** execute function "get_payroll_version_history" which returns "payroll_version_history_results" */
  getPayrollVersionHistory: Array<PayrollVersionHistoryResults>;
  /** execute function "get_payroll_version_history" and query aggregates on result of table type "payroll_version_history_results" */
  getPayrollVersionHistoryAggregate: PayrollVersionHistoryResultsAggregate;
  /** fetch data from the table: "holidays" using primary key columns */
  holidayById?: Maybe<Holidays>;
  /** fetch data from the table: "holidays" */
  holidays: Array<Holidays>;
  /** fetch aggregated fields from the table: "holidays" */
  holidaysAggregate: HolidaysAggregate;
  /** fetch data from the table: "latest_payroll_version_results" using primary key columns */
  latestPayrollVersionResultById?: Maybe<LatestPayrollVersionResults>;
  /** fetch data from the table: "latest_payroll_version_results" */
  latestPayrollVersionResults: Array<LatestPayrollVersionResults>;
  /** fetch aggregated fields from the table: "latest_payroll_version_results" */
  latestPayrollVersionResultsAggregate: LatestPayrollVersionResultsAggregate;
  /** fetch data from the table: "leave" */
  leave: Array<Leave>;
  /** fetch aggregated fields from the table: "leave" */
  leaveAggregate: LeaveAggregate;
  /** fetch data from the table: "leave" using primary key columns */
  leaveById?: Maybe<Leave>;
  /** fetch data from the table: "notes" using primary key columns */
  noteById?: Maybe<Notes>;
  /** fetch data from the table: "notes" */
  notes: Array<Notes>;
  /** fetch aggregated fields from the table: "notes" */
  notesAggregate: NotesAggregate;
  /** fetch data from the table: "payroll_activation_results" using primary key columns */
  payrollActivationResultById?: Maybe<PayrollActivationResults>;
  /** fetch data from the table: "payroll_activation_results" */
  payrollActivationResults: Array<PayrollActivationResults>;
  /** fetch aggregated fields from the table: "payroll_activation_results" */
  payrollActivationResultsAggregate: PayrollActivationResultsAggregate;
  /** fetch data from the table: "payroll_assignment_audit" using primary key columns */
  payrollAssignmentAuditById?: Maybe<PayrollAssignmentAudits>;
  /** An array relationship */
  payrollAssignmentAudits: Array<PayrollAssignmentAudits>;
  /** An aggregate relationship */
  payrollAssignmentAuditsAggregate: PayrollAssignmentAuditsAggregate;
  /** fetch data from the table: "payroll_assignments" using primary key columns */
  payrollAssignmentById?: Maybe<PayrollAssignments>;
  /** fetch data from the table: "payroll_assignments" */
  payrollAssignments: Array<PayrollAssignments>;
  /** fetch aggregated fields from the table: "payroll_assignments" */
  payrollAssignmentsAggregate: PayrollAssignmentsAggregate;
  /** fetch data from the table: "payrolls" using primary key columns */
  payrollById?: Maybe<Payrolls>;
  /** fetch data from the table: "payroll_cycles" using primary key columns */
  payrollCycleById?: Maybe<PayrollCycles>;
  /** fetch data from the table: "payroll_cycles" */
  payrollCycles: Array<PayrollCycles>;
  /** fetch aggregated fields from the table: "payroll_cycles" */
  payrollCyclesAggregate: PayrollCyclesAggregate;
  /** fetch data from the table: "payroll_dashboard_stats" */
  payrollDashboardStats: Array<PayrollDashboardStats>;
  /** fetch aggregated fields from the table: "payroll_dashboard_stats" */
  payrollDashboardStatsAggregate: PayrollDashboardStatsAggregate;
  /** fetch data from the table: "payroll_dates" using primary key columns */
  payrollDateById?: Maybe<PayrollDates>;
  /** fetch data from the table: "payroll_date_types" using primary key columns */
  payrollDateTypeById?: Maybe<PayrollDateTypes>;
  /** fetch data from the table: "payroll_date_types" */
  payrollDateTypes: Array<PayrollDateTypes>;
  /** fetch aggregated fields from the table: "payroll_date_types" */
  payrollDateTypesAggregate: PayrollDateTypesAggregate;
  /** An array relationship */
  payrollDates: Array<PayrollDates>;
  /** An aggregate relationship */
  payrollDatesAggregate: PayrollDatesAggregate;
  /** fetch data from the table: "payroll_triggers_status" */
  payrollTriggersStatus: Array<PayrollTriggersStatus>;
  /** fetch aggregated fields from the table: "payroll_triggers_status" */
  payrollTriggersStatusAggregate: PayrollTriggersStatusAggregate;
  /** fetch data from the table: "payroll_version_history_results" using primary key columns */
  payrollVersionHistoryResultById?: Maybe<PayrollVersionHistoryResults>;
  /** fetch data from the table: "payroll_version_history_results" */
  payrollVersionHistoryResults: Array<PayrollVersionHistoryResults>;
  /** fetch aggregated fields from the table: "payroll_version_history_results" */
  payrollVersionHistoryResultsAggregate: PayrollVersionHistoryResultsAggregate;
  /** fetch data from the table: "payroll_version_results" using primary key columns */
  payrollVersionResultById?: Maybe<PayrollVersionResults>;
  /** fetch data from the table: "payroll_version_results" */
  payrollVersionResults: Array<PayrollVersionResults>;
  /** fetch aggregated fields from the table: "payroll_version_results" */
  payrollVersionResultsAggregate: PayrollVersionResultsAggregate;
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrollsAggregate: PayrollsAggregate;
  /** fetch data from the table: "permission_audit_log" using primary key columns */
  permissionAuditLogById?: Maybe<PermissionAuditLogs>;
  /** fetch data from the table: "permission_audit_log" */
  permissionAuditLogs: Array<PermissionAuditLogs>;
  /** fetch aggregated fields from the table: "permission_audit_log" */
  permissionAuditLogsAggregate: PermissionAuditLogsAggregate;
  /** fetch data from the table: "permissions" using primary key columns */
  permissionById?: Maybe<Permissions>;
  /** fetch data from the table: "audit.permission_changes" using primary key columns */
  permissionChangeById?: Maybe<PermissionChanges>;
  /** fetch data from the table: "audit.permission_changes" */
  permissionChanges: Array<PermissionChanges>;
  /** fetch aggregated fields from the table: "audit.permission_changes" */
  permissionChangesAggregate: PermissionChangesAggregate;
  /** fetch data from the table: "permission_overrides" using primary key columns */
  permissionOverrideById?: Maybe<PermissionOverrides>;
  /** fetch data from the table: "permission_overrides" */
  permissionOverrides: Array<PermissionOverrides>;
  /** fetch aggregated fields from the table: "permission_overrides" */
  permissionOverridesAggregate: PermissionOverridesAggregate;
  /** fetch data from the table: "audit.permission_usage_report" */
  permissionUsageReports: Array<PermissionUsageReports>;
  /** fetch aggregated fields from the table: "audit.permission_usage_report" */
  permissionUsageReportsAggregate: PermissionUsageReportsAggregate;
  /** fetch data from the table: "permissions" */
  permissions: Array<Permissions>;
  /** fetch aggregated fields from the table: "permissions" */
  permissionsAggregate: PermissionsAggregate;
  /** fetch data from the table: "resources" using primary key columns */
  resourceById?: Maybe<Resources>;
  /** fetch data from the table: "resources" */
  resources: Array<Resources>;
  /** fetch aggregated fields from the table: "resources" */
  resourcesAggregate: ResourcesAggregate;
  /** fetch data from the table: "roles" using primary key columns */
  roleById?: Maybe<Roles>;
  /** fetch data from the table: "role_permissions" using primary key columns */
  rolePermissionById?: Maybe<RolePermissions>;
  /** fetch data from the table: "role_permissions" */
  rolePermissions: Array<RolePermissions>;
  /** fetch aggregated fields from the table: "role_permissions" */
  rolePermissionsAggregate: RolePermissionsAggregate;
  /** fetch data from the table: "roles" */
  roles: Array<Roles>;
  /** fetch aggregated fields from the table: "roles" */
  rolesAggregate: RolesAggregate;
  /** fetch data from the table: "audit.slow_queries" */
  slowQueries: Array<SlowQueries>;
  /** fetch aggregated fields from the table: "audit.slow_queries" */
  slowQueriesAggregate: SlowQueriesAggregate;
  /** fetch data from the table: "audit.slow_queries" using primary key columns */
  slowQueryById?: Maybe<SlowQueries>;
  /** fetch data from the table: "audit.user_access_summary" */
  userAccessSummaries: Array<UserAccessSummaries>;
  /** fetch aggregated fields from the table: "audit.user_access_summary" */
  userAccessSummariesAggregate: UserAccessSummariesAggregate;
  /** fetch data from the table: "users" using primary key columns */
  userById?: Maybe<Users>;
  /** fetch data from the table: "user_invitations" using primary key columns */
  userInvitationById?: Maybe<UserInvitations>;
  /** fetch data from the table: "user_invitations" */
  userInvitations: Array<UserInvitations>;
  /** fetch aggregated fields from the table: "user_invitations" */
  userInvitationsAggregate: UserInvitationsAggregate;
  /** fetch data from the table: "user_roles" using primary key columns */
  userRoleById?: Maybe<UserRoles>;
  /** fetch data from the table: "user_roles" */
  userRoles: Array<UserRoles>;
  /** fetch aggregated fields from the table: "user_roles" */
  userRolesAggregate: UserRolesAggregate;
  /** fetch data from the table: "neon_auth.users_sync" using primary key columns */
  userSyncById?: Maybe<AuthUsersSync>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  usersAggregate: UsersAggregate;
  /** fetch data from the table: "users_role_backup" */
  usersRoleBackups: Array<UsersRoleBackup>;
  /** fetch aggregated fields from the table: "users_role_backup" */
  usersRoleBackupsAggregate: UsersRoleBackupAggregate;
  /** fetch data from the table: "neon_auth.users_sync" */
  usersSync: Array<AuthUsersSync>;
  /** fetch aggregated fields from the table: "neon_auth.users_sync" */
  usersSyncAggregate: AuthUsersSyncAggregate;
  /** fetch data from the table: "work_schedule" using primary key columns */
  workScheduleById?: Maybe<WorkSchedules>;
  /** fetch data from the table: "work_schedule" */
  workSchedules: Array<WorkSchedules>;
  /** fetch aggregated fields from the table: "work_schedule" */
  workSchedulesAggregate: WorkSchedulesAggregate;
};


export type QueryRootEntitiesArgs = {
  representations: Array<Scalars['_Any']['input']>;
};


export type QueryRootActivatePayrollVersionsArgs = {
  distinctOn?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type QueryRootActivatePayrollVersionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type QueryRootAdjustmentRuleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootAdjustmentRulesArgs = {
  distinctOn?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


export type QueryRootAdjustmentRulesAggregateArgs = {
  distinctOn?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


export type QueryRootAppSettingByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryRootAppSettingsArgs = {
  distinctOn?: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AppSettingsOrderBy>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};


export type QueryRootAppSettingsAggregateArgs = {
  distinctOn?: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AppSettingsOrderBy>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};


export type QueryRootAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootAuditLogsArgs = {
  distinctOn?: InputMaybe<Array<AuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuditLogsOrderBy>>;
  where?: InputMaybe<AuditLogsBoolExp>;
};


export type QueryRootAuditLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<AuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuditLogsOrderBy>>;
  where?: InputMaybe<AuditLogsBoolExp>;
};


export type QueryRootAuthEventByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootAuthEventsArgs = {
  distinctOn?: InputMaybe<Array<AuthEventsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuthEventsOrderBy>>;
  where?: InputMaybe<AuthEventsBoolExp>;
};


export type QueryRootAuthEventsAggregateArgs = {
  distinctOn?: InputMaybe<Array<AuthEventsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuthEventsOrderBy>>;
  where?: InputMaybe<AuthEventsBoolExp>;
};


export type QueryRootBillingEventLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootBillingEventLogsArgs = {
  distinctOn?: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where?: InputMaybe<BillingEventLogsBoolExp>;
};


export type QueryRootBillingEventLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where?: InputMaybe<BillingEventLogsBoolExp>;
};


export type QueryRootBillingInvoiceArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


export type QueryRootBillingInvoiceAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


export type QueryRootBillingInvoiceByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootBillingItemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootBillingItemsArgs = {
  distinctOn?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


export type QueryRootBillingItemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


export type QueryRootBillingPlanByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootBillingPlansArgs = {
  distinctOn?: InputMaybe<Array<BillingPlansSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingPlansOrderBy>>;
  where?: InputMaybe<BillingPlansBoolExp>;
};


export type QueryRootBillingPlansAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingPlansSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingPlansOrderBy>>;
  where?: InputMaybe<BillingPlansBoolExp>;
};


export type QueryRootClientBillingAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootClientBillingAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


export type QueryRootClientBillingAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


export type QueryRootClientByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootClientExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootClientExternalSystemsArgs = {
  distinctOn?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type QueryRootClientExternalSystemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type QueryRootClientsArgs = {
  distinctOn?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};


export type QueryRootClientsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};


export type QueryRootCreatePayrollVersionArgs = {
  args: CreatePayrollVersionArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type QueryRootCreatePayrollVersionAggregateArgs = {
  args: CreatePayrollVersionArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type QueryRootCreatePayrollVersionSimpleArgs = {
  args: CreatePayrollVersionSimpleArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type QueryRootCreatePayrollVersionSimpleAggregateArgs = {
  args: CreatePayrollVersionSimpleArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type QueryRootCurrentPayrollsArgs = {
  distinctOn?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};


export type QueryRootCurrentPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};


export type QueryRootDataAccessLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootDataAccessLogsArgs = {
  distinctOn?: InputMaybe<Array<DataAccessLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DataAccessLogsOrderBy>>;
  where?: InputMaybe<DataAccessLogsBoolExp>;
};


export type QueryRootDataAccessLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<DataAccessLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DataAccessLogsOrderBy>>;
  where?: InputMaybe<DataAccessLogsBoolExp>;
};


export type QueryRootExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootExternalSystemsArgs = {
  distinctOn?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};


export type QueryRootExternalSystemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};


export type QueryRootFeatureFlagByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootFeatureFlagsArgs = {
  distinctOn?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};


export type QueryRootFeatureFlagsAggregateArgs = {
  distinctOn?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};


export type QueryRootGeneratePayrollDatesArgs = {
  args: GeneratePayrollDatesArgs;
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type QueryRootGeneratePayrollDatesAggregateArgs = {
  args: GeneratePayrollDatesArgs;
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type QueryRootGetLatestPayrollVersionArgs = {
  args: GetLatestPayrollVersionArgs;
  distinctOn?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type QueryRootGetLatestPayrollVersionAggregateArgs = {
  args: GetLatestPayrollVersionArgs;
  distinctOn?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type QueryRootGetPayrollVersionHistoryArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type QueryRootGetPayrollVersionHistoryAggregateArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type QueryRootHolidayByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootHolidaysArgs = {
  distinctOn?: InputMaybe<Array<HolidaysSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<HolidaysOrderBy>>;
  where?: InputMaybe<HolidaysBoolExp>;
};


export type QueryRootHolidaysAggregateArgs = {
  distinctOn?: InputMaybe<Array<HolidaysSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<HolidaysOrderBy>>;
  where?: InputMaybe<HolidaysBoolExp>;
};


export type QueryRootLatestPayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootLatestPayrollVersionResultsArgs = {
  distinctOn?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type QueryRootLatestPayrollVersionResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type QueryRootLeaveArgs = {
  distinctOn?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};


export type QueryRootLeaveAggregateArgs = {
  distinctOn?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};


export type QueryRootLeaveByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootNoteByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootNotesArgs = {
  distinctOn?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};


export type QueryRootNotesAggregateArgs = {
  distinctOn?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};


export type QueryRootPayrollActivationResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollActivationResultsArgs = {
  distinctOn?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type QueryRootPayrollActivationResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type QueryRootPayrollAssignmentAuditByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollAssignmentAuditsArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


export type QueryRootPayrollAssignmentAuditsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


export type QueryRootPayrollAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type QueryRootPayrollAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type QueryRootPayrollByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollCycleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollCyclesArgs = {
  distinctOn?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};


export type QueryRootPayrollCyclesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};


export type QueryRootPayrollDashboardStatsArgs = {
  distinctOn?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type QueryRootPayrollDashboardStatsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type QueryRootPayrollDateByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollDateTypeByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollDateTypesArgs = {
  distinctOn?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};


export type QueryRootPayrollDateTypesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};


export type QueryRootPayrollDatesArgs = {
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type QueryRootPayrollDatesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type QueryRootPayrollTriggersStatusArgs = {
  distinctOn?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type QueryRootPayrollTriggersStatusAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type QueryRootPayrollVersionHistoryResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollVersionHistoryResultsArgs = {
  distinctOn?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type QueryRootPayrollVersionHistoryResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type QueryRootPayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollVersionResultsArgs = {
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type QueryRootPayrollVersionResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type QueryRootPayrollsArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


export type QueryRootPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


export type QueryRootPermissionAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPermissionAuditLogsArgs = {
  distinctOn?: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where?: InputMaybe<PermissionAuditLogsBoolExp>;
};


export type QueryRootPermissionAuditLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where?: InputMaybe<PermissionAuditLogsBoolExp>;
};


export type QueryRootPermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPermissionChangeByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPermissionChangesArgs = {
  distinctOn?: InputMaybe<Array<PermissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionChangesOrderBy>>;
  where?: InputMaybe<PermissionChangesBoolExp>;
};


export type QueryRootPermissionChangesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionChangesOrderBy>>;
  where?: InputMaybe<PermissionChangesBoolExp>;
};


export type QueryRootPermissionOverrideByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPermissionOverridesArgs = {
  distinctOn?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};


export type QueryRootPermissionOverridesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};


export type QueryRootPermissionUsageReportsArgs = {
  distinctOn?: InputMaybe<Array<PermissionUsageReportsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionUsageReportsOrderBy>>;
  where?: InputMaybe<PermissionUsageReportsBoolExp>;
};


export type QueryRootPermissionUsageReportsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionUsageReportsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionUsageReportsOrderBy>>;
  where?: InputMaybe<PermissionUsageReportsBoolExp>;
};


export type QueryRootPermissionsArgs = {
  distinctOn?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};


export type QueryRootPermissionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};


export type QueryRootResourceByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootResourcesArgs = {
  distinctOn?: InputMaybe<Array<ResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ResourcesOrderBy>>;
  where?: InputMaybe<ResourcesBoolExp>;
};


export type QueryRootResourcesAggregateArgs = {
  distinctOn?: InputMaybe<Array<ResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ResourcesOrderBy>>;
  where?: InputMaybe<ResourcesBoolExp>;
};


export type QueryRootRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootRolePermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootRolePermissionsArgs = {
  distinctOn?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


export type QueryRootRolePermissionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


export type QueryRootRolesArgs = {
  distinctOn?: InputMaybe<Array<RolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolesOrderBy>>;
  where?: InputMaybe<RolesBoolExp>;
};


export type QueryRootRolesAggregateArgs = {
  distinctOn?: InputMaybe<Array<RolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolesOrderBy>>;
  where?: InputMaybe<RolesBoolExp>;
};


export type QueryRootSlowQueriesArgs = {
  distinctOn?: InputMaybe<Array<SlowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SlowQueriesOrderBy>>;
  where?: InputMaybe<SlowQueriesBoolExp>;
};


export type QueryRootSlowQueriesAggregateArgs = {
  distinctOn?: InputMaybe<Array<SlowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SlowQueriesOrderBy>>;
  where?: InputMaybe<SlowQueriesBoolExp>;
};


export type QueryRootSlowQueryByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootUserAccessSummariesArgs = {
  distinctOn?: InputMaybe<Array<UserAccessSummariesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserAccessSummariesOrderBy>>;
  where?: InputMaybe<UserAccessSummariesBoolExp>;
};


export type QueryRootUserAccessSummariesAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserAccessSummariesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserAccessSummariesOrderBy>>;
  where?: InputMaybe<UserAccessSummariesBoolExp>;
};


export type QueryRootUserByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootUserInvitationByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootUserInvitationsArgs = {
  distinctOn?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserInvitationsOrderBy>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};


export type QueryRootUserInvitationsAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserInvitationsOrderBy>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};


export type QueryRootUserRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootUserRolesArgs = {
  distinctOn?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


export type QueryRootUserRolesAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


export type QueryRootUserSyncByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryRootUsersArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type QueryRootUsersAggregateArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type QueryRootUsersRoleBackupsArgs = {
  distinctOn?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};


export type QueryRootUsersRoleBackupsAggregateArgs = {
  distinctOn?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};


export type QueryRootUsersSyncArgs = {
  distinctOn?: InputMaybe<Array<AuthUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuthUsersSyncOrderBy>>;
  where?: InputMaybe<AuthUsersSyncBoolExp>;
};


export type QueryRootUsersSyncAggregateArgs = {
  distinctOn?: InputMaybe<Array<AuthUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuthUsersSyncOrderBy>>;
  where?: InputMaybe<AuthUsersSyncBoolExp>;
};


export type QueryRootWorkScheduleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootWorkSchedulesArgs = {
  distinctOn?: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkSchedulesOrderBy>>;
  where?: InputMaybe<WorkSchedulesBoolExp>;
};


export type QueryRootWorkSchedulesAggregateArgs = {
  distinctOn?: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkSchedulesOrderBy>>;
  where?: InputMaybe<WorkSchedulesBoolExp>;
};

/** columns and relationships of "resources" */
export type Resources = {
  __typename?: 'resources';
  /** An array relationship */
  availablePermissions: Array<Permissions>;
  /** An aggregate relationship */
  availablePermissionsAggregate: PermissionsAggregate;
  createdAt: Scalars['timestamptz']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['timestamptz']['output'];
};


/** columns and relationships of "resources" */
export type ResourcesAvailablePermissionsArgs = {
  distinctOn?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};


/** columns and relationships of "resources" */
export type ResourcesAvailablePermissionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};

/** aggregated selection of "resources" */
export type ResourcesAggregate = {
  __typename?: 'resourcesAggregate';
  aggregate?: Maybe<ResourcesAggregateFields>;
  nodes: Array<Resources>;
};

/** aggregate fields of "resources" */
export type ResourcesAggregateFields = {
  __typename?: 'resourcesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<ResourcesMaxFields>;
  min?: Maybe<ResourcesMinFields>;
};


/** aggregate fields of "resources" */
export type ResourcesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ResourcesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "resources". All fields are combined with a logical 'AND'. */
export type ResourcesBoolExp = {
  _and?: InputMaybe<Array<ResourcesBoolExp>>;
  _not?: InputMaybe<ResourcesBoolExp>;
  _or?: InputMaybe<Array<ResourcesBoolExp>>;
  availablePermissions?: InputMaybe<PermissionsBoolExp>;
  availablePermissionsAggregate?: InputMaybe<PermissionsAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  displayName?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "resources" */
export enum ResourcesConstraint {
  /** unique or primary key constraint on columns "name" */
  resources_name_key = 'resources_name_key',
  /** unique or primary key constraint on columns "id" */
  resources_pkey = 'resources_pkey'
}

/** input type for inserting data into table "resources" */
export type ResourcesInsertInput = {
  availablePermissions?: InputMaybe<PermissionsArrRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type ResourcesMaxFields = {
  __typename?: 'resourcesMaxFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type ResourcesMinFields = {
  __typename?: 'resourcesMinFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "resources" */
export type ResourcesMutationResponse = {
  __typename?: 'resourcesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Resources>;
};

/** input type for inserting object relation for remote table "resources" */
export type ResourcesObjRelInsertInput = {
  data: ResourcesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<ResourcesOnConflict>;
};

/** on_conflict condition type for table "resources" */
export type ResourcesOnConflict = {
  constraint: ResourcesConstraint;
  updateColumns?: Array<ResourcesUpdateColumn>;
  where?: InputMaybe<ResourcesBoolExp>;
};

/** Ordering options when selecting data from "resources". */
export type ResourcesOrderBy = {
  availablePermissionsAggregate?: InputMaybe<PermissionsAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  displayName?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: resources */
export type ResourcesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "resources" */
export enum ResourcesSelectColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  description = 'description',
  /** column name */
  displayName = 'displayName',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updatedAt = 'updatedAt'
}

/** input type for updating data in table "resources" */
export type ResourcesSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "resources" */
export type ResourcesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: ResourcesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ResourcesStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "resources" */
export enum ResourcesUpdateColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  description = 'description',
  /** column name */
  displayName = 'displayName',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updatedAt = 'updatedAt'
}

export type ResourcesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ResourcesSetInput>;
  /** filter the rows which have to be updated */
  where: ResourcesBoolExp;
};

/** columns and relationships of "role_permissions" */
export type RolePermissions = {
  __typename?: 'rolePermissions';
  conditions?: Maybe<Scalars['jsonb']['output']>;
  createdAt: Scalars['timestamptz']['output'];
  /** An object relationship */
  grantedPermission: Permissions;
  /** An object relationship */
  grantedToRole: Roles;
  id: Scalars['uuid']['output'];
  permissionId: Scalars['uuid']['output'];
  roleId: Scalars['uuid']['output'];
  updatedAt: Scalars['timestamptz']['output'];
};


/** columns and relationships of "role_permissions" */
export type RolePermissionsConditionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "role_permissions" */
export type RolePermissionsAggregate = {
  __typename?: 'rolePermissionsAggregate';
  aggregate?: Maybe<RolePermissionsAggregateFields>;
  nodes: Array<RolePermissions>;
};

export type RolePermissionsAggregateBoolExp = {
  count?: InputMaybe<RolePermissionsAggregateBoolExpCount>;
};

export type RolePermissionsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<RolePermissionsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "role_permissions" */
export type RolePermissionsAggregateFields = {
  __typename?: 'rolePermissionsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<RolePermissionsMaxFields>;
  min?: Maybe<RolePermissionsMinFields>;
};


/** aggregate fields of "role_permissions" */
export type RolePermissionsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "role_permissions" */
export type RolePermissionsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<RolePermissionsMaxOrderBy>;
  min?: InputMaybe<RolePermissionsMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type RolePermissionsAppendInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "role_permissions" */
export type RolePermissionsArrRelInsertInput = {
  data: Array<RolePermissionsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<RolePermissionsOnConflict>;
};

/** Boolean expression to filter rows from the table "role_permissions". All fields are combined with a logical 'AND'. */
export type RolePermissionsBoolExp = {
  _and?: InputMaybe<Array<RolePermissionsBoolExp>>;
  _not?: InputMaybe<RolePermissionsBoolExp>;
  _or?: InputMaybe<Array<RolePermissionsBoolExp>>;
  conditions?: InputMaybe<JsonbComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  grantedPermission?: InputMaybe<PermissionsBoolExp>;
  grantedToRole?: InputMaybe<RolesBoolExp>;
  id?: InputMaybe<UuidComparisonExp>;
  permissionId?: InputMaybe<UuidComparisonExp>;
  roleId?: InputMaybe<UuidComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "role_permissions" */
export enum RolePermissionsConstraint {
  /** unique or primary key constraint on columns "id" */
  role_permissions_pkey = 'role_permissions_pkey',
  /** unique or primary key constraint on columns "permission_id", "role_id" */
  role_permissions_role_id_permission_id_key = 'role_permissions_role_id_permission_id_key'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type RolePermissionsDeleteAtPathInput = {
  conditions?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type RolePermissionsDeleteElemInput = {
  conditions?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type RolePermissionsDeleteKeyInput = {
  conditions?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "role_permissions" */
export type RolePermissionsInsertInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  grantedPermission?: InputMaybe<PermissionsObjRelInsertInput>;
  grantedToRole?: InputMaybe<RolesObjRelInsertInput>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  permissionId?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type RolePermissionsMaxFields = {
  __typename?: 'rolePermissionsMaxFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  permissionId?: Maybe<Scalars['uuid']['output']>;
  roleId?: Maybe<Scalars['uuid']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "role_permissions" */
export type RolePermissionsMaxOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  permissionId?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type RolePermissionsMinFields = {
  __typename?: 'rolePermissionsMinFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  permissionId?: Maybe<Scalars['uuid']['output']>;
  roleId?: Maybe<Scalars['uuid']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "role_permissions" */
export type RolePermissionsMinOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  permissionId?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "role_permissions" */
export type RolePermissionsMutationResponse = {
  __typename?: 'rolePermissionsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<RolePermissions>;
};

/** on_conflict condition type for table "role_permissions" */
export type RolePermissionsOnConflict = {
  constraint: RolePermissionsConstraint;
  updateColumns?: Array<RolePermissionsUpdateColumn>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};

/** Ordering options when selecting data from "role_permissions". */
export type RolePermissionsOrderBy = {
  conditions?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  grantedPermission?: InputMaybe<PermissionsOrderBy>;
  grantedToRole?: InputMaybe<RolesOrderBy>;
  id?: InputMaybe<OrderBy>;
  permissionId?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: role_permissions */
export type RolePermissionsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type RolePermissionsPrependInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "role_permissions" */
export enum RolePermissionsSelectColumn {
  /** column name */
  conditions = 'conditions',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  permissionId = 'permissionId',
  /** column name */
  roleId = 'roleId',
  /** column name */
  updatedAt = 'updatedAt'
}

/** input type for updating data in table "role_permissions" */
export type RolePermissionsSetInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  permissionId?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "rolePermissions" */
export type RolePermissionsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: RolePermissionsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RolePermissionsStreamCursorValueInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  permissionId?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "role_permissions" */
export enum RolePermissionsUpdateColumn {
  /** column name */
  conditions = 'conditions',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  permissionId = 'permissionId',
  /** column name */
  roleId = 'roleId',
  /** column name */
  updatedAt = 'updatedAt'
}

export type RolePermissionsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<RolePermissionsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<RolePermissionsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<RolePermissionsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<RolePermissionsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<RolePermissionsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<RolePermissionsSetInput>;
  /** filter the rows which have to be updated */
  where: RolePermissionsBoolExp;
};

/** columns and relationships of "roles" */
export type Roles = {
  __typename?: 'roles';
  /** An array relationship */
  assignedPermissions: Array<RolePermissions>;
  /** An aggregate relationship */
  assignedPermissionsAggregate: RolePermissionsAggregate;
  /** An array relationship */
  assignedToUsers: Array<UserRoles>;
  /** An aggregate relationship */
  assignedToUsersAggregate: UserRolesAggregate;
  createdAt: Scalars['timestamptz']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  isSystemRole: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  updatedAt: Scalars['timestamptz']['output'];
};


/** columns and relationships of "roles" */
export type RolesAssignedPermissionsArgs = {
  distinctOn?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


/** columns and relationships of "roles" */
export type RolesAssignedPermissionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


/** columns and relationships of "roles" */
export type RolesAssignedToUsersArgs = {
  distinctOn?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


/** columns and relationships of "roles" */
export type RolesAssignedToUsersAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};

/** aggregated selection of "roles" */
export type RolesAggregate = {
  __typename?: 'rolesAggregate';
  aggregate?: Maybe<RolesAggregateFields>;
  nodes: Array<Roles>;
};

/** aggregate fields of "roles" */
export type RolesAggregateFields = {
  __typename?: 'rolesAggregateFields';
  avg?: Maybe<RolesAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<RolesMaxFields>;
  min?: Maybe<RolesMinFields>;
  stddev?: Maybe<RolesStddevFields>;
  stddevPop?: Maybe<RolesStddevPopFields>;
  stddevSamp?: Maybe<RolesStddevSampFields>;
  sum?: Maybe<RolesSumFields>;
  varPop?: Maybe<RolesVarPopFields>;
  varSamp?: Maybe<RolesVarSampFields>;
  variance?: Maybe<RolesVarianceFields>;
};


/** aggregate fields of "roles" */
export type RolesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<RolesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type RolesAvgFields = {
  __typename?: 'rolesAvgFields';
  priority?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "roles". All fields are combined with a logical 'AND'. */
export type RolesBoolExp = {
  _and?: InputMaybe<Array<RolesBoolExp>>;
  _not?: InputMaybe<RolesBoolExp>;
  _or?: InputMaybe<Array<RolesBoolExp>>;
  assignedPermissions?: InputMaybe<RolePermissionsBoolExp>;
  assignedPermissionsAggregate?: InputMaybe<RolePermissionsAggregateBoolExp>;
  assignedToUsers?: InputMaybe<UserRolesBoolExp>;
  assignedToUsersAggregate?: InputMaybe<UserRolesAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  displayName?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isSystemRole?: InputMaybe<BooleanComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  priority?: InputMaybe<IntComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "roles" */
export enum RolesConstraint {
  /** unique or primary key constraint on columns "name" */
  roles_name_key = 'roles_name_key',
  /** unique or primary key constraint on columns "id" */
  roles_pkey = 'roles_pkey'
}

/** input type for incrementing numeric columns in table "roles" */
export type RolesIncInput = {
  priority?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "roles" */
export type RolesInsertInput = {
  assignedPermissions?: InputMaybe<RolePermissionsArrRelInsertInput>;
  assignedToUsers?: InputMaybe<UserRolesArrRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isSystemRole?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type RolesMaxFields = {
  __typename?: 'rolesMaxFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type RolesMinFields = {
  __typename?: 'rolesMinFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "roles" */
export type RolesMutationResponse = {
  __typename?: 'rolesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Roles>;
};

/** input type for inserting object relation for remote table "roles" */
export type RolesObjRelInsertInput = {
  data: RolesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<RolesOnConflict>;
};

/** on_conflict condition type for table "roles" */
export type RolesOnConflict = {
  constraint: RolesConstraint;
  updateColumns?: Array<RolesUpdateColumn>;
  where?: InputMaybe<RolesBoolExp>;
};

/** Ordering options when selecting data from "roles". */
export type RolesOrderBy = {
  assignedPermissionsAggregate?: InputMaybe<RolePermissionsAggregateOrderBy>;
  assignedToUsersAggregate?: InputMaybe<UserRolesAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  displayName?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isSystemRole?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  priority?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: roles */
export type RolesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "roles" */
export enum RolesSelectColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  description = 'description',
  /** column name */
  displayName = 'displayName',
  /** column name */
  id = 'id',
  /** column name */
  isSystemRole = 'isSystemRole',
  /** column name */
  name = 'name',
  /** column name */
  priority = 'priority',
  /** column name */
  updatedAt = 'updatedAt'
}

/** input type for updating data in table "roles" */
export type RolesSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isSystemRole?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type RolesStddevFields = {
  __typename?: 'rolesStddevFields';
  priority?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type RolesStddevPopFields = {
  __typename?: 'rolesStddevPopFields';
  priority?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type RolesStddevSampFields = {
  __typename?: 'rolesStddevSampFields';
  priority?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "roles" */
export type RolesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: RolesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RolesStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isSystemRole?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type RolesSumFields = {
  __typename?: 'rolesSumFields';
  priority?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "roles" */
export enum RolesUpdateColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  description = 'description',
  /** column name */
  displayName = 'displayName',
  /** column name */
  id = 'id',
  /** column name */
  isSystemRole = 'isSystemRole',
  /** column name */
  name = 'name',
  /** column name */
  priority = 'priority',
  /** column name */
  updatedAt = 'updatedAt'
}

export type RolesUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<RolesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<RolesSetInput>;
  /** filter the rows which have to be updated */
  where: RolesBoolExp;
};

/** aggregate varPop on columns */
export type RolesVarPopFields = {
  __typename?: 'rolesVarPopFields';
  priority?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type RolesVarSampFields = {
  __typename?: 'rolesVarSampFields';
  priority?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type RolesVarianceFields = {
  __typename?: 'rolesVarianceFields';
  priority?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "audit.slow_queries" */
export type SlowQueries = {
  __typename?: 'slowQueries';
  applicationName?: Maybe<Scalars['String']['output']>;
  clientAddr?: Maybe<Scalars['inet']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  query: Scalars['String']['output'];
  queryDuration: Scalars['interval']['output'];
  queryStart: Scalars['timestamptz']['output'];
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "audit.slow_queries" */
export type SlowQueriesAggregate = {
  __typename?: 'slowQueriesAggregate';
  aggregate?: Maybe<SlowQueriesAggregateFields>;
  nodes: Array<SlowQueries>;
};

/** aggregate fields of "audit.slow_queries" */
export type SlowQueriesAggregateFields = {
  __typename?: 'slowQueriesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<SlowQueriesMaxFields>;
  min?: Maybe<SlowQueriesMinFields>;
};


/** aggregate fields of "audit.slow_queries" */
export type SlowQueriesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<SlowQueriesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "audit.slow_queries". All fields are combined with a logical 'AND'. */
export type SlowQueriesBoolExp = {
  _and?: InputMaybe<Array<SlowQueriesBoolExp>>;
  _not?: InputMaybe<SlowQueriesBoolExp>;
  _or?: InputMaybe<Array<SlowQueriesBoolExp>>;
  applicationName?: InputMaybe<StringComparisonExp>;
  clientAddr?: InputMaybe<InetComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  query?: InputMaybe<StringComparisonExp>;
  queryDuration?: InputMaybe<IntervalComparisonExp>;
  queryStart?: InputMaybe<TimestamptzComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "audit.slow_queries" */
export enum SlowQueriesConstraint {
  /** unique or primary key constraint on columns "id" */
  slow_queries_pkey = 'slow_queries_pkey'
}

/** input type for inserting data into table "audit.slow_queries" */
export type SlowQueriesInsertInput = {
  applicationName?: InputMaybe<Scalars['String']['input']>;
  clientAddr?: InputMaybe<Scalars['inet']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryDuration?: InputMaybe<Scalars['interval']['input']>;
  queryStart?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type SlowQueriesMaxFields = {
  __typename?: 'slowQueriesMaxFields';
  applicationName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  query?: Maybe<Scalars['String']['output']>;
  queryStart?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type SlowQueriesMinFields = {
  __typename?: 'slowQueriesMinFields';
  applicationName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  query?: Maybe<Scalars['String']['output']>;
  queryStart?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "audit.slow_queries" */
export type SlowQueriesMutationResponse = {
  __typename?: 'slowQueriesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<SlowQueries>;
};

/** on_conflict condition type for table "audit.slow_queries" */
export type SlowQueriesOnConflict = {
  constraint: SlowQueriesConstraint;
  updateColumns?: Array<SlowQueriesUpdateColumn>;
  where?: InputMaybe<SlowQueriesBoolExp>;
};

/** Ordering options when selecting data from "audit.slow_queries". */
export type SlowQueriesOrderBy = {
  applicationName?: InputMaybe<OrderBy>;
  clientAddr?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  query?: InputMaybe<OrderBy>;
  queryDuration?: InputMaybe<OrderBy>;
  queryStart?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: audit.slow_queries */
export type SlowQueriesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "audit.slow_queries" */
export enum SlowQueriesSelectColumn {
  /** column name */
  applicationName = 'applicationName',
  /** column name */
  clientAddr = 'clientAddr',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  query = 'query',
  /** column name */
  queryDuration = 'queryDuration',
  /** column name */
  queryStart = 'queryStart',
  /** column name */
  userId = 'userId'
}

/** input type for updating data in table "audit.slow_queries" */
export type SlowQueriesSetInput = {
  applicationName?: InputMaybe<Scalars['String']['input']>;
  clientAddr?: InputMaybe<Scalars['inet']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryDuration?: InputMaybe<Scalars['interval']['input']>;
  queryStart?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "slowQueries" */
export type SlowQueriesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: SlowQueriesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type SlowQueriesStreamCursorValueInput = {
  applicationName?: InputMaybe<Scalars['String']['input']>;
  clientAddr?: InputMaybe<Scalars['inet']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryDuration?: InputMaybe<Scalars['interval']['input']>;
  queryStart?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "audit.slow_queries" */
export enum SlowQueriesUpdateColumn {
  /** column name */
  applicationName = 'applicationName',
  /** column name */
  clientAddr = 'clientAddr',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  query = 'query',
  /** column name */
  queryDuration = 'queryDuration',
  /** column name */
  queryStart = 'queryStart',
  /** column name */
  userId = 'userId'
}

export type SlowQueriesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<SlowQueriesSetInput>;
  /** filter the rows which have to be updated */
  where: SlowQueriesBoolExp;
};

export type SubscriptionRoot = {
  __typename?: 'subscription_root';
  /** execute function "activate_payroll_versions" which returns "payroll_activation_results" */
  activatePayrollVersions: Array<PayrollActivationResults>;
  /** execute function "activate_payroll_versions" and query aggregates on result of table type "payroll_activation_results" */
  activatePayrollVersionsAggregate: PayrollActivationResultsAggregate;
  /** fetch data from the table: "adjustment_rules" using primary key columns */
  adjustmentRuleById?: Maybe<AdjustmentRules>;
  /** An array relationship */
  adjustmentRules: Array<AdjustmentRules>;
  /** An aggregate relationship */
  adjustmentRulesAggregate: AdjustmentRulesAggregate;
  /** fetch data from the table in a streaming manner: "adjustment_rules" */
  adjustmentRulesStream: Array<AdjustmentRules>;
  /** fetch data from the table: "app_settings" using primary key columns */
  appSettingById?: Maybe<AppSettings>;
  /** fetch data from the table: "app_settings" */
  appSettings: Array<AppSettings>;
  /** fetch aggregated fields from the table: "app_settings" */
  appSettingsAggregate: AppSettingsAggregate;
  /** fetch data from the table in a streaming manner: "app_settings" */
  appSettingsStream: Array<AppSettings>;
  /** fetch data from the table: "audit.audit_log" using primary key columns */
  auditLogById?: Maybe<AuditLogs>;
  /** fetch data from the table: "audit.audit_log" */
  auditLogs: Array<AuditLogs>;
  /** fetch aggregated fields from the table: "audit.audit_log" */
  auditLogsAggregate: AuditLogsAggregate;
  /** fetch data from the table in a streaming manner: "audit.audit_log" */
  auditLogsStream: Array<AuditLogs>;
  /** fetch data from the table: "audit.auth_events" using primary key columns */
  authEventById?: Maybe<AuthEvents>;
  /** fetch data from the table: "audit.auth_events" */
  authEvents: Array<AuthEvents>;
  /** fetch aggregated fields from the table: "audit.auth_events" */
  authEventsAggregate: AuthEventsAggregate;
  /** fetch data from the table in a streaming manner: "audit.auth_events" */
  authEventsStream: Array<AuthEvents>;
  /** fetch data from the table in a streaming manner: "neon_auth.users_sync" */
  authUsersSyncStream: Array<AuthUsersSync>;
  /** fetch data from the table: "billing_event_log" using primary key columns */
  billingEventLogById?: Maybe<BillingEventLogs>;
  /** An array relationship */
  billingEventLogs: Array<BillingEventLogs>;
  /** An aggregate relationship */
  billingEventLogsAggregate: BillingEventLogsAggregate;
  /** fetch data from the table in a streaming manner: "billing_event_log" */
  billingEventLogsStream: Array<BillingEventLogs>;
  /** fetch data from the table: "billing_invoice" */
  billingInvoice: Array<BillingInvoice>;
  /** fetch aggregated fields from the table: "billing_invoice" */
  billingInvoiceAggregate: BillingInvoiceAggregate;
  /** fetch data from the table: "billing_invoice" using primary key columns */
  billingInvoiceById?: Maybe<BillingInvoice>;
  /** fetch data from the table in a streaming manner: "billing_invoice" */
  billingInvoiceStream: Array<BillingInvoice>;
  /** fetch data from the table: "billing_items" using primary key columns */
  billingItemById?: Maybe<BillingItems>;
  /** An array relationship */
  billingItems: Array<BillingItems>;
  /** An aggregate relationship */
  billingItemsAggregate: BillingItemsAggregate;
  /** fetch data from the table in a streaming manner: "billing_items" */
  billingItemsStream: Array<BillingItems>;
  /** fetch data from the table: "billing_plan" using primary key columns */
  billingPlanById?: Maybe<BillingPlans>;
  /** fetch data from the table: "billing_plan" */
  billingPlans: Array<BillingPlans>;
  /** fetch aggregated fields from the table: "billing_plan" */
  billingPlansAggregate: BillingPlansAggregate;
  /** fetch data from the table in a streaming manner: "billing_plan" */
  billingPlansStream: Array<BillingPlans>;
  /** fetch data from the table: "client_billing_assignment" using primary key columns */
  clientBillingAssignmentById?: Maybe<ClientBillingAssignments>;
  /** An array relationship */
  clientBillingAssignments: Array<ClientBillingAssignments>;
  /** An aggregate relationship */
  clientBillingAssignmentsAggregate: ClientBillingAssignmentsAggregate;
  /** fetch data from the table in a streaming manner: "client_billing_assignment" */
  clientBillingAssignmentsStream: Array<ClientBillingAssignments>;
  /** fetch data from the table: "clients" using primary key columns */
  clientById?: Maybe<Clients>;
  /** fetch data from the table: "client_external_systems" using primary key columns */
  clientExternalSystemById?: Maybe<ClientExternalSystems>;
  /** An array relationship */
  clientExternalSystems: Array<ClientExternalSystems>;
  /** An aggregate relationship */
  clientExternalSystemsAggregate: ClientExternalSystemsAggregate;
  /** fetch data from the table in a streaming manner: "client_external_systems" */
  clientExternalSystemsStream: Array<ClientExternalSystems>;
  /** fetch data from the table: "clients" */
  clients: Array<Clients>;
  /** fetch aggregated fields from the table: "clients" */
  clientsAggregate: ClientsAggregate;
  /** fetch data from the table in a streaming manner: "clients" */
  clientsStream: Array<Clients>;
  /** execute function "create_payroll_version" which returns "payroll_version_results" */
  createPayrollVersion: Array<PayrollVersionResults>;
  /** execute function "create_payroll_version" and query aggregates on result of table type "payroll_version_results" */
  createPayrollVersionAggregate: PayrollVersionResultsAggregate;
  /** execute function "create_payroll_version_simple" which returns "payroll_version_results" */
  createPayrollVersionSimple: Array<PayrollVersionResults>;
  /** execute function "create_payroll_version_simple" and query aggregates on result of table type "payroll_version_results" */
  createPayrollVersionSimpleAggregate: PayrollVersionResultsAggregate;
  /** fetch data from the table: "current_payrolls" */
  currentPayrolls: Array<CurrentPayrolls>;
  /** fetch aggregated fields from the table: "current_payrolls" */
  currentPayrollsAggregate: CurrentPayrollsAggregate;
  /** fetch data from the table in a streaming manner: "current_payrolls" */
  currentPayrollsStream: Array<CurrentPayrolls>;
  /** fetch data from the table: "audit.data_access_log" using primary key columns */
  dataAccessLogById?: Maybe<DataAccessLogs>;
  /** fetch data from the table: "audit.data_access_log" */
  dataAccessLogs: Array<DataAccessLogs>;
  /** fetch aggregated fields from the table: "audit.data_access_log" */
  dataAccessLogsAggregate: DataAccessLogsAggregate;
  /** fetch data from the table in a streaming manner: "audit.data_access_log" */
  dataAccessLogsStream: Array<DataAccessLogs>;
  /** fetch data from the table: "external_systems" using primary key columns */
  externalSystemById?: Maybe<ExternalSystems>;
  /** fetch data from the table: "external_systems" */
  externalSystems: Array<ExternalSystems>;
  /** fetch aggregated fields from the table: "external_systems" */
  externalSystemsAggregate: ExternalSystemsAggregate;
  /** fetch data from the table in a streaming manner: "external_systems" */
  externalSystemsStream: Array<ExternalSystems>;
  /** fetch data from the table: "feature_flags" using primary key columns */
  featureFlagById?: Maybe<FeatureFlags>;
  /** fetch data from the table: "feature_flags" */
  featureFlags: Array<FeatureFlags>;
  /** fetch aggregated fields from the table: "feature_flags" */
  featureFlagsAggregate: FeatureFlagsAggregate;
  /** fetch data from the table in a streaming manner: "feature_flags" */
  featureFlagsStream: Array<FeatureFlags>;
  /** execute function "generate_payroll_dates" which returns "payroll_dates" */
  generatePayrollDates: Array<PayrollDates>;
  /** execute function "generate_payroll_dates" and query aggregates on result of table type "payroll_dates" */
  generatePayrollDatesAggregate: PayrollDatesAggregate;
  /** execute function "get_latest_payroll_version" which returns "latest_payroll_version_results" */
  getLatestPayrollVersion: Array<LatestPayrollVersionResults>;
  /** execute function "get_latest_payroll_version" and query aggregates on result of table type "latest_payroll_version_results" */
  getLatestPayrollVersionAggregate: LatestPayrollVersionResultsAggregate;
  /** execute function "get_payroll_version_history" which returns "payroll_version_history_results" */
  getPayrollVersionHistory: Array<PayrollVersionHistoryResults>;
  /** execute function "get_payroll_version_history" and query aggregates on result of table type "payroll_version_history_results" */
  getPayrollVersionHistoryAggregate: PayrollVersionHistoryResultsAggregate;
  /** fetch data from the table: "holidays" using primary key columns */
  holidayById?: Maybe<Holidays>;
  /** fetch data from the table: "holidays" */
  holidays: Array<Holidays>;
  /** fetch aggregated fields from the table: "holidays" */
  holidaysAggregate: HolidaysAggregate;
  /** fetch data from the table in a streaming manner: "holidays" */
  holidaysStream: Array<Holidays>;
  /** fetch data from the table: "latest_payroll_version_results" using primary key columns */
  latestPayrollVersionResultById?: Maybe<LatestPayrollVersionResults>;
  /** fetch data from the table: "latest_payroll_version_results" */
  latestPayrollVersionResults: Array<LatestPayrollVersionResults>;
  /** fetch aggregated fields from the table: "latest_payroll_version_results" */
  latestPayrollVersionResultsAggregate: LatestPayrollVersionResultsAggregate;
  /** fetch data from the table in a streaming manner: "latest_payroll_version_results" */
  latestPayrollVersionResultsStream: Array<LatestPayrollVersionResults>;
  /** fetch data from the table: "leave" */
  leave: Array<Leave>;
  /** fetch aggregated fields from the table: "leave" */
  leaveAggregate: LeaveAggregate;
  /** fetch data from the table: "leave" using primary key columns */
  leaveById?: Maybe<Leave>;
  /** fetch data from the table in a streaming manner: "leave" */
  leaveStream: Array<Leave>;
  /** fetch data from the table: "notes" using primary key columns */
  noteById?: Maybe<Notes>;
  /** fetch data from the table: "notes" */
  notes: Array<Notes>;
  /** fetch aggregated fields from the table: "notes" */
  notesAggregate: NotesAggregate;
  /** fetch data from the table in a streaming manner: "notes" */
  notesStream: Array<Notes>;
  /** fetch data from the table: "payroll_activation_results" using primary key columns */
  payrollActivationResultById?: Maybe<PayrollActivationResults>;
  /** fetch data from the table: "payroll_activation_results" */
  payrollActivationResults: Array<PayrollActivationResults>;
  /** fetch aggregated fields from the table: "payroll_activation_results" */
  payrollActivationResultsAggregate: PayrollActivationResultsAggregate;
  /** fetch data from the table in a streaming manner: "payroll_activation_results" */
  payrollActivationResultsStream: Array<PayrollActivationResults>;
  /** fetch data from the table: "payroll_assignment_audit" using primary key columns */
  payrollAssignmentAuditById?: Maybe<PayrollAssignmentAudits>;
  /** An array relationship */
  payrollAssignmentAudits: Array<PayrollAssignmentAudits>;
  /** An aggregate relationship */
  payrollAssignmentAuditsAggregate: PayrollAssignmentAuditsAggregate;
  /** fetch data from the table in a streaming manner: "payroll_assignment_audit" */
  payrollAssignmentAuditsStream: Array<PayrollAssignmentAudits>;
  /** fetch data from the table: "payroll_assignments" using primary key columns */
  payrollAssignmentById?: Maybe<PayrollAssignments>;
  /** fetch data from the table: "payroll_assignments" */
  payrollAssignments: Array<PayrollAssignments>;
  /** fetch aggregated fields from the table: "payroll_assignments" */
  payrollAssignmentsAggregate: PayrollAssignmentsAggregate;
  /** fetch data from the table in a streaming manner: "payroll_assignments" */
  payrollAssignmentsStream: Array<PayrollAssignments>;
  /** fetch data from the table: "payrolls" using primary key columns */
  payrollById?: Maybe<Payrolls>;
  /** fetch data from the table: "payroll_cycles" using primary key columns */
  payrollCycleById?: Maybe<PayrollCycles>;
  /** fetch data from the table: "payroll_cycles" */
  payrollCycles: Array<PayrollCycles>;
  /** fetch aggregated fields from the table: "payroll_cycles" */
  payrollCyclesAggregate: PayrollCyclesAggregate;
  /** fetch data from the table in a streaming manner: "payroll_cycles" */
  payrollCyclesStream: Array<PayrollCycles>;
  /** fetch data from the table: "payroll_dashboard_stats" */
  payrollDashboardStats: Array<PayrollDashboardStats>;
  /** fetch aggregated fields from the table: "payroll_dashboard_stats" */
  payrollDashboardStatsAggregate: PayrollDashboardStatsAggregate;
  /** fetch data from the table in a streaming manner: "payroll_dashboard_stats" */
  payrollDashboardStatsStream: Array<PayrollDashboardStats>;
  /** fetch data from the table: "payroll_dates" using primary key columns */
  payrollDateById?: Maybe<PayrollDates>;
  /** fetch data from the table: "payroll_date_types" using primary key columns */
  payrollDateTypeById?: Maybe<PayrollDateTypes>;
  /** fetch data from the table: "payroll_date_types" */
  payrollDateTypes: Array<PayrollDateTypes>;
  /** fetch aggregated fields from the table: "payroll_date_types" */
  payrollDateTypesAggregate: PayrollDateTypesAggregate;
  /** fetch data from the table in a streaming manner: "payroll_date_types" */
  payrollDateTypesStream: Array<PayrollDateTypes>;
  /** An array relationship */
  payrollDates: Array<PayrollDates>;
  /** An aggregate relationship */
  payrollDatesAggregate: PayrollDatesAggregate;
  /** fetch data from the table in a streaming manner: "payroll_dates" */
  payrollDatesStream: Array<PayrollDates>;
  /** fetch data from the table: "payroll_triggers_status" */
  payrollTriggersStatus: Array<PayrollTriggersStatus>;
  /** fetch aggregated fields from the table: "payroll_triggers_status" */
  payrollTriggersStatusAggregate: PayrollTriggersStatusAggregate;
  /** fetch data from the table in a streaming manner: "payroll_triggers_status" */
  payrollTriggersStatusStream: Array<PayrollTriggersStatus>;
  /** fetch data from the table: "payroll_version_history_results" using primary key columns */
  payrollVersionHistoryResultById?: Maybe<PayrollVersionHistoryResults>;
  /** fetch data from the table: "payroll_version_history_results" */
  payrollVersionHistoryResults: Array<PayrollVersionHistoryResults>;
  /** fetch aggregated fields from the table: "payroll_version_history_results" */
  payrollVersionHistoryResultsAggregate: PayrollVersionHistoryResultsAggregate;
  /** fetch data from the table in a streaming manner: "payroll_version_history_results" */
  payrollVersionHistoryResultsStream: Array<PayrollVersionHistoryResults>;
  /** fetch data from the table: "payroll_version_results" using primary key columns */
  payrollVersionResultById?: Maybe<PayrollVersionResults>;
  /** fetch data from the table: "payroll_version_results" */
  payrollVersionResults: Array<PayrollVersionResults>;
  /** fetch aggregated fields from the table: "payroll_version_results" */
  payrollVersionResultsAggregate: PayrollVersionResultsAggregate;
  /** fetch data from the table in a streaming manner: "payroll_version_results" */
  payrollVersionResultsStream: Array<PayrollVersionResults>;
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrollsAggregate: PayrollsAggregate;
  /** fetch data from the table in a streaming manner: "payrolls" */
  payrollsStream: Array<Payrolls>;
  /** fetch data from the table: "permission_audit_log" using primary key columns */
  permissionAuditLogById?: Maybe<PermissionAuditLogs>;
  /** fetch data from the table: "permission_audit_log" */
  permissionAuditLogs: Array<PermissionAuditLogs>;
  /** fetch aggregated fields from the table: "permission_audit_log" */
  permissionAuditLogsAggregate: PermissionAuditLogsAggregate;
  /** fetch data from the table in a streaming manner: "permission_audit_log" */
  permissionAuditLogsStream: Array<PermissionAuditLogs>;
  /** fetch data from the table: "permissions" using primary key columns */
  permissionById?: Maybe<Permissions>;
  /** fetch data from the table: "audit.permission_changes" using primary key columns */
  permissionChangeById?: Maybe<PermissionChanges>;
  /** fetch data from the table: "audit.permission_changes" */
  permissionChanges: Array<PermissionChanges>;
  /** fetch aggregated fields from the table: "audit.permission_changes" */
  permissionChangesAggregate: PermissionChangesAggregate;
  /** fetch data from the table in a streaming manner: "audit.permission_changes" */
  permissionChangesStream: Array<PermissionChanges>;
  /** fetch data from the table: "permission_overrides" using primary key columns */
  permissionOverrideById?: Maybe<PermissionOverrides>;
  /** fetch data from the table: "permission_overrides" */
  permissionOverrides: Array<PermissionOverrides>;
  /** fetch aggregated fields from the table: "permission_overrides" */
  permissionOverridesAggregate: PermissionOverridesAggregate;
  /** fetch data from the table in a streaming manner: "permission_overrides" */
  permissionOverridesStream: Array<PermissionOverrides>;
  /** fetch data from the table: "audit.permission_usage_report" */
  permissionUsageReports: Array<PermissionUsageReports>;
  /** fetch aggregated fields from the table: "audit.permission_usage_report" */
  permissionUsageReportsAggregate: PermissionUsageReportsAggregate;
  /** fetch data from the table in a streaming manner: "audit.permission_usage_report" */
  permissionUsageReportsStream: Array<PermissionUsageReports>;
  /** fetch data from the table: "permissions" */
  permissions: Array<Permissions>;
  /** fetch aggregated fields from the table: "permissions" */
  permissionsAggregate: PermissionsAggregate;
  /** fetch data from the table in a streaming manner: "permissions" */
  permissionsStream: Array<Permissions>;
  /** fetch data from the table: "resources" using primary key columns */
  resourceById?: Maybe<Resources>;
  /** fetch data from the table: "resources" */
  resources: Array<Resources>;
  /** fetch aggregated fields from the table: "resources" */
  resourcesAggregate: ResourcesAggregate;
  /** fetch data from the table in a streaming manner: "resources" */
  resourcesStream: Array<Resources>;
  /** fetch data from the table: "roles" using primary key columns */
  roleById?: Maybe<Roles>;
  /** fetch data from the table: "role_permissions" using primary key columns */
  rolePermissionById?: Maybe<RolePermissions>;
  /** fetch data from the table: "role_permissions" */
  rolePermissions: Array<RolePermissions>;
  /** fetch aggregated fields from the table: "role_permissions" */
  rolePermissionsAggregate: RolePermissionsAggregate;
  /** fetch data from the table in a streaming manner: "role_permissions" */
  rolePermissionsStream: Array<RolePermissions>;
  /** fetch data from the table: "roles" */
  roles: Array<Roles>;
  /** fetch aggregated fields from the table: "roles" */
  rolesAggregate: RolesAggregate;
  /** fetch data from the table in a streaming manner: "roles" */
  rolesStream: Array<Roles>;
  /** fetch data from the table: "audit.slow_queries" */
  slowQueries: Array<SlowQueries>;
  /** fetch aggregated fields from the table: "audit.slow_queries" */
  slowQueriesAggregate: SlowQueriesAggregate;
  /** fetch data from the table in a streaming manner: "audit.slow_queries" */
  slowQueriesStream: Array<SlowQueries>;
  /** fetch data from the table: "audit.slow_queries" using primary key columns */
  slowQueryById?: Maybe<SlowQueries>;
  /** fetch data from the table: "audit.user_access_summary" */
  userAccessSummaries: Array<UserAccessSummaries>;
  /** fetch aggregated fields from the table: "audit.user_access_summary" */
  userAccessSummariesAggregate: UserAccessSummariesAggregate;
  /** fetch data from the table in a streaming manner: "audit.user_access_summary" */
  userAccessSummariesStream: Array<UserAccessSummaries>;
  /** fetch data from the table: "users" using primary key columns */
  userById?: Maybe<Users>;
  /** fetch data from the table: "user_invitations" using primary key columns */
  userInvitationById?: Maybe<UserInvitations>;
  /** fetch data from the table: "user_invitations" */
  userInvitations: Array<UserInvitations>;
  /** fetch aggregated fields from the table: "user_invitations" */
  userInvitationsAggregate: UserInvitationsAggregate;
  /** fetch data from the table in a streaming manner: "user_invitations" */
  userInvitationsStream: Array<UserInvitations>;
  /** fetch data from the table: "user_roles" using primary key columns */
  userRoleById?: Maybe<UserRoles>;
  /** fetch data from the table: "user_roles" */
  userRoles: Array<UserRoles>;
  /** fetch aggregated fields from the table: "user_roles" */
  userRolesAggregate: UserRolesAggregate;
  /** fetch data from the table in a streaming manner: "user_roles" */
  userRolesStream: Array<UserRoles>;
  /** fetch data from the table: "neon_auth.users_sync" using primary key columns */
  userSyncById?: Maybe<AuthUsersSync>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  usersAggregate: UsersAggregate;
  /** fetch data from the table in a streaming manner: "users_role_backup" */
  usersRoleBackupStream: Array<UsersRoleBackup>;
  /** fetch data from the table: "users_role_backup" */
  usersRoleBackups: Array<UsersRoleBackup>;
  /** fetch aggregated fields from the table: "users_role_backup" */
  usersRoleBackupsAggregate: UsersRoleBackupAggregate;
  /** fetch data from the table in a streaming manner: "users" */
  usersStream: Array<Users>;
  /** fetch data from the table: "neon_auth.users_sync" */
  usersSync: Array<AuthUsersSync>;
  /** fetch aggregated fields from the table: "neon_auth.users_sync" */
  usersSyncAggregate: AuthUsersSyncAggregate;
  /** fetch data from the table: "work_schedule" using primary key columns */
  workScheduleById?: Maybe<WorkSchedules>;
  /** fetch data from the table: "work_schedule" */
  workSchedules: Array<WorkSchedules>;
  /** fetch aggregated fields from the table: "work_schedule" */
  workSchedulesAggregate: WorkSchedulesAggregate;
  /** fetch data from the table in a streaming manner: "work_schedule" */
  workSchedulesStream: Array<WorkSchedules>;
};


export type SubscriptionRootActivatePayrollVersionsArgs = {
  distinctOn?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type SubscriptionRootActivatePayrollVersionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type SubscriptionRootAdjustmentRuleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootAdjustmentRulesArgs = {
  distinctOn?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


export type SubscriptionRootAdjustmentRulesAggregateArgs = {
  distinctOn?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


export type SubscriptionRootAdjustmentRulesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AdjustmentRulesStreamCursorInput>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


export type SubscriptionRootAppSettingByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionRootAppSettingsArgs = {
  distinctOn?: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AppSettingsOrderBy>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};


export type SubscriptionRootAppSettingsAggregateArgs = {
  distinctOn?: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AppSettingsOrderBy>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};


export type SubscriptionRootAppSettingsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AppSettingsStreamCursorInput>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};


export type SubscriptionRootAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootAuditLogsArgs = {
  distinctOn?: InputMaybe<Array<AuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuditLogsOrderBy>>;
  where?: InputMaybe<AuditLogsBoolExp>;
};


export type SubscriptionRootAuditLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<AuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuditLogsOrderBy>>;
  where?: InputMaybe<AuditLogsBoolExp>;
};


export type SubscriptionRootAuditLogsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuditLogsStreamCursorInput>>;
  where?: InputMaybe<AuditLogsBoolExp>;
};


export type SubscriptionRootAuthEventByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootAuthEventsArgs = {
  distinctOn?: InputMaybe<Array<AuthEventsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuthEventsOrderBy>>;
  where?: InputMaybe<AuthEventsBoolExp>;
};


export type SubscriptionRootAuthEventsAggregateArgs = {
  distinctOn?: InputMaybe<Array<AuthEventsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuthEventsOrderBy>>;
  where?: InputMaybe<AuthEventsBoolExp>;
};


export type SubscriptionRootAuthEventsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuthEventsStreamCursorInput>>;
  where?: InputMaybe<AuthEventsBoolExp>;
};


export type SubscriptionRootAuthUsersSyncStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuthUsersSyncStreamCursorInput>>;
  where?: InputMaybe<AuthUsersSyncBoolExp>;
};


export type SubscriptionRootBillingEventLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBillingEventLogsArgs = {
  distinctOn?: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where?: InputMaybe<BillingEventLogsBoolExp>;
};


export type SubscriptionRootBillingEventLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where?: InputMaybe<BillingEventLogsBoolExp>;
};


export type SubscriptionRootBillingEventLogsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingEventLogsStreamCursorInput>>;
  where?: InputMaybe<BillingEventLogsBoolExp>;
};


export type SubscriptionRootBillingInvoiceArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


export type SubscriptionRootBillingInvoiceAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


export type SubscriptionRootBillingInvoiceByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBillingInvoiceStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingInvoiceStreamCursorInput>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


export type SubscriptionRootBillingItemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBillingItemsArgs = {
  distinctOn?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


export type SubscriptionRootBillingItemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


export type SubscriptionRootBillingItemsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingItemsStreamCursorInput>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


export type SubscriptionRootBillingPlanByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBillingPlansArgs = {
  distinctOn?: InputMaybe<Array<BillingPlansSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingPlansOrderBy>>;
  where?: InputMaybe<BillingPlansBoolExp>;
};


export type SubscriptionRootBillingPlansAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingPlansSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingPlansOrderBy>>;
  where?: InputMaybe<BillingPlansBoolExp>;
};


export type SubscriptionRootBillingPlansStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingPlansStreamCursorInput>>;
  where?: InputMaybe<BillingPlansBoolExp>;
};


export type SubscriptionRootClientBillingAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootClientBillingAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


export type SubscriptionRootClientBillingAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


export type SubscriptionRootClientBillingAssignmentsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ClientBillingAssignmentsStreamCursorInput>>;
  where?: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


export type SubscriptionRootClientByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootClientExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootClientExternalSystemsArgs = {
  distinctOn?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type SubscriptionRootClientExternalSystemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type SubscriptionRootClientExternalSystemsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ClientExternalSystemsStreamCursorInput>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type SubscriptionRootClientsArgs = {
  distinctOn?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};


export type SubscriptionRootClientsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};


export type SubscriptionRootClientsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ClientsStreamCursorInput>>;
  where?: InputMaybe<ClientsBoolExp>;
};


export type SubscriptionRootCreatePayrollVersionArgs = {
  args: CreatePayrollVersionArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootCreatePayrollVersionAggregateArgs = {
  args: CreatePayrollVersionArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootCreatePayrollVersionSimpleArgs = {
  args: CreatePayrollVersionSimpleArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootCreatePayrollVersionSimpleAggregateArgs = {
  args: CreatePayrollVersionSimpleArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootCurrentPayrollsArgs = {
  distinctOn?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};


export type SubscriptionRootCurrentPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};


export type SubscriptionRootCurrentPayrollsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<CurrentPayrollsStreamCursorInput>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};


export type SubscriptionRootDataAccessLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootDataAccessLogsArgs = {
  distinctOn?: InputMaybe<Array<DataAccessLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DataAccessLogsOrderBy>>;
  where?: InputMaybe<DataAccessLogsBoolExp>;
};


export type SubscriptionRootDataAccessLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<DataAccessLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DataAccessLogsOrderBy>>;
  where?: InputMaybe<DataAccessLogsBoolExp>;
};


export type SubscriptionRootDataAccessLogsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<DataAccessLogsStreamCursorInput>>;
  where?: InputMaybe<DataAccessLogsBoolExp>;
};


export type SubscriptionRootExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootExternalSystemsArgs = {
  distinctOn?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};


export type SubscriptionRootExternalSystemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};


export type SubscriptionRootExternalSystemsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ExternalSystemsStreamCursorInput>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};


export type SubscriptionRootFeatureFlagByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootFeatureFlagsArgs = {
  distinctOn?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};


export type SubscriptionRootFeatureFlagsAggregateArgs = {
  distinctOn?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};


export type SubscriptionRootFeatureFlagsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<FeatureFlagsStreamCursorInput>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};


export type SubscriptionRootGeneratePayrollDatesArgs = {
  args: GeneratePayrollDatesArgs;
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type SubscriptionRootGeneratePayrollDatesAggregateArgs = {
  args: GeneratePayrollDatesArgs;
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type SubscriptionRootGetLatestPayrollVersionArgs = {
  args: GetLatestPayrollVersionArgs;
  distinctOn?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type SubscriptionRootGetLatestPayrollVersionAggregateArgs = {
  args: GetLatestPayrollVersionArgs;
  distinctOn?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type SubscriptionRootGetPayrollVersionHistoryArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type SubscriptionRootGetPayrollVersionHistoryAggregateArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type SubscriptionRootHolidayByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootHolidaysArgs = {
  distinctOn?: InputMaybe<Array<HolidaysSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<HolidaysOrderBy>>;
  where?: InputMaybe<HolidaysBoolExp>;
};


export type SubscriptionRootHolidaysAggregateArgs = {
  distinctOn?: InputMaybe<Array<HolidaysSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<HolidaysOrderBy>>;
  where?: InputMaybe<HolidaysBoolExp>;
};


export type SubscriptionRootHolidaysStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<HolidaysStreamCursorInput>>;
  where?: InputMaybe<HolidaysBoolExp>;
};


export type SubscriptionRootLatestPayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootLatestPayrollVersionResultsArgs = {
  distinctOn?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type SubscriptionRootLatestPayrollVersionResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type SubscriptionRootLatestPayrollVersionResultsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<LatestPayrollVersionResultsStreamCursorInput>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type SubscriptionRootLeaveArgs = {
  distinctOn?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};


export type SubscriptionRootLeaveAggregateArgs = {
  distinctOn?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};


export type SubscriptionRootLeaveByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootLeaveStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<LeaveStreamCursorInput>>;
  where?: InputMaybe<LeaveBoolExp>;
};


export type SubscriptionRootNoteByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootNotesArgs = {
  distinctOn?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};


export type SubscriptionRootNotesAggregateArgs = {
  distinctOn?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};


export type SubscriptionRootNotesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<NotesStreamCursorInput>>;
  where?: InputMaybe<NotesBoolExp>;
};


export type SubscriptionRootPayrollActivationResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollActivationResultsArgs = {
  distinctOn?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type SubscriptionRootPayrollActivationResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type SubscriptionRootPayrollActivationResultsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollActivationResultsStreamCursorInput>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type SubscriptionRootPayrollAssignmentAuditByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollAssignmentAuditsArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


export type SubscriptionRootPayrollAssignmentAuditsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


export type SubscriptionRootPayrollAssignmentAuditsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollAssignmentAuditsStreamCursorInput>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


export type SubscriptionRootPayrollAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type SubscriptionRootPayrollAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type SubscriptionRootPayrollAssignmentsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollAssignmentsStreamCursorInput>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type SubscriptionRootPayrollByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollCycleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollCyclesArgs = {
  distinctOn?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};


export type SubscriptionRootPayrollCyclesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};


export type SubscriptionRootPayrollCyclesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollCyclesStreamCursorInput>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};


export type SubscriptionRootPayrollDashboardStatsArgs = {
  distinctOn?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type SubscriptionRootPayrollDashboardStatsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type SubscriptionRootPayrollDashboardStatsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollDashboardStatsStreamCursorInput>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type SubscriptionRootPayrollDateByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollDateTypeByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollDateTypesArgs = {
  distinctOn?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};


export type SubscriptionRootPayrollDateTypesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};


export type SubscriptionRootPayrollDateTypesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollDateTypesStreamCursorInput>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};


export type SubscriptionRootPayrollDatesArgs = {
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type SubscriptionRootPayrollDatesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type SubscriptionRootPayrollDatesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollDatesStreamCursorInput>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type SubscriptionRootPayrollTriggersStatusArgs = {
  distinctOn?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type SubscriptionRootPayrollTriggersStatusAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type SubscriptionRootPayrollTriggersStatusStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollTriggersStatusStreamCursorInput>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type SubscriptionRootPayrollVersionHistoryResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollVersionHistoryResultsArgs = {
  distinctOn?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type SubscriptionRootPayrollVersionHistoryResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type SubscriptionRootPayrollVersionHistoryResultsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollVersionHistoryResultsStreamCursorInput>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type SubscriptionRootPayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollVersionResultsArgs = {
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootPayrollVersionResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootPayrollVersionResultsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollVersionResultsStreamCursorInput>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootPayrollsArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


export type SubscriptionRootPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


export type SubscriptionRootPayrollsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollsStreamCursorInput>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


export type SubscriptionRootPermissionAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPermissionAuditLogsArgs = {
  distinctOn?: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where?: InputMaybe<PermissionAuditLogsBoolExp>;
};


export type SubscriptionRootPermissionAuditLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where?: InputMaybe<PermissionAuditLogsBoolExp>;
};


export type SubscriptionRootPermissionAuditLogsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PermissionAuditLogsStreamCursorInput>>;
  where?: InputMaybe<PermissionAuditLogsBoolExp>;
};


export type SubscriptionRootPermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPermissionChangeByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPermissionChangesArgs = {
  distinctOn?: InputMaybe<Array<PermissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionChangesOrderBy>>;
  where?: InputMaybe<PermissionChangesBoolExp>;
};


export type SubscriptionRootPermissionChangesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionChangesOrderBy>>;
  where?: InputMaybe<PermissionChangesBoolExp>;
};


export type SubscriptionRootPermissionChangesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PermissionChangesStreamCursorInput>>;
  where?: InputMaybe<PermissionChangesBoolExp>;
};


export type SubscriptionRootPermissionOverrideByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPermissionOverridesArgs = {
  distinctOn?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};


export type SubscriptionRootPermissionOverridesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};


export type SubscriptionRootPermissionOverridesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PermissionOverridesStreamCursorInput>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};


export type SubscriptionRootPermissionUsageReportsArgs = {
  distinctOn?: InputMaybe<Array<PermissionUsageReportsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionUsageReportsOrderBy>>;
  where?: InputMaybe<PermissionUsageReportsBoolExp>;
};


export type SubscriptionRootPermissionUsageReportsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionUsageReportsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionUsageReportsOrderBy>>;
  where?: InputMaybe<PermissionUsageReportsBoolExp>;
};


export type SubscriptionRootPermissionUsageReportsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PermissionUsageReportsStreamCursorInput>>;
  where?: InputMaybe<PermissionUsageReportsBoolExp>;
};


export type SubscriptionRootPermissionsArgs = {
  distinctOn?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};


export type SubscriptionRootPermissionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};


export type SubscriptionRootPermissionsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PermissionsStreamCursorInput>>;
  where?: InputMaybe<PermissionsBoolExp>;
};


export type SubscriptionRootResourceByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootResourcesArgs = {
  distinctOn?: InputMaybe<Array<ResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ResourcesOrderBy>>;
  where?: InputMaybe<ResourcesBoolExp>;
};


export type SubscriptionRootResourcesAggregateArgs = {
  distinctOn?: InputMaybe<Array<ResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ResourcesOrderBy>>;
  where?: InputMaybe<ResourcesBoolExp>;
};


export type SubscriptionRootResourcesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ResourcesStreamCursorInput>>;
  where?: InputMaybe<ResourcesBoolExp>;
};


export type SubscriptionRootRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootRolePermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootRolePermissionsArgs = {
  distinctOn?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


export type SubscriptionRootRolePermissionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


export type SubscriptionRootRolePermissionsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RolePermissionsStreamCursorInput>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


export type SubscriptionRootRolesArgs = {
  distinctOn?: InputMaybe<Array<RolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolesOrderBy>>;
  where?: InputMaybe<RolesBoolExp>;
};


export type SubscriptionRootRolesAggregateArgs = {
  distinctOn?: InputMaybe<Array<RolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolesOrderBy>>;
  where?: InputMaybe<RolesBoolExp>;
};


export type SubscriptionRootRolesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RolesStreamCursorInput>>;
  where?: InputMaybe<RolesBoolExp>;
};


export type SubscriptionRootSlowQueriesArgs = {
  distinctOn?: InputMaybe<Array<SlowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SlowQueriesOrderBy>>;
  where?: InputMaybe<SlowQueriesBoolExp>;
};


export type SubscriptionRootSlowQueriesAggregateArgs = {
  distinctOn?: InputMaybe<Array<SlowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SlowQueriesOrderBy>>;
  where?: InputMaybe<SlowQueriesBoolExp>;
};


export type SubscriptionRootSlowQueriesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<SlowQueriesStreamCursorInput>>;
  where?: InputMaybe<SlowQueriesBoolExp>;
};


export type SubscriptionRootSlowQueryByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootUserAccessSummariesArgs = {
  distinctOn?: InputMaybe<Array<UserAccessSummariesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserAccessSummariesOrderBy>>;
  where?: InputMaybe<UserAccessSummariesBoolExp>;
};


export type SubscriptionRootUserAccessSummariesAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserAccessSummariesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserAccessSummariesOrderBy>>;
  where?: InputMaybe<UserAccessSummariesBoolExp>;
};


export type SubscriptionRootUserAccessSummariesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UserAccessSummariesStreamCursorInput>>;
  where?: InputMaybe<UserAccessSummariesBoolExp>;
};


export type SubscriptionRootUserByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootUserInvitationByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootUserInvitationsArgs = {
  distinctOn?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserInvitationsOrderBy>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};


export type SubscriptionRootUserInvitationsAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserInvitationsOrderBy>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};


export type SubscriptionRootUserInvitationsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UserInvitationsStreamCursorInput>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};


export type SubscriptionRootUserRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootUserRolesArgs = {
  distinctOn?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


export type SubscriptionRootUserRolesAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


export type SubscriptionRootUserRolesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UserRolesStreamCursorInput>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


export type SubscriptionRootUserSyncByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionRootUsersArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type SubscriptionRootUsersAggregateArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type SubscriptionRootUsersRoleBackupStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UsersRoleBackupStreamCursorInput>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};


export type SubscriptionRootUsersRoleBackupsArgs = {
  distinctOn?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};


export type SubscriptionRootUsersRoleBackupsAggregateArgs = {
  distinctOn?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};


export type SubscriptionRootUsersStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UsersStreamCursorInput>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type SubscriptionRootUsersSyncArgs = {
  distinctOn?: InputMaybe<Array<AuthUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuthUsersSyncOrderBy>>;
  where?: InputMaybe<AuthUsersSyncBoolExp>;
};


export type SubscriptionRootUsersSyncAggregateArgs = {
  distinctOn?: InputMaybe<Array<AuthUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuthUsersSyncOrderBy>>;
  where?: InputMaybe<AuthUsersSyncBoolExp>;
};


export type SubscriptionRootWorkScheduleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootWorkSchedulesArgs = {
  distinctOn?: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkSchedulesOrderBy>>;
  where?: InputMaybe<WorkSchedulesBoolExp>;
};


export type SubscriptionRootWorkSchedulesAggregateArgs = {
  distinctOn?: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkSchedulesOrderBy>>;
  where?: InputMaybe<WorkSchedulesBoolExp>;
};


export type SubscriptionRootWorkSchedulesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<WorkSchedulesStreamCursorInput>>;
  where?: InputMaybe<WorkSchedulesBoolExp>;
};

/** columns and relationships of "audit.user_access_summary" */
export type UserAccessSummaries = {
  __typename?: 'userAccessSummaries';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isStaff?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['user_role']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "audit.user_access_summary" */
export type UserAccessSummariesAggregate = {
  __typename?: 'userAccessSummariesAggregate';
  aggregate?: Maybe<UserAccessSummariesAggregateFields>;
  nodes: Array<UserAccessSummaries>;
};

/** aggregate fields of "audit.user_access_summary" */
export type UserAccessSummariesAggregateFields = {
  __typename?: 'userAccessSummariesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<UserAccessSummariesMaxFields>;
  min?: Maybe<UserAccessSummariesMinFields>;
};


/** aggregate fields of "audit.user_access_summary" */
export type UserAccessSummariesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<UserAccessSummariesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "audit.user_access_summary". All fields are combined with a logical 'AND'. */
export type UserAccessSummariesBoolExp = {
  _and?: InputMaybe<Array<UserAccessSummariesBoolExp>>;
  _not?: InputMaybe<UserAccessSummariesBoolExp>;
  _or?: InputMaybe<Array<UserAccessSummariesBoolExp>>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  email?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isActive?: InputMaybe<BooleanComparisonExp>;
  isStaff?: InputMaybe<BooleanComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  role?: InputMaybe<UserRoleComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** input type for inserting data into table "audit.user_access_summary" */
export type UserAccessSummariesInsertInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isStaff?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type UserAccessSummariesMaxFields = {
  __typename?: 'userAccessSummariesMaxFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['user_role']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type UserAccessSummariesMinFields = {
  __typename?: 'userAccessSummariesMinFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['user_role']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "audit.user_access_summary" */
export type UserAccessSummariesMutationResponse = {
  __typename?: 'userAccessSummariesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<UserAccessSummaries>;
};

/** Ordering options when selecting data from "audit.user_access_summary". */
export type UserAccessSummariesOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  isStaff?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  role?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** select columns of table "audit.user_access_summary" */
export enum UserAccessSummariesSelectColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  email = 'email',
  /** column name */
  id = 'id',
  /** column name */
  isActive = 'isActive',
  /** column name */
  isStaff = 'isStaff',
  /** column name */
  name = 'name',
  /** column name */
  role = 'role',
  /** column name */
  updatedAt = 'updatedAt'
}

/** input type for updating data in table "audit.user_access_summary" */
export type UserAccessSummariesSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isStaff?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "userAccessSummaries" */
export type UserAccessSummariesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: UserAccessSummariesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type UserAccessSummariesStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isStaff?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

export type UserAccessSummariesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UserAccessSummariesSetInput>;
  /** filter the rows which have to be updated */
  where: UserAccessSummariesBoolExp;
};

/** Stores invitation metadata for two-stage user invitation flow with role-based access control */
export type UserInvitations = {
  __typename?: 'userInvitations';
  acceptedAt?: Maybe<Scalars['timestamptz']['output']>;
  acceptedBy?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  acceptedByUser?: Maybe<Users>;
  clerkInvitationId?: Maybe<Scalars['String']['output']>;
  clerkTicket?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['timestamptz']['output'];
  email: Scalars['String']['output'];
  expiresAt: Scalars['timestamptz']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  invitationMetadata?: Maybe<Scalars['jsonb']['output']>;
  invitedAt: Scalars['timestamptz']['output'];
  invitedBy: Scalars['uuid']['output'];
  /** An object relationship */
  invitedByUser?: Maybe<Users>;
  invitedRole: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  managerId?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  managerUser?: Maybe<Users>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['timestamptz']['output'];
};


/** Stores invitation metadata for two-stage user invitation flow with role-based access control */
export type UserInvitationsInvitationMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "user_invitations" */
export type UserInvitationsAggregate = {
  __typename?: 'userInvitationsAggregate';
  aggregate?: Maybe<UserInvitationsAggregateFields>;
  nodes: Array<UserInvitations>;
};

/** aggregate fields of "user_invitations" */
export type UserInvitationsAggregateFields = {
  __typename?: 'userInvitationsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<UserInvitationsMaxFields>;
  min?: Maybe<UserInvitationsMinFields>;
};


/** aggregate fields of "user_invitations" */
export type UserInvitationsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type UserInvitationsAppendInput = {
  invitationMetadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "user_invitations". All fields are combined with a logical 'AND'. */
export type UserInvitationsBoolExp = {
  _and?: InputMaybe<Array<UserInvitationsBoolExp>>;
  _not?: InputMaybe<UserInvitationsBoolExp>;
  _or?: InputMaybe<Array<UserInvitationsBoolExp>>;
  acceptedAt?: InputMaybe<TimestamptzComparisonExp>;
  acceptedBy?: InputMaybe<UuidComparisonExp>;
  acceptedByUser?: InputMaybe<UsersBoolExp>;
  clerkInvitationId?: InputMaybe<StringComparisonExp>;
  clerkTicket?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  email?: InputMaybe<StringComparisonExp>;
  expiresAt?: InputMaybe<TimestamptzComparisonExp>;
  firstName?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  invitationMetadata?: InputMaybe<JsonbComparisonExp>;
  invitedAt?: InputMaybe<TimestamptzComparisonExp>;
  invitedBy?: InputMaybe<UuidComparisonExp>;
  invitedByUser?: InputMaybe<UsersBoolExp>;
  invitedRole?: InputMaybe<StringComparisonExp>;
  lastName?: InputMaybe<StringComparisonExp>;
  managerId?: InputMaybe<UuidComparisonExp>;
  managerUser?: InputMaybe<UsersBoolExp>;
  status?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "user_invitations" */
export enum UserInvitationsConstraint {
  /** unique or primary key constraint on columns "id" */
  user_invitations_pkey = 'user_invitations_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type UserInvitationsDeleteAtPathInput = {
  invitationMetadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type UserInvitationsDeleteElemInput = {
  invitationMetadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type UserInvitationsDeleteKeyInput = {
  invitationMetadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "user_invitations" */
export type UserInvitationsInsertInput = {
  acceptedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  acceptedBy?: InputMaybe<Scalars['uuid']['input']>;
  acceptedByUser?: InputMaybe<UsersObjRelInsertInput>;
  clerkInvitationId?: InputMaybe<Scalars['String']['input']>;
  clerkTicket?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invitationMetadata?: InputMaybe<Scalars['jsonb']['input']>;
  invitedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  invitedBy?: InputMaybe<Scalars['uuid']['input']>;
  invitedByUser?: InputMaybe<UsersObjRelInsertInput>;
  invitedRole?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  managerId?: InputMaybe<Scalars['uuid']['input']>;
  managerUser?: InputMaybe<UsersObjRelInsertInput>;
  status?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type UserInvitationsMaxFields = {
  __typename?: 'userInvitationsMaxFields';
  acceptedAt?: Maybe<Scalars['timestamptz']['output']>;
  acceptedBy?: Maybe<Scalars['uuid']['output']>;
  clerkInvitationId?: Maybe<Scalars['String']['output']>;
  clerkTicket?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['timestamptz']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  invitedAt?: Maybe<Scalars['timestamptz']['output']>;
  invitedBy?: Maybe<Scalars['uuid']['output']>;
  invitedRole?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  managerId?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type UserInvitationsMinFields = {
  __typename?: 'userInvitationsMinFields';
  acceptedAt?: Maybe<Scalars['timestamptz']['output']>;
  acceptedBy?: Maybe<Scalars['uuid']['output']>;
  clerkInvitationId?: Maybe<Scalars['String']['output']>;
  clerkTicket?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['timestamptz']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  invitedAt?: Maybe<Scalars['timestamptz']['output']>;
  invitedBy?: Maybe<Scalars['uuid']['output']>;
  invitedRole?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  managerId?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "user_invitations" */
export type UserInvitationsMutationResponse = {
  __typename?: 'userInvitationsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<UserInvitations>;
};

/** on_conflict condition type for table "user_invitations" */
export type UserInvitationsOnConflict = {
  constraint: UserInvitationsConstraint;
  updateColumns?: Array<UserInvitationsUpdateColumn>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};

/** Ordering options when selecting data from "user_invitations". */
export type UserInvitationsOrderBy = {
  acceptedAt?: InputMaybe<OrderBy>;
  acceptedBy?: InputMaybe<OrderBy>;
  acceptedByUser?: InputMaybe<UsersOrderBy>;
  clerkInvitationId?: InputMaybe<OrderBy>;
  clerkTicket?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  expiresAt?: InputMaybe<OrderBy>;
  firstName?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invitationMetadata?: InputMaybe<OrderBy>;
  invitedAt?: InputMaybe<OrderBy>;
  invitedBy?: InputMaybe<OrderBy>;
  invitedByUser?: InputMaybe<UsersOrderBy>;
  invitedRole?: InputMaybe<OrderBy>;
  lastName?: InputMaybe<OrderBy>;
  managerId?: InputMaybe<OrderBy>;
  managerUser?: InputMaybe<UsersOrderBy>;
  status?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: user_invitations */
export type UserInvitationsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type UserInvitationsPrependInput = {
  invitationMetadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "user_invitations" */
export enum UserInvitationsSelectColumn {
  /** column name */
  acceptedAt = 'acceptedAt',
  /** column name */
  acceptedBy = 'acceptedBy',
  /** column name */
  clerkInvitationId = 'clerkInvitationId',
  /** column name */
  clerkTicket = 'clerkTicket',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  email = 'email',
  /** column name */
  expiresAt = 'expiresAt',
  /** column name */
  firstName = 'firstName',
  /** column name */
  id = 'id',
  /** column name */
  invitationMetadata = 'invitationMetadata',
  /** column name */
  invitedAt = 'invitedAt',
  /** column name */
  invitedBy = 'invitedBy',
  /** column name */
  invitedRole = 'invitedRole',
  /** column name */
  lastName = 'lastName',
  /** column name */
  managerId = 'managerId',
  /** column name */
  status = 'status',
  /** column name */
  updatedAt = 'updatedAt'
}

/** input type for updating data in table "user_invitations" */
export type UserInvitationsSetInput = {
  acceptedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  acceptedBy?: InputMaybe<Scalars['uuid']['input']>;
  clerkInvitationId?: InputMaybe<Scalars['String']['input']>;
  clerkTicket?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invitationMetadata?: InputMaybe<Scalars['jsonb']['input']>;
  invitedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  invitedBy?: InputMaybe<Scalars['uuid']['input']>;
  invitedRole?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  managerId?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "userInvitations" */
export type UserInvitationsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: UserInvitationsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type UserInvitationsStreamCursorValueInput = {
  acceptedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  acceptedBy?: InputMaybe<Scalars['uuid']['input']>;
  clerkInvitationId?: InputMaybe<Scalars['String']['input']>;
  clerkTicket?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invitationMetadata?: InputMaybe<Scalars['jsonb']['input']>;
  invitedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  invitedBy?: InputMaybe<Scalars['uuid']['input']>;
  invitedRole?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  managerId?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "user_invitations" */
export enum UserInvitationsUpdateColumn {
  /** column name */
  acceptedAt = 'acceptedAt',
  /** column name */
  acceptedBy = 'acceptedBy',
  /** column name */
  clerkInvitationId = 'clerkInvitationId',
  /** column name */
  clerkTicket = 'clerkTicket',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  email = 'email',
  /** column name */
  expiresAt = 'expiresAt',
  /** column name */
  firstName = 'firstName',
  /** column name */
  id = 'id',
  /** column name */
  invitationMetadata = 'invitationMetadata',
  /** column name */
  invitedAt = 'invitedAt',
  /** column name */
  invitedBy = 'invitedBy',
  /** column name */
  invitedRole = 'invitedRole',
  /** column name */
  lastName = 'lastName',
  /** column name */
  managerId = 'managerId',
  /** column name */
  status = 'status',
  /** column name */
  updatedAt = 'updatedAt'
}

export type UserInvitationsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<UserInvitationsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<UserInvitationsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<UserInvitationsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<UserInvitationsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<UserInvitationsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UserInvitationsSetInput>;
  /** filter the rows which have to be updated */
  where: UserInvitationsBoolExp;
};

/** columns and relationships of "user_roles" */
export type UserRoles = {
  __typename?: 'userRoles';
  /** An object relationship */
  assignedRole: Roles;
  createdAt: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  roleId: Scalars['uuid']['output'];
  /** An object relationship */
  roleUser: Users;
  updatedAt: Scalars['timestamptz']['output'];
  userId: Scalars['uuid']['output'];
};

/** aggregated selection of "user_roles" */
export type UserRolesAggregate = {
  __typename?: 'userRolesAggregate';
  aggregate?: Maybe<UserRolesAggregateFields>;
  nodes: Array<UserRoles>;
};

export type UserRolesAggregateBoolExp = {
  count?: InputMaybe<UserRolesAggregateBoolExpCount>;
};

export type UserRolesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<UserRolesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UserRolesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "user_roles" */
export type UserRolesAggregateFields = {
  __typename?: 'userRolesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<UserRolesMaxFields>;
  min?: Maybe<UserRolesMinFields>;
};


/** aggregate fields of "user_roles" */
export type UserRolesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<UserRolesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "user_roles" */
export type UserRolesAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<UserRolesMaxOrderBy>;
  min?: InputMaybe<UserRolesMinOrderBy>;
};

/** input type for inserting array relation for remote table "user_roles" */
export type UserRolesArrRelInsertInput = {
  data: Array<UserRolesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<UserRolesOnConflict>;
};

/** Boolean expression to filter rows from the table "user_roles". All fields are combined with a logical 'AND'. */
export type UserRolesBoolExp = {
  _and?: InputMaybe<Array<UserRolesBoolExp>>;
  _not?: InputMaybe<UserRolesBoolExp>;
  _or?: InputMaybe<Array<UserRolesBoolExp>>;
  assignedRole?: InputMaybe<RolesBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  roleId?: InputMaybe<UuidComparisonExp>;
  roleUser?: InputMaybe<UsersBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "user_roles" */
export enum UserRolesConstraint {
  /** unique or primary key constraint on columns "id" */
  user_roles_pkey = 'user_roles_pkey',
  /** unique or primary key constraint on columns "user_id", "role_id" */
  user_roles_user_id_role_id_key = 'user_roles_user_id_role_id_key'
}

/** input type for inserting data into table "user_roles" */
export type UserRolesInsertInput = {
  assignedRole?: InputMaybe<RolesObjRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  roleUser?: InputMaybe<UsersObjRelInsertInput>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type UserRolesMaxFields = {
  __typename?: 'userRolesMaxFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  roleId?: Maybe<Scalars['uuid']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "user_roles" */
export type UserRolesMaxOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type UserRolesMinFields = {
  __typename?: 'userRolesMinFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  roleId?: Maybe<Scalars['uuid']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "user_roles" */
export type UserRolesMinOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "user_roles" */
export type UserRolesMutationResponse = {
  __typename?: 'userRolesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<UserRoles>;
};

/** on_conflict condition type for table "user_roles" */
export type UserRolesOnConflict = {
  constraint: UserRolesConstraint;
  updateColumns?: Array<UserRolesUpdateColumn>;
  where?: InputMaybe<UserRolesBoolExp>;
};

/** Ordering options when selecting data from "user_roles". */
export type UserRolesOrderBy = {
  assignedRole?: InputMaybe<RolesOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  roleUser?: InputMaybe<UsersOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: user_roles */
export type UserRolesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "user_roles" */
export enum UserRolesSelectColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  roleId = 'roleId',
  /** column name */
  updatedAt = 'updatedAt',
  /** column name */
  userId = 'userId'
}

/** input type for updating data in table "user_roles" */
export type UserRolesSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "userRoles" */
export type UserRolesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: UserRolesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type UserRolesStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "user_roles" */
export enum UserRolesUpdateColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  roleId = 'roleId',
  /** column name */
  updatedAt = 'updatedAt',
  /** column name */
  userId = 'userId'
}

export type UserRolesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UserRolesSetInput>;
  /** filter the rows which have to be updated */
  where: UserRolesBoolExp;
};

/** columns and relationships of "users" */
export type Users = {
  __typename?: 'users';
  /** An array relationship */
  assignedRoles: Array<UserRoles>;
  /** An aggregate relationship */
  assignedRolesAggregate: UserRolesAggregate;
  /** An array relationship */
  authoredNotes: Array<Notes>;
  /** An aggregate relationship */
  authoredNotesAggregate: NotesAggregate;
  /** An array relationship */
  backupConsultantPayrolls: Array<Payrolls>;
  /** An aggregate relationship */
  backupConsultantPayrollsAggregate: PayrollsAggregate;
  /** External identifier from Clerk authentication service */
  clerkUserId?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  consultantAssignments: Array<PayrollAssignments>;
  /** An aggregate relationship */
  consultantAssignmentsAggregate: PayrollAssignmentsAggregate;
  /** An array relationship */
  createdAssignmentAudits: Array<PayrollAssignmentAudits>;
  /** An aggregate relationship */
  createdAssignmentAuditsAggregate: PayrollAssignmentAuditsAggregate;
  /** An array relationship */
  createdAssignments: Array<PayrollAssignments>;
  /** An aggregate relationship */
  createdAssignmentsAggregate: PayrollAssignmentsAggregate;
  /** Timestamp when the user was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** An array relationship */
  createdBillingEvents: Array<BillingEventLogs>;
  /** An aggregate relationship */
  createdBillingEventsAggregate: BillingEventLogsAggregate;
  /** An array relationship */
  createdPermissionOverrides: Array<PermissionOverrides>;
  /** An aggregate relationship */
  createdPermissionOverridesAggregate: PermissionOverridesAggregate;
  deactivatedAt?: Maybe<Scalars['timestamptz']['output']>;
  deactivatedBy?: Maybe<Scalars['String']['output']>;
  /** User's email address (unique) */
  email: Scalars['String']['output'];
  /** Unique identifier for the user */
  id: Scalars['uuid']['output'];
  /** URL to the user's profile image */
  image?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  /** Whether the user is a staff member (vs. external user) */
  isStaff?: Maybe<Scalars['Boolean']['output']>;
  /** An array relationship */
  managedPayrolls: Array<Payrolls>;
  /** An aggregate relationship */
  managedPayrollsAggregate: PayrollsAggregate;
  /** An array relationship */
  managedTeamMembers: Array<Users>;
  /** An aggregate relationship */
  managedTeamMembersAggregate: UsersAggregate;
  /** An array relationship */
  managedUsers: Array<Users>;
  /** An aggregate relationship */
  managedUsersAggregate: UsersAggregate;
  /** Reference to the user's manager */
  managerId?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  managerUser?: Maybe<Users>;
  /** User's full name */
  name: Scalars['String']['output'];
  /** An array relationship */
  newConsultantAuditTrail: Array<PayrollAssignmentAudits>;
  /** An aggregate relationship */
  newConsultantAuditTrailAggregate: PayrollAssignmentAuditsAggregate;
  /** An array relationship */
  originalConsultantAssignments: Array<PayrollAssignments>;
  /** An aggregate relationship */
  originalConsultantAssignmentsAggregate: PayrollAssignmentsAggregate;
  /** An array relationship */
  originalConsultantAuditTrail: Array<PayrollAssignmentAudits>;
  /** An aggregate relationship */
  originalConsultantAuditTrailAggregate: PayrollAssignmentAuditsAggregate;
  /** An array relationship */
  primaryConsultantPayrolls: Array<Payrolls>;
  /** An aggregate relationship */
  primaryConsultantPayrollsAggregate: PayrollsAggregate;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role: Scalars['user_role']['output'];
  /** An array relationship */
  targetedPermissionAudits: Array<PermissionAuditLogs>;
  /** An aggregate relationship */
  targetedPermissionAuditsAggregate: PermissionAuditLogsAggregate;
  /** Timestamp when the user was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** An array relationship */
  userLeaveRecords: Array<Leave>;
  /** An aggregate relationship */
  userLeaveRecordsAggregate: LeaveAggregate;
  /** An array relationship */
  userPermissionAudits: Array<PermissionAuditLogs>;
  /** An aggregate relationship */
  userPermissionAuditsAggregate: PermissionAuditLogsAggregate;
  /** An array relationship */
  userPermissionOverrides: Array<PermissionOverrides>;
  /** An aggregate relationship */
  userPermissionOverridesAggregate: PermissionOverridesAggregate;
  /** An array relationship */
  userWorkSchedules: Array<WorkSchedules>;
  /** An aggregate relationship */
  userWorkSchedulesAggregate: WorkSchedulesAggregate;
  /** User's unique username for login */
  username?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "users" */
export type UsersAssignedRolesArgs = {
  distinctOn?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersAssignedRolesAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersAuthoredNotesArgs = {
  distinctOn?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersAuthoredNotesAggregateArgs = {
  distinctOn?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersBackupConsultantPayrollsArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersBackupConsultantPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersConsultantAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersConsultantAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersCreatedAssignmentAuditsArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersCreatedAssignmentAuditsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersCreatedAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersCreatedAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersCreatedBillingEventsArgs = {
  distinctOn?: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where?: InputMaybe<BillingEventLogsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersCreatedBillingEventsAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where?: InputMaybe<BillingEventLogsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersCreatedPermissionOverridesArgs = {
  distinctOn?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersCreatedPermissionOverridesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersManagedPayrollsArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersManagedPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersManagedTeamMembersArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


/** columns and relationships of "users" */
export type UsersManagedTeamMembersAggregateArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


/** columns and relationships of "users" */
export type UsersManagedUsersArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


/** columns and relationships of "users" */
export type UsersManagedUsersAggregateArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


/** columns and relationships of "users" */
export type UsersNewConsultantAuditTrailArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersNewConsultantAuditTrailAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersOriginalConsultantAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersOriginalConsultantAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersOriginalConsultantAuditTrailArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersOriginalConsultantAuditTrailAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPrimaryConsultantPayrollsArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPrimaryConsultantPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersTargetedPermissionAuditsArgs = {
  distinctOn?: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where?: InputMaybe<PermissionAuditLogsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersTargetedPermissionAuditsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where?: InputMaybe<PermissionAuditLogsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserLeaveRecordsArgs = {
  distinctOn?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserLeaveRecordsAggregateArgs = {
  distinctOn?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserPermissionAuditsArgs = {
  distinctOn?: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where?: InputMaybe<PermissionAuditLogsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserPermissionAuditsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where?: InputMaybe<PermissionAuditLogsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserPermissionOverridesArgs = {
  distinctOn?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserPermissionOverridesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserWorkSchedulesArgs = {
  distinctOn?: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkSchedulesOrderBy>>;
  where?: InputMaybe<WorkSchedulesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserWorkSchedulesAggregateArgs = {
  distinctOn?: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkSchedulesOrderBy>>;
  where?: InputMaybe<WorkSchedulesBoolExp>;
};

/** aggregated selection of "users" */
export type UsersAggregate = {
  __typename?: 'usersAggregate';
  aggregate?: Maybe<UsersAggregateFields>;
  nodes: Array<Users>;
};

export type UsersAggregateBoolExp = {
  bool_and?: InputMaybe<UsersAggregateBoolExpBoolAnd>;
  bool_or?: InputMaybe<UsersAggregateBoolExpBoolOr>;
  count?: InputMaybe<UsersAggregateBoolExpCount>;
};

export type UsersAggregateBoolExpBoolAnd = {
  arguments: UsersSelectColumnUsersAggregateBoolExpBoolAndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UsersBoolExp>;
  predicate: BooleanComparisonExp;
};

export type UsersAggregateBoolExpBoolOr = {
  arguments: UsersSelectColumnUsersAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UsersBoolExp>;
  predicate: BooleanComparisonExp;
};

export type UsersAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<UsersSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UsersBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "users" */
export type UsersAggregateFields = {
  __typename?: 'usersAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<UsersMaxFields>;
  min?: Maybe<UsersMinFields>;
};


/** aggregate fields of "users" */
export type UsersAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<UsersSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "users" */
export type UsersAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<UsersMaxOrderBy>;
  min?: InputMaybe<UsersMinOrderBy>;
};

/** input type for inserting array relation for remote table "users" */
export type UsersArrRelInsertInput = {
  data: Array<UsersInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<UsersOnConflict>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type UsersBoolExp = {
  _and?: InputMaybe<Array<UsersBoolExp>>;
  _not?: InputMaybe<UsersBoolExp>;
  _or?: InputMaybe<Array<UsersBoolExp>>;
  assignedRoles?: InputMaybe<UserRolesBoolExp>;
  assignedRolesAggregate?: InputMaybe<UserRolesAggregateBoolExp>;
  authoredNotes?: InputMaybe<NotesBoolExp>;
  authoredNotesAggregate?: InputMaybe<NotesAggregateBoolExp>;
  backupConsultantPayrolls?: InputMaybe<PayrollsBoolExp>;
  backupConsultantPayrollsAggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  clerkUserId?: InputMaybe<StringComparisonExp>;
  consultantAssignments?: InputMaybe<PayrollAssignmentsBoolExp>;
  consultantAssignmentsAggregate?: InputMaybe<PayrollAssignmentsAggregateBoolExp>;
  createdAssignmentAudits?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
  createdAssignmentAuditsAggregate?: InputMaybe<PayrollAssignmentAuditsAggregateBoolExp>;
  createdAssignments?: InputMaybe<PayrollAssignmentsBoolExp>;
  createdAssignmentsAggregate?: InputMaybe<PayrollAssignmentsAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdBillingEvents?: InputMaybe<BillingEventLogsBoolExp>;
  createdBillingEventsAggregate?: InputMaybe<BillingEventLogsAggregateBoolExp>;
  createdPermissionOverrides?: InputMaybe<PermissionOverridesBoolExp>;
  createdPermissionOverridesAggregate?: InputMaybe<PermissionOverridesAggregateBoolExp>;
  deactivatedAt?: InputMaybe<TimestamptzComparisonExp>;
  deactivatedBy?: InputMaybe<StringComparisonExp>;
  email?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  image?: InputMaybe<StringComparisonExp>;
  isActive?: InputMaybe<BooleanComparisonExp>;
  isStaff?: InputMaybe<BooleanComparisonExp>;
  managedPayrolls?: InputMaybe<PayrollsBoolExp>;
  managedPayrollsAggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  managedTeamMembers?: InputMaybe<UsersBoolExp>;
  managedTeamMembersAggregate?: InputMaybe<UsersAggregateBoolExp>;
  managedUsers?: InputMaybe<UsersBoolExp>;
  managedUsersAggregate?: InputMaybe<UsersAggregateBoolExp>;
  managerId?: InputMaybe<UuidComparisonExp>;
  managerUser?: InputMaybe<UsersBoolExp>;
  name?: InputMaybe<StringComparisonExp>;
  newConsultantAuditTrail?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
  newConsultantAuditTrailAggregate?: InputMaybe<PayrollAssignmentAuditsAggregateBoolExp>;
  originalConsultantAssignments?: InputMaybe<PayrollAssignmentsBoolExp>;
  originalConsultantAssignmentsAggregate?: InputMaybe<PayrollAssignmentsAggregateBoolExp>;
  originalConsultantAuditTrail?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
  originalConsultantAuditTrailAggregate?: InputMaybe<PayrollAssignmentAuditsAggregateBoolExp>;
  primaryConsultantPayrolls?: InputMaybe<PayrollsBoolExp>;
  primaryConsultantPayrollsAggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  role?: InputMaybe<UserRoleComparisonExp>;
  targetedPermissionAudits?: InputMaybe<PermissionAuditLogsBoolExp>;
  targetedPermissionAuditsAggregate?: InputMaybe<PermissionAuditLogsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  userLeaveRecords?: InputMaybe<LeaveBoolExp>;
  userLeaveRecordsAggregate?: InputMaybe<LeaveAggregateBoolExp>;
  userPermissionAudits?: InputMaybe<PermissionAuditLogsBoolExp>;
  userPermissionAuditsAggregate?: InputMaybe<PermissionAuditLogsAggregateBoolExp>;
  userPermissionOverrides?: InputMaybe<PermissionOverridesBoolExp>;
  userPermissionOverridesAggregate?: InputMaybe<PermissionOverridesAggregateBoolExp>;
  userWorkSchedules?: InputMaybe<WorkSchedulesBoolExp>;
  userWorkSchedulesAggregate?: InputMaybe<WorkSchedulesAggregateBoolExp>;
  username?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "users" */
export enum UsersConstraint {
  /** unique or primary key constraint on columns "clerk_user_id" */
  users_clerk_user_id_key = 'users_clerk_user_id_key',
  /** unique or primary key constraint on columns "email" */
  users_email_key = 'users_email_key',
  /** unique or primary key constraint on columns "id" */
  users_pkey = 'users_pkey',
  /** unique or primary key constraint on columns "username" */
  users_username_key = 'users_username_key'
}

/** input type for inserting data into table "users" */
export type UsersInsertInput = {
  assignedRoles?: InputMaybe<UserRolesArrRelInsertInput>;
  authoredNotes?: InputMaybe<NotesArrRelInsertInput>;
  backupConsultantPayrolls?: InputMaybe<PayrollsArrRelInsertInput>;
  /** External identifier from Clerk authentication service */
  clerkUserId?: InputMaybe<Scalars['String']['input']>;
  consultantAssignments?: InputMaybe<PayrollAssignmentsArrRelInsertInput>;
  createdAssignmentAudits?: InputMaybe<PayrollAssignmentAuditsArrRelInsertInput>;
  createdAssignments?: InputMaybe<PayrollAssignmentsArrRelInsertInput>;
  /** Timestamp when the user was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBillingEvents?: InputMaybe<BillingEventLogsArrRelInsertInput>;
  createdPermissionOverrides?: InputMaybe<PermissionOverridesArrRelInsertInput>;
  deactivatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deactivatedBy?: InputMaybe<Scalars['String']['input']>;
  /** User's email address (unique) */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the user */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** URL to the user's profile image */
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether the user is a staff member (vs. external user) */
  isStaff?: InputMaybe<Scalars['Boolean']['input']>;
  managedPayrolls?: InputMaybe<PayrollsArrRelInsertInput>;
  managedTeamMembers?: InputMaybe<UsersArrRelInsertInput>;
  managedUsers?: InputMaybe<UsersArrRelInsertInput>;
  /** Reference to the user's manager */
  managerId?: InputMaybe<Scalars['uuid']['input']>;
  managerUser?: InputMaybe<UsersObjRelInsertInput>;
  /** User's full name */
  name?: InputMaybe<Scalars['String']['input']>;
  newConsultantAuditTrail?: InputMaybe<PayrollAssignmentAuditsArrRelInsertInput>;
  originalConsultantAssignments?: InputMaybe<PayrollAssignmentsArrRelInsertInput>;
  originalConsultantAuditTrail?: InputMaybe<PayrollAssignmentAuditsArrRelInsertInput>;
  primaryConsultantPayrolls?: InputMaybe<PayrollsArrRelInsertInput>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Scalars['user_role']['input']>;
  targetedPermissionAudits?: InputMaybe<PermissionAuditLogsArrRelInsertInput>;
  /** Timestamp when the user was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userLeaveRecords?: InputMaybe<LeaveArrRelInsertInput>;
  userPermissionAudits?: InputMaybe<PermissionAuditLogsArrRelInsertInput>;
  userPermissionOverrides?: InputMaybe<PermissionOverridesArrRelInsertInput>;
  userWorkSchedules?: InputMaybe<WorkSchedulesArrRelInsertInput>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type UsersMaxFields = {
  __typename?: 'usersMaxFields';
  /** External identifier from Clerk authentication service */
  clerkUserId?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the user was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  deactivatedAt?: Maybe<Scalars['timestamptz']['output']>;
  deactivatedBy?: Maybe<Scalars['String']['output']>;
  /** User's email address (unique) */
  email?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the user */
  id?: Maybe<Scalars['uuid']['output']>;
  /** URL to the user's profile image */
  image?: Maybe<Scalars['String']['output']>;
  /** Reference to the user's manager */
  managerId?: Maybe<Scalars['uuid']['output']>;
  /** User's full name */
  name?: Maybe<Scalars['String']['output']>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: Maybe<Scalars['user_role']['output']>;
  /** Timestamp when the user was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** User's unique username for login */
  username?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "users" */
export type UsersMaxOrderBy = {
  /** External identifier from Clerk authentication service */
  clerkUserId?: InputMaybe<OrderBy>;
  /** Timestamp when the user was created */
  createdAt?: InputMaybe<OrderBy>;
  deactivatedAt?: InputMaybe<OrderBy>;
  deactivatedBy?: InputMaybe<OrderBy>;
  /** User's email address (unique) */
  email?: InputMaybe<OrderBy>;
  /** Unique identifier for the user */
  id?: InputMaybe<OrderBy>;
  /** URL to the user's profile image */
  image?: InputMaybe<OrderBy>;
  /** Reference to the user's manager */
  managerId?: InputMaybe<OrderBy>;
  /** User's full name */
  name?: InputMaybe<OrderBy>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<OrderBy>;
  /** Timestamp when the user was last updated */
  updatedAt?: InputMaybe<OrderBy>;
  /** User's unique username for login */
  username?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type UsersMinFields = {
  __typename?: 'usersMinFields';
  /** External identifier from Clerk authentication service */
  clerkUserId?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the user was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  deactivatedAt?: Maybe<Scalars['timestamptz']['output']>;
  deactivatedBy?: Maybe<Scalars['String']['output']>;
  /** User's email address (unique) */
  email?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the user */
  id?: Maybe<Scalars['uuid']['output']>;
  /** URL to the user's profile image */
  image?: Maybe<Scalars['String']['output']>;
  /** Reference to the user's manager */
  managerId?: Maybe<Scalars['uuid']['output']>;
  /** User's full name */
  name?: Maybe<Scalars['String']['output']>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: Maybe<Scalars['user_role']['output']>;
  /** Timestamp when the user was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** User's unique username for login */
  username?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "users" */
export type UsersMinOrderBy = {
  /** External identifier from Clerk authentication service */
  clerkUserId?: InputMaybe<OrderBy>;
  /** Timestamp when the user was created */
  createdAt?: InputMaybe<OrderBy>;
  deactivatedAt?: InputMaybe<OrderBy>;
  deactivatedBy?: InputMaybe<OrderBy>;
  /** User's email address (unique) */
  email?: InputMaybe<OrderBy>;
  /** Unique identifier for the user */
  id?: InputMaybe<OrderBy>;
  /** URL to the user's profile image */
  image?: InputMaybe<OrderBy>;
  /** Reference to the user's manager */
  managerId?: InputMaybe<OrderBy>;
  /** User's full name */
  name?: InputMaybe<OrderBy>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<OrderBy>;
  /** Timestamp when the user was last updated */
  updatedAt?: InputMaybe<OrderBy>;
  /** User's unique username for login */
  username?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "users" */
export type UsersMutationResponse = {
  __typename?: 'usersMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type UsersObjRelInsertInput = {
  data: UsersInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<UsersOnConflict>;
};

/** on_conflict condition type for table "users" */
export type UsersOnConflict = {
  constraint: UsersConstraint;
  updateColumns?: Array<UsersUpdateColumn>;
  where?: InputMaybe<UsersBoolExp>;
};

/** Ordering options when selecting data from "users". */
export type UsersOrderBy = {
  assignedRolesAggregate?: InputMaybe<UserRolesAggregateOrderBy>;
  authoredNotesAggregate?: InputMaybe<NotesAggregateOrderBy>;
  backupConsultantPayrollsAggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  clerkUserId?: InputMaybe<OrderBy>;
  consultantAssignmentsAggregate?: InputMaybe<PayrollAssignmentsAggregateOrderBy>;
  createdAssignmentAuditsAggregate?: InputMaybe<PayrollAssignmentAuditsAggregateOrderBy>;
  createdAssignmentsAggregate?: InputMaybe<PayrollAssignmentsAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBillingEventsAggregate?: InputMaybe<BillingEventLogsAggregateOrderBy>;
  createdPermissionOverridesAggregate?: InputMaybe<PermissionOverridesAggregateOrderBy>;
  deactivatedAt?: InputMaybe<OrderBy>;
  deactivatedBy?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  image?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  isStaff?: InputMaybe<OrderBy>;
  managedPayrollsAggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  managedTeamMembersAggregate?: InputMaybe<UsersAggregateOrderBy>;
  managedUsersAggregate?: InputMaybe<UsersAggregateOrderBy>;
  managerId?: InputMaybe<OrderBy>;
  managerUser?: InputMaybe<UsersOrderBy>;
  name?: InputMaybe<OrderBy>;
  newConsultantAuditTrailAggregate?: InputMaybe<PayrollAssignmentAuditsAggregateOrderBy>;
  originalConsultantAssignmentsAggregate?: InputMaybe<PayrollAssignmentsAggregateOrderBy>;
  originalConsultantAuditTrailAggregate?: InputMaybe<PayrollAssignmentAuditsAggregateOrderBy>;
  primaryConsultantPayrollsAggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  role?: InputMaybe<OrderBy>;
  targetedPermissionAuditsAggregate?: InputMaybe<PermissionAuditLogsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userLeaveRecordsAggregate?: InputMaybe<LeaveAggregateOrderBy>;
  userPermissionAuditsAggregate?: InputMaybe<PermissionAuditLogsAggregateOrderBy>;
  userPermissionOverridesAggregate?: InputMaybe<PermissionOverridesAggregateOrderBy>;
  userWorkSchedulesAggregate?: InputMaybe<WorkSchedulesAggregateOrderBy>;
  username?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: users */
export type UsersPkColumnsInput = {
  /** Unique identifier for the user */
  id: Scalars['uuid']['input'];
};

/** columns and relationships of "users_role_backup" */
export type UsersRoleBackup = {
  __typename?: 'usersRoleBackup';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['user_role']['output']>;
};

/** aggregated selection of "users_role_backup" */
export type UsersRoleBackupAggregate = {
  __typename?: 'usersRoleBackupAggregate';
  aggregate?: Maybe<UsersRoleBackupAggregateFields>;
  nodes: Array<UsersRoleBackup>;
};

/** aggregate fields of "users_role_backup" */
export type UsersRoleBackupAggregateFields = {
  __typename?: 'usersRoleBackupAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<UsersRoleBackupMaxFields>;
  min?: Maybe<UsersRoleBackupMinFields>;
};


/** aggregate fields of "users_role_backup" */
export type UsersRoleBackupAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "users_role_backup". All fields are combined with a logical 'AND'. */
export type UsersRoleBackupBoolExp = {
  _and?: InputMaybe<Array<UsersRoleBackupBoolExp>>;
  _not?: InputMaybe<UsersRoleBackupBoolExp>;
  _or?: InputMaybe<Array<UsersRoleBackupBoolExp>>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  email?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  role?: InputMaybe<UserRoleComparisonExp>;
};

/** input type for inserting data into table "users_role_backup" */
export type UsersRoleBackupInsertInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
};

/** aggregate max on columns */
export type UsersRoleBackupMaxFields = {
  __typename?: 'usersRoleBackupMaxFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['user_role']['output']>;
};

/** aggregate min on columns */
export type UsersRoleBackupMinFields = {
  __typename?: 'usersRoleBackupMinFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['user_role']['output']>;
};

/** response of any mutation on the table "users_role_backup" */
export type UsersRoleBackupMutationResponse = {
  __typename?: 'usersRoleBackupMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<UsersRoleBackup>;
};

/** Ordering options when selecting data from "users_role_backup". */
export type UsersRoleBackupOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  role?: InputMaybe<OrderBy>;
};

/** select columns of table "users_role_backup" */
export enum UsersRoleBackupSelectColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  email = 'email',
  /** column name */
  id = 'id',
  /** column name */
  role = 'role'
}

/** input type for updating data in table "users_role_backup" */
export type UsersRoleBackupSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
};

/** Streaming cursor of the table "usersRoleBackup" */
export type UsersRoleBackupStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: UsersRoleBackupStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type UsersRoleBackupStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
};

export type UsersRoleBackupUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UsersRoleBackupSetInput>;
  /** filter the rows which have to be updated */
  where: UsersRoleBackupBoolExp;
};

/** select columns of table "users" */
export enum UsersSelectColumn {
  /** column name */
  clerkUserId = 'clerkUserId',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  deactivatedAt = 'deactivatedAt',
  /** column name */
  deactivatedBy = 'deactivatedBy',
  /** column name */
  email = 'email',
  /** column name */
  id = 'id',
  /** column name */
  image = 'image',
  /** column name */
  isActive = 'isActive',
  /** column name */
  isStaff = 'isStaff',
  /** column name */
  managerId = 'managerId',
  /** column name */
  name = 'name',
  /** column name */
  role = 'role',
  /** column name */
  updatedAt = 'updatedAt',
  /** column name */
  username = 'username'
}

/** select "usersAggregateBoolExpBool_andArgumentsColumns" columns of table "users" */
export enum UsersSelectColumnUsersAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  isActive = 'isActive',
  /** column name */
  isStaff = 'isStaff'
}

/** select "usersAggregateBoolExpBool_orArgumentsColumns" columns of table "users" */
export enum UsersSelectColumnUsersAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  isActive = 'isActive',
  /** column name */
  isStaff = 'isStaff'
}

/** input type for updating data in table "users" */
export type UsersSetInput = {
  /** External identifier from Clerk authentication service */
  clerkUserId?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the user was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deactivatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deactivatedBy?: InputMaybe<Scalars['String']['input']>;
  /** User's email address (unique) */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the user */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** URL to the user's profile image */
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether the user is a staff member (vs. external user) */
  isStaff?: InputMaybe<Scalars['Boolean']['input']>;
  /** Reference to the user's manager */
  managerId?: InputMaybe<Scalars['uuid']['input']>;
  /** User's full name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Scalars['user_role']['input']>;
  /** Timestamp when the user was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "users" */
export type UsersStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: UsersStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type UsersStreamCursorValueInput = {
  /** External identifier from Clerk authentication service */
  clerkUserId?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the user was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deactivatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deactivatedBy?: InputMaybe<Scalars['String']['input']>;
  /** User's email address (unique) */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the user */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** URL to the user's profile image */
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether the user is a staff member (vs. external user) */
  isStaff?: InputMaybe<Scalars['Boolean']['input']>;
  /** Reference to the user's manager */
  managerId?: InputMaybe<Scalars['uuid']['input']>;
  /** User's full name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Scalars['user_role']['input']>;
  /** Timestamp when the user was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "users" */
export enum UsersUpdateColumn {
  /** column name */
  clerkUserId = 'clerkUserId',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  deactivatedAt = 'deactivatedAt',
  /** column name */
  deactivatedBy = 'deactivatedBy',
  /** column name */
  email = 'email',
  /** column name */
  id = 'id',
  /** column name */
  image = 'image',
  /** column name */
  isActive = 'isActive',
  /** column name */
  isStaff = 'isStaff',
  /** column name */
  managerId = 'managerId',
  /** column name */
  name = 'name',
  /** column name */
  role = 'role',
  /** column name */
  updatedAt = 'updatedAt',
  /** column name */
  username = 'username'
}

export type UsersUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UsersSetInput>;
  /** filter the rows which have to be updated */
  where: UsersBoolExp;
};

/** columns and relationships of "work_schedule" */
export type WorkSchedules = {
  __typename?: 'workSchedules';
  /** Timestamp when the schedule entry was created */
  createdAt?: Maybe<Scalars['timestamp']['output']>;
  /** Unique identifier for the work schedule entry */
  id: Scalars['uuid']['output'];
  /** An object relationship */
  scheduleOwner: Users;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: Maybe<Scalars['timestamp']['output']>;
  /** Reference to the user this schedule belongs to */
  userId: Scalars['uuid']['output'];
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay: Scalars['String']['output'];
  /** Number of hours worked on this day */
  workHours: Scalars['numeric']['output'];
  /** An object relationship */
  workScheduleUser: Users;
};

/** aggregated selection of "work_schedule" */
export type WorkSchedulesAggregate = {
  __typename?: 'workSchedulesAggregate';
  aggregate?: Maybe<WorkSchedulesAggregateFields>;
  nodes: Array<WorkSchedules>;
};

export type WorkSchedulesAggregateBoolExp = {
  count?: InputMaybe<WorkSchedulesAggregateBoolExpCount>;
};

export type WorkSchedulesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<WorkSchedulesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "work_schedule" */
export type WorkSchedulesAggregateFields = {
  __typename?: 'workSchedulesAggregateFields';
  avg?: Maybe<WorkSchedulesAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<WorkSchedulesMaxFields>;
  min?: Maybe<WorkSchedulesMinFields>;
  stddev?: Maybe<WorkSchedulesStddevFields>;
  stddevPop?: Maybe<WorkSchedulesStddevPopFields>;
  stddevSamp?: Maybe<WorkSchedulesStddevSampFields>;
  sum?: Maybe<WorkSchedulesSumFields>;
  varPop?: Maybe<WorkSchedulesVarPopFields>;
  varSamp?: Maybe<WorkSchedulesVarSampFields>;
  variance?: Maybe<WorkSchedulesVarianceFields>;
};


/** aggregate fields of "work_schedule" */
export type WorkSchedulesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "work_schedule" */
export type WorkSchedulesAggregateOrderBy = {
  avg?: InputMaybe<WorkSchedulesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<WorkSchedulesMaxOrderBy>;
  min?: InputMaybe<WorkSchedulesMinOrderBy>;
  stddev?: InputMaybe<WorkSchedulesStddevOrderBy>;
  stddevPop?: InputMaybe<WorkSchedulesStddevPopOrderBy>;
  stddevSamp?: InputMaybe<WorkSchedulesStddevSampOrderBy>;
  sum?: InputMaybe<WorkSchedulesSumOrderBy>;
  varPop?: InputMaybe<WorkSchedulesVarPopOrderBy>;
  varSamp?: InputMaybe<WorkSchedulesVarSampOrderBy>;
  variance?: InputMaybe<WorkSchedulesVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "work_schedule" */
export type WorkSchedulesArrRelInsertInput = {
  data: Array<WorkSchedulesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<WorkSchedulesOnConflict>;
};

/** aggregate avg on columns */
export type WorkSchedulesAvgFields = {
  __typename?: 'workSchedulesAvgFields';
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "work_schedule" */
export type WorkSchedulesAvgOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "work_schedule". All fields are combined with a logical 'AND'. */
export type WorkSchedulesBoolExp = {
  _and?: InputMaybe<Array<WorkSchedulesBoolExp>>;
  _not?: InputMaybe<WorkSchedulesBoolExp>;
  _or?: InputMaybe<Array<WorkSchedulesBoolExp>>;
  createdAt?: InputMaybe<TimestampComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  scheduleOwner?: InputMaybe<UsersBoolExp>;
  updatedAt?: InputMaybe<TimestampComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
  workDay?: InputMaybe<StringComparisonExp>;
  workHours?: InputMaybe<NumericComparisonExp>;
  workScheduleUser?: InputMaybe<UsersBoolExp>;
};

/** unique or primary key constraints on table "work_schedule" */
export enum WorkSchedulesConstraint {
  /** unique or primary key constraint on columns "user_id", "work_day" */
  unique_user_work_day = 'unique_user_work_day',
  /** unique or primary key constraint on columns "id" */
  work_schedule_pkey = 'work_schedule_pkey'
}

/** input type for incrementing numeric columns in table "work_schedule" */
export type WorkSchedulesIncInput = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "work_schedule" */
export type WorkSchedulesInsertInput = {
  /** Timestamp when the schedule entry was created */
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Scalars['uuid']['input']>;
  scheduleOwner?: InputMaybe<UsersObjRelInsertInput>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** Reference to the user this schedule belongs to */
  userId?: InputMaybe<Scalars['uuid']['input']>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay?: InputMaybe<Scalars['String']['input']>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<Scalars['numeric']['input']>;
  workScheduleUser?: InputMaybe<UsersObjRelInsertInput>;
};

/** aggregate max on columns */
export type WorkSchedulesMaxFields = {
  __typename?: 'workSchedulesMaxFields';
  /** Timestamp when the schedule entry was created */
  createdAt?: Maybe<Scalars['timestamp']['output']>;
  /** Unique identifier for the work schedule entry */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: Maybe<Scalars['timestamp']['output']>;
  /** Reference to the user this schedule belongs to */
  userId?: Maybe<Scalars['uuid']['output']>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay?: Maybe<Scalars['String']['output']>;
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['numeric']['output']>;
};

/** order by max() on columns of table "work_schedule" */
export type WorkSchedulesMaxOrderBy = {
  /** Timestamp when the schedule entry was created */
  createdAt?: InputMaybe<OrderBy>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<OrderBy>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: InputMaybe<OrderBy>;
  /** Reference to the user this schedule belongs to */
  userId?: InputMaybe<OrderBy>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay?: InputMaybe<OrderBy>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type WorkSchedulesMinFields = {
  __typename?: 'workSchedulesMinFields';
  /** Timestamp when the schedule entry was created */
  createdAt?: Maybe<Scalars['timestamp']['output']>;
  /** Unique identifier for the work schedule entry */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: Maybe<Scalars['timestamp']['output']>;
  /** Reference to the user this schedule belongs to */
  userId?: Maybe<Scalars['uuid']['output']>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay?: Maybe<Scalars['String']['output']>;
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['numeric']['output']>;
};

/** order by min() on columns of table "work_schedule" */
export type WorkSchedulesMinOrderBy = {
  /** Timestamp when the schedule entry was created */
  createdAt?: InputMaybe<OrderBy>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<OrderBy>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: InputMaybe<OrderBy>;
  /** Reference to the user this schedule belongs to */
  userId?: InputMaybe<OrderBy>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay?: InputMaybe<OrderBy>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "work_schedule" */
export type WorkSchedulesMutationResponse = {
  __typename?: 'workSchedulesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<WorkSchedules>;
};

/** on_conflict condition type for table "work_schedule" */
export type WorkSchedulesOnConflict = {
  constraint: WorkSchedulesConstraint;
  updateColumns?: Array<WorkSchedulesUpdateColumn>;
  where?: InputMaybe<WorkSchedulesBoolExp>;
};

/** Ordering options when selecting data from "work_schedule". */
export type WorkSchedulesOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  scheduleOwner?: InputMaybe<UsersOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  workDay?: InputMaybe<OrderBy>;
  workHours?: InputMaybe<OrderBy>;
  workScheduleUser?: InputMaybe<UsersOrderBy>;
};

/** primary key columns input for table: work_schedule */
export type WorkSchedulesPkColumnsInput = {
  /** Unique identifier for the work schedule entry */
  id: Scalars['uuid']['input'];
};

/** select columns of table "work_schedule" */
export enum WorkSchedulesSelectColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  updatedAt = 'updatedAt',
  /** column name */
  userId = 'userId',
  /** column name */
  workDay = 'workDay',
  /** column name */
  workHours = 'workHours'
}

/** input type for updating data in table "work_schedule" */
export type WorkSchedulesSetInput = {
  /** Timestamp when the schedule entry was created */
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** Reference to the user this schedule belongs to */
  userId?: InputMaybe<Scalars['uuid']['input']>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay?: InputMaybe<Scalars['String']['input']>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate stddev on columns */
export type WorkSchedulesStddevFields = {
  __typename?: 'workSchedulesStddevFields';
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "work_schedule" */
export type WorkSchedulesStddevOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** aggregate stddevPop on columns */
export type WorkSchedulesStddevPopFields = {
  __typename?: 'workSchedulesStddevPopFields';
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevPop() on columns of table "work_schedule" */
export type WorkSchedulesStddevPopOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** aggregate stddevSamp on columns */
export type WorkSchedulesStddevSampFields = {
  __typename?: 'workSchedulesStddevSampFields';
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevSamp() on columns of table "work_schedule" */
export type WorkSchedulesStddevSampOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "workSchedules" */
export type WorkSchedulesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: WorkSchedulesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type WorkSchedulesStreamCursorValueInput = {
  /** Timestamp when the schedule entry was created */
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** Reference to the user this schedule belongs to */
  userId?: InputMaybe<Scalars['uuid']['input']>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay?: InputMaybe<Scalars['String']['input']>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate sum on columns */
export type WorkSchedulesSumFields = {
  __typename?: 'workSchedulesSumFields';
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "work_schedule" */
export type WorkSchedulesSumOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** update columns of table "work_schedule" */
export enum WorkSchedulesUpdateColumn {
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  updatedAt = 'updatedAt',
  /** column name */
  userId = 'userId',
  /** column name */
  workDay = 'workDay',
  /** column name */
  workHours = 'workHours'
}

export type WorkSchedulesUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<WorkSchedulesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<WorkSchedulesSetInput>;
  /** filter the rows which have to be updated */
  where: WorkSchedulesBoolExp;
};

/** aggregate varPop on columns */
export type WorkSchedulesVarPopFields = {
  __typename?: 'workSchedulesVarPopFields';
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['Float']['output']>;
};

/** order by varPop() on columns of table "work_schedule" */
export type WorkSchedulesVarPopOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** aggregate varSamp on columns */
export type WorkSchedulesVarSampFields = {
  __typename?: 'workSchedulesVarSampFields';
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['Float']['output']>;
};

/** order by varSamp() on columns of table "work_schedule" */
export type WorkSchedulesVarSampOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type WorkSchedulesVarianceFields = {
  __typename?: 'workSchedulesVarianceFields';
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "work_schedule" */
export type WorkSchedulesVarianceOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

export type AuditLogCoreFragment = { __typename?: 'auditLogs', id: string, userId?: string | null | undefined, eventTime: string, userEmail?: string | null | undefined, userRole?: string | null | undefined, action: string, resourceType: string, resourceId?: string | null | undefined, success?: boolean | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined };

export type AuditLogWithUserFragment = { __typename?: 'auditLogs', oldValues?: any | null | undefined, newValues?: any | null | undefined, errorMessage?: string | null | undefined, requestId?: string | null | undefined, id: string, userId?: string | null | undefined, eventTime: string, userEmail?: string | null | undefined, userRole?: string | null | undefined, action: string, resourceType: string, resourceId?: string | null | undefined, success?: boolean | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined };

export type DataAccessLogCoreFragment = { __typename?: 'dataAccessLogs', id: string, userId: string, accessedAt: string, resourceType: string, resourceId?: string | null | undefined, accessType: string, dataClassification?: string | null | undefined, fieldsAccessed?: Array<string> | null | undefined, queryExecuted?: string | null | undefined, rowCount?: number | null | undefined, ipAddress?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined };

export type AuthEventCoreFragment = { __typename?: 'authEvents', id: string, eventTime: string, eventType: string, userId?: string | null | undefined, userEmail?: string | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, success?: boolean | null | undefined, failureReason?: string | null | undefined, metadata?: any | null | undefined };

export type PermissionChangeCoreFragment = { __typename?: 'permissionChanges', id: string, changedAt: string, changedByUserId: string, targetUserId?: string | null | undefined, targetRoleId?: string | null | undefined, changeType: string, permissionType?: string | null | undefined, oldPermissions?: any | null | undefined, newPermissions?: any | null | undefined, reason?: string | null | undefined, approvedByUserId?: string | null | undefined, metadata?: any | null | undefined };

export type CreateAuditLogMutationVariables = Exact<{
  object: AuditLogsInsertInput;
}>;


export type CreateAuditLogMutation = { __typename?: 'mutation_root', insertAuditLog?: { __typename?: 'auditLogs', id: string, userId?: string | null | undefined, eventTime: string, userEmail?: string | null | undefined, userRole?: string | null | undefined, action: string, resourceType: string, resourceId?: string | null | undefined, success?: boolean | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined } | null | undefined };

export type CreateDataAccessLogMutationVariables = Exact<{
  object: DataAccessLogsInsertInput;
}>;


export type CreateDataAccessLogMutation = { __typename?: 'mutation_root', insertDataAccessLog?: { __typename?: 'dataAccessLogs', id: string, userId: string, accessedAt: string, resourceType: string, resourceId?: string | null | undefined, accessType: string, dataClassification?: string | null | undefined, fieldsAccessed?: Array<string> | null | undefined, queryExecuted?: string | null | undefined, rowCount?: number | null | undefined, ipAddress?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined } | null | undefined };

export type CreateAuthEventMutationVariables = Exact<{
  object: AuthEventsInsertInput;
}>;


export type CreateAuthEventMutation = { __typename?: 'mutation_root', insertAuthEvent?: { __typename?: 'authEvents', id: string, eventTime: string, eventType: string, userId?: string | null | undefined, userEmail?: string | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, success?: boolean | null | undefined, failureReason?: string | null | undefined, metadata?: any | null | undefined } | null | undefined };

export type CreatePermissionChangeMutationVariables = Exact<{
  object: PermissionChangesInsertInput;
}>;


export type CreatePermissionChangeMutation = { __typename?: 'mutation_root', insertPermissionChange?: { __typename?: 'permissionChanges', id: string, changedAt: string, changedByUserId: string, targetUserId?: string | null | undefined, targetRoleId?: string | null | undefined, changeType: string, permissionType?: string | null | undefined, oldPermissions?: any | null | undefined, newPermissions?: any | null | undefined, reason?: string | null | undefined, approvedByUserId?: string | null | undefined, metadata?: any | null | undefined } | null | undefined };

export type BulkCreateAuditLogsMutationVariables = Exact<{
  objects: Array<AuditLogsInsertInput> | AuditLogsInsertInput;
}>;


export type BulkCreateAuditLogsMutation = { __typename?: 'mutation_root', bulkInsertAuditLogs?: { __typename?: 'auditLogsMutationResponse', affectedRows: number, returning: Array<{ __typename?: 'auditLogs', id: string, userId?: string | null | undefined, eventTime: string, userEmail?: string | null | undefined, userRole?: string | null | undefined, action: string, resourceType: string, resourceId?: string | null | undefined, success?: boolean | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined }> } | null | undefined };

export type UpdateAuditLogMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  set: AuditLogsSetInput;
}>;


export type UpdateAuditLogMutation = { __typename?: 'mutation_root', updateAuditLogById?: { __typename?: 'auditLogs', oldValues?: any | null | undefined, newValues?: any | null | undefined, errorMessage?: string | null | undefined, requestId?: string | null | undefined, id: string, userId?: string | null | undefined, eventTime: string, userEmail?: string | null | undefined, userRole?: string | null | undefined, action: string, resourceType: string, resourceId?: string | null | undefined, success?: boolean | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined } | null | undefined };

export type CreateMultipleAuditLogsMutationVariables = Exact<{
  objects: Array<AuditLogsInsertInput> | AuditLogsInsertInput;
}>;


export type CreateMultipleAuditLogsMutation = { __typename?: 'mutation_root', bulkInsertAuditLogs?: { __typename?: 'auditLogsMutationResponse', affectedRows: number, returning: Array<{ __typename?: 'auditLogs', id: string, userId?: string | null | undefined, eventTime: string, userEmail?: string | null | undefined, userRole?: string | null | undefined, action: string, resourceType: string, resourceId?: string | null | undefined, success?: boolean | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined }> } | null | undefined };

export type CreateMultipleDataAccessLogsMutationVariables = Exact<{
  objects: Array<DataAccessLogsInsertInput> | DataAccessLogsInsertInput;
}>;


export type CreateMultipleDataAccessLogsMutation = { __typename?: 'mutation_root', bulkInsertDataAccessLogs?: { __typename?: 'dataAccessLogsMutationResponse', affectedRows: number, returning: Array<{ __typename?: 'dataAccessLogs', id: string, userId: string, accessedAt: string, resourceType: string, resourceId?: string | null | undefined, accessType: string, dataClassification?: string | null | undefined, fieldsAccessed?: Array<string> | null | undefined, queryExecuted?: string | null | undefined, rowCount?: number | null | undefined, ipAddress?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined }> } | null | undefined };

export type CleanAllPayrollDatesMutationVariables = Exact<{ [key: string]: never; }>;


export type CleanAllPayrollDatesMutation = { __typename?: 'mutation_root', bulkDeletePayrollDates?: { __typename?: 'payrollDatesMutationResponse', affectedRows: number } | null | undefined, bulkUpdatePayrolls?: { __typename?: 'payrollsMutationResponse', affectedRows: number } | null | undefined };

export type LogAuditEventMutationVariables = Exact<{
  object: AuditLogsInsertInput;
}>;


export type LogAuditEventMutation = { __typename?: 'mutation_root', insertAuditLog?: { __typename?: 'auditLogs', id: string, eventTime: string } | null | undefined };

export type LogAuthEventMutationVariables = Exact<{
  object: AuthEventsInsertInput;
}>;


export type LogAuthEventMutation = { __typename?: 'mutation_root', insertAuthEvent?: { __typename?: 'authEvents', id: string, eventTime: string } | null | undefined };

export type LogSoc2ComplianceEventMutationVariables = Exact<{
  event: AuditEventInput;
}>;


export type LogSoc2ComplianceEventMutation = { __typename?: 'mutation_root', logAuditEvent?: { __typename?: 'AuditEventResponse', success: boolean, message?: string | null | undefined } | null | undefined };

export type GetAuditLogsQueryVariables = Exact<{
  where?: InputMaybe<AuditLogsBoolExp>;
  orderBy?: InputMaybe<Array<AuditLogsOrderBy> | AuditLogsOrderBy>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAuditLogsQuery = { __typename?: 'query_root', auditLogs: Array<{ __typename?: 'auditLogs', oldValues?: any | null | undefined, newValues?: any | null | undefined, errorMessage?: string | null | undefined, requestId?: string | null | undefined, id: string, userId?: string | null | undefined, eventTime: string, userEmail?: string | null | undefined, userRole?: string | null | undefined, action: string, resourceType: string, resourceId?: string | null | undefined, success?: boolean | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined }>, auditLogsAggregate: { __typename?: 'auditLogsAggregate', aggregate?: { __typename?: 'auditLogsAggregateFields', count: number } | null | undefined } };

export type GetAuditLogsByEntityQueryVariables = Exact<{
  entityType: Scalars['String']['input'];
  entityId: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAuditLogsByEntityQuery = { __typename?: 'query_root', auditLogs: Array<{ __typename?: 'auditLogs', oldValues?: any | null | undefined, newValues?: any | null | undefined, errorMessage?: string | null | undefined, requestId?: string | null | undefined, id: string, userId?: string | null | undefined, eventTime: string, userEmail?: string | null | undefined, userRole?: string | null | undefined, action: string, resourceType: string, resourceId?: string | null | undefined, success?: boolean | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined }> };

export type GetAuditLogsByUserQueryVariables = Exact<{
  userId: Scalars['uuid']['input'];
  startDate?: InputMaybe<Scalars['timestamptz']['input']>;
  endDate?: InputMaybe<Scalars['timestamptz']['input']>;
}>;


export type GetAuditLogsByUserQuery = { __typename?: 'query_root', auditLogs: Array<{ __typename?: 'auditLogs', id: string, userId?: string | null | undefined, eventTime: string, userEmail?: string | null | undefined, userRole?: string | null | undefined, action: string, resourceType: string, resourceId?: string | null | undefined, success?: boolean | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined }> };

export type GetFailedAuditLogsQueryVariables = Exact<{
  startDate: Scalars['timestamptz']['input'];
  endDate: Scalars['timestamptz']['input'];
}>;


export type GetFailedAuditLogsQuery = { __typename?: 'query_root', auditLogs: Array<{ __typename?: 'auditLogs', oldValues?: any | null | undefined, newValues?: any | null | undefined, errorMessage?: string | null | undefined, requestId?: string | null | undefined, id: string, userId?: string | null | undefined, eventTime: string, userEmail?: string | null | undefined, userRole?: string | null | undefined, action: string, resourceType: string, resourceId?: string | null | undefined, success?: boolean | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined }> };

export type GetDataAccessLogsQueryVariables = Exact<{
  where?: InputMaybe<DataAccessLogsBoolExp>;
  orderBy?: InputMaybe<Array<DataAccessLogsOrderBy> | DataAccessLogsOrderBy>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetDataAccessLogsQuery = { __typename?: 'query_root', dataAccessLogs: Array<{ __typename?: 'dataAccessLogs', id: string, userId: string, accessedAt: string, resourceType: string, resourceId?: string | null | undefined, accessType: string, dataClassification?: string | null | undefined, fieldsAccessed?: Array<string> | null | undefined, queryExecuted?: string | null | undefined, rowCount?: number | null | undefined, ipAddress?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined }>, dataAccessLogsAggregate: { __typename?: 'dataAccessLogsAggregate', aggregate?: { __typename?: 'dataAccessLogsAggregateFields', count: number, sum?: { __typename?: 'dataAccessLogsSumFields', rowCount?: number | null | undefined } | null | undefined } | null | undefined } };

export type GetDataExportsQueryVariables = Exact<{
  startDate: Scalars['timestamptz']['input'];
  endDate: Scalars['timestamptz']['input'];
}>;


export type GetDataExportsQuery = { __typename?: 'query_root', dataAccessLogs: Array<{ __typename?: 'dataAccessLogs', id: string, userId: string, accessedAt: string, resourceType: string, resourceId?: string | null | undefined, accessType: string, dataClassification?: string | null | undefined, fieldsAccessed?: Array<string> | null | undefined, queryExecuted?: string | null | undefined, rowCount?: number | null | undefined, ipAddress?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined }> };

export type GetAuthEventsQueryVariables = Exact<{
  where?: InputMaybe<AuthEventsBoolExp>;
  orderBy?: InputMaybe<Array<AuthEventsOrderBy> | AuthEventsOrderBy>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAuthEventsQuery = { __typename?: 'query_root', authEvents: Array<{ __typename?: 'authEvents', id: string, eventTime: string, eventType: string, userId?: string | null | undefined, userEmail?: string | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, success?: boolean | null | undefined, failureReason?: string | null | undefined, metadata?: any | null | undefined }> };

export type GetFailedAuthEventsQueryVariables = Exact<{
  startDate: Scalars['timestamptz']['input'];
  endDate: Scalars['timestamptz']['input'];
}>;


export type GetFailedAuthEventsQuery = { __typename?: 'query_root', authEvents: Array<{ __typename?: 'authEvents', id: string, eventTime: string, eventType: string, userId?: string | null | undefined, userEmail?: string | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, success?: boolean | null | undefined, failureReason?: string | null | undefined, metadata?: any | null | undefined }> };

export type GetPermissionChangesQueryVariables = Exact<{
  where?: InputMaybe<PermissionChangesBoolExp>;
  orderBy?: InputMaybe<Array<PermissionChangesOrderBy> | PermissionChangesOrderBy>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetPermissionChangesQuery = { __typename?: 'query_root', permissionChanges: Array<{ __typename?: 'permissionChanges', id: string, changedAt: string, changedByUserId: string, targetUserId?: string | null | undefined, targetRoleId?: string | null | undefined, changeType: string, permissionType?: string | null | undefined, oldPermissions?: any | null | undefined, newPermissions?: any | null | undefined, reason?: string | null | undefined, approvedByUserId?: string | null | undefined, metadata?: any | null | undefined }> };

export type SecurityOverviewQueryVariables = Exact<{
  twentyFourHoursAgo: Scalars['timestamptz']['input'];
  sevenDaysAgo: Scalars['timestamptz']['input'];
}>;


export type SecurityOverviewQuery = { __typename?: 'query_root', recentAuditLogs: Array<{ __typename?: 'auditLogs', id: string, eventTime: string, action: string, resourceType: string, success?: boolean | null | undefined }>, auditLogCount: { __typename?: 'auditLogsAggregate', aggregate?: { __typename?: 'auditLogsAggregateFields', count: number } | null | undefined }, failedOperations: Array<{ __typename?: 'auditLogs', id: string, eventTime: string, action: string, resourceType: string }>, authEventsSummary: Array<{ __typename?: 'authEvents', id: string, eventTime: string, eventType: string, success?: boolean | null | undefined, failureReason?: string | null | undefined }> };

export type SecurityOverviewWithDataAccessQueryVariables = Exact<{
  twentyFourHoursAgo: Scalars['timestamptz']['input'];
  sevenDaysAgo: Scalars['timestamptz']['input'];
}>;


export type SecurityOverviewWithDataAccessQuery = { __typename?: 'query_root', recentAuditLogs: Array<{ __typename?: 'auditLogs', id: string, eventTime: string, action: string, resourceType: string, success?: boolean | null | undefined }>, auditLogCount: { __typename?: 'auditLogsAggregate', aggregate?: { __typename?: 'auditLogsAggregateFields', count: number } | null | undefined }, failedOperations: Array<{ __typename?: 'auditLogs', id: string, eventTime: string, action: string, resourceType: string }>, dataAccessSummary: Array<{ __typename?: 'dataAccessLogs', id: string, accessedAt: string, resourceType: string, accessType: string, dataClassification?: string | null | undefined, rowCount?: number | null | undefined }>, authEventsSummary: Array<{ __typename?: 'authEvents', id: string, eventTime: string, eventType: string, success?: boolean | null | undefined, failureReason?: string | null | undefined }> };

export type ComplianceReportQueryVariables = Exact<{
  startDate: Scalars['timestamptz']['input'];
  endDate: Scalars['timestamptz']['input'];
}>;


export type ComplianceReportQuery = { __typename?: 'query_root', auditMetrics: { __typename?: 'auditLogsAggregate', aggregate?: { __typename?: 'auditLogsAggregateFields', count: number } | null | undefined, nodes: Array<{ __typename?: 'auditLogs', success?: boolean | null | undefined, action: string }> }, failedByType: Array<{ __typename?: 'auditLogs', action: string, errorMessage?: string | null | undefined }>, dataAccessStats: { __typename?: 'dataAccessLogsAggregate', aggregate?: { __typename?: 'dataAccessLogsAggregateFields', count: number, sum?: { __typename?: 'dataAccessLogsSumFields', rowCount?: number | null | undefined } | null | undefined } | null | undefined, nodes: Array<{ __typename?: 'dataAccessLogs', dataClassification?: string | null | undefined }> }, userActivity: Array<{ __typename?: 'auditLogs', userId?: string | null | undefined, eventTime: string, action: string }> };

export type GetAuditAnalyticsQueryVariables = Exact<{
  startDate: Scalars['timestamptz']['input'];
  endDate: Scalars['timestamptz']['input'];
}>;


export type GetAuditAnalyticsQuery = { __typename?: 'query_root', auditSummary: { __typename?: 'auditLogsAggregate', aggregate?: { __typename?: 'auditLogsAggregateFields', count: number } | null | undefined }, failedByType: Array<{ __typename?: 'auditLogs', action: string, resourceType: string, errorMessage?: string | null | undefined }>, dataAccessStats: { __typename?: 'dataAccessLogsAggregate', aggregate?: { __typename?: 'dataAccessLogsAggregateFields', count: number, sum?: { __typename?: 'dataAccessLogsSumFields', rowCount?: number | null | undefined } | null | undefined } | null | undefined }, userActivity: Array<{ __typename?: 'auditLogs', userId?: string | null | undefined, action: string, eventTime: string }> };

export type ComplianceAuditLogsQueryVariables = Exact<{
  startDate: Scalars['timestamptz']['input'];
  endDate: Scalars['timestamptz']['input'];
}>;


export type ComplianceAuditLogsQuery = { __typename?: 'query_root', auditLogs: Array<{ __typename?: 'auditLogs', id: string, eventTime: string, userId?: string | null | undefined, action: string, resourceType: string, resourceId?: string | null | undefined, success?: boolean | null | undefined, metadata?: any | null | undefined }>, auditLogsAggregate: { __typename?: 'auditLogsAggregate', aggregate?: { __typename?: 'auditLogsAggregateFields', count: number } | null | undefined } };

export type AuditLogQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  where?: InputMaybe<AuditLogsBoolExp>;
  orderBy?: InputMaybe<Array<AuditLogsOrderBy> | AuditLogsOrderBy>;
}>;


export type AuditLogQuery = { __typename?: 'query_root', auditLogs: Array<{ __typename?: 'auditLogs', id: string, userId?: string | null | undefined, userEmail?: string | null | undefined, userRole?: string | null | undefined, action: string, resourceType: string, resourceId?: string | null | undefined, success?: boolean | null | undefined, errorMessage?: string | null | undefined, ipAddress?: string | null | undefined, eventTime: string }>, auditLogsAggregate: { __typename?: 'auditLogsAggregate', aggregate?: { __typename?: 'auditLogsAggregateFields', count: number } | null | undefined } };

export type SubscribeToAuditLogsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToAuditLogsSubscription = { __typename?: 'subscription_root', auditLogs: Array<{ __typename?: 'auditLogs', oldValues?: any | null | undefined, newValues?: any | null | undefined, errorMessage?: string | null | undefined, requestId?: string | null | undefined, id: string, userId?: string | null | undefined, eventTime: string, userEmail?: string | null | undefined, userRole?: string | null | undefined, action: string, resourceType: string, resourceId?: string | null | undefined, success?: boolean | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined }> };

export type SubscribeToFailedOperationsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToFailedOperationsSubscription = { __typename?: 'subscription_root', auditLogs: Array<{ __typename?: 'auditLogs', id: string, userId?: string | null | undefined, eventTime: string, userEmail?: string | null | undefined, userRole?: string | null | undefined, action: string, resourceType: string, resourceId?: string | null | undefined, success?: boolean | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined }> };

export type SubscribeToUserAuditActivitySubscriptionVariables = Exact<{
  user_id: Scalars['uuid']['input'];
}>;


export type SubscribeToUserAuditActivitySubscription = { __typename?: 'subscription_root', auditLogs: Array<{ __typename?: 'auditLogs', id: string, userId?: string | null | undefined, eventTime: string, userEmail?: string | null | undefined, userRole?: string | null | undefined, action: string, resourceType: string, resourceId?: string | null | undefined, success?: boolean | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined }> };

export type SubscribeToDataAccessLogsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeToDataAccessLogsSubscription = { __typename?: 'subscription_root', dataAccessLogs: Array<{ __typename?: 'dataAccessLogs', id: string, userId: string, accessedAt: string, resourceType: string, resourceId?: string | null | undefined, accessType: string, dataClassification?: string | null | undefined, fieldsAccessed?: Array<string> | null | undefined, queryExecuted?: string | null | undefined, rowCount?: number | null | undefined, ipAddress?: string | null | undefined, sessionId?: string | null | undefined, metadata?: any | null | undefined }> };

export type SecurityEventsStreamSubscriptionVariables = Exact<{
  twentyFourHoursAgo: Scalars['timestamptz']['input'];
}>;


export type SecurityEventsStreamSubscription = { __typename?: 'subscription_root', auditLogs: Array<{ __typename?: 'auditLogs', id: string, eventTime: string, action: string, resourceType: string, success?: boolean | null | undefined }> };

export type FailedOperationsStreamSubscriptionVariables = Exact<{
  twentyFourHoursAgo: Scalars['timestamptz']['input'];
}>;


export type FailedOperationsStreamSubscription = { __typename?: 'subscription_root', auditLogs: Array<{ __typename?: 'auditLogs', id: string, eventTime: string, action: string, resourceType: string }> };

export type CriticalDataAccessStreamSubscriptionVariables = Exact<{
  sevenDaysAgo: Scalars['timestamptz']['input'];
}>;


export type CriticalDataAccessStreamSubscription = { __typename?: 'subscription_root', dataAccessLogs: Array<{ __typename?: 'dataAccessLogs', id: string, accessedAt: string, resourceType: string, accessType: string, dataClassification?: string | null | undefined, rowCount?: number | null | undefined }> };

export type UserCoreFragment = { __typename?: 'users', id: string, name: string, email: string, username?: string | null | undefined, role: string, isActive?: boolean | null | undefined, isStaff?: boolean | null | undefined, clerkUserId?: string | null | undefined, createdAt?: string | null | undefined, updatedAt?: string | null | undefined };

export type UserBasicFragment = { __typename?: 'users', id: string, name: string, email: string, role: string, isActive?: boolean | null | undefined };

export type UserWithManagerFragment = { __typename?: 'users', managerId?: string | null | undefined, id: string, name: string, email: string, username?: string | null | undefined, role: string, isActive?: boolean | null | undefined, isStaff?: boolean | null | undefined, clerkUserId?: string | null | undefined, createdAt?: string | null | undefined, updatedAt?: string | null | undefined, managerUser?: { __typename?: 'users', id: string, name: string, email: string, role: string, isActive?: boolean | null | undefined } | null | undefined };

export type RoleCoreFragment = { __typename?: 'roles', id: string, name: string, description?: string | null | undefined, displayName: string, priority: number, isSystemRole: boolean, createdAt: string };

export type PermissionCoreFragment = { __typename?: 'permissions', id: string, action: string, description?: string | null | undefined, resourceId: string, createdAt: string, updatedAt: string };

export type PermissionWithResourceFragment = { __typename?: 'permissions', id: string, action: string, description?: string | null | undefined, resourceId: string, createdAt: string, updatedAt: string, relatedResource: { __typename?: 'resources', id: string, name: string, description?: string | null | undefined } };

export type ClientCoreFragment = { __typename?: 'clients', id: string, name: string, contactEmail?: string | null | undefined, contactPerson?: string | null | undefined, contactPhone?: string | null | undefined, active?: boolean | null | undefined, createdAt?: string | null | undefined, updatedAt?: string | null | undefined };

export type ClientBasicFragment = { __typename?: 'clients', id: string, name: string, active?: boolean | null | undefined };

export type ResourceCoreFragment = { __typename?: 'resources', id: string, name: string, displayName: string, description?: string | null | undefined, createdAt: string, updatedAt: string };

export type UserRoleCoreFragment = { __typename?: 'userRoles', id: string, userId: string, roleId: string, createdAt: string, updatedAt: string };

export type RolePermissionCoreFragment = { __typename?: 'rolePermissions', id: string, roleId: string, permissionId: string, conditions?: any | null | undefined, createdAt: string, updatedAt: string };

export type AuditFieldsFragment = { __typename?: 'auditLogs', id: string, eventTime: string, action: string, resourceType: string, resourceId?: string | null | undefined, userId?: string | null | undefined, ipAddress?: string | null | undefined, userAgent?: string | null | undefined, success?: boolean | null | undefined, userEmail?: string | null | undefined, userRole?: string | null | undefined };

export const AuditLogCoreFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;
export const AuditLogWithUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogWithUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogCore"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;
export const DataAccessLogCoreFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataAccessLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"dataAccessLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}},{"kind":"Field","name":{"kind":"Name","value":"fieldsAccessed"}},{"kind":"Field","name":{"kind":"Name","value":"queryExecuted"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;
export const AuthEventCoreFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthEventCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"authEvents"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;
export const PermissionChangeCoreFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionChangeCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"permissionChanges"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"changeType"}},{"kind":"Field","name":{"kind":"Name","value":"permissionType"}},{"kind":"Field","name":{"kind":"Name","value":"oldPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"newPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;
export const UserCoreFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isStaff"}},{"kind":"Field","name":{"kind":"Name","value":"clerkUserId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode;
export const UserBasicFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]} as unknown as DocumentNode;
export const UserWithManagerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserWithManager"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCore"}},{"kind":"Field","name":{"kind":"Name","value":"managerId"}},{"kind":"Field","name":{"kind":"Name","value":"managerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isStaff"}},{"kind":"Field","name":{"kind":"Name","value":"clerkUserId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]} as unknown as DocumentNode;
export const RoleCoreFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"roles"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"isSystemRole"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode;
export const PermissionCoreFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"permissions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode;
export const PermissionWithResourceFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionWithResource"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"permissions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PermissionCore"}},{"kind":"Field","name":{"kind":"Name","value":"relatedResource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"permissions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode;
export const ClientCoreFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"contactPerson"}},{"kind":"Field","name":{"kind":"Name","value":"contactPhone"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode;
export const ClientBasicFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]} as unknown as DocumentNode;
export const ResourceCoreFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResourceCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"resources"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode;
export const UserRoleCoreFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserRoleCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"userRoles"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode;
export const RolePermissionCoreFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RolePermissionCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"rolePermissions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"permissionId"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode;
export const AuditFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}}]}}]} as unknown as DocumentNode;
export const CreateAuditLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAuditLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"object"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogsInsertInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"object"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogCore"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;
export type CreateAuditLogMutationFn = Apollo.MutationFunction<CreateAuditLogMutation, CreateAuditLogMutationVariables>;

/**
 * __useCreateAuditLogMutation__
 *
 * To run a mutation, you first call `useCreateAuditLogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAuditLogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAuditLogMutation, { data, loading, error }] = useCreateAuditLogMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useCreateAuditLogMutation(baseOptions?: Apollo.MutationHookOptions<CreateAuditLogMutation, CreateAuditLogMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAuditLogMutation, CreateAuditLogMutationVariables>(CreateAuditLogDocument, options);
      }
export type CreateAuditLogMutationHookResult = ReturnType<typeof useCreateAuditLogMutation>;
export type CreateAuditLogMutationResult = Apollo.MutationResult<CreateAuditLogMutation>;
export type CreateAuditLogMutationOptions = Apollo.BaseMutationOptions<CreateAuditLogMutation, CreateAuditLogMutationVariables>;
export const CreateDataAccessLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDataAccessLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"object"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"dataAccessLogsInsertInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertDataAccessLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"object"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DataAccessLogCore"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataAccessLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"dataAccessLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}},{"kind":"Field","name":{"kind":"Name","value":"fieldsAccessed"}},{"kind":"Field","name":{"kind":"Name","value":"queryExecuted"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;
export type CreateDataAccessLogMutationFn = Apollo.MutationFunction<CreateDataAccessLogMutation, CreateDataAccessLogMutationVariables>;

/**
 * __useCreateDataAccessLogMutation__
 *
 * To run a mutation, you first call `useCreateDataAccessLogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDataAccessLogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDataAccessLogMutation, { data, loading, error }] = useCreateDataAccessLogMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useCreateDataAccessLogMutation(baseOptions?: Apollo.MutationHookOptions<CreateDataAccessLogMutation, CreateDataAccessLogMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDataAccessLogMutation, CreateDataAccessLogMutationVariables>(CreateDataAccessLogDocument, options);
      }
export type CreateDataAccessLogMutationHookResult = ReturnType<typeof useCreateDataAccessLogMutation>;
export type CreateDataAccessLogMutationResult = Apollo.MutationResult<CreateDataAccessLogMutation>;
export type CreateDataAccessLogMutationOptions = Apollo.BaseMutationOptions<CreateDataAccessLogMutation, CreateDataAccessLogMutationVariables>;
export const CreateAuthEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAuthEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"object"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"authEventsInsertInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertAuthEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"object"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthEventCore"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthEventCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"authEvents"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;
export type CreateAuthEventMutationFn = Apollo.MutationFunction<CreateAuthEventMutation, CreateAuthEventMutationVariables>;

/**
 * __useCreateAuthEventMutation__
 *
 * To run a mutation, you first call `useCreateAuthEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAuthEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAuthEventMutation, { data, loading, error }] = useCreateAuthEventMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useCreateAuthEventMutation(baseOptions?: Apollo.MutationHookOptions<CreateAuthEventMutation, CreateAuthEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAuthEventMutation, CreateAuthEventMutationVariables>(CreateAuthEventDocument, options);
      }
export type CreateAuthEventMutationHookResult = ReturnType<typeof useCreateAuthEventMutation>;
export type CreateAuthEventMutationResult = Apollo.MutationResult<CreateAuthEventMutation>;
export type CreateAuthEventMutationOptions = Apollo.BaseMutationOptions<CreateAuthEventMutation, CreateAuthEventMutationVariables>;
export const CreatePermissionChangeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePermissionChange"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"object"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"permissionChangesInsertInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertPermissionChange"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"object"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PermissionChangeCore"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionChangeCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"permissionChanges"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"changeType"}},{"kind":"Field","name":{"kind":"Name","value":"permissionType"}},{"kind":"Field","name":{"kind":"Name","value":"oldPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"newPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;
export type CreatePermissionChangeMutationFn = Apollo.MutationFunction<CreatePermissionChangeMutation, CreatePermissionChangeMutationVariables>;

/**
 * __useCreatePermissionChangeMutation__
 *
 * To run a mutation, you first call `useCreatePermissionChangeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePermissionChangeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPermissionChangeMutation, { data, loading, error }] = useCreatePermissionChangeMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useCreatePermissionChangeMutation(baseOptions?: Apollo.MutationHookOptions<CreatePermissionChangeMutation, CreatePermissionChangeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePermissionChangeMutation, CreatePermissionChangeMutationVariables>(CreatePermissionChangeDocument, options);
      }
export type CreatePermissionChangeMutationHookResult = ReturnType<typeof useCreatePermissionChangeMutation>;
export type CreatePermissionChangeMutationResult = Apollo.MutationResult<CreatePermissionChangeMutation>;
export type CreatePermissionChangeMutationOptions = Apollo.BaseMutationOptions<CreatePermissionChangeMutation, CreatePermissionChangeMutationVariables>;
export const BulkCreateAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkCreateAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objects"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogsInsertInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkInsertAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objects"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogCore"}}]}},{"kind":"Field","name":{"kind":"Name","value":"affectedRows"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;
export type BulkCreateAuditLogsMutationFn = Apollo.MutationFunction<BulkCreateAuditLogsMutation, BulkCreateAuditLogsMutationVariables>;

/**
 * __useBulkCreateAuditLogsMutation__
 *
 * To run a mutation, you first call `useBulkCreateAuditLogsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkCreateAuditLogsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkCreateAuditLogsMutation, { data, loading, error }] = useBulkCreateAuditLogsMutation({
 *   variables: {
 *      objects: // value for 'objects'
 *   },
 * });
 */
export function useBulkCreateAuditLogsMutation(baseOptions?: Apollo.MutationHookOptions<BulkCreateAuditLogsMutation, BulkCreateAuditLogsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkCreateAuditLogsMutation, BulkCreateAuditLogsMutationVariables>(BulkCreateAuditLogsDocument, options);
      }
export type BulkCreateAuditLogsMutationHookResult = ReturnType<typeof useBulkCreateAuditLogsMutation>;
export type BulkCreateAuditLogsMutationResult = Apollo.MutationResult<BulkCreateAuditLogsMutation>;
export type BulkCreateAuditLogsMutationOptions = Apollo.BaseMutationOptions<BulkCreateAuditLogsMutation, BulkCreateAuditLogsMutationVariables>;
export const UpdateAuditLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAuditLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"set"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogsSetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAuditLogById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pkColumns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"set"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogWithUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogWithUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogCore"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}}]}}]} as unknown as DocumentNode;
export type UpdateAuditLogMutationFn = Apollo.MutationFunction<UpdateAuditLogMutation, UpdateAuditLogMutationVariables>;

/**
 * __useUpdateAuditLogMutation__
 *
 * To run a mutation, you first call `useUpdateAuditLogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAuditLogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAuditLogMutation, { data, loading, error }] = useUpdateAuditLogMutation({
 *   variables: {
 *      id: // value for 'id'
 *      set: // value for 'set'
 *   },
 * });
 */
export function useUpdateAuditLogMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAuditLogMutation, UpdateAuditLogMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAuditLogMutation, UpdateAuditLogMutationVariables>(UpdateAuditLogDocument, options);
      }
export type UpdateAuditLogMutationHookResult = ReturnType<typeof useUpdateAuditLogMutation>;
export type UpdateAuditLogMutationResult = Apollo.MutationResult<UpdateAuditLogMutation>;
export type UpdateAuditLogMutationOptions = Apollo.BaseMutationOptions<UpdateAuditLogMutation, UpdateAuditLogMutationVariables>;
export const CreateMultipleAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMultipleAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objects"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogsInsertInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkInsertAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objects"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogCore"}}]}},{"kind":"Field","name":{"kind":"Name","value":"affectedRows"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;
export type CreateMultipleAuditLogsMutationFn = Apollo.MutationFunction<CreateMultipleAuditLogsMutation, CreateMultipleAuditLogsMutationVariables>;

/**
 * __useCreateMultipleAuditLogsMutation__
 *
 * To run a mutation, you first call `useCreateMultipleAuditLogsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMultipleAuditLogsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMultipleAuditLogsMutation, { data, loading, error }] = useCreateMultipleAuditLogsMutation({
 *   variables: {
 *      objects: // value for 'objects'
 *   },
 * });
 */
export function useCreateMultipleAuditLogsMutation(baseOptions?: Apollo.MutationHookOptions<CreateMultipleAuditLogsMutation, CreateMultipleAuditLogsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMultipleAuditLogsMutation, CreateMultipleAuditLogsMutationVariables>(CreateMultipleAuditLogsDocument, options);
      }
export type CreateMultipleAuditLogsMutationHookResult = ReturnType<typeof useCreateMultipleAuditLogsMutation>;
export type CreateMultipleAuditLogsMutationResult = Apollo.MutationResult<CreateMultipleAuditLogsMutation>;
export type CreateMultipleAuditLogsMutationOptions = Apollo.BaseMutationOptions<CreateMultipleAuditLogsMutation, CreateMultipleAuditLogsMutationVariables>;
export const CreateMultipleDataAccessLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMultipleDataAccessLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objects"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"dataAccessLogsInsertInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkInsertDataAccessLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objects"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DataAccessLogCore"}}]}},{"kind":"Field","name":{"kind":"Name","value":"affectedRows"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataAccessLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"dataAccessLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}},{"kind":"Field","name":{"kind":"Name","value":"fieldsAccessed"}},{"kind":"Field","name":{"kind":"Name","value":"queryExecuted"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;
export type CreateMultipleDataAccessLogsMutationFn = Apollo.MutationFunction<CreateMultipleDataAccessLogsMutation, CreateMultipleDataAccessLogsMutationVariables>;

/**
 * __useCreateMultipleDataAccessLogsMutation__
 *
 * To run a mutation, you first call `useCreateMultipleDataAccessLogsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMultipleDataAccessLogsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMultipleDataAccessLogsMutation, { data, loading, error }] = useCreateMultipleDataAccessLogsMutation({
 *   variables: {
 *      objects: // value for 'objects'
 *   },
 * });
 */
export function useCreateMultipleDataAccessLogsMutation(baseOptions?: Apollo.MutationHookOptions<CreateMultipleDataAccessLogsMutation, CreateMultipleDataAccessLogsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMultipleDataAccessLogsMutation, CreateMultipleDataAccessLogsMutationVariables>(CreateMultipleDataAccessLogsDocument, options);
      }
export type CreateMultipleDataAccessLogsMutationHookResult = ReturnType<typeof useCreateMultipleDataAccessLogsMutation>;
export type CreateMultipleDataAccessLogsMutationResult = Apollo.MutationResult<CreateMultipleDataAccessLogsMutation>;
export type CreateMultipleDataAccessLogsMutationOptions = Apollo.BaseMutationOptions<CreateMultipleDataAccessLogsMutation, CreateMultipleDataAccessLogsMutationVariables>;
export const CleanAllPayrollDatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CleanAllPayrollDates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkDeletePayrollDates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affectedRows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bulkUpdatePayrolls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"versionNumber"},"value":{"kind":"IntValue","value":"1"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affectedRows"}}]}}]}}]} as unknown as DocumentNode;
export type CleanAllPayrollDatesMutationFn = Apollo.MutationFunction<CleanAllPayrollDatesMutation, CleanAllPayrollDatesMutationVariables>;

/**
 * __useCleanAllPayrollDatesMutation__
 *
 * To run a mutation, you first call `useCleanAllPayrollDatesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCleanAllPayrollDatesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cleanAllPayrollDatesMutation, { data, loading, error }] = useCleanAllPayrollDatesMutation({
 *   variables: {
 *   },
 * });
 */
export function useCleanAllPayrollDatesMutation(baseOptions?: Apollo.MutationHookOptions<CleanAllPayrollDatesMutation, CleanAllPayrollDatesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CleanAllPayrollDatesMutation, CleanAllPayrollDatesMutationVariables>(CleanAllPayrollDatesDocument, options);
      }
export type CleanAllPayrollDatesMutationHookResult = ReturnType<typeof useCleanAllPayrollDatesMutation>;
export type CleanAllPayrollDatesMutationResult = Apollo.MutationResult<CleanAllPayrollDatesMutation>;
export type CleanAllPayrollDatesMutationOptions = Apollo.BaseMutationOptions<CleanAllPayrollDatesMutation, CleanAllPayrollDatesMutationVariables>;
export const LogAuditEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogAuditEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"object"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogsInsertInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"object"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}}]}}]}}]} as unknown as DocumentNode;
export type LogAuditEventMutationFn = Apollo.MutationFunction<LogAuditEventMutation, LogAuditEventMutationVariables>;

/**
 * __useLogAuditEventMutation__
 *
 * To run a mutation, you first call `useLogAuditEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogAuditEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logAuditEventMutation, { data, loading, error }] = useLogAuditEventMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useLogAuditEventMutation(baseOptions?: Apollo.MutationHookOptions<LogAuditEventMutation, LogAuditEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogAuditEventMutation, LogAuditEventMutationVariables>(LogAuditEventDocument, options);
      }
export type LogAuditEventMutationHookResult = ReturnType<typeof useLogAuditEventMutation>;
export type LogAuditEventMutationResult = Apollo.MutationResult<LogAuditEventMutation>;
export type LogAuditEventMutationOptions = Apollo.BaseMutationOptions<LogAuditEventMutation, LogAuditEventMutationVariables>;
export const LogAuthEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogAuthEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"object"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"authEventsInsertInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertAuthEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"object"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}}]}}]}}]} as unknown as DocumentNode;
export type LogAuthEventMutationFn = Apollo.MutationFunction<LogAuthEventMutation, LogAuthEventMutationVariables>;

/**
 * __useLogAuthEventMutation__
 *
 * To run a mutation, you first call `useLogAuthEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogAuthEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logAuthEventMutation, { data, loading, error }] = useLogAuthEventMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useLogAuthEventMutation(baseOptions?: Apollo.MutationHookOptions<LogAuthEventMutation, LogAuthEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogAuthEventMutation, LogAuthEventMutationVariables>(LogAuthEventDocument, options);
      }
export type LogAuthEventMutationHookResult = ReturnType<typeof useLogAuthEventMutation>;
export type LogAuthEventMutationResult = Apollo.MutationResult<LogAuthEventMutation>;
export type LogAuthEventMutationOptions = Apollo.BaseMutationOptions<LogAuthEventMutation, LogAuthEventMutationVariables>;
export const LogSoc2ComplianceEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogSOC2ComplianceEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"event"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuditEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logAuditEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"event"},"value":{"kind":"Variable","name":{"kind":"Name","value":"event"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode;
export type LogSoc2ComplianceEventMutationFn = Apollo.MutationFunction<LogSoc2ComplianceEventMutation, LogSoc2ComplianceEventMutationVariables>;

/**
 * __useLogSoc2ComplianceEventMutation__
 *
 * To run a mutation, you first call `useLogSoc2ComplianceEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogSoc2ComplianceEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logSoc2ComplianceEventMutation, { data, loading, error }] = useLogSoc2ComplianceEventMutation({
 *   variables: {
 *      event: // value for 'event'
 *   },
 * });
 */
export function useLogSoc2ComplianceEventMutation(baseOptions?: Apollo.MutationHookOptions<LogSoc2ComplianceEventMutation, LogSoc2ComplianceEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogSoc2ComplianceEventMutation, LogSoc2ComplianceEventMutationVariables>(LogSoc2ComplianceEventDocument, options);
      }
export type LogSoc2ComplianceEventMutationHookResult = ReturnType<typeof useLogSoc2ComplianceEventMutation>;
export type LogSoc2ComplianceEventMutationResult = Apollo.MutationResult<LogSoc2ComplianceEventMutation>;
export type LogSoc2ComplianceEventMutationOptions = Apollo.BaseMutationOptions<LogSoc2ComplianceEventMutation, LogSoc2ComplianceEventMutationVariables>;
export const GetAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogsBoolExp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogsOrderBy"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogWithUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"auditLogsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogWithUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogCore"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}}]}}]} as unknown as DocumentNode;

/**
 * __useGetAuditLogsQuery__
 *
 * To run a query within a React component, call `useGetAuditLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuditLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuditLogsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetAuditLogsQuery(baseOptions?: Apollo.QueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAuditLogsQuery, GetAuditLogsQueryVariables>(GetAuditLogsDocument, options);
      }
export function useGetAuditLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAuditLogsQuery, GetAuditLogsQueryVariables>(GetAuditLogsDocument, options);
        }
export function useGetAuditLogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAuditLogsQuery, GetAuditLogsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAuditLogsQuery, GetAuditLogsQueryVariables>(GetAuditLogsDocument, options);
        }
export type GetAuditLogsQueryHookResult = ReturnType<typeof useGetAuditLogsQuery>;
export type GetAuditLogsLazyQueryHookResult = ReturnType<typeof useGetAuditLogsLazyQuery>;
export type GetAuditLogsSuspenseQueryHookResult = ReturnType<typeof useGetAuditLogsSuspenseQuery>;
export type GetAuditLogsQueryResult = Apollo.QueryResult<GetAuditLogsQuery, GetAuditLogsQueryVariables>;
export const GetAuditLogsByEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditLogsByEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"resourceId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogWithUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogWithUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogCore"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}}]}}]} as unknown as DocumentNode;

/**
 * __useGetAuditLogsByEntityQuery__
 *
 * To run a query within a React component, call `useGetAuditLogsByEntityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuditLogsByEntityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuditLogsByEntityQuery({
 *   variables: {
 *      entityType: // value for 'entityType'
 *      entityId: // value for 'entityId'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetAuditLogsByEntityQuery(baseOptions: Apollo.QueryHookOptions<GetAuditLogsByEntityQuery, GetAuditLogsByEntityQueryVariables> & ({ variables: GetAuditLogsByEntityQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAuditLogsByEntityQuery, GetAuditLogsByEntityQueryVariables>(GetAuditLogsByEntityDocument, options);
      }
export function useGetAuditLogsByEntityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAuditLogsByEntityQuery, GetAuditLogsByEntityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAuditLogsByEntityQuery, GetAuditLogsByEntityQueryVariables>(GetAuditLogsByEntityDocument, options);
        }
export function useGetAuditLogsByEntitySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAuditLogsByEntityQuery, GetAuditLogsByEntityQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAuditLogsByEntityQuery, GetAuditLogsByEntityQueryVariables>(GetAuditLogsByEntityDocument, options);
        }
export type GetAuditLogsByEntityQueryHookResult = ReturnType<typeof useGetAuditLogsByEntityQuery>;
export type GetAuditLogsByEntityLazyQueryHookResult = ReturnType<typeof useGetAuditLogsByEntityLazyQuery>;
export type GetAuditLogsByEntitySuspenseQueryHookResult = ReturnType<typeof useGetAuditLogsByEntitySuspenseQuery>;
export type GetAuditLogsByEntityQueryResult = Apollo.QueryResult<GetAuditLogsByEntityQuery, GetAuditLogsByEntityQueryVariables>;
export const GetAuditLogsByUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditLogsByUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogCore"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;

/**
 * __useGetAuditLogsByUserQuery__
 *
 * To run a query within a React component, call `useGetAuditLogsByUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuditLogsByUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuditLogsByUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useGetAuditLogsByUserQuery(baseOptions: Apollo.QueryHookOptions<GetAuditLogsByUserQuery, GetAuditLogsByUserQueryVariables> & ({ variables: GetAuditLogsByUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAuditLogsByUserQuery, GetAuditLogsByUserQueryVariables>(GetAuditLogsByUserDocument, options);
      }
export function useGetAuditLogsByUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAuditLogsByUserQuery, GetAuditLogsByUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAuditLogsByUserQuery, GetAuditLogsByUserQueryVariables>(GetAuditLogsByUserDocument, options);
        }
export function useGetAuditLogsByUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAuditLogsByUserQuery, GetAuditLogsByUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAuditLogsByUserQuery, GetAuditLogsByUserQueryVariables>(GetAuditLogsByUserDocument, options);
        }
export type GetAuditLogsByUserQueryHookResult = ReturnType<typeof useGetAuditLogsByUserQuery>;
export type GetAuditLogsByUserLazyQueryHookResult = ReturnType<typeof useGetAuditLogsByUserLazyQuery>;
export type GetAuditLogsByUserSuspenseQueryHookResult = ReturnType<typeof useGetAuditLogsByUserSuspenseQuery>;
export type GetAuditLogsByUserQueryResult = Apollo.QueryResult<GetAuditLogsByUserQuery, GetAuditLogsByUserQueryVariables>;
export const GetFailedAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFailedAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogWithUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogWithUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogCore"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}}]}}]} as unknown as DocumentNode;

/**
 * __useGetFailedAuditLogsQuery__
 *
 * To run a query within a React component, call `useGetFailedAuditLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFailedAuditLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFailedAuditLogsQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useGetFailedAuditLogsQuery(baseOptions: Apollo.QueryHookOptions<GetFailedAuditLogsQuery, GetFailedAuditLogsQueryVariables> & ({ variables: GetFailedAuditLogsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFailedAuditLogsQuery, GetFailedAuditLogsQueryVariables>(GetFailedAuditLogsDocument, options);
      }
export function useGetFailedAuditLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFailedAuditLogsQuery, GetFailedAuditLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFailedAuditLogsQuery, GetFailedAuditLogsQueryVariables>(GetFailedAuditLogsDocument, options);
        }
export function useGetFailedAuditLogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFailedAuditLogsQuery, GetFailedAuditLogsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFailedAuditLogsQuery, GetFailedAuditLogsQueryVariables>(GetFailedAuditLogsDocument, options);
        }
export type GetFailedAuditLogsQueryHookResult = ReturnType<typeof useGetFailedAuditLogsQuery>;
export type GetFailedAuditLogsLazyQueryHookResult = ReturnType<typeof useGetFailedAuditLogsLazyQuery>;
export type GetFailedAuditLogsSuspenseQueryHookResult = ReturnType<typeof useGetFailedAuditLogsSuspenseQuery>;
export type GetFailedAuditLogsQueryResult = Apollo.QueryResult<GetFailedAuditLogsQuery, GetFailedAuditLogsQueryVariables>;
export const GetDataAccessLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDataAccessLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"dataAccessLogsBoolExp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"dataAccessLogsOrderBy"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataAccessLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DataAccessLogCore"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dataAccessLogsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"sum"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rowCount"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataAccessLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"dataAccessLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}},{"kind":"Field","name":{"kind":"Name","value":"fieldsAccessed"}},{"kind":"Field","name":{"kind":"Name","value":"queryExecuted"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;

/**
 * __useGetDataAccessLogsQuery__
 *
 * To run a query within a React component, call `useGetDataAccessLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDataAccessLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDataAccessLogsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetDataAccessLogsQuery(baseOptions?: Apollo.QueryHookOptions<GetDataAccessLogsQuery, GetDataAccessLogsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDataAccessLogsQuery, GetDataAccessLogsQueryVariables>(GetDataAccessLogsDocument, options);
      }
export function useGetDataAccessLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDataAccessLogsQuery, GetDataAccessLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDataAccessLogsQuery, GetDataAccessLogsQueryVariables>(GetDataAccessLogsDocument, options);
        }
export function useGetDataAccessLogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDataAccessLogsQuery, GetDataAccessLogsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDataAccessLogsQuery, GetDataAccessLogsQueryVariables>(GetDataAccessLogsDocument, options);
        }
export type GetDataAccessLogsQueryHookResult = ReturnType<typeof useGetDataAccessLogsQuery>;
export type GetDataAccessLogsLazyQueryHookResult = ReturnType<typeof useGetDataAccessLogsLazyQuery>;
export type GetDataAccessLogsSuspenseQueryHookResult = ReturnType<typeof useGetDataAccessLogsSuspenseQuery>;
export type GetDataAccessLogsQueryResult = Apollo.QueryResult<GetDataAccessLogsQuery, GetDataAccessLogsQueryVariables>;
export const GetDataExportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDataExports"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataAccessLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"export","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DataAccessLogCore"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataAccessLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"dataAccessLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}},{"kind":"Field","name":{"kind":"Name","value":"fieldsAccessed"}},{"kind":"Field","name":{"kind":"Name","value":"queryExecuted"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;

/**
 * __useGetDataExportsQuery__
 *
 * To run a query within a React component, call `useGetDataExportsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDataExportsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDataExportsQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useGetDataExportsQuery(baseOptions: Apollo.QueryHookOptions<GetDataExportsQuery, GetDataExportsQueryVariables> & ({ variables: GetDataExportsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDataExportsQuery, GetDataExportsQueryVariables>(GetDataExportsDocument, options);
      }
export function useGetDataExportsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDataExportsQuery, GetDataExportsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDataExportsQuery, GetDataExportsQueryVariables>(GetDataExportsDocument, options);
        }
export function useGetDataExportsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDataExportsQuery, GetDataExportsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDataExportsQuery, GetDataExportsQueryVariables>(GetDataExportsDocument, options);
        }
export type GetDataExportsQueryHookResult = ReturnType<typeof useGetDataExportsQuery>;
export type GetDataExportsLazyQueryHookResult = ReturnType<typeof useGetDataExportsLazyQuery>;
export type GetDataExportsSuspenseQueryHookResult = ReturnType<typeof useGetDataExportsSuspenseQuery>;
export type GetDataExportsQueryResult = Apollo.QueryResult<GetDataExportsQuery, GetDataExportsQueryVariables>;
export const GetAuthEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuthEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"authEventsBoolExp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"authEventsOrderBy"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthEventCore"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthEventCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"authEvents"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;

/**
 * __useGetAuthEventsQuery__
 *
 * To run a query within a React component, call `useGetAuthEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuthEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuthEventsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetAuthEventsQuery(baseOptions?: Apollo.QueryHookOptions<GetAuthEventsQuery, GetAuthEventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAuthEventsQuery, GetAuthEventsQueryVariables>(GetAuthEventsDocument, options);
      }
export function useGetAuthEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAuthEventsQuery, GetAuthEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAuthEventsQuery, GetAuthEventsQueryVariables>(GetAuthEventsDocument, options);
        }
export function useGetAuthEventsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAuthEventsQuery, GetAuthEventsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAuthEventsQuery, GetAuthEventsQueryVariables>(GetAuthEventsDocument, options);
        }
export type GetAuthEventsQueryHookResult = ReturnType<typeof useGetAuthEventsQuery>;
export type GetAuthEventsLazyQueryHookResult = ReturnType<typeof useGetAuthEventsLazyQuery>;
export type GetAuthEventsSuspenseQueryHookResult = ReturnType<typeof useGetAuthEventsSuspenseQuery>;
export type GetAuthEventsQueryResult = Apollo.QueryResult<GetAuthEventsQuery, GetAuthEventsQueryVariables>;
export const GetFailedAuthEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFailedAuthEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthEventCore"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthEventCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"authEvents"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;

/**
 * __useGetFailedAuthEventsQuery__
 *
 * To run a query within a React component, call `useGetFailedAuthEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFailedAuthEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFailedAuthEventsQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useGetFailedAuthEventsQuery(baseOptions: Apollo.QueryHookOptions<GetFailedAuthEventsQuery, GetFailedAuthEventsQueryVariables> & ({ variables: GetFailedAuthEventsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFailedAuthEventsQuery, GetFailedAuthEventsQueryVariables>(GetFailedAuthEventsDocument, options);
      }
export function useGetFailedAuthEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFailedAuthEventsQuery, GetFailedAuthEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFailedAuthEventsQuery, GetFailedAuthEventsQueryVariables>(GetFailedAuthEventsDocument, options);
        }
export function useGetFailedAuthEventsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFailedAuthEventsQuery, GetFailedAuthEventsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFailedAuthEventsQuery, GetFailedAuthEventsQueryVariables>(GetFailedAuthEventsDocument, options);
        }
export type GetFailedAuthEventsQueryHookResult = ReturnType<typeof useGetFailedAuthEventsQuery>;
export type GetFailedAuthEventsLazyQueryHookResult = ReturnType<typeof useGetFailedAuthEventsLazyQuery>;
export type GetFailedAuthEventsSuspenseQueryHookResult = ReturnType<typeof useGetFailedAuthEventsSuspenseQuery>;
export type GetFailedAuthEventsQueryResult = Apollo.QueryResult<GetFailedAuthEventsQuery, GetFailedAuthEventsQueryVariables>;
export const GetPermissionChangesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionChanges"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"permissionChangesBoolExp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"permissionChangesOrderBy"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionChanges"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PermissionChangeCore"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionChangeCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"permissionChanges"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"changeType"}},{"kind":"Field","name":{"kind":"Name","value":"permissionType"}},{"kind":"Field","name":{"kind":"Name","value":"oldPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"newPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;

/**
 * __useGetPermissionChangesQuery__
 *
 * To run a query within a React component, call `useGetPermissionChangesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPermissionChangesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPermissionChangesQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetPermissionChangesQuery(baseOptions?: Apollo.QueryHookOptions<GetPermissionChangesQuery, GetPermissionChangesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPermissionChangesQuery, GetPermissionChangesQueryVariables>(GetPermissionChangesDocument, options);
      }
export function useGetPermissionChangesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPermissionChangesQuery, GetPermissionChangesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPermissionChangesQuery, GetPermissionChangesQueryVariables>(GetPermissionChangesDocument, options);
        }
export function useGetPermissionChangesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPermissionChangesQuery, GetPermissionChangesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPermissionChangesQuery, GetPermissionChangesQueryVariables>(GetPermissionChangesDocument, options);
        }
export type GetPermissionChangesQueryHookResult = ReturnType<typeof useGetPermissionChangesQuery>;
export type GetPermissionChangesLazyQueryHookResult = ReturnType<typeof useGetPermissionChangesLazyQuery>;
export type GetPermissionChangesSuspenseQueryHookResult = ReturnType<typeof useGetPermissionChangesSuspenseQuery>;
export type GetPermissionChangesQueryResult = Apollo.QueryResult<GetPermissionChangesQuery, GetPermissionChangesQueryVariables>;
export const SecurityOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SecurityOverview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"twentyFourHoursAgo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sevenDaysAgo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"recentAuditLogs"},"name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"twentyFourHoursAgo"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"auditLogCount"},"name":{"kind":"Name","value":"auditLogsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"twentyFourHoursAgo"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"failedOperations"},"name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"twentyFourHoursAgo"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"authEventsSummary"},"name":{"kind":"Name","value":"authEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sevenDaysAgo"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useSecurityOverviewQuery__
 *
 * To run a query within a React component, call `useSecurityOverviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useSecurityOverviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSecurityOverviewQuery({
 *   variables: {
 *      twentyFourHoursAgo: // value for 'twentyFourHoursAgo'
 *      sevenDaysAgo: // value for 'sevenDaysAgo'
 *   },
 * });
 */
export function useSecurityOverviewQuery(baseOptions: Apollo.QueryHookOptions<SecurityOverviewQuery, SecurityOverviewQueryVariables> & ({ variables: SecurityOverviewQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SecurityOverviewQuery, SecurityOverviewQueryVariables>(SecurityOverviewDocument, options);
      }
export function useSecurityOverviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SecurityOverviewQuery, SecurityOverviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SecurityOverviewQuery, SecurityOverviewQueryVariables>(SecurityOverviewDocument, options);
        }
export function useSecurityOverviewSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SecurityOverviewQuery, SecurityOverviewQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SecurityOverviewQuery, SecurityOverviewQueryVariables>(SecurityOverviewDocument, options);
        }
export type SecurityOverviewQueryHookResult = ReturnType<typeof useSecurityOverviewQuery>;
export type SecurityOverviewLazyQueryHookResult = ReturnType<typeof useSecurityOverviewLazyQuery>;
export type SecurityOverviewSuspenseQueryHookResult = ReturnType<typeof useSecurityOverviewSuspenseQuery>;
export type SecurityOverviewQueryResult = Apollo.QueryResult<SecurityOverviewQuery, SecurityOverviewQueryVariables>;
export const SecurityOverviewWithDataAccessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SecurityOverviewWithDataAccess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"twentyFourHoursAgo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sevenDaysAgo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"recentAuditLogs"},"name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"twentyFourHoursAgo"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"auditLogCount"},"name":{"kind":"Name","value":"auditLogsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"twentyFourHoursAgo"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"failedOperations"},"name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"twentyFourHoursAgo"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"dataAccessSummary"},"name":{"kind":"Name","value":"dataAccessLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sevenDaysAgo"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"authEventsSummary"},"name":{"kind":"Name","value":"authEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sevenDaysAgo"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useSecurityOverviewWithDataAccessQuery__
 *
 * To run a query within a React component, call `useSecurityOverviewWithDataAccessQuery` and pass it any options that fit your needs.
 * When your component renders, `useSecurityOverviewWithDataAccessQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSecurityOverviewWithDataAccessQuery({
 *   variables: {
 *      twentyFourHoursAgo: // value for 'twentyFourHoursAgo'
 *      sevenDaysAgo: // value for 'sevenDaysAgo'
 *   },
 * });
 */
export function useSecurityOverviewWithDataAccessQuery(baseOptions: Apollo.QueryHookOptions<SecurityOverviewWithDataAccessQuery, SecurityOverviewWithDataAccessQueryVariables> & ({ variables: SecurityOverviewWithDataAccessQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SecurityOverviewWithDataAccessQuery, SecurityOverviewWithDataAccessQueryVariables>(SecurityOverviewWithDataAccessDocument, options);
      }
export function useSecurityOverviewWithDataAccessLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SecurityOverviewWithDataAccessQuery, SecurityOverviewWithDataAccessQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SecurityOverviewWithDataAccessQuery, SecurityOverviewWithDataAccessQueryVariables>(SecurityOverviewWithDataAccessDocument, options);
        }
export function useSecurityOverviewWithDataAccessSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SecurityOverviewWithDataAccessQuery, SecurityOverviewWithDataAccessQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SecurityOverviewWithDataAccessQuery, SecurityOverviewWithDataAccessQueryVariables>(SecurityOverviewWithDataAccessDocument, options);
        }
export type SecurityOverviewWithDataAccessQueryHookResult = ReturnType<typeof useSecurityOverviewWithDataAccessQuery>;
export type SecurityOverviewWithDataAccessLazyQueryHookResult = ReturnType<typeof useSecurityOverviewWithDataAccessLazyQuery>;
export type SecurityOverviewWithDataAccessSuspenseQueryHookResult = ReturnType<typeof useSecurityOverviewWithDataAccessSuspenseQuery>;
export type SecurityOverviewWithDataAccessQueryResult = Apollo.QueryResult<SecurityOverviewWithDataAccessQuery, SecurityOverviewWithDataAccessQueryVariables>;
export const ComplianceReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ComplianceReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"auditMetrics"},"name":{"kind":"Name","value":"auditLogsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"action"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"failedByType"},"name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"dataAccessStats"},"name":{"kind":"Name","value":"dataAccessLogsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"sum"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rowCount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"userActivity"},"name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"distinctOn"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"userId"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"action"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useComplianceReportQuery__
 *
 * To run a query within a React component, call `useComplianceReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useComplianceReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useComplianceReportQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useComplianceReportQuery(baseOptions: Apollo.QueryHookOptions<ComplianceReportQuery, ComplianceReportQueryVariables> & ({ variables: ComplianceReportQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ComplianceReportQuery, ComplianceReportQueryVariables>(ComplianceReportDocument, options);
      }
export function useComplianceReportLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ComplianceReportQuery, ComplianceReportQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ComplianceReportQuery, ComplianceReportQueryVariables>(ComplianceReportDocument, options);
        }
export function useComplianceReportSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ComplianceReportQuery, ComplianceReportQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ComplianceReportQuery, ComplianceReportQueryVariables>(ComplianceReportDocument, options);
        }
export type ComplianceReportQueryHookResult = ReturnType<typeof useComplianceReportQuery>;
export type ComplianceReportLazyQueryHookResult = ReturnType<typeof useComplianceReportLazyQuery>;
export type ComplianceReportSuspenseQueryHookResult = ReturnType<typeof useComplianceReportSuspenseQuery>;
export type ComplianceReportQueryResult = Apollo.QueryResult<ComplianceReportQuery, ComplianceReportQueryVariables>;
export const GetAuditAnalyticsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditAnalytics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"auditSummary"},"name":{"kind":"Name","value":"auditLogsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"failedByType"},"name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"dataAccessStats"},"name":{"kind":"Name","value":"dataAccessLogsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"sum"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rowCount"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"userActivity"},"name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"distinctOn"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"userId"}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"EnumValue","value":"ASC"}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useGetAuditAnalyticsQuery__
 *
 * To run a query within a React component, call `useGetAuditAnalyticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuditAnalyticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuditAnalyticsQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useGetAuditAnalyticsQuery(baseOptions: Apollo.QueryHookOptions<GetAuditAnalyticsQuery, GetAuditAnalyticsQueryVariables> & ({ variables: GetAuditAnalyticsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAuditAnalyticsQuery, GetAuditAnalyticsQueryVariables>(GetAuditAnalyticsDocument, options);
      }
export function useGetAuditAnalyticsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAuditAnalyticsQuery, GetAuditAnalyticsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAuditAnalyticsQuery, GetAuditAnalyticsQueryVariables>(GetAuditAnalyticsDocument, options);
        }
export function useGetAuditAnalyticsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAuditAnalyticsQuery, GetAuditAnalyticsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAuditAnalyticsQuery, GetAuditAnalyticsQueryVariables>(GetAuditAnalyticsDocument, options);
        }
export type GetAuditAnalyticsQueryHookResult = ReturnType<typeof useGetAuditAnalyticsQuery>;
export type GetAuditAnalyticsLazyQueryHookResult = ReturnType<typeof useGetAuditAnalyticsLazyQuery>;
export type GetAuditAnalyticsSuspenseQueryHookResult = ReturnType<typeof useGetAuditAnalyticsSuspenseQuery>;
export type GetAuditAnalyticsQueryResult = Apollo.QueryResult<GetAuditAnalyticsQuery, GetAuditAnalyticsQueryVariables>;
export const ComplianceAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ComplianceAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"auditLogsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useComplianceAuditLogsQuery__
 *
 * To run a query within a React component, call `useComplianceAuditLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useComplianceAuditLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useComplianceAuditLogsQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useComplianceAuditLogsQuery(baseOptions: Apollo.QueryHookOptions<ComplianceAuditLogsQuery, ComplianceAuditLogsQueryVariables> & ({ variables: ComplianceAuditLogsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ComplianceAuditLogsQuery, ComplianceAuditLogsQueryVariables>(ComplianceAuditLogsDocument, options);
      }
export function useComplianceAuditLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ComplianceAuditLogsQuery, ComplianceAuditLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ComplianceAuditLogsQuery, ComplianceAuditLogsQueryVariables>(ComplianceAuditLogsDocument, options);
        }
export function useComplianceAuditLogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ComplianceAuditLogsQuery, ComplianceAuditLogsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ComplianceAuditLogsQuery, ComplianceAuditLogsQueryVariables>(ComplianceAuditLogsDocument, options);
        }
export type ComplianceAuditLogsQueryHookResult = ReturnType<typeof useComplianceAuditLogsQuery>;
export type ComplianceAuditLogsLazyQueryHookResult = ReturnType<typeof useComplianceAuditLogsLazyQuery>;
export type ComplianceAuditLogsSuspenseQueryHookResult = ReturnType<typeof useComplianceAuditLogsSuspenseQuery>;
export type ComplianceAuditLogsQueryResult = Apollo.QueryResult<ComplianceAuditLogsQuery, ComplianceAuditLogsQueryVariables>;
export const AuditLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuditLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogsBoolExp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogsOrderBy"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"auditLogsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useAuditLogQuery__
 *
 * To run a query within a React component, call `useAuditLogQuery` and pass it any options that fit your needs.
 * When your component renders, `useAuditLogQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuditLogQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useAuditLogQuery(baseOptions: Apollo.QueryHookOptions<AuditLogQuery, AuditLogQueryVariables> & ({ variables: AuditLogQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AuditLogQuery, AuditLogQueryVariables>(AuditLogDocument, options);
      }
export function useAuditLogLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AuditLogQuery, AuditLogQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AuditLogQuery, AuditLogQueryVariables>(AuditLogDocument, options);
        }
export function useAuditLogSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AuditLogQuery, AuditLogQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AuditLogQuery, AuditLogQueryVariables>(AuditLogDocument, options);
        }
export type AuditLogQueryHookResult = ReturnType<typeof useAuditLogQuery>;
export type AuditLogLazyQueryHookResult = ReturnType<typeof useAuditLogLazyQuery>;
export type AuditLogSuspenseQueryHookResult = ReturnType<typeof useAuditLogSuspenseQuery>;
export type AuditLogQueryResult = Apollo.QueryResult<AuditLogQuery, AuditLogQueryVariables>;
export const SubscribeToAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"SubscribeToAuditLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogWithUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogWithUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogCore"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}}]}}]} as unknown as DocumentNode;

/**
 * __useSubscribeToAuditLogsSubscription__
 *
 * To run a query within a React component, call `useSubscribeToAuditLogsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToAuditLogsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscribeToAuditLogsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSubscribeToAuditLogsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SubscribeToAuditLogsSubscription, SubscribeToAuditLogsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SubscribeToAuditLogsSubscription, SubscribeToAuditLogsSubscriptionVariables>(SubscribeToAuditLogsDocument, options);
      }
export type SubscribeToAuditLogsSubscriptionHookResult = ReturnType<typeof useSubscribeToAuditLogsSubscription>;
export type SubscribeToAuditLogsSubscriptionResult = Apollo.SubscriptionResult<SubscribeToAuditLogsSubscription>;
export const SubscribeToFailedOperationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"SubscribeToFailedOperations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogCore"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;

/**
 * __useSubscribeToFailedOperationsSubscription__
 *
 * To run a query within a React component, call `useSubscribeToFailedOperationsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToFailedOperationsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscribeToFailedOperationsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSubscribeToFailedOperationsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SubscribeToFailedOperationsSubscription, SubscribeToFailedOperationsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SubscribeToFailedOperationsSubscription, SubscribeToFailedOperationsSubscriptionVariables>(SubscribeToFailedOperationsDocument, options);
      }
export type SubscribeToFailedOperationsSubscriptionHookResult = ReturnType<typeof useSubscribeToFailedOperationsSubscription>;
export type SubscribeToFailedOperationsSubscriptionResult = Apollo.SubscriptionResult<SubscribeToFailedOperationsSubscription>;
export const SubscribeToUserAuditActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"SubscribeToUserAuditActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user_id"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogCore"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;

/**
 * __useSubscribeToUserAuditActivitySubscription__
 *
 * To run a query within a React component, call `useSubscribeToUserAuditActivitySubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToUserAuditActivitySubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscribeToUserAuditActivitySubscription({
 *   variables: {
 *      user_id: // value for 'user_id'
 *   },
 * });
 */
export function useSubscribeToUserAuditActivitySubscription(baseOptions: Apollo.SubscriptionHookOptions<SubscribeToUserAuditActivitySubscription, SubscribeToUserAuditActivitySubscriptionVariables> & ({ variables: SubscribeToUserAuditActivitySubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SubscribeToUserAuditActivitySubscription, SubscribeToUserAuditActivitySubscriptionVariables>(SubscribeToUserAuditActivityDocument, options);
      }
export type SubscribeToUserAuditActivitySubscriptionHookResult = ReturnType<typeof useSubscribeToUserAuditActivitySubscription>;
export type SubscribeToUserAuditActivitySubscriptionResult = Apollo.SubscriptionResult<SubscribeToUserAuditActivitySubscription>;
export const SubscribeToDataAccessLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"SubscribeToDataAccessLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataAccessLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DataAccessLogCore"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataAccessLogCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"dataAccessLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}},{"kind":"Field","name":{"kind":"Name","value":"fieldsAccessed"}},{"kind":"Field","name":{"kind":"Name","value":"queryExecuted"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode;

/**
 * __useSubscribeToDataAccessLogsSubscription__
 *
 * To run a query within a React component, call `useSubscribeToDataAccessLogsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToDataAccessLogsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscribeToDataAccessLogsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSubscribeToDataAccessLogsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SubscribeToDataAccessLogsSubscription, SubscribeToDataAccessLogsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SubscribeToDataAccessLogsSubscription, SubscribeToDataAccessLogsSubscriptionVariables>(SubscribeToDataAccessLogsDocument, options);
      }
export type SubscribeToDataAccessLogsSubscriptionHookResult = ReturnType<typeof useSubscribeToDataAccessLogsSubscription>;
export type SubscribeToDataAccessLogsSubscriptionResult = Apollo.SubscriptionResult<SubscribeToDataAccessLogsSubscription>;
export const SecurityEventsStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"SecurityEventsStream"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"twentyFourHoursAgo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"twentyFourHoursAgo"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useSecurityEventsStreamSubscription__
 *
 * To run a query within a React component, call `useSecurityEventsStreamSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSecurityEventsStreamSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSecurityEventsStreamSubscription({
 *   variables: {
 *      twentyFourHoursAgo: // value for 'twentyFourHoursAgo'
 *   },
 * });
 */
export function useSecurityEventsStreamSubscription(baseOptions: Apollo.SubscriptionHookOptions<SecurityEventsStreamSubscription, SecurityEventsStreamSubscriptionVariables> & ({ variables: SecurityEventsStreamSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SecurityEventsStreamSubscription, SecurityEventsStreamSubscriptionVariables>(SecurityEventsStreamDocument, options);
      }
export type SecurityEventsStreamSubscriptionHookResult = ReturnType<typeof useSecurityEventsStreamSubscription>;
export type SecurityEventsStreamSubscriptionResult = Apollo.SubscriptionResult<SecurityEventsStreamSubscription>;
export const FailedOperationsStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"FailedOperationsStream"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"twentyFourHoursAgo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"twentyFourHoursAgo"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useFailedOperationsStreamSubscription__
 *
 * To run a query within a React component, call `useFailedOperationsStreamSubscription` and pass it any options that fit your needs.
 * When your component renders, `useFailedOperationsStreamSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFailedOperationsStreamSubscription({
 *   variables: {
 *      twentyFourHoursAgo: // value for 'twentyFourHoursAgo'
 *   },
 * });
 */
export function useFailedOperationsStreamSubscription(baseOptions: Apollo.SubscriptionHookOptions<FailedOperationsStreamSubscription, FailedOperationsStreamSubscriptionVariables> & ({ variables: FailedOperationsStreamSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<FailedOperationsStreamSubscription, FailedOperationsStreamSubscriptionVariables>(FailedOperationsStreamDocument, options);
      }
export type FailedOperationsStreamSubscriptionHookResult = ReturnType<typeof useFailedOperationsStreamSubscription>;
export type FailedOperationsStreamSubscriptionResult = Apollo.SubscriptionResult<FailedOperationsStreamSubscription>;
export const CriticalDataAccessStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CriticalDataAccessStream"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sevenDaysAgo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataAccessLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sevenDaysAgo"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"dataClassification"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"CRITICAL","block":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"30"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCriticalDataAccessStreamSubscription__
 *
 * To run a query within a React component, call `useCriticalDataAccessStreamSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCriticalDataAccessStreamSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCriticalDataAccessStreamSubscription({
 *   variables: {
 *      sevenDaysAgo: // value for 'sevenDaysAgo'
 *   },
 * });
 */
export function useCriticalDataAccessStreamSubscription(baseOptions: Apollo.SubscriptionHookOptions<CriticalDataAccessStreamSubscription, CriticalDataAccessStreamSubscriptionVariables> & ({ variables: CriticalDataAccessStreamSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CriticalDataAccessStreamSubscription, CriticalDataAccessStreamSubscriptionVariables>(CriticalDataAccessStreamDocument, options);
      }
export type CriticalDataAccessStreamSubscriptionHookResult = ReturnType<typeof useCriticalDataAccessStreamSubscription>;
export type CriticalDataAccessStreamSubscriptionResult = Apollo.SubscriptionResult<CriticalDataAccessStreamSubscription>;