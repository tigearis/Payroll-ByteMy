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
 * Generated: 2025-06-29T05:55:23.194Z
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
  user_status_enum: { input: any; output: any; }
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

/** columns and relationships of "billing_invoice_item" */
export type BillingInvoiceItem = {
  __typename?: 'BillingInvoiceItem';
  amount?: Maybe<Scalars['numeric']['output']>;
  /** An object relationship */
  billingInvoice: BillingInvoice;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  invoiceId: Scalars['uuid']['output'];
  quantity: Scalars['Int']['output'];
  unitPrice: Scalars['numeric']['output'];
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "billing_invoice_item" */
export type BillingInvoiceItemAggregate = {
  __typename?: 'BillingInvoiceItemAggregate';
  aggregate?: Maybe<BillingInvoiceItemAggregateFields>;
  nodes: Array<BillingInvoiceItem>;
};

export type BillingInvoiceItemAggregateBoolExp = {
  count?: InputMaybe<BillingInvoiceItemAggregateBoolExpCount>;
};

/** aggregate fields of "billing_invoice_item" */
export type BillingInvoiceItemAggregateFields = {
  __typename?: 'BillingInvoiceItemAggregateFields';
  avg?: Maybe<BillingInvoiceItemAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<BillingInvoiceItemMaxFields>;
  min?: Maybe<BillingInvoiceItemMinFields>;
  stddev?: Maybe<BillingInvoiceItemStddevFields>;
  stddevPop?: Maybe<BillingInvoiceItemStddevPopFields>;
  stddevSamp?: Maybe<BillingInvoiceItemStddevSampFields>;
  sum?: Maybe<BillingInvoiceItemSumFields>;
  varPop?: Maybe<BillingInvoiceItemVarPopFields>;
  varSamp?: Maybe<BillingInvoiceItemVarSampFields>;
  variance?: Maybe<BillingInvoiceItemVarianceFields>;
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

/** aggregate avg on columns */
export type BillingInvoiceItemAvgFields = {
  __typename?: 'BillingInvoiceItemAvgFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
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

/** aggregate max on columns */
export type BillingInvoiceItemMaxFields = {
  __typename?: 'BillingInvoiceItemMaxFields';
  amount?: Maybe<Scalars['numeric']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  invoiceId?: Maybe<Scalars['uuid']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  unitPrice?: Maybe<Scalars['numeric']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
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

/** aggregate min on columns */
export type BillingInvoiceItemMinFields = {
  __typename?: 'BillingInvoiceItemMinFields';
  amount?: Maybe<Scalars['numeric']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  invoiceId?: Maybe<Scalars['uuid']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  unitPrice?: Maybe<Scalars['numeric']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
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

/** response of any mutation on the table "billing_invoice_item" */
export type BillingInvoiceItemMutationResponse = {
  __typename?: 'BillingInvoiceItemMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BillingInvoiceItem>;
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

/** aggregate stddev on columns */
export type BillingInvoiceItemStddevFields = {
  __typename?: 'BillingInvoiceItemStddevFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemStddevOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** aggregate stddevPop on columns */
export type BillingInvoiceItemStddevPopFields = {
  __typename?: 'BillingInvoiceItemStddevPopFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevPop() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemStddevPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** aggregate stddevSamp on columns */
export type BillingInvoiceItemStddevSampFields = {
  __typename?: 'BillingInvoiceItemStddevSampFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
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

/** aggregate sum on columns */
export type BillingInvoiceItemSumFields = {
  __typename?: 'BillingInvoiceItemSumFields';
  amount?: Maybe<Scalars['numeric']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  unitPrice?: Maybe<Scalars['numeric']['output']>;
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

/** aggregate varPop on columns */
export type BillingInvoiceItemVarPopFields = {
  __typename?: 'BillingInvoiceItemVarPopFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by varPop() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemVarPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** aggregate varSamp on columns */
export type BillingInvoiceItemVarSampFields = {
  __typename?: 'BillingInvoiceItemVarSampFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by varSamp() on columns of table "billing_invoice_item" */
export type BillingInvoiceItemVarSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type BillingInvoiceItemVarianceFields = {
  __typename?: 'BillingInvoiceItemVarianceFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
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
export type _Entity = AdjustmentRules | AppSettings | AuditLogs | AuthEvents | BillingEventLogs | BillingInvoice | BillingItems | BillingPlans | ClientBillingAssignments | ClientExternalSystems | Clients | DataAccessLogs | ExternalSystems | FeatureFlags | Holidays | LatestPayrollVersionResults | Leave | Notes | PayrollActivationResults | PayrollAssignmentAudits | PayrollAssignments | PayrollCycles | PayrollDateTypes | PayrollDates | PayrollVersionHistoryResults | PayrollVersionResults | Payrolls | PermissionAuditLogs | PermissionChanges | PermissionOverrides | Permissions | Resources | RolePermissions | Roles | SlowQueries | UserInvitations | UserRoles | Users | WorkSchedules;

export type _Service = {
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

/** columns and relationships of "billing_event_log" */
export type BillingEventLogs = {
  __typename?: 'billingEventLogs';
  /** An object relationship */
  billingInvoice?: Maybe<BillingInvoice>;
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

/** columns and relationships of "billing_invoice" */
export type BillingInvoice = {
  __typename?: 'billingInvoice';
  /** An array relationship */
  billingEventLogs: Array<BillingEventLogs>;
  /** An aggregate relationship */
  billingEventLogsAggregate: BillingEventLogsAggregate;
  /** An array relationship */
  billingInvoiceItems: Array<BillingInvoiceItem>;
  /** An aggregate relationship */
  billingInvoiceItemsAggregate: BillingInvoiceItemAggregate;
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


/** columns and relationships of "billing_invoice" */
export type BillingInvoiceBillingInvoiceItemsArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


/** columns and relationships of "billing_invoice" */
export type BillingInvoiceBillingInvoiceItemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
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
export type ClientsBilling_InvoicesArgs = {
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

/** mutation root */
export type Mutation_Root = {
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
  /** delete data from the table: "billing_invoice_item" */
  deleteBillingInvoiceItem?: Maybe<BillingInvoiceItemMutationResponse>;
  /** delete single row from the table: "billing_invoice_item" */
  deleteBillingInvoiceItemByPk?: Maybe<BillingInvoiceItem>;
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
  /** insert data into the table: "billing_invoice_item" */
  insertBillingInvoiceItem?: Maybe<BillingInvoiceItemMutationResponse>;
  /** insert a single row into the table: "billing_invoice_item" */
  insertBillingInvoiceItemOne?: Maybe<BillingInvoiceItem>;
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
  /** update data of the table: "billing_invoice_item" */
  updateBillingInvoiceItem?: Maybe<BillingInvoiceItemMutationResponse>;
  /** update single row of the table: "billing_invoice_item" */
  updateBillingInvoiceItemByPk?: Maybe<BillingInvoiceItem>;
  /** update multiples rows of table: "billing_invoice_item" */
  updateBillingInvoiceItemMany?: Maybe<Array<Maybe<BillingInvoiceItemMutationResponse>>>;
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
export type Mutation_RootBulkDeleteAdjustmentRulesArgs = {
  where: AdjustmentRulesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteAppSettingsArgs = {
  where: AppSettingsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteAuditLogsArgs = {
  where: AuditLogsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteAuthEventsArgs = {
  where: AuthEventsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteBillingEventLogsArgs = {
  where: BillingEventLogsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteBillingInvoiceArgs = {
  where: BillingInvoiceBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteBillingItemsArgs = {
  where: BillingItemsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteBillingPlansArgs = {
  where: BillingPlansBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteClientBillingAssignmentsArgs = {
  where: ClientBillingAssignmentsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteClientExternalSystemsArgs = {
  where: ClientExternalSystemsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteClientsArgs = {
  where: ClientsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteDataAccessLogsArgs = {
  where: DataAccessLogsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteExternalSystemsArgs = {
  where: ExternalSystemsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteFeatureFlagsArgs = {
  where: FeatureFlagsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteHolidaysArgs = {
  where: HolidaysBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteLatestPayrollVersionResultsArgs = {
  where: LatestPayrollVersionResultsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteLeaveArgs = {
  where: LeaveBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteNotesArgs = {
  where: NotesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeletePayrollActivationResultsArgs = {
  where: PayrollActivationResultsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeletePayrollAssignmentAuditsArgs = {
  where: PayrollAssignmentAuditsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeletePayrollAssignmentsArgs = {
  where: PayrollAssignmentsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeletePayrollCyclesArgs = {
  where: PayrollCyclesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeletePayrollDateTypesArgs = {
  where: PayrollDateTypesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeletePayrollDatesArgs = {
  where: PayrollDatesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeletePayrollVersionHistoryResultsArgs = {
  where: PayrollVersionHistoryResultsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeletePayrollVersionResultsArgs = {
  where: PayrollVersionResultsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeletePayrollsArgs = {
  where: PayrollsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeletePermissionAuditLogsArgs = {
  where: PermissionAuditLogsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeletePermissionChangesArgs = {
  where: PermissionChangesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeletePermissionOverridesArgs = {
  where: PermissionOverridesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeletePermissionsArgs = {
  where: PermissionsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteResourcesArgs = {
  where: ResourcesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteRolePermissionsArgs = {
  where: RolePermissionsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteRolesArgs = {
  where: RolesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteSlowQueriesArgs = {
  where: SlowQueriesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteUserAccessSummariesArgs = {
  where: UserAccessSummariesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteUserInvitationsArgs = {
  where: UserInvitationsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteUserRolesArgs = {
  where: UserRolesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteUsersArgs = {
  where: UsersBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteUsersRoleBackupsArgs = {
  where: UsersRoleBackupBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteUsersSyncArgs = {
  where: AuthUsersSyncBoolExp;
};


/** mutation root */
export type Mutation_RootBulkDeleteWorkSchedulesArgs = {
  where: WorkSchedulesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkInsertAdjustmentRulesArgs = {
  objects: Array<AdjustmentRulesInsertInput>;
  onConflict?: InputMaybe<AdjustmentRulesOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertAppSettingsArgs = {
  objects: Array<AppSettingsInsertInput>;
  onConflict?: InputMaybe<AppSettingsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertAuditLogsArgs = {
  objects: Array<AuditLogsInsertInput>;
  onConflict?: InputMaybe<AuditLogsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertAuthEventsArgs = {
  objects: Array<AuthEventsInsertInput>;
  onConflict?: InputMaybe<AuthEventsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertBillingEventLogsArgs = {
  objects: Array<BillingEventLogsInsertInput>;
  onConflict?: InputMaybe<BillingEventLogsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertBillingInvoiceArgs = {
  objects: Array<BillingInvoiceInsertInput>;
  onConflict?: InputMaybe<BillingInvoiceOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertBillingItemsArgs = {
  objects: Array<BillingItemsInsertInput>;
  onConflict?: InputMaybe<BillingItemsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertBillingPlansArgs = {
  objects: Array<BillingPlansInsertInput>;
  onConflict?: InputMaybe<BillingPlansOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertClientBillingAssignmentsArgs = {
  objects: Array<ClientBillingAssignmentsInsertInput>;
  onConflict?: InputMaybe<ClientBillingAssignmentsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertClientExternalSystemsArgs = {
  objects: Array<ClientExternalSystemsInsertInput>;
  onConflict?: InputMaybe<ClientExternalSystemsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertClientsArgs = {
  objects: Array<ClientsInsertInput>;
  onConflict?: InputMaybe<ClientsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertDataAccessLogsArgs = {
  objects: Array<DataAccessLogsInsertInput>;
  onConflict?: InputMaybe<DataAccessLogsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertExternalSystemsArgs = {
  objects: Array<ExternalSystemsInsertInput>;
  onConflict?: InputMaybe<ExternalSystemsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertFeatureFlagsArgs = {
  objects: Array<FeatureFlagsInsertInput>;
  onConflict?: InputMaybe<FeatureFlagsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertHolidaysArgs = {
  objects: Array<HolidaysInsertInput>;
  onConflict?: InputMaybe<HolidaysOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertLatestPayrollVersionResultsArgs = {
  objects: Array<LatestPayrollVersionResultsInsertInput>;
  onConflict?: InputMaybe<LatestPayrollVersionResultsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertLeaveArgs = {
  objects: Array<LeaveInsertInput>;
  onConflict?: InputMaybe<LeaveOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertNotesArgs = {
  objects: Array<NotesInsertInput>;
  onConflict?: InputMaybe<NotesOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertPayrollActivationResultsArgs = {
  objects: Array<PayrollActivationResultsInsertInput>;
  onConflict?: InputMaybe<PayrollActivationResultsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertPayrollAssignmentAuditsArgs = {
  objects: Array<PayrollAssignmentAuditsInsertInput>;
  onConflict?: InputMaybe<PayrollAssignmentAuditsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertPayrollAssignmentsArgs = {
  objects: Array<PayrollAssignmentsInsertInput>;
  onConflict?: InputMaybe<PayrollAssignmentsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertPayrollCyclesArgs = {
  objects: Array<PayrollCyclesInsertInput>;
  onConflict?: InputMaybe<PayrollCyclesOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertPayrollDateTypesArgs = {
  objects: Array<PayrollDateTypesInsertInput>;
  onConflict?: InputMaybe<PayrollDateTypesOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertPayrollDatesArgs = {
  objects: Array<PayrollDatesInsertInput>;
  onConflict?: InputMaybe<PayrollDatesOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertPayrollVersionHistoryResultsArgs = {
  objects: Array<PayrollVersionHistoryResultsInsertInput>;
  onConflict?: InputMaybe<PayrollVersionHistoryResultsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertPayrollVersionResultsArgs = {
  objects: Array<PayrollVersionResultsInsertInput>;
  onConflict?: InputMaybe<PayrollVersionResultsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertPayrollsArgs = {
  objects: Array<PayrollsInsertInput>;
  onConflict?: InputMaybe<PayrollsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertPermissionAuditLogsArgs = {
  objects: Array<PermissionAuditLogsInsertInput>;
  onConflict?: InputMaybe<PermissionAuditLogsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertPermissionChangesArgs = {
  objects: Array<PermissionChangesInsertInput>;
  onConflict?: InputMaybe<PermissionChangesOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertPermissionOverridesArgs = {
  objects: Array<PermissionOverridesInsertInput>;
  onConflict?: InputMaybe<PermissionOverridesOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertPermissionsArgs = {
  objects: Array<PermissionsInsertInput>;
  onConflict?: InputMaybe<PermissionsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertResourcesArgs = {
  objects: Array<ResourcesInsertInput>;
  onConflict?: InputMaybe<ResourcesOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertRolePermissionsArgs = {
  objects: Array<RolePermissionsInsertInput>;
  onConflict?: InputMaybe<RolePermissionsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertRolesArgs = {
  objects: Array<RolesInsertInput>;
  onConflict?: InputMaybe<RolesOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertSlowQueriesArgs = {
  objects: Array<SlowQueriesInsertInput>;
  onConflict?: InputMaybe<SlowQueriesOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertUserAccessSummariesArgs = {
  objects: Array<UserAccessSummariesInsertInput>;
};


/** mutation root */
export type Mutation_RootBulkInsertUserInvitationsArgs = {
  objects: Array<UserInvitationsInsertInput>;
  onConflict?: InputMaybe<UserInvitationsOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertUserRolesArgs = {
  objects: Array<UserRolesInsertInput>;
  onConflict?: InputMaybe<UserRolesOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertUsersArgs = {
  objects: Array<UsersInsertInput>;
  onConflict?: InputMaybe<UsersOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertUsersRoleBackupsArgs = {
  objects: Array<UsersRoleBackupInsertInput>;
};


/** mutation root */
export type Mutation_RootBulkInsertUsersSyncArgs = {
  objects: Array<AuthUsersSyncInsertInput>;
  onConflict?: InputMaybe<AuthUsersSyncOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkInsertWorkSchedulesArgs = {
  objects: Array<WorkSchedulesInsertInput>;
  onConflict?: InputMaybe<WorkSchedulesOnConflict>;
};


/** mutation root */
export type Mutation_RootBulkUpdateAdjustmentRulesArgs = {
  _set?: InputMaybe<AdjustmentRulesSetInput>;
  where: AdjustmentRulesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateAppSettingsArgs = {
  _append?: InputMaybe<AppSettingsAppendInput>;
  _deleteAtPath?: InputMaybe<AppSettingsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<AppSettingsDeleteElemInput>;
  _deleteKey?: InputMaybe<AppSettingsDeleteKeyInput>;
  _prepend?: InputMaybe<AppSettingsPrependInput>;
  _set?: InputMaybe<AppSettingsSetInput>;
  where: AppSettingsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateAuditLogsArgs = {
  _append?: InputMaybe<AuditLogsAppendInput>;
  _deleteAtPath?: InputMaybe<AuditLogsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<AuditLogsDeleteElemInput>;
  _deleteKey?: InputMaybe<AuditLogsDeleteKeyInput>;
  _prepend?: InputMaybe<AuditLogsPrependInput>;
  _set?: InputMaybe<AuditLogsSetInput>;
  where: AuditLogsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateAuthEventsArgs = {
  _append?: InputMaybe<AuthEventsAppendInput>;
  _deleteAtPath?: InputMaybe<AuthEventsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<AuthEventsDeleteElemInput>;
  _deleteKey?: InputMaybe<AuthEventsDeleteKeyInput>;
  _prepend?: InputMaybe<AuthEventsPrependInput>;
  _set?: InputMaybe<AuthEventsSetInput>;
  where: AuthEventsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateBillingEventLogsArgs = {
  _set?: InputMaybe<BillingEventLogsSetInput>;
  where: BillingEventLogsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateBillingInvoiceArgs = {
  _inc?: InputMaybe<BillingInvoiceIncInput>;
  _set?: InputMaybe<BillingInvoiceSetInput>;
  where: BillingInvoiceBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateBillingItemsArgs = {
  _inc?: InputMaybe<BillingItemsIncInput>;
  _set?: InputMaybe<BillingItemsSetInput>;
  where: BillingItemsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateBillingPlansArgs = {
  _inc?: InputMaybe<BillingPlansIncInput>;
  _set?: InputMaybe<BillingPlansSetInput>;
  where: BillingPlansBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateClientBillingAssignmentsArgs = {
  _set?: InputMaybe<ClientBillingAssignmentsSetInput>;
  where: ClientBillingAssignmentsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateClientExternalSystemsArgs = {
  _set?: InputMaybe<ClientExternalSystemsSetInput>;
  where: ClientExternalSystemsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateClientsArgs = {
  _set?: InputMaybe<ClientsSetInput>;
  where: ClientsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateDataAccessLogsArgs = {
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
export type Mutation_RootBulkUpdateExternalSystemsArgs = {
  _set?: InputMaybe<ExternalSystemsSetInput>;
  where: ExternalSystemsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateFeatureFlagsArgs = {
  _append?: InputMaybe<FeatureFlagsAppendInput>;
  _deleteAtPath?: InputMaybe<FeatureFlagsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<FeatureFlagsDeleteElemInput>;
  _deleteKey?: InputMaybe<FeatureFlagsDeleteKeyInput>;
  _prepend?: InputMaybe<FeatureFlagsPrependInput>;
  _set?: InputMaybe<FeatureFlagsSetInput>;
  where: FeatureFlagsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateHolidaysArgs = {
  _inc?: InputMaybe<HolidaysIncInput>;
  _set?: InputMaybe<HolidaysSetInput>;
  where: HolidaysBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateLatestPayrollVersionResultsArgs = {
  _inc?: InputMaybe<LatestPayrollVersionResultsIncInput>;
  _set?: InputMaybe<LatestPayrollVersionResultsSetInput>;
  where: LatestPayrollVersionResultsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateLeaveArgs = {
  _set?: InputMaybe<LeaveSetInput>;
  where: LeaveBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateNotesArgs = {
  _set?: InputMaybe<NotesSetInput>;
  where: NotesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdatePayrollActivationResultsArgs = {
  _inc?: InputMaybe<PayrollActivationResultsIncInput>;
  _set?: InputMaybe<PayrollActivationResultsSetInput>;
  where: PayrollActivationResultsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdatePayrollAssignmentAuditsArgs = {
  _set?: InputMaybe<PayrollAssignmentAuditsSetInput>;
  where: PayrollAssignmentAuditsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdatePayrollAssignmentsArgs = {
  _set?: InputMaybe<PayrollAssignmentsSetInput>;
  where: PayrollAssignmentsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdatePayrollCyclesArgs = {
  _set?: InputMaybe<PayrollCyclesSetInput>;
  where: PayrollCyclesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdatePayrollDateTypesArgs = {
  _set?: InputMaybe<PayrollDateTypesSetInput>;
  where: PayrollDateTypesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdatePayrollDatesArgs = {
  _set?: InputMaybe<PayrollDatesSetInput>;
  where: PayrollDatesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdatePayrollVersionHistoryResultsArgs = {
  _inc?: InputMaybe<PayrollVersionHistoryResultsIncInput>;
  _set?: InputMaybe<PayrollVersionHistoryResultsSetInput>;
  where: PayrollVersionHistoryResultsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdatePayrollVersionResultsArgs = {
  _inc?: InputMaybe<PayrollVersionResultsIncInput>;
  _set?: InputMaybe<PayrollVersionResultsSetInput>;
  where: PayrollVersionResultsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdatePayrollsArgs = {
  _inc?: InputMaybe<PayrollsIncInput>;
  _set?: InputMaybe<PayrollsSetInput>;
  where: PayrollsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdatePermissionAuditLogsArgs = {
  _append?: InputMaybe<PermissionAuditLogsAppendInput>;
  _deleteAtPath?: InputMaybe<PermissionAuditLogsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<PermissionAuditLogsDeleteElemInput>;
  _deleteKey?: InputMaybe<PermissionAuditLogsDeleteKeyInput>;
  _prepend?: InputMaybe<PermissionAuditLogsPrependInput>;
  _set?: InputMaybe<PermissionAuditLogsSetInput>;
  where: PermissionAuditLogsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdatePermissionChangesArgs = {
  _append?: InputMaybe<PermissionChangesAppendInput>;
  _deleteAtPath?: InputMaybe<PermissionChangesDeleteAtPathInput>;
  _deleteElem?: InputMaybe<PermissionChangesDeleteElemInput>;
  _deleteKey?: InputMaybe<PermissionChangesDeleteKeyInput>;
  _prepend?: InputMaybe<PermissionChangesPrependInput>;
  _set?: InputMaybe<PermissionChangesSetInput>;
  where: PermissionChangesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdatePermissionOverridesArgs = {
  _append?: InputMaybe<PermissionOverridesAppendInput>;
  _deleteAtPath?: InputMaybe<PermissionOverridesDeleteAtPathInput>;
  _deleteElem?: InputMaybe<PermissionOverridesDeleteElemInput>;
  _deleteKey?: InputMaybe<PermissionOverridesDeleteKeyInput>;
  _prepend?: InputMaybe<PermissionOverridesPrependInput>;
  _set?: InputMaybe<PermissionOverridesSetInput>;
  where: PermissionOverridesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdatePermissionsArgs = {
  _set?: InputMaybe<PermissionsSetInput>;
  where: PermissionsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateResourcesArgs = {
  _set?: InputMaybe<ResourcesSetInput>;
  where: ResourcesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateRolePermissionsArgs = {
  _append?: InputMaybe<RolePermissionsAppendInput>;
  _deleteAtPath?: InputMaybe<RolePermissionsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<RolePermissionsDeleteElemInput>;
  _deleteKey?: InputMaybe<RolePermissionsDeleteKeyInput>;
  _prepend?: InputMaybe<RolePermissionsPrependInput>;
  _set?: InputMaybe<RolePermissionsSetInput>;
  where: RolePermissionsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateRolesArgs = {
  _inc?: InputMaybe<RolesIncInput>;
  _set?: InputMaybe<RolesSetInput>;
  where: RolesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateSlowQueriesArgs = {
  _set?: InputMaybe<SlowQueriesSetInput>;
  where: SlowQueriesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateUserAccessSummariesArgs = {
  _set?: InputMaybe<UserAccessSummariesSetInput>;
  where: UserAccessSummariesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateUserInvitationsArgs = {
  _append?: InputMaybe<UserInvitationsAppendInput>;
  _deleteAtPath?: InputMaybe<UserInvitationsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<UserInvitationsDeleteElemInput>;
  _deleteKey?: InputMaybe<UserInvitationsDeleteKeyInput>;
  _prepend?: InputMaybe<UserInvitationsPrependInput>;
  _set?: InputMaybe<UserInvitationsSetInput>;
  where: UserInvitationsBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateUserRolesArgs = {
  _set?: InputMaybe<UserRolesSetInput>;
  where: UserRolesBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateUsersArgs = {
  _set?: InputMaybe<UsersSetInput>;
  where: UsersBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateUsersRoleBackupsArgs = {
  _set?: InputMaybe<UsersRoleBackupSetInput>;
  where: UsersRoleBackupBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateUsersSyncArgs = {
  _append?: InputMaybe<AuthUsersSyncAppendInput>;
  _deleteAtPath?: InputMaybe<AuthUsersSyncDeleteAtPathInput>;
  _deleteElem?: InputMaybe<AuthUsersSyncDeleteElemInput>;
  _deleteKey?: InputMaybe<AuthUsersSyncDeleteKeyInput>;
  _prepend?: InputMaybe<AuthUsersSyncPrependInput>;
  _set?: InputMaybe<AuthUsersSyncSetInput>;
  where: AuthUsersSyncBoolExp;
};


/** mutation root */
export type Mutation_RootBulkUpdateWorkSchedulesArgs = {
  _inc?: InputMaybe<WorkSchedulesIncInput>;
  _set?: InputMaybe<WorkSchedulesSetInput>;
  where: WorkSchedulesBoolExp;
};


/** mutation root */
export type Mutation_RootCheckSuspiciousActivityArgs = {
  timeWindow?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};


/** mutation root */
export type Mutation_RootCommitPayrollAssignmentsArgs = {
  changes: Array<PayrollAssignmentInput>;
};


/** mutation root */
export type Mutation_RootDeleteAdjustmentRuleByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteAppSettingByIdArgs = {
  id: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDeleteAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteAuthEventByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteBillingEventLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteBillingInvoiceByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteBillingInvoiceItemArgs = {
  where: BillingInvoiceItemBoolExp;
};


/** mutation root */
export type Mutation_RootDeleteBillingInvoiceItemByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteBillingItemByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteBillingPlanByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteClientBillingAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteClientByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteClientExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteDataAccessLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteFeatureFlagByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteHolidayByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteLatestPayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteLeaveByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteNoteByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeletePayrollActivationResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeletePayrollAssignmentAuditByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeletePayrollAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeletePayrollByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeletePayrollCycleByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeletePayrollDateByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeletePayrollDateTypeByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeletePayrollVersionHistoryResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeletePayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeletePermissionAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeletePermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeletePermissionChangeByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeletePermissionOverrideByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteResourceByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteRolePermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteSlowQueryByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteUserByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteUserInvitationByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteUserRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteUserSyncByIdArgs = {
  id: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDeleteWorkScheduleByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootGenerateComplianceReportArgs = {
  input: ComplianceReportInput;
};


/** mutation root */
export type Mutation_RootInsertAdjustmentRuleArgs = {
  object: AdjustmentRulesInsertInput;
  onConflict?: InputMaybe<AdjustmentRulesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertAppSettingArgs = {
  object: AppSettingsInsertInput;
  onConflict?: InputMaybe<AppSettingsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertAuditLogArgs = {
  object: AuditLogsInsertInput;
  onConflict?: InputMaybe<AuditLogsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthEventArgs = {
  object: AuthEventsInsertInput;
  onConflict?: InputMaybe<AuthEventsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertBillingEventLogArgs = {
  object: BillingEventLogsInsertInput;
  onConflict?: InputMaybe<BillingEventLogsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertBillingInvoiceArgs = {
  object: BillingInvoiceInsertInput;
  onConflict?: InputMaybe<BillingInvoiceOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertBillingInvoiceItemArgs = {
  objects: Array<BillingInvoiceItemInsertInput>;
  onConflict?: InputMaybe<BillingInvoiceItemOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertBillingInvoiceItemOneArgs = {
  object: BillingInvoiceItemInsertInput;
  onConflict?: InputMaybe<BillingInvoiceItemOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertBillingItemArgs = {
  object: BillingItemsInsertInput;
  onConflict?: InputMaybe<BillingItemsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertBillingPlanArgs = {
  object: BillingPlansInsertInput;
  onConflict?: InputMaybe<BillingPlansOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertClientArgs = {
  object: ClientsInsertInput;
  onConflict?: InputMaybe<ClientsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertClientBillingAssignmentArgs = {
  object: ClientBillingAssignmentsInsertInput;
  onConflict?: InputMaybe<ClientBillingAssignmentsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertClientExternalSystemArgs = {
  object: ClientExternalSystemsInsertInput;
  onConflict?: InputMaybe<ClientExternalSystemsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertDataAccessLogArgs = {
  object: DataAccessLogsInsertInput;
  onConflict?: InputMaybe<DataAccessLogsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertExternalSystemArgs = {
  object: ExternalSystemsInsertInput;
  onConflict?: InputMaybe<ExternalSystemsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertFeatureFlagArgs = {
  object: FeatureFlagsInsertInput;
  onConflict?: InputMaybe<FeatureFlagsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertHolidayArgs = {
  object: HolidaysInsertInput;
  onConflict?: InputMaybe<HolidaysOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertLatestPayrollVersionResultArgs = {
  object: LatestPayrollVersionResultsInsertInput;
  onConflict?: InputMaybe<LatestPayrollVersionResultsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertLeaveArgs = {
  object: LeaveInsertInput;
  onConflict?: InputMaybe<LeaveOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertNoteArgs = {
  object: NotesInsertInput;
  onConflict?: InputMaybe<NotesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertPayrollArgs = {
  object: PayrollsInsertInput;
  onConflict?: InputMaybe<PayrollsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertPayrollActivationResultArgs = {
  object: PayrollActivationResultsInsertInput;
  onConflict?: InputMaybe<PayrollActivationResultsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertPayrollAssignmentArgs = {
  object: PayrollAssignmentsInsertInput;
  onConflict?: InputMaybe<PayrollAssignmentsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertPayrollAssignmentAuditArgs = {
  object: PayrollAssignmentAuditsInsertInput;
  onConflict?: InputMaybe<PayrollAssignmentAuditsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertPayrollCycleArgs = {
  object: PayrollCyclesInsertInput;
  onConflict?: InputMaybe<PayrollCyclesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertPayrollDateArgs = {
  object: PayrollDatesInsertInput;
  onConflict?: InputMaybe<PayrollDatesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertPayrollDateTypeArgs = {
  object: PayrollDateTypesInsertInput;
  onConflict?: InputMaybe<PayrollDateTypesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertPayrollVersionHistoryResultArgs = {
  object: PayrollVersionHistoryResultsInsertInput;
  onConflict?: InputMaybe<PayrollVersionHistoryResultsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertPayrollVersionResultArgs = {
  object: PayrollVersionResultsInsertInput;
  onConflict?: InputMaybe<PayrollVersionResultsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertPermissionArgs = {
  object: PermissionsInsertInput;
  onConflict?: InputMaybe<PermissionsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertPermissionAuditLogArgs = {
  object: PermissionAuditLogsInsertInput;
  onConflict?: InputMaybe<PermissionAuditLogsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertPermissionChangeArgs = {
  object: PermissionChangesInsertInput;
  onConflict?: InputMaybe<PermissionChangesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertPermissionOverrideArgs = {
  object: PermissionOverridesInsertInput;
  onConflict?: InputMaybe<PermissionOverridesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertResourceArgs = {
  object: ResourcesInsertInput;
  onConflict?: InputMaybe<ResourcesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertRoleArgs = {
  object: RolesInsertInput;
  onConflict?: InputMaybe<RolesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertRolePermissionArgs = {
  object: RolePermissionsInsertInput;
  onConflict?: InputMaybe<RolePermissionsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertSlowQueryArgs = {
  object: SlowQueriesInsertInput;
  onConflict?: InputMaybe<SlowQueriesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertUserArgs = {
  object: UsersInsertInput;
  onConflict?: InputMaybe<UsersOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertUserAccessSummaryArgs = {
  object: UserAccessSummariesInsertInput;
};


/** mutation root */
export type Mutation_RootInsertUserInvitationArgs = {
  object: UserInvitationsInsertInput;
  onConflict?: InputMaybe<UserInvitationsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertUserRoleArgs = {
  object: UserRolesInsertInput;
  onConflict?: InputMaybe<UserRolesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertUserSyncArgs = {
  object: AuthUsersSyncInsertInput;
  onConflict?: InputMaybe<AuthUsersSyncOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertUsersRoleBackupArgs = {
  object: UsersRoleBackupInsertInput;
};


/** mutation root */
export type Mutation_RootInsertWorkScheduleArgs = {
  object: WorkSchedulesInsertInput;
  onConflict?: InputMaybe<WorkSchedulesOnConflict>;
};


/** mutation root */
export type Mutation_RootLogAuditEventArgs = {
  event: AuditEventInput;
};


/** mutation root */
export type Mutation_RootUpdateAdjustmentRuleByIdArgs = {
  _set?: InputMaybe<AdjustmentRulesSetInput>;
  pkColumns: AdjustmentRulesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateAdjustmentRulesManyArgs = {
  updates: Array<AdjustmentRulesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateAppSettingByIdArgs = {
  _append?: InputMaybe<AppSettingsAppendInput>;
  _deleteAtPath?: InputMaybe<AppSettingsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<AppSettingsDeleteElemInput>;
  _deleteKey?: InputMaybe<AppSettingsDeleteKeyInput>;
  _prepend?: InputMaybe<AppSettingsPrependInput>;
  _set?: InputMaybe<AppSettingsSetInput>;
  pkColumns: AppSettingsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateAppSettingsManyArgs = {
  updates: Array<AppSettingsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateAuditLogByIdArgs = {
  _append?: InputMaybe<AuditLogsAppendInput>;
  _deleteAtPath?: InputMaybe<AuditLogsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<AuditLogsDeleteElemInput>;
  _deleteKey?: InputMaybe<AuditLogsDeleteKeyInput>;
  _prepend?: InputMaybe<AuditLogsPrependInput>;
  _set?: InputMaybe<AuditLogsSetInput>;
  pkColumns: AuditLogsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateAuditLogsManyArgs = {
  updates: Array<AuditLogsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateAuthEventByIdArgs = {
  _append?: InputMaybe<AuthEventsAppendInput>;
  _deleteAtPath?: InputMaybe<AuthEventsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<AuthEventsDeleteElemInput>;
  _deleteKey?: InputMaybe<AuthEventsDeleteKeyInput>;
  _prepend?: InputMaybe<AuthEventsPrependInput>;
  _set?: InputMaybe<AuthEventsSetInput>;
  pkColumns: AuthEventsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateAuthEventsManyArgs = {
  updates: Array<AuthEventsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateAuthUsersSyncManyArgs = {
  updates: Array<AuthUsersSyncUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateBillingEventLogByIdArgs = {
  _set?: InputMaybe<BillingEventLogsSetInput>;
  pkColumns: BillingEventLogsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateBillingEventLogsManyArgs = {
  updates: Array<BillingEventLogsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateBillingInvoiceByIdArgs = {
  _inc?: InputMaybe<BillingInvoiceIncInput>;
  _set?: InputMaybe<BillingInvoiceSetInput>;
  pkColumns: BillingInvoicePkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateBillingInvoiceItemArgs = {
  _inc?: InputMaybe<BillingInvoiceItemIncInput>;
  _set?: InputMaybe<BillingInvoiceItemSetInput>;
  where: BillingInvoiceItemBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateBillingInvoiceItemByPkArgs = {
  _inc?: InputMaybe<BillingInvoiceItemIncInput>;
  _set?: InputMaybe<BillingInvoiceItemSetInput>;
  pkColumns: BillingInvoiceItemPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateBillingInvoiceItemManyArgs = {
  updates: Array<BillingInvoiceItemUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateBillingInvoiceManyArgs = {
  updates: Array<BillingInvoiceUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateBillingItemByIdArgs = {
  _inc?: InputMaybe<BillingItemsIncInput>;
  _set?: InputMaybe<BillingItemsSetInput>;
  pkColumns: BillingItemsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateBillingItemsManyArgs = {
  updates: Array<BillingItemsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateBillingPlanByIdArgs = {
  _inc?: InputMaybe<BillingPlansIncInput>;
  _set?: InputMaybe<BillingPlansSetInput>;
  pkColumns: BillingPlansPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateBillingPlansManyArgs = {
  updates: Array<BillingPlansUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateClientBillingAssignmentByIdArgs = {
  _set?: InputMaybe<ClientBillingAssignmentsSetInput>;
  pkColumns: ClientBillingAssignmentsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateClientBillingAssignmentsManyArgs = {
  updates: Array<ClientBillingAssignmentsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateClientByIdArgs = {
  _set?: InputMaybe<ClientsSetInput>;
  pkColumns: ClientsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateClientExternalSystemByIdArgs = {
  _set?: InputMaybe<ClientExternalSystemsSetInput>;
  pkColumns: ClientExternalSystemsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateClientExternalSystemsManyArgs = {
  updates: Array<ClientExternalSystemsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateClientsManyArgs = {
  updates: Array<ClientsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateDataAccessLogByIdArgs = {
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
export type Mutation_RootUpdateDataAccessLogsManyArgs = {
  updates: Array<DataAccessLogsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateExternalSystemByIdArgs = {
  _set?: InputMaybe<ExternalSystemsSetInput>;
  pkColumns: ExternalSystemsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateExternalSystemsManyArgs = {
  updates: Array<ExternalSystemsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateFeatureFlagByIdArgs = {
  _append?: InputMaybe<FeatureFlagsAppendInput>;
  _deleteAtPath?: InputMaybe<FeatureFlagsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<FeatureFlagsDeleteElemInput>;
  _deleteKey?: InputMaybe<FeatureFlagsDeleteKeyInput>;
  _prepend?: InputMaybe<FeatureFlagsPrependInput>;
  _set?: InputMaybe<FeatureFlagsSetInput>;
  pkColumns: FeatureFlagsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateFeatureFlagsManyArgs = {
  updates: Array<FeatureFlagsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateHolidayByIdArgs = {
  _inc?: InputMaybe<HolidaysIncInput>;
  _set?: InputMaybe<HolidaysSetInput>;
  pkColumns: HolidaysPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateHolidaysManyArgs = {
  updates: Array<HolidaysUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateLatestPayrollVersionResultByIdArgs = {
  _inc?: InputMaybe<LatestPayrollVersionResultsIncInput>;
  _set?: InputMaybe<LatestPayrollVersionResultsSetInput>;
  pkColumns: LatestPayrollVersionResultsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateLatestPayrollVersionResultsManyArgs = {
  updates: Array<LatestPayrollVersionResultsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateLeaveByIdArgs = {
  _set?: InputMaybe<LeaveSetInput>;
  pkColumns: LeavePkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateLeaveManyArgs = {
  updates: Array<LeaveUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateNoteByIdArgs = {
  _set?: InputMaybe<NotesSetInput>;
  pkColumns: NotesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateNotesManyArgs = {
  updates: Array<NotesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdatePayrollActivationResultByIdArgs = {
  _inc?: InputMaybe<PayrollActivationResultsIncInput>;
  _set?: InputMaybe<PayrollActivationResultsSetInput>;
  pkColumns: PayrollActivationResultsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdatePayrollActivationResultsManyArgs = {
  updates: Array<PayrollActivationResultsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdatePayrollAssignmentAuditByIdArgs = {
  _set?: InputMaybe<PayrollAssignmentAuditsSetInput>;
  pkColumns: PayrollAssignmentAuditsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdatePayrollAssignmentAuditsManyArgs = {
  updates: Array<PayrollAssignmentAuditsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdatePayrollAssignmentByIdArgs = {
  _set?: InputMaybe<PayrollAssignmentsSetInput>;
  pkColumns: PayrollAssignmentsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdatePayrollAssignmentsManyArgs = {
  updates: Array<PayrollAssignmentsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdatePayrollByIdArgs = {
  _inc?: InputMaybe<PayrollsIncInput>;
  _set?: InputMaybe<PayrollsSetInput>;
  pkColumns: PayrollsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdatePayrollCycleByIdArgs = {
  _set?: InputMaybe<PayrollCyclesSetInput>;
  pkColumns: PayrollCyclesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdatePayrollCyclesManyArgs = {
  updates: Array<PayrollCyclesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdatePayrollDateByIdArgs = {
  _set?: InputMaybe<PayrollDatesSetInput>;
  pkColumns: PayrollDatesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdatePayrollDateTypeByIdArgs = {
  _set?: InputMaybe<PayrollDateTypesSetInput>;
  pkColumns: PayrollDateTypesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdatePayrollDateTypesManyArgs = {
  updates: Array<PayrollDateTypesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdatePayrollDatesManyArgs = {
  updates: Array<PayrollDatesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdatePayrollVersionHistoryResultByIdArgs = {
  _inc?: InputMaybe<PayrollVersionHistoryResultsIncInput>;
  _set?: InputMaybe<PayrollVersionHistoryResultsSetInput>;
  pkColumns: PayrollVersionHistoryResultsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdatePayrollVersionHistoryResultsManyArgs = {
  updates: Array<PayrollVersionHistoryResultsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdatePayrollVersionResultByIdArgs = {
  _inc?: InputMaybe<PayrollVersionResultsIncInput>;
  _set?: InputMaybe<PayrollVersionResultsSetInput>;
  pkColumns: PayrollVersionResultsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdatePayrollVersionResultsManyArgs = {
  updates: Array<PayrollVersionResultsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdatePayrollsManyArgs = {
  updates: Array<PayrollsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdatePermissionAuditLogByIdArgs = {
  _append?: InputMaybe<PermissionAuditLogsAppendInput>;
  _deleteAtPath?: InputMaybe<PermissionAuditLogsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<PermissionAuditLogsDeleteElemInput>;
  _deleteKey?: InputMaybe<PermissionAuditLogsDeleteKeyInput>;
  _prepend?: InputMaybe<PermissionAuditLogsPrependInput>;
  _set?: InputMaybe<PermissionAuditLogsSetInput>;
  pkColumns: PermissionAuditLogsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdatePermissionAuditLogsManyArgs = {
  updates: Array<PermissionAuditLogsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdatePermissionByIdArgs = {
  _set?: InputMaybe<PermissionsSetInput>;
  pkColumns: PermissionsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdatePermissionChangeByIdArgs = {
  _append?: InputMaybe<PermissionChangesAppendInput>;
  _deleteAtPath?: InputMaybe<PermissionChangesDeleteAtPathInput>;
  _deleteElem?: InputMaybe<PermissionChangesDeleteElemInput>;
  _deleteKey?: InputMaybe<PermissionChangesDeleteKeyInput>;
  _prepend?: InputMaybe<PermissionChangesPrependInput>;
  _set?: InputMaybe<PermissionChangesSetInput>;
  pkColumns: PermissionChangesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdatePermissionChangesManyArgs = {
  updates: Array<PermissionChangesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdatePermissionOverrideByIdArgs = {
  _append?: InputMaybe<PermissionOverridesAppendInput>;
  _deleteAtPath?: InputMaybe<PermissionOverridesDeleteAtPathInput>;
  _deleteElem?: InputMaybe<PermissionOverridesDeleteElemInput>;
  _deleteKey?: InputMaybe<PermissionOverridesDeleteKeyInput>;
  _prepend?: InputMaybe<PermissionOverridesPrependInput>;
  _set?: InputMaybe<PermissionOverridesSetInput>;
  pkColumns: PermissionOverridesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdatePermissionOverridesManyArgs = {
  updates: Array<PermissionOverridesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdatePermissionsManyArgs = {
  updates: Array<PermissionsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateResourceByIdArgs = {
  _set?: InputMaybe<ResourcesSetInput>;
  pkColumns: ResourcesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateResourcesManyArgs = {
  updates: Array<ResourcesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateRoleByIdArgs = {
  _inc?: InputMaybe<RolesIncInput>;
  _set?: InputMaybe<RolesSetInput>;
  pkColumns: RolesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateRolePermissionByIdArgs = {
  _append?: InputMaybe<RolePermissionsAppendInput>;
  _deleteAtPath?: InputMaybe<RolePermissionsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<RolePermissionsDeleteElemInput>;
  _deleteKey?: InputMaybe<RolePermissionsDeleteKeyInput>;
  _prepend?: InputMaybe<RolePermissionsPrependInput>;
  _set?: InputMaybe<RolePermissionsSetInput>;
  pkColumns: RolePermissionsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateRolePermissionsManyArgs = {
  updates: Array<RolePermissionsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateRolesManyArgs = {
  updates: Array<RolesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateSlowQueriesManyArgs = {
  updates: Array<SlowQueriesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateSlowQueryByIdArgs = {
  _set?: InputMaybe<SlowQueriesSetInput>;
  pkColumns: SlowQueriesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateUserAccessSummariesManyArgs = {
  updates: Array<UserAccessSummariesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateUserByIdArgs = {
  _set?: InputMaybe<UsersSetInput>;
  pkColumns: UsersPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateUserInvitationByIdArgs = {
  _append?: InputMaybe<UserInvitationsAppendInput>;
  _deleteAtPath?: InputMaybe<UserInvitationsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<UserInvitationsDeleteElemInput>;
  _deleteKey?: InputMaybe<UserInvitationsDeleteKeyInput>;
  _prepend?: InputMaybe<UserInvitationsPrependInput>;
  _set?: InputMaybe<UserInvitationsSetInput>;
  pkColumns: UserInvitationsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateUserInvitationsManyArgs = {
  updates: Array<UserInvitationsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateUserRoleByIdArgs = {
  _set?: InputMaybe<UserRolesSetInput>;
  pkColumns: UserRolesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateUserRolesManyArgs = {
  updates: Array<UserRolesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateUserSyncByIdArgs = {
  _append?: InputMaybe<AuthUsersSyncAppendInput>;
  _deleteAtPath?: InputMaybe<AuthUsersSyncDeleteAtPathInput>;
  _deleteElem?: InputMaybe<AuthUsersSyncDeleteElemInput>;
  _deleteKey?: InputMaybe<AuthUsersSyncDeleteKeyInput>;
  _prepend?: InputMaybe<AuthUsersSyncPrependInput>;
  _set?: InputMaybe<AuthUsersSyncSetInput>;
  pkColumns: AuthUsersSyncPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateUsersManyArgs = {
  updates: Array<UsersUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateUsersRoleBackupManyArgs = {
  updates: Array<UsersRoleBackupUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateWorkScheduleByIdArgs = {
  _inc?: InputMaybe<WorkSchedulesIncInput>;
  _set?: InputMaybe<WorkSchedulesSetInput>;
  pkColumns: WorkSchedulesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateWorkSchedulesManyArgs = {
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

export type Query_Root = {
  __typename?: 'query_root';
  /** query _Entity union */
  _entities?: Maybe<_Entity>;
  _service: _Service;
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
  /** fetch data from the table: "billing_invoice_item" */
  billingInvoiceItem: Array<BillingInvoiceItem>;
  /** fetch aggregated fields from the table: "billing_invoice_item" */
  billingInvoiceItemAggregate: BillingInvoiceItemAggregate;
  /** fetch data from the table: "billing_invoice_item" using primary key columns */
  billingInvoiceItemByPk?: Maybe<BillingInvoiceItem>;
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
  /** An array relationship */
  userInvitations: Array<UserInvitations>;
  /** An aggregate relationship */
  userInvitationsAggregate: UserInvitationsAggregate;
  /** fetch data from the table: "user_roles" using primary key columns */
  userRoleById?: Maybe<UserRoles>;
  /** fetch data from the table: "user_roles" */
  userRoles: Array<UserRoles>;
  /** fetch aggregated fields from the table: "user_roles" */
  userRolesAggregate: UserRolesAggregate;
  /** fetch data from the table: "neon_auth.users_sync" using primary key columns */
  userSyncById?: Maybe<AuthUsersSync>;
  /** An array relationship */
  users: Array<Users>;
  /** An aggregate relationship */
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


export type Query_Root_EntitiesArgs = {
  representations: Array<Scalars['_Any']['input']>;
};


export type Query_RootActivatePayrollVersionsArgs = {
  distinctOn?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type Query_RootActivatePayrollVersionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type Query_RootAdjustmentRuleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootAdjustmentRulesArgs = {
  distinctOn?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


export type Query_RootAdjustmentRulesAggregateArgs = {
  distinctOn?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


export type Query_RootAppSettingByIdArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootAppSettingsArgs = {
  distinctOn?: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AppSettingsOrderBy>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};


export type Query_RootAppSettingsAggregateArgs = {
  distinctOn?: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AppSettingsOrderBy>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};


export type Query_RootAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootAuditLogsArgs = {
  distinctOn?: InputMaybe<Array<AuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuditLogsOrderBy>>;
  where?: InputMaybe<AuditLogsBoolExp>;
};


export type Query_RootAuditLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<AuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuditLogsOrderBy>>;
  where?: InputMaybe<AuditLogsBoolExp>;
};


export type Query_RootAuthEventByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootAuthEventsArgs = {
  distinctOn?: InputMaybe<Array<AuthEventsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuthEventsOrderBy>>;
  where?: InputMaybe<AuthEventsBoolExp>;
};


export type Query_RootAuthEventsAggregateArgs = {
  distinctOn?: InputMaybe<Array<AuthEventsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuthEventsOrderBy>>;
  where?: InputMaybe<AuthEventsBoolExp>;
};


export type Query_RootBillingEventLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootBillingEventLogsArgs = {
  distinctOn?: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where?: InputMaybe<BillingEventLogsBoolExp>;
};


export type Query_RootBillingEventLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where?: InputMaybe<BillingEventLogsBoolExp>;
};


export type Query_RootBillingInvoiceArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


export type Query_RootBillingInvoiceAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


export type Query_RootBillingInvoiceByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootBillingInvoiceItemArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


export type Query_RootBillingInvoiceItemAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


export type Query_RootBillingInvoiceItemByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootBillingItemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootBillingItemsArgs = {
  distinctOn?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


export type Query_RootBillingItemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


export type Query_RootBillingPlanByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootBillingPlansArgs = {
  distinctOn?: InputMaybe<Array<BillingPlansSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingPlansOrderBy>>;
  where?: InputMaybe<BillingPlansBoolExp>;
};


export type Query_RootBillingPlansAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingPlansSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingPlansOrderBy>>;
  where?: InputMaybe<BillingPlansBoolExp>;
};


export type Query_RootClientBillingAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootClientBillingAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


export type Query_RootClientBillingAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


export type Query_RootClientByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootClientExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootClientExternalSystemsArgs = {
  distinctOn?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type Query_RootClientExternalSystemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type Query_RootClientsArgs = {
  distinctOn?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};


export type Query_RootClientsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};


export type Query_RootCreatePayrollVersionArgs = {
  args: CreatePayrollVersionArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type Query_RootCreatePayrollVersionAggregateArgs = {
  args: CreatePayrollVersionArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type Query_RootCreatePayrollVersionSimpleArgs = {
  args: CreatePayrollVersionSimpleArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type Query_RootCreatePayrollVersionSimpleAggregateArgs = {
  args: CreatePayrollVersionSimpleArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type Query_RootCurrentPayrollsArgs = {
  distinctOn?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};


export type Query_RootCurrentPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};


export type Query_RootDataAccessLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootDataAccessLogsArgs = {
  distinctOn?: InputMaybe<Array<DataAccessLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DataAccessLogsOrderBy>>;
  where?: InputMaybe<DataAccessLogsBoolExp>;
};


export type Query_RootDataAccessLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<DataAccessLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DataAccessLogsOrderBy>>;
  where?: InputMaybe<DataAccessLogsBoolExp>;
};


export type Query_RootExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootExternalSystemsArgs = {
  distinctOn?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};


export type Query_RootExternalSystemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};


export type Query_RootFeatureFlagByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootFeatureFlagsArgs = {
  distinctOn?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};


export type Query_RootFeatureFlagsAggregateArgs = {
  distinctOn?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};


export type Query_RootGeneratePayrollDatesArgs = {
  args: GeneratePayrollDatesArgs;
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type Query_RootGeneratePayrollDatesAggregateArgs = {
  args: GeneratePayrollDatesArgs;
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type Query_RootGetLatestPayrollVersionArgs = {
  args: GetLatestPayrollVersionArgs;
  distinctOn?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type Query_RootGetLatestPayrollVersionAggregateArgs = {
  args: GetLatestPayrollVersionArgs;
  distinctOn?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type Query_RootGetPayrollVersionHistoryArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type Query_RootGetPayrollVersionHistoryAggregateArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type Query_RootHolidayByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootHolidaysArgs = {
  distinctOn?: InputMaybe<Array<HolidaysSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<HolidaysOrderBy>>;
  where?: InputMaybe<HolidaysBoolExp>;
};


export type Query_RootHolidaysAggregateArgs = {
  distinctOn?: InputMaybe<Array<HolidaysSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<HolidaysOrderBy>>;
  where?: InputMaybe<HolidaysBoolExp>;
};


export type Query_RootLatestPayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootLatestPayrollVersionResultsArgs = {
  distinctOn?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type Query_RootLatestPayrollVersionResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type Query_RootLeaveArgs = {
  distinctOn?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};


export type Query_RootLeaveAggregateArgs = {
  distinctOn?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};


export type Query_RootLeaveByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootNoteByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootNotesArgs = {
  distinctOn?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};


export type Query_RootNotesAggregateArgs = {
  distinctOn?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};


export type Query_RootPayrollActivationResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootPayrollActivationResultsArgs = {
  distinctOn?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type Query_RootPayrollActivationResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type Query_RootPayrollAssignmentAuditByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootPayrollAssignmentAuditsArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


export type Query_RootPayrollAssignmentAuditsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


export type Query_RootPayrollAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootPayrollAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type Query_RootPayrollAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type Query_RootPayrollByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootPayrollCycleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootPayrollCyclesArgs = {
  distinctOn?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};


export type Query_RootPayrollCyclesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};


export type Query_RootPayrollDashboardStatsArgs = {
  distinctOn?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type Query_RootPayrollDashboardStatsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type Query_RootPayrollDateByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootPayrollDateTypeByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootPayrollDateTypesArgs = {
  distinctOn?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};


export type Query_RootPayrollDateTypesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};


export type Query_RootPayrollDatesArgs = {
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type Query_RootPayrollDatesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type Query_RootPayrollTriggersStatusArgs = {
  distinctOn?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type Query_RootPayrollTriggersStatusAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type Query_RootPayrollVersionHistoryResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootPayrollVersionHistoryResultsArgs = {
  distinctOn?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type Query_RootPayrollVersionHistoryResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type Query_RootPayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootPayrollVersionResultsArgs = {
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type Query_RootPayrollVersionResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type Query_RootPayrollsArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


export type Query_RootPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


export type Query_RootPermissionAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootPermissionAuditLogsArgs = {
  distinctOn?: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where?: InputMaybe<PermissionAuditLogsBoolExp>;
};


export type Query_RootPermissionAuditLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where?: InputMaybe<PermissionAuditLogsBoolExp>;
};


export type Query_RootPermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootPermissionChangeByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootPermissionChangesArgs = {
  distinctOn?: InputMaybe<Array<PermissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionChangesOrderBy>>;
  where?: InputMaybe<PermissionChangesBoolExp>;
};


export type Query_RootPermissionChangesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionChangesOrderBy>>;
  where?: InputMaybe<PermissionChangesBoolExp>;
};


export type Query_RootPermissionOverrideByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootPermissionOverridesArgs = {
  distinctOn?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};


export type Query_RootPermissionOverridesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};


export type Query_RootPermissionUsageReportsArgs = {
  distinctOn?: InputMaybe<Array<PermissionUsageReportsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionUsageReportsOrderBy>>;
  where?: InputMaybe<PermissionUsageReportsBoolExp>;
};


export type Query_RootPermissionUsageReportsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionUsageReportsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionUsageReportsOrderBy>>;
  where?: InputMaybe<PermissionUsageReportsBoolExp>;
};


export type Query_RootPermissionsArgs = {
  distinctOn?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};


export type Query_RootPermissionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};


export type Query_RootResourceByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootResourcesArgs = {
  distinctOn?: InputMaybe<Array<ResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ResourcesOrderBy>>;
  where?: InputMaybe<ResourcesBoolExp>;
};


export type Query_RootResourcesAggregateArgs = {
  distinctOn?: InputMaybe<Array<ResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ResourcesOrderBy>>;
  where?: InputMaybe<ResourcesBoolExp>;
};


export type Query_RootRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootRolePermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootRolePermissionsArgs = {
  distinctOn?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


export type Query_RootRolePermissionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


export type Query_RootRolesArgs = {
  distinctOn?: InputMaybe<Array<RolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolesOrderBy>>;
  where?: InputMaybe<RolesBoolExp>;
};


export type Query_RootRolesAggregateArgs = {
  distinctOn?: InputMaybe<Array<RolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolesOrderBy>>;
  where?: InputMaybe<RolesBoolExp>;
};


export type Query_RootSlowQueriesArgs = {
  distinctOn?: InputMaybe<Array<SlowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SlowQueriesOrderBy>>;
  where?: InputMaybe<SlowQueriesBoolExp>;
};


export type Query_RootSlowQueriesAggregateArgs = {
  distinctOn?: InputMaybe<Array<SlowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SlowQueriesOrderBy>>;
  where?: InputMaybe<SlowQueriesBoolExp>;
};


export type Query_RootSlowQueryByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootUserAccessSummariesArgs = {
  distinctOn?: InputMaybe<Array<UserAccessSummariesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserAccessSummariesOrderBy>>;
  where?: InputMaybe<UserAccessSummariesBoolExp>;
};


export type Query_RootUserAccessSummariesAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserAccessSummariesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserAccessSummariesOrderBy>>;
  where?: InputMaybe<UserAccessSummariesBoolExp>;
};


export type Query_RootUserByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootUserInvitationByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootUserInvitationsArgs = {
  distinctOn?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserInvitationsOrderBy>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};


export type Query_RootUserInvitationsAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserInvitationsOrderBy>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};


export type Query_RootUserRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootUserRolesArgs = {
  distinctOn?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


export type Query_RootUserRolesAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


export type Query_RootUserSyncByIdArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootUsersArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type Query_RootUsersAggregateArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type Query_RootUsersRoleBackupsArgs = {
  distinctOn?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};


export type Query_RootUsersRoleBackupsAggregateArgs = {
  distinctOn?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};


export type Query_RootUsersSyncArgs = {
  distinctOn?: InputMaybe<Array<AuthUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuthUsersSyncOrderBy>>;
  where?: InputMaybe<AuthUsersSyncBoolExp>;
};


export type Query_RootUsersSyncAggregateArgs = {
  distinctOn?: InputMaybe<Array<AuthUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuthUsersSyncOrderBy>>;
  where?: InputMaybe<AuthUsersSyncBoolExp>;
};


export type Query_RootWorkScheduleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootWorkSchedulesArgs = {
  distinctOn?: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkSchedulesOrderBy>>;
  where?: InputMaybe<WorkSchedulesBoolExp>;
};


export type Query_RootWorkSchedulesAggregateArgs = {
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

export type Subscription_Root = {
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
  /** fetch data from the table: "billing_invoice_item" */
  billingInvoiceItem: Array<BillingInvoiceItem>;
  /** fetch aggregated fields from the table: "billing_invoice_item" */
  billingInvoiceItemAggregate: BillingInvoiceItemAggregate;
  /** fetch data from the table: "billing_invoice_item" using primary key columns */
  billingInvoiceItemByPk?: Maybe<BillingInvoiceItem>;
  /** fetch data from the table in a streaming manner: "billing_invoice_item" */
  billingInvoiceItemStream: Array<BillingInvoiceItem>;
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
  /** An array relationship */
  userInvitations: Array<UserInvitations>;
  /** An aggregate relationship */
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
  /** An array relationship */
  users: Array<Users>;
  /** An aggregate relationship */
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


export type Subscription_RootActivatePayrollVersionsArgs = {
  distinctOn?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type Subscription_RootActivatePayrollVersionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type Subscription_RootAdjustmentRuleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootAdjustmentRulesArgs = {
  distinctOn?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


export type Subscription_RootAdjustmentRulesAggregateArgs = {
  distinctOn?: InputMaybe<Array<AdjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AdjustmentRulesOrderBy>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


export type Subscription_RootAdjustmentRulesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AdjustmentRulesStreamCursorInput>>;
  where?: InputMaybe<AdjustmentRulesBoolExp>;
};


export type Subscription_RootAppSettingByIdArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootAppSettingsArgs = {
  distinctOn?: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AppSettingsOrderBy>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};


export type Subscription_RootAppSettingsAggregateArgs = {
  distinctOn?: InputMaybe<Array<AppSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AppSettingsOrderBy>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};


export type Subscription_RootAppSettingsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AppSettingsStreamCursorInput>>;
  where?: InputMaybe<AppSettingsBoolExp>;
};


export type Subscription_RootAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootAuditLogsArgs = {
  distinctOn?: InputMaybe<Array<AuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuditLogsOrderBy>>;
  where?: InputMaybe<AuditLogsBoolExp>;
};


export type Subscription_RootAuditLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<AuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuditLogsOrderBy>>;
  where?: InputMaybe<AuditLogsBoolExp>;
};


export type Subscription_RootAuditLogsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuditLogsStreamCursorInput>>;
  where?: InputMaybe<AuditLogsBoolExp>;
};


export type Subscription_RootAuthEventByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootAuthEventsArgs = {
  distinctOn?: InputMaybe<Array<AuthEventsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuthEventsOrderBy>>;
  where?: InputMaybe<AuthEventsBoolExp>;
};


export type Subscription_RootAuthEventsAggregateArgs = {
  distinctOn?: InputMaybe<Array<AuthEventsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuthEventsOrderBy>>;
  where?: InputMaybe<AuthEventsBoolExp>;
};


export type Subscription_RootAuthEventsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuthEventsStreamCursorInput>>;
  where?: InputMaybe<AuthEventsBoolExp>;
};


export type Subscription_RootAuthUsersSyncStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuthUsersSyncStreamCursorInput>>;
  where?: InputMaybe<AuthUsersSyncBoolExp>;
};


export type Subscription_RootBillingEventLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootBillingEventLogsArgs = {
  distinctOn?: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where?: InputMaybe<BillingEventLogsBoolExp>;
};


export type Subscription_RootBillingEventLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingEventLogsOrderBy>>;
  where?: InputMaybe<BillingEventLogsBoolExp>;
};


export type Subscription_RootBillingEventLogsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingEventLogsStreamCursorInput>>;
  where?: InputMaybe<BillingEventLogsBoolExp>;
};


export type Subscription_RootBillingInvoiceArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


export type Subscription_RootBillingInvoiceAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceOrderBy>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


export type Subscription_RootBillingInvoiceByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootBillingInvoiceItemArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


export type Subscription_RootBillingInvoiceItemAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


export type Subscription_RootBillingInvoiceItemByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootBillingInvoiceItemStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingInvoiceItemStreamCursorInput>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


export type Subscription_RootBillingInvoiceStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingInvoiceStreamCursorInput>>;
  where?: InputMaybe<BillingInvoiceBoolExp>;
};


export type Subscription_RootBillingItemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootBillingItemsArgs = {
  distinctOn?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


export type Subscription_RootBillingItemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingItemsOrderBy>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


export type Subscription_RootBillingItemsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingItemsStreamCursorInput>>;
  where?: InputMaybe<BillingItemsBoolExp>;
};


export type Subscription_RootBillingPlanByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootBillingPlansArgs = {
  distinctOn?: InputMaybe<Array<BillingPlansSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingPlansOrderBy>>;
  where?: InputMaybe<BillingPlansBoolExp>;
};


export type Subscription_RootBillingPlansAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingPlansSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingPlansOrderBy>>;
  where?: InputMaybe<BillingPlansBoolExp>;
};


export type Subscription_RootBillingPlansStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingPlansStreamCursorInput>>;
  where?: InputMaybe<BillingPlansBoolExp>;
};


export type Subscription_RootClientBillingAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootClientBillingAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


export type Subscription_RootClientBillingAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ClientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


export type Subscription_RootClientBillingAssignmentsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ClientBillingAssignmentsStreamCursorInput>>;
  where?: InputMaybe<ClientBillingAssignmentsBoolExp>;
};


export type Subscription_RootClientByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootClientExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootClientExternalSystemsArgs = {
  distinctOn?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type Subscription_RootClientExternalSystemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ClientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientExternalSystemsOrderBy>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type Subscription_RootClientExternalSystemsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ClientExternalSystemsStreamCursorInput>>;
  where?: InputMaybe<ClientExternalSystemsBoolExp>;
};


export type Subscription_RootClientsArgs = {
  distinctOn?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};


export type Subscription_RootClientsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ClientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ClientsOrderBy>>;
  where?: InputMaybe<ClientsBoolExp>;
};


export type Subscription_RootClientsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ClientsStreamCursorInput>>;
  where?: InputMaybe<ClientsBoolExp>;
};


export type Subscription_RootCreatePayrollVersionArgs = {
  args: CreatePayrollVersionArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type Subscription_RootCreatePayrollVersionAggregateArgs = {
  args: CreatePayrollVersionArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type Subscription_RootCreatePayrollVersionSimpleArgs = {
  args: CreatePayrollVersionSimpleArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type Subscription_RootCreatePayrollVersionSimpleAggregateArgs = {
  args: CreatePayrollVersionSimpleArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type Subscription_RootCurrentPayrollsArgs = {
  distinctOn?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};


export type Subscription_RootCurrentPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<CurrentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CurrentPayrollsOrderBy>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};


export type Subscription_RootCurrentPayrollsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<CurrentPayrollsStreamCursorInput>>;
  where?: InputMaybe<CurrentPayrollsBoolExp>;
};


export type Subscription_RootDataAccessLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootDataAccessLogsArgs = {
  distinctOn?: InputMaybe<Array<DataAccessLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DataAccessLogsOrderBy>>;
  where?: InputMaybe<DataAccessLogsBoolExp>;
};


export type Subscription_RootDataAccessLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<DataAccessLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DataAccessLogsOrderBy>>;
  where?: InputMaybe<DataAccessLogsBoolExp>;
};


export type Subscription_RootDataAccessLogsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<DataAccessLogsStreamCursorInput>>;
  where?: InputMaybe<DataAccessLogsBoolExp>;
};


export type Subscription_RootExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootExternalSystemsArgs = {
  distinctOn?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};


export type Subscription_RootExternalSystemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ExternalSystemsOrderBy>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};


export type Subscription_RootExternalSystemsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ExternalSystemsStreamCursorInput>>;
  where?: InputMaybe<ExternalSystemsBoolExp>;
};


export type Subscription_RootFeatureFlagByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootFeatureFlagsArgs = {
  distinctOn?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};


export type Subscription_RootFeatureFlagsAggregateArgs = {
  distinctOn?: InputMaybe<Array<FeatureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FeatureFlagsOrderBy>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};


export type Subscription_RootFeatureFlagsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<FeatureFlagsStreamCursorInput>>;
  where?: InputMaybe<FeatureFlagsBoolExp>;
};


export type Subscription_RootGeneratePayrollDatesArgs = {
  args: GeneratePayrollDatesArgs;
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type Subscription_RootGeneratePayrollDatesAggregateArgs = {
  args: GeneratePayrollDatesArgs;
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type Subscription_RootGetLatestPayrollVersionArgs = {
  args: GetLatestPayrollVersionArgs;
  distinctOn?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type Subscription_RootGetLatestPayrollVersionAggregateArgs = {
  args: GetLatestPayrollVersionArgs;
  distinctOn?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type Subscription_RootGetPayrollVersionHistoryArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type Subscription_RootGetPayrollVersionHistoryAggregateArgs = {
  args: GetPayrollVersionHistoryArgs;
  distinctOn?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type Subscription_RootHolidayByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootHolidaysArgs = {
  distinctOn?: InputMaybe<Array<HolidaysSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<HolidaysOrderBy>>;
  where?: InputMaybe<HolidaysBoolExp>;
};


export type Subscription_RootHolidaysAggregateArgs = {
  distinctOn?: InputMaybe<Array<HolidaysSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<HolidaysOrderBy>>;
  where?: InputMaybe<HolidaysBoolExp>;
};


export type Subscription_RootHolidaysStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<HolidaysStreamCursorInput>>;
  where?: InputMaybe<HolidaysBoolExp>;
};


export type Subscription_RootLatestPayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootLatestPayrollVersionResultsArgs = {
  distinctOn?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type Subscription_RootLatestPayrollVersionResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<LatestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LatestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type Subscription_RootLatestPayrollVersionResultsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<LatestPayrollVersionResultsStreamCursorInput>>;
  where?: InputMaybe<LatestPayrollVersionResultsBoolExp>;
};


export type Subscription_RootLeaveArgs = {
  distinctOn?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};


export type Subscription_RootLeaveAggregateArgs = {
  distinctOn?: InputMaybe<Array<LeaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LeaveOrderBy>>;
  where?: InputMaybe<LeaveBoolExp>;
};


export type Subscription_RootLeaveByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootLeaveStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<LeaveStreamCursorInput>>;
  where?: InputMaybe<LeaveBoolExp>;
};


export type Subscription_RootNoteByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootNotesArgs = {
  distinctOn?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};


export type Subscription_RootNotesAggregateArgs = {
  distinctOn?: InputMaybe<Array<NotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NotesOrderBy>>;
  where?: InputMaybe<NotesBoolExp>;
};


export type Subscription_RootNotesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<NotesStreamCursorInput>>;
  where?: InputMaybe<NotesBoolExp>;
};


export type Subscription_RootPayrollActivationResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootPayrollActivationResultsArgs = {
  distinctOn?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type Subscription_RootPayrollActivationResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollActivationResultsOrderBy>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type Subscription_RootPayrollActivationResultsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollActivationResultsStreamCursorInput>>;
  where?: InputMaybe<PayrollActivationResultsBoolExp>;
};


export type Subscription_RootPayrollAssignmentAuditByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootPayrollAssignmentAuditsArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


export type Subscription_RootPayrollAssignmentAuditsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


export type Subscription_RootPayrollAssignmentAuditsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollAssignmentAuditsStreamCursorInput>>;
  where?: InputMaybe<PayrollAssignmentAuditsBoolExp>;
};


export type Subscription_RootPayrollAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootPayrollAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type Subscription_RootPayrollAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollAssignmentsOrderBy>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type Subscription_RootPayrollAssignmentsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollAssignmentsStreamCursorInput>>;
  where?: InputMaybe<PayrollAssignmentsBoolExp>;
};


export type Subscription_RootPayrollByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootPayrollCycleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootPayrollCyclesArgs = {
  distinctOn?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};


export type Subscription_RootPayrollCyclesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollCyclesOrderBy>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};


export type Subscription_RootPayrollCyclesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollCyclesStreamCursorInput>>;
  where?: InputMaybe<PayrollCyclesBoolExp>;
};


export type Subscription_RootPayrollDashboardStatsArgs = {
  distinctOn?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type Subscription_RootPayrollDashboardStatsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDashboardStatsOrderBy>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type Subscription_RootPayrollDashboardStatsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollDashboardStatsStreamCursorInput>>;
  where?: InputMaybe<PayrollDashboardStatsBoolExp>;
};


export type Subscription_RootPayrollDateByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootPayrollDateTypeByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootPayrollDateTypesArgs = {
  distinctOn?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};


export type Subscription_RootPayrollDateTypesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDateTypesOrderBy>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};


export type Subscription_RootPayrollDateTypesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollDateTypesStreamCursorInput>>;
  where?: InputMaybe<PayrollDateTypesBoolExp>;
};


export type Subscription_RootPayrollDatesArgs = {
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type Subscription_RootPayrollDatesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollDatesOrderBy>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type Subscription_RootPayrollDatesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollDatesStreamCursorInput>>;
  where?: InputMaybe<PayrollDatesBoolExp>;
};


export type Subscription_RootPayrollTriggersStatusArgs = {
  distinctOn?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type Subscription_RootPayrollTriggersStatusAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollTriggersStatusOrderBy>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type Subscription_RootPayrollTriggersStatusStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollTriggersStatusStreamCursorInput>>;
  where?: InputMaybe<PayrollTriggersStatusBoolExp>;
};


export type Subscription_RootPayrollVersionHistoryResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootPayrollVersionHistoryResultsArgs = {
  distinctOn?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type Subscription_RootPayrollVersionHistoryResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type Subscription_RootPayrollVersionHistoryResultsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollVersionHistoryResultsStreamCursorInput>>;
  where?: InputMaybe<PayrollVersionHistoryResultsBoolExp>;
};


export type Subscription_RootPayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootPayrollVersionResultsArgs = {
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type Subscription_RootPayrollVersionResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollVersionResultsOrderBy>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type Subscription_RootPayrollVersionResultsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollVersionResultsStreamCursorInput>>;
  where?: InputMaybe<PayrollVersionResultsBoolExp>;
};


export type Subscription_RootPayrollsArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


export type Subscription_RootPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PayrollsOrderBy>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


export type Subscription_RootPayrollsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PayrollsStreamCursorInput>>;
  where?: InputMaybe<PayrollsBoolExp>;
};


export type Subscription_RootPermissionAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootPermissionAuditLogsArgs = {
  distinctOn?: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where?: InputMaybe<PermissionAuditLogsBoolExp>;
};


export type Subscription_RootPermissionAuditLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionAuditLogsOrderBy>>;
  where?: InputMaybe<PermissionAuditLogsBoolExp>;
};


export type Subscription_RootPermissionAuditLogsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PermissionAuditLogsStreamCursorInput>>;
  where?: InputMaybe<PermissionAuditLogsBoolExp>;
};


export type Subscription_RootPermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootPermissionChangeByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootPermissionChangesArgs = {
  distinctOn?: InputMaybe<Array<PermissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionChangesOrderBy>>;
  where?: InputMaybe<PermissionChangesBoolExp>;
};


export type Subscription_RootPermissionChangesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionChangesOrderBy>>;
  where?: InputMaybe<PermissionChangesBoolExp>;
};


export type Subscription_RootPermissionChangesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PermissionChangesStreamCursorInput>>;
  where?: InputMaybe<PermissionChangesBoolExp>;
};


export type Subscription_RootPermissionOverrideByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootPermissionOverridesArgs = {
  distinctOn?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};


export type Subscription_RootPermissionOverridesAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionOverridesOrderBy>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};


export type Subscription_RootPermissionOverridesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PermissionOverridesStreamCursorInput>>;
  where?: InputMaybe<PermissionOverridesBoolExp>;
};


export type Subscription_RootPermissionUsageReportsArgs = {
  distinctOn?: InputMaybe<Array<PermissionUsageReportsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionUsageReportsOrderBy>>;
  where?: InputMaybe<PermissionUsageReportsBoolExp>;
};


export type Subscription_RootPermissionUsageReportsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionUsageReportsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionUsageReportsOrderBy>>;
  where?: InputMaybe<PermissionUsageReportsBoolExp>;
};


export type Subscription_RootPermissionUsageReportsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PermissionUsageReportsStreamCursorInput>>;
  where?: InputMaybe<PermissionUsageReportsBoolExp>;
};


export type Subscription_RootPermissionsArgs = {
  distinctOn?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};


export type Subscription_RootPermissionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<PermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionsOrderBy>>;
  where?: InputMaybe<PermissionsBoolExp>;
};


export type Subscription_RootPermissionsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<PermissionsStreamCursorInput>>;
  where?: InputMaybe<PermissionsBoolExp>;
};


export type Subscription_RootResourceByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootResourcesArgs = {
  distinctOn?: InputMaybe<Array<ResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ResourcesOrderBy>>;
  where?: InputMaybe<ResourcesBoolExp>;
};


export type Subscription_RootResourcesAggregateArgs = {
  distinctOn?: InputMaybe<Array<ResourcesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ResourcesOrderBy>>;
  where?: InputMaybe<ResourcesBoolExp>;
};


export type Subscription_RootResourcesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ResourcesStreamCursorInput>>;
  where?: InputMaybe<ResourcesBoolExp>;
};


export type Subscription_RootRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootRolePermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootRolePermissionsArgs = {
  distinctOn?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


export type Subscription_RootRolePermissionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<RolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolePermissionsOrderBy>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


export type Subscription_RootRolePermissionsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RolePermissionsStreamCursorInput>>;
  where?: InputMaybe<RolePermissionsBoolExp>;
};


export type Subscription_RootRolesArgs = {
  distinctOn?: InputMaybe<Array<RolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolesOrderBy>>;
  where?: InputMaybe<RolesBoolExp>;
};


export type Subscription_RootRolesAggregateArgs = {
  distinctOn?: InputMaybe<Array<RolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RolesOrderBy>>;
  where?: InputMaybe<RolesBoolExp>;
};


export type Subscription_RootRolesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RolesStreamCursorInput>>;
  where?: InputMaybe<RolesBoolExp>;
};


export type Subscription_RootSlowQueriesArgs = {
  distinctOn?: InputMaybe<Array<SlowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SlowQueriesOrderBy>>;
  where?: InputMaybe<SlowQueriesBoolExp>;
};


export type Subscription_RootSlowQueriesAggregateArgs = {
  distinctOn?: InputMaybe<Array<SlowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SlowQueriesOrderBy>>;
  where?: InputMaybe<SlowQueriesBoolExp>;
};


export type Subscription_RootSlowQueriesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<SlowQueriesStreamCursorInput>>;
  where?: InputMaybe<SlowQueriesBoolExp>;
};


export type Subscription_RootSlowQueryByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootUserAccessSummariesArgs = {
  distinctOn?: InputMaybe<Array<UserAccessSummariesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserAccessSummariesOrderBy>>;
  where?: InputMaybe<UserAccessSummariesBoolExp>;
};


export type Subscription_RootUserAccessSummariesAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserAccessSummariesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserAccessSummariesOrderBy>>;
  where?: InputMaybe<UserAccessSummariesBoolExp>;
};


export type Subscription_RootUserAccessSummariesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UserAccessSummariesStreamCursorInput>>;
  where?: InputMaybe<UserAccessSummariesBoolExp>;
};


export type Subscription_RootUserByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootUserInvitationByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootUserInvitationsArgs = {
  distinctOn?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserInvitationsOrderBy>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};


export type Subscription_RootUserInvitationsAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserInvitationsOrderBy>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};


export type Subscription_RootUserInvitationsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UserInvitationsStreamCursorInput>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};


export type Subscription_RootUserRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootUserRolesArgs = {
  distinctOn?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


export type Subscription_RootUserRolesAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


export type Subscription_RootUserRolesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UserRolesStreamCursorInput>>;
  where?: InputMaybe<UserRolesBoolExp>;
};


export type Subscription_RootUserSyncByIdArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootUsersArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type Subscription_RootUsersAggregateArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type Subscription_RootUsersRoleBackupStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UsersRoleBackupStreamCursorInput>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};


export type Subscription_RootUsersRoleBackupsArgs = {
  distinctOn?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};


export type Subscription_RootUsersRoleBackupsAggregateArgs = {
  distinctOn?: InputMaybe<Array<UsersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersRoleBackupOrderBy>>;
  where?: InputMaybe<UsersRoleBackupBoolExp>;
};


export type Subscription_RootUsersStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UsersStreamCursorInput>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type Subscription_RootUsersSyncArgs = {
  distinctOn?: InputMaybe<Array<AuthUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuthUsersSyncOrderBy>>;
  where?: InputMaybe<AuthUsersSyncBoolExp>;
};


export type Subscription_RootUsersSyncAggregateArgs = {
  distinctOn?: InputMaybe<Array<AuthUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AuthUsersSyncOrderBy>>;
  where?: InputMaybe<AuthUsersSyncBoolExp>;
};


export type Subscription_RootWorkScheduleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootWorkSchedulesArgs = {
  distinctOn?: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkSchedulesOrderBy>>;
  where?: InputMaybe<WorkSchedulesBoolExp>;
};


export type Subscription_RootWorkSchedulesAggregateArgs = {
  distinctOn?: InputMaybe<Array<WorkSchedulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkSchedulesOrderBy>>;
  where?: InputMaybe<WorkSchedulesBoolExp>;
};


export type Subscription_RootWorkSchedulesStreamArgs = {
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
  invitationStatus: Scalars['invitation_status_enum']['output'];
  invitedAt: Scalars['timestamptz']['output'];
  invitedBy: Scalars['uuid']['output'];
  /** An object relationship */
  invitedByUser?: Maybe<Users>;
  invitedRole: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  managerId?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  managerUser?: Maybe<Users>;
  revokeReason?: Maybe<Scalars['String']['output']>;
  revokedAt?: Maybe<Scalars['timestamptz']['output']>;
  revokedBy?: Maybe<Scalars['uuid']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['timestamptz']['output'];
  /** An object relationship */
  user?: Maybe<Users>;
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

export type UserInvitationsAggregateBoolExp = {
  count?: InputMaybe<UserInvitationsAggregateBoolExpCount>;
};

export type UserInvitationsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<UserInvitationsBoolExp>;
  predicate: IntComparisonExp;
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
  status?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
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
  status?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
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
  invitationStatus?: Maybe<Scalars['invitation_status_enum']['output']>;
  invitedAt?: Maybe<Scalars['timestamptz']['output']>;
  invitedBy?: Maybe<Scalars['uuid']['output']>;
  invitedRole?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  managerId?: Maybe<Scalars['uuid']['output']>;
  revokeReason?: Maybe<Scalars['String']['output']>;
  revokedAt?: Maybe<Scalars['timestamptz']['output']>;
  revokedBy?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
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
  invitationStatus?: Maybe<Scalars['invitation_status_enum']['output']>;
  invitedAt?: Maybe<Scalars['timestamptz']['output']>;
  invitedBy?: Maybe<Scalars['uuid']['output']>;
  invitedRole?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  managerId?: Maybe<Scalars['uuid']['output']>;
  revokeReason?: Maybe<Scalars['String']['output']>;
  revokedAt?: Maybe<Scalars['timestamptz']['output']>;
  revokedBy?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
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
  status?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
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
  /** Current user status - must be consistent with isActive field */
  status: Scalars['user_status_enum']['output'];
  /** Reason for the status change (for audit purposes) */
  statusChangeReason?: Maybe<Scalars['String']['output']>;
  /** Timestamp when status was last changed */
  statusChangedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** User ID who changed the status */
  statusChangedBy?: Maybe<Scalars['uuid']['output']>;
  /** An array relationship */
  targetedPermissionAudits: Array<PermissionAuditLogs>;
  /** An aggregate relationship */
  targetedPermissionAuditsAggregate: PermissionAuditLogsAggregate;
  /** Timestamp when the user was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  user?: Maybe<Users>;
  /** An array relationship */
  userInvitations: Array<UserInvitations>;
  /** An array relationship */
  userInvitationsAcceptedBy: Array<UserInvitations>;
  /** An aggregate relationship */
  userInvitationsAcceptedByAggregate: UserInvitationsAggregate;
  /** An aggregate relationship */
  userInvitationsAggregate: UserInvitationsAggregate;
  /** An array relationship */
  userInvitationsInvitedBy: Array<UserInvitations>;
  /** An aggregate relationship */
  userInvitationsInvitedByAggregate: UserInvitationsAggregate;
  /** An array relationship */
  userInvitationsMangerId: Array<UserInvitations>;
  /** An aggregate relationship */
  userInvitationsMangerIdAggregate: UserInvitationsAggregate;
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
  /** An array relationship */
  users: Array<Users>;
  /** An aggregate relationship */
  usersAggregate: UsersAggregate;
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
export type UsersUserInvitationsArgs = {
  distinctOn?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserInvitationsOrderBy>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserInvitationsAcceptedByArgs = {
  distinctOn?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserInvitationsOrderBy>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserInvitationsAcceptedByAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserInvitationsOrderBy>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserInvitationsAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserInvitationsOrderBy>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserInvitationsInvitedByArgs = {
  distinctOn?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserInvitationsOrderBy>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserInvitationsInvitedByAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserInvitationsOrderBy>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserInvitationsMangerIdArgs = {
  distinctOn?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserInvitationsOrderBy>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUserInvitationsMangerIdAggregateArgs = {
  distinctOn?: InputMaybe<Array<UserInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserInvitationsOrderBy>>;
  where?: InputMaybe<UserInvitationsBoolExp>;
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


/** columns and relationships of "users" */
export type UsersUsersArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


/** columns and relationships of "users" */
export type UsersUsersAggregateArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};

/** aggregated selection of "users" */
export type UsersAggregate = {
  __typename?: 'usersAggregate';
  aggregate?: Maybe<UsersAggregateFields>;
  nodes: Array<Users>;
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
  status?: InputMaybe<UserStatusEnumComparisonExp>;
  statusChangeReason?: InputMaybe<StringComparisonExp>;
  statusChangedAt?: InputMaybe<TimestamptzComparisonExp>;
  statusChangedBy?: InputMaybe<UuidComparisonExp>;
  targetedPermissionAudits?: InputMaybe<PermissionAuditLogsBoolExp>;
  targetedPermissionAuditsAggregate?: InputMaybe<PermissionAuditLogsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userInvitations?: InputMaybe<UserInvitationsBoolExp>;
  userInvitationsAcceptedBy?: InputMaybe<UserInvitationsBoolExp>;
  userInvitationsAcceptedByAggregate?: InputMaybe<UserInvitationsAggregateBoolExp>;
  userInvitationsAggregate?: InputMaybe<UserInvitationsAggregateBoolExp>;
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
  users?: InputMaybe<UsersBoolExp>;
  usersAggregate?: InputMaybe<UsersAggregateBoolExp>;
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
  /** Current user status - must be consistent with isActive field */
  status?: InputMaybe<Scalars['user_status_enum']['input']>;
  /** Reason for the status change (for audit purposes) */
  statusChangeReason?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when status was last changed */
  statusChangedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** User ID who changed the status */
  statusChangedBy?: InputMaybe<Scalars['uuid']['input']>;
  targetedPermissionAudits?: InputMaybe<PermissionAuditLogsArrRelInsertInput>;
  /** Timestamp when the user was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userInvitations?: InputMaybe<UserInvitationsArrRelInsertInput>;
  userInvitationsAcceptedBy?: InputMaybe<UserInvitationsArrRelInsertInput>;
  userInvitationsInvitedBy?: InputMaybe<UserInvitationsArrRelInsertInput>;
  userInvitationsMangerId?: InputMaybe<UserInvitationsArrRelInsertInput>;
  userLeaveRecords?: InputMaybe<LeaveArrRelInsertInput>;
  userPermissionAudits?: InputMaybe<PermissionAuditLogsArrRelInsertInput>;
  userPermissionOverrides?: InputMaybe<PermissionOverridesArrRelInsertInput>;
  userWorkSchedules?: InputMaybe<WorkSchedulesArrRelInsertInput>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars['String']['input']>;
  users?: InputMaybe<UsersArrRelInsertInput>;
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
  /** Current user status - must be consistent with isActive field */
  status?: Maybe<Scalars['user_status_enum']['output']>;
  /** Reason for the status change (for audit purposes) */
  statusChangeReason?: Maybe<Scalars['String']['output']>;
  /** Timestamp when status was last changed */
  statusChangedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** User ID who changed the status */
  statusChangedBy?: Maybe<Scalars['uuid']['output']>;
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
  /** Current user status - must be consistent with isActive field */
  status?: Maybe<Scalars['user_status_enum']['output']>;
  /** Reason for the status change (for audit purposes) */
  statusChangeReason?: Maybe<Scalars['String']['output']>;
  /** Timestamp when status was last changed */
  statusChangedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** User ID who changed the status */
  statusChangedBy?: Maybe<Scalars['uuid']['output']>;
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
  status?: InputMaybe<OrderBy>;
  statusChangeReason?: InputMaybe<OrderBy>;
  statusChangedAt?: InputMaybe<OrderBy>;
  statusChangedBy?: InputMaybe<OrderBy>;
  targetedPermissionAuditsAggregate?: InputMaybe<PermissionAuditLogsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userInvitationsAcceptedByAggregate?: InputMaybe<UserInvitationsAggregateOrderBy>;
  userInvitationsAggregate?: InputMaybe<UserInvitationsAggregateOrderBy>;
  userInvitationsInvitedByAggregate?: InputMaybe<UserInvitationsAggregateOrderBy>;
  userInvitationsMangerIdAggregate?: InputMaybe<UserInvitationsAggregateOrderBy>;
  userLeaveRecordsAggregate?: InputMaybe<LeaveAggregateOrderBy>;
  userPermissionAuditsAggregate?: InputMaybe<PermissionAuditLogsAggregateOrderBy>;
  userPermissionOverridesAggregate?: InputMaybe<PermissionOverridesAggregateOrderBy>;
  userWorkSchedulesAggregate?: InputMaybe<WorkSchedulesAggregateOrderBy>;
  username?: InputMaybe<OrderBy>;
  usersAggregate?: InputMaybe<UsersAggregateOrderBy>;
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

export type PayrollListItemFragment = { __typename?: 'payrolls', primaryConsultantUserId?: string | null, backupConsultantUserId?: string | null, managerUserId?: string | null, createdByUserId?: string | null, clientId: string, id: string, name: string, employeeCount?: number | null, status: any, payrollSystem?: string | null, processingTime: number, processingDaysBeforeEft: number, versionNumber?: number | null, createdAt?: string | null, updatedAt?: string | null, primaryConsultant?: { __typename?: 'users', id: string, name: string, email: string } | null, backupConsultant?: { __typename?: 'users', id: string, name: string, email: string } | null, manager?: { __typename?: 'users', id: string, name: string, email: string } | null, client: { __typename?: 'clients', id: string, name: string, active?: boolean | null } };

export type PayrollWithDatesFragment = { __typename?: 'payrolls', goLiveDate?: string | null, id: string, name: string, employeeCount?: number | null, status: any, payrollSystem?: string | null, processingTime: number, processingDaysBeforeEft: number, versionNumber?: number | null, createdAt?: string | null, updatedAt?: string | null, payrollDates: Array<{ __typename?: 'payrollDates', id: string, originalEftDate: string, adjustedEftDate: string, notes?: string | null }> };

export type PayrollFullDetailFragment = { __typename?: 'payrolls', dateTypeId: string, cycleId: string, dateValue?: number | null, versionReason?: string | null, supersededDate?: string | null, parentPayrollId?: string | null, goLiveDate?: string | null, clientId: string, id: string, name: string, employeeCount?: number | null, status: any, payrollSystem?: string | null, processingTime: number, processingDaysBeforeEft: number, versionNumber?: number | null, createdAt?: string | null, updatedAt?: string | null, parentPayroll?: { __typename?: 'payrolls', id: string, versionNumber?: number | null } | null, childPayrolls: Array<{ __typename?: 'payrolls', id: string, versionNumber?: number | null, versionReason?: string | null, createdAt?: string | null }>, primaryConsultant?: { __typename?: 'users', id: string, name: string, email: string } | null, backupConsultant?: { __typename?: 'users', id: string, name: string, email: string } | null, manager?: { __typename?: 'users', id: string, name: string, email: string } | null, payrollDates: Array<{ __typename?: 'payrollDates', id: string, originalEftDate: string, adjustedEftDate: string, notes?: string | null }>, client: { __typename?: 'clients', id: string, name: string, active?: boolean | null } };

export type NoteWithAuthorFragment = { __typename?: 'notes', id: string, content: string, isImportant?: boolean | null, createdAt?: any | null, entityId: string, entityType: string, authorUser?: { __typename?: 'users', id: string, name: string, email: string } | null };

export type PermissionBaseFragment = { __typename?: 'permissions', id: string, resourceId: string, description?: string | null, legacyPermissionName?: string | null, action: any };

export type RoleWithPermissionsFragment = { __typename?: 'roles', id: string, name: string, displayName: string, description?: string | null, isSystemRole: boolean, priority: number, assignedPermissions: Array<{ __typename?: 'rolePermissions', grantedPermission: { __typename?: 'permissions', id: string, resourceId: string, description?: string | null, legacyPermissionName?: string | null, action: any } }> };

export type AuditLogEntryFragment = { __typename?: 'auditLogs', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null };

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


export type GetDashboardStatsOptimizedQuery = { __typename?: 'query_root', clientsAggregate: { __typename?: 'clientsAggregate', aggregate?: { __typename?: 'clientsAggregateFields', count: number } | null }, totalPayrolls: { __typename?: 'payrollsAggregate', aggregate?: { __typename?: 'payrollsAggregateFields', count: number } | null }, activePayrolls: { __typename?: 'payrollsAggregate', aggregate?: { __typename?: 'payrollsAggregateFields', count: number } | null }, upcomingPayrolls: Array<{ __typename?: 'payrolls', id: string, name: string, status: any, client: { __typename?: 'clients', id: string, name: string } }> };

export type GetClientsDashboardStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetClientsDashboardStatsQuery = { __typename?: 'query_root', activeClientsCount: { __typename?: 'clientsAggregate', aggregate?: { __typename?: 'clientsAggregateFields', count: number } | null }, totalPayrollsCount: { __typename?: 'payrollsAggregate', aggregate?: { __typename?: 'payrollsAggregateFields', count: number } | null }, totalEmployeesSum: { __typename?: 'payrollsAggregate', aggregate?: { __typename?: 'payrollsAggregateFields', sum?: { __typename?: 'payrollsSumFields', employeeCount?: number | null } | null } | null }, clientsNeedingAttention: Array<{ __typename?: 'clients', id: string, name: string }> };

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


export type RecentActivitySubscription = { __typename?: 'subscription_root', auditLogs: Array<{ __typename?: 'auditLogs', id: string, userId?: string | null, userEmail?: string | null, userRole?: string | null, action: string, resourceType: string, resourceId?: string | null, eventTime: string, success?: boolean | null, errorMessage?: string | null, ipAddress?: any | null, userAgent?: string | null, requestId?: string | null, sessionId?: string | null, metadata?: any | null, oldValues?: any | null, newValues?: any | null, createdAt?: string | null }> };

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
export const PayrollListItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollWithClient"}},{"kind":"Field","name":{"kind":"Name","value":"primaryConsultantUserId"}},{"kind":"Field","name":{"kind":"Name","value":"backupConsultantUserId"}},{"kind":"Field","name":{"kind":"Name","value":"managerUserId"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"primaryConsultant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backupConsultant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"manager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"payrollSystem"}},{"kind":"Field","name":{"kind":"Name","value":"processingTime"}},{"kind":"Field","name":{"kind":"Name","value":"processingDaysBeforeEft"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollWithClient"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollBase"}},{"kind":"Field","name":{"kind":"Name","value":"clientId"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<PayrollListItemFragment, unknown>;
export const PayrollWithDatesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollWithDates"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollBase"}},{"kind":"Field","name":{"kind":"Name","value":"goLiveDate"}},{"kind":"Field","name":{"kind":"Name","value":"payrollDates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"originalEftDate"},"value":{"kind":"EnumValue","value":"ASC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"originalEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"adjustedEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"payrollSystem"}},{"kind":"Field","name":{"kind":"Name","value":"processingTime"}},{"kind":"Field","name":{"kind":"Name","value":"processingDaysBeforeEft"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<PayrollWithDatesFragment, unknown>;
export const PayrollFullDetailFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollFullDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollWithDates"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollWithClient"}},{"kind":"Field","name":{"kind":"Name","value":"dateTypeId"}},{"kind":"Field","name":{"kind":"Name","value":"cycleId"}},{"kind":"Field","name":{"kind":"Name","value":"dateValue"}},{"kind":"Field","name":{"kind":"Name","value":"versionReason"}},{"kind":"Field","name":{"kind":"Name","value":"supersededDate"}},{"kind":"Field","name":{"kind":"Name","value":"parentPayrollId"}},{"kind":"Field","name":{"kind":"Name","value":"parentPayroll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"childPayrolls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"versionNumber"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"versionReason"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryConsultant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backupConsultant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"manager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"payrollSystem"}},{"kind":"Field","name":{"kind":"Name","value":"processingTime"}},{"kind":"Field","name":{"kind":"Name","value":"processingDaysBeforeEft"}},{"kind":"Field","name":{"kind":"Name","value":"versionNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollWithDates"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollBase"}},{"kind":"Field","name":{"kind":"Name","value":"goLiveDate"}},{"kind":"Field","name":{"kind":"Name","value":"payrollDates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"originalEftDate"},"value":{"kind":"EnumValue","value":"ASC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"originalEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"adjustedEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollWithClient"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollBase"}},{"kind":"Field","name":{"kind":"Name","value":"clientId"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<PayrollFullDetailFragment, unknown>;
export const NoteWithAuthorFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteWithAuthor"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"notes"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"isImportant"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"authorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<NoteWithAuthorFragment, unknown>;
export const PermissionBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"permissions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"legacyPermissionName"}},{"kind":"Field","name":{"kind":"Name","value":"action"}}]}}]} as unknown as DocumentNode<PermissionBaseFragment, unknown>;
export const RoleWithPermissionsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleWithPermissions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"roles"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isSystemRole"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"assignedPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"grantedPermission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PermissionBase"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"permissions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"legacyPermissionName"}},{"kind":"Field","name":{"kind":"Name","value":"action"}}]}}]} as unknown as DocumentNode<RoleWithPermissionsFragment, unknown>;
export const AuditLogEntryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<AuditLogEntryFragment, unknown>;
export const AuthEventFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"authEvents"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<AuthEventFragment, unknown>;
export const DataAccessLogFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataAccessLog"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"dataAccessLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}},{"kind":"Field","name":{"kind":"Name","value":"fieldsAccessed"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<DataAccessLogFragment, unknown>;
export const PermissionChangeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionChange"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"permissionChanges"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"changeType"}},{"kind":"Field","name":{"kind":"Name","value":"permissionType"}},{"kind":"Field","name":{"kind":"Name","value":"oldPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"newPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}}]}}]} as unknown as DocumentNode<PermissionChangeFragment, unknown>;
export const PayrollDateInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollDateInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrollDates"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"originalEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"adjustedEftDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<PayrollDateInfoFragment, unknown>;
export const PermissionOverrideInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionOverrideInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"permissionOverrides"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"granted"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<PermissionOverrideInfoFragment, unknown>;
export const LogAuditEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogAuditEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogsInsertInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"insertAuditLogsOne"},"name":{"kind":"Name","value":"insertAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}}]}}]}}]} as unknown as DocumentNode<LogAuditEventMutation, LogAuditEventMutationVariables>;
export const RefreshDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]} as unknown as DocumentNode<RefreshDataMutation, RefreshDataMutationVariables>;
export const GetDashboardMetricsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDashboardMetrics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"active"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"activePayrollsAggregate"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"Completed","block":false},{"kind":"StringValue","value":"Failed","block":false}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"totalEmployeesAggregate"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sum"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"upcomingPayrolls"},"name":{"kind":"Name","value":"payrolls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"Completed","block":false},{"kind":"StringValue","value":"Failed","block":false},{"kind":"StringValue","value":"Cancelled","block":false}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientMinimal"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<GetDashboardMetricsQuery, GetDashboardMetricsQueryVariables>;
export const GetDashboardStatsOptimizedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDashboardStatsOptimized"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientsAggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"totalPayrolls"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"activePayrolls"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"Active","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"upcomingPayrolls"},"name":{"kind":"Name","value":"payrolls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"Active","block":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"updatedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetDashboardStatsOptimizedQuery, GetDashboardStatsOptimizedQueryVariables>;
export const GetClientsDashboardStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetClientsDashboardStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"activeClientsCount"},"name":{"kind":"Name","value":"clientsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"active"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"totalPayrollsCount"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"totalEmployeesSum"},"name":{"kind":"Name","value":"payrollsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sum"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"clientsNeedingAttention"},"name":{"kind":"Name","value":"clients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"active"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_not"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"payrolls"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<GetClientsDashboardStatsQuery, GetClientsDashboardStatsQueryVariables>;
export const GetCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"userById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserProfile"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserCoreShared"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserCoreShared"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserWithRole"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBasic"}},{"kind":"Field","name":{"kind":"Name","value":"assignedRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignedRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserProfile"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserWithRole"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"clerkUserId"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"isStaff"}},{"kind":"Field","name":{"kind":"Name","value":"managerId"}},{"kind":"Field","name":{"kind":"Name","value":"deactivatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deactivatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"managerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}}]}}]} as unknown as DocumentNode<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetUsersForDropdownDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsersForDropdown"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"user_role"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isActive"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"role"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"ASC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<GetUsersForDropdownQuery, GetUsersForDropdownQueryVariables>;
export const GetSystemHealthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemHealth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"databaseHealth"},"name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"recentActivity"},"name":{"kind":"Name","value":"auditLogsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"StringValue","value":"now() - interval '1 hour'","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetSystemHealthQuery, GetSystemHealthQueryVariables>;
export const GlobalSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GlobalSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"contactEmail"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientMinimal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMinimal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payrolls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"client"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"supersededDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_isNull"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PayrollMinimal"}},{"kind":"Field","name":{"kind":"Name","value":"client"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ClientMinimal"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClientMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"clients"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PayrollMinimal"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"payrolls"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"employeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<GlobalSearchQuery, GlobalSearchQueryVariables>;
export const RecentActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"RecentActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"StringValue","value":"now() - interval '5 minutes'","block":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuditLogEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuditLogEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"auditLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<RecentActivitySubscription, RecentActivitySubscriptionVariables>;
export const AuthenticationEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"AuthenticationEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"StringValue","value":"now() - interval '10 minutes'","block":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventTime"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthEvent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"authEvents"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<AuthenticationEventsSubscription, AuthenticationEventsSubscriptionVariables>;
export const SensitiveDataAccessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"SensitiveDataAccess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataAccessLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resourceType"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceTypes"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"StringValue","value":"now() - interval '10 minutes'","block":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"accessedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DataAccessLog"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DataAccessLog"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"dataAccessLogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"resourceId"}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dataClassification"}},{"kind":"Field","name":{"kind":"Name","value":"fieldsAccessed"}},{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<SensitiveDataAccessSubscription, SensitiveDataAccessSubscriptionVariables>;
export const PermissionChangeStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"PermissionChangeStream"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionChanges"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"changedAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PermissionChange"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PermissionChange"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"permissionChanges"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetUserId"}},{"kind":"Field","name":{"kind":"Name","value":"targetRoleId"}},{"kind":"Field","name":{"kind":"Name","value":"changeType"}},{"kind":"Field","name":{"kind":"Name","value":"permissionType"}},{"kind":"Field","name":{"kind":"Name","value":"oldPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"newPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByUserId"}}]}}]} as unknown as DocumentNode<PermissionChangeStreamSubscription, PermissionChangeStreamSubscriptionVariables>;