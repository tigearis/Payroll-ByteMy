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
 * ✓ Client Preset v4.8+ for optimal type safety
 * ✓ Zero type conflicts with modern codegen
 * 
 * Generated: 2025-07-31T09:02:05.361Z
 * Schema Version: Latest from Hasura
 * CodeGen Version: Client Preset v4.0
 */

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  bigint: { input: string; output: string; }
  bpchar: { input: any; output: any; }
  date: { input: string; output: string; }
  inet: { input: any; output: any; }
  interval: { input: any; output: any; }
  invitation_status_enum: { input: any; output: any; }
  jsonb: { input: any; output: any; }
  leave_status_enum: { input: any; output: any; }
  name: { input: any; output: any; }
  numeric: { input: number; output: number; }
  payroll_cycle_type: { input: any; output: any; }
  payroll_date_type: { input: any; output: any; }
  payroll_status: { input: any; output: any; }
  permission_action: { input: any; output: any; }
  timestamp: { input: any; output: any; }
  timestamptz: { input: string; output: string; }
  user_position: { input: any; output: any; }
  user_role: { input: any; output: any; }
  user_status_enum: { input: any; output: any; }
  uuid: { input: string; output: string; }
};

export type AdjustmentRulesAggregateBoolExp = {
  count?: InputMaybe<AdjustmentRulesAggregateBoolExpCount>;
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
  payrollCycle?: InputMaybe<PayrollCyclesBoolExp>;
  payrollDateType?: InputMaybe<PayrollDateTypesBoolExp>;
  ruleCode?: InputMaybe<StringComparisonExp>;
  ruleDescription?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "adjustment_rules" */
export type AdjustmentRulesConstraint =
  /** unique or primary key constraint on columns "cycle_id", "date_type_id" */
  | 'adjustment_rules_cycle_id_date_type_id_key'
  /** unique or primary key constraint on columns "id" */
  | 'adjustment_rules_pkey'
  | '%future added value';

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
  payrollCycle?: InputMaybe<PayrollCyclesObjRelInsertInput>;
  payrollDateType?: InputMaybe<PayrollDateTypesObjRelInsertInput>;
  /** Code/formula used to calculate date adjustments */
  ruleCode?: InputMaybe<Scalars['String']['input']>;
  /** Human-readable description of the adjustment rule */
  ruleDescription?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the rule was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
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
  payrollCycle?: InputMaybe<PayrollCyclesOrderBy>;
  payrollDateType?: InputMaybe<PayrollDateTypesOrderBy>;
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
export type AdjustmentRulesSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'cycleId'
  /** column name */
  | 'dateTypeId'
  /** column name */
  | 'id'
  /** column name */
  | 'ruleCode'
  /** column name */
  | 'ruleDescription'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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

/** Streaming cursor of the table "adjustment_rules" */
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
export type AdjustmentRulesUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'cycleId'
  /** column name */
  | 'dateTypeId'
  /** column name */
  | 'id'
  /** column name */
  | 'ruleCode'
  /** column name */
  | 'ruleDescription'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type AdjustmentRulesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AdjustmentRulesSetInput>;
  /** filter the rows which have to be updated */
  where: AdjustmentRulesBoolExp;
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
export type AppSettingsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'app_settings_pkey'
  | '%future added value';

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
export type AppSettingsSelectColumn =
  /** column name */
  | 'id'
  /** column name */
  | 'permissions'
  | '%future added value';

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
export type AppSettingsUpdateColumn =
  /** column name */
  | 'id'
  /** column name */
  | 'permissions'
  | '%future added value';

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

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuditAuditLogAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newValues?: InputMaybe<Scalars['jsonb']['input']>;
  oldValues?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "audit.audit_log". All fields are combined with a logical 'AND'. */
export type AuditAuditLogBoolExp = {
  _and?: InputMaybe<Array<AuditAuditLogBoolExp>>;
  _not?: InputMaybe<AuditAuditLogBoolExp>;
  _or?: InputMaybe<Array<AuditAuditLogBoolExp>>;
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
export type AuditAuditLogConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'audit_log_pkey'
  | '%future added value';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AuditAuditLogDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
  newValues?: InputMaybe<Array<Scalars['String']['input']>>;
  oldValues?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AuditAuditLogDeleteElemInput = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
  newValues?: InputMaybe<Scalars['Int']['input']>;
  oldValues?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AuditAuditLogDeleteKeyInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
  newValues?: InputMaybe<Scalars['String']['input']>;
  oldValues?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "audit.audit_log" */
export type AuditAuditLogInsertInput = {
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

/** on_conflict condition type for table "audit.audit_log" */
export type AuditAuditLogOnConflict = {
  constraint: AuditAuditLogConstraint;
  updateColumns?: Array<AuditAuditLogUpdateColumn>;
  where?: InputMaybe<AuditAuditLogBoolExp>;
};

/** Ordering options when selecting data from "audit.audit_log". */
export type AuditAuditLogOrderBy = {
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
export type AuditAuditLogPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuditAuditLogPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newValues?: InputMaybe<Scalars['jsonb']['input']>;
  oldValues?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit.audit_log" */
export type AuditAuditLogSelectColumn =
  /** column name */
  | 'action'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'errorMessage'
  /** column name */
  | 'eventTime'
  /** column name */
  | 'id'
  /** column name */
  | 'ipAddress'
  /** column name */
  | 'metadata'
  /** column name */
  | 'newValues'
  /** column name */
  | 'oldValues'
  /** column name */
  | 'requestId'
  /** column name */
  | 'resourceId'
  /** column name */
  | 'resourceType'
  /** column name */
  | 'sessionId'
  /** column name */
  | 'success'
  /** column name */
  | 'userAgent'
  /** column name */
  | 'userEmail'
  /** column name */
  | 'userId'
  /** column name */
  | 'userRole'
  | '%future added value';

/** input type for updating data in table "audit.audit_log" */
export type AuditAuditLogSetInput = {
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

/** Streaming cursor of the table "audit_audit_log" */
export type AuditAuditLogStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: AuditAuditLogStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AuditAuditLogStreamCursorValueInput = {
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
export type AuditAuditLogUpdateColumn =
  /** column name */
  | 'action'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'errorMessage'
  /** column name */
  | 'eventTime'
  /** column name */
  | 'id'
  /** column name */
  | 'ipAddress'
  /** column name */
  | 'metadata'
  /** column name */
  | 'newValues'
  /** column name */
  | 'oldValues'
  /** column name */
  | 'requestId'
  /** column name */
  | 'resourceId'
  /** column name */
  | 'resourceType'
  /** column name */
  | 'sessionId'
  /** column name */
  | 'success'
  /** column name */
  | 'userAgent'
  /** column name */
  | 'userEmail'
  /** column name */
  | 'userId'
  /** column name */
  | 'userRole'
  | '%future added value';

export type AuditAuditLogUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<AuditAuditLogAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<AuditAuditLogDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<AuditAuditLogDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<AuditAuditLogDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<AuditAuditLogPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuditAuditLogSetInput>;
  /** filter the rows which have to be updated */
  where: AuditAuditLogBoolExp;
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
export type AuditAuthEventsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'auth_events_pkey'
  | '%future added value';

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

/** on_conflict condition type for table "audit.auth_events" */
export type AuditAuthEventsOnConflict = {
  constraint: AuditAuthEventsConstraint;
  updateColumns?: Array<AuditAuthEventsUpdateColumn>;
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
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuditAuthEventsPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit.auth_events" */
export type AuditAuthEventsSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'eventTime'
  /** column name */
  | 'eventType'
  /** column name */
  | 'failureReason'
  /** column name */
  | 'id'
  /** column name */
  | 'ipAddress'
  /** column name */
  | 'metadata'
  /** column name */
  | 'success'
  /** column name */
  | 'userAgent'
  /** column name */
  | 'userEmail'
  /** column name */
  | 'userId'
  | '%future added value';

/** input type for updating data in table "audit.auth_events" */
export type AuditAuthEventsSetInput = {
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

/** Streaming cursor of the table "audit_auth_events" */
export type AuditAuthEventsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: AuditAuthEventsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AuditAuthEventsStreamCursorValueInput = {
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
export type AuditAuthEventsUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'eventTime'
  /** column name */
  | 'eventType'
  /** column name */
  | 'failureReason'
  /** column name */
  | 'id'
  /** column name */
  | 'ipAddress'
  /** column name */
  | 'metadata'
  /** column name */
  | 'success'
  /** column name */
  | 'userAgent'
  /** column name */
  | 'userEmail'
  /** column name */
  | 'userId'
  | '%future added value';

export type AuditAuthEventsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<AuditAuthEventsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<AuditAuthEventsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<AuditAuthEventsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<AuditAuthEventsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<AuditAuthEventsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuditAuthEventsSetInput>;
  /** filter the rows which have to be updated */
  where: AuditAuthEventsBoolExp;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuditDataAccessLogAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
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
export type AuditDataAccessLogConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'data_access_log_pkey'
  | '%future added value';

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
  rowCount?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "audit.data_access_log" */
export type AuditDataAccessLogInsertInput = {
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

/** on_conflict condition type for table "audit.data_access_log" */
export type AuditDataAccessLogOnConflict = {
  constraint: AuditDataAccessLogConstraint;
  updateColumns?: Array<AuditDataAccessLogUpdateColumn>;
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
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuditDataAccessLogPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit.data_access_log" */
export type AuditDataAccessLogSelectColumn =
  /** column name */
  | 'accessType'
  /** column name */
  | 'accessedAt'
  /** column name */
  | 'dataClassification'
  /** column name */
  | 'fieldsAccessed'
  /** column name */
  | 'id'
  /** column name */
  | 'ipAddress'
  /** column name */
  | 'metadata'
  /** column name */
  | 'queryExecuted'
  /** column name */
  | 'resourceId'
  /** column name */
  | 'resourceType'
  /** column name */
  | 'rowCount'
  /** column name */
  | 'sessionId'
  /** column name */
  | 'userId'
  | '%future added value';

/** input type for updating data in table "audit.data_access_log" */
export type AuditDataAccessLogSetInput = {
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

/** Streaming cursor of the table "audit_data_access_log" */
export type AuditDataAccessLogStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: AuditDataAccessLogStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AuditDataAccessLogStreamCursorValueInput = {
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

/** update columns of table "audit.data_access_log" */
export type AuditDataAccessLogUpdateColumn =
  /** column name */
  | 'accessType'
  /** column name */
  | 'accessedAt'
  /** column name */
  | 'dataClassification'
  /** column name */
  | 'fieldsAccessed'
  /** column name */
  | 'id'
  /** column name */
  | 'ipAddress'
  /** column name */
  | 'metadata'
  /** column name */
  | 'queryExecuted'
  /** column name */
  | 'resourceId'
  /** column name */
  | 'resourceType'
  /** column name */
  | 'rowCount'
  /** column name */
  | 'sessionId'
  /** column name */
  | 'userId'
  | '%future added value';

export type AuditDataAccessLogUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<AuditDataAccessLogAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<AuditDataAccessLogDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<AuditDataAccessLogDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<AuditDataAccessLogDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<AuditDataAccessLogIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<AuditDataAccessLogPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuditDataAccessLogSetInput>;
  /** filter the rows which have to be updated */
  where: AuditDataAccessLogBoolExp;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuditPermissionChangesAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newPermissions?: InputMaybe<Scalars['jsonb']['input']>;
  oldPermissions?: InputMaybe<Scalars['jsonb']['input']>;
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
export type AuditPermissionChangesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'permission_changes_pkey'
  | '%future added value';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AuditPermissionChangesDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
  newPermissions?: InputMaybe<Array<Scalars['String']['input']>>;
  oldPermissions?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AuditPermissionChangesDeleteElemInput = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
  newPermissions?: InputMaybe<Scalars['Int']['input']>;
  oldPermissions?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AuditPermissionChangesDeleteKeyInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
  newPermissions?: InputMaybe<Scalars['String']['input']>;
  oldPermissions?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "audit.permission_changes" */
export type AuditPermissionChangesInsertInput = {
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

/** on_conflict condition type for table "audit.permission_changes" */
export type AuditPermissionChangesOnConflict = {
  constraint: AuditPermissionChangesConstraint;
  updateColumns?: Array<AuditPermissionChangesUpdateColumn>;
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
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuditPermissionChangesPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newPermissions?: InputMaybe<Scalars['jsonb']['input']>;
  oldPermissions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit.permission_changes" */
export type AuditPermissionChangesSelectColumn =
  /** column name */
  | 'approvedByUserId'
  /** column name */
  | 'changeType'
  /** column name */
  | 'changedAt'
  /** column name */
  | 'changedByUserId'
  /** column name */
  | 'id'
  /** column name */
  | 'metadata'
  /** column name */
  | 'newPermissions'
  /** column name */
  | 'oldPermissions'
  /** column name */
  | 'permissionType'
  /** column name */
  | 'reason'
  /** column name */
  | 'targetRoleId'
  /** column name */
  | 'targetUserId'
  | '%future added value';

/** input type for updating data in table "audit.permission_changes" */
export type AuditPermissionChangesSetInput = {
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

/** Streaming cursor of the table "audit_permission_changes" */
export type AuditPermissionChangesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: AuditPermissionChangesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AuditPermissionChangesStreamCursorValueInput = {
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
export type AuditPermissionChangesUpdateColumn =
  /** column name */
  | 'approvedByUserId'
  /** column name */
  | 'changeType'
  /** column name */
  | 'changedAt'
  /** column name */
  | 'changedByUserId'
  /** column name */
  | 'id'
  /** column name */
  | 'metadata'
  /** column name */
  | 'newPermissions'
  /** column name */
  | 'oldPermissions'
  /** column name */
  | 'permissionType'
  /** column name */
  | 'reason'
  /** column name */
  | 'targetRoleId'
  /** column name */
  | 'targetUserId'
  | '%future added value';

export type AuditPermissionChangesUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<AuditPermissionChangesAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<AuditPermissionChangesDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<AuditPermissionChangesDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<AuditPermissionChangesDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<AuditPermissionChangesPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuditPermissionChangesSetInput>;
  /** filter the rows which have to be updated */
  where: AuditPermissionChangesBoolExp;
};

/** Boolean expression to filter rows from the table "audit.permission_usage_report". All fields are combined with a logical 'AND'. */
export type AuditPermissionUsageReportBoolExp = {
  _and?: InputMaybe<Array<AuditPermissionUsageReportBoolExp>>;
  _not?: InputMaybe<AuditPermissionUsageReportBoolExp>;
  _or?: InputMaybe<Array<AuditPermissionUsageReportBoolExp>>;
  action?: InputMaybe<PermissionActionComparisonExp>;
  lastUsed?: InputMaybe<TimestamptzComparisonExp>;
  resourceName?: InputMaybe<StringComparisonExp>;
  roleName?: InputMaybe<StringComparisonExp>;
  totalUsageCount?: InputMaybe<BigintComparisonExp>;
  usersWhoUsedPermission?: InputMaybe<BigintComparisonExp>;
  usersWithPermission?: InputMaybe<BigintComparisonExp>;
};

/** Ordering options when selecting data from "audit.permission_usage_report". */
export type AuditPermissionUsageReportOrderBy = {
  action?: InputMaybe<OrderBy>;
  lastUsed?: InputMaybe<OrderBy>;
  resourceName?: InputMaybe<OrderBy>;
  roleName?: InputMaybe<OrderBy>;
  totalUsageCount?: InputMaybe<OrderBy>;
  usersWhoUsedPermission?: InputMaybe<OrderBy>;
  usersWithPermission?: InputMaybe<OrderBy>;
};

/** select columns of table "audit.permission_usage_report" */
export type AuditPermissionUsageReportSelectColumn =
  /** column name */
  | 'action'
  /** column name */
  | 'lastUsed'
  /** column name */
  | 'resourceName'
  /** column name */
  | 'roleName'
  /** column name */
  | 'totalUsageCount'
  /** column name */
  | 'usersWhoUsedPermission'
  /** column name */
  | 'usersWithPermission'
  | '%future added value';

/** Streaming cursor of the table "audit_permission_usage_report" */
export type AuditPermissionUsageReportStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: AuditPermissionUsageReportStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AuditPermissionUsageReportStreamCursorValueInput = {
  action?: InputMaybe<Scalars['permission_action']['input']>;
  lastUsed?: InputMaybe<Scalars['timestamptz']['input']>;
  resourceName?: InputMaybe<Scalars['String']['input']>;
  roleName?: InputMaybe<Scalars['String']['input']>;
  totalUsageCount?: InputMaybe<Scalars['bigint']['input']>;
  usersWhoUsedPermission?: InputMaybe<Scalars['bigint']['input']>;
  usersWithPermission?: InputMaybe<Scalars['bigint']['input']>;
};

/** Boolean expression to filter rows from the table "audit.slow_queries". All fields are combined with a logical 'AND'. */
export type AuditSlowQueriesBoolExp = {
  _and?: InputMaybe<Array<AuditSlowQueriesBoolExp>>;
  _not?: InputMaybe<AuditSlowQueriesBoolExp>;
  _or?: InputMaybe<Array<AuditSlowQueriesBoolExp>>;
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
export type AuditSlowQueriesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'slow_queries_pkey'
  | '%future added value';

/** input type for inserting data into table "audit.slow_queries" */
export type AuditSlowQueriesInsertInput = {
  applicationName?: InputMaybe<Scalars['String']['input']>;
  clientAddr?: InputMaybe<Scalars['inet']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryDuration?: InputMaybe<Scalars['interval']['input']>;
  queryStart?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** on_conflict condition type for table "audit.slow_queries" */
export type AuditSlowQueriesOnConflict = {
  constraint: AuditSlowQueriesConstraint;
  updateColumns?: Array<AuditSlowQueriesUpdateColumn>;
  where?: InputMaybe<AuditSlowQueriesBoolExp>;
};

/** Ordering options when selecting data from "audit.slow_queries". */
export type AuditSlowQueriesOrderBy = {
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
export type AuditSlowQueriesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "audit.slow_queries" */
export type AuditSlowQueriesSelectColumn =
  /** column name */
  | 'applicationName'
  /** column name */
  | 'clientAddr'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'query'
  /** column name */
  | 'queryDuration'
  /** column name */
  | 'queryStart'
  /** column name */
  | 'userId'
  | '%future added value';

/** input type for updating data in table "audit.slow_queries" */
export type AuditSlowQueriesSetInput = {
  applicationName?: InputMaybe<Scalars['String']['input']>;
  clientAddr?: InputMaybe<Scalars['inet']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryDuration?: InputMaybe<Scalars['interval']['input']>;
  queryStart?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "audit_slow_queries" */
export type AuditSlowQueriesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: AuditSlowQueriesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AuditSlowQueriesStreamCursorValueInput = {
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
export type AuditSlowQueriesUpdateColumn =
  /** column name */
  | 'applicationName'
  /** column name */
  | 'clientAddr'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'query'
  /** column name */
  | 'queryDuration'
  /** column name */
  | 'queryStart'
  /** column name */
  | 'userId'
  | '%future added value';

export type AuditSlowQueriesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuditSlowQueriesSetInput>;
  /** filter the rows which have to be updated */
  where: AuditSlowQueriesBoolExp;
};

/** Boolean expression to filter rows from the table "audit.user_access_summary". All fields are combined with a logical 'AND'. */
export type AuditUserAccessSummaryBoolExp = {
  _and?: InputMaybe<Array<AuditUserAccessSummaryBoolExp>>;
  _not?: InputMaybe<AuditUserAccessSummaryBoolExp>;
  _or?: InputMaybe<Array<AuditUserAccessSummaryBoolExp>>;
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
export type AuditUserAccessSummaryInsertInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isStaff?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Ordering options when selecting data from "audit.user_access_summary". */
export type AuditUserAccessSummaryOrderBy = {
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
export type AuditUserAccessSummarySelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'email'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isStaff'
  /** column name */
  | 'name'
  /** column name */
  | 'role'
  /** column name */
  | 'updatedAt'
  | '%future added value';

/** input type for updating data in table "audit.user_access_summary" */
export type AuditUserAccessSummarySetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isStaff?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "audit_user_access_summary" */
export type AuditUserAccessSummaryStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: AuditUserAccessSummaryStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AuditUserAccessSummaryStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isStaff?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
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
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['bigint']['input']>;
  _lte?: InputMaybe<Scalars['bigint']['input']>;
  _neq?: InputMaybe<Scalars['bigint']['input']>;
  _nin?: InputMaybe<Array<Scalars['bigint']['input']>>;
};

export type BillingEventLogAggregateBoolExp = {
  count?: InputMaybe<BillingEventLogAggregateBoolExpCount>;
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
  onConflict?: InputMaybe<BillingEventLogOnConflict>;
};

/** Boolean expression to filter rows from the table "billing_event_log". All fields are combined with a logical 'AND'. */
export type BillingEventLogBoolExp = {
  _and?: InputMaybe<Array<BillingEventLogBoolExp>>;
  _not?: InputMaybe<BillingEventLogBoolExp>;
  _or?: InputMaybe<Array<BillingEventLogBoolExp>>;
  billingInvoice?: InputMaybe<BillingInvoiceBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdBy?: InputMaybe<UuidComparisonExp>;
  createdByUser?: InputMaybe<UsersBoolExp>;
  eventType?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  invoiceId?: InputMaybe<UuidComparisonExp>;
  message?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "billing_event_log" */
export type BillingEventLogConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'billing_event_log_pkey'
  | '%future added value';

/** input type for inserting data into table "billing_event_log" */
export type BillingEventLogInsertInput = {
  billingInvoice?: InputMaybe<BillingInvoiceObjRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  createdByUser?: InputMaybe<UsersObjRelInsertInput>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
};

/** order by max() on columns of table "billing_event_log" */
export type BillingEventLogMaxOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  eventType?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "billing_event_log" */
export type BillingEventLogMinOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  eventType?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "billing_event_log" */
export type BillingEventLogOnConflict = {
  constraint: BillingEventLogConstraint;
  updateColumns?: Array<BillingEventLogUpdateColumn>;
  where?: InputMaybe<BillingEventLogBoolExp>;
};

/** Ordering options when selecting data from "billing_event_log". */
export type BillingEventLogOrderBy = {
  billingInvoice?: InputMaybe<BillingInvoiceOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  createdByUser?: InputMaybe<UsersOrderBy>;
  eventType?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_event_log */
export type BillingEventLogPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_event_log" */
export type BillingEventLogSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'eventType'
  /** column name */
  | 'id'
  /** column name */
  | 'invoiceId'
  /** column name */
  | 'message'
  | '%future added value';

/** input type for updating data in table "billing_event_log" */
export type BillingEventLogSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "billing_event_log" */
export type BillingEventLogStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: BillingEventLogStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BillingEventLogStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "billing_event_log" */
export type BillingEventLogUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'eventType'
  /** column name */
  | 'id'
  /** column name */
  | 'invoiceId'
  /** column name */
  | 'message'
  | '%future added value';

export type BillingEventLogUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingEventLogSetInput>;
  /** filter the rows which have to be updated */
  where: BillingEventLogBoolExp;
};

export type BillingInvoiceAggregateBoolExp = {
  count?: InputMaybe<BillingInvoiceAggregateBoolExpCount>;
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

/** order by avg() on columns of table "billing_invoice" */
export type BillingInvoiceAvgOrderBy = {
  /** Number of payroll jobs included in this invoice */
  payrollCount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  /** Total hours spent on services in this invoice */
  totalHours?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "billing_invoice". All fields are combined with a logical 'AND'. */
export type BillingInvoiceBoolExp = {
  _and?: InputMaybe<Array<BillingInvoiceBoolExp>>;
  _not?: InputMaybe<BillingInvoiceBoolExp>;
  _or?: InputMaybe<Array<BillingInvoiceBoolExp>>;
  billingPeriod?: InputMaybe<BillingPeriodsBoolExp>;
  billingPeriodEnd?: InputMaybe<DateComparisonExp>;
  billingPeriodId?: InputMaybe<UuidComparisonExp>;
  billingPeriodStart?: InputMaybe<DateComparisonExp>;
  client?: InputMaybe<ClientsBoolExp>;
  clientId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  currency?: InputMaybe<StringComparisonExp>;
  dueDate?: InputMaybe<DateComparisonExp>;
  eventLogs?: InputMaybe<BillingEventLogBoolExp>;
  eventLogsAggregate?: InputMaybe<BillingEventLogAggregateBoolExp>;
  id?: InputMaybe<UuidComparisonExp>;
  invoiceItems?: InputMaybe<BillingInvoiceItemBoolExp>;
  invoiceItemsAggregate?: InputMaybe<BillingInvoiceItemAggregateBoolExp>;
  invoiceNumber?: InputMaybe<StringComparisonExp>;
  issuedDate?: InputMaybe<DateComparisonExp>;
  notes?: InputMaybe<StringComparisonExp>;
  payrollCount?: InputMaybe<IntComparisonExp>;
  status?: InputMaybe<StringComparisonExp>;
  totalAmount?: InputMaybe<NumericComparisonExp>;
  totalHours?: InputMaybe<NumericComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "billing_invoice" */
export type BillingInvoiceConstraint =
  /** unique or primary key constraint on columns "invoice_number" */
  | 'billing_invoice_invoice_number_key'
  /** unique or primary key constraint on columns "id" */
  | 'billing_invoice_pkey'
  | '%future added value';

/** input type for incrementing numeric columns in table "billing_invoice" */
export type BillingInvoiceIncInput = {
  /** Number of payroll jobs included in this invoice */
  payrollCount?: InputMaybe<Scalars['Int']['input']>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
  /** Total hours spent on services in this invoice */
  totalHours?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_invoice" */
export type BillingInvoiceInsertInput = {
  billingPeriod?: InputMaybe<BillingPeriodsObjRelInsertInput>;
  billingPeriodEnd?: InputMaybe<Scalars['date']['input']>;
  /** Reference to billing period this invoice covers */
  billingPeriodId?: InputMaybe<Scalars['uuid']['input']>;
  billingPeriodStart?: InputMaybe<Scalars['date']['input']>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['date']['input']>;
  eventLogs?: InputMaybe<BillingEventLogArrRelInsertInput>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceItems?: InputMaybe<BillingInvoiceItemArrRelInsertInput>;
  /** Unique invoice number for client reference */
  invoiceNumber?: InputMaybe<Scalars['String']['input']>;
  issuedDate?: InputMaybe<Scalars['date']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Number of payroll jobs included in this invoice */
  payrollCount?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
  /** Total hours spent on services in this invoice */
  totalHours?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

export type BillingInvoiceItemAggregateBoolExp = {
  count?: InputMaybe<BillingInvoiceItemAggregateBoolExpCount>;
};

/** order by aggregate values of table "billing_invoice_item" */
export type BillingInvoiceItemAggregateOrderBy = {
  avg?: InputMaybe<BillingInvoiceItemAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BillingInvoiceItemMaxOrderBy>;
  min?: InputMaybe<BillingInvoiceItemMinOrderBy>;
  stddev?: InputMaybe<BillingInvoiceItemStddevOrderBy>;
  stddevPop?: InputMaybe<BillingInvoiceItemStddevPopOrderBy>;
  stddevSamp?: InputMaybe<BillingInvoiceItemStddevSampOrderBy>;
  sum?: InputMaybe<BillingInvoiceItemSumOrderBy>;
  varPop?: InputMaybe<BillingInvoiceItemVarPopOrderBy>;
  varSamp?: InputMaybe<BillingInvoiceItemVarSampOrderBy>;
  variance?: InputMaybe<BillingInvoiceItemVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "billing_invoice_item" */
export type BillingInvoiceItemArrRelInsertInput = {
  data: Array<BillingInvoiceItemInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<BillingInvoiceItemOnConflict>;
};

/** order by avg() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemAvgOrderBy = {
  hourlyRate?: InputMaybe<OrderBy>;
  netAmount?: InputMaybe<OrderBy>;
  quantityHours?: InputMaybe<OrderBy>;
  taxAmount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "billing_invoice_item". All fields are combined with a logical 'AND'. */
export type BillingInvoiceItemBoolExp = {
  _and?: InputMaybe<Array<BillingInvoiceItemBoolExp>>;
  _not?: InputMaybe<BillingInvoiceItemBoolExp>;
  _or?: InputMaybe<Array<BillingInvoiceItemBoolExp>>;
  billingInvoice?: InputMaybe<BillingInvoiceBoolExp>;
  billingItem?: InputMaybe<BillingItemsBoolExp>;
  billingPeriodEnd?: InputMaybe<DateComparisonExp>;
  billingPeriodStart?: InputMaybe<DateComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  descriptionOverride?: InputMaybe<StringComparisonExp>;
  hourlyRate?: InputMaybe<NumericComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  invoiceId?: InputMaybe<UuidComparisonExp>;
  itemId?: InputMaybe<UuidComparisonExp>;
  lineItemType?: InputMaybe<StringComparisonExp>;
  netAmount?: InputMaybe<NumericComparisonExp>;
  quantityHours?: InputMaybe<NumericComparisonExp>;
  taxAmount?: InputMaybe<NumericComparisonExp>;
  totalAmount?: InputMaybe<NumericComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "billing_invoice_item" */
export type BillingInvoiceItemConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'billing_invoice_item_pkey'
  | '%future added value';

/** input type for incrementing numeric columns in table "billing_invoice_item" */
export type BillingInvoiceItemIncInput = {
  hourlyRate?: InputMaybe<Scalars['numeric']['input']>;
  quantityHours?: InputMaybe<Scalars['numeric']['input']>;
  taxAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_invoice_item" */
export type BillingInvoiceItemInsertInput = {
  billingInvoice?: InputMaybe<BillingInvoiceObjRelInsertInput>;
  billingItem?: InputMaybe<BillingItemsObjRelInsertInput>;
  billingPeriodEnd?: InputMaybe<Scalars['date']['input']>;
  billingPeriodStart?: InputMaybe<Scalars['date']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  descriptionOverride?: InputMaybe<Scalars['String']['input']>;
  hourlyRate?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  itemId?: InputMaybe<Scalars['uuid']['input']>;
  lineItemType?: InputMaybe<Scalars['String']['input']>;
  quantityHours?: InputMaybe<Scalars['numeric']['input']>;
  taxAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by max() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemMaxOrderBy = {
  billingPeriodEnd?: InputMaybe<OrderBy>;
  billingPeriodStart?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  descriptionOverride?: InputMaybe<OrderBy>;
  hourlyRate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  itemId?: InputMaybe<OrderBy>;
  lineItemType?: InputMaybe<OrderBy>;
  netAmount?: InputMaybe<OrderBy>;
  quantityHours?: InputMaybe<OrderBy>;
  taxAmount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemMinOrderBy = {
  billingPeriodEnd?: InputMaybe<OrderBy>;
  billingPeriodStart?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  descriptionOverride?: InputMaybe<OrderBy>;
  hourlyRate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  itemId?: InputMaybe<OrderBy>;
  lineItemType?: InputMaybe<OrderBy>;
  netAmount?: InputMaybe<OrderBy>;
  quantityHours?: InputMaybe<OrderBy>;
  taxAmount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "billing_invoice_item" */
export type BillingInvoiceItemOnConflict = {
  constraint: BillingInvoiceItemConstraint;
  updateColumns?: Array<BillingInvoiceItemUpdateColumn>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};

/** Ordering options when selecting data from "billing_invoice_item". */
export type BillingInvoiceItemOrderBy = {
  billingInvoice?: InputMaybe<BillingInvoiceOrderBy>;
  billingItem?: InputMaybe<BillingItemsOrderBy>;
  billingPeriodEnd?: InputMaybe<OrderBy>;
  billingPeriodStart?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  descriptionOverride?: InputMaybe<OrderBy>;
  hourlyRate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  itemId?: InputMaybe<OrderBy>;
  lineItemType?: InputMaybe<OrderBy>;
  netAmount?: InputMaybe<OrderBy>;
  quantityHours?: InputMaybe<OrderBy>;
  taxAmount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_invoice_item */
export type BillingInvoiceItemPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_invoice_item" */
export type BillingInvoiceItemSelectColumn =
  /** column name */
  | 'billingPeriodEnd'
  /** column name */
  | 'billingPeriodStart'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'descriptionOverride'
  /** column name */
  | 'hourlyRate'
  /** column name */
  | 'id'
  /** column name */
  | 'invoiceId'
  /** column name */
  | 'itemId'
  /** column name */
  | 'lineItemType'
  /** column name */
  | 'netAmount'
  /** column name */
  | 'quantityHours'
  /** column name */
  | 'taxAmount'
  /** column name */
  | 'totalAmount'
  /** column name */
  | 'updatedAt'
  | '%future added value';

/** input type for updating data in table "billing_invoice_item" */
export type BillingInvoiceItemSetInput = {
  billingPeriodEnd?: InputMaybe<Scalars['date']['input']>;
  billingPeriodStart?: InputMaybe<Scalars['date']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  descriptionOverride?: InputMaybe<Scalars['String']['input']>;
  hourlyRate?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  itemId?: InputMaybe<Scalars['uuid']['input']>;
  lineItemType?: InputMaybe<Scalars['String']['input']>;
  quantityHours?: InputMaybe<Scalars['numeric']['input']>;
  taxAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by stddev() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemStddevOrderBy = {
  hourlyRate?: InputMaybe<OrderBy>;
  netAmount?: InputMaybe<OrderBy>;
  quantityHours?: InputMaybe<OrderBy>;
  taxAmount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemStddevPopOrderBy = {
  hourlyRate?: InputMaybe<OrderBy>;
  netAmount?: InputMaybe<OrderBy>;
  quantityHours?: InputMaybe<OrderBy>;
  taxAmount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
};

/** order by stddevSamp() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemStddevSampOrderBy = {
  hourlyRate?: InputMaybe<OrderBy>;
  netAmount?: InputMaybe<OrderBy>;
  quantityHours?: InputMaybe<OrderBy>;
  taxAmount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "billing_invoice_item" */
export type BillingInvoiceItemStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: BillingInvoiceItemStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BillingInvoiceItemStreamCursorValueInput = {
  billingPeriodEnd?: InputMaybe<Scalars['date']['input']>;
  billingPeriodStart?: InputMaybe<Scalars['date']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  descriptionOverride?: InputMaybe<Scalars['String']['input']>;
  hourlyRate?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  itemId?: InputMaybe<Scalars['uuid']['input']>;
  lineItemType?: InputMaybe<Scalars['String']['input']>;
  netAmount?: InputMaybe<Scalars['numeric']['input']>;
  quantityHours?: InputMaybe<Scalars['numeric']['input']>;
  taxAmount?: InputMaybe<Scalars['numeric']['input']>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by sum() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemSumOrderBy = {
  hourlyRate?: InputMaybe<OrderBy>;
  netAmount?: InputMaybe<OrderBy>;
  quantityHours?: InputMaybe<OrderBy>;
  taxAmount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
};

/** update columns of table "billing_invoice_item" */
export type BillingInvoiceItemUpdateColumn =
  /** column name */
  | 'billingPeriodEnd'
  /** column name */
  | 'billingPeriodStart'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'descriptionOverride'
  /** column name */
  | 'hourlyRate'
  /** column name */
  | 'id'
  /** column name */
  | 'invoiceId'
  /** column name */
  | 'itemId'
  /** column name */
  | 'lineItemType'
  /** column name */
  | 'quantityHours'
  /** column name */
  | 'taxAmount'
  /** column name */
  | 'totalAmount'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type BillingInvoiceItemUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BillingInvoiceItemIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingInvoiceItemSetInput>;
  /** filter the rows which have to be updated */
  where: BillingInvoiceItemBoolExp;
};

/** order by varPop() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemVarPopOrderBy = {
  hourlyRate?: InputMaybe<OrderBy>;
  netAmount?: InputMaybe<OrderBy>;
  quantityHours?: InputMaybe<OrderBy>;
  taxAmount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemVarSampOrderBy = {
  hourlyRate?: InputMaybe<OrderBy>;
  netAmount?: InputMaybe<OrderBy>;
  quantityHours?: InputMaybe<OrderBy>;
  taxAmount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemVarianceOrderBy = {
  hourlyRate?: InputMaybe<OrderBy>;
  netAmount?: InputMaybe<OrderBy>;
  quantityHours?: InputMaybe<OrderBy>;
  taxAmount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
};

/** order by max() on columns of table "billing_invoice" */
export type BillingInvoiceMaxOrderBy = {
  billingPeriodEnd?: InputMaybe<OrderBy>;
  /** Reference to billing period this invoice covers */
  billingPeriodId?: InputMaybe<OrderBy>;
  billingPeriodStart?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  dueDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  /** Unique invoice number for client reference */
  invoiceNumber?: InputMaybe<OrderBy>;
  issuedDate?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  /** Number of payroll jobs included in this invoice */
  payrollCount?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  /** Total hours spent on services in this invoice */
  totalHours?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "billing_invoice" */
export type BillingInvoiceMinOrderBy = {
  billingPeriodEnd?: InputMaybe<OrderBy>;
  /** Reference to billing period this invoice covers */
  billingPeriodId?: InputMaybe<OrderBy>;
  billingPeriodStart?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  dueDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  /** Unique invoice number for client reference */
  invoiceNumber?: InputMaybe<OrderBy>;
  issuedDate?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  /** Number of payroll jobs included in this invoice */
  payrollCount?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  /** Total hours spent on services in this invoice */
  totalHours?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** input type for inserting object relation for remote table "billing_invoice" */
export type BillingInvoiceObjRelInsertInput = {
  data: BillingInvoiceInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<BillingInvoiceOnConflict>;
};

/** on_conflict condition type for table "billing_invoice" */
export type BillingInvoiceOnConflict = {
  constraint: BillingInvoiceConstraint;
  updateColumns?: Array<BillingInvoiceUpdateColumn>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};

/** Ordering options when selecting data from "billing_invoice". */
export type BillingInvoiceOrderBy = {
  billingPeriod?: InputMaybe<BillingPeriodsOrderBy>;
  billingPeriodEnd?: InputMaybe<OrderBy>;
  billingPeriodId?: InputMaybe<OrderBy>;
  billingPeriodStart?: InputMaybe<OrderBy>;
  client?: InputMaybe<ClientsOrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  dueDate?: InputMaybe<OrderBy>;
  eventLogsAggregate?: InputMaybe<BillingEventLogAggregateOrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceItemsAggregate?: InputMaybe<BillingInvoiceItemAggregateOrderBy>;
  invoiceNumber?: InputMaybe<OrderBy>;
  issuedDate?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  payrollCount?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  totalHours?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_invoice */
export type BillingInvoicePkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_invoice" */
export type BillingInvoiceSelectColumn =
  /** column name */
  | 'billingPeriodEnd'
  /** column name */
  | 'billingPeriodId'
  /** column name */
  | 'billingPeriodStart'
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'currency'
  /** column name */
  | 'dueDate'
  /** column name */
  | 'id'
  /** column name */
  | 'invoiceNumber'
  /** column name */
  | 'issuedDate'
  /** column name */
  | 'notes'
  /** column name */
  | 'payrollCount'
  /** column name */
  | 'status'
  /** column name */
  | 'totalAmount'
  /** column name */
  | 'totalHours'
  /** column name */
  | 'updatedAt'
  | '%future added value';

/** input type for updating data in table "billing_invoice" */
export type BillingInvoiceSetInput = {
  billingPeriodEnd?: InputMaybe<Scalars['date']['input']>;
  /** Reference to billing period this invoice covers */
  billingPeriodId?: InputMaybe<Scalars['uuid']['input']>;
  billingPeriodStart?: InputMaybe<Scalars['date']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Unique invoice number for client reference */
  invoiceNumber?: InputMaybe<Scalars['String']['input']>;
  issuedDate?: InputMaybe<Scalars['date']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Number of payroll jobs included in this invoice */
  payrollCount?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
  /** Total hours spent on services in this invoice */
  totalHours?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by stddev() on columns of table "billing_invoice" */
export type BillingInvoiceStddevOrderBy = {
  /** Number of payroll jobs included in this invoice */
  payrollCount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  /** Total hours spent on services in this invoice */
  totalHours?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "billing_invoice" */
export type BillingInvoiceStddevPopOrderBy = {
  /** Number of payroll jobs included in this invoice */
  payrollCount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  /** Total hours spent on services in this invoice */
  totalHours?: InputMaybe<OrderBy>;
};

/** order by stddevSamp() on columns of table "billing_invoice" */
export type BillingInvoiceStddevSampOrderBy = {
  /** Number of payroll jobs included in this invoice */
  payrollCount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  /** Total hours spent on services in this invoice */
  totalHours?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "billing_invoice" */
export type BillingInvoiceStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: BillingInvoiceStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BillingInvoiceStreamCursorValueInput = {
  billingPeriodEnd?: InputMaybe<Scalars['date']['input']>;
  /** Reference to billing period this invoice covers */
  billingPeriodId?: InputMaybe<Scalars['uuid']['input']>;
  billingPeriodStart?: InputMaybe<Scalars['date']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Unique invoice number for client reference */
  invoiceNumber?: InputMaybe<Scalars['String']['input']>;
  issuedDate?: InputMaybe<Scalars['date']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Number of payroll jobs included in this invoice */
  payrollCount?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
  /** Total hours spent on services in this invoice */
  totalHours?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by sum() on columns of table "billing_invoice" */
export type BillingInvoiceSumOrderBy = {
  /** Number of payroll jobs included in this invoice */
  payrollCount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  /** Total hours spent on services in this invoice */
  totalHours?: InputMaybe<OrderBy>;
};

/** update columns of table "billing_invoice" */
export type BillingInvoiceUpdateColumn =
  /** column name */
  | 'billingPeriodEnd'
  /** column name */
  | 'billingPeriodId'
  /** column name */
  | 'billingPeriodStart'
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'currency'
  /** column name */
  | 'dueDate'
  /** column name */
  | 'id'
  /** column name */
  | 'invoiceNumber'
  /** column name */
  | 'issuedDate'
  /** column name */
  | 'notes'
  /** column name */
  | 'payrollCount'
  /** column name */
  | 'status'
  /** column name */
  | 'totalAmount'
  /** column name */
  | 'totalHours'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type BillingInvoiceUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BillingInvoiceIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingInvoiceSetInput>;
  /** filter the rows which have to be updated */
  where: BillingInvoiceBoolExp;
};

/** order by varPop() on columns of table "billing_invoice" */
export type BillingInvoiceVarPopOrderBy = {
  /** Number of payroll jobs included in this invoice */
  payrollCount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  /** Total hours spent on services in this invoice */
  totalHours?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "billing_invoice" */
export type BillingInvoiceVarSampOrderBy = {
  /** Number of payroll jobs included in this invoice */
  payrollCount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  /** Total hours spent on services in this invoice */
  totalHours?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "billing_invoice" */
export type BillingInvoiceVarianceOrderBy = {
  /** Number of payroll jobs included in this invoice */
  payrollCount?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  /** Total hours spent on services in this invoice */
  totalHours?: InputMaybe<OrderBy>;
};

export type BillingItemsAggregateBoolExp = {
  bool_and?: InputMaybe<BillingItemsAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<BillingItemsAggregateBoolExpBool_Or>;
  count?: InputMaybe<BillingItemsAggregateBoolExpCount>;
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

/** order by avg() on columns of table "billing_items" */
export type BillingItemsAvgOrderBy = {
  amount?: InputMaybe<OrderBy>;
  hourlyRate?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "billing_items". All fields are combined with a logical 'AND'. */
export type BillingItemsBoolExp = {
  _and?: InputMaybe<Array<BillingItemsBoolExp>>;
  _not?: InputMaybe<BillingItemsBoolExp>;
  _or?: InputMaybe<Array<BillingItemsBoolExp>>;
  amount?: InputMaybe<NumericComparisonExp>;
  approvalDate?: InputMaybe<TimestamptzComparisonExp>;
  approvedBy?: InputMaybe<UuidComparisonExp>;
  approvedByUser?: InputMaybe<UsersBoolExp>;
  billingPlan?: InputMaybe<BillingPlanBoolExp>;
  billingPlanByService?: InputMaybe<BillingPlanBoolExp>;
  billingPlanId?: InputMaybe<UuidComparisonExp>;
  client?: InputMaybe<ClientsBoolExp>;
  clientId?: InputMaybe<UuidComparisonExp>;
  confirmedAt?: InputMaybe<TimestamptzComparisonExp>;
  confirmedBy?: InputMaybe<UuidComparisonExp>;
  confirmedByUser?: InputMaybe<UsersBoolExp>;
  createdAt?: InputMaybe<TimestampComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  hourlyRate?: InputMaybe<NumericComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  invoiceId?: InputMaybe<UuidComparisonExp>;
  invoiceItems?: InputMaybe<BillingInvoiceItemBoolExp>;
  invoiceItemsAggregate?: InputMaybe<BillingInvoiceItemAggregateBoolExp>;
  isApproved?: InputMaybe<BooleanComparisonExp>;
  notes?: InputMaybe<StringComparisonExp>;
  payroll?: InputMaybe<PayrollsBoolExp>;
  payrollDate?: InputMaybe<PayrollDatesBoolExp>;
  payrollDateId?: InputMaybe<UuidComparisonExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  quantity?: InputMaybe<IntComparisonExp>;
  service?: InputMaybe<ServicesBoolExp>;
  serviceId?: InputMaybe<UuidComparisonExp>;
  serviceName?: InputMaybe<StringComparisonExp>;
  staffUser?: InputMaybe<UsersBoolExp>;
  staffUserId?: InputMaybe<UuidComparisonExp>;
  status?: InputMaybe<StringComparisonExp>;
  timeEntries?: InputMaybe<TimeEntriesBoolExp>;
  timeEntriesAggregate?: InputMaybe<TimeEntriesAggregateBoolExp>;
  totalAmount?: InputMaybe<NumericComparisonExp>;
  unitPrice?: InputMaybe<NumericComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "billing_items" */
export type BillingItemsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'billing_items_pkey'
  | '%future added value';

/** input type for incrementing numeric columns in table "billing_items" */
export type BillingItemsIncInput = {
  hourlyRate?: InputMaybe<Scalars['numeric']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_items" */
export type BillingItemsInsertInput = {
  approvalDate?: InputMaybe<Scalars['timestamptz']['input']>;
  approvedBy?: InputMaybe<Scalars['uuid']['input']>;
  approvedByUser?: InputMaybe<UsersObjRelInsertInput>;
  billingPlan?: InputMaybe<BillingPlanObjRelInsertInput>;
  billingPlanByService?: InputMaybe<BillingPlanObjRelInsertInput>;
  billingPlanId?: InputMaybe<Scalars['uuid']['input']>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  /** When this item was confirmed by manager */
  confirmedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Manager who confirmed this item */
  confirmedBy?: InputMaybe<Scalars['uuid']['input']>;
  confirmedByUser?: InputMaybe<UsersObjRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  hourlyRate?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  invoiceItems?: InputMaybe<BillingInvoiceItemArrRelInsertInput>;
  isApproved?: InputMaybe<Scalars['Boolean']['input']>;
  /** Additional notes about this billing item */
  notes?: InputMaybe<Scalars['String']['input']>;
  payroll?: InputMaybe<PayrollsObjRelInsertInput>;
  payrollDate?: InputMaybe<PayrollDatesObjRelInsertInput>;
  /** Links billing item to a specific payroll date/EFT cycle instead of just the overall payroll. Enables date-specific billing tracking. */
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  service?: InputMaybe<ServicesObjRelInsertInput>;
  /** Reference to the service from service catalog */
  serviceId?: InputMaybe<Scalars['uuid']['input']>;
  serviceName?: InputMaybe<Scalars['String']['input']>;
  staffUser?: InputMaybe<UsersObjRelInsertInput>;
  /** Staff member who performed the service */
  staffUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Status: draft, confirmed, billed */
  status?: InputMaybe<Scalars['String']['input']>;
  timeEntries?: InputMaybe<TimeEntriesArrRelInsertInput>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by max() on columns of table "billing_items" */
export type BillingItemsMaxOrderBy = {
  amount?: InputMaybe<OrderBy>;
  approvalDate?: InputMaybe<OrderBy>;
  approvedBy?: InputMaybe<OrderBy>;
  billingPlanId?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  /** When this item was confirmed by manager */
  confirmedAt?: InputMaybe<OrderBy>;
  /** Manager who confirmed this item */
  confirmedBy?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  hourlyRate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  /** Additional notes about this billing item */
  notes?: InputMaybe<OrderBy>;
  /** Links billing item to a specific payroll date/EFT cycle instead of just the overall payroll. Enables date-specific billing tracking. */
  payrollDateId?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  /** Reference to the service from service catalog */
  serviceId?: InputMaybe<OrderBy>;
  serviceName?: InputMaybe<OrderBy>;
  /** Staff member who performed the service */
  staffUserId?: InputMaybe<OrderBy>;
  /** Status: draft, confirmed, billed */
  status?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "billing_items" */
export type BillingItemsMinOrderBy = {
  amount?: InputMaybe<OrderBy>;
  approvalDate?: InputMaybe<OrderBy>;
  approvedBy?: InputMaybe<OrderBy>;
  billingPlanId?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  /** When this item was confirmed by manager */
  confirmedAt?: InputMaybe<OrderBy>;
  /** Manager who confirmed this item */
  confirmedBy?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  hourlyRate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  /** Additional notes about this billing item */
  notes?: InputMaybe<OrderBy>;
  /** Links billing item to a specific payroll date/EFT cycle instead of just the overall payroll. Enables date-specific billing tracking. */
  payrollDateId?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  /** Reference to the service from service catalog */
  serviceId?: InputMaybe<OrderBy>;
  serviceName?: InputMaybe<OrderBy>;
  /** Staff member who performed the service */
  staffUserId?: InputMaybe<OrderBy>;
  /** Status: draft, confirmed, billed */
  status?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** input type for inserting object relation for remote table "billing_items" */
export type BillingItemsObjRelInsertInput = {
  data: BillingItemsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<BillingItemsOnConflict>;
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
  approvalDate?: InputMaybe<OrderBy>;
  approvedBy?: InputMaybe<OrderBy>;
  approvedByUser?: InputMaybe<UsersOrderBy>;
  billingPlan?: InputMaybe<BillingPlanOrderBy>;
  billingPlanByService?: InputMaybe<BillingPlanOrderBy>;
  billingPlanId?: InputMaybe<OrderBy>;
  client?: InputMaybe<ClientsOrderBy>;
  clientId?: InputMaybe<OrderBy>;
  confirmedAt?: InputMaybe<OrderBy>;
  confirmedBy?: InputMaybe<OrderBy>;
  confirmedByUser?: InputMaybe<UsersOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  hourlyRate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  invoiceItemsAggregate?: InputMaybe<BillingInvoiceItemAggregateOrderBy>;
  isApproved?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  payroll?: InputMaybe<PayrollsOrderBy>;
  payrollDate?: InputMaybe<PayrollDatesOrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  service?: InputMaybe<ServicesOrderBy>;
  serviceId?: InputMaybe<OrderBy>;
  serviceName?: InputMaybe<OrderBy>;
  staffUser?: InputMaybe<UsersOrderBy>;
  staffUserId?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  timeEntriesAggregate?: InputMaybe<TimeEntriesAggregateOrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_items */
export type BillingItemsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_items" */
export type BillingItemsSelectColumn =
  /** column name */
  | 'amount'
  /** column name */
  | 'approvalDate'
  /** column name */
  | 'approvedBy'
  /** column name */
  | 'billingPlanId'
  /** column name */
  | 'clientId'
  /** column name */
  | 'confirmedAt'
  /** column name */
  | 'confirmedBy'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'hourlyRate'
  /** column name */
  | 'id'
  /** column name */
  | 'invoiceId'
  /** column name */
  | 'isApproved'
  /** column name */
  | 'notes'
  /** column name */
  | 'payrollDateId'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'quantity'
  /** column name */
  | 'serviceId'
  /** column name */
  | 'serviceName'
  /** column name */
  | 'staffUserId'
  /** column name */
  | 'status'
  /** column name */
  | 'totalAmount'
  /** column name */
  | 'unitPrice'
  /** column name */
  | 'updatedAt'
  | '%future added value';

/** select "billingItemsAggregateBoolExpBool_andArgumentsColumns" columns of table "billing_items" */
export type BillingItemsSelectColumnBillingItemsAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'isApproved'
  | '%future added value';

/** select "billingItemsAggregateBoolExpBool_orArgumentsColumns" columns of table "billing_items" */
export type BillingItemsSelectColumnBillingItemsAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'isApproved'
  | '%future added value';

/** input type for updating data in table "billing_items" */
export type BillingItemsSetInput = {
  approvalDate?: InputMaybe<Scalars['timestamptz']['input']>;
  approvedBy?: InputMaybe<Scalars['uuid']['input']>;
  billingPlanId?: InputMaybe<Scalars['uuid']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  /** When this item was confirmed by manager */
  confirmedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Manager who confirmed this item */
  confirmedBy?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  hourlyRate?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  isApproved?: InputMaybe<Scalars['Boolean']['input']>;
  /** Additional notes about this billing item */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Links billing item to a specific payroll date/EFT cycle instead of just the overall payroll. Enables date-specific billing tracking. */
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  /** Reference to the service from service catalog */
  serviceId?: InputMaybe<Scalars['uuid']['input']>;
  serviceName?: InputMaybe<Scalars['String']['input']>;
  /** Staff member who performed the service */
  staffUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Status: draft, confirmed, billed */
  status?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by stddev() on columns of table "billing_items" */
export type BillingItemsStddevOrderBy = {
  amount?: InputMaybe<OrderBy>;
  hourlyRate?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "billing_items" */
export type BillingItemsStddevPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  hourlyRate?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** order by stddevSamp() on columns of table "billing_items" */
export type BillingItemsStddevSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  hourlyRate?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "billing_items" */
export type BillingItemsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: BillingItemsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BillingItemsStreamCursorValueInput = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  approvalDate?: InputMaybe<Scalars['timestamptz']['input']>;
  approvedBy?: InputMaybe<Scalars['uuid']['input']>;
  billingPlanId?: InputMaybe<Scalars['uuid']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  /** When this item was confirmed by manager */
  confirmedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Manager who confirmed this item */
  confirmedBy?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  hourlyRate?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  isApproved?: InputMaybe<Scalars['Boolean']['input']>;
  /** Additional notes about this billing item */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Links billing item to a specific payroll date/EFT cycle instead of just the overall payroll. Enables date-specific billing tracking. */
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  /** Reference to the service from service catalog */
  serviceId?: InputMaybe<Scalars['uuid']['input']>;
  serviceName?: InputMaybe<Scalars['String']['input']>;
  /** Staff member who performed the service */
  staffUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Status: draft, confirmed, billed */
  status?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by sum() on columns of table "billing_items" */
export type BillingItemsSumOrderBy = {
  amount?: InputMaybe<OrderBy>;
  hourlyRate?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** update columns of table "billing_items" */
export type BillingItemsUpdateColumn =
  /** column name */
  | 'approvalDate'
  /** column name */
  | 'approvedBy'
  /** column name */
  | 'billingPlanId'
  /** column name */
  | 'clientId'
  /** column name */
  | 'confirmedAt'
  /** column name */
  | 'confirmedBy'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'hourlyRate'
  /** column name */
  | 'id'
  /** column name */
  | 'invoiceId'
  /** column name */
  | 'isApproved'
  /** column name */
  | 'notes'
  /** column name */
  | 'payrollDateId'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'quantity'
  /** column name */
  | 'serviceId'
  /** column name */
  | 'serviceName'
  /** column name */
  | 'staffUserId'
  /** column name */
  | 'status'
  /** column name */
  | 'totalAmount'
  /** column name */
  | 'unitPrice'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type BillingItemsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BillingItemsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingItemsSetInput>;
  /** filter the rows which have to be updated */
  where: BillingItemsBoolExp;
};

/** order by varPop() on columns of table "billing_items" */
export type BillingItemsVarPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  hourlyRate?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "billing_items" */
export type BillingItemsVarSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  hourlyRate?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "billing_items" */
export type BillingItemsVarianceOrderBy = {
  amount?: InputMaybe<OrderBy>;
  hourlyRate?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

export type BillingPeriodsAggregateBoolExp = {
  count?: InputMaybe<BillingPeriodsAggregateBoolExpCount>;
};

/** order by aggregate values of table "billing_periods" */
export type BillingPeriodsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BillingPeriodsMaxOrderBy>;
  min?: InputMaybe<BillingPeriodsMinOrderBy>;
};

/** input type for inserting array relation for remote table "billing_periods" */
export type BillingPeriodsArrRelInsertInput = {
  data: Array<BillingPeriodsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<BillingPeriodsOnConflict>;
};

/** Boolean expression to filter rows from the table "billing_periods". All fields are combined with a logical 'AND'. */
export type BillingPeriodsBoolExp = {
  _and?: InputMaybe<Array<BillingPeriodsBoolExp>>;
  _not?: InputMaybe<BillingPeriodsBoolExp>;
  _or?: InputMaybe<Array<BillingPeriodsBoolExp>>;
  billingInvoices?: InputMaybe<BillingInvoiceBoolExp>;
  billingInvoicesAggregate?: InputMaybe<BillingInvoiceAggregateBoolExp>;
  client?: InputMaybe<ClientsBoolExp>;
  clientId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  periodEnd?: InputMaybe<DateComparisonExp>;
  periodStart?: InputMaybe<DateComparisonExp>;
  status?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "billing_periods" */
export type BillingPeriodsConstraint =
  /** unique or primary key constraint on columns "period_end", "period_start", "client_id" */
  | 'billing_periods_client_id_period_start_period_end_key'
  /** unique or primary key constraint on columns "id" */
  | 'billing_periods_pkey'
  | '%future added value';

/** input type for inserting data into table "billing_periods" */
export type BillingPeriodsInsertInput = {
  billingInvoices?: InputMaybe<BillingInvoiceArrRelInsertInput>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  /** Client this billing period is for */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** End date of billing period */
  periodEnd?: InputMaybe<Scalars['date']['input']>;
  /** Start date of billing period */
  periodStart?: InputMaybe<Scalars['date']['input']>;
  /** Status: open, ready_to_invoice, invoiced, paid */
  status?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by max() on columns of table "billing_periods" */
export type BillingPeriodsMaxOrderBy = {
  /** Client this billing period is for */
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  /** End date of billing period */
  periodEnd?: InputMaybe<OrderBy>;
  /** Start date of billing period */
  periodStart?: InputMaybe<OrderBy>;
  /** Status: open, ready_to_invoice, invoiced, paid */
  status?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "billing_periods" */
export type BillingPeriodsMinOrderBy = {
  /** Client this billing period is for */
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  /** End date of billing period */
  periodEnd?: InputMaybe<OrderBy>;
  /** Start date of billing period */
  periodStart?: InputMaybe<OrderBy>;
  /** Status: open, ready_to_invoice, invoiced, paid */
  status?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** input type for inserting object relation for remote table "billing_periods" */
export type BillingPeriodsObjRelInsertInput = {
  data: BillingPeriodsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<BillingPeriodsOnConflict>;
};

/** on_conflict condition type for table "billing_periods" */
export type BillingPeriodsOnConflict = {
  constraint: BillingPeriodsConstraint;
  updateColumns?: Array<BillingPeriodsUpdateColumn>;
  where?: InputMaybe<BillingPeriodsBoolExp>;
};

/** Ordering options when selecting data from "billing_periods". */
export type BillingPeriodsOrderBy = {
  billingInvoicesAggregate?: InputMaybe<BillingInvoiceAggregateOrderBy>;
  client?: InputMaybe<ClientsOrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  periodEnd?: InputMaybe<OrderBy>;
  periodStart?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_periods */
export type BillingPeriodsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_periods" */
export type BillingPeriodsSelectColumn =
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'periodEnd'
  /** column name */
  | 'periodStart'
  /** column name */
  | 'status'
  /** column name */
  | 'updatedAt'
  | '%future added value';

/** input type for updating data in table "billing_periods" */
export type BillingPeriodsSetInput = {
  /** Client this billing period is for */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** End date of billing period */
  periodEnd?: InputMaybe<Scalars['date']['input']>;
  /** Start date of billing period */
  periodStart?: InputMaybe<Scalars['date']['input']>;
  /** Status: open, ready_to_invoice, invoiced, paid */
  status?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "billing_periods" */
export type BillingPeriodsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: BillingPeriodsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BillingPeriodsStreamCursorValueInput = {
  /** Client this billing period is for */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** End date of billing period */
  periodEnd?: InputMaybe<Scalars['date']['input']>;
  /** Start date of billing period */
  periodStart?: InputMaybe<Scalars['date']['input']>;
  /** Status: open, ready_to_invoice, invoiced, paid */
  status?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "billing_periods" */
export type BillingPeriodsUpdateColumn =
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'periodEnd'
  /** column name */
  | 'periodStart'
  /** column name */
  | 'status'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type BillingPeriodsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingPeriodsSetInput>;
  /** filter the rows which have to be updated */
  where: BillingPeriodsBoolExp;
};

/** Boolean expression to filter rows from the table "billing_plan". All fields are combined with a logical 'AND'. */
export type BillingPlanBoolExp = {
  _and?: InputMaybe<Array<BillingPlanBoolExp>>;
  _not?: InputMaybe<BillingPlanBoolExp>;
  _or?: InputMaybe<Array<BillingPlanBoolExp>>;
  billingItems?: InputMaybe<BillingItemsBoolExp>;
  billingItemsAggregate?: InputMaybe<BillingItemsAggregateBoolExp>;
  billingItemsByService?: InputMaybe<BillingItemsBoolExp>;
  billingItemsByServiceAggregate?: InputMaybe<BillingItemsAggregateBoolExp>;
  billingUnit?: InputMaybe<StringComparisonExp>;
  category?: InputMaybe<StringComparisonExp>;
  clientAssignments?: InputMaybe<ClientBillingAssignmentBoolExp>;
  clientAssignmentsAggregate?: InputMaybe<ClientBillingAssignmentAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  currency?: InputMaybe<StringComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isActive?: InputMaybe<BooleanComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  standardRate?: InputMaybe<NumericComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "billing_plan" */
export type BillingPlanConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'billing_plan_pkey'
  | '%future added value';

/** input type for incrementing numeric columns in table "billing_plan" */
export type BillingPlanIncInput = {
  /** Standard rate for this service */
  standardRate?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_plan" */
export type BillingPlanInsertInput = {
  billingItems?: InputMaybe<BillingItemsArrRelInsertInput>;
  billingItemsByService?: InputMaybe<BillingItemsArrRelInsertInput>;
  /** Unit of billing: Per Payroll, Per Payslip, Per Employee, Per Hour, Per State, Once Off, Per Month */
  billingUnit?: InputMaybe<Scalars['String']['input']>;
  /** Service category: Processing, Setup, Employee Management, Compliance, etc. */
  category?: InputMaybe<Scalars['String']['input']>;
  clientAssignments?: InputMaybe<ClientBillingAssignmentArrRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether this service is currently available */
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** Standard rate for this service */
  standardRate?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** input type for inserting object relation for remote table "billing_plan" */
export type BillingPlanObjRelInsertInput = {
  data: BillingPlanInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<BillingPlanOnConflict>;
};

/** on_conflict condition type for table "billing_plan" */
export type BillingPlanOnConflict = {
  constraint: BillingPlanConstraint;
  updateColumns?: Array<BillingPlanUpdateColumn>;
  where?: InputMaybe<BillingPlanBoolExp>;
};

/** Ordering options when selecting data from "billing_plan". */
export type BillingPlanOrderBy = {
  billingItemsAggregate?: InputMaybe<BillingItemsAggregateOrderBy>;
  billingItemsByServiceAggregate?: InputMaybe<BillingItemsAggregateOrderBy>;
  billingUnit?: InputMaybe<OrderBy>;
  category?: InputMaybe<OrderBy>;
  clientAssignmentsAggregate?: InputMaybe<ClientBillingAssignmentAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  standardRate?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_plan */
export type BillingPlanPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_plan" */
export type BillingPlanSelectColumn =
  /** column name */
  | 'billingUnit'
  /** column name */
  | 'category'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'currency'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'name'
  /** column name */
  | 'standardRate'
  /** column name */
  | 'updatedAt'
  | '%future added value';

/** input type for updating data in table "billing_plan" */
export type BillingPlanSetInput = {
  /** Unit of billing: Per Payroll, Per Payslip, Per Employee, Per Hour, Per State, Once Off, Per Month */
  billingUnit?: InputMaybe<Scalars['String']['input']>;
  /** Service category: Processing, Setup, Employee Management, Compliance, etc. */
  category?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether this service is currently available */
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** Standard rate for this service */
  standardRate?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "billing_plan" */
export type BillingPlanStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: BillingPlanStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BillingPlanStreamCursorValueInput = {
  /** Unit of billing: Per Payroll, Per Payslip, Per Employee, Per Hour, Per State, Once Off, Per Month */
  billingUnit?: InputMaybe<Scalars['String']['input']>;
  /** Service category: Processing, Setup, Employee Management, Compliance, etc. */
  category?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether this service is currently available */
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** Standard rate for this service */
  standardRate?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "billing_plan" */
export type BillingPlanUpdateColumn =
  /** column name */
  | 'billingUnit'
  /** column name */
  | 'category'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'currency'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'name'
  /** column name */
  | 'standardRate'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type BillingPlanUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BillingPlanIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingPlanSetInput>;
  /** filter the rows which have to be updated */
  where: BillingPlanBoolExp;
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

export type ClientBillingAssignmentAggregateBoolExp = {
  bool_and?: InputMaybe<ClientBillingAssignmentAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<ClientBillingAssignmentAggregateBoolExpBool_Or>;
  count?: InputMaybe<ClientBillingAssignmentAggregateBoolExpCount>;
};

/** order by aggregate values of table "client_billing_assignment" */
export type ClientBillingAssignmentAggregateOrderBy = {
  avg?: InputMaybe<ClientBillingAssignmentAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ClientBillingAssignmentMaxOrderBy>;
  min?: InputMaybe<ClientBillingAssignmentMinOrderBy>;
  stddev?: InputMaybe<ClientBillingAssignmentStddevOrderBy>;
  stddevPop?: InputMaybe<ClientBillingAssignmentStddevPopOrderBy>;
  stddevSamp?: InputMaybe<ClientBillingAssignmentStddevSampOrderBy>;
  sum?: InputMaybe<ClientBillingAssignmentSumOrderBy>;
  varPop?: InputMaybe<ClientBillingAssignmentVarPopOrderBy>;
  varSamp?: InputMaybe<ClientBillingAssignmentVarSampOrderBy>;
  variance?: InputMaybe<ClientBillingAssignmentVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "client_billing_assignment" */
export type ClientBillingAssignmentArrRelInsertInput = {
  data: Array<ClientBillingAssignmentInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<ClientBillingAssignmentOnConflict>;
};

/** order by avg() on columns of table "client_billing_assignment" */
export type ClientBillingAssignmentAvgOrderBy = {
  /** Client-specific rate override (null uses standard rate) */
  customRate?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "client_billing_assignment". All fields are combined with a logical 'AND'. */
export type ClientBillingAssignmentBoolExp = {
  _and?: InputMaybe<Array<ClientBillingAssignmentBoolExp>>;
  _not?: InputMaybe<ClientBillingAssignmentBoolExp>;
  _or?: InputMaybe<Array<ClientBillingAssignmentBoolExp>>;
  billingFrequency?: InputMaybe<StringComparisonExp>;
  billingPlan?: InputMaybe<BillingPlanBoolExp>;
  billingPlanId?: InputMaybe<UuidComparisonExp>;
  client?: InputMaybe<ClientsBoolExp>;
  clientId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  customRate?: InputMaybe<NumericComparisonExp>;
  effectiveDate?: InputMaybe<DateComparisonExp>;
  endDate?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isActive?: InputMaybe<BooleanComparisonExp>;
  isEnabled?: InputMaybe<BooleanComparisonExp>;
  startDate?: InputMaybe<DateComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "client_billing_assignment" */
export type ClientBillingAssignmentConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'client_billing_assignment_pkey'
  | '%future added value';

/** input type for incrementing numeric columns in table "client_billing_assignment" */
export type ClientBillingAssignmentIncInput = {
  /** Client-specific rate override (null uses standard rate) */
  customRate?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "client_billing_assignment" */
export type ClientBillingAssignmentInsertInput = {
  /** How often this service is billed: Per Job, Monthly, Quarterly, etc. */
  billingFrequency?: InputMaybe<Scalars['String']['input']>;
  billingPlan?: InputMaybe<BillingPlanObjRelInsertInput>;
  billingPlanId?: InputMaybe<Scalars['uuid']['input']>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Client-specific rate override (null uses standard rate) */
  customRate?: InputMaybe<Scalars['numeric']['input']>;
  /** When this rate agreement becomes effective */
  effectiveDate?: InputMaybe<Scalars['date']['input']>;
  endDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether this service is enabled for this client */
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['date']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by max() on columns of table "client_billing_assignment" */
export type ClientBillingAssignmentMaxOrderBy = {
  /** How often this service is billed: Per Job, Monthly, Quarterly, etc. */
  billingFrequency?: InputMaybe<OrderBy>;
  billingPlanId?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  /** Client-specific rate override (null uses standard rate) */
  customRate?: InputMaybe<OrderBy>;
  /** When this rate agreement becomes effective */
  effectiveDate?: InputMaybe<OrderBy>;
  endDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  startDate?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "client_billing_assignment" */
export type ClientBillingAssignmentMinOrderBy = {
  /** How often this service is billed: Per Job, Monthly, Quarterly, etc. */
  billingFrequency?: InputMaybe<OrderBy>;
  billingPlanId?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  /** Client-specific rate override (null uses standard rate) */
  customRate?: InputMaybe<OrderBy>;
  /** When this rate agreement becomes effective */
  effectiveDate?: InputMaybe<OrderBy>;
  endDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  startDate?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "client_billing_assignment" */
export type ClientBillingAssignmentOnConflict = {
  constraint: ClientBillingAssignmentConstraint;
  updateColumns?: Array<ClientBillingAssignmentUpdateColumn>;
  where?: InputMaybe<ClientBillingAssignmentBoolExp>;
};

/** Ordering options when selecting data from "client_billing_assignment". */
export type ClientBillingAssignmentOrderBy = {
  billingFrequency?: InputMaybe<OrderBy>;
  billingPlan?: InputMaybe<BillingPlanOrderBy>;
  billingPlanId?: InputMaybe<OrderBy>;
  client?: InputMaybe<ClientsOrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  customRate?: InputMaybe<OrderBy>;
  effectiveDate?: InputMaybe<OrderBy>;
  endDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  isEnabled?: InputMaybe<OrderBy>;
  startDate?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: client_billing_assignment */
export type ClientBillingAssignmentPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "client_billing_assignment" */
export type ClientBillingAssignmentSelectColumn =
  /** column name */
  | 'billingFrequency'
  /** column name */
  | 'billingPlanId'
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'customRate'
  /** column name */
  | 'effectiveDate'
  /** column name */
  | 'endDate'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isEnabled'
  /** column name */
  | 'startDate'
  /** column name */
  | 'updatedAt'
  | '%future added value';

/** select "clientBillingAssignmentAggregateBoolExpBool_andArgumentsColumns" columns of table "client_billing_assignment" */
export type ClientBillingAssignmentSelectColumnClientBillingAssignmentAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'isActive'
  /** column name */
  | 'isEnabled'
  | '%future added value';

/** select "clientBillingAssignmentAggregateBoolExpBool_orArgumentsColumns" columns of table "client_billing_assignment" */
export type ClientBillingAssignmentSelectColumnClientBillingAssignmentAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'isActive'
  /** column name */
  | 'isEnabled'
  | '%future added value';

/** input type for updating data in table "client_billing_assignment" */
export type ClientBillingAssignmentSetInput = {
  /** How often this service is billed: Per Job, Monthly, Quarterly, etc. */
  billingFrequency?: InputMaybe<Scalars['String']['input']>;
  billingPlanId?: InputMaybe<Scalars['uuid']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Client-specific rate override (null uses standard rate) */
  customRate?: InputMaybe<Scalars['numeric']['input']>;
  /** When this rate agreement becomes effective */
  effectiveDate?: InputMaybe<Scalars['date']['input']>;
  endDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether this service is enabled for this client */
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['date']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by stddev() on columns of table "client_billing_assignment" */
export type ClientBillingAssignmentStddevOrderBy = {
  /** Client-specific rate override (null uses standard rate) */
  customRate?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "client_billing_assignment" */
export type ClientBillingAssignmentStddevPopOrderBy = {
  /** Client-specific rate override (null uses standard rate) */
  customRate?: InputMaybe<OrderBy>;
};

/** order by stddevSamp() on columns of table "client_billing_assignment" */
export type ClientBillingAssignmentStddevSampOrderBy = {
  /** Client-specific rate override (null uses standard rate) */
  customRate?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "client_billing_assignment" */
export type ClientBillingAssignmentStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: ClientBillingAssignmentStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ClientBillingAssignmentStreamCursorValueInput = {
  /** How often this service is billed: Per Job, Monthly, Quarterly, etc. */
  billingFrequency?: InputMaybe<Scalars['String']['input']>;
  billingPlanId?: InputMaybe<Scalars['uuid']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Client-specific rate override (null uses standard rate) */
  customRate?: InputMaybe<Scalars['numeric']['input']>;
  /** When this rate agreement becomes effective */
  effectiveDate?: InputMaybe<Scalars['date']['input']>;
  endDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether this service is enabled for this client */
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['date']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by sum() on columns of table "client_billing_assignment" */
export type ClientBillingAssignmentSumOrderBy = {
  /** Client-specific rate override (null uses standard rate) */
  customRate?: InputMaybe<OrderBy>;
};

/** update columns of table "client_billing_assignment" */
export type ClientBillingAssignmentUpdateColumn =
  /** column name */
  | 'billingFrequency'
  /** column name */
  | 'billingPlanId'
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'customRate'
  /** column name */
  | 'effectiveDate'
  /** column name */
  | 'endDate'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isEnabled'
  /** column name */
  | 'startDate'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type ClientBillingAssignmentUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<ClientBillingAssignmentIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ClientBillingAssignmentSetInput>;
  /** filter the rows which have to be updated */
  where: ClientBillingAssignmentBoolExp;
};

/** order by varPop() on columns of table "client_billing_assignment" */
export type ClientBillingAssignmentVarPopOrderBy = {
  /** Client-specific rate override (null uses standard rate) */
  customRate?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "client_billing_assignment" */
export type ClientBillingAssignmentVarSampOrderBy = {
  /** Client-specific rate override (null uses standard rate) */
  customRate?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "client_billing_assignment" */
export type ClientBillingAssignmentVarianceOrderBy = {
  /** Client-specific rate override (null uses standard rate) */
  customRate?: InputMaybe<OrderBy>;
};

export type ClientExternalSystemsAggregateBoolExp = {
  count?: InputMaybe<ClientExternalSystemsAggregateBoolExpCount>;
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
  client?: InputMaybe<ClientsBoolExp>;
  clientId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  externalSystem?: InputMaybe<ExternalSystemsBoolExp>;
  id?: InputMaybe<UuidComparisonExp>;
  systemClientId?: InputMaybe<StringComparisonExp>;
  systemId?: InputMaybe<UuidComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "client_external_systems" */
export type ClientExternalSystemsConstraint =
  /** unique or primary key constraint on columns "system_id", "client_id" */
  | 'client_external_systems_client_id_system_id_key'
  /** unique or primary key constraint on columns "id" */
  | 'client_external_systems_pkey'
  | '%future added value';

/** input type for inserting data into table "client_external_systems" */
export type ClientExternalSystemsInsertInput = {
  client?: InputMaybe<ClientsObjRelInsertInput>;
  /** Reference to the client */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the mapping was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  externalSystem?: InputMaybe<ExternalSystemsObjRelInsertInput>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Client identifier in the external system */
  systemClientId?: InputMaybe<Scalars['String']['input']>;
  /** Reference to the external system */
  systemId?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the mapping was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by max() on columns of table "client_external_systems" */
export type ClientExternalSystemsMaxOrderBy = {
  /** Reference to the client */
  clientId?: InputMaybe<OrderBy>;
  /** Timestamp when the mapping was created */
  createdAt?: InputMaybe<OrderBy>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<OrderBy>;
  /** Client identifier in the external system */
  systemClientId?: InputMaybe<OrderBy>;
  /** Reference to the external system */
  systemId?: InputMaybe<OrderBy>;
  /** Timestamp when the mapping was last updated */
  updatedAt?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "client_external_systems" */
export type ClientExternalSystemsMinOrderBy = {
  /** Reference to the client */
  clientId?: InputMaybe<OrderBy>;
  /** Timestamp when the mapping was created */
  createdAt?: InputMaybe<OrderBy>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<OrderBy>;
  /** Client identifier in the external system */
  systemClientId?: InputMaybe<OrderBy>;
  /** Reference to the external system */
  systemId?: InputMaybe<OrderBy>;
  /** Timestamp when the mapping was last updated */
  updatedAt?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "client_external_systems" */
export type ClientExternalSystemsOnConflict = {
  constraint: ClientExternalSystemsConstraint;
  updateColumns?: Array<ClientExternalSystemsUpdateColumn>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};

/** Ordering options when selecting data from "client_external_systems". */
export type ClientExternalSystemsOrderBy = {
  client?: InputMaybe<ClientsOrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  externalSystem?: InputMaybe<ExternalSystemsOrderBy>;
  id?: InputMaybe<OrderBy>;
  systemClientId?: InputMaybe<OrderBy>;
  systemId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: client_external_systems */
export type ClientExternalSystemsPkColumnsInput = {
  /** Unique identifier for the client-system mapping */
  id: Scalars['uuid']['input'];
};

/** select columns of table "client_external_systems" */
export type ClientExternalSystemsSelectColumn =
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'systemClientId'
  /** column name */
  | 'systemId'
  /** column name */
  | 'updatedAt'
  | '%future added value';

/** input type for updating data in table "client_external_systems" */
export type ClientExternalSystemsSetInput = {
  /** Reference to the client */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the mapping was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Client identifier in the external system */
  systemClientId?: InputMaybe<Scalars['String']['input']>;
  /** Reference to the external system */
  systemId?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the mapping was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "client_external_systems" */
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
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Client identifier in the external system */
  systemClientId?: InputMaybe<Scalars['String']['input']>;
  /** Reference to the external system */
  systemId?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the mapping was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "client_external_systems" */
export type ClientExternalSystemsUpdateColumn =
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'systemClientId'
  /** column name */
  | 'systemId'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type ClientExternalSystemsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ClientExternalSystemsSetInput>;
  /** filter the rows which have to be updated */
  where: ClientExternalSystemsBoolExp;
};

export type ClientServiceAgreementsAggregateBoolExp = {
  bool_and?: InputMaybe<ClientServiceAgreementsAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<ClientServiceAgreementsAggregateBoolExpBool_Or>;
  count?: InputMaybe<ClientServiceAgreementsAggregateBoolExpCount>;
};

/** order by aggregate values of table "client_service_agreements" */
export type ClientServiceAgreementsAggregateOrderBy = {
  avg?: InputMaybe<ClientServiceAgreementsAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ClientServiceAgreementsMaxOrderBy>;
  min?: InputMaybe<ClientServiceAgreementsMinOrderBy>;
  stddev?: InputMaybe<ClientServiceAgreementsStddevOrderBy>;
  stddevPop?: InputMaybe<ClientServiceAgreementsStddevPopOrderBy>;
  stddevSamp?: InputMaybe<ClientServiceAgreementsStddevSampOrderBy>;
  sum?: InputMaybe<ClientServiceAgreementsSumOrderBy>;
  varPop?: InputMaybe<ClientServiceAgreementsVarPopOrderBy>;
  varSamp?: InputMaybe<ClientServiceAgreementsVarSampOrderBy>;
  variance?: InputMaybe<ClientServiceAgreementsVarianceOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type ClientServiceAgreementsAppendInput = {
  autoBillingTriggers?: InputMaybe<Scalars['jsonb']['input']>;
  serviceConfiguration?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "client_service_agreements" */
export type ClientServiceAgreementsArrRelInsertInput = {
  data: Array<ClientServiceAgreementsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<ClientServiceAgreementsOnConflict>;
};

/** order by avg() on columns of table "client_service_agreements" */
export type ClientServiceAgreementsAvgOrderBy = {
  customRate?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "client_service_agreements". All fields are combined with a logical 'AND'. */
export type ClientServiceAgreementsBoolExp = {
  _and?: InputMaybe<Array<ClientServiceAgreementsBoolExp>>;
  _not?: InputMaybe<ClientServiceAgreementsBoolExp>;
  _or?: InputMaybe<Array<ClientServiceAgreementsBoolExp>>;
  autoBillingEnabled?: InputMaybe<BooleanComparisonExp>;
  autoBillingTriggers?: InputMaybe<JsonbComparisonExp>;
  billingFrequency?: InputMaybe<StringComparisonExp>;
  client?: InputMaybe<ClientsBoolExp>;
  clientId?: InputMaybe<UuidComparisonExp>;
  contractEndDate?: InputMaybe<DateComparisonExp>;
  contractStartDate?: InputMaybe<DateComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdBy?: InputMaybe<UuidComparisonExp>;
  createdByUser?: InputMaybe<UsersBoolExp>;
  customRate?: InputMaybe<NumericComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isActive?: InputMaybe<BooleanComparisonExp>;
  isEnabled?: InputMaybe<BooleanComparisonExp>;
  service?: InputMaybe<ServicesBoolExp>;
  serviceConfiguration?: InputMaybe<JsonbComparisonExp>;
  serviceId?: InputMaybe<UuidComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "client_service_agreements" */
export type ClientServiceAgreementsConstraint =
  /** unique or primary key constraint on columns "client_id", "service_id" */
  | 'client_service_agreements_client_id_service_id_key'
  /** unique or primary key constraint on columns "id" */
  | 'client_service_agreements_pkey'
  | '%future added value';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type ClientServiceAgreementsDeleteAtPathInput = {
  autoBillingTriggers?: InputMaybe<Array<Scalars['String']['input']>>;
  serviceConfiguration?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type ClientServiceAgreementsDeleteElemInput = {
  autoBillingTriggers?: InputMaybe<Scalars['Int']['input']>;
  serviceConfiguration?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type ClientServiceAgreementsDeleteKeyInput = {
  autoBillingTriggers?: InputMaybe<Scalars['String']['input']>;
  serviceConfiguration?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "client_service_agreements" */
export type ClientServiceAgreementsIncInput = {
  customRate?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "client_service_agreements" */
export type ClientServiceAgreementsInsertInput = {
  autoBillingEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  autoBillingTriggers?: InputMaybe<Scalars['jsonb']['input']>;
  billingFrequency?: InputMaybe<Scalars['String']['input']>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  contractEndDate?: InputMaybe<Scalars['date']['input']>;
  contractStartDate?: InputMaybe<Scalars['date']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  createdByUser?: InputMaybe<UsersObjRelInsertInput>;
  customRate?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  service?: InputMaybe<ServicesObjRelInsertInput>;
  serviceConfiguration?: InputMaybe<Scalars['jsonb']['input']>;
  serviceId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by max() on columns of table "client_service_agreements" */
export type ClientServiceAgreementsMaxOrderBy = {
  billingFrequency?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  contractEndDate?: InputMaybe<OrderBy>;
  contractStartDate?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  customRate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  serviceId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "client_service_agreements" */
export type ClientServiceAgreementsMinOrderBy = {
  billingFrequency?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  contractEndDate?: InputMaybe<OrderBy>;
  contractStartDate?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  customRate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  serviceId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "client_service_agreements" */
export type ClientServiceAgreementsOnConflict = {
  constraint: ClientServiceAgreementsConstraint;
  updateColumns?: Array<ClientServiceAgreementsUpdateColumn>;
  where?: InputMaybe<ClientServiceAgreementsBoolExp>;
};

/** Ordering options when selecting data from "client_service_agreements". */
export type ClientServiceAgreementsOrderBy = {
  autoBillingEnabled?: InputMaybe<OrderBy>;
  autoBillingTriggers?: InputMaybe<OrderBy>;
  billingFrequency?: InputMaybe<OrderBy>;
  client?: InputMaybe<ClientsOrderBy>;
  clientId?: InputMaybe<OrderBy>;
  contractEndDate?: InputMaybe<OrderBy>;
  contractStartDate?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  createdByUser?: InputMaybe<UsersOrderBy>;
  customRate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  isEnabled?: InputMaybe<OrderBy>;
  service?: InputMaybe<ServicesOrderBy>;
  serviceConfiguration?: InputMaybe<OrderBy>;
  serviceId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: client_service_agreements */
export type ClientServiceAgreementsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type ClientServiceAgreementsPrependInput = {
  autoBillingTriggers?: InputMaybe<Scalars['jsonb']['input']>;
  serviceConfiguration?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "client_service_agreements" */
export type ClientServiceAgreementsSelectColumn =
  /** column name */
  | 'autoBillingEnabled'
  /** column name */
  | 'autoBillingTriggers'
  /** column name */
  | 'billingFrequency'
  /** column name */
  | 'clientId'
  /** column name */
  | 'contractEndDate'
  /** column name */
  | 'contractStartDate'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'customRate'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isEnabled'
  /** column name */
  | 'serviceConfiguration'
  /** column name */
  | 'serviceId'
  /** column name */
  | 'updatedAt'
  | '%future added value';

/** select "clientServiceAgreementsAggregateBoolExpBool_andArgumentsColumns" columns of table "client_service_agreements" */
export type ClientServiceAgreementsSelectColumnClientServiceAgreementsAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'autoBillingEnabled'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isEnabled'
  | '%future added value';

/** select "clientServiceAgreementsAggregateBoolExpBool_orArgumentsColumns" columns of table "client_service_agreements" */
export type ClientServiceAgreementsSelectColumnClientServiceAgreementsAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'autoBillingEnabled'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isEnabled'
  | '%future added value';

/** input type for updating data in table "client_service_agreements" */
export type ClientServiceAgreementsSetInput = {
  autoBillingEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  autoBillingTriggers?: InputMaybe<Scalars['jsonb']['input']>;
  billingFrequency?: InputMaybe<Scalars['String']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  contractEndDate?: InputMaybe<Scalars['date']['input']>;
  contractStartDate?: InputMaybe<Scalars['date']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  customRate?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  serviceConfiguration?: InputMaybe<Scalars['jsonb']['input']>;
  serviceId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by stddev() on columns of table "client_service_agreements" */
export type ClientServiceAgreementsStddevOrderBy = {
  customRate?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "client_service_agreements" */
export type ClientServiceAgreementsStddevPopOrderBy = {
  customRate?: InputMaybe<OrderBy>;
};

/** order by stddevSamp() on columns of table "client_service_agreements" */
export type ClientServiceAgreementsStddevSampOrderBy = {
  customRate?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "client_service_agreements" */
export type ClientServiceAgreementsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: ClientServiceAgreementsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ClientServiceAgreementsStreamCursorValueInput = {
  autoBillingEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  autoBillingTriggers?: InputMaybe<Scalars['jsonb']['input']>;
  billingFrequency?: InputMaybe<Scalars['String']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  contractEndDate?: InputMaybe<Scalars['date']['input']>;
  contractStartDate?: InputMaybe<Scalars['date']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  customRate?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  serviceConfiguration?: InputMaybe<Scalars['jsonb']['input']>;
  serviceId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by sum() on columns of table "client_service_agreements" */
export type ClientServiceAgreementsSumOrderBy = {
  customRate?: InputMaybe<OrderBy>;
};

/** update columns of table "client_service_agreements" */
export type ClientServiceAgreementsUpdateColumn =
  /** column name */
  | 'autoBillingEnabled'
  /** column name */
  | 'autoBillingTriggers'
  /** column name */
  | 'billingFrequency'
  /** column name */
  | 'clientId'
  /** column name */
  | 'contractEndDate'
  /** column name */
  | 'contractStartDate'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'customRate'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isEnabled'
  /** column name */
  | 'serviceConfiguration'
  /** column name */
  | 'serviceId'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type ClientServiceAgreementsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<ClientServiceAgreementsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<ClientServiceAgreementsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<ClientServiceAgreementsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<ClientServiceAgreementsDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<ClientServiceAgreementsIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<ClientServiceAgreementsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ClientServiceAgreementsSetInput>;
  /** filter the rows which have to be updated */
  where: ClientServiceAgreementsBoolExp;
};

/** order by varPop() on columns of table "client_service_agreements" */
export type ClientServiceAgreementsVarPopOrderBy = {
  customRate?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "client_service_agreements" */
export type ClientServiceAgreementsVarSampOrderBy = {
  customRate?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "client_service_agreements" */
export type ClientServiceAgreementsVarianceOrderBy = {
  customRate?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "client_services_with_rates". All fields are combined with a logical 'AND'. */
export type ClientServicesWithRatesBoolExp = {
  _and?: InputMaybe<Array<ClientServicesWithRatesBoolExp>>;
  _not?: InputMaybe<ClientServicesWithRatesBoolExp>;
  _or?: InputMaybe<Array<ClientServicesWithRatesBoolExp>>;
  agreementId?: InputMaybe<UuidComparisonExp>;
  billingFrequency?: InputMaybe<StringComparisonExp>;
  billingUnit?: InputMaybe<StringComparisonExp>;
  category?: InputMaybe<StringComparisonExp>;
  clientId?: InputMaybe<UuidComparisonExp>;
  clientName?: InputMaybe<StringComparisonExp>;
  customRate?: InputMaybe<NumericComparisonExp>;
  effectiveDate?: InputMaybe<DateComparisonExp>;
  effectiveRate?: InputMaybe<NumericComparisonExp>;
  isActive?: InputMaybe<BooleanComparisonExp>;
  isEnabled?: InputMaybe<BooleanComparisonExp>;
  serviceDescription?: InputMaybe<StringComparisonExp>;
  serviceId?: InputMaybe<UuidComparisonExp>;
  serviceName?: InputMaybe<StringComparisonExp>;
  standardRate?: InputMaybe<NumericComparisonExp>;
};

/** Ordering options when selecting data from "client_services_with_rates". */
export type ClientServicesWithRatesOrderBy = {
  agreementId?: InputMaybe<OrderBy>;
  billingFrequency?: InputMaybe<OrderBy>;
  billingUnit?: InputMaybe<OrderBy>;
  category?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  clientName?: InputMaybe<OrderBy>;
  customRate?: InputMaybe<OrderBy>;
  effectiveDate?: InputMaybe<OrderBy>;
  effectiveRate?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  isEnabled?: InputMaybe<OrderBy>;
  serviceDescription?: InputMaybe<OrderBy>;
  serviceId?: InputMaybe<OrderBy>;
  serviceName?: InputMaybe<OrderBy>;
  standardRate?: InputMaybe<OrderBy>;
};

/** select columns of table "client_services_with_rates" */
export type ClientServicesWithRatesSelectColumn =
  /** column name */
  | 'agreementId'
  /** column name */
  | 'billingFrequency'
  /** column name */
  | 'billingUnit'
  /** column name */
  | 'category'
  /** column name */
  | 'clientId'
  /** column name */
  | 'clientName'
  /** column name */
  | 'customRate'
  /** column name */
  | 'effectiveDate'
  /** column name */
  | 'effectiveRate'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isEnabled'
  /** column name */
  | 'serviceDescription'
  /** column name */
  | 'serviceId'
  /** column name */
  | 'serviceName'
  /** column name */
  | 'standardRate'
  | '%future added value';

/** Streaming cursor of the table "client_services_with_rates" */
export type ClientServicesWithRatesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: ClientServicesWithRatesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ClientServicesWithRatesStreamCursorValueInput = {
  agreementId?: InputMaybe<Scalars['uuid']['input']>;
  billingFrequency?: InputMaybe<Scalars['String']['input']>;
  billingUnit?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  clientName?: InputMaybe<Scalars['String']['input']>;
  customRate?: InputMaybe<Scalars['numeric']['input']>;
  effectiveDate?: InputMaybe<Scalars['date']['input']>;
  effectiveRate?: InputMaybe<Scalars['numeric']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  serviceDescription?: InputMaybe<Scalars['String']['input']>;
  serviceId?: InputMaybe<Scalars['uuid']['input']>;
  serviceName?: InputMaybe<Scalars['String']['input']>;
  standardRate?: InputMaybe<Scalars['numeric']['input']>;
};

/** Boolean expression to filter rows from the table "clients". All fields are combined with a logical 'AND'. */
export type ClientsBoolExp = {
  _and?: InputMaybe<Array<ClientsBoolExp>>;
  _not?: InputMaybe<ClientsBoolExp>;
  _or?: InputMaybe<Array<ClientsBoolExp>>;
  active?: InputMaybe<BooleanComparisonExp>;
  billingAssignments?: InputMaybe<ClientBillingAssignmentBoolExp>;
  billingAssignmentsAggregate?: InputMaybe<ClientBillingAssignmentAggregateBoolExp>;
  billingInvoices?: InputMaybe<BillingInvoiceBoolExp>;
  billingInvoicesAggregate?: InputMaybe<BillingInvoiceAggregateBoolExp>;
  billingItems?: InputMaybe<BillingItemsBoolExp>;
  billingItemsAggregate?: InputMaybe<BillingItemsAggregateBoolExp>;
  billingPeriods?: InputMaybe<BillingPeriodsBoolExp>;
  billingPeriodsAggregate?: InputMaybe<BillingPeriodsAggregateBoolExp>;
  contactEmail?: InputMaybe<StringComparisonExp>;
  contactPerson?: InputMaybe<StringComparisonExp>;
  contactPhone?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  externalSystemConnections?: InputMaybe<ClientExternalSystemsBoolExp>;
  externalSystemConnectionsAggregate?: InputMaybe<ClientExternalSystemsAggregateBoolExp>;
  files?: InputMaybe<FilesBoolExp>;
  filesAggregate?: InputMaybe<FilesAggregateBoolExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  payrolls?: InputMaybe<PayrollsBoolExp>;
  payrollsAggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  serviceAgreements?: InputMaybe<ClientServiceAgreementsBoolExp>;
  serviceAgreementsAggregate?: InputMaybe<ClientServiceAgreementsAggregateBoolExp>;
  timeEntries?: InputMaybe<TimeEntriesBoolExp>;
  timeEntriesAggregate?: InputMaybe<TimeEntriesAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "clients" */
export type ClientsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'clients_pkey'
  | '%future added value';

/** input type for inserting data into table "clients" */
export type ClientsInsertInput = {
  /** Whether the client is currently active */
  active?: InputMaybe<Scalars['Boolean']['input']>;
  billingAssignments?: InputMaybe<ClientBillingAssignmentArrRelInsertInput>;
  billingInvoices?: InputMaybe<BillingInvoiceArrRelInsertInput>;
  billingItems?: InputMaybe<BillingItemsArrRelInsertInput>;
  billingPeriods?: InputMaybe<BillingPeriodsArrRelInsertInput>;
  /** Email address for the client contact */
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  /** Primary contact person at the client */
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  /** Phone number for the client contact */
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the client was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  externalSystemConnections?: InputMaybe<ClientExternalSystemsArrRelInsertInput>;
  files?: InputMaybe<FilesArrRelInsertInput>;
  /** Unique identifier for the client */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Client company name */
  name?: InputMaybe<Scalars['String']['input']>;
  payrolls?: InputMaybe<PayrollsArrRelInsertInput>;
  serviceAgreements?: InputMaybe<ClientServiceAgreementsArrRelInsertInput>;
  timeEntries?: InputMaybe<TimeEntriesArrRelInsertInput>;
  /** Timestamp when the client was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
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
  billingAssignmentsAggregate?: InputMaybe<ClientBillingAssignmentAggregateOrderBy>;
  billingInvoicesAggregate?: InputMaybe<BillingInvoiceAggregateOrderBy>;
  billingItemsAggregate?: InputMaybe<BillingItemsAggregateOrderBy>;
  billingPeriodsAggregate?: InputMaybe<BillingPeriodsAggregateOrderBy>;
  contactEmail?: InputMaybe<OrderBy>;
  contactPerson?: InputMaybe<OrderBy>;
  contactPhone?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  externalSystemConnectionsAggregate?: InputMaybe<ClientExternalSystemsAggregateOrderBy>;
  filesAggregate?: InputMaybe<FilesAggregateOrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrollsAggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  serviceAgreementsAggregate?: InputMaybe<ClientServiceAgreementsAggregateOrderBy>;
  timeEntriesAggregate?: InputMaybe<TimeEntriesAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: clients */
export type ClientsPkColumnsInput = {
  /** Unique identifier for the client */
  id: Scalars['uuid']['input'];
};

/** select columns of table "clients" */
export type ClientsSelectColumn =
  /** column name */
  | 'active'
  /** column name */
  | 'contactEmail'
  /** column name */
  | 'contactPerson'
  /** column name */
  | 'contactPhone'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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
export type ClientsUpdateColumn =
  /** column name */
  | 'active'
  /** column name */
  | 'contactEmail'
  /** column name */
  | 'contactPerson'
  /** column name */
  | 'contactPhone'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type ClientsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ClientsSetInput>;
  /** filter the rows which have to be updated */
  where: ClientsBoolExp;
};

/** Boolean expression to filter rows from the table "consultant_capacity_overview". All fields are combined with a logical 'AND'. */
export type ConsultantCapacityOverviewBoolExp = {
  _and?: InputMaybe<Array<ConsultantCapacityOverviewBoolExp>>;
  _not?: InputMaybe<ConsultantCapacityOverviewBoolExp>;
  _or?: InputMaybe<Array<ConsultantCapacityOverviewBoolExp>>;
  adminTimeHours?: InputMaybe<NumericComparisonExp>;
  adminTimePercentageActual?: InputMaybe<NumericComparisonExp>;
  defaultAdminTimePercentage?: InputMaybe<NumericComparisonExp>;
  email?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  payrollCapacityHours?: InputMaybe<NumericComparisonExp>;
  position?: InputMaybe<UserPositionComparisonExp>;
  usesDefaultAdminTime?: InputMaybe<BooleanComparisonExp>;
  workDay?: InputMaybe<StringComparisonExp>;
  workHours?: InputMaybe<NumericComparisonExp>;
};

/** Ordering options when selecting data from "consultant_capacity_overview". */
export type ConsultantCapacityOverviewOrderBy = {
  adminTimeHours?: InputMaybe<OrderBy>;
  adminTimePercentageActual?: InputMaybe<OrderBy>;
  defaultAdminTimePercentage?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrollCapacityHours?: InputMaybe<OrderBy>;
  position?: InputMaybe<OrderBy>;
  usesDefaultAdminTime?: InputMaybe<OrderBy>;
  workDay?: InputMaybe<OrderBy>;
  workHours?: InputMaybe<OrderBy>;
};

/** select columns of table "consultant_capacity_overview" */
export type ConsultantCapacityOverviewSelectColumn =
  /** column name */
  | 'adminTimeHours'
  /** column name */
  | 'adminTimePercentageActual'
  /** column name */
  | 'defaultAdminTimePercentage'
  /** column name */
  | 'email'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'payrollCapacityHours'
  /** column name */
  | 'position'
  /** column name */
  | 'usesDefaultAdminTime'
  /** column name */
  | 'workDay'
  /** column name */
  | 'workHours'
  | '%future added value';

/** Streaming cursor of the table "consultant_capacity_overview" */
export type ConsultantCapacityOverviewStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: ConsultantCapacityOverviewStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ConsultantCapacityOverviewStreamCursorValueInput = {
  adminTimeHours?: InputMaybe<Scalars['numeric']['input']>;
  adminTimePercentageActual?: InputMaybe<Scalars['numeric']['input']>;
  defaultAdminTimePercentage?: InputMaybe<Scalars['numeric']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payrollCapacityHours?: InputMaybe<Scalars['numeric']['input']>;
  position?: InputMaybe<Scalars['user_position']['input']>;
  usesDefaultAdminTime?: InputMaybe<Scalars['Boolean']['input']>;
  workDay?: InputMaybe<Scalars['String']['input']>;
  workHours?: InputMaybe<Scalars['numeric']['input']>;
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
export type CurrentPayrollsSelectColumn =
  /** column name */
  | 'backupConsultantUserId'
  /** column name */
  | 'clientId'
  /** column name */
  | 'clientName'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'cycleId'
  /** column name */
  | 'dateTypeId'
  /** column name */
  | 'dateValue'
  /** column name */
  | 'goLiveDate'
  /** column name */
  | 'id'
  /** column name */
  | 'managerUserId'
  /** column name */
  | 'name'
  /** column name */
  | 'parentPayrollId'
  /** column name */
  | 'payrollCycleName'
  /** column name */
  | 'payrollDateTypeName'
  /** column name */
  | 'primaryConsultantUserId'
  /** column name */
  | 'supersededDate'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'versionNumber'
  /** column name */
  | 'versionReason'
  | '%future added value';

/** Streaming cursor of the table "current_payrolls" */
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

/** ordering argument of a cursor */
export type CursorOrdering =
  /** ascending ordering of the cursor */
  | 'ASC'
  /** descending ordering of the cursor */
  | 'DESC'
  | '%future added value';

export type DataBackupsAggregateBoolExp = {
  count?: InputMaybe<DataBackupsAggregateBoolExpCount>;
};

/** order by aggregate values of table "data_backups" */
export type DataBackupsAggregateOrderBy = {
  avg?: InputMaybe<DataBackupsAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<DataBackupsMaxOrderBy>;
  min?: InputMaybe<DataBackupsMinOrderBy>;
  stddev?: InputMaybe<DataBackupsStddevOrderBy>;
  stddevPop?: InputMaybe<DataBackupsStddevPopOrderBy>;
  stddevSamp?: InputMaybe<DataBackupsStddevSampOrderBy>;
  sum?: InputMaybe<DataBackupsSumOrderBy>;
  varPop?: InputMaybe<DataBackupsVarPopOrderBy>;
  varSamp?: InputMaybe<DataBackupsVarSampOrderBy>;
  variance?: InputMaybe<DataBackupsVarianceOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type DataBackupsAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "data_backups" */
export type DataBackupsArrRelInsertInput = {
  data: Array<DataBackupsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<DataBackupsOnConflict>;
};

/** order by avg() on columns of table "data_backups" */
export type DataBackupsAvgOrderBy = {
  fileSize?: InputMaybe<OrderBy>;
  retentionDays?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "data_backups". All fields are combined with a logical 'AND'. */
export type DataBackupsBoolExp = {
  _and?: InputMaybe<Array<DataBackupsBoolExp>>;
  _not?: InputMaybe<DataBackupsBoolExp>;
  _or?: InputMaybe<Array<DataBackupsBoolExp>>;
  backupType?: InputMaybe<StringComparisonExp>;
  checksum?: InputMaybe<StringComparisonExp>;
  completedAt?: InputMaybe<TimestamptzComparisonExp>;
  compressionType?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  encryptionKeyHash?: InputMaybe<StringComparisonExp>;
  errorMessage?: InputMaybe<StringComparisonExp>;
  expiresAt?: InputMaybe<TimestamptzComparisonExp>;
  fileSize?: InputMaybe<BigintComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  metadata?: InputMaybe<JsonbComparisonExp>;
  retentionDays?: InputMaybe<IntComparisonExp>;
  startedAt?: InputMaybe<TimestamptzComparisonExp>;
  status?: InputMaybe<StringComparisonExp>;
  storagePath?: InputMaybe<StringComparisonExp>;
  tablesIncluded?: InputMaybe<StringArrayComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "data_backups" */
export type DataBackupsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'data_backups_pkey'
  | '%future added value';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type DataBackupsDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type DataBackupsDeleteElemInput = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type DataBackupsDeleteKeyInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "data_backups" */
export type DataBackupsIncInput = {
  fileSize?: InputMaybe<Scalars['bigint']['input']>;
  retentionDays?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "data_backups" */
export type DataBackupsInsertInput = {
  backupType?: InputMaybe<Scalars['String']['input']>;
  checksum?: InputMaybe<Scalars['String']['input']>;
  completedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  compressionType?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  encryptionKeyHash?: InputMaybe<Scalars['String']['input']>;
  errorMessage?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  fileSize?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  retentionDays?: InputMaybe<Scalars['Int']['input']>;
  startedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  storagePath?: InputMaybe<Scalars['String']['input']>;
  tablesIncluded?: InputMaybe<Array<Scalars['String']['input']>>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** order by max() on columns of table "data_backups" */
export type DataBackupsMaxOrderBy = {
  backupType?: InputMaybe<OrderBy>;
  checksum?: InputMaybe<OrderBy>;
  completedAt?: InputMaybe<OrderBy>;
  compressionType?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  encryptionKeyHash?: InputMaybe<OrderBy>;
  errorMessage?: InputMaybe<OrderBy>;
  expiresAt?: InputMaybe<OrderBy>;
  fileSize?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  retentionDays?: InputMaybe<OrderBy>;
  startedAt?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  storagePath?: InputMaybe<OrderBy>;
  tablesIncluded?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "data_backups" */
export type DataBackupsMinOrderBy = {
  backupType?: InputMaybe<OrderBy>;
  checksum?: InputMaybe<OrderBy>;
  completedAt?: InputMaybe<OrderBy>;
  compressionType?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  encryptionKeyHash?: InputMaybe<OrderBy>;
  errorMessage?: InputMaybe<OrderBy>;
  expiresAt?: InputMaybe<OrderBy>;
  fileSize?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  retentionDays?: InputMaybe<OrderBy>;
  startedAt?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  storagePath?: InputMaybe<OrderBy>;
  tablesIncluded?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "data_backups" */
export type DataBackupsOnConflict = {
  constraint: DataBackupsConstraint;
  updateColumns?: Array<DataBackupsUpdateColumn>;
  where?: InputMaybe<DataBackupsBoolExp>;
};

/** Ordering options when selecting data from "data_backups". */
export type DataBackupsOrderBy = {
  backupType?: InputMaybe<OrderBy>;
  checksum?: InputMaybe<OrderBy>;
  completedAt?: InputMaybe<OrderBy>;
  compressionType?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  encryptionKeyHash?: InputMaybe<OrderBy>;
  errorMessage?: InputMaybe<OrderBy>;
  expiresAt?: InputMaybe<OrderBy>;
  fileSize?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  metadata?: InputMaybe<OrderBy>;
  retentionDays?: InputMaybe<OrderBy>;
  startedAt?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  storagePath?: InputMaybe<OrderBy>;
  tablesIncluded?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: data_backups */
export type DataBackupsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type DataBackupsPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "data_backups" */
export type DataBackupsSelectColumn =
  /** column name */
  | 'backupType'
  /** column name */
  | 'checksum'
  /** column name */
  | 'completedAt'
  /** column name */
  | 'compressionType'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'encryptionKeyHash'
  /** column name */
  | 'errorMessage'
  /** column name */
  | 'expiresAt'
  /** column name */
  | 'fileSize'
  /** column name */
  | 'id'
  /** column name */
  | 'metadata'
  /** column name */
  | 'retentionDays'
  /** column name */
  | 'startedAt'
  /** column name */
  | 'status'
  /** column name */
  | 'storagePath'
  /** column name */
  | 'tablesIncluded'
  /** column name */
  | 'userId'
  | '%future added value';

/** input type for updating data in table "data_backups" */
export type DataBackupsSetInput = {
  backupType?: InputMaybe<Scalars['String']['input']>;
  checksum?: InputMaybe<Scalars['String']['input']>;
  completedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  compressionType?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  encryptionKeyHash?: InputMaybe<Scalars['String']['input']>;
  errorMessage?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  fileSize?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  retentionDays?: InputMaybe<Scalars['Int']['input']>;
  startedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  storagePath?: InputMaybe<Scalars['String']['input']>;
  tablesIncluded?: InputMaybe<Array<Scalars['String']['input']>>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** order by stddev() on columns of table "data_backups" */
export type DataBackupsStddevOrderBy = {
  fileSize?: InputMaybe<OrderBy>;
  retentionDays?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "data_backups" */
export type DataBackupsStddevPopOrderBy = {
  fileSize?: InputMaybe<OrderBy>;
  retentionDays?: InputMaybe<OrderBy>;
};

/** order by stddevSamp() on columns of table "data_backups" */
export type DataBackupsStddevSampOrderBy = {
  fileSize?: InputMaybe<OrderBy>;
  retentionDays?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "data_backups" */
export type DataBackupsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: DataBackupsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type DataBackupsStreamCursorValueInput = {
  backupType?: InputMaybe<Scalars['String']['input']>;
  checksum?: InputMaybe<Scalars['String']['input']>;
  completedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  compressionType?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  encryptionKeyHash?: InputMaybe<Scalars['String']['input']>;
  errorMessage?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  fileSize?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  retentionDays?: InputMaybe<Scalars['Int']['input']>;
  startedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  storagePath?: InputMaybe<Scalars['String']['input']>;
  tablesIncluded?: InputMaybe<Array<Scalars['String']['input']>>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** order by sum() on columns of table "data_backups" */
export type DataBackupsSumOrderBy = {
  fileSize?: InputMaybe<OrderBy>;
  retentionDays?: InputMaybe<OrderBy>;
};

/** update columns of table "data_backups" */
export type DataBackupsUpdateColumn =
  /** column name */
  | 'backupType'
  /** column name */
  | 'checksum'
  /** column name */
  | 'completedAt'
  /** column name */
  | 'compressionType'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'encryptionKeyHash'
  /** column name */
  | 'errorMessage'
  /** column name */
  | 'expiresAt'
  /** column name */
  | 'fileSize'
  /** column name */
  | 'id'
  /** column name */
  | 'metadata'
  /** column name */
  | 'retentionDays'
  /** column name */
  | 'startedAt'
  /** column name */
  | 'status'
  /** column name */
  | 'storagePath'
  /** column name */
  | 'tablesIncluded'
  /** column name */
  | 'userId'
  | '%future added value';

export type DataBackupsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<DataBackupsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<DataBackupsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<DataBackupsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<DataBackupsDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<DataBackupsIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<DataBackupsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<DataBackupsSetInput>;
  /** filter the rows which have to be updated */
  where: DataBackupsBoolExp;
};

/** order by varPop() on columns of table "data_backups" */
export type DataBackupsVarPopOrderBy = {
  fileSize?: InputMaybe<OrderBy>;
  retentionDays?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "data_backups" */
export type DataBackupsVarSampOrderBy = {
  fileSize?: InputMaybe<OrderBy>;
  retentionDays?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "data_backups" */
export type DataBackupsVarianceOrderBy = {
  fileSize?: InputMaybe<OrderBy>;
  retentionDays?: InputMaybe<OrderBy>;
};

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

export type EmailDraftsAggregateBoolExp = {
  count?: InputMaybe<EmailDraftsAggregateBoolExpCount>;
};

/** order by aggregate values of table "email_drafts" */
export type EmailDraftsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<EmailDraftsMaxOrderBy>;
  min?: InputMaybe<EmailDraftsMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type EmailDraftsAppendInput = {
  businessContext?: InputMaybe<Scalars['jsonb']['input']>;
  variableValues?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "email_drafts" */
export type EmailDraftsArrRelInsertInput = {
  data: Array<EmailDraftsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<EmailDraftsOnConflict>;
};

/** Boolean expression to filter rows from the table "email_drafts". All fields are combined with a logical 'AND'. */
export type EmailDraftsBoolExp = {
  _and?: InputMaybe<Array<EmailDraftsBoolExp>>;
  _not?: InputMaybe<EmailDraftsBoolExp>;
  _or?: InputMaybe<Array<EmailDraftsBoolExp>>;
  businessContext?: InputMaybe<JsonbComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  emailTemplate?: InputMaybe<EmailTemplatesBoolExp>;
  htmlContent?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  recipientEmails?: InputMaybe<StringArrayComparisonExp>;
  scheduledFor?: InputMaybe<TimestamptzComparisonExp>;
  subject?: InputMaybe<StringComparisonExp>;
  templateId?: InputMaybe<UuidComparisonExp>;
  textContent?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
  variableValues?: InputMaybe<JsonbComparisonExp>;
};

/** unique or primary key constraints on table "email_drafts" */
export type EmailDraftsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'email_drafts_pkey'
  | '%future added value';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type EmailDraftsDeleteAtPathInput = {
  businessContext?: InputMaybe<Array<Scalars['String']['input']>>;
  variableValues?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type EmailDraftsDeleteElemInput = {
  businessContext?: InputMaybe<Scalars['Int']['input']>;
  variableValues?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type EmailDraftsDeleteKeyInput = {
  businessContext?: InputMaybe<Scalars['String']['input']>;
  variableValues?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "email_drafts" */
export type EmailDraftsInsertInput = {
  businessContext?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  emailTemplate?: InputMaybe<EmailTemplatesObjRelInsertInput>;
  htmlContent?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  recipientEmails?: InputMaybe<Array<Scalars['String']['input']>>;
  scheduledFor?: InputMaybe<Scalars['timestamptz']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  templateId?: InputMaybe<Scalars['uuid']['input']>;
  textContent?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
  variableValues?: InputMaybe<Scalars['jsonb']['input']>;
};

/** order by max() on columns of table "email_drafts" */
export type EmailDraftsMaxOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  htmlContent?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  recipientEmails?: InputMaybe<OrderBy>;
  scheduledFor?: InputMaybe<OrderBy>;
  subject?: InputMaybe<OrderBy>;
  templateId?: InputMaybe<OrderBy>;
  textContent?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "email_drafts" */
export type EmailDraftsMinOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  htmlContent?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  recipientEmails?: InputMaybe<OrderBy>;
  scheduledFor?: InputMaybe<OrderBy>;
  subject?: InputMaybe<OrderBy>;
  templateId?: InputMaybe<OrderBy>;
  textContent?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "email_drafts" */
export type EmailDraftsOnConflict = {
  constraint: EmailDraftsConstraint;
  updateColumns?: Array<EmailDraftsUpdateColumn>;
  where?: InputMaybe<EmailDraftsBoolExp>;
};

/** Ordering options when selecting data from "email_drafts". */
export type EmailDraftsOrderBy = {
  businessContext?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  emailTemplate?: InputMaybe<EmailTemplatesOrderBy>;
  htmlContent?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  recipientEmails?: InputMaybe<OrderBy>;
  scheduledFor?: InputMaybe<OrderBy>;
  subject?: InputMaybe<OrderBy>;
  templateId?: InputMaybe<OrderBy>;
  textContent?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userId?: InputMaybe<OrderBy>;
  variableValues?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: email_drafts */
export type EmailDraftsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type EmailDraftsPrependInput = {
  businessContext?: InputMaybe<Scalars['jsonb']['input']>;
  variableValues?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "email_drafts" */
export type EmailDraftsSelectColumn =
  /** column name */
  | 'businessContext'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'htmlContent'
  /** column name */
  | 'id'
  /** column name */
  | 'recipientEmails'
  /** column name */
  | 'scheduledFor'
  /** column name */
  | 'subject'
  /** column name */
  | 'templateId'
  /** column name */
  | 'textContent'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId'
  /** column name */
  | 'variableValues'
  | '%future added value';

/** input type for updating data in table "email_drafts" */
export type EmailDraftsSetInput = {
  businessContext?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  htmlContent?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  recipientEmails?: InputMaybe<Array<Scalars['String']['input']>>;
  scheduledFor?: InputMaybe<Scalars['timestamptz']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  templateId?: InputMaybe<Scalars['uuid']['input']>;
  textContent?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
  variableValues?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Streaming cursor of the table "email_drafts" */
export type EmailDraftsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: EmailDraftsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type EmailDraftsStreamCursorValueInput = {
  businessContext?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  htmlContent?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  recipientEmails?: InputMaybe<Array<Scalars['String']['input']>>;
  scheduledFor?: InputMaybe<Scalars['timestamptz']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  templateId?: InputMaybe<Scalars['uuid']['input']>;
  textContent?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
  variableValues?: InputMaybe<Scalars['jsonb']['input']>;
};

/** update columns of table "email_drafts" */
export type EmailDraftsUpdateColumn =
  /** column name */
  | 'businessContext'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'htmlContent'
  /** column name */
  | 'id'
  /** column name */
  | 'recipientEmails'
  /** column name */
  | 'scheduledFor'
  /** column name */
  | 'subject'
  /** column name */
  | 'templateId'
  /** column name */
  | 'textContent'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId'
  /** column name */
  | 'variableValues'
  | '%future added value';

export type EmailDraftsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<EmailDraftsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<EmailDraftsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<EmailDraftsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<EmailDraftsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<EmailDraftsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<EmailDraftsSetInput>;
  /** filter the rows which have to be updated */
  where: EmailDraftsBoolExp;
};

export type EmailSendLogsAggregateBoolExp = {
  count?: InputMaybe<EmailSendLogsAggregateBoolExpCount>;
};

/** order by aggregate values of table "email_send_logs" */
export type EmailSendLogsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<EmailSendLogsMaxOrderBy>;
  min?: InputMaybe<EmailSendLogsMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type EmailSendLogsAppendInput = {
  businessContext?: InputMaybe<Scalars['jsonb']['input']>;
  resendResponse?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "email_send_logs" */
export type EmailSendLogsArrRelInsertInput = {
  data: Array<EmailSendLogsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<EmailSendLogsOnConflict>;
};

/** Boolean expression to filter rows from the table "email_send_logs". All fields are combined with a logical 'AND'. */
export type EmailSendLogsBoolExp = {
  _and?: InputMaybe<Array<EmailSendLogsBoolExp>>;
  _not?: InputMaybe<EmailSendLogsBoolExp>;
  _or?: InputMaybe<Array<EmailSendLogsBoolExp>>;
  businessContext?: InputMaybe<JsonbComparisonExp>;
  clickedAt?: InputMaybe<TimestamptzComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  deliveredAt?: InputMaybe<TimestamptzComparisonExp>;
  emailTemplate?: InputMaybe<EmailTemplatesBoolExp>;
  errorMessage?: InputMaybe<StringComparisonExp>;
  htmlContent?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  openedAt?: InputMaybe<TimestamptzComparisonExp>;
  recipientEmails?: InputMaybe<StringArrayComparisonExp>;
  resendEmailId?: InputMaybe<StringComparisonExp>;
  resendResponse?: InputMaybe<JsonbComparisonExp>;
  scheduledFor?: InputMaybe<TimestamptzComparisonExp>;
  sendStatus?: InputMaybe<StringComparisonExp>;
  senderUser?: InputMaybe<UsersBoolExp>;
  senderUserId?: InputMaybe<UuidComparisonExp>;
  sentAt?: InputMaybe<TimestamptzComparisonExp>;
  subject?: InputMaybe<StringComparisonExp>;
  templateId?: InputMaybe<UuidComparisonExp>;
  textContent?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "email_send_logs" */
export type EmailSendLogsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'email_send_logs_pkey'
  | '%future added value';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type EmailSendLogsDeleteAtPathInput = {
  businessContext?: InputMaybe<Array<Scalars['String']['input']>>;
  resendResponse?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type EmailSendLogsDeleteElemInput = {
  businessContext?: InputMaybe<Scalars['Int']['input']>;
  resendResponse?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type EmailSendLogsDeleteKeyInput = {
  businessContext?: InputMaybe<Scalars['String']['input']>;
  resendResponse?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "email_send_logs" */
export type EmailSendLogsInsertInput = {
  businessContext?: InputMaybe<Scalars['jsonb']['input']>;
  clickedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deliveredAt?: InputMaybe<Scalars['timestamptz']['input']>;
  emailTemplate?: InputMaybe<EmailTemplatesObjRelInsertInput>;
  errorMessage?: InputMaybe<Scalars['String']['input']>;
  htmlContent?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  openedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  recipientEmails?: InputMaybe<Array<Scalars['String']['input']>>;
  resendEmailId?: InputMaybe<Scalars['String']['input']>;
  resendResponse?: InputMaybe<Scalars['jsonb']['input']>;
  scheduledFor?: InputMaybe<Scalars['timestamptz']['input']>;
  sendStatus?: InputMaybe<Scalars['String']['input']>;
  senderUser?: InputMaybe<UsersObjRelInsertInput>;
  senderUserId?: InputMaybe<Scalars['uuid']['input']>;
  sentAt?: InputMaybe<Scalars['timestamptz']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  templateId?: InputMaybe<Scalars['uuid']['input']>;
  textContent?: InputMaybe<Scalars['String']['input']>;
};

/** order by max() on columns of table "email_send_logs" */
export type EmailSendLogsMaxOrderBy = {
  clickedAt?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deliveredAt?: InputMaybe<OrderBy>;
  errorMessage?: InputMaybe<OrderBy>;
  htmlContent?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  openedAt?: InputMaybe<OrderBy>;
  recipientEmails?: InputMaybe<OrderBy>;
  resendEmailId?: InputMaybe<OrderBy>;
  scheduledFor?: InputMaybe<OrderBy>;
  sendStatus?: InputMaybe<OrderBy>;
  senderUserId?: InputMaybe<OrderBy>;
  sentAt?: InputMaybe<OrderBy>;
  subject?: InputMaybe<OrderBy>;
  templateId?: InputMaybe<OrderBy>;
  textContent?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "email_send_logs" */
export type EmailSendLogsMinOrderBy = {
  clickedAt?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deliveredAt?: InputMaybe<OrderBy>;
  errorMessage?: InputMaybe<OrderBy>;
  htmlContent?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  openedAt?: InputMaybe<OrderBy>;
  recipientEmails?: InputMaybe<OrderBy>;
  resendEmailId?: InputMaybe<OrderBy>;
  scheduledFor?: InputMaybe<OrderBy>;
  sendStatus?: InputMaybe<OrderBy>;
  senderUserId?: InputMaybe<OrderBy>;
  sentAt?: InputMaybe<OrderBy>;
  subject?: InputMaybe<OrderBy>;
  templateId?: InputMaybe<OrderBy>;
  textContent?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "email_send_logs" */
export type EmailSendLogsOnConflict = {
  constraint: EmailSendLogsConstraint;
  updateColumns?: Array<EmailSendLogsUpdateColumn>;
  where?: InputMaybe<EmailSendLogsBoolExp>;
};

/** Ordering options when selecting data from "email_send_logs". */
export type EmailSendLogsOrderBy = {
  businessContext?: InputMaybe<OrderBy>;
  clickedAt?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deliveredAt?: InputMaybe<OrderBy>;
  emailTemplate?: InputMaybe<EmailTemplatesOrderBy>;
  errorMessage?: InputMaybe<OrderBy>;
  htmlContent?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  openedAt?: InputMaybe<OrderBy>;
  recipientEmails?: InputMaybe<OrderBy>;
  resendEmailId?: InputMaybe<OrderBy>;
  resendResponse?: InputMaybe<OrderBy>;
  scheduledFor?: InputMaybe<OrderBy>;
  sendStatus?: InputMaybe<OrderBy>;
  senderUser?: InputMaybe<UsersOrderBy>;
  senderUserId?: InputMaybe<OrderBy>;
  sentAt?: InputMaybe<OrderBy>;
  subject?: InputMaybe<OrderBy>;
  templateId?: InputMaybe<OrderBy>;
  textContent?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: email_send_logs */
export type EmailSendLogsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type EmailSendLogsPrependInput = {
  businessContext?: InputMaybe<Scalars['jsonb']['input']>;
  resendResponse?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "email_send_logs" */
export type EmailSendLogsSelectColumn =
  /** column name */
  | 'businessContext'
  /** column name */
  | 'clickedAt'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'deliveredAt'
  /** column name */
  | 'errorMessage'
  /** column name */
  | 'htmlContent'
  /** column name */
  | 'id'
  /** column name */
  | 'openedAt'
  /** column name */
  | 'recipientEmails'
  /** column name */
  | 'resendEmailId'
  /** column name */
  | 'resendResponse'
  /** column name */
  | 'scheduledFor'
  /** column name */
  | 'sendStatus'
  /** column name */
  | 'senderUserId'
  /** column name */
  | 'sentAt'
  /** column name */
  | 'subject'
  /** column name */
  | 'templateId'
  /** column name */
  | 'textContent'
  | '%future added value';

/** input type for updating data in table "email_send_logs" */
export type EmailSendLogsSetInput = {
  businessContext?: InputMaybe<Scalars['jsonb']['input']>;
  clickedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deliveredAt?: InputMaybe<Scalars['timestamptz']['input']>;
  errorMessage?: InputMaybe<Scalars['String']['input']>;
  htmlContent?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  openedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  recipientEmails?: InputMaybe<Array<Scalars['String']['input']>>;
  resendEmailId?: InputMaybe<Scalars['String']['input']>;
  resendResponse?: InputMaybe<Scalars['jsonb']['input']>;
  scheduledFor?: InputMaybe<Scalars['timestamptz']['input']>;
  sendStatus?: InputMaybe<Scalars['String']['input']>;
  senderUserId?: InputMaybe<Scalars['uuid']['input']>;
  sentAt?: InputMaybe<Scalars['timestamptz']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  templateId?: InputMaybe<Scalars['uuid']['input']>;
  textContent?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "email_send_logs" */
export type EmailSendLogsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: EmailSendLogsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type EmailSendLogsStreamCursorValueInput = {
  businessContext?: InputMaybe<Scalars['jsonb']['input']>;
  clickedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deliveredAt?: InputMaybe<Scalars['timestamptz']['input']>;
  errorMessage?: InputMaybe<Scalars['String']['input']>;
  htmlContent?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  openedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  recipientEmails?: InputMaybe<Array<Scalars['String']['input']>>;
  resendEmailId?: InputMaybe<Scalars['String']['input']>;
  resendResponse?: InputMaybe<Scalars['jsonb']['input']>;
  scheduledFor?: InputMaybe<Scalars['timestamptz']['input']>;
  sendStatus?: InputMaybe<Scalars['String']['input']>;
  senderUserId?: InputMaybe<Scalars['uuid']['input']>;
  sentAt?: InputMaybe<Scalars['timestamptz']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  templateId?: InputMaybe<Scalars['uuid']['input']>;
  textContent?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "email_send_logs" */
export type EmailSendLogsUpdateColumn =
  /** column name */
  | 'businessContext'
  /** column name */
  | 'clickedAt'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'deliveredAt'
  /** column name */
  | 'errorMessage'
  /** column name */
  | 'htmlContent'
  /** column name */
  | 'id'
  /** column name */
  | 'openedAt'
  /** column name */
  | 'recipientEmails'
  /** column name */
  | 'resendEmailId'
  /** column name */
  | 'resendResponse'
  /** column name */
  | 'scheduledFor'
  /** column name */
  | 'sendStatus'
  /** column name */
  | 'senderUserId'
  /** column name */
  | 'sentAt'
  /** column name */
  | 'subject'
  /** column name */
  | 'templateId'
  /** column name */
  | 'textContent'
  | '%future added value';

export type EmailSendLogsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<EmailSendLogsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<EmailSendLogsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<EmailSendLogsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<EmailSendLogsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<EmailSendLogsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<EmailSendLogsSetInput>;
  /** filter the rows which have to be updated */
  where: EmailSendLogsBoolExp;
};

export type EmailTemplatesAggregateBoolExp = {
  bool_and?: InputMaybe<EmailTemplatesAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<EmailTemplatesAggregateBoolExpBool_Or>;
  count?: InputMaybe<EmailTemplatesAggregateBoolExpCount>;
};

/** order by aggregate values of table "email_templates" */
export type EmailTemplatesAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<EmailTemplatesMaxOrderBy>;
  min?: InputMaybe<EmailTemplatesMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type EmailTemplatesAppendInput = {
  availableVariables?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "email_templates" */
export type EmailTemplatesArrRelInsertInput = {
  data: Array<EmailTemplatesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<EmailTemplatesOnConflict>;
};

/** Boolean expression to filter rows from the table "email_templates". All fields are combined with a logical 'AND'. */
export type EmailTemplatesBoolExp = {
  _and?: InputMaybe<Array<EmailTemplatesBoolExp>>;
  _not?: InputMaybe<EmailTemplatesBoolExp>;
  _or?: InputMaybe<Array<EmailTemplatesBoolExp>>;
  approvedAt?: InputMaybe<TimestamptzComparisonExp>;
  approvedByUser?: InputMaybe<UsersBoolExp>;
  approvedByUserId?: InputMaybe<UuidComparisonExp>;
  availableVariables?: InputMaybe<JsonbComparisonExp>;
  category?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdByUser?: InputMaybe<UsersBoolExp>;
  createdByUserId?: InputMaybe<UuidComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  emailDrafts?: InputMaybe<EmailDraftsBoolExp>;
  emailDraftsAggregate?: InputMaybe<EmailDraftsAggregateBoolExp>;
  emailSendLogs?: InputMaybe<EmailSendLogsBoolExp>;
  emailSendLogsAggregate?: InputMaybe<EmailSendLogsAggregateBoolExp>;
  htmlContent?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isActive?: InputMaybe<BooleanComparisonExp>;
  isSystemTemplate?: InputMaybe<BooleanComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  requiresApproval?: InputMaybe<BooleanComparisonExp>;
  subjectTemplate?: InputMaybe<StringComparisonExp>;
  textContent?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  userFavorites?: InputMaybe<UserEmailTemplateFavoritesBoolExp>;
  userFavoritesAggregate?: InputMaybe<UserEmailTemplateFavoritesAggregateBoolExp>;
};

/** unique or primary key constraints on table "email_templates" */
export type EmailTemplatesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'email_templates_pkey'
  | '%future added value';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type EmailTemplatesDeleteAtPathInput = {
  availableVariables?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type EmailTemplatesDeleteElemInput = {
  availableVariables?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type EmailTemplatesDeleteKeyInput = {
  availableVariables?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "email_templates" */
export type EmailTemplatesInsertInput = {
  approvedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  approvedByUser?: InputMaybe<UsersObjRelInsertInput>;
  approvedByUserId?: InputMaybe<Scalars['uuid']['input']>;
  availableVariables?: InputMaybe<Scalars['jsonb']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdByUser?: InputMaybe<UsersObjRelInsertInput>;
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  emailDrafts?: InputMaybe<EmailDraftsArrRelInsertInput>;
  emailSendLogs?: InputMaybe<EmailSendLogsArrRelInsertInput>;
  htmlContent?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isSystemTemplate?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  requiresApproval?: InputMaybe<Scalars['Boolean']['input']>;
  subjectTemplate?: InputMaybe<Scalars['String']['input']>;
  textContent?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userFavorites?: InputMaybe<UserEmailTemplateFavoritesArrRelInsertInput>;
};

/** order by max() on columns of table "email_templates" */
export type EmailTemplatesMaxOrderBy = {
  approvedAt?: InputMaybe<OrderBy>;
  approvedByUserId?: InputMaybe<OrderBy>;
  category?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdByUserId?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  htmlContent?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  subjectTemplate?: InputMaybe<OrderBy>;
  textContent?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "email_templates" */
export type EmailTemplatesMinOrderBy = {
  approvedAt?: InputMaybe<OrderBy>;
  approvedByUserId?: InputMaybe<OrderBy>;
  category?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdByUserId?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  htmlContent?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  subjectTemplate?: InputMaybe<OrderBy>;
  textContent?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** input type for inserting object relation for remote table "email_templates" */
export type EmailTemplatesObjRelInsertInput = {
  data: EmailTemplatesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<EmailTemplatesOnConflict>;
};

/** on_conflict condition type for table "email_templates" */
export type EmailTemplatesOnConflict = {
  constraint: EmailTemplatesConstraint;
  updateColumns?: Array<EmailTemplatesUpdateColumn>;
  where?: InputMaybe<EmailTemplatesBoolExp>;
};

/** Ordering options when selecting data from "email_templates". */
export type EmailTemplatesOrderBy = {
  approvedAt?: InputMaybe<OrderBy>;
  approvedByUser?: InputMaybe<UsersOrderBy>;
  approvedByUserId?: InputMaybe<OrderBy>;
  availableVariables?: InputMaybe<OrderBy>;
  category?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdByUser?: InputMaybe<UsersOrderBy>;
  createdByUserId?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  emailDraftsAggregate?: InputMaybe<EmailDraftsAggregateOrderBy>;
  emailSendLogsAggregate?: InputMaybe<EmailSendLogsAggregateOrderBy>;
  htmlContent?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  isSystemTemplate?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  requiresApproval?: InputMaybe<OrderBy>;
  subjectTemplate?: InputMaybe<OrderBy>;
  textContent?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userFavoritesAggregate?: InputMaybe<UserEmailTemplateFavoritesAggregateOrderBy>;
};

/** primary key columns input for table: email_templates */
export type EmailTemplatesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type EmailTemplatesPrependInput = {
  availableVariables?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "email_templates" */
export type EmailTemplatesSelectColumn =
  /** column name */
  | 'approvedAt'
  /** column name */
  | 'approvedByUserId'
  /** column name */
  | 'availableVariables'
  /** column name */
  | 'category'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdByUserId'
  /** column name */
  | 'description'
  /** column name */
  | 'htmlContent'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isSystemTemplate'
  /** column name */
  | 'name'
  /** column name */
  | 'requiresApproval'
  /** column name */
  | 'subjectTemplate'
  /** column name */
  | 'textContent'
  /** column name */
  | 'updatedAt'
  | '%future added value';

/** select "emailTemplatesAggregateBoolExpBool_andArgumentsColumns" columns of table "email_templates" */
export type EmailTemplatesSelectColumnEmailTemplatesAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'isActive'
  /** column name */
  | 'isSystemTemplate'
  /** column name */
  | 'requiresApproval'
  | '%future added value';

/** select "emailTemplatesAggregateBoolExpBool_orArgumentsColumns" columns of table "email_templates" */
export type EmailTemplatesSelectColumnEmailTemplatesAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'isActive'
  /** column name */
  | 'isSystemTemplate'
  /** column name */
  | 'requiresApproval'
  | '%future added value';

/** input type for updating data in table "email_templates" */
export type EmailTemplatesSetInput = {
  approvedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  approvedByUserId?: InputMaybe<Scalars['uuid']['input']>;
  availableVariables?: InputMaybe<Scalars['jsonb']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  htmlContent?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isSystemTemplate?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  requiresApproval?: InputMaybe<Scalars['Boolean']['input']>;
  subjectTemplate?: InputMaybe<Scalars['String']['input']>;
  textContent?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "email_templates" */
export type EmailTemplatesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: EmailTemplatesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type EmailTemplatesStreamCursorValueInput = {
  approvedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  approvedByUserId?: InputMaybe<Scalars['uuid']['input']>;
  availableVariables?: InputMaybe<Scalars['jsonb']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdByUserId?: InputMaybe<Scalars['uuid']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  htmlContent?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isSystemTemplate?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  requiresApproval?: InputMaybe<Scalars['Boolean']['input']>;
  subjectTemplate?: InputMaybe<Scalars['String']['input']>;
  textContent?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "email_templates" */
export type EmailTemplatesUpdateColumn =
  /** column name */
  | 'approvedAt'
  /** column name */
  | 'approvedByUserId'
  /** column name */
  | 'availableVariables'
  /** column name */
  | 'category'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdByUserId'
  /** column name */
  | 'description'
  /** column name */
  | 'htmlContent'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isSystemTemplate'
  /** column name */
  | 'name'
  /** column name */
  | 'requiresApproval'
  /** column name */
  | 'subjectTemplate'
  /** column name */
  | 'textContent'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type EmailTemplatesUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<EmailTemplatesAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<EmailTemplatesDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<EmailTemplatesDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<EmailTemplatesDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<EmailTemplatesPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<EmailTemplatesSetInput>;
  /** filter the rows which have to be updated */
  where: EmailTemplatesBoolExp;
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
export type ExternalSystemsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'external_systems_pkey'
  | '%future added value';

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
export type ExternalSystemsSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'icon'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'url'
  | '%future added value';

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

/** Streaming cursor of the table "external_systems" */
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
export type ExternalSystemsUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'icon'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'url'
  | '%future added value';

export type ExternalSystemsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ExternalSystemsSetInput>;
  /** filter the rows which have to be updated */
  where: ExternalSystemsBoolExp;
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
export type FeatureFlagsConstraint =
  /** unique or primary key constraint on columns "feature_name" */
  | 'feature_flags_feature_name_key'
  /** unique or primary key constraint on columns "id" */
  | 'feature_flags_pkey'
  | '%future added value';

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
export type FeatureFlagsSelectColumn =
  /** column name */
  | 'allowedRoles'
  /** column name */
  | 'featureName'
  /** column name */
  | 'id'
  /** column name */
  | 'isEnabled'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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

/** Streaming cursor of the table "feature_flags" */
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
export type FeatureFlagsUpdateColumn =
  /** column name */
  | 'allowedRoles'
  /** column name */
  | 'featureName'
  /** column name */
  | 'id'
  /** column name */
  | 'isEnabled'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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

export type FilesAggregateBoolExp = {
  bool_and?: InputMaybe<FilesAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<FilesAggregateBoolExpBool_Or>;
  count?: InputMaybe<FilesAggregateBoolExpCount>;
};

/** order by aggregate values of table "files" */
export type FilesAggregateOrderBy = {
  avg?: InputMaybe<FilesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<FilesMaxOrderBy>;
  min?: InputMaybe<FilesMinOrderBy>;
  stddev?: InputMaybe<FilesStddevOrderBy>;
  stddevPop?: InputMaybe<FilesStddevPopOrderBy>;
  stddevSamp?: InputMaybe<FilesStddevSampOrderBy>;
  sum?: InputMaybe<FilesSumOrderBy>;
  varPop?: InputMaybe<FilesVarPopOrderBy>;
  varSamp?: InputMaybe<FilesVarSampOrderBy>;
  variance?: InputMaybe<FilesVarianceOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type FilesAppendInput = {
  /** Additional document metadata as JSON */
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "files" */
export type FilesArrRelInsertInput = {
  data: Array<FilesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<FilesOnConflict>;
};

/** order by avg() on columns of table "files" */
export type FilesAvgOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "files". All fields are combined with a logical 'AND'. */
export type FilesBoolExp = {
  _and?: InputMaybe<Array<FilesBoolExp>>;
  _not?: InputMaybe<FilesBoolExp>;
  _or?: InputMaybe<Array<FilesBoolExp>>;
  bucket?: InputMaybe<StringComparisonExp>;
  category?: InputMaybe<StringComparisonExp>;
  client?: InputMaybe<ClientsBoolExp>;
  clientId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  fileType?: InputMaybe<StringComparisonExp>;
  filename?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isPublic?: InputMaybe<BooleanComparisonExp>;
  metadata?: InputMaybe<JsonbComparisonExp>;
  mimetype?: InputMaybe<StringComparisonExp>;
  objectKey?: InputMaybe<StringComparisonExp>;
  payroll?: InputMaybe<PayrollsBoolExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  size?: InputMaybe<IntComparisonExp>;
  uploadedBy?: InputMaybe<UuidComparisonExp>;
  uploadedByUser?: InputMaybe<UsersBoolExp>;
  url?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "files" */
export type FilesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'files_pkey'
  | '%future added value';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type FilesDeleteAtPathInput = {
  /** Additional document metadata as JSON */
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type FilesDeleteElemInput = {
  /** Additional document metadata as JSON */
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type FilesDeleteKeyInput = {
  /** Additional document metadata as JSON */
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "files" */
export type FilesIncInput = {
  size?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "files" */
export type FilesInsertInput = {
  bucket?: InputMaybe<Scalars['String']['input']>;
  /** Document category: contract, invoice, report, timesheet, correspondence, other */
  category?: InputMaybe<Scalars['String']['input']>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  /** Links document to a specific client */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Type of file: document (MinIO) or avatar (Clerk) */
  fileType?: InputMaybe<Scalars['String']['input']>;
  filename?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether document is publicly accessible within permissions */
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  /** Additional document metadata as JSON */
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  mimetype?: InputMaybe<Scalars['String']['input']>;
  objectKey?: InputMaybe<Scalars['String']['input']>;
  payroll?: InputMaybe<PayrollsObjRelInsertInput>;
  /** Links document to a specific payroll */
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  /** User who uploaded the document */
  uploadedBy?: InputMaybe<Scalars['uuid']['input']>;
  uploadedByUser?: InputMaybe<UsersObjRelInsertInput>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** order by max() on columns of table "files" */
export type FilesMaxOrderBy = {
  bucket?: InputMaybe<OrderBy>;
  /** Document category: contract, invoice, report, timesheet, correspondence, other */
  category?: InputMaybe<OrderBy>;
  /** Links document to a specific client */
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  /** Type of file: document (MinIO) or avatar (Clerk) */
  fileType?: InputMaybe<OrderBy>;
  filename?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  mimetype?: InputMaybe<OrderBy>;
  objectKey?: InputMaybe<OrderBy>;
  /** Links document to a specific payroll */
  payrollId?: InputMaybe<OrderBy>;
  size?: InputMaybe<OrderBy>;
  /** User who uploaded the document */
  uploadedBy?: InputMaybe<OrderBy>;
  url?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "files" */
export type FilesMinOrderBy = {
  bucket?: InputMaybe<OrderBy>;
  /** Document category: contract, invoice, report, timesheet, correspondence, other */
  category?: InputMaybe<OrderBy>;
  /** Links document to a specific client */
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  /** Type of file: document (MinIO) or avatar (Clerk) */
  fileType?: InputMaybe<OrderBy>;
  filename?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  mimetype?: InputMaybe<OrderBy>;
  objectKey?: InputMaybe<OrderBy>;
  /** Links document to a specific payroll */
  payrollId?: InputMaybe<OrderBy>;
  size?: InputMaybe<OrderBy>;
  /** User who uploaded the document */
  uploadedBy?: InputMaybe<OrderBy>;
  url?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "files" */
export type FilesOnConflict = {
  constraint: FilesConstraint;
  updateColumns?: Array<FilesUpdateColumn>;
  where?: InputMaybe<FilesBoolExp>;
};

/** Ordering options when selecting data from "files". */
export type FilesOrderBy = {
  bucket?: InputMaybe<OrderBy>;
  category?: InputMaybe<OrderBy>;
  client?: InputMaybe<ClientsOrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  fileType?: InputMaybe<OrderBy>;
  filename?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isPublic?: InputMaybe<OrderBy>;
  metadata?: InputMaybe<OrderBy>;
  mimetype?: InputMaybe<OrderBy>;
  objectKey?: InputMaybe<OrderBy>;
  payroll?: InputMaybe<PayrollsOrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  size?: InputMaybe<OrderBy>;
  uploadedBy?: InputMaybe<OrderBy>;
  uploadedByUser?: InputMaybe<UsersOrderBy>;
  url?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: files */
export type FilesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type FilesPrependInput = {
  /** Additional document metadata as JSON */
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "files" */
export type FilesSelectColumn =
  /** column name */
  | 'bucket'
  /** column name */
  | 'category'
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'fileType'
  /** column name */
  | 'filename'
  /** column name */
  | 'id'
  /** column name */
  | 'isPublic'
  /** column name */
  | 'metadata'
  /** column name */
  | 'mimetype'
  /** column name */
  | 'objectKey'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'size'
  /** column name */
  | 'uploadedBy'
  /** column name */
  | 'url'
  | '%future added value';

/** select "filesAggregateBoolExpBool_andArgumentsColumns" columns of table "files" */
export type FilesSelectColumnFilesAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'isPublic'
  | '%future added value';

/** select "filesAggregateBoolExpBool_orArgumentsColumns" columns of table "files" */
export type FilesSelectColumnFilesAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'isPublic'
  | '%future added value';

/** input type for updating data in table "files" */
export type FilesSetInput = {
  bucket?: InputMaybe<Scalars['String']['input']>;
  /** Document category: contract, invoice, report, timesheet, correspondence, other */
  category?: InputMaybe<Scalars['String']['input']>;
  /** Links document to a specific client */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Type of file: document (MinIO) or avatar (Clerk) */
  fileType?: InputMaybe<Scalars['String']['input']>;
  filename?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether document is publicly accessible within permissions */
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  /** Additional document metadata as JSON */
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  mimetype?: InputMaybe<Scalars['String']['input']>;
  objectKey?: InputMaybe<Scalars['String']['input']>;
  /** Links document to a specific payroll */
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  /** User who uploaded the document */
  uploadedBy?: InputMaybe<Scalars['uuid']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** order by stddev() on columns of table "files" */
export type FilesStddevOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "files" */
export type FilesStddevPopOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** order by stddevSamp() on columns of table "files" */
export type FilesStddevSampOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "files" */
export type FilesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: FilesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type FilesStreamCursorValueInput = {
  bucket?: InputMaybe<Scalars['String']['input']>;
  /** Document category: contract, invoice, report, timesheet, correspondence, other */
  category?: InputMaybe<Scalars['String']['input']>;
  /** Links document to a specific client */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Type of file: document (MinIO) or avatar (Clerk) */
  fileType?: InputMaybe<Scalars['String']['input']>;
  filename?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether document is publicly accessible within permissions */
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  /** Additional document metadata as JSON */
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  mimetype?: InputMaybe<Scalars['String']['input']>;
  objectKey?: InputMaybe<Scalars['String']['input']>;
  /** Links document to a specific payroll */
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  /** User who uploaded the document */
  uploadedBy?: InputMaybe<Scalars['uuid']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "files" */
export type FilesSumOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** update columns of table "files" */
export type FilesUpdateColumn =
  /** column name */
  | 'bucket'
  /** column name */
  | 'category'
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'fileType'
  /** column name */
  | 'filename'
  /** column name */
  | 'id'
  /** column name */
  | 'isPublic'
  /** column name */
  | 'metadata'
  /** column name */
  | 'mimetype'
  /** column name */
  | 'objectKey'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'size'
  /** column name */
  | 'uploadedBy'
  /** column name */
  | 'url'
  | '%future added value';

export type FilesUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<FilesAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<FilesDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<FilesDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<FilesDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<FilesIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<FilesPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<FilesSetInput>;
  /** filter the rows which have to be updated */
  where: FilesBoolExp;
};

/** order by varPop() on columns of table "files" */
export type FilesVarPopOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "files" */
export type FilesVarSampOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "files" */
export type FilesVarianceOrderBy = {
  size?: InputMaybe<OrderBy>;
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
export type HolidaysConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'holidays_pkey'
  | '%future added value';

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
export type HolidaysSelectColumn =
  /** column name */
  | 'countryCode'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'date'
  /** column name */
  | 'id'
  /** column name */
  | 'isFixed'
  /** column name */
  | 'isGlobal'
  /** column name */
  | 'launchYear'
  /** column name */
  | 'localName'
  /** column name */
  | 'name'
  /** column name */
  | 'region'
  /** column name */
  | 'types'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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

/** update columns of table "holidays" */
export type HolidaysUpdateColumn =
  /** column name */
  | 'countryCode'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'date'
  /** column name */
  | 'id'
  /** column name */
  | 'isFixed'
  /** column name */
  | 'isGlobal'
  /** column name */
  | 'launchYear'
  /** column name */
  | 'localName'
  /** column name */
  | 'name'
  /** column name */
  | 'region'
  /** column name */
  | 'types'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type HolidaysUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<HolidaysIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<HolidaysSetInput>;
  /** filter the rows which have to be updated */
  where: HolidaysBoolExp;
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

/** Boolean expression to compare columns of type "invitation_status_enum". All fields are combined with logical 'AND'. */
export type InvitationStatusEnumComparisonExp = {
  _eq?: InputMaybe<Scalars['invitation_status_enum']['input']>;
  _gt?: InputMaybe<Scalars['invitation_status_enum']['input']>;
  _gte?: InputMaybe<Scalars['invitation_status_enum']['input']>;
  _in?: InputMaybe<Array<Scalars['invitation_status_enum']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['invitation_status_enum']['input']>;
  _lte?: InputMaybe<Scalars['invitation_status_enum']['input']>;
  _neq?: InputMaybe<Scalars['invitation_status_enum']['input']>;
  _nin?: InputMaybe<Array<Scalars['invitation_status_enum']['input']>>;
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
export type LatestPayrollVersionResultsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'latest_payroll_version_results_pkey'
  | '%future added value';

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
export type LatestPayrollVersionResultsSelectColumn =
  /** column name */
  | 'active'
  /** column name */
  | 'goLiveDate'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'queriedAt'
  /** column name */
  | 'versionNumber'
  | '%future added value';

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

/** Streaming cursor of the table "latest_payroll_version_results" */
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

/** update columns of table "latest_payroll_version_results" */
export type LatestPayrollVersionResultsUpdateColumn =
  /** column name */
  | 'active'
  /** column name */
  | 'goLiveDate'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'queriedAt'
  /** column name */
  | 'versionNumber'
  | '%future added value';

export type LatestPayrollVersionResultsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<LatestPayrollVersionResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<LatestPayrollVersionResultsSetInput>;
  /** filter the rows which have to be updated */
  where: LatestPayrollVersionResultsBoolExp;
};

export type LeaveAggregateBoolExp = {
  count?: InputMaybe<LeaveAggregateBoolExpCount>;
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
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  employee?: InputMaybe<UsersBoolExp>;
  endDate?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  leaveType?: InputMaybe<StringComparisonExp>;
  reason?: InputMaybe<StringComparisonExp>;
  startDate?: InputMaybe<DateComparisonExp>;
  status?: InputMaybe<LeaveStatusEnumComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "leave" */
export type LeaveConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'leave_pkey'
  | '%future added value';

/** input type for inserting data into table "leave" */
export type LeaveInsertInput = {
  /** Timestamp when the leave request was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  employee?: InputMaybe<UsersObjRelInsertInput>;
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
  /** Timestamp when the leave request was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Reference to the user taking leave */
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** order by max() on columns of table "leave" */
export type LeaveMaxOrderBy = {
  /** Timestamp when the leave request was created */
  createdAt?: InputMaybe<OrderBy>;
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
  /** Timestamp when the leave request was last updated */
  updatedAt?: InputMaybe<OrderBy>;
  /** Reference to the user taking leave */
  userId?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "leave" */
export type LeaveMinOrderBy = {
  /** Timestamp when the leave request was created */
  createdAt?: InputMaybe<OrderBy>;
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
  /** Timestamp when the leave request was last updated */
  updatedAt?: InputMaybe<OrderBy>;
  /** Reference to the user taking leave */
  userId?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "leave" */
export type LeaveOnConflict = {
  constraint: LeaveConstraint;
  updateColumns?: Array<LeaveUpdateColumn>;
  where?: InputMaybe<LeaveBoolExp>;
};

/** Ordering options when selecting data from "leave". */
export type LeaveOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  employee?: InputMaybe<UsersOrderBy>;
  endDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  leaveType?: InputMaybe<OrderBy>;
  reason?: InputMaybe<OrderBy>;
  startDate?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: leave */
export type LeavePkColumnsInput = {
  /** Unique identifier for the leave record */
  id: Scalars['uuid']['input'];
};

/** select columns of table "leave" */
export type LeaveSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'endDate'
  /** column name */
  | 'id'
  /** column name */
  | 'leaveType'
  /** column name */
  | 'reason'
  /** column name */
  | 'startDate'
  /** column name */
  | 'status'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId'
  | '%future added value';

/** input type for updating data in table "leave" */
export type LeaveSetInput = {
  /** Timestamp when the leave request was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
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
  /** Timestamp when the leave request was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Reference to the user taking leave */
  userId?: InputMaybe<Scalars['uuid']['input']>;
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

/** Streaming cursor of the table "leave" */
export type LeaveStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: LeaveStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type LeaveStreamCursorValueInput = {
  /** Timestamp when the leave request was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
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
  /** Timestamp when the leave request was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Reference to the user taking leave */
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "leave" */
export type LeaveUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'endDate'
  /** column name */
  | 'id'
  /** column name */
  | 'leaveType'
  /** column name */
  | 'reason'
  /** column name */
  | 'startDate'
  /** column name */
  | 'status'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId'
  | '%future added value';

export type LeaveUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<LeaveSetInput>;
  /** filter the rows which have to be updated */
  where: LeaveBoolExp;
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

export type NotesAggregateBoolExp = {
  bool_and?: InputMaybe<NotesAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<NotesAggregateBoolExpBool_Or>;
  count?: InputMaybe<NotesAggregateBoolExpCount>;
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
  author?: InputMaybe<UsersBoolExp>;
  content?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestampComparisonExp>;
  entityId?: InputMaybe<UuidComparisonExp>;
  entityType?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isImportant?: InputMaybe<BooleanComparisonExp>;
  updatedAt?: InputMaybe<TimestampComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "notes" */
export type NotesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'notes_pkey'
  | '%future added value';

/** input type for inserting data into table "notes" */
export type NotesInsertInput = {
  author?: InputMaybe<UsersObjRelInsertInput>;
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

/** on_conflict condition type for table "notes" */
export type NotesOnConflict = {
  constraint: NotesConstraint;
  updateColumns?: Array<NotesUpdateColumn>;
  where?: InputMaybe<NotesBoolExp>;
};

/** Ordering options when selecting data from "notes". */
export type NotesOrderBy = {
  author?: InputMaybe<UsersOrderBy>;
  content?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  entityId?: InputMaybe<OrderBy>;
  entityType?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isImportant?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: notes */
export type NotesPkColumnsInput = {
  /** Unique identifier for the note */
  id: Scalars['uuid']['input'];
};

/** select columns of table "notes" */
export type NotesSelectColumn =
  /** column name */
  | 'content'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'entityId'
  /** column name */
  | 'entityType'
  /** column name */
  | 'id'
  /** column name */
  | 'isImportant'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId'
  | '%future added value';

/** select "notesAggregateBoolExpBool_andArgumentsColumns" columns of table "notes" */
export type NotesSelectColumnNotesAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'isImportant'
  | '%future added value';

/** select "notesAggregateBoolExpBool_orArgumentsColumns" columns of table "notes" */
export type NotesSelectColumnNotesAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'isImportant'
  | '%future added value';

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
export type NotesUpdateColumn =
  /** column name */
  | 'content'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'entityId'
  /** column name */
  | 'entityType'
  /** column name */
  | 'id'
  /** column name */
  | 'isImportant'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId'
  | '%future added value';

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
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
};

/** column ordering options */
export type OrderBy =
  /** in ascending order, nulls last */
  | 'ASC'
  /** in ascending order, nulls first */
  | 'ASC_NULLS_FIRST'
  /** in ascending order, nulls last */
  | 'ASC_NULLS_LAST'
  /** in descending order, nulls first */
  | 'DESC'
  /** in descending order, nulls first */
  | 'DESC_NULLS_FIRST'
  /** in descending order, nulls last */
  | 'DESC_NULLS_LAST'
  | '%future added value';

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
export type PayrollActivationResultsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'payroll_activation_results_pkey'
  | '%future added value';

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
export type PayrollActivationResultsSelectColumn =
  /** column name */
  | 'actionTaken'
  /** column name */
  | 'executedAt'
  /** column name */
  | 'id'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'versionNumber'
  | '%future added value';

/** input type for updating data in table "payroll_activation_results" */
export type PayrollActivationResultsSetInput = {
  actionTaken?: InputMaybe<Scalars['String']['input']>;
  executedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** Streaming cursor of the table "payroll_activation_results" */
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

/** update columns of table "payroll_activation_results" */
export type PayrollActivationResultsUpdateColumn =
  /** column name */
  | 'actionTaken'
  /** column name */
  | 'executedAt'
  /** column name */
  | 'id'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'versionNumber'
  | '%future added value';

export type PayrollActivationResultsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<PayrollActivationResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollActivationResultsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollActivationResultsBoolExp;
};

export type PayrollAssignmentAuditAggregateBoolExp = {
  count?: InputMaybe<PayrollAssignmentAuditAggregateBoolExpCount>;
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
  onConflict?: InputMaybe<PayrollAssignmentAuditOnConflict>;
};

/** Boolean expression to filter rows from the table "payroll_assignment_audit". All fields are combined with a logical 'AND'. */
export type PayrollAssignmentAuditBoolExp = {
  _and?: InputMaybe<Array<PayrollAssignmentAuditBoolExp>>;
  _not?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  _or?: InputMaybe<Array<PayrollAssignmentAuditBoolExp>>;
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
export type PayrollAssignmentAuditConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'payroll_assignment_audit_pkey'
  | '%future added value';

/** input type for inserting data into table "payroll_assignment_audit" */
export type PayrollAssignmentAuditInsertInput = {
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

/** order by max() on columns of table "payroll_assignment_audit" */
export type PayrollAssignmentAuditMaxOrderBy = {
  assignmentId?: InputMaybe<OrderBy>;
  changeReason?: InputMaybe<OrderBy>;
  changedBy?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  fromConsultantId?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  toConsultantId?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "payroll_assignment_audit" */
export type PayrollAssignmentAuditMinOrderBy = {
  assignmentId?: InputMaybe<OrderBy>;
  changeReason?: InputMaybe<OrderBy>;
  changedBy?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  fromConsultantId?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  toConsultantId?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "payroll_assignment_audit" */
export type PayrollAssignmentAuditOnConflict = {
  constraint: PayrollAssignmentAuditConstraint;
  updateColumns?: Array<PayrollAssignmentAuditUpdateColumn>;
  where?: InputMaybe<PayrollAssignmentAuditBoolExp>;
};

/** Ordering options when selecting data from "payroll_assignment_audit". */
export type PayrollAssignmentAuditOrderBy = {
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
export type PayrollAssignmentAuditPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_assignment_audit" */
export type PayrollAssignmentAuditSelectColumn =
  /** column name */
  | 'assignmentId'
  /** column name */
  | 'changeReason'
  /** column name */
  | 'changedBy'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'fromConsultantId'
  /** column name */
  | 'id'
  /** column name */
  | 'payrollDateId'
  /** column name */
  | 'toConsultantId'
  | '%future added value';

/** input type for updating data in table "payroll_assignment_audit" */
export type PayrollAssignmentAuditSetInput = {
  assignmentId?: InputMaybe<Scalars['uuid']['input']>;
  changeReason?: InputMaybe<Scalars['String']['input']>;
  changedBy?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  fromConsultantId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  toConsultantId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "payroll_assignment_audit" */
export type PayrollAssignmentAuditStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PayrollAssignmentAuditStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollAssignmentAuditStreamCursorValueInput = {
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
export type PayrollAssignmentAuditUpdateColumn =
  /** column name */
  | 'assignmentId'
  /** column name */
  | 'changeReason'
  /** column name */
  | 'changedBy'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'fromConsultantId'
  /** column name */
  | 'id'
  /** column name */
  | 'payrollDateId'
  /** column name */
  | 'toConsultantId'
  | '%future added value';

export type PayrollAssignmentAuditUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollAssignmentAuditSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollAssignmentAuditBoolExp;
};

export type PayrollAssignmentsAggregateBoolExp = {
  bool_and?: InputMaybe<PayrollAssignmentsAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<PayrollAssignmentsAggregateBoolExpBool_Or>;
  count?: InputMaybe<PayrollAssignmentsAggregateBoolExpCount>;
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
  assignedDate?: InputMaybe<TimestamptzComparisonExp>;
  auditTrail?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  auditTrailAggregate?: InputMaybe<PayrollAssignmentAuditAggregateBoolExp>;
  consultant?: InputMaybe<UsersBoolExp>;
  consultantId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isBackup?: InputMaybe<BooleanComparisonExp>;
  originalConsultant?: InputMaybe<UsersBoolExp>;
  originalConsultantId?: InputMaybe<UuidComparisonExp>;
  payrollDate?: InputMaybe<PayrollDatesBoolExp>;
  payrollDateId?: InputMaybe<UuidComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "payroll_assignments" */
export type PayrollAssignmentsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'payroll_assignments_pkey'
  /** unique or primary key constraint on columns "payroll_date_id" */
  | 'uq_payroll_assignment_payroll_date'
  | '%future added value';

/** input type for inserting data into table "payroll_assignments" */
export type PayrollAssignmentsInsertInput = {
  assignedBy?: InputMaybe<Scalars['uuid']['input']>;
  assignedByUser?: InputMaybe<UsersObjRelInsertInput>;
  assignedDate?: InputMaybe<Scalars['timestamptz']['input']>;
  auditTrail?: InputMaybe<PayrollAssignmentAuditArrRelInsertInput>;
  consultant?: InputMaybe<UsersObjRelInsertInput>;
  consultantId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isBackup?: InputMaybe<Scalars['Boolean']['input']>;
  originalConsultant?: InputMaybe<UsersObjRelInsertInput>;
  originalConsultantId?: InputMaybe<Scalars['uuid']['input']>;
  payrollDate?: InputMaybe<PayrollDatesObjRelInsertInput>;
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
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
  assignedDate?: InputMaybe<OrderBy>;
  auditTrailAggregate?: InputMaybe<PayrollAssignmentAuditAggregateOrderBy>;
  consultant?: InputMaybe<UsersOrderBy>;
  consultantId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isBackup?: InputMaybe<OrderBy>;
  originalConsultant?: InputMaybe<UsersOrderBy>;
  originalConsultantId?: InputMaybe<OrderBy>;
  payrollDate?: InputMaybe<PayrollDatesOrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_assignments */
export type PayrollAssignmentsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_assignments" */
export type PayrollAssignmentsSelectColumn =
  /** column name */
  | 'assignedBy'
  /** column name */
  | 'assignedDate'
  /** column name */
  | 'consultantId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'isBackup'
  /** column name */
  | 'originalConsultantId'
  /** column name */
  | 'payrollDateId'
  /** column name */
  | 'updatedAt'
  | '%future added value';

/** select "payrollAssignmentsAggregateBoolExpBool_andArgumentsColumns" columns of table "payroll_assignments" */
export type PayrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'isBackup'
  | '%future added value';

/** select "payrollAssignmentsAggregateBoolExpBool_orArgumentsColumns" columns of table "payroll_assignments" */
export type PayrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'isBackup'
  | '%future added value';

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

/** Streaming cursor of the table "payroll_assignments" */
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
export type PayrollAssignmentsUpdateColumn =
  /** column name */
  | 'assignedBy'
  /** column name */
  | 'assignedDate'
  /** column name */
  | 'consultantId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'isBackup'
  /** column name */
  | 'originalConsultantId'
  /** column name */
  | 'payrollDateId'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _lte?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _neq?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  _nin?: InputMaybe<Array<Scalars['payroll_cycle_type']['input']>>;
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
export type PayrollCyclesConstraint =
  /** unique or primary key constraint on columns "name" */
  | 'payroll_cycles_name_key'
  /** unique or primary key constraint on columns "id" */
  | 'payroll_cycles_pkey'
  | '%future added value';

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
export type PayrollCyclesSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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

/** Streaming cursor of the table "payroll_cycles" */
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
export type PayrollCyclesUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type PayrollCyclesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollCyclesSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollCyclesBoolExp;
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
export type PayrollDashboardStatsSelectColumn =
  /** column name */
  | 'backupConsultantUserId'
  /** column name */
  | 'clientName'
  /** column name */
  | 'cycleName'
  /** column name */
  | 'futureDates'
  /** column name */
  | 'id'
  /** column name */
  | 'managerUserId'
  /** column name */
  | 'name'
  /** column name */
  | 'nextEftDate'
  /** column name */
  | 'pastDates'
  /** column name */
  | 'primaryConsultantUserId'
  /** column name */
  | 'status'
  /** column name */
  | 'totalDates'
  | '%future added value';

/** Streaming cursor of the table "payroll_dashboard_stats" */
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
export type PayrollDateTypesConstraint =
  /** unique or primary key constraint on columns "name" */
  | 'payroll_date_types_name_key'
  /** unique or primary key constraint on columns "id" */
  | 'payroll_date_types_pkey'
  | '%future added value';

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
export type PayrollDateTypesSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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

/** Streaming cursor of the table "payroll_date_types" */
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
export type PayrollDateTypesUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type PayrollDateTypesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollDateTypesSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollDateTypesBoolExp;
};

export type PayrollDatesAggregateBoolExp = {
  count?: InputMaybe<PayrollDatesAggregateBoolExpCount>;
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
  assignmentDetails?: InputMaybe<PayrollAssignmentsBoolExp>;
  billingItems?: InputMaybe<BillingItemsBoolExp>;
  billingItemsAggregate?: InputMaybe<BillingItemsAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  notes?: InputMaybe<StringComparisonExp>;
  originalEftDate?: InputMaybe<DateComparisonExp>;
  payroll?: InputMaybe<PayrollsBoolExp>;
  payrollAssignments?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  payrollAssignmentsAggregate?: InputMaybe<PayrollAssignmentAuditAggregateBoolExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  processingDate?: InputMaybe<DateComparisonExp>;
  timeEntries?: InputMaybe<TimeEntriesBoolExp>;
  timeEntriesAggregate?: InputMaybe<TimeEntriesAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "payroll_dates" */
export type PayrollDatesConstraint =
  /** unique or primary key constraint on columns "payroll_id", "original_eft_date" */
  | 'idx_unique_payroll_date'
  /** unique or primary key constraint on columns "id" */
  | 'payroll_dates_pkey'
  | '%future added value';

/** input type for inserting data into table "payroll_dates" */
export type PayrollDatesInsertInput = {
  /** Final EFT date after holiday and weekend adjustments */
  adjustedEftDate?: InputMaybe<Scalars['date']['input']>;
  assignmentDetails?: InputMaybe<PayrollAssignmentsObjRelInsertInput>;
  billingItems?: InputMaybe<BillingItemsArrRelInsertInput>;
  /** Timestamp when the date record was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Originally calculated EFT date before adjustments */
  originalEftDate?: InputMaybe<Scalars['date']['input']>;
  payroll?: InputMaybe<PayrollsObjRelInsertInput>;
  payrollAssignments?: InputMaybe<PayrollAssignmentAuditArrRelInsertInput>;
  /** Reference to the payroll this date belongs to */
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  /** Date when payroll processing must be completed */
  processingDate?: InputMaybe<Scalars['date']['input']>;
  timeEntries?: InputMaybe<TimeEntriesArrRelInsertInput>;
  /** Timestamp when the date record was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
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
  assignmentDetails?: InputMaybe<PayrollAssignmentsOrderBy>;
  billingItemsAggregate?: InputMaybe<BillingItemsAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  originalEftDate?: InputMaybe<OrderBy>;
  payroll?: InputMaybe<PayrollsOrderBy>;
  payrollAssignmentsAggregate?: InputMaybe<PayrollAssignmentAuditAggregateOrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  processingDate?: InputMaybe<OrderBy>;
  timeEntriesAggregate?: InputMaybe<TimeEntriesAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_dates */
export type PayrollDatesPkColumnsInput = {
  /** Unique identifier for the payroll date */
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_dates" */
export type PayrollDatesSelectColumn =
  /** column name */
  | 'adjustedEftDate'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'notes'
  /** column name */
  | 'originalEftDate'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'processingDate'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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

/** Streaming cursor of the table "payroll_dates" */
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
export type PayrollDatesUpdateColumn =
  /** column name */
  | 'adjustedEftDate'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'notes'
  /** column name */
  | 'originalEftDate'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'processingDate'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type PayrollDatesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollDatesSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollDatesBoolExp;
};

/** Boolean expression to filter rows from the table "payroll_profitability". All fields are combined with a logical 'AND'. */
export type PayrollProfitabilityBoolExp = {
  _and?: InputMaybe<Array<PayrollProfitabilityBoolExp>>;
  _not?: InputMaybe<PayrollProfitabilityBoolExp>;
  _or?: InputMaybe<Array<PayrollProfitabilityBoolExp>>;
  billingItemsCount?: InputMaybe<BigintComparisonExp>;
  billingStatus?: InputMaybe<StringComparisonExp>;
  clientId?: InputMaybe<UuidComparisonExp>;
  clientName?: InputMaybe<StringComparisonExp>;
  employeeCount?: InputMaybe<IntComparisonExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  payrollName?: InputMaybe<StringComparisonExp>;
  payslipCount?: InputMaybe<IntComparisonExp>;
  revenuePerHour?: InputMaybe<NumericComparisonExp>;
  timeEntriesCount?: InputMaybe<BigintComparisonExp>;
  totalHours?: InputMaybe<NumericComparisonExp>;
  totalRevenue?: InputMaybe<NumericComparisonExp>;
};

/** Ordering options when selecting data from "payroll_profitability". */
export type PayrollProfitabilityOrderBy = {
  billingItemsCount?: InputMaybe<OrderBy>;
  billingStatus?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  clientName?: InputMaybe<OrderBy>;
  employeeCount?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  payrollName?: InputMaybe<OrderBy>;
  payslipCount?: InputMaybe<OrderBy>;
  revenuePerHour?: InputMaybe<OrderBy>;
  timeEntriesCount?: InputMaybe<OrderBy>;
  totalHours?: InputMaybe<OrderBy>;
  totalRevenue?: InputMaybe<OrderBy>;
};

/** select columns of table "payroll_profitability" */
export type PayrollProfitabilitySelectColumn =
  /** column name */
  | 'billingItemsCount'
  /** column name */
  | 'billingStatus'
  /** column name */
  | 'clientId'
  /** column name */
  | 'clientName'
  /** column name */
  | 'employeeCount'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'payrollName'
  /** column name */
  | 'payslipCount'
  /** column name */
  | 'revenuePerHour'
  /** column name */
  | 'timeEntriesCount'
  /** column name */
  | 'totalHours'
  /** column name */
  | 'totalRevenue'
  | '%future added value';

/** Streaming cursor of the table "payroll_profitability" */
export type PayrollProfitabilityStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PayrollProfitabilityStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollProfitabilityStreamCursorValueInput = {
  billingItemsCount?: InputMaybe<Scalars['bigint']['input']>;
  billingStatus?: InputMaybe<Scalars['String']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  clientName?: InputMaybe<Scalars['String']['input']>;
  employeeCount?: InputMaybe<Scalars['Int']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  payrollName?: InputMaybe<Scalars['String']['input']>;
  payslipCount?: InputMaybe<Scalars['Int']['input']>;
  revenuePerHour?: InputMaybe<Scalars['numeric']['input']>;
  timeEntriesCount?: InputMaybe<Scalars['bigint']['input']>;
  totalHours?: InputMaybe<Scalars['numeric']['input']>;
  totalRevenue?: InputMaybe<Scalars['numeric']['input']>;
};

export type PayrollRequiredSkillsAggregateBoolExp = {
  count?: InputMaybe<PayrollRequiredSkillsAggregateBoolExpCount>;
};

/** order by aggregate values of table "payroll_required_skills" */
export type PayrollRequiredSkillsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<PayrollRequiredSkillsMaxOrderBy>;
  min?: InputMaybe<PayrollRequiredSkillsMinOrderBy>;
};

/** input type for inserting array relation for remote table "payroll_required_skills" */
export type PayrollRequiredSkillsArrRelInsertInput = {
  data: Array<PayrollRequiredSkillsInsertInput>;
};

/** Boolean expression to filter rows from the table "payroll_required_skills". All fields are combined with a logical 'AND'. */
export type PayrollRequiredSkillsBoolExp = {
  _and?: InputMaybe<Array<PayrollRequiredSkillsBoolExp>>;
  _not?: InputMaybe<PayrollRequiredSkillsBoolExp>;
  _or?: InputMaybe<Array<PayrollRequiredSkillsBoolExp>>;
  payroll?: InputMaybe<PayrollsBoolExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  requiredLevel?: InputMaybe<StringComparisonExp>;
  skillName?: InputMaybe<StringComparisonExp>;
};

/** input type for inserting data into table "payroll_required_skills" */
export type PayrollRequiredSkillsInsertInput = {
  payroll?: InputMaybe<PayrollsObjRelInsertInput>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  requiredLevel?: InputMaybe<Scalars['String']['input']>;
  skillName?: InputMaybe<Scalars['String']['input']>;
};

/** order by max() on columns of table "payroll_required_skills" */
export type PayrollRequiredSkillsMaxOrderBy = {
  payrollId?: InputMaybe<OrderBy>;
  requiredLevel?: InputMaybe<OrderBy>;
  skillName?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "payroll_required_skills" */
export type PayrollRequiredSkillsMinOrderBy = {
  payrollId?: InputMaybe<OrderBy>;
  requiredLevel?: InputMaybe<OrderBy>;
  skillName?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "payroll_required_skills". */
export type PayrollRequiredSkillsOrderBy = {
  payroll?: InputMaybe<PayrollsOrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  requiredLevel?: InputMaybe<OrderBy>;
  skillName?: InputMaybe<OrderBy>;
};

/** select columns of table "payroll_required_skills" */
export type PayrollRequiredSkillsSelectColumn =
  /** column name */
  | 'payrollId'
  /** column name */
  | 'requiredLevel'
  /** column name */
  | 'skillName'
  | '%future added value';

/** input type for updating data in table "payroll_required_skills" */
export type PayrollRequiredSkillsSetInput = {
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  requiredLevel?: InputMaybe<Scalars['String']['input']>;
  skillName?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "payroll_required_skills" */
export type PayrollRequiredSkillsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PayrollRequiredSkillsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollRequiredSkillsStreamCursorValueInput = {
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  requiredLevel?: InputMaybe<Scalars['String']['input']>;
  skillName?: InputMaybe<Scalars['String']['input']>;
};

export type PayrollRequiredSkillsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollRequiredSkillsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollRequiredSkillsBoolExp;
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

/** Ordering options when selecting data from "payroll_triggers_status". */
export type PayrollTriggersStatusOrderBy = {
  actionStatement?: InputMaybe<OrderBy>;
  actionTiming?: InputMaybe<OrderBy>;
  eventManipulation?: InputMaybe<OrderBy>;
  eventObjectTable?: InputMaybe<OrderBy>;
  triggerName?: InputMaybe<OrderBy>;
};

/** select columns of table "payroll_triggers_status" */
export type PayrollTriggersStatusSelectColumn =
  /** column name */
  | 'actionStatement'
  /** column name */
  | 'actionTiming'
  /** column name */
  | 'eventManipulation'
  /** column name */
  | 'eventObjectTable'
  /** column name */
  | 'triggerName'
  | '%future added value';

/** Streaming cursor of the table "payroll_triggers_status" */
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
export type PayrollVersionHistoryResultsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'payroll_version_history_results_pkey'
  | '%future added value';

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
export type PayrollVersionHistoryResultsSelectColumn =
  /** column name */
  | 'active'
  /** column name */
  | 'goLiveDate'
  /** column name */
  | 'id'
  /** column name */
  | 'isCurrent'
  /** column name */
  | 'name'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'queriedAt'
  /** column name */
  | 'supersededDate'
  /** column name */
  | 'versionNumber'
  /** column name */
  | 'versionReason'
  | '%future added value';

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

/** Streaming cursor of the table "payroll_version_history_results" */
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

/** update columns of table "payroll_version_history_results" */
export type PayrollVersionHistoryResultsUpdateColumn =
  /** column name */
  | 'active'
  /** column name */
  | 'goLiveDate'
  /** column name */
  | 'id'
  /** column name */
  | 'isCurrent'
  /** column name */
  | 'name'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'queriedAt'
  /** column name */
  | 'supersededDate'
  /** column name */
  | 'versionNumber'
  /** column name */
  | 'versionReason'
  | '%future added value';

export type PayrollVersionHistoryResultsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<PayrollVersionHistoryResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollVersionHistoryResultsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollVersionHistoryResultsBoolExp;
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
export type PayrollVersionResultsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'payroll_version_results_pkey'
  | '%future added value';

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
export type PayrollVersionResultsSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdByUserId'
  /** column name */
  | 'datesDeleted'
  /** column name */
  | 'id'
  /** column name */
  | 'message'
  /** column name */
  | 'newPayrollId'
  /** column name */
  | 'newVersionNumber'
  /** column name */
  | 'oldPayrollId'
  | '%future added value';

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

/** Streaming cursor of the table "payroll_version_results" */
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

/** update columns of table "payroll_version_results" */
export type PayrollVersionResultsUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdByUserId'
  /** column name */
  | 'datesDeleted'
  /** column name */
  | 'id'
  /** column name */
  | 'message'
  /** column name */
  | 'newPayrollId'
  /** column name */
  | 'newVersionNumber'
  /** column name */
  | 'oldPayrollId'
  | '%future added value';

export type PayrollVersionResultsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<PayrollVersionResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollVersionResultsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollVersionResultsBoolExp;
};

/** Boolean expression to filter rows from the table "payroll_workload_distribution". All fields are combined with a logical 'AND'. */
export type PayrollWorkloadDistributionBoolExp = {
  _and?: InputMaybe<Array<PayrollWorkloadDistributionBoolExp>>;
  _not?: InputMaybe<PayrollWorkloadDistributionBoolExp>;
  _or?: InputMaybe<Array<PayrollWorkloadDistributionBoolExp>>;
  adjustedEftDate?: InputMaybe<DateComparisonExp>;
  adminTimeHours?: InputMaybe<NumericComparisonExp>;
  assignmentDate?: InputMaybe<DateComparisonExp>;
  assignmentDay?: InputMaybe<StringComparisonExp>;
  clientId?: InputMaybe<UuidComparisonExp>;
  clientName?: InputMaybe<StringComparisonExp>;
  consultantRole?: InputMaybe<StringComparisonExp>;
  dayCapacityHours?: InputMaybe<NumericComparisonExp>;
  dayUtilizationPercentage?: InputMaybe<NumericComparisonExp>;
  distributedProcessingTime?: InputMaybe<NumericComparisonExp>;
  originalEftDate?: InputMaybe<DateComparisonExp>;
  payrollDateId?: InputMaybe<UuidComparisonExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  payrollName?: InputMaybe<StringComparisonExp>;
  processingDaysBeforeEft?: InputMaybe<IntComparisonExp>;
  processingEndDate?: InputMaybe<DateComparisonExp>;
  processingStartDate?: InputMaybe<DateComparisonExp>;
  status?: InputMaybe<PayrollStatusComparisonExp>;
  totalPeriodCapacity?: InputMaybe<NumericComparisonExp>;
  totalProcessingTime?: InputMaybe<IntComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
  workHours?: InputMaybe<NumericComparisonExp>;
};

/** Ordering options when selecting data from "payroll_workload_distribution". */
export type PayrollWorkloadDistributionOrderBy = {
  adjustedEftDate?: InputMaybe<OrderBy>;
  adminTimeHours?: InputMaybe<OrderBy>;
  assignmentDate?: InputMaybe<OrderBy>;
  assignmentDay?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  clientName?: InputMaybe<OrderBy>;
  consultantRole?: InputMaybe<OrderBy>;
  dayCapacityHours?: InputMaybe<OrderBy>;
  dayUtilizationPercentage?: InputMaybe<OrderBy>;
  distributedProcessingTime?: InputMaybe<OrderBy>;
  originalEftDate?: InputMaybe<OrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  payrollName?: InputMaybe<OrderBy>;
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  processingEndDate?: InputMaybe<OrderBy>;
  processingStartDate?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  totalPeriodCapacity?: InputMaybe<OrderBy>;
  totalProcessingTime?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  workHours?: InputMaybe<OrderBy>;
};

/** select columns of table "payroll_workload_distribution" */
export type PayrollWorkloadDistributionSelectColumn =
  /** column name */
  | 'adjustedEftDate'
  /** column name */
  | 'adminTimeHours'
  /** column name */
  | 'assignmentDate'
  /** column name */
  | 'assignmentDay'
  /** column name */
  | 'clientId'
  /** column name */
  | 'clientName'
  /** column name */
  | 'consultantRole'
  /** column name */
  | 'dayCapacityHours'
  /** column name */
  | 'dayUtilizationPercentage'
  /** column name */
  | 'distributedProcessingTime'
  /** column name */
  | 'originalEftDate'
  /** column name */
  | 'payrollDateId'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'payrollName'
  /** column name */
  | 'processingDaysBeforeEft'
  /** column name */
  | 'processingEndDate'
  /** column name */
  | 'processingStartDate'
  /** column name */
  | 'status'
  /** column name */
  | 'totalPeriodCapacity'
  /** column name */
  | 'totalProcessingTime'
  /** column name */
  | 'userId'
  /** column name */
  | 'workHours'
  | '%future added value';

/** Streaming cursor of the table "payroll_workload_distribution" */
export type PayrollWorkloadDistributionStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PayrollWorkloadDistributionStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PayrollWorkloadDistributionStreamCursorValueInput = {
  adjustedEftDate?: InputMaybe<Scalars['date']['input']>;
  adminTimeHours?: InputMaybe<Scalars['numeric']['input']>;
  assignmentDate?: InputMaybe<Scalars['date']['input']>;
  assignmentDay?: InputMaybe<Scalars['String']['input']>;
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  clientName?: InputMaybe<Scalars['String']['input']>;
  consultantRole?: InputMaybe<Scalars['String']['input']>;
  dayCapacityHours?: InputMaybe<Scalars['numeric']['input']>;
  dayUtilizationPercentage?: InputMaybe<Scalars['numeric']['input']>;
  distributedProcessingTime?: InputMaybe<Scalars['numeric']['input']>;
  originalEftDate?: InputMaybe<Scalars['date']['input']>;
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  payrollName?: InputMaybe<Scalars['String']['input']>;
  processingDaysBeforeEft?: InputMaybe<Scalars['Int']['input']>;
  processingEndDate?: InputMaybe<Scalars['date']['input']>;
  processingStartDate?: InputMaybe<Scalars['date']['input']>;
  status?: InputMaybe<Scalars['payroll_status']['input']>;
  totalPeriodCapacity?: InputMaybe<Scalars['numeric']['input']>;
  totalProcessingTime?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
  workHours?: InputMaybe<Scalars['numeric']['input']>;
};

export type PayrollsAggregateBoolExp = {
  count?: InputMaybe<PayrollsAggregateBoolExpCount>;
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

/** order by avg() on columns of table "payrolls" */
export type PayrollsAvgOrderBy = {
  actualHours?: InputMaybe<OrderBy>;
  actualRevenue?: InputMaybe<OrderBy>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  estimatedHours?: InputMaybe<OrderBy>;
  estimatedRevenue?: InputMaybe<OrderBy>;
  /** Number of new employees processed */
  newEmployees?: InputMaybe<OrderBy>;
  /** Number of payslips processed in this payroll run */
  payslipCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  profitMargin?: InputMaybe<OrderBy>;
  /** Number of terminated employees processed */
  terminatedEmployees?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "payrolls". All fields are combined with a logical 'AND'. */
export type PayrollsBoolExp = {
  _and?: InputMaybe<Array<PayrollsBoolExp>>;
  _not?: InputMaybe<PayrollsBoolExp>;
  _or?: InputMaybe<Array<PayrollsBoolExp>>;
  actualHours?: InputMaybe<NumericComparisonExp>;
  actualRevenue?: InputMaybe<NumericComparisonExp>;
  assignedManager?: InputMaybe<UsersBoolExp>;
  backupConsultant?: InputMaybe<UsersBoolExp>;
  backupConsultantUserId?: InputMaybe<UuidComparisonExp>;
  billingItems?: InputMaybe<BillingItemsBoolExp>;
  billingItemsAggregate?: InputMaybe<BillingItemsAggregateBoolExp>;
  billingStatus?: InputMaybe<StringComparisonExp>;
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
  estimatedHours?: InputMaybe<NumericComparisonExp>;
  estimatedRevenue?: InputMaybe<NumericComparisonExp>;
  files?: InputMaybe<FilesBoolExp>;
  filesAggregate?: InputMaybe<FilesAggregateBoolExp>;
  goLiveDate?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  lastBilledDate?: InputMaybe<TimestamptzComparisonExp>;
  managerUserId?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  newEmployees?: InputMaybe<IntComparisonExp>;
  parentPayroll?: InputMaybe<PayrollsBoolExp>;
  parentPayrollId?: InputMaybe<UuidComparisonExp>;
  payrollCycle?: InputMaybe<PayrollCyclesBoolExp>;
  payrollDateType?: InputMaybe<PayrollDateTypesBoolExp>;
  payrollDates?: InputMaybe<PayrollDatesBoolExp>;
  payrollDatesAggregate?: InputMaybe<PayrollDatesAggregateBoolExp>;
  payrollSystem?: InputMaybe<StringComparisonExp>;
  payslipCount?: InputMaybe<IntComparisonExp>;
  primaryConsultant?: InputMaybe<UsersBoolExp>;
  primaryConsultantUserId?: InputMaybe<UuidComparisonExp>;
  processingDaysBeforeEft?: InputMaybe<IntComparisonExp>;
  processingTime?: InputMaybe<IntComparisonExp>;
  profitMargin?: InputMaybe<NumericComparisonExp>;
  requiredSkills?: InputMaybe<PayrollRequiredSkillsBoolExp>;
  requiredSkillsAggregate?: InputMaybe<PayrollRequiredSkillsAggregateBoolExp>;
  status?: InputMaybe<PayrollStatusComparisonExp>;
  supersededDate?: InputMaybe<DateComparisonExp>;
  terminatedEmployees?: InputMaybe<IntComparisonExp>;
  timeEntries?: InputMaybe<TimeEntriesBoolExp>;
  timeEntriesAggregate?: InputMaybe<TimeEntriesAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  versionNumber?: InputMaybe<IntComparisonExp>;
  versionReason?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "payrolls" */
export type PayrollsConstraint =
  /** unique or primary key constraint on columns  */
  | 'only_one_current_version_per_family'
  /** unique or primary key constraint on columns "id" */
  | 'payrolls_pkey'
  | '%future added value';

/** input type for incrementing numeric columns in table "payrolls" */
export type PayrollsIncInput = {
  actualHours?: InputMaybe<Scalars['numeric']['input']>;
  actualRevenue?: InputMaybe<Scalars['numeric']['input']>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<Scalars['Int']['input']>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<Scalars['Int']['input']>;
  estimatedHours?: InputMaybe<Scalars['numeric']['input']>;
  estimatedRevenue?: InputMaybe<Scalars['numeric']['input']>;
  /** Number of new employees processed */
  newEmployees?: InputMaybe<Scalars['Int']['input']>;
  /** Number of payslips processed in this payroll run */
  payslipCount?: InputMaybe<Scalars['Int']['input']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<Scalars['Int']['input']>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<Scalars['Int']['input']>;
  profitMargin?: InputMaybe<Scalars['numeric']['input']>;
  /** Number of terminated employees processed */
  terminatedEmployees?: InputMaybe<Scalars['Int']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "payrolls" */
export type PayrollsInsertInput = {
  actualHours?: InputMaybe<Scalars['numeric']['input']>;
  actualRevenue?: InputMaybe<Scalars['numeric']['input']>;
  assignedManager?: InputMaybe<UsersObjRelInsertInput>;
  backupConsultant?: InputMaybe<UsersObjRelInsertInput>;
  /** Backup consultant for this payroll */
  backupConsultantUserId?: InputMaybe<Scalars['uuid']['input']>;
  billingItems?: InputMaybe<BillingItemsArrRelInsertInput>;
  /** Billing status: pending, items_added, ready_to_bill, billed */
  billingStatus?: InputMaybe<Scalars['String']['input']>;
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
  estimatedHours?: InputMaybe<Scalars['numeric']['input']>;
  estimatedRevenue?: InputMaybe<Scalars['numeric']['input']>;
  files?: InputMaybe<FilesArrRelInsertInput>;
  /** The date when the payroll went live in the system */
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<Scalars['uuid']['input']>;
  lastBilledDate?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Manager overseeing this payroll */
  managerUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the payroll */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Number of new employees processed */
  newEmployees?: InputMaybe<Scalars['Int']['input']>;
  parentPayroll?: InputMaybe<PayrollsObjRelInsertInput>;
  parentPayrollId?: InputMaybe<Scalars['uuid']['input']>;
  payrollCycle?: InputMaybe<PayrollCyclesObjRelInsertInput>;
  payrollDateType?: InputMaybe<PayrollDateTypesObjRelInsertInput>;
  payrollDates?: InputMaybe<PayrollDatesArrRelInsertInput>;
  /** External payroll system used for this client */
  payrollSystem?: InputMaybe<Scalars['String']['input']>;
  /** Number of payslips processed in this payroll run */
  payslipCount?: InputMaybe<Scalars['Int']['input']>;
  primaryConsultant?: InputMaybe<UsersObjRelInsertInput>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<Scalars['Int']['input']>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<Scalars['Int']['input']>;
  profitMargin?: InputMaybe<Scalars['numeric']['input']>;
  requiredSkills?: InputMaybe<PayrollRequiredSkillsArrRelInsertInput>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<Scalars['payroll_status']['input']>;
  supersededDate?: InputMaybe<Scalars['date']['input']>;
  /** Number of terminated employees processed */
  terminatedEmployees?: InputMaybe<Scalars['Int']['input']>;
  timeEntries?: InputMaybe<TimeEntriesArrRelInsertInput>;
  /** Timestamp when the payroll was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
  versionReason?: InputMaybe<Scalars['String']['input']>;
};

/** order by max() on columns of table "payrolls" */
export type PayrollsMaxOrderBy = {
  actualHours?: InputMaybe<OrderBy>;
  actualRevenue?: InputMaybe<OrderBy>;
  /** Backup consultant for this payroll */
  backupConsultantUserId?: InputMaybe<OrderBy>;
  /** Billing status: pending, items_added, ready_to_bill, billed */
  billingStatus?: InputMaybe<OrderBy>;
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
  estimatedHours?: InputMaybe<OrderBy>;
  estimatedRevenue?: InputMaybe<OrderBy>;
  /** The date when the payroll went live in the system */
  goLiveDate?: InputMaybe<OrderBy>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<OrderBy>;
  lastBilledDate?: InputMaybe<OrderBy>;
  /** Manager overseeing this payroll */
  managerUserId?: InputMaybe<OrderBy>;
  /** Name of the payroll */
  name?: InputMaybe<OrderBy>;
  /** Number of new employees processed */
  newEmployees?: InputMaybe<OrderBy>;
  parentPayrollId?: InputMaybe<OrderBy>;
  /** External payroll system used for this client */
  payrollSystem?: InputMaybe<OrderBy>;
  /** Number of payslips processed in this payroll run */
  payslipCount?: InputMaybe<OrderBy>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  profitMargin?: InputMaybe<OrderBy>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<OrderBy>;
  supersededDate?: InputMaybe<OrderBy>;
  /** Number of terminated employees processed */
  terminatedEmployees?: InputMaybe<OrderBy>;
  /** Timestamp when the payroll was last updated */
  updatedAt?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
  versionReason?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "payrolls" */
export type PayrollsMinOrderBy = {
  actualHours?: InputMaybe<OrderBy>;
  actualRevenue?: InputMaybe<OrderBy>;
  /** Backup consultant for this payroll */
  backupConsultantUserId?: InputMaybe<OrderBy>;
  /** Billing status: pending, items_added, ready_to_bill, billed */
  billingStatus?: InputMaybe<OrderBy>;
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
  estimatedHours?: InputMaybe<OrderBy>;
  estimatedRevenue?: InputMaybe<OrderBy>;
  /** The date when the payroll went live in the system */
  goLiveDate?: InputMaybe<OrderBy>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<OrderBy>;
  lastBilledDate?: InputMaybe<OrderBy>;
  /** Manager overseeing this payroll */
  managerUserId?: InputMaybe<OrderBy>;
  /** Name of the payroll */
  name?: InputMaybe<OrderBy>;
  /** Number of new employees processed */
  newEmployees?: InputMaybe<OrderBy>;
  parentPayrollId?: InputMaybe<OrderBy>;
  /** External payroll system used for this client */
  payrollSystem?: InputMaybe<OrderBy>;
  /** Number of payslips processed in this payroll run */
  payslipCount?: InputMaybe<OrderBy>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  profitMargin?: InputMaybe<OrderBy>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<OrderBy>;
  supersededDate?: InputMaybe<OrderBy>;
  /** Number of terminated employees processed */
  terminatedEmployees?: InputMaybe<OrderBy>;
  /** Timestamp when the payroll was last updated */
  updatedAt?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
  versionReason?: InputMaybe<OrderBy>;
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
  actualHours?: InputMaybe<OrderBy>;
  actualRevenue?: InputMaybe<OrderBy>;
  assignedManager?: InputMaybe<UsersOrderBy>;
  backupConsultant?: InputMaybe<UsersOrderBy>;
  backupConsultantUserId?: InputMaybe<OrderBy>;
  billingItemsAggregate?: InputMaybe<BillingItemsAggregateOrderBy>;
  billingStatus?: InputMaybe<OrderBy>;
  childPayrollsAggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  client?: InputMaybe<ClientsOrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdByUserId?: InputMaybe<OrderBy>;
  cycleId?: InputMaybe<OrderBy>;
  dateTypeId?: InputMaybe<OrderBy>;
  dateValue?: InputMaybe<OrderBy>;
  employeeCount?: InputMaybe<OrderBy>;
  estimatedHours?: InputMaybe<OrderBy>;
  estimatedRevenue?: InputMaybe<OrderBy>;
  filesAggregate?: InputMaybe<FilesAggregateOrderBy>;
  goLiveDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  lastBilledDate?: InputMaybe<OrderBy>;
  managerUserId?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  newEmployees?: InputMaybe<OrderBy>;
  parentPayroll?: InputMaybe<PayrollsOrderBy>;
  parentPayrollId?: InputMaybe<OrderBy>;
  payrollCycle?: InputMaybe<PayrollCyclesOrderBy>;
  payrollDateType?: InputMaybe<PayrollDateTypesOrderBy>;
  payrollDatesAggregate?: InputMaybe<PayrollDatesAggregateOrderBy>;
  payrollSystem?: InputMaybe<OrderBy>;
  payslipCount?: InputMaybe<OrderBy>;
  primaryConsultant?: InputMaybe<UsersOrderBy>;
  primaryConsultantUserId?: InputMaybe<OrderBy>;
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  processingTime?: InputMaybe<OrderBy>;
  profitMargin?: InputMaybe<OrderBy>;
  requiredSkillsAggregate?: InputMaybe<PayrollRequiredSkillsAggregateOrderBy>;
  status?: InputMaybe<OrderBy>;
  supersededDate?: InputMaybe<OrderBy>;
  terminatedEmployees?: InputMaybe<OrderBy>;
  timeEntriesAggregate?: InputMaybe<TimeEntriesAggregateOrderBy>;
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
export type PayrollsSelectColumn =
  /** column name */
  | 'actualHours'
  /** column name */
  | 'actualRevenue'
  /** column name */
  | 'backupConsultantUserId'
  /** column name */
  | 'billingStatus'
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdByUserId'
  /** column name */
  | 'cycleId'
  /** column name */
  | 'dateTypeId'
  /** column name */
  | 'dateValue'
  /** column name */
  | 'employeeCount'
  /** column name */
  | 'estimatedHours'
  /** column name */
  | 'estimatedRevenue'
  /** column name */
  | 'goLiveDate'
  /** column name */
  | 'id'
  /** column name */
  | 'lastBilledDate'
  /** column name */
  | 'managerUserId'
  /** column name */
  | 'name'
  /** column name */
  | 'newEmployees'
  /** column name */
  | 'parentPayrollId'
  /** column name */
  | 'payrollSystem'
  /** column name */
  | 'payslipCount'
  /** column name */
  | 'primaryConsultantUserId'
  /** column name */
  | 'processingDaysBeforeEft'
  /** column name */
  | 'processingTime'
  /** column name */
  | 'profitMargin'
  /** column name */
  | 'status'
  /** column name */
  | 'supersededDate'
  /** column name */
  | 'terminatedEmployees'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'versionNumber'
  /** column name */
  | 'versionReason'
  | '%future added value';

/** input type for updating data in table "payrolls" */
export type PayrollsSetInput = {
  actualHours?: InputMaybe<Scalars['numeric']['input']>;
  actualRevenue?: InputMaybe<Scalars['numeric']['input']>;
  /** Backup consultant for this payroll */
  backupConsultantUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Billing status: pending, items_added, ready_to_bill, billed */
  billingStatus?: InputMaybe<Scalars['String']['input']>;
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
  estimatedHours?: InputMaybe<Scalars['numeric']['input']>;
  estimatedRevenue?: InputMaybe<Scalars['numeric']['input']>;
  /** The date when the payroll went live in the system */
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<Scalars['uuid']['input']>;
  lastBilledDate?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Manager overseeing this payroll */
  managerUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the payroll */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Number of new employees processed */
  newEmployees?: InputMaybe<Scalars['Int']['input']>;
  parentPayrollId?: InputMaybe<Scalars['uuid']['input']>;
  /** External payroll system used for this client */
  payrollSystem?: InputMaybe<Scalars['String']['input']>;
  /** Number of payslips processed in this payroll run */
  payslipCount?: InputMaybe<Scalars['Int']['input']>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<Scalars['Int']['input']>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<Scalars['Int']['input']>;
  profitMargin?: InputMaybe<Scalars['numeric']['input']>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<Scalars['payroll_status']['input']>;
  supersededDate?: InputMaybe<Scalars['date']['input']>;
  /** Number of terminated employees processed */
  terminatedEmployees?: InputMaybe<Scalars['Int']['input']>;
  /** Timestamp when the payroll was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
  versionReason?: InputMaybe<Scalars['String']['input']>;
};

/** order by stddev() on columns of table "payrolls" */
export type PayrollsStddevOrderBy = {
  actualHours?: InputMaybe<OrderBy>;
  actualRevenue?: InputMaybe<OrderBy>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  estimatedHours?: InputMaybe<OrderBy>;
  estimatedRevenue?: InputMaybe<OrderBy>;
  /** Number of new employees processed */
  newEmployees?: InputMaybe<OrderBy>;
  /** Number of payslips processed in this payroll run */
  payslipCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  profitMargin?: InputMaybe<OrderBy>;
  /** Number of terminated employees processed */
  terminatedEmployees?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "payrolls" */
export type PayrollsStddevPopOrderBy = {
  actualHours?: InputMaybe<OrderBy>;
  actualRevenue?: InputMaybe<OrderBy>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  estimatedHours?: InputMaybe<OrderBy>;
  estimatedRevenue?: InputMaybe<OrderBy>;
  /** Number of new employees processed */
  newEmployees?: InputMaybe<OrderBy>;
  /** Number of payslips processed in this payroll run */
  payslipCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  profitMargin?: InputMaybe<OrderBy>;
  /** Number of terminated employees processed */
  terminatedEmployees?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** order by stddevSamp() on columns of table "payrolls" */
export type PayrollsStddevSampOrderBy = {
  actualHours?: InputMaybe<OrderBy>;
  actualRevenue?: InputMaybe<OrderBy>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  estimatedHours?: InputMaybe<OrderBy>;
  estimatedRevenue?: InputMaybe<OrderBy>;
  /** Number of new employees processed */
  newEmployees?: InputMaybe<OrderBy>;
  /** Number of payslips processed in this payroll run */
  payslipCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  profitMargin?: InputMaybe<OrderBy>;
  /** Number of terminated employees processed */
  terminatedEmployees?: InputMaybe<OrderBy>;
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
  actualHours?: InputMaybe<Scalars['numeric']['input']>;
  actualRevenue?: InputMaybe<Scalars['numeric']['input']>;
  /** Backup consultant for this payroll */
  backupConsultantUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Billing status: pending, items_added, ready_to_bill, billed */
  billingStatus?: InputMaybe<Scalars['String']['input']>;
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
  estimatedHours?: InputMaybe<Scalars['numeric']['input']>;
  estimatedRevenue?: InputMaybe<Scalars['numeric']['input']>;
  /** The date when the payroll went live in the system */
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<Scalars['uuid']['input']>;
  lastBilledDate?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Manager overseeing this payroll */
  managerUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the payroll */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Number of new employees processed */
  newEmployees?: InputMaybe<Scalars['Int']['input']>;
  parentPayrollId?: InputMaybe<Scalars['uuid']['input']>;
  /** External payroll system used for this client */
  payrollSystem?: InputMaybe<Scalars['String']['input']>;
  /** Number of payslips processed in this payroll run */
  payslipCount?: InputMaybe<Scalars['Int']['input']>;
  /** Primary consultant responsible for this payroll */
  primaryConsultantUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<Scalars['Int']['input']>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<Scalars['Int']['input']>;
  profitMargin?: InputMaybe<Scalars['numeric']['input']>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<Scalars['payroll_status']['input']>;
  supersededDate?: InputMaybe<Scalars['date']['input']>;
  /** Number of terminated employees processed */
  terminatedEmployees?: InputMaybe<Scalars['Int']['input']>;
  /** Timestamp when the payroll was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
  versionReason?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "payrolls" */
export type PayrollsSumOrderBy = {
  actualHours?: InputMaybe<OrderBy>;
  actualRevenue?: InputMaybe<OrderBy>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  estimatedHours?: InputMaybe<OrderBy>;
  estimatedRevenue?: InputMaybe<OrderBy>;
  /** Number of new employees processed */
  newEmployees?: InputMaybe<OrderBy>;
  /** Number of payslips processed in this payroll run */
  payslipCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  profitMargin?: InputMaybe<OrderBy>;
  /** Number of terminated employees processed */
  terminatedEmployees?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** update columns of table "payrolls" */
export type PayrollsUpdateColumn =
  /** column name */
  | 'actualHours'
  /** column name */
  | 'actualRevenue'
  /** column name */
  | 'backupConsultantUserId'
  /** column name */
  | 'billingStatus'
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdByUserId'
  /** column name */
  | 'cycleId'
  /** column name */
  | 'dateTypeId'
  /** column name */
  | 'dateValue'
  /** column name */
  | 'employeeCount'
  /** column name */
  | 'estimatedHours'
  /** column name */
  | 'estimatedRevenue'
  /** column name */
  | 'goLiveDate'
  /** column name */
  | 'id'
  /** column name */
  | 'lastBilledDate'
  /** column name */
  | 'managerUserId'
  /** column name */
  | 'name'
  /** column name */
  | 'newEmployees'
  /** column name */
  | 'parentPayrollId'
  /** column name */
  | 'payrollSystem'
  /** column name */
  | 'payslipCount'
  /** column name */
  | 'primaryConsultantUserId'
  /** column name */
  | 'processingDaysBeforeEft'
  /** column name */
  | 'processingTime'
  /** column name */
  | 'profitMargin'
  /** column name */
  | 'status'
  /** column name */
  | 'supersededDate'
  /** column name */
  | 'terminatedEmployees'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'versionNumber'
  /** column name */
  | 'versionReason'
  | '%future added value';

export type PayrollsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<PayrollsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollsBoolExp;
};

/** order by varPop() on columns of table "payrolls" */
export type PayrollsVarPopOrderBy = {
  actualHours?: InputMaybe<OrderBy>;
  actualRevenue?: InputMaybe<OrderBy>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  estimatedHours?: InputMaybe<OrderBy>;
  estimatedRevenue?: InputMaybe<OrderBy>;
  /** Number of new employees processed */
  newEmployees?: InputMaybe<OrderBy>;
  /** Number of payslips processed in this payroll run */
  payslipCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  profitMargin?: InputMaybe<OrderBy>;
  /** Number of terminated employees processed */
  terminatedEmployees?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "payrolls" */
export type PayrollsVarSampOrderBy = {
  actualHours?: InputMaybe<OrderBy>;
  actualRevenue?: InputMaybe<OrderBy>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  estimatedHours?: InputMaybe<OrderBy>;
  estimatedRevenue?: InputMaybe<OrderBy>;
  /** Number of new employees processed */
  newEmployees?: InputMaybe<OrderBy>;
  /** Number of payslips processed in this payroll run */
  payslipCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  profitMargin?: InputMaybe<OrderBy>;
  /** Number of terminated employees processed */
  terminatedEmployees?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "payrolls" */
export type PayrollsVarianceOrderBy = {
  actualHours?: InputMaybe<OrderBy>;
  actualRevenue?: InputMaybe<OrderBy>;
  /** Specific value for date calculation (e.g., day of month) */
  dateValue?: InputMaybe<OrderBy>;
  /** Number of employees in this payroll */
  employeeCount?: InputMaybe<OrderBy>;
  estimatedHours?: InputMaybe<OrderBy>;
  estimatedRevenue?: InputMaybe<OrderBy>;
  /** Number of new employees processed */
  newEmployees?: InputMaybe<OrderBy>;
  /** Number of payslips processed in this payroll run */
  payslipCount?: InputMaybe<OrderBy>;
  /** Number of days before EFT that processing must complete */
  processingDaysBeforeEft?: InputMaybe<OrderBy>;
  /** Number of hours required to process this payroll */
  processingTime?: InputMaybe<OrderBy>;
  profitMargin?: InputMaybe<OrderBy>;
  /** Number of terminated employees processed */
  terminatedEmployees?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
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

export type PermissionAuditLogAggregateBoolExp = {
  count?: InputMaybe<PermissionAuditLogAggregateBoolExpCount>;
};

/** order by aggregate values of table "permission_audit_log" */
export type PermissionAuditLogAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<PermissionAuditLogMaxOrderBy>;
  min?: InputMaybe<PermissionAuditLogMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type PermissionAuditLogAppendInput = {
  newValue?: InputMaybe<Scalars['jsonb']['input']>;
  previousValue?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "permission_audit_log" */
export type PermissionAuditLogArrRelInsertInput = {
  data: Array<PermissionAuditLogInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<PermissionAuditLogOnConflict>;
};

/** Boolean expression to filter rows from the table "permission_audit_log". All fields are combined with a logical 'AND'. */
export type PermissionAuditLogBoolExp = {
  _and?: InputMaybe<Array<PermissionAuditLogBoolExp>>;
  _not?: InputMaybe<PermissionAuditLogBoolExp>;
  _or?: InputMaybe<Array<PermissionAuditLogBoolExp>>;
  action?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  newValue?: InputMaybe<JsonbComparisonExp>;
  operation?: InputMaybe<StringComparisonExp>;
  previousValue?: InputMaybe<JsonbComparisonExp>;
  reason?: InputMaybe<StringComparisonExp>;
  resource?: InputMaybe<StringComparisonExp>;
  targetRole?: InputMaybe<StringComparisonExp>;
  targetUser?: InputMaybe<UsersBoolExp>;
  targetUserId?: InputMaybe<UuidComparisonExp>;
  timestamp?: InputMaybe<TimestamptzComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "permission_audit_log" */
export type PermissionAuditLogConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'permission_audit_log_pkey'
  | '%future added value';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type PermissionAuditLogDeleteAtPathInput = {
  newValue?: InputMaybe<Array<Scalars['String']['input']>>;
  previousValue?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type PermissionAuditLogDeleteElemInput = {
  newValue?: InputMaybe<Scalars['Int']['input']>;
  previousValue?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type PermissionAuditLogDeleteKeyInput = {
  newValue?: InputMaybe<Scalars['String']['input']>;
  previousValue?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "permission_audit_log" */
export type PermissionAuditLogInsertInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  newValue?: InputMaybe<Scalars['jsonb']['input']>;
  operation?: InputMaybe<Scalars['String']['input']>;
  previousValue?: InputMaybe<Scalars['jsonb']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  resource?: InputMaybe<Scalars['String']['input']>;
  targetRole?: InputMaybe<Scalars['String']['input']>;
  targetUser?: InputMaybe<UsersObjRelInsertInput>;
  targetUserId?: InputMaybe<Scalars['uuid']['input']>;
  timestamp?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** order by max() on columns of table "permission_audit_log" */
export type PermissionAuditLogMaxOrderBy = {
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

/** order by min() on columns of table "permission_audit_log" */
export type PermissionAuditLogMinOrderBy = {
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

/** on_conflict condition type for table "permission_audit_log" */
export type PermissionAuditLogOnConflict = {
  constraint: PermissionAuditLogConstraint;
  updateColumns?: Array<PermissionAuditLogUpdateColumn>;
  where?: InputMaybe<PermissionAuditLogBoolExp>;
};

/** Ordering options when selecting data from "permission_audit_log". */
export type PermissionAuditLogOrderBy = {
  action?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  newValue?: InputMaybe<OrderBy>;
  operation?: InputMaybe<OrderBy>;
  previousValue?: InputMaybe<OrderBy>;
  reason?: InputMaybe<OrderBy>;
  resource?: InputMaybe<OrderBy>;
  targetRole?: InputMaybe<OrderBy>;
  targetUser?: InputMaybe<UsersOrderBy>;
  targetUserId?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: permission_audit_log */
export type PermissionAuditLogPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type PermissionAuditLogPrependInput = {
  newValue?: InputMaybe<Scalars['jsonb']['input']>;
  previousValue?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "permission_audit_log" */
export type PermissionAuditLogSelectColumn =
  /** column name */
  | 'action'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'newValue'
  /** column name */
  | 'operation'
  /** column name */
  | 'previousValue'
  /** column name */
  | 'reason'
  /** column name */
  | 'resource'
  /** column name */
  | 'targetRole'
  /** column name */
  | 'targetUserId'
  /** column name */
  | 'timestamp'
  /** column name */
  | 'userId'
  | '%future added value';

/** input type for updating data in table "permission_audit_log" */
export type PermissionAuditLogSetInput = {
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

/** Streaming cursor of the table "permission_audit_log" */
export type PermissionAuditLogStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PermissionAuditLogStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PermissionAuditLogStreamCursorValueInput = {
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
export type PermissionAuditLogUpdateColumn =
  /** column name */
  | 'action'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'newValue'
  /** column name */
  | 'operation'
  /** column name */
  | 'previousValue'
  /** column name */
  | 'reason'
  /** column name */
  | 'resource'
  /** column name */
  | 'targetRole'
  /** column name */
  | 'targetUserId'
  /** column name */
  | 'timestamp'
  /** column name */
  | 'userId'
  | '%future added value';

export type PermissionAuditLogUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<PermissionAuditLogAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<PermissionAuditLogDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<PermissionAuditLogDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<PermissionAuditLogDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<PermissionAuditLogPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PermissionAuditLogSetInput>;
  /** filter the rows which have to be updated */
  where: PermissionAuditLogBoolExp;
};

export type PermissionOverridesAggregateBoolExp = {
  bool_and?: InputMaybe<PermissionOverridesAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<PermissionOverridesAggregateBoolExpBool_Or>;
  count?: InputMaybe<PermissionOverridesAggregateBoolExpCount>;
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
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "permission_overrides" */
export type PermissionOverridesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'permission_overrides_pkey'
  | '%future added value';

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
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId?: InputMaybe<Scalars['uuid']['input']>;
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
  updatedAt?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
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
export type PermissionOverridesSelectColumn =
  /** column name */
  | 'conditions'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'expiresAt'
  /** column name */
  | 'granted'
  /** column name */
  | 'id'
  /** column name */
  | 'operation'
  /** column name */
  | 'reason'
  /** column name */
  | 'resource'
  /** column name */
  | 'role'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId'
  | '%future added value';

/** select "permissionOverridesAggregateBoolExpBool_andArgumentsColumns" columns of table "permission_overrides" */
export type PermissionOverridesSelectColumnPermissionOverridesAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'granted'
  | '%future added value';

/** select "permissionOverridesAggregateBoolExpBool_orArgumentsColumns" columns of table "permission_overrides" */
export type PermissionOverridesSelectColumnPermissionOverridesAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'granted'
  | '%future added value';

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

/** Streaming cursor of the table "permission_overrides" */
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
export type PermissionOverridesUpdateColumn =
  /** column name */
  | 'conditions'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'expiresAt'
  /** column name */
  | 'granted'
  /** column name */
  | 'id'
  /** column name */
  | 'operation'
  /** column name */
  | 'reason'
  /** column name */
  | 'resource'
  /** column name */
  | 'role'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId'
  | '%future added value';

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

export type PermissionsAggregateBoolExp = {
  count?: InputMaybe<PermissionsAggregateBoolExpCount>;
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
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  legacyPermissionName?: InputMaybe<StringComparisonExp>;
  resource?: InputMaybe<ResourcesBoolExp>;
  resourceId?: InputMaybe<UuidComparisonExp>;
  rolePermissions?: InputMaybe<RolePermissionsBoolExp>;
  rolePermissionsAggregate?: InputMaybe<RolePermissionsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "permissions" */
export type PermissionsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'permissions_pkey'
  /** unique or primary key constraint on columns "action", "resource_id" */
  | 'permissions_resource_id_action_key'
  | '%future added value';

/** input type for inserting data into table "permissions" */
export type PermissionsInsertInput = {
  action?: InputMaybe<Scalars['permission_action']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  legacyPermissionName?: InputMaybe<Scalars['String']['input']>;
  resource?: InputMaybe<ResourcesObjRelInsertInput>;
  resourceId?: InputMaybe<Scalars['uuid']['input']>;
  rolePermissions?: InputMaybe<RolePermissionsArrRelInsertInput>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
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
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  legacyPermissionName?: InputMaybe<OrderBy>;
  resource?: InputMaybe<ResourcesOrderBy>;
  resourceId?: InputMaybe<OrderBy>;
  rolePermissionsAggregate?: InputMaybe<RolePermissionsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: permissions */
export type PermissionsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "permissions" */
export type PermissionsSelectColumn =
  /** column name */
  | 'action'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'legacyPermissionName'
  /** column name */
  | 'resourceId'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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
export type PermissionsUpdateColumn =
  /** column name */
  | 'action'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'legacyPermissionName'
  /** column name */
  | 'resourceId'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type PermissionsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PermissionsSetInput>;
  /** filter the rows which have to be updated */
  where: PermissionsBoolExp;
};

/** Boolean expression to filter rows from the table "position_admin_defaults". All fields are combined with a logical 'AND'. */
export type PositionAdminDefaultsBoolExp = {
  _and?: InputMaybe<Array<PositionAdminDefaultsBoolExp>>;
  _not?: InputMaybe<PositionAdminDefaultsBoolExp>;
  _or?: InputMaybe<Array<PositionAdminDefaultsBoolExp>>;
  defaultAdminPercentage?: InputMaybe<NumericComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  position?: InputMaybe<UserPositionComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  updatedBy?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "position_admin_defaults" */
export type PositionAdminDefaultsConstraint =
  /** unique or primary key constraint on columns "position" */
  | 'position_admin_defaults_pkey'
  | '%future added value';

/** input type for incrementing numeric columns in table "position_admin_defaults" */
export type PositionAdminDefaultsIncInput = {
  defaultAdminPercentage?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "position_admin_defaults" */
export type PositionAdminDefaultsInsertInput = {
  defaultAdminPercentage?: InputMaybe<Scalars['numeric']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['user_position']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  updatedBy?: InputMaybe<Scalars['uuid']['input']>;
};

/** on_conflict condition type for table "position_admin_defaults" */
export type PositionAdminDefaultsOnConflict = {
  constraint: PositionAdminDefaultsConstraint;
  updateColumns?: Array<PositionAdminDefaultsUpdateColumn>;
  where?: InputMaybe<PositionAdminDefaultsBoolExp>;
};

/** Ordering options when selecting data from "position_admin_defaults". */
export type PositionAdminDefaultsOrderBy = {
  defaultAdminPercentage?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  position?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  updatedBy?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: position_admin_defaults */
export type PositionAdminDefaultsPkColumnsInput = {
  position: Scalars['user_position']['input'];
};

/** select columns of table "position_admin_defaults" */
export type PositionAdminDefaultsSelectColumn =
  /** column name */
  | 'defaultAdminPercentage'
  /** column name */
  | 'description'
  /** column name */
  | 'position'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'updatedBy'
  | '%future added value';

/** input type for updating data in table "position_admin_defaults" */
export type PositionAdminDefaultsSetInput = {
  defaultAdminPercentage?: InputMaybe<Scalars['numeric']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['user_position']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  updatedBy?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "position_admin_defaults" */
export type PositionAdminDefaultsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: PositionAdminDefaultsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type PositionAdminDefaultsStreamCursorValueInput = {
  defaultAdminPercentage?: InputMaybe<Scalars['numeric']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['user_position']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  updatedBy?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "position_admin_defaults" */
export type PositionAdminDefaultsUpdateColumn =
  /** column name */
  | 'defaultAdminPercentage'
  /** column name */
  | 'description'
  /** column name */
  | 'position'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'updatedBy'
  | '%future added value';

export type PositionAdminDefaultsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<PositionAdminDefaultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PositionAdminDefaultsSetInput>;
  /** filter the rows which have to be updated */
  where: PositionAdminDefaultsBoolExp;
};

/** Boolean expression to filter rows from the table "rate_limits". All fields are combined with a logical 'AND'. */
export type RateLimitsBoolExp = {
  _and?: InputMaybe<Array<RateLimitsBoolExp>>;
  _not?: InputMaybe<RateLimitsBoolExp>;
  _or?: InputMaybe<Array<RateLimitsBoolExp>>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  limitExceededCount?: InputMaybe<IntComparisonExp>;
  requestCount?: InputMaybe<IntComparisonExp>;
  serviceId?: InputMaybe<StringComparisonExp>;
  windowDurationMinutes?: InputMaybe<IntComparisonExp>;
  windowStart?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "rate_limits" */
export type RateLimitsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'rate_limits_pkey'
  /** unique or primary key constraint on columns "window_start", "service_id" */
  | 'rate_limits_service_id_window_start_key'
  | '%future added value';

/** input type for incrementing numeric columns in table "rate_limits" */
export type RateLimitsIncInput = {
  limitExceededCount?: InputMaybe<Scalars['Int']['input']>;
  requestCount?: InputMaybe<Scalars['Int']['input']>;
  windowDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rate_limits" */
export type RateLimitsInsertInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  limitExceededCount?: InputMaybe<Scalars['Int']['input']>;
  requestCount?: InputMaybe<Scalars['Int']['input']>;
  serviceId?: InputMaybe<Scalars['String']['input']>;
  windowDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
  windowStart?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** on_conflict condition type for table "rate_limits" */
export type RateLimitsOnConflict = {
  constraint: RateLimitsConstraint;
  updateColumns?: Array<RateLimitsUpdateColumn>;
  where?: InputMaybe<RateLimitsBoolExp>;
};

/** Ordering options when selecting data from "rate_limits". */
export type RateLimitsOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  limitExceededCount?: InputMaybe<OrderBy>;
  requestCount?: InputMaybe<OrderBy>;
  serviceId?: InputMaybe<OrderBy>;
  windowDurationMinutes?: InputMaybe<OrderBy>;
  windowStart?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: rate_limits */
export type RateLimitsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "rate_limits" */
export type RateLimitsSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'limitExceededCount'
  /** column name */
  | 'requestCount'
  /** column name */
  | 'serviceId'
  /** column name */
  | 'windowDurationMinutes'
  /** column name */
  | 'windowStart'
  | '%future added value';

/** input type for updating data in table "rate_limits" */
export type RateLimitsSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  limitExceededCount?: InputMaybe<Scalars['Int']['input']>;
  requestCount?: InputMaybe<Scalars['Int']['input']>;
  serviceId?: InputMaybe<Scalars['String']['input']>;
  windowDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
  windowStart?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "rate_limits" */
export type RateLimitsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: RateLimitsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RateLimitsStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  limitExceededCount?: InputMaybe<Scalars['Int']['input']>;
  requestCount?: InputMaybe<Scalars['Int']['input']>;
  serviceId?: InputMaybe<Scalars['String']['input']>;
  windowDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
  windowStart?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "rate_limits" */
export type RateLimitsUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'limitExceededCount'
  /** column name */
  | 'requestCount'
  /** column name */
  | 'serviceId'
  /** column name */
  | 'windowDurationMinutes'
  /** column name */
  | 'windowStart'
  | '%future added value';

export type RateLimitsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<RateLimitsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<RateLimitsSetInput>;
  /** filter the rows which have to be updated */
  where: RateLimitsBoolExp;
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
  permissionsAggregate?: InputMaybe<PermissionsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "resources" */
export type ResourcesConstraint =
  /** unique or primary key constraint on columns "name" */
  | 'resources_name_key'
  /** unique or primary key constraint on columns "id" */
  | 'resources_pkey'
  | '%future added value';

/** input type for inserting data into table "resources" */
export type ResourcesInsertInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<PermissionsArrRelInsertInput>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
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
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  displayName?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  permissionsAggregate?: InputMaybe<PermissionsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: resources */
export type ResourcesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "resources" */
export type ResourcesSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'displayName'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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
export type ResourcesUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'displayName'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type ResourcesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ResourcesSetInput>;
  /** filter the rows which have to be updated */
  where: ResourcesBoolExp;
};

export type RolePermissionsAggregateBoolExp = {
  count?: InputMaybe<RolePermissionsAggregateBoolExpCount>;
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
  id?: InputMaybe<UuidComparisonExp>;
  permission?: InputMaybe<PermissionsBoolExp>;
  permissionId?: InputMaybe<UuidComparisonExp>;
  role?: InputMaybe<RolesBoolExp>;
  roleId?: InputMaybe<UuidComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "role_permissions" */
export type RolePermissionsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'role_permissions_pkey'
  /** unique or primary key constraint on columns "role_id", "permission_id" */
  | 'role_permissions_role_id_permission_id_key'
  | '%future added value';

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
  id?: InputMaybe<Scalars['uuid']['input']>;
  permission?: InputMaybe<PermissionsObjRelInsertInput>;
  permissionId?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<RolesObjRelInsertInput>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by max() on columns of table "role_permissions" */
export type RolePermissionsMaxOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  permissionId?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "role_permissions" */
export type RolePermissionsMinOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  permissionId?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
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
  id?: InputMaybe<OrderBy>;
  permission?: InputMaybe<PermissionsOrderBy>;
  permissionId?: InputMaybe<OrderBy>;
  role?: InputMaybe<RolesOrderBy>;
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
export type RolePermissionsSelectColumn =
  /** column name */
  | 'conditions'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'permissionId'
  /** column name */
  | 'roleId'
  /** column name */
  | 'updatedAt'
  | '%future added value';

/** input type for updating data in table "role_permissions" */
export type RolePermissionsSetInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  permissionId?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "role_permissions" */
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
export type RolePermissionsUpdateColumn =
  /** column name */
  | 'conditions'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'permissionId'
  /** column name */
  | 'roleId'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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
  rolePermissionsAggregate?: InputMaybe<RolePermissionsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  userRoles?: InputMaybe<UserRolesBoolExp>;
  userRolesAggregate?: InputMaybe<UserRolesAggregateBoolExp>;
};

/** unique or primary key constraints on table "roles" */
export type RolesConstraint =
  /** unique or primary key constraint on columns "name" */
  | 'roles_name_key'
  /** unique or primary key constraint on columns "id" */
  | 'roles_pkey'
  | '%future added value';

/** input type for incrementing numeric columns in table "roles" */
export type RolesIncInput = {
  priority?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "roles" */
export type RolesInsertInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isSystemRole?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  rolePermissions?: InputMaybe<RolePermissionsArrRelInsertInput>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userRoles?: InputMaybe<UserRolesArrRelInsertInput>;
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
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  displayName?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isSystemRole?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  priority?: InputMaybe<OrderBy>;
  rolePermissionsAggregate?: InputMaybe<RolePermissionsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userRolesAggregate?: InputMaybe<UserRolesAggregateOrderBy>;
};

/** primary key columns input for table: roles */
export type RolesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "roles" */
export type RolesSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'displayName'
  /** column name */
  | 'id'
  /** column name */
  | 'isSystemRole'
  /** column name */
  | 'name'
  /** column name */
  | 'priority'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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

/** update columns of table "roles" */
export type RolesUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'displayName'
  /** column name */
  | 'id'
  /** column name */
  | 'isSystemRole'
  /** column name */
  | 'name'
  /** column name */
  | 'priority'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type RolesUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<RolesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<RolesSetInput>;
  /** filter the rows which have to be updated */
  where: RolesBoolExp;
};

export type SecurityAlertsAggregateBoolExp = {
  bool_and?: InputMaybe<SecurityAlertsAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<SecurityAlertsAggregateBoolExpBool_Or>;
  count?: InputMaybe<SecurityAlertsAggregateBoolExpCount>;
};

/** order by aggregate values of table "security_alerts" */
export type SecurityAlertsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<SecurityAlertsMaxOrderBy>;
  min?: InputMaybe<SecurityAlertsMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type SecurityAlertsAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "security_alerts" */
export type SecurityAlertsArrRelInsertInput = {
  data: Array<SecurityAlertsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<SecurityAlertsOnConflict>;
};

/** Boolean expression to filter rows from the table "security_alerts". All fields are combined with a logical 'AND'. */
export type SecurityAlertsBoolExp = {
  _and?: InputMaybe<Array<SecurityAlertsBoolExp>>;
  _not?: InputMaybe<SecurityAlertsBoolExp>;
  _or?: InputMaybe<Array<SecurityAlertsBoolExp>>;
  alertType?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  ipAddress?: InputMaybe<InetComparisonExp>;
  isResolved?: InputMaybe<BooleanComparisonExp>;
  metadata?: InputMaybe<JsonbComparisonExp>;
  resolutionNotes?: InputMaybe<StringComparisonExp>;
  resolvedAt?: InputMaybe<TimestamptzComparisonExp>;
  resolvedBy?: InputMaybe<UuidComparisonExp>;
  resolvedByUser?: InputMaybe<UsersBoolExp>;
  severity?: InputMaybe<StringComparisonExp>;
  title?: InputMaybe<StringComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userAgent?: InputMaybe<StringComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "security_alerts" */
export type SecurityAlertsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'security_alerts_pkey'
  | '%future added value';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type SecurityAlertsDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type SecurityAlertsDeleteElemInput = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type SecurityAlertsDeleteKeyInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "security_alerts" */
export type SecurityAlertsInsertInput = {
  alertType?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  isResolved?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  resolutionNotes?: InputMaybe<Scalars['String']['input']>;
  resolvedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  resolvedBy?: InputMaybe<Scalars['uuid']['input']>;
  resolvedByUser?: InputMaybe<UsersObjRelInsertInput>;
  severity?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** order by max() on columns of table "security_alerts" */
export type SecurityAlertsMaxOrderBy = {
  alertType?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  resolutionNotes?: InputMaybe<OrderBy>;
  resolvedAt?: InputMaybe<OrderBy>;
  resolvedBy?: InputMaybe<OrderBy>;
  severity?: InputMaybe<OrderBy>;
  title?: InputMaybe<OrderBy>;
  userAgent?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "security_alerts" */
export type SecurityAlertsMinOrderBy = {
  alertType?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  resolutionNotes?: InputMaybe<OrderBy>;
  resolvedAt?: InputMaybe<OrderBy>;
  resolvedBy?: InputMaybe<OrderBy>;
  severity?: InputMaybe<OrderBy>;
  title?: InputMaybe<OrderBy>;
  userAgent?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "security_alerts" */
export type SecurityAlertsOnConflict = {
  constraint: SecurityAlertsConstraint;
  updateColumns?: Array<SecurityAlertsUpdateColumn>;
  where?: InputMaybe<SecurityAlertsBoolExp>;
};

/** Ordering options when selecting data from "security_alerts". */
export type SecurityAlertsOrderBy = {
  alertType?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  ipAddress?: InputMaybe<OrderBy>;
  isResolved?: InputMaybe<OrderBy>;
  metadata?: InputMaybe<OrderBy>;
  resolutionNotes?: InputMaybe<OrderBy>;
  resolvedAt?: InputMaybe<OrderBy>;
  resolvedBy?: InputMaybe<OrderBy>;
  resolvedByUser?: InputMaybe<UsersOrderBy>;
  severity?: InputMaybe<OrderBy>;
  title?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userAgent?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: security_alerts */
export type SecurityAlertsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type SecurityAlertsPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "security_alerts" */
export type SecurityAlertsSelectColumn =
  /** column name */
  | 'alertType'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'ipAddress'
  /** column name */
  | 'isResolved'
  /** column name */
  | 'metadata'
  /** column name */
  | 'resolutionNotes'
  /** column name */
  | 'resolvedAt'
  /** column name */
  | 'resolvedBy'
  /** column name */
  | 'severity'
  /** column name */
  | 'title'
  /** column name */
  | 'userAgent'
  /** column name */
  | 'userId'
  | '%future added value';

/** select "securityAlertsAggregateBoolExpBool_andArgumentsColumns" columns of table "security_alerts" */
export type SecurityAlertsSelectColumnSecurityAlertsAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'isResolved'
  | '%future added value';

/** select "securityAlertsAggregateBoolExpBool_orArgumentsColumns" columns of table "security_alerts" */
export type SecurityAlertsSelectColumnSecurityAlertsAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'isResolved'
  | '%future added value';

/** input type for updating data in table "security_alerts" */
export type SecurityAlertsSetInput = {
  alertType?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  isResolved?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  resolutionNotes?: InputMaybe<Scalars['String']['input']>;
  resolvedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  resolvedBy?: InputMaybe<Scalars['uuid']['input']>;
  severity?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "security_alerts" */
export type SecurityAlertsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: SecurityAlertsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type SecurityAlertsStreamCursorValueInput = {
  alertType?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  isResolved?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  resolutionNotes?: InputMaybe<Scalars['String']['input']>;
  resolvedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  resolvedBy?: InputMaybe<Scalars['uuid']['input']>;
  severity?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "security_alerts" */
export type SecurityAlertsUpdateColumn =
  /** column name */
  | 'alertType'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'ipAddress'
  /** column name */
  | 'isResolved'
  /** column name */
  | 'metadata'
  /** column name */
  | 'resolutionNotes'
  /** column name */
  | 'resolvedAt'
  /** column name */
  | 'resolvedBy'
  /** column name */
  | 'severity'
  /** column name */
  | 'title'
  /** column name */
  | 'userAgent'
  /** column name */
  | 'userId'
  | '%future added value';

export type SecurityAlertsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<SecurityAlertsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<SecurityAlertsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<SecurityAlertsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<SecurityAlertsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<SecurityAlertsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<SecurityAlertsSetInput>;
  /** filter the rows which have to be updated */
  where: SecurityAlertsBoolExp;
};

export type SecuritySettingsAggregateBoolExp = {
  bool_and?: InputMaybe<SecuritySettingsAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<SecuritySettingsAggregateBoolExpBool_Or>;
  count?: InputMaybe<SecuritySettingsAggregateBoolExpCount>;
};

/** order by aggregate values of table "security_settings" */
export type SecuritySettingsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<SecuritySettingsMaxOrderBy>;
  min?: InputMaybe<SecuritySettingsMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type SecuritySettingsAppendInput = {
  settingValue?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "security_settings" */
export type SecuritySettingsArrRelInsertInput = {
  data: Array<SecuritySettingsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<SecuritySettingsOnConflict>;
};

/** Boolean expression to filter rows from the table "security_settings". All fields are combined with a logical 'AND'. */
export type SecuritySettingsBoolExp = {
  _and?: InputMaybe<Array<SecuritySettingsBoolExp>>;
  _not?: InputMaybe<SecuritySettingsBoolExp>;
  _or?: InputMaybe<Array<SecuritySettingsBoolExp>>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isSystemWide?: InputMaybe<BooleanComparisonExp>;
  settingKey?: InputMaybe<StringComparisonExp>;
  settingValue?: InputMaybe<JsonbComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  updatedBy?: InputMaybe<UuidComparisonExp>;
  updatedByUser?: InputMaybe<UsersBoolExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "security_settings" */
export type SecuritySettingsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'security_settings_pkey'
  /** unique or primary key constraint on columns "user_id", "setting_key" */
  | 'security_settings_user_id_setting_key_key'
  | '%future added value';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type SecuritySettingsDeleteAtPathInput = {
  settingValue?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type SecuritySettingsDeleteElemInput = {
  settingValue?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type SecuritySettingsDeleteKeyInput = {
  settingValue?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "security_settings" */
export type SecuritySettingsInsertInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isSystemWide?: InputMaybe<Scalars['Boolean']['input']>;
  settingKey?: InputMaybe<Scalars['String']['input']>;
  settingValue?: InputMaybe<Scalars['jsonb']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  updatedBy?: InputMaybe<Scalars['uuid']['input']>;
  updatedByUser?: InputMaybe<UsersObjRelInsertInput>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** order by max() on columns of table "security_settings" */
export type SecuritySettingsMaxOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  settingKey?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  updatedBy?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "security_settings" */
export type SecuritySettingsMinOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  settingKey?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  updatedBy?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "security_settings" */
export type SecuritySettingsOnConflict = {
  constraint: SecuritySettingsConstraint;
  updateColumns?: Array<SecuritySettingsUpdateColumn>;
  where?: InputMaybe<SecuritySettingsBoolExp>;
};

/** Ordering options when selecting data from "security_settings". */
export type SecuritySettingsOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isSystemWide?: InputMaybe<OrderBy>;
  settingKey?: InputMaybe<OrderBy>;
  settingValue?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  updatedBy?: InputMaybe<OrderBy>;
  updatedByUser?: InputMaybe<UsersOrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: security_settings */
export type SecuritySettingsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type SecuritySettingsPrependInput = {
  settingValue?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "security_settings" */
export type SecuritySettingsSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'isSystemWide'
  /** column name */
  | 'settingKey'
  /** column name */
  | 'settingValue'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'updatedBy'
  /** column name */
  | 'userId'
  | '%future added value';

/** select "securitySettingsAggregateBoolExpBool_andArgumentsColumns" columns of table "security_settings" */
export type SecuritySettingsSelectColumnSecuritySettingsAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'isSystemWide'
  | '%future added value';

/** select "securitySettingsAggregateBoolExpBool_orArgumentsColumns" columns of table "security_settings" */
export type SecuritySettingsSelectColumnSecuritySettingsAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'isSystemWide'
  | '%future added value';

/** input type for updating data in table "security_settings" */
export type SecuritySettingsSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isSystemWide?: InputMaybe<Scalars['Boolean']['input']>;
  settingKey?: InputMaybe<Scalars['String']['input']>;
  settingValue?: InputMaybe<Scalars['jsonb']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  updatedBy?: InputMaybe<Scalars['uuid']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "security_settings" */
export type SecuritySettingsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: SecuritySettingsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type SecuritySettingsStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isSystemWide?: InputMaybe<Scalars['Boolean']['input']>;
  settingKey?: InputMaybe<Scalars['String']['input']>;
  settingValue?: InputMaybe<Scalars['jsonb']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  updatedBy?: InputMaybe<Scalars['uuid']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "security_settings" */
export type SecuritySettingsUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'isSystemWide'
  /** column name */
  | 'settingKey'
  /** column name */
  | 'settingValue'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'updatedBy'
  /** column name */
  | 'userId'
  | '%future added value';

export type SecuritySettingsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<SecuritySettingsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<SecuritySettingsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<SecuritySettingsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<SecuritySettingsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<SecuritySettingsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<SecuritySettingsSetInput>;
  /** filter the rows which have to be updated */
  where: SecuritySettingsBoolExp;
};

export type ServicePricingRulesAggregateBoolExp = {
  bool_and?: InputMaybe<ServicePricingRulesAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<ServicePricingRulesAggregateBoolExpBool_Or>;
  count?: InputMaybe<ServicePricingRulesAggregateBoolExpCount>;
};

/** order by aggregate values of table "service_pricing_rules" */
export type ServicePricingRulesAggregateOrderBy = {
  avg?: InputMaybe<ServicePricingRulesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ServicePricingRulesMaxOrderBy>;
  min?: InputMaybe<ServicePricingRulesMinOrderBy>;
  stddev?: InputMaybe<ServicePricingRulesStddevOrderBy>;
  stddevPop?: InputMaybe<ServicePricingRulesStddevPopOrderBy>;
  stddevSamp?: InputMaybe<ServicePricingRulesStddevSampOrderBy>;
  sum?: InputMaybe<ServicePricingRulesSumOrderBy>;
  varPop?: InputMaybe<ServicePricingRulesVarPopOrderBy>;
  varSamp?: InputMaybe<ServicePricingRulesVarSampOrderBy>;
  variance?: InputMaybe<ServicePricingRulesVarianceOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type ServicePricingRulesAppendInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  pricingAdjustment?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "service_pricing_rules" */
export type ServicePricingRulesArrRelInsertInput = {
  data: Array<ServicePricingRulesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<ServicePricingRulesOnConflict>;
};

/** order by avg() on columns of table "service_pricing_rules" */
export type ServicePricingRulesAvgOrderBy = {
  priority?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "service_pricing_rules". All fields are combined with a logical 'AND'. */
export type ServicePricingRulesBoolExp = {
  _and?: InputMaybe<Array<ServicePricingRulesBoolExp>>;
  _not?: InputMaybe<ServicePricingRulesBoolExp>;
  _or?: InputMaybe<Array<ServicePricingRulesBoolExp>>;
  conditions?: InputMaybe<JsonbComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdBy?: InputMaybe<UuidComparisonExp>;
  createdByUser?: InputMaybe<UsersBoolExp>;
  effectiveFrom?: InputMaybe<TimestamptzComparisonExp>;
  effectiveUntil?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isActive?: InputMaybe<BooleanComparisonExp>;
  pricingAdjustment?: InputMaybe<JsonbComparisonExp>;
  priority?: InputMaybe<IntComparisonExp>;
  ruleName?: InputMaybe<StringComparisonExp>;
  ruleType?: InputMaybe<StringComparisonExp>;
  service?: InputMaybe<ServicesBoolExp>;
  serviceId?: InputMaybe<UuidComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "service_pricing_rules" */
export type ServicePricingRulesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'service_pricing_rules_pkey'
  | '%future added value';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type ServicePricingRulesDeleteAtPathInput = {
  conditions?: InputMaybe<Array<Scalars['String']['input']>>;
  pricingAdjustment?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type ServicePricingRulesDeleteElemInput = {
  conditions?: InputMaybe<Scalars['Int']['input']>;
  pricingAdjustment?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type ServicePricingRulesDeleteKeyInput = {
  conditions?: InputMaybe<Scalars['String']['input']>;
  pricingAdjustment?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "service_pricing_rules" */
export type ServicePricingRulesIncInput = {
  priority?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "service_pricing_rules" */
export type ServicePricingRulesInsertInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  createdByUser?: InputMaybe<UsersObjRelInsertInput>;
  effectiveFrom?: InputMaybe<Scalars['timestamptz']['input']>;
  effectiveUntil?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  pricingAdjustment?: InputMaybe<Scalars['jsonb']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  ruleName?: InputMaybe<Scalars['String']['input']>;
  ruleType?: InputMaybe<Scalars['String']['input']>;
  service?: InputMaybe<ServicesObjRelInsertInput>;
  serviceId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by max() on columns of table "service_pricing_rules" */
export type ServicePricingRulesMaxOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  effectiveFrom?: InputMaybe<OrderBy>;
  effectiveUntil?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  priority?: InputMaybe<OrderBy>;
  ruleName?: InputMaybe<OrderBy>;
  ruleType?: InputMaybe<OrderBy>;
  serviceId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "service_pricing_rules" */
export type ServicePricingRulesMinOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  effectiveFrom?: InputMaybe<OrderBy>;
  effectiveUntil?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  priority?: InputMaybe<OrderBy>;
  ruleName?: InputMaybe<OrderBy>;
  ruleType?: InputMaybe<OrderBy>;
  serviceId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "service_pricing_rules" */
export type ServicePricingRulesOnConflict = {
  constraint: ServicePricingRulesConstraint;
  updateColumns?: Array<ServicePricingRulesUpdateColumn>;
  where?: InputMaybe<ServicePricingRulesBoolExp>;
};

/** Ordering options when selecting data from "service_pricing_rules". */
export type ServicePricingRulesOrderBy = {
  conditions?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  createdByUser?: InputMaybe<UsersOrderBy>;
  effectiveFrom?: InputMaybe<OrderBy>;
  effectiveUntil?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  pricingAdjustment?: InputMaybe<OrderBy>;
  priority?: InputMaybe<OrderBy>;
  ruleName?: InputMaybe<OrderBy>;
  ruleType?: InputMaybe<OrderBy>;
  service?: InputMaybe<ServicesOrderBy>;
  serviceId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: service_pricing_rules */
export type ServicePricingRulesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type ServicePricingRulesPrependInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  pricingAdjustment?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "service_pricing_rules" */
export type ServicePricingRulesSelectColumn =
  /** column name */
  | 'conditions'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'effectiveFrom'
  /** column name */
  | 'effectiveUntil'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'pricingAdjustment'
  /** column name */
  | 'priority'
  /** column name */
  | 'ruleName'
  /** column name */
  | 'ruleType'
  /** column name */
  | 'serviceId'
  /** column name */
  | 'updatedAt'
  | '%future added value';

/** select "servicePricingRulesAggregateBoolExpBool_andArgumentsColumns" columns of table "service_pricing_rules" */
export type ServicePricingRulesSelectColumnServicePricingRulesAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'isActive'
  | '%future added value';

/** select "servicePricingRulesAggregateBoolExpBool_orArgumentsColumns" columns of table "service_pricing_rules" */
export type ServicePricingRulesSelectColumnServicePricingRulesAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'isActive'
  | '%future added value';

/** input type for updating data in table "service_pricing_rules" */
export type ServicePricingRulesSetInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  effectiveFrom?: InputMaybe<Scalars['timestamptz']['input']>;
  effectiveUntil?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  pricingAdjustment?: InputMaybe<Scalars['jsonb']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  ruleName?: InputMaybe<Scalars['String']['input']>;
  ruleType?: InputMaybe<Scalars['String']['input']>;
  serviceId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by stddev() on columns of table "service_pricing_rules" */
export type ServicePricingRulesStddevOrderBy = {
  priority?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "service_pricing_rules" */
export type ServicePricingRulesStddevPopOrderBy = {
  priority?: InputMaybe<OrderBy>;
};

/** order by stddevSamp() on columns of table "service_pricing_rules" */
export type ServicePricingRulesStddevSampOrderBy = {
  priority?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "service_pricing_rules" */
export type ServicePricingRulesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: ServicePricingRulesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ServicePricingRulesStreamCursorValueInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  effectiveFrom?: InputMaybe<Scalars['timestamptz']['input']>;
  effectiveUntil?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  pricingAdjustment?: InputMaybe<Scalars['jsonb']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  ruleName?: InputMaybe<Scalars['String']['input']>;
  ruleType?: InputMaybe<Scalars['String']['input']>;
  serviceId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by sum() on columns of table "service_pricing_rules" */
export type ServicePricingRulesSumOrderBy = {
  priority?: InputMaybe<OrderBy>;
};

/** update columns of table "service_pricing_rules" */
export type ServicePricingRulesUpdateColumn =
  /** column name */
  | 'conditions'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'effectiveFrom'
  /** column name */
  | 'effectiveUntil'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'pricingAdjustment'
  /** column name */
  | 'priority'
  /** column name */
  | 'ruleName'
  /** column name */
  | 'ruleType'
  /** column name */
  | 'serviceId'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type ServicePricingRulesUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<ServicePricingRulesAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<ServicePricingRulesDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<ServicePricingRulesDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<ServicePricingRulesDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<ServicePricingRulesIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<ServicePricingRulesPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ServicePricingRulesSetInput>;
  /** filter the rows which have to be updated */
  where: ServicePricingRulesBoolExp;
};

/** order by varPop() on columns of table "service_pricing_rules" */
export type ServicePricingRulesVarPopOrderBy = {
  priority?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "service_pricing_rules" */
export type ServicePricingRulesVarSampOrderBy = {
  priority?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "service_pricing_rules" */
export type ServicePricingRulesVarianceOrderBy = {
  priority?: InputMaybe<OrderBy>;
};

export type ServiceTemplatesAggregateBoolExp = {
  bool_and?: InputMaybe<ServiceTemplatesAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<ServiceTemplatesAggregateBoolExpBool_Or>;
  count?: InputMaybe<ServiceTemplatesAggregateBoolExpCount>;
};

/** order by aggregate values of table "service_templates" */
export type ServiceTemplatesAggregateOrderBy = {
  avg?: InputMaybe<ServiceTemplatesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ServiceTemplatesMaxOrderBy>;
  min?: InputMaybe<ServiceTemplatesMinOrderBy>;
  stddev?: InputMaybe<ServiceTemplatesStddevOrderBy>;
  stddevPop?: InputMaybe<ServiceTemplatesStddevPopOrderBy>;
  stddevSamp?: InputMaybe<ServiceTemplatesStddevSampOrderBy>;
  sum?: InputMaybe<ServiceTemplatesSumOrderBy>;
  varPop?: InputMaybe<ServiceTemplatesVarPopOrderBy>;
  varSamp?: InputMaybe<ServiceTemplatesVarSampOrderBy>;
  variance?: InputMaybe<ServiceTemplatesVarianceOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type ServiceTemplatesAppendInput = {
  services?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "service_templates" */
export type ServiceTemplatesArrRelInsertInput = {
  data: Array<ServiceTemplatesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<ServiceTemplatesOnConflict>;
};

/** order by avg() on columns of table "service_templates" */
export type ServiceTemplatesAvgOrderBy = {
  bundleDiscountPercentage?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "service_templates". All fields are combined with a logical 'AND'. */
export type ServiceTemplatesBoolExp = {
  _and?: InputMaybe<Array<ServiceTemplatesBoolExp>>;
  _not?: InputMaybe<ServiceTemplatesBoolExp>;
  _or?: InputMaybe<Array<ServiceTemplatesBoolExp>>;
  bundleDiscountPercentage?: InputMaybe<NumericComparisonExp>;
  category?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdBy?: InputMaybe<UuidComparisonExp>;
  createdByUser?: InputMaybe<UsersBoolExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isPublic?: InputMaybe<BooleanComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  pricingStrategy?: InputMaybe<StringComparisonExp>;
  services?: InputMaybe<JsonbComparisonExp>;
  targetClientTypes?: InputMaybe<StringArrayComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  updatedBy?: InputMaybe<UuidComparisonExp>;
  updatedByUser?: InputMaybe<UsersBoolExp>;
};

/** unique or primary key constraints on table "service_templates" */
export type ServiceTemplatesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'service_templates_pkey'
  | '%future added value';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type ServiceTemplatesDeleteAtPathInput = {
  services?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type ServiceTemplatesDeleteElemInput = {
  services?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type ServiceTemplatesDeleteKeyInput = {
  services?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "service_templates" */
export type ServiceTemplatesIncInput = {
  bundleDiscountPercentage?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "service_templates" */
export type ServiceTemplatesInsertInput = {
  bundleDiscountPercentage?: InputMaybe<Scalars['numeric']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  createdByUser?: InputMaybe<UsersObjRelInsertInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** How to calculate template price: sum (add all), fixed (set price), tiered (based on rules) */
  pricingStrategy?: InputMaybe<Scalars['String']['input']>;
  services?: InputMaybe<Scalars['jsonb']['input']>;
  targetClientTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  updatedBy?: InputMaybe<Scalars['uuid']['input']>;
  updatedByUser?: InputMaybe<UsersObjRelInsertInput>;
};

/** order by max() on columns of table "service_templates" */
export type ServiceTemplatesMaxOrderBy = {
  bundleDiscountPercentage?: InputMaybe<OrderBy>;
  category?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  /** How to calculate template price: sum (add all), fixed (set price), tiered (based on rules) */
  pricingStrategy?: InputMaybe<OrderBy>;
  targetClientTypes?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  updatedBy?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "service_templates" */
export type ServiceTemplatesMinOrderBy = {
  bundleDiscountPercentage?: InputMaybe<OrderBy>;
  category?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  /** How to calculate template price: sum (add all), fixed (set price), tiered (based on rules) */
  pricingStrategy?: InputMaybe<OrderBy>;
  targetClientTypes?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  updatedBy?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "service_templates" */
export type ServiceTemplatesOnConflict = {
  constraint: ServiceTemplatesConstraint;
  updateColumns?: Array<ServiceTemplatesUpdateColumn>;
  where?: InputMaybe<ServiceTemplatesBoolExp>;
};

/** Ordering options when selecting data from "service_templates". */
export type ServiceTemplatesOrderBy = {
  bundleDiscountPercentage?: InputMaybe<OrderBy>;
  category?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  createdByUser?: InputMaybe<UsersOrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isPublic?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  pricingStrategy?: InputMaybe<OrderBy>;
  services?: InputMaybe<OrderBy>;
  targetClientTypes?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  updatedBy?: InputMaybe<OrderBy>;
  updatedByUser?: InputMaybe<UsersOrderBy>;
};

/** primary key columns input for table: service_templates */
export type ServiceTemplatesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type ServiceTemplatesPrependInput = {
  services?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "service_templates" */
export type ServiceTemplatesSelectColumn =
  /** column name */
  | 'bundleDiscountPercentage'
  /** column name */
  | 'category'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'isPublic'
  /** column name */
  | 'name'
  /** column name */
  | 'pricingStrategy'
  /** column name */
  | 'services'
  /** column name */
  | 'targetClientTypes'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'updatedBy'
  | '%future added value';

/** select "serviceTemplatesAggregateBoolExpBool_andArgumentsColumns" columns of table "service_templates" */
export type ServiceTemplatesSelectColumnServiceTemplatesAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'isPublic'
  | '%future added value';

/** select "serviceTemplatesAggregateBoolExpBool_orArgumentsColumns" columns of table "service_templates" */
export type ServiceTemplatesSelectColumnServiceTemplatesAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'isPublic'
  | '%future added value';

/** input type for updating data in table "service_templates" */
export type ServiceTemplatesSetInput = {
  bundleDiscountPercentage?: InputMaybe<Scalars['numeric']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** How to calculate template price: sum (add all), fixed (set price), tiered (based on rules) */
  pricingStrategy?: InputMaybe<Scalars['String']['input']>;
  services?: InputMaybe<Scalars['jsonb']['input']>;
  targetClientTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  updatedBy?: InputMaybe<Scalars['uuid']['input']>;
};

/** order by stddev() on columns of table "service_templates" */
export type ServiceTemplatesStddevOrderBy = {
  bundleDiscountPercentage?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "service_templates" */
export type ServiceTemplatesStddevPopOrderBy = {
  bundleDiscountPercentage?: InputMaybe<OrderBy>;
};

/** order by stddevSamp() on columns of table "service_templates" */
export type ServiceTemplatesStddevSampOrderBy = {
  bundleDiscountPercentage?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "service_templates" */
export type ServiceTemplatesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: ServiceTemplatesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ServiceTemplatesStreamCursorValueInput = {
  bundleDiscountPercentage?: InputMaybe<Scalars['numeric']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** How to calculate template price: sum (add all), fixed (set price), tiered (based on rules) */
  pricingStrategy?: InputMaybe<Scalars['String']['input']>;
  services?: InputMaybe<Scalars['jsonb']['input']>;
  targetClientTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  updatedBy?: InputMaybe<Scalars['uuid']['input']>;
};

/** order by sum() on columns of table "service_templates" */
export type ServiceTemplatesSumOrderBy = {
  bundleDiscountPercentage?: InputMaybe<OrderBy>;
};

/** update columns of table "service_templates" */
export type ServiceTemplatesUpdateColumn =
  /** column name */
  | 'bundleDiscountPercentage'
  /** column name */
  | 'category'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'isPublic'
  /** column name */
  | 'name'
  /** column name */
  | 'pricingStrategy'
  /** column name */
  | 'services'
  /** column name */
  | 'targetClientTypes'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'updatedBy'
  | '%future added value';

export type ServiceTemplatesUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<ServiceTemplatesAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<ServiceTemplatesDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<ServiceTemplatesDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<ServiceTemplatesDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<ServiceTemplatesIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<ServiceTemplatesPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ServiceTemplatesSetInput>;
  /** filter the rows which have to be updated */
  where: ServiceTemplatesBoolExp;
};

/** order by varPop() on columns of table "service_templates" */
export type ServiceTemplatesVarPopOrderBy = {
  bundleDiscountPercentage?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "service_templates" */
export type ServiceTemplatesVarSampOrderBy = {
  bundleDiscountPercentage?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "service_templates" */
export type ServiceTemplatesVarianceOrderBy = {
  bundleDiscountPercentage?: InputMaybe<OrderBy>;
};

export type ServicesAggregateBoolExp = {
  bool_and?: InputMaybe<ServicesAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<ServicesAggregateBoolExpBool_Or>;
  count?: InputMaybe<ServicesAggregateBoolExpCount>;
};

/** order by aggregate values of table "services" */
export type ServicesAggregateOrderBy = {
  avg?: InputMaybe<ServicesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ServicesMaxOrderBy>;
  min?: InputMaybe<ServicesMinOrderBy>;
  stddev?: InputMaybe<ServicesStddevOrderBy>;
  stddevPop?: InputMaybe<ServicesStddevPopOrderBy>;
  stddevSamp?: InputMaybe<ServicesStddevSampOrderBy>;
  sum?: InputMaybe<ServicesSumOrderBy>;
  varPop?: InputMaybe<ServicesVarPopOrderBy>;
  varSamp?: InputMaybe<ServicesVarSampOrderBy>;
  variance?: InputMaybe<ServicesVarianceOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type ServicesAppendInput = {
  dependencies?: InputMaybe<Scalars['jsonb']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  /** JSONB field for complex pricing logic */
  pricingRules?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "services" */
export type ServicesArrRelInsertInput = {
  data: Array<ServicesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<ServicesOnConflict>;
};

/** order by avg() on columns of table "services" */
export type ServicesAvgOrderBy = {
  defaultRate?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "services". All fields are combined with a logical 'AND'. */
export type ServicesBoolExp = {
  _and?: InputMaybe<Array<ServicesBoolExp>>;
  _not?: InputMaybe<ServicesBoolExp>;
  _or?: InputMaybe<Array<ServicesBoolExp>>;
  billingItems?: InputMaybe<BillingItemsBoolExp>;
  billingItemsAggregate?: InputMaybe<BillingItemsAggregateBoolExp>;
  billingUnit?: InputMaybe<StringComparisonExp>;
  category?: InputMaybe<StringComparisonExp>;
  clientAgreements?: InputMaybe<ClientServiceAgreementsBoolExp>;
  clientAgreementsAggregate?: InputMaybe<ClientServiceAgreementsAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdBy?: InputMaybe<UuidComparisonExp>;
  createdByUser?: InputMaybe<UsersBoolExp>;
  currency?: InputMaybe<StringComparisonExp>;
  defaultRate?: InputMaybe<NumericComparisonExp>;
  dependencies?: InputMaybe<JsonbComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isActive?: InputMaybe<BooleanComparisonExp>;
  isTemplate?: InputMaybe<BooleanComparisonExp>;
  metadata?: InputMaybe<JsonbComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  pricingRules?: InputMaybe<JsonbComparisonExp>;
  servicePricingRules?: InputMaybe<ServicePricingRulesBoolExp>;
  servicePricingRulesAggregate?: InputMaybe<ServicePricingRulesAggregateBoolExp>;
  serviceType?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  updatedBy?: InputMaybe<UuidComparisonExp>;
  updatedByUser?: InputMaybe<UsersBoolExp>;
};

/** unique or primary key constraints on table "services" */
export type ServicesConstraint =
  /** unique or primary key constraint on columns "name" */
  | 'services_name_key'
  /** unique or primary key constraint on columns "id" */
  | 'services_pkey'
  | '%future added value';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type ServicesDeleteAtPathInput = {
  dependencies?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
  /** JSONB field for complex pricing logic */
  pricingRules?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type ServicesDeleteElemInput = {
  dependencies?: InputMaybe<Scalars['Int']['input']>;
  metadata?: InputMaybe<Scalars['Int']['input']>;
  /** JSONB field for complex pricing logic */
  pricingRules?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type ServicesDeleteKeyInput = {
  dependencies?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  /** JSONB field for complex pricing logic */
  pricingRules?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "services" */
export type ServicesIncInput = {
  defaultRate?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "services" */
export type ServicesInsertInput = {
  billingItems?: InputMaybe<BillingItemsArrRelInsertInput>;
  /** How this service is billed: Per Payroll, Per Employee, Per Hour, etc. */
  billingUnit?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  clientAgreements?: InputMaybe<ClientServiceAgreementsArrRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  createdByUser?: InputMaybe<UsersObjRelInsertInput>;
  currency?: InputMaybe<Scalars['String']['input']>;
  defaultRate?: InputMaybe<Scalars['numeric']['input']>;
  dependencies?: InputMaybe<Scalars['jsonb']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isTemplate?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** JSONB field for complex pricing logic */
  pricingRules?: InputMaybe<Scalars['jsonb']['input']>;
  servicePricingRules?: InputMaybe<ServicePricingRulesArrRelInsertInput>;
  /** standard: regular service, template: reusable template, custom: client-specific */
  serviceType?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  updatedBy?: InputMaybe<Scalars['uuid']['input']>;
  updatedByUser?: InputMaybe<UsersObjRelInsertInput>;
};

/** order by max() on columns of table "services" */
export type ServicesMaxOrderBy = {
  /** How this service is billed: Per Payroll, Per Employee, Per Hour, etc. */
  billingUnit?: InputMaybe<OrderBy>;
  category?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  defaultRate?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  /** standard: regular service, template: reusable template, custom: client-specific */
  serviceType?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  updatedBy?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "services" */
export type ServicesMinOrderBy = {
  /** How this service is billed: Per Payroll, Per Employee, Per Hour, etc. */
  billingUnit?: InputMaybe<OrderBy>;
  category?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  defaultRate?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  /** standard: regular service, template: reusable template, custom: client-specific */
  serviceType?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  updatedBy?: InputMaybe<OrderBy>;
};

/** input type for inserting object relation for remote table "services" */
export type ServicesObjRelInsertInput = {
  data: ServicesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<ServicesOnConflict>;
};

/** on_conflict condition type for table "services" */
export type ServicesOnConflict = {
  constraint: ServicesConstraint;
  updateColumns?: Array<ServicesUpdateColumn>;
  where?: InputMaybe<ServicesBoolExp>;
};

/** Ordering options when selecting data from "services". */
export type ServicesOrderBy = {
  billingItemsAggregate?: InputMaybe<BillingItemsAggregateOrderBy>;
  billingUnit?: InputMaybe<OrderBy>;
  category?: InputMaybe<OrderBy>;
  clientAgreementsAggregate?: InputMaybe<ClientServiceAgreementsAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  createdByUser?: InputMaybe<UsersOrderBy>;
  currency?: InputMaybe<OrderBy>;
  defaultRate?: InputMaybe<OrderBy>;
  dependencies?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  isTemplate?: InputMaybe<OrderBy>;
  metadata?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  pricingRules?: InputMaybe<OrderBy>;
  servicePricingRulesAggregate?: InputMaybe<ServicePricingRulesAggregateOrderBy>;
  serviceType?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  updatedBy?: InputMaybe<OrderBy>;
  updatedByUser?: InputMaybe<UsersOrderBy>;
};

/** primary key columns input for table: services */
export type ServicesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type ServicesPrependInput = {
  dependencies?: InputMaybe<Scalars['jsonb']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  /** JSONB field for complex pricing logic */
  pricingRules?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "services" */
export type ServicesSelectColumn =
  /** column name */
  | 'billingUnit'
  /** column name */
  | 'category'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'currency'
  /** column name */
  | 'defaultRate'
  /** column name */
  | 'dependencies'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isTemplate'
  /** column name */
  | 'metadata'
  /** column name */
  | 'name'
  /** column name */
  | 'pricingRules'
  /** column name */
  | 'serviceType'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'updatedBy'
  | '%future added value';

/** select "servicesAggregateBoolExpBool_andArgumentsColumns" columns of table "services" */
export type ServicesSelectColumnServicesAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'isActive'
  /** column name */
  | 'isTemplate'
  | '%future added value';

/** select "servicesAggregateBoolExpBool_orArgumentsColumns" columns of table "services" */
export type ServicesSelectColumnServicesAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'isActive'
  /** column name */
  | 'isTemplate'
  | '%future added value';

/** input type for updating data in table "services" */
export type ServicesSetInput = {
  /** How this service is billed: Per Payroll, Per Employee, Per Hour, etc. */
  billingUnit?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  defaultRate?: InputMaybe<Scalars['numeric']['input']>;
  dependencies?: InputMaybe<Scalars['jsonb']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isTemplate?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** JSONB field for complex pricing logic */
  pricingRules?: InputMaybe<Scalars['jsonb']['input']>;
  /** standard: regular service, template: reusable template, custom: client-specific */
  serviceType?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  updatedBy?: InputMaybe<Scalars['uuid']['input']>;
};

/** order by stddev() on columns of table "services" */
export type ServicesStddevOrderBy = {
  defaultRate?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "services" */
export type ServicesStddevPopOrderBy = {
  defaultRate?: InputMaybe<OrderBy>;
};

/** order by stddevSamp() on columns of table "services" */
export type ServicesStddevSampOrderBy = {
  defaultRate?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "services" */
export type ServicesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: ServicesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ServicesStreamCursorValueInput = {
  /** How this service is billed: Per Payroll, Per Employee, Per Hour, etc. */
  billingUnit?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  defaultRate?: InputMaybe<Scalars['numeric']['input']>;
  dependencies?: InputMaybe<Scalars['jsonb']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isTemplate?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  /** JSONB field for complex pricing logic */
  pricingRules?: InputMaybe<Scalars['jsonb']['input']>;
  /** standard: regular service, template: reusable template, custom: client-specific */
  serviceType?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  updatedBy?: InputMaybe<Scalars['uuid']['input']>;
};

/** order by sum() on columns of table "services" */
export type ServicesSumOrderBy = {
  defaultRate?: InputMaybe<OrderBy>;
};

/** update columns of table "services" */
export type ServicesUpdateColumn =
  /** column name */
  | 'billingUnit'
  /** column name */
  | 'category'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'currency'
  /** column name */
  | 'defaultRate'
  /** column name */
  | 'dependencies'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isTemplate'
  /** column name */
  | 'metadata'
  /** column name */
  | 'name'
  /** column name */
  | 'pricingRules'
  /** column name */
  | 'serviceType'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'updatedBy'
  | '%future added value';

export type ServicesUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<ServicesAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<ServicesDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<ServicesDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<ServicesDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<ServicesIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<ServicesPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ServicesSetInput>;
  /** filter the rows which have to be updated */
  where: ServicesBoolExp;
};

/** order by varPop() on columns of table "services" */
export type ServicesVarPopOrderBy = {
  defaultRate?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "services" */
export type ServicesVarSampOrderBy = {
  defaultRate?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "services" */
export type ServicesVarianceOrderBy = {
  defaultRate?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "staff_billing_performance". All fields are combined with a logical 'AND'. */
export type StaffBillingPerformanceBoolExp = {
  _and?: InputMaybe<Array<StaffBillingPerformanceBoolExp>>;
  _not?: InputMaybe<StaffBillingPerformanceBoolExp>;
  _or?: InputMaybe<Array<StaffBillingPerformanceBoolExp>>;
  averageProfitMargin?: InputMaybe<NumericComparisonExp>;
  staffName?: InputMaybe<StringComparisonExp>;
  staffUserId?: InputMaybe<UuidComparisonExp>;
  totalActualRevenue?: InputMaybe<NumericComparisonExp>;
  totalEstimatedRevenue?: InputMaybe<NumericComparisonExp>;
  totalHoursLogged?: InputMaybe<NumericComparisonExp>;
  totalPayrolls?: InputMaybe<BigintComparisonExp>;
};

/** Ordering options when selecting data from "staff_billing_performance". */
export type StaffBillingPerformanceOrderBy = {
  averageProfitMargin?: InputMaybe<OrderBy>;
  staffName?: InputMaybe<OrderBy>;
  staffUserId?: InputMaybe<OrderBy>;
  totalActualRevenue?: InputMaybe<OrderBy>;
  totalEstimatedRevenue?: InputMaybe<OrderBy>;
  totalHoursLogged?: InputMaybe<OrderBy>;
  totalPayrolls?: InputMaybe<OrderBy>;
};

/** select columns of table "staff_billing_performance" */
export type StaffBillingPerformanceSelectColumn =
  /** column name */
  | 'averageProfitMargin'
  /** column name */
  | 'staffName'
  /** column name */
  | 'staffUserId'
  /** column name */
  | 'totalActualRevenue'
  /** column name */
  | 'totalEstimatedRevenue'
  /** column name */
  | 'totalHoursLogged'
  /** column name */
  | 'totalPayrolls'
  | '%future added value';

/** Streaming cursor of the table "staff_billing_performance" */
export type StaffBillingPerformanceStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: StaffBillingPerformanceStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type StaffBillingPerformanceStreamCursorValueInput = {
  averageProfitMargin?: InputMaybe<Scalars['numeric']['input']>;
  staffName?: InputMaybe<Scalars['String']['input']>;
  staffUserId?: InputMaybe<Scalars['uuid']['input']>;
  totalActualRevenue?: InputMaybe<Scalars['numeric']['input']>;
  totalEstimatedRevenue?: InputMaybe<Scalars['numeric']['input']>;
  totalHoursLogged?: InputMaybe<Scalars['numeric']['input']>;
  totalPayrolls?: InputMaybe<Scalars['bigint']['input']>;
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

/** append existing jsonb value of filtered columns with new jsonb value */
export type SystemConfigurationAppendInput = {
  configValue?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "system_configuration". All fields are combined with a logical 'AND'. */
export type SystemConfigurationBoolExp = {
  _and?: InputMaybe<Array<SystemConfigurationBoolExp>>;
  _not?: InputMaybe<SystemConfigurationBoolExp>;
  _or?: InputMaybe<Array<SystemConfigurationBoolExp>>;
  configKey?: InputMaybe<StringComparisonExp>;
  configType?: InputMaybe<StringComparisonExp>;
  configValue?: InputMaybe<JsonbComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isActive?: InputMaybe<BooleanComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "system_configuration" */
export type SystemConfigurationConstraint =
  /** unique or primary key constraint on columns "config_key" */
  | 'system_configuration_config_key_key'
  /** unique or primary key constraint on columns "id" */
  | 'system_configuration_pkey'
  | '%future added value';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type SystemConfigurationDeleteAtPathInput = {
  configValue?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type SystemConfigurationDeleteElemInput = {
  configValue?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type SystemConfigurationDeleteKeyInput = {
  configValue?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "system_configuration" */
export type SystemConfigurationInsertInput = {
  configKey?: InputMaybe<Scalars['String']['input']>;
  configType?: InputMaybe<Scalars['String']['input']>;
  configValue?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** on_conflict condition type for table "system_configuration" */
export type SystemConfigurationOnConflict = {
  constraint: SystemConfigurationConstraint;
  updateColumns?: Array<SystemConfigurationUpdateColumn>;
  where?: InputMaybe<SystemConfigurationBoolExp>;
};

/** Ordering options when selecting data from "system_configuration". */
export type SystemConfigurationOrderBy = {
  configKey?: InputMaybe<OrderBy>;
  configType?: InputMaybe<OrderBy>;
  configValue?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: system_configuration */
export type SystemConfigurationPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type SystemConfigurationPrependInput = {
  configValue?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "system_configuration" */
export type SystemConfigurationSelectColumn =
  /** column name */
  | 'configKey'
  /** column name */
  | 'configType'
  /** column name */
  | 'configValue'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'updatedAt'
  | '%future added value';

/** input type for updating data in table "system_configuration" */
export type SystemConfigurationSetInput = {
  configKey?: InputMaybe<Scalars['String']['input']>;
  configType?: InputMaybe<Scalars['String']['input']>;
  configValue?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "system_configuration" */
export type SystemConfigurationStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: SystemConfigurationStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type SystemConfigurationStreamCursorValueInput = {
  configKey?: InputMaybe<Scalars['String']['input']>;
  configType?: InputMaybe<Scalars['String']['input']>;
  configValue?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "system_configuration" */
export type SystemConfigurationUpdateColumn =
  /** column name */
  | 'configKey'
  /** column name */
  | 'configType'
  /** column name */
  | 'configValue'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type SystemConfigurationUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<SystemConfigurationAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<SystemConfigurationDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<SystemConfigurationDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<SystemConfigurationDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<SystemConfigurationPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<SystemConfigurationSetInput>;
  /** filter the rows which have to be updated */
  where: SystemConfigurationBoolExp;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type SystemHealthAppendInput = {
  alerts?: InputMaybe<Scalars['jsonb']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "system_health". All fields are combined with a logical 'AND'. */
export type SystemHealthBoolExp = {
  _and?: InputMaybe<Array<SystemHealthBoolExp>>;
  _not?: InputMaybe<SystemHealthBoolExp>;
  _or?: InputMaybe<Array<SystemHealthBoolExp>>;
  activeUsers?: InputMaybe<IntComparisonExp>;
  alerts?: InputMaybe<JsonbComparisonExp>;
  apiResponseTime?: InputMaybe<IntComparisonExp>;
  cpuUsage?: InputMaybe<NumericComparisonExp>;
  databaseResponseTime?: InputMaybe<IntComparisonExp>;
  diskUsage?: InputMaybe<NumericComparisonExp>;
  errorRate?: InputMaybe<NumericComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  memoryUsage?: InputMaybe<NumericComparisonExp>;
  metadata?: InputMaybe<JsonbComparisonExp>;
  status?: InputMaybe<StringComparisonExp>;
  timestamp?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "system_health" */
export type SystemHealthConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'system_health_pkey'
  | '%future added value';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type SystemHealthDeleteAtPathInput = {
  alerts?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type SystemHealthDeleteElemInput = {
  alerts?: InputMaybe<Scalars['Int']['input']>;
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type SystemHealthDeleteKeyInput = {
  alerts?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "system_health" */
export type SystemHealthIncInput = {
  activeUsers?: InputMaybe<Scalars['Int']['input']>;
  apiResponseTime?: InputMaybe<Scalars['Int']['input']>;
  cpuUsage?: InputMaybe<Scalars['numeric']['input']>;
  databaseResponseTime?: InputMaybe<Scalars['Int']['input']>;
  diskUsage?: InputMaybe<Scalars['numeric']['input']>;
  errorRate?: InputMaybe<Scalars['numeric']['input']>;
  memoryUsage?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "system_health" */
export type SystemHealthInsertInput = {
  activeUsers?: InputMaybe<Scalars['Int']['input']>;
  alerts?: InputMaybe<Scalars['jsonb']['input']>;
  apiResponseTime?: InputMaybe<Scalars['Int']['input']>;
  cpuUsage?: InputMaybe<Scalars['numeric']['input']>;
  databaseResponseTime?: InputMaybe<Scalars['Int']['input']>;
  diskUsage?: InputMaybe<Scalars['numeric']['input']>;
  errorRate?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  memoryUsage?: InputMaybe<Scalars['numeric']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** on_conflict condition type for table "system_health" */
export type SystemHealthOnConflict = {
  constraint: SystemHealthConstraint;
  updateColumns?: Array<SystemHealthUpdateColumn>;
  where?: InputMaybe<SystemHealthBoolExp>;
};

/** Ordering options when selecting data from "system_health". */
export type SystemHealthOrderBy = {
  activeUsers?: InputMaybe<OrderBy>;
  alerts?: InputMaybe<OrderBy>;
  apiResponseTime?: InputMaybe<OrderBy>;
  cpuUsage?: InputMaybe<OrderBy>;
  databaseResponseTime?: InputMaybe<OrderBy>;
  diskUsage?: InputMaybe<OrderBy>;
  errorRate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  memoryUsage?: InputMaybe<OrderBy>;
  metadata?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: system_health */
export type SystemHealthPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type SystemHealthPrependInput = {
  alerts?: InputMaybe<Scalars['jsonb']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "system_health" */
export type SystemHealthSelectColumn =
  /** column name */
  | 'activeUsers'
  /** column name */
  | 'alerts'
  /** column name */
  | 'apiResponseTime'
  /** column name */
  | 'cpuUsage'
  /** column name */
  | 'databaseResponseTime'
  /** column name */
  | 'diskUsage'
  /** column name */
  | 'errorRate'
  /** column name */
  | 'id'
  /** column name */
  | 'memoryUsage'
  /** column name */
  | 'metadata'
  /** column name */
  | 'status'
  /** column name */
  | 'timestamp'
  | '%future added value';

/** input type for updating data in table "system_health" */
export type SystemHealthSetInput = {
  activeUsers?: InputMaybe<Scalars['Int']['input']>;
  alerts?: InputMaybe<Scalars['jsonb']['input']>;
  apiResponseTime?: InputMaybe<Scalars['Int']['input']>;
  cpuUsage?: InputMaybe<Scalars['numeric']['input']>;
  databaseResponseTime?: InputMaybe<Scalars['Int']['input']>;
  diskUsage?: InputMaybe<Scalars['numeric']['input']>;
  errorRate?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  memoryUsage?: InputMaybe<Scalars['numeric']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "system_health" */
export type SystemHealthStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: SystemHealthStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type SystemHealthStreamCursorValueInput = {
  activeUsers?: InputMaybe<Scalars['Int']['input']>;
  alerts?: InputMaybe<Scalars['jsonb']['input']>;
  apiResponseTime?: InputMaybe<Scalars['Int']['input']>;
  cpuUsage?: InputMaybe<Scalars['numeric']['input']>;
  databaseResponseTime?: InputMaybe<Scalars['Int']['input']>;
  diskUsage?: InputMaybe<Scalars['numeric']['input']>;
  errorRate?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  memoryUsage?: InputMaybe<Scalars['numeric']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "system_health" */
export type SystemHealthUpdateColumn =
  /** column name */
  | 'activeUsers'
  /** column name */
  | 'alerts'
  /** column name */
  | 'apiResponseTime'
  /** column name */
  | 'cpuUsage'
  /** column name */
  | 'databaseResponseTime'
  /** column name */
  | 'diskUsage'
  /** column name */
  | 'errorRate'
  /** column name */
  | 'id'
  /** column name */
  | 'memoryUsage'
  /** column name */
  | 'metadata'
  /** column name */
  | 'status'
  /** column name */
  | 'timestamp'
  | '%future added value';

export type SystemHealthUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<SystemHealthAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<SystemHealthDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<SystemHealthDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<SystemHealthDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<SystemHealthIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<SystemHealthPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<SystemHealthSetInput>;
  /** filter the rows which have to be updated */
  where: SystemHealthBoolExp;
};

/** Boolean expression to filter rows from the table "team_capacity_by_position". All fields are combined with a logical 'AND'. */
export type TeamCapacityByPositionBoolExp = {
  _and?: InputMaybe<Array<TeamCapacityByPositionBoolExp>>;
  _not?: InputMaybe<TeamCapacityByPositionBoolExp>;
  _or?: InputMaybe<Array<TeamCapacityByPositionBoolExp>>;
  avgAdminPercentage?: InputMaybe<NumericComparisonExp>;
  consultantCount?: InputMaybe<BigintComparisonExp>;
  position?: InputMaybe<UserPositionComparisonExp>;
  totalAdminHours?: InputMaybe<NumericComparisonExp>;
  totalPayrollCapacity?: InputMaybe<NumericComparisonExp>;
  totalWorkHours?: InputMaybe<NumericComparisonExp>;
};

/** Ordering options when selecting data from "team_capacity_by_position". */
export type TeamCapacityByPositionOrderBy = {
  avgAdminPercentage?: InputMaybe<OrderBy>;
  consultantCount?: InputMaybe<OrderBy>;
  position?: InputMaybe<OrderBy>;
  totalAdminHours?: InputMaybe<OrderBy>;
  totalPayrollCapacity?: InputMaybe<OrderBy>;
  totalWorkHours?: InputMaybe<OrderBy>;
};

/** select columns of table "team_capacity_by_position" */
export type TeamCapacityByPositionSelectColumn =
  /** column name */
  | 'avgAdminPercentage'
  /** column name */
  | 'consultantCount'
  /** column name */
  | 'position'
  /** column name */
  | 'totalAdminHours'
  /** column name */
  | 'totalPayrollCapacity'
  /** column name */
  | 'totalWorkHours'
  | '%future added value';

/** Streaming cursor of the table "team_capacity_by_position" */
export type TeamCapacityByPositionStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: TeamCapacityByPositionStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TeamCapacityByPositionStreamCursorValueInput = {
  avgAdminPercentage?: InputMaybe<Scalars['numeric']['input']>;
  consultantCount?: InputMaybe<Scalars['bigint']['input']>;
  position?: InputMaybe<Scalars['user_position']['input']>;
  totalAdminHours?: InputMaybe<Scalars['numeric']['input']>;
  totalPayrollCapacity?: InputMaybe<Scalars['numeric']['input']>;
  totalWorkHours?: InputMaybe<Scalars['numeric']['input']>;
};

export type TimeEntriesAggregateBoolExp = {
  count?: InputMaybe<TimeEntriesAggregateBoolExpCount>;
};

/** order by aggregate values of table "time_entries" */
export type TimeEntriesAggregateOrderBy = {
  avg?: InputMaybe<TimeEntriesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<TimeEntriesMaxOrderBy>;
  min?: InputMaybe<TimeEntriesMinOrderBy>;
  stddev?: InputMaybe<TimeEntriesStddevOrderBy>;
  stddevPop?: InputMaybe<TimeEntriesStddevPopOrderBy>;
  stddevSamp?: InputMaybe<TimeEntriesStddevSampOrderBy>;
  sum?: InputMaybe<TimeEntriesSumOrderBy>;
  varPop?: InputMaybe<TimeEntriesVarPopOrderBy>;
  varSamp?: InputMaybe<TimeEntriesVarSampOrderBy>;
  variance?: InputMaybe<TimeEntriesVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "time_entries" */
export type TimeEntriesArrRelInsertInput = {
  data: Array<TimeEntriesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<TimeEntriesOnConflict>;
};

/** order by avg() on columns of table "time_entries" */
export type TimeEntriesAvgOrderBy = {
  /** Hours spent on this work */
  hoursSpent?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "time_entries". All fields are combined with a logical 'AND'. */
export type TimeEntriesBoolExp = {
  _and?: InputMaybe<Array<TimeEntriesBoolExp>>;
  _not?: InputMaybe<TimeEntriesBoolExp>;
  _or?: InputMaybe<Array<TimeEntriesBoolExp>>;
  billingItem?: InputMaybe<BillingItemsBoolExp>;
  billingItemId?: InputMaybe<UuidComparisonExp>;
  client?: InputMaybe<ClientsBoolExp>;
  clientId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  hoursSpent?: InputMaybe<NumericComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  payroll?: InputMaybe<PayrollsBoolExp>;
  payrollDate?: InputMaybe<PayrollDatesBoolExp>;
  payrollDateId?: InputMaybe<UuidComparisonExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  staffUser?: InputMaybe<UsersBoolExp>;
  staffUserId?: InputMaybe<UuidComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  workDate?: InputMaybe<DateComparisonExp>;
};

/** unique or primary key constraints on table "time_entries" */
export type TimeEntriesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'time_entries_pkey'
  | '%future added value';

/** input type for incrementing numeric columns in table "time_entries" */
export type TimeEntriesIncInput = {
  /** Hours spent on this work */
  hoursSpent?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "time_entries" */
export type TimeEntriesInsertInput = {
  billingItem?: InputMaybe<BillingItemsObjRelInsertInput>;
  /** Billing item this time relates to */
  billingItemId?: InputMaybe<Scalars['uuid']['input']>;
  client?: InputMaybe<ClientsObjRelInsertInput>;
  /** Client this work was for */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Description of work performed */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Hours spent on this work */
  hoursSpent?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payroll?: InputMaybe<PayrollsObjRelInsertInput>;
  payrollDate?: InputMaybe<PayrollDatesObjRelInsertInput>;
  /** Links time entry to a specific payroll date/EFT cycle instead of just the overall payroll. Enables date-specific time tracking. */
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  /** Specific payroll job this relates to */
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  staffUser?: InputMaybe<UsersObjRelInsertInput>;
  /** Staff member who worked on this */
  staffUserId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Date the work was performed */
  workDate?: InputMaybe<Scalars['date']['input']>;
};

/** order by max() on columns of table "time_entries" */
export type TimeEntriesMaxOrderBy = {
  /** Billing item this time relates to */
  billingItemId?: InputMaybe<OrderBy>;
  /** Client this work was for */
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  /** Description of work performed */
  description?: InputMaybe<OrderBy>;
  /** Hours spent on this work */
  hoursSpent?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  /** Links time entry to a specific payroll date/EFT cycle instead of just the overall payroll. Enables date-specific time tracking. */
  payrollDateId?: InputMaybe<OrderBy>;
  /** Specific payroll job this relates to */
  payrollId?: InputMaybe<OrderBy>;
  /** Staff member who worked on this */
  staffUserId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  /** Date the work was performed */
  workDate?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "time_entries" */
export type TimeEntriesMinOrderBy = {
  /** Billing item this time relates to */
  billingItemId?: InputMaybe<OrderBy>;
  /** Client this work was for */
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  /** Description of work performed */
  description?: InputMaybe<OrderBy>;
  /** Hours spent on this work */
  hoursSpent?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  /** Links time entry to a specific payroll date/EFT cycle instead of just the overall payroll. Enables date-specific time tracking. */
  payrollDateId?: InputMaybe<OrderBy>;
  /** Specific payroll job this relates to */
  payrollId?: InputMaybe<OrderBy>;
  /** Staff member who worked on this */
  staffUserId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  /** Date the work was performed */
  workDate?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "time_entries" */
export type TimeEntriesOnConflict = {
  constraint: TimeEntriesConstraint;
  updateColumns?: Array<TimeEntriesUpdateColumn>;
  where?: InputMaybe<TimeEntriesBoolExp>;
};

/** Ordering options when selecting data from "time_entries". */
export type TimeEntriesOrderBy = {
  billingItem?: InputMaybe<BillingItemsOrderBy>;
  billingItemId?: InputMaybe<OrderBy>;
  client?: InputMaybe<ClientsOrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  hoursSpent?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payroll?: InputMaybe<PayrollsOrderBy>;
  payrollDate?: InputMaybe<PayrollDatesOrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  staffUser?: InputMaybe<UsersOrderBy>;
  staffUserId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  workDate?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: time_entries */
export type TimeEntriesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "time_entries" */
export type TimeEntriesSelectColumn =
  /** column name */
  | 'billingItemId'
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'hoursSpent'
  /** column name */
  | 'id'
  /** column name */
  | 'payrollDateId'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'staffUserId'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'workDate'
  | '%future added value';

/** input type for updating data in table "time_entries" */
export type TimeEntriesSetInput = {
  /** Billing item this time relates to */
  billingItemId?: InputMaybe<Scalars['uuid']['input']>;
  /** Client this work was for */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Description of work performed */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Hours spent on this work */
  hoursSpent?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Links time entry to a specific payroll date/EFT cycle instead of just the overall payroll. Enables date-specific time tracking. */
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  /** Specific payroll job this relates to */
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  /** Staff member who worked on this */
  staffUserId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Date the work was performed */
  workDate?: InputMaybe<Scalars['date']['input']>;
};

/** order by stddev() on columns of table "time_entries" */
export type TimeEntriesStddevOrderBy = {
  /** Hours spent on this work */
  hoursSpent?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "time_entries" */
export type TimeEntriesStddevPopOrderBy = {
  /** Hours spent on this work */
  hoursSpent?: InputMaybe<OrderBy>;
};

/** order by stddevSamp() on columns of table "time_entries" */
export type TimeEntriesStddevSampOrderBy = {
  /** Hours spent on this work */
  hoursSpent?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "time_entries" */
export type TimeEntriesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: TimeEntriesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimeEntriesStreamCursorValueInput = {
  /** Billing item this time relates to */
  billingItemId?: InputMaybe<Scalars['uuid']['input']>;
  /** Client this work was for */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Description of work performed */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Hours spent on this work */
  hoursSpent?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Links time entry to a specific payroll date/EFT cycle instead of just the overall payroll. Enables date-specific time tracking. */
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  /** Specific payroll job this relates to */
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  /** Staff member who worked on this */
  staffUserId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Date the work was performed */
  workDate?: InputMaybe<Scalars['date']['input']>;
};

/** order by sum() on columns of table "time_entries" */
export type TimeEntriesSumOrderBy = {
  /** Hours spent on this work */
  hoursSpent?: InputMaybe<OrderBy>;
};

/** update columns of table "time_entries" */
export type TimeEntriesUpdateColumn =
  /** column name */
  | 'billingItemId'
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'hoursSpent'
  /** column name */
  | 'id'
  /** column name */
  | 'payrollDateId'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'staffUserId'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'workDate'
  | '%future added value';

export type TimeEntriesUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<TimeEntriesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<TimeEntriesSetInput>;
  /** filter the rows which have to be updated */
  where: TimeEntriesBoolExp;
};

/** order by varPop() on columns of table "time_entries" */
export type TimeEntriesVarPopOrderBy = {
  /** Hours spent on this work */
  hoursSpent?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "time_entries" */
export type TimeEntriesVarSampOrderBy = {
  /** Hours spent on this work */
  hoursSpent?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "time_entries" */
export type TimeEntriesVarianceOrderBy = {
  /** Hours spent on this work */
  hoursSpent?: InputMaybe<OrderBy>;
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

export type UserEmailTemplateFavoritesAggregateBoolExp = {
  count?: InputMaybe<UserEmailTemplateFavoritesAggregateBoolExpCount>;
};

/** order by aggregate values of table "user_email_template_favorites" */
export type UserEmailTemplateFavoritesAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<UserEmailTemplateFavoritesMaxOrderBy>;
  min?: InputMaybe<UserEmailTemplateFavoritesMinOrderBy>;
};

/** input type for inserting array relation for remote table "user_email_template_favorites" */
export type UserEmailTemplateFavoritesArrRelInsertInput = {
  data: Array<UserEmailTemplateFavoritesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<UserEmailTemplateFavoritesOnConflict>;
};

/** Boolean expression to filter rows from the table "user_email_template_favorites". All fields are combined with a logical 'AND'. */
export type UserEmailTemplateFavoritesBoolExp = {
  _and?: InputMaybe<Array<UserEmailTemplateFavoritesBoolExp>>;
  _not?: InputMaybe<UserEmailTemplateFavoritesBoolExp>;
  _or?: InputMaybe<Array<UserEmailTemplateFavoritesBoolExp>>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  emailTemplate?: InputMaybe<EmailTemplatesBoolExp>;
  id?: InputMaybe<UuidComparisonExp>;
  templateId?: InputMaybe<UuidComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "user_email_template_favorites" */
export type UserEmailTemplateFavoritesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'user_email_template_favorites_pkey'
  /** unique or primary key constraint on columns "user_id", "template_id" */
  | 'user_email_template_favorites_user_id_template_id_key'
  | '%future added value';

/** input type for inserting data into table "user_email_template_favorites" */
export type UserEmailTemplateFavoritesInsertInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  emailTemplate?: InputMaybe<EmailTemplatesObjRelInsertInput>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  templateId?: InputMaybe<Scalars['uuid']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** order by max() on columns of table "user_email_template_favorites" */
export type UserEmailTemplateFavoritesMaxOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  templateId?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "user_email_template_favorites" */
export type UserEmailTemplateFavoritesMinOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  templateId?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "user_email_template_favorites" */
export type UserEmailTemplateFavoritesOnConflict = {
  constraint: UserEmailTemplateFavoritesConstraint;
  updateColumns?: Array<UserEmailTemplateFavoritesUpdateColumn>;
  where?: InputMaybe<UserEmailTemplateFavoritesBoolExp>;
};

/** Ordering options when selecting data from "user_email_template_favorites". */
export type UserEmailTemplateFavoritesOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  emailTemplate?: InputMaybe<EmailTemplatesOrderBy>;
  id?: InputMaybe<OrderBy>;
  templateId?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: user_email_template_favorites */
export type UserEmailTemplateFavoritesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "user_email_template_favorites" */
export type UserEmailTemplateFavoritesSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'templateId'
  /** column name */
  | 'userId'
  | '%future added value';

/** input type for updating data in table "user_email_template_favorites" */
export type UserEmailTemplateFavoritesSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  templateId?: InputMaybe<Scalars['uuid']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "user_email_template_favorites" */
export type UserEmailTemplateFavoritesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: UserEmailTemplateFavoritesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type UserEmailTemplateFavoritesStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  templateId?: InputMaybe<Scalars['uuid']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "user_email_template_favorites" */
export type UserEmailTemplateFavoritesUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'templateId'
  /** column name */
  | 'userId'
  | '%future added value';

export type UserEmailTemplateFavoritesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UserEmailTemplateFavoritesSetInput>;
  /** filter the rows which have to be updated */
  where: UserEmailTemplateFavoritesBoolExp;
};

export type UserInvitationsAggregateBoolExp = {
  count?: InputMaybe<UserInvitationsAggregateBoolExpCount>;
};

/** order by aggregate values of table "user_invitations" */
export type UserInvitationsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<UserInvitationsMaxOrderBy>;
  min?: InputMaybe<UserInvitationsMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type UserInvitationsAppendInput = {
  invitationMetadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "user_invitations" */
export type UserInvitationsArrRelInsertInput = {
  data: Array<UserInvitationsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<UserInvitationsOnConflict>;
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
  invitationStatus?: InputMaybe<InvitationStatusEnumComparisonExp>;
  invitedAt?: InputMaybe<TimestamptzComparisonExp>;
  invitedBy?: InputMaybe<UuidComparisonExp>;
  invitedByUser?: InputMaybe<UsersBoolExp>;
  invitedRole?: InputMaybe<StringComparisonExp>;
  lastName?: InputMaybe<StringComparisonExp>;
  managerId?: InputMaybe<UuidComparisonExp>;
  managerUser?: InputMaybe<UsersBoolExp>;
  revokeReason?: InputMaybe<StringComparisonExp>;
  revokedAt?: InputMaybe<TimestamptzComparisonExp>;
  revokedBy?: InputMaybe<UuidComparisonExp>;
  revokedByUser?: InputMaybe<UsersBoolExp>;
  status?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "user_invitations" */
export type UserInvitationsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'user_invitations_pkey'
  | '%future added value';

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
  invitationStatus?: InputMaybe<Scalars['invitation_status_enum']['input']>;
  invitedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  invitedBy?: InputMaybe<Scalars['uuid']['input']>;
  invitedByUser?: InputMaybe<UsersObjRelInsertInput>;
  invitedRole?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  managerId?: InputMaybe<Scalars['uuid']['input']>;
  managerUser?: InputMaybe<UsersObjRelInsertInput>;
  revokeReason?: InputMaybe<Scalars['String']['input']>;
  revokedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  revokedBy?: InputMaybe<Scalars['uuid']['input']>;
  revokedByUser?: InputMaybe<UsersObjRelInsertInput>;
  status?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by max() on columns of table "user_invitations" */
export type UserInvitationsMaxOrderBy = {
  acceptedAt?: InputMaybe<OrderBy>;
  acceptedBy?: InputMaybe<OrderBy>;
  clerkInvitationId?: InputMaybe<OrderBy>;
  clerkTicket?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  expiresAt?: InputMaybe<OrderBy>;
  firstName?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invitationStatus?: InputMaybe<OrderBy>;
  invitedAt?: InputMaybe<OrderBy>;
  invitedBy?: InputMaybe<OrderBy>;
  invitedRole?: InputMaybe<OrderBy>;
  lastName?: InputMaybe<OrderBy>;
  managerId?: InputMaybe<OrderBy>;
  revokeReason?: InputMaybe<OrderBy>;
  revokedAt?: InputMaybe<OrderBy>;
  revokedBy?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "user_invitations" */
export type UserInvitationsMinOrderBy = {
  acceptedAt?: InputMaybe<OrderBy>;
  acceptedBy?: InputMaybe<OrderBy>;
  clerkInvitationId?: InputMaybe<OrderBy>;
  clerkTicket?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  expiresAt?: InputMaybe<OrderBy>;
  firstName?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invitationStatus?: InputMaybe<OrderBy>;
  invitedAt?: InputMaybe<OrderBy>;
  invitedBy?: InputMaybe<OrderBy>;
  invitedRole?: InputMaybe<OrderBy>;
  lastName?: InputMaybe<OrderBy>;
  managerId?: InputMaybe<OrderBy>;
  revokeReason?: InputMaybe<OrderBy>;
  revokedAt?: InputMaybe<OrderBy>;
  revokedBy?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
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
  invitationStatus?: InputMaybe<OrderBy>;
  invitedAt?: InputMaybe<OrderBy>;
  invitedBy?: InputMaybe<OrderBy>;
  invitedByUser?: InputMaybe<UsersOrderBy>;
  invitedRole?: InputMaybe<OrderBy>;
  lastName?: InputMaybe<OrderBy>;
  managerId?: InputMaybe<OrderBy>;
  managerUser?: InputMaybe<UsersOrderBy>;
  revokeReason?: InputMaybe<OrderBy>;
  revokedAt?: InputMaybe<OrderBy>;
  revokedBy?: InputMaybe<OrderBy>;
  revokedByUser?: InputMaybe<UsersOrderBy>;
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
export type UserInvitationsSelectColumn =
  /** column name */
  | 'acceptedAt'
  /** column name */
  | 'acceptedBy'
  /** column name */
  | 'clerkInvitationId'
  /** column name */
  | 'clerkTicket'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'email'
  /** column name */
  | 'expiresAt'
  /** column name */
  | 'firstName'
  /** column name */
  | 'id'
  /** column name */
  | 'invitationMetadata'
  /** column name */
  | 'invitationStatus'
  /** column name */
  | 'invitedAt'
  /** column name */
  | 'invitedBy'
  /** column name */
  | 'invitedRole'
  /** column name */
  | 'lastName'
  /** column name */
  | 'managerId'
  /** column name */
  | 'revokeReason'
  /** column name */
  | 'revokedAt'
  /** column name */
  | 'revokedBy'
  /** column name */
  | 'status'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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
  invitationStatus?: InputMaybe<Scalars['invitation_status_enum']['input']>;
  invitedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  invitedBy?: InputMaybe<Scalars['uuid']['input']>;
  invitedRole?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  managerId?: InputMaybe<Scalars['uuid']['input']>;
  revokeReason?: InputMaybe<Scalars['String']['input']>;
  revokedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  revokedBy?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "user_invitations" */
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
  invitationStatus?: InputMaybe<Scalars['invitation_status_enum']['input']>;
  invitedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  invitedBy?: InputMaybe<Scalars['uuid']['input']>;
  invitedRole?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  managerId?: InputMaybe<Scalars['uuid']['input']>;
  revokeReason?: InputMaybe<Scalars['String']['input']>;
  revokedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  revokedBy?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "user_invitations" */
export type UserInvitationsUpdateColumn =
  /** column name */
  | 'acceptedAt'
  /** column name */
  | 'acceptedBy'
  /** column name */
  | 'clerkInvitationId'
  /** column name */
  | 'clerkTicket'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'email'
  /** column name */
  | 'expiresAt'
  /** column name */
  | 'firstName'
  /** column name */
  | 'id'
  /** column name */
  | 'invitationMetadata'
  /** column name */
  | 'invitationStatus'
  /** column name */
  | 'invitedAt'
  /** column name */
  | 'invitedBy'
  /** column name */
  | 'invitedRole'
  /** column name */
  | 'lastName'
  /** column name */
  | 'managerId'
  /** column name */
  | 'revokeReason'
  /** column name */
  | 'revokedAt'
  /** column name */
  | 'revokedBy'
  /** column name */
  | 'status'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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

/** Boolean expression to compare columns of type "user_position". All fields are combined with logical 'AND'. */
export type UserPositionComparisonExp = {
  _eq?: InputMaybe<Scalars['user_position']['input']>;
  _gt?: InputMaybe<Scalars['user_position']['input']>;
  _gte?: InputMaybe<Scalars['user_position']['input']>;
  _in?: InputMaybe<Array<Scalars['user_position']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['user_position']['input']>;
  _lte?: InputMaybe<Scalars['user_position']['input']>;
  _neq?: InputMaybe<Scalars['user_position']['input']>;
  _nin?: InputMaybe<Array<Scalars['user_position']['input']>>;
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

export type UserRolesAggregateBoolExp = {
  count?: InputMaybe<UserRolesAggregateBoolExpCount>;
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
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  role?: InputMaybe<RolesBoolExp>;
  roleId?: InputMaybe<UuidComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "user_roles" */
export type UserRolesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'user_roles_pkey'
  /** unique or primary key constraint on columns "role_id", "user_id" */
  | 'user_roles_user_id_role_id_key'
  | '%future added value';

/** input type for inserting data into table "user_roles" */
export type UserRolesInsertInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<RolesObjRelInsertInput>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** order by max() on columns of table "user_roles" */
export type UserRolesMaxOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "user_roles" */
export type UserRolesMinOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "user_roles" */
export type UserRolesOnConflict = {
  constraint: UserRolesConstraint;
  updateColumns?: Array<UserRolesUpdateColumn>;
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
  id: Scalars['uuid']['input'];
};

/** select columns of table "user_roles" */
export type UserRolesSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'roleId'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId'
  | '%future added value';

/** input type for updating data in table "user_roles" */
export type UserRolesSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "user_roles" */
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
export type UserRolesUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'roleId'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId'
  | '%future added value';

export type UserRolesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UserRolesSetInput>;
  /** filter the rows which have to be updated */
  where: UserRolesBoolExp;
};

export type UserSessionsAggregateBoolExp = {
  bool_and?: InputMaybe<UserSessionsAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<UserSessionsAggregateBoolExpBool_Or>;
  count?: InputMaybe<UserSessionsAggregateBoolExpCount>;
};

/** order by aggregate values of table "user_sessions" */
export type UserSessionsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<UserSessionsMaxOrderBy>;
  min?: InputMaybe<UserSessionsMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type UserSessionsAppendInput = {
  locationData?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "user_sessions" */
export type UserSessionsArrRelInsertInput = {
  data: Array<UserSessionsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<UserSessionsOnConflict>;
};

/** Boolean expression to filter rows from the table "user_sessions". All fields are combined with a logical 'AND'. */
export type UserSessionsBoolExp = {
  _and?: InputMaybe<Array<UserSessionsBoolExp>>;
  _not?: InputMaybe<UserSessionsBoolExp>;
  _or?: InputMaybe<Array<UserSessionsBoolExp>>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  expiresAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  ipAddress?: InputMaybe<InetComparisonExp>;
  isActive?: InputMaybe<BooleanComparisonExp>;
  lastActivity?: InputMaybe<TimestamptzComparisonExp>;
  locationData?: InputMaybe<JsonbComparisonExp>;
  logoutReason?: InputMaybe<StringComparisonExp>;
  sessionToken?: InputMaybe<StringComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userAgent?: InputMaybe<StringComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "user_sessions" */
export type UserSessionsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'user_sessions_pkey'
  /** unique or primary key constraint on columns "session_token" */
  | 'user_sessions_session_token_key'
  | '%future added value';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type UserSessionsDeleteAtPathInput = {
  locationData?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type UserSessionsDeleteElemInput = {
  locationData?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type UserSessionsDeleteKeyInput = {
  locationData?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "user_sessions" */
export type UserSessionsInsertInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  expiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastActivity?: InputMaybe<Scalars['timestamptz']['input']>;
  locationData?: InputMaybe<Scalars['jsonb']['input']>;
  logoutReason?: InputMaybe<Scalars['String']['input']>;
  sessionToken?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** order by max() on columns of table "user_sessions" */
export type UserSessionsMaxOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  expiresAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  lastActivity?: InputMaybe<OrderBy>;
  logoutReason?: InputMaybe<OrderBy>;
  sessionToken?: InputMaybe<OrderBy>;
  userAgent?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "user_sessions" */
export type UserSessionsMinOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  expiresAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  lastActivity?: InputMaybe<OrderBy>;
  logoutReason?: InputMaybe<OrderBy>;
  sessionToken?: InputMaybe<OrderBy>;
  userAgent?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "user_sessions" */
export type UserSessionsOnConflict = {
  constraint: UserSessionsConstraint;
  updateColumns?: Array<UserSessionsUpdateColumn>;
  where?: InputMaybe<UserSessionsBoolExp>;
};

/** Ordering options when selecting data from "user_sessions". */
export type UserSessionsOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  expiresAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  ipAddress?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  lastActivity?: InputMaybe<OrderBy>;
  locationData?: InputMaybe<OrderBy>;
  logoutReason?: InputMaybe<OrderBy>;
  sessionToken?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userAgent?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: user_sessions */
export type UserSessionsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type UserSessionsPrependInput = {
  locationData?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "user_sessions" */
export type UserSessionsSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'expiresAt'
  /** column name */
  | 'id'
  /** column name */
  | 'ipAddress'
  /** column name */
  | 'isActive'
  /** column name */
  | 'lastActivity'
  /** column name */
  | 'locationData'
  /** column name */
  | 'logoutReason'
  /** column name */
  | 'sessionToken'
  /** column name */
  | 'userAgent'
  /** column name */
  | 'userId'
  | '%future added value';

/** select "userSessionsAggregateBoolExpBool_andArgumentsColumns" columns of table "user_sessions" */
export type UserSessionsSelectColumnUserSessionsAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'isActive'
  | '%future added value';

/** select "userSessionsAggregateBoolExpBool_orArgumentsColumns" columns of table "user_sessions" */
export type UserSessionsSelectColumnUserSessionsAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'isActive'
  | '%future added value';

/** input type for updating data in table "user_sessions" */
export type UserSessionsSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  expiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastActivity?: InputMaybe<Scalars['timestamptz']['input']>;
  locationData?: InputMaybe<Scalars['jsonb']['input']>;
  logoutReason?: InputMaybe<Scalars['String']['input']>;
  sessionToken?: InputMaybe<Scalars['String']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "user_sessions" */
export type UserSessionsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: UserSessionsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type UserSessionsStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  expiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastActivity?: InputMaybe<Scalars['timestamptz']['input']>;
  locationData?: InputMaybe<Scalars['jsonb']['input']>;
  logoutReason?: InputMaybe<Scalars['String']['input']>;
  sessionToken?: InputMaybe<Scalars['String']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "user_sessions" */
export type UserSessionsUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'expiresAt'
  /** column name */
  | 'id'
  /** column name */
  | 'ipAddress'
  /** column name */
  | 'isActive'
  /** column name */
  | 'lastActivity'
  /** column name */
  | 'locationData'
  /** column name */
  | 'logoutReason'
  /** column name */
  | 'sessionToken'
  /** column name */
  | 'userAgent'
  /** column name */
  | 'userId'
  | '%future added value';

export type UserSessionsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<UserSessionsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<UserSessionsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<UserSessionsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<UserSessionsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<UserSessionsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UserSessionsSetInput>;
  /** filter the rows which have to be updated */
  where: UserSessionsBoolExp;
};

export type UserSkillsAggregateBoolExp = {
  count?: InputMaybe<UserSkillsAggregateBoolExpCount>;
};

/** order by aggregate values of table "user_skills" */
export type UserSkillsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<UserSkillsMaxOrderBy>;
  min?: InputMaybe<UserSkillsMinOrderBy>;
};

/** input type for inserting array relation for remote table "user_skills" */
export type UserSkillsArrRelInsertInput = {
  data: Array<UserSkillsInsertInput>;
};

/** Boolean expression to filter rows from the table "user_skills". All fields are combined with a logical 'AND'. */
export type UserSkillsBoolExp = {
  _and?: InputMaybe<Array<UserSkillsBoolExp>>;
  _not?: InputMaybe<UserSkillsBoolExp>;
  _or?: InputMaybe<Array<UserSkillsBoolExp>>;
  proficiencyLevel?: InputMaybe<StringComparisonExp>;
  skillName?: InputMaybe<StringComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** input type for inserting data into table "user_skills" */
export type UserSkillsInsertInput = {
  proficiencyLevel?: InputMaybe<Scalars['String']['input']>;
  skillName?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** order by max() on columns of table "user_skills" */
export type UserSkillsMaxOrderBy = {
  proficiencyLevel?: InputMaybe<OrderBy>;
  skillName?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "user_skills" */
export type UserSkillsMinOrderBy = {
  proficiencyLevel?: InputMaybe<OrderBy>;
  skillName?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "user_skills". */
export type UserSkillsOrderBy = {
  proficiencyLevel?: InputMaybe<OrderBy>;
  skillName?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** select columns of table "user_skills" */
export type UserSkillsSelectColumn =
  /** column name */
  | 'proficiencyLevel'
  /** column name */
  | 'skillName'
  /** column name */
  | 'userId'
  | '%future added value';

/** input type for updating data in table "user_skills" */
export type UserSkillsSetInput = {
  proficiencyLevel?: InputMaybe<Scalars['String']['input']>;
  skillName?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "user_skills" */
export type UserSkillsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: UserSkillsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type UserSkillsStreamCursorValueInput = {
  proficiencyLevel?: InputMaybe<Scalars['String']['input']>;
  skillName?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

export type UserSkillsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UserSkillsSetInput>;
  /** filter the rows which have to be updated */
  where: UserSkillsBoolExp;
};

/** Boolean expression to compare columns of type "user_status_enum". All fields are combined with logical 'AND'. */
export type UserStatusEnumComparisonExp = {
  _eq?: InputMaybe<Scalars['user_status_enum']['input']>;
  _gt?: InputMaybe<Scalars['user_status_enum']['input']>;
  _gte?: InputMaybe<Scalars['user_status_enum']['input']>;
  _in?: InputMaybe<Array<Scalars['user_status_enum']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['user_status_enum']['input']>;
  _lte?: InputMaybe<Scalars['user_status_enum']['input']>;
  _neq?: InputMaybe<Scalars['user_status_enum']['input']>;
  _nin?: InputMaybe<Array<Scalars['user_status_enum']['input']>>;
};

export type UsersAggregateBoolExp = {
  bool_and?: InputMaybe<UsersAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<UsersAggregateBoolExpBool_Or>;
  count?: InputMaybe<UsersAggregateBoolExpCount>;
};

/** order by aggregate values of table "users" */
export type UsersAggregateOrderBy = {
  avg?: InputMaybe<UsersAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<UsersMaxOrderBy>;
  min?: InputMaybe<UsersMinOrderBy>;
  stddev?: InputMaybe<UsersStddevOrderBy>;
  stddevPop?: InputMaybe<UsersStddevPopOrderBy>;
  stddevSamp?: InputMaybe<UsersStddevSampOrderBy>;
  sum?: InputMaybe<UsersSumOrderBy>;
  varPop?: InputMaybe<UsersVarPopOrderBy>;
  varSamp?: InputMaybe<UsersVarSampOrderBy>;
  variance?: InputMaybe<UsersVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "users" */
export type UsersArrRelInsertInput = {
  data: Array<UsersInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<UsersOnConflict>;
};

/** order by avg() on columns of table "users" */
export type UsersAvgOrderBy = {
  /** Default admin time percentage for this user */
  defaultAdminTimePercentage?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type UsersBoolExp = {
  _and?: InputMaybe<Array<UsersBoolExp>>;
  _not?: InputMaybe<UsersBoolExp>;
  _or?: InputMaybe<Array<UsersBoolExp>>;
  acceptedInvitations?: InputMaybe<UserInvitationsBoolExp>;
  acceptedInvitationsAggregate?: InputMaybe<UserInvitationsAggregateBoolExp>;
  address?: InputMaybe<StringComparisonExp>;
  approvedBillingItems?: InputMaybe<BillingItemsBoolExp>;
  approvedBillingItemsAggregate?: InputMaybe<BillingItemsAggregateBoolExp>;
  approvedEmailTemplates?: InputMaybe<EmailTemplatesBoolExp>;
  approvedEmailTemplatesAggregate?: InputMaybe<EmailTemplatesAggregateBoolExp>;
  assignmentChanges?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  assignmentChangesAggregate?: InputMaybe<PayrollAssignmentAuditAggregateBoolExp>;
  assignmentsMade?: InputMaybe<PayrollAssignmentsBoolExp>;
  assignmentsMadeAggregate?: InputMaybe<PayrollAssignmentsAggregateBoolExp>;
  authoredNotes?: InputMaybe<NotesBoolExp>;
  authoredNotesAggregate?: InputMaybe<NotesAggregateBoolExp>;
  backupPayrollAssignments?: InputMaybe<PayrollsBoolExp>;
  backupPayrollAssignmentsAggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  bio?: InputMaybe<StringComparisonExp>;
  clerkUserId?: InputMaybe<StringComparisonExp>;
  computedName?: InputMaybe<StringComparisonExp>;
  confirmedBillingItems?: InputMaybe<BillingItemsBoolExp>;
  confirmedBillingItemsAggregate?: InputMaybe<BillingItemsAggregateBoolExp>;
  consultantAssignments?: InputMaybe<PayrollAssignmentsBoolExp>;
  consultantAssignmentsAggregate?: InputMaybe<PayrollAssignmentsAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdBillingEventLogs?: InputMaybe<BillingEventLogBoolExp>;
  createdBillingEventLogsAggregate?: InputMaybe<BillingEventLogAggregateBoolExp>;
  createdClientServiceAgreements?: InputMaybe<ClientServiceAgreementsBoolExp>;
  createdClientServiceAgreementsAggregate?: InputMaybe<ClientServiceAgreementsAggregateBoolExp>;
  createdEmailTemplates?: InputMaybe<EmailTemplatesBoolExp>;
  createdEmailTemplatesAggregate?: InputMaybe<EmailTemplatesAggregateBoolExp>;
  createdPermissionOverrides?: InputMaybe<PermissionOverridesBoolExp>;
  createdPermissionOverridesAggregate?: InputMaybe<PermissionOverridesAggregateBoolExp>;
  createdServicePricingRules?: InputMaybe<ServicePricingRulesBoolExp>;
  createdServicePricingRulesAggregate?: InputMaybe<ServicePricingRulesAggregateBoolExp>;
  createdServiceTemplates?: InputMaybe<ServiceTemplatesBoolExp>;
  createdServiceTemplatesAggregate?: InputMaybe<ServiceTemplatesAggregateBoolExp>;
  createdServices?: InputMaybe<ServicesBoolExp>;
  createdServicesAggregate?: InputMaybe<ServicesAggregateBoolExp>;
  dataBackups?: InputMaybe<DataBackupsBoolExp>;
  dataBackupsAggregate?: InputMaybe<DataBackupsAggregateBoolExp>;
  deactivatedAt?: InputMaybe<TimestamptzComparisonExp>;
  deactivatedBy?: InputMaybe<StringComparisonExp>;
  defaultAdminTimePercentage?: InputMaybe<NumericComparisonExp>;
  email?: InputMaybe<StringComparisonExp>;
  emailDrafts?: InputMaybe<EmailDraftsBoolExp>;
  emailDraftsAggregate?: InputMaybe<EmailDraftsAggregateBoolExp>;
  emailTemplateFavorites?: InputMaybe<UserEmailTemplateFavoritesBoolExp>;
  emailTemplateFavoritesAggregate?: InputMaybe<UserEmailTemplateFavoritesAggregateBoolExp>;
  firstName?: InputMaybe<StringComparisonExp>;
  fromConsultantAudits?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  fromConsultantAuditsAggregate?: InputMaybe<PayrollAssignmentAuditAggregateBoolExp>;
  id?: InputMaybe<UuidComparisonExp>;
  image?: InputMaybe<StringComparisonExp>;
  isActive?: InputMaybe<BooleanComparisonExp>;
  isStaff?: InputMaybe<BooleanComparisonExp>;
  lastName?: InputMaybe<StringComparisonExp>;
  leaveRecords?: InputMaybe<LeaveBoolExp>;
  leaveRecordsAggregate?: InputMaybe<LeaveAggregateBoolExp>;
  managedInvitations?: InputMaybe<UserInvitationsBoolExp>;
  managedInvitationsAggregate?: InputMaybe<UserInvitationsAggregateBoolExp>;
  managedPayrolls?: InputMaybe<PayrollsBoolExp>;
  managedPayrollsAggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  managedTeamMembers?: InputMaybe<UsersBoolExp>;
  managedTeamMembersAggregate?: InputMaybe<UsersAggregateBoolExp>;
  managedUsers?: InputMaybe<UsersBoolExp>;
  managedUsersAggregate?: InputMaybe<UsersAggregateBoolExp>;
  manager?: InputMaybe<UsersBoolExp>;
  managerId?: InputMaybe<UuidComparisonExp>;
  originalConsultantAssignments?: InputMaybe<PayrollAssignmentsBoolExp>;
  originalConsultantAssignmentsAggregate?: InputMaybe<PayrollAssignmentsAggregateBoolExp>;
  permissionAuditLogs?: InputMaybe<PermissionAuditLogBoolExp>;
  permissionAuditLogsAggregate?: InputMaybe<PermissionAuditLogAggregateBoolExp>;
  permissionOverrides?: InputMaybe<PermissionOverridesBoolExp>;
  permissionOverridesAggregate?: InputMaybe<PermissionOverridesAggregateBoolExp>;
  phone?: InputMaybe<StringComparisonExp>;
  position?: InputMaybe<UserPositionComparisonExp>;
  primaryPayrollAssignments?: InputMaybe<PayrollsBoolExp>;
  primaryPayrollAssignmentsAggregate?: InputMaybe<PayrollsAggregateBoolExp>;
  resolvedSecurityAlerts?: InputMaybe<SecurityAlertsBoolExp>;
  resolvedSecurityAlertsAggregate?: InputMaybe<SecurityAlertsAggregateBoolExp>;
  revokedInvitations?: InputMaybe<UserInvitationsBoolExp>;
  revokedInvitationsAggregate?: InputMaybe<UserInvitationsAggregateBoolExp>;
  role?: InputMaybe<UserRoleComparisonExp>;
  roleAssignments?: InputMaybe<UserRolesBoolExp>;
  roleAssignmentsAggregate?: InputMaybe<UserRolesAggregateBoolExp>;
  securityAlerts?: InputMaybe<SecurityAlertsBoolExp>;
  securityAlertsAggregate?: InputMaybe<SecurityAlertsAggregateBoolExp>;
  securitySettings?: InputMaybe<SecuritySettingsBoolExp>;
  securitySettingsAggregate?: InputMaybe<SecuritySettingsAggregateBoolExp>;
  sentEmails?: InputMaybe<EmailSendLogsBoolExp>;
  sentEmailsAggregate?: InputMaybe<EmailSendLogsAggregateBoolExp>;
  sentInvitations?: InputMaybe<UserInvitationsBoolExp>;
  sentInvitationsAggregate?: InputMaybe<UserInvitationsAggregateBoolExp>;
  skills?: InputMaybe<UserSkillsBoolExp>;
  skillsAggregate?: InputMaybe<UserSkillsAggregateBoolExp>;
  staffBillingItems?: InputMaybe<BillingItemsBoolExp>;
  staffBillingItemsAggregate?: InputMaybe<BillingItemsAggregateBoolExp>;
  status?: InputMaybe<UserStatusEnumComparisonExp>;
  statusChangeReason?: InputMaybe<StringComparisonExp>;
  statusChangedAt?: InputMaybe<TimestamptzComparisonExp>;
  statusChangedBy?: InputMaybe<UuidComparisonExp>;
  statusChangedByUser?: InputMaybe<UsersBoolExp>;
  targetedPermissionAuditLogs?: InputMaybe<PermissionAuditLogBoolExp>;
  targetedPermissionAuditLogsAggregate?: InputMaybe<PermissionAuditLogAggregateBoolExp>;
  timeEntries?: InputMaybe<TimeEntriesBoolExp>;
  timeEntriesAggregate?: InputMaybe<TimeEntriesAggregateBoolExp>;
  toConsultantAudits?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  toConsultantAuditsAggregate?: InputMaybe<PayrollAssignmentAuditAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  updatedSecuritySettings?: InputMaybe<SecuritySettingsBoolExp>;
  updatedSecuritySettingsAggregate?: InputMaybe<SecuritySettingsAggregateBoolExp>;
  updatedServiceTemplates?: InputMaybe<ServiceTemplatesBoolExp>;
  updatedServiceTemplatesAggregate?: InputMaybe<ServiceTemplatesAggregateBoolExp>;
  updatedServices?: InputMaybe<ServicesBoolExp>;
  updatedServicesAggregate?: InputMaybe<ServicesAggregateBoolExp>;
  uploadedFiles?: InputMaybe<FilesBoolExp>;
  uploadedFilesAggregate?: InputMaybe<FilesAggregateBoolExp>;
  userSessions?: InputMaybe<UserSessionsBoolExp>;
  userSessionsAggregate?: InputMaybe<UserSessionsAggregateBoolExp>;
  username?: InputMaybe<StringComparisonExp>;
  usersWithStatusChanges?: InputMaybe<UsersBoolExp>;
  usersWithStatusChangesAggregate?: InputMaybe<UsersAggregateBoolExp>;
  workSchedules?: InputMaybe<WorkScheduleBoolExp>;
  workSchedulesAggregate?: InputMaybe<WorkScheduleAggregateBoolExp>;
};

/** unique or primary key constraints on table "users" */
export type UsersConstraint =
  /** unique or primary key constraint on columns "clerk_user_id" */
  | 'users_clerk_user_id_key'
  /** unique or primary key constraint on columns "email" */
  | 'users_email_key'
  /** unique or primary key constraint on columns "id" */
  | 'users_pkey'
  /** unique or primary key constraint on columns "username" */
  | 'users_username_key'
  | '%future added value';

/** input type for incrementing numeric columns in table "users" */
export type UsersIncInput = {
  /** Default admin time percentage for this user */
  defaultAdminTimePercentage?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "users" */
export type UsersInsertInput = {
  acceptedInvitations?: InputMaybe<UserInvitationsArrRelInsertInput>;
  /** User address or location */
  address?: InputMaybe<Scalars['String']['input']>;
  approvedBillingItems?: InputMaybe<BillingItemsArrRelInsertInput>;
  approvedEmailTemplates?: InputMaybe<EmailTemplatesArrRelInsertInput>;
  assignmentChanges?: InputMaybe<PayrollAssignmentAuditArrRelInsertInput>;
  assignmentsMade?: InputMaybe<PayrollAssignmentsArrRelInsertInput>;
  authoredNotes?: InputMaybe<NotesArrRelInsertInput>;
  backupPayrollAssignments?: InputMaybe<PayrollsArrRelInsertInput>;
  /** User biography or description */
  bio?: InputMaybe<Scalars['String']['input']>;
  /** External identifier from Clerk authentication service */
  clerkUserId?: InputMaybe<Scalars['String']['input']>;
  confirmedBillingItems?: InputMaybe<BillingItemsArrRelInsertInput>;
  consultantAssignments?: InputMaybe<PayrollAssignmentsArrRelInsertInput>;
  /** Timestamp when the user was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBillingEventLogs?: InputMaybe<BillingEventLogArrRelInsertInput>;
  createdClientServiceAgreements?: InputMaybe<ClientServiceAgreementsArrRelInsertInput>;
  createdEmailTemplates?: InputMaybe<EmailTemplatesArrRelInsertInput>;
  createdPermissionOverrides?: InputMaybe<PermissionOverridesArrRelInsertInput>;
  createdServicePricingRules?: InputMaybe<ServicePricingRulesArrRelInsertInput>;
  createdServiceTemplates?: InputMaybe<ServiceTemplatesArrRelInsertInput>;
  createdServices?: InputMaybe<ServicesArrRelInsertInput>;
  dataBackups?: InputMaybe<DataBackupsArrRelInsertInput>;
  deactivatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deactivatedBy?: InputMaybe<Scalars['String']['input']>;
  /** Default admin time percentage for this user */
  defaultAdminTimePercentage?: InputMaybe<Scalars['numeric']['input']>;
  /** User's email address (unique) */
  email?: InputMaybe<Scalars['String']['input']>;
  emailDrafts?: InputMaybe<EmailDraftsArrRelInsertInput>;
  emailTemplateFavorites?: InputMaybe<UserEmailTemplateFavoritesArrRelInsertInput>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  fromConsultantAudits?: InputMaybe<PayrollAssignmentAuditArrRelInsertInput>;
  /** Unique identifier for the user */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** URL to the user's profile image */
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether the user is a staff member (vs. external user) */
  isStaff?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  leaveRecords?: InputMaybe<LeaveArrRelInsertInput>;
  managedInvitations?: InputMaybe<UserInvitationsArrRelInsertInput>;
  managedPayrolls?: InputMaybe<PayrollsArrRelInsertInput>;
  managedTeamMembers?: InputMaybe<UsersArrRelInsertInput>;
  managedUsers?: InputMaybe<UsersArrRelInsertInput>;
  manager?: InputMaybe<UsersObjRelInsertInput>;
  /** Reference to the user's manager */
  managerId?: InputMaybe<Scalars['uuid']['input']>;
  originalConsultantAssignments?: InputMaybe<PayrollAssignmentsArrRelInsertInput>;
  permissionAuditLogs?: InputMaybe<PermissionAuditLogArrRelInsertInput>;
  permissionOverrides?: InputMaybe<PermissionOverridesArrRelInsertInput>;
  /** User contact phone number */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** Organizational position affecting admin time allocation */
  position?: InputMaybe<Scalars['user_position']['input']>;
  primaryPayrollAssignments?: InputMaybe<PayrollsArrRelInsertInput>;
  resolvedSecurityAlerts?: InputMaybe<SecurityAlertsArrRelInsertInput>;
  revokedInvitations?: InputMaybe<UserInvitationsArrRelInsertInput>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Scalars['user_role']['input']>;
  roleAssignments?: InputMaybe<UserRolesArrRelInsertInput>;
  securityAlerts?: InputMaybe<SecurityAlertsArrRelInsertInput>;
  securitySettings?: InputMaybe<SecuritySettingsArrRelInsertInput>;
  sentEmails?: InputMaybe<EmailSendLogsArrRelInsertInput>;
  sentInvitations?: InputMaybe<UserInvitationsArrRelInsertInput>;
  skills?: InputMaybe<UserSkillsArrRelInsertInput>;
  staffBillingItems?: InputMaybe<BillingItemsArrRelInsertInput>;
  /** Current user status - must be consistent with isActive field */
  status?: InputMaybe<Scalars['user_status_enum']['input']>;
  /** Reason for the status change (for audit purposes) */
  statusChangeReason?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when status was last changed */
  statusChangedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** User ID who changed the status */
  statusChangedBy?: InputMaybe<Scalars['uuid']['input']>;
  statusChangedByUser?: InputMaybe<UsersObjRelInsertInput>;
  targetedPermissionAuditLogs?: InputMaybe<PermissionAuditLogArrRelInsertInput>;
  timeEntries?: InputMaybe<TimeEntriesArrRelInsertInput>;
  toConsultantAudits?: InputMaybe<PayrollAssignmentAuditArrRelInsertInput>;
  /** Timestamp when the user was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  updatedSecuritySettings?: InputMaybe<SecuritySettingsArrRelInsertInput>;
  updatedServiceTemplates?: InputMaybe<ServiceTemplatesArrRelInsertInput>;
  updatedServices?: InputMaybe<ServicesArrRelInsertInput>;
  uploadedFiles?: InputMaybe<FilesArrRelInsertInput>;
  userSessions?: InputMaybe<UserSessionsArrRelInsertInput>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars['String']['input']>;
  usersWithStatusChanges?: InputMaybe<UsersArrRelInsertInput>;
  workSchedules?: InputMaybe<WorkScheduleArrRelInsertInput>;
};

/** order by max() on columns of table "users" */
export type UsersMaxOrderBy = {
  /** User address or location */
  address?: InputMaybe<OrderBy>;
  /** User biography or description */
  bio?: InputMaybe<OrderBy>;
  /** External identifier from Clerk authentication service */
  clerkUserId?: InputMaybe<OrderBy>;
  computedName?: InputMaybe<OrderBy>;
  /** Timestamp when the user was created */
  createdAt?: InputMaybe<OrderBy>;
  deactivatedAt?: InputMaybe<OrderBy>;
  deactivatedBy?: InputMaybe<OrderBy>;
  /** Default admin time percentage for this user */
  defaultAdminTimePercentage?: InputMaybe<OrderBy>;
  /** User's email address (unique) */
  email?: InputMaybe<OrderBy>;
  firstName?: InputMaybe<OrderBy>;
  /** Unique identifier for the user */
  id?: InputMaybe<OrderBy>;
  /** URL to the user's profile image */
  image?: InputMaybe<OrderBy>;
  lastName?: InputMaybe<OrderBy>;
  /** Reference to the user's manager */
  managerId?: InputMaybe<OrderBy>;
  /** User contact phone number */
  phone?: InputMaybe<OrderBy>;
  /** Organizational position affecting admin time allocation */
  position?: InputMaybe<OrderBy>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<OrderBy>;
  /** Current user status - must be consistent with isActive field */
  status?: InputMaybe<OrderBy>;
  /** Reason for the status change (for audit purposes) */
  statusChangeReason?: InputMaybe<OrderBy>;
  /** Timestamp when status was last changed */
  statusChangedAt?: InputMaybe<OrderBy>;
  /** User ID who changed the status */
  statusChangedBy?: InputMaybe<OrderBy>;
  /** Timestamp when the user was last updated */
  updatedAt?: InputMaybe<OrderBy>;
  /** User's unique username for login */
  username?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "users" */
export type UsersMinOrderBy = {
  /** User address or location */
  address?: InputMaybe<OrderBy>;
  /** User biography or description */
  bio?: InputMaybe<OrderBy>;
  /** External identifier from Clerk authentication service */
  clerkUserId?: InputMaybe<OrderBy>;
  computedName?: InputMaybe<OrderBy>;
  /** Timestamp when the user was created */
  createdAt?: InputMaybe<OrderBy>;
  deactivatedAt?: InputMaybe<OrderBy>;
  deactivatedBy?: InputMaybe<OrderBy>;
  /** Default admin time percentage for this user */
  defaultAdminTimePercentage?: InputMaybe<OrderBy>;
  /** User's email address (unique) */
  email?: InputMaybe<OrderBy>;
  firstName?: InputMaybe<OrderBy>;
  /** Unique identifier for the user */
  id?: InputMaybe<OrderBy>;
  /** URL to the user's profile image */
  image?: InputMaybe<OrderBy>;
  lastName?: InputMaybe<OrderBy>;
  /** Reference to the user's manager */
  managerId?: InputMaybe<OrderBy>;
  /** User contact phone number */
  phone?: InputMaybe<OrderBy>;
  /** Organizational position affecting admin time allocation */
  position?: InputMaybe<OrderBy>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<OrderBy>;
  /** Current user status - must be consistent with isActive field */
  status?: InputMaybe<OrderBy>;
  /** Reason for the status change (for audit purposes) */
  statusChangeReason?: InputMaybe<OrderBy>;
  /** Timestamp when status was last changed */
  statusChangedAt?: InputMaybe<OrderBy>;
  /** User ID who changed the status */
  statusChangedBy?: InputMaybe<OrderBy>;
  /** Timestamp when the user was last updated */
  updatedAt?: InputMaybe<OrderBy>;
  /** User's unique username for login */
  username?: InputMaybe<OrderBy>;
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
  acceptedInvitationsAggregate?: InputMaybe<UserInvitationsAggregateOrderBy>;
  address?: InputMaybe<OrderBy>;
  approvedBillingItemsAggregate?: InputMaybe<BillingItemsAggregateOrderBy>;
  approvedEmailTemplatesAggregate?: InputMaybe<EmailTemplatesAggregateOrderBy>;
  assignmentChangesAggregate?: InputMaybe<PayrollAssignmentAuditAggregateOrderBy>;
  assignmentsMadeAggregate?: InputMaybe<PayrollAssignmentsAggregateOrderBy>;
  authoredNotesAggregate?: InputMaybe<NotesAggregateOrderBy>;
  backupPayrollAssignmentsAggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  bio?: InputMaybe<OrderBy>;
  clerkUserId?: InputMaybe<OrderBy>;
  computedName?: InputMaybe<OrderBy>;
  confirmedBillingItemsAggregate?: InputMaybe<BillingItemsAggregateOrderBy>;
  consultantAssignmentsAggregate?: InputMaybe<PayrollAssignmentsAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBillingEventLogsAggregate?: InputMaybe<BillingEventLogAggregateOrderBy>;
  createdClientServiceAgreementsAggregate?: InputMaybe<ClientServiceAgreementsAggregateOrderBy>;
  createdEmailTemplatesAggregate?: InputMaybe<EmailTemplatesAggregateOrderBy>;
  createdPermissionOverridesAggregate?: InputMaybe<PermissionOverridesAggregateOrderBy>;
  createdServicePricingRulesAggregate?: InputMaybe<ServicePricingRulesAggregateOrderBy>;
  createdServiceTemplatesAggregate?: InputMaybe<ServiceTemplatesAggregateOrderBy>;
  createdServicesAggregate?: InputMaybe<ServicesAggregateOrderBy>;
  dataBackupsAggregate?: InputMaybe<DataBackupsAggregateOrderBy>;
  deactivatedAt?: InputMaybe<OrderBy>;
  deactivatedBy?: InputMaybe<OrderBy>;
  defaultAdminTimePercentage?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  emailDraftsAggregate?: InputMaybe<EmailDraftsAggregateOrderBy>;
  emailTemplateFavoritesAggregate?: InputMaybe<UserEmailTemplateFavoritesAggregateOrderBy>;
  firstName?: InputMaybe<OrderBy>;
  fromConsultantAuditsAggregate?: InputMaybe<PayrollAssignmentAuditAggregateOrderBy>;
  id?: InputMaybe<OrderBy>;
  image?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  isStaff?: InputMaybe<OrderBy>;
  lastName?: InputMaybe<OrderBy>;
  leaveRecordsAggregate?: InputMaybe<LeaveAggregateOrderBy>;
  managedInvitationsAggregate?: InputMaybe<UserInvitationsAggregateOrderBy>;
  managedPayrollsAggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  managedTeamMembersAggregate?: InputMaybe<UsersAggregateOrderBy>;
  managedUsersAggregate?: InputMaybe<UsersAggregateOrderBy>;
  manager?: InputMaybe<UsersOrderBy>;
  managerId?: InputMaybe<OrderBy>;
  originalConsultantAssignmentsAggregate?: InputMaybe<PayrollAssignmentsAggregateOrderBy>;
  permissionAuditLogsAggregate?: InputMaybe<PermissionAuditLogAggregateOrderBy>;
  permissionOverridesAggregate?: InputMaybe<PermissionOverridesAggregateOrderBy>;
  phone?: InputMaybe<OrderBy>;
  position?: InputMaybe<OrderBy>;
  primaryPayrollAssignmentsAggregate?: InputMaybe<PayrollsAggregateOrderBy>;
  resolvedSecurityAlertsAggregate?: InputMaybe<SecurityAlertsAggregateOrderBy>;
  revokedInvitationsAggregate?: InputMaybe<UserInvitationsAggregateOrderBy>;
  role?: InputMaybe<OrderBy>;
  roleAssignmentsAggregate?: InputMaybe<UserRolesAggregateOrderBy>;
  securityAlertsAggregate?: InputMaybe<SecurityAlertsAggregateOrderBy>;
  securitySettingsAggregate?: InputMaybe<SecuritySettingsAggregateOrderBy>;
  sentEmailsAggregate?: InputMaybe<EmailSendLogsAggregateOrderBy>;
  sentInvitationsAggregate?: InputMaybe<UserInvitationsAggregateOrderBy>;
  skillsAggregate?: InputMaybe<UserSkillsAggregateOrderBy>;
  staffBillingItemsAggregate?: InputMaybe<BillingItemsAggregateOrderBy>;
  status?: InputMaybe<OrderBy>;
  statusChangeReason?: InputMaybe<OrderBy>;
  statusChangedAt?: InputMaybe<OrderBy>;
  statusChangedBy?: InputMaybe<OrderBy>;
  statusChangedByUser?: InputMaybe<UsersOrderBy>;
  targetedPermissionAuditLogsAggregate?: InputMaybe<PermissionAuditLogAggregateOrderBy>;
  timeEntriesAggregate?: InputMaybe<TimeEntriesAggregateOrderBy>;
  toConsultantAuditsAggregate?: InputMaybe<PayrollAssignmentAuditAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  updatedSecuritySettingsAggregate?: InputMaybe<SecuritySettingsAggregateOrderBy>;
  updatedServiceTemplatesAggregate?: InputMaybe<ServiceTemplatesAggregateOrderBy>;
  updatedServicesAggregate?: InputMaybe<ServicesAggregateOrderBy>;
  uploadedFilesAggregate?: InputMaybe<FilesAggregateOrderBy>;
  userSessionsAggregate?: InputMaybe<UserSessionsAggregateOrderBy>;
  username?: InputMaybe<OrderBy>;
  usersWithStatusChangesAggregate?: InputMaybe<UsersAggregateOrderBy>;
  workSchedulesAggregate?: InputMaybe<WorkScheduleAggregateOrderBy>;
};

/** primary key columns input for table: users */
export type UsersPkColumnsInput = {
  /** Unique identifier for the user */
  id: Scalars['uuid']['input'];
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

/** Ordering options when selecting data from "users_role_backup". */
export type UsersRoleBackupOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  role?: InputMaybe<OrderBy>;
};

/** select columns of table "users_role_backup" */
export type UsersRoleBackupSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'email'
  /** column name */
  | 'id'
  /** column name */
  | 'role'
  | '%future added value';

/** input type for updating data in table "users_role_backup" */
export type UsersRoleBackupSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
};

/** Streaming cursor of the table "users_role_backup" */
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
export type UsersSelectColumn =
  /** column name */
  | 'address'
  /** column name */
  | 'bio'
  /** column name */
  | 'clerkUserId'
  /** column name */
  | 'computedName'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'deactivatedAt'
  /** column name */
  | 'deactivatedBy'
  /** column name */
  | 'defaultAdminTimePercentage'
  /** column name */
  | 'email'
  /** column name */
  | 'firstName'
  /** column name */
  | 'id'
  /** column name */
  | 'image'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isStaff'
  /** column name */
  | 'lastName'
  /** column name */
  | 'managerId'
  /** column name */
  | 'phone'
  /** column name */
  | 'position'
  /** column name */
  | 'role'
  /** column name */
  | 'status'
  /** column name */
  | 'statusChangeReason'
  /** column name */
  | 'statusChangedAt'
  /** column name */
  | 'statusChangedBy'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'username'
  | '%future added value';

/** select "usersAggregateBoolExpBool_andArgumentsColumns" columns of table "users" */
export type UsersSelectColumnUsersAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'isActive'
  /** column name */
  | 'isStaff'
  | '%future added value';

/** select "usersAggregateBoolExpBool_orArgumentsColumns" columns of table "users" */
export type UsersSelectColumnUsersAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'isActive'
  /** column name */
  | 'isStaff'
  | '%future added value';

/** input type for updating data in table "users" */
export type UsersSetInput = {
  /** User address or location */
  address?: InputMaybe<Scalars['String']['input']>;
  /** User biography or description */
  bio?: InputMaybe<Scalars['String']['input']>;
  /** External identifier from Clerk authentication service */
  clerkUserId?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the user was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deactivatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deactivatedBy?: InputMaybe<Scalars['String']['input']>;
  /** Default admin time percentage for this user */
  defaultAdminTimePercentage?: InputMaybe<Scalars['numeric']['input']>;
  /** User's email address (unique) */
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the user */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** URL to the user's profile image */
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether the user is a staff member (vs. external user) */
  isStaff?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** Reference to the user's manager */
  managerId?: InputMaybe<Scalars['uuid']['input']>;
  /** User contact phone number */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** Organizational position affecting admin time allocation */
  position?: InputMaybe<Scalars['user_position']['input']>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Scalars['user_role']['input']>;
  /** Current user status - must be consistent with isActive field */
  status?: InputMaybe<Scalars['user_status_enum']['input']>;
  /** Reason for the status change (for audit purposes) */
  statusChangeReason?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when status was last changed */
  statusChangedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** User ID who changed the status */
  statusChangedBy?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the user was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars['String']['input']>;
};

/** order by stddev() on columns of table "users" */
export type UsersStddevOrderBy = {
  /** Default admin time percentage for this user */
  defaultAdminTimePercentage?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "users" */
export type UsersStddevPopOrderBy = {
  /** Default admin time percentage for this user */
  defaultAdminTimePercentage?: InputMaybe<OrderBy>;
};

/** order by stddevSamp() on columns of table "users" */
export type UsersStddevSampOrderBy = {
  /** Default admin time percentage for this user */
  defaultAdminTimePercentage?: InputMaybe<OrderBy>;
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
  /** User address or location */
  address?: InputMaybe<Scalars['String']['input']>;
  /** User biography or description */
  bio?: InputMaybe<Scalars['String']['input']>;
  /** External identifier from Clerk authentication service */
  clerkUserId?: InputMaybe<Scalars['String']['input']>;
  computedName?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the user was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deactivatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deactivatedBy?: InputMaybe<Scalars['String']['input']>;
  /** Default admin time percentage for this user */
  defaultAdminTimePercentage?: InputMaybe<Scalars['numeric']['input']>;
  /** User's email address (unique) */
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the user */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** URL to the user's profile image */
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether the user is a staff member (vs. external user) */
  isStaff?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** Reference to the user's manager */
  managerId?: InputMaybe<Scalars['uuid']['input']>;
  /** User contact phone number */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** Organizational position affecting admin time allocation */
  position?: InputMaybe<Scalars['user_position']['input']>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Scalars['user_role']['input']>;
  /** Current user status - must be consistent with isActive field */
  status?: InputMaybe<Scalars['user_status_enum']['input']>;
  /** Reason for the status change (for audit purposes) */
  statusChangeReason?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when status was last changed */
  statusChangedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** User ID who changed the status */
  statusChangedBy?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the user was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "users" */
export type UsersSumOrderBy = {
  /** Default admin time percentage for this user */
  defaultAdminTimePercentage?: InputMaybe<OrderBy>;
};

/** update columns of table "users" */
export type UsersUpdateColumn =
  /** column name */
  | 'address'
  /** column name */
  | 'bio'
  /** column name */
  | 'clerkUserId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'deactivatedAt'
  /** column name */
  | 'deactivatedBy'
  /** column name */
  | 'defaultAdminTimePercentage'
  /** column name */
  | 'email'
  /** column name */
  | 'firstName'
  /** column name */
  | 'id'
  /** column name */
  | 'image'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isStaff'
  /** column name */
  | 'lastName'
  /** column name */
  | 'managerId'
  /** column name */
  | 'phone'
  /** column name */
  | 'position'
  /** column name */
  | 'role'
  /** column name */
  | 'status'
  /** column name */
  | 'statusChangeReason'
  /** column name */
  | 'statusChangedAt'
  /** column name */
  | 'statusChangedBy'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'username'
  | '%future added value';

export type UsersUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<UsersIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UsersSetInput>;
  /** filter the rows which have to be updated */
  where: UsersBoolExp;
};

/** order by varPop() on columns of table "users" */
export type UsersVarPopOrderBy = {
  /** Default admin time percentage for this user */
  defaultAdminTimePercentage?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "users" */
export type UsersVarSampOrderBy = {
  /** Default admin time percentage for this user */
  defaultAdminTimePercentage?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "users" */
export type UsersVarianceOrderBy = {
  /** Default admin time percentage for this user */
  defaultAdminTimePercentage?: InputMaybe<OrderBy>;
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

export type WorkScheduleAggregateBoolExp = {
  bool_and?: InputMaybe<WorkScheduleAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<WorkScheduleAggregateBoolExpBool_Or>;
  count?: InputMaybe<WorkScheduleAggregateBoolExpCount>;
};

/** order by aggregate values of table "work_schedule" */
export type WorkScheduleAggregateOrderBy = {
  avg?: InputMaybe<WorkScheduleAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<WorkScheduleMaxOrderBy>;
  min?: InputMaybe<WorkScheduleMinOrderBy>;
  stddev?: InputMaybe<WorkScheduleStddevOrderBy>;
  stddevPop?: InputMaybe<WorkScheduleStddevPopOrderBy>;
  stddevSamp?: InputMaybe<WorkScheduleStddevSampOrderBy>;
  sum?: InputMaybe<WorkScheduleSumOrderBy>;
  varPop?: InputMaybe<WorkScheduleVarPopOrderBy>;
  varSamp?: InputMaybe<WorkScheduleVarSampOrderBy>;
  variance?: InputMaybe<WorkScheduleVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "work_schedule" */
export type WorkScheduleArrRelInsertInput = {
  data: Array<WorkScheduleInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<WorkScheduleOnConflict>;
};

/** order by avg() on columns of table "work_schedule" */
export type WorkScheduleAvgOrderBy = {
  /** Hours allocated to administrative tasks */
  adminTimeHours?: InputMaybe<OrderBy>;
  /** Hours available for payroll processing (work_hours - admin_time_hours) */
  payrollCapacityHours?: InputMaybe<OrderBy>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "work_schedule". All fields are combined with a logical 'AND'. */
export type WorkScheduleBoolExp = {
  _and?: InputMaybe<Array<WorkScheduleBoolExp>>;
  _not?: InputMaybe<WorkScheduleBoolExp>;
  _or?: InputMaybe<Array<WorkScheduleBoolExp>>;
  adminTimeHours?: InputMaybe<NumericComparisonExp>;
  createdAt?: InputMaybe<TimestampComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  payrollCapacityHours?: InputMaybe<NumericComparisonExp>;
  updatedAt?: InputMaybe<TimestampComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
  usesDefaultAdminTime?: InputMaybe<BooleanComparisonExp>;
  workDay?: InputMaybe<StringComparisonExp>;
  workHours?: InputMaybe<NumericComparisonExp>;
};

/** unique or primary key constraints on table "work_schedule" */
export type WorkScheduleConstraint =
  /** unique or primary key constraint on columns "user_id", "work_day" */
  | 'unique_user_work_day'
  /** unique or primary key constraint on columns "id" */
  | 'work_schedule_pkey'
  | '%future added value';

/** input type for incrementing numeric columns in table "work_schedule" */
export type WorkScheduleIncInput = {
  /** Hours allocated to administrative tasks */
  adminTimeHours?: InputMaybe<Scalars['numeric']['input']>;
  /** Hours available for payroll processing (work_hours - admin_time_hours) */
  payrollCapacityHours?: InputMaybe<Scalars['numeric']['input']>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "work_schedule" */
export type WorkScheduleInsertInput = {
  /** Hours allocated to administrative tasks */
  adminTimeHours?: InputMaybe<Scalars['numeric']['input']>;
  /** Timestamp when the schedule entry was created */
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Hours available for payroll processing (work_hours - admin_time_hours) */
  payrollCapacityHours?: InputMaybe<Scalars['numeric']['input']>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: InputMaybe<Scalars['timestamp']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  /** Reference to the user this schedule belongs to */
  userId?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether to use position-based default admin time or custom override */
  usesDefaultAdminTime?: InputMaybe<Scalars['Boolean']['input']>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay?: InputMaybe<Scalars['String']['input']>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by max() on columns of table "work_schedule" */
export type WorkScheduleMaxOrderBy = {
  /** Hours allocated to administrative tasks */
  adminTimeHours?: InputMaybe<OrderBy>;
  /** Timestamp when the schedule entry was created */
  createdAt?: InputMaybe<OrderBy>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<OrderBy>;
  /** Hours available for payroll processing (work_hours - admin_time_hours) */
  payrollCapacityHours?: InputMaybe<OrderBy>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: InputMaybe<OrderBy>;
  /** Reference to the user this schedule belongs to */
  userId?: InputMaybe<OrderBy>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay?: InputMaybe<OrderBy>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "work_schedule" */
export type WorkScheduleMinOrderBy = {
  /** Hours allocated to administrative tasks */
  adminTimeHours?: InputMaybe<OrderBy>;
  /** Timestamp when the schedule entry was created */
  createdAt?: InputMaybe<OrderBy>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<OrderBy>;
  /** Hours available for payroll processing (work_hours - admin_time_hours) */
  payrollCapacityHours?: InputMaybe<OrderBy>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: InputMaybe<OrderBy>;
  /** Reference to the user this schedule belongs to */
  userId?: InputMaybe<OrderBy>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay?: InputMaybe<OrderBy>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** on_conflict condition type for table "work_schedule" */
export type WorkScheduleOnConflict = {
  constraint: WorkScheduleConstraint;
  updateColumns?: Array<WorkScheduleUpdateColumn>;
  where?: InputMaybe<WorkScheduleBoolExp>;
};

/** Ordering options when selecting data from "work_schedule". */
export type WorkScheduleOrderBy = {
  adminTimeHours?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payrollCapacityHours?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userId?: InputMaybe<OrderBy>;
  usesDefaultAdminTime?: InputMaybe<OrderBy>;
  workDay?: InputMaybe<OrderBy>;
  workHours?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: work_schedule */
export type WorkSchedulePkColumnsInput = {
  /** Unique identifier for the work schedule entry */
  id: Scalars['uuid']['input'];
};

/** select columns of table "work_schedule" */
export type WorkScheduleSelectColumn =
  /** column name */
  | 'adminTimeHours'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'payrollCapacityHours'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId'
  /** column name */
  | 'usesDefaultAdminTime'
  /** column name */
  | 'workDay'
  /** column name */
  | 'workHours'
  | '%future added value';

/** select "workScheduleAggregateBoolExpBool_andArgumentsColumns" columns of table "work_schedule" */
export type WorkScheduleSelectColumnWorkScheduleAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'usesDefaultAdminTime'
  | '%future added value';

/** select "workScheduleAggregateBoolExpBool_orArgumentsColumns" columns of table "work_schedule" */
export type WorkScheduleSelectColumnWorkScheduleAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'usesDefaultAdminTime'
  | '%future added value';

/** input type for updating data in table "work_schedule" */
export type WorkScheduleSetInput = {
  /** Hours allocated to administrative tasks */
  adminTimeHours?: InputMaybe<Scalars['numeric']['input']>;
  /** Timestamp when the schedule entry was created */
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Hours available for payroll processing (work_hours - admin_time_hours) */
  payrollCapacityHours?: InputMaybe<Scalars['numeric']['input']>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** Reference to the user this schedule belongs to */
  userId?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether to use position-based default admin time or custom override */
  usesDefaultAdminTime?: InputMaybe<Scalars['Boolean']['input']>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay?: InputMaybe<Scalars['String']['input']>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by stddev() on columns of table "work_schedule" */
export type WorkScheduleStddevOrderBy = {
  /** Hours allocated to administrative tasks */
  adminTimeHours?: InputMaybe<OrderBy>;
  /** Hours available for payroll processing (work_hours - admin_time_hours) */
  payrollCapacityHours?: InputMaybe<OrderBy>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "work_schedule" */
export type WorkScheduleStddevPopOrderBy = {
  /** Hours allocated to administrative tasks */
  adminTimeHours?: InputMaybe<OrderBy>;
  /** Hours available for payroll processing (work_hours - admin_time_hours) */
  payrollCapacityHours?: InputMaybe<OrderBy>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** order by stddevSamp() on columns of table "work_schedule" */
export type WorkScheduleStddevSampOrderBy = {
  /** Hours allocated to administrative tasks */
  adminTimeHours?: InputMaybe<OrderBy>;
  /** Hours available for payroll processing (work_hours - admin_time_hours) */
  payrollCapacityHours?: InputMaybe<OrderBy>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "work_schedule" */
export type WorkScheduleStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: WorkScheduleStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type WorkScheduleStreamCursorValueInput = {
  /** Hours allocated to administrative tasks */
  adminTimeHours?: InputMaybe<Scalars['numeric']['input']>;
  /** Timestamp when the schedule entry was created */
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Hours available for payroll processing (work_hours - admin_time_hours) */
  payrollCapacityHours?: InputMaybe<Scalars['numeric']['input']>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** Reference to the user this schedule belongs to */
  userId?: InputMaybe<Scalars['uuid']['input']>;
  /** Whether to use position-based default admin time or custom override */
  usesDefaultAdminTime?: InputMaybe<Scalars['Boolean']['input']>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay?: InputMaybe<Scalars['String']['input']>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "work_schedule" */
export type WorkScheduleSumOrderBy = {
  /** Hours allocated to administrative tasks */
  adminTimeHours?: InputMaybe<OrderBy>;
  /** Hours available for payroll processing (work_hours - admin_time_hours) */
  payrollCapacityHours?: InputMaybe<OrderBy>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** update columns of table "work_schedule" */
export type WorkScheduleUpdateColumn =
  /** column name */
  | 'adminTimeHours'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'payrollCapacityHours'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId'
  /** column name */
  | 'usesDefaultAdminTime'
  /** column name */
  | 'workDay'
  /** column name */
  | 'workHours'
  | '%future added value';

export type WorkScheduleUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<WorkScheduleIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<WorkScheduleSetInput>;
  /** filter the rows which have to be updated */
  where: WorkScheduleBoolExp;
};

/** order by varPop() on columns of table "work_schedule" */
export type WorkScheduleVarPopOrderBy = {
  /** Hours allocated to administrative tasks */
  adminTimeHours?: InputMaybe<OrderBy>;
  /** Hours available for payroll processing (work_hours - admin_time_hours) */
  payrollCapacityHours?: InputMaybe<OrderBy>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "work_schedule" */
export type WorkScheduleVarSampOrderBy = {
  /** Hours allocated to administrative tasks */
  adminTimeHours?: InputMaybe<OrderBy>;
  /** Hours available for payroll processing (work_hours - admin_time_hours) */
  payrollCapacityHours?: InputMaybe<OrderBy>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "work_schedule" */
export type WorkScheduleVarianceOrderBy = {
  /** Hours allocated to administrative tasks */
  adminTimeHours?: InputMaybe<OrderBy>;
  /** Hours available for payroll processing (work_hours - admin_time_hours) */
  payrollCapacityHours?: InputMaybe<OrderBy>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

export type AdjustmentRulesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<AdjustmentRulesBoolExp>;
  predicate: IntComparisonExp;
};

export type BillingEventLogAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingEventLogSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingEventLogBoolExp>;
  predicate: IntComparisonExp;
};

export type BillingInvoiceAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingInvoiceBoolExp>;
  predicate: IntComparisonExp;
};

export type BillingInvoiceItemAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingInvoiceItemBoolExp>;
  predicate: IntComparisonExp;
};

export type BillingItemsAggregateBoolExpBool_And = {
  arguments: BillingItemsSelectColumnBillingItemsAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingItemsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type BillingItemsAggregateBoolExpBool_Or = {
  arguments: BillingItemsSelectColumnBillingItemsAggregateBoolExpBool_OrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingItemsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type BillingItemsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingItemsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingItemsBoolExp>;
  predicate: IntComparisonExp;
};

export type BillingPeriodsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingPeriodsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingPeriodsBoolExp>;
  predicate: IntComparisonExp;
};

export type ClientBillingAssignmentAggregateBoolExpBool_And = {
  arguments: ClientBillingAssignmentSelectColumnClientBillingAssignmentAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientBillingAssignmentBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ClientBillingAssignmentAggregateBoolExpBool_Or = {
  arguments: ClientBillingAssignmentSelectColumnClientBillingAssignmentAggregateBoolExpBool_OrArgumentsColumns;
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

export type ClientExternalSystemsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientExternalSystemsBoolExp>;
  predicate: IntComparisonExp;
};

export type ClientServiceAgreementsAggregateBoolExpBool_And = {
  arguments: ClientServiceAgreementsSelectColumnClientServiceAgreementsAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientServiceAgreementsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ClientServiceAgreementsAggregateBoolExpBool_Or = {
  arguments: ClientServiceAgreementsSelectColumnClientServiceAgreementsAggregateBoolExpBool_OrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientServiceAgreementsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ClientServiceAgreementsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<ClientServiceAgreementsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientServiceAgreementsBoolExp>;
  predicate: IntComparisonExp;
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

export type DataBackupsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<DataBackupsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<DataBackupsBoolExp>;
  predicate: IntComparisonExp;
};

export type EmailDraftsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<EmailDraftsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<EmailDraftsBoolExp>;
  predicate: IntComparisonExp;
};

export type EmailSendLogsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<EmailSendLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<EmailSendLogsBoolExp>;
  predicate: IntComparisonExp;
};

export type EmailTemplatesAggregateBoolExpBool_And = {
  arguments: EmailTemplatesSelectColumnEmailTemplatesAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<EmailTemplatesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type EmailTemplatesAggregateBoolExpBool_Or = {
  arguments: EmailTemplatesSelectColumnEmailTemplatesAggregateBoolExpBool_OrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<EmailTemplatesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type EmailTemplatesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<EmailTemplatesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<EmailTemplatesBoolExp>;
  predicate: IntComparisonExp;
};

export type FilesAggregateBoolExpBool_And = {
  arguments: FilesSelectColumnFilesAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<FilesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type FilesAggregateBoolExpBool_Or = {
  arguments: FilesSelectColumnFilesAggregateBoolExpBool_OrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<FilesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type FilesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<FilesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<FilesBoolExp>;
  predicate: IntComparisonExp;
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

export type LeaveAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<LeaveSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<LeaveBoolExp>;
  predicate: IntComparisonExp;
};

export type NotesAggregateBoolExpBool_And = {
  arguments: NotesSelectColumnNotesAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<NotesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type NotesAggregateBoolExpBool_Or = {
  arguments: NotesSelectColumnNotesAggregateBoolExpBool_OrArgumentsColumns;
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

export type PayrollAssignmentAuditAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PayrollAssignmentAuditSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollAssignmentAuditBoolExp>;
  predicate: IntComparisonExp;
};

export type PayrollAssignmentsAggregateBoolExpBool_And = {
  arguments: PayrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollAssignmentsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type PayrollAssignmentsAggregateBoolExpBool_Or = {
  arguments: PayrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBool_OrArgumentsColumns;
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

export type PayrollDatesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollDatesBoolExp>;
  predicate: IntComparisonExp;
};

export type PayrollRequiredSkillsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PayrollRequiredSkillsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollRequiredSkillsBoolExp>;
  predicate: IntComparisonExp;
};

export type PayrollsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PayrollsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollsBoolExp>;
  predicate: IntComparisonExp;
};

export type PermissionAuditLogAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PermissionAuditLogSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PermissionAuditLogBoolExp>;
  predicate: IntComparisonExp;
};

export type PermissionOverridesAggregateBoolExpBool_And = {
  arguments: PermissionOverridesSelectColumnPermissionOverridesAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PermissionOverridesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type PermissionOverridesAggregateBoolExpBool_Or = {
  arguments: PermissionOverridesSelectColumnPermissionOverridesAggregateBoolExpBool_OrArgumentsColumns;
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

export type PermissionsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PermissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PermissionsBoolExp>;
  predicate: IntComparisonExp;
};

export type RolePermissionsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<RolePermissionsBoolExp>;
  predicate: IntComparisonExp;
};

export type SecurityAlertsAggregateBoolExpBool_And = {
  arguments: SecurityAlertsSelectColumnSecurityAlertsAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<SecurityAlertsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type SecurityAlertsAggregateBoolExpBool_Or = {
  arguments: SecurityAlertsSelectColumnSecurityAlertsAggregateBoolExpBool_OrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<SecurityAlertsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type SecurityAlertsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<SecurityAlertsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<SecurityAlertsBoolExp>;
  predicate: IntComparisonExp;
};

export type SecuritySettingsAggregateBoolExpBool_And = {
  arguments: SecuritySettingsSelectColumnSecuritySettingsAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<SecuritySettingsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type SecuritySettingsAggregateBoolExpBool_Or = {
  arguments: SecuritySettingsSelectColumnSecuritySettingsAggregateBoolExpBool_OrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<SecuritySettingsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type SecuritySettingsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<SecuritySettingsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<SecuritySettingsBoolExp>;
  predicate: IntComparisonExp;
};

export type ServicePricingRulesAggregateBoolExpBool_And = {
  arguments: ServicePricingRulesSelectColumnServicePricingRulesAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ServicePricingRulesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ServicePricingRulesAggregateBoolExpBool_Or = {
  arguments: ServicePricingRulesSelectColumnServicePricingRulesAggregateBoolExpBool_OrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ServicePricingRulesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ServicePricingRulesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<ServicePricingRulesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ServicePricingRulesBoolExp>;
  predicate: IntComparisonExp;
};

export type ServiceTemplatesAggregateBoolExpBool_And = {
  arguments: ServiceTemplatesSelectColumnServiceTemplatesAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ServiceTemplatesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ServiceTemplatesAggregateBoolExpBool_Or = {
  arguments: ServiceTemplatesSelectColumnServiceTemplatesAggregateBoolExpBool_OrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ServiceTemplatesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ServiceTemplatesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<ServiceTemplatesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ServiceTemplatesBoolExp>;
  predicate: IntComparisonExp;
};

export type ServicesAggregateBoolExpBool_And = {
  arguments: ServicesSelectColumnServicesAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ServicesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ServicesAggregateBoolExpBool_Or = {
  arguments: ServicesSelectColumnServicesAggregateBoolExpBool_OrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ServicesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ServicesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<ServicesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ServicesBoolExp>;
  predicate: IntComparisonExp;
};

export type TimeEntriesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<TimeEntriesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<TimeEntriesBoolExp>;
  predicate: IntComparisonExp;
};

export type UserEmailTemplateFavoritesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<UserEmailTemplateFavoritesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UserEmailTemplateFavoritesBoolExp>;
  predicate: IntComparisonExp;
};

export type UserInvitationsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UserInvitationsBoolExp>;
  predicate: IntComparisonExp;
};

export type UserRolesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<UserRolesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UserRolesBoolExp>;
  predicate: IntComparisonExp;
};

export type UserSessionsAggregateBoolExpBool_And = {
  arguments: UserSessionsSelectColumnUserSessionsAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UserSessionsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type UserSessionsAggregateBoolExpBool_Or = {
  arguments: UserSessionsSelectColumnUserSessionsAggregateBoolExpBool_OrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UserSessionsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type UserSessionsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<UserSessionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UserSessionsBoolExp>;
  predicate: IntComparisonExp;
};

export type UserSkillsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<UserSkillsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UserSkillsBoolExp>;
  predicate: IntComparisonExp;
};

export type UsersAggregateBoolExpBool_And = {
  arguments: UsersSelectColumnUsersAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UsersBoolExp>;
  predicate: BooleanComparisonExp;
};

export type UsersAggregateBoolExpBool_Or = {
  arguments: UsersSelectColumnUsersAggregateBoolExpBool_OrArgumentsColumns;
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

export type WorkScheduleAggregateBoolExpBool_And = {
  arguments: WorkScheduleSelectColumnWorkScheduleAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<WorkScheduleBoolExp>;
  predicate: BooleanComparisonExp;
};

export type WorkScheduleAggregateBoolExpBool_Or = {
  arguments: WorkScheduleSelectColumnWorkScheduleAggregateBoolExpBool_OrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<WorkScheduleBoolExp>;
  predicate: BooleanComparisonExp;
};

export type WorkScheduleAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<WorkScheduleSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<WorkScheduleBoolExp>;
  predicate: IntComparisonExp;
};

export type CreateAuditLogMutationVariables = Exact<{
  userId: Scalars['uuid']['input'];
  action: Scalars['String']['input'];
  resourceType: Scalars['String']['input'];
  resourceId?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateAuditLogMutation = { __typename?: 'mutation_root', insertAuditAuditLog?: { __typename?: 'AuditAuditLogMutationResponse', returning: Array<{ __typename?: 'AuditAuditLog', id: string, eventTime: string }> } | null };

export type CreateAuthEventMutationVariables = Exact<{
  userId?: InputMaybe<Scalars['uuid']['input']>;
  eventType: Scalars['String']['input'];
  success: Scalars['Boolean']['input'];
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
}>;


export type CreateAuthEventMutation = { __typename?: 'mutation_root', insertAuditAuthEvents?: { __typename?: 'AuditAuthEventsMutationResponse', returning: Array<{ __typename?: 'AuditAuthEvents', id: string, eventTime: string }> } | null };

export type LogAuthEventMutationVariables = Exact<{
  eventType: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
  failureReason?: InputMaybe<Scalars['String']['input']>;
}>;


export type LogAuthEventMutation = { __typename?: 'mutation_root', insertAuditAuthEvents?: { __typename?: 'AuditAuthEventsMutationResponse', returning: Array<{ __typename?: 'AuditAuthEvents', id: string, eventTime: string }> } | null };

export type LogDataAccessEventMutationVariables = Exact<{
  userId: Scalars['uuid']['input'];
  resourceType: Scalars['String']['input'];
  resourceId?: InputMaybe<Scalars['String']['input']>;
  accessType: Scalars['String']['input'];
  ipAddress?: InputMaybe<Scalars['inet']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
}>;


export type LogDataAccessEventMutation = { __typename?: 'mutation_root', insertAuditDataAccessLog?: { __typename?: 'AuditDataAccessLogMutationResponse', returning: Array<{ __typename?: 'AuditDataAccessLog', id: string, accessedAt: string }> } | null };

export type LogPermissionAuditEventMutationVariables = Exact<{
  changedByUserId: Scalars['uuid']['input'];
  targetUserId?: InputMaybe<Scalars['uuid']['input']>;
  changeType: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  oldPermissions?: InputMaybe<Scalars['jsonb']['input']>;
  newPermissions?: InputMaybe<Scalars['jsonb']['input']>;
}>;


export type LogPermissionAuditEventMutation = { __typename?: 'mutation_root', insertAuditPermissionChanges?: { __typename?: 'AuditPermissionChangesMutationResponse', returning: Array<{ __typename?: 'AuditPermissionChanges', id: string, changedAt: string }> } | null };

export type DeleteOldAuditLogsMutationVariables = Exact<{
  beforeDate: Scalars['timestamptz']['input'];
}>;


export type DeleteOldAuditLogsMutation = { __typename?: 'mutation_root', deleteAuditAuditLog?: { __typename?: 'AuditAuditLogMutationResponse', affectedRows: number } | null };

export type GetAuditLogsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AuditAuditLogBoolExp>;
  orderBy?: InputMaybe<Array<AuditAuditLogOrderBy> | AuditAuditLogOrderBy>;
}>;


export type GetAuditLogsQuery = { __typename?: 'query_root', auditAuditLog: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }>, auditAuditLogAggregate: { __typename?: 'AuditAuditLogAggregate', aggregate?: { __typename?: 'AuditAuditLogAggregateFields', count: number } | null } };

export type GetAuthEventsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AuditAuthEventsBoolExp>;
  orderBy?: InputMaybe<Array<AuditAuthEventsOrderBy> | AuditAuthEventsOrderBy>;
}>;


export type GetAuthEventsQuery = { __typename?: 'query_root', auditAuthEvents: Array<{ __typename?: 'AuditAuthEvents', id: string, userId?: string | null, userEmail?: string | null, eventType: string, eventTime: string, success?: boolean | null, failureReason?: string | null, ipAddress?: any | null, userAgent?: string | null, metadata?: any | null }>, auditAuthEventsAggregate: { __typename?: 'AuditAuthEventsAggregate', aggregate?: { __typename?: 'AuditAuthEventsAggregateFields', count: number } | null } };

export type GetAuditSummaryQueryVariables = Exact<{
  timeRange: Scalars['timestamptz']['input'];
}>;


export type GetAuditSummaryQuery = { __typename?: 'query_root', totalActions: { __typename?: 'AuditAuditLogAggregate', aggregate?: { __typename?: 'AuditAuditLogAggregateFields', count: number } | null }, actionsByType: Array<{ __typename?: 'AuditAuditLog', action: string }>, mostActiveUsers: Array<{ __typename?: 'AuditAuditLog', userId?: string | null }>, authEventsByType: Array<{ __typename?: 'AuditAuthEvents', eventType: string }> };

export type GetResourceAccessHistoryQueryVariables = Exact<{
  resourceType: Scalars['String']['input'];
  resourceId: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetResourceAccessHistoryQuery = { __typename?: 'query_root', auditAuditLog: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }> };

export type GetUserActivityTimelineQueryVariables = Exact<{
  userId: Scalars['uuid']['input'];
  startDate: Scalars['timestamptz']['input'];
  endDate: Scalars['timestamptz']['input'];
}>;


export type GetUserActivityTimelineQuery = { __typename?: 'query_root', auditAuditLog: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }>, auditAuthEvents: Array<{ __typename?: 'AuditAuthEvents', id: string, eventType: string, success?: boolean | null, eventTime: string, ipAddress?: any | null, userAgent?: string | null }> };

export type GetDataAccessReportQueryVariables = Exact<{
  startDate: Scalars['timestamptz']['input'];
  endDate: Scalars['timestamptz']['input'];
  resourceType?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetDataAccessReportQuery = { __typename?: 'query_root', auditDataAccessLog: Array<{ __typename?: 'AuditDataAccessLog', id: string, userId: string, resourceType: string, resourceId?: string | null, accessType: string, accessedAt: string, dataClassification?: string | null, fieldsAccessed?: Array<string> | null, rowCount?: number | null, ipAddress?: any | null, metadata?: any | null }> };

export type GetComplianceAuditTrailQueryVariables = Exact<{
  startDate: Scalars['timestamptz']['input'];
  endDate: Scalars['timestamptz']['input'];
}>;


export type GetComplianceAuditTrailQuery = { __typename?: 'query_root', permissionChanges: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }>, userChanges: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }>, dataExports: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }> };

export type GenerateSoc2AuditReportQueryVariables = Exact<{
  startDate: Scalars['timestamptz']['input'];
  endDate: Scalars['timestamptz']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GenerateSoc2AuditReportQuery = { __typename?: 'query_root', authenticationEvents: Array<{ __typename?: 'AuditAuthEvents', id: string, userId?: string | null, userEmail?: string | null, eventType: string, eventTime: string, success?: boolean | null, failureReason?: string | null, ipAddress?: any | null, userAgent?: string | null, metadata?: any | null }>, dataAccessEvents: Array<{ __typename?: 'AuditDataAccessLog', id: string, userId: string, resourceType: string, resourceId?: string | null, accessType: string, accessedAt: string, dataClassification?: string | null, fieldsAccessed?: Array<string> | null, rowCount?: number | null, ipAddress?: any | null, metadata?: any | null }>, systemChanges: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }>, privilegedAccess: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }> };

export type AuditLogQueryVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type AuditLogQuery = { __typename?: 'query_root', auditAuditLogByPk?: { __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null } | null };

export type ComplianceReportQueryVariables = Exact<{
  startDate: Scalars['timestamptz']['input'];
  endDate: Scalars['timestamptz']['input'];
}>;


export type ComplianceReportQuery = { __typename?: 'query_root', auditAuditLog: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }> };

export type ComplianceAuditLogsQueryVariables = Exact<{
  startDate: Scalars['timestamptz']['input'];
  endDate: Scalars['timestamptz']['input'];
}>;


export type ComplianceAuditLogsQuery = { __typename?: 'query_root', auditAuditLog: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }> };

export type SecurityOverviewQueryVariables = Exact<{
  timeRange: Scalars['timestamptz']['input'];
}>;


export type SecurityOverviewQuery = { __typename?: 'query_root', totalAuditLogs: { __typename?: 'AuditAuditLogAggregate', aggregate?: { __typename?: 'AuditAuditLogAggregateFields', count: number } | null }, failedLogins: { __typename?: 'AuditAuthEventsAggregate', aggregate?: { __typename?: 'AuditAuthEventsAggregateFields', count: number } | null } };

export type CleanAllPayrollDatesQueryVariables = Exact<{ [key: string]: never; }>;


export type CleanAllPayrollDatesQuery = { __typename?: 'query_root', payrollDates: Array<{ __typename?: 'PayrollDates', id: string, payrollId: string, originalEftDate: string }> };

export type GetSecurityIncidentAnalysisQueryVariables = Exact<{
  startDate: Scalars['timestamptz']['input'];
  endDate: Scalars['timestamptz']['input'];
}>;


export type GetSecurityIncidentAnalysisQuery = { __typename?: 'query_root', failedAuthentications: Array<{ __typename?: 'AuditAuthEvents', id: string, userId?: string | null, userEmail?: string | null, eventType: string, eventTime: string, success?: boolean | null, failureReason?: string | null, ipAddress?: any | null, userAgent?: string | null, metadata?: any | null }>, suspiciousActivity: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }>, permissionDenials: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }> };

export type GetUserActivityAnalyticsQueryVariables = Exact<{
  startDate: Scalars['timestamptz']['input'];
  endDate: Scalars['timestamptz']['input'];
  userId?: InputMaybe<Scalars['uuid']['input']>;
}>;


export type GetUserActivityAnalyticsQuery = { __typename?: 'query_root', userSessions: Array<{ __typename?: 'AuditAuthEvents', id: string, userId?: string | null, userEmail?: string | null, eventType: string, eventTime: string, success?: boolean | null, failureReason?: string | null, ipAddress?: any | null, userAgent?: string | null, metadata?: any | null }>, resourceAccess: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }>, permissionUsage: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }> };

export type GetDataRetentionAnalyticsQueryVariables = Exact<{
  retentionDate: Scalars['timestamptz']['input'];
}>;


export type GetDataRetentionAnalyticsQuery = { __typename?: 'query_root', auditLogRetention: { __typename?: 'AuditAuditLogAggregate', aggregate?: { __typename?: 'AuditAuditLogAggregateFields', count: number, min?: { __typename?: 'AuditAuditLogMinFields', eventTime?: string | null } | null, max?: { __typename?: 'AuditAuditLogMaxFields', eventTime?: string | null } | null } | null }, dataAccessRetention: { __typename?: 'AuditDataAccessLogAggregate', aggregate?: { __typename?: 'AuditDataAccessLogAggregateFields', count: number, min?: { __typename?: 'AuditDataAccessLogMinFields', accessedAt?: string | null } | null, max?: { __typename?: 'AuditDataAccessLogMaxFields', accessedAt?: string | null } | null } | null }, oldAuditLogs: { __typename?: 'AuditAuditLogAggregate', aggregate?: { __typename?: 'AuditAuditLogAggregateFields', count: number } | null } };

export type GetSystemHealthAnalyticsQueryVariables = Exact<{
  timeRange: Scalars['timestamptz']['input'];
}>;


export type GetSystemHealthAnalyticsQuery = { __typename?: 'query_root', apiUsage: { __typename?: 'AuditAuditLogAggregate', aggregate?: { __typename?: 'AuditAuditLogAggregateFields', count: number } | null }, systemErrors: { __typename?: 'AuditAuditLogAggregate', aggregate?: { __typename?: 'AuditAuditLogAggregateFields', count: number } | null }, resourceUsageStats: { __typename?: 'AuditAuditLogAggregate', aggregate?: { __typename?: 'AuditAuditLogAggregateFields', count: number } | null } };

export type SearchAuditLogsQueryVariables = Exact<{
  searchTerm: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['timestamptz']['input']>;
  endDate?: InputMaybe<Scalars['timestamptz']['input']>;
  resourceTypes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  actions?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  userIds?: InputMaybe<Array<Scalars['uuid']['input']> | Scalars['uuid']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchAuditLogsQuery = { __typename?: 'query_root', auditAuditLog: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }>, searchResults: { __typename?: 'AuditAuditLogAggregate', aggregate?: { __typename?: 'AuditAuditLogAggregateFields', count: number } | null } };

export type GetComplianceMonitoringDataQueryVariables = Exact<{
  timeRange: Scalars['timestamptz']['input'];
}>;


export type GetComplianceMonitoringDataQuery = { __typename?: 'query_root', criticalEvents: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }>, authMetrics: { __typename?: 'AuditAuthEventsAggregate', aggregate?: { __typename?: 'AuditAuthEventsAggregateFields', count: number } | null }, failedAccess: { __typename?: 'AuditAuthEventsAggregate', aggregate?: { __typename?: 'AuditAuthEventsAggregateFields', count: number } | null }, sensitiveDataAccess: { __typename?: 'AuditDataAccessLogAggregate', aggregate?: { __typename?: 'AuditDataAccessLogAggregateFields', count: number } | null } };

export type GetSecurityDashboardOverviewQueryVariables = Exact<{
  timeRange: Scalars['timestamptz']['input'];
}>;


export type GetSecurityDashboardOverviewQuery = { __typename?: 'query_root', totalUsers: { __typename?: 'UsersAggregate', aggregate?: { __typename?: 'UsersAggregateFields', count: number } | null }, activeUsers: { __typename?: 'UsersAggregate', aggregate?: { __typename?: 'UsersAggregateFields', count: number } | null }, inactiveUsers: { __typename?: 'UsersAggregate', aggregate?: { __typename?: 'UsersAggregateFields', count: number } | null }, totalRoles: { __typename?: 'RolesAggregate', aggregate?: { __typename?: 'RolesAggregateFields', count: number } | null }, recentEvents: { __typename?: 'AuditAuditLogAggregate', aggregate?: { __typename?: 'AuditAuditLogAggregateFields', count: number } | null }, failedLogins: { __typename?: 'AuditAuthEventsAggregate', aggregate?: { __typename?: 'AuditAuthEventsAggregateFields', count: number } | null }, totalLogins: { __typename?: 'AuditAuthEventsAggregate', aggregate?: { __typename?: 'AuditAuthEventsAggregateFields', count: number } | null } };

export type GetSecurityDashboardActivityQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  timeRange: Scalars['timestamptz']['input'];
}>;


export type GetSecurityDashboardActivityQuery = { __typename?: 'query_root', recentActivity: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }>, recentAuthEvents: Array<{ __typename?: 'AuditAuthEvents', id: string, userId?: string | null, userEmail?: string | null, eventType: string, eventTime: string, success?: boolean | null, failureReason?: string | null, ipAddress?: any | null, userAgent?: string | null, metadata?: any | null }> };

export type GetSecurityUserStatsQueryVariables = Exact<{
  thirtyDaysAgo: Scalars['timestamptz']['input'];
}>;


export type GetSecurityUserStatsQuery = { __typename?: 'query_root', usersByRole: Array<{ __typename?: 'Users', role: any }>, staffCount: { __typename?: 'UsersAggregate', aggregate?: { __typename?: 'UsersAggregateFields', count: number } | null }, usersWithManagers: { __typename?: 'UsersAggregate', aggregate?: { __typename?: 'UsersAggregateFields', count: number } | null }, recentUsers: { __typename?: 'UsersAggregate', aggregate?: { __typename?: 'UsersAggregateFields', count: number } | null } };

export type GetSecurityAuditLogsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  timeRange?: InputMaybe<Scalars['timestamptz']['input']>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetSecurityAuditLogsQuery = { __typename?: 'query_root', auditAuditLog: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }>, auditAuditLogAggregate: { __typename?: 'AuditAuditLogAggregate', aggregate?: { __typename?: 'AuditAuditLogAggregateFields', count: number } | null }, auditAuthEvents: Array<{ __typename?: 'AuditAuthEvents', id: string, userId?: string | null, userEmail?: string | null, eventType: string, eventTime: string, success?: boolean | null, failureReason?: string | null, ipAddress?: any | null, userAgent?: string | null, metadata?: any | null }> };

export type GetPermissionsDashboardDataQueryVariables = Exact<{
  sevenDaysAgo: Scalars['timestamptz']['input'];
}>;


export type GetPermissionsDashboardDataQuery = { __typename?: 'query_root', roles: Array<{ __typename?: 'Roles', id: string, name: string, displayName: string, description?: string | null, priority: number, isSystemRole: boolean, rolePermissionsAggregate: { __typename?: 'RolePermissionsAggregate', aggregate?: { __typename?: 'RolePermissionsAggregateFields', count: number } | null }, userRolesAggregate: { __typename?: 'UserRolesAggregate', aggregate?: { __typename?: 'UserRolesAggregateFields', count: number } | null } }>, users: Array<{ __typename?: 'Users', role: any, isActive?: boolean | null, isStaff?: boolean | null, id: string, firstName: string, lastName: string, computedName?: string | null, email: string, roleAssignments: Array<{ __typename?: 'UserRoles', role: { __typename?: 'Roles', id: string, name: string, displayName: string, priority: number } }> }>, permissionOverrides: Array<{ __typename?: 'PermissionOverrides', id: string, userId?: string | null, role?: string | null, resource: string, operation: string, granted: boolean, reason?: string | null, conditions?: any | null, expiresAt?: string | null, createdBy?: string | null, createdAt: string }>, recentPermissionChanges: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }> };

export type GetSoc2ComplianceDataQueryVariables = Exact<{
  timeRange: Scalars['timestamptz']['input'];
}>;


export type GetSoc2ComplianceDataQuery = { __typename?: 'query_root', totalAuditLogs: { __typename?: 'AuditAuditLogAggregate', aggregate?: { __typename?: 'AuditAuditLogAggregateFields', count: number } | null }, failedAccessAttempts: { __typename?: 'AuditAuditLogAggregate', aggregate?: { __typename?: 'AuditAuditLogAggregateFields', count: number } | null }, authenticationEvents: { __typename?: 'AuditAuthEventsAggregate', aggregate?: { __typename?: 'AuditAuthEventsAggregateFields', count: number } | null }, failedAuthentication: { __typename?: 'AuditAuthEventsAggregate', aggregate?: { __typename?: 'AuditAuthEventsAggregateFields', count: number } | null }, dataAccessEvents: { __typename?: 'AuditDataAccessLogAggregate', aggregate?: { __typename?: 'AuditDataAccessLogAggregateFields', count: number } | null }, sensitiveDataAccess: { __typename?: 'AuditDataAccessLogAggregate', aggregate?: { __typename?: 'AuditDataAccessLogAggregateFields', count: number } | null }, activeUsers: { __typename?: 'UsersAggregate', aggregate?: { __typename?: 'UsersAggregateFields', count: number } | null }, totalUsers: { __typename?: 'UsersAggregate', aggregate?: { __typename?: 'UsersAggregateFields', count: number } | null }, staffUsers: { __typename?: 'UsersAggregate', aggregate?: { __typename?: 'UsersAggregateFields', count: number } | null }, criticalSecurityEvents: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }> };

export type AuditLogStreamSubscriptionVariables = Exact<{
  resourceTypes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  actions?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  sinceTimestamp: Scalars['timestamptz']['input'];
}>;


export type AuditLogStreamSubscription = { __typename?: 'subscription_root', auditAuditLog: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }> };

export type AuthEventStreamSubscriptionVariables = Exact<{
  eventTypes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  sinceTimestamp: Scalars['timestamptz']['input'];
}>;


export type AuthEventStreamSubscription = { __typename?: 'subscription_root', auditAuthEvents: Array<{ __typename?: 'AuditAuthEvents', id: string, userId?: string | null, userEmail?: string | null, eventType: string, eventTime: string, success?: boolean | null, failureReason?: string | null, ipAddress?: any | null, userAgent?: string | null, metadata?: any | null }> };

export type SubscribeToAuditLogsSubscriptionVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SubscribeToAuditLogsSubscription = { __typename?: 'subscription_root', auditAuditLog: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }> };

export type SecurityEventsStreamSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SecurityEventsStreamSubscription = { __typename?: 'subscription_root', auditAuditLog: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }> };

export type FailedOperationsStreamSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type FailedOperationsStreamSubscription = { __typename?: 'subscription_root', auditAuditLog: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }> };

export type CriticalDataAccessStreamSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CriticalDataAccessStreamSubscription = { __typename?: 'subscription_root', auditAuditLog: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }> };

export type DataAccessStreamSubscriptionVariables = Exact<{
  resourceTypes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  sinceTimestamp: Scalars['timestamptz']['input'];
}>;


export type DataAccessStreamSubscription = { __typename?: 'subscription_root', auditDataAccessLog: Array<{ __typename?: 'AuditDataAccessLog', id: string, userId: string, resourceType: string, resourceId?: string | null, accessType: string, accessedAt: string, dataClassification?: string | null, fieldsAccessed?: Array<string> | null, rowCount?: number | null, ipAddress?: any | null, metadata?: any | null }> };

export type SensitiveAuditStreamSubscriptionVariables = Exact<{
  resourceTypes: Array<Scalars['String']['input']> | Scalars['String']['input'];
  sinceTimestamp: Scalars['timestamptz']['input'];
}>;


export type SensitiveAuditStreamSubscription = { __typename?: 'subscription_root', auditAuditLog: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }> };

export type PermissionAuditStreamSubscriptionVariables = Exact<{
  sinceTimestamp: Scalars['timestamptz']['input'];
}>;


export type PermissionAuditStreamSubscription = { __typename?: 'subscription_root', auditPermissionChanges: Array<{ __typename?: 'AuditPermissionChanges', id: string, targetUserId?: string | null, changedByUserId: string, changeType: string, reason?: string | null, changedAt: string, oldPermissions?: any | null, newPermissions?: any | null }> };

export type UserMinimalFragment = { __typename?: 'Users', id: string, firstName: string, lastName: string, computedName?: string | null, email: string };

export type UserCoreSharedFragment = { __typename?: 'Users', role: any, isActive?: boolean | null, id: string, firstName: string, lastName: string, computedName?: string | null, email: string };

export type UserBasicFragment = { __typename?: 'Users', clerkUserId?: string | null, createdAt?: string | null, updatedAt?: string | null, role: any, isActive?: boolean | null, id: string, firstName: string, lastName: string, computedName?: string | null, email: string };

export type UserBaseFragment = { __typename?: 'Users', clerkUserId?: string | null, createdAt?: string | null, updatedAt?: string | null, role: any, isActive?: boolean | null, id: string, firstName: string, lastName: string, computedName?: string | null, email: string };

export type UserWithRoleFragment = { __typename?: 'Users', username?: string | null, isStaff?: boolean | null, clerkUserId?: string | null, createdAt?: string | null, updatedAt?: string | null, role: any, isActive?: boolean | null, id: string, firstName: string, lastName: string, computedName?: string | null, email: string };

export type UserProfileFragment = { __typename?: 'Users', clerkUserId?: string | null, image?: string | null, managerId?: string | null, deactivatedAt?: string | null, deactivatedBy?: string | null, username?: string | null, isStaff?: boolean | null, createdAt?: string | null, updatedAt?: string | null, role: any, isActive?: boolean | null, id: string, firstName: string, lastName: string, computedName?: string | null, email: string, manager?: { __typename?: 'Users', id: string, firstName: string, lastName: string, computedName?: string | null, email: string } | null };

export type UserSearchResultFragment = { __typename?: 'Users', username?: string | null, isStaff?: boolean | null, role: any, isActive?: boolean | null, id: string, firstName: string, lastName: string, computedName?: string | null, email: string };

export type ClientMinimalFragment = { __typename?: 'Clients', id: string, name: string };

export type ClientBaseFragment = { __typename?: 'Clients', id: string, name: string, active?: boolean | null, contactEmail?: string | null, contactPerson?: string | null, contactPhone?: string | null, createdAt?: string | null };

export type ClientWithStatsFragment = { __typename?: 'Clients', id: string, name: string, active?: boolean | null, contactEmail?: string | null, contactPerson?: string | null, contactPhone?: string | null, createdAt?: string | null, currentEmployeeCount: { __typename?: 'PayrollsAggregate', aggregate?: { __typename?: 'PayrollsAggregateFields', sum?: { __typename?: 'PayrollsSumFields', employeeCount?: number | null } | null } | null }, activePayrollCount: { __typename?: 'PayrollsAggregate', aggregate?: { __typename?: 'PayrollsAggregateFields', count: number } | null } };

export type ClientListBaseFragment = { __typename?: 'Clients', id: string, name: string, active?: boolean | null, contactEmail?: string | null, contactPerson?: string | null, contactPhone?: string | null, createdAt?: string | null, payrollCount: { __typename?: 'PayrollsAggregate', aggregate?: { __typename?: 'PayrollsAggregateFields', count: number } | null } };

export type PayrollMinimalFragment = { __typename?: 'Payrolls', id: string, name: string, employeeCount?: number | null, status: any };

export type PayrollBaseFragment = { __typename?: 'Payrolls', id: string, name: string, employeeCount?: number | null, status: any, payrollSystem?: string | null, processingTime: number, processingDaysBeforeEft: number, versionNumber?: number | null, supersededDate?: string | null, createdAt?: string | null, updatedAt?: string | null };

export type PayrollWithClientFragment = { __typename?: 'Payrolls', clientId: string, id: string, name: string, employeeCount?: number | null, status: any, payrollSystem?: string | null, processingTime: number, processingDaysBeforeEft: number, versionNumber?: number | null, supersededDate?: string | null, createdAt?: string | null, updatedAt?: string | null, client: { __typename?: 'Clients', id: string, name: string, active?: boolean | null } };

export type PayrollListItemFragment = { __typename?: 'Payrolls', primaryConsultantUserId?: string | null, backupConsultantUserId?: string | null, managerUserId?: string | null, createdByUserId?: string | null, cycleId: string, dateTypeId: string, dateValue?: number | null, clientId: string, id: string, name: string, employeeCount?: number | null, status: any, payrollSystem?: string | null, processingTime: number, processingDaysBeforeEft: number, versionNumber?: number | null, supersededDate?: string | null, createdAt?: string | null, updatedAt?: string | null, payrollCycle: { __typename?: 'PayrollCycles', id: string, name: any, description?: string | null }, payrollDateType: { __typename?: 'PayrollDateTypes', id: string, name: any, description?: string | null }, primaryConsultant?: { __typename?: 'Users', id: string, firstName: string, lastName: string, computedName?: string | null, email: string } | null, backupConsultant?: { __typename?: 'Users', id: string, firstName: string, lastName: string, computedName?: string | null, email: string } | null, assignedManager?: { __typename?: 'Users', id: string, firstName: string, lastName: string, computedName?: string | null, email: string } | null, client: { __typename?: 'Clients', id: string, name: string, active?: boolean | null } };

export type PayrollWithDatesFragment = { __typename?: 'Payrolls', goLiveDate?: string | null, id: string, name: string, employeeCount?: number | null, status: any, payrollSystem?: string | null, processingTime: number, processingDaysBeforeEft: number, versionNumber?: number | null, supersededDate?: string | null, createdAt?: string | null, updatedAt?: string | null, payrollDates: Array<{ __typename?: 'PayrollDates', id: string, originalEftDate: string, adjustedEftDate: string, notes?: string | null }> };

export type PayrollFullDetailFragment = { __typename?: 'Payrolls', dateTypeId: string, cycleId: string, dateValue?: number | null, versionReason?: string | null, supersededDate?: string | null, parentPayrollId?: string | null, goLiveDate?: string | null, clientId: string, id: string, name: string, employeeCount?: number | null, status: any, payrollSystem?: string | null, processingTime: number, processingDaysBeforeEft: number, versionNumber?: number | null, createdAt?: string | null, updatedAt?: string | null, parentPayroll?: { __typename?: 'Payrolls', id: string, versionNumber?: number | null } | null, childPayrolls: Array<{ __typename?: 'Payrolls', id: string, versionNumber?: number | null, versionReason?: string | null, createdAt?: string | null }>, primaryConsultant?: { __typename?: 'Users', id: string, firstName: string, lastName: string, computedName?: string | null, email: string } | null, backupConsultant?: { __typename?: 'Users', id: string, firstName: string, lastName: string, computedName?: string | null, email: string } | null, assignedManager?: { __typename?: 'Users', id: string, firstName: string, lastName: string, computedName?: string | null, email: string } | null, payrollDates: Array<{ __typename?: 'PayrollDates', id: string, originalEftDate: string, adjustedEftDate: string, notes?: string | null }>, client: { __typename?: 'Clients', id: string, name: string, active?: boolean | null } };

export type NoteWithAuthorFragment = { __typename?: 'Notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, entityId: string, entityType: string, author?: { __typename?: 'Users', id: string, firstName: string, lastName: string, computedName?: string | null, email: string } | null };

export type PermissionBaseFragment = { __typename?: 'Permissions', id: string, resourceId: string, description?: string | null, legacyPermissionName?: string | null, action: any };

export type RoleWithPermissionsFragment = { __typename?: 'Roles', id: string, name: string, displayName: string, description?: string | null, isSystemRole: boolean, priority: number, rolePermissions: Array<{ __typename?: 'RolePermissions', permission: { __typename?: 'Permissions', id: string, resourceId: string, description?: string | null, legacyPermissionName?: string | null, action: any } }> };

export type AuditLogEntryFragment = { __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null };

export type AuthEventFragment = { __typename?: 'AuditAuthEvents', id: string, userId?: string | null, userEmail?: string | null, eventType: string, eventTime: string, success?: boolean | null, failureReason?: string | null, ipAddress?: any | null, userAgent?: string | null, metadata?: any | null };

export type DataAccessLogFragment = { __typename?: 'AuditDataAccessLog', id: string, userId: string, resourceType: string, resourceId?: string | null, accessType: string, accessedAt: string, dataClassification?: string | null, fieldsAccessed?: Array<string> | null, rowCount?: number | null, ipAddress?: any | null, metadata?: any | null };

export type PermissionChangeFragment = { __typename?: 'AuditPermissionChanges', id: string, changedAt: string, changedByUserId: string, targetUserId?: string | null, targetRoleId?: string | null, changeType: string, permissionType?: string | null, oldPermissions?: any | null, newPermissions?: any | null, reason?: string | null, approvedByUserId?: string | null };

export type PayrollDateInfoFragment = { __typename?: 'PayrollDates', id: string, originalEftDate: string, adjustedEftDate: string, notes?: string | null, createdAt?: string | null };

export type PermissionOverrideInfoFragment = { __typename?: 'PermissionOverrides', id: string, userId?: string | null, role?: string | null, resource: string, operation: string, granted: boolean, reason?: string | null, conditions?: any | null, expiresAt?: string | null, createdBy?: string | null, createdAt: string };

export type LogAuditEventMutationVariables = Exact<{
  input: AuditAuditLogInsertInput;
}>;


export type LogAuditEventMutation = { __typename?: 'mutation_root', insertAuditAuditLog?: { __typename?: 'AuditAuditLogMutationResponse', returning: Array<{ __typename?: 'AuditAuditLog', id: string, eventTime: string }> } | null };

export type InsertFileMutationVariables = Exact<{
  input: FilesInsertInput;
}>;


export type InsertFileMutation = { __typename?: 'mutation_root', insertFiles?: { __typename?: 'FilesMutationResponse', returning: Array<{ __typename?: 'Files', id: string, filename: string, bucket: string, objectKey: string, size?: number | null, mimetype?: string | null, url?: string | null, clientId?: string | null, payrollId?: string | null, uploadedBy?: string | null, category?: string | null, isPublic?: boolean | null, metadata?: any | null, fileType?: string | null, createdAt?: string | null }> } | null };

export type UpdateFileMetadataMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  updates: FilesSetInput;
}>;


export type UpdateFileMetadataMutation = { __typename?: 'mutation_root', updateFilesByPk?: { __typename?: 'Files', id: string, filename: string, bucket: string, objectKey: string, size?: number | null, mimetype?: string | null, url?: string | null, clientId?: string | null, payrollId?: string | null, uploadedBy?: string | null, category?: string | null, isPublic?: boolean | null, metadata?: any | null, fileType?: string | null, createdAt?: string | null } | null };

export type DeleteFileMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type DeleteFileMutation = { __typename?: 'mutation_root', deleteFilesByPk?: { __typename?: 'Files', id: string, filename: string, objectKey: string } | null };

export type RefreshDataMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshDataMutation = { __typename: 'mutation_root' };

export type GetDashboardMetricsQueryVariables = Exact<{
  userId: Scalars['uuid']['input'];
}>;


export type GetDashboardMetricsQuery = { __typename?: 'query_root', clientsAggregate: { __typename?: 'ClientsAggregate', aggregate?: { __typename?: 'ClientsAggregateFields', count: number } | null }, activePayrollsAggregate: { __typename?: 'PayrollsAggregate', aggregate?: { __typename?: 'PayrollsAggregateFields', count: number } | null }, totalEmployeesAggregate: { __typename?: 'PayrollsAggregate', aggregate?: { __typename?: 'PayrollsAggregateFields', sum?: { __typename?: 'PayrollsSumFields', employeeCount?: number | null } | null } | null }, upcomingPayrolls: Array<{ __typename?: 'Payrolls', id: string, name: string, employeeCount?: number | null, status: any, client: { __typename?: 'Clients', id: string, name: string } }> };

export type GetDashboardStatsOptimizedQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetDashboardStatsOptimizedQuery = { __typename?: 'query_root', clientsAggregate: { __typename?: 'ClientsAggregate', aggregate?: { __typename?: 'ClientsAggregateFields', count: number } | null }, totalPayrolls: { __typename?: 'PayrollsAggregate', aggregate?: { __typename?: 'PayrollsAggregateFields', count: number } | null }, activePayrolls: { __typename?: 'PayrollsAggregate', aggregate?: { __typename?: 'PayrollsAggregateFields', count: number } | null }, upcomingPayrolls: Array<{ __typename?: 'Payrolls', id: string, name: string, status: any, client: { __typename?: 'Clients', id: string, name: string }, nextEftDate: Array<{ __typename?: 'PayrollDates', originalEftDate: string, adjustedEftDate: string, processingDate: string }> }> };

export type GetClientsDashboardStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetClientsDashboardStatsQuery = { __typename?: 'query_root', activeClientsCount: { __typename?: 'ClientsAggregate', aggregate?: { __typename?: 'ClientsAggregateFields', count: number } | null }, totalPayrollsCount: { __typename?: 'PayrollsAggregate', aggregate?: { __typename?: 'PayrollsAggregateFields', count: number } | null }, totalEmployeesSum: { __typename?: 'PayrollsAggregate', aggregate?: { __typename?: 'PayrollsAggregateFields', sum?: { __typename?: 'PayrollsSumFields', employeeCount?: number | null } | null } | null }, clientsNeedingAttention: Array<{ __typename?: 'Clients', id: string, name: string }> };

export type GetCurrentUserQueryVariables = Exact<{
  userId: Scalars['uuid']['input'];
}>;


export type GetCurrentUserQuery = { __typename?: 'query_root', user?: { __typename?: 'Users', clerkUserId?: string | null, image?: string | null, managerId?: string | null, deactivatedAt?: string | null, deactivatedBy?: string | null, username?: string | null, isStaff?: boolean | null, createdAt?: string | null, updatedAt?: string | null, role: any, isActive?: boolean | null, id: string, firstName: string, lastName: string, computedName?: string | null, email: string, manager?: { __typename?: 'Users', id: string, firstName: string, lastName: string, computedName?: string | null, email: string } | null } | null };

export type GetUsersForDropdownQueryVariables = Exact<{
  role?: InputMaybe<Scalars['user_role']['input']>;
}>;


export type GetUsersForDropdownQuery = { __typename?: 'query_root', users: Array<{ __typename?: 'Users', id: string, firstName: string, lastName: string, computedName?: string | null, email: string }> };

export type GetSystemHealthQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSystemHealthQuery = { __typename?: 'query_root', databaseHealth: Array<{ __typename?: 'Users', id: string }>, recentActivity: { __typename?: 'AuditAuditLogAggregate', aggregate?: { __typename?: 'AuditAuditLogAggregateFields', count: number } | null } };

export type GlobalSearchQueryVariables = Exact<{
  searchTerm: Scalars['String']['input'];
}>;


export type GlobalSearchQuery = { __typename?: 'query_root', clients: Array<{ __typename?: 'Clients', id: string, name: string }>, users: Array<{ __typename?: 'Users', id: string, firstName: string, lastName: string, computedName?: string | null, email: string }>, payrolls: Array<{ __typename?: 'Payrolls', id: string, name: string, employeeCount?: number | null, status: any, client: { __typename?: 'Clients', id: string, name: string } }> };

export type GetFileByIdQueryVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type GetFileByIdQuery = { __typename?: 'query_root', filesByPk?: { __typename?: 'Files', id: string, filename: string, bucket: string, objectKey: string, size?: number | null, mimetype?: string | null, url?: string | null, clientId?: string | null, payrollId?: string | null, uploadedBy?: string | null, category?: string | null, isPublic?: boolean | null, metadata?: any | null, fileType?: string | null, createdAt?: string | null, client?: { __typename?: 'Clients', name: string } | null, payroll?: { __typename?: 'Payrolls', name: string } | null } | null };

export type ListFilesQueryVariables = Exact<{
  where?: InputMaybe<FilesBoolExp>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FilesOrderBy> | FilesOrderBy>;
}>;


export type ListFilesQuery = { __typename?: 'query_root', files: Array<{ __typename?: 'Files', id: string, filename: string, bucket: string, objectKey: string, size?: number | null, mimetype?: string | null, url?: string | null, clientId?: string | null, payrollId?: string | null, uploadedBy?: string | null, category?: string | null, isPublic?: boolean | null, metadata?: any | null, fileType?: string | null, createdAt?: string | null, client?: { __typename?: 'Clients', name: string } | null, payroll?: { __typename?: 'Payrolls', name: string } | null }>, filesAggregate: { __typename?: 'FilesAggregate', aggregate?: { __typename?: 'FilesAggregateFields', count: number } | null } };

export type RecentActivitySubscriptionVariables = Exact<{
  resourceTypes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type RecentActivitySubscription = { __typename?: 'subscription_root', auditAuditLog: Array<{ __typename?: 'AuditAuditLog', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }> };

export type AuthenticationEventsSubscriptionVariables = Exact<{
  userId?: InputMaybe<Scalars['uuid']['input']>;
}>;


export type AuthenticationEventsSubscription = { __typename?: 'subscription_root', auditAuthEvents: Array<{ __typename?: 'AuditAuthEvents', id: string, userId?: string | null, userEmail?: string | null, eventType: string, eventTime: string, success?: boolean | null, failureReason?: string | null, ipAddress?: any | null, userAgent?: string | null, metadata?: any | null }> };

export type SensitiveDataAccessSubscriptionVariables = Exact<{
  resourceTypes: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type SensitiveDataAccessSubscription = { __typename?: 'subscription_root', auditDataAccessLog: Array<{ __typename?: 'AuditDataAccessLog', id: string, userId: string, resourceType: string, resourceId?: string | null, accessType: string, accessedAt: string, dataClassification?: string | null, fieldsAccessed?: Array<string> | null, rowCount?: number | null, ipAddress?: any | null, metadata?: any | null }> };

export type PermissionChangeStreamSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type PermissionChangeStreamSubscription = { __typename?: 'subscription_root', auditPermissionChanges: Array<{ __typename?: 'AuditPermissionChanges', id: string, changedAt: string, changedByUserId: string, targetUserId?: string | null, targetRoleId?: string | null, changeType: string, permissionType?: string | null, oldPermissions?: any | null, newPermissions?: any | null, reason?: string | null, approvedByUserId?: string | null }> };

export const UserMinimalFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"computedName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<UserMinimalFragment, unknown>;
export const UserCoreSharedFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCoreShared"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"computedName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<UserCoreSharedFragment, unknown>;
export const UserBasicFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCoreShared"}},{"kind":"Field","name":{"kind":"Name","value":"clerkUserId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"computedName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCoreShared"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]} as unknown as DocumentNode<UserBasicFragment, unknown>;
export const UserBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBasic"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"computedName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCoreShared"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCoreShared"}},{"kind":"Field","name":{"kind":"Name","value":"clerkUserId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UserBaseFragment, unknown>;
export const UserWithRoleFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserWithRole"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBasic"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"isStaff"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"computedName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCoreShared"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCoreShared"}},{"kind":"Field","name":{"kind":"Name","value":"clerkUserId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UserWithRoleFragment, unknown>;
export const UserProfileFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserProfile"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserWithRole"}},{"kind":"Field","name":{"kind":"Name","value":"clerkUserId"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"managerId"}},{"kind":"Field","name":{"kind":"Name","value":"deactivatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deactivatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"manager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"computedName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCoreShared"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCoreShared"}},{"kind":"Field","name":{"kind":"Name","value":"clerkUserId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserWithRole"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBasic"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"isStaff"}}]}}]} as unknown as DocumentNode<UserProfileFragment, unknown>;
export const UserSearchResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserSearchResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCoreShared"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"isStaff"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"computedName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCoreShared"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]} as unknown as DocumentNode<UserSearchResultFragment, unknown>;
export const ClientMinimalFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<ClientMinimalFragment, unknown>;
export const ClientBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"contactPerson"}},{"kind":"Field","name":{"kind":"Name","value":"contactPhone"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ClientBaseFragment, unknown>;
export const ClientWithStatsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientWithStats"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientBase"}},{"kind":"Field","alias":{"kind":"Name","value":"currentEmployeeCount"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sum"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"activePayrollCount"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"Active","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"contactPerson"}},{"kind":"Field","name":{"kind":"Name","value":"contactPhone"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ClientWithStatsFragment, unknown>;
export const ClientListBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientListBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientBase"}},{"kind":"Field","alias":{"kind":"Name","value":"payrollCount"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"contactPerson"}},{"kind":"Field","name":{"kind":"Name","value":"contactPhone"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ClientListBaseFragment, unknown>;
export const PayrollMinimalFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<PayrollMinimalFragment, unknown>;
export const PayrollBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"payrollSystem"}},{"kind":"Field","name":{"kind":"Name","value":"processingTime"}},{"kind":"Field","name":{"kind":"Name","value":"processingDaysBeforeEft"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"supersededDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<PayrollBaseFragment, unknown>;
export const PayrollWithClientFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollWithClient"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollBase"}},{"kind":"Field","name":{"kind":"Name","value":"clientId"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"payrollSystem"}},{"kind":"Field","name":{"kind":"Name","value":"processingTime"}},{"kind":"Field","name":{"kind":"Name","value":"processingDaysBeforeEft"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"supersededDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<PayrollWithClientFragment, unknown>;
export const PayrollListItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollWithClient"}},{"kind":"Field","name":{"kind":"Name","value":"primaryConsultantUserId"}},{"kind":"Field","name":{"kind":"Name","value":"backupConsultantUserId"}},{"kind":"Field","name":{"kind":"Name","value":"managerUserId"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"cycleId"}},{"kind":"Field","name":{"kind":"Name","value":"dateTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"dateValue"}},{"kind":"Field","name":{"kind":"Name","value":"payrollCycle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payrollDateType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryConsultant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backupConsultant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedManager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"payrollSystem"}},{"kind":"Field","name":{"kind":"Name","value":"processingTime"}},{"kind":"Field","name":{"kind":"Name","value":"processingDaysBeforeEft"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"supersededDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollWithClient"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollBase"}},{"kind":"Field","name":{"kind":"Name","value":"clientId"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"computedName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<PayrollListItemFragment, unknown>;
export const PayrollWithDatesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollWithDates"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollBase"}},{"kind":"Field","name":{"kind":"Name","value":"goLiveDate"}},{"kind":"Field","name":{"kind":"Name","value":"payrollDates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"originalEftDate"},"value":{"kind":"EnumValue","value":"ASC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"originalEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"adjustedEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"payrollSystem"}},{"kind":"Field","name":{"kind":"Name","value":"processingTime"}},{"kind":"Field","name":{"kind":"Name","value":"processingDaysBeforeEft"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"supersededDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<PayrollWithDatesFragment, unknown>;
export const PayrollFullDetailFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollFullDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollWithDates"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollWithClient"}},{"kind":"Field","name":{"kind":"Name","value":"dateTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"cycleId"}},{"kind":"Field","name":{"kind":"Name","value":"dateValue"}},{"kind":"Field","name":{"kind":"Name","value":"versionReason"}},{"kind":"Field","name":{"kind":"Name","value":"supersededDate"}},{"kind":"Field","name":{"kind":"Name","value":"parentPayrollId"}},{"kind":"Field","name":{"kind":"Name","value":"parentPayroll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"childPayrolls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"versionNumber"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"versionReason"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryConsultant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backupConsultant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedManager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"payrollSystem"}},{"kind":"Field","name":{"kind":"Name","value":"processingTime"}},{"kind":"Field","name":{"kind":"Name","value":"processingDaysBeforeEft"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"supersededDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollWithDates"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollBase"}},{"kind":"Field","name":{"kind":"Name","value":"goLiveDate"}},{"kind":"Field","name":{"kind":"Name","value":"payrollDates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"originalEftDate"},"value":{"kind":"EnumValue","value":"ASC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"originalEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"adjustedEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollWithClient"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollBase"}},{"kind":"Field","name":{"kind":"Name","value":"clientId"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"computedName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<PayrollFullDetailFragment, unknown>;
export const NoteWithAuthorFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteWithAuthor"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"computedName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<NoteWithAuthorFragment, unknown>;
export const PermissionBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Permissions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"legacyPermissionName"}},{"kind":"Field","name":{"kind":"Name","value":"action"}}]}}]} as unknown as DocumentNode<PermissionBaseFragment, unknown>;
export const RoleWithPermissionsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleWithPermissions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Roles"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isSystemRole"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"rolePermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PermissionBase"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Permissions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"legacyPermissionName"}},{"kind":"Field","name":{"kind":"Name","value":"action"}}]}}]} as unknown as DocumentNode<RoleWithPermissionsFragment, unknown>;
export const AuditLogEntryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<AuditLogEntryFragment, unknown>;
export const AuthEventFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuthEvents"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<AuthEventFragment, unknown>;
export const DataAccessLogFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataAccessLog"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditDataAccessLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}},{"kind":"Field","name":{"kind":"Name","value":"fieldsAccessed"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<DataAccessLogFragment, unknown>;
export const PermissionChangeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionChange"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditPermissionChanges"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"changeType"}},{"kind":"Field","name":{"kind":"Name","value":"permissionType"}},{"kind":"Field","name":{"kind":"Name","value":"oldPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"newPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}}]}}]} as unknown as DocumentNode<PermissionChangeFragment, unknown>;
export const PayrollDateInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollDateInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PayrollDates"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"originalEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"adjustedEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<PayrollDateInfoFragment, unknown>;
export const PermissionOverrideInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionOverrideInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionOverrides"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"granted"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<PermissionOverrideInfoFragment, unknown>;
export const CreateAuditLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAuditLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"action"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"metadata"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"jsonb"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ipAddress"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"inet"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userAgent"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertAuditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"Variable","name":{"kind":"Name","value":"action"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"resourceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"metadata"},"value":{"kind":"Variable","name":{"kind":"Name","value":"metadata"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"ipAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ipAddress"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userAgent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userAgent"}}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}}]}}]}}]}}]} as unknown as DocumentNode<CreateAuditLogMutation, CreateAuditLogMutationVariables>;
export const CreateAuthEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAuthEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"success"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ipAddress"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"inet"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userAgent"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"metadata"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"jsonb"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertAuditAuthEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"Variable","name":{"kind":"Name","value":"success"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"ipAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ipAddress"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userAgent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userAgent"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"metadata"},"value":{"kind":"Variable","name":{"kind":"Name","value":"metadata"}}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}}]}}]}}]}}]} as unknown as DocumentNode<CreateAuthEventMutation, CreateAuthEventMutationVariables>;
export const LogAuthEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogAuthEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"metadata"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"jsonb"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ipAddress"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"inet"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userAgent"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"success"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":true}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"failureReason"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertAuditAuthEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"metadata"},"value":{"kind":"Variable","name":{"kind":"Name","value":"metadata"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"ipAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ipAddress"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userAgent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userAgent"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"Variable","name":{"kind":"Name","value":"success"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"failureReason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"failureReason"}}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}}]}}]}}]}}]} as unknown as DocumentNode<LogAuthEventMutation, LogAuthEventMutationVariables>;
export const LogDataAccessEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogDataAccessEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accessType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ipAddress"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"inet"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"metadata"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"jsonb"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertAuditDataAccessLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"resourceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"accessType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accessType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"ipAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ipAddress"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"metadata"},"value":{"kind":"Variable","name":{"kind":"Name","value":"metadata"}}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}}]}}]}}]}}]} as unknown as DocumentNode<LogDataAccessEventMutation, LogDataAccessEventMutationVariables>;
export const LogPermissionAuditEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogPermissionAuditEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"changedByUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"targetUserId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"changeType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldPermissions"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"jsonb"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPermissions"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"jsonb"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertAuditPermissionChanges"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"changedByUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"changedByUserId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"targetUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"targetUserId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"changeType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"changeType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"oldPermissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldPermissions"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"newPermissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPermissions"}}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}}]}}]}}]}}]} as unknown as DocumentNode<LogPermissionAuditEventMutation, LogPermissionAuditEventMutationVariables>;
export const DeleteOldAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteOldAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"beforeDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAuditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"beforeDate"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affectedRows"}}]}}]}}]} as unknown as DocumentNode<DeleteOldAuditLogsMutation, DeleteOldAuditLogsMutationVariables>;
export const GetAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"50"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLogBoolExp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLogOrderBy"}}}},"defaultValue":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"auditAuditLogAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetAuditLogsQuery, GetAuditLogsQueryVariables>;
export const GetAuthEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuthEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuthEventsBoolExp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuthEventsOrderBy"}}}},"defaultValue":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuthEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthEvent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"auditAuthEventsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuthEvents"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<GetAuthEventsQuery, GetAuthEventsQueryVariables>;
export const GetAuditSummaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditSummary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"totalActions"},"name":{"kind":"Name","value":"auditAuditLogAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"actionsByType"},"name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"distinctOn"},"value":{"kind":"EnumValue","value":"action"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"mostActiveUsers"},"name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"distinctOn"},"value":{"kind":"EnumValue","value":"userId"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"EnumValue","value":"ASC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"authEventsByType"},"name":{"kind":"Name","value":"auditAuthEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"distinctOn"},"value":{"kind":"EnumValue","value":"eventType"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventType"}}]}}]}}]} as unknown as DocumentNode<GetAuditSummaryQuery, GetAuditSummaryQueryVariables>;
export const GetResourceAccessHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetResourceAccessHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"resourceId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetResourceAccessHistoryQuery, GetResourceAccessHistoryQueryVariables>;
export const GetUserActivityTimelineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserActivityTimeline"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"auditAuthEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetUserActivityTimelineQuery, GetUserActivityTimelineQueryVariables>;
export const GetDataAccessReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDataAccessReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditDataAccessLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceType"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DataAccessLog"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataAccessLog"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditDataAccessLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}},{"kind":"Field","name":{"kind":"Name","value":"fieldsAccessed"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<GetDataAccessReportQuery, GetDataAccessReportQueryVariables>;
export const GetComplianceAuditTrailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetComplianceAuditTrail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"permissionChanges"},"name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"permission","block":false},{"kind":"StringValue","value":"role","block":false},{"kind":"StringValue","value":"permission_override","block":false}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"userChanges"},"name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"user","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"create","block":false},{"kind":"StringValue","value":"update","block":false},{"kind":"StringValue","value":"delete","block":false}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"dataExports"},"name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"export","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetComplianceAuditTrailQuery, GetComplianceAuditTrailQueryVariables>;
export const GenerateSoc2AuditReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GenerateSOC2AuditReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"1000"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"authenticationEvents"},"name":{"kind":"Name","value":"auditAuthEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthEvent"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"dataAccessEvents"},"name":{"kind":"Name","value":"auditDataAccessLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DataAccessLog"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"systemChanges"},"name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"system","block":false},{"kind":"StringValue","value":"configuration","block":false},{"kind":"StringValue","value":"database","block":false}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"privilegedAccess"},"name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"userRole"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"admin","block":false},{"kind":"StringValue","value":"super_admin","block":false}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuthEvents"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataAccessLog"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditDataAccessLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}},{"kind":"Field","name":{"kind":"Name","value":"fieldsAccessed"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GenerateSoc2AuditReportQuery, GenerateSoc2AuditReportQueryVariables>;
export const AuditLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuditLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuditLogByPk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<AuditLogQuery, AuditLogQueryVariables>;
export const ComplianceReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ComplianceReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ComplianceReportQuery, ComplianceReportQueryVariables>;
export const ComplianceAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ComplianceAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ComplianceAuditLogsQuery, ComplianceAuditLogsQueryVariables>;
export const SecurityOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SecurityOverview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"totalAuditLogs"},"name":{"kind":"Name","value":"auditAuditLogAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"failedLogins"},"name":{"kind":"Name","value":"auditAuthEventsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<SecurityOverviewQuery, SecurityOverviewQueryVariables>;
export const CleanAllPayrollDatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CleanAllPayrollDates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payrollDates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"payrollId"}},{"kind":"Field","name":{"kind":"Name","value":"originalEftDate"}}]}}]}}]} as unknown as DocumentNode<CleanAllPayrollDatesQuery, CleanAllPayrollDatesQueryVariables>;
export const GetSecurityIncidentAnalysisDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSecurityIncidentAnalysis"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"failedAuthentications"},"name":{"kind":"Name","value":"auditAuthEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthEvent"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"suspiciousActivity"},"name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"bulk_export","block":false},{"kind":"StringValue","value":"mass_delete","block":false},{"kind":"StringValue","value":"privilege_escalation","block":false}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"permissionDenials"},"name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_like"},"value":{"kind":"StringValue","value":"%denied%","block":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuthEvents"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetSecurityIncidentAnalysisQuery, GetSecurityIncidentAnalysisQueryVariables>;
export const GetUserActivityAnalyticsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserActivityAnalytics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"userSessions"},"name":{"kind":"Name","value":"auditAuthEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"login","block":false},{"kind":"StringValue","value":"logout","block":false},{"kind":"StringValue","value":"session_timeout","block":false}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthEvent"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"resourceAccess"},"name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"view","block":false},{"kind":"StringValue","value":"edit","block":false},{"kind":"StringValue","value":"delete","block":false},{"kind":"StringValue","value":"export","block":false}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"permissionUsage"},"name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"client","block":false},{"kind":"StringValue","value":"payroll","block":false},{"kind":"StringValue","value":"user","block":false},{"kind":"StringValue","value":"billing","block":false}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuthEvents"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetUserActivityAnalyticsQuery, GetUserActivityAnalyticsQueryVariables>;
export const GetDataRetentionAnalyticsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDataRetentionAnalytics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"retentionDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"auditLogRetention"},"name":{"kind":"Name","value":"auditAuditLogAggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"min"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"max"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventTime"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"dataAccessRetention"},"name":{"kind":"Name","value":"auditDataAccessLogAggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"min"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"max"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"oldAuditLogs"},"name":{"kind":"Name","value":"auditAuditLogAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"retentionDate"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetDataRetentionAnalyticsQuery, GetDataRetentionAnalyticsQueryVariables>;
export const GetSystemHealthAnalyticsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemHealthAnalytics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"apiUsage"},"name":{"kind":"Name","value":"auditAuditLogAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_like"},"value":{"kind":"StringValue","value":"api_%","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"systemErrors"},"name":{"kind":"Name","value":"auditAuditLogAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"resourceUsageStats"},"name":{"kind":"Name","value":"auditAuditLogAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetSystemHealthAnalyticsQuery, GetSystemHealthAnalyticsQueryVariables>;
export const SearchAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"100"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_and"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userEmail"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actions"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"searchResults"},"name":{"kind":"Name","value":"auditAuditLogAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_and"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userEmail"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actions"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}}}]}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<SearchAuditLogsQuery, SearchAuditLogsQueryVariables>;
export const GetComplianceMonitoringDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetComplianceMonitoringData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"criticalEvents"},"name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"delete","block":false},{"kind":"StringValue","value":"export","block":false},{"kind":"StringValue","value":"privilege_change","block":false},{"kind":"StringValue","value":"system_config","block":false}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"authMetrics"},"name":{"kind":"Name","value":"auditAuthEventsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"failedAccess"},"name":{"kind":"Name","value":"auditAuthEventsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"sensitiveDataAccess"},"name":{"kind":"Name","value":"auditDataAccessLogAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"dataClassification"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"CRITICAL","block":false},{"kind":"StringValue","value":"HIGH","block":false}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetComplianceMonitoringDataQuery, GetComplianceMonitoringDataQueryVariables>;
export const GetSecurityDashboardOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSecurityDashboardOverview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"totalUsers"},"name":{"kind":"Name","value":"usersAggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"activeUsers"},"name":{"kind":"Name","value":"usersAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isActive"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"inactiveUsers"},"name":{"kind":"Name","value":"usersAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isActive"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"totalRoles"},"name":{"kind":"Name","value":"rolesAggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"recentEvents"},"name":{"kind":"Name","value":"auditAuditLogAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"failedLogins"},"name":{"kind":"Name","value":"auditAuthEventsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"login","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"totalLogins"},"name":{"kind":"Name","value":"auditAuthEventsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"login","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetSecurityDashboardOverviewQuery, GetSecurityDashboardOverviewQueryVariables>;
export const GetSecurityDashboardActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSecurityDashboardActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"recentActivity"},"name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"permission_grant","block":false},{"kind":"StringValue","value":"permission_revoke","block":false},{"kind":"StringValue","value":"role_change","block":false},{"kind":"StringValue","value":"user_create","block":false},{"kind":"StringValue","value":"user_update","block":false},{"kind":"StringValue","value":"user_delete","block":false},{"kind":"StringValue","value":"login_failure","block":false},{"kind":"StringValue","value":"privilege_escalation","block":false}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"recentAuthEvents"},"name":{"kind":"Name","value":"auditAuthEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"login","block":false},{"kind":"StringValue","value":"logout","block":false},{"kind":"StringValue","value":"password_change","block":false}]}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthEvent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuthEvents"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<GetSecurityDashboardActivityQuery, GetSecurityDashboardActivityQueryVariables>;
export const GetSecurityUserStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSecurityUserStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"thirtyDaysAgo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"usersByRole"},"name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"staffCount"},"name":{"kind":"Name","value":"usersAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isStaff"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"usersWithManagers"},"name":{"kind":"Name","value":"usersAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"managerId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"recentUsers"},"name":{"kind":"Name","value":"usersAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"thirtyDaysAgo"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetSecurityUserStatsQuery, GetSecurityUserStatsQueryVariables>;
export const GetSecurityAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSecurityAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"50"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"auditAuditLogAggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"auditAuthEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthEvent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuthEvents"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<GetSecurityAuditLogsQuery, GetSecurityAuditLogsQueryVariables>;
export const GetPermissionsDashboardDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionsDashboardData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sevenDaysAgo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"priority"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"isSystemRole"}},{"kind":"Field","name":{"kind":"Name","value":"rolePermissionsAggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"userRolesAggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"computedName"},"value":{"kind":"EnumValue","value":"ASC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isStaff"}},{"kind":"Field","name":{"kind":"Name","value":"roleAssignments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissionOverrides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PermissionOverrideInfo"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"recentPermissionChanges"},"name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"permission","block":false},{"kind":"StringValue","value":"role","block":false},{"kind":"StringValue","value":"user","block":false}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"permission_grant","block":false},{"kind":"StringValue","value":"permission_revoke","block":false},{"kind":"StringValue","value":"role_change","block":false}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sevenDaysAgo"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"computedName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionOverrideInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionOverrides"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"granted"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetPermissionsDashboardDataQuery, GetPermissionsDashboardDataQueryVariables>;
export const GetSoc2ComplianceDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSOC2ComplianceData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"totalAuditLogs"},"name":{"kind":"Name","value":"auditAuditLogAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"failedAccessAttempts"},"name":{"kind":"Name","value":"auditAuditLogAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"authenticationEvents"},"name":{"kind":"Name","value":"auditAuthEventsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"failedAuthentication"},"name":{"kind":"Name","value":"auditAuthEventsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"dataAccessEvents"},"name":{"kind":"Name","value":"auditDataAccessLogAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"sensitiveDataAccess"},"name":{"kind":"Name","value":"auditDataAccessLogAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"dataClassification"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"CRITICAL","block":false},{"kind":"StringValue","value":"HIGH","block":false}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"activeUsers"},"name":{"kind":"Name","value":"usersAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isActive"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"totalUsers"},"name":{"kind":"Name","value":"usersAggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"staffUsers"},"name":{"kind":"Name","value":"usersAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isStaff"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"criticalSecurityEvents"},"name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"delete","block":false},{"kind":"StringValue","value":"export","block":false},{"kind":"StringValue","value":"privilege_escalation","block":false},{"kind":"StringValue","value":"unauthorized_access","block":false}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetSoc2ComplianceDataQuery, GetSoc2ComplianceDataQueryVariables>;
export const AuditLogStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"AuditLogStream"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sinceTimestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actions"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sinceTimestamp"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<AuditLogStreamSubscription, AuditLogStreamSubscriptionVariables>;
export const AuthEventStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"AuthEventStream"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventTypes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sinceTimestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuthEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventTypes"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sinceTimestamp"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthEvent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuthEvents"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<AuthEventStreamSubscription, AuthEventStreamSubscriptionVariables>;
export const SubscribeToAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"SubscribeToAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<SubscribeToAuditLogsSubscription, SubscribeToAuditLogsSubscriptionVariables>;
export const SecurityEventsStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"SecurityEventsStream"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"security","block":false},{"kind":"StringValue","value":"auth","block":false},{"kind":"StringValue","value":"permission","block":false}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<SecurityEventsStreamSubscription, SecurityEventsStreamSubscriptionVariables>;
export const FailedOperationsStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"FailedOperationsStream"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"success"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<FailedOperationsStreamSubscription, FailedOperationsStreamSubscriptionVariables>;
export const CriticalDataAccessStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CriticalDataAccessStream"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"users","block":false},{"kind":"StringValue","value":"clients","block":false},{"kind":"StringValue","value":"payrolls","block":false}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"delete","block":false},{"kind":"StringValue","value":"create","block":false},{"kind":"StringValue","value":"update","block":false}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<CriticalDataAccessStreamSubscription, CriticalDataAccessStreamSubscriptionVariables>;
export const DataAccessStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"DataAccessStream"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sinceTimestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditDataAccessLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sinceTimestamp"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DataAccessLog"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataAccessLog"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditDataAccessLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}},{"kind":"Field","name":{"kind":"Name","value":"fieldsAccessed"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<DataAccessStreamSubscription, DataAccessStreamSubscriptionVariables>;
export const SensitiveAuditStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"SensitiveAuditStream"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sinceTimestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"view","block":false},{"kind":"StringValue","value":"export","block":false},{"kind":"StringValue","value":"update","block":false},{"kind":"StringValue","value":"delete","block":false}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sinceTimestamp"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<SensitiveAuditStreamSubscription, SensitiveAuditStreamSubscriptionVariables>;
export const PermissionAuditStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"PermissionAuditStream"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sinceTimestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditPermissionChanges"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"changedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sinceTimestamp"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"changedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"targetUserId"}},{"kind":"Field","name":{"kind":"Name","value":"changedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"changeType"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"oldPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"newPermissions"}}]}}]}}]} as unknown as DocumentNode<PermissionAuditStreamSubscription, PermissionAuditStreamSubscriptionVariables>;
export const LogAuditEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogAuditEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLogInsertInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertAuditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"input"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}}]}}]}}]}}]} as unknown as DocumentNode<LogAuditEventMutation, LogAuditEventMutationVariables>;
export const InsertFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InsertFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FilesInsertInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertFiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"input"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"objectKey"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"clientId"}},{"kind":"Field","name":{"kind":"Name","value":"payrollId"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedBy"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<InsertFileMutation, InsertFileMutationVariables>;
export const UpdateFileMetadataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFileMetadata"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updates"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FilesSetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFilesByPk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pkColumns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updates"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"objectKey"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"clientId"}},{"kind":"Field","name":{"kind":"Name","value":"payrollId"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedBy"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<UpdateFileMetadataMutation, UpdateFileMetadataMutationVariables>;
export const DeleteFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFilesByPk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"objectKey"}}]}}]}}]} as unknown as DocumentNode<DeleteFileMutation, DeleteFileMutationVariables>;
export const RefreshDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]} as unknown as DocumentNode<RefreshDataMutation, RefreshDataMutationVariables>;
export const GetDashboardMetricsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDashboardMetrics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"active"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"activePayrollsAggregate"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"Completed","block":false},{"kind":"StringValue","value":"Failed","block":false}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"totalEmployeesAggregate"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sum"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"upcomingPayrolls"},"name":{"kind":"Name","value":"payrolls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"Completed","block":false},{"kind":"StringValue","value":"Failed","block":false},{"kind":"StringValue","value":"Cancelled","block":false}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientMinimal"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<GetDashboardMetricsQuery, GetDashboardMetricsQueryVariables>;
export const GetDashboardStatsOptimizedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDashboardStatsOptimized"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientsAggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"totalPayrolls"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"activePayrolls"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"Active","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"upcomingPayrolls"},"name":{"kind":"Name","value":"payrolls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"Active","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"payrollDates"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"adjustedEftDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"StringValue","value":"now()","block":false}}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"nextEftDate"},"name":{"kind":"Name","value":"payrollDates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"adjustedEftDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"StringValue","value":"now()","block":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"adjustedEftDate"},"value":{"kind":"EnumValue","value":"ASC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"originalEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"adjustedEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"processingDate"}}]}}]}}]}}]} as unknown as DocumentNode<GetDashboardStatsOptimizedQuery, GetDashboardStatsOptimizedQueryVariables>;
export const GetClientsDashboardStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetClientsDashboardStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"activeClientsCount"},"name":{"kind":"Name","value":"clientsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"active"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"totalPayrollsCount"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"totalEmployeesSum"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sum"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"clientsNeedingAttention"},"name":{"kind":"Name","value":"clients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"active"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_not"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"payrolls"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<GetClientsDashboardStatsQuery, GetClientsDashboardStatsQueryVariables>;
export const GetCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"usersByPk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserProfile"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"computedName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCoreShared"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCoreShared"}},{"kind":"Field","name":{"kind":"Name","value":"clerkUserId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserWithRole"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBasic"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"isStaff"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserProfile"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserWithRole"}},{"kind":"Field","name":{"kind":"Name","value":"clerkUserId"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"managerId"}},{"kind":"Field","name":{"kind":"Name","value":"deactivatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deactivatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"manager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}}]}}]} as unknown as DocumentNode<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetUsersForDropdownDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsersForDropdown"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"user_role"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isActive"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"role"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"computedName"},"value":{"kind":"EnumValue","value":"ASC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"computedName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<GetUsersForDropdownQuery, GetUsersForDropdownQueryVariables>;
export const GetSystemHealthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemHealth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"databaseHealth"},"name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"recentActivity"},"name":{"kind":"Name","value":"auditAuditLogAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"StringValue","value":"now() - interval '1 hour'","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetSystemHealthQuery, GetSystemHealthQueryVariables>;
export const GlobalSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GlobalSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"contactEmail"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientMinimal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"computedName"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"firstName"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"lastName"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payrolls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"client"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientMinimal"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"computedName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<GlobalSearchQuery, GlobalSearchQueryVariables>;
export const GetFileByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFileById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filesByPk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"objectKey"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"clientId"}},{"kind":"Field","name":{"kind":"Name","value":"payrollId"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedBy"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payroll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uploadedBy"}}]}}]}}]} as unknown as DocumentNode<GetFileByIdQuery, GetFileByIdQueryVariables>;
export const ListFilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListFiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilesBoolExp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FilesOrderBy"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"files"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"objectKey"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"clientId"}},{"kind":"Field","name":{"kind":"Name","value":"payrollId"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedBy"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payroll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uploadedBy"}}]}},{"kind":"Field","name":{"kind":"Name","value":"filesAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<ListFilesQuery, ListFilesQueryVariables>;
export const RecentActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"RecentActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"StringValue","value":"now() - interval '5 minutes'","block":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuditLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<RecentActivitySubscription, RecentActivitySubscriptionVariables>;
export const AuthenticationEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"AuthenticationEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditAuthEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"StringValue","value":"now() - interval '10 minutes'","block":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthEvent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditAuthEvents"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<AuthenticationEventsSubscription, AuthenticationEventsSubscriptionVariables>;
export const SensitiveDataAccessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"SensitiveDataAccess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditDataAccessLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"StringValue","value":"now() - interval '10 minutes'","block":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DataAccessLog"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataAccessLog"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditDataAccessLog"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}},{"kind":"Field","name":{"kind":"Name","value":"fieldsAccessed"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<SensitiveDataAccessSubscription, SensitiveDataAccessSubscriptionVariables>;
export const PermissionChangeStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"PermissionChangeStream"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditPermissionChanges"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"changedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PermissionChange"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionChange"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuditPermissionChanges"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"changeType"}},{"kind":"Field","name":{"kind":"Name","value":"permissionType"}},{"kind":"Field","name":{"kind":"Name","value":"oldPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"newPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}}]}}]} as unknown as DocumentNode<PermissionChangeStreamSubscription, PermissionChangeStreamSubscriptionVariables>;