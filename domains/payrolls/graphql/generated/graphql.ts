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
 * Generated: 2025-06-22T05:39:22.811Z
 * Schema Version: Latest from Hasura
 * CodeGen Version: Unified v2.0
 */

/*
 * DOMAIN: PAYROLLS
 * SECURITY LEVEL: MEDIUM
 * ACCESS CONTROLS: Authentication + Basic Audit
 * AUTO-EXPORTED: This file is automatically exported from domain index
 */

import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** Scalar _Any */
  _Any: { input: any; output: any };
  bigint: { input: number; output: number };
  bpchar: { input: string; output: string };
  date: { input: string; output: string };
  inet: { input: string; output: string };
  interval: { input: string; output: string };
  json: { input: any; output: any };
  jsonb: { input: any; output: any };
  leave_status_enum: { input: string; output: string };
  name: { input: string; output: string };
  numeric: { input: number; output: number };
  payroll_cycle_type: { input: string; output: string };
  payroll_date_type: { input: string; output: string };
  payroll_status: { input: string; output: string };
  permission_action: { input: string; output: string };
  timestamp: { input: string; output: string };
  timestamptz: { input: string; output: string };
  user_role: { input: string; output: string };
  uuid: { input: string; output: string };
};

export type AffectedAssignment = {
  __typename: "AffectedAssignment";
  adjusted_eft_date: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  new_consultant_id: Scalars["String"]["output"];
  original_consultant_id: Scalars["String"]["output"];
  payroll_date_id: Scalars["String"]["output"];
};

export type AuditEventInput = {
  action: Scalars["String"]["input"];
  ipAddress?: InputMaybe<Scalars["String"]["input"]>;
  metadata?: InputMaybe<Scalars["json"]["input"]>;
  resourceId?: InputMaybe<Scalars["String"]["input"]>;
  resourceType: Scalars["String"]["input"];
  userAgent?: InputMaybe<Scalars["String"]["input"]>;
  userId: Scalars["String"]["input"];
};

export type AuditEventResponse = {
  __typename: "AuditEventResponse";
  eventId: Maybe<Scalars["String"]["output"]>;
  message: Maybe<Scalars["String"]["output"]>;
  success: Scalars["Boolean"]["output"];
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type BooleanComparisonExp = {
  _eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  _gt?: InputMaybe<Scalars["Boolean"]["input"]>;
  _gte?: InputMaybe<Scalars["Boolean"]["input"]>;
  _in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lte?: InputMaybe<Scalars["Boolean"]["input"]>;
  _neq?: InputMaybe<Scalars["Boolean"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
};

export type CommitPayrollAssignmentsOutput = {
  __typename: "CommitPayrollAssignmentsOutput";
  affected_assignments: Maybe<Array<AffectedAssignment>>;
  errors: Maybe<Array<Scalars["String"]["output"]>>;
  message: Maybe<Scalars["String"]["output"]>;
  success: Scalars["Boolean"]["output"];
};

export type ComplianceReportInput = {
  endDate: Scalars["String"]["input"];
  includeDetails?: InputMaybe<Scalars["Boolean"]["input"]>;
  reportType: Scalars["String"]["input"];
  startDate: Scalars["String"]["input"];
};

export type ComplianceReportResponse = {
  __typename: "ComplianceReportResponse";
  generatedAt: Scalars["String"]["output"];
  reportUrl: Maybe<Scalars["String"]["output"]>;
  success: Scalars["Boolean"]["output"];
  summary: Maybe<Scalars["json"]["output"]>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type IntComparisonExp = {
  _eq?: InputMaybe<Scalars["Int"]["input"]>;
  _gt?: InputMaybe<Scalars["Int"]["input"]>;
  _gte?: InputMaybe<Scalars["Int"]["input"]>;
  _in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["Int"]["input"]>;
  _lte?: InputMaybe<Scalars["Int"]["input"]>;
  _neq?: InputMaybe<Scalars["Int"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

export type PayrollAssignmentInput = {
  date: Scalars["String"]["input"];
  fromConsultantId: Scalars["String"]["input"];
  payrollId: Scalars["String"]["input"];
  toConsultantId: Scalars["String"]["input"];
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type StringArrayComparisonExp = {
  /** is the array contained in the given array value */
  _contained_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** does the array contain the given value */
  _contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  _eq?: InputMaybe<Array<Scalars["String"]["input"]>>;
  _gt?: InputMaybe<Array<Scalars["String"]["input"]>>;
  _gte?: InputMaybe<Array<Scalars["String"]["input"]>>;
  _in?: InputMaybe<Array<Array<Scalars["String"]["input"]>>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Array<Scalars["String"]["input"]>>;
  _lte?: InputMaybe<Array<Scalars["String"]["input"]>>;
  _neq?: InputMaybe<Array<Scalars["String"]["input"]>>;
  _nin?: InputMaybe<Array<Array<Scalars["String"]["input"]>>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type StringComparisonExp = {
  _eq?: InputMaybe<Scalars["String"]["input"]>;
  _gt?: InputMaybe<Scalars["String"]["input"]>;
  _gte?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars["String"]["input"]>;
  _in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars["String"]["input"]>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars["String"]["input"]>;
  _lt?: InputMaybe<Scalars["String"]["input"]>;
  _lte?: InputMaybe<Scalars["String"]["input"]>;
  _neq?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars["String"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars["String"]["input"]>;
};

export type SuspiciousActivityResponse = {
  __typename: "SuspiciousActivityResponse";
  events: Maybe<Array<SuspiciousEvent>>;
  message: Maybe<Scalars["String"]["output"]>;
  success: Scalars["Boolean"]["output"];
  suspicious: Scalars["Boolean"]["output"];
};

export type SuspiciousEvent = {
  __typename: "SuspiciousEvent";
  count: Scalars["Int"]["output"];
  eventType: Scalars["String"]["output"];
  severity: Scalars["String"]["output"];
  timeframe: Scalars["String"]["output"];
};

/** A union of all types that use the @key directive */
export type Entity =
  | AdjustmentRules
  | ClientExternalSystems
  | Clients
  | ExternalSystems
  | Holidays
  | Leave
  | Notes
  | PayrollCycles
  | PayrollDateTypes
  | PayrollDates
  | Payrolls
  | Users
  | WorkSchedule;

export type Service = {
  __typename: "_Service";
  /** SDL representation of schema */
  sdl: Scalars["String"]["output"];
};

/** columns and relationships of "adjustment_rules" */
export type AdjustmentRules = {
  __typename: "adjustment_rules";
  /** Timestamp when the rule was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Reference to the payroll cycle this rule applies to */
  cycle_id: Scalars["uuid"]["output"];
  /** Reference to the payroll date type this rule affects */
  date_type_id: Scalars["uuid"]["output"];
  /** Unique identifier for the adjustment rule */
  id: Scalars["uuid"]["output"];
  /** An object relationship */
  payroll_cycle: PayrollCycles;
  /** An object relationship */
  payroll_date_type: PayrollDateTypes;
  /** Code/formula used to calculate date adjustments */
  rule_code: Scalars["String"]["output"];
  /** Human-readable description of the adjustment rule */
  rule_description: Scalars["String"]["output"];
  /** Timestamp when the rule was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregated selection of "adjustment_rules" */
export type AdjustmentRulesAggregate = {
  __typename: "adjustment_rules_aggregate";
  aggregate: Maybe<AdjustmentRulesAggregateFields>;
  nodes: Array<AdjustmentRules>;
};

export type AdjustmentRulesAggregateBoolExp = {
  count?: InputMaybe<AdjustmentRulesAggregateBoolExpCount>;
};

export type AdjustmentRulesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<AdjustmentRulesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "adjustment_rules" */
export type AdjustmentRulesAggregateFields = {
  __typename: "adjustment_rules_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<AdjustmentRulesMaxFields>;
  min: Maybe<AdjustmentRulesMinFields>;
};

/** aggregate fields of "adjustment_rules" */
export type AdjustmentRulesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  adjustment_rules_cycle_id_date_type_id_key = "adjustment_rules_cycle_id_date_type_id_key",
  /** unique or primary key constraint on columns "id" */
  adjustment_rules_pkey = "adjustment_rules_pkey",
}

/** input type for inserting data into table "adjustment_rules" */
export type AdjustmentRulesInsertInput = {
  /** Timestamp when the rule was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Reference to the payroll cycle this rule applies to */
  cycle_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the payroll date type this rule affects */
  date_type_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Unique identifier for the adjustment rule */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll_cycle?: InputMaybe<PayrollCyclesObjRelInsertInput>;
  payroll_date_type?: InputMaybe<PayrollDateTypesObjRelInsertInput>;
  /** Code/formula used to calculate date adjustments */
  rule_code?: InputMaybe<Scalars["String"]["input"]>;
  /** Human-readable description of the adjustment rule */
  rule_description?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the rule was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type AdjustmentRulesMaxFields = {
  __typename: "adjustment_rules_max_fields";
  /** Timestamp when the rule was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Reference to the payroll cycle this rule applies to */
  cycle_id: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the payroll date type this rule affects */
  date_type_id: Maybe<Scalars["uuid"]["output"]>;
  /** Unique identifier for the adjustment rule */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Code/formula used to calculate date adjustments */
  rule_code: Maybe<Scalars["String"]["output"]>;
  /** Human-readable description of the adjustment rule */
  rule_description: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the rule was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "adjustment_rules_min_fields";
  /** Timestamp when the rule was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Reference to the payroll cycle this rule applies to */
  cycle_id: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the payroll date type this rule affects */
  date_type_id: Maybe<Scalars["uuid"]["output"]>;
  /** Unique identifier for the adjustment rule */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Code/formula used to calculate date adjustments */
  rule_code: Maybe<Scalars["String"]["output"]>;
  /** Human-readable description of the adjustment rule */
  rule_description: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the rule was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "adjustment_rules_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "adjustment_rules" */
export enum AdjustmentRulesSelectColumn {
  /** column name */
  created_at = "created_at",
  /** column name */
  cycle_id = "cycle_id",
  /** column name */
  date_type_id = "date_type_id",
  /** column name */
  id = "id",
  /** column name */
  rule_code = "rule_code",
  /** column name */
  rule_description = "rule_description",
  /** column name */
  updated_at = "updated_at",
}

/** input type for updating data in table "adjustment_rules" */
export type AdjustmentRulesSetInput = {
  /** Timestamp when the rule was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Reference to the payroll cycle this rule applies to */
  cycle_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the payroll date type this rule affects */
  date_type_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Unique identifier for the adjustment rule */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Code/formula used to calculate date adjustments */
  rule_code?: InputMaybe<Scalars["String"]["input"]>;
  /** Human-readable description of the adjustment rule */
  rule_description?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the rule was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
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
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Reference to the payroll cycle this rule applies to */
  cycle_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the payroll date type this rule affects */
  date_type_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Unique identifier for the adjustment rule */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Code/formula used to calculate date adjustments */
  rule_code?: InputMaybe<Scalars["String"]["input"]>;
  /** Human-readable description of the adjustment rule */
  rule_description?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the rule was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "adjustment_rules" */
export enum AdjustmentRulesUpdateColumn {
  /** column name */
  created_at = "created_at",
  /** column name */
  cycle_id = "cycle_id",
  /** column name */
  date_type_id = "date_type_id",
  /** column name */
  id = "id",
  /** column name */
  rule_code = "rule_code",
  /** column name */
  rule_description = "rule_description",
  /** column name */
  updated_at = "updated_at",
}

export type AdjustmentRulesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AdjustmentRulesSetInput>;
  /** filter the rows which have to be updated */
  where: AdjustmentRulesBoolExp;
};

/** columns and relationships of "app_settings" */
export type AppSettings = {
  __typename: "app_settings";
  /** Unique identifier for application setting */
  id: Scalars["String"]["output"];
  /** JSON structure containing application permission configurations */
  permissions: Maybe<Scalars["jsonb"]["output"]>;
};

/** columns and relationships of "app_settings" */
export type AppSettingsPermissionsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "app_settings" */
export type AppSettingsAggregate = {
  __typename: "app_settings_aggregate";
  aggregate: Maybe<AppSettingsAggregateFields>;
  nodes: Array<AppSettings>;
};

/** aggregate fields of "app_settings" */
export type AppSettingsAggregateFields = {
  __typename: "app_settings_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<AppSettingsMaxFields>;
  min: Maybe<AppSettingsMinFields>;
};

/** aggregate fields of "app_settings" */
export type AppSettingsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AppSettingsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AppSettingsAppendInput = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars["jsonb"]["input"]>;
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
  app_settings_pkey = "app_settings_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AppSettingsDeleteAtPathInput = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AppSettingsDeleteElemInput = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AppSettingsDeleteKeyInput = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "app_settings" */
export type AppSettingsInsertInput = {
  /** Unique identifier for application setting */
  id?: InputMaybe<Scalars["String"]["input"]>;
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate max on columns */
export type AppSettingsMaxFields = {
  __typename: "app_settings_max_fields";
  /** Unique identifier for application setting */
  id: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type AppSettingsMinFields = {
  __typename: "app_settings_min_fields";
  /** Unique identifier for application setting */
  id: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "app_settings" */
export type AppSettingsMutationResponse = {
  __typename: "app_settings_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["String"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AppSettingsPrependInput = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "app_settings" */
export enum AppSettingsSelectColumn {
  /** column name */
  id = "id",
  /** column name */
  permissions = "permissions",
}

/** input type for updating data in table "app_settings" */
export type AppSettingsSetInput = {
  /** Unique identifier for application setting */
  id?: InputMaybe<Scalars["String"]["input"]>;
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars["jsonb"]["input"]>;
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
  id?: InputMaybe<Scalars["String"]["input"]>;
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** update columns of table "app_settings" */
export enum AppSettingsUpdateColumn {
  /** column name */
  id = "id",
  /** column name */
  permissions = "permissions",
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
  __typename: "audit_audit_log";
  action: Scalars["String"]["output"];
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  error_message: Maybe<Scalars["String"]["output"]>;
  eventTime: Scalars["timestamptz"]["output"];
  id: Scalars["uuid"]["output"];
  ipAddress: Maybe<Scalars["inet"]["output"]>;
  metadata: Maybe<Scalars["jsonb"]["output"]>;
  newValues: Maybe<Scalars["jsonb"]["output"]>;
  oldValues: Maybe<Scalars["jsonb"]["output"]>;
  request_id: Maybe<Scalars["String"]["output"]>;
  resourceId: Maybe<Scalars["String"]["output"]>;
  resourceType: Scalars["String"]["output"];
  sessionId: Maybe<Scalars["String"]["output"]>;
  success: Maybe<Scalars["Boolean"]["output"]>;
  userAgent: Maybe<Scalars["String"]["output"]>;
  userId: Maybe<Scalars["uuid"]["output"]>;
  user_email: Maybe<Scalars["String"]["output"]>;
  user_role: Maybe<Scalars["String"]["output"]>;
};

/** columns and relationships of "audit.audit_log" */
export type AuditAuditLogMetadataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "audit.audit_log" */
export type AuditAuditLogNewValuesArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "audit.audit_log" */
export type AuditAuditLogOldValuesArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "audit.audit_log" */
export type AuditAuditLogAggregate = {
  __typename: "audit_audit_log_aggregate";
  aggregate: Maybe<AuditAuditLogAggregateFields>;
  nodes: Array<AuditAuditLog>;
};

/** aggregate fields of "audit.audit_log" */
export type AuditAuditLogAggregateFields = {
  __typename: "audit_audit_log_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<AuditAuditLogMaxFields>;
  min: Maybe<AuditAuditLogMinFields>;
};

/** aggregate fields of "audit.audit_log" */
export type AuditAuditLogAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AuditAuditLogSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuditAuditLogAppendInput = {
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  newValues?: InputMaybe<Scalars["jsonb"]["input"]>;
  oldValues?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** Boolean expression to filter rows from the table "audit.audit_log". All fields are combined with a logical 'AND'. */
export type AuditAuditLogBoolExp = {
  _and?: InputMaybe<Array<AuditAuditLogBoolExp>>;
  _not?: InputMaybe<AuditAuditLogBoolExp>;
  _or?: InputMaybe<Array<AuditAuditLogBoolExp>>;
  action?: InputMaybe<StringComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  error_message?: InputMaybe<StringComparisonExp>;
  eventTime?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  ipAddress?: InputMaybe<InetComparisonExp>;
  metadata?: InputMaybe<JsonbComparisonExp>;
  newValues?: InputMaybe<JsonbComparisonExp>;
  oldValues?: InputMaybe<JsonbComparisonExp>;
  request_id?: InputMaybe<StringComparisonExp>;
  resourceId?: InputMaybe<StringComparisonExp>;
  resourceType?: InputMaybe<StringComparisonExp>;
  sessionId?: InputMaybe<StringComparisonExp>;
  success?: InputMaybe<BooleanComparisonExp>;
  userAgent?: InputMaybe<StringComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
  user_email?: InputMaybe<StringComparisonExp>;
  user_role?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "audit.audit_log" */
export enum AuditAuditLogConstraint {
  /** unique or primary key constraint on columns "id" */
  audit_log_pkey = "audit_log_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AuditAuditLogDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars["String"]["input"]>>;
  newValues?: InputMaybe<Array<Scalars["String"]["input"]>>;
  oldValues?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AuditAuditLogDeleteElemInput = {
  metadata?: InputMaybe<Scalars["Int"]["input"]>;
  newValues?: InputMaybe<Scalars["Int"]["input"]>;
  oldValues?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AuditAuditLogDeleteKeyInput = {
  metadata?: InputMaybe<Scalars["String"]["input"]>;
  newValues?: InputMaybe<Scalars["String"]["input"]>;
  oldValues?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "audit.audit_log" */
export type AuditAuditLogInsertInput = {
  action?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  error_message?: InputMaybe<Scalars["String"]["input"]>;
  eventTime?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  ipAddress?: InputMaybe<Scalars["inet"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  newValues?: InputMaybe<Scalars["jsonb"]["input"]>;
  oldValues?: InputMaybe<Scalars["jsonb"]["input"]>;
  request_id?: InputMaybe<Scalars["String"]["input"]>;
  resourceId?: InputMaybe<Scalars["String"]["input"]>;
  resourceType?: InputMaybe<Scalars["String"]["input"]>;
  sessionId?: InputMaybe<Scalars["String"]["input"]>;
  success?: InputMaybe<Scalars["Boolean"]["input"]>;
  userAgent?: InputMaybe<Scalars["String"]["input"]>;
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
  user_email?: InputMaybe<Scalars["String"]["input"]>;
  user_role?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type AuditAuditLogMaxFields = {
  __typename: "audit_audit_log_max_fields";
  action: Maybe<Scalars["String"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  error_message: Maybe<Scalars["String"]["output"]>;
  eventTime: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  request_id: Maybe<Scalars["String"]["output"]>;
  resourceId: Maybe<Scalars["String"]["output"]>;
  resourceType: Maybe<Scalars["String"]["output"]>;
  sessionId: Maybe<Scalars["String"]["output"]>;
  userAgent: Maybe<Scalars["String"]["output"]>;
  userId: Maybe<Scalars["uuid"]["output"]>;
  user_email: Maybe<Scalars["String"]["output"]>;
  user_role: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type AuditAuditLogMinFields = {
  __typename: "audit_audit_log_min_fields";
  action: Maybe<Scalars["String"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  error_message: Maybe<Scalars["String"]["output"]>;
  eventTime: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  request_id: Maybe<Scalars["String"]["output"]>;
  resourceId: Maybe<Scalars["String"]["output"]>;
  resourceType: Maybe<Scalars["String"]["output"]>;
  sessionId: Maybe<Scalars["String"]["output"]>;
  userAgent: Maybe<Scalars["String"]["output"]>;
  userId: Maybe<Scalars["uuid"]["output"]>;
  user_email: Maybe<Scalars["String"]["output"]>;
  user_role: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "audit.audit_log" */
export type AuditAuditLogMutationResponse = {
  __typename: "audit_audit_log_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  eventTime?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  ipAddress?: InputMaybe<OrderBy>;
  metadata?: InputMaybe<OrderBy>;
  newValues?: InputMaybe<OrderBy>;
  oldValues?: InputMaybe<OrderBy>;
  request_id?: InputMaybe<OrderBy>;
  resourceId?: InputMaybe<OrderBy>;
  resourceType?: InputMaybe<OrderBy>;
  sessionId?: InputMaybe<OrderBy>;
  success?: InputMaybe<OrderBy>;
  userAgent?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  user_email?: InputMaybe<OrderBy>;
  user_role?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: audit.audit_log */
export type AuditAuditLogPkColumnsInput = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuditAuditLogPrependInput = {
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  newValues?: InputMaybe<Scalars["jsonb"]["input"]>;
  oldValues?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "audit.audit_log" */
export enum AuditAuditLogSelectColumn {
  /** column name */
  action = "action",
  /** column name */
  created_at = "created_at",
  /** column name */
  error_message = "error_message",
  /** column name */
  eventTime = "eventTime",
  /** column name */
  id = "id",
  /** column name */
  ipAddress = "ipAddress",
  /** column name */
  metadata = "metadata",
  /** column name */
  newValues = "newValues",
  /** column name */
  oldValues = "oldValues",
  /** column name */
  request_id = "request_id",
  /** column name */
  resourceId = "resourceId",
  /** column name */
  resourceType = "resourceType",
  /** column name */
  sessionId = "sessionId",
  /** column name */
  success = "success",
  /** column name */
  userAgent = "userAgent",
  /** column name */
  userId = "userId",
  /** column name */
  user_email = "user_email",
  /** column name */
  user_role = "user_role",
}

/** input type for updating data in table "audit.audit_log" */
export type AuditAuditLogSetInput = {
  action?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  error_message?: InputMaybe<Scalars["String"]["input"]>;
  eventTime?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  ipAddress?: InputMaybe<Scalars["inet"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  newValues?: InputMaybe<Scalars["jsonb"]["input"]>;
  oldValues?: InputMaybe<Scalars["jsonb"]["input"]>;
  request_id?: InputMaybe<Scalars["String"]["input"]>;
  resourceId?: InputMaybe<Scalars["String"]["input"]>;
  resourceType?: InputMaybe<Scalars["String"]["input"]>;
  sessionId?: InputMaybe<Scalars["String"]["input"]>;
  success?: InputMaybe<Scalars["Boolean"]["input"]>;
  userAgent?: InputMaybe<Scalars["String"]["input"]>;
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
  user_email?: InputMaybe<Scalars["String"]["input"]>;
  user_role?: InputMaybe<Scalars["String"]["input"]>;
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
  action?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  error_message?: InputMaybe<Scalars["String"]["input"]>;
  eventTime?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  ipAddress?: InputMaybe<Scalars["inet"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  newValues?: InputMaybe<Scalars["jsonb"]["input"]>;
  oldValues?: InputMaybe<Scalars["jsonb"]["input"]>;
  request_id?: InputMaybe<Scalars["String"]["input"]>;
  resourceId?: InputMaybe<Scalars["String"]["input"]>;
  resourceType?: InputMaybe<Scalars["String"]["input"]>;
  sessionId?: InputMaybe<Scalars["String"]["input"]>;
  success?: InputMaybe<Scalars["Boolean"]["input"]>;
  userAgent?: InputMaybe<Scalars["String"]["input"]>;
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
  user_email?: InputMaybe<Scalars["String"]["input"]>;
  user_role?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "audit.audit_log" */
export enum AuditAuditLogUpdateColumn {
  /** column name */
  action = "action",
  /** column name */
  created_at = "created_at",
  /** column name */
  error_message = "error_message",
  /** column name */
  eventTime = "eventTime",
  /** column name */
  id = "id",
  /** column name */
  ipAddress = "ipAddress",
  /** column name */
  metadata = "metadata",
  /** column name */
  newValues = "newValues",
  /** column name */
  oldValues = "oldValues",
  /** column name */
  request_id = "request_id",
  /** column name */
  resourceId = "resourceId",
  /** column name */
  resourceType = "resourceType",
  /** column name */
  sessionId = "sessionId",
  /** column name */
  success = "success",
  /** column name */
  userAgent = "userAgent",
  /** column name */
  userId = "userId",
  /** column name */
  user_email = "user_email",
  /** column name */
  user_role = "user_role",
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
  __typename: "audit_auth_events";
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  eventTime: Scalars["timestamptz"]["output"];
  eventType: Scalars["String"]["output"];
  failureReason: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  ipAddress: Maybe<Scalars["inet"]["output"]>;
  metadata: Maybe<Scalars["jsonb"]["output"]>;
  success: Maybe<Scalars["Boolean"]["output"]>;
  userAgent: Maybe<Scalars["String"]["output"]>;
  userEmail: Maybe<Scalars["String"]["output"]>;
  userId: Maybe<Scalars["uuid"]["output"]>;
};

/** columns and relationships of "audit.auth_events" */
export type AuditAuthEventsMetadataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "audit.auth_events" */
export type AuditAuthEventsAggregate = {
  __typename: "audit_auth_events_aggregate";
  aggregate: Maybe<AuditAuthEventsAggregateFields>;
  nodes: Array<AuditAuthEvents>;
};

/** aggregate fields of "audit.auth_events" */
export type AuditAuthEventsAggregateFields = {
  __typename: "audit_auth_events_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<AuditAuthEventsMaxFields>;
  min: Maybe<AuditAuthEventsMinFields>;
};

/** aggregate fields of "audit.auth_events" */
export type AuditAuthEventsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AuditAuthEventsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuditAuthEventsAppendInput = {
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** Boolean expression to filter rows from the table "audit.auth_events". All fields are combined with a logical 'AND'. */
export type AuditAuthEventsBoolExp = {
  _and?: InputMaybe<Array<AuditAuthEventsBoolExp>>;
  _not?: InputMaybe<AuditAuthEventsBoolExp>;
  _or?: InputMaybe<Array<AuditAuthEventsBoolExp>>;
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
export enum AuditAuthEventsConstraint {
  /** unique or primary key constraint on columns "id" */
  auth_events_pkey = "auth_events_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AuditAuthEventsDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AuditAuthEventsDeleteElemInput = {
  metadata?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AuditAuthEventsDeleteKeyInput = {
  metadata?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "audit.auth_events" */
export type AuditAuthEventsInsertInput = {
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  eventTime?: InputMaybe<Scalars["timestamptz"]["input"]>;
  eventType?: InputMaybe<Scalars["String"]["input"]>;
  failureReason?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  ipAddress?: InputMaybe<Scalars["inet"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  success?: InputMaybe<Scalars["Boolean"]["input"]>;
  userAgent?: InputMaybe<Scalars["String"]["input"]>;
  userEmail?: InputMaybe<Scalars["String"]["input"]>;
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type AuditAuthEventsMaxFields = {
  __typename: "audit_auth_events_max_fields";
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  eventTime: Maybe<Scalars["timestamptz"]["output"]>;
  eventType: Maybe<Scalars["String"]["output"]>;
  failureReason: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  userAgent: Maybe<Scalars["String"]["output"]>;
  userEmail: Maybe<Scalars["String"]["output"]>;
  userId: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type AuditAuthEventsMinFields = {
  __typename: "audit_auth_events_min_fields";
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  eventTime: Maybe<Scalars["timestamptz"]["output"]>;
  eventType: Maybe<Scalars["String"]["output"]>;
  failureReason: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  userAgent: Maybe<Scalars["String"]["output"]>;
  userEmail: Maybe<Scalars["String"]["output"]>;
  userId: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "audit.auth_events" */
export type AuditAuthEventsMutationResponse = {
  __typename: "audit_auth_events_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
export type AuditAuthEventsPkColumnsInput = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuditAuthEventsPrependInput = {
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "audit.auth_events" */
export enum AuditAuthEventsSelectColumn {
  /** column name */
  createdAt = "createdAt",
  /** column name */
  eventTime = "eventTime",
  /** column name */
  eventType = "eventType",
  /** column name */
  failureReason = "failureReason",
  /** column name */
  id = "id",
  /** column name */
  ipAddress = "ipAddress",
  /** column name */
  metadata = "metadata",
  /** column name */
  success = "success",
  /** column name */
  userAgent = "userAgent",
  /** column name */
  userEmail = "userEmail",
  /** column name */
  userId = "userId",
}

/** input type for updating data in table "audit.auth_events" */
export type AuditAuthEventsSetInput = {
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  eventTime?: InputMaybe<Scalars["timestamptz"]["input"]>;
  eventType?: InputMaybe<Scalars["String"]["input"]>;
  failureReason?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  ipAddress?: InputMaybe<Scalars["inet"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  success?: InputMaybe<Scalars["Boolean"]["input"]>;
  userAgent?: InputMaybe<Scalars["String"]["input"]>;
  userEmail?: InputMaybe<Scalars["String"]["input"]>;
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
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
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  eventTime?: InputMaybe<Scalars["timestamptz"]["input"]>;
  eventType?: InputMaybe<Scalars["String"]["input"]>;
  failureReason?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  ipAddress?: InputMaybe<Scalars["inet"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  success?: InputMaybe<Scalars["Boolean"]["input"]>;
  userAgent?: InputMaybe<Scalars["String"]["input"]>;
  userEmail?: InputMaybe<Scalars["String"]["input"]>;
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "audit.auth_events" */
export enum AuditAuthEventsUpdateColumn {
  /** column name */
  createdAt = "createdAt",
  /** column name */
  eventTime = "eventTime",
  /** column name */
  eventType = "eventType",
  /** column name */
  failureReason = "failureReason",
  /** column name */
  id = "id",
  /** column name */
  ipAddress = "ipAddress",
  /** column name */
  metadata = "metadata",
  /** column name */
  success = "success",
  /** column name */
  userAgent = "userAgent",
  /** column name */
  userEmail = "userEmail",
  /** column name */
  userId = "userId",
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
  __typename: "audit_data_access_log";
  accessType: Scalars["String"]["output"];
  accessedAt: Scalars["timestamptz"]["output"];
  dataClassification: Maybe<Scalars["String"]["output"]>;
  fieldsAccessed: Maybe<Array<Scalars["String"]["output"]>>;
  id: Scalars["uuid"]["output"];
  ipAddress: Maybe<Scalars["inet"]["output"]>;
  metadata: Maybe<Scalars["jsonb"]["output"]>;
  queryExecuted: Maybe<Scalars["String"]["output"]>;
  resourceId: Maybe<Scalars["String"]["output"]>;
  resourceType: Scalars["String"]["output"];
  rowCount: Maybe<Scalars["Int"]["output"]>;
  sessionId: Maybe<Scalars["String"]["output"]>;
  userId: Scalars["uuid"]["output"];
};

/** columns and relationships of "audit.data_access_log" */
export type AuditDataAccessLogMetadataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "audit.data_access_log" */
export type AuditDataAccessLogAggregate = {
  __typename: "audit_data_access_log_aggregate";
  aggregate: Maybe<AuditDataAccessLogAggregateFields>;
  nodes: Array<AuditDataAccessLog>;
};

/** aggregate fields of "audit.data_access_log" */
export type AuditDataAccessLogAggregateFields = {
  __typename: "audit_data_access_log_aggregate_fields";
  avg: Maybe<AuditDataAccessLogAvgFields>;
  count: Scalars["Int"]["output"];
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuditDataAccessLogAppendInput = {
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate avg on columns */
export type AuditDataAccessLogAvgFields = {
  __typename: "audit_data_access_log_avg_fields";
  rowCount: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "audit.data_access_log". All fields are combined with a logical 'AND'. */
export type AuditDataAccessLogBoolExp = {
  _and?: InputMaybe<Array<AuditDataAccessLogBoolExp>>;
  _not?: InputMaybe<AuditDataAccessLogBoolExp>;
  _or?: InputMaybe<Array<AuditDataAccessLogBoolExp>>;
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
export enum AuditDataAccessLogConstraint {
  /** unique or primary key constraint on columns "id" */
  data_access_log_pkey = "data_access_log_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AuditDataAccessLogDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AuditDataAccessLogDeleteElemInput = {
  metadata?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AuditDataAccessLogDeleteKeyInput = {
  metadata?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "audit.data_access_log" */
export type AuditDataAccessLogIncInput = {
  rowCount?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "audit.data_access_log" */
export type AuditDataAccessLogInsertInput = {
  accessType?: InputMaybe<Scalars["String"]["input"]>;
  accessedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  dataClassification?: InputMaybe<Scalars["String"]["input"]>;
  fieldsAccessed?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  ipAddress?: InputMaybe<Scalars["inet"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  queryExecuted?: InputMaybe<Scalars["String"]["input"]>;
  resourceId?: InputMaybe<Scalars["String"]["input"]>;
  resourceType?: InputMaybe<Scalars["String"]["input"]>;
  rowCount?: InputMaybe<Scalars["Int"]["input"]>;
  sessionId?: InputMaybe<Scalars["String"]["input"]>;
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type AuditDataAccessLogMaxFields = {
  __typename: "audit_data_access_log_max_fields";
  accessType: Maybe<Scalars["String"]["output"]>;
  accessedAt: Maybe<Scalars["timestamptz"]["output"]>;
  dataClassification: Maybe<Scalars["String"]["output"]>;
  fieldsAccessed: Maybe<Array<Scalars["String"]["output"]>>;
  id: Maybe<Scalars["uuid"]["output"]>;
  queryExecuted: Maybe<Scalars["String"]["output"]>;
  resourceId: Maybe<Scalars["String"]["output"]>;
  resourceType: Maybe<Scalars["String"]["output"]>;
  rowCount: Maybe<Scalars["Int"]["output"]>;
  sessionId: Maybe<Scalars["String"]["output"]>;
  userId: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type AuditDataAccessLogMinFields = {
  __typename: "audit_data_access_log_min_fields";
  accessType: Maybe<Scalars["String"]["output"]>;
  accessedAt: Maybe<Scalars["timestamptz"]["output"]>;
  dataClassification: Maybe<Scalars["String"]["output"]>;
  fieldsAccessed: Maybe<Array<Scalars["String"]["output"]>>;
  id: Maybe<Scalars["uuid"]["output"]>;
  queryExecuted: Maybe<Scalars["String"]["output"]>;
  resourceId: Maybe<Scalars["String"]["output"]>;
  resourceType: Maybe<Scalars["String"]["output"]>;
  rowCount: Maybe<Scalars["Int"]["output"]>;
  sessionId: Maybe<Scalars["String"]["output"]>;
  userId: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "audit.data_access_log" */
export type AuditDataAccessLogMutationResponse = {
  __typename: "audit_data_access_log_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
export type AuditDataAccessLogPkColumnsInput = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuditDataAccessLogPrependInput = {
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "audit.data_access_log" */
export enum AuditDataAccessLogSelectColumn {
  /** column name */
  accessType = "accessType",
  /** column name */
  accessedAt = "accessedAt",
  /** column name */
  dataClassification = "dataClassification",
  /** column name */
  fieldsAccessed = "fieldsAccessed",
  /** column name */
  id = "id",
  /** column name */
  ipAddress = "ipAddress",
  /** column name */
  metadata = "metadata",
  /** column name */
  queryExecuted = "queryExecuted",
  /** column name */
  resourceId = "resourceId",
  /** column name */
  resourceType = "resourceType",
  /** column name */
  rowCount = "rowCount",
  /** column name */
  sessionId = "sessionId",
  /** column name */
  userId = "userId",
}

/** input type for updating data in table "audit.data_access_log" */
export type AuditDataAccessLogSetInput = {
  accessType?: InputMaybe<Scalars["String"]["input"]>;
  accessedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  dataClassification?: InputMaybe<Scalars["String"]["input"]>;
  fieldsAccessed?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  ipAddress?: InputMaybe<Scalars["inet"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  queryExecuted?: InputMaybe<Scalars["String"]["input"]>;
  resourceId?: InputMaybe<Scalars["String"]["input"]>;
  resourceType?: InputMaybe<Scalars["String"]["input"]>;
  rowCount?: InputMaybe<Scalars["Int"]["input"]>;
  sessionId?: InputMaybe<Scalars["String"]["input"]>;
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type AuditDataAccessLogStddevFields = {
  __typename: "audit_data_access_log_stddev_fields";
  rowCount: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type AuditDataAccessLogStddevPopFields = {
  __typename: "audit_data_access_log_stddev_pop_fields";
  rowCount: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type AuditDataAccessLogStddevSampFields = {
  __typename: "audit_data_access_log_stddev_samp_fields";
  rowCount: Maybe<Scalars["Float"]["output"]>;
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
  accessType?: InputMaybe<Scalars["String"]["input"]>;
  accessedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  dataClassification?: InputMaybe<Scalars["String"]["input"]>;
  fieldsAccessed?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  ipAddress?: InputMaybe<Scalars["inet"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  queryExecuted?: InputMaybe<Scalars["String"]["input"]>;
  resourceId?: InputMaybe<Scalars["String"]["input"]>;
  resourceType?: InputMaybe<Scalars["String"]["input"]>;
  rowCount?: InputMaybe<Scalars["Int"]["input"]>;
  sessionId?: InputMaybe<Scalars["String"]["input"]>;
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type AuditDataAccessLogSumFields = {
  __typename: "audit_data_access_log_sum_fields";
  rowCount: Maybe<Scalars["Int"]["output"]>;
};

/** update columns of table "audit.data_access_log" */
export enum AuditDataAccessLogUpdateColumn {
  /** column name */
  accessType = "accessType",
  /** column name */
  accessedAt = "accessedAt",
  /** column name */
  dataClassification = "dataClassification",
  /** column name */
  fieldsAccessed = "fieldsAccessed",
  /** column name */
  id = "id",
  /** column name */
  ipAddress = "ipAddress",
  /** column name */
  metadata = "metadata",
  /** column name */
  queryExecuted = "queryExecuted",
  /** column name */
  resourceId = "resourceId",
  /** column name */
  resourceType = "resourceType",
  /** column name */
  rowCount = "rowCount",
  /** column name */
  sessionId = "sessionId",
  /** column name */
  userId = "userId",
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
  __typename: "audit_data_access_log_var_pop_fields";
  rowCount: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type AuditDataAccessLogVarSampFields = {
  __typename: "audit_data_access_log_var_samp_fields";
  rowCount: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type AuditDataAccessLogVarianceFields = {
  __typename: "audit_data_access_log_variance_fields";
  rowCount: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "audit.permission_changes" */
export type AuditPermissionChanges = {
  __typename: "audit_permission_changes";
  approvedByUserId: Maybe<Scalars["uuid"]["output"]>;
  changeType: Scalars["String"]["output"];
  changedAt: Scalars["timestamptz"]["output"];
  changedByUserId: Scalars["uuid"]["output"];
  id: Scalars["uuid"]["output"];
  metadata: Maybe<Scalars["jsonb"]["output"]>;
  newPermissions: Maybe<Scalars["jsonb"]["output"]>;
  oldPermissions: Maybe<Scalars["jsonb"]["output"]>;
  permissionType: Maybe<Scalars["String"]["output"]>;
  reason: Maybe<Scalars["String"]["output"]>;
  targetRoleId: Maybe<Scalars["uuid"]["output"]>;
  targetUserId: Maybe<Scalars["uuid"]["output"]>;
};

/** columns and relationships of "audit.permission_changes" */
export type AuditPermissionChangesMetadataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "audit.permission_changes" */
export type AuditPermissionChangesNewPermissionsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "audit.permission_changes" */
export type AuditPermissionChangesOldPermissionsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "audit.permission_changes" */
export type AuditPermissionChangesAggregate = {
  __typename: "audit_permission_changes_aggregate";
  aggregate: Maybe<AuditPermissionChangesAggregateFields>;
  nodes: Array<AuditPermissionChanges>;
};

/** aggregate fields of "audit.permission_changes" */
export type AuditPermissionChangesAggregateFields = {
  __typename: "audit_permission_changes_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<AuditPermissionChangesMaxFields>;
  min: Maybe<AuditPermissionChangesMinFields>;
};

/** aggregate fields of "audit.permission_changes" */
export type AuditPermissionChangesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AuditPermissionChangesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuditPermissionChangesAppendInput = {
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  newPermissions?: InputMaybe<Scalars["jsonb"]["input"]>;
  oldPermissions?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** Boolean expression to filter rows from the table "audit.permission_changes". All fields are combined with a logical 'AND'. */
export type AuditPermissionChangesBoolExp = {
  _and?: InputMaybe<Array<AuditPermissionChangesBoolExp>>;
  _not?: InputMaybe<AuditPermissionChangesBoolExp>;
  _or?: InputMaybe<Array<AuditPermissionChangesBoolExp>>;
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
export enum AuditPermissionChangesConstraint {
  /** unique or primary key constraint on columns "id" */
  permission_changes_pkey = "permission_changes_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AuditPermissionChangesDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars["String"]["input"]>>;
  newPermissions?: InputMaybe<Array<Scalars["String"]["input"]>>;
  oldPermissions?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AuditPermissionChangesDeleteElemInput = {
  metadata?: InputMaybe<Scalars["Int"]["input"]>;
  newPermissions?: InputMaybe<Scalars["Int"]["input"]>;
  oldPermissions?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AuditPermissionChangesDeleteKeyInput = {
  metadata?: InputMaybe<Scalars["String"]["input"]>;
  newPermissions?: InputMaybe<Scalars["String"]["input"]>;
  oldPermissions?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "audit.permission_changes" */
export type AuditPermissionChangesInsertInput = {
  approvedByUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  changeType?: InputMaybe<Scalars["String"]["input"]>;
  changedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  changedByUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  newPermissions?: InputMaybe<Scalars["jsonb"]["input"]>;
  oldPermissions?: InputMaybe<Scalars["jsonb"]["input"]>;
  permissionType?: InputMaybe<Scalars["String"]["input"]>;
  reason?: InputMaybe<Scalars["String"]["input"]>;
  targetRoleId?: InputMaybe<Scalars["uuid"]["input"]>;
  targetUserId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type AuditPermissionChangesMaxFields = {
  __typename: "audit_permission_changes_max_fields";
  approvedByUserId: Maybe<Scalars["uuid"]["output"]>;
  changeType: Maybe<Scalars["String"]["output"]>;
  changedAt: Maybe<Scalars["timestamptz"]["output"]>;
  changedByUserId: Maybe<Scalars["uuid"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  permissionType: Maybe<Scalars["String"]["output"]>;
  reason: Maybe<Scalars["String"]["output"]>;
  targetRoleId: Maybe<Scalars["uuid"]["output"]>;
  targetUserId: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type AuditPermissionChangesMinFields = {
  __typename: "audit_permission_changes_min_fields";
  approvedByUserId: Maybe<Scalars["uuid"]["output"]>;
  changeType: Maybe<Scalars["String"]["output"]>;
  changedAt: Maybe<Scalars["timestamptz"]["output"]>;
  changedByUserId: Maybe<Scalars["uuid"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  permissionType: Maybe<Scalars["String"]["output"]>;
  reason: Maybe<Scalars["String"]["output"]>;
  targetRoleId: Maybe<Scalars["uuid"]["output"]>;
  targetUserId: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "audit.permission_changes" */
export type AuditPermissionChangesMutationResponse = {
  __typename: "audit_permission_changes_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
export type AuditPermissionChangesPkColumnsInput = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuditPermissionChangesPrependInput = {
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  newPermissions?: InputMaybe<Scalars["jsonb"]["input"]>;
  oldPermissions?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "audit.permission_changes" */
export enum AuditPermissionChangesSelectColumn {
  /** column name */
  approvedByUserId = "approvedByUserId",
  /** column name */
  changeType = "changeType",
  /** column name */
  changedAt = "changedAt",
  /** column name */
  changedByUserId = "changedByUserId",
  /** column name */
  id = "id",
  /** column name */
  metadata = "metadata",
  /** column name */
  newPermissions = "newPermissions",
  /** column name */
  oldPermissions = "oldPermissions",
  /** column name */
  permissionType = "permissionType",
  /** column name */
  reason = "reason",
  /** column name */
  targetRoleId = "targetRoleId",
  /** column name */
  targetUserId = "targetUserId",
}

/** input type for updating data in table "audit.permission_changes" */
export type AuditPermissionChangesSetInput = {
  approvedByUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  changeType?: InputMaybe<Scalars["String"]["input"]>;
  changedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  changedByUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  newPermissions?: InputMaybe<Scalars["jsonb"]["input"]>;
  oldPermissions?: InputMaybe<Scalars["jsonb"]["input"]>;
  permissionType?: InputMaybe<Scalars["String"]["input"]>;
  reason?: InputMaybe<Scalars["String"]["input"]>;
  targetRoleId?: InputMaybe<Scalars["uuid"]["input"]>;
  targetUserId?: InputMaybe<Scalars["uuid"]["input"]>;
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
  approvedByUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  changeType?: InputMaybe<Scalars["String"]["input"]>;
  changedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  changedByUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  newPermissions?: InputMaybe<Scalars["jsonb"]["input"]>;
  oldPermissions?: InputMaybe<Scalars["jsonb"]["input"]>;
  permissionType?: InputMaybe<Scalars["String"]["input"]>;
  reason?: InputMaybe<Scalars["String"]["input"]>;
  targetRoleId?: InputMaybe<Scalars["uuid"]["input"]>;
  targetUserId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "audit.permission_changes" */
export enum AuditPermissionChangesUpdateColumn {
  /** column name */
  approvedByUserId = "approvedByUserId",
  /** column name */
  changeType = "changeType",
  /** column name */
  changedAt = "changedAt",
  /** column name */
  changedByUserId = "changedByUserId",
  /** column name */
  id = "id",
  /** column name */
  metadata = "metadata",
  /** column name */
  newPermissions = "newPermissions",
  /** column name */
  oldPermissions = "oldPermissions",
  /** column name */
  permissionType = "permissionType",
  /** column name */
  reason = "reason",
  /** column name */
  targetRoleId = "targetRoleId",
  /** column name */
  targetUserId = "targetUserId",
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
  __typename: "audit_permission_usage_report";
  action: Maybe<Scalars["permission_action"]["output"]>;
  last_used: Maybe<Scalars["timestamptz"]["output"]>;
  resource_name: Maybe<Scalars["String"]["output"]>;
  role_name: Maybe<Scalars["String"]["output"]>;
  total_usage_count: Maybe<Scalars["bigint"]["output"]>;
  users_who_used_permission: Maybe<Scalars["bigint"]["output"]>;
  users_with_permission: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregated selection of "audit.permission_usage_report" */
export type AuditPermissionUsageReportAggregate = {
  __typename: "audit_permission_usage_report_aggregate";
  aggregate: Maybe<AuditPermissionUsageReportAggregateFields>;
  nodes: Array<AuditPermissionUsageReport>;
};

/** aggregate fields of "audit.permission_usage_report" */
export type AuditPermissionUsageReportAggregateFields = {
  __typename: "audit_permission_usage_report_aggregate_fields";
  avg: Maybe<AuditPermissionUsageReportAvgFields>;
  count: Scalars["Int"]["output"];
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type AuditPermissionUsageReportAvgFields = {
  __typename: "audit_permission_usage_report_avg_fields";
  total_usage_count: Maybe<Scalars["Float"]["output"]>;
  users_who_used_permission: Maybe<Scalars["Float"]["output"]>;
  users_with_permission: Maybe<Scalars["Float"]["output"]>;
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
  __typename: "audit_permission_usage_report_max_fields";
  action: Maybe<Scalars["permission_action"]["output"]>;
  last_used: Maybe<Scalars["timestamptz"]["output"]>;
  resource_name: Maybe<Scalars["String"]["output"]>;
  role_name: Maybe<Scalars["String"]["output"]>;
  total_usage_count: Maybe<Scalars["bigint"]["output"]>;
  users_who_used_permission: Maybe<Scalars["bigint"]["output"]>;
  users_with_permission: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate min on columns */
export type AuditPermissionUsageReportMinFields = {
  __typename: "audit_permission_usage_report_min_fields";
  action: Maybe<Scalars["permission_action"]["output"]>;
  last_used: Maybe<Scalars["timestamptz"]["output"]>;
  resource_name: Maybe<Scalars["String"]["output"]>;
  role_name: Maybe<Scalars["String"]["output"]>;
  total_usage_count: Maybe<Scalars["bigint"]["output"]>;
  users_who_used_permission: Maybe<Scalars["bigint"]["output"]>;
  users_with_permission: Maybe<Scalars["bigint"]["output"]>;
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
  action = "action",
  /** column name */
  last_used = "last_used",
  /** column name */
  resource_name = "resource_name",
  /** column name */
  role_name = "role_name",
  /** column name */
  total_usage_count = "total_usage_count",
  /** column name */
  users_who_used_permission = "users_who_used_permission",
  /** column name */
  users_with_permission = "users_with_permission",
}

/** aggregate stddev on columns */
export type AuditPermissionUsageReportStddevFields = {
  __typename: "audit_permission_usage_report_stddev_fields";
  total_usage_count: Maybe<Scalars["Float"]["output"]>;
  users_who_used_permission: Maybe<Scalars["Float"]["output"]>;
  users_with_permission: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type AuditPermissionUsageReportStddevPopFields = {
  __typename: "audit_permission_usage_report_stddev_pop_fields";
  total_usage_count: Maybe<Scalars["Float"]["output"]>;
  users_who_used_permission: Maybe<Scalars["Float"]["output"]>;
  users_with_permission: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type AuditPermissionUsageReportStddevSampFields = {
  __typename: "audit_permission_usage_report_stddev_samp_fields";
  total_usage_count: Maybe<Scalars["Float"]["output"]>;
  users_who_used_permission: Maybe<Scalars["Float"]["output"]>;
  users_with_permission: Maybe<Scalars["Float"]["output"]>;
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
  action?: InputMaybe<Scalars["permission_action"]["input"]>;
  last_used?: InputMaybe<Scalars["timestamptz"]["input"]>;
  resource_name?: InputMaybe<Scalars["String"]["input"]>;
  role_name?: InputMaybe<Scalars["String"]["input"]>;
  total_usage_count?: InputMaybe<Scalars["bigint"]["input"]>;
  users_who_used_permission?: InputMaybe<Scalars["bigint"]["input"]>;
  users_with_permission?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate sum on columns */
export type AuditPermissionUsageReportSumFields = {
  __typename: "audit_permission_usage_report_sum_fields";
  total_usage_count: Maybe<Scalars["bigint"]["output"]>;
  users_who_used_permission: Maybe<Scalars["bigint"]["output"]>;
  users_with_permission: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate var_pop on columns */
export type AuditPermissionUsageReportVarPopFields = {
  __typename: "audit_permission_usage_report_var_pop_fields";
  total_usage_count: Maybe<Scalars["Float"]["output"]>;
  users_who_used_permission: Maybe<Scalars["Float"]["output"]>;
  users_with_permission: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type AuditPermissionUsageReportVarSampFields = {
  __typename: "audit_permission_usage_report_var_samp_fields";
  total_usage_count: Maybe<Scalars["Float"]["output"]>;
  users_who_used_permission: Maybe<Scalars["Float"]["output"]>;
  users_with_permission: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type AuditPermissionUsageReportVarianceFields = {
  __typename: "audit_permission_usage_report_variance_fields";
  total_usage_count: Maybe<Scalars["Float"]["output"]>;
  users_who_used_permission: Maybe<Scalars["Float"]["output"]>;
  users_with_permission: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "audit.slow_queries" */
export type AuditSlowQueries = {
  __typename: "audit_slow_queries";
  application_name: Maybe<Scalars["String"]["output"]>;
  client_addr: Maybe<Scalars["inet"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  id: Scalars["uuid"]["output"];
  query: Scalars["String"]["output"];
  query_duration: Scalars["interval"]["output"];
  query_start: Scalars["timestamptz"]["output"];
  user_id: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregated selection of "audit.slow_queries" */
export type AuditSlowQueriesAggregate = {
  __typename: "audit_slow_queries_aggregate";
  aggregate: Maybe<AuditSlowQueriesAggregateFields>;
  nodes: Array<AuditSlowQueries>;
};

/** aggregate fields of "audit.slow_queries" */
export type AuditSlowQueriesAggregateFields = {
  __typename: "audit_slow_queries_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<AuditSlowQueriesMaxFields>;
  min: Maybe<AuditSlowQueriesMinFields>;
};

/** aggregate fields of "audit.slow_queries" */
export type AuditSlowQueriesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AuditSlowQueriesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  slow_queries_pkey = "slow_queries_pkey",
}

/** input type for inserting data into table "audit.slow_queries" */
export type AuditSlowQueriesInsertInput = {
  application_name?: InputMaybe<Scalars["String"]["input"]>;
  client_addr?: InputMaybe<Scalars["inet"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  query?: InputMaybe<Scalars["String"]["input"]>;
  query_duration?: InputMaybe<Scalars["interval"]["input"]>;
  query_start?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type AuditSlowQueriesMaxFields = {
  __typename: "audit_slow_queries_max_fields";
  application_name: Maybe<Scalars["String"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  query: Maybe<Scalars["String"]["output"]>;
  query_start: Maybe<Scalars["timestamptz"]["output"]>;
  user_id: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type AuditSlowQueriesMinFields = {
  __typename: "audit_slow_queries_min_fields";
  application_name: Maybe<Scalars["String"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  query: Maybe<Scalars["String"]["output"]>;
  query_start: Maybe<Scalars["timestamptz"]["output"]>;
  user_id: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "audit.slow_queries" */
export type AuditSlowQueriesMutationResponse = {
  __typename: "audit_slow_queries_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "audit.slow_queries" */
export enum AuditSlowQueriesSelectColumn {
  /** column name */
  application_name = "application_name",
  /** column name */
  client_addr = "client_addr",
  /** column name */
  created_at = "created_at",
  /** column name */
  id = "id",
  /** column name */
  query = "query",
  /** column name */
  query_duration = "query_duration",
  /** column name */
  query_start = "query_start",
  /** column name */
  user_id = "user_id",
}

/** input type for updating data in table "audit.slow_queries" */
export type AuditSlowQueriesSetInput = {
  application_name?: InputMaybe<Scalars["String"]["input"]>;
  client_addr?: InputMaybe<Scalars["inet"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  query?: InputMaybe<Scalars["String"]["input"]>;
  query_duration?: InputMaybe<Scalars["interval"]["input"]>;
  query_start?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
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
  application_name?: InputMaybe<Scalars["String"]["input"]>;
  client_addr?: InputMaybe<Scalars["inet"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  query?: InputMaybe<Scalars["String"]["input"]>;
  query_duration?: InputMaybe<Scalars["interval"]["input"]>;
  query_start?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "audit.slow_queries" */
export enum AuditSlowQueriesUpdateColumn {
  /** column name */
  application_name = "application_name",
  /** column name */
  client_addr = "client_addr",
  /** column name */
  created_at = "created_at",
  /** column name */
  id = "id",
  /** column name */
  query = "query",
  /** column name */
  query_duration = "query_duration",
  /** column name */
  query_start = "query_start",
  /** column name */
  user_id = "user_id",
}

export type AuditSlowQueriesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuditSlowQueriesSetInput>;
  /** filter the rows which have to be updated */
  where: AuditSlowQueriesBoolExp;
};

/** columns and relationships of "audit.user_access_summary" */
export type AuditUserAccessSummary = {
  __typename: "audit_user_access_summary";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  email: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  is_active: Maybe<Scalars["Boolean"]["output"]>;
  is_staff: Maybe<Scalars["Boolean"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  role: Maybe<Scalars["user_role"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregated selection of "audit.user_access_summary" */
export type AuditUserAccessSummaryAggregate = {
  __typename: "audit_user_access_summary_aggregate";
  aggregate: Maybe<AuditUserAccessSummaryAggregateFields>;
  nodes: Array<AuditUserAccessSummary>;
};

/** aggregate fields of "audit.user_access_summary" */
export type AuditUserAccessSummaryAggregateFields = {
  __typename: "audit_user_access_summary_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<AuditUserAccessSummaryMaxFields>;
  min: Maybe<AuditUserAccessSummaryMinFields>;
};

/** aggregate fields of "audit.user_access_summary" */
export type AuditUserAccessSummaryAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AuditUserAccessSummarySelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  is_staff?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Scalars["user_role"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type AuditUserAccessSummaryMaxFields = {
  __typename: "audit_user_access_summary_max_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  email: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  role: Maybe<Scalars["user_role"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type AuditUserAccessSummaryMinFields = {
  __typename: "audit_user_access_summary_min_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  email: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  role: Maybe<Scalars["user_role"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "audit.user_access_summary" */
export type AuditUserAccessSummaryMutationResponse = {
  __typename: "audit_user_access_summary_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  created_at = "created_at",
  /** column name */
  email = "email",
  /** column name */
  id = "id",
  /** column name */
  is_active = "is_active",
  /** column name */
  is_staff = "is_staff",
  /** column name */
  name = "name",
  /** column name */
  role = "role",
  /** column name */
  updated_at = "updated_at",
}

/** input type for updating data in table "audit.user_access_summary" */
export type AuditUserAccessSummarySetInput = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  is_staff?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Scalars["user_role"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
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
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  is_staff?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Scalars["user_role"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

export type AuditUserAccessSummaryUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuditUserAccessSummarySetInput>;
  /** filter the rows which have to be updated */
  where: AuditUserAccessSummaryBoolExp;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type BigintComparisonExp = {
  _eq?: InputMaybe<Scalars["bigint"]["input"]>;
  _gt?: InputMaybe<Scalars["bigint"]["input"]>;
  _gte?: InputMaybe<Scalars["bigint"]["input"]>;
  _in?: InputMaybe<Array<Scalars["bigint"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["bigint"]["input"]>;
  _lte?: InputMaybe<Scalars["bigint"]["input"]>;
  _neq?: InputMaybe<Scalars["bigint"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["bigint"]["input"]>>;
};

/** columns and relationships of "billing_event_log" */
export type BillingEventLog = {
  __typename: "billing_event_log";
  /** An object relationship */
  billing_invoice: Maybe<BillingInvoice>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  created_by: Maybe<Scalars["uuid"]["output"]>;
  event_type: Scalars["String"]["output"];
  id: Scalars["uuid"]["output"];
  invoice_id: Maybe<Scalars["uuid"]["output"]>;
  message: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  user: Maybe<Users>;
};

/** aggregated selection of "billing_event_log" */
export type BillingEventLogAggregate = {
  __typename: "billing_event_log_aggregate";
  aggregate: Maybe<BillingEventLogAggregateFields>;
  nodes: Array<BillingEventLog>;
};

export type BillingEventLogAggregateBoolExp = {
  count?: InputMaybe<BillingEventLogAggregateBoolExpCount>;
};

export type BillingEventLogAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<BillingEventLogBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "billing_event_log" */
export type BillingEventLogAggregateFields = {
  __typename: "billing_event_log_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<BillingEventLogMaxFields>;
  min: Maybe<BillingEventLogMinFields>;
};

/** aggregate fields of "billing_event_log" */
export type BillingEventLogAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  billing_event_log_pkey = "billing_event_log_pkey",
}

/** input type for inserting data into table "billing_event_log" */
export type BillingEventLogInsertInput = {
  billing_invoice?: InputMaybe<BillingInvoiceObjRelInsertInput>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["uuid"]["input"]>;
  event_type?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_id?: InputMaybe<Scalars["uuid"]["input"]>;
  message?: InputMaybe<Scalars["String"]["input"]>;
  user?: InputMaybe<UsersObjRelInsertInput>;
};

/** aggregate max on columns */
export type BillingEventLogMaxFields = {
  __typename: "billing_event_log_max_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  created_by: Maybe<Scalars["uuid"]["output"]>;
  event_type: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  invoice_id: Maybe<Scalars["uuid"]["output"]>;
  message: Maybe<Scalars["String"]["output"]>;
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
  __typename: "billing_event_log_min_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  created_by: Maybe<Scalars["uuid"]["output"]>;
  event_type: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  invoice_id: Maybe<Scalars["uuid"]["output"]>;
  message: Maybe<Scalars["String"]["output"]>;
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
  __typename: "billing_event_log_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "billing_event_log" */
export enum BillingEventLogSelectColumn {
  /** column name */
  created_at = "created_at",
  /** column name */
  created_by = "created_by",
  /** column name */
  event_type = "event_type",
  /** column name */
  id = "id",
  /** column name */
  invoice_id = "invoice_id",
  /** column name */
  message = "message",
}

/** input type for updating data in table "billing_event_log" */
export type BillingEventLogSetInput = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["uuid"]["input"]>;
  event_type?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_id?: InputMaybe<Scalars["uuid"]["input"]>;
  message?: InputMaybe<Scalars["String"]["input"]>;
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
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["uuid"]["input"]>;
  event_type?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_id?: InputMaybe<Scalars["uuid"]["input"]>;
  message?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "billing_event_log" */
export enum BillingEventLogUpdateColumn {
  /** column name */
  created_at = "created_at",
  /** column name */
  created_by = "created_by",
  /** column name */
  event_type = "event_type",
  /** column name */
  id = "id",
  /** column name */
  invoice_id = "invoice_id",
  /** column name */
  message = "message",
}

export type BillingEventLogUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingEventLogSetInput>;
  /** filter the rows which have to be updated */
  where: BillingEventLogBoolExp;
};

/** columns and relationships of "billing_invoice" */
export type BillingInvoice = {
  __typename: "billing_invoice";
  /** An array relationship */
  billing_event_logs: Array<BillingEventLog>;
  /** An aggregate relationship */
  billing_event_logs_aggregate: BillingEventLogAggregate;
  /** An array relationship */
  billing_invoice_items: Array<BillingInvoiceItem>;
  /** An aggregate relationship */
  billing_invoice_items_aggregate: BillingInvoiceItemAggregate;
  billing_period_end: Scalars["date"]["output"];
  billing_period_start: Scalars["date"]["output"];
  /** An object relationship */
  client: Clients;
  client_id: Scalars["uuid"]["output"];
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  currency: Maybe<Scalars["String"]["output"]>;
  due_date: Maybe<Scalars["date"]["output"]>;
  id: Scalars["uuid"]["output"];
  issued_date: Maybe<Scalars["date"]["output"]>;
  notes: Maybe<Scalars["String"]["output"]>;
  status: Scalars["String"]["output"];
  total_amount: Scalars["numeric"]["output"];
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** columns and relationships of "billing_invoice" */
export type BillingInvoiceBillingEventLogsArgs = {
  distinct_on?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingEventLogOrderBy>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};

/** columns and relationships of "billing_invoice" */
export type BillingInvoiceBillingEventLogsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingEventLogOrderBy>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};

/** columns and relationships of "billing_invoice" */
export type BillingInvoiceBillingInvoiceItemsArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};

/** columns and relationships of "billing_invoice" */
export type BillingInvoiceBillingInvoiceItemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};

/** aggregated selection of "billing_invoice" */
export type BillingInvoiceAggregate = {
  __typename: "billing_invoice_aggregate";
  aggregate: Maybe<BillingInvoiceAggregateFields>;
  nodes: Array<BillingInvoice>;
};

export type BillingInvoiceAggregateBoolExp = {
  count?: InputMaybe<BillingInvoiceAggregateBoolExpCount>;
};

export type BillingInvoiceAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<BillingInvoiceBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "billing_invoice" */
export type BillingInvoiceAggregateFields = {
  __typename: "billing_invoice_aggregate_fields";
  avg: Maybe<BillingInvoiceAvgFields>;
  count: Scalars["Int"]["output"];
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  __typename: "billing_invoice_avg_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
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
  billing_invoice_pkey = "billing_invoice_pkey",
}

/** input type for incrementing numeric columns in table "billing_invoice" */
export type BillingInvoiceIncInput = {
  total_amount?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** input type for inserting data into table "billing_invoice" */
export type BillingInvoiceInsertInput = {
  billing_event_logs?: InputMaybe<BillingEventLogArrRelInsertInput>;
  billing_invoice_items?: InputMaybe<BillingInvoiceItemArrRelInsertInput>;
  billing_period_end?: InputMaybe<Scalars["date"]["input"]>;
  billing_period_start?: InputMaybe<Scalars["date"]["input"]>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  currency?: InputMaybe<Scalars["String"]["input"]>;
  due_date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  issued_date?: InputMaybe<Scalars["date"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  total_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** columns and relationships of "billing_invoice_item" */
export type BillingInvoiceItem = {
  __typename: "billing_invoice_item";
  amount: Maybe<Scalars["numeric"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  description: Scalars["String"]["output"];
  id: Scalars["uuid"]["output"];
  invoice_id: Scalars["uuid"]["output"];
  /** An object relationship */
  parent_invoice: BillingInvoice;
  quantity: Scalars["Int"]["output"];
  unit_price: Scalars["numeric"]["output"];
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregated selection of "billing_invoice_item" */
export type BillingInvoiceItemAggregate = {
  __typename: "billing_invoice_item_aggregate";
  aggregate: Maybe<BillingInvoiceItemAggregateFields>;
  nodes: Array<BillingInvoiceItem>;
};

export type BillingInvoiceItemAggregateBoolExp = {
  count?: InputMaybe<BillingInvoiceItemAggregateBoolExpCount>;
};

export type BillingInvoiceItemAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<BillingInvoiceItemBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "billing_invoice_item" */
export type BillingInvoiceItemAggregateFields = {
  __typename: "billing_invoice_item_aggregate_fields";
  avg: Maybe<BillingInvoiceItemAvgFields>;
  count: Scalars["Int"]["output"];
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  __typename: "billing_invoice_item_avg_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
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
  billing_invoice_item_pkey = "billing_invoice_item_pkey",
}

/** input type for incrementing numeric columns in table "billing_invoice_item" */
export type BillingInvoiceItemIncInput = {
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  unit_price?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** input type for inserting data into table "billing_invoice_item" */
export type BillingInvoiceItemInsertInput = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_id?: InputMaybe<Scalars["uuid"]["input"]>;
  parent_invoice?: InputMaybe<BillingInvoiceObjRelInsertInput>;
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  unit_price?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type BillingInvoiceItemMaxFields = {
  __typename: "billing_invoice_item_max_fields";
  amount: Maybe<Scalars["numeric"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  invoice_id: Maybe<Scalars["uuid"]["output"]>;
  quantity: Maybe<Scalars["Int"]["output"]>;
  unit_price: Maybe<Scalars["numeric"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "billing_invoice_item_min_fields";
  amount: Maybe<Scalars["numeric"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  invoice_id: Maybe<Scalars["uuid"]["output"]>;
  quantity: Maybe<Scalars["Int"]["output"]>;
  unit_price: Maybe<Scalars["numeric"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "billing_invoice_item_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "billing_invoice_item" */
export enum BillingInvoiceItemSelectColumn {
  /** column name */
  amount = "amount",
  /** column name */
  created_at = "created_at",
  /** column name */
  description = "description",
  /** column name */
  id = "id",
  /** column name */
  invoice_id = "invoice_id",
  /** column name */
  quantity = "quantity",
  /** column name */
  unit_price = "unit_price",
  /** column name */
  updated_at = "updated_at",
}

/** input type for updating data in table "billing_invoice_item" */
export type BillingInvoiceItemSetInput = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_id?: InputMaybe<Scalars["uuid"]["input"]>;
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  unit_price?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate stddev on columns */
export type BillingInvoiceItemStddevFields = {
  __typename: "billing_invoice_item_stddev_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemStddevOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type BillingInvoiceItemStddevPopFields = {
  __typename: "billing_invoice_item_stddev_pop_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemStddevPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type BillingInvoiceItemStddevSampFields = {
  __typename: "billing_invoice_item_stddev_samp_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
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
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_id?: InputMaybe<Scalars["uuid"]["input"]>;
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  unit_price?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate sum on columns */
export type BillingInvoiceItemSumFields = {
  __typename: "billing_invoice_item_sum_fields";
  amount: Maybe<Scalars["numeric"]["output"]>;
  quantity: Maybe<Scalars["Int"]["output"]>;
  unit_price: Maybe<Scalars["numeric"]["output"]>;
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
  created_at = "created_at",
  /** column name */
  description = "description",
  /** column name */
  id = "id",
  /** column name */
  invoice_id = "invoice_id",
  /** column name */
  quantity = "quantity",
  /** column name */
  unit_price = "unit_price",
  /** column name */
  updated_at = "updated_at",
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
  __typename: "billing_invoice_item_var_pop_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemVarPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type BillingInvoiceItemVarSampFields = {
  __typename: "billing_invoice_item_var_samp_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemVarSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type BillingInvoiceItemVarianceFields = {
  __typename: "billing_invoice_item_variance_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemVarianceOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate max on columns */
export type BillingInvoiceMaxFields = {
  __typename: "billing_invoice_max_fields";
  billing_period_end: Maybe<Scalars["date"]["output"]>;
  billing_period_start: Maybe<Scalars["date"]["output"]>;
  client_id: Maybe<Scalars["uuid"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  currency: Maybe<Scalars["String"]["output"]>;
  due_date: Maybe<Scalars["date"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  issued_date: Maybe<Scalars["date"]["output"]>;
  notes: Maybe<Scalars["String"]["output"]>;
  status: Maybe<Scalars["String"]["output"]>;
  total_amount: Maybe<Scalars["numeric"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "billing_invoice_min_fields";
  billing_period_end: Maybe<Scalars["date"]["output"]>;
  billing_period_start: Maybe<Scalars["date"]["output"]>;
  client_id: Maybe<Scalars["uuid"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  currency: Maybe<Scalars["String"]["output"]>;
  due_date: Maybe<Scalars["date"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  issued_date: Maybe<Scalars["date"]["output"]>;
  notes: Maybe<Scalars["String"]["output"]>;
  status: Maybe<Scalars["String"]["output"]>;
  total_amount: Maybe<Scalars["numeric"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "billing_invoice_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "billing_invoice" */
export enum BillingInvoiceSelectColumn {
  /** column name */
  billing_period_end = "billing_period_end",
  /** column name */
  billing_period_start = "billing_period_start",
  /** column name */
  client_id = "client_id",
  /** column name */
  created_at = "created_at",
  /** column name */
  currency = "currency",
  /** column name */
  due_date = "due_date",
  /** column name */
  id = "id",
  /** column name */
  issued_date = "issued_date",
  /** column name */
  notes = "notes",
  /** column name */
  status = "status",
  /** column name */
  total_amount = "total_amount",
  /** column name */
  updated_at = "updated_at",
}

/** input type for updating data in table "billing_invoice" */
export type BillingInvoiceSetInput = {
  billing_period_end?: InputMaybe<Scalars["date"]["input"]>;
  billing_period_start?: InputMaybe<Scalars["date"]["input"]>;
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  currency?: InputMaybe<Scalars["String"]["input"]>;
  due_date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  issued_date?: InputMaybe<Scalars["date"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  total_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate stddev on columns */
export type BillingInvoiceStddevFields = {
  __typename: "billing_invoice_stddev_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "billing_invoice" */
export type BillingInvoiceStddevOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type BillingInvoiceStddevPopFields = {
  __typename: "billing_invoice_stddev_pop_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "billing_invoice" */
export type BillingInvoiceStddevPopOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type BillingInvoiceStddevSampFields = {
  __typename: "billing_invoice_stddev_samp_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
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
  billing_period_end?: InputMaybe<Scalars["date"]["input"]>;
  billing_period_start?: InputMaybe<Scalars["date"]["input"]>;
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  currency?: InputMaybe<Scalars["String"]["input"]>;
  due_date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  issued_date?: InputMaybe<Scalars["date"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  total_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate sum on columns */
export type BillingInvoiceSumFields = {
  __typename: "billing_invoice_sum_fields";
  total_amount: Maybe<Scalars["numeric"]["output"]>;
};

/** order by sum() on columns of table "billing_invoice" */
export type BillingInvoiceSumOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** update columns of table "billing_invoice" */
export enum BillingInvoiceUpdateColumn {
  /** column name */
  billing_period_end = "billing_period_end",
  /** column name */
  billing_period_start = "billing_period_start",
  /** column name */
  client_id = "client_id",
  /** column name */
  created_at = "created_at",
  /** column name */
  currency = "currency",
  /** column name */
  due_date = "due_date",
  /** column name */
  id = "id",
  /** column name */
  issued_date = "issued_date",
  /** column name */
  notes = "notes",
  /** column name */
  status = "status",
  /** column name */
  total_amount = "total_amount",
  /** column name */
  updated_at = "updated_at",
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
  __typename: "billing_invoice_var_pop_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "billing_invoice" */
export type BillingInvoiceVarPopOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type BillingInvoiceVarSampFields = {
  __typename: "billing_invoice_var_samp_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "billing_invoice" */
export type BillingInvoiceVarSampOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type BillingInvoiceVarianceFields = {
  __typename: "billing_invoice_variance_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "billing_invoice" */
export type BillingInvoiceVarianceOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** columns and relationships of "billing_invoices" */
export type BillingInvoices = {
  __typename: "billing_invoices";
  /** An array relationship */
  billing_items: Array<BillingItems>;
  /** An aggregate relationship */
  billing_items_aggregate: BillingItemsAggregate;
  billing_period_end: Scalars["date"]["output"];
  billing_period_start: Scalars["date"]["output"];
  /** An object relationship */
  client: Maybe<Clients>;
  client_id: Maybe<Scalars["uuid"]["output"]>;
  created_at: Maybe<Scalars["timestamp"]["output"]>;
  id: Scalars["uuid"]["output"];
  invoice_number: Scalars["String"]["output"];
  status: Maybe<Scalars["String"]["output"]>;
  total_amount: Maybe<Scalars["numeric"]["output"]>;
  updated_at: Maybe<Scalars["timestamp"]["output"]>;
};

/** columns and relationships of "billing_invoices" */
export type BillingInvoicesBillingItemsArgs = {
  distinct_on?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};

/** columns and relationships of "billing_invoices" */
export type BillingInvoicesBillingItemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};

/** aggregated selection of "billing_invoices" */
export type BillingInvoicesAggregate = {
  __typename: "billing_invoices_aggregate";
  aggregate: Maybe<BillingInvoicesAggregateFields>;
  nodes: Array<BillingInvoices>;
};

export type BillingInvoicesAggregateBoolExp = {
  count?: InputMaybe<BillingInvoicesAggregateBoolExpCount>;
};

export type BillingInvoicesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<BillingInvoicesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "billing_invoices" */
export type BillingInvoicesAggregateFields = {
  __typename: "billing_invoices_aggregate_fields";
  avg: Maybe<BillingInvoicesAvgFields>;
  count: Scalars["Int"]["output"];
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  __typename: "billing_invoices_avg_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
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
  billing_invoices_invoice_number_key = "billing_invoices_invoice_number_key",
  /** unique or primary key constraint on columns "id" */
  billing_invoices_pkey = "billing_invoices_pkey",
}

/** input type for incrementing numeric columns in table "billing_invoices" */
export type BillingInvoicesIncInput = {
  total_amount?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** input type for inserting data into table "billing_invoices" */
export type BillingInvoicesInsertInput = {
  billing_items?: InputMaybe<BillingItemsArrRelInsertInput>;
  billing_period_end?: InputMaybe<Scalars["date"]["input"]>;
  billing_period_start?: InputMaybe<Scalars["date"]["input"]>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_number?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  total_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamp"]["input"]>;
};

/** aggregate max on columns */
export type BillingInvoicesMaxFields = {
  __typename: "billing_invoices_max_fields";
  billing_period_end: Maybe<Scalars["date"]["output"]>;
  billing_period_start: Maybe<Scalars["date"]["output"]>;
  client_id: Maybe<Scalars["uuid"]["output"]>;
  created_at: Maybe<Scalars["timestamp"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  invoice_number: Maybe<Scalars["String"]["output"]>;
  status: Maybe<Scalars["String"]["output"]>;
  total_amount: Maybe<Scalars["numeric"]["output"]>;
  updated_at: Maybe<Scalars["timestamp"]["output"]>;
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
  __typename: "billing_invoices_min_fields";
  billing_period_end: Maybe<Scalars["date"]["output"]>;
  billing_period_start: Maybe<Scalars["date"]["output"]>;
  client_id: Maybe<Scalars["uuid"]["output"]>;
  created_at: Maybe<Scalars["timestamp"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  invoice_number: Maybe<Scalars["String"]["output"]>;
  status: Maybe<Scalars["String"]["output"]>;
  total_amount: Maybe<Scalars["numeric"]["output"]>;
  updated_at: Maybe<Scalars["timestamp"]["output"]>;
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
  __typename: "billing_invoices_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "billing_invoices" */
export enum BillingInvoicesSelectColumn {
  /** column name */
  billing_period_end = "billing_period_end",
  /** column name */
  billing_period_start = "billing_period_start",
  /** column name */
  client_id = "client_id",
  /** column name */
  created_at = "created_at",
  /** column name */
  id = "id",
  /** column name */
  invoice_number = "invoice_number",
  /** column name */
  status = "status",
  /** column name */
  total_amount = "total_amount",
  /** column name */
  updated_at = "updated_at",
}

/** input type for updating data in table "billing_invoices" */
export type BillingInvoicesSetInput = {
  billing_period_end?: InputMaybe<Scalars["date"]["input"]>;
  billing_period_start?: InputMaybe<Scalars["date"]["input"]>;
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_number?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  total_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamp"]["input"]>;
};

/** aggregate stddev on columns */
export type BillingInvoicesStddevFields = {
  __typename: "billing_invoices_stddev_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "billing_invoices" */
export type BillingInvoicesStddevOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type BillingInvoicesStddevPopFields = {
  __typename: "billing_invoices_stddev_pop_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "billing_invoices" */
export type BillingInvoicesStddevPopOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type BillingInvoicesStddevSampFields = {
  __typename: "billing_invoices_stddev_samp_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
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
  billing_period_end?: InputMaybe<Scalars["date"]["input"]>;
  billing_period_start?: InputMaybe<Scalars["date"]["input"]>;
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_number?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  total_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamp"]["input"]>;
};

/** aggregate sum on columns */
export type BillingInvoicesSumFields = {
  __typename: "billing_invoices_sum_fields";
  total_amount: Maybe<Scalars["numeric"]["output"]>;
};

/** order by sum() on columns of table "billing_invoices" */
export type BillingInvoicesSumOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** update columns of table "billing_invoices" */
export enum BillingInvoicesUpdateColumn {
  /** column name */
  billing_period_end = "billing_period_end",
  /** column name */
  billing_period_start = "billing_period_start",
  /** column name */
  client_id = "client_id",
  /** column name */
  created_at = "created_at",
  /** column name */
  id = "id",
  /** column name */
  invoice_number = "invoice_number",
  /** column name */
  status = "status",
  /** column name */
  total_amount = "total_amount",
  /** column name */
  updated_at = "updated_at",
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
  __typename: "billing_invoices_var_pop_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "billing_invoices" */
export type BillingInvoicesVarPopOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type BillingInvoicesVarSampFields = {
  __typename: "billing_invoices_var_samp_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "billing_invoices" */
export type BillingInvoicesVarSampOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type BillingInvoicesVarianceFields = {
  __typename: "billing_invoices_variance_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "billing_invoices" */
export type BillingInvoicesVarianceOrderBy = {
  total_amount?: InputMaybe<OrderBy>;
};

/** columns and relationships of "billing_items" */
export type BillingItems = {
  __typename: "billing_items";
  amount: Maybe<Scalars["numeric"]["output"]>;
  created_at: Maybe<Scalars["timestamp"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  invoice_id: Maybe<Scalars["uuid"]["output"]>;
  /** An object relationship */
  invoice_reference: Maybe<BillingInvoices>;
  /** An object relationship */
  payroll: Maybe<Payrolls>;
  payroll_id: Maybe<Scalars["uuid"]["output"]>;
  quantity: Scalars["Int"]["output"];
  unit_price: Scalars["numeric"]["output"];
};

/** aggregated selection of "billing_items" */
export type BillingItemsAggregate = {
  __typename: "billing_items_aggregate";
  aggregate: Maybe<BillingItemsAggregateFields>;
  nodes: Array<BillingItems>;
};

export type BillingItemsAggregateBoolExp = {
  count?: InputMaybe<BillingItemsAggregateBoolExpCount>;
};

export type BillingItemsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingItemsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<BillingItemsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "billing_items" */
export type BillingItemsAggregateFields = {
  __typename: "billing_items_aggregate_fields";
  avg: Maybe<BillingItemsAvgFields>;
  count: Scalars["Int"]["output"];
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  __typename: "billing_items_avg_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
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
  billing_items_pkey = "billing_items_pkey",
}

/** input type for incrementing numeric columns in table "billing_items" */
export type BillingItemsIncInput = {
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  unit_price?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** input type for inserting data into table "billing_items" */
export type BillingItemsInsertInput = {
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_reference?: InputMaybe<BillingInvoicesObjRelInsertInput>;
  payroll?: InputMaybe<PayrollsObjRelInsertInput>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  unit_price?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** aggregate max on columns */
export type BillingItemsMaxFields = {
  __typename: "billing_items_max_fields";
  amount: Maybe<Scalars["numeric"]["output"]>;
  created_at: Maybe<Scalars["timestamp"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  invoice_id: Maybe<Scalars["uuid"]["output"]>;
  payroll_id: Maybe<Scalars["uuid"]["output"]>;
  quantity: Maybe<Scalars["Int"]["output"]>;
  unit_price: Maybe<Scalars["numeric"]["output"]>;
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
  __typename: "billing_items_min_fields";
  amount: Maybe<Scalars["numeric"]["output"]>;
  created_at: Maybe<Scalars["timestamp"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  invoice_id: Maybe<Scalars["uuid"]["output"]>;
  payroll_id: Maybe<Scalars["uuid"]["output"]>;
  quantity: Maybe<Scalars["Int"]["output"]>;
  unit_price: Maybe<Scalars["numeric"]["output"]>;
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
  __typename: "billing_items_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "billing_items" */
export enum BillingItemsSelectColumn {
  /** column name */
  amount = "amount",
  /** column name */
  created_at = "created_at",
  /** column name */
  description = "description",
  /** column name */
  id = "id",
  /** column name */
  invoice_id = "invoice_id",
  /** column name */
  payroll_id = "payroll_id",
  /** column name */
  quantity = "quantity",
  /** column name */
  unit_price = "unit_price",
}

/** input type for updating data in table "billing_items" */
export type BillingItemsSetInput = {
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_id?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  unit_price?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** aggregate stddev on columns */
export type BillingItemsStddevFields = {
  __typename: "billing_items_stddev_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "billing_items" */
export type BillingItemsStddevOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type BillingItemsStddevPopFields = {
  __typename: "billing_items_stddev_pop_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "billing_items" */
export type BillingItemsStddevPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type BillingItemsStddevSampFields = {
  __typename: "billing_items_stddev_samp_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
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
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_id?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  unit_price?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** aggregate sum on columns */
export type BillingItemsSumFields = {
  __typename: "billing_items_sum_fields";
  amount: Maybe<Scalars["numeric"]["output"]>;
  quantity: Maybe<Scalars["Int"]["output"]>;
  unit_price: Maybe<Scalars["numeric"]["output"]>;
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
  created_at = "created_at",
  /** column name */
  description = "description",
  /** column name */
  id = "id",
  /** column name */
  invoice_id = "invoice_id",
  /** column name */
  payroll_id = "payroll_id",
  /** column name */
  quantity = "quantity",
  /** column name */
  unit_price = "unit_price",
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
  __typename: "billing_items_var_pop_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "billing_items" */
export type BillingItemsVarPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type BillingItemsVarSampFields = {
  __typename: "billing_items_var_samp_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "billing_items" */
export type BillingItemsVarSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type BillingItemsVarianceFields = {
  __typename: "billing_items_variance_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "billing_items" */
export type BillingItemsVarianceOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unit_price?: InputMaybe<OrderBy>;
};

/** columns and relationships of "billing_plan" */
export type BillingPlan = {
  __typename: "billing_plan";
  /** An array relationship */
  client_billing_assignments: Array<ClientBillingAssignment>;
  /** An aggregate relationship */
  client_billing_assignments_aggregate: ClientBillingAssignmentAggregate;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  currency: Scalars["String"]["output"];
  description: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  name: Scalars["String"]["output"];
  rate_per_payroll: Scalars["numeric"]["output"];
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** columns and relationships of "billing_plan" */
export type BillingPlanClientBillingAssignmentsArgs = {
  distinct_on?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientBillingAssignmentOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};

/** columns and relationships of "billing_plan" */
export type BillingPlanClientBillingAssignmentsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientBillingAssignmentOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};

/** aggregated selection of "billing_plan" */
export type BillingPlanAggregate = {
  __typename: "billing_plan_aggregate";
  aggregate: Maybe<BillingPlanAggregateFields>;
  nodes: Array<BillingPlan>;
};

/** aggregate fields of "billing_plan" */
export type BillingPlanAggregateFields = {
  __typename: "billing_plan_aggregate_fields";
  avg: Maybe<BillingPlanAvgFields>;
  count: Scalars["Int"]["output"];
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type BillingPlanAvgFields = {
  __typename: "billing_plan_avg_fields";
  rate_per_payroll: Maybe<Scalars["Float"]["output"]>;
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
  billing_plan_pkey = "billing_plan_pkey",
}

/** input type for incrementing numeric columns in table "billing_plan" */
export type BillingPlanIncInput = {
  rate_per_payroll?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** input type for inserting data into table "billing_plan" */
export type BillingPlanInsertInput = {
  client_billing_assignments?: InputMaybe<ClientBillingAssignmentArrRelInsertInput>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  currency?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  rate_per_payroll?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type BillingPlanMaxFields = {
  __typename: "billing_plan_max_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  currency: Maybe<Scalars["String"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  rate_per_payroll: Maybe<Scalars["numeric"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type BillingPlanMinFields = {
  __typename: "billing_plan_min_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  currency: Maybe<Scalars["String"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  rate_per_payroll: Maybe<Scalars["numeric"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "billing_plan" */
export type BillingPlanMutationResponse = {
  __typename: "billing_plan_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "billing_plan" */
export enum BillingPlanSelectColumn {
  /** column name */
  created_at = "created_at",
  /** column name */
  currency = "currency",
  /** column name */
  description = "description",
  /** column name */
  id = "id",
  /** column name */
  name = "name",
  /** column name */
  rate_per_payroll = "rate_per_payroll",
  /** column name */
  updated_at = "updated_at",
}

/** input type for updating data in table "billing_plan" */
export type BillingPlanSetInput = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  currency?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  rate_per_payroll?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate stddev on columns */
export type BillingPlanStddevFields = {
  __typename: "billing_plan_stddev_fields";
  rate_per_payroll: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type BillingPlanStddevPopFields = {
  __typename: "billing_plan_stddev_pop_fields";
  rate_per_payroll: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type BillingPlanStddevSampFields = {
  __typename: "billing_plan_stddev_samp_fields";
  rate_per_payroll: Maybe<Scalars["Float"]["output"]>;
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
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  currency?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  rate_per_payroll?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate sum on columns */
export type BillingPlanSumFields = {
  __typename: "billing_plan_sum_fields";
  rate_per_payroll: Maybe<Scalars["numeric"]["output"]>;
};

/** update columns of table "billing_plan" */
export enum BillingPlanUpdateColumn {
  /** column name */
  created_at = "created_at",
  /** column name */
  currency = "currency",
  /** column name */
  description = "description",
  /** column name */
  id = "id",
  /** column name */
  name = "name",
  /** column name */
  rate_per_payroll = "rate_per_payroll",
  /** column name */
  updated_at = "updated_at",
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
  __typename: "billing_plan_var_pop_fields";
  rate_per_payroll: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type BillingPlanVarSampFields = {
  __typename: "billing_plan_var_samp_fields";
  rate_per_payroll: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type BillingPlanVarianceFields = {
  __typename: "billing_plan_variance_fields";
  rate_per_payroll: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to compare columns of type "bpchar". All fields are combined with logical 'AND'. */
export type BpcharComparisonExp = {
  _eq?: InputMaybe<Scalars["bpchar"]["input"]>;
  _gt?: InputMaybe<Scalars["bpchar"]["input"]>;
  _gte?: InputMaybe<Scalars["bpchar"]["input"]>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars["bpchar"]["input"]>;
  _in?: InputMaybe<Array<Scalars["bpchar"]["input"]>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars["bpchar"]["input"]>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars["bpchar"]["input"]>;
  _lt?: InputMaybe<Scalars["bpchar"]["input"]>;
  _lte?: InputMaybe<Scalars["bpchar"]["input"]>;
  _neq?: InputMaybe<Scalars["bpchar"]["input"]>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars["bpchar"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["bpchar"]["input"]>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars["bpchar"]["input"]>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars["bpchar"]["input"]>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars["bpchar"]["input"]>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars["bpchar"]["input"]>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars["bpchar"]["input"]>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars["bpchar"]["input"]>;
};

/** columns and relationships of "client_billing_assignment" */
export type ClientBillingAssignment = {
  __typename: "client_billing_assignment";
  /** An object relationship */
  billing_plan: BillingPlan;
  billing_plan_id: Scalars["uuid"]["output"];
  /** An object relationship */
  client: Clients;
  client_id: Scalars["uuid"]["output"];
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  end_date: Maybe<Scalars["date"]["output"]>;
  id: Scalars["uuid"]["output"];
  is_active: Maybe<Scalars["Boolean"]["output"]>;
  start_date: Scalars["date"]["output"];
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregated selection of "client_billing_assignment" */
export type ClientBillingAssignmentAggregate = {
  __typename: "client_billing_assignment_aggregate";
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<ClientBillingAssignmentBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ClientBillingAssignmentAggregateBoolExpBoolOr = {
  arguments: ClientBillingAssignmentSelectColumnClientBillingAssignmentAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<ClientBillingAssignmentBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ClientBillingAssignmentAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<ClientBillingAssignmentBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "client_billing_assignment" */
export type ClientBillingAssignmentAggregateFields = {
  __typename: "client_billing_assignment_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<ClientBillingAssignmentMaxFields>;
  min: Maybe<ClientBillingAssignmentMinFields>;
};

/** aggregate fields of "client_billing_assignment" */
export type ClientBillingAssignmentAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  client_billing_assignment_pkey = "client_billing_assignment_pkey",
}

/** input type for inserting data into table "client_billing_assignment" */
export type ClientBillingAssignmentInsertInput = {
  billing_plan?: InputMaybe<BillingPlanObjRelInsertInput>;
  billing_plan_id?: InputMaybe<Scalars["uuid"]["input"]>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  end_date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  start_date?: InputMaybe<Scalars["date"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type ClientBillingAssignmentMaxFields = {
  __typename: "client_billing_assignment_max_fields";
  billing_plan_id: Maybe<Scalars["uuid"]["output"]>;
  client_id: Maybe<Scalars["uuid"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  end_date: Maybe<Scalars["date"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  start_date: Maybe<Scalars["date"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "client_billing_assignment_min_fields";
  billing_plan_id: Maybe<Scalars["uuid"]["output"]>;
  client_id: Maybe<Scalars["uuid"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  end_date: Maybe<Scalars["date"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  start_date: Maybe<Scalars["date"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "client_billing_assignment_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "client_billing_assignment" */
export enum ClientBillingAssignmentSelectColumn {
  /** column name */
  billing_plan_id = "billing_plan_id",
  /** column name */
  client_id = "client_id",
  /** column name */
  created_at = "created_at",
  /** column name */
  end_date = "end_date",
  /** column name */
  id = "id",
  /** column name */
  is_active = "is_active",
  /** column name */
  start_date = "start_date",
  /** column name */
  updated_at = "updated_at",
}

/** select "client_billing_assignment_aggregate_bool_exp_bool_and_arguments_columns" columns of table "client_billing_assignment" */
export enum ClientBillingAssignmentSelectColumnClientBillingAssignmentAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  is_active = "is_active",
}

/** select "client_billing_assignment_aggregate_bool_exp_bool_or_arguments_columns" columns of table "client_billing_assignment" */
export enum ClientBillingAssignmentSelectColumnClientBillingAssignmentAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  is_active = "is_active",
}

/** input type for updating data in table "client_billing_assignment" */
export type ClientBillingAssignmentSetInput = {
  billing_plan_id?: InputMaybe<Scalars["uuid"]["input"]>;
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  end_date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  start_date?: InputMaybe<Scalars["date"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
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
  billing_plan_id?: InputMaybe<Scalars["uuid"]["input"]>;
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  end_date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  start_date?: InputMaybe<Scalars["date"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "client_billing_assignment" */
export enum ClientBillingAssignmentUpdateColumn {
  /** column name */
  billing_plan_id = "billing_plan_id",
  /** column name */
  client_id = "client_id",
  /** column name */
  created_at = "created_at",
  /** column name */
  end_date = "end_date",
  /** column name */
  id = "id",
  /** column name */
  is_active = "is_active",
  /** column name */
  start_date = "start_date",
  /** column name */
  updated_at = "updated_at",
}

export type ClientBillingAssignmentUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ClientBillingAssignmentSetInput>;
  /** filter the rows which have to be updated */
  where: ClientBillingAssignmentBoolExp;
};

/** columns and relationships of "client_external_systems" */
export type ClientExternalSystems = {
  __typename: "client_external_systems";
  /** An object relationship */
  client: Clients;
  /** Reference to the client */
  client_id: Scalars["uuid"]["output"];
  /** Timestamp when the mapping was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** An object relationship */
  external_system: ExternalSystems;
  /** Unique identifier for the client-system mapping */
  id: Scalars["uuid"]["output"];
  /** Client identifier in the external system */
  system_client_id: Maybe<Scalars["String"]["output"]>;
  /** Reference to the external system */
  system_id: Scalars["uuid"]["output"];
  /** Timestamp when the mapping was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregated selection of "client_external_systems" */
export type ClientExternalSystemsAggregate = {
  __typename: "client_external_systems_aggregate";
  aggregate: Maybe<ClientExternalSystemsAggregateFields>;
  nodes: Array<ClientExternalSystems>;
};

export type ClientExternalSystemsAggregateBoolExp = {
  count?: InputMaybe<ClientExternalSystemsAggregateBoolExpCount>;
};

export type ClientExternalSystemsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<ClientExternalSystemsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "client_external_systems" */
export type ClientExternalSystemsAggregateFields = {
  __typename: "client_external_systems_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<ClientExternalSystemsMaxFields>;
  min: Maybe<ClientExternalSystemsMinFields>;
};

/** aggregate fields of "client_external_systems" */
export type ClientExternalSystemsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  client_external_systems_client_id_system_id_key = "client_external_systems_client_id_system_id_key",
  /** unique or primary key constraint on columns "id" */
  client_external_systems_pkey = "client_external_systems_pkey",
}

/** input type for inserting data into table "client_external_systems" */
export type ClientExternalSystemsInsertInput = {
  client?: InputMaybe<ClientsObjRelInsertInput>;
  /** Reference to the client */
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the mapping was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  external_system?: InputMaybe<ExternalSystemsObjRelInsertInput>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Client identifier in the external system */
  system_client_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Reference to the external system */
  system_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the mapping was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type ClientExternalSystemsMaxFields = {
  __typename: "client_external_systems_max_fields";
  /** Reference to the client */
  client_id: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the mapping was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Unique identifier for the client-system mapping */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Client identifier in the external system */
  system_client_id: Maybe<Scalars["String"]["output"]>;
  /** Reference to the external system */
  system_id: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the mapping was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "client_external_systems_min_fields";
  /** Reference to the client */
  client_id: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the mapping was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Unique identifier for the client-system mapping */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Client identifier in the external system */
  system_client_id: Maybe<Scalars["String"]["output"]>;
  /** Reference to the external system */
  system_id: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the mapping was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "client_external_systems_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "client_external_systems" */
export enum ClientExternalSystemsSelectColumn {
  /** column name */
  client_id = "client_id",
  /** column name */
  created_at = "created_at",
  /** column name */
  id = "id",
  /** column name */
  system_client_id = "system_client_id",
  /** column name */
  system_id = "system_id",
  /** column name */
  updated_at = "updated_at",
}

/** input type for updating data in table "client_external_systems" */
export type ClientExternalSystemsSetInput = {
  /** Reference to the client */
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the mapping was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Client identifier in the external system */
  system_client_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Reference to the external system */
  system_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the mapping was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
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
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the mapping was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Client identifier in the external system */
  system_client_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Reference to the external system */
  system_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the mapping was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "client_external_systems" */
export enum ClientExternalSystemsUpdateColumn {
  /** column name */
  client_id = "client_id",
  /** column name */
  created_at = "created_at",
  /** column name */
  id = "id",
  /** column name */
  system_client_id = "system_client_id",
  /** column name */
  system_id = "system_id",
  /** column name */
  updated_at = "updated_at",
}

export type ClientExternalSystemsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ClientExternalSystemsSetInput>;
  /** filter the rows which have to be updated */
  where: ClientExternalSystemsBoolExp;
};

/** columns and relationships of "clients" */
export type Clients = {
  __typename: "clients";
  /** Whether the client is currently active */
  active: Maybe<Scalars["Boolean"]["output"]>;
  /** An array relationship */
  billingAssignments: Array<ClientBillingAssignment>;
  /** An aggregate relationship */
  billingAssignments_aggregate: ClientBillingAssignmentAggregate;
  /** An array relationship */
  billingInvoices: Array<BillingInvoice>;
  /** An array relationship */
  billingInvoicesList: Array<BillingInvoices>;
  /** An aggregate relationship */
  billingInvoicesList_aggregate: BillingInvoicesAggregate;
  /** An aggregate relationship */
  billingInvoices_aggregate: BillingInvoiceAggregate;
  /** Email address for the client contact */
  contactEmail: Maybe<Scalars["String"]["output"]>;
  /** Primary contact person at the client */
  contactPerson: Maybe<Scalars["String"]["output"]>;
  /** Phone number for the client contact */
  contactPhone: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the client was created */
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  /** An array relationship */
  externalSystems: Array<ClientExternalSystems>;
  /** An aggregate relationship */
  externalSystems_aggregate: ClientExternalSystemsAggregate;
  /** Unique identifier for the client */
  id: Scalars["uuid"]["output"];
  /** Client company name */
  name: Scalars["String"]["output"];
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrolls_aggregate: PayrollsAggregate;
  /** Timestamp when the client was last updated */
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
};

/** columns and relationships of "clients" */
export type ClientsBillingAssignmentsArgs = {
  distinct_on?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientBillingAssignmentOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};

/** columns and relationships of "clients" */
export type ClientsBillingAssignmentsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientBillingAssignmentOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};

/** columns and relationships of "clients" */
export type ClientsBillingInvoicesArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};

/** columns and relationships of "clients" */
export type ClientsBillingInvoicesListArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoicesOrderBy>>;
  where?: InputMaybe<BillingInvoicesBoolExp>;
};

/** columns and relationships of "clients" */
export type ClientsBillingInvoicesListAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoicesOrderBy>>;
  where?: InputMaybe<BillingInvoicesBoolExp>;
};

/** columns and relationships of "clients" */
export type ClientsBillingInvoicesAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};

/** columns and relationships of "clients" */
export type ClientsExternalSystemsArgs = {
  distinct_on?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};

/** columns and relationships of "clients" */
export type ClientsExternalSystemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};

/** columns and relationships of "clients" */
export type ClientsPayrollsArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** columns and relationships of "clients" */
export type ClientsPayrollsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** aggregated selection of "clients" */
export type ClientsAggregate = {
  __typename: "clients_aggregate";
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<ClientsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ClientsAggregateBoolExpBoolOr = {
  arguments: ClientsSelectColumnClientsAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<ClientsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ClientsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<ClientsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<ClientsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "clients" */
export type ClientsAggregateFields = {
  __typename: "clients_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<ClientsMaxFields>;
  min: Maybe<ClientsMinFields>;
};

/** aggregate fields of "clients" */
export type ClientsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ClientsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  billingAssignments?: InputMaybe<ClientBillingAssignmentBoolExp>;
  billingAssignments_aggregate?: InputMaybe<ClientBillingAssignmentAggregateBoolExp>;
  billingInvoices?: InputMaybe<BillingInvoiceBoolExp>;
  billingInvoicesList?: InputMaybe<BillingInvoicesBoolExp>;
  billingInvoicesList_aggregate?: InputMaybe<BillingInvoicesAggregateBoolExp>;
  billingInvoices_aggregate?: InputMaybe<BillingInvoiceAggregateBoolExp>;
  contactEmail?: InputMaybe<StringComparisonExp>;
  contactPerson?: InputMaybe<StringComparisonExp>;
  contactPhone?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  externalSystems?: InputMaybe<ClientExternalSystemsBoolExp>;
  externalSystems_aggregate?: InputMaybe<ClientExternalSystemsAggregateBoolExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  payrolls?: InputMaybe<PayrollsBoolExp>;
  payrolls_aggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "clients" */
export enum ClientsConstraint {
  /** unique or primary key constraint on columns "id" */
  clients_pkey = "clients_pkey",
}

/** input type for inserting data into table "clients" */
export type ClientsInsertInput = {
  /** Whether the client is currently active */
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  billingAssignments?: InputMaybe<ClientBillingAssignmentArrRelInsertInput>;
  billingInvoices?: InputMaybe<BillingInvoiceArrRelInsertInput>;
  billingInvoicesList?: InputMaybe<BillingInvoicesArrRelInsertInput>;
  /** Email address for the client contact */
  contactEmail?: InputMaybe<Scalars["String"]["input"]>;
  /** Primary contact person at the client */
  contactPerson?: InputMaybe<Scalars["String"]["input"]>;
  /** Phone number for the client contact */
  contactPhone?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the client was created */
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  externalSystems?: InputMaybe<ClientExternalSystemsArrRelInsertInput>;
  /** Unique identifier for the client */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Client company name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  payrolls?: InputMaybe<PayrollsArrRelInsertInput>;
  /** Timestamp when the client was last updated */
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type ClientsMaxFields = {
  __typename: "clients_max_fields";
  /** Email address for the client contact */
  contactEmail: Maybe<Scalars["String"]["output"]>;
  /** Primary contact person at the client */
  contactPerson: Maybe<Scalars["String"]["output"]>;
  /** Phone number for the client contact */
  contactPhone: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the client was created */
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  /** Unique identifier for the client */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Client company name */
  name: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the client was last updated */
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "clients_min_fields";
  /** Email address for the client contact */
  contactEmail: Maybe<Scalars["String"]["output"]>;
  /** Primary contact person at the client */
  contactPerson: Maybe<Scalars["String"]["output"]>;
  /** Phone number for the client contact */
  contactPhone: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the client was created */
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  /** Unique identifier for the client */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Client company name */
  name: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the client was last updated */
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "clients_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  billingAssignments_aggregate?: InputMaybe<ClientBillingAssignmentAggregateOrderBy>;
  billingInvoicesList_aggregate?: InputMaybe<BillingInvoicesAggregateOrderBy>;
  billingInvoices_aggregate?: InputMaybe<BillingInvoiceAggregateOrderBy>;
  contactEmail?: InputMaybe<OrderBy>;
  contactPerson?: InputMaybe<OrderBy>;
  contactPhone?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  externalSystems_aggregate?: InputMaybe<ClientExternalSystemsAggregateOrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrolls_aggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: clients */
export type ClientsPkColumnsInput = {
  /** Unique identifier for the client */
  id: Scalars["uuid"]["input"];
};

/** select columns of table "clients" */
export enum ClientsSelectColumn {
  /** column name */
  active = "active",
  /** column name */
  contactEmail = "contactEmail",
  /** column name */
  contactPerson = "contactPerson",
  /** column name */
  contactPhone = "contactPhone",
  /** column name */
  createdAt = "createdAt",
  /** column name */
  id = "id",
  /** column name */
  name = "name",
  /** column name */
  updatedAt = "updatedAt",
}

/** select "clients_aggregate_bool_exp_bool_and_arguments_columns" columns of table "clients" */
export enum ClientsSelectColumnClientsAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  active = "active",
}

/** select "clients_aggregate_bool_exp_bool_or_arguments_columns" columns of table "clients" */
export enum ClientsSelectColumnClientsAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  active = "active",
}

/** input type for updating data in table "clients" */
export type ClientsSetInput = {
  /** Whether the client is currently active */
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Email address for the client contact */
  contactEmail?: InputMaybe<Scalars["String"]["input"]>;
  /** Primary contact person at the client */
  contactPerson?: InputMaybe<Scalars["String"]["input"]>;
  /** Phone number for the client contact */
  contactPhone?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the client was created */
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Unique identifier for the client */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Client company name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the client was last updated */
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
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
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Email address for the client contact */
  contactEmail?: InputMaybe<Scalars["String"]["input"]>;
  /** Primary contact person at the client */
  contactPerson?: InputMaybe<Scalars["String"]["input"]>;
  /** Phone number for the client contact */
  contactPhone?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the client was created */
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Unique identifier for the client */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Client company name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the client was last updated */
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "clients" */
export enum ClientsUpdateColumn {
  /** column name */
  active = "active",
  /** column name */
  contactEmail = "contactEmail",
  /** column name */
  contactPerson = "contactPerson",
  /** column name */
  contactPhone = "contactPhone",
  /** column name */
  createdAt = "createdAt",
  /** column name */
  id = "id",
  /** column name */
  name = "name",
  /** column name */
  updatedAt = "updatedAt",
}

export type ClientsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ClientsSetInput>;
  /** filter the rows which have to be updated */
  where: ClientsBoolExp;
};

export type CreatePayrollVersionArgs = {
  p_created_by_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  p_go_live_date?: InputMaybe<Scalars["date"]["input"]>;
  p_new_backup_consultant_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  p_new_client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  p_new_cycle_id?: InputMaybe<Scalars["uuid"]["input"]>;
  p_new_date_type_id?: InputMaybe<Scalars["uuid"]["input"]>;
  p_new_date_value?: InputMaybe<Scalars["Int"]["input"]>;
  p_new_manager_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  p_new_name?: InputMaybe<Scalars["String"]["input"]>;
  p_new_primary_consultant_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  p_original_payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  p_version_reason?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreatePayrollVersionSimpleArgs = {
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  version_reason?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "current_payrolls" */
export type CurrentPayrolls = {
  __typename: "current_payrolls";
  backup_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  client_id: Maybe<Scalars["uuid"]["output"]>;
  client_name: Maybe<Scalars["String"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  cycle_id: Maybe<Scalars["uuid"]["output"]>;
  date_type_id: Maybe<Scalars["uuid"]["output"]>;
  date_value: Maybe<Scalars["Int"]["output"]>;
  go_live_date: Maybe<Scalars["date"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  manager_user_id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  parent_payroll_id: Maybe<Scalars["uuid"]["output"]>;
  payroll_cycle_name: Maybe<Scalars["payroll_cycle_type"]["output"]>;
  payroll_date_type_name: Maybe<Scalars["payroll_date_type"]["output"]>;
  primary_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  superseded_date: Maybe<Scalars["date"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
  version_reason: Maybe<Scalars["String"]["output"]>;
};

/** aggregated selection of "current_payrolls" */
export type CurrentPayrollsAggregate = {
  __typename: "current_payrolls_aggregate";
  aggregate: Maybe<CurrentPayrollsAggregateFields>;
  nodes: Array<CurrentPayrolls>;
};

/** aggregate fields of "current_payrolls" */
export type CurrentPayrollsAggregateFields = {
  __typename: "current_payrolls_aggregate_fields";
  avg: Maybe<CurrentPayrollsAvgFields>;
  count: Scalars["Int"]["output"];
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type CurrentPayrollsAvgFields = {
  __typename: "current_payrolls_avg_fields";
  date_value: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
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
  __typename: "current_payrolls_max_fields";
  backup_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  client_id: Maybe<Scalars["uuid"]["output"]>;
  client_name: Maybe<Scalars["String"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  cycle_id: Maybe<Scalars["uuid"]["output"]>;
  date_type_id: Maybe<Scalars["uuid"]["output"]>;
  date_value: Maybe<Scalars["Int"]["output"]>;
  go_live_date: Maybe<Scalars["date"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  manager_user_id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  parent_payroll_id: Maybe<Scalars["uuid"]["output"]>;
  payroll_cycle_name: Maybe<Scalars["payroll_cycle_type"]["output"]>;
  payroll_date_type_name: Maybe<Scalars["payroll_date_type"]["output"]>;
  primary_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  superseded_date: Maybe<Scalars["date"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
  version_reason: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type CurrentPayrollsMinFields = {
  __typename: "current_payrolls_min_fields";
  backup_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  client_id: Maybe<Scalars["uuid"]["output"]>;
  client_name: Maybe<Scalars["String"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  cycle_id: Maybe<Scalars["uuid"]["output"]>;
  date_type_id: Maybe<Scalars["uuid"]["output"]>;
  date_value: Maybe<Scalars["Int"]["output"]>;
  go_live_date: Maybe<Scalars["date"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  manager_user_id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  parent_payroll_id: Maybe<Scalars["uuid"]["output"]>;
  payroll_cycle_name: Maybe<Scalars["payroll_cycle_type"]["output"]>;
  payroll_date_type_name: Maybe<Scalars["payroll_date_type"]["output"]>;
  primary_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  superseded_date: Maybe<Scalars["date"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
  version_reason: Maybe<Scalars["String"]["output"]>;
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
  backup_consultant_user_id = "backup_consultant_user_id",
  /** column name */
  client_id = "client_id",
  /** column name */
  client_name = "client_name",
  /** column name */
  created_at = "created_at",
  /** column name */
  cycle_id = "cycle_id",
  /** column name */
  date_type_id = "date_type_id",
  /** column name */
  date_value = "date_value",
  /** column name */
  go_live_date = "go_live_date",
  /** column name */
  id = "id",
  /** column name */
  manager_user_id = "manager_user_id",
  /** column name */
  name = "name",
  /** column name */
  parent_payroll_id = "parent_payroll_id",
  /** column name */
  payroll_cycle_name = "payroll_cycle_name",
  /** column name */
  payroll_date_type_name = "payroll_date_type_name",
  /** column name */
  primary_consultant_user_id = "primary_consultant_user_id",
  /** column name */
  superseded_date = "superseded_date",
  /** column name */
  updated_at = "updated_at",
  /** column name */
  version_number = "version_number",
  /** column name */
  version_reason = "version_reason",
}

/** aggregate stddev on columns */
export type CurrentPayrollsStddevFields = {
  __typename: "current_payrolls_stddev_fields";
  date_value: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type CurrentPayrollsStddevPopFields = {
  __typename: "current_payrolls_stddev_pop_fields";
  date_value: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type CurrentPayrollsStddevSampFields = {
  __typename: "current_payrolls_stddev_samp_fields";
  date_value: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
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
  backup_consultant_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  client_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  cycle_id?: InputMaybe<Scalars["uuid"]["input"]>;
  date_type_id?: InputMaybe<Scalars["uuid"]["input"]>;
  date_value?: InputMaybe<Scalars["Int"]["input"]>;
  go_live_date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  manager_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  parent_payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll_cycle_name?: InputMaybe<Scalars["payroll_cycle_type"]["input"]>;
  payroll_date_type_name?: InputMaybe<Scalars["payroll_date_type"]["input"]>;
  primary_consultant_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  superseded_date?: InputMaybe<Scalars["date"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
  version_reason?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate sum on columns */
export type CurrentPayrollsSumFields = {
  __typename: "current_payrolls_sum_fields";
  date_value: Maybe<Scalars["Int"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
};

/** aggregate var_pop on columns */
export type CurrentPayrollsVarPopFields = {
  __typename: "current_payrolls_var_pop_fields";
  date_value: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type CurrentPayrollsVarSampFields = {
  __typename: "current_payrolls_var_samp_fields";
  date_value: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type CurrentPayrollsVarianceFields = {
  __typename: "current_payrolls_variance_fields";
  date_value: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** ordering argument of a cursor */
export enum CursorOrdering {
  /** ascending ordering of the cursor */
  ASC = "ASC",
  /** descending ordering of the cursor */
  DESC = "DESC",
}

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type DateComparisonExp = {
  _eq?: InputMaybe<Scalars["date"]["input"]>;
  _gt?: InputMaybe<Scalars["date"]["input"]>;
  _gte?: InputMaybe<Scalars["date"]["input"]>;
  _in?: InputMaybe<Array<Scalars["date"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["date"]["input"]>;
  _lte?: InputMaybe<Scalars["date"]["input"]>;
  _neq?: InputMaybe<Scalars["date"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["date"]["input"]>>;
};

/** columns and relationships of "external_systems" */
export type ExternalSystems = {
  __typename: "external_systems";
  /** An array relationship */
  client_external_systems: Array<ClientExternalSystems>;
  /** An aggregate relationship */
  client_external_systems_aggregate: ClientExternalSystemsAggregate;
  /** Timestamp when the system was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Description of the external system and its purpose */
  description: Maybe<Scalars["String"]["output"]>;
  /** Path or reference to the system icon */
  icon: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the external system */
  id: Scalars["uuid"]["output"];
  /** Name of the external system */
  name: Scalars["String"]["output"];
  /** Timestamp when the system was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** URL endpoint for the external system */
  url: Scalars["String"]["output"];
};

/** columns and relationships of "external_systems" */
export type ExternalSystemsClientExternalSystemsArgs = {
  distinct_on?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};

/** columns and relationships of "external_systems" */
export type ExternalSystemsClientExternalSystemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};

/** aggregated selection of "external_systems" */
export type ExternalSystemsAggregate = {
  __typename: "external_systems_aggregate";
  aggregate: Maybe<ExternalSystemsAggregateFields>;
  nodes: Array<ExternalSystems>;
};

/** aggregate fields of "external_systems" */
export type ExternalSystemsAggregateFields = {
  __typename: "external_systems_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<ExternalSystemsMaxFields>;
  min: Maybe<ExternalSystemsMinFields>;
};

/** aggregate fields of "external_systems" */
export type ExternalSystemsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  external_systems_pkey = "external_systems_pkey",
}

/** input type for inserting data into table "external_systems" */
export type ExternalSystemsInsertInput = {
  client_external_systems?: InputMaybe<ClientExternalSystemsArrRelInsertInput>;
  /** Timestamp when the system was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Description of the external system and its purpose */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Path or reference to the system icon */
  icon?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the external system */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Name of the external system */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the system was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** URL endpoint for the external system */
  url?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type ExternalSystemsMaxFields = {
  __typename: "external_systems_max_fields";
  /** Timestamp when the system was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Description of the external system and its purpose */
  description: Maybe<Scalars["String"]["output"]>;
  /** Path or reference to the system icon */
  icon: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the external system */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Name of the external system */
  name: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the system was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** URL endpoint for the external system */
  url: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type ExternalSystemsMinFields = {
  __typename: "external_systems_min_fields";
  /** Timestamp when the system was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Description of the external system and its purpose */
  description: Maybe<Scalars["String"]["output"]>;
  /** Path or reference to the system icon */
  icon: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the external system */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Name of the external system */
  name: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the system was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** URL endpoint for the external system */
  url: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "external_systems" */
export type ExternalSystemsMutationResponse = {
  __typename: "external_systems_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "external_systems" */
export enum ExternalSystemsSelectColumn {
  /** column name */
  created_at = "created_at",
  /** column name */
  description = "description",
  /** column name */
  icon = "icon",
  /** column name */
  id = "id",
  /** column name */
  name = "name",
  /** column name */
  updated_at = "updated_at",
  /** column name */
  url = "url",
}

/** input type for updating data in table "external_systems" */
export type ExternalSystemsSetInput = {
  /** Timestamp when the system was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Description of the external system and its purpose */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Path or reference to the system icon */
  icon?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the external system */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Name of the external system */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the system was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** URL endpoint for the external system */
  url?: InputMaybe<Scalars["String"]["input"]>;
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
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Description of the external system and its purpose */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Path or reference to the system icon */
  icon?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the external system */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Name of the external system */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the system was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** URL endpoint for the external system */
  url?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "external_systems" */
export enum ExternalSystemsUpdateColumn {
  /** column name */
  created_at = "created_at",
  /** column name */
  description = "description",
  /** column name */
  icon = "icon",
  /** column name */
  id = "id",
  /** column name */
  name = "name",
  /** column name */
  updated_at = "updated_at",
  /** column name */
  url = "url",
}

export type ExternalSystemsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ExternalSystemsSetInput>;
  /** filter the rows which have to be updated */
  where: ExternalSystemsBoolExp;
};

/** columns and relationships of "feature_flags" */
export type FeatureFlags = {
  __typename: "feature_flags";
  /** JSON array of roles that can access this feature */
  allowed_roles: Scalars["jsonb"]["output"];
  /** Name of the feature controlled by this flag */
  feature_name: Scalars["String"]["output"];
  /** Unique identifier for the feature flag */
  id: Scalars["uuid"]["output"];
  /** Whether the feature is currently enabled */
  is_enabled: Maybe<Scalars["Boolean"]["output"]>;
  /** Timestamp when the feature flag was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** columns and relationships of "feature_flags" */
export type FeatureFlagsAllowedRolesArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "feature_flags" */
export type FeatureFlagsAggregate = {
  __typename: "feature_flags_aggregate";
  aggregate: Maybe<FeatureFlagsAggregateFields>;
  nodes: Array<FeatureFlags>;
};

/** aggregate fields of "feature_flags" */
export type FeatureFlagsAggregateFields = {
  __typename: "feature_flags_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<FeatureFlagsMaxFields>;
  min: Maybe<FeatureFlagsMinFields>;
};

/** aggregate fields of "feature_flags" */
export type FeatureFlagsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type FeatureFlagsAppendInput = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Scalars["jsonb"]["input"]>;
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
  feature_flags_feature_name_key = "feature_flags_feature_name_key",
  /** unique or primary key constraint on columns "id" */
  feature_flags_pkey = "feature_flags_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type FeatureFlagsDeleteAtPathInput = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type FeatureFlagsDeleteElemInput = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type FeatureFlagsDeleteKeyInput = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "feature_flags" */
export type FeatureFlagsInsertInput = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Name of the feature controlled by this flag */
  feature_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the feature flag */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Whether the feature is currently enabled */
  is_enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Timestamp when the feature flag was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type FeatureFlagsMaxFields = {
  __typename: "feature_flags_max_fields";
  /** Name of the feature controlled by this flag */
  feature_name: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the feature flag */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the feature flag was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type FeatureFlagsMinFields = {
  __typename: "feature_flags_min_fields";
  /** Name of the feature controlled by this flag */
  feature_name: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the feature flag */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the feature flag was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "feature_flags" */
export type FeatureFlagsMutationResponse = {
  __typename: "feature_flags_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type FeatureFlagsPrependInput = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "feature_flags" */
export enum FeatureFlagsSelectColumn {
  /** column name */
  allowed_roles = "allowed_roles",
  /** column name */
  feature_name = "feature_name",
  /** column name */
  id = "id",
  /** column name */
  is_enabled = "is_enabled",
  /** column name */
  updated_at = "updated_at",
}

/** input type for updating data in table "feature_flags" */
export type FeatureFlagsSetInput = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Name of the feature controlled by this flag */
  feature_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the feature flag */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Whether the feature is currently enabled */
  is_enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Timestamp when the feature flag was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
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
  allowed_roles?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Name of the feature controlled by this flag */
  feature_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the feature flag */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Whether the feature is currently enabled */
  is_enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Timestamp when the feature flag was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "feature_flags" */
export enum FeatureFlagsUpdateColumn {
  /** column name */
  allowed_roles = "allowed_roles",
  /** column name */
  feature_name = "feature_name",
  /** column name */
  id = "id",
  /** column name */
  is_enabled = "is_enabled",
  /** column name */
  updated_at = "updated_at",
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
  p_end_date?: InputMaybe<Scalars["date"]["input"]>;
  p_max_dates?: InputMaybe<Scalars["Int"]["input"]>;
  p_payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  p_start_date?: InputMaybe<Scalars["date"]["input"]>;
};

export type GetLatestPayrollVersionArgs = {
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

export type GetPayrollVersionHistoryArgs = {
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** columns and relationships of "holidays" */
export type Holidays = {
  __typename: "holidays";
  /** ISO country code where the holiday is observed */
  country_code: Scalars["bpchar"]["output"];
  /** Timestamp when the holiday record was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Date of the holiday */
  date: Scalars["date"]["output"];
  /** Unique identifier for the holiday */
  id: Scalars["uuid"]["output"];
  /** Whether the holiday occurs on the same date each year */
  is_fixed: Maybe<Scalars["Boolean"]["output"]>;
  /** Whether the holiday is observed globally */
  is_global: Maybe<Scalars["Boolean"]["output"]>;
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Int"]["output"]>;
  /** Name of the holiday in local language */
  local_name: Scalars["String"]["output"];
  /** Name of the holiday in English */
  name: Scalars["String"]["output"];
  /** Array of regions within the country where the holiday applies */
  region: Maybe<Array<Scalars["String"]["output"]>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types: Array<Scalars["String"]["output"]>;
  /** Timestamp when the holiday record was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregated selection of "holidays" */
export type HolidaysAggregate = {
  __typename: "holidays_aggregate";
  aggregate: Maybe<HolidaysAggregateFields>;
  nodes: Array<Holidays>;
};

/** aggregate fields of "holidays" */
export type HolidaysAggregateFields = {
  __typename: "holidays_aggregate_fields";
  avg: Maybe<HolidaysAvgFields>;
  count: Scalars["Int"]["output"];
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type HolidaysAvgFields = {
  __typename: "holidays_avg_fields";
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Float"]["output"]>;
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
  holidays_pkey = "holidays_pkey",
}

/** input type for incrementing numeric columns in table "holidays" */
export type HolidaysIncInput = {
  /** First year when the holiday was observed */
  launch_year?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "holidays" */
export type HolidaysInsertInput = {
  /** ISO country code where the holiday is observed */
  country_code?: InputMaybe<Scalars["bpchar"]["input"]>;
  /** Timestamp when the holiday record was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Date of the holiday */
  date?: InputMaybe<Scalars["date"]["input"]>;
  /** Unique identifier for the holiday */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Whether the holiday occurs on the same date each year */
  is_fixed?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether the holiday is observed globally */
  is_global?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** First year when the holiday was observed */
  launch_year?: InputMaybe<Scalars["Int"]["input"]>;
  /** Name of the holiday in local language */
  local_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Name of the holiday in English */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Array of regions within the country where the holiday applies */
  region?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Timestamp when the holiday record was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type HolidaysMaxFields = {
  __typename: "holidays_max_fields";
  /** ISO country code where the holiday is observed */
  country_code: Maybe<Scalars["bpchar"]["output"]>;
  /** Timestamp when the holiday record was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Date of the holiday */
  date: Maybe<Scalars["date"]["output"]>;
  /** Unique identifier for the holiday */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Int"]["output"]>;
  /** Name of the holiday in local language */
  local_name: Maybe<Scalars["String"]["output"]>;
  /** Name of the holiday in English */
  name: Maybe<Scalars["String"]["output"]>;
  /** Array of regions within the country where the holiday applies */
  region: Maybe<Array<Scalars["String"]["output"]>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types: Maybe<Array<Scalars["String"]["output"]>>;
  /** Timestamp when the holiday record was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type HolidaysMinFields = {
  __typename: "holidays_min_fields";
  /** ISO country code where the holiday is observed */
  country_code: Maybe<Scalars["bpchar"]["output"]>;
  /** Timestamp when the holiday record was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Date of the holiday */
  date: Maybe<Scalars["date"]["output"]>;
  /** Unique identifier for the holiday */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Int"]["output"]>;
  /** Name of the holiday in local language */
  local_name: Maybe<Scalars["String"]["output"]>;
  /** Name of the holiday in English */
  name: Maybe<Scalars["String"]["output"]>;
  /** Array of regions within the country where the holiday applies */
  region: Maybe<Array<Scalars["String"]["output"]>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types: Maybe<Array<Scalars["String"]["output"]>>;
  /** Timestamp when the holiday record was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "holidays" */
export type HolidaysMutationResponse = {
  __typename: "holidays_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "holidays" */
export enum HolidaysSelectColumn {
  /** column name */
  country_code = "country_code",
  /** column name */
  created_at = "created_at",
  /** column name */
  date = "date",
  /** column name */
  id = "id",
  /** column name */
  is_fixed = "is_fixed",
  /** column name */
  is_global = "is_global",
  /** column name */
  launch_year = "launch_year",
  /** column name */
  local_name = "local_name",
  /** column name */
  name = "name",
  /** column name */
  region = "region",
  /** column name */
  types = "types",
  /** column name */
  updated_at = "updated_at",
}

/** input type for updating data in table "holidays" */
export type HolidaysSetInput = {
  /** ISO country code where the holiday is observed */
  country_code?: InputMaybe<Scalars["bpchar"]["input"]>;
  /** Timestamp when the holiday record was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Date of the holiday */
  date?: InputMaybe<Scalars["date"]["input"]>;
  /** Unique identifier for the holiday */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Whether the holiday occurs on the same date each year */
  is_fixed?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether the holiday is observed globally */
  is_global?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** First year when the holiday was observed */
  launch_year?: InputMaybe<Scalars["Int"]["input"]>;
  /** Name of the holiday in local language */
  local_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Name of the holiday in English */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Array of regions within the country where the holiday applies */
  region?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Timestamp when the holiday record was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate stddev on columns */
export type HolidaysStddevFields = {
  __typename: "holidays_stddev_fields";
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type HolidaysStddevPopFields = {
  __typename: "holidays_stddev_pop_fields";
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type HolidaysStddevSampFields = {
  __typename: "holidays_stddev_samp_fields";
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Float"]["output"]>;
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
  country_code?: InputMaybe<Scalars["bpchar"]["input"]>;
  /** Timestamp when the holiday record was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Date of the holiday */
  date?: InputMaybe<Scalars["date"]["input"]>;
  /** Unique identifier for the holiday */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Whether the holiday occurs on the same date each year */
  is_fixed?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether the holiday is observed globally */
  is_global?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** First year when the holiday was observed */
  launch_year?: InputMaybe<Scalars["Int"]["input"]>;
  /** Name of the holiday in local language */
  local_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Name of the holiday in English */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Array of regions within the country where the holiday applies */
  region?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Array of holiday types (e.g., public, bank, religious) */
  types?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Timestamp when the holiday record was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate sum on columns */
export type HolidaysSumFields = {
  __typename: "holidays_sum_fields";
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Int"]["output"]>;
};

/** update columns of table "holidays" */
export enum HolidaysUpdateColumn {
  /** column name */
  country_code = "country_code",
  /** column name */
  created_at = "created_at",
  /** column name */
  date = "date",
  /** column name */
  id = "id",
  /** column name */
  is_fixed = "is_fixed",
  /** column name */
  is_global = "is_global",
  /** column name */
  launch_year = "launch_year",
  /** column name */
  local_name = "local_name",
  /** column name */
  name = "name",
  /** column name */
  region = "region",
  /** column name */
  types = "types",
  /** column name */
  updated_at = "updated_at",
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
  __typename: "holidays_var_pop_fields";
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type HolidaysVarSampFields = {
  __typename: "holidays_var_samp_fields";
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type HolidaysVarianceFields = {
  __typename: "holidays_variance_fields";
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to compare columns of type "inet". All fields are combined with logical 'AND'. */
export type InetComparisonExp = {
  _eq?: InputMaybe<Scalars["inet"]["input"]>;
  _gt?: InputMaybe<Scalars["inet"]["input"]>;
  _gte?: InputMaybe<Scalars["inet"]["input"]>;
  _in?: InputMaybe<Array<Scalars["inet"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["inet"]["input"]>;
  _lte?: InputMaybe<Scalars["inet"]["input"]>;
  _neq?: InputMaybe<Scalars["inet"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["inet"]["input"]>>;
};

/** Boolean expression to compare columns of type "interval". All fields are combined with logical 'AND'. */
export type IntervalComparisonExp = {
  _eq?: InputMaybe<Scalars["interval"]["input"]>;
  _gt?: InputMaybe<Scalars["interval"]["input"]>;
  _gte?: InputMaybe<Scalars["interval"]["input"]>;
  _in?: InputMaybe<Array<Scalars["interval"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["interval"]["input"]>;
  _lte?: InputMaybe<Scalars["interval"]["input"]>;
  _neq?: InputMaybe<Scalars["interval"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["interval"]["input"]>>;
};

export type JsonbCastExp = {
  String?: InputMaybe<StringComparisonExp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type JsonbComparisonExp = {
  _cast?: InputMaybe<JsonbCastExp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars["jsonb"]["input"]>;
  _eq?: InputMaybe<Scalars["jsonb"]["input"]>;
  _gt?: InputMaybe<Scalars["jsonb"]["input"]>;
  _gte?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars["String"]["input"]>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars["String"]["input"]>>;
  _in?: InputMaybe<Array<Scalars["jsonb"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["jsonb"]["input"]>;
  _lte?: InputMaybe<Scalars["jsonb"]["input"]>;
  _neq?: InputMaybe<Scalars["jsonb"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["jsonb"]["input"]>>;
};

/** columns and relationships of "latest_payroll_version_results" */
export type LatestPayrollVersionResults = {
  __typename: "latest_payroll_version_results";
  active: Scalars["Boolean"]["output"];
  go_live_date: Maybe<Scalars["date"]["output"]>;
  id: Scalars["uuid"]["output"];
  name: Scalars["String"]["output"];
  payroll_id: Scalars["uuid"]["output"];
  queried_at: Maybe<Scalars["timestamptz"]["output"]>;
  version_number: Scalars["Int"]["output"];
};

export type LatestPayrollVersionResultsAggregate = {
  __typename: "latest_payroll_version_results_aggregate";
  aggregate: Maybe<LatestPayrollVersionResultsAggregateFields>;
  nodes: Array<LatestPayrollVersionResults>;
};

/** aggregate fields of "latest_payroll_version_results" */
export type LatestPayrollVersionResultsAggregateFields = {
  __typename: "latest_payroll_version_results_aggregate_fields";
  avg: Maybe<LatestPayrollVersionResultsAvgFields>;
  count: Scalars["Int"]["output"];
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type LatestPayrollVersionResultsAvgFields = {
  __typename: "latest_payroll_version_results_avg_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
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
  latest_payroll_version_results_pkey = "latest_payroll_version_results_pkey",
}

/** input type for incrementing numeric columns in table "latest_payroll_version_results" */
export type LatestPayrollVersionResultsIncInput = {
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "latest_payroll_version_results" */
export type LatestPayrollVersionResultsInsertInput = {
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  go_live_date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  queried_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate max on columns */
export type LatestPayrollVersionResultsMaxFields = {
  __typename: "latest_payroll_version_results_max_fields";
  go_live_date: Maybe<Scalars["date"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  payroll_id: Maybe<Scalars["uuid"]["output"]>;
  queried_at: Maybe<Scalars["timestamptz"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
};

/** aggregate min on columns */
export type LatestPayrollVersionResultsMinFields = {
  __typename: "latest_payroll_version_results_min_fields";
  go_live_date: Maybe<Scalars["date"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  payroll_id: Maybe<Scalars["uuid"]["output"]>;
  queried_at: Maybe<Scalars["timestamptz"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
};

/** response of any mutation on the table "latest_payroll_version_results" */
export type LatestPayrollVersionResultsMutationResponse = {
  __typename: "latest_payroll_version_results_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "latest_payroll_version_results" */
export enum LatestPayrollVersionResultsSelectColumn {
  /** column name */
  active = "active",
  /** column name */
  go_live_date = "go_live_date",
  /** column name */
  id = "id",
  /** column name */
  name = "name",
  /** column name */
  payroll_id = "payroll_id",
  /** column name */
  queried_at = "queried_at",
  /** column name */
  version_number = "version_number",
}

/** input type for updating data in table "latest_payroll_version_results" */
export type LatestPayrollVersionResultsSetInput = {
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  go_live_date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  queried_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate stddev on columns */
export type LatestPayrollVersionResultsStddevFields = {
  __typename: "latest_payroll_version_results_stddev_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type LatestPayrollVersionResultsStddevPopFields = {
  __typename: "latest_payroll_version_results_stddev_pop_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type LatestPayrollVersionResultsStddevSampFields = {
  __typename: "latest_payroll_version_results_stddev_samp_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
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
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  go_live_date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  queried_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate sum on columns */
export type LatestPayrollVersionResultsSumFields = {
  __typename: "latest_payroll_version_results_sum_fields";
  version_number: Maybe<Scalars["Int"]["output"]>;
};

/** update columns of table "latest_payroll_version_results" */
export enum LatestPayrollVersionResultsUpdateColumn {
  /** column name */
  active = "active",
  /** column name */
  go_live_date = "go_live_date",
  /** column name */
  id = "id",
  /** column name */
  name = "name",
  /** column name */
  payroll_id = "payroll_id",
  /** column name */
  queried_at = "queried_at",
  /** column name */
  version_number = "version_number",
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
  __typename: "latest_payroll_version_results_var_pop_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type LatestPayrollVersionResultsVarSampFields = {
  __typename: "latest_payroll_version_results_var_samp_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type LatestPayrollVersionResultsVarianceFields = {
  __typename: "latest_payroll_version_results_variance_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "leave" */
export type Leave = {
  __typename: "leave";
  /** Last day of the leave period */
  endDate: Scalars["date"]["output"];
  /** Unique identifier for the leave record */
  id: Scalars["uuid"]["output"];
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType: Scalars["String"]["output"];
  /** An object relationship */
  leave_user: Users;
  /** Reason provided for the leave request */
  reason: Maybe<Scalars["String"]["output"]>;
  /** First day of the leave period */
  startDate: Scalars["date"]["output"];
  /** Current status of the leave request (Pending, Approved, Denied) */
  status: Maybe<Scalars["leave_status_enum"]["output"]>;
  /** An object relationship */
  user: Users;
  /** Reference to the user taking leave */
  userId: Scalars["uuid"]["output"];
};

/** aggregated selection of "leave" */
export type LeaveAggregate = {
  __typename: "leave_aggregate";
  aggregate: Maybe<LeaveAggregateFields>;
  nodes: Array<Leave>;
};

export type LeaveAggregateBoolExp = {
  count?: InputMaybe<LeaveAggregateBoolExpCount>;
};

export type LeaveAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<LeaveSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<LeaveBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "leave" */
export type LeaveAggregateFields = {
  __typename: "leave_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<LeaveMaxFields>;
  min: Maybe<LeaveMinFields>;
};

/** aggregate fields of "leave" */
export type LeaveAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<LeaveSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  endDate?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  leaveType?: InputMaybe<StringComparisonExp>;
  leave_user?: InputMaybe<UsersBoolExp>;
  reason?: InputMaybe<StringComparisonExp>;
  startDate?: InputMaybe<DateComparisonExp>;
  status?: InputMaybe<LeaveStatusEnumComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "leave" */
export enum LeaveConstraint {
  /** unique or primary key constraint on columns "id" */
  leave_pkey = "leave_pkey",
}

/** input type for inserting data into table "leave" */
export type LeaveInsertInput = {
  /** Last day of the leave period */
  endDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType?: InputMaybe<Scalars["String"]["input"]>;
  leave_user?: InputMaybe<UsersObjRelInsertInput>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<Scalars["String"]["input"]>;
  /** First day of the leave period */
  startDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<Scalars["leave_status_enum"]["input"]>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  /** Reference to the user taking leave */
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type LeaveMaxFields = {
  __typename: "leave_max_fields";
  /** Last day of the leave period */
  endDate: Maybe<Scalars["date"]["output"]>;
  /** Unique identifier for the leave record */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType: Maybe<Scalars["String"]["output"]>;
  /** Reason provided for the leave request */
  reason: Maybe<Scalars["String"]["output"]>;
  /** First day of the leave period */
  startDate: Maybe<Scalars["date"]["output"]>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status: Maybe<Scalars["leave_status_enum"]["output"]>;
  /** Reference to the user taking leave */
  userId: Maybe<Scalars["uuid"]["output"]>;
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
  __typename: "leave_min_fields";
  /** Last day of the leave period */
  endDate: Maybe<Scalars["date"]["output"]>;
  /** Unique identifier for the leave record */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType: Maybe<Scalars["String"]["output"]>;
  /** Reason provided for the leave request */
  reason: Maybe<Scalars["String"]["output"]>;
  /** First day of the leave period */
  startDate: Maybe<Scalars["date"]["output"]>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status: Maybe<Scalars["leave_status_enum"]["output"]>;
  /** Reference to the user taking leave */
  userId: Maybe<Scalars["uuid"]["output"]>;
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
  __typename: "leave_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  endDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  leaveType?: InputMaybe<OrderBy>;
  leave_user?: InputMaybe<UsersOrderBy>;
  reason?: InputMaybe<OrderBy>;
  startDate?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: leave */
export type LeavePkColumnsInput = {
  /** Unique identifier for the leave record */
  id: Scalars["uuid"]["input"];
};

/** select columns of table "leave" */
export enum LeaveSelectColumn {
  /** column name */
  endDate = "endDate",
  /** column name */
  id = "id",
  /** column name */
  leaveType = "leaveType",
  /** column name */
  reason = "reason",
  /** column name */
  startDate = "startDate",
  /** column name */
  status = "status",
  /** column name */
  userId = "userId",
}

/** input type for updating data in table "leave" */
export type LeaveSetInput = {
  /** Last day of the leave period */
  endDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType?: InputMaybe<Scalars["String"]["input"]>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<Scalars["String"]["input"]>;
  /** First day of the leave period */
  startDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<Scalars["leave_status_enum"]["input"]>;
  /** Reference to the user taking leave */
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Boolean expression to compare columns of type "leave_status_enum". All fields are combined with logical 'AND'. */
export type LeaveStatusEnumComparisonExp = {
  _eq?: InputMaybe<Scalars["leave_status_enum"]["input"]>;
  _gt?: InputMaybe<Scalars["leave_status_enum"]["input"]>;
  _gte?: InputMaybe<Scalars["leave_status_enum"]["input"]>;
  _in?: InputMaybe<Array<Scalars["leave_status_enum"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["leave_status_enum"]["input"]>;
  _lte?: InputMaybe<Scalars["leave_status_enum"]["input"]>;
  _neq?: InputMaybe<Scalars["leave_status_enum"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["leave_status_enum"]["input"]>>;
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
  endDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType?: InputMaybe<Scalars["String"]["input"]>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<Scalars["String"]["input"]>;
  /** First day of the leave period */
  startDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<Scalars["leave_status_enum"]["input"]>;
  /** Reference to the user taking leave */
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "leave" */
export enum LeaveUpdateColumn {
  /** column name */
  endDate = "endDate",
  /** column name */
  id = "id",
  /** column name */
  leaveType = "leaveType",
  /** column name */
  reason = "reason",
  /** column name */
  startDate = "startDate",
  /** column name */
  status = "status",
  /** column name */
  userId = "userId",
}

export type LeaveUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<LeaveSetInput>;
  /** filter the rows which have to be updated */
  where: LeaveBoolExp;
};

/** mutation root */
export type MutationRoot = {
  __typename: "mutation_root";
  /** Check for suspicious activity patterns */
  checkSuspiciousActivity: Maybe<SuspiciousActivityResponse>;
  commitPayrollAssignments: Maybe<CommitPayrollAssignmentsOutput>;
  /** delete single row from the table: "audit.audit_log" */
  deleteAuditLog: Maybe<AuditAuditLog>;
  /** delete data from the table: "audit.audit_log" */
  deleteAuditLogs: Maybe<AuditAuditLogMutationResponse>;
  /** delete single row from the table: "audit.auth_events" */
  deleteAuthEvent: Maybe<AuditAuthEvents>;
  /** delete data from the table: "audit.auth_events" */
  deleteAuthEvents: Maybe<AuditAuthEventsMutationResponse>;
  /** delete single row from the table: "clients" */
  deleteClient: Maybe<Clients>;
  /** delete data from the table: "clients" */
  deleteClients: Maybe<ClientsMutationResponse>;
  /** delete single row from the table: "audit.data_access_log" */
  deleteDataAccessLog: Maybe<AuditDataAccessLog>;
  /** delete data from the table: "audit.data_access_log" */
  deleteDataAccessLogs: Maybe<AuditDataAccessLogMutationResponse>;
  /** delete single row from the table: "leave" */
  deleteLeave: Maybe<Leave>;
  /** delete data from the table: "leave" */
  deleteLeaves: Maybe<LeaveMutationResponse>;
  /** delete single row from the table: "payrolls" */
  deletePayroll: Maybe<Payrolls>;
  /** delete single row from the table: "payroll_assignments" */
  deletePayrollAssignment: Maybe<PayrollAssignments>;
  /** delete data from the table: "payroll_assignments" */
  deletePayrollAssignments: Maybe<PayrollAssignmentsMutationResponse>;
  /** delete single row from the table: "payroll_dates" */
  deletePayrollDate: Maybe<PayrollDates>;
  /** delete data from the table: "payroll_dates" */
  deletePayrollDates: Maybe<PayrollDatesMutationResponse>;
  /** delete data from the table: "payrolls" */
  deletePayrolls: Maybe<PayrollsMutationResponse>;
  /** delete single row from the table: "permissions" */
  deletePermission: Maybe<Permissions>;
  /** delete single row from the table: "permission_audit_log" */
  deletePermissionAuditLog: Maybe<PermissionAuditLog>;
  /** delete data from the table: "permission_audit_log" */
  deletePermissionAuditLogs: Maybe<PermissionAuditLogMutationResponse>;
  /** delete single row from the table: "audit.permission_changes" */
  deletePermissionChange: Maybe<AuditPermissionChanges>;
  /** delete data from the table: "audit.permission_changes" */
  deletePermissionChanges: Maybe<AuditPermissionChangesMutationResponse>;
  /** delete single row from the table: "permission_overrides" */
  deletePermissionOverride: Maybe<PermissionOverrides>;
  /** delete data from the table: "permission_overrides" */
  deletePermissionOverrides: Maybe<PermissionOverridesMutationResponse>;
  /** delete data from the table: "permissions" */
  deletePermissions: Maybe<PermissionsMutationResponse>;
  /** delete single row from the table: "resources" */
  deleteResource: Maybe<Resources>;
  /** delete data from the table: "resources" */
  deleteResources: Maybe<ResourcesMutationResponse>;
  /** delete single row from the table: "roles" */
  deleteRole: Maybe<Roles>;
  /** delete single row from the table: "role_permissions" */
  deleteRolePermission: Maybe<RolePermissions>;
  /** delete data from the table: "role_permissions" */
  deleteRolePermissions: Maybe<RolePermissionsMutationResponse>;
  /** delete data from the table: "roles" */
  deleteRoles: Maybe<RolesMutationResponse>;
  /** delete single row from the table: "users" */
  deleteUser: Maybe<Users>;
  /** delete single row from the table: "user_roles" */
  deleteUserRole: Maybe<UserRoles>;
  /** delete data from the table: "user_roles" */
  deleteUserRoles: Maybe<UserRolesMutationResponse>;
  /** delete data from the table: "users" */
  deleteUsers: Maybe<UsersMutationResponse>;
  /** delete single row from the table: "work_schedule" */
  deleteWorkSchedule: Maybe<WorkSchedule>;
  /** delete data from the table: "work_schedule" */
  deleteWorkSchedules: Maybe<WorkScheduleMutationResponse>;
  /** delete data from the table: "adjustment_rules" */
  delete_adjustment_rules: Maybe<AdjustmentRulesMutationResponse>;
  /** delete single row from the table: "adjustment_rules" */
  delete_adjustment_rules_by_pk: Maybe<AdjustmentRules>;
  /** delete data from the table: "app_settings" */
  delete_app_settings: Maybe<AppSettingsMutationResponse>;
  /** delete single row from the table: "app_settings" */
  delete_app_settings_by_pk: Maybe<AppSettings>;
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
  /** delete data from the table: "payroll_cycles" */
  delete_payroll_cycles: Maybe<PayrollCyclesMutationResponse>;
  /** delete single row from the table: "payroll_cycles" */
  delete_payroll_cycles_by_pk: Maybe<PayrollCycles>;
  /** delete data from the table: "payroll_date_types" */
  delete_payroll_date_types: Maybe<PayrollDateTypesMutationResponse>;
  /** delete single row from the table: "payroll_date_types" */
  delete_payroll_date_types_by_pk: Maybe<PayrollDateTypes>;
  /** delete data from the table: "payroll_version_history_results" */
  delete_payroll_version_history_results: Maybe<PayrollVersionHistoryResultsMutationResponse>;
  /** delete single row from the table: "payroll_version_history_results" */
  delete_payroll_version_history_results_by_pk: Maybe<PayrollVersionHistoryResults>;
  /** delete data from the table: "payroll_version_results" */
  delete_payroll_version_results: Maybe<PayrollVersionResultsMutationResponse>;
  /** delete single row from the table: "payroll_version_results" */
  delete_payroll_version_results_by_pk: Maybe<PayrollVersionResults>;
  /** delete data from the table: "users_role_backup" */
  delete_users_role_backup: Maybe<UsersRoleBackupMutationResponse>;
  /** Generate SOC2 compliance reports */
  generateComplianceReport: Maybe<ComplianceReportResponse>;
  /** insert a single row into the table: "audit.audit_log" */
  insertAuditLog: Maybe<AuditAuditLog>;
  /** insert data into the table: "audit.audit_log" */
  insertAuditLogs: Maybe<AuditAuditLogMutationResponse>;
  /** insert a single row into the table: "audit.auth_events" */
  insertAuthEvent: Maybe<AuditAuthEvents>;
  /** insert data into the table: "audit.auth_events" */
  insertAuthEvents: Maybe<AuditAuthEventsMutationResponse>;
  /** insert a single row into the table: "clients" */
  insertClient: Maybe<Clients>;
  /** insert data into the table: "clients" */
  insertClients: Maybe<ClientsMutationResponse>;
  /** insert a single row into the table: "audit.data_access_log" */
  insertDataAccessLog: Maybe<AuditDataAccessLog>;
  /** insert data into the table: "audit.data_access_log" */
  insertDataAccessLogs: Maybe<AuditDataAccessLogMutationResponse>;
  /** insert a single row into the table: "leave" */
  insertLeave: Maybe<Leave>;
  /** insert data into the table: "leave" */
  insertLeaves: Maybe<LeaveMutationResponse>;
  /** insert a single row into the table: "payrolls" */
  insertPayroll: Maybe<Payrolls>;
  /** insert a single row into the table: "payroll_assignments" */
  insertPayrollAssignment: Maybe<PayrollAssignments>;
  /** insert data into the table: "payroll_assignments" */
  insertPayrollAssignments: Maybe<PayrollAssignmentsMutationResponse>;
  /** insert a single row into the table: "payroll_dates" */
  insertPayrollDate: Maybe<PayrollDates>;
  /** insert data into the table: "payroll_dates" */
  insertPayrollDates: Maybe<PayrollDatesMutationResponse>;
  /** insert data into the table: "payrolls" */
  insertPayrolls: Maybe<PayrollsMutationResponse>;
  /** insert a single row into the table: "permissions" */
  insertPermission: Maybe<Permissions>;
  /** insert a single row into the table: "permission_audit_log" */
  insertPermissionAuditLog: Maybe<PermissionAuditLog>;
  /** insert data into the table: "permission_audit_log" */
  insertPermissionAuditLogs: Maybe<PermissionAuditLogMutationResponse>;
  /** insert a single row into the table: "audit.permission_changes" */
  insertPermissionChange: Maybe<AuditPermissionChanges>;
  /** insert data into the table: "audit.permission_changes" */
  insertPermissionChanges: Maybe<AuditPermissionChangesMutationResponse>;
  /** insert a single row into the table: "permission_overrides" */
  insertPermissionOverride: Maybe<PermissionOverrides>;
  /** insert data into the table: "permission_overrides" */
  insertPermissionOverrides: Maybe<PermissionOverridesMutationResponse>;
  /** insert data into the table: "permissions" */
  insertPermissions: Maybe<PermissionsMutationResponse>;
  /** insert a single row into the table: "resources" */
  insertResource: Maybe<Resources>;
  /** insert data into the table: "resources" */
  insertResources: Maybe<ResourcesMutationResponse>;
  /** insert a single row into the table: "roles" */
  insertRole: Maybe<Roles>;
  /** insert a single row into the table: "role_permissions" */
  insertRolePermission: Maybe<RolePermissions>;
  /** insert data into the table: "role_permissions" */
  insertRolePermissions: Maybe<RolePermissionsMutationResponse>;
  /** insert data into the table: "roles" */
  insertRoles: Maybe<RolesMutationResponse>;
  /** insert a single row into the table: "users" */
  insertUser: Maybe<Users>;
  /** insert a single row into the table: "user_roles" */
  insertUserRole: Maybe<UserRoles>;
  /** insert data into the table: "user_roles" */
  insertUserRoles: Maybe<UserRolesMutationResponse>;
  /** insert data into the table: "users" */
  insertUsers: Maybe<UsersMutationResponse>;
  /** insert a single row into the table: "work_schedule" */
  insertWorkSchedule: Maybe<WorkSchedule>;
  /** insert data into the table: "work_schedule" */
  insertWorkSchedules: Maybe<WorkScheduleMutationResponse>;
  /** insert data into the table: "adjustment_rules" */
  insert_adjustment_rules: Maybe<AdjustmentRulesMutationResponse>;
  /** insert a single row into the table: "adjustment_rules" */
  insert_adjustment_rules_one: Maybe<AdjustmentRules>;
  /** insert data into the table: "app_settings" */
  insert_app_settings: Maybe<AppSettingsMutationResponse>;
  /** insert a single row into the table: "app_settings" */
  insert_app_settings_one: Maybe<AppSettings>;
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
  /** insert data into the table: "payroll_cycles" */
  insert_payroll_cycles: Maybe<PayrollCyclesMutationResponse>;
  /** insert a single row into the table: "payroll_cycles" */
  insert_payroll_cycles_one: Maybe<PayrollCycles>;
  /** insert data into the table: "payroll_date_types" */
  insert_payroll_date_types: Maybe<PayrollDateTypesMutationResponse>;
  /** insert a single row into the table: "payroll_date_types" */
  insert_payroll_date_types_one: Maybe<PayrollDateTypes>;
  /** insert data into the table: "payroll_version_history_results" */
  insert_payroll_version_history_results: Maybe<PayrollVersionHistoryResultsMutationResponse>;
  /** insert a single row into the table: "payroll_version_history_results" */
  insert_payroll_version_history_results_one: Maybe<PayrollVersionHistoryResults>;
  /** insert data into the table: "payroll_version_results" */
  insert_payroll_version_results: Maybe<PayrollVersionResultsMutationResponse>;
  /** insert a single row into the table: "payroll_version_results" */
  insert_payroll_version_results_one: Maybe<PayrollVersionResults>;
  /** insert data into the table: "users_role_backup" */
  insert_users_role_backup: Maybe<UsersRoleBackupMutationResponse>;
  /** insert a single row into the table: "users_role_backup" */
  insert_users_role_backup_one: Maybe<UsersRoleBackup>;
  /** Log audit events for SOC2 compliance */
  logAuditEvent: Maybe<AuditEventResponse>;
  /** update single row of the table: "audit.audit_log" */
  updateAuditLog: Maybe<AuditAuditLog>;
  /** update data of the table: "audit.audit_log" */
  updateAuditLogs: Maybe<AuditAuditLogMutationResponse>;
  /** update single row of the table: "audit.auth_events" */
  updateAuthEvent: Maybe<AuditAuthEvents>;
  /** update data of the table: "audit.auth_events" */
  updateAuthEvents: Maybe<AuditAuthEventsMutationResponse>;
  /** update single row of the table: "clients" */
  updateClient: Maybe<Clients>;
  /** update data of the table: "clients" */
  updateClients: Maybe<ClientsMutationResponse>;
  /** update single row of the table: "audit.data_access_log" */
  updateDataAccessLog: Maybe<AuditDataAccessLog>;
  /** update data of the table: "audit.data_access_log" */
  updateDataAccessLogs: Maybe<AuditDataAccessLogMutationResponse>;
  /** update single row of the table: "leave" */
  updateLeave: Maybe<Leave>;
  /** update data of the table: "leave" */
  updateLeaves: Maybe<LeaveMutationResponse>;
  /** update single row of the table: "payrolls" */
  updatePayroll: Maybe<Payrolls>;
  /** update single row of the table: "payroll_assignments" */
  updatePayrollAssignment: Maybe<PayrollAssignments>;
  /** update data of the table: "payroll_assignments" */
  updatePayrollAssignments: Maybe<PayrollAssignmentsMutationResponse>;
  /** update single row of the table: "payroll_dates" */
  updatePayrollDate: Maybe<PayrollDates>;
  /** update data of the table: "payroll_dates" */
  updatePayrollDates: Maybe<PayrollDatesMutationResponse>;
  /** update data of the table: "payrolls" */
  updatePayrolls: Maybe<PayrollsMutationResponse>;
  /** update single row of the table: "permissions" */
  updatePermission: Maybe<Permissions>;
  /** update single row of the table: "permission_audit_log" */
  updatePermissionAuditLog: Maybe<PermissionAuditLog>;
  /** update data of the table: "permission_audit_log" */
  updatePermissionAuditLogs: Maybe<PermissionAuditLogMutationResponse>;
  /** update single row of the table: "audit.permission_changes" */
  updatePermissionChange: Maybe<AuditPermissionChanges>;
  /** update data of the table: "audit.permission_changes" */
  updatePermissionChanges: Maybe<AuditPermissionChangesMutationResponse>;
  /** update single row of the table: "permission_overrides" */
  updatePermissionOverride: Maybe<PermissionOverrides>;
  /** update data of the table: "permission_overrides" */
  updatePermissionOverrides: Maybe<PermissionOverridesMutationResponse>;
  /** update data of the table: "permissions" */
  updatePermissions: Maybe<PermissionsMutationResponse>;
  /** update single row of the table: "resources" */
  updateResource: Maybe<Resources>;
  /** update data of the table: "resources" */
  updateResources: Maybe<ResourcesMutationResponse>;
  /** update single row of the table: "roles" */
  updateRole: Maybe<Roles>;
  /** update single row of the table: "role_permissions" */
  updateRolePermission: Maybe<RolePermissions>;
  /** update data of the table: "role_permissions" */
  updateRolePermissions: Maybe<RolePermissionsMutationResponse>;
  /** update data of the table: "roles" */
  updateRoles: Maybe<RolesMutationResponse>;
  /** update single row of the table: "users" */
  updateUser: Maybe<Users>;
  /** update single row of the table: "user_roles" */
  updateUserRole: Maybe<UserRoles>;
  /** update data of the table: "user_roles" */
  updateUserRoles: Maybe<UserRolesMutationResponse>;
  /** update data of the table: "users" */
  updateUsers: Maybe<UsersMutationResponse>;
  /** update single row of the table: "work_schedule" */
  updateWorkSchedule: Maybe<WorkSchedule>;
  /** update data of the table: "work_schedule" */
  updateWorkSchedules: Maybe<WorkScheduleMutationResponse>;
  /** update data of the table: "adjustment_rules" */
  update_adjustment_rules: Maybe<AdjustmentRulesMutationResponse>;
  /** update single row of the table: "adjustment_rules" */
  update_adjustment_rules_by_pk: Maybe<AdjustmentRules>;
  /** update multiples rows of table: "adjustment_rules" */
  update_adjustment_rules_many: Maybe<
    Array<Maybe<AdjustmentRulesMutationResponse>>
  >;
  /** update data of the table: "app_settings" */
  update_app_settings: Maybe<AppSettingsMutationResponse>;
  /** update single row of the table: "app_settings" */
  update_app_settings_by_pk: Maybe<AppSettings>;
  /** update multiples rows of table: "app_settings" */
  update_app_settings_many: Maybe<Array<Maybe<AppSettingsMutationResponse>>>;
  /** update multiples rows of table: "audit.audit_log" */
  update_audit_audit_log_many: Maybe<
    Array<Maybe<AuditAuditLogMutationResponse>>
  >;
  /** update multiples rows of table: "audit.auth_events" */
  update_audit_auth_events_many: Maybe<
    Array<Maybe<AuditAuthEventsMutationResponse>>
  >;
  /** update multiples rows of table: "audit.data_access_log" */
  update_audit_data_access_log_many: Maybe<
    Array<Maybe<AuditDataAccessLogMutationResponse>>
  >;
  /** update multiples rows of table: "audit.permission_changes" */
  update_audit_permission_changes_many: Maybe<
    Array<Maybe<AuditPermissionChangesMutationResponse>>
  >;
  /** update data of the table: "audit.slow_queries" */
  update_audit_slow_queries: Maybe<AuditSlowQueriesMutationResponse>;
  /** update single row of the table: "audit.slow_queries" */
  update_audit_slow_queries_by_pk: Maybe<AuditSlowQueries>;
  /** update multiples rows of table: "audit.slow_queries" */
  update_audit_slow_queries_many: Maybe<
    Array<Maybe<AuditSlowQueriesMutationResponse>>
  >;
  /** update data of the table: "audit.user_access_summary" */
  update_audit_user_access_summary: Maybe<AuditUserAccessSummaryMutationResponse>;
  /** update multiples rows of table: "audit.user_access_summary" */
  update_audit_user_access_summary_many: Maybe<
    Array<Maybe<AuditUserAccessSummaryMutationResponse>>
  >;
  /** update data of the table: "billing_event_log" */
  update_billing_event_log: Maybe<BillingEventLogMutationResponse>;
  /** update single row of the table: "billing_event_log" */
  update_billing_event_log_by_pk: Maybe<BillingEventLog>;
  /** update multiples rows of table: "billing_event_log" */
  update_billing_event_log_many: Maybe<
    Array<Maybe<BillingEventLogMutationResponse>>
  >;
  /** update data of the table: "billing_invoice" */
  update_billing_invoice: Maybe<BillingInvoiceMutationResponse>;
  /** update single row of the table: "billing_invoice" */
  update_billing_invoice_by_pk: Maybe<BillingInvoice>;
  /** update data of the table: "billing_invoice_item" */
  update_billing_invoice_item: Maybe<BillingInvoiceItemMutationResponse>;
  /** update single row of the table: "billing_invoice_item" */
  update_billing_invoice_item_by_pk: Maybe<BillingInvoiceItem>;
  /** update multiples rows of table: "billing_invoice_item" */
  update_billing_invoice_item_many: Maybe<
    Array<Maybe<BillingInvoiceItemMutationResponse>>
  >;
  /** update multiples rows of table: "billing_invoice" */
  update_billing_invoice_many: Maybe<
    Array<Maybe<BillingInvoiceMutationResponse>>
  >;
  /** update data of the table: "billing_invoices" */
  update_billing_invoices: Maybe<BillingInvoicesMutationResponse>;
  /** update single row of the table: "billing_invoices" */
  update_billing_invoices_by_pk: Maybe<BillingInvoices>;
  /** update multiples rows of table: "billing_invoices" */
  update_billing_invoices_many: Maybe<
    Array<Maybe<BillingInvoicesMutationResponse>>
  >;
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
  update_client_billing_assignment_many: Maybe<
    Array<Maybe<ClientBillingAssignmentMutationResponse>>
  >;
  /** update data of the table: "client_external_systems" */
  update_client_external_systems: Maybe<ClientExternalSystemsMutationResponse>;
  /** update single row of the table: "client_external_systems" */
  update_client_external_systems_by_pk: Maybe<ClientExternalSystems>;
  /** update multiples rows of table: "client_external_systems" */
  update_client_external_systems_many: Maybe<
    Array<Maybe<ClientExternalSystemsMutationResponse>>
  >;
  /** update multiples rows of table: "clients" */
  update_clients_many: Maybe<Array<Maybe<ClientsMutationResponse>>>;
  /** update data of the table: "external_systems" */
  update_external_systems: Maybe<ExternalSystemsMutationResponse>;
  /** update single row of the table: "external_systems" */
  update_external_systems_by_pk: Maybe<ExternalSystems>;
  /** update multiples rows of table: "external_systems" */
  update_external_systems_many: Maybe<
    Array<Maybe<ExternalSystemsMutationResponse>>
  >;
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
  update_latest_payroll_version_results_many: Maybe<
    Array<Maybe<LatestPayrollVersionResultsMutationResponse>>
  >;
  /** update multiples rows of table: "leave" */
  update_leave_many: Maybe<Array<Maybe<LeaveMutationResponse>>>;
  /** update data of the table: "neon_auth.users_sync" */
  update_neon_auth_users_sync: Maybe<NeonAuthUsersSyncMutationResponse>;
  /** update single row of the table: "neon_auth.users_sync" */
  update_neon_auth_users_sync_by_pk: Maybe<NeonAuthUsersSync>;
  /** update multiples rows of table: "neon_auth.users_sync" */
  update_neon_auth_users_sync_many: Maybe<
    Array<Maybe<NeonAuthUsersSyncMutationResponse>>
  >;
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
  update_payroll_activation_results_many: Maybe<
    Array<Maybe<PayrollActivationResultsMutationResponse>>
  >;
  /** update data of the table: "payroll_assignment_audit" */
  update_payroll_assignment_audit: Maybe<PayrollAssignmentAuditMutationResponse>;
  /** update single row of the table: "payroll_assignment_audit" */
  update_payroll_assignment_audit_by_pk: Maybe<PayrollAssignmentAudit>;
  /** update multiples rows of table: "payroll_assignment_audit" */
  update_payroll_assignment_audit_many: Maybe<
    Array<Maybe<PayrollAssignmentAuditMutationResponse>>
  >;
  /** update multiples rows of table: "payroll_assignments" */
  update_payroll_assignments_many: Maybe<
    Array<Maybe<PayrollAssignmentsMutationResponse>>
  >;
  /** update data of the table: "payroll_cycles" */
  update_payroll_cycles: Maybe<PayrollCyclesMutationResponse>;
  /** update single row of the table: "payroll_cycles" */
  update_payroll_cycles_by_pk: Maybe<PayrollCycles>;
  /** update multiples rows of table: "payroll_cycles" */
  update_payroll_cycles_many: Maybe<
    Array<Maybe<PayrollCyclesMutationResponse>>
  >;
  /** update data of the table: "payroll_date_types" */
  update_payroll_date_types: Maybe<PayrollDateTypesMutationResponse>;
  /** update single row of the table: "payroll_date_types" */
  update_payroll_date_types_by_pk: Maybe<PayrollDateTypes>;
  /** update multiples rows of table: "payroll_date_types" */
  update_payroll_date_types_many: Maybe<
    Array<Maybe<PayrollDateTypesMutationResponse>>
  >;
  /** update multiples rows of table: "payroll_dates" */
  update_payroll_dates_many: Maybe<Array<Maybe<PayrollDatesMutationResponse>>>;
  /** update data of the table: "payroll_version_history_results" */
  update_payroll_version_history_results: Maybe<PayrollVersionHistoryResultsMutationResponse>;
  /** update single row of the table: "payroll_version_history_results" */
  update_payroll_version_history_results_by_pk: Maybe<PayrollVersionHistoryResults>;
  /** update multiples rows of table: "payroll_version_history_results" */
  update_payroll_version_history_results_many: Maybe<
    Array<Maybe<PayrollVersionHistoryResultsMutationResponse>>
  >;
  /** update data of the table: "payroll_version_results" */
  update_payroll_version_results: Maybe<PayrollVersionResultsMutationResponse>;
  /** update single row of the table: "payroll_version_results" */
  update_payroll_version_results_by_pk: Maybe<PayrollVersionResults>;
  /** update multiples rows of table: "payroll_version_results" */
  update_payroll_version_results_many: Maybe<
    Array<Maybe<PayrollVersionResultsMutationResponse>>
  >;
  /** update multiples rows of table: "payrolls" */
  update_payrolls_many: Maybe<Array<Maybe<PayrollsMutationResponse>>>;
  /** update multiples rows of table: "permission_audit_log" */
  update_permission_audit_log_many: Maybe<
    Array<Maybe<PermissionAuditLogMutationResponse>>
  >;
  /** update multiples rows of table: "permission_overrides" */
  update_permission_overrides_many: Maybe<
    Array<Maybe<PermissionOverridesMutationResponse>>
  >;
  /** update multiples rows of table: "permissions" */
  update_permissions_many: Maybe<Array<Maybe<PermissionsMutationResponse>>>;
  /** update multiples rows of table: "resources" */
  update_resources_many: Maybe<Array<Maybe<ResourcesMutationResponse>>>;
  /** update multiples rows of table: "role_permissions" */
  update_role_permissions_many: Maybe<
    Array<Maybe<RolePermissionsMutationResponse>>
  >;
  /** update multiples rows of table: "roles" */
  update_roles_many: Maybe<Array<Maybe<RolesMutationResponse>>>;
  /** update multiples rows of table: "user_roles" */
  update_user_roles_many: Maybe<Array<Maybe<UserRolesMutationResponse>>>;
  /** update multiples rows of table: "users" */
  update_users_many: Maybe<Array<Maybe<UsersMutationResponse>>>;
  /** update data of the table: "users_role_backup" */
  update_users_role_backup: Maybe<UsersRoleBackupMutationResponse>;
  /** update multiples rows of table: "users_role_backup" */
  update_users_role_backup_many: Maybe<
    Array<Maybe<UsersRoleBackupMutationResponse>>
  >;
  /** update multiples rows of table: "work_schedule" */
  update_work_schedule_many: Maybe<Array<Maybe<WorkScheduleMutationResponse>>>;
};

/** mutation root */
export type MutationRootCheckSuspiciousActivityArgs = {
  timeWindow?: InputMaybe<Scalars["Int"]["input"]>;
  userId?: InputMaybe<Scalars["String"]["input"]>;
};

/** mutation root */
export type MutationRootCommitPayrollAssignmentsArgs = {
  changes: Array<PayrollAssignmentInput>;
};

/** mutation root */
export type MutationRootDeleteAuditLogArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteAuditLogsArgs = {
  where: AuditAuditLogBoolExp;
};

/** mutation root */
export type MutationRootDeleteAuthEventArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteAuthEventsArgs = {
  where: AuditAuthEventsBoolExp;
};

/** mutation root */
export type MutationRootDeleteClientArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteClientsArgs = {
  where: ClientsBoolExp;
};

/** mutation root */
export type MutationRootDeleteDataAccessLogArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteDataAccessLogsArgs = {
  where: AuditDataAccessLogBoolExp;
};

/** mutation root */
export type MutationRootDeleteLeaveArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteLeavesArgs = {
  where: LeaveBoolExp;
};

/** mutation root */
export type MutationRootDeletePayrollArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeletePayrollAssignmentArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeletePayrollAssignmentsArgs = {
  where: PayrollAssignmentsBoolExp;
};

/** mutation root */
export type MutationRootDeletePayrollDateArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeletePayrollDatesArgs = {
  where: PayrollDatesBoolExp;
};

/** mutation root */
export type MutationRootDeletePayrollsArgs = {
  where: PayrollsBoolExp;
};

/** mutation root */
export type MutationRootDeletePermissionArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeletePermissionAuditLogArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeletePermissionAuditLogsArgs = {
  where: PermissionAuditLogBoolExp;
};

/** mutation root */
export type MutationRootDeletePermissionChangeArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeletePermissionChangesArgs = {
  where: AuditPermissionChangesBoolExp;
};

/** mutation root */
export type MutationRootDeletePermissionOverrideArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeletePermissionOverridesArgs = {
  where: PermissionOverridesBoolExp;
};

/** mutation root */
export type MutationRootDeletePermissionsArgs = {
  where: PermissionsBoolExp;
};

/** mutation root */
export type MutationRootDeleteResourceArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteResourcesArgs = {
  where: ResourcesBoolExp;
};

/** mutation root */
export type MutationRootDeleteRoleArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteRolePermissionArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteRolePermissionsArgs = {
  where: RolePermissionsBoolExp;
};

/** mutation root */
export type MutationRootDeleteRolesArgs = {
  where: RolesBoolExp;
};

/** mutation root */
export type MutationRootDeleteUserArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteUserRoleArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteUserRolesArgs = {
  where: UserRolesBoolExp;
};

/** mutation root */
export type MutationRootDeleteUsersArgs = {
  where: UsersBoolExp;
};

/** mutation root */
export type MutationRootDeleteWorkScheduleArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteWorkSchedulesArgs = {
  where: WorkScheduleBoolExp;
};

/** mutation root */
export type MutationRootDeleteAdjustmentRulesArgs = {
  where: AdjustmentRulesBoolExp;
};

/** mutation root */
export type MutationRootDeleteAdjustmentRulesByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteAppSettingsArgs = {
  where: AppSettingsBoolExp;
};

/** mutation root */
export type MutationRootDeleteAppSettingsByPkArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type MutationRootDeleteAuditSlowQueriesArgs = {
  where: AuditSlowQueriesBoolExp;
};

/** mutation root */
export type MutationRootDeleteAuditSlowQueriesByPkArgs = {
  id: Scalars["uuid"]["input"];
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
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteBillingInvoiceArgs = {
  where: BillingInvoiceBoolExp;
};

/** mutation root */
export type MutationRootDeleteBillingInvoiceByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteBillingInvoiceItemArgs = {
  where: BillingInvoiceItemBoolExp;
};

/** mutation root */
export type MutationRootDeleteBillingInvoiceItemByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteBillingInvoicesArgs = {
  where: BillingInvoicesBoolExp;
};

/** mutation root */
export type MutationRootDeleteBillingInvoicesByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteBillingItemsArgs = {
  where: BillingItemsBoolExp;
};

/** mutation root */
export type MutationRootDeleteBillingItemsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteBillingPlanArgs = {
  where: BillingPlanBoolExp;
};

/** mutation root */
export type MutationRootDeleteBillingPlanByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteClientBillingAssignmentArgs = {
  where: ClientBillingAssignmentBoolExp;
};

/** mutation root */
export type MutationRootDeleteClientBillingAssignmentByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteClientExternalSystemsArgs = {
  where: ClientExternalSystemsBoolExp;
};

/** mutation root */
export type MutationRootDeleteClientExternalSystemsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteExternalSystemsArgs = {
  where: ExternalSystemsBoolExp;
};

/** mutation root */
export type MutationRootDeleteExternalSystemsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteFeatureFlagsArgs = {
  where: FeatureFlagsBoolExp;
};

/** mutation root */
export type MutationRootDeleteFeatureFlagsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteHolidaysArgs = {
  where: HolidaysBoolExp;
};

/** mutation root */
export type MutationRootDeleteHolidaysByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteLatestPayrollVersionResultsArgs = {
  where: LatestPayrollVersionResultsBoolExp;
};

/** mutation root */
export type MutationRootDeleteLatestPayrollVersionResultsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteNeonAuthUsersSyncArgs = {
  where: NeonAuthUsersSyncBoolExp;
};

/** mutation root */
export type MutationRootDeleteNeonAuthUsersSyncByPkArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type MutationRootDeleteNotesArgs = {
  where: NotesBoolExp;
};

/** mutation root */
export type MutationRootDeleteNotesByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeletePayrollActivationResultsArgs = {
  where: PayrollActivationResultsBoolExp;
};

/** mutation root */
export type MutationRootDeletePayrollActivationResultsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeletePayrollAssignmentAuditArgs = {
  where: PayrollAssignmentAuditBoolExp;
};

/** mutation root */
export type MutationRootDeletePayrollAssignmentAuditByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeletePayrollCyclesArgs = {
  where: PayrollCyclesBoolExp;
};

/** mutation root */
export type MutationRootDeletePayrollCyclesByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeletePayrollDateTypesArgs = {
  where: PayrollDateTypesBoolExp;
};

/** mutation root */
export type MutationRootDeletePayrollDateTypesByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeletePayrollVersionHistoryResultsArgs = {
  where: PayrollVersionHistoryResultsBoolExp;
};

/** mutation root */
export type MutationRootDeletePayrollVersionHistoryResultsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeletePayrollVersionResultsArgs = {
  where: PayrollVersionResultsBoolExp;
};

/** mutation root */
export type MutationRootDeletePayrollVersionResultsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type MutationRootDeleteUsersRoleBackupArgs = {
  where: UsersRoleBackupBoolExp;
};

/** mutation root */
export type MutationRootGenerateComplianceReportArgs = {
  input: ComplianceReportInput;
};

/** mutation root */
export type MutationRootInsertAuditLogArgs = {
  object: AuditAuditLogInsertInput;
  on_conflict?: InputMaybe<AuditAuditLogOnConflict>;
};

/** mutation root */
export type MutationRootInsertAuditLogsArgs = {
  objects: Array<AuditAuditLogInsertInput>;
  on_conflict?: InputMaybe<AuditAuditLogOnConflict>;
};

/** mutation root */
export type MutationRootInsertAuthEventArgs = {
  object: AuditAuthEventsInsertInput;
  on_conflict?: InputMaybe<AuditAuthEventsOnConflict>;
};

/** mutation root */
export type MutationRootInsertAuthEventsArgs = {
  objects: Array<AuditAuthEventsInsertInput>;
  on_conflict?: InputMaybe<AuditAuthEventsOnConflict>;
};

/** mutation root */
export type MutationRootInsertClientArgs = {
  object: ClientsInsertInput;
  on_conflict?: InputMaybe<ClientsOnConflict>;
};

/** mutation root */
export type MutationRootInsertClientsArgs = {
  objects: Array<ClientsInsertInput>;
  on_conflict?: InputMaybe<ClientsOnConflict>;
};

/** mutation root */
export type MutationRootInsertDataAccessLogArgs = {
  object: AuditDataAccessLogInsertInput;
  on_conflict?: InputMaybe<AuditDataAccessLogOnConflict>;
};

/** mutation root */
export type MutationRootInsertDataAccessLogsArgs = {
  objects: Array<AuditDataAccessLogInsertInput>;
  on_conflict?: InputMaybe<AuditDataAccessLogOnConflict>;
};

/** mutation root */
export type MutationRootInsertLeaveArgs = {
  object: LeaveInsertInput;
  on_conflict?: InputMaybe<LeaveOnConflict>;
};

/** mutation root */
export type MutationRootInsertLeavesArgs = {
  objects: Array<LeaveInsertInput>;
  on_conflict?: InputMaybe<LeaveOnConflict>;
};

/** mutation root */
export type MutationRootInsertPayrollArgs = {
  object: PayrollsInsertInput;
  on_conflict?: InputMaybe<PayrollsOnConflict>;
};

/** mutation root */
export type MutationRootInsertPayrollAssignmentArgs = {
  object: PayrollAssignmentsInsertInput;
  on_conflict?: InputMaybe<PayrollAssignmentsOnConflict>;
};

/** mutation root */
export type MutationRootInsertPayrollAssignmentsArgs = {
  objects: Array<PayrollAssignmentsInsertInput>;
  on_conflict?: InputMaybe<PayrollAssignmentsOnConflict>;
};

/** mutation root */
export type MutationRootInsertPayrollDateArgs = {
  object: PayrollDatesInsertInput;
  on_conflict?: InputMaybe<PayrollDatesOnConflict>;
};

/** mutation root */
export type MutationRootInsertPayrollDatesArgs = {
  objects: Array<PayrollDatesInsertInput>;
  on_conflict?: InputMaybe<PayrollDatesOnConflict>;
};

/** mutation root */
export type MutationRootInsertPayrollsArgs = {
  objects: Array<PayrollsInsertInput>;
  on_conflict?: InputMaybe<PayrollsOnConflict>;
};

/** mutation root */
export type MutationRootInsertPermissionArgs = {
  object: PermissionsInsertInput;
  on_conflict?: InputMaybe<PermissionsOnConflict>;
};

/** mutation root */
export type MutationRootInsertPermissionAuditLogArgs = {
  object: PermissionAuditLogInsertInput;
  on_conflict?: InputMaybe<PermissionAuditLogOnConflict>;
};

/** mutation root */
export type MutationRootInsertPermissionAuditLogsArgs = {
  objects: Array<PermissionAuditLogInsertInput>;
  on_conflict?: InputMaybe<PermissionAuditLogOnConflict>;
};

/** mutation root */
export type MutationRootInsertPermissionChangeArgs = {
  object: AuditPermissionChangesInsertInput;
  on_conflict?: InputMaybe<AuditPermissionChangesOnConflict>;
};

/** mutation root */
export type MutationRootInsertPermissionChangesArgs = {
  objects: Array<AuditPermissionChangesInsertInput>;
  on_conflict?: InputMaybe<AuditPermissionChangesOnConflict>;
};

/** mutation root */
export type MutationRootInsertPermissionOverrideArgs = {
  object: PermissionOverridesInsertInput;
  on_conflict?: InputMaybe<PermissionOverridesOnConflict>;
};

/** mutation root */
export type MutationRootInsertPermissionOverridesArgs = {
  objects: Array<PermissionOverridesInsertInput>;
  on_conflict?: InputMaybe<PermissionOverridesOnConflict>;
};

/** mutation root */
export type MutationRootInsertPermissionsArgs = {
  objects: Array<PermissionsInsertInput>;
  on_conflict?: InputMaybe<PermissionsOnConflict>;
};

/** mutation root */
export type MutationRootInsertResourceArgs = {
  object: ResourcesInsertInput;
  on_conflict?: InputMaybe<ResourcesOnConflict>;
};

/** mutation root */
export type MutationRootInsertResourcesArgs = {
  objects: Array<ResourcesInsertInput>;
  on_conflict?: InputMaybe<ResourcesOnConflict>;
};

/** mutation root */
export type MutationRootInsertRoleArgs = {
  object: RolesInsertInput;
  on_conflict?: InputMaybe<RolesOnConflict>;
};

/** mutation root */
export type MutationRootInsertRolePermissionArgs = {
  object: RolePermissionsInsertInput;
  on_conflict?: InputMaybe<RolePermissionsOnConflict>;
};

/** mutation root */
export type MutationRootInsertRolePermissionsArgs = {
  objects: Array<RolePermissionsInsertInput>;
  on_conflict?: InputMaybe<RolePermissionsOnConflict>;
};

/** mutation root */
export type MutationRootInsertRolesArgs = {
  objects: Array<RolesInsertInput>;
  on_conflict?: InputMaybe<RolesOnConflict>;
};

/** mutation root */
export type MutationRootInsertUserArgs = {
  object: UsersInsertInput;
  on_conflict?: InputMaybe<UsersOnConflict>;
};

/** mutation root */
export type MutationRootInsertUserRoleArgs = {
  object: UserRolesInsertInput;
  on_conflict?: InputMaybe<UserRolesOnConflict>;
};

/** mutation root */
export type MutationRootInsertUserRolesArgs = {
  objects: Array<UserRolesInsertInput>;
  on_conflict?: InputMaybe<UserRolesOnConflict>;
};

/** mutation root */
export type MutationRootInsertUsersArgs = {
  objects: Array<UsersInsertInput>;
  on_conflict?: InputMaybe<UsersOnConflict>;
};

/** mutation root */
export type MutationRootInsertWorkScheduleArgs = {
  object: WorkScheduleInsertInput;
  on_conflict?: InputMaybe<WorkScheduleOnConflict>;
};

/** mutation root */
export type MutationRootInsertWorkSchedulesArgs = {
  objects: Array<WorkScheduleInsertInput>;
  on_conflict?: InputMaybe<WorkScheduleOnConflict>;
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
export type MutationRootInsertUsersRoleBackupArgs = {
  objects: Array<UsersRoleBackupInsertInput>;
};

/** mutation root */
export type MutationRootInsertUsersRoleBackupOneArgs = {
  object: UsersRoleBackupInsertInput;
};

/** mutation root */
export type MutationRootLogAuditEventArgs = {
  event: AuditEventInput;
};

/** mutation root */
export type MutationRootUpdateAuditLogArgs = {
  _append?: InputMaybe<AuditAuditLogAppendInput>;
  _delete_at_path?: InputMaybe<AuditAuditLogDeleteAtPathInput>;
  _delete_elem?: InputMaybe<AuditAuditLogDeleteElemInput>;
  _delete_key?: InputMaybe<AuditAuditLogDeleteKeyInput>;
  _prepend?: InputMaybe<AuditAuditLogPrependInput>;
  _set?: InputMaybe<AuditAuditLogSetInput>;
  pk_columns: AuditAuditLogPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateAuditLogsArgs = {
  _append?: InputMaybe<AuditAuditLogAppendInput>;
  _delete_at_path?: InputMaybe<AuditAuditLogDeleteAtPathInput>;
  _delete_elem?: InputMaybe<AuditAuditLogDeleteElemInput>;
  _delete_key?: InputMaybe<AuditAuditLogDeleteKeyInput>;
  _prepend?: InputMaybe<AuditAuditLogPrependInput>;
  _set?: InputMaybe<AuditAuditLogSetInput>;
  where: AuditAuditLogBoolExp;
};

/** mutation root */
export type MutationRootUpdateAuthEventArgs = {
  _append?: InputMaybe<AuditAuthEventsAppendInput>;
  _delete_at_path?: InputMaybe<AuditAuthEventsDeleteAtPathInput>;
  _delete_elem?: InputMaybe<AuditAuthEventsDeleteElemInput>;
  _delete_key?: InputMaybe<AuditAuthEventsDeleteKeyInput>;
  _prepend?: InputMaybe<AuditAuthEventsPrependInput>;
  _set?: InputMaybe<AuditAuthEventsSetInput>;
  pk_columns: AuditAuthEventsPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateAuthEventsArgs = {
  _append?: InputMaybe<AuditAuthEventsAppendInput>;
  _delete_at_path?: InputMaybe<AuditAuthEventsDeleteAtPathInput>;
  _delete_elem?: InputMaybe<AuditAuthEventsDeleteElemInput>;
  _delete_key?: InputMaybe<AuditAuthEventsDeleteKeyInput>;
  _prepend?: InputMaybe<AuditAuthEventsPrependInput>;
  _set?: InputMaybe<AuditAuthEventsSetInput>;
  where: AuditAuthEventsBoolExp;
};

/** mutation root */
export type MutationRootUpdateClientArgs = {
  _set?: InputMaybe<ClientsSetInput>;
  pk_columns: ClientsPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateClientsArgs = {
  _set?: InputMaybe<ClientsSetInput>;
  where: ClientsBoolExp;
};

/** mutation root */
export type MutationRootUpdateDataAccessLogArgs = {
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
export type MutationRootUpdateDataAccessLogsArgs = {
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
export type MutationRootUpdateLeaveArgs = {
  _set?: InputMaybe<LeaveSetInput>;
  pk_columns: LeavePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateLeavesArgs = {
  _set?: InputMaybe<LeaveSetInput>;
  where: LeaveBoolExp;
};

/** mutation root */
export type MutationRootUpdatePayrollArgs = {
  _inc?: InputMaybe<PayrollsIncInput>;
  _set?: InputMaybe<PayrollsSetInput>;
  pk_columns: PayrollsPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdatePayrollAssignmentArgs = {
  _set?: InputMaybe<PayrollAssignmentsSetInput>;
  pk_columns: PayrollAssignmentsPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdatePayrollAssignmentsArgs = {
  _set?: InputMaybe<PayrollAssignmentsSetInput>;
  where: PayrollAssignmentsBoolExp;
};

/** mutation root */
export type MutationRootUpdatePayrollDateArgs = {
  _set?: InputMaybe<PayrollDatesSetInput>;
  pk_columns: PayrollDatesPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdatePayrollDatesArgs = {
  _set?: InputMaybe<PayrollDatesSetInput>;
  where: PayrollDatesBoolExp;
};

/** mutation root */
export type MutationRootUpdatePayrollsArgs = {
  _inc?: InputMaybe<PayrollsIncInput>;
  _set?: InputMaybe<PayrollsSetInput>;
  where: PayrollsBoolExp;
};

/** mutation root */
export type MutationRootUpdatePermissionArgs = {
  _set?: InputMaybe<PermissionsSetInput>;
  pk_columns: PermissionsPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdatePermissionAuditLogArgs = {
  _append?: InputMaybe<PermissionAuditLogAppendInput>;
  _delete_at_path?: InputMaybe<PermissionAuditLogDeleteAtPathInput>;
  _delete_elem?: InputMaybe<PermissionAuditLogDeleteElemInput>;
  _delete_key?: InputMaybe<PermissionAuditLogDeleteKeyInput>;
  _prepend?: InputMaybe<PermissionAuditLogPrependInput>;
  _set?: InputMaybe<PermissionAuditLogSetInput>;
  pk_columns: PermissionAuditLogPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdatePermissionAuditLogsArgs = {
  _append?: InputMaybe<PermissionAuditLogAppendInput>;
  _delete_at_path?: InputMaybe<PermissionAuditLogDeleteAtPathInput>;
  _delete_elem?: InputMaybe<PermissionAuditLogDeleteElemInput>;
  _delete_key?: InputMaybe<PermissionAuditLogDeleteKeyInput>;
  _prepend?: InputMaybe<PermissionAuditLogPrependInput>;
  _set?: InputMaybe<PermissionAuditLogSetInput>;
  where: PermissionAuditLogBoolExp;
};

/** mutation root */
export type MutationRootUpdatePermissionChangeArgs = {
  _append?: InputMaybe<AuditPermissionChangesAppendInput>;
  _delete_at_path?: InputMaybe<AuditPermissionChangesDeleteAtPathInput>;
  _delete_elem?: InputMaybe<AuditPermissionChangesDeleteElemInput>;
  _delete_key?: InputMaybe<AuditPermissionChangesDeleteKeyInput>;
  _prepend?: InputMaybe<AuditPermissionChangesPrependInput>;
  _set?: InputMaybe<AuditPermissionChangesSetInput>;
  pk_columns: AuditPermissionChangesPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdatePermissionChangesArgs = {
  _append?: InputMaybe<AuditPermissionChangesAppendInput>;
  _delete_at_path?: InputMaybe<AuditPermissionChangesDeleteAtPathInput>;
  _delete_elem?: InputMaybe<AuditPermissionChangesDeleteElemInput>;
  _delete_key?: InputMaybe<AuditPermissionChangesDeleteKeyInput>;
  _prepend?: InputMaybe<AuditPermissionChangesPrependInput>;
  _set?: InputMaybe<AuditPermissionChangesSetInput>;
  where: AuditPermissionChangesBoolExp;
};

/** mutation root */
export type MutationRootUpdatePermissionOverrideArgs = {
  _append?: InputMaybe<PermissionOverridesAppendInput>;
  _delete_at_path?: InputMaybe<PermissionOverridesDeleteAtPathInput>;
  _delete_elem?: InputMaybe<PermissionOverridesDeleteElemInput>;
  _delete_key?: InputMaybe<PermissionOverridesDeleteKeyInput>;
  _prepend?: InputMaybe<PermissionOverridesPrependInput>;
  _set?: InputMaybe<PermissionOverridesSetInput>;
  pk_columns: PermissionOverridesPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdatePermissionOverridesArgs = {
  _append?: InputMaybe<PermissionOverridesAppendInput>;
  _delete_at_path?: InputMaybe<PermissionOverridesDeleteAtPathInput>;
  _delete_elem?: InputMaybe<PermissionOverridesDeleteElemInput>;
  _delete_key?: InputMaybe<PermissionOverridesDeleteKeyInput>;
  _prepend?: InputMaybe<PermissionOverridesPrependInput>;
  _set?: InputMaybe<PermissionOverridesSetInput>;
  where: PermissionOverridesBoolExp;
};

/** mutation root */
export type MutationRootUpdatePermissionsArgs = {
  _set?: InputMaybe<PermissionsSetInput>;
  where: PermissionsBoolExp;
};

/** mutation root */
export type MutationRootUpdateResourceArgs = {
  _set?: InputMaybe<ResourcesSetInput>;
  pk_columns: ResourcesPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateResourcesArgs = {
  _set?: InputMaybe<ResourcesSetInput>;
  where: ResourcesBoolExp;
};

/** mutation root */
export type MutationRootUpdateRoleArgs = {
  _inc?: InputMaybe<RolesIncInput>;
  _set?: InputMaybe<RolesSetInput>;
  pk_columns: RolesPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateRolePermissionArgs = {
  _append?: InputMaybe<RolePermissionsAppendInput>;
  _delete_at_path?: InputMaybe<RolePermissionsDeleteAtPathInput>;
  _delete_elem?: InputMaybe<RolePermissionsDeleteElemInput>;
  _delete_key?: InputMaybe<RolePermissionsDeleteKeyInput>;
  _prepend?: InputMaybe<RolePermissionsPrependInput>;
  _set?: InputMaybe<RolePermissionsSetInput>;
  pk_columns: RolePermissionsPkColumnsInput;
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
export type MutationRootUpdateRolesArgs = {
  _inc?: InputMaybe<RolesIncInput>;
  _set?: InputMaybe<RolesSetInput>;
  where: RolesBoolExp;
};

/** mutation root */
export type MutationRootUpdateUserArgs = {
  _set?: InputMaybe<UsersSetInput>;
  pk_columns: UsersPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateUserRoleArgs = {
  _set?: InputMaybe<UserRolesSetInput>;
  pk_columns: UserRolesPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateUserRolesArgs = {
  _set?: InputMaybe<UserRolesSetInput>;
  where: UserRolesBoolExp;
};

/** mutation root */
export type MutationRootUpdateUsersArgs = {
  _set?: InputMaybe<UsersSetInput>;
  where: UsersBoolExp;
};

/** mutation root */
export type MutationRootUpdateWorkScheduleArgs = {
  _inc?: InputMaybe<WorkScheduleIncInput>;
  _set?: InputMaybe<WorkScheduleSetInput>;
  pk_columns: WorkSchedulePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateWorkSchedulesArgs = {
  _inc?: InputMaybe<WorkScheduleIncInput>;
  _set?: InputMaybe<WorkScheduleSetInput>;
  where: WorkScheduleBoolExp;
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
export type MutationRootUpdateAuditAuditLogManyArgs = {
  updates: Array<AuditAuditLogUpdates>;
};

/** mutation root */
export type MutationRootUpdateAuditAuthEventsManyArgs = {
  updates: Array<AuditAuthEventsUpdates>;
};

/** mutation root */
export type MutationRootUpdateAuditDataAccessLogManyArgs = {
  updates: Array<AuditDataAccessLogUpdates>;
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
export type MutationRootUpdatePayrollsManyArgs = {
  updates: Array<PayrollsUpdates>;
};

/** mutation root */
export type MutationRootUpdatePermissionAuditLogManyArgs = {
  updates: Array<PermissionAuditLogUpdates>;
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
export type MutationRootUpdateResourcesManyArgs = {
  updates: Array<ResourcesUpdates>;
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
export type MutationRootUpdateUserRolesManyArgs = {
  updates: Array<UserRolesUpdates>;
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
export type MutationRootUpdateWorkScheduleManyArgs = {
  updates: Array<WorkScheduleUpdates>;
};

/** Boolean expression to compare columns of type "name". All fields are combined with logical 'AND'. */
export type NameComparisonExp = {
  _eq?: InputMaybe<Scalars["name"]["input"]>;
  _gt?: InputMaybe<Scalars["name"]["input"]>;
  _gte?: InputMaybe<Scalars["name"]["input"]>;
  _in?: InputMaybe<Array<Scalars["name"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["name"]["input"]>;
  _lte?: InputMaybe<Scalars["name"]["input"]>;
  _neq?: InputMaybe<Scalars["name"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["name"]["input"]>>;
};

/** columns and relationships of "neon_auth.users_sync" */
export type NeonAuthUsersSync = {
  __typename: "neon_auth_users_sync";
  /** Timestamp when the user was created in the auth system */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Timestamp when the user was deleted in the auth system */
  deleted_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** User's email address from authentication provider */
  email: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier from the authentication provider */
  id: Scalars["String"]["output"];
  /** User's full name from authentication provider */
  name: Maybe<Scalars["String"]["output"]>;
  /** Complete JSON data from the authentication provider */
  raw_json: Scalars["jsonb"]["output"];
  /** Timestamp when the user was last updated in the auth system */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** columns and relationships of "neon_auth.users_sync" */
export type NeonAuthUsersSyncRawJsonArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "neon_auth.users_sync" */
export type NeonAuthUsersSyncAggregate = {
  __typename: "neon_auth_users_sync_aggregate";
  aggregate: Maybe<NeonAuthUsersSyncAggregateFields>;
  nodes: Array<NeonAuthUsersSync>;
};

/** aggregate fields of "neon_auth.users_sync" */
export type NeonAuthUsersSyncAggregateFields = {
  __typename: "neon_auth_users_sync_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<NeonAuthUsersSyncMaxFields>;
  min: Maybe<NeonAuthUsersSyncMinFields>;
};

/** aggregate fields of "neon_auth.users_sync" */
export type NeonAuthUsersSyncAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<NeonAuthUsersSyncSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type NeonAuthUsersSyncAppendInput = {
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars["jsonb"]["input"]>;
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
  users_sync_pkey = "users_sync_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type NeonAuthUsersSyncDeleteAtPathInput = {
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type NeonAuthUsersSyncDeleteElemInput = {
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type NeonAuthUsersSyncDeleteKeyInput = {
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "neon_auth.users_sync" */
export type NeonAuthUsersSyncInsertInput = {
  /** Timestamp when the user was deleted in the auth system */
  deleted_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Timestamp when the user was last updated in the auth system */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type NeonAuthUsersSyncMaxFields = {
  __typename: "neon_auth_users_sync_max_fields";
  /** Timestamp when the user was created in the auth system */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Timestamp when the user was deleted in the auth system */
  deleted_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** User's email address from authentication provider */
  email: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier from the authentication provider */
  id: Maybe<Scalars["String"]["output"]>;
  /** User's full name from authentication provider */
  name: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the user was last updated in the auth system */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type NeonAuthUsersSyncMinFields = {
  __typename: "neon_auth_users_sync_min_fields";
  /** Timestamp when the user was created in the auth system */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Timestamp when the user was deleted in the auth system */
  deleted_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** User's email address from authentication provider */
  email: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier from the authentication provider */
  id: Maybe<Scalars["String"]["output"]>;
  /** User's full name from authentication provider */
  name: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the user was last updated in the auth system */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "neon_auth.users_sync" */
export type NeonAuthUsersSyncMutationResponse = {
  __typename: "neon_auth_users_sync_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["String"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type NeonAuthUsersSyncPrependInput = {
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "neon_auth.users_sync" */
export enum NeonAuthUsersSyncSelectColumn {
  /** column name */
  created_at = "created_at",
  /** column name */
  deleted_at = "deleted_at",
  /** column name */
  email = "email",
  /** column name */
  id = "id",
  /** column name */
  name = "name",
  /** column name */
  raw_json = "raw_json",
  /** column name */
  updated_at = "updated_at",
}

/** input type for updating data in table "neon_auth.users_sync" */
export type NeonAuthUsersSyncSetInput = {
  /** Timestamp when the user was deleted in the auth system */
  deleted_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Timestamp when the user was last updated in the auth system */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
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
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Timestamp when the user was deleted in the auth system */
  deleted_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** User's email address from authentication provider */
  email?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier from the authentication provider */
  id?: InputMaybe<Scalars["String"]["input"]>;
  /** User's full name from authentication provider */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Timestamp when the user was last updated in the auth system */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "neon_auth.users_sync" */
export enum NeonAuthUsersSyncUpdateColumn {
  /** column name */
  deleted_at = "deleted_at",
  /** column name */
  raw_json = "raw_json",
  /** column name */
  updated_at = "updated_at",
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
  __typename: "notes";
  /** Content of the note */
  content: Scalars["String"]["output"];
  /** Timestamp when the note was created */
  created_at: Maybe<Scalars["timestamp"]["output"]>;
  /** Identifier of the entity this note is attached to */
  entity_id: Scalars["uuid"]["output"];
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entity_type: Scalars["String"]["output"];
  /** Unique identifier for the note */
  id: Scalars["uuid"]["output"];
  /** Whether the note is flagged as important */
  is_important: Maybe<Scalars["Boolean"]["output"]>;
  /** An array relationship */
  notes_by_client: Array<Clients>;
  /** An aggregate relationship */
  notes_by_client_aggregate: ClientsAggregate;
  /** An array relationship */
  notes_by_payroll: Array<Payrolls>;
  /** An aggregate relationship */
  notes_by_payroll_aggregate: PayrollsAggregate;
  /** Timestamp when the note was last updated */
  updated_at: Maybe<Scalars["timestamp"]["output"]>;
  /** An object relationship */
  user: Maybe<Users>;
  /** User who created the note */
  user_id: Maybe<Scalars["uuid"]["output"]>;
};

/** columns and relationships of "notes" */
export type NotesNotesByClientArgs = {
  distinct_on?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};

/** columns and relationships of "notes" */
export type NotesNotesByClientAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};

/** columns and relationships of "notes" */
export type NotesNotesByPayrollArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** columns and relationships of "notes" */
export type NotesNotesByPayrollAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** aggregated selection of "notes" */
export type NotesAggregate = {
  __typename: "notes_aggregate";
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<NotesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type NotesAggregateBoolExpBoolOr = {
  arguments: NotesSelectColumnNotesAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<NotesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type NotesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<NotesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<NotesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "notes" */
export type NotesAggregateFields = {
  __typename: "notes_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<NotesMaxFields>;
  min: Maybe<NotesMinFields>;
};

/** aggregate fields of "notes" */
export type NotesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<NotesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  notes_pkey = "notes_pkey",
}

/** input type for inserting data into table "notes" */
export type NotesInsertInput = {
  /** Content of the note */
  content?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the note was created */
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  /** Identifier of the entity this note is attached to */
  entity_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entity_type?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the note */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Whether the note is flagged as important */
  is_important?: InputMaybe<Scalars["Boolean"]["input"]>;
  notes_by_client?: InputMaybe<ClientsArrRelInsertInput>;
  notes_by_payroll?: InputMaybe<PayrollsArrRelInsertInput>;
  /** Timestamp when the note was last updated */
  updated_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  /** User who created the note */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type NotesMaxFields = {
  __typename: "notes_max_fields";
  /** Content of the note */
  content: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the note was created */
  created_at: Maybe<Scalars["timestamp"]["output"]>;
  /** Identifier of the entity this note is attached to */
  entity_id: Maybe<Scalars["uuid"]["output"]>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entity_type: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the note */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the note was last updated */
  updated_at: Maybe<Scalars["timestamp"]["output"]>;
  /** User who created the note */
  user_id: Maybe<Scalars["uuid"]["output"]>;
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
  __typename: "notes_min_fields";
  /** Content of the note */
  content: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the note was created */
  created_at: Maybe<Scalars["timestamp"]["output"]>;
  /** Identifier of the entity this note is attached to */
  entity_id: Maybe<Scalars["uuid"]["output"]>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entity_type: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the note */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the note was last updated */
  updated_at: Maybe<Scalars["timestamp"]["output"]>;
  /** User who created the note */
  user_id: Maybe<Scalars["uuid"]["output"]>;
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
  __typename: "notes_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "notes" */
export enum NotesSelectColumn {
  /** column name */
  content = "content",
  /** column name */
  created_at = "created_at",
  /** column name */
  entity_id = "entity_id",
  /** column name */
  entity_type = "entity_type",
  /** column name */
  id = "id",
  /** column name */
  is_important = "is_important",
  /** column name */
  updated_at = "updated_at",
  /** column name */
  user_id = "user_id",
}

/** select "notes_aggregate_bool_exp_bool_and_arguments_columns" columns of table "notes" */
export enum NotesSelectColumnNotesAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  is_important = "is_important",
}

/** select "notes_aggregate_bool_exp_bool_or_arguments_columns" columns of table "notes" */
export enum NotesSelectColumnNotesAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  is_important = "is_important",
}

/** input type for updating data in table "notes" */
export type NotesSetInput = {
  /** Content of the note */
  content?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the note was created */
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  /** Identifier of the entity this note is attached to */
  entity_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entity_type?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the note */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Whether the note is flagged as important */
  is_important?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Timestamp when the note was last updated */
  updated_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  /** User who created the note */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
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
  content?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the note was created */
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  /** Identifier of the entity this note is attached to */
  entity_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entity_type?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the note */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Whether the note is flagged as important */
  is_important?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Timestamp when the note was last updated */
  updated_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  /** User who created the note */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "notes" */
export enum NotesUpdateColumn {
  /** column name */
  content = "content",
  /** column name */
  created_at = "created_at",
  /** column name */
  entity_id = "entity_id",
  /** column name */
  entity_type = "entity_type",
  /** column name */
  id = "id",
  /** column name */
  is_important = "is_important",
  /** column name */
  updated_at = "updated_at",
  /** column name */
  user_id = "user_id",
}

export type NotesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<NotesSetInput>;
  /** filter the rows which have to be updated */
  where: NotesBoolExp;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type NumericComparisonExp = {
  _eq?: InputMaybe<Scalars["numeric"]["input"]>;
  _gt?: InputMaybe<Scalars["numeric"]["input"]>;
  _gte?: InputMaybe<Scalars["numeric"]["input"]>;
  _in?: InputMaybe<Array<Scalars["numeric"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["numeric"]["input"]>;
  _lte?: InputMaybe<Scalars["numeric"]["input"]>;
  _neq?: InputMaybe<Scalars["numeric"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["numeric"]["input"]>>;
};

/** column ordering options */
export enum OrderBy {
  /** in ascending order, nulls last */
  asc = "asc",
  /** in ascending order, nulls first */
  asc_nulls_first = "asc_nulls_first",
  /** in ascending order, nulls last */
  asc_nulls_last = "asc_nulls_last",
  /** in descending order, nulls first */
  desc = "desc",
  /** in descending order, nulls first */
  desc_nulls_first = "desc_nulls_first",
  /** in descending order, nulls last */
  desc_nulls_last = "desc_nulls_last",
}

/** columns and relationships of "payroll_activation_results" */
export type PayrollActivationResults = {
  __typename: "payroll_activation_results";
  action_taken: Scalars["String"]["output"];
  executed_at: Maybe<Scalars["timestamptz"]["output"]>;
  id: Scalars["uuid"]["output"];
  payroll_id: Scalars["uuid"]["output"];
  version_number: Scalars["Int"]["output"];
};

export type PayrollActivationResultsAggregate = {
  __typename: "payroll_activation_results_aggregate";
  aggregate: Maybe<PayrollActivationResultsAggregateFields>;
  nodes: Array<PayrollActivationResults>;
};

/** aggregate fields of "payroll_activation_results" */
export type PayrollActivationResultsAggregateFields = {
  __typename: "payroll_activation_results_aggregate_fields";
  avg: Maybe<PayrollActivationResultsAvgFields>;
  count: Scalars["Int"]["output"];
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type PayrollActivationResultsAvgFields = {
  __typename: "payroll_activation_results_avg_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
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
  payroll_activation_results_pkey = "payroll_activation_results_pkey",
}

/** input type for incrementing numeric columns in table "payroll_activation_results" */
export type PayrollActivationResultsIncInput = {
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "payroll_activation_results" */
export type PayrollActivationResultsInsertInput = {
  action_taken?: InputMaybe<Scalars["String"]["input"]>;
  executed_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate max on columns */
export type PayrollActivationResultsMaxFields = {
  __typename: "payroll_activation_results_max_fields";
  action_taken: Maybe<Scalars["String"]["output"]>;
  executed_at: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  payroll_id: Maybe<Scalars["uuid"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
};

/** aggregate min on columns */
export type PayrollActivationResultsMinFields = {
  __typename: "payroll_activation_results_min_fields";
  action_taken: Maybe<Scalars["String"]["output"]>;
  executed_at: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  payroll_id: Maybe<Scalars["uuid"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
};

/** response of any mutation on the table "payroll_activation_results" */
export type PayrollActivationResultsMutationResponse = {
  __typename: "payroll_activation_results_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "payroll_activation_results" */
export enum PayrollActivationResultsSelectColumn {
  /** column name */
  action_taken = "action_taken",
  /** column name */
  executed_at = "executed_at",
  /** column name */
  id = "id",
  /** column name */
  payroll_id = "payroll_id",
  /** column name */
  version_number = "version_number",
}

/** input type for updating data in table "payroll_activation_results" */
export type PayrollActivationResultsSetInput = {
  action_taken?: InputMaybe<Scalars["String"]["input"]>;
  executed_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate stddev on columns */
export type PayrollActivationResultsStddevFields = {
  __typename: "payroll_activation_results_stddev_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type PayrollActivationResultsStddevPopFields = {
  __typename: "payroll_activation_results_stddev_pop_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type PayrollActivationResultsStddevSampFields = {
  __typename: "payroll_activation_results_stddev_samp_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
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
  action_taken?: InputMaybe<Scalars["String"]["input"]>;
  executed_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate sum on columns */
export type PayrollActivationResultsSumFields = {
  __typename: "payroll_activation_results_sum_fields";
  version_number: Maybe<Scalars["Int"]["output"]>;
};

/** update columns of table "payroll_activation_results" */
export enum PayrollActivationResultsUpdateColumn {
  /** column name */
  action_taken = "action_taken",
  /** column name */
  executed_at = "executed_at",
  /** column name */
  id = "id",
  /** column name */
  payroll_id = "payroll_id",
  /** column name */
  version_number = "version_number",
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
  __typename: "payroll_activation_results_var_pop_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type PayrollActivationResultsVarSampFields = {
  __typename: "payroll_activation_results_var_samp_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type PayrollActivationResultsVarianceFields = {
  __typename: "payroll_activation_results_variance_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "payroll_assignment_audit" */
export type PayrollAssignmentAudit = {
  __typename: "payroll_assignment_audit";
  assignment_id: Maybe<Scalars["uuid"]["output"]>;
  change_reason: Maybe<Scalars["String"]["output"]>;
  changed_by: Maybe<Scalars["uuid"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  from_consultant_id: Maybe<Scalars["uuid"]["output"]>;
  id: Scalars["uuid"]["output"];
  /** An object relationship */
  payroll_assignment: Maybe<PayrollAssignments>;
  /** An object relationship */
  payroll_date: PayrollDates;
  payroll_date_id: Scalars["uuid"]["output"];
  to_consultant_id: Scalars["uuid"]["output"];
  /** An object relationship */
  user: Maybe<Users>;
  /** An object relationship */
  userByFromConsultantId: Maybe<Users>;
  /** An object relationship */
  userByToConsultantId: Users;
};

/** aggregated selection of "payroll_assignment_audit" */
export type PayrollAssignmentAuditAggregate = {
  __typename: "payroll_assignment_audit_aggregate";
  aggregate: Maybe<PayrollAssignmentAuditAggregateFields>;
  nodes: Array<PayrollAssignmentAudit>;
};

export type PayrollAssignmentAuditAggregateBoolExp = {
  count?: InputMaybe<PayrollAssignmentAuditAggregateBoolExpCount>;
};

export type PayrollAssignmentAuditAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "payroll_assignment_audit" */
export type PayrollAssignmentAuditAggregateFields = {
  __typename: "payroll_assignment_audit_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<PayrollAssignmentAuditMaxFields>;
  min: Maybe<PayrollAssignmentAuditMinFields>;
};

/** aggregate fields of "payroll_assignment_audit" */
export type PayrollAssignmentAuditAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  payroll_assignment_audit_pkey = "payroll_assignment_audit_pkey",
}

/** input type for inserting data into table "payroll_assignment_audit" */
export type PayrollAssignmentAuditInsertInput = {
  assignment_id?: InputMaybe<Scalars["uuid"]["input"]>;
  change_reason?: InputMaybe<Scalars["String"]["input"]>;
  changed_by?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  from_consultant_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll_assignment?: InputMaybe<PayrollAssignmentsObjRelInsertInput>;
  payroll_date?: InputMaybe<PayrollDatesObjRelInsertInput>;
  payroll_date_id?: InputMaybe<Scalars["uuid"]["input"]>;
  to_consultant_id?: InputMaybe<Scalars["uuid"]["input"]>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userByFromConsultantId?: InputMaybe<UsersObjRelInsertInput>;
  userByToConsultantId?: InputMaybe<UsersObjRelInsertInput>;
};

/** aggregate max on columns */
export type PayrollAssignmentAuditMaxFields = {
  __typename: "payroll_assignment_audit_max_fields";
  assignment_id: Maybe<Scalars["uuid"]["output"]>;
  change_reason: Maybe<Scalars["String"]["output"]>;
  changed_by: Maybe<Scalars["uuid"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  from_consultant_id: Maybe<Scalars["uuid"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  payroll_date_id: Maybe<Scalars["uuid"]["output"]>;
  to_consultant_id: Maybe<Scalars["uuid"]["output"]>;
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
  __typename: "payroll_assignment_audit_min_fields";
  assignment_id: Maybe<Scalars["uuid"]["output"]>;
  change_reason: Maybe<Scalars["String"]["output"]>;
  changed_by: Maybe<Scalars["uuid"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  from_consultant_id: Maybe<Scalars["uuid"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  payroll_date_id: Maybe<Scalars["uuid"]["output"]>;
  to_consultant_id: Maybe<Scalars["uuid"]["output"]>;
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
  __typename: "payroll_assignment_audit_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "payroll_assignment_audit" */
export enum PayrollAssignmentAuditSelectColumn {
  /** column name */
  assignment_id = "assignment_id",
  /** column name */
  change_reason = "change_reason",
  /** column name */
  changed_by = "changed_by",
  /** column name */
  created_at = "created_at",
  /** column name */
  from_consultant_id = "from_consultant_id",
  /** column name */
  id = "id",
  /** column name */
  payroll_date_id = "payroll_date_id",
  /** column name */
  to_consultant_id = "to_consultant_id",
}

/** input type for updating data in table "payroll_assignment_audit" */
export type PayrollAssignmentAuditSetInput = {
  assignment_id?: InputMaybe<Scalars["uuid"]["input"]>;
  change_reason?: InputMaybe<Scalars["String"]["input"]>;
  changed_by?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  from_consultant_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll_date_id?: InputMaybe<Scalars["uuid"]["input"]>;
  to_consultant_id?: InputMaybe<Scalars["uuid"]["input"]>;
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
  assignment_id?: InputMaybe<Scalars["uuid"]["input"]>;
  change_reason?: InputMaybe<Scalars["String"]["input"]>;
  changed_by?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  from_consultant_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll_date_id?: InputMaybe<Scalars["uuid"]["input"]>;
  to_consultant_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "payroll_assignment_audit" */
export enum PayrollAssignmentAuditUpdateColumn {
  /** column name */
  assignment_id = "assignment_id",
  /** column name */
  change_reason = "change_reason",
  /** column name */
  changed_by = "changed_by",
  /** column name */
  created_at = "created_at",
  /** column name */
  from_consultant_id = "from_consultant_id",
  /** column name */
  id = "id",
  /** column name */
  payroll_date_id = "payroll_date_id",
  /** column name */
  to_consultant_id = "to_consultant_id",
}

export type PayrollAssignmentAuditUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollAssignmentAuditSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollAssignmentAuditBoolExp;
};

/** columns and relationships of "payroll_assignments" */
export type PayrollAssignments = {
  __typename: "payroll_assignments";
  assignedBy: Maybe<Scalars["uuid"]["output"]>;
  assignedDate: Maybe<Scalars["timestamptz"]["output"]>;
  consultantId: Scalars["uuid"]["output"];
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  id: Scalars["uuid"]["output"];
  isBackup: Maybe<Scalars["Boolean"]["output"]>;
  originalConsultantId: Maybe<Scalars["uuid"]["output"]>;
  payrollDateId: Scalars["uuid"]["output"];
  /** An array relationship */
  payroll_assignment_audits: Array<PayrollAssignmentAudit>;
  /** An aggregate relationship */
  payroll_assignment_audits_aggregate: PayrollAssignmentAuditAggregate;
  /** An object relationship */
  payroll_date: PayrollDates;
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
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
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

/** columns and relationships of "payroll_assignments" */
export type PayrollAssignmentsPayrollAssignmentAuditsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

/** aggregated selection of "payroll_assignments" */
export type PayrollAssignmentsAggregate = {
  __typename: "payroll_assignments_aggregate";
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<PayrollAssignmentsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type PayrollAssignmentsAggregateBoolExpBoolOr = {
  arguments: PayrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<PayrollAssignmentsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type PayrollAssignmentsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<PayrollAssignmentsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "payroll_assignments" */
export type PayrollAssignmentsAggregateFields = {
  __typename: "payroll_assignments_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<PayrollAssignmentsMaxFields>;
  min: Maybe<PayrollAssignmentsMinFields>;
};

/** aggregate fields of "payroll_assignments" */
export type PayrollAssignmentsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  assignedBy?: InputMaybe<UuidComparisonExp>;
  assignedDate?: InputMaybe<TimestamptzComparisonExp>;
  consultantId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isBackup?: InputMaybe<BooleanComparisonExp>;
  originalConsultantId?: InputMaybe<UuidComparisonExp>;
  payrollDateId?: InputMaybe<UuidComparisonExp>;
  payroll_assignment_audits?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  payroll_assignment_audits_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateBoolExp>;
  payroll_date?: InputMaybe<PayrollDatesBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userByConsultantId?: InputMaybe<UsersBoolExp>;
  userByOriginalConsultantId?: InputMaybe<UsersBoolExp>;
};

/** unique or primary key constraints on table "payroll_assignments" */
export enum PayrollAssignmentsConstraint {
  /** unique or primary key constraint on columns "id" */
  payroll_assignments_pkey = "payroll_assignments_pkey",
  /** unique or primary key constraint on columns "payroll_date_id" */
  uq_payroll_assignment_payroll_date = "uq_payroll_assignment_payroll_date",
}

/** input type for inserting data into table "payroll_assignments" */
export type PayrollAssignmentsInsertInput = {
  assignedBy?: InputMaybe<Scalars["uuid"]["input"]>;
  assignedDate?: InputMaybe<Scalars["timestamptz"]["input"]>;
  consultantId?: InputMaybe<Scalars["uuid"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  isBackup?: InputMaybe<Scalars["Boolean"]["input"]>;
  originalConsultantId?: InputMaybe<Scalars["uuid"]["input"]>;
  payrollDateId?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll_assignment_audits?: InputMaybe<PayrollAssignmentAuditArrRelInsertInput>;
  payroll_date?: InputMaybe<PayrollDatesObjRelInsertInput>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userByConsultantId?: InputMaybe<UsersObjRelInsertInput>;
  userByOriginalConsultantId?: InputMaybe<UsersObjRelInsertInput>;
};

/** aggregate max on columns */
export type PayrollAssignmentsMaxFields = {
  __typename: "payroll_assignments_max_fields";
  assignedBy: Maybe<Scalars["uuid"]["output"]>;
  assignedDate: Maybe<Scalars["timestamptz"]["output"]>;
  consultantId: Maybe<Scalars["uuid"]["output"]>;
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  originalConsultantId: Maybe<Scalars["uuid"]["output"]>;
  payrollDateId: Maybe<Scalars["uuid"]["output"]>;
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "payroll_assignments_min_fields";
  assignedBy: Maybe<Scalars["uuid"]["output"]>;
  assignedDate: Maybe<Scalars["timestamptz"]["output"]>;
  consultantId: Maybe<Scalars["uuid"]["output"]>;
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  originalConsultantId: Maybe<Scalars["uuid"]["output"]>;
  payrollDateId: Maybe<Scalars["uuid"]["output"]>;
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "payroll_assignments_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  assignedBy?: InputMaybe<OrderBy>;
  assignedDate?: InputMaybe<OrderBy>;
  consultantId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isBackup?: InputMaybe<OrderBy>;
  originalConsultantId?: InputMaybe<OrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  payroll_assignment_audits_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateOrderBy>;
  payroll_date?: InputMaybe<PayrollDatesOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userByConsultantId?: InputMaybe<UsersOrderBy>;
  userByOriginalConsultantId?: InputMaybe<UsersOrderBy>;
};

/** primary key columns input for table: payroll_assignments */
export type PayrollAssignmentsPkColumnsInput = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "payroll_assignments" */
export enum PayrollAssignmentsSelectColumn {
  /** column name */
  assignedBy = "assignedBy",
  /** column name */
  assignedDate = "assignedDate",
  /** column name */
  consultantId = "consultantId",
  /** column name */
  createdAt = "createdAt",
  /** column name */
  id = "id",
  /** column name */
  isBackup = "isBackup",
  /** column name */
  originalConsultantId = "originalConsultantId",
  /** column name */
  payrollDateId = "payrollDateId",
  /** column name */
  updatedAt = "updatedAt",
}

/** select "payroll_assignments_aggregate_bool_exp_bool_and_arguments_columns" columns of table "payroll_assignments" */
export enum PayrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  isBackup = "isBackup",
}

/** select "payroll_assignments_aggregate_bool_exp_bool_or_arguments_columns" columns of table "payroll_assignments" */
export enum PayrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  isBackup = "isBackup",
}

/** input type for updating data in table "payroll_assignments" */
export type PayrollAssignmentsSetInput = {
  assignedBy?: InputMaybe<Scalars["uuid"]["input"]>;
  assignedDate?: InputMaybe<Scalars["timestamptz"]["input"]>;
  consultantId?: InputMaybe<Scalars["uuid"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  isBackup?: InputMaybe<Scalars["Boolean"]["input"]>;
  originalConsultantId?: InputMaybe<Scalars["uuid"]["input"]>;
  payrollDateId?: InputMaybe<Scalars["uuid"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
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
  assignedBy?: InputMaybe<Scalars["uuid"]["input"]>;
  assignedDate?: InputMaybe<Scalars["timestamptz"]["input"]>;
  consultantId?: InputMaybe<Scalars["uuid"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  isBackup?: InputMaybe<Scalars["Boolean"]["input"]>;
  originalConsultantId?: InputMaybe<Scalars["uuid"]["input"]>;
  payrollDateId?: InputMaybe<Scalars["uuid"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "payroll_assignments" */
export enum PayrollAssignmentsUpdateColumn {
  /** column name */
  assignedBy = "assignedBy",
  /** column name */
  assignedDate = "assignedDate",
  /** column name */
  consultantId = "consultantId",
  /** column name */
  createdAt = "createdAt",
  /** column name */
  id = "id",
  /** column name */
  isBackup = "isBackup",
  /** column name */
  originalConsultantId = "originalConsultantId",
  /** column name */
  payrollDateId = "payrollDateId",
  /** column name */
  updatedAt = "updatedAt",
}

export type PayrollAssignmentsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollAssignmentsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollAssignmentsBoolExp;
};

/** Boolean expression to compare columns of type "payroll_cycle_type". All fields are combined with logical 'AND'. */
export type PayrollCycleTypeComparisonExp = {
  _eq?: InputMaybe<Scalars["payroll_cycle_type"]["input"]>;
  _gt?: InputMaybe<Scalars["payroll_cycle_type"]["input"]>;
  _gte?: InputMaybe<Scalars["payroll_cycle_type"]["input"]>;
  _in?: InputMaybe<Array<Scalars["payroll_cycle_type"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["payroll_cycle_type"]["input"]>;
  _lte?: InputMaybe<Scalars["payroll_cycle_type"]["input"]>;
  _neq?: InputMaybe<Scalars["payroll_cycle_type"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["payroll_cycle_type"]["input"]>>;
};

/** columns and relationships of "payroll_cycles" */
export type PayrollCycles = {
  __typename: "payroll_cycles";
  /** An array relationship */
  adjustment_rules: Array<AdjustmentRules>;
  /** An aggregate relationship */
  adjustment_rules_aggregate: AdjustmentRulesAggregate;
  /** Timestamp when the cycle was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Detailed description of the payroll cycle */
  description: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the payroll cycle */
  id: Scalars["uuid"]["output"];
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name: Scalars["payroll_cycle_type"]["output"];
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrolls_aggregate: PayrollsAggregate;
  /** Timestamp when the cycle was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** columns and relationships of "payroll_cycles" */
export type PayrollCyclesAdjustmentRulesArgs = {
  distinct_on?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};

/** columns and relationships of "payroll_cycles" */
export type PayrollCyclesAdjustmentRulesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};

/** columns and relationships of "payroll_cycles" */
export type PayrollCyclesPayrollsArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** columns and relationships of "payroll_cycles" */
export type PayrollCyclesPayrollsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** aggregated selection of "payroll_cycles" */
export type PayrollCyclesAggregate = {
  __typename: "payroll_cycles_aggregate";
  aggregate: Maybe<PayrollCyclesAggregateFields>;
  nodes: Array<PayrollCycles>;
};

/** aggregate fields of "payroll_cycles" */
export type PayrollCyclesAggregateFields = {
  __typename: "payroll_cycles_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<PayrollCyclesMaxFields>;
  min: Maybe<PayrollCyclesMinFields>;
};

/** aggregate fields of "payroll_cycles" */
export type PayrollCyclesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  payroll_cycles_name_key = "payroll_cycles_name_key",
  /** unique or primary key constraint on columns "id" */
  payroll_cycles_pkey = "payroll_cycles_pkey",
}

/** input type for inserting data into table "payroll_cycles" */
export type PayrollCyclesInsertInput = {
  adjustment_rules?: InputMaybe<AdjustmentRulesArrRelInsertInput>;
  /** Timestamp when the cycle was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Detailed description of the payroll cycle */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the payroll cycle */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name?: InputMaybe<Scalars["payroll_cycle_type"]["input"]>;
  payrolls?: InputMaybe<PayrollsArrRelInsertInput>;
  /** Timestamp when the cycle was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type PayrollCyclesMaxFields = {
  __typename: "payroll_cycles_max_fields";
  /** Timestamp when the cycle was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Detailed description of the payroll cycle */
  description: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the payroll cycle */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name: Maybe<Scalars["payroll_cycle_type"]["output"]>;
  /** Timestamp when the cycle was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type PayrollCyclesMinFields = {
  __typename: "payroll_cycles_min_fields";
  /** Timestamp when the cycle was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Detailed description of the payroll cycle */
  description: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the payroll cycle */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name: Maybe<Scalars["payroll_cycle_type"]["output"]>;
  /** Timestamp when the cycle was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "payroll_cycles" */
export type PayrollCyclesMutationResponse = {
  __typename: "payroll_cycles_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "payroll_cycles" */
export enum PayrollCyclesSelectColumn {
  /** column name */
  created_at = "created_at",
  /** column name */
  description = "description",
  /** column name */
  id = "id",
  /** column name */
  name = "name",
  /** column name */
  updated_at = "updated_at",
}

/** input type for updating data in table "payroll_cycles" */
export type PayrollCyclesSetInput = {
  /** Timestamp when the cycle was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Detailed description of the payroll cycle */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the payroll cycle */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name?: InputMaybe<Scalars["payroll_cycle_type"]["input"]>;
  /** Timestamp when the cycle was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
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
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Detailed description of the payroll cycle */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the payroll cycle */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name?: InputMaybe<Scalars["payroll_cycle_type"]["input"]>;
  /** Timestamp when the cycle was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "payroll_cycles" */
export enum PayrollCyclesUpdateColumn {
  /** column name */
  created_at = "created_at",
  /** column name */
  description = "description",
  /** column name */
  id = "id",
  /** column name */
  name = "name",
  /** column name */
  updated_at = "updated_at",
}

export type PayrollCyclesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollCyclesSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollCyclesBoolExp;
};

/** columns and relationships of "payroll_dashboard_stats" */
export type PayrollDashboardStats = {
  __typename: "payroll_dashboard_stats";
  backup_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  client_name: Maybe<Scalars["String"]["output"]>;
  cycle_name: Maybe<Scalars["payroll_cycle_type"]["output"]>;
  future_dates: Maybe<Scalars["bigint"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  manager_user_id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  next_eft_date: Maybe<Scalars["date"]["output"]>;
  past_dates: Maybe<Scalars["bigint"]["output"]>;
  primary_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  status: Maybe<Scalars["payroll_status"]["output"]>;
  total_dates: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregated selection of "payroll_dashboard_stats" */
export type PayrollDashboardStatsAggregate = {
  __typename: "payroll_dashboard_stats_aggregate";
  aggregate: Maybe<PayrollDashboardStatsAggregateFields>;
  nodes: Array<PayrollDashboardStats>;
};

/** aggregate fields of "payroll_dashboard_stats" */
export type PayrollDashboardStatsAggregateFields = {
  __typename: "payroll_dashboard_stats_aggregate_fields";
  avg: Maybe<PayrollDashboardStatsAvgFields>;
  count: Scalars["Int"]["output"];
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type PayrollDashboardStatsAvgFields = {
  __typename: "payroll_dashboard_stats_avg_fields";
  future_dates: Maybe<Scalars["Float"]["output"]>;
  past_dates: Maybe<Scalars["Float"]["output"]>;
  total_dates: Maybe<Scalars["Float"]["output"]>;
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
  __typename: "payroll_dashboard_stats_max_fields";
  backup_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  client_name: Maybe<Scalars["String"]["output"]>;
  cycle_name: Maybe<Scalars["payroll_cycle_type"]["output"]>;
  future_dates: Maybe<Scalars["bigint"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  manager_user_id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  next_eft_date: Maybe<Scalars["date"]["output"]>;
  past_dates: Maybe<Scalars["bigint"]["output"]>;
  primary_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  status: Maybe<Scalars["payroll_status"]["output"]>;
  total_dates: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate min on columns */
export type PayrollDashboardStatsMinFields = {
  __typename: "payroll_dashboard_stats_min_fields";
  backup_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  client_name: Maybe<Scalars["String"]["output"]>;
  cycle_name: Maybe<Scalars["payroll_cycle_type"]["output"]>;
  future_dates: Maybe<Scalars["bigint"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  manager_user_id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  next_eft_date: Maybe<Scalars["date"]["output"]>;
  past_dates: Maybe<Scalars["bigint"]["output"]>;
  primary_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  status: Maybe<Scalars["payroll_status"]["output"]>;
  total_dates: Maybe<Scalars["bigint"]["output"]>;
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
  backup_consultant_user_id = "backup_consultant_user_id",
  /** column name */
  client_name = "client_name",
  /** column name */
  cycle_name = "cycle_name",
  /** column name */
  future_dates = "future_dates",
  /** column name */
  id = "id",
  /** column name */
  manager_user_id = "manager_user_id",
  /** column name */
  name = "name",
  /** column name */
  next_eft_date = "next_eft_date",
  /** column name */
  past_dates = "past_dates",
  /** column name */
  primary_consultant_user_id = "primary_consultant_user_id",
  /** column name */
  status = "status",
  /** column name */
  total_dates = "total_dates",
}

/** aggregate stddev on columns */
export type PayrollDashboardStatsStddevFields = {
  __typename: "payroll_dashboard_stats_stddev_fields";
  future_dates: Maybe<Scalars["Float"]["output"]>;
  past_dates: Maybe<Scalars["Float"]["output"]>;
  total_dates: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type PayrollDashboardStatsStddevPopFields = {
  __typename: "payroll_dashboard_stats_stddev_pop_fields";
  future_dates: Maybe<Scalars["Float"]["output"]>;
  past_dates: Maybe<Scalars["Float"]["output"]>;
  total_dates: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type PayrollDashboardStatsStddevSampFields = {
  __typename: "payroll_dashboard_stats_stddev_samp_fields";
  future_dates: Maybe<Scalars["Float"]["output"]>;
  past_dates: Maybe<Scalars["Float"]["output"]>;
  total_dates: Maybe<Scalars["Float"]["output"]>;
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
  backup_consultant_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  client_name?: InputMaybe<Scalars["String"]["input"]>;
  cycle_name?: InputMaybe<Scalars["payroll_cycle_type"]["input"]>;
  future_dates?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  manager_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  next_eft_date?: InputMaybe<Scalars["date"]["input"]>;
  past_dates?: InputMaybe<Scalars["bigint"]["input"]>;
  primary_consultant_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  status?: InputMaybe<Scalars["payroll_status"]["input"]>;
  total_dates?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate sum on columns */
export type PayrollDashboardStatsSumFields = {
  __typename: "payroll_dashboard_stats_sum_fields";
  future_dates: Maybe<Scalars["bigint"]["output"]>;
  past_dates: Maybe<Scalars["bigint"]["output"]>;
  total_dates: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate var_pop on columns */
export type PayrollDashboardStatsVarPopFields = {
  __typename: "payroll_dashboard_stats_var_pop_fields";
  future_dates: Maybe<Scalars["Float"]["output"]>;
  past_dates: Maybe<Scalars["Float"]["output"]>;
  total_dates: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type PayrollDashboardStatsVarSampFields = {
  __typename: "payroll_dashboard_stats_var_samp_fields";
  future_dates: Maybe<Scalars["Float"]["output"]>;
  past_dates: Maybe<Scalars["Float"]["output"]>;
  total_dates: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type PayrollDashboardStatsVarianceFields = {
  __typename: "payroll_dashboard_stats_variance_fields";
  future_dates: Maybe<Scalars["Float"]["output"]>;
  past_dates: Maybe<Scalars["Float"]["output"]>;
  total_dates: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to compare columns of type "payroll_date_type". All fields are combined with logical 'AND'. */
export type PayrollDateTypeComparisonExp = {
  _eq?: InputMaybe<Scalars["payroll_date_type"]["input"]>;
  _gt?: InputMaybe<Scalars["payroll_date_type"]["input"]>;
  _gte?: InputMaybe<Scalars["payroll_date_type"]["input"]>;
  _in?: InputMaybe<Array<Scalars["payroll_date_type"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["payroll_date_type"]["input"]>;
  _lte?: InputMaybe<Scalars["payroll_date_type"]["input"]>;
  _neq?: InputMaybe<Scalars["payroll_date_type"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["payroll_date_type"]["input"]>>;
};

/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypes = {
  __typename: "payroll_date_types";
  /** An array relationship */
  adjustment_rules: Array<AdjustmentRules>;
  /** An aggregate relationship */
  adjustment_rules_aggregate: AdjustmentRulesAggregate;
  /** Timestamp when the date type was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Detailed description of how this date type works */
  description: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the payroll date type */
  id: Scalars["uuid"]["output"];
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name: Scalars["payroll_date_type"]["output"];
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrolls_aggregate: PayrollsAggregate;
  /** Timestamp when the date type was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypesAdjustmentRulesArgs = {
  distinct_on?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};

/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypesAdjustmentRulesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};

/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypesPayrollsArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** columns and relationships of "payroll_date_types" */
export type PayrollDateTypesPayrollsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** aggregated selection of "payroll_date_types" */
export type PayrollDateTypesAggregate = {
  __typename: "payroll_date_types_aggregate";
  aggregate: Maybe<PayrollDateTypesAggregateFields>;
  nodes: Array<PayrollDateTypes>;
};

/** aggregate fields of "payroll_date_types" */
export type PayrollDateTypesAggregateFields = {
  __typename: "payroll_date_types_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<PayrollDateTypesMaxFields>;
  min: Maybe<PayrollDateTypesMinFields>;
};

/** aggregate fields of "payroll_date_types" */
export type PayrollDateTypesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  payroll_date_types_name_key = "payroll_date_types_name_key",
  /** unique or primary key constraint on columns "id" */
  payroll_date_types_pkey = "payroll_date_types_pkey",
}

/** input type for inserting data into table "payroll_date_types" */
export type PayrollDateTypesInsertInput = {
  adjustment_rules?: InputMaybe<AdjustmentRulesArrRelInsertInput>;
  /** Timestamp when the date type was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Detailed description of how this date type works */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the payroll date type */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name?: InputMaybe<Scalars["payroll_date_type"]["input"]>;
  payrolls?: InputMaybe<PayrollsArrRelInsertInput>;
  /** Timestamp when the date type was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type PayrollDateTypesMaxFields = {
  __typename: "payroll_date_types_max_fields";
  /** Timestamp when the date type was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Detailed description of how this date type works */
  description: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the payroll date type */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name: Maybe<Scalars["payroll_date_type"]["output"]>;
  /** Timestamp when the date type was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type PayrollDateTypesMinFields = {
  __typename: "payroll_date_types_min_fields";
  /** Timestamp when the date type was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Detailed description of how this date type works */
  description: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the payroll date type */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name: Maybe<Scalars["payroll_date_type"]["output"]>;
  /** Timestamp when the date type was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "payroll_date_types" */
export type PayrollDateTypesMutationResponse = {
  __typename: "payroll_date_types_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "payroll_date_types" */
export enum PayrollDateTypesSelectColumn {
  /** column name */
  created_at = "created_at",
  /** column name */
  description = "description",
  /** column name */
  id = "id",
  /** column name */
  name = "name",
  /** column name */
  updated_at = "updated_at",
}

/** input type for updating data in table "payroll_date_types" */
export type PayrollDateTypesSetInput = {
  /** Timestamp when the date type was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Detailed description of how this date type works */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the payroll date type */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name?: InputMaybe<Scalars["payroll_date_type"]["input"]>;
  /** Timestamp when the date type was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
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
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Detailed description of how this date type works */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the payroll date type */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name?: InputMaybe<Scalars["payroll_date_type"]["input"]>;
  /** Timestamp when the date type was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "payroll_date_types" */
export enum PayrollDateTypesUpdateColumn {
  /** column name */
  created_at = "created_at",
  /** column name */
  description = "description",
  /** column name */
  id = "id",
  /** column name */
  name = "name",
  /** column name */
  updated_at = "updated_at",
}

export type PayrollDateTypesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollDateTypesSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollDateTypesBoolExp;
};

/** columns and relationships of "payroll_dates" */
export type PayrollDates = {
  __typename: "payroll_dates";
  /** Final EFT date after holiday and weekend adjustments */
  adjustedEftDate: Scalars["date"]["output"];
  /** Timestamp when the date record was created */
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  /** Unique identifier for the payroll date */
  id: Scalars["uuid"]["output"];
  /** Additional notes about this payroll date */
  notes: Maybe<Scalars["String"]["output"]>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate: Scalars["date"]["output"];
  /** An object relationship */
  payroll: Payrolls;
  /** Reference to the payroll this date belongs to */
  payrollId: Scalars["uuid"]["output"];
  /** An object relationship */
  payroll_assignment: Maybe<PayrollAssignments>;
  /** An array relationship */
  payroll_assignment_audits: Array<PayrollAssignmentAudit>;
  /** An aggregate relationship */
  payroll_assignment_audits_aggregate: PayrollAssignmentAuditAggregate;
  /** Date when payroll processing must be completed */
  processingDate: Scalars["date"]["output"];
  /** Timestamp when the date record was last updated */
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
};

/** columns and relationships of "payroll_dates" */
export type PayrollDatesPayrollAssignmentAuditsArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

/** columns and relationships of "payroll_dates" */
export type PayrollDatesPayrollAssignmentAuditsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

/** aggregated selection of "payroll_dates" */
export type PayrollDatesAggregate = {
  __typename: "payroll_dates_aggregate";
  aggregate: Maybe<PayrollDatesAggregateFields>;
  nodes: Array<PayrollDates>;
};

export type PayrollDatesAggregateBoolExp = {
  count?: InputMaybe<PayrollDatesAggregateBoolExpCount>;
};

export type PayrollDatesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<PayrollDatesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "payroll_dates" */
export type PayrollDatesAggregateFields = {
  __typename: "payroll_dates_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<PayrollDatesMaxFields>;
  min: Maybe<PayrollDatesMinFields>;
};

/** aggregate fields of "payroll_dates" */
export type PayrollDatesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  adjustedEftDate?: InputMaybe<DateComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  notes?: InputMaybe<StringComparisonExp>;
  originalEftDate?: InputMaybe<DateComparisonExp>;
  payroll?: InputMaybe<PayrollsBoolExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  payroll_assignment?: InputMaybe<PayrollAssignmentsBoolExp>;
  payroll_assignment_audits?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  payroll_assignment_audits_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateBoolExp>;
  processingDate?: InputMaybe<DateComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "payroll_dates" */
export enum PayrollDatesConstraint {
  /** unique or primary key constraint on columns "original_eft_date", "payroll_id" */
  idx_unique_payroll_date = "idx_unique_payroll_date",
  /** unique or primary key constraint on columns "id" */
  payroll_dates_pkey = "payroll_dates_pkey",
}

/** input type for inserting data into table "payroll_dates" */
export type PayrollDatesInsertInput = {
  /** Final EFT date after holiday and weekend adjustments */
  adjustedEftDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the date record was created */
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<Scalars["String"]["input"]>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate?: InputMaybe<Scalars["date"]["input"]>;
  payroll?: InputMaybe<PayrollsObjRelInsertInput>;
  /** Reference to the payroll this date belongs to */
  payrollId?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll_assignment?: InputMaybe<PayrollAssignmentsObjRelInsertInput>;
  payroll_assignment_audits?: InputMaybe<PayrollAssignmentAuditArrRelInsertInput>;
  /** Date when payroll processing must be completed */
  processingDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the date record was last updated */
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type PayrollDatesMaxFields = {
  __typename: "payroll_dates_max_fields";
  /** Final EFT date after holiday and weekend adjustments */
  adjustedEftDate: Maybe<Scalars["date"]["output"]>;
  /** Timestamp when the date record was created */
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  /** Unique identifier for the payroll date */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Additional notes about this payroll date */
  notes: Maybe<Scalars["String"]["output"]>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate: Maybe<Scalars["date"]["output"]>;
  /** Reference to the payroll this date belongs to */
  payrollId: Maybe<Scalars["uuid"]["output"]>;
  /** Date when payroll processing must be completed */
  processingDate: Maybe<Scalars["date"]["output"]>;
  /** Timestamp when the date record was last updated */
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "payroll_dates_min_fields";
  /** Final EFT date after holiday and weekend adjustments */
  adjustedEftDate: Maybe<Scalars["date"]["output"]>;
  /** Timestamp when the date record was created */
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  /** Unique identifier for the payroll date */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Additional notes about this payroll date */
  notes: Maybe<Scalars["String"]["output"]>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate: Maybe<Scalars["date"]["output"]>;
  /** Reference to the payroll this date belongs to */
  payrollId: Maybe<Scalars["uuid"]["output"]>;
  /** Date when payroll processing must be completed */
  processingDate: Maybe<Scalars["date"]["output"]>;
  /** Timestamp when the date record was last updated */
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "payroll_dates_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  adjustedEftDate?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  originalEftDate?: InputMaybe<OrderBy>;
  payroll?: InputMaybe<PayrollsOrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  payroll_assignment?: InputMaybe<PayrollAssignmentsOrderBy>;
  payroll_assignment_audits_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateOrderBy>;
  processingDate?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_dates */
export type PayrollDatesPkColumnsInput = {
  /** Unique identifier for the payroll date */
  id: Scalars["uuid"]["input"];
};

/** select columns of table "payroll_dates" */
export enum PayrollDatesSelectColumn {
  /** column name */
  adjustedEftDate = "adjustedEftDate",
  /** column name */
  createdAt = "createdAt",
  /** column name */
  id = "id",
  /** column name */
  notes = "notes",
  /** column name */
  originalEftDate = "originalEftDate",
  /** column name */
  payrollId = "payrollId",
  /** column name */
  processingDate = "processingDate",
  /** column name */
  updatedAt = "updatedAt",
}

/** input type for updating data in table "payroll_dates" */
export type PayrollDatesSetInput = {
  /** Final EFT date after holiday and weekend adjustments */
  adjustedEftDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the date record was created */
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<Scalars["String"]["input"]>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Reference to the payroll this date belongs to */
  payrollId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Date when payroll processing must be completed */
  processingDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the date record was last updated */
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
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
  adjustedEftDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the date record was created */
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<Scalars["String"]["input"]>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Reference to the payroll this date belongs to */
  payrollId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Date when payroll processing must be completed */
  processingDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the date record was last updated */
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "payroll_dates" */
export enum PayrollDatesUpdateColumn {
  /** column name */
  adjustedEftDate = "adjustedEftDate",
  /** column name */
  createdAt = "createdAt",
  /** column name */
  id = "id",
  /** column name */
  notes = "notes",
  /** column name */
  originalEftDate = "originalEftDate",
  /** column name */
  payrollId = "payrollId",
  /** column name */
  processingDate = "processingDate",
  /** column name */
  updatedAt = "updatedAt",
}

export type PayrollDatesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollDatesSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollDatesBoolExp;
};

/** Boolean expression to compare columns of type "payroll_status". All fields are combined with logical 'AND'. */
export type PayrollStatusComparisonExp = {
  _eq?: InputMaybe<Scalars["payroll_status"]["input"]>;
  _gt?: InputMaybe<Scalars["payroll_status"]["input"]>;
  _gte?: InputMaybe<Scalars["payroll_status"]["input"]>;
  _in?: InputMaybe<Array<Scalars["payroll_status"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["payroll_status"]["input"]>;
  _lte?: InputMaybe<Scalars["payroll_status"]["input"]>;
  _neq?: InputMaybe<Scalars["payroll_status"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["payroll_status"]["input"]>>;
};

/** columns and relationships of "payroll_triggers_status" */
export type PayrollTriggersStatus = {
  __typename: "payroll_triggers_status";
  action_statement: Maybe<Scalars["String"]["output"]>;
  action_timing: Maybe<Scalars["String"]["output"]>;
  event_manipulation: Maybe<Scalars["String"]["output"]>;
  event_object_table: Maybe<Scalars["name"]["output"]>;
  trigger_name: Maybe<Scalars["name"]["output"]>;
};

/** aggregated selection of "payroll_triggers_status" */
export type PayrollTriggersStatusAggregate = {
  __typename: "payroll_triggers_status_aggregate";
  aggregate: Maybe<PayrollTriggersStatusAggregateFields>;
  nodes: Array<PayrollTriggersStatus>;
};

/** aggregate fields of "payroll_triggers_status" */
export type PayrollTriggersStatusAggregateFields = {
  __typename: "payroll_triggers_status_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<PayrollTriggersStatusMaxFields>;
  min: Maybe<PayrollTriggersStatusMinFields>;
};

/** aggregate fields of "payroll_triggers_status" */
export type PayrollTriggersStatusAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  __typename: "payroll_triggers_status_max_fields";
  action_statement: Maybe<Scalars["String"]["output"]>;
  action_timing: Maybe<Scalars["String"]["output"]>;
  event_manipulation: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type PayrollTriggersStatusMinFields = {
  __typename: "payroll_triggers_status_min_fields";
  action_statement: Maybe<Scalars["String"]["output"]>;
  action_timing: Maybe<Scalars["String"]["output"]>;
  event_manipulation: Maybe<Scalars["String"]["output"]>;
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
  action_statement = "action_statement",
  /** column name */
  action_timing = "action_timing",
  /** column name */
  event_manipulation = "event_manipulation",
  /** column name */
  event_object_table = "event_object_table",
  /** column name */
  trigger_name = "trigger_name",
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
  action_statement?: InputMaybe<Scalars["String"]["input"]>;
  action_timing?: InputMaybe<Scalars["String"]["input"]>;
  event_manipulation?: InputMaybe<Scalars["String"]["input"]>;
  event_object_table?: InputMaybe<Scalars["name"]["input"]>;
  trigger_name?: InputMaybe<Scalars["name"]["input"]>;
};

/** columns and relationships of "payroll_version_history_results" */
export type PayrollVersionHistoryResults = {
  __typename: "payroll_version_history_results";
  active: Scalars["Boolean"]["output"];
  go_live_date: Maybe<Scalars["date"]["output"]>;
  id: Scalars["uuid"]["output"];
  is_current: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  payroll_id: Scalars["uuid"]["output"];
  queried_at: Maybe<Scalars["timestamptz"]["output"]>;
  superseded_date: Maybe<Scalars["date"]["output"]>;
  version_number: Scalars["Int"]["output"];
  version_reason: Maybe<Scalars["String"]["output"]>;
};

export type PayrollVersionHistoryResultsAggregate = {
  __typename: "payroll_version_history_results_aggregate";
  aggregate: Maybe<PayrollVersionHistoryResultsAggregateFields>;
  nodes: Array<PayrollVersionHistoryResults>;
};

/** aggregate fields of "payroll_version_history_results" */
export type PayrollVersionHistoryResultsAggregateFields = {
  __typename: "payroll_version_history_results_aggregate_fields";
  avg: Maybe<PayrollVersionHistoryResultsAvgFields>;
  count: Scalars["Int"]["output"];
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type PayrollVersionHistoryResultsAvgFields = {
  __typename: "payroll_version_history_results_avg_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
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
  payroll_version_history_results_pkey = "payroll_version_history_results_pkey",
}

/** input type for incrementing numeric columns in table "payroll_version_history_results" */
export type PayrollVersionHistoryResultsIncInput = {
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "payroll_version_history_results" */
export type PayrollVersionHistoryResultsInsertInput = {
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  go_live_date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  is_current?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  queried_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  superseded_date?: InputMaybe<Scalars["date"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
  version_reason?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type PayrollVersionHistoryResultsMaxFields = {
  __typename: "payroll_version_history_results_max_fields";
  go_live_date: Maybe<Scalars["date"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  payroll_id: Maybe<Scalars["uuid"]["output"]>;
  queried_at: Maybe<Scalars["timestamptz"]["output"]>;
  superseded_date: Maybe<Scalars["date"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
  version_reason: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type PayrollVersionHistoryResultsMinFields = {
  __typename: "payroll_version_history_results_min_fields";
  go_live_date: Maybe<Scalars["date"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  payroll_id: Maybe<Scalars["uuid"]["output"]>;
  queried_at: Maybe<Scalars["timestamptz"]["output"]>;
  superseded_date: Maybe<Scalars["date"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
  version_reason: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "payroll_version_history_results" */
export type PayrollVersionHistoryResultsMutationResponse = {
  __typename: "payroll_version_history_results_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "payroll_version_history_results" */
export enum PayrollVersionHistoryResultsSelectColumn {
  /** column name */
  active = "active",
  /** column name */
  go_live_date = "go_live_date",
  /** column name */
  id = "id",
  /** column name */
  is_current = "is_current",
  /** column name */
  name = "name",
  /** column name */
  payroll_id = "payroll_id",
  /** column name */
  queried_at = "queried_at",
  /** column name */
  superseded_date = "superseded_date",
  /** column name */
  version_number = "version_number",
  /** column name */
  version_reason = "version_reason",
}

/** input type for updating data in table "payroll_version_history_results" */
export type PayrollVersionHistoryResultsSetInput = {
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  go_live_date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  is_current?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  queried_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  superseded_date?: InputMaybe<Scalars["date"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
  version_reason?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate stddev on columns */
export type PayrollVersionHistoryResultsStddevFields = {
  __typename: "payroll_version_history_results_stddev_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type PayrollVersionHistoryResultsStddevPopFields = {
  __typename: "payroll_version_history_results_stddev_pop_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type PayrollVersionHistoryResultsStddevSampFields = {
  __typename: "payroll_version_history_results_stddev_samp_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
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
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  go_live_date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  is_current?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  queried_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  superseded_date?: InputMaybe<Scalars["date"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
  version_reason?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate sum on columns */
export type PayrollVersionHistoryResultsSumFields = {
  __typename: "payroll_version_history_results_sum_fields";
  version_number: Maybe<Scalars["Int"]["output"]>;
};

/** update columns of table "payroll_version_history_results" */
export enum PayrollVersionHistoryResultsUpdateColumn {
  /** column name */
  active = "active",
  /** column name */
  go_live_date = "go_live_date",
  /** column name */
  id = "id",
  /** column name */
  is_current = "is_current",
  /** column name */
  name = "name",
  /** column name */
  payroll_id = "payroll_id",
  /** column name */
  queried_at = "queried_at",
  /** column name */
  superseded_date = "superseded_date",
  /** column name */
  version_number = "version_number",
  /** column name */
  version_reason = "version_reason",
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
  __typename: "payroll_version_history_results_var_pop_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type PayrollVersionHistoryResultsVarSampFields = {
  __typename: "payroll_version_history_results_var_samp_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type PayrollVersionHistoryResultsVarianceFields = {
  __typename: "payroll_version_history_results_variance_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "payroll_version_results" */
export type PayrollVersionResults = {
  __typename: "payroll_version_results";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  created_by_user_id: Maybe<Scalars["uuid"]["output"]>;
  dates_deleted: Scalars["Int"]["output"];
  id: Scalars["uuid"]["output"];
  message: Scalars["String"]["output"];
  new_payroll_id: Scalars["uuid"]["output"];
  new_version_number: Scalars["Int"]["output"];
  old_payroll_id: Scalars["uuid"]["output"];
};

export type PayrollVersionResultsAggregate = {
  __typename: "payroll_version_results_aggregate";
  aggregate: Maybe<PayrollVersionResultsAggregateFields>;
  nodes: Array<PayrollVersionResults>;
};

/** aggregate fields of "payroll_version_results" */
export type PayrollVersionResultsAggregateFields = {
  __typename: "payroll_version_results_aggregate_fields";
  avg: Maybe<PayrollVersionResultsAvgFields>;
  count: Scalars["Int"]["output"];
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type PayrollVersionResultsAvgFields = {
  __typename: "payroll_version_results_avg_fields";
  dates_deleted: Maybe<Scalars["Float"]["output"]>;
  new_version_number: Maybe<Scalars["Float"]["output"]>;
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
  payroll_version_results_pkey = "payroll_version_results_pkey",
}

/** input type for incrementing numeric columns in table "payroll_version_results" */
export type PayrollVersionResultsIncInput = {
  dates_deleted?: InputMaybe<Scalars["Int"]["input"]>;
  new_version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "payroll_version_results" */
export type PayrollVersionResultsInsertInput = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  dates_deleted?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  message?: InputMaybe<Scalars["String"]["input"]>;
  new_payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  new_version_number?: InputMaybe<Scalars["Int"]["input"]>;
  old_payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type PayrollVersionResultsMaxFields = {
  __typename: "payroll_version_results_max_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  created_by_user_id: Maybe<Scalars["uuid"]["output"]>;
  dates_deleted: Maybe<Scalars["Int"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  message: Maybe<Scalars["String"]["output"]>;
  new_payroll_id: Maybe<Scalars["uuid"]["output"]>;
  new_version_number: Maybe<Scalars["Int"]["output"]>;
  old_payroll_id: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type PayrollVersionResultsMinFields = {
  __typename: "payroll_version_results_min_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  created_by_user_id: Maybe<Scalars["uuid"]["output"]>;
  dates_deleted: Maybe<Scalars["Int"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  message: Maybe<Scalars["String"]["output"]>;
  new_payroll_id: Maybe<Scalars["uuid"]["output"]>;
  new_version_number: Maybe<Scalars["Int"]["output"]>;
  old_payroll_id: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "payroll_version_results" */
export type PayrollVersionResultsMutationResponse = {
  __typename: "payroll_version_results_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "payroll_version_results" */
export enum PayrollVersionResultsSelectColumn {
  /** column name */
  created_at = "created_at",
  /** column name */
  created_by_user_id = "created_by_user_id",
  /** column name */
  dates_deleted = "dates_deleted",
  /** column name */
  id = "id",
  /** column name */
  message = "message",
  /** column name */
  new_payroll_id = "new_payroll_id",
  /** column name */
  new_version_number = "new_version_number",
  /** column name */
  old_payroll_id = "old_payroll_id",
}

/** input type for updating data in table "payroll_version_results" */
export type PayrollVersionResultsSetInput = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  dates_deleted?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  message?: InputMaybe<Scalars["String"]["input"]>;
  new_payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  new_version_number?: InputMaybe<Scalars["Int"]["input"]>;
  old_payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type PayrollVersionResultsStddevFields = {
  __typename: "payroll_version_results_stddev_fields";
  dates_deleted: Maybe<Scalars["Float"]["output"]>;
  new_version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type PayrollVersionResultsStddevPopFields = {
  __typename: "payroll_version_results_stddev_pop_fields";
  dates_deleted: Maybe<Scalars["Float"]["output"]>;
  new_version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type PayrollVersionResultsStddevSampFields = {
  __typename: "payroll_version_results_stddev_samp_fields";
  dates_deleted: Maybe<Scalars["Float"]["output"]>;
  new_version_number: Maybe<Scalars["Float"]["output"]>;
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
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  dates_deleted?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  message?: InputMaybe<Scalars["String"]["input"]>;
  new_payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  new_version_number?: InputMaybe<Scalars["Int"]["input"]>;
  old_payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type PayrollVersionResultsSumFields = {
  __typename: "payroll_version_results_sum_fields";
  dates_deleted: Maybe<Scalars["Int"]["output"]>;
  new_version_number: Maybe<Scalars["Int"]["output"]>;
};

/** update columns of table "payroll_version_results" */
export enum PayrollVersionResultsUpdateColumn {
  /** column name */
  created_at = "created_at",
  /** column name */
  created_by_user_id = "created_by_user_id",
  /** column name */
  dates_deleted = "dates_deleted",
  /** column name */
  id = "id",
  /** column name */
  message = "message",
  /** column name */
  new_payroll_id = "new_payroll_id",
  /** column name */
  new_version_number = "new_version_number",
  /** column name */
  old_payroll_id = "old_payroll_id",
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
  __typename: "payroll_version_results_var_pop_fields";
  dates_deleted: Maybe<Scalars["Float"]["output"]>;
  new_version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type PayrollVersionResultsVarSampFields = {
  __typename: "payroll_version_results_var_samp_fields";
  dates_deleted: Maybe<Scalars["Float"]["output"]>;
  new_version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type PayrollVersionResultsVarianceFields = {
  __typename: "payroll_version_results_variance_fields";
  dates_deleted: Maybe<Scalars["Float"]["output"]>;
  new_version_number: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "payrolls" */
export type Payrolls = {
  __typename: "payrolls";
  /** An object relationship */
  backupConsultant: Maybe<Users>;
  /** Backup consultant for this payroll */
  backupConsultantUserId: Maybe<Scalars["uuid"]["output"]>;
  /** An array relationship */
  billingItems: Array<BillingItems>;
  /** An aggregate relationship */
  billingItems_aggregate: BillingItemsAggregate;
  /** An array relationship */
  childPayrolls: Array<Payrolls>;
  /** An aggregate relationship */
  childPayrolls_aggregate: PayrollsAggregate;
  /** An object relationship */
  client: Clients;
  /** Reference to the client this payroll belongs to */
  clientId: Scalars["uuid"]["output"];
  /** Timestamp when the payroll was created */
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  createdByUserId: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the payroll cycle */
  cycleId: Scalars["uuid"]["output"];
  /** Reference to the payroll date type */
  dateTypeId: Scalars["uuid"]["output"];
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars["Int"]["output"]>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars["Int"]["output"]>;
  /** The date when the payroll went live in the system */
  goLiveDate: Maybe<Scalars["date"]["output"]>;
  /** Unique identifier for the payroll */
  id: Scalars["uuid"]["output"];
  /** An object relationship */
  manager: Maybe<Users>;
  /** Manager overseeing this payroll */
  managerUserId: Maybe<Scalars["uuid"]["output"]>;
  /** Name of the payroll */
  name: Scalars["String"]["output"];
  /** An object relationship */
  parentPayroll: Maybe<Payrolls>;
  parentPayrollId: Maybe<Scalars["uuid"]["output"]>;
  /** An object relationship */
  payrollCycle: PayrollCycles;
  /** An object relationship */
  payrollDateType: PayrollDateTypes;
  /** An array relationship */
  payrollDates: Array<PayrollDates>;
  /** An aggregate relationship */
  payrollDates_aggregate: PayrollDatesAggregate;
  /** External payroll system used for this client */
  payrollSystem: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  primaryConsultant: Maybe<Users>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId: Maybe<Scalars["uuid"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Scalars["Int"]["output"];
  /** Number of hours required to process this payroll */
  processingTime: Scalars["Int"]["output"];
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status: Scalars["payroll_status"]["output"];
  supersededDate: Maybe<Scalars["date"]["output"]>;
  /** Timestamp when the payroll was last updated */
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
  versionNumber: Maybe<Scalars["Int"]["output"]>;
  versionReason: Maybe<Scalars["String"]["output"]>;
};

/** columns and relationships of "payrolls" */
export type PayrollsBillingItemsArgs = {
  distinct_on?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};

/** columns and relationships of "payrolls" */
export type PayrollsBillingItemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};

/** columns and relationships of "payrolls" */
export type PayrollsChildPayrollsArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** columns and relationships of "payrolls" */
export type PayrollsChildPayrollsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** columns and relationships of "payrolls" */
export type PayrollsPayrollDatesArgs = {
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};

/** columns and relationships of "payrolls" */
export type PayrollsPayrollDatesAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};

/** aggregated selection of "payrolls" */
export type PayrollsAggregate = {
  __typename: "payrolls_aggregate";
  aggregate: Maybe<PayrollsAggregateFields>;
  nodes: Array<Payrolls>;
};

export type PayrollsAggregateBoolExp = {
  count?: InputMaybe<PayrollsAggregateBoolExpCount>;
};

export type PayrollsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PayrollsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<PayrollsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "payrolls" */
export type PayrollsAggregateFields = {
  __typename: "payrolls_aggregate_fields";
  avg: Maybe<PayrollsAvgFields>;
  count: Scalars["Int"]["output"];
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  __typename: "payrolls_avg_fields";
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars["Float"]["output"]>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars["Float"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars["Float"]["output"]>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars["Float"]["output"]>;
  versionNumber: Maybe<Scalars["Float"]["output"]>;
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
  billingItems_aggregate?: InputMaybe<BillingItemsAggregateBoolExp>;
  childPayrolls?: InputMaybe<PayrollsBoolExp>;
  childPayrolls_aggregate?: InputMaybe<PayrollsAggregateBoolExp>;
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
  payrollDates_aggregate?: InputMaybe<PayrollDatesAggregateBoolExp>;
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
  only_one_current_version_per_family = "only_one_current_version_per_family",
  /** unique or primary key constraint on columns "id" */
  payrolls_pkey = "payrolls_pkey",
}

/** input type for incrementing numeric columns in table "payrolls" */
export type PayrollsIncInput = {
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<Scalars["Int"]["input"]>;
  versionNumber?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "payrolls" */
export type PayrollsInsertInput = {
  backupConsultant?: InputMaybe<UsersObjRelInsertInput>;
  /** Backup consultant for this payroll */
  backupConsultantUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  billingItems?: InputMaybe<BillingItemsArrRelInsertInput>;
  childPayrolls?: InputMaybe<PayrollsArrRelInsertInput>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  /** Reference to the client this payroll belongs to */
  clientId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the payroll was created */
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  createdByUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the payroll cycle */
  cycleId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the payroll date type */
  dateTypeId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<Scalars["Int"]["input"]>;
  /** The date when the payroll went live in the system */
  goLiveDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  manager?: InputMaybe<UsersObjRelInsertInput>;
  /** Manager overseeing this payroll */
  managerUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Name of the payroll */
  name?: InputMaybe<Scalars["String"]["input"]>;
  parentPayroll?: InputMaybe<PayrollsObjRelInsertInput>;
  parentPayrollId?: InputMaybe<Scalars["uuid"]["input"]>;
  payrollCycle?: InputMaybe<PayrollCyclesObjRelInsertInput>;
  payrollDateType?: InputMaybe<PayrollDateTypesObjRelInsertInput>;
  payrollDates?: InputMaybe<PayrollDatesArrRelInsertInput>;
  /** External payroll system used for this client */
  payrollSystem?: InputMaybe<Scalars["String"]["input"]>;
  primaryConsultant?: InputMaybe<UsersObjRelInsertInput>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<Scalars["Int"]["input"]>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<Scalars["payroll_status"]["input"]>;
  supersededDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the payroll was last updated */
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  versionNumber?: InputMaybe<Scalars["Int"]["input"]>;
  versionReason?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type PayrollsMaxFields = {
  __typename: "payrolls_max_fields";
  /** Backup consultant for this payroll */
  backupConsultantUserId: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the client this payroll belongs to */
  clientId: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the payroll was created */
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  createdByUserId: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the payroll cycle */
  cycleId: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the payroll date type */
  dateTypeId: Maybe<Scalars["uuid"]["output"]>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars["Int"]["output"]>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars["Int"]["output"]>;
  /** The date when the payroll went live in the system */
  goLiveDate: Maybe<Scalars["date"]["output"]>;
  /** Unique identifier for the payroll */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Manager overseeing this payroll */
  managerUserId: Maybe<Scalars["uuid"]["output"]>;
  /** Name of the payroll */
  name: Maybe<Scalars["String"]["output"]>;
  parentPayrollId: Maybe<Scalars["uuid"]["output"]>;
  /** External payroll system used for this client */
  payrollSystem: Maybe<Scalars["String"]["output"]>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId: Maybe<Scalars["uuid"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars["Int"]["output"]>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars["Int"]["output"]>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status: Maybe<Scalars["payroll_status"]["output"]>;
  supersededDate: Maybe<Scalars["date"]["output"]>;
  /** Timestamp when the payroll was last updated */
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
  versionNumber: Maybe<Scalars["Int"]["output"]>;
  versionReason: Maybe<Scalars["String"]["output"]>;
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
  __typename: "payrolls_min_fields";
  /** Backup consultant for this payroll */
  backupConsultantUserId: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the client this payroll belongs to */
  clientId: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the payroll was created */
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  createdByUserId: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the payroll cycle */
  cycleId: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the payroll date type */
  dateTypeId: Maybe<Scalars["uuid"]["output"]>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars["Int"]["output"]>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars["Int"]["output"]>;
  /** The date when the payroll went live in the system */
  goLiveDate: Maybe<Scalars["date"]["output"]>;
  /** Unique identifier for the payroll */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Manager overseeing this payroll */
  managerUserId: Maybe<Scalars["uuid"]["output"]>;
  /** Name of the payroll */
  name: Maybe<Scalars["String"]["output"]>;
  parentPayrollId: Maybe<Scalars["uuid"]["output"]>;
  /** External payroll system used for this client */
  payrollSystem: Maybe<Scalars["String"]["output"]>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId: Maybe<Scalars["uuid"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars["Int"]["output"]>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars["Int"]["output"]>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status: Maybe<Scalars["payroll_status"]["output"]>;
  supersededDate: Maybe<Scalars["date"]["output"]>;
  /** Timestamp when the payroll was last updated */
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
  versionNumber: Maybe<Scalars["Int"]["output"]>;
  versionReason: Maybe<Scalars["String"]["output"]>;
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
  __typename: "payrolls_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  backupConsultant?: InputMaybe<UsersOrderBy>;
  backupConsultantUserId?: InputMaybe<OrderBy>;
  billingItems_aggregate?: InputMaybe<BillingItemsAggregateOrderBy>;
  childPayrolls_aggregate?: InputMaybe<PayrollsAggregateOrderBy>;
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
  payrollDates_aggregate?: InputMaybe<PayrollDatesAggregateOrderBy>;
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
  id: Scalars["uuid"]["input"];
};

/** select columns of table "payrolls" */
export enum PayrollsSelectColumn {
  /** column name */
  backupConsultantUserId = "backupConsultantUserId",
  /** column name */
  clientId = "clientId",
  /** column name */
  createdAt = "createdAt",
  /** column name */
  createdByUserId = "createdByUserId",
  /** column name */
  cycleId = "cycleId",
  /** column name */
  dateTypeId = "dateTypeId",
  /** column name */
  dateValue = "dateValue",
  /** column name */
  employeeCount = "employeeCount",
  /** column name */
  goLiveDate = "goLiveDate",
  /** column name */
  id = "id",
  /** column name */
  managerUserId = "managerUserId",
  /** column name */
  name = "name",
  /** column name */
  parentPayrollId = "parentPayrollId",
  /** column name */
  payrollSystem = "payrollSystem",
  /** column name */
  primaryConsultantUserId = "primaryConsultantUserId",
  /** column name */
  processingDaysBeforeEft = "processingDaysBeforeEft",
  /** column name */
  processingTime = "processingTime",
  /** column name */
  status = "status",
  /** column name */
  supersededDate = "supersededDate",
  /** column name */
  updatedAt = "updatedAt",
  /** column name */
  versionNumber = "versionNumber",
  /** column name */
  versionReason = "versionReason",
}

/** input type for updating data in table "payrolls" */
export type PayrollsSetInput = {
  /** Backup consultant for this payroll */
  backupConsultantUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the client this payroll belongs to */
  clientId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the payroll was created */
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  createdByUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the payroll cycle */
  cycleId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the payroll date type */
  dateTypeId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<Scalars["Int"]["input"]>;
  /** The date when the payroll went live in the system */
  goLiveDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Manager overseeing this payroll */
  managerUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Name of the payroll */
  name?: InputMaybe<Scalars["String"]["input"]>;
  parentPayrollId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** External payroll system used for this client */
  payrollSystem?: InputMaybe<Scalars["String"]["input"]>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<Scalars["Int"]["input"]>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<Scalars["payroll_status"]["input"]>;
  supersededDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the payroll was last updated */
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  versionNumber?: InputMaybe<Scalars["Int"]["input"]>;
  versionReason?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate stddev on columns */
export type PayrollsStddevFields = {
  __typename: "payrolls_stddev_fields";
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars["Float"]["output"]>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars["Float"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars["Float"]["output"]>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars["Float"]["output"]>;
  versionNumber: Maybe<Scalars["Float"]["output"]>;
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

/** aggregate stddev_pop on columns */
export type PayrollsStddevPopFields = {
  __typename: "payrolls_stddev_pop_fields";
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars["Float"]["output"]>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars["Float"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars["Float"]["output"]>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars["Float"]["output"]>;
  versionNumber: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "payrolls" */
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

/** aggregate stddev_samp on columns */
export type PayrollsStddevSampFields = {
  __typename: "payrolls_stddev_samp_fields";
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars["Float"]["output"]>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars["Float"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars["Float"]["output"]>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars["Float"]["output"]>;
  versionNumber: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "payrolls" */
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
  initial_value: PayrollsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollsStreamCursorValueInput = {
  /** Backup consultant for this payroll */
  backupConsultantUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the client this payroll belongs to */
  clientId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the payroll was created */
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  createdByUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the payroll cycle */
  cycleId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the payroll date type */
  dateTypeId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<Scalars["Int"]["input"]>;
  /** The date when the payroll went live in the system */
  goLiveDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Manager overseeing this payroll */
  managerUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Name of the payroll */
  name?: InputMaybe<Scalars["String"]["input"]>;
  parentPayrollId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** External payroll system used for this client */
  payrollSystem?: InputMaybe<Scalars["String"]["input"]>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<Scalars["Int"]["input"]>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<Scalars["payroll_status"]["input"]>;
  supersededDate?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the payroll was last updated */
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  versionNumber?: InputMaybe<Scalars["Int"]["input"]>;
  versionReason?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate sum on columns */
export type PayrollsSumFields = {
  __typename: "payrolls_sum_fields";
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars["Int"]["output"]>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars["Int"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars["Int"]["output"]>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars["Int"]["output"]>;
  versionNumber: Maybe<Scalars["Int"]["output"]>;
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
  backupConsultantUserId = "backupConsultantUserId",
  /** column name */
  clientId = "clientId",
  /** column name */
  createdAt = "createdAt",
  /** column name */
  createdByUserId = "createdByUserId",
  /** column name */
  cycleId = "cycleId",
  /** column name */
  dateTypeId = "dateTypeId",
  /** column name */
  dateValue = "dateValue",
  /** column name */
  employeeCount = "employeeCount",
  /** column name */
  goLiveDate = "goLiveDate",
  /** column name */
  id = "id",
  /** column name */
  managerUserId = "managerUserId",
  /** column name */
  name = "name",
  /** column name */
  parentPayrollId = "parentPayrollId",
  /** column name */
  payrollSystem = "payrollSystem",
  /** column name */
  primaryConsultantUserId = "primaryConsultantUserId",
  /** column name */
  processingDaysBeforeEft = "processingDaysBeforeEft",
  /** column name */
  processingTime = "processingTime",
  /** column name */
  status = "status",
  /** column name */
  supersededDate = "supersededDate",
  /** column name */
  updatedAt = "updatedAt",
  /** column name */
  versionNumber = "versionNumber",
  /** column name */
  versionReason = "versionReason",
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
  __typename: "payrolls_var_pop_fields";
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars["Float"]["output"]>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars["Float"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars["Float"]["output"]>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars["Float"]["output"]>;
  versionNumber: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "payrolls" */
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

/** aggregate var_samp on columns */
export type PayrollsVarSampFields = {
  __typename: "payrolls_var_samp_fields";
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars["Float"]["output"]>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars["Float"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars["Float"]["output"]>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars["Float"]["output"]>;
  versionNumber: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "payrolls" */
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
  __typename: "payrolls_variance_fields";
  /** Specific value for date calculation (e.g., day of month) */
  dateValue: Maybe<Scalars["Float"]["output"]>;
  /** Number of employees in this payroll */
  employeeCount: Maybe<Scalars["Float"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft: Maybe<Scalars["Float"]["output"]>;
  /** Number of hours required to process this payroll */
  processingTime: Maybe<Scalars["Float"]["output"]>;
  versionNumber: Maybe<Scalars["Float"]["output"]>;
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

/** Boolean expression to compare columns of type "permission_action". All fields are combined with logical 'AND'. */
export type PermissionActionComparisonExp = {
  _eq?: InputMaybe<Scalars["permission_action"]["input"]>;
  _gt?: InputMaybe<Scalars["permission_action"]["input"]>;
  _gte?: InputMaybe<Scalars["permission_action"]["input"]>;
  _in?: InputMaybe<Array<Scalars["permission_action"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["permission_action"]["input"]>;
  _lte?: InputMaybe<Scalars["permission_action"]["input"]>;
  _neq?: InputMaybe<Scalars["permission_action"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["permission_action"]["input"]>>;
};

/** Audit log for permission changes and access attempts */
export type PermissionAuditLog = {
  __typename: "permission_audit_log";
  action: Scalars["String"]["output"];
  created_at: Scalars["timestamptz"]["output"];
  id: Scalars["uuid"]["output"];
  new_value: Maybe<Scalars["jsonb"]["output"]>;
  operation: Scalars["String"]["output"];
  /** An object relationship */
  performed_by_user: Maybe<Users>;
  previous_value: Maybe<Scalars["jsonb"]["output"]>;
  reason: Maybe<Scalars["String"]["output"]>;
  resource: Scalars["String"]["output"];
  targetUserId: Maybe<Scalars["uuid"]["output"]>;
  target_role: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  target_user: Maybe<Users>;
  timestamp: Scalars["timestamptz"]["output"];
  userId: Maybe<Scalars["uuid"]["output"]>;
};

/** Audit log for permission changes and access attempts */
export type PermissionAuditLogNewValueArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** Audit log for permission changes and access attempts */
export type PermissionAuditLogPreviousValueArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "permission_audit_log" */
export type PermissionAuditLogAggregate = {
  __typename: "permission_audit_log_aggregate";
  aggregate: Maybe<PermissionAuditLogAggregateFields>;
  nodes: Array<PermissionAuditLog>;
};

/** aggregate fields of "permission_audit_log" */
export type PermissionAuditLogAggregateFields = {
  __typename: "permission_audit_log_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<PermissionAuditLogMaxFields>;
  min: Maybe<PermissionAuditLogMinFields>;
};

/** aggregate fields of "permission_audit_log" */
export type PermissionAuditLogAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PermissionAuditLogSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type PermissionAuditLogAppendInput = {
  new_value?: InputMaybe<Scalars["jsonb"]["input"]>;
  previous_value?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** Boolean expression to filter rows from the table "permission_audit_log". All fields are combined with a logical 'AND'. */
export type PermissionAuditLogBoolExp = {
  _and?: InputMaybe<Array<PermissionAuditLogBoolExp>>;
  _not?: InputMaybe<PermissionAuditLogBoolExp>;
  _or?: InputMaybe<Array<PermissionAuditLogBoolExp>>;
  action?: InputMaybe<StringComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  new_value?: InputMaybe<JsonbComparisonExp>;
  operation?: InputMaybe<StringComparisonExp>;
  performed_by_user?: InputMaybe<UsersBoolExp>;
  previous_value?: InputMaybe<JsonbComparisonExp>;
  reason?: InputMaybe<StringComparisonExp>;
  resource?: InputMaybe<StringComparisonExp>;
  targetUserId?: InputMaybe<UuidComparisonExp>;
  target_role?: InputMaybe<StringComparisonExp>;
  target_user?: InputMaybe<UsersBoolExp>;
  timestamp?: InputMaybe<TimestamptzComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "permission_audit_log" */
export enum PermissionAuditLogConstraint {
  /** unique or primary key constraint on columns "id" */
  permission_audit_log_pkey = "permission_audit_log_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type PermissionAuditLogDeleteAtPathInput = {
  new_value?: InputMaybe<Array<Scalars["String"]["input"]>>;
  previous_value?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type PermissionAuditLogDeleteElemInput = {
  new_value?: InputMaybe<Scalars["Int"]["input"]>;
  previous_value?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type PermissionAuditLogDeleteKeyInput = {
  new_value?: InputMaybe<Scalars["String"]["input"]>;
  previous_value?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "permission_audit_log" */
export type PermissionAuditLogInsertInput = {
  action?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  new_value?: InputMaybe<Scalars["jsonb"]["input"]>;
  operation?: InputMaybe<Scalars["String"]["input"]>;
  performed_by_user?: InputMaybe<UsersObjRelInsertInput>;
  previous_value?: InputMaybe<Scalars["jsonb"]["input"]>;
  reason?: InputMaybe<Scalars["String"]["input"]>;
  resource?: InputMaybe<Scalars["String"]["input"]>;
  targetUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  target_role?: InputMaybe<Scalars["String"]["input"]>;
  target_user?: InputMaybe<UsersObjRelInsertInput>;
  timestamp?: InputMaybe<Scalars["timestamptz"]["input"]>;
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type PermissionAuditLogMaxFields = {
  __typename: "permission_audit_log_max_fields";
  action: Maybe<Scalars["String"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  operation: Maybe<Scalars["String"]["output"]>;
  reason: Maybe<Scalars["String"]["output"]>;
  resource: Maybe<Scalars["String"]["output"]>;
  targetUserId: Maybe<Scalars["uuid"]["output"]>;
  target_role: Maybe<Scalars["String"]["output"]>;
  timestamp: Maybe<Scalars["timestamptz"]["output"]>;
  userId: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type PermissionAuditLogMinFields = {
  __typename: "permission_audit_log_min_fields";
  action: Maybe<Scalars["String"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  operation: Maybe<Scalars["String"]["output"]>;
  reason: Maybe<Scalars["String"]["output"]>;
  resource: Maybe<Scalars["String"]["output"]>;
  targetUserId: Maybe<Scalars["uuid"]["output"]>;
  target_role: Maybe<Scalars["String"]["output"]>;
  timestamp: Maybe<Scalars["timestamptz"]["output"]>;
  userId: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "permission_audit_log" */
export type PermissionAuditLogMutationResponse = {
  __typename: "permission_audit_log_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<PermissionAuditLog>;
};

/** on_conflict condition type for table "permission_audit_log" */
export type PermissionAuditLogOnConflict = {
  constraint: PermissionAuditLogConstraint;
  update_columns?: Array<PermissionAuditLogUpdateColumn>;
  where?: InputMaybe<PermissionAuditLogBoolExp>;
};

/** Ordering options when selecting data from "permission_audit_log". */
export type PermissionAuditLogOrderBy = {
  action?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  new_value?: InputMaybe<OrderBy>;
  operation?: InputMaybe<OrderBy>;
  performed_by_user?: InputMaybe<UsersOrderBy>;
  previous_value?: InputMaybe<OrderBy>;
  reason?: InputMaybe<OrderBy>;
  resource?: InputMaybe<OrderBy>;
  targetUserId?: InputMaybe<OrderBy>;
  target_role?: InputMaybe<OrderBy>;
  target_user?: InputMaybe<UsersOrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: permission_audit_log */
export type PermissionAuditLogPkColumnsInput = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type PermissionAuditLogPrependInput = {
  new_value?: InputMaybe<Scalars["jsonb"]["input"]>;
  previous_value?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "permission_audit_log" */
export enum PermissionAuditLogSelectColumn {
  /** column name */
  action = "action",
  /** column name */
  created_at = "created_at",
  /** column name */
  id = "id",
  /** column name */
  new_value = "new_value",
  /** column name */
  operation = "operation",
  /** column name */
  previous_value = "previous_value",
  /** column name */
  reason = "reason",
  /** column name */
  resource = "resource",
  /** column name */
  targetUserId = "targetUserId",
  /** column name */
  target_role = "target_role",
  /** column name */
  timestamp = "timestamp",
  /** column name */
  userId = "userId",
}

/** input type for updating data in table "permission_audit_log" */
export type PermissionAuditLogSetInput = {
  action?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  new_value?: InputMaybe<Scalars["jsonb"]["input"]>;
  operation?: InputMaybe<Scalars["String"]["input"]>;
  previous_value?: InputMaybe<Scalars["jsonb"]["input"]>;
  reason?: InputMaybe<Scalars["String"]["input"]>;
  resource?: InputMaybe<Scalars["String"]["input"]>;
  targetUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  target_role?: InputMaybe<Scalars["String"]["input"]>;
  timestamp?: InputMaybe<Scalars["timestamptz"]["input"]>;
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "permission_audit_log" */
export type PermissionAuditLogStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: PermissionAuditLogStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PermissionAuditLogStreamCursorValueInput = {
  action?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  new_value?: InputMaybe<Scalars["jsonb"]["input"]>;
  operation?: InputMaybe<Scalars["String"]["input"]>;
  previous_value?: InputMaybe<Scalars["jsonb"]["input"]>;
  reason?: InputMaybe<Scalars["String"]["input"]>;
  resource?: InputMaybe<Scalars["String"]["input"]>;
  targetUserId?: InputMaybe<Scalars["uuid"]["input"]>;
  target_role?: InputMaybe<Scalars["String"]["input"]>;
  timestamp?: InputMaybe<Scalars["timestamptz"]["input"]>;
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "permission_audit_log" */
export enum PermissionAuditLogUpdateColumn {
  /** column name */
  action = "action",
  /** column name */
  created_at = "created_at",
  /** column name */
  id = "id",
  /** column name */
  new_value = "new_value",
  /** column name */
  operation = "operation",
  /** column name */
  previous_value = "previous_value",
  /** column name */
  reason = "reason",
  /** column name */
  resource = "resource",
  /** column name */
  targetUserId = "targetUserId",
  /** column name */
  target_role = "target_role",
  /** column name */
  timestamp = "timestamp",
  /** column name */
  userId = "userId",
}

export type PermissionAuditLogUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<PermissionAuditLogAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<PermissionAuditLogDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<PermissionAuditLogDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<PermissionAuditLogDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<PermissionAuditLogPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PermissionAuditLogSetInput>;
  /** filter the rows which have to be updated */
  where: PermissionAuditLogBoolExp;
};

/** User-specific and role-specific permission overrides */
export type PermissionOverrides = {
  __typename: "permission_overrides";
  /** JSON conditions for conditional permissions */
  conditions: Maybe<Scalars["jsonb"]["output"]>;
  createdAt: Scalars["timestamptz"]["output"];
  createdBy: Maybe<Scalars["uuid"]["output"]>;
  /** An object relationship */
  created_by_user: Maybe<Users>;
  /** When this override expires (NULL for permanent) */
  expiresAt: Maybe<Scalars["timestamptz"]["output"]>;
  /** Whether the permission is granted (true) or denied (false) */
  granted: Scalars["Boolean"]["output"];
  id: Scalars["uuid"]["output"];
  operation: Scalars["String"]["output"];
  /** An object relationship */
  override_user: Maybe<Users>;
  reason: Maybe<Scalars["String"]["output"]>;
  resource: Scalars["String"]["output"];
  /** Role name for role-based overrides (mutually exclusive with user_id) */
  role: Maybe<Scalars["String"]["output"]>;
  updatedAt: Scalars["timestamptz"]["output"];
  /** An object relationship */
  user: Maybe<Users>;
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId: Maybe<Scalars["uuid"]["output"]>;
};

/** User-specific and role-specific permission overrides */
export type PermissionOverridesConditionsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "permission_overrides" */
export type PermissionOverridesAggregate = {
  __typename: "permission_overrides_aggregate";
  aggregate: Maybe<PermissionOverridesAggregateFields>;
  nodes: Array<PermissionOverrides>;
};

/** aggregate fields of "permission_overrides" */
export type PermissionOverridesAggregateFields = {
  __typename: "permission_overrides_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<PermissionOverridesMaxFields>;
  min: Maybe<PermissionOverridesMinFields>;
};

/** aggregate fields of "permission_overrides" */
export type PermissionOverridesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type PermissionOverridesAppendInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** Boolean expression to filter rows from the table "permission_overrides". All fields are combined with a logical 'AND'. */
export type PermissionOverridesBoolExp = {
  _and?: InputMaybe<Array<PermissionOverridesBoolExp>>;
  _not?: InputMaybe<PermissionOverridesBoolExp>;
  _or?: InputMaybe<Array<PermissionOverridesBoolExp>>;
  conditions?: InputMaybe<JsonbComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdBy?: InputMaybe<UuidComparisonExp>;
  created_by_user?: InputMaybe<UsersBoolExp>;
  expiresAt?: InputMaybe<TimestamptzComparisonExp>;
  granted?: InputMaybe<BooleanComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  operation?: InputMaybe<StringComparisonExp>;
  override_user?: InputMaybe<UsersBoolExp>;
  reason?: InputMaybe<StringComparisonExp>;
  resource?: InputMaybe<StringComparisonExp>;
  role?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "permission_overrides" */
export enum PermissionOverridesConstraint {
  /** unique or primary key constraint on columns "id" */
  permission_overrides_pkey = "permission_overrides_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type PermissionOverridesDeleteAtPathInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type PermissionOverridesDeleteElemInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type PermissionOverridesDeleteKeyInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "permission_overrides" */
export type PermissionOverridesInsertInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars["jsonb"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  createdBy?: InputMaybe<Scalars["uuid"]["input"]>;
  created_by_user?: InputMaybe<UsersObjRelInsertInput>;
  /** When this override expires (NULL for permanent) */
  expiresAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Whether the permission is granted (true) or denied (false) */
  granted?: InputMaybe<Scalars["Boolean"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  operation?: InputMaybe<Scalars["String"]["input"]>;
  override_user?: InputMaybe<UsersObjRelInsertInput>;
  reason?: InputMaybe<Scalars["String"]["input"]>;
  resource?: InputMaybe<Scalars["String"]["input"]>;
  /** Role name for role-based overrides (mutually exclusive with user_id) */
  role?: InputMaybe<Scalars["String"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type PermissionOverridesMaxFields = {
  __typename: "permission_overrides_max_fields";
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  createdBy: Maybe<Scalars["uuid"]["output"]>;
  /** When this override expires (NULL for permanent) */
  expiresAt: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  operation: Maybe<Scalars["String"]["output"]>;
  reason: Maybe<Scalars["String"]["output"]>;
  resource: Maybe<Scalars["String"]["output"]>;
  /** Role name for role-based overrides (mutually exclusive with user_id) */
  role: Maybe<Scalars["String"]["output"]>;
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type PermissionOverridesMinFields = {
  __typename: "permission_overrides_min_fields";
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  createdBy: Maybe<Scalars["uuid"]["output"]>;
  /** When this override expires (NULL for permanent) */
  expiresAt: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  operation: Maybe<Scalars["String"]["output"]>;
  reason: Maybe<Scalars["String"]["output"]>;
  resource: Maybe<Scalars["String"]["output"]>;
  /** Role name for role-based overrides (mutually exclusive with user_id) */
  role: Maybe<Scalars["String"]["output"]>;
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "permission_overrides" */
export type PermissionOverridesMutationResponse = {
  __typename: "permission_overrides_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<PermissionOverrides>;
};

/** on_conflict condition type for table "permission_overrides" */
export type PermissionOverridesOnConflict = {
  constraint: PermissionOverridesConstraint;
  update_columns?: Array<PermissionOverridesUpdateColumn>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};

/** Ordering options when selecting data from "permission_overrides". */
export type PermissionOverridesOrderBy = {
  conditions?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  created_by_user?: InputMaybe<UsersOrderBy>;
  expiresAt?: InputMaybe<OrderBy>;
  granted?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  operation?: InputMaybe<OrderBy>;
  override_user?: InputMaybe<UsersOrderBy>;
  reason?: InputMaybe<OrderBy>;
  resource?: InputMaybe<OrderBy>;
  role?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: permission_overrides */
export type PermissionOverridesPkColumnsInput = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type PermissionOverridesPrependInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "permission_overrides" */
export enum PermissionOverridesSelectColumn {
  /** column name */
  conditions = "conditions",
  /** column name */
  createdAt = "createdAt",
  /** column name */
  createdBy = "createdBy",
  /** column name */
  expiresAt = "expiresAt",
  /** column name */
  granted = "granted",
  /** column name */
  id = "id",
  /** column name */
  operation = "operation",
  /** column name */
  reason = "reason",
  /** column name */
  resource = "resource",
  /** column name */
  role = "role",
  /** column name */
  updatedAt = "updatedAt",
  /** column name */
  userId = "userId",
}

/** input type for updating data in table "permission_overrides" */
export type PermissionOverridesSetInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars["jsonb"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  createdBy?: InputMaybe<Scalars["uuid"]["input"]>;
  /** When this override expires (NULL for permanent) */
  expiresAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Whether the permission is granted (true) or denied (false) */
  granted?: InputMaybe<Scalars["Boolean"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  operation?: InputMaybe<Scalars["String"]["input"]>;
  reason?: InputMaybe<Scalars["String"]["input"]>;
  resource?: InputMaybe<Scalars["String"]["input"]>;
  /** Role name for role-based overrides (mutually exclusive with user_id) */
  role?: InputMaybe<Scalars["String"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "permission_overrides" */
export type PermissionOverridesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: PermissionOverridesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PermissionOverridesStreamCursorValueInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars["jsonb"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  createdBy?: InputMaybe<Scalars["uuid"]["input"]>;
  /** When this override expires (NULL for permanent) */
  expiresAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Whether the permission is granted (true) or denied (false) */
  granted?: InputMaybe<Scalars["Boolean"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  operation?: InputMaybe<Scalars["String"]["input"]>;
  reason?: InputMaybe<Scalars["String"]["input"]>;
  resource?: InputMaybe<Scalars["String"]["input"]>;
  /** Role name for role-based overrides (mutually exclusive with user_id) */
  role?: InputMaybe<Scalars["String"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "permission_overrides" */
export enum PermissionOverridesUpdateColumn {
  /** column name */
  conditions = "conditions",
  /** column name */
  createdAt = "createdAt",
  /** column name */
  createdBy = "createdBy",
  /** column name */
  expiresAt = "expiresAt",
  /** column name */
  granted = "granted",
  /** column name */
  id = "id",
  /** column name */
  operation = "operation",
  /** column name */
  reason = "reason",
  /** column name */
  resource = "resource",
  /** column name */
  role = "role",
  /** column name */
  updatedAt = "updatedAt",
  /** column name */
  userId = "userId",
}

export type PermissionOverridesUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<PermissionOverridesAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<PermissionOverridesDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<PermissionOverridesDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<PermissionOverridesDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<PermissionOverridesPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PermissionOverridesSetInput>;
  /** filter the rows which have to be updated */
  where: PermissionOverridesBoolExp;
};

/** columns and relationships of "permissions" */
export type Permissions = {
  __typename: "permissions";
  action: Scalars["permission_action"]["output"];
  createdAt: Scalars["timestamptz"]["output"];
  description: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  legacy_permission_name: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  resource: Resources;
  resourceId: Scalars["uuid"]["output"];
  /** An array relationship */
  role_permissions: Array<RolePermissions>;
  /** An aggregate relationship */
  role_permissions_aggregate: RolePermissionsAggregate;
  updatedAt: Scalars["timestamptz"]["output"];
};

/** columns and relationships of "permissions" */
export type PermissionsRolePermissionsArgs = {
  distinct_on?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};

/** columns and relationships of "permissions" */
export type PermissionsRolePermissionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};

/** aggregated selection of "permissions" */
export type PermissionsAggregate = {
  __typename: "permissions_aggregate";
  aggregate: Maybe<PermissionsAggregateFields>;
  nodes: Array<Permissions>;
};

export type PermissionsAggregateBoolExp = {
  count?: InputMaybe<PermissionsAggregateBoolExpCount>;
};

export type PermissionsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PermissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<PermissionsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "permissions" */
export type PermissionsAggregateFields = {
  __typename: "permissions_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<PermissionsMaxFields>;
  min: Maybe<PermissionsMinFields>;
};

/** aggregate fields of "permissions" */
export type PermissionsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PermissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  legacy_permission_name?: InputMaybe<StringComparisonExp>;
  resource?: InputMaybe<ResourcesBoolExp>;
  resourceId?: InputMaybe<UuidComparisonExp>;
  role_permissions?: InputMaybe<RolePermissionsBoolExp>;
  role_permissions_aggregate?: InputMaybe<RolePermissionsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "permissions" */
export enum PermissionsConstraint {
  /** unique or primary key constraint on columns "id" */
  permissions_pkey = "permissions_pkey",
  /** unique or primary key constraint on columns "action", "resource_id" */
  permissions_resource_id_action_key = "permissions_resource_id_action_key",
}

/** input type for inserting data into table "permissions" */
export type PermissionsInsertInput = {
  action?: InputMaybe<Scalars["permission_action"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  legacy_permission_name?: InputMaybe<Scalars["String"]["input"]>;
  resource?: InputMaybe<ResourcesObjRelInsertInput>;
  resourceId?: InputMaybe<Scalars["uuid"]["input"]>;
  role_permissions?: InputMaybe<RolePermissionsArrRelInsertInput>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type PermissionsMaxFields = {
  __typename: "permissions_max_fields";
  action: Maybe<Scalars["permission_action"]["output"]>;
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  legacy_permission_name: Maybe<Scalars["String"]["output"]>;
  resourceId: Maybe<Scalars["uuid"]["output"]>;
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by max() on columns of table "permissions" */
export type PermissionsMaxOrderBy = {
  action?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  legacy_permission_name?: InputMaybe<OrderBy>;
  resourceId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type PermissionsMinFields = {
  __typename: "permissions_min_fields";
  action: Maybe<Scalars["permission_action"]["output"]>;
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  legacy_permission_name: Maybe<Scalars["String"]["output"]>;
  resourceId: Maybe<Scalars["uuid"]["output"]>;
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by min() on columns of table "permissions" */
export type PermissionsMinOrderBy = {
  action?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  legacy_permission_name?: InputMaybe<OrderBy>;
  resourceId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "permissions" */
export type PermissionsMutationResponse = {
  __typename: "permissions_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  legacy_permission_name?: InputMaybe<OrderBy>;
  resource?: InputMaybe<ResourcesOrderBy>;
  resourceId?: InputMaybe<OrderBy>;
  role_permissions_aggregate?: InputMaybe<RolePermissionsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: permissions */
export type PermissionsPkColumnsInput = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "permissions" */
export enum PermissionsSelectColumn {
  /** column name */
  action = "action",
  /** column name */
  createdAt = "createdAt",
  /** column name */
  description = "description",
  /** column name */
  id = "id",
  /** column name */
  legacy_permission_name = "legacy_permission_name",
  /** column name */
  resourceId = "resourceId",
  /** column name */
  updatedAt = "updatedAt",
}

/** input type for updating data in table "permissions" */
export type PermissionsSetInput = {
  action?: InputMaybe<Scalars["permission_action"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  legacy_permission_name?: InputMaybe<Scalars["String"]["input"]>;
  resourceId?: InputMaybe<Scalars["uuid"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
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
  action?: InputMaybe<Scalars["permission_action"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  legacy_permission_name?: InputMaybe<Scalars["String"]["input"]>;
  resourceId?: InputMaybe<Scalars["uuid"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "permissions" */
export enum PermissionsUpdateColumn {
  /** column name */
  action = "action",
  /** column name */
  createdAt = "createdAt",
  /** column name */
  description = "description",
  /** column name */
  id = "id",
  /** column name */
  legacy_permission_name = "legacy_permission_name",
  /** column name */
  resourceId = "resourceId",
  /** column name */
  updatedAt = "updatedAt",
}

export type PermissionsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PermissionsSetInput>;
  /** filter the rows which have to be updated */
  where: PermissionsBoolExp;
};

export type QueryRoot = {
  __typename: "query_root";
  /** query _Entity union */
  _entities: Maybe<Entity>;
  _service: Service;
  /** execute function "activate_payroll_versions" which returns "payroll_activation_results" */
  activatePayrollVersions: Array<PayrollActivationResults>;
  /** execute function "activate_payroll_versions" and query aggregates on result of table type "payroll_activation_results" */
  activatePayrollVersionsAggregate: PayrollActivationResultsAggregate;
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
  /** fetch data from the table: "audit.audit_log" using primary key columns */
  auditLog: Maybe<AuditAuditLog>;
  /** fetch data from the table: "audit.audit_log" */
  auditLogs: Array<AuditAuditLog>;
  /** fetch aggregated fields from the table: "audit.audit_log" */
  auditLogsAggregate: AuditAuditLogAggregate;
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
  /** fetch data from the table: "audit.auth_events" using primary key columns */
  authEvent: Maybe<AuditAuthEvents>;
  /** fetch data from the table: "audit.auth_events" */
  authEvents: Array<AuditAuthEvents>;
  /** fetch aggregated fields from the table: "audit.auth_events" */
  authEventsAggregate: AuditAuthEventsAggregate;
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
  /** fetch data from the table: "clients" using primary key columns */
  client: Maybe<Clients>;
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
  current_payrolls: Array<CurrentPayrolls>;
  /** fetch aggregated fields from the table: "current_payrolls" */
  current_payrolls_aggregate: CurrentPayrollsAggregate;
  /** fetch data from the table: "audit.data_access_log" using primary key columns */
  dataAccessLog: Maybe<AuditDataAccessLog>;
  /** fetch data from the table: "audit.data_access_log" */
  dataAccessLogs: Array<AuditDataAccessLog>;
  /** fetch aggregated fields from the table: "audit.data_access_log" */
  dataAccessLogsAggregate: AuditDataAccessLogAggregate;
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
  /** fetch data from the table: "leave" using primary key columns */
  leave: Maybe<Leave>;
  /** An array relationship */
  leaves: Array<Leave>;
  /** fetch aggregated fields from the table: "leave" */
  leavesAggregate: LeaveAggregate;
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
  /** fetch data from the table: "payrolls" using primary key columns */
  payroll: Maybe<Payrolls>;
  /** fetch data from the table: "payroll_assignments" using primary key columns */
  payrollAssignment: Maybe<PayrollAssignments>;
  /** fetch data from the table: "payroll_assignments" */
  payrollAssignments: Array<PayrollAssignments>;
  /** fetch aggregated fields from the table: "payroll_assignments" */
  payrollAssignmentsAggregate: PayrollAssignmentsAggregate;
  /** fetch data from the table: "payroll_dates" using primary key columns */
  payrollDate: Maybe<PayrollDates>;
  /** An array relationship */
  payrollDates: Array<PayrollDates>;
  /** fetch aggregated fields from the table: "payroll_dates" */
  payrollDatesAggregate: PayrollDatesAggregate;
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
  /** fetch aggregated fields from the table: "payrolls" */
  payrollsAggregate: PayrollsAggregate;
  /** fetch data from the table: "permissions" using primary key columns */
  permission: Maybe<Permissions>;
  /** fetch data from the table: "permission_audit_log" using primary key columns */
  permissionAuditLog: Maybe<PermissionAuditLog>;
  /** fetch data from the table: "permission_audit_log" */
  permissionAuditLogs: Array<PermissionAuditLog>;
  /** fetch aggregated fields from the table: "permission_audit_log" */
  permissionAuditLogsAggregate: PermissionAuditLogAggregate;
  /** fetch data from the table: "audit.permission_changes" using primary key columns */
  permissionChange: Maybe<AuditPermissionChanges>;
  /** fetch data from the table: "audit.permission_changes" */
  permissionChanges: Array<AuditPermissionChanges>;
  /** fetch aggregated fields from the table: "audit.permission_changes" */
  permissionChangesAggregate: AuditPermissionChangesAggregate;
  /** fetch data from the table: "permission_overrides" using primary key columns */
  permissionOverride: Maybe<PermissionOverrides>;
  /** fetch data from the table: "permission_overrides" */
  permissionOverrides: Array<PermissionOverrides>;
  /** fetch aggregated fields from the table: "permission_overrides" */
  permissionOverridesAggregate: PermissionOverridesAggregate;
  /** An array relationship */
  permissions: Array<Permissions>;
  /** fetch aggregated fields from the table: "permissions" */
  permissionsAggregate: PermissionsAggregate;
  /** fetch data from the table: "resources" using primary key columns */
  resource: Maybe<Resources>;
  /** fetch data from the table: "resources" */
  resources: Array<Resources>;
  /** fetch aggregated fields from the table: "resources" */
  resourcesAggregate: ResourcesAggregate;
  /** fetch data from the table: "roles" using primary key columns */
  role: Maybe<Roles>;
  /** fetch data from the table: "role_permissions" using primary key columns */
  rolePermission: Maybe<RolePermissions>;
  /** An array relationship */
  rolePermissions: Array<RolePermissions>;
  /** fetch aggregated fields from the table: "role_permissions" */
  rolePermissionsAggregate: RolePermissionsAggregate;
  /** fetch data from the table: "roles" */
  roles: Array<Roles>;
  /** fetch aggregated fields from the table: "roles" */
  rolesAggregate: RolesAggregate;
  /** fetch data from the table: "users" using primary key columns */
  user: Maybe<Users>;
  /** fetch data from the table: "user_roles" using primary key columns */
  userRole: Maybe<UserRoles>;
  /** An array relationship */
  userRoles: Array<UserRoles>;
  /** fetch aggregated fields from the table: "user_roles" */
  userRolesAggregate: UserRolesAggregate;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  usersAggregate: UsersAggregate;
  /** fetch data from the table: "users_role_backup" */
  users_role_backup: Array<UsersRoleBackup>;
  /** fetch aggregated fields from the table: "users_role_backup" */
  users_role_backup_aggregate: UsersRoleBackupAggregate;
  /** fetch data from the table: "work_schedule" using primary key columns */
  workSchedule: Maybe<WorkSchedule>;
  /** An array relationship */
  workSchedules: Array<WorkSchedule>;
  /** fetch aggregated fields from the table: "work_schedule" */
  workSchedulesAggregate: WorkScheduleAggregate;
};

export type QueryRootEntitiesArgs = {
  representations: Array<Scalars["_Any"]["input"]>;
};

export type QueryRootActivatePayrollVersionsArgs = {
  distinct_on?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};

export type QueryRootActivatePayrollVersionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};

export type QueryRootAdjustmentRulesArgs = {
  distinct_on?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};

export type QueryRootAdjustmentRulesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};

export type QueryRootAdjustmentRulesByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootAppSettingsArgs = {
  distinct_on?: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AppSettingsOrderBy>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};

export type QueryRootAppSettingsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AppSettingsOrderBy>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};

export type QueryRootAppSettingsByPkArgs = {
  id: Scalars["String"]["input"];
};

export type QueryRootAuditLogArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootAuditLogsArgs = {
  distinct_on?: InputMaybe<Array<AuditAuditLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditAuditLogOrderBy>>;
  where?: InputMaybe<AuditAuditLogBoolExp>;
};

export type QueryRootAuditLogsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditAuditLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditAuditLogOrderBy>>;
  where?: InputMaybe<AuditAuditLogBoolExp>;
};

export type QueryRootAuditPermissionUsageReportArgs = {
  distinct_on?: InputMaybe<Array<AuditPermissionUsageReportSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditPermissionUsageReportOrderBy>>;
  where?: InputMaybe<AuditPermissionUsageReportBoolExp>;
};

export type QueryRootAuditPermissionUsageReportAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditPermissionUsageReportSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditPermissionUsageReportOrderBy>>;
  where?: InputMaybe<AuditPermissionUsageReportBoolExp>;
};

export type QueryRootAuditSlowQueriesArgs = {
  distinct_on?: InputMaybe<Array<AuditSlowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditSlowQueriesOrderBy>>;
  where?: InputMaybe<AuditSlowQueriesBoolExp>;
};

export type QueryRootAuditSlowQueriesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditSlowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditSlowQueriesOrderBy>>;
  where?: InputMaybe<AuditSlowQueriesBoolExp>;
};

export type QueryRootAuditSlowQueriesByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootAuditUserAccessSummaryArgs = {
  distinct_on?: InputMaybe<Array<AuditUserAccessSummarySelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditUserAccessSummaryOrderBy>>;
  where?: InputMaybe<AuditUserAccessSummaryBoolExp>;
};

export type QueryRootAuditUserAccessSummaryAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditUserAccessSummarySelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditUserAccessSummaryOrderBy>>;
  where?: InputMaybe<AuditUserAccessSummaryBoolExp>;
};

export type QueryRootAuthEventArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootAuthEventsArgs = {
  distinct_on?: InputMaybe<Array<AuditAuthEventsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditAuthEventsOrderBy>>;
  where?: InputMaybe<AuditAuthEventsBoolExp>;
};

export type QueryRootAuthEventsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditAuthEventsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditAuthEventsOrderBy>>;
  where?: InputMaybe<AuditAuthEventsBoolExp>;
};

export type QueryRootBillingEventLogArgs = {
  distinct_on?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingEventLogOrderBy>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};

export type QueryRootBillingEventLogAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingEventLogOrderBy>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};

export type QueryRootBillingEventLogByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootBillingInvoiceArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};

export type QueryRootBillingInvoiceAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};

export type QueryRootBillingInvoiceByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootBillingInvoiceItemArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};

export type QueryRootBillingInvoiceItemAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};

export type QueryRootBillingInvoiceItemByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootBillingInvoicesArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoicesOrderBy>>;
  where?: InputMaybe<BillingInvoicesBoolExp>;
};

export type QueryRootBillingInvoicesAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoicesOrderBy>>;
  where?: InputMaybe<BillingInvoicesBoolExp>;
};

export type QueryRootBillingInvoicesByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootBillingItemsArgs = {
  distinct_on?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};

export type QueryRootBillingItemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};

export type QueryRootBillingItemsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootBillingPlanArgs = {
  distinct_on?: InputMaybe<Array<BillingPlanSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingPlanOrderBy>>;
  where?: InputMaybe<BillingPlanBoolExp>;
};

export type QueryRootBillingPlanAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingPlanSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingPlanOrderBy>>;
  where?: InputMaybe<BillingPlanBoolExp>;
};

export type QueryRootBillingPlanByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootClientArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootClientBillingAssignmentArgs = {
  distinct_on?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientBillingAssignmentOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};

export type QueryRootClientBillingAssignmentAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientBillingAssignmentOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};

export type QueryRootClientBillingAssignmentByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootClientExternalSystemsArgs = {
  distinct_on?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};

export type QueryRootClientExternalSystemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};

export type QueryRootClientExternalSystemsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootClientsArgs = {
  distinct_on?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};

export type QueryRootClientsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};

export type QueryRootCreatePayrollVersionArgs = {
  args: CreatePayrollVersionArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};

export type QueryRootCreatePayrollVersionAggregateArgs = {
  args: CreatePayrollVersionArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};

export type QueryRootCreatePayrollVersionSimpleArgs = {
  args: CreatePayrollVersionSimpleArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};

export type QueryRootCreatePayrollVersionSimpleAggregateArgs = {
  args: CreatePayrollVersionSimpleArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};

export type QueryRootCurrentPayrollsArgs = {
  distinct_on?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};

export type QueryRootCurrentPayrollsAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};

export type QueryRootDataAccessLogArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootDataAccessLogsArgs = {
  distinct_on?: InputMaybe<Array<AuditDataAccessLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditDataAccessLogOrderBy>>;
  where?: InputMaybe<AuditDataAccessLogBoolExp>;
};

export type QueryRootDataAccessLogsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditDataAccessLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditDataAccessLogOrderBy>>;
  where?: InputMaybe<AuditDataAccessLogBoolExp>;
};

export type QueryRootExternalSystemsArgs = {
  distinct_on?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};

export type QueryRootExternalSystemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};

export type QueryRootExternalSystemsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootFeatureFlagsArgs = {
  distinct_on?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};

export type QueryRootFeatureFlagsAggregateArgs = {
  distinct_on?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};

export type QueryRootFeatureFlagsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootGeneratePayrollDatesArgs = {
  args: GeneratePayrollDatesArgs;
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};

export type QueryRootGeneratePayrollDatesAggregateArgs = {
  args: GeneratePayrollDatesArgs;
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};

export type QueryRootGetLatestPayrollVersionArgs = {
  args: GetLatestPayrollVersionArgs;
  distinct_on?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};

export type QueryRootGetLatestPayrollVersionAggregateArgs = {
  args: GetLatestPayrollVersionArgs;
  distinct_on?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};

export type QueryRootGetPayrollVersionHistoryArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};

export type QueryRootGetPayrollVersionHistoryAggregateArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};

export type QueryRootHolidaysArgs = {
  distinct_on?: InputMaybe<Array<HolidaysSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<HolidaysOrderBy>>;
  where?: InputMaybe<HolidaysBoolExp>;
};

export type QueryRootHolidaysAggregateArgs = {
  distinct_on?: InputMaybe<Array<HolidaysSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<HolidaysOrderBy>>;
  where?: InputMaybe<HolidaysBoolExp>;
};

export type QueryRootHolidaysByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootLatestPayrollVersionResultsArgs = {
  distinct_on?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};

export type QueryRootLatestPayrollVersionResultsAggregateArgs = {
  distinct_on?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};

export type QueryRootLatestPayrollVersionResultsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootLeaveArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootLeavesArgs = {
  distinct_on?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};

export type QueryRootLeavesAggregateArgs = {
  distinct_on?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};

export type QueryRootNeonAuthUsersSyncArgs = {
  distinct_on?: InputMaybe<Array<NeonAuthUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NeonAuthUsersSyncOrderBy>>;
  where?: InputMaybe<NeonAuthUsersSyncBoolExp>;
};

export type QueryRootNeonAuthUsersSyncAggregateArgs = {
  distinct_on?: InputMaybe<Array<NeonAuthUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NeonAuthUsersSyncOrderBy>>;
  where?: InputMaybe<NeonAuthUsersSyncBoolExp>;
};

export type QueryRootNeonAuthUsersSyncByPkArgs = {
  id: Scalars["String"]["input"];
};

export type QueryRootNotesArgs = {
  distinct_on?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};

export type QueryRootNotesAggregateArgs = {
  distinct_on?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};

export type QueryRootNotesByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootPayrollArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootPayrollAssignmentArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootPayrollAssignmentsArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};

export type QueryRootPayrollAssignmentsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};

export type QueryRootPayrollDateArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootPayrollDatesArgs = {
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};

export type QueryRootPayrollDatesAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};

export type QueryRootPayrollActivationResultsArgs = {
  distinct_on?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};

export type QueryRootPayrollActivationResultsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};

export type QueryRootPayrollActivationResultsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootPayrollAssignmentAuditArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

export type QueryRootPayrollAssignmentAuditAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

export type QueryRootPayrollAssignmentAuditByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootPayrollCyclesArgs = {
  distinct_on?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};

export type QueryRootPayrollCyclesAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};

export type QueryRootPayrollCyclesByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootPayrollDashboardStatsArgs = {
  distinct_on?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};

export type QueryRootPayrollDashboardStatsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};

export type QueryRootPayrollDateTypesArgs = {
  distinct_on?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};

export type QueryRootPayrollDateTypesAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};

export type QueryRootPayrollDateTypesByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootPayrollTriggersStatusArgs = {
  distinct_on?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};

export type QueryRootPayrollTriggersStatusAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};

export type QueryRootPayrollVersionHistoryResultsArgs = {
  distinct_on?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};

export type QueryRootPayrollVersionHistoryResultsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};

export type QueryRootPayrollVersionHistoryResultsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootPayrollVersionResultsArgs = {
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};

export type QueryRootPayrollVersionResultsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};

export type QueryRootPayrollVersionResultsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootPayrollsArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

export type QueryRootPayrollsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

export type QueryRootPermissionArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootPermissionAuditLogArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootPermissionAuditLogsArgs = {
  distinct_on?: InputMaybe<Array<PermissionAuditLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PermissionAuditLogOrderBy>>;
  where?: InputMaybe<PermissionAuditLogBoolExp>;
};

export type QueryRootPermissionAuditLogsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PermissionAuditLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PermissionAuditLogOrderBy>>;
  where?: InputMaybe<PermissionAuditLogBoolExp>;
};

export type QueryRootPermissionChangeArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootPermissionChangesArgs = {
  distinct_on?: InputMaybe<Array<AuditPermissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditPermissionChangesOrderBy>>;
  where?: InputMaybe<AuditPermissionChangesBoolExp>;
};

export type QueryRootPermissionChangesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditPermissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditPermissionChangesOrderBy>>;
  where?: InputMaybe<AuditPermissionChangesBoolExp>;
};

export type QueryRootPermissionOverrideArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootPermissionOverridesArgs = {
  distinct_on?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};

export type QueryRootPermissionOverridesAggregateArgs = {
  distinct_on?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};

export type QueryRootPermissionsArgs = {
  distinct_on?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};

export type QueryRootPermissionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};

export type QueryRootResourceArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootResourcesArgs = {
  distinct_on?: InputMaybe<Array<ResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ResourcesOrderBy>>;
  where?: InputMaybe<ResourcesBoolExp>;
};

export type QueryRootResourcesAggregateArgs = {
  distinct_on?: InputMaybe<Array<ResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ResourcesOrderBy>>;
  where?: InputMaybe<ResourcesBoolExp>;
};

export type QueryRootRoleArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootRolePermissionArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootRolePermissionsArgs = {
  distinct_on?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};

export type QueryRootRolePermissionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};

export type QueryRootRolesArgs = {
  distinct_on?: InputMaybe<Array<RolesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<RolesOrderBy>>;
  where?: InputMaybe<RolesBoolExp>;
};

export type QueryRootRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<RolesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<RolesOrderBy>>;
  where?: InputMaybe<RolesBoolExp>;
};

export type QueryRootUserArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootUserRoleArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootUserRolesArgs = {
  distinct_on?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};

export type QueryRootUserRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};

export type QueryRootUsersArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};

export type QueryRootUsersAggregateArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};

export type QueryRootUsersRoleBackupArgs = {
  distinct_on?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};

export type QueryRootUsersRoleBackupAggregateArgs = {
  distinct_on?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};

export type QueryRootWorkScheduleArgs = {
  id: Scalars["uuid"]["input"];
};

export type QueryRootWorkSchedulesArgs = {
  distinct_on?: InputMaybe<Array<WorkScheduleSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<WorkScheduleOrderBy>>;
  where?: InputMaybe<WorkScheduleBoolExp>;
};

export type QueryRootWorkSchedulesAggregateArgs = {
  distinct_on?: InputMaybe<Array<WorkScheduleSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<WorkScheduleOrderBy>>;
  where?: InputMaybe<WorkScheduleBoolExp>;
};

/** columns and relationships of "resources" */
export type Resources = {
  __typename: "resources";
  createdAt: Scalars["timestamptz"]["output"];
  description: Maybe<Scalars["String"]["output"]>;
  displayName: Scalars["String"]["output"];
  id: Scalars["uuid"]["output"];
  name: Scalars["String"]["output"];
  /** An array relationship */
  permissions: Array<Permissions>;
  /** An aggregate relationship */
  permissions_aggregate: PermissionsAggregate;
  updatedAt: Scalars["timestamptz"]["output"];
};

/** columns and relationships of "resources" */
export type ResourcesPermissionsArgs = {
  distinct_on?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};

/** columns and relationships of "resources" */
export type ResourcesPermissionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};

/** aggregated selection of "resources" */
export type ResourcesAggregate = {
  __typename: "resources_aggregate";
  aggregate: Maybe<ResourcesAggregateFields>;
  nodes: Array<Resources>;
};

/** aggregate fields of "resources" */
export type ResourcesAggregateFields = {
  __typename: "resources_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<ResourcesMaxFields>;
  min: Maybe<ResourcesMinFields>;
};

/** aggregate fields of "resources" */
export type ResourcesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ResourcesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "resources". All fields are combined with a logical 'AND'. */
export type ResourcesBoolExp = {
  _and?: InputMaybe<Array<ResourcesBoolExp>>;
  _not?: InputMaybe<ResourcesBoolExp>;
  _or?: InputMaybe<Array<ResourcesBoolExp>>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  displayName?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  permissions?: InputMaybe<PermissionsBoolExp>;
  permissions_aggregate?: InputMaybe<PermissionsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "resources" */
export enum ResourcesConstraint {
  /** unique or primary key constraint on columns "name" */
  resources_name_key = "resources_name_key",
  /** unique or primary key constraint on columns "id" */
  resources_pkey = "resources_pkey",
}

/** input type for inserting data into table "resources" */
export type ResourcesInsertInput = {
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  permissions?: InputMaybe<PermissionsArrRelInsertInput>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type ResourcesMaxFields = {
  __typename: "resources_max_fields";
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  displayName: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type ResourcesMinFields = {
  __typename: "resources_min_fields";
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  displayName: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "resources" */
export type ResourcesMutationResponse = {
  __typename: "resources_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  displayName?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  permissions_aggregate?: InputMaybe<PermissionsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: resources */
export type ResourcesPkColumnsInput = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "resources" */
export enum ResourcesSelectColumn {
  /** column name */
  createdAt = "createdAt",
  /** column name */
  description = "description",
  /** column name */
  displayName = "displayName",
  /** column name */
  id = "id",
  /** column name */
  name = "name",
  /** column name */
  updatedAt = "updatedAt",
}

/** input type for updating data in table "resources" */
export type ResourcesSetInput = {
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
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
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "resources" */
export enum ResourcesUpdateColumn {
  /** column name */
  createdAt = "createdAt",
  /** column name */
  description = "description",
  /** column name */
  displayName = "displayName",
  /** column name */
  id = "id",
  /** column name */
  name = "name",
  /** column name */
  updatedAt = "updatedAt",
}

export type ResourcesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ResourcesSetInput>;
  /** filter the rows which have to be updated */
  where: ResourcesBoolExp;
};

/** columns and relationships of "role_permissions" */
export type RolePermissions = {
  __typename: "role_permissions";
  conditions: Maybe<Scalars["jsonb"]["output"]>;
  createdAt: Scalars["timestamptz"]["output"];
  id: Scalars["uuid"]["output"];
  /** An object relationship */
  permission: Permissions;
  permissionId: Scalars["uuid"]["output"];
  /** An object relationship */
  role: Roles;
  roleId: Scalars["uuid"]["output"];
  updatedAt: Scalars["timestamptz"]["output"];
};

/** columns and relationships of "role_permissions" */
export type RolePermissionsConditionsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "role_permissions" */
export type RolePermissionsAggregate = {
  __typename: "role_permissions_aggregate";
  aggregate: Maybe<RolePermissionsAggregateFields>;
  nodes: Array<RolePermissions>;
};

export type RolePermissionsAggregateBoolExp = {
  count?: InputMaybe<RolePermissionsAggregateBoolExpCount>;
};

export type RolePermissionsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<RolePermissionsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "role_permissions" */
export type RolePermissionsAggregateFields = {
  __typename: "role_permissions_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<RolePermissionsMaxFields>;
  min: Maybe<RolePermissionsMinFields>;
};

/** aggregate fields of "role_permissions" */
export type RolePermissionsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "role_permissions" */
export type RolePermissionsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<RolePermissionsMaxOrderBy>;
  min?: InputMaybe<RolePermissionsMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type RolePermissionsAppendInput = {
  conditions?: InputMaybe<Scalars["jsonb"]["input"]>;
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
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  permission?: InputMaybe<PermissionsBoolExp>;
  permissionId?: InputMaybe<UuidComparisonExp>;
  role?: InputMaybe<RolesBoolExp>;
  roleId?: InputMaybe<UuidComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "role_permissions" */
export enum RolePermissionsConstraint {
  /** unique or primary key constraint on columns "id" */
  role_permissions_pkey = "role_permissions_pkey",
  /** unique or primary key constraint on columns "permission_id", "role_id" */
  role_permissions_role_id_permission_id_key = "role_permissions_role_id_permission_id_key",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type RolePermissionsDeleteAtPathInput = {
  conditions?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type RolePermissionsDeleteElemInput = {
  conditions?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type RolePermissionsDeleteKeyInput = {
  conditions?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "role_permissions" */
export type RolePermissionsInsertInput = {
  conditions?: InputMaybe<Scalars["jsonb"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  permission?: InputMaybe<PermissionsObjRelInsertInput>;
  permissionId?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<RolesObjRelInsertInput>;
  roleId?: InputMaybe<Scalars["uuid"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type RolePermissionsMaxFields = {
  __typename: "role_permissions_max_fields";
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  permissionId: Maybe<Scalars["uuid"]["output"]>;
  roleId: Maybe<Scalars["uuid"]["output"]>;
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "role_permissions_min_fields";
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  permissionId: Maybe<Scalars["uuid"]["output"]>;
  roleId: Maybe<Scalars["uuid"]["output"]>;
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
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
  __typename: "role_permissions_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  permission?: InputMaybe<PermissionsOrderBy>;
  permissionId?: InputMaybe<OrderBy>;
  role?: InputMaybe<RolesOrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: role_permissions */
export type RolePermissionsPkColumnsInput = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type RolePermissionsPrependInput = {
  conditions?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "role_permissions" */
export enum RolePermissionsSelectColumn {
  /** column name */
  conditions = "conditions",
  /** column name */
  createdAt = "createdAt",
  /** column name */
  id = "id",
  /** column name */
  permissionId = "permissionId",
  /** column name */
  roleId = "roleId",
  /** column name */
  updatedAt = "updatedAt",
}

/** input type for updating data in table "role_permissions" */
export type RolePermissionsSetInput = {
  conditions?: InputMaybe<Scalars["jsonb"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  permissionId?: InputMaybe<Scalars["uuid"]["input"]>;
  roleId?: InputMaybe<Scalars["uuid"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
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
  conditions?: InputMaybe<Scalars["jsonb"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  permissionId?: InputMaybe<Scalars["uuid"]["input"]>;
  roleId?: InputMaybe<Scalars["uuid"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "role_permissions" */
export enum RolePermissionsUpdateColumn {
  /** column name */
  conditions = "conditions",
  /** column name */
  createdAt = "createdAt",
  /** column name */
  id = "id",
  /** column name */
  permissionId = "permissionId",
  /** column name */
  roleId = "roleId",
  /** column name */
  updatedAt = "updatedAt",
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
  __typename: "roles";
  createdAt: Scalars["timestamptz"]["output"];
  description: Maybe<Scalars["String"]["output"]>;
  displayName: Scalars["String"]["output"];
  id: Scalars["uuid"]["output"];
  isSystemRole: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  priority: Scalars["Int"]["output"];
  /** An array relationship */
  rolePermissions: Array<RolePermissions>;
  /** An aggregate relationship */
  rolePermissions_aggregate: RolePermissionsAggregate;
  updatedAt: Scalars["timestamptz"]["output"];
  /** An array relationship */
  userRoles: Array<UserRoles>;
  /** An aggregate relationship */
  userRoles_aggregate: UserRolesAggregate;
};

/** columns and relationships of "roles" */
export type RolesRolePermissionsArgs = {
  distinct_on?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};

/** columns and relationships of "roles" */
export type RolesRolePermissionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};

/** columns and relationships of "roles" */
export type RolesUserRolesArgs = {
  distinct_on?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};

/** columns and relationships of "roles" */
export type RolesUserRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};

/** aggregated selection of "roles" */
export type RolesAggregate = {
  __typename: "roles_aggregate";
  aggregate: Maybe<RolesAggregateFields>;
  nodes: Array<Roles>;
};

/** aggregate fields of "roles" */
export type RolesAggregateFields = {
  __typename: "roles_aggregate_fields";
  avg: Maybe<RolesAvgFields>;
  count: Scalars["Int"]["output"];
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type RolesAvgFields = {
  __typename: "roles_avg_fields";
  priority: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "roles". All fields are combined with a logical 'AND'. */
export type RolesBoolExp = {
  _and?: InputMaybe<Array<RolesBoolExp>>;
  _not?: InputMaybe<RolesBoolExp>;
  _or?: InputMaybe<Array<RolesBoolExp>>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  displayName?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isSystemRole?: InputMaybe<BooleanComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  priority?: InputMaybe<IntComparisonExp>;
  rolePermissions?: InputMaybe<RolePermissionsBoolExp>;
  rolePermissions_aggregate?: InputMaybe<RolePermissionsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  userRoles?: InputMaybe<UserRolesBoolExp>;
  userRoles_aggregate?: InputMaybe<UserRolesAggregateBoolExp>;
};

/** unique or primary key constraints on table "roles" */
export enum RolesConstraint {
  /** unique or primary key constraint on columns "name" */
  roles_name_key = "roles_name_key",
  /** unique or primary key constraint on columns "id" */
  roles_pkey = "roles_pkey",
}

/** input type for incrementing numeric columns in table "roles" */
export type RolesIncInput = {
  priority?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "roles" */
export type RolesInsertInput = {
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  isSystemRole?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  priority?: InputMaybe<Scalars["Int"]["input"]>;
  rolePermissions?: InputMaybe<RolePermissionsArrRelInsertInput>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  userRoles?: InputMaybe<UserRolesArrRelInsertInput>;
};

/** aggregate max on columns */
export type RolesMaxFields = {
  __typename: "roles_max_fields";
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  displayName: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  priority: Maybe<Scalars["Int"]["output"]>;
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type RolesMinFields = {
  __typename: "roles_min_fields";
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  displayName: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  priority: Maybe<Scalars["Int"]["output"]>;
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "roles" */
export type RolesMutationResponse = {
  __typename: "roles_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  displayName?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isSystemRole?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  priority?: InputMaybe<OrderBy>;
  rolePermissions_aggregate?: InputMaybe<RolePermissionsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userRoles_aggregate?: InputMaybe<UserRolesAggregateOrderBy>;
};

/** primary key columns input for table: roles */
export type RolesPkColumnsInput = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "roles" */
export enum RolesSelectColumn {
  /** column name */
  createdAt = "createdAt",
  /** column name */
  description = "description",
  /** column name */
  displayName = "displayName",
  /** column name */
  id = "id",
  /** column name */
  isSystemRole = "isSystemRole",
  /** column name */
  name = "name",
  /** column name */
  priority = "priority",
  /** column name */
  updatedAt = "updatedAt",
}

/** input type for updating data in table "roles" */
export type RolesSetInput = {
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  isSystemRole?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  priority?: InputMaybe<Scalars["Int"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate stddev on columns */
export type RolesStddevFields = {
  __typename: "roles_stddev_fields";
  priority: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type RolesStddevPopFields = {
  __typename: "roles_stddev_pop_fields";
  priority: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type RolesStddevSampFields = {
  __typename: "roles_stddev_samp_fields";
  priority: Maybe<Scalars["Float"]["output"]>;
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
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  isSystemRole?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  priority?: InputMaybe<Scalars["Int"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate sum on columns */
export type RolesSumFields = {
  __typename: "roles_sum_fields";
  priority: Maybe<Scalars["Int"]["output"]>;
};

/** update columns of table "roles" */
export enum RolesUpdateColumn {
  /** column name */
  createdAt = "createdAt",
  /** column name */
  description = "description",
  /** column name */
  displayName = "displayName",
  /** column name */
  id = "id",
  /** column name */
  isSystemRole = "isSystemRole",
  /** column name */
  name = "name",
  /** column name */
  priority = "priority",
  /** column name */
  updatedAt = "updatedAt",
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
  __typename: "roles_var_pop_fields";
  priority: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type RolesVarSampFields = {
  __typename: "roles_var_samp_fields";
  priority: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type RolesVarianceFields = {
  __typename: "roles_variance_fields";
  priority: Maybe<Scalars["Float"]["output"]>;
};

export type SubscriptionRoot = {
  __typename: "subscription_root";
  /** execute function "activate_payroll_versions" which returns "payroll_activation_results" */
  activatePayrollVersions: Array<PayrollActivationResults>;
  /** execute function "activate_payroll_versions" and query aggregates on result of table type "payroll_activation_results" */
  activatePayrollVersionsAggregate: PayrollActivationResultsAggregate;
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
  /** fetch data from the table: "audit.audit_log" using primary key columns */
  auditLog: Maybe<AuditAuditLog>;
  /** fetch data from the table: "audit.audit_log" */
  auditLogs: Array<AuditAuditLog>;
  /** fetch aggregated fields from the table: "audit.audit_log" */
  auditLogsAggregate: AuditAuditLogAggregate;
  /** fetch data from the table in a streaming manner: "audit.audit_log" */
  audit_audit_log_stream: Array<AuditAuditLog>;
  /** fetch data from the table in a streaming manner: "audit.auth_events" */
  audit_auth_events_stream: Array<AuditAuthEvents>;
  /** fetch data from the table in a streaming manner: "audit.data_access_log" */
  audit_data_access_log_stream: Array<AuditDataAccessLog>;
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
  /** fetch data from the table: "audit.auth_events" using primary key columns */
  authEvent: Maybe<AuditAuthEvents>;
  /** fetch data from the table: "audit.auth_events" */
  authEvents: Array<AuditAuthEvents>;
  /** fetch aggregated fields from the table: "audit.auth_events" */
  authEventsAggregate: AuditAuthEventsAggregate;
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
  /** fetch data from the table: "clients" using primary key columns */
  client: Maybe<Clients>;
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
  clientsAggregate: ClientsAggregate;
  /** fetch data from the table in a streaming manner: "clients" */
  clients_stream: Array<Clients>;
  /** execute function "create_payroll_version" which returns "payroll_version_results" */
  createPayrollVersion: Array<PayrollVersionResults>;
  /** execute function "create_payroll_version" and query aggregates on result of table type "payroll_version_results" */
  createPayrollVersionAggregate: PayrollVersionResultsAggregate;
  /** execute function "create_payroll_version_simple" which returns "payroll_version_results" */
  createPayrollVersionSimple: Array<PayrollVersionResults>;
  /** execute function "create_payroll_version_simple" and query aggregates on result of table type "payroll_version_results" */
  createPayrollVersionSimpleAggregate: PayrollVersionResultsAggregate;
  /** fetch data from the table: "current_payrolls" */
  current_payrolls: Array<CurrentPayrolls>;
  /** fetch aggregated fields from the table: "current_payrolls" */
  current_payrolls_aggregate: CurrentPayrollsAggregate;
  /** fetch data from the table in a streaming manner: "current_payrolls" */
  current_payrolls_stream: Array<CurrentPayrolls>;
  /** fetch data from the table: "audit.data_access_log" using primary key columns */
  dataAccessLog: Maybe<AuditDataAccessLog>;
  /** fetch data from the table: "audit.data_access_log" */
  dataAccessLogs: Array<AuditDataAccessLog>;
  /** fetch aggregated fields from the table: "audit.data_access_log" */
  dataAccessLogsAggregate: AuditDataAccessLogAggregate;
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
  /** fetch data from the table: "leave" using primary key columns */
  leave: Maybe<Leave>;
  /** fetch data from the table in a streaming manner: "leave" */
  leave_stream: Array<Leave>;
  /** An array relationship */
  leaves: Array<Leave>;
  /** fetch aggregated fields from the table: "leave" */
  leavesAggregate: LeaveAggregate;
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
  /** fetch data from the table: "payrolls" using primary key columns */
  payroll: Maybe<Payrolls>;
  /** fetch data from the table: "payroll_assignments" using primary key columns */
  payrollAssignment: Maybe<PayrollAssignments>;
  /** fetch data from the table: "payroll_assignments" */
  payrollAssignments: Array<PayrollAssignments>;
  /** fetch aggregated fields from the table: "payroll_assignments" */
  payrollAssignmentsAggregate: PayrollAssignmentsAggregate;
  /** fetch data from the table: "payroll_dates" using primary key columns */
  payrollDate: Maybe<PayrollDates>;
  /** An array relationship */
  payrollDates: Array<PayrollDates>;
  /** fetch aggregated fields from the table: "payroll_dates" */
  payrollDatesAggregate: PayrollDatesAggregate;
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
  /** fetch aggregated fields from the table: "payrolls" */
  payrollsAggregate: PayrollsAggregate;
  /** fetch data from the table in a streaming manner: "payrolls" */
  payrolls_stream: Array<Payrolls>;
  /** fetch data from the table: "permissions" using primary key columns */
  permission: Maybe<Permissions>;
  /** fetch data from the table: "permission_audit_log" using primary key columns */
  permissionAuditLog: Maybe<PermissionAuditLog>;
  /** fetch data from the table: "permission_audit_log" */
  permissionAuditLogs: Array<PermissionAuditLog>;
  /** fetch aggregated fields from the table: "permission_audit_log" */
  permissionAuditLogsAggregate: PermissionAuditLogAggregate;
  /** fetch data from the table: "audit.permission_changes" using primary key columns */
  permissionChange: Maybe<AuditPermissionChanges>;
  /** fetch data from the table: "audit.permission_changes" */
  permissionChanges: Array<AuditPermissionChanges>;
  /** fetch aggregated fields from the table: "audit.permission_changes" */
  permissionChangesAggregate: AuditPermissionChangesAggregate;
  /** fetch data from the table: "permission_overrides" using primary key columns */
  permissionOverride: Maybe<PermissionOverrides>;
  /** fetch data from the table: "permission_overrides" */
  permissionOverrides: Array<PermissionOverrides>;
  /** fetch aggregated fields from the table: "permission_overrides" */
  permissionOverridesAggregate: PermissionOverridesAggregate;
  /** fetch data from the table in a streaming manner: "permission_audit_log" */
  permission_audit_log_stream: Array<PermissionAuditLog>;
  /** fetch data from the table in a streaming manner: "permission_overrides" */
  permission_overrides_stream: Array<PermissionOverrides>;
  /** An array relationship */
  permissions: Array<Permissions>;
  /** fetch aggregated fields from the table: "permissions" */
  permissionsAggregate: PermissionsAggregate;
  /** fetch data from the table in a streaming manner: "permissions" */
  permissions_stream: Array<Permissions>;
  /** fetch data from the table: "resources" using primary key columns */
  resource: Maybe<Resources>;
  /** fetch data from the table: "resources" */
  resources: Array<Resources>;
  /** fetch aggregated fields from the table: "resources" */
  resourcesAggregate: ResourcesAggregate;
  /** fetch data from the table in a streaming manner: "resources" */
  resources_stream: Array<Resources>;
  /** fetch data from the table: "roles" using primary key columns */
  role: Maybe<Roles>;
  /** fetch data from the table: "role_permissions" using primary key columns */
  rolePermission: Maybe<RolePermissions>;
  /** An array relationship */
  rolePermissions: Array<RolePermissions>;
  /** fetch aggregated fields from the table: "role_permissions" */
  rolePermissionsAggregate: RolePermissionsAggregate;
  /** fetch data from the table in a streaming manner: "role_permissions" */
  role_permissions_stream: Array<RolePermissions>;
  /** fetch data from the table: "roles" */
  roles: Array<Roles>;
  /** fetch aggregated fields from the table: "roles" */
  rolesAggregate: RolesAggregate;
  /** fetch data from the table in a streaming manner: "roles" */
  roles_stream: Array<Roles>;
  /** fetch data from the table: "users" using primary key columns */
  user: Maybe<Users>;
  /** fetch data from the table: "user_roles" using primary key columns */
  userRole: Maybe<UserRoles>;
  /** An array relationship */
  userRoles: Array<UserRoles>;
  /** fetch aggregated fields from the table: "user_roles" */
  userRolesAggregate: UserRolesAggregate;
  /** fetch data from the table in a streaming manner: "user_roles" */
  user_roles_stream: Array<UserRoles>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  usersAggregate: UsersAggregate;
  /** fetch data from the table: "users_role_backup" */
  users_role_backup: Array<UsersRoleBackup>;
  /** fetch aggregated fields from the table: "users_role_backup" */
  users_role_backup_aggregate: UsersRoleBackupAggregate;
  /** fetch data from the table in a streaming manner: "users_role_backup" */
  users_role_backup_stream: Array<UsersRoleBackup>;
  /** fetch data from the table in a streaming manner: "users" */
  users_stream: Array<Users>;
  /** fetch data from the table: "work_schedule" using primary key columns */
  workSchedule: Maybe<WorkSchedule>;
  /** An array relationship */
  workSchedules: Array<WorkSchedule>;
  /** fetch aggregated fields from the table: "work_schedule" */
  workSchedulesAggregate: WorkScheduleAggregate;
  /** fetch data from the table in a streaming manner: "work_schedule" */
  work_schedule_stream: Array<WorkSchedule>;
};

export type SubscriptionRootActivatePayrollVersionsArgs = {
  distinct_on?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};

export type SubscriptionRootActivatePayrollVersionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};

export type SubscriptionRootAdjustmentRulesArgs = {
  distinct_on?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};

export type SubscriptionRootAdjustmentRulesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};

export type SubscriptionRootAdjustmentRulesByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootAdjustmentRulesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<AdjustmentRulesStreamCursorInput>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};

export type SubscriptionRootAppSettingsArgs = {
  distinct_on?: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AppSettingsOrderBy>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};

export type SubscriptionRootAppSettingsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AppSettingsOrderBy>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};

export type SubscriptionRootAppSettingsByPkArgs = {
  id: Scalars["String"]["input"];
};

export type SubscriptionRootAppSettingsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<AppSettingsStreamCursorInput>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};

export type SubscriptionRootAuditLogArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootAuditLogsArgs = {
  distinct_on?: InputMaybe<Array<AuditAuditLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditAuditLogOrderBy>>;
  where?: InputMaybe<AuditAuditLogBoolExp>;
};

export type SubscriptionRootAuditLogsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditAuditLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditAuditLogOrderBy>>;
  where?: InputMaybe<AuditAuditLogBoolExp>;
};

export type SubscriptionRootAuditAuditLogStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<AuditAuditLogStreamCursorInput>>;
  where?: InputMaybe<AuditAuditLogBoolExp>;
};

export type SubscriptionRootAuditAuthEventsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<AuditAuthEventsStreamCursorInput>>;
  where?: InputMaybe<AuditAuthEventsBoolExp>;
};

export type SubscriptionRootAuditDataAccessLogStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<AuditDataAccessLogStreamCursorInput>>;
  where?: InputMaybe<AuditDataAccessLogBoolExp>;
};

export type SubscriptionRootAuditPermissionChangesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<AuditPermissionChangesStreamCursorInput>>;
  where?: InputMaybe<AuditPermissionChangesBoolExp>;
};

export type SubscriptionRootAuditPermissionUsageReportArgs = {
  distinct_on?: InputMaybe<Array<AuditPermissionUsageReportSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditPermissionUsageReportOrderBy>>;
  where?: InputMaybe<AuditPermissionUsageReportBoolExp>;
};

export type SubscriptionRootAuditPermissionUsageReportAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditPermissionUsageReportSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditPermissionUsageReportOrderBy>>;
  where?: InputMaybe<AuditPermissionUsageReportBoolExp>;
};

export type SubscriptionRootAuditPermissionUsageReportStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<AuditPermissionUsageReportStreamCursorInput>>;
  where?: InputMaybe<AuditPermissionUsageReportBoolExp>;
};

export type SubscriptionRootAuditSlowQueriesArgs = {
  distinct_on?: InputMaybe<Array<AuditSlowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditSlowQueriesOrderBy>>;
  where?: InputMaybe<AuditSlowQueriesBoolExp>;
};

export type SubscriptionRootAuditSlowQueriesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditSlowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditSlowQueriesOrderBy>>;
  where?: InputMaybe<AuditSlowQueriesBoolExp>;
};

export type SubscriptionRootAuditSlowQueriesByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootAuditSlowQueriesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<AuditSlowQueriesStreamCursorInput>>;
  where?: InputMaybe<AuditSlowQueriesBoolExp>;
};

export type SubscriptionRootAuditUserAccessSummaryArgs = {
  distinct_on?: InputMaybe<Array<AuditUserAccessSummarySelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditUserAccessSummaryOrderBy>>;
  where?: InputMaybe<AuditUserAccessSummaryBoolExp>;
};

export type SubscriptionRootAuditUserAccessSummaryAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditUserAccessSummarySelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditUserAccessSummaryOrderBy>>;
  where?: InputMaybe<AuditUserAccessSummaryBoolExp>;
};

export type SubscriptionRootAuditUserAccessSummaryStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<AuditUserAccessSummaryStreamCursorInput>>;
  where?: InputMaybe<AuditUserAccessSummaryBoolExp>;
};

export type SubscriptionRootAuthEventArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootAuthEventsArgs = {
  distinct_on?: InputMaybe<Array<AuditAuthEventsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditAuthEventsOrderBy>>;
  where?: InputMaybe<AuditAuthEventsBoolExp>;
};

export type SubscriptionRootAuthEventsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditAuthEventsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditAuthEventsOrderBy>>;
  where?: InputMaybe<AuditAuthEventsBoolExp>;
};

export type SubscriptionRootBillingEventLogArgs = {
  distinct_on?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingEventLogOrderBy>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};

export type SubscriptionRootBillingEventLogAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingEventLogOrderBy>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};

export type SubscriptionRootBillingEventLogByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootBillingEventLogStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<BillingEventLogStreamCursorInput>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};

export type SubscriptionRootBillingInvoiceArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};

export type SubscriptionRootBillingInvoiceAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};

export type SubscriptionRootBillingInvoiceByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootBillingInvoiceItemArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};

export type SubscriptionRootBillingInvoiceItemAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};

export type SubscriptionRootBillingInvoiceItemByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootBillingInvoiceItemStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<BillingInvoiceItemStreamCursorInput>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};

export type SubscriptionRootBillingInvoiceStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<BillingInvoiceStreamCursorInput>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};

export type SubscriptionRootBillingInvoicesArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoicesOrderBy>>;
  where?: InputMaybe<BillingInvoicesBoolExp>;
};

export type SubscriptionRootBillingInvoicesAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingInvoicesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingInvoicesOrderBy>>;
  where?: InputMaybe<BillingInvoicesBoolExp>;
};

export type SubscriptionRootBillingInvoicesByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootBillingInvoicesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<BillingInvoicesStreamCursorInput>>;
  where?: InputMaybe<BillingInvoicesBoolExp>;
};

export type SubscriptionRootBillingItemsArgs = {
  distinct_on?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};

export type SubscriptionRootBillingItemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};

export type SubscriptionRootBillingItemsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootBillingItemsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<BillingItemsStreamCursorInput>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};

export type SubscriptionRootBillingPlanArgs = {
  distinct_on?: InputMaybe<Array<BillingPlanSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingPlanOrderBy>>;
  where?: InputMaybe<BillingPlanBoolExp>;
};

export type SubscriptionRootBillingPlanAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingPlanSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingPlanOrderBy>>;
  where?: InputMaybe<BillingPlanBoolExp>;
};

export type SubscriptionRootBillingPlanByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootBillingPlanStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<BillingPlanStreamCursorInput>>;
  where?: InputMaybe<BillingPlanBoolExp>;
};

export type SubscriptionRootClientArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootClientBillingAssignmentArgs = {
  distinct_on?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientBillingAssignmentOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};

export type SubscriptionRootClientBillingAssignmentAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientBillingAssignmentSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientBillingAssignmentOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};

export type SubscriptionRootClientBillingAssignmentByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootClientBillingAssignmentStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<ClientBillingAssignmentStreamCursorInput>>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};

export type SubscriptionRootClientExternalSystemsArgs = {
  distinct_on?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};

export type SubscriptionRootClientExternalSystemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};

export type SubscriptionRootClientExternalSystemsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootClientExternalSystemsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<ClientExternalSystemsStreamCursorInput>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};

export type SubscriptionRootClientsArgs = {
  distinct_on?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};

export type SubscriptionRootClientsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};

export type SubscriptionRootClientsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<ClientsStreamCursorInput>>;
  where?: InputMaybe<ClientsBoolExp>;
};

export type SubscriptionRootCreatePayrollVersionArgs = {
  args: CreatePayrollVersionArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};

export type SubscriptionRootCreatePayrollVersionAggregateArgs = {
  args: CreatePayrollVersionArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};

export type SubscriptionRootCreatePayrollVersionSimpleArgs = {
  args: CreatePayrollVersionSimpleArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};

export type SubscriptionRootCreatePayrollVersionSimpleAggregateArgs = {
  args: CreatePayrollVersionSimpleArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};

export type SubscriptionRootCurrentPayrollsArgs = {
  distinct_on?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};

export type SubscriptionRootCurrentPayrollsAggregateArgs = {
  distinct_on?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};

export type SubscriptionRootCurrentPayrollsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<CurrentPayrollsStreamCursorInput>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};

export type SubscriptionRootDataAccessLogArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootDataAccessLogsArgs = {
  distinct_on?: InputMaybe<Array<AuditDataAccessLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditDataAccessLogOrderBy>>;
  where?: InputMaybe<AuditDataAccessLogBoolExp>;
};

export type SubscriptionRootDataAccessLogsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditDataAccessLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditDataAccessLogOrderBy>>;
  where?: InputMaybe<AuditDataAccessLogBoolExp>;
};

export type SubscriptionRootExternalSystemsArgs = {
  distinct_on?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};

export type SubscriptionRootExternalSystemsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};

export type SubscriptionRootExternalSystemsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootExternalSystemsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<ExternalSystemsStreamCursorInput>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};

export type SubscriptionRootFeatureFlagsArgs = {
  distinct_on?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};

export type SubscriptionRootFeatureFlagsAggregateArgs = {
  distinct_on?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};

export type SubscriptionRootFeatureFlagsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootFeatureFlagsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<FeatureFlagsStreamCursorInput>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};

export type SubscriptionRootGeneratePayrollDatesArgs = {
  args: GeneratePayrollDatesArgs;
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};

export type SubscriptionRootGeneratePayrollDatesAggregateArgs = {
  args: GeneratePayrollDatesArgs;
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};

export type SubscriptionRootGetLatestPayrollVersionArgs = {
  args: GetLatestPayrollVersionArgs;
  distinct_on?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};

export type SubscriptionRootGetLatestPayrollVersionAggregateArgs = {
  args: GetLatestPayrollVersionArgs;
  distinct_on?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};

export type SubscriptionRootGetPayrollVersionHistoryArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};

export type SubscriptionRootGetPayrollVersionHistoryAggregateArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinct_on?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};

export type SubscriptionRootHolidaysArgs = {
  distinct_on?: InputMaybe<Array<HolidaysSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<HolidaysOrderBy>>;
  where?: InputMaybe<HolidaysBoolExp>;
};

export type SubscriptionRootHolidaysAggregateArgs = {
  distinct_on?: InputMaybe<Array<HolidaysSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<HolidaysOrderBy>>;
  where?: InputMaybe<HolidaysBoolExp>;
};

export type SubscriptionRootHolidaysByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootHolidaysStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<HolidaysStreamCursorInput>>;
  where?: InputMaybe<HolidaysBoolExp>;
};

export type SubscriptionRootLatestPayrollVersionResultsArgs = {
  distinct_on?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};

export type SubscriptionRootLatestPayrollVersionResultsAggregateArgs = {
  distinct_on?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};

export type SubscriptionRootLatestPayrollVersionResultsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootLatestPayrollVersionResultsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<LatestPayrollVersionResultsStreamCursorInput>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};

export type SubscriptionRootLeaveArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootLeaveStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<LeaveStreamCursorInput>>;
  where?: InputMaybe<LeaveBoolExp>;
};

export type SubscriptionRootLeavesArgs = {
  distinct_on?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};

export type SubscriptionRootLeavesAggregateArgs = {
  distinct_on?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};

export type SubscriptionRootNeonAuthUsersSyncArgs = {
  distinct_on?: InputMaybe<Array<NeonAuthUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NeonAuthUsersSyncOrderBy>>;
  where?: InputMaybe<NeonAuthUsersSyncBoolExp>;
};

export type SubscriptionRootNeonAuthUsersSyncAggregateArgs = {
  distinct_on?: InputMaybe<Array<NeonAuthUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NeonAuthUsersSyncOrderBy>>;
  where?: InputMaybe<NeonAuthUsersSyncBoolExp>;
};

export type SubscriptionRootNeonAuthUsersSyncByPkArgs = {
  id: Scalars["String"]["input"];
};

export type SubscriptionRootNeonAuthUsersSyncStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<NeonAuthUsersSyncStreamCursorInput>>;
  where?: InputMaybe<NeonAuthUsersSyncBoolExp>;
};

export type SubscriptionRootNotesArgs = {
  distinct_on?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};

export type SubscriptionRootNotesAggregateArgs = {
  distinct_on?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};

export type SubscriptionRootNotesByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootNotesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<NotesStreamCursorInput>>;
  where?: InputMaybe<NotesBoolExp>;
};

export type SubscriptionRootPayrollArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootPayrollAssignmentArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootPayrollAssignmentsArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};

export type SubscriptionRootPayrollAssignmentsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};

export type SubscriptionRootPayrollDateArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootPayrollDatesArgs = {
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};

export type SubscriptionRootPayrollDatesAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};

export type SubscriptionRootPayrollActivationResultsArgs = {
  distinct_on?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};

export type SubscriptionRootPayrollActivationResultsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};

export type SubscriptionRootPayrollActivationResultsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootPayrollActivationResultsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<PayrollActivationResultsStreamCursorInput>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};

export type SubscriptionRootPayrollAssignmentAuditArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

export type SubscriptionRootPayrollAssignmentAuditAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

export type SubscriptionRootPayrollAssignmentAuditByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootPayrollAssignmentAuditStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<PayrollAssignmentAuditStreamCursorInput>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

export type SubscriptionRootPayrollAssignmentsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<PayrollAssignmentsStreamCursorInput>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};

export type SubscriptionRootPayrollCyclesArgs = {
  distinct_on?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};

export type SubscriptionRootPayrollCyclesAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};

export type SubscriptionRootPayrollCyclesByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootPayrollCyclesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<PayrollCyclesStreamCursorInput>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};

export type SubscriptionRootPayrollDashboardStatsArgs = {
  distinct_on?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};

export type SubscriptionRootPayrollDashboardStatsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};

export type SubscriptionRootPayrollDashboardStatsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<PayrollDashboardStatsStreamCursorInput>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};

export type SubscriptionRootPayrollDateTypesArgs = {
  distinct_on?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};

export type SubscriptionRootPayrollDateTypesAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};

export type SubscriptionRootPayrollDateTypesByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootPayrollDateTypesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<PayrollDateTypesStreamCursorInput>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};

export type SubscriptionRootPayrollDatesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<PayrollDatesStreamCursorInput>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};

export type SubscriptionRootPayrollTriggersStatusArgs = {
  distinct_on?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};

export type SubscriptionRootPayrollTriggersStatusAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};

export type SubscriptionRootPayrollTriggersStatusStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<PayrollTriggersStatusStreamCursorInput>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};

export type SubscriptionRootPayrollVersionHistoryResultsArgs = {
  distinct_on?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};

export type SubscriptionRootPayrollVersionHistoryResultsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};

export type SubscriptionRootPayrollVersionHistoryResultsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootPayrollVersionHistoryResultsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<PayrollVersionHistoryResultsStreamCursorInput>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};

export type SubscriptionRootPayrollVersionResultsArgs = {
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};

export type SubscriptionRootPayrollVersionResultsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};

export type SubscriptionRootPayrollVersionResultsByPkArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootPayrollVersionResultsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<PayrollVersionResultsStreamCursorInput>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};

export type SubscriptionRootPayrollsArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

export type SubscriptionRootPayrollsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

export type SubscriptionRootPayrollsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<PayrollsStreamCursorInput>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

export type SubscriptionRootPermissionArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootPermissionAuditLogArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootPermissionAuditLogsArgs = {
  distinct_on?: InputMaybe<Array<PermissionAuditLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PermissionAuditLogOrderBy>>;
  where?: InputMaybe<PermissionAuditLogBoolExp>;
};

export type SubscriptionRootPermissionAuditLogsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PermissionAuditLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PermissionAuditLogOrderBy>>;
  where?: InputMaybe<PermissionAuditLogBoolExp>;
};

export type SubscriptionRootPermissionChangeArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootPermissionChangesArgs = {
  distinct_on?: InputMaybe<Array<AuditPermissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditPermissionChangesOrderBy>>;
  where?: InputMaybe<AuditPermissionChangesBoolExp>;
};

export type SubscriptionRootPermissionChangesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuditPermissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<AuditPermissionChangesOrderBy>>;
  where?: InputMaybe<AuditPermissionChangesBoolExp>;
};

export type SubscriptionRootPermissionOverrideArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootPermissionOverridesArgs = {
  distinct_on?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};

export type SubscriptionRootPermissionOverridesAggregateArgs = {
  distinct_on?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};

export type SubscriptionRootPermissionAuditLogStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<PermissionAuditLogStreamCursorInput>>;
  where?: InputMaybe<PermissionAuditLogBoolExp>;
};

export type SubscriptionRootPermissionOverridesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<PermissionOverridesStreamCursorInput>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};

export type SubscriptionRootPermissionsArgs = {
  distinct_on?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};

export type SubscriptionRootPermissionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};

export type SubscriptionRootPermissionsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<PermissionsStreamCursorInput>>;
  where?: InputMaybe<PermissionsBoolExp>;
};

export type SubscriptionRootResourceArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootResourcesArgs = {
  distinct_on?: InputMaybe<Array<ResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ResourcesOrderBy>>;
  where?: InputMaybe<ResourcesBoolExp>;
};

export type SubscriptionRootResourcesAggregateArgs = {
  distinct_on?: InputMaybe<Array<ResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<ResourcesOrderBy>>;
  where?: InputMaybe<ResourcesBoolExp>;
};

export type SubscriptionRootResourcesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<ResourcesStreamCursorInput>>;
  where?: InputMaybe<ResourcesBoolExp>;
};

export type SubscriptionRootRoleArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootRolePermissionArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootRolePermissionsArgs = {
  distinct_on?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};

export type SubscriptionRootRolePermissionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};

export type SubscriptionRootRolePermissionsStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<RolePermissionsStreamCursorInput>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};

export type SubscriptionRootRolesArgs = {
  distinct_on?: InputMaybe<Array<RolesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<RolesOrderBy>>;
  where?: InputMaybe<RolesBoolExp>;
};

export type SubscriptionRootRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<RolesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<RolesOrderBy>>;
  where?: InputMaybe<RolesBoolExp>;
};

export type SubscriptionRootRolesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<RolesStreamCursorInput>>;
  where?: InputMaybe<RolesBoolExp>;
};

export type SubscriptionRootUserArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootUserRoleArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootUserRolesArgs = {
  distinct_on?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};

export type SubscriptionRootUserRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};

export type SubscriptionRootUserRolesStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<UserRolesStreamCursorInput>>;
  where?: InputMaybe<UserRolesBoolExp>;
};

export type SubscriptionRootUsersArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};

export type SubscriptionRootUsersAggregateArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};

export type SubscriptionRootUsersRoleBackupArgs = {
  distinct_on?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};

export type SubscriptionRootUsersRoleBackupAggregateArgs = {
  distinct_on?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};

export type SubscriptionRootUsersRoleBackupStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<UsersRoleBackupStreamCursorInput>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};

export type SubscriptionRootUsersStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<UsersStreamCursorInput>>;
  where?: InputMaybe<UsersBoolExp>;
};

export type SubscriptionRootWorkScheduleArgs = {
  id: Scalars["uuid"]["input"];
};

export type SubscriptionRootWorkSchedulesArgs = {
  distinct_on?: InputMaybe<Array<WorkScheduleSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<WorkScheduleOrderBy>>;
  where?: InputMaybe<WorkScheduleBoolExp>;
};

export type SubscriptionRootWorkSchedulesAggregateArgs = {
  distinct_on?: InputMaybe<Array<WorkScheduleSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<WorkScheduleOrderBy>>;
  where?: InputMaybe<WorkScheduleBoolExp>;
};

export type SubscriptionRootWorkScheduleStreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<WorkScheduleStreamCursorInput>>;
  where?: InputMaybe<WorkScheduleBoolExp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type TimestampComparisonExp = {
  _eq?: InputMaybe<Scalars["timestamp"]["input"]>;
  _gt?: InputMaybe<Scalars["timestamp"]["input"]>;
  _gte?: InputMaybe<Scalars["timestamp"]["input"]>;
  _in?: InputMaybe<Array<Scalars["timestamp"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["timestamp"]["input"]>;
  _lte?: InputMaybe<Scalars["timestamp"]["input"]>;
  _neq?: InputMaybe<Scalars["timestamp"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["timestamp"]["input"]>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type TimestamptzComparisonExp = {
  _eq?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _gt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _gte?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _in?: InputMaybe<Array<Scalars["timestamptz"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _lte?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _neq?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["timestamptz"]["input"]>>;
};

/** Boolean expression to compare columns of type "user_role". All fields are combined with logical 'AND'. */
export type UserRoleComparisonExp = {
  _eq?: InputMaybe<Scalars["user_role"]["input"]>;
  _gt?: InputMaybe<Scalars["user_role"]["input"]>;
  _gte?: InputMaybe<Scalars["user_role"]["input"]>;
  _in?: InputMaybe<Array<Scalars["user_role"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["user_role"]["input"]>;
  _lte?: InputMaybe<Scalars["user_role"]["input"]>;
  _neq?: InputMaybe<Scalars["user_role"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["user_role"]["input"]>>;
};

/** columns and relationships of "user_roles" */
export type UserRoles = {
  __typename: "user_roles";
  createdAt: Scalars["timestamptz"]["output"];
  id: Scalars["uuid"]["output"];
  /** An object relationship */
  role: Roles;
  roleId: Scalars["uuid"]["output"];
  updatedAt: Scalars["timestamptz"]["output"];
  /** An object relationship */
  user: Users;
  userId: Scalars["uuid"]["output"];
};

/** aggregated selection of "user_roles" */
export type UserRolesAggregate = {
  __typename: "user_roles_aggregate";
  aggregate: Maybe<UserRolesAggregateFields>;
  nodes: Array<UserRoles>;
};

export type UserRolesAggregateBoolExp = {
  count?: InputMaybe<UserRolesAggregateBoolExpCount>;
};

export type UserRolesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<UserRolesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<UserRolesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "user_roles" */
export type UserRolesAggregateFields = {
  __typename: "user_roles_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<UserRolesMaxFields>;
  min: Maybe<UserRolesMinFields>;
};

/** aggregate fields of "user_roles" */
export type UserRolesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<UserRolesSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  role?: InputMaybe<RolesBoolExp>;
  roleId?: InputMaybe<UuidComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "user_roles" */
export enum UserRolesConstraint {
  /** unique or primary key constraint on columns "id" */
  user_roles_pkey = "user_roles_pkey",
  /** unique or primary key constraint on columns "user_id", "role_id" */
  user_roles_user_id_role_id_key = "user_roles_user_id_role_id_key",
}

/** input type for inserting data into table "user_roles" */
export type UserRolesInsertInput = {
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<RolesObjRelInsertInput>;
  roleId?: InputMaybe<Scalars["uuid"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type UserRolesMaxFields = {
  __typename: "user_roles_max_fields";
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  roleId: Maybe<Scalars["uuid"]["output"]>;
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
  userId: Maybe<Scalars["uuid"]["output"]>;
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
  __typename: "user_roles_min_fields";
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  roleId: Maybe<Scalars["uuid"]["output"]>;
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
  userId: Maybe<Scalars["uuid"]["output"]>;
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
  __typename: "user_roles_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  role?: InputMaybe<RolesOrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: user_roles */
export type UserRolesPkColumnsInput = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "user_roles" */
export enum UserRolesSelectColumn {
  /** column name */
  createdAt = "createdAt",
  /** column name */
  id = "id",
  /** column name */
  roleId = "roleId",
  /** column name */
  updatedAt = "updatedAt",
  /** column name */
  userId = "userId",
}

/** input type for updating data in table "user_roles" */
export type UserRolesSetInput = {
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  roleId?: InputMaybe<Scalars["uuid"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
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
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  roleId?: InputMaybe<Scalars["uuid"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "user_roles" */
export enum UserRolesUpdateColumn {
  /** column name */
  createdAt = "createdAt",
  /** column name */
  id = "id",
  /** column name */
  roleId = "roleId",
  /** column name */
  updatedAt = "updatedAt",
  /** column name */
  userId = "userId",
}

export type UserRolesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UserRolesSetInput>;
  /** filter the rows which have to be updated */
  where: UserRolesBoolExp;
};

/** columns and relationships of "users" */
export type Users = {
  __typename: "users";
  /** An array relationship */
  billingEventLogs: Array<BillingEventLog>;
  /** An aggregate relationship */
  billingEventLogs_aggregate: BillingEventLogAggregate;
  /** External identifier from Clerk authentication service */
  clerkUserId: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the user was created */
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  deactivatedAt: Maybe<Scalars["timestamptz"]["output"]>;
  deactivatedBy: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  directReports: Array<Users>;
  /** An aggregate relationship */
  directReports_aggregate: UsersAggregate;
  /** User's email address (unique) */
  email: Scalars["String"]["output"];
  /** Unique identifier for the user */
  id: Scalars["uuid"]["output"];
  /** URL to the user's profile image */
  image: Maybe<Scalars["String"]["output"]>;
  isActive: Maybe<Scalars["Boolean"]["output"]>;
  /** Whether the user is a staff member (vs. external user) */
  isStaff: Maybe<Scalars["Boolean"]["output"]>;
  /** An array relationship */
  leaves: Array<Leave>;
  /** An aggregate relationship */
  leaves_aggregate: LeaveAggregate;
  /** An object relationship */
  manager: Maybe<Users>;
  /** Reference to the user's manager */
  managerId: Maybe<Scalars["uuid"]["output"]>;
  /** User's full name */
  name: Scalars["String"]["output"];
  /** An array relationship */
  notesWritten: Array<Notes>;
  /** An aggregate relationship */
  notesWritten_aggregate: NotesAggregate;
  /** An array relationship */
  payrollAssignmentAuditsAsFromConsultant: Array<PayrollAssignmentAudit>;
  /** An aggregate relationship */
  payrollAssignmentAuditsAsFromConsultant_aggregate: PayrollAssignmentAuditAggregate;
  /** An array relationship */
  payrollAssignmentAuditsAsToConsultant: Array<PayrollAssignmentAudit>;
  /** An aggregate relationship */
  payrollAssignmentAuditsAsToConsultant_aggregate: PayrollAssignmentAuditAggregate;
  /** An array relationship */
  payrollAssignmentAuditsCreated: Array<PayrollAssignmentAudit>;
  /** An aggregate relationship */
  payrollAssignmentAuditsCreated_aggregate: PayrollAssignmentAuditAggregate;
  /** An array relationship */
  payrollAssignmentsAsConsultant: Array<PayrollAssignments>;
  /** An aggregate relationship */
  payrollAssignmentsAsConsultant_aggregate: PayrollAssignmentsAggregate;
  /** An array relationship */
  payrollAssignmentsAsOriginalConsultant: Array<PayrollAssignments>;
  /** An aggregate relationship */
  payrollAssignmentsAsOriginalConsultant_aggregate: PayrollAssignmentsAggregate;
  /** An array relationship */
  payrollAssignmentsCreated: Array<PayrollAssignments>;
  /** An aggregate relationship */
  payrollAssignmentsCreated_aggregate: PayrollAssignmentsAggregate;
  /** An array relationship */
  payrollsAsBackupConsultant: Array<Payrolls>;
  /** An aggregate relationship */
  payrollsAsBackupConsultant_aggregate: PayrollsAggregate;
  /** An array relationship */
  payrollsAsManager: Array<Payrolls>;
  /** An aggregate relationship */
  payrollsAsManager_aggregate: PayrollsAggregate;
  /** An array relationship */
  payrollsAsPrimaryConsultant: Array<Payrolls>;
  /** An aggregate relationship */
  payrollsAsPrimaryConsultant_aggregate: PayrollsAggregate;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role: Scalars["user_role"]["output"];
  /** An array relationship */
  teamMembers: Array<Users>;
  /** An aggregate relationship */
  teamMembers_aggregate: UsersAggregate;
  /** Timestamp when the user was last updated */
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
  /** An array relationship */
  userRoles: Array<UserRoles>;
  /** An aggregate relationship */
  userRoles_aggregate: UserRolesAggregate;
  /** User's unique username for login */
  username: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  workSchedules: Array<WorkSchedule>;
  /** An aggregate relationship */
  workSchedules_aggregate: WorkScheduleAggregate;
};

/** columns and relationships of "users" */
export type UsersBillingEventLogsArgs = {
  distinct_on?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingEventLogOrderBy>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};

/** columns and relationships of "users" */
export type UsersBillingEventLogsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<BillingEventLogOrderBy>>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};

/** columns and relationships of "users" */
export type UsersDirectReportsArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};

/** columns and relationships of "users" */
export type UsersDirectReportsAggregateArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};

/** columns and relationships of "users" */
export type UsersLeavesArgs = {
  distinct_on?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};

/** columns and relationships of "users" */
export type UsersLeavesAggregateArgs = {
  distinct_on?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};

/** columns and relationships of "users" */
export type UsersNotesWrittenArgs = {
  distinct_on?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};

/** columns and relationships of "users" */
export type UsersNotesWrittenAggregateArgs = {
  distinct_on?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollAssignmentAuditsAsFromConsultantArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollAssignmentAuditsAsFromConsultantAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollAssignmentAuditsAsToConsultantArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollAssignmentAuditsAsToConsultantAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollAssignmentAuditsCreatedArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollAssignmentAuditsCreatedAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentAuditOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollAssignmentsAsConsultantArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollAssignmentsAsConsultantAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollAssignmentsAsOriginalConsultantArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollAssignmentsAsOriginalConsultantAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollAssignmentsCreatedArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollAssignmentsCreatedAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollsAsBackupConsultantArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollsAsBackupConsultantAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollsAsManagerArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollsAsManagerAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollsAsPrimaryConsultantArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** columns and relationships of "users" */
export type UsersPayrollsAsPrimaryConsultantAggregateArgs = {
  distinct_on?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};

/** columns and relationships of "users" */
export type UsersTeamMembersArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};

/** columns and relationships of "users" */
export type UsersTeamMembersAggregateArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};

/** columns and relationships of "users" */
export type UsersUserRolesArgs = {
  distinct_on?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};

/** columns and relationships of "users" */
export type UsersUserRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};

/** columns and relationships of "users" */
export type UsersWorkSchedulesArgs = {
  distinct_on?: InputMaybe<Array<WorkScheduleSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<WorkScheduleOrderBy>>;
  where?: InputMaybe<WorkScheduleBoolExp>;
};

/** columns and relationships of "users" */
export type UsersWorkSchedulesAggregateArgs = {
  distinct_on?: InputMaybe<Array<WorkScheduleSelectColumn>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<WorkScheduleOrderBy>>;
  where?: InputMaybe<WorkScheduleBoolExp>;
};

/** aggregated selection of "users" */
export type UsersAggregate = {
  __typename: "users_aggregate";
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<UsersBoolExp>;
  predicate: BooleanComparisonExp;
};

export type UsersAggregateBoolExpBoolOr = {
  arguments: UsersSelectColumnUsersAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<UsersBoolExp>;
  predicate: BooleanComparisonExp;
};

export type UsersAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<UsersSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<UsersBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "users" */
export type UsersAggregateFields = {
  __typename: "users_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<UsersMaxFields>;
  min: Maybe<UsersMinFields>;
};

/** aggregate fields of "users" */
export type UsersAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<UsersSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  billingEventLogs?: InputMaybe<BillingEventLogBoolExp>;
  billingEventLogs_aggregate?: InputMaybe<BillingEventLogAggregateBoolExp>;
  clerkUserId?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  deactivatedAt?: InputMaybe<TimestamptzComparisonExp>;
  deactivatedBy?: InputMaybe<StringComparisonExp>;
  directReports?: InputMaybe<UsersBoolExp>;
  directReports_aggregate?: InputMaybe<UsersAggregateBoolExp>;
  email?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  image?: InputMaybe<StringComparisonExp>;
  isActive?: InputMaybe<BooleanComparisonExp>;
  isStaff?: InputMaybe<BooleanComparisonExp>;
  leaves?: InputMaybe<LeaveBoolExp>;
  leaves_aggregate?: InputMaybe<LeaveAggregateBoolExp>;
  manager?: InputMaybe<UsersBoolExp>;
  managerId?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  notesWritten?: InputMaybe<NotesBoolExp>;
  notesWritten_aggregate?: InputMaybe<NotesAggregateBoolExp>;
  payrollAssignmentAuditsAsFromConsultant?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  payrollAssignmentAuditsAsFromConsultant_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateBoolExp>;
  payrollAssignmentAuditsAsToConsultant?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  payrollAssignmentAuditsAsToConsultant_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateBoolExp>;
  payrollAssignmentAuditsCreated?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  payrollAssignmentAuditsCreated_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateBoolExp>;
  payrollAssignmentsAsConsultant?: InputMaybe<PayrollAssignmentsBoolExp>;
  payrollAssignmentsAsConsultant_aggregate?: InputMaybe<PayrollAssignmentsAggregateBoolExp>;
  payrollAssignmentsAsOriginalConsultant?: InputMaybe<PayrollAssignmentsBoolExp>;
  payrollAssignmentsAsOriginalConsultant_aggregate?: InputMaybe<PayrollAssignmentsAggregateBoolExp>;
  payrollAssignmentsCreated?: InputMaybe<PayrollAssignmentsBoolExp>;
  payrollAssignmentsCreated_aggregate?: InputMaybe<PayrollAssignmentsAggregateBoolExp>;
  payrollsAsBackupConsultant?: InputMaybe<PayrollsBoolExp>;
  payrollsAsBackupConsultant_aggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  payrollsAsManager?: InputMaybe<PayrollsBoolExp>;
  payrollsAsManager_aggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  payrollsAsPrimaryConsultant?: InputMaybe<PayrollsBoolExp>;
  payrollsAsPrimaryConsultant_aggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  role?: InputMaybe<UserRoleComparisonExp>;
  teamMembers?: InputMaybe<UsersBoolExp>;
  teamMembers_aggregate?: InputMaybe<UsersAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  userRoles?: InputMaybe<UserRolesBoolExp>;
  userRoles_aggregate?: InputMaybe<UserRolesAggregateBoolExp>;
  username?: InputMaybe<StringComparisonExp>;
  workSchedules?: InputMaybe<WorkScheduleBoolExp>;
  workSchedules_aggregate?: InputMaybe<WorkScheduleAggregateBoolExp>;
};

/** unique or primary key constraints on table "users" */
export enum UsersConstraint {
  /** unique or primary key constraint on columns "clerk_user_id" */
  users_clerk_user_id_key = "users_clerk_user_id_key",
  /** unique or primary key constraint on columns "email" */
  users_email_key = "users_email_key",
  /** unique or primary key constraint on columns "id" */
  users_pkey = "users_pkey",
  /** unique or primary key constraint on columns "username" */
  users_username_key = "users_username_key",
}

/** input type for inserting data into table "users" */
export type UsersInsertInput = {
  billingEventLogs?: InputMaybe<BillingEventLogArrRelInsertInput>;
  /** External identifier from Clerk authentication service */
  clerkUserId?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the user was created */
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  deactivatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  deactivatedBy?: InputMaybe<Scalars["String"]["input"]>;
  directReports?: InputMaybe<UsersArrRelInsertInput>;
  /** User's email address (unique) */
  email?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the user */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** URL to the user's profile image */
  image?: InputMaybe<Scalars["String"]["input"]>;
  isActive?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether the user is a staff member (vs. external user) */
  isStaff?: InputMaybe<Scalars["Boolean"]["input"]>;
  leaves?: InputMaybe<LeaveArrRelInsertInput>;
  manager?: InputMaybe<UsersObjRelInsertInput>;
  /** Reference to the user's manager */
  managerId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** User's full name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  notesWritten?: InputMaybe<NotesArrRelInsertInput>;
  payrollAssignmentAuditsAsFromConsultant?: InputMaybe<PayrollAssignmentAuditArrRelInsertInput>;
  payrollAssignmentAuditsAsToConsultant?: InputMaybe<PayrollAssignmentAuditArrRelInsertInput>;
  payrollAssignmentAuditsCreated?: InputMaybe<PayrollAssignmentAuditArrRelInsertInput>;
  payrollAssignmentsAsConsultant?: InputMaybe<PayrollAssignmentsArrRelInsertInput>;
  payrollAssignmentsAsOriginalConsultant?: InputMaybe<PayrollAssignmentsArrRelInsertInput>;
  payrollAssignmentsCreated?: InputMaybe<PayrollAssignmentsArrRelInsertInput>;
  payrollsAsBackupConsultant?: InputMaybe<PayrollsArrRelInsertInput>;
  payrollsAsManager?: InputMaybe<PayrollsArrRelInsertInput>;
  payrollsAsPrimaryConsultant?: InputMaybe<PayrollsArrRelInsertInput>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Scalars["user_role"]["input"]>;
  teamMembers?: InputMaybe<UsersArrRelInsertInput>;
  /** Timestamp when the user was last updated */
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  userRoles?: InputMaybe<UserRolesArrRelInsertInput>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars["String"]["input"]>;
  workSchedules?: InputMaybe<WorkScheduleArrRelInsertInput>;
};

/** aggregate max on columns */
export type UsersMaxFields = {
  __typename: "users_max_fields";
  /** External identifier from Clerk authentication service */
  clerkUserId: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the user was created */
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  deactivatedAt: Maybe<Scalars["timestamptz"]["output"]>;
  deactivatedBy: Maybe<Scalars["String"]["output"]>;
  /** User's email address (unique) */
  email: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the user */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** URL to the user's profile image */
  image: Maybe<Scalars["String"]["output"]>;
  /** Reference to the user's manager */
  managerId: Maybe<Scalars["uuid"]["output"]>;
  /** User's full name */
  name: Maybe<Scalars["String"]["output"]>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role: Maybe<Scalars["user_role"]["output"]>;
  /** Timestamp when the user was last updated */
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
  /** User's unique username for login */
  username: Maybe<Scalars["String"]["output"]>;
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
  __typename: "users_min_fields";
  /** External identifier from Clerk authentication service */
  clerkUserId: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the user was created */
  createdAt: Maybe<Scalars["timestamptz"]["output"]>;
  deactivatedAt: Maybe<Scalars["timestamptz"]["output"]>;
  deactivatedBy: Maybe<Scalars["String"]["output"]>;
  /** User's email address (unique) */
  email: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the user */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** URL to the user's profile image */
  image: Maybe<Scalars["String"]["output"]>;
  /** Reference to the user's manager */
  managerId: Maybe<Scalars["uuid"]["output"]>;
  /** User's full name */
  name: Maybe<Scalars["String"]["output"]>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role: Maybe<Scalars["user_role"]["output"]>;
  /** Timestamp when the user was last updated */
  updatedAt: Maybe<Scalars["timestamptz"]["output"]>;
  /** User's unique username for login */
  username: Maybe<Scalars["String"]["output"]>;
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
  __typename: "users_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  billingEventLogs_aggregate?: InputMaybe<BillingEventLogAggregateOrderBy>;
  clerkUserId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deactivatedAt?: InputMaybe<OrderBy>;
  deactivatedBy?: InputMaybe<OrderBy>;
  directReports_aggregate?: InputMaybe<UsersAggregateOrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  image?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  isStaff?: InputMaybe<OrderBy>;
  leaves_aggregate?: InputMaybe<LeaveAggregateOrderBy>;
  manager?: InputMaybe<UsersOrderBy>;
  managerId?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  notesWritten_aggregate?: InputMaybe<NotesAggregateOrderBy>;
  payrollAssignmentAuditsAsFromConsultant_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateOrderBy>;
  payrollAssignmentAuditsAsToConsultant_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateOrderBy>;
  payrollAssignmentAuditsCreated_aggregate?: InputMaybe<PayrollAssignmentAuditAggregateOrderBy>;
  payrollAssignmentsAsConsultant_aggregate?: InputMaybe<PayrollAssignmentsAggregateOrderBy>;
  payrollAssignmentsAsOriginalConsultant_aggregate?: InputMaybe<PayrollAssignmentsAggregateOrderBy>;
  payrollAssignmentsCreated_aggregate?: InputMaybe<PayrollAssignmentsAggregateOrderBy>;
  payrollsAsBackupConsultant_aggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  payrollsAsManager_aggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  payrollsAsPrimaryConsultant_aggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  role?: InputMaybe<OrderBy>;
  teamMembers_aggregate?: InputMaybe<UsersAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userRoles_aggregate?: InputMaybe<UserRolesAggregateOrderBy>;
  username?: InputMaybe<OrderBy>;
  workSchedules_aggregate?: InputMaybe<WorkScheduleAggregateOrderBy>;
};

/** primary key columns input for table: users */
export type UsersPkColumnsInput = {
  /** Unique identifier for the user */
  id: Scalars["uuid"]["input"];
};

/** columns and relationships of "users_role_backup" */
export type UsersRoleBackup = {
  __typename: "users_role_backup";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  email: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  role: Maybe<Scalars["user_role"]["output"]>;
};

/** aggregated selection of "users_role_backup" */
export type UsersRoleBackupAggregate = {
  __typename: "users_role_backup_aggregate";
  aggregate: Maybe<UsersRoleBackupAggregateFields>;
  nodes: Array<UsersRoleBackup>;
};

/** aggregate fields of "users_role_backup" */
export type UsersRoleBackupAggregateFields = {
  __typename: "users_role_backup_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<UsersRoleBackupMaxFields>;
  min: Maybe<UsersRoleBackupMinFields>;
};

/** aggregate fields of "users_role_backup" */
export type UsersRoleBackupAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<Scalars["user_role"]["input"]>;
};

/** aggregate max on columns */
export type UsersRoleBackupMaxFields = {
  __typename: "users_role_backup_max_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  email: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  role: Maybe<Scalars["user_role"]["output"]>;
};

/** aggregate min on columns */
export type UsersRoleBackupMinFields = {
  __typename: "users_role_backup_min_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  email: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  role: Maybe<Scalars["user_role"]["output"]>;
};

/** response of any mutation on the table "users_role_backup" */
export type UsersRoleBackupMutationResponse = {
  __typename: "users_role_backup_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  created_at = "created_at",
  /** column name */
  email = "email",
  /** column name */
  id = "id",
  /** column name */
  role = "role",
}

/** input type for updating data in table "users_role_backup" */
export type UsersRoleBackupSetInput = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<Scalars["user_role"]["input"]>;
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
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<Scalars["user_role"]["input"]>;
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
  clerkUserId = "clerkUserId",
  /** column name */
  createdAt = "createdAt",
  /** column name */
  deactivatedAt = "deactivatedAt",
  /** column name */
  deactivatedBy = "deactivatedBy",
  /** column name */
  email = "email",
  /** column name */
  id = "id",
  /** column name */
  image = "image",
  /** column name */
  isActive = "isActive",
  /** column name */
  isStaff = "isStaff",
  /** column name */
  managerId = "managerId",
  /** column name */
  name = "name",
  /** column name */
  role = "role",
  /** column name */
  updatedAt = "updatedAt",
  /** column name */
  username = "username",
}

/** select "users_aggregate_bool_exp_bool_and_arguments_columns" columns of table "users" */
export enum UsersSelectColumnUsersAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  isActive = "isActive",
  /** column name */
  isStaff = "isStaff",
}

/** select "users_aggregate_bool_exp_bool_or_arguments_columns" columns of table "users" */
export enum UsersSelectColumnUsersAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  isActive = "isActive",
  /** column name */
  isStaff = "isStaff",
}

/** input type for updating data in table "users" */
export type UsersSetInput = {
  /** External identifier from Clerk authentication service */
  clerkUserId?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the user was created */
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  deactivatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  deactivatedBy?: InputMaybe<Scalars["String"]["input"]>;
  /** User's email address (unique) */
  email?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the user */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** URL to the user's profile image */
  image?: InputMaybe<Scalars["String"]["input"]>;
  isActive?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether the user is a staff member (vs. external user) */
  isStaff?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Reference to the user's manager */
  managerId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** User's full name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Scalars["user_role"]["input"]>;
  /** Timestamp when the user was last updated */
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars["String"]["input"]>;
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
  clerkUserId?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the user was created */
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  deactivatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  deactivatedBy?: InputMaybe<Scalars["String"]["input"]>;
  /** User's email address (unique) */
  email?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the user */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** URL to the user's profile image */
  image?: InputMaybe<Scalars["String"]["input"]>;
  isActive?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether the user is a staff member (vs. external user) */
  isStaff?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Reference to the user's manager */
  managerId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** User's full name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Scalars["user_role"]["input"]>;
  /** Timestamp when the user was last updated */
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "users" */
export enum UsersUpdateColumn {
  /** column name */
  clerkUserId = "clerkUserId",
  /** column name */
  createdAt = "createdAt",
  /** column name */
  deactivatedAt = "deactivatedAt",
  /** column name */
  deactivatedBy = "deactivatedBy",
  /** column name */
  email = "email",
  /** column name */
  id = "id",
  /** column name */
  image = "image",
  /** column name */
  isActive = "isActive",
  /** column name */
  isStaff = "isStaff",
  /** column name */
  managerId = "managerId",
  /** column name */
  name = "name",
  /** column name */
  role = "role",
  /** column name */
  updatedAt = "updatedAt",
  /** column name */
  username = "username",
}

export type UsersUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UsersSetInput>;
  /** filter the rows which have to be updated */
  where: UsersBoolExp;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type UuidComparisonExp = {
  _eq?: InputMaybe<Scalars["uuid"]["input"]>;
  _gt?: InputMaybe<Scalars["uuid"]["input"]>;
  _gte?: InputMaybe<Scalars["uuid"]["input"]>;
  _in?: InputMaybe<Array<Scalars["uuid"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["uuid"]["input"]>;
  _lte?: InputMaybe<Scalars["uuid"]["input"]>;
  _neq?: InputMaybe<Scalars["uuid"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["uuid"]["input"]>>;
};

/** columns and relationships of "work_schedule" */
export type WorkSchedule = {
  __typename: "work_schedule";
  /** Timestamp when the schedule entry was created */
  createdAt: Maybe<Scalars["timestamp"]["output"]>;
  /** Unique identifier for the work schedule entry */
  id: Scalars["uuid"]["output"];
  /** Timestamp when the schedule entry was last updated */
  updatedAt: Maybe<Scalars["timestamp"]["output"]>;
  /** An object relationship */
  user: Users;
  /** Reference to the user this schedule belongs to */
  userId: Scalars["uuid"]["output"];
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay: Scalars["String"]["output"];
  /** Number of hours worked on this day */
  workHours: Scalars["numeric"]["output"];
  /** An object relationship */
  work_schedule_user: Users;
};

/** aggregated selection of "work_schedule" */
export type WorkScheduleAggregate = {
  __typename: "work_schedule_aggregate";
  aggregate: Maybe<WorkScheduleAggregateFields>;
  nodes: Array<WorkSchedule>;
};

export type WorkScheduleAggregateBoolExp = {
  count?: InputMaybe<WorkScheduleAggregateBoolExpCount>;
};

export type WorkScheduleAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<WorkScheduleSelectColumn>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<WorkScheduleBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "work_schedule" */
export type WorkScheduleAggregateFields = {
  __typename: "work_schedule_aggregate_fields";
  avg: Maybe<WorkScheduleAvgFields>;
  count: Scalars["Int"]["output"];
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
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  __typename: "work_schedule_avg_fields";
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "work_schedule" */
export type WorkScheduleAvgOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "work_schedule". All fields are combined with a logical 'AND'. */
export type WorkScheduleBoolExp = {
  _and?: InputMaybe<Array<WorkScheduleBoolExp>>;
  _not?: InputMaybe<WorkScheduleBoolExp>;
  _or?: InputMaybe<Array<WorkScheduleBoolExp>>;
  createdAt?: InputMaybe<TimestampComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  updatedAt?: InputMaybe<TimestampComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
  workDay?: InputMaybe<StringComparisonExp>;
  workHours?: InputMaybe<NumericComparisonExp>;
  work_schedule_user?: InputMaybe<UsersBoolExp>;
};

/** unique or primary key constraints on table "work_schedule" */
export enum WorkScheduleConstraint {
  /** unique or primary key constraint on columns "user_id", "work_day" */
  unique_user_work_day = "unique_user_work_day",
  /** unique or primary key constraint on columns "id" */
  work_schedule_pkey = "work_schedule_pkey",
}

/** input type for incrementing numeric columns in table "work_schedule" */
export type WorkScheduleIncInput = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** input type for inserting data into table "work_schedule" */
export type WorkScheduleInsertInput = {
  /** Timestamp when the schedule entry was created */
  createdAt?: InputMaybe<Scalars["timestamp"]["input"]>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: InputMaybe<Scalars["timestamp"]["input"]>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  /** Reference to the user this schedule belongs to */
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay?: InputMaybe<Scalars["String"]["input"]>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<Scalars["numeric"]["input"]>;
  work_schedule_user?: InputMaybe<UsersObjRelInsertInput>;
};

/** aggregate max on columns */
export type WorkScheduleMaxFields = {
  __typename: "work_schedule_max_fields";
  /** Timestamp when the schedule entry was created */
  createdAt: Maybe<Scalars["timestamp"]["output"]>;
  /** Unique identifier for the work schedule entry */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt: Maybe<Scalars["timestamp"]["output"]>;
  /** Reference to the user this schedule belongs to */
  userId: Maybe<Scalars["uuid"]["output"]>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay: Maybe<Scalars["String"]["output"]>;
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars["numeric"]["output"]>;
};

/** order by max() on columns of table "work_schedule" */
export type WorkScheduleMaxOrderBy = {
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
export type WorkScheduleMinFields = {
  __typename: "work_schedule_min_fields";
  /** Timestamp when the schedule entry was created */
  createdAt: Maybe<Scalars["timestamp"]["output"]>;
  /** Unique identifier for the work schedule entry */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt: Maybe<Scalars["timestamp"]["output"]>;
  /** Reference to the user this schedule belongs to */
  userId: Maybe<Scalars["uuid"]["output"]>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay: Maybe<Scalars["String"]["output"]>;
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars["numeric"]["output"]>;
};

/** order by min() on columns of table "work_schedule" */
export type WorkScheduleMinOrderBy = {
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
export type WorkScheduleMutationResponse = {
  __typename: "work_schedule_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
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
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userId?: InputMaybe<OrderBy>;
  workDay?: InputMaybe<OrderBy>;
  workHours?: InputMaybe<OrderBy>;
  work_schedule_user?: InputMaybe<UsersOrderBy>;
};

/** primary key columns input for table: work_schedule */
export type WorkSchedulePkColumnsInput = {
  /** Unique identifier for the work schedule entry */
  id: Scalars["uuid"]["input"];
};

/** select columns of table "work_schedule" */
export enum WorkScheduleSelectColumn {
  /** column name */
  createdAt = "createdAt",
  /** column name */
  id = "id",
  /** column name */
  updatedAt = "updatedAt",
  /** column name */
  userId = "userId",
  /** column name */
  workDay = "workDay",
  /** column name */
  workHours = "workHours",
}

/** input type for updating data in table "work_schedule" */
export type WorkScheduleSetInput = {
  /** Timestamp when the schedule entry was created */
  createdAt?: InputMaybe<Scalars["timestamp"]["input"]>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: InputMaybe<Scalars["timestamp"]["input"]>;
  /** Reference to the user this schedule belongs to */
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay?: InputMaybe<Scalars["String"]["input"]>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** aggregate stddev on columns */
export type WorkScheduleStddevFields = {
  __typename: "work_schedule_stddev_fields";
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "work_schedule" */
export type WorkScheduleStddevOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type WorkScheduleStddevPopFields = {
  __typename: "work_schedule_stddev_pop_fields";
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "work_schedule" */
export type WorkScheduleStddevPopOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type WorkScheduleStddevSampFields = {
  __typename: "work_schedule_stddev_samp_fields";
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "work_schedule" */
export type WorkScheduleStddevSampOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
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
  createdAt?: InputMaybe<Scalars["timestamp"]["input"]>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: InputMaybe<Scalars["timestamp"]["input"]>;
  /** Reference to the user this schedule belongs to */
  userId?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay?: InputMaybe<Scalars["String"]["input"]>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** aggregate sum on columns */
export type WorkScheduleSumFields = {
  __typename: "work_schedule_sum_fields";
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars["numeric"]["output"]>;
};

/** order by sum() on columns of table "work_schedule" */
export type WorkScheduleSumOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** update columns of table "work_schedule" */
export enum WorkScheduleUpdateColumn {
  /** column name */
  createdAt = "createdAt",
  /** column name */
  id = "id",
  /** column name */
  updatedAt = "updatedAt",
  /** column name */
  userId = "userId",
  /** column name */
  workDay = "workDay",
  /** column name */
  workHours = "workHours",
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
  __typename: "work_schedule_var_pop_fields";
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "work_schedule" */
export type WorkScheduleVarPopOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type WorkScheduleVarSampFields = {
  __typename: "work_schedule_var_samp_fields";
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "work_schedule" */
export type WorkScheduleVarSampOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type WorkScheduleVarianceFields = {
  __typename: "work_schedule_variance_fields";
  /** Number of hours worked on this day */
  workHours: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "work_schedule" */
export type WorkScheduleVarianceOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

export type PayrollBasicInfoFragment = {
  __typename: "payrolls";
  id: string;
  name: string;
  clientId: string;
  cycleId: string;
  dateTypeId: string;
  primaryConsultantUserId: string | null;
  backupConsultantUserId: string | null;
  managerUserId: string | null;
  employeeCount: number | null;
  goLiveDate: string | null;
} & { " $fragmentName"?: "PayrollBasicInfoFragment" };

export type PayrollFullDetailsFragment = {
  __typename: "payrolls";
  id: string;
  name: string;
  employeeCount: number | null;
  processingTime: number;
  processingDaysBeforeEft: number;
  payrollSystem: string | null;
  dateValue: number | null;
  versionNumber: number | null;
  parentPayrollId: string | null;
  goLiveDate: string | null;
  supersededDate: string | null;
  versionReason: string | null;
  createdByUserId: string | null;
} & { " $fragmentName"?: "PayrollFullDetailsFragment" };

export type PayrollWithRelationsFragment = ({
  __typename: "payrolls";
  client: { __typename: "clients"; id: string; name: string };
  payrollCycle: { __typename: "payroll_cycles"; id: string; name: string };
  payrollDateType: {
    __typename: "payroll_date_types";
    id: string;
    name: string;
  };
  primaryConsultant: {
    __typename: "users";
    id: string;
    name: string;
    email: string;
  } | null;
  backupConsultant: {
    __typename: "users";
    id: string;
    name: string;
    email: string;
  } | null;
  manager: {
    __typename: "users";
    id: string;
    name: string;
    email: string;
  } | null;
} & {
  " $fragmentRefs"?: { PayrollFullDetailsFragment: PayrollFullDetailsFragment };
}) & { " $fragmentName"?: "PayrollWithRelationsFragment" };

export type PayrollWithClientFragment = ({
  __typename: "payrolls";
  client: { __typename: "clients"; id: string; name: string };
} & {
  " $fragmentRefs"?: { PayrollBasicInfoFragment: PayrollBasicInfoFragment };
}) & { " $fragmentName"?: "PayrollWithClientFragment" };

export type PayrollDateFragment = {
  __typename: "payroll_dates";
  id: string;
  payrollId: string;
  originalEftDate: string;
  adjustedEftDate: string;
  processingDate: string;
} & { " $fragmentName"?: "PayrollDateFragment" };

export type PayrollWithDatesFragment = ({
  __typename: "payrolls";
  payrollDates: Array<
    { __typename: "payroll_dates" } & {
      " $fragmentRefs"?: { PayrollDateFragment: PayrollDateFragment };
    }
  >;
} & {
  " $fragmentRefs"?: {
    PayrollWithRelationsFragment: PayrollWithRelationsFragment;
  };
}) & { " $fragmentName"?: "PayrollWithDatesFragment" };

export type CreatePayrollMutationVariables = Exact<{
  object: PayrollsInsertInput;
}>;

export type CreatePayrollMutation = {
  __typename: "mutation_root";
  insertPayroll: {
    __typename: "payrolls";
    id: string;
    name: string;
    clientId: string;
    cycleId: string;
    dateTypeId: string;
    primaryConsultantUserId: string | null;
    employeeCount: number | null;
  } | null;
};

export type UpdatePayrollMutationVariables = Exact<{
  id: Scalars["uuid"]["input"];
  set: PayrollsSetInput;
}>;

export type UpdatePayrollMutation = {
  __typename: "mutation_root";
  updatePayroll: {
    __typename: "payrolls";
    id: string;
    name: string;
    clientId: string;
    cycleId: string;
    dateTypeId: string;
    primaryConsultantUserId: string | null;
    employeeCount: number | null;
  } | null;
};

export type DeletePayrollMutationVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type DeletePayrollMutation = {
  __typename: "mutation_root";
  deletePayroll: { __typename: "payrolls"; id: string; name: string } | null;
};

export type UpdatePayrollStatusMutationVariables = Exact<{
  id: Scalars["uuid"]["input"];
  status: Scalars["payroll_status"]["input"];
}>;

export type UpdatePayrollStatusMutation = {
  __typename: "mutation_root";
  updatePayroll: { __typename: "payrolls"; id: string; name: string } | null;
};

export type UpdatePayrollDateNotesMutationVariables = Exact<{
  id: Scalars["uuid"]["input"];
  notes?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type UpdatePayrollDateNotesMutation = {
  __typename: "mutation_root";
  updatePayrollDate: {
    __typename: "payroll_dates";
    id: string;
    notes: string | null;
    payrollId: string;
    originalEftDate: string;
    adjustedEftDate: string;
    processingDate: string;
  } | null;
};

export type GetPayrollsQueryVariables = Exact<{ [key: string]: never }>;

export type GetPayrollsQuery = {
  __typename: "query_root";
  payrolls: Array<{
    __typename: "payrolls";
    id: string;
    name: string;
    clientId: string;
    cycleId: string;
    dateTypeId: string;
    primaryConsultantUserId: string | null;
    backupConsultantUserId: string | null;
    managerUserId: string | null;
    employeeCount: number | null;
    goLiveDate: string | null;
    status: string;
    client: { __typename: "clients"; id: string; name: string };
    payrollCycle: { __typename: "payroll_cycles"; id: string; name: string };
    payrollDateType: {
      __typename: "payroll_date_types";
      id: string;
      name: string;
    };
    primaryConsultant: { __typename: "users"; id: string; name: string } | null;
    backupConsultant: { __typename: "users"; id: string; name: string } | null;
    manager: { __typename: "users"; id: string; name: string } | null;
    payrollDates: Array<{
      __typename: "payroll_dates";
      id: string;
      originalEftDate: string;
      adjustedEftDate: string;
      processingDate: string;
    }>;
  }>;
};

export type GetPayrollsFallbackQueryVariables = Exact<{ [key: string]: never }>;

export type GetPayrollsFallbackQuery = {
  __typename: "query_root";
  payrolls: Array<{ __typename: "payrolls"; id: string }>;
};

export type GetPayrollByIdQueryVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type GetPayrollByIdQuery = {
  __typename: "query_root";
  payroll: {
    __typename: "payrolls";
    id: string;
    clientId: string;
    cycleId: string;
    dateTypeId: string;
    primaryConsultantUserId: string | null;
    backupConsultantUserId: string | null;
    managerUserId: string | null;
    employeeCount: number | null;
    goLiveDate: string | null;
    client: { __typename: "clients"; id: string };
    payrollCycle: { __typename: "payroll_cycles"; id: string };
    payrollDateType: { __typename: "payroll_date_types"; id: string };
    payrollDates: Array<{
      __typename: "payroll_dates";
      id: string;
      originalEftDate: string;
      adjustedEftDate: string;
      processingDate: string;
    }>;
  } | null;
};

export type GetPayrollsByClientQueryVariables = Exact<{
  clientId: Scalars["uuid"]["input"];
}>;

export type GetPayrollsByClientQuery = {
  __typename: "query_root";
  payrolls: Array<{
    __typename: "payrolls";
    id: string;
    clientId: string;
    employeeCount: number | null;
    goLiveDate: string | null;
  }>;
};

export type GetPayrollsByMonthQueryVariables = Exact<{
  startDate: Scalars["date"]["input"];
  endDate: Scalars["date"]["input"];
}>;

export type GetPayrollsByMonthQuery = {
  __typename: "query_root";
  payrolls: Array<
    { __typename: "payrolls" } & {
      " $fragmentRefs"?: { PayrollWithDatesFragment: PayrollWithDatesFragment };
    }
  >;
};

export type GetPayrollDatesQueryVariables = Exact<{
  payrollId: Scalars["uuid"]["input"];
}>;

export type GetPayrollDatesQuery = {
  __typename: "query_root";
  payrollDates: Array<{
    __typename: "payroll_dates";
    id: string;
    payrollId: string;
    originalEftDate: string;
    adjustedEftDate: string;
    processingDate: string;
  }>;
};

export type GetPayrollFamilyDatesQueryVariables = Exact<{
  payrollId: Scalars["uuid"]["input"];
}>;

export type GetPayrollFamilyDatesQuery = {
  __typename: "query_root";
  payrolls: Array<{
    __typename: "payrolls";
    id: string;
    versionNumber: number | null;
    payrollDates: Array<
      { __typename: "payroll_dates" } & {
        " $fragmentRefs"?: { PayrollDateFragment: PayrollDateFragment };
      }
    >;
  }>;
};

export type GetPayrollsMissingDatesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetPayrollsMissingDatesQuery = {
  __typename: "query_root";
  payrolls: Array<{
    __typename: "payrolls";
    id: string;
    name: string;
    status: string;
    client: { __typename: "clients"; id: string; name: string };
    payrollDates_aggregate: {
      __typename: "payroll_dates_aggregate";
      aggregate: {
        __typename: "payroll_dates_aggregate_fields";
        count: number;
      } | null;
    };
  }>;
};

export type GetPayrollsSimpleQueryVariables = Exact<{ [key: string]: never }>;

export type GetPayrollsSimpleQuery = {
  __typename: "query_root";
  payrolls: Array<{
    __typename: "payrolls";
    id: string;
    client: { __typename: "clients"; id: string };
  }>;
};

export type CheckPayrollVersionQueryVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type CheckPayrollVersionQuery = {
  __typename: "query_root";
  payroll: {
    __typename: "payrolls";
    id: string;
    supersededDate: string | null;
    versionNumber: number | null;
  } | null;
  latest: Array<{ __typename: "payrolls"; id: string }>;
};

export type GetPayrollDatesByIdQueryVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type GetPayrollDatesByIdQuery = {
  __typename: "query_root";
  payrollDates: Array<{
    __typename: "payroll_dates";
    id: string;
    originalEftDate: string;
    adjustedEftDate: string;
    processingDate: string;
  }>;
};

export type GetPayrollVersionHistoryQueryVariables = Exact<{
  payrollId: Scalars["uuid"]["input"];
}>;

export type GetPayrollVersionHistoryQuery = {
  __typename: "query_root";
  payrolls: Array<{
    __typename: "payrolls";
    id: string;
    versionNumber: number | null;
    supersededDate: string | null;
    goLiveDate: string | null;
  }>;
};

export type GetLatestPayrollVersionQueryVariables = Exact<{
  payrollId: Scalars["uuid"]["input"];
}>;

export type GetLatestPayrollVersionQuery = {
  __typename: "query_root";
  payrolls: Array<{
    __typename: "payrolls";
    id: string;
    versionNumber: number | null;
    parentPayrollId: string | null;
  }>;
};

export type GeneratePayrollDatesQueryVariables = Exact<{
  payrollId: Scalars["uuid"]["input"];
  startDate?: InputMaybe<Scalars["date"]["input"]>;
  endDate?: InputMaybe<Scalars["date"]["input"]>;
  maxDates?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GeneratePayrollDatesQuery = {
  __typename: "query_root";
  generatePayrollDates: Array<{
    __typename: "payroll_dates";
    id: string;
    payrollId: string;
    originalEftDate: string;
    adjustedEftDate: string;
    processingDate: string;
    notes: string | null;
  }>;
};

export type GetUserUpcomingPayrollsQueryVariables = Exact<{
  userId: Scalars["uuid"]["input"];
  from_date: Scalars["date"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GetUserUpcomingPayrollsQuery = {
  __typename: "query_root";
  payrolls: Array<{
    __typename: "payrolls";
    id: string;
    name: string;
    status: string;
    client: { __typename: "clients"; id: string; name: string };
    payrollDates: Array<{
      __typename: "payroll_dates";
      id: string;
      adjustedEftDate: string;
      processingDate: string;
      originalEftDate: string;
    }>;
    primaryConsultant: { __typename: "users"; id: string; name: string } | null;
    backupConsultant: { __typename: "users"; id: string; name: string } | null;
    manager: { __typename: "users"; id: string; name: string } | null;
  }>;
};

export type PayrollUpdatesSubscriptionVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type PayrollUpdatesSubscription = {
  __typename: "subscription_root";
  payroll:
    | ({ __typename: "payrolls" } & {
        " $fragmentRefs"?: {
          PayrollWithDatesFragment: PayrollWithDatesFragment;
        };
      })
    | null;
};

export type PayrollListUpdatesSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type PayrollListUpdatesSubscription = {
  __typename: "subscription_root";
  payrolls: Array<
    { __typename: "payrolls" } & {
      " $fragmentRefs"?: { PayrollBasicInfoFragment: PayrollBasicInfoFragment };
    }
  >;
};

export type PayrollDateUpdatesSubscriptionVariables = Exact<{
  payrollId: Scalars["uuid"]["input"];
}>;

export type PayrollDateUpdatesSubscription = {
  __typename: "subscription_root";
  payrollDates: Array<
    { __typename: "payroll_dates" } & {
      " $fragmentRefs"?: { PayrollDateFragment: PayrollDateFragment };
    }
  >;
};

export type PayrollSubscriptionSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type PayrollSubscriptionSubscription = {
  __typename: "subscription_root";
  payrolls: Array<{
    __typename: "payrolls";
    id: string;
    name: string;
    status: string;
    updatedAt: string | null;
  }>;
};

export type TestSubscriptionSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type TestSubscriptionSubscription = {
  __typename: "subscription_root";
  payrolls: Array<{ __typename: "payrolls"; id: string; name: string }>;
};

export const PayrollBasicInfoFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollBasicInfo" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payrolls" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "clientId" } },
          { kind: "Field", name: { kind: "Name", value: "cycleId" } },
          { kind: "Field", name: { kind: "Name", value: "dateTypeId" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "primaryConsultantUserId" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "backupConsultantUserId" },
          },
          { kind: "Field", name: { kind: "Name", value: "managerUserId" } },
          { kind: "Field", name: { kind: "Name", value: "employeeCount" } },
          { kind: "Field", name: { kind: "Name", value: "goLiveDate" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PayrollBasicInfoFragment, unknown>;
export const PayrollWithClientFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollWithClient" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payrolls" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "PayrollBasicInfo" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "client" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollBasicInfo" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payrolls" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "clientId" } },
          { kind: "Field", name: { kind: "Name", value: "cycleId" } },
          { kind: "Field", name: { kind: "Name", value: "dateTypeId" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "primaryConsultantUserId" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "backupConsultantUserId" },
          },
          { kind: "Field", name: { kind: "Name", value: "managerUserId" } },
          { kind: "Field", name: { kind: "Name", value: "employeeCount" } },
          { kind: "Field", name: { kind: "Name", value: "goLiveDate" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PayrollWithClientFragment, unknown>;
export const PayrollFullDetailsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollFullDetails" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payrolls" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "employeeCount" } },
          { kind: "Field", name: { kind: "Name", value: "processingTime" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "processingDaysBeforeEft" },
          },
          { kind: "Field", name: { kind: "Name", value: "payrollSystem" } },
          { kind: "Field", name: { kind: "Name", value: "dateValue" } },
          { kind: "Field", name: { kind: "Name", value: "versionNumber" } },
          { kind: "Field", name: { kind: "Name", value: "parentPayrollId" } },
          { kind: "Field", name: { kind: "Name", value: "goLiveDate" } },
          { kind: "Field", name: { kind: "Name", value: "supersededDate" } },
          { kind: "Field", name: { kind: "Name", value: "versionReason" } },
          { kind: "Field", name: { kind: "Name", value: "createdByUserId" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PayrollFullDetailsFragment, unknown>;
export const PayrollWithRelationsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollWithRelations" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payrolls" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "PayrollFullDetails" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "client" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "payrollCycle" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "payrollDateType" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "primaryConsultant" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "backupConsultant" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "manager" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollFullDetails" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payrolls" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "employeeCount" } },
          { kind: "Field", name: { kind: "Name", value: "processingTime" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "processingDaysBeforeEft" },
          },
          { kind: "Field", name: { kind: "Name", value: "payrollSystem" } },
          { kind: "Field", name: { kind: "Name", value: "dateValue" } },
          { kind: "Field", name: { kind: "Name", value: "versionNumber" } },
          { kind: "Field", name: { kind: "Name", value: "parentPayrollId" } },
          { kind: "Field", name: { kind: "Name", value: "goLiveDate" } },
          { kind: "Field", name: { kind: "Name", value: "supersededDate" } },
          { kind: "Field", name: { kind: "Name", value: "versionReason" } },
          { kind: "Field", name: { kind: "Name", value: "createdByUserId" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PayrollWithRelationsFragment, unknown>;
export const PayrollDateFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollDate" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payroll_dates" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "payrollId" } },
          { kind: "Field", name: { kind: "Name", value: "originalEftDate" } },
          { kind: "Field", name: { kind: "Name", value: "adjustedEftDate" } },
          { kind: "Field", name: { kind: "Name", value: "processingDate" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PayrollDateFragment, unknown>;
export const PayrollWithDatesFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollWithDates" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payrolls" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "PayrollWithRelations" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "payrollDates" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "adjustedEftDate" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "PayrollDate" },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollFullDetails" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payrolls" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "employeeCount" } },
          { kind: "Field", name: { kind: "Name", value: "processingTime" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "processingDaysBeforeEft" },
          },
          { kind: "Field", name: { kind: "Name", value: "payrollSystem" } },
          { kind: "Field", name: { kind: "Name", value: "dateValue" } },
          { kind: "Field", name: { kind: "Name", value: "versionNumber" } },
          { kind: "Field", name: { kind: "Name", value: "parentPayrollId" } },
          { kind: "Field", name: { kind: "Name", value: "goLiveDate" } },
          { kind: "Field", name: { kind: "Name", value: "supersededDate" } },
          { kind: "Field", name: { kind: "Name", value: "versionReason" } },
          { kind: "Field", name: { kind: "Name", value: "createdByUserId" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollWithRelations" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payrolls" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "PayrollFullDetails" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "client" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "payrollCycle" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "payrollDateType" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "primaryConsultant" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "backupConsultant" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "manager" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollDate" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payroll_dates" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "payrollId" } },
          { kind: "Field", name: { kind: "Name", value: "originalEftDate" } },
          { kind: "Field", name: { kind: "Name", value: "adjustedEftDate" } },
          { kind: "Field", name: { kind: "Name", value: "processingDate" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PayrollWithDatesFragment, unknown>;
export const CreatePayrollDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreatePayroll" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "object" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "payrolls_insert_input" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "insertPayroll" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "object" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "object" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "clientId" } },
                { kind: "Field", name: { kind: "Name", value: "cycleId" } },
                { kind: "Field", name: { kind: "Name", value: "dateTypeId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "primaryConsultantUserId" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "employeeCount" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreatePayrollMutation,
  CreatePayrollMutationVariables
>;
export const UpdatePayrollDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdatePayroll" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "set" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "payrolls_set_input" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updatePayroll" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "id" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "set" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "clientId" } },
                { kind: "Field", name: { kind: "Name", value: "cycleId" } },
                { kind: "Field", name: { kind: "Name", value: "dateTypeId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "primaryConsultantUserId" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "employeeCount" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdatePayrollMutation,
  UpdatePayrollMutationVariables
>;
export const DeletePayrollDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeletePayroll" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deletePayroll" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeletePayrollMutation,
  DeletePayrollMutationVariables
>;
export const UpdatePayrollStatusDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdatePayrollStatus" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "status" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "payroll_status" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updatePayroll" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "id" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "status" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "status" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdatePayrollStatusMutation,
  UpdatePayrollStatusMutationVariables
>;
export const UpdatePayrollDateNotesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdatePayrollDateNotes" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "notes" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updatePayrollDate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "id" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "notes" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "notes" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
                { kind: "Field", name: { kind: "Name", value: "payrollId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "originalEftDate" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "adjustedEftDate" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "processingDate" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdatePayrollDateNotesMutation,
  UpdatePayrollDateNotesMutationVariables
>;
export const GetPayrollsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPayrolls" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payrolls" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "supersededDate" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_is_null" },
                            value: { kind: "BooleanValue", value: true },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "updatedAt" },
                      value: { kind: "EnumValue", value: "desc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "clientId" } },
                { kind: "Field", name: { kind: "Name", value: "cycleId" } },
                { kind: "Field", name: { kind: "Name", value: "dateTypeId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "primaryConsultantUserId" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "backupConsultantUserId" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "managerUserId" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "employeeCount" },
                },
                { kind: "Field", name: { kind: "Name", value: "goLiveDate" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "client" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "payrollCycle" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "payrollDateType" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "primaryConsultant" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "backupConsultant" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "manager" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "payrollDates" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "order_by" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "adjustedEftDate" },
                            value: { kind: "EnumValue", value: "asc" },
                          },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "originalEftDate" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "adjustedEftDate" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "processingDate" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPayrollsQuery, GetPayrollsQueryVariables>;
export const GetPayrollsFallbackDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPayrollsFallback" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payrolls" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetPayrollsFallbackQuery,
  GetPayrollsFallbackQueryVariables
>;
export const GetPayrollByIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPayrollById" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payroll" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "clientId" } },
                { kind: "Field", name: { kind: "Name", value: "cycleId" } },
                { kind: "Field", name: { kind: "Name", value: "dateTypeId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "primaryConsultantUserId" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "backupConsultantUserId" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "managerUserId" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "employeeCount" },
                },
                { kind: "Field", name: { kind: "Name", value: "goLiveDate" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "client" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "payrollCycle" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "payrollDateType" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "payrollDates" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "order_by" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "adjustedEftDate" },
                            value: { kind: "EnumValue", value: "asc" },
                          },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "originalEftDate" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "adjustedEftDate" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "processingDate" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPayrollByIdQuery, GetPayrollByIdQueryVariables>;
export const GetPayrollsByClientDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPayrollsByClient" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "clientId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payrolls" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "clientId" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "clientId" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "supersededDate" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_is_null" },
                            value: { kind: "BooleanValue", value: true },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "updatedAt" },
                      value: { kind: "EnumValue", value: "desc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "clientId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "employeeCount" },
                },
                { kind: "Field", name: { kind: "Name", value: "goLiveDate" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetPayrollsByClientQuery,
  GetPayrollsByClientQueryVariables
>;
export const GetPayrollsByMonthDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPayrollsByMonth" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "startDate" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "date" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "endDate" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "date" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payrolls" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "supersededDate" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_is_null" },
                            value: { kind: "BooleanValue", value: true },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "payrollDates" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "adjustedEftDate" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_gte" },
                                  value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "startDate" },
                                  },
                                },
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_lte" },
                                  value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "endDate" },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "updatedAt" },
                      value: { kind: "EnumValue", value: "desc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "PayrollWithDates" },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollFullDetails" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payrolls" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "employeeCount" } },
          { kind: "Field", name: { kind: "Name", value: "processingTime" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "processingDaysBeforeEft" },
          },
          { kind: "Field", name: { kind: "Name", value: "payrollSystem" } },
          { kind: "Field", name: { kind: "Name", value: "dateValue" } },
          { kind: "Field", name: { kind: "Name", value: "versionNumber" } },
          { kind: "Field", name: { kind: "Name", value: "parentPayrollId" } },
          { kind: "Field", name: { kind: "Name", value: "goLiveDate" } },
          { kind: "Field", name: { kind: "Name", value: "supersededDate" } },
          { kind: "Field", name: { kind: "Name", value: "versionReason" } },
          { kind: "Field", name: { kind: "Name", value: "createdByUserId" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollWithRelations" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payrolls" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "PayrollFullDetails" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "client" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "payrollCycle" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "payrollDateType" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "primaryConsultant" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "backupConsultant" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "manager" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollDate" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payroll_dates" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "payrollId" } },
          { kind: "Field", name: { kind: "Name", value: "originalEftDate" } },
          { kind: "Field", name: { kind: "Name", value: "adjustedEftDate" } },
          { kind: "Field", name: { kind: "Name", value: "processingDate" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollWithDates" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payrolls" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "PayrollWithRelations" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "payrollDates" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "adjustedEftDate" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "PayrollDate" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetPayrollsByMonthQuery,
  GetPayrollsByMonthQueryVariables
>;
export const GetPayrollDatesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPayrollDates" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "payrollId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payrollDates" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "payrollId" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "payrollId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "adjustedEftDate" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "payrollId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "originalEftDate" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "adjustedEftDate" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "processingDate" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetPayrollDatesQuery,
  GetPayrollDatesQueryVariables
>;
export const GetPayrollFamilyDatesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPayrollFamilyDates" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "payrollId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payrolls" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "_or" },
                      value: {
                        kind: "ListValue",
                        values: [
                          {
                            kind: "ObjectValue",
                            fields: [
                              {
                                kind: "ObjectField",
                                name: { kind: "Name", value: "id" },
                                value: {
                                  kind: "ObjectValue",
                                  fields: [
                                    {
                                      kind: "ObjectField",
                                      name: { kind: "Name", value: "_eq" },
                                      value: {
                                        kind: "Variable",
                                        name: {
                                          kind: "Name",
                                          value: "payrollId",
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                          {
                            kind: "ObjectValue",
                            fields: [
                              {
                                kind: "ObjectField",
                                name: {
                                  kind: "Name",
                                  value: "parentPayrollId",
                                },
                                value: {
                                  kind: "ObjectValue",
                                  fields: [
                                    {
                                      kind: "ObjectField",
                                      name: { kind: "Name", value: "_eq" },
                                      value: {
                                        kind: "Variable",
                                        name: {
                                          kind: "Name",
                                          value: "payrollId",
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "versionNumber" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "versionNumber" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "payrollDates" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "order_by" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "adjustedEftDate" },
                            value: { kind: "EnumValue", value: "asc" },
                          },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "PayrollDate" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollDate" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payroll_dates" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "payrollId" } },
          { kind: "Field", name: { kind: "Name", value: "originalEftDate" } },
          { kind: "Field", name: { kind: "Name", value: "adjustedEftDate" } },
          { kind: "Field", name: { kind: "Name", value: "processingDate" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetPayrollFamilyDatesQuery,
  GetPayrollFamilyDatesQueryVariables
>;
export const GetPayrollsMissingDatesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPayrollsMissingDates" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payrolls" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "supersededDate" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_is_null" },
                            value: { kind: "BooleanValue", value: true },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "client" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "payrollDates_aggregate" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "aggregate" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "count" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetPayrollsMissingDatesQuery,
  GetPayrollsMissingDatesQueryVariables
>;
export const GetPayrollsSimpleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPayrollsSimple" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payrolls" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "client" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetPayrollsSimpleQuery,
  GetPayrollsSimpleQueryVariables
>;
export const CheckPayrollVersionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CheckPayrollVersion" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payroll" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "supersededDate" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "versionNumber" },
                },
              ],
            },
          },
          {
            kind: "Field",
            alias: { kind: "Name", value: "latest" },
            name: { kind: "Name", value: "payrolls" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "parentPayrollId" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "id" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "supersededDate" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_is_null" },
                            value: { kind: "BooleanValue", value: true },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "IntValue", value: "1" },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CheckPayrollVersionQuery,
  CheckPayrollVersionQueryVariables
>;
export const GetPayrollDatesByIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPayrollDatesById" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payrollDates" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "payrollId" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "id" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "adjustedEftDate" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "originalEftDate" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "adjustedEftDate" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "processingDate" },
                },
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetPayrollDatesByIdQuery,
  GetPayrollDatesByIdQueryVariables
>;
export const GetPayrollVersionHistoryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPayrollVersionHistory" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "payrollId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payrolls" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "_or" },
                      value: {
                        kind: "ListValue",
                        values: [
                          {
                            kind: "ObjectValue",
                            fields: [
                              {
                                kind: "ObjectField",
                                name: { kind: "Name", value: "id" },
                                value: {
                                  kind: "ObjectValue",
                                  fields: [
                                    {
                                      kind: "ObjectField",
                                      name: { kind: "Name", value: "_eq" },
                                      value: {
                                        kind: "Variable",
                                        name: {
                                          kind: "Name",
                                          value: "payrollId",
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                          {
                            kind: "ObjectValue",
                            fields: [
                              {
                                kind: "ObjectField",
                                name: {
                                  kind: "Name",
                                  value: "parentPayrollId",
                                },
                                value: {
                                  kind: "ObjectValue",
                                  fields: [
                                    {
                                      kind: "ObjectField",
                                      name: { kind: "Name", value: "_eq" },
                                      value: {
                                        kind: "Variable",
                                        name: {
                                          kind: "Name",
                                          value: "payrollId",
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "versionNumber" },
                      value: { kind: "EnumValue", value: "desc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "versionNumber" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "supersededDate" },
                },
                { kind: "Field", name: { kind: "Name", value: "goLiveDate" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetPayrollVersionHistoryQuery,
  GetPayrollVersionHistoryQueryVariables
>;
export const GetLatestPayrollVersionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetLatestPayrollVersion" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "payrollId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payrolls" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "_or" },
                      value: {
                        kind: "ListValue",
                        values: [
                          {
                            kind: "ObjectValue",
                            fields: [
                              {
                                kind: "ObjectField",
                                name: { kind: "Name", value: "id" },
                                value: {
                                  kind: "ObjectValue",
                                  fields: [
                                    {
                                      kind: "ObjectField",
                                      name: { kind: "Name", value: "_eq" },
                                      value: {
                                        kind: "Variable",
                                        name: {
                                          kind: "Name",
                                          value: "payrollId",
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                          {
                            kind: "ObjectValue",
                            fields: [
                              {
                                kind: "ObjectField",
                                name: {
                                  kind: "Name",
                                  value: "parentPayrollId",
                                },
                                value: {
                                  kind: "ObjectValue",
                                  fields: [
                                    {
                                      kind: "ObjectField",
                                      name: { kind: "Name", value: "_eq" },
                                      value: {
                                        kind: "Variable",
                                        name: {
                                          kind: "Name",
                                          value: "payrollId",
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "supersededDate" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_is_null" },
                            value: { kind: "BooleanValue", value: true },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "IntValue", value: "1" },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "versionNumber" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "parentPayrollId" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetLatestPayrollVersionQuery,
  GetLatestPayrollVersionQueryVariables
>;
export const GeneratePayrollDatesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GeneratePayrollDates" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "payrollId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "startDate" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "date" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "endDate" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "date" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "maxDates" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "generatePayrollDates" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "args" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "p_payroll_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "payrollId" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "p_start_date" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "startDate" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "p_end_date" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "endDate" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "p_max_dates" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "maxDates" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "payrollId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "originalEftDate" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "adjustedEftDate" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "processingDate" },
                },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GeneratePayrollDatesQuery,
  GeneratePayrollDatesQueryVariables
>;
export const GetUserUpcomingPayrollsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetUserUpcomingPayrolls" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "userId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "from_date" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "date" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "limit" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "10" },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payrolls" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "_and" },
                      value: {
                        kind: "ListValue",
                        values: [
                          {
                            kind: "ObjectValue",
                            fields: [
                              {
                                kind: "ObjectField",
                                name: { kind: "Name", value: "supersededDate" },
                                value: {
                                  kind: "ObjectValue",
                                  fields: [
                                    {
                                      kind: "ObjectField",
                                      name: { kind: "Name", value: "_is_null" },
                                      value: {
                                        kind: "BooleanValue",
                                        value: true,
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                          {
                            kind: "ObjectValue",
                            fields: [
                              {
                                kind: "ObjectField",
                                name: { kind: "Name", value: "_or" },
                                value: {
                                  kind: "ListValue",
                                  values: [
                                    {
                                      kind: "ObjectValue",
                                      fields: [
                                        {
                                          kind: "ObjectField",
                                          name: {
                                            kind: "Name",
                                            value: "primaryConsultantUserId",
                                          },
                                          value: {
                                            kind: "ObjectValue",
                                            fields: [
                                              {
                                                kind: "ObjectField",
                                                name: {
                                                  kind: "Name",
                                                  value: "_eq",
                                                },
                                                value: {
                                                  kind: "Variable",
                                                  name: {
                                                    kind: "Name",
                                                    value: "userId",
                                                  },
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                    {
                                      kind: "ObjectValue",
                                      fields: [
                                        {
                                          kind: "ObjectField",
                                          name: {
                                            kind: "Name",
                                            value: "backupConsultantUserId",
                                          },
                                          value: {
                                            kind: "ObjectValue",
                                            fields: [
                                              {
                                                kind: "ObjectField",
                                                name: {
                                                  kind: "Name",
                                                  value: "_eq",
                                                },
                                                value: {
                                                  kind: "Variable",
                                                  name: {
                                                    kind: "Name",
                                                    value: "userId",
                                                  },
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                    {
                                      kind: "ObjectValue",
                                      fields: [
                                        {
                                          kind: "ObjectField",
                                          name: {
                                            kind: "Name",
                                            value: "managerUserId",
                                          },
                                          value: {
                                            kind: "ObjectValue",
                                            fields: [
                                              {
                                                kind: "ObjectField",
                                                name: {
                                                  kind: "Name",
                                                  value: "_eq",
                                                },
                                                value: {
                                                  kind: "Variable",
                                                  name: {
                                                    kind: "Name",
                                                    value: "userId",
                                                  },
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                          {
                            kind: "ObjectValue",
                            fields: [
                              {
                                kind: "ObjectField",
                                name: { kind: "Name", value: "payrollDates" },
                                value: {
                                  kind: "ObjectValue",
                                  fields: [
                                    {
                                      kind: "ObjectField",
                                      name: {
                                        kind: "Name",
                                        value: "adjustedEftDate",
                                      },
                                      value: {
                                        kind: "ObjectValue",
                                        fields: [
                                          {
                                            kind: "ObjectField",
                                            name: {
                                              kind: "Name",
                                              value: "_gte",
                                            },
                                            value: {
                                              kind: "Variable",
                                              name: {
                                                kind: "Name",
                                                value: "from_date",
                                              },
                                            },
                                          },
                                        ],
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "payrollDates_aggregate" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "min" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: {
                                    kind: "Name",
                                    value: "adjustedEftDate",
                                  },
                                  value: { kind: "EnumValue", value: "asc" },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "limit" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "client" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "payrollDates" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "where" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "adjustedEftDate" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_gte" },
                                  value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "from_date" },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "order_by" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "adjustedEftDate" },
                            value: { kind: "EnumValue", value: "asc" },
                          },
                        ],
                      },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "limit" },
                      value: { kind: "IntValue", value: "3" },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "adjustedEftDate" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "processingDate" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "originalEftDate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "primaryConsultant" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "backupConsultant" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "manager" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetUserUpcomingPayrollsQuery,
  GetUserUpcomingPayrollsQueryVariables
>;
export const PayrollUpdatesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "PayrollUpdates" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payroll" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "PayrollWithDates" },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollFullDetails" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payrolls" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "employeeCount" } },
          { kind: "Field", name: { kind: "Name", value: "processingTime" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "processingDaysBeforeEft" },
          },
          { kind: "Field", name: { kind: "Name", value: "payrollSystem" } },
          { kind: "Field", name: { kind: "Name", value: "dateValue" } },
          { kind: "Field", name: { kind: "Name", value: "versionNumber" } },
          { kind: "Field", name: { kind: "Name", value: "parentPayrollId" } },
          { kind: "Field", name: { kind: "Name", value: "goLiveDate" } },
          { kind: "Field", name: { kind: "Name", value: "supersededDate" } },
          { kind: "Field", name: { kind: "Name", value: "versionReason" } },
          { kind: "Field", name: { kind: "Name", value: "createdByUserId" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollWithRelations" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payrolls" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "PayrollFullDetails" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "client" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "payrollCycle" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "payrollDateType" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "primaryConsultant" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "backupConsultant" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "manager" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollDate" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payroll_dates" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "payrollId" } },
          { kind: "Field", name: { kind: "Name", value: "originalEftDate" } },
          { kind: "Field", name: { kind: "Name", value: "adjustedEftDate" } },
          { kind: "Field", name: { kind: "Name", value: "processingDate" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollWithDates" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payrolls" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "PayrollWithRelations" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "payrollDates" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "adjustedEftDate" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "PayrollDate" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  PayrollUpdatesSubscription,
  PayrollUpdatesSubscriptionVariables
>;
export const PayrollListUpdatesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "PayrollListUpdates" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payrolls" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "supersededDate" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_is_null" },
                            value: { kind: "BooleanValue", value: true },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "updatedAt" },
                      value: { kind: "EnumValue", value: "desc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "PayrollBasicInfo" },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollBasicInfo" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payrolls" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "clientId" } },
          { kind: "Field", name: { kind: "Name", value: "cycleId" } },
          { kind: "Field", name: { kind: "Name", value: "dateTypeId" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "primaryConsultantUserId" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "backupConsultantUserId" },
          },
          { kind: "Field", name: { kind: "Name", value: "managerUserId" } },
          { kind: "Field", name: { kind: "Name", value: "employeeCount" } },
          { kind: "Field", name: { kind: "Name", value: "goLiveDate" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  PayrollListUpdatesSubscription,
  PayrollListUpdatesSubscriptionVariables
>;
export const PayrollDateUpdatesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "PayrollDateUpdates" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "payrollId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payrollDates" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "payrollId" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "payrollId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "adjustedEftDate" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "PayrollDate" },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PayrollDate" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "payroll_dates" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "payrollId" } },
          { kind: "Field", name: { kind: "Name", value: "originalEftDate" } },
          { kind: "Field", name: { kind: "Name", value: "adjustedEftDate" } },
          { kind: "Field", name: { kind: "Name", value: "processingDate" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  PayrollDateUpdatesSubscription,
  PayrollDateUpdatesSubscriptionVariables
>;
export const PayrollSubscriptionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "PayrollSubscription" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payrolls" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  PayrollSubscriptionSubscription,
  PayrollSubscriptionSubscriptionVariables
>;
export const TestSubscriptionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "TestSubscription" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "payrolls" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "IntValue", value: "1" },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  TestSubscriptionSubscription,
  TestSubscriptionSubscriptionVariables
>;
