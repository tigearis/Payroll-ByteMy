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
 * Generated: 2025-06-27T10:31:58.471Z
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
  json: { input: any; output: any; }
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
  user_role: { input: any; output: any; }
  uuid: { input: string; output: string; }
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
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "billing_invoice_item". All fields are combined with a logical 'AND'. */
export type BillingInvoiceItemBoolExp = {
  _and?: InputMaybe<Array<BillingInvoiceItemBoolExp>>;
  _not?: InputMaybe<BillingInvoiceItemBoolExp>;
  _or?: InputMaybe<Array<BillingInvoiceItemBoolExp>>;
  amount?: InputMaybe<NumericComparisonExp>;
  billingInvoice?: InputMaybe<BillingInvoiceBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  invoiceId?: InputMaybe<UuidComparisonExp>;
  quantity?: InputMaybe<IntComparisonExp>;
  unitPrice?: InputMaybe<NumericComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "billing_invoice_item" */
export type BillingInvoiceItemConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'billing_invoice_item_pkey'
  | '%future added value';

/** input type for incrementing numeric columns in table "billing_invoice_item" */
export type BillingInvoiceItemIncInput = {
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_invoice_item" */
export type BillingInvoiceItemInsertInput = {
  billingInvoice?: InputMaybe<BillingInvoiceObjRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by max() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemMaxOrderBy = {
  amount?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemMinOrderBy = {
  amount?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
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
  amount?: InputMaybe<OrderBy>;
  billingInvoice?: InputMaybe<BillingInvoiceOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_invoice_item */
export type BillingInvoiceItemPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_invoice_item" */
export type BillingInvoiceItemSelectColumn =
  /** column name */
  | 'amount'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'invoiceId'
  /** column name */
  | 'quantity'
  /** column name */
  | 'unitPrice'
  /** column name */
  | 'updatedAt'
  | '%future added value';

/** input type for updating data in table "billing_invoice_item" */
export type BillingInvoiceItemSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by stddev() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemStddevOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemStddevPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** order by stddevSamp() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemStddevSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
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
  amount?: InputMaybe<Scalars['numeric']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** order by sum() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemSumOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** update columns of table "billing_invoice_item" */
export type BillingInvoiceItemUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'invoiceId'
  /** column name */
  | 'quantity'
  /** column name */
  | 'unitPrice'
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
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemVarSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemVarianceOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
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

export type ComplianceReportInput = {
  endDate: Scalars['String']['input'];
  includeDetails?: InputMaybe<Scalars['Boolean']['input']>;
  reportType: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

/** ordering argument of a cursor */
export type CursorOrdering =
  /** ascending ordering of the cursor */
  | 'ASC'
  /** descending ordering of the cursor */
  | 'DESC'
  | '%future added value';

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

export type AdjustmentRulesAggregateBoolExp = {
  count?: InputMaybe<AdjustmentRulesAggregateBoolExpCount>;
};

export type AdjustmentRulesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<AdjustmentRulesBoolExp>;
  predicate: IntComparisonExp;
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
export type AdjustmentRulesConstraint =
  /** unique or primary key constraint on columns "date_type_id", "cycle_id" */
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
  relatedPayrollCycle?: InputMaybe<PayrollCyclesObjRelInsertInput>;
  relatedPayrollDateType?: InputMaybe<PayrollDateTypesObjRelInsertInput>;
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
export type AuditLogsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'audit_log_pkey'
  | '%future added value';

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
export type AuditLogsSelectColumn =
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
export type AuditLogsUpdateColumn =
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
export type AuthEventsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'auth_events_pkey'
  | '%future added value';

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
export type AuthEventsSelectColumn =
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
export type AuthEventsUpdateColumn =
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
export type AuthUsersSyncConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'users_sync_pkey'
  | '%future added value';

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
export type AuthUsersSyncSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'deletedAt'
  /** column name */
  | 'email'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'rawJson'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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
export type AuthUsersSyncUpdateColumn =
  /** column name */
  | 'deletedAt'
  /** column name */
  | 'rawJson'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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

export type BillingEventLogsAggregateBoolExp = {
  count?: InputMaybe<BillingEventLogsAggregateBoolExpCount>;
};

export type BillingEventLogsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingEventLogsBoolExp>;
  predicate: IntComparisonExp;
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
export type BillingEventLogsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'billing_event_log_pkey'
  | '%future added value';

/** input type for inserting data into table "billing_event_log" */
export type BillingEventLogsInsertInput = {
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
export type BillingEventLogsMaxOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  eventType?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
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

/** on_conflict condition type for table "billing_event_log" */
export type BillingEventLogsOnConflict = {
  constraint: BillingEventLogsConstraint;
  updateColumns?: Array<BillingEventLogsUpdateColumn>;
  where?: InputMaybe<BillingEventLogsBoolExp>;
};

/** Ordering options when selecting data from "billing_event_log". */
export type BillingEventLogsOrderBy = {
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
export type BillingEventLogsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_event_log" */
export type BillingEventLogsSelectColumn =
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
export type BillingEventLogsUpdateColumn =
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

export type BillingEventLogsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingEventLogsSetInput>;
  /** filter the rows which have to be updated */
  where: BillingEventLogsBoolExp;
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
  totalAmount?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "billing_invoice". All fields are combined with a logical 'AND'. */
export type BillingInvoiceBoolExp = {
  _and?: InputMaybe<Array<BillingInvoiceBoolExp>>;
  _not?: InputMaybe<BillingInvoiceBoolExp>;
  _or?: InputMaybe<Array<BillingInvoiceBoolExp>>;
  billingEventLogs?: InputMaybe<BillingEventLogsBoolExp>;
  billingEventLogsAggregate?: InputMaybe<BillingEventLogsAggregateBoolExp>;
  billingInvoiceItems?: InputMaybe<BillingInvoiceItemBoolExp>;
  billingInvoiceItemsAggregate?: InputMaybe<BillingInvoiceItemAggregateBoolExp>;
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
export type BillingInvoiceConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'billing_invoice_pkey'
  | '%future added value';

/** input type for incrementing numeric columns in table "billing_invoice" */
export type BillingInvoiceIncInput = {
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_invoice" */
export type BillingInvoiceInsertInput = {
  billingEventLogs?: InputMaybe<BillingEventLogsArrRelInsertInput>;
  billingInvoiceItems?: InputMaybe<BillingInvoiceItemArrRelInsertInput>;
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

export type BillingInvoiceItemAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingInvoiceItemBoolExp>;
  predicate: IntComparisonExp;
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
  billingEventLogsAggregate?: InputMaybe<BillingEventLogsAggregateOrderBy>;
  billingInvoiceItemsAggregate?: InputMaybe<BillingInvoiceItemAggregateOrderBy>;
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
export type BillingInvoiceSelectColumn =
  /** column name */
  | 'billingPeriodEnd'
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
  | 'issuedDate'
  /** column name */
  | 'notes'
  /** column name */
  | 'status'
  /** column name */
  | 'totalAmount'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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

/** order by stddev() on columns of table "billing_invoice" */
export type BillingInvoiceStddevOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "billing_invoice" */
export type BillingInvoiceStddevPopOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
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

/** order by sum() on columns of table "billing_invoice" */
export type BillingInvoiceSumOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** update columns of table "billing_invoice" */
export type BillingInvoiceUpdateColumn =
  /** column name */
  | 'billingPeriodEnd'
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
  | 'issuedDate'
  /** column name */
  | 'notes'
  /** column name */
  | 'status'
  /** column name */
  | 'totalAmount'
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
  totalAmount?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "billing_invoice" */
export type BillingInvoiceVarSampOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "billing_invoice" */
export type BillingInvoiceVarianceOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
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
export type BillingItemsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'billing_items_pkey'
  | '%future added value';

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
export type BillingItemsSelectColumn =
  /** column name */
  | 'amount'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'invoiceId'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'quantity'
  /** column name */
  | 'unitPrice'
  | '%future added value';

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

/** order by stddev() on columns of table "billing_items" */
export type BillingItemsStddevOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "billing_items" */
export type BillingItemsStddevPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
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

/** order by sum() on columns of table "billing_items" */
export type BillingItemsSumOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** update columns of table "billing_items" */
export type BillingItemsUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'invoiceId'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'quantity'
  /** column name */
  | 'unitPrice'
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
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "billing_items" */
export type BillingItemsVarSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "billing_items" */
export type BillingItemsVarianceOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
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
export type BillingPlansConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'billing_plan_pkey'
  | '%future added value';

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
export type BillingPlansSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'currency'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'ratePerPayroll'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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

/** update columns of table "billing_plan" */
export type BillingPlansUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'currency'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'ratePerPayroll'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type BillingPlansUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BillingPlansIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BillingPlansSetInput>;
  /** filter the rows which have to be updated */
  where: BillingPlansBoolExp;
};

export type ClientBillingAssignmentsAggregateBoolExp = {
  bool_and?: InputMaybe<ClientBillingAssignmentsAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<ClientBillingAssignmentsAggregateBoolExpBool_Or>;
  count?: InputMaybe<ClientBillingAssignmentsAggregateBoolExpCount>;
};

export type ClientBillingAssignmentsAggregateBoolExpBool_And = {
  arguments: ClientBillingAssignmentsSelectColumnClientBillingAssignmentsAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientBillingAssignmentsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ClientBillingAssignmentsAggregateBoolExpBool_Or = {
  arguments: ClientBillingAssignmentsSelectColumnClientBillingAssignmentsAggregateBoolExpBool_OrArgumentsColumns;
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
export type ClientBillingAssignmentsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'client_billing_assignment_pkey'
  | '%future added value';

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
export type ClientBillingAssignmentsSelectColumn =
  /** column name */
  | 'billingPlanId'
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'endDate'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'startDate'
  /** column name */
  | 'updatedAt'
  | '%future added value';

/** select "clientBillingAssignmentsAggregateBoolExpBool_andArgumentsColumns" columns of table "client_billing_assignment" */
export type ClientBillingAssignmentsSelectColumnClientBillingAssignmentsAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'isActive'
  | '%future added value';

/** select "clientBillingAssignmentsAggregateBoolExpBool_orArgumentsColumns" columns of table "client_billing_assignment" */
export type ClientBillingAssignmentsSelectColumnClientBillingAssignmentsAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'isActive'
  | '%future added value';

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
export type ClientBillingAssignmentsUpdateColumn =
  /** column name */
  | 'billingPlanId'
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'endDate'
  /** column name */
  | 'id'
  /** column name */
  | 'isActive'
  /** column name */
  | 'startDate'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type ClientBillingAssignmentsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ClientBillingAssignmentsSetInput>;
  /** filter the rows which have to be updated */
  where: ClientBillingAssignmentsBoolExp;
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
export type ClientExternalSystemsConstraint =
  /** unique or primary key constraint on columns "client_id", "system_id" */
  | 'client_external_systems_client_id_system_id_key'
  /** unique or primary key constraint on columns "id" */
  | 'client_external_systems_pkey'
  | '%future added value';

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
export type ClientExternalSystemsSelectColumn =
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'externalSystemId'
  /** column name */
  | 'id'
  /** column name */
  | 'systemClientId'
  /** column name */
  | 'updatedAt'
  | '%future added value';

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
export type ClientExternalSystemsUpdateColumn =
  /** column name */
  | 'clientId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'externalSystemId'
  /** column name */
  | 'id'
  /** column name */
  | 'systemClientId'
  /** column name */
  | 'updatedAt'
  | '%future added value';

export type ClientExternalSystemsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ClientExternalSystemsSetInput>;
  /** filter the rows which have to be updated */
  where: ClientExternalSystemsBoolExp;
};

export type ClientsAggregateBoolExp = {
  bool_and?: InputMaybe<ClientsAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<ClientsAggregateBoolExpBool_Or>;
  count?: InputMaybe<ClientsAggregateBoolExpCount>;
};

export type ClientsAggregateBoolExpBool_And = {
  arguments: ClientsSelectColumnClientsAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ClientsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ClientsAggregateBoolExpBool_Or = {
  arguments: ClientsSelectColumnClientsAggregateBoolExpBool_OrArgumentsColumns;
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
export type ClientsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'clients_pkey'
  | '%future added value';

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

/** select "clientsAggregateBoolExpBool_andArgumentsColumns" columns of table "clients" */
export type ClientsSelectColumnClientsAggregateBoolExpBool_AndArgumentsColumns =
  /** column name */
  | 'active'
  | '%future added value';

/** select "clientsAggregateBoolExpBool_orArgumentsColumns" columns of table "clients" */
export type ClientsSelectColumnClientsAggregateBoolExpBool_OrArgumentsColumns =
  /** column name */
  | 'active'
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

/** append existing jsonb value of filtered columns with new jsonb value */
export type DataAccessLogsAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
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
export type DataAccessLogsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'data_access_log_pkey'
  | '%future added value';

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
export type DataAccessLogsSelectColumn =
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

/** update columns of table "audit.data_access_log" */
export type DataAccessLogsUpdateColumn =
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

export type LeaveAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<LeaveSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<LeaveBoolExp>;
  predicate: IntComparisonExp;
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
export type LeaveConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'leave_pkey'
  | '%future added value';

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
export type LeaveSelectColumn =
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
  | 'userId'
  | '%future added value';

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
export type LeaveUpdateColumn =
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
  | 'userId'
  | '%future added value';

export type LeaveUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<LeaveSetInput>;
  /** filter the rows which have to be updated */
  where: LeaveBoolExp;
};

export type NotesAggregateBoolExp = {
  bool_and?: InputMaybe<NotesAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<NotesAggregateBoolExpBool_Or>;
  count?: InputMaybe<NotesAggregateBoolExpCount>;
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
export type NotesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'notes_pkey'
  | '%future added value';

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

export type PayrollAssignmentAuditsAggregateBoolExp = {
  count?: InputMaybe<PayrollAssignmentAuditsAggregateBoolExpCount>;
};

export type PayrollAssignmentAuditsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
  predicate: IntComparisonExp;
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
export type PayrollAssignmentAuditsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'payroll_assignment_audit_pkey'
  | '%future added value';

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
export type PayrollAssignmentAuditsSelectColumn =
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
export type PayrollAssignmentAuditsUpdateColumn =
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

export type PayrollAssignmentAuditsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PayrollAssignmentAuditsSetInput>;
  /** filter the rows which have to be updated */
  where: PayrollAssignmentAuditsBoolExp;
};

export type PayrollAssignmentsAggregateBoolExp = {
  bool_and?: InputMaybe<PayrollAssignmentsAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<PayrollAssignmentsAggregateBoolExpBool_Or>;
  count?: InputMaybe<PayrollAssignmentsAggregateBoolExpCount>;
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

export type PayrollDatesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollDatesBoolExp>;
  predicate: IntComparisonExp;
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
export type PayrollDatesConstraint =
  /** unique or primary key constraint on columns "original_eft_date", "payroll_id" */
  | 'idx_unique_payroll_date'
  /** unique or primary key constraint on columns "id" */
  | 'payroll_dates_pkey'
  | '%future added value';

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

export type PayrollsAggregateBoolExp = {
  count?: InputMaybe<PayrollsAggregateBoolExpCount>;
};

export type PayrollsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PayrollsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PayrollsBoolExp>;
  predicate: IntComparisonExp;
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
export type PayrollsConstraint =
  /** unique or primary key constraint on columns  */
  | 'only_one_current_version_per_family'
  /** unique or primary key constraint on columns "id" */
  | 'payrolls_pkey'
  | '%future added value';

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
export type PayrollsSelectColumn =
  /** column name */
  | 'backupConsultantUserId'
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
  | 'payrollSystem'
  /** column name */
  | 'primaryConsultantUserId'
  /** column name */
  | 'processingDaysBeforeEft'
  /** column name */
  | 'processingTime'
  /** column name */
  | 'status'
  /** column name */
  | 'supersededDate'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'versionNumber'
  /** column name */
  | 'versionReason'
  | '%future added value';

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
export type PayrollsUpdateColumn =
  /** column name */
  | 'backupConsultantUserId'
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
  | 'payrollSystem'
  /** column name */
  | 'primaryConsultantUserId'
  /** column name */
  | 'processingDaysBeforeEft'
  /** column name */
  | 'processingTime'
  /** column name */
  | 'status'
  /** column name */
  | 'supersededDate'
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

export type PermissionAuditLogsAggregateBoolExp = {
  count?: InputMaybe<PermissionAuditLogsAggregateBoolExpCount>;
};

export type PermissionAuditLogsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PermissionAuditLogsBoolExp>;
  predicate: IntComparisonExp;
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
export type PermissionAuditLogsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'permission_audit_log_pkey'
  | '%future added value';

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
export type PermissionAuditLogsSelectColumn =
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
export type PermissionAuditLogsUpdateColumn =
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
export type PermissionChangesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'permission_changes_pkey'
  | '%future added value';

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
export type PermissionChangesSelectColumn =
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
export type PermissionChangesUpdateColumn =
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

export type PermissionOverridesAggregateBoolExp = {
  bool_and?: InputMaybe<PermissionOverridesAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<PermissionOverridesAggregateBoolExpBool_Or>;
  count?: InputMaybe<PermissionOverridesAggregateBoolExpCount>;
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
  targetUser?: InputMaybe<UsersObjRelInsertInput>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
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
export type PermissionUsageReportsSelectColumn =
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

export type PermissionsAggregateBoolExp = {
  count?: InputMaybe<PermissionsAggregateBoolExpCount>;
};

export type PermissionsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<PermissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<PermissionsBoolExp>;
  predicate: IntComparisonExp;
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
export type PermissionsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'permissions_pkey'
  /** unique or primary key constraint on columns "action", "resource_id" */
  | 'permissions_resource_id_action_key'
  | '%future added value';

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
export type ResourcesConstraint =
  /** unique or primary key constraint on columns "name" */
  | 'resources_name_key'
  /** unique or primary key constraint on columns "id" */
  | 'resources_pkey'
  | '%future added value';

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

export type RolePermissionsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<RolePermissionsBoolExp>;
  predicate: IntComparisonExp;
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
export type RolePermissionsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'role_permissions_pkey'
  /** unique or primary key constraint on columns "permission_id", "role_id" */
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
  grantedPermission?: InputMaybe<PermissionsObjRelInsertInput>;
  grantedToRole?: InputMaybe<RolesObjRelInsertInput>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  permissionId?: InputMaybe<Scalars['uuid']['input']>;
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
export type SlowQueriesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'slow_queries_pkey'
  | '%future added value';

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
export type SlowQueriesSelectColumn =
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
export type SlowQueriesUpdateColumn =
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

export type SlowQueriesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<SlowQueriesSetInput>;
  /** filter the rows which have to be updated */
  where: SlowQueriesBoolExp;
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
export type UserAccessSummariesSelectColumn =
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

export type UserInvitationsAggregateBoolExp = {
  count?: InputMaybe<UserInvitationsAggregateBoolExpCount>;
};

export type UserInvitationsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UserInvitationsBoolExp>;
  predicate: IntComparisonExp;
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
  invitedAt?: InputMaybe<OrderBy>;
  invitedBy?: InputMaybe<OrderBy>;
  invitedRole?: InputMaybe<OrderBy>;
  lastName?: InputMaybe<OrderBy>;
  managerId?: InputMaybe<OrderBy>;
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
  invitedAt?: InputMaybe<OrderBy>;
  invitedBy?: InputMaybe<OrderBy>;
  invitedRole?: InputMaybe<OrderBy>;
  lastName?: InputMaybe<OrderBy>;
  managerId?: InputMaybe<OrderBy>;
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

export type UserRolesAggregateBoolExp = {
  count?: InputMaybe<UserRolesAggregateBoolExpCount>;
};

export type UserRolesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<UserRolesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UserRolesBoolExp>;
  predicate: IntComparisonExp;
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
export type UserRolesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'user_roles_pkey'
  /** unique or primary key constraint on columns "user_id", "role_id" */
  | 'user_roles_user_id_role_id_key'
  | '%future added value';

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

export type UsersAggregateBoolExp = {
  bool_and?: InputMaybe<UsersAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<UsersAggregateBoolExpBool_Or>;
  count?: InputMaybe<UsersAggregateBoolExpCount>;
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
  userInvitationsAcceptedBy?: InputMaybe<UserInvitationsBoolExp>;
  userInvitationsAcceptedByAggregate?: InputMaybe<UserInvitationsAggregateBoolExp>;
  userInvitationsInvitedBy?: InputMaybe<UserInvitationsBoolExp>;
  userInvitationsInvitedByAggregate?: InputMaybe<UserInvitationsAggregateBoolExp>;
  userInvitationsMangerId?: InputMaybe<UserInvitationsBoolExp>;
  userInvitationsMangerIdAggregate?: InputMaybe<UserInvitationsAggregateBoolExp>;
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
  userInvitationsAcceptedBy?: InputMaybe<UserInvitationsArrRelInsertInput>;
  userInvitationsInvitedBy?: InputMaybe<UserInvitationsArrRelInsertInput>;
  userInvitationsMangerId?: InputMaybe<UserInvitationsArrRelInsertInput>;
  userLeaveRecords?: InputMaybe<LeaveArrRelInsertInput>;
  userPermissionAudits?: InputMaybe<PermissionAuditLogsArrRelInsertInput>;
  userPermissionOverrides?: InputMaybe<PermissionOverridesArrRelInsertInput>;
  userWorkSchedules?: InputMaybe<WorkSchedulesArrRelInsertInput>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars['String']['input']>;
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
  userInvitationsAcceptedByAggregate?: InputMaybe<UserInvitationsAggregateOrderBy>;
  userInvitationsInvitedByAggregate?: InputMaybe<UserInvitationsAggregateOrderBy>;
  userInvitationsMangerIdAggregate?: InputMaybe<UserInvitationsAggregateOrderBy>;
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
export type UsersSelectColumn =
  /** column name */
  | 'clerkUserId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'deactivatedAt'
  /** column name */
  | 'deactivatedBy'
  /** column name */
  | 'email'
  /** column name */
  | 'id'
  /** column name */
  | 'image'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isStaff'
  /** column name */
  | 'managerId'
  /** column name */
  | 'name'
  /** column name */
  | 'role'
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
export type UsersUpdateColumn =
  /** column name */
  | 'clerkUserId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'deactivatedAt'
  /** column name */
  | 'deactivatedBy'
  /** column name */
  | 'email'
  /** column name */
  | 'id'
  /** column name */
  | 'image'
  /** column name */
  | 'isActive'
  /** column name */
  | 'isStaff'
  /** column name */
  | 'managerId'
  /** column name */
  | 'name'
  /** column name */
  | 'role'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'username'
  | '%future added value';

export type UsersUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UsersSetInput>;
  /** filter the rows which have to be updated */
  where: UsersBoolExp;
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
export type WorkSchedulesConstraint =
  /** unique or primary key constraint on columns "user_id", "work_day" */
  | 'unique_user_work_day'
  /** unique or primary key constraint on columns "id" */
  | 'work_schedule_pkey'
  | '%future added value';

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
export type WorkSchedulesSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId'
  /** column name */
  | 'workDay'
  /** column name */
  | 'workHours'
  | '%future added value';

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

/** order by stddev() on columns of table "work_schedule" */
export type WorkSchedulesStddevOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** order by stddevPop() on columns of table "work_schedule" */
export type WorkSchedulesStddevPopOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
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

/** order by sum() on columns of table "work_schedule" */
export type WorkSchedulesSumOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** update columns of table "work_schedule" */
export type WorkSchedulesUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId'
  /** column name */
  | 'workDay'
  /** column name */
  | 'workHours'
  | '%future added value';

export type WorkSchedulesUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<WorkSchedulesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<WorkSchedulesSetInput>;
  /** filter the rows which have to be updated */
  where: WorkSchedulesBoolExp;
};

/** order by varPop() on columns of table "work_schedule" */
export type WorkSchedulesVarPopOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** order by varSamp() on columns of table "work_schedule" */
export type WorkSchedulesVarSampOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "work_schedule" */
export type WorkSchedulesVarianceOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

export type NoteCoreFragment = { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string };

export type NoteBasicFragment = { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null };

export type NoteDetailedFragment = { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null };

export type NoteWithEntityFragment = { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null };

export type NoteSummaryFragment = { __typename?: 'notes', id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null };

export type NoteListItemFragment = { __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null };

export type NoteTableRowFragment = { __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null };

export type NoteMinimalFragment = { __typename?: 'notes', id: string, isImportant?: boolean | null, createdAt?: any | null, userId?: string | null };

export type NoteForAuditFragment = { __typename?: 'notes', id: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string };

export type NoteCardFragment = { __typename?: 'notes', content: string, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, image?: string | null } | null };

export type NoteDashboardFragment = { __typename?: 'notes', id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string } | null };

export type PayrollNoteFragment = { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null };

export type ClientNoteFragment = { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null };

export type UserNoteFragment = { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null };

export type ImportantNoteFragment = { __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null };

export type RecentNoteFragment = { __typename?: 'notes', content: string, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, image?: string | null } | null };

export type CreateNoteMutationVariables = Exact<{
  object: NotesInsertInput;
}>;


export type CreateNoteMutation = { __typename?: 'mutation_root', insertNote?: { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null } | null };

export type AddNoteMutationVariables = Exact<{
  content: Scalars['String']['input'];
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
  userId: Scalars['uuid']['input'];
  isImportant?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AddNoteMutation = { __typename?: 'mutation_root', insertNote?: { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null } | null };

export type UpdateNoteMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  set: NotesSetInput;
}>;


export type UpdateNoteMutation = { __typename?: 'mutation_root', updateNoteById?: { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null } | null };

export type UpdateNoteContentMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  isImportant?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateNoteContentMutation = { __typename?: 'mutation_root', updateNoteById?: { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null } | null };

export type DeleteNoteMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type DeleteNoteMutation = { __typename?: 'mutation_root', deleteNoteById?: { __typename?: 'notes', id: string, content: string, entityType: string, entityId: string } | null };

export type ToggleNoteImportanceMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  isImportant: Scalars['Boolean']['input'];
}>;


export type ToggleNoteImportanceMutation = { __typename?: 'mutation_root', updateNoteById?: { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null } | null };

export type MarkNoteAsImportantMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type MarkNoteAsImportantMutation = { __typename?: 'mutation_root', updateNoteById?: { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null } | null };

export type UnmarkNoteAsImportantMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type UnmarkNoteAsImportantMutation = { __typename?: 'mutation_root', updateNoteById?: { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null } | null };

export type AddPayrollNoteMutationVariables = Exact<{
  payrollId: Scalars['uuid']['input'];
  content: Scalars['String']['input'];
  userId: Scalars['uuid']['input'];
  isImportant?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AddPayrollNoteMutation = { __typename?: 'mutation_root', insertNote?: { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null } | null };

export type AddClientNoteMutationVariables = Exact<{
  clientId: Scalars['uuid']['input'];
  content: Scalars['String']['input'];
  userId: Scalars['uuid']['input'];
  isImportant?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AddClientNoteMutation = { __typename?: 'mutation_root', insertNote?: { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null } | null };

export type AddUserNoteMutationVariables = Exact<{
  userId: Scalars['uuid']['input'];
  content: Scalars['String']['input'];
  authorUserId: Scalars['uuid']['input'];
  isImportant?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AddUserNoteMutation = { __typename?: 'mutation_root', insertNote?: { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null } | null };

export type BulkDeleteNotesMutationVariables = Exact<{
  ids: Array<Scalars['uuid']['input']> | Scalars['uuid']['input'];
}>;


export type BulkDeleteNotesMutation = { __typename?: 'mutation_root', bulkDeleteNotes?: { __typename?: 'notesMutationResponse', affectedRows: number, returning: Array<{ __typename?: 'notes', id: string, content: string, entityType: string, entityId: string }> } | null };

export type BulkMarkNotesImportantMutationVariables = Exact<{
  ids: Array<Scalars['uuid']['input']> | Scalars['uuid']['input'];
}>;


export type BulkMarkNotesImportantMutation = { __typename?: 'mutation_root', bulkUpdateNotes?: { __typename?: 'notesMutationResponse', affectedRows: number, returning: Array<{ __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null }> } | null };

export type BulkUnmarkNotesImportantMutationVariables = Exact<{
  ids: Array<Scalars['uuid']['input']> | Scalars['uuid']['input'];
}>;


export type BulkUnmarkNotesImportantMutation = { __typename?: 'mutation_root', bulkUpdateNotes?: { __typename?: 'notesMutationResponse', affectedRows: number, returning: Array<{ __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null }> } | null };

export type BulkUpdateNotesMutationVariables = Exact<{
  where: NotesBoolExp;
  set: NotesSetInput;
}>;


export type BulkUpdateNotesMutation = { __typename?: 'mutation_root', bulkUpdateNotes?: { __typename?: 'notesMutationResponse', affectedRows: number, returning: Array<{ __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null }> } | null };

export type DeleteNotesByEntityMutationVariables = Exact<{
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
}>;


export type DeleteNotesByEntityMutation = { __typename?: 'mutation_root', bulkDeleteNotes?: { __typename?: 'notesMutationResponse', affectedRows: number, returning: Array<{ __typename?: 'notes', id: string, content: string }> } | null };

export type DeleteNotesByAuthorMutationVariables = Exact<{
  authorUserId: Scalars['uuid']['input'];
}>;


export type DeleteNotesByAuthorMutation = { __typename?: 'mutation_root', bulkDeleteNotes?: { __typename?: 'notesMutationResponse', affectedRows: number, returning: Array<{ __typename?: 'notes', id: string, content: string, entityType: string, entityId: string }> } | null };

export type TransferNotesToNewAuthorMutationVariables = Exact<{
  oldAuthorUserId: Scalars['uuid']['input'];
  newAuthorUserId: Scalars['uuid']['input'];
}>;


export type TransferNotesToNewAuthorMutation = { __typename?: 'mutation_root', bulkUpdateNotes?: { __typename?: 'notesMutationResponse', affectedRows: number, returning: Array<{ __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null }> } | null };

export type TransferNotesToNewEntityMutationVariables = Exact<{
  oldEntityType: Scalars['String']['input'];
  oldEntityId: Scalars['uuid']['input'];
  newEntityType: Scalars['String']['input'];
  newEntityId: Scalars['uuid']['input'];
}>;


export type TransferNotesToNewEntityMutation = { __typename?: 'mutation_root', bulkUpdateNotes?: { __typename?: 'notesMutationResponse', affectedRows: number, returning: Array<{ __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null }> } | null };

export type AddNoteExtractedMutationVariables = Exact<{
  content: Scalars['String']['input'];
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
  userId: Scalars['uuid']['input'];
  isImportant?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AddNoteExtractedMutation = { __typename?: 'mutation_root', insertNote?: { __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null } | null };

export type UpdateNoteExtractedMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  isImportant?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateNoteExtractedMutation = { __typename?: 'mutation_root', updateNoteById?: { __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null } | null };

export type GetNotesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<NotesBoolExp>;
}>;


export type GetNotesQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }>, notesAggregate: { __typename?: 'notesAggregate', aggregate?: { __typename?: 'notesAggregateFields', count: number } | null } };

export type GetNoteByIdQueryVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type GetNoteByIdQuery = { __typename?: 'query_root', noteById?: { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null } | null };

export type GetNoteBasicQueryVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type GetNoteBasicQuery = { __typename?: 'query_root', noteById?: { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null } | null };

export type GetNotesByEntityQueryVariables = Exact<{
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
}>;


export type GetNotesByEntityQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type GetPayrollNotesQueryVariables = Exact<{
  payrollId: Scalars['uuid']['input'];
}>;


export type GetPayrollNotesQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null }> };

export type GetClientNotesQueryVariables = Exact<{
  clientId: Scalars['uuid']['input'];
}>;


export type GetClientNotesQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null }> };

export type GetUserNotesQueryVariables = Exact<{
  userId: Scalars['uuid']['input'];
}>;


export type GetUserNotesQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null }> };

export type GetNotesByAuthorQueryVariables = Exact<{
  authorUserId: Scalars['uuid']['input'];
}>;


export type GetNotesByAuthorQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type GetMyNotesQueryVariables = Exact<{
  userId: Scalars['uuid']['input'];
}>;


export type GetMyNotesQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type GetImportantNotesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetImportantNotesQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type GetImportantNotesByEntityQueryVariables = Exact<{
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
}>;


export type GetImportantNotesByEntityQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type GetRecentNotesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRecentNotesQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, image?: string | null } | null }> };

export type GetRecentNotesByUserQueryVariables = Exact<{
  userId: Scalars['uuid']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRecentNotesByUserQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, image?: string | null } | null }> };

export type SearchNotesQueryVariables = Exact<{
  searchTerm: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchNotesQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type SearchNotesByEntityQueryVariables = Exact<{
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
  searchTerm: Scalars['String']['input'];
}>;


export type SearchNotesByEntityQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type FilterNotesByDateRangeQueryVariables = Exact<{
  startDate: Scalars['timestamp']['input'];
  endDate: Scalars['timestamp']['input'];
  entityType?: InputMaybe<Scalars['String']['input']>;
  entityId?: InputMaybe<Scalars['uuid']['input']>;
}>;


export type FilterNotesByDateRangeQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type GetNoteDashboardStatsQueryVariables = Exact<{
  userId: Scalars['uuid']['input'];
}>;


export type GetNoteDashboardStatsQuery = { __typename?: 'query_root', totalNotes: { __typename?: 'notesAggregate', aggregate?: { __typename?: 'notesAggregateFields', count: number } | null }, importantNotes: { __typename?: 'notesAggregate', aggregate?: { __typename?: 'notesAggregateFields', count: number } | null }, recentNotes: Array<{ __typename?: 'notes', id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string } | null }>, myRecentNotes: Array<{ __typename?: 'notes', id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string } | null }> };

export type GetNoteActivityQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetNoteActivityQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, image?: string | null } | null }> };

export type GetEntityNoteSummaryQueryVariables = Exact<{
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
}>;


export type GetEntityNoteSummaryQuery = { __typename?: 'query_root', totalCount: { __typename?: 'notesAggregate', aggregate?: { __typename?: 'notesAggregateFields', count: number } | null }, importantCount: { __typename?: 'notesAggregate', aggregate?: { __typename?: 'notesAggregateFields', count: number } | null }, recentNotes: Array<{ __typename?: 'notes', content: string, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, image?: string | null } | null }> };

export type GetNotesForBulkUpdateQueryVariables = Exact<{
  ids: Array<Scalars['uuid']['input']> | Scalars['uuid']['input'];
}>;


export type GetNotesForBulkUpdateQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null }> };

export type GetNotesByAuthorAndDateRangeQueryVariables = Exact<{
  authorUserId: Scalars['uuid']['input'];
  startDate: Scalars['timestamp']['input'];
  endDate: Scalars['timestamp']['input'];
}>;


export type GetNotesByAuthorAndDateRangeQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type GetNotesForAuditQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<NotesBoolExp>;
}>;


export type GetNotesForAuditQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', id: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string }> };

export type GetNotesByEntityTypeQueryVariables = Exact<{
  entityType: Scalars['String']['input'];
}>;


export type GetNotesByEntityTypeQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type GetNotesPaginatedQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<NotesBoolExp>;
  orderBy?: InputMaybe<Array<NotesOrderBy> | NotesOrderBy>;
}>;


export type GetNotesPaginatedQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }>, notesAggregate: { __typename?: 'notesAggregate', aggregate?: { __typename?: 'notesAggregateFields', count: number } | null } };

export type GetEntityNotesPaginatedQueryVariables = Exact<{
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetEntityNotesPaginatedQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }>, entityNotesAggregate: { __typename?: 'notesAggregate', aggregate?: { __typename?: 'notesAggregateFields', count: number } | null } };

export type SearchNotesPaginatedQueryVariables = Exact<{
  searchTerm: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchNotesPaginatedQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }>, searchAggregate: { __typename?: 'notesAggregate', aggregate?: { __typename?: 'notesAggregateFields', count: number } | null } };

export type GetNotesQuickListQueryVariables = Exact<{
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
}>;


export type GetNotesQuickListQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', id: string, isImportant?: boolean | null, createdAt?: any | null, userId?: string | null }> };

export type GetImportantNotesQuickListQueryVariables = Exact<{
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
}>;


export type GetImportantNotesQuickListQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', id: string, isImportant?: boolean | null, createdAt?: any | null, userId?: string | null }> };

export type GetNotesExtractedQueryVariables = Exact<{
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
}>;


export type GetNotesExtractedQuery = { __typename?: 'query_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type NoteUpdatesSubscriptionVariables = Exact<{
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
}>;


export type NoteUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type NotesByEntityUpdatesSubscriptionVariables = Exact<{
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
}>;


export type NotesByEntityUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type SingleNoteUpdatesSubscriptionVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type SingleNoteUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null }> };

export type PayrollNotesUpdatesSubscriptionVariables = Exact<{
  payrollId: Scalars['uuid']['input'];
}>;


export type PayrollNotesUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null }> };

export type ClientNotesUpdatesSubscriptionVariables = Exact<{
  clientId: Scalars['uuid']['input'];
}>;


export type ClientNotesUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null }> };

export type UserNotesUpdatesSubscriptionVariables = Exact<{
  userId: Scalars['uuid']['input'];
}>;


export type UserNotesUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string, role: any } | null }> };

export type MyNotesUpdatesSubscriptionVariables = Exact<{
  authorUserId: Scalars['uuid']['input'];
}>;


export type MyNotesUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type RecentNotesUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type RecentNotesUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', content: string, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, image?: string | null } | null }> };

export type ImportantNotesUpdatesSubscriptionVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ImportantNotesUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type ImportantNotesByEntityUpdatesSubscriptionVariables = Exact<{
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
}>;


export type ImportantNotesByEntityUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type NoteActivityUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NoteActivityUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', content: string, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, image?: string | null } | null }> };

export type TotalNotesUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TotalNotesUpdatesSubscription = { __typename?: 'subscription_root', notesAggregate: { __typename?: 'notesAggregate', aggregate?: { __typename?: 'notesAggregateFields', count: number } | null } };

export type ImportantNotesCountUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ImportantNotesCountUpdatesSubscription = { __typename?: 'subscription_root', notesAggregate: { __typename?: 'notesAggregate', aggregate?: { __typename?: 'notesAggregateFields', count: number } | null } };

export type TodaysNotesUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TodaysNotesUpdatesSubscription = { __typename?: 'subscription_root', notesAggregate: { __typename?: 'notesAggregate', aggregate?: { __typename?: 'notesAggregateFields', count: number } | null } };

export type EntityNotesUpdatesSubscriptionVariables = Exact<{
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
}>;


export type EntityNotesUpdatesSubscription = { __typename?: 'subscription_root', notesAggregate: { __typename?: 'notesAggregate', aggregate?: { __typename?: 'notesAggregateFields', count: number } | null } };

export type EntityImportantNotesUpdatesSubscriptionVariables = Exact<{
  entityType: Scalars['String']['input'];
  entityId: Scalars['uuid']['input'];
}>;


export type EntityImportantNotesUpdatesSubscription = { __typename?: 'subscription_root', notesAggregate: { __typename?: 'notesAggregate', aggregate?: { __typename?: 'notesAggregateFields', count: number } | null } };

export type UserNoteActivityUpdatesSubscriptionVariables = Exact<{
  authorUserId: Scalars['uuid']['input'];
}>;


export type UserNoteActivityUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', content: string, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, image?: string | null } | null }> };

export type NotesByDateRangeUpdatesSubscriptionVariables = Exact<{
  startDate: Scalars['timestamp']['input'];
  endDate: Scalars['timestamp']['input'];
}>;


export type NotesByDateRangeUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type NoteSearchUpdatesSubscriptionVariables = Exact<{
  searchTerm: Scalars['String']['input'];
}>;


export type NoteSearchUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type TeamNotesUpdatesSubscriptionVariables = Exact<{
  teamUserIds: Array<Scalars['uuid']['input']> | Scalars['uuid']['input'];
}>;


export type TeamNotesUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type EntityTypeNotesUpdatesSubscriptionVariables = Exact<{
  entityType: Scalars['String']['input'];
}>;


export type EntityTypeNotesUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type NoteChangesUpdatesSubscriptionVariables = Exact<{
  noteId: Scalars['uuid']['input'];
}>;


export type NoteChangesUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, updatedAt?: any | null, authorUser?: { __typename?: 'users', id: string, name: string } | null }> };

export type NewNotesUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewNotesUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', createdAt?: any | null, content: string, id: string, isImportant?: boolean | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, image?: string | null } | null }> };

export type RecentNotesListUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type RecentNotesListUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', id: string, content: string, createdAt?: any | null, entityType: string, authorUser?: { __typename?: 'users', name: string } | null }> };

export type NotesCountUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NotesCountUpdatesSubscription = { __typename?: 'subscription_root', notesAggregate: { __typename?: 'notesAggregate', aggregate?: { __typename?: 'notesAggregateFields', count: number } | null } };

export type NoteAuditUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NoteAuditUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', id: string, isImportant?: boolean | null, createdAt?: any | null, updatedAt?: any | null, userId?: string | null, entityType: string, entityId: string }> };

export type ImportantNoteChangesUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ImportantNoteChangesUpdatesSubscription = { __typename?: 'subscription_root', notes: Array<{ __typename?: 'notes', content: string, updatedAt?: any | null, id: string, isImportant?: boolean | null, createdAt?: any | null, entityType: string, entityId: string, userId?: string | null, authorUser?: { __typename?: 'users', id: string, name: string, role: any } | null }> };

export type UserMinimalFragment = { __typename?: 'users', id: string, name: string, email: string };

export type UserCoreSharedFragment = { __typename?: 'users', role: any, isActive?: boolean | null, id: string, name: string, email: string };

export type UserBasicFragment = { __typename?: 'users', createdAt?: string | null, updatedAt?: string | null, role: any, isActive?: boolean | null, id: string, name: string, email: string };

export type UserBaseFragment = { __typename?: 'users', createdAt?: string | null, updatedAt?: string | null, role: any, isActive?: boolean | null, id: string, name: string, email: string };

export type UserWithRoleFragment = { __typename?: 'users', createdAt?: string | null, updatedAt?: string | null, role: any, isActive?: boolean | null, id: string, name: string, email: string, assignedRoles: Array<{ __typename?: 'userRoles', assignedRole: { __typename?: 'roles', id: string, name: string, displayName: string } }> };

export type UserProfileFragment = { __typename?: 'users', username?: string | null, clerkUserId?: string | null, image?: string | null, isStaff?: boolean | null, managerId?: string | null, deactivatedAt?: string | null, deactivatedBy?: string | null, createdAt?: string | null, updatedAt?: string | null, role: any, isActive?: boolean | null, id: string, name: string, email: string, managerUser?: { __typename?: 'users', id: string, name: string, email: string } | null, assignedRoles: Array<{ __typename?: 'userRoles', assignedRole: { __typename?: 'roles', id: string, name: string, displayName: string } }> };

export type UserSearchResultFragment = { __typename?: 'users', username?: string | null, isStaff?: boolean | null, role: any, isActive?: boolean | null, id: string, name: string, email: string };

export type ClientMinimalFragment = { __typename?: 'clients', id: string, name: string };

export type ClientBaseFragment = { __typename?: 'clients', id: string, name: string, active?: boolean | null, contactEmail?: string | null, contactPerson?: string | null, contactPhone?: string | null, createdAt?: string | null };

export type ClientWithStatsFragment = { __typename?: 'clients', id: string, name: string, active?: boolean | null, contactEmail?: string | null, contactPerson?: string | null, contactPhone?: string | null, createdAt?: string | null, currentEmployeeCount: { __typename?: 'payrollsAggregate', aggregate?: { __typename?: 'payrollsAggregateFields', sum?: { __typename?: 'payrollsSumFields', employeeCount?: number | null } | null } | null }, activePayrollCount: { __typename?: 'payrollsAggregate', aggregate?: { __typename?: 'payrollsAggregateFields', count: number } | null } };

export type ClientListBaseFragment = { __typename?: 'clients', id: string, name: string, active?: boolean | null, contactEmail?: string | null, contactPerson?: string | null, contactPhone?: string | null, createdAt?: string | null, payrollCount: { __typename?: 'payrollsAggregate', aggregate?: { __typename?: 'payrollsAggregateFields', count: number } | null } };

export type PayrollMinimalFragment = { __typename?: 'payrolls', id: string, name: string, employeeCount?: number | null, status: any };

export type PayrollBaseFragment = { __typename?: 'payrolls', id: string, name: string, employeeCount?: number | null, status: any, payrollSystem?: string | null, processingTime: number, processingDaysBeforeEft: number, versionNumber?: number | null, createdAt?: string | null, updatedAt?: string | null };

export type PayrollWithClientFragment = { __typename?: 'payrolls', clientId: string, id: string, name: string, employeeCount?: number | null, status: any, payrollSystem?: string | null, processingTime: number, processingDaysBeforeEft: number, versionNumber?: number | null, createdAt?: string | null, updatedAt?: string | null, client: { __typename?: 'clients', id: string, name: string, active?: boolean | null } };

export type PayrollListItemFragment = { __typename?: 'payrolls', primaryConsultantUserId?: string | null, backupConsultantUserId?: string | null, managerUserId?: string | null, createdByUserId?: string | null, clientId: string, id: string, name: string, employeeCount?: number | null, status: any, payrollSystem?: string | null, processingTime: number, processingDaysBeforeEft: number, versionNumber?: number | null, createdAt?: string | null, updatedAt?: string | null, primaryConsultant?: { __typename?: 'users', id: string, name: string, email: string } | null, manager?: { __typename?: 'users', id: string, name: string, email: string } | null, client: { __typename?: 'clients', id: string, name: string, active?: boolean | null } };

export type PayrollWithDatesFragment = { __typename?: 'payrolls', goLiveDate?: string | null, id: string, name: string, employeeCount?: number | null, status: any, payrollSystem?: string | null, processingTime: number, processingDaysBeforeEft: number, versionNumber?: number | null, createdAt?: string | null, updatedAt?: string | null, payrollDates: Array<{ __typename?: 'payrollDates', id: string, originalEftDate: string, adjustedEftDate: string, notes?: string | null }> };

export type PayrollFullDetailFragment = { __typename?: 'payrolls', dateTypeId: string, cycleId: string, dateValue?: number | null, versionReason?: string | null, supersededDate?: string | null, parentPayrollId?: string | null, goLiveDate?: string | null, clientId: string, id: string, name: string, employeeCount?: number | null, status: any, payrollSystem?: string | null, processingTime: number, processingDaysBeforeEft: number, versionNumber?: number | null, createdAt?: string | null, updatedAt?: string | null, parentPayroll?: { __typename?: 'payrolls', id: string, versionNumber?: number | null } | null, childPayrolls: Array<{ __typename?: 'payrolls', id: string, versionNumber?: number | null, versionReason?: string | null, createdAt?: string | null }>, primaryConsultant?: { __typename?: 'users', id: string, name: string, email: string } | null, backupConsultant?: { __typename?: 'users', id: string, name: string, email: string } | null, manager?: { __typename?: 'users', id: string, name: string, email: string } | null, payrollDates: Array<{ __typename?: 'payrollDates', id: string, originalEftDate: string, adjustedEftDate: string, notes?: string | null }>, client: { __typename?: 'clients', id: string, name: string, active?: boolean | null } };

export type NoteWithAuthorFragment = { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, entityId: string, entityType: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string } | null };

export type PermissionBaseFragment = { __typename?: 'permissions', id: string, resourceId: string, description?: string | null, legacyPermissionName?: string | null, action: any };

export type RoleWithPermissionsFragment = { __typename?: 'roles', id: string, name: string, displayName: string, description?: string | null, isSystemRole: boolean, priority: number, assignedPermissions: Array<{ __typename?: 'rolePermissions', grantedPermission: { __typename?: 'permissions', id: string, resourceId: string, description?: string | null, legacyPermissionName?: string | null, action: any } }> };

export type AuditLogEntryFragment = { __typename?: 'auditLogs', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, metadata?: any | null };

export type AuthEventFragment = { __typename?: 'authEvents', id: string, userId?: string | null, userEmail?: string | null, eventType: string, eventTime: string, success?: boolean | null, failureReason?: string | null, ipAddress?: any | null, userAgent?: string | null, metadata?: any | null };

export type DataAccessLogFragment = { __typename?: 'dataAccessLogs', id: string, userId: string, resourceType: string, resourceId?: string | null, accessType: string, accessedAt: string, dataClassification?: string | null, fieldsAccessed?: Array<string> | null, rowCount?: number | null, ipAddress?: any | null, metadata?: any | null };

export type PermissionChangeFragment = { __typename?: 'permissionChanges', id: string, changedAt: string, changedByUserId: string, targetUserId?: string | null, targetRoleId?: string | null, changeType: string, permissionType?: string | null, oldPermissions?: any | null, newPermissions?: any | null, reason?: string | null, approvedByUserId?: string | null };

export type PayrollDateInfoFragment = { __typename?: 'payrollDates', id: string, originalEftDate: string, adjustedEftDate: string, notes?: string | null, createdAt?: string | null };

export type PermissionOverrideInfoFragment = { __typename?: 'permissionOverrides', id: string, userId?: string | null, role?: string | null, resource: string, operation: string, granted: boolean, reason?: string | null, conditions?: any | null, expiresAt?: string | null, createdBy?: string | null, createdAt: string };

export type LogAuditEventMutationVariables = Exact<{
  input: AuditLogsInsertInput;
}>;


export type LogAuditEventMutation = { __typename?: 'mutation_root', insertAuditLogsOne?: { __typename?: 'auditLogs', id: string, eventTime: string } | null };

export type RefreshDataMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshDataMutation = { __typename: 'mutation_root' };

export type GetDashboardMetricsQueryVariables = Exact<{
  userId: Scalars['uuid']['input'];
}>;


export type GetDashboardMetricsQuery = { __typename?: 'query_root', clientsAggregate: { __typename?: 'clientsAggregate', aggregate?: { __typename?: 'clientsAggregateFields', count: number } | null }, activePayrollsAggregate: { __typename?: 'payrollsAggregate', aggregate?: { __typename?: 'payrollsAggregateFields', count: number } | null }, totalEmployeesAggregate: { __typename?: 'payrollsAggregate', aggregate?: { __typename?: 'payrollsAggregateFields', sum?: { __typename?: 'payrollsSumFields', employeeCount?: number | null } | null } | null }, upcomingPayrolls: Array<{ __typename?: 'payrolls', id: string, name: string, employeeCount?: number | null, status: any, client: { __typename?: 'clients', id: string, name: string } }> };

export type GetDashboardStatsOptimizedQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetDashboardStatsOptimizedQuery = { __typename?: 'query_root', clientsAggregate: { __typename?: 'clientsAggregate', aggregate?: { __typename?: 'clientsAggregateFields', count: number } | null }, totalPayrolls: { __typename?: 'payrollsAggregate', aggregate?: { __typename?: 'payrollsAggregateFields', count: number } | null }, activePayrolls: { __typename?: 'payrollsAggregate', aggregate?: { __typename?: 'payrollsAggregateFields', count: number } | null }, processingPayrolls: { __typename?: 'payrollsAggregate', aggregate?: { __typename?: 'payrollsAggregateFields', count: number } | null }, upcomingPayrolls: Array<{ __typename?: 'payrolls', id: string, name: string, status: any, client: { __typename?: 'clients', id: string, name: string } }> };

export type GetClientsDashboardStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetClientsDashboardStatsQuery = { __typename?: 'query_root', activeClientsCount: { __typename?: 'clientsAggregate', aggregate?: { __typename?: 'clientsAggregateFields', count: number } | null }, payrollsAggregate: { __typename?: 'payrollsAggregate', aggregate?: { __typename?: 'payrollsAggregateFields', sum?: { __typename?: 'payrollsSumFields', employeeCount?: number | null } | null } | null }, clientsNeedingAttention: Array<{ __typename?: 'clients', id: string, name: string }> };

export type GetCurrentUserQueryVariables = Exact<{
  userId: Scalars['uuid']['input'];
}>;


export type GetCurrentUserQuery = { __typename?: 'query_root', user?: { __typename?: 'users', username?: string | null, clerkUserId?: string | null, image?: string | null, isStaff?: boolean | null, managerId?: string | null, deactivatedAt?: string | null, deactivatedBy?: string | null, createdAt?: string | null, updatedAt?: string | null, role: any, isActive?: boolean | null, id: string, name: string, email: string, managerUser?: { __typename?: 'users', id: string, name: string, email: string } | null, assignedRoles: Array<{ __typename?: 'userRoles', assignedRole: { __typename?: 'roles', id: string, name: string, displayName: string } }> } | null };

export type GetUsersForDropdownQueryVariables = Exact<{
  role?: InputMaybe<Scalars['user_role']['input']>;
}>;


export type GetUsersForDropdownQuery = { __typename?: 'query_root', users: Array<{ __typename?: 'users', id: string, name: string, email: string }> };

export type GetSystemHealthQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSystemHealthQuery = { __typename?: 'query_root', databaseHealth: Array<{ __typename?: 'users', id: string }>, recentActivity: { __typename?: 'auditLogsAggregate', aggregate?: { __typename?: 'auditLogsAggregateFields', count: number } | null } };

export type GlobalSearchQueryVariables = Exact<{
  searchTerm: Scalars['String']['input'];
}>;


export type GlobalSearchQuery = { __typename?: 'query_root', clients: Array<{ __typename?: 'clients', id: string, name: string }>, users: Array<{ __typename?: 'users', id: string, name: string, email: string }>, payrolls: Array<{ __typename?: 'payrolls', id: string, name: string, employeeCount?: number | null, status: any, client: { __typename?: 'clients', id: string, name: string } }> };

export type RecentActivitySubscriptionVariables = Exact<{
  resourceTypes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type RecentActivitySubscription = { __typename?: 'subscription_root', auditLogs: Array<{ __typename?: 'auditLogs', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, metadata?: any | null }> };

export type AuthenticationEventsSubscriptionVariables = Exact<{
  userId?: InputMaybe<Scalars['uuid']['input']>;
}>;


export type AuthenticationEventsSubscription = { __typename?: 'subscription_root', authEvents: Array<{ __typename?: 'authEvents', id: string, userId?: string | null, userEmail?: string | null, eventType: string, eventTime: string, success?: boolean | null, failureReason?: string | null, ipAddress?: any | null, userAgent?: string | null, metadata?: any | null }> };

export type SensitiveDataAccessSubscriptionVariables = Exact<{
  resourceTypes: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type SensitiveDataAccessSubscription = { __typename?: 'subscription_root', dataAccessLogs: Array<{ __typename?: 'dataAccessLogs', id: string, userId: string, resourceType: string, resourceId?: string | null, accessType: string, accessedAt: string, dataClassification?: string | null, fieldsAccessed?: Array<string> | null, rowCount?: number | null, ipAddress?: any | null, metadata?: any | null }> };

export type PermissionChangeStreamSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type PermissionChangeStreamSubscription = { __typename?: 'subscription_root', permissionChanges: Array<{ __typename?: 'permissionChanges', id: string, changedAt: string, changedByUserId: string, targetUserId?: string | null, targetRoleId?: string | null, changeType: string, permissionType?: string | null, oldPermissions?: any | null, newPermissions?: any | null, reason?: string | null, approvedByUserId?: string | null }> };

export const NoteCoreFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}}]} as unknown as DocumentNode<NoteCoreFragment, unknown>;
export const NoteBasicFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}}]} as unknown as DocumentNode<NoteBasicFragment, unknown>;
export const NoteDetailedFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteDetailed"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<NoteDetailedFragment, unknown>;
export const NoteWithEntityFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteWithEntity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<NoteWithEntityFragment, unknown>;
export const NoteSummaryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]} as unknown as DocumentNode<NoteSummaryFragment, unknown>;
export const NoteListItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]} as unknown as DocumentNode<NoteListItemFragment, unknown>;
export const NoteTableRowFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteTableRow"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<NoteTableRowFragment, unknown>;
export const NoteMinimalFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]} as unknown as DocumentNode<NoteMinimalFragment, unknown>;
export const NoteForAuditFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteForAudit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}}]} as unknown as DocumentNode<NoteForAuditFragment, unknown>;
export const NoteDashboardFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteDashboard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]} as unknown as DocumentNode<NoteDashboardFragment, unknown>;
export const PayrollNoteFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<PayrollNoteFragment, unknown>;
export const ClientNoteFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<ClientNoteFragment, unknown>;
export const UserNoteFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<UserNoteFragment, unknown>;
export const ImportantNoteFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImportantNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<ImportantNoteFragment, unknown>;
export const NoteCardFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]} as unknown as DocumentNode<NoteCardFragment, unknown>;
export const RecentNoteFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecentNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCard"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]} as unknown as DocumentNode<RecentNoteFragment, unknown>;
export const UserMinimalFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<UserMinimalFragment, unknown>;
export const UserCoreSharedFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCoreShared"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<UserCoreSharedFragment, unknown>;
export const UserBasicFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCoreShared"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCoreShared"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]} as unknown as DocumentNode<UserBasicFragment, unknown>;
export const UserBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBasic"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCoreShared"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCoreShared"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UserBaseFragment, unknown>;
export const UserWithRoleFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserWithRole"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBasic"}},{"kind":"Field","name":{"kind":"Name","value":"assignedRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignedRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCoreShared"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCoreShared"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UserWithRoleFragment, unknown>;
export const UserProfileFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserProfile"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserWithRole"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"clerkUserId"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"isStaff"}},{"kind":"Field","name":{"kind":"Name","value":"managerId"}},{"kind":"Field","name":{"kind":"Name","value":"deactivatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deactivatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"managerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCoreShared"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCoreShared"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserWithRole"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBasic"}},{"kind":"Field","name":{"kind":"Name","value":"assignedRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignedRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]}}]} as unknown as DocumentNode<UserProfileFragment, unknown>;
export const UserSearchResultFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserSearchResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCoreShared"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"isStaff"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCoreShared"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]} as unknown as DocumentNode<UserSearchResultFragment, unknown>;
export const ClientMinimalFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<ClientMinimalFragment, unknown>;
export const ClientBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"contactPerson"}},{"kind":"Field","name":{"kind":"Name","value":"contactPhone"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ClientBaseFragment, unknown>;
export const ClientWithStatsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientWithStats"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientBase"}},{"kind":"Field","alias":{"kind":"Name","value":"currentEmployeeCount"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sum"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"activePayrollCount"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"Active","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"contactPerson"}},{"kind":"Field","name":{"kind":"Name","value":"contactPhone"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ClientWithStatsFragment, unknown>;
export const ClientListBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientListBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientBase"}},{"kind":"Field","alias":{"kind":"Name","value":"payrollCount"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"contactPerson"}},{"kind":"Field","name":{"kind":"Name","value":"contactPhone"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ClientListBaseFragment, unknown>;
export const PayrollMinimalFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<PayrollMinimalFragment, unknown>;
export const PayrollBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"payrollSystem"}},{"kind":"Field","name":{"kind":"Name","value":"processingTime"}},{"kind":"Field","name":{"kind":"Name","value":"processingDaysBeforeEft"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<PayrollBaseFragment, unknown>;
export const PayrollWithClientFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollWithClient"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollBase"}},{"kind":"Field","name":{"kind":"Name","value":"clientId"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"payrollSystem"}},{"kind":"Field","name":{"kind":"Name","value":"processingTime"}},{"kind":"Field","name":{"kind":"Name","value":"processingDaysBeforeEft"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<PayrollWithClientFragment, unknown>;
export const PayrollListItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollWithClient"}},{"kind":"Field","name":{"kind":"Name","value":"primaryConsultantUserId"}},{"kind":"Field","name":{"kind":"Name","value":"backupConsultantUserId"}},{"kind":"Field","name":{"kind":"Name","value":"managerUserId"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"primaryConsultant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"manager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"payrollSystem"}},{"kind":"Field","name":{"kind":"Name","value":"processingTime"}},{"kind":"Field","name":{"kind":"Name","value":"processingDaysBeforeEft"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollWithClient"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollBase"}},{"kind":"Field","name":{"kind":"Name","value":"clientId"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<PayrollListItemFragment, unknown>;
export const PayrollWithDatesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollWithDates"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollBase"}},{"kind":"Field","name":{"kind":"Name","value":"goLiveDate"}},{"kind":"Field","name":{"kind":"Name","value":"payrollDates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"originalEftDate"},"value":{"kind":"EnumValue","value":"ASC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"originalEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"adjustedEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"payrollSystem"}},{"kind":"Field","name":{"kind":"Name","value":"processingTime"}},{"kind":"Field","name":{"kind":"Name","value":"processingDaysBeforeEft"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<PayrollWithDatesFragment, unknown>;
export const PayrollFullDetailFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollFullDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollWithDates"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollWithClient"}},{"kind":"Field","name":{"kind":"Name","value":"dateTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"cycleId"}},{"kind":"Field","name":{"kind":"Name","value":"dateValue"}},{"kind":"Field","name":{"kind":"Name","value":"versionReason"}},{"kind":"Field","name":{"kind":"Name","value":"supersededDate"}},{"kind":"Field","name":{"kind":"Name","value":"parentPayrollId"}},{"kind":"Field","name":{"kind":"Name","value":"parentPayroll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"childPayrolls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"versionNumber"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"versionReason"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryConsultant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backupConsultant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"manager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"payrollSystem"}},{"kind":"Field","name":{"kind":"Name","value":"processingTime"}},{"kind":"Field","name":{"kind":"Name","value":"processingDaysBeforeEft"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollWithDates"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollBase"}},{"kind":"Field","name":{"kind":"Name","value":"goLiveDate"}},{"kind":"Field","name":{"kind":"Name","value":"payrollDates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"originalEftDate"},"value":{"kind":"EnumValue","value":"ASC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"originalEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"adjustedEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollWithClient"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollBase"}},{"kind":"Field","name":{"kind":"Name","value":"clientId"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<PayrollFullDetailFragment, unknown>;
export const NoteWithAuthorFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteWithAuthor"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<NoteWithAuthorFragment, unknown>;
export const PermissionBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"permissions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"legacyPermissionName"}},{"kind":"Field","name":{"kind":"Name","value":"action"}}]}}]} as unknown as DocumentNode<PermissionBaseFragment, unknown>;
export const RoleWithPermissionsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleWithPermissions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"roles"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isSystemRole"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"assignedPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"grantedPermission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PermissionBase"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"permissions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"legacyPermissionName"}},{"kind":"Field","name":{"kind":"Name","value":"action"}}]}}]} as unknown as DocumentNode<RoleWithPermissionsFragment, unknown>;
export const AuditLogEntryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<AuditLogEntryFragment, unknown>;
export const AuthEventFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"authEvents"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<AuthEventFragment, unknown>;
export const DataAccessLogFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataAccessLog"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"dataAccessLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}},{"kind":"Field","name":{"kind":"Name","value":"fieldsAccessed"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<DataAccessLogFragment, unknown>;
export const PermissionChangeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionChange"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"permissionChanges"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"changeType"}},{"kind":"Field","name":{"kind":"Name","value":"permissionType"}},{"kind":"Field","name":{"kind":"Name","value":"oldPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"newPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}}]}}]} as unknown as DocumentNode<PermissionChangeFragment, unknown>;
export const PayrollDateInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollDateInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrollDates"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"originalEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"adjustedEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<PayrollDateInfoFragment, unknown>;
export const PermissionOverrideInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionOverrideInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"permissionOverrides"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"granted"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<PermissionOverrideInfoFragment, unknown>;
export const CreateNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"object"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"notesInsertInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"object"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteDetailed"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteDetailed"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]} as unknown as DocumentNode<CreateNoteMutation, CreateNoteMutationVariables>;
export const AddNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteDetailed"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteDetailed"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]} as unknown as DocumentNode<AddNoteMutation, AddNoteMutationVariables>;
export const UpdateNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"set"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"notesSetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNoteById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pkColumns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"set"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteDetailed"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteDetailed"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]} as unknown as DocumentNode<UpdateNoteMutation, UpdateNoteMutationVariables>;
export const UpdateNoteContentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNoteContent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNoteById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pkColumns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"StringValue","value":"now()","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteDetailed"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteDetailed"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]} as unknown as DocumentNode<UpdateNoteContentMutation, UpdateNoteContentMutationVariables>;
export const DeleteNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNoteById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}}]}}]} as unknown as DocumentNode<DeleteNoteMutation, DeleteNoteMutationVariables>;
export const ToggleNoteImportanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleNoteImportance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNoteById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pkColumns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"StringValue","value":"now()","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<ToggleNoteImportanceMutation, ToggleNoteImportanceMutationVariables>;
export const MarkNoteAsImportantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkNoteAsImportant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNoteById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pkColumns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"BooleanValue","value":true}},{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"StringValue","value":"now()","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<MarkNoteAsImportantMutation, MarkNoteAsImportantMutationVariables>;
export const UnmarkNoteAsImportantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnmarkNoteAsImportant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNoteById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pkColumns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"BooleanValue","value":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"StringValue","value":"now()","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<UnmarkNoteAsImportantMutation, UnmarkNoteAsImportantMutationVariables>;
export const AddPayrollNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddPayrollNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payrollId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"StringValue","value":"payroll","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payrollId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]} as unknown as DocumentNode<AddPayrollNoteMutation, AddPayrollNoteMutationVariables>;
export const AddClientNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddClientNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"StringValue","value":"client","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]} as unknown as DocumentNode<AddClientNoteMutation, AddClientNoteMutationVariables>;
export const AddUserNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddUserNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"authorUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"StringValue","value":"user","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"authorUserId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]} as unknown as DocumentNode<AddUserNoteMutation, AddUserNoteMutationVariables>;
export const BulkDeleteNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkDeleteNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkDeleteNotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"affectedRows"}}]}}]}}]} as unknown as DocumentNode<BulkDeleteNotesMutation, BulkDeleteNotesMutationVariables>;
export const BulkMarkNotesImportantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkMarkNotesImportant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkUpdateNotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"BooleanValue","value":true}},{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"StringValue","value":"now()","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"affectedRows"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<BulkMarkNotesImportantMutation, BulkMarkNotesImportantMutationVariables>;
export const BulkUnmarkNotesImportantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkUnmarkNotesImportant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkUpdateNotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"BooleanValue","value":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"StringValue","value":"now()","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"affectedRows"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<BulkUnmarkNotesImportantMutation, BulkUnmarkNotesImportantMutationVariables>;
export const BulkUpdateNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkUpdateNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"notesBoolExp"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"set"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"notesSetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkUpdateNotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"set"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"affectedRows"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<BulkUpdateNotesMutation, BulkUpdateNotesMutationVariables>;
export const DeleteNotesByEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNotesByEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkDeleteNotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"affectedRows"}}]}}]}}]} as unknown as DocumentNode<DeleteNotesByEntityMutation, DeleteNotesByEntityMutationVariables>;
export const DeleteNotesByAuthorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNotesByAuthor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"authorUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkDeleteNotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"authorUserId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"affectedRows"}}]}}]}}]} as unknown as DocumentNode<DeleteNotesByAuthorMutation, DeleteNotesByAuthorMutationVariables>;
export const TransferNotesToNewAuthorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TransferNotesToNewAuthor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldAuthorUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newAuthorUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkUpdateNotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldAuthorUserId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newAuthorUserId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"StringValue","value":"now()","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"affectedRows"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<TransferNotesToNewAuthorMutation, TransferNotesToNewAuthorMutationVariables>;
export const TransferNotesToNewEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TransferNotesToNewEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldEntityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldEntityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newEntityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newEntityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkUpdateNotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldEntityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldEntityId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newEntityType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newEntityId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"StringValue","value":"now()","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"affectedRows"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<TransferNotesToNewEntityMutation, TransferNotesToNewEntityMutationVariables>;
export const AddNoteExtractedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddNoteExtracted"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<AddNoteExtractedMutation, AddNoteExtractedMutationVariables>;
export const UpdateNoteExtractedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNoteExtracted"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNoteById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pkColumns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isImportant"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"StringValue","value":"now()","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<UpdateNoteExtractedMutation, UpdateNoteExtractedMutationVariables>;
export const GetNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"50"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"notesBoolExp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notesAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetNotesQuery, GetNotesQueryVariables>;
export const GetNoteByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNoteById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"noteById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteDetailed"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteDetailed"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]} as unknown as DocumentNode<GetNoteByIdQuery, GetNoteByIdQueryVariables>;
export const GetNoteBasicDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNoteBasic"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"noteById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetNoteBasicQuery, GetNoteBasicQueryVariables>;
export const GetNotesByEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotesByEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetNotesByEntityQuery, GetNotesByEntityQueryVariables>;
export const GetPayrollNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPayrollNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payrollId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"payroll","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payrollId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]} as unknown as DocumentNode<GetPayrollNotesQuery, GetPayrollNotesQueryVariables>;
export const GetClientNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetClientNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"client","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]} as unknown as DocumentNode<GetClientNotesQuery, GetClientNotesQueryVariables>;
export const GetUserNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"user","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]} as unknown as DocumentNode<GetUserNotesQuery, GetUserNotesQueryVariables>;
export const GetNotesByAuthorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotesByAuthor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"authorUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"authorUserId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetNotesByAuthorQuery, GetNotesByAuthorQueryVariables>;
export const GetMyNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetMyNotesQuery, GetMyNotesQueryVariables>;
export const GetImportantNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetImportantNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImportantNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImportantNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]} as unknown as DocumentNode<GetImportantNotesQuery, GetImportantNotesQueryVariables>;
export const GetImportantNotesByEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetImportantNotesByEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImportantNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImportantNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]} as unknown as DocumentNode<GetImportantNotesByEntityQuery, GetImportantNotesByEntityQueryVariables>;
export const GetRecentNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRecentNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecentNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecentNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCard"}}]}}]} as unknown as DocumentNode<GetRecentNotesQuery, GetRecentNotesQueryVariables>;
export const GetRecentNotesByUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRecentNotesByUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecentNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecentNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCard"}}]}}]} as unknown as DocumentNode<GetRecentNotesByUserQuery, GetRecentNotesByUserQueryVariables>;
export const SearchNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"authorUser"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<SearchNotesQuery, SearchNotesQueryVariables>;
export const SearchNotesByEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchNotesByEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_and"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<SearchNotesByEntityQuery, SearchNotesByEntityQueryVariables>;
export const FilterNotesByDateRangeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FilterNotesByDateRange"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_and"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<FilterNotesByDateRangeQuery, FilterNotesByDateRangeQueryVariables>;
export const GetNoteDashboardStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNoteDashboardStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"totalNotes"},"name":{"kind":"Name","value":"notesAggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"importantNotes"},"name":{"kind":"Name","value":"notesAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"recentNotes"},"name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteDashboard"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"myRecentNotes"},"name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"3"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteDashboard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteDashboard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetNoteDashboardStatsQuery, GetNoteDashboardStatsQueryVariables>;
export const GetNoteActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNoteActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]} as unknown as DocumentNode<GetNoteActivityQuery, GetNoteActivityQueryVariables>;
export const GetEntityNoteSummaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEntityNoteSummary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"totalCount"},"name":{"kind":"Name","value":"notesAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"importantCount"},"name":{"kind":"Name","value":"notesAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"recentNotes"},"name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"3"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]} as unknown as DocumentNode<GetEntityNoteSummaryQuery, GetEntityNoteSummaryQueryVariables>;
export const GetNotesForBulkUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotesForBulkUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetNotesForBulkUpdateQuery, GetNotesForBulkUpdateQueryVariables>;
export const GetNotesByAuthorAndDateRangeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotesByAuthorAndDateRange"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"authorUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_and"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"authorUserId"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetNotesByAuthorAndDateRangeQuery, GetNotesByAuthorAndDateRangeQueryVariables>;
export const GetNotesForAuditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotesForAudit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"100"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"notesBoolExp"}},"defaultValue":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteForAudit"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteForAudit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}}]} as unknown as DocumentNode<GetNotesForAuditQuery, GetNotesForAuditQueryVariables>;
export const GetNotesByEntityTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotesByEntityType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetNotesByEntityTypeQuery, GetNotesByEntityTypeQueryVariables>;
export const GetNotesPaginatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotesPaginated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"notesBoolExp"}},"defaultValue":{"kind":"ObjectValue","fields":[]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"notesOrderBy"}}}},"defaultValue":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notesAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetNotesPaginatedQuery, GetNotesPaginatedQueryVariables>;
export const GetEntityNotesPaginatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEntityNotesPaginated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"entityNotesAggregate"},"name":{"kind":"Name","value":"notesAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetEntityNotesPaginatedQuery, GetEntityNotesPaginatedQueryVariables>;
export const SearchNotesPaginatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchNotesPaginated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"authorUser"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"searchAggregate"},"name":{"kind":"Name","value":"notesAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"authorUser"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<SearchNotesPaginatedQuery, SearchNotesPaginatedQueryVariables>;
export const GetNotesQuickListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotesQuickList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]} as unknown as DocumentNode<GetNotesQuickListQuery, GetNotesQuickListQueryVariables>;
export const GetImportantNotesQuickListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetImportantNotesQuickList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]} as unknown as DocumentNode<GetImportantNotesQuickListQuery, GetImportantNotesQuickListQueryVariables>;
export const GetNotesExtractedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotesExtracted"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetNotesExtractedQuery, GetNotesExtractedQueryVariables>;
export const NoteUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NoteUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<NoteUpdatesSubscription, NoteUpdatesSubscriptionVariables>;
export const NotesByEntityUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NotesByEntityUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<NotesByEntityUpdatesSubscription, NotesByEntityUpdatesSubscriptionVariables>;
export const SingleNoteUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"SingleNoteUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteDetailed"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteDetailed"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]} as unknown as DocumentNode<SingleNoteUpdatesSubscription, SingleNoteUpdatesSubscriptionVariables>;
export const PayrollNotesUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"PayrollNotesUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payrollId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"payroll","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payrollId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]} as unknown as DocumentNode<PayrollNotesUpdatesSubscription, PayrollNotesUpdatesSubscriptionVariables>;
export const ClientNotesUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ClientNotesUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"client","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]} as unknown as DocumentNode<ClientNotesUpdatesSubscription, ClientNotesUpdatesSubscriptionVariables>;
export const UserNotesUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"UserNotesUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"user","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCore"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCore"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteBasic"}}]}}]} as unknown as DocumentNode<UserNotesUpdatesSubscription, UserNotesUpdatesSubscriptionVariables>;
export const MyNotesUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"MyNotesUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"authorUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"authorUserId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<MyNotesUpdatesSubscription, MyNotesUpdatesSubscriptionVariables>;
export const RecentNotesUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"RecentNotesUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecentNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecentNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCard"}}]}}]} as unknown as DocumentNode<RecentNotesUpdatesSubscription, RecentNotesUpdatesSubscriptionVariables>;
export const ImportantNotesUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ImportantNotesUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImportantNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImportantNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]} as unknown as DocumentNode<ImportantNotesUpdatesSubscription, ImportantNotesUpdatesSubscriptionVariables>;
export const ImportantNotesByEntityUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ImportantNotesByEntityUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImportantNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImportantNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]} as unknown as DocumentNode<ImportantNotesByEntityUpdatesSubscription, ImportantNotesByEntityUpdatesSubscriptionVariables>;
export const NoteActivityUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NoteActivityUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"15"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]} as unknown as DocumentNode<NoteActivityUpdatesSubscription, NoteActivityUpdatesSubscriptionVariables>;
export const TotalNotesUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TotalNotesUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notesAggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<TotalNotesUpdatesSubscription, TotalNotesUpdatesSubscriptionVariables>;
export const ImportantNotesCountUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ImportantNotesCountUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notesAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<ImportantNotesCountUpdatesSubscription, ImportantNotesCountUpdatesSubscriptionVariables>;
export const TodaysNotesUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TodaysNotesUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notesAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"StringValue","value":"today","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<TodaysNotesUpdatesSubscription, TodaysNotesUpdatesSubscriptionVariables>;
export const EntityNotesUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"EntityNotesUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notesAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<EntityNotesUpdatesSubscription, EntityNotesUpdatesSubscriptionVariables>;
export const EntityImportantNotesUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"EntityImportantNotesUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notesAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"entityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<EntityImportantNotesUpdatesSubscription, EntityImportantNotesUpdatesSubscriptionVariables>;
export const UserNoteActivityUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"UserNoteActivityUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"authorUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"authorUserId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]} as unknown as DocumentNode<UserNoteActivityUpdatesSubscription, UserNoteActivityUpdatesSubscriptionVariables>;
export const NotesByDateRangeUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NotesByDateRangeUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<NotesByDateRangeUpdatesSubscription, NotesByDateRangeUpdatesSubscriptionVariables>;
export const NoteSearchUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NoteSearchUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"authorUser"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<NoteSearchUpdatesSubscription, NoteSearchUpdatesSubscriptionVariables>;
export const TeamNotesUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TeamNotesUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamUserIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamUserIds"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<TeamNotesUpdatesSubscription, TeamNotesUpdatesSubscriptionVariables>;
export const EntityTypeNotesUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"EntityTypeNotesUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"entityType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<EntityTypeNotesUpdatesSubscription, EntityTypeNotesUpdatesSubscriptionVariables>;
export const NoteChangesUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NoteChangesUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"noteId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"noteId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<NoteChangesUpdatesSubscription, NoteChangesUpdatesSubscriptionVariables>;
export const NewNotesUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewNotesUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"StringValue","value":"now() - interval '5 minutes'","block":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteCard"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]} as unknown as DocumentNode<NewNotesUpdatesSubscription, NewNotesUpdatesSubscriptionVariables>;
export const RecentNotesListUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"RecentNotesListUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}}]}}]}}]} as unknown as DocumentNode<RecentNotesListUpdatesSubscription, RecentNotesListUpdatesSubscriptionVariables>;
export const NotesCountUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NotesCountUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notesAggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<NotesCountUpdatesSubscription, NotesCountUpdatesSubscriptionVariables>;
export const NoteAuditUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NoteAuditUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteForAudit"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteForAudit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}}]}}]} as unknown as DocumentNode<NoteAuditUpdatesSubscription, NoteAuditUpdatesSubscriptionVariables>;
export const ImportantNoteChangesUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ImportantNoteChangesUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isImportant"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImportantNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImportantNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteListItem"}}]}}]} as unknown as DocumentNode<ImportantNoteChangesUpdatesSubscription, ImportantNoteChangesUpdatesSubscriptionVariables>;
export const LogAuditEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogAuditEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogsInsertInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"insertAuditLogsOne"},"name":{"kind":"Name","value":"insertAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}}]}}]}}]} as unknown as DocumentNode<LogAuditEventMutation, LogAuditEventMutationVariables>;
export const RefreshDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]} as unknown as DocumentNode<RefreshDataMutation, RefreshDataMutationVariables>;
export const GetDashboardMetricsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDashboardMetrics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"active"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"activePayrollsAggregate"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"Completed","block":false},{"kind":"StringValue","value":"Failed","block":false}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"totalEmployeesAggregate"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sum"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"upcomingPayrolls"},"name":{"kind":"Name","value":"payrolls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"Completed","block":false},{"kind":"StringValue","value":"Failed","block":false},{"kind":"StringValue","value":"Cancelled","block":false}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientMinimal"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<GetDashboardMetricsQuery, GetDashboardMetricsQueryVariables>;
export const GetDashboardStatsOptimizedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDashboardStatsOptimized"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientsAggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"totalPayrolls"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"activePayrolls"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"Active","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"processingPayrolls"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"Processing","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"upcomingPayrolls"},"name":{"kind":"Name","value":"payrolls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"Active","block":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetDashboardStatsOptimizedQuery, GetDashboardStatsOptimizedQueryVariables>;
export const GetClientsDashboardStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetClientsDashboardStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"activeClientsCount"},"name":{"kind":"Name","value":"clientsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"active"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sum"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"clientsNeedingAttention"},"name":{"kind":"Name","value":"clients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"active"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_not"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"payrolls"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<GetClientsDashboardStatsQuery, GetClientsDashboardStatsQueryVariables>;
export const GetCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"userById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserProfile"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCoreShared"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCoreShared"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserWithRole"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBasic"}},{"kind":"Field","name":{"kind":"Name","value":"assignedRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignedRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserProfile"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserWithRole"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"clerkUserId"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"isStaff"}},{"kind":"Field","name":{"kind":"Name","value":"managerId"}},{"kind":"Field","name":{"kind":"Name","value":"deactivatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deactivatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"managerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}}]}}]} as unknown as DocumentNode<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetUsersForDropdownDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsersForDropdown"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"user_role"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isActive"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"role"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"ASC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<GetUsersForDropdownQuery, GetUsersForDropdownQueryVariables>;
export const GetSystemHealthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemHealth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"databaseHealth"},"name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"recentActivity"},"name":{"kind":"Name","value":"auditLogsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"StringValue","value":"now() - interval '1 hour'","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetSystemHealthQuery, GetSystemHealthQueryVariables>;
export const GlobalSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GlobalSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"contactEmail"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientMinimal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payrolls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"client"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientMinimal"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<GlobalSearchQuery, GlobalSearchQueryVariables>;
export const RecentActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"RecentActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"StringValue","value":"now() - interval '5 minutes'","block":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<RecentActivitySubscription, RecentActivitySubscriptionVariables>;
export const AuthenticationEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"AuthenticationEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"StringValue","value":"now() - interval '10 minutes'","block":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthEvent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"authEvents"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<AuthenticationEventsSubscription, AuthenticationEventsSubscriptionVariables>;
export const SensitiveDataAccessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"SensitiveDataAccess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataAccessLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"StringValue","value":"now() - interval '10 minutes'","block":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DataAccessLog"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataAccessLog"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"dataAccessLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}},{"kind":"Field","name":{"kind":"Name","value":"fieldsAccessed"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<SensitiveDataAccessSubscription, SensitiveDataAccessSubscriptionVariables>;
export const PermissionChangeStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"PermissionChangeStream"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionChanges"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"changedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PermissionChange"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionChange"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"permissionChanges"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"changeType"}},{"kind":"Field","name":{"kind":"Name","value":"permissionType"}},{"kind":"Field","name":{"kind":"Name","value":"oldPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"newPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}}]}}]} as unknown as DocumentNode<PermissionChangeStreamSubscription, PermissionChangeStreamSubscriptionVariables>;