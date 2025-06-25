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
 * Generated: 2025-06-25T13:11:57.867Z
 * Schema Version: Latest from Hasura
 * CodeGen Version: Unified v3.0
 */

export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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

export interface AffectedAssignment {
  __typename?: 'AffectedAssignment';
  adjustedEftDate: Scalars['String']['output'];
  id: Scalars['String']['output'];
  newConsultantId: Scalars['String']['output'];
  originalConsultantId: Scalars['String']['output'];
  payrollDateId: Scalars['String']['output'];
}

export interface AuditEventInput {
  action: Scalars['String']['input'];
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['json']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  resourceType: Scalars['String']['input'];
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
}

export interface AuditEventResponse {
  __typename?: 'AuditEventResponse';
  eventId: Maybe<Scalars['String']['output']>;
  message: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
}

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export interface BigintComparisonExp {
  _eq?: InputMaybe<Scalars['bigint']['input']>;
  _gt?: InputMaybe<Scalars['bigint']['input']>;
  _gte?: InputMaybe<Scalars['bigint']['input']>;
  _in?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['bigint']['input']>;
  _lte?: InputMaybe<Scalars['bigint']['input']>;
  _neq?: InputMaybe<Scalars['bigint']['input']>;
  _nin?: InputMaybe<Array<Scalars['bigint']['input']>>;
}

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export interface BooleanComparisonExp {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
}

/** Boolean expression to compare columns of type "bpchar". All fields are combined with logical 'AND'. */
export interface BpcharComparisonExp {
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
}

export interface CommitPayrollAssignmentsOutput {
  __typename?: 'CommitPayrollAssignmentsOutput';
  affectedAssignments: Maybe<Array<AffectedAssignment>>;
  errors: Maybe<Array<Scalars['String']['output']>>;
  message: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
}

export interface ComplianceReportInput {
  endDate: Scalars['String']['input'];
  includeDetails?: InputMaybe<Scalars['Boolean']['input']>;
  reportType: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
}

export interface ComplianceReportResponse {
  __typename?: 'ComplianceReportResponse';
  generatedAt: Scalars['String']['output'];
  reportUrl: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  summary: Maybe<Scalars['json']['output']>;
}

/** ordering argument of a cursor */
export enum CursorOrdering {
  /** ascending ordering of the cursor */
  ASC = 'ASC',
  /** descending ordering of the cursor */
  DESC = 'DESC'
}

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export interface DateComparisonExp {
  _eq?: InputMaybe<Scalars['date']['input']>;
  _gt?: InputMaybe<Scalars['date']['input']>;
  _gte?: InputMaybe<Scalars['date']['input']>;
  _in?: InputMaybe<Array<Scalars['date']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['date']['input']>;
  _lte?: InputMaybe<Scalars['date']['input']>;
  _neq?: InputMaybe<Scalars['date']['input']>;
  _nin?: InputMaybe<Array<Scalars['date']['input']>>;
}

/** Boolean expression to compare columns of type "inet". All fields are combined with logical 'AND'. */
export interface InetComparisonExp {
  _eq?: InputMaybe<Scalars['inet']['input']>;
  _gt?: InputMaybe<Scalars['inet']['input']>;
  _gte?: InputMaybe<Scalars['inet']['input']>;
  _in?: InputMaybe<Array<Scalars['inet']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['inet']['input']>;
  _lte?: InputMaybe<Scalars['inet']['input']>;
  _neq?: InputMaybe<Scalars['inet']['input']>;
  _nin?: InputMaybe<Array<Scalars['inet']['input']>>;
}

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export interface IntComparisonExp {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
}

/** Boolean expression to compare columns of type "interval". All fields are combined with logical 'AND'. */
export interface IntervalComparisonExp {
  _eq?: InputMaybe<Scalars['interval']['input']>;
  _gt?: InputMaybe<Scalars['interval']['input']>;
  _gte?: InputMaybe<Scalars['interval']['input']>;
  _in?: InputMaybe<Array<Scalars['interval']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['interval']['input']>;
  _lte?: InputMaybe<Scalars['interval']['input']>;
  _neq?: InputMaybe<Scalars['interval']['input']>;
  _nin?: InputMaybe<Array<Scalars['interval']['input']>>;
}

export interface JsonbCastExp {
  String?: InputMaybe<StringComparisonExp>;
}

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export interface JsonbComparisonExp {
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
}

/** Boolean expression to compare columns of type "leave_status_enum". All fields are combined with logical 'AND'. */
export interface LeaveStatusEnumComparisonExp {
  _eq?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _gt?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _gte?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _in?: InputMaybe<Array<Scalars['leave_status_enum']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _lte?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _neq?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _nin?: InputMaybe<Array<Scalars['leave_status_enum']['input']>>;
}

export interface Mutation {
  __typename?: 'Mutation';
  checkSuspiciousActivity: Maybe<SuspiciousActivityResponse>;
  commitPayrollAssignments: Maybe<CommitPayrollAssignmentsOutput>;
  generateComplianceReport: Maybe<ComplianceReportResponse>;
  logAuditEvent: Maybe<AuditEventResponse>;
}


export type MutationCheckSuspiciousActivityArgs = {
  timeWindow: InputMaybe<Scalars['Int']['input']>;
  userId: InputMaybe<Scalars['String']['input']>;
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
export interface NameComparisonExp {
  _eq?: InputMaybe<Scalars['name']['input']>;
  _gt?: InputMaybe<Scalars['name']['input']>;
  _gte?: InputMaybe<Scalars['name']['input']>;
  _in?: InputMaybe<Array<Scalars['name']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['name']['input']>;
  _lte?: InputMaybe<Scalars['name']['input']>;
  _neq?: InputMaybe<Scalars['name']['input']>;
  _nin?: InputMaybe<Array<Scalars['name']['input']>>;
}

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export interface NumericComparisonExp {
  _eq?: InputMaybe<Scalars['numeric']['input']>;
  _gt?: InputMaybe<Scalars['numeric']['input']>;
  _gte?: InputMaybe<Scalars['numeric']['input']>;
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
}

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

export interface PayrollAssignmentInput {
  date: Scalars['String']['input'];
  fromConsultantId: Scalars['String']['input'];
  payrollId: Scalars['String']['input'];
  toConsultantId: Scalars['String']['input'];
}

/** Boolean expression to compare columns of type "payroll_cycle_type". All fields are combined with logical 'AND'. */
export interface PayrollCycleTypeComparisonExp {
  _eq?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _gt?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _gte?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _in?: InputMaybe<Array<Scalars['payroll_cycle_type']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _lte?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _neq?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _nin?: InputMaybe<Array<Scalars['payroll_cycle_type']['input']>>;
}

/** Boolean expression to compare columns of type "payroll_date_type". All fields are combined with logical 'AND'. */
export interface PayrollDateTypeComparisonExp {
  _eq?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _gt?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _gte?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _in?: InputMaybe<Array<Scalars['payroll_date_type']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _lte?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _neq?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _nin?: InputMaybe<Array<Scalars['payroll_date_type']['input']>>;
}

/** Boolean expression to compare columns of type "payroll_status". All fields are combined with logical 'AND'. */
export interface PayrollStatusComparisonExp {
  _eq?: InputMaybe<Scalars['payroll_status']['input']>;
  _gt?: InputMaybe<Scalars['payroll_status']['input']>;
  _gte?: InputMaybe<Scalars['payroll_status']['input']>;
  _in?: InputMaybe<Array<Scalars['payroll_status']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['payroll_status']['input']>;
  _lte?: InputMaybe<Scalars['payroll_status']['input']>;
  _neq?: InputMaybe<Scalars['payroll_status']['input']>;
  _nin?: InputMaybe<Array<Scalars['payroll_status']['input']>>;
}

/** Boolean expression to compare columns of type "permission_action". All fields are combined with logical 'AND'. */
export interface PermissionActionComparisonExp {
  _eq?: InputMaybe<Scalars['permission_action']['input']>;
  _gt?: InputMaybe<Scalars['permission_action']['input']>;
  _gte?: InputMaybe<Scalars['permission_action']['input']>;
  _in?: InputMaybe<Array<Scalars['permission_action']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['permission_action']['input']>;
  _lte?: InputMaybe<Scalars['permission_action']['input']>;
  _neq?: InputMaybe<Scalars['permission_action']['input']>;
  _nin?: InputMaybe<Array<Scalars['permission_action']['input']>>;
}

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export interface StringArrayComparisonExp {
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
}

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export interface StringComparisonExp {
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
}

export interface SuspiciousActivityResponse {
  __typename?: 'SuspiciousActivityResponse';
  events: Maybe<Array<SuspiciousEvent>>;
  message: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  suspicious: Scalars['Boolean']['output'];
}

export interface SuspiciousEvent {
  __typename?: 'SuspiciousEvent';
  count: Scalars['Int']['output'];
  eventType: Scalars['String']['output'];
  severity: Scalars['String']['output'];
  timeframe: Scalars['String']['output'];
}

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export interface TimestampComparisonExp {
  _eq?: InputMaybe<Scalars['timestamp']['input']>;
  _gt?: InputMaybe<Scalars['timestamp']['input']>;
  _gte?: InputMaybe<Scalars['timestamp']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamp']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamp']['input']>;
  _lte?: InputMaybe<Scalars['timestamp']['input']>;
  _neq?: InputMaybe<Scalars['timestamp']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']['input']>>;
}

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export interface TimestamptzComparisonExp {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
}

/** Boolean expression to compare columns of type "user_role". All fields are combined with logical 'AND'. */
export interface UserRoleComparisonExp {
  _eq?: InputMaybe<Scalars['user_role']['input']>;
  _gt?: InputMaybe<Scalars['user_role']['input']>;
  _gte?: InputMaybe<Scalars['user_role']['input']>;
  _in?: InputMaybe<Array<Scalars['user_role']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['user_role']['input']>;
  _lte?: InputMaybe<Scalars['user_role']['input']>;
  _neq?: InputMaybe<Scalars['user_role']['input']>;
  _nin?: InputMaybe<Array<Scalars['user_role']['input']>>;
}

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export interface UuidComparisonExp {
  _eq?: InputMaybe<Scalars['uuid']['input']>;
  _gt?: InputMaybe<Scalars['uuid']['input']>;
  _gte?: InputMaybe<Scalars['uuid']['input']>;
  _in?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['uuid']['input']>;
  _lte?: InputMaybe<Scalars['uuid']['input']>;
  _neq?: InputMaybe<Scalars['uuid']['input']>;
  _nin?: InputMaybe<Array<Scalars['uuid']['input']>>;
}

/** A union of all types that use the @key directive */
export type Entity = AdjustmentRules | AppSettings | AuditLogs | AuthEvents | BillingEventLogs | BillingInvoice | BillingInvoices | BillingItems | BillingPlans | ClientBillingAssignments | ClientExternalSystems | Clients | DataAccessLogs | ExternalSystems | FeatureFlags | Holidays | LatestPayrollVersionResults | Leave | Notes | PayrollActivationResults | PayrollAssignmentAudits | PayrollAssignments | PayrollCycles | PayrollDateTypes | PayrollDates | PayrollVersionHistoryResults | PayrollVersionResults | Payrolls | PermissionAuditLogs | PermissionChanges | PermissionOverrides | Permissions | Resources | RolePermissions | Roles | SlowQueries | UserInvitations | UserRoles | Users | WorkSchedules;

export interface Service {
  __typename?: '_Service';
  /** SDL representation of schema */
  sdl: Scalars['String']['output'];
}

/** columns and relationships of "adjustment_rules" */
export interface AdjustmentRules {
  __typename?: 'adjustmentRules';
  /** Timestamp when the rule was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
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
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** aggregated selection of "adjustment_rules" */
export interface AdjustmentRulesAggregate {
  __typename?: 'adjustmentRulesAggregate';
  aggregate: Maybe<AdjustmentRulesAggregateFields>;
  nodes: Array<AdjustmentRules>;
}

export interface AdjustmentRulesAggregateBoolExp {
  count?: InputMaybe<AdjustmentRulesAggregateBoolExpCount>;
}

export interface AdjustmentRulesAggregateBoolExpCount {
  arguments?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<AdjustmentRulesBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "adjustment_rules" */
export interface AdjustmentRulesAggregateFields {
  __typename?: 'adjustmentRulesAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<AdjustmentRulesMaxFields>;
  min: Maybe<AdjustmentRulesMinFields>;
}


/** aggregate fields of "adjustment_rules" */
export type AdjustmentRulesAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "adjustment_rules" */
export interface AdjustmentRulesAggregateOrderBy {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<AdjustmentRulesMaxOrderBy>;
  min?: InputMaybe<AdjustmentRulesMinOrderBy>;
}

/** input type for inserting array relation for remote table "adjustment_rules" */
export interface AdjustmentRulesArrRelInsertInput {
  data: Array<AdjustmentRulesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<AdjustmentRulesOnConflict>;
}

/** Boolean expression to filter rows from the table "adjustment_rules". All fields are combined with a logical 'AND'. */
export interface AdjustmentRulesBoolExp {
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
}

/** unique or primary key constraints on table "adjustment_rules" */
export enum AdjustmentRulesConstraint {
  /** unique or primary key constraint on columns "date_type_id", "cycle_id" */
  adjustment_rules_cycle_id_date_type_id_key = 'adjustment_rules_cycle_id_date_type_id_key',
  /** unique or primary key constraint on columns "id" */
  adjustment_rules_pkey = 'adjustment_rules_pkey'
}

/** input type for inserting data into table "adjustment_rules" */
export interface AdjustmentRulesInsertInput {
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
}

/** aggregate max on columns */
export interface AdjustmentRulesMaxFields {
  __typename?: 'adjustmentRulesMaxFields';
  /** Timestamp when the rule was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Reference to the payroll cycle this rule applies to */
  cycleId: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll date type this rule affects */
  dateTypeId: Maybe<Scalars['uuid']['output']>;
  /** Unique identifier for the adjustment rule */
  id: Maybe<Scalars['uuid']['output']>;
  /** Code/formula used to calculate date adjustments */
  ruleCode: Maybe<Scalars['String']['output']>;
  /** Human-readable description of the adjustment rule */
  ruleDescription: Maybe<Scalars['String']['output']>;
  /** Timestamp when the rule was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by max() on columns of table "adjustment_rules" */
export interface AdjustmentRulesMaxOrderBy {
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
}

/** aggregate min on columns */
export interface AdjustmentRulesMinFields {
  __typename?: 'adjustmentRulesMinFields';
  /** Timestamp when the rule was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Reference to the payroll cycle this rule applies to */
  cycleId: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll date type this rule affects */
  dateTypeId: Maybe<Scalars['uuid']['output']>;
  /** Unique identifier for the adjustment rule */
  id: Maybe<Scalars['uuid']['output']>;
  /** Code/formula used to calculate date adjustments */
  ruleCode: Maybe<Scalars['String']['output']>;
  /** Human-readable description of the adjustment rule */
  ruleDescription: Maybe<Scalars['String']['output']>;
  /** Timestamp when the rule was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by min() on columns of table "adjustment_rules" */
export interface AdjustmentRulesMinOrderBy {
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
}

/** response of any mutation on the table "adjustment_rules" */
export interface AdjustmentRulesMutationResponse {
  __typename?: 'adjustmentRulesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AdjustmentRules>;
}

/** on_conflict condition type for table "adjustment_rules" */
export interface AdjustmentRulesOnConflict {
  constraint: AdjustmentRulesConstraint;
  updateColumns?: Array<AdjustmentRulesUpdateColumn>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
}

/** Ordering options when selecting data from "adjustment_rules". */
export interface AdjustmentRulesOrderBy {
  createdAt?: InputMaybe<OrderBy>;
  cycleId?: InputMaybe<OrderBy>;
  dateTypeId?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  relatedPayrollCycle?: InputMaybe<PayrollCyclesOrderBy>;
  relatedPayrollDateType?: InputMaybe<PayrollDateTypesOrderBy>;
  ruleCode?: InputMaybe<OrderBy>;
  ruleDescription?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: adjustment_rules */
export interface AdjustmentRulesPkColumnsInput {
  /** Unique identifier for the adjustment rule */
  id: Scalars['uuid']['input'];
}

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
export interface AdjustmentRulesSetInput {
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
}

/** Streaming cursor of the table "adjustmentRules" */
export interface AdjustmentRulesStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: AdjustmentRulesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface AdjustmentRulesStreamCursorValueInput {
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
}

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

export interface AdjustmentRulesUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AdjustmentRulesSetInput>;
  /** filter the rows which have to be updated */
  where: AdjustmentRulesBoolExp;
}

/** columns and relationships of "app_settings" */
export interface AppSettings {
  __typename?: 'appSettings';
  /** Unique identifier for application setting */
  id: Scalars['String']['output'];
  /** JSON structure containing application permission configurations */
  permissions: Maybe<Scalars['jsonb']['output']>;
}


/** columns and relationships of "app_settings" */
export type AppSettingsPermissionsArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "app_settings" */
export interface AppSettingsAggregate {
  __typename?: 'appSettingsAggregate';
  aggregate: Maybe<AppSettingsAggregateFields>;
  nodes: Array<AppSettings>;
}

/** aggregate fields of "app_settings" */
export interface AppSettingsAggregateFields {
  __typename?: 'appSettingsAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<AppSettingsMaxFields>;
  min: Maybe<AppSettingsMinFields>;
}


/** aggregate fields of "app_settings" */
export type AppSettingsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<AppSettingsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export interface AppSettingsAppendInput {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['jsonb']['input']>;
}

/** Boolean expression to filter rows from the table "app_settings". All fields are combined with a logical 'AND'. */
export interface AppSettingsBoolExp {
  _and?: InputMaybe<Array<AppSettingsBoolExp>>;
  _not?: InputMaybe<AppSettingsBoolExp>;
  _or?: InputMaybe<Array<AppSettingsBoolExp>>;
  id?: InputMaybe<StringComparisonExp>;
  permissions?: InputMaybe<JsonbComparisonExp>;
}

/** unique or primary key constraints on table "app_settings" */
export enum AppSettingsConstraint {
  /** unique or primary key constraint on columns "id" */
  app_settings_pkey = 'app_settings_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface AppSettingsDeleteAtPathInput {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface AppSettingsDeleteElemInput {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['Int']['input']>;
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface AppSettingsDeleteKeyInput {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['String']['input']>;
}

/** input type for inserting data into table "app_settings" */
export interface AppSettingsInsertInput {
  /** Unique identifier for application setting */
  id?: InputMaybe<Scalars['String']['input']>;
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['jsonb']['input']>;
}

/** aggregate max on columns */
export interface AppSettingsMaxFields {
  __typename?: 'appSettingsMaxFields';
  /** Unique identifier for application setting */
  id: Maybe<Scalars['String']['output']>;
}

/** aggregate min on columns */
export interface AppSettingsMinFields {
  __typename?: 'appSettingsMinFields';
  /** Unique identifier for application setting */
  id: Maybe<Scalars['String']['output']>;
}

/** response of any mutation on the table "app_settings" */
export interface AppSettingsMutationResponse {
  __typename?: 'appSettingsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AppSettings>;
}

/** on_conflict condition type for table "app_settings" */
export interface AppSettingsOnConflict {
  constraint: AppSettingsConstraint;
  updateColumns?: Array<AppSettingsUpdateColumn>;
  where?: InputMaybe<AppSettingsBoolExp>;
}

/** Ordering options when selecting data from "app_settings". */
export interface AppSettingsOrderBy {
  id?: InputMaybe<OrderBy>;
  permissions?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: app_settings */
export interface AppSettingsPkColumnsInput {
  /** Unique identifier for application setting */
  id: Scalars['String']['input'];
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface AppSettingsPrependInput {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['jsonb']['input']>;
}

/** select columns of table "app_settings" */
export enum AppSettingsSelectColumn {
  /** column name */
  id = 'id',
  /** column name */
  permissions = 'permissions'
}

/** input type for updating data in table "app_settings" */
export interface AppSettingsSetInput {
  /** Unique identifier for application setting */
  id?: InputMaybe<Scalars['String']['input']>;
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['jsonb']['input']>;
}

/** Streaming cursor of the table "appSettings" */
export interface AppSettingsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: AppSettingsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface AppSettingsStreamCursorValueInput {
  /** Unique identifier for application setting */
  id?: InputMaybe<Scalars['String']['input']>;
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['jsonb']['input']>;
}

/** update columns of table "app_settings" */
export enum AppSettingsUpdateColumn {
  /** column name */
  id = 'id',
  /** column name */
  permissions = 'permissions'
}

export interface AppSettingsUpdates {
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
}

/** columns and relationships of "audit.audit_log" */
export interface AuditLogs {
  __typename?: 'auditLogs';
  action: Scalars['String']['output'];
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  errorMessage: Maybe<Scalars['String']['output']>;
  eventTime: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  ipAddress: Maybe<Scalars['inet']['output']>;
  metadata: Maybe<Scalars['jsonb']['output']>;
  newValues: Maybe<Scalars['jsonb']['output']>;
  oldValues: Maybe<Scalars['jsonb']['output']>;
  requestId: Maybe<Scalars['String']['output']>;
  resourceId: Maybe<Scalars['String']['output']>;
  resourceType: Scalars['String']['output'];
  sessionId: Maybe<Scalars['String']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  userAgent: Maybe<Scalars['String']['output']>;
  userEmail: Maybe<Scalars['String']['output']>;
  userId: Maybe<Scalars['uuid']['output']>;
  userRole: Maybe<Scalars['String']['output']>;
}


/** columns and relationships of "audit.audit_log" */
export type AuditLogsMetadataArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit.audit_log" */
export type AuditLogsNewValuesArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit.audit_log" */
export type AuditLogsOldValuesArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit.audit_log" */
export interface AuditLogsAggregate {
  __typename?: 'auditLogsAggregate';
  aggregate: Maybe<AuditLogsAggregateFields>;
  nodes: Array<AuditLogs>;
}

/** aggregate fields of "audit.audit_log" */
export interface AuditLogsAggregateFields {
  __typename?: 'auditLogsAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<AuditLogsMaxFields>;
  min: Maybe<AuditLogsMinFields>;
}


/** aggregate fields of "audit.audit_log" */
export type AuditLogsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<AuditLogsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export interface AuditLogsAppendInput {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newValues?: InputMaybe<Scalars['jsonb']['input']>;
  oldValues?: InputMaybe<Scalars['jsonb']['input']>;
}

/** Boolean expression to filter rows from the table "audit.audit_log". All fields are combined with a logical 'AND'. */
export interface AuditLogsBoolExp {
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
}

/** unique or primary key constraints on table "audit.audit_log" */
export enum AuditLogsConstraint {
  /** unique or primary key constraint on columns "id" */
  audit_log_pkey = 'audit_log_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface AuditLogsDeleteAtPathInput {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
  newValues?: InputMaybe<Array<Scalars['String']['input']>>;
  oldValues?: InputMaybe<Array<Scalars['String']['input']>>;
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface AuditLogsDeleteElemInput {
  metadata?: InputMaybe<Scalars['Int']['input']>;
  newValues?: InputMaybe<Scalars['Int']['input']>;
  oldValues?: InputMaybe<Scalars['Int']['input']>;
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface AuditLogsDeleteKeyInput {
  metadata?: InputMaybe<Scalars['String']['input']>;
  newValues?: InputMaybe<Scalars['String']['input']>;
  oldValues?: InputMaybe<Scalars['String']['input']>;
}

/** input type for inserting data into table "audit.audit_log" */
export interface AuditLogsInsertInput {
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
}

/** aggregate max on columns */
export interface AuditLogsMaxFields {
  __typename?: 'auditLogsMaxFields';
  action: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  errorMessage: Maybe<Scalars['String']['output']>;
  eventTime: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  requestId: Maybe<Scalars['String']['output']>;
  resourceId: Maybe<Scalars['String']['output']>;
  resourceType: Maybe<Scalars['String']['output']>;
  sessionId: Maybe<Scalars['String']['output']>;
  userAgent: Maybe<Scalars['String']['output']>;
  userEmail: Maybe<Scalars['String']['output']>;
  userId: Maybe<Scalars['uuid']['output']>;
  userRole: Maybe<Scalars['String']['output']>;
}

/** aggregate min on columns */
export interface AuditLogsMinFields {
  __typename?: 'auditLogsMinFields';
  action: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  errorMessage: Maybe<Scalars['String']['output']>;
  eventTime: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  requestId: Maybe<Scalars['String']['output']>;
  resourceId: Maybe<Scalars['String']['output']>;
  resourceType: Maybe<Scalars['String']['output']>;
  sessionId: Maybe<Scalars['String']['output']>;
  userAgent: Maybe<Scalars['String']['output']>;
  userEmail: Maybe<Scalars['String']['output']>;
  userId: Maybe<Scalars['uuid']['output']>;
  userRole: Maybe<Scalars['String']['output']>;
}

/** response of any mutation on the table "audit.audit_log" */
export interface AuditLogsMutationResponse {
  __typename?: 'auditLogsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuditLogs>;
}

/** on_conflict condition type for table "audit.audit_log" */
export interface AuditLogsOnConflict {
  constraint: AuditLogsConstraint;
  updateColumns?: Array<AuditLogsUpdateColumn>;
  where?: InputMaybe<AuditLogsBoolExp>;
}

/** Ordering options when selecting data from "audit.audit_log". */
export interface AuditLogsOrderBy {
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
}

/** primary key columns input for table: audit.audit_log */
export interface AuditLogsPkColumnsInput {
  id: Scalars['uuid']['input'];
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface AuditLogsPrependInput {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newValues?: InputMaybe<Scalars['jsonb']['input']>;
  oldValues?: InputMaybe<Scalars['jsonb']['input']>;
}

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
export interface AuditLogsSetInput {
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
}

/** Streaming cursor of the table "auditLogs" */
export interface AuditLogsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: AuditLogsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface AuditLogsStreamCursorValueInput {
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
}

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

export interface AuditLogsUpdates {
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
}

/** columns and relationships of "audit.auth_events" */
export interface AuthEvents {
  __typename?: 'authEvents';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  eventTime: Scalars['timestamptz']['output'];
  eventType: Scalars['String']['output'];
  failureReason: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  ipAddress: Maybe<Scalars['inet']['output']>;
  metadata: Maybe<Scalars['jsonb']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  userAgent: Maybe<Scalars['String']['output']>;
  userEmail: Maybe<Scalars['String']['output']>;
  userId: Maybe<Scalars['uuid']['output']>;
}


/** columns and relationships of "audit.auth_events" */
export type AuthEventsMetadataArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit.auth_events" */
export interface AuthEventsAggregate {
  __typename?: 'authEventsAggregate';
  aggregate: Maybe<AuthEventsAggregateFields>;
  nodes: Array<AuthEvents>;
}

/** aggregate fields of "audit.auth_events" */
export interface AuthEventsAggregateFields {
  __typename?: 'authEventsAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<AuthEventsMaxFields>;
  min: Maybe<AuthEventsMinFields>;
}


/** aggregate fields of "audit.auth_events" */
export type AuthEventsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<AuthEventsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export interface AuthEventsAppendInput {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
}

/** Boolean expression to filter rows from the table "audit.auth_events". All fields are combined with a logical 'AND'. */
export interface AuthEventsBoolExp {
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
}

/** unique or primary key constraints on table "audit.auth_events" */
export enum AuthEventsConstraint {
  /** unique or primary key constraint on columns "id" */
  auth_events_pkey = 'auth_events_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface AuthEventsDeleteAtPathInput {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface AuthEventsDeleteElemInput {
  metadata?: InputMaybe<Scalars['Int']['input']>;
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface AuthEventsDeleteKeyInput {
  metadata?: InputMaybe<Scalars['String']['input']>;
}

/** input type for inserting data into table "audit.auth_events" */
export interface AuthEventsInsertInput {
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
}

/** aggregate max on columns */
export interface AuthEventsMaxFields {
  __typename?: 'authEventsMaxFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  eventTime: Maybe<Scalars['timestamptz']['output']>;
  eventType: Maybe<Scalars['String']['output']>;
  failureReason: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  userAgent: Maybe<Scalars['String']['output']>;
  userEmail: Maybe<Scalars['String']['output']>;
  userId: Maybe<Scalars['uuid']['output']>;
}

/** aggregate min on columns */
export interface AuthEventsMinFields {
  __typename?: 'authEventsMinFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  eventTime: Maybe<Scalars['timestamptz']['output']>;
  eventType: Maybe<Scalars['String']['output']>;
  failureReason: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  userAgent: Maybe<Scalars['String']['output']>;
  userEmail: Maybe<Scalars['String']['output']>;
  userId: Maybe<Scalars['uuid']['output']>;
}

/** response of any mutation on the table "audit.auth_events" */
export interface AuthEventsMutationResponse {
  __typename?: 'authEventsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthEvents>;
}

/** on_conflict condition type for table "audit.auth_events" */
export interface AuthEventsOnConflict {
  constraint: AuthEventsConstraint;
  updateColumns?: Array<AuthEventsUpdateColumn>;
  where?: InputMaybe<AuthEventsBoolExp>;
}

/** Ordering options when selecting data from "audit.auth_events". */
export interface AuthEventsOrderBy {
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
}

/** primary key columns input for table: audit.auth_events */
export interface AuthEventsPkColumnsInput {
  id: Scalars['uuid']['input'];
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface AuthEventsPrependInput {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
}

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
export interface AuthEventsSetInput {
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
}

/** Streaming cursor of the table "authEvents" */
export interface AuthEventsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: AuthEventsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface AuthEventsStreamCursorValueInput {
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
}

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

export interface AuthEventsUpdates {
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
}

/** columns and relationships of "neon_auth.users_sync" */
export interface AuthUsersSync {
  __typename?: 'authUsersSync';
  /** Timestamp when the user was created in the auth system */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Timestamp when the user was deleted in the auth system */
  deletedAt: Maybe<Scalars['timestamptz']['output']>;
  /** User's email address from authentication provider */
  email: Maybe<Scalars['String']['output']>;
  /** Unique identifier from the authentication provider */
  id: Scalars['String']['output'];
  /** User's full name from authentication provider */
  name: Maybe<Scalars['String']['output']>;
  /** Complete JSON data from the authentication provider */
  rawJson: Scalars['jsonb']['output'];
  /** Timestamp when the user was last updated in the auth system */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}


/** columns and relationships of "neon_auth.users_sync" */
export type AuthUsersSyncRawJsonArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "neon_auth.users_sync" */
export interface AuthUsersSyncAggregate {
  __typename?: 'authUsersSyncAggregate';
  aggregate: Maybe<AuthUsersSyncAggregateFields>;
  nodes: Array<AuthUsersSync>;
}

/** aggregate fields of "neon_auth.users_sync" */
export interface AuthUsersSyncAggregateFields {
  __typename?: 'authUsersSyncAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<AuthUsersSyncMaxFields>;
  min: Maybe<AuthUsersSyncMinFields>;
}


/** aggregate fields of "neon_auth.users_sync" */
export type AuthUsersSyncAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<AuthUsersSyncSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export interface AuthUsersSyncAppendInput {
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['jsonb']['input']>;
}

/** Boolean expression to filter rows from the table "neon_auth.users_sync". All fields are combined with a logical 'AND'. */
export interface AuthUsersSyncBoolExp {
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
}

/** unique or primary key constraints on table "neon_auth.users_sync" */
export enum AuthUsersSyncConstraint {
  /** unique or primary key constraint on columns "id" */
  users_sync_pkey = 'users_sync_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface AuthUsersSyncDeleteAtPathInput {
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Array<Scalars['String']['input']>>;
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface AuthUsersSyncDeleteElemInput {
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['Int']['input']>;
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface AuthUsersSyncDeleteKeyInput {
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['String']['input']>;
}

/** input type for inserting data into table "neon_auth.users_sync" */
export interface AuthUsersSyncInsertInput {
  /** Timestamp when the user was deleted in the auth system */
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['jsonb']['input']>;
  /** Timestamp when the user was last updated in the auth system */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

/** aggregate max on columns */
export interface AuthUsersSyncMaxFields {
  __typename?: 'authUsersSyncMaxFields';
  /** Timestamp when the user was created in the auth system */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Timestamp when the user was deleted in the auth system */
  deletedAt: Maybe<Scalars['timestamptz']['output']>;
  /** User's email address from authentication provider */
  email: Maybe<Scalars['String']['output']>;
  /** Unique identifier from the authentication provider */
  id: Maybe<Scalars['String']['output']>;
  /** User's full name from authentication provider */
  name: Maybe<Scalars['String']['output']>;
  /** Timestamp when the user was last updated in the auth system */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** aggregate min on columns */
export interface AuthUsersSyncMinFields {
  __typename?: 'authUsersSyncMinFields';
  /** Timestamp when the user was created in the auth system */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Timestamp when the user was deleted in the auth system */
  deletedAt: Maybe<Scalars['timestamptz']['output']>;
  /** User's email address from authentication provider */
  email: Maybe<Scalars['String']['output']>;
  /** Unique identifier from the authentication provider */
  id: Maybe<Scalars['String']['output']>;
  /** User's full name from authentication provider */
  name: Maybe<Scalars['String']['output']>;
  /** Timestamp when the user was last updated in the auth system */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** response of any mutation on the table "neon_auth.users_sync" */
export interface AuthUsersSyncMutationResponse {
  __typename?: 'authUsersSyncMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthUsersSync>;
}

/** on_conflict condition type for table "neon_auth.users_sync" */
export interface AuthUsersSyncOnConflict {
  constraint: AuthUsersSyncConstraint;
  updateColumns?: Array<AuthUsersSyncUpdateColumn>;
  where?: InputMaybe<AuthUsersSyncBoolExp>;
}

/** Ordering options when selecting data from "neon_auth.users_sync". */
export interface AuthUsersSyncOrderBy {
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  rawJson?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: neon_auth.users_sync */
export interface AuthUsersSyncPkColumnsInput {
  /** Unique identifier from the authentication provider */
  id: Scalars['String']['input'];
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface AuthUsersSyncPrependInput {
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['jsonb']['input']>;
}

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
export interface AuthUsersSyncSetInput {
  /** Timestamp when the user was deleted in the auth system */
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['jsonb']['input']>;
  /** Timestamp when the user was last updated in the auth system */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

/** Streaming cursor of the table "authUsersSync" */
export interface AuthUsersSyncStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: AuthUsersSyncStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface AuthUsersSyncStreamCursorValueInput {
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
}

/** update columns of table "neon_auth.users_sync" */
export enum AuthUsersSyncUpdateColumn {
  /** column name */
  deletedAt = 'deletedAt',
  /** column name */
  rawJson = 'rawJson',
  /** column name */
  updatedAt = 'updatedAt'
}

export interface AuthUsersSyncUpdates {
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
}

/** columns and relationships of "billing_event_log" */
export interface BillingEventLogs {
  __typename?: 'billingEventLogs';
  /** An object relationship */
  billingInvoice: Maybe<BillingInvoices>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  createdBy: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  createdByUser: Maybe<Users>;
  eventType: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  invoiceId: Maybe<Scalars['uuid']['output']>;
  message: Maybe<Scalars['String']['output']>;
}

/** aggregated selection of "billing_event_log" */
export interface BillingEventLogsAggregate {
  __typename?: 'billingEventLogsAggregate';
  aggregate: Maybe<BillingEventLogsAggregateFields>;
  nodes: Array<BillingEventLogs>;
}

export interface BillingEventLogsAggregateBoolExp {
  count?: InputMaybe<BillingEventLogsAggregateBoolExpCount>;
}

export interface BillingEventLogsAggregateBoolExpCount {
  arguments?: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingEventLogsBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "billing_event_log" */
export interface BillingEventLogsAggregateFields {
  __typename?: 'billingEventLogsAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<BillingEventLogsMaxFields>;
  min: Maybe<BillingEventLogsMinFields>;
}


/** aggregate fields of "billing_event_log" */
export type BillingEventLogsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "billing_event_log" */
export interface BillingEventLogsAggregateOrderBy {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BillingEventLogsMaxOrderBy>;
  min?: InputMaybe<BillingEventLogsMinOrderBy>;
}

/** input type for inserting array relation for remote table "billing_event_log" */
export interface BillingEventLogsArrRelInsertInput {
  data: Array<BillingEventLogsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<BillingEventLogsOnConflict>;
}

/** Boolean expression to filter rows from the table "billing_event_log". All fields are combined with a logical 'AND'. */
export interface BillingEventLogsBoolExp {
  _and?: InputMaybe<Array<BillingEventLogsBoolExp>>;
  _not?: InputMaybe<BillingEventLogsBoolExp>;
  _or?: InputMaybe<Array<BillingEventLogsBoolExp>>;
  billingInvoice?: InputMaybe<BillingInvoicesBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdBy?: InputMaybe<UuidComparisonExp>;
  createdByUser?: InputMaybe<UsersBoolExp>;
  eventType?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  invoiceId?: InputMaybe<UuidComparisonExp>;
  message?: InputMaybe<StringComparisonExp>;
}

/** unique or primary key constraints on table "billing_event_log" */
export enum BillingEventLogsConstraint {
  /** unique or primary key constraint on columns "id" */
  billing_event_log_pkey = 'billing_event_log_pkey'
}

/** input type for inserting data into table "billing_event_log" */
export interface BillingEventLogsInsertInput {
  billingInvoice?: InputMaybe<BillingInvoicesObjRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  createdByUser?: InputMaybe<UsersObjRelInsertInput>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
}

/** aggregate max on columns */
export interface BillingEventLogsMaxFields {
  __typename?: 'billingEventLogsMaxFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  createdBy: Maybe<Scalars['uuid']['output']>;
  eventType: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  invoiceId: Maybe<Scalars['uuid']['output']>;
  message: Maybe<Scalars['String']['output']>;
}

/** order by max() on columns of table "billing_event_log" */
export interface BillingEventLogsMaxOrderBy {
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  eventType?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
}

/** aggregate min on columns */
export interface BillingEventLogsMinFields {
  __typename?: 'billingEventLogsMinFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  createdBy: Maybe<Scalars['uuid']['output']>;
  eventType: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  invoiceId: Maybe<Scalars['uuid']['output']>;
  message: Maybe<Scalars['String']['output']>;
}

/** order by min() on columns of table "billing_event_log" */
export interface BillingEventLogsMinOrderBy {
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  eventType?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
}

/** response of any mutation on the table "billing_event_log" */
export interface BillingEventLogsMutationResponse {
  __typename?: 'billingEventLogsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BillingEventLogs>;
}

/** on_conflict condition type for table "billing_event_log" */
export interface BillingEventLogsOnConflict {
  constraint: BillingEventLogsConstraint;
  updateColumns?: Array<BillingEventLogsUpdateColumn>;
  where?: InputMaybe<BillingEventLogsBoolExp>;
}

/** Ordering options when selecting data from "billing_event_log". */
export interface BillingEventLogsOrderBy {
  billingInvoice?: InputMaybe<BillingInvoicesOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  createdByUser?: InputMaybe<UsersOrderBy>;
  eventType?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: billing_event_log */
export interface BillingEventLogsPkColumnsInput {
  id: Scalars['uuid']['input'];
}

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
export interface BillingEventLogsSetInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
}

/** Streaming cursor of the table "billingEventLogs" */
export interface BillingEventLogsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: BillingEventLogsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface BillingEventLogsStreamCursorValueInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
}

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

export interface BillingEventLogsUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingEventLogsSetInput>;
  /** filter the rows which have to be updated */
  where: BillingEventLogsBoolExp;
}

/** columns and relationships of "billing_invoice" */
export interface BillingInvoice {
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
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  currency: Maybe<Scalars['String']['output']>;
  dueDate: Maybe<Scalars['date']['output']>;
  id: Scalars['uuid']['output'];
  issuedDate: Maybe<Scalars['date']['output']>;
  notes: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalAmount: Scalars['numeric']['output'];
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}


/** columns and relationships of "billing_invoice" */
export type BillingInvoiceBillingEventLogsArgs = {
  distinctOn: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where: InputMaybe<BillingEventLogsBoolExp>;
};


/** columns and relationships of "billing_invoice" */
export type BillingInvoiceBillingEventLogsAggregateArgs = {
  distinctOn: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where: InputMaybe<BillingEventLogsBoolExp>;
};

/** aggregated selection of "billing_invoice" */
export interface BillingInvoiceAggregate {
  __typename?: 'billingInvoiceAggregate';
  aggregate: Maybe<BillingInvoiceAggregateFields>;
  nodes: Array<BillingInvoice>;
}

export interface BillingInvoiceAggregateBoolExp {
  count?: InputMaybe<BillingInvoiceAggregateBoolExpCount>;
}

export interface BillingInvoiceAggregateBoolExpCount {
  arguments?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingInvoiceBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "billing_invoice" */
export interface BillingInvoiceAggregateFields {
  __typename?: 'billingInvoiceAggregateFields';
  avg: Maybe<BillingInvoiceAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<BillingInvoiceMaxFields>;
  min: Maybe<BillingInvoiceMinFields>;
  stddev: Maybe<BillingInvoiceStddevFields>;
  stddevPop: Maybe<BillingInvoiceStddevPopFields>;
  stddevSamp: Maybe<BillingInvoiceStddevSampFields>;
  sum: Maybe<BillingInvoiceSumFields>;
  varPop: Maybe<BillingInvoiceVarPopFields>;
  varSamp: Maybe<BillingInvoiceVarSampFields>;
  variance: Maybe<BillingInvoiceVarianceFields>;
}


/** aggregate fields of "billing_invoice" */
export type BillingInvoiceAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "billing_invoice" */
export interface BillingInvoiceAggregateOrderBy {
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
}

/** input type for inserting array relation for remote table "billing_invoice" */
export interface BillingInvoiceArrRelInsertInput {
  data: Array<BillingInvoiceInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<BillingInvoiceOnConflict>;
}

/** aggregate avg on columns */
export interface BillingInvoiceAvgFields {
  __typename?: 'billingInvoiceAvgFields';
  totalAmount: Maybe<Scalars['Float']['output']>;
}

/** order by avg() on columns of table "billing_invoice" */
export interface BillingInvoiceAvgOrderBy {
  totalAmount?: InputMaybe<OrderBy>;
}

/** Boolean expression to filter rows from the table "billing_invoice". All fields are combined with a logical 'AND'. */
export interface BillingInvoiceBoolExp {
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
}

/** unique or primary key constraints on table "billing_invoice" */
export enum BillingInvoiceConstraint {
  /** unique or primary key constraint on columns "id" */
  billing_invoice_pkey = 'billing_invoice_pkey'
}

/** input type for incrementing numeric columns in table "billing_invoice" */
export interface BillingInvoiceIncInput {
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
}

/** input type for inserting data into table "billing_invoice" */
export interface BillingInvoiceInsertInput {
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
}

/** aggregate max on columns */
export interface BillingInvoiceMaxFields {
  __typename?: 'billingInvoiceMaxFields';
  billingPeriodEnd: Maybe<Scalars['date']['output']>;
  billingPeriodStart: Maybe<Scalars['date']['output']>;
  clientId: Maybe<Scalars['uuid']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  currency: Maybe<Scalars['String']['output']>;
  dueDate: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  issuedDate: Maybe<Scalars['date']['output']>;
  notes: Maybe<Scalars['String']['output']>;
  status: Maybe<Scalars['String']['output']>;
  totalAmount: Maybe<Scalars['numeric']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by max() on columns of table "billing_invoice" */
export interface BillingInvoiceMaxOrderBy {
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
}

/** aggregate min on columns */
export interface BillingInvoiceMinFields {
  __typename?: 'billingInvoiceMinFields';
  billingPeriodEnd: Maybe<Scalars['date']['output']>;
  billingPeriodStart: Maybe<Scalars['date']['output']>;
  clientId: Maybe<Scalars['uuid']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  currency: Maybe<Scalars['String']['output']>;
  dueDate: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  issuedDate: Maybe<Scalars['date']['output']>;
  notes: Maybe<Scalars['String']['output']>;
  status: Maybe<Scalars['String']['output']>;
  totalAmount: Maybe<Scalars['numeric']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by min() on columns of table "billing_invoice" */
export interface BillingInvoiceMinOrderBy {
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
}

/** response of any mutation on the table "billing_invoice" */
export interface BillingInvoiceMutationResponse {
  __typename?: 'billingInvoiceMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BillingInvoice>;
}

/** on_conflict condition type for table "billing_invoice" */
export interface BillingInvoiceOnConflict {
  constraint: BillingInvoiceConstraint;
  updateColumns?: Array<BillingInvoiceUpdateColumn>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
}

/** Ordering options when selecting data from "billing_invoice". */
export interface BillingInvoiceOrderBy {
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
}

/** primary key columns input for table: billing_invoice */
export interface BillingInvoicePkColumnsInput {
  id: Scalars['uuid']['input'];
}

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
export interface BillingInvoiceSetInput {
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
}

/** aggregate stddev on columns */
export interface BillingInvoiceStddevFields {
  __typename?: 'billingInvoiceStddevFields';
  totalAmount: Maybe<Scalars['Float']['output']>;
}

/** order by stddev() on columns of table "billing_invoice" */
export interface BillingInvoiceStddevOrderBy {
  totalAmount?: InputMaybe<OrderBy>;
}

/** aggregate stddevPop on columns */
export interface BillingInvoiceStddevPopFields {
  __typename?: 'billingInvoiceStddevPopFields';
  totalAmount: Maybe<Scalars['Float']['output']>;
}

/** order by stddevPop() on columns of table "billing_invoice" */
export interface BillingInvoiceStddevPopOrderBy {
  totalAmount?: InputMaybe<OrderBy>;
}

/** aggregate stddevSamp on columns */
export interface BillingInvoiceStddevSampFields {
  __typename?: 'billingInvoiceStddevSampFields';
  totalAmount: Maybe<Scalars['Float']['output']>;
}

/** order by stddevSamp() on columns of table "billing_invoice" */
export interface BillingInvoiceStddevSampOrderBy {
  totalAmount?: InputMaybe<OrderBy>;
}

/** Streaming cursor of the table "billingInvoice" */
export interface BillingInvoiceStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: BillingInvoiceStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface BillingInvoiceStreamCursorValueInput {
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
}

/** aggregate sum on columns */
export interface BillingInvoiceSumFields {
  __typename?: 'billingInvoiceSumFields';
  totalAmount: Maybe<Scalars['numeric']['output']>;
}

/** order by sum() on columns of table "billing_invoice" */
export interface BillingInvoiceSumOrderBy {
  totalAmount?: InputMaybe<OrderBy>;
}

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

export interface BillingInvoiceUpdates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BillingInvoiceIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingInvoiceSetInput>;
  /** filter the rows which have to be updated */
  where: BillingInvoiceBoolExp;
}

/** aggregate varPop on columns */
export interface BillingInvoiceVarPopFields {
  __typename?: 'billingInvoiceVarPopFields';
  totalAmount: Maybe<Scalars['Float']['output']>;
}

/** order by varPop() on columns of table "billing_invoice" */
export interface BillingInvoiceVarPopOrderBy {
  totalAmount?: InputMaybe<OrderBy>;
}

/** aggregate varSamp on columns */
export interface BillingInvoiceVarSampFields {
  __typename?: 'billingInvoiceVarSampFields';
  totalAmount: Maybe<Scalars['Float']['output']>;
}

/** order by varSamp() on columns of table "billing_invoice" */
export interface BillingInvoiceVarSampOrderBy {
  totalAmount?: InputMaybe<OrderBy>;
}

/** aggregate variance on columns */
export interface BillingInvoiceVarianceFields {
  __typename?: 'billingInvoiceVarianceFields';
  totalAmount: Maybe<Scalars['Float']['output']>;
}

/** order by variance() on columns of table "billing_invoice" */
export interface BillingInvoiceVarianceOrderBy {
  totalAmount?: InputMaybe<OrderBy>;
}

/** columns and relationships of "billing_invoices" */
export interface BillingInvoices {
  __typename?: 'billingInvoices';
  /** An array relationship */
  billingItems: Array<BillingItems>;
  /** An aggregate relationship */
  billingItemsAggregate: BillingItemsAggregate;
  billingPeriodEnd: Scalars['date']['output'];
  billingPeriodStart: Scalars['date']['output'];
  /** An object relationship */
  client: Maybe<Clients>;
  clientId: Maybe<Scalars['uuid']['output']>;
  createdAt: Maybe<Scalars['timestamp']['output']>;
  id: Scalars['uuid']['output'];
  invoiceNumber: Scalars['String']['output'];
  status: Maybe<Scalars['String']['output']>;
  totalAmount: Maybe<Scalars['numeric']['output']>;
  updatedAt: Maybe<Scalars['timestamp']['output']>;
}


/** columns and relationships of "billing_invoices" */
export type BillingInvoicesBillingItemsArgs = {
  distinctOn: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingItemsOrderBy>>;
  where: InputMaybe<BillingItemsBoolExp>;
};


/** columns and relationships of "billing_invoices" */
export type BillingInvoicesBillingItemsAggregateArgs = {
  distinctOn: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingItemsOrderBy>>;
  where: InputMaybe<BillingItemsBoolExp>;
};

/** aggregated selection of "billing_invoices" */
export interface BillingInvoicesAggregate {
  __typename?: 'billingInvoicesAggregate';
  aggregate: Maybe<BillingInvoicesAggregateFields>;
  nodes: Array<BillingInvoices>;
}

export interface BillingInvoicesAggregateBoolExp {
  count?: InputMaybe<BillingInvoicesAggregateBoolExpCount>;
}

export interface BillingInvoicesAggregateBoolExpCount {
  arguments?: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingInvoicesBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "billing_invoices" */
export interface BillingInvoicesAggregateFields {
  __typename?: 'billingInvoicesAggregateFields';
  avg: Maybe<BillingInvoicesAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<BillingInvoicesMaxFields>;
  min: Maybe<BillingInvoicesMinFields>;
  stddev: Maybe<BillingInvoicesStddevFields>;
  stddevPop: Maybe<BillingInvoicesStddevPopFields>;
  stddevSamp: Maybe<BillingInvoicesStddevSampFields>;
  sum: Maybe<BillingInvoicesSumFields>;
  varPop: Maybe<BillingInvoicesVarPopFields>;
  varSamp: Maybe<BillingInvoicesVarSampFields>;
  variance: Maybe<BillingInvoicesVarianceFields>;
}


/** aggregate fields of "billing_invoices" */
export type BillingInvoicesAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "billing_invoices" */
export interface BillingInvoicesAggregateOrderBy {
  avg?: InputMaybe<BillingInvoicesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BillingInvoicesMaxOrderBy>;
  min?: InputMaybe<BillingInvoicesMinOrderBy>;
  stddev?: InputMaybe<BillingInvoicesStddevOrderBy>;
  stddevPop?: InputMaybe<BillingInvoicesStddevPopOrderBy>;
  stddevSamp?: InputMaybe<BillingInvoicesStddevSampOrderBy>;
  sum?: InputMaybe<BillingInvoicesSumOrderBy>;
  varPop?: InputMaybe<BillingInvoicesVarPopOrderBy>;
  varSamp?: InputMaybe<BillingInvoicesVarSampOrderBy>;
  variance?: InputMaybe<BillingInvoicesVarianceOrderBy>;
}

/** input type for inserting array relation for remote table "billing_invoices" */
export interface BillingInvoicesArrRelInsertInput {
  data: Array<BillingInvoicesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<BillingInvoicesOnConflict>;
}

/** aggregate avg on columns */
export interface BillingInvoicesAvgFields {
  __typename?: 'billingInvoicesAvgFields';
  totalAmount: Maybe<Scalars['Float']['output']>;
}

/** order by avg() on columns of table "billing_invoices" */
export interface BillingInvoicesAvgOrderBy {
  totalAmount?: InputMaybe<OrderBy>;
}

/** Boolean expression to filter rows from the table "billing_invoices". All fields are combined with a logical 'AND'. */
export interface BillingInvoicesBoolExp {
  _and?: InputMaybe<Array<BillingInvoicesBoolExp>>;
  _not?: InputMaybe<BillingInvoicesBoolExp>;
  _or?: InputMaybe<Array<BillingInvoicesBoolExp>>;
  billingItems?: InputMaybe<BillingItemsBoolExp>;
  billingItemsAggregate?: InputMaybe<BillingItemsAggregateBoolExp>;
  billingPeriodEnd?: InputMaybe<DateComparisonExp>;
  billingPeriodStart?: InputMaybe<DateComparisonExp>;
  client?: InputMaybe<ClientsBoolExp>;
  clientId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestampComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  invoiceNumber?: InputMaybe<StringComparisonExp>;
  status?: InputMaybe<StringComparisonExp>;
  totalAmount?: InputMaybe<NumericComparisonExp>;
  updatedAt?: InputMaybe<TimestampComparisonExp>;
}

/** unique or primary key constraints on table "billing_invoices" */
export enum BillingInvoicesConstraint {
  /** unique or primary key constraint on columns "invoice_number" */
  billing_invoices_invoice_number_key = 'billing_invoices_invoice_number_key',
  /** unique or primary key constraint on columns "id" */
  billing_invoices_pkey = 'billing_invoices_pkey'
}

/** input type for incrementing numeric columns in table "billing_invoices" */
export interface BillingInvoicesIncInput {
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
}

/** input type for inserting data into table "billing_invoices" */
export interface BillingInvoicesInsertInput {
  billingItems?: InputMaybe<BillingItemsArrRelInsertInput>;
  billingPeriodEnd?: InputMaybe<Scalars['date']['input']>;
  billingPeriodStart?: InputMaybe<Scalars['date']['input']>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceNumber?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamp']['input']>;
}

/** aggregate max on columns */
export interface BillingInvoicesMaxFields {
  __typename?: 'billingInvoicesMaxFields';
  billingPeriodEnd: Maybe<Scalars['date']['output']>;
  billingPeriodStart: Maybe<Scalars['date']['output']>;
  clientId: Maybe<Scalars['uuid']['output']>;
  createdAt: Maybe<Scalars['timestamp']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  invoiceNumber: Maybe<Scalars['String']['output']>;
  status: Maybe<Scalars['String']['output']>;
  totalAmount: Maybe<Scalars['numeric']['output']>;
  updatedAt: Maybe<Scalars['timestamp']['output']>;
}

/** order by max() on columns of table "billing_invoices" */
export interface BillingInvoicesMaxOrderBy {
  billingPeriodEnd?: InputMaybe<OrderBy>;
  billingPeriodStart?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceNumber?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** aggregate min on columns */
export interface BillingInvoicesMinFields {
  __typename?: 'billingInvoicesMinFields';
  billingPeriodEnd: Maybe<Scalars['date']['output']>;
  billingPeriodStart: Maybe<Scalars['date']['output']>;
  clientId: Maybe<Scalars['uuid']['output']>;
  createdAt: Maybe<Scalars['timestamp']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  invoiceNumber: Maybe<Scalars['String']['output']>;
  status: Maybe<Scalars['String']['output']>;
  totalAmount: Maybe<Scalars['numeric']['output']>;
  updatedAt: Maybe<Scalars['timestamp']['output']>;
}

/** order by min() on columns of table "billing_invoices" */
export interface BillingInvoicesMinOrderBy {
  billingPeriodEnd?: InputMaybe<OrderBy>;
  billingPeriodStart?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceNumber?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** response of any mutation on the table "billing_invoices" */
export interface BillingInvoicesMutationResponse {
  __typename?: 'billingInvoicesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BillingInvoices>;
}

/** input type for inserting object relation for remote table "billing_invoices" */
export interface BillingInvoicesObjRelInsertInput {
  data: BillingInvoicesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<BillingInvoicesOnConflict>;
}

/** on_conflict condition type for table "billing_invoices" */
export interface BillingInvoicesOnConflict {
  constraint: BillingInvoicesConstraint;
  updateColumns?: Array<BillingInvoicesUpdateColumn>;
  where?: InputMaybe<BillingInvoicesBoolExp>;
}

/** Ordering options when selecting data from "billing_invoices". */
export interface BillingInvoicesOrderBy {
  billingItemsAggregate?: InputMaybe<BillingItemsAggregateOrderBy>;
  billingPeriodEnd?: InputMaybe<OrderBy>;
  billingPeriodStart?: InputMaybe<OrderBy>;
  client?: InputMaybe<ClientsOrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceNumber?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: billing_invoices */
export interface BillingInvoicesPkColumnsInput {
  id: Scalars['uuid']['input'];
}

/** select columns of table "billing_invoices" */
export enum BillingInvoicesSelectColumn {
  /** column name */
  billingPeriodEnd = 'billingPeriodEnd',
  /** column name */
  billingPeriodStart = 'billingPeriodStart',
  /** column name */
  clientId = 'clientId',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  invoiceNumber = 'invoiceNumber',
  /** column name */
  status = 'status',
  /** column name */
  totalAmount = 'totalAmount',
  /** column name */
  updatedAt = 'updatedAt'
}

/** input type for updating data in table "billing_invoices" */
export interface BillingInvoicesSetInput {
  billingPeriodEnd?: InputMaybe<Scalars['date']['input']>;
  billingPeriodStart?: InputMaybe<Scalars['date']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceNumber?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamp']['input']>;
}

/** aggregate stddev on columns */
export interface BillingInvoicesStddevFields {
  __typename?: 'billingInvoicesStddevFields';
  totalAmount: Maybe<Scalars['Float']['output']>;
}

/** order by stddev() on columns of table "billing_invoices" */
export interface BillingInvoicesStddevOrderBy {
  totalAmount?: InputMaybe<OrderBy>;
}

/** aggregate stddevPop on columns */
export interface BillingInvoicesStddevPopFields {
  __typename?: 'billingInvoicesStddevPopFields';
  totalAmount: Maybe<Scalars['Float']['output']>;
}

/** order by stddevPop() on columns of table "billing_invoices" */
export interface BillingInvoicesStddevPopOrderBy {
  totalAmount?: InputMaybe<OrderBy>;
}

/** aggregate stddevSamp on columns */
export interface BillingInvoicesStddevSampFields {
  __typename?: 'billingInvoicesStddevSampFields';
  totalAmount: Maybe<Scalars['Float']['output']>;
}

/** order by stddevSamp() on columns of table "billing_invoices" */
export interface BillingInvoicesStddevSampOrderBy {
  totalAmount?: InputMaybe<OrderBy>;
}

/** Streaming cursor of the table "billingInvoices" */
export interface BillingInvoicesStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: BillingInvoicesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface BillingInvoicesStreamCursorValueInput {
  billingPeriodEnd?: InputMaybe<Scalars['date']['input']>;
  billingPeriodStart?: InputMaybe<Scalars['date']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceNumber?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamp']['input']>;
}

/** aggregate sum on columns */
export interface BillingInvoicesSumFields {
  __typename?: 'billingInvoicesSumFields';
  totalAmount: Maybe<Scalars['numeric']['output']>;
}

/** order by sum() on columns of table "billing_invoices" */
export interface BillingInvoicesSumOrderBy {
  totalAmount?: InputMaybe<OrderBy>;
}

/** update columns of table "billing_invoices" */
export enum BillingInvoicesUpdateColumn {
  /** column name */
  billingPeriodEnd = 'billingPeriodEnd',
  /** column name */
  billingPeriodStart = 'billingPeriodStart',
  /** column name */
  clientId = 'clientId',
  /** column name */
  createdAt = 'createdAt',
  /** column name */
  id = 'id',
  /** column name */
  invoiceNumber = 'invoiceNumber',
  /** column name */
  status = 'status',
  /** column name */
  totalAmount = 'totalAmount',
  /** column name */
  updatedAt = 'updatedAt'
}

export interface BillingInvoicesUpdates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BillingInvoicesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingInvoicesSetInput>;
  /** filter the rows which have to be updated */
  where: BillingInvoicesBoolExp;
}

/** aggregate varPop on columns */
export interface BillingInvoicesVarPopFields {
  __typename?: 'billingInvoicesVarPopFields';
  totalAmount: Maybe<Scalars['Float']['output']>;
}

/** order by varPop() on columns of table "billing_invoices" */
export interface BillingInvoicesVarPopOrderBy {
  totalAmount?: InputMaybe<OrderBy>;
}

/** aggregate varSamp on columns */
export interface BillingInvoicesVarSampFields {
  __typename?: 'billingInvoicesVarSampFields';
  totalAmount: Maybe<Scalars['Float']['output']>;
}

/** order by varSamp() on columns of table "billing_invoices" */
export interface BillingInvoicesVarSampOrderBy {
  totalAmount?: InputMaybe<OrderBy>;
}

/** aggregate variance on columns */
export interface BillingInvoicesVarianceFields {
  __typename?: 'billingInvoicesVarianceFields';
  totalAmount: Maybe<Scalars['Float']['output']>;
}

/** order by variance() on columns of table "billing_invoices" */
export interface BillingInvoicesVarianceOrderBy {
  totalAmount?: InputMaybe<OrderBy>;
}

/** columns and relationships of "billing_items" */
export interface BillingItems {
  __typename?: 'billingItems';
  amount: Maybe<Scalars['numeric']['output']>;
  createdAt: Maybe<Scalars['timestamp']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  invoiceId: Maybe<Scalars['uuid']['output']>;
  payrollId: Maybe<Scalars['uuid']['output']>;
  quantity: Scalars['Int']['output'];
  /** An object relationship */
  relatedInvoice: Maybe<BillingInvoices>;
  /** An object relationship */
  relatedPayroll: Maybe<Payrolls>;
  unitPrice: Scalars['numeric']['output'];
}

/** aggregated selection of "billing_items" */
export interface BillingItemsAggregate {
  __typename?: 'billingItemsAggregate';
  aggregate: Maybe<BillingItemsAggregateFields>;
  nodes: Array<BillingItems>;
}

export interface BillingItemsAggregateBoolExp {
  count?: InputMaybe<BillingItemsAggregateBoolExpCount>;
}

export interface BillingItemsAggregateBoolExpCount {
  arguments?: InputMaybe<Array<BillingItemsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingItemsBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "billing_items" */
export interface BillingItemsAggregateFields {
  __typename?: 'billingItemsAggregateFields';
  avg: Maybe<BillingItemsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<BillingItemsMaxFields>;
  min: Maybe<BillingItemsMinFields>;
  stddev: Maybe<BillingItemsStddevFields>;
  stddevPop: Maybe<BillingItemsStddevPopFields>;
  stddevSamp: Maybe<BillingItemsStddevSampFields>;
  sum: Maybe<BillingItemsSumFields>;
  varPop: Maybe<BillingItemsVarPopFields>;
  varSamp: Maybe<BillingItemsVarSampFields>;
  variance: Maybe<BillingItemsVarianceFields>;
}


/** aggregate fields of "billing_items" */
export type BillingItemsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<BillingItemsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "billing_items" */
export interface BillingItemsAggregateOrderBy {
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
}

/** input type for inserting array relation for remote table "billing_items" */
export interface BillingItemsArrRelInsertInput {
  data: Array<BillingItemsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<BillingItemsOnConflict>;
}

/** aggregate avg on columns */
export interface BillingItemsAvgFields {
  __typename?: 'billingItemsAvgFields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unitPrice: Maybe<Scalars['Float']['output']>;
}

/** order by avg() on columns of table "billing_items" */
export interface BillingItemsAvgOrderBy {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
}

/** Boolean expression to filter rows from the table "billing_items". All fields are combined with a logical 'AND'. */
export interface BillingItemsBoolExp {
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
  relatedInvoice?: InputMaybe<BillingInvoicesBoolExp>;
  relatedPayroll?: InputMaybe<PayrollsBoolExp>;
  unitPrice?: InputMaybe<NumericComparisonExp>;
}

/** unique or primary key constraints on table "billing_items" */
export enum BillingItemsConstraint {
  /** unique or primary key constraint on columns "id" */
  billing_items_pkey = 'billing_items_pkey'
}

/** input type for incrementing numeric columns in table "billing_items" */
export interface BillingItemsIncInput {
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
}

/** input type for inserting data into table "billing_items" */
export interface BillingItemsInsertInput {
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  relatedInvoice?: InputMaybe<BillingInvoicesObjRelInsertInput>;
  relatedPayroll?: InputMaybe<PayrollsObjRelInsertInput>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
}

/** aggregate max on columns */
export interface BillingItemsMaxFields {
  __typename?: 'billingItemsMaxFields';
  amount: Maybe<Scalars['numeric']['output']>;
  createdAt: Maybe<Scalars['timestamp']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  invoiceId: Maybe<Scalars['uuid']['output']>;
  payrollId: Maybe<Scalars['uuid']['output']>;
  quantity: Maybe<Scalars['Int']['output']>;
  unitPrice: Maybe<Scalars['numeric']['output']>;
}

/** order by max() on columns of table "billing_items" */
export interface BillingItemsMaxOrderBy {
  amount?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
}

/** aggregate min on columns */
export interface BillingItemsMinFields {
  __typename?: 'billingItemsMinFields';
  amount: Maybe<Scalars['numeric']['output']>;
  createdAt: Maybe<Scalars['timestamp']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  invoiceId: Maybe<Scalars['uuid']['output']>;
  payrollId: Maybe<Scalars['uuid']['output']>;
  quantity: Maybe<Scalars['Int']['output']>;
  unitPrice: Maybe<Scalars['numeric']['output']>;
}

/** order by min() on columns of table "billing_items" */
export interface BillingItemsMinOrderBy {
  amount?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
}

/** response of any mutation on the table "billing_items" */
export interface BillingItemsMutationResponse {
  __typename?: 'billingItemsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BillingItems>;
}

/** on_conflict condition type for table "billing_items" */
export interface BillingItemsOnConflict {
  constraint: BillingItemsConstraint;
  updateColumns?: Array<BillingItemsUpdateColumn>;
  where?: InputMaybe<BillingItemsBoolExp>;
}

/** Ordering options when selecting data from "billing_items". */
export interface BillingItemsOrderBy {
  amount?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  relatedInvoice?: InputMaybe<BillingInvoicesOrderBy>;
  relatedPayroll?: InputMaybe<PayrollsOrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: billing_items */
export interface BillingItemsPkColumnsInput {
  id: Scalars['uuid']['input'];
}

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
export interface BillingItemsSetInput {
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
}

/** aggregate stddev on columns */
export interface BillingItemsStddevFields {
  __typename?: 'billingItemsStddevFields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unitPrice: Maybe<Scalars['Float']['output']>;
}

/** order by stddev() on columns of table "billing_items" */
export interface BillingItemsStddevOrderBy {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
}

/** aggregate stddevPop on columns */
export interface BillingItemsStddevPopFields {
  __typename?: 'billingItemsStddevPopFields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unitPrice: Maybe<Scalars['Float']['output']>;
}

/** order by stddevPop() on columns of table "billing_items" */
export interface BillingItemsStddevPopOrderBy {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
}

/** aggregate stddevSamp on columns */
export interface BillingItemsStddevSampFields {
  __typename?: 'billingItemsStddevSampFields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unitPrice: Maybe<Scalars['Float']['output']>;
}

/** order by stddevSamp() on columns of table "billing_items" */
export interface BillingItemsStddevSampOrderBy {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
}

/** Streaming cursor of the table "billingItems" */
export interface BillingItemsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: BillingItemsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface BillingItemsStreamCursorValueInput {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
}

/** aggregate sum on columns */
export interface BillingItemsSumFields {
  __typename?: 'billingItemsSumFields';
  amount: Maybe<Scalars['numeric']['output']>;
  quantity: Maybe<Scalars['Int']['output']>;
  unitPrice: Maybe<Scalars['numeric']['output']>;
}

/** order by sum() on columns of table "billing_items" */
export interface BillingItemsSumOrderBy {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
}

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

export interface BillingItemsUpdates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BillingItemsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingItemsSetInput>;
  /** filter the rows which have to be updated */
  where: BillingItemsBoolExp;
}

/** aggregate varPop on columns */
export interface BillingItemsVarPopFields {
  __typename?: 'billingItemsVarPopFields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unitPrice: Maybe<Scalars['Float']['output']>;
}

/** order by varPop() on columns of table "billing_items" */
export interface BillingItemsVarPopOrderBy {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
}

/** aggregate varSamp on columns */
export interface BillingItemsVarSampFields {
  __typename?: 'billingItemsVarSampFields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unitPrice: Maybe<Scalars['Float']['output']>;
}

/** order by varSamp() on columns of table "billing_items" */
export interface BillingItemsVarSampOrderBy {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
}

/** aggregate variance on columns */
export interface BillingItemsVarianceFields {
  __typename?: 'billingItemsVarianceFields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unitPrice: Maybe<Scalars['Float']['output']>;
}

/** order by variance() on columns of table "billing_items" */
export interface BillingItemsVarianceOrderBy {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
}

/** columns and relationships of "billing_plan" */
export interface BillingPlans {
  __typename?: 'billingPlans';
  /** An array relationship */
  clientBillingAssignments: Array<ClientBillingAssignments>;
  /** An aggregate relationship */
  clientBillingAssignmentsAggregate: ClientBillingAssignmentsAggregate;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  currency: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  ratePerPayroll: Scalars['numeric']['output'];
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}


/** columns and relationships of "billing_plan" */
export type BillingPlansClientBillingAssignmentsArgs = {
  distinctOn: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


/** columns and relationships of "billing_plan" */
export type BillingPlansClientBillingAssignmentsAggregateArgs = {
  distinctOn: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where: InputMaybe<ClientBillingAssignmentsBoolExp>;
};

/** aggregated selection of "billing_plan" */
export interface BillingPlansAggregate {
  __typename?: 'billingPlansAggregate';
  aggregate: Maybe<BillingPlansAggregateFields>;
  nodes: Array<BillingPlans>;
}

/** aggregate fields of "billing_plan" */
export interface BillingPlansAggregateFields {
  __typename?: 'billingPlansAggregateFields';
  avg: Maybe<BillingPlansAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<BillingPlansMaxFields>;
  min: Maybe<BillingPlansMinFields>;
  stddev: Maybe<BillingPlansStddevFields>;
  stddevPop: Maybe<BillingPlansStddevPopFields>;
  stddevSamp: Maybe<BillingPlansStddevSampFields>;
  sum: Maybe<BillingPlansSumFields>;
  varPop: Maybe<BillingPlansVarPopFields>;
  varSamp: Maybe<BillingPlansVarSampFields>;
  variance: Maybe<BillingPlansVarianceFields>;
}


/** aggregate fields of "billing_plan" */
export type BillingPlansAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<BillingPlansSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export interface BillingPlansAvgFields {
  __typename?: 'billingPlansAvgFields';
  ratePerPayroll: Maybe<Scalars['Float']['output']>;
}

/** Boolean expression to filter rows from the table "billing_plan". All fields are combined with a logical 'AND'. */
export interface BillingPlansBoolExp {
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
}

/** unique or primary key constraints on table "billing_plan" */
export enum BillingPlansConstraint {
  /** unique or primary key constraint on columns "id" */
  billing_plan_pkey = 'billing_plan_pkey'
}

/** input type for incrementing numeric columns in table "billing_plan" */
export interface BillingPlansIncInput {
  ratePerPayroll?: InputMaybe<Scalars['numeric']['input']>;
}

/** input type for inserting data into table "billing_plan" */
export interface BillingPlansInsertInput {
  clientBillingAssignments?: InputMaybe<ClientBillingAssignmentsArrRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  ratePerPayroll?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

/** aggregate max on columns */
export interface BillingPlansMaxFields {
  __typename?: 'billingPlansMaxFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  currency: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  ratePerPayroll: Maybe<Scalars['numeric']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** aggregate min on columns */
export interface BillingPlansMinFields {
  __typename?: 'billingPlansMinFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  currency: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  ratePerPayroll: Maybe<Scalars['numeric']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** response of any mutation on the table "billing_plan" */
export interface BillingPlansMutationResponse {
  __typename?: 'billingPlansMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BillingPlans>;
}

/** input type for inserting object relation for remote table "billing_plan" */
export interface BillingPlansObjRelInsertInput {
  data: BillingPlansInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<BillingPlansOnConflict>;
}

/** on_conflict condition type for table "billing_plan" */
export interface BillingPlansOnConflict {
  constraint: BillingPlansConstraint;
  updateColumns?: Array<BillingPlansUpdateColumn>;
  where?: InputMaybe<BillingPlansBoolExp>;
}

/** Ordering options when selecting data from "billing_plan". */
export interface BillingPlansOrderBy {
  clientBillingAssignmentsAggregate?: InputMaybe<ClientBillingAssignmentsAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  ratePerPayroll?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: billing_plan */
export interface BillingPlansPkColumnsInput {
  id: Scalars['uuid']['input'];
}

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
export interface BillingPlansSetInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  ratePerPayroll?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

/** aggregate stddev on columns */
export interface BillingPlansStddevFields {
  __typename?: 'billingPlansStddevFields';
  ratePerPayroll: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevPop on columns */
export interface BillingPlansStddevPopFields {
  __typename?: 'billingPlansStddevPopFields';
  ratePerPayroll: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevSamp on columns */
export interface BillingPlansStddevSampFields {
  __typename?: 'billingPlansStddevSampFields';
  ratePerPayroll: Maybe<Scalars['Float']['output']>;
}

/** Streaming cursor of the table "billingPlans" */
export interface BillingPlansStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: BillingPlansStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface BillingPlansStreamCursorValueInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  ratePerPayroll?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

/** aggregate sum on columns */
export interface BillingPlansSumFields {
  __typename?: 'billingPlansSumFields';
  ratePerPayroll: Maybe<Scalars['numeric']['output']>;
}

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

export interface BillingPlansUpdates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BillingPlansIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingPlansSetInput>;
  /** filter the rows which have to be updated */
  where: BillingPlansBoolExp;
}

/** aggregate varPop on columns */
export interface BillingPlansVarPopFields {
  __typename?: 'billingPlansVarPopFields';
  ratePerPayroll: Maybe<Scalars['Float']['output']>;
}

/** aggregate varSamp on columns */
export interface BillingPlansVarSampFields {
  __typename?: 'billingPlansVarSampFields';
  ratePerPayroll: Maybe<Scalars['Float']['output']>;
}

/** aggregate variance on columns */
export interface BillingPlansVarianceFields {
  __typename?: 'billingPlansVarianceFields';
  ratePerPayroll: Maybe<Scalars['Float']['output']>;
}

/** columns and relationships of "client_billing_assignment" */
export interface ClientBillingAssignments {
  __typename?: 'clientBillingAssignments';
  /** An object relationship */
  assignedBillingPlan: BillingPlans;
  /** An object relationship */
  assignedClient: Clients;
  billingPlanId: Scalars['uuid']['output'];
  clientId: Scalars['uuid']['output'];
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  endDate: Maybe<Scalars['date']['output']>;
  id: Scalars['uuid']['output'];
  isActive: Maybe<Scalars['Boolean']['output']>;
  startDate: Scalars['date']['output'];
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** aggregated selection of "client_billing_assignment" */
export interface ClientBillingAssignmentsAggregate {
  __typename?: 'clientBillingAssignmentsAggregate';
  aggregate: Maybe<ClientBillingAssignmentsAggregateFields>;
  nodes: Array<ClientBillingAssignments>;
}

export interface ClientBillingAssignmentsAggregateBoolExp {
  bool_and?: InputMaybe<ClientBillingAssignmentsAggregateBoolExpBoolAnd>;
  bool_or?: InputMaybe<ClientBillingAssignmentsAggregateBoolExpBoolOr>;
  count?: InputMaybe<ClientBillingAssignmentsAggregateBoolExpCount>;
}

export interface ClientBillingAssignmentsAggregateBoolExpBoolAnd {
  arguments: ClientBillingAssignmentsSelectColumnClientBillingAssignmentsAggregateBoolExpBoolAndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientBillingAssignmentsBoolExp>;
  predicate: BooleanComparisonExp;
}

export interface ClientBillingAssignmentsAggregateBoolExpBoolOr {
  arguments: ClientBillingAssignmentsSelectColumnClientBillingAssignmentsAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientBillingAssignmentsBoolExp>;
  predicate: BooleanComparisonExp;
}

export interface ClientBillingAssignmentsAggregateBoolExpCount {
  arguments?: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientBillingAssignmentsBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "client_billing_assignment" */
export interface ClientBillingAssignmentsAggregateFields {
  __typename?: 'clientBillingAssignmentsAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<ClientBillingAssignmentsMaxFields>;
  min: Maybe<ClientBillingAssignmentsMinFields>;
}


/** aggregate fields of "client_billing_assignment" */
export type ClientBillingAssignmentsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "client_billing_assignment" */
export interface ClientBillingAssignmentsAggregateOrderBy {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ClientBillingAssignmentsMaxOrderBy>;
  min?: InputMaybe<ClientBillingAssignmentsMinOrderBy>;
}

/** input type for inserting array relation for remote table "client_billing_assignment" */
export interface ClientBillingAssignmentsArrRelInsertInput {
  data: Array<ClientBillingAssignmentsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<ClientBillingAssignmentsOnConflict>;
}

/** Boolean expression to filter rows from the table "client_billing_assignment". All fields are combined with a logical 'AND'. */
export interface ClientBillingAssignmentsBoolExp {
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
}

/** unique or primary key constraints on table "client_billing_assignment" */
export enum ClientBillingAssignmentsConstraint {
  /** unique or primary key constraint on columns "id" */
  client_billing_assignment_pkey = 'client_billing_assignment_pkey'
}

/** input type for inserting data into table "client_billing_assignment" */
export interface ClientBillingAssignmentsInsertInput {
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
}

/** aggregate max on columns */
export interface ClientBillingAssignmentsMaxFields {
  __typename?: 'clientBillingAssignmentsMaxFields';
  billingPlanId: Maybe<Scalars['uuid']['output']>;
  clientId: Maybe<Scalars['uuid']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  endDate: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  startDate: Maybe<Scalars['date']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by max() on columns of table "client_billing_assignment" */
export interface ClientBillingAssignmentsMaxOrderBy {
  billingPlanId?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  endDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  startDate?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** aggregate min on columns */
export interface ClientBillingAssignmentsMinFields {
  __typename?: 'clientBillingAssignmentsMinFields';
  billingPlanId: Maybe<Scalars['uuid']['output']>;
  clientId: Maybe<Scalars['uuid']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  endDate: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  startDate: Maybe<Scalars['date']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by min() on columns of table "client_billing_assignment" */
export interface ClientBillingAssignmentsMinOrderBy {
  billingPlanId?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  endDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  startDate?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** response of any mutation on the table "client_billing_assignment" */
export interface ClientBillingAssignmentsMutationResponse {
  __typename?: 'clientBillingAssignmentsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<ClientBillingAssignments>;
}

/** on_conflict condition type for table "client_billing_assignment" */
export interface ClientBillingAssignmentsOnConflict {
  constraint: ClientBillingAssignmentsConstraint;
  updateColumns?: Array<ClientBillingAssignmentsUpdateColumn>;
  where?: InputMaybe<ClientBillingAssignmentsBoolExp>;
}

/** Ordering options when selecting data from "client_billing_assignment". */
export interface ClientBillingAssignmentsOrderBy {
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
}

/** primary key columns input for table: client_billing_assignment */
export interface ClientBillingAssignmentsPkColumnsInput {
  id: Scalars['uuid']['input'];
}

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
export interface ClientBillingAssignmentsSetInput {
  billingPlanId?: InputMaybe<Scalars['uuid']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  endDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['date']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

/** Streaming cursor of the table "clientBillingAssignments" */
export interface ClientBillingAssignmentsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: ClientBillingAssignmentsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface ClientBillingAssignmentsStreamCursorValueInput {
  billingPlanId?: InputMaybe<Scalars['uuid']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  endDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['date']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

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

export interface ClientBillingAssignmentsUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ClientBillingAssignmentsSetInput>;
  /** filter the rows which have to be updated */
  where: ClientBillingAssignmentsBoolExp;
}

/** columns and relationships of "client_external_systems" */
export interface ClientExternalSystems {
  __typename?: 'clientExternalSystems';
  /** Reference to the client */
  clientId: Scalars['uuid']['output'];
  /** Timestamp when the mapping was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Reference to the external system */
  externalSystemId: Scalars['uuid']['output'];
  /** Unique identifier for the client-system mapping */
  id: Scalars['uuid']['output'];
  /** An object relationship */
  linkedClient: Clients;
  /** An object relationship */
  linkedExternalSystem: ExternalSystems;
  /** Client identifier in the external system */
  systemClientId: Maybe<Scalars['String']['output']>;
  /** Timestamp when the mapping was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** aggregated selection of "client_external_systems" */
export interface ClientExternalSystemsAggregate {
  __typename?: 'clientExternalSystemsAggregate';
  aggregate: Maybe<ClientExternalSystemsAggregateFields>;
  nodes: Array<ClientExternalSystems>;
}

export interface ClientExternalSystemsAggregateBoolExp {
  count?: InputMaybe<ClientExternalSystemsAggregateBoolExpCount>;
}

export interface ClientExternalSystemsAggregateBoolExpCount {
  arguments?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientExternalSystemsBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "client_external_systems" */
export interface ClientExternalSystemsAggregateFields {
  __typename?: 'clientExternalSystemsAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<ClientExternalSystemsMaxFields>;
  min: Maybe<ClientExternalSystemsMinFields>;
}


/** aggregate fields of "client_external_systems" */
export type ClientExternalSystemsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "client_external_systems" */
export interface ClientExternalSystemsAggregateOrderBy {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ClientExternalSystemsMaxOrderBy>;
  min?: InputMaybe<ClientExternalSystemsMinOrderBy>;
}

/** input type for inserting array relation for remote table "client_external_systems" */
export interface ClientExternalSystemsArrRelInsertInput {
  data: Array<ClientExternalSystemsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<ClientExternalSystemsOnConflict>;
}

/** Boolean expression to filter rows from the table "client_external_systems". All fields are combined with a logical 'AND'. */
export interface ClientExternalSystemsBoolExp {
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
}

/** unique or primary key constraints on table "client_external_systems" */
export enum ClientExternalSystemsConstraint {
  /** unique or primary key constraint on columns "client_id", "system_id" */
  client_external_systems_client_id_system_id_key = 'client_external_systems_client_id_system_id_key',
  /** unique or primary key constraint on columns "id" */
  client_external_systems_pkey = 'client_external_systems_pkey'
}

/** input type for inserting data into table "client_external_systems" */
export interface ClientExternalSystemsInsertInput {
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
}

/** aggregate max on columns */
export interface ClientExternalSystemsMaxFields {
  __typename?: 'clientExternalSystemsMaxFields';
  /** Reference to the client */
  clientId: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the mapping was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Reference to the external system */
  externalSystemId: Maybe<Scalars['uuid']['output']>;
  /** Unique identifier for the client-system mapping */
  id: Maybe<Scalars['uuid']['output']>;
  /** Client identifier in the external system */
  systemClientId: Maybe<Scalars['String']['output']>;
  /** Timestamp when the mapping was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by max() on columns of table "client_external_systems" */
export interface ClientExternalSystemsMaxOrderBy {
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
}

/** aggregate min on columns */
export interface ClientExternalSystemsMinFields {
  __typename?: 'clientExternalSystemsMinFields';
  /** Reference to the client */
  clientId: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the mapping was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Reference to the external system */
  externalSystemId: Maybe<Scalars['uuid']['output']>;
  /** Unique identifier for the client-system mapping */
  id: Maybe<Scalars['uuid']['output']>;
  /** Client identifier in the external system */
  systemClientId: Maybe<Scalars['String']['output']>;
  /** Timestamp when the mapping was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by min() on columns of table "client_external_systems" */
export interface ClientExternalSystemsMinOrderBy {
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
}

/** response of any mutation on the table "client_external_systems" */
export interface ClientExternalSystemsMutationResponse {
  __typename?: 'clientExternalSystemsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<ClientExternalSystems>;
}

/** on_conflict condition type for table "client_external_systems" */
export interface ClientExternalSystemsOnConflict {
  constraint: ClientExternalSystemsConstraint;
  updateColumns?: Array<ClientExternalSystemsUpdateColumn>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
}

/** Ordering options when selecting data from "client_external_systems". */
export interface ClientExternalSystemsOrderBy {
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  externalSystemId?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  linkedClient?: InputMaybe<ClientsOrderBy>;
  linkedExternalSystem?: InputMaybe<ExternalSystemsOrderBy>;
  systemClientId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: client_external_systems */
export interface ClientExternalSystemsPkColumnsInput {
  /** Unique identifier for the client-system mapping */
  id: Scalars['uuid']['input'];
}

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
export interface ClientExternalSystemsSetInput {
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
}

/** Streaming cursor of the table "clientExternalSystems" */
export interface ClientExternalSystemsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: ClientExternalSystemsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface ClientExternalSystemsStreamCursorValueInput {
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
}

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

export interface ClientExternalSystemsUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ClientExternalSystemsSetInput>;
  /** filter the rows which have to be updated */
  where: ClientExternalSystemsBoolExp;
}

/** columns and relationships of "clients" */
export interface Clients {
  __typename?: 'clients';
  /** Whether the client is currently active */
  active: Maybe<Scalars['Boolean']['output']>;
  /** An array relationship */
  billingAssignments: Array<ClientBillingAssignments>;
  /** An aggregate relationship */
  billingAssignmentsAggregate: ClientBillingAssignmentsAggregate;
  /** An array relationship */
  billingInvoices: Array<BillingInvoices>;
  /** An aggregate relationship */
  billingInvoicesAggregate: BillingInvoiceAggregate;
  /** An array relationship */
  billing_invoices: Array<BillingInvoice>;
  /** Email address for the client contact */
  contactEmail: Maybe<Scalars['String']['output']>;
  /** Primary contact person at the client */
  contactPerson: Maybe<Scalars['String']['output']>;
  /** Phone number for the client contact */
  contactPhone: Maybe<Scalars['String']['output']>;
  /** Timestamp when the client was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
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
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}


/** columns and relationships of "clients" */
export type ClientsBillingAssignmentsArgs = {
  distinctOn: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsBillingAssignmentsAggregateArgs = {
  distinctOn: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsBillingInvoicesArgs = {
  distinctOn: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingInvoicesOrderBy>>;
  where: InputMaybe<BillingInvoicesBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsBillingInvoicesAggregateArgs = {
  distinctOn: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where: InputMaybe<BillingInvoiceBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsBillingInvoicesArgs = {
  distinctOn: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where: InputMaybe<BillingInvoiceBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsExternalSystemsArgs = {
  distinctOn: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where: InputMaybe<ClientExternalSystemsBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsExternalSystemsAggregateArgs = {
  distinctOn: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where: InputMaybe<ClientExternalSystemsBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsPayrollsArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsPayrollsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};

/** aggregated selection of "clients" */
export interface ClientsAggregate {
  __typename?: 'clientsAggregate';
  aggregate: Maybe<ClientsAggregateFields>;
  nodes: Array<Clients>;
}

export interface ClientsAggregateBoolExp {
  bool_and?: InputMaybe<ClientsAggregateBoolExpBoolAnd>;
  bool_or?: InputMaybe<ClientsAggregateBoolExpBoolOr>;
  count?: InputMaybe<ClientsAggregateBoolExpCount>;
}

export interface ClientsAggregateBoolExpBoolAnd {
  arguments: ClientsSelectColumnClientsAggregateBoolExpBoolAndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientsBoolExp>;
  predicate: BooleanComparisonExp;
}

export interface ClientsAggregateBoolExpBoolOr {
  arguments: ClientsSelectColumnClientsAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientsBoolExp>;
  predicate: BooleanComparisonExp;
}

export interface ClientsAggregateBoolExpCount {
  arguments?: InputMaybe<Array<ClientsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientsBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "clients" */
export interface ClientsAggregateFields {
  __typename?: 'clientsAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<ClientsMaxFields>;
  min: Maybe<ClientsMinFields>;
}


/** aggregate fields of "clients" */
export type ClientsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<ClientsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "clients" */
export interface ClientsAggregateOrderBy {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ClientsMaxOrderBy>;
  min?: InputMaybe<ClientsMinOrderBy>;
}

/** input type for inserting array relation for remote table "clients" */
export interface ClientsArrRelInsertInput {
  data: Array<ClientsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<ClientsOnConflict>;
}

/** Boolean expression to filter rows from the table "clients". All fields are combined with a logical 'AND'. */
export interface ClientsBoolExp {
  _and?: InputMaybe<Array<ClientsBoolExp>>;
  _not?: InputMaybe<ClientsBoolExp>;
  _or?: InputMaybe<Array<ClientsBoolExp>>;
  active?: InputMaybe<BooleanComparisonExp>;
  billingAssignments?: InputMaybe<ClientBillingAssignmentsBoolExp>;
  billingAssignmentsAggregate?: InputMaybe<ClientBillingAssignmentsAggregateBoolExp>;
  billingInvoices?: InputMaybe<BillingInvoicesBoolExp>;
  billingInvoicesAggregate?: InputMaybe<BillingInvoicesAggregateBoolExp>;
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
}

/** unique or primary key constraints on table "clients" */
export enum ClientsConstraint {
  /** unique or primary key constraint on columns "id" */
  clients_pkey = 'clients_pkey'
}

/** input type for inserting data into table "clients" */
export interface ClientsInsertInput {
  /** Whether the client is currently active */
  active?: InputMaybe<Scalars['Boolean']['input']>;
  billingAssignments?: InputMaybe<ClientBillingAssignmentsArrRelInsertInput>;
  billingInvoices?: InputMaybe<BillingInvoicesArrRelInsertInput>;
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
}

/** aggregate max on columns */
export interface ClientsMaxFields {
  __typename?: 'clientsMaxFields';
  /** Email address for the client contact */
  contactEmail: Maybe<Scalars['String']['output']>;
  /** Primary contact person at the client */
  contactPerson: Maybe<Scalars['String']['output']>;
  /** Phone number for the client contact */
  contactPhone: Maybe<Scalars['String']['output']>;
  /** Timestamp when the client was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the client */
  id: Maybe<Scalars['uuid']['output']>;
  /** Client company name */
  name: Maybe<Scalars['String']['output']>;
  /** Timestamp when the client was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by max() on columns of table "clients" */
export interface ClientsMaxOrderBy {
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
}

/** aggregate min on columns */
export interface ClientsMinFields {
  __typename?: 'clientsMinFields';
  /** Email address for the client contact */
  contactEmail: Maybe<Scalars['String']['output']>;
  /** Primary contact person at the client */
  contactPerson: Maybe<Scalars['String']['output']>;
  /** Phone number for the client contact */
  contactPhone: Maybe<Scalars['String']['output']>;
  /** Timestamp when the client was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the client */
  id: Maybe<Scalars['uuid']['output']>;
  /** Client company name */
  name: Maybe<Scalars['String']['output']>;
  /** Timestamp when the client was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by min() on columns of table "clients" */
export interface ClientsMinOrderBy {
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
}

/** response of any mutation on the table "clients" */
export interface ClientsMutationResponse {
  __typename?: 'clientsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Clients>;
}

/** input type for inserting object relation for remote table "clients" */
export interface ClientsObjRelInsertInput {
  data: ClientsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<ClientsOnConflict>;
}

/** on_conflict condition type for table "clients" */
export interface ClientsOnConflict {
  constraint: ClientsConstraint;
  updateColumns?: Array<ClientsUpdateColumn>;
  where?: InputMaybe<ClientsBoolExp>;
}

/** Ordering options when selecting data from "clients". */
export interface ClientsOrderBy {
  active?: InputMaybe<OrderBy>;
  billingAssignmentsAggregate?: InputMaybe<ClientBillingAssignmentsAggregateOrderBy>;
  billingInvoicesAggregate?: InputMaybe<BillingInvoicesAggregateOrderBy>;
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
}

/** primary key columns input for table: clients */
export interface ClientsPkColumnsInput {
  /** Unique identifier for the client */
  id: Scalars['uuid']['input'];
}

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
export interface ClientsSetInput {
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
}

/** Streaming cursor of the table "clients" */
export interface ClientsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: ClientsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface ClientsStreamCursorValueInput {
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
}

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

export interface ClientsUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ClientsSetInput>;
  /** filter the rows which have to be updated */
  where: ClientsBoolExp;
}

export interface CreatePayrollVersionArgs {
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
}

export interface CreatePayrollVersionSimpleArgs {
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  version_reason?: InputMaybe<Scalars['String']['input']>;
}

/** columns and relationships of "current_payrolls" */
export interface CurrentPayrolls {
  __typename?: 'currentPayrolls';
  backupConsultantUserId: Maybe<Scalars['uuid']['output']>;
  clientId: Maybe<Scalars['uuid']['output']>;
  clientName: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  cycleId: Maybe<Scalars['uuid']['output']>;
  dateTypeId: Maybe<Scalars['uuid']['output']>;
  dateValue: Maybe<Scalars['Int']['output']>;
  goLiveDate: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  managerUserId: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  parentPayrollId: Maybe<Scalars['uuid']['output']>;
  payrollCycleName: Maybe<Scalars['payroll_cycle_type']['output']>;
  payrollDateTypeName: Maybe<Scalars['payroll_date_type']['output']>;
  primaryConsultantUserId: Maybe<Scalars['uuid']['output']>;
  supersededDate: Maybe<Scalars['date']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
  versionNumber: Maybe<Scalars['Int']['output']>;
  versionReason: Maybe<Scalars['String']['output']>;
}

/** aggregated selection of "current_payrolls" */
export interface CurrentPayrollsAggregate {
  __typename?: 'currentPayrollsAggregate';
  aggregate: Maybe<CurrentPayrollsAggregateFields>;
  nodes: Array<CurrentPayrolls>;
}

/** aggregate fields of "current_payrolls" */
export interface CurrentPayrollsAggregateFields {
  __typename?: 'currentPayrollsAggregateFields';
  avg: Maybe<CurrentPayrollsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<CurrentPayrollsMaxFields>;
  min: Maybe<CurrentPayrollsMinFields>;
  stddev: Maybe<CurrentPayrollsStddevFields>;
  stddevPop: Maybe<CurrentPayrollsStddevPopFields>;
  stddevSamp: Maybe<CurrentPayrollsStddevSampFields>;
  sum: Maybe<CurrentPayrollsSumFields>;
  varPop: Maybe<CurrentPayrollsVarPopFields>;
  varSamp: Maybe<CurrentPayrollsVarSampFields>;
  variance: Maybe<CurrentPayrollsVarianceFields>;
}


/** aggregate fields of "current_payrolls" */
export type CurrentPayrollsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export interface CurrentPayrollsAvgFields {
  __typename?: 'currentPayrollsAvgFields';
  dateValue: Maybe<Scalars['Float']['output']>;
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** Boolean expression to filter rows from the table "current_payrolls". All fields are combined with a logical 'AND'. */
export interface CurrentPayrollsBoolExp {
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
}

/** aggregate max on columns */
export interface CurrentPayrollsMaxFields {
  __typename?: 'currentPayrollsMaxFields';
  backupConsultantUserId: Maybe<Scalars['uuid']['output']>;
  clientId: Maybe<Scalars['uuid']['output']>;
  clientName: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  cycleId: Maybe<Scalars['uuid']['output']>;
  dateTypeId: Maybe<Scalars['uuid']['output']>;
  dateValue: Maybe<Scalars['Int']['output']>;
  goLiveDate: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  managerUserId: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  parentPayrollId: Maybe<Scalars['uuid']['output']>;
  payrollCycleName: Maybe<Scalars['payroll_cycle_type']['output']>;
  payrollDateTypeName: Maybe<Scalars['payroll_date_type']['output']>;
  primaryConsultantUserId: Maybe<Scalars['uuid']['output']>;
  supersededDate: Maybe<Scalars['date']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
  versionNumber: Maybe<Scalars['Int']['output']>;
  versionReason: Maybe<Scalars['String']['output']>;
}

/** aggregate min on columns */
export interface CurrentPayrollsMinFields {
  __typename?: 'currentPayrollsMinFields';
  backupConsultantUserId: Maybe<Scalars['uuid']['output']>;
  clientId: Maybe<Scalars['uuid']['output']>;
  clientName: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  cycleId: Maybe<Scalars['uuid']['output']>;
  dateTypeId: Maybe<Scalars['uuid']['output']>;
  dateValue: Maybe<Scalars['Int']['output']>;
  goLiveDate: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  managerUserId: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  parentPayrollId: Maybe<Scalars['uuid']['output']>;
  payrollCycleName: Maybe<Scalars['payroll_cycle_type']['output']>;
  payrollDateTypeName: Maybe<Scalars['payroll_date_type']['output']>;
  primaryConsultantUserId: Maybe<Scalars['uuid']['output']>;
  supersededDate: Maybe<Scalars['date']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
  versionNumber: Maybe<Scalars['Int']['output']>;
  versionReason: Maybe<Scalars['String']['output']>;
}

/** Ordering options when selecting data from "current_payrolls". */
export interface CurrentPayrollsOrderBy {
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
}

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
export interface CurrentPayrollsStddevFields {
  __typename?: 'currentPayrollsStddevFields';
  dateValue: Maybe<Scalars['Float']['output']>;
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevPop on columns */
export interface CurrentPayrollsStddevPopFields {
  __typename?: 'currentPayrollsStddevPopFields';
  dateValue: Maybe<Scalars['Float']['output']>;
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevSamp on columns */
export interface CurrentPayrollsStddevSampFields {
  __typename?: 'currentPayrollsStddevSampFields';
  dateValue: Maybe<Scalars['Float']['output']>;
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** Streaming cursor of the table "currentPayrolls" */
export interface CurrentPayrollsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: CurrentPayrollsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface CurrentPayrollsStreamCursorValueInput {
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
}

/** aggregate sum on columns */
export interface CurrentPayrollsSumFields {
  __typename?: 'currentPayrollsSumFields';
  dateValue: Maybe<Scalars['Int']['output']>;
  versionNumber: Maybe<Scalars['Int']['output']>;
}

/** aggregate varPop on columns */
export interface CurrentPayrollsVarPopFields {
  __typename?: 'currentPayrollsVarPopFields';
  dateValue: Maybe<Scalars['Float']['output']>;
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate varSamp on columns */
export interface CurrentPayrollsVarSampFields {
  __typename?: 'currentPayrollsVarSampFields';
  dateValue: Maybe<Scalars['Float']['output']>;
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate variance on columns */
export interface CurrentPayrollsVarianceFields {
  __typename?: 'currentPayrollsVarianceFields';
  dateValue: Maybe<Scalars['Float']['output']>;
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** columns and relationships of "audit.data_access_log" */
export interface DataAccessLogs {
  __typename?: 'dataAccessLogs';
  accessType: Scalars['String']['output'];
  accessedAt: Scalars['timestamptz']['output'];
  dataClassification: Maybe<Scalars['String']['output']>;
  fieldsAccessed: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['uuid']['output'];
  ipAddress: Maybe<Scalars['inet']['output']>;
  metadata: Maybe<Scalars['jsonb']['output']>;
  queryExecuted: Maybe<Scalars['String']['output']>;
  resourceId: Maybe<Scalars['String']['output']>;
  resourceType: Scalars['String']['output'];
  rowCount: Maybe<Scalars['Int']['output']>;
  sessionId: Maybe<Scalars['String']['output']>;
  userId: Scalars['uuid']['output'];
}


/** columns and relationships of "audit.data_access_log" */
export type DataAccessLogsMetadataArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit.data_access_log" */
export interface DataAccessLogsAggregate {
  __typename?: 'dataAccessLogsAggregate';
  aggregate: Maybe<DataAccessLogsAggregateFields>;
  nodes: Array<DataAccessLogs>;
}

/** aggregate fields of "audit.data_access_log" */
export interface DataAccessLogsAggregateFields {
  __typename?: 'dataAccessLogsAggregateFields';
  avg: Maybe<DataAccessLogsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<DataAccessLogsMaxFields>;
  min: Maybe<DataAccessLogsMinFields>;
  stddev: Maybe<DataAccessLogsStddevFields>;
  stddevPop: Maybe<DataAccessLogsStddevPopFields>;
  stddevSamp: Maybe<DataAccessLogsStddevSampFields>;
  sum: Maybe<DataAccessLogsSumFields>;
  varPop: Maybe<DataAccessLogsVarPopFields>;
  varSamp: Maybe<DataAccessLogsVarSampFields>;
  variance: Maybe<DataAccessLogsVarianceFields>;
}


/** aggregate fields of "audit.data_access_log" */
export type DataAccessLogsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<DataAccessLogsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export interface DataAccessLogsAppendInput {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
}

/** aggregate avg on columns */
export interface DataAccessLogsAvgFields {
  __typename?: 'dataAccessLogsAvgFields';
  rowCount: Maybe<Scalars['Float']['output']>;
}

/** Boolean expression to filter rows from the table "audit.data_access_log". All fields are combined with a logical 'AND'. */
export interface DataAccessLogsBoolExp {
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
}

/** unique or primary key constraints on table "audit.data_access_log" */
export enum DataAccessLogsConstraint {
  /** unique or primary key constraint on columns "id" */
  data_access_log_pkey = 'data_access_log_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface DataAccessLogsDeleteAtPathInput {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface DataAccessLogsDeleteElemInput {
  metadata?: InputMaybe<Scalars['Int']['input']>;
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface DataAccessLogsDeleteKeyInput {
  metadata?: InputMaybe<Scalars['String']['input']>;
}

/** input type for incrementing numeric columns in table "audit.data_access_log" */
export interface DataAccessLogsIncInput {
  rowCount?: InputMaybe<Scalars['Int']['input']>;
}

/** input type for inserting data into table "audit.data_access_log" */
export interface DataAccessLogsInsertInput {
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
}

/** aggregate max on columns */
export interface DataAccessLogsMaxFields {
  __typename?: 'dataAccessLogsMaxFields';
  accessType: Maybe<Scalars['String']['output']>;
  accessedAt: Maybe<Scalars['timestamptz']['output']>;
  dataClassification: Maybe<Scalars['String']['output']>;
  fieldsAccessed: Maybe<Array<Scalars['String']['output']>>;
  id: Maybe<Scalars['uuid']['output']>;
  queryExecuted: Maybe<Scalars['String']['output']>;
  resourceId: Maybe<Scalars['String']['output']>;
  resourceType: Maybe<Scalars['String']['output']>;
  rowCount: Maybe<Scalars['Int']['output']>;
  sessionId: Maybe<Scalars['String']['output']>;
  userId: Maybe<Scalars['uuid']['output']>;
}

/** aggregate min on columns */
export interface DataAccessLogsMinFields {
  __typename?: 'dataAccessLogsMinFields';
  accessType: Maybe<Scalars['String']['output']>;
  accessedAt: Maybe<Scalars['timestamptz']['output']>;
  dataClassification: Maybe<Scalars['String']['output']>;
  fieldsAccessed: Maybe<Array<Scalars['String']['output']>>;
  id: Maybe<Scalars['uuid']['output']>;
  queryExecuted: Maybe<Scalars['String']['output']>;
  resourceId: Maybe<Scalars['String']['output']>;
  resourceType: Maybe<Scalars['String']['output']>;
  rowCount: Maybe<Scalars['Int']['output']>;
  sessionId: Maybe<Scalars['String']['output']>;
  userId: Maybe<Scalars['uuid']['output']>;
}

/** response of any mutation on the table "audit.data_access_log" */
export interface DataAccessLogsMutationResponse {
  __typename?: 'dataAccessLogsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<DataAccessLogs>;
}

/** on_conflict condition type for table "audit.data_access_log" */
export interface DataAccessLogsOnConflict {
  constraint: DataAccessLogsConstraint;
  updateColumns?: Array<DataAccessLogsUpdateColumn>;
  where?: InputMaybe<DataAccessLogsBoolExp>;
}

/** Ordering options when selecting data from "audit.data_access_log". */
export interface DataAccessLogsOrderBy {
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
}

/** primary key columns input for table: audit.data_access_log */
export interface DataAccessLogsPkColumnsInput {
  id: Scalars['uuid']['input'];
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface DataAccessLogsPrependInput {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
}

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
export interface DataAccessLogsSetInput {
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
}

/** aggregate stddev on columns */
export interface DataAccessLogsStddevFields {
  __typename?: 'dataAccessLogsStddevFields';
  rowCount: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevPop on columns */
export interface DataAccessLogsStddevPopFields {
  __typename?: 'dataAccessLogsStddevPopFields';
  rowCount: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevSamp on columns */
export interface DataAccessLogsStddevSampFields {
  __typename?: 'dataAccessLogsStddevSampFields';
  rowCount: Maybe<Scalars['Float']['output']>;
}

/** Streaming cursor of the table "dataAccessLogs" */
export interface DataAccessLogsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: DataAccessLogsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface DataAccessLogsStreamCursorValueInput {
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
}

/** aggregate sum on columns */
export interface DataAccessLogsSumFields {
  __typename?: 'dataAccessLogsSumFields';
  rowCount: Maybe<Scalars['Int']['output']>;
}

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

export interface DataAccessLogsUpdates {
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
}

/** aggregate varPop on columns */
export interface DataAccessLogsVarPopFields {
  __typename?: 'dataAccessLogsVarPopFields';
  rowCount: Maybe<Scalars['Float']['output']>;
}

/** aggregate varSamp on columns */
export interface DataAccessLogsVarSampFields {
  __typename?: 'dataAccessLogsVarSampFields';
  rowCount: Maybe<Scalars['Float']['output']>;
}

/** aggregate variance on columns */
export interface DataAccessLogsVarianceFields {
  __typename?: 'dataAccessLogsVarianceFields';
  rowCount: Maybe<Scalars['Float']['output']>;
}

/** columns and relationships of "external_systems" */
export interface ExternalSystems {
  __typename?: 'externalSystems';
  /** An array relationship */
  clientExternalSystems: Array<ClientExternalSystems>;
  /** An aggregate relationship */
  clientExternalSystemsAggregate: ClientExternalSystemsAggregate;
  /** Timestamp when the system was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Description of the external system and its purpose */
  description: Maybe<Scalars['String']['output']>;
  /** Path or reference to the system icon */
  icon: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the external system */
  id: Scalars['uuid']['output'];
  /** Name of the external system */
  name: Scalars['String']['output'];
  /** Timestamp when the system was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
  /** URL endpoint for the external system */
  url: Scalars['String']['output'];
}


/** columns and relationships of "external_systems" */
export type ExternalSystemsClientExternalSystemsArgs = {
  distinctOn: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where: InputMaybe<ClientExternalSystemsBoolExp>;
};


/** columns and relationships of "external_systems" */
export type ExternalSystemsClientExternalSystemsAggregateArgs = {
  distinctOn: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where: InputMaybe<ClientExternalSystemsBoolExp>;
};

/** aggregated selection of "external_systems" */
export interface ExternalSystemsAggregate {
  __typename?: 'externalSystemsAggregate';
  aggregate: Maybe<ExternalSystemsAggregateFields>;
  nodes: Array<ExternalSystems>;
}

/** aggregate fields of "external_systems" */
export interface ExternalSystemsAggregateFields {
  __typename?: 'externalSystemsAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<ExternalSystemsMaxFields>;
  min: Maybe<ExternalSystemsMinFields>;
}


/** aggregate fields of "external_systems" */
export type ExternalSystemsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "external_systems". All fields are combined with a logical 'AND'. */
export interface ExternalSystemsBoolExp {
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
}

/** unique or primary key constraints on table "external_systems" */
export enum ExternalSystemsConstraint {
  /** unique or primary key constraint on columns "id" */
  external_systems_pkey = 'external_systems_pkey'
}

/** input type for inserting data into table "external_systems" */
export interface ExternalSystemsInsertInput {
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
}

/** aggregate max on columns */
export interface ExternalSystemsMaxFields {
  __typename?: 'externalSystemsMaxFields';
  /** Timestamp when the system was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Description of the external system and its purpose */
  description: Maybe<Scalars['String']['output']>;
  /** Path or reference to the system icon */
  icon: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the external system */
  id: Maybe<Scalars['uuid']['output']>;
  /** Name of the external system */
  name: Maybe<Scalars['String']['output']>;
  /** Timestamp when the system was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
  /** URL endpoint for the external system */
  url: Maybe<Scalars['String']['output']>;
}

/** aggregate min on columns */
export interface ExternalSystemsMinFields {
  __typename?: 'externalSystemsMinFields';
  /** Timestamp when the system was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Description of the external system and its purpose */
  description: Maybe<Scalars['String']['output']>;
  /** Path or reference to the system icon */
  icon: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the external system */
  id: Maybe<Scalars['uuid']['output']>;
  /** Name of the external system */
  name: Maybe<Scalars['String']['output']>;
  /** Timestamp when the system was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
  /** URL endpoint for the external system */
  url: Maybe<Scalars['String']['output']>;
}

/** response of any mutation on the table "external_systems" */
export interface ExternalSystemsMutationResponse {
  __typename?: 'externalSystemsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<ExternalSystems>;
}

/** input type for inserting object relation for remote table "external_systems" */
export interface ExternalSystemsObjRelInsertInput {
  data: ExternalSystemsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<ExternalSystemsOnConflict>;
}

/** on_conflict condition type for table "external_systems" */
export interface ExternalSystemsOnConflict {
  constraint: ExternalSystemsConstraint;
  updateColumns?: Array<ExternalSystemsUpdateColumn>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
}

/** Ordering options when selecting data from "external_systems". */
export interface ExternalSystemsOrderBy {
  clientExternalSystemsAggregate?: InputMaybe<ClientExternalSystemsAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  icon?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  url?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: external_systems */
export interface ExternalSystemsPkColumnsInput {
  /** Unique identifier for the external system */
  id: Scalars['uuid']['input'];
}

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
export interface ExternalSystemsSetInput {
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
}

/** Streaming cursor of the table "externalSystems" */
export interface ExternalSystemsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: ExternalSystemsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface ExternalSystemsStreamCursorValueInput {
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
}

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

export interface ExternalSystemsUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ExternalSystemsSetInput>;
  /** filter the rows which have to be updated */
  where: ExternalSystemsBoolExp;
}

/** columns and relationships of "feature_flags" */
export interface FeatureFlags {
  __typename?: 'featureFlags';
  /** JSON array of roles that can access this feature */
  allowedRoles: Scalars['jsonb']['output'];
  /** Name of the feature controlled by this flag */
  featureName: Scalars['String']['output'];
  /** Unique identifier for the feature flag */
  id: Scalars['uuid']['output'];
  /** Whether the feature is currently enabled */
  isEnabled: Maybe<Scalars['Boolean']['output']>;
  /** Timestamp when the feature flag was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}


/** columns and relationships of "feature_flags" */
export type FeatureFlagsAllowedRolesArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "feature_flags" */
export interface FeatureFlagsAggregate {
  __typename?: 'featureFlagsAggregate';
  aggregate: Maybe<FeatureFlagsAggregateFields>;
  nodes: Array<FeatureFlags>;
}

/** aggregate fields of "feature_flags" */
export interface FeatureFlagsAggregateFields {
  __typename?: 'featureFlagsAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<FeatureFlagsMaxFields>;
  min: Maybe<FeatureFlagsMinFields>;
}


/** aggregate fields of "feature_flags" */
export type FeatureFlagsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export interface FeatureFlagsAppendInput {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Scalars['jsonb']['input']>;
}

/** Boolean expression to filter rows from the table "feature_flags". All fields are combined with a logical 'AND'. */
export interface FeatureFlagsBoolExp {
  _and?: InputMaybe<Array<FeatureFlagsBoolExp>>;
  _not?: InputMaybe<FeatureFlagsBoolExp>;
  _or?: InputMaybe<Array<FeatureFlagsBoolExp>>;
  allowedRoles?: InputMaybe<JsonbComparisonExp>;
  featureName?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isEnabled?: InputMaybe<BooleanComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
}

/** unique or primary key constraints on table "feature_flags" */
export enum FeatureFlagsConstraint {
  /** unique or primary key constraint on columns "feature_name" */
  feature_flags_feature_name_key = 'feature_flags_feature_name_key',
  /** unique or primary key constraint on columns "id" */
  feature_flags_pkey = 'feature_flags_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface FeatureFlagsDeleteAtPathInput {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Array<Scalars['String']['input']>>;
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface FeatureFlagsDeleteElemInput {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Scalars['Int']['input']>;
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface FeatureFlagsDeleteKeyInput {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Scalars['String']['input']>;
}

/** input type for inserting data into table "feature_flags" */
export interface FeatureFlagsInsertInput {
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
}

/** aggregate max on columns */
export interface FeatureFlagsMaxFields {
  __typename?: 'featureFlagsMaxFields';
  /** Name of the feature controlled by this flag */
  featureName: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the feature flag */
  id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the feature flag was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** aggregate min on columns */
export interface FeatureFlagsMinFields {
  __typename?: 'featureFlagsMinFields';
  /** Name of the feature controlled by this flag */
  featureName: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the feature flag */
  id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the feature flag was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** response of any mutation on the table "feature_flags" */
export interface FeatureFlagsMutationResponse {
  __typename?: 'featureFlagsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<FeatureFlags>;
}

/** on_conflict condition type for table "feature_flags" */
export interface FeatureFlagsOnConflict {
  constraint: FeatureFlagsConstraint;
  updateColumns?: Array<FeatureFlagsUpdateColumn>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
}

/** Ordering options when selecting data from "feature_flags". */
export interface FeatureFlagsOrderBy {
  allowedRoles?: InputMaybe<OrderBy>;
  featureName?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isEnabled?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: feature_flags */
export interface FeatureFlagsPkColumnsInput {
  /** Unique identifier for the feature flag */
  id: Scalars['uuid']['input'];
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface FeatureFlagsPrependInput {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Scalars['jsonb']['input']>;
}

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
export interface FeatureFlagsSetInput {
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
}

/** Streaming cursor of the table "featureFlags" */
export interface FeatureFlagsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: FeatureFlagsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface FeatureFlagsStreamCursorValueInput {
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
}

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

export interface FeatureFlagsUpdates {
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
}

export interface GeneratePayrollDatesArgs {
  p_end_date?: InputMaybe<Scalars['date']['input']>;
  p_max_dates?: InputMaybe<Scalars['Int']['input']>;
  p_payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  p_start_date?: InputMaybe<Scalars['date']['input']>;
}

export interface GetLatestPayrollVersionArgs {
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
}

export interface GetPayrollVersionHistoryArgs {
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
}

/** columns and relationships of "holidays" */
export interface Holidays {
  __typename?: 'holidays';
  /** ISO country code where the holiday is observed */
  countryCode: Scalars['bpchar']['output'];
  /** Timestamp when the holiday record was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Date of the holiday */
  date: Scalars['date']['output'];
  /** Unique identifier for the holiday */
  id: Scalars['uuid']['output'];
  /** Whether the holiday occurs on the same date each year */
  isFixed: Maybe<Scalars['Boolean']['output']>;
  /** Whether the holiday is observed globally */
  isGlobal: Maybe<Scalars['Boolean']['output']>;
  /** First year when the holiday was observed */
  launchYear: Maybe<Scalars['Int']['output']>;
  /** Name of the holiday in local language */
  localName: Scalars['String']['output'];
  /** Name of the holiday in English */
  name: Scalars['String']['output'];
  /** Array of regions within the country where the holiday applies */
  region: Maybe<Array<Scalars['String']['output']>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types: Array<Scalars['String']['output']>;
  /** Timestamp when the holiday record was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** aggregated selection of "holidays" */
export interface HolidaysAggregate {
  __typename?: 'holidaysAggregate';
  aggregate: Maybe<HolidaysAggregateFields>;
  nodes: Array<Holidays>;
}

/** aggregate fields of "holidays" */
export interface HolidaysAggregateFields {
  __typename?: 'holidaysAggregateFields';
  avg: Maybe<HolidaysAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<HolidaysMaxFields>;
  min: Maybe<HolidaysMinFields>;
  stddev: Maybe<HolidaysStddevFields>;
  stddevPop: Maybe<HolidaysStddevPopFields>;
  stddevSamp: Maybe<HolidaysStddevSampFields>;
  sum: Maybe<HolidaysSumFields>;
  varPop: Maybe<HolidaysVarPopFields>;
  varSamp: Maybe<HolidaysVarSampFields>;
  variance: Maybe<HolidaysVarianceFields>;
}


/** aggregate fields of "holidays" */
export type HolidaysAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<HolidaysSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export interface HolidaysAvgFields {
  __typename?: 'holidaysAvgFields';
  /** First year when the holiday was observed */
  launchYear: Maybe<Scalars['Float']['output']>;
}

/** Boolean expression to filter rows from the table "holidays". All fields are combined with a logical 'AND'. */
export interface HolidaysBoolExp {
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
}

/** unique or primary key constraints on table "holidays" */
export enum HolidaysConstraint {
  /** unique or primary key constraint on columns "id" */
  holidays_pkey = 'holidays_pkey'
}

/** input type for incrementing numeric columns in table "holidays" */
export interface HolidaysIncInput {
  /** First year when the holiday was observed */
  launchYear?: InputMaybe<Scalars['Int']['input']>;
}

/** input type for inserting data into table "holidays" */
export interface HolidaysInsertInput {
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
}

/** aggregate max on columns */
export interface HolidaysMaxFields {
  __typename?: 'holidaysMaxFields';
  /** ISO country code where the holiday is observed */
  countryCode: Maybe<Scalars['bpchar']['output']>;
  /** Timestamp when the holiday record was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Date of the holiday */
  date: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the holiday */
  id: Maybe<Scalars['uuid']['output']>;
  /** First year when the holiday was observed */
  launchYear: Maybe<Scalars['Int']['output']>;
  /** Name of the holiday in local language */
  localName: Maybe<Scalars['String']['output']>;
  /** Name of the holiday in English */
  name: Maybe<Scalars['String']['output']>;
  /** Array of regions within the country where the holiday applies */
  region: Maybe<Array<Scalars['String']['output']>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types: Maybe<Array<Scalars['String']['output']>>;
  /** Timestamp when the holiday record was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** aggregate min on columns */
export interface HolidaysMinFields {
  __typename?: 'holidaysMinFields';
  /** ISO country code where the holiday is observed */
  countryCode: Maybe<Scalars['bpchar']['output']>;
  /** Timestamp when the holiday record was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Date of the holiday */
  date: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the holiday */
  id: Maybe<Scalars['uuid']['output']>;
  /** First year when the holiday was observed */
  launchYear: Maybe<Scalars['Int']['output']>;
  /** Name of the holiday in local language */
  localName: Maybe<Scalars['String']['output']>;
  /** Name of the holiday in English */
  name: Maybe<Scalars['String']['output']>;
  /** Array of regions within the country where the holiday applies */
  region: Maybe<Array<Scalars['String']['output']>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types: Maybe<Array<Scalars['String']['output']>>;
  /** Timestamp when the holiday record was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** response of any mutation on the table "holidays" */
export interface HolidaysMutationResponse {
  __typename?: 'holidaysMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Holidays>;
}

/** on_conflict condition type for table "holidays" */
export interface HolidaysOnConflict {
  constraint: HolidaysConstraint;
  updateColumns?: Array<HolidaysUpdateColumn>;
  where?: InputMaybe<HolidaysBoolExp>;
}

/** Ordering options when selecting data from "holidays". */
export interface HolidaysOrderBy {
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
}

/** primary key columns input for table: holidays */
export interface HolidaysPkColumnsInput {
  /** Unique identifier for the holiday */
  id: Scalars['uuid']['input'];
}

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
export interface HolidaysSetInput {
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
}

/** aggregate stddev on columns */
export interface HolidaysStddevFields {
  __typename?: 'holidaysStddevFields';
  /** First year when the holiday was observed */
  launchYear: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevPop on columns */
export interface HolidaysStddevPopFields {
  __typename?: 'holidaysStddevPopFields';
  /** First year when the holiday was observed */
  launchYear: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevSamp on columns */
export interface HolidaysStddevSampFields {
  __typename?: 'holidaysStddevSampFields';
  /** First year when the holiday was observed */
  launchYear: Maybe<Scalars['Float']['output']>;
}

/** Streaming cursor of the table "holidays" */
export interface HolidaysStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: HolidaysStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface HolidaysStreamCursorValueInput {
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
}

/** aggregate sum on columns */
export interface HolidaysSumFields {
  __typename?: 'holidaysSumFields';
  /** First year when the holiday was observed */
  launchYear: Maybe<Scalars['Int']['output']>;
}

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

export interface HolidaysUpdates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<HolidaysIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<HolidaysSetInput>;
  /** filter the rows which have to be updated */
  where: HolidaysBoolExp;
}

/** aggregate varPop on columns */
export interface HolidaysVarPopFields {
  __typename?: 'holidaysVarPopFields';
  /** First year when the holiday was observed */
  launchYear: Maybe<Scalars['Float']['output']>;
}

/** aggregate varSamp on columns */
export interface HolidaysVarSampFields {
  __typename?: 'holidaysVarSampFields';
  /** First year when the holiday was observed */
  launchYear: Maybe<Scalars['Float']['output']>;
}

/** aggregate variance on columns */
export interface HolidaysVarianceFields {
  __typename?: 'holidaysVarianceFields';
  /** First year when the holiday was observed */
  launchYear: Maybe<Scalars['Float']['output']>;
}

/** columns and relationships of "latest_payroll_version_results" */
export interface LatestPayrollVersionResults {
  __typename?: 'latestPayrollVersionResults';
  active: Scalars['Boolean']['output'];
  goLiveDate: Maybe<Scalars['date']['output']>;
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  payrollId: Scalars['uuid']['output'];
  queriedAt: Maybe<Scalars['timestamptz']['output']>;
  versionNumber: Scalars['Int']['output'];
}

export interface LatestPayrollVersionResultsAggregate {
  __typename?: 'latestPayrollVersionResultsAggregate';
  aggregate: Maybe<LatestPayrollVersionResultsAggregateFields>;
  nodes: Array<LatestPayrollVersionResults>;
}

/** aggregate fields of "latest_payroll_version_results" */
export interface LatestPayrollVersionResultsAggregateFields {
  __typename?: 'latestPayrollVersionResultsAggregateFields';
  avg: Maybe<LatestPayrollVersionResultsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<LatestPayrollVersionResultsMaxFields>;
  min: Maybe<LatestPayrollVersionResultsMinFields>;
  stddev: Maybe<LatestPayrollVersionResultsStddevFields>;
  stddevPop: Maybe<LatestPayrollVersionResultsStddevPopFields>;
  stddevSamp: Maybe<LatestPayrollVersionResultsStddevSampFields>;
  sum: Maybe<LatestPayrollVersionResultsSumFields>;
  varPop: Maybe<LatestPayrollVersionResultsVarPopFields>;
  varSamp: Maybe<LatestPayrollVersionResultsVarSampFields>;
  variance: Maybe<LatestPayrollVersionResultsVarianceFields>;
}


/** aggregate fields of "latest_payroll_version_results" */
export type LatestPayrollVersionResultsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export interface LatestPayrollVersionResultsAvgFields {
  __typename?: 'latestPayrollVersionResultsAvgFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** Boolean expression to filter rows from the table "latest_payroll_version_results". All fields are combined with a logical 'AND'. */
export interface LatestPayrollVersionResultsBoolExp {
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
}

/** unique or primary key constraints on table "latest_payroll_version_results" */
export enum LatestPayrollVersionResultsConstraint {
  /** unique or primary key constraint on columns "id" */
  latest_payroll_version_results_pkey = 'latest_payroll_version_results_pkey'
}

/** input type for incrementing numeric columns in table "latest_payroll_version_results" */
export interface LatestPayrollVersionResultsIncInput {
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
}

/** input type for inserting data into table "latest_payroll_version_results" */
export interface LatestPayrollVersionResultsInsertInput {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  queriedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
}

/** aggregate max on columns */
export interface LatestPayrollVersionResultsMaxFields {
  __typename?: 'latestPayrollVersionResultsMaxFields';
  goLiveDate: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  payrollId: Maybe<Scalars['uuid']['output']>;
  queriedAt: Maybe<Scalars['timestamptz']['output']>;
  versionNumber: Maybe<Scalars['Int']['output']>;
}

/** aggregate min on columns */
export interface LatestPayrollVersionResultsMinFields {
  __typename?: 'latestPayrollVersionResultsMinFields';
  goLiveDate: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  payrollId: Maybe<Scalars['uuid']['output']>;
  queriedAt: Maybe<Scalars['timestamptz']['output']>;
  versionNumber: Maybe<Scalars['Int']['output']>;
}

/** response of any mutation on the table "latest_payroll_version_results" */
export interface LatestPayrollVersionResultsMutationResponse {
  __typename?: 'latestPayrollVersionResultsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<LatestPayrollVersionResults>;
}

/** on_conflict condition type for table "latest_payroll_version_results" */
export interface LatestPayrollVersionResultsOnConflict {
  constraint: LatestPayrollVersionResultsConstraint;
  updateColumns?: Array<LatestPayrollVersionResultsUpdateColumn>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
}

/** Ordering options when selecting data from "latest_payroll_version_results". */
export interface LatestPayrollVersionResultsOrderBy {
  active?: InputMaybe<OrderBy>;
  goLiveDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  queriedAt?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: latest_payroll_version_results */
export interface LatestPayrollVersionResultsPkColumnsInput {
  id: Scalars['uuid']['input'];
}

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
export interface LatestPayrollVersionResultsSetInput {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  queriedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
}

/** aggregate stddev on columns */
export interface LatestPayrollVersionResultsStddevFields {
  __typename?: 'latestPayrollVersionResultsStddevFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevPop on columns */
export interface LatestPayrollVersionResultsStddevPopFields {
  __typename?: 'latestPayrollVersionResultsStddevPopFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevSamp on columns */
export interface LatestPayrollVersionResultsStddevSampFields {
  __typename?: 'latestPayrollVersionResultsStddevSampFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** Streaming cursor of the table "latestPayrollVersionResults" */
export interface LatestPayrollVersionResultsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: LatestPayrollVersionResultsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface LatestPayrollVersionResultsStreamCursorValueInput {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  queriedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
}

/** aggregate sum on columns */
export interface LatestPayrollVersionResultsSumFields {
  __typename?: 'latestPayrollVersionResultsSumFields';
  versionNumber: Maybe<Scalars['Int']['output']>;
}

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

export interface LatestPayrollVersionResultsUpdates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<LatestPayrollVersionResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<LatestPayrollVersionResultsSetInput>;
  /** filter the rows which have to be updated */
  where: LatestPayrollVersionResultsBoolExp;
}

/** aggregate varPop on columns */
export interface LatestPayrollVersionResultsVarPopFields {
  __typename?: 'latestPayrollVersionResultsVarPopFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate varSamp on columns */
export interface LatestPayrollVersionResultsVarSampFields {
  __typename?: 'latestPayrollVersionResultsVarSampFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate variance on columns */
export interface LatestPayrollVersionResultsVarianceFields {
  __typename?: 'latestPayrollVersionResultsVarianceFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** columns and relationships of "leave" */
export interface Leave {
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
  reason: Maybe<Scalars['String']['output']>;
  /** First day of the leave period */
  startDate: Scalars['date']['output'];
  /** Current status of the leave request (Pending, Approved, Denied) */
  status: Maybe<Scalars['leave_status_enum']['output']>;
  /** Reference to the user taking leave */
  userId: Scalars['uuid']['output'];
}

/** aggregated selection of "leave" */
export interface LeaveAggregate {
  __typename?: 'leaveAggregate';
  aggregate: Maybe<LeaveAggregateFields>;
  nodes: Array<Leave>;
}

export interface LeaveAggregateBoolExp {
  count?: InputMaybe<LeaveAggregateBoolExpCount>;
}

export interface LeaveAggregateBoolExpCount {
  arguments?: InputMaybe<Array<LeaveSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<LeaveBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "leave" */
export interface LeaveAggregateFields {
  __typename?: 'leaveAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<LeaveMaxFields>;
  min: Maybe<LeaveMinFields>;
}


/** aggregate fields of "leave" */
export type LeaveAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<LeaveSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "leave" */
export interface LeaveAggregateOrderBy {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<LeaveMaxOrderBy>;
  min?: InputMaybe<LeaveMinOrderBy>;
}

/** input type for inserting array relation for remote table "leave" */
export interface LeaveArrRelInsertInput {
  data: Array<LeaveInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<LeaveOnConflict>;
}

/** Boolean expression to filter rows from the table "leave". All fields are combined with a logical 'AND'. */
export interface LeaveBoolExp {
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
}

/** unique or primary key constraints on table "leave" */
export enum LeaveConstraint {
  /** unique or primary key constraint on columns "id" */
  leave_pkey = 'leave_pkey'
}

/** input type for inserting data into table "leave" */
export interface LeaveInsertInput {
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
}

/** aggregate max on columns */
export interface LeaveMaxFields {
  __typename?: 'leaveMaxFields';
  /** Last day of the leave period */
  endDate: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the leave record */
  id: Maybe<Scalars['uuid']['output']>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType: Maybe<Scalars['String']['output']>;
  /** Reason provided for the leave request */
  reason: Maybe<Scalars['String']['output']>;
  /** First day of the leave period */
  startDate: Maybe<Scalars['date']['output']>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status: Maybe<Scalars['leave_status_enum']['output']>;
  /** Reference to the user taking leave */
  userId: Maybe<Scalars['uuid']['output']>;
}

/** order by max() on columns of table "leave" */
export interface LeaveMaxOrderBy {
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
}

/** aggregate min on columns */
export interface LeaveMinFields {
  __typename?: 'leaveMinFields';
  /** Last day of the leave period */
  endDate: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the leave record */
  id: Maybe<Scalars['uuid']['output']>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType: Maybe<Scalars['String']['output']>;
  /** Reason provided for the leave request */
  reason: Maybe<Scalars['String']['output']>;
  /** First day of the leave period */
  startDate: Maybe<Scalars['date']['output']>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status: Maybe<Scalars['leave_status_enum']['output']>;
  /** Reference to the user taking leave */
  userId: Maybe<Scalars['uuid']['output']>;
}

/** order by min() on columns of table "leave" */
export interface LeaveMinOrderBy {
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
}

/** response of any mutation on the table "leave" */
export interface LeaveMutationResponse {
  __typename?: 'leaveMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Leave>;
}

/** on_conflict condition type for table "leave" */
export interface LeaveOnConflict {
  constraint: LeaveConstraint;
  updateColumns?: Array<LeaveUpdateColumn>;
  where?: InputMaybe<LeaveBoolExp>;
}

/** Ordering options when selecting data from "leave". */
export interface LeaveOrderBy {
  endDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  leaveRequester?: InputMaybe<UsersOrderBy>;
  leaveType?: InputMaybe<OrderBy>;
  leaveUser?: InputMaybe<UsersOrderBy>;
  reason?: InputMaybe<OrderBy>;
  startDate?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: leave */
export interface LeavePkColumnsInput {
  /** Unique identifier for the leave record */
  id: Scalars['uuid']['input'];
}

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
export interface LeaveSetInput {
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
}

/** Streaming cursor of the table "leave" */
export interface LeaveStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: LeaveStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface LeaveStreamCursorValueInput {
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
}

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

export interface LeaveUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<LeaveSetInput>;
  /** filter the rows which have to be updated */
  where: LeaveBoolExp;
}

/** mutation root */
export interface MutationRoot {
  __typename?: 'mutation_root';
  /** delete data from the table: "adjustment_rules" */
  bulkDeleteAdjustmentRules: Maybe<AdjustmentRulesMutationResponse>;
  /** delete data from the table: "app_settings" */
  bulkDeleteAppSettings: Maybe<AppSettingsMutationResponse>;
  /** delete data from the table: "audit.audit_log" */
  bulkDeleteAuditLogs: Maybe<AuditLogsMutationResponse>;
  /** delete data from the table: "audit.auth_events" */
  bulkDeleteAuthEvents: Maybe<AuthEventsMutationResponse>;
  /** delete data from the table: "billing_event_log" */
  bulkDeleteBillingEventLogs: Maybe<BillingEventLogsMutationResponse>;
  /** delete data from the table: "billing_invoice" */
  bulkDeleteBillingInvoice: Maybe<BillingInvoiceMutationResponse>;
  /** delete data from the table: "billing_invoices" */
  bulkDeleteBillingInvoices: Maybe<BillingInvoicesMutationResponse>;
  /** delete data from the table: "billing_items" */
  bulkDeleteBillingItems: Maybe<BillingItemsMutationResponse>;
  /** delete data from the table: "billing_plan" */
  bulkDeleteBillingPlans: Maybe<BillingPlansMutationResponse>;
  /** delete data from the table: "client_billing_assignment" */
  bulkDeleteClientBillingAssignments: Maybe<ClientBillingAssignmentsMutationResponse>;
  /** delete data from the table: "client_external_systems" */
  bulkDeleteClientExternalSystems: Maybe<ClientExternalSystemsMutationResponse>;
  /** delete data from the table: "clients" */
  bulkDeleteClients: Maybe<ClientsMutationResponse>;
  /** delete data from the table: "audit.data_access_log" */
  bulkDeleteDataAccessLogs: Maybe<DataAccessLogsMutationResponse>;
  /** delete data from the table: "external_systems" */
  bulkDeleteExternalSystems: Maybe<ExternalSystemsMutationResponse>;
  /** delete data from the table: "feature_flags" */
  bulkDeleteFeatureFlags: Maybe<FeatureFlagsMutationResponse>;
  /** delete data from the table: "holidays" */
  bulkDeleteHolidays: Maybe<HolidaysMutationResponse>;
  /** delete data from the table: "latest_payroll_version_results" */
  bulkDeleteLatestPayrollVersionResults: Maybe<LatestPayrollVersionResultsMutationResponse>;
  /** delete data from the table: "leave" */
  bulkDeleteLeave: Maybe<LeaveMutationResponse>;
  /** delete data from the table: "notes" */
  bulkDeleteNotes: Maybe<NotesMutationResponse>;
  /** delete data from the table: "payroll_activation_results" */
  bulkDeletePayrollActivationResults: Maybe<PayrollActivationResultsMutationResponse>;
  /** delete data from the table: "payroll_assignment_audit" */
  bulkDeletePayrollAssignmentAudits: Maybe<PayrollAssignmentAuditsMutationResponse>;
  /** delete data from the table: "payroll_assignments" */
  bulkDeletePayrollAssignments: Maybe<PayrollAssignmentsMutationResponse>;
  /** delete data from the table: "payroll_cycles" */
  bulkDeletePayrollCycles: Maybe<PayrollCyclesMutationResponse>;
  /** delete data from the table: "payroll_date_types" */
  bulkDeletePayrollDateTypes: Maybe<PayrollDateTypesMutationResponse>;
  /** delete data from the table: "payroll_dates" */
  bulkDeletePayrollDates: Maybe<PayrollDatesMutationResponse>;
  /** delete data from the table: "payroll_version_history_results" */
  bulkDeletePayrollVersionHistoryResults: Maybe<PayrollVersionHistoryResultsMutationResponse>;
  /** delete data from the table: "payroll_version_results" */
  bulkDeletePayrollVersionResults: Maybe<PayrollVersionResultsMutationResponse>;
  /** delete data from the table: "payrolls" */
  bulkDeletePayrolls: Maybe<PayrollsMutationResponse>;
  /** delete data from the table: "permission_audit_log" */
  bulkDeletePermissionAuditLogs: Maybe<PermissionAuditLogsMutationResponse>;
  /** delete data from the table: "audit.permission_changes" */
  bulkDeletePermissionChanges: Maybe<PermissionChangesMutationResponse>;
  /** delete data from the table: "permission_overrides" */
  bulkDeletePermissionOverrides: Maybe<PermissionOverridesMutationResponse>;
  /** delete data from the table: "permissions" */
  bulkDeletePermissions: Maybe<PermissionsMutationResponse>;
  /** delete data from the table: "resources" */
  bulkDeleteResources: Maybe<ResourcesMutationResponse>;
  /** delete data from the table: "role_permissions" */
  bulkDeleteRolePermissions: Maybe<RolePermissionsMutationResponse>;
  /** delete data from the table: "roles" */
  bulkDeleteRoles: Maybe<RolesMutationResponse>;
  /** delete data from the table: "audit.slow_queries" */
  bulkDeleteSlowQueries: Maybe<SlowQueriesMutationResponse>;
  /** delete data from the table: "audit.user_access_summary" */
  bulkDeleteUserAccessSummaries: Maybe<UserAccessSummariesMutationResponse>;
  /** delete data from the table: "user_invitations" */
  bulkDeleteUserInvitations: Maybe<UserInvitationsMutationResponse>;
  /** delete data from the table: "user_roles" */
  bulkDeleteUserRoles: Maybe<UserRolesMutationResponse>;
  /** delete data from the table: "users" */
  bulkDeleteUsers: Maybe<UsersMutationResponse>;
  /** delete data from the table: "users_role_backup" */
  bulkDeleteUsersRoleBackups: Maybe<UsersRoleBackupMutationResponse>;
  /** delete data from the table: "neon_auth.users_sync" */
  bulkDeleteUsersSync: Maybe<AuthUsersSyncMutationResponse>;
  /** delete data from the table: "work_schedule" */
  bulkDeleteWorkSchedules: Maybe<WorkSchedulesMutationResponse>;
  /** insert data into the table: "adjustment_rules" */
  bulkInsertAdjustmentRules: Maybe<AdjustmentRulesMutationResponse>;
  /** insert data into the table: "app_settings" */
  bulkInsertAppSettings: Maybe<AppSettingsMutationResponse>;
  /** insert data into the table: "audit.audit_log" */
  bulkInsertAuditLogs: Maybe<AuditLogsMutationResponse>;
  /** insert data into the table: "audit.auth_events" */
  bulkInsertAuthEvents: Maybe<AuthEventsMutationResponse>;
  /** insert data into the table: "billing_event_log" */
  bulkInsertBillingEventLogs: Maybe<BillingEventLogsMutationResponse>;
  /** insert data into the table: "billing_invoice" */
  bulkInsertBillingInvoice: Maybe<BillingInvoiceMutationResponse>;
  /** insert data into the table: "billing_invoices" */
  bulkInsertBillingInvoices: Maybe<BillingInvoicesMutationResponse>;
  /** insert data into the table: "billing_items" */
  bulkInsertBillingItems: Maybe<BillingItemsMutationResponse>;
  /** insert data into the table: "billing_plan" */
  bulkInsertBillingPlans: Maybe<BillingPlansMutationResponse>;
  /** insert data into the table: "client_billing_assignment" */
  bulkInsertClientBillingAssignments: Maybe<ClientBillingAssignmentsMutationResponse>;
  /** insert data into the table: "client_external_systems" */
  bulkInsertClientExternalSystems: Maybe<ClientExternalSystemsMutationResponse>;
  /** insert data into the table: "clients" */
  bulkInsertClients: Maybe<ClientsMutationResponse>;
  /** insert data into the table: "audit.data_access_log" */
  bulkInsertDataAccessLogs: Maybe<DataAccessLogsMutationResponse>;
  /** insert data into the table: "external_systems" */
  bulkInsertExternalSystems: Maybe<ExternalSystemsMutationResponse>;
  /** insert data into the table: "feature_flags" */
  bulkInsertFeatureFlags: Maybe<FeatureFlagsMutationResponse>;
  /** insert data into the table: "holidays" */
  bulkInsertHolidays: Maybe<HolidaysMutationResponse>;
  /** insert data into the table: "latest_payroll_version_results" */
  bulkInsertLatestPayrollVersionResults: Maybe<LatestPayrollVersionResultsMutationResponse>;
  /** insert data into the table: "leave" */
  bulkInsertLeave: Maybe<LeaveMutationResponse>;
  /** insert data into the table: "notes" */
  bulkInsertNotes: Maybe<NotesMutationResponse>;
  /** insert data into the table: "payroll_activation_results" */
  bulkInsertPayrollActivationResults: Maybe<PayrollActivationResultsMutationResponse>;
  /** insert data into the table: "payroll_assignment_audit" */
  bulkInsertPayrollAssignmentAudits: Maybe<PayrollAssignmentAuditsMutationResponse>;
  /** insert data into the table: "payroll_assignments" */
  bulkInsertPayrollAssignments: Maybe<PayrollAssignmentsMutationResponse>;
  /** insert data into the table: "payroll_cycles" */
  bulkInsertPayrollCycles: Maybe<PayrollCyclesMutationResponse>;
  /** insert data into the table: "payroll_date_types" */
  bulkInsertPayrollDateTypes: Maybe<PayrollDateTypesMutationResponse>;
  /** insert data into the table: "payroll_dates" */
  bulkInsertPayrollDates: Maybe<PayrollDatesMutationResponse>;
  /** insert data into the table: "payroll_version_history_results" */
  bulkInsertPayrollVersionHistoryResults: Maybe<PayrollVersionHistoryResultsMutationResponse>;
  /** insert data into the table: "payroll_version_results" */
  bulkInsertPayrollVersionResults: Maybe<PayrollVersionResultsMutationResponse>;
  /** insert data into the table: "payrolls" */
  bulkInsertPayrolls: Maybe<PayrollsMutationResponse>;
  /** insert data into the table: "permission_audit_log" */
  bulkInsertPermissionAuditLogs: Maybe<PermissionAuditLogsMutationResponse>;
  /** insert data into the table: "audit.permission_changes" */
  bulkInsertPermissionChanges: Maybe<PermissionChangesMutationResponse>;
  /** insert data into the table: "permission_overrides" */
  bulkInsertPermissionOverrides: Maybe<PermissionOverridesMutationResponse>;
  /** insert data into the table: "permissions" */
  bulkInsertPermissions: Maybe<PermissionsMutationResponse>;
  /** insert data into the table: "resources" */
  bulkInsertResources: Maybe<ResourcesMutationResponse>;
  /** insert data into the table: "role_permissions" */
  bulkInsertRolePermissions: Maybe<RolePermissionsMutationResponse>;
  /** insert data into the table: "roles" */
  bulkInsertRoles: Maybe<RolesMutationResponse>;
  /** insert data into the table: "audit.slow_queries" */
  bulkInsertSlowQueries: Maybe<SlowQueriesMutationResponse>;
  /** insert data into the table: "audit.user_access_summary" */
  bulkInsertUserAccessSummaries: Maybe<UserAccessSummariesMutationResponse>;
  /** insert data into the table: "user_invitations" */
  bulkInsertUserInvitations: Maybe<UserInvitationsMutationResponse>;
  /** insert data into the table: "user_roles" */
  bulkInsertUserRoles: Maybe<UserRolesMutationResponse>;
  /** insert data into the table: "users" */
  bulkInsertUsers: Maybe<UsersMutationResponse>;
  /** insert data into the table: "users_role_backup" */
  bulkInsertUsersRoleBackups: Maybe<UsersRoleBackupMutationResponse>;
  /** insert data into the table: "neon_auth.users_sync" */
  bulkInsertUsersSync: Maybe<AuthUsersSyncMutationResponse>;
  /** insert data into the table: "work_schedule" */
  bulkInsertWorkSchedules: Maybe<WorkSchedulesMutationResponse>;
  /** update data of the table: "adjustment_rules" */
  bulkUpdateAdjustmentRules: Maybe<AdjustmentRulesMutationResponse>;
  /** update data of the table: "app_settings" */
  bulkUpdateAppSettings: Maybe<AppSettingsMutationResponse>;
  /** update data of the table: "audit.audit_log" */
  bulkUpdateAuditLogs: Maybe<AuditLogsMutationResponse>;
  /** update data of the table: "audit.auth_events" */
  bulkUpdateAuthEvents: Maybe<AuthEventsMutationResponse>;
  /** update data of the table: "billing_event_log" */
  bulkUpdateBillingEventLogs: Maybe<BillingEventLogsMutationResponse>;
  /** update data of the table: "billing_invoice" */
  bulkUpdateBillingInvoice: Maybe<BillingInvoiceMutationResponse>;
  /** update data of the table: "billing_invoices" */
  bulkUpdateBillingInvoices: Maybe<BillingInvoicesMutationResponse>;
  /** update data of the table: "billing_items" */
  bulkUpdateBillingItems: Maybe<BillingItemsMutationResponse>;
  /** update data of the table: "billing_plan" */
  bulkUpdateBillingPlans: Maybe<BillingPlansMutationResponse>;
  /** update data of the table: "client_billing_assignment" */
  bulkUpdateClientBillingAssignments: Maybe<ClientBillingAssignmentsMutationResponse>;
  /** update data of the table: "client_external_systems" */
  bulkUpdateClientExternalSystems: Maybe<ClientExternalSystemsMutationResponse>;
  /** update data of the table: "clients" */
  bulkUpdateClients: Maybe<ClientsMutationResponse>;
  /** update data of the table: "audit.data_access_log" */
  bulkUpdateDataAccessLogs: Maybe<DataAccessLogsMutationResponse>;
  /** update data of the table: "external_systems" */
  bulkUpdateExternalSystems: Maybe<ExternalSystemsMutationResponse>;
  /** update data of the table: "feature_flags" */
  bulkUpdateFeatureFlags: Maybe<FeatureFlagsMutationResponse>;
  /** update data of the table: "holidays" */
  bulkUpdateHolidays: Maybe<HolidaysMutationResponse>;
  /** update data of the table: "latest_payroll_version_results" */
  bulkUpdateLatestPayrollVersionResults: Maybe<LatestPayrollVersionResultsMutationResponse>;
  /** update data of the table: "leave" */
  bulkUpdateLeave: Maybe<LeaveMutationResponse>;
  /** update data of the table: "notes" */
  bulkUpdateNotes: Maybe<NotesMutationResponse>;
  /** update data of the table: "payroll_activation_results" */
  bulkUpdatePayrollActivationResults: Maybe<PayrollActivationResultsMutationResponse>;
  /** update data of the table: "payroll_assignment_audit" */
  bulkUpdatePayrollAssignmentAudits: Maybe<PayrollAssignmentAuditsMutationResponse>;
  /** update data of the table: "payroll_assignments" */
  bulkUpdatePayrollAssignments: Maybe<PayrollAssignmentsMutationResponse>;
  /** update data of the table: "payroll_cycles" */
  bulkUpdatePayrollCycles: Maybe<PayrollCyclesMutationResponse>;
  /** update data of the table: "payroll_date_types" */
  bulkUpdatePayrollDateTypes: Maybe<PayrollDateTypesMutationResponse>;
  /** update data of the table: "payroll_dates" */
  bulkUpdatePayrollDates: Maybe<PayrollDatesMutationResponse>;
  /** update data of the table: "payroll_version_history_results" */
  bulkUpdatePayrollVersionHistoryResults: Maybe<PayrollVersionHistoryResultsMutationResponse>;
  /** update data of the table: "payroll_version_results" */
  bulkUpdatePayrollVersionResults: Maybe<PayrollVersionResultsMutationResponse>;
  /** update data of the table: "payrolls" */
  bulkUpdatePayrolls: Maybe<PayrollsMutationResponse>;
  /** update data of the table: "permission_audit_log" */
  bulkUpdatePermissionAuditLogs: Maybe<PermissionAuditLogsMutationResponse>;
  /** update data of the table: "audit.permission_changes" */
  bulkUpdatePermissionChanges: Maybe<PermissionChangesMutationResponse>;
  /** update data of the table: "permission_overrides" */
  bulkUpdatePermissionOverrides: Maybe<PermissionOverridesMutationResponse>;
  /** update data of the table: "permissions" */
  bulkUpdatePermissions: Maybe<PermissionsMutationResponse>;
  /** update data of the table: "resources" */
  bulkUpdateResources: Maybe<ResourcesMutationResponse>;
  /** update data of the table: "role_permissions" */
  bulkUpdateRolePermissions: Maybe<RolePermissionsMutationResponse>;
  /** update data of the table: "roles" */
  bulkUpdateRoles: Maybe<RolesMutationResponse>;
  /** update data of the table: "audit.slow_queries" */
  bulkUpdateSlowQueries: Maybe<SlowQueriesMutationResponse>;
  /** update data of the table: "audit.user_access_summary" */
  bulkUpdateUserAccessSummaries: Maybe<UserAccessSummariesMutationResponse>;
  /** update data of the table: "user_invitations" */
  bulkUpdateUserInvitations: Maybe<UserInvitationsMutationResponse>;
  /** update data of the table: "user_roles" */
  bulkUpdateUserRoles: Maybe<UserRolesMutationResponse>;
  /** update data of the table: "users" */
  bulkUpdateUsers: Maybe<UsersMutationResponse>;
  /** update data of the table: "users_role_backup" */
  bulkUpdateUsersRoleBackups: Maybe<UsersRoleBackupMutationResponse>;
  /** update data of the table: "neon_auth.users_sync" */
  bulkUpdateUsersSync: Maybe<AuthUsersSyncMutationResponse>;
  /** update data of the table: "work_schedule" */
  bulkUpdateWorkSchedules: Maybe<WorkSchedulesMutationResponse>;
  /** Check for suspicious activity patterns */
  checkSuspiciousActivity: Maybe<SuspiciousActivityResponse>;
  commitPayrollAssignments: Maybe<CommitPayrollAssignmentsOutput>;
  /** delete single row from the table: "adjustment_rules" */
  deleteAdjustmentRuleById: Maybe<AdjustmentRules>;
  /** delete single row from the table: "app_settings" */
  deleteAppSettingById: Maybe<AppSettings>;
  /** delete single row from the table: "audit.audit_log" */
  deleteAuditLogById: Maybe<AuditLogs>;
  /** delete single row from the table: "audit.auth_events" */
  deleteAuthEventById: Maybe<AuthEvents>;
  /** delete single row from the table: "billing_event_log" */
  deleteBillingEventLogById: Maybe<BillingEventLogs>;
  /** delete single row from the table: "billing_invoice" */
  deleteBillingInvoiceById: Maybe<BillingInvoice>;
  /** delete single row from the table: "billing_invoices" */
  deleteBillingInvoicesById: Maybe<BillingInvoices>;
  /** delete single row from the table: "billing_items" */
  deleteBillingItemById: Maybe<BillingItems>;
  /** delete single row from the table: "billing_plan" */
  deleteBillingPlanById: Maybe<BillingPlans>;
  /** delete single row from the table: "client_billing_assignment" */
  deleteClientBillingAssignmentById: Maybe<ClientBillingAssignments>;
  /** delete single row from the table: "clients" */
  deleteClientById: Maybe<Clients>;
  /** delete single row from the table: "client_external_systems" */
  deleteClientExternalSystemById: Maybe<ClientExternalSystems>;
  /** delete single row from the table: "audit.data_access_log" */
  deleteDataAccessLogById: Maybe<DataAccessLogs>;
  /** delete single row from the table: "external_systems" */
  deleteExternalSystemById: Maybe<ExternalSystems>;
  /** delete single row from the table: "feature_flags" */
  deleteFeatureFlagById: Maybe<FeatureFlags>;
  /** delete single row from the table: "holidays" */
  deleteHolidayById: Maybe<Holidays>;
  /** delete single row from the table: "latest_payroll_version_results" */
  deleteLatestPayrollVersionResultById: Maybe<LatestPayrollVersionResults>;
  /** delete single row from the table: "leave" */
  deleteLeaveById: Maybe<Leave>;
  /** delete single row from the table: "notes" */
  deleteNoteById: Maybe<Notes>;
  /** delete single row from the table: "payroll_activation_results" */
  deletePayrollActivationResultById: Maybe<PayrollActivationResults>;
  /** delete single row from the table: "payroll_assignment_audit" */
  deletePayrollAssignmentAuditById: Maybe<PayrollAssignmentAudits>;
  /** delete single row from the table: "payroll_assignments" */
  deletePayrollAssignmentById: Maybe<PayrollAssignments>;
  /** delete single row from the table: "payrolls" */
  deletePayrollById: Maybe<Payrolls>;
  /** delete single row from the table: "payroll_cycles" */
  deletePayrollCycleById: Maybe<PayrollCycles>;
  /** delete single row from the table: "payroll_dates" */
  deletePayrollDateById: Maybe<PayrollDates>;
  /** delete single row from the table: "payroll_date_types" */
  deletePayrollDateTypeById: Maybe<PayrollDateTypes>;
  /** delete single row from the table: "payroll_version_history_results" */
  deletePayrollVersionHistoryResultById: Maybe<PayrollVersionHistoryResults>;
  /** delete single row from the table: "payroll_version_results" */
  deletePayrollVersionResultById: Maybe<PayrollVersionResults>;
  /** delete single row from the table: "permission_audit_log" */
  deletePermissionAuditLogById: Maybe<PermissionAuditLogs>;
  /** delete single row from the table: "permissions" */
  deletePermissionById: Maybe<Permissions>;
  /** delete single row from the table: "audit.permission_changes" */
  deletePermissionChangeById: Maybe<PermissionChanges>;
  /** delete single row from the table: "permission_overrides" */
  deletePermissionOverrideById: Maybe<PermissionOverrides>;
  /** delete single row from the table: "resources" */
  deleteResourceById: Maybe<Resources>;
  /** delete single row from the table: "roles" */
  deleteRoleById: Maybe<Roles>;
  /** delete single row from the table: "role_permissions" */
  deleteRolePermissionById: Maybe<RolePermissions>;
  /** delete single row from the table: "audit.slow_queries" */
  deleteSlowQueryById: Maybe<SlowQueries>;
  /** delete single row from the table: "users" */
  deleteUserById: Maybe<Users>;
  /** delete single row from the table: "user_invitations" */
  deleteUserInvitationById: Maybe<UserInvitations>;
  /** delete single row from the table: "user_roles" */
  deleteUserRoleById: Maybe<UserRoles>;
  /** delete single row from the table: "neon_auth.users_sync" */
  deleteUserSyncById: Maybe<AuthUsersSync>;
  /** delete single row from the table: "work_schedule" */
  deleteWorkScheduleById: Maybe<WorkSchedules>;
  /** Generate SOC2 compliance reports */
  generateComplianceReport: Maybe<ComplianceReportResponse>;
  /** insert a single row into the table: "adjustment_rules" */
  insertAdjustmentRule: Maybe<AdjustmentRules>;
  /** insert a single row into the table: "app_settings" */
  insertAppSetting: Maybe<AppSettings>;
  /** insert a single row into the table: "audit.audit_log" */
  insertAuditLog: Maybe<AuditLogs>;
  /** insert a single row into the table: "audit.auth_events" */
  insertAuthEvent: Maybe<AuthEvents>;
  /** insert a single row into the table: "billing_event_log" */
  insertBillingEventLog: Maybe<BillingEventLogs>;
  /** insert a single row into the table: "billing_invoice" */
  insertBillingInvoice: Maybe<BillingInvoice>;
  /** insert a single row into the table: "billing_invoices" */
  insertBillingInvoices: Maybe<BillingInvoices>;
  /** insert a single row into the table: "billing_items" */
  insertBillingItem: Maybe<BillingItems>;
  /** insert a single row into the table: "billing_plan" */
  insertBillingPlan: Maybe<BillingPlans>;
  /** insert a single row into the table: "clients" */
  insertClient: Maybe<Clients>;
  /** insert a single row into the table: "client_billing_assignment" */
  insertClientBillingAssignment: Maybe<ClientBillingAssignments>;
  /** insert a single row into the table: "client_external_systems" */
  insertClientExternalSystem: Maybe<ClientExternalSystems>;
  /** insert a single row into the table: "audit.data_access_log" */
  insertDataAccessLog: Maybe<DataAccessLogs>;
  /** insert a single row into the table: "external_systems" */
  insertExternalSystem: Maybe<ExternalSystems>;
  /** insert a single row into the table: "feature_flags" */
  insertFeatureFlag: Maybe<FeatureFlags>;
  /** insert a single row into the table: "holidays" */
  insertHoliday: Maybe<Holidays>;
  /** insert a single row into the table: "latest_payroll_version_results" */
  insertLatestPayrollVersionResult: Maybe<LatestPayrollVersionResults>;
  /** insert a single row into the table: "leave" */
  insertLeave: Maybe<Leave>;
  /** insert a single row into the table: "notes" */
  insertNote: Maybe<Notes>;
  /** insert a single row into the table: "payrolls" */
  insertPayroll: Maybe<Payrolls>;
  /** insert a single row into the table: "payroll_activation_results" */
  insertPayrollActivationResult: Maybe<PayrollActivationResults>;
  /** insert a single row into the table: "payroll_assignments" */
  insertPayrollAssignment: Maybe<PayrollAssignments>;
  /** insert a single row into the table: "payroll_assignment_audit" */
  insertPayrollAssignmentAudit: Maybe<PayrollAssignmentAudits>;
  /** insert a single row into the table: "payroll_cycles" */
  insertPayrollCycle: Maybe<PayrollCycles>;
  /** insert a single row into the table: "payroll_dates" */
  insertPayrollDate: Maybe<PayrollDates>;
  /** insert a single row into the table: "payroll_date_types" */
  insertPayrollDateType: Maybe<PayrollDateTypes>;
  /** insert a single row into the table: "payroll_version_history_results" */
  insertPayrollVersionHistoryResult: Maybe<PayrollVersionHistoryResults>;
  /** insert a single row into the table: "payroll_version_results" */
  insertPayrollVersionResult: Maybe<PayrollVersionResults>;
  /** insert a single row into the table: "permissions" */
  insertPermission: Maybe<Permissions>;
  /** insert a single row into the table: "permission_audit_log" */
  insertPermissionAuditLog: Maybe<PermissionAuditLogs>;
  /** insert a single row into the table: "audit.permission_changes" */
  insertPermissionChange: Maybe<PermissionChanges>;
  /** insert a single row into the table: "permission_overrides" */
  insertPermissionOverride: Maybe<PermissionOverrides>;
  /** insert a single row into the table: "resources" */
  insertResource: Maybe<Resources>;
  /** insert a single row into the table: "roles" */
  insertRole: Maybe<Roles>;
  /** insert a single row into the table: "role_permissions" */
  insertRolePermission: Maybe<RolePermissions>;
  /** insert a single row into the table: "audit.slow_queries" */
  insertSlowQuery: Maybe<SlowQueries>;
  /** insert a single row into the table: "users" */
  insertUser: Maybe<Users>;
  /** insert a single row into the table: "audit.user_access_summary" */
  insertUserAccessSummary: Maybe<UserAccessSummaries>;
  /** insert a single row into the table: "user_invitations" */
  insertUserInvitation: Maybe<UserInvitations>;
  /** insert a single row into the table: "user_roles" */
  insertUserRole: Maybe<UserRoles>;
  /** insert a single row into the table: "neon_auth.users_sync" */
  insertUserSync: Maybe<AuthUsersSync>;
  /** insert a single row into the table: "users_role_backup" */
  insertUsersRoleBackup: Maybe<UsersRoleBackup>;
  /** insert a single row into the table: "work_schedule" */
  insertWorkSchedule: Maybe<WorkSchedules>;
  /** Log audit events for SOC2 compliance */
  logAuditEvent: Maybe<AuditEventResponse>;
  /** update single row of the table: "adjustment_rules" */
  updateAdjustmentRuleById: Maybe<AdjustmentRules>;
  /** update multiples rows of table: "adjustment_rules" */
  updateAdjustmentRulesMany: Maybe<Array<Maybe<AdjustmentRulesMutationResponse>>>;
  /** update single row of the table: "app_settings" */
  updateAppSettingById: Maybe<AppSettings>;
  /** update multiples rows of table: "app_settings" */
  updateAppSettingsMany: Maybe<Array<Maybe<AppSettingsMutationResponse>>>;
  /** update single row of the table: "audit.audit_log" */
  updateAuditLogById: Maybe<AuditLogs>;
  /** update multiples rows of table: "audit.audit_log" */
  updateAuditLogsMany: Maybe<Array<Maybe<AuditLogsMutationResponse>>>;
  /** update single row of the table: "audit.auth_events" */
  updateAuthEventById: Maybe<AuthEvents>;
  /** update multiples rows of table: "audit.auth_events" */
  updateAuthEventsMany: Maybe<Array<Maybe<AuthEventsMutationResponse>>>;
  /** update multiples rows of table: "neon_auth.users_sync" */
  updateAuthUsersSyncMany: Maybe<Array<Maybe<AuthUsersSyncMutationResponse>>>;
  /** update single row of the table: "billing_event_log" */
  updateBillingEventLogById: Maybe<BillingEventLogs>;
  /** update multiples rows of table: "billing_event_log" */
  updateBillingEventLogsMany: Maybe<Array<Maybe<BillingEventLogsMutationResponse>>>;
  /** update single row of the table: "billing_invoice" */
  updateBillingInvoiceById: Maybe<BillingInvoice>;
  /** update multiples rows of table: "billing_invoice" */
  updateBillingInvoiceMany: Maybe<Array<Maybe<BillingInvoiceMutationResponse>>>;
  /** update single row of the table: "billing_invoices" */
  updateBillingInvoicesById: Maybe<BillingInvoices>;
  /** update multiples rows of table: "billing_invoices" */
  updateBillingInvoicesMany: Maybe<Array<Maybe<BillingInvoicesMutationResponse>>>;
  /** update single row of the table: "billing_items" */
  updateBillingItemById: Maybe<BillingItems>;
  /** update multiples rows of table: "billing_items" */
  updateBillingItemsMany: Maybe<Array<Maybe<BillingItemsMutationResponse>>>;
  /** update single row of the table: "billing_plan" */
  updateBillingPlanById: Maybe<BillingPlans>;
  /** update multiples rows of table: "billing_plan" */
  updateBillingPlansMany: Maybe<Array<Maybe<BillingPlansMutationResponse>>>;
  /** update single row of the table: "client_billing_assignment" */
  updateClientBillingAssignmentById: Maybe<ClientBillingAssignments>;
  /** update multiples rows of table: "client_billing_assignment" */
  updateClientBillingAssignmentsMany: Maybe<Array<Maybe<ClientBillingAssignmentsMutationResponse>>>;
  /** update single row of the table: "clients" */
  updateClientById: Maybe<Clients>;
  /** update single row of the table: "client_external_systems" */
  updateClientExternalSystemById: Maybe<ClientExternalSystems>;
  /** update multiples rows of table: "client_external_systems" */
  updateClientExternalSystemsMany: Maybe<Array<Maybe<ClientExternalSystemsMutationResponse>>>;
  /** update multiples rows of table: "clients" */
  updateClientsMany: Maybe<Array<Maybe<ClientsMutationResponse>>>;
  /** update single row of the table: "audit.data_access_log" */
  updateDataAccessLogById: Maybe<DataAccessLogs>;
  /** update multiples rows of table: "audit.data_access_log" */
  updateDataAccessLogsMany: Maybe<Array<Maybe<DataAccessLogsMutationResponse>>>;
  /** update single row of the table: "external_systems" */
  updateExternalSystemById: Maybe<ExternalSystems>;
  /** update multiples rows of table: "external_systems" */
  updateExternalSystemsMany: Maybe<Array<Maybe<ExternalSystemsMutationResponse>>>;
  /** update single row of the table: "feature_flags" */
  updateFeatureFlagById: Maybe<FeatureFlags>;
  /** update multiples rows of table: "feature_flags" */
  updateFeatureFlagsMany: Maybe<Array<Maybe<FeatureFlagsMutationResponse>>>;
  /** update single row of the table: "holidays" */
  updateHolidayById: Maybe<Holidays>;
  /** update multiples rows of table: "holidays" */
  updateHolidaysMany: Maybe<Array<Maybe<HolidaysMutationResponse>>>;
  /** update single row of the table: "latest_payroll_version_results" */
  updateLatestPayrollVersionResultById: Maybe<LatestPayrollVersionResults>;
  /** update multiples rows of table: "latest_payroll_version_results" */
  updateLatestPayrollVersionResultsMany: Maybe<Array<Maybe<LatestPayrollVersionResultsMutationResponse>>>;
  /** update single row of the table: "leave" */
  updateLeaveById: Maybe<Leave>;
  /** update multiples rows of table: "leave" */
  updateLeaveMany: Maybe<Array<Maybe<LeaveMutationResponse>>>;
  /** update single row of the table: "notes" */
  updateNoteById: Maybe<Notes>;
  /** update multiples rows of table: "notes" */
  updateNotesMany: Maybe<Array<Maybe<NotesMutationResponse>>>;
  /** update single row of the table: "payroll_activation_results" */
  updatePayrollActivationResultById: Maybe<PayrollActivationResults>;
  /** update multiples rows of table: "payroll_activation_results" */
  updatePayrollActivationResultsMany: Maybe<Array<Maybe<PayrollActivationResultsMutationResponse>>>;
  /** update single row of the table: "payroll_assignment_audit" */
  updatePayrollAssignmentAuditById: Maybe<PayrollAssignmentAudits>;
  /** update multiples rows of table: "payroll_assignment_audit" */
  updatePayrollAssignmentAuditsMany: Maybe<Array<Maybe<PayrollAssignmentAuditsMutationResponse>>>;
  /** update single row of the table: "payroll_assignments" */
  updatePayrollAssignmentById: Maybe<PayrollAssignments>;
  /** update multiples rows of table: "payroll_assignments" */
  updatePayrollAssignmentsMany: Maybe<Array<Maybe<PayrollAssignmentsMutationResponse>>>;
  /** update single row of the table: "payrolls" */
  updatePayrollById: Maybe<Payrolls>;
  /** update single row of the table: "payroll_cycles" */
  updatePayrollCycleById: Maybe<PayrollCycles>;
  /** update multiples rows of table: "payroll_cycles" */
  updatePayrollCyclesMany: Maybe<Array<Maybe<PayrollCyclesMutationResponse>>>;
  /** update single row of the table: "payroll_dates" */
  updatePayrollDateById: Maybe<PayrollDates>;
  /** update single row of the table: "payroll_date_types" */
  updatePayrollDateTypeById: Maybe<PayrollDateTypes>;
  /** update multiples rows of table: "payroll_date_types" */
  updatePayrollDateTypesMany: Maybe<Array<Maybe<PayrollDateTypesMutationResponse>>>;
  /** update multiples rows of table: "payroll_dates" */
  updatePayrollDatesMany: Maybe<Array<Maybe<PayrollDatesMutationResponse>>>;
  /** update single row of the table: "payroll_version_history_results" */
  updatePayrollVersionHistoryResultById: Maybe<PayrollVersionHistoryResults>;
  /** update multiples rows of table: "payroll_version_history_results" */
  updatePayrollVersionHistoryResultsMany: Maybe<Array<Maybe<PayrollVersionHistoryResultsMutationResponse>>>;
  /** update single row of the table: "payroll_version_results" */
  updatePayrollVersionResultById: Maybe<PayrollVersionResults>;
  /** update multiples rows of table: "payroll_version_results" */
  updatePayrollVersionResultsMany: Maybe<Array<Maybe<PayrollVersionResultsMutationResponse>>>;
  /** update multiples rows of table: "payrolls" */
  updatePayrollsMany: Maybe<Array<Maybe<PayrollsMutationResponse>>>;
  /** update single row of the table: "permission_audit_log" */
  updatePermissionAuditLogById: Maybe<PermissionAuditLogs>;
  /** update multiples rows of table: "permission_audit_log" */
  updatePermissionAuditLogsMany: Maybe<Array<Maybe<PermissionAuditLogsMutationResponse>>>;
  /** update single row of the table: "permissions" */
  updatePermissionById: Maybe<Permissions>;
  /** update single row of the table: "audit.permission_changes" */
  updatePermissionChangeById: Maybe<PermissionChanges>;
  /** update multiples rows of table: "audit.permission_changes" */
  updatePermissionChangesMany: Maybe<Array<Maybe<PermissionChangesMutationResponse>>>;
  /** update single row of the table: "permission_overrides" */
  updatePermissionOverrideById: Maybe<PermissionOverrides>;
  /** update multiples rows of table: "permission_overrides" */
  updatePermissionOverridesMany: Maybe<Array<Maybe<PermissionOverridesMutationResponse>>>;
  /** update multiples rows of table: "permissions" */
  updatePermissionsMany: Maybe<Array<Maybe<PermissionsMutationResponse>>>;
  /** update single row of the table: "resources" */
  updateResourceById: Maybe<Resources>;
  /** update multiples rows of table: "resources" */
  updateResourcesMany: Maybe<Array<Maybe<ResourcesMutationResponse>>>;
  /** update single row of the table: "roles" */
  updateRoleById: Maybe<Roles>;
  /** update single row of the table: "role_permissions" */
  updateRolePermissionById: Maybe<RolePermissions>;
  /** update multiples rows of table: "role_permissions" */
  updateRolePermissionsMany: Maybe<Array<Maybe<RolePermissionsMutationResponse>>>;
  /** update multiples rows of table: "roles" */
  updateRolesMany: Maybe<Array<Maybe<RolesMutationResponse>>>;
  /** update multiples rows of table: "audit.slow_queries" */
  updateSlowQueriesMany: Maybe<Array<Maybe<SlowQueriesMutationResponse>>>;
  /** update single row of the table: "audit.slow_queries" */
  updateSlowQueryById: Maybe<SlowQueries>;
  /** update multiples rows of table: "audit.user_access_summary" */
  updateUserAccessSummariesMany: Maybe<Array<Maybe<UserAccessSummariesMutationResponse>>>;
  /** update single row of the table: "users" */
  updateUserById: Maybe<Users>;
  /** update single row of the table: "user_invitations" */
  updateUserInvitationById: Maybe<UserInvitations>;
  /** update multiples rows of table: "user_invitations" */
  updateUserInvitationsMany: Maybe<Array<Maybe<UserInvitationsMutationResponse>>>;
  /** update single row of the table: "user_roles" */
  updateUserRoleById: Maybe<UserRoles>;
  /** update multiples rows of table: "user_roles" */
  updateUserRolesMany: Maybe<Array<Maybe<UserRolesMutationResponse>>>;
  /** update single row of the table: "neon_auth.users_sync" */
  updateUserSyncById: Maybe<AuthUsersSync>;
  /** update multiples rows of table: "users" */
  updateUsersMany: Maybe<Array<Maybe<UsersMutationResponse>>>;
  /** update multiples rows of table: "users_role_backup" */
  updateUsersRoleBackupMany: Maybe<Array<Maybe<UsersRoleBackupMutationResponse>>>;
  /** update single row of the table: "work_schedule" */
  updateWorkScheduleById: Maybe<WorkSchedules>;
  /** update multiples rows of table: "work_schedule" */
  updateWorkSchedulesMany: Maybe<Array<Maybe<WorkSchedulesMutationResponse>>>;
}


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
export type MutationRootBulkDeleteBillingInvoicesArgs = {
  where: BillingInvoicesBoolExp;
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
  onConflict: InputMaybe<AdjustmentRulesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertAppSettingsArgs = {
  objects: Array<AppSettingsInsertInput>;
  onConflict: InputMaybe<AppSettingsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertAuditLogsArgs = {
  objects: Array<AuditLogsInsertInput>;
  onConflict: InputMaybe<AuditLogsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertAuthEventsArgs = {
  objects: Array<AuthEventsInsertInput>;
  onConflict: InputMaybe<AuthEventsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertBillingEventLogsArgs = {
  objects: Array<BillingEventLogsInsertInput>;
  onConflict: InputMaybe<BillingEventLogsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertBillingInvoiceArgs = {
  objects: Array<BillingInvoiceInsertInput>;
  onConflict: InputMaybe<BillingInvoiceOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertBillingInvoicesArgs = {
  objects: Array<BillingInvoicesInsertInput>;
  onConflict: InputMaybe<BillingInvoicesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertBillingItemsArgs = {
  objects: Array<BillingItemsInsertInput>;
  onConflict: InputMaybe<BillingItemsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertBillingPlansArgs = {
  objects: Array<BillingPlansInsertInput>;
  onConflict: InputMaybe<BillingPlansOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertClientBillingAssignmentsArgs = {
  objects: Array<ClientBillingAssignmentsInsertInput>;
  onConflict: InputMaybe<ClientBillingAssignmentsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertClientExternalSystemsArgs = {
  objects: Array<ClientExternalSystemsInsertInput>;
  onConflict: InputMaybe<ClientExternalSystemsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertClientsArgs = {
  objects: Array<ClientsInsertInput>;
  onConflict: InputMaybe<ClientsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertDataAccessLogsArgs = {
  objects: Array<DataAccessLogsInsertInput>;
  onConflict: InputMaybe<DataAccessLogsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertExternalSystemsArgs = {
  objects: Array<ExternalSystemsInsertInput>;
  onConflict: InputMaybe<ExternalSystemsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertFeatureFlagsArgs = {
  objects: Array<FeatureFlagsInsertInput>;
  onConflict: InputMaybe<FeatureFlagsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertHolidaysArgs = {
  objects: Array<HolidaysInsertInput>;
  onConflict: InputMaybe<HolidaysOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertLatestPayrollVersionResultsArgs = {
  objects: Array<LatestPayrollVersionResultsInsertInput>;
  onConflict: InputMaybe<LatestPayrollVersionResultsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertLeaveArgs = {
  objects: Array<LeaveInsertInput>;
  onConflict: InputMaybe<LeaveOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertNotesArgs = {
  objects: Array<NotesInsertInput>;
  onConflict: InputMaybe<NotesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollActivationResultsArgs = {
  objects: Array<PayrollActivationResultsInsertInput>;
  onConflict: InputMaybe<PayrollActivationResultsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollAssignmentAuditsArgs = {
  objects: Array<PayrollAssignmentAuditsInsertInput>;
  onConflict: InputMaybe<PayrollAssignmentAuditsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollAssignmentsArgs = {
  objects: Array<PayrollAssignmentsInsertInput>;
  onConflict: InputMaybe<PayrollAssignmentsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollCyclesArgs = {
  objects: Array<PayrollCyclesInsertInput>;
  onConflict: InputMaybe<PayrollCyclesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollDateTypesArgs = {
  objects: Array<PayrollDateTypesInsertInput>;
  onConflict: InputMaybe<PayrollDateTypesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollDatesArgs = {
  objects: Array<PayrollDatesInsertInput>;
  onConflict: InputMaybe<PayrollDatesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollVersionHistoryResultsArgs = {
  objects: Array<PayrollVersionHistoryResultsInsertInput>;
  onConflict: InputMaybe<PayrollVersionHistoryResultsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollVersionResultsArgs = {
  objects: Array<PayrollVersionResultsInsertInput>;
  onConflict: InputMaybe<PayrollVersionResultsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPayrollsArgs = {
  objects: Array<PayrollsInsertInput>;
  onConflict: InputMaybe<PayrollsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPermissionAuditLogsArgs = {
  objects: Array<PermissionAuditLogsInsertInput>;
  onConflict: InputMaybe<PermissionAuditLogsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPermissionChangesArgs = {
  objects: Array<PermissionChangesInsertInput>;
  onConflict: InputMaybe<PermissionChangesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPermissionOverridesArgs = {
  objects: Array<PermissionOverridesInsertInput>;
  onConflict: InputMaybe<PermissionOverridesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertPermissionsArgs = {
  objects: Array<PermissionsInsertInput>;
  onConflict: InputMaybe<PermissionsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertResourcesArgs = {
  objects: Array<ResourcesInsertInput>;
  onConflict: InputMaybe<ResourcesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertRolePermissionsArgs = {
  objects: Array<RolePermissionsInsertInput>;
  onConflict: InputMaybe<RolePermissionsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertRolesArgs = {
  objects: Array<RolesInsertInput>;
  onConflict: InputMaybe<RolesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertSlowQueriesArgs = {
  objects: Array<SlowQueriesInsertInput>;
  onConflict: InputMaybe<SlowQueriesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertUserAccessSummariesArgs = {
  objects: Array<UserAccessSummariesInsertInput>;
};


/** mutation root */
export type MutationRootBulkInsertUserInvitationsArgs = {
  objects: Array<UserInvitationsInsertInput>;
  onConflict: InputMaybe<UserInvitationsOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertUserRolesArgs = {
  objects: Array<UserRolesInsertInput>;
  onConflict: InputMaybe<UserRolesOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertUsersArgs = {
  objects: Array<UsersInsertInput>;
  onConflict: InputMaybe<UsersOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertUsersRoleBackupsArgs = {
  objects: Array<UsersRoleBackupInsertInput>;
};


/** mutation root */
export type MutationRootBulkInsertUsersSyncArgs = {
  objects: Array<AuthUsersSyncInsertInput>;
  onConflict: InputMaybe<AuthUsersSyncOnConflict>;
};


/** mutation root */
export type MutationRootBulkInsertWorkSchedulesArgs = {
  objects: Array<WorkSchedulesInsertInput>;
  onConflict: InputMaybe<WorkSchedulesOnConflict>;
};


/** mutation root */
export type MutationRootBulkUpdateAdjustmentRulesArgs = {
  _set: InputMaybe<AdjustmentRulesSetInput>;
  where: AdjustmentRulesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateAppSettingsArgs = {
  _append: InputMaybe<AppSettingsAppendInput>;
  _deleteAtPath: InputMaybe<AppSettingsDeleteAtPathInput>;
  _deleteElem: InputMaybe<AppSettingsDeleteElemInput>;
  _deleteKey: InputMaybe<AppSettingsDeleteKeyInput>;
  _prepend: InputMaybe<AppSettingsPrependInput>;
  _set: InputMaybe<AppSettingsSetInput>;
  where: AppSettingsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateAuditLogsArgs = {
  _append: InputMaybe<AuditLogsAppendInput>;
  _deleteAtPath: InputMaybe<AuditLogsDeleteAtPathInput>;
  _deleteElem: InputMaybe<AuditLogsDeleteElemInput>;
  _deleteKey: InputMaybe<AuditLogsDeleteKeyInput>;
  _prepend: InputMaybe<AuditLogsPrependInput>;
  _set: InputMaybe<AuditLogsSetInput>;
  where: AuditLogsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateAuthEventsArgs = {
  _append: InputMaybe<AuthEventsAppendInput>;
  _deleteAtPath: InputMaybe<AuthEventsDeleteAtPathInput>;
  _deleteElem: InputMaybe<AuthEventsDeleteElemInput>;
  _deleteKey: InputMaybe<AuthEventsDeleteKeyInput>;
  _prepend: InputMaybe<AuthEventsPrependInput>;
  _set: InputMaybe<AuthEventsSetInput>;
  where: AuthEventsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateBillingEventLogsArgs = {
  _set: InputMaybe<BillingEventLogsSetInput>;
  where: BillingEventLogsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateBillingInvoiceArgs = {
  _inc: InputMaybe<BillingInvoiceIncInput>;
  _set: InputMaybe<BillingInvoiceSetInput>;
  where: BillingInvoiceBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateBillingInvoicesArgs = {
  _inc: InputMaybe<BillingInvoicesIncInput>;
  _set: InputMaybe<BillingInvoicesSetInput>;
  where: BillingInvoicesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateBillingItemsArgs = {
  _inc: InputMaybe<BillingItemsIncInput>;
  _set: InputMaybe<BillingItemsSetInput>;
  where: BillingItemsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateBillingPlansArgs = {
  _inc: InputMaybe<BillingPlansIncInput>;
  _set: InputMaybe<BillingPlansSetInput>;
  where: BillingPlansBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateClientBillingAssignmentsArgs = {
  _set: InputMaybe<ClientBillingAssignmentsSetInput>;
  where: ClientBillingAssignmentsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateClientExternalSystemsArgs = {
  _set: InputMaybe<ClientExternalSystemsSetInput>;
  where: ClientExternalSystemsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateClientsArgs = {
  _set: InputMaybe<ClientsSetInput>;
  where: ClientsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateDataAccessLogsArgs = {
  _append: InputMaybe<DataAccessLogsAppendInput>;
  _deleteAtPath: InputMaybe<DataAccessLogsDeleteAtPathInput>;
  _deleteElem: InputMaybe<DataAccessLogsDeleteElemInput>;
  _deleteKey: InputMaybe<DataAccessLogsDeleteKeyInput>;
  _inc: InputMaybe<DataAccessLogsIncInput>;
  _prepend: InputMaybe<DataAccessLogsPrependInput>;
  _set: InputMaybe<DataAccessLogsSetInput>;
  where: DataAccessLogsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateExternalSystemsArgs = {
  _set: InputMaybe<ExternalSystemsSetInput>;
  where: ExternalSystemsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateFeatureFlagsArgs = {
  _append: InputMaybe<FeatureFlagsAppendInput>;
  _deleteAtPath: InputMaybe<FeatureFlagsDeleteAtPathInput>;
  _deleteElem: InputMaybe<FeatureFlagsDeleteElemInput>;
  _deleteKey: InputMaybe<FeatureFlagsDeleteKeyInput>;
  _prepend: InputMaybe<FeatureFlagsPrependInput>;
  _set: InputMaybe<FeatureFlagsSetInput>;
  where: FeatureFlagsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateHolidaysArgs = {
  _inc: InputMaybe<HolidaysIncInput>;
  _set: InputMaybe<HolidaysSetInput>;
  where: HolidaysBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateLatestPayrollVersionResultsArgs = {
  _inc: InputMaybe<LatestPayrollVersionResultsIncInput>;
  _set: InputMaybe<LatestPayrollVersionResultsSetInput>;
  where: LatestPayrollVersionResultsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateLeaveArgs = {
  _set: InputMaybe<LeaveSetInput>;
  where: LeaveBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateNotesArgs = {
  _set: InputMaybe<NotesSetInput>;
  where: NotesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollActivationResultsArgs = {
  _inc: InputMaybe<PayrollActivationResultsIncInput>;
  _set: InputMaybe<PayrollActivationResultsSetInput>;
  where: PayrollActivationResultsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollAssignmentAuditsArgs = {
  _set: InputMaybe<PayrollAssignmentAuditsSetInput>;
  where: PayrollAssignmentAuditsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollAssignmentsArgs = {
  _set: InputMaybe<PayrollAssignmentsSetInput>;
  where: PayrollAssignmentsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollCyclesArgs = {
  _set: InputMaybe<PayrollCyclesSetInput>;
  where: PayrollCyclesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollDateTypesArgs = {
  _set: InputMaybe<PayrollDateTypesSetInput>;
  where: PayrollDateTypesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollDatesArgs = {
  _set: InputMaybe<PayrollDatesSetInput>;
  where: PayrollDatesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollVersionHistoryResultsArgs = {
  _inc: InputMaybe<PayrollVersionHistoryResultsIncInput>;
  _set: InputMaybe<PayrollVersionHistoryResultsSetInput>;
  where: PayrollVersionHistoryResultsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollVersionResultsArgs = {
  _inc: InputMaybe<PayrollVersionResultsIncInput>;
  _set: InputMaybe<PayrollVersionResultsSetInput>;
  where: PayrollVersionResultsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePayrollsArgs = {
  _inc: InputMaybe<PayrollsIncInput>;
  _set: InputMaybe<PayrollsSetInput>;
  where: PayrollsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePermissionAuditLogsArgs = {
  _append: InputMaybe<PermissionAuditLogsAppendInput>;
  _deleteAtPath: InputMaybe<PermissionAuditLogsDeleteAtPathInput>;
  _deleteElem: InputMaybe<PermissionAuditLogsDeleteElemInput>;
  _deleteKey: InputMaybe<PermissionAuditLogsDeleteKeyInput>;
  _prepend: InputMaybe<PermissionAuditLogsPrependInput>;
  _set: InputMaybe<PermissionAuditLogsSetInput>;
  where: PermissionAuditLogsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePermissionChangesArgs = {
  _append: InputMaybe<PermissionChangesAppendInput>;
  _deleteAtPath: InputMaybe<PermissionChangesDeleteAtPathInput>;
  _deleteElem: InputMaybe<PermissionChangesDeleteElemInput>;
  _deleteKey: InputMaybe<PermissionChangesDeleteKeyInput>;
  _prepend: InputMaybe<PermissionChangesPrependInput>;
  _set: InputMaybe<PermissionChangesSetInput>;
  where: PermissionChangesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePermissionOverridesArgs = {
  _append: InputMaybe<PermissionOverridesAppendInput>;
  _deleteAtPath: InputMaybe<PermissionOverridesDeleteAtPathInput>;
  _deleteElem: InputMaybe<PermissionOverridesDeleteElemInput>;
  _deleteKey: InputMaybe<PermissionOverridesDeleteKeyInput>;
  _prepend: InputMaybe<PermissionOverridesPrependInput>;
  _set: InputMaybe<PermissionOverridesSetInput>;
  where: PermissionOverridesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdatePermissionsArgs = {
  _set: InputMaybe<PermissionsSetInput>;
  where: PermissionsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateResourcesArgs = {
  _set: InputMaybe<ResourcesSetInput>;
  where: ResourcesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateRolePermissionsArgs = {
  _append: InputMaybe<RolePermissionsAppendInput>;
  _deleteAtPath: InputMaybe<RolePermissionsDeleteAtPathInput>;
  _deleteElem: InputMaybe<RolePermissionsDeleteElemInput>;
  _deleteKey: InputMaybe<RolePermissionsDeleteKeyInput>;
  _prepend: InputMaybe<RolePermissionsPrependInput>;
  _set: InputMaybe<RolePermissionsSetInput>;
  where: RolePermissionsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateRolesArgs = {
  _inc: InputMaybe<RolesIncInput>;
  _set: InputMaybe<RolesSetInput>;
  where: RolesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateSlowQueriesArgs = {
  _set: InputMaybe<SlowQueriesSetInput>;
  where: SlowQueriesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateUserAccessSummariesArgs = {
  _set: InputMaybe<UserAccessSummariesSetInput>;
  where: UserAccessSummariesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateUserInvitationsArgs = {
  _append: InputMaybe<UserInvitationsAppendInput>;
  _deleteAtPath: InputMaybe<UserInvitationsDeleteAtPathInput>;
  _deleteElem: InputMaybe<UserInvitationsDeleteElemInput>;
  _deleteKey: InputMaybe<UserInvitationsDeleteKeyInput>;
  _prepend: InputMaybe<UserInvitationsPrependInput>;
  _set: InputMaybe<UserInvitationsSetInput>;
  where: UserInvitationsBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateUserRolesArgs = {
  _set: InputMaybe<UserRolesSetInput>;
  where: UserRolesBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateUsersArgs = {
  _set: InputMaybe<UsersSetInput>;
  where: UsersBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateUsersRoleBackupsArgs = {
  _set: InputMaybe<UsersRoleBackupSetInput>;
  where: UsersRoleBackupBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateUsersSyncArgs = {
  _append: InputMaybe<AuthUsersSyncAppendInput>;
  _deleteAtPath: InputMaybe<AuthUsersSyncDeleteAtPathInput>;
  _deleteElem: InputMaybe<AuthUsersSyncDeleteElemInput>;
  _deleteKey: InputMaybe<AuthUsersSyncDeleteKeyInput>;
  _prepend: InputMaybe<AuthUsersSyncPrependInput>;
  _set: InputMaybe<AuthUsersSyncSetInput>;
  where: AuthUsersSyncBoolExp;
};


/** mutation root */
export type MutationRootBulkUpdateWorkSchedulesArgs = {
  _inc: InputMaybe<WorkSchedulesIncInput>;
  _set: InputMaybe<WorkSchedulesSetInput>;
  where: WorkSchedulesBoolExp;
};


/** mutation root */
export type MutationRootCheckSuspiciousActivityArgs = {
  timeWindow: InputMaybe<Scalars['Int']['input']>;
  userId: InputMaybe<Scalars['String']['input']>;
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
export type MutationRootDeleteBillingInvoicesByIdArgs = {
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
  onConflict: InputMaybe<AdjustmentRulesOnConflict>;
};


/** mutation root */
export type MutationRootInsertAppSettingArgs = {
  object: AppSettingsInsertInput;
  onConflict: InputMaybe<AppSettingsOnConflict>;
};


/** mutation root */
export type MutationRootInsertAuditLogArgs = {
  object: AuditLogsInsertInput;
  onConflict: InputMaybe<AuditLogsOnConflict>;
};


/** mutation root */
export type MutationRootInsertAuthEventArgs = {
  object: AuthEventsInsertInput;
  onConflict: InputMaybe<AuthEventsOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingEventLogArgs = {
  object: BillingEventLogsInsertInput;
  onConflict: InputMaybe<BillingEventLogsOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingInvoiceArgs = {
  object: BillingInvoiceInsertInput;
  onConflict: InputMaybe<BillingInvoiceOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingInvoicesArgs = {
  object: BillingInvoicesInsertInput;
  onConflict: InputMaybe<BillingInvoicesOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingItemArgs = {
  object: BillingItemsInsertInput;
  onConflict: InputMaybe<BillingItemsOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingPlanArgs = {
  object: BillingPlansInsertInput;
  onConflict: InputMaybe<BillingPlansOnConflict>;
};


/** mutation root */
export type MutationRootInsertClientArgs = {
  object: ClientsInsertInput;
  onConflict: InputMaybe<ClientsOnConflict>;
};


/** mutation root */
export type MutationRootInsertClientBillingAssignmentArgs = {
  object: ClientBillingAssignmentsInsertInput;
  onConflict: InputMaybe<ClientBillingAssignmentsOnConflict>;
};


/** mutation root */
export type MutationRootInsertClientExternalSystemArgs = {
  object: ClientExternalSystemsInsertInput;
  onConflict: InputMaybe<ClientExternalSystemsOnConflict>;
};


/** mutation root */
export type MutationRootInsertDataAccessLogArgs = {
  object: DataAccessLogsInsertInput;
  onConflict: InputMaybe<DataAccessLogsOnConflict>;
};


/** mutation root */
export type MutationRootInsertExternalSystemArgs = {
  object: ExternalSystemsInsertInput;
  onConflict: InputMaybe<ExternalSystemsOnConflict>;
};


/** mutation root */
export type MutationRootInsertFeatureFlagArgs = {
  object: FeatureFlagsInsertInput;
  onConflict: InputMaybe<FeatureFlagsOnConflict>;
};


/** mutation root */
export type MutationRootInsertHolidayArgs = {
  object: HolidaysInsertInput;
  onConflict: InputMaybe<HolidaysOnConflict>;
};


/** mutation root */
export type MutationRootInsertLatestPayrollVersionResultArgs = {
  object: LatestPayrollVersionResultsInsertInput;
  onConflict: InputMaybe<LatestPayrollVersionResultsOnConflict>;
};


/** mutation root */
export type MutationRootInsertLeaveArgs = {
  object: LeaveInsertInput;
  onConflict: InputMaybe<LeaveOnConflict>;
};


/** mutation root */
export type MutationRootInsertNoteArgs = {
  object: NotesInsertInput;
  onConflict: InputMaybe<NotesOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollArgs = {
  object: PayrollsInsertInput;
  onConflict: InputMaybe<PayrollsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollActivationResultArgs = {
  object: PayrollActivationResultsInsertInput;
  onConflict: InputMaybe<PayrollActivationResultsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollAssignmentArgs = {
  object: PayrollAssignmentsInsertInput;
  onConflict: InputMaybe<PayrollAssignmentsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollAssignmentAuditArgs = {
  object: PayrollAssignmentAuditsInsertInput;
  onConflict: InputMaybe<PayrollAssignmentAuditsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollCycleArgs = {
  object: PayrollCyclesInsertInput;
  onConflict: InputMaybe<PayrollCyclesOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollDateArgs = {
  object: PayrollDatesInsertInput;
  onConflict: InputMaybe<PayrollDatesOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollDateTypeArgs = {
  object: PayrollDateTypesInsertInput;
  onConflict: InputMaybe<PayrollDateTypesOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollVersionHistoryResultArgs = {
  object: PayrollVersionHistoryResultsInsertInput;
  onConflict: InputMaybe<PayrollVersionHistoryResultsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollVersionResultArgs = {
  object: PayrollVersionResultsInsertInput;
  onConflict: InputMaybe<PayrollVersionResultsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPermissionArgs = {
  object: PermissionsInsertInput;
  onConflict: InputMaybe<PermissionsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPermissionAuditLogArgs = {
  object: PermissionAuditLogsInsertInput;
  onConflict: InputMaybe<PermissionAuditLogsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPermissionChangeArgs = {
  object: PermissionChangesInsertInput;
  onConflict: InputMaybe<PermissionChangesOnConflict>;
};


/** mutation root */
export type MutationRootInsertPermissionOverrideArgs = {
  object: PermissionOverridesInsertInput;
  onConflict: InputMaybe<PermissionOverridesOnConflict>;
};


/** mutation root */
export type MutationRootInsertResourceArgs = {
  object: ResourcesInsertInput;
  onConflict: InputMaybe<ResourcesOnConflict>;
};


/** mutation root */
export type MutationRootInsertRoleArgs = {
  object: RolesInsertInput;
  onConflict: InputMaybe<RolesOnConflict>;
};


/** mutation root */
export type MutationRootInsertRolePermissionArgs = {
  object: RolePermissionsInsertInput;
  onConflict: InputMaybe<RolePermissionsOnConflict>;
};


/** mutation root */
export type MutationRootInsertSlowQueryArgs = {
  object: SlowQueriesInsertInput;
  onConflict: InputMaybe<SlowQueriesOnConflict>;
};


/** mutation root */
export type MutationRootInsertUserArgs = {
  object: UsersInsertInput;
  onConflict: InputMaybe<UsersOnConflict>;
};


/** mutation root */
export type MutationRootInsertUserAccessSummaryArgs = {
  object: UserAccessSummariesInsertInput;
};


/** mutation root */
export type MutationRootInsertUserInvitationArgs = {
  object: UserInvitationsInsertInput;
  onConflict: InputMaybe<UserInvitationsOnConflict>;
};


/** mutation root */
export type MutationRootInsertUserRoleArgs = {
  object: UserRolesInsertInput;
  onConflict: InputMaybe<UserRolesOnConflict>;
};


/** mutation root */
export type MutationRootInsertUserSyncArgs = {
  object: AuthUsersSyncInsertInput;
  onConflict: InputMaybe<AuthUsersSyncOnConflict>;
};


/** mutation root */
export type MutationRootInsertUsersRoleBackupArgs = {
  object: UsersRoleBackupInsertInput;
};


/** mutation root */
export type MutationRootInsertWorkScheduleArgs = {
  object: WorkSchedulesInsertInput;
  onConflict: InputMaybe<WorkSchedulesOnConflict>;
};


/** mutation root */
export type MutationRootLogAuditEventArgs = {
  event: AuditEventInput;
};


/** mutation root */
export type MutationRootUpdateAdjustmentRuleByIdArgs = {
  _set: InputMaybe<AdjustmentRulesSetInput>;
  pkColumns: AdjustmentRulesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateAdjustmentRulesManyArgs = {
  updates: Array<AdjustmentRulesUpdates>;
};


/** mutation root */
export type MutationRootUpdateAppSettingByIdArgs = {
  _append: InputMaybe<AppSettingsAppendInput>;
  _deleteAtPath: InputMaybe<AppSettingsDeleteAtPathInput>;
  _deleteElem: InputMaybe<AppSettingsDeleteElemInput>;
  _deleteKey: InputMaybe<AppSettingsDeleteKeyInput>;
  _prepend: InputMaybe<AppSettingsPrependInput>;
  _set: InputMaybe<AppSettingsSetInput>;
  pkColumns: AppSettingsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateAppSettingsManyArgs = {
  updates: Array<AppSettingsUpdates>;
};


/** mutation root */
export type MutationRootUpdateAuditLogByIdArgs = {
  _append: InputMaybe<AuditLogsAppendInput>;
  _deleteAtPath: InputMaybe<AuditLogsDeleteAtPathInput>;
  _deleteElem: InputMaybe<AuditLogsDeleteElemInput>;
  _deleteKey: InputMaybe<AuditLogsDeleteKeyInput>;
  _prepend: InputMaybe<AuditLogsPrependInput>;
  _set: InputMaybe<AuditLogsSetInput>;
  pkColumns: AuditLogsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateAuditLogsManyArgs = {
  updates: Array<AuditLogsUpdates>;
};


/** mutation root */
export type MutationRootUpdateAuthEventByIdArgs = {
  _append: InputMaybe<AuthEventsAppendInput>;
  _deleteAtPath: InputMaybe<AuthEventsDeleteAtPathInput>;
  _deleteElem: InputMaybe<AuthEventsDeleteElemInput>;
  _deleteKey: InputMaybe<AuthEventsDeleteKeyInput>;
  _prepend: InputMaybe<AuthEventsPrependInput>;
  _set: InputMaybe<AuthEventsSetInput>;
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
  _set: InputMaybe<BillingEventLogsSetInput>;
  pkColumns: BillingEventLogsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBillingEventLogsManyArgs = {
  updates: Array<BillingEventLogsUpdates>;
};


/** mutation root */
export type MutationRootUpdateBillingInvoiceByIdArgs = {
  _inc: InputMaybe<BillingInvoiceIncInput>;
  _set: InputMaybe<BillingInvoiceSetInput>;
  pkColumns: BillingInvoicePkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBillingInvoiceManyArgs = {
  updates: Array<BillingInvoiceUpdates>;
};


/** mutation root */
export type MutationRootUpdateBillingInvoicesByIdArgs = {
  _inc: InputMaybe<BillingInvoicesIncInput>;
  _set: InputMaybe<BillingInvoicesSetInput>;
  pkColumns: BillingInvoicesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBillingInvoicesManyArgs = {
  updates: Array<BillingInvoicesUpdates>;
};


/** mutation root */
export type MutationRootUpdateBillingItemByIdArgs = {
  _inc: InputMaybe<BillingItemsIncInput>;
  _set: InputMaybe<BillingItemsSetInput>;
  pkColumns: BillingItemsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBillingItemsManyArgs = {
  updates: Array<BillingItemsUpdates>;
};


/** mutation root */
export type MutationRootUpdateBillingPlanByIdArgs = {
  _inc: InputMaybe<BillingPlansIncInput>;
  _set: InputMaybe<BillingPlansSetInput>;
  pkColumns: BillingPlansPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBillingPlansManyArgs = {
  updates: Array<BillingPlansUpdates>;
};


/** mutation root */
export type MutationRootUpdateClientBillingAssignmentByIdArgs = {
  _set: InputMaybe<ClientBillingAssignmentsSetInput>;
  pkColumns: ClientBillingAssignmentsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateClientBillingAssignmentsManyArgs = {
  updates: Array<ClientBillingAssignmentsUpdates>;
};


/** mutation root */
export type MutationRootUpdateClientByIdArgs = {
  _set: InputMaybe<ClientsSetInput>;
  pkColumns: ClientsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateClientExternalSystemByIdArgs = {
  _set: InputMaybe<ClientExternalSystemsSetInput>;
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
  _append: InputMaybe<DataAccessLogsAppendInput>;
  _deleteAtPath: InputMaybe<DataAccessLogsDeleteAtPathInput>;
  _deleteElem: InputMaybe<DataAccessLogsDeleteElemInput>;
  _deleteKey: InputMaybe<DataAccessLogsDeleteKeyInput>;
  _inc: InputMaybe<DataAccessLogsIncInput>;
  _prepend: InputMaybe<DataAccessLogsPrependInput>;
  _set: InputMaybe<DataAccessLogsSetInput>;
  pkColumns: DataAccessLogsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateDataAccessLogsManyArgs = {
  updates: Array<DataAccessLogsUpdates>;
};


/** mutation root */
export type MutationRootUpdateExternalSystemByIdArgs = {
  _set: InputMaybe<ExternalSystemsSetInput>;
  pkColumns: ExternalSystemsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateExternalSystemsManyArgs = {
  updates: Array<ExternalSystemsUpdates>;
};


/** mutation root */
export type MutationRootUpdateFeatureFlagByIdArgs = {
  _append: InputMaybe<FeatureFlagsAppendInput>;
  _deleteAtPath: InputMaybe<FeatureFlagsDeleteAtPathInput>;
  _deleteElem: InputMaybe<FeatureFlagsDeleteElemInput>;
  _deleteKey: InputMaybe<FeatureFlagsDeleteKeyInput>;
  _prepend: InputMaybe<FeatureFlagsPrependInput>;
  _set: InputMaybe<FeatureFlagsSetInput>;
  pkColumns: FeatureFlagsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateFeatureFlagsManyArgs = {
  updates: Array<FeatureFlagsUpdates>;
};


/** mutation root */
export type MutationRootUpdateHolidayByIdArgs = {
  _inc: InputMaybe<HolidaysIncInput>;
  _set: InputMaybe<HolidaysSetInput>;
  pkColumns: HolidaysPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateHolidaysManyArgs = {
  updates: Array<HolidaysUpdates>;
};


/** mutation root */
export type MutationRootUpdateLatestPayrollVersionResultByIdArgs = {
  _inc: InputMaybe<LatestPayrollVersionResultsIncInput>;
  _set: InputMaybe<LatestPayrollVersionResultsSetInput>;
  pkColumns: LatestPayrollVersionResultsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateLatestPayrollVersionResultsManyArgs = {
  updates: Array<LatestPayrollVersionResultsUpdates>;
};


/** mutation root */
export type MutationRootUpdateLeaveByIdArgs = {
  _set: InputMaybe<LeaveSetInput>;
  pkColumns: LeavePkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateLeaveManyArgs = {
  updates: Array<LeaveUpdates>;
};


/** mutation root */
export type MutationRootUpdateNoteByIdArgs = {
  _set: InputMaybe<NotesSetInput>;
  pkColumns: NotesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateNotesManyArgs = {
  updates: Array<NotesUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollActivationResultByIdArgs = {
  _inc: InputMaybe<PayrollActivationResultsIncInput>;
  _set: InputMaybe<PayrollActivationResultsSetInput>;
  pkColumns: PayrollActivationResultsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollActivationResultsManyArgs = {
  updates: Array<PayrollActivationResultsUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollAssignmentAuditByIdArgs = {
  _set: InputMaybe<PayrollAssignmentAuditsSetInput>;
  pkColumns: PayrollAssignmentAuditsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollAssignmentAuditsManyArgs = {
  updates: Array<PayrollAssignmentAuditsUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollAssignmentByIdArgs = {
  _set: InputMaybe<PayrollAssignmentsSetInput>;
  pkColumns: PayrollAssignmentsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollAssignmentsManyArgs = {
  updates: Array<PayrollAssignmentsUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollByIdArgs = {
  _inc: InputMaybe<PayrollsIncInput>;
  _set: InputMaybe<PayrollsSetInput>;
  pkColumns: PayrollsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollCycleByIdArgs = {
  _set: InputMaybe<PayrollCyclesSetInput>;
  pkColumns: PayrollCyclesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollCyclesManyArgs = {
  updates: Array<PayrollCyclesUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollDateByIdArgs = {
  _set: InputMaybe<PayrollDatesSetInput>;
  pkColumns: PayrollDatesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollDateTypeByIdArgs = {
  _set: InputMaybe<PayrollDateTypesSetInput>;
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
  _inc: InputMaybe<PayrollVersionHistoryResultsIncInput>;
  _set: InputMaybe<PayrollVersionHistoryResultsSetInput>;
  pkColumns: PayrollVersionHistoryResultsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollVersionHistoryResultsManyArgs = {
  updates: Array<PayrollVersionHistoryResultsUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollVersionResultByIdArgs = {
  _inc: InputMaybe<PayrollVersionResultsIncInput>;
  _set: InputMaybe<PayrollVersionResultsSetInput>;
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
  _append: InputMaybe<PermissionAuditLogsAppendInput>;
  _deleteAtPath: InputMaybe<PermissionAuditLogsDeleteAtPathInput>;
  _deleteElem: InputMaybe<PermissionAuditLogsDeleteElemInput>;
  _deleteKey: InputMaybe<PermissionAuditLogsDeleteKeyInput>;
  _prepend: InputMaybe<PermissionAuditLogsPrependInput>;
  _set: InputMaybe<PermissionAuditLogsSetInput>;
  pkColumns: PermissionAuditLogsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePermissionAuditLogsManyArgs = {
  updates: Array<PermissionAuditLogsUpdates>;
};


/** mutation root */
export type MutationRootUpdatePermissionByIdArgs = {
  _set: InputMaybe<PermissionsSetInput>;
  pkColumns: PermissionsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePermissionChangeByIdArgs = {
  _append: InputMaybe<PermissionChangesAppendInput>;
  _deleteAtPath: InputMaybe<PermissionChangesDeleteAtPathInput>;
  _deleteElem: InputMaybe<PermissionChangesDeleteElemInput>;
  _deleteKey: InputMaybe<PermissionChangesDeleteKeyInput>;
  _prepend: InputMaybe<PermissionChangesPrependInput>;
  _set: InputMaybe<PermissionChangesSetInput>;
  pkColumns: PermissionChangesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePermissionChangesManyArgs = {
  updates: Array<PermissionChangesUpdates>;
};


/** mutation root */
export type MutationRootUpdatePermissionOverrideByIdArgs = {
  _append: InputMaybe<PermissionOverridesAppendInput>;
  _deleteAtPath: InputMaybe<PermissionOverridesDeleteAtPathInput>;
  _deleteElem: InputMaybe<PermissionOverridesDeleteElemInput>;
  _deleteKey: InputMaybe<PermissionOverridesDeleteKeyInput>;
  _prepend: InputMaybe<PermissionOverridesPrependInput>;
  _set: InputMaybe<PermissionOverridesSetInput>;
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
  _set: InputMaybe<ResourcesSetInput>;
  pkColumns: ResourcesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateResourcesManyArgs = {
  updates: Array<ResourcesUpdates>;
};


/** mutation root */
export type MutationRootUpdateRoleByIdArgs = {
  _inc: InputMaybe<RolesIncInput>;
  _set: InputMaybe<RolesSetInput>;
  pkColumns: RolesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateRolePermissionByIdArgs = {
  _append: InputMaybe<RolePermissionsAppendInput>;
  _deleteAtPath: InputMaybe<RolePermissionsDeleteAtPathInput>;
  _deleteElem: InputMaybe<RolePermissionsDeleteElemInput>;
  _deleteKey: InputMaybe<RolePermissionsDeleteKeyInput>;
  _prepend: InputMaybe<RolePermissionsPrependInput>;
  _set: InputMaybe<RolePermissionsSetInput>;
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
  _set: InputMaybe<SlowQueriesSetInput>;
  pkColumns: SlowQueriesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateUserAccessSummariesManyArgs = {
  updates: Array<UserAccessSummariesUpdates>;
};


/** mutation root */
export type MutationRootUpdateUserByIdArgs = {
  _set: InputMaybe<UsersSetInput>;
  pkColumns: UsersPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateUserInvitationByIdArgs = {
  _append: InputMaybe<UserInvitationsAppendInput>;
  _deleteAtPath: InputMaybe<UserInvitationsDeleteAtPathInput>;
  _deleteElem: InputMaybe<UserInvitationsDeleteElemInput>;
  _deleteKey: InputMaybe<UserInvitationsDeleteKeyInput>;
  _prepend: InputMaybe<UserInvitationsPrependInput>;
  _set: InputMaybe<UserInvitationsSetInput>;
  pkColumns: UserInvitationsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateUserInvitationsManyArgs = {
  updates: Array<UserInvitationsUpdates>;
};


/** mutation root */
export type MutationRootUpdateUserRoleByIdArgs = {
  _set: InputMaybe<UserRolesSetInput>;
  pkColumns: UserRolesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateUserRolesManyArgs = {
  updates: Array<UserRolesUpdates>;
};


/** mutation root */
export type MutationRootUpdateUserSyncByIdArgs = {
  _append: InputMaybe<AuthUsersSyncAppendInput>;
  _deleteAtPath: InputMaybe<AuthUsersSyncDeleteAtPathInput>;
  _deleteElem: InputMaybe<AuthUsersSyncDeleteElemInput>;
  _deleteKey: InputMaybe<AuthUsersSyncDeleteKeyInput>;
  _prepend: InputMaybe<AuthUsersSyncPrependInput>;
  _set: InputMaybe<AuthUsersSyncSetInput>;
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
  _inc: InputMaybe<WorkSchedulesIncInput>;
  _set: InputMaybe<WorkSchedulesSetInput>;
  pkColumns: WorkSchedulesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateWorkSchedulesManyArgs = {
  updates: Array<WorkSchedulesUpdates>;
};

/** columns and relationships of "notes" */
export interface Notes {
  __typename?: 'notes';
  /** An object relationship */
  authorUser: Maybe<Users>;
  /** Content of the note */
  content: Scalars['String']['output'];
  /** Timestamp when the note was created */
  createdAt: Maybe<Scalars['timestamp']['output']>;
  /** Identifier of the entity this note is attached to */
  entityId: Scalars['uuid']['output'];
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entityType: Scalars['String']['output'];
  /** Unique identifier for the note */
  id: Scalars['uuid']['output'];
  /** Whether the note is flagged as important */
  isImportant: Maybe<Scalars['Boolean']['output']>;
  /** An array relationship */
  notesByClient: Array<Clients>;
  /** An aggregate relationship */
  notesByClientAggregate: ClientsAggregate;
  /** An array relationship */
  notesByPayroll: Array<Payrolls>;
  /** An aggregate relationship */
  notesByPayrollAggregate: PayrollsAggregate;
  /** Timestamp when the note was last updated */
  updatedAt: Maybe<Scalars['timestamp']['output']>;
  /** User who created the note */
  userId: Maybe<Scalars['uuid']['output']>;
}


/** columns and relationships of "notes" */
export type NotesNotesByClientArgs = {
  distinctOn: InputMaybe<Array<ClientsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientsOrderBy>>;
  where: InputMaybe<ClientsBoolExp>;
};


/** columns and relationships of "notes" */
export type NotesNotesByClientAggregateArgs = {
  distinctOn: InputMaybe<Array<ClientsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientsOrderBy>>;
  where: InputMaybe<ClientsBoolExp>;
};


/** columns and relationships of "notes" */
export type NotesNotesByPayrollArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "notes" */
export type NotesNotesByPayrollAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};

/** aggregated selection of "notes" */
export interface NotesAggregate {
  __typename?: 'notesAggregate';
  aggregate: Maybe<NotesAggregateFields>;
  nodes: Array<Notes>;
}

export interface NotesAggregateBoolExp {
  bool_and?: InputMaybe<NotesAggregateBoolExpBoolAnd>;
  bool_or?: InputMaybe<NotesAggregateBoolExpBoolOr>;
  count?: InputMaybe<NotesAggregateBoolExpCount>;
}

export interface NotesAggregateBoolExpBoolAnd {
  arguments: NotesSelectColumnNotesAggregateBoolExpBoolAndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<NotesBoolExp>;
  predicate: BooleanComparisonExp;
}

export interface NotesAggregateBoolExpBoolOr {
  arguments: NotesSelectColumnNotesAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<NotesBoolExp>;
  predicate: BooleanComparisonExp;
}

export interface NotesAggregateBoolExpCount {
  arguments?: InputMaybe<Array<NotesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<NotesBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "notes" */
export interface NotesAggregateFields {
  __typename?: 'notesAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<NotesMaxFields>;
  min: Maybe<NotesMinFields>;
}


/** aggregate fields of "notes" */
export type NotesAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<NotesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "notes" */
export interface NotesAggregateOrderBy {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<NotesMaxOrderBy>;
  min?: InputMaybe<NotesMinOrderBy>;
}

/** input type for inserting array relation for remote table "notes" */
export interface NotesArrRelInsertInput {
  data: Array<NotesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<NotesOnConflict>;
}

/** Boolean expression to filter rows from the table "notes". All fields are combined with a logical 'AND'. */
export interface NotesBoolExp {
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
}

/** unique or primary key constraints on table "notes" */
export enum NotesConstraint {
  /** unique or primary key constraint on columns "id" */
  notes_pkey = 'notes_pkey'
}

/** input type for inserting data into table "notes" */
export interface NotesInsertInput {
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
}

/** aggregate max on columns */
export interface NotesMaxFields {
  __typename?: 'notesMaxFields';
  /** Content of the note */
  content: Maybe<Scalars['String']['output']>;
  /** Timestamp when the note was created */
  createdAt: Maybe<Scalars['timestamp']['output']>;
  /** Identifier of the entity this note is attached to */
  entityId: Maybe<Scalars['uuid']['output']>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entityType: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the note */
  id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the note was last updated */
  updatedAt: Maybe<Scalars['timestamp']['output']>;
  /** User who created the note */
  userId: Maybe<Scalars['uuid']['output']>;
}

/** order by max() on columns of table "notes" */
export interface NotesMaxOrderBy {
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
}

/** aggregate min on columns */
export interface NotesMinFields {
  __typename?: 'notesMinFields';
  /** Content of the note */
  content: Maybe<Scalars['String']['output']>;
  /** Timestamp when the note was created */
  createdAt: Maybe<Scalars['timestamp']['output']>;
  /** Identifier of the entity this note is attached to */
  entityId: Maybe<Scalars['uuid']['output']>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entityType: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the note */
  id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the note was last updated */
  updatedAt: Maybe<Scalars['timestamp']['output']>;
  /** User who created the note */
  userId: Maybe<Scalars['uuid']['output']>;
}

/** order by min() on columns of table "notes" */
export interface NotesMinOrderBy {
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
}

/** response of any mutation on the table "notes" */
export interface NotesMutationResponse {
  __typename?: 'notesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Notes>;
}

/** on_conflict condition type for table "notes" */
export interface NotesOnConflict {
  constraint: NotesConstraint;
  updateColumns?: Array<NotesUpdateColumn>;
  where?: InputMaybe<NotesBoolExp>;
}

/** Ordering options when selecting data from "notes". */
export interface NotesOrderBy {
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
}

/** primary key columns input for table: notes */
export interface NotesPkColumnsInput {
  /** Unique identifier for the note */
  id: Scalars['uuid']['input'];
}

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
export interface NotesSetInput {
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
}

/** Streaming cursor of the table "notes" */
export interface NotesStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: NotesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface NotesStreamCursorValueInput {
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
}

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

export interface NotesUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<NotesSetInput>;
  /** filter the rows which have to be updated */
  where: NotesBoolExp;
}

/** columns and relationships of "payroll_activation_results" */
export interface PayrollActivationResults {
  __typename?: 'payrollActivationResults';
  actionTaken: Scalars['String']['output'];
  executedAt: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  payrollId: Scalars['uuid']['output'];
  versionNumber: Scalars['Int']['output'];
}

export interface PayrollActivationResultsAggregate {
  __typename?: 'payrollActivationResultsAggregate';
  aggregate: Maybe<PayrollActivationResultsAggregateFields>;
  nodes: Array<PayrollActivationResults>;
}

/** aggregate fields of "payroll_activation_results" */
export interface PayrollActivationResultsAggregateFields {
  __typename?: 'payrollActivationResultsAggregateFields';
  avg: Maybe<PayrollActivationResultsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<PayrollActivationResultsMaxFields>;
  min: Maybe<PayrollActivationResultsMinFields>;
  stddev: Maybe<PayrollActivationResultsStddevFields>;
  stddevPop: Maybe<PayrollActivationResultsStddevPopFields>;
  stddevSamp: Maybe<PayrollActivationResultsStddevSampFields>;
  sum: Maybe<PayrollActivationResultsSumFields>;
  varPop: Maybe<PayrollActivationResultsVarPopFields>;
  varSamp: Maybe<PayrollActivationResultsVarSampFields>;
  variance: Maybe<PayrollActivationResultsVarianceFields>;
}


/** aggregate fields of "payroll_activation_results" */
export type PayrollActivationResultsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export interface PayrollActivationResultsAvgFields {
  __typename?: 'payrollActivationResultsAvgFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** Boolean expression to filter rows from the table "payroll_activation_results". All fields are combined with a logical 'AND'. */
export interface PayrollActivationResultsBoolExp {
  _and?: InputMaybe<Array<PayrollActivationResultsBoolExp>>;
  _not?: InputMaybe<PayrollActivationResultsBoolExp>;
  _or?: InputMaybe<Array<PayrollActivationResultsBoolExp>>;
  actionTaken?: InputMaybe<StringComparisonExp>;
  executedAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  versionNumber?: InputMaybe<IntComparisonExp>;
}

/** unique or primary key constraints on table "payroll_activation_results" */
export enum PayrollActivationResultsConstraint {
  /** unique or primary key constraint on columns "id" */
  payroll_activation_results_pkey = 'payroll_activation_results_pkey'
}

/** input type for incrementing numeric columns in table "payroll_activation_results" */
export interface PayrollActivationResultsIncInput {
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
}

/** input type for inserting data into table "payroll_activation_results" */
export interface PayrollActivationResultsInsertInput {
  actionTaken?: InputMaybe<Scalars['String']['input']>;
  executedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
}

/** aggregate max on columns */
export interface PayrollActivationResultsMaxFields {
  __typename?: 'payrollActivationResultsMaxFields';
  actionTaken: Maybe<Scalars['String']['output']>;
  executedAt: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  payrollId: Maybe<Scalars['uuid']['output']>;
  versionNumber: Maybe<Scalars['Int']['output']>;
}

/** aggregate min on columns */
export interface PayrollActivationResultsMinFields {
  __typename?: 'payrollActivationResultsMinFields';
  actionTaken: Maybe<Scalars['String']['output']>;
  executedAt: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  payrollId: Maybe<Scalars['uuid']['output']>;
  versionNumber: Maybe<Scalars['Int']['output']>;
}

/** response of any mutation on the table "payroll_activation_results" */
export interface PayrollActivationResultsMutationResponse {
  __typename?: 'payrollActivationResultsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollActivationResults>;
}

/** on_conflict condition type for table "payroll_activation_results" */
export interface PayrollActivationResultsOnConflict {
  constraint: PayrollActivationResultsConstraint;
  updateColumns?: Array<PayrollActivationResultsUpdateColumn>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
}

/** Ordering options when selecting data from "payroll_activation_results". */
export interface PayrollActivationResultsOrderBy {
  actionTaken?: InputMaybe<OrderBy>;
  executedAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: payroll_activation_results */
export interface PayrollActivationResultsPkColumnsInput {
  id: Scalars['uuid']['input'];
}

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
export interface PayrollActivationResultsSetInput {
  actionTaken?: InputMaybe<Scalars['String']['input']>;
  executedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
}

/** aggregate stddev on columns */
export interface PayrollActivationResultsStddevFields {
  __typename?: 'payrollActivationResultsStddevFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevPop on columns */
export interface PayrollActivationResultsStddevPopFields {
  __typename?: 'payrollActivationResultsStddevPopFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevSamp on columns */
export interface PayrollActivationResultsStddevSampFields {
  __typename?: 'payrollActivationResultsStddevSampFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** Streaming cursor of the table "payrollActivationResults" */
export interface PayrollActivationResultsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: PayrollActivationResultsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface PayrollActivationResultsStreamCursorValueInput {
  actionTaken?: InputMaybe<Scalars['String']['input']>;
  executedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
}

/** aggregate sum on columns */
export interface PayrollActivationResultsSumFields {
  __typename?: 'payrollActivationResultsSumFields';
  versionNumber: Maybe<Scalars['Int']['output']>;
}

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

export interface PayrollActivationResultsUpdates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<PayrollActivationResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollActivationResultsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollActivationResultsBoolExp;
}

/** aggregate varPop on columns */
export interface PayrollActivationResultsVarPopFields {
  __typename?: 'payrollActivationResultsVarPopFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate varSamp on columns */
export interface PayrollActivationResultsVarSampFields {
  __typename?: 'payrollActivationResultsVarSampFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate variance on columns */
export interface PayrollActivationResultsVarianceFields {
  __typename?: 'payrollActivationResultsVarianceFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** columns and relationships of "payroll_assignment_audit" */
export interface PayrollAssignmentAudits {
  __typename?: 'payrollAssignmentAudits';
  assignmentId: Maybe<Scalars['uuid']['output']>;
  changeReason: Maybe<Scalars['String']['output']>;
  changedBy: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  changedByUser: Maybe<Users>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  fromConsultant: Maybe<Users>;
  fromConsultantId: Maybe<Scalars['uuid']['output']>;
  id: Scalars['uuid']['output'];
  /** An object relationship */
  payrollAssignment: Maybe<PayrollAssignments>;
  /** An object relationship */
  payrollDate: PayrollDates;
  payrollDateId: Scalars['uuid']['output'];
  /** An object relationship */
  toConsultant: Users;
  toConsultantId: Scalars['uuid']['output'];
}

/** aggregated selection of "payroll_assignment_audit" */
export interface PayrollAssignmentAuditsAggregate {
  __typename?: 'payrollAssignmentAuditsAggregate';
  aggregate: Maybe<PayrollAssignmentAuditsAggregateFields>;
  nodes: Array<PayrollAssignmentAudits>;
}

export interface PayrollAssignmentAuditsAggregateBoolExp {
  count?: InputMaybe<PayrollAssignmentAuditsAggregateBoolExpCount>;
}

export interface PayrollAssignmentAuditsAggregateBoolExpCount {
  arguments?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "payroll_assignment_audit" */
export interface PayrollAssignmentAuditsAggregateFields {
  __typename?: 'payrollAssignmentAuditsAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<PayrollAssignmentAuditsMaxFields>;
  min: Maybe<PayrollAssignmentAuditsMinFields>;
}


/** aggregate fields of "payroll_assignment_audit" */
export type PayrollAssignmentAuditsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "payroll_assignment_audit" */
export interface PayrollAssignmentAuditsAggregateOrderBy {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<PayrollAssignmentAuditsMaxOrderBy>;
  min?: InputMaybe<PayrollAssignmentAuditsMinOrderBy>;
}

/** input type for inserting array relation for remote table "payroll_assignment_audit" */
export interface PayrollAssignmentAuditsArrRelInsertInput {
  data: Array<PayrollAssignmentAuditsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollAssignmentAuditsOnConflict>;
}

/** Boolean expression to filter rows from the table "payroll_assignment_audit". All fields are combined with a logical 'AND'. */
export interface PayrollAssignmentAuditsBoolExp {
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
}

/** unique or primary key constraints on table "payroll_assignment_audit" */
export enum PayrollAssignmentAuditsConstraint {
  /** unique or primary key constraint on columns "id" */
  payroll_assignment_audit_pkey = 'payroll_assignment_audit_pkey'
}

/** input type for inserting data into table "payroll_assignment_audit" */
export interface PayrollAssignmentAuditsInsertInput {
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
}

/** aggregate max on columns */
export interface PayrollAssignmentAuditsMaxFields {
  __typename?: 'payrollAssignmentAuditsMaxFields';
  assignmentId: Maybe<Scalars['uuid']['output']>;
  changeReason: Maybe<Scalars['String']['output']>;
  changedBy: Maybe<Scalars['uuid']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  fromConsultantId: Maybe<Scalars['uuid']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  payrollDateId: Maybe<Scalars['uuid']['output']>;
  toConsultantId: Maybe<Scalars['uuid']['output']>;
}

/** order by max() on columns of table "payroll_assignment_audit" */
export interface PayrollAssignmentAuditsMaxOrderBy {
  assignmentId?: InputMaybe<OrderBy>;
  changeReason?: InputMaybe<OrderBy>;
  changedBy?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  fromConsultantId?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  toConsultantId?: InputMaybe<OrderBy>;
}

/** aggregate min on columns */
export interface PayrollAssignmentAuditsMinFields {
  __typename?: 'payrollAssignmentAuditsMinFields';
  assignmentId: Maybe<Scalars['uuid']['output']>;
  changeReason: Maybe<Scalars['String']['output']>;
  changedBy: Maybe<Scalars['uuid']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  fromConsultantId: Maybe<Scalars['uuid']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  payrollDateId: Maybe<Scalars['uuid']['output']>;
  toConsultantId: Maybe<Scalars['uuid']['output']>;
}

/** order by min() on columns of table "payroll_assignment_audit" */
export interface PayrollAssignmentAuditsMinOrderBy {
  assignmentId?: InputMaybe<OrderBy>;
  changeReason?: InputMaybe<OrderBy>;
  changedBy?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  fromConsultantId?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  toConsultantId?: InputMaybe<OrderBy>;
}

/** response of any mutation on the table "payroll_assignment_audit" */
export interface PayrollAssignmentAuditsMutationResponse {
  __typename?: 'payrollAssignmentAuditsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollAssignmentAudits>;
}

/** on_conflict condition type for table "payroll_assignment_audit" */
export interface PayrollAssignmentAuditsOnConflict {
  constraint: PayrollAssignmentAuditsConstraint;
  updateColumns?: Array<PayrollAssignmentAuditsUpdateColumn>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
}

/** Ordering options when selecting data from "payroll_assignment_audit". */
export interface PayrollAssignmentAuditsOrderBy {
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
}

/** primary key columns input for table: payroll_assignment_audit */
export interface PayrollAssignmentAuditsPkColumnsInput {
  id: Scalars['uuid']['input'];
}

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
export interface PayrollAssignmentAuditsSetInput {
  assignmentId?: InputMaybe<Scalars['uuid']['input']>;
  changeReason?: InputMaybe<Scalars['String']['input']>;
  changedBy?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  fromConsultantId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  toConsultantId?: InputMaybe<Scalars['uuid']['input']>;
}

/** Streaming cursor of the table "payrollAssignmentAudits" */
export interface PayrollAssignmentAuditsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: PayrollAssignmentAuditsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface PayrollAssignmentAuditsStreamCursorValueInput {
  assignmentId?: InputMaybe<Scalars['uuid']['input']>;
  changeReason?: InputMaybe<Scalars['String']['input']>;
  changedBy?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  fromConsultantId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  toConsultantId?: InputMaybe<Scalars['uuid']['input']>;
}

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

export interface PayrollAssignmentAuditsUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollAssignmentAuditsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollAssignmentAuditsBoolExp;
}

/** columns and relationships of "payroll_assignments" */
export interface PayrollAssignments {
  __typename?: 'payrollAssignments';
  assignedBy: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  assignedByUser: Maybe<Users>;
  /** An object relationship */
  assignedConsultant: Users;
  assignedDate: Maybe<Scalars['timestamptz']['output']>;
  consultantId: Scalars['uuid']['output'];
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  isBackup: Maybe<Scalars['Boolean']['output']>;
  /** An object relationship */
  originalConsultant: Maybe<Users>;
  originalConsultantId: Maybe<Scalars['uuid']['output']>;
  /** An array relationship */
  payrollAssignmentAudits: Array<PayrollAssignmentAudits>;
  /** An aggregate relationship */
  payrollAssignmentAuditsAggregate: PayrollAssignmentAuditsAggregate;
  /** An object relationship */
  payrollDate: PayrollDates;
  payrollDateId: Scalars['uuid']['output'];
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}


/** columns and relationships of "payroll_assignments" */
export type PayrollAssignmentsPayrollAssignmentAuditsArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "payroll_assignments" */
export type PayrollAssignmentsPayrollAssignmentAuditsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};

/** aggregated selection of "payroll_assignments" */
export interface PayrollAssignmentsAggregate {
  __typename?: 'payrollAssignmentsAggregate';
  aggregate: Maybe<PayrollAssignmentsAggregateFields>;
  nodes: Array<PayrollAssignments>;
}

export interface PayrollAssignmentsAggregateBoolExp {
  bool_and?: InputMaybe<PayrollAssignmentsAggregateBoolExpBoolAnd>;
  bool_or?: InputMaybe<PayrollAssignmentsAggregateBoolExpBoolOr>;
  count?: InputMaybe<PayrollAssignmentsAggregateBoolExpCount>;
}

export interface PayrollAssignmentsAggregateBoolExpBoolAnd {
  arguments: PayrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBoolAndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollAssignmentsBoolExp>;
  predicate: BooleanComparisonExp;
}

export interface PayrollAssignmentsAggregateBoolExpBoolOr {
  arguments: PayrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollAssignmentsBoolExp>;
  predicate: BooleanComparisonExp;
}

export interface PayrollAssignmentsAggregateBoolExpCount {
  arguments?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollAssignmentsBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "payroll_assignments" */
export interface PayrollAssignmentsAggregateFields {
  __typename?: 'payrollAssignmentsAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<PayrollAssignmentsMaxFields>;
  min: Maybe<PayrollAssignmentsMinFields>;
}


/** aggregate fields of "payroll_assignments" */
export type PayrollAssignmentsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "payroll_assignments" */
export interface PayrollAssignmentsAggregateOrderBy {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<PayrollAssignmentsMaxOrderBy>;
  min?: InputMaybe<PayrollAssignmentsMinOrderBy>;
}

/** input type for inserting array relation for remote table "payroll_assignments" */
export interface PayrollAssignmentsArrRelInsertInput {
  data: Array<PayrollAssignmentsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollAssignmentsOnConflict>;
}

/** Boolean expression to filter rows from the table "payroll_assignments". All fields are combined with a logical 'AND'. */
export interface PayrollAssignmentsBoolExp {
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
}

/** unique or primary key constraints on table "payroll_assignments" */
export enum PayrollAssignmentsConstraint {
  /** unique or primary key constraint on columns "id" */
  payroll_assignments_pkey = 'payroll_assignments_pkey',
  /** unique or primary key constraint on columns "payroll_date_id" */
  uq_payroll_assignment_payroll_date = 'uq_payroll_assignment_payroll_date'
}

/** input type for inserting data into table "payroll_assignments" */
export interface PayrollAssignmentsInsertInput {
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
}

/** aggregate max on columns */
export interface PayrollAssignmentsMaxFields {
  __typename?: 'payrollAssignmentsMaxFields';
  assignedBy: Maybe<Scalars['uuid']['output']>;
  assignedDate: Maybe<Scalars['timestamptz']['output']>;
  consultantId: Maybe<Scalars['uuid']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  originalConsultantId: Maybe<Scalars['uuid']['output']>;
  payrollDateId: Maybe<Scalars['uuid']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by max() on columns of table "payroll_assignments" */
export interface PayrollAssignmentsMaxOrderBy {
  assignedBy?: InputMaybe<OrderBy>;
  assignedDate?: InputMaybe<OrderBy>;
  consultantId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  originalConsultantId?: InputMaybe<OrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** aggregate min on columns */
export interface PayrollAssignmentsMinFields {
  __typename?: 'payrollAssignmentsMinFields';
  assignedBy: Maybe<Scalars['uuid']['output']>;
  assignedDate: Maybe<Scalars['timestamptz']['output']>;
  consultantId: Maybe<Scalars['uuid']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  originalConsultantId: Maybe<Scalars['uuid']['output']>;
  payrollDateId: Maybe<Scalars['uuid']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by min() on columns of table "payroll_assignments" */
export interface PayrollAssignmentsMinOrderBy {
  assignedBy?: InputMaybe<OrderBy>;
  assignedDate?: InputMaybe<OrderBy>;
  consultantId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  originalConsultantId?: InputMaybe<OrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** response of any mutation on the table "payroll_assignments" */
export interface PayrollAssignmentsMutationResponse {
  __typename?: 'payrollAssignmentsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollAssignments>;
}

/** input type for inserting object relation for remote table "payroll_assignments" */
export interface PayrollAssignmentsObjRelInsertInput {
  data: PayrollAssignmentsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollAssignmentsOnConflict>;
}

/** on_conflict condition type for table "payroll_assignments" */
export interface PayrollAssignmentsOnConflict {
  constraint: PayrollAssignmentsConstraint;
  updateColumns?: Array<PayrollAssignmentsUpdateColumn>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
}

/** Ordering options when selecting data from "payroll_assignments". */
export interface PayrollAssignmentsOrderBy {
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
}

/** primary key columns input for table: payroll_assignments */
export interface PayrollAssignmentsPkColumnsInput {
  id: Scalars['uuid']['input'];
}

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
export interface PayrollAssignmentsSetInput {
  assignedBy?: InputMaybe<Scalars['uuid']['input']>;
  assignedDate?: InputMaybe<Scalars['timestamptz']['input']>;
  consultantId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isBackup?: InputMaybe<Scalars['Boolean']['input']>;
  originalConsultantId?: InputMaybe<Scalars['uuid']['input']>;
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

/** Streaming cursor of the table "payrollAssignments" */
export interface PayrollAssignmentsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: PayrollAssignmentsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface PayrollAssignmentsStreamCursorValueInput {
  assignedBy?: InputMaybe<Scalars['uuid']['input']>;
  assignedDate?: InputMaybe<Scalars['timestamptz']['input']>;
  consultantId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isBackup?: InputMaybe<Scalars['Boolean']['input']>;
  originalConsultantId?: InputMaybe<Scalars['uuid']['input']>;
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

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

export interface PayrollAssignmentsUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollAssignmentsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollAssignmentsBoolExp;
}

/** columns and relationships of "payroll_cycles" */
export interface PayrollCycles {
  __typename?: 'payrollCycles';
  /** An array relationship */
  adjustmentRules: Array<AdjustmentRules>;
  /** An aggregate relationship */
  adjustmentRulesAggregate: AdjustmentRulesAggregate;
  /** Timestamp when the cycle was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of the payroll cycle */
  description: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll cycle */
  id: Scalars['uuid']['output'];
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name: Scalars['payroll_cycle_type']['output'];
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrollsAggregate: PayrollsAggregate;
  /** Timestamp when the cycle was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}


/** columns and relationships of "payroll_cycles" */
export type PayrollCyclesAdjustmentRulesArgs = {
  distinctOn: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where: InputMaybe<AdjustmentRulesBoolExp>;
};


/** columns and relationships of "payroll_cycles" */
export type PayrollCyclesAdjustmentRulesAggregateArgs = {
  distinctOn: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where: InputMaybe<AdjustmentRulesBoolExp>;
};


/** columns and relationships of "payroll_cycles" */
export type PayrollCyclesPayrollsArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "payroll_cycles" */
export type PayrollCyclesPayrollsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};

/** aggregated selection of "payroll_cycles" */
export interface PayrollCyclesAggregate {
  __typename?: 'payrollCyclesAggregate';
  aggregate: Maybe<PayrollCyclesAggregateFields>;
  nodes: Array<PayrollCycles>;
}

/** aggregate fields of "payroll_cycles" */
export interface PayrollCyclesAggregateFields {
  __typename?: 'payrollCyclesAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<PayrollCyclesMaxFields>;
  min: Maybe<PayrollCyclesMinFields>;
}


/** aggregate fields of "payroll_cycles" */
export type PayrollCyclesAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "payroll_cycles". All fields are combined with a logical 'AND'. */
export interface PayrollCyclesBoolExp {
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
}

/** unique or primary key constraints on table "payroll_cycles" */
export enum PayrollCyclesConstraint {
  /** unique or primary key constraint on columns "name" */
  payroll_cycles_name_key = 'payroll_cycles_name_key',
  /** unique or primary key constraint on columns "id" */
  payroll_cycles_pkey = 'payroll_cycles_pkey'
}

/** input type for inserting data into table "payroll_cycles" */
export interface PayrollCyclesInsertInput {
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
}

/** aggregate max on columns */
export interface PayrollCyclesMaxFields {
  __typename?: 'payrollCyclesMaxFields';
  /** Timestamp when the cycle was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of the payroll cycle */
  description: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll cycle */
  id: Maybe<Scalars['uuid']['output']>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name: Maybe<Scalars['payroll_cycle_type']['output']>;
  /** Timestamp when the cycle was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** aggregate min on columns */
export interface PayrollCyclesMinFields {
  __typename?: 'payrollCyclesMinFields';
  /** Timestamp when the cycle was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of the payroll cycle */
  description: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll cycle */
  id: Maybe<Scalars['uuid']['output']>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name: Maybe<Scalars['payroll_cycle_type']['output']>;
  /** Timestamp when the cycle was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** response of any mutation on the table "payroll_cycles" */
export interface PayrollCyclesMutationResponse {
  __typename?: 'payrollCyclesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollCycles>;
}

/** input type for inserting object relation for remote table "payroll_cycles" */
export interface PayrollCyclesObjRelInsertInput {
  data: PayrollCyclesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollCyclesOnConflict>;
}

/** on_conflict condition type for table "payroll_cycles" */
export interface PayrollCyclesOnConflict {
  constraint: PayrollCyclesConstraint;
  updateColumns?: Array<PayrollCyclesUpdateColumn>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
}

/** Ordering options when selecting data from "payroll_cycles". */
export interface PayrollCyclesOrderBy {
  adjustmentRulesAggregate?: InputMaybe<AdjustmentRulesAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrollsAggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: payroll_cycles */
export interface PayrollCyclesPkColumnsInput {
  /** Unique identifier for the payroll cycle */
  id: Scalars['uuid']['input'];
}

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
export interface PayrollCyclesSetInput {
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
}

/** Streaming cursor of the table "payrollCycles" */
export interface PayrollCyclesStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: PayrollCyclesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface PayrollCyclesStreamCursorValueInput {
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
}

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

export interface PayrollCyclesUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollCyclesSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollCyclesBoolExp;
}

/** columns and relationships of "payroll_dashboard_stats" */
export interface PayrollDashboardStats {
  __typename?: 'payrollDashboardStats';
  backupConsultantUserId: Maybe<Scalars['uuid']['output']>;
  clientName: Maybe<Scalars['String']['output']>;
  cycleName: Maybe<Scalars['payroll_cycle_type']['output']>;
  futureDates: Maybe<Scalars['bigint']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  managerUserId: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  nextEftDate: Maybe<Scalars['date']['output']>;
  pastDates: Maybe<Scalars['bigint']['output']>;
  primaryConsultantUserId: Maybe<Scalars['uuid']['output']>;
  status: Maybe<Scalars['payroll_status']['output']>;
  totalDates: Maybe<Scalars['bigint']['output']>;
}

/** aggregated selection of "payroll_dashboard_stats" */
export interface PayrollDashboardStatsAggregate {
  __typename?: 'payrollDashboardStatsAggregate';
  aggregate: Maybe<PayrollDashboardStatsAggregateFields>;
  nodes: Array<PayrollDashboardStats>;
}

/** aggregate fields of "payroll_dashboard_stats" */
export interface PayrollDashboardStatsAggregateFields {
  __typename?: 'payrollDashboardStatsAggregateFields';
  avg: Maybe<PayrollDashboardStatsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<PayrollDashboardStatsMaxFields>;
  min: Maybe<PayrollDashboardStatsMinFields>;
  stddev: Maybe<PayrollDashboardStatsStddevFields>;
  stddevPop: Maybe<PayrollDashboardStatsStddevPopFields>;
  stddevSamp: Maybe<PayrollDashboardStatsStddevSampFields>;
  sum: Maybe<PayrollDashboardStatsSumFields>;
  varPop: Maybe<PayrollDashboardStatsVarPopFields>;
  varSamp: Maybe<PayrollDashboardStatsVarSampFields>;
  variance: Maybe<PayrollDashboardStatsVarianceFields>;
}


/** aggregate fields of "payroll_dashboard_stats" */
export type PayrollDashboardStatsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export interface PayrollDashboardStatsAvgFields {
  __typename?: 'payrollDashboardStatsAvgFields';
  futureDates: Maybe<Scalars['Float']['output']>;
  pastDates: Maybe<Scalars['Float']['output']>;
  totalDates: Maybe<Scalars['Float']['output']>;
}

/** Boolean expression to filter rows from the table "payroll_dashboard_stats". All fields are combined with a logical 'AND'. */
export interface PayrollDashboardStatsBoolExp {
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
}

/** aggregate max on columns */
export interface PayrollDashboardStatsMaxFields {
  __typename?: 'payrollDashboardStatsMaxFields';
  backupConsultantUserId: Maybe<Scalars['uuid']['output']>;
  clientName: Maybe<Scalars['String']['output']>;
  cycleName: Maybe<Scalars['payroll_cycle_type']['output']>;
  futureDates: Maybe<Scalars['bigint']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  managerUserId: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  nextEftDate: Maybe<Scalars['date']['output']>;
  pastDates: Maybe<Scalars['bigint']['output']>;
  primaryConsultantUserId: Maybe<Scalars['uuid']['output']>;
  status: Maybe<Scalars['payroll_status']['output']>;
  totalDates: Maybe<Scalars['bigint']['output']>;
}

/** aggregate min on columns */
export interface PayrollDashboardStatsMinFields {
  __typename?: 'payrollDashboardStatsMinFields';
  backupConsultantUserId: Maybe<Scalars['uuid']['output']>;
  clientName: Maybe<Scalars['String']['output']>;
  cycleName: Maybe<Scalars['payroll_cycle_type']['output']>;
  futureDates: Maybe<Scalars['bigint']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  managerUserId: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  nextEftDate: Maybe<Scalars['date']['output']>;
  pastDates: Maybe<Scalars['bigint']['output']>;
  primaryConsultantUserId: Maybe<Scalars['uuid']['output']>;
  status: Maybe<Scalars['payroll_status']['output']>;
  totalDates: Maybe<Scalars['bigint']['output']>;
}

/** Ordering options when selecting data from "payroll_dashboard_stats". */
export interface PayrollDashboardStatsOrderBy {
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
}

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
export interface PayrollDashboardStatsStddevFields {
  __typename?: 'payrollDashboardStatsStddevFields';
  futureDates: Maybe<Scalars['Float']['output']>;
  pastDates: Maybe<Scalars['Float']['output']>;
  totalDates: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevPop on columns */
export interface PayrollDashboardStatsStddevPopFields {
  __typename?: 'payrollDashboardStatsStddevPopFields';
  futureDates: Maybe<Scalars['Float']['output']>;
  pastDates: Maybe<Scalars['Float']['output']>;
  totalDates: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevSamp on columns */
export interface PayrollDashboardStatsStddevSampFields {
  __typename?: 'payrollDashboardStatsStddevSampFields';
  futureDates: Maybe<Scalars['Float']['output']>;
  pastDates: Maybe<Scalars['Float']['output']>;
  totalDates: Maybe<Scalars['Float']['output']>;
}

/** Streaming cursor of the table "payrollDashboardStats" */
export interface PayrollDashboardStatsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: PayrollDashboardStatsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface PayrollDashboardStatsStreamCursorValueInput {
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
}

/** aggregate sum on columns */
export interface PayrollDashboardStatsSumFields {
  __typename?: 'payrollDashboardStatsSumFields';
  futureDates: Maybe<Scalars['bigint']['output']>;
  pastDates: Maybe<Scalars['bigint']['output']>;
  totalDates: Maybe<Scalars['bigint']['output']>;
}

/** aggregate varPop on columns */
export interface PayrollDashboardStatsVarPopFields {
  __typename?: 'payrollDashboardStatsVarPopFields';
  futureDates: Maybe<Scalars['Float']['output']>;
  pastDates: Maybe<Scalars['Float']['output']>;
  totalDates: Maybe<Scalars['Float']['output']>;
}

/** aggregate varSamp on columns */
export interface PayrollDashboardStatsVarSampFields {
  __typename?: 'payrollDashboardStatsVarSampFields';
  futureDates: Maybe<Scalars['Float']['output']>;
  pastDates: Maybe<Scalars['Float']['output']>;
  totalDates: Maybe<Scalars['Float']['output']>;
}

/** aggregate variance on columns */
export interface PayrollDashboardStatsVarianceFields {
  __typename?: 'payrollDashboardStatsVarianceFields';
  futureDates: Maybe<Scalars['Float']['output']>;
  pastDates: Maybe<Scalars['Float']['output']>;
  totalDates: Maybe<Scalars['Float']['output']>;
}

/** columns and relationships of "payroll_date_types" */
export interface PayrollDateTypes {
  __typename?: 'payrollDateTypes';
  /** An array relationship */
  adjustmentRules: Array<AdjustmentRules>;
  /** An aggregate relationship */
  adjustmentRulesAggregate: AdjustmentRulesAggregate;
  /** Timestamp when the date type was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of how this date type works */
  description: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll date type */
  id: Scalars['uuid']['output'];
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name: Scalars['payroll_date_type']['output'];
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrollsAggregate: PayrollsAggregate;
  /** Timestamp when the date type was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}


/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypesAdjustmentRulesArgs = {
  distinctOn: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where: InputMaybe<AdjustmentRulesBoolExp>;
};


/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypesAdjustmentRulesAggregateArgs = {
  distinctOn: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where: InputMaybe<AdjustmentRulesBoolExp>;
};


/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypesPayrollsArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypesPayrollsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};

/** aggregated selection of "payroll_date_types" */
export interface PayrollDateTypesAggregate {
  __typename?: 'payrollDateTypesAggregate';
  aggregate: Maybe<PayrollDateTypesAggregateFields>;
  nodes: Array<PayrollDateTypes>;
}

/** aggregate fields of "payroll_date_types" */
export interface PayrollDateTypesAggregateFields {
  __typename?: 'payrollDateTypesAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<PayrollDateTypesMaxFields>;
  min: Maybe<PayrollDateTypesMinFields>;
}


/** aggregate fields of "payroll_date_types" */
export type PayrollDateTypesAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "payroll_date_types". All fields are combined with a logical 'AND'. */
export interface PayrollDateTypesBoolExp {
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
}

/** unique or primary key constraints on table "payroll_date_types" */
export enum PayrollDateTypesConstraint {
  /** unique or primary key constraint on columns "name" */
  payroll_date_types_name_key = 'payroll_date_types_name_key',
  /** unique or primary key constraint on columns "id" */
  payroll_date_types_pkey = 'payroll_date_types_pkey'
}

/** input type for inserting data into table "payroll_date_types" */
export interface PayrollDateTypesInsertInput {
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
}

/** aggregate max on columns */
export interface PayrollDateTypesMaxFields {
  __typename?: 'payrollDateTypesMaxFields';
  /** Timestamp when the date type was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of how this date type works */
  description: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll date type */
  id: Maybe<Scalars['uuid']['output']>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name: Maybe<Scalars['payroll_date_type']['output']>;
  /** Timestamp when the date type was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** aggregate min on columns */
export interface PayrollDateTypesMinFields {
  __typename?: 'payrollDateTypesMinFields';
  /** Timestamp when the date type was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of how this date type works */
  description: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll date type */
  id: Maybe<Scalars['uuid']['output']>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name: Maybe<Scalars['payroll_date_type']['output']>;
  /** Timestamp when the date type was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** response of any mutation on the table "payroll_date_types" */
export interface PayrollDateTypesMutationResponse {
  __typename?: 'payrollDateTypesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollDateTypes>;
}

/** input type for inserting object relation for remote table "payroll_date_types" */
export interface PayrollDateTypesObjRelInsertInput {
  data: PayrollDateTypesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollDateTypesOnConflict>;
}

/** on_conflict condition type for table "payroll_date_types" */
export interface PayrollDateTypesOnConflict {
  constraint: PayrollDateTypesConstraint;
  updateColumns?: Array<PayrollDateTypesUpdateColumn>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
}

/** Ordering options when selecting data from "payroll_date_types". */
export interface PayrollDateTypesOrderBy {
  adjustmentRulesAggregate?: InputMaybe<AdjustmentRulesAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrollsAggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: payroll_date_types */
export interface PayrollDateTypesPkColumnsInput {
  /** Unique identifier for the payroll date type */
  id: Scalars['uuid']['input'];
}

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
export interface PayrollDateTypesSetInput {
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
}

/** Streaming cursor of the table "payrollDateTypes" */
export interface PayrollDateTypesStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: PayrollDateTypesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface PayrollDateTypesStreamCursorValueInput {
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
}

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

export interface PayrollDateTypesUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollDateTypesSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollDateTypesBoolExp;
}

/** columns and relationships of "payroll_dates" */
export interface PayrollDates {
  __typename?: 'payrollDates';
  /** Final EFT date after holiday and weekend adjustments */
  adjustedEftDate: Scalars['date']['output'];
  /** Timestamp when the date record was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the payroll date */
  id: Scalars['uuid']['output'];
  /** Additional notes about this payroll date */
  notes: Maybe<Scalars['String']['output']>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate: Scalars['date']['output'];
  /** An object relationship */
  payrollAssignment: Maybe<PayrollAssignments>;
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
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}


/** columns and relationships of "payroll_dates" */
export type PayrollDatesPayrollAssignmentAuditsArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "payroll_dates" */
export type PayrollDatesPayrollAssignmentAuditsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};

/** aggregated selection of "payroll_dates" */
export interface PayrollDatesAggregate {
  __typename?: 'payrollDatesAggregate';
  aggregate: Maybe<PayrollDatesAggregateFields>;
  nodes: Array<PayrollDates>;
}

export interface PayrollDatesAggregateBoolExp {
  count?: InputMaybe<PayrollDatesAggregateBoolExpCount>;
}

export interface PayrollDatesAggregateBoolExpCount {
  arguments?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollDatesBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "payroll_dates" */
export interface PayrollDatesAggregateFields {
  __typename?: 'payrollDatesAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<PayrollDatesMaxFields>;
  min: Maybe<PayrollDatesMinFields>;
}


/** aggregate fields of "payroll_dates" */
export type PayrollDatesAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<PayrollDatesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "payroll_dates" */
export interface PayrollDatesAggregateOrderBy {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<PayrollDatesMaxOrderBy>;
  min?: InputMaybe<PayrollDatesMinOrderBy>;
}

/** input type for inserting array relation for remote table "payroll_dates" */
export interface PayrollDatesArrRelInsertInput {
  data: Array<PayrollDatesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollDatesOnConflict>;
}

/** Boolean expression to filter rows from the table "payroll_dates". All fields are combined with a logical 'AND'. */
export interface PayrollDatesBoolExp {
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
}

/** unique or primary key constraints on table "payroll_dates" */
export enum PayrollDatesConstraint {
  /** unique or primary key constraint on columns "original_eft_date", "payroll_id" */
  idx_unique_payroll_date = 'idx_unique_payroll_date',
  /** unique or primary key constraint on columns "id" */
  payroll_dates_pkey = 'payroll_dates_pkey'
}

/** input type for inserting data into table "payroll_dates" */
export interface PayrollDatesInsertInput {
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
}

/** aggregate max on columns */
export interface PayrollDatesMaxFields {
  __typename?: 'payrollDatesMaxFields';
  /** Final EFT date after holiday and weekend adjustments */
  adjustedEftDate: Maybe<Scalars['date']['output']>;
  /** Timestamp when the date record was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the payroll date */
  id: Maybe<Scalars['uuid']['output']>;
  /** Additional notes about this payroll date */
  notes: Maybe<Scalars['String']['output']>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate: Maybe<Scalars['date']['output']>;
  /** Reference to the payroll this date belongs to */
  payrollId: Maybe<Scalars['uuid']['output']>;
  /** Date when payroll processing must be completed */
  processingDate: Maybe<Scalars['date']['output']>;
  /** Timestamp when the date record was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by max() on columns of table "payroll_dates" */
export interface PayrollDatesMaxOrderBy {
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
}

/** aggregate min on columns */
export interface PayrollDatesMinFields {
  __typename?: 'payrollDatesMinFields';
  /** Final EFT date after holiday and weekend adjustments */
  adjustedEftDate: Maybe<Scalars['date']['output']>;
  /** Timestamp when the date record was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the payroll date */
  id: Maybe<Scalars['uuid']['output']>;
  /** Additional notes about this payroll date */
  notes: Maybe<Scalars['String']['output']>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate: Maybe<Scalars['date']['output']>;
  /** Reference to the payroll this date belongs to */
  payrollId: Maybe<Scalars['uuid']['output']>;
  /** Date when payroll processing must be completed */
  processingDate: Maybe<Scalars['date']['output']>;
  /** Timestamp when the date record was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by min() on columns of table "payroll_dates" */
export interface PayrollDatesMinOrderBy {
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
}

/** response of any mutation on the table "payroll_dates" */
export interface PayrollDatesMutationResponse {
  __typename?: 'payrollDatesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollDates>;
}

/** input type for inserting object relation for remote table "payroll_dates" */
export interface PayrollDatesObjRelInsertInput {
  data: PayrollDatesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollDatesOnConflict>;
}

/** on_conflict condition type for table "payroll_dates" */
export interface PayrollDatesOnConflict {
  constraint: PayrollDatesConstraint;
  updateColumns?: Array<PayrollDatesUpdateColumn>;
  where?: InputMaybe<PayrollDatesBoolExp>;
}

/** Ordering options when selecting data from "payroll_dates". */
export interface PayrollDatesOrderBy {
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
}

/** primary key columns input for table: payroll_dates */
export interface PayrollDatesPkColumnsInput {
  /** Unique identifier for the payroll date */
  id: Scalars['uuid']['input'];
}

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
export interface PayrollDatesSetInput {
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
}

/** Streaming cursor of the table "payrollDates" */
export interface PayrollDatesStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: PayrollDatesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface PayrollDatesStreamCursorValueInput {
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
}

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

export interface PayrollDatesUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollDatesSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollDatesBoolExp;
}

/** columns and relationships of "payroll_triggers_status" */
export interface PayrollTriggersStatus {
  __typename?: 'payrollTriggersStatus';
  actionStatement: Maybe<Scalars['String']['output']>;
  actionTiming: Maybe<Scalars['String']['output']>;
  eventManipulation: Maybe<Scalars['String']['output']>;
  eventObjectTable: Maybe<Scalars['name']['output']>;
  triggerName: Maybe<Scalars['name']['output']>;
}

/** aggregated selection of "payroll_triggers_status" */
export interface PayrollTriggersStatusAggregate {
  __typename?: 'payrollTriggersStatusAggregate';
  aggregate: Maybe<PayrollTriggersStatusAggregateFields>;
  nodes: Array<PayrollTriggersStatus>;
}

/** aggregate fields of "payroll_triggers_status" */
export interface PayrollTriggersStatusAggregateFields {
  __typename?: 'payrollTriggersStatusAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<PayrollTriggersStatusMaxFields>;
  min: Maybe<PayrollTriggersStatusMinFields>;
}


/** aggregate fields of "payroll_triggers_status" */
export type PayrollTriggersStatusAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "payroll_triggers_status". All fields are combined with a logical 'AND'. */
export interface PayrollTriggersStatusBoolExp {
  _and?: InputMaybe<Array<PayrollTriggersStatusBoolExp>>;
  _not?: InputMaybe<PayrollTriggersStatusBoolExp>;
  _or?: InputMaybe<Array<PayrollTriggersStatusBoolExp>>;
  actionStatement?: InputMaybe<StringComparisonExp>;
  actionTiming?: InputMaybe<StringComparisonExp>;
  eventManipulation?: InputMaybe<StringComparisonExp>;
  eventObjectTable?: InputMaybe<NameComparisonExp>;
  triggerName?: InputMaybe<NameComparisonExp>;
}

/** aggregate max on columns */
export interface PayrollTriggersStatusMaxFields {
  __typename?: 'payrollTriggersStatusMaxFields';
  actionStatement: Maybe<Scalars['String']['output']>;
  actionTiming: Maybe<Scalars['String']['output']>;
  eventManipulation: Maybe<Scalars['String']['output']>;
}

/** aggregate min on columns */
export interface PayrollTriggersStatusMinFields {
  __typename?: 'payrollTriggersStatusMinFields';
  actionStatement: Maybe<Scalars['String']['output']>;
  actionTiming: Maybe<Scalars['String']['output']>;
  eventManipulation: Maybe<Scalars['String']['output']>;
}

/** Ordering options when selecting data from "payroll_triggers_status". */
export interface PayrollTriggersStatusOrderBy {
  actionStatement?: InputMaybe<OrderBy>;
  actionTiming?: InputMaybe<OrderBy>;
  eventManipulation?: InputMaybe<OrderBy>;
  eventObjectTable?: InputMaybe<OrderBy>;
  triggerName?: InputMaybe<OrderBy>;
}

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
export interface PayrollTriggersStatusStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: PayrollTriggersStatusStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface PayrollTriggersStatusStreamCursorValueInput {
  actionStatement?: InputMaybe<Scalars['String']['input']>;
  actionTiming?: InputMaybe<Scalars['String']['input']>;
  eventManipulation?: InputMaybe<Scalars['String']['input']>;
  eventObjectTable?: InputMaybe<Scalars['name']['input']>;
  triggerName?: InputMaybe<Scalars['name']['input']>;
}

/** columns and relationships of "payroll_version_history_results" */
export interface PayrollVersionHistoryResults {
  __typename?: 'payrollVersionHistoryResults';
  active: Scalars['Boolean']['output'];
  goLiveDate: Maybe<Scalars['date']['output']>;
  id: Scalars['uuid']['output'];
  isCurrent: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  payrollId: Scalars['uuid']['output'];
  queriedAt: Maybe<Scalars['timestamptz']['output']>;
  supersededDate: Maybe<Scalars['date']['output']>;
  versionNumber: Scalars['Int']['output'];
  versionReason: Maybe<Scalars['String']['output']>;
}

export interface PayrollVersionHistoryResultsAggregate {
  __typename?: 'payrollVersionHistoryResultsAggregate';
  aggregate: Maybe<PayrollVersionHistoryResultsAggregateFields>;
  nodes: Array<PayrollVersionHistoryResults>;
}

/** aggregate fields of "payroll_version_history_results" */
export interface PayrollVersionHistoryResultsAggregateFields {
  __typename?: 'payrollVersionHistoryResultsAggregateFields';
  avg: Maybe<PayrollVersionHistoryResultsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<PayrollVersionHistoryResultsMaxFields>;
  min: Maybe<PayrollVersionHistoryResultsMinFields>;
  stddev: Maybe<PayrollVersionHistoryResultsStddevFields>;
  stddevPop: Maybe<PayrollVersionHistoryResultsStddevPopFields>;
  stddevSamp: Maybe<PayrollVersionHistoryResultsStddevSampFields>;
  sum: Maybe<PayrollVersionHistoryResultsSumFields>;
  varPop: Maybe<PayrollVersionHistoryResultsVarPopFields>;
  varSamp: Maybe<PayrollVersionHistoryResultsVarSampFields>;
  variance: Maybe<PayrollVersionHistoryResultsVarianceFields>;
}


/** aggregate fields of "payroll_version_history_results" */
export type PayrollVersionHistoryResultsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export interface PayrollVersionHistoryResultsAvgFields {
  __typename?: 'payrollVersionHistoryResultsAvgFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** Boolean expression to filter rows from the table "payroll_version_history_results". All fields are combined with a logical 'AND'. */
export interface PayrollVersionHistoryResultsBoolExp {
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
}

/** unique or primary key constraints on table "payroll_version_history_results" */
export enum PayrollVersionHistoryResultsConstraint {
  /** unique or primary key constraint on columns "id" */
  payroll_version_history_results_pkey = 'payroll_version_history_results_pkey'
}

/** input type for incrementing numeric columns in table "payroll_version_history_results" */
export interface PayrollVersionHistoryResultsIncInput {
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
}

/** input type for inserting data into table "payroll_version_history_results" */
export interface PayrollVersionHistoryResultsInsertInput {
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
}

/** aggregate max on columns */
export interface PayrollVersionHistoryResultsMaxFields {
  __typename?: 'payrollVersionHistoryResultsMaxFields';
  goLiveDate: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  payrollId: Maybe<Scalars['uuid']['output']>;
  queriedAt: Maybe<Scalars['timestamptz']['output']>;
  supersededDate: Maybe<Scalars['date']['output']>;
  versionNumber: Maybe<Scalars['Int']['output']>;
  versionReason: Maybe<Scalars['String']['output']>;
}

/** aggregate min on columns */
export interface PayrollVersionHistoryResultsMinFields {
  __typename?: 'payrollVersionHistoryResultsMinFields';
  goLiveDate: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  payrollId: Maybe<Scalars['uuid']['output']>;
  queriedAt: Maybe<Scalars['timestamptz']['output']>;
  supersededDate: Maybe<Scalars['date']['output']>;
  versionNumber: Maybe<Scalars['Int']['output']>;
  versionReason: Maybe<Scalars['String']['output']>;
}

/** response of any mutation on the table "payroll_version_history_results" */
export interface PayrollVersionHistoryResultsMutationResponse {
  __typename?: 'payrollVersionHistoryResultsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollVersionHistoryResults>;
}

/** on_conflict condition type for table "payroll_version_history_results" */
export interface PayrollVersionHistoryResultsOnConflict {
  constraint: PayrollVersionHistoryResultsConstraint;
  updateColumns?: Array<PayrollVersionHistoryResultsUpdateColumn>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
}

/** Ordering options when selecting data from "payroll_version_history_results". */
export interface PayrollVersionHistoryResultsOrderBy {
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
}

/** primary key columns input for table: payroll_version_history_results */
export interface PayrollVersionHistoryResultsPkColumnsInput {
  id: Scalars['uuid']['input'];
}

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
export interface PayrollVersionHistoryResultsSetInput {
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
}

/** aggregate stddev on columns */
export interface PayrollVersionHistoryResultsStddevFields {
  __typename?: 'payrollVersionHistoryResultsStddevFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevPop on columns */
export interface PayrollVersionHistoryResultsStddevPopFields {
  __typename?: 'payrollVersionHistoryResultsStddevPopFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevSamp on columns */
export interface PayrollVersionHistoryResultsStddevSampFields {
  __typename?: 'payrollVersionHistoryResultsStddevSampFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** Streaming cursor of the table "payrollVersionHistoryResults" */
export interface PayrollVersionHistoryResultsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: PayrollVersionHistoryResultsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface PayrollVersionHistoryResultsStreamCursorValueInput {
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
}

/** aggregate sum on columns */
export interface PayrollVersionHistoryResultsSumFields {
  __typename?: 'payrollVersionHistoryResultsSumFields';
  versionNumber: Maybe<Scalars['Int']['output']>;
}

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

export interface PayrollVersionHistoryResultsUpdates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<PayrollVersionHistoryResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollVersionHistoryResultsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollVersionHistoryResultsBoolExp;
}

/** aggregate varPop on columns */
export interface PayrollVersionHistoryResultsVarPopFields {
  __typename?: 'payrollVersionHistoryResultsVarPopFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate varSamp on columns */
export interface PayrollVersionHistoryResultsVarSampFields {
  __typename?: 'payrollVersionHistoryResultsVarSampFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate variance on columns */
export interface PayrollVersionHistoryResultsVarianceFields {
  __typename?: 'payrollVersionHistoryResultsVarianceFields';
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** columns and relationships of "payroll_version_results" */
export interface PayrollVersionResults {
  __typename?: 'payrollVersionResults';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  createdByUserId: Maybe<Scalars['uuid']['output']>;
  datesDeleted: Scalars['Int']['output'];
  id: Scalars['uuid']['output'];
  message: Scalars['String']['output'];
  newPayrollId: Scalars['uuid']['output'];
  newVersionNumber: Scalars['Int']['output'];
  oldPayrollId: Scalars['uuid']['output'];
}

export interface PayrollVersionResultsAggregate {
  __typename?: 'payrollVersionResultsAggregate';
  aggregate: Maybe<PayrollVersionResultsAggregateFields>;
  nodes: Array<PayrollVersionResults>;
}

/** aggregate fields of "payroll_version_results" */
export interface PayrollVersionResultsAggregateFields {
  __typename?: 'payrollVersionResultsAggregateFields';
  avg: Maybe<PayrollVersionResultsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<PayrollVersionResultsMaxFields>;
  min: Maybe<PayrollVersionResultsMinFields>;
  stddev: Maybe<PayrollVersionResultsStddevFields>;
  stddevPop: Maybe<PayrollVersionResultsStddevPopFields>;
  stddevSamp: Maybe<PayrollVersionResultsStddevSampFields>;
  sum: Maybe<PayrollVersionResultsSumFields>;
  varPop: Maybe<PayrollVersionResultsVarPopFields>;
  varSamp: Maybe<PayrollVersionResultsVarSampFields>;
  variance: Maybe<PayrollVersionResultsVarianceFields>;
}


/** aggregate fields of "payroll_version_results" */
export type PayrollVersionResultsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export interface PayrollVersionResultsAvgFields {
  __typename?: 'payrollVersionResultsAvgFields';
  datesDeleted: Maybe<Scalars['Float']['output']>;
  newVersionNumber: Maybe<Scalars['Float']['output']>;
}

/** Boolean expression to filter rows from the table "payroll_version_results". All fields are combined with a logical 'AND'. */
export interface PayrollVersionResultsBoolExp {
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
}

/** unique or primary key constraints on table "payroll_version_results" */
export enum PayrollVersionResultsConstraint {
  /** unique or primary key constraint on columns "id" */
  payroll_version_results_pkey = 'payroll_version_results_pkey'
}

/** input type for incrementing numeric columns in table "payroll_version_results" */
export interface PayrollVersionResultsIncInput {
  datesDeleted?: InputMaybe<Scalars['Int']['input']>;
  newVersionNumber?: InputMaybe<Scalars['Int']['input']>;
}

/** input type for inserting data into table "payroll_version_results" */
export interface PayrollVersionResultsInsertInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  datesDeleted?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  newPayrollId?: InputMaybe<Scalars['uuid']['input']>;
  newVersionNumber?: InputMaybe<Scalars['Int']['input']>;
  oldPayrollId?: InputMaybe<Scalars['uuid']['input']>;
}

/** aggregate max on columns */
export interface PayrollVersionResultsMaxFields {
  __typename?: 'payrollVersionResultsMaxFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  createdByUserId: Maybe<Scalars['uuid']['output']>;
  datesDeleted: Maybe<Scalars['Int']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  message: Maybe<Scalars['String']['output']>;
  newPayrollId: Maybe<Scalars['uuid']['output']>;
  newVersionNumber: Maybe<Scalars['Int']['output']>;
  oldPayrollId: Maybe<Scalars['uuid']['output']>;
}

/** aggregate min on columns */
export interface PayrollVersionResultsMinFields {
  __typename?: 'payrollVersionResultsMinFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  createdByUserId: Maybe<Scalars['uuid']['output']>;
  datesDeleted: Maybe<Scalars['Int']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  message: Maybe<Scalars['String']['output']>;
  newPayrollId: Maybe<Scalars['uuid']['output']>;
  newVersionNumber: Maybe<Scalars['Int']['output']>;
  oldPayrollId: Maybe<Scalars['uuid']['output']>;
}

/** response of any mutation on the table "payroll_version_results" */
export interface PayrollVersionResultsMutationResponse {
  __typename?: 'payrollVersionResultsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollVersionResults>;
}

/** on_conflict condition type for table "payroll_version_results" */
export interface PayrollVersionResultsOnConflict {
  constraint: PayrollVersionResultsConstraint;
  updateColumns?: Array<PayrollVersionResultsUpdateColumn>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
}

/** Ordering options when selecting data from "payroll_version_results". */
export interface PayrollVersionResultsOrderBy {
  createdAt?: InputMaybe<OrderBy>;
  createdByUserId?: InputMaybe<OrderBy>;
  datesDeleted?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
  newPayrollId?: InputMaybe<OrderBy>;
  newVersionNumber?: InputMaybe<OrderBy>;
  oldPayrollId?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: payroll_version_results */
export interface PayrollVersionResultsPkColumnsInput {
  id: Scalars['uuid']['input'];
}

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
export interface PayrollVersionResultsSetInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  datesDeleted?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  newPayrollId?: InputMaybe<Scalars['uuid']['input']>;
  newVersionNumber?: InputMaybe<Scalars['Int']['input']>;
  oldPayrollId?: InputMaybe<Scalars['uuid']['input']>;
}

/** aggregate stddev on columns */
export interface PayrollVersionResultsStddevFields {
  __typename?: 'payrollVersionResultsStddevFields';
  datesDeleted: Maybe<Scalars['Float']['output']>;
  newVersionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevPop on columns */
export interface PayrollVersionResultsStddevPopFields {
  __typename?: 'payrollVersionResultsStddevPopFields';
  datesDeleted: Maybe<Scalars['Float']['output']>;
  newVersionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevSamp on columns */
export interface PayrollVersionResultsStddevSampFields {
  __typename?: 'payrollVersionResultsStddevSampFields';
  datesDeleted: Maybe<Scalars['Float']['output']>;
  newVersionNumber: Maybe<Scalars['Float']['output']>;
}

/** Streaming cursor of the table "payrollVersionResults" */
export interface PayrollVersionResultsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: PayrollVersionResultsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface PayrollVersionResultsStreamCursorValueInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  datesDeleted?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  newPayrollId?: InputMaybe<Scalars['uuid']['input']>;
  newVersionNumber?: InputMaybe<Scalars['Int']['input']>;
  oldPayrollId?: InputMaybe<Scalars['uuid']['input']>;
}

/** aggregate sum on columns */
export interface PayrollVersionResultsSumFields {
  __typename?: 'payrollVersionResultsSumFields';
  datesDeleted: Maybe<Scalars['Int']['output']>;
  newVersionNumber: Maybe<Scalars['Int']['output']>;
}

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

export interface PayrollVersionResultsUpdates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<PayrollVersionResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollVersionResultsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollVersionResultsBoolExp;
}

/** aggregate varPop on columns */
export interface PayrollVersionResultsVarPopFields {
  __typename?: 'payrollVersionResultsVarPopFields';
  datesDeleted: Maybe<Scalars['Float']['output']>;
  newVersionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate varSamp on columns */
export interface PayrollVersionResultsVarSampFields {
  __typename?: 'payrollVersionResultsVarSampFields';
  datesDeleted: Maybe<Scalars['Float']['output']>;
  newVersionNumber: Maybe<Scalars['Float']['output']>;
}

/** aggregate variance on columns */
export interface PayrollVersionResultsVarianceFields {
  __typename?: 'payrollVersionResultsVarianceFields';
  datesDeleted: Maybe<Scalars['Float']['output']>;
  newVersionNumber: Maybe<Scalars['Float']['output']>;
}

/** columns and relationships of "payrolls" */
export interface Payrolls {
  __typename?: 'payrolls';
  /** An object relationship */
  backupConsultant: Maybe<Users>;
  /** Backup consultant for this payroll */
  backupConsultantUserId: Maybe<Scalars['uuid']['output']>;
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
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  createdByUserId: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll cycle */
  cycleId: Scalars['uuid']['output'];
  /** Reference to the payroll date type */
  dateTypeId: Scalars['uuid']['output'];
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars['Int']['output']>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars['Int']['output']>;
  /** The date when the payroll went live in the system */
  goLiveDate: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the payroll */
  id: Scalars['uuid']['output'];
  /** An object relationship */
  manager: Maybe<Users>;
  /** Manager overseeing this payroll */
  managerUserId: Maybe<Scalars['uuid']['output']>;
  /** Name of the payroll */
  name: Scalars['String']['output'];
  /** An object relationship */
  parentPayroll: Maybe<Payrolls>;
  parentPayrollId: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  payrollCycle: PayrollCycles;
  /** An object relationship */
  payrollDateType: PayrollDateTypes;
  /** An array relationship */
  payrollDates: Array<PayrollDates>;
  /** An aggregate relationship */
  payrollDatesAggregate: PayrollDatesAggregate;
  /** External payroll system used for this client */
  payrollSystem: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  primaryConsultant: Maybe<Users>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId: Maybe<Scalars['uuid']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Scalars['Int']['output'];
  /** Number of hours required to process this payroll */
  processingTime: Scalars['Int']['output'];
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status: Scalars['payroll_status']['output'];
  supersededDate: Maybe<Scalars['date']['output']>;
  /** Timestamp when the payroll was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
  versionNumber: Maybe<Scalars['Int']['output']>;
  versionReason: Maybe<Scalars['String']['output']>;
}


/** columns and relationships of "payrolls" */
export type PayrollsBillingItemsArgs = {
  distinctOn: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingItemsOrderBy>>;
  where: InputMaybe<BillingItemsBoolExp>;
};


/** columns and relationships of "payrolls" */
export type PayrollsBillingItemsAggregateArgs = {
  distinctOn: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingItemsOrderBy>>;
  where: InputMaybe<BillingItemsBoolExp>;
};


/** columns and relationships of "payrolls" */
export type PayrollsChildPayrollsArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "payrolls" */
export type PayrollsChildPayrollsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "payrolls" */
export type PayrollsPayrollDatesArgs = {
  distinctOn: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDatesOrderBy>>;
  where: InputMaybe<PayrollDatesBoolExp>;
};


/** columns and relationships of "payrolls" */
export type PayrollsPayrollDatesAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDatesOrderBy>>;
  where: InputMaybe<PayrollDatesBoolExp>;
};

/** aggregated selection of "payrolls" */
export interface PayrollsAggregate {
  __typename?: 'payrollsAggregate';
  aggregate: Maybe<PayrollsAggregateFields>;
  nodes: Array<Payrolls>;
}

export interface PayrollsAggregateBoolExp {
  count?: InputMaybe<PayrollsAggregateBoolExpCount>;
}

export interface PayrollsAggregateBoolExpCount {
  arguments?: InputMaybe<Array<PayrollsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollsBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "payrolls" */
export interface PayrollsAggregateFields {
  __typename?: 'payrollsAggregateFields';
  avg: Maybe<PayrollsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<PayrollsMaxFields>;
  min: Maybe<PayrollsMinFields>;
  stddev: Maybe<PayrollsStddevFields>;
  stddevPop: Maybe<PayrollsStddevPopFields>;
  stddevSamp: Maybe<PayrollsStddevSampFields>;
  sum: Maybe<PayrollsSumFields>;
  varPop: Maybe<PayrollsVarPopFields>;
  varSamp: Maybe<PayrollsVarSampFields>;
  variance: Maybe<PayrollsVarianceFields>;
}


/** aggregate fields of "payrolls" */
export type PayrollsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<PayrollsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "payrolls" */
export interface PayrollsAggregateOrderBy {
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
}

/** input type for inserting array relation for remote table "payrolls" */
export interface PayrollsArrRelInsertInput {
  data: Array<PayrollsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollsOnConflict>;
}

/** aggregate avg on columns */
export interface PayrollsAvgFields {
  __typename?: 'payrollsAvgFields';
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars['Float']['output']>;
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** order by avg() on columns of table "payrolls" */
export interface PayrollsAvgOrderBy {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
}

/** Boolean expression to filter rows from the table "payrolls". All fields are combined with a logical 'AND'. */
export interface PayrollsBoolExp {
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
}

/** unique or primary key constraints on table "payrolls" */
export enum PayrollsConstraint {
  /** unique or primary key constraint on columns  */
  only_one_current_version_per_family = 'only_one_current_version_per_family',
  /** unique or primary key constraint on columns "id" */
  payrolls_pkey = 'payrolls_pkey'
}

/** input type for incrementing numeric columns in table "payrolls" */
export interface PayrollsIncInput {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<Scalars['Int']['input']>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<Scalars['Int']['input']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<Scalars['Int']['input']>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<Scalars['Int']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
}

/** input type for inserting data into table "payrolls" */
export interface PayrollsInsertInput {
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
}

/** aggregate max on columns */
export interface PayrollsMaxFields {
  __typename?: 'payrollsMaxFields';
  /** Backup consultant for this payroll */
  backupConsultantUserId: Maybe<Scalars['uuid']['output']>;
  /** Reference to the client this payroll belongs to */
  clientId: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the payroll was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  createdByUserId: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll cycle */
  cycleId: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll date type */
  dateTypeId: Maybe<Scalars['uuid']['output']>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars['Int']['output']>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars['Int']['output']>;
  /** The date when the payroll went live in the system */
  goLiveDate: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the payroll */
  id: Maybe<Scalars['uuid']['output']>;
  /** Manager overseeing this payroll */
  managerUserId: Maybe<Scalars['uuid']['output']>;
  /** Name of the payroll */
  name: Maybe<Scalars['String']['output']>;
  parentPayrollId: Maybe<Scalars['uuid']['output']>;
  /** External payroll system used for this client */
  payrollSystem: Maybe<Scalars['String']['output']>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId: Maybe<Scalars['uuid']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars['Int']['output']>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars['Int']['output']>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status: Maybe<Scalars['payroll_status']['output']>;
  supersededDate: Maybe<Scalars['date']['output']>;
  /** Timestamp when the payroll was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
  versionNumber: Maybe<Scalars['Int']['output']>;
  versionReason: Maybe<Scalars['String']['output']>;
}

/** order by max() on columns of table "payrolls" */
export interface PayrollsMaxOrderBy {
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
}

/** aggregate min on columns */
export interface PayrollsMinFields {
  __typename?: 'payrollsMinFields';
  /** Backup consultant for this payroll */
  backupConsultantUserId: Maybe<Scalars['uuid']['output']>;
  /** Reference to the client this payroll belongs to */
  clientId: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the payroll was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  createdByUserId: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll cycle */
  cycleId: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll date type */
  dateTypeId: Maybe<Scalars['uuid']['output']>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars['Int']['output']>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars['Int']['output']>;
  /** The date when the payroll went live in the system */
  goLiveDate: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the payroll */
  id: Maybe<Scalars['uuid']['output']>;
  /** Manager overseeing this payroll */
  managerUserId: Maybe<Scalars['uuid']['output']>;
  /** Name of the payroll */
  name: Maybe<Scalars['String']['output']>;
  parentPayrollId: Maybe<Scalars['uuid']['output']>;
  /** External payroll system used for this client */
  payrollSystem: Maybe<Scalars['String']['output']>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId: Maybe<Scalars['uuid']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars['Int']['output']>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars['Int']['output']>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status: Maybe<Scalars['payroll_status']['output']>;
  supersededDate: Maybe<Scalars['date']['output']>;
  /** Timestamp when the payroll was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
  versionNumber: Maybe<Scalars['Int']['output']>;
  versionReason: Maybe<Scalars['String']['output']>;
}

/** order by min() on columns of table "payrolls" */
export interface PayrollsMinOrderBy {
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
}

/** response of any mutation on the table "payrolls" */
export interface PayrollsMutationResponse {
  __typename?: 'payrollsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Payrolls>;
}

/** input type for inserting object relation for remote table "payrolls" */
export interface PayrollsObjRelInsertInput {
  data: PayrollsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<PayrollsOnConflict>;
}

/** on_conflict condition type for table "payrolls" */
export interface PayrollsOnConflict {
  constraint: PayrollsConstraint;
  updateColumns?: Array<PayrollsUpdateColumn>;
  where?: InputMaybe<PayrollsBoolExp>;
}

/** Ordering options when selecting data from "payrolls". */
export interface PayrollsOrderBy {
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
}

/** primary key columns input for table: payrolls */
export interface PayrollsPkColumnsInput {
  /** Unique identifier for the payroll */
  id: Scalars['uuid']['input'];
}

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
export interface PayrollsSetInput {
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
}

/** aggregate stddev on columns */
export interface PayrollsStddevFields {
  __typename?: 'payrollsStddevFields';
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars['Float']['output']>;
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** order by stddev() on columns of table "payrolls" */
export interface PayrollsStddevOrderBy {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
}

/** aggregate stddevPop on columns */
export interface PayrollsStddevPopFields {
  __typename?: 'payrollsStddevPopFields';
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars['Float']['output']>;
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** order by stddevPop() on columns of table "payrolls" */
export interface PayrollsStddevPopOrderBy {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
}

/** aggregate stddevSamp on columns */
export interface PayrollsStddevSampFields {
  __typename?: 'payrollsStddevSampFields';
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars['Float']['output']>;
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** order by stddevSamp() on columns of table "payrolls" */
export interface PayrollsStddevSampOrderBy {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
}

/** Streaming cursor of the table "payrolls" */
export interface PayrollsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: PayrollsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface PayrollsStreamCursorValueInput {
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
}

/** aggregate sum on columns */
export interface PayrollsSumFields {
  __typename?: 'payrollsSumFields';
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars['Int']['output']>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars['Int']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars['Int']['output']>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars['Int']['output']>;
  versionNumber: Maybe<Scalars['Int']['output']>;
}

/** order by sum() on columns of table "payrolls" */
export interface PayrollsSumOrderBy {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
}

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

export interface PayrollsUpdates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<PayrollsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollsBoolExp;
}

/** aggregate varPop on columns */
export interface PayrollsVarPopFields {
  __typename?: 'payrollsVarPopFields';
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars['Float']['output']>;
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** order by varPop() on columns of table "payrolls" */
export interface PayrollsVarPopOrderBy {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
}

/** aggregate varSamp on columns */
export interface PayrollsVarSampFields {
  __typename?: 'payrollsVarSampFields';
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars['Float']['output']>;
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** order by varSamp() on columns of table "payrolls" */
export interface PayrollsVarSampOrderBy {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
}

/** aggregate variance on columns */
export interface PayrollsVarianceFields {
  __typename?: 'payrollsVarianceFields';
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars['Float']['output']>;
  versionNumber: Maybe<Scalars['Float']['output']>;
}

/** order by variance() on columns of table "payrolls" */
export interface PayrollsVarianceOrderBy {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
}

/** Audit log for permission changes and access attempts */
export interface PermissionAuditLogs {
  __typename?: 'permissionAuditLogs';
  action: Scalars['String']['output'];
  createdAt: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  newValue: Maybe<Scalars['jsonb']['output']>;
  operation: Scalars['String']['output'];
  /** An object relationship */
  performedByUser: Maybe<Users>;
  previousValue: Maybe<Scalars['jsonb']['output']>;
  reason: Maybe<Scalars['String']['output']>;
  resource: Scalars['String']['output'];
  targetRole: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  targetUser: Maybe<Users>;
  targetUserId: Maybe<Scalars['uuid']['output']>;
  timestamp: Scalars['timestamptz']['output'];
  userId: Maybe<Scalars['uuid']['output']>;
}


/** Audit log for permission changes and access attempts */
export type PermissionAuditLogsNewValueArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};


/** Audit log for permission changes and access attempts */
export type PermissionAuditLogsPreviousValueArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "permission_audit_log" */
export interface PermissionAuditLogsAggregate {
  __typename?: 'permissionAuditLogsAggregate';
  aggregate: Maybe<PermissionAuditLogsAggregateFields>;
  nodes: Array<PermissionAuditLogs>;
}

export interface PermissionAuditLogsAggregateBoolExp {
  count?: InputMaybe<PermissionAuditLogsAggregateBoolExpCount>;
}

export interface PermissionAuditLogsAggregateBoolExpCount {
  arguments?: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PermissionAuditLogsBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "permission_audit_log" */
export interface PermissionAuditLogsAggregateFields {
  __typename?: 'permissionAuditLogsAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<PermissionAuditLogsMaxFields>;
  min: Maybe<PermissionAuditLogsMinFields>;
}


/** aggregate fields of "permission_audit_log" */
export type PermissionAuditLogsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "permission_audit_log" */
export interface PermissionAuditLogsAggregateOrderBy {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<PermissionAuditLogsMaxOrderBy>;
  min?: InputMaybe<PermissionAuditLogsMinOrderBy>;
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface PermissionAuditLogsAppendInput {
  newValue?: InputMaybe<Scalars['jsonb']['input']>;
  previousValue?: InputMaybe<Scalars['jsonb']['input']>;
}

/** input type for inserting array relation for remote table "permission_audit_log" */
export interface PermissionAuditLogsArrRelInsertInput {
  data: Array<PermissionAuditLogsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<PermissionAuditLogsOnConflict>;
}

/** Boolean expression to filter rows from the table "permission_audit_log". All fields are combined with a logical 'AND'. */
export interface PermissionAuditLogsBoolExp {
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
}

/** unique or primary key constraints on table "permission_audit_log" */
export enum PermissionAuditLogsConstraint {
  /** unique or primary key constraint on columns "id" */
  permission_audit_log_pkey = 'permission_audit_log_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface PermissionAuditLogsDeleteAtPathInput {
  newValue?: InputMaybe<Array<Scalars['String']['input']>>;
  previousValue?: InputMaybe<Array<Scalars['String']['input']>>;
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface PermissionAuditLogsDeleteElemInput {
  newValue?: InputMaybe<Scalars['Int']['input']>;
  previousValue?: InputMaybe<Scalars['Int']['input']>;
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface PermissionAuditLogsDeleteKeyInput {
  newValue?: InputMaybe<Scalars['String']['input']>;
  previousValue?: InputMaybe<Scalars['String']['input']>;
}

/** input type for inserting data into table "permission_audit_log" */
export interface PermissionAuditLogsInsertInput {
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
}

/** aggregate max on columns */
export interface PermissionAuditLogsMaxFields {
  __typename?: 'permissionAuditLogsMaxFields';
  action: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  operation: Maybe<Scalars['String']['output']>;
  reason: Maybe<Scalars['String']['output']>;
  resource: Maybe<Scalars['String']['output']>;
  targetRole: Maybe<Scalars['String']['output']>;
  targetUserId: Maybe<Scalars['uuid']['output']>;
  timestamp: Maybe<Scalars['timestamptz']['output']>;
  userId: Maybe<Scalars['uuid']['output']>;
}

/** order by max() on columns of table "permission_audit_log" */
export interface PermissionAuditLogsMaxOrderBy {
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
}

/** aggregate min on columns */
export interface PermissionAuditLogsMinFields {
  __typename?: 'permissionAuditLogsMinFields';
  action: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  operation: Maybe<Scalars['String']['output']>;
  reason: Maybe<Scalars['String']['output']>;
  resource: Maybe<Scalars['String']['output']>;
  targetRole: Maybe<Scalars['String']['output']>;
  targetUserId: Maybe<Scalars['uuid']['output']>;
  timestamp: Maybe<Scalars['timestamptz']['output']>;
  userId: Maybe<Scalars['uuid']['output']>;
}

/** order by min() on columns of table "permission_audit_log" */
export interface PermissionAuditLogsMinOrderBy {
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
}

/** response of any mutation on the table "permission_audit_log" */
export interface PermissionAuditLogsMutationResponse {
  __typename?: 'permissionAuditLogsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PermissionAuditLogs>;
}

/** on_conflict condition type for table "permission_audit_log" */
export interface PermissionAuditLogsOnConflict {
  constraint: PermissionAuditLogsConstraint;
  updateColumns?: Array<PermissionAuditLogsUpdateColumn>;
  where?: InputMaybe<PermissionAuditLogsBoolExp>;
}

/** Ordering options when selecting data from "permission_audit_log". */
export interface PermissionAuditLogsOrderBy {
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
}

/** primary key columns input for table: permission_audit_log */
export interface PermissionAuditLogsPkColumnsInput {
  id: Scalars['uuid']['input'];
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface PermissionAuditLogsPrependInput {
  newValue?: InputMaybe<Scalars['jsonb']['input']>;
  previousValue?: InputMaybe<Scalars['jsonb']['input']>;
}

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
export interface PermissionAuditLogsSetInput {
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
}

/** Streaming cursor of the table "permissionAuditLogs" */
export interface PermissionAuditLogsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: PermissionAuditLogsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface PermissionAuditLogsStreamCursorValueInput {
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
}

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

export interface PermissionAuditLogsUpdates {
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
}

/** columns and relationships of "audit.permission_changes" */
export interface PermissionChanges {
  __typename?: 'permissionChanges';
  approvedByUserId: Maybe<Scalars['uuid']['output']>;
  changeType: Scalars['String']['output'];
  changedAt: Scalars['timestamptz']['output'];
  changedByUserId: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  metadata: Maybe<Scalars['jsonb']['output']>;
  newPermissions: Maybe<Scalars['jsonb']['output']>;
  oldPermissions: Maybe<Scalars['jsonb']['output']>;
  permissionType: Maybe<Scalars['String']['output']>;
  reason: Maybe<Scalars['String']['output']>;
  targetRoleId: Maybe<Scalars['uuid']['output']>;
  targetUserId: Maybe<Scalars['uuid']['output']>;
}


/** columns and relationships of "audit.permission_changes" */
export type PermissionChangesMetadataArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit.permission_changes" */
export type PermissionChangesNewPermissionsArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit.permission_changes" */
export type PermissionChangesOldPermissionsArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit.permission_changes" */
export interface PermissionChangesAggregate {
  __typename?: 'permissionChangesAggregate';
  aggregate: Maybe<PermissionChangesAggregateFields>;
  nodes: Array<PermissionChanges>;
}

/** aggregate fields of "audit.permission_changes" */
export interface PermissionChangesAggregateFields {
  __typename?: 'permissionChangesAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<PermissionChangesMaxFields>;
  min: Maybe<PermissionChangesMinFields>;
}


/** aggregate fields of "audit.permission_changes" */
export type PermissionChangesAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<PermissionChangesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export interface PermissionChangesAppendInput {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newPermissions?: InputMaybe<Scalars['jsonb']['input']>;
  oldPermissions?: InputMaybe<Scalars['jsonb']['input']>;
}

/** Boolean expression to filter rows from the table "audit.permission_changes". All fields are combined with a logical 'AND'. */
export interface PermissionChangesBoolExp {
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
}

/** unique or primary key constraints on table "audit.permission_changes" */
export enum PermissionChangesConstraint {
  /** unique or primary key constraint on columns "id" */
  permission_changes_pkey = 'permission_changes_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface PermissionChangesDeleteAtPathInput {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
  newPermissions?: InputMaybe<Array<Scalars['String']['input']>>;
  oldPermissions?: InputMaybe<Array<Scalars['String']['input']>>;
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface PermissionChangesDeleteElemInput {
  metadata?: InputMaybe<Scalars['Int']['input']>;
  newPermissions?: InputMaybe<Scalars['Int']['input']>;
  oldPermissions?: InputMaybe<Scalars['Int']['input']>;
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface PermissionChangesDeleteKeyInput {
  metadata?: InputMaybe<Scalars['String']['input']>;
  newPermissions?: InputMaybe<Scalars['String']['input']>;
  oldPermissions?: InputMaybe<Scalars['String']['input']>;
}

/** input type for inserting data into table "audit.permission_changes" */
export interface PermissionChangesInsertInput {
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
}

/** aggregate max on columns */
export interface PermissionChangesMaxFields {
  __typename?: 'permissionChangesMaxFields';
  approvedByUserId: Maybe<Scalars['uuid']['output']>;
  changeType: Maybe<Scalars['String']['output']>;
  changedAt: Maybe<Scalars['timestamptz']['output']>;
  changedByUserId: Maybe<Scalars['uuid']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  permissionType: Maybe<Scalars['String']['output']>;
  reason: Maybe<Scalars['String']['output']>;
  targetRoleId: Maybe<Scalars['uuid']['output']>;
  targetUserId: Maybe<Scalars['uuid']['output']>;
}

/** aggregate min on columns */
export interface PermissionChangesMinFields {
  __typename?: 'permissionChangesMinFields';
  approvedByUserId: Maybe<Scalars['uuid']['output']>;
  changeType: Maybe<Scalars['String']['output']>;
  changedAt: Maybe<Scalars['timestamptz']['output']>;
  changedByUserId: Maybe<Scalars['uuid']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  permissionType: Maybe<Scalars['String']['output']>;
  reason: Maybe<Scalars['String']['output']>;
  targetRoleId: Maybe<Scalars['uuid']['output']>;
  targetUserId: Maybe<Scalars['uuid']['output']>;
}

/** response of any mutation on the table "audit.permission_changes" */
export interface PermissionChangesMutationResponse {
  __typename?: 'permissionChangesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PermissionChanges>;
}

/** on_conflict condition type for table "audit.permission_changes" */
export interface PermissionChangesOnConflict {
  constraint: PermissionChangesConstraint;
  updateColumns?: Array<PermissionChangesUpdateColumn>;
  where?: InputMaybe<PermissionChangesBoolExp>;
}

/** Ordering options when selecting data from "audit.permission_changes". */
export interface PermissionChangesOrderBy {
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
}

/** primary key columns input for table: audit.permission_changes */
export interface PermissionChangesPkColumnsInput {
  id: Scalars['uuid']['input'];
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface PermissionChangesPrependInput {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newPermissions?: InputMaybe<Scalars['jsonb']['input']>;
  oldPermissions?: InputMaybe<Scalars['jsonb']['input']>;
}

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
export interface PermissionChangesSetInput {
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
}

/** Streaming cursor of the table "permissionChanges" */
export interface PermissionChangesStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: PermissionChangesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface PermissionChangesStreamCursorValueInput {
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
}

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

export interface PermissionChangesUpdates {
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
}

/** User-specific and role-specific permission overrides */
export interface PermissionOverrides {
  __typename?: 'permissionOverrides';
  /** JSON conditions for conditional permissions */
  conditions: Maybe<Scalars['jsonb']['output']>;
  createdAt: Scalars['timestamptz']['output'];
  createdBy: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  createdByUser: Maybe<Users>;
  /** When this override expires (NULL for permanent) */
  expiresAt: Maybe<Scalars['timestamptz']['output']>;
  /** Whether the permission is granted (true) or denied (false) */
  granted: Scalars['Boolean']['output'];
  id: Scalars['uuid']['output'];
  operation: Scalars['String']['output'];
  reason: Maybe<Scalars['String']['output']>;
  resource: Scalars['String']['output'];
  /** Role name for role-based overrides (mutually exclusive with user_id) */
  role: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  targetUser: Maybe<Users>;
  updatedAt: Scalars['timestamptz']['output'];
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId: Maybe<Scalars['uuid']['output']>;
}


/** User-specific and role-specific permission overrides */
export type PermissionOverridesConditionsArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "permission_overrides" */
export interface PermissionOverridesAggregate {
  __typename?: 'permissionOverridesAggregate';
  aggregate: Maybe<PermissionOverridesAggregateFields>;
  nodes: Array<PermissionOverrides>;
}

export interface PermissionOverridesAggregateBoolExp {
  bool_and?: InputMaybe<PermissionOverridesAggregateBoolExpBoolAnd>;
  bool_or?: InputMaybe<PermissionOverridesAggregateBoolExpBoolOr>;
  count?: InputMaybe<PermissionOverridesAggregateBoolExpCount>;
}

export interface PermissionOverridesAggregateBoolExpBoolAnd {
  arguments: PermissionOverridesSelectColumnPermissionOverridesAggregateBoolExpBoolAndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PermissionOverridesBoolExp>;
  predicate: BooleanComparisonExp;
}

export interface PermissionOverridesAggregateBoolExpBoolOr {
  arguments: PermissionOverridesSelectColumnPermissionOverridesAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PermissionOverridesBoolExp>;
  predicate: BooleanComparisonExp;
}

export interface PermissionOverridesAggregateBoolExpCount {
  arguments?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PermissionOverridesBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "permission_overrides" */
export interface PermissionOverridesAggregateFields {
  __typename?: 'permissionOverridesAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<PermissionOverridesMaxFields>;
  min: Maybe<PermissionOverridesMinFields>;
}


/** aggregate fields of "permission_overrides" */
export type PermissionOverridesAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "permission_overrides" */
export interface PermissionOverridesAggregateOrderBy {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<PermissionOverridesMaxOrderBy>;
  min?: InputMaybe<PermissionOverridesMinOrderBy>;
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface PermissionOverridesAppendInput {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
}

/** input type for inserting array relation for remote table "permission_overrides" */
export interface PermissionOverridesArrRelInsertInput {
  data: Array<PermissionOverridesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<PermissionOverridesOnConflict>;
}

/** Boolean expression to filter rows from the table "permission_overrides". All fields are combined with a logical 'AND'. */
export interface PermissionOverridesBoolExp {
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
}

/** unique or primary key constraints on table "permission_overrides" */
export enum PermissionOverridesConstraint {
  /** unique or primary key constraint on columns "id" */
  permission_overrides_pkey = 'permission_overrides_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface PermissionOverridesDeleteAtPathInput {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Array<Scalars['String']['input']>>;
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface PermissionOverridesDeleteElemInput {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars['Int']['input']>;
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface PermissionOverridesDeleteKeyInput {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars['String']['input']>;
}

/** input type for inserting data into table "permission_overrides" */
export interface PermissionOverridesInsertInput {
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
}

/** aggregate max on columns */
export interface PermissionOverridesMaxFields {
  __typename?: 'permissionOverridesMaxFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  createdBy: Maybe<Scalars['uuid']['output']>;
  /** When this override expires (NULL for permanent) */
  expiresAt: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  operation: Maybe<Scalars['String']['output']>;
  reason: Maybe<Scalars['String']['output']>;
  resource: Maybe<Scalars['String']['output']>;
  /** Role name for role-based overrides (mutually exclusive with user_id) */
  role: Maybe<Scalars['String']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId: Maybe<Scalars['uuid']['output']>;
}

/** order by max() on columns of table "permission_overrides" */
export interface PermissionOverridesMaxOrderBy {
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
}

/** aggregate min on columns */
export interface PermissionOverridesMinFields {
  __typename?: 'permissionOverridesMinFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  createdBy: Maybe<Scalars['uuid']['output']>;
  /** When this override expires (NULL for permanent) */
  expiresAt: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  operation: Maybe<Scalars['String']['output']>;
  reason: Maybe<Scalars['String']['output']>;
  resource: Maybe<Scalars['String']['output']>;
  /** Role name for role-based overrides (mutually exclusive with user_id) */
  role: Maybe<Scalars['String']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId: Maybe<Scalars['uuid']['output']>;
}

/** order by min() on columns of table "permission_overrides" */
export interface PermissionOverridesMinOrderBy {
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
}

/** response of any mutation on the table "permission_overrides" */
export interface PermissionOverridesMutationResponse {
  __typename?: 'permissionOverridesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PermissionOverrides>;
}

/** on_conflict condition type for table "permission_overrides" */
export interface PermissionOverridesOnConflict {
  constraint: PermissionOverridesConstraint;
  updateColumns?: Array<PermissionOverridesUpdateColumn>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
}

/** Ordering options when selecting data from "permission_overrides". */
export interface PermissionOverridesOrderBy {
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
}

/** primary key columns input for table: permission_overrides */
export interface PermissionOverridesPkColumnsInput {
  id: Scalars['uuid']['input'];
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface PermissionOverridesPrependInput {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
}

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
export interface PermissionOverridesSetInput {
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
}

/** Streaming cursor of the table "permissionOverrides" */
export interface PermissionOverridesStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: PermissionOverridesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface PermissionOverridesStreamCursorValueInput {
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
}

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

export interface PermissionOverridesUpdates {
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
}

/** columns and relationships of "audit.permission_usage_report" */
export interface PermissionUsageReports {
  __typename?: 'permissionUsageReports';
  action: Maybe<Scalars['permission_action']['output']>;
  lastUsed: Maybe<Scalars['timestamptz']['output']>;
  resourceName: Maybe<Scalars['String']['output']>;
  roleName: Maybe<Scalars['String']['output']>;
  totalUsageCount: Maybe<Scalars['bigint']['output']>;
  usersWhoUsedPermission: Maybe<Scalars['bigint']['output']>;
  usersWithPermission: Maybe<Scalars['bigint']['output']>;
}

/** aggregated selection of "audit.permission_usage_report" */
export interface PermissionUsageReportsAggregate {
  __typename?: 'permissionUsageReportsAggregate';
  aggregate: Maybe<PermissionUsageReportsAggregateFields>;
  nodes: Array<PermissionUsageReports>;
}

/** aggregate fields of "audit.permission_usage_report" */
export interface PermissionUsageReportsAggregateFields {
  __typename?: 'permissionUsageReportsAggregateFields';
  avg: Maybe<PermissionUsageReportsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<PermissionUsageReportsMaxFields>;
  min: Maybe<PermissionUsageReportsMinFields>;
  stddev: Maybe<PermissionUsageReportsStddevFields>;
  stddevPop: Maybe<PermissionUsageReportsStddevPopFields>;
  stddevSamp: Maybe<PermissionUsageReportsStddevSampFields>;
  sum: Maybe<PermissionUsageReportsSumFields>;
  varPop: Maybe<PermissionUsageReportsVarPopFields>;
  varSamp: Maybe<PermissionUsageReportsVarSampFields>;
  variance: Maybe<PermissionUsageReportsVarianceFields>;
}


/** aggregate fields of "audit.permission_usage_report" */
export type PermissionUsageReportsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<PermissionUsageReportsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export interface PermissionUsageReportsAvgFields {
  __typename?: 'permissionUsageReportsAvgFields';
  totalUsageCount: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission: Maybe<Scalars['Float']['output']>;
  usersWithPermission: Maybe<Scalars['Float']['output']>;
}

/** Boolean expression to filter rows from the table "audit.permission_usage_report". All fields are combined with a logical 'AND'. */
export interface PermissionUsageReportsBoolExp {
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
}

/** aggregate max on columns */
export interface PermissionUsageReportsMaxFields {
  __typename?: 'permissionUsageReportsMaxFields';
  action: Maybe<Scalars['permission_action']['output']>;
  lastUsed: Maybe<Scalars['timestamptz']['output']>;
  resourceName: Maybe<Scalars['String']['output']>;
  roleName: Maybe<Scalars['String']['output']>;
  totalUsageCount: Maybe<Scalars['bigint']['output']>;
  usersWhoUsedPermission: Maybe<Scalars['bigint']['output']>;
  usersWithPermission: Maybe<Scalars['bigint']['output']>;
}

/** aggregate min on columns */
export interface PermissionUsageReportsMinFields {
  __typename?: 'permissionUsageReportsMinFields';
  action: Maybe<Scalars['permission_action']['output']>;
  lastUsed: Maybe<Scalars['timestamptz']['output']>;
  resourceName: Maybe<Scalars['String']['output']>;
  roleName: Maybe<Scalars['String']['output']>;
  totalUsageCount: Maybe<Scalars['bigint']['output']>;
  usersWhoUsedPermission: Maybe<Scalars['bigint']['output']>;
  usersWithPermission: Maybe<Scalars['bigint']['output']>;
}

/** Ordering options when selecting data from "audit.permission_usage_report". */
export interface PermissionUsageReportsOrderBy {
  action?: InputMaybe<OrderBy>;
  lastUsed?: InputMaybe<OrderBy>;
  resourceName?: InputMaybe<OrderBy>;
  roleName?: InputMaybe<OrderBy>;
  totalUsageCount?: InputMaybe<OrderBy>;
  usersWhoUsedPermission?: InputMaybe<OrderBy>;
  usersWithPermission?: InputMaybe<OrderBy>;
}

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
export interface PermissionUsageReportsStddevFields {
  __typename?: 'permissionUsageReportsStddevFields';
  totalUsageCount: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission: Maybe<Scalars['Float']['output']>;
  usersWithPermission: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevPop on columns */
export interface PermissionUsageReportsStddevPopFields {
  __typename?: 'permissionUsageReportsStddevPopFields';
  totalUsageCount: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission: Maybe<Scalars['Float']['output']>;
  usersWithPermission: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevSamp on columns */
export interface PermissionUsageReportsStddevSampFields {
  __typename?: 'permissionUsageReportsStddevSampFields';
  totalUsageCount: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission: Maybe<Scalars['Float']['output']>;
  usersWithPermission: Maybe<Scalars['Float']['output']>;
}

/** Streaming cursor of the table "permissionUsageReports" */
export interface PermissionUsageReportsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: PermissionUsageReportsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface PermissionUsageReportsStreamCursorValueInput {
  action?: InputMaybe<Scalars['permission_action']['input']>;
  lastUsed?: InputMaybe<Scalars['timestamptz']['input']>;
  resourceName?: InputMaybe<Scalars['String']['input']>;
  roleName?: InputMaybe<Scalars['String']['input']>;
  totalUsageCount?: InputMaybe<Scalars['bigint']['input']>;
  usersWhoUsedPermission?: InputMaybe<Scalars['bigint']['input']>;
  usersWithPermission?: InputMaybe<Scalars['bigint']['input']>;
}

/** aggregate sum on columns */
export interface PermissionUsageReportsSumFields {
  __typename?: 'permissionUsageReportsSumFields';
  totalUsageCount: Maybe<Scalars['bigint']['output']>;
  usersWhoUsedPermission: Maybe<Scalars['bigint']['output']>;
  usersWithPermission: Maybe<Scalars['bigint']['output']>;
}

/** aggregate varPop on columns */
export interface PermissionUsageReportsVarPopFields {
  __typename?: 'permissionUsageReportsVarPopFields';
  totalUsageCount: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission: Maybe<Scalars['Float']['output']>;
  usersWithPermission: Maybe<Scalars['Float']['output']>;
}

/** aggregate varSamp on columns */
export interface PermissionUsageReportsVarSampFields {
  __typename?: 'permissionUsageReportsVarSampFields';
  totalUsageCount: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission: Maybe<Scalars['Float']['output']>;
  usersWithPermission: Maybe<Scalars['Float']['output']>;
}

/** aggregate variance on columns */
export interface PermissionUsageReportsVarianceFields {
  __typename?: 'permissionUsageReportsVarianceFields';
  totalUsageCount: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission: Maybe<Scalars['Float']['output']>;
  usersWithPermission: Maybe<Scalars['Float']['output']>;
}

/** columns and relationships of "permissions" */
export interface Permissions {
  __typename?: 'permissions';
  action: Scalars['permission_action']['output'];
  /** An array relationship */
  assignedToRoles: Array<RolePermissions>;
  /** An aggregate relationship */
  assignedToRolesAggregate: RolePermissionsAggregate;
  createdAt: Scalars['timestamptz']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  legacyPermissionName: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  relatedResource: Resources;
  resourceId: Scalars['uuid']['output'];
  updatedAt: Scalars['timestamptz']['output'];
}


/** columns and relationships of "permissions" */
export type PermissionsAssignedToRolesArgs = {
  distinctOn: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<RolePermissionsOrderBy>>;
  where: InputMaybe<RolePermissionsBoolExp>;
};


/** columns and relationships of "permissions" */
export type PermissionsAssignedToRolesAggregateArgs = {
  distinctOn: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<RolePermissionsOrderBy>>;
  where: InputMaybe<RolePermissionsBoolExp>;
};

/** aggregated selection of "permissions" */
export interface PermissionsAggregate {
  __typename?: 'permissionsAggregate';
  aggregate: Maybe<PermissionsAggregateFields>;
  nodes: Array<Permissions>;
}

export interface PermissionsAggregateBoolExp {
  count?: InputMaybe<PermissionsAggregateBoolExpCount>;
}

export interface PermissionsAggregateBoolExpCount {
  arguments?: InputMaybe<Array<PermissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PermissionsBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "permissions" */
export interface PermissionsAggregateFields {
  __typename?: 'permissionsAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<PermissionsMaxFields>;
  min: Maybe<PermissionsMinFields>;
}


/** aggregate fields of "permissions" */
export type PermissionsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<PermissionsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "permissions" */
export interface PermissionsAggregateOrderBy {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<PermissionsMaxOrderBy>;
  min?: InputMaybe<PermissionsMinOrderBy>;
}

/** input type for inserting array relation for remote table "permissions" */
export interface PermissionsArrRelInsertInput {
  data: Array<PermissionsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<PermissionsOnConflict>;
}

/** Boolean expression to filter rows from the table "permissions". All fields are combined with a logical 'AND'. */
export interface PermissionsBoolExp {
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
}

/** unique or primary key constraints on table "permissions" */
export enum PermissionsConstraint {
  /** unique or primary key constraint on columns "id" */
  permissions_pkey = 'permissions_pkey',
  /** unique or primary key constraint on columns "action", "resource_id" */
  permissions_resource_id_action_key = 'permissions_resource_id_action_key'
}

/** input type for inserting data into table "permissions" */
export interface PermissionsInsertInput {
  action?: InputMaybe<Scalars['permission_action']['input']>;
  assignedToRoles?: InputMaybe<RolePermissionsArrRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  legacyPermissionName?: InputMaybe<Scalars['String']['input']>;
  relatedResource?: InputMaybe<ResourcesObjRelInsertInput>;
  resourceId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

/** aggregate max on columns */
export interface PermissionsMaxFields {
  __typename?: 'permissionsMaxFields';
  action: Maybe<Scalars['permission_action']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  legacyPermissionName: Maybe<Scalars['String']['output']>;
  resourceId: Maybe<Scalars['uuid']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by max() on columns of table "permissions" */
export interface PermissionsMaxOrderBy {
  action?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  legacyPermissionName?: InputMaybe<OrderBy>;
  resourceId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** aggregate min on columns */
export interface PermissionsMinFields {
  __typename?: 'permissionsMinFields';
  action: Maybe<Scalars['permission_action']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  legacyPermissionName: Maybe<Scalars['String']['output']>;
  resourceId: Maybe<Scalars['uuid']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by min() on columns of table "permissions" */
export interface PermissionsMinOrderBy {
  action?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  legacyPermissionName?: InputMaybe<OrderBy>;
  resourceId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** response of any mutation on the table "permissions" */
export interface PermissionsMutationResponse {
  __typename?: 'permissionsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Permissions>;
}

/** input type for inserting object relation for remote table "permissions" */
export interface PermissionsObjRelInsertInput {
  data: PermissionsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<PermissionsOnConflict>;
}

/** on_conflict condition type for table "permissions" */
export interface PermissionsOnConflict {
  constraint: PermissionsConstraint;
  updateColumns?: Array<PermissionsUpdateColumn>;
  where?: InputMaybe<PermissionsBoolExp>;
}

/** Ordering options when selecting data from "permissions". */
export interface PermissionsOrderBy {
  action?: InputMaybe<OrderBy>;
  assignedToRolesAggregate?: InputMaybe<RolePermissionsAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  legacyPermissionName?: InputMaybe<OrderBy>;
  relatedResource?: InputMaybe<ResourcesOrderBy>;
  resourceId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: permissions */
export interface PermissionsPkColumnsInput {
  id: Scalars['uuid']['input'];
}

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
export interface PermissionsSetInput {
  action?: InputMaybe<Scalars['permission_action']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  legacyPermissionName?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

/** Streaming cursor of the table "permissions" */
export interface PermissionsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: PermissionsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface PermissionsStreamCursorValueInput {
  action?: InputMaybe<Scalars['permission_action']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  legacyPermissionName?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

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

export interface PermissionsUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PermissionsSetInput>;
  /** filter the rows which have to be updated */
  where: PermissionsBoolExp;
}

export interface QueryRoot {
  __typename?: 'query_root';
  /** query _Entity union */
  _entities: Maybe<Entity>;
  _service: Service;
  /** execute function "activate_payroll_versions" which returns "payroll_activation_results" */
  activatePayrollVersions: Array<PayrollActivationResults>;
  /** execute function "activate_payroll_versions" and query aggregates on result of table type "payroll_activation_results" */
  activatePayrollVersionsAggregate: PayrollActivationResultsAggregate;
  /** fetch data from the table: "adjustment_rules" using primary key columns */
  adjustmentRuleById: Maybe<AdjustmentRules>;
  /** An array relationship */
  adjustmentRules: Array<AdjustmentRules>;
  /** An aggregate relationship */
  adjustmentRulesAggregate: AdjustmentRulesAggregate;
  /** fetch data from the table: "app_settings" using primary key columns */
  appSettingById: Maybe<AppSettings>;
  /** fetch data from the table: "app_settings" */
  appSettings: Array<AppSettings>;
  /** fetch aggregated fields from the table: "app_settings" */
  appSettingsAggregate: AppSettingsAggregate;
  /** fetch data from the table: "audit.audit_log" using primary key columns */
  auditLogById: Maybe<AuditLogs>;
  /** fetch data from the table: "audit.audit_log" */
  auditLogs: Array<AuditLogs>;
  /** fetch aggregated fields from the table: "audit.audit_log" */
  auditLogsAggregate: AuditLogsAggregate;
  /** fetch data from the table: "audit.auth_events" using primary key columns */
  authEventById: Maybe<AuthEvents>;
  /** fetch data from the table: "audit.auth_events" */
  authEvents: Array<AuthEvents>;
  /** fetch aggregated fields from the table: "audit.auth_events" */
  authEventsAggregate: AuthEventsAggregate;
  /** fetch data from the table: "billing_event_log" using primary key columns */
  billingEventLogById: Maybe<BillingEventLogs>;
  /** An array relationship */
  billingEventLogs: Array<BillingEventLogs>;
  /** An aggregate relationship */
  billingEventLogsAggregate: BillingEventLogsAggregate;
  /** fetch data from the table: "billing_invoice" */
  billingInvoice: Array<BillingInvoice>;
  /** fetch aggregated fields from the table: "billing_invoice" */
  billingInvoiceAggregate: BillingInvoiceAggregate;
  /** fetch data from the table: "billing_invoice" using primary key columns */
  billingInvoiceById: Maybe<BillingInvoice>;
  /** An array relationship */
  billingInvoices: Array<BillingInvoices>;
  /** An aggregate relationship */
  billingInvoicesAggregate: BillingInvoicesAggregate;
  /** fetch data from the table: "billing_invoices" using primary key columns */
  billingInvoicesById: Maybe<BillingInvoices>;
  /** fetch data from the table: "billing_items" using primary key columns */
  billingItemById: Maybe<BillingItems>;
  /** An array relationship */
  billingItems: Array<BillingItems>;
  /** An aggregate relationship */
  billingItemsAggregate: BillingItemsAggregate;
  /** fetch data from the table: "billing_plan" using primary key columns */
  billingPlanById: Maybe<BillingPlans>;
  /** fetch data from the table: "billing_plan" */
  billingPlans: Array<BillingPlans>;
  /** fetch aggregated fields from the table: "billing_plan" */
  billingPlansAggregate: BillingPlansAggregate;
  /** fetch data from the table: "client_billing_assignment" using primary key columns */
  clientBillingAssignmentById: Maybe<ClientBillingAssignments>;
  /** An array relationship */
  clientBillingAssignments: Array<ClientBillingAssignments>;
  /** An aggregate relationship */
  clientBillingAssignmentsAggregate: ClientBillingAssignmentsAggregate;
  /** fetch data from the table: "clients" using primary key columns */
  clientById: Maybe<Clients>;
  /** fetch data from the table: "client_external_systems" using primary key columns */
  clientExternalSystemById: Maybe<ClientExternalSystems>;
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
  dataAccessLogById: Maybe<DataAccessLogs>;
  /** fetch data from the table: "audit.data_access_log" */
  dataAccessLogs: Array<DataAccessLogs>;
  /** fetch aggregated fields from the table: "audit.data_access_log" */
  dataAccessLogsAggregate: DataAccessLogsAggregate;
  /** fetch data from the table: "external_systems" using primary key columns */
  externalSystemById: Maybe<ExternalSystems>;
  /** fetch data from the table: "external_systems" */
  externalSystems: Array<ExternalSystems>;
  /** fetch aggregated fields from the table: "external_systems" */
  externalSystemsAggregate: ExternalSystemsAggregate;
  /** fetch data from the table: "feature_flags" using primary key columns */
  featureFlagById: Maybe<FeatureFlags>;
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
  holidayById: Maybe<Holidays>;
  /** fetch data from the table: "holidays" */
  holidays: Array<Holidays>;
  /** fetch aggregated fields from the table: "holidays" */
  holidaysAggregate: HolidaysAggregate;
  /** fetch data from the table: "latest_payroll_version_results" using primary key columns */
  latestPayrollVersionResultById: Maybe<LatestPayrollVersionResults>;
  /** fetch data from the table: "latest_payroll_version_results" */
  latestPayrollVersionResults: Array<LatestPayrollVersionResults>;
  /** fetch aggregated fields from the table: "latest_payroll_version_results" */
  latestPayrollVersionResultsAggregate: LatestPayrollVersionResultsAggregate;
  /** fetch data from the table: "leave" */
  leave: Array<Leave>;
  /** fetch aggregated fields from the table: "leave" */
  leaveAggregate: LeaveAggregate;
  /** fetch data from the table: "leave" using primary key columns */
  leaveById: Maybe<Leave>;
  /** fetch data from the table: "notes" using primary key columns */
  noteById: Maybe<Notes>;
  /** fetch data from the table: "notes" */
  notes: Array<Notes>;
  /** fetch aggregated fields from the table: "notes" */
  notesAggregate: NotesAggregate;
  /** fetch data from the table: "payroll_activation_results" using primary key columns */
  payrollActivationResultById: Maybe<PayrollActivationResults>;
  /** fetch data from the table: "payroll_activation_results" */
  payrollActivationResults: Array<PayrollActivationResults>;
  /** fetch aggregated fields from the table: "payroll_activation_results" */
  payrollActivationResultsAggregate: PayrollActivationResultsAggregate;
  /** fetch data from the table: "payroll_assignment_audit" using primary key columns */
  payrollAssignmentAuditById: Maybe<PayrollAssignmentAudits>;
  /** An array relationship */
  payrollAssignmentAudits: Array<PayrollAssignmentAudits>;
  /** An aggregate relationship */
  payrollAssignmentAuditsAggregate: PayrollAssignmentAuditsAggregate;
  /** fetch data from the table: "payroll_assignments" using primary key columns */
  payrollAssignmentById: Maybe<PayrollAssignments>;
  /** fetch data from the table: "payroll_assignments" */
  payrollAssignments: Array<PayrollAssignments>;
  /** fetch aggregated fields from the table: "payroll_assignments" */
  payrollAssignmentsAggregate: PayrollAssignmentsAggregate;
  /** fetch data from the table: "payrolls" using primary key columns */
  payrollById: Maybe<Payrolls>;
  /** fetch data from the table: "payroll_cycles" using primary key columns */
  payrollCycleById: Maybe<PayrollCycles>;
  /** fetch data from the table: "payroll_cycles" */
  payrollCycles: Array<PayrollCycles>;
  /** fetch aggregated fields from the table: "payroll_cycles" */
  payrollCyclesAggregate: PayrollCyclesAggregate;
  /** fetch data from the table: "payroll_dashboard_stats" */
  payrollDashboardStats: Array<PayrollDashboardStats>;
  /** fetch aggregated fields from the table: "payroll_dashboard_stats" */
  payrollDashboardStatsAggregate: PayrollDashboardStatsAggregate;
  /** fetch data from the table: "payroll_dates" using primary key columns */
  payrollDateById: Maybe<PayrollDates>;
  /** fetch data from the table: "payroll_date_types" using primary key columns */
  payrollDateTypeById: Maybe<PayrollDateTypes>;
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
  payrollVersionHistoryResultById: Maybe<PayrollVersionHistoryResults>;
  /** fetch data from the table: "payroll_version_history_results" */
  payrollVersionHistoryResults: Array<PayrollVersionHistoryResults>;
  /** fetch aggregated fields from the table: "payroll_version_history_results" */
  payrollVersionHistoryResultsAggregate: PayrollVersionHistoryResultsAggregate;
  /** fetch data from the table: "payroll_version_results" using primary key columns */
  payrollVersionResultById: Maybe<PayrollVersionResults>;
  /** fetch data from the table: "payroll_version_results" */
  payrollVersionResults: Array<PayrollVersionResults>;
  /** fetch aggregated fields from the table: "payroll_version_results" */
  payrollVersionResultsAggregate: PayrollVersionResultsAggregate;
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrollsAggregate: PayrollsAggregate;
  /** fetch data from the table: "permission_audit_log" using primary key columns */
  permissionAuditLogById: Maybe<PermissionAuditLogs>;
  /** fetch data from the table: "permission_audit_log" */
  permissionAuditLogs: Array<PermissionAuditLogs>;
  /** fetch aggregated fields from the table: "permission_audit_log" */
  permissionAuditLogsAggregate: PermissionAuditLogsAggregate;
  /** fetch data from the table: "permissions" using primary key columns */
  permissionById: Maybe<Permissions>;
  /** fetch data from the table: "audit.permission_changes" using primary key columns */
  permissionChangeById: Maybe<PermissionChanges>;
  /** fetch data from the table: "audit.permission_changes" */
  permissionChanges: Array<PermissionChanges>;
  /** fetch aggregated fields from the table: "audit.permission_changes" */
  permissionChangesAggregate: PermissionChangesAggregate;
  /** fetch data from the table: "permission_overrides" using primary key columns */
  permissionOverrideById: Maybe<PermissionOverrides>;
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
  resourceById: Maybe<Resources>;
  /** fetch data from the table: "resources" */
  resources: Array<Resources>;
  /** fetch aggregated fields from the table: "resources" */
  resourcesAggregate: ResourcesAggregate;
  /** fetch data from the table: "roles" using primary key columns */
  roleById: Maybe<Roles>;
  /** fetch data from the table: "role_permissions" using primary key columns */
  rolePermissionById: Maybe<RolePermissions>;
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
  slowQueryById: Maybe<SlowQueries>;
  /** fetch data from the table: "audit.user_access_summary" */
  userAccessSummaries: Array<UserAccessSummaries>;
  /** fetch aggregated fields from the table: "audit.user_access_summary" */
  userAccessSummariesAggregate: UserAccessSummariesAggregate;
  /** fetch data from the table: "users" using primary key columns */
  userById: Maybe<Users>;
  /** fetch data from the table: "user_invitations" using primary key columns */
  userInvitationById: Maybe<UserInvitations>;
  /** fetch data from the table: "user_invitations" */
  userInvitations: Array<UserInvitations>;
  /** fetch aggregated fields from the table: "user_invitations" */
  userInvitationsAggregate: UserInvitationsAggregate;
  /** fetch data from the table: "user_roles" using primary key columns */
  userRoleById: Maybe<UserRoles>;
  /** fetch data from the table: "user_roles" */
  userRoles: Array<UserRoles>;
  /** fetch aggregated fields from the table: "user_roles" */
  userRolesAggregate: UserRolesAggregate;
  /** fetch data from the table: "neon_auth.users_sync" using primary key columns */
  userSyncById: Maybe<AuthUsersSync>;
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
  workScheduleById: Maybe<WorkSchedules>;
  /** fetch data from the table: "work_schedule" */
  workSchedules: Array<WorkSchedules>;
  /** fetch aggregated fields from the table: "work_schedule" */
  workSchedulesAggregate: WorkSchedulesAggregate;
}


export type QueryRootEntitiesArgs = {
  representations: Array<Scalars['_Any']['input']>;
};


export type QueryRootActivatePayrollVersionsArgs = {
  distinctOn: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type QueryRootActivatePayrollVersionsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type QueryRootAdjustmentRuleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootAdjustmentRulesArgs = {
  distinctOn: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where: InputMaybe<AdjustmentRulesBoolExp>;
};


export type QueryRootAdjustmentRulesAggregateArgs = {
  distinctOn: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where: InputMaybe<AdjustmentRulesBoolExp>;
};


export type QueryRootAppSettingByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryRootAppSettingsArgs = {
  distinctOn: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AppSettingsOrderBy>>;
  where: InputMaybe<AppSettingsBoolExp>;
};


export type QueryRootAppSettingsAggregateArgs = {
  distinctOn: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AppSettingsOrderBy>>;
  where: InputMaybe<AppSettingsBoolExp>;
};


export type QueryRootAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootAuditLogsArgs = {
  distinctOn: InputMaybe<Array<AuditLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AuditLogsOrderBy>>;
  where: InputMaybe<AuditLogsBoolExp>;
};


export type QueryRootAuditLogsAggregateArgs = {
  distinctOn: InputMaybe<Array<AuditLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AuditLogsOrderBy>>;
  where: InputMaybe<AuditLogsBoolExp>;
};


export type QueryRootAuthEventByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootAuthEventsArgs = {
  distinctOn: InputMaybe<Array<AuthEventsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AuthEventsOrderBy>>;
  where: InputMaybe<AuthEventsBoolExp>;
};


export type QueryRootAuthEventsAggregateArgs = {
  distinctOn: InputMaybe<Array<AuthEventsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AuthEventsOrderBy>>;
  where: InputMaybe<AuthEventsBoolExp>;
};


export type QueryRootBillingEventLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootBillingEventLogsArgs = {
  distinctOn: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where: InputMaybe<BillingEventLogsBoolExp>;
};


export type QueryRootBillingEventLogsAggregateArgs = {
  distinctOn: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where: InputMaybe<BillingEventLogsBoolExp>;
};


export type QueryRootBillingInvoiceArgs = {
  distinctOn: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where: InputMaybe<BillingInvoiceBoolExp>;
};


export type QueryRootBillingInvoiceAggregateArgs = {
  distinctOn: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where: InputMaybe<BillingInvoiceBoolExp>;
};


export type QueryRootBillingInvoiceByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootBillingInvoicesArgs = {
  distinctOn: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingInvoicesOrderBy>>;
  where: InputMaybe<BillingInvoicesBoolExp>;
};


export type QueryRootBillingInvoicesAggregateArgs = {
  distinctOn: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingInvoicesOrderBy>>;
  where: InputMaybe<BillingInvoicesBoolExp>;
};


export type QueryRootBillingInvoicesByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootBillingItemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootBillingItemsArgs = {
  distinctOn: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingItemsOrderBy>>;
  where: InputMaybe<BillingItemsBoolExp>;
};


export type QueryRootBillingItemsAggregateArgs = {
  distinctOn: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingItemsOrderBy>>;
  where: InputMaybe<BillingItemsBoolExp>;
};


export type QueryRootBillingPlanByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootBillingPlansArgs = {
  distinctOn: InputMaybe<Array<BillingPlansSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingPlansOrderBy>>;
  where: InputMaybe<BillingPlansBoolExp>;
};


export type QueryRootBillingPlansAggregateArgs = {
  distinctOn: InputMaybe<Array<BillingPlansSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingPlansOrderBy>>;
  where: InputMaybe<BillingPlansBoolExp>;
};


export type QueryRootClientBillingAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootClientBillingAssignmentsArgs = {
  distinctOn: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


export type QueryRootClientBillingAssignmentsAggregateArgs = {
  distinctOn: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


export type QueryRootClientByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootClientExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootClientExternalSystemsArgs = {
  distinctOn: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type QueryRootClientExternalSystemsAggregateArgs = {
  distinctOn: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type QueryRootClientsArgs = {
  distinctOn: InputMaybe<Array<ClientsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientsOrderBy>>;
  where: InputMaybe<ClientsBoolExp>;
};


export type QueryRootClientsAggregateArgs = {
  distinctOn: InputMaybe<Array<ClientsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientsOrderBy>>;
  where: InputMaybe<ClientsBoolExp>;
};


export type QueryRootCreatePayrollVersionArgs = {
  args: CreatePayrollVersionArgs;
  distinctOn: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type QueryRootCreatePayrollVersionAggregateArgs = {
  args: CreatePayrollVersionArgs;
  distinctOn: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type QueryRootCreatePayrollVersionSimpleArgs = {
  args: CreatePayrollVersionSimpleArgs;
  distinctOn: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type QueryRootCreatePayrollVersionSimpleAggregateArgs = {
  args: CreatePayrollVersionSimpleArgs;
  distinctOn: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type QueryRootCurrentPayrollsArgs = {
  distinctOn: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where: InputMaybe<CurrentPayrollsBoolExp>;
};


export type QueryRootCurrentPayrollsAggregateArgs = {
  distinctOn: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where: InputMaybe<CurrentPayrollsBoolExp>;
};


export type QueryRootDataAccessLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootDataAccessLogsArgs = {
  distinctOn: InputMaybe<Array<DataAccessLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<DataAccessLogsOrderBy>>;
  where: InputMaybe<DataAccessLogsBoolExp>;
};


export type QueryRootDataAccessLogsAggregateArgs = {
  distinctOn: InputMaybe<Array<DataAccessLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<DataAccessLogsOrderBy>>;
  where: InputMaybe<DataAccessLogsBoolExp>;
};


export type QueryRootExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootExternalSystemsArgs = {
  distinctOn: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where: InputMaybe<ExternalSystemsBoolExp>;
};


export type QueryRootExternalSystemsAggregateArgs = {
  distinctOn: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where: InputMaybe<ExternalSystemsBoolExp>;
};


export type QueryRootFeatureFlagByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootFeatureFlagsArgs = {
  distinctOn: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where: InputMaybe<FeatureFlagsBoolExp>;
};


export type QueryRootFeatureFlagsAggregateArgs = {
  distinctOn: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where: InputMaybe<FeatureFlagsBoolExp>;
};


export type QueryRootGeneratePayrollDatesArgs = {
  args: GeneratePayrollDatesArgs;
  distinctOn: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDatesOrderBy>>;
  where: InputMaybe<PayrollDatesBoolExp>;
};


export type QueryRootGeneratePayrollDatesAggregateArgs = {
  args: GeneratePayrollDatesArgs;
  distinctOn: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDatesOrderBy>>;
  where: InputMaybe<PayrollDatesBoolExp>;
};


export type QueryRootGetLatestPayrollVersionArgs = {
  args: GetLatestPayrollVersionArgs;
  distinctOn: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type QueryRootGetLatestPayrollVersionAggregateArgs = {
  args: GetLatestPayrollVersionArgs;
  distinctOn: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type QueryRootGetPayrollVersionHistoryArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinctOn: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type QueryRootGetPayrollVersionHistoryAggregateArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinctOn: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type QueryRootHolidayByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootHolidaysArgs = {
  distinctOn: InputMaybe<Array<HolidaysSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<HolidaysOrderBy>>;
  where: InputMaybe<HolidaysBoolExp>;
};


export type QueryRootHolidaysAggregateArgs = {
  distinctOn: InputMaybe<Array<HolidaysSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<HolidaysOrderBy>>;
  where: InputMaybe<HolidaysBoolExp>;
};


export type QueryRootLatestPayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootLatestPayrollVersionResultsArgs = {
  distinctOn: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type QueryRootLatestPayrollVersionResultsAggregateArgs = {
  distinctOn: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type QueryRootLeaveArgs = {
  distinctOn: InputMaybe<Array<LeaveSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<LeaveOrderBy>>;
  where: InputMaybe<LeaveBoolExp>;
};


export type QueryRootLeaveAggregateArgs = {
  distinctOn: InputMaybe<Array<LeaveSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<LeaveOrderBy>>;
  where: InputMaybe<LeaveBoolExp>;
};


export type QueryRootLeaveByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootNoteByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootNotesArgs = {
  distinctOn: InputMaybe<Array<NotesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<NotesOrderBy>>;
  where: InputMaybe<NotesBoolExp>;
};


export type QueryRootNotesAggregateArgs = {
  distinctOn: InputMaybe<Array<NotesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<NotesOrderBy>>;
  where: InputMaybe<NotesBoolExp>;
};


export type QueryRootPayrollActivationResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollActivationResultsArgs = {
  distinctOn: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type QueryRootPayrollActivationResultsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type QueryRootPayrollAssignmentAuditByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollAssignmentAuditsArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


export type QueryRootPayrollAssignmentAuditsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


export type QueryRootPayrollAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollAssignmentsArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type QueryRootPayrollAssignmentsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type QueryRootPayrollByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollCycleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollCyclesArgs = {
  distinctOn: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where: InputMaybe<PayrollCyclesBoolExp>;
};


export type QueryRootPayrollCyclesAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where: InputMaybe<PayrollCyclesBoolExp>;
};


export type QueryRootPayrollDashboardStatsArgs = {
  distinctOn: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type QueryRootPayrollDashboardStatsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type QueryRootPayrollDateByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollDateTypeByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollDateTypesArgs = {
  distinctOn: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where: InputMaybe<PayrollDateTypesBoolExp>;
};


export type QueryRootPayrollDateTypesAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where: InputMaybe<PayrollDateTypesBoolExp>;
};


export type QueryRootPayrollDatesArgs = {
  distinctOn: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDatesOrderBy>>;
  where: InputMaybe<PayrollDatesBoolExp>;
};


export type QueryRootPayrollDatesAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDatesOrderBy>>;
  where: InputMaybe<PayrollDatesBoolExp>;
};


export type QueryRootPayrollTriggersStatusArgs = {
  distinctOn: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type QueryRootPayrollTriggersStatusAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type QueryRootPayrollVersionHistoryResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollVersionHistoryResultsArgs = {
  distinctOn: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type QueryRootPayrollVersionHistoryResultsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type QueryRootPayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollVersionResultsArgs = {
  distinctOn: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type QueryRootPayrollVersionResultsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type QueryRootPayrollsArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};


export type QueryRootPayrollsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};


export type QueryRootPermissionAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPermissionAuditLogsArgs = {
  distinctOn: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where: InputMaybe<PermissionAuditLogsBoolExp>;
};


export type QueryRootPermissionAuditLogsAggregateArgs = {
  distinctOn: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where: InputMaybe<PermissionAuditLogsBoolExp>;
};


export type QueryRootPermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPermissionChangeByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPermissionChangesArgs = {
  distinctOn: InputMaybe<Array<PermissionChangesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionChangesOrderBy>>;
  where: InputMaybe<PermissionChangesBoolExp>;
};


export type QueryRootPermissionChangesAggregateArgs = {
  distinctOn: InputMaybe<Array<PermissionChangesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionChangesOrderBy>>;
  where: InputMaybe<PermissionChangesBoolExp>;
};


export type QueryRootPermissionOverrideByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPermissionOverridesArgs = {
  distinctOn: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where: InputMaybe<PermissionOverridesBoolExp>;
};


export type QueryRootPermissionOverridesAggregateArgs = {
  distinctOn: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where: InputMaybe<PermissionOverridesBoolExp>;
};


export type QueryRootPermissionUsageReportsArgs = {
  distinctOn: InputMaybe<Array<PermissionUsageReportsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionUsageReportsOrderBy>>;
  where: InputMaybe<PermissionUsageReportsBoolExp>;
};


export type QueryRootPermissionUsageReportsAggregateArgs = {
  distinctOn: InputMaybe<Array<PermissionUsageReportsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionUsageReportsOrderBy>>;
  where: InputMaybe<PermissionUsageReportsBoolExp>;
};


export type QueryRootPermissionsArgs = {
  distinctOn: InputMaybe<Array<PermissionsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionsOrderBy>>;
  where: InputMaybe<PermissionsBoolExp>;
};


export type QueryRootPermissionsAggregateArgs = {
  distinctOn: InputMaybe<Array<PermissionsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionsOrderBy>>;
  where: InputMaybe<PermissionsBoolExp>;
};


export type QueryRootResourceByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootResourcesArgs = {
  distinctOn: InputMaybe<Array<ResourcesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ResourcesOrderBy>>;
  where: InputMaybe<ResourcesBoolExp>;
};


export type QueryRootResourcesAggregateArgs = {
  distinctOn: InputMaybe<Array<ResourcesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ResourcesOrderBy>>;
  where: InputMaybe<ResourcesBoolExp>;
};


export type QueryRootRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootRolePermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootRolePermissionsArgs = {
  distinctOn: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<RolePermissionsOrderBy>>;
  where: InputMaybe<RolePermissionsBoolExp>;
};


export type QueryRootRolePermissionsAggregateArgs = {
  distinctOn: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<RolePermissionsOrderBy>>;
  where: InputMaybe<RolePermissionsBoolExp>;
};


export type QueryRootRolesArgs = {
  distinctOn: InputMaybe<Array<RolesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<RolesOrderBy>>;
  where: InputMaybe<RolesBoolExp>;
};


export type QueryRootRolesAggregateArgs = {
  distinctOn: InputMaybe<Array<RolesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<RolesOrderBy>>;
  where: InputMaybe<RolesBoolExp>;
};


export type QueryRootSlowQueriesArgs = {
  distinctOn: InputMaybe<Array<SlowQueriesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<SlowQueriesOrderBy>>;
  where: InputMaybe<SlowQueriesBoolExp>;
};


export type QueryRootSlowQueriesAggregateArgs = {
  distinctOn: InputMaybe<Array<SlowQueriesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<SlowQueriesOrderBy>>;
  where: InputMaybe<SlowQueriesBoolExp>;
};


export type QueryRootSlowQueryByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootUserAccessSummariesArgs = {
  distinctOn: InputMaybe<Array<UserAccessSummariesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UserAccessSummariesOrderBy>>;
  where: InputMaybe<UserAccessSummariesBoolExp>;
};


export type QueryRootUserAccessSummariesAggregateArgs = {
  distinctOn: InputMaybe<Array<UserAccessSummariesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UserAccessSummariesOrderBy>>;
  where: InputMaybe<UserAccessSummariesBoolExp>;
};


export type QueryRootUserByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootUserInvitationByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootUserInvitationsArgs = {
  distinctOn: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UserInvitationsOrderBy>>;
  where: InputMaybe<UserInvitationsBoolExp>;
};


export type QueryRootUserInvitationsAggregateArgs = {
  distinctOn: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UserInvitationsOrderBy>>;
  where: InputMaybe<UserInvitationsBoolExp>;
};


export type QueryRootUserRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootUserRolesArgs = {
  distinctOn: InputMaybe<Array<UserRolesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UserRolesOrderBy>>;
  where: InputMaybe<UserRolesBoolExp>;
};


export type QueryRootUserRolesAggregateArgs = {
  distinctOn: InputMaybe<Array<UserRolesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UserRolesOrderBy>>;
  where: InputMaybe<UserRolesBoolExp>;
};


export type QueryRootUserSyncByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryRootUsersArgs = {
  distinctOn: InputMaybe<Array<UsersSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UsersOrderBy>>;
  where: InputMaybe<UsersBoolExp>;
};


export type QueryRootUsersAggregateArgs = {
  distinctOn: InputMaybe<Array<UsersSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UsersOrderBy>>;
  where: InputMaybe<UsersBoolExp>;
};


export type QueryRootUsersRoleBackupsArgs = {
  distinctOn: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where: InputMaybe<UsersRoleBackupBoolExp>;
};


export type QueryRootUsersRoleBackupsAggregateArgs = {
  distinctOn: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where: InputMaybe<UsersRoleBackupBoolExp>;
};


export type QueryRootUsersSyncArgs = {
  distinctOn: InputMaybe<Array<AuthUsersSyncSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AuthUsersSyncOrderBy>>;
  where: InputMaybe<AuthUsersSyncBoolExp>;
};


export type QueryRootUsersSyncAggregateArgs = {
  distinctOn: InputMaybe<Array<AuthUsersSyncSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AuthUsersSyncOrderBy>>;
  where: InputMaybe<AuthUsersSyncBoolExp>;
};


export type QueryRootWorkScheduleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootWorkSchedulesArgs = {
  distinctOn: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<WorkSchedulesOrderBy>>;
  where: InputMaybe<WorkSchedulesBoolExp>;
};


export type QueryRootWorkSchedulesAggregateArgs = {
  distinctOn: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<WorkSchedulesOrderBy>>;
  where: InputMaybe<WorkSchedulesBoolExp>;
};

/** columns and relationships of "resources" */
export interface Resources {
  __typename?: 'resources';
  /** An array relationship */
  availablePermissions: Array<Permissions>;
  /** An aggregate relationship */
  availablePermissionsAggregate: PermissionsAggregate;
  createdAt: Scalars['timestamptz']['output'];
  description: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['timestamptz']['output'];
}


/** columns and relationships of "resources" */
export type ResourcesAvailablePermissionsArgs = {
  distinctOn: InputMaybe<Array<PermissionsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionsOrderBy>>;
  where: InputMaybe<PermissionsBoolExp>;
};


/** columns and relationships of "resources" */
export type ResourcesAvailablePermissionsAggregateArgs = {
  distinctOn: InputMaybe<Array<PermissionsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionsOrderBy>>;
  where: InputMaybe<PermissionsBoolExp>;
};

/** aggregated selection of "resources" */
export interface ResourcesAggregate {
  __typename?: 'resourcesAggregate';
  aggregate: Maybe<ResourcesAggregateFields>;
  nodes: Array<Resources>;
}

/** aggregate fields of "resources" */
export interface ResourcesAggregateFields {
  __typename?: 'resourcesAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<ResourcesMaxFields>;
  min: Maybe<ResourcesMinFields>;
}


/** aggregate fields of "resources" */
export type ResourcesAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<ResourcesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "resources". All fields are combined with a logical 'AND'. */
export interface ResourcesBoolExp {
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
}

/** unique or primary key constraints on table "resources" */
export enum ResourcesConstraint {
  /** unique or primary key constraint on columns "name" */
  resources_name_key = 'resources_name_key',
  /** unique or primary key constraint on columns "id" */
  resources_pkey = 'resources_pkey'
}

/** input type for inserting data into table "resources" */
export interface ResourcesInsertInput {
  availablePermissions?: InputMaybe<PermissionsArrRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

/** aggregate max on columns */
export interface ResourcesMaxFields {
  __typename?: 'resourcesMaxFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  description: Maybe<Scalars['String']['output']>;
  displayName: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** aggregate min on columns */
export interface ResourcesMinFields {
  __typename?: 'resourcesMinFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  description: Maybe<Scalars['String']['output']>;
  displayName: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** response of any mutation on the table "resources" */
export interface ResourcesMutationResponse {
  __typename?: 'resourcesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Resources>;
}

/** input type for inserting object relation for remote table "resources" */
export interface ResourcesObjRelInsertInput {
  data: ResourcesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<ResourcesOnConflict>;
}

/** on_conflict condition type for table "resources" */
export interface ResourcesOnConflict {
  constraint: ResourcesConstraint;
  updateColumns?: Array<ResourcesUpdateColumn>;
  where?: InputMaybe<ResourcesBoolExp>;
}

/** Ordering options when selecting data from "resources". */
export interface ResourcesOrderBy {
  availablePermissionsAggregate?: InputMaybe<PermissionsAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  displayName?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: resources */
export interface ResourcesPkColumnsInput {
  id: Scalars['uuid']['input'];
}

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
export interface ResourcesSetInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

/** Streaming cursor of the table "resources" */
export interface ResourcesStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: ResourcesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface ResourcesStreamCursorValueInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

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

export interface ResourcesUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ResourcesSetInput>;
  /** filter the rows which have to be updated */
  where: ResourcesBoolExp;
}

/** columns and relationships of "role_permissions" */
export interface RolePermissions {
  __typename?: 'rolePermissions';
  conditions: Maybe<Scalars['jsonb']['output']>;
  createdAt: Scalars['timestamptz']['output'];
  /** An object relationship */
  grantedPermission: Permissions;
  /** An object relationship */
  grantedToRole: Roles;
  id: Scalars['uuid']['output'];
  permissionId: Scalars['uuid']['output'];
  roleId: Scalars['uuid']['output'];
  updatedAt: Scalars['timestamptz']['output'];
}


/** columns and relationships of "role_permissions" */
export type RolePermissionsConditionsArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "role_permissions" */
export interface RolePermissionsAggregate {
  __typename?: 'rolePermissionsAggregate';
  aggregate: Maybe<RolePermissionsAggregateFields>;
  nodes: Array<RolePermissions>;
}

export interface RolePermissionsAggregateBoolExp {
  count?: InputMaybe<RolePermissionsAggregateBoolExpCount>;
}

export interface RolePermissionsAggregateBoolExpCount {
  arguments?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<RolePermissionsBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "role_permissions" */
export interface RolePermissionsAggregateFields {
  __typename?: 'rolePermissionsAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<RolePermissionsMaxFields>;
  min: Maybe<RolePermissionsMinFields>;
}


/** aggregate fields of "role_permissions" */
export type RolePermissionsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<RolePermissionsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "role_permissions" */
export interface RolePermissionsAggregateOrderBy {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<RolePermissionsMaxOrderBy>;
  min?: InputMaybe<RolePermissionsMinOrderBy>;
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface RolePermissionsAppendInput {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
}

/** input type for inserting array relation for remote table "role_permissions" */
export interface RolePermissionsArrRelInsertInput {
  data: Array<RolePermissionsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<RolePermissionsOnConflict>;
}

/** Boolean expression to filter rows from the table "role_permissions". All fields are combined with a logical 'AND'. */
export interface RolePermissionsBoolExp {
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
}

/** unique or primary key constraints on table "role_permissions" */
export enum RolePermissionsConstraint {
  /** unique or primary key constraint on columns "id" */
  role_permissions_pkey = 'role_permissions_pkey',
  /** unique or primary key constraint on columns "permission_id", "role_id" */
  role_permissions_role_id_permission_id_key = 'role_permissions_role_id_permission_id_key'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface RolePermissionsDeleteAtPathInput {
  conditions?: InputMaybe<Array<Scalars['String']['input']>>;
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface RolePermissionsDeleteElemInput {
  conditions?: InputMaybe<Scalars['Int']['input']>;
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface RolePermissionsDeleteKeyInput {
  conditions?: InputMaybe<Scalars['String']['input']>;
}

/** input type for inserting data into table "role_permissions" */
export interface RolePermissionsInsertInput {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  grantedPermission?: InputMaybe<PermissionsObjRelInsertInput>;
  grantedToRole?: InputMaybe<RolesObjRelInsertInput>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  permissionId?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

/** aggregate max on columns */
export interface RolePermissionsMaxFields {
  __typename?: 'rolePermissionsMaxFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  permissionId: Maybe<Scalars['uuid']['output']>;
  roleId: Maybe<Scalars['uuid']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by max() on columns of table "role_permissions" */
export interface RolePermissionsMaxOrderBy {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  permissionId?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** aggregate min on columns */
export interface RolePermissionsMinFields {
  __typename?: 'rolePermissionsMinFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  permissionId: Maybe<Scalars['uuid']['output']>;
  roleId: Maybe<Scalars['uuid']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** order by min() on columns of table "role_permissions" */
export interface RolePermissionsMinOrderBy {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  permissionId?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** response of any mutation on the table "role_permissions" */
export interface RolePermissionsMutationResponse {
  __typename?: 'rolePermissionsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<RolePermissions>;
}

/** on_conflict condition type for table "role_permissions" */
export interface RolePermissionsOnConflict {
  constraint: RolePermissionsConstraint;
  updateColumns?: Array<RolePermissionsUpdateColumn>;
  where?: InputMaybe<RolePermissionsBoolExp>;
}

/** Ordering options when selecting data from "role_permissions". */
export interface RolePermissionsOrderBy {
  conditions?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  grantedPermission?: InputMaybe<PermissionsOrderBy>;
  grantedToRole?: InputMaybe<RolesOrderBy>;
  id?: InputMaybe<OrderBy>;
  permissionId?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: role_permissions */
export interface RolePermissionsPkColumnsInput {
  id: Scalars['uuid']['input'];
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface RolePermissionsPrependInput {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
}

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
export interface RolePermissionsSetInput {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  permissionId?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

/** Streaming cursor of the table "rolePermissions" */
export interface RolePermissionsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: RolePermissionsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface RolePermissionsStreamCursorValueInput {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  permissionId?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

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

export interface RolePermissionsUpdates {
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
}

/** columns and relationships of "roles" */
export interface Roles {
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
  description: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  isSystemRole: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  updatedAt: Scalars['timestamptz']['output'];
}


/** columns and relationships of "roles" */
export type RolesAssignedPermissionsArgs = {
  distinctOn: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<RolePermissionsOrderBy>>;
  where: InputMaybe<RolePermissionsBoolExp>;
};


/** columns and relationships of "roles" */
export type RolesAssignedPermissionsAggregateArgs = {
  distinctOn: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<RolePermissionsOrderBy>>;
  where: InputMaybe<RolePermissionsBoolExp>;
};


/** columns and relationships of "roles" */
export type RolesAssignedToUsersArgs = {
  distinctOn: InputMaybe<Array<UserRolesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UserRolesOrderBy>>;
  where: InputMaybe<UserRolesBoolExp>;
};


/** columns and relationships of "roles" */
export type RolesAssignedToUsersAggregateArgs = {
  distinctOn: InputMaybe<Array<UserRolesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UserRolesOrderBy>>;
  where: InputMaybe<UserRolesBoolExp>;
};

/** aggregated selection of "roles" */
export interface RolesAggregate {
  __typename?: 'rolesAggregate';
  aggregate: Maybe<RolesAggregateFields>;
  nodes: Array<Roles>;
}

/** aggregate fields of "roles" */
export interface RolesAggregateFields {
  __typename?: 'rolesAggregateFields';
  avg: Maybe<RolesAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<RolesMaxFields>;
  min: Maybe<RolesMinFields>;
  stddev: Maybe<RolesStddevFields>;
  stddevPop: Maybe<RolesStddevPopFields>;
  stddevSamp: Maybe<RolesStddevSampFields>;
  sum: Maybe<RolesSumFields>;
  varPop: Maybe<RolesVarPopFields>;
  varSamp: Maybe<RolesVarSampFields>;
  variance: Maybe<RolesVarianceFields>;
}


/** aggregate fields of "roles" */
export type RolesAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<RolesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export interface RolesAvgFields {
  __typename?: 'rolesAvgFields';
  priority: Maybe<Scalars['Float']['output']>;
}

/** Boolean expression to filter rows from the table "roles". All fields are combined with a logical 'AND'. */
export interface RolesBoolExp {
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
}

/** unique or primary key constraints on table "roles" */
export enum RolesConstraint {
  /** unique or primary key constraint on columns "name" */
  roles_name_key = 'roles_name_key',
  /** unique or primary key constraint on columns "id" */
  roles_pkey = 'roles_pkey'
}

/** input type for incrementing numeric columns in table "roles" */
export interface RolesIncInput {
  priority?: InputMaybe<Scalars['Int']['input']>;
}

/** input type for inserting data into table "roles" */
export interface RolesInsertInput {
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
}

/** aggregate max on columns */
export interface RolesMaxFields {
  __typename?: 'rolesMaxFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  description: Maybe<Scalars['String']['output']>;
  displayName: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  priority: Maybe<Scalars['Int']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** aggregate min on columns */
export interface RolesMinFields {
  __typename?: 'rolesMinFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  description: Maybe<Scalars['String']['output']>;
  displayName: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  priority: Maybe<Scalars['Int']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** response of any mutation on the table "roles" */
export interface RolesMutationResponse {
  __typename?: 'rolesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Roles>;
}

/** input type for inserting object relation for remote table "roles" */
export interface RolesObjRelInsertInput {
  data: RolesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<RolesOnConflict>;
}

/** on_conflict condition type for table "roles" */
export interface RolesOnConflict {
  constraint: RolesConstraint;
  updateColumns?: Array<RolesUpdateColumn>;
  where?: InputMaybe<RolesBoolExp>;
}

/** Ordering options when selecting data from "roles". */
export interface RolesOrderBy {
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
}

/** primary key columns input for table: roles */
export interface RolesPkColumnsInput {
  id: Scalars['uuid']['input'];
}

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
export interface RolesSetInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isSystemRole?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

/** aggregate stddev on columns */
export interface RolesStddevFields {
  __typename?: 'rolesStddevFields';
  priority: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevPop on columns */
export interface RolesStddevPopFields {
  __typename?: 'rolesStddevPopFields';
  priority: Maybe<Scalars['Float']['output']>;
}

/** aggregate stddevSamp on columns */
export interface RolesStddevSampFields {
  __typename?: 'rolesStddevSampFields';
  priority: Maybe<Scalars['Float']['output']>;
}

/** Streaming cursor of the table "roles" */
export interface RolesStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: RolesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface RolesStreamCursorValueInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isSystemRole?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

/** aggregate sum on columns */
export interface RolesSumFields {
  __typename?: 'rolesSumFields';
  priority: Maybe<Scalars['Int']['output']>;
}

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

export interface RolesUpdates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<RolesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<RolesSetInput>;
  /** filter the rows which have to be updated */
  where: RolesBoolExp;
}

/** aggregate varPop on columns */
export interface RolesVarPopFields {
  __typename?: 'rolesVarPopFields';
  priority: Maybe<Scalars['Float']['output']>;
}

/** aggregate varSamp on columns */
export interface RolesVarSampFields {
  __typename?: 'rolesVarSampFields';
  priority: Maybe<Scalars['Float']['output']>;
}

/** aggregate variance on columns */
export interface RolesVarianceFields {
  __typename?: 'rolesVarianceFields';
  priority: Maybe<Scalars['Float']['output']>;
}

/** columns and relationships of "audit.slow_queries" */
export interface SlowQueries {
  __typename?: 'slowQueries';
  applicationName: Maybe<Scalars['String']['output']>;
  clientAddr: Maybe<Scalars['inet']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  query: Scalars['String']['output'];
  queryDuration: Scalars['interval']['output'];
  queryStart: Scalars['timestamptz']['output'];
  userId: Maybe<Scalars['uuid']['output']>;
}

/** aggregated selection of "audit.slow_queries" */
export interface SlowQueriesAggregate {
  __typename?: 'slowQueriesAggregate';
  aggregate: Maybe<SlowQueriesAggregateFields>;
  nodes: Array<SlowQueries>;
}

/** aggregate fields of "audit.slow_queries" */
export interface SlowQueriesAggregateFields {
  __typename?: 'slowQueriesAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<SlowQueriesMaxFields>;
  min: Maybe<SlowQueriesMinFields>;
}


/** aggregate fields of "audit.slow_queries" */
export type SlowQueriesAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<SlowQueriesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "audit.slow_queries". All fields are combined with a logical 'AND'. */
export interface SlowQueriesBoolExp {
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
}

/** unique or primary key constraints on table "audit.slow_queries" */
export enum SlowQueriesConstraint {
  /** unique or primary key constraint on columns "id" */
  slow_queries_pkey = 'slow_queries_pkey'
}

/** input type for inserting data into table "audit.slow_queries" */
export interface SlowQueriesInsertInput {
  applicationName?: InputMaybe<Scalars['String']['input']>;
  clientAddr?: InputMaybe<Scalars['inet']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryDuration?: InputMaybe<Scalars['interval']['input']>;
  queryStart?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
}

/** aggregate max on columns */
export interface SlowQueriesMaxFields {
  __typename?: 'slowQueriesMaxFields';
  applicationName: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  query: Maybe<Scalars['String']['output']>;
  queryStart: Maybe<Scalars['timestamptz']['output']>;
  userId: Maybe<Scalars['uuid']['output']>;
}

/** aggregate min on columns */
export interface SlowQueriesMinFields {
  __typename?: 'slowQueriesMinFields';
  applicationName: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  query: Maybe<Scalars['String']['output']>;
  queryStart: Maybe<Scalars['timestamptz']['output']>;
  userId: Maybe<Scalars['uuid']['output']>;
}

/** response of any mutation on the table "audit.slow_queries" */
export interface SlowQueriesMutationResponse {
  __typename?: 'slowQueriesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<SlowQueries>;
}

/** on_conflict condition type for table "audit.slow_queries" */
export interface SlowQueriesOnConflict {
  constraint: SlowQueriesConstraint;
  updateColumns?: Array<SlowQueriesUpdateColumn>;
  where?: InputMaybe<SlowQueriesBoolExp>;
}

/** Ordering options when selecting data from "audit.slow_queries". */
export interface SlowQueriesOrderBy {
  applicationName?: InputMaybe<OrderBy>;
  clientAddr?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  query?: InputMaybe<OrderBy>;
  queryDuration?: InputMaybe<OrderBy>;
  queryStart?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: audit.slow_queries */
export interface SlowQueriesPkColumnsInput {
  id: Scalars['uuid']['input'];
}

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
export interface SlowQueriesSetInput {
  applicationName?: InputMaybe<Scalars['String']['input']>;
  clientAddr?: InputMaybe<Scalars['inet']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryDuration?: InputMaybe<Scalars['interval']['input']>;
  queryStart?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
}

/** Streaming cursor of the table "slowQueries" */
export interface SlowQueriesStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: SlowQueriesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface SlowQueriesStreamCursorValueInput {
  applicationName?: InputMaybe<Scalars['String']['input']>;
  clientAddr?: InputMaybe<Scalars['inet']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryDuration?: InputMaybe<Scalars['interval']['input']>;
  queryStart?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
}

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

export interface SlowQueriesUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<SlowQueriesSetInput>;
  /** filter the rows which have to be updated */
  where: SlowQueriesBoolExp;
}

export interface SubscriptionRoot {
  __typename?: 'subscription_root';
  /** execute function "activate_payroll_versions" which returns "payroll_activation_results" */
  activatePayrollVersions: Array<PayrollActivationResults>;
  /** execute function "activate_payroll_versions" and query aggregates on result of table type "payroll_activation_results" */
  activatePayrollVersionsAggregate: PayrollActivationResultsAggregate;
  /** fetch data from the table: "adjustment_rules" using primary key columns */
  adjustmentRuleById: Maybe<AdjustmentRules>;
  /** An array relationship */
  adjustmentRules: Array<AdjustmentRules>;
  /** An aggregate relationship */
  adjustmentRulesAggregate: AdjustmentRulesAggregate;
  /** fetch data from the table in a streaming manner: "adjustment_rules" */
  adjustmentRulesStream: Array<AdjustmentRules>;
  /** fetch data from the table: "app_settings" using primary key columns */
  appSettingById: Maybe<AppSettings>;
  /** fetch data from the table: "app_settings" */
  appSettings: Array<AppSettings>;
  /** fetch aggregated fields from the table: "app_settings" */
  appSettingsAggregate: AppSettingsAggregate;
  /** fetch data from the table in a streaming manner: "app_settings" */
  appSettingsStream: Array<AppSettings>;
  /** fetch data from the table: "audit.audit_log" using primary key columns */
  auditLogById: Maybe<AuditLogs>;
  /** fetch data from the table: "audit.audit_log" */
  auditLogs: Array<AuditLogs>;
  /** fetch aggregated fields from the table: "audit.audit_log" */
  auditLogsAggregate: AuditLogsAggregate;
  /** fetch data from the table in a streaming manner: "audit.audit_log" */
  auditLogsStream: Array<AuditLogs>;
  /** fetch data from the table: "audit.auth_events" using primary key columns */
  authEventById: Maybe<AuthEvents>;
  /** fetch data from the table: "audit.auth_events" */
  authEvents: Array<AuthEvents>;
  /** fetch aggregated fields from the table: "audit.auth_events" */
  authEventsAggregate: AuthEventsAggregate;
  /** fetch data from the table in a streaming manner: "audit.auth_events" */
  authEventsStream: Array<AuthEvents>;
  /** fetch data from the table in a streaming manner: "neon_auth.users_sync" */
  authUsersSyncStream: Array<AuthUsersSync>;
  /** fetch data from the table: "billing_event_log" using primary key columns */
  billingEventLogById: Maybe<BillingEventLogs>;
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
  billingInvoiceById: Maybe<BillingInvoice>;
  /** fetch data from the table in a streaming manner: "billing_invoice" */
  billingInvoiceStream: Array<BillingInvoice>;
  /** An array relationship */
  billingInvoices: Array<BillingInvoices>;
  /** An aggregate relationship */
  billingInvoicesAggregate: BillingInvoicesAggregate;
  /** fetch data from the table: "billing_invoices" using primary key columns */
  billingInvoicesById: Maybe<BillingInvoices>;
  /** fetch data from the table in a streaming manner: "billing_invoices" */
  billingInvoicesStream: Array<BillingInvoices>;
  /** fetch data from the table: "billing_items" using primary key columns */
  billingItemById: Maybe<BillingItems>;
  /** An array relationship */
  billingItems: Array<BillingItems>;
  /** An aggregate relationship */
  billingItemsAggregate: BillingItemsAggregate;
  /** fetch data from the table in a streaming manner: "billing_items" */
  billingItemsStream: Array<BillingItems>;
  /** fetch data from the table: "billing_plan" using primary key columns */
  billingPlanById: Maybe<BillingPlans>;
  /** fetch data from the table: "billing_plan" */
  billingPlans: Array<BillingPlans>;
  /** fetch aggregated fields from the table: "billing_plan" */
  billingPlansAggregate: BillingPlansAggregate;
  /** fetch data from the table in a streaming manner: "billing_plan" */
  billingPlansStream: Array<BillingPlans>;
  /** fetch data from the table: "client_billing_assignment" using primary key columns */
  clientBillingAssignmentById: Maybe<ClientBillingAssignments>;
  /** An array relationship */
  clientBillingAssignments: Array<ClientBillingAssignments>;
  /** An aggregate relationship */
  clientBillingAssignmentsAggregate: ClientBillingAssignmentsAggregate;
  /** fetch data from the table in a streaming manner: "client_billing_assignment" */
  clientBillingAssignmentsStream: Array<ClientBillingAssignments>;
  /** fetch data from the table: "clients" using primary key columns */
  clientById: Maybe<Clients>;
  /** fetch data from the table: "client_external_systems" using primary key columns */
  clientExternalSystemById: Maybe<ClientExternalSystems>;
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
  dataAccessLogById: Maybe<DataAccessLogs>;
  /** fetch data from the table: "audit.data_access_log" */
  dataAccessLogs: Array<DataAccessLogs>;
  /** fetch aggregated fields from the table: "audit.data_access_log" */
  dataAccessLogsAggregate: DataAccessLogsAggregate;
  /** fetch data from the table in a streaming manner: "audit.data_access_log" */
  dataAccessLogsStream: Array<DataAccessLogs>;
  /** fetch data from the table: "external_systems" using primary key columns */
  externalSystemById: Maybe<ExternalSystems>;
  /** fetch data from the table: "external_systems" */
  externalSystems: Array<ExternalSystems>;
  /** fetch aggregated fields from the table: "external_systems" */
  externalSystemsAggregate: ExternalSystemsAggregate;
  /** fetch data from the table in a streaming manner: "external_systems" */
  externalSystemsStream: Array<ExternalSystems>;
  /** fetch data from the table: "feature_flags" using primary key columns */
  featureFlagById: Maybe<FeatureFlags>;
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
  holidayById: Maybe<Holidays>;
  /** fetch data from the table: "holidays" */
  holidays: Array<Holidays>;
  /** fetch aggregated fields from the table: "holidays" */
  holidaysAggregate: HolidaysAggregate;
  /** fetch data from the table in a streaming manner: "holidays" */
  holidaysStream: Array<Holidays>;
  /** fetch data from the table: "latest_payroll_version_results" using primary key columns */
  latestPayrollVersionResultById: Maybe<LatestPayrollVersionResults>;
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
  leaveById: Maybe<Leave>;
  /** fetch data from the table in a streaming manner: "leave" */
  leaveStream: Array<Leave>;
  /** fetch data from the table: "notes" using primary key columns */
  noteById: Maybe<Notes>;
  /** fetch data from the table: "notes" */
  notes: Array<Notes>;
  /** fetch aggregated fields from the table: "notes" */
  notesAggregate: NotesAggregate;
  /** fetch data from the table in a streaming manner: "notes" */
  notesStream: Array<Notes>;
  /** fetch data from the table: "payroll_activation_results" using primary key columns */
  payrollActivationResultById: Maybe<PayrollActivationResults>;
  /** fetch data from the table: "payroll_activation_results" */
  payrollActivationResults: Array<PayrollActivationResults>;
  /** fetch aggregated fields from the table: "payroll_activation_results" */
  payrollActivationResultsAggregate: PayrollActivationResultsAggregate;
  /** fetch data from the table in a streaming manner: "payroll_activation_results" */
  payrollActivationResultsStream: Array<PayrollActivationResults>;
  /** fetch data from the table: "payroll_assignment_audit" using primary key columns */
  payrollAssignmentAuditById: Maybe<PayrollAssignmentAudits>;
  /** An array relationship */
  payrollAssignmentAudits: Array<PayrollAssignmentAudits>;
  /** An aggregate relationship */
  payrollAssignmentAuditsAggregate: PayrollAssignmentAuditsAggregate;
  /** fetch data from the table in a streaming manner: "payroll_assignment_audit" */
  payrollAssignmentAuditsStream: Array<PayrollAssignmentAudits>;
  /** fetch data from the table: "payroll_assignments" using primary key columns */
  payrollAssignmentById: Maybe<PayrollAssignments>;
  /** fetch data from the table: "payroll_assignments" */
  payrollAssignments: Array<PayrollAssignments>;
  /** fetch aggregated fields from the table: "payroll_assignments" */
  payrollAssignmentsAggregate: PayrollAssignmentsAggregate;
  /** fetch data from the table in a streaming manner: "payroll_assignments" */
  payrollAssignmentsStream: Array<PayrollAssignments>;
  /** fetch data from the table: "payrolls" using primary key columns */
  payrollById: Maybe<Payrolls>;
  /** fetch data from the table: "payroll_cycles" using primary key columns */
  payrollCycleById: Maybe<PayrollCycles>;
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
  payrollDateById: Maybe<PayrollDates>;
  /** fetch data from the table: "payroll_date_types" using primary key columns */
  payrollDateTypeById: Maybe<PayrollDateTypes>;
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
  payrollVersionHistoryResultById: Maybe<PayrollVersionHistoryResults>;
  /** fetch data from the table: "payroll_version_history_results" */
  payrollVersionHistoryResults: Array<PayrollVersionHistoryResults>;
  /** fetch aggregated fields from the table: "payroll_version_history_results" */
  payrollVersionHistoryResultsAggregate: PayrollVersionHistoryResultsAggregate;
  /** fetch data from the table in a streaming manner: "payroll_version_history_results" */
  payrollVersionHistoryResultsStream: Array<PayrollVersionHistoryResults>;
  /** fetch data from the table: "payroll_version_results" using primary key columns */
  payrollVersionResultById: Maybe<PayrollVersionResults>;
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
  permissionAuditLogById: Maybe<PermissionAuditLogs>;
  /** fetch data from the table: "permission_audit_log" */
  permissionAuditLogs: Array<PermissionAuditLogs>;
  /** fetch aggregated fields from the table: "permission_audit_log" */
  permissionAuditLogsAggregate: PermissionAuditLogsAggregate;
  /** fetch data from the table in a streaming manner: "permission_audit_log" */
  permissionAuditLogsStream: Array<PermissionAuditLogs>;
  /** fetch data from the table: "permissions" using primary key columns */
  permissionById: Maybe<Permissions>;
  /** fetch data from the table: "audit.permission_changes" using primary key columns */
  permissionChangeById: Maybe<PermissionChanges>;
  /** fetch data from the table: "audit.permission_changes" */
  permissionChanges: Array<PermissionChanges>;
  /** fetch aggregated fields from the table: "audit.permission_changes" */
  permissionChangesAggregate: PermissionChangesAggregate;
  /** fetch data from the table in a streaming manner: "audit.permission_changes" */
  permissionChangesStream: Array<PermissionChanges>;
  /** fetch data from the table: "permission_overrides" using primary key columns */
  permissionOverrideById: Maybe<PermissionOverrides>;
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
  resourceById: Maybe<Resources>;
  /** fetch data from the table: "resources" */
  resources: Array<Resources>;
  /** fetch aggregated fields from the table: "resources" */
  resourcesAggregate: ResourcesAggregate;
  /** fetch data from the table in a streaming manner: "resources" */
  resourcesStream: Array<Resources>;
  /** fetch data from the table: "roles" using primary key columns */
  roleById: Maybe<Roles>;
  /** fetch data from the table: "role_permissions" using primary key columns */
  rolePermissionById: Maybe<RolePermissions>;
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
  slowQueryById: Maybe<SlowQueries>;
  /** fetch data from the table: "audit.user_access_summary" */
  userAccessSummaries: Array<UserAccessSummaries>;
  /** fetch aggregated fields from the table: "audit.user_access_summary" */
  userAccessSummariesAggregate: UserAccessSummariesAggregate;
  /** fetch data from the table in a streaming manner: "audit.user_access_summary" */
  userAccessSummariesStream: Array<UserAccessSummaries>;
  /** fetch data from the table: "users" using primary key columns */
  userById: Maybe<Users>;
  /** fetch data from the table: "user_invitations" using primary key columns */
  userInvitationById: Maybe<UserInvitations>;
  /** fetch data from the table: "user_invitations" */
  userInvitations: Array<UserInvitations>;
  /** fetch aggregated fields from the table: "user_invitations" */
  userInvitationsAggregate: UserInvitationsAggregate;
  /** fetch data from the table in a streaming manner: "user_invitations" */
  userInvitationsStream: Array<UserInvitations>;
  /** fetch data from the table: "user_roles" using primary key columns */
  userRoleById: Maybe<UserRoles>;
  /** fetch data from the table: "user_roles" */
  userRoles: Array<UserRoles>;
  /** fetch aggregated fields from the table: "user_roles" */
  userRolesAggregate: UserRolesAggregate;
  /** fetch data from the table in a streaming manner: "user_roles" */
  userRolesStream: Array<UserRoles>;
  /** fetch data from the table: "neon_auth.users_sync" using primary key columns */
  userSyncById: Maybe<AuthUsersSync>;
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
  workScheduleById: Maybe<WorkSchedules>;
  /** fetch data from the table: "work_schedule" */
  workSchedules: Array<WorkSchedules>;
  /** fetch aggregated fields from the table: "work_schedule" */
  workSchedulesAggregate: WorkSchedulesAggregate;
  /** fetch data from the table in a streaming manner: "work_schedule" */
  workSchedulesStream: Array<WorkSchedules>;
}


export type SubscriptionRootActivatePayrollVersionsArgs = {
  distinctOn: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type SubscriptionRootActivatePayrollVersionsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type SubscriptionRootAdjustmentRuleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootAdjustmentRulesArgs = {
  distinctOn: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where: InputMaybe<AdjustmentRulesBoolExp>;
};


export type SubscriptionRootAdjustmentRulesAggregateArgs = {
  distinctOn: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where: InputMaybe<AdjustmentRulesBoolExp>;
};


export type SubscriptionRootAdjustmentRulesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AdjustmentRulesStreamCursorInput>>;
  where: InputMaybe<AdjustmentRulesBoolExp>;
};


export type SubscriptionRootAppSettingByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionRootAppSettingsArgs = {
  distinctOn: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AppSettingsOrderBy>>;
  where: InputMaybe<AppSettingsBoolExp>;
};


export type SubscriptionRootAppSettingsAggregateArgs = {
  distinctOn: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AppSettingsOrderBy>>;
  where: InputMaybe<AppSettingsBoolExp>;
};


export type SubscriptionRootAppSettingsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AppSettingsStreamCursorInput>>;
  where: InputMaybe<AppSettingsBoolExp>;
};


export type SubscriptionRootAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootAuditLogsArgs = {
  distinctOn: InputMaybe<Array<AuditLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AuditLogsOrderBy>>;
  where: InputMaybe<AuditLogsBoolExp>;
};


export type SubscriptionRootAuditLogsAggregateArgs = {
  distinctOn: InputMaybe<Array<AuditLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AuditLogsOrderBy>>;
  where: InputMaybe<AuditLogsBoolExp>;
};


export type SubscriptionRootAuditLogsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuditLogsStreamCursorInput>>;
  where: InputMaybe<AuditLogsBoolExp>;
};


export type SubscriptionRootAuthEventByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootAuthEventsArgs = {
  distinctOn: InputMaybe<Array<AuthEventsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AuthEventsOrderBy>>;
  where: InputMaybe<AuthEventsBoolExp>;
};


export type SubscriptionRootAuthEventsAggregateArgs = {
  distinctOn: InputMaybe<Array<AuthEventsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AuthEventsOrderBy>>;
  where: InputMaybe<AuthEventsBoolExp>;
};


export type SubscriptionRootAuthEventsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuthEventsStreamCursorInput>>;
  where: InputMaybe<AuthEventsBoolExp>;
};


export type SubscriptionRootAuthUsersSyncStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuthUsersSyncStreamCursorInput>>;
  where: InputMaybe<AuthUsersSyncBoolExp>;
};


export type SubscriptionRootBillingEventLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBillingEventLogsArgs = {
  distinctOn: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where: InputMaybe<BillingEventLogsBoolExp>;
};


export type SubscriptionRootBillingEventLogsAggregateArgs = {
  distinctOn: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where: InputMaybe<BillingEventLogsBoolExp>;
};


export type SubscriptionRootBillingEventLogsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingEventLogsStreamCursorInput>>;
  where: InputMaybe<BillingEventLogsBoolExp>;
};


export type SubscriptionRootBillingInvoiceArgs = {
  distinctOn: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where: InputMaybe<BillingInvoiceBoolExp>;
};


export type SubscriptionRootBillingInvoiceAggregateArgs = {
  distinctOn: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where: InputMaybe<BillingInvoiceBoolExp>;
};


export type SubscriptionRootBillingInvoiceByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBillingInvoiceStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingInvoiceStreamCursorInput>>;
  where: InputMaybe<BillingInvoiceBoolExp>;
};


export type SubscriptionRootBillingInvoicesArgs = {
  distinctOn: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingInvoicesOrderBy>>;
  where: InputMaybe<BillingInvoicesBoolExp>;
};


export type SubscriptionRootBillingInvoicesAggregateArgs = {
  distinctOn: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingInvoicesOrderBy>>;
  where: InputMaybe<BillingInvoicesBoolExp>;
};


export type SubscriptionRootBillingInvoicesByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBillingInvoicesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingInvoicesStreamCursorInput>>;
  where: InputMaybe<BillingInvoicesBoolExp>;
};


export type SubscriptionRootBillingItemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBillingItemsArgs = {
  distinctOn: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingItemsOrderBy>>;
  where: InputMaybe<BillingItemsBoolExp>;
};


export type SubscriptionRootBillingItemsAggregateArgs = {
  distinctOn: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingItemsOrderBy>>;
  where: InputMaybe<BillingItemsBoolExp>;
};


export type SubscriptionRootBillingItemsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingItemsStreamCursorInput>>;
  where: InputMaybe<BillingItemsBoolExp>;
};


export type SubscriptionRootBillingPlanByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBillingPlansArgs = {
  distinctOn: InputMaybe<Array<BillingPlansSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingPlansOrderBy>>;
  where: InputMaybe<BillingPlansBoolExp>;
};


export type SubscriptionRootBillingPlansAggregateArgs = {
  distinctOn: InputMaybe<Array<BillingPlansSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingPlansOrderBy>>;
  where: InputMaybe<BillingPlansBoolExp>;
};


export type SubscriptionRootBillingPlansStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingPlansStreamCursorInput>>;
  where: InputMaybe<BillingPlansBoolExp>;
};


export type SubscriptionRootClientBillingAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootClientBillingAssignmentsArgs = {
  distinctOn: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


export type SubscriptionRootClientBillingAssignmentsAggregateArgs = {
  distinctOn: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


export type SubscriptionRootClientBillingAssignmentsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ClientBillingAssignmentsStreamCursorInput>>;
  where: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


export type SubscriptionRootClientByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootClientExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootClientExternalSystemsArgs = {
  distinctOn: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type SubscriptionRootClientExternalSystemsAggregateArgs = {
  distinctOn: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type SubscriptionRootClientExternalSystemsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ClientExternalSystemsStreamCursorInput>>;
  where: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type SubscriptionRootClientsArgs = {
  distinctOn: InputMaybe<Array<ClientsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientsOrderBy>>;
  where: InputMaybe<ClientsBoolExp>;
};


export type SubscriptionRootClientsAggregateArgs = {
  distinctOn: InputMaybe<Array<ClientsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ClientsOrderBy>>;
  where: InputMaybe<ClientsBoolExp>;
};


export type SubscriptionRootClientsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ClientsStreamCursorInput>>;
  where: InputMaybe<ClientsBoolExp>;
};


export type SubscriptionRootCreatePayrollVersionArgs = {
  args: CreatePayrollVersionArgs;
  distinctOn: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootCreatePayrollVersionAggregateArgs = {
  args: CreatePayrollVersionArgs;
  distinctOn: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootCreatePayrollVersionSimpleArgs = {
  args: CreatePayrollVersionSimpleArgs;
  distinctOn: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootCreatePayrollVersionSimpleAggregateArgs = {
  args: CreatePayrollVersionSimpleArgs;
  distinctOn: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootCurrentPayrollsArgs = {
  distinctOn: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where: InputMaybe<CurrentPayrollsBoolExp>;
};


export type SubscriptionRootCurrentPayrollsAggregateArgs = {
  distinctOn: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where: InputMaybe<CurrentPayrollsBoolExp>;
};


export type SubscriptionRootCurrentPayrollsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<CurrentPayrollsStreamCursorInput>>;
  where: InputMaybe<CurrentPayrollsBoolExp>;
};


export type SubscriptionRootDataAccessLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootDataAccessLogsArgs = {
  distinctOn: InputMaybe<Array<DataAccessLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<DataAccessLogsOrderBy>>;
  where: InputMaybe<DataAccessLogsBoolExp>;
};


export type SubscriptionRootDataAccessLogsAggregateArgs = {
  distinctOn: InputMaybe<Array<DataAccessLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<DataAccessLogsOrderBy>>;
  where: InputMaybe<DataAccessLogsBoolExp>;
};


export type SubscriptionRootDataAccessLogsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<DataAccessLogsStreamCursorInput>>;
  where: InputMaybe<DataAccessLogsBoolExp>;
};


export type SubscriptionRootExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootExternalSystemsArgs = {
  distinctOn: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where: InputMaybe<ExternalSystemsBoolExp>;
};


export type SubscriptionRootExternalSystemsAggregateArgs = {
  distinctOn: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where: InputMaybe<ExternalSystemsBoolExp>;
};


export type SubscriptionRootExternalSystemsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ExternalSystemsStreamCursorInput>>;
  where: InputMaybe<ExternalSystemsBoolExp>;
};


export type SubscriptionRootFeatureFlagByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootFeatureFlagsArgs = {
  distinctOn: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where: InputMaybe<FeatureFlagsBoolExp>;
};


export type SubscriptionRootFeatureFlagsAggregateArgs = {
  distinctOn: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where: InputMaybe<FeatureFlagsBoolExp>;
};


export type SubscriptionRootFeatureFlagsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<FeatureFlagsStreamCursorInput>>;
  where: InputMaybe<FeatureFlagsBoolExp>;
};


export type SubscriptionRootGeneratePayrollDatesArgs = {
  args: GeneratePayrollDatesArgs;
  distinctOn: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDatesOrderBy>>;
  where: InputMaybe<PayrollDatesBoolExp>;
};


export type SubscriptionRootGeneratePayrollDatesAggregateArgs = {
  args: GeneratePayrollDatesArgs;
  distinctOn: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDatesOrderBy>>;
  where: InputMaybe<PayrollDatesBoolExp>;
};


export type SubscriptionRootGetLatestPayrollVersionArgs = {
  args: GetLatestPayrollVersionArgs;
  distinctOn: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type SubscriptionRootGetLatestPayrollVersionAggregateArgs = {
  args: GetLatestPayrollVersionArgs;
  distinctOn: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type SubscriptionRootGetPayrollVersionHistoryArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinctOn: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type SubscriptionRootGetPayrollVersionHistoryAggregateArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinctOn: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type SubscriptionRootHolidayByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootHolidaysArgs = {
  distinctOn: InputMaybe<Array<HolidaysSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<HolidaysOrderBy>>;
  where: InputMaybe<HolidaysBoolExp>;
};


export type SubscriptionRootHolidaysAggregateArgs = {
  distinctOn: InputMaybe<Array<HolidaysSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<HolidaysOrderBy>>;
  where: InputMaybe<HolidaysBoolExp>;
};


export type SubscriptionRootHolidaysStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<HolidaysStreamCursorInput>>;
  where: InputMaybe<HolidaysBoolExp>;
};


export type SubscriptionRootLatestPayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootLatestPayrollVersionResultsArgs = {
  distinctOn: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type SubscriptionRootLatestPayrollVersionResultsAggregateArgs = {
  distinctOn: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type SubscriptionRootLatestPayrollVersionResultsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<LatestPayrollVersionResultsStreamCursorInput>>;
  where: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type SubscriptionRootLeaveArgs = {
  distinctOn: InputMaybe<Array<LeaveSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<LeaveOrderBy>>;
  where: InputMaybe<LeaveBoolExp>;
};


export type SubscriptionRootLeaveAggregateArgs = {
  distinctOn: InputMaybe<Array<LeaveSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<LeaveOrderBy>>;
  where: InputMaybe<LeaveBoolExp>;
};


export type SubscriptionRootLeaveByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootLeaveStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<LeaveStreamCursorInput>>;
  where: InputMaybe<LeaveBoolExp>;
};


export type SubscriptionRootNoteByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootNotesArgs = {
  distinctOn: InputMaybe<Array<NotesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<NotesOrderBy>>;
  where: InputMaybe<NotesBoolExp>;
};


export type SubscriptionRootNotesAggregateArgs = {
  distinctOn: InputMaybe<Array<NotesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<NotesOrderBy>>;
  where: InputMaybe<NotesBoolExp>;
};


export type SubscriptionRootNotesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<NotesStreamCursorInput>>;
  where: InputMaybe<NotesBoolExp>;
};


export type SubscriptionRootPayrollActivationResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollActivationResultsArgs = {
  distinctOn: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type SubscriptionRootPayrollActivationResultsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type SubscriptionRootPayrollActivationResultsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollActivationResultsStreamCursorInput>>;
  where: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type SubscriptionRootPayrollAssignmentAuditByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollAssignmentAuditsArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


export type SubscriptionRootPayrollAssignmentAuditsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


export type SubscriptionRootPayrollAssignmentAuditsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollAssignmentAuditsStreamCursorInput>>;
  where: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


export type SubscriptionRootPayrollAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollAssignmentsArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type SubscriptionRootPayrollAssignmentsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type SubscriptionRootPayrollAssignmentsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollAssignmentsStreamCursorInput>>;
  where: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type SubscriptionRootPayrollByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollCycleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollCyclesArgs = {
  distinctOn: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where: InputMaybe<PayrollCyclesBoolExp>;
};


export type SubscriptionRootPayrollCyclesAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where: InputMaybe<PayrollCyclesBoolExp>;
};


export type SubscriptionRootPayrollCyclesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollCyclesStreamCursorInput>>;
  where: InputMaybe<PayrollCyclesBoolExp>;
};


export type SubscriptionRootPayrollDashboardStatsArgs = {
  distinctOn: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type SubscriptionRootPayrollDashboardStatsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type SubscriptionRootPayrollDashboardStatsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollDashboardStatsStreamCursorInput>>;
  where: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type SubscriptionRootPayrollDateByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollDateTypeByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollDateTypesArgs = {
  distinctOn: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where: InputMaybe<PayrollDateTypesBoolExp>;
};


export type SubscriptionRootPayrollDateTypesAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where: InputMaybe<PayrollDateTypesBoolExp>;
};


export type SubscriptionRootPayrollDateTypesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollDateTypesStreamCursorInput>>;
  where: InputMaybe<PayrollDateTypesBoolExp>;
};


export type SubscriptionRootPayrollDatesArgs = {
  distinctOn: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDatesOrderBy>>;
  where: InputMaybe<PayrollDatesBoolExp>;
};


export type SubscriptionRootPayrollDatesAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollDatesOrderBy>>;
  where: InputMaybe<PayrollDatesBoolExp>;
};


export type SubscriptionRootPayrollDatesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollDatesStreamCursorInput>>;
  where: InputMaybe<PayrollDatesBoolExp>;
};


export type SubscriptionRootPayrollTriggersStatusArgs = {
  distinctOn: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type SubscriptionRootPayrollTriggersStatusAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type SubscriptionRootPayrollTriggersStatusStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollTriggersStatusStreamCursorInput>>;
  where: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type SubscriptionRootPayrollVersionHistoryResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollVersionHistoryResultsArgs = {
  distinctOn: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type SubscriptionRootPayrollVersionHistoryResultsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type SubscriptionRootPayrollVersionHistoryResultsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollVersionHistoryResultsStreamCursorInput>>;
  where: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type SubscriptionRootPayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollVersionResultsArgs = {
  distinctOn: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootPayrollVersionResultsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootPayrollVersionResultsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollVersionResultsStreamCursorInput>>;
  where: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootPayrollsArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};


export type SubscriptionRootPayrollsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};


export type SubscriptionRootPayrollsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollsStreamCursorInput>>;
  where: InputMaybe<PayrollsBoolExp>;
};


export type SubscriptionRootPermissionAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPermissionAuditLogsArgs = {
  distinctOn: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where: InputMaybe<PermissionAuditLogsBoolExp>;
};


export type SubscriptionRootPermissionAuditLogsAggregateArgs = {
  distinctOn: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where: InputMaybe<PermissionAuditLogsBoolExp>;
};


export type SubscriptionRootPermissionAuditLogsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PermissionAuditLogsStreamCursorInput>>;
  where: InputMaybe<PermissionAuditLogsBoolExp>;
};


export type SubscriptionRootPermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPermissionChangeByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPermissionChangesArgs = {
  distinctOn: InputMaybe<Array<PermissionChangesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionChangesOrderBy>>;
  where: InputMaybe<PermissionChangesBoolExp>;
};


export type SubscriptionRootPermissionChangesAggregateArgs = {
  distinctOn: InputMaybe<Array<PermissionChangesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionChangesOrderBy>>;
  where: InputMaybe<PermissionChangesBoolExp>;
};


export type SubscriptionRootPermissionChangesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PermissionChangesStreamCursorInput>>;
  where: InputMaybe<PermissionChangesBoolExp>;
};


export type SubscriptionRootPermissionOverrideByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPermissionOverridesArgs = {
  distinctOn: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where: InputMaybe<PermissionOverridesBoolExp>;
};


export type SubscriptionRootPermissionOverridesAggregateArgs = {
  distinctOn: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where: InputMaybe<PermissionOverridesBoolExp>;
};


export type SubscriptionRootPermissionOverridesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PermissionOverridesStreamCursorInput>>;
  where: InputMaybe<PermissionOverridesBoolExp>;
};


export type SubscriptionRootPermissionUsageReportsArgs = {
  distinctOn: InputMaybe<Array<PermissionUsageReportsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionUsageReportsOrderBy>>;
  where: InputMaybe<PermissionUsageReportsBoolExp>;
};


export type SubscriptionRootPermissionUsageReportsAggregateArgs = {
  distinctOn: InputMaybe<Array<PermissionUsageReportsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionUsageReportsOrderBy>>;
  where: InputMaybe<PermissionUsageReportsBoolExp>;
};


export type SubscriptionRootPermissionUsageReportsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PermissionUsageReportsStreamCursorInput>>;
  where: InputMaybe<PermissionUsageReportsBoolExp>;
};


export type SubscriptionRootPermissionsArgs = {
  distinctOn: InputMaybe<Array<PermissionsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionsOrderBy>>;
  where: InputMaybe<PermissionsBoolExp>;
};


export type SubscriptionRootPermissionsAggregateArgs = {
  distinctOn: InputMaybe<Array<PermissionsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionsOrderBy>>;
  where: InputMaybe<PermissionsBoolExp>;
};


export type SubscriptionRootPermissionsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PermissionsStreamCursorInput>>;
  where: InputMaybe<PermissionsBoolExp>;
};


export type SubscriptionRootResourceByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootResourcesArgs = {
  distinctOn: InputMaybe<Array<ResourcesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ResourcesOrderBy>>;
  where: InputMaybe<ResourcesBoolExp>;
};


export type SubscriptionRootResourcesAggregateArgs = {
  distinctOn: InputMaybe<Array<ResourcesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<ResourcesOrderBy>>;
  where: InputMaybe<ResourcesBoolExp>;
};


export type SubscriptionRootResourcesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ResourcesStreamCursorInput>>;
  where: InputMaybe<ResourcesBoolExp>;
};


export type SubscriptionRootRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootRolePermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootRolePermissionsArgs = {
  distinctOn: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<RolePermissionsOrderBy>>;
  where: InputMaybe<RolePermissionsBoolExp>;
};


export type SubscriptionRootRolePermissionsAggregateArgs = {
  distinctOn: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<RolePermissionsOrderBy>>;
  where: InputMaybe<RolePermissionsBoolExp>;
};


export type SubscriptionRootRolePermissionsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RolePermissionsStreamCursorInput>>;
  where: InputMaybe<RolePermissionsBoolExp>;
};


export type SubscriptionRootRolesArgs = {
  distinctOn: InputMaybe<Array<RolesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<RolesOrderBy>>;
  where: InputMaybe<RolesBoolExp>;
};


export type SubscriptionRootRolesAggregateArgs = {
  distinctOn: InputMaybe<Array<RolesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<RolesOrderBy>>;
  where: InputMaybe<RolesBoolExp>;
};


export type SubscriptionRootRolesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RolesStreamCursorInput>>;
  where: InputMaybe<RolesBoolExp>;
};


export type SubscriptionRootSlowQueriesArgs = {
  distinctOn: InputMaybe<Array<SlowQueriesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<SlowQueriesOrderBy>>;
  where: InputMaybe<SlowQueriesBoolExp>;
};


export type SubscriptionRootSlowQueriesAggregateArgs = {
  distinctOn: InputMaybe<Array<SlowQueriesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<SlowQueriesOrderBy>>;
  where: InputMaybe<SlowQueriesBoolExp>;
};


export type SubscriptionRootSlowQueriesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<SlowQueriesStreamCursorInput>>;
  where: InputMaybe<SlowQueriesBoolExp>;
};


export type SubscriptionRootSlowQueryByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootUserAccessSummariesArgs = {
  distinctOn: InputMaybe<Array<UserAccessSummariesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UserAccessSummariesOrderBy>>;
  where: InputMaybe<UserAccessSummariesBoolExp>;
};


export type SubscriptionRootUserAccessSummariesAggregateArgs = {
  distinctOn: InputMaybe<Array<UserAccessSummariesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UserAccessSummariesOrderBy>>;
  where: InputMaybe<UserAccessSummariesBoolExp>;
};


export type SubscriptionRootUserAccessSummariesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UserAccessSummariesStreamCursorInput>>;
  where: InputMaybe<UserAccessSummariesBoolExp>;
};


export type SubscriptionRootUserByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootUserInvitationByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootUserInvitationsArgs = {
  distinctOn: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UserInvitationsOrderBy>>;
  where: InputMaybe<UserInvitationsBoolExp>;
};


export type SubscriptionRootUserInvitationsAggregateArgs = {
  distinctOn: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UserInvitationsOrderBy>>;
  where: InputMaybe<UserInvitationsBoolExp>;
};


export type SubscriptionRootUserInvitationsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UserInvitationsStreamCursorInput>>;
  where: InputMaybe<UserInvitationsBoolExp>;
};


export type SubscriptionRootUserRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootUserRolesArgs = {
  distinctOn: InputMaybe<Array<UserRolesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UserRolesOrderBy>>;
  where: InputMaybe<UserRolesBoolExp>;
};


export type SubscriptionRootUserRolesAggregateArgs = {
  distinctOn: InputMaybe<Array<UserRolesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UserRolesOrderBy>>;
  where: InputMaybe<UserRolesBoolExp>;
};


export type SubscriptionRootUserRolesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UserRolesStreamCursorInput>>;
  where: InputMaybe<UserRolesBoolExp>;
};


export type SubscriptionRootUserSyncByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionRootUsersArgs = {
  distinctOn: InputMaybe<Array<UsersSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UsersOrderBy>>;
  where: InputMaybe<UsersBoolExp>;
};


export type SubscriptionRootUsersAggregateArgs = {
  distinctOn: InputMaybe<Array<UsersSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UsersOrderBy>>;
  where: InputMaybe<UsersBoolExp>;
};


export type SubscriptionRootUsersRoleBackupStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UsersRoleBackupStreamCursorInput>>;
  where: InputMaybe<UsersRoleBackupBoolExp>;
};


export type SubscriptionRootUsersRoleBackupsArgs = {
  distinctOn: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where: InputMaybe<UsersRoleBackupBoolExp>;
};


export type SubscriptionRootUsersRoleBackupsAggregateArgs = {
  distinctOn: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where: InputMaybe<UsersRoleBackupBoolExp>;
};


export type SubscriptionRootUsersStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UsersStreamCursorInput>>;
  where: InputMaybe<UsersBoolExp>;
};


export type SubscriptionRootUsersSyncArgs = {
  distinctOn: InputMaybe<Array<AuthUsersSyncSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AuthUsersSyncOrderBy>>;
  where: InputMaybe<AuthUsersSyncBoolExp>;
};


export type SubscriptionRootUsersSyncAggregateArgs = {
  distinctOn: InputMaybe<Array<AuthUsersSyncSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AuthUsersSyncOrderBy>>;
  where: InputMaybe<AuthUsersSyncBoolExp>;
};


export type SubscriptionRootWorkScheduleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootWorkSchedulesArgs = {
  distinctOn: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<WorkSchedulesOrderBy>>;
  where: InputMaybe<WorkSchedulesBoolExp>;
};


export type SubscriptionRootWorkSchedulesAggregateArgs = {
  distinctOn: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<WorkSchedulesOrderBy>>;
  where: InputMaybe<WorkSchedulesBoolExp>;
};


export type SubscriptionRootWorkSchedulesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<WorkSchedulesStreamCursorInput>>;
  where: InputMaybe<WorkSchedulesBoolExp>;
};

/** columns and relationships of "audit.user_access_summary" */
export interface UserAccessSummaries {
  __typename?: 'userAccessSummaries';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  email: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  isActive: Maybe<Scalars['Boolean']['output']>;
  isStaff: Maybe<Scalars['Boolean']['output']>;
  name: Maybe<Scalars['String']['output']>;
  role: Maybe<Scalars['user_role']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** aggregated selection of "audit.user_access_summary" */
export interface UserAccessSummariesAggregate {
  __typename?: 'userAccessSummariesAggregate';
  aggregate: Maybe<UserAccessSummariesAggregateFields>;
  nodes: Array<UserAccessSummaries>;
}

/** aggregate fields of "audit.user_access_summary" */
export interface UserAccessSummariesAggregateFields {
  __typename?: 'userAccessSummariesAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<UserAccessSummariesMaxFields>;
  min: Maybe<UserAccessSummariesMinFields>;
}


/** aggregate fields of "audit.user_access_summary" */
export type UserAccessSummariesAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<UserAccessSummariesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "audit.user_access_summary". All fields are combined with a logical 'AND'. */
export interface UserAccessSummariesBoolExp {
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
}

/** input type for inserting data into table "audit.user_access_summary" */
export interface UserAccessSummariesInsertInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isStaff?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

/** aggregate max on columns */
export interface UserAccessSummariesMaxFields {
  __typename?: 'userAccessSummariesMaxFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  email: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  role: Maybe<Scalars['user_role']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** aggregate min on columns */
export interface UserAccessSummariesMinFields {
  __typename?: 'userAccessSummariesMinFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  email: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  role: Maybe<Scalars['user_role']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** response of any mutation on the table "audit.user_access_summary" */
export interface UserAccessSummariesMutationResponse {
  __typename?: 'userAccessSummariesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<UserAccessSummaries>;
}

/** Ordering options when selecting data from "audit.user_access_summary". */
export interface UserAccessSummariesOrderBy {
  createdAt?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  isStaff?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  role?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
}

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
export interface UserAccessSummariesSetInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isStaff?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

/** Streaming cursor of the table "userAccessSummaries" */
export interface UserAccessSummariesStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: UserAccessSummariesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface UserAccessSummariesStreamCursorValueInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isStaff?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
}

export interface UserAccessSummariesUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UserAccessSummariesSetInput>;
  /** filter the rows which have to be updated */
  where: UserAccessSummariesBoolExp;
}

/** Stores invitation metadata for two-stage user invitation flow with role-based access control */
export interface UserInvitations {
  __typename?: 'userInvitations';
  acceptedAt: Maybe<Scalars['timestamptz']['output']>;
  acceptedBy: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  acceptedByUser: Maybe<Users>;
  clerkInvitationId: Maybe<Scalars['String']['output']>;
  clerkTicket: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['timestamptz']['output'];
  email: Scalars['String']['output'];
  expiresAt: Scalars['timestamptz']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  invitationMetadata: Maybe<Scalars['jsonb']['output']>;
  invitedAt: Scalars['timestamptz']['output'];
  invitedBy: Scalars['uuid']['output'];
  /** An object relationship */
  invitedByUser: Maybe<Users>;
  invitedRole: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  managerId: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  managerUser: Maybe<Users>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['timestamptz']['output'];
}


/** Stores invitation metadata for two-stage user invitation flow with role-based access control */
export type UserInvitationsInvitationMetadataArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "user_invitations" */
export interface UserInvitationsAggregate {
  __typename?: 'userInvitationsAggregate';
  aggregate: Maybe<UserInvitationsAggregateFields>;
  nodes: Array<UserInvitations>;
}

/** aggregate fields of "user_invitations" */
export interface UserInvitationsAggregateFields {
  __typename?: 'userInvitationsAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<UserInvitationsMaxFields>;
  min: Maybe<UserInvitationsMinFields>;
}


/** aggregate fields of "user_invitations" */
export type UserInvitationsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<UserInvitationsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export interface UserInvitationsAppendInput {
  invitationMetadata?: InputMaybe<Scalars['jsonb']['input']>;
}

/** Boolean expression to filter rows from the table "user_invitations". All fields are combined with a logical 'AND'. */
export interface UserInvitationsBoolExp {
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
}

/** unique or primary key constraints on table "user_invitations" */
export enum UserInvitationsConstraint {
  /** unique or primary key constraint on columns "id" */
  user_invitations_pkey = 'user_invitations_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface UserInvitationsDeleteAtPathInput {
  invitationMetadata?: InputMaybe<Array<Scalars['String']['input']>>;
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface UserInvitationsDeleteElemInput {
  invitationMetadata?: InputMaybe<Scalars['Int']['input']>;
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface UserInvitationsDeleteKeyInput {
  invitationMetadata?: InputMaybe<Scalars['String']['input']>;
}

/** input type for inserting data into table "user_invitations" */
export interface UserInvitationsInsertInput {
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
}

/** aggregate max on columns */
export interface UserInvitationsMaxFields {
  __typename?: 'userInvitationsMaxFields';
  acceptedAt: Maybe<Scalars['timestamptz']['output']>;
  acceptedBy: Maybe<Scalars['uuid']['output']>;
  clerkInvitationId: Maybe<Scalars['String']['output']>;
  clerkTicket: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  email: Maybe<Scalars['String']['output']>;
  expiresAt: Maybe<Scalars['timestamptz']['output']>;
  firstName: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  invitedAt: Maybe<Scalars['timestamptz']['output']>;
  invitedBy: Maybe<Scalars['uuid']['output']>;
  invitedRole: Maybe<Scalars['String']['output']>;
  lastName: Maybe<Scalars['String']['output']>;
  managerId: Maybe<Scalars['uuid']['output']>;
  status: Maybe<Scalars['String']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** aggregate min on columns */
export interface UserInvitationsMinFields {
  __typename?: 'userInvitationsMinFields';
  acceptedAt: Maybe<Scalars['timestamptz']['output']>;
  acceptedBy: Maybe<Scalars['uuid']['output']>;
  clerkInvitationId: Maybe<Scalars['String']['output']>;
  clerkTicket: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  email: Maybe<Scalars['String']['output']>;
  expiresAt: Maybe<Scalars['timestamptz']['output']>;
  firstName: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  invitedAt: Maybe<Scalars['timestamptz']['output']>;
  invitedBy: Maybe<Scalars['uuid']['output']>;
  invitedRole: Maybe<Scalars['String']['output']>;
  lastName: Maybe<Scalars['String']['output']>;
  managerId: Maybe<Scalars['uuid']['output']>;
  status: Maybe<Scalars['String']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
}

/** response of any mutation on the table "user_invitations" */
export interface UserInvitationsMutationResponse {
  __typename?: 'userInvitationsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<UserInvitations>;
}

/** on_conflict condition type for table "user_invitations" */
export interface UserInvitationsOnConflict {
  constraint: UserInvitationsConstraint;
  updateColumns?: Array<UserInvitationsUpdateColumn>;
  where?: InputMaybe<UserInvitationsBoolExp>;
}

/** Ordering options when selecting data from "user_invitations". */
export interface UserInvitationsOrderBy {
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
}

/** primary key columns input for table: user_invitations */
export interface UserInvitationsPkColumnsInput {
  id: Scalars['uuid']['input'];
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface UserInvitationsPrependInput {
  invitationMetadata?: InputMaybe<Scalars['jsonb']['input']>;
}

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
export interface UserInvitationsSetInput {
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
}

/** Streaming cursor of the table "userInvitations" */
export interface UserInvitationsStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: UserInvitationsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface UserInvitationsStreamCursorValueInput {
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
}

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

export interface UserInvitationsUpdates {
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
}

/** columns and relationships of "user_roles" */
export interface UserRoles {
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
}

/** aggregated selection of "user_roles" */
export interface UserRolesAggregate {
  __typename?: 'userRolesAggregate';
  aggregate: Maybe<UserRolesAggregateFields>;
  nodes: Array<UserRoles>;
}

export interface UserRolesAggregateBoolExp {
  count?: InputMaybe<UserRolesAggregateBoolExpCount>;
}

export interface UserRolesAggregateBoolExpCount {
  arguments?: InputMaybe<Array<UserRolesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UserRolesBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "user_roles" */
export interface UserRolesAggregateFields {
  __typename?: 'userRolesAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<UserRolesMaxFields>;
  min: Maybe<UserRolesMinFields>;
}


/** aggregate fields of "user_roles" */
export type UserRolesAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<UserRolesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "user_roles" */
export interface UserRolesAggregateOrderBy {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<UserRolesMaxOrderBy>;
  min?: InputMaybe<UserRolesMinOrderBy>;
}

/** input type for inserting array relation for remote table "user_roles" */
export interface UserRolesArrRelInsertInput {
  data: Array<UserRolesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<UserRolesOnConflict>;
}

/** Boolean expression to filter rows from the table "user_roles". All fields are combined with a logical 'AND'. */
export interface UserRolesBoolExp {
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
}

/** unique or primary key constraints on table "user_roles" */
export enum UserRolesConstraint {
  /** unique or primary key constraint on columns "id" */
  user_roles_pkey = 'user_roles_pkey',
  /** unique or primary key constraint on columns "user_id", "role_id" */
  user_roles_user_id_role_id_key = 'user_roles_user_id_role_id_key'
}

/** input type for inserting data into table "user_roles" */
export interface UserRolesInsertInput {
  assignedRole?: InputMaybe<RolesObjRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  roleUser?: InputMaybe<UsersObjRelInsertInput>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
}

/** aggregate max on columns */
export interface UserRolesMaxFields {
  __typename?: 'userRolesMaxFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  roleId: Maybe<Scalars['uuid']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
  userId: Maybe<Scalars['uuid']['output']>;
}

/** order by max() on columns of table "user_roles" */
export interface UserRolesMaxOrderBy {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
}

/** aggregate min on columns */
export interface UserRolesMinFields {
  __typename?: 'userRolesMinFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  roleId: Maybe<Scalars['uuid']['output']>;
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
  userId: Maybe<Scalars['uuid']['output']>;
}

/** order by min() on columns of table "user_roles" */
export interface UserRolesMinOrderBy {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
}

/** response of any mutation on the table "user_roles" */
export interface UserRolesMutationResponse {
  __typename?: 'userRolesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<UserRoles>;
}

/** on_conflict condition type for table "user_roles" */
export interface UserRolesOnConflict {
  constraint: UserRolesConstraint;
  updateColumns?: Array<UserRolesUpdateColumn>;
  where?: InputMaybe<UserRolesBoolExp>;
}

/** Ordering options when selecting data from "user_roles". */
export interface UserRolesOrderBy {
  assignedRole?: InputMaybe<RolesOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  roleUser?: InputMaybe<UsersOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
}

/** primary key columns input for table: user_roles */
export interface UserRolesPkColumnsInput {
  id: Scalars['uuid']['input'];
}

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
export interface UserRolesSetInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
}

/** Streaming cursor of the table "userRoles" */
export interface UserRolesStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: UserRolesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface UserRolesStreamCursorValueInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
}

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

export interface UserRolesUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UserRolesSetInput>;
  /** filter the rows which have to be updated */
  where: UserRolesBoolExp;
}

/** columns and relationships of "users" */
export interface Users {
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
  clerkUserId: Maybe<Scalars['String']['output']>;
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
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  /** An array relationship */
  createdBillingEvents: Array<BillingEventLogs>;
  /** An aggregate relationship */
  createdBillingEventsAggregate: BillingEventLogsAggregate;
  /** An array relationship */
  createdPermissionOverrides: Array<PermissionOverrides>;
  /** An aggregate relationship */
  createdPermissionOverridesAggregate: PermissionOverridesAggregate;
  deactivatedAt: Maybe<Scalars['timestamptz']['output']>;
  deactivatedBy: Maybe<Scalars['String']['output']>;
  /** User's email address (unique) */
  email: Scalars['String']['output'];
  /** Unique identifier for the user */
  id: Scalars['uuid']['output'];
  /** URL to the user's profile image */
  image: Maybe<Scalars['String']['output']>;
  isActive: Maybe<Scalars['Boolean']['output']>;
  /** Whether the user is a staff member (vs. external user) */
  isStaff: Maybe<Scalars['Boolean']['output']>;
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
  managerId: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  managerUser: Maybe<Users>;
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
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
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
  username: Maybe<Scalars['String']['output']>;
}


/** columns and relationships of "users" */
export type UsersAssignedRolesArgs = {
  distinctOn: InputMaybe<Array<UserRolesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UserRolesOrderBy>>;
  where: InputMaybe<UserRolesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersAssignedRolesAggregateArgs = {
  distinctOn: InputMaybe<Array<UserRolesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UserRolesOrderBy>>;
  where: InputMaybe<UserRolesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersAuthoredNotesArgs = {
  distinctOn: InputMaybe<Array<NotesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<NotesOrderBy>>;
  where: InputMaybe<NotesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersAuthoredNotesAggregateArgs = {
  distinctOn: InputMaybe<Array<NotesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<NotesOrderBy>>;
  where: InputMaybe<NotesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersBackupConsultantPayrollsArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersBackupConsultantPayrollsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersConsultantAssignmentsArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersConsultantAssignmentsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersCreatedAssignmentAuditsArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersCreatedAssignmentAuditsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersCreatedAssignmentsArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersCreatedAssignmentsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersCreatedBillingEventsArgs = {
  distinctOn: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where: InputMaybe<BillingEventLogsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersCreatedBillingEventsAggregateArgs = {
  distinctOn: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where: InputMaybe<BillingEventLogsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersCreatedPermissionOverridesArgs = {
  distinctOn: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where: InputMaybe<PermissionOverridesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersCreatedPermissionOverridesAggregateArgs = {
  distinctOn: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where: InputMaybe<PermissionOverridesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersManagedPayrollsArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersManagedPayrollsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersManagedTeamMembersArgs = {
  distinctOn: InputMaybe<Array<UsersSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UsersOrderBy>>;
  where: InputMaybe<UsersBoolExp>;
};


/** columns and relationships of "users" */
export type UsersManagedTeamMembersAggregateArgs = {
  distinctOn: InputMaybe<Array<UsersSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UsersOrderBy>>;
  where: InputMaybe<UsersBoolExp>;
};


/** columns and relationships of "users" */
export type UsersManagedUsersArgs = {
  distinctOn: InputMaybe<Array<UsersSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UsersOrderBy>>;
  where: InputMaybe<UsersBoolExp>;
};


/** columns and relationships of "users" */
export type UsersManagedUsersAggregateArgs = {
  distinctOn: InputMaybe<Array<UsersSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<UsersOrderBy>>;
  where: InputMaybe<UsersBoolExp>;
};


/** columns and relationships of "users" */
export type UsersNewConsultantAuditTrailArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersNewConsultantAuditTrailAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersOriginalConsultantAssignmentsArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersOriginalConsultantAssignmentsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersOriginalConsultantAuditTrailArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersOriginalConsultantAuditTrailAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPrimaryConsultantPayrollsArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPrimaryConsultantPayrollsAggregateArgs = {
  distinctOn: InputMaybe<Array<PayrollsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PayrollsOrderBy>>;
  where: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersTargetedPermissionAuditsArgs = {
  distinctOn: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where: InputMaybe<PermissionAuditLogsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersTargetedPermissionAuditsAggregateArgs = {
  distinctOn: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where: InputMaybe<PermissionAuditLogsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserLeaveRecordsArgs = {
  distinctOn: InputMaybe<Array<LeaveSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<LeaveOrderBy>>;
  where: InputMaybe<LeaveBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserLeaveRecordsAggregateArgs = {
  distinctOn: InputMaybe<Array<LeaveSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<LeaveOrderBy>>;
  where: InputMaybe<LeaveBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserPermissionAuditsArgs = {
  distinctOn: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where: InputMaybe<PermissionAuditLogsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserPermissionAuditsAggregateArgs = {
  distinctOn: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where: InputMaybe<PermissionAuditLogsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserPermissionOverridesArgs = {
  distinctOn: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where: InputMaybe<PermissionOverridesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserPermissionOverridesAggregateArgs = {
  distinctOn: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where: InputMaybe<PermissionOverridesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserWorkSchedulesArgs = {
  distinctOn: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<WorkSchedulesOrderBy>>;
  where: InputMaybe<WorkSchedulesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserWorkSchedulesAggregateArgs = {
  distinctOn: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<WorkSchedulesOrderBy>>;
  where: InputMaybe<WorkSchedulesBoolExp>;
};

/** aggregated selection of "users" */
export interface UsersAggregate {
  __typename?: 'usersAggregate';
  aggregate: Maybe<UsersAggregateFields>;
  nodes: Array<Users>;
}

export interface UsersAggregateBoolExp {
  bool_and?: InputMaybe<UsersAggregateBoolExpBoolAnd>;
  bool_or?: InputMaybe<UsersAggregateBoolExpBoolOr>;
  count?: InputMaybe<UsersAggregateBoolExpCount>;
}

export interface UsersAggregateBoolExpBoolAnd {
  arguments: UsersSelectColumnUsersAggregateBoolExpBoolAndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UsersBoolExp>;
  predicate: BooleanComparisonExp;
}

export interface UsersAggregateBoolExpBoolOr {
  arguments: UsersSelectColumnUsersAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UsersBoolExp>;
  predicate: BooleanComparisonExp;
}

export interface UsersAggregateBoolExpCount {
  arguments?: InputMaybe<Array<UsersSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UsersBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "users" */
export interface UsersAggregateFields {
  __typename?: 'usersAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<UsersMaxFields>;
  min: Maybe<UsersMinFields>;
}


/** aggregate fields of "users" */
export type UsersAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<UsersSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "users" */
export interface UsersAggregateOrderBy {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<UsersMaxOrderBy>;
  min?: InputMaybe<UsersMinOrderBy>;
}

/** input type for inserting array relation for remote table "users" */
export interface UsersArrRelInsertInput {
  data: Array<UsersInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<UsersOnConflict>;
}

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export interface UsersBoolExp {
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
}

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
export interface UsersInsertInput {
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
}

/** aggregate max on columns */
export interface UsersMaxFields {
  __typename?: 'usersMaxFields';
  /** External identifier from Clerk authentication service */
  clerkUserId: Maybe<Scalars['String']['output']>;
  /** Timestamp when the user was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  deactivatedAt: Maybe<Scalars['timestamptz']['output']>;
  deactivatedBy: Maybe<Scalars['String']['output']>;
  /** User's email address (unique) */
  email: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the user */
  id: Maybe<Scalars['uuid']['output']>;
  /** URL to the user's profile image */
  image: Maybe<Scalars['String']['output']>;
  /** Reference to the user's manager */
  managerId: Maybe<Scalars['uuid']['output']>;
  /** User's full name */
  name: Maybe<Scalars['String']['output']>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role: Maybe<Scalars['user_role']['output']>;
  /** Timestamp when the user was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
  /** User's unique username for login */
  username: Maybe<Scalars['String']['output']>;
}

/** order by max() on columns of table "users" */
export interface UsersMaxOrderBy {
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
}

/** aggregate min on columns */
export interface UsersMinFields {
  __typename?: 'usersMinFields';
  /** External identifier from Clerk authentication service */
  clerkUserId: Maybe<Scalars['String']['output']>;
  /** Timestamp when the user was created */
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  deactivatedAt: Maybe<Scalars['timestamptz']['output']>;
  deactivatedBy: Maybe<Scalars['String']['output']>;
  /** User's email address (unique) */
  email: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the user */
  id: Maybe<Scalars['uuid']['output']>;
  /** URL to the user's profile image */
  image: Maybe<Scalars['String']['output']>;
  /** Reference to the user's manager */
  managerId: Maybe<Scalars['uuid']['output']>;
  /** User's full name */
  name: Maybe<Scalars['String']['output']>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role: Maybe<Scalars['user_role']['output']>;
  /** Timestamp when the user was last updated */
  updatedAt: Maybe<Scalars['timestamptz']['output']>;
  /** User's unique username for login */
  username: Maybe<Scalars['String']['output']>;
}

/** order by min() on columns of table "users" */
export interface UsersMinOrderBy {
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
}

/** response of any mutation on the table "users" */
export interface UsersMutationResponse {
  __typename?: 'usersMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
}

/** input type for inserting object relation for remote table "users" */
export interface UsersObjRelInsertInput {
  data: UsersInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<UsersOnConflict>;
}

/** on_conflict condition type for table "users" */
export interface UsersOnConflict {
  constraint: UsersConstraint;
  updateColumns?: Array<UsersUpdateColumn>;
  where?: InputMaybe<UsersBoolExp>;
}

/** Ordering options when selecting data from "users". */
export interface UsersOrderBy {
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
}

/** primary key columns input for table: users */
export interface UsersPkColumnsInput {
  /** Unique identifier for the user */
  id: Scalars['uuid']['input'];
}

/** columns and relationships of "users_role_backup" */
export interface UsersRoleBackup {
  __typename?: 'usersRoleBackup';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  email: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  role: Maybe<Scalars['user_role']['output']>;
}

/** aggregated selection of "users_role_backup" */
export interface UsersRoleBackupAggregate {
  __typename?: 'usersRoleBackupAggregate';
  aggregate: Maybe<UsersRoleBackupAggregateFields>;
  nodes: Array<UsersRoleBackup>;
}

/** aggregate fields of "users_role_backup" */
export interface UsersRoleBackupAggregateFields {
  __typename?: 'usersRoleBackupAggregateFields';
  count: Scalars['Int']['output'];
  max: Maybe<UsersRoleBackupMaxFields>;
  min: Maybe<UsersRoleBackupMinFields>;
}


/** aggregate fields of "users_role_backup" */
export type UsersRoleBackupAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "users_role_backup". All fields are combined with a logical 'AND'. */
export interface UsersRoleBackupBoolExp {
  _and?: InputMaybe<Array<UsersRoleBackupBoolExp>>;
  _not?: InputMaybe<UsersRoleBackupBoolExp>;
  _or?: InputMaybe<Array<UsersRoleBackupBoolExp>>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  email?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  role?: InputMaybe<UserRoleComparisonExp>;
}

/** input type for inserting data into table "users_role_backup" */
export interface UsersRoleBackupInsertInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
}

/** aggregate max on columns */
export interface UsersRoleBackupMaxFields {
  __typename?: 'usersRoleBackupMaxFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  email: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  role: Maybe<Scalars['user_role']['output']>;
}

/** aggregate min on columns */
export interface UsersRoleBackupMinFields {
  __typename?: 'usersRoleBackupMinFields';
  createdAt: Maybe<Scalars['timestamptz']['output']>;
  email: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  role: Maybe<Scalars['user_role']['output']>;
}

/** response of any mutation on the table "users_role_backup" */
export interface UsersRoleBackupMutationResponse {
  __typename?: 'usersRoleBackupMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<UsersRoleBackup>;
}

/** Ordering options when selecting data from "users_role_backup". */
export interface UsersRoleBackupOrderBy {
  createdAt?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  role?: InputMaybe<OrderBy>;
}

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
export interface UsersRoleBackupSetInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
}

/** Streaming cursor of the table "usersRoleBackup" */
export interface UsersRoleBackupStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: UsersRoleBackupStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface UsersRoleBackupStreamCursorValueInput {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
}

export interface UsersRoleBackupUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UsersRoleBackupSetInput>;
  /** filter the rows which have to be updated */
  where: UsersRoleBackupBoolExp;
}

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
export interface UsersSetInput {
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
}

/** Streaming cursor of the table "users" */
export interface UsersStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: UsersStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface UsersStreamCursorValueInput {
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
}

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

export interface UsersUpdates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UsersSetInput>;
  /** filter the rows which have to be updated */
  where: UsersBoolExp;
}

/** columns and relationships of "work_schedule" */
export interface WorkSchedules {
  __typename?: 'workSchedules';
  /** Timestamp when the schedule entry was created */
  createdAt: Maybe<Scalars['timestamp']['output']>;
  /** Unique identifier for the work schedule entry */
  id: Scalars['uuid']['output'];
  /** An object relationship */
  scheduleOwner: Users;
  /** Timestamp when the schedule entry was last updated */
  updatedAt: Maybe<Scalars['timestamp']['output']>;
  /** Reference to the user this schedule belongs to */
  userId: Scalars['uuid']['output'];
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay: Scalars['String']['output'];
  /** Number of hours worked on this day */
  workHours: Scalars['numeric']['output'];
  /** An object relationship */
  workScheduleUser: Users;
}

/** aggregated selection of "work_schedule" */
export interface WorkSchedulesAggregate {
  __typename?: 'workSchedulesAggregate';
  aggregate: Maybe<WorkSchedulesAggregateFields>;
  nodes: Array<WorkSchedules>;
}

export interface WorkSchedulesAggregateBoolExp {
  count?: InputMaybe<WorkSchedulesAggregateBoolExpCount>;
}

export interface WorkSchedulesAggregateBoolExpCount {
  arguments?: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<WorkSchedulesBoolExp>;
  predicate: IntComparisonExp;
}

/** aggregate fields of "work_schedule" */
export interface WorkSchedulesAggregateFields {
  __typename?: 'workSchedulesAggregateFields';
  avg: Maybe<WorkSchedulesAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<WorkSchedulesMaxFields>;
  min: Maybe<WorkSchedulesMinFields>;
  stddev: Maybe<WorkSchedulesStddevFields>;
  stddevPop: Maybe<WorkSchedulesStddevPopFields>;
  stddevSamp: Maybe<WorkSchedulesStddevSampFields>;
  sum: Maybe<WorkSchedulesSumFields>;
  varPop: Maybe<WorkSchedulesVarPopFields>;
  varSamp: Maybe<WorkSchedulesVarSampFields>;
  variance: Maybe<WorkSchedulesVarianceFields>;
}


/** aggregate fields of "work_schedule" */
export type WorkSchedulesAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "work_schedule" */
export interface WorkSchedulesAggregateOrderBy {
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
}

/** input type for inserting array relation for remote table "work_schedule" */
export interface WorkSchedulesArrRelInsertInput {
  data: Array<WorkSchedulesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<WorkSchedulesOnConflict>;
}

/** aggregate avg on columns */
export interface WorkSchedulesAvgFields {
  __typename?: 'workSchedulesAvgFields';
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars['Float']['output']>;
}

/** order by avg() on columns of table "work_schedule" */
export interface WorkSchedulesAvgOrderBy {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
}

/** Boolean expression to filter rows from the table "work_schedule". All fields are combined with a logical 'AND'. */
export interface WorkSchedulesBoolExp {
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
}

/** unique or primary key constraints on table "work_schedule" */
export enum WorkSchedulesConstraint {
  /** unique or primary key constraint on columns "user_id", "work_day" */
  unique_user_work_day = 'unique_user_work_day',
  /** unique or primary key constraint on columns "id" */
  work_schedule_pkey = 'work_schedule_pkey'
}

/** input type for incrementing numeric columns in table "work_schedule" */
export interface WorkSchedulesIncInput {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<Scalars['numeric']['input']>;
}

/** input type for inserting data into table "work_schedule" */
export interface WorkSchedulesInsertInput {
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
}

/** aggregate max on columns */
export interface WorkSchedulesMaxFields {
  __typename?: 'workSchedulesMaxFields';
  /** Timestamp when the schedule entry was created */
  createdAt: Maybe<Scalars['timestamp']['output']>;
  /** Unique identifier for the work schedule entry */
  id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt: Maybe<Scalars['timestamp']['output']>;
  /** Reference to the user this schedule belongs to */
  userId: Maybe<Scalars['uuid']['output']>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay: Maybe<Scalars['String']['output']>;
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars['numeric']['output']>;
}

/** order by max() on columns of table "work_schedule" */
export interface WorkSchedulesMaxOrderBy {
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
}

/** aggregate min on columns */
export interface WorkSchedulesMinFields {
  __typename?: 'workSchedulesMinFields';
  /** Timestamp when the schedule entry was created */
  createdAt: Maybe<Scalars['timestamp']['output']>;
  /** Unique identifier for the work schedule entry */
  id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt: Maybe<Scalars['timestamp']['output']>;
  /** Reference to the user this schedule belongs to */
  userId: Maybe<Scalars['uuid']['output']>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay: Maybe<Scalars['String']['output']>;
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars['numeric']['output']>;
}

/** order by min() on columns of table "work_schedule" */
export interface WorkSchedulesMinOrderBy {
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
}

/** response of any mutation on the table "work_schedule" */
export interface WorkSchedulesMutationResponse {
  __typename?: 'workSchedulesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<WorkSchedules>;
}

/** on_conflict condition type for table "work_schedule" */
export interface WorkSchedulesOnConflict {
  constraint: WorkSchedulesConstraint;
  updateColumns?: Array<WorkSchedulesUpdateColumn>;
  where?: InputMaybe<WorkSchedulesBoolExp>;
}

/** Ordering options when selecting data from "work_schedule". */
export interface WorkSchedulesOrderBy {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  scheduleOwner?: InputMaybe<UsersOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  workDay?: InputMaybe<OrderBy>;
  workHours?: InputMaybe<OrderBy>;
  workScheduleUser?: InputMaybe<UsersOrderBy>;
}

/** primary key columns input for table: work_schedule */
export interface WorkSchedulesPkColumnsInput {
  /** Unique identifier for the work schedule entry */
  id: Scalars['uuid']['input'];
}

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
export interface WorkSchedulesSetInput {
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
}

/** aggregate stddev on columns */
export interface WorkSchedulesStddevFields {
  __typename?: 'workSchedulesStddevFields';
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars['Float']['output']>;
}

/** order by stddev() on columns of table "work_schedule" */
export interface WorkSchedulesStddevOrderBy {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
}

/** aggregate stddevPop on columns */
export interface WorkSchedulesStddevPopFields {
  __typename?: 'workSchedulesStddevPopFields';
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars['Float']['output']>;
}

/** order by stddevPop() on columns of table "work_schedule" */
export interface WorkSchedulesStddevPopOrderBy {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
}

/** aggregate stddevSamp on columns */
export interface WorkSchedulesStddevSampFields {
  __typename?: 'workSchedulesStddevSampFields';
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars['Float']['output']>;
}

/** order by stddevSamp() on columns of table "work_schedule" */
export interface WorkSchedulesStddevSampOrderBy {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
}

/** Streaming cursor of the table "workSchedules" */
export interface WorkSchedulesStreamCursorInput {
  /** Stream column input with initial value */
  initialValue: WorkSchedulesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
}

/** Initial value of the column from where the streaming should start */
export interface WorkSchedulesStreamCursorValueInput {
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
}

/** aggregate sum on columns */
export interface WorkSchedulesSumFields {
  __typename?: 'workSchedulesSumFields';
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars['numeric']['output']>;
}

/** order by sum() on columns of table "work_schedule" */
export interface WorkSchedulesSumOrderBy {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
}

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

export interface WorkSchedulesUpdates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<WorkSchedulesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<WorkSchedulesSetInput>;
  /** filter the rows which have to be updated */
  where: WorkSchedulesBoolExp;
}

/** aggregate varPop on columns */
export interface WorkSchedulesVarPopFields {
  __typename?: 'workSchedulesVarPopFields';
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars['Float']['output']>;
}

/** order by varPop() on columns of table "work_schedule" */
export interface WorkSchedulesVarPopOrderBy {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
}

/** aggregate varSamp on columns */
export interface WorkSchedulesVarSampFields {
  __typename?: 'workSchedulesVarSampFields';
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars['Float']['output']>;
}

/** order by varSamp() on columns of table "work_schedule" */
export interface WorkSchedulesVarSampOrderBy {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
}

/** aggregate variance on columns */
export interface WorkSchedulesVarianceFields {
  __typename?: 'workSchedulesVarianceFields';
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars['Float']['output']>;
}

/** order by variance() on columns of table "work_schedule" */
export interface WorkSchedulesVarianceOrderBy {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
}
