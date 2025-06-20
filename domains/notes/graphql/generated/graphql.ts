/* eslint-disable */
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
 * Generated: 2025-06-20T22:36:15.621Z
 * Schema Version: Latest from Hasura
 * CodeGen Version: Unified v2.0
 */

/* 
 * DOMAIN: NOTES
 * SECURITY LEVEL: MEDIUM
 * ACCESS CONTROLS: Authentication + Basic Audit
 * AUTO-EXPORTED: This file is automatically exported from domain index
 */


import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  leave_status_enum: { input: LeaveStatusEnum; output: LeaveStatusEnum; }
  name: { input: string; output: string; }
  numeric: { input: number; output: number; }
  payroll_cycle_type: { input: PayrollCycleType; output: PayrollCycleType; }
  payroll_date_type: { input: PayrollDateType; output: PayrollDateType; }
  payroll_status: { input: PayrollStatus; output: PayrollStatus; }
  permission_action: { input: string; output: string; }
  timestamp: { input: string; output: string; }
  timestamptz: { input: string; output: string; }
  user_role: { input: UserRole; output: UserRole; }
  uuid: { input: string; output: string; }
};

export type AffectedAssignment = {
  __typename: 'AffectedAssignment';
  adjusted_eft_date: Scalars['String']['output'];
  id: Scalars['String']['output'];
  new_consultant_id: Scalars['String']['output'];
  original_consultant_id: Scalars['String']['output'];
  payroll_date_id: Scalars['String']['output'];
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
  __typename: 'AuditEventResponse';
  eventId: Maybe<Scalars['String']['output']>;
  message: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type BooleanComparisonExp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

export type CommitPayrollAssignmentsOutput = {
  __typename: 'CommitPayrollAssignmentsOutput';
  affected_assignments: Maybe<Array<AffectedAssignment>>;
  errors: Maybe<Array<Scalars['String']['output']>>;
  message: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ComplianceReportInput = {
  endDate: Scalars['String']['input'];
  includeDetails?: InputMaybe<Scalars['Boolean']['input']>;
  reportType: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export type ComplianceReportResponse = {
  __typename: 'ComplianceReportResponse';
  generatedAt: Scalars['String']['output'];
  reportUrl: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  summary: Maybe<Scalars['json']['output']>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type IntComparisonExp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type PayrollAssignmentInput = {
  date: Scalars['String']['input'];
  fromConsultantId: Scalars['String']['input'];
  payrollId: Scalars['String']['input'];
  toConsultantId: Scalars['String']['input'];
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type StringArrayComparisonExp = {
  /** is the array contained in the given array value */
  _contained_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the array contain the given value */
  _contains?: InputMaybe<Array<Scalars['String']['input']>>;
  _eq?: InputMaybe<Array<Scalars['String']['input']>>;
  _gt?: InputMaybe<Array<Scalars['String']['input']>>;
  _gte?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Array<Scalars['String']['input']>>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
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
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
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
  __typename: 'SuspiciousActivityResponse';
  events: Maybe<Array<SuspiciousEvent>>;
  message: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  suspicious: Scalars['Boolean']['output'];
};

export type SuspiciousEvent = {
  __typename: 'SuspiciousEvent';
  count: Scalars['Int']['output'];
  eventType: Scalars['String']['output'];
  severity: Scalars['String']['output'];
  timeframe: Scalars['String']['output'];
};

/** A union of all types that use the @key directive */
export type Entity = AdjustmentRules | ClientExternalSystems | Clients | ExternalSystems | Holidays | Leave | Notes | PayrollCycles | PayrollDateTypes | PayrollDates | Payrolls | Users | WorkSchedule;

export type Service = {
  __typename: '_Service';
  /** SDL representation of schema */
  sdl: Scalars['String']['output'];
};

/** columns and relationships of "adjustment_rules" */
export type AdjustmentRules = {
  __typename: 'adjustment_rules';
  /** Timestamp when the rule was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Reference to the payroll cycle this rule applies to */
  cycle_id: Scalars['uuid']['output'];
  /** Reference to the payroll date type this rule affects */
  date_type_id: Scalars['uuid']['output'];
  /** Unique identifier for the adjustment rule */
  id: Scalars['uuid']['output'];
  /** An object relationship */
  payroll_cycle: PayrollCycles;
  /** An object relationship */
  payroll_date_type: PayrollDateTypes;
  /** Code/formula used to calculate date adjustments */
  rule_code: Scalars['String']['output'];
  /** Human-readable description of the adjustment rule */
  rule_description: Scalars['String']['output'];
  /** Timestamp when the rule was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "adjustment_rules" */
export type AdjustmentRulesAggregate = {
  __typename: 'adjustment_rules_aggregate';
  aggregate: Maybe<AdjustmentRulesAggregateFields>;
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
  __typename: 'adjustment_rules_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<AdjustmentRulesMaxFields>;
  min: Maybe<AdjustmentRulesMinFields>;
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
  on_conflict?: InputMaybe<AdjustmentRulesOnConflict>;
};

/** Boolean expression to filter rows from the table "adjustment_rules". All fields are combined with a logical 'AND'. */
export type AdjustmentRulesBoolExp = {
  _and?: InputMaybe<Array<AdjustmentRulesBoolExp>>;
  _not?: InputMaybe<AdjustmentRulesBoolExp>;
  _or?: InputMaybe<Array<AdjustmentRulesBoolExp>>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  cycle_id?: InputMaybe<UuidComparisonExp>;
  date_type_id?: InputMaybe<UuidComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  payroll_cycle?: InputMaybe<PayrollCyclesBoolExp>;
  payroll_date_type?: InputMaybe<PayrollDateTypesBoolExp>;
  rule_code?: InputMaybe<StringComparisonExp>;
  rule_description?: InputMaybe<StringComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
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
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Reference to the payroll cycle this rule applies to */
  cycle_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll date type this rule affects */
  date_type_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Unique identifier for the adjustment rule */
  id?: InputMaybe<Scalars['uuid']['input']>;
  payroll_cycle?: InputMaybe<PayrollCyclesObjRelInsertInput>;
  payroll_date_type?: InputMaybe<PayrollDateTypesObjRelInsertInput>;
  /** Code/formula used to calculate date adjustments */
  rule_code?: InputMaybe<Scalars['String']['input']>;
  /** Human-readable description of the adjustment rule */
  rule_description?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the rule was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type AdjustmentRulesMaxFields = {
  __typename: 'adjustment_rules_max_fields';
  /** Timestamp when the rule was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Reference to the payroll cycle this rule applies to */
  cycle_id: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll date type this rule affects */
  date_type_id: Maybe<Scalars['uuid']['output']>;
  /** Unique identifier for the adjustment rule */
  id: Maybe<Scalars['uuid']['output']>;
  /** Code/formula used to calculate date adjustments */
  rule_code: Maybe<Scalars['String']['output']>;
  /** Human-readable description of the adjustment rule */
  rule_description: Maybe<Scalars['String']['output']>;
  /** Timestamp when the rule was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "adjustment_rules" */
export type AdjustmentRulesMaxOrderBy = {
  /** Timestamp when the rule was created */
  created_at?: InputMaybe<OrderBy>;
  /** Reference to the payroll cycle this rule applies to */
  cycle_id?: InputMaybe<OrderBy>;
  /** Reference to the payroll date type this rule affects */
  date_type_id?: InputMaybe<OrderBy>;
  /** Unique identifier for the adjustment rule */
  id?: InputMaybe<OrderBy>;
  /** Code/formula used to calculate date adjustments */
  rule_code?: InputMaybe<OrderBy>;
  /** Human-readable description of the adjustment rule */
  rule_description?: InputMaybe<OrderBy>;
  /** Timestamp when the rule was last updated */
  updated_at?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type AdjustmentRulesMinFields = {
  __typename: 'adjustment_rules_min_fields';
  /** Timestamp when the rule was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Reference to the payroll cycle this rule applies to */
  cycle_id: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll date type this rule affects */
  date_type_id: Maybe<Scalars['uuid']['output']>;
  /** Unique identifier for the adjustment rule */
  id: Maybe<Scalars['uuid']['output']>;
  /** Code/formula used to calculate date adjustments */
  rule_code: Maybe<Scalars['String']['output']>;
  /** Human-readable description of the adjustment rule */
  rule_description: Maybe<Scalars['String']['output']>;
  /** Timestamp when the rule was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "adjustment_rules" */
export type AdjustmentRulesMinOrderBy = {
  /** Timestamp when the rule was created */
  created_at?: InputMaybe<OrderBy>;
  /** Reference to the payroll cycle this rule applies to */
  cycle_id?: InputMaybe<OrderBy>;
  /** Reference to the payroll date type this rule affects */
  date_type_id?: InputMaybe<OrderBy>;
  /** Unique identifier for the adjustment rule */
  id?: InputMaybe<OrderBy>;
  /** Code/formula used to calculate date adjustments */
  rule_code?: InputMaybe<OrderBy>;
  /** Human-readable description of the adjustment rule */
  rule_description?: InputMaybe<OrderBy>;
  /** Timestamp when the rule was last updated */
  updated_at?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "adjustment_rules" */
export type AdjustmentRulesMutationResponse = {
  __typename: 'adjustment_rules_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AdjustmentRules>;
};

/** on_conflict condition type for table "adjustment_rules" */
export type AdjustmentRulesOnConflict = {
  constraint: AdjustmentRulesConstraint;
  update_columns?: Array<AdjustmentRulesUpdateColumn>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};

/** Ordering options when selecting data from "adjustment_rules". */
export type AdjustmentRulesOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  cycle_id?: InputMaybe<OrderBy>;
  date_type_id?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payroll_cycle?: InputMaybe<PayrollCyclesOrderBy>;
  payroll_date_type?: InputMaybe<PayrollDateTypesOrderBy>;
  rule_code?: InputMaybe<OrderBy>;
  rule_description?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: adjustment_rules */
export type AdjustmentRulesPkColumnsInput = {
  /** Unique identifier for the adjustment rule */
  id: Scalars['uuid']['input'];
};

/** select columns of table "adjustment_rules" */
export enum AdjustmentRulesSelectColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  cycle_id = 'cycle_id',
  /** column name */
  date_type_id = 'date_type_id',
  /** column name */
  id = 'id',
  /** column name */
  rule_code = 'rule_code',
  /** column name */
  rule_description = 'rule_description',
  /** column name */
  updated_at = 'updated_at'
}

/** input type for updating data in table "adjustment_rules" */
export type AdjustmentRulesSetInput = {
  /** Timestamp when the rule was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Reference to the payroll cycle this rule applies to */
  cycle_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll date type this rule affects */
  date_type_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Unique identifier for the adjustment rule */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Code/formula used to calculate date adjustments */
  rule_code?: InputMaybe<Scalars['String']['input']>;
  /** Human-readable description of the adjustment rule */
  rule_description?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the rule was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "adjustment_rules" */
export type AdjustmentRulesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: AdjustmentRulesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AdjustmentRulesStreamCursorValueInput = {
  /** Timestamp when the rule was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Reference to the payroll cycle this rule applies to */
  cycle_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll date type this rule affects */
  date_type_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Unique identifier for the adjustment rule */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Code/formula used to calculate date adjustments */
  rule_code?: InputMaybe<Scalars['String']['input']>;
  /** Human-readable description of the adjustment rule */
  rule_description?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the rule was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "adjustment_rules" */
export enum AdjustmentRulesUpdateColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  cycle_id = 'cycle_id',
  /** column name */
  date_type_id = 'date_type_id',
  /** column name */
  id = 'id',
  /** column name */
  rule_code = 'rule_code',
  /** column name */
  rule_description = 'rule_description',
  /** column name */
  updated_at = 'updated_at'
}

export type AdjustmentRulesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AdjustmentRulesSetInput>;
  /** filter the rows which have to be updated */
  where: AdjustmentRulesBoolExp;
};

/** columns and relationships of "app_settings" */
export type AppSettings = {
  __typename: 'app_settings';
  /** Unique identifier for application setting */
  id: Scalars['String']['output'];
  /** JSON structure containing application permission configurations */
  permissions: Maybe<Scalars['jsonb']['output']>;
};


/** columns and relationships of "app_settings" */
export type AppSettingsPermissionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "app_settings" */
export type AppSettingsAggregate = {
  __typename: 'app_settings_aggregate';
  aggregate: Maybe<AppSettingsAggregateFields>;
  nodes: Array<AppSettings>;
};

/** aggregate fields of "app_settings" */
export type AppSettingsAggregateFields = {
  __typename: 'app_settings_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<AppSettingsMaxFields>;
  min: Maybe<AppSettingsMinFields>;
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
  __typename: 'app_settings_max_fields';
  /** Unique identifier for application setting */
  id: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type AppSettingsMinFields = {
  __typename: 'app_settings_min_fields';
  /** Unique identifier for application setting */
  id: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "app_settings" */
export type AppSettingsMutationResponse = {
  __typename: 'app_settings_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AppSettings>;
};

/** on_conflict condition type for table "app_settings" */
export type AppSettingsOnConflict = {
  constraint: AppSettingsConstraint;
  update_columns?: Array<AppSettingsUpdateColumn>;
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

/** Streaming cursor of the table "app_settings" */
export type AppSettingsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: AppSettingsStreamCursorValueInput;
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
  _delete_at_path?: InputMaybe<AppSettingsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<AppSettingsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<AppSettingsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<AppSettingsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AppSettingsSetInput>;
  /** filter the rows which have to be updated */
  where: AppSettingsBoolExp;
};

/** columns and relationships of "audit.audit_log" */
export type AuditAuditLog = {
  __typename: 'audit_audit_log';
  action: Scalars['String']['output'];
  created_at: Maybe<Scalars['timestamptz']['output']>;
  error_message: Maybe<Scalars['String']['output']>;
  event_time: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  ip_address: Maybe<Scalars['inet']['output']>;
  metadata: Maybe<Scalars['jsonb']['output']>;
  new_values: Maybe<Scalars['jsonb']['output']>;
  old_values: Maybe<Scalars['jsonb']['output']>;
  request_id: Maybe<Scalars['String']['output']>;
  resource_id: Maybe<Scalars['String']['output']>;
  resource_type: Scalars['String']['output'];
  session_id: Maybe<Scalars['String']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  user_agent: Maybe<Scalars['String']['output']>;
  user_email: Maybe<Scalars['String']['output']>;
  user_id: Maybe<Scalars['uuid']['output']>;
  user_role: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "audit.audit_log" */
export type AuditAuditLogMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit.audit_log" */
export type AuditAuditLogNewValuesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit.audit_log" */
export type AuditAuditLogOldValuesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit.audit_log" */
export type AuditAuditLogAggregate = {
  __typename: 'audit_audit_log_aggregate';
  aggregate: Maybe<AuditAuditLogAggregateFields>;
  nodes: Array<AuditAuditLog>;
};

/** aggregate fields of "audit.audit_log" */
export type AuditAuditLogAggregateFields = {
  __typename: 'audit_audit_log_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<AuditAuditLogMaxFields>;
  min: Maybe<AuditAuditLogMinFields>;
};


/** aggregate fields of "audit.audit_log" */
export type AuditAuditLogAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AuditAuditLogSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuditAuditLogAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  new_values?: InputMaybe<Scalars['jsonb']['input']>;
  old_values?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "audit.audit_log". All fields are combined with a logical 'AND'. */
export type AuditAuditLogBoolExp = {
  _and?: InputMaybe<Array<AuditAuditLogBoolExp>>;
  _not?: InputMaybe<AuditAuditLogBoolExp>;
  _or?: InputMaybe<Array<AuditAuditLogBoolExp>>;
  action?: InputMaybe<StringComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  error_message?: InputMaybe<StringComparisonExp>;
  event_time?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  ip_address?: InputMaybe<InetComparisonExp>;
  metadata?: InputMaybe<JsonbComparisonExp>;
  new_values?: InputMaybe<JsonbComparisonExp>;
  old_values?: InputMaybe<JsonbComparisonExp>;
  request_id?: InputMaybe<StringComparisonExp>;
  resource_id?: InputMaybe<StringComparisonExp>;
  resource_type?: InputMaybe<StringComparisonExp>;
  session_id?: InputMaybe<StringComparisonExp>;
  success?: InputMaybe<BooleanComparisonExp>;
  user_agent?: InputMaybe<StringComparisonExp>;
  user_email?: InputMaybe<StringComparisonExp>;
  user_id?: InputMaybe<UuidComparisonExp>;
  user_role?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "audit.audit_log" */
export enum AuditAuditLogConstraint {
  /** unique or primary key constraint on columns "id" */
  audit_log_pkey = 'audit_log_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AuditAuditLogDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
  new_values?: InputMaybe<Array<Scalars['String']['input']>>;
  old_values?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AuditAuditLogDeleteElemInput = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
  new_values?: InputMaybe<Scalars['Int']['input']>;
  old_values?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AuditAuditLogDeleteKeyInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
  new_values?: InputMaybe<Scalars['String']['input']>;
  old_values?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "audit.audit_log" */
export type AuditAuditLogInsertInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  error_message?: InputMaybe<Scalars['String']['input']>;
  event_time?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  new_values?: InputMaybe<Scalars['jsonb']['input']>;
  old_values?: InputMaybe<Scalars['jsonb']['input']>;
  request_id?: InputMaybe<Scalars['String']['input']>;
  resource_id?: InputMaybe<Scalars['String']['input']>;
  resource_type?: InputMaybe<Scalars['String']['input']>;
  session_id?: InputMaybe<Scalars['String']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
  user_email?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
  user_role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type AuditAuditLogMaxFields = {
  __typename: 'audit_audit_log_max_fields';
  action: Maybe<Scalars['String']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  error_message: Maybe<Scalars['String']['output']>;
  event_time: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  request_id: Maybe<Scalars['String']['output']>;
  resource_id: Maybe<Scalars['String']['output']>;
  resource_type: Maybe<Scalars['String']['output']>;
  session_id: Maybe<Scalars['String']['output']>;
  user_agent: Maybe<Scalars['String']['output']>;
  user_email: Maybe<Scalars['String']['output']>;
  user_id: Maybe<Scalars['uuid']['output']>;
  user_role: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type AuditAuditLogMinFields = {
  __typename: 'audit_audit_log_min_fields';
  action: Maybe<Scalars['String']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  error_message: Maybe<Scalars['String']['output']>;
  event_time: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  request_id: Maybe<Scalars['String']['output']>;
  resource_id: Maybe<Scalars['String']['output']>;
  resource_type: Maybe<Scalars['String']['output']>;
  session_id: Maybe<Scalars['String']['output']>;
  user_agent: Maybe<Scalars['String']['output']>;
  user_email: Maybe<Scalars['String']['output']>;
  user_id: Maybe<Scalars['uuid']['output']>;
  user_role: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "audit.audit_log" */
export type AuditAuditLogMutationResponse = {
  __typename: 'audit_audit_log_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuditAuditLog>;
};

/** on_conflict condition type for table "audit.audit_log" */
export type AuditAuditLogOnConflict = {
  constraint: AuditAuditLogConstraint;
  update_columns?: Array<AuditAuditLogUpdateColumn>;
  where?: InputMaybe<AuditAuditLogBoolExp>;
};

/** Ordering options when selecting data from "audit.audit_log". */
export type AuditAuditLogOrderBy = {
  action?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  error_message?: InputMaybe<OrderBy>;
  event_time?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  ip_address?: InputMaybe<OrderBy>;
  metadata?: InputMaybe<OrderBy>;
  new_values?: InputMaybe<OrderBy>;
  old_values?: InputMaybe<OrderBy>;
  request_id?: InputMaybe<OrderBy>;
  resource_id?: InputMaybe<OrderBy>;
  resource_type?: InputMaybe<OrderBy>;
  session_id?: InputMaybe<OrderBy>;
  success?: InputMaybe<OrderBy>;
  user_agent?: InputMaybe<OrderBy>;
  user_email?: InputMaybe<OrderBy>;
  user_id?: InputMaybe<OrderBy>;
  user_role?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: audit.audit_log */
export type AuditAuditLogPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuditAuditLogPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  new_values?: InputMaybe<Scalars['jsonb']['input']>;
  old_values?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit.audit_log" */
export enum AuditAuditLogSelectColumn {
  /** column name */
  action = 'action',
  /** column name */
  created_at = 'created_at',
  /** column name */
  error_message = 'error_message',
  /** column name */
  event_time = 'event_time',
  /** column name */
  id = 'id',
  /** column name */
  ip_address = 'ip_address',
  /** column name */
  metadata = 'metadata',
  /** column name */
  new_values = 'new_values',
  /** column name */
  old_values = 'old_values',
  /** column name */
  request_id = 'request_id',
  /** column name */
  resource_id = 'resource_id',
  /** column name */
  resource_type = 'resource_type',
  /** column name */
  session_id = 'session_id',
  /** column name */
  success = 'success',
  /** column name */
  user_agent = 'user_agent',
  /** column name */
  user_email = 'user_email',
  /** column name */
  user_id = 'user_id',
  /** column name */
  user_role = 'user_role'
}

/** input type for updating data in table "audit.audit_log" */
export type AuditAuditLogSetInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  error_message?: InputMaybe<Scalars['String']['input']>;
  event_time?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  new_values?: InputMaybe<Scalars['jsonb']['input']>;
  old_values?: InputMaybe<Scalars['jsonb']['input']>;
  request_id?: InputMaybe<Scalars['String']['input']>;
  resource_id?: InputMaybe<Scalars['String']['input']>;
  resource_type?: InputMaybe<Scalars['String']['input']>;
  session_id?: InputMaybe<Scalars['String']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
  user_email?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
  user_role?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "audit_audit_log" */
export type AuditAuditLogStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: AuditAuditLogStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AuditAuditLogStreamCursorValueInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  error_message?: InputMaybe<Scalars['String']['input']>;
  event_time?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  new_values?: InputMaybe<Scalars['jsonb']['input']>;
  old_values?: InputMaybe<Scalars['jsonb']['input']>;
  request_id?: InputMaybe<Scalars['String']['input']>;
  resource_id?: InputMaybe<Scalars['String']['input']>;
  resource_type?: InputMaybe<Scalars['String']['input']>;
  session_id?: InputMaybe<Scalars['String']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
  user_email?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
  user_role?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "audit.audit_log" */
export enum AuditAuditLogUpdateColumn {
  /** column name */
  action = 'action',
  /** column name */
  created_at = 'created_at',
  /** column name */
  error_message = 'error_message',
  /** column name */
  event_time = 'event_time',
  /** column name */
  id = 'id',
  /** column name */
  ip_address = 'ip_address',
  /** column name */
  metadata = 'metadata',
  /** column name */
  new_values = 'new_values',
  /** column name */
  old_values = 'old_values',
  /** column name */
  request_id = 'request_id',
  /** column name */
  resource_id = 'resource_id',
  /** column name */
  resource_type = 'resource_type',
  /** column name */
  session_id = 'session_id',
  /** column name */
  success = 'success',
  /** column name */
  user_agent = 'user_agent',
  /** column name */
  user_email = 'user_email',
  /** column name */
  user_id = 'user_id',
  /** column name */
  user_role = 'user_role'
}

export type AuditAuditLogUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<AuditAuditLogAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<AuditAuditLogDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<AuditAuditLogDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<AuditAuditLogDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<AuditAuditLogPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuditAuditLogSetInput>;
  /** filter the rows which have to be updated */
  where: AuditAuditLogBoolExp;
};

/** columns and relationships of "audit.auth_events" */
export type AuditAuthEvents = {
  __typename: 'audit_auth_events';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  event_time: Scalars['timestamptz']['output'];
  event_type: Scalars['String']['output'];
  failure_reason: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  ip_address: Maybe<Scalars['inet']['output']>;
  metadata: Maybe<Scalars['jsonb']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  user_agent: Maybe<Scalars['String']['output']>;
  user_email: Maybe<Scalars['String']['output']>;
  user_id: Maybe<Scalars['uuid']['output']>;
};


/** columns and relationships of "audit.auth_events" */
export type AuditAuthEventsMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit.auth_events" */
export type AuditAuthEventsAggregate = {
  __typename: 'audit_auth_events_aggregate';
  aggregate: Maybe<AuditAuthEventsAggregateFields>;
  nodes: Array<AuditAuthEvents>;
};

/** aggregate fields of "audit.auth_events" */
export type AuditAuthEventsAggregateFields = {
  __typename: 'audit_auth_events_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<AuditAuthEventsMaxFields>;
  min: Maybe<AuditAuthEventsMinFields>;
};


/** aggregate fields of "audit.auth_events" */
export type AuditAuthEventsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AuditAuthEventsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuditAuthEventsAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "audit.auth_events". All fields are combined with a logical 'AND'. */
export type AuditAuthEventsBoolExp = {
  _and?: InputMaybe<Array<AuditAuthEventsBoolExp>>;
  _not?: InputMaybe<AuditAuthEventsBoolExp>;
  _or?: InputMaybe<Array<AuditAuthEventsBoolExp>>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  event_time?: InputMaybe<TimestamptzComparisonExp>;
  event_type?: InputMaybe<StringComparisonExp>;
  failure_reason?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  ip_address?: InputMaybe<InetComparisonExp>;
  metadata?: InputMaybe<JsonbComparisonExp>;
  success?: InputMaybe<BooleanComparisonExp>;
  user_agent?: InputMaybe<StringComparisonExp>;
  user_email?: InputMaybe<StringComparisonExp>;
  user_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "audit.auth_events" */
export enum AuditAuthEventsConstraint {
  /** unique or primary key constraint on columns "id" */
  auth_events_pkey = 'auth_events_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AuditAuthEventsDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AuditAuthEventsDeleteElemInput = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AuditAuthEventsDeleteKeyInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "audit.auth_events" */
export type AuditAuthEventsInsertInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  event_time?: InputMaybe<Scalars['timestamptz']['input']>;
  event_type?: InputMaybe<Scalars['String']['input']>;
  failure_reason?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
  user_email?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type AuditAuthEventsMaxFields = {
  __typename: 'audit_auth_events_max_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  event_time: Maybe<Scalars['timestamptz']['output']>;
  event_type: Maybe<Scalars['String']['output']>;
  failure_reason: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  user_agent: Maybe<Scalars['String']['output']>;
  user_email: Maybe<Scalars['String']['output']>;
  user_id: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type AuditAuthEventsMinFields = {
  __typename: 'audit_auth_events_min_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  event_time: Maybe<Scalars['timestamptz']['output']>;
  event_type: Maybe<Scalars['String']['output']>;
  failure_reason: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  user_agent: Maybe<Scalars['String']['output']>;
  user_email: Maybe<Scalars['String']['output']>;
  user_id: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "audit.auth_events" */
export type AuditAuthEventsMutationResponse = {
  __typename: 'audit_auth_events_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuditAuthEvents>;
};

/** on_conflict condition type for table "audit.auth_events" */
export type AuditAuthEventsOnConflict = {
  constraint: AuditAuthEventsConstraint;
  update_columns?: Array<AuditAuthEventsUpdateColumn>;
  where?: InputMaybe<AuditAuthEventsBoolExp>;
};

/** Ordering options when selecting data from "audit.auth_events". */
export type AuditAuthEventsOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  event_time?: InputMaybe<OrderBy>;
  event_type?: InputMaybe<OrderBy>;
  failure_reason?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  ip_address?: InputMaybe<OrderBy>;
  metadata?: InputMaybe<OrderBy>;
  success?: InputMaybe<OrderBy>;
  user_agent?: InputMaybe<OrderBy>;
  user_email?: InputMaybe<OrderBy>;
  user_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: audit.auth_events */
export type AuditAuthEventsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuditAuthEventsPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit.auth_events" */
export enum AuditAuthEventsSelectColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  event_time = 'event_time',
  /** column name */
  event_type = 'event_type',
  /** column name */
  failure_reason = 'failure_reason',
  /** column name */
  id = 'id',
  /** column name */
  ip_address = 'ip_address',
  /** column name */
  metadata = 'metadata',
  /** column name */
  success = 'success',
  /** column name */
  user_agent = 'user_agent',
  /** column name */
  user_email = 'user_email',
  /** column name */
  user_id = 'user_id'
}

/** input type for updating data in table "audit.auth_events" */
export type AuditAuthEventsSetInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  event_time?: InputMaybe<Scalars['timestamptz']['input']>;
  event_type?: InputMaybe<Scalars['String']['input']>;
  failure_reason?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
  user_email?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "audit_auth_events" */
export type AuditAuthEventsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: AuditAuthEventsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AuditAuthEventsStreamCursorValueInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  event_time?: InputMaybe<Scalars['timestamptz']['input']>;
  event_type?: InputMaybe<Scalars['String']['input']>;
  failure_reason?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
  user_email?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "audit.auth_events" */
export enum AuditAuthEventsUpdateColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  event_time = 'event_time',
  /** column name */
  event_type = 'event_type',
  /** column name */
  failure_reason = 'failure_reason',
  /** column name */
  id = 'id',
  /** column name */
  ip_address = 'ip_address',
  /** column name */
  metadata = 'metadata',
  /** column name */
  success = 'success',
  /** column name */
  user_agent = 'user_agent',
  /** column name */
  user_email = 'user_email',
  /** column name */
  user_id = 'user_id'
}

export type AuditAuthEventsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<AuditAuthEventsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<AuditAuthEventsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<AuditAuthEventsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<AuditAuthEventsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<AuditAuthEventsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuditAuthEventsSetInput>;
  /** filter the rows which have to be updated */
  where: AuditAuthEventsBoolExp;
};

/** columns and relationships of "audit.data_access_log" */
export type AuditDataAccessLog = {
  __typename: 'audit_data_access_log';
  access_type: Scalars['String']['output'];
  accessed_at: Scalars['timestamptz']['output'];
  data_classification: Maybe<Scalars['String']['output']>;
  fields_accessed: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['uuid']['output'];
  ip_address: Maybe<Scalars['inet']['output']>;
  metadata: Maybe<Scalars['jsonb']['output']>;
  query_executed: Maybe<Scalars['String']['output']>;
  resource_id: Maybe<Scalars['String']['output']>;
  resource_type: Scalars['String']['output'];
  row_count: Maybe<Scalars['Int']['output']>;
  session_id: Maybe<Scalars['String']['output']>;
  user_id: Scalars['uuid']['output'];
};


/** columns and relationships of "audit.data_access_log" */
export type AuditDataAccessLogMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit.data_access_log" */
export type AuditDataAccessLogAggregate = {
  __typename: 'audit_data_access_log_aggregate';
  aggregate: Maybe<AuditDataAccessLogAggregateFields>;
  nodes: Array<AuditDataAccessLog>;
};

/** aggregate fields of "audit.data_access_log" */
export type AuditDataAccessLogAggregateFields = {
  __typename: 'audit_data_access_log_aggregate_fields';
  avg: Maybe<AuditDataAccessLogAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<AuditDataAccessLogMaxFields>;
  min: Maybe<AuditDataAccessLogMinFields>;
  stddev: Maybe<AuditDataAccessLogStddevFields>;
  stddev_pop: Maybe<AuditDataAccessLogStddevPopFields>;
  stddev_samp: Maybe<AuditDataAccessLogStddevSampFields>;
  sum: Maybe<AuditDataAccessLogSumFields>;
  var_pop: Maybe<AuditDataAccessLogVarPopFields>;
  var_samp: Maybe<AuditDataAccessLogVarSampFields>;
  variance: Maybe<AuditDataAccessLogVarianceFields>;
};


/** aggregate fields of "audit.data_access_log" */
export type AuditDataAccessLogAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AuditDataAccessLogSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuditDataAccessLogAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type AuditDataAccessLogAvgFields = {
  __typename: 'audit_data_access_log_avg_fields';
  row_count: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "audit.data_access_log". All fields are combined with a logical 'AND'. */
export type AuditDataAccessLogBoolExp = {
  _and?: InputMaybe<Array<AuditDataAccessLogBoolExp>>;
  _not?: InputMaybe<AuditDataAccessLogBoolExp>;
  _or?: InputMaybe<Array<AuditDataAccessLogBoolExp>>;
  access_type?: InputMaybe<StringComparisonExp>;
  accessed_at?: InputMaybe<TimestamptzComparisonExp>;
  data_classification?: InputMaybe<StringComparisonExp>;
  fields_accessed?: InputMaybe<StringArrayComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  ip_address?: InputMaybe<InetComparisonExp>;
  metadata?: InputMaybe<JsonbComparisonExp>;
  query_executed?: InputMaybe<StringComparisonExp>;
  resource_id?: InputMaybe<StringComparisonExp>;
  resource_type?: InputMaybe<StringComparisonExp>;
  row_count?: InputMaybe<IntComparisonExp>;
  session_id?: InputMaybe<StringComparisonExp>;
  user_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "audit.data_access_log" */
export enum AuditDataAccessLogConstraint {
  /** unique or primary key constraint on columns "id" */
  data_access_log_pkey = 'data_access_log_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AuditDataAccessLogDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AuditDataAccessLogDeleteElemInput = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AuditDataAccessLogDeleteKeyInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "audit.data_access_log" */
export type AuditDataAccessLogIncInput = {
  row_count?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "audit.data_access_log" */
export type AuditDataAccessLogInsertInput = {
  access_type?: InputMaybe<Scalars['String']['input']>;
  accessed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  data_classification?: InputMaybe<Scalars['String']['input']>;
  fields_accessed?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  query_executed?: InputMaybe<Scalars['String']['input']>;
  resource_id?: InputMaybe<Scalars['String']['input']>;
  resource_type?: InputMaybe<Scalars['String']['input']>;
  row_count?: InputMaybe<Scalars['Int']['input']>;
  session_id?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type AuditDataAccessLogMaxFields = {
  __typename: 'audit_data_access_log_max_fields';
  access_type: Maybe<Scalars['String']['output']>;
  accessed_at: Maybe<Scalars['timestamptz']['output']>;
  data_classification: Maybe<Scalars['String']['output']>;
  fields_accessed: Maybe<Array<Scalars['String']['output']>>;
  id: Maybe<Scalars['uuid']['output']>;
  query_executed: Maybe<Scalars['String']['output']>;
  resource_id: Maybe<Scalars['String']['output']>;
  resource_type: Maybe<Scalars['String']['output']>;
  row_count: Maybe<Scalars['Int']['output']>;
  session_id: Maybe<Scalars['String']['output']>;
  user_id: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type AuditDataAccessLogMinFields = {
  __typename: 'audit_data_access_log_min_fields';
  access_type: Maybe<Scalars['String']['output']>;
  accessed_at: Maybe<Scalars['timestamptz']['output']>;
  data_classification: Maybe<Scalars['String']['output']>;
  fields_accessed: Maybe<Array<Scalars['String']['output']>>;
  id: Maybe<Scalars['uuid']['output']>;
  query_executed: Maybe<Scalars['String']['output']>;
  resource_id: Maybe<Scalars['String']['output']>;
  resource_type: Maybe<Scalars['String']['output']>;
  row_count: Maybe<Scalars['Int']['output']>;
  session_id: Maybe<Scalars['String']['output']>;
  user_id: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "audit.data_access_log" */
export type AuditDataAccessLogMutationResponse = {
  __typename: 'audit_data_access_log_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuditDataAccessLog>;
};

/** on_conflict condition type for table "audit.data_access_log" */
export type AuditDataAccessLogOnConflict = {
  constraint: AuditDataAccessLogConstraint;
  update_columns?: Array<AuditDataAccessLogUpdateColumn>;
  where?: InputMaybe<AuditDataAccessLogBoolExp>;
};

/** Ordering options when selecting data from "audit.data_access_log". */
export type AuditDataAccessLogOrderBy = {
  access_type?: InputMaybe<OrderBy>;
  accessed_at?: InputMaybe<OrderBy>;
  data_classification?: InputMaybe<OrderBy>;
  fields_accessed?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  ip_address?: InputMaybe<OrderBy>;
  metadata?: InputMaybe<OrderBy>;
  query_executed?: InputMaybe<OrderBy>;
  resource_id?: InputMaybe<OrderBy>;
  resource_type?: InputMaybe<OrderBy>;
  row_count?: InputMaybe<OrderBy>;
  session_id?: InputMaybe<OrderBy>;
  user_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: audit.data_access_log */
export type AuditDataAccessLogPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuditDataAccessLogPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit.data_access_log" */
export enum AuditDataAccessLogSelectColumn {
  /** column name */
  access_type = 'access_type',
  /** column name */
  accessed_at = 'accessed_at',
  /** column name */
  data_classification = 'data_classification',
  /** column name */
  fields_accessed = 'fields_accessed',
  /** column name */
  id = 'id',
  /** column name */
  ip_address = 'ip_address',
  /** column name */
  metadata = 'metadata',
  /** column name */
  query_executed = 'query_executed',
  /** column name */
  resource_id = 'resource_id',
  /** column name */
  resource_type = 'resource_type',
  /** column name */
  row_count = 'row_count',
  /** column name */
  session_id = 'session_id',
  /** column name */
  user_id = 'user_id'
}

/** input type for updating data in table "audit.data_access_log" */
export type AuditDataAccessLogSetInput = {
  access_type?: InputMaybe<Scalars['String']['input']>;
  accessed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  data_classification?: InputMaybe<Scalars['String']['input']>;
  fields_accessed?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  query_executed?: InputMaybe<Scalars['String']['input']>;
  resource_id?: InputMaybe<Scalars['String']['input']>;
  resource_type?: InputMaybe<Scalars['String']['input']>;
  row_count?: InputMaybe<Scalars['Int']['input']>;
  session_id?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type AuditDataAccessLogStddevFields = {
  __typename: 'audit_data_access_log_stddev_fields';
  row_count: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type AuditDataAccessLogStddevPopFields = {
  __typename: 'audit_data_access_log_stddev_pop_fields';
  row_count: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type AuditDataAccessLogStddevSampFields = {
  __typename: 'audit_data_access_log_stddev_samp_fields';
  row_count: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "audit_data_access_log" */
export type AuditDataAccessLogStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: AuditDataAccessLogStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AuditDataAccessLogStreamCursorValueInput = {
  access_type?: InputMaybe<Scalars['String']['input']>;
  accessed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  data_classification?: InputMaybe<Scalars['String']['input']>;
  fields_accessed?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  query_executed?: InputMaybe<Scalars['String']['input']>;
  resource_id?: InputMaybe<Scalars['String']['input']>;
  resource_type?: InputMaybe<Scalars['String']['input']>;
  row_count?: InputMaybe<Scalars['Int']['input']>;
  session_id?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type AuditDataAccessLogSumFields = {
  __typename: 'audit_data_access_log_sum_fields';
  row_count: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "audit.data_access_log" */
export enum AuditDataAccessLogUpdateColumn {
  /** column name */
  access_type = 'access_type',
  /** column name */
  accessed_at = 'accessed_at',
  /** column name */
  data_classification = 'data_classification',
  /** column name */
  fields_accessed = 'fields_accessed',
  /** column name */
  id = 'id',
  /** column name */
  ip_address = 'ip_address',
  /** column name */
  metadata = 'metadata',
  /** column name */
  query_executed = 'query_executed',
  /** column name */
  resource_id = 'resource_id',
  /** column name */
  resource_type = 'resource_type',
  /** column name */
  row_count = 'row_count',
  /** column name */
  session_id = 'session_id',
  /** column name */
  user_id = 'user_id'
}

export type AuditDataAccessLogUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<AuditDataAccessLogAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<AuditDataAccessLogDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<AuditDataAccessLogDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<AuditDataAccessLogDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<AuditDataAccessLogIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<AuditDataAccessLogPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuditDataAccessLogSetInput>;
  /** filter the rows which have to be updated */
  where: AuditDataAccessLogBoolExp;
};

/** aggregate var_pop on columns */
export type AuditDataAccessLogVarPopFields = {
  __typename: 'audit_data_access_log_var_pop_fields';
  row_count: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type AuditDataAccessLogVarSampFields = {
  __typename: 'audit_data_access_log_var_samp_fields';
  row_count: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type AuditDataAccessLogVarianceFields = {
  __typename: 'audit_data_access_log_variance_fields';
  row_count: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "audit.permission_changes" */
export type AuditPermissionChanges = {
  __typename: 'audit_permission_changes';
  approved_by_user_id: Maybe<Scalars['uuid']['output']>;
  change_type: Scalars['String']['output'];
  changed_at: Scalars['timestamptz']['output'];
  changed_by_user_id: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  metadata: Maybe<Scalars['jsonb']['output']>;
  new_permissions: Maybe<Scalars['jsonb']['output']>;
  old_permissions: Maybe<Scalars['jsonb']['output']>;
  permission_type: Maybe<Scalars['String']['output']>;
  reason: Maybe<Scalars['String']['output']>;
  target_role_id: Maybe<Scalars['uuid']['output']>;
  target_user_id: Maybe<Scalars['uuid']['output']>;
};


/** columns and relationships of "audit.permission_changes" */
export type AuditPermissionChangesMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit.permission_changes" */
export type AuditPermissionChangesNewPermissionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit.permission_changes" */
export type AuditPermissionChangesOldPermissionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit.permission_changes" */
export type AuditPermissionChangesAggregate = {
  __typename: 'audit_permission_changes_aggregate';
  aggregate: Maybe<AuditPermissionChangesAggregateFields>;
  nodes: Array<AuditPermissionChanges>;
};

/** aggregate fields of "audit.permission_changes" */
export type AuditPermissionChangesAggregateFields = {
  __typename: 'audit_permission_changes_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<AuditPermissionChangesMaxFields>;
  min: Maybe<AuditPermissionChangesMinFields>;
};


/** aggregate fields of "audit.permission_changes" */
export type AuditPermissionChangesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AuditPermissionChangesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuditPermissionChangesAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  new_permissions?: InputMaybe<Scalars['jsonb']['input']>;
  old_permissions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "audit.permission_changes". All fields are combined with a logical 'AND'. */
export type AuditPermissionChangesBoolExp = {
  _and?: InputMaybe<Array<AuditPermissionChangesBoolExp>>;
  _not?: InputMaybe<AuditPermissionChangesBoolExp>;
  _or?: InputMaybe<Array<AuditPermissionChangesBoolExp>>;
  approved_by_user_id?: InputMaybe<UuidComparisonExp>;
  change_type?: InputMaybe<StringComparisonExp>;
  changed_at?: InputMaybe<TimestamptzComparisonExp>;
  changed_by_user_id?: InputMaybe<UuidComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  metadata?: InputMaybe<JsonbComparisonExp>;
  new_permissions?: InputMaybe<JsonbComparisonExp>;
  old_permissions?: InputMaybe<JsonbComparisonExp>;
  permission_type?: InputMaybe<StringComparisonExp>;
  reason?: InputMaybe<StringComparisonExp>;
  target_role_id?: InputMaybe<UuidComparisonExp>;
  target_user_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "audit.permission_changes" */
export enum AuditPermissionChangesConstraint {
  /** unique or primary key constraint on columns "id" */
  permission_changes_pkey = 'permission_changes_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AuditPermissionChangesDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
  new_permissions?: InputMaybe<Array<Scalars['String']['input']>>;
  old_permissions?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AuditPermissionChangesDeleteElemInput = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
  new_permissions?: InputMaybe<Scalars['Int']['input']>;
  old_permissions?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AuditPermissionChangesDeleteKeyInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
  new_permissions?: InputMaybe<Scalars['String']['input']>;
  old_permissions?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "audit.permission_changes" */
export type AuditPermissionChangesInsertInput = {
  approved_by_user_id?: InputMaybe<Scalars['uuid']['input']>;
  change_type?: InputMaybe<Scalars['String']['input']>;
  changed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  changed_by_user_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  new_permissions?: InputMaybe<Scalars['jsonb']['input']>;
  old_permissions?: InputMaybe<Scalars['jsonb']['input']>;
  permission_type?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  target_role_id?: InputMaybe<Scalars['uuid']['input']>;
  target_user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type AuditPermissionChangesMaxFields = {
  __typename: 'audit_permission_changes_max_fields';
  approved_by_user_id: Maybe<Scalars['uuid']['output']>;
  change_type: Maybe<Scalars['String']['output']>;
  changed_at: Maybe<Scalars['timestamptz']['output']>;
  changed_by_user_id: Maybe<Scalars['uuid']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  permission_type: Maybe<Scalars['String']['output']>;
  reason: Maybe<Scalars['String']['output']>;
  target_role_id: Maybe<Scalars['uuid']['output']>;
  target_user_id: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type AuditPermissionChangesMinFields = {
  __typename: 'audit_permission_changes_min_fields';
  approved_by_user_id: Maybe<Scalars['uuid']['output']>;
  change_type: Maybe<Scalars['String']['output']>;
  changed_at: Maybe<Scalars['timestamptz']['output']>;
  changed_by_user_id: Maybe<Scalars['uuid']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  permission_type: Maybe<Scalars['String']['output']>;
  reason: Maybe<Scalars['String']['output']>;
  target_role_id: Maybe<Scalars['uuid']['output']>;
  target_user_id: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "audit.permission_changes" */
export type AuditPermissionChangesMutationResponse = {
  __typename: 'audit_permission_changes_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuditPermissionChanges>;
};

/** on_conflict condition type for table "audit.permission_changes" */
export type AuditPermissionChangesOnConflict = {
  constraint: AuditPermissionChangesConstraint;
  update_columns?: Array<AuditPermissionChangesUpdateColumn>;
  where?: InputMaybe<AuditPermissionChangesBoolExp>;
};

/** Ordering options when selecting data from "audit.permission_changes". */
export type AuditPermissionChangesOrderBy = {
  approved_by_user_id?: InputMaybe<OrderBy>;
  change_type?: InputMaybe<OrderBy>;
  changed_at?: InputMaybe<OrderBy>;
  changed_by_user_id?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  metadata?: InputMaybe<OrderBy>;
  new_permissions?: InputMaybe<OrderBy>;
  old_permissions?: InputMaybe<OrderBy>;
  permission_type?: InputMaybe<OrderBy>;
  reason?: InputMaybe<OrderBy>;
  target_role_id?: InputMaybe<OrderBy>;
  target_user_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: audit.permission_changes */
export type AuditPermissionChangesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuditPermissionChangesPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  new_permissions?: InputMaybe<Scalars['jsonb']['input']>;
  old_permissions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit.permission_changes" */
export enum AuditPermissionChangesSelectColumn {
  /** column name */
  approved_by_user_id = 'approved_by_user_id',
  /** column name */
  change_type = 'change_type',
  /** column name */
  changed_at = 'changed_at',
  /** column name */
  changed_by_user_id = 'changed_by_user_id',
  /** column name */
  id = 'id',
  /** column name */
  metadata = 'metadata',
  /** column name */
  new_permissions = 'new_permissions',
  /** column name */
  old_permissions = 'old_permissions',
  /** column name */
  permission_type = 'permission_type',
  /** column name */
  reason = 'reason',
  /** column name */
  target_role_id = 'target_role_id',
  /** column name */
  target_user_id = 'target_user_id'
}

/** input type for updating data in table "audit.permission_changes" */
export type AuditPermissionChangesSetInput = {
  approved_by_user_id?: InputMaybe<Scalars['uuid']['input']>;
  change_type?: InputMaybe<Scalars['String']['input']>;
  changed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  changed_by_user_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  new_permissions?: InputMaybe<Scalars['jsonb']['input']>;
  old_permissions?: InputMaybe<Scalars['jsonb']['input']>;
  permission_type?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  target_role_id?: InputMaybe<Scalars['uuid']['input']>;
  target_user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "audit_permission_changes" */
export type AuditPermissionChangesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: AuditPermissionChangesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AuditPermissionChangesStreamCursorValueInput = {
  approved_by_user_id?: InputMaybe<Scalars['uuid']['input']>;
  change_type?: InputMaybe<Scalars['String']['input']>;
  changed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  changed_by_user_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  new_permissions?: InputMaybe<Scalars['jsonb']['input']>;
  old_permissions?: InputMaybe<Scalars['jsonb']['input']>;
  permission_type?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  target_role_id?: InputMaybe<Scalars['uuid']['input']>;
  target_user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "audit.permission_changes" */
export enum AuditPermissionChangesUpdateColumn {
  /** column name */
  approved_by_user_id = 'approved_by_user_id',
  /** column name */
  change_type = 'change_type',
  /** column name */
  changed_at = 'changed_at',
  /** column name */
  changed_by_user_id = 'changed_by_user_id',
  /** column name */
  id = 'id',
  /** column name */
  metadata = 'metadata',
  /** column name */
  new_permissions = 'new_permissions',
  /** column name */
  old_permissions = 'old_permissions',
  /** column name */
  permission_type = 'permission_type',
  /** column name */
  reason = 'reason',
  /** column name */
  target_role_id = 'target_role_id',
  /** column name */
  target_user_id = 'target_user_id'
}

export type AuditPermissionChangesUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<AuditPermissionChangesAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<AuditPermissionChangesDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<AuditPermissionChangesDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<AuditPermissionChangesDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<AuditPermissionChangesPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuditPermissionChangesSetInput>;
  /** filter the rows which have to be updated */
  where: AuditPermissionChangesBoolExp;
};

/** columns and relationships of "audit.permission_usage_report" */
export type AuditPermissionUsageReport = {
  __typename: 'audit_permission_usage_report';
  action: Maybe<Scalars['permission_action']['output']>;
  last_used: Maybe<Scalars['timestamptz']['output']>;
  resource_name: Maybe<Scalars['String']['output']>;
  role_name: Maybe<Scalars['String']['output']>;
  total_usage_count: Maybe<Scalars['bigint']['output']>;
  users_who_used_permission: Maybe<Scalars['bigint']['output']>;
  users_with_permission: Maybe<Scalars['bigint']['output']>;
};

/** aggregated selection of "audit.permission_usage_report" */
export type AuditPermissionUsageReportAggregate = {
  __typename: 'audit_permission_usage_report_aggregate';
  aggregate: Maybe<AuditPermissionUsageReportAggregateFields>;
  nodes: Array<AuditPermissionUsageReport>;
};

/** aggregate fields of "audit.permission_usage_report" */
export type AuditPermissionUsageReportAggregateFields = {
  __typename: 'audit_permission_usage_report_aggregate_fields';
  avg: Maybe<AuditPermissionUsageReportAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<AuditPermissionUsageReportMaxFields>;
  min: Maybe<AuditPermissionUsageReportMinFields>;
  stddev: Maybe<AuditPermissionUsageReportStddevFields>;
  stddev_pop: Maybe<AuditPermissionUsageReportStddevPopFields>;
  stddev_samp: Maybe<AuditPermissionUsageReportStddevSampFields>;
  sum: Maybe<AuditPermissionUsageReportSumFields>;
  var_pop: Maybe<AuditPermissionUsageReportVarPopFields>;
  var_samp: Maybe<AuditPermissionUsageReportVarSampFields>;
  variance: Maybe<AuditPermissionUsageReportVarianceFields>;
};


/** aggregate fields of "audit.permission_usage_report" */
export type AuditPermissionUsageReportAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AuditPermissionUsageReportSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type AuditPermissionUsageReportAvgFields = {
  __typename: 'audit_permission_usage_report_avg_fields';
  total_usage_count: Maybe<Scalars['Float']['output']>;
  users_who_used_permission: Maybe<Scalars['Float']['output']>;
  users_with_permission: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "audit.permission_usage_report". All fields are combined with a logical 'AND'. */
export type AuditPermissionUsageReportBoolExp = {
  _and?: InputMaybe<Array<AuditPermissionUsageReportBoolExp>>;
  _not?: InputMaybe<AuditPermissionUsageReportBoolExp>;
  _or?: InputMaybe<Array<AuditPermissionUsageReportBoolExp>>;
  action?: InputMaybe<PermissionActionComparisonExp>;
  last_used?: InputMaybe<TimestamptzComparisonExp>;
  resource_name?: InputMaybe<StringComparisonExp>;
  role_name?: InputMaybe<StringComparisonExp>;
  total_usage_count?: InputMaybe<BigintComparisonExp>;
  users_who_used_permission?: InputMaybe<BigintComparisonExp>;
  users_with_permission?: InputMaybe<BigintComparisonExp>;
};

/** aggregate max on columns */
export type AuditPermissionUsageReportMaxFields = {
  __typename: 'audit_permission_usage_report_max_fields';
  action: Maybe<Scalars['permission_action']['output']>;
  last_used: Maybe<Scalars['timestamptz']['output']>;
  resource_name: Maybe<Scalars['String']['output']>;
  role_name: Maybe<Scalars['String']['output']>;
  total_usage_count: Maybe<Scalars['bigint']['output']>;
  users_who_used_permission: Maybe<Scalars['bigint']['output']>;
  users_with_permission: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type AuditPermissionUsageReportMinFields = {
  __typename: 'audit_permission_usage_report_min_fields';
  action: Maybe<Scalars['permission_action']['output']>;
  last_used: Maybe<Scalars['timestamptz']['output']>;
  resource_name: Maybe<Scalars['String']['output']>;
  role_name: Maybe<Scalars['String']['output']>;
  total_usage_count: Maybe<Scalars['bigint']['output']>;
  users_who_used_permission: Maybe<Scalars['bigint']['output']>;
  users_with_permission: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "audit.permission_usage_report". */
export type AuditPermissionUsageReportOrderBy = {
  action?: InputMaybe<OrderBy>;
  last_used?: InputMaybe<OrderBy>;
  resource_name?: InputMaybe<OrderBy>;
  role_name?: InputMaybe<OrderBy>;
  total_usage_count?: InputMaybe<OrderBy>;
  users_who_used_permission?: InputMaybe<OrderBy>;
  users_with_permission?: InputMaybe<OrderBy>;
};

/** select columns of table "audit.permission_usage_report" */
export enum AuditPermissionUsageReportSelectColumn {
  /** column name */
  action = 'action',
  /** column name */
  last_used = 'last_used',
  /** column name */
  resource_name = 'resource_name',
  /** column name */
  role_name = 'role_name',
  /** column name */
  total_usage_count = 'total_usage_count',
  /** column name */
  users_who_used_permission = 'users_who_used_permission',
  /** column name */
  users_with_permission = 'users_with_permission'
}

/** aggregate stddev on columns */
export type AuditPermissionUsageReportStddevFields = {
  __typename: 'audit_permission_usage_report_stddev_fields';
  total_usage_count: Maybe<Scalars['Float']['output']>;
  users_who_used_permission: Maybe<Scalars['Float']['output']>;
  users_with_permission: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type AuditPermissionUsageReportStddevPopFields = {
  __typename: 'audit_permission_usage_report_stddev_pop_fields';
  total_usage_count: Maybe<Scalars['Float']['output']>;
  users_who_used_permission: Maybe<Scalars['Float']['output']>;
  users_with_permission: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type AuditPermissionUsageReportStddevSampFields = {
  __typename: 'audit_permission_usage_report_stddev_samp_fields';
  total_usage_count: Maybe<Scalars['Float']['output']>;
  users_who_used_permission: Maybe<Scalars['Float']['output']>;
  users_with_permission: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "audit_permission_usage_report" */
export type AuditPermissionUsageReportStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: AuditPermissionUsageReportStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AuditPermissionUsageReportStreamCursorValueInput = {
  action?: InputMaybe<Scalars['permission_action']['input']>;
  last_used?: InputMaybe<Scalars['timestamptz']['input']>;
  resource_name?: InputMaybe<Scalars['String']['input']>;
  role_name?: InputMaybe<Scalars['String']['input']>;
  total_usage_count?: InputMaybe<Scalars['bigint']['input']>;
  users_who_used_permission?: InputMaybe<Scalars['bigint']['input']>;
  users_with_permission?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type AuditPermissionUsageReportSumFields = {
  __typename: 'audit_permission_usage_report_sum_fields';
  total_usage_count: Maybe<Scalars['bigint']['output']>;
  users_who_used_permission: Maybe<Scalars['bigint']['output']>;
  users_with_permission: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type AuditPermissionUsageReportVarPopFields = {
  __typename: 'audit_permission_usage_report_var_pop_fields';
  total_usage_count: Maybe<Scalars['Float']['output']>;
  users_who_used_permission: Maybe<Scalars['Float']['output']>;
  users_with_permission: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type AuditPermissionUsageReportVarSampFields = {
  __typename: 'audit_permission_usage_report_var_samp_fields';
  total_usage_count: Maybe<Scalars['Float']['output']>;
  users_who_used_permission: Maybe<Scalars['Float']['output']>;
  users_with_permission: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type AuditPermissionUsageReportVarianceFields = {
  __typename: 'audit_permission_usage_report_variance_fields';
  total_usage_count: Maybe<Scalars['Float']['output']>;
  users_who_used_permission: Maybe<Scalars['Float']['output']>;
  users_with_permission: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "audit.slow_queries" */
export type AuditSlowQueries = {
  __typename: 'audit_slow_queries';
  application_name: Maybe<Scalars['String']['output']>;
  client_addr: Maybe<Scalars['inet']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  query: Scalars['String']['output'];
  query_duration: Scalars['interval']['output'];
  query_start: Scalars['timestamptz']['output'];
  user_id: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "audit.slow_queries" */
export type AuditSlowQueriesAggregate = {
  __typename: 'audit_slow_queries_aggregate';
  aggregate: Maybe<AuditSlowQueriesAggregateFields>;
  nodes: Array<AuditSlowQueries>;
};

/** aggregate fields of "audit.slow_queries" */
export type AuditSlowQueriesAggregateFields = {
  __typename: 'audit_slow_queries_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<AuditSlowQueriesMaxFields>;
  min: Maybe<AuditSlowQueriesMinFields>;
};


/** aggregate fields of "audit.slow_queries" */
export type AuditSlowQueriesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AuditSlowQueriesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "audit.slow_queries". All fields are combined with a logical 'AND'. */
export type AuditSlowQueriesBoolExp = {
  _and?: InputMaybe<Array<AuditSlowQueriesBoolExp>>;
  _not?: InputMaybe<AuditSlowQueriesBoolExp>;
  _or?: InputMaybe<Array<AuditSlowQueriesBoolExp>>;
  application_name?: InputMaybe<StringComparisonExp>;
  client_addr?: InputMaybe<InetComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  query?: InputMaybe<StringComparisonExp>;
  query_duration?: InputMaybe<IntervalComparisonExp>;
  query_start?: InputMaybe<TimestamptzComparisonExp>;
  user_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "audit.slow_queries" */
export enum AuditSlowQueriesConstraint {
  /** unique or primary key constraint on columns "id" */
  slow_queries_pkey = 'slow_queries_pkey'
}

/** input type for inserting data into table "audit.slow_queries" */
export type AuditSlowQueriesInsertInput = {
  application_name?: InputMaybe<Scalars['String']['input']>;
  client_addr?: InputMaybe<Scalars['inet']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  query_duration?: InputMaybe<Scalars['interval']['input']>;
  query_start?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type AuditSlowQueriesMaxFields = {
  __typename: 'audit_slow_queries_max_fields';
  application_name: Maybe<Scalars['String']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  query: Maybe<Scalars['String']['output']>;
  query_start: Maybe<Scalars['timestamptz']['output']>;
  user_id: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type AuditSlowQueriesMinFields = {
  __typename: 'audit_slow_queries_min_fields';
  application_name: Maybe<Scalars['String']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  query: Maybe<Scalars['String']['output']>;
  query_start: Maybe<Scalars['timestamptz']['output']>;
  user_id: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "audit.slow_queries" */
export type AuditSlowQueriesMutationResponse = {
  __typename: 'audit_slow_queries_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuditSlowQueries>;
};

/** on_conflict condition type for table "audit.slow_queries" */
export type AuditSlowQueriesOnConflict = {
  constraint: AuditSlowQueriesConstraint;
  update_columns?: Array<AuditSlowQueriesUpdateColumn>;
  where?: InputMaybe<AuditSlowQueriesBoolExp>;
};

/** Ordering options when selecting data from "audit.slow_queries". */
export type AuditSlowQueriesOrderBy = {
  application_name?: InputMaybe<OrderBy>;
  client_addr?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  query?: InputMaybe<OrderBy>;
  query_duration?: InputMaybe<OrderBy>;
  query_start?: InputMaybe<OrderBy>;
  user_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: audit.slow_queries */
export type AuditSlowQueriesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "audit.slow_queries" */
export enum AuditSlowQueriesSelectColumn {
  /** column name */
  application_name = 'application_name',
  /** column name */
  client_addr = 'client_addr',
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  query = 'query',
  /** column name */
  query_duration = 'query_duration',
  /** column name */
  query_start = 'query_start',
  /** column name */
  user_id = 'user_id'
}

/** input type for updating data in table "audit.slow_queries" */
export type AuditSlowQueriesSetInput = {
  application_name?: InputMaybe<Scalars['String']['input']>;
  client_addr?: InputMaybe<Scalars['inet']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  query_duration?: InputMaybe<Scalars['interval']['input']>;
  query_start?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "audit_slow_queries" */
export type AuditSlowQueriesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: AuditSlowQueriesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AuditSlowQueriesStreamCursorValueInput = {
  application_name?: InputMaybe<Scalars['String']['input']>;
  client_addr?: InputMaybe<Scalars['inet']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  query_duration?: InputMaybe<Scalars['interval']['input']>;
  query_start?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "audit.slow_queries" */
export enum AuditSlowQueriesUpdateColumn {
  /** column name */
  application_name = 'application_name',
  /** column name */
  client_addr = 'client_addr',
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  query = 'query',
  /** column name */
  query_duration = 'query_duration',
  /** column name */
  query_start = 'query_start',
  /** column name */
  user_id = 'user_id'
}

export type AuditSlowQueriesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuditSlowQueriesSetInput>;
  /** filter the rows which have to be updated */
  where: AuditSlowQueriesBoolExp;
};

/** columns and relationships of "audit.user_access_summary" */
export type AuditUserAccessSummary = {
  __typename: 'audit_user_access_summary';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  email: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  is_active: Maybe<Scalars['Boolean']['output']>;
  is_staff: Maybe<Scalars['Boolean']['output']>;
  name: Maybe<Scalars['String']['output']>;
  role: Maybe<Scalars['user_role']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "audit.user_access_summary" */
export type AuditUserAccessSummaryAggregate = {
  __typename: 'audit_user_access_summary_aggregate';
  aggregate: Maybe<AuditUserAccessSummaryAggregateFields>;
  nodes: Array<AuditUserAccessSummary>;
};

/** aggregate fields of "audit.user_access_summary" */
export type AuditUserAccessSummaryAggregateFields = {
  __typename: 'audit_user_access_summary_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<AuditUserAccessSummaryMaxFields>;
  min: Maybe<AuditUserAccessSummaryMinFields>;
};


/** aggregate fields of "audit.user_access_summary" */
export type AuditUserAccessSummaryAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AuditUserAccessSummarySelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "audit.user_access_summary". All fields are combined with a logical 'AND'. */
export type AuditUserAccessSummaryBoolExp = {
  _and?: InputMaybe<Array<AuditUserAccessSummaryBoolExp>>;
  _not?: InputMaybe<AuditUserAccessSummaryBoolExp>;
  _or?: InputMaybe<Array<AuditUserAccessSummaryBoolExp>>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  email?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  is_active?: InputMaybe<BooleanComparisonExp>;
  is_staff?: InputMaybe<BooleanComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  role?: InputMaybe<UserRoleComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
};

/** input type for inserting data into table "audit.user_access_summary" */
export type AuditUserAccessSummaryInsertInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_staff?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type AuditUserAccessSummaryMaxFields = {
  __typename: 'audit_user_access_summary_max_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  email: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  role: Maybe<Scalars['user_role']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type AuditUserAccessSummaryMinFields = {
  __typename: 'audit_user_access_summary_min_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  email: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  role: Maybe<Scalars['user_role']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "audit.user_access_summary" */
export type AuditUserAccessSummaryMutationResponse = {
  __typename: 'audit_user_access_summary_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuditUserAccessSummary>;
};

/** Ordering options when selecting data from "audit.user_access_summary". */
export type AuditUserAccessSummaryOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  is_active?: InputMaybe<OrderBy>;
  is_staff?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  role?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** select columns of table "audit.user_access_summary" */
export enum AuditUserAccessSummarySelectColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  email = 'email',
  /** column name */
  id = 'id',
  /** column name */
  is_active = 'is_active',
  /** column name */
  is_staff = 'is_staff',
  /** column name */
  name = 'name',
  /** column name */
  role = 'role',
  /** column name */
  updated_at = 'updated_at'
}

/** input type for updating data in table "audit.user_access_summary" */
export type AuditUserAccessSummarySetInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_staff?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "audit_user_access_summary" */
export type AuditUserAccessSummaryStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: AuditUserAccessSummaryStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AuditUserAccessSummaryStreamCursorValueInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_staff?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

export type AuditUserAccessSummaryUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuditUserAccessSummarySetInput>;
  /** filter the rows which have to be updated */
  where: AuditUserAccessSummaryBoolExp;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type BigintComparisonExp = {
  _eq?: InputMaybe<Scalars['bigint']['input']>;
  _gt?: InputMaybe<Scalars['bigint']['input']>;
  _gte?: InputMaybe<Scalars['bigint']['input']>;
  _in?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['bigint']['input']>;
  _lte?: InputMaybe<Scalars['bigint']['input']>;
  _neq?: InputMaybe<Scalars['bigint']['input']>;
  _nin?: InputMaybe<Array<Scalars['bigint']['input']>>;
};

/** columns and relationships of "billing_event_log" */
export type BillingEventLog = {
  __typename: 'billing_event_log';
  /** An object relationship */
  billing_invoice: Maybe<BillingInvoice>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  created_by: Maybe<Scalars['uuid']['output']>;
  event_type: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  invoice_id: Maybe<Scalars['uuid']['output']>;
  message: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  user: Maybe<Users>;
};

/** aggregated selection of "billing_event_log" */
export type BillingEventLogAggregate = {
  __typename: 'billing_event_log_aggregate';
  aggregate: Maybe<BillingEventLogAggregateFields>;
  nodes: Array<BillingEventLog>;
};

export type BillingEventLogAggregateBoolExp = {
  count?: InputMaybe<BillingEventLogAggregateBoolExpCount>;
};

export type BillingEventLogAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingEventLogBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "billing_event_log" */
export type BillingEventLogAggregateFields = {
  __typename: 'billing_event_log_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<BillingEventLogMaxFields>;
  min: Maybe<BillingEventLogMinFields>;
};


/** aggregate fields of "billing_event_log" */
export type BillingEventLogAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "billing_event_log" */
export type BillingEventLogAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BillingEventLogMaxOrderBy>;
  min?: InputMaybe<BillingEventLogMinOrderBy>;
};

/** input type for inserting array relation for remote table "billing_event_log" */
export type BillingEventLogArrRelInsertInput = {
  data: Array<BillingEventLogInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<BillingEventLogOnConflict>;
};

/** Boolean expression to filter rows from the table "billing_event_log". All fields are combined with a logical 'AND'. */
export type BillingEventLogBoolExp = {
  _and?: InputMaybe<Array<BillingEventLogBoolExp>>;
  _not?: InputMaybe<BillingEventLogBoolExp>;
  _or?: InputMaybe<Array<BillingEventLogBoolExp>>;
  billing_invoice?: InputMaybe<BillingInvoiceBoolExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  created_by?: InputMaybe<UuidComparisonExp>;
  event_type?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  invoice_id?: InputMaybe<UuidComparisonExp>;
  message?: InputMaybe<StringComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
};

/** unique or primary key constraints on table "billing_event_log" */
export enum BillingEventLogConstraint {
  /** unique or primary key constraint on columns "id" */
  billing_event_log_pkey = 'billing_event_log_pkey'
}

/** input type for inserting data into table "billing_event_log" */
export type BillingEventLogInsertInput = {
  billing_invoice?: InputMaybe<BillingInvoiceObjRelInsertInput>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  event_type?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoice_id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
};

/** aggregate max on columns */
export type BillingEventLogMaxFields = {
  __typename: 'billing_event_log_max_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  created_by: Maybe<Scalars['uuid']['output']>;
  event_type: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  invoice_id: Maybe<Scalars['uuid']['output']>;
  message: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "billing_event_log" */
export type BillingEventLogMaxOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  created_by?: InputMaybe<OrderBy>;
  event_type?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoice_id?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BillingEventLogMinFields = {
  __typename: 'billing_event_log_min_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  created_by: Maybe<Scalars['uuid']['output']>;
  event_type: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  invoice_id: Maybe<Scalars['uuid']['output']>;
  message: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "billing_event_log" */
export type BillingEventLogMinOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  created_by?: InputMaybe<OrderBy>;
  event_type?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoice_id?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "billing_event_log" */
export type BillingEventLogMutationResponse = {
  __typename: 'billing_event_log_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BillingEventLog>;
};

/** on_conflict condition type for table "billing_event_log" */
export type BillingEventLogOnConflict = {
  constraint: BillingEventLogConstraint;
  update_columns?: Array<BillingEventLogUpdateColumn>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};

/** Ordering options when selecting data from "billing_event_log". */
export type BillingEventLogOrderBy = {
  billing_invoice?: InputMaybe<BillingInvoiceOrderBy>;
  created_at?: InputMaybe<OrderBy>;
  created_by?: InputMaybe<OrderBy>;
  event_type?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoice_id?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
};

/** primary key columns input for table: billing_event_log */
export type BillingEventLogPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_event_log" */
export enum BillingEventLogSelectColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  created_by = 'created_by',
  /** column name */
  event_type = 'event_type',
  /** column name */
  id = 'id',
  /** column name */
  invoice_id = 'invoice_id',
  /** column name */
  message = 'message'
}

/** input type for updating data in table "billing_event_log" */
export type BillingEventLogSetInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  event_type?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoice_id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "billing_event_log" */
export type BillingEventLogStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: BillingEventLogStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BillingEventLogStreamCursorValueInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  event_type?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoice_id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "billing_event_log" */
export enum BillingEventLogUpdateColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  created_by = 'created_by',
  /** column name */
  event_type = 'event_type',
  /** column name */
  id = 'id',
  /** column name */
  invoice_id = 'invoice_id',
  /** column name */
  message = 'message'
}

export type BillingEventLogUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingEventLogSetInput>;
  /** filter the rows which have to be updated */
  where: BillingEventLogBoolExp;
};

/** columns and relationships of "billing_invoice" */
export type BillingInvoice = {
  __typename: 'billing_invoice';
  /** An array relationship */
  billing_event_logs: Array<BillingEventLog>;
  /** An aggregate relationship */
  billing_event_logs_aggregate: BillingEventLogAggregate;
  /** An array relationship */
  billing_invoice_items: Array<BillingInvoiceItem>;
  /** An aggregate relationship */
  billing_invoice_items_aggregate: BillingInvoiceItemAggregate;
  billing_period_end: Scalars['date']['output'];
  billing_period_start: Scalars['date']['output'];
  /** An object relationship */
  client: Clients;
  client_id: Scalars['uuid']['output'];
  created_at: Maybe<Scalars['timestamptz']['output']>;
  currency: Maybe<Scalars['String']['output']>;
  due_date: Maybe<Scalars['date']['output']>;
  id: Scalars['uuid']['output'];
  issued_date: Maybe<Scalars['date']['output']>;
  notes: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  total_amount: Scalars['numeric']['output'];
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "billing_invoice" */
export type BillingInvoiceBillingEventLogsArgs = {
  distinct_on?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingEventLogOrderBy>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};


/** columns and relationships of "billing_invoice" */
export type BillingInvoiceBillingEventLogsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingEventLogOrderBy>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};


/** columns and relationships of "billing_invoice" */
export type BillingInvoiceBillingInvoiceItemsArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


/** columns and relationships of "billing_invoice" */
export type BillingInvoiceBillingInvoiceItemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};

/** aggregated selection of "billing_invoice" */
export type BillingInvoiceAggregate = {
  __typename: 'billing_invoice_aggregate';
  aggregate: Maybe<BillingInvoiceAggregateFields>;
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
  __typename: 'billing_invoice_aggregate_fields';
  avg: Maybe<BillingInvoiceAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<BillingInvoiceMaxFields>;
  min: Maybe<BillingInvoiceMinFields>;
  stddev: Maybe<BillingInvoiceStddevFields>;
  stddev_pop: Maybe<BillingInvoiceStddevPopFields>;
  stddev_samp: Maybe<BillingInvoiceStddevSampFields>;
  sum: Maybe<BillingInvoiceSumFields>;
  var_pop: Maybe<BillingInvoiceVarPopFields>;
  var_samp: Maybe<BillingInvoiceVarSampFields>;
  variance: Maybe<BillingInvoiceVarianceFields>;
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
  stddev_pop?: InputMaybe<BillingInvoiceStddevPopOrderBy>;
  stddev_samp?: InputMaybe<BillingInvoiceStddevSampOrderBy>;
  sum?: InputMaybe<BillingInvoiceSumOrderBy>;
  var_pop?: InputMaybe<BillingInvoiceVarPopOrderBy>;
  var_samp?: InputMaybe<BillingInvoiceVarSampOrderBy>;
  variance?: InputMaybe<BillingInvoiceVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "billing_invoice" */
export type BillingInvoiceArrRelInsertInput = {
  data: Array<BillingInvoiceInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<BillingInvoiceOnConflict>;
};

/** aggregate avg on columns */
export type BillingInvoiceAvgFields = {
  __typename: 'billing_invoice_avg_fields';
  total_amount: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "billing_invoice" */
export type BillingInvoiceAvgOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "billing_invoice". All fields are combined with a logical 'AND'. */
export type BillingInvoiceBoolExp = {
  _and?: InputMaybe<Array<BillingInvoiceBoolExp>>;
  _not?: InputMaybe<BillingInvoiceBoolExp>;
  _or?: InputMaybe<Array<BillingInvoiceBoolExp>>;
  billing_event_logs?: InputMaybe<BillingEventLogBoolExp>;
  billing_event_logs_aggregate?: InputMaybe<BillingEventLogAggregateBoolExp>;
  billing_invoice_items?: InputMaybe<BillingInvoiceItemBoolExp>;
  billing_invoice_items_aggregate?: InputMaybe<BillingInvoiceItemAggregateBoolExp>;
  billing_period_end?: InputMaybe<DateComparisonExp>;
  billing_period_start?: InputMaybe<DateComparisonExp>;
  client?: InputMaybe<ClientsBoolExp>;
  client_id?: InputMaybe<UuidComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  currency?: InputMaybe<StringComparisonExp>;
  due_date?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  issued_date?: InputMaybe<DateComparisonExp>;
  notes?: InputMaybe<StringComparisonExp>;
  status?: InputMaybe<StringComparisonExp>;
  total_amount?: InputMaybe<NumericComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "billing_invoice" */
export enum BillingInvoiceConstraint {
  /** unique or primary key constraint on columns "id" */
  billing_invoice_pkey = 'billing_invoice_pkey'
}

/** input type for incrementing numeric columns in table "billing_invoice" */
export type BillingInvoiceIncInput = {
  total_amount?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_invoice" */
export type BillingInvoiceInsertInput = {
  billing_event_logs?: InputMaybe<BillingEventLogArrRelInsertInput>;
  billing_invoice_items?: InputMaybe<BillingInvoiceItemArrRelInsertInput>;
  billing_period_end?: InputMaybe<Scalars['date']['input']>;
  billing_period_start?: InputMaybe<Scalars['date']['input']>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  due_date?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  issued_date?: InputMaybe<Scalars['date']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  total_amount?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** columns and relationships of "billing_invoice_item" */
export type BillingInvoiceItem = {
  __typename: 'billing_invoice_item';
  amount: Maybe<Scalars['numeric']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  invoice_id: Scalars['uuid']['output'];
  /** An object relationship */
  parent_invoice: BillingInvoice;
  quantity: Scalars['Int']['output'];
  unit_price: Scalars['numeric']['output'];
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "billing_invoice_item" */
export type BillingInvoiceItemAggregate = {
  __typename: 'billing_invoice_item_aggregate';
  aggregate: Maybe<BillingInvoiceItemAggregateFields>;
  nodes: Array<BillingInvoiceItem>;
};

export type BillingInvoiceItemAggregateBoolExp = {
  count?: InputMaybe<BillingInvoiceItemAggregateBoolExpCount>;
};

export type BillingInvoiceItemAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingInvoiceItemBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "billing_invoice_item" */
export type BillingInvoiceItemAggregateFields = {
  __typename: 'billing_invoice_item_aggregate_fields';
  avg: Maybe<BillingInvoiceItemAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<BillingInvoiceItemMaxFields>;
  min: Maybe<BillingInvoiceItemMinFields>;
  stddev: Maybe<BillingInvoiceItemStddevFields>;
  stddev_pop: Maybe<BillingInvoiceItemStddevPopFields>;
  stddev_samp: Maybe<BillingInvoiceItemStddevSampFields>;
  sum: Maybe<BillingInvoiceItemSumFields>;
  var_pop: Maybe<BillingInvoiceItemVarPopFields>;
  var_samp: Maybe<BillingInvoiceItemVarSampFields>;
  variance: Maybe<BillingInvoiceItemVarianceFields>;
};


/** aggregate fields of "billing_invoice_item" */
export type BillingInvoiceItemAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "billing_invoice_item" */
export type BillingInvoiceItemAggregateOrderBy = {
  avg?: InputMaybe<BillingInvoiceItemAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BillingInvoiceItemMaxOrderBy>;
  min?: InputMaybe<BillingInvoiceItemMinOrderBy>;
  stddev?: InputMaybe<BillingInvoiceItemStddevOrderBy>;
  stddev_pop?: InputMaybe<BillingInvoiceItemStddevPopOrderBy>;
  stddev_samp?: InputMaybe<BillingInvoiceItemStddevSampOrderBy>;
  sum?: InputMaybe<BillingInvoiceItemSumOrderBy>;
  var_pop?: InputMaybe<BillingInvoiceItemVarPopOrderBy>;
  var_samp?: InputMaybe<BillingInvoiceItemVarSampOrderBy>;
  variance?: InputMaybe<BillingInvoiceItemVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "billing_invoice_item" */
export type BillingInvoiceItemArrRelInsertInput = {
  data: Array<BillingInvoiceItemInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<BillingInvoiceItemOnConflict>;
};

/** aggregate avg on columns */
export type BillingInvoiceItemAvgFields = {
  __typename: 'billing_invoice_item_avg_fields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unit_price: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemAvgOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "billing_invoice_item". All fields are combined with a logical 'AND'. */
export type BillingInvoiceItemBoolExp = {
  _and?: InputMaybe<Array<BillingInvoiceItemBoolExp>>;
  _not?: InputMaybe<BillingInvoiceItemBoolExp>;
  _or?: InputMaybe<Array<BillingInvoiceItemBoolExp>>;
  amount?: InputMaybe<NumericComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  invoice_id?: InputMaybe<UuidComparisonExp>;
  parent_invoice?: InputMaybe<BillingInvoiceBoolExp>;
  quantity?: InputMaybe<IntComparisonExp>;
  unit_price?: InputMaybe<NumericComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "billing_invoice_item" */
export enum BillingInvoiceItemConstraint {
  /** unique or primary key constraint on columns "id" */
  billing_invoice_item_pkey = 'billing_invoice_item_pkey'
}

/** input type for incrementing numeric columns in table "billing_invoice_item" */
export type BillingInvoiceItemIncInput = {
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unit_price?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_invoice_item" */
export type BillingInvoiceItemInsertInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoice_id?: InputMaybe<Scalars['uuid']['input']>;
  parent_invoice?: InputMaybe<BillingInvoiceObjRelInsertInput>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unit_price?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type BillingInvoiceItemMaxFields = {
  __typename: 'billing_invoice_item_max_fields';
  amount: Maybe<Scalars['numeric']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  invoice_id: Maybe<Scalars['uuid']['output']>;
  quantity: Maybe<Scalars['Int']['output']>;
  unit_price: Maybe<Scalars['numeric']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemMaxOrderBy = {
  amount?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoice_id?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BillingInvoiceItemMinFields = {
  __typename: 'billing_invoice_item_min_fields';
  amount: Maybe<Scalars['numeric']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  invoice_id: Maybe<Scalars['uuid']['output']>;
  quantity: Maybe<Scalars['Int']['output']>;
  unit_price: Maybe<Scalars['numeric']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemMinOrderBy = {
  amount?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoice_id?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "billing_invoice_item" */
export type BillingInvoiceItemMutationResponse = {
  __typename: 'billing_invoice_item_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BillingInvoiceItem>;
};

/** on_conflict condition type for table "billing_invoice_item" */
export type BillingInvoiceItemOnConflict = {
  constraint: BillingInvoiceItemConstraint;
  update_columns?: Array<BillingInvoiceItemUpdateColumn>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};

/** Ordering options when selecting data from "billing_invoice_item". */
export type BillingInvoiceItemOrderBy = {
  amount?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoice_id?: InputMaybe<OrderBy>;
  parent_invoice?: InputMaybe<BillingInvoiceOrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_invoice_item */
export type BillingInvoiceItemPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_invoice_item" */
export enum BillingInvoiceItemSelectColumn {
  /** column name */
  amount = 'amount',
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  invoice_id = 'invoice_id',
  /** column name */
  quantity = 'quantity',
  /** column name */
  unit_price = 'unit_price',
  /** column name */
  updated_at = 'updated_at'
}

/** input type for updating data in table "billing_invoice_item" */
export type BillingInvoiceItemSetInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoice_id?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unit_price?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type BillingInvoiceItemStddevFields = {
  __typename: 'billing_invoice_item_stddev_fields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unit_price: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemStddevOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type BillingInvoiceItemStddevPopFields = {
  __typename: 'billing_invoice_item_stddev_pop_fields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unit_price: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemStddevPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type BillingInvoiceItemStddevSampFields = {
  __typename: 'billing_invoice_item_stddev_samp_fields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unit_price: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemStddevSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "billing_invoice_item" */
export type BillingInvoiceItemStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: BillingInvoiceItemStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BillingInvoiceItemStreamCursorValueInput = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoice_id?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unit_price?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type BillingInvoiceItemSumFields = {
  __typename: 'billing_invoice_item_sum_fields';
  amount: Maybe<Scalars['numeric']['output']>;
  quantity: Maybe<Scalars['Int']['output']>;
  unit_price: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemSumOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** update columns of table "billing_invoice_item" */
export enum BillingInvoiceItemUpdateColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  invoice_id = 'invoice_id',
  /** column name */
  quantity = 'quantity',
  /** column name */
  unit_price = 'unit_price',
  /** column name */
  updated_at = 'updated_at'
}

export type BillingInvoiceItemUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BillingInvoiceItemIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingInvoiceItemSetInput>;
  /** filter the rows which have to be updated */
  where: BillingInvoiceItemBoolExp;
};

/** aggregate var_pop on columns */
export type BillingInvoiceItemVarPopFields = {
  __typename: 'billing_invoice_item_var_pop_fields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unit_price: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemVarPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type BillingInvoiceItemVarSampFields = {
  __typename: 'billing_invoice_item_var_samp_fields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unit_price: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemVarSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type BillingInvoiceItemVarianceFields = {
  __typename: 'billing_invoice_item_variance_fields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unit_price: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemVarianceOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate max on columns */
export type BillingInvoiceMaxFields = {
  __typename: 'billing_invoice_max_fields';
  billing_period_end: Maybe<Scalars['date']['output']>;
  billing_period_start: Maybe<Scalars['date']['output']>;
  client_id: Maybe<Scalars['uuid']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  currency: Maybe<Scalars['String']['output']>;
  due_date: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  issued_date: Maybe<Scalars['date']['output']>;
  notes: Maybe<Scalars['String']['output']>;
  status: Maybe<Scalars['String']['output']>;
  total_amount: Maybe<Scalars['numeric']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "billing_invoice" */
export type BillingInvoiceMaxOrderBy = {
  billing_period_end?: InputMaybe<OrderBy>;
  billing_period_start?: InputMaybe<OrderBy>;
  client_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  due_date?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  issued_date?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  total_amount?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BillingInvoiceMinFields = {
  __typename: 'billing_invoice_min_fields';
  billing_period_end: Maybe<Scalars['date']['output']>;
  billing_period_start: Maybe<Scalars['date']['output']>;
  client_id: Maybe<Scalars['uuid']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  currency: Maybe<Scalars['String']['output']>;
  due_date: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  issued_date: Maybe<Scalars['date']['output']>;
  notes: Maybe<Scalars['String']['output']>;
  status: Maybe<Scalars['String']['output']>;
  total_amount: Maybe<Scalars['numeric']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "billing_invoice" */
export type BillingInvoiceMinOrderBy = {
  billing_period_end?: InputMaybe<OrderBy>;
  billing_period_start?: InputMaybe<OrderBy>;
  client_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  due_date?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  issued_date?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  total_amount?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "billing_invoice" */
export type BillingInvoiceMutationResponse = {
  __typename: 'billing_invoice_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BillingInvoice>;
};

/** input type for inserting object relation for remote table "billing_invoice" */
export type BillingInvoiceObjRelInsertInput = {
  data: BillingInvoiceInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<BillingInvoiceOnConflict>;
};

/** on_conflict condition type for table "billing_invoice" */
export type BillingInvoiceOnConflict = {
  constraint: BillingInvoiceConstraint;
  update_columns?: Array<BillingInvoiceUpdateColumn>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};

/** Ordering options when selecting data from "billing_invoice". */
export type BillingInvoiceOrderBy = {
  billing_event_logs_aggregate?: InputMaybe<BillingEventLogAggregateOrderBy>;
  billing_invoice_items_aggregate?: InputMaybe<BillingInvoiceItemAggregateOrderBy>;
  billing_period_end?: InputMaybe<OrderBy>;
  billing_period_start?: InputMaybe<OrderBy>;
  client?: InputMaybe<ClientsOrderBy>;
  client_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  due_date?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  issued_date?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  total_amount?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_invoice */
export type BillingInvoicePkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_invoice" */
export enum BillingInvoiceSelectColumn {
  /** column name */
  billing_period_end = 'billing_period_end',
  /** column name */
  billing_period_start = 'billing_period_start',
  /** column name */
  client_id = 'client_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  currency = 'currency',
  /** column name */
  due_date = 'due_date',
  /** column name */
  id = 'id',
  /** column name */
  issued_date = 'issued_date',
  /** column name */
  notes = 'notes',
  /** column name */
  status = 'status',
  /** column name */
  total_amount = 'total_amount',
  /** column name */
  updated_at = 'updated_at'
}

/** input type for updating data in table "billing_invoice" */
export type BillingInvoiceSetInput = {
  billing_period_end?: InputMaybe<Scalars['date']['input']>;
  billing_period_start?: InputMaybe<Scalars['date']['input']>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  due_date?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  issued_date?: InputMaybe<Scalars['date']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  total_amount?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type BillingInvoiceStddevFields = {
  __typename: 'billing_invoice_stddev_fields';
  total_amount: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "billing_invoice" */
export type BillingInvoiceStddevOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type BillingInvoiceStddevPopFields = {
  __typename: 'billing_invoice_stddev_pop_fields';
  total_amount: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "billing_invoice" */
export type BillingInvoiceStddevPopOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type BillingInvoiceStddevSampFields = {
  __typename: 'billing_invoice_stddev_samp_fields';
  total_amount: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "billing_invoice" */
export type BillingInvoiceStddevSampOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "billing_invoice" */
export type BillingInvoiceStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: BillingInvoiceStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BillingInvoiceStreamCursorValueInput = {
  billing_period_end?: InputMaybe<Scalars['date']['input']>;
  billing_period_start?: InputMaybe<Scalars['date']['input']>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  due_date?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  issued_date?: InputMaybe<Scalars['date']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  total_amount?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type BillingInvoiceSumFields = {
  __typename: 'billing_invoice_sum_fields';
  total_amount: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "billing_invoice" */
export type BillingInvoiceSumOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** update columns of table "billing_invoice" */
export enum BillingInvoiceUpdateColumn {
  /** column name */
  billing_period_end = 'billing_period_end',
  /** column name */
  billing_period_start = 'billing_period_start',
  /** column name */
  client_id = 'client_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  currency = 'currency',
  /** column name */
  due_date = 'due_date',
  /** column name */
  id = 'id',
  /** column name */
  issued_date = 'issued_date',
  /** column name */
  notes = 'notes',
  /** column name */
  status = 'status',
  /** column name */
  total_amount = 'total_amount',
  /** column name */
  updated_at = 'updated_at'
}

export type BillingInvoiceUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BillingInvoiceIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingInvoiceSetInput>;
  /** filter the rows which have to be updated */
  where: BillingInvoiceBoolExp;
};

/** aggregate var_pop on columns */
export type BillingInvoiceVarPopFields = {
  __typename: 'billing_invoice_var_pop_fields';
  total_amount: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "billing_invoice" */
export type BillingInvoiceVarPopOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type BillingInvoiceVarSampFields = {
  __typename: 'billing_invoice_var_samp_fields';
  total_amount: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "billing_invoice" */
export type BillingInvoiceVarSampOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type BillingInvoiceVarianceFields = {
  __typename: 'billing_invoice_variance_fields';
  total_amount: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "billing_invoice" */
export type BillingInvoiceVarianceOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** columns and relationships of "billing_invoices" */
export type BillingInvoices = {
  __typename: 'billing_invoices';
  /** An array relationship */
  billing_items: Array<BillingItems>;
  /** An aggregate relationship */
  billing_items_aggregate: BillingItemsAggregate;
  billing_period_end: Scalars['date']['output'];
  billing_period_start: Scalars['date']['output'];
  /** An object relationship */
  client: Maybe<Clients>;
  client_id: Maybe<Scalars['uuid']['output']>;
  created_at: Maybe<Scalars['timestamp']['output']>;
  id: Scalars['uuid']['output'];
  invoice_number: Scalars['String']['output'];
  status: Maybe<Scalars['String']['output']>;
  total_amount: Maybe<Scalars['numeric']['output']>;
  updated_at: Maybe<Scalars['timestamp']['output']>;
};


/** columns and relationships of "billing_invoices" */
export type BillingInvoicesBillingItemsArgs = {
  distinct_on?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


/** columns and relationships of "billing_invoices" */
export type BillingInvoicesBillingItemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};

/** aggregated selection of "billing_invoices" */
export type BillingInvoicesAggregate = {
  __typename: 'billing_invoices_aggregate';
  aggregate: Maybe<BillingInvoicesAggregateFields>;
  nodes: Array<BillingInvoices>;
};

export type BillingInvoicesAggregateBoolExp = {
  count?: InputMaybe<BillingInvoicesAggregateBoolExpCount>;
};

export type BillingInvoicesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingInvoicesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "billing_invoices" */
export type BillingInvoicesAggregateFields = {
  __typename: 'billing_invoices_aggregate_fields';
  avg: Maybe<BillingInvoicesAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<BillingInvoicesMaxFields>;
  min: Maybe<BillingInvoicesMinFields>;
  stddev: Maybe<BillingInvoicesStddevFields>;
  stddev_pop: Maybe<BillingInvoicesStddevPopFields>;
  stddev_samp: Maybe<BillingInvoicesStddevSampFields>;
  sum: Maybe<BillingInvoicesSumFields>;
  var_pop: Maybe<BillingInvoicesVarPopFields>;
  var_samp: Maybe<BillingInvoicesVarSampFields>;
  variance: Maybe<BillingInvoicesVarianceFields>;
};


/** aggregate fields of "billing_invoices" */
export type BillingInvoicesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "billing_invoices" */
export type BillingInvoicesAggregateOrderBy = {
  avg?: InputMaybe<BillingInvoicesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BillingInvoicesMaxOrderBy>;
  min?: InputMaybe<BillingInvoicesMinOrderBy>;
  stddev?: InputMaybe<BillingInvoicesStddevOrderBy>;
  stddev_pop?: InputMaybe<BillingInvoicesStddevPopOrderBy>;
  stddev_samp?: InputMaybe<BillingInvoicesStddevSampOrderBy>;
  sum?: InputMaybe<BillingInvoicesSumOrderBy>;
  var_pop?: InputMaybe<BillingInvoicesVarPopOrderBy>;
  var_samp?: InputMaybe<BillingInvoicesVarSampOrderBy>;
  variance?: InputMaybe<BillingInvoicesVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "billing_invoices" */
export type BillingInvoicesArrRelInsertInput = {
  data: Array<BillingInvoicesInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<BillingInvoicesOnConflict>;
};

/** aggregate avg on columns */
export type BillingInvoicesAvgFields = {
  __typename: 'billing_invoices_avg_fields';
  total_amount: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "billing_invoices" */
export type BillingInvoicesAvgOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "billing_invoices". All fields are combined with a logical 'AND'. */
export type BillingInvoicesBoolExp = {
  _and?: InputMaybe<Array<BillingInvoicesBoolExp>>;
  _not?: InputMaybe<BillingInvoicesBoolExp>;
  _or?: InputMaybe<Array<BillingInvoicesBoolExp>>;
  billing_items?: InputMaybe<BillingItemsBoolExp>;
  billing_items_aggregate?: InputMaybe<BillingItemsAggregateBoolExp>;
  billing_period_end?: InputMaybe<DateComparisonExp>;
  billing_period_start?: InputMaybe<DateComparisonExp>;
  client?: InputMaybe<ClientsBoolExp>;
  client_id?: InputMaybe<UuidComparisonExp>;
  created_at?: InputMaybe<TimestampComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  invoice_number?: InputMaybe<StringComparisonExp>;
  status?: InputMaybe<StringComparisonExp>;
  total_amount?: InputMaybe<NumericComparisonExp>;
  updated_at?: InputMaybe<TimestampComparisonExp>;
};

/** unique or primary key constraints on table "billing_invoices" */
export enum BillingInvoicesConstraint {
  /** unique or primary key constraint on columns "invoice_number" */
  billing_invoices_invoice_number_key = 'billing_invoices_invoice_number_key',
  /** unique or primary key constraint on columns "id" */
  billing_invoices_pkey = 'billing_invoices_pkey'
}

/** input type for incrementing numeric columns in table "billing_invoices" */
export type BillingInvoicesIncInput = {
  total_amount?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_invoices" */
export type BillingInvoicesInsertInput = {
  billing_items?: InputMaybe<BillingItemsArrRelInsertInput>;
  billing_period_end?: InputMaybe<Scalars['date']['input']>;
  billing_period_start?: InputMaybe<Scalars['date']['input']>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoice_number?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  total_amount?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate max on columns */
export type BillingInvoicesMaxFields = {
  __typename: 'billing_invoices_max_fields';
  billing_period_end: Maybe<Scalars['date']['output']>;
  billing_period_start: Maybe<Scalars['date']['output']>;
  client_id: Maybe<Scalars['uuid']['output']>;
  created_at: Maybe<Scalars['timestamp']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  invoice_number: Maybe<Scalars['String']['output']>;
  status: Maybe<Scalars['String']['output']>;
  total_amount: Maybe<Scalars['numeric']['output']>;
  updated_at: Maybe<Scalars['timestamp']['output']>;
};

/** order by max() on columns of table "billing_invoices" */
export type BillingInvoicesMaxOrderBy = {
  billing_period_end?: InputMaybe<OrderBy>;
  billing_period_start?: InputMaybe<OrderBy>;
  client_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoice_number?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  total_amount?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BillingInvoicesMinFields = {
  __typename: 'billing_invoices_min_fields';
  billing_period_end: Maybe<Scalars['date']['output']>;
  billing_period_start: Maybe<Scalars['date']['output']>;
  client_id: Maybe<Scalars['uuid']['output']>;
  created_at: Maybe<Scalars['timestamp']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  invoice_number: Maybe<Scalars['String']['output']>;
  status: Maybe<Scalars['String']['output']>;
  total_amount: Maybe<Scalars['numeric']['output']>;
  updated_at: Maybe<Scalars['timestamp']['output']>;
};

/** order by min() on columns of table "billing_invoices" */
export type BillingInvoicesMinOrderBy = {
  billing_period_end?: InputMaybe<OrderBy>;
  billing_period_start?: InputMaybe<OrderBy>;
  client_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoice_number?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  total_amount?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "billing_invoices" */
export type BillingInvoicesMutationResponse = {
  __typename: 'billing_invoices_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BillingInvoices>;
};

/** input type for inserting object relation for remote table "billing_invoices" */
export type BillingInvoicesObjRelInsertInput = {
  data: BillingInvoicesInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<BillingInvoicesOnConflict>;
};

/** on_conflict condition type for table "billing_invoices" */
export type BillingInvoicesOnConflict = {
  constraint: BillingInvoicesConstraint;
  update_columns?: Array<BillingInvoicesUpdateColumn>;
  where?: InputMaybe<BillingInvoicesBoolExp>;
};

/** Ordering options when selecting data from "billing_invoices". */
export type BillingInvoicesOrderBy = {
  billing_items_aggregate?: InputMaybe<BillingItemsAggregateOrderBy>;
  billing_period_end?: InputMaybe<OrderBy>;
  billing_period_start?: InputMaybe<OrderBy>;
  client?: InputMaybe<ClientsOrderBy>;
  client_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoice_number?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  total_amount?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_invoices */
export type BillingInvoicesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_invoices" */
export enum BillingInvoicesSelectColumn {
  /** column name */
  billing_period_end = 'billing_period_end',
  /** column name */
  billing_period_start = 'billing_period_start',
  /** column name */
  client_id = 'client_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  invoice_number = 'invoice_number',
  /** column name */
  status = 'status',
  /** column name */
  total_amount = 'total_amount',
  /** column name */
  updated_at = 'updated_at'
}

/** input type for updating data in table "billing_invoices" */
export type BillingInvoicesSetInput = {
  billing_period_end?: InputMaybe<Scalars['date']['input']>;
  billing_period_start?: InputMaybe<Scalars['date']['input']>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoice_number?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  total_amount?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate stddev on columns */
export type BillingInvoicesStddevFields = {
  __typename: 'billing_invoices_stddev_fields';
  total_amount: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "billing_invoices" */
export type BillingInvoicesStddevOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type BillingInvoicesStddevPopFields = {
  __typename: 'billing_invoices_stddev_pop_fields';
  total_amount: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "billing_invoices" */
export type BillingInvoicesStddevPopOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type BillingInvoicesStddevSampFields = {
  __typename: 'billing_invoices_stddev_samp_fields';
  total_amount: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "billing_invoices" */
export type BillingInvoicesStddevSampOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "billing_invoices" */
export type BillingInvoicesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: BillingInvoicesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BillingInvoicesStreamCursorValueInput = {
  billing_period_end?: InputMaybe<Scalars['date']['input']>;
  billing_period_start?: InputMaybe<Scalars['date']['input']>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoice_number?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  total_amount?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate sum on columns */
export type BillingInvoicesSumFields = {
  __typename: 'billing_invoices_sum_fields';
  total_amount: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "billing_invoices" */
export type BillingInvoicesSumOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** update columns of table "billing_invoices" */
export enum BillingInvoicesUpdateColumn {
  /** column name */
  billing_period_end = 'billing_period_end',
  /** column name */
  billing_period_start = 'billing_period_start',
  /** column name */
  client_id = 'client_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  invoice_number = 'invoice_number',
  /** column name */
  status = 'status',
  /** column name */
  total_amount = 'total_amount',
  /** column name */
  updated_at = 'updated_at'
}

export type BillingInvoicesUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BillingInvoicesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingInvoicesSetInput>;
  /** filter the rows which have to be updated */
  where: BillingInvoicesBoolExp;
};

/** aggregate var_pop on columns */
export type BillingInvoicesVarPopFields = {
  __typename: 'billing_invoices_var_pop_fields';
  total_amount: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "billing_invoices" */
export type BillingInvoicesVarPopOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type BillingInvoicesVarSampFields = {
  __typename: 'billing_invoices_var_samp_fields';
  total_amount: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "billing_invoices" */
export type BillingInvoicesVarSampOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type BillingInvoicesVarianceFields = {
  __typename: 'billing_invoices_variance_fields';
  total_amount: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "billing_invoices" */
export type BillingInvoicesVarianceOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** columns and relationships of "billing_items" */
export type BillingItems = {
  __typename: 'billing_items';
  amount: Maybe<Scalars['numeric']['output']>;
  created_at: Maybe<Scalars['timestamp']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  invoice_id: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  invoice_reference: Maybe<BillingInvoices>;
  /** An object relationship */
  payroll: Maybe<Payrolls>;
  payroll_id: Maybe<Scalars['uuid']['output']>;
  quantity: Scalars['Int']['output'];
  unit_price: Scalars['numeric']['output'];
};

/** aggregated selection of "billing_items" */
export type BillingItemsAggregate = {
  __typename: 'billing_items_aggregate';
  aggregate: Maybe<BillingItemsAggregateFields>;
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
  __typename: 'billing_items_aggregate_fields';
  avg: Maybe<BillingItemsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<BillingItemsMaxFields>;
  min: Maybe<BillingItemsMinFields>;
  stddev: Maybe<BillingItemsStddevFields>;
  stddev_pop: Maybe<BillingItemsStddevPopFields>;
  stddev_samp: Maybe<BillingItemsStddevSampFields>;
  sum: Maybe<BillingItemsSumFields>;
  var_pop: Maybe<BillingItemsVarPopFields>;
  var_samp: Maybe<BillingItemsVarSampFields>;
  variance: Maybe<BillingItemsVarianceFields>;
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
  stddev_pop?: InputMaybe<BillingItemsStddevPopOrderBy>;
  stddev_samp?: InputMaybe<BillingItemsStddevSampOrderBy>;
  sum?: InputMaybe<BillingItemsSumOrderBy>;
  var_pop?: InputMaybe<BillingItemsVarPopOrderBy>;
  var_samp?: InputMaybe<BillingItemsVarSampOrderBy>;
  variance?: InputMaybe<BillingItemsVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "billing_items" */
export type BillingItemsArrRelInsertInput = {
  data: Array<BillingItemsInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<BillingItemsOnConflict>;
};

/** aggregate avg on columns */
export type BillingItemsAvgFields = {
  __typename: 'billing_items_avg_fields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unit_price: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "billing_items" */
export type BillingItemsAvgOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "billing_items". All fields are combined with a logical 'AND'. */
export type BillingItemsBoolExp = {
  _and?: InputMaybe<Array<BillingItemsBoolExp>>;
  _not?: InputMaybe<BillingItemsBoolExp>;
  _or?: InputMaybe<Array<BillingItemsBoolExp>>;
  amount?: InputMaybe<NumericComparisonExp>;
  created_at?: InputMaybe<TimestampComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  invoice_id?: InputMaybe<UuidComparisonExp>;
  invoice_reference?: InputMaybe<BillingInvoicesBoolExp>;
  payroll?: InputMaybe<PayrollsBoolExp>;
  payroll_id?: InputMaybe<UuidComparisonExp>;
  quantity?: InputMaybe<IntComparisonExp>;
  unit_price?: InputMaybe<NumericComparisonExp>;
};

/** unique or primary key constraints on table "billing_items" */
export enum BillingItemsConstraint {
  /** unique or primary key constraint on columns "id" */
  billing_items_pkey = 'billing_items_pkey'
}

/** input type for incrementing numeric columns in table "billing_items" */
export type BillingItemsIncInput = {
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unit_price?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_items" */
export type BillingItemsInsertInput = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoice_id?: InputMaybe<Scalars['uuid']['input']>;
  invoice_reference?: InputMaybe<BillingInvoicesObjRelInsertInput>;
  payroll?: InputMaybe<PayrollsObjRelInsertInput>;
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unit_price?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate max on columns */
export type BillingItemsMaxFields = {
  __typename: 'billing_items_max_fields';
  amount: Maybe<Scalars['numeric']['output']>;
  created_at: Maybe<Scalars['timestamp']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  invoice_id: Maybe<Scalars['uuid']['output']>;
  payroll_id: Maybe<Scalars['uuid']['output']>;
  quantity: Maybe<Scalars['Int']['output']>;
  unit_price: Maybe<Scalars['numeric']['output']>;
};

/** order by max() on columns of table "billing_items" */
export type BillingItemsMaxOrderBy = {
  amount?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoice_id?: InputMaybe<OrderBy>;
  payroll_id?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BillingItemsMinFields = {
  __typename: 'billing_items_min_fields';
  amount: Maybe<Scalars['numeric']['output']>;
  created_at: Maybe<Scalars['timestamp']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  invoice_id: Maybe<Scalars['uuid']['output']>;
  payroll_id: Maybe<Scalars['uuid']['output']>;
  quantity: Maybe<Scalars['Int']['output']>;
  unit_price: Maybe<Scalars['numeric']['output']>;
};

/** order by min() on columns of table "billing_items" */
export type BillingItemsMinOrderBy = {
  amount?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoice_id?: InputMaybe<OrderBy>;
  payroll_id?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "billing_items" */
export type BillingItemsMutationResponse = {
  __typename: 'billing_items_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BillingItems>;
};

/** on_conflict condition type for table "billing_items" */
export type BillingItemsOnConflict = {
  constraint: BillingItemsConstraint;
  update_columns?: Array<BillingItemsUpdateColumn>;
  where?: InputMaybe<BillingItemsBoolExp>;
};

/** Ordering options when selecting data from "billing_items". */
export type BillingItemsOrderBy = {
  amount?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoice_id?: InputMaybe<OrderBy>;
  invoice_reference?: InputMaybe<BillingInvoicesOrderBy>;
  payroll?: InputMaybe<PayrollsOrderBy>;
  payroll_id?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
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
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  invoice_id = 'invoice_id',
  /** column name */
  payroll_id = 'payroll_id',
  /** column name */
  quantity = 'quantity',
  /** column name */
  unit_price = 'unit_price'
}

/** input type for updating data in table "billing_items" */
export type BillingItemsSetInput = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoice_id?: InputMaybe<Scalars['uuid']['input']>;
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unit_price?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate stddev on columns */
export type BillingItemsStddevFields = {
  __typename: 'billing_items_stddev_fields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unit_price: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "billing_items" */
export type BillingItemsStddevOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type BillingItemsStddevPopFields = {
  __typename: 'billing_items_stddev_pop_fields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unit_price: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "billing_items" */
export type BillingItemsStddevPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type BillingItemsStddevSampFields = {
  __typename: 'billing_items_stddev_samp_fields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unit_price: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "billing_items" */
export type BillingItemsStddevSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "billing_items" */
export type BillingItemsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: BillingItemsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BillingItemsStreamCursorValueInput = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoice_id?: InputMaybe<Scalars['uuid']['input']>;
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unit_price?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate sum on columns */
export type BillingItemsSumFields = {
  __typename: 'billing_items_sum_fields';
  amount: Maybe<Scalars['numeric']['output']>;
  quantity: Maybe<Scalars['Int']['output']>;
  unit_price: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "billing_items" */
export type BillingItemsSumOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** update columns of table "billing_items" */
export enum BillingItemsUpdateColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  invoice_id = 'invoice_id',
  /** column name */
  payroll_id = 'payroll_id',
  /** column name */
  quantity = 'quantity',
  /** column name */
  unit_price = 'unit_price'
}

export type BillingItemsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BillingItemsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingItemsSetInput>;
  /** filter the rows which have to be updated */
  where: BillingItemsBoolExp;
};

/** aggregate var_pop on columns */
export type BillingItemsVarPopFields = {
  __typename: 'billing_items_var_pop_fields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unit_price: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "billing_items" */
export type BillingItemsVarPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type BillingItemsVarSampFields = {
  __typename: 'billing_items_var_samp_fields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unit_price: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "billing_items" */
export type BillingItemsVarSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type BillingItemsVarianceFields = {
  __typename: 'billing_items_variance_fields';
  amount: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unit_price: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "billing_items" */
export type BillingItemsVarianceOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** columns and relationships of "billing_plan" */
export type BillingPlan = {
  __typename: 'billing_plan';
  /** An array relationship */
  client_billing_assignments: Array<ClientBillingAssignment>;
  /** An aggregate relationship */
  client_billing_assignments_aggregate: ClientBillingAssignmentAggregate;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  currency: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  rate_per_payroll: Scalars['numeric']['output'];
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "billing_plan" */
export type BillingPlanClientBillingAssignmentsArgs = {
  distinct_on?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientBillingAssignmentOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};


/** columns and relationships of "billing_plan" */
export type BillingPlanClientBillingAssignmentsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientBillingAssignmentOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};

/** aggregated selection of "billing_plan" */
export type BillingPlanAggregate = {
  __typename: 'billing_plan_aggregate';
  aggregate: Maybe<BillingPlanAggregateFields>;
  nodes: Array<BillingPlan>;
};

/** aggregate fields of "billing_plan" */
export type BillingPlanAggregateFields = {
  __typename: 'billing_plan_aggregate_fields';
  avg: Maybe<BillingPlanAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<BillingPlanMaxFields>;
  min: Maybe<BillingPlanMinFields>;
  stddev: Maybe<BillingPlanStddevFields>;
  stddev_pop: Maybe<BillingPlanStddevPopFields>;
  stddev_samp: Maybe<BillingPlanStddevSampFields>;
  sum: Maybe<BillingPlanSumFields>;
  var_pop: Maybe<BillingPlanVarPopFields>;
  var_samp: Maybe<BillingPlanVarSampFields>;
  variance: Maybe<BillingPlanVarianceFields>;
};


/** aggregate fields of "billing_plan" */
export type BillingPlanAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<BillingPlanSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type BillingPlanAvgFields = {
  __typename: 'billing_plan_avg_fields';
  rate_per_payroll: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "billing_plan". All fields are combined with a logical 'AND'. */
export type BillingPlanBoolExp = {
  _and?: InputMaybe<Array<BillingPlanBoolExp>>;
  _not?: InputMaybe<BillingPlanBoolExp>;
  _or?: InputMaybe<Array<BillingPlanBoolExp>>;
  client_billing_assignments?: InputMaybe<ClientBillingAssignmentBoolExp>;
  client_billing_assignments_aggregate?: InputMaybe<ClientBillingAssignmentAggregateBoolExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  currency?: InputMaybe<StringComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  rate_per_payroll?: InputMaybe<NumericComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "billing_plan" */
export enum BillingPlanConstraint {
  /** unique or primary key constraint on columns "id" */
  billing_plan_pkey = 'billing_plan_pkey'
}

/** input type for incrementing numeric columns in table "billing_plan" */
export type BillingPlanIncInput = {
  rate_per_payroll?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_plan" */
export type BillingPlanInsertInput = {
  client_billing_assignments?: InputMaybe<ClientBillingAssignmentArrRelInsertInput>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rate_per_payroll?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type BillingPlanMaxFields = {
  __typename: 'billing_plan_max_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  currency: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  rate_per_payroll: Maybe<Scalars['numeric']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type BillingPlanMinFields = {
  __typename: 'billing_plan_min_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  currency: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  rate_per_payroll: Maybe<Scalars['numeric']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "billing_plan" */
export type BillingPlanMutationResponse = {
  __typename: 'billing_plan_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BillingPlan>;
};

/** input type for inserting object relation for remote table "billing_plan" */
export type BillingPlanObjRelInsertInput = {
  data: BillingPlanInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<BillingPlanOnConflict>;
};

/** on_conflict condition type for table "billing_plan" */
export type BillingPlanOnConflict = {
  constraint: BillingPlanConstraint;
  update_columns?: Array<BillingPlanUpdateColumn>;
  where?: InputMaybe<BillingPlanBoolExp>;
};

/** Ordering options when selecting data from "billing_plan". */
export type BillingPlanOrderBy = {
  client_billing_assignments_aggregate?: InputMaybe<ClientBillingAssignmentAggregateOrderBy>;
  created_at?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  rate_per_payroll?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_plan */
export type BillingPlanPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_plan" */
export enum BillingPlanSelectColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  currency = 'currency',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  rate_per_payroll = 'rate_per_payroll',
  /** column name */
  updated_at = 'updated_at'
}

/** input type for updating data in table "billing_plan" */
export type BillingPlanSetInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rate_per_payroll?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type BillingPlanStddevFields = {
  __typename: 'billing_plan_stddev_fields';
  rate_per_payroll: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type BillingPlanStddevPopFields = {
  __typename: 'billing_plan_stddev_pop_fields';
  rate_per_payroll: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type BillingPlanStddevSampFields = {
  __typename: 'billing_plan_stddev_samp_fields';
  rate_per_payroll: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "billing_plan" */
export type BillingPlanStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: BillingPlanStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BillingPlanStreamCursorValueInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rate_per_payroll?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type BillingPlanSumFields = {
  __typename: 'billing_plan_sum_fields';
  rate_per_payroll: Maybe<Scalars['numeric']['output']>;
};

/** update columns of table "billing_plan" */
export enum BillingPlanUpdateColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  currency = 'currency',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  rate_per_payroll = 'rate_per_payroll',
  /** column name */
  updated_at = 'updated_at'
}

export type BillingPlanUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BillingPlanIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingPlanSetInput>;
  /** filter the rows which have to be updated */
  where: BillingPlanBoolExp;
};

/** aggregate var_pop on columns */
export type BillingPlanVarPopFields = {
  __typename: 'billing_plan_var_pop_fields';
  rate_per_payroll: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type BillingPlanVarSampFields = {
  __typename: 'billing_plan_var_samp_fields';
  rate_per_payroll: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type BillingPlanVarianceFields = {
  __typename: 'billing_plan_variance_fields';
  rate_per_payroll: Maybe<Scalars['Float']['output']>;
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
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
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

/** columns and relationships of "client_billing_assignment" */
export type ClientBillingAssignment = {
  __typename: 'client_billing_assignment';
  /** An object relationship */
  billing_plan: BillingPlan;
  billing_plan_id: Scalars['uuid']['output'];
  /** An object relationship */
  client: Clients;
  client_id: Scalars['uuid']['output'];
  created_at: Maybe<Scalars['timestamptz']['output']>;
  end_date: Maybe<Scalars['date']['output']>;
  id: Scalars['uuid']['output'];
  is_active: Maybe<Scalars['Boolean']['output']>;
  start_date: Scalars['date']['output'];
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "client_billing_assignment" */
export type ClientBillingAssignmentAggregate = {
  __typename: 'client_billing_assignment_aggregate';
  aggregate: Maybe<ClientBillingAssignmentAggregateFields>;
  nodes: Array<ClientBillingAssignment>;
};

export type ClientBillingAssignmentAggregateBoolExp = {
  bool_and?: InputMaybe<ClientBillingAssignmentAggregateBoolExpBoolAnd>;
  bool_or?: InputMaybe<ClientBillingAssignmentAggregateBoolExpBoolOr>;
  count?: InputMaybe<ClientBillingAssignmentAggregateBoolExpCount>;
};

export type ClientBillingAssignmentAggregateBoolExpBoolAnd = {
  arguments: ClientBillingAssignmentSelectColumnClientBillingAssignmentAggregateBoolExpBoolAndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientBillingAssignmentBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ClientBillingAssignmentAggregateBoolExpBoolOr = {
  arguments: ClientBillingAssignmentSelectColumnClientBillingAssignmentAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientBillingAssignmentBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ClientBillingAssignmentAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientBillingAssignmentBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "client_billing_assignment" */
export type ClientBillingAssignmentAggregateFields = {
  __typename: 'client_billing_assignment_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<ClientBillingAssignmentMaxFields>;
  min: Maybe<ClientBillingAssignmentMinFields>;
};


/** aggregate fields of "client_billing_assignment" */
export type ClientBillingAssignmentAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "client_billing_assignment" */
export type ClientBillingAssignmentAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ClientBillingAssignmentMaxOrderBy>;
  min?: InputMaybe<ClientBillingAssignmentMinOrderBy>;
};

/** input type for inserting array relation for remote table "client_billing_assignment" */
export type ClientBillingAssignmentArrRelInsertInput = {
  data: Array<ClientBillingAssignmentInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<ClientBillingAssignmentOnConflict>;
};

/** Boolean expression to filter rows from the table "client_billing_assignment". All fields are combined with a logical 'AND'. */
export type ClientBillingAssignmentBoolExp = {
  _and?: InputMaybe<Array<ClientBillingAssignmentBoolExp>>;
  _not?: InputMaybe<ClientBillingAssignmentBoolExp>;
  _or?: InputMaybe<Array<ClientBillingAssignmentBoolExp>>;
  billing_plan?: InputMaybe<BillingPlanBoolExp>;
  billing_plan_id?: InputMaybe<UuidComparisonExp>;
  client?: InputMaybe<ClientsBoolExp>;
  client_id?: InputMaybe<UuidComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  end_date?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  is_active?: InputMaybe<BooleanComparisonExp>;
  start_date?: InputMaybe<DateComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "client_billing_assignment" */
export enum ClientBillingAssignmentConstraint {
  /** unique or primary key constraint on columns "id" */
  client_billing_assignment_pkey = 'client_billing_assignment_pkey'
}

/** input type for inserting data into table "client_billing_assignment" */
export type ClientBillingAssignmentInsertInput = {
  billing_plan?: InputMaybe<BillingPlanObjRelInsertInput>;
  billing_plan_id?: InputMaybe<Scalars['uuid']['input']>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  end_date?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  start_date?: InputMaybe<Scalars['date']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type ClientBillingAssignmentMaxFields = {
  __typename: 'client_billing_assignment_max_fields';
  billing_plan_id: Maybe<Scalars['uuid']['output']>;
  client_id: Maybe<Scalars['uuid']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  end_date: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  start_date: Maybe<Scalars['date']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "client_billing_assignment" */
export type ClientBillingAssignmentMaxOrderBy = {
  billing_plan_id?: InputMaybe<OrderBy>;
  client_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  end_date?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  start_date?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type ClientBillingAssignmentMinFields = {
  __typename: 'client_billing_assignment_min_fields';
  billing_plan_id: Maybe<Scalars['uuid']['output']>;
  client_id: Maybe<Scalars['uuid']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  end_date: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  start_date: Maybe<Scalars['date']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "client_billing_assignment" */
export type ClientBillingAssignmentMinOrderBy = {
  billing_plan_id?: InputMaybe<OrderBy>;
  client_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  end_date?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  start_date?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "client_billing_assignment" */
export type ClientBillingAssignmentMutationResponse = {
  __typename: 'client_billing_assignment_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<ClientBillingAssignment>;
};

/** on_conflict condition type for table "client_billing_assignment" */
export type ClientBillingAssignmentOnConflict = {
  constraint: ClientBillingAssignmentConstraint;
  update_columns?: Array<ClientBillingAssignmentUpdateColumn>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};

/** Ordering options when selecting data from "client_billing_assignment". */
export type ClientBillingAssignmentOrderBy = {
  billing_plan?: InputMaybe<BillingPlanOrderBy>;
  billing_plan_id?: InputMaybe<OrderBy>;
  client?: InputMaybe<ClientsOrderBy>;
  client_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  end_date?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  is_active?: InputMaybe<OrderBy>;
  start_date?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: client_billing_assignment */
export type ClientBillingAssignmentPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "client_billing_assignment" */
export enum ClientBillingAssignmentSelectColumn {
  /** column name */
  billing_plan_id = 'billing_plan_id',
  /** column name */
  client_id = 'client_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  end_date = 'end_date',
  /** column name */
  id = 'id',
  /** column name */
  is_active = 'is_active',
  /** column name */
  start_date = 'start_date',
  /** column name */
  updated_at = 'updated_at'
}

/** select "client_billing_assignment_aggregate_bool_exp_bool_and_arguments_columns" columns of table "client_billing_assignment" */
export enum ClientBillingAssignmentSelectColumnClientBillingAssignmentAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  is_active = 'is_active'
}

/** select "client_billing_assignment_aggregate_bool_exp_bool_or_arguments_columns" columns of table "client_billing_assignment" */
export enum ClientBillingAssignmentSelectColumnClientBillingAssignmentAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  is_active = 'is_active'
}

/** input type for updating data in table "client_billing_assignment" */
export type ClientBillingAssignmentSetInput = {
  billing_plan_id?: InputMaybe<Scalars['uuid']['input']>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  end_date?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  start_date?: InputMaybe<Scalars['date']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "client_billing_assignment" */
export type ClientBillingAssignmentStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ClientBillingAssignmentStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ClientBillingAssignmentStreamCursorValueInput = {
  billing_plan_id?: InputMaybe<Scalars['uuid']['input']>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  end_date?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  start_date?: InputMaybe<Scalars['date']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "client_billing_assignment" */
export enum ClientBillingAssignmentUpdateColumn {
  /** column name */
  billing_plan_id = 'billing_plan_id',
  /** column name */
  client_id = 'client_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  end_date = 'end_date',
  /** column name */
  id = 'id',
  /** column name */
  is_active = 'is_active',
  /** column name */
  start_date = 'start_date',
  /** column name */
  updated_at = 'updated_at'
}

export type ClientBillingAssignmentUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ClientBillingAssignmentSetInput>;
  /** filter the rows which have to be updated */
  where: ClientBillingAssignmentBoolExp;
};

/** columns and relationships of "client_external_systems" */
export type ClientExternalSystems = {
  __typename: 'client_external_systems';
  /** An object relationship */
  client: Clients;
  /** Reference to the client */
  client_id: Scalars['uuid']['output'];
  /** Timestamp when the mapping was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  external_system: ExternalSystems;
  /** Unique identifier for the client-system mapping */
  id: Scalars['uuid']['output'];
  /** Client identifier in the external system */
  system_client_id: Maybe<Scalars['String']['output']>;
  /** Reference to the external system */
  system_id: Scalars['uuid']['output'];
  /** Timestamp when the mapping was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "client_external_systems" */
export type ClientExternalSystemsAggregate = {
  __typename: 'client_external_systems_aggregate';
  aggregate: Maybe<ClientExternalSystemsAggregateFields>;
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
  __typename: 'client_external_systems_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<ClientExternalSystemsMaxFields>;
  min: Maybe<ClientExternalSystemsMinFields>;
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
  on_conflict?: InputMaybe<ClientExternalSystemsOnConflict>;
};

/** Boolean expression to filter rows from the table "client_external_systems". All fields are combined with a logical 'AND'. */
export type ClientExternalSystemsBoolExp = {
  _and?: InputMaybe<Array<ClientExternalSystemsBoolExp>>;
  _not?: InputMaybe<ClientExternalSystemsBoolExp>;
  _or?: InputMaybe<Array<ClientExternalSystemsBoolExp>>;
  client?: InputMaybe<ClientsBoolExp>;
  client_id?: InputMaybe<UuidComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  external_system?: InputMaybe<ExternalSystemsBoolExp>;
  id?: InputMaybe<UuidComparisonExp>;
  system_client_id?: InputMaybe<StringComparisonExp>;
  system_id?: InputMaybe<UuidComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
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
  client?: InputMaybe<ClientsObjRelInsertInput>;
  /** Reference to the client */
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the mapping was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  external_system?: InputMaybe<ExternalSystemsObjRelInsertInput>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Client identifier in the external system */
  system_client_id?: InputMaybe<Scalars['String']['input']>;
  /** Reference to the external system */
  system_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the mapping was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type ClientExternalSystemsMaxFields = {
  __typename: 'client_external_systems_max_fields';
  /** Reference to the client */
  client_id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the mapping was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the client-system mapping */
  id: Maybe<Scalars['uuid']['output']>;
  /** Client identifier in the external system */
  system_client_id: Maybe<Scalars['String']['output']>;
  /** Reference to the external system */
  system_id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the mapping was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "client_external_systems" */
export type ClientExternalSystemsMaxOrderBy = {
  /** Reference to the client */
  client_id?: InputMaybe<OrderBy>;
  /** Timestamp when the mapping was created */
  created_at?: InputMaybe<OrderBy>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<OrderBy>;
  /** Client identifier in the external system */
  system_client_id?: InputMaybe<OrderBy>;
  /** Reference to the external system */
  system_id?: InputMaybe<OrderBy>;
  /** Timestamp when the mapping was last updated */
  updated_at?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type ClientExternalSystemsMinFields = {
  __typename: 'client_external_systems_min_fields';
  /** Reference to the client */
  client_id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the mapping was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the client-system mapping */
  id: Maybe<Scalars['uuid']['output']>;
  /** Client identifier in the external system */
  system_client_id: Maybe<Scalars['String']['output']>;
  /** Reference to the external system */
  system_id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the mapping was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "client_external_systems" */
export type ClientExternalSystemsMinOrderBy = {
  /** Reference to the client */
  client_id?: InputMaybe<OrderBy>;
  /** Timestamp when the mapping was created */
  created_at?: InputMaybe<OrderBy>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<OrderBy>;
  /** Client identifier in the external system */
  system_client_id?: InputMaybe<OrderBy>;
  /** Reference to the external system */
  system_id?: InputMaybe<OrderBy>;
  /** Timestamp when the mapping was last updated */
  updated_at?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "client_external_systems" */
export type ClientExternalSystemsMutationResponse = {
  __typename: 'client_external_systems_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<ClientExternalSystems>;
};

/** on_conflict condition type for table "client_external_systems" */
export type ClientExternalSystemsOnConflict = {
  constraint: ClientExternalSystemsConstraint;
  update_columns?: Array<ClientExternalSystemsUpdateColumn>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};

/** Ordering options when selecting data from "client_external_systems". */
export type ClientExternalSystemsOrderBy = {
  client?: InputMaybe<ClientsOrderBy>;
  client_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  external_system?: InputMaybe<ExternalSystemsOrderBy>;
  id?: InputMaybe<OrderBy>;
  system_client_id?: InputMaybe<OrderBy>;
  system_id?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: client_external_systems */
export type ClientExternalSystemsPkColumnsInput = {
  /** Unique identifier for the client-system mapping */
  id: Scalars['uuid']['input'];
};

/** select columns of table "client_external_systems" */
export enum ClientExternalSystemsSelectColumn {
  /** column name */
  client_id = 'client_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  system_client_id = 'system_client_id',
  /** column name */
  system_id = 'system_id',
  /** column name */
  updated_at = 'updated_at'
}

/** input type for updating data in table "client_external_systems" */
export type ClientExternalSystemsSetInput = {
  /** Reference to the client */
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the mapping was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Client identifier in the external system */
  system_client_id?: InputMaybe<Scalars['String']['input']>;
  /** Reference to the external system */
  system_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the mapping was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "client_external_systems" */
export type ClientExternalSystemsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ClientExternalSystemsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ClientExternalSystemsStreamCursorValueInput = {
  /** Reference to the client */
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the mapping was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Client identifier in the external system */
  system_client_id?: InputMaybe<Scalars['String']['input']>;
  /** Reference to the external system */
  system_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the mapping was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "client_external_systems" */
export enum ClientExternalSystemsUpdateColumn {
  /** column name */
  client_id = 'client_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  system_client_id = 'system_client_id',
  /** column name */
  system_id = 'system_id',
  /** column name */
  updated_at = 'updated_at'
}

export type ClientExternalSystemsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ClientExternalSystemsSetInput>;
  /** filter the rows which have to be updated */
  where: ClientExternalSystemsBoolExp;
};

/** columns and relationships of "clients" */
export type Clients = {
  __typename: 'clients';
  /** Whether the client is currently active */
  active: Maybe<Scalars['Boolean']['output']>;
  /** An array relationship */
  billing_invoices: Array<BillingInvoice>;
  /** An aggregate relationship */
  billing_invoices_aggregate: BillingInvoiceAggregate;
  /** An array relationship */
  client_billing_assignments: Array<ClientBillingAssignment>;
  /** An aggregate relationship */
  client_billing_assignments_aggregate: ClientBillingAssignmentAggregate;
  /** An array relationship */
  client_billing_invoices: Array<BillingInvoices>;
  /** An aggregate relationship */
  client_billing_invoices_aggregate: BillingInvoicesAggregate;
  /** An array relationship */
  client_external_systems: Array<ClientExternalSystems>;
  /** An aggregate relationship */
  client_external_systems_aggregate: ClientExternalSystemsAggregate;
  /** Email address for the client contact */
  contact_email: Maybe<Scalars['String']['output']>;
  /** Primary contact person at the client */
  contact_person: Maybe<Scalars['String']['output']>;
  /** Phone number for the client contact */
  contact_phone: Maybe<Scalars['String']['output']>;
  /** Timestamp when the client was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the client */
  id: Scalars['uuid']['output'];
  /** Client company name */
  name: Scalars['String']['output'];
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrolls_aggregate: PayrollsAggregate;
  /** Timestamp when the client was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "clients" */
export type ClientsBillingInvoicesArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsBillingInvoicesAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsClientBillingAssignmentsArgs = {
  distinct_on?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientBillingAssignmentOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsClientBillingAssignmentsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientBillingAssignmentOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsClientBillingInvoicesArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoicesOrderBy>>;
  where?: InputMaybe<BillingInvoicesBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsClientBillingInvoicesAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoicesOrderBy>>;
  where?: InputMaybe<BillingInvoicesBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsClientExternalSystemsArgs = {
  distinct_on?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsClientExternalSystemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsPayrollsArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "clients" */
export type ClientsPayrollsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** aggregated selection of "clients" */
export type ClientsAggregate = {
  __typename: 'clients_aggregate';
  aggregate: Maybe<ClientsAggregateFields>;
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
  __typename: 'clients_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<ClientsMaxFields>;
  min: Maybe<ClientsMinFields>;
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
  on_conflict?: InputMaybe<ClientsOnConflict>;
};

/** Boolean expression to filter rows from the table "clients". All fields are combined with a logical 'AND'. */
export type ClientsBoolExp = {
  _and?: InputMaybe<Array<ClientsBoolExp>>;
  _not?: InputMaybe<ClientsBoolExp>;
  _or?: InputMaybe<Array<ClientsBoolExp>>;
  active?: InputMaybe<BooleanComparisonExp>;
  billing_invoices?: InputMaybe<BillingInvoiceBoolExp>;
  billing_invoices_aggregate?: InputMaybe<BillingInvoiceAggregateBoolExp>;
  client_billing_assignments?: InputMaybe<ClientBillingAssignmentBoolExp>;
  client_billing_assignments_aggregate?: InputMaybe<ClientBillingAssignmentAggregateBoolExp>;
  client_billing_invoices?: InputMaybe<BillingInvoicesBoolExp>;
  client_billing_invoices_aggregate?: InputMaybe<BillingInvoicesAggregateBoolExp>;
  client_external_systems?: InputMaybe<ClientExternalSystemsBoolExp>;
  client_external_systems_aggregate?: InputMaybe<ClientExternalSystemsAggregateBoolExp>;
  contact_email?: InputMaybe<StringComparisonExp>;
  contact_person?: InputMaybe<StringComparisonExp>;
  contact_phone?: InputMaybe<StringComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  payrolls?: InputMaybe<PayrollsBoolExp>;
  payrolls_aggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
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
  billing_invoices?: InputMaybe<BillingInvoiceArrRelInsertInput>;
  client_billing_assignments?: InputMaybe<ClientBillingAssignmentArrRelInsertInput>;
  client_billing_invoices?: InputMaybe<BillingInvoicesArrRelInsertInput>;
  client_external_systems?: InputMaybe<ClientExternalSystemsArrRelInsertInput>;
  /** Email address for the client contact */
  contact_email?: InputMaybe<Scalars['String']['input']>;
  /** Primary contact person at the client */
  contact_person?: InputMaybe<Scalars['String']['input']>;
  /** Phone number for the client contact */
  contact_phone?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the client was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Unique identifier for the client */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Client company name */
  name?: InputMaybe<Scalars['String']['input']>;
  payrolls?: InputMaybe<PayrollsArrRelInsertInput>;
  /** Timestamp when the client was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type ClientsMaxFields = {
  __typename: 'clients_max_fields';
  /** Email address for the client contact */
  contact_email: Maybe<Scalars['String']['output']>;
  /** Primary contact person at the client */
  contact_person: Maybe<Scalars['String']['output']>;
  /** Phone number for the client contact */
  contact_phone: Maybe<Scalars['String']['output']>;
  /** Timestamp when the client was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the client */
  id: Maybe<Scalars['uuid']['output']>;
  /** Client company name */
  name: Maybe<Scalars['String']['output']>;
  /** Timestamp when the client was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "clients" */
export type ClientsMaxOrderBy = {
  /** Email address for the client contact */
  contact_email?: InputMaybe<OrderBy>;
  /** Primary contact person at the client */
  contact_person?: InputMaybe<OrderBy>;
  /** Phone number for the client contact */
  contact_phone?: InputMaybe<OrderBy>;
  /** Timestamp when the client was created */
  created_at?: InputMaybe<OrderBy>;
  /** Unique identifier for the client */
  id?: InputMaybe<OrderBy>;
  /** Client company name */
  name?: InputMaybe<OrderBy>;
  /** Timestamp when the client was last updated */
  updated_at?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type ClientsMinFields = {
  __typename: 'clients_min_fields';
  /** Email address for the client contact */
  contact_email: Maybe<Scalars['String']['output']>;
  /** Primary contact person at the client */
  contact_person: Maybe<Scalars['String']['output']>;
  /** Phone number for the client contact */
  contact_phone: Maybe<Scalars['String']['output']>;
  /** Timestamp when the client was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the client */
  id: Maybe<Scalars['uuid']['output']>;
  /** Client company name */
  name: Maybe<Scalars['String']['output']>;
  /** Timestamp when the client was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "clients" */
export type ClientsMinOrderBy = {
  /** Email address for the client contact */
  contact_email?: InputMaybe<OrderBy>;
  /** Primary contact person at the client */
  contact_person?: InputMaybe<OrderBy>;
  /** Phone number for the client contact */
  contact_phone?: InputMaybe<OrderBy>;
  /** Timestamp when the client was created */
  created_at?: InputMaybe<OrderBy>;
  /** Unique identifier for the client */
  id?: InputMaybe<OrderBy>;
  /** Client company name */
  name?: InputMaybe<OrderBy>;
  /** Timestamp when the client was last updated */
  updated_at?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "clients" */
export type ClientsMutationResponse = {
  __typename: 'clients_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Clients>;
};

/** input type for inserting object relation for remote table "clients" */
export type ClientsObjRelInsertInput = {
  data: ClientsInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<ClientsOnConflict>;
};

/** on_conflict condition type for table "clients" */
export type ClientsOnConflict = {
  constraint: ClientsConstraint;
  update_columns?: Array<ClientsUpdateColumn>;
  where?: InputMaybe<ClientsBoolExp>;
};

/** Ordering options when selecting data from "clients". */
export type ClientsOrderBy = {
  active?: InputMaybe<OrderBy>;
  billing_invoices_aggregate?: InputMaybe<BillingInvoiceAggregateOrderBy>;
  client_billing_assignments_aggregate?: InputMaybe<ClientBillingAssignmentAggregateOrderBy>;
  client_billing_invoices_aggregate?: InputMaybe<BillingInvoicesAggregateOrderBy>;
  client_external_systems_aggregate?: InputMaybe<ClientExternalSystemsAggregateOrderBy>;
  contact_email?: InputMaybe<OrderBy>;
  contact_person?: InputMaybe<OrderBy>;
  contact_phone?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrolls_aggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  updated_at?: InputMaybe<OrderBy>;
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
  contact_email = 'contact_email',
  /** column name */
  contact_person = 'contact_person',
  /** column name */
  contact_phone = 'contact_phone',
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updated_at = 'updated_at'
}

/** select "clients_aggregate_bool_exp_bool_and_arguments_columns" columns of table "clients" */
export enum ClientsSelectColumnClientsAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  active = 'active'
}

/** select "clients_aggregate_bool_exp_bool_or_arguments_columns" columns of table "clients" */
export enum ClientsSelectColumnClientsAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  active = 'active'
}

/** input type for updating data in table "clients" */
export type ClientsSetInput = {
  /** Whether the client is currently active */
  active?: InputMaybe<Scalars['Boolean']['input']>;
  /** Email address for the client contact */
  contact_email?: InputMaybe<Scalars['String']['input']>;
  /** Primary contact person at the client */
  contact_person?: InputMaybe<Scalars['String']['input']>;
  /** Phone number for the client contact */
  contact_phone?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the client was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Unique identifier for the client */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Client company name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the client was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "clients" */
export type ClientsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ClientsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ClientsStreamCursorValueInput = {
  /** Whether the client is currently active */
  active?: InputMaybe<Scalars['Boolean']['input']>;
  /** Email address for the client contact */
  contact_email?: InputMaybe<Scalars['String']['input']>;
  /** Primary contact person at the client */
  contact_person?: InputMaybe<Scalars['String']['input']>;
  /** Phone number for the client contact */
  contact_phone?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the client was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Unique identifier for the client */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Client company name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the client was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "clients" */
export enum ClientsUpdateColumn {
  /** column name */
  active = 'active',
  /** column name */
  contact_email = 'contact_email',
  /** column name */
  contact_person = 'contact_person',
  /** column name */
  contact_phone = 'contact_phone',
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updated_at = 'updated_at'
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

/** columns and relationships of "current_payrolls" */
export type CurrentPayrolls = {
  __typename: 'current_payrolls';
  backup_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  client_id: Maybe<Scalars['uuid']['output']>;
  client_name: Maybe<Scalars['String']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  cycle_id: Maybe<Scalars['uuid']['output']>;
  date_type_id: Maybe<Scalars['uuid']['output']>;
  date_value: Maybe<Scalars['Int']['output']>;
  go_live_date: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  manager_user_id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  parent_payroll_id: Maybe<Scalars['uuid']['output']>;
  payroll_cycle_name: Maybe<Scalars['payroll_cycle_type']['output']>;
  payroll_date_type_name: Maybe<Scalars['payroll_date_type']['output']>;
  primary_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  superseded_date: Maybe<Scalars['date']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
  version_number: Maybe<Scalars['Int']['output']>;
  version_reason: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "current_payrolls" */
export type CurrentPayrollsAggregate = {
  __typename: 'current_payrolls_aggregate';
  aggregate: Maybe<CurrentPayrollsAggregateFields>;
  nodes: Array<CurrentPayrolls>;
};

/** aggregate fields of "current_payrolls" */
export type CurrentPayrollsAggregateFields = {
  __typename: 'current_payrolls_aggregate_fields';
  avg: Maybe<CurrentPayrollsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<CurrentPayrollsMaxFields>;
  min: Maybe<CurrentPayrollsMinFields>;
  stddev: Maybe<CurrentPayrollsStddevFields>;
  stddev_pop: Maybe<CurrentPayrollsStddevPopFields>;
  stddev_samp: Maybe<CurrentPayrollsStddevSampFields>;
  sum: Maybe<CurrentPayrollsSumFields>;
  var_pop: Maybe<CurrentPayrollsVarPopFields>;
  var_samp: Maybe<CurrentPayrollsVarSampFields>;
  variance: Maybe<CurrentPayrollsVarianceFields>;
};


/** aggregate fields of "current_payrolls" */
export type CurrentPayrollsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type CurrentPayrollsAvgFields = {
  __typename: 'current_payrolls_avg_fields';
  date_value: Maybe<Scalars['Float']['output']>;
  version_number: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "current_payrolls". All fields are combined with a logical 'AND'. */
export type CurrentPayrollsBoolExp = {
  _and?: InputMaybe<Array<CurrentPayrollsBoolExp>>;
  _not?: InputMaybe<CurrentPayrollsBoolExp>;
  _or?: InputMaybe<Array<CurrentPayrollsBoolExp>>;
  backup_consultant_user_id?: InputMaybe<UuidComparisonExp>;
  client_id?: InputMaybe<UuidComparisonExp>;
  client_name?: InputMaybe<StringComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  cycle_id?: InputMaybe<UuidComparisonExp>;
  date_type_id?: InputMaybe<UuidComparisonExp>;
  date_value?: InputMaybe<IntComparisonExp>;
  go_live_date?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  manager_user_id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  parent_payroll_id?: InputMaybe<UuidComparisonExp>;
  payroll_cycle_name?: InputMaybe<PayrollCycleTypeComparisonExp>;
  payroll_date_type_name?: InputMaybe<PayrollDateTypeComparisonExp>;
  primary_consultant_user_id?: InputMaybe<UuidComparisonExp>;
  superseded_date?: InputMaybe<DateComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
  version_number?: InputMaybe<IntComparisonExp>;
  version_reason?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type CurrentPayrollsMaxFields = {
  __typename: 'current_payrolls_max_fields';
  backup_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  client_id: Maybe<Scalars['uuid']['output']>;
  client_name: Maybe<Scalars['String']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  cycle_id: Maybe<Scalars['uuid']['output']>;
  date_type_id: Maybe<Scalars['uuid']['output']>;
  date_value: Maybe<Scalars['Int']['output']>;
  go_live_date: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  manager_user_id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  parent_payroll_id: Maybe<Scalars['uuid']['output']>;
  payroll_cycle_name: Maybe<Scalars['payroll_cycle_type']['output']>;
  payroll_date_type_name: Maybe<Scalars['payroll_date_type']['output']>;
  primary_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  superseded_date: Maybe<Scalars['date']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
  version_number: Maybe<Scalars['Int']['output']>;
  version_reason: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type CurrentPayrollsMinFields = {
  __typename: 'current_payrolls_min_fields';
  backup_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  client_id: Maybe<Scalars['uuid']['output']>;
  client_name: Maybe<Scalars['String']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  cycle_id: Maybe<Scalars['uuid']['output']>;
  date_type_id: Maybe<Scalars['uuid']['output']>;
  date_value: Maybe<Scalars['Int']['output']>;
  go_live_date: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  manager_user_id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  parent_payroll_id: Maybe<Scalars['uuid']['output']>;
  payroll_cycle_name: Maybe<Scalars['payroll_cycle_type']['output']>;
  payroll_date_type_name: Maybe<Scalars['payroll_date_type']['output']>;
  primary_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  superseded_date: Maybe<Scalars['date']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
  version_number: Maybe<Scalars['Int']['output']>;
  version_reason: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "current_payrolls". */
export type CurrentPayrollsOrderBy = {
  backup_consultant_user_id?: InputMaybe<OrderBy>;
  client_id?: InputMaybe<OrderBy>;
  client_name?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  cycle_id?: InputMaybe<OrderBy>;
  date_type_id?: InputMaybe<OrderBy>;
  date_value?: InputMaybe<OrderBy>;
  go_live_date?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  manager_user_id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  parent_payroll_id?: InputMaybe<OrderBy>;
  payroll_cycle_name?: InputMaybe<OrderBy>;
  payroll_date_type_name?: InputMaybe<OrderBy>;
  primary_consultant_user_id?: InputMaybe<OrderBy>;
  superseded_date?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  version_number?: InputMaybe<OrderBy>;
  version_reason?: InputMaybe<OrderBy>;
};

/** select columns of table "current_payrolls" */
export enum CurrentPayrollsSelectColumn {
  /** column name */
  backup_consultant_user_id = 'backup_consultant_user_id',
  /** column name */
  client_id = 'client_id',
  /** column name */
  client_name = 'client_name',
  /** column name */
  created_at = 'created_at',
  /** column name */
  cycle_id = 'cycle_id',
  /** column name */
  date_type_id = 'date_type_id',
  /** column name */
  date_value = 'date_value',
  /** column name */
  go_live_date = 'go_live_date',
  /** column name */
  id = 'id',
  /** column name */
  manager_user_id = 'manager_user_id',
  /** column name */
  name = 'name',
  /** column name */
  parent_payroll_id = 'parent_payroll_id',
  /** column name */
  payroll_cycle_name = 'payroll_cycle_name',
  /** column name */
  payroll_date_type_name = 'payroll_date_type_name',
  /** column name */
  primary_consultant_user_id = 'primary_consultant_user_id',
  /** column name */
  superseded_date = 'superseded_date',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  version_number = 'version_number',
  /** column name */
  version_reason = 'version_reason'
}

/** aggregate stddev on columns */
export type CurrentPayrollsStddevFields = {
  __typename: 'current_payrolls_stddev_fields';
  date_value: Maybe<Scalars['Float']['output']>;
  version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type CurrentPayrollsStddevPopFields = {
  __typename: 'current_payrolls_stddev_pop_fields';
  date_value: Maybe<Scalars['Float']['output']>;
  version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type CurrentPayrollsStddevSampFields = {
  __typename: 'current_payrolls_stddev_samp_fields';
  date_value: Maybe<Scalars['Float']['output']>;
  version_number: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "current_payrolls" */
export type CurrentPayrollsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CurrentPayrollsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CurrentPayrollsStreamCursorValueInput = {
  backup_consultant_user_id?: InputMaybe<Scalars['uuid']['input']>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  client_name?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  cycle_id?: InputMaybe<Scalars['uuid']['input']>;
  date_type_id?: InputMaybe<Scalars['uuid']['input']>;
  date_value?: InputMaybe<Scalars['Int']['input']>;
  go_live_date?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  manager_user_id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parent_payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  payroll_cycle_name?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  payroll_date_type_name?: InputMaybe<Scalars['payroll_date_type']['input']>;
  primary_consultant_user_id?: InputMaybe<Scalars['uuid']['input']>;
  superseded_date?: InputMaybe<Scalars['date']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  version_number?: InputMaybe<Scalars['Int']['input']>;
  version_reason?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type CurrentPayrollsSumFields = {
  __typename: 'current_payrolls_sum_fields';
  date_value: Maybe<Scalars['Int']['output']>;
  version_number: Maybe<Scalars['Int']['output']>;
};

/** aggregate var_pop on columns */
export type CurrentPayrollsVarPopFields = {
  __typename: 'current_payrolls_var_pop_fields';
  date_value: Maybe<Scalars['Float']['output']>;
  version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type CurrentPayrollsVarSampFields = {
  __typename: 'current_payrolls_var_samp_fields';
  date_value: Maybe<Scalars['Float']['output']>;
  version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type CurrentPayrollsVarianceFields = {
  __typename: 'current_payrolls_variance_fields';
  date_value: Maybe<Scalars['Float']['output']>;
  version_number: Maybe<Scalars['Float']['output']>;
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
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['date']['input']>;
  _lte?: InputMaybe<Scalars['date']['input']>;
  _neq?: InputMaybe<Scalars['date']['input']>;
  _nin?: InputMaybe<Array<Scalars['date']['input']>>;
};

/** columns and relationships of "external_systems" */
export type ExternalSystems = {
  __typename: 'external_systems';
  /** An array relationship */
  client_external_systems: Array<ClientExternalSystems>;
  /** An aggregate relationship */
  client_external_systems_aggregate: ClientExternalSystemsAggregate;
  /** Timestamp when the system was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Description of the external system and its purpose */
  description: Maybe<Scalars['String']['output']>;
  /** Path or reference to the system icon */
  icon: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the external system */
  id: Scalars['uuid']['output'];
  /** Name of the external system */
  name: Scalars['String']['output'];
  /** Timestamp when the system was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
  /** URL endpoint for the external system */
  url: Scalars['String']['output'];
};


/** columns and relationships of "external_systems" */
export type ExternalSystemsClientExternalSystemsArgs = {
  distinct_on?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


/** columns and relationships of "external_systems" */
export type ExternalSystemsClientExternalSystemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};

/** aggregated selection of "external_systems" */
export type ExternalSystemsAggregate = {
  __typename: 'external_systems_aggregate';
  aggregate: Maybe<ExternalSystemsAggregateFields>;
  nodes: Array<ExternalSystems>;
};

/** aggregate fields of "external_systems" */
export type ExternalSystemsAggregateFields = {
  __typename: 'external_systems_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<ExternalSystemsMaxFields>;
  min: Maybe<ExternalSystemsMinFields>;
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
  client_external_systems?: InputMaybe<ClientExternalSystemsBoolExp>;
  client_external_systems_aggregate?: InputMaybe<ClientExternalSystemsAggregateBoolExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  icon?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
  url?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "external_systems" */
export enum ExternalSystemsConstraint {
  /** unique or primary key constraint on columns "id" */
  external_systems_pkey = 'external_systems_pkey'
}

/** input type for inserting data into table "external_systems" */
export type ExternalSystemsInsertInput = {
  client_external_systems?: InputMaybe<ClientExternalSystemsArrRelInsertInput>;
  /** Timestamp when the system was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Description of the external system and its purpose */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Path or reference to the system icon */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the external system */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the external system */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the system was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** URL endpoint for the external system */
  url?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type ExternalSystemsMaxFields = {
  __typename: 'external_systems_max_fields';
  /** Timestamp when the system was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Description of the external system and its purpose */
  description: Maybe<Scalars['String']['output']>;
  /** Path or reference to the system icon */
  icon: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the external system */
  id: Maybe<Scalars['uuid']['output']>;
  /** Name of the external system */
  name: Maybe<Scalars['String']['output']>;
  /** Timestamp when the system was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
  /** URL endpoint for the external system */
  url: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type ExternalSystemsMinFields = {
  __typename: 'external_systems_min_fields';
  /** Timestamp when the system was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Description of the external system and its purpose */
  description: Maybe<Scalars['String']['output']>;
  /** Path or reference to the system icon */
  icon: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the external system */
  id: Maybe<Scalars['uuid']['output']>;
  /** Name of the external system */
  name: Maybe<Scalars['String']['output']>;
  /** Timestamp when the system was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
  /** URL endpoint for the external system */
  url: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "external_systems" */
export type ExternalSystemsMutationResponse = {
  __typename: 'external_systems_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<ExternalSystems>;
};

/** input type for inserting object relation for remote table "external_systems" */
export type ExternalSystemsObjRelInsertInput = {
  data: ExternalSystemsInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<ExternalSystemsOnConflict>;
};

/** on_conflict condition type for table "external_systems" */
export type ExternalSystemsOnConflict = {
  constraint: ExternalSystemsConstraint;
  update_columns?: Array<ExternalSystemsUpdateColumn>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};

/** Ordering options when selecting data from "external_systems". */
export type ExternalSystemsOrderBy = {
  client_external_systems_aggregate?: InputMaybe<ClientExternalSystemsAggregateOrderBy>;
  created_at?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  icon?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
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
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  icon = 'icon',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  url = 'url'
}

/** input type for updating data in table "external_systems" */
export type ExternalSystemsSetInput = {
  /** Timestamp when the system was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Description of the external system and its purpose */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Path or reference to the system icon */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the external system */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the external system */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the system was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** URL endpoint for the external system */
  url?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "external_systems" */
export type ExternalSystemsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ExternalSystemsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ExternalSystemsStreamCursorValueInput = {
  /** Timestamp when the system was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Description of the external system and its purpose */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Path or reference to the system icon */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the external system */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the external system */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the system was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** URL endpoint for the external system */
  url?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "external_systems" */
export enum ExternalSystemsUpdateColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  icon = 'icon',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updated_at = 'updated_at',
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
  __typename: 'feature_flags';
  /** JSON array of roles that can access this feature */
  allowed_roles: Scalars['jsonb']['output'];
  /** Name of the feature controlled by this flag */
  feature_name: Scalars['String']['output'];
  /** Unique identifier for the feature flag */
  id: Scalars['uuid']['output'];
  /** Whether the feature is currently enabled */
  is_enabled: Maybe<Scalars['Boolean']['output']>;
  /** Timestamp when the feature flag was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "feature_flags" */
export type FeatureFlagsAllowedRolesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "feature_flags" */
export type FeatureFlagsAggregate = {
  __typename: 'feature_flags_aggregate';
  aggregate: Maybe<FeatureFlagsAggregateFields>;
  nodes: Array<FeatureFlags>;
};

/** aggregate fields of "feature_flags" */
export type FeatureFlagsAggregateFields = {
  __typename: 'feature_flags_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<FeatureFlagsMaxFields>;
  min: Maybe<FeatureFlagsMinFields>;
};


/** aggregate fields of "feature_flags" */
export type FeatureFlagsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type FeatureFlagsAppendInput = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "feature_flags". All fields are combined with a logical 'AND'. */
export type FeatureFlagsBoolExp = {
  _and?: InputMaybe<Array<FeatureFlagsBoolExp>>;
  _not?: InputMaybe<FeatureFlagsBoolExp>;
  _or?: InputMaybe<Array<FeatureFlagsBoolExp>>;
  allowed_roles?: InputMaybe<JsonbComparisonExp>;
  feature_name?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  is_enabled?: InputMaybe<BooleanComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
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
  allowed_roles?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type FeatureFlagsDeleteElemInput = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type FeatureFlagsDeleteKeyInput = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "feature_flags" */
export type FeatureFlagsInsertInput = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Scalars['jsonb']['input']>;
  /** Name of the feature controlled by this flag */
  feature_name?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the feature flag */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the feature is currently enabled */
  is_enabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Timestamp when the feature flag was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type FeatureFlagsMaxFields = {
  __typename: 'feature_flags_max_fields';
  /** Name of the feature controlled by this flag */
  feature_name: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the feature flag */
  id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the feature flag was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type FeatureFlagsMinFields = {
  __typename: 'feature_flags_min_fields';
  /** Name of the feature controlled by this flag */
  feature_name: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the feature flag */
  id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the feature flag was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "feature_flags" */
export type FeatureFlagsMutationResponse = {
  __typename: 'feature_flags_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<FeatureFlags>;
};

/** on_conflict condition type for table "feature_flags" */
export type FeatureFlagsOnConflict = {
  constraint: FeatureFlagsConstraint;
  update_columns?: Array<FeatureFlagsUpdateColumn>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};

/** Ordering options when selecting data from "feature_flags". */
export type FeatureFlagsOrderBy = {
  allowed_roles?: InputMaybe<OrderBy>;
  feature_name?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  is_enabled?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: feature_flags */
export type FeatureFlagsPkColumnsInput = {
  /** Unique identifier for the feature flag */
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type FeatureFlagsPrependInput = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "feature_flags" */
export enum FeatureFlagsSelectColumn {
  /** column name */
  allowed_roles = 'allowed_roles',
  /** column name */
  feature_name = 'feature_name',
  /** column name */
  id = 'id',
  /** column name */
  is_enabled = 'is_enabled',
  /** column name */
  updated_at = 'updated_at'
}

/** input type for updating data in table "feature_flags" */
export type FeatureFlagsSetInput = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Scalars['jsonb']['input']>;
  /** Name of the feature controlled by this flag */
  feature_name?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the feature flag */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the feature is currently enabled */
  is_enabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Timestamp when the feature flag was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "feature_flags" */
export type FeatureFlagsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: FeatureFlagsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type FeatureFlagsStreamCursorValueInput = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Scalars['jsonb']['input']>;
  /** Name of the feature controlled by this flag */
  feature_name?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the feature flag */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the feature is currently enabled */
  is_enabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Timestamp when the feature flag was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "feature_flags" */
export enum FeatureFlagsUpdateColumn {
  /** column name */
  allowed_roles = 'allowed_roles',
  /** column name */
  feature_name = 'feature_name',
  /** column name */
  id = 'id',
  /** column name */
  is_enabled = 'is_enabled',
  /** column name */
  updated_at = 'updated_at'
}

export type FeatureFlagsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<FeatureFlagsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<FeatureFlagsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<FeatureFlagsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<FeatureFlagsDeleteKeyInput>;
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
  p_payroll_id?: InputMaybe<Scalars['uuid']['input']>;
};

export type GetPayrollVersionHistoryArgs = {
  p_payroll_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** columns and relationships of "holidays" */
export type Holidays = {
  __typename: 'holidays';
  /** ISO country code where the holiday is observed */
  country_code: Scalars['bpchar']['output'];
  /** Timestamp when the holiday record was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Date of the holiday */
  date: Scalars['date']['output'];
  /** Unique identifier for the holiday */
  id: Scalars['uuid']['output'];
  /** Whether the holiday occurs on the same date each year */
  is_fixed: Maybe<Scalars['Boolean']['output']>;
  /** Whether the holiday is observed globally */
  is_global: Maybe<Scalars['Boolean']['output']>;
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars['Int']['output']>;
  /** Name of the holiday in local language */
  local_name: Scalars['String']['output'];
  /** Name of the holiday in English */
  name: Scalars['String']['output'];
  /** Array of regions within the country where the holiday applies */
  region: Maybe<Array<Scalars['String']['output']>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types: Array<Scalars['String']['output']>;
  /** Timestamp when the holiday record was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "holidays" */
export type HolidaysAggregate = {
  __typename: 'holidays_aggregate';
  aggregate: Maybe<HolidaysAggregateFields>;
  nodes: Array<Holidays>;
};

/** aggregate fields of "holidays" */
export type HolidaysAggregateFields = {
  __typename: 'holidays_aggregate_fields';
  avg: Maybe<HolidaysAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<HolidaysMaxFields>;
  min: Maybe<HolidaysMinFields>;
  stddev: Maybe<HolidaysStddevFields>;
  stddev_pop: Maybe<HolidaysStddevPopFields>;
  stddev_samp: Maybe<HolidaysStddevSampFields>;
  sum: Maybe<HolidaysSumFields>;
  var_pop: Maybe<HolidaysVarPopFields>;
  var_samp: Maybe<HolidaysVarSampFields>;
  variance: Maybe<HolidaysVarianceFields>;
};


/** aggregate fields of "holidays" */
export type HolidaysAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<HolidaysSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type HolidaysAvgFields = {
  __typename: 'holidays_avg_fields';
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "holidays". All fields are combined with a logical 'AND'. */
export type HolidaysBoolExp = {
  _and?: InputMaybe<Array<HolidaysBoolExp>>;
  _not?: InputMaybe<HolidaysBoolExp>;
  _or?: InputMaybe<Array<HolidaysBoolExp>>;
  country_code?: InputMaybe<BpcharComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  date?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  is_fixed?: InputMaybe<BooleanComparisonExp>;
  is_global?: InputMaybe<BooleanComparisonExp>;
  launch_year?: InputMaybe<IntComparisonExp>;
  local_name?: InputMaybe<StringComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  region?: InputMaybe<StringArrayComparisonExp>;
  types?: InputMaybe<StringArrayComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "holidays" */
export enum HolidaysConstraint {
  /** unique or primary key constraint on columns "id" */
  holidays_pkey = 'holidays_pkey'
}

/** input type for incrementing numeric columns in table "holidays" */
export type HolidaysIncInput = {
  /** First year when the holiday was observed */
  launch_year?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "holidays" */
export type HolidaysInsertInput = {
  /** ISO country code where the holiday is observed */
  country_code?: InputMaybe<Scalars['bpchar']['input']>;
  /** Timestamp when the holiday record was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Date of the holiday */
  date?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the holiday */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the holiday occurs on the same date each year */
  is_fixed?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether the holiday is observed globally */
  is_global?: InputMaybe<Scalars['Boolean']['input']>;
  /** First year when the holiday was observed */
  launch_year?: InputMaybe<Scalars['Int']['input']>;
  /** Name of the holiday in local language */
  local_name?: InputMaybe<Scalars['String']['input']>;
  /** Name of the holiday in English */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Array of regions within the country where the holiday applies */
  region?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Timestamp when the holiday record was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type HolidaysMaxFields = {
  __typename: 'holidays_max_fields';
  /** ISO country code where the holiday is observed */
  country_code: Maybe<Scalars['bpchar']['output']>;
  /** Timestamp when the holiday record was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Date of the holiday */
  date: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the holiday */
  id: Maybe<Scalars['uuid']['output']>;
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars['Int']['output']>;
  /** Name of the holiday in local language */
  local_name: Maybe<Scalars['String']['output']>;
  /** Name of the holiday in English */
  name: Maybe<Scalars['String']['output']>;
  /** Array of regions within the country where the holiday applies */
  region: Maybe<Array<Scalars['String']['output']>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types: Maybe<Array<Scalars['String']['output']>>;
  /** Timestamp when the holiday record was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type HolidaysMinFields = {
  __typename: 'holidays_min_fields';
  /** ISO country code where the holiday is observed */
  country_code: Maybe<Scalars['bpchar']['output']>;
  /** Timestamp when the holiday record was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Date of the holiday */
  date: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the holiday */
  id: Maybe<Scalars['uuid']['output']>;
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars['Int']['output']>;
  /** Name of the holiday in local language */
  local_name: Maybe<Scalars['String']['output']>;
  /** Name of the holiday in English */
  name: Maybe<Scalars['String']['output']>;
  /** Array of regions within the country where the holiday applies */
  region: Maybe<Array<Scalars['String']['output']>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types: Maybe<Array<Scalars['String']['output']>>;
  /** Timestamp when the holiday record was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "holidays" */
export type HolidaysMutationResponse = {
  __typename: 'holidays_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Holidays>;
};

/** on_conflict condition type for table "holidays" */
export type HolidaysOnConflict = {
  constraint: HolidaysConstraint;
  update_columns?: Array<HolidaysUpdateColumn>;
  where?: InputMaybe<HolidaysBoolExp>;
};

/** Ordering options when selecting data from "holidays". */
export type HolidaysOrderBy = {
  country_code?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  date?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  is_fixed?: InputMaybe<OrderBy>;
  is_global?: InputMaybe<OrderBy>;
  launch_year?: InputMaybe<OrderBy>;
  local_name?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  region?: InputMaybe<OrderBy>;
  types?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: holidays */
export type HolidaysPkColumnsInput = {
  /** Unique identifier for the holiday */
  id: Scalars['uuid']['input'];
};

/** select columns of table "holidays" */
export enum HolidaysSelectColumn {
  /** column name */
  country_code = 'country_code',
  /** column name */
  created_at = 'created_at',
  /** column name */
  date = 'date',
  /** column name */
  id = 'id',
  /** column name */
  is_fixed = 'is_fixed',
  /** column name */
  is_global = 'is_global',
  /** column name */
  launch_year = 'launch_year',
  /** column name */
  local_name = 'local_name',
  /** column name */
  name = 'name',
  /** column name */
  region = 'region',
  /** column name */
  types = 'types',
  /** column name */
  updated_at = 'updated_at'
}

/** input type for updating data in table "holidays" */
export type HolidaysSetInput = {
  /** ISO country code where the holiday is observed */
  country_code?: InputMaybe<Scalars['bpchar']['input']>;
  /** Timestamp when the holiday record was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Date of the holiday */
  date?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the holiday */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the holiday occurs on the same date each year */
  is_fixed?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether the holiday is observed globally */
  is_global?: InputMaybe<Scalars['Boolean']['input']>;
  /** First year when the holiday was observed */
  launch_year?: InputMaybe<Scalars['Int']['input']>;
  /** Name of the holiday in local language */
  local_name?: InputMaybe<Scalars['String']['input']>;
  /** Name of the holiday in English */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Array of regions within the country where the holiday applies */
  region?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Timestamp when the holiday record was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type HolidaysStddevFields = {
  __typename: 'holidays_stddev_fields';
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type HolidaysStddevPopFields = {
  __typename: 'holidays_stddev_pop_fields';
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type HolidaysStddevSampFields = {
  __typename: 'holidays_stddev_samp_fields';
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "holidays" */
export type HolidaysStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: HolidaysStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type HolidaysStreamCursorValueInput = {
  /** ISO country code where the holiday is observed */
  country_code?: InputMaybe<Scalars['bpchar']['input']>;
  /** Timestamp when the holiday record was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Date of the holiday */
  date?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the holiday */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the holiday occurs on the same date each year */
  is_fixed?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether the holiday is observed globally */
  is_global?: InputMaybe<Scalars['Boolean']['input']>;
  /** First year when the holiday was observed */
  launch_year?: InputMaybe<Scalars['Int']['input']>;
  /** Name of the holiday in local language */
  local_name?: InputMaybe<Scalars['String']['input']>;
  /** Name of the holiday in English */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Array of regions within the country where the holiday applies */
  region?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Timestamp when the holiday record was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type HolidaysSumFields = {
  __typename: 'holidays_sum_fields';
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "holidays" */
export enum HolidaysUpdateColumn {
  /** column name */
  country_code = 'country_code',
  /** column name */
  created_at = 'created_at',
  /** column name */
  date = 'date',
  /** column name */
  id = 'id',
  /** column name */
  is_fixed = 'is_fixed',
  /** column name */
  is_global = 'is_global',
  /** column name */
  launch_year = 'launch_year',
  /** column name */
  local_name = 'local_name',
  /** column name */
  name = 'name',
  /** column name */
  region = 'region',
  /** column name */
  types = 'types',
  /** column name */
  updated_at = 'updated_at'
}

export type HolidaysUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<HolidaysIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<HolidaysSetInput>;
  /** filter the rows which have to be updated */
  where: HolidaysBoolExp;
};

/** aggregate var_pop on columns */
export type HolidaysVarPopFields = {
  __typename: 'holidays_var_pop_fields';
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type HolidaysVarSampFields = {
  __typename: 'holidays_var_samp_fields';
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type HolidaysVarianceFields = {
  __typename: 'holidays_variance_fields';
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "inet". All fields are combined with logical 'AND'. */
export type InetComparisonExp = {
  _eq?: InputMaybe<Scalars['inet']['input']>;
  _gt?: InputMaybe<Scalars['inet']['input']>;
  _gte?: InputMaybe<Scalars['inet']['input']>;
  _in?: InputMaybe<Array<Scalars['inet']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['inet']['input']>;
  _lte?: InputMaybe<Scalars['inet']['input']>;
  _neq?: InputMaybe<Scalars['inet']['input']>;
  _nin?: InputMaybe<Array<Scalars['inet']['input']>>;
};

/** Boolean expression to compare columns of type "interval". All fields are combined with logical 'AND'. */
export type IntervalComparisonExp = {
  _eq?: InputMaybe<Scalars['interval']['input']>;
  _gt?: InputMaybe<Scalars['interval']['input']>;
  _gte?: InputMaybe<Scalars['interval']['input']>;
  _in?: InputMaybe<Array<Scalars['interval']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
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
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** columns and relationships of "latest_payroll_version_results" */
export type LatestPayrollVersionResults = {
  __typename: 'latest_payroll_version_results';
  active: Scalars['Boolean']['output'];
  go_live_date: Maybe<Scalars['date']['output']>;
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  payroll_id: Scalars['uuid']['output'];
  queried_at: Maybe<Scalars['timestamptz']['output']>;
  version_number: Scalars['Int']['output'];
};

export type LatestPayrollVersionResultsAggregate = {
  __typename: 'latest_payroll_version_results_aggregate';
  aggregate: Maybe<LatestPayrollVersionResultsAggregateFields>;
  nodes: Array<LatestPayrollVersionResults>;
};

/** aggregate fields of "latest_payroll_version_results" */
export type LatestPayrollVersionResultsAggregateFields = {
  __typename: 'latest_payroll_version_results_aggregate_fields';
  avg: Maybe<LatestPayrollVersionResultsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<LatestPayrollVersionResultsMaxFields>;
  min: Maybe<LatestPayrollVersionResultsMinFields>;
  stddev: Maybe<LatestPayrollVersionResultsStddevFields>;
  stddev_pop: Maybe<LatestPayrollVersionResultsStddevPopFields>;
  stddev_samp: Maybe<LatestPayrollVersionResultsStddevSampFields>;
  sum: Maybe<LatestPayrollVersionResultsSumFields>;
  var_pop: Maybe<LatestPayrollVersionResultsVarPopFields>;
  var_samp: Maybe<LatestPayrollVersionResultsVarSampFields>;
  variance: Maybe<LatestPayrollVersionResultsVarianceFields>;
};


/** aggregate fields of "latest_payroll_version_results" */
export type LatestPayrollVersionResultsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type LatestPayrollVersionResultsAvgFields = {
  __typename: 'latest_payroll_version_results_avg_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "latest_payroll_version_results". All fields are combined with a logical 'AND'. */
export type LatestPayrollVersionResultsBoolExp = {
  _and?: InputMaybe<Array<LatestPayrollVersionResultsBoolExp>>;
  _not?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
  _or?: InputMaybe<Array<LatestPayrollVersionResultsBoolExp>>;
  active?: InputMaybe<BooleanComparisonExp>;
  go_live_date?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  payroll_id?: InputMaybe<UuidComparisonExp>;
  queried_at?: InputMaybe<TimestamptzComparisonExp>;
  version_number?: InputMaybe<IntComparisonExp>;
};

/** unique or primary key constraints on table "latest_payroll_version_results" */
export enum LatestPayrollVersionResultsConstraint {
  /** unique or primary key constraint on columns "id" */
  latest_payroll_version_results_pkey = 'latest_payroll_version_results_pkey'
}

/** input type for incrementing numeric columns in table "latest_payroll_version_results" */
export type LatestPayrollVersionResultsIncInput = {
  version_number?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "latest_payroll_version_results" */
export type LatestPayrollVersionResultsInsertInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  go_live_date?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  queried_at?: InputMaybe<Scalars['timestamptz']['input']>;
  version_number?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type LatestPayrollVersionResultsMaxFields = {
  __typename: 'latest_payroll_version_results_max_fields';
  go_live_date: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  payroll_id: Maybe<Scalars['uuid']['output']>;
  queried_at: Maybe<Scalars['timestamptz']['output']>;
  version_number: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type LatestPayrollVersionResultsMinFields = {
  __typename: 'latest_payroll_version_results_min_fields';
  go_live_date: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  payroll_id: Maybe<Scalars['uuid']['output']>;
  queried_at: Maybe<Scalars['timestamptz']['output']>;
  version_number: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "latest_payroll_version_results" */
export type LatestPayrollVersionResultsMutationResponse = {
  __typename: 'latest_payroll_version_results_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<LatestPayrollVersionResults>;
};

/** on_conflict condition type for table "latest_payroll_version_results" */
export type LatestPayrollVersionResultsOnConflict = {
  constraint: LatestPayrollVersionResultsConstraint;
  update_columns?: Array<LatestPayrollVersionResultsUpdateColumn>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};

/** Ordering options when selecting data from "latest_payroll_version_results". */
export type LatestPayrollVersionResultsOrderBy = {
  active?: InputMaybe<OrderBy>;
  go_live_date?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payroll_id?: InputMaybe<OrderBy>;
  queried_at?: InputMaybe<OrderBy>;
  version_number?: InputMaybe<OrderBy>;
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
  go_live_date = 'go_live_date',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  payroll_id = 'payroll_id',
  /** column name */
  queried_at = 'queried_at',
  /** column name */
  version_number = 'version_number'
}

/** input type for updating data in table "latest_payroll_version_results" */
export type LatestPayrollVersionResultsSetInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  go_live_date?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  queried_at?: InputMaybe<Scalars['timestamptz']['input']>;
  version_number?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type LatestPayrollVersionResultsStddevFields = {
  __typename: 'latest_payroll_version_results_stddev_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type LatestPayrollVersionResultsStddevPopFields = {
  __typename: 'latest_payroll_version_results_stddev_pop_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type LatestPayrollVersionResultsStddevSampFields = {
  __typename: 'latest_payroll_version_results_stddev_samp_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "latest_payroll_version_results" */
export type LatestPayrollVersionResultsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: LatestPayrollVersionResultsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type LatestPayrollVersionResultsStreamCursorValueInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  go_live_date?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  queried_at?: InputMaybe<Scalars['timestamptz']['input']>;
  version_number?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type LatestPayrollVersionResultsSumFields = {
  __typename: 'latest_payroll_version_results_sum_fields';
  version_number: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "latest_payroll_version_results" */
export enum LatestPayrollVersionResultsUpdateColumn {
  /** column name */
  active = 'active',
  /** column name */
  go_live_date = 'go_live_date',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  payroll_id = 'payroll_id',
  /** column name */
  queried_at = 'queried_at',
  /** column name */
  version_number = 'version_number'
}

export type LatestPayrollVersionResultsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<LatestPayrollVersionResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<LatestPayrollVersionResultsSetInput>;
  /** filter the rows which have to be updated */
  where: LatestPayrollVersionResultsBoolExp;
};

/** aggregate var_pop on columns */
export type LatestPayrollVersionResultsVarPopFields = {
  __typename: 'latest_payroll_version_results_var_pop_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type LatestPayrollVersionResultsVarSampFields = {
  __typename: 'latest_payroll_version_results_var_samp_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type LatestPayrollVersionResultsVarianceFields = {
  __typename: 'latest_payroll_version_results_variance_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "leave" */
export type Leave = {
  __typename: 'leave';
  /** Last day of the leave period */
  end_date: Scalars['date']['output'];
  /** Unique identifier for the leave record */
  id: Scalars['uuid']['output'];
  /** Type of leave (vacation, sick, personal, etc.) */
  leave_type: Scalars['String']['output'];
  /** An object relationship */
  leave_user: Users;
  /** Reason provided for the leave request */
  reason: Maybe<Scalars['String']['output']>;
  /** First day of the leave period */
  start_date: Scalars['date']['output'];
  /** Current status of the leave request (Pending, Approved, Denied) */
  status: Maybe<Scalars['leave_status_enum']['output']>;
  /** An object relationship */
  user: Users;
  /** Reference to the user taking leave */
  user_id: Scalars['uuid']['output'];
};

/** aggregated selection of "leave" */
export type LeaveAggregate = {
  __typename: 'leave_aggregate';
  aggregate: Maybe<LeaveAggregateFields>;
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
  __typename: 'leave_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<LeaveMaxFields>;
  min: Maybe<LeaveMinFields>;
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
  on_conflict?: InputMaybe<LeaveOnConflict>;
};

/** Boolean expression to filter rows from the table "leave". All fields are combined with a logical 'AND'. */
export type LeaveBoolExp = {
  _and?: InputMaybe<Array<LeaveBoolExp>>;
  _not?: InputMaybe<LeaveBoolExp>;
  _or?: InputMaybe<Array<LeaveBoolExp>>;
  end_date?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  leave_type?: InputMaybe<StringComparisonExp>;
  leave_user?: InputMaybe<UsersBoolExp>;
  reason?: InputMaybe<StringComparisonExp>;
  start_date?: InputMaybe<DateComparisonExp>;
  status?: InputMaybe<LeaveStatusEnumComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  user_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "leave" */
export enum LeaveConstraint {
  /** unique or primary key constraint on columns "id" */
  leave_pkey = 'leave_pkey'
}

/** input type for inserting data into table "leave" */
export type LeaveInsertInput = {
  /** Last day of the leave period */
  end_date?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leave_type?: InputMaybe<Scalars['String']['input']>;
  leave_user?: InputMaybe<UsersObjRelInsertInput>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<Scalars['String']['input']>;
  /** First day of the leave period */
  start_date?: InputMaybe<Scalars['date']['input']>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<Scalars['leave_status_enum']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  /** Reference to the user taking leave */
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type LeaveMaxFields = {
  __typename: 'leave_max_fields';
  /** Last day of the leave period */
  end_date: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the leave record */
  id: Maybe<Scalars['uuid']['output']>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leave_type: Maybe<Scalars['String']['output']>;
  /** Reason provided for the leave request */
  reason: Maybe<Scalars['String']['output']>;
  /** First day of the leave period */
  start_date: Maybe<Scalars['date']['output']>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status: Maybe<Scalars['leave_status_enum']['output']>;
  /** Reference to the user taking leave */
  user_id: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "leave" */
export type LeaveMaxOrderBy = {
  /** Last day of the leave period */
  end_date?: InputMaybe<OrderBy>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<OrderBy>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leave_type?: InputMaybe<OrderBy>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<OrderBy>;
  /** First day of the leave period */
  start_date?: InputMaybe<OrderBy>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<OrderBy>;
  /** Reference to the user taking leave */
  user_id?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type LeaveMinFields = {
  __typename: 'leave_min_fields';
  /** Last day of the leave period */
  end_date: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the leave record */
  id: Maybe<Scalars['uuid']['output']>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leave_type: Maybe<Scalars['String']['output']>;
  /** Reason provided for the leave request */
  reason: Maybe<Scalars['String']['output']>;
  /** First day of the leave period */
  start_date: Maybe<Scalars['date']['output']>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status: Maybe<Scalars['leave_status_enum']['output']>;
  /** Reference to the user taking leave */
  user_id: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "leave" */
export type LeaveMinOrderBy = {
  /** Last day of the leave period */
  end_date?: InputMaybe<OrderBy>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<OrderBy>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leave_type?: InputMaybe<OrderBy>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<OrderBy>;
  /** First day of the leave period */
  start_date?: InputMaybe<OrderBy>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<OrderBy>;
  /** Reference to the user taking leave */
  user_id?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "leave" */
export type LeaveMutationResponse = {
  __typename: 'leave_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Leave>;
};

/** on_conflict condition type for table "leave" */
export type LeaveOnConflict = {
  constraint: LeaveConstraint;
  update_columns?: Array<LeaveUpdateColumn>;
  where?: InputMaybe<LeaveBoolExp>;
};

/** Ordering options when selecting data from "leave". */
export type LeaveOrderBy = {
  end_date?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  leave_type?: InputMaybe<OrderBy>;
  leave_user?: InputMaybe<UsersOrderBy>;
  reason?: InputMaybe<OrderBy>;
  start_date?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  user_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: leave */
export type LeavePkColumnsInput = {
  /** Unique identifier for the leave record */
  id: Scalars['uuid']['input'];
};

/** select columns of table "leave" */
export enum LeaveSelectColumn {
  /** column name */
  end_date = 'end_date',
  /** column name */
  id = 'id',
  /** column name */
  leave_type = 'leave_type',
  /** column name */
  reason = 'reason',
  /** column name */
  start_date = 'start_date',
  /** column name */
  status = 'status',
  /** column name */
  user_id = 'user_id'
}

/** input type for updating data in table "leave" */
export type LeaveSetInput = {
  /** Last day of the leave period */
  end_date?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leave_type?: InputMaybe<Scalars['String']['input']>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<Scalars['String']['input']>;
  /** First day of the leave period */
  start_date?: InputMaybe<Scalars['date']['input']>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<Scalars['leave_status_enum']['input']>;
  /** Reference to the user taking leave */
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Boolean expression to compare columns of type "leave_status_enum". All fields are combined with logical 'AND'. */
export type LeaveStatusEnumComparisonExp = {
  _eq?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _gt?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _gte?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _in?: InputMaybe<Array<Scalars['leave_status_enum']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _lte?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _neq?: InputMaybe<Scalars['leave_status_enum']['input']>;
  _nin?: InputMaybe<Array<Scalars['leave_status_enum']['input']>>;
};

/** Streaming cursor of the table "leave" */
export type LeaveStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: LeaveStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type LeaveStreamCursorValueInput = {
  /** Last day of the leave period */
  end_date?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leave_type?: InputMaybe<Scalars['String']['input']>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<Scalars['String']['input']>;
  /** First day of the leave period */
  start_date?: InputMaybe<Scalars['date']['input']>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<Scalars['leave_status_enum']['input']>;
  /** Reference to the user taking leave */
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "leave" */
export enum LeaveUpdateColumn {
  /** column name */
  end_date = 'end_date',
  /** column name */
  id = 'id',
  /** column name */
  leave_type = 'leave_type',
  /** column name */
  reason = 'reason',
  /** column name */
  start_date = 'start_date',
  /** column name */
  status = 'status',
  /** column name */
  user_id = 'user_id'
}

export type LeaveUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<LeaveSetInput>;
  /** filter the rows which have to be updated */
  where: LeaveBoolExp;
};

/** mutation root */
export type MutationRoot = {
  __typename: 'mutation_root';
  /** Check for suspicious activity patterns */
  checkSuspiciousActivity: Maybe<SuspiciousActivityResponse>;
  commitPayrollAssignments: Maybe<CommitPayrollAssignmentsOutput>;
  /** delete data from the table: "adjustment_rules" */
  delete_adjustment_rules: Maybe<AdjustmentRulesMutationResponse>;
  /** delete single row from the table: "adjustment_rules" */
  delete_adjustment_rules_by_pk: Maybe<AdjustmentRules>;
  /** delete data from the table: "app_settings" */
  delete_app_settings: Maybe<AppSettingsMutationResponse>;
  /** delete single row from the table: "app_settings" */
  delete_app_settings_by_pk: Maybe<AppSettings>;
  /** delete data from the table: "audit.audit_log" */
  delete_audit_audit_log: Maybe<AuditAuditLogMutationResponse>;
  /** delete single row from the table: "audit.audit_log" */
  delete_audit_audit_log_by_pk: Maybe<AuditAuditLog>;
  /** delete data from the table: "audit.auth_events" */
  delete_audit_auth_events: Maybe<AuditAuthEventsMutationResponse>;
  /** delete single row from the table: "audit.auth_events" */
  delete_audit_auth_events_by_pk: Maybe<AuditAuthEvents>;
  /** delete data from the table: "audit.data_access_log" */
  delete_audit_data_access_log: Maybe<AuditDataAccessLogMutationResponse>;
  /** delete single row from the table: "audit.data_access_log" */
  delete_audit_data_access_log_by_pk: Maybe<AuditDataAccessLog>;
  /** delete data from the table: "audit.permission_changes" */
  delete_audit_permission_changes: Maybe<AuditPermissionChangesMutationResponse>;
  /** delete single row from the table: "audit.permission_changes" */
  delete_audit_permission_changes_by_pk: Maybe<AuditPermissionChanges>;
  /** delete data from the table: "audit.slow_queries" */
  delete_audit_slow_queries: Maybe<AuditSlowQueriesMutationResponse>;
  /** delete single row from the table: "audit.slow_queries" */
  delete_audit_slow_queries_by_pk: Maybe<AuditSlowQueries>;
  /** delete data from the table: "audit.user_access_summary" */
  delete_audit_user_access_summary: Maybe<AuditUserAccessSummaryMutationResponse>;
  /** delete data from the table: "billing_event_log" */
  delete_billing_event_log: Maybe<BillingEventLogMutationResponse>;
  /** delete single row from the table: "billing_event_log" */
  delete_billing_event_log_by_pk: Maybe<BillingEventLog>;
  /** delete data from the table: "billing_invoice" */
  delete_billing_invoice: Maybe<BillingInvoiceMutationResponse>;
  /** delete single row from the table: "billing_invoice" */
  delete_billing_invoice_by_pk: Maybe<BillingInvoice>;
  /** delete data from the table: "billing_invoice_item" */
  delete_billing_invoice_item: Maybe<BillingInvoiceItemMutationResponse>;
  /** delete single row from the table: "billing_invoice_item" */
  delete_billing_invoice_item_by_pk: Maybe<BillingInvoiceItem>;
  /** delete data from the table: "billing_invoices" */
  delete_billing_invoices: Maybe<BillingInvoicesMutationResponse>;
  /** delete single row from the table: "billing_invoices" */
  delete_billing_invoices_by_pk: Maybe<BillingInvoices>;
  /** delete data from the table: "billing_items" */
  delete_billing_items: Maybe<BillingItemsMutationResponse>;
  /** delete single row from the table: "billing_items" */
  delete_billing_items_by_pk: Maybe<BillingItems>;
  /** delete data from the table: "billing_plan" */
  delete_billing_plan: Maybe<BillingPlanMutationResponse>;
  /** delete single row from the table: "billing_plan" */
  delete_billing_plan_by_pk: Maybe<BillingPlan>;
  /** delete data from the table: "client_billing_assignment" */
  delete_client_billing_assignment: Maybe<ClientBillingAssignmentMutationResponse>;
  /** delete single row from the table: "client_billing_assignment" */
  delete_client_billing_assignment_by_pk: Maybe<ClientBillingAssignment>;
  /** delete data from the table: "client_external_systems" */
  delete_client_external_systems: Maybe<ClientExternalSystemsMutationResponse>;
  /** delete single row from the table: "client_external_systems" */
  delete_client_external_systems_by_pk: Maybe<ClientExternalSystems>;
  /** delete data from the table: "clients" */
  delete_clients: Maybe<ClientsMutationResponse>;
  /** delete single row from the table: "clients" */
  delete_clients_by_pk: Maybe<Clients>;
  /** delete data from the table: "external_systems" */
  delete_external_systems: Maybe<ExternalSystemsMutationResponse>;
  /** delete single row from the table: "external_systems" */
  delete_external_systems_by_pk: Maybe<ExternalSystems>;
  /** delete data from the table: "feature_flags" */
  delete_feature_flags: Maybe<FeatureFlagsMutationResponse>;
  /** delete single row from the table: "feature_flags" */
  delete_feature_flags_by_pk: Maybe<FeatureFlags>;
  /** delete data from the table: "holidays" */
  delete_holidays: Maybe<HolidaysMutationResponse>;
  /** delete single row from the table: "holidays" */
  delete_holidays_by_pk: Maybe<Holidays>;
  /** delete data from the table: "latest_payroll_version_results" */
  delete_latest_payroll_version_results: Maybe<LatestPayrollVersionResultsMutationResponse>;
  /** delete single row from the table: "latest_payroll_version_results" */
  delete_latest_payroll_version_results_by_pk: Maybe<LatestPayrollVersionResults>;
  /** delete data from the table: "leave" */
  delete_leave: Maybe<LeaveMutationResponse>;
  /** delete single row from the table: "leave" */
  delete_leave_by_pk: Maybe<Leave>;
  /** delete data from the table: "neon_auth.users_sync" */
  delete_neon_auth_users_sync: Maybe<NeonAuthUsersSyncMutationResponse>;
  /** delete single row from the table: "neon_auth.users_sync" */
  delete_neon_auth_users_sync_by_pk: Maybe<NeonAuthUsersSync>;
  /** delete data from the table: "notes" */
  delete_notes: Maybe<NotesMutationResponse>;
  /** delete single row from the table: "notes" */
  delete_notes_by_pk: Maybe<Notes>;
  /** delete data from the table: "payroll_activation_results" */
  delete_payroll_activation_results: Maybe<PayrollActivationResultsMutationResponse>;
  /** delete single row from the table: "payroll_activation_results" */
  delete_payroll_activation_results_by_pk: Maybe<PayrollActivationResults>;
  /** delete data from the table: "payroll_assignment_audit" */
  delete_payroll_assignment_audit: Maybe<PayrollAssignmentAuditMutationResponse>;
  /** delete single row from the table: "payroll_assignment_audit" */
  delete_payroll_assignment_audit_by_pk: Maybe<PayrollAssignmentAudit>;
  /** delete data from the table: "payroll_assignments" */
  delete_payroll_assignments: Maybe<PayrollAssignmentsMutationResponse>;
  /** delete single row from the table: "payroll_assignments" */
  delete_payroll_assignments_by_pk: Maybe<PayrollAssignments>;
  /** delete data from the table: "payroll_cycles" */
  delete_payroll_cycles: Maybe<PayrollCyclesMutationResponse>;
  /** delete single row from the table: "payroll_cycles" */
  delete_payroll_cycles_by_pk: Maybe<PayrollCycles>;
  /** delete data from the table: "payroll_date_types" */
  delete_payroll_date_types: Maybe<PayrollDateTypesMutationResponse>;
  /** delete single row from the table: "payroll_date_types" */
  delete_payroll_date_types_by_pk: Maybe<PayrollDateTypes>;
  /** delete data from the table: "payroll_dates" */
  delete_payroll_dates: Maybe<PayrollDatesMutationResponse>;
  /** delete single row from the table: "payroll_dates" */
  delete_payroll_dates_by_pk: Maybe<PayrollDates>;
  /** delete data from the table: "payroll_version_history_results" */
  delete_payroll_version_history_results: Maybe<PayrollVersionHistoryResultsMutationResponse>;
  /** delete single row from the table: "payroll_version_history_results" */
  delete_payroll_version_history_results_by_pk: Maybe<PayrollVersionHistoryResults>;
  /** delete data from the table: "payroll_version_results" */
  delete_payroll_version_results: Maybe<PayrollVersionResultsMutationResponse>;
  /** delete single row from the table: "payroll_version_results" */
  delete_payroll_version_results_by_pk: Maybe<PayrollVersionResults>;
  /** delete data from the table: "payrolls" */
  delete_payrolls: Maybe<PayrollsMutationResponse>;
  /** delete single row from the table: "payrolls" */
  delete_payrolls_by_pk: Maybe<Payrolls>;
  /** delete data from the table: "permissions" */
  delete_permissions: Maybe<PermissionsMutationResponse>;
  /** delete single row from the table: "permissions" */
  delete_permissions_by_pk: Maybe<Permissions>;
  /** delete data from the table: "resources" */
  delete_resources: Maybe<ResourcesMutationResponse>;
  /** delete single row from the table: "resources" */
  delete_resources_by_pk: Maybe<Resources>;
  /** delete data from the table: "role_permissions" */
  delete_role_permissions: Maybe<RolePermissionsMutationResponse>;
  /** delete single row from the table: "role_permissions" */
  delete_role_permissions_by_pk: Maybe<RolePermissions>;
  /** delete data from the table: "roles" */
  delete_roles: Maybe<RolesMutationResponse>;
  /** delete single row from the table: "roles" */
  delete_roles_by_pk: Maybe<Roles>;
  /** delete data from the table: "user_roles" */
  delete_user_roles: Maybe<UserRolesMutationResponse>;
  /** delete single row from the table: "user_roles" */
  delete_user_roles_by_pk: Maybe<UserRoles>;
  /** delete data from the table: "users" */
  delete_users: Maybe<UsersMutationResponse>;
  /** delete single row from the table: "users" */
  delete_users_by_pk: Maybe<Users>;
  /** delete data from the table: "users_role_backup" */
  delete_users_role_backup: Maybe<UsersRoleBackupMutationResponse>;
  /** delete data from the table: "work_schedule" */
  delete_work_schedule: Maybe<WorkScheduleMutationResponse>;
  /** delete single row from the table: "work_schedule" */
  delete_work_schedule_by_pk: Maybe<WorkSchedule>;
  /** Generate SOC2 compliance reports */
  generateComplianceReport: Maybe<ComplianceReportResponse>;
  /** insert data into the table: "adjustment_rules" */
  insert_adjustment_rules: Maybe<AdjustmentRulesMutationResponse>;
  /** insert a single row into the table: "adjustment_rules" */
  insert_adjustment_rules_one: Maybe<AdjustmentRules>;
  /** insert data into the table: "app_settings" */
  insert_app_settings: Maybe<AppSettingsMutationResponse>;
  /** insert a single row into the table: "app_settings" */
  insert_app_settings_one: Maybe<AppSettings>;
  /** insert data into the table: "audit.audit_log" */
  insert_audit_audit_log: Maybe<AuditAuditLogMutationResponse>;
  /** insert a single row into the table: "audit.audit_log" */
  insert_audit_audit_log_one: Maybe<AuditAuditLog>;
  /** insert data into the table: "audit.auth_events" */
  insert_audit_auth_events: Maybe<AuditAuthEventsMutationResponse>;
  /** insert a single row into the table: "audit.auth_events" */
  insert_audit_auth_events_one: Maybe<AuditAuthEvents>;
  /** insert data into the table: "audit.data_access_log" */
  insert_audit_data_access_log: Maybe<AuditDataAccessLogMutationResponse>;
  /** insert a single row into the table: "audit.data_access_log" */
  insert_audit_data_access_log_one: Maybe<AuditDataAccessLog>;
  /** insert data into the table: "audit.permission_changes" */
  insert_audit_permission_changes: Maybe<AuditPermissionChangesMutationResponse>;
  /** insert a single row into the table: "audit.permission_changes" */
  insert_audit_permission_changes_one: Maybe<AuditPermissionChanges>;
  /** insert data into the table: "audit.slow_queries" */
  insert_audit_slow_queries: Maybe<AuditSlowQueriesMutationResponse>;
  /** insert a single row into the table: "audit.slow_queries" */
  insert_audit_slow_queries_one: Maybe<AuditSlowQueries>;
  /** insert data into the table: "audit.user_access_summary" */
  insert_audit_user_access_summary: Maybe<AuditUserAccessSummaryMutationResponse>;
  /** insert a single row into the table: "audit.user_access_summary" */
  insert_audit_user_access_summary_one: Maybe<AuditUserAccessSummary>;
  /** insert data into the table: "billing_event_log" */
  insert_billing_event_log: Maybe<BillingEventLogMutationResponse>;
  /** insert a single row into the table: "billing_event_log" */
  insert_billing_event_log_one: Maybe<BillingEventLog>;
  /** insert data into the table: "billing_invoice" */
  insert_billing_invoice: Maybe<BillingInvoiceMutationResponse>;
  /** insert data into the table: "billing_invoice_item" */
  insert_billing_invoice_item: Maybe<BillingInvoiceItemMutationResponse>;
  /** insert a single row into the table: "billing_invoice_item" */
  insert_billing_invoice_item_one: Maybe<BillingInvoiceItem>;
  /** insert a single row into the table: "billing_invoice" */
  insert_billing_invoice_one: Maybe<BillingInvoice>;
  /** insert data into the table: "billing_invoices" */
  insert_billing_invoices: Maybe<BillingInvoicesMutationResponse>;
  /** insert a single row into the table: "billing_invoices" */
  insert_billing_invoices_one: Maybe<BillingInvoices>;
  /** insert data into the table: "billing_items" */
  insert_billing_items: Maybe<BillingItemsMutationResponse>;
  /** insert a single row into the table: "billing_items" */
  insert_billing_items_one: Maybe<BillingItems>;
  /** insert data into the table: "billing_plan" */
  insert_billing_plan: Maybe<BillingPlanMutationResponse>;
  /** insert a single row into the table: "billing_plan" */
  insert_billing_plan_one: Maybe<BillingPlan>;
  /** insert data into the table: "client_billing_assignment" */
  insert_client_billing_assignment: Maybe<ClientBillingAssignmentMutationResponse>;
  /** insert a single row into the table: "client_billing_assignment" */
  insert_client_billing_assignment_one: Maybe<ClientBillingAssignment>;
  /** insert data into the table: "client_external_systems" */
  insert_client_external_systems: Maybe<ClientExternalSystemsMutationResponse>;
  /** insert a single row into the table: "client_external_systems" */
  insert_client_external_systems_one: Maybe<ClientExternalSystems>;
  /** insert data into the table: "clients" */
  insert_clients: Maybe<ClientsMutationResponse>;
  /** insert a single row into the table: "clients" */
  insert_clients_one: Maybe<Clients>;
  /** insert data into the table: "external_systems" */
  insert_external_systems: Maybe<ExternalSystemsMutationResponse>;
  /** insert a single row into the table: "external_systems" */
  insert_external_systems_one: Maybe<ExternalSystems>;
  /** insert data into the table: "feature_flags" */
  insert_feature_flags: Maybe<FeatureFlagsMutationResponse>;
  /** insert a single row into the table: "feature_flags" */
  insert_feature_flags_one: Maybe<FeatureFlags>;
  /** insert data into the table: "holidays" */
  insert_holidays: Maybe<HolidaysMutationResponse>;
  /** insert a single row into the table: "holidays" */
  insert_holidays_one: Maybe<Holidays>;
  /** insert data into the table: "latest_payroll_version_results" */
  insert_latest_payroll_version_results: Maybe<LatestPayrollVersionResultsMutationResponse>;
  /** insert a single row into the table: "latest_payroll_version_results" */
  insert_latest_payroll_version_results_one: Maybe<LatestPayrollVersionResults>;
  /** insert data into the table: "leave" */
  insert_leave: Maybe<LeaveMutationResponse>;
  /** insert a single row into the table: "leave" */
  insert_leave_one: Maybe<Leave>;
  /** insert data into the table: "neon_auth.users_sync" */
  insert_neon_auth_users_sync: Maybe<NeonAuthUsersSyncMutationResponse>;
  /** insert a single row into the table: "neon_auth.users_sync" */
  insert_neon_auth_users_sync_one: Maybe<NeonAuthUsersSync>;
  /** insert data into the table: "notes" */
  insert_notes: Maybe<NotesMutationResponse>;
  /** insert a single row into the table: "notes" */
  insert_notes_one: Maybe<Notes>;
  /** insert data into the table: "payroll_activation_results" */
  insert_payroll_activation_results: Maybe<PayrollActivationResultsMutationResponse>;
  /** insert a single row into the table: "payroll_activation_results" */
  insert_payroll_activation_results_one: Maybe<PayrollActivationResults>;
  /** insert data into the table: "payroll_assignment_audit" */
  insert_payroll_assignment_audit: Maybe<PayrollAssignmentAuditMutationResponse>;
  /** insert a single row into the table: "payroll_assignment_audit" */
  insert_payroll_assignment_audit_one: Maybe<PayrollAssignmentAudit>;
  /** insert data into the table: "payroll_assignments" */
  insert_payroll_assignments: Maybe<PayrollAssignmentsMutationResponse>;
  /** insert a single row into the table: "payroll_assignments" */
  insert_payroll_assignments_one: Maybe<PayrollAssignments>;
  /** insert data into the table: "payroll_cycles" */
  insert_payroll_cycles: Maybe<PayrollCyclesMutationResponse>;
  /** insert a single row into the table: "payroll_cycles" */
  insert_payroll_cycles_one: Maybe<PayrollCycles>;
  /** insert data into the table: "payroll_date_types" */
  insert_payroll_date_types: Maybe<PayrollDateTypesMutationResponse>;
  /** insert a single row into the table: "payroll_date_types" */
  insert_payroll_date_types_one: Maybe<PayrollDateTypes>;
  /** insert data into the table: "payroll_dates" */
  insert_payroll_dates: Maybe<PayrollDatesMutationResponse>;
  /** insert a single row into the table: "payroll_dates" */
  insert_payroll_dates_one: Maybe<PayrollDates>;
  /** insert data into the table: "payroll_version_history_results" */
  insert_payroll_version_history_results: Maybe<PayrollVersionHistoryResultsMutationResponse>;
  /** insert a single row into the table: "payroll_version_history_results" */
  insert_payroll_version_history_results_one: Maybe<PayrollVersionHistoryResults>;
  /** insert data into the table: "payroll_version_results" */
  insert_payroll_version_results: Maybe<PayrollVersionResultsMutationResponse>;
  /** insert a single row into the table: "payroll_version_results" */
  insert_payroll_version_results_one: Maybe<PayrollVersionResults>;
  /** insert data into the table: "payrolls" */
  insert_payrolls: Maybe<PayrollsMutationResponse>;
  /** insert a single row into the table: "payrolls" */
  insert_payrolls_one: Maybe<Payrolls>;
  /** insert data into the table: "permissions" */
  insert_permissions: Maybe<PermissionsMutationResponse>;
  /** insert a single row into the table: "permissions" */
  insert_permissions_one: Maybe<Permissions>;
  /** insert data into the table: "resources" */
  insert_resources: Maybe<ResourcesMutationResponse>;
  /** insert a single row into the table: "resources" */
  insert_resources_one: Maybe<Resources>;
  /** insert data into the table: "role_permissions" */
  insert_role_permissions: Maybe<RolePermissionsMutationResponse>;
  /** insert a single row into the table: "role_permissions" */
  insert_role_permissions_one: Maybe<RolePermissions>;
  /** insert data into the table: "roles" */
  insert_roles: Maybe<RolesMutationResponse>;
  /** insert a single row into the table: "roles" */
  insert_roles_one: Maybe<Roles>;
  /** insert data into the table: "user_roles" */
  insert_user_roles: Maybe<UserRolesMutationResponse>;
  /** insert a single row into the table: "user_roles" */
  insert_user_roles_one: Maybe<UserRoles>;
  /** insert data into the table: "users" */
  insert_users: Maybe<UsersMutationResponse>;
  /** insert a single row into the table: "users" */
  insert_users_one: Maybe<Users>;
  /** insert data into the table: "users_role_backup" */
  insert_users_role_backup: Maybe<UsersRoleBackupMutationResponse>;
  /** insert a single row into the table: "users_role_backup" */
  insert_users_role_backup_one: Maybe<UsersRoleBackup>;
  /** insert data into the table: "work_schedule" */
  insert_work_schedule: Maybe<WorkScheduleMutationResponse>;
  /** insert a single row into the table: "work_schedule" */
  insert_work_schedule_one: Maybe<WorkSchedule>;
  /** Log audit events for SOC2 compliance */
  logAuditEvent: Maybe<AuditEventResponse>;
  /** update data of the table: "adjustment_rules" */
  update_adjustment_rules: Maybe<AdjustmentRulesMutationResponse>;
  /** update single row of the table: "adjustment_rules" */
  update_adjustment_rules_by_pk: Maybe<AdjustmentRules>;
  /** update multiples rows of table: "adjustment_rules" */
  update_adjustment_rules_many: Maybe<Array<Maybe<AdjustmentRulesMutationResponse>>>;
  /** update data of the table: "app_settings" */
  update_app_settings: Maybe<AppSettingsMutationResponse>;
  /** update single row of the table: "app_settings" */
  update_app_settings_by_pk: Maybe<AppSettings>;
  /** update multiples rows of table: "app_settings" */
  update_app_settings_many: Maybe<Array<Maybe<AppSettingsMutationResponse>>>;
  /** update data of the table: "audit.audit_log" */
  update_audit_audit_log: Maybe<AuditAuditLogMutationResponse>;
  /** update single row of the table: "audit.audit_log" */
  update_audit_audit_log_by_pk: Maybe<AuditAuditLog>;
  /** update multiples rows of table: "audit.audit_log" */
  update_audit_audit_log_many: Maybe<Array<Maybe<AuditAuditLogMutationResponse>>>;
  /** update data of the table: "audit.auth_events" */
  update_audit_auth_events: Maybe<AuditAuthEventsMutationResponse>;
  /** update single row of the table: "audit.auth_events" */
  update_audit_auth_events_by_pk: Maybe<AuditAuthEvents>;
  /** update multiples rows of table: "audit.auth_events" */
  update_audit_auth_events_many: Maybe<Array<Maybe<AuditAuthEventsMutationResponse>>>;
  /** update data of the table: "audit.data_access_log" */
  update_audit_data_access_log: Maybe<AuditDataAccessLogMutationResponse>;
  /** update single row of the table: "audit.data_access_log" */
  update_audit_data_access_log_by_pk: Maybe<AuditDataAccessLog>;
  /** update multiples rows of table: "audit.data_access_log" */
  update_audit_data_access_log_many: Maybe<Array<Maybe<AuditDataAccessLogMutationResponse>>>;
  /** update data of the table: "audit.permission_changes" */
  update_audit_permission_changes: Maybe<AuditPermissionChangesMutationResponse>;
  /** update single row of the table: "audit.permission_changes" */
  update_audit_permission_changes_by_pk: Maybe<AuditPermissionChanges>;
  /** update multiples rows of table: "audit.permission_changes" */
  update_audit_permission_changes_many: Maybe<Array<Maybe<AuditPermissionChangesMutationResponse>>>;
  /** update data of the table: "audit.slow_queries" */
  update_audit_slow_queries: Maybe<AuditSlowQueriesMutationResponse>;
  /** update single row of the table: "audit.slow_queries" */
  update_audit_slow_queries_by_pk: Maybe<AuditSlowQueries>;
  /** update multiples rows of table: "audit.slow_queries" */
  update_audit_slow_queries_many: Maybe<Array<Maybe<AuditSlowQueriesMutationResponse>>>;
  /** update data of the table: "audit.user_access_summary" */
  update_audit_user_access_summary: Maybe<AuditUserAccessSummaryMutationResponse>;
  /** update multiples rows of table: "audit.user_access_summary" */
  update_audit_user_access_summary_many: Maybe<Array<Maybe<AuditUserAccessSummaryMutationResponse>>>;
  /** update data of the table: "billing_event_log" */
  update_billing_event_log: Maybe<BillingEventLogMutationResponse>;
  /** update single row of the table: "billing_event_log" */
  update_billing_event_log_by_pk: Maybe<BillingEventLog>;
  /** update multiples rows of table: "billing_event_log" */
  update_billing_event_log_many: Maybe<Array<Maybe<BillingEventLogMutationResponse>>>;
  /** update data of the table: "billing_invoice" */
  update_billing_invoice: Maybe<BillingInvoiceMutationResponse>;
  /** update single row of the table: "billing_invoice" */
  update_billing_invoice_by_pk: Maybe<BillingInvoice>;
  /** update data of the table: "billing_invoice_item" */
  update_billing_invoice_item: Maybe<BillingInvoiceItemMutationResponse>;
  /** update single row of the table: "billing_invoice_item" */
  update_billing_invoice_item_by_pk: Maybe<BillingInvoiceItem>;
  /** update multiples rows of table: "billing_invoice_item" */
  update_billing_invoice_item_many: Maybe<Array<Maybe<BillingInvoiceItemMutationResponse>>>;
  /** update multiples rows of table: "billing_invoice" */
  update_billing_invoice_many: Maybe<Array<Maybe<BillingInvoiceMutationResponse>>>;
  /** update data of the table: "billing_invoices" */
  update_billing_invoices: Maybe<BillingInvoicesMutationResponse>;
  /** update single row of the table: "billing_invoices" */
  update_billing_invoices_by_pk: Maybe<BillingInvoices>;
  /** update multiples rows of table: "billing_invoices" */
  update_billing_invoices_many: Maybe<Array<Maybe<BillingInvoicesMutationResponse>>>;
  /** update data of the table: "billing_items" */
  update_billing_items: Maybe<BillingItemsMutationResponse>;
  /** update single row of the table: "billing_items" */
  update_billing_items_by_pk: Maybe<BillingItems>;
  /** update multiples rows of table: "billing_items" */
  update_billing_items_many: Maybe<Array<Maybe<BillingItemsMutationResponse>>>;
  /** update data of the table: "billing_plan" */
  update_billing_plan: Maybe<BillingPlanMutationResponse>;
  /** update single row of the table: "billing_plan" */
  update_billing_plan_by_pk: Maybe<BillingPlan>;
  /** update multiples rows of table: "billing_plan" */
  update_billing_plan_many: Maybe<Array<Maybe<BillingPlanMutationResponse>>>;
  /** update data of the table: "client_billing_assignment" */
  update_client_billing_assignment: Maybe<ClientBillingAssignmentMutationResponse>;
  /** update single row of the table: "client_billing_assignment" */
  update_client_billing_assignment_by_pk: Maybe<ClientBillingAssignment>;
  /** update multiples rows of table: "client_billing_assignment" */
  update_client_billing_assignment_many: Maybe<Array<Maybe<ClientBillingAssignmentMutationResponse>>>;
  /** update data of the table: "client_external_systems" */
  update_client_external_systems: Maybe<ClientExternalSystemsMutationResponse>;
  /** update single row of the table: "client_external_systems" */
  update_client_external_systems_by_pk: Maybe<ClientExternalSystems>;
  /** update multiples rows of table: "client_external_systems" */
  update_client_external_systems_many: Maybe<Array<Maybe<ClientExternalSystemsMutationResponse>>>;
  /** update data of the table: "clients" */
  update_clients: Maybe<ClientsMutationResponse>;
  /** update single row of the table: "clients" */
  update_clients_by_pk: Maybe<Clients>;
  /** update multiples rows of table: "clients" */
  update_clients_many: Maybe<Array<Maybe<ClientsMutationResponse>>>;
  /** update data of the table: "external_systems" */
  update_external_systems: Maybe<ExternalSystemsMutationResponse>;
  /** update single row of the table: "external_systems" */
  update_external_systems_by_pk: Maybe<ExternalSystems>;
  /** update multiples rows of table: "external_systems" */
  update_external_systems_many: Maybe<Array<Maybe<ExternalSystemsMutationResponse>>>;
  /** update data of the table: "feature_flags" */
  update_feature_flags: Maybe<FeatureFlagsMutationResponse>;
  /** update single row of the table: "feature_flags" */
  update_feature_flags_by_pk: Maybe<FeatureFlags>;
  /** update multiples rows of table: "feature_flags" */
  update_feature_flags_many: Maybe<Array<Maybe<FeatureFlagsMutationResponse>>>;
  /** update data of the table: "holidays" */
  update_holidays: Maybe<HolidaysMutationResponse>;
  /** update single row of the table: "holidays" */
  update_holidays_by_pk: Maybe<Holidays>;
  /** update multiples rows of table: "holidays" */
  update_holidays_many: Maybe<Array<Maybe<HolidaysMutationResponse>>>;
  /** update data of the table: "latest_payroll_version_results" */
  update_latest_payroll_version_results: Maybe<LatestPayrollVersionResultsMutationResponse>;
  /** update single row of the table: "latest_payroll_version_results" */
  update_latest_payroll_version_results_by_pk: Maybe<LatestPayrollVersionResults>;
  /** update multiples rows of table: "latest_payroll_version_results" */
  update_latest_payroll_version_results_many: Maybe<Array<Maybe<LatestPayrollVersionResultsMutationResponse>>>;
  /** update data of the table: "leave" */
  update_leave: Maybe<LeaveMutationResponse>;
  /** update single row of the table: "leave" */
  update_leave_by_pk: Maybe<Leave>;
  /** update multiples rows of table: "leave" */
  update_leave_many: Maybe<Array<Maybe<LeaveMutationResponse>>>;
  /** update data of the table: "neon_auth.users_sync" */
  update_neon_auth_users_sync: Maybe<NeonAuthUsersSyncMutationResponse>;
  /** update single row of the table: "neon_auth.users_sync" */
  update_neon_auth_users_sync_by_pk: Maybe<NeonAuthUsersSync>;
  /** update multiples rows of table: "neon_auth.users_sync" */
  update_neon_auth_users_sync_many: Maybe<Array<Maybe<NeonAuthUsersSyncMutationResponse>>>;
  /** update data of the table: "notes" */
  update_notes: Maybe<NotesMutationResponse>;
  /** update single row of the table: "notes" */
  update_notes_by_pk: Maybe<Notes>;
  /** update multiples rows of table: "notes" */
  update_notes_many: Maybe<Array<Maybe<NotesMutationResponse>>>;
  /** update data of the table: "payroll_activation_results" */
  update_payroll_activation_results: Maybe<PayrollActivationResultsMutationResponse>;
  /** update single row of the table: "payroll_activation_results" */
  update_payroll_activation_results_by_pk: Maybe<PayrollActivationResults>;
  /** update multiples rows of table: "payroll_activation_results" */
  update_payroll_activation_results_many: Maybe<Array<Maybe<PayrollActivationResultsMutationResponse>>>;
  /** update data of the table: "payroll_assignment_audit" */
  update_payroll_assignment_audit: Maybe<PayrollAssignmentAuditMutationResponse>;
  /** update single row of the table: "payroll_assignment_audit" */
  update_payroll_assignment_audit_by_pk: Maybe<PayrollAssignmentAudit>;
  /** update multiples rows of table: "payroll_assignment_audit" */
  update_payroll_assignment_audit_many: Maybe<Array<Maybe<PayrollAssignmentAuditMutationResponse>>>;
  /** update data of the table: "payroll_assignments" */
  update_payroll_assignments: Maybe<PayrollAssignmentsMutationResponse>;
  /** update single row of the table: "payroll_assignments" */
  update_payroll_assignments_by_pk: Maybe<PayrollAssignments>;
  /** update multiples rows of table: "payroll_assignments" */
  update_payroll_assignments_many: Maybe<Array<Maybe<PayrollAssignmentsMutationResponse>>>;
  /** update data of the table: "payroll_cycles" */
  update_payroll_cycles: Maybe<PayrollCyclesMutationResponse>;
  /** update single row of the table: "payroll_cycles" */
  update_payroll_cycles_by_pk: Maybe<PayrollCycles>;
  /** update multiples rows of table: "payroll_cycles" */
  update_payroll_cycles_many: Maybe<Array<Maybe<PayrollCyclesMutationResponse>>>;
  /** update data of the table: "payroll_date_types" */
  update_payroll_date_types: Maybe<PayrollDateTypesMutationResponse>;
  /** update single row of the table: "payroll_date_types" */
  update_payroll_date_types_by_pk: Maybe<PayrollDateTypes>;
  /** update multiples rows of table: "payroll_date_types" */
  update_payroll_date_types_many: Maybe<Array<Maybe<PayrollDateTypesMutationResponse>>>;
  /** update data of the table: "payroll_dates" */
  update_payroll_dates: Maybe<PayrollDatesMutationResponse>;
  /** update single row of the table: "payroll_dates" */
  update_payroll_dates_by_pk: Maybe<PayrollDates>;
  /** update multiples rows of table: "payroll_dates" */
  update_payroll_dates_many: Maybe<Array<Maybe<PayrollDatesMutationResponse>>>;
  /** update data of the table: "payroll_version_history_results" */
  update_payroll_version_history_results: Maybe<PayrollVersionHistoryResultsMutationResponse>;
  /** update single row of the table: "payroll_version_history_results" */
  update_payroll_version_history_results_by_pk: Maybe<PayrollVersionHistoryResults>;
  /** update multiples rows of table: "payroll_version_history_results" */
  update_payroll_version_history_results_many: Maybe<Array<Maybe<PayrollVersionHistoryResultsMutationResponse>>>;
  /** update data of the table: "payroll_version_results" */
  update_payroll_version_results: Maybe<PayrollVersionResultsMutationResponse>;
  /** update single row of the table: "payroll_version_results" */
  update_payroll_version_results_by_pk: Maybe<PayrollVersionResults>;
  /** update multiples rows of table: "payroll_version_results" */
  update_payroll_version_results_many: Maybe<Array<Maybe<PayrollVersionResultsMutationResponse>>>;
  /** update data of the table: "payrolls" */
  update_payrolls: Maybe<PayrollsMutationResponse>;
  /** update single row of the table: "payrolls" */
  update_payrolls_by_pk: Maybe<Payrolls>;
  /** update multiples rows of table: "payrolls" */
  update_payrolls_many: Maybe<Array<Maybe<PayrollsMutationResponse>>>;
  /** update data of the table: "permissions" */
  update_permissions: Maybe<PermissionsMutationResponse>;
  /** update single row of the table: "permissions" */
  update_permissions_by_pk: Maybe<Permissions>;
  /** update multiples rows of table: "permissions" */
  update_permissions_many: Maybe<Array<Maybe<PermissionsMutationResponse>>>;
  /** update data of the table: "resources" */
  update_resources: Maybe<ResourcesMutationResponse>;
  /** update single row of the table: "resources" */
  update_resources_by_pk: Maybe<Resources>;
  /** update multiples rows of table: "resources" */
  update_resources_many: Maybe<Array<Maybe<ResourcesMutationResponse>>>;
  /** update data of the table: "role_permissions" */
  update_role_permissions: Maybe<RolePermissionsMutationResponse>;
  /** update single row of the table: "role_permissions" */
  update_role_permissions_by_pk: Maybe<RolePermissions>;
  /** update multiples rows of table: "role_permissions" */
  update_role_permissions_many: Maybe<Array<Maybe<RolePermissionsMutationResponse>>>;
  /** update data of the table: "roles" */
  update_roles: Maybe<RolesMutationResponse>;
  /** update single row of the table: "roles" */
  update_roles_by_pk: Maybe<Roles>;
  /** update multiples rows of table: "roles" */
  update_roles_many: Maybe<Array<Maybe<RolesMutationResponse>>>;
  /** update data of the table: "user_roles" */
  update_user_roles: Maybe<UserRolesMutationResponse>;
  /** update single row of the table: "user_roles" */
  update_user_roles_by_pk: Maybe<UserRoles>;
  /** update multiples rows of table: "user_roles" */
  update_user_roles_many: Maybe<Array<Maybe<UserRolesMutationResponse>>>;
  /** update data of the table: "users" */
  update_users: Maybe<UsersMutationResponse>;
  /** update single row of the table: "users" */
  update_users_by_pk: Maybe<Users>;
  /** update multiples rows of table: "users" */
  update_users_many: Maybe<Array<Maybe<UsersMutationResponse>>>;
  /** update data of the table: "users_role_backup" */
  update_users_role_backup: Maybe<UsersRoleBackupMutationResponse>;
  /** update multiples rows of table: "users_role_backup" */
  update_users_role_backup_many: Maybe<Array<Maybe<UsersRoleBackupMutationResponse>>>;
  /** update data of the table: "work_schedule" */
  update_work_schedule: Maybe<WorkScheduleMutationResponse>;
  /** update single row of the table: "work_schedule" */
  update_work_schedule_by_pk: Maybe<WorkSchedule>;
  /** update multiples rows of table: "work_schedule" */
  update_work_schedule_many: Maybe<Array<Maybe<WorkScheduleMutationResponse>>>;
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
export type MutationRootDeleteAdjustmentRulesArgs = {
  where: AdjustmentRulesBoolExp;
};


/** mutation root */
export type MutationRootDeleteAdjustmentRulesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteAppSettingsArgs = {
  where: AppSettingsBoolExp;
};


/** mutation root */
export type MutationRootDeleteAppSettingsByPkArgs = {
  id: Scalars['String']['input'];
};


/** mutation root */
export type MutationRootDeleteAuditAuditLogArgs = {
  where: AuditAuditLogBoolExp;
};


/** mutation root */
export type MutationRootDeleteAuditAuditLogByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteAuditAuthEventsArgs = {
  where: AuditAuthEventsBoolExp;
};


/** mutation root */
export type MutationRootDeleteAuditAuthEventsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteAuditDataAccessLogArgs = {
  where: AuditDataAccessLogBoolExp;
};


/** mutation root */
export type MutationRootDeleteAuditDataAccessLogByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteAuditPermissionChangesArgs = {
  where: AuditPermissionChangesBoolExp;
};


/** mutation root */
export type MutationRootDeleteAuditPermissionChangesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteAuditSlowQueriesArgs = {
  where: AuditSlowQueriesBoolExp;
};


/** mutation root */
export type MutationRootDeleteAuditSlowQueriesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteAuditUserAccessSummaryArgs = {
  where: AuditUserAccessSummaryBoolExp;
};


/** mutation root */
export type MutationRootDeleteBillingEventLogArgs = {
  where: BillingEventLogBoolExp;
};


/** mutation root */
export type MutationRootDeleteBillingEventLogByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteBillingInvoiceArgs = {
  where: BillingInvoiceBoolExp;
};


/** mutation root */
export type MutationRootDeleteBillingInvoiceByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteBillingInvoiceItemArgs = {
  where: BillingInvoiceItemBoolExp;
};


/** mutation root */
export type MutationRootDeleteBillingInvoiceItemByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteBillingInvoicesArgs = {
  where: BillingInvoicesBoolExp;
};


/** mutation root */
export type MutationRootDeleteBillingInvoicesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteBillingItemsArgs = {
  where: BillingItemsBoolExp;
};


/** mutation root */
export type MutationRootDeleteBillingItemsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteBillingPlanArgs = {
  where: BillingPlanBoolExp;
};


/** mutation root */
export type MutationRootDeleteBillingPlanByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteClientBillingAssignmentArgs = {
  where: ClientBillingAssignmentBoolExp;
};


/** mutation root */
export type MutationRootDeleteClientBillingAssignmentByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteClientExternalSystemsArgs = {
  where: ClientExternalSystemsBoolExp;
};


/** mutation root */
export type MutationRootDeleteClientExternalSystemsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteClientsArgs = {
  where: ClientsBoolExp;
};


/** mutation root */
export type MutationRootDeleteClientsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteExternalSystemsArgs = {
  where: ExternalSystemsBoolExp;
};


/** mutation root */
export type MutationRootDeleteExternalSystemsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteFeatureFlagsArgs = {
  where: FeatureFlagsBoolExp;
};


/** mutation root */
export type MutationRootDeleteFeatureFlagsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteHolidaysArgs = {
  where: HolidaysBoolExp;
};


/** mutation root */
export type MutationRootDeleteHolidaysByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteLatestPayrollVersionResultsArgs = {
  where: LatestPayrollVersionResultsBoolExp;
};


/** mutation root */
export type MutationRootDeleteLatestPayrollVersionResultsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteLeaveArgs = {
  where: LeaveBoolExp;
};


/** mutation root */
export type MutationRootDeleteLeaveByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteNeonAuthUsersSyncArgs = {
  where: NeonAuthUsersSyncBoolExp;
};


/** mutation root */
export type MutationRootDeleteNeonAuthUsersSyncByPkArgs = {
  id: Scalars['String']['input'];
};


/** mutation root */
export type MutationRootDeleteNotesArgs = {
  where: NotesBoolExp;
};


/** mutation root */
export type MutationRootDeleteNotesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollActivationResultsArgs = {
  where: PayrollActivationResultsBoolExp;
};


/** mutation root */
export type MutationRootDeletePayrollActivationResultsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollAssignmentAuditArgs = {
  where: PayrollAssignmentAuditBoolExp;
};


/** mutation root */
export type MutationRootDeletePayrollAssignmentAuditByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollAssignmentsArgs = {
  where: PayrollAssignmentsBoolExp;
};


/** mutation root */
export type MutationRootDeletePayrollAssignmentsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollCyclesArgs = {
  where: PayrollCyclesBoolExp;
};


/** mutation root */
export type MutationRootDeletePayrollCyclesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollDateTypesArgs = {
  where: PayrollDateTypesBoolExp;
};


/** mutation root */
export type MutationRootDeletePayrollDateTypesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollDatesArgs = {
  where: PayrollDatesBoolExp;
};


/** mutation root */
export type MutationRootDeletePayrollDatesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollVersionHistoryResultsArgs = {
  where: PayrollVersionHistoryResultsBoolExp;
};


/** mutation root */
export type MutationRootDeletePayrollVersionHistoryResultsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollVersionResultsArgs = {
  where: PayrollVersionResultsBoolExp;
};


/** mutation root */
export type MutationRootDeletePayrollVersionResultsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePayrollsArgs = {
  where: PayrollsBoolExp;
};


/** mutation root */
export type MutationRootDeletePayrollsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeletePermissionsArgs = {
  where: PermissionsBoolExp;
};


/** mutation root */
export type MutationRootDeletePermissionsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteResourcesArgs = {
  where: ResourcesBoolExp;
};


/** mutation root */
export type MutationRootDeleteResourcesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteRolePermissionsArgs = {
  where: RolePermissionsBoolExp;
};


/** mutation root */
export type MutationRootDeleteRolePermissionsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteRolesArgs = {
  where: RolesBoolExp;
};


/** mutation root */
export type MutationRootDeleteRolesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteUserRolesArgs = {
  where: UserRolesBoolExp;
};


/** mutation root */
export type MutationRootDeleteUserRolesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteUsersArgs = {
  where: UsersBoolExp;
};


/** mutation root */
export type MutationRootDeleteUsersByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteUsersRoleBackupArgs = {
  where: UsersRoleBackupBoolExp;
};


/** mutation root */
export type MutationRootDeleteWorkScheduleArgs = {
  where: WorkScheduleBoolExp;
};


/** mutation root */
export type MutationRootDeleteWorkScheduleByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootGenerateComplianceReportArgs = {
  input: ComplianceReportInput;
};


/** mutation root */
export type MutationRootInsertAdjustmentRulesArgs = {
  objects: Array<AdjustmentRulesInsertInput>;
  on_conflict?: InputMaybe<AdjustmentRulesOnConflict>;
};


/** mutation root */
export type MutationRootInsertAdjustmentRulesOneArgs = {
  object: AdjustmentRulesInsertInput;
  on_conflict?: InputMaybe<AdjustmentRulesOnConflict>;
};


/** mutation root */
export type MutationRootInsertAppSettingsArgs = {
  objects: Array<AppSettingsInsertInput>;
  on_conflict?: InputMaybe<AppSettingsOnConflict>;
};


/** mutation root */
export type MutationRootInsertAppSettingsOneArgs = {
  object: AppSettingsInsertInput;
  on_conflict?: InputMaybe<AppSettingsOnConflict>;
};


/** mutation root */
export type MutationRootInsertAuditAuditLogArgs = {
  objects: Array<AuditAuditLogInsertInput>;
  on_conflict?: InputMaybe<AuditAuditLogOnConflict>;
};


/** mutation root */
export type MutationRootInsertAuditAuditLogOneArgs = {
  object: AuditAuditLogInsertInput;
  on_conflict?: InputMaybe<AuditAuditLogOnConflict>;
};


/** mutation root */
export type MutationRootInsertAuditAuthEventsArgs = {
  objects: Array<AuditAuthEventsInsertInput>;
  on_conflict?: InputMaybe<AuditAuthEventsOnConflict>;
};


/** mutation root */
export type MutationRootInsertAuditAuthEventsOneArgs = {
  object: AuditAuthEventsInsertInput;
  on_conflict?: InputMaybe<AuditAuthEventsOnConflict>;
};


/** mutation root */
export type MutationRootInsertAuditDataAccessLogArgs = {
  objects: Array<AuditDataAccessLogInsertInput>;
  on_conflict?: InputMaybe<AuditDataAccessLogOnConflict>;
};


/** mutation root */
export type MutationRootInsertAuditDataAccessLogOneArgs = {
  object: AuditDataAccessLogInsertInput;
  on_conflict?: InputMaybe<AuditDataAccessLogOnConflict>;
};


/** mutation root */
export type MutationRootInsertAuditPermissionChangesArgs = {
  objects: Array<AuditPermissionChangesInsertInput>;
  on_conflict?: InputMaybe<AuditPermissionChangesOnConflict>;
};


/** mutation root */
export type MutationRootInsertAuditPermissionChangesOneArgs = {
  object: AuditPermissionChangesInsertInput;
  on_conflict?: InputMaybe<AuditPermissionChangesOnConflict>;
};


/** mutation root */
export type MutationRootInsertAuditSlowQueriesArgs = {
  objects: Array<AuditSlowQueriesInsertInput>;
  on_conflict?: InputMaybe<AuditSlowQueriesOnConflict>;
};


/** mutation root */
export type MutationRootInsertAuditSlowQueriesOneArgs = {
  object: AuditSlowQueriesInsertInput;
  on_conflict?: InputMaybe<AuditSlowQueriesOnConflict>;
};


/** mutation root */
export type MutationRootInsertAuditUserAccessSummaryArgs = {
  objects: Array<AuditUserAccessSummaryInsertInput>;
};


/** mutation root */
export type MutationRootInsertAuditUserAccessSummaryOneArgs = {
  object: AuditUserAccessSummaryInsertInput;
};


/** mutation root */
export type MutationRootInsertBillingEventLogArgs = {
  objects: Array<BillingEventLogInsertInput>;
  on_conflict?: InputMaybe<BillingEventLogOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingEventLogOneArgs = {
  object: BillingEventLogInsertInput;
  on_conflict?: InputMaybe<BillingEventLogOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingInvoiceArgs = {
  objects: Array<BillingInvoiceInsertInput>;
  on_conflict?: InputMaybe<BillingInvoiceOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingInvoiceItemArgs = {
  objects: Array<BillingInvoiceItemInsertInput>;
  on_conflict?: InputMaybe<BillingInvoiceItemOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingInvoiceItemOneArgs = {
  object: BillingInvoiceItemInsertInput;
  on_conflict?: InputMaybe<BillingInvoiceItemOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingInvoiceOneArgs = {
  object: BillingInvoiceInsertInput;
  on_conflict?: InputMaybe<BillingInvoiceOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingInvoicesArgs = {
  objects: Array<BillingInvoicesInsertInput>;
  on_conflict?: InputMaybe<BillingInvoicesOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingInvoicesOneArgs = {
  object: BillingInvoicesInsertInput;
  on_conflict?: InputMaybe<BillingInvoicesOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingItemsArgs = {
  objects: Array<BillingItemsInsertInput>;
  on_conflict?: InputMaybe<BillingItemsOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingItemsOneArgs = {
  object: BillingItemsInsertInput;
  on_conflict?: InputMaybe<BillingItemsOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingPlanArgs = {
  objects: Array<BillingPlanInsertInput>;
  on_conflict?: InputMaybe<BillingPlanOnConflict>;
};


/** mutation root */
export type MutationRootInsertBillingPlanOneArgs = {
  object: BillingPlanInsertInput;
  on_conflict?: InputMaybe<BillingPlanOnConflict>;
};


/** mutation root */
export type MutationRootInsertClientBillingAssignmentArgs = {
  objects: Array<ClientBillingAssignmentInsertInput>;
  on_conflict?: InputMaybe<ClientBillingAssignmentOnConflict>;
};


/** mutation root */
export type MutationRootInsertClientBillingAssignmentOneArgs = {
  object: ClientBillingAssignmentInsertInput;
  on_conflict?: InputMaybe<ClientBillingAssignmentOnConflict>;
};


/** mutation root */
export type MutationRootInsertClientExternalSystemsArgs = {
  objects: Array<ClientExternalSystemsInsertInput>;
  on_conflict?: InputMaybe<ClientExternalSystemsOnConflict>;
};


/** mutation root */
export type MutationRootInsertClientExternalSystemsOneArgs = {
  object: ClientExternalSystemsInsertInput;
  on_conflict?: InputMaybe<ClientExternalSystemsOnConflict>;
};


/** mutation root */
export type MutationRootInsertClientsArgs = {
  objects: Array<ClientsInsertInput>;
  on_conflict?: InputMaybe<ClientsOnConflict>;
};


/** mutation root */
export type MutationRootInsertClientsOneArgs = {
  object: ClientsInsertInput;
  on_conflict?: InputMaybe<ClientsOnConflict>;
};


/** mutation root */
export type MutationRootInsertExternalSystemsArgs = {
  objects: Array<ExternalSystemsInsertInput>;
  on_conflict?: InputMaybe<ExternalSystemsOnConflict>;
};


/** mutation root */
export type MutationRootInsertExternalSystemsOneArgs = {
  object: ExternalSystemsInsertInput;
  on_conflict?: InputMaybe<ExternalSystemsOnConflict>;
};


/** mutation root */
export type MutationRootInsertFeatureFlagsArgs = {
  objects: Array<FeatureFlagsInsertInput>;
  on_conflict?: InputMaybe<FeatureFlagsOnConflict>;
};


/** mutation root */
export type MutationRootInsertFeatureFlagsOneArgs = {
  object: FeatureFlagsInsertInput;
  on_conflict?: InputMaybe<FeatureFlagsOnConflict>;
};


/** mutation root */
export type MutationRootInsertHolidaysArgs = {
  objects: Array<HolidaysInsertInput>;
  on_conflict?: InputMaybe<HolidaysOnConflict>;
};


/** mutation root */
export type MutationRootInsertHolidaysOneArgs = {
  object: HolidaysInsertInput;
  on_conflict?: InputMaybe<HolidaysOnConflict>;
};


/** mutation root */
export type MutationRootInsertLatestPayrollVersionResultsArgs = {
  objects: Array<LatestPayrollVersionResultsInsertInput>;
  on_conflict?: InputMaybe<LatestPayrollVersionResultsOnConflict>;
};


/** mutation root */
export type MutationRootInsertLatestPayrollVersionResultsOneArgs = {
  object: LatestPayrollVersionResultsInsertInput;
  on_conflict?: InputMaybe<LatestPayrollVersionResultsOnConflict>;
};


/** mutation root */
export type MutationRootInsertLeaveArgs = {
  objects: Array<LeaveInsertInput>;
  on_conflict?: InputMaybe<LeaveOnConflict>;
};


/** mutation root */
export type MutationRootInsertLeaveOneArgs = {
  object: LeaveInsertInput;
  on_conflict?: InputMaybe<LeaveOnConflict>;
};


/** mutation root */
export type MutationRootInsertNeonAuthUsersSyncArgs = {
  objects: Array<NeonAuthUsersSyncInsertInput>;
  on_conflict?: InputMaybe<NeonAuthUsersSyncOnConflict>;
};


/** mutation root */
export type MutationRootInsertNeonAuthUsersSyncOneArgs = {
  object: NeonAuthUsersSyncInsertInput;
  on_conflict?: InputMaybe<NeonAuthUsersSyncOnConflict>;
};


/** mutation root */
export type MutationRootInsertNotesArgs = {
  objects: Array<NotesInsertInput>;
  on_conflict?: InputMaybe<NotesOnConflict>;
};


/** mutation root */
export type MutationRootInsertNotesOneArgs = {
  object: NotesInsertInput;
  on_conflict?: InputMaybe<NotesOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollActivationResultsArgs = {
  objects: Array<PayrollActivationResultsInsertInput>;
  on_conflict?: InputMaybe<PayrollActivationResultsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollActivationResultsOneArgs = {
  object: PayrollActivationResultsInsertInput;
  on_conflict?: InputMaybe<PayrollActivationResultsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollAssignmentAuditArgs = {
  objects: Array<PayrollAssignmentAuditInsertInput>;
  on_conflict?: InputMaybe<PayrollAssignmentAuditOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollAssignmentAuditOneArgs = {
  object: PayrollAssignmentAuditInsertInput;
  on_conflict?: InputMaybe<PayrollAssignmentAuditOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollAssignmentsArgs = {
  objects: Array<PayrollAssignmentsInsertInput>;
  on_conflict?: InputMaybe<PayrollAssignmentsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollAssignmentsOneArgs = {
  object: PayrollAssignmentsInsertInput;
  on_conflict?: InputMaybe<PayrollAssignmentsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollCyclesArgs = {
  objects: Array<PayrollCyclesInsertInput>;
  on_conflict?: InputMaybe<PayrollCyclesOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollCyclesOneArgs = {
  object: PayrollCyclesInsertInput;
  on_conflict?: InputMaybe<PayrollCyclesOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollDateTypesArgs = {
  objects: Array<PayrollDateTypesInsertInput>;
  on_conflict?: InputMaybe<PayrollDateTypesOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollDateTypesOneArgs = {
  object: PayrollDateTypesInsertInput;
  on_conflict?: InputMaybe<PayrollDateTypesOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollDatesArgs = {
  objects: Array<PayrollDatesInsertInput>;
  on_conflict?: InputMaybe<PayrollDatesOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollDatesOneArgs = {
  object: PayrollDatesInsertInput;
  on_conflict?: InputMaybe<PayrollDatesOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollVersionHistoryResultsArgs = {
  objects: Array<PayrollVersionHistoryResultsInsertInput>;
  on_conflict?: InputMaybe<PayrollVersionHistoryResultsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollVersionHistoryResultsOneArgs = {
  object: PayrollVersionHistoryResultsInsertInput;
  on_conflict?: InputMaybe<PayrollVersionHistoryResultsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollVersionResultsArgs = {
  objects: Array<PayrollVersionResultsInsertInput>;
  on_conflict?: InputMaybe<PayrollVersionResultsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollVersionResultsOneArgs = {
  object: PayrollVersionResultsInsertInput;
  on_conflict?: InputMaybe<PayrollVersionResultsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollsArgs = {
  objects: Array<PayrollsInsertInput>;
  on_conflict?: InputMaybe<PayrollsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPayrollsOneArgs = {
  object: PayrollsInsertInput;
  on_conflict?: InputMaybe<PayrollsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPermissionsArgs = {
  objects: Array<PermissionsInsertInput>;
  on_conflict?: InputMaybe<PermissionsOnConflict>;
};


/** mutation root */
export type MutationRootInsertPermissionsOneArgs = {
  object: PermissionsInsertInput;
  on_conflict?: InputMaybe<PermissionsOnConflict>;
};


/** mutation root */
export type MutationRootInsertResourcesArgs = {
  objects: Array<ResourcesInsertInput>;
  on_conflict?: InputMaybe<ResourcesOnConflict>;
};


/** mutation root */
export type MutationRootInsertResourcesOneArgs = {
  object: ResourcesInsertInput;
  on_conflict?: InputMaybe<ResourcesOnConflict>;
};


/** mutation root */
export type MutationRootInsertRolePermissionsArgs = {
  objects: Array<RolePermissionsInsertInput>;
  on_conflict?: InputMaybe<RolePermissionsOnConflict>;
};


/** mutation root */
export type MutationRootInsertRolePermissionsOneArgs = {
  object: RolePermissionsInsertInput;
  on_conflict?: InputMaybe<RolePermissionsOnConflict>;
};


/** mutation root */
export type MutationRootInsertRolesArgs = {
  objects: Array<RolesInsertInput>;
  on_conflict?: InputMaybe<RolesOnConflict>;
};


/** mutation root */
export type MutationRootInsertRolesOneArgs = {
  object: RolesInsertInput;
  on_conflict?: InputMaybe<RolesOnConflict>;
};


/** mutation root */
export type MutationRootInsertUserRolesArgs = {
  objects: Array<UserRolesInsertInput>;
  on_conflict?: InputMaybe<UserRolesOnConflict>;
};


/** mutation root */
export type MutationRootInsertUserRolesOneArgs = {
  object: UserRolesInsertInput;
  on_conflict?: InputMaybe<UserRolesOnConflict>;
};


/** mutation root */
export type MutationRootInsertUsersArgs = {
  objects: Array<UsersInsertInput>;
  on_conflict?: InputMaybe<UsersOnConflict>;
};


/** mutation root */
export type MutationRootInsertUsersOneArgs = {
  object: UsersInsertInput;
  on_conflict?: InputMaybe<UsersOnConflict>;
};


/** mutation root */
export type MutationRootInsertUsersRoleBackupArgs = {
  objects: Array<UsersRoleBackupInsertInput>;
};


/** mutation root */
export type MutationRootInsertUsersRoleBackupOneArgs = {
  object: UsersRoleBackupInsertInput;
};


/** mutation root */
export type MutationRootInsertWorkScheduleArgs = {
  objects: Array<WorkScheduleInsertInput>;
  on_conflict?: InputMaybe<WorkScheduleOnConflict>;
};


/** mutation root */
export type MutationRootInsertWorkScheduleOneArgs = {
  object: WorkScheduleInsertInput;
  on_conflict?: InputMaybe<WorkScheduleOnConflict>;
};


/** mutation root */
export type MutationRootLogAuditEventArgs = {
  event: AuditEventInput;
};


/** mutation root */
export type MutationRootUpdateAdjustmentRulesArgs = {
  _set?: InputMaybe<AdjustmentRulesSetInput>;
  where: AdjustmentRulesBoolExp;
};


/** mutation root */
export type MutationRootUpdateAdjustmentRulesByPkArgs = {
  _set?: InputMaybe<AdjustmentRulesSetInput>;
  pk_columns: AdjustmentRulesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateAdjustmentRulesManyArgs = {
  updates: Array<AdjustmentRulesUpdates>;
};


/** mutation root */
export type MutationRootUpdateAppSettingsArgs = {
  _append?: InputMaybe<AppSettingsAppendInput>;
  _delete_at_path?: InputMaybe<AppSettingsDeleteAtPathInput>;
  _delete_elem?: InputMaybe<AppSettingsDeleteElemInput>;
  _delete_key?: InputMaybe<AppSettingsDeleteKeyInput>;
  _prepend?: InputMaybe<AppSettingsPrependInput>;
  _set?: InputMaybe<AppSettingsSetInput>;
  where: AppSettingsBoolExp;
};


/** mutation root */
export type MutationRootUpdateAppSettingsByPkArgs = {
  _append?: InputMaybe<AppSettingsAppendInput>;
  _delete_at_path?: InputMaybe<AppSettingsDeleteAtPathInput>;
  _delete_elem?: InputMaybe<AppSettingsDeleteElemInput>;
  _delete_key?: InputMaybe<AppSettingsDeleteKeyInput>;
  _prepend?: InputMaybe<AppSettingsPrependInput>;
  _set?: InputMaybe<AppSettingsSetInput>;
  pk_columns: AppSettingsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateAppSettingsManyArgs = {
  updates: Array<AppSettingsUpdates>;
};


/** mutation root */
export type MutationRootUpdateAuditAuditLogArgs = {
  _append?: InputMaybe<AuditAuditLogAppendInput>;
  _delete_at_path?: InputMaybe<AuditAuditLogDeleteAtPathInput>;
  _delete_elem?: InputMaybe<AuditAuditLogDeleteElemInput>;
  _delete_key?: InputMaybe<AuditAuditLogDeleteKeyInput>;
  _prepend?: InputMaybe<AuditAuditLogPrependInput>;
  _set?: InputMaybe<AuditAuditLogSetInput>;
  where: AuditAuditLogBoolExp;
};


/** mutation root */
export type MutationRootUpdateAuditAuditLogByPkArgs = {
  _append?: InputMaybe<AuditAuditLogAppendInput>;
  _delete_at_path?: InputMaybe<AuditAuditLogDeleteAtPathInput>;
  _delete_elem?: InputMaybe<AuditAuditLogDeleteElemInput>;
  _delete_key?: InputMaybe<AuditAuditLogDeleteKeyInput>;
  _prepend?: InputMaybe<AuditAuditLogPrependInput>;
  _set?: InputMaybe<AuditAuditLogSetInput>;
  pk_columns: AuditAuditLogPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateAuditAuditLogManyArgs = {
  updates: Array<AuditAuditLogUpdates>;
};


/** mutation root */
export type MutationRootUpdateAuditAuthEventsArgs = {
  _append?: InputMaybe<AuditAuthEventsAppendInput>;
  _delete_at_path?: InputMaybe<AuditAuthEventsDeleteAtPathInput>;
  _delete_elem?: InputMaybe<AuditAuthEventsDeleteElemInput>;
  _delete_key?: InputMaybe<AuditAuthEventsDeleteKeyInput>;
  _prepend?: InputMaybe<AuditAuthEventsPrependInput>;
  _set?: InputMaybe<AuditAuthEventsSetInput>;
  where: AuditAuthEventsBoolExp;
};


/** mutation root */
export type MutationRootUpdateAuditAuthEventsByPkArgs = {
  _append?: InputMaybe<AuditAuthEventsAppendInput>;
  _delete_at_path?: InputMaybe<AuditAuthEventsDeleteAtPathInput>;
  _delete_elem?: InputMaybe<AuditAuthEventsDeleteElemInput>;
  _delete_key?: InputMaybe<AuditAuthEventsDeleteKeyInput>;
  _prepend?: InputMaybe<AuditAuthEventsPrependInput>;
  _set?: InputMaybe<AuditAuthEventsSetInput>;
  pk_columns: AuditAuthEventsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateAuditAuthEventsManyArgs = {
  updates: Array<AuditAuthEventsUpdates>;
};


/** mutation root */
export type MutationRootUpdateAuditDataAccessLogArgs = {
  _append?: InputMaybe<AuditDataAccessLogAppendInput>;
  _delete_at_path?: InputMaybe<AuditDataAccessLogDeleteAtPathInput>;
  _delete_elem?: InputMaybe<AuditDataAccessLogDeleteElemInput>;
  _delete_key?: InputMaybe<AuditDataAccessLogDeleteKeyInput>;
  _inc?: InputMaybe<AuditDataAccessLogIncInput>;
  _prepend?: InputMaybe<AuditDataAccessLogPrependInput>;
  _set?: InputMaybe<AuditDataAccessLogSetInput>;
  where: AuditDataAccessLogBoolExp;
};


/** mutation root */
export type MutationRootUpdateAuditDataAccessLogByPkArgs = {
  _append?: InputMaybe<AuditDataAccessLogAppendInput>;
  _delete_at_path?: InputMaybe<AuditDataAccessLogDeleteAtPathInput>;
  _delete_elem?: InputMaybe<AuditDataAccessLogDeleteElemInput>;
  _delete_key?: InputMaybe<AuditDataAccessLogDeleteKeyInput>;
  _inc?: InputMaybe<AuditDataAccessLogIncInput>;
  _prepend?: InputMaybe<AuditDataAccessLogPrependInput>;
  _set?: InputMaybe<AuditDataAccessLogSetInput>;
  pk_columns: AuditDataAccessLogPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateAuditDataAccessLogManyArgs = {
  updates: Array<AuditDataAccessLogUpdates>;
};


/** mutation root */
export type MutationRootUpdateAuditPermissionChangesArgs = {
  _append?: InputMaybe<AuditPermissionChangesAppendInput>;
  _delete_at_path?: InputMaybe<AuditPermissionChangesDeleteAtPathInput>;
  _delete_elem?: InputMaybe<AuditPermissionChangesDeleteElemInput>;
  _delete_key?: InputMaybe<AuditPermissionChangesDeleteKeyInput>;
  _prepend?: InputMaybe<AuditPermissionChangesPrependInput>;
  _set?: InputMaybe<AuditPermissionChangesSetInput>;
  where: AuditPermissionChangesBoolExp;
};


/** mutation root */
export type MutationRootUpdateAuditPermissionChangesByPkArgs = {
  _append?: InputMaybe<AuditPermissionChangesAppendInput>;
  _delete_at_path?: InputMaybe<AuditPermissionChangesDeleteAtPathInput>;
  _delete_elem?: InputMaybe<AuditPermissionChangesDeleteElemInput>;
  _delete_key?: InputMaybe<AuditPermissionChangesDeleteKeyInput>;
  _prepend?: InputMaybe<AuditPermissionChangesPrependInput>;
  _set?: InputMaybe<AuditPermissionChangesSetInput>;
  pk_columns: AuditPermissionChangesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateAuditPermissionChangesManyArgs = {
  updates: Array<AuditPermissionChangesUpdates>;
};


/** mutation root */
export type MutationRootUpdateAuditSlowQueriesArgs = {
  _set?: InputMaybe<AuditSlowQueriesSetInput>;
  where: AuditSlowQueriesBoolExp;
};


/** mutation root */
export type MutationRootUpdateAuditSlowQueriesByPkArgs = {
  _set?: InputMaybe<AuditSlowQueriesSetInput>;
  pk_columns: AuditSlowQueriesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateAuditSlowQueriesManyArgs = {
  updates: Array<AuditSlowQueriesUpdates>;
};


/** mutation root */
export type MutationRootUpdateAuditUserAccessSummaryArgs = {
  _set?: InputMaybe<AuditUserAccessSummarySetInput>;
  where: AuditUserAccessSummaryBoolExp;
};


/** mutation root */
export type MutationRootUpdateAuditUserAccessSummaryManyArgs = {
  updates: Array<AuditUserAccessSummaryUpdates>;
};


/** mutation root */
export type MutationRootUpdateBillingEventLogArgs = {
  _set?: InputMaybe<BillingEventLogSetInput>;
  where: BillingEventLogBoolExp;
};


/** mutation root */
export type MutationRootUpdateBillingEventLogByPkArgs = {
  _set?: InputMaybe<BillingEventLogSetInput>;
  pk_columns: BillingEventLogPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBillingEventLogManyArgs = {
  updates: Array<BillingEventLogUpdates>;
};


/** mutation root */
export type MutationRootUpdateBillingInvoiceArgs = {
  _inc?: InputMaybe<BillingInvoiceIncInput>;
  _set?: InputMaybe<BillingInvoiceSetInput>;
  where: BillingInvoiceBoolExp;
};


/** mutation root */
export type MutationRootUpdateBillingInvoiceByPkArgs = {
  _inc?: InputMaybe<BillingInvoiceIncInput>;
  _set?: InputMaybe<BillingInvoiceSetInput>;
  pk_columns: BillingInvoicePkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBillingInvoiceItemArgs = {
  _inc?: InputMaybe<BillingInvoiceItemIncInput>;
  _set?: InputMaybe<BillingInvoiceItemSetInput>;
  where: BillingInvoiceItemBoolExp;
};


/** mutation root */
export type MutationRootUpdateBillingInvoiceItemByPkArgs = {
  _inc?: InputMaybe<BillingInvoiceItemIncInput>;
  _set?: InputMaybe<BillingInvoiceItemSetInput>;
  pk_columns: BillingInvoiceItemPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBillingInvoiceItemManyArgs = {
  updates: Array<BillingInvoiceItemUpdates>;
};


/** mutation root */
export type MutationRootUpdateBillingInvoiceManyArgs = {
  updates: Array<BillingInvoiceUpdates>;
};


/** mutation root */
export type MutationRootUpdateBillingInvoicesArgs = {
  _inc?: InputMaybe<BillingInvoicesIncInput>;
  _set?: InputMaybe<BillingInvoicesSetInput>;
  where: BillingInvoicesBoolExp;
};


/** mutation root */
export type MutationRootUpdateBillingInvoicesByPkArgs = {
  _inc?: InputMaybe<BillingInvoicesIncInput>;
  _set?: InputMaybe<BillingInvoicesSetInput>;
  pk_columns: BillingInvoicesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBillingInvoicesManyArgs = {
  updates: Array<BillingInvoicesUpdates>;
};


/** mutation root */
export type MutationRootUpdateBillingItemsArgs = {
  _inc?: InputMaybe<BillingItemsIncInput>;
  _set?: InputMaybe<BillingItemsSetInput>;
  where: BillingItemsBoolExp;
};


/** mutation root */
export type MutationRootUpdateBillingItemsByPkArgs = {
  _inc?: InputMaybe<BillingItemsIncInput>;
  _set?: InputMaybe<BillingItemsSetInput>;
  pk_columns: BillingItemsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBillingItemsManyArgs = {
  updates: Array<BillingItemsUpdates>;
};


/** mutation root */
export type MutationRootUpdateBillingPlanArgs = {
  _inc?: InputMaybe<BillingPlanIncInput>;
  _set?: InputMaybe<BillingPlanSetInput>;
  where: BillingPlanBoolExp;
};


/** mutation root */
export type MutationRootUpdateBillingPlanByPkArgs = {
  _inc?: InputMaybe<BillingPlanIncInput>;
  _set?: InputMaybe<BillingPlanSetInput>;
  pk_columns: BillingPlanPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBillingPlanManyArgs = {
  updates: Array<BillingPlanUpdates>;
};


/** mutation root */
export type MutationRootUpdateClientBillingAssignmentArgs = {
  _set?: InputMaybe<ClientBillingAssignmentSetInput>;
  where: ClientBillingAssignmentBoolExp;
};


/** mutation root */
export type MutationRootUpdateClientBillingAssignmentByPkArgs = {
  _set?: InputMaybe<ClientBillingAssignmentSetInput>;
  pk_columns: ClientBillingAssignmentPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateClientBillingAssignmentManyArgs = {
  updates: Array<ClientBillingAssignmentUpdates>;
};


/** mutation root */
export type MutationRootUpdateClientExternalSystemsArgs = {
  _set?: InputMaybe<ClientExternalSystemsSetInput>;
  where: ClientExternalSystemsBoolExp;
};


/** mutation root */
export type MutationRootUpdateClientExternalSystemsByPkArgs = {
  _set?: InputMaybe<ClientExternalSystemsSetInput>;
  pk_columns: ClientExternalSystemsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateClientExternalSystemsManyArgs = {
  updates: Array<ClientExternalSystemsUpdates>;
};


/** mutation root */
export type MutationRootUpdateClientsArgs = {
  _set?: InputMaybe<ClientsSetInput>;
  where: ClientsBoolExp;
};


/** mutation root */
export type MutationRootUpdateClientsByPkArgs = {
  _set?: InputMaybe<ClientsSetInput>;
  pk_columns: ClientsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateClientsManyArgs = {
  updates: Array<ClientsUpdates>;
};


/** mutation root */
export type MutationRootUpdateExternalSystemsArgs = {
  _set?: InputMaybe<ExternalSystemsSetInput>;
  where: ExternalSystemsBoolExp;
};


/** mutation root */
export type MutationRootUpdateExternalSystemsByPkArgs = {
  _set?: InputMaybe<ExternalSystemsSetInput>;
  pk_columns: ExternalSystemsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateExternalSystemsManyArgs = {
  updates: Array<ExternalSystemsUpdates>;
};


/** mutation root */
export type MutationRootUpdateFeatureFlagsArgs = {
  _append?: InputMaybe<FeatureFlagsAppendInput>;
  _delete_at_path?: InputMaybe<FeatureFlagsDeleteAtPathInput>;
  _delete_elem?: InputMaybe<FeatureFlagsDeleteElemInput>;
  _delete_key?: InputMaybe<FeatureFlagsDeleteKeyInput>;
  _prepend?: InputMaybe<FeatureFlagsPrependInput>;
  _set?: InputMaybe<FeatureFlagsSetInput>;
  where: FeatureFlagsBoolExp;
};


/** mutation root */
export type MutationRootUpdateFeatureFlagsByPkArgs = {
  _append?: InputMaybe<FeatureFlagsAppendInput>;
  _delete_at_path?: InputMaybe<FeatureFlagsDeleteAtPathInput>;
  _delete_elem?: InputMaybe<FeatureFlagsDeleteElemInput>;
  _delete_key?: InputMaybe<FeatureFlagsDeleteKeyInput>;
  _prepend?: InputMaybe<FeatureFlagsPrependInput>;
  _set?: InputMaybe<FeatureFlagsSetInput>;
  pk_columns: FeatureFlagsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateFeatureFlagsManyArgs = {
  updates: Array<FeatureFlagsUpdates>;
};


/** mutation root */
export type MutationRootUpdateHolidaysArgs = {
  _inc?: InputMaybe<HolidaysIncInput>;
  _set?: InputMaybe<HolidaysSetInput>;
  where: HolidaysBoolExp;
};


/** mutation root */
export type MutationRootUpdateHolidaysByPkArgs = {
  _inc?: InputMaybe<HolidaysIncInput>;
  _set?: InputMaybe<HolidaysSetInput>;
  pk_columns: HolidaysPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateHolidaysManyArgs = {
  updates: Array<HolidaysUpdates>;
};


/** mutation root */
export type MutationRootUpdateLatestPayrollVersionResultsArgs = {
  _inc?: InputMaybe<LatestPayrollVersionResultsIncInput>;
  _set?: InputMaybe<LatestPayrollVersionResultsSetInput>;
  where: LatestPayrollVersionResultsBoolExp;
};


/** mutation root */
export type MutationRootUpdateLatestPayrollVersionResultsByPkArgs = {
  _inc?: InputMaybe<LatestPayrollVersionResultsIncInput>;
  _set?: InputMaybe<LatestPayrollVersionResultsSetInput>;
  pk_columns: LatestPayrollVersionResultsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateLatestPayrollVersionResultsManyArgs = {
  updates: Array<LatestPayrollVersionResultsUpdates>;
};


/** mutation root */
export type MutationRootUpdateLeaveArgs = {
  _set?: InputMaybe<LeaveSetInput>;
  where: LeaveBoolExp;
};


/** mutation root */
export type MutationRootUpdateLeaveByPkArgs = {
  _set?: InputMaybe<LeaveSetInput>;
  pk_columns: LeavePkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateLeaveManyArgs = {
  updates: Array<LeaveUpdates>;
};


/** mutation root */
export type MutationRootUpdateNeonAuthUsersSyncArgs = {
  _append?: InputMaybe<NeonAuthUsersSyncAppendInput>;
  _delete_at_path?: InputMaybe<NeonAuthUsersSyncDeleteAtPathInput>;
  _delete_elem?: InputMaybe<NeonAuthUsersSyncDeleteElemInput>;
  _delete_key?: InputMaybe<NeonAuthUsersSyncDeleteKeyInput>;
  _prepend?: InputMaybe<NeonAuthUsersSyncPrependInput>;
  _set?: InputMaybe<NeonAuthUsersSyncSetInput>;
  where: NeonAuthUsersSyncBoolExp;
};


/** mutation root */
export type MutationRootUpdateNeonAuthUsersSyncByPkArgs = {
  _append?: InputMaybe<NeonAuthUsersSyncAppendInput>;
  _delete_at_path?: InputMaybe<NeonAuthUsersSyncDeleteAtPathInput>;
  _delete_elem?: InputMaybe<NeonAuthUsersSyncDeleteElemInput>;
  _delete_key?: InputMaybe<NeonAuthUsersSyncDeleteKeyInput>;
  _prepend?: InputMaybe<NeonAuthUsersSyncPrependInput>;
  _set?: InputMaybe<NeonAuthUsersSyncSetInput>;
  pk_columns: NeonAuthUsersSyncPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateNeonAuthUsersSyncManyArgs = {
  updates: Array<NeonAuthUsersSyncUpdates>;
};


/** mutation root */
export type MutationRootUpdateNotesArgs = {
  _set?: InputMaybe<NotesSetInput>;
  where: NotesBoolExp;
};


/** mutation root */
export type MutationRootUpdateNotesByPkArgs = {
  _set?: InputMaybe<NotesSetInput>;
  pk_columns: NotesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateNotesManyArgs = {
  updates: Array<NotesUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollActivationResultsArgs = {
  _inc?: InputMaybe<PayrollActivationResultsIncInput>;
  _set?: InputMaybe<PayrollActivationResultsSetInput>;
  where: PayrollActivationResultsBoolExp;
};


/** mutation root */
export type MutationRootUpdatePayrollActivationResultsByPkArgs = {
  _inc?: InputMaybe<PayrollActivationResultsIncInput>;
  _set?: InputMaybe<PayrollActivationResultsSetInput>;
  pk_columns: PayrollActivationResultsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollActivationResultsManyArgs = {
  updates: Array<PayrollActivationResultsUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollAssignmentAuditArgs = {
  _set?: InputMaybe<PayrollAssignmentAuditSetInput>;
  where: PayrollAssignmentAuditBoolExp;
};


/** mutation root */
export type MutationRootUpdatePayrollAssignmentAuditByPkArgs = {
  _set?: InputMaybe<PayrollAssignmentAuditSetInput>;
  pk_columns: PayrollAssignmentAuditPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollAssignmentAuditManyArgs = {
  updates: Array<PayrollAssignmentAuditUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollAssignmentsArgs = {
  _set?: InputMaybe<PayrollAssignmentsSetInput>;
  where: PayrollAssignmentsBoolExp;
};


/** mutation root */
export type MutationRootUpdatePayrollAssignmentsByPkArgs = {
  _set?: InputMaybe<PayrollAssignmentsSetInput>;
  pk_columns: PayrollAssignmentsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollAssignmentsManyArgs = {
  updates: Array<PayrollAssignmentsUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollCyclesArgs = {
  _set?: InputMaybe<PayrollCyclesSetInput>;
  where: PayrollCyclesBoolExp;
};


/** mutation root */
export type MutationRootUpdatePayrollCyclesByPkArgs = {
  _set?: InputMaybe<PayrollCyclesSetInput>;
  pk_columns: PayrollCyclesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollCyclesManyArgs = {
  updates: Array<PayrollCyclesUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollDateTypesArgs = {
  _set?: InputMaybe<PayrollDateTypesSetInput>;
  where: PayrollDateTypesBoolExp;
};


/** mutation root */
export type MutationRootUpdatePayrollDateTypesByPkArgs = {
  _set?: InputMaybe<PayrollDateTypesSetInput>;
  pk_columns: PayrollDateTypesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollDateTypesManyArgs = {
  updates: Array<PayrollDateTypesUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollDatesArgs = {
  _set?: InputMaybe<PayrollDatesSetInput>;
  where: PayrollDatesBoolExp;
};


/** mutation root */
export type MutationRootUpdatePayrollDatesByPkArgs = {
  _set?: InputMaybe<PayrollDatesSetInput>;
  pk_columns: PayrollDatesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollDatesManyArgs = {
  updates: Array<PayrollDatesUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollVersionHistoryResultsArgs = {
  _inc?: InputMaybe<PayrollVersionHistoryResultsIncInput>;
  _set?: InputMaybe<PayrollVersionHistoryResultsSetInput>;
  where: PayrollVersionHistoryResultsBoolExp;
};


/** mutation root */
export type MutationRootUpdatePayrollVersionHistoryResultsByPkArgs = {
  _inc?: InputMaybe<PayrollVersionHistoryResultsIncInput>;
  _set?: InputMaybe<PayrollVersionHistoryResultsSetInput>;
  pk_columns: PayrollVersionHistoryResultsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollVersionHistoryResultsManyArgs = {
  updates: Array<PayrollVersionHistoryResultsUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollVersionResultsArgs = {
  _inc?: InputMaybe<PayrollVersionResultsIncInput>;
  _set?: InputMaybe<PayrollVersionResultsSetInput>;
  where: PayrollVersionResultsBoolExp;
};


/** mutation root */
export type MutationRootUpdatePayrollVersionResultsByPkArgs = {
  _inc?: InputMaybe<PayrollVersionResultsIncInput>;
  _set?: InputMaybe<PayrollVersionResultsSetInput>;
  pk_columns: PayrollVersionResultsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollVersionResultsManyArgs = {
  updates: Array<PayrollVersionResultsUpdates>;
};


/** mutation root */
export type MutationRootUpdatePayrollsArgs = {
  _inc?: InputMaybe<PayrollsIncInput>;
  _set?: InputMaybe<PayrollsSetInput>;
  where: PayrollsBoolExp;
};


/** mutation root */
export type MutationRootUpdatePayrollsByPkArgs = {
  _inc?: InputMaybe<PayrollsIncInput>;
  _set?: InputMaybe<PayrollsSetInput>;
  pk_columns: PayrollsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePayrollsManyArgs = {
  updates: Array<PayrollsUpdates>;
};


/** mutation root */
export type MutationRootUpdatePermissionsArgs = {
  _set?: InputMaybe<PermissionsSetInput>;
  where: PermissionsBoolExp;
};


/** mutation root */
export type MutationRootUpdatePermissionsByPkArgs = {
  _set?: InputMaybe<PermissionsSetInput>;
  pk_columns: PermissionsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdatePermissionsManyArgs = {
  updates: Array<PermissionsUpdates>;
};


/** mutation root */
export type MutationRootUpdateResourcesArgs = {
  _set?: InputMaybe<ResourcesSetInput>;
  where: ResourcesBoolExp;
};


/** mutation root */
export type MutationRootUpdateResourcesByPkArgs = {
  _set?: InputMaybe<ResourcesSetInput>;
  pk_columns: ResourcesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateResourcesManyArgs = {
  updates: Array<ResourcesUpdates>;
};


/** mutation root */
export type MutationRootUpdateRolePermissionsArgs = {
  _append?: InputMaybe<RolePermissionsAppendInput>;
  _delete_at_path?: InputMaybe<RolePermissionsDeleteAtPathInput>;
  _delete_elem?: InputMaybe<RolePermissionsDeleteElemInput>;
  _delete_key?: InputMaybe<RolePermissionsDeleteKeyInput>;
  _prepend?: InputMaybe<RolePermissionsPrependInput>;
  _set?: InputMaybe<RolePermissionsSetInput>;
  where: RolePermissionsBoolExp;
};


/** mutation root */
export type MutationRootUpdateRolePermissionsByPkArgs = {
  _append?: InputMaybe<RolePermissionsAppendInput>;
  _delete_at_path?: InputMaybe<RolePermissionsDeleteAtPathInput>;
  _delete_elem?: InputMaybe<RolePermissionsDeleteElemInput>;
  _delete_key?: InputMaybe<RolePermissionsDeleteKeyInput>;
  _prepend?: InputMaybe<RolePermissionsPrependInput>;
  _set?: InputMaybe<RolePermissionsSetInput>;
  pk_columns: RolePermissionsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateRolePermissionsManyArgs = {
  updates: Array<RolePermissionsUpdates>;
};


/** mutation root */
export type MutationRootUpdateRolesArgs = {
  _inc?: InputMaybe<RolesIncInput>;
  _set?: InputMaybe<RolesSetInput>;
  where: RolesBoolExp;
};


/** mutation root */
export type MutationRootUpdateRolesByPkArgs = {
  _inc?: InputMaybe<RolesIncInput>;
  _set?: InputMaybe<RolesSetInput>;
  pk_columns: RolesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateRolesManyArgs = {
  updates: Array<RolesUpdates>;
};


/** mutation root */
export type MutationRootUpdateUserRolesArgs = {
  _set?: InputMaybe<UserRolesSetInput>;
  where: UserRolesBoolExp;
};


/** mutation root */
export type MutationRootUpdateUserRolesByPkArgs = {
  _set?: InputMaybe<UserRolesSetInput>;
  pk_columns: UserRolesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateUserRolesManyArgs = {
  updates: Array<UserRolesUpdates>;
};


/** mutation root */
export type MutationRootUpdateUsersArgs = {
  _set?: InputMaybe<UsersSetInput>;
  where: UsersBoolExp;
};


/** mutation root */
export type MutationRootUpdateUsersByPkArgs = {
  _set?: InputMaybe<UsersSetInput>;
  pk_columns: UsersPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateUsersManyArgs = {
  updates: Array<UsersUpdates>;
};


/** mutation root */
export type MutationRootUpdateUsersRoleBackupArgs = {
  _set?: InputMaybe<UsersRoleBackupSetInput>;
  where: UsersRoleBackupBoolExp;
};


/** mutation root */
export type MutationRootUpdateUsersRoleBackupManyArgs = {
  updates: Array<UsersRoleBackupUpdates>;
};


/** mutation root */
export type MutationRootUpdateWorkScheduleArgs = {
  _inc?: InputMaybe<WorkScheduleIncInput>;
  _set?: InputMaybe<WorkScheduleSetInput>;
  where: WorkScheduleBoolExp;
};


/** mutation root */
export type MutationRootUpdateWorkScheduleByPkArgs = {
  _inc?: InputMaybe<WorkScheduleIncInput>;
  _set?: InputMaybe<WorkScheduleSetInput>;
  pk_columns: WorkSchedulePkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateWorkScheduleManyArgs = {
  updates: Array<WorkScheduleUpdates>;
};

/** Boolean expression to compare columns of type "name". All fields are combined with logical 'AND'. */
export type NameComparisonExp = {
  _eq?: InputMaybe<Scalars['name']['input']>;
  _gt?: InputMaybe<Scalars['name']['input']>;
  _gte?: InputMaybe<Scalars['name']['input']>;
  _in?: InputMaybe<Array<Scalars['name']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['name']['input']>;
  _lte?: InputMaybe<Scalars['name']['input']>;
  _neq?: InputMaybe<Scalars['name']['input']>;
  _nin?: InputMaybe<Array<Scalars['name']['input']>>;
};

/** columns and relationships of "neon_auth.users_sync" */
export type NeonAuthUsersSync = {
  __typename: 'neon_auth_users_sync';
  /** Timestamp when the user was created in the auth system */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Timestamp when the user was deleted in the auth system */
  deleted_at: Maybe<Scalars['timestamptz']['output']>;
  /** User's email address from authentication provider */
  email: Maybe<Scalars['String']['output']>;
  /** Unique identifier from the authentication provider */
  id: Scalars['String']['output'];
  /** User's full name from authentication provider */
  name: Maybe<Scalars['String']['output']>;
  /** Complete JSON data from the authentication provider */
  raw_json: Scalars['jsonb']['output'];
  /** Timestamp when the user was last updated in the auth system */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "neon_auth.users_sync" */
export type NeonAuthUsersSyncRawJsonArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "neon_auth.users_sync" */
export type NeonAuthUsersSyncAggregate = {
  __typename: 'neon_auth_users_sync_aggregate';
  aggregate: Maybe<NeonAuthUsersSyncAggregateFields>;
  nodes: Array<NeonAuthUsersSync>;
};

/** aggregate fields of "neon_auth.users_sync" */
export type NeonAuthUsersSyncAggregateFields = {
  __typename: 'neon_auth_users_sync_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<NeonAuthUsersSyncMaxFields>;
  min: Maybe<NeonAuthUsersSyncMinFields>;
};


/** aggregate fields of "neon_auth.users_sync" */
export type NeonAuthUsersSyncAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<NeonAuthUsersSyncSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type NeonAuthUsersSyncAppendInput = {
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "neon_auth.users_sync". All fields are combined with a logical 'AND'. */
export type NeonAuthUsersSyncBoolExp = {
  _and?: InputMaybe<Array<NeonAuthUsersSyncBoolExp>>;
  _not?: InputMaybe<NeonAuthUsersSyncBoolExp>;
  _or?: InputMaybe<Array<NeonAuthUsersSyncBoolExp>>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  deleted_at?: InputMaybe<TimestamptzComparisonExp>;
  email?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<StringComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  raw_json?: InputMaybe<JsonbComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "neon_auth.users_sync" */
export enum NeonAuthUsersSyncConstraint {
  /** unique or primary key constraint on columns "id" */
  users_sync_pkey = 'users_sync_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type NeonAuthUsersSyncDeleteAtPathInput = {
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type NeonAuthUsersSyncDeleteElemInput = {
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type NeonAuthUsersSyncDeleteKeyInput = {
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "neon_auth.users_sync" */
export type NeonAuthUsersSyncInsertInput = {
  /** Timestamp when the user was deleted in the auth system */
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars['jsonb']['input']>;
  /** Timestamp when the user was last updated in the auth system */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type NeonAuthUsersSyncMaxFields = {
  __typename: 'neon_auth_users_sync_max_fields';
  /** Timestamp when the user was created in the auth system */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Timestamp when the user was deleted in the auth system */
  deleted_at: Maybe<Scalars['timestamptz']['output']>;
  /** User's email address from authentication provider */
  email: Maybe<Scalars['String']['output']>;
  /** Unique identifier from the authentication provider */
  id: Maybe<Scalars['String']['output']>;
  /** User's full name from authentication provider */
  name: Maybe<Scalars['String']['output']>;
  /** Timestamp when the user was last updated in the auth system */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type NeonAuthUsersSyncMinFields = {
  __typename: 'neon_auth_users_sync_min_fields';
  /** Timestamp when the user was created in the auth system */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Timestamp when the user was deleted in the auth system */
  deleted_at: Maybe<Scalars['timestamptz']['output']>;
  /** User's email address from authentication provider */
  email: Maybe<Scalars['String']['output']>;
  /** Unique identifier from the authentication provider */
  id: Maybe<Scalars['String']['output']>;
  /** User's full name from authentication provider */
  name: Maybe<Scalars['String']['output']>;
  /** Timestamp when the user was last updated in the auth system */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "neon_auth.users_sync" */
export type NeonAuthUsersSyncMutationResponse = {
  __typename: 'neon_auth_users_sync_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<NeonAuthUsersSync>;
};

/** on_conflict condition type for table "neon_auth.users_sync" */
export type NeonAuthUsersSyncOnConflict = {
  constraint: NeonAuthUsersSyncConstraint;
  update_columns?: Array<NeonAuthUsersSyncUpdateColumn>;
  where?: InputMaybe<NeonAuthUsersSyncBoolExp>;
};

/** Ordering options when selecting data from "neon_auth.users_sync". */
export type NeonAuthUsersSyncOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  deleted_at?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  raw_json?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: neon_auth.users_sync */
export type NeonAuthUsersSyncPkColumnsInput = {
  /** Unique identifier from the authentication provider */
  id: Scalars['String']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type NeonAuthUsersSyncPrependInput = {
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "neon_auth.users_sync" */
export enum NeonAuthUsersSyncSelectColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  deleted_at = 'deleted_at',
  /** column name */
  email = 'email',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  raw_json = 'raw_json',
  /** column name */
  updated_at = 'updated_at'
}

/** input type for updating data in table "neon_auth.users_sync" */
export type NeonAuthUsersSyncSetInput = {
  /** Timestamp when the user was deleted in the auth system */
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars['jsonb']['input']>;
  /** Timestamp when the user was last updated in the auth system */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "neon_auth_users_sync" */
export type NeonAuthUsersSyncStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: NeonAuthUsersSyncStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type NeonAuthUsersSyncStreamCursorValueInput = {
  /** Timestamp when the user was created in the auth system */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Timestamp when the user was deleted in the auth system */
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** User's email address from authentication provider */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier from the authentication provider */
  id?: InputMaybe<Scalars['String']['input']>;
  /** User's full name from authentication provider */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars['jsonb']['input']>;
  /** Timestamp when the user was last updated in the auth system */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "neon_auth.users_sync" */
export enum NeonAuthUsersSyncUpdateColumn {
  /** column name */
  deleted_at = 'deleted_at',
  /** column name */
  raw_json = 'raw_json',
  /** column name */
  updated_at = 'updated_at'
}

export type NeonAuthUsersSyncUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<NeonAuthUsersSyncAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<NeonAuthUsersSyncDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<NeonAuthUsersSyncDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<NeonAuthUsersSyncDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<NeonAuthUsersSyncPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<NeonAuthUsersSyncSetInput>;
  /** filter the rows which have to be updated */
  where: NeonAuthUsersSyncBoolExp;
};

/** columns and relationships of "notes" */
export type Notes = {
  __typename: 'notes';
  /** Content of the note */
  content: Scalars['String']['output'];
  /** Timestamp when the note was created */
  created_at: Maybe<Scalars['timestamp']['output']>;
  /** Identifier of the entity this note is attached to */
  entity_id: Scalars['uuid']['output'];
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entity_type: Scalars['String']['output'];
  /** Unique identifier for the note */
  id: Scalars['uuid']['output'];
  /** Whether the note is flagged as important */
  is_important: Maybe<Scalars['Boolean']['output']>;
  /** An array relationship */
  notes_by_client: Array<Clients>;
  /** An aggregate relationship */
  notes_by_client_aggregate: ClientsAggregate;
  /** An array relationship */
  notes_by_payroll: Array<Payrolls>;
  /** An aggregate relationship */
  notes_by_payroll_aggregate: PayrollsAggregate;
  /** Timestamp when the note was last updated */
  updated_at: Maybe<Scalars['timestamp']['output']>;
  /** An object relationship */
  user: Maybe<Users>;
  /** User who created the note */
  user_id: Maybe<Scalars['uuid']['output']>;
};


/** columns and relationships of "notes" */
export type NotesNotesByClientArgs = {
  distinct_on?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};


/** columns and relationships of "notes" */
export type NotesNotesByClientAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};


/** columns and relationships of "notes" */
export type NotesNotesByPayrollArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "notes" */
export type NotesNotesByPayrollAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** aggregated selection of "notes" */
export type NotesAggregate = {
  __typename: 'notes_aggregate';
  aggregate: Maybe<NotesAggregateFields>;
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
  __typename: 'notes_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<NotesMaxFields>;
  min: Maybe<NotesMinFields>;
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
  on_conflict?: InputMaybe<NotesOnConflict>;
};

/** Boolean expression to filter rows from the table "notes". All fields are combined with a logical 'AND'. */
export type NotesBoolExp = {
  _and?: InputMaybe<Array<NotesBoolExp>>;
  _not?: InputMaybe<NotesBoolExp>;
  _or?: InputMaybe<Array<NotesBoolExp>>;
  content?: InputMaybe<StringComparisonExp>;
  created_at?: InputMaybe<TimestampComparisonExp>;
  entity_id?: InputMaybe<UuidComparisonExp>;
  entity_type?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  is_important?: InputMaybe<BooleanComparisonExp>;
  notes_by_client?: InputMaybe<ClientsBoolExp>;
  notes_by_client_aggregate?: InputMaybe<ClientsAggregateBoolExp>;
  notes_by_payroll?: InputMaybe<PayrollsBoolExp>;
  notes_by_payroll_aggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  updated_at?: InputMaybe<TimestampComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  user_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "notes" */
export enum NotesConstraint {
  /** unique or primary key constraint on columns "id" */
  notes_pkey = 'notes_pkey'
}

/** input type for inserting data into table "notes" */
export type NotesInsertInput = {
  /** Content of the note */
  content?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the note was created */
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  /** Identifier of the entity this note is attached to */
  entity_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entity_type?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the note */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the note is flagged as important */
  is_important?: InputMaybe<Scalars['Boolean']['input']>;
  notes_by_client?: InputMaybe<ClientsArrRelInsertInput>;
  notes_by_payroll?: InputMaybe<PayrollsArrRelInsertInput>;
  /** Timestamp when the note was last updated */
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  /** User who created the note */
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type NotesMaxFields = {
  __typename: 'notes_max_fields';
  /** Content of the note */
  content: Maybe<Scalars['String']['output']>;
  /** Timestamp when the note was created */
  created_at: Maybe<Scalars['timestamp']['output']>;
  /** Identifier of the entity this note is attached to */
  entity_id: Maybe<Scalars['uuid']['output']>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entity_type: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the note */
  id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the note was last updated */
  updated_at: Maybe<Scalars['timestamp']['output']>;
  /** User who created the note */
  user_id: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "notes" */
export type NotesMaxOrderBy = {
  /** Content of the note */
  content?: InputMaybe<OrderBy>;
  /** Timestamp when the note was created */
  created_at?: InputMaybe<OrderBy>;
  /** Identifier of the entity this note is attached to */
  entity_id?: InputMaybe<OrderBy>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entity_type?: InputMaybe<OrderBy>;
  /** Unique identifier for the note */
  id?: InputMaybe<OrderBy>;
  /** Timestamp when the note was last updated */
  updated_at?: InputMaybe<OrderBy>;
  /** User who created the note */
  user_id?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type NotesMinFields = {
  __typename: 'notes_min_fields';
  /** Content of the note */
  content: Maybe<Scalars['String']['output']>;
  /** Timestamp when the note was created */
  created_at: Maybe<Scalars['timestamp']['output']>;
  /** Identifier of the entity this note is attached to */
  entity_id: Maybe<Scalars['uuid']['output']>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entity_type: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the note */
  id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the note was last updated */
  updated_at: Maybe<Scalars['timestamp']['output']>;
  /** User who created the note */
  user_id: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "notes" */
export type NotesMinOrderBy = {
  /** Content of the note */
  content?: InputMaybe<OrderBy>;
  /** Timestamp when the note was created */
  created_at?: InputMaybe<OrderBy>;
  /** Identifier of the entity this note is attached to */
  entity_id?: InputMaybe<OrderBy>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entity_type?: InputMaybe<OrderBy>;
  /** Unique identifier for the note */
  id?: InputMaybe<OrderBy>;
  /** Timestamp when the note was last updated */
  updated_at?: InputMaybe<OrderBy>;
  /** User who created the note */
  user_id?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "notes" */
export type NotesMutationResponse = {
  __typename: 'notes_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Notes>;
};

/** on_conflict condition type for table "notes" */
export type NotesOnConflict = {
  constraint: NotesConstraint;
  update_columns?: Array<NotesUpdateColumn>;
  where?: InputMaybe<NotesBoolExp>;
};

/** Ordering options when selecting data from "notes". */
export type NotesOrderBy = {
  content?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  entity_id?: InputMaybe<OrderBy>;
  entity_type?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  is_important?: InputMaybe<OrderBy>;
  notes_by_client_aggregate?: InputMaybe<ClientsAggregateOrderBy>;
  notes_by_payroll_aggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  user_id?: InputMaybe<OrderBy>;
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
  created_at = 'created_at',
  /** column name */
  entity_id = 'entity_id',
  /** column name */
  entity_type = 'entity_type',
  /** column name */
  id = 'id',
  /** column name */
  is_important = 'is_important',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  user_id = 'user_id'
}

/** select "notes_aggregate_bool_exp_bool_and_arguments_columns" columns of table "notes" */
export enum NotesSelectColumnNotesAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  is_important = 'is_important'
}

/** select "notes_aggregate_bool_exp_bool_or_arguments_columns" columns of table "notes" */
export enum NotesSelectColumnNotesAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  is_important = 'is_important'
}

/** input type for updating data in table "notes" */
export type NotesSetInput = {
  /** Content of the note */
  content?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the note was created */
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  /** Identifier of the entity this note is attached to */
  entity_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entity_type?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the note */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the note is flagged as important */
  is_important?: InputMaybe<Scalars['Boolean']['input']>;
  /** Timestamp when the note was last updated */
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  /** User who created the note */
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "notes" */
export type NotesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: NotesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type NotesStreamCursorValueInput = {
  /** Content of the note */
  content?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the note was created */
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  /** Identifier of the entity this note is attached to */
  entity_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entity_type?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the note */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether the note is flagged as important */
  is_important?: InputMaybe<Scalars['Boolean']['input']>;
  /** Timestamp when the note was last updated */
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  /** User who created the note */
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "notes" */
export enum NotesUpdateColumn {
  /** column name */
  content = 'content',
  /** column name */
  created_at = 'created_at',
  /** column name */
  entity_id = 'entity_id',
  /** column name */
  entity_type = 'entity_type',
  /** column name */
  id = 'id',
  /** column name */
  is_important = 'is_important',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  user_id = 'user_id'
}

export type NotesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<NotesSetInput>;
  /** filter the rows which have to be updated */
  where: NotesBoolExp;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type NumericComparisonExp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>;
  _gt?: InputMaybe<Scalars['numeric']['input']>;
  _gte?: InputMaybe<Scalars['numeric']['input']>;
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
};

/** column ordering options */
export enum OrderBy {
  /** in ascending order, nulls last */
  asc = 'asc',
  /** in ascending order, nulls first */
  asc_nulls_first = 'asc_nulls_first',
  /** in ascending order, nulls last */
  asc_nulls_last = 'asc_nulls_last',
  /** in descending order, nulls first */
  desc = 'desc',
  /** in descending order, nulls first */
  desc_nulls_first = 'desc_nulls_first',
  /** in descending order, nulls last */
  desc_nulls_last = 'desc_nulls_last'
}

/** columns and relationships of "payroll_activation_results" */
export type PayrollActivationResults = {
  __typename: 'payroll_activation_results';
  action_taken: Scalars['String']['output'];
  executed_at: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  payroll_id: Scalars['uuid']['output'];
  version_number: Scalars['Int']['output'];
};

export type PayrollActivationResultsAggregate = {
  __typename: 'payroll_activation_results_aggregate';
  aggregate: Maybe<PayrollActivationResultsAggregateFields>;
  nodes: Array<PayrollActivationResults>;
};

/** aggregate fields of "payroll_activation_results" */
export type PayrollActivationResultsAggregateFields = {
  __typename: 'payroll_activation_results_aggregate_fields';
  avg: Maybe<PayrollActivationResultsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<PayrollActivationResultsMaxFields>;
  min: Maybe<PayrollActivationResultsMinFields>;
  stddev: Maybe<PayrollActivationResultsStddevFields>;
  stddev_pop: Maybe<PayrollActivationResultsStddevPopFields>;
  stddev_samp: Maybe<PayrollActivationResultsStddevSampFields>;
  sum: Maybe<PayrollActivationResultsSumFields>;
  var_pop: Maybe<PayrollActivationResultsVarPopFields>;
  var_samp: Maybe<PayrollActivationResultsVarSampFields>;
  variance: Maybe<PayrollActivationResultsVarianceFields>;
};


/** aggregate fields of "payroll_activation_results" */
export type PayrollActivationResultsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type PayrollActivationResultsAvgFields = {
  __typename: 'payroll_activation_results_avg_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "payroll_activation_results". All fields are combined with a logical 'AND'. */
export type PayrollActivationResultsBoolExp = {
  _and?: InputMaybe<Array<PayrollActivationResultsBoolExp>>;
  _not?: InputMaybe<PayrollActivationResultsBoolExp>;
  _or?: InputMaybe<Array<PayrollActivationResultsBoolExp>>;
  action_taken?: InputMaybe<StringComparisonExp>;
  executed_at?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  payroll_id?: InputMaybe<UuidComparisonExp>;
  version_number?: InputMaybe<IntComparisonExp>;
};

/** unique or primary key constraints on table "payroll_activation_results" */
export enum PayrollActivationResultsConstraint {
  /** unique or primary key constraint on columns "id" */
  payroll_activation_results_pkey = 'payroll_activation_results_pkey'
}

/** input type for incrementing numeric columns in table "payroll_activation_results" */
export type PayrollActivationResultsIncInput = {
  version_number?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "payroll_activation_results" */
export type PayrollActivationResultsInsertInput = {
  action_taken?: InputMaybe<Scalars['String']['input']>;
  executed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  version_number?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type PayrollActivationResultsMaxFields = {
  __typename: 'payroll_activation_results_max_fields';
  action_taken: Maybe<Scalars['String']['output']>;
  executed_at: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  payroll_id: Maybe<Scalars['uuid']['output']>;
  version_number: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type PayrollActivationResultsMinFields = {
  __typename: 'payroll_activation_results_min_fields';
  action_taken: Maybe<Scalars['String']['output']>;
  executed_at: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  payroll_id: Maybe<Scalars['uuid']['output']>;
  version_number: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "payroll_activation_results" */
export type PayrollActivationResultsMutationResponse = {
  __typename: 'payroll_activation_results_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollActivationResults>;
};

/** on_conflict condition type for table "payroll_activation_results" */
export type PayrollActivationResultsOnConflict = {
  constraint: PayrollActivationResultsConstraint;
  update_columns?: Array<PayrollActivationResultsUpdateColumn>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};

/** Ordering options when selecting data from "payroll_activation_results". */
export type PayrollActivationResultsOrderBy = {
  action_taken?: InputMaybe<OrderBy>;
  executed_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payroll_id?: InputMaybe<OrderBy>;
  version_number?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_activation_results */
export type PayrollActivationResultsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_activation_results" */
export enum PayrollActivationResultsSelectColumn {
  /** column name */
  action_taken = 'action_taken',
  /** column name */
  executed_at = 'executed_at',
  /** column name */
  id = 'id',
  /** column name */
  payroll_id = 'payroll_id',
  /** column name */
  version_number = 'version_number'
}

/** input type for updating data in table "payroll_activation_results" */
export type PayrollActivationResultsSetInput = {
  action_taken?: InputMaybe<Scalars['String']['input']>;
  executed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  version_number?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type PayrollActivationResultsStddevFields = {
  __typename: 'payroll_activation_results_stddev_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type PayrollActivationResultsStddevPopFields = {
  __typename: 'payroll_activation_results_stddev_pop_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type PayrollActivationResultsStddevSampFields = {
  __typename: 'payroll_activation_results_stddev_samp_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "payroll_activation_results" */
export type PayrollActivationResultsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: PayrollActivationResultsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollActivationResultsStreamCursorValueInput = {
  action_taken?: InputMaybe<Scalars['String']['input']>;
  executed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  version_number?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type PayrollActivationResultsSumFields = {
  __typename: 'payroll_activation_results_sum_fields';
  version_number: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "payroll_activation_results" */
export enum PayrollActivationResultsUpdateColumn {
  /** column name */
  action_taken = 'action_taken',
  /** column name */
  executed_at = 'executed_at',
  /** column name */
  id = 'id',
  /** column name */
  payroll_id = 'payroll_id',
  /** column name */
  version_number = 'version_number'
}

export type PayrollActivationResultsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<PayrollActivationResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollActivationResultsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollActivationResultsBoolExp;
};

/** aggregate var_pop on columns */
export type PayrollActivationResultsVarPopFields = {
  __typename: 'payroll_activation_results_var_pop_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type PayrollActivationResultsVarSampFields = {
  __typename: 'payroll_activation_results_var_samp_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type PayrollActivationResultsVarianceFields = {
  __typename: 'payroll_activation_results_variance_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "payroll_assignment_audit" */
export type PayrollAssignmentAudit = {
  __typename: 'payroll_assignment_audit';
  assignment_id: Maybe<Scalars['uuid']['output']>;
  change_reason: Maybe<Scalars['String']['output']>;
  changed_by: Maybe<Scalars['uuid']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  from_consultant_id: Maybe<Scalars['uuid']['output']>;
  id: Scalars['uuid']['output'];
  /** An object relationship */
  payroll_assignment: Maybe<PayrollAssignments>;
  /** An object relationship */
  payroll_date: PayrollDates;
  payroll_date_id: Scalars['uuid']['output'];
  to_consultant_id: Scalars['uuid']['output'];
  /** An object relationship */
  user: Maybe<Users>;
  /** An object relationship */
  userByFromConsultantId: Maybe<Users>;
  /** An object relationship */
  userByToConsultantId: Users;
};

/** aggregated selection of "payroll_assignment_audit" */
export type PayrollAssignmentAuditAggregate = {
  __typename: 'payroll_assignment_audit_aggregate';
  aggregate: Maybe<PayrollAssignmentAuditAggregateFields>;
  nodes: Array<PayrollAssignmentAudit>;
};

export type PayrollAssignmentAuditAggregateBoolExp = {
  count?: InputMaybe<PayrollAssignmentAuditAggregateBoolExpCount>;
};

export type PayrollAssignmentAuditAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "payroll_assignment_audit" */
export type PayrollAssignmentAuditAggregateFields = {
  __typename: 'payroll_assignment_audit_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<PayrollAssignmentAuditMaxFields>;
  min: Maybe<PayrollAssignmentAuditMinFields>;
};


/** aggregate fields of "payroll_assignment_audit" */
export type PayrollAssignmentAuditAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "payroll_assignment_audit" */
export type PayrollAssignmentAuditAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<PayrollAssignmentAuditMaxOrderBy>;
  min?: InputMaybe<PayrollAssignmentAuditMinOrderBy>;
};

/** input type for inserting array relation for remote table "payroll_assignment_audit" */
export type PayrollAssignmentAuditArrRelInsertInput = {
  data: Array<PayrollAssignmentAuditInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<PayrollAssignmentAuditOnConflict>;
};

/** Boolean expression to filter rows from the table "payroll_assignment_audit". All fields are combined with a logical 'AND'. */
export type PayrollAssignmentAuditBoolExp = {
  _and?: InputMaybe<Array<PayrollAssignmentAuditBoolExp>>;
  _not?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  _or?: InputMaybe<Array<PayrollAssignmentAuditBoolExp>>;
  assignment_id?: InputMaybe<UuidComparisonExp>;
  change_reason?: InputMaybe<StringComparisonExp>;
  changed_by?: InputMaybe<UuidComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  from_consultant_id?: InputMaybe<UuidComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  payroll_assignment?: InputMaybe<PayrollAssignmentsBoolExp>;
  payroll_date?: InputMaybe<PayrollDatesBoolExp>;
  payroll_date_id?: InputMaybe<UuidComparisonExp>;
  to_consultant_id?: InputMaybe<UuidComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userByFromConsultantId?: InputMaybe<UsersBoolExp>;
  userByToConsultantId?: InputMaybe<UsersBoolExp>;
};

/** unique or primary key constraints on table "payroll_assignment_audit" */
export enum PayrollAssignmentAuditConstraint {
  /** unique or primary key constraint on columns "id" */
  payroll_assignment_audit_pkey = 'payroll_assignment_audit_pkey'
}

/** input type for inserting data into table "payroll_assignment_audit" */
export type PayrollAssignmentAuditInsertInput = {
  assignment_id?: InputMaybe<Scalars['uuid']['input']>;
  change_reason?: InputMaybe<Scalars['String']['input']>;
  changed_by?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  from_consultant_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payroll_assignment?: InputMaybe<PayrollAssignmentsObjRelInsertInput>;
  payroll_date?: InputMaybe<PayrollDatesObjRelInsertInput>;
  payroll_date_id?: InputMaybe<Scalars['uuid']['input']>;
  to_consultant_id?: InputMaybe<Scalars['uuid']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userByFromConsultantId?: InputMaybe<UsersObjRelInsertInput>;
  userByToConsultantId?: InputMaybe<UsersObjRelInsertInput>;
};

/** aggregate max on columns */
export type PayrollAssignmentAuditMaxFields = {
  __typename: 'payroll_assignment_audit_max_fields';
  assignment_id: Maybe<Scalars['uuid']['output']>;
  change_reason: Maybe<Scalars['String']['output']>;
  changed_by: Maybe<Scalars['uuid']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  from_consultant_id: Maybe<Scalars['uuid']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  payroll_date_id: Maybe<Scalars['uuid']['output']>;
  to_consultant_id: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "payroll_assignment_audit" */
export type PayrollAssignmentAuditMaxOrderBy = {
  assignment_id?: InputMaybe<OrderBy>;
  change_reason?: InputMaybe<OrderBy>;
  changed_by?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  from_consultant_id?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payroll_date_id?: InputMaybe<OrderBy>;
  to_consultant_id?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type PayrollAssignmentAuditMinFields = {
  __typename: 'payroll_assignment_audit_min_fields';
  assignment_id: Maybe<Scalars['uuid']['output']>;
  change_reason: Maybe<Scalars['String']['output']>;
  changed_by: Maybe<Scalars['uuid']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  from_consultant_id: Maybe<Scalars['uuid']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  payroll_date_id: Maybe<Scalars['uuid']['output']>;
  to_consultant_id: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "payroll_assignment_audit" */
export type PayrollAssignmentAuditMinOrderBy = {
  assignment_id?: InputMaybe<OrderBy>;
  change_reason?: InputMaybe<OrderBy>;
  changed_by?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  from_consultant_id?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payroll_date_id?: InputMaybe<OrderBy>;
  to_consultant_id?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "payroll_assignment_audit" */
export type PayrollAssignmentAuditMutationResponse = {
  __typename: 'payroll_assignment_audit_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollAssignmentAudit>;
};

/** on_conflict condition type for table "payroll_assignment_audit" */
export type PayrollAssignmentAuditOnConflict = {
  constraint: PayrollAssignmentAuditConstraint;
  update_columns?: Array<PayrollAssignmentAuditUpdateColumn>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

/** Ordering options when selecting data from "payroll_assignment_audit". */
export type PayrollAssignmentAuditOrderBy = {
  assignment_id?: InputMaybe<OrderBy>;
  change_reason?: InputMaybe<OrderBy>;
  changed_by?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  from_consultant_id?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payroll_assignment?: InputMaybe<PayrollAssignmentsOrderBy>;
  payroll_date?: InputMaybe<PayrollDatesOrderBy>;
  payroll_date_id?: InputMaybe<OrderBy>;
  to_consultant_id?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userByFromConsultantId?: InputMaybe<UsersOrderBy>;
  userByToConsultantId?: InputMaybe<UsersOrderBy>;
};

/** primary key columns input for table: payroll_assignment_audit */
export type PayrollAssignmentAuditPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_assignment_audit" */
export enum PayrollAssignmentAuditSelectColumn {
  /** column name */
  assignment_id = 'assignment_id',
  /** column name */
  change_reason = 'change_reason',
  /** column name */
  changed_by = 'changed_by',
  /** column name */
  created_at = 'created_at',
  /** column name */
  from_consultant_id = 'from_consultant_id',
  /** column name */
  id = 'id',
  /** column name */
  payroll_date_id = 'payroll_date_id',
  /** column name */
  to_consultant_id = 'to_consultant_id'
}

/** input type for updating data in table "payroll_assignment_audit" */
export type PayrollAssignmentAuditSetInput = {
  assignment_id?: InputMaybe<Scalars['uuid']['input']>;
  change_reason?: InputMaybe<Scalars['String']['input']>;
  changed_by?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  from_consultant_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payroll_date_id?: InputMaybe<Scalars['uuid']['input']>;
  to_consultant_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "payroll_assignment_audit" */
export type PayrollAssignmentAuditStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: PayrollAssignmentAuditStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollAssignmentAuditStreamCursorValueInput = {
  assignment_id?: InputMaybe<Scalars['uuid']['input']>;
  change_reason?: InputMaybe<Scalars['String']['input']>;
  changed_by?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  from_consultant_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payroll_date_id?: InputMaybe<Scalars['uuid']['input']>;
  to_consultant_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "payroll_assignment_audit" */
export enum PayrollAssignmentAuditUpdateColumn {
  /** column name */
  assignment_id = 'assignment_id',
  /** column name */
  change_reason = 'change_reason',
  /** column name */
  changed_by = 'changed_by',
  /** column name */
  created_at = 'created_at',
  /** column name */
  from_consultant_id = 'from_consultant_id',
  /** column name */
  id = 'id',
  /** column name */
  payroll_date_id = 'payroll_date_id',
  /** column name */
  to_consultant_id = 'to_consultant_id'
}

export type PayrollAssignmentAuditUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollAssignmentAuditSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollAssignmentAuditBoolExp;
};

/** columns and relationships of "payroll_assignments" */
export type PayrollAssignments = {
  __typename: 'payroll_assignments';
  assigned_by: Maybe<Scalars['uuid']['output']>;
  assigned_date: Maybe<Scalars['timestamptz']['output']>;
  consultant_id: Scalars['uuid']['output'];
  created_at: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  is_backup: Maybe<Scalars['Boolean']['output']>;
  original_consultant_id: Maybe<Scalars['uuid']['output']>;
  /** An array relationship */
  payroll_assignment_audits: Array<PayrollAssignmentAudit>;
  /** An aggregate relationship */
  payroll_assignment_audits_aggregate: PayrollAssignmentAuditAggregate;
  /** An object relationship */
  payroll_date: PayrollDates;
  payroll_date_id: Scalars['uuid']['output'];
  updated_at: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  user: Maybe<Users>;
  /** An object relationship */
  userByConsultantId: Users;
  /** An object relationship */
  userByOriginalConsultantId: Maybe<Users>;
};


/** columns and relationships of "payroll_assignments" */
export type PayrollAssignmentsPayrollAssignmentAuditsArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};


/** columns and relationships of "payroll_assignments" */
export type PayrollAssignmentsPayrollAssignmentAuditsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

/** aggregated selection of "payroll_assignments" */
export type PayrollAssignmentsAggregate = {
  __typename: 'payroll_assignments_aggregate';
  aggregate: Maybe<PayrollAssignmentsAggregateFields>;
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
  __typename: 'payroll_assignments_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<PayrollAssignmentsMaxFields>;
  min: Maybe<PayrollAssignmentsMinFields>;
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
  on_conflict?: InputMaybe<PayrollAssignmentsOnConflict>;
};

/** Boolean expression to filter rows from the table "payroll_assignments". All fields are combined with a logical 'AND'. */
export type PayrollAssignmentsBoolExp = {
  _and?: InputMaybe<Array<PayrollAssignmentsBoolExp>>;
  _not?: InputMaybe<PayrollAssignmentsBoolExp>;
  _or?: InputMaybe<Array<PayrollAssignmentsBoolExp>>;
  assigned_by?: InputMaybe<UuidComparisonExp>;
  assigned_date?: InputMaybe<TimestamptzComparisonExp>;
  consultant_id?: InputMaybe<UuidComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  is_backup?: InputMaybe<BooleanComparisonExp>;
  original_consultant_id?: InputMaybe<UuidComparisonExp>;
  payroll_assignment_audits?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  payroll_assignment_audits_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateBoolExp>;
  payroll_date?: InputMaybe<PayrollDatesBoolExp>;
  payroll_date_id?: InputMaybe<UuidComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userByConsultantId?: InputMaybe<UsersBoolExp>;
  userByOriginalConsultantId?: InputMaybe<UsersBoolExp>;
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
  assigned_by?: InputMaybe<Scalars['uuid']['input']>;
  assigned_date?: InputMaybe<Scalars['timestamptz']['input']>;
  consultant_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_backup?: InputMaybe<Scalars['Boolean']['input']>;
  original_consultant_id?: InputMaybe<Scalars['uuid']['input']>;
  payroll_assignment_audits?: InputMaybe<PayrollAssignmentAuditArrRelInsertInput>;
  payroll_date?: InputMaybe<PayrollDatesObjRelInsertInput>;
  payroll_date_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userByConsultantId?: InputMaybe<UsersObjRelInsertInput>;
  userByOriginalConsultantId?: InputMaybe<UsersObjRelInsertInput>;
};

/** aggregate max on columns */
export type PayrollAssignmentsMaxFields = {
  __typename: 'payroll_assignments_max_fields';
  assigned_by: Maybe<Scalars['uuid']['output']>;
  assigned_date: Maybe<Scalars['timestamptz']['output']>;
  consultant_id: Maybe<Scalars['uuid']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  original_consultant_id: Maybe<Scalars['uuid']['output']>;
  payroll_date_id: Maybe<Scalars['uuid']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "payroll_assignments" */
export type PayrollAssignmentsMaxOrderBy = {
  assigned_by?: InputMaybe<OrderBy>;
  assigned_date?: InputMaybe<OrderBy>;
  consultant_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  original_consultant_id?: InputMaybe<OrderBy>;
  payroll_date_id?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type PayrollAssignmentsMinFields = {
  __typename: 'payroll_assignments_min_fields';
  assigned_by: Maybe<Scalars['uuid']['output']>;
  assigned_date: Maybe<Scalars['timestamptz']['output']>;
  consultant_id: Maybe<Scalars['uuid']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  original_consultant_id: Maybe<Scalars['uuid']['output']>;
  payroll_date_id: Maybe<Scalars['uuid']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "payroll_assignments" */
export type PayrollAssignmentsMinOrderBy = {
  assigned_by?: InputMaybe<OrderBy>;
  assigned_date?: InputMaybe<OrderBy>;
  consultant_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  original_consultant_id?: InputMaybe<OrderBy>;
  payroll_date_id?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "payroll_assignments" */
export type PayrollAssignmentsMutationResponse = {
  __typename: 'payroll_assignments_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollAssignments>;
};

/** input type for inserting object relation for remote table "payroll_assignments" */
export type PayrollAssignmentsObjRelInsertInput = {
  data: PayrollAssignmentsInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<PayrollAssignmentsOnConflict>;
};

/** on_conflict condition type for table "payroll_assignments" */
export type PayrollAssignmentsOnConflict = {
  constraint: PayrollAssignmentsConstraint;
  update_columns?: Array<PayrollAssignmentsUpdateColumn>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};

/** Ordering options when selecting data from "payroll_assignments". */
export type PayrollAssignmentsOrderBy = {
  assigned_by?: InputMaybe<OrderBy>;
  assigned_date?: InputMaybe<OrderBy>;
  consultant_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  is_backup?: InputMaybe<OrderBy>;
  original_consultant_id?: InputMaybe<OrderBy>;
  payroll_assignment_audits_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateOrderBy>;
  payroll_date?: InputMaybe<PayrollDatesOrderBy>;
  payroll_date_id?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userByConsultantId?: InputMaybe<UsersOrderBy>;
  userByOriginalConsultantId?: InputMaybe<UsersOrderBy>;
};

/** primary key columns input for table: payroll_assignments */
export type PayrollAssignmentsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_assignments" */
export enum PayrollAssignmentsSelectColumn {
  /** column name */
  assigned_by = 'assigned_by',
  /** column name */
  assigned_date = 'assigned_date',
  /** column name */
  consultant_id = 'consultant_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  is_backup = 'is_backup',
  /** column name */
  original_consultant_id = 'original_consultant_id',
  /** column name */
  payroll_date_id = 'payroll_date_id',
  /** column name */
  updated_at = 'updated_at'
}

/** select "payroll_assignments_aggregate_bool_exp_bool_and_arguments_columns" columns of table "payroll_assignments" */
export enum PayrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  is_backup = 'is_backup'
}

/** select "payroll_assignments_aggregate_bool_exp_bool_or_arguments_columns" columns of table "payroll_assignments" */
export enum PayrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  is_backup = 'is_backup'
}

/** input type for updating data in table "payroll_assignments" */
export type PayrollAssignmentsSetInput = {
  assigned_by?: InputMaybe<Scalars['uuid']['input']>;
  assigned_date?: InputMaybe<Scalars['timestamptz']['input']>;
  consultant_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_backup?: InputMaybe<Scalars['Boolean']['input']>;
  original_consultant_id?: InputMaybe<Scalars['uuid']['input']>;
  payroll_date_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "payroll_assignments" */
export type PayrollAssignmentsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: PayrollAssignmentsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollAssignmentsStreamCursorValueInput = {
  assigned_by?: InputMaybe<Scalars['uuid']['input']>;
  assigned_date?: InputMaybe<Scalars['timestamptz']['input']>;
  consultant_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_backup?: InputMaybe<Scalars['Boolean']['input']>;
  original_consultant_id?: InputMaybe<Scalars['uuid']['input']>;
  payroll_date_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "payroll_assignments" */
export enum PayrollAssignmentsUpdateColumn {
  /** column name */
  assigned_by = 'assigned_by',
  /** column name */
  assigned_date = 'assigned_date',
  /** column name */
  consultant_id = 'consultant_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  is_backup = 'is_backup',
  /** column name */
  original_consultant_id = 'original_consultant_id',
  /** column name */
  payroll_date_id = 'payroll_date_id',
  /** column name */
  updated_at = 'updated_at'
}

export type PayrollAssignmentsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollAssignmentsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollAssignmentsBoolExp;
};

/** Boolean expression to compare columns of type "payroll_cycle_type". All fields are combined with logical 'AND'. */
export type PayrollCycleTypeComparisonExp = {
  _eq?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _gt?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _gte?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _in?: InputMaybe<Array<Scalars['payroll_cycle_type']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _lte?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _neq?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _nin?: InputMaybe<Array<Scalars['payroll_cycle_type']['input']>>;
};

/** columns and relationships of "payroll_cycles" */
export type PayrollCycles = {
  __typename: 'payroll_cycles';
  /** An array relationship */
  adjustment_rules: Array<AdjustmentRules>;
  /** An aggregate relationship */
  adjustment_rules_aggregate: AdjustmentRulesAggregate;
  /** Timestamp when the cycle was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of the payroll cycle */
  description: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll cycle */
  id: Scalars['uuid']['output'];
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name: Scalars['payroll_cycle_type']['output'];
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrolls_aggregate: PayrollsAggregate;
  /** Timestamp when the cycle was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "payroll_cycles" */
export type PayrollCyclesAdjustmentRulesArgs = {
  distinct_on?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


/** columns and relationships of "payroll_cycles" */
export type PayrollCyclesAdjustmentRulesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


/** columns and relationships of "payroll_cycles" */
export type PayrollCyclesPayrollsArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "payroll_cycles" */
export type PayrollCyclesPayrollsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** aggregated selection of "payroll_cycles" */
export type PayrollCyclesAggregate = {
  __typename: 'payroll_cycles_aggregate';
  aggregate: Maybe<PayrollCyclesAggregateFields>;
  nodes: Array<PayrollCycles>;
};

/** aggregate fields of "payroll_cycles" */
export type PayrollCyclesAggregateFields = {
  __typename: 'payroll_cycles_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<PayrollCyclesMaxFields>;
  min: Maybe<PayrollCyclesMinFields>;
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
  adjustment_rules?: InputMaybe<AdjustmentRulesBoolExp>;
  adjustment_rules_aggregate?: InputMaybe<AdjustmentRulesAggregateBoolExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<PayrollCycleTypeComparisonExp>;
  payrolls?: InputMaybe<PayrollsBoolExp>;
  payrolls_aggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
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
  adjustment_rules?: InputMaybe<AdjustmentRulesArrRelInsertInput>;
  /** Timestamp when the cycle was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Detailed description of the payroll cycle */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the payroll cycle */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  payrolls?: InputMaybe<PayrollsArrRelInsertInput>;
  /** Timestamp when the cycle was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type PayrollCyclesMaxFields = {
  __typename: 'payroll_cycles_max_fields';
  /** Timestamp when the cycle was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of the payroll cycle */
  description: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll cycle */
  id: Maybe<Scalars['uuid']['output']>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name: Maybe<Scalars['payroll_cycle_type']['output']>;
  /** Timestamp when the cycle was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type PayrollCyclesMinFields = {
  __typename: 'payroll_cycles_min_fields';
  /** Timestamp when the cycle was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of the payroll cycle */
  description: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll cycle */
  id: Maybe<Scalars['uuid']['output']>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name: Maybe<Scalars['payroll_cycle_type']['output']>;
  /** Timestamp when the cycle was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "payroll_cycles" */
export type PayrollCyclesMutationResponse = {
  __typename: 'payroll_cycles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollCycles>;
};

/** input type for inserting object relation for remote table "payroll_cycles" */
export type PayrollCyclesObjRelInsertInput = {
  data: PayrollCyclesInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<PayrollCyclesOnConflict>;
};

/** on_conflict condition type for table "payroll_cycles" */
export type PayrollCyclesOnConflict = {
  constraint: PayrollCyclesConstraint;
  update_columns?: Array<PayrollCyclesUpdateColumn>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};

/** Ordering options when selecting data from "payroll_cycles". */
export type PayrollCyclesOrderBy = {
  adjustment_rules_aggregate?: InputMaybe<AdjustmentRulesAggregateOrderBy>;
  created_at?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrolls_aggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_cycles */
export type PayrollCyclesPkColumnsInput = {
  /** Unique identifier for the payroll cycle */
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_cycles" */
export enum PayrollCyclesSelectColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updated_at = 'updated_at'
}

/** input type for updating data in table "payroll_cycles" */
export type PayrollCyclesSetInput = {
  /** Timestamp when the cycle was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Detailed description of the payroll cycle */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the payroll cycle */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  /** Timestamp when the cycle was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "payroll_cycles" */
export type PayrollCyclesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: PayrollCyclesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollCyclesStreamCursorValueInput = {
  /** Timestamp when the cycle was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Detailed description of the payroll cycle */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the payroll cycle */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  /** Timestamp when the cycle was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "payroll_cycles" */
export enum PayrollCyclesUpdateColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updated_at = 'updated_at'
}

export type PayrollCyclesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollCyclesSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollCyclesBoolExp;
};

/** columns and relationships of "payroll_dashboard_stats" */
export type PayrollDashboardStats = {
  __typename: 'payroll_dashboard_stats';
  backup_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  client_name: Maybe<Scalars['String']['output']>;
  cycle_name: Maybe<Scalars['payroll_cycle_type']['output']>;
  future_dates: Maybe<Scalars['bigint']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  manager_user_id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  next_eft_date: Maybe<Scalars['date']['output']>;
  past_dates: Maybe<Scalars['bigint']['output']>;
  primary_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  status: Maybe<Scalars['payroll_status']['output']>;
  total_dates: Maybe<Scalars['bigint']['output']>;
};

/** aggregated selection of "payroll_dashboard_stats" */
export type PayrollDashboardStatsAggregate = {
  __typename: 'payroll_dashboard_stats_aggregate';
  aggregate: Maybe<PayrollDashboardStatsAggregateFields>;
  nodes: Array<PayrollDashboardStats>;
};

/** aggregate fields of "payroll_dashboard_stats" */
export type PayrollDashboardStatsAggregateFields = {
  __typename: 'payroll_dashboard_stats_aggregate_fields';
  avg: Maybe<PayrollDashboardStatsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<PayrollDashboardStatsMaxFields>;
  min: Maybe<PayrollDashboardStatsMinFields>;
  stddev: Maybe<PayrollDashboardStatsStddevFields>;
  stddev_pop: Maybe<PayrollDashboardStatsStddevPopFields>;
  stddev_samp: Maybe<PayrollDashboardStatsStddevSampFields>;
  sum: Maybe<PayrollDashboardStatsSumFields>;
  var_pop: Maybe<PayrollDashboardStatsVarPopFields>;
  var_samp: Maybe<PayrollDashboardStatsVarSampFields>;
  variance: Maybe<PayrollDashboardStatsVarianceFields>;
};


/** aggregate fields of "payroll_dashboard_stats" */
export type PayrollDashboardStatsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type PayrollDashboardStatsAvgFields = {
  __typename: 'payroll_dashboard_stats_avg_fields';
  future_dates: Maybe<Scalars['Float']['output']>;
  past_dates: Maybe<Scalars['Float']['output']>;
  total_dates: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "payroll_dashboard_stats". All fields are combined with a logical 'AND'. */
export type PayrollDashboardStatsBoolExp = {
  _and?: InputMaybe<Array<PayrollDashboardStatsBoolExp>>;
  _not?: InputMaybe<PayrollDashboardStatsBoolExp>;
  _or?: InputMaybe<Array<PayrollDashboardStatsBoolExp>>;
  backup_consultant_user_id?: InputMaybe<UuidComparisonExp>;
  client_name?: InputMaybe<StringComparisonExp>;
  cycle_name?: InputMaybe<PayrollCycleTypeComparisonExp>;
  future_dates?: InputMaybe<BigintComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  manager_user_id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  next_eft_date?: InputMaybe<DateComparisonExp>;
  past_dates?: InputMaybe<BigintComparisonExp>;
  primary_consultant_user_id?: InputMaybe<UuidComparisonExp>;
  status?: InputMaybe<PayrollStatusComparisonExp>;
  total_dates?: InputMaybe<BigintComparisonExp>;
};

/** aggregate max on columns */
export type PayrollDashboardStatsMaxFields = {
  __typename: 'payroll_dashboard_stats_max_fields';
  backup_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  client_name: Maybe<Scalars['String']['output']>;
  cycle_name: Maybe<Scalars['payroll_cycle_type']['output']>;
  future_dates: Maybe<Scalars['bigint']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  manager_user_id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  next_eft_date: Maybe<Scalars['date']['output']>;
  past_dates: Maybe<Scalars['bigint']['output']>;
  primary_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  status: Maybe<Scalars['payroll_status']['output']>;
  total_dates: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type PayrollDashboardStatsMinFields = {
  __typename: 'payroll_dashboard_stats_min_fields';
  backup_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  client_name: Maybe<Scalars['String']['output']>;
  cycle_name: Maybe<Scalars['payroll_cycle_type']['output']>;
  future_dates: Maybe<Scalars['bigint']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  manager_user_id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  next_eft_date: Maybe<Scalars['date']['output']>;
  past_dates: Maybe<Scalars['bigint']['output']>;
  primary_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  status: Maybe<Scalars['payroll_status']['output']>;
  total_dates: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "payroll_dashboard_stats". */
export type PayrollDashboardStatsOrderBy = {
  backup_consultant_user_id?: InputMaybe<OrderBy>;
  client_name?: InputMaybe<OrderBy>;
  cycle_name?: InputMaybe<OrderBy>;
  future_dates?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  manager_user_id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  next_eft_date?: InputMaybe<OrderBy>;
  past_dates?: InputMaybe<OrderBy>;
  primary_consultant_user_id?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  total_dates?: InputMaybe<OrderBy>;
};

/** select columns of table "payroll_dashboard_stats" */
export enum PayrollDashboardStatsSelectColumn {
  /** column name */
  backup_consultant_user_id = 'backup_consultant_user_id',
  /** column name */
  client_name = 'client_name',
  /** column name */
  cycle_name = 'cycle_name',
  /** column name */
  future_dates = 'future_dates',
  /** column name */
  id = 'id',
  /** column name */
  manager_user_id = 'manager_user_id',
  /** column name */
  name = 'name',
  /** column name */
  next_eft_date = 'next_eft_date',
  /** column name */
  past_dates = 'past_dates',
  /** column name */
  primary_consultant_user_id = 'primary_consultant_user_id',
  /** column name */
  status = 'status',
  /** column name */
  total_dates = 'total_dates'
}

/** aggregate stddev on columns */
export type PayrollDashboardStatsStddevFields = {
  __typename: 'payroll_dashboard_stats_stddev_fields';
  future_dates: Maybe<Scalars['Float']['output']>;
  past_dates: Maybe<Scalars['Float']['output']>;
  total_dates: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type PayrollDashboardStatsStddevPopFields = {
  __typename: 'payroll_dashboard_stats_stddev_pop_fields';
  future_dates: Maybe<Scalars['Float']['output']>;
  past_dates: Maybe<Scalars['Float']['output']>;
  total_dates: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type PayrollDashboardStatsStddevSampFields = {
  __typename: 'payroll_dashboard_stats_stddev_samp_fields';
  future_dates: Maybe<Scalars['Float']['output']>;
  past_dates: Maybe<Scalars['Float']['output']>;
  total_dates: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "payroll_dashboard_stats" */
export type PayrollDashboardStatsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: PayrollDashboardStatsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollDashboardStatsStreamCursorValueInput = {
  backup_consultant_user_id?: InputMaybe<Scalars['uuid']['input']>;
  client_name?: InputMaybe<Scalars['String']['input']>;
  cycle_name?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  future_dates?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  manager_user_id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  next_eft_date?: InputMaybe<Scalars['date']['input']>;
  past_dates?: InputMaybe<Scalars['bigint']['input']>;
  primary_consultant_user_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['payroll_status']['input']>;
  total_dates?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type PayrollDashboardStatsSumFields = {
  __typename: 'payroll_dashboard_stats_sum_fields';
  future_dates: Maybe<Scalars['bigint']['output']>;
  past_dates: Maybe<Scalars['bigint']['output']>;
  total_dates: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type PayrollDashboardStatsVarPopFields = {
  __typename: 'payroll_dashboard_stats_var_pop_fields';
  future_dates: Maybe<Scalars['Float']['output']>;
  past_dates: Maybe<Scalars['Float']['output']>;
  total_dates: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type PayrollDashboardStatsVarSampFields = {
  __typename: 'payroll_dashboard_stats_var_samp_fields';
  future_dates: Maybe<Scalars['Float']['output']>;
  past_dates: Maybe<Scalars['Float']['output']>;
  total_dates: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type PayrollDashboardStatsVarianceFields = {
  __typename: 'payroll_dashboard_stats_variance_fields';
  future_dates: Maybe<Scalars['Float']['output']>;
  past_dates: Maybe<Scalars['Float']['output']>;
  total_dates: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "payroll_date_type". All fields are combined with logical 'AND'. */
export type PayrollDateTypeComparisonExp = {
  _eq?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _gt?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _gte?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _in?: InputMaybe<Array<Scalars['payroll_date_type']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _lte?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _neq?: InputMaybe<Scalars['payroll_date_type']['input']>;
  _nin?: InputMaybe<Array<Scalars['payroll_date_type']['input']>>;
};

/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypes = {
  __typename: 'payroll_date_types';
  /** An array relationship */
  adjustment_rules: Array<AdjustmentRules>;
  /** An aggregate relationship */
  adjustment_rules_aggregate: AdjustmentRulesAggregate;
  /** Timestamp when the date type was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of how this date type works */
  description: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll date type */
  id: Scalars['uuid']['output'];
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name: Scalars['payroll_date_type']['output'];
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrolls_aggregate: PayrollsAggregate;
  /** Timestamp when the date type was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypesAdjustmentRulesArgs = {
  distinct_on?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypesAdjustmentRulesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypesPayrollsArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypesPayrollsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** aggregated selection of "payroll_date_types" */
export type PayrollDateTypesAggregate = {
  __typename: 'payroll_date_types_aggregate';
  aggregate: Maybe<PayrollDateTypesAggregateFields>;
  nodes: Array<PayrollDateTypes>;
};

/** aggregate fields of "payroll_date_types" */
export type PayrollDateTypesAggregateFields = {
  __typename: 'payroll_date_types_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<PayrollDateTypesMaxFields>;
  min: Maybe<PayrollDateTypesMinFields>;
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
  adjustment_rules?: InputMaybe<AdjustmentRulesBoolExp>;
  adjustment_rules_aggregate?: InputMaybe<AdjustmentRulesAggregateBoolExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<PayrollDateTypeComparisonExp>;
  payrolls?: InputMaybe<PayrollsBoolExp>;
  payrolls_aggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
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
  adjustment_rules?: InputMaybe<AdjustmentRulesArrRelInsertInput>;
  /** Timestamp when the date type was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Detailed description of how this date type works */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the payroll date type */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name?: InputMaybe<Scalars['payroll_date_type']['input']>;
  payrolls?: InputMaybe<PayrollsArrRelInsertInput>;
  /** Timestamp when the date type was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type PayrollDateTypesMaxFields = {
  __typename: 'payroll_date_types_max_fields';
  /** Timestamp when the date type was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of how this date type works */
  description: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll date type */
  id: Maybe<Scalars['uuid']['output']>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name: Maybe<Scalars['payroll_date_type']['output']>;
  /** Timestamp when the date type was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type PayrollDateTypesMinFields = {
  __typename: 'payroll_date_types_min_fields';
  /** Timestamp when the date type was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of how this date type works */
  description: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll date type */
  id: Maybe<Scalars['uuid']['output']>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name: Maybe<Scalars['payroll_date_type']['output']>;
  /** Timestamp when the date type was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "payroll_date_types" */
export type PayrollDateTypesMutationResponse = {
  __typename: 'payroll_date_types_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollDateTypes>;
};

/** input type for inserting object relation for remote table "payroll_date_types" */
export type PayrollDateTypesObjRelInsertInput = {
  data: PayrollDateTypesInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<PayrollDateTypesOnConflict>;
};

/** on_conflict condition type for table "payroll_date_types" */
export type PayrollDateTypesOnConflict = {
  constraint: PayrollDateTypesConstraint;
  update_columns?: Array<PayrollDateTypesUpdateColumn>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};

/** Ordering options when selecting data from "payroll_date_types". */
export type PayrollDateTypesOrderBy = {
  adjustment_rules_aggregate?: InputMaybe<AdjustmentRulesAggregateOrderBy>;
  created_at?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrolls_aggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_date_types */
export type PayrollDateTypesPkColumnsInput = {
  /** Unique identifier for the payroll date type */
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_date_types" */
export enum PayrollDateTypesSelectColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updated_at = 'updated_at'
}

/** input type for updating data in table "payroll_date_types" */
export type PayrollDateTypesSetInput = {
  /** Timestamp when the date type was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Detailed description of how this date type works */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the payroll date type */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name?: InputMaybe<Scalars['payroll_date_type']['input']>;
  /** Timestamp when the date type was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "payroll_date_types" */
export type PayrollDateTypesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: PayrollDateTypesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollDateTypesStreamCursorValueInput = {
  /** Timestamp when the date type was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Detailed description of how this date type works */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the payroll date type */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name?: InputMaybe<Scalars['payroll_date_type']['input']>;
  /** Timestamp when the date type was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "payroll_date_types" */
export enum PayrollDateTypesUpdateColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updated_at = 'updated_at'
}

export type PayrollDateTypesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollDateTypesSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollDateTypesBoolExp;
};

/** columns and relationships of "payroll_dates" */
export type PayrollDates = {
  __typename: 'payroll_dates';
  /** Final EFT date after holiday and weekend adjustments */
  adjusted_eft_date: Scalars['date']['output'];
  /** Timestamp when the date record was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the payroll date */
  id: Scalars['uuid']['output'];
  /** Additional notes about this payroll date */
  notes: Maybe<Scalars['String']['output']>;
  /** Originally calculated EFT date before adjustments */
  original_eft_date: Scalars['date']['output'];
  /** An object relationship */
  payroll: Payrolls;
  /** An object relationship */
  payroll_assignment: Maybe<PayrollAssignments>;
  /** An array relationship */
  payroll_assignment_audits: Array<PayrollAssignmentAudit>;
  /** An aggregate relationship */
  payroll_assignment_audits_aggregate: PayrollAssignmentAuditAggregate;
  /** Reference to the payroll this date belongs to */
  payroll_id: Scalars['uuid']['output'];
  /** Date when payroll processing must be completed */
  processing_date: Scalars['date']['output'];
  /** Timestamp when the date record was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "payroll_dates" */
export type PayrollDatesPayrollAssignmentAuditsArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};


/** columns and relationships of "payroll_dates" */
export type PayrollDatesPayrollAssignmentAuditsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

/** aggregated selection of "payroll_dates" */
export type PayrollDatesAggregate = {
  __typename: 'payroll_dates_aggregate';
  aggregate: Maybe<PayrollDatesAggregateFields>;
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
  __typename: 'payroll_dates_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<PayrollDatesMaxFields>;
  min: Maybe<PayrollDatesMinFields>;
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
  on_conflict?: InputMaybe<PayrollDatesOnConflict>;
};

/** Boolean expression to filter rows from the table "payroll_dates". All fields are combined with a logical 'AND'. */
export type PayrollDatesBoolExp = {
  _and?: InputMaybe<Array<PayrollDatesBoolExp>>;
  _not?: InputMaybe<PayrollDatesBoolExp>;
  _or?: InputMaybe<Array<PayrollDatesBoolExp>>;
  adjusted_eft_date?: InputMaybe<DateComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  notes?: InputMaybe<StringComparisonExp>;
  original_eft_date?: InputMaybe<DateComparisonExp>;
  payroll?: InputMaybe<PayrollsBoolExp>;
  payroll_assignment?: InputMaybe<PayrollAssignmentsBoolExp>;
  payroll_assignment_audits?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  payroll_assignment_audits_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateBoolExp>;
  payroll_id?: InputMaybe<UuidComparisonExp>;
  processing_date?: InputMaybe<DateComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
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
  adjusted_eft_date?: InputMaybe<Scalars['date']['input']>;
  /** Timestamp when the date record was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Originally calculated EFT date before adjustments */
  original_eft_date?: InputMaybe<Scalars['date']['input']>;
  payroll?: InputMaybe<PayrollsObjRelInsertInput>;
  payroll_assignment?: InputMaybe<PayrollAssignmentsObjRelInsertInput>;
  payroll_assignment_audits?: InputMaybe<PayrollAssignmentAuditArrRelInsertInput>;
  /** Reference to the payroll this date belongs to */
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Date when payroll processing must be completed */
  processing_date?: InputMaybe<Scalars['date']['input']>;
  /** Timestamp when the date record was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type PayrollDatesMaxFields = {
  __typename: 'payroll_dates_max_fields';
  /** Final EFT date after holiday and weekend adjustments */
  adjusted_eft_date: Maybe<Scalars['date']['output']>;
  /** Timestamp when the date record was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the payroll date */
  id: Maybe<Scalars['uuid']['output']>;
  /** Additional notes about this payroll date */
  notes: Maybe<Scalars['String']['output']>;
  /** Originally calculated EFT date before adjustments */
  original_eft_date: Maybe<Scalars['date']['output']>;
  /** Reference to the payroll this date belongs to */
  payroll_id: Maybe<Scalars['uuid']['output']>;
  /** Date when payroll processing must be completed */
  processing_date: Maybe<Scalars['date']['output']>;
  /** Timestamp when the date record was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "payroll_dates" */
export type PayrollDatesMaxOrderBy = {
  /** Final EFT date after holiday and weekend adjustments */
  adjusted_eft_date?: InputMaybe<OrderBy>;
  /** Timestamp when the date record was created */
  created_at?: InputMaybe<OrderBy>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<OrderBy>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<OrderBy>;
  /** Originally calculated EFT date before adjustments */
  original_eft_date?: InputMaybe<OrderBy>;
  /** Reference to the payroll this date belongs to */
  payroll_id?: InputMaybe<OrderBy>;
  /** Date when payroll processing must be completed */
  processing_date?: InputMaybe<OrderBy>;
  /** Timestamp when the date record was last updated */
  updated_at?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type PayrollDatesMinFields = {
  __typename: 'payroll_dates_min_fields';
  /** Final EFT date after holiday and weekend adjustments */
  adjusted_eft_date: Maybe<Scalars['date']['output']>;
  /** Timestamp when the date record was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  /** Unique identifier for the payroll date */
  id: Maybe<Scalars['uuid']['output']>;
  /** Additional notes about this payroll date */
  notes: Maybe<Scalars['String']['output']>;
  /** Originally calculated EFT date before adjustments */
  original_eft_date: Maybe<Scalars['date']['output']>;
  /** Reference to the payroll this date belongs to */
  payroll_id: Maybe<Scalars['uuid']['output']>;
  /** Date when payroll processing must be completed */
  processing_date: Maybe<Scalars['date']['output']>;
  /** Timestamp when the date record was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "payroll_dates" */
export type PayrollDatesMinOrderBy = {
  /** Final EFT date after holiday and weekend adjustments */
  adjusted_eft_date?: InputMaybe<OrderBy>;
  /** Timestamp when the date record was created */
  created_at?: InputMaybe<OrderBy>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<OrderBy>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<OrderBy>;
  /** Originally calculated EFT date before adjustments */
  original_eft_date?: InputMaybe<OrderBy>;
  /** Reference to the payroll this date belongs to */
  payroll_id?: InputMaybe<OrderBy>;
  /** Date when payroll processing must be completed */
  processing_date?: InputMaybe<OrderBy>;
  /** Timestamp when the date record was last updated */
  updated_at?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "payroll_dates" */
export type PayrollDatesMutationResponse = {
  __typename: 'payroll_dates_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollDates>;
};

/** input type for inserting object relation for remote table "payroll_dates" */
export type PayrollDatesObjRelInsertInput = {
  data: PayrollDatesInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<PayrollDatesOnConflict>;
};

/** on_conflict condition type for table "payroll_dates" */
export type PayrollDatesOnConflict = {
  constraint: PayrollDatesConstraint;
  update_columns?: Array<PayrollDatesUpdateColumn>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};

/** Ordering options when selecting data from "payroll_dates". */
export type PayrollDatesOrderBy = {
  adjusted_eft_date?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  original_eft_date?: InputMaybe<OrderBy>;
  payroll?: InputMaybe<PayrollsOrderBy>;
  payroll_assignment?: InputMaybe<PayrollAssignmentsOrderBy>;
  payroll_assignment_audits_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateOrderBy>;
  payroll_id?: InputMaybe<OrderBy>;
  processing_date?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_dates */
export type PayrollDatesPkColumnsInput = {
  /** Unique identifier for the payroll date */
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_dates" */
export enum PayrollDatesSelectColumn {
  /** column name */
  adjusted_eft_date = 'adjusted_eft_date',
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  notes = 'notes',
  /** column name */
  original_eft_date = 'original_eft_date',
  /** column name */
  payroll_id = 'payroll_id',
  /** column name */
  processing_date = 'processing_date',
  /** column name */
  updated_at = 'updated_at'
}

/** input type for updating data in table "payroll_dates" */
export type PayrollDatesSetInput = {
  /** Final EFT date after holiday and weekend adjustments */
  adjusted_eft_date?: InputMaybe<Scalars['date']['input']>;
  /** Timestamp when the date record was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Originally calculated EFT date before adjustments */
  original_eft_date?: InputMaybe<Scalars['date']['input']>;
  /** Reference to the payroll this date belongs to */
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Date when payroll processing must be completed */
  processing_date?: InputMaybe<Scalars['date']['input']>;
  /** Timestamp when the date record was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "payroll_dates" */
export type PayrollDatesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: PayrollDatesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollDatesStreamCursorValueInput = {
  /** Final EFT date after holiday and weekend adjustments */
  adjusted_eft_date?: InputMaybe<Scalars['date']['input']>;
  /** Timestamp when the date record was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Originally calculated EFT date before adjustments */
  original_eft_date?: InputMaybe<Scalars['date']['input']>;
  /** Reference to the payroll this date belongs to */
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Date when payroll processing must be completed */
  processing_date?: InputMaybe<Scalars['date']['input']>;
  /** Timestamp when the date record was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "payroll_dates" */
export enum PayrollDatesUpdateColumn {
  /** column name */
  adjusted_eft_date = 'adjusted_eft_date',
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  notes = 'notes',
  /** column name */
  original_eft_date = 'original_eft_date',
  /** column name */
  payroll_id = 'payroll_id',
  /** column name */
  processing_date = 'processing_date',
  /** column name */
  updated_at = 'updated_at'
}

export type PayrollDatesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollDatesSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollDatesBoolExp;
};

/** Boolean expression to compare columns of type "payroll_status". All fields are combined with logical 'AND'. */
export type PayrollStatusComparisonExp = {
  _eq?: InputMaybe<Scalars['payroll_status']['input']>;
  _gt?: InputMaybe<Scalars['payroll_status']['input']>;
  _gte?: InputMaybe<Scalars['payroll_status']['input']>;
  _in?: InputMaybe<Array<Scalars['payroll_status']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['payroll_status']['input']>;
  _lte?: InputMaybe<Scalars['payroll_status']['input']>;
  _neq?: InputMaybe<Scalars['payroll_status']['input']>;
  _nin?: InputMaybe<Array<Scalars['payroll_status']['input']>>;
};

/** columns and relationships of "payroll_triggers_status" */
export type PayrollTriggersStatus = {
  __typename: 'payroll_triggers_status';
  action_statement: Maybe<Scalars['String']['output']>;
  action_timing: Maybe<Scalars['String']['output']>;
  event_manipulation: Maybe<Scalars['String']['output']>;
  event_object_table: Maybe<Scalars['name']['output']>;
  trigger_name: Maybe<Scalars['name']['output']>;
};

/** aggregated selection of "payroll_triggers_status" */
export type PayrollTriggersStatusAggregate = {
  __typename: 'payroll_triggers_status_aggregate';
  aggregate: Maybe<PayrollTriggersStatusAggregateFields>;
  nodes: Array<PayrollTriggersStatus>;
};

/** aggregate fields of "payroll_triggers_status" */
export type PayrollTriggersStatusAggregateFields = {
  __typename: 'payroll_triggers_status_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<PayrollTriggersStatusMaxFields>;
  min: Maybe<PayrollTriggersStatusMinFields>;
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
  action_statement?: InputMaybe<StringComparisonExp>;
  action_timing?: InputMaybe<StringComparisonExp>;
  event_manipulation?: InputMaybe<StringComparisonExp>;
  event_object_table?: InputMaybe<NameComparisonExp>;
  trigger_name?: InputMaybe<NameComparisonExp>;
};

/** aggregate max on columns */
export type PayrollTriggersStatusMaxFields = {
  __typename: 'payroll_triggers_status_max_fields';
  action_statement: Maybe<Scalars['String']['output']>;
  action_timing: Maybe<Scalars['String']['output']>;
  event_manipulation: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type PayrollTriggersStatusMinFields = {
  __typename: 'payroll_triggers_status_min_fields';
  action_statement: Maybe<Scalars['String']['output']>;
  action_timing: Maybe<Scalars['String']['output']>;
  event_manipulation: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "payroll_triggers_status". */
export type PayrollTriggersStatusOrderBy = {
  action_statement?: InputMaybe<OrderBy>;
  action_timing?: InputMaybe<OrderBy>;
  event_manipulation?: InputMaybe<OrderBy>;
  event_object_table?: InputMaybe<OrderBy>;
  trigger_name?: InputMaybe<OrderBy>;
};

/** select columns of table "payroll_triggers_status" */
export enum PayrollTriggersStatusSelectColumn {
  /** column name */
  action_statement = 'action_statement',
  /** column name */
  action_timing = 'action_timing',
  /** column name */
  event_manipulation = 'event_manipulation',
  /** column name */
  event_object_table = 'event_object_table',
  /** column name */
  trigger_name = 'trigger_name'
}

/** Streaming cursor of the table "payroll_triggers_status" */
export type PayrollTriggersStatusStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: PayrollTriggersStatusStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollTriggersStatusStreamCursorValueInput = {
  action_statement?: InputMaybe<Scalars['String']['input']>;
  action_timing?: InputMaybe<Scalars['String']['input']>;
  event_manipulation?: InputMaybe<Scalars['String']['input']>;
  event_object_table?: InputMaybe<Scalars['name']['input']>;
  trigger_name?: InputMaybe<Scalars['name']['input']>;
};

/** columns and relationships of "payroll_version_history_results" */
export type PayrollVersionHistoryResults = {
  __typename: 'payroll_version_history_results';
  active: Scalars['Boolean']['output'];
  go_live_date: Maybe<Scalars['date']['output']>;
  id: Scalars['uuid']['output'];
  is_current: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  payroll_id: Scalars['uuid']['output'];
  queried_at: Maybe<Scalars['timestamptz']['output']>;
  superseded_date: Maybe<Scalars['date']['output']>;
  version_number: Scalars['Int']['output'];
  version_reason: Maybe<Scalars['String']['output']>;
};

export type PayrollVersionHistoryResultsAggregate = {
  __typename: 'payroll_version_history_results_aggregate';
  aggregate: Maybe<PayrollVersionHistoryResultsAggregateFields>;
  nodes: Array<PayrollVersionHistoryResults>;
};

/** aggregate fields of "payroll_version_history_results" */
export type PayrollVersionHistoryResultsAggregateFields = {
  __typename: 'payroll_version_history_results_aggregate_fields';
  avg: Maybe<PayrollVersionHistoryResultsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<PayrollVersionHistoryResultsMaxFields>;
  min: Maybe<PayrollVersionHistoryResultsMinFields>;
  stddev: Maybe<PayrollVersionHistoryResultsStddevFields>;
  stddev_pop: Maybe<PayrollVersionHistoryResultsStddevPopFields>;
  stddev_samp: Maybe<PayrollVersionHistoryResultsStddevSampFields>;
  sum: Maybe<PayrollVersionHistoryResultsSumFields>;
  var_pop: Maybe<PayrollVersionHistoryResultsVarPopFields>;
  var_samp: Maybe<PayrollVersionHistoryResultsVarSampFields>;
  variance: Maybe<PayrollVersionHistoryResultsVarianceFields>;
};


/** aggregate fields of "payroll_version_history_results" */
export type PayrollVersionHistoryResultsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type PayrollVersionHistoryResultsAvgFields = {
  __typename: 'payroll_version_history_results_avg_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "payroll_version_history_results". All fields are combined with a logical 'AND'. */
export type PayrollVersionHistoryResultsBoolExp = {
  _and?: InputMaybe<Array<PayrollVersionHistoryResultsBoolExp>>;
  _not?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
  _or?: InputMaybe<Array<PayrollVersionHistoryResultsBoolExp>>;
  active?: InputMaybe<BooleanComparisonExp>;
  go_live_date?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  is_current?: InputMaybe<BooleanComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  payroll_id?: InputMaybe<UuidComparisonExp>;
  queried_at?: InputMaybe<TimestamptzComparisonExp>;
  superseded_date?: InputMaybe<DateComparisonExp>;
  version_number?: InputMaybe<IntComparisonExp>;
  version_reason?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "payroll_version_history_results" */
export enum PayrollVersionHistoryResultsConstraint {
  /** unique or primary key constraint on columns "id" */
  payroll_version_history_results_pkey = 'payroll_version_history_results_pkey'
}

/** input type for incrementing numeric columns in table "payroll_version_history_results" */
export type PayrollVersionHistoryResultsIncInput = {
  version_number?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "payroll_version_history_results" */
export type PayrollVersionHistoryResultsInsertInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  go_live_date?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_current?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  queried_at?: InputMaybe<Scalars['timestamptz']['input']>;
  superseded_date?: InputMaybe<Scalars['date']['input']>;
  version_number?: InputMaybe<Scalars['Int']['input']>;
  version_reason?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type PayrollVersionHistoryResultsMaxFields = {
  __typename: 'payroll_version_history_results_max_fields';
  go_live_date: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  payroll_id: Maybe<Scalars['uuid']['output']>;
  queried_at: Maybe<Scalars['timestamptz']['output']>;
  superseded_date: Maybe<Scalars['date']['output']>;
  version_number: Maybe<Scalars['Int']['output']>;
  version_reason: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type PayrollVersionHistoryResultsMinFields = {
  __typename: 'payroll_version_history_results_min_fields';
  go_live_date: Maybe<Scalars['date']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  payroll_id: Maybe<Scalars['uuid']['output']>;
  queried_at: Maybe<Scalars['timestamptz']['output']>;
  superseded_date: Maybe<Scalars['date']['output']>;
  version_number: Maybe<Scalars['Int']['output']>;
  version_reason: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "payroll_version_history_results" */
export type PayrollVersionHistoryResultsMutationResponse = {
  __typename: 'payroll_version_history_results_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollVersionHistoryResults>;
};

/** on_conflict condition type for table "payroll_version_history_results" */
export type PayrollVersionHistoryResultsOnConflict = {
  constraint: PayrollVersionHistoryResultsConstraint;
  update_columns?: Array<PayrollVersionHistoryResultsUpdateColumn>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};

/** Ordering options when selecting data from "payroll_version_history_results". */
export type PayrollVersionHistoryResultsOrderBy = {
  active?: InputMaybe<OrderBy>;
  go_live_date?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  is_current?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payroll_id?: InputMaybe<OrderBy>;
  queried_at?: InputMaybe<OrderBy>;
  superseded_date?: InputMaybe<OrderBy>;
  version_number?: InputMaybe<OrderBy>;
  version_reason?: InputMaybe<OrderBy>;
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
  go_live_date = 'go_live_date',
  /** column name */
  id = 'id',
  /** column name */
  is_current = 'is_current',
  /** column name */
  name = 'name',
  /** column name */
  payroll_id = 'payroll_id',
  /** column name */
  queried_at = 'queried_at',
  /** column name */
  superseded_date = 'superseded_date',
  /** column name */
  version_number = 'version_number',
  /** column name */
  version_reason = 'version_reason'
}

/** input type for updating data in table "payroll_version_history_results" */
export type PayrollVersionHistoryResultsSetInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  go_live_date?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_current?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  queried_at?: InputMaybe<Scalars['timestamptz']['input']>;
  superseded_date?: InputMaybe<Scalars['date']['input']>;
  version_number?: InputMaybe<Scalars['Int']['input']>;
  version_reason?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type PayrollVersionHistoryResultsStddevFields = {
  __typename: 'payroll_version_history_results_stddev_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type PayrollVersionHistoryResultsStddevPopFields = {
  __typename: 'payroll_version_history_results_stddev_pop_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type PayrollVersionHistoryResultsStddevSampFields = {
  __typename: 'payroll_version_history_results_stddev_samp_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "payroll_version_history_results" */
export type PayrollVersionHistoryResultsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: PayrollVersionHistoryResultsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollVersionHistoryResultsStreamCursorValueInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  go_live_date?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_current?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  queried_at?: InputMaybe<Scalars['timestamptz']['input']>;
  superseded_date?: InputMaybe<Scalars['date']['input']>;
  version_number?: InputMaybe<Scalars['Int']['input']>;
  version_reason?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type PayrollVersionHistoryResultsSumFields = {
  __typename: 'payroll_version_history_results_sum_fields';
  version_number: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "payroll_version_history_results" */
export enum PayrollVersionHistoryResultsUpdateColumn {
  /** column name */
  active = 'active',
  /** column name */
  go_live_date = 'go_live_date',
  /** column name */
  id = 'id',
  /** column name */
  is_current = 'is_current',
  /** column name */
  name = 'name',
  /** column name */
  payroll_id = 'payroll_id',
  /** column name */
  queried_at = 'queried_at',
  /** column name */
  superseded_date = 'superseded_date',
  /** column name */
  version_number = 'version_number',
  /** column name */
  version_reason = 'version_reason'
}

export type PayrollVersionHistoryResultsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<PayrollVersionHistoryResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollVersionHistoryResultsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollVersionHistoryResultsBoolExp;
};

/** aggregate var_pop on columns */
export type PayrollVersionHistoryResultsVarPopFields = {
  __typename: 'payroll_version_history_results_var_pop_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type PayrollVersionHistoryResultsVarSampFields = {
  __typename: 'payroll_version_history_results_var_samp_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type PayrollVersionHistoryResultsVarianceFields = {
  __typename: 'payroll_version_history_results_variance_fields';
  version_number: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "payroll_version_results" */
export type PayrollVersionResults = {
  __typename: 'payroll_version_results';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  created_by_user_id: Maybe<Scalars['uuid']['output']>;
  dates_deleted: Scalars['Int']['output'];
  id: Scalars['uuid']['output'];
  message: Scalars['String']['output'];
  new_payroll_id: Scalars['uuid']['output'];
  new_version_number: Scalars['Int']['output'];
  old_payroll_id: Scalars['uuid']['output'];
};

export type PayrollVersionResultsAggregate = {
  __typename: 'payroll_version_results_aggregate';
  aggregate: Maybe<PayrollVersionResultsAggregateFields>;
  nodes: Array<PayrollVersionResults>;
};

/** aggregate fields of "payroll_version_results" */
export type PayrollVersionResultsAggregateFields = {
  __typename: 'payroll_version_results_aggregate_fields';
  avg: Maybe<PayrollVersionResultsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<PayrollVersionResultsMaxFields>;
  min: Maybe<PayrollVersionResultsMinFields>;
  stddev: Maybe<PayrollVersionResultsStddevFields>;
  stddev_pop: Maybe<PayrollVersionResultsStddevPopFields>;
  stddev_samp: Maybe<PayrollVersionResultsStddevSampFields>;
  sum: Maybe<PayrollVersionResultsSumFields>;
  var_pop: Maybe<PayrollVersionResultsVarPopFields>;
  var_samp: Maybe<PayrollVersionResultsVarSampFields>;
  variance: Maybe<PayrollVersionResultsVarianceFields>;
};


/** aggregate fields of "payroll_version_results" */
export type PayrollVersionResultsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type PayrollVersionResultsAvgFields = {
  __typename: 'payroll_version_results_avg_fields';
  dates_deleted: Maybe<Scalars['Float']['output']>;
  new_version_number: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "payroll_version_results". All fields are combined with a logical 'AND'. */
export type PayrollVersionResultsBoolExp = {
  _and?: InputMaybe<Array<PayrollVersionResultsBoolExp>>;
  _not?: InputMaybe<PayrollVersionResultsBoolExp>;
  _or?: InputMaybe<Array<PayrollVersionResultsBoolExp>>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  created_by_user_id?: InputMaybe<UuidComparisonExp>;
  dates_deleted?: InputMaybe<IntComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  message?: InputMaybe<StringComparisonExp>;
  new_payroll_id?: InputMaybe<UuidComparisonExp>;
  new_version_number?: InputMaybe<IntComparisonExp>;
  old_payroll_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "payroll_version_results" */
export enum PayrollVersionResultsConstraint {
  /** unique or primary key constraint on columns "id" */
  payroll_version_results_pkey = 'payroll_version_results_pkey'
}

/** input type for incrementing numeric columns in table "payroll_version_results" */
export type PayrollVersionResultsIncInput = {
  dates_deleted?: InputMaybe<Scalars['Int']['input']>;
  new_version_number?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "payroll_version_results" */
export type PayrollVersionResultsInsertInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by_user_id?: InputMaybe<Scalars['uuid']['input']>;
  dates_deleted?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  new_payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  new_version_number?: InputMaybe<Scalars['Int']['input']>;
  old_payroll_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type PayrollVersionResultsMaxFields = {
  __typename: 'payroll_version_results_max_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  created_by_user_id: Maybe<Scalars['uuid']['output']>;
  dates_deleted: Maybe<Scalars['Int']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  message: Maybe<Scalars['String']['output']>;
  new_payroll_id: Maybe<Scalars['uuid']['output']>;
  new_version_number: Maybe<Scalars['Int']['output']>;
  old_payroll_id: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type PayrollVersionResultsMinFields = {
  __typename: 'payroll_version_results_min_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  created_by_user_id: Maybe<Scalars['uuid']['output']>;
  dates_deleted: Maybe<Scalars['Int']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  message: Maybe<Scalars['String']['output']>;
  new_payroll_id: Maybe<Scalars['uuid']['output']>;
  new_version_number: Maybe<Scalars['Int']['output']>;
  old_payroll_id: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "payroll_version_results" */
export type PayrollVersionResultsMutationResponse = {
  __typename: 'payroll_version_results_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<PayrollVersionResults>;
};

/** on_conflict condition type for table "payroll_version_results" */
export type PayrollVersionResultsOnConflict = {
  constraint: PayrollVersionResultsConstraint;
  update_columns?: Array<PayrollVersionResultsUpdateColumn>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};

/** Ordering options when selecting data from "payroll_version_results". */
export type PayrollVersionResultsOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  created_by_user_id?: InputMaybe<OrderBy>;
  dates_deleted?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
  new_payroll_id?: InputMaybe<OrderBy>;
  new_version_number?: InputMaybe<OrderBy>;
  old_payroll_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_version_results */
export type PayrollVersionResultsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_version_results" */
export enum PayrollVersionResultsSelectColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  created_by_user_id = 'created_by_user_id',
  /** column name */
  dates_deleted = 'dates_deleted',
  /** column name */
  id = 'id',
  /** column name */
  message = 'message',
  /** column name */
  new_payroll_id = 'new_payroll_id',
  /** column name */
  new_version_number = 'new_version_number',
  /** column name */
  old_payroll_id = 'old_payroll_id'
}

/** input type for updating data in table "payroll_version_results" */
export type PayrollVersionResultsSetInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by_user_id?: InputMaybe<Scalars['uuid']['input']>;
  dates_deleted?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  new_payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  new_version_number?: InputMaybe<Scalars['Int']['input']>;
  old_payroll_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type PayrollVersionResultsStddevFields = {
  __typename: 'payroll_version_results_stddev_fields';
  dates_deleted: Maybe<Scalars['Float']['output']>;
  new_version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type PayrollVersionResultsStddevPopFields = {
  __typename: 'payroll_version_results_stddev_pop_fields';
  dates_deleted: Maybe<Scalars['Float']['output']>;
  new_version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type PayrollVersionResultsStddevSampFields = {
  __typename: 'payroll_version_results_stddev_samp_fields';
  dates_deleted: Maybe<Scalars['Float']['output']>;
  new_version_number: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "payroll_version_results" */
export type PayrollVersionResultsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: PayrollVersionResultsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollVersionResultsStreamCursorValueInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by_user_id?: InputMaybe<Scalars['uuid']['input']>;
  dates_deleted?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  new_payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  new_version_number?: InputMaybe<Scalars['Int']['input']>;
  old_payroll_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type PayrollVersionResultsSumFields = {
  __typename: 'payroll_version_results_sum_fields';
  dates_deleted: Maybe<Scalars['Int']['output']>;
  new_version_number: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "payroll_version_results" */
export enum PayrollVersionResultsUpdateColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  created_by_user_id = 'created_by_user_id',
  /** column name */
  dates_deleted = 'dates_deleted',
  /** column name */
  id = 'id',
  /** column name */
  message = 'message',
  /** column name */
  new_payroll_id = 'new_payroll_id',
  /** column name */
  new_version_number = 'new_version_number',
  /** column name */
  old_payroll_id = 'old_payroll_id'
}

export type PayrollVersionResultsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<PayrollVersionResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollVersionResultsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollVersionResultsBoolExp;
};

/** aggregate var_pop on columns */
export type PayrollVersionResultsVarPopFields = {
  __typename: 'payroll_version_results_var_pop_fields';
  dates_deleted: Maybe<Scalars['Float']['output']>;
  new_version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type PayrollVersionResultsVarSampFields = {
  __typename: 'payroll_version_results_var_samp_fields';
  dates_deleted: Maybe<Scalars['Float']['output']>;
  new_version_number: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type PayrollVersionResultsVarianceFields = {
  __typename: 'payroll_version_results_variance_fields';
  dates_deleted: Maybe<Scalars['Float']['output']>;
  new_version_number: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "payrolls" */
export type Payrolls = {
  __typename: 'payrolls';
  /** Backup consultant for this payroll */
  backup_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  /** An array relationship */
  billing_items: Array<BillingItems>;
  /** An aggregate relationship */
  billing_items_aggregate: BillingItemsAggregate;
  /** An object relationship */
  client: Clients;
  /** Reference to the client this payroll belongs to */
  client_id: Scalars['uuid']['output'];
  /** Timestamp when the payroll was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  created_by_user_id: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll cycle */
  cycle_id: Scalars['uuid']['output'];
  /** Reference to the payroll date type */
  date_type_id: Scalars['uuid']['output'];
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars['Int']['output']>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars['Int']['output']>;
  /** The date when the payroll went live in the system */
  go_live_date: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the payroll */
  id: Scalars['uuid']['output'];
  /** Manager overseeing this payroll */
  manager_user_id: Maybe<Scalars['uuid']['output']>;
  /** Name of the payroll */
  name: Scalars['String']['output'];
  parent_payroll_id: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  payroll: Maybe<Payrolls>;
  /** An object relationship */
  payroll_cycle: PayrollCycles;
  /** An object relationship */
  payroll_date_type: PayrollDateTypes;
  /** An array relationship */
  payroll_dates: Array<PayrollDates>;
  /** An aggregate relationship */
  payroll_dates_aggregate: PayrollDatesAggregate;
  /** External payroll system used for this client */
  payroll_system: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrolls_aggregate: PayrollsAggregate;
  /** Primary consultant responsible for this payroll */
  primary_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Scalars['Int']['output'];
  /** Number of hours required to process this payroll */
  processing_time: Scalars['Int']['output'];
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status: Scalars['payroll_status']['output'];
  superseded_date: Maybe<Scalars['date']['output']>;
  /** Timestamp when the payroll was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  userByBackupConsultantUserId: Maybe<Users>;
  /** An object relationship */
  userByManagerUserId: Maybe<Users>;
  /** An object relationship */
  userByPrimaryConsultantUserId: Maybe<Users>;
  version_number: Maybe<Scalars['Int']['output']>;
  version_reason: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "payrolls" */
export type PayrollsBillingItemsArgs = {
  distinct_on?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


/** columns and relationships of "payrolls" */
export type PayrollsBillingItemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


/** columns and relationships of "payrolls" */
export type PayrollsPayrollDatesArgs = {
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


/** columns and relationships of "payrolls" */
export type PayrollsPayrollDatesAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


/** columns and relationships of "payrolls" */
export type PayrollsPayrollsArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "payrolls" */
export type PayrollsPayrollsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** aggregated selection of "payrolls" */
export type PayrollsAggregate = {
  __typename: 'payrolls_aggregate';
  aggregate: Maybe<PayrollsAggregateFields>;
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
  __typename: 'payrolls_aggregate_fields';
  avg: Maybe<PayrollsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<PayrollsMaxFields>;
  min: Maybe<PayrollsMinFields>;
  stddev: Maybe<PayrollsStddevFields>;
  stddev_pop: Maybe<PayrollsStddevPopFields>;
  stddev_samp: Maybe<PayrollsStddevSampFields>;
  sum: Maybe<PayrollsSumFields>;
  var_pop: Maybe<PayrollsVarPopFields>;
  var_samp: Maybe<PayrollsVarSampFields>;
  variance: Maybe<PayrollsVarianceFields>;
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
  stddev_pop?: InputMaybe<PayrollsStddevPopOrderBy>;
  stddev_samp?: InputMaybe<PayrollsStddevSampOrderBy>;
  sum?: InputMaybe<PayrollsSumOrderBy>;
  var_pop?: InputMaybe<PayrollsVarPopOrderBy>;
  var_samp?: InputMaybe<PayrollsVarSampOrderBy>;
  variance?: InputMaybe<PayrollsVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "payrolls" */
export type PayrollsArrRelInsertInput = {
  data: Array<PayrollsInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<PayrollsOnConflict>;
};

/** aggregate avg on columns */
export type PayrollsAvgFields = {
  __typename: 'payrolls_avg_fields';
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars['Float']['output']>;
  version_number: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "payrolls" */
export type PayrollsAvgOrderBy = {
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<OrderBy>;
  version_number?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "payrolls". All fields are combined with a logical 'AND'. */
export type PayrollsBoolExp = {
  _and?: InputMaybe<Array<PayrollsBoolExp>>;
  _not?: InputMaybe<PayrollsBoolExp>;
  _or?: InputMaybe<Array<PayrollsBoolExp>>;
  backup_consultant_user_id?: InputMaybe<UuidComparisonExp>;
  billing_items?: InputMaybe<BillingItemsBoolExp>;
  billing_items_aggregate?: InputMaybe<BillingItemsAggregateBoolExp>;
  client?: InputMaybe<ClientsBoolExp>;
  client_id?: InputMaybe<UuidComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  created_by_user_id?: InputMaybe<UuidComparisonExp>;
  cycle_id?: InputMaybe<UuidComparisonExp>;
  date_type_id?: InputMaybe<UuidComparisonExp>;
  date_value?: InputMaybe<IntComparisonExp>;
  employee_count?: InputMaybe<IntComparisonExp>;
  go_live_date?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  manager_user_id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  parent_payroll_id?: InputMaybe<UuidComparisonExp>;
  payroll?: InputMaybe<PayrollsBoolExp>;
  payroll_cycle?: InputMaybe<PayrollCyclesBoolExp>;
  payroll_date_type?: InputMaybe<PayrollDateTypesBoolExp>;
  payroll_dates?: InputMaybe<PayrollDatesBoolExp>;
  payroll_dates_aggregate?: InputMaybe<PayrollDatesAggregateBoolExp>;
  payroll_system?: InputMaybe<StringComparisonExp>;
  payrolls?: InputMaybe<PayrollsBoolExp>;
  payrolls_aggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  primary_consultant_user_id?: InputMaybe<UuidComparisonExp>;
  processing_days_before_eft?: InputMaybe<IntComparisonExp>;
  processing_time?: InputMaybe<IntComparisonExp>;
  status?: InputMaybe<PayrollStatusComparisonExp>;
  superseded_date?: InputMaybe<DateComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
  userByBackupConsultantUserId?: InputMaybe<UsersBoolExp>;
  userByManagerUserId?: InputMaybe<UsersBoolExp>;
  userByPrimaryConsultantUserId?: InputMaybe<UsersBoolExp>;
  version_number?: InputMaybe<IntComparisonExp>;
  version_reason?: InputMaybe<StringComparisonExp>;
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
  date_value?: InputMaybe<Scalars['Int']['input']>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Scalars['Int']['input']>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Scalars['Int']['input']>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Scalars['Int']['input']>;
  version_number?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "payrolls" */
export type PayrollsInsertInput = {
  /** Backup consultant for this payroll */
  backup_consultant_user_id?: InputMaybe<Scalars['uuid']['input']>;
  billing_items?: InputMaybe<BillingItemsArrRelInsertInput>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  /** Reference to the client this payroll belongs to */
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the payroll was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by_user_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll cycle */
  cycle_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll date type */
  date_type_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<Scalars['Int']['input']>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Scalars['Int']['input']>;
  /** The date when the payroll went live in the system */
  go_live_date?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Manager overseeing this payroll */
  manager_user_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the payroll */
  name?: InputMaybe<Scalars['String']['input']>;
  parent_payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  payroll?: InputMaybe<PayrollsObjRelInsertInput>;
  payroll_cycle?: InputMaybe<PayrollCyclesObjRelInsertInput>;
  payroll_date_type?: InputMaybe<PayrollDateTypesObjRelInsertInput>;
  payroll_dates?: InputMaybe<PayrollDatesArrRelInsertInput>;
  /** External payroll system used for this client */
  payroll_system?: InputMaybe<Scalars['String']['input']>;
  payrolls?: InputMaybe<PayrollsArrRelInsertInput>;
  /** Primary consultant responsible for this payroll */
  primary_consultant_user_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Scalars['Int']['input']>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Scalars['Int']['input']>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<Scalars['payroll_status']['input']>;
  superseded_date?: InputMaybe<Scalars['date']['input']>;
  /** Timestamp when the payroll was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  userByBackupConsultantUserId?: InputMaybe<UsersObjRelInsertInput>;
  userByManagerUserId?: InputMaybe<UsersObjRelInsertInput>;
  userByPrimaryConsultantUserId?: InputMaybe<UsersObjRelInsertInput>;
  version_number?: InputMaybe<Scalars['Int']['input']>;
  version_reason?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type PayrollsMaxFields = {
  __typename: 'payrolls_max_fields';
  /** Backup consultant for this payroll */
  backup_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  /** Reference to the client this payroll belongs to */
  client_id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the payroll was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  created_by_user_id: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll cycle */
  cycle_id: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll date type */
  date_type_id: Maybe<Scalars['uuid']['output']>;
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars['Int']['output']>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars['Int']['output']>;
  /** The date when the payroll went live in the system */
  go_live_date: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the payroll */
  id: Maybe<Scalars['uuid']['output']>;
  /** Manager overseeing this payroll */
  manager_user_id: Maybe<Scalars['uuid']['output']>;
  /** Name of the payroll */
  name: Maybe<Scalars['String']['output']>;
  parent_payroll_id: Maybe<Scalars['uuid']['output']>;
  /** External payroll system used for this client */
  payroll_system: Maybe<Scalars['String']['output']>;
  /** Primary consultant responsible for this payroll */
  primary_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars['Int']['output']>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars['Int']['output']>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status: Maybe<Scalars['payroll_status']['output']>;
  superseded_date: Maybe<Scalars['date']['output']>;
  /** Timestamp when the payroll was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
  version_number: Maybe<Scalars['Int']['output']>;
  version_reason: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "payrolls" */
export type PayrollsMaxOrderBy = {
  /** Backup consultant for this payroll */
  backup_consultant_user_id?: InputMaybe<OrderBy>;
  /** Reference to the client this payroll belongs to */
  client_id?: InputMaybe<OrderBy>;
  /** Timestamp when the payroll was created */
  created_at?: InputMaybe<OrderBy>;
  created_by_user_id?: InputMaybe<OrderBy>;
  /** Reference to the payroll cycle */
  cycle_id?: InputMaybe<OrderBy>;
  /** Reference to the payroll date type */
  date_type_id?: InputMaybe<OrderBy>;
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<OrderBy>;
  /** The date when the payroll went live in the system */
  go_live_date?: InputMaybe<OrderBy>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<OrderBy>;
  /** Manager overseeing this payroll */
  manager_user_id?: InputMaybe<OrderBy>;
  /** Name of the payroll */
  name?: InputMaybe<OrderBy>;
  parent_payroll_id?: InputMaybe<OrderBy>;
  /** External payroll system used for this client */
  payroll_system?: InputMaybe<OrderBy>;
  /** Primary consultant responsible for this payroll */
  primary_consultant_user_id?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<OrderBy>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<OrderBy>;
  superseded_date?: InputMaybe<OrderBy>;
  /** Timestamp when the payroll was last updated */
  updated_at?: InputMaybe<OrderBy>;
  version_number?: InputMaybe<OrderBy>;
  version_reason?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type PayrollsMinFields = {
  __typename: 'payrolls_min_fields';
  /** Backup consultant for this payroll */
  backup_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  /** Reference to the client this payroll belongs to */
  client_id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the payroll was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  created_by_user_id: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll cycle */
  cycle_id: Maybe<Scalars['uuid']['output']>;
  /** Reference to the payroll date type */
  date_type_id: Maybe<Scalars['uuid']['output']>;
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars['Int']['output']>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars['Int']['output']>;
  /** The date when the payroll went live in the system */
  go_live_date: Maybe<Scalars['date']['output']>;
  /** Unique identifier for the payroll */
  id: Maybe<Scalars['uuid']['output']>;
  /** Manager overseeing this payroll */
  manager_user_id: Maybe<Scalars['uuid']['output']>;
  /** Name of the payroll */
  name: Maybe<Scalars['String']['output']>;
  parent_payroll_id: Maybe<Scalars['uuid']['output']>;
  /** External payroll system used for this client */
  payroll_system: Maybe<Scalars['String']['output']>;
  /** Primary consultant responsible for this payroll */
  primary_consultant_user_id: Maybe<Scalars['uuid']['output']>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars['Int']['output']>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars['Int']['output']>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status: Maybe<Scalars['payroll_status']['output']>;
  superseded_date: Maybe<Scalars['date']['output']>;
  /** Timestamp when the payroll was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
  version_number: Maybe<Scalars['Int']['output']>;
  version_reason: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "payrolls" */
export type PayrollsMinOrderBy = {
  /** Backup consultant for this payroll */
  backup_consultant_user_id?: InputMaybe<OrderBy>;
  /** Reference to the client this payroll belongs to */
  client_id?: InputMaybe<OrderBy>;
  /** Timestamp when the payroll was created */
  created_at?: InputMaybe<OrderBy>;
  created_by_user_id?: InputMaybe<OrderBy>;
  /** Reference to the payroll cycle */
  cycle_id?: InputMaybe<OrderBy>;
  /** Reference to the payroll date type */
  date_type_id?: InputMaybe<OrderBy>;
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<OrderBy>;
  /** The date when the payroll went live in the system */
  go_live_date?: InputMaybe<OrderBy>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<OrderBy>;
  /** Manager overseeing this payroll */
  manager_user_id?: InputMaybe<OrderBy>;
  /** Name of the payroll */
  name?: InputMaybe<OrderBy>;
  parent_payroll_id?: InputMaybe<OrderBy>;
  /** External payroll system used for this client */
  payroll_system?: InputMaybe<OrderBy>;
  /** Primary consultant responsible for this payroll */
  primary_consultant_user_id?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<OrderBy>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<OrderBy>;
  superseded_date?: InputMaybe<OrderBy>;
  /** Timestamp when the payroll was last updated */
  updated_at?: InputMaybe<OrderBy>;
  version_number?: InputMaybe<OrderBy>;
  version_reason?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "payrolls" */
export type PayrollsMutationResponse = {
  __typename: 'payrolls_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Payrolls>;
};

/** input type for inserting object relation for remote table "payrolls" */
export type PayrollsObjRelInsertInput = {
  data: PayrollsInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<PayrollsOnConflict>;
};

/** on_conflict condition type for table "payrolls" */
export type PayrollsOnConflict = {
  constraint: PayrollsConstraint;
  update_columns?: Array<PayrollsUpdateColumn>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** Ordering options when selecting data from "payrolls". */
export type PayrollsOrderBy = {
  backup_consultant_user_id?: InputMaybe<OrderBy>;
  billing_items_aggregate?: InputMaybe<BillingItemsAggregateOrderBy>;
  client?: InputMaybe<ClientsOrderBy>;
  client_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  created_by_user_id?: InputMaybe<OrderBy>;
  cycle_id?: InputMaybe<OrderBy>;
  date_type_id?: InputMaybe<OrderBy>;
  date_value?: InputMaybe<OrderBy>;
  employee_count?: InputMaybe<OrderBy>;
  go_live_date?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  manager_user_id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  parent_payroll_id?: InputMaybe<OrderBy>;
  payroll?: InputMaybe<PayrollsOrderBy>;
  payroll_cycle?: InputMaybe<PayrollCyclesOrderBy>;
  payroll_date_type?: InputMaybe<PayrollDateTypesOrderBy>;
  payroll_dates_aggregate?: InputMaybe<PayrollDatesAggregateOrderBy>;
  payroll_system?: InputMaybe<OrderBy>;
  payrolls_aggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  primary_consultant_user_id?: InputMaybe<OrderBy>;
  processing_days_before_eft?: InputMaybe<OrderBy>;
  processing_time?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  superseded_date?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  userByBackupConsultantUserId?: InputMaybe<UsersOrderBy>;
  userByManagerUserId?: InputMaybe<UsersOrderBy>;
  userByPrimaryConsultantUserId?: InputMaybe<UsersOrderBy>;
  version_number?: InputMaybe<OrderBy>;
  version_reason?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payrolls */
export type PayrollsPkColumnsInput = {
  /** Unique identifier for the payroll */
  id: Scalars['uuid']['input'];
};

/** select columns of table "payrolls" */
export enum PayrollsSelectColumn {
  /** column name */
  backup_consultant_user_id = 'backup_consultant_user_id',
  /** column name */
  client_id = 'client_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  created_by_user_id = 'created_by_user_id',
  /** column name */
  cycle_id = 'cycle_id',
  /** column name */
  date_type_id = 'date_type_id',
  /** column name */
  date_value = 'date_value',
  /** column name */
  employee_count = 'employee_count',
  /** column name */
  go_live_date = 'go_live_date',
  /** column name */
  id = 'id',
  /** column name */
  manager_user_id = 'manager_user_id',
  /** column name */
  name = 'name',
  /** column name */
  parent_payroll_id = 'parent_payroll_id',
  /** column name */
  payroll_system = 'payroll_system',
  /** column name */
  primary_consultant_user_id = 'primary_consultant_user_id',
  /** column name */
  processing_days_before_eft = 'processing_days_before_eft',
  /** column name */
  processing_time = 'processing_time',
  /** column name */
  status = 'status',
  /** column name */
  superseded_date = 'superseded_date',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  version_number = 'version_number',
  /** column name */
  version_reason = 'version_reason'
}

/** input type for updating data in table "payrolls" */
export type PayrollsSetInput = {
  /** Backup consultant for this payroll */
  backup_consultant_user_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the client this payroll belongs to */
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the payroll was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by_user_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll cycle */
  cycle_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll date type */
  date_type_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<Scalars['Int']['input']>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Scalars['Int']['input']>;
  /** The date when the payroll went live in the system */
  go_live_date?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Manager overseeing this payroll */
  manager_user_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the payroll */
  name?: InputMaybe<Scalars['String']['input']>;
  parent_payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  /** External payroll system used for this client */
  payroll_system?: InputMaybe<Scalars['String']['input']>;
  /** Primary consultant responsible for this payroll */
  primary_consultant_user_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Scalars['Int']['input']>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Scalars['Int']['input']>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<Scalars['payroll_status']['input']>;
  superseded_date?: InputMaybe<Scalars['date']['input']>;
  /** Timestamp when the payroll was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  version_number?: InputMaybe<Scalars['Int']['input']>;
  version_reason?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type PayrollsStddevFields = {
  __typename: 'payrolls_stddev_fields';
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars['Float']['output']>;
  version_number: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "payrolls" */
export type PayrollsStddevOrderBy = {
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<OrderBy>;
  version_number?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type PayrollsStddevPopFields = {
  __typename: 'payrolls_stddev_pop_fields';
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars['Float']['output']>;
  version_number: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "payrolls" */
export type PayrollsStddevPopOrderBy = {
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<OrderBy>;
  version_number?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type PayrollsStddevSampFields = {
  __typename: 'payrolls_stddev_samp_fields';
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars['Float']['output']>;
  version_number: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "payrolls" */
export type PayrollsStddevSampOrderBy = {
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<OrderBy>;
  version_number?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "payrolls" */
export type PayrollsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: PayrollsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollsStreamCursorValueInput = {
  /** Backup consultant for this payroll */
  backup_consultant_user_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the client this payroll belongs to */
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the payroll was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by_user_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll cycle */
  cycle_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll date type */
  date_type_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<Scalars['Int']['input']>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Scalars['Int']['input']>;
  /** The date when the payroll went live in the system */
  go_live_date?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Manager overseeing this payroll */
  manager_user_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the payroll */
  name?: InputMaybe<Scalars['String']['input']>;
  parent_payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  /** External payroll system used for this client */
  payroll_system?: InputMaybe<Scalars['String']['input']>;
  /** Primary consultant responsible for this payroll */
  primary_consultant_user_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Scalars['Int']['input']>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Scalars['Int']['input']>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<Scalars['payroll_status']['input']>;
  superseded_date?: InputMaybe<Scalars['date']['input']>;
  /** Timestamp when the payroll was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  version_number?: InputMaybe<Scalars['Int']['input']>;
  version_reason?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type PayrollsSumFields = {
  __typename: 'payrolls_sum_fields';
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars['Int']['output']>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars['Int']['output']>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars['Int']['output']>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars['Int']['output']>;
  version_number: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "payrolls" */
export type PayrollsSumOrderBy = {
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<OrderBy>;
  version_number?: InputMaybe<OrderBy>;
};

/** update columns of table "payrolls" */
export enum PayrollsUpdateColumn {
  /** column name */
  backup_consultant_user_id = 'backup_consultant_user_id',
  /** column name */
  client_id = 'client_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  created_by_user_id = 'created_by_user_id',
  /** column name */
  cycle_id = 'cycle_id',
  /** column name */
  date_type_id = 'date_type_id',
  /** column name */
  date_value = 'date_value',
  /** column name */
  employee_count = 'employee_count',
  /** column name */
  go_live_date = 'go_live_date',
  /** column name */
  id = 'id',
  /** column name */
  manager_user_id = 'manager_user_id',
  /** column name */
  name = 'name',
  /** column name */
  parent_payroll_id = 'parent_payroll_id',
  /** column name */
  payroll_system = 'payroll_system',
  /** column name */
  primary_consultant_user_id = 'primary_consultant_user_id',
  /** column name */
  processing_days_before_eft = 'processing_days_before_eft',
  /** column name */
  processing_time = 'processing_time',
  /** column name */
  status = 'status',
  /** column name */
  superseded_date = 'superseded_date',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  version_number = 'version_number',
  /** column name */
  version_reason = 'version_reason'
}

export type PayrollsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<PayrollsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollsBoolExp;
};

/** aggregate var_pop on columns */
export type PayrollsVarPopFields = {
  __typename: 'payrolls_var_pop_fields';
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars['Float']['output']>;
  version_number: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "payrolls" */
export type PayrollsVarPopOrderBy = {
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<OrderBy>;
  version_number?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type PayrollsVarSampFields = {
  __typename: 'payrolls_var_samp_fields';
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars['Float']['output']>;
  version_number: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "payrolls" */
export type PayrollsVarSampOrderBy = {
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<OrderBy>;
  version_number?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type PayrollsVarianceFields = {
  __typename: 'payrolls_variance_fields';
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars['Float']['output']>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars['Float']['output']>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars['Float']['output']>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars['Float']['output']>;
  version_number: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "payrolls" */
export type PayrollsVarianceOrderBy = {
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<OrderBy>;
  version_number?: InputMaybe<OrderBy>;
};

/** Boolean expression to compare columns of type "permission_action". All fields are combined with logical 'AND'. */
export type PermissionActionComparisonExp = {
  _eq?: InputMaybe<Scalars['permission_action']['input']>;
  _gt?: InputMaybe<Scalars['permission_action']['input']>;
  _gte?: InputMaybe<Scalars['permission_action']['input']>;
  _in?: InputMaybe<Array<Scalars['permission_action']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['permission_action']['input']>;
  _lte?: InputMaybe<Scalars['permission_action']['input']>;
  _neq?: InputMaybe<Scalars['permission_action']['input']>;
  _nin?: InputMaybe<Array<Scalars['permission_action']['input']>>;
};

/** columns and relationships of "permissions" */
export type Permissions = {
  __typename: 'permissions';
  action: Scalars['permission_action']['output'];
  created_at: Scalars['timestamptz']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  legacy_permission_name: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  resource: Resources;
  resource_id: Scalars['uuid']['output'];
  /** An array relationship */
  role_permissions: Array<RolePermissions>;
  /** An aggregate relationship */
  role_permissions_aggregate: RolePermissionsAggregate;
  updated_at: Scalars['timestamptz']['output'];
};


/** columns and relationships of "permissions" */
export type PermissionsRolePermissionsArgs = {
  distinct_on?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


/** columns and relationships of "permissions" */
export type PermissionsRolePermissionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};

/** aggregated selection of "permissions" */
export type PermissionsAggregate = {
  __typename: 'permissions_aggregate';
  aggregate: Maybe<PermissionsAggregateFields>;
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
  __typename: 'permissions_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<PermissionsMaxFields>;
  min: Maybe<PermissionsMinFields>;
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
  on_conflict?: InputMaybe<PermissionsOnConflict>;
};

/** Boolean expression to filter rows from the table "permissions". All fields are combined with a logical 'AND'. */
export type PermissionsBoolExp = {
  _and?: InputMaybe<Array<PermissionsBoolExp>>;
  _not?: InputMaybe<PermissionsBoolExp>;
  _or?: InputMaybe<Array<PermissionsBoolExp>>;
  action?: InputMaybe<PermissionActionComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  legacy_permission_name?: InputMaybe<StringComparisonExp>;
  resource?: InputMaybe<ResourcesBoolExp>;
  resource_id?: InputMaybe<UuidComparisonExp>;
  role_permissions?: InputMaybe<RolePermissionsBoolExp>;
  role_permissions_aggregate?: InputMaybe<RolePermissionsAggregateBoolExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
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
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  legacy_permission_name?: InputMaybe<Scalars['String']['input']>;
  resource?: InputMaybe<ResourcesObjRelInsertInput>;
  resource_id?: InputMaybe<Scalars['uuid']['input']>;
  role_permissions?: InputMaybe<RolePermissionsArrRelInsertInput>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type PermissionsMaxFields = {
  __typename: 'permissions_max_fields';
  action: Maybe<Scalars['permission_action']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  legacy_permission_name: Maybe<Scalars['String']['output']>;
  resource_id: Maybe<Scalars['uuid']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "permissions" */
export type PermissionsMaxOrderBy = {
  action?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  legacy_permission_name?: InputMaybe<OrderBy>;
  resource_id?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type PermissionsMinFields = {
  __typename: 'permissions_min_fields';
  action: Maybe<Scalars['permission_action']['output']>;
  created_at: Maybe<Scalars['timestamptz']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  legacy_permission_name: Maybe<Scalars['String']['output']>;
  resource_id: Maybe<Scalars['uuid']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "permissions" */
export type PermissionsMinOrderBy = {
  action?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  legacy_permission_name?: InputMaybe<OrderBy>;
  resource_id?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "permissions" */
export type PermissionsMutationResponse = {
  __typename: 'permissions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Permissions>;
};

/** input type for inserting object relation for remote table "permissions" */
export type PermissionsObjRelInsertInput = {
  data: PermissionsInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<PermissionsOnConflict>;
};

/** on_conflict condition type for table "permissions" */
export type PermissionsOnConflict = {
  constraint: PermissionsConstraint;
  update_columns?: Array<PermissionsUpdateColumn>;
  where?: InputMaybe<PermissionsBoolExp>;
};

/** Ordering options when selecting data from "permissions". */
export type PermissionsOrderBy = {
  action?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  legacy_permission_name?: InputMaybe<OrderBy>;
  resource?: InputMaybe<ResourcesOrderBy>;
  resource_id?: InputMaybe<OrderBy>;
  role_permissions_aggregate?: InputMaybe<RolePermissionsAggregateOrderBy>;
  updated_at?: InputMaybe<OrderBy>;
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
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  legacy_permission_name = 'legacy_permission_name',
  /** column name */
  resource_id = 'resource_id',
  /** column name */
  updated_at = 'updated_at'
}

/** input type for updating data in table "permissions" */
export type PermissionsSetInput = {
  action?: InputMaybe<Scalars['permission_action']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  legacy_permission_name?: InputMaybe<Scalars['String']['input']>;
  resource_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "permissions" */
export type PermissionsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: PermissionsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PermissionsStreamCursorValueInput = {
  action?: InputMaybe<Scalars['permission_action']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  legacy_permission_name?: InputMaybe<Scalars['String']['input']>;
  resource_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "permissions" */
export enum PermissionsUpdateColumn {
  /** column name */
  action = 'action',
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  legacy_permission_name = 'legacy_permission_name',
  /** column name */
  resource_id = 'resource_id',
  /** column name */
  updated_at = 'updated_at'
}

export type PermissionsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PermissionsSetInput>;
  /** filter the rows which have to be updated */
  where: PermissionsBoolExp;
};

export type QueryRoot = {
  __typename: 'query_root';
  /** query _Entity union */
  _entities: Maybe<Entity>;
  _service: Service;
  /** execute function "activate_payroll_versions" which returns "payroll_activation_results" */
  activate_payroll_versions: Array<PayrollActivationResults>;
  /** execute function "activate_payroll_versions" and query aggregates on result of table type "payroll_activation_results" */
  activate_payroll_versions_aggregate: PayrollActivationResultsAggregate;
  /** An array relationship */
  adjustment_rules: Array<AdjustmentRules>;
  /** An aggregate relationship */
  adjustment_rules_aggregate: AdjustmentRulesAggregate;
  /** fetch data from the table: "adjustment_rules" using primary key columns */
  adjustment_rules_by_pk: Maybe<AdjustmentRules>;
  /** fetch data from the table: "app_settings" */
  app_settings: Array<AppSettings>;
  /** fetch aggregated fields from the table: "app_settings" */
  app_settings_aggregate: AppSettingsAggregate;
  /** fetch data from the table: "app_settings" using primary key columns */
  app_settings_by_pk: Maybe<AppSettings>;
  /** fetch data from the table: "audit.audit_log" */
  audit_audit_log: Array<AuditAuditLog>;
  /** fetch aggregated fields from the table: "audit.audit_log" */
  audit_audit_log_aggregate: AuditAuditLogAggregate;
  /** fetch data from the table: "audit.audit_log" using primary key columns */
  audit_audit_log_by_pk: Maybe<AuditAuditLog>;
  /** fetch data from the table: "audit.auth_events" */
  audit_auth_events: Array<AuditAuthEvents>;
  /** fetch aggregated fields from the table: "audit.auth_events" */
  audit_auth_events_aggregate: AuditAuthEventsAggregate;
  /** fetch data from the table: "audit.auth_events" using primary key columns */
  audit_auth_events_by_pk: Maybe<AuditAuthEvents>;
  /** fetch data from the table: "audit.data_access_log" */
  audit_data_access_log: Array<AuditDataAccessLog>;
  /** fetch aggregated fields from the table: "audit.data_access_log" */
  audit_data_access_log_aggregate: AuditDataAccessLogAggregate;
  /** fetch data from the table: "audit.data_access_log" using primary key columns */
  audit_data_access_log_by_pk: Maybe<AuditDataAccessLog>;
  /** fetch data from the table: "audit.permission_changes" */
  audit_permission_changes: Array<AuditPermissionChanges>;
  /** fetch aggregated fields from the table: "audit.permission_changes" */
  audit_permission_changes_aggregate: AuditPermissionChangesAggregate;
  /** fetch data from the table: "audit.permission_changes" using primary key columns */
  audit_permission_changes_by_pk: Maybe<AuditPermissionChanges>;
  /** fetch data from the table: "audit.permission_usage_report" */
  audit_permission_usage_report: Array<AuditPermissionUsageReport>;
  /** fetch aggregated fields from the table: "audit.permission_usage_report" */
  audit_permission_usage_report_aggregate: AuditPermissionUsageReportAggregate;
  /** fetch data from the table: "audit.slow_queries" */
  audit_slow_queries: Array<AuditSlowQueries>;
  /** fetch aggregated fields from the table: "audit.slow_queries" */
  audit_slow_queries_aggregate: AuditSlowQueriesAggregate;
  /** fetch data from the table: "audit.slow_queries" using primary key columns */
  audit_slow_queries_by_pk: Maybe<AuditSlowQueries>;
  /** fetch data from the table: "audit.user_access_summary" */
  audit_user_access_summary: Array<AuditUserAccessSummary>;
  /** fetch aggregated fields from the table: "audit.user_access_summary" */
  audit_user_access_summary_aggregate: AuditUserAccessSummaryAggregate;
  /** fetch data from the table: "billing_event_log" */
  billing_event_log: Array<BillingEventLog>;
  /** fetch aggregated fields from the table: "billing_event_log" */
  billing_event_log_aggregate: BillingEventLogAggregate;
  /** fetch data from the table: "billing_event_log" using primary key columns */
  billing_event_log_by_pk: Maybe<BillingEventLog>;
  /** fetch data from the table: "billing_invoice" */
  billing_invoice: Array<BillingInvoice>;
  /** fetch aggregated fields from the table: "billing_invoice" */
  billing_invoice_aggregate: BillingInvoiceAggregate;
  /** fetch data from the table: "billing_invoice" using primary key columns */
  billing_invoice_by_pk: Maybe<BillingInvoice>;
  /** fetch data from the table: "billing_invoice_item" */
  billing_invoice_item: Array<BillingInvoiceItem>;
  /** fetch aggregated fields from the table: "billing_invoice_item" */
  billing_invoice_item_aggregate: BillingInvoiceItemAggregate;
  /** fetch data from the table: "billing_invoice_item" using primary key columns */
  billing_invoice_item_by_pk: Maybe<BillingInvoiceItem>;
  /** fetch data from the table: "billing_invoices" */
  billing_invoices: Array<BillingInvoices>;
  /** fetch aggregated fields from the table: "billing_invoices" */
  billing_invoices_aggregate: BillingInvoicesAggregate;
  /** fetch data from the table: "billing_invoices" using primary key columns */
  billing_invoices_by_pk: Maybe<BillingInvoices>;
  /** An array relationship */
  billing_items: Array<BillingItems>;
  /** An aggregate relationship */
  billing_items_aggregate: BillingItemsAggregate;
  /** fetch data from the table: "billing_items" using primary key columns */
  billing_items_by_pk: Maybe<BillingItems>;
  /** fetch data from the table: "billing_plan" */
  billing_plan: Array<BillingPlan>;
  /** fetch aggregated fields from the table: "billing_plan" */
  billing_plan_aggregate: BillingPlanAggregate;
  /** fetch data from the table: "billing_plan" using primary key columns */
  billing_plan_by_pk: Maybe<BillingPlan>;
  /** fetch data from the table: "client_billing_assignment" */
  client_billing_assignment: Array<ClientBillingAssignment>;
  /** fetch aggregated fields from the table: "client_billing_assignment" */
  client_billing_assignment_aggregate: ClientBillingAssignmentAggregate;
  /** fetch data from the table: "client_billing_assignment" using primary key columns */
  client_billing_assignment_by_pk: Maybe<ClientBillingAssignment>;
  /** An array relationship */
  client_external_systems: Array<ClientExternalSystems>;
  /** An aggregate relationship */
  client_external_systems_aggregate: ClientExternalSystemsAggregate;
  /** fetch data from the table: "client_external_systems" using primary key columns */
  client_external_systems_by_pk: Maybe<ClientExternalSystems>;
  /** fetch data from the table: "clients" */
  clients: Array<Clients>;
  /** fetch aggregated fields from the table: "clients" */
  clients_aggregate: ClientsAggregate;
  /** fetch data from the table: "clients" using primary key columns */
  clients_by_pk: Maybe<Clients>;
  /** execute function "create_payroll_version" which returns "payroll_version_results" */
  create_payroll_version: Array<PayrollVersionResults>;
  /** execute function "create_payroll_version" and query aggregates on result of table type "payroll_version_results" */
  create_payroll_version_aggregate: PayrollVersionResultsAggregate;
  /** fetch data from the table: "current_payrolls" */
  current_payrolls: Array<CurrentPayrolls>;
  /** fetch aggregated fields from the table: "current_payrolls" */
  current_payrolls_aggregate: CurrentPayrollsAggregate;
  /** fetch data from the table: "external_systems" */
  external_systems: Array<ExternalSystems>;
  /** fetch aggregated fields from the table: "external_systems" */
  external_systems_aggregate: ExternalSystemsAggregate;
  /** fetch data from the table: "external_systems" using primary key columns */
  external_systems_by_pk: Maybe<ExternalSystems>;
  /** fetch data from the table: "feature_flags" */
  feature_flags: Array<FeatureFlags>;
  /** fetch aggregated fields from the table: "feature_flags" */
  feature_flags_aggregate: FeatureFlagsAggregate;
  /** fetch data from the table: "feature_flags" using primary key columns */
  feature_flags_by_pk: Maybe<FeatureFlags>;
  /** execute function "generate_payroll_dates" which returns "payroll_dates" */
  generate_payroll_dates: Array<PayrollDates>;
  /** execute function "generate_payroll_dates" and query aggregates on result of table type "payroll_dates" */
  generate_payroll_dates_aggregate: PayrollDatesAggregate;
  /** execute function "get_latest_payroll_version" which returns "latest_payroll_version_results" */
  get_latest_payroll_version: Array<LatestPayrollVersionResults>;
  /** execute function "get_latest_payroll_version" and query aggregates on result of table type "latest_payroll_version_results" */
  get_latest_payroll_version_aggregate: LatestPayrollVersionResultsAggregate;
  /** execute function "get_payroll_version_history" which returns "payroll_version_history_results" */
  get_payroll_version_history: Array<PayrollVersionHistoryResults>;
  /** execute function "get_payroll_version_history" and query aggregates on result of table type "payroll_version_history_results" */
  get_payroll_version_history_aggregate: PayrollVersionHistoryResultsAggregate;
  /** fetch data from the table: "holidays" */
  holidays: Array<Holidays>;
  /** fetch aggregated fields from the table: "holidays" */
  holidays_aggregate: HolidaysAggregate;
  /** fetch data from the table: "holidays" using primary key columns */
  holidays_by_pk: Maybe<Holidays>;
  /** fetch data from the table: "latest_payroll_version_results" */
  latest_payroll_version_results: Array<LatestPayrollVersionResults>;
  /** fetch aggregated fields from the table: "latest_payroll_version_results" */
  latest_payroll_version_results_aggregate: LatestPayrollVersionResultsAggregate;
  /** fetch data from the table: "latest_payroll_version_results" using primary key columns */
  latest_payroll_version_results_by_pk: Maybe<LatestPayrollVersionResults>;
  /** fetch data from the table: "leave" */
  leave: Array<Leave>;
  /** fetch aggregated fields from the table: "leave" */
  leave_aggregate: LeaveAggregate;
  /** fetch data from the table: "leave" using primary key columns */
  leave_by_pk: Maybe<Leave>;
  /** fetch data from the table: "neon_auth.users_sync" */
  neon_auth_users_sync: Array<NeonAuthUsersSync>;
  /** fetch aggregated fields from the table: "neon_auth.users_sync" */
  neon_auth_users_sync_aggregate: NeonAuthUsersSyncAggregate;
  /** fetch data from the table: "neon_auth.users_sync" using primary key columns */
  neon_auth_users_sync_by_pk: Maybe<NeonAuthUsersSync>;
  /** fetch data from the table: "notes" */
  notes: Array<Notes>;
  /** fetch aggregated fields from the table: "notes" */
  notes_aggregate: NotesAggregate;
  /** fetch data from the table: "notes" using primary key columns */
  notes_by_pk: Maybe<Notes>;
  /** fetch data from the table: "payroll_activation_results" */
  payroll_activation_results: Array<PayrollActivationResults>;
  /** fetch aggregated fields from the table: "payroll_activation_results" */
  payroll_activation_results_aggregate: PayrollActivationResultsAggregate;
  /** fetch data from the table: "payroll_activation_results" using primary key columns */
  payroll_activation_results_by_pk: Maybe<PayrollActivationResults>;
  /** fetch data from the table: "payroll_assignment_audit" */
  payroll_assignment_audit: Array<PayrollAssignmentAudit>;
  /** fetch aggregated fields from the table: "payroll_assignment_audit" */
  payroll_assignment_audit_aggregate: PayrollAssignmentAuditAggregate;
  /** fetch data from the table: "payroll_assignment_audit" using primary key columns */
  payroll_assignment_audit_by_pk: Maybe<PayrollAssignmentAudit>;
  /** An array relationship */
  payroll_assignments: Array<PayrollAssignments>;
  /** An aggregate relationship */
  payroll_assignments_aggregate: PayrollAssignmentsAggregate;
  /** fetch data from the table: "payroll_assignments" using primary key columns */
  payroll_assignments_by_pk: Maybe<PayrollAssignments>;
  /** fetch data from the table: "payroll_cycles" */
  payroll_cycles: Array<PayrollCycles>;
  /** fetch aggregated fields from the table: "payroll_cycles" */
  payroll_cycles_aggregate: PayrollCyclesAggregate;
  /** fetch data from the table: "payroll_cycles" using primary key columns */
  payroll_cycles_by_pk: Maybe<PayrollCycles>;
  /** fetch data from the table: "payroll_dashboard_stats" */
  payroll_dashboard_stats: Array<PayrollDashboardStats>;
  /** fetch aggregated fields from the table: "payroll_dashboard_stats" */
  payroll_dashboard_stats_aggregate: PayrollDashboardStatsAggregate;
  /** fetch data from the table: "payroll_date_types" */
  payroll_date_types: Array<PayrollDateTypes>;
  /** fetch aggregated fields from the table: "payroll_date_types" */
  payroll_date_types_aggregate: PayrollDateTypesAggregate;
  /** fetch data from the table: "payroll_date_types" using primary key columns */
  payroll_date_types_by_pk: Maybe<PayrollDateTypes>;
  /** An array relationship */
  payroll_dates: Array<PayrollDates>;
  /** An aggregate relationship */
  payroll_dates_aggregate: PayrollDatesAggregate;
  /** fetch data from the table: "payroll_dates" using primary key columns */
  payroll_dates_by_pk: Maybe<PayrollDates>;
  /** fetch data from the table: "payroll_triggers_status" */
  payroll_triggers_status: Array<PayrollTriggersStatus>;
  /** fetch aggregated fields from the table: "payroll_triggers_status" */
  payroll_triggers_status_aggregate: PayrollTriggersStatusAggregate;
  /** fetch data from the table: "payroll_version_history_results" */
  payroll_version_history_results: Array<PayrollVersionHistoryResults>;
  /** fetch aggregated fields from the table: "payroll_version_history_results" */
  payroll_version_history_results_aggregate: PayrollVersionHistoryResultsAggregate;
  /** fetch data from the table: "payroll_version_history_results" using primary key columns */
  payroll_version_history_results_by_pk: Maybe<PayrollVersionHistoryResults>;
  /** fetch data from the table: "payroll_version_results" */
  payroll_version_results: Array<PayrollVersionResults>;
  /** fetch aggregated fields from the table: "payroll_version_results" */
  payroll_version_results_aggregate: PayrollVersionResultsAggregate;
  /** fetch data from the table: "payroll_version_results" using primary key columns */
  payroll_version_results_by_pk: Maybe<PayrollVersionResults>;
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrolls_aggregate: PayrollsAggregate;
  /** fetch data from the table: "payrolls" using primary key columns */
  payrolls_by_pk: Maybe<Payrolls>;
  /** An array relationship */
  permissions: Array<Permissions>;
  /** An aggregate relationship */
  permissions_aggregate: PermissionsAggregate;
  /** fetch data from the table: "permissions" using primary key columns */
  permissions_by_pk: Maybe<Permissions>;
  /** fetch data from the table: "resources" */
  resources: Array<Resources>;
  /** fetch aggregated fields from the table: "resources" */
  resources_aggregate: ResourcesAggregate;
  /** fetch data from the table: "resources" using primary key columns */
  resources_by_pk: Maybe<Resources>;
  /** An array relationship */
  role_permissions: Array<RolePermissions>;
  /** An aggregate relationship */
  role_permissions_aggregate: RolePermissionsAggregate;
  /** fetch data from the table: "role_permissions" using primary key columns */
  role_permissions_by_pk: Maybe<RolePermissions>;
  /** fetch data from the table: "roles" */
  roles: Array<Roles>;
  /** fetch aggregated fields from the table: "roles" */
  roles_aggregate: RolesAggregate;
  /** fetch data from the table: "roles" using primary key columns */
  roles_by_pk: Maybe<Roles>;
  /** An array relationship */
  user_roles: Array<UserRoles>;
  /** An aggregate relationship */
  user_roles_aggregate: UserRolesAggregate;
  /** fetch data from the table: "user_roles" using primary key columns */
  user_roles_by_pk: Maybe<UserRoles>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: UsersAggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk: Maybe<Users>;
  /** fetch data from the table: "users_role_backup" */
  users_role_backup: Array<UsersRoleBackup>;
  /** fetch aggregated fields from the table: "users_role_backup" */
  users_role_backup_aggregate: UsersRoleBackupAggregate;
  /** fetch data from the table: "work_schedule" */
  work_schedule: Array<WorkSchedule>;
  /** fetch aggregated fields from the table: "work_schedule" */
  work_schedule_aggregate: WorkScheduleAggregate;
  /** fetch data from the table: "work_schedule" using primary key columns */
  work_schedule_by_pk: Maybe<WorkSchedule>;
};


export type QueryRootEntitiesArgs = {
  representations: Array<Scalars['_Any']['input']>;
};


export type QueryRootActivatePayrollVersionsArgs = {
  distinct_on?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type QueryRootActivatePayrollVersionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type QueryRootAdjustmentRulesArgs = {
  distinct_on?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


export type QueryRootAdjustmentRulesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


export type QueryRootAdjustmentRulesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootAppSettingsArgs = {
  distinct_on?: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AppSettingsOrderBy>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};


export type QueryRootAppSettingsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AppSettingsOrderBy>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};


export type QueryRootAppSettingsByPkArgs = {
  id: Scalars['String']['input'];
};


export type QueryRootAuditAuditLogArgs = {
  distinct_on?: InputMaybe<Array<AuditAuditLogSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditAuditLogOrderBy>>;
  where?: InputMaybe<AuditAuditLogBoolExp>;
};


export type QueryRootAuditAuditLogAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditAuditLogSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditAuditLogOrderBy>>;
  where?: InputMaybe<AuditAuditLogBoolExp>;
};


export type QueryRootAuditAuditLogByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootAuditAuthEventsArgs = {
  distinct_on?: InputMaybe<Array<AuditAuthEventsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditAuthEventsOrderBy>>;
  where?: InputMaybe<AuditAuthEventsBoolExp>;
};


export type QueryRootAuditAuthEventsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditAuthEventsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditAuthEventsOrderBy>>;
  where?: InputMaybe<AuditAuthEventsBoolExp>;
};


export type QueryRootAuditAuthEventsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootAuditDataAccessLogArgs = {
  distinct_on?: InputMaybe<Array<AuditDataAccessLogSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditDataAccessLogOrderBy>>;
  where?: InputMaybe<AuditDataAccessLogBoolExp>;
};


export type QueryRootAuditDataAccessLogAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditDataAccessLogSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditDataAccessLogOrderBy>>;
  where?: InputMaybe<AuditDataAccessLogBoolExp>;
};


export type QueryRootAuditDataAccessLogByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootAuditPermissionChangesArgs = {
  distinct_on?: InputMaybe<Array<AuditPermissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditPermissionChangesOrderBy>>;
  where?: InputMaybe<AuditPermissionChangesBoolExp>;
};


export type QueryRootAuditPermissionChangesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditPermissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditPermissionChangesOrderBy>>;
  where?: InputMaybe<AuditPermissionChangesBoolExp>;
};


export type QueryRootAuditPermissionChangesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootAuditPermissionUsageReportArgs = {
  distinct_on?: InputMaybe<Array<AuditPermissionUsageReportSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditPermissionUsageReportOrderBy>>;
  where?: InputMaybe<AuditPermissionUsageReportBoolExp>;
};


export type QueryRootAuditPermissionUsageReportAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditPermissionUsageReportSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditPermissionUsageReportOrderBy>>;
  where?: InputMaybe<AuditPermissionUsageReportBoolExp>;
};


export type QueryRootAuditSlowQueriesArgs = {
  distinct_on?: InputMaybe<Array<AuditSlowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditSlowQueriesOrderBy>>;
  where?: InputMaybe<AuditSlowQueriesBoolExp>;
};


export type QueryRootAuditSlowQueriesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditSlowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditSlowQueriesOrderBy>>;
  where?: InputMaybe<AuditSlowQueriesBoolExp>;
};


export type QueryRootAuditSlowQueriesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootAuditUserAccessSummaryArgs = {
  distinct_on?: InputMaybe<Array<AuditUserAccessSummarySelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditUserAccessSummaryOrderBy>>;
  where?: InputMaybe<AuditUserAccessSummaryBoolExp>;
};


export type QueryRootAuditUserAccessSummaryAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditUserAccessSummarySelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditUserAccessSummaryOrderBy>>;
  where?: InputMaybe<AuditUserAccessSummaryBoolExp>;
};


export type QueryRootBillingEventLogArgs = {
  distinct_on?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingEventLogOrderBy>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};


export type QueryRootBillingEventLogAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingEventLogOrderBy>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};


export type QueryRootBillingEventLogByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootBillingInvoiceArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


export type QueryRootBillingInvoiceAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


export type QueryRootBillingInvoiceByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootBillingInvoiceItemArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


export type QueryRootBillingInvoiceItemAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


export type QueryRootBillingInvoiceItemByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootBillingInvoicesArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoicesOrderBy>>;
  where?: InputMaybe<BillingInvoicesBoolExp>;
};


export type QueryRootBillingInvoicesAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoicesOrderBy>>;
  where?: InputMaybe<BillingInvoicesBoolExp>;
};


export type QueryRootBillingInvoicesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootBillingItemsArgs = {
  distinct_on?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


export type QueryRootBillingItemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


export type QueryRootBillingItemsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootBillingPlanArgs = {
  distinct_on?: InputMaybe<Array<BillingPlanSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingPlanOrderBy>>;
  where?: InputMaybe<BillingPlanBoolExp>;
};


export type QueryRootBillingPlanAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingPlanSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingPlanOrderBy>>;
  where?: InputMaybe<BillingPlanBoolExp>;
};


export type QueryRootBillingPlanByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootClientBillingAssignmentArgs = {
  distinct_on?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientBillingAssignmentOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};


export type QueryRootClientBillingAssignmentAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientBillingAssignmentOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};


export type QueryRootClientBillingAssignmentByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootClientExternalSystemsArgs = {
  distinct_on?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type QueryRootClientExternalSystemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type QueryRootClientExternalSystemsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootClientsArgs = {
  distinct_on?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};


export type QueryRootClientsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};


export type QueryRootClientsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootCreatePayrollVersionArgs = {
  args: CreatePayrollVersionArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type QueryRootCreatePayrollVersionAggregateArgs = {
  args: CreatePayrollVersionArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type QueryRootCurrentPayrollsArgs = {
  distinct_on?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};


export type QueryRootCurrentPayrollsAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};


export type QueryRootExternalSystemsArgs = {
  distinct_on?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};


export type QueryRootExternalSystemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};


export type QueryRootExternalSystemsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootFeatureFlagsArgs = {
  distinct_on?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};


export type QueryRootFeatureFlagsAggregateArgs = {
  distinct_on?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};


export type QueryRootFeatureFlagsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootGeneratePayrollDatesArgs = {
  args: GeneratePayrollDatesArgs;
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type QueryRootGeneratePayrollDatesAggregateArgs = {
  args: GeneratePayrollDatesArgs;
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type QueryRootGetLatestPayrollVersionArgs = {
  args: GetLatestPayrollVersionArgs;
  distinct_on?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type QueryRootGetLatestPayrollVersionAggregateArgs = {
  args: GetLatestPayrollVersionArgs;
  distinct_on?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type QueryRootGetPayrollVersionHistoryArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type QueryRootGetPayrollVersionHistoryAggregateArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type QueryRootHolidaysArgs = {
  distinct_on?: InputMaybe<Array<HolidaysSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<HolidaysOrderBy>>;
  where?: InputMaybe<HolidaysBoolExp>;
};


export type QueryRootHolidaysAggregateArgs = {
  distinct_on?: InputMaybe<Array<HolidaysSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<HolidaysOrderBy>>;
  where?: InputMaybe<HolidaysBoolExp>;
};


export type QueryRootHolidaysByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootLatestPayrollVersionResultsArgs = {
  distinct_on?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type QueryRootLatestPayrollVersionResultsAggregateArgs = {
  distinct_on?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type QueryRootLatestPayrollVersionResultsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootLeaveArgs = {
  distinct_on?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};


export type QueryRootLeaveAggregateArgs = {
  distinct_on?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};


export type QueryRootLeaveByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootNeonAuthUsersSyncArgs = {
  distinct_on?: InputMaybe<Array<NeonAuthUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NeonAuthUsersSyncOrderBy>>;
  where?: InputMaybe<NeonAuthUsersSyncBoolExp>;
};


export type QueryRootNeonAuthUsersSyncAggregateArgs = {
  distinct_on?: InputMaybe<Array<NeonAuthUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NeonAuthUsersSyncOrderBy>>;
  where?: InputMaybe<NeonAuthUsersSyncBoolExp>;
};


export type QueryRootNeonAuthUsersSyncByPkArgs = {
  id: Scalars['String']['input'];
};


export type QueryRootNotesArgs = {
  distinct_on?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};


export type QueryRootNotesAggregateArgs = {
  distinct_on?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};


export type QueryRootNotesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollActivationResultsArgs = {
  distinct_on?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type QueryRootPayrollActivationResultsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type QueryRootPayrollActivationResultsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollAssignmentAuditArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};


export type QueryRootPayrollAssignmentAuditAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};


export type QueryRootPayrollAssignmentAuditByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollAssignmentsArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type QueryRootPayrollAssignmentsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type QueryRootPayrollAssignmentsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollCyclesArgs = {
  distinct_on?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};


export type QueryRootPayrollCyclesAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};


export type QueryRootPayrollCyclesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollDashboardStatsArgs = {
  distinct_on?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type QueryRootPayrollDashboardStatsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type QueryRootPayrollDateTypesArgs = {
  distinct_on?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};


export type QueryRootPayrollDateTypesAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};


export type QueryRootPayrollDateTypesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollDatesArgs = {
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type QueryRootPayrollDatesAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type QueryRootPayrollDatesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollTriggersStatusArgs = {
  distinct_on?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type QueryRootPayrollTriggersStatusAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type QueryRootPayrollVersionHistoryResultsArgs = {
  distinct_on?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type QueryRootPayrollVersionHistoryResultsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type QueryRootPayrollVersionHistoryResultsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollVersionResultsArgs = {
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type QueryRootPayrollVersionResultsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type QueryRootPayrollVersionResultsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPayrollsArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


export type QueryRootPayrollsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


export type QueryRootPayrollsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootPermissionsArgs = {
  distinct_on?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};


export type QueryRootPermissionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};


export type QueryRootPermissionsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootResourcesArgs = {
  distinct_on?: InputMaybe<Array<ResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ResourcesOrderBy>>;
  where?: InputMaybe<ResourcesBoolExp>;
};


export type QueryRootResourcesAggregateArgs = {
  distinct_on?: InputMaybe<Array<ResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ResourcesOrderBy>>;
  where?: InputMaybe<ResourcesBoolExp>;
};


export type QueryRootResourcesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootRolePermissionsArgs = {
  distinct_on?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


export type QueryRootRolePermissionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


export type QueryRootRolePermissionsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootRolesArgs = {
  distinct_on?: InputMaybe<Array<RolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RolesOrderBy>>;
  where?: InputMaybe<RolesBoolExp>;
};


export type QueryRootRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<RolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RolesOrderBy>>;
  where?: InputMaybe<RolesBoolExp>;
};


export type QueryRootRolesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootUserRolesArgs = {
  distinct_on?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


export type QueryRootUserRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


export type QueryRootUserRolesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootUsersArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type QueryRootUsersAggregateArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type QueryRootUsersByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootUsersRoleBackupArgs = {
  distinct_on?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};


export type QueryRootUsersRoleBackupAggregateArgs = {
  distinct_on?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};


export type QueryRootWorkScheduleArgs = {
  distinct_on?: InputMaybe<Array<WorkScheduleSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<WorkScheduleOrderBy>>;
  where?: InputMaybe<WorkScheduleBoolExp>;
};


export type QueryRootWorkScheduleAggregateArgs = {
  distinct_on?: InputMaybe<Array<WorkScheduleSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<WorkScheduleOrderBy>>;
  where?: InputMaybe<WorkScheduleBoolExp>;
};


export type QueryRootWorkScheduleByPkArgs = {
  id: Scalars['uuid']['input'];
};

/** columns and relationships of "resources" */
export type Resources = {
  __typename: 'resources';
  created_at: Scalars['timestamptz']['output'];
  description: Maybe<Scalars['String']['output']>;
  display_name: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  /** An array relationship */
  permissions: Array<Permissions>;
  /** An aggregate relationship */
  permissions_aggregate: PermissionsAggregate;
  updated_at: Scalars['timestamptz']['output'];
};


/** columns and relationships of "resources" */
export type ResourcesPermissionsArgs = {
  distinct_on?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};


/** columns and relationships of "resources" */
export type ResourcesPermissionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};

/** aggregated selection of "resources" */
export type ResourcesAggregate = {
  __typename: 'resources_aggregate';
  aggregate: Maybe<ResourcesAggregateFields>;
  nodes: Array<Resources>;
};

/** aggregate fields of "resources" */
export type ResourcesAggregateFields = {
  __typename: 'resources_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<ResourcesMaxFields>;
  min: Maybe<ResourcesMinFields>;
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
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  display_name?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  permissions?: InputMaybe<PermissionsBoolExp>;
  permissions_aggregate?: InputMaybe<PermissionsAggregateBoolExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
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
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<PermissionsArrRelInsertInput>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type ResourcesMaxFields = {
  __typename: 'resources_max_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  description: Maybe<Scalars['String']['output']>;
  display_name: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type ResourcesMinFields = {
  __typename: 'resources_min_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  description: Maybe<Scalars['String']['output']>;
  display_name: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "resources" */
export type ResourcesMutationResponse = {
  __typename: 'resources_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Resources>;
};

/** input type for inserting object relation for remote table "resources" */
export type ResourcesObjRelInsertInput = {
  data: ResourcesInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<ResourcesOnConflict>;
};

/** on_conflict condition type for table "resources" */
export type ResourcesOnConflict = {
  constraint: ResourcesConstraint;
  update_columns?: Array<ResourcesUpdateColumn>;
  where?: InputMaybe<ResourcesBoolExp>;
};

/** Ordering options when selecting data from "resources". */
export type ResourcesOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  display_name?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  permissions_aggregate?: InputMaybe<PermissionsAggregateOrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: resources */
export type ResourcesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "resources" */
export enum ResourcesSelectColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  display_name = 'display_name',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updated_at = 'updated_at'
}

/** input type for updating data in table "resources" */
export type ResourcesSetInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "resources" */
export type ResourcesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ResourcesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ResourcesStreamCursorValueInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "resources" */
export enum ResourcesUpdateColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  display_name = 'display_name',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  updated_at = 'updated_at'
}

export type ResourcesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ResourcesSetInput>;
  /** filter the rows which have to be updated */
  where: ResourcesBoolExp;
};

/** columns and relationships of "role_permissions" */
export type RolePermissions = {
  __typename: 'role_permissions';
  conditions: Maybe<Scalars['jsonb']['output']>;
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  /** An object relationship */
  permission: Permissions;
  permission_id: Scalars['uuid']['output'];
  /** An object relationship */
  role: Roles;
  role_id: Scalars['uuid']['output'];
  updated_at: Scalars['timestamptz']['output'];
};


/** columns and relationships of "role_permissions" */
export type RolePermissionsConditionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "role_permissions" */
export type RolePermissionsAggregate = {
  __typename: 'role_permissions_aggregate';
  aggregate: Maybe<RolePermissionsAggregateFields>;
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
  __typename: 'role_permissions_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<RolePermissionsMaxFields>;
  min: Maybe<RolePermissionsMinFields>;
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
  on_conflict?: InputMaybe<RolePermissionsOnConflict>;
};

/** Boolean expression to filter rows from the table "role_permissions". All fields are combined with a logical 'AND'. */
export type RolePermissionsBoolExp = {
  _and?: InputMaybe<Array<RolePermissionsBoolExp>>;
  _not?: InputMaybe<RolePermissionsBoolExp>;
  _or?: InputMaybe<Array<RolePermissionsBoolExp>>;
  conditions?: InputMaybe<JsonbComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  permission?: InputMaybe<PermissionsBoolExp>;
  permission_id?: InputMaybe<UuidComparisonExp>;
  role?: InputMaybe<RolesBoolExp>;
  role_id?: InputMaybe<UuidComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
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
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  permission?: InputMaybe<PermissionsObjRelInsertInput>;
  permission_id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<RolesObjRelInsertInput>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type RolePermissionsMaxFields = {
  __typename: 'role_permissions_max_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  permission_id: Maybe<Scalars['uuid']['output']>;
  role_id: Maybe<Scalars['uuid']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "role_permissions" */
export type RolePermissionsMaxOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  permission_id?: InputMaybe<OrderBy>;
  role_id?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type RolePermissionsMinFields = {
  __typename: 'role_permissions_min_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  permission_id: Maybe<Scalars['uuid']['output']>;
  role_id: Maybe<Scalars['uuid']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "role_permissions" */
export type RolePermissionsMinOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  permission_id?: InputMaybe<OrderBy>;
  role_id?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "role_permissions" */
export type RolePermissionsMutationResponse = {
  __typename: 'role_permissions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<RolePermissions>;
};

/** on_conflict condition type for table "role_permissions" */
export type RolePermissionsOnConflict = {
  constraint: RolePermissionsConstraint;
  update_columns?: Array<RolePermissionsUpdateColumn>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};

/** Ordering options when selecting data from "role_permissions". */
export type RolePermissionsOrderBy = {
  conditions?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  permission?: InputMaybe<PermissionsOrderBy>;
  permission_id?: InputMaybe<OrderBy>;
  role?: InputMaybe<RolesOrderBy>;
  role_id?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
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
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  permission_id = 'permission_id',
  /** column name */
  role_id = 'role_id',
  /** column name */
  updated_at = 'updated_at'
}

/** input type for updating data in table "role_permissions" */
export type RolePermissionsSetInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  permission_id?: InputMaybe<Scalars['uuid']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "role_permissions" */
export type RolePermissionsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: RolePermissionsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RolePermissionsStreamCursorValueInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  permission_id?: InputMaybe<Scalars['uuid']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "role_permissions" */
export enum RolePermissionsUpdateColumn {
  /** column name */
  conditions = 'conditions',
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  permission_id = 'permission_id',
  /** column name */
  role_id = 'role_id',
  /** column name */
  updated_at = 'updated_at'
}

export type RolePermissionsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<RolePermissionsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<RolePermissionsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<RolePermissionsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<RolePermissionsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<RolePermissionsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<RolePermissionsSetInput>;
  /** filter the rows which have to be updated */
  where: RolePermissionsBoolExp;
};

/** columns and relationships of "roles" */
export type Roles = {
  __typename: 'roles';
  created_at: Scalars['timestamptz']['output'];
  description: Maybe<Scalars['String']['output']>;
  display_name: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  is_system_role: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  /** An array relationship */
  role_permissions: Array<RolePermissions>;
  /** An aggregate relationship */
  role_permissions_aggregate: RolePermissionsAggregate;
  updated_at: Scalars['timestamptz']['output'];
  /** An array relationship */
  user_roles: Array<UserRoles>;
  /** An aggregate relationship */
  user_roles_aggregate: UserRolesAggregate;
};


/** columns and relationships of "roles" */
export type RolesRolePermissionsArgs = {
  distinct_on?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


/** columns and relationships of "roles" */
export type RolesRolePermissionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


/** columns and relationships of "roles" */
export type RolesUserRolesArgs = {
  distinct_on?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


/** columns and relationships of "roles" */
export type RolesUserRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};

/** aggregated selection of "roles" */
export type RolesAggregate = {
  __typename: 'roles_aggregate';
  aggregate: Maybe<RolesAggregateFields>;
  nodes: Array<Roles>;
};

/** aggregate fields of "roles" */
export type RolesAggregateFields = {
  __typename: 'roles_aggregate_fields';
  avg: Maybe<RolesAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<RolesMaxFields>;
  min: Maybe<RolesMinFields>;
  stddev: Maybe<RolesStddevFields>;
  stddev_pop: Maybe<RolesStddevPopFields>;
  stddev_samp: Maybe<RolesStddevSampFields>;
  sum: Maybe<RolesSumFields>;
  var_pop: Maybe<RolesVarPopFields>;
  var_samp: Maybe<RolesVarSampFields>;
  variance: Maybe<RolesVarianceFields>;
};


/** aggregate fields of "roles" */
export type RolesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<RolesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type RolesAvgFields = {
  __typename: 'roles_avg_fields';
  priority: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "roles". All fields are combined with a logical 'AND'. */
export type RolesBoolExp = {
  _and?: InputMaybe<Array<RolesBoolExp>>;
  _not?: InputMaybe<RolesBoolExp>;
  _or?: InputMaybe<Array<RolesBoolExp>>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  display_name?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  is_system_role?: InputMaybe<BooleanComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  priority?: InputMaybe<IntComparisonExp>;
  role_permissions?: InputMaybe<RolePermissionsBoolExp>;
  role_permissions_aggregate?: InputMaybe<RolePermissionsAggregateBoolExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
  user_roles?: InputMaybe<UserRolesBoolExp>;
  user_roles_aggregate?: InputMaybe<UserRolesAggregateBoolExp>;
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
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_system_role?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  role_permissions?: InputMaybe<RolePermissionsArrRelInsertInput>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_roles?: InputMaybe<UserRolesArrRelInsertInput>;
};

/** aggregate max on columns */
export type RolesMaxFields = {
  __typename: 'roles_max_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  description: Maybe<Scalars['String']['output']>;
  display_name: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  priority: Maybe<Scalars['Int']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type RolesMinFields = {
  __typename: 'roles_min_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  description: Maybe<Scalars['String']['output']>;
  display_name: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  name: Maybe<Scalars['String']['output']>;
  priority: Maybe<Scalars['Int']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "roles" */
export type RolesMutationResponse = {
  __typename: 'roles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Roles>;
};

/** input type for inserting object relation for remote table "roles" */
export type RolesObjRelInsertInput = {
  data: RolesInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<RolesOnConflict>;
};

/** on_conflict condition type for table "roles" */
export type RolesOnConflict = {
  constraint: RolesConstraint;
  update_columns?: Array<RolesUpdateColumn>;
  where?: InputMaybe<RolesBoolExp>;
};

/** Ordering options when selecting data from "roles". */
export type RolesOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  display_name?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  is_system_role?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  priority?: InputMaybe<OrderBy>;
  role_permissions_aggregate?: InputMaybe<RolePermissionsAggregateOrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  user_roles_aggregate?: InputMaybe<UserRolesAggregateOrderBy>;
};

/** primary key columns input for table: roles */
export type RolesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "roles" */
export enum RolesSelectColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  display_name = 'display_name',
  /** column name */
  id = 'id',
  /** column name */
  is_system_role = 'is_system_role',
  /** column name */
  name = 'name',
  /** column name */
  priority = 'priority',
  /** column name */
  updated_at = 'updated_at'
}

/** input type for updating data in table "roles" */
export type RolesSetInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_system_role?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type RolesStddevFields = {
  __typename: 'roles_stddev_fields';
  priority: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type RolesStddevPopFields = {
  __typename: 'roles_stddev_pop_fields';
  priority: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type RolesStddevSampFields = {
  __typename: 'roles_stddev_samp_fields';
  priority: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "roles" */
export type RolesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: RolesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RolesStreamCursorValueInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_system_role?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type RolesSumFields = {
  __typename: 'roles_sum_fields';
  priority: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "roles" */
export enum RolesUpdateColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  display_name = 'display_name',
  /** column name */
  id = 'id',
  /** column name */
  is_system_role = 'is_system_role',
  /** column name */
  name = 'name',
  /** column name */
  priority = 'priority',
  /** column name */
  updated_at = 'updated_at'
}

export type RolesUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<RolesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<RolesSetInput>;
  /** filter the rows which have to be updated */
  where: RolesBoolExp;
};

/** aggregate var_pop on columns */
export type RolesVarPopFields = {
  __typename: 'roles_var_pop_fields';
  priority: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type RolesVarSampFields = {
  __typename: 'roles_var_samp_fields';
  priority: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type RolesVarianceFields = {
  __typename: 'roles_variance_fields';
  priority: Maybe<Scalars['Float']['output']>;
};

export type SubscriptionRoot = {
  __typename: 'subscription_root';
  /** execute function "activate_payroll_versions" which returns "payroll_activation_results" */
  activate_payroll_versions: Array<PayrollActivationResults>;
  /** execute function "activate_payroll_versions" and query aggregates on result of table type "payroll_activation_results" */
  activate_payroll_versions_aggregate: PayrollActivationResultsAggregate;
  /** An array relationship */
  adjustment_rules: Array<AdjustmentRules>;
  /** An aggregate relationship */
  adjustment_rules_aggregate: AdjustmentRulesAggregate;
  /** fetch data from the table: "adjustment_rules" using primary key columns */
  adjustment_rules_by_pk: Maybe<AdjustmentRules>;
  /** fetch data from the table in a streaming manner: "adjustment_rules" */
  adjustment_rules_stream: Array<AdjustmentRules>;
  /** fetch data from the table: "app_settings" */
  app_settings: Array<AppSettings>;
  /** fetch aggregated fields from the table: "app_settings" */
  app_settings_aggregate: AppSettingsAggregate;
  /** fetch data from the table: "app_settings" using primary key columns */
  app_settings_by_pk: Maybe<AppSettings>;
  /** fetch data from the table in a streaming manner: "app_settings" */
  app_settings_stream: Array<AppSettings>;
  /** fetch data from the table: "audit.audit_log" */
  audit_audit_log: Array<AuditAuditLog>;
  /** fetch aggregated fields from the table: "audit.audit_log" */
  audit_audit_log_aggregate: AuditAuditLogAggregate;
  /** fetch data from the table: "audit.audit_log" using primary key columns */
  audit_audit_log_by_pk: Maybe<AuditAuditLog>;
  /** fetch data from the table in a streaming manner: "audit.audit_log" */
  audit_audit_log_stream: Array<AuditAuditLog>;
  /** fetch data from the table: "audit.auth_events" */
  audit_auth_events: Array<AuditAuthEvents>;
  /** fetch aggregated fields from the table: "audit.auth_events" */
  audit_auth_events_aggregate: AuditAuthEventsAggregate;
  /** fetch data from the table: "audit.auth_events" using primary key columns */
  audit_auth_events_by_pk: Maybe<AuditAuthEvents>;
  /** fetch data from the table in a streaming manner: "audit.auth_events" */
  audit_auth_events_stream: Array<AuditAuthEvents>;
  /** fetch data from the table: "audit.data_access_log" */
  audit_data_access_log: Array<AuditDataAccessLog>;
  /** fetch aggregated fields from the table: "audit.data_access_log" */
  audit_data_access_log_aggregate: AuditDataAccessLogAggregate;
  /** fetch data from the table: "audit.data_access_log" using primary key columns */
  audit_data_access_log_by_pk: Maybe<AuditDataAccessLog>;
  /** fetch data from the table in a streaming manner: "audit.data_access_log" */
  audit_data_access_log_stream: Array<AuditDataAccessLog>;
  /** fetch data from the table: "audit.permission_changes" */
  audit_permission_changes: Array<AuditPermissionChanges>;
  /** fetch aggregated fields from the table: "audit.permission_changes" */
  audit_permission_changes_aggregate: AuditPermissionChangesAggregate;
  /** fetch data from the table: "audit.permission_changes" using primary key columns */
  audit_permission_changes_by_pk: Maybe<AuditPermissionChanges>;
  /** fetch data from the table in a streaming manner: "audit.permission_changes" */
  audit_permission_changes_stream: Array<AuditPermissionChanges>;
  /** fetch data from the table: "audit.permission_usage_report" */
  audit_permission_usage_report: Array<AuditPermissionUsageReport>;
  /** fetch aggregated fields from the table: "audit.permission_usage_report" */
  audit_permission_usage_report_aggregate: AuditPermissionUsageReportAggregate;
  /** fetch data from the table in a streaming manner: "audit.permission_usage_report" */
  audit_permission_usage_report_stream: Array<AuditPermissionUsageReport>;
  /** fetch data from the table: "audit.slow_queries" */
  audit_slow_queries: Array<AuditSlowQueries>;
  /** fetch aggregated fields from the table: "audit.slow_queries" */
  audit_slow_queries_aggregate: AuditSlowQueriesAggregate;
  /** fetch data from the table: "audit.slow_queries" using primary key columns */
  audit_slow_queries_by_pk: Maybe<AuditSlowQueries>;
  /** fetch data from the table in a streaming manner: "audit.slow_queries" */
  audit_slow_queries_stream: Array<AuditSlowQueries>;
  /** fetch data from the table: "audit.user_access_summary" */
  audit_user_access_summary: Array<AuditUserAccessSummary>;
  /** fetch aggregated fields from the table: "audit.user_access_summary" */
  audit_user_access_summary_aggregate: AuditUserAccessSummaryAggregate;
  /** fetch data from the table in a streaming manner: "audit.user_access_summary" */
  audit_user_access_summary_stream: Array<AuditUserAccessSummary>;
  /** fetch data from the table: "billing_event_log" */
  billing_event_log: Array<BillingEventLog>;
  /** fetch aggregated fields from the table: "billing_event_log" */
  billing_event_log_aggregate: BillingEventLogAggregate;
  /** fetch data from the table: "billing_event_log" using primary key columns */
  billing_event_log_by_pk: Maybe<BillingEventLog>;
  /** fetch data from the table in a streaming manner: "billing_event_log" */
  billing_event_log_stream: Array<BillingEventLog>;
  /** fetch data from the table: "billing_invoice" */
  billing_invoice: Array<BillingInvoice>;
  /** fetch aggregated fields from the table: "billing_invoice" */
  billing_invoice_aggregate: BillingInvoiceAggregate;
  /** fetch data from the table: "billing_invoice" using primary key columns */
  billing_invoice_by_pk: Maybe<BillingInvoice>;
  /** fetch data from the table: "billing_invoice_item" */
  billing_invoice_item: Array<BillingInvoiceItem>;
  /** fetch aggregated fields from the table: "billing_invoice_item" */
  billing_invoice_item_aggregate: BillingInvoiceItemAggregate;
  /** fetch data from the table: "billing_invoice_item" using primary key columns */
  billing_invoice_item_by_pk: Maybe<BillingInvoiceItem>;
  /** fetch data from the table in a streaming manner: "billing_invoice_item" */
  billing_invoice_item_stream: Array<BillingInvoiceItem>;
  /** fetch data from the table in a streaming manner: "billing_invoice" */
  billing_invoice_stream: Array<BillingInvoice>;
  /** fetch data from the table: "billing_invoices" */
  billing_invoices: Array<BillingInvoices>;
  /** fetch aggregated fields from the table: "billing_invoices" */
  billing_invoices_aggregate: BillingInvoicesAggregate;
  /** fetch data from the table: "billing_invoices" using primary key columns */
  billing_invoices_by_pk: Maybe<BillingInvoices>;
  /** fetch data from the table in a streaming manner: "billing_invoices" */
  billing_invoices_stream: Array<BillingInvoices>;
  /** An array relationship */
  billing_items: Array<BillingItems>;
  /** An aggregate relationship */
  billing_items_aggregate: BillingItemsAggregate;
  /** fetch data from the table: "billing_items" using primary key columns */
  billing_items_by_pk: Maybe<BillingItems>;
  /** fetch data from the table in a streaming manner: "billing_items" */
  billing_items_stream: Array<BillingItems>;
  /** fetch data from the table: "billing_plan" */
  billing_plan: Array<BillingPlan>;
  /** fetch aggregated fields from the table: "billing_plan" */
  billing_plan_aggregate: BillingPlanAggregate;
  /** fetch data from the table: "billing_plan" using primary key columns */
  billing_plan_by_pk: Maybe<BillingPlan>;
  /** fetch data from the table in a streaming manner: "billing_plan" */
  billing_plan_stream: Array<BillingPlan>;
  /** fetch data from the table: "client_billing_assignment" */
  client_billing_assignment: Array<ClientBillingAssignment>;
  /** fetch aggregated fields from the table: "client_billing_assignment" */
  client_billing_assignment_aggregate: ClientBillingAssignmentAggregate;
  /** fetch data from the table: "client_billing_assignment" using primary key columns */
  client_billing_assignment_by_pk: Maybe<ClientBillingAssignment>;
  /** fetch data from the table in a streaming manner: "client_billing_assignment" */
  client_billing_assignment_stream: Array<ClientBillingAssignment>;
  /** An array relationship */
  client_external_systems: Array<ClientExternalSystems>;
  /** An aggregate relationship */
  client_external_systems_aggregate: ClientExternalSystemsAggregate;
  /** fetch data from the table: "client_external_systems" using primary key columns */
  client_external_systems_by_pk: Maybe<ClientExternalSystems>;
  /** fetch data from the table in a streaming manner: "client_external_systems" */
  client_external_systems_stream: Array<ClientExternalSystems>;
  /** fetch data from the table: "clients" */
  clients: Array<Clients>;
  /** fetch aggregated fields from the table: "clients" */
  clients_aggregate: ClientsAggregate;
  /** fetch data from the table: "clients" using primary key columns */
  clients_by_pk: Maybe<Clients>;
  /** fetch data from the table in a streaming manner: "clients" */
  clients_stream: Array<Clients>;
  /** execute function "create_payroll_version" which returns "payroll_version_results" */
  create_payroll_version: Array<PayrollVersionResults>;
  /** execute function "create_payroll_version" and query aggregates on result of table type "payroll_version_results" */
  create_payroll_version_aggregate: PayrollVersionResultsAggregate;
  /** fetch data from the table: "current_payrolls" */
  current_payrolls: Array<CurrentPayrolls>;
  /** fetch aggregated fields from the table: "current_payrolls" */
  current_payrolls_aggregate: CurrentPayrollsAggregate;
  /** fetch data from the table in a streaming manner: "current_payrolls" */
  current_payrolls_stream: Array<CurrentPayrolls>;
  /** fetch data from the table: "external_systems" */
  external_systems: Array<ExternalSystems>;
  /** fetch aggregated fields from the table: "external_systems" */
  external_systems_aggregate: ExternalSystemsAggregate;
  /** fetch data from the table: "external_systems" using primary key columns */
  external_systems_by_pk: Maybe<ExternalSystems>;
  /** fetch data from the table in a streaming manner: "external_systems" */
  external_systems_stream: Array<ExternalSystems>;
  /** fetch data from the table: "feature_flags" */
  feature_flags: Array<FeatureFlags>;
  /** fetch aggregated fields from the table: "feature_flags" */
  feature_flags_aggregate: FeatureFlagsAggregate;
  /** fetch data from the table: "feature_flags" using primary key columns */
  feature_flags_by_pk: Maybe<FeatureFlags>;
  /** fetch data from the table in a streaming manner: "feature_flags" */
  feature_flags_stream: Array<FeatureFlags>;
  /** execute function "generate_payroll_dates" which returns "payroll_dates" */
  generate_payroll_dates: Array<PayrollDates>;
  /** execute function "generate_payroll_dates" and query aggregates on result of table type "payroll_dates" */
  generate_payroll_dates_aggregate: PayrollDatesAggregate;
  /** execute function "get_latest_payroll_version" which returns "latest_payroll_version_results" */
  get_latest_payroll_version: Array<LatestPayrollVersionResults>;
  /** execute function "get_latest_payroll_version" and query aggregates on result of table type "latest_payroll_version_results" */
  get_latest_payroll_version_aggregate: LatestPayrollVersionResultsAggregate;
  /** execute function "get_payroll_version_history" which returns "payroll_version_history_results" */
  get_payroll_version_history: Array<PayrollVersionHistoryResults>;
  /** execute function "get_payroll_version_history" and query aggregates on result of table type "payroll_version_history_results" */
  get_payroll_version_history_aggregate: PayrollVersionHistoryResultsAggregate;
  /** fetch data from the table: "holidays" */
  holidays: Array<Holidays>;
  /** fetch aggregated fields from the table: "holidays" */
  holidays_aggregate: HolidaysAggregate;
  /** fetch data from the table: "holidays" using primary key columns */
  holidays_by_pk: Maybe<Holidays>;
  /** fetch data from the table in a streaming manner: "holidays" */
  holidays_stream: Array<Holidays>;
  /** fetch data from the table: "latest_payroll_version_results" */
  latest_payroll_version_results: Array<LatestPayrollVersionResults>;
  /** fetch aggregated fields from the table: "latest_payroll_version_results" */
  latest_payroll_version_results_aggregate: LatestPayrollVersionResultsAggregate;
  /** fetch data from the table: "latest_payroll_version_results" using primary key columns */
  latest_payroll_version_results_by_pk: Maybe<LatestPayrollVersionResults>;
  /** fetch data from the table in a streaming manner: "latest_payroll_version_results" */
  latest_payroll_version_results_stream: Array<LatestPayrollVersionResults>;
  /** fetch data from the table: "leave" */
  leave: Array<Leave>;
  /** fetch aggregated fields from the table: "leave" */
  leave_aggregate: LeaveAggregate;
  /** fetch data from the table: "leave" using primary key columns */
  leave_by_pk: Maybe<Leave>;
  /** fetch data from the table in a streaming manner: "leave" */
  leave_stream: Array<Leave>;
  /** fetch data from the table: "neon_auth.users_sync" */
  neon_auth_users_sync: Array<NeonAuthUsersSync>;
  /** fetch aggregated fields from the table: "neon_auth.users_sync" */
  neon_auth_users_sync_aggregate: NeonAuthUsersSyncAggregate;
  /** fetch data from the table: "neon_auth.users_sync" using primary key columns */
  neon_auth_users_sync_by_pk: Maybe<NeonAuthUsersSync>;
  /** fetch data from the table in a streaming manner: "neon_auth.users_sync" */
  neon_auth_users_sync_stream: Array<NeonAuthUsersSync>;
  /** fetch data from the table: "notes" */
  notes: Array<Notes>;
  /** fetch aggregated fields from the table: "notes" */
  notes_aggregate: NotesAggregate;
  /** fetch data from the table: "notes" using primary key columns */
  notes_by_pk: Maybe<Notes>;
  /** fetch data from the table in a streaming manner: "notes" */
  notes_stream: Array<Notes>;
  /** fetch data from the table: "payroll_activation_results" */
  payroll_activation_results: Array<PayrollActivationResults>;
  /** fetch aggregated fields from the table: "payroll_activation_results" */
  payroll_activation_results_aggregate: PayrollActivationResultsAggregate;
  /** fetch data from the table: "payroll_activation_results" using primary key columns */
  payroll_activation_results_by_pk: Maybe<PayrollActivationResults>;
  /** fetch data from the table in a streaming manner: "payroll_activation_results" */
  payroll_activation_results_stream: Array<PayrollActivationResults>;
  /** fetch data from the table: "payroll_assignment_audit" */
  payroll_assignment_audit: Array<PayrollAssignmentAudit>;
  /** fetch aggregated fields from the table: "payroll_assignment_audit" */
  payroll_assignment_audit_aggregate: PayrollAssignmentAuditAggregate;
  /** fetch data from the table: "payroll_assignment_audit" using primary key columns */
  payroll_assignment_audit_by_pk: Maybe<PayrollAssignmentAudit>;
  /** fetch data from the table in a streaming manner: "payroll_assignment_audit" */
  payroll_assignment_audit_stream: Array<PayrollAssignmentAudit>;
  /** An array relationship */
  payroll_assignments: Array<PayrollAssignments>;
  /** An aggregate relationship */
  payroll_assignments_aggregate: PayrollAssignmentsAggregate;
  /** fetch data from the table: "payroll_assignments" using primary key columns */
  payroll_assignments_by_pk: Maybe<PayrollAssignments>;
  /** fetch data from the table in a streaming manner: "payroll_assignments" */
  payroll_assignments_stream: Array<PayrollAssignments>;
  /** fetch data from the table: "payroll_cycles" */
  payroll_cycles: Array<PayrollCycles>;
  /** fetch aggregated fields from the table: "payroll_cycles" */
  payroll_cycles_aggregate: PayrollCyclesAggregate;
  /** fetch data from the table: "payroll_cycles" using primary key columns */
  payroll_cycles_by_pk: Maybe<PayrollCycles>;
  /** fetch data from the table in a streaming manner: "payroll_cycles" */
  payroll_cycles_stream: Array<PayrollCycles>;
  /** fetch data from the table: "payroll_dashboard_stats" */
  payroll_dashboard_stats: Array<PayrollDashboardStats>;
  /** fetch aggregated fields from the table: "payroll_dashboard_stats" */
  payroll_dashboard_stats_aggregate: PayrollDashboardStatsAggregate;
  /** fetch data from the table in a streaming manner: "payroll_dashboard_stats" */
  payroll_dashboard_stats_stream: Array<PayrollDashboardStats>;
  /** fetch data from the table: "payroll_date_types" */
  payroll_date_types: Array<PayrollDateTypes>;
  /** fetch aggregated fields from the table: "payroll_date_types" */
  payroll_date_types_aggregate: PayrollDateTypesAggregate;
  /** fetch data from the table: "payroll_date_types" using primary key columns */
  payroll_date_types_by_pk: Maybe<PayrollDateTypes>;
  /** fetch data from the table in a streaming manner: "payroll_date_types" */
  payroll_date_types_stream: Array<PayrollDateTypes>;
  /** An array relationship */
  payroll_dates: Array<PayrollDates>;
  /** An aggregate relationship */
  payroll_dates_aggregate: PayrollDatesAggregate;
  /** fetch data from the table: "payroll_dates" using primary key columns */
  payroll_dates_by_pk: Maybe<PayrollDates>;
  /** fetch data from the table in a streaming manner: "payroll_dates" */
  payroll_dates_stream: Array<PayrollDates>;
  /** fetch data from the table: "payroll_triggers_status" */
  payroll_triggers_status: Array<PayrollTriggersStatus>;
  /** fetch aggregated fields from the table: "payroll_triggers_status" */
  payroll_triggers_status_aggregate: PayrollTriggersStatusAggregate;
  /** fetch data from the table in a streaming manner: "payroll_triggers_status" */
  payroll_triggers_status_stream: Array<PayrollTriggersStatus>;
  /** fetch data from the table: "payroll_version_history_results" */
  payroll_version_history_results: Array<PayrollVersionHistoryResults>;
  /** fetch aggregated fields from the table: "payroll_version_history_results" */
  payroll_version_history_results_aggregate: PayrollVersionHistoryResultsAggregate;
  /** fetch data from the table: "payroll_version_history_results" using primary key columns */
  payroll_version_history_results_by_pk: Maybe<PayrollVersionHistoryResults>;
  /** fetch data from the table in a streaming manner: "payroll_version_history_results" */
  payroll_version_history_results_stream: Array<PayrollVersionHistoryResults>;
  /** fetch data from the table: "payroll_version_results" */
  payroll_version_results: Array<PayrollVersionResults>;
  /** fetch aggregated fields from the table: "payroll_version_results" */
  payroll_version_results_aggregate: PayrollVersionResultsAggregate;
  /** fetch data from the table: "payroll_version_results" using primary key columns */
  payroll_version_results_by_pk: Maybe<PayrollVersionResults>;
  /** fetch data from the table in a streaming manner: "payroll_version_results" */
  payroll_version_results_stream: Array<PayrollVersionResults>;
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrolls_aggregate: PayrollsAggregate;
  /** fetch data from the table: "payrolls" using primary key columns */
  payrolls_by_pk: Maybe<Payrolls>;
  /** fetch data from the table in a streaming manner: "payrolls" */
  payrolls_stream: Array<Payrolls>;
  /** An array relationship */
  permissions: Array<Permissions>;
  /** An aggregate relationship */
  permissions_aggregate: PermissionsAggregate;
  /** fetch data from the table: "permissions" using primary key columns */
  permissions_by_pk: Maybe<Permissions>;
  /** fetch data from the table in a streaming manner: "permissions" */
  permissions_stream: Array<Permissions>;
  /** fetch data from the table: "resources" */
  resources: Array<Resources>;
  /** fetch aggregated fields from the table: "resources" */
  resources_aggregate: ResourcesAggregate;
  /** fetch data from the table: "resources" using primary key columns */
  resources_by_pk: Maybe<Resources>;
  /** fetch data from the table in a streaming manner: "resources" */
  resources_stream: Array<Resources>;
  /** An array relationship */
  role_permissions: Array<RolePermissions>;
  /** An aggregate relationship */
  role_permissions_aggregate: RolePermissionsAggregate;
  /** fetch data from the table: "role_permissions" using primary key columns */
  role_permissions_by_pk: Maybe<RolePermissions>;
  /** fetch data from the table in a streaming manner: "role_permissions" */
  role_permissions_stream: Array<RolePermissions>;
  /** fetch data from the table: "roles" */
  roles: Array<Roles>;
  /** fetch aggregated fields from the table: "roles" */
  roles_aggregate: RolesAggregate;
  /** fetch data from the table: "roles" using primary key columns */
  roles_by_pk: Maybe<Roles>;
  /** fetch data from the table in a streaming manner: "roles" */
  roles_stream: Array<Roles>;
  /** An array relationship */
  user_roles: Array<UserRoles>;
  /** An aggregate relationship */
  user_roles_aggregate: UserRolesAggregate;
  /** fetch data from the table: "user_roles" using primary key columns */
  user_roles_by_pk: Maybe<UserRoles>;
  /** fetch data from the table in a streaming manner: "user_roles" */
  user_roles_stream: Array<UserRoles>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: UsersAggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk: Maybe<Users>;
  /** fetch data from the table: "users_role_backup" */
  users_role_backup: Array<UsersRoleBackup>;
  /** fetch aggregated fields from the table: "users_role_backup" */
  users_role_backup_aggregate: UsersRoleBackupAggregate;
  /** fetch data from the table in a streaming manner: "users_role_backup" */
  users_role_backup_stream: Array<UsersRoleBackup>;
  /** fetch data from the table in a streaming manner: "users" */
  users_stream: Array<Users>;
  /** fetch data from the table: "work_schedule" */
  work_schedule: Array<WorkSchedule>;
  /** fetch aggregated fields from the table: "work_schedule" */
  work_schedule_aggregate: WorkScheduleAggregate;
  /** fetch data from the table: "work_schedule" using primary key columns */
  work_schedule_by_pk: Maybe<WorkSchedule>;
  /** fetch data from the table in a streaming manner: "work_schedule" */
  work_schedule_stream: Array<WorkSchedule>;
};


export type SubscriptionRootActivatePayrollVersionsArgs = {
  distinct_on?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type SubscriptionRootActivatePayrollVersionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type SubscriptionRootAdjustmentRulesArgs = {
  distinct_on?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


export type SubscriptionRootAdjustmentRulesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


export type SubscriptionRootAdjustmentRulesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootAdjustmentRulesStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AdjustmentRulesStreamCursorInput>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


export type SubscriptionRootAppSettingsArgs = {
  distinct_on?: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AppSettingsOrderBy>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};


export type SubscriptionRootAppSettingsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AppSettingsOrderBy>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};


export type SubscriptionRootAppSettingsByPkArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionRootAppSettingsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AppSettingsStreamCursorInput>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};


export type SubscriptionRootAuditAuditLogArgs = {
  distinct_on?: InputMaybe<Array<AuditAuditLogSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditAuditLogOrderBy>>;
  where?: InputMaybe<AuditAuditLogBoolExp>;
};


export type SubscriptionRootAuditAuditLogAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditAuditLogSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditAuditLogOrderBy>>;
  where?: InputMaybe<AuditAuditLogBoolExp>;
};


export type SubscriptionRootAuditAuditLogByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootAuditAuditLogStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuditAuditLogStreamCursorInput>>;
  where?: InputMaybe<AuditAuditLogBoolExp>;
};


export type SubscriptionRootAuditAuthEventsArgs = {
  distinct_on?: InputMaybe<Array<AuditAuthEventsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditAuthEventsOrderBy>>;
  where?: InputMaybe<AuditAuthEventsBoolExp>;
};


export type SubscriptionRootAuditAuthEventsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditAuthEventsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditAuthEventsOrderBy>>;
  where?: InputMaybe<AuditAuthEventsBoolExp>;
};


export type SubscriptionRootAuditAuthEventsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootAuditAuthEventsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuditAuthEventsStreamCursorInput>>;
  where?: InputMaybe<AuditAuthEventsBoolExp>;
};


export type SubscriptionRootAuditDataAccessLogArgs = {
  distinct_on?: InputMaybe<Array<AuditDataAccessLogSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditDataAccessLogOrderBy>>;
  where?: InputMaybe<AuditDataAccessLogBoolExp>;
};


export type SubscriptionRootAuditDataAccessLogAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditDataAccessLogSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditDataAccessLogOrderBy>>;
  where?: InputMaybe<AuditDataAccessLogBoolExp>;
};


export type SubscriptionRootAuditDataAccessLogByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootAuditDataAccessLogStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuditDataAccessLogStreamCursorInput>>;
  where?: InputMaybe<AuditDataAccessLogBoolExp>;
};


export type SubscriptionRootAuditPermissionChangesArgs = {
  distinct_on?: InputMaybe<Array<AuditPermissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditPermissionChangesOrderBy>>;
  where?: InputMaybe<AuditPermissionChangesBoolExp>;
};


export type SubscriptionRootAuditPermissionChangesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditPermissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditPermissionChangesOrderBy>>;
  where?: InputMaybe<AuditPermissionChangesBoolExp>;
};


export type SubscriptionRootAuditPermissionChangesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootAuditPermissionChangesStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuditPermissionChangesStreamCursorInput>>;
  where?: InputMaybe<AuditPermissionChangesBoolExp>;
};


export type SubscriptionRootAuditPermissionUsageReportArgs = {
  distinct_on?: InputMaybe<Array<AuditPermissionUsageReportSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditPermissionUsageReportOrderBy>>;
  where?: InputMaybe<AuditPermissionUsageReportBoolExp>;
};


export type SubscriptionRootAuditPermissionUsageReportAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditPermissionUsageReportSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditPermissionUsageReportOrderBy>>;
  where?: InputMaybe<AuditPermissionUsageReportBoolExp>;
};


export type SubscriptionRootAuditPermissionUsageReportStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuditPermissionUsageReportStreamCursorInput>>;
  where?: InputMaybe<AuditPermissionUsageReportBoolExp>;
};


export type SubscriptionRootAuditSlowQueriesArgs = {
  distinct_on?: InputMaybe<Array<AuditSlowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditSlowQueriesOrderBy>>;
  where?: InputMaybe<AuditSlowQueriesBoolExp>;
};


export type SubscriptionRootAuditSlowQueriesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditSlowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditSlowQueriesOrderBy>>;
  where?: InputMaybe<AuditSlowQueriesBoolExp>;
};


export type SubscriptionRootAuditSlowQueriesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootAuditSlowQueriesStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuditSlowQueriesStreamCursorInput>>;
  where?: InputMaybe<AuditSlowQueriesBoolExp>;
};


export type SubscriptionRootAuditUserAccessSummaryArgs = {
  distinct_on?: InputMaybe<Array<AuditUserAccessSummarySelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditUserAccessSummaryOrderBy>>;
  where?: InputMaybe<AuditUserAccessSummaryBoolExp>;
};


export type SubscriptionRootAuditUserAccessSummaryAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditUserAccessSummarySelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuditUserAccessSummaryOrderBy>>;
  where?: InputMaybe<AuditUserAccessSummaryBoolExp>;
};


export type SubscriptionRootAuditUserAccessSummaryStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuditUserAccessSummaryStreamCursorInput>>;
  where?: InputMaybe<AuditUserAccessSummaryBoolExp>;
};


export type SubscriptionRootBillingEventLogArgs = {
  distinct_on?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingEventLogOrderBy>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};


export type SubscriptionRootBillingEventLogAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingEventLogOrderBy>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};


export type SubscriptionRootBillingEventLogByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBillingEventLogStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingEventLogStreamCursorInput>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};


export type SubscriptionRootBillingInvoiceArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


export type SubscriptionRootBillingInvoiceAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


export type SubscriptionRootBillingInvoiceByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBillingInvoiceItemArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


export type SubscriptionRootBillingInvoiceItemAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


export type SubscriptionRootBillingInvoiceItemByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBillingInvoiceItemStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingInvoiceItemStreamCursorInput>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


export type SubscriptionRootBillingInvoiceStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingInvoiceStreamCursorInput>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


export type SubscriptionRootBillingInvoicesArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoicesOrderBy>>;
  where?: InputMaybe<BillingInvoicesBoolExp>;
};


export type SubscriptionRootBillingInvoicesAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingInvoicesOrderBy>>;
  where?: InputMaybe<BillingInvoicesBoolExp>;
};


export type SubscriptionRootBillingInvoicesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBillingInvoicesStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingInvoicesStreamCursorInput>>;
  where?: InputMaybe<BillingInvoicesBoolExp>;
};


export type SubscriptionRootBillingItemsArgs = {
  distinct_on?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


export type SubscriptionRootBillingItemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


export type SubscriptionRootBillingItemsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBillingItemsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingItemsStreamCursorInput>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


export type SubscriptionRootBillingPlanArgs = {
  distinct_on?: InputMaybe<Array<BillingPlanSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingPlanOrderBy>>;
  where?: InputMaybe<BillingPlanBoolExp>;
};


export type SubscriptionRootBillingPlanAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingPlanSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingPlanOrderBy>>;
  where?: InputMaybe<BillingPlanBoolExp>;
};


export type SubscriptionRootBillingPlanByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBillingPlanStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingPlanStreamCursorInput>>;
  where?: InputMaybe<BillingPlanBoolExp>;
};


export type SubscriptionRootClientBillingAssignmentArgs = {
  distinct_on?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientBillingAssignmentOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};


export type SubscriptionRootClientBillingAssignmentAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientBillingAssignmentOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};


export type SubscriptionRootClientBillingAssignmentByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootClientBillingAssignmentStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ClientBillingAssignmentStreamCursorInput>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};


export type SubscriptionRootClientExternalSystemsArgs = {
  distinct_on?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type SubscriptionRootClientExternalSystemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type SubscriptionRootClientExternalSystemsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootClientExternalSystemsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ClientExternalSystemsStreamCursorInput>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type SubscriptionRootClientsArgs = {
  distinct_on?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};


export type SubscriptionRootClientsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};


export type SubscriptionRootClientsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootClientsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ClientsStreamCursorInput>>;
  where?: InputMaybe<ClientsBoolExp>;
};


export type SubscriptionRootCreatePayrollVersionArgs = {
  args: CreatePayrollVersionArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootCreatePayrollVersionAggregateArgs = {
  args: CreatePayrollVersionArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootCurrentPayrollsArgs = {
  distinct_on?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};


export type SubscriptionRootCurrentPayrollsAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};


export type SubscriptionRootCurrentPayrollsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<CurrentPayrollsStreamCursorInput>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};


export type SubscriptionRootExternalSystemsArgs = {
  distinct_on?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};


export type SubscriptionRootExternalSystemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};


export type SubscriptionRootExternalSystemsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootExternalSystemsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ExternalSystemsStreamCursorInput>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};


export type SubscriptionRootFeatureFlagsArgs = {
  distinct_on?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};


export type SubscriptionRootFeatureFlagsAggregateArgs = {
  distinct_on?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};


export type SubscriptionRootFeatureFlagsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootFeatureFlagsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<FeatureFlagsStreamCursorInput>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};


export type SubscriptionRootGeneratePayrollDatesArgs = {
  args: GeneratePayrollDatesArgs;
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type SubscriptionRootGeneratePayrollDatesAggregateArgs = {
  args: GeneratePayrollDatesArgs;
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type SubscriptionRootGetLatestPayrollVersionArgs = {
  args: GetLatestPayrollVersionArgs;
  distinct_on?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type SubscriptionRootGetLatestPayrollVersionAggregateArgs = {
  args: GetLatestPayrollVersionArgs;
  distinct_on?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type SubscriptionRootGetPayrollVersionHistoryArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type SubscriptionRootGetPayrollVersionHistoryAggregateArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type SubscriptionRootHolidaysArgs = {
  distinct_on?: InputMaybe<Array<HolidaysSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<HolidaysOrderBy>>;
  where?: InputMaybe<HolidaysBoolExp>;
};


export type SubscriptionRootHolidaysAggregateArgs = {
  distinct_on?: InputMaybe<Array<HolidaysSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<HolidaysOrderBy>>;
  where?: InputMaybe<HolidaysBoolExp>;
};


export type SubscriptionRootHolidaysByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootHolidaysStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<HolidaysStreamCursorInput>>;
  where?: InputMaybe<HolidaysBoolExp>;
};


export type SubscriptionRootLatestPayrollVersionResultsArgs = {
  distinct_on?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type SubscriptionRootLatestPayrollVersionResultsAggregateArgs = {
  distinct_on?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type SubscriptionRootLatestPayrollVersionResultsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootLatestPayrollVersionResultsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<LatestPayrollVersionResultsStreamCursorInput>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type SubscriptionRootLeaveArgs = {
  distinct_on?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};


export type SubscriptionRootLeaveAggregateArgs = {
  distinct_on?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};


export type SubscriptionRootLeaveByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootLeaveStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<LeaveStreamCursorInput>>;
  where?: InputMaybe<LeaveBoolExp>;
};


export type SubscriptionRootNeonAuthUsersSyncArgs = {
  distinct_on?: InputMaybe<Array<NeonAuthUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NeonAuthUsersSyncOrderBy>>;
  where?: InputMaybe<NeonAuthUsersSyncBoolExp>;
};


export type SubscriptionRootNeonAuthUsersSyncAggregateArgs = {
  distinct_on?: InputMaybe<Array<NeonAuthUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NeonAuthUsersSyncOrderBy>>;
  where?: InputMaybe<NeonAuthUsersSyncBoolExp>;
};


export type SubscriptionRootNeonAuthUsersSyncByPkArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionRootNeonAuthUsersSyncStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<NeonAuthUsersSyncStreamCursorInput>>;
  where?: InputMaybe<NeonAuthUsersSyncBoolExp>;
};


export type SubscriptionRootNotesArgs = {
  distinct_on?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};


export type SubscriptionRootNotesAggregateArgs = {
  distinct_on?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};


export type SubscriptionRootNotesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootNotesStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<NotesStreamCursorInput>>;
  where?: InputMaybe<NotesBoolExp>;
};


export type SubscriptionRootPayrollActivationResultsArgs = {
  distinct_on?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type SubscriptionRootPayrollActivationResultsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type SubscriptionRootPayrollActivationResultsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollActivationResultsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollActivationResultsStreamCursorInput>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type SubscriptionRootPayrollAssignmentAuditArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};


export type SubscriptionRootPayrollAssignmentAuditAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};


export type SubscriptionRootPayrollAssignmentAuditByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollAssignmentAuditStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollAssignmentAuditStreamCursorInput>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};


export type SubscriptionRootPayrollAssignmentsArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type SubscriptionRootPayrollAssignmentsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type SubscriptionRootPayrollAssignmentsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollAssignmentsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollAssignmentsStreamCursorInput>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type SubscriptionRootPayrollCyclesArgs = {
  distinct_on?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};


export type SubscriptionRootPayrollCyclesAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};


export type SubscriptionRootPayrollCyclesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollCyclesStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollCyclesStreamCursorInput>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};


export type SubscriptionRootPayrollDashboardStatsArgs = {
  distinct_on?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type SubscriptionRootPayrollDashboardStatsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type SubscriptionRootPayrollDashboardStatsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollDashboardStatsStreamCursorInput>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type SubscriptionRootPayrollDateTypesArgs = {
  distinct_on?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};


export type SubscriptionRootPayrollDateTypesAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};


export type SubscriptionRootPayrollDateTypesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollDateTypesStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollDateTypesStreamCursorInput>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};


export type SubscriptionRootPayrollDatesArgs = {
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type SubscriptionRootPayrollDatesAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type SubscriptionRootPayrollDatesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollDatesStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollDatesStreamCursorInput>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type SubscriptionRootPayrollTriggersStatusArgs = {
  distinct_on?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type SubscriptionRootPayrollTriggersStatusAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type SubscriptionRootPayrollTriggersStatusStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollTriggersStatusStreamCursorInput>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type SubscriptionRootPayrollVersionHistoryResultsArgs = {
  distinct_on?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type SubscriptionRootPayrollVersionHistoryResultsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type SubscriptionRootPayrollVersionHistoryResultsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollVersionHistoryResultsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollVersionHistoryResultsStreamCursorInput>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type SubscriptionRootPayrollVersionResultsArgs = {
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootPayrollVersionResultsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootPayrollVersionResultsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollVersionResultsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollVersionResultsStreamCursorInput>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type SubscriptionRootPayrollsArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


export type SubscriptionRootPayrollsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


export type SubscriptionRootPayrollsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPayrollsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollsStreamCursorInput>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


export type SubscriptionRootPermissionsArgs = {
  distinct_on?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};


export type SubscriptionRootPermissionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};


export type SubscriptionRootPermissionsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootPermissionsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PermissionsStreamCursorInput>>;
  where?: InputMaybe<PermissionsBoolExp>;
};


export type SubscriptionRootResourcesArgs = {
  distinct_on?: InputMaybe<Array<ResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ResourcesOrderBy>>;
  where?: InputMaybe<ResourcesBoolExp>;
};


export type SubscriptionRootResourcesAggregateArgs = {
  distinct_on?: InputMaybe<Array<ResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ResourcesOrderBy>>;
  where?: InputMaybe<ResourcesBoolExp>;
};


export type SubscriptionRootResourcesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootResourcesStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ResourcesStreamCursorInput>>;
  where?: InputMaybe<ResourcesBoolExp>;
};


export type SubscriptionRootRolePermissionsArgs = {
  distinct_on?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


export type SubscriptionRootRolePermissionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


export type SubscriptionRootRolePermissionsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootRolePermissionsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RolePermissionsStreamCursorInput>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


export type SubscriptionRootRolesArgs = {
  distinct_on?: InputMaybe<Array<RolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RolesOrderBy>>;
  where?: InputMaybe<RolesBoolExp>;
};


export type SubscriptionRootRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<RolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RolesOrderBy>>;
  where?: InputMaybe<RolesBoolExp>;
};


export type SubscriptionRootRolesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootRolesStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RolesStreamCursorInput>>;
  where?: InputMaybe<RolesBoolExp>;
};


export type SubscriptionRootUserRolesArgs = {
  distinct_on?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


export type SubscriptionRootUserRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


export type SubscriptionRootUserRolesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootUserRolesStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UserRolesStreamCursorInput>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


export type SubscriptionRootUsersArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type SubscriptionRootUsersAggregateArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type SubscriptionRootUsersByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootUsersRoleBackupArgs = {
  distinct_on?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};


export type SubscriptionRootUsersRoleBackupAggregateArgs = {
  distinct_on?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};


export type SubscriptionRootUsersRoleBackupStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UsersRoleBackupStreamCursorInput>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};


export type SubscriptionRootUsersStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UsersStreamCursorInput>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type SubscriptionRootWorkScheduleArgs = {
  distinct_on?: InputMaybe<Array<WorkScheduleSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<WorkScheduleOrderBy>>;
  where?: InputMaybe<WorkScheduleBoolExp>;
};


export type SubscriptionRootWorkScheduleAggregateArgs = {
  distinct_on?: InputMaybe<Array<WorkScheduleSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<WorkScheduleOrderBy>>;
  where?: InputMaybe<WorkScheduleBoolExp>;
};


export type SubscriptionRootWorkScheduleByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootWorkScheduleStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<WorkScheduleStreamCursorInput>>;
  where?: InputMaybe<WorkScheduleBoolExp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type TimestampComparisonExp = {
  _eq?: InputMaybe<Scalars['timestamp']['input']>;
  _gt?: InputMaybe<Scalars['timestamp']['input']>;
  _gte?: InputMaybe<Scalars['timestamp']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamp']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
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
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
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
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['user_role']['input']>;
  _lte?: InputMaybe<Scalars['user_role']['input']>;
  _neq?: InputMaybe<Scalars['user_role']['input']>;
  _nin?: InputMaybe<Array<Scalars['user_role']['input']>>;
};

/** columns and relationships of "user_roles" */
export type UserRoles = {
  __typename: 'user_roles';
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  /** An object relationship */
  role: Roles;
  role_id: Scalars['uuid']['output'];
  updated_at: Scalars['timestamptz']['output'];
  /** An object relationship */
  user: Users;
  user_id: Scalars['uuid']['output'];
};

/** aggregated selection of "user_roles" */
export type UserRolesAggregate = {
  __typename: 'user_roles_aggregate';
  aggregate: Maybe<UserRolesAggregateFields>;
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
  __typename: 'user_roles_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<UserRolesMaxFields>;
  min: Maybe<UserRolesMinFields>;
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
  on_conflict?: InputMaybe<UserRolesOnConflict>;
};

/** Boolean expression to filter rows from the table "user_roles". All fields are combined with a logical 'AND'. */
export type UserRolesBoolExp = {
  _and?: InputMaybe<Array<UserRolesBoolExp>>;
  _not?: InputMaybe<UserRolesBoolExp>;
  _or?: InputMaybe<Array<UserRolesBoolExp>>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  role?: InputMaybe<RolesBoolExp>;
  role_id?: InputMaybe<UuidComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  user_id?: InputMaybe<UuidComparisonExp>;
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
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<RolesObjRelInsertInput>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type UserRolesMaxFields = {
  __typename: 'user_roles_max_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  role_id: Maybe<Scalars['uuid']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
  user_id: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "user_roles" */
export type UserRolesMaxOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  role_id?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  user_id?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type UserRolesMinFields = {
  __typename: 'user_roles_min_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  role_id: Maybe<Scalars['uuid']['output']>;
  updated_at: Maybe<Scalars['timestamptz']['output']>;
  user_id: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "user_roles" */
export type UserRolesMinOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  role_id?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  user_id?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "user_roles" */
export type UserRolesMutationResponse = {
  __typename: 'user_roles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<UserRoles>;
};

/** on_conflict condition type for table "user_roles" */
export type UserRolesOnConflict = {
  constraint: UserRolesConstraint;
  update_columns?: Array<UserRolesUpdateColumn>;
  where?: InputMaybe<UserRolesBoolExp>;
};

/** Ordering options when selecting data from "user_roles". */
export type UserRolesOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  role?: InputMaybe<RolesOrderBy>;
  role_id?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  user_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: user_roles */
export type UserRolesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "user_roles" */
export enum UserRolesSelectColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  role_id = 'role_id',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  user_id = 'user_id'
}

/** input type for updating data in table "user_roles" */
export type UserRolesSetInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "user_roles" */
export type UserRolesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: UserRolesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type UserRolesStreamCursorValueInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "user_roles" */
export enum UserRolesUpdateColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  role_id = 'role_id',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  user_id = 'user_id'
}

export type UserRolesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UserRolesSetInput>;
  /** filter the rows which have to be updated */
  where: UserRolesBoolExp;
};

/** columns and relationships of "users" */
export type Users = {
  __typename: 'users';
  /** An array relationship */
  billing_event_logs: Array<BillingEventLog>;
  /** An aggregate relationship */
  billing_event_logs_aggregate: BillingEventLogAggregate;
  /** External identifier from Clerk authentication service */
  clerk_user_id: Maybe<Scalars['String']['output']>;
  /** Timestamp when the user was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  deactivated_at: Maybe<Scalars['timestamptz']['output']>;
  deactivated_by: Maybe<Scalars['String']['output']>;
  /** User's email address (unique) */
  email: Scalars['String']['output'];
  /** Unique identifier for the user */
  id: Scalars['uuid']['output'];
  /** URL to the user's profile image */
  image: Maybe<Scalars['String']['output']>;
  is_active: Maybe<Scalars['Boolean']['output']>;
  /** Whether the user is a staff member (vs. external user) */
  is_staff: Maybe<Scalars['Boolean']['output']>;
  /** An array relationship */
  leaves: Array<Leave>;
  /** An aggregate relationship */
  leaves_aggregate: LeaveAggregate;
  /** An object relationship */
  manager: Maybe<Users>;
  /** Reference to the user's manager */
  manager_id: Maybe<Scalars['uuid']['output']>;
  /** User's full name */
  name: Scalars['String']['output'];
  /** An array relationship */
  notes_written: Array<Notes>;
  /** An aggregate relationship */
  notes_written_aggregate: NotesAggregate;
  /** An array relationship */
  payrollAssignmentAuditsByFromConsultantId: Array<PayrollAssignmentAudit>;
  /** An aggregate relationship */
  payrollAssignmentAuditsByFromConsultantId_aggregate: PayrollAssignmentAuditAggregate;
  /** An array relationship */
  payrollAssignmentAuditsByToConsultantId: Array<PayrollAssignmentAudit>;
  /** An aggregate relationship */
  payrollAssignmentAuditsByToConsultantId_aggregate: PayrollAssignmentAuditAggregate;
  /** An array relationship */
  payrollAssignmentsByConsultantId: Array<PayrollAssignments>;
  /** An aggregate relationship */
  payrollAssignmentsByConsultantId_aggregate: PayrollAssignmentsAggregate;
  /** An array relationship */
  payrollAssignmentsByOriginalConsultantId: Array<PayrollAssignments>;
  /** An aggregate relationship */
  payrollAssignmentsByOriginalConsultantId_aggregate: PayrollAssignmentsAggregate;
  /** An array relationship */
  payroll_assignment_audits: Array<PayrollAssignmentAudit>;
  /** An aggregate relationship */
  payroll_assignment_audits_aggregate: PayrollAssignmentAuditAggregate;
  /** An array relationship */
  payroll_assignments: Array<PayrollAssignments>;
  /** An aggregate relationship */
  payroll_assignments_aggregate: PayrollAssignmentsAggregate;
  /** An array relationship */
  payrollsByBackupConsultantUserId: Array<Payrolls>;
  /** An aggregate relationship */
  payrollsByBackupConsultantUserId_aggregate: PayrollsAggregate;
  /** An array relationship */
  payrollsByManagerUserId: Array<Payrolls>;
  /** An aggregate relationship */
  payrollsByManagerUserId_aggregate: PayrollsAggregate;
  /** An array relationship */
  payrollsByPrimaryConsultantUserId: Array<Payrolls>;
  /** An aggregate relationship */
  payrollsByPrimaryConsultantUserId_aggregate: PayrollsAggregate;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role: Scalars['user_role']['output'];
  /** An array relationship */
  staffByManager: Array<Users>;
  /** An aggregate relationship */
  staffByManager_aggregate: UsersAggregate;
  /** Timestamp when the user was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
  /** An array relationship */
  user_roles: Array<UserRoles>;
  /** An aggregate relationship */
  user_roles_aggregate: UserRolesAggregate;
  /** User's unique username for login */
  username: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  usersManager: Array<Users>;
  /** An aggregate relationship */
  usersManager_aggregate: UsersAggregate;
  /** An array relationship */
  work_schedules: Array<WorkSchedule>;
  /** An aggregate relationship */
  work_schedules_aggregate: WorkScheduleAggregate;
};


/** columns and relationships of "users" */
export type UsersBillingEventLogsArgs = {
  distinct_on?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingEventLogOrderBy>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};


/** columns and relationships of "users" */
export type UsersBillingEventLogsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BillingEventLogOrderBy>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};


/** columns and relationships of "users" */
export type UsersLeavesArgs = {
  distinct_on?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};


/** columns and relationships of "users" */
export type UsersLeavesAggregateArgs = {
  distinct_on?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};


/** columns and relationships of "users" */
export type UsersNotesWrittenArgs = {
  distinct_on?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersNotesWrittenAggregateArgs = {
  distinct_on?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollAssignmentAuditsByFromConsultantIdArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollAssignmentAuditsByFromConsultantIdAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollAssignmentAuditsByToConsultantIdArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollAssignmentAuditsByToConsultantIdAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollAssignmentsByConsultantIdArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollAssignmentsByConsultantIdAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollAssignmentsByOriginalConsultantIdArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollAssignmentsByOriginalConsultantIdAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollAssignmentAuditsArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollAssignmentAuditsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollAssignmentsArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollAssignmentsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollsByBackupConsultantUserIdArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollsByBackupConsultantUserIdAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollsByManagerUserIdArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollsByManagerUserIdAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollsByPrimaryConsultantUserIdArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersPayrollsByPrimaryConsultantUserIdAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersStaffByManagerArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


/** columns and relationships of "users" */
export type UsersStaffByManagerAggregateArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserRolesArgs = {
  distinct_on?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUsersManagerArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUsersManagerAggregateArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


/** columns and relationships of "users" */
export type UsersWorkSchedulesArgs = {
  distinct_on?: InputMaybe<Array<WorkScheduleSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<WorkScheduleOrderBy>>;
  where?: InputMaybe<WorkScheduleBoolExp>;
};


/** columns and relationships of "users" */
export type UsersWorkSchedulesAggregateArgs = {
  distinct_on?: InputMaybe<Array<WorkScheduleSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<WorkScheduleOrderBy>>;
  where?: InputMaybe<WorkScheduleBoolExp>;
};

/** aggregated selection of "users" */
export type UsersAggregate = {
  __typename: 'users_aggregate';
  aggregate: Maybe<UsersAggregateFields>;
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
  __typename: 'users_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<UsersMaxFields>;
  min: Maybe<UsersMinFields>;
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
  on_conflict?: InputMaybe<UsersOnConflict>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type UsersBoolExp = {
  _and?: InputMaybe<Array<UsersBoolExp>>;
  _not?: InputMaybe<UsersBoolExp>;
  _or?: InputMaybe<Array<UsersBoolExp>>;
  billing_event_logs?: InputMaybe<BillingEventLogBoolExp>;
  billing_event_logs_aggregate?: InputMaybe<BillingEventLogAggregateBoolExp>;
  clerk_user_id?: InputMaybe<StringComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  deactivated_at?: InputMaybe<TimestamptzComparisonExp>;
  deactivated_by?: InputMaybe<StringComparisonExp>;
  email?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  image?: InputMaybe<StringComparisonExp>;
  is_active?: InputMaybe<BooleanComparisonExp>;
  is_staff?: InputMaybe<BooleanComparisonExp>;
  leaves?: InputMaybe<LeaveBoolExp>;
  leaves_aggregate?: InputMaybe<LeaveAggregateBoolExp>;
  manager?: InputMaybe<UsersBoolExp>;
  manager_id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  notes_written?: InputMaybe<NotesBoolExp>;
  notes_written_aggregate?: InputMaybe<NotesAggregateBoolExp>;
  payrollAssignmentAuditsByFromConsultantId?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  payrollAssignmentAuditsByFromConsultantId_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateBoolExp>;
  payrollAssignmentAuditsByToConsultantId?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  payrollAssignmentAuditsByToConsultantId_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateBoolExp>;
  payrollAssignmentsByConsultantId?: InputMaybe<PayrollAssignmentsBoolExp>;
  payrollAssignmentsByConsultantId_aggregate?: InputMaybe<PayrollAssignmentsAggregateBoolExp>;
  payrollAssignmentsByOriginalConsultantId?: InputMaybe<PayrollAssignmentsBoolExp>;
  payrollAssignmentsByOriginalConsultantId_aggregate?: InputMaybe<PayrollAssignmentsAggregateBoolExp>;
  payroll_assignment_audits?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  payroll_assignment_audits_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateBoolExp>;
  payroll_assignments?: InputMaybe<PayrollAssignmentsBoolExp>;
  payroll_assignments_aggregate?: InputMaybe<PayrollAssignmentsAggregateBoolExp>;
  payrollsByBackupConsultantUserId?: InputMaybe<PayrollsBoolExp>;
  payrollsByBackupConsultantUserId_aggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  payrollsByManagerUserId?: InputMaybe<PayrollsBoolExp>;
  payrollsByManagerUserId_aggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  payrollsByPrimaryConsultantUserId?: InputMaybe<PayrollsBoolExp>;
  payrollsByPrimaryConsultantUserId_aggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  role?: InputMaybe<UserRoleComparisonExp>;
  staffByManager?: InputMaybe<UsersBoolExp>;
  staffByManager_aggregate?: InputMaybe<UsersAggregateBoolExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
  user_roles?: InputMaybe<UserRolesBoolExp>;
  user_roles_aggregate?: InputMaybe<UserRolesAggregateBoolExp>;
  username?: InputMaybe<StringComparisonExp>;
  usersManager?: InputMaybe<UsersBoolExp>;
  usersManager_aggregate?: InputMaybe<UsersAggregateBoolExp>;
  work_schedules?: InputMaybe<WorkScheduleBoolExp>;
  work_schedules_aggregate?: InputMaybe<WorkScheduleAggregateBoolExp>;
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
  billing_event_logs?: InputMaybe<BillingEventLogArrRelInsertInput>;
  /** External identifier from Clerk authentication service */
  clerk_user_id?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the user was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deactivated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deactivated_by?: InputMaybe<Scalars['String']['input']>;
  /** User's email address (unique) */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the user */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** URL to the user's profile image */
  image?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether the user is a staff member (vs. external user) */
  is_staff?: InputMaybe<Scalars['Boolean']['input']>;
  leaves?: InputMaybe<LeaveArrRelInsertInput>;
  manager?: InputMaybe<UsersObjRelInsertInput>;
  /** Reference to the user's manager */
  manager_id?: InputMaybe<Scalars['uuid']['input']>;
  /** User's full name */
  name?: InputMaybe<Scalars['String']['input']>;
  notes_written?: InputMaybe<NotesArrRelInsertInput>;
  payrollAssignmentAuditsByFromConsultantId?: InputMaybe<PayrollAssignmentAuditArrRelInsertInput>;
  payrollAssignmentAuditsByToConsultantId?: InputMaybe<PayrollAssignmentAuditArrRelInsertInput>;
  payrollAssignmentsByConsultantId?: InputMaybe<PayrollAssignmentsArrRelInsertInput>;
  payrollAssignmentsByOriginalConsultantId?: InputMaybe<PayrollAssignmentsArrRelInsertInput>;
  payroll_assignment_audits?: InputMaybe<PayrollAssignmentAuditArrRelInsertInput>;
  payroll_assignments?: InputMaybe<PayrollAssignmentsArrRelInsertInput>;
  payrollsByBackupConsultantUserId?: InputMaybe<PayrollsArrRelInsertInput>;
  payrollsByManagerUserId?: InputMaybe<PayrollsArrRelInsertInput>;
  payrollsByPrimaryConsultantUserId?: InputMaybe<PayrollsArrRelInsertInput>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Scalars['user_role']['input']>;
  staffByManager?: InputMaybe<UsersArrRelInsertInput>;
  /** Timestamp when the user was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_roles?: InputMaybe<UserRolesArrRelInsertInput>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars['String']['input']>;
  usersManager?: InputMaybe<UsersArrRelInsertInput>;
  work_schedules?: InputMaybe<WorkScheduleArrRelInsertInput>;
};

/** aggregate max on columns */
export type UsersMaxFields = {
  __typename: 'users_max_fields';
  /** External identifier from Clerk authentication service */
  clerk_user_id: Maybe<Scalars['String']['output']>;
  /** Timestamp when the user was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  deactivated_at: Maybe<Scalars['timestamptz']['output']>;
  deactivated_by: Maybe<Scalars['String']['output']>;
  /** User's email address (unique) */
  email: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the user */
  id: Maybe<Scalars['uuid']['output']>;
  /** URL to the user's profile image */
  image: Maybe<Scalars['String']['output']>;
  /** Reference to the user's manager */
  manager_id: Maybe<Scalars['uuid']['output']>;
  /** User's full name */
  name: Maybe<Scalars['String']['output']>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role: Maybe<Scalars['user_role']['output']>;
  /** Timestamp when the user was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
  /** User's unique username for login */
  username: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "users" */
export type UsersMaxOrderBy = {
  /** External identifier from Clerk authentication service */
  clerk_user_id?: InputMaybe<OrderBy>;
  /** Timestamp when the user was created */
  created_at?: InputMaybe<OrderBy>;
  deactivated_at?: InputMaybe<OrderBy>;
  deactivated_by?: InputMaybe<OrderBy>;
  /** User's email address (unique) */
  email?: InputMaybe<OrderBy>;
  /** Unique identifier for the user */
  id?: InputMaybe<OrderBy>;
  /** URL to the user's profile image */
  image?: InputMaybe<OrderBy>;
  /** Reference to the user's manager */
  manager_id?: InputMaybe<OrderBy>;
  /** User's full name */
  name?: InputMaybe<OrderBy>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<OrderBy>;
  /** Timestamp when the user was last updated */
  updated_at?: InputMaybe<OrderBy>;
  /** User's unique username for login */
  username?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type UsersMinFields = {
  __typename: 'users_min_fields';
  /** External identifier from Clerk authentication service */
  clerk_user_id: Maybe<Scalars['String']['output']>;
  /** Timestamp when the user was created */
  created_at: Maybe<Scalars['timestamptz']['output']>;
  deactivated_at: Maybe<Scalars['timestamptz']['output']>;
  deactivated_by: Maybe<Scalars['String']['output']>;
  /** User's email address (unique) */
  email: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the user */
  id: Maybe<Scalars['uuid']['output']>;
  /** URL to the user's profile image */
  image: Maybe<Scalars['String']['output']>;
  /** Reference to the user's manager */
  manager_id: Maybe<Scalars['uuid']['output']>;
  /** User's full name */
  name: Maybe<Scalars['String']['output']>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role: Maybe<Scalars['user_role']['output']>;
  /** Timestamp when the user was last updated */
  updated_at: Maybe<Scalars['timestamptz']['output']>;
  /** User's unique username for login */
  username: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "users" */
export type UsersMinOrderBy = {
  /** External identifier from Clerk authentication service */
  clerk_user_id?: InputMaybe<OrderBy>;
  /** Timestamp when the user was created */
  created_at?: InputMaybe<OrderBy>;
  deactivated_at?: InputMaybe<OrderBy>;
  deactivated_by?: InputMaybe<OrderBy>;
  /** User's email address (unique) */
  email?: InputMaybe<OrderBy>;
  /** Unique identifier for the user */
  id?: InputMaybe<OrderBy>;
  /** URL to the user's profile image */
  image?: InputMaybe<OrderBy>;
  /** Reference to the user's manager */
  manager_id?: InputMaybe<OrderBy>;
  /** User's full name */
  name?: InputMaybe<OrderBy>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<OrderBy>;
  /** Timestamp when the user was last updated */
  updated_at?: InputMaybe<OrderBy>;
  /** User's unique username for login */
  username?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "users" */
export type UsersMutationResponse = {
  __typename: 'users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type UsersObjRelInsertInput = {
  data: UsersInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<UsersOnConflict>;
};

/** on_conflict condition type for table "users" */
export type UsersOnConflict = {
  constraint: UsersConstraint;
  update_columns?: Array<UsersUpdateColumn>;
  where?: InputMaybe<UsersBoolExp>;
};

/** Ordering options when selecting data from "users". */
export type UsersOrderBy = {
  billing_event_logs_aggregate?: InputMaybe<BillingEventLogAggregateOrderBy>;
  clerk_user_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  deactivated_at?: InputMaybe<OrderBy>;
  deactivated_by?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  image?: InputMaybe<OrderBy>;
  is_active?: InputMaybe<OrderBy>;
  is_staff?: InputMaybe<OrderBy>;
  leaves_aggregate?: InputMaybe<LeaveAggregateOrderBy>;
  manager?: InputMaybe<UsersOrderBy>;
  manager_id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  notes_written_aggregate?: InputMaybe<NotesAggregateOrderBy>;
  payrollAssignmentAuditsByFromConsultantId_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateOrderBy>;
  payrollAssignmentAuditsByToConsultantId_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateOrderBy>;
  payrollAssignmentsByConsultantId_aggregate?: InputMaybe<PayrollAssignmentsAggregateOrderBy>;
  payrollAssignmentsByOriginalConsultantId_aggregate?: InputMaybe<PayrollAssignmentsAggregateOrderBy>;
  payroll_assignment_audits_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateOrderBy>;
  payroll_assignments_aggregate?: InputMaybe<PayrollAssignmentsAggregateOrderBy>;
  payrollsByBackupConsultantUserId_aggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  payrollsByManagerUserId_aggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  payrollsByPrimaryConsultantUserId_aggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  role?: InputMaybe<OrderBy>;
  staffByManager_aggregate?: InputMaybe<UsersAggregateOrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  user_roles_aggregate?: InputMaybe<UserRolesAggregateOrderBy>;
  username?: InputMaybe<OrderBy>;
  usersManager_aggregate?: InputMaybe<UsersAggregateOrderBy>;
  work_schedules_aggregate?: InputMaybe<WorkScheduleAggregateOrderBy>;
};

/** primary key columns input for table: users */
export type UsersPkColumnsInput = {
  /** Unique identifier for the user */
  id: Scalars['uuid']['input'];
};

/** columns and relationships of "users_role_backup" */
export type UsersRoleBackup = {
  __typename: 'users_role_backup';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  email: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  role: Maybe<Scalars['user_role']['output']>;
};

/** aggregated selection of "users_role_backup" */
export type UsersRoleBackupAggregate = {
  __typename: 'users_role_backup_aggregate';
  aggregate: Maybe<UsersRoleBackupAggregateFields>;
  nodes: Array<UsersRoleBackup>;
};

/** aggregate fields of "users_role_backup" */
export type UsersRoleBackupAggregateFields = {
  __typename: 'users_role_backup_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<UsersRoleBackupMaxFields>;
  min: Maybe<UsersRoleBackupMinFields>;
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
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  email?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  role?: InputMaybe<UserRoleComparisonExp>;
};

/** input type for inserting data into table "users_role_backup" */
export type UsersRoleBackupInsertInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
};

/** aggregate max on columns */
export type UsersRoleBackupMaxFields = {
  __typename: 'users_role_backup_max_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  email: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  role: Maybe<Scalars['user_role']['output']>;
};

/** aggregate min on columns */
export type UsersRoleBackupMinFields = {
  __typename: 'users_role_backup_min_fields';
  created_at: Maybe<Scalars['timestamptz']['output']>;
  email: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['uuid']['output']>;
  role: Maybe<Scalars['user_role']['output']>;
};

/** response of any mutation on the table "users_role_backup" */
export type UsersRoleBackupMutationResponse = {
  __typename: 'users_role_backup_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<UsersRoleBackup>;
};

/** Ordering options when selecting data from "users_role_backup". */
export type UsersRoleBackupOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  role?: InputMaybe<OrderBy>;
};

/** select columns of table "users_role_backup" */
export enum UsersRoleBackupSelectColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  email = 'email',
  /** column name */
  id = 'id',
  /** column name */
  role = 'role'
}

/** input type for updating data in table "users_role_backup" */
export type UsersRoleBackupSetInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
};

/** Streaming cursor of the table "users_role_backup" */
export type UsersRoleBackupStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: UsersRoleBackupStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type UsersRoleBackupStreamCursorValueInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
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
  clerk_user_id = 'clerk_user_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  deactivated_at = 'deactivated_at',
  /** column name */
  deactivated_by = 'deactivated_by',
  /** column name */
  email = 'email',
  /** column name */
  id = 'id',
  /** column name */
  image = 'image',
  /** column name */
  is_active = 'is_active',
  /** column name */
  is_staff = 'is_staff',
  /** column name */
  manager_id = 'manager_id',
  /** column name */
  name = 'name',
  /** column name */
  role = 'role',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  username = 'username'
}

/** select "users_aggregate_bool_exp_bool_and_arguments_columns" columns of table "users" */
export enum UsersSelectColumnUsersAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  is_active = 'is_active',
  /** column name */
  is_staff = 'is_staff'
}

/** select "users_aggregate_bool_exp_bool_or_arguments_columns" columns of table "users" */
export enum UsersSelectColumnUsersAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  is_active = 'is_active',
  /** column name */
  is_staff = 'is_staff'
}

/** input type for updating data in table "users" */
export type UsersSetInput = {
  /** External identifier from Clerk authentication service */
  clerk_user_id?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the user was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deactivated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deactivated_by?: InputMaybe<Scalars['String']['input']>;
  /** User's email address (unique) */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the user */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** URL to the user's profile image */
  image?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether the user is a staff member (vs. external user) */
  is_staff?: InputMaybe<Scalars['Boolean']['input']>;
  /** Reference to the user's manager */
  manager_id?: InputMaybe<Scalars['uuid']['input']>;
  /** User's full name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Scalars['user_role']['input']>;
  /** Timestamp when the user was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "users" */
export type UsersStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: UsersStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type UsersStreamCursorValueInput = {
  /** External identifier from Clerk authentication service */
  clerk_user_id?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the user was created */
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deactivated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deactivated_by?: InputMaybe<Scalars['String']['input']>;
  /** User's email address (unique) */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the user */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** URL to the user's profile image */
  image?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether the user is a staff member (vs. external user) */
  is_staff?: InputMaybe<Scalars['Boolean']['input']>;
  /** Reference to the user's manager */
  manager_id?: InputMaybe<Scalars['uuid']['input']>;
  /** User's full name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Scalars['user_role']['input']>;
  /** Timestamp when the user was last updated */
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "users" */
export enum UsersUpdateColumn {
  /** column name */
  clerk_user_id = 'clerk_user_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  deactivated_at = 'deactivated_at',
  /** column name */
  deactivated_by = 'deactivated_by',
  /** column name */
  email = 'email',
  /** column name */
  id = 'id',
  /** column name */
  image = 'image',
  /** column name */
  is_active = 'is_active',
  /** column name */
  is_staff = 'is_staff',
  /** column name */
  manager_id = 'manager_id',
  /** column name */
  name = 'name',
  /** column name */
  role = 'role',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  username = 'username'
}

export type UsersUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UsersSetInput>;
  /** filter the rows which have to be updated */
  where: UsersBoolExp;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type UuidComparisonExp = {
  _eq?: InputMaybe<Scalars['uuid']['input']>;
  _gt?: InputMaybe<Scalars['uuid']['input']>;
  _gte?: InputMaybe<Scalars['uuid']['input']>;
  _in?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['uuid']['input']>;
  _lte?: InputMaybe<Scalars['uuid']['input']>;
  _neq?: InputMaybe<Scalars['uuid']['input']>;
  _nin?: InputMaybe<Array<Scalars['uuid']['input']>>;
};

/** columns and relationships of "work_schedule" */
export type WorkSchedule = {
  __typename: 'work_schedule';
  /** Timestamp when the schedule entry was created */
  created_at: Maybe<Scalars['timestamp']['output']>;
  /** Unique identifier for the work schedule entry */
  id: Scalars['uuid']['output'];
  /** Timestamp when the schedule entry was last updated */
  updated_at: Maybe<Scalars['timestamp']['output']>;
  /** An object relationship */
  user: Users;
  /** Reference to the user this schedule belongs to */
  user_id: Scalars['uuid']['output'];
  /** Day of the week (Monday, Tuesday, etc.) */
  work_day: Scalars['String']['output'];
  /** Number of hours worked on this day */
  work_hours: Scalars['numeric']['output'];
  /** An object relationship */
  work_schedule_user: Users;
};

/** aggregated selection of "work_schedule" */
export type WorkScheduleAggregate = {
  __typename: 'work_schedule_aggregate';
  aggregate: Maybe<WorkScheduleAggregateFields>;
  nodes: Array<WorkSchedule>;
};

export type WorkScheduleAggregateBoolExp = {
  count?: InputMaybe<WorkScheduleAggregateBoolExpCount>;
};

export type WorkScheduleAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<WorkScheduleSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<WorkScheduleBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "work_schedule" */
export type WorkScheduleAggregateFields = {
  __typename: 'work_schedule_aggregate_fields';
  avg: Maybe<WorkScheduleAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<WorkScheduleMaxFields>;
  min: Maybe<WorkScheduleMinFields>;
  stddev: Maybe<WorkScheduleStddevFields>;
  stddev_pop: Maybe<WorkScheduleStddevPopFields>;
  stddev_samp: Maybe<WorkScheduleStddevSampFields>;
  sum: Maybe<WorkScheduleSumFields>;
  var_pop: Maybe<WorkScheduleVarPopFields>;
  var_samp: Maybe<WorkScheduleVarSampFields>;
  variance: Maybe<WorkScheduleVarianceFields>;
};


/** aggregate fields of "work_schedule" */
export type WorkScheduleAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<WorkScheduleSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "work_schedule" */
export type WorkScheduleAggregateOrderBy = {
  avg?: InputMaybe<WorkScheduleAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<WorkScheduleMaxOrderBy>;
  min?: InputMaybe<WorkScheduleMinOrderBy>;
  stddev?: InputMaybe<WorkScheduleStddevOrderBy>;
  stddev_pop?: InputMaybe<WorkScheduleStddevPopOrderBy>;
  stddev_samp?: InputMaybe<WorkScheduleStddevSampOrderBy>;
  sum?: InputMaybe<WorkScheduleSumOrderBy>;
  var_pop?: InputMaybe<WorkScheduleVarPopOrderBy>;
  var_samp?: InputMaybe<WorkScheduleVarSampOrderBy>;
  variance?: InputMaybe<WorkScheduleVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "work_schedule" */
export type WorkScheduleArrRelInsertInput = {
  data: Array<WorkScheduleInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<WorkScheduleOnConflict>;
};

/** aggregate avg on columns */
export type WorkScheduleAvgFields = {
  __typename: 'work_schedule_avg_fields';
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "work_schedule" */
export type WorkScheduleAvgOrderBy = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "work_schedule". All fields are combined with a logical 'AND'. */
export type WorkScheduleBoolExp = {
  _and?: InputMaybe<Array<WorkScheduleBoolExp>>;
  _not?: InputMaybe<WorkScheduleBoolExp>;
  _or?: InputMaybe<Array<WorkScheduleBoolExp>>;
  created_at?: InputMaybe<TimestampComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  updated_at?: InputMaybe<TimestampComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  user_id?: InputMaybe<UuidComparisonExp>;
  work_day?: InputMaybe<StringComparisonExp>;
  work_hours?: InputMaybe<NumericComparisonExp>;
  work_schedule_user?: InputMaybe<UsersBoolExp>;
};

/** unique or primary key constraints on table "work_schedule" */
export enum WorkScheduleConstraint {
  /** unique or primary key constraint on columns "user_id", "work_day" */
  unique_user_work_day = 'unique_user_work_day',
  /** unique or primary key constraint on columns "id" */
  work_schedule_pkey = 'work_schedule_pkey'
}

/** input type for incrementing numeric columns in table "work_schedule" */
export type WorkScheduleIncInput = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "work_schedule" */
export type WorkScheduleInsertInput = {
  /** Timestamp when the schedule entry was created */
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the schedule entry was last updated */
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  /** Reference to the user this schedule belongs to */
  user_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Day of the week (Monday, Tuesday, etc.) */
  work_day?: InputMaybe<Scalars['String']['input']>;
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Scalars['numeric']['input']>;
  work_schedule_user?: InputMaybe<UsersObjRelInsertInput>;
};

/** aggregate max on columns */
export type WorkScheduleMaxFields = {
  __typename: 'work_schedule_max_fields';
  /** Timestamp when the schedule entry was created */
  created_at: Maybe<Scalars['timestamp']['output']>;
  /** Unique identifier for the work schedule entry */
  id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the schedule entry was last updated */
  updated_at: Maybe<Scalars['timestamp']['output']>;
  /** Reference to the user this schedule belongs to */
  user_id: Maybe<Scalars['uuid']['output']>;
  /** Day of the week (Monday, Tuesday, etc.) */
  work_day: Maybe<Scalars['String']['output']>;
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars['numeric']['output']>;
};

/** order by max() on columns of table "work_schedule" */
export type WorkScheduleMaxOrderBy = {
  /** Timestamp when the schedule entry was created */
  created_at?: InputMaybe<OrderBy>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<OrderBy>;
  /** Timestamp when the schedule entry was last updated */
  updated_at?: InputMaybe<OrderBy>;
  /** Reference to the user this schedule belongs to */
  user_id?: InputMaybe<OrderBy>;
  /** Day of the week (Monday, Tuesday, etc.) */
  work_day?: InputMaybe<OrderBy>;
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type WorkScheduleMinFields = {
  __typename: 'work_schedule_min_fields';
  /** Timestamp when the schedule entry was created */
  created_at: Maybe<Scalars['timestamp']['output']>;
  /** Unique identifier for the work schedule entry */
  id: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the schedule entry was last updated */
  updated_at: Maybe<Scalars['timestamp']['output']>;
  /** Reference to the user this schedule belongs to */
  user_id: Maybe<Scalars['uuid']['output']>;
  /** Day of the week (Monday, Tuesday, etc.) */
  work_day: Maybe<Scalars['String']['output']>;
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars['numeric']['output']>;
};

/** order by min() on columns of table "work_schedule" */
export type WorkScheduleMinOrderBy = {
  /** Timestamp when the schedule entry was created */
  created_at?: InputMaybe<OrderBy>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<OrderBy>;
  /** Timestamp when the schedule entry was last updated */
  updated_at?: InputMaybe<OrderBy>;
  /** Reference to the user this schedule belongs to */
  user_id?: InputMaybe<OrderBy>;
  /** Day of the week (Monday, Tuesday, etc.) */
  work_day?: InputMaybe<OrderBy>;
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "work_schedule" */
export type WorkScheduleMutationResponse = {
  __typename: 'work_schedule_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<WorkSchedule>;
};

/** on_conflict condition type for table "work_schedule" */
export type WorkScheduleOnConflict = {
  constraint: WorkScheduleConstraint;
  update_columns?: Array<WorkScheduleUpdateColumn>;
  where?: InputMaybe<WorkScheduleBoolExp>;
};

/** Ordering options when selecting data from "work_schedule". */
export type WorkScheduleOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  user_id?: InputMaybe<OrderBy>;
  work_day?: InputMaybe<OrderBy>;
  work_hours?: InputMaybe<OrderBy>;
  work_schedule_user?: InputMaybe<UsersOrderBy>;
};

/** primary key columns input for table: work_schedule */
export type WorkSchedulePkColumnsInput = {
  /** Unique identifier for the work schedule entry */
  id: Scalars['uuid']['input'];
};

/** select columns of table "work_schedule" */
export enum WorkScheduleSelectColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  user_id = 'user_id',
  /** column name */
  work_day = 'work_day',
  /** column name */
  work_hours = 'work_hours'
}

/** input type for updating data in table "work_schedule" */
export type WorkScheduleSetInput = {
  /** Timestamp when the schedule entry was created */
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the schedule entry was last updated */
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  /** Reference to the user this schedule belongs to */
  user_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Day of the week (Monday, Tuesday, etc.) */
  work_day?: InputMaybe<Scalars['String']['input']>;
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate stddev on columns */
export type WorkScheduleStddevFields = {
  __typename: 'work_schedule_stddev_fields';
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "work_schedule" */
export type WorkScheduleStddevOrderBy = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type WorkScheduleStddevPopFields = {
  __typename: 'work_schedule_stddev_pop_fields';
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "work_schedule" */
export type WorkScheduleStddevPopOrderBy = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type WorkScheduleStddevSampFields = {
  __typename: 'work_schedule_stddev_samp_fields';
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "work_schedule" */
export type WorkScheduleStddevSampOrderBy = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "work_schedule" */
export type WorkScheduleStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: WorkScheduleStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type WorkScheduleStreamCursorValueInput = {
  /** Timestamp when the schedule entry was created */
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the schedule entry was last updated */
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  /** Reference to the user this schedule belongs to */
  user_id?: InputMaybe<Scalars['uuid']['input']>;
  /** Day of the week (Monday, Tuesday, etc.) */
  work_day?: InputMaybe<Scalars['String']['input']>;
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate sum on columns */
export type WorkScheduleSumFields = {
  __typename: 'work_schedule_sum_fields';
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "work_schedule" */
export type WorkScheduleSumOrderBy = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<OrderBy>;
};

/** update columns of table "work_schedule" */
export enum WorkScheduleUpdateColumn {
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  user_id = 'user_id',
  /** column name */
  work_day = 'work_day',
  /** column name */
  work_hours = 'work_hours'
}

export type WorkScheduleUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<WorkScheduleIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<WorkScheduleSetInput>;
  /** filter the rows which have to be updated */
  where: WorkScheduleBoolExp;
};

/** aggregate var_pop on columns */
export type WorkScheduleVarPopFields = {
  __typename: 'work_schedule_var_pop_fields';
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "work_schedule" */
export type WorkScheduleVarPopOrderBy = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type WorkScheduleVarSampFields = {
  __typename: 'work_schedule_var_samp_fields';
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "work_schedule" */
export type WorkScheduleVarSampOrderBy = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type WorkScheduleVarianceFields = {
  __typename: 'work_schedule_variance_fields';
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "work_schedule" */
export type WorkScheduleVarianceOrderBy = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<OrderBy>;
};

export type NoteBasicInfoFragment = { __typename: 'notes', id: string, content: string, is_important: boolean | null, entity_type: string, entity_id: string, created_at: string | null, updated_at: string | null } & { ' $fragmentName'?: 'NoteBasicInfoFragment' };

export type NoteWithUserFragment = (
  { __typename: 'notes', user: { __typename: 'users', id: string, name: string, email: string } | null }
  & { ' $fragmentRefs'?: { 'NoteBasicInfoFragment': NoteBasicInfoFragment } }
) & { ' $fragmentName'?: 'NoteWithUserFragment' };

export type NoteForAuditFragment = { __typename: 'notes', id: string, entity_type: string, entity_id: string, user_id: string | null, is_important: boolean | null, created_at: string | null, updated_at: string | null } & { ' $fragmentName'?: 'NoteForAuditFragment' };

export type AddNoteMutationVariables = Exact<{
  entityId: Scalars['uuid']['input'];
  entityType: Scalars['String']['input'];
  content: Scalars['String']['input'];
  userId: Scalars['uuid']['input'];
  isImportant?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AddNoteMutation = { __typename: 'mutation_root', insert_notes_one: (
    { __typename: 'notes' }
    & { ' $fragmentRefs'?: { 'NoteWithUserFragment': NoteWithUserFragment } }
  ) | null };

export type UpdateNoteMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  content: Scalars['String']['input'];
  isImportant?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateNoteMutation = { __typename: 'mutation_root', update_notes_by_pk: (
    { __typename: 'notes' }
    & { ' $fragmentRefs'?: { 'NoteWithUserFragment': NoteWithUserFragment } }
  ) | null };

export type UpdateNoteContentMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  content: Scalars['String']['input'];
}>;


export type UpdateNoteContentMutation = { __typename: 'mutation_root', update_notes_by_pk: (
    { __typename: 'notes' }
    & { ' $fragmentRefs'?: { 'NoteBasicInfoFragment': NoteBasicInfoFragment } }
  ) | null };

export type DeleteNoteMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type DeleteNoteMutation = { __typename: 'mutation_root', delete_notes_by_pk: { __typename: 'notes', id: string, entity_type: string, entity_id: string, user_id: string | null, created_at: string | null } | null };

export type MarkNoteImportantMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  isImportant: Scalars['Boolean']['input'];
}>;


export type MarkNoteImportantMutation = { __typename: 'mutation_root', update_notes_by_pk: (
    { __typename: 'notes' }
    & { ' $fragmentRefs'?: { 'NoteBasicInfoFragment': NoteBasicInfoFragment } }
  ) | null };

export type BulkDeleteNotesMutationVariables = Exact<{
  entityId: Scalars['uuid']['input'];
  entityType: Scalars['String']['input'];
}>;


export type BulkDeleteNotesMutation = { __typename: 'mutation_root', delete_notes: { __typename: 'notes_mutation_response', affected_rows: number, returning: Array<{ __typename: 'notes', id: string, user_id: string | null, entity_type: string, entity_id: string }> } | null };

export type UpdateNoteWithSetInputMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  input: NotesSetInput;
}>;


export type UpdateNoteWithSetInputMutation = { __typename: 'mutation_root', update_notes_by_pk: { __typename: 'notes', id: string, content: string, updated_at: string | null } | null };

export type AddNoteExtractedMutationVariables = Exact<{
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
  content: Scalars['String']['input'];
}>;


export type AddNoteExtractedMutation = { __typename: 'mutation_root', insert_notes_one: { __typename: 'notes', id: string, entity_id: string, entity_type: string, content: string, is_important: boolean | null, created_at: string | null, updated_at: string | null } | null };

export type UpdateNoteExtractedMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  content: Scalars['String']['input'];
}>;


export type UpdateNoteExtractedMutation = { __typename: 'mutation_root', update_notes_by_pk: { __typename: 'notes', id: string, content: string, updated_at: string | null } | null };

export type GetNotesQueryVariables = Exact<{
  entityId: Scalars['uuid']['input'];
  entityType: Scalars['String']['input'];
}>;


export type GetNotesQuery = { __typename: 'query_root', notes: Array<(
    { __typename: 'notes' }
    & { ' $fragmentRefs'?: { 'NoteWithUserFragment': NoteWithUserFragment } }
  )> };

export type GetNotesBasicQueryVariables = Exact<{
  entityId: Scalars['uuid']['input'];
  entityType: Scalars['String']['input'];
}>;


export type GetNotesBasicQuery = { __typename: 'query_root', notes: Array<(
    { __typename: 'notes' }
    & { ' $fragmentRefs'?: { 'NoteBasicInfoFragment': NoteBasicInfoFragment } }
  )> };

export type GetImportantNotesQueryVariables = Exact<{
  entityId: Scalars['uuid']['input'];
  entityType: Scalars['String']['input'];
}>;


export type GetImportantNotesQuery = { __typename: 'query_root', notes: Array<(
    { __typename: 'notes' }
    & { ' $fragmentRefs'?: { 'NoteWithUserFragment': NoteWithUserFragment } }
  )> };

export type GetNoteByIdQueryVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type GetNoteByIdQuery = { __typename: 'query_root', notes_by_pk: (
    { __typename: 'notes' }
    & { ' $fragmentRefs'?: { 'NoteWithUserFragment': NoteWithUserFragment } }
  ) | null };

export type GetNotesForAuditQueryVariables = Exact<{
  entityId: Scalars['uuid']['input'];
  entityType: Scalars['String']['input'];
}>;


export type GetNotesForAuditQuery = { __typename: 'query_root', notes: Array<(
    { __typename: 'notes' }
    & { ' $fragmentRefs'?: { 'NoteForAuditFragment': NoteForAuditFragment } }
  )> };

export type GetNotesSimpleQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNotesSimpleQuery = { __typename: 'query_root', notes: Array<{ __typename: 'notes', id: string, content: string, created_at: string | null, updated_at: string | null }> };

export type GetNotesExtractedQueryVariables = Exact<{
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
}>;


export type GetNotesExtractedQuery = { __typename: 'query_root', notes: Array<{ __typename: 'notes', id: string, content: string, is_important: boolean | null, created_at: string | null, updated_at: string | null }> };

export type NotesUpdatesSubscriptionVariables = Exact<{
  entityId: Scalars['uuid']['input'];
  entityType: Scalars['String']['input'];
}>;


export type NotesUpdatesSubscription = { __typename: 'subscription_root', notes: Array<(
    { __typename: 'notes' }
    & { ' $fragmentRefs'?: { 'NoteWithUserFragment': NoteWithUserFragment } }
  )> };

export type ImportantNotesUpdatesSubscriptionVariables = Exact<{
  entityId: Scalars['uuid']['input'];
  entityType: Scalars['String']['input'];
}>;


export type ImportantNotesUpdatesSubscription = { __typename: 'subscription_root', notes: Array<(
    { __typename: 'notes' }
    & { ' $fragmentRefs'?: { 'NoteWithUserFragment': NoteWithUserFragment } }
  )> };

export type NoteUpdatesSubscriptionVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type NoteUpdatesSubscription = { __typename: 'subscription_root', notes_by_pk: (
    { __typename: 'notes' }
    & { ' $fragmentRefs'?: { 'NoteWithUserFragment': NoteWithUserFragment } }
  ) | null };

export const NoteBasicInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"is_important"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<NoteBasicInfoFragment, unknown>;
export const NoteWithUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteWithUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasicInfo"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"is_important"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<NoteWithUserFragment, unknown>;
export const NoteForAuditFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteForAudit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"is_important"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<NoteForAuditFragment, unknown>;
export const AddNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_notes_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entity_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"entity_type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_important"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteWithUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"is_important"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteWithUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasicInfo"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<AddNoteMutation, AddNoteMutationVariables>;
export const UpdateNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_notes_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_important"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"updated_at"},"value":{"kind":"StringValue","value":"now()","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteWithUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"is_important"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteWithUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasicInfo"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<UpdateNoteMutation, UpdateNoteMutationVariables>;
export const UpdateNoteContentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNoteContent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_notes_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"updated_at"},"value":{"kind":"StringValue","value":"now()","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasicInfo"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"is_important"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<UpdateNoteContentMutation, UpdateNoteContentMutationVariables>;
export const DeleteNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_notes_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<DeleteNoteMutation, DeleteNoteMutationVariables>;
export const MarkNoteImportantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkNoteImportant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_notes_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_important"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"updated_at"},"value":{"kind":"StringValue","value":"now()","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasicInfo"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"is_important"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<MarkNoteImportantMutation, MarkNoteImportantMutationVariables>;
export const BulkDeleteNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkDeleteNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entity_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}},{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}}]}}]}}]}}]} as unknown as DocumentNode<BulkDeleteNotesMutation, BulkDeleteNotesMutationVariables>;
export const UpdateNoteWithSetInputDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNoteWithSetInput"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"notes_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_notes_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<UpdateNoteWithSetInputMutation, UpdateNoteWithSetInputMutationVariables>;
export const AddNoteExtractedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddNoteExtracted"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_notes_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entity_type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"entity_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_important"},"value":{"kind":"BooleanValue","value":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"is_important"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<AddNoteExtractedMutation, AddNoteExtractedMutationVariables>;
export const UpdateNoteExtractedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNoteExtracted"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_notes_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"updated_at"},"value":{"kind":"StringValue","value":"now()","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<UpdateNoteExtractedMutation, UpdateNoteExtractedMutationVariables>;
export const GetNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entity_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"desc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteWithUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"is_important"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteWithUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasicInfo"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<GetNotesQuery, GetNotesQueryVariables>;
export const GetNotesBasicDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotesBasic"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entity_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"desc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasicInfo"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"is_important"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<GetNotesBasicQuery, GetNotesBasicQueryVariables>;
export const GetImportantNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetImportantNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entity_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_important"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"desc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteWithUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"is_important"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteWithUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasicInfo"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<GetImportantNotesQuery, GetImportantNotesQueryVariables>;
export const GetNoteByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNoteById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteWithUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"is_important"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteWithUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasicInfo"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<GetNoteByIdQuery, GetNoteByIdQueryVariables>;
export const GetNotesForAuditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotesForAudit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entity_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"desc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteForAudit"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteForAudit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"is_important"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]} as unknown as DocumentNode<GetNotesForAuditQuery, GetNotesForAuditQueryVariables>;
export const GetNotesSimpleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotesSimple"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<GetNotesSimpleQuery, GetNotesSimpleQueryVariables>;
export const GetNotesExtractedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotesExtracted"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entity_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"desc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"is_important"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<GetNotesExtractedQuery, GetNotesExtractedQueryVariables>;
export const NotesUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NotesUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entity_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"desc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteWithUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"is_important"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteWithUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasicInfo"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<NotesUpdatesSubscription, NotesUpdatesSubscriptionVariables>;
export const ImportantNotesUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ImportantNotesUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entity_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_important"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"desc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteWithUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"is_important"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteWithUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasicInfo"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<ImportantNotesUpdatesSubscription, ImportantNotesUpdatesSubscriptionVariables>;
export const NoteUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NoteUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteWithUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"is_important"}},{"kind":"Field","name":{"kind":"Name","value":"entity_type"}},{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteWithUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasicInfo"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<NoteUpdatesSubscription, NoteUpdatesSubscriptionVariables>;